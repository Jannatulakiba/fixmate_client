import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import Dashboard from "@/components/Dashboard";

export const metadata = { title: "Technician Dashboard | FixMate" };

export default function TechnicianDashboardPage() {
  return (
    <Dashboard
      role="technician"
      subtitle="Manage job requests from customers and track your earnings."
      stats={[
        { label: "New Job Requests", value: "0" },
        { label: "In Progress", value: "0" },
        { label: "Total Earnings", value: "৳0" },
      ]}
    >
      <div className="bg-base-100 rounded-box border border-base-300 p-10 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
          <Wrench size={26} />
        </div>
        <h2 className="font-bold text-primary text-lg mt-4">No job requests yet</h2>
        <p className="text-sm text-base-content/70 mt-2 max-w-md mx-auto">
          When a customer books a repair with you, the request will appear here with all the details.
        </p>
        <Link href="/" className="btn btn-secondary mt-6 gap-2">
          See how it works <ArrowRight size={16} />
        </Link>
      </div>
    </Dashboard>
  );
}
