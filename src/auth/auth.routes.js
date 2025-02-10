import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/check-validator.js";


const router = Router();

router.post(
  "/login",
  loginValidator,  
  login
);

export default router;