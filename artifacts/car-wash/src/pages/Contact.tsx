import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { useGetSettings } from "@workspace/api-client-react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Zap,
  Star,
  Send,
  ChevronDown,
  Facebook,
  Twitter,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Link } from "wouter";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: direction === "up" ? 30 : 0,
        x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const { data: settings } = useGetSettings();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const hours = settings
    ? `${settings.openTime} – ${settings.closeTime}`
    : "08:00 – 19:00";
  const days = settings?.workingDays?.join(", ") ?? "Mon – Sun";

  const contactServices = [
    "Mini Valet — from £45",
    "Economy Valet — from £120",
    "Premier Valet — from £169",
    "Interior Valet — from £120",
    "Exterior Valet — from £139",
    "Commercial Vehicle",
    "Car Detailing",
    "Machine Polish",
    "Other / Not sure",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  };

  const infoCards = [
    {
      icon: MapPin,
      label: "Our Location",
      value: settings?.address ?? "Guildford, Surrey",
      sub: "Also serving Godalming & Woking",
    },
    {
      icon: Phone,
      label: "Call Us",
      value: "07717 310 046",
      sub: "01483 236 060",
      href: "tel:07717310046",
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email ?? "nazsalihi@me.com",
      sub: "We reply within 24 hours",
      href: `mailto:${settings?.email ?? "nazsalihi@me.com"}`,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: hours,
      sub: days,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden pt-28 pb-16 text-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)",
          }}
        />
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />
        <FadeIn className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 rounded-full px-4 py-1.5 text-sm font-bold mb-4 border border-white/10">
            <Phone className="h-4 w-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-white/70 text-[15px] max-w-2xl mx-auto leading-relaxed">
            Have a question or want to book a service? We're here to help. Reach
            out and we'll get back to you as soon as possible.
          </p>
        </FadeIn>
      </section>

      {/* 2. INFO CARDS */}
      <section className="relative pb-16 px-6 pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {infoCards.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.55,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-11 w-11 rounded-xl bg-[#0a0f2e] flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="font-black text-[#0a0f2e] hover:text-blue-700 transition-colors block text-[15px]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="font-black text-[#0a0f2e] text-[15px]">
                    {item.value}
                  </p>
                )}
                <p className="text-[12px] text-gray-400 mt-0.5">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM + MAP */}
      <section className="py-20 bg-white px-6">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Send className="h-4 w-4" />
              Free Quote
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
              Send us a message
            </h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
              Tell us about your vehicle and we'll get back to you with a
              personalised quote.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* Left info */}
            <FadeIn direction="left" className="lg:col-span-2 space-y-5">
              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-56">
                <iframe
                  title="Smart Shine Car Valeting Centre — Guildford"
                  src="https://www.google.com/maps?q=Smart+Shine+Car+Valeting+Centre+Guildford+Surrey&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.google.com/?q=Smart+Shine+Car+Valeting+Centre+Guildford+Surrey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:underline font-bold"
              >
                <MapPin className="h-4 w-4" /> Open in Google Maps →
              </a>

              {/* Why us */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    icon: Shield,
                    title: "Satisfaction Guaranteed",
                    desc: "100% happy or we redo it for free.",
                  },
                  {
                    icon: Zap,
                    title: "Quick Response",
                    desc: "We reply within 24 hours to all enquiries.",
                  },
                  {
                    icon: Star,
                    title: "5-Star Service",
                    desc: "Consistently top-rated by our customers.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 items-start bg-gray-50 rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-black text-[#0a0f2e] text-[13px] mb-0.5">
                        {title}
                      </p>
                      <p className="text-gray-400 text-[12px]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Form */}
            <FadeIn direction="right" delay={0.1} className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Send className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0a0f2e] mb-2">
                    Message sent!
                  </h3>
                  <p className="text-gray-500 text-[15px]">
                    We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                        Phone
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="07700 000 000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Service Required
                    </label>
                    <button
                      type="button"
                      onClick={() => setServiceOpen((o) => !o)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all flex items-center justify-between"
                    >
                      <span
                        className={
                          form.service ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {form.service || "Select a service..."}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        {contactServices.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setForm((f) => ({ ...f, service: s }));
                              setServiceOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-blue-50 hover:text-blue-700 transition-colors ${form.service === s ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      placeholder="Tell us about your vehicle and what you need..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0f2e] hover:bg-blue-900 px-8 py-4 text-[15px] font-black text-white transition-all duration-150 disabled:opacity-60"
                  >
                    {sending ? (
                      "Sending…"
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-gray-900 pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img
                src={logoSrc}
                alt="Smart Shine"
                className="h-40 mb-1 brightness-0 invert opacity-90"
              />
              <p className="text-sm text-gray-400 leading-relaxed">
                Professional car valeting services with over 25 years of
                experience. Serving Guildford, Godalming, Woking and surrounding
                areas.
              </p>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">
                Quick Links
              </h4>
              <div className="space-y-2.5">
                {[
                  {
                    href: "/private-valeting",
                    label: "Private Vehicle Valeting",
                  },
                  {
                    href: "/car-vehicle-detailing-service",
                    label: "Car Detailing Service",
                  },
                  {
                    href: "/commercial-valeting",
                    label: "Commercial Valeting",
                  },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/booking", label: "Book Now" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">
                Contact Us
              </h4>
              <div className="space-y-3 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-white flex-shrink-0" />
                  <span>Guildford, Surrey</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-white flex-shrink-0" />
                  <span>07717 310 046 / 01483 236 060</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-white flex-shrink-0" />
                  <span>Mon–Sun: 08:00 – 19:00</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-white flex-shrink-0" />
                  <a
                    href="mailto:nazsalihi@me.com"
                    className="hover:text-white transition-colors"
                  >
                    nazsalihi@me.com
                  </a>
                </div>
              </div>
              <a
                href="https://www.yell.com/biz/smart-shine-valeting-centre-guildford-4715572/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mt-4 group"
              >
                <img
                  src="/yell-icon.png"
                  alt="Yell"
                  className="h-8 w-8 rounded"
                />
                <span className="text-gray-400 text-sm font-semibold group-hover:text-white transition-colors">
                  Find us on Yell
                </span>
              </a>
            </div>
          </div>

          {/* 5. FOLLOW US */}
          <div className="border-t border-white/10 pt-8 pb-4 text-center">
            <p className="text-white font-bold text-[15px] mb-5">Follow us</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter / X", href: "#" },
                { icon: Shield, label: "Checkatrade", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                  className="h-11 w-11 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
              <Link
                href="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Use
              </Link>
              <span>|</span>
              <Link
                href="/privacy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy &amp; Cookie Policy
              </Link>
              <span>|</span>
              <Link
                href="/trading"
                className="hover:text-gray-300 transition-colors"
              >
                Trading Terms
              </Link>
            </div>
            <p className="text-xs text-gray-600">
              © 2026. The content on this website is owned by us and our
              licensors. Do not copy any content (including images) without our
              consent.
            </p>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
