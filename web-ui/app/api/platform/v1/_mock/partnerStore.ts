export type PartnerType = "LAB_PROVIDER" | "PHARMACY_PROVIDER" | "AMBULANCE_PROVIDER" | "BLOODBANK_PROVIDER";
export type PartnerOrderType = "LAB" | "RADIOLOGY" | "PHARMACY" | "AMBULANCE";
export type PartnerOrderStatus = "SENT" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

export const partnerOrganizations: Array<{
  id: string;
  name: string;
  type: PartnerType;
  tenantId: string;
  connectedHospitals: string[];
  status: "ACTIVE" | "INACTIVE";
}> = [
  {
    id: "partner-lab-1",
    name: "Precision External Labs",
    type: "LAB_PROVIDER",
    tenantId: "provider-lab-tenant",
    connectedHospitals: ["tenant-a", "tenant-b"],
    status: "ACTIVE",
  },
  {
    id: "partner-pharm-1",
    name: "Citywide MedSupply",
    type: "PHARMACY_PROVIDER",
    tenantId: "provider-pharmacy-tenant",
    connectedHospitals: ["tenant-a", "tenant-b"],
    status: "ACTIVE",
  },
  {
    id: "partner-amb-1",
    name: "RapidCare Ambulance Ops",
    type: "AMBULANCE_PROVIDER",
    tenantId: "provider-ambulance-tenant",
    connectedHospitals: ["tenant-a", "tenant-c"],
    status: "ACTIVE",
  },
  {
    id: "partner-blood-1",
    name: "Future Blood Network",
    type: "BLOODBANK_PROVIDER",
    tenantId: "provider-bloodbank-tenant",
    connectedHospitals: ["tenant-b"],
    status: "INACTIVE",
  },
];

export const partnerOrderStore: Array<{
  id: string;
  sourceTenantId: string;
  providerTenantId: string;
  type: PartnerOrderType;
  referenceId: string;
  status: PartnerOrderStatus;
  createdAt: string;
  timeline: Array<{ ts: string; action: string; note?: string }>;
}> = [];

export const externalRoutingConfigStore: Array<{
  hospitalTenantId: string;
  externalPartners: boolean;
}> = [
  { hospitalTenantId: "tenant-a", externalPartners: true },
  { hospitalTenantId: "tenant-b", externalPartners: true },
  { hospitalTenantId: "tenant-c", externalPartners: false },
];

const providerTypeForOrder: Record<PartnerOrderType, PartnerType> = {
  LAB: "LAB_PROVIDER",
  RADIOLOGY: "LAB_PROVIDER",
  PHARMACY: "PHARMACY_PROVIDER",
  AMBULANCE: "AMBULANCE_PROVIDER",
};

export function isExternalRoutingEnabled(hospitalTenantId: string): boolean {
  return externalRoutingConfigStore.find((cfg) => cfg.hospitalTenantId === hospitalTenantId)?.externalPartners ?? false;
}

export function pickPartnerForOrder(sourceTenantId: string, orderType: PartnerOrderType) {
  return partnerOrganizations.find(
    (partner) =>
      partner.status === "ACTIVE" &&
      partner.type === providerTypeForOrder[orderType] &&
      partner.connectedHospitals.includes(sourceTenantId),
  );
}

export function routeOrderToPartner(sourceTenantId: string, orderType: PartnerOrderType, referenceId: string) {
  if (!isExternalRoutingEnabled(sourceTenantId)) return null;
  const partner = pickPartnerForOrder(sourceTenantId, orderType);
  if (!partner) return null;

  const order = {
    id: `pord-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    sourceTenantId,
    providerTenantId: partner.tenantId,
    type: orderType,
    referenceId,
    status: "SENT" as const,
    createdAt: new Date().toISOString(),
    timeline: [{ ts: new Date().toISOString(), action: "SENT", note: `Forwarded to ${partner.name}` }],
  };

  partnerOrderStore.push(order);
  return { order, partner };
}

export function canTransitionPartnerOrder(current: PartnerOrderStatus, next: PartnerOrderStatus): boolean {
  const allowed: Record<PartnerOrderStatus, PartnerOrderStatus[]> = {
    SENT: ["ACCEPTED", "REJECTED"],
    ACCEPTED: ["IN_PROGRESS", "REJECTED"],
    IN_PROGRESS: ["COMPLETED", "REJECTED"],
    COMPLETED: [],
    REJECTED: [],
  };
  return allowed[current].includes(next);
}
