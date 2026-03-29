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

    const seller = await User.create({
      name: "Seller",
      email: "seller@test.com",
      password: "123456",
    });

    const buyer = await User.create({
      name: "Buyer",
      email: "buyer@test.com",
      password: "123456",
    });

    sellerToken = jwt.sign({ userId: seller._id }, process.env.JWT_SECRET!);
    buyerToken = jwt.sign({ userId: buyer._id }, process.env.JWT_SECRET!);

    const item = await Item.create({
      title: "Phone",
      description: "Good",
      price: 1000,
      seller: seller._id,
      createdBy: seller._id,
    });

    itemId = item._id.toString();
  });

  it("should create transaction successfully", async () => {
    const res = await request(app)
      .post("/transactions")
      .set("Authorization", buyerToken)
      .send({
        itemId,
        type: "buy",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    transactionId = res.body.data._id;
  });

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

  it("should fetch transactions", async () => {
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