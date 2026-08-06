"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacilities = getFacilities;
exports.getFacility = getFacility;
exports.createFacility = createFacility;
exports.updateFacility = updateFacility;
exports.patchStatus = patchStatus;
exports.patchLanding = patchLanding;
exports.deleteFacility = deleteFacility;
const Facility_1 = __importDefault(require("../models/Facility"));
async function getFacilities(req, res) {
    try {
        const filter = {};
        if (req.query.showOnLanding === "true")
            filter.showOnLanding = true;
        const facilities = await Facility_1.default.find(filter).sort({ name: 1 });
        res.json({ success: true, data: facilities });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
const mongoose_1 = __importDefault(require("mongoose"));
function getFacilityQuery(paramId) {
    if (mongoose_1.default.isValidObjectId(paramId)) {
        return { $or: [{ id: paramId }, { _id: paramId }] };
    }
    return { id: paramId };
}
async function getFacility(req, res) {
    try {
        const facility = await Facility_1.default.findOne(getFacilityQuery(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: facility });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function createFacility(req, res) {
    try {
        const body = { ...req.body };
        if (!body.id && body.name) {
            body.id = body.name.toLowerCase().replace(/\s+/g, "-");
        }
        const facility = await Facility_1.default.create(body);
        res.status(201).json({ success: true, data: facility });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function updateFacility(req, res) {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        const facility = await Facility_1.default.findOneAndUpdate(getFacilityQuery(req.params.id), updateData, { new: true, runValidators: true });
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: facility });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Server error";
        res.status(400).json({ success: false, message: msg });
    }
}
async function patchStatus(req, res) {
    try {
        const { status } = req.body;
        const facility = await Facility_1.default.findOneAndUpdate(getFacilityQuery(req.params.id), { status }, { new: true, runValidators: true });
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: facility });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function patchLanding(req, res) {
    try {
        const { showOnLanding } = req.body;
        const facility = await Facility_1.default.findOneAndUpdate(getFacilityQuery(req.params.id), { showOnLanding }, { new: true });
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: facility });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
async function deleteFacility(req, res) {
    try {
        const facility = await Facility_1.default.findOneAndDelete(getFacilityQuery(req.params.id));
        if (!facility) {
            res.status(404).json({ success: false, message: "Facility not found" });
            return;
        }
        res.json({ success: true, data: null });
    }
    catch {
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//# sourceMappingURL=facilityController.js.map