import mongoose, { Schema, Document } from "mongoose";
import type { ISchedule } from "../types";

export interface ScheduleDocument extends ISchedule, Document {}

const ScheduleSchema = new Schema<ScheduleDocument>(
  {
    facilityId: { type: String, required: true, ref: "Facility" },
    title: { type: String, trim: true, default: "" },
    clientName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    guests: { type: Number, default: null },
    packageName: { type: String, default: "" },
    phone: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for fast calendar queries by date
ScheduleSchema.index({ date: 1 });
ScheduleSchema.index({ facilityId: 1, date: 1 });

export default mongoose.model<ScheduleDocument>("Schedule", ScheduleSchema);
