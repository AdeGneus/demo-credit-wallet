"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientError = void 0;
const appError_1 = require("./appError");
// Handles status code 400 errors for bad requests
class ClientError extends appError_1.AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ClientError = ClientError;
