import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
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

function mapSettings(row: typeof settingsTable.$inferSelect) {
  const days = typeof row.workingDays === "string" ? row.workingDays.split(",") : row.workingDays;
  return {
    businessName: row.businessName,
    address: row.address,
    phone: row.phone,
    email: row.email,
    openTime: row.openTime,
    closeTime: row.closeTime,
    slotDuration: row.slotDuration,
    workingDays: days,
    notificationEmail: row.notificationEmail ?? null,
    logoUrl: row.logoUrl ?? null,
    faviconUrl: row.faviconUrl ?? null,
    brevoApiKey: row.brevoApiKey ?? null,
    senderEmail: row.senderEmail ?? null,
    senderName: row.senderName ?? null,
  };
}

router.get("/settings", async (_req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ error: "Could not load settings" });
    return res.json(mapSettings(settings));
  } catch (err) {
    logger.error({ err }, "Get settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ error: "Could not load settings" });

    const {
      businessName, address, phone, email, openTime, closeTime,
      slotDuration, workingDays,
      notificationEmail, logoUrl, faviconUrl, brevoApiKey, senderEmail, senderName,
    } = req.body;

    const updates: Partial<typeof settingsTable.$inferInsert> = { updatedAt: new Date() };
    if (businessName !== undefined) updates.businessName = businessName;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (openTime !== undefined) updates.openTime = openTime;
    if (closeTime !== undefined) updates.closeTime = closeTime;
    if (slotDuration !== undefined) updates.slotDuration = slotDuration;
    if (workingDays !== undefined) updates.workingDays = Array.isArray(workingDays) ? workingDays.join(",") : workingDays;
    if (notificationEmail !== undefined) updates.notificationEmail = notificationEmail;
    if (logoUrl !== undefined) updates.logoUrl = logoUrl;
    if (faviconUrl !== undefined) updates.faviconUrl = faviconUrl;
    if (brevoApiKey !== undefined) updates.brevoApiKey = brevoApiKey;
    if (senderEmail !== undefined) updates.senderEmail = senderEmail;
    if (senderName !== undefined) updates.senderName = senderName;

    const [data] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, settings.id)).returning();
    if (!data) return res.status(500).json({ error: "Update failed" });
    return res.json(mapSettings(data));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
