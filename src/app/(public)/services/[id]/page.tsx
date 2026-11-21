import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock, MapPin, Wrench, Tag, ChevronRight, BadgeCheck, Home, Store,
  ShieldCheck, CreditCard, ArrowRight, SearchX,
} from "lucide-react";
import { getService, getServices } from "@/lib/services";
import RequestPanel from "@/components/RequestPanel";
import ServiceCard from "@/components/ServiceCard";

// Detail page is param-driven; allow the segment to block instead of forcing an
// instant static shell (params are only known at request time).
export const instant = false;

const MODE_ICON: Record<string, typeof Home> = { "Home Visit": Home, "Shop Drop-off": Store };

export default async function ServiceDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getService(id);
  if (!s) notFound();

  // similar services (Thumbtack-style "you may also like")
  const relatedAll = await getServices({ category: s.category, limit: 8 });
  const similar = relatedAll.filter((r) => r._id !== s._id).slice(0, 4);

  const ModeIcon = MODE_ICON[s.serviceMode] ?? Home;
  const info = [
    { icon: Tag, label: "Category", value: s.category },
    { icon: Wrench, label: "Service Mode", value: s.serviceMode },
    { icon: MapPin, label: "Service Area", value: s.serviceArea },
    { icon: Clock, label: "Estimated Duration", value: s.estimatedDuration },
  ];

  const guarantees = [
    { icon: CreditCard, title: "Pay after completion", text: "No advance payment — pay when the work is done." },
    { icon: ShieldCheck, title: "30-day warranty", text: "Free follow-up if the same issue returns." },
    { icon: BadgeCheck, title: "Verified technician", text: "Identity and skills checked by FixMate." },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-base-content/55 flex flex-wrap items-center gap-1.5">
        <Link href="/" className="hover:text-secondary font-medium">Home</Link>
        <ChevronRight size={14} />
        <Link href="/services" className="hover:text-secondary font-medium">Services</Link>
        <ChevronRight size={14} />
        <Link
          href={`/services?category=${encodeURIComponent(s.category)}`}
          className="hover:text-secondary font-medium"
        >
          {s.category}
        </Link>
        <ChevronRight size={14} />
        <span className="text-base-content/80 font-semibold line-clamp-1 max-w-[45vw]">{s.title}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-3">
        {/* ============ main column ============ */}
        <div className="lg:col-span-2 min-w-0">
          {/* hero image with overlay badges */}
          <div className="relative rounded-3xl overflow-hidden border border-base-300 shadow-sm">
            <img src={s.image} alt={s.title} className="w-full h-64 md:h-96 object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-5 flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-secondary gap-1"><BadgeCheck size={13} /> Verified</span>
                <span className="badge gap-1 bg-base-100/95 text-base-content border-transparent backdrop-blur">
                  <ModeIcon size={13} /> {s.serviceMode}
                </span>
              </div>
              <span className="badge badge-accent badge-soft">{s.category}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mt-6 leading-tight">{s.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-base-content/65">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-secondary" /> {s.serviceArea}</span>
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-secondary" /> {s.estimatedDuration}</span>
            <span className="flex items-center gap-1.5 text-success font-semibold">
              <ShieldCheck size={15} /> Verified technician
            </span>
          </div>

          <p className="mt-5 text-base-content/75 leading-relaxed whitespace-pre-line">{s.description}</p>

          {/* quick info tiles */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {info.map((i) => (
              <div key={i.label} className="flex items-center gap-3 border border-base-300 rounded-2xl p-4 bg-base-100">
                <span className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <i.icon size={19} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-base-content/55">{i.label}</p>
                  <p className="font-semibold text-primary truncate">{i.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* guarantees */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {guarantees.map((g) => (
              <div key={g.title} className="bg-base-200 border border-base-300 rounded-2xl p-4">
                <g.icon size={20} className="text-success" />
                <p className="font-bold text-primary text-sm mt-2">{g.title}</p>
                <p className="text-xs text-base-content/65 mt-1">{g.text}</p>
              </div>
            ))}
          </div>

          {/* technician card */}
          <div className="mt-8 border border-base-300 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start bg-base-100">
            {s.technician.image ? (
              <img
                src={s.technician.image}
                alt={s.technicianName}
                className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-base-300"
              />
            ) : (
              <span className="bg-primary text-primary-content w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0">
                {(s.technicianName || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">Your technician</p>
                <span className="badge badge-soft badge-success badge-sm gap-1">
                  <BadgeCheck size={12} /> Verified
                </span>
              </div>
              <p className="font-bold text-primary text-xl mt-0.5">{s.technicianName}</p>
              <p className="text-sm text-base-content/60 flex items-center gap-1.5 mt-0.5">
                <MapPin size={14} /> {s.technician.area}
              </p>
              <p className="text-sm text-base-content/70 mt-2 leading-relaxed">{s.technician.bio}</p>
            </div>
          </div>
        </div>

        {/* ============ sticky booking card ============ */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="border border-base-300 rounded-3xl overflow-hidden shadow-sm bg-base-100">
            <div className="bg-base-200 px-6 py-5 border-b border-base-300">
              <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">Starting price</p>
              <p className="text-4xl font-extrabold text-primary mt-1">${s.basePrice}</p>
              <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1.5">
                <Clock size={13} /> Est. {s.estimatedDuration} · {s.serviceMode}
              </p>
            </div>

            <div className="p-6">
              <Suspense fallback={<div className="skeleton h-12 w-full mt-2" />}>
                <RequestPanel service={{ _id: s._id, title: s.title, technicianEmail: s.technicianEmail }} />
              </Suspense>

              <ul className="mt-5 pt-5 border-t border-base-300 space-y-2.5 text-sm text-base-content/70">
                {[
                  "Pay only after the job is completed",
                  "Track status: Requested → Completed",
                  "Free 30-day follow-up warranty",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <ShieldCheck size={15} className="text-success shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-primary text-primary-content rounded-3xl p-5 text-center">
            <p className="font-bold">Not sure what you need?</p>
            <p className="text-xs text-primary-content/70 mt-1">Describe the problem — the technician will confirm on request.</p>
            <Link href="/services" className="btn btn-secondary btn-sm mt-3 gap-2">
              Browse other services <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* ============ similar services ============ */}
      {similar.length > 0 && (
        <div className="mt-16">
          <div className="section-head">
            <div>
              <span className="eyebrow text-secondary">More like this</span>
              <h2 className="section-title mt-2 text-2xl md:text-3xl">Similar services</h2>
            </div>
            <Link
              href={`/services?category=${encodeURIComponent(s.category)}`}
              className="btn btn-outline btn-sm gap-2 hidden sm:inline-flex"
            >
              View all in {s.category} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((r) => <ServiceCard key={r._id} s={r} />)}
          </div>
        </div>
      )}

      {similar.length === 0 && (
        <div className="mt-16 text-center bg-base-200 border border-base-300 rounded-3xl py-10 px-4">
          <SearchX size={28} className="mx-auto text-base-content/40" />
          <p className="text-sm text-base-content/60 mt-2">No other services listed in this category yet.</p>
          <Link href="/services" className="btn btn-outline btn-sm mt-4">Browse all services</Link>
        </div>
      )}
    </section>
  );
}
