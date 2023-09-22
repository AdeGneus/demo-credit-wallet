import { Router } from "express";
import AuthController from "../controllers/authController";

const router = Router();

router.post("/signup", AuthController.signup);

export default router;
