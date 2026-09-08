import { useState } from "react";
import TrainsComponent from "../components/Trains";
import TrainForm from "../components/TrainForm";

export default function Trains() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <section className="page-shell">
      <aside className="side-art" aria-hidden="true">
        <img src="/trains-bg.png" alt="" />
      </aside>
      <div className="page-stack">
        <h1>Trains</h1>
        <TrainForm onCreated={() => setRefreshKey((k) => k + 1)} />
        <TrainsComponent refreshKey={refreshKey} />
      </div>
      <aside className="side-art" aria-hidden="true">
        <img src="/trains-bg.png" alt="" />
      </aside>
    </section>
  );
}
