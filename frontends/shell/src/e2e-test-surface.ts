// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * E2E TEST SURFACE -- dev builds and measure builds only (`isInstrumentedBuild()`,
 * `RESIDENCY-PREREGISTRATION.md` §12 Amendment 16 -- viewport-residency cut P3r widened this
 * file's own gate from bare `import.meta.env.DEV`). Never present in a PLAIN production bundle:
 * every export here is a no-op unless `isInstrumentedBuild()`, which reduces to a Vite-replaced
 * literal `false` for `npm run build` (`vite build`, no mode), letting esbuild's minifier
 * dead-code-eliminate the guarded branches (`npm run verify`'s production build succeeding is what
 * proves this, not a claim in this comment) -- a measure build (`vite build --mode measure`)
 * deliberately keeps the same branches compiled in, on top of the same release optimizations.
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

import type { ApplyFilterOutcome } from "./App";
import type { ResidentCounts } from "./canvas/WorkingCanvas";
import type { TileGridLevel } from "./canvas/tileGridConstants";
import { isInstrumentedBuild } from "./isInstrumentedBuild";
import type { ResidencyStepResult } from "./instrument/residencyInstrument";
import type { ExecuteOutcome, PrepareOutcome } from "./publish/types";
import type { ResidencyArm, SetResidencyArmResult } from "./residency/residencyArm";
import type { CrsCatalogEntry } from "./skp/crsCatalog";

/** Viewport-residency cut P1b (N4, the G6 instrument): `residencyEndStep`'s real return shape --
 * the pure `ResidencyStepResult` plus the resident vertex/feature totals read off `WorkingCanvas` at
 * the same moment, merged by `App.tsx`'s own hook body. `null` when no `WorkingCanvas` is mounted
 * (no dataset admitted yet -- e.g. a step measured before any `openPath` call ever completes). */
export interface ResidencyEndStepResult extends ResidencyStepResult {
  residentAtEndStep: ResidentCounts | null;
}

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

/** NEXT-CUT.md P3 item F: the same two `skp/0.2` remediation options a real form submit passes to
 * `admitDataset` (`AdmitOptions`), camelCased for JS-side ergonomics -- `openPath` converts these
 * to the wire's snake_case shape itself, so a driver never has to know that detail. Omitted
 * entirely (not just both fields `undefined`) is how a driver replays a plain, non-remediated
 * open -- the same as calling `openPath(path)` before this cut. */
export interface OpenPathOptions {
  crsAssertion?: { identifier: string; definitionJson: string };
  identity?: { column: string };
}

/**
 * `openPath`'s `"admitted"` means `open_dataset` actually returned a dataset handle.
 *
 * `queryWithFilter`'s outcome below is `App.tsx`'s own `ApplyFilterOutcome` -- NEXT-CUT.md
 * (filter-panel cut) P1 first honestly reported `ViewportStreamManager.requestViewport`'s raw
 * `RequestOutcome` here (closing an older "no-refusal" collapse); P3's deviation-3 retrofit went one
 * step further and routed this hook through `applyFilter` itself, the exact same function
 * `FilterPanel`'s own Apply button calls -- "hook and panel drive the identical seam," not a second,
 * parallel path with its own reporting shape. `"applied"` carries the real stream handle a caller
 * minted a ticket for; `"not-applied"` names a throttled-after-retry/superseded/stopped call (no
 * ticket minted, no refusal either); `"refused"` carries the same structured `FormattedRefusal`
 * (`code`, verbatim `message`, `fields`) the panel's own `.filter-refusal` block renders, rather
 * than the bare `{code, message}` pair this hook used to construct by hand.
 */
export type FilterQueryOutcome = ApplyFilterOutcome;

export interface E2eTestSurface {
  openPath?: (path: string, opts?: OpenPathOptions) => Promise<OpenPathOutcome>;
  /** Read-only pass-through to `skp/crsCatalog.ts`'s own `crsCatalog()` -- NEXT-CUT.md P3 item F,
   * so P5's suite can assert against the pinned catalog `CrsAssertionForm` itself renders, without
   * needing a DOM query to reach it. Registered alongside `openPath` (`AdmissionPanel.tsx`), not
   * conditioned on any admitted dataset -- the catalog is available before any file is opened. */
  crsCatalog?: () => Promise<CrsCatalogEntry[]>;
  capturePixels?: (regions?: PixelRegion[]) => Promise<PixelSummary>;
  /** Drives `App.tsx`'s `applyFilter` with a caller-supplied predicate against the currently-open
   * dataset -- the SAME seam `FilterPanel`'s own Apply button calls (deviation-3 retrofit), not a
   * parallel test-only path (this file's own top doc comment). Only registered once a dataset is
   * admitted (mirrors `capturePixels`, which only exists once `WorkingCanvas` mounts). Resolves to
   * `applyFilter`'s own `ApplyFilterOutcome` -- see `FilterQueryOutcome`'s own doc comment. */
  queryWithFilter?: (predicate: string) => Promise<FilterQueryOutcome>;
  /** Drives `PublishPanel.tsx`'s own `runPrepare` -- the SAME function the real "Publish…" button
   * calls (`NEXT-CUT.md` P3 item 1: "export it via the established registerE2eHook pattern NOW as
   * publishPrepare/publishExecute hooks, dev-only"). `scope` overrides the panel's own currently
   * selected radio choice when given; omitted uses whatever is selected. Registered only once a
   * dataset is admitted and `PublishPanel` is mounted, mirroring `queryWithFilter`. P4 (this cut's
   * evidence phase) is expected to be the first real driver of this hook -- P2/P3's own job is only
   * to expose the seam, per the piece text. */
  publishPrepare?: (scope?: "whole" | "current") => Promise<PrepareOutcome>;
  /** Drives the SAME `client.ts::publishExecute` function `PublishDialog`'s own Submit button
   * calls (`execute={publishExecute}`, `PublishPanel.tsx`), against the current attempt
   * (`attemptIdRef.current`, kept in sync with `PublishPanelState`). **Registered dataset-scoped
   * in `PublishPanel.tsx`, alongside `publishPrepare`/`publishPrepareWithDestination` -- NOT
   * inside `PublishDialog.tsx`, and this is a real fix, not a stylistic choice**:
   * `PublishDialog` only mounts when this panel's own `expanded` disclosure is ALSO open, which
   * `e2e/publish.mjs`'s headless flow (drives every publish hook without ever clicking the
   * disclosure toggle) never triggers -- an earlier version registered this hook inside
   * `PublishDialog` and the hook could never be reached by that suite, a real finding from running
   * it. `{status:"unknown-attempt"}` when called with no attempt currently pending, mirroring what
   * the host itself returns for an unknown `attempt_id`. */
  publishExecute?: (typedPhrase: string) => Promise<ExecuteOutcome>;
  /** **DEV-ONLY E2E TEST SEAM** (`NEXT-CUT.md` P4). Drives `PublishPanel.tsx`'s own
   * `runPrepareWithDestination` -- the SAME `publish::prepare` code path `publishPrepare` above
   * drives, except it supplies `destination` directly instead of letting the native OS save
   * dialog answer it. WebView2's save-dialog chrome has no CDP-reachable automation path at all
   * (unlike `openPath`'s picker, which is a *separate* Tauri command JS can simply not call), so
   * this hook exists precisely because `publishPrepare` alone leaves no way for `e2e/publish.mjs`
   * to reach anything past the picker. Backed by `binding_publish_prepare_e2e_destination`
   * (`commands.rs`, `#[cfg(debug_assertions)]`) -- compiled out of a release build entirely, and
   * the grant it produces is still minted host-side from the supplied destination, never from a
   * JS-asserted grant. **An E2E run through this hook therefore does not exercise the native
   * picker -- only the operator's manual walkthrough does.** `scope` defaults to whatever
   * `PublishPanel`'s own radio choice currently is, mirroring `publishPrepare`'s own override
   * parameter. */
  publishPrepareWithDestination?: (
    destination: string,
    scope?: "whole" | "current"
  ) => Promise<PrepareOutcome>;
  /** **DEV-ONLY E2E TEST SEAM** (viewport-residency cut P1, `RESIDENCY-PREREGISTRATION.md`).
   * Flips `instrument/residencyInstrument.ts`'s runtime `enabled` flag -- OFF by default, so a
   * driver run that never calls this exercises the exact same code paths (and, per §8's
   * wire-bytes-identity assertion, the exact same wire traffic) as a build with the instrument
   * compiled out entirely. Registered at the top level (`App.tsx`), not dataset-scoped: a driver may
   * legitimately want the instrument on BEFORE a dataset is even opened (the `fit` trace step's own
   * first-pixel timing starts at that step, not at instrument-enable time). */
  residencyInstrumentSetEnabled?: (enabled: boolean) => Promise<void>;
  /** M10 (P1b): reads the instrument's own runtime `enabled` flag back -- the dev-surface half of
   * `--control`'s off-ness assertion (`residencyInstrument.ts`'s `isResidencyInstrumentEnabled`). */
  residencyInstrumentIsEnabled?: () => Promise<boolean>;
  /** Starts a new camera-trace step's counters/timings. A no-op (returns nothing meaningful) unless
   * `residencyInstrumentSetEnabled(true)` was already called. */
  residencyBeginStep?: (stepId: string) => Promise<void>;
  /** Ends the active step and returns its snapshot (P1b, N4: merged with the resident vertex/feature
   * totals read off `WorkingCanvas` at the same moment) -- `null` if the instrument is disabled or no
   * step was active (`residencyInstrument.ts`'s own `endResidencyStep` doc comment). */
  residencyEndStep?: () => Promise<ResidencyEndStepResult | null>;
  /** Marks "an input happened right now" for the input-to-present proxy (§6) -- the driver calls
   * this immediately before dispatching a real pointer/wheel gesture that drives a pan or zoom step,
   * so the NEXT rendered frame's timestamp becomes that gesture's proxy latency
   * (`ResidencyInstrumentCore.recordInput`'s own doc comment). A no-op while disabled. */
  residencyMarkInput?: () => Promise<void>;
  /** M1/M3/S7 (P1b): arms a PERSISTENT (not one-shot) `onAfterRender` hook (`WorkingCanvas.tsx`,
   * reusing `capturePixels`' own arm/restore pattern) that feeds `recordResidencyRenderTick` on
   * EVERY render observed while armed -- both the frame-time series and the first-pixel stamp are
   * driven by this. The driver calls this once per step, right after `residencyBeginStep`, and
   * disarms it (`residencyDisarmFirstPixel`) once the step settles. A no-op while the instrument is
   * disabled or no `WorkingCanvas` is mounted.
   *
   * **P1d B5 fix.** `watchdogMs` (self-restore deadline) is the caller's own choice -- the driver
   * passes the step's own declared `settle.timeoutMs`, so an armed measurement is never capped
   * shorter than the settle bound already governing that same step (an earlier, fixed 5000 silently
   * capped every armed window at 5s regardless of the step's own settle timeout, e.g. `open-drain`'s
   * 60s). Defaults to 5000 when omitted (`WorkingCanvas.tsx`'s own `armFirstPixelRenderHook` doc
   * comment), preserving the original ceiling for any future caller that does not pass one. */
  residencyArmFirstPixel?: (watchdogMs?: number) => Promise<void>;
  /** S7: explicitly disarms the hook `residencyArmFirstPixel` installed, restoring `onAfterRender`
   * to a real no-op. Resolves `true` iff this call disarmed BEFORE the arm's own watchdog fired (a
   * clean disarm), `false` iff the watchdog had already fired and self-restored first. P1d B5: the
   * watchdog's own deadline is whatever `residencyArmFirstPixel`'s caller passed it (no longer a
   * fixed 5s), so "the watchdog" here means that same caller-chosen deadline, not a hardcoded one. */
  residencyDisarmFirstPixel?: () => Promise<boolean>;
  /** M6 (P1b): the driver-visible, session-wide in-flight `viewport_query` count
   * (`getResidencyInFlightStreamCount`) -- always `0` while the instrument is disabled (a disclosed
   * limitation, `residencyInstrument.ts`'s own `inFlightStreamCount` doc comment). `waitForSettle`
   * for a residency trace step requires BOTH console quiescence AND this reading `0` (§4b's letter). */
  residencyInFlightStreamCount?: () => Promise<number>;
  /** Viewport-residency cut P5g (diagnosis piece, candidate zoom-to-layer click hang): the
   * candidate arm's own `TileViewportStreamManager.queuedCount` -- tiles waiting for a
   * `MAX_IN_FLIGHT_TILE_STREAMS` slot, the half of "in-flight+queued" `residencyInFlightStreamCount`
   * above does NOT cover (that counter only increments once a tile's stream has actually minted,
   * `candidateArmSession.ts`'s `countTileStreamIssuedOnce`). `residency-harness.mjs`'s own pre-click
   * calm wait (`waitForCalmBeforeClick`) sums both counters as its own "is real candidate-arm work
   * still outstanding" signal, mirroring the settle discipline's own in-flight check but bounded and
   * applied BEFORE a `.zoom-to-layer` click rather than after a step's gesture. Always `0` for the
   * baseline arm (no `TileViewportStreamManager` exists) and always `0` while no candidate-arm
   * session is currently open -- never a fabricated value. */
  residencyQueuedTileCount?: () => Promise<number>;
  /** P1d suggestion 10: session-wide total of bytes a superseded stream's batch carried when it
   * arrived AFTER its own supersession (`viewportStreamManager.ts`'s `onBatch` drop branch;
   * `residencyInstrument.ts`'s own `supersededBytesDropped`/`recordResidencySupersededBytes` doc
   * comments have the full mechanism). Always `0` while the instrument is disabled, the same
   * disclosed control-arm limitation `residencyInFlightStreamCount` above already carries. */
  residencySupersededBytesDropped?: () => Promise<number>;
  /** Re-review S5 (Amendment 21 -- harness file touchable for this): the candidate arm's own tile
   * grid frame, declared-fixed-for-the-session shape (`tileGrid.ts`'s `TileGridFrame`) plus the
   * active level, exactly as `TileViewportStreamManager` currently holds them -- `null` before
   * `establishGridFrame` has ever run (baseline arm; or a candidate-arm session whose untiled first
   * look has not yet reached its own terminal). Carried into `residency-harness.mjs`'s own evidence
   * so a diagnosis session can compare the frozen `baseSpan` against a MUCH LATER observed dataset
   * extent from the same run without re-deriving anything -- the frame-drift hypothesis's own
   * observable, first recorded at establishment by `candidateArmSession.ts`'s own session-log line. */
  residencyGridFrame?: () => Promise<{ originX: number; originY: number; baseSpan: number; level: TileGridLevel } | null>;
  /** **DEV-ONLY, IDENTITY-MODE-ONLY E2E TEST SEAM** (viewport-residency cut P1c,
   * `RESIDENCY-PREREGISTRATION.md` §12 Amendment 6). Moves the camera to an EXACT, caller-supplied
   * world-space (authoritative-CRS) `(targetX, targetY)` at the given `zoom`, reusing the same
   * `OffsetFrame.forceRecenter` + uncontrolled `initialViewState` primitives a real "zoom to layer"
   * click or interactive pan/zoom already drives (`WorkingCanvas.tsx`'s own doc comment on the
   * effect that registers this) -- there is no second, parallel query-issuing path: the resulting
   * `viewport_query` goes through the identical `onViewportChanged` -> debounced `requestViewport`
   * choke point every other camera move reaches. Amendment 6's own fix: the instrument-identity
   * guard's real-synthetic-gesture camera control could not discriminate instrument effects
   * (CDP pointer timing jitter racing the shell's own pan/zoom debounce, independent of instrument
   * state -- the committed gate evidence records the finding); this seam replaces that ONLY for the
   * identity mode. **NEVER called by a measured cell** -- `e2e/residency-harness.mjs`'s own driver
   * asserts this (`e2eSetViewStateCallCount` below) and its own `applyStep` never references this
   * hook. Resolves `false` (moves nothing) if no `WorkingCanvas`/`Deck` instance is mounted. */
  e2eSetViewState?: (targetX: number, targetY: number, zoom: number) => Promise<boolean>;
  /** The call counter `e2eSetViewState` above increments on every invocation, for exactly one
   * reason: letting `e2e/residency-harness.mjs`'s own driver assert, after any MEASURED run, that
   * this identity-mode-only seam was never touched (Amendment 6's own restriction). Never read by
   * product code.
   *
   * **P1d suggestion 9, corrected.** This counter is a `useEffect([])`-scoped closure variable
   * (`WorkingCanvas.tsx`) -- it resets to 0 on every MOUNT of a `WorkingCanvas` instance (a dataset
   * (re-)admission can remount one), not "only by a fresh page load" as an earlier version of this
   * comment claimed. The driver's own assertion window is therefore "since the currently-mounted
   * instance's own last mount," restated at its own call site (`residency-harness.mjs`). */
  e2eSetViewStateCallCount?: () => Promise<number>;
  /** **DEV-ONLY E2E TEST SEAM** (viewport-residency cut P3, `NEXT-CUT.md`'s own "THE ARM SWITCH").
   * Selects `"baseline"` (the default, and the ONLY value the full vitest/E2E regression suites
   * ever observe) or `"candidate"` for the NEXT dataset session -- refused (a typed
   * `SetResidencyArmResult`, never a thrown exception) while a dataset is currently open
   * (`residency/residencyArm.ts`'s own doc comment has the full contract). The harness itself does
   * not yet drive this (`--arm=candidate` is a LATER piece's own addition); this hook exists now so
   * a driver -- or a manual dev-console call -- can already flip it. */
  setResidencyArm?: (arm: ResidencyArm) => Promise<SetResidencyArmResult>;
  /** Reads the current arm back -- `"baseline"` unless a prior `setResidencyArm("candidate")` call
   * on this same session succeeded. */
  getResidencyArm?: () => Promise<ResidencyArm>;
}

declare global {
  interface Window {
    __SPATIAL_E2E__?: E2eTestSurface;
  }
}

/** No-ops outside an instrumented build (`isInstrumentedBuild()`: a dev build, or a measure build
 * -- `RESIDENCY-PREREGISTRATION.md` §12 Amendment 16) -- see this file's top comment for why that
 * is load-bearing, not a convenience default. */
export function registerE2eHook<K extends keyof E2eTestSurface>(
  name: K,
  fn: NonNullable<E2eTestSurface[K]>
): void {
  if (!isInstrumentedBuild()) return;
  const surface = window.__SPATIAL_E2E__ ?? {};
  surface[name] = fn as E2eTestSurface[K];
  window.__SPATIAL_E2E__ = surface;
}

export function unregisterE2eHook(name: keyof E2eTestSurface): void {
  if (!isInstrumentedBuild()) return;
  if (window.__SPATIAL_E2E__) {
    delete window.__SPATIAL_E2E__[name];
  }
}
