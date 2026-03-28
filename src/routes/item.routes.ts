import express from "express";
import { fetchDashboard, createItem } from "../controllers/item.controller";
//import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/dashboard", fetchDashboard);
router.post("/create", createItem);

export default router;