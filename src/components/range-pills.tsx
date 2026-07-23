"use client";

import Link from "next/link";
import { triggerHaptic } from "@/lib/haptics";

export function RangePills({
  ranges,
  active,
  basePath,
}: {
  ranges: { value: string; label: string }[];
  active: string;
  basePath: string;
}) {
  return (
    <div className="border-border flex gap-1 rounded-lg border p-1 text-xs">
      {ranges.map((r) => (
        <Link
          key={r.value}
          href={`${basePath}?range=${r.value}`}
          onClick={() => triggerHaptic()}
          className={`rounded-md px-2.5 py-1.5 transition-colors active:scale-95 ${
            r.value === active
              ? "bg-surface-raised text-foreground"
              : "text-muted"
          }`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  );
}
