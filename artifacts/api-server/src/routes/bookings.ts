import { Router } from "express";
import { db, bookingsTable, servicesTable, settingsTable } from "@workspace/db";
import { eq, and, ne } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    let query = db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    const conditions = [];
    if (status) conditions.push(eq(bookingsTable.status, status));
    if (date) conditions.push(eq(bookingsTable.date, date));
    const data = conditions.length > 0
      ? await db.select().from(bookingsTable).where(and(...conditions)).orderBy(bookingsTable.createdAt)
      : await query;
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "List bookings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/slots", async (req, res) => {
  try {
    const { date, serviceId } = req.query as { date?: string; serviceId?: string };
    if (!date || !serviceId) {
      return res.status(400).json({ error: "date and serviceId required" });
    }

    const [settingsRow] = await db.select().from(settingsTable).limit(1);
    const openTime = settingsRow?.openTime ?? "08:00";
    const closeTime = settingsRow?.closeTime ?? "19:00";
    const slotDuration = settingsRow?.slotDuration ?? 30;

    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, parseInt(serviceId)));
    const serviceDuration = service?.duration ?? slotDuration;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const existingBookings = await db.select({ time: bookingsTable.time })
      .from(bookingsTable)
      .where(and(eq(bookingsTable.date, date), ne(bookingsTable.status, "cancelled")));
    const bookedTimes = new Set(existingBookings.map((b) => b.time));

    const slots = [];
    for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += slotDuration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const time = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      slots.push({ time, available: !bookedTimes.has(time) });
    }
    return res.json(slots);
  } catch (err) {
    logger.error({ err }, "Get slots error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, serviceId, date, time, notes } = req.body;
    if (!customerName || !customerPhone || !serviceId || !date || !time) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    if (!service) return res.status(404).json({ error: "Service not found" });

    const [data] = await db.insert(bookingsTable).values({
      customerName,
      customerPhone,
      customerEmail: customerEmail ?? null,
      serviceId,
      serviceName: service.name,
      servicePrice: service.price,
      date,
      time,
      status: "pending",
      notes: notes ?? null,
    }).returning();

    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const [data] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, parseInt(req.params.id)));
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Get booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, serviceId, date, time, status, notes } = req.body;
    const updates: Record<string, unknown> = {};
    if (customerName !== undefined) updates.customerName = customerName;
    if (customerPhone !== undefined) updates.customerPhone = customerPhone;
    if (customerEmail !== undefined) updates.customerEmail = customerEmail;
    if (serviceId !== undefined) {
      updates.serviceId = serviceId;
      const [svc] = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
      if (svc) { updates.serviceName = svc.name; updates.servicePrice = svc.price; }
    }
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const [data] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, parseInt(req.params.id))).returning();
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
