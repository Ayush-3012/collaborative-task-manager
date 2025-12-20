import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

export const generateAuthToken = (userId: string): string =>
  jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies[process.env.COOKIE_NAME as string];
    if (!token?.trim())
      return res.status(401).json({ message: "Token Not Received" });

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error(error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
