import { useState, useRef, useCallback, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { CookieBanner } from "@/components/ui/CookieBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Images, X, ChevronLeft, ChevronRight, ArrowRight, Sparkles, MoveHorizontal } from "lucide-react";
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

const FEATURED_SLIDES = [
  { id: 0, label: "Full Exterior Detail", before: galleryItems[0].before, after: galleryItems[0].after },
  { id: 1, label: "Paint Correction & Polish", before: galleryItems[2].before, after: galleryItems[2].after },
  { id: 2, label: "Interior Deep Clean", before: galleryItems[1].before, after: galleryItems[1].after },
];

/* ─── Drag-to-reveal Before/After Slider ─────────────────────────── */
function BeforeAfterSlider({ before, after, label }: { before: string; after: string; label: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updatePos(e.clientX); };
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; updatePos(e.touches[0].clientX); };

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX); };
    const onTouch = (e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden select-none cursor-col-resize shadow-2xl"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After (base layer — full width) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />

      {/* Before (clipped to left side) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${100 / (pos / 100 || 0.001)}%`, maxWidth: "none" }} draggable={false} />
      </div>

      {/* Divider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)]" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white shadow-xl flex items-center justify-center">
          <MoveHorizontal className="h-5 w-5 text-gray-700" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
        AFTER
      </div>

      {/* Title */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

/* ─── Gallery card (toggle, existing) ───────────────────────────── */
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
        <div
          className="absolute top-3 left-3 flex rounded-full overflow-hidden border border-white/30 text-xs font-semibold"
          onClick={(e) => { e.stopPropagation(); setMode(m => m === "after" ? "before" : "after"); }}
        >
          <button className={`px-3 py-1 transition-colors ${mode === "before" ? "bg-white text-black" : "bg-black/40 text-white"}`}>Before</button>
          <button className={`px-3 py-1 transition-colors ${mode === "after" ? "bg-white text-black" : "bg-black/40 text-white"}`}>After</button>
        </div>
        <Badge className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs border-0">{item.category}</Badge>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-semibold text-sm">{item.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Lightbox ───────────────────────────────────────────────────── */
function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: typeof galleryItems; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const item = items[index];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <X className="h-6 w-6" />
        </button>
        <div className="rounded-2xl overflow-hidden">
          <BeforeAfterSlider before={item.before} after={item.after} label={item.title} />
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

/* ─── Page ───────────────────────────────────────────────────────── */
export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const filtered = activeCategory === "All" ? galleryItems : galleryItems.filter(i => i.category === activeCategory);
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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Before & After Results</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Drag the handle left and right to see the transformation our premium valeting service makes.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Featured Before/After Slider ─────────────────────────── */}
        <section className="py-16" style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 60%, #0a1845 100%)" }}>
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Drag to Reveal
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">See the difference</h2>
              <p className="text-white/60 text-[15px]">Drag the white handle to compare before and after</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <BeforeAfterSlider
                    before={FEATURED_SLIDES[featuredIdx].before}
                    after={FEATURED_SLIDES[featuredIdx].after}
                    label={FEATURED_SLIDES[featuredIdx].label}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Slide selector */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {FEATURED_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setFeaturedIdx(i)}
                  className={`rounded-full text-sm font-semibold px-4 py-1.5 transition-all ${i === featuredIdx ? "bg-white text-[#0a0f2e]" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
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

      {/* Lightbox — also uses the drag slider */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox items={filtered} index={lightboxIndex} onClose={closeLightbox} onPrev={prevItem} onNext={nextItem} />
        )}
      </AnimatePresence>
      <FloatingWhatsApp />
      <CookieBanner />
    </div>
  );
}
