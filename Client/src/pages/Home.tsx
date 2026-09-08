import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="home-page">
      <aside className="home-side" aria-hidden="true">
        <img src="/trains-bg.png" alt="" />
      </aside>

      <div className="home-center">
        <h1>Home</h1>
        <p>Hi, this is my travel website</p>
        <p>Choose your mode of transport</p>
        <div className="home-choices">
          <div className="home-choice is-trains">
            <img
              className="home-choice-thumb"
              src="/trains-bg.png"
              alt=""
            />
            <button type="button" onClick={() => navigate("/trains")}>
              Trains
            </button>
          </div>
          <div className="home-choice is-flights">
            <img
              className="home-choice-thumb"
              src="/flights-bg.png"
              alt=""
            />
            <button type="button" onClick={() => navigate("/flights")}>
              Flights
            </button>
          </div>
        </div>
      </div>

      <aside className="home-side" aria-hidden="true">
        <img src="/flights-bg.png" alt="" />
      </aside>
    </section>
  );
}
