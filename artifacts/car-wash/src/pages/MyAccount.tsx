import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useCustomerAuth } from "@/lib/customerAuth";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

export default function MyAccount() {
  const { customer, loading, login } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && customer) navigate("/my-account/dashboard");
  }, [loading, customer, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate("/my-account/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060b1e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #060b1e 0%, #0d1a3a 100%)" }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img src={logoSrc} alt="Smart Shine Car Valeting Centre" className="h-28 w-auto brightness-0 invert" />
          </div>
          <h1 className="text-2xl font-black text-white">My Account</h1>
          <p className="text-gray-400 mt-1 text-sm">Track your bookings &amp; car status</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-black py-3 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Your login details are sent to you when your booking is confirmed.<br />
            Need help? Call <a href="tel:07717310046" className="text-blue-400 hover:text-blue-300">07717 310 046</a>
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">← Back to Smart Shine</a>
        </div>
      </motion.div>
    </div>
  );
}
