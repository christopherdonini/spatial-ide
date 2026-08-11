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
