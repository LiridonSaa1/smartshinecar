import { Router } from "express";
import { db, bookingsTable, reviewsTable } from "@workspace/db";
import { sql, gte, and } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

router.get("/analytics/dashboard", async (_req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStr = startOfMonth.toISOString().split("T")[0];

    // Total bookings
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(bookingsTable);
    const totalBookings = Number(totalResult[0]?.count ?? 0);

    // Today's bookings
    const todayResult = await db.select({ count: sql<number>`count(*)` })
      .from(bookingsTable).where(sql`${bookingsTable.date} = ${today}`);
    const todayBookings = Number(todayResult[0]?.count ?? 0);

    // Month revenue
    const revenueResult = await db.select({ sum: sql<number>`coalesce(sum(service_price::numeric), 0)` })
      .from(bookingsTable).where(and(
        sql`${bookingsTable.date} >= ${monthStr}`,
        sql`${bookingsTable.status} in ('confirmed', 'in_progress', 'done')`
      ));
    const monthRevenue = Number(revenueResult[0]?.sum ?? 0);

    // Status counts
    const statusResult = await db.select({
      status: bookingsTable.status,
      count: sql<number>`count(*)`,
    }).from(bookingsTable).groupBy(bookingsTable.status);

    const statusMap: Record<string, number> = {};
    for (const row of statusResult) {
      statusMap[row.status] = Number(row.count);
    }

    // Reviews stats
    const reviewsResult = await db.select({
      count: sql<number>`count(*)`,
      avg: sql<number>`coalesce(avg(rating)::numeric, 0)`,
    }).from(reviewsTable);
    const totalReviews = Number(reviewsResult[0]?.count ?? 0);
    const averageRating = Number(Number(reviewsResult[0]?.avg ?? 0).toFixed(1));

    return res.json({
      totalBookings,
      todayBookings,
      monthRevenue,
      pendingBookings: statusMap["pending"] ?? 0,
      confirmedBookings: statusMap["confirmed"] ?? 0,
      completedBookings: statusMap["done"] ?? 0,
      averageRating,
      totalReviews,
    });
  } catch (err) {
    logger.error({ err }, "Dashboard stats error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/bookings-chart", async (req, res) => {
  try {
    const days = parseInt((req.query.days as string) ?? "30");
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split("T")[0];

    const rows = await db.select({
      date: bookingsTable.date,
      count: sql<number>`count(*)`,
      revenue: sql<number>`coalesce(sum(service_price::numeric), 0)`,
    }).from(bookingsTable)
      .where(sql`${bookingsTable.date} >= ${sinceStr}`)
      .groupBy(bookingsTable.date)
      .orderBy(bookingsTable.date);

    return res.json(rows.map(r => ({
      date: r.date,
      bookings: Number(r.count),
      revenue: Number(r.revenue),
    })));
  } catch (err) {
    logger.error({ err }, "Bookings chart error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/top-services", async (_req, res) => {
  try {
    const rows = await db.select({
      serviceId: bookingsTable.serviceId,
      serviceName: bookingsTable.serviceName,
      bookingCount: sql<number>`count(*)`,
      totalRevenue: sql<number>`coalesce(sum(service_price::numeric), 0)`,
    }).from(bookingsTable)
      .groupBy(bookingsTable.serviceId, bookingsTable.serviceName)
      .orderBy(sql`count(*) DESC`)
      .limit(10);

    return res.json(rows.map(r => ({
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      bookingCount: Number(r.bookingCount),
      totalRevenue: Number(r.totalRevenue),
    })));
  } catch (err) {
    logger.error({ err }, "Top services error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
