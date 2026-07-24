import Link from "next/link";
import { getCurrentAccount } from "@/lib/account";
import { trialDaysRemaining } from "@/lib/subscription";
import { resumeCheckout, openBillingPortal } from "./actions";
import { SignOutButton } from "@/components/sign-out-button";

const STATUS_LABELS: Record<string, string> = {
  trialing: "Trial",
  active: "Active",
  past_due: "Payment overdue",
  canceled: "Canceled",
  incomplete: "Incomplete",
  unpaid: "Unpaid",
};

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const account = await getCurrentAccount();
  const hasSubscription = Boolean(account.stripeCustomerId);
  const daysLeft =
    account.subscriptionStatus === "trialing"
      ? trialDaysRemaining(account.trialEndsAt)
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-foreground text-sm font-semibold tracking-tight"
          >
            Castmark
          </Link>
        </div>

        <div className="border-border bg-surface rounded-2xl border p-6">
          <p className="text-muted text-xs font-medium">Billing</p>

          {hasSubscription ? (
            <>
              <p className="text-foreground mt-2 text-lg font-semibold">
                {STATUS_LABELS[account.subscriptionStatus ?? ""] ??
                  "No active plan"}
              </p>
              {daysLeft !== null && (
                <p className="text-muted mt-1 text-sm">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"} left in your
                  trial
                </p>
              )}
              <form action={openBillingPortal} className="mt-5">
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Manage billing
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-foreground mt-2 text-lg font-semibold">
                No active plan
              </p>
              <p className="text-muted mt-1 text-sm">
                Start your 14-day free trial to use the dashboard.
              </p>
              <form action={resumeCheckout} className="mt-5">
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground w-full rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  Start free trial
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
