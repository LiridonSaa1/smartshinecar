import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { useListReviews } from "@/lib/api-client";
import { useContentSection, useContentSectionWithLoading } from "@/lib/useContent";
import { Link } from "wouter";
import {
  ArrowRight, Star, Shield, Phone, MapPin, Clock, Mail,
  ChevronLeft, ChevronRight, ChevronDown, Sparkles, CheckCircle, Facebook, Twitter, Send,
  Car,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import aboutImg from "@assets/image_1781123675503.png";
import whyUsImg from "@assets/469415684_588164513901484_5794834001610611799_n_1781127569004.jpg";

import completeImg from "@assets/516887103_745437798174154_273580891758286555_n_1781127553222.jpg";

const HERO_SLIDES_DEFAULT = {
  slides: [
    {
      id: 0,
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85",
      headline: "Premium Car\nValeting Service",
      sub: "Professional valeting that restores your vehicle to showroom condition. Serving Guildford and surrounding areas.",
      accent: "from-black/80 via-black/50 to-transparent",
    },
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
      headline: "Showroom Finish,\nEvery Time",
      sub: "Deep paint correction and interior detailing to restore your vehicle to pristine condition.",
      accent: "from-black/80 via-black/50 to-transparent",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85",
      headline: "Trusted by\nThousands of Drivers",
      sub: "Over 25 years of experience. Over 5,000 happy customers. Experience the Smart Shine difference.",
      accent: "from-black/80 via-black/50 to-transparent",
    },
  ],
  btn1Label: "Book Your Valet",
  btn1Link: "/booking",
  btn2Label: "Get Free Quote",
  btn2Link: "/contact",
};

const ABOUT_DEFAULT = {
  typewriter: "Car valeting in Guildford and surrounding area",
  heading: "About us",
  paragraph: "Smart Shine Car Valeting Centre is a well-established business with over 25 years of experience in the valeting industry. We pride ourselves on our commitment to provide professional and high-class services to each and every client. We provide an extensive range of valeting services, including a full interior and exterior valet. Smart Shine endeavours to place customer satisfaction at the centre of all work carried out. We offer both part valet and full valet services.",
};

const STATS_DEFAULT = {
  items: [
    { value: "25+",    label: "Years Experience", icon: "🏆" },
    { value: "5,000+", label: "Happy Customers",  icon: "😊" },
    { value: "100%",   label: "Fully Insured",    icon: "🛡️" },
    { value: "5★",     label: "Rated Service",    icon: "⭐" },
  ],
};

const COMPLETE_DEFAULT = {
  badge: "Our Services",
  heading: "A complete valeting service",
  paragraph1: "At Smart Shine Car Valeting Centre we value our customers and we strive to satisfy your individual requirements. We are happy to spend as much time as necessary on your car to ensure that you receive the standard of service that you expect and deserve.",
  paragraph2: "Based in Guildford, we welcome both private and commercial clients from Godalming, Woking and the surrounding areas. We have a wide range of packages to choose from, at competitive prices to suit any budget. We also offer car scratch removal and machine polish.",
  image: "",
};

function HeroCarousel({ hero }: { hero: typeof HERO_SLIDES_DEFAULT | undefined }) {
  const [[index, dir], setSlide] = useState([0, 0]);
  const safeSlides = hero?.slides?.length ? hero.slides : HERO_SLIDES_DEFAULT.slides;
  const slide = safeSlides[index] ?? safeSlides[0];
  const btn1Label = hero?.btn1Label || HERO_SLIDES_DEFAULT.btn1Label;
  const btn1Link  = hero?.btn1Link  || HERO_SLIDES_DEFAULT.btn1Link;
  const btn2Label = hero?.btn2Label || HERO_SLIDES_DEFAULT.btn2Label;
  const btn2Link  = hero?.btn2Link  || HERO_SLIDES_DEFAULT.btn2Link;

  const go = useCallback((nextIdx: number, direction: number) => {
    setSlide([nextIdx, direction]);
  }, []);
  const prev = () => go((index - 1 + safeSlides.length) % safeSlides.length, -1);
  const next = useCallback(() => go((index + 1) % safeSlides.length, 1), [index, go, safeSlides.length]);

  useEffect(() => {
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [next]);

  if (!hero) {
    return (
      <section className="relative h-screen min-h-[620px] overflow-hidden select-none bg-[#06091a]" />
    );
  }

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
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
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
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/95 text-xs font-bold tracking-widest uppercase mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                Smart Shine Car Valeting Centre
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-[clamp(2.8rem,6vw,5rem)] font-black text-white leading-[1.03] tracking-tight mb-6 whitespace-pre-line"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
              >
                {slide.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="text-[16px] text-white/80 mb-9 leading-relaxed max-w-lg"
              >
                {slide.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="flex flex-wrap gap-3"
              >
                <Link href={btn1Link}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-8 py-3.5 text-[15px] font-black text-white transition-all duration-150 shadow-xl shadow-blue-600/40">
                    {btn1Label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href={btn2Link}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/35 px-8 py-3.5 text-[15px] font-bold text-white backdrop-blur-sm transition-all duration-150">
                    {btn2Label}
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all active:scale-90">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all active:scale-90">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {safeSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            className={`transition-all duration-300 rounded-full ${i === index ? "bg-white w-8 h-2" : "bg-white/40 w-2 h-2 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Typewriter({ text, typingSpeed = 60, deletingSpeed = 35, pauseMs = 1800 }: {
  text: string; typingSpeed?: number; deletingSpeed?: number; pauseMs?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting" | "waiting">("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      setPhase("deleting");
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("typing"), 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-white align-middle ml-1 animate-pulse" />
    </span>
  );
}

function FadeIn({ children, className, delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 30 : 0, x: direction === "left" ? -40 : direction === "right" ? 40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const WHY_CARDS_DEFAULT = [
  { emoji: "🏆", title: "25 Years Experience",   desc: "Over two decades of professional valeting expertise in Guildford" },
  { emoji: "⭐", title: "5-Star Rated",          desc: "Consistently top-rated by hundreds of happy customers" },
  { emoji: "🛡️", title: "Fully Insured",         desc: "All work fully insured for your complete peace of mind" },
  { emoji: "✅", title: "Showroom Standards",    desc: "Meticulous attention to detail on every single vehicle" },
  { emoji: "💷", title: "Competitive Rates",     desc: "Premium quality service at prices to suit any budget" },
  { emoji: "🚐", title: "Private & Commercial",  desc: "Cars, vans, and commercial vehicles all welcome" },
  { emoji: "🔧", title: "Dent & Scratch Repair", desc: "We also handle dent removal and machine polish" },
  { emoji: "🕐", title: "Mon – Sun 08–19",       desc: "Open 7 days a week — book at a time that suits you" },
];

const WHY_DEFAULT_CONTENT = {
  subtitle: "Over 25 years of experience, competitive prices, and results you can see.",
  image: "",
  cards: WHY_CARDS_DEFAULT,
};

const CAR_SERVICES_DEFAULT = {
  subtitle: "From a quick hand wash to full paint correction — we cover everything your vehicle needs.",
  items: [
    { label: "Car & Vehicle Valeting", icon: "🚗" },
    { label: "Car Buffing",             icon: "✨" },
    { label: "Car Detailing",           icon: "🔍" },
    { label: "Car Scratch Repairs",     icon: "🛠️" },
    { label: "Car Valeting",            icon: "🧽" },
    { label: "Car Wash",                icon: "💧" },
    { label: "Commercial Vehicle Valeting", icon: "🚐" },
    { label: "Deep Cleaning",           icon: "🧹" },
    { label: "Dent Removal",            icon: "🔧" },
    { label: "Exterior Valet",          icon: "🌟" },
    { label: "Hand Car Wash",           icon: "🤲" },
    { label: "Interior Valet",          icon: "💺" },
    { label: "Machine Polish",          icon: "⚙️" },
    { label: "Mini Valets",             icon: "⚡" },
    { label: "Private Vehicle Valeting",icon: "🔑" },
    { label: "Stain Removal Services",  icon: "🪣" },
    { label: "Wheel Cleaning",          icon: "🔵" },
  ],
};

const GET_IN_TOUCH_DEFAULT = {
  description: "Call Smart Shine Car Valeting Centre for a car valeting or detailing in Guildford",
  phones: [
    { number: "07717 310 046" },
    { number: "01483 236 060" },
  ],
  hours: "Mon – Sun · 08:00 – 19:00",
};

const REVIEWS = [
  { name: "BillJu", text: "Bought a mechanically sound but filthy T5 Shuttle — all the seats were heavily stained and several had paint on them. Took it to Smart Shine and it pretty much looks like new now. Highly recommended.", rating: 5 },
  { name: "Sarah M.", text: "Absolutely brilliant service. My car looks better than when I first bought it. The team were professional, friendly and incredibly thorough.", rating: 5 },
  { name: "James K.", text: "Used Smart Shine for a full valet on my Range Rover. Exceptional attention to detail and very competitive pricing. Will definitely be back.", rating: 5 },
];

function HomeContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  const homeServices = [
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "home" }),
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
            Send us a message
          </h2>
          <p className="text-gray-500 mt-3 text-[15px] max-w-md mx-auto">
            Tell us about your vehicle and we'll get back to you with a personalised quote.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          {/* Left info panel */}
          <FadeIn direction="left" className="md:col-span-2 space-y-6">
            {[
              { icon: Phone, title: "Call us directly", lines: ["07717 310 046", "01483 236 060"], sub: "Mon – Sun, 08:00 – 19:00" },
              { icon: MapPin, title: "Our location", lines: ["Guildford, Surrey"], sub: "Also serving Godalming & Woking" },
              { icon: Clock, title: "Opening hours", lines: ["Mon – Sun"], sub: "08:00 – 19:00" },
            ].map(({ icon: Icon, title, lines, sub }) => (
              <div key={title} className="flex gap-4 items-start bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="h-10 w-10 rounded-xl bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-[#0a0f2e] text-[14px] mb-1">{title}</p>
                  {lines.map(l => <p key={l} className="text-gray-800 font-semibold text-[13px]">{l}</p>)}
                  <p className="text-gray-400 text-[12px] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </FadeIn>

          {/* Form */}
          <FadeIn direction="right" delay={0.1} className="md:col-span-3">
            {sent ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-[#0a0f2e] mb-2">Message sent!</h3>
                <p className="text-gray-500 text-[15px]">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Phone</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      placeholder="07700 000 000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="john@example.com" />
                </div>
                <div className="relative">
                  <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Service Required</label>
                  <button
                    type="button"
                    onClick={() => setServiceOpen(o => !o)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-left outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all flex items-center justify-between"
                  >
                    <span className={form.service ? "text-gray-900" : "text-gray-400"}>{form.service || "Select a service..."}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`} />
                  </button>
                  {serviceOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                      {homeServices.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setForm(f => ({ ...f, service: s })); setServiceOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-blue-50 hover:text-blue-700 transition-colors ${form.service === s ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    placeholder="Tell us about your vehicle and what you need..." />
                </div>
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a0f2e] hover:bg-blue-900 px-8 py-4 text-[15px] font-black text-white transition-all duration-150 disabled:opacity-60"
                >
                  {sending ? "Sending…" : (<><Send className="h-4 w-4" /> Send Message</>)}
                </motion.button>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: reviews } = useListReviews();
  const { data: heroContent, isLoading: heroLoading } = useContentSectionWithLoading("hero_slides", HERO_SLIDES_DEFAULT);
  const aboutContent = useContentSection("about_us", ABOUT_DEFAULT);
  const statsContent = useContentSection("stats_cards", STATS_DEFAULT);
  const completeContent = useContentSection("complete_valeting", COMPLETE_DEFAULT);
  const whyContent = useContentSection("why_choose_us", WHY_DEFAULT_CONTENT);
  const carServicesContent = useContentSection("car_vehicle_services", CAR_SERVICES_DEFAULT);
  const getInTouchContent = useContentSection("get_in_touch", GET_IN_TOUCH_DEFAULT);

  const heroData = heroLoading ? undefined : ((heroContent as unknown as typeof HERO_SLIDES_DEFAULT | null) ?? HERO_SLIDES_DEFAULT);
  const aboutData = (aboutContent as typeof ABOUT_DEFAULT | null) ?? ABOUT_DEFAULT;
  const statsData = (statsContent as typeof STATS_DEFAULT | null)?.items ?? STATS_DEFAULT.items;
  const completeData = (completeContent as typeof COMPLETE_DEFAULT | null) ?? COMPLETE_DEFAULT;

  const displayReviews = reviews?.slice(0, 3).length ? reviews.slice(0, 3) : REVIEWS;
  const whyCards = (whyContent as typeof WHY_DEFAULT_CONTENT).cards ?? WHY_CARDS_DEFAULT;
  const whySubtitle = (whyContent as typeof WHY_DEFAULT_CONTENT).subtitle ?? WHY_DEFAULT_CONTENT.subtitle;
  const carServices = (carServicesContent as typeof CAR_SERVICES_DEFAULT).items ?? CAR_SERVICES_DEFAULT.items;
  const carServicesSubtitle = (carServicesContent as typeof CAR_SERVICES_DEFAULT).subtitle ?? CAR_SERVICES_DEFAULT.subtitle;
  const touchDesc = (getInTouchContent as typeof GET_IN_TOUCH_DEFAULT).description ?? GET_IN_TOUCH_DEFAULT.description;
  const touchPhones = (getInTouchContent as typeof GET_IN_TOUCH_DEFAULT).phones ?? GET_IN_TOUCH_DEFAULT.phones;
  const touchHours = (getInTouchContent as typeof GET_IN_TOUCH_DEFAULT).hours ?? GET_IN_TOUCH_DEFAULT.hours;

  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. CAROUSEL */}
      <HeroCarousel hero={heroData} />

      {/* 2. ABOUT US */}
      <section className="py-0">
        {/* Top banner — outline text only, primary color */}
        <div className="bg-gray-100 pt-16 pb-4 text-center px-4">
          <FadeIn>
            <h2
              className="text-[clamp(1.1rem,2.5vw,1.75rem)] font-black tracking-tight leading-tight min-h-[2em] text-[#0a0f2e]"
            >
              <Typewriter text={aboutData.typewriter ?? ABOUT_DEFAULT.typewriter} />
            </h2>
          </FadeIn>
        </div>

        {/* About content — sits directly below, connected */}
        <div className="bg-gray-100 pt-10 pb-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <FadeIn>
              <h3 className="text-2xl font-black text-[#0a0f2e] mb-6">{aboutData.heading ?? ABOUT_DEFAULT.heading}</h3>
              <p className="text-gray-600 leading-loose text-[15px] max-w-3xl mx-auto">
                {aboutData.paragraph ?? ABOUT_DEFAULT.paragraph}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="bg-gray-100 pb-10 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statsData.map(({ value, label, icon }, i) => {
                const colors = ["from-blue-600 to-blue-800", "from-indigo-600 to-indigo-800", "from-blue-700 to-[#0a0f2e]", "from-[#0a0f2e] to-blue-900"];
                const color = colors[i % colors.length];
                return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-center shadow-lg shadow-blue-900/20`}
                >
                  {/* decorative circle */}
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-white/5" />
                  <div className="absolute -bottom-6 -left-4 h-24 w-24 rounded-full bg-white/5" />
                  <div className="relative">
                    <div className="text-3xl mb-3">{icon}</div>
                    <p className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
                      {value}
                    </p>
                    <p className="text-blue-200 text-[12px] font-bold uppercase tracking-widest">{label}</p>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. A COMPLETE VALETING SERVICE */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Image — full bleed */}
          <FadeIn direction="left" className="overflow-hidden min-h-[420px]">
            <img
              src={completeData.image || completeImg}
              alt="Complete Valeting Service"
              className="w-full h-full object-cover object-center min-h-[420px]"
            />
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right" delay={0.15} className="flex items-center px-10 md:px-16 py-16">
            <div>
              <span className="inline-block text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                {completeData.badge ?? COMPLETE_DEFAULT.badge}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                {completeData.heading ?? COMPLETE_DEFAULT.heading}
              </h2>
              <p className="text-white/75 leading-relaxed mb-5 text-[15px]">
                {completeData.paragraph1 ?? COMPLETE_DEFAULT.paragraph1}
              </p>
              <p className="text-white/75 leading-relaxed mb-8 text-[15px]">
                {completeData.paragraph2 ?? COMPLETE_DEFAULT.paragraph2}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/private-valeting">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                    View Packages
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:bg-white/10 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                    Get Free Quote
                  </button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. PRODUCTS & SERVICES */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Car className="h-4 w-4" />
              Products &amp; Services
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
              Car &amp; Vehicle Services
            </h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-xl mx-auto">
              {carServicesSubtitle}
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {carServices.map(({ label, icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: "0 8px 28px rgba(10,15,46,0.10)" }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 p-5 text-center transition-all duration-200 cursor-default group"
              >
                <span className="text-3xl">{icon}</span>
                <p className="text-[13px] font-bold text-[#0a0f2e] group-hover:text-blue-700 leading-snug transition-colors duration-200">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          <FadeIn className="text-center mt-10">
            <Link href="/booking">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 px-8 py-3.5 text-[15px] font-black text-white transition-all duration-150 shadow-lg shadow-blue-900/20"
              >
                Book a Service
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">

          {/* Header */}
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Sparkles className="h-4 w-4" />
              Why Smart Shine?
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
              Why choose us?
            </h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-xl mx-auto">
              {whySubtitle}
            </p>
          </FadeIn>

          {/* Two-column: cards + image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Feature cards grid */}
            <FadeIn direction="left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyCards.map((card, i) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.5 }}
                      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(10,15,46,0.08)" }}
                      className="flex gap-4 items-start bg-gray-50 hover:bg-blue-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-100 transition-all duration-200 group cursor-default"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#0a0f2e] group-hover:bg-blue-600 flex items-center justify-center flex-shrink-0 transition-colors duration-200 text-xl">
                        {card.emoji}
                      </div>
                      <div>
                        <p className="font-black text-[#0a0f2e] text-[13px] mb-0.5">{card.title}</p>
                        <p className="text-gray-500 text-[12px] leading-relaxed">{card.desc}</p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
              <Link href="/private-valeting">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150"
                >
                  View Our Services
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
            </FadeIn>

            {/* Image with floating stat badges */}
            <FadeIn direction="right" delay={0.1} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={(whyContent as typeof WHY_DEFAULT_CONTENT).image || whyUsImg}
                  alt="Why Choose Smart Shine"
                  className="w-full h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2e]/50 via-transparent to-transparent" />
              </div>

              {/* Badge: years */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="absolute top-6 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 border border-gray-100"
              >
                <p className="text-3xl font-black text-[#0a0f2e] leading-none">25+</p>
                <p className="text-[11px] text-gray-500 font-bold mt-0.5 uppercase tracking-wide">Years Experience</p>
              </motion.div>

              {/* Badge: customers */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 -right-5 bg-[#0a0f2e] rounded-2xl shadow-xl px-5 py-4"
              >
                <p className="text-3xl font-black text-white leading-none">5k+</p>
                <p className="text-[11px] text-blue-300 font-bold mt-0.5 uppercase tracking-wide">Happy Customers</p>
              </motion.div>

              {/* Badge: stars */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 flex items-center gap-3"
              >
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <div>
                  <p className="text-[13px] font-black text-[#0a0f2e] leading-none">5-Star Rated</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Google Reviews</p>
                </div>
              </motion.div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* 5. WHAT OUR CUSTOMERS SAY */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Star className="h-4 w-4 fill-yellow-500" />
              Customer Reviews
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              What our customers say?
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayReviews.map((review: any, i: number) => (
              <FadeIn key={review.id ?? i} delay={i * 0.12} className="bg-gray-50 border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= (review.rating ?? 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed italic mb-5">
                  "{review.comment ?? review.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-sm">{(review.customerName ?? review.name)[0]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.customerName ?? review.name}</p>
                    {review.serviceName && <p className="text-xs text-blue-600 font-medium">{review.serviceName}</p>}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT FORM */}
      <HomeContactForm />

      {/* 7. CALL */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
      >
        {/* background glows */}
        <div className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 55%)" }} />
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(ellipse at 75% 60%, #6366f1 0%, transparent 50%)" }} />

        {/* decorative ring top-left */}
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border border-white/5" />

        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          {/* icon */}
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
            <Phone className="h-6 w-6 text-blue-300" />
          </div>

          <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">
            Get in touch today
          </p>

          <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8">
            {touchDesc}
          </p>

          {/* Phone numbers as cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {touchPhones.map(({ number }, i) => {
              const href = "tel:" + number.replace(/\s/g, "");
              return (
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
              );
            })}
          </div>

          <p className="mt-8 text-white/40 text-[13px]">{touchHours}</p>
        </FadeIn>
      </section>

      {/* 7. FOLLOW US (Footer) */}
      <footer className="bg-gray-900 pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={logoSrc} alt="Smart Shine" className="h-40 mb-1 brightness-0 invert opacity-90" />
              <p className="text-sm text-gray-400 leading-relaxed">Professional car valeting services with over 25 years of experience. Serving Guildford, Godalming, Woking and surrounding areas.</p>
            </div>
            <div>
              <h4 className="font-black text-white mb-4 text-[13px] uppercase tracking-widest">Quick Links</h4>
              <div className="space-y-2.5">
                {[
                  { href: "/private-valeting", label: "Private Vehicle Valeting" },
                  { href: "/car-detailing", label: "Car Detailing Service" },
                  { href: "/commercial-valeting", label: "Commercial Valeting" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/booking", label: "Book Now" },
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

          {/* Follow us */}
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
