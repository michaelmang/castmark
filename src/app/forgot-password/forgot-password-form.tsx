"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "./actions";
import { triggerHaptic } from "@/lib/haptics";

export function ForgotPasswordForm() {
  const [message, formAction, isPending] = useActionState(
    requestPasswordReset,
    null,
  );

  if (message) {
    return <p className="text-muted text-center text-sm">{message}</p>;
  }

  return (
    <form
      action={formAction}
      onSubmit={() => triggerHaptic()}
      className="flex w-full flex-col gap-3"
    >
      <input
        type="email"
        name="email"
        autoFocus
        required
        placeholder="Email"
        autoComplete="email"
        className="border-border bg-surface text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-accent text-accent-foreground w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
