import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import type { IAdmin } from "../types";

export interface AdminDocument extends IAdmin, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Never send password in JSON responses
AdminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as any).password;
    return ret;
  },
});

export default mongoose.model<AdminDocument>("Admin", AdminSchema);
