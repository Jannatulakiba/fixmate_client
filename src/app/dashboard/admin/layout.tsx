import { requireRole } from "@/lib/require-role";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin"]);
  return <>{children}</>;
}