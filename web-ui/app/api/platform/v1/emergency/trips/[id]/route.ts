import { ambulanceTripStore, emergencyCallStore } from "../../../_mock/ambulanceCommandStore";
import { bad, getRequestScope, ok } from "../../_lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const tenantId = getRequestScope(req);
  const trip = ambulanceTripStore.find((x) => x.id === params.id && x.tenantId === tenantId);
  if (!trip) return bad("Trip not found", 404);
  const call = emergencyCallStore.find((x) => x.id === trip.emergencyCallId && x.tenantId === tenantId);
  return ok({ ...trip, emergencyCall: call });
}
