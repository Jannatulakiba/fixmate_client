import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Navbar reads usePathname(); routes with dynamic params need a Suspense
          boundary so the static shell can prerender (cacheComponents). */}
      <Suspense fallback={<div className="h-14 bg-base-100 border-b border-base-300" />}>
        <Navbar />
      </Suspense>
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
}
