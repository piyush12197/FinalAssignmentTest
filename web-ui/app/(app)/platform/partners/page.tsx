import { externalRoutingConfigStore, partnerOrderStore, partnerOrganizations } from "../../../api/platform/v1/_mock/partnerStore";

const slaHours = 4;

export default function PlatformPartnersPage() {
  const now = Date.now();

  return (
    <div style={{ padding: 24 }}>
      <h1>Platform Partner Ecosystem</h1>
      <h2>Routing Flags Per Hospital</h2>
      <ul>
        {externalRoutingConfigStore.map((cfg) => (
          <li key={cfg.hospitalTenantId}>{cfg.hospitalTenantId}: externalPartners={String(cfg.externalPartners)}</li>
        ))}
      </ul>

      <h2>Partner Organizations</h2>
      <ul>
        {partnerOrganizations.map((partner) => {
          const activeOrders = partnerOrderStore.filter(
            (order) => order.providerTenantId === partner.tenantId && !["COMPLETED", "REJECTED"].includes(order.status),
          );
          const hasSlaBreach = activeOrders.some((order) => (now - new Date(order.createdAt).getTime()) / 36e5 > slaHours);

          return (
            <li key={partner.id}>
              <strong>{partner.name}</strong> ({partner.type}) - {partner.status}
              <div>Connected hospitals: {partner.connectedHospitals.join(", ") || "None"}</div>
              <div>Active order count: {activeOrders.length}</div>
              <div>SLA breach (&gt;{slaHours}h pending): {hasSlaBreach ? "YES" : "NO"}</div>
              <div>Admin actions: Connect / Disconnect / Toggle external routing via /api/platform/v1/partners/* endpoints</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
