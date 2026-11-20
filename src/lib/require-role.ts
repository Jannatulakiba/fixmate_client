import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "./auth";
import { dashboardPath } from "./roles";

export async function requireRole(roles: string[]) {
  await connection();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }
  if (!session) redirect("/sign-in");

  const role = (session.user as { role?: string }).role ?? "customer";
  if (!roles.includes(role)) redirect(dashboardPath(role));
  return session;
}