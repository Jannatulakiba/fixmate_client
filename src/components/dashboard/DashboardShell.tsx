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
  Wrench,
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
    items.push({ href: "/dashboard/technician/requests", label: "Requests", icon: Inbox });
  }

  if (getUserRole(role) === "admin") {
    items.push(
      { href: "/dashboard/admin/services", label: "Service Approval", icon: ShieldCheck },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
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
  technician: [
  { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/technician/add-service", label: "Add a service", icon: PlusSquare },
  { href: "/dashboard/technician/my-services", label: "My services", icon: ListChecks },
  { href: "/dashboard/technician/requests", label: "Manage requests", icon: Inbox },
  { href: "/dashboard/profile", label: "Update profile", icon: UserPen },
]

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active(item.href)
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
    <div className="min-h-screen bg-base-200">
      <header className="sticky top-0 z-40 bg-base-100 border-b border-base-300">
        <div className="flex h-16 items-center gap-3 px-4 max-w-7xl mx-auto">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="toggle navigation"
            className="btn btn-ghost btn-square lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-primary">
            <span className="bg-secondary text-secondary-content p-1.5 rounded-lg">
              <Wrench size={18} />
            </span>
            FixMate
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <span className={`badge badge-soft badge-sm capitalize ${roleTone[user.role] ?? "badge-info"}`}>
              {user.role}
            </span>
            <div className="dropdown dropdown-end">
              <button tabIndex={0} aria-label="account" className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full ring ring-secondary ring-offset-2 ring-offset-base-100">
                  {user.image ? (
                    <img src={user.image} alt={user.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box shadow-lg border border-base-300 mt-3 w-56 p-2 z-10"
              >
                <li className="px-3 py-2 pointer-events-none">
                  <p className="font-bold text-primary leading-tight">{user.name}</p>
                  <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                </li>
                <div className="divider my-0" />
                <li>
                  <Link href="/dashboard/profile">
                    <UserPen size={16} /> Profile
                  </Link>
                </li>
                <li>
                  <button onClick={signOut} className="text-error">
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        <aside
          className={`w-64 shrink-0 border-r border-base-300 bg-base-100 min-h-[calc(100vh-4rem)] p-4 ${
            open ? "block" : "hidden"
          } lg:block`}
        >
          {sidebar}
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
