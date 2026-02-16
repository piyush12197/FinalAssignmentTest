import { ambulanceTripStore, emergencyCallStore } from "../../../../api/platform/v1/_mock/ambulanceCommandStore";

export default function AdminTripTrackingViewPage({ params }: { params: { id: string } }) {
  const trip = ambulanceTripStore.find((t) => t.id === params.id);
  if (!trip) return <div style={{ padding: 24 }}>Trip not found.</div>;
  const call = emergencyCallStore.find((c) => c.id === trip.emergencyCallId);

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Trip Tracking View</h1>
      <p>Trip: {trip.id}</p>
      <p>Emergency Call: {trip.emergencyCallId}</p>
      <p>Driver: {trip.driverId}</p>
      <p>Ambulance: {trip.ambulanceId}</p>
      <p>Status: {call?.status}</p>
      <h2>Live Vitals</h2>
      <ul>{trip.vitalsDuringTransit.map((v, i) => <li key={`${v.ts}-${i}`}>{v.ts}: pulse={v.pulse}, bp={v.bp}, spo2={v.spo2}, note={v.note}</li>)}</ul>
      <h2>Timeline</h2>
      <ul>{call?.timeline.map((t, i) => <li key={`${t.ts}-${i}`}>{t.ts} - {t.action} {t.note ?? ""}</li>)}</ul>
    </div>
  );
}
