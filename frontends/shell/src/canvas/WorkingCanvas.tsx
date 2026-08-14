import { Deck, OrthographicView, PickingInfo } from "@deck.gl/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import type { PixelColorCount, PixelRegion, PixelRegionSummary, PixelSamplePoint, PixelSummary } from "../e2e-test-surface";
import { logSessionEvent } from "../diagnostics/log";
import {
  traceCanvasLifecycle,
  traceLayerUpdate,
  tracePositionsSample,
  traceResidency,
  traceStreamBatch,
  traceViewState,
} from "../diagnostics/renderTrace";
import { begin, end } from "../diagnostics/watchdog";
import { batchForLayerId, buildLayers } from "./buildLayers";
import { decodeBatch } from "./decodeBatch";
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
import { AuthoritativeBbox, computeAuthoritativeViewportBbox } from "./viewportBbox";

/**
 * The working canvas — deck.gl `OrthographicView` in the dataset's source CRS (ADR-010 rules 1, 2,
 * 3, 6, 7; architect review, `frontends/shell` cut 1, D3.1–D3.6). One fixed default style; no style
 * panel exists anywhere in this tree (NEXT-CUT.md).
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
   * boundary is built to turn into a terminal frame, not something this method can recover from. */
  pushBatch(streamHandle: string, batchSeq: number, ipcBytes: Uint8Array): void;
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
}

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

const WorkingCanvas = forwardRef<WorkingCanvasHandle, WorkingCanvasProps>(function WorkingCanvas(
  { dataset, geometryColumn, onHover, onCanvasRefusal, onResidentCeilingExceeded, onViewportChanged },
  ref
) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const deckRef = useRef<Deck<OrthographicView> | null>(null);
  const residentRef = useRef(new ResidentSet());
  const frameRef = useRef(new OffsetFrame(recenterThresholdForBudget(pixelsPerMetreAtZoom(INITIAL_ZOOM))));
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
      const batches = residentRef.current.getBatches();
      const layers = buildLayers(batches, frameRef.current);
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

  useImperativeHandle(
    ref,
    () => ({
      pushBatch(streamHandle, batchSeq, ipcBytes) {
        begin("frame-decode");
        let batch;
        try {
          batch = decodeBatch(streamHandle, batchSeq, ipcBytes, geometryColumn);
        } finally {
          end("frame-decode");
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
            return;
          }
          throw e;
        }
        end("buffer-build");

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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geometryColumn]
  );

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

  return (
    <canvas
      ref={canvasElRef}
      className="working-canvas"
      data-pick-ceiling={DECKGL_PICK_INDEX_CEILING}
    />
  );
});

export default WorkingCanvas;
