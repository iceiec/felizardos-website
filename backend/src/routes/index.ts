import { Router } from "express";
import authRoutes from "./auth";
import facilityRoutes from "./facilities";
import scheduleRoutes from "./schedules";
import maintenanceRoutes from "./maintenance";
import contentRoutes from "./content";
import settingsRoutes from "./settings";
import miscRoutes from "./misc";
import uploadsRoutes from "./uploads";

const router = Router();

router.use("/auth", authRoutes);
router.use("/facilities", facilityRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/content", contentRoutes);
router.use("/settings", settingsRoutes);
router.use("/", miscRoutes);
router.use("/uploads", uploadsRoutes);

export default router;
