import { Router } from "express";
import authRoutes from "./auth";
import facilityRoutes from "./facilities";
import scheduleRoutes from "./schedules";
import maintenanceRoutes from "./maintenance";
import contentRoutes from "./content";
import settingsRoutes from "./settings";

const router = Router();

router.use("/auth", authRoutes);
router.use("/facilities", facilityRoutes);
router.use("/schedules", scheduleRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/content", contentRoutes);
router.use("/settings", settingsRoutes);

export default router;
