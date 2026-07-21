import { Router } from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  patchStatus,
  deleteItem,
} from "../controllers/maintenanceController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

// GET /api/maintenance?facilityId=pool&status=in-progress
router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.put("/:id", updateItem);
router.patch("/:id/status", patchStatus);
router.delete("/:id", deleteItem);

export default router;
