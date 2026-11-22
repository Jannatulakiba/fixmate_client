"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ReceiptText } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiFetch } from "@/lib/api";
import type { Payment } from "@/lib/types";

export default function PaymentHistory() {
  const [list, setList] = useState<Payment[] | null>(null);

  useEffect(() => {
    apiFetch<Payment[]>("/api/payments/my")
      .then(setList)
      .catch((e) => {
        toast.error(e.message);
        setList([]);
      });
  }, []);

  return (
    <>
      <PageHeader title="Payment History" subtitle="Every job you have paid for." />
      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>Service</th><th>Technician</th><th>amount</th><th>Transaction ID</th><th>Paid On</th></tr>
          </thead>
          <tbody>
            {list === null &&
              [0, 1, 2].map((i) => (
                <tr key={i}><td colSpan={5}><div className="skeleton h-12 w-full" /></td></tr>
              ))}

            {list?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-14">
                  <ReceiptText size={38} className="mx-auto text-secondary" />
                  <p className="font-semibold text-primary mt-2">No payments yet</p>
                  <p className="text-sm text-base-content/60">Paid jobs will appear here.</p>
                  <Link href="/dashboard/customer/bookings" className="btn btn-secondary btn-sm mt-4">View Bookings</Link>
                </td>
              </tr>
            )}

            {list?.map((p) => (
              <tr key={p._id}>
                <td className="font-semibold text-primary">{p.serviceTitle}</td>
                <td className="text-sm">{p.technicianName}</td>
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