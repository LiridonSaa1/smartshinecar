import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function formatSettings(s: typeof settingsTable.$inferSelect) {
  return {
    businessName: s.businessName,
    address: s.address,
    phone: s.phone,
    email: s.email,
    openTime: s.openTime,
    closeTime: s.closeTime,
    slotDuration: s.slotDuration,
    workingDays: s.workingDays.split(","),
  };
}

async function ensureSettings() {
  const rows = await db.select().from(settingsTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(settingsTable).values({}).returning();
    return inserted[0];
  }
  return rows[0];
}

router.get("/settings", async (_req, res) => {
  try {
    const settings = await ensureSettings();
    return res.json(formatSettings(settings));
  } catch (err) {
    logger.error({ err }, "Get settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = await ensureSettings();
    const { businessName, address, phone, email, openTime, closeTime, slotDuration, workingDays } = req.body;

    const updated = await db.update(settingsTable).set({
      ...(businessName !== undefined && { businessName }),
      ...(address !== undefined && { address }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(openTime !== undefined && { openTime }),
      ...(closeTime !== undefined && { closeTime }),
      ...(slotDuration !== undefined && { slotDuration }),
      ...(workingDays !== undefined && { workingDays: Array.isArray(workingDays) ? workingDays.join(",") : workingDays }),
      updatedAt: new Date(),
    }).where(eq(settingsTable.id, settings.id)).returning();

    return res.json(formatSettings(updated[0]));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
