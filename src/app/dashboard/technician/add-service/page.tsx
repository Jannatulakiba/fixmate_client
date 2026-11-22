"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/ServiceForm";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function AddService() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const user = data?.user;

  return (
    <>
      <PageHeader title="Add a service" subtitle="Your service will be visible after admin approval." />
      <div className="bg-base-100 border border-base-300 rounded-box p-6 max-w-3xl">
        <ServiceForm
          technician={user ? { name: user.name, email: user.email } : undefined}
          submitLabel="Add Service"
          onSubmit={async (payload) => {
            await apiFetch("/api/services", { method: "POST", body: JSON.stringify(payload) });
            toast.success("Service submitted. It is waiting for admin approval.");
            router.push("/dashboard/technician/my-services");
          }}
        />
      </div>
    </>
  );
}