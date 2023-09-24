"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("config"));
const signToken = (object, keyName, options) => {
    const signingKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    return (0, jsonwebtoken_1.sign)(object, signingKey, {
        ...(options && options),
        algorithm: "RS256",
    });
};
exports.signToken = signToken;
const verifyToken = (token, keyName) => {
    const publicKey = Buffer.from(config_1.default.get(keyName), "base64").toString("ascii");
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, publicKey);
        return decoded;
    }
    catch (e) {
        return null;
    }
};
exports.verifyToken = verifyToken;
