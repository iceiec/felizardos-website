import mongoose, { Schema, Document } from "mongoose";
import type { IFacility } from "../types";

export interface FacilityDocument extends IFacility, Document {}

const FacilitySchema = new Schema<FacilityDocument>(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["Event Hall", "Recreation", "Basketball Court", "Function Room", "Other"],
    },
    capacity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    description: { type: String, default: "" },
    showOnLanding: { type: Boolean, default: false },
    amenities: [{ type: String, trim: true }],
    rentalPrice: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<FacilityDocument>("Facility", FacilitySchema);
