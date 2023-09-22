import { Request, Response, NextFunction } from "express";
import config from "config";
import argon2 from "argon2";
import asyncHandler from "../middlewares/asyncHandler";
import db from "../db/db";
import { ConflictError } from "../exceptions/conflictError";
import generateAccountNumber from "../utils/generateAccountNumber";
import UserService from "../services/user";
import { signToken } from "../utils/jwt";
import { ClientError } from "../exceptions/clientError";
import { isCorrectPassword } from "../utils/checkPassword";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { getUserDetails } from "../services/user";

const createSendToken = (
  user: Object,
  statusCode: number,
  req: Request,
  res: Response
) => {
  // Create an access token
  const accessToken = signToken(user, "accessTokenPrivateKey", {
    expiresIn: config.get<string>("accessTokenTtl"),
  });

  // Create a refresh token
  const refreshToken = signToken(user, "refreshTokenPrivateKey", {
    expiresIn: config.get<string>("refreshTokenTtl"),
  });

  // Cookie options
  const expires = Number(config.get<string>("cookieExpires")) * 60 * 1000;

  const cookieOptions = {
    expires: new Date(Date.now() + expires),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", accessToken, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    tokens: { accessToken, refreshToken },
    data: { user },
  });
};

class AuthController {
  static signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { firstName, lastName, email, password } = req.body;

      // Check if user already exist
      const existingUser = await db("users").where({ email }).first();

      if (existingUser) {
        return next(new ConflictError("User already exists"));
      }

      // Hash the password before storing it in the database
      const hashedPassword = await argon2.hash(password);

      // Create a new user record
      const userDetails = {
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        account_number: generateAccountNumber(),
      };
      const newUser = await UserService.createUser(userDetails);

      createSendToken(newUser, 201, req, res);
    }
  );

  static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      // Check if email and password exists
      if (!email || !password) {
        return next(new ClientError("Please provide email and password!"));
      }

      // Check if user exists and password is correct
      const user = await UserService.checkUser(email);

      if (!user || !(await isCorrectPassword(user.password, password))) {
        return next(new UnauthorizedError("Incorrect email or password"));
      }

      // if everything is okay, send token to client
      createSendToken(await getUserDetails(user.id), 200, req, res);
    }
  );
}

export default AuthController;
