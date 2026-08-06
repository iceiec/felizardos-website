"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchedules = getSchedules;
exports.getSchedule = getSchedule;
exports.createSchedule = createSchedule;
exports.updateSchedule = updateSchedule;
exports.patchStatus = patchStatus;
exports.deleteSchedule = deleteSchedule;
const Schedule_1 = __importDefault(require("../models/Schedule"));
async function getSchedules(req, res) {
    try {
        const filter = {};
        if (req.query.facilityId)
            filter.facilityId = req.query.facilityId;
        if (req.query.date) {
            const d = new Date(req.query.date);
            const next = new Date(d);
            next.setDate(next.getDate() + 1);
            filter.date = { $gte: d, $lt: next };
        }
        const schedules = await Schedule_1.default.find(filter).sort({ date: 1, startTime: 1 });
        res.json({ success: true, data: schedules });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function getSchedule(req, res) {
    try {
        const schedule = await Schedule_1.default.findById(req.params.id);
        if (!schedule) {
            res.status(404).json({ success: false, message: "Schedule not found" });
            return;
        }
        res.json({ success: true, data: schedule });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function createSchedule(req, res) {
    try {
        const schedule = await Schedule_1.default.create(req.body);
        res.status(201).json({ success: true, data: schedule });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function updateSchedule(req, res) {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        const schedule = await Schedule_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!schedule) {
            res.status(404).json({ success: false, message: "Schedule not found" });
            return;
        }
        res.json({ success: true, data: schedule });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function patchStatus(req, res) {
    try {
        const { status } = req.body;
        const schedule = await Schedule_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!schedule) {
            res.status(404).json({ success: false, message: "Schedule not found" });
            return;
        }
        res.json({ success: true, data: schedule });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function deleteSchedule(req, res) {
    try {
        const schedule = await Schedule_1.default.findByIdAndDelete(req.params.id);
        if (!schedule) {
            res.status(404).json({ success: false, message: "Schedule not found" });
            return;
        }
        res.json({ success: true, data: null });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//# sourceMappingURL=scheduleController.js.map