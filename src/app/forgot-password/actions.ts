"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { getOrigin } from "@/lib/url";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESET_RATE_LIMIT = 5; // requests
const RESET_RATE_WINDOW_MS = 60 * 60 * 1000; // per hour, per IP
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export async function requestPasswordReset(
  _prevState: string | null,
  formData: FormData,
): Promise<string> {
  const clientIp = getClientIp(await headers());
  if (isRateLimited(clientIp, RESET_RATE_LIMIT, RESET_RATE_WINDOW_MS)) {
    return "Too many requests from this network. Try again later.";
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const account = await prisma.account.findUnique({ where: { email } });
  // Always return the same message whether or not the account exists, so
  // this endpoint can't be used to enumerate registered emails.
  if (!account) return GENERIC_MESSAGE;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      accountId: account.id,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });

  const origin = await getOrigin();
  const resetUrl = `${origin}/reset-password/${rawToken}`;
  try {
    await sendPasswordResetEmail(account.email, resetUrl);
  } catch (err) {
    // Don't let email delivery failures leak account existence via a
    // different response than the "no such account" path.
    console.error("Failed to send password reset email:", err);
  }

  return GENERIC_MESSAGE;
}
