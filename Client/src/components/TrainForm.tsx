import { useState } from "react";
import { createTrain } from "../services/TrainServices";
import type { Train } from "../types/Train";

type TrainFormProps = {
  onCreated?: () => void;
};

/** API stores TIME — send "HH:MM:SS" */
function toApiTime(value: string): string {
  if (!value) return "00:00:00";
  return value.length === 5 ? `${value}:00` : value.slice(0, 8);
}

export default function TrainForm({ onCreated }: TrainFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [train, setTrain] = useState({
    train_number: "",
    start_station: "",
    end_station: "",
    start_time: "08:00",
    end_time: "09:00",
    price: "",
    available_seats: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: Train = {
        train_id: 0,
        train_number: Number(train.train_number),
        start_station: train.start_station,
        end_station: train.end_station,
        start_time: toApiTime(train.start_time),
        end_time: toApiTime(train.end_time),
        price: Number(train.price),
        available_seats: Number(train.available_seats),
      };
      await createTrain(payload);
      setTrain({
        train_number: "",
        start_station: "",
        end_station: "",
        start_time: "08:00",
        end_time: "09:00",
        price: "",
        available_seats: "",
      });
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create train");
    }
  };

  return (
    <form className="transport-form data-panel" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      <input
        className="form-full"
        type="number"
        placeholder="Train Number"
        value={train.train_number}
        onChange={(e) => setTrain({ ...train, train_number: e.target.value })}
        required
      />
      <div className="form-row">
        <input
          type="text"
          placeholder="Start Station"
          value={train.start_station}
          onChange={(e) => setTrain({ ...train, start_station: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="End Station"
          value={train.end_station}
          onChange={(e) => setTrain({ ...train, end_station: e.target.value })}
          required
        />
      </div>
      <div className="form-row">
        <label>
          Start time
          <input
            type="time"
            value={train.start_time}
            onChange={(e) => setTrain({ ...train, start_time: e.target.value })}
            required
          />
        </label>
        <label>
          End time
          <input
            type="time"
            value={train.end_time}
            onChange={(e) => setTrain({ ...train, end_time: e.target.value })}
            required
          />
        </label>
      </div>
      <div className="form-row">
        <input
          type="number"
          placeholder="Price"
          value={train.price}
          onChange={(e) => setTrain({ ...train, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Available Seats"
          value={train.available_seats}
          onChange={(e) =>
            setTrain({ ...train, available_seats: e.target.value })
          }
          required
        />
      </div>
      <button type="submit">Create Train</button>
    </form>
  );
}
