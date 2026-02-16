import { ambulanceFleetStore, driverStore, emergencyCallStore } from "../../../api/platform/v1/_mock/ambulanceCommandStore";

export default function EmergencyCommandCenterPage() {
  const activeCalls = emergencyCallStore.filter((c) => ["RECEIVED", "DISPATCHED", "EN_ROUTE", "ARRIVED"].includes(c.status));

  return (
    <div style={{ padding: 24 }}>
      <h1>Emergency Command Center</h1>
      <section>
        <h2>Active Emergency Calls</h2>
        <ul>{activeCalls.map((c) => <li key={c.id}>{c.callerName} - {c.priority} - {c.status}</li>)}</ul>
      </section>
      <section>
        <h2>Ambulance Fleet Status</h2>
        <ul>{ambulanceFleetStore.map((a) => <li key={a.id}>{a.vehicleNumber} ({a.type}) - {a.status}</li>)}</ul>
      </section>
      <section>
        <h2>Driver Status</h2>
        <ul>{driverStore.map((d) => <li key={d.id}>{d.name} - {d.status}</li>)}</ul>
      </section>
      <section>
        <h2>Quick Dispatch Panel</h2>
        <p>Use API: POST /api/platform/v1/emergency/calls/:id/dispatch</p>
      </section>
    </div>
  );
}
