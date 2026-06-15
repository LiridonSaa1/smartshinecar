import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Link } from "wouter";
import {
  ArrowRight, Star, Phone, MapPin, Clock, Mail,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  Facebook, Twitter, Shield, Send,
  Droplets, Car, Crown, Layers, Paintbrush, Truck,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useContentSection } from "@/lib/useContent";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import defenderImg from "@assets/469415684_588164513901484_5794834001610611799_n_1781125792210.jpg";
import shineImg from "@assets/482083268_650585217659413_5986183003189104178_n_1781125795445.jpg";
import packagesImg from "@assets/516887103_745437798174154_273580891758286555_n_1781125798156.jpg";

const HERO_SLIDES = [
  {
    id: 0,
    image: "",
    headline: "Excellent Private Vehicle\nValeting Service in Guildford",
    sub: "At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting packages to suit all your requirements in the Guildford area. We also welcome customers from Godalming and Woking.",
  },
  {
    id: 1,
    image: "",
    headline: "Professional Valeting\nFor Every Vehicle",
    sub: "From a quick mini valet to a full premier package — we restore your vehicle to showroom condition. Fully insured, friendly and thorough service every time.",
  },
  {
    id: 2,
    image: "",
    headline: "Interior & Exterior\nValeting Specialists",
    sub: "Whether it's an interior deep clean or a full exterior polish — Smart Shine delivers showroom results every time. We also offer dent removal and machine polish.",
  },
];

const PACKAGES = [
  { name: "Mini Valet", desc: "Exterior wash, leather dry, vacuum, window polish", price: "from £45.00", icon: Droplets, color: "bg-blue-50 text-blue-600" },
  { name: "Economy Valet", desc: "For new and well maintained cars", price: "from £120.00", icon: Car, color: "bg-indigo-50 text-indigo-600" },
  { name: "Premier Valet", desc: "To make your car look as good as new", price: "from £169.00", icon: Crown, color: "bg-amber-50 text-amber-600" },
  { name: "Interior Valet", desc: "Full interior deep clean and treatment", price: "from £120.00", icon: Layers, color: "bg-purple-50 text-purple-600" },
  { name: "Exterior Valet", desc: "Full exterior wash, polish and finish", price: "from £139.00", icon: Paintbrush, color: "bg-green-50 text-green-600" },
  { name: "Commercial Vehicle", desc: "Valeting service for commercial vehicles in Guildford", price: "Call for quote", icon: Truck, color: "bg-slate-100 text-slate-600" },
];

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

function HeroCarousel({ slides }: { slides: typeof HERO_SLIDES }) {
  const [[index, dir], setSlide] = useState([0, 0]);
  const slide = slides[index] ?? slides[0];
  const go = useCallback((nextIdx: number, direction: number) => setSlide([nextIdx, direction]), []);
  const prev = () => go((index - 1 + slides.length) % slides.length, -1);
  const next = useCallback(() => go((index + 1) % slides.length, 1), [index, go, slides.length]);
  useEffect(() => { const t = setTimeout(next, 6000); return () => clearTimeout(t); }, [next]);

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden select-none bg-[#06091a]">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.image?.trim() && <img src={slide.image} alt="" className="w-full h-full object-cover object-center" loading="eager" fetchPriority="high" style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" }} />}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/95 text-xs font-bold tracking-widest uppercase mb-5"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                Private Vehicle Valeting
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-[clamp(2.2rem,5vw,4rem)] font-black text-white leading-[1.05] tracking-tight mb-5 whitespace-pre-line"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
              >
                {slide.headline}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="text-[15px] text-white/80 mb-8 leading-relaxed max-w-lg"
              >
                {slide.sub}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="flex flex-wrap gap-3"
              >
                <a href="/contact#contact-form">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-7 py-3 text-[14px] font-black text-white transition-all duration-150 shadow-xl shadow-blue-600/40">
                    Get Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
                <a href="#packages">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/35 px-7 py-3 text-[14px] font-bold text-white backdrop-blur-sm transition-all duration-150">
                    View Packages
                  </button>
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all active:scale-90">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all active:scale-90">
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

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const valetServices = [
    "Mini Valet — from £45",
    "Economy Valet — from £120",
    "Premier Valet — from £169",
    "Interior Valet — from £120",
    "Exterior Valet — from £139",
    "Commercial Vehicle — Call for quote",
    "Other / Not sure",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "private-valeting" }),
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
      {/* CALL SECTION — matches Home page style exactly */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
      >
        {/* background glows */}
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />

        {/* decorative rings */}
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />

        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
            <Phone className="h-6 w-6 text-blue-300" />
          </div>

          <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">
            Get in touch today
          </p>

          <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8">
            Call Smart Shine Car Valeting Centre for a car valeting or detailing in Guildford
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { number: "07717 310 046", href: "tel:07717310046" },
              { number: "01483 236 060", href: "tel:01483236060" },
            ].map(({ number, href }, i) => (
              <motion.a
                key={number}
                href={href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm px-8 py-4 text-white transition-all duration-200 hover:bg-white/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 0 2px rgba(96,165,250,0.4), 0 0 20px rgba(96,165,250,0.15)" }} />
                <Phone className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <span className="text-[22px] md:text-[26px] font-black tracking-wide">{number}</span>
              </motion.a>
            ))}
          </div>

          <p className="mt-8 text-white/40 text-[13px]">Mon – Sun &nbsp;·&nbsp; 08:00 – 19:00</p>
        </FadeIn>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 20%, #dbeafe 0%, transparent 60%)" }} />

        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Send className="h-4 w-4" />
              Free Quote
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
              Or send us a message
            </h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
              Tell us about your vehicle and we'll get back to you with a personalised quote.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            {/* Left info panel */}
            <FadeIn direction="left" className="md:col-span-2 space-y-6">
              {[
                {
                  icon: Phone,
                  title: "Call us directly",
                  lines: ["07717 310 046", "01483 236 060"],
                  sub: "Mon – Sun, 08:00 – 19:00",
                },
                {
                  icon: MapPin,
                  title: "Our location",
                  lines: ["Guildford, Surrey"],
                  sub: "Also serving Godalming & Woking",
                },
                {
                  icon: Clock,
                  title: "Opening hours",
                  lines: ["Monday – Sunday"],
                  sub: "08:00 – 19:00",
                },
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

            {/* Form */}
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
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                        placeholder="John Smith"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        required
                        placeholder="07700 000 000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      required
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Service Required</label>
                    <button
                      type="button"
                      onClick={() => setServiceOpen(o => !o)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all flex items-center justify-between"
                    >
                      <span className={form.service ? "text-gray-900" : "text-gray-400"}>{form.service || "Select a package…"}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        {valetServices.map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => { setForm(f => ({ ...f, service: s })); setServiceOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${form.service === s ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Your Message *</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                      placeholder="Tell us about your vehicle and what you need…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-gray-400 text-xs">* Required fields</p>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 active:scale-95 px-8 py-3.5 text-[14px] font-black text-white transition-all duration-150 disabled:opacity-60 shadow-lg shadow-[#0a0f2e]/20"
                    >
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

const PV_HERO_DEFAULT = { slides: HERO_SLIDES };
const PV_INTRO_DEFAULT = { heading: "Excellent private vehicle valeting service in Guildford.", paragraph: "At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting packages to suit all your requirements in the Guildford area. We also welcome customers from Godalming and Woking." };
const PV_PACKAGES_DEFAULT = { items: PACKAGES.map(p => ({ name: p.name, desc: p.desc, price: p.price })) };
const PV_BODY_DEFAULT = { heading: "We can make your car shine", paragraph: "We understand that every car is different, which is why we offer car valeting packages tailored to your specific needs. We also offer a range of specialised services such as dent removal and paintwork restoration to ensure we bring your car back to its best. Whether it is the interior valeting or the exterior valeting of your car that needs attention, we can provide a thorough valet service — so why not give us a call today to find out more? We offer both full valet and part valet services. In addition to valeting, we also offer machine polish and car scratch removal.", image: "" };

export default function PrivateValeting() {
  const heroContent = useContentSection("pv_hero", PV_HERO_DEFAULT);
  const introContent = useContentSection("pv_intro", PV_INTRO_DEFAULT);
  const packagesContent = useContentSection("pv_packages", PV_PACKAGES_DEFAULT);
  const bodyContent = useContentSection("pv_body", PV_BODY_DEFAULT);
  const slides = (heroContent as typeof PV_HERO_DEFAULT).slides ?? HERO_SLIDES;
  const pkgItems = (packagesContent as typeof PV_PACKAGES_DEFAULT).items ?? PV_PACKAGES_DEFAULT.items;

  useEffect(() => {
    if (window.location.hash === "#packages") {
      const el = document.getElementById("packages");
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }
    }
  }, []);

  const PACKAGE_META = [
    { icon: Droplets, color: "bg-blue-50 text-blue-600" },
    { icon: Car, color: "bg-indigo-50 text-indigo-600" },
    { icon: Crown, color: "bg-amber-50 text-amber-600" },
    { icon: Layers, color: "bg-purple-50 text-purple-600" },
    { icon: Paintbrush, color: "bg-green-50 text-green-600" },
    { icon: Truck, color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel slides={slides} />

      {/* 1b. ABOUT / INTRO + PACKAGES CARDS */}
      <section id="packages" className="bg-gray-100 py-16 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-12">
            <h3 className="text-2xl font-black text-[#0a0f2e] mb-6">
              {(introContent as typeof PV_INTRO_DEFAULT).heading}
            </h3>
            <p className="text-gray-600 leading-loose text-[15px] max-w-3xl mx-auto">
              {(introContent as typeof PV_INTRO_DEFAULT).paragraph}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pkgItems.map((pkg, i) => {
              const meta = PACKAGE_META[i] ?? PACKAGE_META[PACKAGE_META.length - 1];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(10,15,46,0.10)" }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 cursor-default"
                >
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -6, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                    <span className="inline-block bg-[#0a0f2e] text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {pkg.price}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-[#0a0f2e] text-[15px] mb-1">{pkg.name}</h4>
                    <p className="text-gray-500 text-[13px] leading-relaxed">{pkg.desc}</p>
                  </div>
                  <a href="/contact#contact-form" className="mt-auto inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-[13px] font-bold transition-colors group">
                    Get Free Quote
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              );
            })}
          </div>
          <p className="text-gray-400 text-[13px] italic text-center mt-6">* Prices vary on the size of the car.</p>
        </div>
      </section>

      {/* 2. WE CAN MAKE YOUR CAR SHINE */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <FadeIn direction="left" className="flex items-center px-10 md:px-16 py-16 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                {(bodyContent as typeof PV_BODY_DEFAULT).heading}
              </h2>
              <p className="text-white/75 leading-relaxed text-[15px]">
                {(bodyContent as typeof PV_BODY_DEFAULT).paragraph}
              </p>
              <a href="tel:07717310046" className="inline-flex items-center gap-2 mt-7 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                <Phone className="h-4 w-4" />
                07717 310 046
              </a>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.1} className="overflow-hidden min-h-[420px] order-1 md:order-2">
            <img
              src={(bodyContent as typeof PV_BODY_DEFAULT).image || shineImg}
              alt="Professional Car Valeting"
              className="w-full h-full object-cover object-center min-h-[420px]"
            />
          </FadeIn>
        </div>
      </section>

      {/* 4. CUSTOMER REVIEW */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-full px-4 py-1.5 text-sm font-bold mb-8">
              <Star className="h-4 w-4 fill-yellow-500" />
              Our Customer's Comments on Our Service
            </div>
            <div className="flex gap-0.5 justify-center mb-6">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <blockquote className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed italic max-w-3xl mx-auto mb-8">
              "What a fantastic valet service; my Audi A6 was looking dirty and very well used. With a dog and two kids
              it had accumulated a huge amount of dirt inside and the outside needed a jolly good clean and finish. To
              put it mildly, I was astonished at what Smart Shine achieved — the car looked brand new. It is rare to
              find someone who takes a real pride in their work and Smart Shine is one of those rare businesses. I
              cannot recommend them highly enough. I will go back again and again."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#0a0f2e] flex items-center justify-center">
                <span className="text-white font-black text-base">A</span>
              </div>
              <div className="text-left">
                <p className="font-black text-gray-900 text-base">Adrian Shaw</p>
                <p className="text-sm text-blue-600 font-medium">Verified Customer</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 5. CONTACT FORM */}
      <ContactForm />

      {/* 6. FOOTER */}
      <footer className="bg-gray-900 pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={logoSrc} alt="Smart Shine" className="h-40 mb-1 brightness-0 invert opacity-90" />
              <p className="text-sm text-gray-400 leading-relaxed">Professional car valeting services with over 25 years of experience. Serving Guildford, Godalming, Woking and surrounding areas.</p>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Quick Links</h4>
              <div className="space-y-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/private-valeting", label: "Private Vehicle Valeting" },
                  { href: "/car-detailing", label: "Car Detailing Service" },
                  { href: "/commercial-valeting", label: "Commercial Valeting" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition-colors font-medium">
                    {label}
                  </Link>
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
