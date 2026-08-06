"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maintenanceController_1 = require("../controllers/maintenanceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
// GET /api/maintenance?facilityId=pool&status=in-progress
router.get("/", maintenanceController_1.getItems);
router.get("/:id", maintenanceController_1.getItem);
router.post("/", maintenanceController_1.createItem);
router.put("/:id", maintenanceController_1.updateItem);
router.patch("/:id/status", maintenanceController_1.patchStatus);
router.delete("/:id", maintenanceController_1.deleteItem);
exports.default = router;
//# sourceMappingURL=maintenance.js.map