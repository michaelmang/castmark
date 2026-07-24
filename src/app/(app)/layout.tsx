import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "@/lib/account";
import { hasDashboardAccess, trialDaysRemaining } from "@/lib/subscription";
import { NavLinks } from "@/components/nav-links";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getCurrentAccount();
  if (!hasDashboardAccess(account)) redirect("/billing");

  const daysLeft =
    account.subscriptionStatus === "trialing"
      ? trialDaysRemaining(account.trialEndsAt)
      : null;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-foreground text-sm font-semibold tracking-tight"
          >
            Castmark
          </Link>
          <span className="text-muted-2 text-xs">{account.showName}</span>
          <NavLinks />
        </div>
        <div className="flex items-center gap-4">
          {daysLeft !== null && (
            <Link
              href="/billing"
              className="text-muted hover:text-foreground text-xs transition-colors"
            >
              Trial: {daysLeft} {daysLeft === 1 ? "day" : "days"} left
            </Link>
          )}
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
