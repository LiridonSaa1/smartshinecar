import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// On Render (production), prefer SUPABASE_DATABASE_URL (requires SSL).
// On Replit (development), use DATABASE_URL (local Postgres, no SSL).
const isRender = process.env.RENDER === "true";
const connectionString = isRender
  ? (process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL)
  : (process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL);

if (!connectionString) {
  throw new Error("DATABASE_URL must be set.");
}

export const pool = new Pool({
  connectionString,
  ssl: isRender ? { rejectUnauthorized: false } : false,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
