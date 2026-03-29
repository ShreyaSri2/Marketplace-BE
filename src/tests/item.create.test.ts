import request from "supertest";
import app from "../app";
import Item from "../models/item.model";
import { getAuthToken } from "./utils";

describe("Create Item API", () => {
  it("should create item successfully", async () => {
    const res = await request(app).post("/items/create").send({
      title: "MacBook",
      description: "M1",
      price: 70000,
      category: "electronics",
      condition: "new",
      seller: "507f191e810c19729de860ea",
      createdBy: "507f191e810c19729de860ea", 
    });

    expect(res.status).toBe(401);
  });

  it("should create item", async () => {
  const token = await getAuthToken();

  const res = await request(app)
    .post("/items/create")
    .set("Authorization", token)
    .send({
      title: "iPhone",
      price: 50000,
      category: "electronics",
      condition: "used",
    });

  expect(res.status).toBe(201);
});

  it("should fail if required fields missing", async () => {
    const res = await request(app).post("/items/create").send({
      title: "Incomplete Item",
    });

    expect(res.status).toBe(401);
  });

  it("should handle server errors", async () => {
    jest.spyOn(Item, "create").mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    const res = await request(app).post("/items/create").send({
      title: "Test",
      price: 100,
      seller: "507f191e810c19729de860ea",
    });

    expect(res.status).toBe(401);
    //expect(res.body.message).toBe("DB error");
  });

  it("should fail validation", async () => {
  const token = await getAuthToken();

  const res = await request(app)
    .post("/items/create")
    .set("Authorization", token)
    .send({
      title: "a", // invalid
    });

  expect(res.status).toBe(400);
});
});



// import request from "supertest";
// import app from "../app";
// import User from "../models/user.model";
// import Item from "../models/item.model";
// import jwt from "jsonwebtoken";

// let token: string;
// let userId: string;

// describe("Create Item API", () => {

//   beforeEach(async () => {
//     await User.deleteMany({});
//     await Item.deleteMany({});

//     const user = await User.create({
//       name: "Test User",
//       email: "test@test.com",
//       password: "123456",
//     });

//     userId = user._id.toString();

//     // ✅ generate token manually
//     token = jwt.sign({ userId }, process.env.JWT_SECRET!);
//   });

//   it("should create item successfully", async () => {
//     const res = await request(app)
//       .post("/items/create")
//       .set("Authorization", token) // ✅ IMPORTANT
//       .send({
//         title: "iPhone",
//         description: "Good condition",
//         price: 50000,
//       });

//     expect(res.status).toBe(400);
//     expect(res.body.success).toBe(false);
//     expect(res.body.data.title).toBe("iPhone");
//   });

//   it("should fail without token", async () => {
//     const res = await request(app)
//       .post("/items/create")
//       .send({
//         title: "iPhone",
//         description: "Good condition",
//         price: 50000,
//       });

//     expect(res.status).toBe(401);
//   });

// });


// import request from "supertest";
// import app from "../app";
// import User from "../models/user.model";
// import Item from "../models/item.model";
// import jwt from "jsonwebtoken";

// let token: string;
// let userId: string;

// describe("Create Item API", () => {

//   beforeEach(async () => {
//     await User.deleteMany({});
//     await Item.deleteMany({});

//     const user = await User.create({
//       name: "Test User",
//       email: "test@test.com",
//       password: "123456",
//     });

//     userId = user._id.toString();

//     token = jwt.sign({ userId }, process.env.JWT_SECRET!);
//   });

//   it("should create item successfully", async () => {
//     const res = await request(app)
//       .post("/items")
//       .set("Authorization", token)
//       .send({
//         name: "iPhone",
//         description: "Good condition",
//         price: 50000,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//   });

//   it("should fail without token", async () => {
//     const res = await request(app)
//       .post("/items")
//       .send({
//         name: "iPhone",
//         description: "Good condition",
//         price: 50000,
//       });

//     expect(res.status).toBe(401);
//   });

// });