// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { computeAuthoritativeViewportBbox } from "./viewportBbox";
import type { AuthoritativeBbox } from "./viewportBbox";
import type { ResidentBatch } from "./decodeBatch";

/**
 * Fit-to-bounds on open (Custodian walkthrough finding, `frontends/shell` cut 1: the 100k fixture
 * rendered nothing visible -- the prior camera placement anchored on a single vertex at a fixed
 * `zoom = 0`, which for a dataset spanning any real extent leaves the on-screen result
 * indistinguishable from empty, and never retried if the very first batch happened to carry no
 * geometry at all). This module computes an actual bounding box from resident geometry and a
 * zoom/target that fits it on screen, so "open a dataset" shows the data rather than one pixel of
 * it.
 */

/** The bbox of every ring vertex in one decoded batch, or `null` if the batch carries no geometry
 * (an empty batch, or every feature's geometry is null) -- distinguished from a degenerate
 * zero-area bbox (a single point) so a caller can tell "nothing here yet" from "one point here". */
export function extentOfBatch(batch: Pick<ResidentBatch, "rings">): AuthoritativeBbox | null {
  let xmin = Infinity;
  let ymin = Infinity;
  let xmax = -Infinity;
  let ymax = -Infinity;
  let sawAny = false;
  for (const featureRings of batch.rings) {
    for (const ring of featureRings) {
      for (const [x, y] of ring) {
        sawAny = true;
        if (x < xmin) xmin = x;
        if (x > xmax) xmax = x;
        if (y < ymin) ymin = y;
        if (y > ymax) ymax = y;
      }
    }
  }
  return sawAny ? { xmin, ymin, xmax, ymax } : null;
}

/** The smallest bbox containing both inputs. Either side may be `null` (nothing accumulated yet). */
export function unionBbox(
  a: AuthoritativeBbox | null,
  b: AuthoritativeBbox | null
): AuthoritativeBbox | null {
  if (!a) return b;
  if (!b) return a;
  return {
    xmin: Math.min(a.xmin, b.xmin),
    ymin: Math.min(a.ymin, b.ymin),
    xmax: Math.max(a.xmax, b.xmax),
    ymax: Math.max(a.ymax, b.ymax),
  };
}

/**
 * "Zoom to layer" target selection (`WorkingCanvas.tsx`'s own `fitAnchorRef` comment has the full
 * account). **Fits ONLY the dataset-lifetime anchor -- current residency plays no part.** Two
 * related findings, same day, drove this to its final shape:
 *
 * - 2026-08-14 walkthrough A7: residency alone goes `null` exactly when the viewport has been
 *   panned fully off-data, leaving the button with no target at the moment it is needed most --
 *   the original motivation for introducing the anchor at all, as a fallback.
 * - 2026-08-14 follow-up (operator, live re-check): a `resident ?? anchor` fallback -- preferring
 *   residency whenever it happened to be non-null -- made the button's own fit outcome depend on
 *   scroll history and in-flight refill timing. A second click during the refill window `fitToBounds`'s
 *   own emitted `viewport_query` triggers (`WorkingCanvas.tsx`'s `fitToExtent`,
 *   `notifyViewport: true`) could see a different -- possibly empty, possibly partial -- residency
 *   than the first click did, producing a visibly different fit each time. That read as "random" to
 *   an operator clicking a button whose whole point is "take me to the layer," the same place, every
 *   time. **Per-click determinism is the actual requirement**, not "prefer whatever happens to be on
 *   screen right now."
 *
 * Fitting the anchor unconditionally is safe because it is provably a superset of whatever residency
 * ever was: every batch's extent is unioned into both `residentExtentRef` and this anchor at push
 * time, and the anchor is never shrunk (`WorkingCanvas.tsx`'s `pushBatch`/`fitAnchorRef` comments).
 * Once the initial load has delivered anything, the anchor IS the layer's known extent -- fitting it
 * every time reproduces the same A4-style fit deterministically, independent of whatever is resident
 * (or mid-refill) at click time. Residency was dropped from this function's signature entirely
 * (rather than kept as a now-always-shadowed fallback parameter) -- nothing else in this module calls
 * it with a residency argument, and a parameter that can never actually change the return value is
 * worse than no parameter. `null` only when nothing has ever been admitted -- nothing to fit to yet.
 * A free function, not inlined into `fitToBounds`, because `fitToBounds` itself needs a live
 * `Deck`/canvas to be reachable at all, and this is the one piece of its decision pure enough to
 * unit-test without one.
 */
export function chooseFitTarget(anchor: AuthoritativeBbox | null): AuthoritativeBbox | null {
  return anchor;
}

export interface FitViewState {
  /** Local-frame target -- always `[0, 0]` by this function's own contract: the caller recenters
   * the offset frame's origin to the bbox's centre first, which is what makes the centre `(0, 0)`
   * in local coordinates (`offsetFrame.ts`'s `toLocal`). Returned anyway rather than assumed, so a
   * caller reads intent from the return value instead of a convention it has to remember. */
  target: [number, number];
  zoom: number;
  /** The authoritative-CRS point the frame origin must be recentred to for `target` to be correct. */
  centerX: number;
  centerY: number;
}

/** Smallest zoom step considered: below it deck.gl's own `OrthographicView` zoom no longer changes
 * the rendered scale in any way an operator could perceive, and an unbounded negative zoom is a
 * discovered, not declared, floor -- ADR-010 rule 6. */
const MIN_ZOOM = -20;
/** A sanity ceiling, not a design target: it only guards a near-zero (but nonzero) span from
 * producing an absurd zoom, and is far past any scale a real fit is expected to reach. */
const MAX_ZOOM = 21;
/** The scale a degenerate (zero-span: one point, or every vertex coincident) extent falls back to
 * -- the same fixed `zoom = 0` the single-point anchor this function replaces used, so a batch of
 * duplicate points is no worse off than before. */
const DEGENERATE_FALLBACK_ZOOM = 0;

/**
 * The zoom and local target that fit `bbox` inside a `widthPx` x `heightPx` viewport, with a
 * fractional margin so features at the very edge are not clipped against the canvas edge.
 *
 * A zero-area bbox (every vertex coincident -- one point, or a batch of duplicate points) has
 * nothing to compute a scale from; it falls back to `MAX_ZOOM`, the same scale the single-point
 * anchor this replaces used, rather than an infinite or NaN zoom.
 */
export function fitViewStateForBbox(
  bbox: AuthoritativeBbox,
  widthPx: number,
  heightPx: number,
  marginFraction = 0.1
): FitViewState {
  const centerX = (bbox.xmin + bbox.xmax) / 2;
  const centerY = (bbox.ymin + bbox.ymax) / 2;
  const spanX = bbox.xmax - bbox.xmin;
  const spanY = bbox.ymax - bbox.ymin;
  const usableWidthPx = widthPx * (1 - 2 * marginFraction);
  const usableHeightPx = heightPx * (1 - 2 * marginFraction);

  let zoom = DEGENERATE_FALLBACK_ZOOM;
  if (spanX > 0 || spanY > 0) {
    // pixelsPerMetre such that both spans fit: the tighter (smaller) of the two axis-wise fits.
    const pixelsPerMetreX = spanX > 0 ? usableWidthPx / spanX : Infinity;
    const pixelsPerMetreY = spanY > 0 ? usableHeightPx / spanY : Infinity;
    const pixelsPerMetre = Math.min(pixelsPerMetreX, pixelsPerMetreY);
    zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.log2(pixelsPerMetre)));
  }

  return { target: [0, 0], zoom, centerX, centerY };
}

/**
 * The authoritative-CRS viewport bbox a `fit` will actually show once applied to a frame whose
 * origin has already been recentred to `fit`'s own `centerX`/`centerY` (`OffsetFrame.forceRecenter`
 * -- the caller's job, not this function's). Second half of the 2026-08-14 walkthrough A7 fix
 * (coordinator-authorized completion): `WorkingCanvas.fitToBounds` needs this to drive a fresh
 * `viewport_query` for wherever the camera just jumped to, exactly the same computation
 * `onViewStateChange` already uses for every interactive pan/zoom
 * (`viewportBbox.ts`'s`computeAuthoritativeViewportBbox`) -- reused here directly, not
 * reimplemented, so the two paths can never silently diverge.
 *
 * `fit.target` is always `[0, 0]` by `fitViewStateForBbox`'s own contract (its own doc comment),
 * so together with the post-recenter frame origin this reconstructs exactly the box the camera now
 * shows -- margin included, the same margin `fitViewStateForBbox` applied, not the raw dataset bbox
 * that was fit to (which is usually strictly smaller).
 */
export function bboxForFit(
  fit: FitViewState,
  frameOriginX: number,
  frameOriginY: number,
  widthPx: number,
  heightPx: number
): AuthoritativeBbox {
  return computeAuthoritativeViewportBbox({
    targetX: fit.target[0],
    targetY: fit.target[1],
    zoom: fit.zoom,
    widthPx,
    heightPx,
    originX: frameOriginX,
    originY: frameOriginY,
  });
}
