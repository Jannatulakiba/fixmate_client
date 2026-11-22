import Link from "next/link";
import {
  Search, ShieldCheck, BadgeCheck, Smartphone, Laptop, Snowflake, Thermometer, Tv,
  WashingMachine, Zap, Wrench, ClipboardList, CreditCard, ArrowRight, CheckCircle2,
  MapPin, Clock, Headphones, type LucideIcon,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import { getServices } from "@/lib/services";
import { fetchCategories, fetchPublicStats, fmtCount } from "@/lib/public";

// Category name -> icon (name gula API theke ashe, icon lokal)
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Smartphone,
  "Laptop & PC": Laptop,
  AC: Snowflake,
  Refrigerator: Thermometer,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Zap,
};

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse verified technicians and services near you." },
  { icon: ClipboardList, title: "Send a Request", text: "Describe the problem and pick your preferred date." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track every step of your job live, start to finish." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely only when the work is done." },
];

// Trust bar — Sheba / Urban Company style USP strip
const trustPoints = [
  { icon: BadgeCheck, title: "Verified Technicians", text: "ID & skill checked" },
  { icon: CreditCard, title: "Pay After Completion", text: "No advance payment" },
  { icon: MapPin, title: "Live Job Tracking", text: "Status at every step" },
  { icon: ShieldCheck, title: "Service Warranty", text: "30-day follow-up" },
];

const heroBullets = [
  "Pay only after completion",
  "Live status updates",
  "On-time arrival",
  "30-day service warranty",
];

export default async function Home() {
  const [featured, taxonomy, stats] = await Promise.all([
    getServices({ limit: 6 }),
    fetchCategories(),
    fetchPublicStats(),
  ]);

  const categories = taxonomy.categories.map((name) => ({ name, icon: CATEGORY_ICONS[name] ?? Wrench }));
  const heroImage = featured[0]?.image ?? "https://picsum.photos/seed/fixmatehero/800/560";

  const statTiles = stats
    ? [
      [fmtCount(stats.verifiedTechnicians), "Verified Technicians", BadgeCheck],
      [fmtCount(stats.jobsCompleted), "Jobs Completed", Wrench],
      [fmtCount(stats.servicesListed), "Services Listed", ClipboardList],
      [fmtCount(stats.customers), "Happy Customers", ShieldCheck],
    ] as const
    : [];

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden hero-pattern text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-secondary text-secondary-content text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow">
              <ShieldCheck size={14} /> 100% Verified Technicians
            </span>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-[1.12]">
              Broken device Get it fixed by{" "}
              <span className="text-secondary">verified technicians</span>.
            </h1>

            <p className="mt-4 text-primary-content/75 text-lg max-w-xl">
              Request a repair, track every step live, and pay only after the job is completed.
            </p>

            {/* Thumbtack-style search bar */}
            <form action="/services" className="mt-8 bg-base-100 rounded-2xl p-2 flex gap-2 shadow-2xl max-w-xl">
              <Search size={20} className="text-base-content/45 self-center ml-2 shrink-0" />
              <input
                name="search"
                placeholder="Search iPhone screen, AC not cooling, laptop..."
                className="input border-0 bg-transparent flex-1 min-w-0 text-base-content focus:outline-none"
                aria-label="Search services"
              />
              <button className="btn btn-secondary btn-lg gap-2 shrink-0">
                Search <ArrowRight size={16} />
              </button>
            </form>

            {/* popular quick searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-primary-content/70">
              <span className="text-[11px] font-bold uppercase tracking-widest">Popular:</span>
              {categories.slice(0, 4).map((c) => (
                <Link
                  key={c.name}
                  href={`/services?category=${encodeURIComponent(c.name)}`}
                  className="btn btn-xs rounded-full border border-white/30 bg-white/10 text-primary-content hover:bg-white hover:text-primary"
                >
                  {c.name}
                </Link>
              ))}
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 max-w-xl text-sm text-primary-content/85">
              {heroBullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-secondary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* image + floating proof cards */}
          <div className="relative hidden lg:block">
            <img
              src={heroImage}
              alt="Technician repairing a device"
              className="rounded-3xl shadow-2xl w-full h-[440px] object-cover border border-white/20"
            />
            <div className="absolute -left-7 top-10 bg-base-100 text-base-content rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-base-300">
              <span className="w-11 h-11 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                <BadgeCheck size={22} />
              </span>
              <div>
                <p className="font-bold text-sm leading-tight">Verified technician</p>
                <p className="text-xs text-base-content/60">ID & skills verified</p>
              </div>
            </div>
            <div className="absolute -right-6 bottom-12 bg-secondary text-secondary-content rounded-2xl shadow-2xl px-5 py-4 border border-white/40">
              <p className="text-3xl font-extrabold leading-none">
                {stats ? fmtCount(stats.jobsCompleted) : "1k+"}
              </p>
              <p className="text-xs font-bold mt-1">Jobs completed</p>
            </div>
            <div className="absolute left-8 -bottom-5 bg-base-100 text-base-content rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-2 border border-base-300">
              <span className="stars">{Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
                  <path d="M12 2l2.9 6.26 6.6.72-4.9 4.5 1.35 6.52L12 16.9l-5.95 3.1L7.4 13.48 2.5 8.98l6.6-.72L12 2z" />
                </svg>
              ))}</span>
              <span className="text-xs font-bold">Trusted by customers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Trust bar ============ */}
      <section className="border-b border-base-300 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 py-7 grid gap-6 grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((t) => (
            <div key={t.title} className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center shrink-0">
                <t.icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-primary text-sm leading-tight">{t.title}</p>
                <p className="text-xs text-base-content/55 mt-0.5">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Categories ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="section-head">
          <div>
            <span className="eyebrow text-secondary">Browse by category</span>
            <h2 className="section-title mt-2">Popular Categories</h2>
            <p className="section-sub">Pick your device or appliance and get matched with a specialist.</p>
          </div>
          <Link href="/services" className="btn btn-outline btn-sm gap-2 hidden sm:inline-flex">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/services?category=${encodeURIComponent(c.name)}`}
              className="group bg-base-100 border border-base-300 rounded-3xl p-5 card-hover flex flex-col gap-3"
            >
              <span className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center transition group-hover:bg-secondary group-hover:text-secondary-content">
                <c.icon size={24} />
              </span>
              <div>
                <p className="font-bold text-primary">{c.name}</p>
                <p className="text-xs text-base-content/55 mt-0.5 flex items-center gap-1">
                  Browse services <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Featured services ============ */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <div className="section-head">
            <div>
              <span className="eyebrow text-secondary">Featured</span>
              <h2 className="section-title mt-2">Featured Services</h2>
              <p className="section-sub">Latest approved services from trusted technicians.</p>
            </div>
            <Link href="/services" className="btn btn-outline btn-sm gap-2 hidden sm:inline-flex">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => <ServiceCard key={s._id} s={s} />)}
          </div>
        </section>
      )}

      {/* ============ How it works ============ */}
      <section className="bg-base-200 mt-16 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow text-secondary">Simple & transparent</span>
            <h2 className="section-title mt-2">How FixMate Works</h2>
            <p className="section-sub mx-auto text-center">Four easy steps from problem to fixed — with no payment until you are satisfied.</p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
            {/* connecting line */}
            <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] border-t-2 border-dashed border-secondary/40 z-0" />
            {steps.map((s, i) => (
              <div key={s.title} className="relative z-10 bg-base-100 rounded-3xl p-6 text-center shadow-sm border border-base-300 card-hover">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary text-primary-content flex items-center justify-center shadow-lg relative">
                  <s.icon size={26} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-content text-xs font-extrabold flex items-center justify-center border-2 border-base-100">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-primary mt-4">{s.title}</h3>
                <p className="text-sm text-base-content/70 mt-1.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Live stats ============ */}
      {statTiles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <div className="rounded-3xl bg-primary text-primary-content hero-pattern px-6 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {statTiles.map(([n, l, Icon]) => (
              <div key={l} className="flex flex-col items-center">
                <span className="w-11 h-11 rounded-xl bg-white/10 text-secondary flex items-center justify-center mb-3">
                  <Icon size={22} />
                </span>
                <p className="text-4xl font-extrabold text-secondary">{n}</p>
                <p className="text-sm mt-1 text-primary-content/75">{l}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ Coverage / support strip ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Nationwide coverage", text: "Technicians across major cities and districts in Bangladesh." },
            { icon: Clock, title: "Same-day response", text: "Most requests get an accepted technician within hours." },
            { icon: Headphones, title: "Human support", text: "Real people help you if anything goes wrong with a job." },
          ].map((f) => (
            <div key={f.title} className="bg-base-100 border border-base-300 rounded-3xl p-6 card-hover">
              <span className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <f.icon size={22} />
              </span>
              <h3 className="font-bold text-primary mt-4">{f.title}</h3>
              <p className="text-sm text-base-content/70 mt-1">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      <Testimonials />

      {/* ============ CTA ============ */}
      <CTABanner />
    </>
  );
}
