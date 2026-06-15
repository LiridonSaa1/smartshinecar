import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FileText, Loader2, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { useCustomerAuth } from "@/lib/customerAuth";
import { CustomerLayout } from "@/components/layout/CustomerLayout";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = BASE ? `${BASE}/api` : "/api";

export default function CustomerQuote() {
  const { customer, loading: authLoading } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!authLoading && !customer) navigate("/my-account");
  }, [authLoading, customer, navigate]);

  const handleSend = async () => {
    if (!description.trim()) { setError("Please describe what you need a quote for."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customer?.name ?? "",
          email: customer?.email ?? "",
          phone: phone.trim() || undefined,
          message: description.trim(),
          source: "quote",
        }),
      });
      if (!res.ok) throw new Error("Failed to send quote request");
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to send quote request");
    } finally { setSaving(false); }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <CustomerLayout>
      <div className="space-y-6 max-w-xl">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Request a Quote</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tell us about your vehicle and requirements — we'll reply within 24 hours
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-10 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="font-black text-gray-900 text-xl">Quote Request Sent!</p>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto">
              We'll review your request and reply to <strong>{customer?.email}</strong> within 24 hours.
            </p>
            <button
              onClick={() => { setSent(false); setDescription(""); setPhone(""); }}
              className="mt-6 rounded-xl bg-gray-100 hover:bg-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 transition"
            >
              Send another request
            </button>
          </motion.div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground text-sm">Custom Quote Request</p>
                <p className="text-xs text-muted-foreground">From: {customer?.name} ({customer?.email})</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Request</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. I have a 2020 BMW X5 with leather interior. I'd like a full valet including engine bay clean and paint correction. What would this cost and how long would it take?"
                rows={6}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-emerald-400 transition"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Include your vehicle make, model, year, and the services you're interested in.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone number <span className="font-normal text-muted-foreground">(optional)</span>
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

            <button
              onClick={handleSend}
              disabled={saving || !description.trim()}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? "Sending…" : "Send Quote Request"}
            </button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
