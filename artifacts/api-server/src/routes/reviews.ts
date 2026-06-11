import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/reviews", async (_req, res) => {
  try {
    const data = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
    return res.json(data);
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
    const [data] = await db.insert(reviewsTable).values({
      customerName,
      rating,
      comment,
      serviceName: serviceName ?? null,
    }).returning();
    return res.status(201).json(data);
  } catch (err) {
    logger.error({ err }, "Create review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/reviews/:id", async (req, res) => {
  try {
    const { customerName, rating, comment, serviceName } = req.body;
    const [data] = await db
      .update(reviewsTable)
      .set({ customerName, rating, comment, serviceName: serviceName ?? null })
      .where(eq(reviewsTable.id, parseInt(req.params.id)))
      .returning();
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.json(data);
  } catch (err) {
    logger.error({ err }, "Update review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    await db.delete(reviewsTable).where(eq(reviewsTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
