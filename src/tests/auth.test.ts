import request from "supertest";
import app from "../app";

describe("Auth APIs", () => {
  const user = {
  name: "Test User",
  email: `test${Date.now()}@mail.com`,
  password: "123456",
};

it("should signup user", async () => {
  const res = await request(app).post("/auth/signup").send(user);

  expect(res.status).toBe(201);
  expect(res.body.data.token).toBeDefined();
  expect(res.body.data.user.email).toBe(user.email);
  expect(res.body.data.user.password).toBeUndefined();
});

  it("should not allow duplicate signup", async () => {
    const res = await request(app).post("/auth/signup").send(user);

    expect(res.status).toBe(400);
  });

  it("should login user", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.password).toBeUndefined();
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app).post("/auth/signin").send({
      email: user.email,
      password: "wrongpass",
    });

    expect(res.status).toBe(400);
  });
});