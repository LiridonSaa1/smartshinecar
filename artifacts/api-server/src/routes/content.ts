import { Router } from "express";
import { db, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/content", async (_req, res) => {
  try {
    const rows = await db.select({ key: siteContentTable.key, data: siteContentTable.data }).from(siteContentTable);
    const result: Record<string, unknown> = {};
    for (const row of rows) result[row.key] = row.data;
    return res.json(result);
  } catch (err) {
    logger.error({ err }, "List content error");
    return res.json({});
  }
});

router.get("/content/:key", async (req, res) => {
  try {
    const [row] = await db.select({ data: siteContentTable.data })
      .from(siteContentTable)
      .where(eq(siteContentTable.key, req.params.key));
    return res.json(row?.data ?? null);
  } catch (err) {
    logger.error({ err }, "Get content error");
    return res.json(null);
  }
});

router.put("/content/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const [existing] = await db.select({ id: siteContentTable.id })
      .from(siteContentTable)
      .where(eq(siteContentTable.key, key));

    if (existing) {
      const [data] = await db.update(siteContentTable)
        .set({ data: req.body, updatedAt: new Date() })
        .where(eq(siteContentTable.key, key))
        .returning({ data: siteContentTable.data });
      return res.json(data.data);
    } else {
      const [data] = await db.insert(siteContentTable)
        .values({ key, data: req.body })
        .returning({ data: siteContentTable.data });
      return res.json(data.data);
    }
  } catch (err) {
    logger.error({ err }, "Update content error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
