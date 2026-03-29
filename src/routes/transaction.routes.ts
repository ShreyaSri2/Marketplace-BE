import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transaction.controller";

const router = express.Router();

router.post("/", authenticate, createTransaction);
router.get("/", authenticate, getTransactions);
router.put("/:id", authenticate, updateTransaction);

export default router;