"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarX2, Check, Calendar, MapPin, Phone } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { apiFetch } from "@/lib/api";
import { Booking, fmtDate, shortId } from "@/lib/types";

// Job pipeline steps — customer tracks the repair step by step
const TRACK_STEPS = [
  { key: "requested", label: "Requested", hint: "Request sent to the technician" },
  { key: "accepted", label: "Accepted", hint: "Technician accepted your request" },
  { key: "in-progress", label: "In Progress", hint: "Repair work has started" },
  { key: "completed", label: "Completed", hint: "Job finished — pay online now" },
] as const;

const fmtWhen = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

// ── Status badge colours ────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  requested: "bg-blue-100 text-blue-700 border border-blue-200",
  accepted: "bg-primary/10 text-primary border border-primary/20",
  "in-progress": "bg-amber-100 text-amber-700 border border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
  paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  unpaid: "bg-gray-100 text-gray-500 border border-gray-200",
};

function Chip({ label }: { label: string }) {
  const cls = STATUS_STYLES[label] ?? "bg-base-200 text-base-content";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${cls}`}>
      {label !== "unpaid" && label !== "cancelled" && label !== "rejected" && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      )}
      {label.replace("-", " ")}
    </span>
  );
}

export default function MyBookings() {
  const [list, setList] = useState<Booking[] | null>(null);
  const [target, setTarget] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [tracking, setTracking] = useState<Booking | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Booking[]>("/api/bookings/my")
      .then(setList)
      .catch((e) => { toast.error(e.message); setList([]); });
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

  const pay = async (b: Booking) => {
    setPayingId(b._id);
    try {
      const { url } = await apiFetch<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId: b._id }),
      });
      window.location.assign(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start checkout");
      setPayingId(null);
    }
  };

  // tracker helpers
  const history = tracking?.statusHistory ?? [];
  const hasStatus = (k: string) =>
    !!tracking && (tracking.status === k || history.some((h) => h.status === k));
  const terminal = tracking?.status === "rejected" || tracking?.status === "cancelled";
  const paid = tracking?.paymentStatus === "paid";
  const lastChange = history[history.length - 1]?.changedAt;

  return (
    <>
      <PageHeader title="My Bookings" subtitle="Track your repair requests and pay for completed jobs." />

      {/* ── Loading skeletons ── */}
      {list === null && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-36 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {list?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CalendarX2 size={44} className="text-secondary mb-3" />
          <p className="font-bold text-primary text-lg">No bookings confirm yet</p>
          <p className="text-sm text-base-content/60 mt-1">Find a technician and send your first repair request.</p>
          <Link href="/services" className="btn btn-secondary btn-sm mt-5">Browse Service</Link>
        </div>
      )}

      {/* ── Booking cards ── */}
      {list && list.length > 0 && (
        <div className="space-y-4">
          {list.map((b) => {
            const isCompleted = b.status === "completed";
            const isUnpaid = b.paymentStatus === "unpaid";
            const isPaid = b.paymentStatus === "paid";
            const canCancel = b.status === "requested";
            const canPay = isCompleted && isUnpaid;
            const isPaying = payingId === b._id;

            return (
              <div
                key={b._id}
                className="bg-base-100 border border-base-300 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-0 overflow-hidden"
              >
                {/* Left — service image */}
                <div className="sm:w-28 w-full h-28 sm:h-auto shrink-0">
                  <img
                    src={b.serviceImage}
                    alt={b.serviceTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Middle — booking info */}
                <div className="flex-1 p-4 min-w-0">
                  <p className="font-bold text-primary text-base leading-tight">{b.serviceTitle}</p>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {b.technicianName}
                    {b.technicianEmail && (
                      <>, <span className="text-secondary">{b.technicianEmail}</span></>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-base-content/70">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Requested{" "}
                      <span className="font-medium text-base-content">{fmtDate(b.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Preferred{" "}
                      <span className="font-medium text-base-content">{fmtDate(b.preferredDate)}</span>
                    </span>
                  </div>

                  {b.problemDescription && (
                    <p className="text-xs text-base-content/60 mt-2 line-clamp-2">{b.problemDescription}</p>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {b.address && (
                      <span className="flex items-center gap-1 text-xs text-base-content/50">
                        <MapPin size={11} />{b.address}
                      </span>
                    )}
                    {b.customerPhone && (
                      <span className="flex items-center gap-1 text-xs text-base-content/50">
                        <Phone size={11} />{b.customerPhone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right — ticket, status, amount, actions */}
                <div className="sm:w-52 shrink-0 border-t sm:border-t-0 sm:border-l border-base-300 p-4 flex flex-col justify-between gap-3">
                  {/* Ticket + status */}
                  <div>
                    <p className="text-xs font-mono text-base-content/50 mb-1.5">{shortId(b._id)}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip label={b.status} />
                      <Chip label={b.paymentStatus} />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-base-content/50">{isCompleted ? "Final amount" : "Starting price"}</p>
                    <p className="text-2xl font-extrabold text-primary leading-tight">
                      ${isCompleted ? b.finalAmount : b.basePrice}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2">
                    {/* PAY NOW — prominent amber button, only when completed + unpaid */}
                    {canPay && (
                      <button
                        className="btn w-full text-white font-bold rounded-xl transition-all"
                        style={{ background: "#c58310", border: "none" }}
                        disabled={isPaying}
                        onClick={() => pay(b)}
                      >
                        {isPaying ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          "Pay now"
                        )}
                      </button>
                    )}

                    {/* Paid badge */}
                    {isPaid && (
                      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl py-2">
                        <Check size={15} /> Payment received
                      </div>
                    )}

                    {/* Track button */}
                    <button
                      className="btn btn-outline btn-sm w-full rounded-xl"
                      onClick={() => setTracking(b)}
                    >
                      Track job
                    </button>

                    {/* Cancel — only while still "requested" */}
                    {canCancel && (
                      <button
                        className="btn btn-error btn-outline btn-sm w-full rounded-xl"
                        onClick={() => setTarget(b)}
                      >
                        Cancel request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Cancel confirm modal ── */}
      <ConfirmModal
        open={!!target}
        title="Cancel this request?"
        message={`Your request for "${target?.serviceTitle ?? ""}" will be cancelled. This cannot be undone.`}
        confirmText="Yes, Cancel"
        loading={busy}
        onConfirm={cancel}
        onClose={() => setTarget(null)}
      />

      {/* ── Job tracker modal ── */}
      <div className={`modal ${tracking ? "modal-open" : ""}`}>
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg text-primary">Track your repair</h3>
          <p className="text-sm text-base-content/60">{tracking?.serviceTitle}</p>
          <p className="text-xs text-base-content/50 mt-1">
            Preferred {tracking ? fmtDate(tracking.preferredDate) : ""} · {tracking?.address}
          </p>

          {tracking && (
            <>
              <ol className="mt-5">
                {TRACK_STEPS.map((s, i) => {
                  const done = hasStatus(s.key);
                  const current = tracking.status === s.key && !terminal;
                  const at = history.find((h) => h.status === s.key)?.changedAt;
                  return (
                    <li key={s.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done
                              ? "bg-secondary text-secondary-content"
                              : "bg-base-200 text-base-content/40"
                            } ${current ? "ring-2 ring-secondary ring-offset-2" : ""}`}
                        >
                          {done ? <Check size={14} /> : i + 1}
                        </span>
                        {i < TRACK_STEPS.length - 1 && (
                          <span className={`w-0.5 h-6 ${done ? "bg-secondary" : "bg-base-300"}`} />
                        )}
                      </div>
                      <div className="pb-3">
                        <p className={`text-sm font-semibold ${done ? "text-primary" : "text-base-content/40"}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-base-content/60">{s.hint}</p>
                        {at && <p className="text-xs text-base-content/40 mt-0.5">{fmtWhen(at)}</p>}
                      </div>
                    </li>
                  );
                })}

                {/* Step 5 — Paid */}
                <li className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${paid ? "bg-success text-success-content" : "bg-base-200 text-base-content/40"
                        }`}
                    >
                      {paid ? <Check size={14} /> : 5}
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${paid ? "text-primary" : "text-base-content/40"}`}>Paid</p>
                    <p className="text-xs text-base-content/60">Secure payment after completion</p>
                  </div>
                </li>
              </ol>

              {terminal && (
                <div className="mt-1 rounded-box bg-error/10 border border-error/30 p-3">
                  <p className="text-sm font-semibold text-error capitalize">Request {tracking.status}</p>
                  <p className="text-xs text-base-content/60">
                    {lastChange ? `on ${fmtWhen(lastChange)} — ` : ""}no further action is needed.
                  </p>
                </div>
              )}

              {/* Pay Now inside tracker — if applicable */}
              {tracking.status === "completed" && tracking.paymentStatus === "unpaid" && (
                <button
                  className="btn w-full mt-4 text-white font-bold rounded-xl"
                  style={{ background: "#fcad24", border: "none" }}
                  disabled={payingId === tracking._id}
                  onClick={() => pay(tracking)}
                >
                  {payingId === tracking._id ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    "Pay now"
                  )}
                </button>
              )}
            </>
          )}

          <div className="modal-action">
            <button className="btn btn-ghost" onClick={() => setTracking(null)}>Close</button>
          </div>
        </div>
        <div className="modal-backdrop" onClick={() => setTracking(null)} />
      </div>
    </>
  );
}
