"use server";

import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/account";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { getOrigin } from "@/lib/url";

export async function resumeCheckout() {
  const account = await getCurrentAccount();
  if (!STRIPE_PRICE_ID) redirect("/dashboard");

  const origin = await getOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: account.email,
    client_reference_id: account.id,
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { accountId: account.id },
    },
    metadata: { accountId: account.id },
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/billing?checkout=cancelled`,
  });

  redirect(session.url ?? "/billing");
}

export async function openBillingPortal() {
  const account = await getCurrentAccount();
  if (!account.stripeCustomerId) redirect("/billing");

  const origin = await getOrigin();
  const session = await stripe.billingPortal.sessions.create({
    customer: account.stripeCustomerId,
    return_url: `${origin}/billing`,
  });

  redirect(session.url);
}
