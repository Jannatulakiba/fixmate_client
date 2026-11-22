"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/imgbb";
import { FALLBACK_TAXONOMY, fetchCategories, type Taxonomy } from "@/lib/public";

export type ServiceValues = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  image: string;
};
export type ServicePayload = Omit<ServiceValues, "basePrice"> & { basePrice: number };

const empty: ServiceValues = {
  title: "", category: "", description: "", basePrice: "",
  estimatedDuration: "", serviceMode: "", serviceArea: "", image: "",
};

type Props = {
  initial?: Partial<ServiceValues>;
  submitLabel: string;
  technician?: { name: string; email: string };
  onSubmit: (payload: ServicePayload) => Promise<void>;
  onCancel?: () => void;
};

export default function ServiceForm({ initial, submitLabel, technician, onSubmit, onCancel }: Props) {
  const [v, setV] = useState<ServiceValues>({ ...empty, ...initial });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial?.image ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  // Category/mode list GET /api/services/categories theke; fallback tai select khali na thake
  const [taxonomy, setTaxonomy] = useState<Taxonomy>(FALLBACK_TAXONOMY);

  useEffect(() => {
    let stale = false;
    fetchCategories().then((t) => {
      if (!stale) setTaxonomy(t);
    });
    return () => {
      stale = true;
    };
  }, []);

  const set = (k: keyof ServiceValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  const err = (k: string) => errors[k] && <p className="text-error text-xs mt-1">{errors[k]}</p>;

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (v.title.trim().length < 3) er.title = "Title must be at least 3 characters";
    if (!v.category) er.category = "Select a category";
    if (v.description.trim().length < 20) er.description = "Description must be at least 20 characters";
    if (!(Number(v.basePrice) > 0)) er.basePrice = "Enter a positive price";
    if (!v.estimatedDuration.trim()) er.estimatedDuration = "Estimated duration is required";
    if (!v.serviceMode) er.serviceMode = "Select a service mode";
    if (!v.serviceArea.trim()) er.serviceArea = "Service area is required";
    if (!file && !v.image) er.image = "Service image is required";
    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    try {
      const image = file ? await uploadImage(file) : v.image;
      await onSubmit({
        title: v.title.trim(),
        category: v.category,
        description: v.description.trim(),
        basePrice: Number(v.basePrice),
        estimatedDuration: v.estimatedDuration.trim(),
        serviceMode: v.serviceMode,
        serviceArea: v.serviceArea.trim(),
        image,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {technician && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-sm font-medium">Technician name</label>
            <input value={technician.name} readOnly className="input w-full bg-base-200" />
          </div>
          <div>
            <label className="label text-sm font-medium">Technician email</label>
            <input value={technician.email} readOnly className="input w-full bg-base-200" />
          </div>
        </div>
      )}

      <div>
        <label className="label text-sm font-medium">Title</label>
        <input value={v.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement"
          className={`input w-full ${errors.title ? "input-error" : ""}`} />
        {err("title")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label text-sm font-medium">Category</label>
          <select value={v.category} onChange={set("category")} className={`select w-full ${errors.category ? "select-error" : ""}`}>
            <option value="">Select category</option>
            {taxonomy.categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          {err("category")}
        </div>
        <div>
          <label className="label text-sm font-medium">Service Mode</label>
          <select value={v.serviceMode} onChange={set("serviceMode")} className={`select w-full ${errors.serviceMode ? "select-error" : ""}`}>
            <option value="">Select mode</option>
            {taxonomy.modes.map((m) => <option key={m}>{m}</option>)}
          </select>
          {err("serviceMode")}
        </div>
      </div>

      <div>
        <label className="label text-sm font-medium">Description</label>
        <textarea rows={4} value={v.description} onChange={set("description")}
          placeholder="What does this service include? (min 20 characters)"
          className={`textarea w-full ${errors.description ? "textarea-error" : ""}`} />
        {err("description")}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label text-sm font-medium">Base Price (USD)</label>
          <input type="number" min="0" step="0.01" value={v.basePrice} onChange={set("basePrice")}
            className={`input w-full ${errors.basePrice ? "input-error" : ""}`} />
          {err("basePrice")}
        </div>
        <div>
          <label className="label text-sm font-medium">Estimated Duration</label>
          <input value={v.estimatedDuration} onChange={set("estimatedDuration")} placeholder="e.g. 2-3 hours"
            className={`input w-full ${errors.estimatedDuration ? "input-error" : ""}`} />
          {err("estimatedDuration")}
        </div>
        <div>
          <label className="label text-sm font-medium">Service Area</label>
          <input value={v.serviceArea} onChange={set("serviceArea")} placeholder="e.g. Barishal Sadar"
            className={`input w-full ${errors.serviceArea ? "input-error" : ""}`} />
          {err("serviceArea")}
        </div>
      </div>

      <div>
        <label className="label text-sm font-medium">Service Image</label>
        <input type="file" accept="image/*" onChange={pickFile}
          className={`file-input w-full ${errors.image ? "file-input-error" : ""}`} />
        {err("image")}
        {preview && <img src={preview} alt="Preview" className="mt-3 w-full max-w-sm h-44 object-cover rounded-box border border-base-300" />}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>}
        <button disabled={loading} className="btn btn-secondary">
          {loading ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}