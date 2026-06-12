import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable, settingsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { sendEmail, getNotificationEmail, newContactMessageAdminEmail, newContactMessageUserEmail } from "../lib/email";

const router = Router();

router.get("/messages", async (_req, res) => {
  try {
    const data = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
    return res.json(data);
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

    const [data] = await db.insert(messagesTable).values({
      name,
      email,
      phone: phone ?? null,
      service: service ?? null,
      message,
      source: source ?? "contact",
      status: "unread",
    }).returning();

    const settingsRows = await db.select({ email: settingsTable.email, notificationEmail: settingsTable.notificationEmail }).from(settingsTable).limit(1);
    const fallbackEmail = settingsRows[0]?.email;
    const notifEmail = await getNotificationEmail();
    const adminEmail = notifEmail || settingsRows[0]?.notificationEmail || fallbackEmail;

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
    const [data] = await db.update(messagesTable).set({ status }).where(eq(messagesTable.id, parseInt(req.params.id))).returning();
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update message error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    await db.delete(messagesTable).where(eq(messagesTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete message error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
