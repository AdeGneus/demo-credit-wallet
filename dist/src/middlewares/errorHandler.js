"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorProd = exports.sendErrorDev = void 0;
const config_1 = __importDefault(require("config"));
const appError_1 = require("../exceptions/appError");
const logger_1 = __importDefault(require("../utils/logger"));
const handleValidationErrorDB = (err) => {
    const message = "Please enter missing fields!";
    return new appError_1.AppError(message, 400);
};
const handleJWTError = (err) => new appError_1.AppError(`${err.message}!. Please log in again`, 401);
const handleJWTExpiredError = () => new appError_1.AppError("Your token has expired! Please log in again", 401);
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
};
exports.sendErrorDev = sendErrorDev;
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        // 1)  Operational, trusted error: send message to client
        if (err instanceof appError_1.AppError && err.isOperational) {
            const appError = err;
            let response = {
                status: appError.status,
                message: appError.message,
            };
            return res.status(appError.statusCode).json(response);
        }
        // 2) Programming or other unknown error: don't leak error details
        logger_1.default.error(`💥: ${err}`);
        // Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};
exports.sendErrorProd = sendErrorProd;
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ?? 500;
    err.status = err.status ?? "error";
    const env = config_1.default.get("NODE_ENV");
    if (env === "development") {
        (0, exports.sendErrorDev)(err, req, res);
    }
    else if (env === "production") {
        if (err.code === "ER_NO_DEFAULT_FOR_FIELD")
            err = handleValidationErrorDB(err);
        if (err.name === "JsonWebTokenError")
            err = handleJWTError(err);
        if (err.name === "TokenExpiredError")
            err = handleJWTExpiredError();
        (0, exports.sendErrorProd)(err, req, res);
    }
};
exports.default = errorHandler;
