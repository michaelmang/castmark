import Link from "next/link";
import { getCurrentAccount } from "@/lib/account";
import { NavLinks } from "@/components/nav-links";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getCurrentAccount();

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
        <SignOutButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
