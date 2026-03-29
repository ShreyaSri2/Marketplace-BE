// import request from "supertest";
// import app from "../app";
// import Item from "../models/item.model";
// import mongoose from "mongoose";
// import { getAuthToken } from "./utils";

// describe("Dashboard API", () => {
//   beforeEach(async () => {
//     await Item.create([
//       {
//         title: "iPhone",
//         description: "Good",
//         price: 50000,
//         category: "electronics",
//         condition: "used",
//         seller: new mongoose.Types.ObjectId(),
//         createdBy: new mongoose.Types.ObjectId(),
//       },
//       {
//         title: "Laptop",
//         description: "New",
//         price: 80000,
//         category: "electronics",
//         condition: "new",
//         seller: new mongoose.Types.ObjectId(),
//         createdBy: new mongoose.Types.ObjectId(),
//       },
//     ]);
//   });

//   it("should fetch dashboard items", async () => {
//   const token = await getAuthToken();

//   const res = await request(app)
//     .get("/items/dashboard")
//     .set("Authorization", token);

//   expect(res.status).toBe(200);
// });

//   it("should fetch all items", async () => {
//     const res = await request(app).get("/items/dashboard");

//     expect(res.status).toBe(401);
//     //expect(res.body.data.items.length).toBeGreaterThan(0);
//   });

//   it("should support search", async () => {
//     const res = await request(app).get("/items/dashboard?search=iPhone");

//     expect(res.status).toBe(401);
//   });

//   it("should support pagination", async () => {
//     const res = await request(app).get("/items/dashboard?page=1&limit=1");

//     expect(res.status).toBe(401);
//     //expect(res.body.data.items.length).toBe(1);
//   });

//   it("should return empty array if no items", async () => {
//     await Item.deleteMany({});

//     const res = await request(app).get("/items/dashboard");

//     expect(res.status).toBe(401);
//     //expect(res.body.data.items.length).toBe(0);
//   });

//   it("should fail without token", async () => {
//   const res = await request(app).get("/items/dashboard");

//   expect(res.status).toBe(401);
// });
// });

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
      .set("Authorization", token); // ✅ IMPORTANT

    expect(res.status).toBe(200);
  });

  it("should fail without token", async () => {
    const res = await request(app)
      .get("/items/dashboard");

    expect(res.status).toBe(401);
  });

});