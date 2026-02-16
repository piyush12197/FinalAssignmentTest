export const invitesStore: Array<{
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  tenantName: string;
  facilityIds?: string[];
  invitedBy: string;
  token: string;
  status: "PENDING" | "ACTIVATED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}> = [];

export function generateToken(): string {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export function isExpired(invite: { expiresAt: string }): boolean {
  return Date.now() > new Date(invite.expiresAt).getTime();
}
