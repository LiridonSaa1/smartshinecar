import { Link, useLocation } from "wouter";
import { Droplets, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-gray-200/60 dark:border-white/10 shadow-sm"
            : "bg-white/60 dark:bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
        )}
      >
        <div className="mx-auto max-w-6xl flex h-[52px] items-center justify-between px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-600 shadow-sm shadow-blue-500/30 transition-transform group-hover:scale-105">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-gray-900 dark:text-white">
              Car Wash Pro
            </span>
          </Link>

          {/* Desktop Nav — centred */}
          <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[14px] transition-all duration-150",
                  location === link.href
                    ? "text-gray-900 dark:text-white font-medium bg-black/5 dark:bg-white/10"
                    : "text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Book Now pill */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/booking">
              <button className="inline-flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-4 py-1.5 text-[13px] font-medium text-white transition-all duration-150 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30">
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5 text-gray-700 dark:text-white" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-white" />}
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
            className="fixed inset-0 top-[52px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-2xl backdrop-saturate-150 flex flex-col px-6 pt-8 pb-12"
          >
            <nav className="flex flex-col gap-1 mb-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3.5 rounded-2xl text-[17px] font-medium transition-colors",
                    location === link.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/booking" onClick={() => setMobileOpen(false)}>
              <button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3.5 text-[16px] font-semibold text-white transition-colors shadow-md shadow-blue-500/25">
                Book Now
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
