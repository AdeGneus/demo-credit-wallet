"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = void 0;
const appError_1 = require("./appError");
// Handles status code 409 errors for conflicting requests
class ConflictError extends appError_1.AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
