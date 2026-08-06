"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const facilities_1 = __importDefault(require("./facilities"));
const schedules_1 = __importDefault(require("./schedules"));
const maintenance_1 = __importDefault(require("./maintenance"));
const content_1 = __importDefault(require("./content"));
const router = (0, express_1.Router)();
router.use("/auth", auth_1.default);
router.use("/facilities", facilities_1.default);
router.use("/schedules", schedules_1.default);
router.use("/maintenance", maintenance_1.default);
router.use("/content", content_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map