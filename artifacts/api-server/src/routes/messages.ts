import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";
import { sendEmail, newContactMessageAdminEmail, newContactMessageUserEmail } from "../lib/email";

const router = Router();

router.get("/messages", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return res.json(data ?? []);
  } catch (err) {
    logger.error({ err }, "List messages error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { name, email, phone, service, message, source } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email and message are required" });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        name,
        email,
        phone: phone ?? null,
        service: service ?? null,
        message,
        source: source ?? "contact",
        status: "unread",
      })
      .select()
      .single();
    if (error) throw error;

    const { data: settingsRows } = await supabase
      .from("settings")
      .select("notification_email, email")
      .limit(1);
    const settings = settingsRows?.[0];
    const adminEmail = (settings as Record<string, unknown>)?.notification_email as string | undefined
      || settings?.email;

    if (adminEmail) {
      sendEmail({
        to: [{ email: adminEmail }],
        subject: `New message from ${name} — Smart Shine`,
        htmlContent: newContactMessageAdminEmail({ name, email, phone, service, message, source }),
        replyTo: { email, name },
      }).catch(err => logger.error({ err }, "Admin notification email failed"));
    }

    if (email) {
      sendEmail({
        to: [{ email, name }],
        subject: "We received your message — Smart Shine Car Valeting",
        htmlContent: newContactMessageUserEmail({ name, message }),
      }).catch(err => logger.error({ err }, "User confirmation email failed"));
    }

    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create message error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/messages/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from("messages")
      .update({ status })
      .eq("id", parseInt(req.params.id))
      .select()
      .single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update message error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", parseInt(req.params.id));
    if (error) throw error;
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete message error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
