import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";
import { fetchCategories } from "@/lib/public";

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Category list live API theke ashe; "use cache" tai static pages (about, 404)
// build-e-i category load korte pare.
export default async function Footer() {
  "use cache";
  const { categories } = await fetchCategories();
  const cats = categories.slice(0, 5);
  return (
    <footer className="bg-primary text-primary-content mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="bg-secondary text-secondary-content p-1.5 rounded-lg"><Wrench size={20} /></span>
            FixMate
          </Link>
          <p className="mt-3 text-sm text-primary-content/70">
            Verified technicians. Trackable jobs. Pay only after the repair is done.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-content/70">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Popular Categories</h4>
          <ul className="space-y-2 text-sm text-primary-content/70">
            {cats.map((c) => (
              <li key={c}><Link href={`/services?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-content/70">
            <li className="flex gap-2"><Mail size={16} /> support@fixmate.com</li>
            <li className="flex gap-2"><Phone size={16} /> +880 1700-000000</li>
            <li className="flex gap-2"><MapPin size={16} /> Barishal, Bangladesh</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <a href="#" aria-label="X" className="btn btn-circle btn-sm btn-ghost border border-white/20"><XIcon /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-primary-content/60">
        © 2026 FixMate. All rights reserved.
      </div>
    </footer>
  );
}