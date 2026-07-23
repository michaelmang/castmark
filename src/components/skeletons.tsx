import { Skeleton } from "@/components/skeleton";

export function StatsRowSkeleton({ columns = 3 }: { columns?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-surface rounded-2xl border px-5 py-4"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-7 w-14" />
        </div>
      ))}
    </div>
  );
}

export function ChartCardSkeleton() {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <Skeleton className="mb-4 h-3 w-32" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export function LinksBoardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-surface overflow-hidden rounded-2xl border"
          >
            <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex flex-col gap-0">
              {Array.from({ length: 2 }).map((_, j) => (
                <div
                  key={j}
                  className="border-border flex items-center gap-4 border-b px-5 py-3 last:border-b-0"
                >
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BreakdownListSkeleton() {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <Skeleton className="mb-4 h-3 w-20" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-1.5 flex-1" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LeaderboardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <Skeleton className="mb-4 h-3 w-16" />
      <div className="flex flex-col gap-0">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="border-border flex items-center gap-3 border-b py-2.5 last:border-b-0"
          >
            <Skeleton className="h-3 w-4" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-1.5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EpisodeTagsSkeleton() {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <Skeleton className="mb-4 h-3 w-16" />
      <div className="flex flex-col gap-0">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="border-border flex items-center gap-3 border-b py-2.5 last:border-b-0"
          >
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
