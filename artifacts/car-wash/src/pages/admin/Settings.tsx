import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey, type BusinessSettings } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Eye, EyeOff, Mail, CheckCircle, AlertCircle, Send, Loader2, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EMAIL_TEMPLATES = [
  {
    id: "new_booking_admin",
    label: "New Booking Alert (to admin)",
    description: "Sent to the notification email when a customer books online.",
    subject: "New Booking Received — Smart Shine",
    preview: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:20px 28px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">New Booking Received</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Smart Shine Car Valeting Centre</p>
        </div>
        <div style="padding:20px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;width:110px;border-bottom:1px solid #e5e7eb">Customer</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#111827">James Harrington</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Phone</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#2563eb">07700 900123</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Service</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#111827">Full Valet — £120.00</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Date</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#111827">2026-06-15</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151">Time</td><td style="padding:8px 10px;color:#111827">09:00</td></tr>
          </table>
          <div style="margin-top:14px;padding:10px;background:#fefce8;border:1px solid #fde047;border-radius:6px;font-size:12px;color:#713f12">
            Log in to your admin panel to confirm or manage this booking.
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "booking_confirmed",
    label: "Booking Confirmed (to customer)",
    description: "Sent to the customer when you mark their booking as confirmed.",
    subject: "Your Booking is Confirmed ✓ — Smart Shine",
    preview: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:20px 28px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">Your Booking is Confirmed ✓</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Smart Shine Car Valeting Centre</p>
        </div>
        <div style="padding:20px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="color:#374151;font-size:14px;margin:0 0 12px">Hi James,</p>
          <p style="color:#374151;font-size:14px;margin:0 0 14px">Great news — your booking has been <strong>confirmed</strong>! We look forward to seeing you.</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:0 0 14px">
            <p style="margin:0 0 6px;font-size:12px;font-weight:bold;color:#166534;text-transform:uppercase">Booking Details</p>
            <p style="margin:3px 0;font-size:14px;color:#111827"><strong>Service:</strong> Full Valet</p>
            <p style="margin:3px 0;font-size:14px;color:#111827"><strong>Date:</strong> 15 June 2026</p>
            <p style="margin:3px 0;font-size:14px;color:#111827"><strong>Time:</strong> 09:00</p>
          </div>
          <p style="color:#374151;font-size:13px">If you need to make any changes, please call us on <strong>+44 7700 000000</strong>.</p>
        </div>
      </div>
    `,
  },
  {
    id: "car_ready",
    label: "Car Ready (to customer)",
    description: "Sent to the customer when you mark their booking as done.",
    subject: "Your Car is Ready! 🚗✨ — Smart Shine",
    preview: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:linear-gradient(135deg,#166534,#15803d);padding:20px 28px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">Your Car is Ready! 🚗✨</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Smart Shine Car Valeting Centre</p>
        </div>
        <div style="padding:20px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="color:#374151;font-size:14px;margin:0 0 12px">Hi James,</p>
          <p style="color:#374151;font-size:14px;margin:0 0 14px">Your <strong>Full Valet</strong> on <strong>15 June 2026</strong> has been completed. Your vehicle is ready to collect!</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:0 0 14px;text-align:center">
            <p style="margin:0;font-size:16px;font-weight:bold;color:#166534">Your car is ready for collection ✓</p>
          </div>
          <p style="color:#374151;font-size:13px">Thank you for choosing Smart Shine Car Valeting Centre!</p>
        </div>
      </div>
    `,
  },
  {
    id: "new_contact",
    label: "New Contact Message (to admin)",
    description: "Sent to the notification email when someone submits the contact form.",
    subject: "New message from [Name] — Smart Shine",
    preview: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:20px 28px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">New Contact Message</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Smart Shine Car Valeting Centre</p>
        </div>
        <div style="padding:20px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;width:80px;border-bottom:1px solid #e5e7eb">Name</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#111827">Sophie Clarke</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;border-bottom:1px solid #e5e7eb">Email</td><td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;color:#2563eb">sophie@example.com</td></tr>
            <tr><td style="padding:8px 10px;background:#f9fafb;font-weight:bold;color:#374151;vertical-align:top">Message</td><td style="padding:8px 10px;color:#111827">Hi, I'd like to book a full detail for my car. Could you let me know your availability?</td></tr>
          </table>
          <div style="margin-top:14px;padding:10px;background:#eff6ff;border-radius:6px;font-size:12px;color:#1d4ed8">
            Reply to this email to respond directly to Sophie.
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "welcome_customer",
    label: "Welcome + Account Created (to customer)",
    description: "Sent to first-time customers when their booking is confirmed — includes portal login credentials.",
    subject: "Your Booking is Confirmed ✓ + Account Created — Smart Shine",
    preview: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff">
        <div style="background:linear-gradient(135deg,#0a0f2e,#1a2a6c);padding:20px 28px;border-radius:8px 8px 0 0">
          <h2 style="color:#fff;margin:0;font-size:20px">Your Booking is Confirmed ✓</h2>
          <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px">Smart Shine Car Valeting Centre</p>
        </div>
        <div style="padding:20px 28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="color:#374151;font-size:14px;margin:0 0 12px">Hi Emma,</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:14px;margin:0 0 12px">
            <p style="margin:3px 0;font-size:13px;color:#111827"><strong>Service:</strong> Exterior Wash & Wax</p>
            <p style="margin:3px 0;font-size:13px;color:#111827"><strong>Date:</strong> 15 June 2026 at 13:00</p>
          </div>
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin:0 0 12px">
            <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:#1d4ed8;text-transform:uppercase">🔑 Your Customer Portal Account</p>
            <p style="margin:0 0 8px;color:#374151;font-size:13px">Track your bookings and see when your car is ready.</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              <tr><td style="padding:6px 8px;background:#fff;font-weight:bold;color:#374151;border:1px solid #dbeafe">Email</td><td style="padding:6px 8px;background:#fff;color:#111827;border:1px solid #dbeafe">emma@example.com</td></tr>
              <tr><td style="padding:6px 8px;background:#fff;font-weight:bold;color:#374151;border:1px solid #dbeafe;border-top:none">Password</td><td style="padding:6px 8px;background:#fff;color:#111827;font-family:monospace;border:1px solid #dbeafe;border-top:none"><strong>Xk7mN2qR</strong></td></tr>
            </table>
          </div>
        </div>
      </div>
    `,
  },
];

function EmailTemplateCard({ tpl }: { tpl: typeof EMAIL_TEMPLATES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="flex items-start gap-3 min-w-0">
          <Mail className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{tpl.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{tpl.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block">Preview</span>
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-border">
          <div className="px-4 py-3 bg-muted/30">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Subject:</span> {tpl.subject}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-900">
            <div
              className="rounded border border-border overflow-hidden"
              dangerouslySetInnerHTML={{ __html: tpl.preview }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateSettings = useUpdateSettings();

  const [form, setForm] = useState({
    businessName: "",
    address: "",
    phone: "",
    email: "",
    openTime: "08:00",
    closeTime: "19:00",
    slotDuration: 30,
    workingDays: ALL_DAYS as string[],
    notificationEmail: "",
    logoUrl: "",
    faviconUrl: "",
    brevoApiKey: "",
    senderEmail: "",
    senderName: "",
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioFromNumber: "",
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: true,
    phoneValidationEnabled: true,
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showTwilioToken, setShowTwilioToken] = useState(false);

  useEffect(() => {
    if (settings) {
      const s = settings as Record<string, unknown>;
      setForm({
        businessName: (s.businessName as string) ?? "",
        address: (s.address as string) ?? "",
        phone: (s.phone as string) ?? "",
        email: (s.email as string) ?? "",
        openTime: (s.openTime as string) ?? "08:00",
        closeTime: (s.closeTime as string) ?? "19:00",
        slotDuration: (s.slotDuration as number) ?? 30,
        workingDays: (s.workingDays as string[]) ?? ALL_DAYS,
        notificationEmail: (s.notificationEmail as string) ?? "",
        logoUrl: (s.logoUrl as string) ?? "",
        faviconUrl: (s.faviconUrl as string) ?? "",
        brevoApiKey: (s.brevoApiKey as string) ?? "",
        senderEmail: (s.senderEmail as string) ?? "",
        senderName: (s.senderName as string) ?? "",
        twilioAccountSid: (s.twilioAccountSid as string) ?? "",
        twilioAuthToken: (s.twilioAuthToken as string) ?? "",
        twilioFromNumber: (s.twilioFromNumber as string) ?? "",
        emailNotificationsEnabled: (s.emailNotificationsEnabled as boolean) ?? true,
        smsNotificationsEnabled: (s.smsNotificationsEnabled as boolean) ?? true,
        phoneValidationEnabled: (s.phoneValidationEnabled as boolean) ?? true,
      });
    }
  }, [settings]);

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      workingDays: f.workingDays.includes(day)
        ? f.workingDays.filter(d => d !== day)
        : [...f.workingDays, day],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({ data: form as unknown as BusinessSettings }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast.success("Settings saved.");
      },
      onError: () => toast.error("Save failed."),
    });
  };

  const brevoConfigured = !!(form.brevoApiKey || (settings as Record<string, unknown>)?.brevoApiKey);
  const twilioConfigured = !!(form.twilioAccountSid && form.twilioAuthToken && form.twilioFromNumber);

  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [testingSms, setTestingSms] = useState(false);
  const [testSmsResult, setTestSmsResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleTestSms = async () => {
    setTestingSms(true);
    setTestSmsResult(null);
    try {
      const res = await fetch("/api/settings/test-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twilioAccountSid: form.twilioAccountSid,
          twilioAuthToken: form.twilioAuthToken,
          twilioFromNumber: form.twilioFromNumber,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTestSmsResult({ ok: true, message: `SMS sent to ${data.sentTo}` });
        toast.success("Test SMS sent successfully!");
      } else {
        setTestSmsResult({ ok: false, message: data.error || "Failed" });
        toast.error("Test SMS failed — see details below");
      }
    } catch {
      setTestSmsResult({ ok: false, message: "Network error — server did not respond" });
    } finally {
      setTestingSms(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/settings/test-email", { method: "POST", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data.ok) {
        setTestResult({ ok: true, message: `Email dërguar te ${data.sentTo}` });
        toast.success("Email test u dërgua me sukses!");
      } else {
        setTestResult({ ok: false, message: data.error || "Dështoi" });
        toast.error("Email test dështoi — shih detajet poshtë");
      }
    } catch {
      setTestResult({ ok: false, message: "Network error — serveri nuk u përgjigj" });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your business information, hours and email notifications.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Branding */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold text-card-foreground">Branding</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo</label>
                  <ImageUpload
                    value={form.logoUrl}
                    onChange={url => setForm(f => ({ ...f, logoUrl: url }))}
                    label="Upload Logo"
                    previewClassName="h-20 object-contain"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Favicon</label>
                  <ImageUpload
                    value={form.faviconUrl}
                    onChange={url => setForm(f => ({ ...f, faviconUrl: url }))}
                    label="Upload Favicon"
                    previewClassName="h-12 w-12 object-contain"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Recommended: 32×32 or 64×64 PNG/ICO</p>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-card-foreground">Business Information</h2>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                <Input data-testid="input-business-name" value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Address</label>
                <Input data-testid="input-business-address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input data-testid="input-business-phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Contact Email</label>
                  <Input data-testid="input-business-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-card-foreground">Working Hours & Slots</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Opening Time</label>
                  <Input data-testid="input-open-time" type="time" value={form.openTime} onChange={e => setForm(f => ({ ...f, openTime: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Closing Time</label>
                  <Input data-testid="input-close-time" type="time" value={form.closeTime} onChange={e => setForm(f => ({ ...f, closeTime: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Slot Duration (minutes)</label>
                <Input
                  data-testid="input-slot-duration"
                  type="number"
                  min={15}
                  step={15}
                  max={120}
                  value={form.slotDuration}
                  onChange={e => setForm(f => ({ ...f, slotDuration: parseInt(e.target.value) || 30 }))}
                  className="max-w-[150px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-3 block">Working Days</label>
                <div className="flex gap-2 flex-wrap">
                  {ALL_DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        form.workingDays.includes(day)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Options */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold text-card-foreground">Booking Options</h2>
              <div className="flex items-center justify-between py-1 px-4 rounded-xl bg-muted/40 border border-border">
                <div>
                  <p className="text-sm font-medium">UK phone number validation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Require a valid UK number on the booking form (e.g. 07700 900 123 or +44 7700 900123)</p>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <span className={`text-xs font-semibold ${form.phoneValidationEnabled ? "text-green-600 dark:text-green-400" : "text-zinc-400"}`}>
                    {form.phoneValidationEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    id="phoneValidationEnabled"
                    checked={form.phoneValidationEnabled}
                    onCheckedChange={v => setForm(f => ({ ...f, phoneValidationEnabled: Boolean(v) }))}
                  />
                </div>
              </div>
            </div>

            {/* Email Configuration */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-card-foreground">Email Configuration</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Powered by Brevo (Sendinblue)</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${brevoConfigured ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                  {brevoConfigured
                    ? <><CheckCircle className="h-3 w-3" /> Connected</>
                    : <><AlertCircle className="h-3 w-3" /> Not configured</>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between py-1 px-4 rounded-xl bg-muted/40 border border-border">
                <label htmlFor="emailNotificationsEnabled" className="text-sm font-medium cursor-pointer select-none">
                  Email notifications
                </label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${form.emailNotificationsEnabled ? "text-green-600 dark:text-green-400" : "text-zinc-400"}`}>
                    {form.emailNotificationsEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    id="emailNotificationsEnabled"
                    checked={form.emailNotificationsEnabled}
                    onCheckedChange={v => setForm(f => ({ ...f, emailNotificationsEnabled: Boolean(v) }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Notification Email</label>
                <Input
                  type="email"
                  placeholder="admin@yourbusiness.com"
                  value={form.notificationEmail}
                  onChange={e => setForm(f => ({ ...f, notificationEmail: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1.5">New bookings and contact messages will be sent here.</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Brevo API Key</label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="xkeysib-..."
                    value={form.brevoApiKey}
                    onChange={e => setForm(f => ({ ...f, brevoApiKey: e.target.value }))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Get your API key from{" "}
                  <a href="https://app.brevo.com/settings/keys/api" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                    app.brevo.com → Settings → API Keys
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sender Name</label>
                  <Input
                    placeholder="Smart Shine Car Valeting"
                    value={form.senderName}
                    onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sender Email</label>
                  <Input
                    type="email"
                    placeholder="noreply@smartshine.co.uk"
                    value={form.senderEmail}
                    onChange={e => setForm(f => ({ ...f, senderEmail: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Must be a verified sender in Brevo.</p>
                </div>
              </div>

              {/* Test Email */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleTestEmail}
                    disabled={testingEmail || !brevoConfigured}
                  >
                    {testingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {testingEmail ? "Duke dërguar..." : "Test Email"}
                  </Button>
                  <p className="text-xs text-muted-foreground">Dërgon email test tek Notification Email-i yt.</p>
                </div>
                {testResult && (
                  <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${testResult.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {testResult.ok
                      ? <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                      : <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
                    }
                    <span className="font-medium">{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SMS / Twilio Configuration */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-card-foreground">SMS Notifications</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Powered by Twilio — sends SMS to customers on booking events</p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${twilioConfigured ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                  {twilioConfigured
                    ? <><CheckCircle className="h-3 w-3" /> Connected</>
                    : <><AlertCircle className="h-3 w-3" /> Not configured</>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between py-1 px-4 rounded-xl bg-muted/40 border border-border">
                <label htmlFor="smsNotificationsEnabled" className="text-sm font-medium cursor-pointer select-none">
                  SMS notifications
                </label>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${form.smsNotificationsEnabled ? "text-green-600 dark:text-green-400" : "text-zinc-400"}`}>
                    {form.smsNotificationsEnabled ? "ON" : "OFF"}
                  </span>
                  <Switch
                    id="smsNotificationsEnabled"
                    checked={form.smsNotificationsEnabled}
                    onCheckedChange={v => setForm(f => ({ ...f, smsNotificationsEnabled: Boolean(v) }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Account SID</label>
                <Input
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={form.twilioAccountSid}
                  onChange={e => setForm(f => ({ ...f, twilioAccountSid: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Found in your{" "}
                  <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                    Twilio Console
                  </a>{" "}
                  dashboard.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Auth Token</label>
                <div className="relative">
                  <Input
                    type={showTwilioToken ? "text" : "password"}
                    placeholder="Your Twilio Auth Token"
                    value={form.twilioAuthToken}
                    onChange={e => setForm(f => ({ ...f, twilioAuthToken: e.target.value }))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTwilioToken(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showTwilioToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">From Number / Sender</label>
                <Input
                  placeholder="+447700900000 or MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={form.twilioFromNumber}
                  onChange={e => setForm(f => ({ ...f, twilioFromNumber: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Must be a <strong>Twilio phone number you own</strong> — not your personal number.{" "}
                  <a href="https://console.twilio.com/us1/develop/phone-numbers/manage/incoming" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Buy a UK number (+44…)</a>{" "}
                  from the Twilio Console, then paste it here in E.164 format. Alternatively, enter a Messaging Service SID (starts with <code className="bg-muted px-1 rounded text-[11px]">MG</code>).
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleTestSms}
                    disabled={testingSms || !twilioConfigured}
                  >
                    {testingSms ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
                    {testingSms ? "Duke dërguar..." : "Test SMS"}
                  </Button>
                  <p className="text-xs text-muted-foreground">Dërgon SMS test tek numri i biznesit tënd.</p>
                </div>
                {testSmsResult && (
                  <div className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-sm ${testSmsResult.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                    {testSmsResult.ok
                      ? <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
                      : <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-600" />
                    }
                    <span className="font-medium">{testSmsResult.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email Template Previews */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <div>
                <h2 className="font-semibold text-card-foreground">Email Templates</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Preview the emails that are automatically sent to you and your customers.</p>
              </div>
              <div className="space-y-2">
                {EMAIL_TEMPLATES.map(tpl => (
                  <EmailTemplateCard key={tpl.id} tpl={tpl} />
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={updateSettings.isPending} data-testid="button-save-settings">
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
