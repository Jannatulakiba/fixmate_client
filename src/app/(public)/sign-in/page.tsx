"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Wrench, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardPath, getUserRole } from "@/lib/roles";
import GoogleButton from "@/components/GoogleButton";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("redirect");
  const redirectTo = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : null;
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
    <div className="w-full max-w-md bg-base-100 rounded-3xl border border-base-300 shadow-xl p-8">
      <span className="eyebrow text-secondary">Welcome back</span>
      <h1 className="text-2xl font-extrabold text-primary mt-2">Sign in to FixMate</h1>
      <p className="text-sm text-base-content/70 mt-1">Manage your repairs, requests and payments.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label className="label text-sm font-medium">Email</label>
          <input type="email" value={form.email} placeholder="you@example.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`input w-full ${errors.email ? "input-error" : ""}`} />
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="label text-sm font-medium">password</label>
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
      <div className="divider text-xs text-base-content/50 my-5">OR</div>
      <GoogleButton callbackURL={redirectTo || "/services"} />
      <p className="text-sm text-center mt-6 text-base-content/70">
        New to FixMate?{" "}
        <Link href="/sign-up" className="text-primary font-semibold hover:underline">Sign Up</Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <section className="grid lg:grid-cols-2 min-h-[calc(100vh-3.5rem)] -mb-20">
      {/* brand panel (TaskRabbit / Urban Company style split) */}
      <div className="hidden lg:flex flex-col justify-between hero-pattern text-primary-content p-12 relative overflow-hidden">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl w-fit">
          <span className="bg-secondary text-secondary-content p-1.5 rounded-lg">
            <Wrench size={20} />
          </span>
          FixMate
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">
            Your repairs, <span className="text-secondary">tracked and guaranteed.</span>
          </h2>
          <ul className="mt-6 space-y-3 text-primary-content/85">
            {[
              "Verified technicians for every job",
              "Live status from request to completion",
              "Pay only after the work is done",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-secondary shrink-0" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-primary-content/50">
          © {new Date().getFullYear()} FixMate · Barishal, Bangladesh
        </p>
      </div>

      {/* form panel */}
      <div className="flex items-center justify-center px-4 py-12 bg-base-200">
        <Suspense fallback={<span className="loading loading-spinner loading-lg text-secondary" />}>
          <SignInForm />
        </Suspense>
      </div>
    </section>
  );
}