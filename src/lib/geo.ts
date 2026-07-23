import type { NextRequest } from "next/server";

/** Coarse, IP-derived country code. Relies on the edge network's geo header
 * (e.g. Vercel's `x-vercel-ip-country`) — no IP address is ever stored. */
export function parseCountry(request: NextRequest): string | null {
  return request.headers.get("x-vercel-ip-country") ?? null;
}
