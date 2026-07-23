import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { SignOutButton } from "@/components/sign-out-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground text-sm font-semibold tracking-tight"
          >
            Castmark
          </Link>
          <NavLinks />
        </div>
        <SignOutButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
