import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Clock, MapPin, Wrench, Tag } from "lucide-react";
import { getService } from "@/lib/services";
import RequestPanel from "@/components/RequestPanel";

// Detail page is param-driven; allow the segment to block instead of forcing an
// instant static shell (params are only known at request time).
export const instant = false;

export default async function ServiceDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await getService(id);
  if (!s) notFound();

  const info = [
    { icon: Tag, label: "Category", value: s.category },
    { icon: Wrench, label: "Service Mode", value: s.serviceMode },
    { icon: MapPin, label: "Service Area", value: s.serviceArea },
    { icon: Clock, label: "Estimated Duration", value: s.estimatedDuration },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <img src={s.image} alt={s.title} className="w-full h-72 md:h-96 object-cover rounded-box" />
        <span className="badge badge-accent badge-soft mt-6">{s.category}</span>
        <h1 className="text-3xl font-extrabold text-primary mt-2">{s.title}</h1>
        <p className="mt-4 text-base-content/70 leading-relaxed">{s.description}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {info.map((i) => (
            <div key={i.label} className="flex items-center gap-3 border border-base-300 rounded-box p-4">
              <i.icon size={20} className="text-secondary" />
              <div>
                <p className="text-xs text-base-content/60">{i.label}</p>
                <p className="font-semibold text-primary">{i.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-base-300 rounded-box p-5 flex gap-4 items-start">
          {s.technician.image ? (
            <img src={s.technician.image} alt={s.technicianName} className="w-16 h-16 rounded-full object-cover shrink-0" />
          ) : (
            <span className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
              {(s.technicianName || "?").charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-xs text-base-content/60">Technician</p>
            <p className="font-bold text-primary">{s.technicianName}</p>
            <p className="text-sm text-base-content/60 flex items-center gap-1"><MapPin size={14} /> {s.technician.area}</p>
            <p className="text-sm text-base-content/70 mt-2">{s.technician.bio}</p>
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 h-fit border border-base-300 rounded-box p-6 shadow-sm">
        <p className="text-sm text-base-content/60">Starting price</p>
        <p className="text-4xl font-extrabold text-primary">${s.basePrice}</p>
        <p className="text-xs text-base-content/60 mt-1">Pay only after the job is completed.</p>
        <Suspense fallback={<div className="skeleton h-12 w-full mt-6" />}>
          <RequestPanel service={{ _id: s._id, title: s.title, technicianEmail: s.technicianEmail }} />
        </Suspense>
      </aside>
    </section>
  );
}