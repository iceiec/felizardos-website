import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import { env } from "../config/env";

function signToken(id: string, email: string): string {
  return jwt.sign({ id, email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = signToken(admin.id, admin.email);

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
