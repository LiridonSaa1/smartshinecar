import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router = Router();

function formatReview(r: typeof reviewsTable.$inferSelect) {
  return {
    ...r,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/reviews", async (_req, res) => {
  try {
    const rows = await db.select().from(reviewsTable).orderBy(reviewsTable.createdAt);
    return res.json(rows.map(formatReview));
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
    const rows = await db.insert(reviewsTable).values({
      customerName,
      rating,
      comment,
      serviceName: serviceName ?? null,
    }).returning();
    return res.status(201).json(formatReview(rows[0]));
  } catch (err) {
    logger.error({ err }, "Create review error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
