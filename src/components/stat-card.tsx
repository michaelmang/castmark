export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="border-border bg-surface rounded-2xl border px-5 py-4">
      <p className="text-muted text-xs font-medium">{label}</p>
      <p className="text-foreground mt-1.5 text-2xl font-semibold tracking-tight">
        {value}
      </p>
      {sublabel && <p className="text-muted-2 mt-0.5 text-xs">{sublabel}</p>}
    </div>
  );
}
