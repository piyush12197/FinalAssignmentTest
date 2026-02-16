import { partnerOrderStore } from "../../../api/platform/v1/_mock/partnerStore";

const currentRole = "PROVIDER_ADMIN";
const providerTenantId = "provider-lab-tenant";

export default function LabProviderPortalPage() {
  if (!["PROVIDER_ADMIN", "PROVIDER_STAFF"].includes(currentRole)) {
    return <div style={{ padding: 24 }}>Provider role required.</div>;
  }

  const orders = partnerOrderStore.filter((order) => order.providerTenantId === providerTenantId && order.type === "LAB");

  return (
    <div style={{ padding: 24 }}>
      <h1>Lab Provider Portal</h1>
      <p>Incoming external lab orders: {orders.length}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>{order.id}</strong> - {order.status} - from {order.sourceTenantId}
            <div>Actions: Accept / Reject / Mark IN_PROGRESS / Mark COMPLETED (use partner status API)</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
