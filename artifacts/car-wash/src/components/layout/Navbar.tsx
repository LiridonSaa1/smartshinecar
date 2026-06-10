import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const topLinks = [
  { href: "/", label: "Home" },
  { href: "/private-valeting", label: "Private Vehicle Valeting Service" },
  { href: "/car-detailing", label: "Car Vehicle Detailing Service" },
];

const bottomLinks = [
  { href: "/commercial-valeting", label: "Commercial Vehicle Valeting Service" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const allLinks = [...topLinks, ...bottomLinks];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0a0f2e] border-b border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-3 hidden md:block">
          {/* Top row */}
          <nav className="flex items-center justify-center gap-1 mb-1">
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1 text-[14px] transition-colors",
                  location === link.href
                    ? "text-white font-semibold"
                    : "text-white/75 hover:text-white font-normal"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom row */}
          <nav className="flex items-center justify-center gap-1">
            {bottomLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1 text-[14px] transition-colors",
                  location === link.href
                    ? "text-white font-semibold"
                    : "text-white/75 hover:text-white font-normal"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 h-14">
          <span className="text-white font-semibold text-[15px]">Car Wash Pro</span>
          <button
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 top-14 z-40 bg-[#0a0f2e]/98 backdrop-blur-xl flex flex-col px-6 pt-8 pb-12"
          >
            <nav className="flex flex-col gap-1">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-2xl text-[16px] font-medium transition-colors",
                    location === link.href
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
