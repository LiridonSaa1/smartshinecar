import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

router.get("/content", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("site_content").select("key, data");
    if (error) throw error;
    const result: Record<string, unknown> = {};
    for (const row of data ?? []) result[row.key] = row.data;
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "List content error");
    return res.json({});
  }
});

router.get("/content/:key", async (req, res) => {
  try {
    const { data, error } = await supabase.from("site_content").select("data").eq("key", req.params.key).maybeSingle();
    if (error) throw error;
    return res.json(data?.data ?? null);
  } catch (err) {
    logger.error({ err }, "Get content error");
    return res.json(null);
  }
});

router.put("/content/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { data: existing } = await supabase.from("site_content").select("id").eq("key", key).maybeSingle();

    if (existing) {
      const { data, error } = await supabase.from("site_content")
        .update({ data: req.body, updated_at: new Date().toISOString() })
        .eq("key", key).select("data").single();
      if (error) throw error;
      return res.json(data.data);
    } else {
      const { data, error } = await supabase.from("site_content")
        .insert({ key, data: req.body })
        .select("data").single();
      if (error) throw error;
      return res.json(data.data);
    }
  } catch (err) {
    logger.error({ err }, "Update content error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
