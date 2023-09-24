"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
const appError_1 = require("./appError");
// Handles status code 401 errors for unauthorized requests
class UnauthorizedError extends appError_1.AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
