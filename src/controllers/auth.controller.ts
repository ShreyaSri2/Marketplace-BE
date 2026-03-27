import { Request, Response } from "express";
import { signupService, signinService } from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await signupService(name, email, password);

    res.status(201).json({
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await signinService(email, password);

    res.status(200).json({
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const signout = async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Logout successful" });
};