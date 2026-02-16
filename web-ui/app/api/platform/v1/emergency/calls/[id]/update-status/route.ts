import { applyStatusTransition, bad, getRequestScope, ok } from "../../../_lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const tenantId = getRequestScope(req);
  const body = await req.json();
  const next = body.status;
  if (!next) return bad("status is required");

  const result = applyStatusTransition(params.id, tenantId, next);
  if (!result.ok) return bad(result.message || "Transition failed");

  return ok({ id: params.id, status: next }, "Status updated");
}
