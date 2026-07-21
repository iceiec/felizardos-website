import mongoose, { Schema, Document } from "mongoose";
import type { ISiteContent } from "../types";

export interface SiteContentDocument extends ISiteContent, Document {}

// Singleton document — always findOne() or findOneAndUpdate().
const SiteContentSchema = new Schema<SiteContentDocument>(
  {
    heroTagline: { type: String, default: "Premium Event Venue · Philippines" },
    heroTitle: { type: String, default: "Where Every Moment Becomes" },
    heroHighlight: { type: String, default: "A Memory" },
    heroSubtitle: {
      type: String,
      default:
        "Two stunning venues — an elegant Pavilion and a resort-style Swimming Pool — crafted for celebrations that deserve to be remembered.",
    },
    contactAddress: { type: String, default: "Felizardo's Event Place, Batangas, Philippines" },
    contactPhone: { type: String, default: "+63 912 345 6789" },
    contactEmail: { type: String, default: "events@felizardos.com" },
    contactHours: { type: String, default: "Monday – Saturday, 9:00 AM – 6:00 PM" },
    pavilionDescription: {
      type: String,
      default:
        "An open-air masterpiece embraced by lush greenery and golden natural light. The Pavilion transforms any occasion into an elegant affair — from intimate garden weddings to grand corporate galas — accommodating up to 200 guests in effortless style.",
    },
    poolDescription: {
      type: String,
      default:
        "Dive into a tropical paradise. Our resort-style swimming pool turns any gathering into a sun-soaked celebration — perfect for pool parties, children's birthdays, team-building retreats, and intimate sundowner events.",
    },
  },
  { timestamps: true }
);

export default mongoose.model<SiteContentDocument>("SiteContent", SiteContentSchema);
