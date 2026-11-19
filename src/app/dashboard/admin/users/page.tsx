"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type U = { _id: string; name: string; email: string; image?: string; role: string; createdAt: string };

export default function ManageUsers() {
  const { data: session } = authClient.useSession();
  const me = session?.user?.email;
  const [users, setUsers] = useState<U[] | null>(null);

  useEffect(() => {
    apiFetch<U[]>("/api/admin/users")
      .then(setUsers)
      .catch((e) => {
        toast.error(e.message);
        setUsers([]);
      });
  }, []);

  const changeRole = async (u: U, role: string) => {
    try {
      await apiFetch(`/api/admin/users/${u._id}/role`, { method: "PATCH", body: JSON.stringify({ role }) });
      setUsers((list) => list!.map((x) => (x._id === u._id ? { ...x, role } : x)));
      toast.success(`${u.name} is now ${role}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update role");
    }
  };

  return (
    <>
      <PageHeader title="Manage Users" subtitle="Change roles for customers and technicians." />
      <div className="bg-base-100 border border-base-300 rounded-box overflow-x-auto">
        <table className="table">
          <thead>
            <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {users === null &&
              [0, 1, 2, 3].map((i) => (
                <tr key={i}><td colSpan={4}><div className="skeleton h-10 w-full" /></td></tr>
              ))}
            {users?.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-9 rounded-full">
                        {u.image ? (
                          <img src={u.image} alt={u.name} referrerPolicy="no-referrer" />
                        ) : (
                          <span className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-sm font-bold">
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-primary">{u.name}</span>
                  </div>
                </td>
                <td className="text-sm">{u.email}</td>
                <td>
                  <select
                    className="select select-sm w-36"
                    value={u.role}
                    disabled={u.email === me}
                    title={u.email === me ? "You cannot change your own role" : ""}
                    onChange={(e) => changeRole(u, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="technician">Technician</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}