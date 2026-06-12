import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Link } from "wouter";
import {
  Phone, MapPin, Clock, Mail,
  ChevronLeft, ChevronRight, ChevronDown,
  Facebook, Twitter, Shield, Send, Sparkles, Images, Car,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useContentSection } from "@/lib/useContent";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

type GalleryCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  image: string;
  service: string;
};

/* ── Resolve gallery image URLs with correct base path ───────────── */
const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
function resolveUrl(url: string): string {
  if (url && url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/api")) {
    return `${BASE}${url}`;
  }
  return url;
}

/* ── FadeIn helper ────────────────────────────────────────────────── */
function FadeIn({ children, className, delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: direction === "up" ? 30 : 0, x: direction === "left" ? -40 : direction === "right" ? 40 : 0 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Hero Carousel ────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
    headline: "Paint Restoration\nSpecialists in Guildford",
    sub: "From scratch removal to full paint correction — see our exceptional work in our gallery below.",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=85",
    headline: "Interior & Exterior\nValeting Gallery",
    sub: "Explore our before-and-after transformations across all vehicle types and valeting services.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85",
    headline: "Serving Guildford,\nGodalming & Woking",
    sub: "Customers from across Surrey trust Smart Shine to restore and protect their vehicles.",
  },
];

function HeroCarousel({ slides = HERO_SLIDES }: { slides?: typeof HERO_SLIDES }) {
  const [[index, dir], setSlide] = useState([0, 0]);
  const slide = slides[index] ?? slides[0];
  const go = useCallback((nextIdx: number, direction: number) => setSlide([nextIdx, direction]), []);
  const prev = () => go((index - 1 + slides.length) % slides.length, -1);
  const next = useCallback(() => go((index + 1) % slides.length, 1), [index, go, slides.length]);
  useEffect(() => { const t = setTimeout(next, 6000); return () => clearTimeout(t); }, [next]);

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden select-none">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img src={resolveUrl(slide.image)} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6">
              <Images className="h-3.5 w-3.5" />
              Our Work Gallery
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5 whitespace-pre-line">
              {slide.headline}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed mb-8">{slide.sub}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#gallery">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  View Gallery <Images className="h-4 w-4" />
                </motion.button>
              </a>
              <a href="#contact">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-black text-white hover:bg-white/20 transition-all"
                >
                  <Phone className="h-4 w-4" /> Get Free Quote
                </motion.button>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => next()} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all">
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            className={`transition-all duration-300 rounded-full ${i === index ? "bg-white w-7 h-2" : "bg-white/40 w-2 h-2 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Brand data ───────────────────────────────────────────────────── */
const BRANDS = [
  {
    id: "bmw",
    name: "BMW",
    emoji: "🇩🇪",
    images: [
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=85", caption: "BMW M3 — Full Exterior Detail" },
      { url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&q=85", caption: "BMW 5 Series — Paint Correction" },
      { url: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=900&q=85", caption: "BMW X5 — Interior Deep Clean" },
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes",
    emoji: "⭐",
    images: [
      { url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=85", caption: "Mercedes C-Class — Executive Valet" },
      { url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&q=85", caption: "Mercedes GLE — Full Valet" },
      { url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=85", caption: "Mercedes AMG — Paint Restoration" },
    ],
  },
  {
    id: "ferrari",
    name: "Ferrari",
    emoji: "🐎",
    images: [
      { url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&q=85", caption: "Ferrari — Full Ceramic Coat" },
      { url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=85", caption: "Ferrari — Paint Correction & Polish" },
      { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=85", caption: "Ferrari — Luxury Detail Package" },
    ],
  },
  {
    id: "toyota",
    name: "Toyota",
    emoji: "🚗",
    images: [
      { url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&q=85", caption: "Toyota GR Supra — Full Valet" },
      { url: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=900&q=85", caption: "Toyota Land Cruiser — Exterior Wash" },
      { url: "https://images.unsplash.com/photo-1571987502951-3b2e9085b809?w=900&q=85", caption: "Toyota — Interior Detail" },
    ],
  },
  {
    id: "golf",
    name: "VW Golf",
    emoji: "🏎️",
    images: [
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85", caption: "VW Golf GTI — Machine Polish" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=85", caption: "VW Golf R — Full Exterior Detail" },
      { url: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=900&q=85", caption: "VW Golf — Mini Valet" },
    ],
  },
  {
    id: "audi",
    name: "Audi",
    emoji: "⚪",
    images: [
      { url: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=900&q=85", caption: "Audi RS6 — Executive Valet" },
      { url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&q=85", caption: "Audi Q7 — Full Interior & Exterior" },
      { url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=85", caption: "Audi A4 — Paint Correction" },
    ],
  },
  {
    id: "landrover",
    name: "Land Rover",
    emoji: "🏔️",
    images: [
      { url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&q=85", caption: "Range Rover — Full Valet" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85", caption: "Defender — Mud & Grime Removal" },
      { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=85", caption: "Discovery — Executive Detail" },
    ],
  },
  {
    id: "porsche",
    name: "Porsche",
    emoji: "🏁",
    images: [
      { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=85", caption: "Porsche 911 — Full Detail" },
      { url: "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861?w=900&q=85", caption: "Porsche Cayenne — Full Valet" },
      { url: "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=900&q=85", caption: "Porsche Macan — Interior Clean" },
    ],
  },
];

/* ── Brand Gallery Slider ─────────────────────────────────────────── */
function BrandSlider({ brand }: { brand: typeof BRANDS[0] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + brand.images.length) % brand.images.length);
  const next = () => setIdx(i => (i + 1) % brand.images.length);
  const img = brand.images[idx];

  return (
    <motion.div
      key={brand.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 aspect-[16/9] bg-gray-900"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={img.url}
          src={resolveUrl(img.url)}
          alt={img.caption}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Caption */}
      <div className="absolute bottom-5 left-6 right-16">
        <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/40 text-blue-200 rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase mb-2">
          <Sparkles className="h-3 w-3" />
          Smart Shine — Guildford
        </div>
        <p className="text-white font-black text-lg leading-snug">{img.caption}</p>
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all">
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {brand.images.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i === idx ? "bg-white w-5 h-1.5" : "bg-white/40 w-1.5 h-1.5"}`} />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Contact Form ─────────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const services = [
    "Mini Valet", "Full Valet", "Executive Valet",
    "Paint Correction", "Engine Bay Clean", "Headlight Restoration", "Other / Not sure",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "gallery" }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      alert("Sorry, there was a problem sending your message. Please call us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
            <Phone className="h-6 w-6 text-blue-300" />
          </div>
          <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">Get in touch today</p>
          <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8">
            Call Smart Shine Car Valeting Centre to book your valet in Guildford
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { number: "07717 310 046", href: "tel:07717310046" },
              { number: "01483 236 060", href: "tel:01483236060" },
            ].map(({ number, href }, i) => (
              <motion.a
                key={number} href={href}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-white transition-all hover:bg-white/20 hover:border-blue-400/50"
              >
                <Phone className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <span className="text-[22px] md:text-[26px] font-black tracking-wide">{number}</span>
              </motion.a>
            ))}
          </div>
          <p className="mt-8 text-white/40 text-[13px]">Mon – Sun &nbsp;·&nbsp; 08:00 – 19:00</p>
        </FadeIn>
      </section>

      <section id="contact" className="relative py-20 bg-gray-50">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(ellipse at 80% 20%, #dbeafe 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Send className="h-4 w-4" /> Free Quote
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">Send us a message</h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">Tell us about your vehicle and we'll get back to you with a personalised quote.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <FadeIn direction="left" className="md:col-span-2 space-y-6">
              {[
                { icon: Phone, title: "Call us directly", lines: ["07717 310 046", "01483 236 060"], sub: "Mon – Sun, 08:00 – 19:00" },
                { icon: MapPin, title: "Our location", lines: ["Guildford, Surrey"], sub: "Also serving Godalming & Woking" },
                { icon: Clock, title: "Opening hours", lines: ["Monday – Sunday"], sub: "08:00 – 19:00" },
              ].map(({ icon: Icon, title, lines, sub }) => (
                <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="h-11 w-11 rounded-xl bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#0a0f2e] font-black text-sm mb-1">{title}</p>
                    {lines.map(l => <p key={l} className="text-gray-700 font-semibold text-[15px]">{l}</p>)}
                    <p className="text-gray-400 text-xs mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </FadeIn>

            <FadeIn direction="right" delay={0.1} className="md:col-span-3">
              {sent ? (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                    <span className="text-3xl">✅</span>
                  </div>
                  <p className="text-[#0a0f2e] font-black text-2xl mb-2">Message Sent!</p>
                  <p className="text-gray-500 text-[15px]">We'll be in touch shortly to discuss your valeting needs.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Phone Number *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="07700 000 000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
                  </div>
                  <div className="relative">
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Service Required</label>
                    <button type="button" onClick={() => setServiceOpen(o => !o)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex items-center justify-between">
                      <span className={form.service ? "text-gray-900" : "text-gray-400"}>{form.service || "Select a service…"}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        {services.map(s => (
                          <button key={s} type="button"
                            onClick={() => { setForm(f => ({ ...f, service: s })); setServiceOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${form.service === s ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Your Message *</label>
                    <textarea rows={4} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your vehicle and what you need…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-gray-400 text-xs">* Required fields</p>
                    <button type="submit" disabled={sending}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 active:scale-95 px-8 py-3.5 text-[14px] font-black text-white transition-all duration-150 disabled:opacity-60 shadow-lg">
                      {sending ? "Sending…" : <><Send className="h-4 w-4" /> Send Message</>}
                    </button>
                  </div>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Gallery Car Grid (from database) ────────────────────────────── */
function GalleryCarGrid() {
  const { data: cars, isLoading } = useQuery<GalleryCar[]>({
    queryKey: ["gallery-cars"],
    queryFn: () => fetch("/api/gallery").then(r => r.json()),
    staleTime: 30_000,
  });

  const [selected, setSelected] = useState<GalleryCar | null>(null);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm animate-pulse">
            <Car className="h-4 w-4" /> Loading vehicles…
          </div>
        </div>
      </section>
    );
  }

  if (!cars?.length) return null;

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
            <Car className="h-4 w-4" />
            Our Vehicles
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
            Cars We've Worked On
          </h2>
          <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
            Real vehicles from our Guildford centre — every make and model welcome
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 10) * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelected(car)}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-900 aspect-[4/3] relative"
            >
              <img
                src={resolveUrl(car.image)}
                alt={`${car.make} ${car.model}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm leading-tight">
                  {car.make}
                </p>
                <p className="text-white/80 text-xs font-medium leading-tight">
                  {car.model}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="bg-blue-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {car.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-[#0a0f2e] rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            >
              <img
                src={resolveUrl(selected.image)}
                alt={`${selected.make} ${selected.model}`}
                className="w-full aspect-[16/9] object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{selected.year}</span>
                      <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">{selected.service}</span>
                    </div>
                    <h3 className="text-white font-black text-2xl">{selected.make} {selected.model}</h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Default CMS values ────────────────────────────────────────────── */
const DEFAULT_GALLERY_HERO = HERO_SLIDES;
const DEFAULT_GALLERY_BELOW_HERO = {
  heading: "Paint restoration specialists in Guildford",
  text: "Take a look at some exceptional works done by the experts at Smart Shine Car Valeting Centre. From car scratch removals to paint restoration, we can do it all. Get in touch with us to book an appointment for car valeting in Guildford. We offer both interior and exterior valeting. You can choose between full valet and part valet. Customers from across Guildford, Godalming and Woking are welcomed to our car valeting centre.",
};
const DEFAULT_GALLERY_BRANDS_V2 = { brands: BRANDS };

/* ── Merge DB cars into brand slots ─────────────────────────────────── */
function normalizeName(s: string) {
  return s.toLowerCase()
    .replace(/volkswagen/g, "vw")
    .replace(/vauxhall/g, "vauxhall")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function makeMatchesBrand(carMake: string, brandName: string): boolean {
  const make = normalizeName(carMake);
  const brand = normalizeName(brandName);
  if (make === brand) return true;
  const makeWords = make.split(" ").filter(w => w.length > 1);
  const brandWords = brand.split(" ").filter(w => w.length > 1);
  return makeWords.some(w => brandWords.some(b => b === w || b.includes(w) || w.includes(b)));
}

function mergeCarsIntoBrands(brands: typeof BRANDS, cars: GalleryCar[]): typeof BRANDS {
  return brands.map(brand => {
    const matching = cars.filter(c => makeMatchesBrand(c.make, brand.name));
    if (!matching.length) return brand;
    const realImages = matching.map(c => ({
      url: c.image,
      caption: `${c.make} ${c.model} (${c.year})${c.service ? " — " + c.service : ""}`,
    }));
    return { ...brand, images: [...realImages, ...brand.images] };
  });
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function Gallery() {
  const heroData = useContentSection("gallery_hero", DEFAULT_GALLERY_HERO) as typeof HERO_SLIDES;
  const belowHero = useContentSection("gallery_below_hero", DEFAULT_GALLERY_BELOW_HERO) as typeof DEFAULT_GALLERY_BELOW_HERO;
  const brandsData = useContentSection("gallery_brands_v2", DEFAULT_GALLERY_BRANDS_V2) as typeof DEFAULT_GALLERY_BRANDS_V2;

  const { data: galleryCars } = useQuery<GalleryCar[]>({
    queryKey: ["gallery-cars"],
    queryFn: () => fetch("/api/gallery").then(r => r.json()),
  });

  const rawBrands = (brandsData?.brands?.length ? brandsData.brands : BRANDS) as typeof BRANDS;
  const brands = galleryCars?.length ? mergeCarsIntoBrands(rawBrands, galleryCars) : rawBrands;
  const slides = (Array.isArray(heroData) && heroData.length ? heroData : DEFAULT_GALLERY_HERO) as typeof HERO_SLIDES;

  const [activeBrand, setActiveBrand] = useState<typeof BRANDS[0] | null>(null);
  const currentBrand = activeBrand ?? brands[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel slides={slides} />

      {/* 2. ABOUT TEXT */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-5">
              <Sparkles className="h-4 w-4" />
              Our Work
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-5 leading-tight">
              {belowHero.heading}
            </h2>
            <p className="text-gray-600 text-[16px] leading-relaxed max-w-3xl mx-auto">
              {belowHero.text}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3. CAR GRID FROM DATABASE */}
      <GalleryCarGrid />

      {/* 4. BRAND GALLERY */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Images className="h-4 w-4" />
              A Glimpse of Our Previous Valets
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">Browse by vehicle</h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">Select a brand to see our work on that vehicle type</p>
          </FadeIn>

          {/* Brand selector cards */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {brands.map(brand => (
              <motion.button
                key={brand.id}
                onClick={() => setActiveBrand(brand)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 text-sm font-black transition-all duration-200 ${
                  currentBrand.id === brand.id
                    ? "bg-[#0a0f2e] border-[#0a0f2e] text-white shadow-lg shadow-[#0a0f2e]/20"
                    : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-700"
                }`}
              >
                <span className="text-base">{brand.emoji}</span>
                {brand.name}
              </motion.button>
            ))}
          </div>

          {/* Image slider */}
          <FadeIn>
            <AnimatePresence mode="wait">
              <BrandSlider key={currentBrand.id} brand={currentBrand} />
            </AnimatePresence>
          </FadeIn>

          {/* Thumbnail strip */}
          <div className="flex gap-3 mt-4 justify-center">
            {currentBrand.images.map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl overflow-hidden border-2 border-gray-200 w-28 h-18 cursor-pointer hover:border-blue-400 transition-colors flex-shrink-0"
              >
                <img src={resolveUrl(img.url)} alt={img.caption} className="w-full h-full object-cover" style={{ height: "72px" }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT FORM */}
      <ContactForm />

      {/* 5. FOOTER */}
      <footer style={{ background: "linear-gradient(135deg, #060b1e 0%, #0d1a3a 100%)" }} className="px-6 pt-16 pb-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={logoSrc} alt="Smart Shine" className="h-40 mb-1 brightness-0 invert opacity-90" />
              <p className="text-sm text-gray-400 leading-relaxed">
                Professional car valeting services with over 25 years of experience. Serving Guildford, Godalming, Woking and surrounding areas.
              </p>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Quick Links</h4>
              <div className="space-y-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/private-valeting", label: "Private Vehicle Valeting" },
                  { href: "/car-vehicle-detailing-service", label: "Car Detailing Service" },
                  { href: "/commercial-valeting", label: "Commercial Valeting" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition-colors font-medium">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-white flex-shrink-0" /><span>Guildford, Surrey</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-white flex-shrink-0" /><span>07717 310 046 / 01483 236 060</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-white flex-shrink-0" /><span>Mon–Sun: 08:00 – 19:00</span></div>
                <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-white flex-shrink-0" /><a href="mailto:nazsalihi@me.com" className="hover:text-white transition-colors">nazsalihi@me.com</a></div>
              </div>
              <a href="https://www.yell.com/biz/smart-shine-valeting-centre-guildford-4715572/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 mt-4 group">
                <img src="/yell-icon.png" alt="Yell" className="h-8 w-8 rounded" />
                <span className="text-gray-400 text-sm font-semibold group-hover:text-white transition-colors">Find us on Yell</span>
              </a>
            </div>
          </div>

          {/* 6. FOLLOW US */}
          <div className="border-t border-white/10 pt-8 pb-4 text-center">
            <p className="text-white font-bold text-[15px] mb-5">Follow us</p>
            <div className="flex items-center justify-center gap-4 mb-8">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Twitter, label: "Twitter / X", href: "#" },
                { icon: Shield, label: "Checkatrade", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label} href={href}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  aria-label={label}
                  className="h-11 w-11 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy & Cookie Policy</Link>
              <span>|</span>
              <Link href="/trading" className="hover:text-gray-300 transition-colors">Trading Terms</Link>
            </div>
            <p className="text-xs text-gray-600">
              © 2026. The content on this website is owned by us and our licensors. Do not copy any content (including images) without our consent.
            </p>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
