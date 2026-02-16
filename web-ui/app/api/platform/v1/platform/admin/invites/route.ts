import { bad, ok } from "../../../emergency/_lib/utils";
import { createInvite, hasDuplicateActiveEmail, requestActor, requestRole } from "../../../_lib/invites";
import { invitesStore } from "../../../_mock/inviteStore";

export async function GET(req: Request) {
  if (requestRole(req) !== "PLATFORM_ADMIN") return bad("Forbidden", 403);
  return ok(invitesStore, "Invites fetched");
}

export async function POST(req: Request) {
  if (requestRole(req) !== "PLATFORM_ADMIN") return bad("Forbidden", 403);

  const body = await req.json();
  const email = String(body?.email || "").trim().toLowerCase();
  const roles = Array.isArray(body?.roles) ? body.roles.map(String) : [];
  const tenantId = String(body?.tenantId || "").trim();
  const facilityIds = Array.isArray(body?.facilityIds) ? body.facilityIds.map(String) : undefined;

  if (!email || !tenantId || roles.length === 0) return bad("email, roles, tenantId are required");
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
