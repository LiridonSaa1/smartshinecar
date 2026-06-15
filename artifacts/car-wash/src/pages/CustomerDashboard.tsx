import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, LogOut, Calendar, Clock, CheckCircle2, XCircle,
  Loader2, AlertTriangle, Sparkles, ChevronRight, X, RefreshCw, Pencil,
  Star, MessageSquare, StickyNote, PlusCircle, FileText, Send,
} from "lucide-react";
import {
  useCustomerAuth,
  fetchCustomerBookings,
  cancelCustomerBooking,
  editCustomerBooking,
  addCustomerBookingNote,
  submitCustomerReview,
  CUSTOMER_API_BASE,
} from "@/lib/customerAuth";

interface Booking {
  id: number;
  customerName: string;
  serviceId: number;
  serviceName: string;
  servicePrice: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  notes?: string | null;
  hasReview?: boolean;
  createdAt: string;
}

interface Slot { time: string; available: boolean; }

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

function todayIso() {
  return new Date().toISOString().split("T")[0];
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className="h-8 w-8"
            fill={(hovered || value) >= n ? "#f59e0b" : "none"}
            stroke={(hovered || value) >= n ? "#f59e0b" : "#d1d5db"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewModal({ booking, onClose, onSubmitted }: {
  booking: Booking;
  onClose: () => void;
  onSubmitted: (id: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!comment.trim()) { setError("Please write a short comment."); return; }
    setSaving(true);
    setError("");
    try {
      await submitCustomerReview(booking.id, { rating, comment });
      onSubmitted(booking.id);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to submit review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={() => !saving && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-black text-gray-900">Leave a Review</p>
              <p className="text-xs text-gray-500">{booking.serviceName}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
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
              placeholder="Tell us about your experience…"
              rows={4}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving || rating === 0 || !comment.trim()}
            className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
            {saving ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddNoteModal({ booking, onClose, onSaved }: {
  booking: Booking;
  onClose: () => void;
  onSaved: (id: number, notes: string) => void;
}) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!note.trim()) { setError("Please write a note or request."); return; }
    setSaving(true);
    setError("");
    try {
      const result = await addCustomerBookingNote(booking.id, note);
      onSaved(booking.id, result.notes ?? "");
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={() => !saving && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <StickyNote className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-black text-gray-900">Add a Note / Extras</p>
              <p className="text-xs text-gray-500">{booking.serviceName} · {formatDate(booking.date)}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Note / Special Request / Extras
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Please add interior shampoo. My car has a scratch on the rear bumper. Key will be left with reception."
              rows={4}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 transition"
            />
            <p className="text-xs text-gray-400 mt-1.5">Our team will see this note before your appointment.</p>
          </div>
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !note.trim()}
            className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Note"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function QuoteModal({ customer, onClose }: {
  customer: { name: string; email: string };
  onClose: () => void;
}) {
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
  const API = BASE ? `${BASE}/api` : "/api";

  const handleSend = async () => {
    if (!description.trim()) { setError("Please describe what you need a quote for."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          phone: phone.trim() || undefined,
          message: description.trim(),
          source: "quote",
        }),
      });
      if (!res.ok) throw new Error("Failed to send quote request");
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to send quote request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={() => !saving && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-black text-gray-900">Request a Quote</p>
              <p className="text-xs text-gray-500">We'll get back to you within 24 hours</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <p className="font-black text-gray-900 text-lg">Quote Request Sent!</p>
            <p className="text-gray-500 text-sm mt-2">
              We'll review your request and reply to <strong>{customer.email}</strong> within 24 hours.
            </p>
            <button onClick={onClose}
              className="mt-5 rounded-xl bg-gray-100 hover:bg-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Request</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. I have a 2019 BMW X5 with leather interior. I'd like a full valet including engine bay clean and paint correction. What would this cost?"
                rows={5}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-emerald-400 transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">Include your vehicle make/model and the services you're interested in.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="07700 900000"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
              </div>
            )}
            <div className="flex gap-3 mt-2">
              <button onClick={onClose} disabled={saving}
                className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleSend} disabled={saving || !description.trim()}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {saving ? "Sending…" : "Send Request"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function EditBookingModal({
  booking,
  onClose,
  onSaved,
}: {
  booking: Booking;
  onClose: () => void;
  onSaved: (id: number, date: string, time: string, notes: string) => void;
}) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date || !booking.serviceId) return;
    setLoadingSlots(true);
    setSlots([]);
    fetch(`${CUSTOMER_API_BASE}/bookings/slots?date=${date}&serviceId=${booking.serviceId}`)
      .then(r => r.json())
      .then((data: Slot[]) => {
        setSlots(data);
        const currentAvailable = data.find(s => s.time === time && s.available);
        if (!currentAvailable) setTime("");
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [date, booking.serviceId]);

  const handleSave = async () => {
    if (!date || !time) { setError("Please select a date and time."); return; }
    setSaving(true);
    setError("");
    try {
      await editCustomerBooking(booking.id, { date, time, notes });
      onSaved(booking.id, date, time, notes);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 px-4 py-8 overflow-y-auto"
      onClick={() => !saving && onClose()}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl my-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Pencil className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-black text-gray-900">Edit Booking</p>
              <p className="text-xs text-gray-500">{booking.serviceName}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={saving}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Date</label>
            <input
              type="date"
              min={todayIso()}
              value={date}
              onChange={e => { setDate(e.target.value); setTime(""); }}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Time</label>
            {loadingSlots ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-3">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading available slots…
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">Select a date to see available times</p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {slots.map(s => (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available && s.time !== booking.time}
                    onClick={() => s.available && setTime(s.time)}
                    className={`rounded-lg py-2 text-xs font-bold border transition-all ${
                      time === s.time
                        ? "bg-blue-600 text-white border-blue-600"
                        : s.available
                        ? "border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
                        : "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes <span className="font-normal text-gray-400">(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special requests or vehicle details…"
              rows={3}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 rounded-xl border-2 border-gray-200 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !date || !time}
            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BookingCard({
  booking,
  onCancel,
  onEdit,
  onReview,
  onAddNote,
}: {
  booking: Booking;
  onCancel: (id: number) => void;
  onEdit: (b: Booking) => void;
  onReview: (b: Booking) => void;
  onAddNote: (b: Booking) => void;
}) {
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const upcoming = isUpcoming(booking.date);
  const canCancel = (booking.status === "pending" || booking.status === "confirmed") && upcoming;
  const canEdit = booking.status === "pending" && upcoming;
  const canAddNote = (booking.status === "pending" || booking.status === "confirmed") && upcoming;
  const canReview = booking.status === "done" && !booking.hasReview;
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
            <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">"{booking.notes}"</p>
          )}
          {isDone && booking.hasReview && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-semibold">
              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" /> Review submitted — thank you!
            </div>
          )}
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold flex-shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          {cfg.icon}{cfg.label}
        </span>
      </div>
      {(canEdit || canCancel || canAddNote || canReview) && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          {canReview && (
            <button
              onClick={() => onReview(booking)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg px-3 py-1.5 transition-all border border-amber-200"
            >
              <Star className="h-3 w-3" /> Leave a review
            </button>
          )}
          {canAddNote && (
            <button
              onClick={() => onAddNote(booking)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg px-3 py-1.5 transition-all border border-purple-200"
            >
              <MessageSquare className="h-3 w-3" /> Add note / extras
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => onEdit(booking)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-all border border-blue-200"
            >
              <Pencil className="h-3 w-3" /> Edit booking
            </button>
          )}
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-1.5 transition-all border border-red-200"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
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
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [noteBooking, setNoteBooking] = useState<Booking | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

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

  const handleEdited = (id: number, date: string, time: string, notes: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, date, time, notes } : b));
  };

  const handleNoteSaved = (id: number, notes: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, notes } : b));
  };

  const handleReviewSubmitted = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, hasReview: true } : b));
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
                    {active.map(b => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={setCancelId}
                        onEdit={setEditBooking}
                        onReview={setReviewBooking}
                        onAddNote={setNoteBooking}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  Past &amp; Cancelled
                </h2>
                <div className="space-y-3 opacity-70">
                  <AnimatePresence>
                    {past.map(b => (
                      <BookingCard
                        key={b.id}
                        booking={b}
                        onCancel={setCancelId}
                        onEdit={setEditBooking}
                        onReview={setReviewBooking}
                        onAddNote={setNoteBooking}
                      />
                    ))}
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

            <section>
              <div className="rounded-2xl border border-white/10 p-5 flex items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Need a custom quote?</p>
                    <p className="text-gray-400 text-xs">Describe your vehicle &amp; requirements — we'll reply within 24h</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 rounded-lg px-3 py-2 transition border border-emerald-500/30 hover:bg-emerald-500/10 flex-shrink-0"
                >
                  Get a Quote <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </section>
          </>
        )}
      </main>

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
                Need to reschedule instead? Use the{" "}
                <button onClick={() => {
                  const b = bookings.find(x => x.id === cancelId);
                  if (b) { setCancelId(null); setEditBooking(b); }
                }} className="text-blue-600 font-bold hover:underline">Edit booking</button>
                {" "}option, or call{" "}
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

      <AnimatePresence>
        {editBooking && (
          <EditBookingModal
            booking={editBooking}
            onClose={() => setEditBooking(null)}
            onSaved={handleEdited}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewBooking && (
          <ReviewModal
            booking={reviewBooking}
            onClose={() => setReviewBooking(null)}
            onSubmitted={handleReviewSubmitted}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {noteBooking && (
          <AddNoteModal
            booking={noteBooking}
            onClose={() => setNoteBooking(null)}
            onSaved={handleNoteSaved}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuoteModal && customer && (
          <QuoteModal
            customer={customer}
            onClose={() => setShowQuoteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
