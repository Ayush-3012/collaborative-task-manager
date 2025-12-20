import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";
import { generateAuthToken } from "../middlewares/auth.middleware.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (foundUser)
      return res.status(409).json({ message: "User already exists" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (typeof password !== "string" || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateAuthToken(user.id);
    res.cookie(process.env.COOKIE_NAME as string, token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    return res.status(200).json({
      message: "User Login Successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME as string, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.json({ message: "User Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const myProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
      },
    });
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
