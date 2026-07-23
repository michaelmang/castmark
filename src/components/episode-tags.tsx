"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, X } from "lucide-react";
import { addEpisodeTag, removeEpisodeTag } from "@/app/(app)/actions";
import { triggerHaptic } from "@/lib/haptics";

type Episode = {
  id: string;
  title: string;
  slug: string;
  clickCount: number;
};

export function EpisodeTags({
  linkId,
  episodes,
  directClicks,
}: {
  linkId: string;
  episodes: Episode[];
  directClicks: number;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-border bg-surface rounded-2xl border p-5">
      <p className="text-muted mb-4 text-xs font-medium">Episodes</p>

      {episodes.length === 0 ? (
        <p className="text-muted-2 text-sm">No episodes tagged yet</p>
      ) : (
        <div className="flex flex-col">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              onClick={() => {
                triggerHaptic();
                router.push(`/links/${linkId}/episodes/${ep.id}`);
              }}
              className="border-border hover:text-foreground flex cursor-pointer items-center gap-3 border-b py-2.5 transition-transform last:border-b-0 active:scale-[0.99]"
            >
              <span className="text-foreground flex-1 truncate text-sm">
                {ep.title}
              </span>
              <span className="text-muted-2 font-mono text-xs">/{ep.slug}</span>
              <span className="text-muted w-14 shrink-0 text-right text-sm">
                {ep.clickCount.toLocaleString()}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic();
                  startTransition(() => removeEpisodeTag(linkId, ep.id));
                }}
                className="text-muted-2 hover:text-danger shrink-0 transition-colors active:scale-90"
                aria-label={`Remove ${ep.title}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <ChevronRight className="text-muted-2 h-3.5 w-3.5 shrink-0" />
            </div>
          ))}
        </div>
      )}

      {directClicks > 0 && (
        <p className="text-muted-2 mt-3 text-xs">
          +{directClicks.toLocaleString()} clicks via the base link, not tied to
          an episode
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          triggerHaptic();
          startTransition(() => addEpisodeTag(linkId, title));
          setTitle("");
        }}
        className="border-border mt-3 flex items-center gap-2 rounded-lg border border-dashed px-3 py-2"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Episode title"
          disabled={isPending}
          className="text-foreground placeholder:text-muted-2 w-full bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          className="text-muted-2 hover:text-foreground shrink-0 transition-colors active:scale-90"
          aria-label="Add episode"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
