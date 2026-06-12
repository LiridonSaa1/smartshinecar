import { logger } from "./logger";
import { supabase } from "./supabase";

export async function runMigrations() {
  try {
    const { error } = await supabase.from("messages").select("id").limit(1);
    if (error && error.code === "PGRST205") {
      logger.error("messages table missing in Supabase — run the SQL from the README in Supabase SQL Editor");
    }
  } catch (err) {
    logger.warn({ err }, "Could not verify migrations");
  }
}
