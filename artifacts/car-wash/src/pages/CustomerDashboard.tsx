import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, LogOut, Calendar, Clock, CheckCircle2, XCircle,
  Loader2, AlertTriangle, Sparkles, ChevronRight, X, RefreshCw,
} from "lucide-react";
import { useCustomerAuth, fetchCustomerBookings, cancelCustomerBooking } from "@/lib/customerAuth";

interface Booking {
  id: number;
  customerName: string;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  notes?: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  confirmed: {
    label: "Confirmed", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  done: {
    label: "Ready for collection ✓", color: "text-green-700", bg: "bg-green-50", border: "border-green-200",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  cancelled: {
    label: "Cancelled", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

function isUpcoming(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return d >= today;
}

function BookingCard({ booking, onCancel }: { booking: Booking; onCancel: (id: number) => void }) {
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const canCancel = (booking.status === "pending" || booking.status === "confirmed") && isUpcoming(booking.date);
  const isDone = booking.status === "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`rounded-2xl border-2 p-5 ${isDone ? "border-green-300 bg-green-50" : "border-gray-100 bg-white"} shadow-sm`}
    >
      {isDone && (
        <div className="flex items-center gap-2 mb-3 bg-green-600 text-white rounded-xl px-3 py-2 text-sm font-bold">
          <Sparkles className="h-4 w-4" />
          Your car is ready for collection!
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-black text-gray-900 text-base">{booking.serviceName}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gray-400" />{formatDate(booking.date)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gray-400" />{booking.time}</span>
          </div>
          {booking.servicePrice && (
            <p className="text-sm text-gray-500 mt-1">£{booking.servicePrice}</p>
          )}
          {booking.notes && (
            <p className="text-xs text-gray-400 mt-1 italic">"{booking.notes}"</p>
          )}
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          {cfg.icon}{cfg.label}
        </span>
      </div>
      {canCancel && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onCancel(booking.id)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-all border border-red-200"
          >
            <X className="h-3 w-3" /> Cancel booking
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const { customer, loading: authLoading, logout } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !customer) navigate("/my-account");
  }, [authLoading, customer, navigate]);

  const load = () => {
    setLoading(true);
    setError("");
    fetchCustomerBookings()
      .then(setBookings)
      .catch(() => setError("Failed to load your bookings. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (customer) load();
  }, [customer]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await cancelCustomerBooking(cancelId);
      setBookings(prev => prev.map(b => b.id === cancelId ? { ...b, status: "cancelled" as const } : b));
      setCancelId(null);
    } catch (err: any) {
      alert(err.message ?? "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  const active = bookings.filter(b => b.status !== "cancelled" && b.status !== "done" || (b.status === "done" && isUpcoming(b.date)));
  const past = bookings.filter(b => (b.status === "cancelled") || (b.status === "done" && !isUpcoming(b.date)));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060b1e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #060b1e 0%, #0d1a3a 100%)" }}>
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm">My Account</p>
              {customer && <p className="text-gray-400 text-xs">{customer.email}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} disabled={loading}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => { logout(); navigate("/my-account"); }}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-black text-white">
            Hello, {customer?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here are your bookings at Smart Shine Car Valeting Centre.</p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-500">
            <Loader2 className="h-7 w-7 animate-spin" />
            <p className="text-sm">Loading your bookings…</p>
          </div>
        ) : (
          <>
            {/* Active bookings */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Active &amp; Upcoming
              </h2>
              {active.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-white/10 text-center py-12 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No upcoming bookings</p>
                  <a href="/booking" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-bold mt-2 transition">
                    Book now <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {active.map(b => <BookingCard key={b.id} booking={b} onCancel={setCancelId} />)}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Past bookings */}
            {past.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Past &amp; Cancelled
                </h2>
                <div className="space-y-3 opacity-70">
                  <AnimatePresence>
                    {past.map(b => <BookingCard key={b.id} booking={b} onCancel={setCancelId} />)}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {bookings.length === 0 && (
              <div className="text-center py-4">
                <a href="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-black text-white transition-all">
                  Book your first valet <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </>
        )}
      </main>

      {/* Cancel confirm modal */}
      <AnimatePresence>
        {cancelId !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => !cancelling && setCancelId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-black text-gray-900">Cancel booking?</p>
                  <p className="text-sm text-gray-500">This cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                If you need to reschedule instead, please call us on{" "}
                <a href="tel:07717310046" className="text-blue-600 font-bold">07717 310 046</a>.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setCancelId(null)} disabled={cancelling}
                  className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                  Keep booking
                </button>
                <button onClick={handleCancel} disabled={cancelling}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
                  {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  {cancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
