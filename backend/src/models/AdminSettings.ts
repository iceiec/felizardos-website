import mongoose, { Schema, Document } from "mongoose";
import type { IAdminSettings } from "../types";

export interface AdminSettingsDocument extends IAdminSettings, Document {}

const AdminSettingsSchema = new Schema<AdminSettingsDocument>(
  {
    venueName: { type: String, default: "Felizardo's Event Place" },
    address: { type: String, default: "Felizardo's Event Place, Batangas, Philippines" },
    phone: { type: String, default: "+63 912 345 6789" },
    email: { type: String, default: "events@felizardos.com" },
    hours: { type: String, default: "Monday – Saturday, 9:00 AM – 6:00 PM" },
    notifyNewBooking: { type: Boolean, default: true },
    notifyMaintenance: { type: Boolean, default: true },
    notifyPayment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<AdminSettingsDocument>("AdminSettings", AdminSettingsSchema);
