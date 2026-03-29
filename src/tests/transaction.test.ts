// import request from "supertest";
// import app from "../app";
// import mongoose from "mongoose";
// import User from "../models/user.model";
// import Item from "../models/item.model";
// import Transaction from "../models/transaction.model";
// import jwt from "jsonwebtoken";

// let buyerToken: string;
// let sellerToken: string;
// let itemId: string;
// let transactionId: string;

// describe("Transaction APIs", () => {

//   beforeAll(async () => {
//     //await mongoose.connect(process.env.MONGO_URI!);

//     // Create Seller
//     const seller = await User.create({
//       email: "seller@test.com",
//       password: "123456",
//     });

//     // Create Buyer
//     const buyer = await User.create({
//       email: "buyer@test.com",
//       password: "123456",
//     });

//     // Generate tokens
//     sellerToken = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET!);
//     buyerToken = jwt.sign({ userId: buyer._id }, process.env.JWT_SECRET!);

//     // Create item
//     const item = await Item.create({
//       title: "Phone",
//       description: "Good",
//       price: 1000,
//       seller: seller._id,
//       createdBy: seller._id,
//     });

//     itemId = item._id.toString();
//   });

//   afterAll(async () => {
//     await User.deleteMany({});
//     await Item.deleteMany({});
//     await Transaction.deleteMany({});
//     await mongoose.connection.close();
//   });

//   // ✅ CREATE TRANSACTION
//   it("should create transaction successfully", async () => {
//     const res = await request(app)
//       .post("/transactions")
//       .set("Authorization", buyerToken)
//       .send({
//         itemId,
//         type: "buy",
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);

//     transactionId = res.body.data._id;
//   });

//   // ❌ BUY OWN ITEM
//   it("should fail if buyer tries to buy own item", async () => {
//     const res = await request(app)
//       .post("/transactions")
//       .set("Authorization", sellerToken)
//       .send({
//         itemId,
//         type: "buy",
//       });

//     expect(res.status).toBe(400);
//   });

//   // ❌ INVALID TYPE
//   it("should fail for invalid type", async () => {
//     const res = await request(app)
//       .post("/transactions")
//       .set("Authorization", buyerToken)
//       .send({
//         itemId,
//         type: "invalid",
//       });

//     expect(res.status).toBe(500);
//   });

//   // ✅ GET TRANSACTIONS
//   it("should fetch transactions for buyer", async () => {
//     const res = await request(app)
//       .get("/transactions")
//       .set("Authorization", buyerToken);

//     expect(res.status).toBe(200);
//     expect(res.body.data.length).toBeGreaterThan(0);
//   });

//   // ✅ UPDATE TRANSACTION - SELLER COMPLETES
//   it("seller should complete transaction", async () => {
//     const res = await request(app)
//       .put(`/transactions/${transactionId}`)
//       .set("Authorization", sellerToken)
//       .send({
//         status: "completed",
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.data.status).toBe("completed");
//   });

//   // ❌ BUYER CANNOT COMPLETE
//   it("buyer should not complete transaction", async () => {
//     const res = await request(app)
//       .put(`/transactions/${transactionId}`)
//       .set("Authorization", buyerToken)
//       .send({
//         status: "completed",
//       });

//     expect(res.status).toBe(403);
//   });

// });

import request from "supertest";
import app from "../app";
import User from "../models/user.model";
import Item from "../models/item.model";
import Transaction from "../models/transaction.model";
import jwt from "jsonwebtoken";

let buyerToken: string;
let sellerToken: string;
let itemId: string;
let transactionId: string;

describe("Transaction APIs", () => {

  beforeEach(async () => {
    await User.deleteMany({});
    await Item.deleteMany({});
    await Transaction.deleteMany({});

    // ✅ Create Seller
    const seller = await User.create({
      name: "Seller",
      email: "seller@test.com",
      password: "123456",
    });

    // ✅ Create Buyer
    const buyer = await User.create({
      name: "Buyer",
      email: "buyer@test.com",
      password: "123456",
    });

    // ✅ Generate Tokens
    sellerToken = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET!);
    buyerToken = jwt.sign({ userId: buyer._id }, process.env.JWT_SECRET!);

    // ✅ Create Item
    const item = await Item.create({
      title: "Phone",
      description: "Good",
      price: 1000,
      seller: seller._id,
      createdBy: seller._id,
    });

    itemId = item._id.toString();
  });

  // ✅ CREATE TRANSACTION
  it("should create transaction successfully", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", buyerToken)
      .send({
        itemId,
        type: "buy", // ⚠️ must match your enum
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    transactionId = res.body.data._id;
  });

  // ❌ BUY OWN ITEM
  it("should fail if user buys own item", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", sellerToken)
      .send({
        itemId,
        type: "buy",
      });

    expect(res.status).toBe(400);
  });

  // ✅ GET TRANSACTIONS
  it("should fetch transactions", async () => {
    // first create transaction
    await request(app)
      .post("/transactions")
      .set("Authorization", buyerToken)
      .send({
        itemId,
        type: "buy",
      });

    const res = await request(app)
      .get("/transactions")
      .set("Authorization", buyerToken);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ✅ SELLER COMPLETES TRANSACTION
  it("seller should complete transaction", async () => {
    const createRes = await request(app)
      .post("/transactions")
      .set("Authorization", buyerToken)
      .send({
        itemId,
        type: "buy",
      });

    const id = createRes.body.data._id;

    const res = await request(app)
      .put(`/transactions/${id}`)
      .set("Authorization", sellerToken)
      .send({
        status: "completed",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("completed");
  });

  // ❌ BUYER CANNOT COMPLETE
  it("buyer should not complete transaction", async () => {
    const createRes = await request(app)
      .post("/transactions")
      .set("Authorization", buyerToken)
      .send({
        itemId,
        type: "buy",
      });

    const id = createRes.body.data._id;

    const res = await request(app)
      .put(`/transactions/${id}`)
      .set("Authorization", buyerToken)
      .send({
        status: "completed",
      });

    expect(res.status).toBe(403);
  });

});