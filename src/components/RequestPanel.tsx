"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

type Props = { service: { _id: string; title: string; technicianEmail: string } };
type Errors = { phone?: string; address?: string; preferredDate?: string; problemDescription?: string };

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function RequestPanel({ service }: Props) {
  const path = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const { data, isPending } = authClient.useSession();
  const user = data?.user as { name: string; email: string; role?: string } | undefined;

  const [form, setForm] = useState({ phone: "", address: "", preferredDate: "", problemDescription: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  if (isPending) return <div className="skeleton h-12 w-full mt-6" />;

  if (!user) {
    return (
      <Link href={`/sign-in?redirect=${encodeURIComponent(path)}`} className="btn btn-secondary w-full mt-6">
        Request Repair
      </Link>
    );
  }

  if (user.role !== "customer") {
    return (
      <>
        <button disabled className="btn btn-secondary w-full mt-6">Request Repair</button>
        <p className="text-xs text-warning mt-2">Only customers can request a repair.</p>
      </>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!/^\+?\d{10,14}$/.test(form.phone.replace(/[\s-]/g, ""))) errs.phone = "Enter a valid phone number";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.preferredDate) errs.preferredDate = "Select a date";
    else if (form.preferredDate < todayStr()) errs.preferredDate = "Date cannot be in the past";
    if (form.problemDescription.trim().length < 20) errs.problemDescription = "Minimum 20 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ serviceId: service._id, ...form }),
      });
      dialog.current?.close();
      setForm({ phone: "", address: "", preferredDate: "", problemDescription: "" });
      toast.success("Repair request sent successfully", {
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
    } catch (e) {
      // duplicate hole: "You already have an active request for this service"
      toast.error(e instanceof Error ? e.message : "Could not send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => dialog.current?.showModal()} className="btn btn-secondary w-full mt-6">
        Request Repair
      </button>

      <dialog ref={dialog} className="modal">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg text-primary">Request Repair</h3>
          <p className="text-sm text-base-content/60">{service.title}</p>

          <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label text-sm">Name</label>
                <input value={user.name} readOnly className="input w-full bg-base-200" />
              </div>
              <div>
                <label className="label text-sm">Email</label>
                <input value={user.email} readOnly className="input w-full bg-base-200" />
              </div>
            </div>

            <div>
              <label className="label text-sm">Phone</label>
              <input value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX"
                className={`input w-full ${errors.phone ? "input-error" : ""}`} />
              {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="label text-sm">Address</label>
              <input value={form.address} onChange={set("address")} placeholder="Service or pickup address"
                className={`input w-full ${errors.address ? "input-error" : ""}`} />
              {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="label text-sm">Preferred Date</label>
              <input type="date" min={todayStr()} value={form.preferredDate} onChange={set("preferredDate")}
                className={`input w-full ${errors.preferredDate ? "input-error" : ""}`} />
              {errors.preferredDate && <p className="text-error text-xs mt-1">{errors.preferredDate}</p>}
            </div>

            <div>
              <label className="label text-sm">Problem Description</label>
              <textarea rows={4} value={form.problemDescription} onChange={set("problemDescription")}
                placeholder="Describe what is wrong (min 20 characters)"
                className={`textarea w-full ${errors.problemDescription ? "textarea-error" : ""}`} />
              {errors.problemDescription && <p className="text-error text-xs mt-1">{errors.problemDescription}</p>}
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => dialog.current?.close()}>Cancel</button>
              <button disabled={loading} className="btn btn-secondary">
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </>
  );
}