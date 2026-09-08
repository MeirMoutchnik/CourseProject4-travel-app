import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { User1 } from "../types/Users";

export type AuthRequest = Request & {
  user?: User1 & { userId?: number };
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

function extractToken(authorization?: string): string | null {
  if (!authorization) return null;
  const value = authorization.trim();
  if (!value) return null;
  if (value.toLowerCase().startsWith("bearer ")) {
    return value.slice(7).trim() || null;
  }
  return value;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      hint: "Send header Authorization: Bearer <token> from login response",
    });
  }
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as User1 & {
      userId?: number;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      hint: "Token invalid or expired — login again and copy the new token",
    });
  }
}

export function authorizeAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user?.user_role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
