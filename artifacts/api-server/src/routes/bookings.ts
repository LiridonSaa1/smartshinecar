import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    let query = supabase.from("bookings").select("*").order("created_at");
    if (status) query = query.eq("status", status);
    if (date) query = query.eq("date", date);
    const { data, error } = await query;
    if (error) throw error;
    return res.json(data ?? []);
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

    const { data: settingsRows } = await supabase.from("settings").select("*").limit(1);
    const settings = settingsRows?.[0];
    const openTime = settings?.open_time ?? "08:00";
    const closeTime = settings?.close_time ?? "19:00";
    const slotDuration = settings?.slot_duration ?? 30;

    const { data: serviceRows } = await supabase.from("services").select("*").eq("id", parseInt(serviceId)).limit(1);
    const service = serviceRows?.[0];
    const serviceDuration = service?.duration ?? slotDuration;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("time")
      .eq("date", date)
      .neq("status", "cancelled");
    const bookedTimes = new Set((existingBookings ?? []).map((b: { time: string }) => b.time));

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

    const { data: serviceRows } = await supabase.from("services").select("*").eq("id", serviceId).limit(1);
    const service = serviceRows?.[0];
    if (!service) return res.status(404).json({ error: "Service not found" });

    const { data, error } = await supabase.from("bookings").insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail ?? null,
      service_id: serviceId,
      service_name: service.name,
      service_price: service.price,
      date,
      time,
      status: "pending",
      notes: notes ?? null,
    }).select().single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("bookings").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
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
    if (customerName !== undefined) updates.customer_name = customerName;
    if (customerPhone !== undefined) updates.customer_phone = customerPhone;
    if (customerEmail !== undefined) updates.customer_email = customerEmail;
    if (serviceId !== undefined) {
      updates.service_id = serviceId;
      const { data: svc } = await supabase.from("services").select("*").eq("id", serviceId).single();
      if (svc) { updates.service_name = svc.name; updates.service_price = svc.price; }
    }
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase.from("bookings").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("bookings").delete().eq("id", req.params.id);
    if (error) throw error;
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
