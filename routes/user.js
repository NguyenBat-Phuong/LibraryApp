import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
