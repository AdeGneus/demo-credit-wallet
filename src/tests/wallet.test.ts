import argon2 from "argon2";
import supertest from "supertest";
import app from "../app";
import db from "../db/db";
import UserService from "../services/user.service";
import WalletService from "../services/wallet.service";
import { signToken } from "../utils/jwt";

const createTestUser = async () => {
  const hashedPassword = await argon2.hash("test1234");

  const userOne = {
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    password: hashedPassword,
  };

  const userTwo = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: hashedPassword,
  };

  // Create an access token
  const accessToken = signToken(userTwo, "accessTokenPrivateKey", {
    expiresIn: "5m",
  });

  // Create a refresh token
  const refreshToken = signToken(userTwo, "refreshTokenPrivateKey", {
    expiresIn: "15m",
  });

  return { userOne, userTwo, accessToken, refreshToken };
};

beforeEach(async () => {
  await db("wallets").del();
  await db("users").del();

  const { userOne, userTwo } = await createTestUser();

  const user1 = await UserService.createUser(userOne);
  await WalletService.createWallet(user1.id);

  const user2 = await UserService.createUser(userTwo);
  await WalletService.createWallet(user2.id);
});

describe("fund user", () => {
  describe("if user is authenticated", async () => {
    const { accessToken, refreshToken } = await createTestUser();

    it("should fund existing user's wallet successfully", async () => {
      await supertest(app)
        .post("/api/v1/wallets/fund")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: 100 })
        .expect(200);
    });

    it("should not fund existing user's wallet if amount isn't in the right format", async () => {
      await supertest(app)
        .post("/api/v1/wallets/fund")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: -100 })
        .expect(400);
    });
  });

  describe("if user is not authenticated", async () => {
    it("should not fund existing user's wallet", async () => {
      await supertest(app)
        .post("/api/v1/wallets/fund")
        .send({ amount: 100 })
        .expect(401);
    });
  });
});

describe("transfer funds", () => {
  describe("if user is authenticated", async () => {
    const { accessToken, refreshToken } = await createTestUser();

    it("should correctly transfer funds between users", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ recipientId: 1, amount: 10 })
        .expect(200);
    });

    it("should not make transfer if payload is not in right format", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: 10 })
        .expect(400);
    });

    it("should not make transfer if recipient does not exist", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ recipientId: 100, amount: 10 })
        .expect(404);
    });

    it("should not make transfer if sender's balance is low", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ recipientId: 1, amount: 1000 })
        .expect(400);
    });
  });

  describe("if user is not authenticated", async () => {
    it("should not make transfer", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .send({ recipientId: 1, amount: 10 })
        .expect(401);
    });
  });
});

describe("withdraw funds", () => {
  describe("if user is authenticated", async () => {
    const { accessToken, refreshToken } = await createTestUser();

    it("should withdraw funds successfully", async () => {
      await supertest(app)
        .post("/api/v1/wallets/withdraw")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: 5 })
        .expect(200);
    });

    it("should not make withdrawal if amount is not correct", async () => {
      await supertest(app)
        .post("/api/v1/wallets/withdraw")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: -5 })
        .expect(400);
    });

    it("should not make withdrawal if balance is low", async () => {
      await supertest(app)
        .post("/api/v1/wallets/transfer")
        .set("Authorization", `${accessToken}`)
        .set("x-refresh-token", `${refreshToken}`)
        .send({ amount: 1000 })
        .expect(400);
    });
  });

  describe("if user is not authenticated", async () => {
    it("should not make withdrawal", async () => {
      await supertest(app)
        .post("/api/v1/wallets/withdraw")
        .send({ amount: 5 })
        .expect(401);
    });
  });
});
