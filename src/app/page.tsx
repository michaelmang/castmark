"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="bg-accent/10 pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-foreground text-sm font-semibold tracking-tight">
          Castmark
        </span>
        <Link
          href="/login"
          onClick={() => triggerHaptic()}
          className="border-border text-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs transition-colors active:scale-95"
        >
          Sign in
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          One sponsor link.
          <br />
          Every episode, forever.
        </h1>
        <p className="text-muted mt-5 max-w-xl text-balance">
          Paste one durable link into your show notes. Change the destination
          whenever a sponsor updates — it changes everywhere, instantly, even in
          episodes from months ago.
        </p>
        <Link
          href="/login"
          onClick={() => triggerHaptic()}
          className="bg-accent text-accent-foreground mt-8 inline-flex items-center gap-1.5 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Sign in
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </main>

      <section className="relative z-10 mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-6 pb-20 sm:grid-cols-3">
        <FeatureCard
          title="One link, forever"
          body="Change the destination once. Every past and future episode updates instantly."
        />
        <FeatureCard
          title="Click analytics"
          body="Clicks by device, referrer, and time — per sponsor and per campaign."
        />
        <FeatureCard
          title="Episode attribution"
          body="Tag episodes to see which ones actually drive clicks for a sponsor."
        />
      </section>
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-border bg-surface rounded-2xl border p-5 text-left">
      <p className="text-foreground text-sm font-medium">{title}</p>
      <p className="text-muted mt-1.5 text-sm">{body}</p>
    </div>
  );
}
