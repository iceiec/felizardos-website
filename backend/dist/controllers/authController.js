"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
const env_1 = require("../config/env");
function signToken(id, email) {
    return jsonwebtoken_1.default.sign({ id, email }, env_1.env.JWT_SECRET, {
        expiresIn: env_1.env.JWT_EXPIRES_IN,
    });
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }
        const admin = await Admin_1.default.findOne({ email: email.toLowerCase() });
        if (!admin || !(await admin.comparePassword(password))) {
            res.status(401).json({ success: false, message: "Invalid email or password" });
            return;
        }
        const token = signToken(admin.id, admin.email);
        res.json({
            success: true,
            data: {
                token,
                admin: { id: admin.id, email: admin.email, name: admin.name },
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//# sourceMappingURL=authController.js.map