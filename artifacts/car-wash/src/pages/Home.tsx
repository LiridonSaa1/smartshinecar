import { Navbar } from "@/components/layout/Navbar";
import { useListServices, useListReviews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Clock, ArrowRight, Star, Shield, Zap, Phone, MapPin, CheckCircle,
  ChevronLeft, ChevronRight, Sparkles, Car, Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import logoSrc from "@assets/Professional_Car_Valeting_Logo_in_Navy_and_Silver_1781123501610.png";

const serviceImages: Record<string, string> = {
  "Exterior Wash": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80",
  "Interior Cleaning": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  "Full Wash": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&q=80",
  "Detailing": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&q=80",
};

const HERO_SLIDES = [
  {
    id: 0,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85",
    eyebrow: "Premium Car Valeting",
    headline: "Your Car Deserves\nthe Best Care",
    sub: "Professional valeting services that restore your vehicle to showroom condition. Book in seconds.",
    cta: { label: "Book Your Valet", href: "/booking" },
    ctaSecondary: { label: "View Services", href: "/services" },
    accent: "from-black/80 via-black/50 to-transparent",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
    eyebrow: "Expert Detailing",
    headline: "Showroom Finish,\nEvery Time",
    sub: "Deep paint correction and interior detailing to restore your vehicle to pristine condition.",
    cta: { label: "Explore Detailing", href: "/car-detailing" },
    ctaSecondary: { label: "See Gallery", href: "/gallery" },
    accent: "from-black/80 via-black/50 to-transparent",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85",
    eyebrow: "Trusted & Guaranteed",
    headline: "Trusted by\nThousands of Drivers",
    sub: "Over 5,000 happy customers and a 4.9-star rating. Experience the Smart Shine difference today.",
    cta: { label: "Book Now", href: "/booking" },
    ctaSecondary: { label: "Read Reviews", href: "/reviews" },
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
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, scale: 1.04, x: d > 0 ? 30 : -30 }),
            center: { opacity: 1, scale: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, scale: 0.98, x: d > 0 ? -30 : 30 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover object-center" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl w-full px-6 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-white/95 text-xs font-semibold tracking-wide uppercase mb-6"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {slide.eyebrow}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-black text-white leading-[1.05] tracking-tight mb-5 whitespace-pre-line"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
              >
                {slide.headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="text-[16px] text-white/80 mb-9 leading-relaxed max-w-lg"
              >
                {slide.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                <Link href={slide.cta.href}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-7 py-3 text-[15px] font-bold text-white transition-all duration-150 shadow-xl shadow-blue-600/40">
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href={slide.ctaSecondary.href}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/35 px-7 py-3 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-150">
                    {slide.ctaSecondary.label}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.46 }}
                className="flex items-center gap-6"
              >
                {[
                  { icon: Shield, text: "Pro Staff" },
                  { icon: Star, text: "4.9 Rating" },
                  { icon: CheckCircle, text: "100% Guaranteed" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-white/75 font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-150 active:scale-90"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-150 active:scale-90"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === index ? "bg-white w-7 h-1.5" : "bg-white/40 w-1.5 h-1.5 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

const whyUs = [
  { icon: Shield, title: "Satisfaction Guaranteed", desc: "100% satisfaction or we redo it free of charge — every time." },
  { icon: Zap, title: "Fast & Efficient", desc: "In and out in record time without ever cutting corners." },
  { icon: Sparkles, title: "Premium Products", desc: "We only use professional-grade cleaning and detailing products." },
  { icon: CheckCircle, title: "Expert Technicians", desc: "Fully trained and experienced valeting technicians on every job." },
];

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useListServices();
  const { data: reviews, isLoading: reviewsLoading } = useListReviews();

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <HeroCarousel />

      {/* ── SERVICES ── */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Car className="h-4 w-4" />
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Our Popular Services</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-[16px]">
              Choose the perfect valeting package for your vehicle, from a quick refresh to a full detail.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services?.filter(s => s.isActive).slice(0, 4).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                  data-testid={`card-service-home-${service.id}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={service.imageUrl || serviceImages[service.name] || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80"}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 right-3 font-bold text-white text-sm bg-blue-600 rounded-full px-3 py-1">
                      From £{service.price}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-[16px] mb-1.5">{service.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {service.description || "Professional car care service."}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                      <Clock className="h-3.5 w-3.5" /> {service.duration} min
                    </div>
                    <Link href={`/booking?serviceId=${service.id}`}>
                      <button
                        className="w-full rounded-full bg-[#0a0f2e] hover:bg-blue-700 active:scale-95 py-2.5 text-sm font-bold text-white transition-all duration-150"
                        data-testid={`button-book-home-${service.id}`}
                      >
                        Book Now
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/services">
              <button className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a0f2e] hover:bg-[#0a0f2e] hover:text-white px-7 py-3 text-[14px] font-bold text-[#0a0f2e] transition-all duration-200">
                View All Services <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-24 bg-gray-950">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Why Choose Smart Shine?</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto text-[16px]">
              We're committed to delivering the finest valeting experience every single visit.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center hover:bg-white/8 transition-colors"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 mx-auto mb-5">
                  <item.icon className="h-7 w-7 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2.5 text-[16px]">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Happy Customers" },
              { value: avgRating + "★", label: "Average Rating" },
              { value: "10+", label: "Service Types" },
              { value: "7", label: "Days a Week" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-black tracking-tight">{stat.value}</p>
                <p className="text-blue-200 mt-2 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Star className="h-4 w-4 fill-yellow-500" />
              Customer Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">What Our Clients Say</h2>
          </motion.div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews?.slice(0, 3).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <StarRating rating={review.rating} />
                  <p className="text-gray-600 text-[15px] mt-4 leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{review.customerName[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{review.customerName}</p>
                      {review.serviceName && <p className="text-xs text-blue-600 font-medium">{review.serviceName}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/reviews">
              <button className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 px-7 py-3 text-[14px] font-bold text-gray-700 transition-all duration-200">
                See All Reviews <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2060 50%, #0a1845 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #60a5fa 0%, transparent 40%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src={logoSrc} alt="Smart Shine" className="h-20 mx-auto mb-8 brightness-0 invert opacity-90" />
            <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">Ready to Shine?</h2>
            <p className="text-white/60 text-[17px] mb-10 leading-relaxed max-w-xl mx-auto">
              Book your appointment now and give your car the premium care it deserves. Fast, easy, guaranteed.
            </p>
            <Link href="/booking">
              <button className="inline-flex items-center gap-2.5 rounded-full bg-blue-500 hover:bg-blue-400 active:scale-95 px-10 py-4 text-[16px] font-bold text-white transition-all duration-150 shadow-2xl shadow-blue-500/30" data-testid="button-cta-book">
                Book Now — It's Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={logoSrc} alt="Smart Shine" className="h-14 mb-4" style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(93%) saturate(600%) hue-rotate(210deg)" }} />
              <p className="text-sm text-gray-500 leading-relaxed">Professional car valeting services that make your car shine like new. Trusted by thousands across the region.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-[14px] uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2.5">
                {[
                  { href: "/private-valeting", label: "Private Vehicle Valeting" },
                  { href: "/car-detailing", label: "Car Detailing Service" },
                  { href: "/commercial-valeting", label: "Commercial Valeting" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/booking", label: "Book Now" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-gray-500 hover:text-blue-700 transition-colors font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-[14px] uppercase tracking-wider">Contact Us</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-blue-700 flex-shrink-0" /><span>123 Car Street, Prishtina</span></div>
                <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-blue-700 flex-shrink-0" /><span>+383 44 123 456</span></div>
                <div className="flex items-center gap-2.5"><Clock className="h-4 w-4 text-blue-700 flex-shrink-0" /><span>Mon–Sun: 08:00 – 19:00</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-sm text-gray-400">
            © 2025 Smart Shine Car Valeting Centre. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
