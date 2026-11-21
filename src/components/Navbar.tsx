"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wrench, Menu, LayoutDashboard, UserPen, LogOut, ShieldCheck, CreditCard, Radio } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { dashboardPath } from "@/lib/roles";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

const roleBadge: Record<string, string> = {
  customer: "badge-info",
  technician: "badge-warning",
  admin: "badge-error",
};

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as
    | { name: string; email: string; image?: string | null; role?: string }
    | undefined;

  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const closeMenu = () => (document.activeElement as HTMLElement | null)?.blur();

  const handleSignOut = async () => {
    closeMenu();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("Sign out failed");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur border-b border-base-300">
      {/* announcement strip (Sheba-style trust bar) */}
      <div className="bg-primary text-primary-content hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-6 text-[11px] font-semibold tracking-wide text-primary-content/85">
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-secondary" /> Verified technicians only</span>
          <span className="flex items-center gap-1.5"><CreditCard size={13} className="text-secondary" /> Pay after completion</span>
          <span className="flex items-center gap-1.5"><Radio size={13} className="text-secondary" /> Live job tracking</span>
        </div>
      </div>

      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square" aria-label="menu">
              <Menu size={22} />
            </button>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-56 p-2 z-10">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeMenu}
                    className={active(l.href) ? "text-secondary font-semibold" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-primary">
            <span className="bg-secondary text-secondary-content p-1.5 rounded-lg">
              <Wrench size={20} />
            </span>
            FixMate
          </Link>
        </div>

        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}
                  className={`rounded-full ${active(l.href)
                    ? "bg-primary text-primary-content font-semibold"
                    : "hover:bg-base-200"}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-2">
          {isPending ? (
            <div className="skeleton w-10 h-10 rounded-full" />
          ) : user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} aria-label="account" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-secondary ring-offset-2 ring-offset-base-100">
                  {user.image ? (
                    <img src={user.image} alt={user.name} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="bg-primary text-primary-content w-full h-full flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>
              <ul tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box shadow-lg border border-base-300 mt-3 w-64 p-2 z-10">
                <li className="px-3 py-2 pointer-events-none">
                  <p className="font-bold text-primary leading-tight">{user.name}</p>
                  <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                  <span className={`badge badge-soft badge-sm capitalize mt-1 ${roleBadge[user.role ?? "customer"]}`}>
                    {user.role ?? "customer"}
                  </span>
                </li>
                <div className="divider my-0" />
                <li>
                  <Link href={dashboardPath(user.role)} onClick={closeMenu}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" onClick={closeMenu}>
                    <UserPen size={16} /> Update Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-error">
                    <LogOut size={16} /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-secondary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}