import request from "supertest";
import app from "../app";

export const getAuthToken = async () => {
  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  };

  await request(app).post("/auth/signup").send(user);

  const res = await request(app).post("/auth/signin").send({
    email: user.email,
    password: user.password,
  });

  return res.body.data.token;
};