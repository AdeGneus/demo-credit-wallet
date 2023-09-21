import { NextFunction, Request, Response } from "express";
import config from "config";
import { AppError, IResponseError } from "../exceptions/appError";
import log from "../utils/logger";

export const sendErrorDev = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

export const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    // 1)  Operational, trusted error: send message to client
    if (err instanceof AppError && err.isOperational) {
      const appError = err as AppError;

      let response = {
        status: appError.status,
        message: appError.message,
      } as IResponseError;

      return res.status(appError.statusCode).json(response);
    }
    // 2) Programming or other unknown error: don't leak error details
    log.error(`💥: ${err}`);

    // Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  const env = config.get<string>("NODE_ENV");

  if (env === "development") {
    sendErrorDev(err, req, res);
  } else if (env === "production") {
    sendErrorProd(err, req, res);
  }
};

export default errorHandler;
