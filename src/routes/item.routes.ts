import express from "express";
import { fetchDashboard, createItem, updateItem, deleteItem } from "../controllers/item.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createItemSchema } from "../validations/item.validation";

const router = express.Router();

router.post("/create", authenticate, validate(createItemSchema), createItem);
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);
router.get("/dashboard", authenticate, fetchDashboard);

export default router;