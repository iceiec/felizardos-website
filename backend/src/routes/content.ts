import { Router } from "express";
import { getContent, updateContent } from "../controllers/contentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// GET /api/content — public (landing page reads this)
router.get("/", getContent);

// PUT /api/content — admin only
router.put("/", protect, updateContent);

export default router;
