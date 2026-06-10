import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Clock, DollarSign, ArrowRight, Droplets } from "lucide-react";
import { motion } from "framer-motion";

const serviceImages: Record<string, string> = {
  "Exterior Wash": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80",
  "Interior Cleaning": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  "Full Wash": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80",
  "Detailing": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
};

export default function Services() {
  const { data: services, isLoading } = useListServices();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Droplets className="h-4 w-4" />
                Our Services
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Premium Car Care Services
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From a quick exterior rinse to a full premium detailing — we have the perfect service for your car.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services?.filter(s => s.isActive).map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    data-testid={`card-service-${service.id}`}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={service.imageUrl || serviceImages[service.name] || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80"}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        From ${service.price}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-card-foreground mb-2">{service.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {service.description || "Professional car wash service with high-quality products."}
                      </p>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{service.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span>${service.price}</span>
                        </div>
                      </div>
                      <Link href={`/booking?serviceId=${service.id}`}>
                        <Button className="w-full group/btn" data-testid={`button-book-${service.id}`}>
                          Book This Service
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <>
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Droplets className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-card-foreground">Car Wash Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Car Wash Pro. All rights reserved.</p>
        </div>
      </footer>
      <FloatingWhatsApp />
    </>
  );
}
