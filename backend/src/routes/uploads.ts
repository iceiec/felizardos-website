import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "..", "public", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-z0-9.-_]/gi, "-").toLowerCase();
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({ storage });

// POST /api/uploads
router.post("/", upload.single("file"), (req, res) => {
  const file = (req as any).file;
  if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

  const host = `${req.protocol}://${req.get("host")}`;
  const url = `${host}/uploads/${file.filename}`;
  res.json({ success: true, data: { url, filename: file.filename } });
});

export default router;
