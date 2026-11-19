import { ListChecks, BadgeCheck, Inbox } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { statusColors } from "@/lib/status";

const chart = [
  { name: "Requested", value: 3, color: statusColors.requested },
  { name: "Accepted", value: 2, color: statusColors.accepted },
  { name: "In Progress", value: 2, color: statusColors["in-progress"] },
  { name: "Completed", value: 7, color: statusColors.completed },
  { name: "Rejected", value: 1, color: statusColors.rejected },
];

export default function TechnicianOverview() {
  return (
    <>
      <PageHeader title="Technician Overview" subtitle="Your services and incoming jobs." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Total Services" value={6} icon={ListChecks} tone="primary" />
        <StatsCard label="Approved Services" value={4} icon={BadgeCheck} tone="success" />
        <StatsCard label="Pending Requests" value={3} icon={Inbox} tone="secondary" />
      </div>
      <div className="mt-6">
        <BarChartCard title="Jobs by Status" data={chart} />
      </div>
    </>
  );
}