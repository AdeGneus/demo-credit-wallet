"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const appError_1 = require("./appError");
// Handles status code 404 errors for not found resources
class NotFoundError extends appError_1.AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
