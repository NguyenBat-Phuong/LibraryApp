import express from "express";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/booksController.js";
import { checkPermissions } from "../middlewares/checkPermissions.js";
import { checkLogin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/", checkLogin, checkPermissions("can_manage_books"), addBook);
router.put(
  "/:id",
  checkLogin,
  checkPermissions("can_manage_books"),
  updateBook
);
router.delete(
  "/:id",
  checkLogin,
  checkPermissions("can_manage_books"),
  deleteBook
);

export default router;
