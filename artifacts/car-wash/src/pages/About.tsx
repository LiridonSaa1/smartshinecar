import { Navbar } from "@/components/layout/Navbar";
import { useGetSettings } from "@workspace/api-client-react";
import { useContentSection } from "@/lib/useContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DEFAULT_ABOUT_FEATURES = {
  items: [
    { icon: "🛡️", title: "Satisfaction Guaranteed", desc: "100% satisfaction or we redo it free" },
    { icon: "⚡", title: "Fast & Efficient", desc: "Quick turnaround without cutting corners" },
    { icon: "⭐", title: "Premium Products", desc: "We use only high-grade cleaning products" },
    { icon: "💧", title: "Water Efficient", desc: "Eco-conscious water usage techniques" },
  ],
};

export default function About() {
  const { data: settings } = useGetSettings();
  const featuresContent = useContentSection("about_features", DEFAULT_ABOUT_FEATURES) as typeof DEFAULT_ABOUT_FEATURES;
  const features = featuresContent?.items ?? DEFAULT_ABOUT_FEATURES.items;

  const days = settings?.workingDays ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <MapPin className="h-4 w-4" />
                About Us
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                About {settings?.businessName ?? "Car Wash Pro"}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We are dedicated to giving your vehicle the premium care it deserves. Since our founding, we've served thousands of satisfied customers with reliable, high-quality car wash services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4 text-2xl">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Info */}
        <section className="py-16 bg-primary/5 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Info */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-foreground mb-8">Contact & Location</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-muted-foreground">{settings?.address ?? "123 Main Street"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a href={`tel:${settings?.phone}`} className="text-primary hover:underline">{settings?.phone ?? "+383 44 123 456"}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href={`mailto:${settings?.email}`} className="text-primary hover:underline">{settings?.email ?? "info@carwashpro.com"}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Working Hours</p>
                      <p className="text-muted-foreground">{days.join(", ")}</p>
                      <p className="text-muted-foreground">{settings?.openTime ?? "08:00"} – {settings?.closeTime ?? "19:00"}</p>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="mt-8 rounded-2xl overflow-hidden border border-border h-48 bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{settings?.address ?? "123 Main Street"}</p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold text-foreground mb-8">Send Us a Message</h2>
                <form onSubmit={handleContact} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Name</label>
                      <Input data-testid="input-contact-name" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email</label>
                      <Input data-testid="input-contact-email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subject</label>
                    <Input data-testid="input-contact-subject" placeholder="How can we help?" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Message</label>
                    <Textarea data-testid="input-contact-message" placeholder="Write your message..." rows={5} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg" data-testid="button-contact-submit">
                    Send Message
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
