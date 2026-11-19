export type UserRole = "customer" | "technician" | "admin";

export function getUserRole(value: unknown): UserRole {
  return value === "technician" || value === "admin" ? value : "customer";
}

export function dashboardPath(value: unknown): string {
  return `/dashboard/${getUserRole(value)}`;
}
