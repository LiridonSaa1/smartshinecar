import { defineConfig } from "drizzle-kit";
import path from "path";

const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or SUPABASE_DATABASE_URL must be set.");
}

const isSupabase = !process.env.DATABASE_URL && !!process.env.SUPABASE_DATABASE_URL;

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
    ssl: isSupabase ? { rejectUnauthorized: false } : false,
  },
});
