import { Navbar } from "@/components/layout/Navbar";
import { useListReviews } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  ArrowRight, Star, Shield, Phone, MapPin, Clock,
  ChevronLeft, ChevronRight, Sparkles, CheckCircle, Facebook, Twitter,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import aboutImg from "@assets/image_1781123675503.png";
import whyUsImg from "@assets/IMG_0034-576w_1781124058228.webp";

import completeImg from "@assets/8BAB8335-072E-4691-B56A-98632CD0FC5E-535w_1781124055227.webp";

const HERO_SLIDES = [
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
];

function HeroCarousel() {
  const [[index, dir], setSlide] = useState([0, 0]);
  const slide = HERO_SLIDES[index];

  const go = useCallback((nextIdx: number, direction: number) => {
    setSlide([nextIdx, direction]);
  }, []);
  const prev = () => go((index - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1);
  const next = useCallback(() => go((index + 1) % HERO_SLIDES.length, 1), [index, go]);

  useEffect(() => {
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [next]);

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
                <Link href="/booking">
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-8 py-3.5 text-[15px] font-black text-white transition-all duration-150 shadow-xl shadow-blue-600/40">
                    Book Your Valet
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/35 px-8 py-3.5 text-[15px] font-bold text-white backdrop-blur-sm transition-all duration-150">
                    Get Free Quote
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
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
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

const WHY_US = [
  "25 years of experience in the valeting industry",
  "High-standard car valeting service",
  "Friendly and thorough service",
  "Competitive rates",
  "Both exterior and interior valeting",
  "Fully insured work",
  "Dent removals handled",
  "Free quotes and pre-service consultations",
  "Private and commercial vehicles handled",
];

const REVIEWS = [
  { name: "BillJu", text: "Bought a mechanically sound but filthy T5 Shuttle — all the seats were heavily stained and several had paint on them. Took it to Smart Shine and it pretty much looks like new now. Highly recommended.", rating: 5 },
  { name: "Sarah M.", text: "Absolutely brilliant service. My car looks better than when I first bought it. The team were professional, friendly and incredibly thorough.", rating: 5 },
  { name: "James K.", text: "Used Smart Shine for a full valet on my Range Rover. Exceptional attention to detail and very competitive pricing. Will definitely be back.", rating: 5 },
];

export default function Home() {
  const { data: reviews } = useListReviews();

  const displayReviews = reviews?.slice(0, 3).length ? reviews.slice(0, 3) : REVIEWS;

  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. CAROUSEL */}
      <HeroCarousel />

      {/* 2. ABOUT US */}
      <section className="py-0">
        {/* Top banner — outline text only, primary color */}
        <div className="bg-gray-100 pt-16 pb-4 text-center px-4">
          <FadeIn>
            <h2
              className="text-[clamp(1.1rem,2.5vw,1.75rem)] font-black tracking-tight leading-tight min-h-[2em]"
              style={{
                WebkitTextStroke: "2px #0a0f2e",
                color: "transparent",
              }}
            >
              <Typewriter text="Car valeting in Guildford and surrounding area" />
            </h2>
          </FadeIn>
        </div>

        {/* About content — sits directly below, connected */}
        <div className="bg-gray-100 pt-10 pb-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <FadeIn>
              <h3 className="text-2xl font-black text-[#0a0f2e] mb-6">About us</h3>
              <p className="text-gray-600 leading-loose text-[15px] max-w-3xl mx-auto">
                Smart Shine Car Valeting Centre is a well-established business with over 25 years of experience in the valeting industry.
                We pride ourselves on our commitment to provide professional and high-class services to each and every client. We
                provide an extensive range of valeting services, including a full interior and exterior valet. Smart Shine endeavours to place
                customer satisfaction at the centre of all work carried out. We offer both part valet and full valet services.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="bg-gray-100 pb-10 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "25+", label: "Years Experience", icon: "🏆", color: "from-blue-600 to-blue-800" },
                { value: "5,000+", label: "Happy Customers", icon: "😊", color: "from-indigo-600 to-indigo-800" },
                { value: "100%", label: "Fully Insured", icon: "🛡️", color: "from-blue-700 to-[#0a0f2e]" },
                { value: "5★", label: "Rated Service", icon: "⭐", color: "from-[#0a0f2e] to-blue-900" },
              ].map(({ value, label, icon, color }, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. A COMPLETE VALETING SERVICE */}
      <section className="bg-[#0a0f2e]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image — full bleed */}
          <FadeIn direction="left" className="overflow-hidden min-h-[420px]">
            <img
              src={completeImg}
              alt="Complete Valeting Service"
              className="w-full h-full object-cover object-center min-h-[420px]"
            />
          </FadeIn>

          {/* Text */}
          <FadeIn direction="right" delay={0.15} className="flex items-center px-10 md:px-16 py-16">
            <div>
              <span className="inline-block text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                A complete valeting service
              </h2>
              <p className="text-white/75 leading-relaxed mb-5 text-[15px]">
                At Smart Shine Car Valeting Centre we value our customers and we strive to satisfy your individual requirements.
                We are happy to spend as much time as necessary on your car to ensure that you receive the standard of service
                that you expect and deserve.
              </p>
              <p className="text-white/75 leading-relaxed mb-8 text-[15px]">
                Based in Guildford, we welcome both private and commercial clients from Godalming, Woking and the surrounding areas.
                We have a wide range of packages to choose from, at competitive prices to suit any budget. We also offer car scratch
                removal and machine polish.
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

      {/* 4. WHY CHOOSE US */}
      <section className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text */}
          <FadeIn direction="left" className="flex items-center px-10 md:px-16 py-16">
            <div>
              <span className="inline-block text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">Why Smart Shine?</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-8 leading-tight">
                Why choose us?
              </h2>
              <ul className="space-y-3">
                {WHY_US.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-[15px] font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/private-valeting">
                <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a0f2e] hover:bg-blue-900 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                  View Our Services
                  <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </FadeIn>

          {/* Image */}
          <FadeIn direction="right" delay={0.1} className="overflow-hidden min-h-[500px]">
            <img
              src={whyUsImg}
              alt="Why Choose Smart Shine"
              className="w-full h-full object-cover min-h-[500px]"
            />
          </FadeIn>
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

      {/* 6. CALL */}
      <section
        className="relative py-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, #3b82f6 0%, transparent 70%)" }}
        />
        <FadeIn className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-white/90 text-[15px] md:text-[18px] font-medium leading-relaxed">
            Call Smart Shine Car Valeting Centre on{" "}
            <a href="tel:07717310046" className="font-black text-white text-[20px] md:text-[24px] hover:text-blue-300 transition-colors">
              07717 310 046
            </a>
            {" "}or{" "}
            <a href="tel:01483236060" className="font-black text-white text-[20px] md:text-[24px] hover:text-blue-300 transition-colors">
              01483 236 060
            </a>
            {" "}for a car valeting or detailing in Guildford
          </p>
        </FadeIn>
      </section>

      {/* 7. FOLLOW US (Footer) */}
      <footer className="bg-gray-900 pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={logoSrc} alt="Smart Shine" className="h-16 mb-4 brightness-0 invert opacity-90" />
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
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Guildford, Surrey</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>07717 310 046 / 01483 236 060</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Mon–Sun: 08:00 – 19:00</span></div>
              </div>
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
    </div>
  );
}
