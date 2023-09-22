import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { CustomRequest } from "../middlewares/deserializeUser";
import { ClientError } from "../exceptions/clientError";
import WalletService from "../services/wallet.service";
import db from "../db/db";
import { NotFoundError } from "../exceptions/notFoundError";

class WalletController {
  static fund = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { amount } = req.body;
      const user = (req as CustomRequest).user;
      const userId = user!.id;

      if (!amount || amount < 0) {
        return next(new ClientError("Amount is too low!"));
      }

      await WalletService.fundWallet(userId, amount);

      return res.status(200).json({
        status: "success",
        message: "Wallet credited successfully",
      });
    }
  );

  static transfer = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { recipientId, amount } = req.body;
      const user = (req as CustomRequest).user;
      const userId = user!.id;

      if (!recipientId || !amount) {
        return next(
          new ClientError("Please provide a valid recipient id and amount")
        );
      }

      // Check if recipient exist
      const recipient = await db.from("users").where("id", userId).first();

      if (!recipient) {
        return next(new NotFoundError("The recipient does not exist"));
      }

      // Check if sender has enough balance to transfer
      const senderWallet = await db
        .from("wallets")
        .where("user_id", userId)
        .first();

      if (!senderWallet || senderWallet.balance < amount) {
        return next(new ClientError("Insufficient balance"));
      }

      await WalletService.transferFunds(userId, recipientId, amount);

      return res.status(200).json({
        status: "success",
        message: "Funds transferred successfully",
      });
    }
  );
}

export default WalletController;
