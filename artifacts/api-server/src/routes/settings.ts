import { Router } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { invalidateEmailConfigCache } from "../lib/email";
import { invalidateSmsConfigCache } from "../lib/sms";

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
    twilioAccountSid: row.twilioAccountSid ?? null,
    twilioAuthToken: row.twilioAuthToken ?? null,
    twilioFromNumber: row.twilioFromNumber ?? null,
    emailNotificationsEnabled: row.emailNotificationsEnabled ?? true,
    smsNotificationsEnabled: row.smsNotificationsEnabled ?? true,
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
      twilioAccountSid, twilioAuthToken, twilioFromNumber,
      emailNotificationsEnabled, smsNotificationsEnabled,
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
    if (twilioAccountSid !== undefined) updates.twilioAccountSid = twilioAccountSid || null;
    if (twilioAuthToken !== undefined) updates.twilioAuthToken = twilioAuthToken || null;
    if (twilioFromNumber !== undefined) updates.twilioFromNumber = twilioFromNumber || null;
    if (emailNotificationsEnabled !== undefined) updates.emailNotificationsEnabled = Boolean(emailNotificationsEnabled);
    if (smsNotificationsEnabled !== undefined) updates.smsNotificationsEnabled = Boolean(smsNotificationsEnabled);

    const [data] = await db.update(settingsTable).set(updates).where(eq(settingsTable.id, settings.id)).returning();
    if (!data) return res.status(500).json({ error: "Update failed" });

    invalidateEmailConfigCache();
    invalidateSmsConfigCache();

    return res.json(mapSettings(data));
  } catch (err) {
    logger.error({ err }, "Update settings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/settings/test-email", async (req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ ok: false, error: "No settings found" });

    const apiKey = settings.brevoApiKey;
    const senderEmail = settings.senderEmail || "noreply@smartshine.co.uk";
    const senderName = settings.senderName || "Smart Shine Car Valeting";
    const toEmail = req.body?.toEmail || settings.notificationEmail || settings.email;

    if (!apiKey) {
      return res.json({ ok: false, error: "Brevo API key is not set. Go to Admin → Settings → Email Notifications and enter your API key." });
    }

    if (!toEmail) {
      return res.json({ ok: false, error: "No recipient email. Set a Notification Email in Admin → Settings." });
    }

    const payload = {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail }],
      subject: "✅ Test email — Smart Shine Car Valeting",
      htmlContent: `<div style="font-family:Arial,sans-serif;padding:24px;max-width:500px">
        <h2 style="color:#0a0f2e">Email is working! ✅</h2>
        <p>Your Brevo email configuration is set up correctly.</p>
        <ul style="font-size:14px;color:#374151">
          <li><strong>API Key:</strong> ${apiKey.slice(0, 12)}…</li>
          <li><strong>Sender:</strong> ${senderName} &lt;${senderEmail}&gt;</li>
          <li><strong>Recipient:</strong> ${toEmail}</li>
        </ul>
        <p style="color:#6b7280;font-size:13px">Sent at ${new Date().toISOString()}</p>
      </div>`,
    };

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await brevoRes.json().catch(() => ({}));

    if (!brevoRes.ok) {
      logger.warn({ status: brevoRes.status, body }, "Test email failed");
      return res.json({
        ok: false,
        status: brevoRes.status,
        error: (body as any).message || JSON.stringify(body),
        details: body,
      });
    }

    return res.json({ ok: true, messageId: (body as any).messageId, sentTo: toEmail });
  } catch (err: any) {
    logger.error({ err }, "Test email error");
    return res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/settings/test-sms", async (req, res) => {
  try {
    const settings = await ensureSettings();
    if (!settings) return res.status(500).json({ ok: false, error: "No settings found" });

    const { twilioAccountSid, twilioAuthToken, twilioFromNumber, phone } = settings;
    const toPhone = req.body?.toPhone || phone;

    if (!twilioAccountSid || !twilioAuthToken || !twilioFromNumber) {
      return res.json({ ok: false, error: "Twilio credentials are not configured." });
    }

    if (!toPhone) {
      return res.json({ ok: false, error: "No phone number to send test SMS to." });
    }

    const { sendSms } = await import("../lib/sms");
    await sendSms(toPhone, `✅ Test SMS from Smart Shine — your Twilio integration is working correctly!`);

    return res.json({ ok: true, sentTo: toPhone });
  } catch (err: any) {
    logger.error({ err }, "Test SMS error");
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
