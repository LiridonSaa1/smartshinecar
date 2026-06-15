import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { bookingsTable, customerAccountsTable, reviewsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { logger } from "../lib/logger";
import { signCustomerToken, verifyCustomerToken } from "../lib/customerJwt";

const router = Router();

function authCustomer(req: any): { id: number; email: string; name: string } | null {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;
  return verifyCustomerToken(token);
}

router.post("/customer/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const rows = await db.select().from(customerAccountsTable).where(eq(customerAccountsTable.email, email.toLowerCase().trim())).limit(1);
    const data = rows[0];

    if (!data || !data.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, data.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signCustomerToken({ id: data.id, email: data.email, name: data.name });
    return res.json({ token, customer: { id: data.id, email: data.email, name: data.name } });
  } catch (err) {
    logger.error({ err }, "Customer login error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customer/me", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });
  return res.json(customer);
});

router.get("/customer/bookings", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });

  try {
    const data = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.customerEmail, customer.email))
      .orderBy(desc(bookingsTable.date));

    return res.json(data.map(row => ({
      id: row.id,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      customerEmail: row.customerEmail,
      serviceId: row.serviceId,
      serviceName: row.serviceName,
      servicePrice: row.servicePrice,
      date: row.date,
      time: row.time,
      status: row.status,
      notes: row.notes ?? null,
      createdAt: row.createdAt,
      hasReview: row.hasReview ?? false,
    })));
  } catch (err) {
    logger.error({ err }, "Customer get bookings error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/customer/bookings/:id/cancel", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });

  try {
    const bookingId = parseInt(req.params.id);

    const [existing] = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);

    if (!existing || existing.customerEmail !== customer.email) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existing.status === "cancelled" || existing.status === "done") {
      return res.status(400).json({ error: "Booking cannot be cancelled" });
    }

    await db.update(bookingsTable).set({ status: "cancelled" }).where(eq(bookingsTable.id, bookingId));

    return res.json({ ok: true, status: "cancelled" });
  } catch (err) {
    logger.error({ err }, "Customer cancel booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/customer/bookings/:id/edit", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });

  try {
    const bookingId = parseInt(req.params.id);
    const { date, time, notes } = req.body;

    const [existing] = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);

    if (!existing || existing.customerEmail !== customer.email) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existing.status === "cancelled" || existing.status === "done") {
      return res.status(400).json({ error: "Booking cannot be edited" });
    }

    const bookingDate = new Date(existing.date + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ error: "Cannot edit past bookings" });
    }

    const updates: Partial<typeof bookingsTable.$inferInsert> = {};
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (notes !== undefined) updates.notes = notes ?? null;

    const [updated] = await db.update(bookingsTable)
      .set(updates)
      .where(eq(bookingsTable.id, bookingId))
      .returning();

    return res.json({
      id: updated.id,
      date: updated.date,
      time: updated.time,
      notes: updated.notes,
      status: updated.status,
    });
  } catch (err) {
    logger.error({ err }, "Customer edit booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/customer/bookings/:id/note", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });

  try {
    const bookingId = parseInt(req.params.id);
    const { note } = req.body;

    if (typeof note !== "string") {
      return res.status(400).json({ error: "Note must be a string" });
    }

    const [existing] = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);

    if (!existing || existing.customerEmail !== customer.email) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existing.status === "cancelled" || existing.status === "done") {
      return res.status(400).json({ error: "Cannot add notes to this booking" });
    }

    const existingNotes = existing.notes ?? "";
    const customerNoteTag = "[Customer note]";
    const baseNotes = existingNotes.includes(customerNoteTag)
      ? existingNotes.split(customerNoteTag)[0].trimEnd()
      : existingNotes;

    const newNotes = note.trim()
      ? `${baseNotes}${baseNotes ? "\n" : ""}${customerNoteTag} ${note.trim()}`
      : baseNotes;

    const [updated] = await db.update(bookingsTable)
      .set({ notes: newNotes || null })
      .where(eq(bookingsTable.id, bookingId))
      .returning();

    return res.json({ ok: true, notes: updated.notes });
  } catch (err) {
    logger.error({ err }, "Customer add note error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/customer/bookings/:id/review", async (req, res) => {
  const customer = authCustomer(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized" });

  try {
    const bookingId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }
    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({ error: "Comment is required" });
    }

    const [existing] = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.id, bookingId))
      .limit(1);

    if (!existing || existing.customerEmail !== customer.email) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existing.status !== "done") {
      return res.status(400).json({ error: "You can only review completed bookings" });
    }

    if ((existing as any).hasReview) {
      return res.status(400).json({ error: "You have already reviewed this booking" });
    }

    const [review] = await db.insert(reviewsTable).values({
      customerName: existing.customerName,
      rating,
      comment: comment.trim(),
      serviceName: existing.serviceName ?? undefined,
    }).returning();

    await db.update(bookingsTable)
      .set({ hasReview: true } as any)
      .where(eq(bookingsTable.id, bookingId));

    return res.status(201).json({ ok: true, reviewId: review.id });
  } catch (err) {
    logger.error({ err }, "Customer submit review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
