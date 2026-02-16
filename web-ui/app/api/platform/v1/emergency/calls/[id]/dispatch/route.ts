import { ambulanceFleetStore, ambulanceTripStore, driverStore, emergencyCallStore } from "../../../../_mock/ambulanceCommandStore";
import { getRequestScope, notify, ok, bad } from "../../../_lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const tenantId = getRequestScope(req);
  const body = await req.json();

  const call = emergencyCallStore.find((x) => x.id === params.id && x.tenantId === tenantId);
  if (!call) return bad("Emergency call not found", 404);

  const ambulance = ambulanceFleetStore.find((x) => x.id === body.ambulanceId && x.tenantId === tenantId);
  if (!ambulance || ambulance.status !== "AVAILABLE") return bad("Ambulance unavailable");

  const driver = driverStore.find((x) => x.id === body.driverId && x.tenantId === tenantId);
  if (!driver || driver.status !== "AVAILABLE") return bad("Driver unavailable");

  if (ambulanceTripStore.some((trip) => trip.driverId === body.driverId && trip.tenantId === tenantId && !trip.hospitalArrivalTime)) {
    return bad("Driver already has an active trip");
  }
  if (ambulanceTripStore.some((trip) => trip.ambulanceId === body.ambulanceId && trip.tenantId === tenantId && !trip.hospitalArrivalTime)) {
    return bad("Ambulance already dispatched");
  }

  call.assignedAmbulanceId = ambulance.id;
  call.assignedDriverId = driver.id;
  call.status = "DISPATCHED";
  call.timeline.push({ ts: new Date().toISOString(), action: "DISPATCHED", note: `Assigned ${ambulance.vehicleNumber}` });

  ambulance.status = "DISPATCHED";
  ambulance.currentDriverId = driver.id;
  driver.status = "ON_TRIP";

  const trip = {
    id: `trip-${Date.now()}`,
    tenantId,
    emergencyCallId: call.id,
    ambulanceId: ambulance.id,
    driverId: driver.id,
    vitalsDuringTransit: [],
  };
  ambulanceTripStore.push(trip);

  notify(tenantId, "DRIVER", `Dispatch assigned for emergency call ${call.id}.`);
  return ok({ call, trip }, "Dispatch successful");
}
