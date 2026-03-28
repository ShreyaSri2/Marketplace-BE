import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import itemRoutes from "./routes/item.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.get("/", (_req, res) => {
  res.send("API is running 🚀");
});

export default app;