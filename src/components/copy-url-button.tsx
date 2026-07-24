"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

function subscribe() {
  return () => {};
}

function getHostSnapshot() {
  return window.location.host;
}

function getServerHostSnapshot() {
  return "";
}

export function CopyUrlButton({
  accountSlug,
  slug,
  className = "",
}: {
  accountSlug: string;
  slug: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const host = useSyncExternalStore(
    subscribe,
    getHostSnapshot,
    getServerHostSnapshot,
  );

  return (
    <button
      type="button"
      title="Copy link"
      onClick={async (e) => {
        e.stopPropagation();
        triggerHaptic();
        await navigator.clipboard.writeText(
          `${window.location.origin}/${accountSlug}/${slug}`,
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`group border-border bg-surface-raised text-foreground hover:border-border-strong inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors active:scale-[0.97] ${className}`}
    >
      {copied ? (
        <Check className="text-success h-3 w-3 shrink-0" />
      ) : (
        <Copy className="text-muted-2 group-hover:text-foreground h-3 w-3 shrink-0" />
      )}
      <span className="truncate">
        {host}/{accountSlug}/{slug}
      </span>
    </button>
  );
}
