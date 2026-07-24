"use client";

import { useActionState, useState } from "react";
import { signup, type SignupResult } from "./actions";
import { slugify } from "@/lib/slugify";
import { triggerHaptic } from "@/lib/haptics";

const initialState: SignupResult = { ok: false };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialState);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form
      action={formAction}
      onSubmit={() => triggerHaptic()}
      className="flex w-full flex-col gap-3"
    >
      <input
        name="showName"
        autoFocus
        placeholder="Show name"
        onChange={(e) => {
          if (!slugTouched) setSlug(slugify(e.target.value));
        }}
        className="border-border bg-surface text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />

      <div className="border-border bg-surface focus-within:border-border-strong flex items-center overflow-hidden rounded-lg border">
        <span className="text-muted-2 pl-4 text-sm">castmark.app/</span>
        <input
          name="slug"
          value={slug}
          placeholder="my-podcast"
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="text-foreground placeholder:text-muted-2 w-full bg-transparent py-3 pr-4 text-sm outline-none"
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        autoComplete="email"
        className="border-border bg-surface text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="new-password"
        className="border-border bg-surface text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />

      {state.error && <p className="text-danger text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-accent text-accent-foreground w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Starting trial…" : "Start 14-day free trial"}
      </button>
    </form>
  );
}
