"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const argon2_1 = __importDefault(require("argon2"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const db_1 = __importDefault(require("../db/db"));
const conflictError_1 = require("../exceptions/conflictError");
const user_service_1 = __importDefault(require("../services/user.service"));
const wallet_service_1 = __importDefault(require("../services/wallet.service"));
const jwt_1 = require("../utils/jwt");
const clientError_1 = require("../exceptions/clientError");
const checkPassword_1 = require("../utils/checkPassword");
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
const user_service_2 = require("../services/user.service");
const createSendToken = (user, statusCode, req, res) => {
    // Create an access token
    const accessToken = (0, jwt_1.signToken)(user, "accessTokenPrivateKey", {
        expiresIn: config_1.default.get("accessTokenTtl"),
    });
    // Create a refresh token
    const refreshToken = (0, jwt_1.signToken)(user, "refreshTokenPrivateKey", {
        expiresIn: config_1.default.get("refreshTokenTtl"),
    });
    // Cookie options
    const expires = Number(config_1.default.get("cookieExpires")) * 60 * 1000;
    const cookieOptions = {
        expires: new Date(Date.now() + expires),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };
    res.cookie("jwt", accessToken, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        tokens: { accessToken, refreshToken },
        data: { user },
    });
};
class AuthController {
}
_a = AuthController;
AuthController.signup = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    // Check if user already exist
    const existingUser = await (0, db_1.default)("users").where({ email }).first();
    if (existingUser) {
        return next(new conflictError_1.ConflictError("User already exists"));
    }
    // Hash the password before storing it in the database
    const hashedPassword = await argon2_1.default.hash(password);
    // Create a new user record
    const userDetails = {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
    };
    const newUser = await user_service_1.default.createUser(userDetails);
    // Create new wallet for the user
    const newWallet = await wallet_service_1.default.createWallet(newUser.id);
    const user = { ...newUser, ...newWallet };
    createSendToken(user, 201, req, res);
});
AuthController.login = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password exists
    if (!email || !password) {
        return next(new clientError_1.ClientError("Please provide email and password!"));
    }
    // Check if user exists and password is correct
    const user = await user_service_1.default.checkUser(email);
    if (!user || !(await (0, checkPassword_1.isCorrectPassword)(user.password, password))) {
        return next(new unauthorizedError_1.UnauthorizedError("Incorrect email or password"));
    }
    // if everything is okay, send token to client
    createSendToken(await (0, user_service_2.getUserDetails)(user.id), 200, req, res);
});
AuthController.logout = (req, res) => {
    res.cookie("jwt", "loggedOut", {
        expires: new Date(Date.now() + 10 * 1000),
    });
    res.status(200).json({
        status: "success",
    });
};
exports.default = AuthController;
