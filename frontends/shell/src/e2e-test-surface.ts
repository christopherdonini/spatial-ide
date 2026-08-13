/**
 * E2E TEST SURFACE -- dev builds only. Never present in a production bundle: every export here is
 * a no-op unless `import.meta.env.DEV`, which Vite replaces with a literal `false` for `npm run
 * build`, letting esbuild's minifier dead-code-eliminate the guarded branches (`npm run verify`'s
 * production build succeeding is what proves this, not a claim in this comment).
 *
 * Referenced by `frontends/shell/e2e/README.md`. Exists for exactly one reason: a Playwright
 * driver attached over CDP can drive every part of this app except the native OS file-picker
 * `skp/dialog.ts` opens (no automation driver reaches through WebView2's own dialog chrome), so
 * `openPath` below lets the harness supply a path directly and run the *identical* admission code
 * a real operator's click would (`AdmissionPanel.tsx`'s `admitPath`) -- this is not a second,
 * test-only code path. `capturePixels` reads the rendered frame back with the ADR-003 spike's
 * `onAfterRender` + `readPixels` technique (`spikes/adr-003-crs-rendering/app/src/m4-editing.ts`),
 * so the harness can assert that something actually reached the screen.
 *
 * The raw pixel buffer never leaves the page (docs/09 posture: nothing about this surface widens
 * what a remote CDP client can extract beyond what devtools itself already could) -- only the
 * in-page summary below crosses back over CDP.
 */

export interface PixelRegion {
  /** Fraction of the drawing buffer, 0..1, in WebGL's own `readPixels` origin (bottom-left). */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PixelColorCount {
  /** An exact sample pixel from this histogram bin, formatted `"r,g,b,a"`. */
  rgba: string;
  count: number;
}

/** A drawing-buffer pixel coordinate (WebGL's own `readPixels` origin, bottom-left -- same
 * convention `PixelRegion` uses), confirmed non-background at capture time by the same pass that
 * produced the summary carrying it -- 2026-08-13, so an E2E hover assertion can target a real,
 * read-back-verified point instead of a heuristic cell-center guess that can land in a gap between
 * rendered features (the failure mode a prior A9' run traced to). */
export interface PixelSamplePoint {
  x: number;
  y: number;
}

export interface PixelRegionSummary extends PixelRegion {
  nonBackgroundCount: number;
  totalPixels: number;
  /** The first non-background pixel encountered scanning this region, or `null` if
   * `nonBackgroundCount` is 0 -- always non-null whenever `nonBackgroundCount > 0`. */
  samplePoint: PixelSamplePoint | null;
}

export interface PixelSummary {
  width: number;
  height: number;
  totalPixels: number;
  /** Pixels where any of r, g, b, a is nonzero. */
  nonBackgroundCount: number;
  /** Pixels with alpha === 255. */
  opaqueCount: number;
  /** Up to 8 entries, most-populous bin first, from a 16-level-per-channel coarse histogram. */
  topColors: PixelColorCount[];
  regions: PixelRegionSummary[];
  /** The sample pixel belonging to the densest histogram bin that is not the exact background
   * color (`0,0,0,0`), or `null` if every pixel in the frame is background. Distinct from any
   * single region's own `samplePoint`: this is frame-wide, not scoped to a `PixelRegion`. */
  samplePoint: PixelSamplePoint | null;
}

export type OpenPathOutcome = { kind: "admitted" } | { kind: "refused"; code: string; message: string };

/** **Not** the same guarantee as `OpenPathOutcome` despite the superficially similar shape (P6
 * should-fix, reviewer round over P5): `openPath`'s `"admitted"` means `open_dataset` actually
 * returned a dataset handle. `queryWithFilter`'s `"no-refusal"` below means only that
 * `ViewportStreamManager.requestViewport` resolved without throwing a typed `skp.filter_*`
 * refusal -- `requestViewport` returns `void` and resolves the same way on a throttled call, a
 * superseded/generation-losing call, or a call issued after `stop()` (`viewportStreamManager.ts`'s
 * own doc comment), none of which means this call's own ticket was minted. Do not read
 * `"no-refusal"` as "a ticket was minted for this call" -- it is not that claim. */
export type FilterQueryOutcome = { kind: "no-refusal" } | { kind: "refused"; code: string; message: string };

export interface E2eTestSurface {
  openPath?: (path: string) => Promise<OpenPathOutcome>;
  capturePixels?: (regions?: PixelRegion[]) => Promise<PixelSummary>;
  /** Drives `ViewportStreamManager.requestViewport` (`App.tsx`) with a caller-supplied predicate
   * against the currently-open dataset -- the SAME production call a future filter panel would make,
   * not a parallel test-only path (this file's own top doc comment). Only registered once a dataset
   * is admitted (mirrors `capturePixels`, which only exists once `WorkingCanvas` mounts). Resolves to
   * `{kind:"no-refusal"}` once `requestViewport` itself resolves without throwing -- **this means "no
   * typed `skp.filter_*` refusal was raised," not "a ticket was minted."** `requestViewport` is a
   * silent no-op on a throttled call, a call superseded by a newer one before it finished minting, or
   * a call issued after the manager was stopped (see `FilterQueryOutcome`'s own doc comment) -- every
   * one of those resolves exactly like a real admitted mint from this hook's point of view. A caller
   * that needs to know a ticket actually minted must confirm it some other way (e.g. watching for a
   * render change), the same `waitForSettle` pattern every other e2e/*.mjs step already uses for that
   * purpose. Resolves to `{kind:"refused", ...}` for the one case this hook *can* tell apart: a typed
   * `skp.filter_*` refusal `viewport_query` actually returned. */
  queryWithFilter?: (predicate: string) => Promise<FilterQueryOutcome>;
}

declare global {
  interface Window {
    __SPATIAL_E2E__?: E2eTestSurface;
  }
}

/** No-ops outside dev builds -- see this file's top comment for why that is load-bearing, not a
 * convenience default. */
export function registerE2eHook<K extends keyof E2eTestSurface>(
  name: K,
  fn: NonNullable<E2eTestSurface[K]>
): void {
  if (!import.meta.env.DEV) return;
  const surface = window.__SPATIAL_E2E__ ?? {};
  surface[name] = fn as E2eTestSurface[K];
  window.__SPATIAL_E2E__ = surface;
}

export function unregisterE2eHook(name: keyof E2eTestSurface): void {
  if (!import.meta.env.DEV) return;
  if (window.__SPATIAL_E2E__) {
    delete window.__SPATIAL_E2E__[name];
  }
}
