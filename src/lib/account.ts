import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/** Resolves the logged-in account from the session cookie, redirecting to
 * /login if there's no valid session or the account no longer exists.
 * Memoized per-request so parallel Suspense islands share one DB lookup. */
export const getCurrentAccount = cache(async function getCurrentAccount() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/login");

  const account = await prisma.account.findUnique({
    where: { id: session.accountId },
  });
  if (!account) redirect("/api/session/clear");

  return account;
});
