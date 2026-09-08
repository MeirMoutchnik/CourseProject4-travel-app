import type { Train } from "../types/Train";
import sql from "../db";
import { Request, Response } from "express";

export async function getTrains(req: Request, res: Response) {
  try {
    const trains = await sql`SELECT * FROM trains ORDER BY start_time ASC`;
    res.json(trains as Train[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get trains" });
  }
}

export async function getTrainById(req: Request, res: Response) {
  try {
    const trainId = req.params.id;
    const train = await sql`SELECT * FROM trains WHERE train_id = ${trainId}`;
    res.json(train[0] as Train);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get train" });
  }
}

export async function createTrain(req: Request, res: Response) {
  try {
    const train = req.body as Train;
    const result = await sql`
      INSERT INTO trains (
        train_number,
        start_station,
        end_station,
        start_time,
        end_time,
        price,
        available_seats
      )
      VALUES (
        ${train.train_number},
        ${train.start_station},
        ${train.end_station},
        ${train.start_time},
        ${train.end_time},
        ${train.price},
        ${train.available_seats}
      )
      RETURNING *
    `;
    res.status(201).json({
      message: "Train created successfully",
      train: result[0] as Train,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create train" });
  }
}

export async function updateTrain(req: Request, res: Response) {
  try {
    const trainId = req.params.id;
    const train = req.body as Train;
    const result = await sql`
      UPDATE trains
      SET
        train_number = ${train.train_number},
        start_station = ${train.start_station},
        end_station = ${train.end_station},
        start_time = ${train.start_time},
        end_time = ${train.end_time},
        price = ${train.price},
        available_seats = ${train.available_seats}
      WHERE train_id = ${trainId}
      RETURNING *
    `;
    res.json({
      message: "Train updated successfully",
      train: result[0] as Train,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update train" });
  }
}

export async function patchTrain(req: Request, res: Response) {
  try {
    const trainId = req.params.id;
    const train = req.body as Train;
    const hasTrainNumber = train.train_number !== undefined;
    const hasStartStation = train.start_station !== undefined;
    const hasEndStation = train.end_station !== undefined;
    const hasStartTime = train.start_time !== undefined;
    const hasEndTime = train.end_time !== undefined;
    const hasPrice = train.price !== undefined;
    const hasAvailableSeats = train.available_seats !== undefined;

    if (!hasTrainNumber && !hasStartStation && !hasEndStation && !hasStartTime && !hasEndTime && !hasPrice && !hasAvailableSeats) {
      res.status(400).json({ error: "At least one field to update is required" });
      return;
    }

    const result = await sql`
      UPDATE trains
      SET
        train_number = COALESCE(${train.train_number}, train_number),
        start_station = COALESCE(${train.start_station}, start_station),
        end_station = COALESCE(${train.end_station}, end_station),
        start_time = COALESCE(${train.start_time}, start_time),
        end_time = COALESCE(${train.end_time}, end_time),
        price = COALESCE(${train.price}, price),
        available_seats = COALESCE(${train.available_seats}, available_seats)
      WHERE train_id = ${trainId}
      RETURNING *
    `;
    res.json({
      message: "Train patched successfully",
      train: result[0] as Train,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to patch train" });
  }
}

export async function deleteTrain(req: Request, res: Response) {
  try {
    const trainId = req.params.id;
    const result = await sql`DELETE FROM trains WHERE train_id = ${trainId}`;
    res.json({
      message: "Train deleted successfully",
      train: result[0] as Train,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete train" });
  }
}
