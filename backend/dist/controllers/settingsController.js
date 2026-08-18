"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
const AdminSettings_1 = __importDefault(require("../models/AdminSettings"));
async function getSettings(_req, res) {
    try {
        let settings = await AdminSettings_1.default.findOne();
        if (!settings)
            settings = await AdminSettings_1.default.create({});
        res.json({ success: true, data: settings });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function updateSettings(req, res) {
    try {
        const settings = await AdminSettings_1.default.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true, runValidators: true });
        res.json({ success: true, data: settings });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message });
    }
}
//# sourceMappingURL=settingsController.js.map