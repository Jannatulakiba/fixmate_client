"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { apiFetch } from "@/lib/api";
import { Booking, fmtDate } from "@/lib/types";

const tabs = ["all", "requested", "accepted", "in-progress", "completed", "rejected", "cancelled"] as const;

export default function ManageRequests() {
  const [list, setList] = useState<Booking[] | null>(null);
  const [filter, setFilter] = useState<(typeof tabs)[number]>("all");
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<Booking[]>("/api/bookings/technician")
      .then(setList)
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  const update = async (b: Booking, status: string, finalAmount?: number) => {
    setBusy(true);
    try {
      const updated = await apiFetch<Booking>(`/api/bookings/${b._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, finalAmount }),
      });
      setList((l) => l!.map((x) => (x._id === updated._id ? updated : x)));
      toast.success(`Job marked as ${status.replace("-", " ")}`);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update request");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const confirmReject = async () => {
    if (rejecting && (await update(rejecting, "rejected"))) setRejecting(null);
  };

  const openComplete = (b: Booking) => {
    setAmount(String(b.basePrice));
    setCompleting(b);
  };

  const confirmComplete = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return toast.error("Enter an amount greater than 0");
    if (completing && (await update(completing, "completed", n))) setCompleting(null);
  };

  const shown = list?.filter((b) => filter === "all" || b.status === filter);

  return (
    <>
      <PageHeader title="Manage requests" subtitle="Accept jobs and move them through each stage." />

      <div role="tablist" className="tabs tabs-box mb-4 w-fit max-w-full overflow-x-auto">
        {tabs.map((t) => (
          <button key={t} role="tab" onClick={() => setFilter(t)}
            className={`tab capitalize ${filter === t ? "tab-active" : ""}`}>
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table min-w-[860px] [&_td]:px-2 [&_th]:px-2">
          <thead>
            <tr>
              <th>Customer</th><th>Service</th><th>Address</th><th>Date</th>
              <th>Problem</th><th>Status</th><th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={7}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {shown?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-14">
                  <Inbox size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No requests here</p>
                  <p className="text-sm text-base-content/60">New repair requests will show up in this list.</p>
                </td>
              </tr>
            )}

            {shown?.map((b) => (
              <tr key={b._id}>
                <td className="text-sm whitespace-nowrap align-top">
                  <p className="font-semibold text-primary">{b.customerName}</p>
                  <p className="text-xs text-base-content/60">{b.customerPhone}</p>
                </td>
                <td className="min-w-[200px] align-top">
                  <div className="flex items-center gap-3">
                    <img src={b.serviceImage} alt={b.serviceTitle} className="w-14 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-primary line-clamp-2" title={b.serviceTitle}>{b.serviceTitle}</p>
                      <p className="text-xs text-base-content/60">{b.category}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm max-w-[110px] align-top break-words">{b.address}</td>
                <td className="text-sm whitespace-nowrap align-top">{fmtDate(b.preferredDate)}</td>
                <td className="text-sm max-w-[160px] align-top break-words">
                  <p className="line-clamp-2" title={b.problemDescription}>{b.problemDescription}</p>
                </td>
                <td className="align-top"><StatusBadge status={b.status} /></td>
                <td className="align-top">
                  <div className="flex gap-2 justify-end">
                    {b.status === "requested" && (
                      <>
                        <button className="btn btn-success btn-xs" disabled={busy}
                          onClick={() => update(b, "accepted")}>Accept</button>
                        <button className="btn btn-error btn-outline btn-xs" disabled={busy}
                          onClick={() => setRejecting(b)}>Reject</button>
                      </>
                    )}
                    {b.status === "accepted" && (
                      <button className="btn btn-warning btn-xs" disabled={busy}
                        onClick={() => update(b, "in-progress")}>Start Work</button>
                    )}
                    {b.status === "in-progress" && (
                      <button className="btn btn-secondary btn-xs" onClick={() => openComplete(b)}>Mark Completed</button>
                    )}
                    {b.status === "completed" && <StatusBadge status={b.paymentStatus} />}
                    {(b.status === "cancelled" || b.status === "rejected") && (
                      <span className="text-xs text-base-content/40" title={`This request was ${b.status}`}>No action</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!rejecting}
        title="Reject this request?"
        message={`The request from ${rejecting?.customerName ?? ""} will be rejected. This cannot be undone.`}
        confirmText="Yes, Reject"
        loading={busy}
        onConfirm={confirmReject}
        onClose={() => setRejecting(null)}
      />

      <div className={`modal ${completing ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-primary">Mark job as completed</h3>
          <p className="text-sm text-base-content/60">{completing?.serviceTitle}</p>
          <label className="label text-sm mt-4">Final amount (USD)</label>
          <input type="number" min="0.01" step="0.01" value={amount}
            onChange={(e) => setAmount(e.target.value)} className="input w-full" />
          <p className="text-xs text-base-content/60 mt-1">The customer will be charged this amount.</p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setCompleting(null)} disabled={busy}>Cancel</button>
            <button className="btn btn-secondary" onClick={confirmComplete} disabled={busy}>
              {busy ? <span className="loading loading-spinner loading-sm" /> : "Confirm"}
            </button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setCompleting(null)} />
      </div>
    </>
  );
}