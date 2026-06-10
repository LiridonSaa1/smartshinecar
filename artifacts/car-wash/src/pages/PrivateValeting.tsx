import { Navbar } from "@/components/layout/Navbar";
import { Link } from "wouter";
import {
  ArrowRight, Star, Phone, MapPin, Clock,
  ChevronLeft, ChevronRight, Sparkles,
  Facebook, Twitter, Shield, Send,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";
import defenderImg from "@assets/image_1781124740566.png";
import shineImg from "@assets/image_1781124766668.png";
import packagesImg from "@assets/image_1781124780534.png";

const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85",
    headline: "Excellent Private Vehicle\nValeting Service in Guildford",
    sub: "At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting packages to suit all your requirements in the Guildford area. We also welcome customers from Godalming and Woking.",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
    headline: "Professional Valeting\nFor Every Vehicle",
    sub: "From a quick mini valet to a full premier package — we restore your vehicle to showroom condition. Fully insured, friendly and thorough service every time.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85",
    headline: "Interior & Exterior\nValeting Specialists",
    sub: "Whether it's an interior deep clean or a full exterior polish — Smart Shine delivers showroom results every time. We also offer dent removal and machine polish.",
  },
];

const PACKAGES = [
  { name: "Mini Valet", desc: "Exterior wash, leather dry, vacuum, window polish", price: "from £45.00" },
  { name: "Economy Valet", desc: "For new and well maintained cars", price: "from £120.00" },
  { name: "Premier Valet", desc: "To make your car look as good as new", price: "from £169.00" },
  { name: "Interior Valet", desc: "Full interior deep clean and treatment", price: "from £120.00" },
  { name: "Exterior Valet", desc: "Full exterior wash, polish and finish", price: "from £139.00" },
  { name: "Commercial Vehicle", desc: "Valeting service for commercial vehicles in Guildford", price: "Call for quote" },
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
    <section className="relative h-[70vh] min-h-[560px] overflow-hidden select-none">
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
                <a href="#contact">
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative py-16 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, #3b82f6 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6">
        <FadeIn className="text-center mb-8">
          <p className="text-white/90 text-[15px] md:text-[17px] font-medium leading-relaxed">
            Call Smart Shine Car Valeting Centre on{" "}
            <a href="tel:07717310046" className="font-black text-white text-[18px] md:text-[20px] hover:text-blue-300 transition-colors">
              07717 310 046
            </a>
            {" "}or{" "}
            <a href="tel:01483236060" className="font-black text-white text-[18px] md:text-[20px] hover:text-blue-300 transition-colors">
              01483 236 060
            </a>
            {" "}for private vehicle valeting service in Guildford
          </p>
        </FadeIn>

        {sent ? (
          <FadeIn className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-black text-xl mb-2">Message Sent!</p>
            <p className="text-white/70 text-sm">We'll be in touch shortly to discuss your valeting needs.</p>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1}>
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["name", "email", "phone"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-white/80 text-xs font-bold uppercase tracking-widest mb-1.5 capitalize">{field}:</label>
                    <input
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-white/80 text-xs font-bold uppercase tracking-widest mb-1.5">Message:</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  className="w-full bg-white rounded-lg px-4 py-2.5 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#0a0f2e] hover:bg-blue-50 px-8 py-3 text-[14px] font-black transition-all duration-150 disabled:opacity-60"
                >
                  {sending ? "Sending…" : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </div>
            </form>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

export default function PrivateValeting() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-[Montserrat,sans-serif]">
      <Navbar />

      {/* 1. HERO CAROUSEL */}
      <HeroCarousel />

      {/* 1b. INTRO SPLIT — Land Rover */}
      <section className="bg-white border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-screen-xl mx-auto">
          <FadeIn direction="left" className="overflow-hidden min-h-[360px]">
            <img
              src={defenderImg}
              alt="Private vehicle valeting Guildford"
              className="w-full h-full object-cover object-center min-h-[360px]"
            />
          </FadeIn>
          <FadeIn direction="right" delay={0.15} className="flex items-center px-10 md:px-16 py-14">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#0a0f2e] mb-5 leading-tight">
                Excellent private vehicle valeting service in Guildford.
              </h2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting
                packages to suit all your requirements in the Guildford area. We also welcome customers from
                Godalming and Woking.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. WE CAN MAKE YOUR CAR SHINE */}
      <section className="bg-[#0a0f2e]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <FadeIn direction="left" className="flex items-center px-10 md:px-16 py-16 order-2 md:order-1">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                We can make your car shine
              </h2>
              <p className="text-white/75 leading-relaxed text-[15px]">
                We understand that every car is different, which is why we offer car valeting packages tailored to your
                specific needs. We also offer a range of specialised services such as dent removal and paintwork
                restoration to ensure we bring your car back to its best. Whether it is the interior valeting or the
                exterior valeting of your car that needs attention, we can provide a thorough valet service — so why
                not give us a call today to find out more? We offer both full valet and part valet services. In addition
                to valeting, we also offer machine polish and car scratch removal.
              </p>
              <a href="tel:07717310046" className="inline-flex items-center gap-2 mt-7 rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                <Phone className="h-4 w-4" />
                07717 310 046
              </a>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.1} className="overflow-hidden min-h-[420px] order-1 md:order-2">
            <img
              src={shineImg}
              alt="Professional Car Valeting"
              className="w-full h-full object-cover object-center min-h-[420px]"
            />
          </FadeIn>
        </div>
      </section>

      {/* 3. CHOOSE FROM OUR PACKAGES */}
      <section id="packages" className="bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <FadeIn direction="left" delay={0.05} className="overflow-hidden min-h-[420px]">
            <img
              src={packagesImg}
              alt="Choose from our packages"
              className="w-full h-full object-cover object-center min-h-[420px]"
            />
          </FadeIn>
          <FadeIn direction="right" delay={0.15} className="flex items-center px-10 md:px-16 py-16">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-black text-[#0a0f2e] mb-8 leading-tight">
                Choose from one of our packages
              </h2>
              <div className="space-y-3">
                {PACKAGES.map((pkg, i) => (
                  <motion.div
                    key={pkg.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-start justify-between gap-4 py-3 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <p className="font-bold text-[#0a0f2e] text-[14px]">{pkg.name}</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">{pkg.desc}</p>
                    </div>
                    <span className="inline-block bg-[#0a0f2e] text-white text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {pkg.price}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-500 text-[13px] mt-5 italic">* Prices vary on the size of the car.</p>
              <a href="#contact" className="inline-flex items-center gap-2 mt-6 rounded-full bg-[#0a0f2e] hover:bg-blue-900 px-7 py-3 text-[14px] font-bold text-white transition-all duration-150">
                Get Free Quote
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
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
              <img src={logoSrc} alt="Smart Shine" className="h-24 mb-4 brightness-0 invert opacity-90" />
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
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Guildford, Surrey</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>07717 310 046 / 01483 236 060</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-blue-400 flex-shrink-0" /><span>Mon–Sun: 08:00 – 19:00</span></div>
              </div>
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
    </div>
  );
}
