"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import { statusColors } from "@/lib/status";
import { apiFetch } from "@/lib/api";
import { type Booking, type BookingStatus } from "@/lib/types";

const chartStatuses: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
];

const activeStatuses: BookingStatus[] = ["requested", "accepted", "in-progress"];

export default function CustomerOverview() {
  const [list, setList] = useState<Booking[] | null>(null);

  useEffect(() => {
    apiFetch<Booking[]>("/api/bookings/my")
      .then(setList)
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Could not load your bookings");
        setList([]);
      });
  }, []);

  const bookings = list ?? [];
  const active = bookings.filter((b) => activeStatuses.includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  const chart = chartStatuses.map((status) => ({
    name: status.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase()),
    value: bookings.filter((b) => b.status === status).length,
    color: statusColors[status],
  }));

  return (
    <>
      <PageHeader title="Customer Overview" subtitle="Your repair requests at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          label="Total Requests"
          value={list === null ? "—" : bookings.length}
          icon={ClipboardList}
          tone="info"
        />
        <StatsCard label="Active Jobs" value={list === null ? "—" : active} icon={Wrench} tone="secondary" />
        <StatsCard
          label="Completed Jobs"
          value={list === null ? "—" : completed}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <div className="mt-6">
        <BarChartCard title="Bookings by Status" data={chart} />
      </div>

      {list?.length === 0 && (
        <div className="mt-6 bg-base-100 border border-base-300 rounded-box p-10 text-center">
          <h2 className="font-bold text-primary text-lg">No repair requests yet</h2>
          <p className="text-sm text-base-content/70 mt-2 max-w-md mx-auto">
            When you book a repair, it will show up here so you can track every step of the job.
          </p>
          <Link href="/services" className="btn btn-secondary mt-6 gap-2">
            Find a technician <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
