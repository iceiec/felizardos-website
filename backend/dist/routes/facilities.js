"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facilityController_1 = require("../controllers/facilityController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/facilities          — public (landing page reads facility descriptions)
router.get("/", facilityController_1.getFacilities);
router.get("/:id", facilityController_1.getFacility);
// All writes require admin JWT
router.use(authMiddleware_1.protect);
router.post("/", facilityController_1.createFacility);
router.put("/:id", facilityController_1.updateFacility);
router.patch("/:id/status", facilityController_1.patchStatus);
router.patch("/:id/landing", facilityController_1.patchLanding);
router.delete("/:id", facilityController_1.deleteFacility);
exports.default = router;
//# sourceMappingURL=facilities.js.map