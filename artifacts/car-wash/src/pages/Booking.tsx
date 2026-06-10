import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import {
  useListServices,
  useGetAvailableSlots,
  useCreateBooking,
  getGetAvailableSlotsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, DollarSign, CheckCircle, ChevronLeft, ChevronRight, Calendar, User, Phone, Mail, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLocation, useSearch } from "wouter";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

interface BookingForm {
  serviceId: number | null;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getTomorrowDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

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
  });
  const [confirmedBookingId, setConfirmedBookingId] = useState<number | null>(null);
  const [, setLocation] = useLocation();

  const { data: services, isLoading: servicesLoading } = useListServices();
  const slotsParams = {
    date: form.date,
    serviceId: form.serviceId ?? 0,
  };
  const { data: slots, isLoading: slotsLoading } = useGetAvailableSlots(
    slotsParams,
    {
      query: {
        enabled: !!(form.serviceId && form.date),
        queryKey: getGetAvailableSlotsQueryKey(slotsParams),
      },
    }
  );
  const createBooking = useCreateBooking();

  const selectedService = services?.find((s) => s.id === form.serviceId);

  const steps = [
    { num: 1, label: "Service" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Your Info" },
    { num: 4, label: "Confirm" },
  ];

  const handleSubmit = () => {
    if (!form.serviceId || !form.date || !form.time || !form.customerName || !form.customerPhone) {
      toast.error("Please fill in all required fields.");
      return;
    }
    createBooking.mutate(
      {
        data: {
          serviceId: form.serviceId,
          date: form.date,
          time: form.time,
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || undefined,
          notes: form.notes || undefined,
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

  if (step === 4 && confirmedBookingId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-3xl p-10 max-w-md w-full text-center shadow-xl"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Your booking #{confirmedBookingId} has been received. We'll see you soon!
            </p>
            <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{formatDate(form.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{form.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-primary">${selectedService?.price}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setLocation("/")} data-testid="button-back-home">
              Back to Home
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-3xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-10">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold border-2 transition-all",
                      step > s.num
                        ? "bg-primary border-primary text-primary-foreground"
                        : step === s.num
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-muted-foreground bg-muted"
                    )}
                  >
                    {step > s.num ? <CheckCircle className="h-4 w-4" /> : s.num}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1.5 font-medium",
                      step === s.num ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-colors", step > s.num ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Select a Service</h2>
                <p className="text-muted-foreground text-center mb-8">Choose the service that best fits your car's needs.</p>
                {servicesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services?.filter(s => s.isActive).map((service) => (
                      <button
                        key={service.id}
                        data-testid={`button-select-service-${service.id}`}
                        onClick={() => setForm(f => ({ ...f, serviceId: service.id }))}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left hover:shadow-md",
                          form.serviceId === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <div>
                          <p className="font-semibold text-card-foreground">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.description || "Professional car care service"}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />{service.duration} min
                            </span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-xl font-bold text-primary">${service.price}</span>
                          {form.serviceId === service.id && (
                            <div className="mt-1">
                              <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <Button disabled={!form.serviceId} onClick={() => setStep(2)} data-testid="button-next-step1">
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Choose Date & Time</h2>
                <p className="text-muted-foreground text-center mb-8">Select your preferred appointment slot.</p>
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    data-testid="input-booking-date"
                    min={getTodayDate()}
                    value={form.date}
                    onChange={(e) => setForm(f => ({ ...f, date: e.target.value, time: "" }))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <label className="text-sm font-medium mb-4 block flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Available Time Slots
                  </label>
                  {slotsLoading ? (
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {slots?.map((slot) => (
                        <button
                          key={slot.time}
                          data-testid={`button-slot-${slot.time}`}
                          disabled={!slot.available}
                          onClick={() => setForm(f => ({ ...f, time: slot.time }))}
                          className={cn(
                            "py-2 rounded-lg text-sm font-medium border transition-all",
                            !slot.available
                              ? "border-border text-muted-foreground/40 bg-muted cursor-not-allowed"
                              : form.time === slot.time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card text-card-foreground hover:border-primary hover:bg-primary/5"
                          )}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button disabled={!form.date || !form.time} onClick={() => setStep(3)} data-testid="button-next-step2">
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Your Information</h2>
                <p className="text-muted-foreground text-center mb-8">Tell us how to reach you.</p>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                      <User className="h-4 w-4 text-primary" /> Full Name *
                    </label>
                    <Input data-testid="input-customer-name" value={form.customerName} onChange={(e) => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                      <Phone className="h-4 w-4 text-primary" /> Phone Number *
                    </label>
                    <Input data-testid="input-customer-phone" type="tel" value={form.customerPhone} onChange={(e) => setForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+383 44 000 000" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
                      <Mail className="h-4 w-4 text-primary" /> Email (optional)
                    </label>
                    <Input data-testid="input-customer-email" type="email" value={form.customerEmail} onChange={(e) => setForm(f => ({ ...f, customerEmail: e.target.value }))} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Additional Notes (optional)</label>
                    <Textarea data-testid="input-booking-notes" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. Car has some scratches on left side." rows={3} />
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button disabled={!form.customerName || !form.customerPhone} onClick={() => setStep(4)} data-testid="button-next-step3">
                    Review Booking <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && !confirmedBookingId && (
              <motion.div key="step4-confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Confirm Booking</h2>
                <p className="text-muted-foreground text-center mb-8">Review your details before confirming.</p>
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-card-foreground mb-4 pb-2 border-b border-border">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    {[
                      { label: "Service", value: selectedService?.name },
                      { label: "Duration", value: `${selectedService?.duration} min` },
                      { label: "Date", value: formatDate(form.date) },
                      { label: "Time", value: form.time },
                      { label: "Name", value: form.customerName },
                      { label: "Phone", value: form.customerPhone },
                      { label: "Email", value: form.customerEmail || "—" },
                      { label: "Notes", value: form.notes || "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-card-foreground text-right max-w-[60%]">{value}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-primary">${selectedService?.price}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mb-6">
                  You will receive a confirmation via SMS. Payment is made on-site.
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createBooking.isPending}
                    className="px-8"
                    data-testid="button-confirm-booking"
                  >
                    {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
