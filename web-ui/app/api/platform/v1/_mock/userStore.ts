export type DemoUserStatus = "INVITED" | "ACTIVE";

export const demoUsers: Array<{
  id: string;
  email: string;
  name: string;
  tenantId: string;
  tenantName: string;
  roles: string[];
  facilityIds?: string[];
  status: DemoUserStatus;
  password: string;
  createdAt: string;
}> = [
  {
    id: "usr-platform-1",
    email: "platform.admin@demo.local",
    name: "Platform Admin",
    tenantId: "platform",
    tenantName: "Platform",
    roles: ["PLATFORM_ADMIN"],
    status: "ACTIVE",
    password: "Pass@123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-tenant-a-admin",
    email: "tenant.admin@a.local",
    name: "Tenant A Admin",
    tenantId: "tenant-a",
    tenantName: "Tenant A Health",
    roles: ["TENANT_ADMIN"],
    status: "ACTIVE",
    password: "Pass@123",
    createdAt: new Date().toISOString(),
  },
];

export const tenantDirectory: Record<string, string> = {
  platform: "Platform",
  "tenant-a": "Tenant A Health",
  "tenant-b": "Tenant B Care",
  "tenant-c": "Tenant C Clinic",
};

export function getTenantName(tenantId: string): string {
  return tenantDirectory[tenantId] || tenantId;
}

export const auditStore: Array<{
  id: string;
  event: "USER_INVITED" | "USER_ACTIVATED" | "USER_INVITE_EXPIRED";
  actor: string;
  tenantId: string;
  targetEmail: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}> = [];

export function pushAuditEvent(event: "USER_INVITED" | "USER_ACTIVATED" | "USER_INVITE_EXPIRED", payload: {
  actor: string;
  tenantId: string;
  targetEmail: string;
  metadata?: Record<string, unknown>;
}) {
  auditStore.push({
    id: `audit-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    event,
    actor: payload.actor,
    tenantId: payload.tenantId,
    targetEmail: payload.targetEmail,
    createdAt: new Date().toISOString(),
    metadata: payload.metadata,
  });
}
