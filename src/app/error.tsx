"use client";
import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <TriangleAlert size={56} className="mx-auto text-error" />
        <h1 className="text-2xl font-extrabold text-primary mt-4">Something went wrong</h1>
        <p className="text-sm text-base-content/60 mt-2">
          An unexpected error occurred. Please try again, or go back to the home page.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={reset} className="btn btn-secondary">Try Again</button>
          <Link href="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </div>
    </section>
  );
}