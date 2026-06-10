import { ArrowRight, CheckCircle, Star, Phone, Sparkles, ChevronRight, Award, Users, Clock } from "lucide-react";

const PACKAGES = [
  { name: "Mini Valet", price: "from £45", tag: "Quick Refresh", features: ["Exterior wash & dry", "Interior vacuum", "Window polish", "Tyre shine"] },
  { name: "Economy Valet", price: "from £120", tag: "Maintained Cars", features: ["Full exterior wash", "Interior deep clean", "Dashboard polish", "Leather treatment", "Window clean inside & out"] },
  { name: "Premier Valet", price: "from £169", tag: "⭐ Best Value", features: ["Everything in Economy", "Machine polish", "Paint protection wax", "Engine bay clean", "Odour treatment", "Full decontamination wash"], highlight: true },
  { name: "Interior Valet", price: "from £120", tag: "Interior Specialist", features: ["Full interior strip out", "Carpet shampooing", "Steam cleaning seats", "Headliner clean", "Air vent detailing"] },
  { name: "Exterior Valet", price: "from £139", tag: "Exterior Specialist", features: ["Full exterior wash", "Clay bar treatment", "Hand polish & wax", "Wheel detailing", "Tyre dressing"] },
  { name: "Commercial", price: "Call us", tag: "Fleets & Vans", features: ["Tailored to your fleet", "Competitive rates", "Flexible scheduling", "Fully insured team", "Guildford & surrounds"] },
];

export function ModernLanding() {
  return (
    <div className="min-h-screen font-['Montserrat',sans-serif] bg-[#050917]">

      {/* HERO — full-bleed, high contrast */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050917]/95 via-[#050917]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050917] via-transparent to-transparent" />

        {/* animated accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-10 py-32 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-blue-500" />
              <span className="text-blue-400 text-xs font-bold tracking-[0.3em] uppercase">Smart Shine · Guildford</span>
            </div>
            <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-black text-white leading-[0.95] tracking-tight mb-8">
              Private Vehicle<br />
              <span style={{ WebkitTextStroke: "2px #60a5fa", color: "transparent" }}>Valeting</span><br />
              <span className="text-white">Service</span>
            </h1>
            <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg">
              25 years of professional valeting in Guildford. Tailored packages, immaculate results — every single time.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="#packages" className="group inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-4 rounded-2xl text-sm transition-all shadow-2xl shadow-blue-600/30">
                View All Packages
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="tel:07717310046" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold text-sm transition-colors">
                <Phone className="h-4 w-4" />
                07717 310 046
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* floating stats */}
        <div className="absolute right-10 bottom-16 hidden md:flex flex-col gap-3">
          {[
            { val: "25+", label: "Years" },
            { val: "5k+", label: "Customers" },
            { val: "5★", label: "Rating" },
          ].map(s => (
            <div key={s.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-5 py-3 text-right">
              <p className="text-white text-2xl font-black">{s.val}</p>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTRO — dark, bold */}
      <section className="bg-[#050917] py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-blue-500" />
                <span className="text-blue-400 text-xs font-bold tracking-[0.25em] uppercase">Who we are</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                We make your car shine — guaranteed
              </h2>
              <p className="text-white/50 leading-relaxed text-[15px] mb-8">
                Smart Shine Car Valeting Centre has been serving Guildford, Godalming, Woking and surrounding areas for over 25 years. Every package is tailored to your vehicle — we take as much time as needed to achieve the standard you expect.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Award, label: "Fully Insured" },
                  { icon: Users, label: "25+ Years" },
                  { icon: Clock, label: "7 Days/Week" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="border border-white/10 rounded-2xl p-4 text-center">
                    <Icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-white text-xs font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80" alt="Car valeting" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-blue-600 rounded-2xl px-6 py-4 shadow-2xl">
                <p className="text-white text-3xl font-black">5,000+</p>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PACKAGES — dark cards with top accent */}
      <section id="packages" className="bg-[#080d1e] py-24">
        <div className="max-w-6xl mx-auto px-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-blue-500" />
                <span className="text-blue-400 text-xs font-bold tracking-[0.25em] uppercase">Our Packages</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Choose your<br />valet package
              </h2>
            </div>
            <p className="text-white/40 text-sm max-w-xs text-right hidden md:block">
              Prices vary on vehicle size.<br />Call for a free quote.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  pkg.highlight
                    ? "border-blue-500/50 bg-gradient-to-b from-blue-900/40 to-[#080d1e] shadow-xl shadow-blue-500/10"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
                )}
                <div className="p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 ${pkg.highlight ? "bg-blue-500/20 text-blue-300" : "bg-white/8 text-white/50"}`}>
                        {pkg.tag}
                      </span>
                      <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-black ${pkg.highlight ? "text-blue-400" : "text-white"}`}>{pkg.price}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/8 mb-5" />

                  <ul className="space-y-3 mb-7">
                    {pkg.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5">
                        <CheckCircle className={`h-4 w-4 flex-shrink-0 ${pkg.highlight ? "text-blue-400" : "text-white/30"}`} />
                        <span className="text-white/60 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                      pkg.highlight
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-white/8 hover:bg-white/15 text-white"
                    }`}
                  >
                    Book Now <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — bold pull-quote style */}
      <section className="bg-[#050917] py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-10 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
          </div>
          <blockquote className="text-3xl md:text-4xl font-black text-white leading-tight mb-10">
            "The car looked brand new. Smart Shine is one of those rare businesses that takes real pride in their work."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <div className="text-left">
              <p className="font-black text-white">Adrian Shaw</p>
              <p className="text-blue-400 text-sm font-medium">Verified Customer · Audi A6</p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="relative bg-blue-600 py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 20% 50%, #2563eb 0%, transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto px-10 text-center">
          <Sparkles className="h-8 w-8 text-blue-300 mx-auto mb-5" />
          <h2 className="text-5xl font-black text-white mb-4">Book your valet today</h2>
          <p className="text-blue-100/80 text-lg mb-10">Free quotes available · Mon–Sun 08:00–19:00</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:07717310046" className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-8 py-4 rounded-2xl text-sm hover:bg-blue-50 transition-all shadow-xl">
              <Phone className="h-4 w-4" /> 07717 310 046
            </a>
            <a href="tel:01483236060" className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-white/25 transition-all">
              <Phone className="h-4 w-4" /> 01483 236 060
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
