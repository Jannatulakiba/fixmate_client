"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ClipboardList, Wrench, CheckCircle2, Wallet, CalendarX2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { statusColors } from "@/lib/status";
import { Booking, fmtDate } from "@/lib/types";

type Stats = {
  totalRequests: number;
  activeJobs: number;
  completedJobs: number;
  awaitingPayment: number;
  totalSpent: number;
  byStatus: Record<string, number>;
  recentBookings: Booking[];
};

const order = [
  ["requested", "Requested"],
  ["accepted", "Accepted"],
  ["in-progress", "In Progress"],
  ["completed", "Completed"],
  ["rejected", "Rejected"],
  ["cancelled", "Cancelled"],
] as const;

export default function CustomerOverview() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch<Stats>("/api/customer/stats").then(setS).catch((e) => toast.error(e.message));
  }, []);

  if (!s) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-32" />)}
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  const chart = order.map(([key, name]) => ({
    name,
    value: s.byStatus[key] ?? 0,
    color: statusColors[key],
  }));

  return (
    <>
      <PageHeader title="Overview" subtitle="Your repair requests at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total requests" value={s.totalRequests} icon={ClipboardList} tone="info" />
        <StatsCard label="Active jobs" value={s.activeJobs} icon={Wrench} tone="secondary" hint="Requested, accepted or in progress" />
        <StatsCard
          label="Completed jobs"
          value={s.completedJobs}
          icon={CheckCircle2}
          tone="success"
          hint={s.awaitingPayment > 0 ? `${s.awaitingPayment} waiting for payment` : "All paid"}
        />
        <StatsCard label="Total spent" value={`$${Number(s.totalSpent.toFixed(2))}`} icon={Wallet} highlight hint="On paid jobs" />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box p-5 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary text-lg">Recent bookings</h3>
          <Link href="/dashboard/customer/bookings" className="text-sm font-semibold text-secondary hover:underline">
            View all
          </Link>
        </div>

        {s.recentBookings.length === 0 ? (
          <div className="text-center py-10">
            <CalendarX2 size={34} className="mx-auto text-secondary" />
            <p className="font-semibold text-primary mt-2">No bookings yet</p>
            <p className="text-sm text-base-content/60">Find a technician and send your first request.</p>
            <Link href="/services" className="btn btn-secondary btn-sm mt-4">Browse Services</Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-base-300">
            {s.recentBookings.map((b) => (
              <li key={b._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={b.serviceImage} alt={b.serviceTitle} className="w-14 h-10 rounded object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-primary truncate">{b.serviceTitle}</p>
                    <p className="text-sm text-base-content/60">
                      {b.technicianName}, {fmtDate(b.preferredDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <StatusBadge status={b.status} />
                  <StatusBadge status={b.paymentStatus} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <BarChartCard title="Bookings by Status" data={chart} />
      </div>
    </>
  );
}