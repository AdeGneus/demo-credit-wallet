"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = void 0;
const db_1 = __importDefault(require("../db/db"));
const getUserDetails = async (id) => {
    const userDetails = await db_1.default
        .select("first_name", "last_name", "email")
        .from("users")
        .where("id", id);
    const walletDetails = await db_1.default
        .select("account_number", "balance")
        .from("wallets")
        .where("user_id", id);
    return { id, ...userDetails[0], ...walletDetails[0] };
};
exports.getUserDetails = getUserDetails;
class UserService {
}
_a = UserService;
UserService.createUser = async (newUser) => {
    const [id] = await (0, db_1.default)("users").insert(newUser);
    const userDetails = await (0, exports.getUserDetails)(id);
    return userDetails;
};
UserService.checkUser = async (email) => {
    const user = await db_1.default
        .select("id", "password")
        .from("users")
        .where("email", email);
    return { ...user[0] };
};
exports.default = UserService;
