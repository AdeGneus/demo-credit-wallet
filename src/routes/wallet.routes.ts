import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import deserializeUser from "../middlewares/deserializeUser";

const router = Router();

// Protected routes
router.use(deserializeUser);

router.post("/fund", WalletController.fund);

export default router;
