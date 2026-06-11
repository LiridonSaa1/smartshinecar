import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

async function ensureSettings() {
  const { data: rows } = await supabase.from("settings").select("*").limit(1);
  if (!rows || rows.length === 0) {
    const { data } = await supabase.from("settings").insert({
      business_name: "Smart Shine Car Valeting Centre",
      address: "Guildford, Surrey",
      phone: "+44 7700 000000",
      email: "info@smartshine.co.uk",
      open_time: "08:00",
      close_time: "19:00",
      slot_duration: 30,
      working_days: "Mon,Tue,Wed,Thu,Fri,Sat",
    }).select().single();
    return data;
  }
  return rows[0];
}

function mapSettings(row: Record<string, unknown>) {
  const days = typeof row.working_days === "string" ? row.working_days.split(",") : row.working_days;
  return {
    businessName: row.business_name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    openTime: row.open_time,
    closeTime: row.close_time,
    slotDuration: row.slot_duration,
    workingDays: days,
    notificationEmail: row.notification_email ?? null,
    logoUrl: row.logo_url ?? null,
    faviconUrl: row.favicon_url ?? null,
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
      slotDuration, workingDays, notificationEmail, logoUrl, faviconUrl,
    } = req.body;
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (businessName !== undefined) updates.business_name = businessName;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (openTime !== undefined) updates.open_time = openTime;
    if (closeTime !== undefined) updates.close_time = closeTime;
    if (slotDuration !== undefined) updates.slot_duration = slotDuration;
    if (workingDays !== undefined) updates.working_days = Array.isArray(workingDays) ? workingDays.join(",") : workingDays;
    if (notificationEmail !== undefined) updates.notification_email = notificationEmail;
    if (logoUrl !== undefined) updates.logo_url = logoUrl;
    if (faviconUrl !== undefined) updates.favicon_url = faviconUrl;

    const { data, error } = await supabase.from("settings").update(updates).eq("id", settings.id).select().single();
    if (error || !data) return res.status(500).json({ error: "Update failed" });
    return res.json(mapSettings(data));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
