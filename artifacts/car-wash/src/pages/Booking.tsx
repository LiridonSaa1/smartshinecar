import { useState, type ElementType } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import {
  useListServices,
  useGetAvailableSlots,
  useCreateBooking,
  getGetAvailableSlotsQueryKey,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock, CheckCircle, ChevronLeft, ChevronRight, Calendar,
  User, Phone, Mail, Sparkles, Car, Zap, Shield, Star,
  MapPin, CreditCard, Banknote, Landmark, Wallet, Hash, Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

type PaymentMethod = "cash" | "card" | "bank_transfer";

interface BookingForm {
  serviceId: number | null;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  paymentMethod: PaymentMethod;
  vehicleMake: string;
  vehicleModel: string;
  vehicleReg: string;
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; icon: ElementType; color: string; badge: string }[] = [
  {
    id: "cash",
    label: "Cash",
    desc: "Pay in cash when we arrive",
    icon: Banknote,
    color: "#10b981",
    badge: "Most popular",
  },
  {
    id: "card",
    label: "Card",
    desc: "Credit or debit card on-site",
    icon: CreditCard,
    color: "#3b82f6",
    badge: "",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    desc: "Pay before the appointment",
    icon: Landmark,
    color: "#8b5cf6",
    badge: "",
  },
];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getDurationLabel(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function CalendarPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initDate = value ? new Date(value + "T00:00:00") : new Date(getTomorrowDate() + "T00:00:00");
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
  const totalCells = startOffset + lastDay.getDate();
  const weeks = Math.ceil(totalCells / 7);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  const canGoPrev = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  const cells: Array<number | null> = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
            canGoPrev ? "hover:bg-white/10 text-white" : "text-slate-700 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-white font-semibold text-sm">{MONTHS[viewMonth]} {viewYear}</span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-white/5">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-600 py-2">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px p-3">
        {Array.from({ length: weeks * 7 }).map((_, idx) => {
          const dayNum = cells[idx];
          if (!dayNum) return <div key={idx} />;

          const dateStr = toDateStr(viewYear, viewMonth, dayNum);
          const cellDate = new Date(dateStr + "T00:00:00");
          const isPast = cellDate < today;
          const isToday = cellDate.getTime() === today.getTime();
          const isSelected = dateStr === value;
          const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;

          return (
            <motion.button
              key={idx}
              whileHover={!isPast ? { scale: 1.1 } : {}}
              whileTap={!isPast ? { scale: 0.95 } : {}}
              disabled={isPast}
              onClick={() => !isPast && onChange(dateStr)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 mx-0.5 my-0.5",
                isPast
                  ? "text-slate-800 cursor-not-allowed"
                  : isSelected
                  ? "text-white"
                  : isToday
                  ? "text-blue-300 border border-blue-500/40"
                  : isWeekend
                  ? "text-slate-400 hover:bg-white/8 hover:text-white"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              )}
              style={isSelected ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}
            >
              {isToday && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
              )}
              {dayNum}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const serviceIcons = [Car, Sparkles, Zap, Shield, Star, Car];

const stepConfig = [
  { num: 1, label: "Service", icon: Car },
  { num: 2, label: "Date & Time", icon: Calendar },
  { num: 3, label: "Your Info", icon: User },
  { num: 4, label: "Confirm", icon: CheckCircle },
];

export default function Booking() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const preselectedServiceId = params.get("serviceId") ? parseInt(params.get("serviceId")!) : null;

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BookingForm>({
    serviceId: preselectedServiceId,
    date: getTomorrowDate(),
    time: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
    paymentMethod: "cash",
    vehicleMake: "",
    vehicleModel: "",
    vehicleReg: "",
  });
  const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const { data: services, isLoading: servicesLoading } = useListServices();
  const slotsParams = { date: form.date, serviceId: form.serviceId ?? 0 };
  const { data: slots, isLoading: slotsLoading } = useGetAvailableSlots(slotsParams, {
    query: {
      enabled: !!(form.serviceId && form.date),
      queryKey: getGetAvailableSlotsQueryKey(slotsParams),
    },
  });
  const createBooking = useCreateBooking();
  const selectedService = services?.find((s) => s.id === form.serviceId);

  const handleSubmit = () => {
    if (!form.serviceId || !form.date || !form.time || !form.customerName || !form.customerPhone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const paymentLabel = PAYMENT_OPTIONS.find(p => p.id === form.paymentMethod)?.label ?? form.paymentMethod;
    const vehicleParts = [form.vehicleMake, form.vehicleModel, form.vehicleReg].filter(Boolean);
    const vehicleStr = vehicleParts.length ? `Vehicle: ${vehicleParts.join(" ")}` : null;
    const notesWithPayment = [vehicleStr, form.notes, `Payment: ${paymentLabel}`].filter(Boolean).join(" | ");
    createBooking.mutate(
      {
        data: {
          serviceId: form.serviceId,
          date: form.date,
          time: form.time,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
          notes: notesWithPayment,
        },
      },
      {
        onSuccess: (booking) => {
          setConfirmedBookingId(booking.id);
          setStep(4);
        },
        onError: () => toast.error("Booking failed. Please try again."),
      }
    );
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === 4 && confirmedBookingId) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative max-w-lg w-full"
          >
            <div className="absolute inset-0 rounded-3xl blur-xl opacity-30" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }} />
            <div className="relative rounded-3xl p-10 text-center border border-white/10" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">All Booked!</h2>
              <p className="text-blue-200 mb-8">Booking #{confirmedBookingId} confirmed. We'll be in touch shortly.</p>
              <div className="rounded-2xl p-5 mb-8 text-left space-y-3 border border-white/10" style={{ background: "rgba(255,255,255,0.05)" }}>
                {[
                  { icon: Car, label: "Service", value: selectedService?.name },
                  { icon: Calendar, label: "Date", value: formatDate(form.date) },
                  { icon: Clock, label: "Time", value: form.time },
                  ...([form.vehicleMake, form.vehicleModel].filter(Boolean).length ? [{ icon: Truck, label: "Vehicle", value: [form.vehicleMake, form.vehicleModel].filter(Boolean).join(" ") }] : []),
                  ...(form.vehicleReg ? [{ icon: Hash, label: "Reg Plate", value: form.vehicleReg }] : []),
                  { icon: Wallet, label: "Payment", value: PAYMENT_OPTIONS.find(p => p.id === form.paymentMethod)?.label },
                  { icon: CreditCard, label: "Total", value: `£${selectedService?.price}` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.2)" }}>
                      <Icon className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-blue-300 text-sm flex-1">{label}</span>
                    <span className="text-white font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 justify-center text-sm text-blue-300 mb-6">
                <MapPin className="h-4 w-4" />
                <span>Smart Shine Car Valeting Centre, Guildford</span>
              </div>
              <Button
                className="w-full h-12 text-base font-semibold rounded-xl"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // ── Main booking flow ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-blue-300 border border-blue-500/30 mb-4" style={{ background: "rgba(59,130,246,0.1)" }}>
              <Sparkles className="h-4 w-4" />
              Premium Car Valeting
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Book Your Valet</h1>
            <p className="text-blue-200 text-lg">Professional detailing in just a few steps</p>
          </motion.div>

          {/* Step indicators */}
          <div className="flex items-center justify-center mb-12">
            {stepConfig.map((s, i) => {
              const Icon = s.icon;
              const isComplete = step > s.num;
              const isActive = step === s.num;
              return (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border"
                      style={{
                        background: isComplete
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : isActive
                          ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                          : "rgba(255,255,255,0.05)",
                        borderColor: isComplete ? "rgba(16,185,129,0.5)" : isActive ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {isComplete
                        ? <CheckCircle className="h-5 w-5 text-white" />
                        : <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500")} />
                      }
                    </motion.div>
                    <span className={cn("text-xs font-medium", isActive ? "text-white" : isComplete ? "text-emerald-400" : "text-slate-500")}>
                      {s.label}
                    </span>
                  </div>
                  {i < stepConfig.length - 1 && (
                    <div className="w-16 sm:w-24 h-px mx-3 mb-6 transition-all duration-500" style={{
                      background: step > s.num ? "linear-gradient(90deg, #10b981, #059669)" : "rgba(255,255,255,0.1)"
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Content + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* ── Main form ── */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* STEP 1 — Service */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <div className="rounded-3xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                      <h2 className="text-2xl font-bold text-white mb-1">Choose a Service</h2>
                      <p className="text-slate-400 mb-6">Select the package that best suits your vehicle.</p>
                      {servicesLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-36 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {services?.filter(s => s.isActive).map((service, idx) => {
                            const Icon = serviceIcons[idx % serviceIcons.length];
                            const isSelected = form.serviceId === service.id;
                            return (
                              <motion.button
                                key={service.id}
                                data-testid={`button-select-service-${service.id}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setForm(f => ({ ...f, serviceId: service.id }))}
                                className="relative w-full p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden"
                                style={{
                                  borderColor: isSelected ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.1)",
                                  background: isSelected
                                    ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))"
                                    : "rgba(255,255,255,0.04)",
                                }}
                              >
                                <div className="relative">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                                      background: isSelected ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.08)"
                                    }}>
                                      <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-slate-400")} />
                                    </div>
                                    {isSelected && (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                                        <CheckCircle className="h-4 w-4 text-white" />
                                      </motion.div>
                                    )}
                                  </div>
                                  <h3 className="font-bold text-white text-base mb-1">{service.name}</h3>
                                  <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">{service.description || "Professional car care service"}</p>
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                                      <Clock className="h-3.5 w-3.5" />{getDurationLabel(service.duration)}
                                    </span>
                                    <span className="text-xl font-bold text-white">£{service.price}</span>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                      <div className="flex justify-end mt-6">
                        <Button disabled={!form.serviceId} onClick={() => setStep(2)} data-testid="button-next-step1"
                          className="h-12 px-8 rounded-xl font-semibold text-base"
                          style={{ background: form.serviceId ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : undefined }}>
                          Next Step <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — Date & Time */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <div className="rounded-3xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                      <h2 className="text-2xl font-bold text-white mb-1">Pick a Date & Time</h2>
                      <p className="text-slate-400 mb-6">Choose your preferred appointment slot.</p>

                      {/* Visual Calendar */}
                      <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          Select Date
                        </label>
                        <CalendarPicker
                          value={form.date}
                          onChange={(d) => setForm(f => ({ ...f, date: d, time: "" }))}
                        />
                        {form.date && (
                          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-center text-sm text-blue-300 font-medium">
                            {formatDate(form.date)}
                          </motion.p>
                        )}
                      </div>

                      {/* Time slots */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                          <Clock className="h-4 w-4 text-blue-400" />
                          Available Time Slots
                        </label>
                        {slotsLoading ? (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <Skeleton key={i} className="h-11 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
                            ))}
                          </div>
                        ) : !slots?.length ? (
                          <div className="text-center py-10 text-slate-500">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p>No slots available for this date.</p>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="grid grid-cols-4 sm:grid-cols-6 gap-2"
                          >
                            {slots.map((slot) => (
                              <motion.button
                                key={slot.time}
                                data-testid={`button-slot-${slot.time}`}
                                whileHover={slot.available ? { scale: 1.05 } : {}}
                                whileTap={slot.available ? { scale: 0.95 } : {}}
                                disabled={!slot.available}
                                onClick={() => setForm(f => ({ ...f, time: slot.time }))}
                                className={cn(
                                  "py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200",
                                  !slot.available
                                    ? "border-white/5 text-slate-700 cursor-not-allowed line-through"
                                    : form.time === slot.time
                                    ? "border-blue-500/60 text-white"
                                    : "border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                                )}
                                style={
                                  slot.available && form.time === slot.time
                                    ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }
                                    : slot.available
                                    ? { background: "rgba(255,255,255,0.04)" }
                                    : {}
                                }
                              >
                                {slot.time}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent">
                          <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button disabled={!form.date || !form.time} onClick={() => setStep(3)} data-testid="button-next-step2"
                          className="h-12 px-8 rounded-xl font-semibold"
                          style={{ background: form.date && form.time ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : undefined }}>
                          Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 — Your Info */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <div className="rounded-3xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                      <h2 className="text-2xl font-bold text-white mb-1">Your Details</h2>
                      <p className="text-slate-400 mb-6">Let us know how to reach you.</p>
                      <div className="space-y-5">
                        {[
                          { icon: User, label: "Full Name", key: "customerName", type: "text", placeholder: "John Smith", required: true, testid: "input-customer-name" },
                          { icon: Phone, label: "Phone Number", key: "customerPhone", type: "tel", placeholder: "+44 7700 000 000", required: true, testid: "input-customer-phone" },
                          { icon: Mail, label: "Email Address", key: "customerEmail", type: "email", placeholder: "john@example.com", required: false, testid: "input-customer-email" },
                        ].map(({ icon: Icon, label, key, type, placeholder, required, testid }) => (
                          <div key={key}>
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                              <Icon className="h-4 w-4 text-blue-400" />
                              {label}
                              {required ? <span className="text-blue-400">*</span> : <span className="text-slate-600 text-xs">(optional)</span>}
                            </label>
                            <input
                              data-testid={testid}
                              type={type}
                              value={form[key as keyof BookingForm] as string}
                              onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                              placeholder={placeholder}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                          </div>
                        ))}

                        {/* Vehicle Details */}
                        <div className="rounded-2xl border border-white/8 p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)" }}>
                              <Truck className="h-4 w-4 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">Your Vehicle</p>
                              <p className="text-xs text-slate-500">Helps us prepare the right equipment</p>
                            </div>
                            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full text-slate-400 border border-white/10">optional</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { key: "vehicleMake", label: "Make", placeholder: "e.g. BMW", icon: Car },
                              { key: "vehicleModel", label: "Model", placeholder: "e.g. 3 Series", icon: Car },
                            ].map(({ key, label, placeholder, icon: Icon }) => (
                              <div key={key}>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                                  <Icon className="h-3.5 w-3.5" />
                                  {label}
                                </label>
                                <input
                                  type="text"
                                  value={form[key as keyof BookingForm] as string}
                                  onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                                  placeholder={placeholder}
                                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                                />
                              </div>
                            ))}
                            <div className="col-span-2">
                              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                Registration Plate
                              </label>
                              <input
                                type="text"
                                value={form.vehicleReg}
                                onChange={(e) => setForm(f => ({ ...f, vehicleReg: e.target.value.toUpperCase() }))}
                                placeholder="e.g. AB12 CDE"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-slate-600 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Wallet className="h-4 w-4 text-blue-400" />
                            Payment Method <span className="text-blue-400">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {PAYMENT_OPTIONS.map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = form.paymentMethod === opt.id;
                              return (
                                <motion.button
                                  key={opt.id}
                                  type="button"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setForm(f => ({ ...f, paymentMethod: opt.id }))}
                                  className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200"
                                  style={{
                                    borderColor: isSelected ? `${opt.color}60` : "rgba(255,255,255,0.08)",
                                    background: isSelected
                                      ? `${opt.color}18`
                                      : "rgba(255,255,255,0.03)",
                                  }}
                                >
                                  {opt.badge && (
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                                      style={{ background: opt.color, color: "#fff" }}>
                                      {opt.badge}
                                    </span>
                                  )}
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: isSelected ? `${opt.color}30` : "rgba(255,255,255,0.06)" }}>
                                    <Icon className="h-5 w-5" style={{ color: isSelected ? opt.color : "#64748b" }} />
                                  </div>
                                  <div>
                                    <p className={cn("text-sm font-semibold", isSelected ? "text-white" : "text-slate-400")}>{opt.label}</p>
                                    <p className="text-[11px] text-slate-600 leading-tight mt-0.5">{opt.desc}</p>
                                  </div>
                                  {isSelected && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                      className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                      style={{ background: opt.color }}>
                                      <CheckCircle className="h-3 w-3 text-white" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Additional Notes <span className="text-slate-600 text-xs">(optional)</span>
                          </label>
                          <textarea
                            data-testid="input-booking-notes"
                            value={form.notes}
                            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                            placeholder="e.g. My car has a scratch on the left door..."
                            rows={3}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={() => setStep(2)} className="h-12 px-6 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent">
                          <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button disabled={!form.customerName || !form.customerPhone} onClick={() => setStep(4)} data-testid="button-next-step3"
                          className="h-12 px-8 rounded-xl font-semibold"
                          style={{ background: form.customerName && form.customerPhone ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : undefined }}>
                          Review Booking <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 — Confirm */}
                {step === 4 && !confirmedBookingId && (
                  <motion.div key="step4-confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                    <div className="rounded-3xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                      <h2 className="text-2xl font-bold text-white mb-1">Confirm Your Booking</h2>
                      <p className="text-slate-400 mb-6">Double-check your details before we confirm.</p>
                      <div className="space-y-3 mb-6">
                        {[
                          { icon: Car, label: "Service", value: selectedService?.name, accent: true },
                          { icon: Clock, label: "Duration", value: getDurationLabel(selectedService?.duration ?? 0) },
                          { icon: Calendar, label: "Date", value: formatDate(form.date) },
                          { icon: Clock, label: "Time", value: form.time },
                          { icon: User, label: "Name", value: form.customerName },
                          { icon: Phone, label: "Phone", value: form.customerPhone },
                          ...(form.customerEmail ? [{ icon: Mail, label: "Email", value: form.customerEmail, accent: false }] : []),
                          ...([form.vehicleMake, form.vehicleModel].filter(Boolean).length ? [{ icon: Truck, label: "Vehicle", value: [form.vehicleMake, form.vehicleModel].filter(Boolean).join(" "), accent: false }] : []),
                          ...(form.vehicleReg ? [{ icon: Hash, label: "Reg Plate", value: form.vehicleReg, accent: false }] : []),
                          ...(form.notes ? [{ icon: Sparkles, label: "Notes", value: form.notes, accent: false }] : []),
                          { icon: Wallet, label: "Payment", value: PAYMENT_OPTIONS.find(p => p.id === form.paymentMethod)?.label, accent: false },
                        ].map(({ icon: Icon, label, value, accent }) => (
                          <div key={label} className="flex items-center gap-3 py-2.5 px-4 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
                              <Icon className="h-4 w-4 text-blue-400" />
                            </div>
                            <span className="text-slate-400 text-sm flex-1">{label}</span>
                            <span className={cn("font-semibold text-sm text-right", accent ? "text-blue-300" : "text-white")}>{value}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-3 py-3 px-4 rounded-xl border border-blue-500/30" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))" }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-slate-300 text-sm flex-1 font-medium">Total Price</span>
                          <span className="text-2xl font-bold text-white">£{selectedService?.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 px-1">
                        <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Payment is made on-site. You'll receive an SMS confirmation shortly after booking.</span>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(3)} className="h-12 px-6 rounded-xl border-white/10 text-white hover:bg-white/10 bg-transparent">
                          <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={handleSubmit} disabled={createBooking.isPending} data-testid="button-confirm-booking"
                          className="h-12 px-8 rounded-xl font-semibold text-base"
                          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                          {createBooking.isPending ? (
                            <span className="flex items-center gap-2">
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Sparkles className="h-4 w-4" />
                              </motion.div>
                              Confirming...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" /> Confirm Booking
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Sidebar ── */}
            <div className="hidden lg:block">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="rounded-3xl p-6 border border-white/10 sticky top-6"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Your Booking</h3>
                <AnimatePresence>
                  {selectedService ? (
                    <motion.div key="service" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-4 rounded-2xl border border-blue-500/20"
                      style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))" }}>
                      <p className="text-xs text-slate-500 mb-1">Service</p>
                      <p className="text-white font-bold text-lg">{selectedService.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-slate-400 text-sm flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />{getDurationLabel(selectedService.duration)}
                        </span>
                        <span className="text-2xl font-bold text-white">£{selectedService.price}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="no-service" className="mb-5 p-4 rounded-2xl border border-dashed border-white/10 text-center">
                      <Car className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm">No service selected yet</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-3">
                  {[
                    { icon: Calendar, label: "Date", value: form.date ? formatDate(form.date) : null, placeholder: "Not selected" },
                    { icon: Clock, label: "Time", value: form.time || null, placeholder: "Not selected" },
                    { icon: User, label: "Name", value: form.customerName || null, placeholder: "Not provided" },
                    { icon: Phone, label: "Phone", value: form.customerPhone || null, placeholder: "Not provided" },
                    { icon: Truck, label: "Vehicle", value: [form.vehicleMake, form.vehicleModel].filter(Boolean).join(" ") || null, placeholder: "Not provided" },
                    ...(form.vehicleReg ? [{ icon: Hash, label: "Reg Plate", value: form.vehicleReg, placeholder: "" }] : []),
                    { icon: Wallet, label: "Payment", value: PAYMENT_OPTIONS.find(p => p.id === form.paymentMethod)?.label ?? null, placeholder: "Not selected" },
                  ].map(({ icon: Icon, label, value, placeholder }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <Icon className="h-3.5 w-3.5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{label}</p>
                        <p className={cn("text-sm font-medium", value ? "text-white" : "text-slate-700")}>{value ?? placeholder}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Smart Shine Car Valeting Centre, Guildford, Surrey</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Payment on-site · Free cancellation</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
