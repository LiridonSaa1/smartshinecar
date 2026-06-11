import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  data: jsonb("data"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteContent = typeof siteContentTable.$inferSelect;
