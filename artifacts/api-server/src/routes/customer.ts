import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { bookingsTable, customerAccountsTable } from "@workspace/db/schema";
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
      notes: row.notes,
      createdAt: row.createdAt,
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

export default router;
