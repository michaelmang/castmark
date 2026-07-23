"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Pencil, Plus } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { CopyUrlButton } from "@/components/copy-url-button";
import { LinkFormSheet } from "@/components/link-form-sheet";
import { getLinkLifecycleStatus } from "@/lib/link-status";
import { triggerHaptic } from "@/lib/haptics";
import type { LinkRow, SponsorGroup } from "@/lib/client-types";

type SheetState =
  | { mode: "create"; presetSponsorId?: string; campaignPrefix?: string }
  | { mode: "edit"; link: LinkRow };

export function LinksBoard({ sponsors }: { sponsors: SponsorGroup[] }) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [sheetKey, setSheetKey] = useState(0);

  function openSheet(next: SheetState) {
    triggerHaptic();
    setSheet(next);
    setSheetKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-lg font-semibold">Links</h1>
        <button
          onClick={() => openSheet({ mode: "create" })}
          className="bg-accent text-accent-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-opacity hover:opacity-90 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          New sponsor
        </button>
      </div>

      {sponsors.length === 0 ? (
        <button
          onClick={() => openSheet({ mode: "create" })}
          className="border-border text-muted hover:border-border-strong hover:text-foreground rounded-2xl border border-dashed py-16 text-center text-sm transition-colors active:scale-[0.99]"
        >
          Add your first sponsor link
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="border-border bg-surface overflow-hidden rounded-2xl border"
            >
              <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-foreground text-sm font-medium">
                    {sponsor.name}
                  </span>
                  <span className="text-muted-2 text-xs">
                    {sponsor.links
                      .reduce((sum, l) => sum + l.clickCount, 0)
                      .toLocaleString()}{" "}
                    clicks
                  </span>
                </div>
                <button
                  onClick={() =>
                    openSheet({
                      mode: "create",
                      presetSponsorId: sponsor.id,
                      campaignPrefix: sponsor.links[0]?.slug,
                    })
                  }
                  className="text-muted hover:text-foreground flex items-center gap-1 text-xs transition-colors active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add campaign
                </button>
              </div>

              {sponsor.links.length === 0 ? (
                <p className="text-muted-2 px-5 py-4 text-sm">No links yet</p>
              ) : (
                <div className="flex flex-col">
                  {sponsor.links.map((link) => (
                    <LinkRowItem
                      key={link.id}
                      link={link}
                      sponsorStatus={sponsor.status}
                      onEdit={() => openSheet({ mode: "edit", link })}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <LinkFormSheet
        key={sheetKey}
        open={sheet !== null}
        onClose={() => setSheet(null)}
        sponsors={sponsors}
        presetSponsorId={
          sheet?.mode === "create" ? sheet.presetSponsorId : undefined
        }
        campaignPrefix={
          sheet?.mode === "create" ? sheet.campaignPrefix : undefined
        }
        link={sheet?.mode === "edit" ? sheet.link : undefined}
      />
    </div>
  );
}

function LinkRowItem({
  link,
  sponsorStatus,
  onEdit,
}: {
  link: LinkRow;
  sponsorStatus: string;
  onEdit: () => void;
}) {
  const status = getLinkLifecycleStatus({
    sponsorStatus,
    startDate: link.startDate,
    endDate: link.endDate,
  });

  return (
    <div className="border-border flex items-center gap-4 border-b px-5 py-3 last:border-b-0">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <CopyUrlButton slug={link.slug} className="shrink-0" />
        <a
          href={`/${link.slug}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic()}
          className="text-muted hover:text-foreground shrink-0 transition-colors active:scale-90"
          title="Open link"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <span
          className="text-muted truncate text-sm"
          title={link.destinationUrl}
        >
          → {link.destinationUrl}
        </span>
      </div>

      {link.discountCode && (
        <span className="border-border text-muted hidden shrink-0 rounded-full border px-2 py-0.5 font-mono text-xs sm:inline-block">
          {link.discountCode}
        </span>
      )}

      <StatusBadge status={status} />

      <span className="text-foreground w-14 shrink-0 text-right text-sm">
        {link.clickCount.toLocaleString()}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => {
            triggerHaptic();
            onEdit();
          }}
          className="text-muted hover:bg-surface-raised hover:text-foreground rounded-md p-1.5 transition-colors active:scale-90"
          aria-label="Edit link"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <Link
          href={`/links/${link.id}`}
          onClick={() => triggerHaptic()}
          className="text-muted hover:bg-surface-raised hover:text-foreground rounded-md p-1.5 transition-colors active:scale-90"
          aria-label="View analytics"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
