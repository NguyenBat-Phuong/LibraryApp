import express from "express";
import { postLogin } from "../login/loginControllers.js";

const router = express.Router();

router.post("/", postLogin);

export default router;
