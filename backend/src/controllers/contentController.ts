import { Request, Response } from "express";
import SiteContent from "../models/SiteContent";

export async function getContent(_req: Request, res: Response): Promise<void> {
  try {
    // Singleton — create document on first read if it doesn't exist yet
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    res.json({ success: true, data: content });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function updateContent(req: Request, res: Response): Promise<void> {
  try {
    const content = await SiteContent.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    res.status(400).json({ success: false, message: msg });
  }
}
