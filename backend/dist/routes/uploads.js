"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, "..", "..", "public", "uploads");
fs_1.default.mkdirSync(uploadsDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
        cb(null, `${Date.now()}-${safe}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// POST /api/uploads
router.post("/", upload.single("file"), (req, res) => {
    const file = req.file;
    if (!file)
        return res.status(400).json({ success: false, message: "No file uploaded" });
    const host = `${req.protocol}://${req.get("host")}`;
    const url = `${host}/uploads/${file.filename}`;
    res.json({ success: true, data: { url, filename: file.filename } });
});
exports.default = router;
//# sourceMappingURL=uploads.js.map