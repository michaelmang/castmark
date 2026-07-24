# Castmark Landing Page Spec

Goal: turn the current single-viewport hero into a full-length marketing page in the style
of the reference (clawteams.ai): long scroll, one idea per section, eyebrow labels, big
headlines with an accent-colored phrase, product screenshots as proof, FAQ, and a closing
CTA band. Keep the existing dark theme and token system — do not introduce a light theme.

Reference for the implementer: this is Next.js 16 — read the relevant guides in
`node_modules/next/dist/docs/` before writing code (per AGENTS.md).

---

## Audit of the current page (`src/app/page.tsx`)

What works, keep it:

- The core copy is strong. "One sponsor link. Every episode, forever." is a clear,
  differentiated value prop. The subhead explains the mechanism in one sentence.
- Dark theme with gold accent (`--accent: #e2b04f`) is distinctive; the token system in
  `globals.css` is clean and sufficient.
- Radial accent glow behind the hero is a good start.

Gaps versus a converting SaaS landing page:

1. **No product proof.** There is not a single screenshot. Visitors can't see the
   dashboard, the analytics, or what a "durable link" looks like. This is the single
   biggest fix.
2. **No narrative.** The page never states the pain (dead sponsor links in old show
   notes, re-editing episode descriptions, no per-episode attribution) before the
   solution.
3. **No "how it works."** A redirect-link product needs the 3-step mental model spelled
   out or people assume it's complicated.
4. **Feature cards are too thin.** Three one-liner cards carry the entire feature story;
   analytics, campaigns, episode attribution, lifecycle scheduling, and reports each
   deserve real treatment.
5. **No pricing section.** The CTA says "Start 14-day free trial" but the page never says
   what it costs after. That suppresses signups from serious buyers.
6. **No FAQ.** Obvious objections (what happens to my links if I cancel? do I need to
   edit old episodes? does it work with my host?) go unanswered.
7. **Weak header/footer.** Header has only "Sign in" — no primary CTA, no section nav.
   Footer has only Terms/Privacy.
8. **Weak metadata.** `layout.tsx` title is just "Castmark" and the description is
   internal-sounding ("Manage sponsor redirect links and click analytics.").
9. **Needless client component.** The whole page is `"use client"` only for
   `triggerHaptic()` on two links. The page should be a server component with tiny
   client islands (or drop haptics on the landing page entirely).
10. **No social proof** — but do NOT copy the reference's "12,000+ teams" stats with
    invented numbers. See §Social proof for honest alternatives.

---

## Page structure (top to bottom)

Shared section conventions (mirrors the reference):

- Each section gets an eyebrow label: accent color, uppercase, tracking-wide, `text-xs`
  (e.g. `ONE LINK, FOREVER`), then an `h2` at `text-3xl sm:text-4xl font-semibold
  tracking-tight`, with one phrase per headline colored `text-accent`.
- Section vertical rhythm: `py-24 sm:py-32`. Content max-widths: text `max-w-3xl`,
  visuals/grids `max-w-5xl`, centered.
- Screenshots sit in a "browser frame" card: `bg-surface`, `border-border`, `rounded-2xl`,
  a fake window-chrome bar (three dots + URL pill showing `castmark.pro/…`), subtle
  accent glow behind (reuse the existing blur div pattern, `bg-accent/10 blur-[120px]`).

### 1. Header (sticky)

- Sticky top, `backdrop-blur` + `bg-background/80`, bottom `border-border` appears on
  scroll.
- Left: Castmark wordmark. Center: anchor links — How it works, Features, Pricing, FAQ.
  Right: "Sign in" (ghost, current style) + "Start free trial" (accent button, links to
  `/signup`).
- Mobile: collapse anchors; keep logo + the two buttons.

### 2. Hero

- Optional announcement chip above the headline (pill, `border-border bg-surface`,
  accent dot) — only if there's something real to announce; otherwise omit.
- H1 (keep, but color the promise): "One sponsor link." on line one, "Every episode,
  **forever.**" with "forever." in `text-accent`. Scale up: `text-5xl sm:text-6xl`.
- Subhead: keep current copy verbatim — it's good.
- CTA row: primary "Start 14-day free trial" (accent) + secondary "See how it works"
  (ghost, smooth-scrolls to §4). Microcopy under buttons, `text-muted text-xs`:
  "14-day free trial · cancel anytime".
- Below CTAs: full-width dashboard screenshot in the browser frame, top-cropped so it
  bleeds into the next section (like the reference's chat mockup). This is the hero
  proof shot. Use `next/image` with `priority`.

### 3. Problem section

- Eyebrow: `THE OLD WAY`. Headline: "Sponsor links rot in your back catalog."
- Three short cards (reuse current `FeatureCard` style) naming the pains:
  1. **Dead links in old episodes** — the sponsor changed their URL and 40 episodes of
     show notes now 404.
  2. **Re-editing show notes forever** — every campaign change means touching every
     episode on every platform.
  3. **No idea what converted** — the sponsor asks which episodes drove clicks and you
     have nothing to show.
- Keep this section short; it exists to set up the next one.

### 4. How it works (anchor: `#how-it-works`)

- Eyebrow: `HOW IT WORKS`. Headline: "Set it once, forget it forever."
- Three numbered steps, side-by-side cards on desktop, each with a small visual:
  1. **Create a link per sponsor** — `castmark.pro/your-slug`. Visual: the link form or
     a styled URL pill with a copy button.
  2. **Paste it in your show notes** — same link in every episode, on every platform.
     Visual: a mock show-notes snippet with the link highlighted.
  3. **Swap the destination anytime** — every episode, past and future, points to the
     new URL instantly. Visual: before/after destination field.
- This is the section the reference nails with "From one sentence, to work you can
  ship as-is" — one concrete artifact per step.

### 5. Feature deep dives (anchor: `#features`)

Alternating two-column rows (text left / screenshot right, then flipped), one row per
feature. `max-w-5xl`, generous gap. Each row: eyebrow + h3 + 2–3 sentences + 3 checkmark
bullets + cropped screenshot in the browser frame. Rows:

1. **Click analytics** — eyebrow `KNOW WHAT WORKED`. Clicks over time, by device,
   referrer, and geography; per sponsor and per campaign. Screenshot: dashboard trend
   chart + stat cards.
2. **Episode attribution** — eyebrow `PROVE IT TO SPONSORS`. Tag episodes and see which
   ones actually drive clicks; leaderboards by brand, campaign, and episode. Screenshot:
   reports page leaderboard.
3. **Campaigns & lifecycle** — eyebrow `RUN REAL CAMPAIGNS`. Start/end dates, paused and
   expired states, and a branded fallback page (`/expired`) so a finished campaign never
   strands a listener on a 404. Screenshot: links board with status badges.

### 6. Accent band ("the promise" section)

- The reference uses an inverted dark band on a light page. Since the page is already
  near-black, invert the other way: a full-width band with `bg-surface-raised`,
  `border-y border-border`, and a stronger gold glow — or a gold-tinted gradient
  (`from-accent/15`) — so it reads as the emotional peak of the page.
- Headline: "Your back catalog becomes an asset, not a liability." Two short columns:
  "Old episodes keep earning" / "Sponsors keep renewing". One CTA button.

### 7. Social proof — honest version

Do not fabricate the reference's "12,000+ teams / 1.2M tasks" stats. Until there are
real customers and testimonials, use one of these (in order of preference):

1. Real numbers if any exist (clicks tracked, links served) — even small ones, framed
   concretely.
2. A founder note: short, first-person, why this was built (podcasters respect this).
3. Skip the section entirely. A fake-looking wall of logos is worse than nothing.

When real testimonials arrive, adopt the reference's layout: 3 stat cards + quote cards.
Leave a TODO comment slot in the layout for it.

### 8. Pricing (anchor: `#pricing`)

- Eyebrow: `PRICING`. Headline: "One plan. Every feature."
- Single centered plan card (`bg-surface`, `border-border`, accent border-top or badge):
  price pulled from whatever the Stripe price actually is (state it in the copy — do not
  ship "contact us"), "per month", bullet list of everything (unlimited links, analytics,
  campaigns, episode attribution, reports), CTA "Start 14-day free trial", microcopy
  "Cancel anytime during the trial and you won't be charged."
- One line below the card answering the scariest objection: what happens to existing
  redirect links if you cancel. Decide the real policy and state it plainly.

### 9. FAQ (anchor: `#faq`)

Native `<details>/<summary>` accordions styled to match cards (no JS needed). Questions
to answer (write real answers, not marketing evasions):

1. Do I have to edit my old episodes? (Only once — replace the sponsor URL with your
   Castmark link; after that, never again.)
2. What happens when a campaign ends? (Lifecycle states + the expired fallback page.)
3. What happens to my links if I cancel? (State the real policy — see §8.)
4. Does it work with my podcast host? (Yes — it's a plain URL; works anywhere a link
   works: show notes, YouTube descriptions, newsletters.)
5. How does the free trial work? (14 days, card details, when billing starts.)
6. Can sponsors see the analytics? (Answer honestly per current product: export/share
   via reports.)

### 10. Final CTA band

- Mirror of the hero, like the reference's closer: full-width band (`bg-surface-raised`
  or gold-gradient), headline "Your next episode deserves a link that never dies.",
  single accent CTA "Start 14-day free trial", trial microcopy.

### 11. Footer (expanded)

- Top row: wordmark + one-line tagline on the left; link columns on the right —
  Product (How it works, Features, Pricing, FAQ), Legal (Terms, Privacy), Account
  (Sign in, Sign up).
- Bottom row: © year Castmark (keep current dynamic year).

---

## Technical notes

- **Server component.** Remove `"use client"` from the page. Either drop `triggerHaptic`
  on the landing page or extract a tiny `CtaLink` client component so the rest stays
  server-rendered.
- **Screenshots.** No `public/` assets exist yet. Produce them by seeding the local DB
  (`npm run db:seed`) and capturing the dashboard, reports, and links board at ~2x on a
  dark background; store under `public/marketing/`. Serve via `next/image` (hero shot
  `priority`, everything below lazy). Keep total image weight reasonable (<500KB above
  the fold).
- **Anchors & scrolling.** `scroll-behavior: smooth` with a `prefers-reduced-motion`
  guard; `scroll-margin-top` on section anchors to account for the sticky header.
- **Metadata** (in `layout.tsx` or a page-level export):
  - Title: `Castmark — One sponsor link for every episode`
  - Description: outcome-focused, e.g. "Durable redirect links for podcast sponsors.
    Change the destination once and every episode updates instantly — with click
    analytics by sponsor, campaign, and episode."
  - OG image generation already exists (`opengraph-image.tsx`) — verify it reflects the
    new headline.
- **Accessibility.** One `h1`; sections use `h2`/`h3` in order. `text-muted` (#8a8a86 on
  #000) passes AA for normal text — but never use `--muted-2` (#57564f) for meaningful
  copy; it fails contrast. Visible focus rings on all CTAs (accent ring). FAQ via native
  `details` keeps keyboard support free.
- **Motion.** At most: a subtle fade/rise on section entry via CSS
  (`@media (prefers-reduced-motion: no-preference)`). No scroll-jacking, no parallax.
- **Performance target.** The page should stay static/prerendered — no data fetching.
  Lighthouse: LCP is the hero screenshot; preload it, and keep the glow effects as pure
  CSS (current blur-div approach is fine).

## Explicitly out of scope / do not do

- No invented stats, logos, or testimonials (§7).
- No light theme, no new accent colors — existing tokens only.
- No new dependencies for carousels/animation libraries; the whole page is achievable
  with Tailwind + native elements.
- No changes to app (dashboard) routes; this spec covers `/` plus metadata only.
