import { ArrowRight, CheckCircle, Star, Phone, Sparkles, Shield, Clock, Car, Droplets, Zap } from "lucide-react";

const PACKAGES = [
  {
    name: "Mini Valet",
    desc: "Quick refresh for well-maintained cars",
    price: "from £45",
    features: ["Exterior wash & dry", "Interior vacuum", "Window polish", "Tyre shine"],
    icon: Droplets,
    popular: false,
    color: "from-slate-700 to-slate-900",
  },
  {
    name: "Economy Valet",
    desc: "Perfect for regularly maintained vehicles",
    price: "from £120",
    features: ["Full exterior wash", "Interior deep clean", "Dashboard polish", "Leather treatment", "Window clean"],
    icon: Car,
    popular: false,
    color: "from-blue-700 to-blue-900",
  },
  {
    name: "Premier Valet",
    desc: "Showroom finish — our most popular package",
    price: "from £169",
    features: ["Everything in Economy", "Machine polish", "Paint protection wax", "Engine bay clean", "Odour treatment", "Full inspection"],
    icon: Sparkles,
    popular: true,
    color: "from-blue-500 to-indigo-700",
  },
  {
    name: "Interior Valet",
    desc: "Deep clean for every surface inside",
    price: "from £120",
    features: ["Full interior strip", "Carpet shampooing", "Seat steam clean", "Headliner clean", "Air vent detail"],
    icon: Zap,
    popular: false,
    color: "from-indigo-700 to-indigo-900",
  },
  {
    name: "Exterior Valet",
    desc: "Brilliant paintwork, inside and out",
    price: "from £139",
    features: ["Full exterior wash", "Clay bar treatment", "Polish & wax", "Wheel detail", "Tyre dressing"],
    icon: Shield,
    popular: false,
    color: "from-slate-600 to-slate-800",
  },
];

const STEPS = [
  { num: "01", title: "Book Your Slot", desc: "Call or message us. We'll find a time that works for you — 7 days a week." },
  { num: "02", title: "Drop Off Your Car", desc: "Bring your vehicle to our Guildford centre. We'll inspect and agree on the scope of work." },
  { num: "03", title: "We Get to Work", desc: "Our expert team spends as much time as needed to get it right — no shortcuts." },
  { num: "04", title: "Drive Away Shining", desc: "Collect your car looking better than ever. We'll walk you through everything we did." },
];

export function PremiumCards() {
  return (
    <div className="min-h-screen bg-white font-['Montserrat',sans-serif]">

      {/* HERO */}
      <section className="relative bg-[#0a0f2e] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 20% 60%, #3b82f620 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, #6366f115 0%, transparent 50%)" }} />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1600&q=60')] bg-cover bg-center opacity-15" />
        <div className="relative max-w-6xl mx-auto px-8 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-5 py-2 text-blue-300 text-xs font-bold tracking-widest uppercase mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Private Vehicle Valeting · Guildford
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Choose the package<br />
            <span className="text-blue-400">that suits your car</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Individually tailored valeting packages for private vehicles. Over 25 years of experience. Fully insured.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:07717310046" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-full text-sm transition-all shadow-lg shadow-blue-600/30">
              <Phone className="h-4 w-4" /> 07717 310 046
            </a>
            <a href="#packages" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-full text-sm transition-all">
              View Packages <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Simple Process</span>
            <h2 className="text-4xl font-black text-[#0a0f2e] mt-2">How it works</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-0px)] w-full h-px bg-blue-200 z-0" style={{ left: "calc(100% - 24px)", width: "calc(100% - 20px)" }} />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#0a0f2e] flex items-center justify-center mb-4">
                    <span className="text-blue-400 text-xl font-black">{step.num}</span>
                  </div>
                  <h3 className="font-black text-[#0a0f2e] mb-2 text-[15px]">{step.title}</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Our Packages</span>
            <h2 className="text-4xl font-black text-[#0a0f2e] mt-2">Pick your perfect valet</h2>
            <p className="text-gray-500 mt-3 text-[15px]">Prices vary by vehicle size. Call us for a free quote.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {PACKAGES.slice(0, 3).map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.name}
                  className={`relative rounded-3xl overflow-hidden shadow-lg ${pkg.popular ? "ring-2 ring-blue-500 scale-[1.02]" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10">
                      Most Popular
                    </div>
                  )}
                  <div className={`bg-gradient-to-br ${pkg.color} p-8 text-white`}>
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black mb-1">{pkg.name}</h3>
                    <p className="text-white/65 text-sm mb-5">{pkg.desc}</p>
                    <p className="text-4xl font-black">{pkg.price}</p>
                  </div>
                  <div className="bg-gray-50 p-6">
                    <ul className="space-y-2.5 mb-6">
                      {pkg.features.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a href="#contact" className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${pkg.popular ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-[#0a0f2e] hover:bg-blue-900 text-white"}`}>
                      Book This Package <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PACKAGES.slice(3).map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div key={pkg.name} className="rounded-3xl overflow-hidden shadow-md flex">
                  <div className={`bg-gradient-to-br ${pkg.color} p-6 text-white w-48 flex-shrink-0 flex flex-col justify-between`}>
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{pkg.name}</h3>
                      <p className="text-2xl font-black text-white mt-1">{pkg.price}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 flex-1">
                    <p className="text-gray-500 text-sm mb-4">{pkg.desc}</p>
                    <ul className="space-y-2">
                      {pkg.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-[#0a0f2e] py-14">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: "🏆", val: "25+", label: "Years Experience" },
              { icon: "😊", val: "5,000+", label: "Happy Customers" },
              { icon: "🛡️", val: "100%", label: "Fully Insured" },
              { icon: "⭐", val: "5 Stars", label: "Rated Service" },
            ].map(item => (
              <div key={item.label}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-white text-2xl font-black">{item.val}</p>
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <blockquote className="text-gray-600 text-lg leading-relaxed italic mb-8">
            "My Audi A6 looked brand new. It is rare to find someone who takes real pride in their work — Smart Shine is one of those rare businesses. I cannot recommend them highly enough."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#0a0f2e] flex items-center justify-center">
              <span className="text-white font-black">A</span>
            </div>
            <div className="text-left">
              <p className="font-black text-gray-900">Adrian Shaw</p>
              <p className="text-sm text-blue-600 font-medium">Verified Customer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Ready to book?</h2>
        <p className="text-blue-100 mb-8 text-lg">Call us today for a free quote — 7 days a week</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="tel:07717310046" className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-8 py-4 rounded-full hover:bg-blue-50 transition-all">
            <Phone className="h-4 w-4" /> 07717 310 046
          </a>
          <a href="tel:01483236060" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/25 transition-all">
            <Phone className="h-4 w-4" /> 01483 236 060
          </a>
        </div>
        <p className="text-blue-200/70 text-sm mt-6">Mon – Sun · 08:00 – 19:00</p>
      </section>
    </div>
  );
}
