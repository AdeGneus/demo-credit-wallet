"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const knexConfig = {
    development: {
        client: "mysql",
        connection: {
            host: config_1.default.get("DB_HOST"),
            user: config_1.default.get("DB_USER"),
            password: config_1.default.get("DB_PASSWORD"),
            database: config_1.default.get("DB_NAME"),
        },
        migrations: {
            directory: "./src/db/migrations",
            extension: "ts",
        },
    },
    production: {
        client: "mysql",
        connection: {
            host: config_1.default.get("DB_PROD_HOST"),
            user: config_1.default.get("DB_PROD_USER"),
            password: config_1.default.get("DB_PROD_PASSWORD"),
            database: config_1.default.get("DB_NAME"),
        },
        migrations: {
            directory: "./src/db/migrations",
            extension: "ts",
        },
    },
};
exports.default = knexConfig;
