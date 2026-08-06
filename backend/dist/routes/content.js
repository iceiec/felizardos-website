"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET /api/content — public (landing page reads this)
router.get("/", contentController_1.getContent);
// PUT /api/content — admin only
router.put("/", authMiddleware_1.protect, contentController_1.updateContent);
exports.default = router;
//# sourceMappingURL=content.js.map