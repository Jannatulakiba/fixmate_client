import Link from "next/link";
import { Search, SearchX, SlidersHorizontal, ArrowRight, BadgeCheck } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import CTABanner from "@/components/CTABanner";
import { getServices } from "@/lib/services";
import { fetchCategories } from "@/lib/public";

type SP = { search?: string; category?: string; mode?: string; sort?: string };

// Filter results depend on searchParams, so this segment is allowed to block
// the navigation instead of producing an instant static shell.
export const instant = false;

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default async function ServicesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [services, taxonomy] = await Promise.all([getServices(sp), fetchCategories()]);
  const hasFilter = !!(sp.search || sp.category || sp.mode || sp.sort);
  const activeCategory = sp.category ?? "";

  // preserve non-category filters when switching chips
  const baseParams = new URLSearchParams();
  if (sp.search) baseParams.set("search", sp.search);
  if (sp.mode) baseParams.set("mode", sp.mode);
  if (sp.sort) baseParams.set("sort", sp.sort);
  const allHref = baseParams.toString() ? `/services?${baseParams}` : "/services";

  return (
    <>
      {/* ============ Search hero (Thumbtack style) ============ */}
      <section className="hero-pattern text-primary-content">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-14">
          <span className="eyebrow text-secondary">Browse & book</span>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">Find a repair service</h1>
          <p className="mt-2 text-primary-content/75 max-w-2xl">
            Search by device, appliance or problem — then book a verified technician in a few clicks.
          </p>

          {/* single filter card — text-base-content so fields don't inherit the hero's white text */}
          <form className="mt-7 bg-base-100 rounded-3xl p-3 shadow-2xl grid gap-3 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_auto] text-base-content">
            <label className="flex items-center gap-2 bg-base-200 rounded-2xl px-3 border border-base-300 focus-within:border-secondary transition">
              <Search size={17} className="text-base-content/45 shrink-0" />
              <input
                name="search"
                defaultValue={sp.search}
                placeholder="Search title or category"
                className="input border-0 bg-transparent flex-1 min-w-0 focus:outline-none"
                aria-label="Search services"
              />
            </label>

            <select name="category" defaultValue={activeCategory} className="select w-full rounded-2xl border-base-300 bg-base-200" aria-label="Category">
              <option value="">All Categories</option>
              {taxonomy.categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select name="mode" defaultValue={sp.mode ?? ""} className="select w-full rounded-2xl border-base-300 bg-base-200" aria-label="Service mode">
              <option value="">All Modes</option>
              {taxonomy.modes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <select name="sort" defaultValue={sp.sort ?? ""} className="select w-full rounded-2xl border-base-300 bg-base-200" aria-label="Sort">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <button className="btn btn-secondary btn-lg gap-2 md:col-span-2 lg:col-span-1">
              Apply Filters <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* ============ Quick category chips ============ */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-base-content/45 shrink-0 flex items-center gap-1 mr-1">
            <SlidersHorizontal size={13} /> Category
          </span>
          <Link href={allHref} className={`chip shrink-0 ${!activeCategory ? "chip-active" : ""}`}>
            All
          </Link>
          {taxonomy.categories.map((c) => {
            const params = new URLSearchParams(baseParams.toString());
            params.set("category", c);
            return (
              <Link
                key={c}
                href={`/services?${params.toString()}`}
                className={`chip shrink-0 ${activeCategory === c ? "chip-active" : ""}`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============ Results ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-base-content/70">
            <span className="text-xl font-extrabold text-primary">{services.length}</span>{" "}
            {services.length === 1 ? "service" : "services"} available
            {sp.search && <> for “<span className="font-semibold text-primary">{sp.search}</span>”</>}
            {activeCategory && <> in <span className="font-semibold text-primary">{activeCategory}</span></>}
          </p>
          {hasFilter && (
            <Link href="/services" className="btn btn-ghost btn-sm text-error gap-1">
              <SearchX size={15} /> Clear all filters
            </Link>
          )}
        </div>

        {services.length === 0 ? (
          <div className="mt-6 text-center bg-base-200 rounded-3xl py-16 px-4 border border-base-300">
            <span className="mx-auto w-16 h-16 rounded-2xl bg-base-100 border border-base-300 flex items-center justify-center">
              <SearchX size={30} className="text-secondary" />
            </span>
            <h3 className="font-bold text-primary text-lg mt-4">No services match your search</h3>
            <p className="text-sm text-base-content/60 mt-1">Try a different keyword or clear the filters.</p>
            <Link href="/services" className="btn btn-secondary btn-sm mt-5">Clear Filters</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((s) => <ServiceCard key={s._id} s={s} />)}
          </div>
        )}

        {/* trust footer under results */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-base-content/60 bg-base-200 border border-base-300 rounded-2xl px-6 py-4">
          <span className="flex items-center gap-2 font-semibold text-primary"><BadgeCheck size={16} className="text-success" /> Verified technicians</span>
          <span className="flex items-center gap-2 font-semibold text-primary"><BadgeCheck size={16} className="text-success" /> Pay after completion</span>
          <span className="flex items-center gap-2 font-semibold text-primary"><BadgeCheck size={16} className="text-success" /> 30-day warranty</span>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
