import Link from "next/link";
import { SearchX } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { getServices } from "@/lib/services";
import { fetchCategories } from "@/lib/public";

type SP = { search?: string; category?: string; mode?: string; sort?: string };

// Filter results depend on searchParams, so this segment is allowed to block
// the navigation instead of producing an instant static shell.
export const instant = false;

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [services, taxonomy] = await Promise.all([getServices(sp), fetchCategories()]);
  const hasFilter = !!(sp.search || sp.category || sp.mode || sp.sort);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="section-title">Browse Services</h1>
      <p className="section-sub">Find a verified technician for your device or appliance.</p>

      <form className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <input name="search" defaultValue={sp.search} placeholder="Search by title or category" className="input w-full" />
        <select name="category" defaultValue={sp.category ?? ""} className="select w-full">
          <option value="">All Categories</option>
          {taxonomy.categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="mode" defaultValue={sp.mode ?? ""} className="select w-full">
          <option value="">All Modes</option>
          {taxonomy.modes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="sort" defaultValue={sp.sort ?? ""} className="select w-full">
          <option value="">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <div className="flex gap-2">
          <button className="btn btn-secondary">Apply</button>
          {hasFilter && <Link href="/services" className="btn btn-ghost">Clear</Link>}
        </div>
      </form>

      <p className="mt-6 text-sm text-base-content/60">{services.length} service(s) found</p>

      {services.length === 0 ? (
        <div className="mt-6 text-center bg-base-200 rounded-box py-16 px-4">
          <SearchX size={40} className="mx-auto text-secondary" />
          <h3 className="font-bold text-primary text-lg mt-3">No services match your search</h3>
          <p className="text-sm text-base-content/60 mt-1">Try a different keyword or clear the filters.</p>
          <Link href="/services" className="btn btn-secondary btn-sm mt-4">Clear Filters</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => <ServiceCard key={s._id} s={s} />)}
        </div>
      )}
    </section>
  );
}