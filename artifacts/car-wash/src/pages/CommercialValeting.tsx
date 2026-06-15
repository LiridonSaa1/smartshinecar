import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Link } from "wouter";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Facebook,
  Twitter,
  Shield,
  Send,
  Wrench,
  Sparkles,
  CheckCircle,
  Truck,
  Droplets,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useContentSection } from "@/lib/useContent";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import vanImg from "@assets/IMG_1997-1920w_1781130022961.webp";
import kenworthImg from "@assets/IMG_0022-8ade3f8e-1920w_1781130012426.webp";
import heroSlide1 from "@assets/image_1781255006269.png";
import heroSlide3 from "@assets/image_1781255016349.png";

const HERO_SLIDES = [
  {
    id: 0,
    image: "",
    headline: "Top-Class Commercial Vehicle\nValeting Service in Guildford",
    sub: "Commercial vehicles see much more wear and tear than private cars due to the amount of usage, and therefore need regular valeting. Count on Smart Shine Car Valeting Centre to clean your car or van and bring its shine back.",
  },
  {
    id: 1,
    image: "",
    headline: "Full & Part Valet Services\nAt Competitive Prices",
    sub: "We offer full valet and part valet services at competitive prices. Whether you need interior valeting or exterior valeting, you can rely on us.",
  },
  {
    id: 2,
    image: "",
    headline: "Serving Guildford,\nGodalming & Woking",
    sub: "Based in Guildford, we welcome customers from Godalming, Woking and the surrounding areas. Get in touch with us and let us know your requirements.",
  },
];

const SERVICES = [
  "Dent and scratch removal",
  "Machine polishing",
  "Paint restoration",
  "Vomit removal",
  "Pet hair removal",
  "Tree sap removal",
  "Liquids (e.g. milk, wine) removal",
  "Headlight Restoration Treatment",
];

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

function HeroCarousel({ slides }: { slides: typeof HERO_SLIDES }) {
  const [[index, dir], setSlide] = useState([0, 0]);
  const slide = slides[index] ?? slides[0];
  const go = useCallback(
    (nextIdx: number, direction: number) => setSlide([nextIdx, direction]),
    [],
  );
  const prev = () =>
    go((index - 1 + slides.length) % slides.length, -1);
  const next = useCallback(
    () => go((index + 1) % slides.length, 1),
    [index, go, slides.length],
  );
  useEffect(() => {
    const t = setTimeout(next, 6000);
    return () => clearTimeout(t);
  }, [next]);

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
          {slide.image?.trim() && (
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
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
              <Truck className="h-3.5 w-3.5" />
              Commercial Vehicle Valeting
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5 whitespace-pre-line">
              {slide.headline}
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/contact#contact-form">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  Get Free Quote <Send className="h-4 w-4" />
                </motion.button>
              </a>
              <a href="tel:07717310046">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-black text-white hover:bg-white/20 transition-all"
                >
                  <Phone className="h-4 w-4" /> Call Us Now
                </motion.button>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
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

  const commercialServices = [
    "Full Commercial Valet",
    "Part Valet — Interior Only",
    "Part Valet — Exterior Only",
    "Dent & Scratch Removal",
    "Machine Polish",
    "Fleet Cleaning",
    "Other / Not sure",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "commercial-valeting" }),
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
      {/* CALL SECTION */}
      <section
        className="relative py-20 overflow-hidden"
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

        <FadeIn className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 mx-auto">
            <Phone className="h-6 w-6 text-blue-300" />
          </div>
          <p className="text-white/70 text-[13px] font-bold tracking-[0.25em] uppercase mb-4">
            Get in touch today
          </p>
          <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed mb-8">
            Call Smart Shine Car Valeting Centre for commercial vehicle valeting
            in Guildford
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
                <Phone className="h-5 w-5 text-blue-300 flex-shrink-0" />
                <span className="text-[22px] md:text-[26px] font-black tracking-wide">
                  {number}
                </span>
              </motion.a>
            ))}
          </div>
          <p className="mt-8 text-white/40 text-[13px]">
            Mon – Sun &nbsp;·&nbsp; 08:00 – 19:00
          </p>
        </FadeIn>
      </section>

      {/* CONTACT FORM */}
      <section
        id="contact"
        className="relative py-20 bg-gray-50 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 80% 20%, #dbeafe 0%, transparent 60%)",
          }}
        />
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
              Tell us about your vehicle and we'll get back to you with a
              personalised quote.
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
                <div
                  key={title}
                  className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="h-11 w-11 rounded-xl bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[#0a0f2e] font-black text-sm mb-1">
                      {title}
                    </p>
                    {lines.map((l) => (
                      <p
                        key={l}
                        className="text-gray-700 font-semibold text-[15px]"
                      >
                        {l}
                      </p>
                    ))}
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
                  <p className="text-[#0a0f2e] font-black text-2xl mb-2">
                    Message Sent!
                  </p>
                  <p className="text-gray-500 text-[15px]">
                    We'll be in touch shortly to discuss your commercial
                    valeting needs.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="John Smith"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="07700 000 000"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">
                      Service Required
                    </label>
                    <button
                      type="button"
                      onClick={() => setServiceOpen((o) => !o)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all flex items-center justify-between"
                    >
                      <span
                        className={
                          form.service ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {form.service || "Select a service…"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${serviceOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {serviceOpen && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                        {commercialServices.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setForm((f) => ({ ...f, service: s }));
                              setServiceOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${form.service === s ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-800"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[#0a0f2e] text-xs font-bold uppercase tracking-widest mb-2">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
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
                      {sending ? (
                        "Sending…"
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Message
                        </>
                      )}
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

const CV_HERO_DEFAULT = { slides: HERO_SLIDES };
const CV_INTRO_DEFAULT = { heading: "Top-class commercial vehicle valeting service in Guildford", paragraph: "Commercial vehicles see much more wear and tear than private cars due to the amount of usage, and therefore need regular valeting. Count on Smart Shine Car Valeting Centre to clean your car or van and bring its shine back. We offer full valet and part valet services at competitive prices. Whether you need interior valeting or exterior valeting, you can rely on us." };
const CV_BODY_DEFAULT = { heading: "Commercial valeting", paragraph1: "Do you run a business which utilises a fleet of commercial vehicles, or provides transportation services? We understand that cleaning the vehicles could be a difficult task.", paragraph2: "Leave the job to our experienced and detail-oriented car valeting experts at Smart Shine Car Valeting Centre for a cost-effective solution to keep all your commercial vehicles looking their best. Whether you have bought a used vehicle or you want to sell one of your vehicles, rely on our specialists to give it the best look and increase its value.", paragraph3: "We offer car scratch removal, dent removal and machine polish at affordable prices. Based in Guildford, we welcome customers from Godalming, Woking and the surrounding areas. Get in touch with us and let us know your requirements.", image: "" };
const CV_SERVICES_DEFAULT = { items: SERVICES.map(s => ({ label: s, image: "" })) };

export default function CommercialValeting() {
  const heroContent = useContentSection("cv_hero", CV_HERO_DEFAULT);
  const introContent = useContentSection("cv_intro", CV_INTRO_DEFAULT);
  const bodyContent = useContentSection("cv_body", CV_BODY_DEFAULT);
  const servicesContent = useContentSection("cv_services", CV_SERVICES_DEFAULT);
  const slides = (heroContent as typeof CV_HERO_DEFAULT).slides ?? HERO_SLIDES;
  const intro = introContent as typeof CV_INTRO_DEFAULT;
  const body = bodyContent as typeof CV_BODY_DEFAULT;
  const serviceItems = (servicesContent as typeof CV_SERVICES_DEFAULT).items ?? SERVICES;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel slides={slides} />

      {/* ABOUT US */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6">
          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-5">
              <Truck className="h-4 w-4" />
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-5 leading-tight">
              {intro.heading}
            </h2>
            <p className="text-gray-600 text-[16px] leading-relaxed max-w-3xl mx-auto">
              {intro.paragraph}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. COMMERCIAL VALETING — text left, image right */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 60%, #0a1845 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                {body.heading}
              </h2>
              <p className="text-white/80 text-[15px] leading-relaxed mb-4">
                {body.paragraph1}
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-4">
                {body.paragraph2}
              </p>
              <p className="text-white/80 text-[15px] leading-relaxed mb-8">
                {body.paragraph3}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/contact#contact-form">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-500 hover:bg-blue-400 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Get Free Quote <Send className="h-4 w-4" />
                  </motion.button>
                </a>
                <a href="tel:07717310046">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/20 transition-all"
                  >
                    <Phone className="h-4 w-4" /> Call Us
                  </motion.button>
                </a>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                <img
                  src={(body as typeof CV_BODY_DEFAULT).image || kenworthImg}
                  alt="Commercial vehicle valeting truck"
                  className="w-full h-80 object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES INCLUDE — image left, list right */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
              <Wrench className="h-4 w-4" />
              What We Do
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0a0f2e] tracking-tight">
              Our services include
            </h2>
            <p className="text-gray-500 mt-3 text-[15px] max-w-lg mx-auto">
              We offer a wide range of professional commercial vehicle valeting
              services to keep your fleet in top condition.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <img
                  src={vanImg}
                  alt="Commercial van valeting"
                  className="w-full h-80 object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <ul className="space-y-3 mb-8">
                {serviceItems.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-gray-800 font-medium text-[15px]">
                      {typeof s === "string" ? s : (s as { label: string }).label}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <p className="text-gray-500 text-sm">
                Take a look at the{" "}
                <Link
                  href="/gallery"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  gallery
                </Link>{" "}
                for our previous valets.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 4. CONTACT FORM */}
      <ContactForm />

      {/* 5. FOOTER */}
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
                  { href: "/", label: "Home" },
                  {
                    href: "/private-valeting",
                    label: "Private Vehicle Valeting",
                  },
                  { href: "/car-detailing", label: "Car Detailing Service" },
                  {
                    href: "/commercial-valeting",
                    label: "Commercial Valeting",
                  },
                  { href: "/gallery", label: "Gallery" },
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
                Privacy & Cookie Policy
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
