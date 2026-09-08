import { useState } from "react";
import { createFlight } from "../services/FlightServices";
import type { Flight } from "../types/Flight";

type FlightFormProps = {
  onCreated?: () => void;
};

/** API stores TIME — send "HH:MM:SS" */
function toApiTime(value: string): string {
  if (!value) return "00:00:00";
  return value.length === 5 ? `${value}:00` : value.slice(0, 8);
}

export default function FlightForm({ onCreated }: FlightFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [flight, setFlight] = useState({
    flight_number: "",
    start_airport: "",
    end_airport: "",
    start_time: "08:00",
    end_time: "09:00",
    price: "",
    seats_available: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: Flight = {
        flight_id: 0,
        flight_number: Number(flight.flight_number),
        start_airport: flight.start_airport,
        end_airport: flight.end_airport,
        start_time: toApiTime(flight.start_time),
        end_time: toApiTime(flight.end_time),
        price: Number(flight.price),
        seats_available: Number(flight.seats_available),
      };
      await createFlight(payload);
      setFlight({
        flight_number: "",
        start_airport: "",
        end_airport: "",
        start_time: "08:00",
        end_time: "09:00",
        price: "",
        seats_available: "",
      });
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create flight");
    }
  };

  return (
    <form className="transport-form data-panel" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <input
        className="form-full"
        type="number"
        placeholder="Flight Number"
        value={flight.flight_number}
        onChange={(e) =>
          setFlight({ ...flight, flight_number: e.target.value })
        }
        required
      />
      <div className="form-row">
        <input
          type="text"
          placeholder="Start Airport"
          value={flight.start_airport}
          onChange={(e) =>
            setFlight({ ...flight, start_airport: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="End Airport"
          value={flight.end_airport}
          onChange={(e) => setFlight({ ...flight, end_airport: e.target.value })}
          required
        />
      </div>
      <div className="form-row">
        <label>
          Start time
          <input
            type="time"
            value={flight.start_time}
            onChange={(e) =>
              setFlight({ ...flight, start_time: e.target.value })
            }
            required
          />
        </label>
        <label>
          End time
          <input
            type="time"
            value={flight.end_time}
            onChange={(e) => setFlight({ ...flight, end_time: e.target.value })}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <input
          type="number"
          placeholder="Price"
          value={flight.price}
          onChange={(e) => setFlight({ ...flight, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Available Seats"
          value={flight.seats_available}
          onChange={(e) =>
            setFlight({ ...flight, seats_available: e.target.value })
          }
          required
        />
      </div>
      <button type="submit">Create Flight</button>
    </form>
  );
}
