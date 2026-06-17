import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { bookingsTable, servicesTable, settingsTable, customerAccountsTable } from "@workspace/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { logger } from "../lib/logger";
import { adminAuth } from "../lib/adminAuth";
import { sendEmail, getNotificationEmail, newBookingAdminEmail, bookingConfirmedCustomerEmail, bookingReadyCustomerEmail, customerWelcomeEmail, bookingReceivedCustomerEmail } from "../lib/email";
import { sendBookingReceivedSms, sendBookingConfirmationSms, sendCarReadySms, sendNewBookingAdminSms } from "../lib/sms";

const router = Router();

function mapBooking(row: typeof bookingsTable.$inferSelect) {
  return {
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
  };
}

function generatePassword(length = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function getOrCreateCustomerAccount(
  email: string,
  name: string
): Promise<{ isNew: boolean; password: string }> {
  const existing = await db
    .select({ id: customerAccountsTable.id, plainPassword: customerAccountsTable.plainPassword })
    .from(customerAccountsTable)
    .where(eq(customerAccountsTable.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    const plain = existing[0].plainPassword;
    if (plain) {
      return { isNew: false, password: plain };
    }
    // Legacy account with no stored plain password — generate one now and save it
    const newPassword = generatePassword();
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.update(customerAccountsTable)
      .set({ plainPassword: newPassword, passwordHash: newHash })
      .where(eq(customerAccountsTable.email, email.toLowerCase()));
    return { isNew: false, password: newPassword };
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(customerAccountsTable).values({
    email: email.toLowerCase(),
    name,
    passwordHash,
    plainPassword: password,
  });

  return { isNew: true, password };
}

async function getAdminNotificationEmail(): Promise<string | null> {
  const rows = await db.select({ email: settingsTable.email, notificationEmail: settingsTable.notificationEmail }).from(settingsTable).limit(1);
  if (rows[0]?.notificationEmail) return rows[0].notificationEmail;
  if (rows[0]?.email) return rows[0].email;
  const notifEmail = await getNotificationEmail();
  return notifEmail;
}

router.get("/bookings", adminAuth, async (req, res) => {
  try {
    const { status, date } = req.query as { status?: string; date?: string };
    const conditions = [];
    if (status) conditions.push(eq(bookingsTable.status, status));
    if (date) conditions.push(eq(bookingsTable.date, date));
    const data = conditions.length > 0
      ? await db.select().from(bookingsTable).where(conditions.length === 1 ? conditions[0] : and(...conditions)).orderBy(asc(bookingsTable.createdAt))
      : await db.select().from(bookingsTable).orderBy(asc(bookingsTable.createdAt));
    return res.json(data.map(mapBooking));
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

    const settingsRows = await db.select().from(settingsTable).limit(1);
    const settingsRow = settingsRows[0];
    const openTime = settingsRow?.openTime ?? "08:00";
    const closeTime = settingsRow?.closeTime ?? "19:00";
    const slotDuration = settingsRow?.slotDuration ?? 30;

    const serviceRows = await db.select({ duration: servicesTable.duration }).from(servicesTable).where(eq(servicesTable.id, parseInt(serviceId))).limit(1);
    const serviceDuration = serviceRows[0]?.duration ?? slotDuration;

    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const existingBookings = await db
      .select({ time: bookingsTable.time, serviceId: bookingsTable.serviceId, status: bookingsTable.status })
      .from(bookingsTable)
      .where(and(eq(bookingsTable.date, date)));

    // Build list of booked time ranges [startMin, endMin) for non-cancelled bookings
    const bookedRanges: Array<{ start: number; end: number }> = [];
    for (const b of existingBookings) {
      if (!b.time || b.status === "cancelled") continue;
      const [bh, bm] = b.time.split(":").map(Number);
      const startMin = bh * 60 + bm;
      // Look up duration of the existing booking's service
      let existingDuration = slotDuration;
      if (b.serviceId) {
        const svc = await db.select({ duration: servicesTable.duration }).from(servicesTable).where(eq(servicesTable.id, b.serviceId)).limit(1);
        existingDuration = svc[0]?.duration ?? slotDuration;
      }
      bookedRanges.push({ start: startMin, end: startMin + existingDuration });
    }

    // A slot at [slotStart, slotStart+serviceDuration) is unavailable if it overlaps any booked range
    const slots = [];
    for (let m = openMinutes; m + serviceDuration <= closeMinutes; m += slotDuration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const time = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const slotEnd = m + serviceDuration;
      const available = !bookedRanges.some(r => m < r.end && slotEnd > r.start);
      slots.push({ time, available });
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

    const conflict = await db.select({ id: bookingsTable.id })
      .from(bookingsTable)
      .where(and(eq(bookingsTable.date, date), eq(bookingsTable.time, time)))
      .limit(1)
      .then(rows => rows.filter(r => r));

    if (conflict.length > 0) {
      return res.status(409).json({ error: "This time slot is already booked. Please choose another time." });
    }

    const serviceRows = await db.select({ name: servicesTable.name, price: servicesTable.price }).from(servicesTable).where(eq(servicesTable.id, serviceId)).limit(1);
    const service = serviceRows[0];
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

    const settingsRows = await db.select({ phone: settingsTable.phone, businessName: settingsTable.businessName }).from(settingsTable).limit(1);
    const businessPhone = settingsRows[0]?.phone ?? "07717 310 046";
    const businessName = settingsRows[0]?.businessName ?? "Smart Shine Car Valeting Centre";
    const portalUrl = process.env.PORTAL_URL ?? "https://smartshine.co.uk/my-account";

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

    if (customerEmail) {
      const accountResult = await getOrCreateCustomerAccount(customerEmail, customerName).catch(err => {
        logger.error({ err }, "Customer account create failed — sending email without portal credentials");
        return { isNew: false, password: "" };
      });

      sendEmail({
        to: [{ email: customerEmail, name: customerName }],
        subject: `Booking request received — Smart Shine Car Valeting`,
        htmlContent: bookingReceivedCustomerEmail({
          customerName,
          serviceName: service.name,
          date,
          time,
          businessPhone,
          portalUrl,
          isNewAccount: accountResult.isNew,
          email: customerEmail,
          password: accountResult.password,
        }),
      }).catch(err => logger.error({ err }, "Booking received customer email failed"));
    }

    sendBookingReceivedSms({ customerPhone, customerName, serviceName: service.name, date, time, businessName })
      .catch(err => logger.error({ err }, "Booking received SMS failed"));

    if (businessPhone) {
      sendNewBookingAdminSms({ businessPhone, customerName, customerPhone, serviceName: service.name, date, time })
        .catch(err => logger.error({ err }, "New booking admin SMS failed"));
    }

    return res.status(201).json(mapBooking(data));
  } catch (err) {
    logger.error({ err }, "Create booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", adminAuth, async (req, res) => {
  try {
    const [data] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, parseInt(req.params.id)));
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(mapBooking(data));
  } catch (err) {
    logger.error({ err }, "Get booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/bookings/:id", adminAuth, async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, serviceId, date, time, status, notes } = req.body;
    const updates: Partial<typeof bookingsTable.$inferInsert> = {};
    if (customerName !== undefined) updates.customerName = customerName;
    if (customerPhone !== undefined) updates.customerPhone = customerPhone;
    if (customerEmail !== undefined && customerEmail !== "") updates.customerEmail = customerEmail;
    if (date !== undefined) updates.date = date;
    if (time !== undefined) updates.time = time;
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (serviceId !== undefined) {
      updates.serviceId = serviceId;
      const svcRows = await db.select({ name: servicesTable.name, price: servicesTable.price }).from(servicesTable).where(eq(servicesTable.id, serviceId)).limit(1);
      const svc = svcRows[0];
      if (svc) { updates.serviceName = svc.name; updates.servicePrice = svc.price; }
    }

    const [existingRow] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, parseInt(req.params.id)));
    const [data] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, parseInt(req.params.id))).returning();
    if (!data) return res.status(404).json({ error: "Not found" });

    const booking = mapBooking(data);
    const prevStatus = existingRow?.status;
    const newStatus = status ?? prevStatus;
    const custEmail = (existingRow?.customerEmail ?? null) as string | null;
    const custPhone = (existingRow?.customerPhone ?? data.customerPhone) as string;
    const custName = (existingRow?.customerName ?? data.customerName) as string;

    const settingsRows = await db.select({ phone: settingsTable.phone, businessName: settingsTable.businessName }).from(settingsTable).limit(1);
    const businessPhone = settingsRows[0]?.phone ?? "07717 310 046";
    const businessName = settingsRows[0]?.businessName ?? "Smart Shine Car Valeting Centre";
    const portalUrl = process.env.PORTAL_URL ?? "https://smartshine.co.uk/my-account";

    if (prevStatus !== newStatus) {
      if (newStatus === "confirmed") {
        if (custEmail) {
          const accountResult = await getOrCreateCustomerAccount(custEmail, custName).catch(err => {
            logger.error({ err }, "Customer account create failed — sending confirmation without portal credentials");
            return { isNew: false, password: "" };
          });

          const subject = "Your booking is confirmed — Smart Shine Car Valeting";
          const htmlContent = (accountResult.isNew && accountResult.password)
            ? customerWelcomeEmail({
                customerName: custName,
                email: custEmail,
                password: accountResult.password,
                serviceName: booking.serviceName as string,
                date: booking.date as string,
                time: booking.time as string,
                portalUrl,
                businessPhone,
              })
            : bookingConfirmedCustomerEmail({
                customerName: custName,
                serviceName: booking.serviceName as string,
                date: booking.date as string,
                time: booking.time as string,
                businessPhone,
              });

          sendEmail({ to: [{ email: custEmail, name: custName }], subject, htmlContent })
            .catch(err => logger.error({ err }, "Booking confirmed email failed"));
        }

        sendBookingConfirmationSms({
          customerPhone: custPhone,
          customerName: custName,
          serviceName: booking.serviceName as string,
          date: booking.date as string,
          time: booking.time as string,
          businessName,
        }).catch(err => logger.error({ err }, "Booking confirmed SMS failed"));

      } else if (newStatus === "done") {
        if (custEmail) {
          sendEmail({
            to: [{ email: custEmail, name: custName }],
            subject: "Your car is ready for collection ✓ — Smart Shine Car Valeting",
            htmlContent: bookingReadyCustomerEmail({
              customerName: custName,
              serviceName: booking.serviceName as string,
              servicePrice: booking.servicePrice as string,
              date: booking.date as string,
              time: booking.time as string,
              notes: existingRow?.notes ?? undefined,
              businessPhone,
              portalUrl,
            }),
          }).catch(err => logger.error({ err }, "Booking done email failed"));
        }

        sendCarReadySms({
          customerPhone: custPhone,
          customerName: custName,
          serviceName: booking.serviceName as string,
          businessName,
        }).catch(err => logger.error({ err }, "Booking done SMS failed"));
      }
    }

    return res.json(booking);
  } catch (err) {
    logger.error({ err }, "Update booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", adminAuth, async (req, res) => {
  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete booking error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
