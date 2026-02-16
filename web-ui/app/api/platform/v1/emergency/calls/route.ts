import { emergencyCallStore } from "../../_mock/ambulanceCommandStore";
import { byScope, getRequestScope, ok, bad } from "../_lib/utils";

export async function POST(req: Request) {
  const tenantId = getRequestScope(req);
  const body = await req.json();
  const call = {
    id: `ec-${Date.now()}`,
    tenantId,
    callerName: body.callerName,
    phone: body.phone,
    pickupLocation: body.pickupLocation,
    conditionSummary: body.conditionSummary,
    priority: body.priority ?? "MEDIUM",
    status: "RECEIVED" as const,
    timeline: [{ ts: new Date().toISOString(), action: "RECEIVED", note: "Emergency call logged" }],
  };
  emergencyCallStore.push(call);
  return ok(call, "Emergency call created");
}

export async function GET(req: Request) {
  const tenantId = getRequestScope(req);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  let scoped = byScope(emergencyCallStore, tenantId);
  if (status) scoped = scoped.filter((x) => x.status === status);
  if (!scoped) return bad("No calls found", 404);
  return ok(scoped);
}
