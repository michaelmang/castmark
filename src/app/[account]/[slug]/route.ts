import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDeviceType } from "@/lib/device";
import { parseCountry } from "@/lib/geo";
import { getLinkLifecycleStatus } from "@/lib/link-status";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ account: string; slug: string }> },
) {
  const { account: accountSlug, slug } = await params;

  const account = await prisma.account.findUnique({
    where: { slug: accountSlug },
  });

  if (!account) {
    return NextResponse.redirect(new URL("/expired", request.url), 302);
  }

  const directLink = await prisma.link.findUnique({
    where: { accountId_slug: { accountId: account.id, slug } },
    include: { sponsor: true },
  });

  let link = directLink;
  let episodeId: string | null = null;

  if (!link) {
    const linkEpisode = await prisma.linkEpisode.findUnique({
      where: { accountId_slug: { accountId: account.id, slug } },
      include: { link: { include: { sponsor: true } } },
    });
    if (linkEpisode) {
      link = linkEpisode.link;
      episodeId = linkEpisode.episodeId;
    }
  }

  if (!link) {
    return NextResponse.redirect(new URL("/expired", request.url), 302);
  }

  const isLive =
    getLinkLifecycleStatus({
      sponsorStatus: link.sponsor.status,
      startDate: link.startDate,
      endDate: link.endDate,
    }) === "active";

  await prisma.click.create({
    data: {
      accountId: account.id,
      linkId: link.id,
      episodeId,
      referrer: request.headers.get("referer"),
      deviceType: parseDeviceType(request.headers.get("user-agent")),
      country: parseCountry(request),
      userAgentRaw: request.headers.get("user-agent"),
    },
  });

  if (!isLive) {
    if (link.fallbackUrl) {
      return NextResponse.redirect(link.fallbackUrl, 302);
    }

    const fallbackUrl = new URL("/expired", request.url);
    fallbackUrl.searchParams.set("sponsor", link.sponsor.name);
    if (link.discountCode) {
      fallbackUrl.searchParams.set("code", link.discountCode);
    }
    return NextResponse.redirect(fallbackUrl, 302);
  }

  return NextResponse.redirect(link.destinationUrl, 302);
}
