import { useState, useEffect } from "react";
import {
  getFlights,
  updateFlight,
  deleteFlight,
} from "../services/FlightServices";
import type { Flight } from "../types/Flight";

type FlightsProps = {
  refreshKey?: number;
};

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function toTimeValue(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

export default function FlightsComponent({ refreshKey = 0 }: FlightsProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);  

  async function fetchFlights() {
    try {
      setError(null);
      const data = await getFlights();
      setFlights(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flights");
    }
  }

  useEffect(() => {
    fetchFlights();
  }, [refreshKey]);

  function startEdit(flight: Flight) {
    setEditingId(flight.flight_id);
    setEditDraft({ ...flight });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setEditDraft({ ...editDraft, [name]: value } as Flight);
  }

  async function handleSave() {
    if (!editDraft) return;
    try {
      setError(null);
      const body = {
        ...editDraft,
        start_time: toTimeValue(formatTime(editDraft.start_time)),
        end_time: toTimeValue(formatTime(editDraft.end_time)),
      };
      await updateFlight(editDraft.flight_id, body as unknown as Flight);
      cancelEdit();
      await fetchFlights();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save flight");
    }
  }

  async function handleDelete(id: number) {
    try {
      setError(null);
      await deleteFlight(id);
      if (editingId === id) cancelEdit();
      fetchFlights();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete flight");
    }
  }

  return (
    <div className="data-panel table-panel">
      {error && <p className="panel-error">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Start Airport</th>
            <th>End Airport</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Price</th>
            <th>Seats Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.flight_id}>
              {editingId === flight.flight_id && editDraft ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="flight_number"
                      value={editDraft.flight_number}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="start_airport"
                      value={editDraft.start_airport}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="end_airport"
                      value={editDraft.end_airport}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="start_time"
                      value={formatTime(editDraft.start_time)}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="end_time"
                      value={formatTime(editDraft.end_time)}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={editDraft.price}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="seats_available"
                      value={editDraft.seats_available}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{flight.flight_number}</td>
                  <td>{flight.start_airport}</td>
                  <td>{flight.end_airport}</td>
                  <td>{formatTime(flight.start_time)}</td>
                  <td>{formatTime(flight.end_time)}</td>
                  <td>{flight.price}</td>
                  <td>{flight.seats_available}</td>
                  <td>
                    <button onClick={() => startEdit(flight)}>Edit</button>
                    <button onClick={() => handleDelete(flight.flight_id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
