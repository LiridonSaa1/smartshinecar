import { Navbar } from "@/components/layout/Navbar";
import { useGetSettings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Shield, Zap, Star, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Contact() {
  const { data: settings } = useGetSettings();

  const hours = settings
    ? `${settings.openTime} – ${settings.closeTime}`
    : "08:00 – 19:00";

  const days = settings?.workingDays?.join(", ") ?? "Mon – Sun";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
  };

  const info = [
    {
      icon: MapPin,
      label: "Our Location",
      value: settings?.address ?? "123 Car Street, Prishtina, Kosovo",
      sub: "Come visit us anytime during working hours",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings?.phone ?? "+383 44 123 456",
      sub: "Call us to book or ask questions",
      href: `tel:${settings?.phone ?? "+38344123456"}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email ?? "info@carwashpro.com",
      sub: "We reply within 24 hours",
      href: `mailto:${settings?.email ?? "info@carwashpro.com"}`,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: hours,
      sub: days,
    },
  ];

  const services = [
    "Exterior Wash",
    "Interior Cleaning",
    "Full Wash",
    "Premium Detailing",
    "Other / Question",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Phone className="h-4 w-4" />
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a question or want to book a service? We're here to help. Reach out and we'll get back to you as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {info.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="font-semibold text-card-foreground hover:text-primary transition-colors block">
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-card-foreground">{item.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form + Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-foreground mb-2">Send a Message</h2>
                <p className="text-muted-foreground mb-6">Fill in the form and we'll respond within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">First Name *</label>
                      <Input data-testid="input-contact-first" placeholder="John" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Last Name *</label>
                      <Input data-testid="input-contact-last" placeholder="Doe" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email *</label>
                    <Input data-testid="input-contact-email" type="email" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone</label>
                    <Input data-testid="input-contact-phone" type="tel" placeholder="+383 44 000 000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Service of Interest</label>
                    <Select>
                      <SelectTrigger data-testid="select-contact-service">
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message *</label>
                    <Textarea
                      data-testid="input-contact-message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" data-testid="button-contact-submit">
                    Send Message
                  </Button>
                </form>
              </motion.div>

              {/* Map + Extra Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
                {/* Map placeholder */}
                <div className="rounded-2xl overflow-hidden border border-border bg-muted h-64 flex flex-col items-center justify-center gap-3">
                  <MapPin className="h-10 w-10 text-primary" />
                  <div className="text-center">
                    <p className="font-semibold text-foreground">{settings?.businessName ?? "Car Wash Pro"}</p>
                    <p className="text-sm text-muted-foreground">{settings?.address ?? "123 Car Street, Prishtina"}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address ?? "Car Wash Pro Prishtina")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>

                {/* Why us quick cards */}
                <div className="space-y-3">
                  {[
                    { icon: Shield, title: "Satisfaction Guaranteed", desc: "100% happy or we redo it for free." },
                    { icon: Zap, title: "Quick Response", desc: "We reply within 24 hours to all enquiries." },
                    { icon: Star, title: "5-Star Service", desc: "Rated 4.6/5 by our customers." },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  );
}
