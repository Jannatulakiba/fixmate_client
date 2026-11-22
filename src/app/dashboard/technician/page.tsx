"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ListChecks, BadgeCheck, Inbox, Wallet, Wrench } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiFetch } from "@/lib/api";
import { statusColors } from "@/lib/status";
import { Booking, fmtDate, shortId } from "@/lib/types";

type Earning = { _id: string; serviceTitle: string; customerName: string; amount: number; paidAt: string };

type Stats = {
  totalServices: number;
  approvedServices: number;
  pendingServices: number;
  pendingRequests: number;
  totalEarnings: number;
  jobsByStatus: Record<string, number>;
  newRequests: Booking[];
  recentEarnings: Earning[];
};

const money = (n: number) => `$${Number(n.toFixed(2))}`;

const order = [
  ["requested", "Requested"],
  ["accepted", "Accepted"],
  ["in-progress", "In Progress"],
  ["completed", "Completed"],
  ["rejected", "Rejected"],
] as const;

export default function TechnicianOverview() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch<Stats>("/api/technician/stats").then(setS).catch((e) => toast.error(e.message));
  }, []);

  if (!s) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-32" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="skeleton h-64" />
          <div className="skeleton h-64" />
        </div>
      </div>
    );
  }

  const chart = order.map(([key, name]) => ({
    name,
    value: s.jobsByStatus[key] ?? 0,
    color: statusColors[key],
  }));

  return (
    <>
      <PageHeader title="Overview" subtitle="Your services, jobs and earnings." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total services" value={s.totalServices} icon={ListChecks} tone="primary" />
        <StatsCard
          label="Approved services"
          value={s.approvedServices}
          icon={BadgeCheck}
          tone="success"
          hint={s.pendingServices > 0 ? `${s.pendingServices} waiting for review` : "All reviewed"}
        />
        <StatsCard
          label="Pending requests"
          value={s.pendingRequests}
          icon={Inbox}
          tone="secondary"
          hint={s.pendingRequests > 0 ? "Waiting for you to accept or decline" : "No new requests"}
        />
        <StatsCard label="Total earnings" value={money(s.totalEarnings)} icon={Wallet} highlight hint="From paid jobs" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        {/* New requests */}
        <div className="bg-base-100 border border-base-300 rounded-box p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary text-lg">New request</h3>
            <Link href="/dashboard/technician/requests" className="text-sm font-semibold text-secondary hover:underline">
              Manage Requests
            </Link>
          </div>

          {s.newRequests.length === 0 ? (
            <div className="text-center py-10">
              <Inbox size={34} className="mx-auto text-secondary" />
              <p className="font-semibold text-primary mt-2">No new requests</p>
              <p className="text-sm text-base-content/60">New repair requests will show up here.</p>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-base-300">
              {s.newRequests.map((b) => (
                <li key={b._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary truncate">{b.serviceTitle}</p>
                    <p className="text-sm text-base-content/60">
                      {b.customerName}, preferred {fmtDate(b.preferredDate)}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-base-content/50 shrink-0">{shortId(b._id)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent earnings */}
        <div className="bg-base-100 border border-base-300 rounded-box p-5">
          <h3 className="font-bold text-primary text-lg">Recent earnings</h3>
          <p className="text-sm text-base-content/60">Jobs customers have paid for</p>

          {s.recentEarnings.length === 0 ? (
            <div className="text-center py-10">
              <Wrench size={34} className="mx-auto text-secondary" />
              <p className="font-semibold text-primary mt-2">No earnings yet</p>
              <p className="text-sm text-base-content/60">Paid jobs will appear here.</p>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-base-300">
              {s.recentEarnings.map((p) => (
                <li key={p._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary truncate">{p.serviceTitle}</p>
                    <p className="text-sm text-base-content/60">
                      {p.customerName}, {new Date(p.paidAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span className="font-extrabold text-primary shrink-0">{money(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6">
        <BarChartCard title="Jobs by Status" data={chart} />
      </div>
    </>
  );
}