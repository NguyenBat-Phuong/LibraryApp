import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { checkPermissions } from "../middlewares/checkPermissions.js";
import { checkLogin } from "../middlewares/checkLogin.js";

const router = express.Router();
router.get("/", checkLogin, getAllUsers);
router.post("/", checkLogin, checkPermissions("can_manage_users"), addUser);
router.put(
  "/:id",
  checkLogin,
  checkPermissions("can_manage_users"),
  updateUser
);
router.delete(
  "/:id",
  checkLogin,
  checkPermissions("can_manage_users"),
  deleteUser
);
export default router;
