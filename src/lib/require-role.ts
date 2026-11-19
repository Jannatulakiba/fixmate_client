import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPath } from "./roles";

export async function requireRole(roles: string[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const role = (session.user as { role?: string }).role ?? "customer";
  if (!roles.includes(role)) redirect(dashboardPath(role));
  return session;
}