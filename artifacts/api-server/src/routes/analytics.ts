import { Router } from "express";
import { supabase } from "../lib/supabase";
import { logger } from "../lib/logger";

const router = Router();

router.get("/analytics/dashboard", async (_req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStr = startOfMonth.toISOString().split("T")[0];

    const { data: allBookings } = await supabase.from("bookings").select("date, status, service_price");
    const { data: allReviews } = await supabase.from("reviews").select("rating");

    const bookings = allBookings ?? [];
    const reviews = allReviews ?? [];

    const totalBookings = bookings.length;
    const todayBookings = bookings.filter(b => b.date === today).length;
    const monthRevenue = bookings
      .filter(b => b.date >= monthStr && ["confirmed", "in_progress", "done"].includes(b.status))
      .reduce((sum, b) => sum + parseFloat(b.service_price ?? "0"), 0);

    const statusMap: Record<string, number> = {};
    for (const b of bookings) {
      statusMap[b.status] = (statusMap[b.status] ?? 0) + 1;
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

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

    const { data: bookings } = await supabase.from("bookings").select("date, service_price").gte("date", sinceStr);

    const byDate: Record<string, { bookings: number; revenue: number }> = {};
    for (const b of bookings ?? []) {
      if (!byDate[b.date]) byDate[b.date] = { bookings: 0, revenue: 0 };
      byDate[b.date].bookings++;
      byDate[b.date].revenue += parseFloat(b.service_price ?? "0");
    }

    const result = Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, bookings: v.bookings, revenue: v.revenue }));

    return res.json(result);
  } catch (err) {
    logger.error({ err }, "Bookings chart error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/top-services", async (_req, res) => {
  try {
    const { data: bookings } = await supabase.from("bookings").select("service_id, service_name, service_price");

    const byService: Record<string, { serviceId: number; serviceName: string; bookingCount: number; totalRevenue: number }> = {};
    for (const b of bookings ?? []) {
      const key = String(b.service_id);
      if (!byService[key]) byService[key] = { serviceId: b.service_id, serviceName: b.service_name, bookingCount: 0, totalRevenue: 0 };
      byService[key].bookingCount++;
      byService[key].totalRevenue += parseFloat(b.service_price ?? "0");
    }

    const result = Object.values(byService)
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 10);

    return res.json(result);
  } catch (err) {
    logger.error({ err }, "Top services error");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
