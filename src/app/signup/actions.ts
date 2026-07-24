"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";
import { getOrigin } from "@/lib/url";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import { slugify, isAccountSlugTaken } from "@/lib/slug";

export type SignupResult = { ok: boolean; error?: string };

export async function signup(
  _prev: SignupResult,
  formData: FormData,
): Promise<SignupResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const showName = String(formData.get("showName") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email" };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters" };
  }
  if (!showName) return { ok: false, error: "Show name is required" };
  if (!slug) return { ok: false, error: "Choose a URL for your show" };

  if (await isAccountSlugTaken(slug)) {
    return { ok: false, error: `"${slug}" is already taken` };
  }

  const existingEmail = await prisma.account.findUnique({ where: { email } });
  if (existingEmail) {
    return { ok: false, error: "An account with that email already exists" };
  }

  const passwordHash = await hashPassword(password);

  let account;
  try {
    account = await prisma.account.create({
      data: { email, passwordHash, showName, slug },
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return { ok: false, error: "That email or URL is already taken" };
    }
    return { ok: false, error: "Something went wrong. Try again." };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    createSessionToken(account.id),
    sessionCookieOptions,
  );

  if (!STRIPE_PRICE_ID) {
    // Stripe not configured yet — fall back to direct dashboard access.
    redirect("/dashboard");
  }

  const origin = await getOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
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

  if (!session.url) {
    redirect("/dashboard");
  }

  redirect(session.url);
}
