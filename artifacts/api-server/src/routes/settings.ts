import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

const EXTRA_SETTINGS_KEY = "extra_settings";

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

async function getExtraSettings(): Promise<Record<string, unknown>> {
  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", EXTRA_SETTINGS_KEY)
    .maybeSingle();
  return (data?.data as Record<string, unknown>) ?? {};
}

async function saveExtraSettings(extra: Record<string, unknown>): Promise<void> {
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", EXTRA_SETTINGS_KEY)
    .maybeSingle();

  if (existing) {
    await supabase.from("site_content")
      .update({ data: extra, updated_at: new Date().toISOString() })
      .eq("key", EXTRA_SETTINGS_KEY);
  } else {
    await supabase.from("site_content")
      .insert({ key: EXTRA_SETTINGS_KEY, data: extra });
  }
}

function mapSettings(row: Record<string, unknown>, extra: Record<string, unknown> = {}) {
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
    notificationEmail: extra.notificationEmail ?? null,
    logoUrl: extra.logoUrl ?? null,
    faviconUrl: extra.faviconUrl ?? null,
    brevoApiKey: extra.brevoApiKey ?? null,
    senderEmail: extra.senderEmail ?? null,
    senderName: extra.senderName ?? null,
  };
}

router.get("/settings", async (_req, res) => {
  try {
    const [settings, extra] = await Promise.all([ensureSettings(), getExtraSettings()]);
    if (!settings) return res.status(500).json({ error: "Could not load settings" });
    return res.json(mapSettings(settings, extra));
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

    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (businessName !== undefined) dbUpdates.business_name = businessName;
    if (address !== undefined) dbUpdates.address = address;
    if (phone !== undefined) dbUpdates.phone = phone;
    if (email !== undefined) dbUpdates.email = email;
    if (openTime !== undefined) dbUpdates.open_time = openTime;
    if (closeTime !== undefined) dbUpdates.close_time = closeTime;
    if (slotDuration !== undefined) dbUpdates.slot_duration = slotDuration;
    if (workingDays !== undefined) dbUpdates.working_days = Array.isArray(workingDays) ? workingDays.join(",") : workingDays;

    const existingExtra = await getExtraSettings();
    const extra: Record<string, unknown> = { ...existingExtra };
    if (notificationEmail !== undefined) extra.notificationEmail = notificationEmail;
    if (logoUrl !== undefined) extra.logoUrl = logoUrl;
    if (faviconUrl !== undefined) extra.faviconUrl = faviconUrl;
    if (brevoApiKey !== undefined) extra.brevoApiKey = brevoApiKey;
    if (senderEmail !== undefined) extra.senderEmail = senderEmail;
    if (senderName !== undefined) extra.senderName = senderName;

    const [{ data, error }] = await Promise.all([
      supabase.from("settings").update(dbUpdates).eq("id", settings.id).select().single(),
      saveExtraSettings(extra),
    ]);

    if (error || !data) return res.status(500).json({ error: "Update failed" });
    return res.json(mapSettings(data, extra));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
