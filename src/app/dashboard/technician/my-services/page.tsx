"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { PackageOpen } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import ServiceForm from "@/components/ServiceForm";
import { apiFetch } from "@/lib/api";
import type { MyService } from "@/lib/types";

export default function MyServices() {
  const [list, setList] = useState<MyService[] | null>(null);
  const [editing, setEditing] = useState<MyService | null>(null);
  const [deleting, setDeleting] = useState<MyService | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    apiFetch<MyService[]>("/api/services/my")
      .then(setList)
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  const toggle = async (s: MyService) => {
    try {
      await apiFetch(`/api/services/${s._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isAvailable: !s.isAvailable }),
      });
      setList((l) => l!.map((x) => (x._id === s._id ? { ...x, isAvailable: !s.isAvailable } : x)));
      toast.success(s.isAvailable ? "Service hidden from public pages" : "Service is now available");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update availability");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await apiFetch(`/api/services/${deleting._id}`, { method: "DELETE" });
      setList((l) => l!.filter((x) => x._id !== deleting._id));
      toast.success("Service deleted");
      setDeleting(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete service");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="My Services" subtitle="Edit, pause or remove your listings." />
        <Link href="/dashboard/technician/add-service" className="btn btn-secondary">
          Add a Service
        </Link>
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Price</th>
              <th>Review</th>
              <th>Available</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={6}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {list?.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-14">
                  <PackageOpen size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No services yet</p>
                  <p className="text-sm text-base-content/60">Add your first service to start getting requests.</p>
                  <Link href="/dashboard/technician/add-service" className="btn btn-secondary btn-sm mt-4">Add a Service</Link>
                </td>
              </tr>
            )}

            {list?.map((s) => (
              <tr key={s._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={s.image} alt={s.title} className="w-14 h-10 rounded object-cover" />
                    <p className="font-semibold text-primary">{s.title}</p>
                  </div>
                </td>
                <td className="text-sm">{s.category}</td>
                <td className="font-semibold">${s.basePrice}</td>
                <td><StatusBadge status={s.approvalStatus} /></td>
                <td>
                  <input type="checkbox" className="toggle toggle-success toggle-sm"
                    checked={s.isAvailable} onChange={() => toggle(s)} aria-label="availability" />
                </td>
                <td>
                  <div className="flex gap-2 justify-end">
                    <button className="btn btn-ghost btn-xs" onClick={() => setEditing(s)}>
                      Edit
                    </button>
                    <button className="btn btn-error btn-outline btn-xs" onClick={() => setDeleting(s)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      <div className={`modal ${editing ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg text-primary">Edit service</h3>
          <p className="text-xs text-base-content/60 mb-4">After saving, the service goes back to pending approval.</p>
          {editing && (
            <ServiceForm
              key={editing._id}
              initial={{ ...editing, basePrice: String(editing.basePrice) }}
              submitLabel="Save Changes"
              onCancel={() => setEditing(null)}
              onSubmit={async (payload) => {
                const updated = await apiFetch<MyService>(`/api/services/${editing._id}`, {
                  method: "PATCH",
                  body: JSON.stringify(payload),
                });
                setList((l) => l!.map((x) => (x._id === updated._id ? updated : x)));
                setEditing(null);
                toast.success("Service updated. It is pending admin approval again.");
              }}
            />
          )}
        </div>
        <div className="modal-backdrop" onClick={() => setEditing(null)} />
      </div>

      <ConfirmModal
        open={!!deleting}
        title="Delete this service?"
        message={`"${deleting?.title ?? ""}" will be removed permanently Existing bookings keep their details.`}
        confirmText="Delete"
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}