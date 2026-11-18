export type UserRole = "customer" | "technician";

export function getUserRole(value: unknown): UserRole {
  return value === "technician" ? "technician" : "customer";
}

export function dashboardPath(value: unknown): string {
  return getUserRole(value) === "technician" ? "/technician" : "/customer";
}
