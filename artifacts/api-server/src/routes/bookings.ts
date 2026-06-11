import { Router } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";
import { sendEmail, newBookingAdminEmail, bookingConfirmedCustomerEmail, bookingReadyCustomerEmail, customerWelcomeEmail } from "../lib/email";

const router = Router();

function mapBooking(row: Record<string, unknown>) {
  return {
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
  };
}

function generatePassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function getOrCreateCustomerAccount(
  email: string,
  name: string
): Promise<{ isNew: boolean; password?: string }> {
  const { data: existing } = await supabase
    .from("customer_accounts")
    .select("id")
    .eq("email", email.toLowerCase())
    .single();

  if (existing) return { isNew: false };

  const password = generatePassword();
  const password_hash = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("customer_accounts").insert({
    email: email.toLowerCase(),
    name,
    password_hash,
  });

  if (error) throw error;
  return { isNew: true, password };
}

async function getAdminNotificationEmail(): Promise<string | null> {
  const { data } = await supabase.from("settings").select("notification_email, email").limit(1);
  const row = data?.[0] as Record<string, unknown> | undefined;
  return (row?.notification_email as string) || (row?.email as string) || null;
}

router.get("/bookings", async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    let query = supabase.from("bookings").select("*").order("created_at");
    if (status) query = query.eq("status", status);
    if (date) query = query.eq("date", date);
    const { data, error } = await query;
    if (error) throw error;
    return res.json((data ?? []).map(mapBooking));
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
    const settingsRow = settingsRows?.[0];
    const openTime = settingsRow?.open_time ?? "08:00";
    const closeTime = settingsRow?.close_time ?? "19:00";
    const slotDuration = settingsRow?.slot_duration ?? 30;

    const { data: serviceRows } = await supabase.from("services").select("duration").eq("id", parseInt(serviceId)).limit(1);
    const serviceDuration = serviceRows?.[0]?.duration ?? slotDuration;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const { data: existingBookings } = await supabase.from("bookings").select("time").eq("date", date).neq("status", "cancelled");
    const bookedTimes = new Set((existingBookings ?? []).map((b: Record<string, unknown>) => b.time));

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

    const { data: serviceRows } = await supabase.from("services").select("name, price").eq("id", serviceId).limit(1);
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

    const adminEmail = await getAdminNotificationEmail();
    if (adminEmail) {
      sendEmail({
        to: [{ email: adminEmail }],
        subject: `New booking — ${customerName} on ${date}`,
        htmlContent: newBookingAdminEmail({
          customerName,
          customerEmail: customerEmail ?? undefined,
          customerPhone,
          serviceName: service.name,
          servicePrice: service.price,
          date,
          time,
          notes: notes ?? undefined,
        }),
        ...(customerEmail ? { replyTo: { email: customerEmail, name: customerName } } : {}),
      }).catch(err => logger.error({ err }, "New booking admin email failed"));
    }

    return res.status(201).json(mapBooking(data));
  } catch (err) {
    logger.error({ err }, "Create booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("bookings").select("*").eq("id", parseInt(req.params.id)).single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(mapBooking(data));
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
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (serviceId !== undefined) {
      updates.service_id = serviceId;
      const { data: svcRows } = await supabase.from("services").select("name, price").eq("id", serviceId).limit(1);
      const svc = svcRows?.[0];
      if (svc) { updates.service_name = svc.name; updates.service_price = svc.price; }
    }

    const { data: existingRow } = await supabase.from("bookings").select("*").eq("id", parseInt(req.params.id)).single();

    const { data, error } = await supabase.from("bookings").update(updates).eq("id", parseInt(req.params.id)).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found" });

    const booking = mapBooking(data);
    const prevStatus = existingRow?.status;
    const newStatus = status ?? prevStatus;
    const custEmail = booking.customerEmail as string | null;

    if (custEmail && prevStatus !== newStatus) {
      const { data: settingsRows } = await supabase.from("settings").select("phone").limit(1);
      const businessPhone = settingsRows?.[0]?.phone ?? "07717 310 046";
      const portalUrl = process.env.PORTAL_URL ?? "https://smartshine.co.uk/my-account";

      if (newStatus === "confirmed") {
        getOrCreateCustomerAccount(custEmail, booking.customerName as string)
          .then(({ isNew, password }) => {
            const subject = "Your booking is confirmed — Smart Shine Car Valeting";
            if (isNew && password) {
              return sendEmail({
                to: [{ email: custEmail, name: booking.customerName as string }],
                subject,
                htmlContent: customerWelcomeEmail({
                  customerName: booking.customerName as string,
                  email: custEmail,
                  password,
                  serviceName: booking.serviceName as string,
                  date: booking.date as string,
                  time: booking.time as string,
                  portalUrl,
                  businessPhone,
                }),
              });
            } else {
              return sendEmail({
                to: [{ email: custEmail, name: booking.customerName as string }],
                subject,
                htmlContent: bookingConfirmedCustomerEmail({
                  customerName: booking.customerName as string,
                  serviceName: booking.serviceName as string,
                  date: booking.date as string,
                  time: booking.time as string,
                  businessPhone,
                }),
              });
            }
          })
          .catch(err => logger.error({ err }, "Booking confirmed email/account failed"));
      } else if (newStatus === "done") {
        sendEmail({
          to: [{ email: custEmail, name: booking.customerName as string }],
          subject: "Your car is ready! — Smart Shine Car Valeting",
          htmlContent: bookingReadyCustomerEmail({
            customerName: booking.customerName as string,
            serviceName: booking.serviceName as string,
            date: booking.date as string,
            businessPhone,
          }),
        }).catch(err => logger.error({ err }, "Booking done email failed"));
      }
    }

    return res.json(booking);
  } catch (err) {
    logger.error({ err }, "Update booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("bookings").delete().eq("id", parseInt(req.params.id));
    if (error) throw error;
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
