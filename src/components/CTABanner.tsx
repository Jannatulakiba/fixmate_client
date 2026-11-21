import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

// Bottom call-to-action banner — shared by home, services and about pages.
export default function CTABanner({ className = "" }: { className?: string }) {
  return (
    <section className={`max-w-7xl mx-auto px-4 mt-20 ${className}`}>
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-content hero-pattern px-6 py-12 md:px-14 md:py-16 text-center">
        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto w-14 h-14 rounded-2xl bg-secondary text-secondary-content flex items-center justify-center shadow-lg">
            <Wrench size={26} />
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-extrabold leading-tight">
            Ready to fix it? Book a verified technician today.
          </h2>
          <p className="mt-3 text-primary-content/75">
            Send a request in under a minute, track the job live, and pay only when the work is done.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/services" className="btn btn-secondary btn-lg gap-2">
              Browse Services <ArrowRight size={18} />
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-lg border-white/40 text-primary-content bg-white/10 hover:bg-white hover:text-primary gap-2"
            >
              Become a Technician
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
