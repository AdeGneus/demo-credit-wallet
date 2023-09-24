"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedPasswordAfterTokenIssued = exports.isCorrectPassword = void 0;
const argon2_1 = require("argon2");
const isCorrectPassword = async (userPassword, candidatePassword) => {
    return await (0, argon2_1.verify)(userPassword, candidatePassword);
};
exports.isCorrectPassword = isCorrectPassword;
const changedPasswordAfterTokenIssued = () => { };
exports.changedPasswordAfterTokenIssued = changedPasswordAfterTokenIssued;
