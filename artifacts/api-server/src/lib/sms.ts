import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";

interface SmsConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  smsNotificationsEnabled: boolean;
}

let cachedSmsConfig: SmsConfig | null = null;
let smsCacheExpiry = 0;

async function getSmsConfig(): Promise<SmsConfig | null> {
  const now = Date.now();
  if (cachedSmsConfig && now < smsCacheExpiry) return cachedSmsConfig;

  try {
    const rows = await db
      .select({
        twilioAccountSid: settingsTable.twilioAccountSid,
        twilioAuthToken: settingsTable.twilioAuthToken,
        twilioFromNumber: settingsTable.twilioFromNumber,
        smsNotificationsEnabled: settingsTable.smsNotificationsEnabled,
      })
      .from(settingsTable)
      .limit(1);

    const row = rows[0];
    if (!row?.twilioAccountSid || !row?.twilioAuthToken || !row?.twilioFromNumber) {
      return null;
    }

    cachedSmsConfig = {
      accountSid: row.twilioAccountSid,
      authToken: row.twilioAuthToken,
      fromNumber: row.twilioFromNumber,
      smsNotificationsEnabled: row.smsNotificationsEnabled ?? true,
    };
    smsCacheExpiry = now + 60_000;
    return cachedSmsConfig;
  } catch {
    return null;
  }
}

export function invalidateSmsConfigCache() {
  cachedSmsConfig = null;
  smsCacheExpiry = 0;
}

export async function sendSms(to: string, body: string): Promise<void> {
  const config = await getSmsConfig();
  if (!config) {
    console.info("[sms] Twilio not configured — skipping SMS");
    return;
  }
  if (!config.smsNotificationsEnabled) {
    console.info("[sms] SMS notifications disabled — skipping SMS");
    return;
  }

  const normalizedTo = to.trim().replace(/\s+/g, "");
  const toE164 = normalizedTo.startsWith("+") ? normalizedTo : `+44${normalizedTo.replace(/^0/, "")}`;

  const credentials = Buffer.from(`${config.accountSid}:${config.authToken}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append("To", toE164);
  params.append("From", config.fromNumber);
  params.append("Body", body);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    let twilioCode: number | null = null;
    let twilioMessage = `HTTP ${res.status}`;
    try {
      const json = await res.json() as { code?: number; message?: string };
      twilioCode = json.code ?? null;
      twilioMessage = json.message ?? twilioMessage;
    } catch {
      twilioMessage = await res.text().catch(() => twilioMessage);
    }

    const hint =
      twilioCode === 21659
        ? `Error 21659: The "From" number is not a Twilio number in your account, or it doesn't match the destination country. Buy a UK Twilio number (+44...) from console.twilio.com and enter it here, or use a Messaging Service SID (MGXXX...).`
        : twilioCode === 21211
        ? `Error 21211: The "To" number is not a valid phone number.`
        : twilioCode === 20003
        ? `Error 20003: Authentication failed — check your Account SID and Auth Token.`
        : `Error ${twilioCode ?? res.status}: ${twilioMessage}`;

    throw new Error(hint);
  }
}

export async function sendBookingConfirmationSms(opts: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  businessName: string;
}): Promise<void> {
  const body = `Hi ${opts.customerName.split(" ")[0]}, your ${opts.serviceName} booking at ${opts.businessName} is confirmed for ${opts.date} at ${opts.time}. Reply STOP to opt out.`;
  await sendSms(opts.customerPhone, body);
}

export async function sendBookingReceivedSms(opts: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  businessName: string;
}): Promise<void> {
  const body = `Hi ${opts.customerName.split(" ")[0]}, we've received your booking request for ${opts.serviceName} on ${opts.date} at ${opts.time}. We'll be in touch shortly — ${opts.businessName}.`;
  await sendSms(opts.customerPhone, body);
}

export async function sendCarReadySms(opts: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  businessName: string;
}): Promise<void> {
  const body = `Hi ${opts.customerName.split(" ")[0]}, your ${opts.serviceName} is complete — your car is ready for collection! Thanks from ${opts.businessName}.`;
  await sendSms(opts.customerPhone, body);
}

export async function sendNewBookingAdminSms(opts: {
  businessPhone: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
}): Promise<void> {
  const body = `New booking: ${opts.customerName} — ${opts.serviceName} on ${opts.date} at ${opts.time}. Customer: ${opts.customerPhone}`;
  await sendSms(opts.businessPhone, body);
}
