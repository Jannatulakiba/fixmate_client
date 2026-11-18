"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardPath, getUserRole } from "@/lib/roles";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect");
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const role = "role" in session.user ? getUserRole(session.user.role) : "customer";
      router.replace(redirectTo || dashboardPath(role));
    }
  }, [session, router, redirectTo]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);

    if (error) return toast.error(error.message || "Invalid email or password");
    toast.success("Signed in successfully");
    const role = data?.user && "role" in data.user ? getUserRole(data.user.role) : "customer";
    router.replace(redirectTo || dashboardPath(role));
  };

  return (
    <div className="w-full max-w-md bg-base-100 rounded-box border border-base-300 shadow-sm p-8">
      <h1 className="text-2xl font-extrabold text-primary">Welcome back</h1>
      <p className="text-sm text-base-content/70 mt-1">Sign in to manage your repairs.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label className="label text-sm font-medium">Email</label>
          <input type="email" value={form.email} placeholder="you@example.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`input w-full ${errors.email ? "input-error" : ""}`} />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="label text-sm font-medium">Password</label>
          <div className="relative">
            <input type={show ? "text" : "password"} value={form.password} placeholder="Your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`input w-full pr-10 ${errors.password ? "input-error" : ""}`} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label="toggle password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60">
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
        </div>

        <button disabled={loading} className="btn btn-secondary w-full">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-base-content/70">
        New to FixMate?{" "}
        <Link href="/sign-up" className="text-primary font-semibold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <section className="min-h-[80vh] bg-base-200 flex items-center justify-center px-4 py-12">
      <Suspense fallback={<span className="loading loading-spinner loading-lg" />}>
        <SignInForm />
      </Suspense>
    </section>
  );
}