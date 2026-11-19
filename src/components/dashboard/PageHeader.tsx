export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold text-primary">{title}</h1>
      {subtitle && <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>}
    </div>
  );
}