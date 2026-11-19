import { requireRole } from "@/lib/require-role";

export default async function PaymentLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["customer"]);
  return <>{children}</>;
}