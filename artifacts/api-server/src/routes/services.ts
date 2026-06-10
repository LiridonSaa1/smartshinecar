import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

router.get("/services", async (_req, res) => {
  try {
    const { data, error } = await supabase.from("services").select("*").order("id");
    if (error) throw error;
    return res.json(data ?? []);
  } catch (err) {
    logger.error({ err }, "List services error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { name, description, price, duration, imageUrl, isActive } = req.body;
    if (!name || price === undefined || !duration) {
      return res.status(400).json({ error: "name, price, duration required" });
    }
    const { data, error } = await supabase.from("services").insert({
      name,
      description: description ?? "",
      price,
      duration,
      image_url: imageUrl ?? null,
      is_active: isActive !== undefined ? isActive : true,
    }).select().single();
    if (error) throw error;
    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("services").select("*").eq("id", req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Get service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const { name, description, price, duration, imageUrl, isActive } = req.body;
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (duration !== undefined) updates.duration = duration;
    if (imageUrl !== undefined) updates.image_url = imageUrl;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data, error } = await supabase.from("services").update(updates).eq("id", req.params.id).select().single();
    if (error || !data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("services").delete().eq("id", req.params.id);
    if (error) throw error;
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
