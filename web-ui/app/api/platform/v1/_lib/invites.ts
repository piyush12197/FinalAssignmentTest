import { getRequestScope } from "../emergency/_lib/utils";
import { generateToken, invitesStore, isExpired } from "../_mock/inviteStore";
import { demoUsers, getTenantName, pushAuditEvent } from "../_mock/userStore";

export function requestRole(req: Request): string {
  return req.headers.get("x-role") || "TENANT_ADMIN";
}

export function requestActor(req: Request): string {
  return req.headers.get("x-user-email") || "system@demo.local";
}

export function validateRolesForTenantInvite(roles: string[]): string | null {
  if (roles.includes("PLATFORM_ADMIN")) return "Tenant invites cannot assign PLATFORM_ADMIN";
  return null;
}

export function hasDuplicateActiveEmail(email: string): boolean {
  return demoUsers.some((user) => user.email.toLowerCase() === email.toLowerCase() && user.status === "ACTIVE");
}

export function listInvitesByTenant(tenantId: string) {
  return invitesStore.filter((invite) => invite.tenantId === tenantId);
}

export function createInvite(input: {
  email: string;
  roles: string[];
  tenantId: string;
  facilityIds?: string[];
  invitedBy: string;
}) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

  const invite = {
    id: `inv-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    email: input.email,
    roles: input.roles,
    tenantId: input.tenantId,
    tenantName: getTenantName(input.tenantId),
    facilityIds: input.facilityIds?.length ? input.facilityIds : undefined,
    invitedBy: input.invitedBy,
    token: generateToken(),
    status: "PENDING" as const,
    createdAt: now.toISOString(),
    expiresAt,
  };

  invitesStore.push(invite);
  pushAuditEvent("USER_INVITED", {
    actor: input.invitedBy,
    tenantId: input.tenantId,
    targetEmail: input.email,
    metadata: { roles: input.roles, facilityIds: input.facilityIds },
  });

  return invite;
}

export function readValidInvite(token: string) {
  const invite = invitesStore.find((item) => item.token === token);
  if (!invite) return { ok: false as const, reason: "Invite not found" };

  if (invite.status === "ACTIVATED") {
    return { ok: false as const, reason: "Invite already activated" };
  }

  if (invite.status === "EXPIRED" || isExpired(invite)) {
    if (invite.status !== "EXPIRED") {
      invite.status = "EXPIRED";
      pushAuditEvent("USER_INVITE_EXPIRED", {
        actor: "system@demo.local",
        tenantId: invite.tenantId,
        targetEmail: invite.email,
      });
    }
    return { ok: false as const, reason: "Invite expired" };
  }

  return { ok: true as const, invite };
}

export function tenantIdFromRequest(req: Request): string {
  return getRequestScope(req);
}
