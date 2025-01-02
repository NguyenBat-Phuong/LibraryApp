import express from "express";
import {
  countBooksBorrowed,
  // updateBooksBorrowed,
} from "../controllers/statisticsController.js";

const router = express.Router();

router.get("/", countBooksBorrowed);

export default router;
