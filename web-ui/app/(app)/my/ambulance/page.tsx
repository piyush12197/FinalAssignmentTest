import { ambulanceTripStore, emergencyCallStore } from "../../../api/platform/v1/_mock/ambulanceCommandStore";

const role = "DRIVER";
const currentDriverId = "drv-t1-1";

export default function DriverAmbulanceDashboardPage() {
  if (role !== "DRIVER") return <div style={{ padding: 24 }}>Driver role required.</div>;

  const trip = ambulanceTripStore.find((t) => t.driverId === currentDriverId && !t.hospitalArrivalTime);
  const call = trip ? emergencyCallStore.find((c) => c.id === trip.emergencyCallId) : null;

  return (
    <div style={{ padding: 24, maxWidth: 430 }}>
      <h1>Driver Dashboard</h1>
      {!trip && <p>No active trip assigned.</p>}
      {trip && (
        <>
          <p>Trip: {trip.id}</p>
          <p>Pickup: {call?.pickupLocation}</p>
          <button>Start Trip</button>
          <button>Arrived at Patient</button>
          <button>Arrived at Hospital</button>
          <h2>Vitals Capture</h2>
          <form>
            <input placeholder="Pulse" />
            <input placeholder="BP" />
            <input placeholder="SpO2" />
            <textarea placeholder="Note" />
            <button type="submit">Submit Vitals</button>
          </form>
        </>
      )}
    </div>
  );
}
