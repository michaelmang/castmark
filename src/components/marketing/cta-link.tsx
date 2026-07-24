"use client";

import Link from "next/link";
import { triggerHaptic } from "@/lib/haptics";

export function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={() => triggerHaptic()} className={className}>
      {children}
    </Link>
  );
}
