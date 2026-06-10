import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Images, X, ChevronLeft, ChevronRight, ArrowRight, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const galleryItems = [
  {
    id: 1,
    category: "Exterior Wash",
    title: "Full Exterior Detail",
    before: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=700&q=80",
    after: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=700&q=80",
  },
  {
    id: 2,
    category: "Interior Clean",
    title: "Interior Deep Clean",
    before: "https://images.unsplash.com/photo-1547892881-302ee0df1a1a?w=700&q=80",
    after: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",
  },
  {
    id: 3,
    category: "Detailing",
    title: "Paint Correction & Polish",
    before: "https://images.unsplash.com/photo-1629389468754-9e0c45fbd9b8?w=700&q=80",
    after: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=700&q=80",
  },
  {
    id: 4,
    category: "Full Wash",
    title: "Complete Full Wash",
    before: "https://images.unsplash.com/photo-1589824904134-891ab64532f1?w=700&q=80",
    after: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=700&q=80",
  },
  {
    id: 5,
    category: "Detailing",
    title: "Luxury Detailing",
    before: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80",
    after: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=700&q=80",
  },
  {
    id: 6,
    category: "Exterior Wash",
    title: "SUV Exterior Wash",
    before: "https://images.unsplash.com/photo-1569171356-7e24c0b12e77?w=700&q=80",
    after: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=80",
  },
  {
    id: 7,
    category: "Interior Clean",
    title: "Seat & Upholstery Clean",
    before: "https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=700&q=80",
    after: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=80",
  },
  {
    id: 8,
    category: "Full Wash",
    title: "Sports Car Full Treatment",
    before: "https://images.unsplash.com/photo-1471479917193-f00955256257?w=700&q=80",
    after: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=700&q=80",
  },
];

const CATEGORIES = ["All", "Exterior Wash", "Interior Clean", "Detailing", "Full Wash"];

type GalleryMode = "after" | "before";

function GalleryCard({ item, onClick }: { item: typeof galleryItems[0]; onClick: () => void }) {
  const [mode, setMode] = useState<GalleryMode>("after");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mode === "after" ? item.after : item.before}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Toggle */}
        <div
          className="absolute top-3 left-3 flex rounded-full overflow-hidden border border-white/30 text-xs font-semibold"
          onClick={(e) => { e.stopPropagation(); setMode(m => m === "after" ? "before" : "after"); }}
        >
          <button
            className={`px-3 py-1 transition-colors ${mode === "before" ? "bg-white text-black" : "bg-black/40 text-white"}`}
          >Before</button>
          <button
            className={`px-3 py-1 transition-colors ${mode === "after" ? "bg-white text-black" : "bg-black/40 text-white"}`}
          >After</button>
        </div>

        <Badge className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs border-0">
          {item.category}
        </Badge>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-semibold text-sm">{item.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: typeof galleryItems;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  const [mode, setMode] = useState<GalleryMode>("after");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <div className="relative rounded-2xl overflow-hidden aspect-video">
          <img src={mode === "after" ? item.after : item.before} alt={item.title} className="w-full h-full object-cover" />
          <div
            className="absolute top-4 left-4 flex rounded-full overflow-hidden border border-white/30 text-sm font-semibold"
          >
            <button onClick={() => setMode("before")} className={`px-4 py-1.5 transition-colors ${mode === "before" ? "bg-white text-black" : "bg-black/40 text-white"}`}>Before</button>
            <button onClick={() => setMode("after")} className={`px-4 py-1.5 transition-colors ${mode === "after" ? "bg-white text-black" : "bg-black/40 text-white"}`}>After</button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-white font-semibold">{item.title}</p>
            <p className="text-white/60 text-sm">{item.category}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onPrev} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={onNext} className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(i => i.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevItem = () => setLightboxIndex(i => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length));
  const nextItem = () => setLightboxIndex(i => (i === null ? 0 : (i + 1) % filtered.length));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-primary/5 border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Images className="h-4 w-4" />
                Gallery
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Before & After Results
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See the transformation with your own eyes. Toggle between Before and After to see the difference our premium services make.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter tabs */}
        <section className="py-8 border-b border-border sticky top-16 bg-background/95 backdrop-blur z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 flex-wrap justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item, idx) => (
                <GalleryCard key={item.id} item={item} onClick={() => openLightbox(idx)} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready for Your Transformation?</h2>
            <p className="text-white/80 mb-7 max-w-md mx-auto">Book your appointment today and see the difference yourself.</p>
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="px-8 font-semibold">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevItem}
            onNext={nextItem}
          />
        )}
      </AnimatePresence>
      <FloatingWhatsApp />
    </div>
  );
}
