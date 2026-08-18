// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * NEXT-CUT.md I9 ("closed console = ZERO DOM work; recorder updates coalesced via the existing
 * `canvas/coalesceOncePerFrame.ts` pattern"): the ONE place a collapsed `ConsolePanel` reacts to
 * new recorder activity. Factored out of `ConsolePanel.tsx` specifically so I9 is assertable
 * without a DOM -- `onCount` below is typed to receive only a `ConsoleCountSnapshot` (two numbers),
 * never a `ConsoleEntry`, so there is structurally no way for a caller wired through this module to
 * read, format, or render an individual entry while collapsed; a test can prove the ONLY thing a
 * burst of recorder notifications ever produces here is (at most) one `onCount` call per frame.
 */

import { coalesceOncePerFrame } from "../canvas/coalesceOncePerFrame";
import type { ConsoleEntry } from "./recorder";

/** The subset of `ConsoleRecorder`'s API this module needs -- kept narrow and structural so a test
 * can hand it a small fake instead of a real `ConsoleRecorder` instance. */
export interface CountableRecorder {
  entries(): readonly ConsoleEntry[];
  droppedCount(): number;
  subscribe(listener: () => void): () => void;
}

export interface ConsoleCountSnapshot {
  count: number;
  dropped: number;
}

/**
 * Subscribes to `recorder`, calling `onCount` with the current count/dropped-count -- coalesced to
 * at most once per animation frame via `coalesceOncePerFrame` (reused, not reimplemented, per
 * NEXT-CUT.md I9's own wording). Fires once immediately on attach, so a drawer that is already
 * collapsed when this is called shows the CURRENT count right away rather than waiting for the next
 * recorder activity. Returns a detach function that unsubscribes and cancels any still-pending
 * coalesced frame.
 *
 * `requestFrame`/`cancelFrame` are the same injectable pair `coalesceOncePerFrame` itself exposes,
 * threaded through unchanged so a test can drive this with a small, fully controlled fake instead
 * of depending on jsdom's own `requestAnimationFrame`.
 */
export function attachCollapsedCountSync(
  recorder: CountableRecorder,
  onCount: (snapshot: ConsoleCountSnapshot) => void,
  requestFrame?: (cb: FrameRequestCallback) => number,
  cancelFrame?: (handle: number) => void
): () => void {
  const snapshot = (): ConsoleCountSnapshot => ({
    count: recorder.entries().length,
    dropped: recorder.droppedCount(),
  });
  const coalesced = coalesceOncePerFrame(() => onCount(snapshot()), requestFrame, cancelFrame);

  onCount(snapshot());
  const unsubscribe = recorder.subscribe(() => coalesced.schedule());

  return () => {
    unsubscribe();
    coalesced.cancel();
  };
}
