import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Home, Store } from "lucide-react";

export type Service = {
  _id: string; title: string; category: string; image: string;
  serviceMode: string; serviceArea: string; basePrice: number; technicianName: string;
};

const MODE_ICON: Record<string, typeof Home> = { "Home Visit": Home, "Shop Drop-off": Store };

export default function ServiceCard({ s }: { s: Service }) {
  const ModeIcon = MODE_ICON[s.serviceMode] ?? Home;

  return (
    <Link
      href={`/services/${s._id}`}
      className="group card bg-base-100 border border-base-300 overflow-hidden card-hover h-full flex flex-col"
    >
      {/* image + overlays */}
      <figure className="relative h-44 shrink-0 bg-base-200 overflow-hidden">
        <img
          src={s.image}
          alt={s.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 badge badge-secondary badge-sm gap-1 shadow">
          <BadgeCheck size={13} /> Verified Done
        </span>
        <span className="absolute top-3 right-3 badge badge-sm gap-1 bg-base-100/95 text-base-content border-transparent backdrop-blur">
          <ModeIcon size={13} /> {s.serviceMode}
        </span>
        <span className="absolute bottom-3 left-3 badge badge-accent badge-soft badge-sm">
          {s.category}
        </span>
      </figure>

      <div className="card-body p-4 flex flex-col gap-1.5">
        <h3 className="font-bold text-primary leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
          {s.title}
        </h3>

        <p className="text-sm text-base-content/60 flex items-center gap-1.5 line-clamp-1">
          <MapPin size={14} className="shrink-0 text-base-content/40" /> {s.serviceArea}
        </p>

        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <span className="w-6 h-6 rounded-full bg-primary text-primary-content text-[11px] font-bold flex items-center justify-center shrink-0">
            {(s.technicianName || "?").charAt(0).toUpperCase()}
          </span>
          <span className="truncate">{s.technicianName}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-base-300 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/45">
              Starting at
            </p>
            <p className="text-xl font-extrabold text-primary leading-tight">${s.basePrice}</p>
          </div>
          <span className="btn btn-secondary btn-sm gap-1">
            Book Now <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
