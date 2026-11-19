"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, UserRound, Wrench } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { dashboardPath, getUserRole } from "@/lib/roles";

type Errors = { name?: string; email?: string; password?: string };

function validate(name: string, email: string, password: string): Errors {
  const e: Errors = {};
  if (!name.trim()) e.name = "Full name is required";
  if (!email.trim()) e.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
  if (password.length < 6) e.password = "At least 6 characters";
  else if (!/[A-Z]/.test(password)) e.password = "Add at least one uppercase letter";
  else if (!/[a-z]/.test(password)) e.password = "Add at least one lowercase letter";
  return e;
}

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const role = "role" in session.user ? getUserRole(session.user.role) : "customer";
      router.replace(dashboardPath(role));
    }
  }, [session, router]);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form.name, form.email, form.password);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role,
    });
    setLoading(false);

    if (error) return toast.error(error.message || "Sign up failed");
    toast.success("Account created successfully");
    router.replace(dashboardPath(role));
  };

  const roles = [
    { value: "customer", label: "Customer", text: "I need a repair", icon: UserRound },
    { value: "technician", label: "Technician", text: "I offer repair services", icon: Wrench },
  ] as const;

  return (
    <section className="min-h-[80vh] bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-base-100 rounded-box border border-base-300 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-primary">Create your account</h1>
        <p className="text-sm text-base-content/70 mt-1">Join FixMate in a minute.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="label text-sm font-medium">Full Name</label>
            <input value={form.name} onChange={onChange("name")} placeholder="Your name"
              className={`input w-full ${errors.name ? "input-error" : ""}`} />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={onChange("email")} placeholder="you@example.com"
              className={`input w-full ${errors.email ? "input-error" : ""}`} />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label text-sm font-medium">Password</label>
            <div className="relative">
              <input type={show ? "text" : "password"} value={form.password} onChange={onChange("password")}
                placeholder="Min 6 chars, upper and lower case"
                className={`input w-full pr-10 ${errors.password ? "input-error" : ""}`} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label="toggle password"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="label text-sm font-medium">I am a</label>
            <div className="grid grid-cols-2 gap-3 mt-1">
              {roles.map((r) => (
                <button type="button" key={r.value} onClick={() => setRole(r.value)}
                  className={`rounded-box border p-4 text-left transition ${
                    role === r.value ? "border-secondary bg-secondary/10" : "border-base-300 hover:border-secondary/60"
                  }`}>
                  <r.icon size={20} className="text-secondary" />
                  <p className="font-semibold text-primary mt-2">{r.label}</p>
                  <p className="text-xs text-base-content/60">{r.text}</p>
                </button>
              ))}
            </div>
          </div>

          <button disabled={loading} className="btn btn-secondary w-full">
            {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-base-content/70">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
}