import { bad, ok } from "../../emergency/_lib/utils";
import { connectPartner, isPlatformAdmin, requestRole } from "../_lib";

export async function POST(req: Request) {
  const role = requestRole(req);
  if (!isPlatformAdmin(role)) return bad("Only platform admin can connect providers", 403);

  const body = await req.json();
  const result = connectPartner(body.partnerId, body.hospitalTenantId, body.externalPartners);
  if (!result.ok) return bad(result.message, result.status);

  return ok(result.partner, result.message);
}
