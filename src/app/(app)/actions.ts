"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/account";
import {
  generateUniqueEpisodeSlug,
  isCampaignSlugAvailable,
  slugify,
} from "@/lib/slug";

export type ActionResult = { ok: boolean; error?: string };

function parseOptionalDate(value: FormDataEntryValue | null): Date | null {
  if (!value || typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function saveLink(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const account = await getCurrentAccount();

  const linkId = String(formData.get("linkId") ?? "").trim();
  const sponsorMode = String(formData.get("sponsorMode") ?? "existing");
  const sponsorStatus = String(formData.get("sponsorStatus") ?? "active");
  const slug = slugify(String(formData.get("slug") ?? ""));
  const destinationUrl = String(formData.get("destinationUrl") ?? "").trim();
  const discountCode =
    String(formData.get("discountCode") ?? "").trim() || null;
  const startDate = parseOptionalDate(formData.get("startDate"));
  const endDate = parseOptionalDate(formData.get("endDate"));
  const fallbackUrl = String(formData.get("fallbackUrl") ?? "").trim() || null;

  if (!slug) return { ok: false, error: "Slug is required" };
  if (!destinationUrl)
    return { ok: false, error: "Destination URL is required" };

  // Only re-check slug availability if it changed (or on create); an update
  // that keeps the same slug would otherwise collide with itself.
  if (!linkId || slug !== (await currentSlugFor(linkId, account.id))) {
    if (!(await isCampaignSlugAvailable(account.id, slug))) {
      return { ok: false, error: `"${slug}" is already in use` };
    }
  }

  try {
    let sponsorId: string;

    if (sponsorMode === "new") {
      const sponsorName = String(formData.get("sponsorName") ?? "").trim();
      if (!sponsorName) return { ok: false, error: "Sponsor name is required" };
      const sponsor = await prisma.sponsor.create({
        data: {
          accountId: account.id,
          name: sponsorName,
          status: sponsorStatus,
        },
      });
      sponsorId = sponsor.id;
    } else {
      sponsorId = String(formData.get("sponsorId") ?? "");
      if (!sponsorId) return { ok: false, error: "Choose a sponsor" };
      const updated = await prisma.sponsor.updateMany({
        where: { id: sponsorId, accountId: account.id },
        data: { status: sponsorStatus },
      });
      if (updated.count === 0) {
        return { ok: false, error: "Sponsor not found" };
      }
    }

    const data = {
      accountId: account.id,
      sponsorId,
      slug,
      destinationUrl,
      discountCode,
      startDate,
      endDate,
      fallbackUrl,
    };

    if (linkId) {
      const updated = await prisma.link.updateMany({
        where: { id: linkId, accountId: account.id },
        data,
      });
      if (updated.count === 0) return { ok: false, error: "Link not found" };
    } else {
      await prisma.link.create({ data });
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return { ok: false, error: "That slug is already in use" };
    }
    return { ok: false, error: "Something went wrong. Try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/links/${linkId}`);
  return { ok: true };
}

async function currentSlugFor(
  linkId: string,
  accountId: string,
): Promise<string | null> {
  const link = await prisma.link.findFirst({
    where: { id: linkId, accountId },
    select: { slug: true },
  });
  return link?.slug ?? null;
}

export async function deleteLink(linkId: string) {
  const account = await getCurrentAccount();
  await prisma.link.deleteMany({
    where: { id: linkId, accountId: account.id },
  });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addEpisodeTag(linkId: string, title: string) {
  const account = await getCurrentAccount();
  const trimmed = title.trim();
  if (!trimmed) return;

  const link = await prisma.link.findFirst({
    where: { id: linkId, accountId: account.id },
  });
  if (!link) return;

  const existing = await prisma.linkEpisode.findFirst({
    where: { linkId, episode: { title: trimmed, accountId: account.id } },
  });
  if (existing) return;

  const episode =
    (await prisma.episode.findFirst({
      where: { accountId: account.id, title: trimmed },
    })) ??
    (await prisma.episode.create({
      data: { accountId: account.id, title: trimmed },
    }));

  const slug = await generateUniqueEpisodeSlug(account.id, link.slug, trimmed);

  await prisma.linkEpisode.create({
    data: { accountId: account.id, linkId, episodeId: episode.id, slug },
  });

  revalidatePath(`/links/${linkId}`);
}

export async function removeEpisodeTag(linkId: string, episodeId: string) {
  const account = await getCurrentAccount();
  await prisma.linkEpisode.deleteMany({
    where: { linkId, episodeId, accountId: account.id },
  });
  revalidatePath(`/links/${linkId}`);
}
