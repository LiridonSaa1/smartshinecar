import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Prefer SUPABASE_DATABASE_URL when available (works both on Replit dev and Render prod).
// Fall back to DATABASE_URL (Replit local Postgres) only if Supabase URL is not set.
const connectionString =
  process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set.");
}

const usesSsl = !!process.env.SUPABASE_DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: usesSsl ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
