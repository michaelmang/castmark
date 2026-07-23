export function BreakdownList({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <p className="text-muted mb-4 text-xs font-medium">{title}</p>
      {items.length === 0 ? (
        <p className="text-muted-2 text-sm">No data yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-foreground w-24 shrink-0 truncate text-sm">
                {item.label}
              </span>
              <div className="bg-surface-raised h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
              <span className="text-muted w-10 shrink-0 text-right text-xs">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
