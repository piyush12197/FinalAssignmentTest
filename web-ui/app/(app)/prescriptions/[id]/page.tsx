import { partnerOrderStore, partnerOrganizations } from "../../../api/platform/v1/_mock/partnerStore";
import { prescriptionStore } from "../../../api/platform/v1/_mock/prescriptionStore";

export default function PrescriptionDetailPage({ params }: { params: { id: string } }) {
  const prescription = prescriptionStore.find((item) => item.id === params.id);
  if (!prescription) return <div style={{ padding: 24 }}>Prescription not found.</div>;

  const partnerOrders = partnerOrderStore.filter((order) => order.referenceId === prescription.id && ["LAB", "PHARMACY"].includes(order.type));

  return (
    <div style={{ padding: 24 }}>
      <h1>Prescription Detail</h1>
      <p>Patient: {prescription.patientName}</p>
      <p>Lab Tests: {prescription.labTests.join(", ") || "None"}</p>
      <p>Medicines: {prescription.medicines.join(", ") || "None"}</p>

      <h2>External Partner Order Status</h2>
      {!partnerOrders.length && <p>No external partner orders for this prescription.</p>}
      <ul>
        {partnerOrders.map((order) => {
          const provider = partnerOrganizations.find((partner) => partner.tenantId === order.providerTenantId);
          return (
            <li key={order.id}>
              <p>
                Provider: {provider?.name ?? order.providerTenantId} | Type: {order.type} | Status: {order.status}
              </p>
              <ul>
                {order.timeline.map((event, idx) => (
                  <li key={`${event.ts}-${idx}`}>
                    {event.ts} - {event.action} {event.note ? `(${event.note})` : ""}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
