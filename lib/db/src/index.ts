import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// In production (Render sets RENDER=true), prefer SUPABASE_DATABASE_URL which connects to Supabase.
// In development (Replit), Supabase is IPv6-only (EAFNOSUPPORT), so use local DATABASE_URL.
const isProduction = process.env.RENDER === "true" || process.env.NODE_ENV === "production";

const connectionString = isProduction
  ? (process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL)
  : (process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL);

if (!connectionString) {
  throw new Error("DATABASE_URL must be set.");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
export const db = drizzle(pool, { schema });

export * from "./schema";
