import bcrypt from "bcrypt";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt";

const sanitizeUser = (user: any) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const signupService = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email }).select("+password");
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return {
  user: sanitizeUser(user),
  token,
};
};

export const signinService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  return {
  user: sanitizeUser(user),
  token,
};
};