import { requireRole } from "@/lib/require-role";
import DashboardShell from "@/components/dashboard/DashboardShell";

// Dashboard pages are per-user (session + role check in this layout), so the
// segment is allowed to block prerendering instead of producing a static shell.
export const instant = false;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["customer", "technician", "admin"]);
  const u = session.user as { name: string; email: string; image?: string | null; role?: string };

  return (
    <DashboardShell
      user={{ name: u.name, email: u.email, image: u.image ?? null, role: u.role ?? "customer" }}
    >
      {children}
    </DashboardShell>
  );
}