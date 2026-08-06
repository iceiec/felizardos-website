import { Request, Response } from "express";
import Schedule from "../models/Schedule";

export async function getSchedules(req: Request, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.facilityId) filter.facilityId = req.query.facilityId;
    if (req.query.date) {
      const d = new Date(req.query.date as string);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    const schedules = await Schedule.find(filter).sort({ date: 1, startTime: 1 });
    res.json({ success: true, data: schedules });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function getSchedule(req: Request, res: Response): Promise<void> {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: schedule });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function createSchedule(req: Request, res: Response): Promise<void> {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function updateSchedule(req: Request, res: Response): Promise<void> {
  try {
    const updateData = { ...req.body };
    delete updateData._id;
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: schedule });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}

export async function patchStatus(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.body as { status: string };
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: schedule });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function deleteSchedule(req: Request, res: Response): Promise<void> {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
