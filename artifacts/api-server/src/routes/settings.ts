import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

async function ensureSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length === 0) {
    const [data] = await db.insert(settingsTable).values({
      businessName: "Smart Shine Car Valeting Centre",
      address: "Guildford, Surrey",
      phone: "+44 7700 000000",
      email: "info@smartshine.co.uk",
      openTime: "08:00",
      closeTime: "19:00",
      slotDuration: 30,
      workingDays: "Mon,Tue,Wed,Thu,Fri,Sat",
    }).returning();
    return data;
  }
  return rows[0];
}

router.get("/settings", async (_req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ error: "Could not load settings" });
    return res.json({
      businessName: settings.businessName,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      openTime: settings.openTime,
      closeTime: settings.closeTime,
      slotDuration: settings.slotDuration,
      workingDays: typeof settings.workingDays === "string"
        ? settings.workingDays.split(",")
        : settings.workingDays,
    });
  } catch (err) {
    logger.error({ err }, "Get settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ error: "Could not load settings" });
    const { businessName, address, phone, email, openTime, closeTime, slotDuration, workingDays } = req.body;
    const updates: Record<string, unknown> = {};
    if (businessName !== undefined) updates.businessName = businessName;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (openTime !== undefined) updates.openTime = openTime;
    if (closeTime !== undefined) updates.closeTime = closeTime;
    if (slotDuration !== undefined) updates.slotDuration = slotDuration;
    if (workingDays !== undefined) updates.workingDays = Array.isArray(workingDays) ? workingDays.join(",") : workingDays;
    updates.updatedAt = new Date();

    const [data] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, settings.id)).returning();
    if (!data) return res.status(500).json({ error: "Update failed" });
    return res.json({
      businessName: data.businessName,
      address: data.address,
      phone: data.phone,
      email: data.email,
      openTime: data.openTime,
      closeTime: data.closeTime,
      slotDuration: data.slotDuration,
      workingDays: typeof data.workingDays === "string"
        ? data.workingDays.split(",")
        : data.workingDays,
    });
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
