import supertest from "supertest";
import app from "../app";
import db from "../db/db";
import { User } from "../services/user.service";

beforeEach(async () => {
  await db("wallets").del();
  await db("users").del();
});

describe("user signup", () => {
  it("should create a new user successfully", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      })
      .expect(201);

    // Assert that the database was changed correctly
    const user = await db<User>("users")
      .select("*")
      .where("id", response.body.data.id)
      .first();
    expect(user).not.toBeNull();

    // Assertion about the response
    // @ts-ignore
    expect<User>(user?.password).not.toBe("password");
  });

  it("should throw an error if a user's email already exist", async () => {
    await supertest(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      })
      .expect(409);
  });

  it("should throw an error if one of the field is empty", async () => {
    await supertest(app)
      .post("/api/v1/auth/signup")
      .send({
        firstName: "John",
        lastName: "Doe",
        password: "password",
      })
      .expect(400);
  });
});

describe("user login", () => {
  it("should login existing user successfully", async () => {
    await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        email: "john@example.com",
        password: "password",
      })
      .expect(200);
  });

  it("should not login a user if one of the field is empty", async () => {
    await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        password: "password",
      })
      .expect(400);
  });

  it("should not login a user if password is incorrect", async () => {
    await supertest(app)
      .post("/api/v1/auth/login")
      .send({
        email: "john@example.com",
        password: "wrong password",
      })
      .expect(401);
  });
});

describe("user logout", () => {
  it("should logout existing user successfully", async () => {
    await supertest(app).get("/api/v1/auth/logout").expect(200);
  });
});
