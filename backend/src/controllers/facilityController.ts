import { Request, Response } from "express";
import Facility from "../models/Facility";

export async function getFacilities(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.showOnLanding === "true") filter.showOnLanding = true;
    const facilities = await Facility.find(filter).sort({ name: 1 });
    res.json({ success: true, data: facilities });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

import mongoose from "mongoose";

function getFacilityQuery(paramId: string) {
  if (mongoose.isValidObjectId(paramId)) {
    return { $or: [{ id: paramId }, { _id: paramId }] };
  }
  return { id: paramId };
}

export async function getFacility(req: Request, res: Response): Promise<void> {
  try {
    const facility = await Facility.findOne(getFacilityQuery(req.params.id));
    if (!facility) {
      res.status(404).json({ success: false, message: "Facility not found" });
      return;
    }
    res.json({ success: true, data: facility });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createFacility(req: Request, res: Response): Promise<void> {
  try {
    const body = { ...req.body };
    if (!body.id && body.name) {
      body.id = body.name.toLowerCase().replace(/\s+/g, "-");
    }
    const facility = await Facility.create(body);
    res.status(201).json({ success: true, data: facility });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function updateFacility(req: Request, res: Response): Promise<void> {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    const facility = await Facility.findOneAndUpdate(
      getFacilityQuery(req.params.id),
      updateData,
      { new: true, runValidators: true }
    );
    if (!facility) {
      res.status(404).json({ success: false, message: "Facility not found" });
      return;
    }
    res.json({ success: true, data: facility });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function patchStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body as { status: string };
    const facility = await Facility.findOneAndUpdate(
      getFacilityQuery(req.params.id),
      { status },
      { new: true, runValidators: true }
    );
    if (!facility) {
      res.status(404).json({ success: false, message: "Facility not found" });
      return;
    }
    res.json({ success: true, data: facility });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function patchLanding(req: Request, res: Response): Promise<void> {
  try {
    const { showOnLanding } = req.body as { showOnLanding: boolean };
    const facility = await Facility.findOneAndUpdate(
      getFacilityQuery(req.params.id),
      { showOnLanding },
      { new: true }
    );
    if (!facility) {
      res.status(404).json({ success: false, message: "Facility not found" });
      return;
    }
    res.json({ success: true, data: facility });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteFacility(req: Request, res: Response): Promise<void> {
  try {
    const facility = await Facility.findOneAndDelete(getFacilityQuery(req.params.id));
    if (!facility) {
      res.status(404).json({ success: false, message: "Facility not found" });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
