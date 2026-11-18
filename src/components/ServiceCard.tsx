import Link from "next/link";
import { MapPin, User } from "lucide-react";

export type Service = {
  _id: string; title: string; category: string; image: string;
  serviceMode: string; serviceArea: string; basePrice: number; technicianName: string;
};

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition h-full">
      <figure className="h-48 bg-base-200">
        <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body p-5 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="badge badge-accent badge-soft">{s.category}</span>
          <span className="badge badge-outline">{s.serviceMode}</span>
        </div>
        <h3 className="card-title text-lg mt-1 line-clamp-1">{s.title}</h3>
        <p className="text-sm text-base-content/70 flex items-center gap-1"><MapPin size={14} /> {s.serviceArea}</p>
        <p className="text-sm text-base-content/70 flex items-center gap-1"><User size={14} /> {s.technicianName}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="text-sm">From <span className="text-xl font-extrabold text-primary">${s.basePrice}</span></p>
          <Link href={`/services/${s._id}`} className="btn btn-secondary btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
}