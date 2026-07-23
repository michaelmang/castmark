"use client";

import Link from "next/link";
import { triggerHaptic } from "@/lib/haptics";

export type LeaderboardItem = {
  id: string;
  label: string;
  sublabel?: string;
  count: number;
  href?: string;
};

export function Leaderboard({
  title,
  items,
  totalCount,
  emptyText,
  action,
}: {
  title: string;
  items: LeaderboardItem[];
  totalCount: number;
  emptyText?: string;
  action?: React.ReactNode;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted text-xs font-medium">{title}</p>
        {action}
      </div>
      {items.length === 0 ? (
        <p className="text-muted-2 text-sm">{emptyText ?? "No data yet"}</p>
      ) : (
        <div className="flex flex-col">
          {items.map((item, i) => {
            const share =
              totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;

            const content = (
              <>
                <span className="text-muted-2 w-5 shrink-0 text-xs">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm">
                    {item.label}
                  </p>
                  {item.sublabel && (
                    <p className="text-muted-2 truncate text-xs">
                      {item.sublabel}
                    </p>
                  )}
                </div>
                <div className="bg-surface-raised h-1.5 w-20 shrink-0 overflow-hidden rounded-full">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
                <span className="text-muted w-20 shrink-0 text-right text-sm">
                  {item.count.toLocaleString()}
                  <span className="text-muted-2 ml-1 text-xs">({share}%)</span>
                </span>
              </>
            );

            const rowClass =
              "flex items-center gap-3 border-b border-border py-2.5 last:border-b-0";

            return item.href ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => triggerHaptic()}
                className={`${rowClass} hover:bg-surface-raised -mx-1 rounded-lg px-1 transition-all active:scale-[0.99]`}
              >
                {content}
              </Link>
            ) : (
              <div key={item.id} className={rowClass}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
