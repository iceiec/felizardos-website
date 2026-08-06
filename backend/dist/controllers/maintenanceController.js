"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = getItems;
exports.getItem = getItem;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.patchStatus = patchStatus;
exports.deleteItem = deleteItem;
const Maintenance_1 = __importDefault(require("../models/Maintenance"));
async function getItems(req, res) {
    try {
        const filter = {};
        if (req.query.facilityId)
            filter.facilityId = req.query.facilityId;
        if (req.query.status)
            filter.status = req.query.status;
        if (req.query.priority)
            filter.priority = req.query.priority;
        const items = await Maintenance_1.default.find(filter).sort({ scheduledDate: 1 });
        res.json({ success: true, data: items });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function getItem(req, res) {
    try {
        const item = await Maintenance_1.default.findById(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, message: "Maintenance item not found" });
            return;
        }
        res.json({ success: true, data: item });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function createItem(req, res) {
    try {
        const item = await Maintenance_1.default.create(req.body);
        res.status(201).json({ success: true, data: item });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function updateItem(req, res) {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        const item = await Maintenance_1.default.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            res.status(404).json({ success: false, message: "Maintenance item not found" });
            return;
        }
        res.json({ success: true, data: item });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function patchStatus(req, res) {
    try {
        const { status } = req.body;
        const item = await Maintenance_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!item) {
            res.status(404).json({ success: false, message: "Maintenance item not found" });
            return;
        }
        res.json({ success: true, data: item });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function deleteItem(req, res) {
    try {
        const item = await Maintenance_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            res.status(404).json({ success: false, message: "Maintenance item not found" });
            return;
        }
        res.json({ success: true, data: null });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//# sourceMappingURL=maintenanceController.js.map