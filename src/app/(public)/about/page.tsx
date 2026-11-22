import Link from "next/link";
import {
  Search, ClipboardList, Wrench, CreditCard, UserRound, HardHat, ShieldCheck,
  ArrowRight, BadgeCheck, Wallet, Radio, CheckCircle2,
} from "lucide-react";
import CTABanner from "@/components/CTABanner";

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse approved services and filter by category, mode and price." },
  { icon: ClipboardList, title: "Send a Request", text: "Share your phone, address, date and the problem description." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track the job: Requested, Accepted, In Progress, Completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely with Stripe only after the work is delivered." },
];

const roles = [
  {
    icon: UserRound, title: "Customer", text: "Browse services, send requests, cancel while requested, and pay for completed jobs.",
    bullets: ["Book in under a minute", "Live job status", "Pay after completion"],
  },
  {
    icon: HardHat, title: "Technician", text: "List repair services, accept or reject requests, update job status, and set the final amount.",
    bullets: ["Create your own listings", "Control your schedule", "Get paid for finished jobs"],
  },
  {
    icon: ShieldCheck, title: "Admin", text: "Approve services, manage users and roles, and monitor all bookings and transactions.",
    bullets: ["Approve every listing", "Manage roles", "Monitor transactions"],
  },
];

const why = [
  { icon: BadgeCheck, title: "Verified technicians", text: "Every technician is reviewed before listings go live." },
  { icon: Wallet, title: "Transparent pricing", text: "See the starting price upfront — no hidden charges." },
  { icon: Radio, title: "Live job tracking", text: "Follow your repair from request to completion." },
  { icon: ShieldCheck, title: "Secure payments", text: "Card payments via Stripe, released only after the job." },
];

export default function About() {
  return (
    <>
      {/* ============ Hero ============ */}
      <section className="hero-pattern text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <span className="inline-flex items-center gap-2 bg-secondary text-secondary-content text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            <ShieldCheck size={14} /> How FixMate Works
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
            Finding a trustworthy repair technician shouldn’t be hard.
          </h1>
          <p className="mt-4 text-primary-content/75 max-w-2xl mx-auto text-lg">
            FixMate gives every job a clear status, a verified professional and makes sure you pay
            only after the work is done.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/services" className="btn btn-secondary btn-lg gap-2">
              Browse Services <ArrowRight size={18} />
            </Link>
            <Link href="/sign-up" className="btn btn-lg border-white/40 bg-white/10 text-primary-content hover:bg-white hover:text-primary">
              Become a Technician
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Four steps (timeline) ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-secondary">Step by step</span>
          <h2 className="section-title mt-2">Four simple steps</h2>
          <p className="section-sub mx-auto text-center">From broken to fixed — with full visibility at every stage.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative bg-base-100 border border-base-300 rounded-3xl p-6 card-hover">
              <span className="absolute top-5 right-5 text-5xl font-extrabold text-base-200 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-content flex items-center justify-center relative z-10">
                <s.icon size={22} />
              </div>
              <h3 className="font-bold text-primary mt-4">{s.title}</h3>
              <p className="text-sm text-base-content/70 mt-1.5">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Why FixMate ============ */}
      <section className="bg-base-200 mt-16 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow text-secondary">Why FixMate</span>
            <h2 className="section-title mt-2">Built for safe, predictable repairs</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title} className="bg-base-100 rounded-3xl p-6 border border-base-300 card-hover">
                <span className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <w.icon size={22} />
                </span>
                <h3 className="font-bold text-primary mt-4">{w.title}</h3>
                <p className="text-sm text-base-content/70 mt-1">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Who uses FixMate ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-secondary">For everyone</span>
          <h2 className="section-title mt-2">Who uses FixMate</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="bg-base-100 border border-base-300 rounded-3xl p-6 card-hover flex flex-col">
              <span className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center">
                <r.icon size={24} />
              </span>
              <h3 className="font-bold text-primary text-lg mt-4">{r.title}</h3>
              <p className="text-sm text-base-content/70 mt-1.5">{r.text}</p>
              <ul className="mt-4 pt-4 border-t border-base-300 space-y-2 text-sm text-base-content/75 flex-1">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-success shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
