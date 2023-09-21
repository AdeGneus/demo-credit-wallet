import express, { NextFunction, Request, Response } from "express";
import config from "config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

import appErrorHandler from "./middlewares/errorHandler";
import router from "./routes/index";
import { NotFoundError } from "./exceptions/notFoundError";

const app = express();

app.enable("trust proxy");

// Reduce fingerprinting
app.disable("x-powered-by");

// Implement CORS
app.use(cors());
app.options("*", cors());

// Set Content Security Policy (CSP) using appropriate HTTP headers
app.use(helmet());

// Development logging
if (config.get<string>("NODE_ENV") === "development") {
  app.use(morgan("dev"));
}

// Prevent Denial of Service and Brute Force Attack by limiting request from same IP
// This allows 20 requests per minute
const limiter = rateLimit({
  max: 20,
  windowMs: 1 * 60 * 1000,
  message: "Too many request from this IP, please try again later!",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Compress all routes using gzip/deflate
app.use(compression());

// Routes
app.use("/" + config.get<string>("prefix"), router);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(appErrorHandler);

export default app;
