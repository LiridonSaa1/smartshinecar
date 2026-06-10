import { CheckCircle, ArrowRight } from "lucide-react";

const COL1 = [
  "Car & Vehicle Valeting",
  "Car Buffing",
  "Car Detailing",
  "Car Scratch Repairs",
  "Car Valeting",
  "Car Wash",
];
const COL2 = [
  "Commercial Vehicle Valeting",
  "Deep Cleaning",
  "Dent Removal",
  "Exterior Valet",
  "Hand Car Wash",
];
const COL3 = [
  "Interior Valet",
  "Machine Polish",
  "Mini Valets",
  "Private Vehicle Valeting",
  "Stain Removal Services",
  "Wheel Cleaning",
];

function ServiceItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 py-3 border-b border-gray-100 group cursor-default">
      <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="h-4 w-4 text-blue-600" />
      </div>
      <span className="text-[14px] font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
        {label}
      </span>
    </li>
  );
}

export function ListColumns() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-blue-600 text-xs font-black uppercase tracking-widest mb-3">
              Products &amp; Services
            </p>
            <h2
              className="text-5xl font-black tracking-tight leading-tight"
              style={{ color: "#0a0f2e" }}
            >
              Car &amp; Vehicle<br />Services
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-5">
              From quick hand washes to full paint correction and dent removal — we handle every detail.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[14px] font-bold text-white transition-all duration-150"
              style={{ background: "#0a0f2e" }}
            >
              Book a Service
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-10" />

        {/* 3-column list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ul className="list-none m-0 p-0">
            {COL1.map(s => <ServiceItem key={s} label={s} />)}
          </ul>
          <ul className="list-none m-0 p-0">
            {COL2.map(s => <ServiceItem key={s} label={s} />)}
          </ul>
          <ul className="list-none m-0 p-0">
            {COL3.map(s => <ServiceItem key={s} label={s} />)}
          </ul>
        </div>
      </div>
    </div>
  );
}
