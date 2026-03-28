import request from "supertest";
import app from "../app";
import Item from "../models/item.model";

describe("Create Item API", () => {
  it("should create item successfully", async () => {
    const res = await request(app).post("/items/create").send({
      title: "MacBook",
      description: "M1",
      price: 70000,
      category: "electronics",
      condition: "new",
      seller: "507f191e810c19729de860ea",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("MacBook");
  });

  it("should fail if required fields missing", async () => {
    const res = await request(app).post("/items/create").send({
      title: "Incomplete Item",
    });

    expect(res.status).toBe(500); // since no validation yet
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

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("DB error");
  });
});