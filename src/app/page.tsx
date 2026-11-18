import Link from "next/link";
import { Search, ShieldCheck, Smartphone, Laptop, Snowflake, Thermometer, Tv, WashingMachine, Zap, ClipboardList, Wrench, CreditCard } from "lucide-react";
import ServiceCard, { Service } from "@/components/ServiceCard";

const categories = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Snowflake },
  { name: "Refrigerator", icon: Thermometer },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", icon: Zap },
];

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse verified technicians and services." },
  { icon: ClipboardList, title: "Send a Request", text: "Describe the problem and pick a date." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track every step of your job live." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely only when work is done." },
];

const mock: Service[] = Array.from({ length: 6 }).map((_, i) => ({
  _id: String(i + 1),
  title: ["iPhone Screen Replacement", "Laptop Servicing", "AC Gas Refill", "Fridge Repair", "LED TV Repair", "Washer Motor Fix"][i],
  category: ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine"][i],
  image: `https://picsum.photos/seed/fixmate${i}/600/400`,
  serviceMode: i % 2 ? "Shop Drop-off" : "Home Visit",
  serviceArea: "Barishal Sadar",
  basePrice: 15 + i * 7,
  technicianName: "Rahim Uddin",
}));

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-[#1b4a7a] text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge badge-secondary mb-4 gap-1"><ShieldCheck size={14} /> Verified Technicians</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Broken Device? Get It Fixed by <span className="text-secondary">Verified Technicians</span>
            </h1>
            <p className="mt-4 text-primary-content/80 max-w-lg">
              Request a repair, track every step, and pay only after the job is completed.
            </p>
            <form action="/services" className="mt-8 flex gap-2 max-w-lg">
              <input name="search" placeholder="Search iPhone, AC, laptop..." className="input input-lg w-full text-base-content" />
              <button className="btn btn-secondary btn-lg">Search</button>
            </form>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://picsum.photos/seed/fixmatehero/800/560"
              alt="Technician repairing a device"
              className="rounded-3xl shadow-2xl w-full h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <h2 className="section-title">Featured Services</h2>
        <p className="section-sub">Latest approved services from trusted technicians.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mock.map((s) => <ServiceCard key={s._id} s={s} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-base-200 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-center">How FixMate Works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="bg-base-100 rounded-box p-6 text-center shadow-sm border border-base-300">
                <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                  <s.icon size={26} />
                </div>
                <p className="text-xs font-bold text-base-content/50 mt-3">STEP {i + 1}</p>
                <h3 className="font-bold text-primary mt-1">{s.title}</h3>
                <p className="text-sm text-base-content/70 mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <h2 className="section-title">Popular Categories</h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/services?category=${encodeURIComponent(c.name)}`}
              className="flex items-center gap-3 p-5 rounded-box border border-base-300 hover:border-secondary hover:bg-secondary/10 transition"
            >
              <c.icon className="text-secondary" />
              <span className="font-semibold text-primary">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us / stats */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-primary text-primary-content rounded-3xl p-10 grid gap-6 sm:grid-cols-3 text-center">
          {[["500+", "Verified Technicians"], ["12k+", "Jobs Completed"], ["100%", "Pay After Service"]].map(([n, l]) => (
            <div key={l}>
              <p className="text-4xl font-extrabold text-secondary">{n}</p>
              <p className="text-sm mt-1 text-primary-content/80">{l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}