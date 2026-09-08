import type { Flight } from "../types/Flight";
import sql from "../db";
import { Request, Response } from "express";

export async function getFlights(req: Request, res: Response) {
  try {
    const flights = await sql`SELECT * FROM flights ORDER BY start_time ASC`;
    res.json(flights as Flight[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get flights" });
  }
}

export async function getFlightById(req: Request, res: Response) {
  try {
    const flightId = req.params.id;
    const flight =
      await sql`SELECT * FROM flights WHERE flight_id = ${flightId}`;
    res.json(flight[0] as Flight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get flight" });
  }
}

export async function createFlight(req: Request, res: Response) {
  try {
    const flight = req.body as Flight;
    const result =
      await sql`
      INSERT INTO flights (flight_number, start_airport, end_airport, start_time, end_time, price, seats_available) 
      VALUES (
        ${flight.flight_number},
        ${flight.start_airport},
        ${flight.end_airport},
        ${flight.start_time},
        ${flight.end_time},
        ${flight.price},
        ${flight.seats_available}
      ) RETURNING *`;
    res
      .status(201)
      .json({
        message: "Flight created successfully",
        flight: result[0] as Flight,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create flight" });
  }
}

export async function updateFlight(req: Request, res: Response) {
  try {
    const flightId = req.params.id;
    const flight = req.body as Flight;
    const result =
      await sql`
      UPDATE flights
      SET
        flight_number = ${flight.flight_number},
        start_airport = ${flight.start_airport},
        end_airport = ${flight.end_airport},
        start_time = ${flight.start_time},
        end_time = ${flight.end_time},
        price = ${flight.price},
        seats_available = ${flight.seats_available}
      WHERE flight_id = ${flightId}
      RETURNING *
    `;
    res.json({
      message: "Flight updated successfully",
      flight: result[0] as Flight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update flight" });
  }
}

export async function patchFlight(req: Request, res: Response) {
  try {
    const flightId = req.params.id;
    const flight = req.body as Flight;
    const hasFlightNumber = flight.flight_number !== undefined;
    const hasStartAirport = flight.start_airport !== undefined;
    const hasEndAirport = flight.end_airport !== undefined;
    const hasStartTime = flight.start_time !== undefined;
    const hasEndTime = flight.end_time !== undefined;
    const hasPrice = flight.price !== undefined;
    const hasAvailableSeats = flight.seats_available !== undefined;

    if (!hasFlightNumber && !hasStartAirport && !hasEndAirport && !hasStartTime && !hasEndTime && !hasPrice && !hasAvailableSeats) {
      res.status(400).json({ error: "At least one field to update is required" });
      return;
    }

    const result = await sql`
            UPDATE flights
            SET
                flight_number = COALESCE(${flight.flight_number}, flight_number),
                start_airport = COALESCE(${flight.start_airport}, start_airport),
                end_airport = COALESCE(${flight.end_airport}, end_airport),
                start_time = COALESCE(${flight.start_time}, start_time),
                end_time = COALESCE(${flight.end_time}, end_time),
                price = COALESCE(${flight.price}, price),
                seats_available = COALESCE(${flight.seats_available}, seats_available)
            WHERE flight_id = ${flightId}
            RETURNING *
        `;
    res.json({
      message: "Flight patched successfully",
      flight: result[0] as Flight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to patch flight" });
  }
}

export async function deleteFlight(req: Request, res: Response) {
  try {
    const flightId = req.params.id;
    const result = await sql`DELETE FROM flights WHERE flight_id = ${flightId}`;
    res.json({
      message: "Flight deleted successfully",
      flight: result[0] as Flight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete flight" });
  }
}
