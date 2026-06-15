import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const customerAccountsTable = pgTable("customer_accounts", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  plainPassword: text("plain_password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type CustomerAccount = typeof customerAccountsTable.$inferSelect;
