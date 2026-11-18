"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardPath, getUserRole, type UserRole } from "@/lib/roles";

type Stat = { label: string; value: string };

type Props = {
  role: UserRole;
  subtitle: string;
  stats: Stat[];
  children: React.ReactNode;
};

export default function Dashboard({ role, subtitle, stats, children }: Props) {
  const router = useRouter();
  const path = usePathname();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(path)}`);
      return;
    }
    const userRole = "role" in session.user ? getUserRole(session.user.role) : "customer";
    if (userRole !== role) router.replace(dashboardPath(userRole));
  }, [session, isPending, router, path, role]);

  const signOut = async () => {
    const { error } = await authClient.signOut();
    if (error) return toast.error(error.message || "Sign out failed");
    toast.success("Signed out successfully");
    router.replace("/sign-in");
  };

  if (isPending || !session?.user) {
    return (
      <section className="min-h-[80vh] bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </section>
    );
  }

  const user = session.user;
  const label = role === "technician" ? "Technician" : "Customer";

  return (
    <section className="min-h-[80vh] bg-base-200 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="badge badge-secondary gap-1">
              <ShieldCheck size={14} /> {label} account
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mt-3">
              Welcome back, {user.name}
            </h1>
            <p className="text-base-content/70 mt-1">{subtitle}</p>
            <p className="text-sm text-base-content/50 mt-1">{user.email}</p>
          </div>
          <button onClick={signOut} className="btn btn-ghost gap-2 border border-base-300">
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-base-100 rounded-box border border-base-300 p-6 shadow-sm">
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-sm text-base-content/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
