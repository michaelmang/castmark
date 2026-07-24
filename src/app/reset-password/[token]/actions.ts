"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

export async function resetPassword(
  token: string,
  _prevState: string | null,
  formData: FormData,
): Promise<string> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt.getTime() < Date.now()
  ) {
    return "This reset link is invalid or has expired.";
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.account.update({
      where: { id: resetToken.accountId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE,
    createSessionToken(resetToken.accountId),
    sessionCookieOptions,
  );
  redirect("/dashboard");
}
