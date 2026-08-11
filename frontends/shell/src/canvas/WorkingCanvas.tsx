import { Deck, OrthographicView, PickingInfo } from "@deck.gl/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { logSessionEvent } from "../diagnostics/log";
import {
  traceLayerUpdate,
  tracePositionsSample,
  traceStreamBatch,
  traceViewState,
} from "../diagnostics/renderTrace";
import { begin, end } from "../diagnostics/watchdog";
import { batchForLayerId, buildLayers } from "./buildLayers";
import { decodeBatch } from "./decodeBatch";
import { extentOfBatch, fitViewStateForBbox, unionBbox } from "./extent";
import { DECKGL_PICK_INDEX_CEILING, PickCeilingExceeded, ResidentVertexCeilingExceeded } from "./limits";
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
  /** Re-fit the camera to the bbox of everything currently resident ("zoom to layer"). A no-op
   * (returns `false`) when nothing is resident -- there is no bbox to fit to yet. */
  fitToBounds(): boolean;
}

export interface WorkingCanvasProps {
  geometryColumn: string;
  onHover: (pick: PickResult | null) => void;
  /** A declared ceiling (`ResidentVertexCeilingExceeded`, `PickCeilingExceeded`) refused a batch for
   * `streamHandle`. This is a report, not an action: `limits.ts`'s own contract says the offending
   * stream must be *cancelled*, and only the caller (which owns the `ViewportStreamManager`) can
   * reach the SKP `cancel` command -- see `App.tsx`'s handler. */
  onCanvasRefusal: (streamHandle: string, message: string) => void;
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

const WorkingCanvas = forwardRef<WorkingCanvasHandle, WorkingCanvasProps>(function WorkingCanvas(
  { geometryColumn, onHover, onCanvasRefusal, onViewportChanged },
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
   */
  function fitToExtent(bbox: AuthoritativeBbox): void {
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

        begin("buffer-build");
        try {
          residentRef.current.addBatch(batch);
        } catch (e) {
          end("buffer-build");
          if (e instanceof ResidentVertexCeilingExceeded || e instanceof PickCeilingExceeded) {
            logSessionEvent("canvas-refusal", e.message);
            onCanvasRefusalRef.current(streamHandle, e.message);
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
        if (!hasAutoFitRef.current && residentExtentRef.current) {
          hasAutoFitRef.current = true;
          fitToExtent(residentExtentRef.current);
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
        residentRef.current.clearStream(streamHandle);
        recomputeResidentExtent();
        render();
      },

      fitToBounds() {
        const bbox = residentExtentRef.current;
        if (!bbox) return false;
        fitToExtent(bbox);
        return true;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geometryColumn]
  );

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

  return (
    <canvas
      ref={canvasElRef}
      className="working-canvas"
      data-pick-ceiling={DECKGL_PICK_INDEX_CEILING}
    />
  );
});

export default WorkingCanvas;
