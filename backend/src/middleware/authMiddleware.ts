import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  admin?: { id: string; email: string };
}

interface JwtPayload {
  id: string;
  email: string;
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
