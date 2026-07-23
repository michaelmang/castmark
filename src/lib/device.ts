export type DeviceType = "desktop" | "mobile" | "tablet" | "other";

export function parseDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "other";
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet(?!.*mobile)/.test(ua)) return "tablet";
  if (/mobi|iphone|android/.test(ua)) return "mobile";
  if (/windows|macintosh|linux|x11/.test(ua)) return "desktop";
  return "other";
}
