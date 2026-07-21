import mongoose, { Schema, Document } from "mongoose";
import type { IMaintenanceItem } from "../types";

export interface MaintenanceDocument extends IMaintenanceItem, Document {}

const MaintenanceSchema = new Schema<MaintenanceDocument>(
  {
    facilityId: { type: String, required: true, ref: "Facility" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed"],
      default: "scheduled",
    },
    scheduledDate: { type: Date, required: true },
    assignee: { type: String, default: "" },
  },
  { timestamps: true }
);

MaintenanceSchema.index({ facilityId: 1 });
MaintenanceSchema.index({ status: 1 });

export default mongoose.model<MaintenanceDocument>("Maintenance", MaintenanceSchema);
