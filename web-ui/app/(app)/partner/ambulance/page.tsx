import { partnerOrderStore } from "../../../api/platform/v1/_mock/partnerStore";

const currentRole = "PROVIDER_ADMIN";
const providerTenantId = "provider-ambulance-tenant";

export default function AmbulanceProviderPortalPage() {
  if (!["PROVIDER_ADMIN", "PROVIDER_STAFF"].includes(currentRole)) {
    return <div style={{ padding: 24 }}>Provider role required.</div>;
  }

  const orders = partnerOrderStore.filter((order) => order.providerTenantId === providerTenantId && order.type === "AMBULANCE");

  return (
    <div style={{ padding: 24 }}>
      <h1>Ambulance Provider Portal</h1>
      <p>Emergency dispatch requests: {orders.length}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>{order.id}</strong> - {order.status} - hospital {order.sourceTenantId}
            <div>Actions: Assign own ambulance / update status with partner API</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
