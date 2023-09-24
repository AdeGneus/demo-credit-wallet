"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const notFoundError_1 = require("./exceptions/notFoundError");
const app = (0, express_1.default)();
app.enable("trust proxy");
// Reduce fingerprinting
app.disable("x-powered-by");
// Implement CORS
app.use((0, cors_1.default)());
app.options("*", (0, cors_1.default)());
// Set Content Security Policy (CSP) using appropriate HTTP headers
app.use((0, helmet_1.default)());
// Development logging
if (config_1.default.get("NODE_ENV") === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Prevent Denial of Service and Brute Force Attack by limiting request from same IP
// This allows 20 requests per minute
const limiter = (0, express_rate_limit_1.default)({
    max: 20,
    windowMs: 1 * 60 * 1000,
    message: "Too many request from this IP, please try again later!",
});
app.use("/api", limiter);
// Body parser
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Compress all routes using gzip/deflate
app.use((0, compression_1.default)());
// Routes
app.use("/" + config_1.default.get("prefix"), index_routes_1.default);
app.use("*", (req, res, next) => {
    next(new notFoundError_1.NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});
// Global error handler
app.use(errorHandler_1.default);
exports.default = app;
