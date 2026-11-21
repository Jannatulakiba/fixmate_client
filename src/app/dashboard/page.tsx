import { redirect } from "next/navigation";
import { requireRole } from "@/lib/require-role";
import { dashboardPath, getUserRole } from "@/lib/roles";

export default async function DashboardIndex() {
    const session = await requireRole(["customer", "technician", "admin"]);
    redirect(dashboardPath(getUserRole((session.user as any).role)));
}