import express from "express";
import {
  countBooksBorrowed,
  // updateBooksBorrowed,
} from "../controllers/statisticsController.js";

const router = express.Router();

router.get("/", countBooksBorrowed);
// router.put("/id/:statistic_id", updateBooksBorrowed);
// router.put("/title/:title", updateBooksBorrowed);

export default router;
