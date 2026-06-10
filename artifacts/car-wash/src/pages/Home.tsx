import { Navbar } from "@/components/layout/Navbar";
import { useListServices, useListReviews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Clock, ArrowRight, Droplets, Star, Shield, Zap, Phone, MapPin, CheckCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

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
    eyebrow: "Premium Car Care",
    headline: "Your Car Deserves\nthe Best Care",
    sub: "Professional valeting services that make your car shine like new. Book in seconds.",
    cta: { label: "Book Your Wash", href: "/booking" },
    ctaSecondary: { label: "View Services", href: "/services" },
    accent: "from-black/75 via-black/40 to-transparent",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85",
    eyebrow: "Expert Detailing",
    headline: "Showroom Finish,\nEvery Time",
    sub: "Deep paint correction and interior detailing to restore your vehicle to pristine condition.",
    cta: { label: "Explore Detailing", href: "/services" },
    ctaSecondary: { label: "See Gallery", href: "/gallery" },
    accent: "from-black/80 via-black/45 to-transparent",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85",
    eyebrow: "Satisfaction Guaranteed",
    headline: "Trusted by\nThousands of Drivers",
    sub: "Over 5,000 happy customers and a 4.9-star rating. Experience the difference today.",
    cta: { label: "Book Now", href: "/booking" },
    ctaSecondary: { label: "Read Reviews", href: "/reviews" },
    accent: "from-black/75 via-black/40 to-transparent",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

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
    <section className="relative h-[92vh] min-h-[580px] overflow-hidden select-none">
      {/* Background images */}
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
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover object-center" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="max-w-xl"
            >
              {/* Eyebrow chip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-1 text-white/90 text-xs font-medium mb-5"
              >
                <Droplets className="h-3.5 w-3.5" />
                {slide.eyebrow}
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[clamp(2.4rem,5vw,4rem)] font-bold text-white leading-[1.08] tracking-tight mb-4 whitespace-pre-line"
              >
                {slide.headline}
              </motion.h1>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                className="text-[15px] md:text-[16px] text-white/75 mb-8 leading-relaxed max-w-sm"
              >
                {slide.sub}
              </motion.p>

              {/* Buttons — Apple pill style */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="flex flex-wrap gap-3"
              >
                <Link href={slide.cta.href}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-6 py-2.5 text-[14px] font-semibold text-white transition-all duration-150 shadow-lg shadow-blue-600/30">
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href={slide.ctaSecondary.href}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 border border-white/30 px-6 py-2.5 text-[14px] font-semibold text-white backdrop-blur-sm transition-all duration-150">
                    {slide.ctaSecondary.label}
                  </button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.44 }}
                className="flex items-center gap-5 mt-8"
              >
                {[
                  { icon: Shield, text: "Pro Staff" },
                  { icon: Star, text: "4.9 Rating" },
                  { icon: CheckCircle, text: "Guaranteed" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-white/60" />
                    <span className="text-xs text-white/60">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-150 active:scale-90"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-150 active:scale-90"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === index ? "bg-white w-6 h-1.5" : "bg-white/40 w-1.5 h-1.5 hover:bg-white/70"
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
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

const whyUs = [
  { icon: Shield, title: "Satisfaction Guaranteed", desc: "100% satisfaction or we redo it free of charge." },
  { icon: Zap, title: "Fast & Efficient", desc: "In and out in record time without cutting corners." },
  { icon: Star, title: "Premium Products", desc: "We only use high-grade cleaning & detailing products." },
  { icon: CheckCircle, title: "Professional Staff", desc: "Trained & experienced technicians every time." },
];

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useListServices();
  const { data: reviews, isLoading: reviewsLoading } = useListReviews();

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel />

      {/* ── SERVICES PREVIEW ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <Droplets className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Our Popular Services</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Choose the best service for your vehicle from our carefully curated options.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services?.filter(s => s.isActive).slice(0, 4).map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-service-home-${service.id}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.imageUrl || serviceImages[service.name] || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80"}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-card-foreground mb-1">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {service.description || "Professional car care service."}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {service.duration} min
                      </span>
                      <span className="font-bold text-blue-600 text-sm">From ${service.price}</span>
                    </div>
                    <Link href={`/booking?serviceId=${service.id}`}>
                      <button
                        className="w-full rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 py-1.5 text-xs font-semibold text-white transition-all duration-150"
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

          <div className="text-center mt-10">
            <Link href="/services">
              <button className="inline-flex items-center gap-2 rounded-full border border-border hover:border-blue-500/50 hover:bg-blue-500/5 px-6 py-2.5 text-[14px] font-medium text-foreground transition-all duration-150">
                View All Services <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Why Choose Us?</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              We're committed to delivering the best car wash experience every single visit.
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
                className="bg-white dark:bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2 text-[15px]">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Happy Customers" },
              { value: avgRating, label: "Average Rating" },
              { value: "4", label: "Service Types" },
              { value: "7", label: "Days a Week" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-white/65 mt-1.5 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <Star className="h-4 w-4 fill-yellow-500" />
              Customer Reviews
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">What Our Clients Say</h2>
          </motion.div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {reviews?.slice(0, 3).map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <StarRating rating={review.rating} />
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{review.customerName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground text-sm">{review.customerName}</p>
                      {review.serviceName && <p className="text-xs text-blue-600">{review.serviceName}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/reviews">
              <button className="inline-flex items-center gap-2 rounded-full border border-border hover:border-yellow-500/40 hover:bg-yellow-500/5 px-6 py-2.5 text-[14px] font-medium text-foreground transition-all duration-150">
                See All Reviews <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Ready to Shine?</h2>
            <p className="text-white/55 text-[16px] mb-8 leading-relaxed">
              Book your appointment now and give your car the care it deserves. Fast, easy, guaranteed.
            </p>
            <Link href="/booking">
              <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 px-8 py-3 text-[15px] font-semibold text-white transition-all duration-150 shadow-xl shadow-blue-600/25" data-testid="button-cta-book">
                Book Now — It's Free
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-10 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-blue-600 shadow-sm">
                  <Droplets className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-card-foreground text-[16px] tracking-tight">Car Wash Pro</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Professional car wash services that make your car shine like new.</p>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3 text-[14px]">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { href: "/services", label: "Services" },
                  { href: "/gallery", label: "Gallery" },
                  { href: "/booking", label: "Book Now" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="block text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3 text-[14px]">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" /><span>123 Car Street, Prishtina</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600 flex-shrink-0" /><span>+383 44 123 456</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-600 flex-shrink-0" /><span>Mon–Sun: 08:00–19:00</span></div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © 2024 Car Wash Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
