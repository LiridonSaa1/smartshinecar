import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Loader2, AlertTriangle, CheckCircle2, Sparkles, X,
} from "lucide-react";
import {
  useCustomerAuth,
  fetchCustomerBookings,
  submitCustomerReview,
} from "@/lib/customerAuth";
import { CustomerLayout } from "@/components/layout/CustomerLayout";

interface Booking {
  id: number;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
  status: string;
  hasReview?: boolean;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  } catch { return dateStr; }
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(n)}
          className={readonly ? "cursor-default" : "transition-transform hover:scale-110"}
        >
          <Star
            className="h-7 w-7"
            fill={(hovered || value) >= n ? "#f59e0b" : "none"}
            stroke={(hovered || value) >= n ? "#f59e0b" : "#d1d5db"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ booking, onSubmitted }: { booking: Booking; onSubmitted: (id: number) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setSaving(true); setError("");
    try {
      await submitCustomerReview(booking.id, { rating, comment });
      setDone(true);
      onSubmitted(booking.id);
    } catch (err: any) {
      setError(err.message ?? "Failed to submit review");
    } finally { setSaving(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      {done ? (
        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold text-card-foreground text-sm">Review submitted — thank you!</p>
            <p className="text-xs text-muted-foreground">{booking.serviceName}</p>
          </div>
          <div className="ml-auto">
            <StarRating value={rating} readonly />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </div>
                <p className="font-black text-card-foreground">{booking.serviceName}</p>
              </div>
              <p className="text-xs text-muted-foreground pl-10">{formatDate(booking.date)} at {booking.time}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 text-xs font-bold flex-shrink-0">
              <Sparkles className="h-3 w-3" /> Completed
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Review</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us about your experience — what did you love? Would you recommend us to others?"
                rows={3}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving || rating === 0 || !comment.trim()}
              className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
              {saving ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function CustomerReviews() {
  const { customer, loading: authLoading } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !customer) navigate("/my-account");
  }, [authLoading, customer, navigate]);

  useEffect(() => {
    if (!customer) return;
    setLoading(true);
    fetchCustomerBookings()
      .then(data => setBookings(data))
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, [customer]);

  const handleSubmitted = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, hasReview: true } : b));
  };

  const reviewable = bookings.filter(b => b.status === "done" && !b.hasReview);
  const alreadyReviewed = bookings.filter(b => b.status === "done" && b.hasReview);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Write a Review</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Share your experience — your feedback helps us improve
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-7 w-7 animate-spin" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : (
          <>
            {reviewable.length === 0 && alreadyReviewed.length === 0 && (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl text-center py-16 text-muted-foreground">
                <Star className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-gray-700">No completed bookings yet</p>
                <p className="text-sm mt-1">Reviews become available after your valet is marked as done.</p>
                <a href="/booking" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-sm font-bold mt-3 transition">
                  Book a valet →
                </a>
              </div>
            )}

            {reviewable.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
                  Awaiting your review
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {reviewable.map(b => (
                      <ReviewCard key={b.id} booking={b} onSubmitted={handleSubmitted} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {alreadyReviewed.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">
                  Already reviewed
                </h2>
                <div className="space-y-3 opacity-70">
                  {alreadyReviewed.map(b => (
                    <div key={b.id} className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Star className="h-4 w-4 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-card-foreground">{b.serviceName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(b.date)}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reviewed
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
