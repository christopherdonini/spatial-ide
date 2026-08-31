// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { Deck, OrthographicView, PickingInfo } from "@deck.gl/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import type { PixelColorCount, PixelRegion, PixelRegionSummary, PixelSamplePoint, PixelSummary } from "../e2e-test-surface";
import { logSessionEvent } from "../diagnostics/log";
import {
  recordResidencyBatch,
  recordResidencyBatchDecoded,
  recordResidencyDuplicatesDropped,
  recordResidencyEvictionsApplied,
  recordResidencyRenderTick,
} from "../instrument/residencyInstrument";
import {
  traceCanvasLifecycle,
  traceLayerUpdate,
  tracePositionsSample,
  traceResidency,
  traceStreamBatch,
  traceTileIngest,
  traceViewState,
} from "../diagnostics/renderTrace";
import { begin, end } from "../diagnostics/watchdog";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import type { StyleState } from "../style/document";
import { resolveDrawParameters } from "../style/document";
import { batchForLayerId, buildLayers, toResolvedDrawParams } from "./buildLayers";
import type { ResolvedDrawParams } from "./buildLayers";
import { coalesceOncePerFrame } from "./coalesceOncePerFrame";
import { decodeBatch } from "./decodeBatch";
import type { ResidentBatch } from "./decodeBatch";
import { bboxForFit, chooseFitTarget, extentOfBatch, fitViewStateForBbox, unionBbox } from "./extent";
import {
  DECKGL_PICK_INDEX_CEILING,
  MAX_RESIDENT_VERTICES,
  PickCeilingExceeded,
  ResidentVertexCeilingExceeded,
} from "./limits";
import { OffsetFrame, RECENTER_BUDGET_PX, recenterThresholdForBudget } from "./offsetFrame";
import { PickResult, resolvePick } from "./pick";
import { ResidentSet } from "./residentSet";
import { getResidencyArm } from "../residency/residencyArm";
import { ingestTileBatch } from "./tileIngest";
import type { TileGridContext } from "./tileIngest";
import { tileDistanceToPoint } from "./tileGrid";
import type { TileGridFrame, TileKey } from "./tileGrid";
import { INITIAL_TILE_KEY } from "./tileGridConstants";
import type { TileGridLevel } from "./tileGridConstants";
import { planTileEviction, TileResidentSet } from "./tileResidentSet";
import { AuthoritativeBbox, computeAuthoritativeViewportBbox } from "./viewportBbox";

/**
 * The working canvas — deck.gl `OrthographicView` in the dataset's source CRS (ADR-010 rules 1, 2,
 * 3, 6, 7; architect review, `frontends/shell` cut 1, D3.1–D3.6). Style v0 (ADR-017 §5a; ADR-022)
 * lives as a `style` PROP here -- `App.tsx` owns the editable state, `style/StylePanel.tsx` (P4) is
 * the one place it is edited. See `applyStyleChange` below for the re-render seam a style change
 * takes: it recomputes resolved draw parameters and calls `render()`, and reaches nothing else --
 * no viewport query, no ticket, no debounce interaction (binding note 7).
 *
 * **deck.gl's own unprojected pick coordinate is never read anywhere in this module.** Rule 1: it
 * is a renderer-local value with no CRS tag, and the only authoritative coordinate a pick may
 * report is looked up through `resolvePick` from the same buffers a layer was built from. See
 * `PICKING.md` in this directory.
 *
 * **`initialViewState`, never `viewState`, and this is load-bearing, not a style choice.** Passing
 * `viewState` puts a vanilla (non-React) `Deck` instance into *controlled* mode, where
 * `_getViewState()` always prefers `this.props.viewState` over deck's own internally-tracked state
 * — so with `controller: true` and a `viewState` prop that this component never updates, every
 * pan/zoom gesture fires `onViewStateChange` while the rendered view never moves (verified against
 * `@deck.gl/core@9.3.7`'s `deck.js`: `_getViewState()` returns `this.props.viewState ||
 * this.viewState`, and `_onViewStateChange` only writes back into `this.viewState`, which
 * `_getViewState` never reaches once `props.viewState` is set). Staying uncontrolled
 * (`initialViewState` only) lets deck.gl own `this.viewState` and update it on every gesture. A
 * later programmatic jump (recentering the camera after an origin move) still works uncontrolled:
 * `setProps` re-syncs `this.viewState` from `initialViewState` whenever the *new* value is not
 * deep-equal to the previous one (`deck.js`'s `setProps`), which is exactly "jump to a new place"
 * without ever setting `viewState` and flipping the instance into controlled mode.
 */

export interface WorkingCanvasHandle {
  /** Decode one Arrow IPC batch and add it to the canvas. Called by the streaming layer as
   * data-plane batches arrive. Reports (via `onCanvasRefusal`, after logging) rather than throwing
   * when a declared ceiling refuses the batch; a genuine decode failure (a malformed buffer, a
   * mistagged frame) still throws, since that is a defect the caller's own `startStream` decode
   * boundary is built to turn into a terminal frame, not something this method can recover from.
   * Returns the number of rows/features this call actually admitted -- `batch.ids.length` on
   * success, `0` on a declared-ceiling refusal (nothing was added) -- so the caller (`App.tsx`'s
   * `makeManagerCallbacks`, NEXT-CUT.md P4) can accumulate a cumulative row count for the
   * scan-liveness indicator without decoding the batch a second time itself. */
  pushBatch(streamHandle: string, batchSeq: number, ipcBytes: Uint8Array): number;
  /** Drops every resident batch belonging to a superseded or closed stream. */
  clearStream(streamHandle: string): void;
  /** Re-fit the camera ("zoom to layer") to the layer's best-known extent -- the dataset-lifetime
   * union of every batch extent this instance has ever admitted (`fitAnchorRef`), deliberately
   * **not** current residency. Two reasons, both 2026-08-14 walkthrough findings: (1) residency
   * alone goes `null` exactly when the viewport has been panned fully off-data, leaving the button
   * with no target exactly when the user has panned away; (2) even with a residency-preferring
   * fallback, the fit outcome then depended on scroll history and in-flight refill timing -- a
   * second click could see different residency than the first and jump somewhere visibly
   * different, which read as "random" to an operator expecting the same place every time. Fitting
   * the anchor unconditionally makes every click land on the same, deterministic fit once the
   * layer has ever loaded anything (`extent.ts`'s `chooseFitTarget` has the full account). A no-op
   * (returns `false`) only when nothing was ever rendered by this instance. */
  fitToBounds(): boolean;
  /**
   * Clears BOTH the fit anchor (`fitAnchorRef`) and the one-shot auto-fit flag (`hasAutoFitRef`) --
   * called whenever a new FILTER GENERATION begins (`App.tsx`'s `applyFilter`, on any Apply or Clear
   * that actually issues).
   *
   * **Human-approved design revision, 2026-08-15 walkthrough Part E, E5 finding.** The operator
   * applied a late-matching predicate on the slow fixture; the liveness/cancel affordance itself
   * worked perfectly, but once the scan completed the matching features were unfindable -- they live
   * at the grid's far top, and the filtered query had been carrying the CURRENT viewport bbox
   * forward (unchanged since the unfiltered first look), so the matches either never arrived at all
   * or arrived far off-screen. "Zoom to layer" was then also inert: `fitToBounds` fits the
   * dataset-lifetime `fitAnchorRef`, which by then already equalled the just-fitted (matchless) view
   * -- reproducing exactly what was already on screen, not a rescue.
   *
   * Resolution: `App.tsx`'s `applyFilter` now issues Apply/Clear as an unrestricted `bbox: null` look
   * (a filter asks WHERE the matches are, not "within whatever the camera already happened to be
   * pointed at") and calls THIS method on every successful issue, before that stream's first batch
   * can arrive. Clearing both refs here is what lets the EXISTING first-batch one-shot auto-fit
   * (`pushBatch`'s own `if (!hasAutoFitRef.current && residentExtentRef.current)` block,
   * `notifyViewport: false` -- no new query storm, unchanged) fire again for the filtered delivery,
   * symmetric with a fresh dataset-open, with no new fit logic of its own: filter -> scan -> the
   * camera lands on the matches. `fitToBounds` (`chooseFitTarget(fitAnchorRef.current)`) is then
   * deterministic again within the NEW generation, exactly as it already was within a dataset's whole
   * lifetime -- "the layer" the button fits is the layer the user is actually looking at right now:
   * (dataset, filter generation), not (dataset) alone.
   */
  resetFitForNewGeneration(): void;
  /** N4 (viewport-residency cut P1b, G6 instrument): the CURRENT resident vertex/feature totals,
   * read directly off the same `ResidentSet` `pushBatch`/`clearStream` already maintain -- no new
   * counting logic, a read-only accessor. Reached only from the DEV-only `residencyEndStep` E2E hook
   * (`App.tsx`), never from product code. */
  getResidentCounts(): ResidentCounts;
  /** M1/M3/M7/S7 (viewport-residency cut P1b): arms a PERSISTENT `onAfterRender` render-tick hook on
   * THIS instance's `deck`, feeding `recordResidencyRenderTick` on every render observed while armed
   * -- see this file's own doc comment on `firstPixelArmedRef` for why this is exposed as a METHOD
   * (reached via `canvasRef.current` from `App.tsx`, which can poll for a live instance) rather than
   * self-registered inside a mount-scoped effect. Returns `false` (and arms nothing) if `deck` is not
   * yet initialized on THIS instance -- the caller's own signal to retry.
   *
   * **P1d B5 fix.** `watchdogMs` (self-restore deadline) is now the CALLER'S OWN choice, not a fixed
   * 5000 -- the original fixed 5s watchdog silently capped every armed measurement at 5s even when
   * the calling step's own declared settle timeout (`RESIDENCY-PREREGISTRATION.md` §7's per-step/
   * open-drain rows) allowed longer, e.g. the `open-drain` pre-step's 60s settle bound. Defaults to
   * 5000 when omitted, preserving the original ceiling for any caller that does not pass one. */
  armFirstPixelRenderHook(watchdogMs?: number): boolean;
  /** S7: disarms the hook `armFirstPixelRenderHook` installed, restoring `onAfterRender` to a real
   * no-op. Returns `true` iff disarmed BEFORE the arm's own (P1d B5: caller-chosen, no longer fixed)
   * watchdog fired (or nothing was ever armed -- vacuously clean), `false` iff the watchdog had
   * already fired and self-restored first. */
  disarmFirstPixelRenderHook(): boolean;

  /**
   * Viewport-residency cut P3w item B: the candidate arm's own ingest -- decode one batch and add
   * it to the TILE-KEYED resident set (`TileResidentSet`, a sibling of the baseline `ResidentSet`
   * `pushBatch` above uses), never called for the baseline arm (`App.tsx`'s candidate-only
   * construction branch is this method's only real caller). Cross-tile dedupe (item C) and
   * budget/eviction (item D) both happen here, via `tileIngest.ts`'s own pure `ingestTileBatch` --
   * this method never throws `ResidentVertexCeilingExceeded`/`PickCeilingExceeded` and never calls
   * `onCanvasRefusal`/`onResidentCeilingExceeded`: the candidate arm never raises the baseline's
   * declared-ceiling refusal (item B's own contract; P4 renders the over-budget state this method
   * only maintains via `TileViewportStreamManager.setOverBudget`, applied by the caller from this
   * method's own return value).
   */
  pushTileBatch(tileKey: string, streamHandle: string, batchSeq: number, ipcBytes: Uint8Array): TileBatchIngestOutcome;
  /** Drops one tile's residency -- per-tile supersede-on-pan, or an explicit eviction. Mirrors
   * `clearStream` above, tile-keyed instead of stream-keyed. */
  clearTile(tileKey: string): void;
  /** Wholesale candidate-arm residency clear (item A: "Filter changes ... still clear everything").
   * A dataset change instead remounts this whole `WorkingCanvas` instance (keyed on
   * `admitted.dataset`, `App.tsx`), discarding the `TileResidentSet` with it -- this method is only
   * needed for a filter change, which reuses the same instance. */
  clearAllTiles(): void;
  /** Whether `tileKey` is currently resident in the candidate-arm's own `TileResidentSet` -- backs
   * the `TileResidencyAccessor` `TileViewportStreamManager` needs at construction (`App.tsx`'s
   * candidate session). Deliberately NOT named `isTileResident` (the method this delegates to,
   * `TileResidentSet.isTileResident`, already has that exact name) -- `check:dist-clean`'s own
   * caller-checked identifier grep cannot distinguish "a call to THIS handle method" from "a call to
   * `TileResidentSet`'s own always-live method of the same name", so sharing the name would make
   * that check permanently, spuriously fail (found live writing this piece). */
  isTileResidentInCandidateSet(tileKey: string): boolean;
  /** Declares the tile grid frame/level this canvas instance's own eviction ordering should use --
   * called once, by `App.tsx`'s candidate session, immediately after
   * `TileViewportStreamManager.establishGridFrame` succeeds. Idempotent past the first call, mirroring
   * that method's own "no-op past the first call" contract. */
  establishTileGridContext(frame: TileGridFrame, level: TileGridLevel): void;
  /** Updates the "current viewport" context (the covering tile set + view centre) eviction ordering
   * and over-budget re-evaluation need -- called by `App.tsx`'s candidate session after every
   * `TileViewportStreamManager.onCameraChange`. Also re-attempts eviction against the NEW covering
   * set with zero incoming vertices (item B: "clear it when a later camera change fits within budget
   * again") and applies any eviction that succeeds. Returns whether current residency now fits within
   * `MAX_RESIDENT_VERTICES` -- the caller (`App.tsx`) uses this to clear `manager`'s own over-budget
   * flag when `true`.
   */
  applyTileViewportContext(coveringTileKeys: readonly string[], viewCentre: { x: number; y: number }): boolean;
}

/** `WorkingCanvasHandle.pushTileBatch`'s own return shape (viewport-residency cut P3w item B) --
 * mirrors `tileIngest.ts`'s own `TileBatchIngestResult`, plus the row count `App.tsx`'s eventual
 * scan-liveness/status wiring would need (kept here rather than importing `TileBatchIngestResult`
 * directly so this interface's own shape stays legible without a second file open). */
export interface TileBatchIngestOutcome {
  rowsAdmitted: number;
  duplicatesDropped: number;
  evictedTileKeys: string[];
  overBudget: boolean;
  /** Non-null once this canvas instance has ever admitted any geometry via `pushTileBatch` -- the
   * candidate session's own fit-anchor read, used to `establishGridFrame` exactly once, ever, per
   * dataset session (`tileGrid.ts`'s own top doc comment). */
  fitAnchor: AuthoritativeBbox | null;
}

/** N4: the shape `getResidentCounts` returns -- named and exported so `App.tsx`'s E2E wiring and
 * `e2e-test-surface.ts`'s hook type can both reference it without duplicating the field list. */
export interface ResidentCounts {
  totalResidentVertices: number;
  totalResidentFeatures: number;
}

/** `tileGrid.ts`'s own `tileKeyToString` is deliberately one-way ("there is no `tileKeyFromString`;
 * nothing needs to parse this back") -- `applyTileViewportContext`'s eviction ordering is one of the
 * few places that genuinely does, since `TileResidentSet` only ever stores the STRING form
 * (`tileIngest.ts`'s own identical local helper, duplicated rather than exported from `tileGrid.ts`
 * itself for the same reason that module states).
 *
 * P5f complex-gate must-fix 3: fails loudly on a non-`"row:col"` input -- see `tileIngest.ts`'s own
 * identical fix for the full account (the reserved `INITIAL_TILE_KEY` producing a `NaN` distance and
 * a nondeterministic eviction-order comparator artifact). `RESERVED_TILE_KEYS` below is the real fix
 * (this function is never actually called with that key any more); this throw is the loud safety net. */
function parseTileKey(key: string): TileKey {
  const parts = key.split(":");
  const row = parts.length === 2 ? Number(parts[0]) : NaN;
  const col = parts.length === 2 ? Number(parts[1]) : NaN;
  if (!Number.isFinite(row) || !Number.isFinite(col)) {
    throw new Error(`parseTileKey: not a "row:col" tile key: ${JSON.stringify(key)}`);
  }
  return { row, col };
}

/** P5f complex-gate must-fix 3: mirrors `tileIngest.ts`'s own identical constant -- the reserved-key
 * set `applyTileViewportContext`'s own `planTileEviction` call passes as `reservedTileKeys`. */
const RESERVED_TILE_KEYS: ReadonlySet<string> = new Set([INITIAL_TILE_KEY]);

export interface WorkingCanvasProps {
  /** Diagnostics-only (DECISIONS-PENDING.md entry 0's residency ledger): identifies this instance
   * in `[render-trace] canvas-lifecycle` lines. Not read for any rendering decision. */
  dataset: string;
  geometryColumn: string;
  onHover: (pick: PickResult | null) => void;
  /** A declared ceiling (`ResidentVertexCeilingExceeded`, `PickCeilingExceeded`) refused a batch for
   * `streamHandle`. This is a report, not an action: `limits.ts`'s own contract says the offending
   * stream must be *cancelled*, and only the caller (which owns the `ViewportStreamManager`) can
   * reach the SKP `cancel` command -- see `App.tsx`'s handler. */
  onCanvasRefusal: (streamHandle: string, message: string) => void;
  /** Fires only for `ResidentVertexCeilingExceeded` (never `PickCeilingExceeded`), alongside
   * `onCanvasRefusal` above, not instead of it -- rider 1 (DECISIONS-PENDING.md entry 0, option
   * (a)): the human's persistent "N of M features rendered — declared ceiling reached" status
   * indicator, which needs a count `onCanvasRefusal`'s bare message string does not carry.
   * `residentFeatureCount` is `ResidentSet.totalResidentFeatures` read at the moment of refusal --
   * i.e. *before* the refused batch's own features, since a refused batch adds nothing. */
  onResidentCeilingExceeded: (streamHandle: string, residentFeatureCount: number) => void;
  /** Fired after every settled view-state change (pan, zoom, or an origin recenter) with the
   * authoritative-CRS box the view now shows -- the caller drives `viewport_query` from this. */
  onViewportChanged: (bbox: AuthoritativeBbox) => void;
  /** `App.tsx`-owned style v0 state (ADR-017 §5a; ADR-022; NEXT-CUT.md P3) -- ephemeral, in-memory
   * only (no persistence anywhere; binding note 4). Mirrored via a ref (the same `onHoverRef`
   * pattern every other callback prop in this file already uses) and re-resolved on its own
   * `useEffect([style])`, below `applyStyleChange`'s own doc comment -- **never** on the same path a
   * batch or a viewport change renders through, so a style edit cannot accidentally piggyback a
   * query or a residency mutation it has no business touching. */
  style: StyleState;
}

const INITIAL_ZOOM = 0;

function pixelsPerMetreAtZoom(zoom: number): number {
  // deck.gl's OrthographicView: one world unit is 2^zoom CSS pixels -- the same units as
  // `canvas.clientWidth`/`clientHeight` below, not device (physical, DPR-scaled) pixels. A
  // HiDPI backing-store resolution changes what one CSS pixel costs in GPU samples, never what
  // one world unit costs in CSS pixels, so mixing the two in this function would be the error.
  return Math.pow(2, zoom);
}

function clampInt(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, Math.round(v)));
}

/** E2E TEST SURFACE helper (e2e/README.md): turns a raw RGBA `readPixels` buffer into a summary
 * small enough to cross CDP as JSON, without the raw buffer itself ever leaving the page. Pure and
 * DOM-free so it needs no dev-only guard of its own -- the `capturePixels` hook registered below is
 * the only caller within this module, and that registration is already gated; exported (S6,
 * reviewer round 2026-08-13) so `WorkingCanvas.test.ts` can assert the `samplePoint` logic directly
 * against a small synthetic buffer, without a DOM/WebGL harness this package does not carry. */
export function summarizePixels(buf: Uint8Array, width: number, height: number, regions: PixelRegion[]): PixelSummary {
  const totalPixels = width * height;
  let nonBackgroundCount = 0;
  let opaqueCount = 0;
  // Keyed by each channel quantized to 16 levels (value >> 4); one exact sample pixel AND the
  // drawing-buffer (x, y) it came from is kept per bin -- `topColors` reports the real color (not a
  // lossy quantized midpoint), and the frame-wide `samplePoint` below reuses the same per-bin
  // location for a real, read-back-confirmed hover target (2026-08-13) -- still one pass over `buf`,
  // no second walk of the pixel buffer added for either purpose.
  const bins = new Map<
    string,
    { count: number; sample: [number, number, number, number]; samplePoint: PixelSamplePoint }
  >();

  for (let i = 0; i < totalPixels; i++) {
    const o = i * 4;
    const r = buf[o];
    const g = buf[o + 1];
    const b = buf[o + 2];
    const a = buf[o + 3];
    if (r !== 0 || g !== 0 || b !== 0 || a !== 0) nonBackgroundCount++;
    if (a === 255) opaqueCount++;
    const key = `${r >> 4},${g >> 4},${b >> 4},${a >> 4}`;
    const bin = bins.get(key);
    if (bin) {
      bin.count++;
    } else {
      // `i`'s row-major decomposition is in the same buffer-native, row-0-is-bottom convention
      // `PixelRegion`'s own doc comment already declares -- this point is handed back exactly as
      // read, in buffer pixels; converting to CSS page coordinates is the caller's job, not this
      // module's (the E2E harness does that conversion itself, deliberately, per its own notes).
      bins.set(key, { count: 1, sample: [r, g, b, a], samplePoint: { x: i % width, y: Math.floor(i / width) } });
    }
  }

  const sortedBins = [...bins.values()].sort((x, y) => y.count - x.count);
  const topColors: PixelColorCount[] = sortedBins.slice(0, 8).map(({ count, sample }) => ({ rgba: sample.join(","), count }));
  const isBackgroundSample = (sample: [number, number, number, number]) =>
    sample[0] === 0 && sample[1] === 0 && sample[2] === 0 && sample[3] === 0;
  const densestNonBackgroundBin = sortedBins.find((bin) => !isBackgroundSample(bin.sample));
  const overallSamplePoint: PixelSamplePoint | null = densestNonBackgroundBin ? densestNonBackgroundBin.samplePoint : null;

  const regionSummaries: PixelRegionSummary[] = regions.map((region) => {
    const x0 = clampInt(region.x * width, 0, width);
    const y0 = clampInt(region.y * height, 0, height);
    const x1 = clampInt((region.x + region.w) * width, x0, width);
    const y1 = clampInt((region.y + region.h) * height, y0, height);
    let regionNonBackground = 0;
    let regionSamplePoint: PixelSamplePoint | null = null;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const o = (y * width + x) * 4;
        if (buf[o] !== 0 || buf[o + 1] !== 0 || buf[o + 2] !== 0 || buf[o + 3] !== 0) {
          regionNonBackground++;
          // First encountered wins -- no separate pass over this region's pixels beyond the one
          // already computing `regionNonBackground`, and "any" non-background pixel is exactly
          // what a hover target needs (unlike the frame-wide case above, a region small enough to
          // be worth sampling has no dominant-background risk to guard against with a histogram).
          if (regionSamplePoint === null) regionSamplePoint = { x, y };
        }
      }
    }
    return {
      x: region.x,
      y: region.y,
      w: region.w,
      h: region.h,
      nonBackgroundCount: regionNonBackground,
      totalPixels: (x1 - x0) * (y1 - y0),
      samplePoint: regionSamplePoint,
    };
  });

  return {
    width,
    height,
    totalPixels,
    nonBackgroundCount,
    opaqueCount,
    topColors,
    regions: regionSummaries,
    samplePoint: overallSamplePoint,
  };
}

/**
 * `applyStyleChange`'s own effect parameters -- named and exported (reviewer gate, style-panel cut
 * P7 fixes, S2) so `WorkingCanvas.test.ts` can pin its exact key set at compile time, not just
 * exercise one object literal a human happened to write. Exactly two keys, deliberately: there is no
 * viewport/manager/network member here to call even by mistake -- that absence IS binding note 7's
 * "no viewport query, no ticket, no debounce interaction" claim, structurally, not merely by
 * convention of what a test happens to assert. */
export interface ApplyStyleChangeDeps {
  setDrawParams: (params: ResolvedDrawParams) => void;
  render: () => void;
}

/**
 * The style-change re-render seam (NEXT-CUT.md binding note 7): given a new style, recomputes the
 * resolved draw parameters and calls `render` exactly once -- and reaches nothing else. Its own
 * signature is the structural half of "no viewport query, no ticket, no debounce interaction": there
 * is no viewport/manager/network parameter here to call even by mistake.
 *
 * Exported as a pure function, parameterized over its two effects (`setDrawParams`, `render`), for
 * the same DOM-free testability reason `summarizePixels` above already is (this file's own S6
 * comment) and `App.tsx`'s `admitAndResetStaleUiState`/`applyFilter`/etc. are: `WorkingCanvas`'s real
 * `Deck` construction needs a WebGL context jsdom does not provide (`WorkingCanvas.test.ts`'s own
 * established note), so this is the pure seam a unit test can actually drive without one.
 */
export function applyStyleChange(style: StyleState, deps: ApplyStyleChangeDeps): void {
  deps.setDrawParams(toResolvedDrawParams(resolveDrawParameters(style)));
  deps.render();
}

const WorkingCanvas = forwardRef<WorkingCanvasHandle, WorkingCanvasProps>(function WorkingCanvas(
  { dataset, geometryColumn, onHover, onCanvasRefusal, onResidentCeilingExceeded, onViewportChanged, style },
  ref
) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const deckRef = useRef<Deck<OrthographicView> | null>(null);
  const residentRef = useRef(new ResidentSet());
  /** Viewport-residency cut P3w item B: the candidate arm's own tile-keyed sibling of `residentRef`
   * -- always constructed (cheap, empty until ever used), but only ever WRITTEN to by
   * `pushTileBatch`/`clearTile`/`clearAllTiles`, which `App.tsx`'s candidate-only construction
   * branch is the sole caller of. `armRef` below (read once, at construction -- the arm is fixed for
   * a dataset session, `residencyArm.ts`'s own "refused while a dataset is open" contract) is what
   * `render()` uses to pick which of these two sets actually feeds `buildLayers`, so the baseline arm
   * never reads from this at all. */
  const tileResidentRef = useRef(new TileResidentSet());
  /** Read ONCE, at construction -- never re-read from `getResidencyArm()` on every render, since the
   * arm cannot change mid-session (`residencyArm.ts`'s own contract). For the baseline arm (the
   * default, and the only value the full vitest/E2E regression suites ever observe), every branch
   * this ref gates reduces to exactly the pre-P3w code path -- see `render()`'s own comment. */
  const armRef = useRef(getResidencyArm());
  /** Frame/level for the candidate arm's own eviction ordering (`tileIngest.ts`'s `ingestTileBatch`)
   * -- `null` until `establishTileGridContext` is called (once, by `App.tsx`'s candidate session,
   * right after `TileViewportStreamManager.establishGridFrame` succeeds). */
  const tileGridContextRef = useRef<TileGridContext | null>(null);
  /** The current viewport's own covering tile-key set -- eviction never drops a tile in here,
   * however far the budget overshoots (`planTileEviction`'s own "never evict the current viewport"
   * rule). Updated by `applyTileViewportContext`, read by `pushTileBatch`/`applyTileViewportContext`
   * itself. */
  const currentViewportTileKeysRef = useRef<ReadonlySet<string>>(new Set());
  /** The current viewport's own centre, authoritative-CRS -- `planTileEviction`'s own
   * farthest-first ordering measures distance from this. `{x:0,y:0}` before the first real viewport
   * change ever arrives (harmless: eviction never runs before any batch has pushed residency past
   * budget, which cannot happen before a real viewport has driven any tile planning at all). */
  const viewCentreRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const frameRef = useRef(new OffsetFrame(recenterThresholdForBudget(pixelsPerMetreAtZoom(INITIAL_ZOOM))));
  /** The style prop, already resolved to what `buildLayers` needs (deck.gl's 0-255 RGBA accessor
   * convention -- `buildLayers.ts`'s own `ResolvedDrawParams`). Initialized synchronously from the
   * INITIAL `style` prop (never left undefined for a window before the first effect commits, the
   * same eager-`useRef(new ...())` discipline `frameRef`/`residentRef` above already follow), then
   * refreshed ONLY by the `useEffect([style])` below, via `applyStyleChange` -- so every `render()`
   * call between two style changes (a batch arriving, a recenter) reuses the exact same
   * `ResolvedDrawParams` object, and therefore the exact same `fillColor` array reference, that
   * `buildLayers.ts`'s own doc comment relies on. */
  const drawParamsRef = useRef<ResolvedDrawParams>(toResolvedDrawParams(resolveDrawParameters(style)));
  /** Bbox of every ring vertex across every currently-resident batch, or `null` while nothing
   * resident carries any geometry. Kept in lockstep with `residentRef` -- grown in `pushBatch`,
   * recomputed from scratch in `clearStream` (a union has no inverse, so "shrink" means "refold"). */
  const residentExtentRef = useRef<AuthoritativeBbox | null>(null);
  /** Fix for the 2026-08-14 walkthrough A7 defect: the RUNNING UNION of every batch extent ever
   * admitted by this canvas instance, across its whole dataset-lifetime -- grown in `pushBatch`
   * exactly alongside `residentExtentRef`, but **never shrunk or recomputed in `clearStream`**.
   * That is precisely the moment "Zoom to layer" exists to rescue the user from (the operator's
   * own framing, 2026-08-14 walkthrough A7: the button must have a target when the user is lost --
   * that is its whole purpose), so a `null` `residentExtentRef` must not leave the button inert.
   *
   * **`fitToBounds` below fits ONLY this anchor now, unconditionally -- never `residentExtentRef`
   * (2026-08-14 same-day follow-up, operator live re-check).** The original fix used `resident ??
   * anchor` (prefer residency, fall back to the anchor); that made the button's fit outcome depend
   * on scroll history and in-flight refill timing (a second click during a refill window could see
   * different residency than the first, and jump somewhere visibly different) -- an operator
   * clicking a button meant to mean "take me to the layer" saw a different place each time, which
   * read as random. The anchor is provably a superset of whatever residency ever was (both grow
   * from the same `unionBbox(..., batchExtent)` call below), so fitting it unconditionally is both
   * safe and, once anything has ever loaded, deterministic across every click -- see `extent.ts`'s
   * `chooseFitTarget` for the full account.
   *
   * No reset code exists for this ref, deliberately: `App.tsx` keys `WorkingCanvas` on
   * `admitted.dataset`, so a dataset change unmounts this whole component instance and mounts a
   * fresh one with a fresh (empty) `fitAnchorRef` -- the anchor dies with the instance, never
   * leaking one dataset's extent into another's fit. */
  const fitAnchorRef = useRef<AuthoritativeBbox | null>(null);
  /** Has this canvas ever auto-fit the camera to arriving data. Sticky for the canvas's whole
   * lifetime (unlike the old `wasEmpty` check, which fired on "resident batch count is zero"): a
   * batch that carries no geometry -- an empty first batch, or one whose every feature is a null
   * geometry -- must not consume the one-shot auto-fit and leave every later batch, geometry and
   * all, rendering at whatever the frame origin defaulted to (the empty-canvas bug this replaces). */
  const hasAutoFitRef = useRef(false);
  /** Per-stream cumulative rows/vertices received -- diagnostic instrumentation only (Custodian
   * walkthrough finding), reset per stream handle since a superseded stream's batches are dropped
   * but its handle is never reused. */
  const streamStatsRef = useRef(new Map<string, { rows: number; vertices: number }>());
  /** M7 fix (viewport-residency cut P1b): the persistent per-step `onAfterRender` render-tick hook's
   * own armed/timeout state, held in REFS (not effect-scoped closure locals, P1's own original
   * shape) so `armFirstPixelRenderHook`/`disarmFirstPixelRenderHook` can be exposed as imperative
   * handle METHODS, reachable via `canvasRef.current` from `App.tsx`'s own TOP-LEVEL (persists across
   * every dataset admission, unlike this component) E2E hook registration. **Why this moved out of a
   * WorkingCanvas-owned `useEffect`, live-verified finding:** the M7 `open-drain` pre-step calls
   * `residencyArmFirstPixel` BEFORE `openFixture` -- i.e. before ANY `WorkingCanvas` instance has
   * ever mounted (a truly cold session) or while a PRIOR dataset's soon-to-unmount instance is still
   * live (a warm re-attach, e.g. this driver attaching to a session `e2e:regression` left running). A
   * hook registered INSIDE this component's own mount-scoped effect either does not exist yet (cold)
   * or arms the WRONG, about-to-be-torn-down `deck` instance (warm) -- confirmed live: a smoke run's
   * `open-drain` row showed `armDisarmedCleanly: true` (something WAS armed) but
   * `firstPixelReason: "no-paint"` despite 3 batches / 2000 features actually arriving and rendering
   * -- the arm target was the STALE instance's `deck`, not the new one `openFixture` was about to
   * create. Exposing these as ref-methods lets `App.tsx`'s hook poll `canvasRef.current` (always the
   * CURRENTLY mounted instance, or `null`) until a real, live `deck` exists, then arm THAT one. */
  const firstPixelArmedRef = useRef(false);
  const firstPixelTimedOutRef = useRef(false);
  const firstPixelWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The Deck instance is constructed once (empty deps below) and its callbacks close over these
  // props at that moment. Routing every prop through a ref -- read inside the callback, written on
  // every render -- is what keeps a parent's later re-render (a new `onHover` identity, say) from
  // being silently ignored for the canvas's whole lifetime.
  const onHoverRef = useRef(onHover);
  onHoverRef.current = onHover;
  const onCanvasRefusalRef = useRef(onCanvasRefusal);
  onCanvasRefusalRef.current = onCanvasRefusal;
  const onResidentCeilingExceededRef = useRef(onResidentCeilingExceeded);
  onResidentCeilingExceededRef.current = onResidentCeilingExceeded;
  const onViewportChangedRef = useRef(onViewportChanged);
  onViewportChangedRef.current = onViewportChanged;

  function render(): void {
    const deck = deckRef.current;
    if (!deck) return;
    begin("layer-construct");
    try {
      // Viewport-residency cut P3w item B: the candidate arm's `TileResidentSet` feeds the SAME
      // `buildLayers` path, unioning its own tile-keyed batches into the render layer set exactly as
      // `ResidentSet.getBatches()` already does for baseline -- no other change to this function, and
      // for the baseline arm (`armRef.current === "baseline"`, the only value the full vitest/E2E
      // regression suites ever observe) this ternary always takes the SAME branch it already did,
      // byte-identical.
      const batches: readonly ResidentBatch[] =
        armRef.current === "candidate" ? tileResidentRef.current.getBatches() : residentRef.current.getBatches();
      const layers = buildLayers(batches, frameRef.current, drawParamsRef.current);
      deck.setProps({ layers });
      // Vertex count actually handed to `getPolygon` this render, not a re-derivation from deck.gl's
      // own internal layer state -- the same total `buildLayers` fed the GPU from, computed once by
      // `decodeBatch` and carried on each `ResidentBatch` rather than re-walked here.
      const totalPositions = batches.reduce((sum, b) => sum + b.totalVertices, 0);
      traceLayerUpdate(layers.length, totalPositions);
    } finally {
      end("layer-construct");
    }
  }

  /** Reviewer gate, style-panel cut P7 fixes, S5: coalesces the style effect's own `render()` calls
   * to at most one per animation frame -- a continuous slider drag in the style panel (P4) fires an
   * `onChange`, and therefore this component's `[style]` effect below, once per input event, far
   * more often than once per frame; without this, each one re-tessellated the whole resident set
   * synchronously on the spot. `render` (just above) only ever reads refs, never component-scoped
   * state/props directly, so capturing it once here (the same eager-`useRef(new ...())` discipline
   * `residentRef`/`frameRef` above already use) behaves identically to capturing it fresh on every
   * render -- there is nothing for a stale closure to go stale ON. **No query/ticket/debounce
   * interaction of any kind** (binding note 7, unchanged by this fix): this coalesces WHEN the
   * existing `render()` call happens, never adds a new one, and reaches nothing viewport-shaped --
   * `render()` itself still does not, and this wrapper adds no new call site that could. */
  const coalescedRenderRef = useRef(coalesceOncePerFrame(render));

  /**
   * Recenters the frame origin on `bbox`'s midpoint and sets the camera zoom to fit the whole bbox
   * on screen (`extent.ts`'s `fitViewStateForBbox`) -- shared by the automatic fit-on-open (the
   * first time arriving data carries any geometry) and the manual "zoom to layer" affordance.
   *
   * Uses `OffsetFrame.forceRecenter`, not `maybeRecenter`: an explicit fit must always land exactly
   * on the requested point, never gated by the incidental-panning drift threshold.
   *
   * `notifyViewport` (2026-08-14 walkthrough A7 fix, second half -- coordinator-authorized
   * completion): when `true`, this also emits the fitted view's own authoritative bbox through
   * `onViewportChangedRef`, exactly as an interactive pan/zoom does (`extent.ts`'s `bboxForFit`,
   * reusing `computeAuthoritativeViewportBbox` -- the same computation, never reimplemented) --
   * driving `App.tsx`'s existing `onViewportChanged` -> debounced `requestViewport` -> supersede +
   * fresh ticketed stream pipeline, entirely unchanged downstream. This is what actually fetches
   * data for wherever the camera just jumped to; recentring the camera alone (this function's
   * pre-existing behavior) only re-renders whatever happens to already be resident there. Each call
   * site decides `notifyViewport` for itself -- see their own comments for why.
   */
  function fitToExtent(bbox: AuthoritativeBbox, notifyViewport: boolean): void {
    const canvas = canvasElRef.current;
    const widthPx = canvas?.clientWidth || 1;
    const heightPx = canvas?.clientHeight || 1;
    const fit = fitViewStateForBbox(bbox, widthPx, heightPx);
    const frame = frameRef.current;
    frame.forceRecenter(fit.centerX, fit.centerY);
    frame.setThreshold(recenterThresholdForBudget(pixelsPerMetreAtZoom(fit.zoom), RECENTER_BUDGET_PX));
    traceViewState(fit.target[0], fit.target[1], fit.zoom, frame.originX, frame.originY);
    // See this file's own doc comment: `initialViewState`, never `viewState`.
    deckRef.current?.setProps({ initialViewState: { target: [fit.target[0], fit.target[1], 0], zoom: fit.zoom } });
    render();
    if (notifyViewport) {
      // `frame.originX`/`frame.originY` read now, i.e. AFTER `forceRecenter` above moved them --
      // the post-recenter origin is what `bboxForFit`'s own doc comment requires to reconstruct the
      // fitted view's real bbox.
      onViewportChangedRef.current(bboxForFit(fit, frame.originX, frame.originY, widthPx, heightPx));
    }
  }

  /** Recomputes `residentExtentRef` from every batch actually resident right now -- called after
   * `clearStream` since a union has no inverse; the accumulated extent cannot simply be shrunk. */
  function recomputeResidentExtent(): void {
    residentExtentRef.current = residentRef.current
      .getBatches()
      .reduce<AuthoritativeBbox | null>((acc, b) => unionBbox(acc, extentOfBatch(b)), null);
  }

  /** M7 fix's own helpers -- see `firstPixelArmedRef`'s doc comment for why this state lives in refs
   * reachable from `armFirstPixelRenderHook`/`disarmFirstPixelRenderHook` rather than an effect
   * closure. Never restores `onAfterRender` to `undefined` -- same reason `capturePixels`' own
   * `restore` doesn't (this file's doc comment on that effect): deck.gl calls
   * `this.props.onAfterRender(...)` with no null-check once anything has ever set the prop. */
  function restoreFirstPixelHookToNoop(): void {
    deckRef.current?.setProps({ onAfterRender: () => {} });
    firstPixelArmedRef.current = false;
  }

  function clearFirstPixelWatchdog(): void {
    if (firstPixelWatchdogRef.current !== null) {
      clearTimeout(firstPixelWatchdogRef.current);
      firstPixelWatchdogRef.current = null;
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      pushBatch(streamHandle, batchSeq, ipcBytes) {
        begin("frame-decode");
        let batch: ReturnType<typeof decodeBatch>;
        try {
          batch = decodeBatch(streamHandle, batchSeq, ipcBytes, geometryColumn);
        } finally {
          end("frame-decode");
        }
        // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): DEV-only, right
        // where decode completes -- `firstByteToDecodedMs`'s own endpoint (`residencyInstrument.ts`'s
        // own `recordBatchDecoded` doc comment has the full pairing account with
        // `recordBatchArrived`, the manager-side hook this decode's own batch already passed through).
        if (isInstrumentedBuild()) {
          recordResidencyBatchDecoded();
        }

        // Ledger line logged before `addBatch`'s own ceiling check runs, so a refused attempt is
        // recorded too, not only an admitted one (DECISIONS-PENDING.md entry 0). `attemptedTotal`
        // is what `ResidentSet.addBatch` itself compares against `MAX_RESIDENT_VERTICES` -- the
        // same number whichever way the check goes, so no exception inspection is needed here.
        const residentTotalBefore = residentRef.current.totalResidentVertices;
        const attemptedTotal = residentTotalBefore + batch.totalVertices;
        traceResidency(
          "push",
          streamHandle,
          batchSeq,
          batch.totalVertices,
          residentTotalBefore,
          attemptedTotal,
          attemptedTotal > MAX_RESIDENT_VERTICES
        );

        // Viewport-residency cut P1b reviewer-gate remediation, M2: `recordResidencyBatch` now fires
        // on BOTH exit paths below (accepted AND refused), each passing its own `refused` boolean --
        // a single local closure so the DEV-gate/argument list is written once, not duplicated. Fixes
        // the P1 defect where a ceiling-refused batch was silently dropped from every counter (the
        // early `return 0` below used to exit before `recordResidencyBatch` was ever reached).
        function recordThisBatchForInstrument(refused: boolean): void {
          if (isInstrumentedBuild()) {
            recordResidencyBatch(batch.ids.length, ipcBytes.byteLength, refused);
          }
        }

        begin("buffer-build");
        try {
          residentRef.current.addBatch(batch);
        } catch (e) {
          end("buffer-build");
          if (e instanceof ResidentVertexCeilingExceeded || e instanceof PickCeilingExceeded) {
            logSessionEvent("canvas-refusal", e.message);
            onCanvasRefusalRef.current(streamHandle, e.message);
            if (e instanceof ResidentVertexCeilingExceeded) {
              // Read now, not after: `addBatch` above added nothing on refusal, so this is exactly
              // "resident features at the moment of refusal" -- rider 1's own definition.
              onResidentCeilingExceededRef.current(streamHandle, residentRef.current.totalResidentFeatures);
            }
            recordThisBatchForInstrument(true); // M2: decoded-and-refused, counted separately
            return 0; // nothing admitted -- see this method's own doc comment on the interface
          }
          throw e;
        }
        end("buffer-build");

        // Viewport-residency cut P1 (RESIDENCY-PREREGISTRATION.md §6, refill-work counters):
        // DEV-only, and gated a second time inside `recordResidencyBatch` itself (the instrument's
        // own `enabled` flag) -- see `instrument/residencyInstrument.ts`'s own top doc comment for
        // why the check is duplicated at every product call site rather than relied on solely
        // inside that module. `ipcBytes.byteLength` is the exact wire payload size this call
        // decoded, the same value `decodeBatch` was handed above -- never re-derived from
        // `batch.totalVertices` or any other post-decode figure.
        recordThisBatchForInstrument(false); // M2: decoded-and-accepted

        const stats = streamStatsRef.current.get(streamHandle) ?? { rows: 0, vertices: 0 };
        stats.rows += batch.ids.length;
        stats.vertices += batch.totalVertices;
        streamStatsRef.current.set(streamHandle, stats);
        traceStreamBatch(streamHandle, batchSeq, batch.ids.length, batch.totalVertices, stats.rows, stats.vertices);
        const preOffsetSample = batch.rings.find((r) => r.length > 0 && r[0].length > 0)?.[0]?.slice(0, 3);
        if (preOffsetSample) {
          tracePositionsSample("pre-offset", streamHandle, batchSeq, preOffsetSample);
        }

        // No dataset extent exists to aim the initial camera at (SKP-V0.md's C1: `describe` never
        // claims one), so the camera fits to the bbox of arriving data instead -- the first time
        // any arrives, not merely the first batch received (a batch can carry zero features, or
        // features whose geometry is entirely null; either must not consume the one-shot auto-fit
        // and leave every later batch invisible at whatever the frame origin defaulted to).
        const batchExtent = extentOfBatch(batch);
        residentExtentRef.current = unionBbox(residentExtentRef.current, batchExtent);
        // Grown in lockstep with `residentExtentRef` above, but never shrunk -- see `fitAnchorRef`'s
        // own doc comment for why this one ref intentionally never clears.
        fitAnchorRef.current = unionBbox(fitAnchorRef.current, batchExtent);
        if (!hasAutoFitRef.current && residentExtentRef.current) {
          hasAutoFitRef.current = true;
          // `notifyViewport: false` -- this data is already streaming in from the initial
          // unfiltered, unbounded `viewport_query` (`App.tsx`: issued immediately on open, before
          // any pan/zoom). Emitting a viewport-changed bbox here would feed straight into
          // `ViewportStreamManager.requestViewport`, which supersedes-on-pan (D2) the stream
          // currently delivering this very batch -- cancelling and re-issuing a fresh, narrower
          // query mid-flight, re-fetching everything already in transit. A real cost under D2-era
          // supersede semantics, not a hypothetical one.
          fitToExtent(residentExtentRef.current, false);
        }
        // Logged after any fit-triggered recenter above, so this reflects the origin `render()`
        // (right below) will actually use -- the comparison that matters is decode vs. what the GPU
        // sees, not decode vs. some origin already stale by the time of the next line.
        if (preOffsetSample) {
          const frame = frameRef.current;
          tracePositionsSample(
            "post-offset",
            streamHandle,
            batchSeq,
            preOffsetSample.map(([x, y]) => frame.toLocal(x, y))
          );
        }
        render();
        return batch.ids.length;
      },

      clearStream(streamHandle) {
        const before = residentRef.current.totalResidentVertices;
        residentRef.current.clearStream(streamHandle);
        const after = residentRef.current.totalResidentVertices;
        traceResidency("clear", streamHandle, null, before - after, before, after, false);
        recomputeResidentExtent();
        render();
      },

      fitToBounds() {
        // `chooseFitTarget` (extent.ts): ALWAYS the dataset-lifetime anchor, never current
        // residency -- see this method's own doc comment above and `chooseFitTarget`'s own doc
        // comment for why (2026-08-14 same-day follow-up: a residency-preferring fallback made the
        // fit outcome depend on scroll history and refill timing, which read as random to an
        // operator clicking a button meant to mean "take me to the layer," the same place every
        // time). Returns `false` only when nothing has ever been admitted.
        const bbox = chooseFitTarget(fitAnchorRef.current);
        if (!bbox) return false;
        // `notifyViewport: true` -- a user explicitly asked to go here (the second half of the
        // 2026-08-14 walkthrough A7 fix): the app must actually fetch what is at the fit target,
        // not merely move the camera to it. Most needed exactly when nothing is currently resident
        // (supersede-on-pan cleared everything) -- with nothing resident, there is nothing already
        // on screen for `render()` alone to redraw at the new camera position.
        fitToExtent(bbox, true);
        return true;
      },

      resetFitForNewGeneration() {
        fitAnchorRef.current = null;
        hasAutoFitRef.current = false;
      },

      getResidentCounts() {
        // Candidate arm (P3w): reads `tileResidentRef`'s own totals instead -- see `render()`'s
        // identical `armRef.current` ternary; for baseline this is byte-identical to before.
        if (armRef.current === "candidate") {
          return {
            totalResidentVertices: tileResidentRef.current.totalResidentVertices,
            totalResidentFeatures: tileResidentRef.current.totalResidentFeatures,
          };
        }
        return {
          totalResidentVertices: residentRef.current.totalResidentVertices,
          totalResidentFeatures: residentRef.current.totalResidentFeatures,
        };
      },

      armFirstPixelRenderHook(watchdogMs) {
        const deck = deckRef.current;
        if (!deck) return false;
        clearFirstPixelWatchdog();
        firstPixelTimedOutRef.current = false;
        firstPixelArmedRef.current = true;
        deck.setProps({
          onAfterRender: () => {
            if (!firstPixelArmedRef.current) return;
            // P1d B6a: gated at the call site, like every other reach into `residencyInstrument.ts`
            // from product code -- `armFirstPixelRenderHook` itself (this whole method) is always
            // compiled in (a real imperative-handle member, reachable in principle even in a
            // production build, `armFirstPixelRenderHook`'s own interface doc comment), so this was
            // previously the ONE call site into that module NOT wrapped in `import.meta.env.DEV`,
            // making `residencyInstrument.ts`'s own top doc comment's "every call site... is
            // additionally wrapped" claim false for exactly this closure. Wrapping it here restores
            // that claim and lets Vite's literal-`false` replacement + esbuild's minifier actually
            // dead-code-eliminate this reference in a production build, the same as every sibling
            // call site already does.
            if (isInstrumentedBuild()) {
              recordResidencyRenderTick();
            }
          },
        });
        // P1d B5: the self-restore deadline is the caller's own bound, not a fixed 5000 -- see this
        // method's own interface doc comment.
        firstPixelWatchdogRef.current = setTimeout(() => {
          firstPixelWatchdogRef.current = null;
          firstPixelTimedOutRef.current = true;
          restoreFirstPixelHookToNoop();
        }, watchdogMs ?? 5000);
        return true;
      },

      disarmFirstPixelRenderHook() {
        if (!firstPixelArmedRef.current && firstPixelWatchdogRef.current === null) {
          return !firstPixelTimedOutRef.current;
        }
        const disarmedBeforeTimeout = firstPixelWatchdogRef.current !== null;
        clearFirstPixelWatchdog();
        restoreFirstPixelHookToNoop();
        return disarmedBeforeTimeout;
      },

      // Viewport-residency cut P3w item B (candidate-arm ingest): never called for the baseline arm
      // -- `App.tsx`'s candidate-only construction branch is the sole real caller of every method
      // below. Decode/dedupe/eviction/budget logic itself lives in `tileIngest.ts`'s pure
      // `ingestTileBatch`; these methods are thin glue (decode, delegate, `render()`), the same
      // "extract the pure decision, keep the imperative handle thin" split `pushBatch` above already
      // could not follow (no WebGL-free way to test it) but this NEW logic can, and does
      // (`tileIngest.test.ts`).
      pushTileBatch(tileKey, streamHandle, batchSeq, ipcBytes) {
        begin("frame-decode");
        let batch: ReturnType<typeof decodeBatch>;
        try {
          batch = decodeBatch(streamHandle, batchSeq, ipcBytes, geometryColumn);
        } finally {
          end("frame-decode");
        }
        // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): DEV-only, the
        // same decode-complete hook `pushBatch` above carries, for this arm's own decode call.
        if (isInstrumentedBuild()) {
          recordResidencyBatchDecoded();
        }

        const outcome = ingestTileBatch({
          tileSet: tileResidentRef.current,
          tileKey,
          batch,
          grid: tileGridContextRef.current,
          viewportTileKeys: currentViewportTileKeysRef.current,
          viewCentre: viewCentreRef.current,
          maxResidentVertices: MAX_RESIDENT_VERTICES,
          priorExtent: fitAnchorRef.current,
          extentOfBatch,
          unionBbox,
        });
        // P5f complex-gate should-fix 6: gated behind the instrument's own enable (unlike every other
        // call in this file's `traceXxx` family, which stays always-on) -- `tile-ingest` is NOT one of
        // `residency-harness.mjs`'s own `FIELD_SEQUENCE_EVENTS` (`["viewport_query", "stream-issued",
        // "batch"]`), so gating it does not change what the dual-arm identity guard compares; it only
        // trims a high-volume line (one per tile batch) that non-instrumented builds never needed
        // console-visible in the first place, matching `recordResidencyBatchDecoded`'s own gate two
        // lines above.
        if (isInstrumentedBuild()) {
          traceTileIngest(tileKey, outcome.rowsAdmitted, outcome.duplicatesDropped, outcome.evictedTileKeys, outcome.overBudget);
        }
        // Viewport-residency cut P3i-c (gap G-B): mirrors `pushBatch`'s own `traceStreamBatch` call
        // above -- same always-on render-trace class, same DECODED (not post-dedupe/post-trim
        // admitted) `rows`/`vertices` convention, keyed into the SAME `streamStatsRef` map (stream
        // handles never collide across arms within one session, the arm is fixed at open). This is
        // the "batch arrival" trace line the identity guard's `FIELD_SEQUENCE_EVENTS` looks for;
        // `tileViewportStreamManager.ts`'s own `onBatch` sink only ever sees the raw, pre-decode
        // payload, so this is the earliest point in this arm's own path where real rows/vertices
        // exist to log -- the true equivalent moment to where `traceStreamBatch` already lives for
        // baseline (decode-complete, not manager-side mint).
        {
          const tileStats = streamStatsRef.current.get(streamHandle) ?? { rows: 0, vertices: 0 };
          tileStats.rows += batch.ids.length;
          tileStats.vertices += batch.totalVertices;
          streamStatsRef.current.set(streamHandle, tileStats);
          traceStreamBatch(streamHandle, batchSeq, batch.ids.length, batch.totalVertices, tileStats.rows, tileStats.vertices);
        }

        // P3w's own smoke-evidence wiring: the candidate arm never refuses a batch (item B), so this
        // is always `recordResidencyBatch(..., refused: false)` -- unlike `pushBatch`'s own
        // accepted/refused split above, there is no second branch here. `batch.ids.length` (not
        // `outcome.rowsAdmitted`) mirrors `pushBatch`'s own convention: DECODED counts, not
        // post-dedupe/post-trim admitted counts -- `recordResidencyBatch`'s own contract is "a batch
        // ResidentSet.addBatch actually admitted" for baseline, and the closest candidate-arm analogue
        // of "this batch was decoded and processed" is the batch as decoded, before this arm's own
        // dedupe/eviction/budget trimming. P3i (this piece) closes the gap the old version of this
        // comment named ("residencyInstrument.ts has no field for at all"): `outcome.duplicatesDropped`/
        // `outcome.evictedTileKeys.length` now feed `ResidencyStepCounters.duplicatesDropped`/
        // `.evictionsApplied` directly, this call's own pre-aggregated totals for this ONE batch.
        if (isInstrumentedBuild()) {
          recordResidencyBatch(batch.ids.length, ipcBytes.byteLength, false);
          recordResidencyDuplicatesDropped(outcome.duplicatesDropped);
          recordResidencyEvictionsApplied(outcome.evictedTileKeys.length);
        }

        // Same one-shot auto-fit `pushBatch` above performs, over the SAME `fitAnchorRef`/
        // `residentExtentRef`/`hasAutoFitRef` -- only one of `pushBatch`/`pushTileBatch` is ever
        // called in a given dataset session (the arm is fixed at open), so sharing these refs is
        // safe and is what lets `fitToBounds`/"Zoom to layer" keep working unchanged for both arms.
        fitAnchorRef.current = outcome.unionedExtent;
        residentExtentRef.current = outcome.unionedExtent;
        if (!hasAutoFitRef.current && residentExtentRef.current) {
          hasAutoFitRef.current = true;
          fitToExtent(residentExtentRef.current, false);
        }

        render();
        return {
          rowsAdmitted: outcome.rowsAdmitted,
          duplicatesDropped: outcome.duplicatesDropped,
          evictedTileKeys: outcome.evictedTileKeys,
          overBudget: outcome.overBudget,
          fitAnchor: outcome.unionedExtent,
        };
      },

      clearTile(tileKey) {
        tileResidentRef.current.evictTile(tileKey);
        render();
      },

      clearAllTiles() {
        tileResidentRef.current.clear();
        residentExtentRef.current = null;
        render();
      },

      isTileResidentInCandidateSet(tileKey) {
        return tileResidentRef.current.isTileResident(tileKey);
      },

      establishTileGridContext(frame, level) {
        if (tileGridContextRef.current !== null) return; // idempotent, mirrors establishGridFrame
        tileGridContextRef.current = { frame, level };
      },

      applyTileViewportContext(coveringTileKeys, viewCentre) {
        currentViewportTileKeysRef.current = new Set(coveringTileKeys);
        viewCentreRef.current = viewCentre;
        const grid = tileGridContextRef.current;
        const tileSet = tileResidentRef.current;
        if (!grid) return true; // nothing established yet -- nothing to have exceeded budget with
        const plan = planTileEviction({
          residentTileKeys: tileSet.residentTileKeys(),
          tileVertices: (k) => tileSet.tileVertexCount(k),
          viewportTileKeys: currentViewportTileKeysRef.current,
          incomingVertices: 0,
          currentTotalVertices: tileSet.totalResidentVertices,
          maxResidentVertices: MAX_RESIDENT_VERTICES,
          distanceToViewCentre: (k) => tileDistanceToPoint(grid.frame, grid.level, parseTileKey(k), viewCentre),
          reservedTileKeys: RESERVED_TILE_KEYS,
        });
        if (plan.evict.length > 0) {
          for (const key of plan.evict) tileSet.evictTile(key);
          render();
        }
        return !plan.overBudget;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geometryColumn]
  );

  // NEXT-CUT.md P3 / binding note 7: the ONLY effect this file runs on a style change. Fires on
  // mount too (React's own `useEffect` semantics) -- harmless, since `drawParamsRef` was already
  // initialized from this same `style` value above and `render()` is idempotent when nothing else
  // changed; `deckRef.current` may still be `null` at that first pass (the deck-init effect below is
  // declared after this one), in which case `render()`'s own `if (!deck) return;` no-ops and the
  // deck-init effect's own initial `layers: []` -- immediately superseded by this component's first
  // real `render()` once data/style are both in -- covers the frame that would otherwise be skipped.
  // Deliberately reaches NOTHING viewport-shaped: no `onViewportChangedRef`, no `frameRef` origin
  // move, no manager/ticket/debounce of any kind -- `applyStyleChange`'s own signature has no
  // parameter that could reach one.
  //
  // `setDrawParams` still runs SYNCHRONOUSLY, every call, ungated -- only the `render()` half is
  // coalesced (S5, above): `drawParamsRef.current` is always current by the time any coalesced frame
  // actually fires, whether that frame was scheduled by this call or an earlier one it coalesced
  // into. No new query/ticket/debounce interaction (binding note 7 still holds): coalescing changes
  // WHEN the already-existing `render()` call happens, never adds a call site that could reach one.
  useEffect(() => {
    applyStyleChange(style, {
      setDrawParams: (params) => {
        drawParamsRef.current = params;
      },
      render: () => coalescedRenderRef.current.schedule(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  // S5's own "cancel on cleanup": unmount-only (`[]` deps, not `[style]` -- cancelling on every
  // style change would defeat the coalescer's own no-op-while-pending logic for no benefit, since a
  // still-pending frame already reads fresh state whenever it fires). Prevents a scheduled frame
  // from calling `render()` after this component instance is gone (`render()`'s own `if (!deck)
  // return;` already guards the finalized-deck case, so this is belt-and-suspenders hygiene, not a
  // crash fix -- the same spirit as this file's other `return () => ...` cleanups).
  useEffect(() => {
    return () => coalescedRenderRef.current.cancel();
  }, []);

  // Diagnostics-only (DECISIONS-PENDING.md entry 0): names how many `WorkingCanvas` instances a
  // session actually mounted and which dataset each owned -- `App.tsx` keys this component on
  // `admitted.dataset`, so mount/unmount here is exactly a dataset-handle remount, never a plain
  // re-render.
  useEffect(() => {
    traceCanvasLifecycle("mount", dataset);
    return () => traceCanvasLifecycle("unmount", dataset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = canvasElRef.current;
    if (!canvas) return;

    begin("deck-init");
    const deck = new Deck({
      canvas,
      views: new OrthographicView({ id: "working", flipY: false }),
      initialViewState: { target: [0, 0, 0], zoom: INITIAL_ZOOM },
      controller: true,
      layers: [],
      onLoad: () => end("deck-init"),
      onViewStateChange: ({ viewState }) => {
        const vs = viewState as { target: [number, number, number]; zoom: number };
        const frame = frameRef.current;
        frame.setThreshold(recenterThresholdForBudget(pixelsPerMetreAtZoom(vs.zoom), RECENTER_BUDGET_PX));
        traceViewState(vs.target[0], vs.target[1], vs.zoom, frame.originX, frame.originY);

        // Captured *before* any recenter below: `vs.target` is a local-frame value produced
        // relative to *this* origin, and combining it with any other origin is exactly the
        // untagged-frame hazard ADR-010 rule 1 names ("a value that does not carry its space's tag
        // does not leave the module that produced it" -- an origin is that tag, here).
        const originXBeforeRecenter = frame.originX;
        const originYBeforeRecenter = frame.originY;
        const worldX = vs.target[0] + originXBeforeRecenter;
        const worldY = vs.target[1] + originYBeforeRecenter;

        if (frame.maybeRecenter(worldX, worldY)) {
          // The origin moved. Keep the camera visually anchored on the same authoritative point by
          // re-expressing it in the new local frame and snapping deck's own uncontrolled view state
          // to it (see this file's top doc comment for why `initialViewState` is what does that).
          const [localX, localY] = frame.toLocal(worldX, worldY);
          deckRef.current?.setProps({ initialViewState: { target: [localX, localY, 0], zoom: vs.zoom } });
          render();
        }

        onViewportChangedRef.current(
          computeAuthoritativeViewportBbox({
            targetX: vs.target[0],
            targetY: vs.target[1],
            zoom: vs.zoom,
            widthPx: canvas.clientWidth,
            heightPx: canvas.clientHeight,
            originX: originXBeforeRecenter,
            originY: originYBeforeRecenter,
          })
        );
      },
      onHover: (info: PickingInfo) => {
        // rule 1: deck.gl's own unprojected pick coordinate is never read, here or anywhere else.
        if (info.index === undefined || info.index < 0 || !info.layer) {
          onHoverRef.current(null);
          return;
        }
        const batch = batchForLayerId(residentRef.current.getBatches(), info.layer.id);
        onHoverRef.current(batch ? resolvePick(batch, info.index) : null);
      },
      onError: (error: Error) => {
        // ADR-010 rule 7: deck.gl's own render-loop failures must not vanish into the console --
        // they reach the same global handling every other unhandled error does. Declared recovery
        // policy is `none`, so this rethrows rather than trying to keep the loop alive.
        logSessionEvent("deckgl-error", error.message);
        throw error;
      },
    });
    deckRef.current = deck;

    return () => {
      deck.finalize();
      deckRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // E2E TEST SURFACE (dev builds only, e2e/README.md): reads the just-rendered frame back with the
  // ADR-003 spike's technique (spikes/adr-003-crs-rendering/app/src/m4-editing.ts) -- a one-shot
  // `onAfterRender` that reads the framebuffer, then a forced `redraw` to produce a frame to read.
  // Reaches `canvasElRef`/`deckRef` only inside the registered closure, at call time, so it does
  // not need to re-run when either ref's *contents* change -- only once, alongside construction.
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let captureInFlight = false;

    async function capturePixels(regions?: PixelRegion[]): Promise<PixelSummary> {
      if (captureInFlight) {
        throw new Error("capturePixels: a capture is already in flight");
      }
      const canvas = canvasElRef.current;
      const deck = deckRef.current;
      if (!canvas || !deck) {
        throw new Error("capturePixels: canvas or Deck instance is not mounted");
      }
      // luma.gl already created this canvas's WebGL2 context; per the HTML spec a canvas can carry
      // only one context, so `getContext` here is always a lookup of that same context, never a
      // competing creation.
      const gl = canvas.getContext("webgl2");
      if (!gl) {
        throw new Error("capturePixels: canvasElRef.current.getContext('webgl2') returned null");
      }

      captureInFlight = true;
      try {
        return await new Promise<PixelSummary>((resolve, reject) => {
          let settled = false;
          // Never restores to `undefined`: `_drawLayers` in the installed @deck.gl/core@9.3.7
          // calls `this.props.onAfterRender(...)` with no null-check, so an unset prop throws on
          // this canvas's very next render -- a fresh noop is the only safe "off" state.
          const restore = () => deck.setProps({ onAfterRender: () => {} });

          const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            restore();
            reject(new Error("capturePixels: no frame rendered within 5000ms"));
          }, 5000);

          deck.setProps({
            onAfterRender: () => {
              if (settled) return;
              settled = true;
              clearTimeout(timer);
              restore();
              const width = gl.drawingBufferWidth;
              const height = gl.drawingBufferHeight;
              const buf = new Uint8Array(width * height * 4);
              gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buf);
              resolve(summarizePixels(buf, width, height, regions ?? []));
            },
          });
          // Reviewer gate, style-panel cut P7 fixes, S5 correction: a style change's own render is
          // now coalesced to at most once per animation frame (`coalesceOncePerFrame`), which can
          // leave `deck.props.layers` one frame stale relative to the LATEST style at the exact
          // moment this OUT-OF-BAND capture runs (a real user never notices -- the browser's own
          // next paint always carries a pending frame regardless -- but this hook forces a redraw
          // right now, outside that normal timing). `flush()` applies any pending coalesced render
          // synchronously, first, so `deck.props.layers` always reflects the current style by the
          // time the redraw below runs -- see `coalesceOncePerFrame.ts`'s own doc comment.
          coalescedRenderRef.current.flush();
          // **A second, deeper gap `flush()` alone does not close, found and fixed investigating a
          // real S5-introduced test failure (verified against the installed
          // `@deck.gl/core@9.3.9` source, `lib/deck.js`/`lib/layer-manager.js`, not assumed).**
          // `deck.props.layers` being current is not the same fact as the GPU's own attribute
          // buffers being current: `LayerManager.updateLayers()` (which recomputes a layer's GPU
          // buffers from its own current props -- e.g. `getFillColor` -- via each layer's
          // `updateState`) is called ONLY from `Deck._onRenderFrame()`, deck's own internal
          // `requestAnimationFrame`-driven loop; `Deck.redraw()` -> `_drawLayers()` draws whatever
          // is CURRENTLY in the GPU buffers and does NOT call `updateLayers()` first. Before this
          // file coalesced style renders, `render()`'s own `setProps({layers})` call (synchronous,
          // inside `useEffect([style])`) was always separated from this hook's own forced `redraw()`
          // by real wall-clock time (a CDP round trip, a poll interval) comfortably longer than one
          // animation frame -- long enough that deck's own natural loop had ALREADY run
          // `updateLayers()` by the time this hook's `redraw()` fired, so the gap was never visible.
          // `flush()` collapses that gap deliberately (that is its whole job for the render itself),
          // which also collapses the accidental timing margin that used to hide this one -- a forced
          // `redraw()` immediately after `flush()` could draw brand-new layer PROPS through STALE
          // GPU BUFFERS, reading back the previous colour. `layerManager` is `protected` in the
          // installed type declarations (an internal API, not exposed for general use) but is a
          // real, safely-idempotent method at runtime (`updateLayers()`'s own source: a no-op unless
          // `needsUpdate()` finds a real reason) -- reached here, narrowly, only in this dev-only E2E
          // instrument, not anywhere in product code.
          (deck as unknown as { layerManager: { updateLayers: () => void } }).layerManager.updateLayers();
          // A non-empty reason bypasses `needsRedraw` and draws synchronously (`@deck.gl/core`'s
          // `redraw()`), so in the common case `onAfterRender` above has already fired by the time
          // this call returns. The only path that reaches the timeout above is `layerManager` not
          // yet existing (`redraw()` silently no-ops then) -- exactly "never rendered a frame".
          deck.redraw("e2e-capture");
        });
      } finally {
        captureInFlight = false;
      }
    }

    registerE2eHook("capturePixels", capturePixels);
    return () => unregisterE2eHook("capturePixels");
  }, []);

  // E2E TEST SURFACE (dev builds only, e2e/README.md): viewport-residency cut P1c,
  // RESIDENCY-PREREGISTRATION.md §12 Amendment 6 -- the instrument-identity guard's own
  // deterministic camera seam. **NEVER reached by a measured cell** -- every measured-cell step
  // (`residency-harness.mjs`'s own `applyStep`) still drives a real synthetic pointer/wheel gesture
  // over `.working-canvas`, exactly as P1b left it; this seam exists ONLY for the identity mode's
  // own literal camera script (`residencyTrace.mjs`'s `IDENTITY_VIEW_STATE_STEPS`), and the driver
  // asserts that restriction itself via `e2eSetViewStateCallCount` below, never merely by
  // convention.
  //
  // Reuses the EXACT primitives `fitToExtent`/the real interactive `onViewStateChange` handler
  // already use -- `OffsetFrame.forceRecenter`, deck's own uncontrolled `initialViewState` (this
  // file's own top doc comment on why `initialViewState`, never `viewState`), and
  // `onViewportChangedRef` (the SAME choke point a real pan/zoom or "zoom to layer" click reaches,
  // `App.tsx`'s `onViewportChanged` -> debounced `requestViewport`) -- there is no second, parallel
  // query-issuing path here, only a different way of producing the camera pose that feeds the SAME
  // one. Unlike `fitToExtent`, there is no bbox to fit here -- the caller supplies the exact
  // world-space (authoritative-CRS) target and zoom directly.
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let e2eSetViewStateCallCount = 0;

    async function applyDeterministicE2eViewState(targetX: number, targetY: number, zoom: number): Promise<boolean> {
      e2eSetViewStateCallCount++;
      const canvas = canvasElRef.current;
      const deck = deckRef.current;
      if (!canvas || !deck) return false;
      const widthPx = canvas.clientWidth || 1;
      const heightPx = canvas.clientHeight || 1;
      const frame = frameRef.current;
      frame.forceRecenter(targetX, targetY);
      frame.setThreshold(recenterThresholdForBudget(pixelsPerMetreAtZoom(zoom), RECENTER_BUDGET_PX));
      traceViewState(0, 0, zoom, frame.originX, frame.originY);
      // See this file's own doc comment: `initialViewState`, never `viewState`.
      deck.setProps({ initialViewState: { target: [0, 0, 0], zoom } });
      render();
      onViewportChangedRef.current(
        bboxForFit({ target: [0, 0], zoom, centerX: targetX, centerY: targetY }, frame.originX, frame.originY, widthPx, heightPx)
      );
      return true;
    }

    registerE2eHook("e2eSetViewState", applyDeterministicE2eViewState);
    registerE2eHook("e2eSetViewStateCallCount", async () => e2eSetViewStateCallCount);
    return () => {
      unregisterE2eHook("e2eSetViewState");
      unregisterE2eHook("e2eSetViewStateCallCount");
    };
  }, []);

  // M1/M3/M7/S7 (viewport-residency cut P1b): the persistent per-step render-tick hook itself is now
  // `armFirstPixelRenderHook`/`disarmFirstPixelRenderHook` on the imperative handle above (see
  // `firstPixelArmedRef`'s own doc comment for the live-verified remount race that moved it there
  // from a self-registered E2E hook) -- `App.tsx`'s persistent top-level effect is what registers
  // `residencyArmFirstPixel`/`residencyDisarmFirstPixel` and proxies to whichever `WorkingCanvas`
  // instance is CURRENTLY mounted. This unmount cleanup only guards against a leaked watchdog timer
  // outliving this instance (belt-and-suspenders, matching this file's other `return () => ...`
  // cleanups) -- `restoreFirstPixelHookToNoop`'s own `deckRef.current?.` guard already makes calling
  // it after `deck.finalize()` harmless regardless.
  useEffect(() => {
    return () => clearFirstPixelWatchdog();
  }, []);

  return (
    <canvas
      ref={canvasElRef}
      className="working-canvas"
      data-pick-ceiling={DECKGL_PICK_INDEX_CEILING}
    />
  );
});

export default WorkingCanvas;
