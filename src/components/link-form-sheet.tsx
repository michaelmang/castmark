"use client";

import { useActionState, useEffect, useState } from "react";
import { X } from "lucide-react";
import { saveLink, type ActionResult } from "@/app/(app)/actions";
import { triggerHaptic } from "@/lib/haptics";
import type { LinkRow, SponsorGroup } from "@/lib/client-types";

type Props = {
  open: boolean;
  onClose: () => void;
  sponsors: SponsorGroup[];
  /** Preset sponsor when adding a link from within an existing sponsor's section. */
  presetSponsorId?: string;
  /** Existing campaign slug to prefill as "{prefix}-" when adding a second+ campaign for a sponsor. */
  campaignPrefix?: string;
  link?: LinkRow;
};

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

const initialState: ActionResult = { ok: false };

export function LinkFormSheet({
  open,
  onClose,
  sponsors,
  presetSponsorId,
  campaignPrefix,
  link,
}: Props) {
  const [state, formAction, isPending] = useActionState(saveLink, initialState);
  const isEdit = Boolean(link);
  const lockedSponsorId =
    presetSponsorId ??
    (isEdit
      ? sponsors.find((s) => s.links.some((l) => l.id === link?.id))?.id
      : undefined);
  const lockedSponsor = sponsors.find((s) => s.id === lockedSponsorId);

  const [sponsorMode, setSponsorMode] = useState<"existing" | "new">(
    lockedSponsorId ? "existing" : sponsors.length ? "existing" : "new",
  );

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="border-border bg-surface relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">
            {isEdit ? "Edit campaign" : "New campaign"}
          </h2>
          <button
            onClick={() => {
              triggerHaptic();
              onClose();
            }}
            className="text-muted hover:text-foreground transition-colors active:scale-90"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          action={formAction}
          onSubmit={() => triggerHaptic()}
          className="flex flex-1 flex-col gap-5"
        >
          {link && <input type="hidden" name="linkId" value={link.id} />}

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">Sponsor</label>
            {lockedSponsorId ? (
              <>
                <input type="hidden" name="sponsorMode" value="existing" />
                <input type="hidden" name="sponsorId" value={lockedSponsorId} />
                <div className="border-border bg-surface-raised text-foreground rounded-lg border px-3 py-2 text-sm">
                  {lockedSponsor?.name}
                </div>
              </>
            ) : (
              <>
                {sponsors.length > 0 && (
                  <div className="border-border flex gap-1 rounded-lg border p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setSponsorMode("existing");
                      }}
                      className={`flex-1 rounded-md py-1.5 transition-colors active:scale-95 ${sponsorMode === "existing" ? "bg-surface-raised text-foreground" : "text-muted"}`}
                    >
                      Existing
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setSponsorMode("new");
                      }}
                      className={`flex-1 rounded-md py-1.5 transition-colors active:scale-95 ${sponsorMode === "new" ? "bg-surface-raised text-foreground" : "text-muted"}`}
                    >
                      New
                    </button>
                  </div>
                )}
                <input type="hidden" name="sponsorMode" value={sponsorMode} />
                {sponsorMode === "existing" && sponsors.length > 0 ? (
                  <select
                    name="sponsorId"
                    required
                    className="border-border bg-surface-raised text-foreground focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  >
                    {sponsors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="sponsorName"
                    required
                    placeholder="Sponsor name"
                    className="border-border bg-surface-raised text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">
              Sponsor status
            </label>
            <select
              name="sponsorStatus"
              defaultValue={lockedSponsor?.status ?? "active"}
              className="border-border bg-surface-raised text-foreground focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">Campaign</label>
            <div className="border-border bg-surface-raised focus-within:border-border-strong flex items-center overflow-hidden rounded-lg border">
              <span className="text-muted-2 pl-3 text-sm">/</span>
              <input
                name="slug"
                required
                defaultValue={
                  link?.slug ?? (campaignPrefix ? `${campaignPrefix}-` : "")
                }
                placeholder="blackfriday"
                className="text-foreground placeholder:text-muted-2 w-full bg-transparent px-1.5 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">
              Destination URL
            </label>
            <input
              name="destinationUrl"
              type="url"
              required
              defaultValue={link?.destinationUrl}
              placeholder="https://sponsor.com/promo?code=SHOW20"
              className="border-border bg-surface-raised text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">
              Discount code
            </label>
            <input
              name="discountCode"
              defaultValue={link?.discountCode ?? ""}
              placeholder="SHOW20"
              className="border-border bg-surface-raised text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs font-medium">
                Start date
              </label>
              <input
                name="startDate"
                type="date"
                defaultValue={toDateInputValue(link?.startDate ?? null)}
                className="border-border bg-surface-raised text-foreground focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm [color-scheme:dark] outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-muted text-xs font-medium">End date</label>
              <input
                name="endDate"
                type="date"
                defaultValue={toDateInputValue(link?.endDate ?? null)}
                className="border-border bg-surface-raised text-foreground focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm [color-scheme:dark] outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-muted text-xs font-medium">
              Custom expiration URL
            </label>
            <input
              name="fallbackUrl"
              type="url"
              defaultValue={link?.fallbackUrl ?? ""}
              placeholder="Leave blank to show the default expired page"
              className="border-border bg-surface-raised text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-3 py-2 text-sm outline-none"
            />
          </div>

          {state.error && <p className="text-danger text-sm">{state.error}</p>}

          <div className="mt-auto flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-accent text-accent-foreground flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save campaign"}
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                onClose();
              }}
              className="border-border text-muted hover:text-foreground rounded-lg border px-4 py-2.5 text-sm transition-colors active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
