import { ambulanceFleetStore, driverStore, emergencyCallStore } from "../../../../api/platform/v1/_mock/ambulanceCommandStore";

export default function EmergencyCallDetailPage({ params }: { params: { id: string } }) {
  const call = emergencyCallStore.find((c) => c.id === params.id);
  if (!call) return <div style={{ padding: 24 }}>Emergency call not found.</div>;

  const ambulance = ambulanceFleetStore.find((a) => a.id === call.assignedAmbulanceId);
  const driver = driverStore.find((d) => d.id === call.assignedDriverId);

  return (
    <div style={{ padding: 24 }}>
      <h1>Emergency Call Detail</h1>
      <p>Caller: {call.callerName} ({call.phone})</p>
      <p>Location: {call.pickupLocation}</p>
      <p>Condition: {call.conditionSummary}</p>
      <p>Assigned Ambulance: {ambulance ? ambulance.vehicleNumber : "Not assigned"}</p>
      <p>Driver: {driver ? driver.name : "Not assigned"}</p>
      {!call.assignedAmbulanceId && <button disabled>Dispatch (use command center/API)</button>}
      <h2>Timeline</h2>
      <ul>{call.timeline.map((t, i) => <li key={`${t.ts}-${i}`}>{t.ts} - {t.action} {t.note ? `(${t.note})` : ""}</li>)}</ul>
    </div>
  );
}
