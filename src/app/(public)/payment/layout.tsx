import { Suspense } from "react";
import { requireRole } from "@/lib/require-role";

async function PaymentGate({ children }: { children: React.ReactNode }) {
  await requireRole(["customer"]);
  return <>{children}</>;
}

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
      }
    >
      <PaymentGate>{children}</PaymentGate>
    </Suspense>
  );
}