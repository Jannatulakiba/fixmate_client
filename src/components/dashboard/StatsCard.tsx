import type { LucideIcon } from "lucide-react";

const tones = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  accent: "bg-accent/15 text-accent",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
};

type Props = {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: keyof typeof tones;
  hint?: string;
  highlight?: boolean;
};

export default function StatsCard({ label, value, icon: Icon, tone = "primary", hint, highlight }: Props) {
  return (
    <div
      className={`rounded-box p-5 flex items-start gap-4 border ${
        highlight ? "bg-primary text-primary-content border-primary" : "bg-base-100 border-base-300"
      }`}
    >
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${highlight ? "bg-white/15" : tones[tone]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className={`text-sm ${highlight ? "text-primary-content/80" : "text-base-content/60"}`}>{label}</p>
        <p className={`text-3xl font-extrabold ${highlight ? "text-secondary" : "text-primary"}`}>{value}</p>
        {hint && (
          <p className={`text-xs mt-1 ${highlight ? "text-primary-content/70" : "text-base-content/60"}`}>{hint}</p>
        )}
      </div>
    </div>
  );
}