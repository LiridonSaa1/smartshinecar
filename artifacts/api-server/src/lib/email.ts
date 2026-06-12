import { supabase } from "./supabase";

let cachedConfig: EmailConfig | null = null;
let cacheExpiry = 0;

interface EmailConfig {
  brevoApiKey: string;
  senderEmail: string;
  senderName: string;
  notificationEmail: string | null;
}

async function getEmailConfig(): Promise<EmailConfig> {
  const now = Date.now();
  if (cachedConfig && now < cacheExpiry) return cachedConfig;

  try {
    const { data } = await supabase
      .from("site_content")
      .select("data")
      .eq("key", "extra_settings")
      .maybeSingle();
    const extra = (data?.data as Record<string, unknown>) ?? {};
    cachedConfig = {
      brevoApiKey: (extra.brevoApiKey as string) || process.env.BREVO_API_KEY || "",
      senderEmail: (extra.senderEmail as string) || process.env.BREVO_SENDER_EMAIL || "noreply@smartshine.co.uk",
      senderName: (extra.senderName as string) || process.env.BREVO_SENDER_NAME || "Smart Shine Car Valeting",
      notificationEmail: (extra.notificationEmail as string) || null,
    };
    cacheExpiry = now + 60_000;
  } catch {
    cachedConfig = {
      brevoApiKey: process.env.BREVO_API_KEY || "",
      senderEmail: process.env.BREVO_SENDER_EMAIL || "noreply@smartshine.co.uk",
      senderName: process.env.BREVO_SENDER_NAME || "Smart Shine Car Valeting",
      notificationEmail: null,
    };
    cacheExpiry = now + 10_000;
  }
  return cachedConfig;
}

export function invalidateEmailConfigCache() {
  cachedConfig = null;
  cacheExpiry = 0;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  replyTo?: EmailRecipient;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const config = await getEmailConfig();

  if (!config.brevoApiKey) {
    console.warn("[email] Brevo API key not configured — skipping email send");
    return;
  }

  const payload = {
    sender: { name: config.senderName, email: config.senderEmail },
    to: opts.to,
    subject: opts.subject,
    htmlContent: opts.htmlContent,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": config.brevoApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${text}`);
  }
}

export async function getNotificationEmail(): Promise<string | null> {
  const config = await getEmailConfig();
  return config.notificationEmail;
}

export function newContactMessageAdminEmail(opts: {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  source?: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">New Contact Message</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;width:120px;border-bottom:1px solid #e5e7eb">Name</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.name}</td></tr>
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Email</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827"><a href="mailto:${opts.email}" style="color:#2563eb">${opts.email}</a></td></tr>
          ${opts.phone ? `<tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Phone</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827"><a href="tel:${opts.phone}" style="color:#2563eb">${opts.phone}</a></td></tr>` : ""}
          ${opts.service ? `<tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Service</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.service}</td></tr>` : ""}
          ${opts.source ? `<tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Page</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.source}</td></tr>` : ""}
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;vertical-align:top">Message</td><td style="padding:10px 12px;color:#111827">${opts.message.replace(/\n/g, "<br/>")}</td></tr>
        </table>
        <div style="margin-top:20px;padding:12px;background:#eff6ff;border-radius:6px;font-size:12px;color:#1d4ed8">
          Reply to this email to respond directly to ${opts.name}.
        </div>
      </div>
    </div>
  `;
}

export function newContactMessageUserEmail(opts: { name: string; message: string }) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">Thanks for getting in touch!</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#374151;font-size:15px">Hi ${opts.name},</p>
        <p style="color:#374151;font-size:15px">We've received your message and will get back to you as soon as possible — usually within 24 hours.</p>
        <div style="background:#f9fafb;border-left:4px solid #3b82f6;padding:16px;border-radius:0 6px 6px 0;margin:20px 0">
          <p style="margin:0;font-size:14px;color:#6b7280;font-style:italic">"${opts.message.replace(/\n/g, "<br/>")}"</p>
        </div>
        <p style="color:#374151;font-size:14px">Smart Shine Car Valeting Centre<br/>Guildford, Surrey<br/>Mon–Sun: 08:00–19:00</p>
      </div>
    </div>
  `;
}

export function bookingReceivedCustomerEmail(opts: {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  businessPhone: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">Booking Request Received!</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#374151;font-size:15px">Hi ${opts.customerName},</p>
        <p style="color:#374151;font-size:15px">Thank you for your booking request! We've received it and will confirm your appointment shortly.</p>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em">Your Booking Details</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Service:</strong> ${opts.serviceName}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Date:</strong> ${opts.date}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Time:</strong> ${opts.time}</p>
        </div>
        <p style="color:#374151;font-size:15px">You will receive another email once your booking is confirmed. If you have any questions in the meantime, please call us on <a href="tel:${opts.businessPhone}" style="color:#2563eb;font-weight:bold">${opts.businessPhone}</a>.</p>
        <p style="color:#374151;font-size:14px">Smart Shine Car Valeting Centre<br/>Guildford, Surrey<br/>Mon–Sun: 08:00–19:00</p>
      </div>
    </div>
  `;
}

export function newBookingAdminEmail(opts: {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
  notes?: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">New Booking Received</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;width:130px;border-bottom:1px solid #e5e7eb">Customer</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.customerName}</td></tr>
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Phone</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827"><a href="tel:${opts.customerPhone}" style="color:#2563eb">${opts.customerPhone}</a></td></tr>
          ${opts.customerEmail ? `<tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Email</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827"><a href="mailto:${opts.customerEmail}" style="color:#2563eb">${opts.customerEmail}</a></td></tr>` : ""}
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Service</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.serviceName} — ${opts.servicePrice}</td></tr>
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Date</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827">${opts.date}</td></tr>
          <tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;${opts.notes ? "border-bottom:1px solid #e5e7eb;" : ""}">Time</td><td style="padding:10px 12px;${opts.notes ? "border-bottom:1px solid #e5e7eb;" : ""}color:#111827">${opts.time}</td></tr>
          ${opts.notes ? `<tr><td style="padding:10px 12px;background:#f9fafb;font-weight:bold;color:#374151;vertical-align:top">Notes</td><td style="padding:10px 12px;color:#111827">${opts.notes.replace(/\n/g, "<br/>")}</td></tr>` : ""}
        </table>
        <div style="margin-top:20px;padding:12px;background:#fefce8;border:1px solid #fde047;border-radius:6px;font-size:13px;color:#713f12">
          Log in to your admin panel to confirm or manage this booking.
        </div>
      </div>
    </div>
  `;
}

export function bookingConfirmedCustomerEmail(opts: {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  businessPhone: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">Your Booking is Confirmed ✓</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#374151;font-size:15px">Hi ${opts.customerName},</p>
        <p style="color:#374151;font-size:15px">Great news — your booking has been <strong>confirmed</strong>! We look forward to seeing you.</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#166534;text-transform:uppercase;letter-spacing:0.05em">Booking Details</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Service:</strong> ${opts.serviceName}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Date:</strong> ${opts.date}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Time:</strong> ${opts.time}</p>
        </div>
        <p style="color:#374151;font-size:14px">If you need to make any changes, please call us on <a href="tel:${opts.businessPhone}" style="color:#2563eb;font-weight:bold">${opts.businessPhone}</a>.</p>
        <p style="color:#374151;font-size:14px">Smart Shine Car Valeting Centre<br/>Guildford, Surrey<br/>Mon–Sun: 08:00–19:00</p>
      </div>
    </div>
  `;
}

export function customerWelcomeEmail(opts: {
  customerName: string;
  email: string;
  password: string;
  serviceName: string;
  date: string;
  time: string;
  portalUrl: string;
  businessPhone: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">Your Booking is Confirmed ✓</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#374151;font-size:15px">Hi ${opts.customerName},</p>
        <p style="color:#374151;font-size:15px">Great news — your booking has been <strong>confirmed</strong>! We look forward to seeing you.</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#166534;text-transform:uppercase;letter-spacing:0.05em">Booking Details</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Service:</strong> ${opts.serviceName}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Date:</strong> ${opts.date}</p>
          <p style="margin:4px 0;font-size:15px;color:#111827"><strong>Time:</strong> ${opts.time}</p>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px;margin:20px 0">
          <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.05em">🔑 Your Customer Portal Account</p>
          <p style="margin:0 0 8px;color:#374151;font-size:14px">We've created a portal account so you can track your bookings, see when your car is ready, and manage your appointments.</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
            <tr><td style="padding:8px 10px;background:#ffffff;font-weight:bold;color:#374151;width:100px;border:1px solid #dbeafe">Email</td><td style="padding:8px 10px;background:#ffffff;color:#111827;border:1px solid #dbeafe">${opts.email}</td></tr>
            <tr><td style="padding:8px 10px;background:#ffffff;font-weight:bold;color:#374151;border:1px solid #dbeafe;border-top:none">Password</td><td style="padding:8px 10px;background:#ffffff;color:#111827;font-family:monospace;letter-spacing:0.05em;border:1px solid #dbeafe;border-top:none"><strong>${opts.password}</strong></td></tr>
          </table>
          <div style="text-align:center;margin-top:16px">
            <a href="${opts.portalUrl}" style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:bold">View My Bookings →</a>
          </div>
          <p style="margin:12px 0 0;font-size:12px;color:#6b7280;text-align:center">You can change your password after logging in.</p>
        </div>
        <p style="color:#374151;font-size:14px">If you need to make any changes, please call us on <a href="tel:${opts.businessPhone}" style="color:#2563eb;font-weight:bold">${opts.businessPhone}</a>.</p>
        <p style="color:#374151;font-size:14px">Smart Shine Car Valeting Centre<br/>Guildford, Surrey<br/>Mon–Sun: 08:00–19:00</p>
      </div>
    </div>
  `;
}

export function bookingReadyCustomerEmail(opts: {
  customerName: string;
  serviceName: string;
  date: string;
  businessPhone: string;
}) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
      <div style="background:linear-gradient(135deg,#166534,#15803d);padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="color:#ffffff;margin:0;font-size:22px">Your Car is Ready! 🚗✨</h1>
        <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px">Smart Shine Car Valeting Centre</p>
      </div>
      <div style="padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
        <p style="color:#374151;font-size:15px">Hi ${opts.customerName},</p>
        <p style="color:#374151;font-size:15px">Your <strong>${opts.serviceName}</strong> on <strong>${opts.date}</strong> has been completed. Your vehicle is ready to collect!</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
          <p style="margin:0;font-size:18px;font-weight:bold;color:#166534">Your car is ready for collection ✓</p>
        </div>
        <p style="color:#374151;font-size:14px">If you have any questions, call us on <a href="tel:${opts.businessPhone}" style="color:#2563eb;font-weight:bold">${opts.businessPhone}</a>.</p>
        <p style="color:#374151;font-size:14px">Thank you for choosing Smart Shine Car Valeting Centre!<br/>Guildford, Surrey</p>
      </div>
    </div>
  `;
}
