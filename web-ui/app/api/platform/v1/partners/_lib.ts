import { byScope, getRequestScope } from "../../emergency/_lib/utils";
import { canTransitionPartnerOrder, externalRoutingConfigStore, partnerOrderStore, partnerOrganizations, type PartnerOrderStatus } from "../_mock/partnerStore";

export function requestRole(req: Request): string {
  return req.headers.get("x-role") || "HOSPITAL_ADMIN";
}

export function isPlatformAdmin(role: string): boolean {
  return role === "PLATFORM_ADMIN";
}

export function isProviderRole(role: string): boolean {
  return role === "PROVIDER_ADMIN" || role === "PROVIDER_STAFF";
}

export function getVisiblePartners(req: Request) {
  const tenantId = getRequestScope(req);
  const role = requestRole(req);

  if (isPlatformAdmin(role)) return partnerOrganizations;
  if (isProviderRole(role)) return byScope(partnerOrganizations, tenantId);

  return partnerOrganizations.filter((partner) => partner.connectedHospitals.includes(tenantId));
}

export function getVisibleOrders(req: Request) {
  const tenantId = getRequestScope(req);
  const role = requestRole(req);

  if (isPlatformAdmin(role)) return partnerOrderStore;
  if (isProviderRole(role)) return partnerOrderStore.filter((order) => order.providerTenantId === tenantId);

  return partnerOrderStore.filter((order) => order.sourceTenantId === tenantId);
}

export function updatePartnerOrderStatus(orderId: string, nextStatus: PartnerOrderStatus, req: Request, note?: string) {
  const tenantId = getRequestScope(req);
  const role = requestRole(req);
  const order = partnerOrderStore.find((item) => item.id === orderId);
  if (!order) return { ok: false, status: 404, message: "Partner order not found" };

  if (!isPlatformAdmin(role) && !isProviderRole(role)) {
    return { ok: false, status: 403, message: "Hospital users cannot update provider-side status" };
  }
  if (isProviderRole(role) && order.providerTenantId !== tenantId) {
    return { ok: false, status: 403, message: "Provider cannot access other provider orders" };
  }
  if (!canTransitionPartnerOrder(order.status, nextStatus)) {
    return { ok: false, status: 400, message: `Invalid transition ${order.status} -> ${nextStatus}` };
  }

  order.status = nextStatus;
  order.timeline.push({ ts: new Date().toISOString(), action: nextStatus, note });

  return { ok: true, status: 200, message: "Status updated", order };
}

export function connectPartner(partnerId: string, hospitalTenantId: string, externalPartners?: boolean) {
  const partner = partnerOrganizations.find((item) => item.id === partnerId);
  if (!partner) return { ok: false, status: 404, message: "Partner not found" };

  if (!partner.connectedHospitals.includes(hospitalTenantId)) {
    partner.connectedHospitals.push(hospitalTenantId);
  }

  if (typeof externalPartners === "boolean") {
    const cfg = externalRoutingConfigStore.find((item) => item.hospitalTenantId === hospitalTenantId);
    if (cfg) cfg.externalPartners = externalPartners;
    else externalRoutingConfigStore.push({ hospitalTenantId, externalPartners });
  }

  return { ok: true, status: 200, message: "Partner connected", partner };
}

export function disconnectPartner(partnerId: string, hospitalTenantId: string) {
  const partner = partnerOrganizations.find((item) => item.id === partnerId);
  if (!partner) return { ok: false, status: 404, message: "Partner not found" };

  partner.connectedHospitals = partner.connectedHospitals.filter((item) => item !== hospitalTenantId);
  return { ok: true, status: 200, message: "Partner disconnected", partner };
}
