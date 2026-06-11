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
  GalleryHorizontal, Info, BarChart3, Layers,
} from "lucide-react";

const API = "/api/content";

function fetchSection(key: string) {
  return fetch(`${API}/${key}`).then(r => r.ok ? r.json() : null);
}

function saveSection(key: string, body: unknown) {
  return fetch(`${API}/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

const DEFAULT_CAR_SERVICES = {
  subtitle: "From a quick hand wash to full paint correction — we cover everything your vehicle needs.",
  items: [
    { label: "Car & Vehicle Valeting", icon: "🚗" },
    { label: "Car Buffing", icon: "✨" },
    { label: "Car Detailing", icon: "🔍" },
    { label: "Car Scratch Repairs", icon: "🛠️" },
    { label: "Car Valeting", icon: "🧽" },
    { label: "Car Wash", icon: "💧" },
    { label: "Commercial Vehicle Valeting", icon: "🚐" },
    { label: "Deep Cleaning", icon: "🧹" },
    { label: "Dent Removal", icon: "🔧" },
    { label: "Exterior Valet", icon: "🌟" },
    { label: "Hand Car Wash", icon: "🤲" },
    { label: "Interior Valet", icon: "💺" },
    { label: "Machine Polish", icon: "⚙️" },
    { label: "Mini Valets", icon: "⚡" },
    { label: "Private Vehicle Valeting", icon: "🔑" },
    { label: "Stain Removal Services", icon: "🪣" },
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
    const items = [...local.items];
    items[i] = { ...items[i], [field]: val };
    mark({ ...local, items });
  };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section subtitle</label>
        <Textarea
          value={local.subtitle}
          rows={2}
          onChange={e => mark({ ...local, subtitle: e.target.value })}
          className="text-sm"
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">Services ({local.items.length})</label>
          <Button size="sm" variant="outline" onClick={addItem} className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />Add service
          </Button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {local.items.map((item, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={item.icon}
                onChange={e => updateItem(i, "icon", e.target.value)}
                className="w-16 text-center text-lg"
                placeholder="🚗"
              />
              <Input
                value={item.label}
                onChange={e => updateItem(i, "label", e.target.value)}
                className="flex-1 text-sm"
                placeholder="Service name"
              />
              <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_WHY = {
  subtitle: "Over 25 years of experience, competitive prices, and results you can see.",
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
    const cards = [...local.cards];
    cards[i] = { ...cards[i], [field]: val };
    mark({ ...local, cards });
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
          <label className="text-sm font-semibold text-gray-700">Cards ({local.cards.length})</label>
          <Button size="sm" variant="outline" onClick={addCard} className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />Add card
          </Button>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {local.cards.map((card, i) => (
            <div key={i} className="flex gap-2 items-start border border-gray-100 rounded-xl p-3 bg-gray-50">
              <Input
                value={card.emoji}
                onChange={e => updateCard(i, "emoji", e.target.value)}
                className="w-14 text-center text-lg"
                placeholder="⭐"
              />
              <div className="flex-1 space-y-1.5">
                <Input value={card.title} onChange={e => updateCard(i, "title", e.target.value)} className="text-sm font-semibold" placeholder="Card title" />
                <Input value={card.desc} onChange={e => updateCard(i, "desc", e.target.value)} className="text-sm" placeholder="Short description" />
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeCard(i)} className="text-gray-400 hover:text-red-500 h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_REVIEWS_HEADER = {
  title: "What our customers say?",
  subtitle: "Real reviews from real customers",
};

function ReviewsHeaderEditor() {
  const { data, isLoading } = useSection("customers_say", DEFAULT_REVIEWS_HEADER);
  const save = useSave("customers_say");
  const [local, setLocal] = useState(DEFAULT_REVIEWS_HEADER);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_REVIEWS_HEADER); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div>
      <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 mb-5 font-medium">
        Individual reviews are managed in the <strong>Reviews</strong> section of this admin panel.
        Here you can edit the section heading text only.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section title</label>
          <Input value={local.title} onChange={e => mark({ ...local, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section subtitle</label>
          <Input value={local.subtitle} onChange={e => mark({ ...local, subtitle: e.target.value })} />
        </div>
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_GET_IN_TOUCH = {
  description: "Call Smart Shine Car Valeting Centre for a car valeting or detailing in Guildford",
  phones: [
    { number: "07717 310 046" },
    { number: "01483 236 060" },
  ],
  hours: "Mon – Sun · 08:00 – 19:00",
};

function GetInTouchEditor() {
  const { data, isLoading } = useSection("get_in_touch", DEFAULT_GET_IN_TOUCH);
  const save = useSave("get_in_touch");
  const [local, setLocal] = useState(DEFAULT_GET_IN_TOUCH);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_GET_IN_TOUCH); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const updatePhone = (i: number, val: string) => {
    const phones = [...local.phones];
    phones[i] = { number: val };
    mark({ ...local, phones });
  };
  const addPhone = () => mark({ ...local, phones: [...local.phones, { number: "" }] });
  const removePhone = (i: number) => mark({ ...local, phones: local.phones.filter((_, j) => j !== i) });

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Call-to-action description</label>
        <Textarea value={local.description} rows={2} onChange={e => mark({ ...local, description: e.target.value })} className="text-sm" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700">Phone numbers</label>
          <Button size="sm" variant="outline" onClick={addPhone} className="text-xs h-8">
            <Plus className="h-3.5 w-3.5 mr-1" />Add
          </Button>
        </div>
        <div className="space-y-2">
          {local.phones.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input value={p.number} onChange={e => updatePhone(i, e.target.value)} placeholder="07717 310 046" className="text-sm" />
              <Button size="icon" variant="ghost" onClick={() => removePhone(i)} className="text-gray-400 hover:text-red-500 h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening hours text</label>
        <Input value={local.hours} onChange={e => mark({ ...local, hours: e.target.value })} placeholder="Mon – Sun · 08:00 – 19:00" className="text-sm" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

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
      <p className="text-sm text-blue-600 bg-blue-50 rounded-lg p-3 font-medium">
        These details appear in the footer and contact sections of the website.
      </p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
        <Input value={local.address} onChange={e => mark({ ...local, address: e.target.value })} placeholder="Guildford, Surrey" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone(s) — shown in footer</label>
        <Input value={local.phone} onChange={e => mark({ ...local, phone: e.target.value })} placeholder="07717 310 046 / 01483 236 060" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
        <Input value={local.email} onChange={e => mark({ ...local, email: e.target.value })} placeholder="info@smartshine.co.uk" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening hours</label>
        <Input value={local.hours} onChange={e => mark({ ...local, hours: e.target.value })} placeholder="Mon–Sun: 08:00 – 19:00" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_PRICING = {
  note: "Prices vary on the size of the car",
  subtitle: "All prices include materials and labour. Free quotes available on request.",
};

function PricingNoteEditor() {
  const { data, isLoading } = useSection("pricing_note", DEFAULT_PRICING);
  const save = useSave("pricing_note");
  const [local, setLocal] = useState(DEFAULT_PRICING);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_PRICING); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pricing note (shown above services grid)</label>
        <Input value={local.note} onChange={e => mark({ ...local, note: e.target.value })} placeholder="Prices vary on the size of the car" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pricing subtitle</label>
        <Textarea value={local.subtitle} rows={2} onChange={e => mark({ ...local, subtitle: e.target.value })} className="text-sm" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_OUR_SERVICES = {
  title: "Our services include",
  subtitle: "A complete range of professional valeting and detailing services.",
};

function OurServicesEditor() {
  const { data, isLoading } = useSection("our_services_include", DEFAULT_OUR_SERVICES);
  const save = useSave("our_services_include");
  const [local, setLocal] = useState(DEFAULT_OUR_SERVICES);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_OUR_SERVICES); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        This section appears on the individual service pages (Private Valeting, Commercial Valeting, etc.) listing what's included.
      </p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.title} onChange={e => mark({ ...local, title: e.target.value })} placeholder="Our services include" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section subtitle</label>
        <Textarea value={local.subtitle} rows={2} onChange={e => mark({ ...local, subtitle: e.target.value })} className="text-sm" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_GALLERY = {
  title: "Our Work",
  subtitle: "Select a brand to see our work on that vehicle type",
};

function GalleryBrandsEditor() {
  const { data, isLoading } = useSection("gallery_brands", DEFAULT_GALLERY);
  const save = useSave("gallery_brands");
  const [local, setLocal] = useState(DEFAULT_GALLERY);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_GALLERY); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
        This controls the heading shown on the Gallery page above the brand selector.
      </p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Page title</label>
        <Input value={local.title} onChange={e => mark({ ...local, title: e.target.value })} placeholder="Our Work" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subtitle / instruction text</label>
        <Input value={local.subtitle} onChange={e => mark({ ...local, subtitle: e.target.value })} placeholder="Select a brand to see our work" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_HERO = {
  slides: [
    { headline: "Premium Car\nValeting Service", sub: "Professional valeting that restores your vehicle to showroom condition. Serving Guildford and surrounding areas.", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=85" },
    { headline: "Showroom Finish,\nEvery Time", sub: "Deep paint correction and interior detailing to restore your vehicle to pristine condition.", image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=85" },
    { headline: "Trusted by\nThousands of Drivers", sub: "Over 25 years of experience. Over 5,000 happy customers. Experience the Smart Shine difference.", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1600&q=85" },
  ],
};

function HeroSlidesEditor() {
  const { data, isLoading } = useSection("hero_slides", DEFAULT_HERO);
  const save = useSave("hero_slides");
  const [local, setLocal] = useState(DEFAULT_HERO);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { if (data) { setLocal(data as typeof DEFAULT_HERO); setDirty(false); } }, [data]);

  const mark = (next: typeof local) => { setLocal(next); setDirty(true); };
  const updateSlide = (i: number, field: "headline" | "sub" | "image", val: string) => {
    const slides = [...local.slides];
    slides[i] = { ...slides[i], [field]: val };
    mark({ ...local, slides });
  };
  const addSlide = () => mark({ ...local, slides: [...local.slides, { headline: "", sub: "", image: "" }] });
  const removeSlide = (i: number) => mark({ ...local, slides: local.slides.filter((_, j) => j !== i) });

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Edit the hero carousel slides shown at the top of the homepage.</p>
        <Button size="sm" variant="outline" onClick={addSlide} className="text-xs h-8 flex-shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />Add slide
        </Button>
      </div>
      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
        {local.slides.map((slide, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slide {i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => removeSlide(i)} className="text-gray-400 hover:text-red-500 h-7 w-7">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
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
              <label className="block text-xs font-semibold text-gray-600 mb-1">Background image URL</label>
              <Input value={slide.image} onChange={e => updateSlide(i, "image", e.target.value)} className="text-xs" placeholder="https://images.unsplash.com/…" />
              {slide.image && <img src={slide.image} alt="" className="mt-2 h-20 w-full object-cover rounded-lg" onError={e => (e.currentTarget.style.display = "none")} />}
            </div>
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

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

const DEFAULT_STATS = {
  items: [
    { value: "25+",    label: "Years Experience", icon: "🏆" },
    { value: "5,000+", label: "Happy Customers",  icon: "😊" },
    { value: "100%",   label: "Fully Insured",    icon: "🛡️" },
    { value: "5★",     label: "Rated Service",    icon: "⭐" },
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
    const items = [...local.items];
    items[i] = { ...items[i], [field]: val };
    mark({ ...local, items });
  };
  const addItem = () => mark({ ...local, items: [...local.items, { value: "", label: "", icon: "⭐" }] });
  const removeItem = (i: number) => mark({ ...local, items: local.items.filter((_, j) => j !== i) });

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">Stats cards shown below the About Us section.</p>
        <Button size="sm" variant="outline" onClick={addItem} className="text-xs h-8 flex-shrink-0">
          <Plus className="h-3.5 w-3.5 mr-1" />Add stat
        </Button>
      </div>
      <div className="space-y-2">
        {local.items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center border border-gray-100 rounded-xl p-3 bg-gray-50">
            <Input value={item.icon} onChange={e => updateItem(i, "icon", e.target.value)} className="w-14 text-center text-lg flex-shrink-0" placeholder="🏆" />
            <Input value={item.value} onChange={e => updateItem(i, "value", e.target.value)} className="w-24 text-sm font-bold flex-shrink-0" placeholder="25+" />
            <Input value={item.label} onChange={e => updateItem(i, "label", e.target.value)} className="flex-1 text-sm" placeholder="Years Experience" />
            <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 h-8 w-8 flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const DEFAULT_COMPLETE = {
  badge: "Our Services",
  heading: "A complete valeting service",
  paragraph1: "At Smart Shine Car Valeting Centre we value our customers and we strive to satisfy your individual requirements. We are happy to spend as much time as necessary on your car to ensure that you receive the standard of service that you expect and deserve.",
  paragraph2: "Based in Guildford, we welcome both private and commercial clients from Godalming, Woking and the surrounding areas. We have a wide range of packages to choose from, at competitive prices to suit any budget. We also offer car scratch removal and machine polish.",
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
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Badge label (small uppercase text)</label>
        <Input value={local.badge} onChange={e => mark({ ...local, badge: e.target.value })} placeholder="Our Services" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Section heading</label>
        <Input value={local.heading} onChange={e => mark({ ...local, heading: e.target.value })} placeholder="A complete valeting service" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">First paragraph</label>
        <Textarea value={local.paragraph1} rows={4} onChange={e => mark({ ...local, paragraph1: e.target.value })} className="text-sm" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Second paragraph</label>
        <Textarea value={local.paragraph2} rows={4} onChange={e => mark({ ...local, paragraph2: e.target.value })} className="text-sm" />
      </div>
      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => save.mutate(local, { onSuccess: () => setDirty(false) })} />
    </div>
  );
}

const SECTIONS = [
  { key: "hero_slides", label: "Hero Carousel", icon: GalleryHorizontal, description: "Homepage hero slides — headlines, subtitles, images", editor: HeroSlidesEditor },
  { key: "about_us", label: "About Us", icon: Info, description: "Typewriter text, heading and about paragraph", editor: AboutUsEditor },
  { key: "stats_cards", label: "Stats (25+ years etc.)", icon: BarChart3, description: "The four stats cards below About Us", editor: StatsEditor },
  { key: "complete_valeting", label: "A Complete Valeting Service", icon: Layers, description: "Dark section with badge, heading and two paragraphs", editor: CompleteValetingEditor },
  { key: "car_vehicle_services", label: "Car & Vehicle Services", icon: Car, description: "The services grid shown on the homepage", editor: CarServicesEditor },
  { key: "why_choose_us", label: "Why choose us?", icon: Sparkles, description: "Feature cards in the Why Choose Us section", editor: WhyUsEditor },
  { key: "customers_say", label: "What our customers say?", icon: Star, description: "Reviews section heading", editor: ReviewsHeaderEditor },
  { key: "get_in_touch", label: "Get in touch today", icon: Phone, description: "Phone numbers, call-to-action text, hours", editor: GetInTouchEditor },
  { key: "contact_us", label: "Contact Us", icon: MapPin, description: "Address, email, phone and hours in footer", editor: ContactUsEditor },
  { key: "pricing_note", label: "Prices vary on size of car", icon: ListChecks, description: "Pricing note and subtitle text", editor: PricingNoteEditor },
  { key: "our_services_include", label: "Our services include", icon: Wrench, description: "Section heading on service pages", editor: OurServicesEditor },
  { key: "gallery_brands", label: "Select a brand — Gallery", icon: Image, description: "Gallery page heading and instruction text", editor: GalleryBrandsEditor },
];

export default function AdminContent() {
  const [active, setActive] = useState(SECTIONS[0].key);
  const activeSection = SECTIONS.find(s => s.key === active)!;
  const ActiveEditor = activeSection.editor;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Content Management</h1>
        <p className="text-sm text-gray-500 mt-1">Edit the text and content shown on your website.</p>
      </div>

      <div className="flex gap-6 min-h-[600px]">
        {/* Section list */}
        <aside className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const isActive = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`w-full flex items-start gap-3 text-left px-3 py-3 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${isActive ? "text-blue-200" : "text-gray-400 group-hover:text-gray-600"}`} />
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold leading-snug ${isActive ? "text-white" : ""}`}>{s.label}</div>
                    <div className={`text-[11px] leading-snug mt-0.5 truncate ${isActive ? "text-blue-200" : "text-gray-400"}`}>{s.description}</div>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-blue-300 flex-shrink-0 ml-auto mt-0.5" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Editor panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 flex-shrink-0">
              <activeSection.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{activeSection.label}</h2>
              <p className="text-sm text-gray-500">{activeSection.description}</p>
            </div>
            <Badge variant="outline" className="ml-auto text-xs font-mono text-gray-400 border-gray-200">{active}</Badge>
          </div>

          <ActiveEditor />
        </div>
      </div>
    </AdminLayout>
  );
}
