import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/private-valeting", label: "Private Vehicle Valeting" },
  { href: "/car-vehicle-detailing-service", label: "Car Detailing" },
  { href: "/commercial-valeting", label: "Commercial Valeting" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
          scrolled
            ? "bg-black/30 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        )}
      >
        {/* Single row desktop nav */}
        <div className="mx-auto max-w-7xl px-6 hidden md:flex items-center h-20 gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src={logoSrc}
              alt="Smart Shine Car Valeting Centre"
              className="h-36 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Nav links — fill remaining space */}
          <nav className="flex-1 flex items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-[13px] font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full",
                  location === link.href
                    ? "text-white bg-white/15"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* My Account */}
          <Link href="/my-account" className="flex-shrink-0">
            <button className="inline-flex items-center justify-center rounded-full border border-white/30 hover:bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-150">
              My Account
            </button>
          </Link>

          {/* Book Now */}
          <Link href="/booking" className="flex-shrink-0">
            <button className="inline-flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-400 active:bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-150 shadow-lg shadow-blue-500/30">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center justify-between px-5 h-16">
          <Link href="/">
            <img src={logoSrc} alt="Smart Shine" className="h-20 w-auto brightness-0 invert" />
          </Link>
          <button
            className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/15 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 top-16 z-40 bg-[#0a0f2e]/98 backdrop-blur-xl flex flex-col px-6 pt-8 pb-12"
          >
            <nav className="flex flex-col gap-1 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-2xl text-[16px] font-semibold transition-colors",
                    location === link.href
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/my-account" onClick={() => setMobileOpen(false)}>
              <button className="w-full rounded-2xl border border-white/30 hover:bg-white/10 py-3.5 text-[16px] font-bold text-white transition-colors mb-3">
                My Account
              </button>
            </Link>
            <Link href="/booking" onClick={() => setMobileOpen(false)}>
              <button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-[16px] font-bold text-white transition-colors">
                Book Now
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
