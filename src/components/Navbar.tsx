"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar() {
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square" aria-label="menu">
              <Menu size={22} />
            </button>
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box shadow mt-3 w-56 p-2 z-10">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={active(l.href) ? "text-secondary font-semibold" : ""}>
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
                <Link
                  href={l.href}
                  className={active(l.href) ? "bg-primary text-primary-content" : "hover:bg-base-200"}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-end gap-2">
          {/* Logged-out state. Auth ashle avatar dropdown boshbe */}
          <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/sign-up" className="btn btn-secondary btn-sm">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}