import { requireRole } from "@/lib/require-role";

// Customer pages are customer-only (technician/admin er jonno admin/technician
// dashboard ache) — role model onujayi ekhaneo guard lagbe.
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole(["customer"]);
  return <>{children}</>;
}
