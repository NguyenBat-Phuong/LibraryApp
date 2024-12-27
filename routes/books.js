import express from "express";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook
} from "../controllers/booksController.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/", addBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
