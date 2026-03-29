import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { signupSchema, signinSchema } from "../validations/auth.validation";

const router = express.Router();

//router.post("/signup", signup);
//router.post("/signin", signin);
router.post("/signup", validate(signupSchema), signup);
router.post("/signin", validate(signinSchema), signin);
router.post("/signout", signout);

export default router;

