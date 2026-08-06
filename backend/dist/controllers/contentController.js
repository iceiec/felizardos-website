"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContent = getContent;
exports.updateContent = updateContent;
const SiteContent_1 = __importDefault(require("../models/SiteContent"));
async function getContent(_req, res) {
    try {
        // Singleton — create document on first read if it doesn't exist yet
        let content = await SiteContent_1.default.findOne();
        if (!content)
            content = await SiteContent_1.default.create({});
        res.json({ success: true, data: content });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function updateContent(req, res) {
    try {
        const content = await SiteContent_1.default.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true, runValidators: true });
        res.json({ success: true, data: content });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
//# sourceMappingURL=contentController.js.map