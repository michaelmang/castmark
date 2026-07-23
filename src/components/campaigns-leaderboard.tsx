"use client";

import { useMemo, useState } from "react";
import { Leaderboard } from "@/components/leaderboard";
import { triggerHaptic } from "@/lib/haptics";
import type { CampaignStat } from "@/lib/reports";

export function CampaignsLeaderboard({
  campaigns,
  brands,
  totalCount,
}: {
  campaigns: CampaignStat[];
  brands: { id: string; name: string }[];
  totalCount: number;
}) {
  const [brandId, setBrandId] = useState("all");

  const filtered = useMemo(
    () =>
      brandId === "all"
        ? campaigns
        : campaigns.filter((c) => c.sponsorId === brandId),
    [campaigns, brandId],
  );

  const filteredTotal =
    brandId === "all" ? totalCount : filtered.reduce((s, c) => s + c.count, 0);

  return (
    <Leaderboard
      title="Campaigns"
      totalCount={filteredTotal}
      items={filtered.map((c) => ({
        id: c.linkId,
        label: `/${c.slug}`,
        sublabel: c.sponsorName,
        count: c.count,
        href: `/links/${c.linkId}`,
      }))}
      action={
        <select
          value={brandId}
          onChange={(e) => {
            triggerHaptic();
            setBrandId(e.target.value);
          }}
          className="border-border bg-surface-raised text-foreground rounded-md border px-2 py-1 text-xs outline-none"
        >
          <option value="all">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      }
    />
  );
}
