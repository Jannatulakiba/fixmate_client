"use client";
import { useEffect, useState } from "react";
import { Users, Wrench, Hourglass } from "lucide-react";
import { toast } from "sonner";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiFetch } from "@/lib/api";

type Stats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  servicesByStatus: Record<string, number>;
};

export default function AdminOverview() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch<Stats>("/api/admin/stats").then(setS).catch((e) => toast.error(e.message));
  }, []);

  if (!s) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}
        </div>
        <div className="skeleton h-72 w-full" />
      </div>
    );
  }

  const chart = [
    { name: "Pending", value: s.servicesByStatus.pending ?? 0, color: "#f59e0b" },
    { name: "Approved", value: s.servicesByStatus.approved ?? 0, color: "#16a34a" },
    { name: "Rejected", value: s.servicesByStatus.rejected ?? 0, color: "#dc2626" },
  ];

  return (
    <>
      <PageHeader title="Admin Overview" subtitle="Platform summary." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard label="Total Users" value={s.totalUsers} icon={Users} tone="info" />
        <StatsCard label="Total Technicians" value={s.totalTechnicians} icon={Wrench} tone="primary" />
        <StatsCard label="Pending Services" value={s.pendingServices} icon={Hourglass} tone="secondary" />
      </div>
      <div className="mt-6">
        <BarChartCard title="Services by Approval Status" data={chart} />
      </div>
    </>
  );
}