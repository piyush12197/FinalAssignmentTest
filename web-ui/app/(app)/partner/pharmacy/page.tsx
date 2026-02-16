import { partnerOrderStore } from "../../../api/platform/v1/_mock/partnerStore";

const currentRole = "PROVIDER_STAFF";
const providerTenantId = "provider-pharmacy-tenant";

export default function PharmacyProviderPortalPage() {
  if (!["PROVIDER_ADMIN", "PROVIDER_STAFF"].includes(currentRole)) {
    return <div style={{ padding: 24 }}>Provider role required.</div>;
  }

  const orders = partnerOrderStore.filter((order) => order.providerTenantId === providerTenantId && order.type === "PHARMACY");

  return (
    <div style={{ padding: 24 }}>
      <h1>Pharmacy Provider Portal</h1>
      <p>Medicine orders: {orders.length}</p>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <strong>{order.id}</strong> - {order.status} - ref {order.referenceId}
            <div>Actions: Accept / Reject / Mark Packed(IN_PROGRESS) / Mark Delivered(COMPLETED)</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
