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
    heroImage: { type: String, default: "" },
    contactAddress: { type: String, default: "Felizardo's Event Place, Batangas, Philippines" },
    contactPhone: { type: String, default: "+63 912 345 6789" },
    contactEmail: { type: String, default: "events@felizardos.com" },
    contactHours: { type: String, default: "Monday – Saturday, 9:00 AM – 6:00 PM" },
    pavilionImage: { type: String, default: "" },
    pavilionDescription: {
      type: String,
      default:
        "An open-air masterpiece embraced by lush greenery and golden natural light. The Pavilion transforms any occasion into an elegant affair — from intimate garden weddings to grand corporate galas — accommodating up to 200 guests in effortless style.",
    },
    pavilionIntro: { type: String, default: "An open-air garden sanctuary for weddings, debuts, and milestone celebrations — up to 200 guests in effortless elegance." },
    pavilionAmenities: { type: [String], default: ["Up to 200 guests", "Full catering kitchen", "Sound system", "Ample parking", "Wi-Fi included", "Event coordinator"] },
    pavilionPackages: {
      type: [
        {
          name: { type: String, default: "" },
          hours: { type: String, default: "" },
          price: { type: String, default: "" },
          features: { type: [String], default: [] },
          highlight: { type: Boolean, default: false },
        },
      ],
      default: [
        {
          name: "Half Day",
          hours: "6 Hours",
          price: "₱15,000",
          features: ["Up to 100 guests", "Basic sound system", "Table & chair setup", "Parking access"],
          highlight: false,
        },
        {
          name: "Full Day",
          hours: "12 Hours",
          price: "₱25,000",
          features: ["Up to 200 guests", "Full PA sound system", "Table, chair & linen setup", "Kitchen access", "Parking access", "Event coordinator"],
          highlight: true,
        },
        {
          name: "Premium",
          hours: "12 Hours + Setup",
          price: "₱38,000",
          features: ["Up to 200 guests", "Full PA + lighting rig", "Styled table & linen setup", "Catering kitchen", "Bridal room", "Dedicated coordinator", "Post-event cleanup"],
          highlight: false,
        },
      ],
    },
    pavilionGallery: { type: [String], default: [] },
    poolImage: { type: String, default: "" },
    poolDescription: {
      type: String,
      default:
        "Dive into a tropical paradise. Our resort-style swimming pool turns any gathering into a sun-soaked celebration — perfect for pool parties, children's birthdays, team-building retreats, and intimate sundowner events.",
    },
    poolIntro: { type: String, default: "A resort-style tropical paradise for pool parties, family celebrations, team events, and sunset gatherings." },
    poolAmenities: { type: [String], default: ["Crystal-clear pool", "Spacious pool deck", "Lifeguard on duty", "Poolside bar", "Underwater LED lighting", "Changing rooms"] },
    poolPackages: {
      type: [
        {
          name: { type: String, default: "" },
          hours: { type: String, default: "" },
          price: { type: String, default: "" },
          features: { type: [String], default: [] },
          highlight: { type: Boolean, default: false },
        },
      ],
      default: [
        {
          name: "Splash",
          hours: "4 Hours",
          price: "₱8,000",
          features: ["Up to 60 guests", "Pool access only", "Basic lounge chairs", "Parking access"],
          highlight: false,
        },
        {
          name: "Wave",
          hours: "8 Hours",
          price: "₱15,000",
          features: ["Up to 100 guests", "Pool + full deck access", "Lounge chairs & umbrellas", "Poolside bar setup", "Bluetooth sound system", "Safety lifeguard"],
          highlight: true,
        },
        {
          name: "Tide",
          hours: "12 Hours",
          price: "₱22,000",
          features: ["Up to 150 guests", "Full pool & deck access", "Premium lounge furniture", "Poolside bar + fridge", "Pro sound system", "Evening LED lighting", "Dedicated coordinator"],
          highlight: false,
        },
      ],
    },
    poolGallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<SiteContentDocument>("SiteContent", SiteContentSchema);
