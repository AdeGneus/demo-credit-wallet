import { Request, Response, NextFunction } from "express";
import config from "config";
import asyncHandler from "../middlewares/asyncHandler";
import db from "../db/db";
import { CustomRequest } from "../middlewares/deserializeUser";
import { ClientError } from "../exceptions/clientError";
import WalletService from "../services/wallet.service";

class WalletController {
  static fund = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { amount } = req.body;
      const user = (req as CustomRequest).user;
      const userId = user!.id;

      if (!amount || amount < 0) {
        return next(new ClientError("Amount is too low"));
      }

      console.log(amount);

      await WalletService.fundWallet(userId, amount);

      return res.status(200).json({
        status: "success",
        message: "Wallet credited successfully",
      });
    }
  );
}

export default WalletController;
