"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
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

  // TODO(stripe): kick off a Checkout Session here once the Price ID is wired
  // up, instead of granting dashboard access directly.
  redirect("/dashboard");
}
