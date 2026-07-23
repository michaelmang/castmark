"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";
import { triggerHaptic } from "@/lib/haptics";

export function SignOutButton() {
  return (
    <form action={logout} onSubmit={() => triggerHaptic()}>
      <button
        type="submit"
        className="text-muted hover:text-foreground flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors active:scale-95"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </form>
  );
}
