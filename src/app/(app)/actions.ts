"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RESERVED_SLUGS, generateUniqueEpisodeSlug, slugify } from "@/lib/slug";

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
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, error: `"${slug}" is reserved, pick another slug` };
  }
  if (!destinationUrl)
    return { ok: false, error: "Destination URL is required" };

  try {
    let sponsorId: string;

    if (sponsorMode === "new") {
      const sponsorName = String(formData.get("sponsorName") ?? "").trim();
      if (!sponsorName) return { ok: false, error: "Sponsor name is required" };
      const sponsor = await prisma.sponsor.create({
        data: { name: sponsorName, status: sponsorStatus },
      });
      sponsorId = sponsor.id;
    } else {
      sponsorId = String(formData.get("sponsorId") ?? "");
      if (!sponsorId) return { ok: false, error: "Choose a sponsor" };
      await prisma.sponsor.update({
        where: { id: sponsorId },
        data: { status: sponsorStatus },
      });
    }

    const data = {
      sponsorId,
      slug,
      destinationUrl,
      discountCode,
      startDate,
      endDate,
      fallbackUrl,
    };

    if (linkId) {
      await prisma.link.update({ where: { id: linkId }, data });
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

export async function deleteLink(linkId: string) {
  await prisma.link.delete({ where: { id: linkId } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addEpisodeTag(linkId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const link = await prisma.link.findUnique({ where: { id: linkId } });
  if (!link) return;

  const existing = await prisma.linkEpisode.findFirst({
    where: { linkId, episode: { title: trimmed } },
  });
  if (existing) return;

  const episode =
    (await prisma.episode.findFirst({ where: { title: trimmed } })) ??
    (await prisma.episode.create({ data: { title: trimmed } }));

  const slug = await generateUniqueEpisodeSlug(link.slug, trimmed);

  await prisma.linkEpisode.create({
    data: { linkId, episodeId: episode.id, slug },
  });

  revalidatePath(`/links/${linkId}`);
}

export async function removeEpisodeTag(linkId: string, episodeId: string) {
  await prisma.linkEpisode.delete({
    where: { linkId_episodeId: { linkId, episodeId } },
  });
  revalidatePath(`/links/${linkId}`);
}
