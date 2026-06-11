import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetDashboardStats,
  useGetBookingsChart,
  useListBookings,
  getGetDashboardStatsQueryKey,
  getGetBookingsChartQueryKey,
  getListBookingsQueryKey,
} from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, DollarSign, Clock, Star, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-card-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() },
  });
  const { data: chartData, isLoading: chartLoading } = useGetBookingsChart(undefined, {
    query: { queryKey: getGetBookingsChartQueryKey() },
  });
  const { data: recentBookings, isLoading: bookingsLoading } = useListBookings(undefined, {
    query: { queryKey: getListBookingsQueryKey() },
  });

  const recent = recentBookings?.slice(-5).reverse() ?? [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : (
            <>
              <StatCard label="Total Bookings" value={stats?.totalBookings ?? 0} icon={Calendar} delay={0} />
              <StatCard label="Today's Bookings" value={stats?.todayBookings ?? 0} icon={Clock} sub="Scheduled today" delay={0.05} />
              <StatCard label="Monthly Revenue" value={`$${(stats?.monthRevenue ?? 0).toFixed(0)}`} icon={DollarSign} sub="This month" delay={0.1} />
              <StatCard label="Avg. Rating" value={`${stats?.averageRating ?? 0} / 5`} icon={Star} sub={`${stats?.totalReviews ?? 0} reviews`} delay={0.15} />
            </>
          )}
        </div>

        {/* Status breakdown */}
        {!statsLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Pending", value: stats?.pendingBookings ?? 0, color: "bg-yellow-500" },
              { label: "Confirmed", value: stats?.confirmedBookings ?? 0, color: "bg-blue-500" },
              { label: "Completed", value: stats?.completedBookings ?? 0, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold text-card-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-6">Bookings Overview (30 days)</h2>
          {chartLoading ? (
            <Skeleton className="h-52" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData ?? []}>
                <defs>
                  <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" fill="url(#bookingGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent bookings */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Bookings</h2>
          {bookingsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Customer</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Service</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-booking-${b.id}`}>
                      <td className="py-3 px-3 font-medium text-card-foreground">{b.customerName}</td>
                      <td className="py-3 px-3 text-muted-foreground">{b.serviceName}</td>
                      <td className="py-3 px-3 text-muted-foreground">{b.date} {b.time}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[b.status] ?? ""}`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
