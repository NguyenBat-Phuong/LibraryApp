import express from "express";
import {
  getAllLoans,
  addLoan,
  //   updateLoan,
  deleteLoan,
} from "../controllers/loansController.js";
import { checkPermissions } from "../middlewares/checkPermissions.js";
import { checkLogin } from "../middlewares/checkLogin.js";

const router = express.Router();

router.get("/", checkLogin, getAllLoans);
router.post(
  "/:user_id/:book_id",
  checkLogin,
  checkPermissions("can_borrow_books"),
  addLoan
);
router.delete(
  "/loan/user/:username?/book/:title?",
  checkLogin,
  checkPermissions("can_manage_books"),
  deleteLoan
);

export default router;
