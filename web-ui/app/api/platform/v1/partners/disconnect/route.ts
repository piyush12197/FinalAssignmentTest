import { bad, ok } from "../../emergency/_lib/utils";
import { disconnectPartner, isPlatformAdmin, requestRole } from "../_lib";

export async function POST(req: Request) {
  const role = requestRole(req);
  if (!isPlatformAdmin(role)) return bad("Only platform admin can disconnect providers", 403);

  const body = await req.json();
  const result = disconnectPartner(body.partnerId, body.hospitalTenantId);
  if (!result.ok) return bad(result.message, result.status);

  return ok(result.partner, result.message);
}
