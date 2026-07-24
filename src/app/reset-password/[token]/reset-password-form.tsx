"use client";

import { useActionState } from "react";
import { resetPassword } from "./actions";
import { triggerHaptic } from "@/lib/haptics";

export function ResetPasswordForm({ token }: { token: string }) {
  const boundAction = resetPassword.bind(null, token);
  const [error, formAction, isPending] = useActionState(boundAction, null);

  return (
    <form
      action={formAction}
      onSubmit={() => triggerHaptic()}
      className="flex w-full flex-col gap-3"
    >
      <input
        type="password"
        name="password"
        autoFocus
        required
        minLength={8}
        placeholder="New password"
        autoComplete="new-password"
        className="border-border bg-surface text-foreground placeholder:text-muted-2 focus:border-border-strong w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      {error && <p className="text-danger text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-accent text-accent-foreground w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}
