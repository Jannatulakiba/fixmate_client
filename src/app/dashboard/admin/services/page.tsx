"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";

type S = {
  _id: string; title: string; category: string; image: string; basePrice: number;
  technicianName: string; technicianEmail: string; approvalStatus: string;
};

const tabs = ["pending", "approved", "rejected", "all"] as const;
type Tab = (typeof tabs)[number];

export default function ServiceApproval() {
  const [filter, setFilter] = useState<Tab>("pending");
  // Rows are stored together with the filter they were fetched for, so switching
  // tabs shows the skeleton again without a setState() call at the top of the effect.
  const [data, setData] = useState<{ filter: Tab; rows: S[] } | null>(null);
  const list = data && data.filter === filter ? data.rows : null;

  useEffect(() => {
    let active = true;
    apiFetch<S[]>(`/api/admin/services${filter === "all" ? "" : `?status=${filter}`}`)
      .then((rows) => {
        if (active) setData({ filter, rows });
      })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Could not load services");
        if (active) setData({ filter, rows: [] });
      });
    return () => {
      active = false;
    };
  }, [filter]);

  const decide = async (s: S, approvalStatus: "approved" | "rejected") => {
    try {
      await apiFetch(`/api/admin/services/${s._id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}`);
      // ekhon-kar filter e ar match na korle list theke soriye dao
      setData((d) => {
        if (!d) return d;
        const rows =
          filter === "all"
            ? d.rows.map((x) => (x._id === s._id ? { ...x, approvalStatus } : x))
            : d.rows.filter((x) => x._id !== s._id);
        return { ...d, rows };
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <>
      <PageHeader title="Service Approval" subtitle="Review services submitted by technicians." />

      <div role="tablist" className="tabs tabs-box mb-4 w-fit">
        {tabs.map((t) => (
          <button key={t} role="tab" onClick={() => setFilter(t)}
            className={`tab capitalize ${filter === t ? "tab-active" : ""}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>Service</th><th>Technician</th><th>Price</th><th>Status</th><th className="text-right">Action</th></tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={5}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {list?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <ShieldCheck size={36} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No {filter === "all" ? "" : filter} services</p>
                  <p className="text-sm text-base-content/60">Nothing to review here right now.</p>
                </td>
              </tr>
            )}

            {list?.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt={s.title} className="w-14 h-10 rounded object-cover" />
                    <div>
                      <p className="font-semibold text-primary">{s.title}</p>
                      <p className="text-xs text-base-content/60">{s.category}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm">
                  {s.technicianName}
                  <p className="text-xs text-base-content/60">{s.technicianEmail}</p>
                </td>
                <td className="font-semibold">${s.basePrice}</td>
                <td><StatusBadge status={s.approvalStatus} /></td>
                <td>
                  <div className="flex gap-2 justify-end">
                    <button className="btn btn-success btn-xs" disabled={s.approvalStatus === "approved"}
                      onClick={() => decide(s, "approved")}>Approve</button>
                    <button className="btn btn-error btn-outline btn-xs" disabled={s.approvalStatus === "rejected"}
                      onClick={() => decide(s, "rejected")}>Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}