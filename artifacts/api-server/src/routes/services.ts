import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

function formatService(s: typeof servicesTable.$inferSelect) {
  return {
    ...s,
    price: parseFloat(s.price as unknown as string),
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/services", async (_req, res) => {
  try {
    const rows = await db.select().from(servicesTable).orderBy(servicesTable.id);
    return res.json(rows.map(formatService));
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
    const rows = await db.insert(servicesTable).values({
      name,
      description: description ?? "",
      price: String(price),
      duration,
      imageUrl: imageUrl ?? null,
      isActive: isActive !== undefined ? isActive : true,
    }).returning();
    return res.status(201).json(formatService(rows[0]));
  } catch (err) {
    logger.error({ err }, "Create service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rows = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(formatService(rows[0]));
  } catch (err) {
    logger.error({ err }, "Get service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, duration, imageUrl, isActive } = req.body;
    const rows = await db.update(servicesTable).set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: String(price) }),
      ...(duration !== undefined && { duration }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
    }).where(eq(servicesTable.id, id)).returning();
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    return res.json(formatService(rows[0]));
  } catch (err) {
    logger.error({ err }, "Update service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete service error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
