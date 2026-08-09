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

/**
 * The working canvas — deck.gl `OrthographicView` in the dataset's source CRS (ADR-010 rules 1, 2,
 * 3, 6, 7; architect review, `frontends/shell` cut 1, D3.1–D3.6). One fixed default style; no style
 * panel exists anywhere in this tree (NEXT-CUT.md).
 *
 * **deck.gl's own unprojected pick coordinate is never read anywhere in this module.** Rule 1: it
 * is a renderer-local value with no CRS tag, and the only authoritative coordinate a pick may
 * report is looked up through `resolvePick` from the same buffers a layer was built from. See
 * `PICKING.md` in this directory.
 */

export interface WorkingCanvasHandle {
  /** Decode one Arrow IPC batch and add it to the canvas. Called by the streaming layer as
   * data-plane batches arrive. Silently declines (after logging + `onCanvasRefusal`) if it would
   * cross a declared ceiling — it does not throw into the caller's event loop. */
  pushBatch(streamHandle: string, batchSeq: number, ipcBytes: Uint8Array): void;
  /** Drops every resident batch belonging to a superseded or closed stream. */
  clearStream(streamHandle: string): void;
  /** Fit the view to an authoritative f64 point — used once, when the first batch of a fresh
   * dataset arrives, to put the camera somewhere the data actually is. */
  centerOn(x: number, y: number): void;
}

export interface WorkingCanvasProps {
  geometryColumn: string;
  onHover: (pick: PickResult | null) => void;
  onCanvasRefusal: (streamHandle: string, message: string) => void;
}

const INITIAL_ZOOM = 0;

function pixelsPerMetreAtZoom(zoom: number): number {
  // deck.gl's OrthographicView: one world unit is 2^zoom device pixels.
  return Math.pow(2, zoom);
}

const WorkingCanvas = forwardRef<WorkingCanvasHandle, WorkingCanvasProps>(function WorkingCanvas(
  { geometryColumn, onHover, onCanvasRefusal },
  ref
) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const deckRef = useRef<Deck<OrthographicView> | null>(null);
  const residentRef = useRef(new ResidentSet());
  const frameRef = useRef(new OffsetFrame(recenterThresholdForBudget(pixelsPerMetreAtZoom(INITIAL_ZOOM))));

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

        begin("buffer-build");
        try {
          residentRef.current.addBatch(batch);
        } catch (e) {
          end("buffer-build");
          if (e instanceof ResidentVertexCeilingExceeded || e instanceof PickCeilingExceeded) {
            logSessionEvent("canvas-refusal", e.message);
            onCanvasRefusal(streamHandle, e.message);
            return;
          }
          throw e;
        }
        end("buffer-build");
        render();
      },

      clearStream(streamHandle) {
        residentRef.current.clearStream(streamHandle);
        render();
      },

      centerOn(x, y) {
        const frame = frameRef.current;
        frame.maybeRecenter(x, y);
        const deck = deckRef.current;
        if (deck) {
          deck.setProps({ viewState: { target: [0, 0, 0], zoom: INITIAL_ZOOM } });
        }
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
      viewState: { target: [0, 0, 0], zoom: INITIAL_ZOOM },
      controller: true,
      layers: [],
      onLoad: () => end("deck-init"),
      onViewStateChange: ({ viewState }) => {
        const vs = viewState as { target: [number, number, number]; zoom: number };
        const frame = frameRef.current;
        frame.setThreshold(recenterThresholdForBudget(pixelsPerMetreAtZoom(vs.zoom), RECENTER_BUDGET_PX));
        const worldX = vs.target[0] + frame.originX;
        const worldY = vs.target[1] + frame.originY;
        if (frame.maybeRecenter(worldX, worldY)) {
          render();
        }
      },
      onHover: (info: PickingInfo) => {
        // rule 1: deck.gl's own unprojected pick coordinate is never read, here or anywhere else.
        if (info.index === undefined || info.index < 0 || !info.layer) {
          onHover(null);
          return;
        }
        const batch = batchForLayerId(residentRef.current.getBatches(), info.layer.id);
        onHover(batch ? resolvePick(batch, info.index) : null);
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
