import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull().default("Car Wash Pro"),
  address: text("address").notNull().default("123 Main Street, Prishtina, Kosovo"),
  phone: text("phone").notNull().default("+383 44 123 456"),
  email: text("email").notNull().default("info@carwashpro.com"),
  openTime: text("open_time").notNull().default("08:00"),
  closeTime: text("close_time").notNull().default("19:00"),
  slotDuration: integer("slot_duration").notNull().default(30),
  workingDays: text("working_days").notNull().default("Mon,Tue,Wed,Thu,Fri,Sat,Sun"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  notificationEmail: text("notification_email"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  brevoApiKey: text("brevo_api_key"),
  senderEmail: text("sender_email"),
  senderName: text("sender_name"),
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  twilioFromNumber: text("twilio_from_number"),
  emailNotificationsEnabled: boolean("email_notifications_enabled").notNull().default(true),
  smsNotificationsEnabled: boolean("sms_notifications_enabled").notNull().default(true),
});

export type Settings = typeof settingsTable.$inferSelect;
