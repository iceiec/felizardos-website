"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduleController_1 = require("../controllers/scheduleController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public route for inquiries
router.post("/inquiry", scheduleController_1.createSchedule);
// All other schedule routes require admin auth
router.use(authMiddleware_1.protect);
// GET /api/schedules?facilityId=pavilion&date=2025-09-15
router.get("/", scheduleController_1.getSchedules);
router.get("/:id", scheduleController_1.getSchedule);
router.post("/", scheduleController_1.createSchedule);
router.put("/:id", scheduleController_1.updateSchedule);
router.patch("/:id/status", scheduleController_1.patchStatus);
router.delete("/:id", scheduleController_1.deleteSchedule);
exports.default = router;
//# sourceMappingURL=schedules.js.map