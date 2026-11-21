"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  PlusSquare,
  ReceiptText,
  ShieldCheck,
  UserPen,
  Users,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardPath, getUserRole } from "@/lib/roles";

type User = {
  name: string;
  email: string;
  image: string | null;
  role: string;
};

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

function navFor(role: string): NavItem[] {
  const items: NavItem[] = [{ href: dashboardPath(role), label: "Overview", icon: LayoutDashboard }];

  if (getUserRole(role) === "customer") {
    items.push(
      { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarDays },
      { href: "/dashboard/customer/payments", label: "Payments", icon: ReceiptText },
    );
  }

  if (getUserRole(role) === "technician") {
    items.push(
      { href: "/dashboard/technician/requests", label: "Requests", icon: Inbox },
      { href: "/dashboard/technician/add-service", label: "Add a Service", icon: PlusSquare },
      { href: "/dashboard/technician/my-services", label: "My Services", icon: ListChecks },
    );
  }

  if (getUserRole(role) === "admin") {
    items.push(
      { href: "/dashboard/admin/bookings", label: "Bookings", icon: CalendarDays },
      { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
    );
  }

  items.push({ href: "/dashboard/profile", label: "Profile", icon: UserPen });
  return items;
}

const roleTone: Record<string, string> = {
  customer: "badge-info",
  technician: "badge-warning",
  admin: "badge-error",
};

export default function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data } = authClient.useSession();

  // profile update korle name sathe sathe change hobe
  const live = (data?.user as { name?: string } | undefined) ?? undefined;
  const displayName = live?.name ?? user.name;

  const items = navFor(user.role);
  const active = (href: string) =>
    href === dashboardPath(user.role) ? path === href : path.startsWith(href);

  const signOut = async () => {
    const { error } = await authClient.signOut();
    if (error) return toast.error(error.message || "Sign out failed");
    toast.success("Signed out successfully");
    router.replace("/");
    router.refresh();
  };

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active(item.href)
              ? "bg-primary text-primary-content"
              : "text-base-content/70 hover:bg-base-200"
              }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={signOut}
        className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </nav>
  );

  return (
    <div className="bg-base-200 min-h-[calc(100vh-4rem)]">
      {/* Dashboard sub-bar: sidebar toggle, title, name ar role */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="flex h-12 items-center gap-3 px-4 max-w-7xl mx-auto">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="toggle navigation"
            className="btn btn-ghost btn-square btn-sm lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="font-semibold text-primary text-sm">Dashboard</span>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-base-content/80 hidden sm:inline">{displayName}</span>
            <span className={`badge badge-soft badge-sm capitalize ${roleTone[user.role] ?? "badge-info"}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        <aside
          className={`w-64 shrink-0 border-r border-base-300 bg-base-100 min-h-[calc(100vh-7rem)] p-4 ${open ? "block" : "hidden"
            } lg:block`}
        >
          {sidebar}
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}