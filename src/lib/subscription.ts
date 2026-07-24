import { STRIPE_PRICE_ID } from "@/lib/stripe";

type AccountSubscriptionFields = {
  subscriptionStatus: string | null;
  trialEndsAt: Date | null;
};

/** Whether the account currently has dashboard access. Stripe isn't treated
 * as required until STRIPE_PRICE_ID is configured, so local/demo accounts
 * seeded before billing was wired up (or in environments without Stripe set
 * up) aren't locked out. */
export function hasDashboardAccess(
  account: AccountSubscriptionFields,
): boolean {
  if (!STRIPE_PRICE_ID) return true;
  return (
    account.subscriptionStatus === "trialing" ||
    account.subscriptionStatus === "active"
  );
}

export function trialDaysRemaining(trialEndsAt: Date | null): number | null {
  if (!trialEndsAt) return null;
  const ms = trialEndsAt.getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
