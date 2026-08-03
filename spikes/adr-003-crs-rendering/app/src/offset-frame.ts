/**
 * Offset-relative rendering frame (ADR-003's "re-center on the view origin
 * ... before f32 GPU upload").
 *
 * EPSG:2056 eastings are ~2.6e6 m. float32 has a 24-bit significand, so at
 * that magnitude one ULP is 0.25 m — roughly 2 px at M2's 1:500 test scale,
 * and the quantisation is *already baked in* by the time the value reaches
 * the GPU. No amount of shader-side cleverness recovers it, which is why the
 * subtraction has to happen CPU-side in f64, before the narrowing.
 *
 * deck.gl does apply its own auto-offset for an `OrthographicView`
 * (PROJECTION_MODE.IDENTITY subtracts `Math.fround(viewport.position)` in
 * the shader), but that runs *after* the attribute has been narrowed to f32,
 * so it fixes the matrix maths and not the input. deck.gl's other lever, the
 * `position64Low` companion attribute (emulated fp64), is a different
 * mitigation this spike doesn't use — ADR-003 specifies CPU-side
 * re-centering, and that is what M2 measures.
 *
 * This differs from M1's fixed extent-centroid origin: the origin here
 * follows the view, so precision stays bounded no matter where in the extent
 * the user is working, not just near the extent's middle.
 */

/**
 * Absolute EPSG:2056 metres. This is the only form that may be persisted,
 * returned from a query, or handed across an API boundary.
 */
export type Epsg2056M = number;

/**
 * An offset from the current frame origin. Renderer-internal and meaningless
 * without the origin that produced it — never persist it, never return it
 * from picking, never write it to a project file (docs/01: CRS is a type,
 * and this local frame is emphatically *not* a CRS). M3 must resolve picks
 * back to {@link Epsg2056M} before anything outside the renderer sees them.
 *
 * These are documentation aliases rather than branded nominal types: real
 * branding would force casts through every arithmetic expression here, which
 * is not a trade worth making in throwaway spike code. The distinction is
 * enforced by review, not the compiler.
 */
export type LocalFrameM = number;

/**
 * Largest drift permitted before re-centering, derived from the precision
 * budget rather than picked.
 *
 * f32 carries a 24-bit significand, so a value of magnitude D lands within
 * ~D * 2^-24 of the truth; on screen that is `D * 2^-24 * pixelsPerMetre`.
 * Solving for a declared pixel budget gives the largest D still inside it.
 *
 * The point of deriving it: a *fixed metric* threshold has exactly the wrong
 * shape. Zoomed in, metres-per-pixel is small and even a modest drift costs
 * real pixels; zoomed out, the view centre moves kilometres per gesture at a
 * scale where f32 error is invisible — a fixed threshold would re-center
 * constantly precisely when it least matters, and each re-center costs a
 * full buffer rebuild.
 *
 * `maxM` is a sanity ceiling, not a precision limit.
 */
export function recenterThresholdForBudget(
  pixelsPerMetre: number,
  budgetPx: number,
  maxM = 131_072,
): number {
  const f32RelativePrecision = Math.pow(2, -24);
  return Math.min(maxM, budgetPx / (f32RelativePrecision * pixelsPerMetre));
}

/**
 * Absolute f64 EPSG:2056 -> interleaved f32 offsets from `(originE, originN)`.
 *
 * The subtraction runs in f64 (JS numbers are f64); only the store into the
 * Float32Array narrows. That order is the whole point — narrowing first and
 * subtracting second throws the precision away before the subtraction can
 * preserve it. Passing origin (0, 0) yields the naive absolute-f32 upload,
 * which is exactly how M2's control is built.
 */
export function offsetPositions(
  e: Float64Array,
  n: Float64Array,
  originE: Epsg2056M,
  originN: Epsg2056M,
): Float32Array {
  const out = new Float32Array(e.length * 2);
  for (let i = 0; i < e.length; i++) {
    out[i * 2] = e[i] - originE;
    out[i * 2 + 1] = n[i] - originN;
  }
  return out;
}

export interface RecenterEvent {
  index: number;
  fromE: number;
  fromN: number;
  toE: number;
  toN: number;
  driftM: number;
}

export class OffsetFrame {
  private e = 0;
  private n = 0;
  private initialized = false;
  private recenters = 0;
  /**
   * Every origin change, recorded. The origin is a transform, and docs/01
   * principle 8 (no black boxes) says a transform the user cannot see is not
   * acceptable — so re-centering is an observable event, not a silent
   * internal optimisation. It also supplies the re-center-frequency data the
   * threshold trade-off needs.
   */
  readonly events: RecenterEvent[] = [];
  // Not a constructor parameter property (`constructor(readonly thresholdM...)`)
  // -- Node's native TypeScript type-stripping (used to run this file's CI
  // tests with zero build step/dependency) doesn't support that shorthand,
  // only plain field declarations. Behaviourally identical either way.
  readonly thresholdM: number;

  constructor(thresholdM: number) {
    this.thresholdM = thresholdM;
  }

  get originE(): number {
    return this.e;
  }

  get originN(): number {
    return this.n;
  }

  /** How many times the origin has moved — including the initial placement. */
  get recenterCount(): number {
    return this.recenters;
  }

  /**
   * Moves the origin to `(viewE, viewN)` if the view has drifted past the
   * threshold (or if this is the first call). Returns true when the origin
   * moved, meaning every f32 buffer derived from it is now stale and must be
   * rebuilt via {@link toF32Positions}.
   */
  maybeRecenter(viewE: Epsg2056M, viewN: Epsg2056M): boolean {
    const drift = this.initialized ? Math.hypot(viewE - this.e, viewN - this.n) : Infinity;
    if (drift <= this.thresholdM) {
      return false;
    }
    this.events.push({
      index: this.recenters,
      fromE: this.e,
      fromN: this.n,
      toE: viewE,
      toN: viewN,
      driftM: drift,
    });
    this.e = viewE;
    this.n = viewN;
    this.initialized = true;
    this.recenters++;
    return true;
  }

  /** Absolute f64 EPSG:2056 -> interleaved f32 local offsets for GPU upload. */
  toF32Positions(e: Float64Array, n: Float64Array): Float32Array {
    return offsetPositions(e, n, this.e, this.n);
  }

  /** Absolute f64 -> local frame, still full f64 precision (for view state). */
  toLocal(e: Epsg2056M, n: Epsg2056M): [LocalFrameM, LocalFrameM] {
    return [e - this.e, n - this.n];
  }
}
