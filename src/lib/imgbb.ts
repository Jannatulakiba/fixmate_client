export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("ImgBB key is missing in .env.local");
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB");

  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) throw new Error(json?.error?.message || "Image upload failed");
  return json.data.url as string;
}