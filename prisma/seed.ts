import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const DEVICE_TYPES = ["desktop", "mobile", "mobile", "tablet"];
const REFERRERS = [
  "https://podcasts.apple.com/",
  "https://open.spotify.com/",
  null,
  null,
  "https://overcast.fm/",
];

function randomPastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await prisma.click.deleteMany();
  await prisma.linkEpisode.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.link.deleteMany();
  await prisma.sponsor.deleteMany();

  const acme = await prisma.sponsor.create({
    data: { name: "Acme Coffee", status: "active" },
  });
  const nimbus = await prisma.sponsor.create({
    data: { name: "Nimbus VPN", status: "active" },
  });
  const oldGear = await prisma.sponsor.create({
    data: { name: "Old Gear Co", status: "expired" },
  });

  const acmeLink = await prisma.link.create({
    data: {
      sponsorId: acme.id,
      slug: "acme",
      destinationUrl: "https://acmecoffee.example.com/?code=SHOW20",
      discountCode: "SHOW20",
    },
  });

  const nimbusLink = await prisma.link.create({
    data: {
      sponsorId: nimbus.id,
      slug: "nimbus",
      destinationUrl: "https://nimbusvpn.example.com/podcast",
      discountCode: "NIMBUS15",
    },
  });

  const oldGearLink = await prisma.link.create({
    data: {
      sponsorId: oldGear.id,
      slug: "oldgear",
      destinationUrl: "https://oldgear.example.com/",
    },
  });

  const ep42 = await prisma.episode.create({
    data: { title: "Ep. 42 — Brewing Better Mornings" },
  });
  const ep47 = await prisma.episode.create({
    data: { title: "Ep. 47 — The Home Roast Debate" },
  });
  const ep43 = await prisma.episode.create({
    data: { title: "Ep. 43 — Staying Private Online" },
  });

  const acmeEp42 = await prisma.linkEpisode.create({
    data: { linkId: acmeLink.id, episodeId: ep42.id, slug: "acme-ep42" },
  });
  const acmeEp47 = await prisma.linkEpisode.create({
    data: { linkId: acmeLink.id, episodeId: ep47.id, slug: "acme-ep47" },
  });
  const nimbusEp43 = await prisma.linkEpisode.create({
    data: { linkId: nimbusLink.id, episodeId: ep43.id, slug: "nimbus-ep43" },
  });

  const clickData = [];
  for (let i = 0; i < 260; i++) {
    const episode = pick([null, null, acmeEp42, acmeEp47]);
    clickData.push({
      linkId: acmeLink.id,
      episodeId: episode?.episodeId ?? null,
      timestamp: randomPastDate(45),
      referrer: pick(REFERRERS),
      deviceType: pick(DEVICE_TYPES),
      country: pick(["US", "US", "CA", "GB"]),
      userAgentRaw: "Mozilla/5.0 (seed data)",
    });
  }
  for (let i = 0; i < 140; i++) {
    const episode = pick([null, null, nimbusEp43]);
    clickData.push({
      linkId: nimbusLink.id,
      episodeId: episode?.episodeId ?? null,
      timestamp: randomPastDate(30),
      referrer: pick(REFERRERS),
      deviceType: pick(DEVICE_TYPES),
      country: pick(["US", "DE", "AU"]),
      userAgentRaw: "Mozilla/5.0 (seed data)",
    });
  }
  for (let i = 0; i < 35; i++) {
    clickData.push({
      linkId: oldGearLink.id,
      episodeId: null,
      timestamp: randomPastDate(90),
      referrer: pick(REFERRERS),
      deviceType: pick(DEVICE_TYPES),
      country: pick(["US"]),
      userAgentRaw: "Mozilla/5.0 (seed data)",
    });
  }

  await prisma.click.createMany({ data: clickData });

  console.log("Seeded 3 sponsors, 3 links, 3 episodes, and click history.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
