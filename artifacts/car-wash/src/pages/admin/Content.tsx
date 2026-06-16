import { AdminLayout } from "@/components/layout/AdminLayout";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Car, Sparkles, Star, Phone, MapPin, Wrench, ListChecks,
  Image, Check, Loader2, Plus, Trash2, ChevronRight,
  GalleryHorizontal, Info, BarChart3, Layers, Home,
  Contact, Shield, Edit2, X,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

type GalleryCar = { id: string; make: string; model: string; year: number; image: string; service: string; };

const API = "/api/content";

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem("admin_token");
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...extra };
}

function fetchSection(key: string) {
  return fetch(`${API}/${key}`).then(r => r.ok ? r.json() : null);
}

function saveSection(key: string, body: unknown) {
  return fetch(`${API}/${key}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  }).then(r => { if (!r.ok) throw new Error("Save failed"); return r.json(); });
}

function useSection<T>(key: string, fallback: T) {
  return useQuery<T>({
    queryKey: ["admin-content", key],
    queryFn: async () => {
      const d = await fetchSection(key);
      return d ?? fallback;
    },
    staleTime: 10_000,
  });
}

function useSave(key: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) => saveSection(key, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-content", key] }),
  });
}

function SaveBar({ dirty, saving, onSave }: { dirty: boolean; saving: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-6">
      {dirty
        ? <span className="text-sm text-amber-600 font-medium">Unsaved changes</span>
        : <span className="text-sm text-gray-400">All changes saved</span>}
      <Button onClick={onSave} disabled={!dirty || saving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[110px]">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : <><Check className="h-4 w-4 mr-2" />Save</>}
      </Button>
    </div>
  );
}

// ─── HERO SLIDES ──────────────────────────────────────────────────────────────
const DEFAULT_HERO = {
  slides: [
    { headline: "Premium Car\nValeting Service", sub: "Professional valeting that restores your vehicle to showroom condition. Serving Guildford and surrounding areas.", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85" },
    { headline: "Showroom Finish,\nEvery Time", sub: "Deep paint correction and interior detailing to restore your vehicle to pristine condition.", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85" },
    { headline: "Trusted by\nThousands of Drivers", sub: "Over 25 years of experience. Over 5,000 happy customers. Experience the Smart Shine difference.", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85" },
  ],
  btn1Label: "Book Your Valet",
  btn1Link: "/booking",
  btn2Label: "Get Free Quote",
  btn2Link: "/contact",
};

function HeroSlidesEditor() {
  const { data, isLoading } = useSection("hero_slides", DEFAULT_HERO);
  const save = useSave("hero_slides");
  const [local, setLocal] = useState(DEFAULT_HERO);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_HERO); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const updateSlide = (i: number, field: "headline" | "sub" | "image", val: string) => {
    const slides = [...local.slides]; slides[i] = { ...slides[i], [field]: val }; mark({ ...local, slides });
  };
  const addSlide = () => mark({ ...local, slides: [...local.slides, { headline: "", sub: "", image: "" }] });
  const removeSlide = (i: number) => mark({ ...local, slides: local.slides.filter((_, j) => j !== i) });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Slides</p>
          <Button size="sm" variant="outline" onClick={addSlide} className="text-xs h-8 flex-shrink-0"><Plus className="h-3.5 w-3.5 mr-1" />Add slide</Button>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {local.slides.map((slide, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slide {i + 1}</span>
                <Button size="icon" variant="ghost" onClick={() => removeSlide(i)} className="text-gray-400 hover:text-red-500 h-7 w-7"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Headline (use \n for line break)</label>
                <Textarea value={slide.headline} rows={2} onChange={e => updateSlide(i, "headline", e.target.value)} className="text-sm font-bold" placeholder="Premium Car\nValeting Service" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                <Textarea value={slide.sub} rows={2} onChange={e => updateSlide(i, "sub", e.target.value)} className="text-sm" placeholder="Subtitle text…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Background image</label>
                <ImageUpload value={slide.image} onChange={val => updateSlide(i, "image", val)} placeholder="https://images.unsplash.com/…" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl p-4 bg-blue-50/50 space-y-3">
        <p className="text-sm font-semibold text-gray-700 mb-1">Carousel buttons</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Button 1 — label</label><Input value={local.btn1Label ?? ""} onChange={e => mark({ ...local, btn1Label: e.target.value })} placeholder="Book Your Valet" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Button 1 — link</label><Input value={local.btn1Link ?? ""} onChange={e => mark({ ...local, btn1Link: e.target.value })} placeholder="/booking" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Button 2 — label</label><Input value={local.btn2Label ?? ""} onChange={e => mark({ ...local, btn2Label: e.target.value })} placeholder="Get Free Quote" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Button 2 — link</label><Input value={local.btn2Link ?? ""} onChange={e => mark({ ...local, btn2Link: e.target.value })} placeholder="/contact" /></div>
        </div>
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── ABOUT US ─────────────────────────────────────────────────────────────────
const DEFAULT_ABOUT = {
  typewriter: "Car valeting in Guildford and surrounding area",
  heading: "About us",
  paragraph: "Smart Shine Car Valeting Centre is a well-established business with over 25 years of experience in the valeting industry. We pride ourselves on our commitment to provide professional and high-class services to each and every client. We provide an extensive range of valeting services, including a full interior and exterior valet. Smart Shine endeavours to place customer satisfaction at the centre of all work carried out. We offer both part valet and full valet services.",
};

function AboutUsEditor() {
  const { data, isLoading } = useSection("about_us", DEFAULT_ABOUT);
  const save = useSave("about_us");
  const [local, setLocal] = useState(DEFAULT_ABOUT);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_ABOUT); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Typewriter animated text</label>
        <Input value={local.typewriter} onChange={e => mark({ ...local, typewriter: e.target.value })} placeholder="Car valeting in Guildford and surrounding area" />
        <p className="text-xs text-gray-400 mt-1">This text types itself out on the homepage banner.</p>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} placeholder="About us" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">About us paragraph</label>
        <Textarea value={local.paragraph} rows={6} onChange={e => mark({ ...local, paragraph: e.target.value })} className="text-sm" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────
const DEFAULT_STATS = {
  items: [
    { value: "25+", label: "Years Experience", icon: "🏆" },
    { value: "5,000+", label: "Happy Customers", icon: "😊" },
    { value: "100%", label: "Fully Insured", icon: "🛡️" },
    { value: "5★", label: "Rated Service", icon: "⭐" },
  ],
};

function StatsEditor() {
  const { data, isLoading } = useSection("stats_cards", DEFAULT_STATS);
  const save = useSave("stats_cards");
  const [local, setLocal] = useState(DEFAULT_STATS);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_STATS); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const updateItem = (i: number, field: "value" | "label" | "icon", val: string) => {
    const items = [...local.items]; items[i] = { ...items[i], [field]: val }; mark({ ...local, items });
  };
  const addItem = () => mark({ ...local, items: [...local.items, { value: "", label: "", icon: "⭐" }] });
  const removeItem = (i: number) => mark({ ...local, items: local.items.filter((_, j) => j !== i) });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Stats cards shown below the About Us section.</p>
        <Button size="sm" variant="outline" onClick={addItem} className="text-xs h-8 flex-shrink-0"><Plus className="h-3.5 w-3.5 mr-1" />Add stat</Button>
      </div>
      <div className="space-y-2">
        {local.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center border border-gray-100 rounded-xl p-3 bg-gray-50">
            <Input value={item.icon} onChange={e => updateItem(i, "icon", e.target.value)} className="w-14 text-center text-lg flex-shrink-0" placeholder="🏆" />
            <Input value={item.value} onChange={e => updateItem(i, "value", e.target.value)} className="w-24 text-sm font-bold flex-shrink-0" placeholder="25+" />
            <Input value={item.label} onChange={e => updateItem(i, "label", e.target.value)} className="flex-1 text-sm" placeholder="Years Experience" />
            <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── COMPLETE VALETING ────────────────────────────────────────────────────────
const DEFAULT_COMPLETE = {
  badge: "Our Services",
  heading: "A complete valeting service",
  paragraph1: "At Smart Shine Car Valeting Centre we value our customers and we strive to satisfy your individual requirements. We are happy to spend as much time as necessary on your car to ensure that you receive the standard of service that you expect and deserve.",
  paragraph2: "Based in Guildford, we welcome both private and commercial clients from Godalming, Woking and the surrounding areas. We have a wide range of packages to choose from, at competitive prices to suit any budget. We also offer car scratch removal and machine polish.",
  image: "",
};

function CompleteValetingEditor() {
  const { data, isLoading } = useSection("complete_valeting", DEFAULT_COMPLETE);
  const save = useSave("complete_valeting");
  const [local, setLocal] = useState(DEFAULT_COMPLETE);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_COMPLETE); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-4">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge label</label><Input value={local.badge} onChange={e => mark({ ...local, badge: e.target.value })} placeholder="Our Services" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label><Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} placeholder="A complete valeting service" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">First paragraph</label><Textarea value={local.paragraph1} rows={4} onChange={e => mark({ ...local, paragraph1: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Second paragraph</label><Textarea value={local.paragraph2} rows={4} onChange={e => mark({ ...local, paragraph2: e.target.value })} className="text-sm" /></div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section photo</label>
        <p className="text-xs text-gray-400 mb-2">Leave empty to use the default photo already on the website.</p>
        <ImageUpload value={local.image ?? ""} onChange={val => mark({ ...local, image: val })} />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── CAR SERVICES ─────────────────────────────────────────────────────────────
const DEFAULT_CAR_SERVICES = {
  subtitle: "From a quick hand wash to full paint correction — we cover everything your vehicle needs.",
  items: [
    { label: "Car & Vehicle Valeting", icon: "🚗" }, { label: "Car Buffing", icon: "✨" },
    { label: "Car Detailing", icon: "🔍" }, { label: "Car Scratch Repairs", icon: "🛠️" },
    { label: "Car Valeting", icon: "🧽" }, { label: "Car Wash", icon: "💧" },
    { label: "Commercial Vehicle Valeting", icon: "🚐" }, { label: "Deep Cleaning", icon: "🧹" },
    { label: "Dent Removal", icon: "🔧" }, { label: "Exterior Valet", icon: "🌟" },
    { label: "Hand Car Wash", icon: "🤲" }, { label: "Interior Valet", icon: "💺" },
    { label: "Machine Polish", icon: "⚙️" }, { label: "Mini Valets", icon: "⚡" },
    { label: "Private Vehicle Valeting", icon: "🔑" }, { label: "Stain Removal Services", icon: "🪣" },
    { label: "Wheel Cleaning", icon: "🔵" },
  ],
};

function CarServicesEditor() {
  const { data, isLoading } = useSection("car_vehicle_services", DEFAULT_CAR_SERVICES);
  const save = useSave("car_vehicle_services");
  const [local, setLocal] = useState(DEFAULT_CAR_SERVICES);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CAR_SERVICES); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const addItem = () => mark({ ...local, items: [...local.items, { label: "", icon: "🚗" }] });
  const removeItem = (i: number) => mark({ ...local, items: local.items.filter((_, j) => j !== i) });
  const updateItem = (i: number, field: "label" | "icon", val: string) => {
    const items = [...local.items]; items[i] = { ...items[i], [field]: val }; mark({ ...local, items });
  };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section subtitle</label>
        <Textarea value={local.subtitle} rows={2} onChange={e => mark({ ...local, subtitle: e.target.value })} className="text-sm" />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Services ({local.items.length})</label>
          <Button size="sm" variant="outline" onClick={addItem} className="text-xs h-8"><Plus className="h-3.5 w-3.5 mr-1" />Add service</Button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {local.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input value={item.icon} onChange={e => updateItem(i, "icon", e.target.value)} className="w-16 text-center text-lg" placeholder="🚗" />
              <Input value={item.label} onChange={e => updateItem(i, "label", e.target.value)} className="flex-1 text-sm" placeholder="Service name" />
              <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────
const DEFAULT_WHY = {
  subtitle: "Over 25 years of experience, competitive prices, and results you can see.",
  image: "",
  cards: [
    { emoji: "🏆", title: "25 Years Experience", desc: "Over two decades of professional valeting expertise in Guildford" },
    { emoji: "⭐", title: "5-Star Rated", desc: "Consistently top-rated by hundreds of happy customers" },
    { emoji: "🛡️", title: "Fully Insured", desc: "All work fully insured for your complete peace of mind" },
    { emoji: "✅", title: "Showroom Standards", desc: "Meticulous attention to detail on every single vehicle" },
    { emoji: "💷", title: "Competitive Rates", desc: "Premium quality service at prices to suit any budget" },
    { emoji: "🚐", title: "Private & Commercial", desc: "Cars, vans, and commercial vehicles all welcome" },
    { emoji: "🔧", title: "Dent & Scratch Repair", desc: "We also handle dent removal and machine polish" },
    { emoji: "🕐", title: "Mon – Sun 08–19", desc: "Open 7 days a week — book at a time that suits you" },
  ],
};

function WhyUsEditor() {
  const { data, isLoading } = useSection("why_choose_us", DEFAULT_WHY);
  const save = useSave("why_choose_us");
  const [local, setLocal] = useState(DEFAULT_WHY);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_WHY); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const addCard = () => mark({ ...local, cards: [...local.cards, { emoji: "⭐", title: "", desc: "" }] });
  const removeCard = (i: number) => mark({ ...local, cards: local.cards.filter((_, j) => j !== i) });
  const updateCard = (i: number, field: "emoji" | "title" | "desc", val: string) => {
    const cards = [...local.cards]; cards[i] = { ...cards[i], [field]: val }; mark({ ...local, cards });
  };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <div className="mb-6"><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section subtitle</label><Textarea value={local.subtitle} rows={2} onChange={e => mark({ ...local, subtitle: e.target.value })} className="text-sm" /></div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section photo</label>
        <p className="text-xs text-gray-400 mb-2">Leave empty to use the default photo already on the website.</p>
        <ImageUpload value={local.image ?? ""} onChange={val => mark({ ...local, image: val })} />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Cards ({local.cards.length})</label>
          <Button size="sm" variant="outline" onClick={addCard} className="text-xs h-8"><Plus className="h-3.5 w-3.5 mr-1" />Add card</Button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {local.cards.map((card, i) => (
            <div key={i} className="flex gap-2 items-start border border-gray-100 rounded-xl p-3 bg-gray-50">
              <Input value={card.emoji} onChange={e => updateCard(i, "emoji", e.target.value)} className="w-14 text-center text-lg" placeholder="⭐" />
              <div className="flex-1 space-y-1.5">
                <Input value={card.title} onChange={e => updateCard(i, "title", e.target.value)} className="text-sm font-semibold" placeholder="Card title" />
                <Input value={card.desc} onChange={e => updateCard(i, "desc", e.target.value)} className="text-sm" placeholder="Short description" />
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeCard(i)} className="text-gray-400 hover:text-red-500 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── REVIEWS HEADER + CARDS ───────────────────────────────────────────────────
const DEFAULT_REVIEWS_HEADER = { title: "What our customers say?", subtitle: "Real reviews from real customers" };

type Review = { id?: number; customerName: string; rating: number; comment: string; serviceName?: string };
const EMPTY_REVIEW: Review = { customerName: "", rating: 5, comment: "", serviceName: "" };

function ReviewsHeaderEditor() {
  const qc = useQueryClient();

  // Heading content
  const { data: headingData, isLoading: headingLoading } = useSection("customers_say", DEFAULT_REVIEWS_HEADER);
  const saveHeading = useSave("customers_say");
  const [heading, setHeading] = useState(DEFAULT_REVIEWS_HEADER);
  const [headingDirty, setHeadingDirty] = useState(false);
  useEffect(() => { if (headingData) { setHeading(headingData as typeof DEFAULT_REVIEWS_HEADER); setHeadingDirty(false); } }, [headingData]);

  // Reviews list
  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["admin-reviews"],
    queryFn: () => fetch("/api/reviews").then(r => r.json()),
  });

  // Add new review state
  const [adding, setAdding] = useState(false);
  const [newReview, setNewReview] = useState<Review>(EMPTY_REVIEW);
  const [saving, setSaving] = useState(false);

  // Edit review state
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Review>(EMPTY_REVIEW);
  const [editSaving, setEditSaving] = useState(false);

  const handleAdd = async () => {
    if (!newReview.customerName.trim() || !newReview.comment.trim()) return;
    setSaving(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newReview, rating: Number(newReview.rating) }),
    });
    setSaving(false);
    setNewReview(EMPTY_REVIEW);
    setAdding(false);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE", headers: authHeaders() });
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const startEdit = (r: Review) => { setEditId(r.id!); setEditData({ ...r }); };
  const cancelEdit = () => { setEditId(null); setEditData(EMPTY_REVIEW); };

  const handleUpdate = async () => {
    if (!editId || !editData.customerName.trim() || !editData.comment.trim()) return;
    setEditSaving(true);
    await fetch(`/api/reviews/${editId}`, {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ ...editData, rating: Number(editData.rating) }),
    });
    setEditSaving(false);
    setEditId(null);
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["reviews"] });
  };

  const isLoading = headingLoading || reviewsLoading;
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div className="space-y-6">
      {/* ── Heading text ── */}
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Section heading</p>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Title</label><Input value={heading.title} onChange={e => { setHeading(h => ({ ...h, title: e.target.value })); setHeadingDirty(true); }} /></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label><Input value={heading.subtitle} onChange={e => { setHeading(h => ({ ...h, subtitle: e.target.value })); setHeadingDirty(true); }} /></div>
        <div className="flex justify-end pt-1">
          <Button size="sm" onClick={() => saveHeading.mutate(heading, { onSuccess: () => setHeadingDirty(false) })} disabled={!headingDirty || saveHeading.isPending} className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs min-w-[90px]">
            {saveHeading.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5 mr-1" />Save heading</>}
          </Button>
        </div>
      </div>

      {/* ── Review cards ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">Review cards ({reviews?.length ?? 0})</p>
          <Button size="sm" variant="outline" onClick={() => { setAdding(a => !a); setNewReview(EMPTY_REVIEW); }} className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />{adding ? "Cancel" : "Add review"}
          </Button>
        </div>

        {/* Add form */}
        {adding && (
          <div className="border border-blue-200 bg-blue-50/60 rounded-xl p-4 mb-3 space-y-2">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">New review</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Customer name</label>
                <Input value={newReview.customerName} onChange={e => setNewReview(r => ({ ...r, customerName: e.target.value }))} placeholder="John Smith" className="text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Service (optional)</label>
                <Input value={newReview.serviceName ?? ""} onChange={e => setNewReview(r => ({ ...r, serviceName: e.target.value }))} placeholder="Full Valet" className="text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Rating (1–5)</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setNewReview(r => ({ ...r, rating: s }))}
                    className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${s <= newReview.rating ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Review text</label>
              <Textarea value={newReview.comment} onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))} rows={3} placeholder="Customer review…" className="text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="text-xs h-8">Cancel</Button>
              <Button size="sm" onClick={handleAdd} disabled={saving || !newReview.customerName.trim() || !newReview.comment.trim()} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 min-w-[80px]">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Plus className="h-3.5 w-3.5 mr-1" />Add</>}
              </Button>
            </div>
          </div>
        )}

        {/* Review list */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {(!reviews || reviews.length === 0) && (
            <div className="text-sm text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-xl">No reviews yet. Add one above.</div>
          )}
          {reviews?.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl bg-white overflow-hidden">
              {editId === r.id ? (
                /* Edit mode */
                <div className="p-4 space-y-2 bg-amber-50/60 border-amber-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Customer name</label><Input value={editData.customerName} onChange={e => setEditData(d => ({ ...d, customerName: e.target.value }))} className="text-sm" /></div>
                    <div><label className="block text-xs font-semibold text-gray-600 mb-1">Service (optional)</label><Input value={editData.serviceName ?? ""} onChange={e => setEditData(d => ({ ...d, serviceName: e.target.value }))} className="text-sm" /></div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setEditData(d => ({ ...d, rating: s }))}
                          className={`h-8 w-8 rounded-lg text-sm font-bold transition-colors ${s <= editData.rating ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Review text</label><Textarea value={editData.comment} onChange={e => setEditData(d => ({ ...d, comment: e.target.value }))} rows={3} className="text-sm" /></div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-xs h-8">Cancel</Button>
                    <Button size="sm" onClick={handleUpdate} disabled={editSaving} className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8 min-w-[80px]">
                      {editSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5 mr-1" />Save</>}
                    </Button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start gap-3 p-3">
                  <div className="h-9 w-9 rounded-full bg-[#0a0f2e] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-sm">{r.customerName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{r.customerName}</span>
                      {r.serviceName && <span className="text-xs text-blue-600 font-medium">{r.serviceName}</span>}
                      <span className="text-xs text-yellow-500 font-semibold">{"★".repeat(r.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">"{r.comment}"</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => startEdit(r)} className="h-7 w-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" title="Edit">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => r.id && handleDelete(r.id)} className="h-7 w-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GET IN TOUCH ─────────────────────────────────────────────────────────────
const DEFAULT_GET_IN_TOUCH = {
  description: "Call Smart Shine Car Valeting Centre for a car valeting or detailing in Guildford",
  phones: [{ number: "07717 310 046" }, { number: "01483 236 060" }],
  hours: "Mon – Sun · 08:00 – 19:00",
};

function GetInTouchEditor() {
  const { data, isLoading } = useSection("get_in_touch", DEFAULT_GET_IN_TOUCH);
  const save = useSave("get_in_touch");
  const [local, setLocal] = useState(DEFAULT_GET_IN_TOUCH);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_GET_IN_TOUCH); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const updatePhone = (i: number, val: string) => { const phones = [...local.phones]; phones[i] = { number: val }; mark({ ...local, phones }); };
  const addPhone = () => mark({ ...local, phones: [...local.phones, { number: "" }] });
  const removePhone = (i: number) => mark({ ...local, phones: local.phones.filter((_, j) => j !== i) });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Call-to-action description</label><Textarea value={local.description} rows={2} onChange={e => mark({ ...local, description: e.target.value })} className="text-sm" /></div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Phone numbers</label>
          <Button size="sm" variant="outline" onClick={addPhone} className="text-xs h-8"><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
        </div>
        <div className="space-y-2">
          {local.phones.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input value={p.number} onChange={e => updatePhone(i, e.target.value)} placeholder="07717 310 046" className="text-sm" />
              <Button size="icon" variant="ghost" onClick={() => removePhone(i)} className="text-gray-400 hover:text-red-500 h-9 w-9"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening hours text</label><Input value={local.hours} onChange={e => mark({ ...local, hours: e.target.value })} placeholder="Mon – Sun · 08:00 – 19:00" className="text-sm" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── CONTACT US ───────────────────────────────────────────────────────────────
const DEFAULT_CONTACT = {
  address: "Guildford, Surrey",
  phone: "07717 310 046 / 01483 236 060",
  email: "nazsalihi@me.com",
  hours: "Mon–Sun: 08:00 – 19:00",
};

function ContactUsEditor() {
  const { data, isLoading } = useSection("contact_us", DEFAULT_CONTACT);
  const save = useSave("contact_us");
  const [local, setLocal] = useState(DEFAULT_CONTACT);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CONTACT); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-4">
      <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 font-medium">These details appear in the footer and contact sections of the website.</p>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label><Input value={local.address} onChange={e => mark({ ...local, address: e.target.value })} placeholder="Guildford, Surrey" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone(s) — shown in footer</label><Input value={local.phone} onChange={e => mark({ ...local, phone: e.target.value })} placeholder="07717 310 046 / 01483 236 060" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label><Input value={local.email} onChange={e => mark({ ...local, email: e.target.value })} placeholder="info@smartshine.co.uk" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening hours</label><Input value={local.hours} onChange={e => mark({ ...local, hours: e.target.value })} placeholder="Mon–Sun: 08:00 – 19:00" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── ABOUT PAGE FEATURES ──────────────────────────────────────────────────────
const DEFAULT_ABOUT_FEATURES = {
  items: [
    { icon: "🛡️", title: "Satisfaction Guaranteed", desc: "100% satisfaction or we redo it free" },
    { icon: "⚡", title: "Fast & Efficient", desc: "Quick turnaround without cutting corners" },
    { icon: "⭐", title: "Premium Products", desc: "We use only high-grade cleaning products" },
    { icon: "💧", title: "Water Efficient", desc: "Eco-conscious water usage techniques" },
  ],
};

function AboutFeaturesEditor() {
  const { data, isLoading } = useSection("about_features", DEFAULT_ABOUT_FEATURES);
  const save = useSave("about_features");
  const [local, setLocal] = useState(DEFAULT_ABOUT_FEATURES);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_ABOUT_FEATURES); setDirty(false); } }, [data]);
  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const addItem = () => mark({ ...local, items: [...local.items, { icon: "⭐", title: "", desc: "" }] });
  const removeItem = (i: number) => mark({ ...local, items: local.items.filter((_, j) => j !== i) });
  const updateItem = (i: number, field: "icon" | "title" | "desc", val: string) => {
    const items = [...local.items]; items[i] = { ...items[i], [field]: val }; mark({ ...local, items });
  };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 mb-4">Feature cards shown in the "Why Choose Us" grid on the About page.</p>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-gray-700">Feature cards ({local.items.length})</label>
        <Button size="sm" variant="outline" onClick={addItem} className="text-xs h-8"><Plus className="h-3.5 w-3.5 mr-1" />Add card</Button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {local.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start border border-gray-100 rounded-xl p-3 bg-gray-50">
            <Input value={item.icon} onChange={e => updateItem(i, "icon", e.target.value)} className="w-14 text-center text-lg" placeholder="🛡️" />
            <div className="flex-1 space-y-1.5">
              <Input value={item.title} onChange={e => updateItem(i, "title", e.target.value)} className="text-sm font-semibold" placeholder="Feature title" />
              <Input value={item.desc} onChange={e => updateItem(i, "desc", e.target.value)} className="text-sm" placeholder="Short description" />
            </div>
            <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── GENERIC HERO SLIDES EDITOR FACTORY ───────────────────────────────────────
type HeroSlide = { image: string; headline: string; sub: string };
type HeroData = { slides: HeroSlide[] };

function makeHeroEditor(key: string, fallback: HeroData) {
  return function HeroEditor() {
    const { data, isLoading } = useSection(key, fallback);
    const save = useSave(key);
    const [local, setLocal] = useState(fallback);
    const [dirty, setDirty] = useState(false);
    useEffect(() => { if (data) { setLocal(data as HeroData); setDirty(false); } }, [data]);
    const mark = (v: HeroData) => { setLocal(v); setDirty(true); };
    const updateSlide = (i: number, field: keyof HeroSlide, val: string) =>
      mark({ ...local, slides: local.slides.map((s, idx) => idx === i ? { ...s, [field]: val } : s) });
    if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
    return (
      <div>
        <div className="space-y-6">
          {local.slides.map((slide, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">{i + 1}</div>
                <span className="text-sm font-semibold text-gray-700">Slide {i + 1}</span>
              </div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Headline</label>
                <Textarea value={slide.headline} rows={2} onChange={e => updateSlide(i, "headline", e.target.value)} className="text-sm" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle</label>
                <Textarea value={slide.sub} rows={3} onChange={e => updateSlide(i, "sub", e.target.value)} className="text-sm" /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Background image</label>
                <ImageUpload value={slide.image} onChange={val => updateSlide(i, "image", val)} /></div>
            </div>
          ))}
        </div>
        <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
      </div>
    );
  };
}

// ─── PRIVATE VALETING ─────────────────────────────────────────────────────────
const DEFAULT_PV_HERO: HeroData = { slides: [
  { image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85", headline: "Excellent Private Vehicle\nValeting Service in Guildford", sub: "At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting packages to suit all your requirements in the Guildford area. We also welcome customers from Godalming and Woking." },
  { image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85", headline: "Professional Valeting\nFor Every Vehicle", sub: "From a quick mini valet to a full premier package — we restore your vehicle to showroom condition. Fully insured, friendly and thorough service every time." },
  { image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85", headline: "Interior & Exterior\nValeting Specialists", sub: "Whether it's an interior deep clean or a full exterior polish — Smart Shine delivers showroom results every time. We also offer dent removal and machine polish." },
]};
const PvHeroEditor = makeHeroEditor("pv_hero", DEFAULT_PV_HERO);

const DEFAULT_PV_INTRO = { heading: "Excellent private vehicle valeting service in Guildford.", paragraph: "At Smart Shine Car Valeting Centre, we provide a wide variety of individually tailored valeting packages to suit all your requirements in the Guildford area. We also welcome customers from Godalming and Woking." };
function PvIntroEditor() {
  const { data, isLoading } = useSection("pv_intro", DEFAULT_PV_INTRO);
  const save = useSave("pv_intro");
  const [local, setLocal] = useState(DEFAULT_PV_INTRO);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_PV_INTRO); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_PV_INTRO) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Paragraph</label>
        <Textarea value={local.paragraph} rows={4} onChange={e => mark({ ...local, paragraph: e.target.value })} className="text-sm" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_PV_PACKAGES = { items: [
  { name: "Mini Valet", desc: "Exterior wash, leather dry, vacuum, window polish", price: "from £45.00" },
  { name: "Economy Valet", desc: "For new and well maintained cars", price: "from £120.00" },
  { name: "Premier Valet", desc: "To make your car look as good as new", price: "from £169.00" },
  { name: "Interior Valet", desc: "Full interior deep clean and treatment", price: "from £120.00" },
  { name: "Exterior Valet", desc: "Full exterior wash, polish and finish", price: "from £139.00" },
  { name: "Commercial Vehicle", desc: "Valeting service for commercial vehicles in Guildford", price: "Call for quote" },
]};
function PvPackagesEditor() {
  const { data, isLoading } = useSection("pv_packages", DEFAULT_PV_PACKAGES);
  const save = useSave("pv_packages");
  const [local, setLocal] = useState(DEFAULT_PV_PACKAGES);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_PV_PACKAGES); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_PV_PACKAGES) => { setLocal(v); setDirty(true); };
  const update = (i: number, field: string, val: string) => mark({ ...local, items: local.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">Edit the name, description and price for each package card.</p>
      <div className="space-y-3">
        {local.items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                <Input value={item.name} onChange={e => update(i, "name", e.target.value)} className="text-sm" /></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                <Input value={item.price} onChange={e => update(i, "price", e.target.value)} className="text-sm" /></div>
            </div>
            <div><label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <Input value={item.desc} onChange={e => update(i, "desc", e.target.value)} className="text-sm" /></div>
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_PV_BODY = { heading: "We can make your car shine", paragraph: "We understand that every car is different, which is why we offer car valeting packages tailored to your specific needs. We also offer a range of specialised services such as dent removal and paintwork restoration to ensure we bring your car back to its best. Whether it is the interior valeting or the exterior valeting of your car that needs attention, we can provide a thorough valet service — so why not give us a call today to find out more? We offer both full valet and part valet services. In addition to valeting, we also offer machine polish and car scratch removal.", image: "" };
function PvBodyEditor() {
  const { data, isLoading } = useSection("pv_body", DEFAULT_PV_BODY);
  const save = useSave("pv_body");
  const [local, setLocal] = useState(DEFAULT_PV_BODY);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_PV_BODY); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_PV_BODY) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Paragraph</label>
        <Textarea value={local.paragraph} rows={6} onChange={e => mark({ ...local, paragraph: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Image</label>
        <ImageUpload value={local.image ?? ""} onChange={url => mark({ ...local, image: url })} label="Upload section image" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── CAR DETAILING ────────────────────────────────────────────────────────────
const DEFAULT_CD_HERO: HeroData = { slides: [
  { image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85", headline: "Car Detailing Service\nin Guildford", sub: "Smart Shine Car Valeting Centre uses premium products to rejuvenate your car to showroom condition. Serving Guildford, Godalming, Woking and surrounding areas." },
  { image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85", headline: "Premium Products.\nShowroom Results.", sub: "From paintwork correction to scratch and dent removal — our car detailing service brings your vehicle back to its best, regardless of make or model." },
  { image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85", headline: "Interior & Exterior\nDetailing Specialists", sub: "Machine polish, clear coat correction, 3D hologram removal — we remove defects and reveal a flawless, defect-free surface every time." },
]};
const CdHeroEditor = makeHeroEditor("cd_hero", DEFAULT_CD_HERO);

const DEFAULT_CD_INTRO = { heading: "Are you in need of a car detailing service in Guildford?", paragraph: "Smart Shine Car Valeting Centre has an extensive range of products designed to rejuvenate your car. We use premium products allowing us to make your car look as new. We offer high-quality car detailing services in Guildford, Godalming, Woking and the surrounding areas.", btn1Label: "Get Free Quote", btn1Link: "/contact", btn2Label: "Call Us", btn2Link: "tel:07717310046" };
function CdIntroEditor() {
  const { data, isLoading } = useSection("cd_intro", DEFAULT_CD_INTRO);
  const save = useSave("cd_intro");
  const [local, setLocal] = useState(DEFAULT_CD_INTRO);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CD_INTRO); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_CD_INTRO) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Paragraph</label>
        <Textarea value={local.paragraph} rows={4} onChange={e => mark({ ...local, paragraph: e.target.value })} className="text-sm" /></div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pt-2">Action Buttons</p>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-semibold text-gray-700 mb-1">Button 1 — Label</label>
          <Input value={local.btn1Label ?? ""} onChange={e => mark({ ...local, btn1Label: e.target.value })} className="text-sm" /></div>
        <div><label className="block text-xs font-semibold text-gray-700 mb-1">Button 1 — Link</label>
          <Input value={local.btn1Link ?? ""} onChange={e => mark({ ...local, btn1Link: e.target.value })} className="text-sm" placeholder="/contact" /></div>
        <div><label className="block text-xs font-semibold text-gray-700 mb-1">Button 2 — Label</label>
          <Input value={local.btn2Label ?? ""} onChange={e => mark({ ...local, btn2Label: e.target.value })} className="text-sm" /></div>
        <div><label className="block text-xs font-semibold text-gray-700 mb-1">Button 2 — Link</label>
          <Input value={local.btn2Link ?? ""} onChange={e => mark({ ...local, btn2Link: e.target.value })} className="text-sm" placeholder="tel:07717310046" /></div>
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_CD_BODY = { heading1: "We can make your car shine", paragraph1: "We can offer a detailing service to all makes of car. Whatever car you have, regardless of make and model, our service includes paintwork correction to help bring it back to a showroom standard whether your car is new or old. Whether it is car scratch removal, dent removal, or machine polish, you can count on us.", heading2: "We can make your car shine", paragraph2: "Our car detailing service removes the defects such as scratches, 3d holograms and swirls by removing a thin layer of clear coat which reveals the defect free surface. We also provide interior valeting and exterior valeting. For your convenience, we offer full valet and part valet services.", image: "" };
function CdBodyEditor() {
  const { data, isLoading } = useSection("cd_body", DEFAULT_CD_BODY);
  const save = useSave("cd_body");
  const [local, setLocal] = useState(DEFAULT_CD_BODY);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CD_BODY); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_CD_BODY) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">First heading</label><Input value={local.heading1} onChange={e => mark({ ...local, heading1: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">First paragraph</label><Textarea value={local.paragraph1} rows={4} onChange={e => mark({ ...local, paragraph1: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Second heading</label><Input value={local.heading2} onChange={e => mark({ ...local, heading2: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Second paragraph</label><Textarea value={local.paragraph2} rows={4} onChange={e => mark({ ...local, paragraph2: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Image</label>
        <ImageUpload value={local.image ?? ""} onChange={url => mark({ ...local, image: url })} label="Upload section image" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── COMMERCIAL VALETING ──────────────────────────────────────────────────────
const DEFAULT_CV_HERO: HeroData = { slides: [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85", headline: "Top-Class Commercial Vehicle\nValeting Service in Guildford", sub: "Commercial vehicles see much more wear and tear than private cars due to the amount of usage, and therefore need regular valeting. Count on Smart Shine Car Valeting Centre to clean your car or van and bring its shine back." },
  { image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85", headline: "Full & Part Valet Services\nAt Competitive Prices", sub: "We offer full valet and part valet services at competitive prices. Whether you need interior valeting or exterior valeting, you can rely on us." },
  { image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=85", headline: "Serving Guildford,\nGodalming & Woking", sub: "Based in Guildford, we welcome customers from Godalming, Woking and the surrounding areas. Get in touch with us and let us know your requirements." },
]};
const CvHeroEditor = makeHeroEditor("cv_hero", DEFAULT_CV_HERO);

const DEFAULT_CV_INTRO = { heading: "Top-class commercial vehicle valeting service in Guildford", paragraph: "Commercial vehicles see much more wear and tear than private cars due to the amount of usage, and therefore need regular valeting. Count on Smart Shine Car Valeting Centre to clean your car or van and bring its shine back. We offer full valet and part valet services at competitive prices. Whether you need interior valeting or exterior valeting, you can rely on us." };
function CvIntroEditor() {
  const { data, isLoading } = useSection("cv_intro", DEFAULT_CV_INTRO);
  const save = useSave("cv_intro");
  const [local, setLocal] = useState(DEFAULT_CV_INTRO);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CV_INTRO); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_CV_INTRO) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label><Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Paragraph</label><Textarea value={local.paragraph} rows={5} onChange={e => mark({ ...local, paragraph: e.target.value })} className="text-sm" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_CV_BODY = { heading: "Commercial valeting", paragraph1: "Do you run a business which utilises a fleet of commercial vehicles, or provides transportation services? We understand that cleaning the vehicles could be a difficult task.", paragraph2: "Leave the job to our experienced and detail-oriented car valeting experts at Smart Shine Car Valeting Centre for a cost-effective solution to keep all your commercial vehicles looking their best. Whether you have bought a used vehicle or you want to sell one of your vehicles, rely on our specialists to give it the best look and increase its value.", paragraph3: "We offer car scratch removal, dent removal and machine polish at affordable prices. Based in Guildford, we welcome customers from Godalming, Woking and the surrounding areas. Get in touch with us and let us know your requirements.", image: "" };
function CvBodyEditor() {
  const { data, isLoading } = useSection("cv_body", DEFAULT_CV_BODY);
  const save = useSave("cv_body");
  const [local, setLocal] = useState(DEFAULT_CV_BODY);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CV_BODY); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_CV_BODY) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Heading</label><Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">First paragraph</label><Textarea value={local.paragraph1} rows={3} onChange={e => mark({ ...local, paragraph1: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Second paragraph</label><Textarea value={local.paragraph2} rows={4} onChange={e => mark({ ...local, paragraph2: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Third paragraph</label><Textarea value={local.paragraph3} rows={3} onChange={e => mark({ ...local, paragraph3: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section Image</label>
        <ImageUpload value={local.image ?? ""} onChange={url => mark({ ...local, image: url })} label="Upload section image" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

type CvServiceItem = { label: string; image?: string };
const DEFAULT_CV_SERVICES = { items: [
  { label: "Dent and scratch removal", image: "" },
  { label: "Machine polishing", image: "" },
  { label: "Paint restoration", image: "" },
  { label: "Vomit removal", image: "" },
  { label: "Pet hair removal", image: "" },
  { label: "Tree sap removal", image: "" },
  { label: "Liquids (e.g. milk, wine) removal", image: "" },
  { label: "Headlight Restoration Treatment", image: "" },
] as CvServiceItem[] };
function CvServicesEditor() {
  const { data, isLoading } = useSection("cv_services", DEFAULT_CV_SERVICES);
  const save = useSave("cv_services");
  const [local, setLocal] = useState(DEFAULT_CV_SERVICES);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (data) {
      const d = data as { items: (string | CvServiceItem)[] };
      const items = (d.items ?? []).map(it => typeof it === "string" ? { label: it, image: "" } : it);
      setLocal({ items }); setDirty(false);
    }
  }, [data]);
  const mark = (v: typeof DEFAULT_CV_SERVICES) => { setLocal(v); setDirty(true); };
  const update = (i: number, field: keyof CvServiceItem, val: string) => mark({ ...local, items: local.items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) });
  const remove = (i: number) => mark({ ...local, items: local.items.filter((_, idx) => idx !== i) });
  const add = () => mark({ ...local, items: [...local.items, { label: "New service", image: "" }] });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">Edit the services list. You can optionally add an image to each service.</p>
      <div className="space-y-3 mb-4">
        {local.items.map((item, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 bg-gray-50 space-y-2">
            <div className="flex gap-2 items-center">
              <Input value={item.label} onChange={e => update(i, "label", e.target.value)} className="text-sm flex-1" placeholder="Service name" />
              <Button size="icon" variant="ghost" onClick={() => remove(i)} className="text-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0"><Trash2 className="h-4 w-4" /></Button>
            </div>
            <ImageUpload value={item.image ?? ""} onChange={url => update(i, "image", url)} label="Add image (optional)" compact />
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={add} className="text-xs h-8 mb-4"><Plus className="h-3.5 w-3.5 mr-1" />Add service</Button>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── GALLERY HERO ─────────────────────────────────────────────────────────────
const DEFAULT_GALLERY_HERO = { slides: [
  { id: 0, image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85", headline: "Paint Restoration\nSpecialists in Guildford", sub: "From scratch removal to full paint correction — see our exceptional work in our gallery below." },
  { id: 1, image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=85", headline: "Interior & Exterior\nValeting Gallery", sub: "Explore our before-and-after transformations across all vehicle types and valeting services." },
  { id: 2, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85", headline: "Serving Guildford,\nGodalming & Woking", sub: "Customers from across Surrey trust Smart Shine to restore and protect their vehicles." },
]};
const GalleryHeroEditor = makeHeroEditor("gallery_hero", DEFAULT_GALLERY_HERO);

// ─── GALLERY BELOW-HERO ────────────────────────────────────────────────────────
const DEFAULT_GALLERY_BELOW_HERO = { heading: "Browse By Vehicle", subtitle: "Select your vehicle make to explore our gallery of professional valets, from showroom polish to deep interior cleans." };
function GalleryBelowHeroEditor() {
  const { data, isLoading } = useSection("gallery_below_hero", DEFAULT_GALLERY_BELOW_HERO);
  const save = useSave("gallery_below_hero");
  const [local, setLocal] = useState(DEFAULT_GALLERY_BELOW_HERO);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_GALLERY_BELOW_HERO); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_GALLERY_BELOW_HERO) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle</label>
        <Textarea value={local.subtitle} rows={2} onChange={e => mark({ ...local, subtitle: e.target.value })} className="text-sm" /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── GALLERY VEHICLE TAGS ─────────────────────────────────────────────────────
type GalleryImage = { url: string; caption: string };
type GalleryBrand = { id: string; name: string; emoji: string; images: GalleryImage[] };
const DEFAULT_GALLERY_BRANDS_FULL = { brands: [
  { id: "bmw", name: "BMW", emoji: "🇩🇪", images: [
    { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=85", caption: "BMW M3 — Full Exterior Detail" },
    { url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&q=85", caption: "BMW 5 Series — Paint Correction" },
  ]},
  { id: "mercedes", name: "Mercedes", emoji: "⭐", images: [
    { url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=85", caption: "Mercedes C-Class — Executive Valet" },
  ]},
] as GalleryBrand[] };
function GalleryBrandsEditor() {
  const { data, isLoading } = useSection("gallery_brands_v2", DEFAULT_GALLERY_BRANDS_FULL);
  const save = useSave("gallery_brands_v2");
  const [local, setLocal] = useState(DEFAULT_GALLERY_BRANDS_FULL);
  const [dirty, setDirty] = useState(false);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_GALLERY_BRANDS_FULL); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_GALLERY_BRANDS_FULL) => { setLocal(v); setDirty(true); };
  const updateBrand = (i: number, field: keyof GalleryBrand, val: string) =>
    mark({ ...local, brands: local.brands.map((b, idx) => idx === i ? { ...b, [field]: val } : b) });
  const removeBrand = (i: number) => mark({ ...local, brands: local.brands.filter((_, idx) => idx !== i) });
  const addBrand = () => {
    const id = `brand_${Date.now()}`;
    mark({ ...local, brands: [...local.brands, { id, name: "New Brand", emoji: "🚗", images: [] }] });
    setExpandedBrand(id);
  };
  const addImage = (bi: number) => mark({ ...local, brands: local.brands.map((b, idx) => idx === bi ? { ...b, images: [...b.images, { url: "", caption: "" }] } : b) });
  const updateImage = (bi: number, ii: number, field: keyof GalleryImage, val: string) =>
    mark({ ...local, brands: local.brands.map((b, idx) => idx === bi ? { ...b, images: b.images.map((img, jdx) => jdx === ii ? { ...img, [field]: val } : img) } : b) });
  const removeImage = (bi: number, ii: number) =>
    mark({ ...local, brands: local.brands.map((b, idx) => idx === bi ? { ...b, images: b.images.filter((_, jdx) => jdx !== ii) } : b) });
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div>
      <p className="text-xs text-gray-500 mb-4">Create vehicle tags and add images to each. These appear in the "Browse by Vehicle" section.</p>
      <div className="space-y-2 mb-4">
        {local.brands.map((brand, bi) => (
          <div key={brand.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <div
              className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setExpandedBrand(expandedBrand === brand.id ? null : brand.id)}
            >
              <span className="text-lg">{brand.emoji || "🚗"}</span>
              <span className="font-semibold text-sm text-gray-800 flex-1">{brand.name || "Unnamed Brand"}</span>
              <span className="text-xs text-gray-400">{brand.images.length} image{brand.images.length !== 1 ? "s" : ""}</span>
              <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); removeBrand(bi); }} className="text-gray-400 hover:text-red-500 h-7 w-7"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
            {expandedBrand === brand.id && (
              <div className="p-4 space-y-4 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2"><label className="block text-xs font-semibold text-gray-600 mb-1">Vehicle / Brand Name</label>
                    <Input value={brand.name} onChange={e => updateBrand(bi, "name", e.target.value)} className="text-sm" /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Emoji</label>
                    <Input value={brand.emoji} onChange={e => updateBrand(bi, "emoji", e.target.value)} className="text-sm" maxLength={4} /></div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-600">Images</label>
                    <Button size="sm" variant="outline" onClick={() => addImage(bi)} className="text-xs h-7"><Plus className="h-3 w-3 mr-1" />Add image</Button>
                  </div>
                  <div className="space-y-3">
                    {brand.images.map((img, ii) => (
                      <div key={ii} className="border border-gray-100 rounded-lg p-3 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500">Image {ii + 1}</span>
                          <Button size="icon" variant="ghost" onClick={() => removeImage(bi, ii)} className="text-gray-400 hover:text-red-500 h-6 w-6"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                        <ImageUpload value={img.url} onChange={url => updateImage(bi, ii, "url", url)} label="Upload image" compact />
                        <Input value={img.caption} onChange={e => updateImage(bi, ii, "caption", e.target.value)} placeholder="Caption (e.g. BMW M3 — Full Detail)" className="text-xs" />
                      </div>
                    ))}
                    {brand.images.length === 0 && <p className="text-xs text-gray-400 text-center py-3">No images yet. Click "Add image" to add one.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button size="sm" variant="outline" onClick={addBrand} className="text-xs h-8 mb-4"><Plus className="h-3.5 w-3.5 mr-1" />Add vehicle tag</Button>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const DEFAULT_PV_TESTIMONIAL = { quote: "Smart Shine did an amazing job on my car. The team was professional, thorough and the result was absolutely stunning. I'll definitely be back!", author: "Sarah Mitchell", role: "Verified Customer" };
function PvTestimonialEditor() {
  const { data, isLoading } = useSection("pv_testimonial", DEFAULT_PV_TESTIMONIAL);
  const save = useSave("pv_testimonial");
  const [local, setLocal] = useState(DEFAULT_PV_TESTIMONIAL);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_PV_TESTIMONIAL); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_PV_TESTIMONIAL) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Quote</label>
        <Textarea value={local.quote} rows={3} onChange={e => mark({ ...local, quote: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
        <Input value={local.author} onChange={e => mark({ ...local, author: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Label (e.g. Verified Customer)</label>
        <Input value={local.role} onChange={e => mark({ ...local, role: e.target.value })} /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_CD_TESTIMONIAL = { quote: "Excellent car detailing service. My vehicle looks brand new! The paint correction is flawless and the interior deep clean was exceptional.", author: "James Hartley", role: "Verified Customer" };
function CdTestimonialEditor() {
  const { data, isLoading } = useSection("cd_testimonial", DEFAULT_CD_TESTIMONIAL);
  const save = useSave("cd_testimonial");
  const [local, setLocal] = useState(DEFAULT_CD_TESTIMONIAL);
  const [dirty, setDirty] = useState(false);
  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_CD_TESTIMONIAL); setDirty(false); } }, [data]);
  const mark = (v: typeof DEFAULT_CD_TESTIMONIAL) => { setLocal(v); setDirty(true); };
  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;
  return (
    <div className="space-y-5">
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Quote</label>
        <Textarea value={local.quote} rows={3} onChange={e => mark({ ...local, quote: e.target.value })} className="text-sm" /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Customer Name</label>
        <Input value={local.author} onChange={e => mark({ ...local, author: e.target.value })} /></div>
      <div><label className="block text-sm font-semibold text-gray-700 mb-1.5">Role / Label (e.g. Verified Customer)</label>
        <Input value={local.role} onChange={e => mark({ ...local, role: e.target.value })} /></div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

// ─── GALLERY CARS ─────────────────────────────────────────────────────────────
const EMPTY_CAR: Omit<GalleryCar, "id"> = { make: "", model: "", year: new Date().getFullYear(), image: "", service: "" };

function GalleryCarsEditor() {
  const qc = useQueryClient();
  const { data: cars, isLoading } = useQuery<GalleryCar[]>({
    queryKey: ["gallery-cars"],
    queryFn: () => fetch("/api/gallery").then(r => r.json()),
  });

  const [adding, setAdding] = useState(false);
  const [newCar, setNewCar] = useState<Omit<GalleryCar, "id">>(EMPTY_CAR);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Omit<GalleryCar, "id">>(EMPTY_CAR);
  const [saving, setSaving] = useState(false);

  const deleteCar = useMutation({
    mutationFn: (id: string) => fetch(`/api/gallery/${id}`, { method: "DELETE" }).then(r => { if (!r.ok) throw new Error("Delete failed"); return r.json(); }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery-cars"] }),
  });

  const handleAdd = async () => {
    if (!newCar.make || !newCar.model || !newCar.year) return;
    setSaving(true);
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCar),
      });
      qc.invalidateQueries({ queryKey: ["gallery-cars"] });
      setNewCar(EMPTY_CAR);
      setAdding(false);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    setSaving(true);
    try {
      const updated = (cars ?? []).map(c => c.id === id ? { ...c, ...editValues } : c);
      await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      qc.invalidateQueries({ queryKey: ["gallery-cars"] });
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{cars?.length ?? 0} vehicle{cars?.length !== 1 ? "s" : ""} in gallery</p>
        <Button size="sm" variant="outline" onClick={() => { setAdding(true); setEditingId(null); }} className="text-xs h-8">
          <Plus className="h-3.5 w-3.5 mr-1" />Add Vehicle
        </Button>
      </div>

      {/* Add new car form */}
      {adding && (
        <div className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/50 mb-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-bold text-blue-700">New Vehicle</p>
            <Button size="icon" variant="ghost" onClick={() => setAdding(false)} className="h-7 w-7"><X className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Make *</label>
              <Input value={newCar.make} onChange={e => setNewCar(c => ({ ...c, make: e.target.value }))} placeholder="BMW" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Model *</label>
              <Input value={newCar.model} onChange={e => setNewCar(c => ({ ...c, model: e.target.value }))} placeholder="3 Series" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Year *</label>
              <Input type="number" value={newCar.year} onChange={e => setNewCar(c => ({ ...c, year: Number(e.target.value) }))} placeholder="2020" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Service</label>
              <Input value={newCar.service} onChange={e => setNewCar(c => ({ ...c, service: e.target.value }))} placeholder="Full Valet" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label>
            <ImageUpload value={newCar.image} onChange={val => setNewCar(c => ({ ...c, image: val }))} placeholder="Upload or paste URL…" compact /></div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={saving || !newCar.make || !newCar.model} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />}Save Vehicle
            </Button>
          </div>
        </div>
      )}

      {/* Car list */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {(cars ?? []).map(car => (
          <div key={car.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {editingId === car.id ? (
              <div className="p-4 space-y-3 bg-amber-50/50 border-t-2 border-amber-300">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Make</label>
                    <Input value={editValues.make} onChange={e => setEditValues(v => ({ ...v, make: e.target.value }))} /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Model</label>
                    <Input value={editValues.model} onChange={e => setEditValues(v => ({ ...v, model: e.target.value }))} /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Year</label>
                    <Input type="number" value={editValues.year} onChange={e => setEditValues(v => ({ ...v, year: Number(e.target.value) }))} /></div>
                  <div><label className="block text-xs font-semibold text-gray-600 mb-1">Service</label>
                    <Input value={editValues.service} onChange={e => setEditValues(v => ({ ...v, service: e.target.value }))} /></div>
                </div>
                <div><label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label>
                  <ImageUpload value={editValues.image} onChange={val => setEditValues(v => ({ ...v, image: val }))} compact /></div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  <Button size="sm" onClick={() => handleEdit(car.id)} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Check className="h-3.5 w-3.5 mr-1" />}Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3">
                {car.image ? (
                  <img src={car.image} alt={`${car.make} ${car.model}`} className="h-14 w-20 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
                ) : (
                  <div className="h-14 w-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{car.make} {car.model}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{car.year}</span>
                    {car.service && <span className="text-gray-400 text-xs truncate">{car.service}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => { setEditingId(car.id); setEditValues({ make: car.make, model: car.model, year: car.year, image: car.image, service: car.service }); setAdding(false); }} className="h-8 w-8 text-gray-400 hover:text-blue-600">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteCar.mutate(car.id)} className="h-8 w-8 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!cars?.length && !adding && (
          <p className="text-center text-sm text-gray-400 py-8">No vehicles yet. Click "Add Vehicle" to get started.</p>
        )}
      </div>
    </div>
  );
}

// ─── PAGE GROUPS ──────────────────────────────────────────────────────────────
type SectionDef = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  editor: React.ComponentType;
};

type PageGroup = {
  page: string;
  icon: React.ElementType;
  color: string;
  sections: SectionDef[];
};

const PAGE_GROUPS: PageGroup[] = [
  {
    page: "Home",
    icon: Home,
    color: "blue",
    sections: [
      { key: "hero_slides", label: "Hero Carousel", description: "Slides, headlines, images & buttons", icon: GalleryHorizontal, editor: HeroSlidesEditor },
      { key: "about_us", label: "About Us", description: "Typewriter text, heading and paragraph", icon: Info, editor: AboutUsEditor },
      { key: "stats_cards", label: "Stats (25+ years etc.)", description: "The four stats cards below About Us", icon: BarChart3, editor: StatsEditor },
      { key: "complete_valeting", label: "Complete Valeting", description: "Dark section with badge and two paragraphs", icon: Layers, editor: CompleteValetingEditor },
      { key: "car_vehicle_services", label: "Car & Vehicle Services", description: "Services grid on the homepage", icon: Car, editor: CarServicesEditor },
      { key: "why_choose_us", label: "Why Choose Us?", description: "Feature cards in the Why Choose Us section", icon: Sparkles, editor: WhyUsEditor },
      { key: "customers_say", label: "Reviews Heading", description: "Section title for the reviews block", icon: Star, editor: ReviewsHeaderEditor },
      { key: "get_in_touch", label: "Get in Touch", description: "Phone numbers, call-to-action, hours", icon: Phone, editor: GetInTouchEditor },
    ],
  },
  {
    page: "Private Valeting",
    icon: Car,
    color: "violet",
    sections: [
      { key: "pv_hero", label: "Hero Carousel", description: "Slides, headlines and images for the hero banner", icon: GalleryHorizontal, editor: PvHeroEditor },
      { key: "pv_intro", label: "Intro Section", description: "Heading and paragraph in the packages area", icon: Info, editor: PvIntroEditor },
      { key: "pv_packages", label: "Packages", description: "Package cards — name, description and price", icon: ListChecks, editor: PvPackagesEditor },
      { key: "pv_body", label: "Body Section", description: "Dark section — heading, paragraph and image", icon: Layers, editor: PvBodyEditor },
      { key: "pv_testimonial", label: "Customer Comment", description: "Quote shown in the Our Customers section", icon: Star, editor: PvTestimonialEditor },
    ],
  },
  {
    page: "Car Detailing",
    icon: Sparkles,
    color: "emerald",
    sections: [
      { key: "cd_hero", label: "Hero Carousel", description: "Slides, headlines and images for the hero banner", icon: GalleryHorizontal, editor: CdHeroEditor },
      { key: "cd_intro", label: "About Section", description: "Heading, paragraph and 2 action buttons", icon: Info, editor: CdIntroEditor },
      { key: "cd_body", label: "Body Section", description: "Dark section — headings, paragraphs and image", icon: Layers, editor: CdBodyEditor },
      { key: "cd_testimonial", label: "Customer Comment", description: "Quote shown in the Our Customers section", icon: Star, editor: CdTestimonialEditor },
    ],
  },
  {
    page: "Commercial Valeting",
    icon: Wrench,
    color: "orange",
    sections: [
      { key: "cv_hero", label: "Hero Carousel", description: "Slides, headlines and images for the hero banner", icon: GalleryHorizontal, editor: CvHeroEditor },
      { key: "cv_intro", label: "About Section", description: "Heading and paragraph in the about section", icon: Info, editor: CvIntroEditor },
      { key: "cv_body", label: "Body Section", description: "Dark section — heading, paragraphs and image", icon: Layers, editor: CvBodyEditor },
      { key: "cv_services", label: "Services List", description: "The checklist of services with optional images", icon: ListChecks, editor: CvServicesEditor },
    ],
  },
  {
    page: "Gallery",
    icon: Image,
    color: "rose",
    sections: [
      { key: "gallery_cars", label: "Gallery Cars", description: "Add/edit/delete vehicles shown in the car grid (Make, Model, Year)", icon: Car, editor: GalleryCarsEditor },
      { key: "gallery_hero", label: "Hero Carousel", description: "Gallery page hero slides — images and headlines", icon: GalleryHorizontal, editor: GalleryHeroEditor },
      { key: "gallery_below_hero", label: "Gallery Section Heading", description: "Heading and subtitle below the hero carousel", icon: Info, editor: GalleryBelowHeroEditor },
      { key: "gallery_brands_v2", label: "Vehicle Tags & Images", description: "Browse-by-vehicle tags with images per brand", icon: Car, editor: GalleryBrandsEditor },
    ],
  },
  {
    page: "Contact",
    icon: Contact,
    color: "blue",
    sections: [
      { key: "contact_us", label: "Contact Details", description: "Address, email, phone and hours", icon: MapPin, editor: ContactUsEditor },
    ],
  },
];

const COLOR_MAP: Record<string, { active: string; dot: string; header: string; icon: string }> = {
  blue:    { active: "bg-blue-600 text-white shadow-sm",    dot: "bg-blue-500",    header: "text-blue-700 bg-blue-50 border-blue-100",   icon: "text-blue-600" },
  violet:  { active: "bg-violet-600 text-white shadow-sm",  dot: "bg-violet-500",  header: "text-violet-700 bg-violet-50 border-violet-100", icon: "text-violet-600" },
  emerald: { active: "bg-emerald-600 text-white shadow-sm", dot: "bg-emerald-500", header: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: "text-emerald-600" },
  orange:  { active: "bg-orange-500 text-white shadow-sm",  dot: "bg-orange-500",  header: "text-orange-700 bg-orange-50 border-orange-100", icon: "text-orange-600" },
  rose:    { active: "bg-rose-600 text-white shadow-sm",    dot: "bg-rose-500",    header: "text-rose-700 bg-rose-50 border-rose-100",   icon: "text-rose-600" },
};

export default function AdminContent() {
  const [active, setActive] = useState(PAGE_GROUPS[0].sections[0].key);
  // Start with only the first group expanded; others collapsed
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(PAGE_GROUPS.map((g, i) => [g.page, i === 0]))
  );

  const allSections = PAGE_GROUPS.flatMap(g => g.sections.map(s => ({ ...s, color: g.color })));
  const activeSection = allSections.find(s => s.key === active)!;
  const ActiveEditor = activeSection.editor;
  const colors = COLOR_MAP[activeSection.color];

  const toggleGroup = (page: string) => {
    setExpanded(prev => ({ ...prev, [page]: !prev[page] }));
  };

  const handleSelectSection = (key: string) => {
    setActive(key);
    // Auto-expand the group that contains the selected section
    const group = PAGE_GROUPS.find(g => g.sections.some(s => s.key === key));
    if (group) setExpanded(prev => ({ ...prev, [group.page]: true }));
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">Select a page and section to edit the content shown on your website.</p>
      </div>

      {/* Mobile section picker */}
      <div className="md:hidden mb-4">
        <select
          value={active}
          onChange={e => handleSelectSection(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {PAGE_GROUPS.map(group => (
            <optgroup key={group.page} label={`${group.page} Page`}>
              {group.sections.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="flex gap-6 min-h-[600px]">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-64 flex-shrink-0 space-y-1">
          {PAGE_GROUPS.map(group => {
            const gc = COLOR_MAP[group.color];
            const PageIcon = group.icon;
            const isOpen = expanded[group.page] ?? false;
            const hasActive = group.sections.some(s => s.key === active);
            return (
              <div key={group.page} className="overflow-hidden rounded-xl border border-gray-100">
                {/* Collapsible header */}
                <button
                  onClick={() => toggleGroup(group.page)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-colors ${
                    hasActive ? gc.header : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  } ${hasActive ? "border-b border-current/10" : ""}`}
                >
                  <PageIcon className={`h-3.5 w-3.5 flex-shrink-0 ${hasActive ? gc.icon : "text-gray-400"}`} />
                  <span className="flex-1 text-left">{group.page}</span>
                  {hasActive && !isOpen && (
                    <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${gc.dot}`} />
                  )}
                  <ChevronRight
                    className={`h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""} ${hasActive ? gc.icon : "text-gray-400"}`}
                  />
                </button>

                {/* Sections — shown when open */}
                {isOpen && (
                  <nav className="space-y-0.5 p-1 bg-white">
                    {group.sections.map(s => {
                      const Icon = s.icon;
                      const isActive = s.key === active;
                      const sc = COLOR_MAP[group.color];
                      return (
                        <button
                          key={s.key}
                          onClick={() => setActive(s.key)}
                          className={`w-full flex items-start gap-2.5 text-left px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                            isActive ? sc.active : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-white/80" : "text-gray-400 group-hover:text-gray-600"}`} />
                          <div className="min-w-0 flex-1">
                            <div className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : ""}`}>{s.label}</div>
                            <div className={`text-[10px] leading-snug mt-0.5 truncate ${isActive ? "text-white/70" : "text-gray-400"}`}>{s.description}</div>
                          </div>
                          {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/60 flex-shrink-0 ml-auto mt-0.5" />}
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })}
        </aside>

        {/* Editor Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 min-w-0">
          <div className="flex flex-wrap items-start gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${
              activeSection.color === "blue" ? "bg-blue-50" :
              activeSection.color === "violet" ? "bg-violet-50" :
              activeSection.color === "emerald" ? "bg-emerald-50" :
              activeSection.color === "orange" ? "bg-orange-50" : "bg-rose-50"
            }`}>
              <activeSection.icon className={`h-5 w-5 ${colors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900">{activeSection.label}</h2>
              <p className="text-sm text-gray-500">{activeSection.description}</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-gray-400 border-gray-200 hidden sm:inline-flex">{active}</Badge>
          </div>
          <ActiveEditor />
        </div>
      </div>
    </AdminLayout>
  );
}
