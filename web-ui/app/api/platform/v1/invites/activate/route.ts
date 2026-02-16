import { bad, ok } from "../../emergency/_lib/utils";
import { readValidInvite } from "../../_lib/invites";
import { demoUsers, pushAuditEvent } from "../../_mock/userStore";

export async function POST(req: Request) {
  const body = await req.json();
  const token = String(body?.token || "").trim();
  const name = String(body?.name || "").trim();
  const password = String(body?.password || "").trim();

  if (!token || !name || !password) return bad("token, name, password are required");

  const result = readValidInvite(token);
  if (!result.ok) return bad(result.reason, 400);

  const invite = result.invite;

  demoUsers.push({
    id: `usr-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    email: invite.email,
    name,
    tenantId: invite.tenantId,
    tenantName: invite.tenantName,
    roles: invite.roles,
    facilityIds: invite.facilityIds,
    status: "ACTIVE",
    password,
    createdAt: new Date().toISOString(),
  });

  invite.status = "ACTIVATED";
  pushAuditEvent("USER_ACTIVATED", {
    actor: invite.email,
    tenantId: invite.tenantId,
    targetEmail: invite.email,
    metadata: { inviteId: invite.id },
  });

  return ok({ activated: true }, "Account activated");
}
