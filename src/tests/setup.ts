import mongoose from "mongoose";

beforeAll(async () => {
  jest.setTimeout(30000);

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "test-db",
    });
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});