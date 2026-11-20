"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ReceiptText, DollarSign } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import { apiFetch } from "@/lib/api";

type Tx = {
  _id: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  amount: number;
  transactionId: string;
  paidAt: string;
};

export default function Transactions() {
  const [data, setData] = useState<{ payments: Tx[]; totalRevenue: number } | null>(null);

  useEffect(() => {
    apiFetch<{ payments: Tx[]; totalRevenue: number }>("/api/admin/payments")
      .then(setData)
      .catch((e) => {
        toast.error(e.message);
        setData({ payments: [], totalRevenue: 0 });
      });
  }, []);

  return (
    <>
      <PageHeader title="Transactions" subtitle="Every Stripe payment recorded on FixMate." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-6">
        <StatsCard
          label="Total revenue"
          value={data ? `$${Number(data.totalRevenue.toFixed(2))}` : "..."}
          icon={DollarSign}
          highlight
          hint={data ? `${data.payments.length} payment(s)` : undefined}
        />
      </div>

      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th><th>Technician</th><th>Service</th><th>Amount</th>
              <th>Transaction ID</th><th>Paid On</th>
            </tr>
          </thead>
          <tbody>
            {data === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={6}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {data?.payments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-14">
                  <ReceiptText size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No transactions yet</p>
                  <p className="text-sm text-base-content/60">Payments will appear here after customers pay.</p>
                </td>
              </tr>
            )}

            {data?.payments.map((p) => (
              <tr key={p._id}>
                <td className="text-sm">
                  {p.customerName}
                  <p className="text-xs text-base-content/60">{p.customerEmail}</p>
                </td>
                <td className="text-sm">{p.technicianName}</td>
                <td className="font-medium text-primary">{p.serviceTitle}</td>
                <td className="font-semibold">${p.amount}</td>
                <td className="font-mono text-xs">{p.transactionId}</td>
                <td className="text-sm whitespace-nowrap">{new Date(p.paidAt).toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}