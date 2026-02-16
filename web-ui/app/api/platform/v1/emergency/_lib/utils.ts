import {
  ambulanceFleetStore,
  ambulanceTripStore,
  driverStore,
  emergencyCallStore,
  notificationStore,
  patientPreAdmissionStore,
  preAdmissionStore,
  type EmergencyStatus,
} from "../../_mock/ambulanceCommandStore";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export function ok<T>(data: T, message = "OK"): Response {
  return Response.json({ success: true, message, data } satisfies ApiResponse<T>);
}

export function bad(message: string, status = 400): Response {
  return Response.json({ success: false, message } satisfies ApiResponse<never>, { status });
}

export function getRequestScope(req: Request): string {
  return req.headers.get("x-tenant-id") || "tenant-a";
}

export function byScope<T extends { tenantId: string }>(items: T[], tenantId: string): T[] {
  return items.filter((item) => item.tenantId === tenantId);
}

export function notify(
  tenantId: string,
  channel: "DRIVER" | "HOSPITAL_ADMIN" | "ER_DESK" | "DOCTOR",
  message: string,
): void {
  notificationStore.push({
    id: `note-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    tenantId,
    channel,
    message,
    createdAt: new Date().toISOString(),
  });
}

export function applyStatusTransition(callId: string, tenantId: string, next: EmergencyStatus): { ok: boolean; message?: string } {
  const call = emergencyCallStore.find((c) => c.id === callId && c.tenantId === tenantId);
  if (!call) return { ok: false, message: "Emergency call not found" };

  const allowed: Record<EmergencyStatus, EmergencyStatus[]> = {
    RECEIVED: ["DISPATCHED", "CANCELLED"],
    DISPATCHED: ["EN_ROUTE", "CANCELLED"],
    EN_ROUTE: ["ARRIVED", "CANCELLED"],
    ARRIVED: ["COMPLETED", "CANCELLED"],
    COMPLETED: ["CANCELLED"],
    CANCELLED: [],
  };

  if (!allowed[call.status].includes(next)) {
    return { ok: false, message: `Invalid transition ${call.status} -> ${next}` };
  }
  if (next === "COMPLETED" && call.status !== "ARRIVED") {
    return { ok: false, message: "Cannot mark COMPLETED unless ARRIVED" };
  }

  call.status = next;
  call.timeline.push({ ts: new Date().toISOString(), action: next });

  const trip = ambulanceTripStore.find((t) => t.emergencyCallId === call.id && t.tenantId === tenantId);
  if (trip) {
    if (next === "EN_ROUTE") {
      trip.startTime = trip.startTime || new Date().toISOString();
      notify(tenantId, "HOSPITAL_ADMIN", `Emergency ${call.id} is now EN_ROUTE.`);
    }
    if (next === "ARRIVED") {
      trip.arrivalTime = new Date().toISOString();
      notify(tenantId, "ER_DESK", `Emergency ${call.id} arrived at patient location.`);
      if (!call.patientId) {
        const patientId = `pt-${Date.now()}`;
        call.patientId = patientId;
        patientPreAdmissionStore.push({
          id: patientId,
          tenantId,
          name: call.callerName,
          source: "AMBULANCE",
          createdAt: new Date().toISOString(),
        });
        preAdmissionStore.push({
          id: `preadm-${Date.now()}`,
          tenantId,
          patientId,
          emergencyCallId: call.id,
          createdAt: new Date().toISOString(),
          status: "PENDING_ER",
        });
      }
    }
    if (next === "COMPLETED") {
      trip.hospitalArrivalTime = new Date().toISOString();
      const amb = ambulanceFleetStore.find((a) => a.id === trip.ambulanceId);
      if (amb) {
        amb.status = "AVAILABLE";
        amb.currentDriverId = undefined;
      }
      const drv = driverStore.find((d) => d.id === trip.driverId);
      if (drv) drv.status = "AVAILABLE";
    }
    if (next === "CANCELLED") {
      const amb = ambulanceFleetStore.find((a) => a.id === call.assignedAmbulanceId);
      if (amb) amb.status = "AVAILABLE";
      const drv = driverStore.find((d) => d.id === call.assignedDriverId);
      if (drv) drv.status = "AVAILABLE";
    }
  }

  return { ok: true };
}
