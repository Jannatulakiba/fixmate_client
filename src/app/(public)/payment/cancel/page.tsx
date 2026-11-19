import Link from "next/link";
import { CircleOff } from "lucide-react";

export default function CancelPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <CircleOff size={56} className="mx-auto text-warning" />
        <h1 className="text-2xl font-extrabold text-primary mt-4">Payment cancelled</h1>
        <p className="text-sm text-base-content/60 mt-2">
          No money was charged. You can try again whenever you are ready.
        </p>
        <Link href="/dashboard/customer/bookings" className="btn btn-secondary mt-6">Try Again</Link>
      </div>
    </section>
  );
}