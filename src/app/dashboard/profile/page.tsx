"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";

type U = {
  name: string; email: string; image?: string | null; role?: string;
  phone?: string | null; area?: string | null; bio?: string | null;
};

const roleBadge: Record<string, string> = {
  customer: "badge-info",
  technician: "badge-warning",
  admin: "badge-error",
};

function ProfileForm({ user }: { user: U }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: user.phone ?? "",
    area: user.area ?? "",
    bio: user.bio ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(user.image ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const role = user.role ?? "customer";
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please select an image file");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Name must be at least 2 characters";
    if (form.phone && !/^\+?\d{10,14}$/.test(form.phone.replace(/[\s-]/g, ""))) er.phone = "Enter a valid phone number";
    if (form.bio.length > 300) er.bio = "Bio must be 300 characters or less";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const image = file ? await uploadImage(file) : undefined;
      await apiFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ ...form, ...(image && { image }) }),
      });
      setFile(null);
      // navbar ar dashboard top bar logout chhara update hobe
      authClient.$store.notify("$sessionSignal");
      router.refresh();
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-base-100 border border-base-300 rounded-box p-6 max-w-3xl space-y-5" noValidate>
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-20 rounded-full ring ring-secondary ring-offset-2 ring-offset-base-100">
            {preview ? (
              <img src={preview} alt={user.name} referrerPolicy="no-referrer" />
            ) : (
              <span className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            <Camera size={16} /> Change photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={pick} className="hidden" />
          <p className="text-xs text-base-content/60 mt-1">PNG or JPG, up to 5MB.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label text-sm font-medium">Email</label>
          <input value={user.email} readOnly className="input w-full bg-base-200" />
        </div>
        <div>
          <label className="label text-sm font-medium">Role</label>
          <div className="h-10 flex items-center">
            <span className={`badge badge-soft capitalize ${roleBadge[role]}`}>{role}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="label text-sm font-medium">Full Name</label>
        <input value={form.name} onChange={set("name")} className={`input w-full ${errors.name ? "input-error" : ""}`} />
        {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label text-sm font-medium">Phone</label>
          <input value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX"
            className={`input w-full ${errors.phone ? "input-error" : ""}`} />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="label text-sm font-medium">Area</label>
          <input value={form.area} onChange={set("area")} placeholder="e.g. Mirpur, Dhaka" className="input w-full" />
        </div>
      </div>

      <div>
        <label className="label text-sm font-medium">Bio</label>
        <textarea rows={4} value={form.bio} onChange={set("bio")}
          placeholder={role === "technician" ? "Your skills and experience" : "A short bio"}
          className={`textarea w-full ${errors.bio ? "textarea-error" : ""}`} />
        <p className="text-xs text-base-content/60 mt-1">{form.bio.length}/300</p>
        {errors.bio && <p className="text-error text-xs">{errors.bio}</p>}
      </div>

      <div className="flex justify-end">
        <button disabled={loading} className="btn btn-secondary">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user as U | undefined;

  return (
    <>
      <PageHeader title="Update profile" subtitle="Your name and photo appear across FixMate." />
      {isPending || !user ? <div className="skeleton h-96 max-w-3xl" /> : <ProfileForm user={user} />}
    </>
  );
}