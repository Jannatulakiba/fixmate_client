import { authClient } from "./auth-client";

const API = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const { data } = await authClient.token();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(data?.token ? { Authorization: `Bearer ${data.token}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}