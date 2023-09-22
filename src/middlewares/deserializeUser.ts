import { NextFunction, Request, Response } from "express";
import config from "config";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { signToken, verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { User, getUserDetails } from "../services/user.service";
import asyncHandler from "./asyncHandler";

// Custom request interface to include the user in the requests
export interface CustomRequest extends Request {
  user: JwtPayload | null;
}

const refreshAccessToken = async (
  refreshToken: string
): Promise<string | false> => {
  // 1) verify refresh token
  const decoded = verifyToken<User>(refreshToken, "refreshTokenPublicKey");

  if (!decoded) return false;

  // 2) Check if user still exists
  const user = await getUserDetails(decoded.id);

  if (!user) return false;

  // 3) Generate new access token
  const accessToken = signToken(user, "accessTokenPrivateKey", {
    expiresIn: config.get<string>("accessTokenTtl"),
  });

  return accessToken;
};

const deserializeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token and check if it exists
    let accessToken = "";
    const refreshToken = req.headers["x-refresh-token"];

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      accessToken = req.cookies.jwt;
    }

    if (!accessToken || !refreshToken) {
      return next(
        new UnauthorizedError(
          "You are not logged in! Please log in to get access"
        )
      );
    }
    // 2) Verify token
    const decoded = verifyToken<{ id: number; iat: number }>(
      accessToken,
      "accessTokenPublicKey"
    );

    const id = decoded?.id;
    const iat = decoded?.iat; // To check if user changed password after token was issued

    // 3) Check if user still exists
    if (decoded) {
      const currentUser = await getUserDetails(id!);

      if (!currentUser) {
        return next(
          new UnauthorizedError(
            "The user belonging to this token does no longer exist"
          )
        );
      }

      // 4) Check if user changed password after the token was issued
      // @TODO: This will be implemented when the forgot password feature is enabled

      // Grant access to protected route
      (req as CustomRequest).user = decoded;
      return next();
    }

    // 5) Check if accessToken has expired and refresh token still valid
    if (refreshToken) {
      // 5a) Generate new access token using the refresh token
      // @ts-ignore
      const newAccessToken = await refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        return next(
          new UnauthorizedError("Invalid refresh token! Please login again")
        );
      }

      // 5b) Set the new access token on the header field
      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);
      }

      // 5c) Verify the new access token and grant access to protected route
      const decoded = verifyToken<User>(
        newAccessToken as string,
        "accessTokenPublicKey"
      );

      (req as CustomRequest).user = decoded;
      return next();
    }
    return next();
  }
);

export default deserializeUser;
