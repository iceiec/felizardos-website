import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);
router.get("/", getSettings);
router.put("/", updateSettings);

export default router;
