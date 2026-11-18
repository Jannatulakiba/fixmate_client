const map: Record<string, string> = {
  requested: "badge-info",
  accepted: "badge-primary",
  "in-progress": "badge-warning",
  completed: "badge-success",
  rejected: "badge-error",
  cancelled: "badge-neutral",
  paid: "badge-success",
  unpaid: "badge-warning",
  pending: "badge-warning",
  approved: "badge-success",
};

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-soft capitalize ${map[status] ?? ""}`}>{status.replace("-", " ")}</span>;
}