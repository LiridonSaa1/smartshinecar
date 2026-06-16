import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  useGetDashboardStats,
  useGetBookingsChart,
  useGetTopServices,
  getGetDashboardStatsQueryKey,
  getGetBookingsChartQueryKey,
  getGetTopServicesQueryKey,
} from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, DollarSign, Calendar, Star } from "lucide-react";

export default function AdminAnalytics() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({ query: { queryKey: getGetDashboardStatsQueryKey() } });
  const { data: chartData, isLoading: chartLoading } = useGetBookingsChart({ days: 30 }, { query: { queryKey: getGetBookingsChartQueryKey({ days: 30 }) } });
  const { data: topServices, isLoading: topLoading } = useGetTopServices({ query: { queryKey: getGetTopServicesQueryKey() } });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Performance overview for your business.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
          ) : (
            <>
              {[
                { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: Calendar, color: "bg-blue-100 text-blue-600" },
                { label: "Month Revenue", value: `$${(stats?.monthRevenue ?? 0).toFixed(0)}`, icon: DollarSign, color: "bg-green-100 text-green-600" },
                { label: "Avg. Rating", value: `${stats?.averageRating ?? 0}/5`, icon: Star, color: "bg-yellow-100 text-yellow-600" },
                { label: "Completed", value: stats?.completedBookings ?? 0, icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} flex-shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold text-card-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Bookings per day chart */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6">Bookings per Day (Last 30 days)</h2>
          {chartLoading ? (
            <Skeleton className="h-48 sm:h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData ?? []} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={28} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" fill="url(#bookGrad)" strokeWidth={2} name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenue chart */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6">Revenue per Day ($)</h2>
          {chartLoading ? (
            <Skeleton className="h-48 sm:h-56" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData ?? []} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={38} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`$${v}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Services */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-card-foreground mb-4 sm:mb-6">Top Services by Bookings</h2>
          {topLoading ? (
            <Skeleton className="h-48 sm:h-56" />
          ) : topServices && topServices.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topServices} margin={{ left: -10, right: 8, top: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="serviceName" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" width={28} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="bookingCount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">Not enough data yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
