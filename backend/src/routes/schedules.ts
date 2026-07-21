import { Router } from "express";
import {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  patchStatus,
  deleteSchedule,
} from "../controllers/scheduleController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// All schedule routes require admin auth
router.use(protect);

// GET /api/schedules?facilityId=pavilion&date=2025-09-15
router.get("/", getSchedules);
router.get("/:id", getSchedule);
router.post("/", createSchedule);
router.put("/:id", updateSchedule);
router.patch("/:id/status", patchStatus);
router.delete("/:id", deleteSchedule);

export default router;
