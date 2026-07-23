/** Fires a short vibration on devices that support the Vibration API
 * (Android Chrome/Firefox touch devices). No-op everywhere else, including
 * iOS Safari and all desktop browsers, which don't implement navigator.vibrate. */
export function triggerHaptic(pattern: number | number[] = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
