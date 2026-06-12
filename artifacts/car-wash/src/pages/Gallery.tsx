import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Link } from "wouter";
import {
  Phone, MapPin, Clock, Send,
  ChevronLeft, ChevronRight,
  Facebook, Twitter, Sparkles, Images,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

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

/* ── Brand data ───────────────────────────────────────────────────── */
const BRANDS = [
  {
    id: "bmw",
    name: "BMW",
    emoji: "🇩🇪",
    images: [
      { url: "/gallery/473535750_619511767433425_7662701961903293797_n.jpg", caption: "BMW X5 — Full Exterior Detail" },
      { url: "/gallery/474001506_619511954100073_5461609372315389260_n.jpg", caption: "BMW — Paint Correction & Polish" },
      { url: "/gallery/473801182_619512007433401_6293151158368073150_n.jpg", caption: "BMW — Executive Valet" },
      { url: "/gallery/474768370_619511887433413_4938583833109010141_n.jpg", caption: "BMW — Interior & Exterior Detail" },
      { url: "/gallery/475760913_629846126399989_4669870005838851543_n.jpg", caption: "BMW — Full Valet Package" },
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes",
    emoji: "⭐",
    images: [
      { url: "/gallery/473443844_619512024100066_110027540695465171_n.jpg", caption: "Mercedes CLA — Executive Valet" },
      { url: "/gallery/473523900_619511960766739_3755589629688917314_n.jpg", caption: "Mercedes — Full Detail" },
      { url: "/gallery/473767872_619512020766733_1364191108626878270_n.jpg", caption: "Mercedes — Paint Correction" },
      { url: "/gallery/475751031_629846499733285_150717965852448166_n.jpg", caption: "Mercedes — Professional Valet" },
    ],
  },
  {
    id: "ferrari",
    name: "Ferrari",
    emoji: "🐎",
    images: [
      { url: "/gallery/516887103_745437798174154_273580891758286555_n.jpg", caption: "Ferrari SF90 — Luxury Detail Package" },
    ],
  },
  {
    id: "porsche",
    name: "Porsche",
    emoji: "🏁",
    images: [
      { url: "/gallery/469415684_588164513901484_5794834001610611799_n.jpg", caption: "Porsche 718 Cayman — Full Detail" },
    ],
  },
  {
    id: "landrover",
    name: "Land Rover",
    emoji: "🏔️",
    images: [
      { url: "/gallery/482083268_650585217659413_5986183003189104178_n.jpg", caption: "Range Rover Velar — Executive Valet" },
      { url: "/gallery/517115344_745437934840807_7594245145680153131_n.jpg", caption: "Land Rover Defender — Full Detail" },
      { url: "/gallery/517370738_745437734840827_3795225164762659203_n.jpg", caption: "Land Rover — Paint Correction" },
      { url: "/gallery/518012578_745437864840814_6876246571923067153_n.jpg", caption: "Range Rover — Full Valet Package" },
      { url: "/gallery/518254459_745437901507477_5259856767592016968_n.jpg", caption: "Range Rover Sport — Executive Detail" },
      { url: "/gallery/518315796_745438034840797_1271932863752682018_n.jpg", caption: "Range Rover — Interior & Exterior" },
      { url: "/gallery/518352435_745437754840825_2674201468873826579_n.jpg", caption: "Range Rover — Machine Polish" },
      { url: "/gallery/538074368_786291270755473_3876620829441520899_n.jpg", caption: "Land Rover Discovery — Full Valet" },
      { url: "/gallery/539054522_786291324088801_4912547299741950370_n.jpg", caption: "Land Rover — Professional Detail" },
      { url: "/gallery/540435560_786291280755472_678271375966164992_n.jpg", caption: "Land Rover Discovery — Full Clean" },
      { url: "/gallery/559419126_825155896869010_5204867211108474419_n.jpg", caption: "Land Rover Freelander — Full Valet" },
    ],
  },
  {
    id: "mini",
    name: "MINI",
    emoji: "🇬🇧",
    images: [
      { url: "/gallery/474226873_619511847433417_2383582933929002531_n.jpg", caption: "MINI Countryman — Full Valet" },
      { url: "/gallery/475030628_629846533066615_8526303629189371407_n.jpg", caption: "MINI — Mini Valet Package" },
      { url: "/gallery/516839446_745437964840804_7406371077779077697_n.jpg", caption: "MINI — Exterior Detail" },
    ],
  },
  { id: "toyota", name: "Toyota", emoji: "🚗", images: [] },
  { id: "golf", name: "VW Golf", emoji: "🏎️", images: [] },
  { id: "audi", name: "Audi", emoji: "⚪", images: [] },
  { id: "mg", name: "MG", emoji: "🏎️", images: [] },
  { id: "nissan", name: "Nissan", emoji: "🚗", images: [] },
  { id: "lexus", name: "Lexus", emoji: "⬜", images: [] },
  { id: "ford", name: "Ford", emoji: "🇬🇧", images: [] },
  { id: "jaguar", name: "Jaguar", emoji: "🐆", images: [] },
  { id: "vauxhall", name: "Vauxhall", emoji: "🔱", images: [] },
  { id: "mitsubishi", name: "Mitsubishi", emoji: "🚙", images: [] },
  { id: "peugeot", name: "Peugeot", emoji: "🦁", images: [] },
  { id: "citroen", name: "Citroën", emoji: "🇫🇷", images: [] },
  { id: "aston-martin", name: "Aston Martin", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", images: [] },
  { id: "bugatti", name: "Bugatti", emoji: "🐝", images: [] },
];

/* ── Brand Gallery Slider ─────────────────────────────────────────── */
function BrandSlider({ brand }: { brand: typeof BRANDS[0] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + brand.images.length) % brand.images.length);
  const next = () => setIdx(i => (i + 1) % brand.images.length);
  const img = brand.images[idx];

  if (!img) return null;

  return (
    <motion.div
      key={brand.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-4"
    >
      {/* Main slider */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 aspect-[4/3] bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={img.url}
            src={img.url}
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
        {brand.images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {brand.images.length > 1 && (
          <div className="absolute bottom-4 right-5 flex gap-1.5">
            {brand.images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all ${i === idx ? "bg-white w-5 h-1.5" : "bg-white/40 w-1.5 h-1.5"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {brand.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {brand.images.map((image, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? "border-blue-500 shadow-lg shadow-blue-500/30" : "border-transparent opacity-60 hover:opacity-90"}`}
            >
              <img src={image.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── Hero Carousel ────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 0,
    image: "/gallery/516887103_745437798174154_273580891758286555_n.jpg",
    headline: "Paint Restoration\nSpecialists in Guildford",
    sub: "From scratch removal to full paint correction — see our exceptional work in our gallery below.",
  },
  {
    id: 1,
    image: "/gallery/482083268_650585217659413_5986183003189104178_n.jpg",
    headline: "Interior & Exterior\nValeting Gallery",
    sub: "Explore our transformations across all vehicle types and valeting services.",
  },
  {
    id: 2,
    image: "/gallery/469415684_588164513901484_5794834001610611799_n.jpg",
    headline: "Serving Guildford,\nGodalming & Woking",
    sub: "Customers from across Surrey trust Smart Shine to restore and protect their vehicles.",
  },
];

function HeroCarousel() {
  const [[index, dir], setSlide] = useState([0, 0]);
  const slide = HERO_SLIDES[index];
  const go = useCallback((nextIdx: number, direction: number) => setSlide([nextIdx, direction]), []);
  const prev = () => go((index - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1);
  const next = useCallback(() => go((index + 1) % HERO_SLIDES.length, 1), [index, go]);
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
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
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
        {HERO_SLIDES.map((s, i) => (
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
                      <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${serviceOpen ? "rotate-90" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {serviceOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden"
                        >
                          {services.map(s => (
                            <button key={s} type="button"
                              onClick={() => { setForm(f => ({ ...f, service: s })); setServiceOpen(false); }}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">
                              {s}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Message</label>
                    <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your car and what services you need…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all resize-none" />
                  </div>
                  <motion.button type="submit" disabled={sending}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-[#0a0f2e] hover:bg-[#1a2a6c] text-white text-sm font-black py-4 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {sending ? "Sending…" : <><Send className="h-4 w-4" /> Send Message</>}
                  </motion.button>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-gray-900 pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <img src={logoSrc} alt="Smart Shine" className="h-24 mb-4 brightness-0 invert opacity-90" />
            <p className="text-sm text-gray-400 leading-relaxed">Professional car valeting services with over 25 years of experience. Serving Guildford, Godalming, Woking and surrounding areas.</p>
          </div>
          <div>
            <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/private-valeting", label: "Private Vehicle Valeting" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}><Link href={href} className="text-gray-400 hover:text-white transition-colors text-sm">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Contact</h4>
            <div className="space-y-3">
              {[
                { Icon: Phone, text: "07717 310 046" },
                { Icon: Phone, text: "01483 236 060" },
                { Icon: MapPin, text: "Guildford, Surrey" },
                { Icon: Clock, text: "Mon–Sun: 08:00–19:00" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#0a0f2e] border border-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-400 text-sm">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="h-9 w-9 rounded-full bg-[#0a0f2e] border border-blue-900/40 flex items-center justify-center text-blue-400 hover:text-white hover:bg-blue-600 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Smart Shine Car Valeting Centre. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Guildford · Godalming · Woking · Surrey</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Page ───────────────────────────────────────────────────── */
export default function Gallery() {
  const brandsWithPhotos = BRANDS.filter(b => b.images.length > 0);
  const [activeBrand, setActiveBrand] = useState(brandsWithPhotos[0]?.id ?? "bmw");
  const currentBrand = BRANDS.find(b => b.id === activeBrand) ?? brandsWithPhotos[0];

  return (
    <div className="min-h-screen bg-white font-[Inter]">
      <Navbar />
      <HeroCarousel />

      {/* Text intro section */}
      <section className="py-14 bg-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Our Work
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] tracking-tight mb-5">
              Paint restoration specialists in Guildford
            </h2>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Take a look at some exceptional works done by the experts at Smart Shine Car Valeting Centre.
              From car scratch removals to paint restoration, we can do it all. Get in touch with us to book an
              appointment for car valeting in Guildford. We offer both interior and exterior valeting. You can
              choose between full valet and part valet. Customers from across Guildford, Godalming and
              Woking are welcomed to our car valeting centre.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Brand gallery section */}
      <section id="gallery" className="py-14 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Images className="h-3.5 w-3.5" /> A Glimpse of Our Previous Valets
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a0f2e] tracking-tight mb-3">Browse by vehicle</h2>
            <p className="text-gray-500 text-[15px]">Select a brand to see our work on that vehicle type</p>
          </FadeIn>

          {/* Brand tabs */}
          <FadeIn delay={0.1} className="flex flex-wrap gap-2 justify-center mb-10">
            {BRANDS.map(brand => {
              const hasPhotos = brand.images.length > 0;
              const isActive = activeBrand === brand.id;
              return (
                <motion.button
                  key={brand.id}
                  onClick={() => hasPhotos && setActiveBrand(brand.id)}
                  whileHover={hasPhotos ? { scale: 1.04 } : {}}
                  whileTap={hasPhotos ? { scale: 0.97 } : {}}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#0a0f2e] text-white shadow-lg"
                      : hasPhotos
                        ? "bg-white border border-gray-200 text-gray-700 hover:border-gray-400 shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-default opacity-60"
                  }`}
                >
                  <span className="text-base">{brand.emoji}</span>
                  {brand.name}
                  {isActive && <span className="ml-1 text-blue-300 text-xs">{brand.images.length}</span>}
                </motion.button>
              );
            })}
          </FadeIn>

          {/* Slider */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              {currentBrand && currentBrand.images.length > 0 && (
                <motion.div
                  key={activeBrand}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <BrandSlider brand={currentBrand} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <ContactForm />
      <Footer />
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
