import { bad, ok } from "../../../../emergency/_lib/utils";
import { updatePartnerOrderStatus } from "../../../_lib";
import type { PartnerOrderStatus } from "../../../../_mock/partnerStore";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const nextStatus = body.status as PartnerOrderStatus;
  if (!nextStatus) return bad("status is required");

  const result = updatePartnerOrderStatus(params.id, nextStatus, req, body.note);
  if (!result.ok) return bad(result.message, result.status);

  return ok(result.order, result.message);
}
