import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase";
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

    const { data, error } = await supabase
      .from("customer_accounts")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (error || !data) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, data.password_hash);
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
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_email", customer.email)
      .order("date", { ascending: false })
      .order("time", { ascending: false });

    if (error) throw error;

    return res.json(
      (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id,
        customerName: row.customer_name,
        customerPhone: row.customer_phone,
        customerEmail: row.customer_email,
        serviceId: row.service_id,
        serviceName: row.service_name,
        servicePrice: row.service_price,
        date: row.date,
        time: row.time,
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
      }))
    );
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

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("customer_email", customer.email)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (existing.status === "cancelled" || existing.status === "done") {
      return res.status(400).json({ error: "Booking cannot be cancelled" });
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId)
      .select()
      .single();

    if (error || !data) throw error ?? new Error("Update failed");

    return res.json({ ok: true, status: "cancelled" });
  } catch (err) {
    logger.error({ err }, "Customer cancel booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
