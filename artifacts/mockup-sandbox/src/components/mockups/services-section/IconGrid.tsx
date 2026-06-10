import { ArrowRight } from "lucide-react";

const SERVICES = [
  { label: "Car & Vehicle Valeting", icon: "🚗", color: "from-blue-500 to-blue-700" },
  { label: "Car Buffing",            icon: "✨", color: "from-purple-500 to-purple-700" },
  { label: "Car Detailing",          icon: "🔍", color: "from-indigo-500 to-indigo-700" },
  { label: "Car Scratch Repairs",    icon: "🛠️", color: "from-orange-500 to-orange-700" },
  { label: "Car Valeting",           icon: "🧽", color: "from-cyan-500 to-cyan-700" },
  { label: "Car Wash",               icon: "💧", color: "from-sky-500 to-sky-700" },
  { label: "Commercial Valeting",    icon: "🚐", color: "from-teal-500 to-teal-700" },
  { label: "Deep Cleaning",          icon: "🧹", color: "from-emerald-500 to-emerald-700" },
  { label: "Dent Removal",           icon: "🔧", color: "from-slate-500 to-slate-700" },
  { label: "Exterior Valet",         icon: "🌟", color: "from-yellow-500 to-yellow-600" },
  { label: "Hand Car Wash",          icon: "🤲", color: "from-rose-500 to-rose-700" },
  { label: "Interior Valet",         icon: "💺", color: "from-violet-500 to-violet-700" },
  { label: "Machine Polish",         icon: "⚙️", color: "from-zinc-500 to-zinc-700" },
  { label: "Mini Valets",            icon: "⚡", color: "from-amber-500 to-amber-600" },
  { label: "Private Vehicle Valeting", icon: "🔑", color: "from-blue-600 to-indigo-700" },
  { label: "Stain Removal Services", icon: "🪣", color: "from-lime-500 to-lime-700" },
  { label: "Wheel Cleaning",         icon: "🔵", color: "from-blue-400 to-blue-600" },
];

export function IconGrid() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
            Products &amp; Services
          </span>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
            Everything Your Vehicle Needs
          </h2>
          <p className="text-gray-500 text-[15px] max-w-xl mx-auto">
            Professional valeting solutions for private and commercial vehicles in Guildford and surrounding areas.
          </p>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ label, icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col items-center gap-4 text-center transition-all duration-200 hover:-translate-y-1 cursor-default group"
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg`}>
                {icon}
              </div>
              <p className="text-[13px] font-bold text-gray-800 group-hover:text-blue-700 leading-snug transition-colors">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 rounded-full bg-gray-900 hover:bg-blue-900 px-8 py-3.5 text-[15px] font-black text-white transition-all duration-150 shadow-lg">
            Book a Service
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
