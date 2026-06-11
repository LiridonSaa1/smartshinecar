import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/services", async (_req, res) => {
  try {
    const data = await db.select().from(servicesTable).orderBy(servicesTable.id);
    return res.json(data);
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
    const [data] = await db.insert(servicesTable).values({
      name,
      description: description ?? "",
      price,
      duration,
      imageUrl: imageUrl ?? null,
      isActive: isActive !== undefined ? isActive : true,
    }).returning();
    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const [data] = await db.select().from(servicesTable).where(eq(servicesTable.id, parseInt(req.params.id)));
    if (!data) return res.status(404).json({ error: "Not found" });
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
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (isActive !== undefined) updates.isActive = isActive;

    const [data] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, parseInt(req.params.id))).returning();
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    await db.delete(servicesTable).where(eq(servicesTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
