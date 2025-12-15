import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const foundUser = await prisma.user.findUnique({ where: email });
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
