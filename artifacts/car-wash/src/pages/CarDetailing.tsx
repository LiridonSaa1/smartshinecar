import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Link } from "wouter";
import {
  ArrowRight, Star, Phone, MapPin, Clock,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, Send,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import shineImg from "@assets/469570167_588163753901560_1761922679835222318_n_1781128330046.jpg";

const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85",
    headline: "Car Detailing Service\nin Guildford",
    sub: "Smart Shine Car Valeting Centre uses premium products to rejuvenate your car to showroom condition. Serving Guildford, Godalming, Woking and surrounding areas.",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
    headline: "Premium Products.\nShowroom Results.",
    sub: "From paintwork correction to scratch and dent removal — our car detailing service brings your vehicle back to its best, regardless of make or model.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85",
    headline: "Interior & Exterior\nDetailing Specialists",
    sub: "Machine polish, clear coat correction, 3D hologram removal — we remove defects and reveal a flawless, defect-free surface every time.",
  },
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
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover object-center" />
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
                Car Detailing Service
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
                <a href="#contact">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-7 py-3 text-[14px] font-black text-white transition-all duration-150 shadow-xl shadow-blue-600/40">
                    Get Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
                <a href="#about">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/35 px-7 py-3 text-[14px] font-bold text-white backdrop-blur-sm transition-all duration-150">
                    Learn More
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
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
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

  const detailServices = [
    "Car Detailing",
    "Machine Polish",
    "Paintwork Correction",
    "Scratch Removal",
    "Dent Removal",
    "Interior Detailing",
    "Exterior Detailing",
    "Other / Not sure",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <>
      {/* GET IN TOUCH */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
      >
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />

        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
            <Phone className="h-6 w-6 text-blue-300" />
          </div>
          <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">Get in touch today</p>
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

      {/* CONTACT FORM */}
      <section id="contact" className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(ellipse at 80% 20%, #dbeafe 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Send className="h-4 w-4" />
              Free Quote
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">Contact Us</h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
              Tell us about your vehicle and we'll get back to you with a personalised quote.
            </p>
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
                  <p className="text-gray-500 text-[15px]">We'll be in touch shortly to discuss your detailing needs.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Full Name *</label>
                      <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                    </div>
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Phone Number *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="07700 000 000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Email Address *</label>
                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all" />
                  </div>
                  <div className="relative">
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">Service Required</label>
                    <button
                      type="button"
                      onClick={() => setServiceOpen(o => !o)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all flex items-center justify-between"
                    >
                      <span className={form.service ? "text-gray-900" : "text-gray-400"}>{form.service || "Select a service…"}</span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        {detailServices.map(s => (
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
                    <textarea rows={4} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your vehicle and what you need…"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-gray-400 text-xs">* Required fields</p>
                    <button type="submit" disabled={sending}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 active:scale-95 px-8 py-3.5 text-[14px] font-black text-white transition-all duration-150 disabled:opacity-60 shadow-lg shadow-[#0a0f2e]/20">
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

export default function CarDetailing() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel />

      {/* 2. ABOUT */}
      <section id="about" className="bg-gray-100 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
              <Sparkles className="h-4 w-4" />
              Car Detailing Guildford
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-6 leading-tight">
              Are you in need of a car detailing service in Guildford?
            </h2>
            <p className="text-gray-600 leading-loose text-[16px] max-w-3xl mx-auto">
              Smart Shine Car Valeting Centre has an extensive range of products designed to rejuvenate your car.
              We use premium products allowing us to make your car look as new. We offer high-quality car detailing
              services in Guildford, Godalming, Woking and the surrounding areas.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <a href="#contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 px-7 py-3 text-[14px] font-black text-white transition-all"
                >
                  Get Free Quote <ArrowRight className="h-4 w-4" />
                </motion.button>
              </a>
              <a href="tel:07717310046">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a0f2e] text-[#0a0f2e] hover:bg-[#0a0f2e] hover:text-white px-7 py-3 text-[14px] font-black transition-all"
                >
                  <Phone className="h-4 w-4" /> 07717 310 046
                </motion.button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. WE CAN MAKE YOUR CAR SHINE */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <FadeIn direction="left" className="flex items-start px-10 md:px-16 py-16 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
                We can make your car shine
              </h2>
              <p className="text-white/75 leading-relaxed text-[15px] mb-6">
                We can offer a detailing service to all makes of car. Whatever car you have, regardless of make
                and model, our service includes paintwork correction to help bring it back to a showroom standard
                whether your car is new or old. Whether it is car scratch removal, dent removal, or machine polish,
                you can count on us.
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">
                We can make your car shine
              </h2>
              <p className="text-white/75 leading-relaxed text-[15px] mb-8">
                Our car detailing service removes the defects such as scratches, 3d holograms and swirls by
                removing a thin layer of clear coat which reveals the defect free surface. We also provide
                interior valeting and exterior valeting. For your convenience, we offer full valet and part
                valet services.
              </p>
              <a href="tel:07717310046" className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                <Phone className="h-4 w-4" />
                07717 310 046
              </a>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.1} className="overflow-hidden min-h-[480px] order-1 md:order-2">
            <img
              src={shineImg}
              alt="Car Detailing Service"
              className="w-full h-full object-cover object-center min-h-[480px]"
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

      {/* 5 & 6. GET IN TOUCH + CONTACT FORM */}
      <ContactForm />

      {/* FOOTER */}
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
                  { href: "/car-vehicle-detailing-service", label: "Car Detailing Service" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-gray-400 hover:text-white transition-colors font-medium">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Guildford, Surrey</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>07717 310 046 / 01483 236 060</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Mon–Sun: 08:00 – 19:00</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-gray-600">
              © 2026. The content on this website is owned by us and our licensors. Do not copy any content (including images) without our consent.
            </p>
          </div>
        </div>
      </footer>
      <FloatingWhatsApp />
    </div>
  );
}
