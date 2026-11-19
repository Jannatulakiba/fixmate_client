import Link from "next/link";
import { Wrench, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
            <Settings size={140} className="text-primary/15 animate-[spin_12s_linear_infinite]" />
            <Wrench size={64} className="absolute text-secondary -rotate-45" />
          </div>
          <p className="text-6xl font-extrabold text-primary mt-4">404</p>
          <h1 className="text-xl font-bold text-primary mt-2">This page needs a repair</h1>
          <p className="text-sm text-base-content/60 mt-2">
            The page you are looking for does not exist, or the service is no longer available.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/" className="btn btn-secondary">Back to Home</Link>
            <Link href="/services" className="btn btn-ghost">Browse Services</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}