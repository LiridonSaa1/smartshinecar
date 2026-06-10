import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6"
        >
          <div className="mx-auto max-w-4xl bg-[#0a0f2e] border border-white/10 rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie className="h-5 w-5 text-white" />
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                  Learn more
                </a>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={decline}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-semibold transition-all duration-150"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold transition-all duration-150 shadow-lg shadow-blue-500/30"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
