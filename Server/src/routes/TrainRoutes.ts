import { Router } from "express";
import { getTrains, getTrainById, createTrain, updateTrain, patchTrain, deleteTrain } from "../controllers/TrainController";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getTrains);
router.get("/:id", getTrainById);
router.post("/", authenticateToken, authorizeAdmin, createTrain);
router.put("/:id", authenticateToken, updateTrain);
router.patch("/:id", authenticateToken, patchTrain);
router.delete("/:id", authenticateToken, authorizeAdmin, deleteTrain);

export default router;