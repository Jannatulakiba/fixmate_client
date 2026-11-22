"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { Payment } from "@/lib/types";

function Failure({ message }: { message: string }) {
  return (
    <div className="text-center max-w-md">
      <XCircle size={56} className="mx-auto text-error" />
      <h1 className="text-2xl font-extrabold text-primary mt-4">Could not verify payment</h1>
      <p className="text-sm text-base-content/60 mt-2">{message}</p>
      <Link href="/dashboard/customer/bookings" className="btn btn-secondary mt-6">Back to My Bookings</Link>
    </div>
  );
}

function Content() {
  const sessionId = useSearchParams().get("session_id");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !sessionId) return;
    ran.current = true;

    apiFetch<Payment>(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((p) => {
        setPayment(p);
        toast.success("Payment successful");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Verification failed"));
  }, [sessionId]);

  // Derived during render instead of setState() inside the effect.
  if (!sessionId) return <Failure message="Missing payment session" />;
  if (error) return <Failure message={error} />;

  if (!payment) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
        <p className="text-sm text-base-content/60 mt-3">Confirming yours payment...</p>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md w-full">
      <CheckCircle2 size={56} className="mx-auto text-success" />
      <h1 className="text-2xl font-extrabold text-primary mt-4">Payment successful</h1>
      <p className="text-sm text-base-content/60 mt-1">Thank you, your repair job is paid.</p>

      <div className="mt-6 border border-base-300 rounded-box p-5 text-left space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-base-content/60">Service</span>
          <span className="font-semibold text-primary text-right">{payment.serviceTitle}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-base-content/60">Amount</span>
          <span className="font-extrabold text-primary">${payment.amount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-base-content/60">Transaction ID</span>
          <span className="font-mono text-xs break-all text-right">{payment.transactionId}</span>
        </div>
      </div>

      <Link href="/dashboard/customer/bookings" className="btn btn-secondary mt-6">Back to My Bookings</Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<span className="loading loading-spinner loading-lg text-secondary" />}>
        <Content />
      </Suspense>
    </section>
  );
}