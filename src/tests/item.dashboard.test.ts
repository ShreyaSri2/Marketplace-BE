import request from "supertest";
import app from "../app";
import Item from "../models/item.model";
import mongoose from "mongoose";

describe("Dashboard API", () => {
  beforeEach(async () => {
    await Item.create([
      {
        title: "iPhone",
        description: "Good",
        price: 50000,
        category: "electronics",
        condition: "used",
        seller: new mongoose.Types.ObjectId(),
      },
      {
        title: "Laptop",
        description: "New",
        price: 80000,
        category: "electronics",
        condition: "new",
        seller: new mongoose.Types.ObjectId(),
      },
    ]);
  });

  it("should fetch all items", async () => {
    const res = await request(app).get("/items/dashboard");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);
  });

  it("should support search", async () => {
    const res = await request(app).get("/items/dashboard?search=iPhone");

    expect(res.status).toBe(200);
    expect(res.body.data.items[0].title).toMatch(/iphone/i);
  });

  it("should support pagination", async () => {
    const res = await request(app).get("/items/dashboard?page=1&limit=1");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  it("should return empty array if no items", async () => {
    await Item.deleteMany({});

    const res = await request(app).get("/items/dashboard");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(0);
  });
});