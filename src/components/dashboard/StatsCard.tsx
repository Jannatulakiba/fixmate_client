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
  icon: LucideIcon;
  tone?: keyof typeof tones;
};

export default function StatsCard({ label, value, icon: Icon, tone = "primary" }: Props) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-box p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-base-content/60">{label}</p>
        <p className="text-2xl font-extrabold text-primary">{value}</p>
      </div>
    </div>
  );
}