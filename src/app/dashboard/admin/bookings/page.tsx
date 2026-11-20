"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ClipboardX } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";
import { Booking, fmtDate } from "@/lib/types";

const tabs = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const;

export default function AdminBookings() {
  const [filter, setFilter] = useState<(typeof tabs)[number]>("all");
  const [data, setData] = useState<{ filter: string; rows: Booking[] } | null>(null);

  useEffect(() => {
    let stale = false;
    apiFetch<Booking[]>(`/api/admin/bookings${filter === "all" ? "" : `?status=${filter}`}`)
      .then((rows) => {
        if (!stale) setData({ filter, rows });
      })
      .catch((e) => {
        toast.error(e.message);
        if (!stale) setData({ filter, rows: [] });
      });
    return () => {
      stale = true;
    };
  }, [filter]);

  // notun filter er data ashe na porjonto puran ta dekhao (skeleton)
  const list = data && data.filter === filter ? data.rows : null;

  return (
    <>
      <PageHeader title="All bookings" subtitle="Every repair job on the platform." />

      <div role="tablist" className="tabs tabs-box mb-4 w-fit max-w-full overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} role="tab" onClick={() => setFilter(t)}
            className={`tab capitalize whitespace-nowrap ${filter === t ? "tab-active" : ""}`}>
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th><th>Customer</th><th>Technician</th><th>Date</th>
              <th>Status</th><th>Payment</th><th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2, 3].map((i) => (
                <tr key={i}><td colSpan={7}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {list?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14">
                  <ClipboardX size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No bookings found</p>
                  <p className="text-sm text-base-content/60">Try a different status filter.</p>
                </td>
              </tr>
            )}

            {list?.map((b) => (
              <tr key={b._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={b.serviceImage} alt={b.serviceTitle} className="w-14 h-10 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-primary">{b.serviceTitle}</p>
                      <p className="text-xs text-base-content/60">{b.category}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm">
                  {b.customerName}
                  <p className="text-xs text-base-content/60">{b.customerEmail}</p>
                </td>
                <td className="text-sm">{b.technicianName}</td>
                <td className="text-sm whitespace-nowrap">{fmtDate(b.preferredDate)}</td>
                <td><StatusBadge status={b.status} /></td>
                <td><StatusBadge status={b.paymentStatus} /></td>
                <td className="text-right font-semibold">
                  ${b.status === "completed" ? b.finalAmount : b.basePrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}