import { requireRole } from "@/lib/require-role";
import PageHeader from "@/components/dashboard/PageHeader";

export const metadata = { title: "My Profile | FixMate" };

// Reads the session via requireRole(), so this page blocks instead of
// producing a static shell.
export const instant = false;

export default async function ProfilePage() {
  const session = await requireRole(["customer", "technician", "admin"]);
  const u = session.user as Record<string, unknown>;

  const rows: { label: string; value?: unknown }[] = [
    { label: "Full name", value: u.name },
    { label: "Email", value: u.email },
    { label: "Role", value: u.role ?? "customer" },
    { label: "Phone", value: u.phone },
    { label: "Area", value: u.area },
    { label: "Bio", value: u.bio },
  ];

  return (
    <>
      <PageHeader title="My Profile" subtitle="Your account details." />
      <div className="bg-base-100 border border-base-300 rounded-box p-6 max-w-xl">
        <dl className="divide-y divide-base-300">
          {rows
            .filter((r) => r.value)
            .map((r) => (
              <div key={r.label} className="py-3 flex flex-wrap gap-2 justify-between">
                <dt className="text-sm text-base-content/60">{r.label}</dt>
                <dd className="text-sm font-semibold text-primary capitalize">{String(r.value)}</dd>
              </div>
            ))}
        </dl>
      </div>
    </>
  );
}
