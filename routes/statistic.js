import express from "express";
import {
  countBooksBorrowed,
  updateBooksBorrowed,
} from "../controllers/statisticsController.js";

const router = express.Router();

router.get("/", countBooksBorrowed);
router.put("/id/:book_id", updateBooksBorrowed);
router.put("/title/:book_title", updateBooksBorrowed);

export default router;
