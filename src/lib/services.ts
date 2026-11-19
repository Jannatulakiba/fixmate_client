const API = process.env.NEXT_PUBLIC_API_URL!;

export type FullService = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "Home Visit" | "Shop Drop-off";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  technician: { image: string; area: string; bio: string };
  createdAt: string;
};

export type ServiceQuery = {
  search?: string;
  category?: string;
  mode?: string;
  sort?: string;
  limit?: number;
};

export async function getServices(q: ServiceQuery = {}): Promise<FullService[]> {
  const params = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v) params.set(k, String(v));
  });
  const res = await fetch(`${API}/api/services?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load services");
  return res.json();
}

export async function getService(id: string): Promise<FullService | null> {
  const res = await fetch(`${API}/api/services/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load service");
  return res.json();
}