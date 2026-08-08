import { Request, Response } from "express";
import AdminSettings from "../models/AdminSettings";

export async function getSettings(_req: Request, res: Response): Promise<void> {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message });
  }
}
