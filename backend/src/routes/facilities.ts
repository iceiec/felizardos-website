import { Router } from "express";
import {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  patchStatus,
  patchLanding,
  deleteFacility,
} from "../controllers/facilityController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// GET /api/facilities          — public (landing page reads facility descriptions)
router.get("/", getFacilities);
router.get("/:id", getFacility);

// All writes require admin JWT
router.use(protect);
router.post("/", createFacility);
router.put("/:id", updateFacility);
router.patch("/:id/status", patchStatus);
router.patch("/:id/landing", patchLanding);
router.delete("/:id", deleteFacility);

export default router;
