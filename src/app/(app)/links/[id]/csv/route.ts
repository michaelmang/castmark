import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import { toCsv } from "@/lib/csv";
import { slugify } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const episodeId = request.nextUrl.searchParams.get("episodeId");
  const account = await getCurrentAccount();

  const link = await prisma.link.findFirst({
    where: { id, accountId: account.id },
  });
  if (!link) {
    return new NextResponse("Not found", { status: 404 });
  }

  const clicks = await prisma.click.findMany({
    where: {
      accountId: account.id,
      linkId: id,
      ...(episodeId ? { episodeId } : {}),
    },
    include: { episode: true },
    orderBy: { timestamp: "desc" },
  });

  const csv = toCsv(
    ["timestamp", "referrer", "device", "country", "episode"],
    clicks.map((c) => [
      c.timestamp.toISOString(),
      c.referrer ?? "",
      c.deviceType ?? "",
      c.country ?? "",
      c.episode?.title ?? "",
    ]),
  );

  let filenamePart = "clicks";
  if (episodeId) {
    const episode = await prisma.episode.findFirst({
      where: { id: episodeId, accountId: account.id },
    });
    filenamePart = episode ? slugify(episode.title) : "episode";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${link.slug}-${filenamePart}.csv"`,
    },
  });
}
