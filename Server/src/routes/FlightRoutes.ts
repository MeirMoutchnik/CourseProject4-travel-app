import { Router } from "express";
import { getFlights, getFlightById, createFlight, updateFlight, patchFlight, deleteFlight } from "../controllers/FlightController";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getFlights);
router.get("/:id", getFlightById);
router.post("/", authenticateToken, authorizeAdmin, createFlight);
router.put("/:id", authenticateToken, updateFlight);
router.patch("/:id", authenticateToken, patchFlight);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteFlight);

export default router;

