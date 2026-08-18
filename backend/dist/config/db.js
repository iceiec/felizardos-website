"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultAdmin = ensureDefaultAdmin;
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const Admin_1 = __importDefault(require("../models/Admin"));
async function ensureDefaultAdmin() {
    const email = "admin@felizardos.com";
    const password = "felizardos2025";
    const existingAdmin = await Admin_1.default.findOne({ email });
    if (existingAdmin) {
        return;
    }
    await Admin_1.default.create({
        email,
        password,
        name: "Felizardo Admin",
        role: "admin",
    });
    console.log(`Created default admin user: ${email} / ${password}`);
}
async function connectDB() {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI);
        console.log(`MongoDB connected: ${mongoose_1.default.connection.host}`);
        await ensureDefaultAdmin();
    }
    catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map