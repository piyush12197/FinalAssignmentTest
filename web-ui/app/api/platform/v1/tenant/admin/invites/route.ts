import { bad, ok } from "../../../emergency/_lib/utils";
import {
  createInvite,
  hasDuplicateActiveEmail,
  listInvitesByTenant,
  requestActor,
  requestRole,
  tenantIdFromRequest,
  validateRolesForTenantInvite,
} from "../../../_lib/invites";

export async function GET(req: Request) {
  if (requestRole(req) !== "TENANT_ADMIN") return bad("Forbidden", 403);
  const tenantId = tenantIdFromRequest(req);
  return ok(listInvitesByTenant(tenantId), "Invites fetched");
}

export async function POST(req: Request) {
  if (requestRole(req) !== "TENANT_ADMIN") return bad("Forbidden", 403);

  const body = await req.json();
  const email = String(body?.email || "").trim().toLowerCase();
  const roles = Array.isArray(body?.roles) ? body.roles.map(String) : [];
  const facilityIds = Array.isArray(body?.facilityIds) ? body.facilityIds.map(String) : undefined;
  const tenantId = tenantIdFromRequest(req);

  if (!email || roles.length === 0) return bad("email and roles are required");
  const invalidRolesMessage = validateRolesForTenantInvite(roles);
  if (invalidRolesMessage) return bad(invalidRolesMessage, 403);
  if (hasDuplicateActiveEmail(email)) return bad("Active user with this email already exists", 409);

  const invite = createInvite({ email, roles, tenantId, facilityIds, invitedBy: requestActor(req) });
  return ok(
    {
      invite,
      activationLink: `/activate?token=${invite.token}`,
    },
    "Invite created",
  );
}
