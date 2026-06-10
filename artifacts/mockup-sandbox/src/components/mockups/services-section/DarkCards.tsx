import { ArrowRight, Sparkles } from "lucide-react";

const SERVICES = [
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
];

export function DarkCards() {
  return (
    <div
      className="min-h-screen py-20 px-6"
      style={{ background: "linear-gradient(135deg, #0a0f2e 0%, #1a2a6c 50%, #0a1845 100%)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-300 rounded-full px-4 py-1.5 text-sm font-bold mb-4 border border-white/10">
            <Sparkles className="h-4 w-4" />
            Products &amp; Services
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight mb-3">
            Car &amp; Vehicle Services
          </h2>
          <p className="text-white/60 text-[15px] max-w-xl mx-auto">
            From a quick hand wash to full paint correction — we cover everything your vehicle needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SERVICES.map(({ label, icon }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-5 text-center transition-all duration-200 cursor-default hover:border-blue-400/40"
              style={{ backdropFilter: "blur(4px)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
              <span className="text-3xl block mb-3">{icon}</span>
              <p className="text-[13px] font-bold text-white/80 group-hover:text-white leading-snug transition-colors duration-200">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-3.5 text-[15px] font-black text-white transition-all duration-150 shadow-xl shadow-blue-600/30">
            Book a Service
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
