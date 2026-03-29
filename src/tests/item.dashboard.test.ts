import request from "supertest";
import app from "../app";
import User from "../models/user.model";
import Item from "../models/item.model";
import jwt from "jsonwebtoken";

let token: string;

beforeEach(async () => {
  await User.deleteMany({});
  await Item.deleteMany({});

  const user = await User.create({
    name: "Test User",
    email: "test@test.com",
    password: "123456",
  });

  token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

  await Item.create({
    title: "Laptop",
    description: "Good",
    price: 5000,
    seller: user._id,
    createdBy: user._id,
  });
});

describe("Dashboard API", () => {

  it("should fetch dashboard items", async () => {
    const res = await request(app)
      .get("/items/dashboard")
      .set("Authorization", token);

    expect(res.status).toBe(200);
  });

  it("should fail without token", async () => {
    const res = await request(app)
      .get("/items/dashboard");

    expect(res.status).toBe(401);
  });

});