import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, patchUser, deleteUser, loginUser } from "../controllers/UserControllers";

const router = Router();

router.get("/", getUsers);
router.post("/login", loginUser);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id", patchUser);
router.delete("/:id", deleteUser);

export default router;