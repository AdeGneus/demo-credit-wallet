"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletDetails = void 0;
const db_1 = __importDefault(require("../db/db"));
const generateAccountNumber_1 = __importDefault(require("../utils/generateAccountNumber"));
const getWalletDetails = async (id) => {
    const walletDetails = await db_1.default
        .select("account_number", "balance")
        .from("wallets")
        .where("id", id);
    return { id, ...walletDetails[0] };
};
exports.getWalletDetails = getWalletDetails;
class WalletService {
}
_a = WalletService;
WalletService.createWallet = async (userId) => {
    const walletData = {
        user_id: userId,
        account_number: (0, generateAccountNumber_1.default)(),
    };
    const [id] = await (0, db_1.default)("wallets").insert(walletData);
    const walletDetails = await (0, exports.getWalletDetails)(id);
    return walletDetails;
};
WalletService.fundWallet = async (userId, amount) => {
    await db_1.default
        .from("wallets")
        .where("user_id", userId)
        .increment("balance", amount);
};
WalletService.transferFunds = async (senderId, recipientId, amount) => {
    await db_1.default.transaction(async (trx) => {
        await trx("wallets")
            .where("user_id", senderId)
            .decrement("balance", amount);
        await trx("wallets")
            .where("user_id", recipientId)
            .increment("balance", amount);
    });
};
WalletService.withdrawFunds = async (userId, amount) => {
    await db_1.default
        .from("wallets")
        .where("user_id", userId)
        .decrement("balance", amount);
};
exports.default = WalletService;
