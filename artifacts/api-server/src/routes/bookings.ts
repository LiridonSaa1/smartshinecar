import { Router } from "express";
import { db, bookingsTable, servicesTable, settingsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function formatBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    ...b,
    servicePrice: parseFloat(b.servicePrice as unknown as string),
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/bookings", async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    let query = db.select().from(bookingsTable);
    const conditions = [];
    if (status) conditions.push(eq(bookingsTable.status, status));
    if (date) conditions.push(eq(bookingsTable.date, date));
    const rows = conditions.length > 0
      ? await db.select().from(bookingsTable).where(and(...conditions)).orderBy(bookingsTable.createdAt)
      : await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    return res.json(rows.map(formatBooking));
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

    // Get settings for slot duration and hours
    const settingsRows = await db.select().from(settingsTable).limit(1);
    const settings = settingsRows[0];
    const openTime = settings?.openTime ?? "08:00";
    const closeTime = settings?.closeTime ?? "19:00";
    const slotDuration = settings?.slotDuration ?? 30;

    // Get service duration
    const serviceRows = await db.select().from(servicesTable).where(eq(servicesTable.id, parseInt(serviceId)));
    const service = serviceRows[0];
    const serviceDuration = service?.duration ?? slotDuration;

    // Generate all possible slots
    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // Get existing bookings for that date
    const existingBookings = await db.select().from(bookingsTable)
      .where(and(eq(bookingsTable.date, date), sql`${bookingsTable.status} != 'cancelled'`));
    const bookedTimes = new Set(existingBookings.map(b => b.time));

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

    // Fetch service info
    const serviceRows = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
    const service = serviceRows[0];
    if (!service) return res.status(404).json({ error: "Service not found" });

    const rows = await db.insert(bookingsTable).values({
      customerName,
      customerPhone,
      customerEmail: customerEmail ?? null,
      serviceId,
      serviceName: service.name,
      servicePrice: String(service.price),
      date,
      time,
      status: "pending",
      notes: notes ?? null,
    }).returning();

    return res.status(201).json(formatBooking(rows[0]));
  } catch (err) {
    logger.error({ err }, "Create booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(formatBooking(rows[0]));
  } catch (err) {
    logger.error({ err }, "Get booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { customerName, customerPhone, customerEmail, serviceId, date, time, status, notes } = req.body;

    let serviceName: string | undefined;
    let servicePrice: string | undefined;
    if (serviceId) {
      const serviceRows = await db.select().from(servicesTable).where(eq(servicesTable.id, serviceId));
      if (serviceRows[0]) {
        serviceName = serviceRows[0].name;
        servicePrice = String(serviceRows[0].price);
      }
    }

    const rows = await db.update(bookingsTable).set({
      ...(customerName !== undefined && { customerName }),
      ...(customerPhone !== undefined && { customerPhone }),
      ...(customerEmail !== undefined && { customerEmail }),
      ...(serviceId !== undefined && { serviceId }),
      ...(serviceName !== undefined && { serviceName }),
      ...(servicePrice !== undefined && { servicePrice }),
      ...(date !== undefined && { date }),
      ...(time !== undefined && { time }),
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes }),
    }).where(eq(bookingsTable.id, id)).returning();

    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(formatBooking(rows[0]));
  } catch (err) {
    logger.error({ err }, "Update booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
