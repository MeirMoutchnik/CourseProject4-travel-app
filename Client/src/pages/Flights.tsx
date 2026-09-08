import FlightsComponent from "../components/Flights";
import FlightForm from "../components/FlightForm";
import { useState } from "react";

export default function Flights() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <section className="page-shell">
      <aside className="side-art" aria-hidden="true">
        <img src="/flights-bg.png" alt="" />
      </aside>
      <div className="page-stack">
        <h1>Flights</h1>
        <FlightForm onCreated={() => setRefreshKey((k) => k + 1)} />
        <FlightsComponent refreshKey={refreshKey} />
      </div>
      <aside className="side-art" aria-hidden="true">
        <img src="/flights-bg.png" alt="" />
      </aside>
    </section>
  );
}
