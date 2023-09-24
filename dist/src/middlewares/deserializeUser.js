"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const unauthorizedError_1 = require("../exceptions/unauthorizedError");
const jwt_1 = require("../utils/jwt");
const user_service_1 = require("../services/user.service");
const asyncHandler_1 = __importDefault(require("./asyncHandler"));
const refreshAccessToken = async (refreshToken) => {
    // 1) verify refresh token
    const decoded = (0, jwt_1.verifyToken)(refreshToken, "refreshTokenPublicKey");
    if (!decoded)
        return false;
    // 2) Check if user still exists
    const user = await (0, user_service_1.getUserDetails)(decoded.id);
    if (!user)
        return false;
    // 3) Generate new access token
    const accessToken = (0, jwt_1.signToken)(user, "accessTokenPrivateKey", {
        expiresIn: config_1.default.get("accessTokenTtl"),
    });
    return accessToken;
};
const deserializeUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    // 1) Get token and check if it exists
    let accessToken = "";
    const refreshToken = req.headers["x-refresh-token"];
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        accessToken = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.jwt) {
        accessToken = req.cookies.jwt;
    }
    if (!accessToken || !refreshToken) {
        return next(new unauthorizedError_1.UnauthorizedError("You are not logged in! Please log in to get access"));
    }
    // 2) Verify token
    const decoded = (0, jwt_1.verifyToken)(accessToken, "accessTokenPublicKey");
    const id = decoded?.id;
    const iat = decoded?.iat; // To check if user changed password after token was issued
    // 3) Check if user still exists
    if (decoded) {
        const currentUser = await (0, user_service_1.getUserDetails)(id);
        if (!currentUser) {
            return next(new unauthorizedError_1.UnauthorizedError("The user belonging to this token does no longer exist"));
        }
        // 4) Check if user changed password after the token was issued
        // @TODO: This will be implemented when the forgot password feature is enabled
        // Grant access to protected route
        req.user = decoded;
        return next();
    }
    // 5) Check if accessToken has expired and refresh token still valid
    if (refreshToken) {
        // 5a) Generate new access token using the refresh token
        // @ts-ignore
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (!newAccessToken) {
            return next(new unauthorizedError_1.UnauthorizedError("Invalid refresh token! Please login again"));
        }
        // 5b) Set the new access token on the header field
        if (newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }
        // 5c) Verify the new access token and grant access to protected route
        const decoded = (0, jwt_1.verifyToken)(newAccessToken, "accessTokenPublicKey");
        req.user = decoded;
        return next();
    }
    return next();
});
exports.default = deserializeUser;
