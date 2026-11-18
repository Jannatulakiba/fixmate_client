import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export const metadata = { title: "My Repairs | FixMate" };

export default function CustomerDashboardPage() {
  return (
    <Dashboard
      role="customer"
      subtitle="Track your repair requests and pay only when the job is done."
      stats={[
        { label: "Active Requests", value: "0" },
        { label: "Completed Repairs", value: "0" },
        { label: "Saved Technicians", value: "0" },
      ]}
    >
      <div className="bg-base-100 rounded-box border border-base-300 p-10 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
          <ClipboardList size={26} />
        </div>
        <h2 className="font-bold text-primary text-lg mt-4">No repair requests yet</h2>
        <p className="text-sm text-base-content/70 mt-2 max-w-md mx-auto">
          When you book a repair, it will show up here so you can track every step of the job.
        </p>
        <Link href="/" className="btn btn-secondary mt-6 gap-2">
          Find a technician <ArrowRight size={16} />
        </Link>
      </div>
    </Dashboard>
  );
}
