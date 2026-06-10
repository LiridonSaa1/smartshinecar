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

router.get("/settings", async (_req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ error: "Could not load settings" });
    return res.json({
      businessName: settings.business_name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      openTime: settings.open_time,
      closeTime: settings.close_time,
      slotDuration: settings.slot_duration,
      workingDays: typeof settings.working_days === "string"
        ? settings.working_days.split(",")
        : settings.working_days,
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
    if (businessName !== undefined) updates.business_name = businessName;
    if (address !== undefined) updates.address = address;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (openTime !== undefined) updates.open_time = openTime;
    if (closeTime !== undefined) updates.close_time = closeTime;
    if (slotDuration !== undefined) updates.slot_duration = slotDuration;
    if (workingDays !== undefined) updates.working_days = Array.isArray(workingDays) ? workingDays.join(",") : workingDays;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("settings").update(updates).eq("id", settings.id).select().single();
    if (error) throw error;
    return res.json({
      businessName: data.business_name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      openTime: data.open_time,
      closeTime: data.close_time,
      slotDuration: data.slot_duration,
      workingDays: typeof data.working_days === "string"
        ? data.working_days.split(",")
        : data.working_days,
    });
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
