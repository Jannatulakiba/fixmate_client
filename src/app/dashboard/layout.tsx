import { Suspense } from "react";
import { requireRole } from "@/lib/require-role";
import Navbar from "@/components/Navbar";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getUserRole } from "@/lib/roles";

// session pora dynamic, tai Suspense er bhetore
async function DashboardGate({ children }: { children: React.ReactNode }) {
  const session = await requireRole(["customer", "technician", "admin"]);
  const u = session.user as { name: string; email: string; image?: string | null; role?: string };

  return (
    <DashboardShell
      user={{
        name: u.name,
        email: u.email,
        image: u.image ?? null,
        role: getUserRole(u.role),
      }}
    >
      {children}
    </DashboardShell>
  );
}

function DashboardFallback() {
  return (
    <div className="bg-base-200 min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-32" />)}
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<DashboardFallback />}>
        <DashboardGate>{children}</DashboardGate>
      </Suspense>
    </>
  );
}