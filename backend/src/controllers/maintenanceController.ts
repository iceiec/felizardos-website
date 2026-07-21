import { Request, Response } from "express";
import Maintenance from "../models/Maintenance";

export async function getItems(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.facilityId) filter.facilityId = req.query.facilityId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    const items = await Maintenance.find(filter).sort({ scheduledDate: 1 });
    res.json({ success: true, data: items });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getItem(req: Request, res: Response): Promise<void> {
  try {
    const item = await Maintenance.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Maintenance item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createItem(req: Request, res: Response): Promise<void> {
  try {
    const item = await Maintenance.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function updateItem(req: Request, res: Response): Promise<void> {
  try {
    const item = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404).json({ success: false, message: "Maintenance item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function patchStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body as { status: string };
    const item = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404).json({ success: false, message: "Maintenance item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteItem(req: Request, res: Response): Promise<void> {
  try {
    const item = await Maintenance.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: "Maintenance item not found" });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
