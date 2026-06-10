import { Navbar } from "@/components/layout/Navbar";
import { useListServices, useListReviews } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Clock, DollarSign, ArrowRight, Droplets, Star, Shield, Zap, Phone, MapPin, CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMAGE = "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1400&q=80";

const serviceImages: Record<string, string> = {
  "Exterior Wash": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=500&q=80",
  "Interior Cleaning": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  "Full Wash": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500&q=80",
  "Detailing": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&q=80",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function Home() {
  const { data: services, isLoading: servicesLoading } = useListServices();
  const { data: reviews, isLoading: reviewsLoading } = useListReviews();

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const whyUs = [
    { icon: Shield, title: "Satisfaction Guaranteed", desc: "100% satisfaction or we redo it free of charge." },
    { icon: Zap, title: "Fast & Efficient", desc: "In and out in record time without cutting corners." },
    { icon: Star, title: "Premium Products", desc: "We only use high-grade cleaning & detailing products." },
    { icon: CheckCircle, title: "Professional Staff", desc: "Trained & experienced technicians every time." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Premium car wash" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <Badge className="mb-5 bg-primary/20 text-primary border-primary/30 text-sm px-3 py-1">
              Premium Car Care
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Your Car Deserves<br />
              <span className="text-primary">the Best Care</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Professional car wash services that make your car shine like new. Book your appointment in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/booking">
                <Button size="lg" className="px-8 text-base font-semibold" data-testid="button-hero-book">
                  Book Your Wash
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="px-8 text-base border-white/30 text-white bg-white/10 hover:bg-white/20" data-testid="button-hero-services">
                  View Services
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">Professional Staff</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">{avgRating} Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Satisfaction Guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-3">
              <Droplets className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Popular Services</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Choose the best service for your vehicle from our carefully curated options.
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
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
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  data-testid={`card-service-home-${service.id}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={service.imageUrl || serviceImages[service.name] || HERO_IMAGE}
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
                      <span className="font-bold text-primary text-sm">From ${service.price}</span>
                    </div>
                    <Link href={`/booking?serviceId=${service.id}`}>
                      <Button size="sm" className="w-full text-xs" data-testid={`button-book-home-${service.id}`}>
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/services">
              <Button variant="outline" size="lg" data-testid="button-view-all-services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Us?</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              We're committed to delivering the best car wash experience every single visit.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Happy Customers" },
              { value: "4.9", label: "Average Rating" },
              { value: "4", label: "Service Types" },
              { value: "7", label: "Days a Week" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-3xl md:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-primary-foreground/70 mt-1 text-sm">{stat.label}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What Our Clients Say</h2>
          </motion.div>

          {reviewsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
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
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <StarRating rating={review.rating} />
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">"{review.comment}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{review.customerName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground text-sm">{review.customerName}</p>
                      {review.serviceName && <p className="text-xs text-primary">{review.serviceName}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/reviews">
              <Button variant="outline" size="lg" data-testid="button-view-all-reviews">
                See All Reviews <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BOOKING CTA ── */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Shine?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Book your appointment now and give your car the care it deserves. Fast, easy, guaranteed.
            </p>
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="px-10 text-base font-semibold" data-testid="button-cta-book">
                Book Now — It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Droplets className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-card-foreground text-lg">Car Wash Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">Professional car wash services that make your car shine like new.</p>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Quick Links</h4>
              <div className="space-y-2">
                {["/services", "/booking", "/reviews", "/about"].map((href) => (
                  <Link key={href} href={href} className="block text-sm text-muted-foreground hover:text-primary transition-colors capitalize">
                    {href.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>123 Car Street, Prishtina</span></div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>+383 44 123 456</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>Mon–Sun: 08:00–19:00</span></div>
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
