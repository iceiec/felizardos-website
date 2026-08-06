"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing required environment variable: ${key}`);
    return val;
}
exports.env = {
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI: requireEnv("MONGODB_URI"),
    JWT_SECRET: requireEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    NODE_ENV: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=env.js.map