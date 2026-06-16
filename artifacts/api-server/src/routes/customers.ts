import { Router } from "express";
import { db } from "@workspace/db";
import { customerAccountsTable, bookingsTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { logger } from "../lib/logger";
import { adminAuth } from "../lib/adminAuth";

const router = Router();

router.get("/admin/customers", adminAuth, async (req, res) => {
  try {
    const rows = await db
      .select({
        id: customerAccountsTable.id,
        name: customerAccountsTable.name,
        email: customerAccountsTable.email,
        createdAt: customerAccountsTable.createdAt,
        bookingCount: sql<number>`cast(count(${bookingsTable.id}) as int)`,
      })
      .from(customerAccountsTable)
      .leftJoin(bookingsTable, eq(bookingsTable.customerEmail, customerAccountsTable.email))
      .groupBy(customerAccountsTable.id)
      .orderBy(desc(customerAccountsTable.createdAt));

    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "List customers error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/customers/:id", adminAuth, async (req, res) => {
  try {
    await db.delete(customerAccountsTable).where(eq(customerAccountsTable.id, parseInt(req.params.id)));
    return res.status(204).send();
  } catch (err) {
    logger.error({ err }, "Delete customer error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
