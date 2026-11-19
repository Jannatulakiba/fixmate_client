"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarX2 } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { apiFetch } from "@/lib/api";
import { Booking, fmtDate } from "@/lib/types";

export default function MyBookings() {
  const [list, setList] = useState<Booking[] | null>(null);
  const [target, setTarget] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<Booking[]>("/api/bookings/my")
      .then(setList)
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  const cancel = async () => {
    if (!target) return;
    setBusy(true);
    try {
      const updated = await apiFetch<Booking>(`/api/bookings/${target._id}/cancel`, { method: "PATCH" });
      setList((l) => l!.map((x) => (x._id === updated._id ? updated : x)));
      toast.success("Booking cancelled");
      setTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not cancel booking");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="My Bookings" subtitle="Track your repair requests and pay for completed jobs." />

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th><th>Technician</th><th>Date</th><th>Amount</th>
              <th>Status</th><th>Payment</th><th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={7}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {list?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14">
                  <CalendarX2 size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No bookings yet</p>
                  <p className="text-sm text-base-content/60">Find a technician and send your first request.</p>
                  <Link href="/services" className="btn btn-secondary btn-sm mt-4">Browse Services</Link>
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
                <td className="text-sm">{b.technicianName}</td>
                <td className="text-sm whitespace-nowrap">{fmtDate(b.preferredDate)}</td>
                <td className="font-semibold">
                  ${b.status === "completed" ? b.finalAmount : b.basePrice}
                  <p className="text-xs font-normal text-base-content/60">
                    {b.status === "completed" ? "final" : "base"}
                  </p>
                </td>
                <td><StatusBadge status={b.status} /></td>
                <td><StatusBadge status={b.paymentStatus} /></td>
                <td className="text-right">
                  {b.status === "requested" && (
                    <button className="btn btn-error btn-outline btn-xs" onClick={() => setTarget(b)}>Cancel</button>
                  )}
                  {b.status === "completed" && b.paymentStatus === "unpaid" && (
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => toast.info("Stripe payment will be connected in the next step")}
                    >
                      Pay Now
                    </button>
                  )}
                  {b.paymentStatus === "paid" && <span className="badge badge-success badge-soft">Paid</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!target}
        title="Cancel this request?"
        message={`Your request for "${target?.serviceTitle ?? ""}" will be cancelled. This cannot be undone.`}
        confirmText="Yes, Cancel"
        loading={busy}
        onConfirm={cancel}
        onClose={() => setTarget(null)}
      />
    </>
  );
}