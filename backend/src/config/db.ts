import mongoose from "mongoose";
import { env } from "./env";
import Admin from "../models/Admin";

export async function ensureDefaultAdmin(): Promise<void> {
  const email = "admin@felizardos.com";
  const password = "felizardos2025";

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return;
  }

  await Admin.create({
    email,
    password,
    name: "Felizardo Admin",
    role: "admin",
  });

  console.log(`Created default admin user: ${email} / ${password}`);
}

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    await ensureDefaultAdmin();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
