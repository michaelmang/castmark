"use client";

import Link from "next/link";
import { ClickChart } from "@/components/click-chart";
import { triggerHaptic } from "@/lib/haptics";

export function TrendChartCard({
  title,
  chartData,
  href,
  action,
}: {
  title: string;
  chartData: { date: string; count: number }[];
  href?: string;
  action?: React.ReactNode;
}) {
  const content = (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-muted text-xs font-medium">{title}</p>
        {action}
      </div>
      <ClickChart data={chartData} />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={() => triggerHaptic()}
        className="border-border bg-surface hover:border-border-strong block rounded-2xl border p-5 transition-colors active:scale-[0.99]"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      {content}
    </div>
  );
}
