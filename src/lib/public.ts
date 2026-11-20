// Public (no-auth) data — home, services filter, footer, ServiceForm shob ei
// endpoint theke read kore. Server thekeo (RSC) theke browser thekeo call kora jay.
// API down hole UI kaaj korte thake: null / fallback return + console.warn.

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type Taxonomy = { categories: string[]; modes: string[] };

export type PublicStats = {
  verifiedTechnicians: number;
  customers: number;
  servicesListed: number;
  jobsTotal: number;
  jobsCompleted: number;
};

// Shudhu fallback (API unreachable hole select khali na thakar jonno).
// Normally shob data GET /api/services/categories theke ashe.
export const FALLBACK_TAXONOMY: Taxonomy = {
  categories: ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"],
  modes: ["Home Visit", "Shop Drop-off"],
};

async function getJSON<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`[public] ${path} unavailable:`, e instanceof Error ? e.message : e);
    return null;
  }
}

export async function fetchCategories(): Promise<Taxonomy> {
  const data = await getJSON<Taxonomy>("/api/services/categories");
  if (!data?.categories?.length) return FALLBACK_TAXONOMY;
  return { categories: data.categories, modes: data.modes?.length ? data.modes : FALLBACK_TAXONOMY.modes };
}

// Marketing counters — null mane API down, consumer section ta hide korbe
export async function fetchPublicStats(): Promise<PublicStats | null> {
  return getJSON<PublicStats>("/api/public/stats");
}

// 1250 -> "1.3k+", 9 -> "9+"
export function fmtCount(n: number): string {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k+`;
  return `${n}+`;
}
