import { useState, useEffect } from "react";
import { getTrains, updateTrain, deleteTrain } from "../services/TrainServices";
import type { Train } from "../types/Train";

type TrainsProps = {
  refreshKey?: number;
};

function formatTime(value: string): string {
  return value.slice(0, 5);
}

function toTimeValue(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

export default function TrainsComponent({ refreshKey = 0 }: TrainsProps) {
  const [trains, setTrains] = useState<Train[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Train | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchTrains() {
    try {
      setError(null);
      const data = await getTrains();
      setTrains(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trains");
    }
  }

  useEffect(() => {
    fetchTrains();
  }, [refreshKey]);

  function startEdit(train: Train) {
    setEditingId(train.train_id);
    setEditDraft({ ...train });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function handleEditChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!editDraft) return;
    const { name, value } = event.target;
    const numericFields = ["train_number", "price", "available_seats"];
    setEditDraft({
      ...editDraft,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  }

  async function handleSave() {
    if (!editDraft || editingId == null) return;
    try {
      setError(null);
      const body = {
        ...editDraft,
        start_time: toTimeValue(formatTime(editDraft.start_time)),
        end_time: toTimeValue(formatTime(editDraft.end_time)),
      };
      await updateTrain(editingId, body as unknown as Train);
      cancelEdit();
      await fetchTrains();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update train");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm(`Delete train #${id}?`)) return;
    try {
      setError(null);
      await deleteTrain(id);
      if (editingId === id) cancelEdit();
      await fetchTrains();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete train");
    }
  }

  return (
    <div className="data-panel table-panel">
      {error && <p className="panel-error">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Train Number</th>
            <th>Start Station</th>
            <th>End Station</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Price</th>
            <th>Available Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => {
            const isEditing = editingId === train.train_id;
            return (
              <tr key={train.train_id}>
                {isEditing && editDraft ? (
                  <>
                    <td>
                      <input
                        type="number"
                        name="train_number"
                        value={editDraft.train_number}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="start_station"
                        value={editDraft.start_station}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="end_station"
                        value={editDraft.end_station}
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
                        name="available_seats"
                        value={editDraft.available_seats}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button type="button" onClick={handleSave}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{train.train_number}</td>
                    <td>{train.start_station}</td>
                    <td>{train.end_station}</td>
                    <td>{formatTime(train.start_time)}</td>
                    <td>{formatTime(train.end_time)}</td>
                    <td>{train.price}</td>
                    <td>{train.available_seats}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => startEdit(train)}
                        disabled={editingId != null}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(train.train_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
