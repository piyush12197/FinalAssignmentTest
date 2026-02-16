import { ambulanceTripStore, emergencyCallStore } from "../../../../_mock/ambulanceCommandStore";
import { bad, getRequestScope, notify, ok } from "../../../_lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const tenantId = getRequestScope(req);
  const body = await req.json();

  const trip = ambulanceTripStore.find((x) => x.id === params.id && x.tenantId === tenantId);
  if (!trip) return bad("Trip not found", 404);

  const call = emergencyCallStore.find((x) => x.id === trip.emergencyCallId && x.tenantId === tenantId);
  if (!call) return bad("Emergency call not found", 404);
  if (call.status !== "EN_ROUTE") return bad("Vitals allowed only if EN_ROUTE");

  const entry = {
    ts: new Date().toISOString(),
    pulse: body.pulse,
    bp: body.bp,
    spo2: body.spo2,
    note: body.note,
  };
  trip.vitalsDuringTransit.push(entry);

  if ((entry.spo2 && entry.spo2 < 85) || (entry.pulse && entry.pulse > 130)) {
    notify(tenantId, "DOCTOR", `Critical vitals in trip ${trip.id}: spo2=${entry.spo2 ?? "n/a"}, pulse=${entry.pulse ?? "n/a"}`);
  }

  return ok(entry, "Vitals captured");
}
