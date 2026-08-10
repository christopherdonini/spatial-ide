import { Deck, OrthographicView, PickingInfo } from "@deck.gl/core";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { logSessionEvent } from "../diagnostics/log";
import { begin, end } from "../diagnostics/watchdog";
import { batchForLayerId, buildLayers } from "./buildLayers";
import { decodeBatch } from "./decodeBatch";
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
      const layers = buildLayers(residentRef.current.getBatches(), frameRef.current);
      deck.setProps({ layers });
    } finally {
      end("layer-construct");
    }
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

        // No dataset extent exists to aim the initial camera at (SKP-V0.md's C1: `describe` never
        // claims one). The first feature of the first batch ever received is the closest thing to
        // "where the data is", so the frame recenters on it and the view snaps there -- this is
        // what lets "open a dataset" actually show something without the operator first guessing
        // where in an unbounded plane to pan to.
        const wasEmpty = residentRef.current.getBatches().length === 0;

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

        if (wasEmpty) {
          const anchor = batch.rings.find((r) => r.length > 0 && r[0].length > 0)?.[0]?.[0];
          if (anchor) {
            const frame = frameRef.current;
            frame.maybeRecenter(anchor[0], anchor[1]);
            // See this file's own doc comment: `initialViewState`, never `viewState`.
            deckRef.current?.setProps({ initialViewState: { target: [0, 0, 0], zoom: INITIAL_ZOOM } });
          }
        }
        render();
      },

      clearStream(streamHandle) {
        residentRef.current.clearStream(streamHandle);
        render();
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
