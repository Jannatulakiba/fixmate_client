// import { requireRole } from "@/lib/require-role";

// export default async function Layout({ children }: { children: React.ReactNode }) {
//   await requireRole(["customer", "technician", "admin"]);
//   return <>{children}</>;
// }

// Auth is handled by src/app/dashboard/layout.tsx (session + any dashboard role).
// Re-enable the block above only if customer pages should be customer-only.
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}