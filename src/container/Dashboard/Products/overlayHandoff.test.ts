import assert from "node:assert/strict";
import { test } from "node:test";
import { OVERLAY_HANDOFF_MS, scheduleOverlayHandoff } from "./overlayHandoff";

test("scheduleOverlayHandoff waits before opening the next overlay", () => {
  const calls: number[] = [];
  const schedule = ((fn: () => void, delay: number) => {
    calls.push(delay);
    fn();
    return 1 as unknown as ReturnType<typeof setTimeout>;
  }) as typeof setTimeout;

  let opened = false;
  scheduleOverlayHandoff(() => {
    opened = true;
  }, schedule);

  assert.equal(opened, true);
  assert.deepEqual(calls, [OVERLAY_HANDOFF_MS]);
  assert.equal(OVERLAY_HANDOFF_MS >= 200, true);
});
