import express from "express";
import {
  getAllLoans,
  addLoan,
  //   updateLoan,
  deleteLoan,
} from "../controllers/loansController.js";

const router = express.Router();

router.get("/", getAllLoans);
router.post("/:user_id/:book_id", addLoan);
// router.put("/:id", updateLoan);
router.delete("/loan/user/:username?/book/:title?", deleteLoan);

export default router;
  