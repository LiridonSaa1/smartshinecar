import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

function mapReview(row: Record<string, unknown>) {
  return {
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    serviceName: row.service_name,
    createdAt: row.created_at,
  };
}

router.get("/reviews", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("reviews").select("*").order("created_at");
    if (error) throw error;
    return res.json((data ?? []).map(mapReview));
  } catch (err) {
    logger.error({ err }, "List reviews error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const { customerName, rating, comment, serviceName } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ error: "customerName, rating, comment required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const { data, error } = await supabase.from("reviews").insert({
      customer_name: customerName,
      rating,
      comment,
      service_name: serviceName ?? null,
    }).select().single();
    if (error) throw error;
    return res.status(201).json(mapReview(data));
  } catch (err) {
    logger.error({ err }, "Create review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/reviews/:id", async (req, res) => {
  try {
    const { customerName, rating, comment, serviceName } = req.body;
    const { data, error } = await supabase.from("reviews").update({
      customer_name: customerName,
      rating,
      comment,
      service_name: serviceName ?? null,
    }).eq("id", parseInt(req.params.id)).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(mapReview(data));
  } catch (err) {
    logger.error({ err }, "Update review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("reviews").delete().eq("id", parseInt(req.params.id));
    if (error) throw error;
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
