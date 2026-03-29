// import mongoose from "mongoose";

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI!);
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// import mongoose from "mongoose";

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI!, {
//     dbName: "test-db", // isolate test DB
//   });
// });

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
// });


import mongoose from "mongoose";

beforeAll(async () => {
  jest.setTimeout(30000); // ✅ increase timeout

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