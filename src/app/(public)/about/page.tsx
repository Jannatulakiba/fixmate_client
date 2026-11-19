import Link from "next/link";
import { Search, ClipboardList, Wrench, CreditCard, UserRound, HardHat, ShieldCheck } from "lucide-react";

const steps = [
  { icon: Search, title: "Find a Service", text: "Browse approved services and filter by category, mode and price." },
  { icon: ClipboardList, title: "Send a Request", text: "Share your phone, address, date and the problem description." },
  { icon: Wrench, title: "Technician Fixes It", text: "Track the job: Requested, Accepted, In Progress, Completed." },
  { icon: CreditCard, title: "Pay After Completion", text: "Pay securely with Stripe only after the work is delivered." },
];

const roles = [
  { icon: UserRound, title: "Customer", text: "Browse services, send requests, cancel while requested, and pay for completed jobs." },
  { icon: HardHat, title: "Technician", text: "List repair services, accept or reject requests, update job status, and set the final amount." },
  { icon: ShieldCheck, title: "Admin", text: "Approve services, manage users and roles, and monitor all bookings and transactions." },
];

export default function About() {
  return (
    <>
      <section className="bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold">How FixMate Works</h1>
          <p className="mt-3 text-primary-content/80 max-w-2xl mx-auto">
            Finding a trustworthy repair technician is hard. FixMate gives every job a clear status and
            makes sure you pay only after the work is done.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="section-title">Four simple steps</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="border border-base-300 rounded-box p-6">
              <div className="w-12 h-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                <s.icon size={22} />
              </div>
              <p className="text-xs font-bold text-base-content/50 mt-3">STEP {i + 1}</p>
              <h3 className="font-bold text-primary">{s.title}</h3>
              <p className="text-sm text-base-content/70 mt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="section-title">Who uses FixMate</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="bg-base-200 rounded-box p-6">
              <r.icon className="text-secondary" />
              <h3 className="font-bold text-primary mt-3">{r.title}</h3>
              <p className="text-sm text-base-content/70 mt-1">{r.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/services" className="btn btn-secondary btn-lg">Browse Services</Link>
        </div>
      </section>
    </>
  );
}