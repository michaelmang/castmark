import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { CtaLink } from "@/components/marketing/cta-link";
import { BrowserFrame } from "@/components/marketing/browser-frame";
import { FaqItem } from "@/components/marketing/faq-item";
import {
  AnalyticsMockup,
  CampaignsMockup,
  DashboardMockup,
  DestinationSwapMockup,
  LeaderboardMockup,
  ShowNotesMockup,
  UrlPill,
} from "@/components/marketing/mockups";

const NAV_ANCHORS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <SiteHeader />
      <Hero />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PromiseBand />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-foreground text-sm font-semibold tracking-tight"
        >
          Castmark
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_ANCHORS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted hover:text-foreground text-xs transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="border-border text-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs transition-colors active:scale-95"
          >
            Sign in
          </Link>
          <CtaLink
            href="/signup"
            className="bg-accent text-accent-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90 active:scale-95"
          >
            Start free trial
          </CtaLink>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="bg-accent/10 pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-20 pb-4 text-center sm:pt-28">
        <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          One sponsor link.
          <br />
          Every episode, <span className="text-accent">forever.</span>
        </h1>
        <p className="text-muted mt-5 max-w-xl text-balance sm:text-lg">
          Paste one durable link into your show notes. When a sponsor updates
          their destination, change it once in Castmark and it updates
          everywhere instantly, even in episodes from months ago.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <CtaLink
            href="/signup"
            className="bg-accent text-accent-foreground inline-flex items-center gap-1.5 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Start 14-day free trial
            <ArrowUpRight className="h-4 w-4" />
          </CtaLink>
          <a
            href="#how-it-works"
            className="border-border text-foreground hover:bg-surface inline-flex items-center gap-1.5 rounded-lg border px-5 py-3 text-sm font-medium transition-colors active:scale-[0.98]"
          >
            See how it works
          </a>
        </div>
        <p className="text-muted-2 mt-3 text-xs">
          14-day free trial · cancel anytime
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-14 pb-24 sm:pb-32">
        <BrowserFrame url="castmark.pro/dashboard">
          <DashboardMockup />
        </BrowserFrame>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
      <SectionHeading
        eyebrow="The old way"
        title="Sponsor links rot in your back catalog."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FeatureCard
          title="Dead links in old episodes"
          body="The sponsor changes their URL and forty episodes of show notes quietly 404."
        />
        <FeatureCard
          title="Re-editing show notes forever"
          body="Every campaign change means touching every episode, on every platform, again."
        />
        <FeatureCard
          title="No idea what converted"
          body="A sponsor asks which episodes drove clicks and you have nothing to show them."
        />
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-border scroll-mt-16 border-t px-6 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-5xl">
        <SectionHeading
          eyebrow="How it works"
          title="Set it once, forget it forever."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <HowItWorksStep
            number="1"
            title="Create a link per sponsor"
            body="One durable URL, such as castmark.pro/your-slug, that points to the sponsor's page."
          >
            <UrlPill slug="acme-coffee" />
          </HowItWorksStep>
          <HowItWorksStep
            number="2"
            title="Paste it in your show notes"
            body="Same link, every episode, on every platform. Write it once."
          >
            <ShowNotesMockup />
          </HowItWorksStep>
          <HowItWorksStep
            number="3"
            title="Swap the destination anytime"
            body="Every episode, past and future, points to the new URL instantly."
          >
            <DestinationSwapMockup />
          </HowItWorksStep>
        </div>
      </div>
    </section>
  );
}

function HowItWorksStep({
  number,
  title,
  body,
  children,
}: {
  number: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="border-accent/40 text-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
          {number}
        </span>
        <p className="text-foreground text-sm font-medium">{title}</p>
      </div>
      <p className="text-muted text-sm text-balance">{body}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-border scroll-mt-16 border-t px-6 py-20 sm:py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-24">
        <FeatureRow
          eyebrow="Know what worked"
          title="Click analytics, broken down the way you'd ask for it."
          body="Every click is logged with device, referrer, and timestamp, then rolled up per sponsor and per campaign so you can see what's actually moving."
          bullets={[
            "Clicks over time, by day",
            "Device and referrer breakdown",
            "Filterable by 7, 30, 90 days, or all time",
          ]}
        >
          <AnalyticsMockup />
        </FeatureRow>

        <FeatureRow
          eyebrow="Prove it to sponsors"
          title="Tag episodes, see what actually drove clicks."
          body="Attribute clicks to the exact episode they came from and hand sponsors a real leaderboard instead of a guess."
          bullets={[
            "Per-episode click attribution",
            "Leaderboards by brand, campaign, and episode",
            "Exportable reports for renewal conversations",
          ]}
          reverse
        >
          <LeaderboardMockup />
        </FeatureRow>

        <FeatureRow
          eyebrow="Run real campaigns"
          title="Start dates, end dates, and a fallback that never 404s."
          body="Schedule a campaign, pause it if a sponsor asks, and let it expire on its own. Listeners still land on a branded page instead of a dead link."
          bullets={[
            "Active, scheduled, paused, and expired states",
            "Per-link fallback URL for expired campaigns",
            "Discount codes shown even after a link expires",
          ]}
        >
          <CampaignsMockup />
        </FeatureRow>
      </div>
    </section>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  bullets,
  children,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16 ${
        reverse ? "sm:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div>
        <p className="text-accent text-xs font-medium tracking-wide uppercase">
          {eyebrow}
        </p>
        <h3 className="text-foreground mt-3 text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h3>
        <p className="text-muted mt-3 text-sm text-balance">{body}</p>
        <ul className="mt-5 flex flex-col gap-2">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-muted flex items-start gap-2 text-sm"
            >
              <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}

function PromiseBand() {
  return (
    <section className="border-border relative overflow-hidden border-t border-b">
      <div className="bg-accent/10 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <div className="bg-surface-raised/60 relative z-10 mx-auto w-full max-w-4xl px-6 py-20 text-center sm:py-28">
        <h2 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Your back catalog becomes an{" "}
          <span className="text-accent">asset</span>, not a liability.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 text-left sm:grid-cols-2">
          <div>
            <p className="text-foreground text-sm font-medium">
              Old episodes keep earning
            </p>
            <p className="text-muted mt-1.5 text-sm">
              A listener who finds episode 12 in 2027 still lands on a live
              offer instead of a dead link and a lost sponsor.
            </p>
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">
              Sponsors keep renewing
            </p>
            <p className="text-muted mt-1.5 text-sm">
              Show up to the renewal conversation with real per-episode click
              data instead of a vibe.
            </p>
          </div>
        </div>
        <CtaLink
          href="/signup"
          className="bg-accent text-accent-foreground mt-10 inline-flex items-center gap-1.5 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Start 14-day free trial
          <ArrowUpRight className="h-4 w-4" />
        </CtaLink>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="pricing"
      className="scroll-mt-16 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <SectionHeading eyebrow="Pricing" title="One plan. Every feature." />

        <div className="border-border bg-surface relative mt-10 rounded-2xl border p-8 text-left">
          <div className="bg-accent absolute top-0 left-8 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium">
            <span className="text-accent-foreground">14-day free trial</span>
          </div>
          <p className="text-foreground text-sm font-medium">Castmark</p>
          <p className="text-foreground mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-semibold tracking-tight">
              $19
            </span>
            <span className="text-muted text-sm">/ month</span>
          </p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {[
              "Unlimited sponsor links",
              "Unlimited episodes and campaigns",
              "Click analytics by device, referrer, and time",
              "Per-episode click attribution",
              "Brand, campaign, and episode reports",
              "Branded fallback page for expired links",
            ].map((item) => (
              <li
                key={item}
                className="text-muted flex items-start gap-2 text-sm"
              >
                <Check className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <CtaLink
            href="/signup"
            className="bg-accent text-accent-foreground mt-8 flex w-full items-center justify-center gap-1.5 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Start 14-day free trial
            <ArrowUpRight className="h-4 w-4" />
          </CtaLink>
          <p className="text-muted-2 mt-3 text-center text-xs">
            Cancel anytime during the trial and you won&apos;t be charged.
          </p>
        </div>

        <p className="text-muted mt-6 text-sm">
          If you cancel, your redirect links keep working. You just lose
          dashboard and analytics access until you resubscribe.
        </p>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs = [
    {
      question: "Do I have to edit my old episodes?",
      answer:
        "Only once. Replace the sponsor's raw URL with your Castmark link in each episode's show notes. After that, you never touch old episodes again; changing the destination in Castmark updates every episode instantly.",
    },
    {
      question: "What happens when a campaign ends?",
      answer:
        "A link can be active, scheduled, paused, or expired based on the dates and status you set. Once it's no longer live, visitors are sent to a per-link fallback URL if you set one, or to a branded Castmark page showing the sponsor name and last known discount code instead of a dead link.",
    },
    {
      question: "What happens to my links if I cancel?",
      answer:
        "Your redirect links keep resolving and logging clicks even if you cancel. They're the thing your listeners depend on, so they don't stop working. Cancelling only locks you out of the dashboard and reports until you resubscribe.",
    },
    {
      question: "Does it work with my podcast host?",
      answer:
        "Yes. A Castmark link is just a plain URL, so it works anywhere a link works: show notes on any host, YouTube descriptions, newsletters, social posts. There's nothing to install or connect.",
    },
    {
      question: "How does the free trial work?",
      answer:
        "You get 14 days of full access after signing up. You'll be asked for card details up front so the subscription can start automatically when the trial ends. Cancel any time before then and you won't be charged.",
    },
    {
      question: "Can sponsors see the analytics?",
      answer:
        "Sponsors don't get their own login today. Pull up the reports page and share the brand, campaign, or episode leaderboard with them directly, or export the numbers for a renewal conversation.",
    },
  ];

  return (
    <section
      id="faq"
      className="border-border scroll-mt-16 border-t px-6 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeading eyebrow="FAQ" title="A few common questions first." />
        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-border relative overflow-hidden border-t">
      <div className="bg-accent/10 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <div className="bg-surface-raised/60 relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <h2 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Your next episode deserves a link that{" "}
          <span className="text-accent">never dies.</span>
        </h2>
        <CtaLink
          href="/signup"
          className="bg-accent text-accent-foreground mt-8 inline-flex items-center gap-1.5 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Start 14-day free trial
          <ArrowUpRight className="h-4 w-4" />
        </CtaLink>
        <p className="text-muted-2 mt-3 text-xs">
          14-day free trial · cancel anytime
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-border border-t px-6 py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <span className="text-foreground text-sm font-semibold tracking-tight">
            Castmark
          </span>
          <p className="text-muted mt-2 text-sm">
            One durable sponsor link per show. Change the destination once
            and it updates everywhere, forever.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterColumn
            title="Product"
            links={[
              { href: "#how-it-works", label: "How it works" },
              { href: "#features", label: "Features" },
              { href: "#pricing", label: "Pricing" },
              { href: "#faq", label: "FAQ" },
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              { href: "/login", label: "Sign in" },
              { href: "/signup", label: "Sign up" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
            ]}
          />
        </div>
      </div>

      <div className="border-border mx-auto mt-10 w-full max-w-5xl border-t pt-6">
        <span className="text-muted-2 text-xs">
          &copy; {new Date().getFullYear()} Castmark
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-muted-2 text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      <div className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-muted hover:text-foreground text-sm transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-accent text-xs font-medium tracking-wide uppercase">
        {eyebrow}
      </p>
      <h2 className="text-foreground mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
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
