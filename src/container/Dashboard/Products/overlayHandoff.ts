export const OVERLAY_HANDOFF_MS = 250;

export function scheduleOverlayHandoff(
  openNext: () => void,
  schedule: typeof setTimeout = setTimeout,
  delayMs = OVERLAY_HANDOFF_MS,
): ReturnType<typeof setTimeout> {
  return schedule(openNext, delayMs);
}
