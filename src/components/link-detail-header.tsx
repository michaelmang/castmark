"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { CopyUrlButton } from "@/components/copy-url-button";
import { LinkFormSheet } from "@/components/link-form-sheet";
import { deleteLink } from "@/app/(app)/actions";
import { getLinkLifecycleStatus } from "@/lib/link-status";
import { triggerHaptic } from "@/lib/haptics";
import type { LinkRow } from "@/lib/client-types";

export function LinkDetailHeader({
  accountSlug,
  link,
  sponsorId,
  sponsorName,
  sponsorStatus,
}: {
  accountSlug: string;
  link: LinkRow;
  sponsorId: string;
  sponsorName: string;
  sponsorStatus: string;
}) {
  const [editing, setEditing] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const status = getLinkLifecycleStatus({
    sponsorStatus,
    startDate: link.startDate,
    endDate: link.endDate,
  });

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/dashboard"
        onClick={() => triggerHaptic()}
        className="text-muted hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors active:scale-95"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {sponsorName}
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-foreground font-mono text-xl font-semibold">
              /{link.slug}
            </h1>
            <StatusBadge status={status} />
          </div>
          <div className="flex items-center gap-2">
            <CopyUrlButton accountSlug={accountSlug} slug={link.slug} />
            <a
              href={`/${accountSlug}/${link.slug}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => triggerHaptic()}
              className="text-muted hover:text-foreground transition-colors active:scale-90"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              triggerHaptic();
              setEditing(true);
              setSheetKey((k) => k + 1);
            }}
            className="border-border text-muted hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors active:scale-95"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <form
            action={deleteLink.bind(null, link.id)}
            onSubmit={(e) => {
              if (!confirm("Delete this link? This can't be undone.")) {
                e.preventDefault();
                return;
              }
              triggerHaptic([10, 30, 10]);
            }}
          >
            <button
              type="submit"
              className="border-border text-muted hover:border-danger hover:text-danger flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </form>
        </div>
      </div>

      <p className="text-muted truncate text-sm" title={link.destinationUrl}>
        → {link.destinationUrl}
      </p>

      <LinkFormSheet
        key={sheetKey}
        open={editing}
        onClose={() => setEditing(false)}
        sponsors={[
          {
            id: sponsorId,
            name: sponsorName,
            status: sponsorStatus,
            links: [],
          },
        ]}
        presetSponsorId={sponsorId}
        link={link}
      />
    </div>
  );
}
