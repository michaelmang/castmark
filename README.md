# Castmark

A podcast sponsor link manager: one durable redirect link per sponsor goes into
every episode's show notes, forever. Change the destination once and it
updates everywhere — past and future episodes — instantly, with click
analytics broken down by sponsor, campaign, and episode.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4
- Prisma 7 + Postgres (Neon)
- Single-user password auth (cookie session)

## Local development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, DASHBOARD_PASSWORD
npx prisma migrate dev
npm run db:seed         # optional sample data
npm run dev
```

## Key routes

- `/` — dashboard (sponsors, campaigns, click totals)
- `/reports` — brand/campaign/episode leaderboards
- `/{slug}` — the actual redirect + click-logging endpoint
- `/expired` — fallback page for paused/expired/unknown links
