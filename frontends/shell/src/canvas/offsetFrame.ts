/**
 * Offset-relative rendering frame — ADR-010 rule 3: `f32(coord − origin)`, never
 * `f32(coord) − f32(origin)` and never `f32(coord)` at all for absolute projected magnitudes.
 *
 * **Ported from the concluded ADR-003 spike**
 * (`spikes/adr-003-crs-rendering/app/src/offset-frame.ts`), not reinvented: the spike's M2
 * measured this exact formula and clamp at 0.0358 px (zero drift) / 0.0446 px (max permitted
 * drift) against a 0.5 px budget at 1:500, and changing the derivation would forfeit the
 * inheritance of those numbers (architect review, `frontends/shell` cut 1, D3.2). The only change
 * from the spike is generalizing the naming away from EPSG:2056 specifically — the math is CRS-
 * agnostic and always was.
 *
 * **`offsetPositions`/`toF32Positions` are not on this cut's actual render path** (S7, reviewer):
 * `buildLayers.ts` calls `toLocal` once per vertex instead, because `SolidPolygonLayer` here takes
 * nested `[x,y][][]` rings, not one flat typed buffer a vectorized offset could fill. They stay —
 * tested, ported unmodified from the spike — as the batch-offset form a future flat-buffer layer
 * would call; deleting spike-verified numeric code to satisfy an unused-code sweep would be the
 * wrong trade against re-deriving and re-verifying the same formula later.
 */

/** An authoritative project-CRS coordinate (ADR-010 rule 1) — f64, the only form that may be
 * persisted, returned from a pick, or handed across a module boundary. */
export type AuthoritativeM = number;

/**
 * An offset from the current frame origin. **Renderer-internal and meaningless without the origin
 * that produced it** — never persist it, never return it from picking, never let it cross a
 * boundary untagged (ADR-010 rule 1: a frame is a type too). Aliased for documentation rather than
 * branded: real nominal branding would force casts through every arithmetic expression here.
 */
export type LocalFrameM = number;

export const RECENTER_BUDGET_PX = 0.5;
export const RECENTER_MAX_DRIFT_M = 131_072;

/**
 * Largest drift permitted before re-centering, derived from the precision budget rather than
 * picked. f32 carries a 24-bit significand, so a value of magnitude D lands within `D * 2^-24` of
 * the truth; on screen that is `D * 2^-24 * pixelsPerMetre`. Solving for a declared pixel budget
 * gives the largest D still inside it.
 *
 * A *fixed metric* threshold has exactly the wrong shape: zoomed in, metres-per-pixel is small and
 * even a modest drift costs real pixels; zoomed out, the view centre moves kilometres per gesture
 * at a scale where f32 error is invisible. `maxM` is a sanity ceiling, not a precision limit.
 */
export function recenterThresholdForBudget(
  pixelsPerMetre: number,
  budgetPx: number = RECENTER_BUDGET_PX,
  maxM: number = RECENTER_MAX_DRIFT_M
): number {
  const f32RelativePrecision = Math.pow(2, -24);
  return Math.min(maxM, budgetPx / (f32RelativePrecision * pixelsPerMetre));
}

/**
 * Absolute f64 authoritative coordinates → interleaved f32 offsets from `(originX, originY)`.
 *
 * The subtraction runs in f64 (JS numbers are f64); only the store into the `Float32Array`
 * narrows. That order is the whole point — narrowing first and subtracting second throws the
 * precision away before the subtraction can preserve it.
 */
export function offsetPositions(
  x: Float64Array,
  y: Float64Array,
  originX: AuthoritativeM,
  originY: AuthoritativeM
): Float32Array {
  const out = new Float32Array(x.length * 2);
  for (let i = 0; i < x.length; i++) {
    out[i * 2] = x[i] - originX;
    out[i * 2 + 1] = y[i] - originY;
  }
  return out;
}

export interface RecenterEvent {
  index: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  driftM: number;
}

export class OffsetFrame {
  private x = 0;
  private y = 0;
  private initialized = false;
  private recenters = 0;
  /** Every origin change, recorded. The origin is a transform, and `docs/01` principle 8 says a
   * transform the user cannot see is not acceptable — re-centering is an observable event. */
  readonly events: RecenterEvent[] = [];
  private threshold: number;

  constructor(thresholdM: number) {
    this.threshold = thresholdM;
  }

  get originX(): number {
    return this.x;
  }
  get originY(): number {
    return this.y;
  }
  get thresholdM(): number {
    return this.threshold;
  }
  /** How many times the origin has moved — including the initial placement. */
  get recenterCount(): number {
    return this.recenters;
  }

  /**
   * Updates the drift threshold — a real interactive canvas zooms constantly, and
   * `recenterThresholdForBudget`'s whole premise is that a fixed *metric* threshold has the wrong
   * shape across zoom levels (offsetFrame.ts's own doc comment). The caller recomputes this from
   * the current pixels-per-metre on every view-state change; this only stores the result.
   */
  setThreshold(thresholdM: number): void {
    this.threshold = thresholdM;
  }

  /**
   * Moves the origin to `(viewX, viewY)` if the view has drifted past the threshold (or if this is
   * the first call). Returns true when the origin moved, meaning every f32 buffer derived from it
   * is now stale and must be rebuilt via {@link offsetPositions}.
   */
  maybeRecenter(viewX: AuthoritativeM, viewY: AuthoritativeM): boolean {
    const drift = this.initialized ? Math.hypot(viewX - this.x, viewY - this.y) : Infinity;
    if (drift <= this.threshold) {
      return false;
    }
    this.recenterTo(viewX, viewY, drift);
    return true;
  }

  /**
   * Unconditionally moves the origin to `(viewX, viewY)`, bypassing the drift threshold --
   * `maybeRecenter`'s gate exists to bound *incidental* drift from ordinary panning, and does not
   * apply to an explicit, user- or caller-triggered re-fit (`WorkingCanvas`'s open-time
   * fit-to-bounds and its "zoom to layer" affordance), which must always land exactly on the
   * requested point regardless of how close the current origin already is.
   */
  forceRecenter(viewX: AuthoritativeM, viewY: AuthoritativeM): void {
    const drift = this.initialized ? Math.hypot(viewX - this.x, viewY - this.y) : Infinity;
    this.recenterTo(viewX, viewY, drift);
  }

  private recenterTo(viewX: AuthoritativeM, viewY: AuthoritativeM, driftM: number): void {
    this.events.push({ index: this.recenters, fromX: this.x, fromY: this.y, toX: viewX, toY: viewY, driftM });
    this.x = viewX;
    this.y = viewY;
    this.initialized = true;
    this.recenters++;
  }

  /** Absolute f64 → local frame, still full f64 precision (for view state, never for the GPU). */
  toLocal(x: AuthoritativeM, y: AuthoritativeM): [LocalFrameM, LocalFrameM] {
    return [x - this.x, y - this.y];
  }

  /** Absolute f64 authoritative coordinates → interleaved f32 GPU-ready offsets, against this
   * frame's current origin. */
  toF32Positions(x: Float64Array, y: Float64Array): Float32Array {
    return offsetPositions(x, y, this.x, this.y);
  }
}
