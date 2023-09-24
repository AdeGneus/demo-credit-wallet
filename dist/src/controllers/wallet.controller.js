"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const clientError_1 = require("../exceptions/clientError");
const wallet_service_1 = __importDefault(require("../services/wallet.service"));
const db_1 = __importDefault(require("../db/db"));
const notFoundError_1 = require("../exceptions/notFoundError");
class WalletController {
}
_a = WalletController;
WalletController.fund = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { amount } = req.body;
    const user = req.user;
    const userId = user.id;
    if (!amount || amount < 0) {
        return next(new clientError_1.ClientError("Amount is too low!"));
    }
    await wallet_service_1.default.fundWallet(userId, amount);
    return res.status(200).json({
        status: "success",
        message: "Wallet credited successfully!",
    });
});
WalletController.transfer = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { recipientId, amount } = req.body;
    const user = req.user;
    const userId = user.id;
    if (!recipientId || !amount) {
        return next(new clientError_1.ClientError("Please provide a valid recipient id and amount"));
    }
    // Check if recipient exist
    const recipient = await db_1.default.from("users").where("id", userId).first();
    if (!recipient) {
        return next(new notFoundError_1.NotFoundError("The recipient does not exist!"));
    }
    // Check if sender has enough balance to transfer
    const senderWallet = await db_1.default
        .from("wallets")
        .where("user_id", userId)
        .first();
    if (!senderWallet || senderWallet.balance < amount) {
        return next(new clientError_1.ClientError("Insufficient balance!"));
    }
    await wallet_service_1.default.transferFunds(userId, recipientId, amount);
    return res.status(200).json({
        status: "success",
        message: "Funds transferred successfully!",
    });
});
WalletController.withdraw = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { amount } = req.body;
    const user = req.user;
    const userId = user.id;
    if (!amount || amount < 0) {
        return next(new clientError_1.ClientError("Amount is too low!"));
    }
    // Check if user has enough balance to transfer
    const userWallet = await db_1.default
        .from("wallets")
        .where("user_id", userId)
        .first();
    if (!userWallet || userWallet.balance < amount) {
        return next(new clientError_1.ClientError("Insufficient balance!"));
    }
    await wallet_service_1.default.withdrawFunds(userId, amount);
    return res.status(200).json({
        status: "success",
        message: "Funds withdrawn successfully!",
    });
});
exports.default = WalletController;
