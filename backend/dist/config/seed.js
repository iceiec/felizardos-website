"use strict";
// Run with: npm run seed
// Seeds the database with initial facilities, sample schedules, maintenance tasks,
// default site content, and the admin user.
// Safe to run multiple times — uses upsert / findOrCreate patterns.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const Admin_1 = __importDefault(require("../models/Admin"));
const Facility_1 = __importDefault(require("../models/Facility"));
const Schedule_1 = __importDefault(require("../models/Schedule"));
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
const SiteContent_1 = __importDefault(require("../models/SiteContent"));
const AdminSettings_1 = __importDefault(require("../models/AdminSettings"));
const addDays = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
};
async function seed() {
    await (0, db_1.connectDB)();
    console.log("Seeding database...");
    // Admin user
    const existingAdmin = await Admin_1.default.findOne({ email: "admin@felizardos.com" });
    if (!existingAdmin) {
        await Admin_1.default.create({
            email: "admin@felizardos.com",
            password: "felizardos2025",
            name: "Felizardo Admin",
            role: "admin",
        });
        console.log("Created admin user: admin@felizardos.com / felizardos2025");
    }
    else {
        console.log("Admin user already exists — skipping");
    }
    // Facilities
    const facilities = [
        {
            id: "pavilion",
            name: "The Pavilion",
            type: "Event Hall",
            capacity: 200,
            status: "active",
            showOnLanding: true,
            description: "An open-air garden sanctuary for weddings, debuts, and milestone celebrations — up to 200 guests in effortless elegance.",
            amenities: ["Garden backdrop", "Full catering kitchen", "Sound system", "Bridal suite", "Free parking", "Backup generator"],
            rentalPrice: 25000,
        },
        {
            id: "pool",
            name: "Swimming Pool",
            type: "Recreation",
            capacity: 150,
            status: "active",
            showOnLanding: true,
            description: "A resort-style tropical paradise for pool parties, family celebrations, team events, and sunset gatherings.",
            amenities: ["Crystal-clear pool", "Lounge deck", "Lifeguard on duty", "Poolside bar", "Underwater LED lighting", "Changing rooms"],
            rentalPrice: 15000,
        },
        {
            id: "andoy",
            name: "Andoy Court",
            type: "Basketball Court",
            capacity: 50,
            status: "active",
            showOnLanding: false,
            description: "Full-size outdoor basketball court with quality flooring and night lighting.",
            amenities: ["Full-size court", "Night lighting", "Bleacher seating", "Ball rental available", "Scoreboard", "Restroom access"],
            rentalPrice: 5000,
        },
        {
            id: "juliet",
            name: "Juliet Court",
            type: "Basketball Court",
            capacity: 50,
            status: "maintenance",
            showOnLanding: false,
            description: "Full-size outdoor basketball court — currently undergoing floor refinishing.",
            amenities: ["Full-size court", "Night lighting", "Bleacher seating", "Ball rental available", "Scoreboard", "Restroom access"],
            rentalPrice: 5000,
        },
    ];
    for (const f of facilities) {
        await Facility_1.default.findOneAndUpdate({ id: f.id }, f, { upsert: true, new: true });
    }
    console.log(`Upserted ${facilities.length} facilities`);
    // Site content (singleton)
    await SiteContent_1.default.findOneAndUpdate({}, {
        heroTagline: "Premium Event Venue · Philippines",
        heroTitle: "Where Every Moment Becomes",
        heroHighlight: "A Memory",
        heroSubtitle: "Two stunning venues — an elegant Pavilion and a resort-style Swimming Pool — crafted for celebrations that deserve to be remembered.",
        heroImage: "",
        contactAddress: "Felizardo's Event Place, Batangas, Philippines",
        contactPhone: "+63 912 345 6789",
        contactEmail: "events@felizardos.com",
        contactHours: "Monday – Saturday, 9:00 AM – 6:00 PM",
        pavilionImage: "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=1200&h=900&fit=crop&auto=format",
        pavilionDescription: "An open-air masterpiece embraced by lush greenery and golden natural light. The Pavilion transforms any occasion into an elegant affair — from intimate garden weddings to grand corporate galas.",
        pavilionIntro: "An open-air garden sanctuary for weddings, debuts, and milestone celebrations — up to 200 guests in effortless elegance.",
        pavilionAmenities: ["Up to 200 guests", "Full catering kitchen", "Sound system", "Ample parking", "Wi-Fi included", "Event coordinator"],
        pavilionPackages: [
            { name: "Half Day", hours: "6 Hours", price: "₱15,000", features: ["Up to 100 guests", "Basic sound system", "Table & chair setup", "Parking access"], highlight: false },
            { name: "Full Day", hours: "12 Hours", price: "₱25,000", features: ["Up to 200 guests", "Full PA sound system", "Table, chair & linen setup", "Kitchen access", "Parking access", "Event coordinator"], highlight: true },
            { name: "Premium", hours: "12 Hours + Setup", price: "₱38,000", features: ["Up to 200 guests", "Full PA + lighting rig", "Styled table & linen setup", "Catering kitchen", "Bridal room", "Dedicated coordinator", "Post-event cleanup"], highlight: false },
        ],
        pavilionGallery: [
            "https://images.unsplash.com/photo-1767131626424-c4ab452bb34b?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1665607437981-973dcd6a22bb?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1780682569879-f271082ae2cd?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1768791211104-7f1c5474f07d?w=1200&h=900&fit=crop&auto=format",
        ],
        poolImage: "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=1200&h=900&fit=crop&auto=format",
        poolDescription: "Dive into a tropical paradise. Our resort-style swimming pool turns any gathering into a sun-soaked celebration.",
        poolIntro: "A resort-style tropical paradise for pool parties, family celebrations, team events, and sunset gatherings.",
        poolAmenities: ["Crystal-clear pool", "Spacious pool deck", "Lifeguard on duty", "Poolside bar", "Underwater LED lighting", "Changing rooms"],
        poolPackages: [
            { name: "Splash", hours: "4 Hours", price: "₱8,000", features: ["Up to 60 guests", "Pool access only", "Basic lounge chairs", "Parking access"], highlight: false },
            { name: "Wave", hours: "8 Hours", price: "₱15,000", features: ["Up to 100 guests", "Pool + full deck access", "Lounge chairs & umbrellas", "Poolside bar setup", "Bluetooth sound system", "Safety lifeguard"], highlight: true },
            { name: "Tide", hours: "12 Hours", price: "₱22,000", features: ["Up to 150 guests", "Full pool & deck access", "Premium lounge furniture", "Poolside bar + fridge", "Pro sound system", "Evening LED lighting", "Dedicated coordinator"], highlight: false },
        ],
        poolGallery: [
            "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1780631742148-13fe417205d9?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200&h=900&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1761138785581-194503520539?w=1200&h=900&fit=crop&auto=format",
        ],
    }, { upsert: true });
    console.log("Upserted site content");
    // Admin settings (singleton)
    await AdminSettings_1.default.findOneAndUpdate({}, {
        venueName: "Felizardo's Event Place",
        address: "Felizardo's Event Place, Batangas, Philippines",
        phone: "+63 912 345 6789",
        email: "events@felizardos.com",
        hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
        notifyNewBooking: true,
        notifyMaintenance: true,
        notifyPayment: false,
    }, { upsert: true });
    console.log("Upserted admin settings");
    // Sample schedules (only if collection is empty)
    const scheduleCount = await Schedule_1.default.countDocuments();
    if (scheduleCount === 0) {
        await Schedule_1.default.insertMany([
            { facilityId: "pavilion", title: "Santos Wedding Reception", clientName: "Jose & Maria Santos", date: addDays(3), startTime: "15:00", endTime: "22:00", status: "confirmed", guests: 180, packageName: "Premium", phone: "+63 912 111 2222", notes: "White & gold theme." },
            { facilityId: "pool", title: "Cruz Family Pool Party", clientName: "Ricardo Cruz", date: addDays(1), startTime: "10:00", endTime: "18:00", status: "confirmed", guests: 60, packageName: "Wave", phone: "+63 917 222 3333", notes: "Birthday party for 7-year-old." },
            { facilityId: "pavilion", title: "Reyes 18th Debut", clientName: "Ana Reyes", date: addDays(8), startTime: "16:00", endTime: "23:00", status: "confirmed", guests: 150, packageName: "Full Day", phone: "+63 918 333 4444", notes: "Lilac and white motif." },
            { facilityId: "andoy", clientName: "Brgy. San Isidro", date: addDays(5), startTime: "08:00", endTime: "17:00", status: "confirmed", phone: "+63 920 444 5555" },
        ]);
        console.log("Inserted sample schedules");
    }
    // Sample maintenance (only if collection is empty)
    const maintenanceCount = await Maintenance_1.default.countDocuments();
    if (maintenanceCount === 0) {
        await Maintenance_1.default.insertMany([
            { facilityId: "pool", title: "Monthly Pool Filter Cleaning", description: "Full backwash and chemical balance check.", priority: "high", status: "in-progress", scheduledDate: addDays(1), assignee: "Maintenance Team A" },
            { facilityId: "juliet", title: "Court Floor Refinishing", description: "Sanding and recoating of hardwood floor.", priority: "medium", status: "in-progress", scheduledDate: new Date(), assignee: "Flooring Contractor — Reyes Works" },
            { facilityId: "andoy", title: "Court Night Lighting Repair", description: "Two flood light bulbs burnt out.", priority: "high", status: "scheduled", scheduledDate: addDays(4), assignee: "Electrician — J. Magsino" },
        ]);
        console.log("Inserted sample maintenance tasks");
    }
    console.log("Seeding complete.");
    process.exit(0);
}
seed().catch(err => {
    console.error("Seed error:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map