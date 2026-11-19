export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton h-24" />)}
      </div>
      <div className="skeleton h-72 w-full" />
    </div>
  );
}