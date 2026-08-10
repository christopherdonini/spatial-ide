import { useEffect, useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import { FormattedRefusal, formatRefusal } from "./admission/formatRefusal";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import ErrorBanner from "./ErrorBanner";
import { encodeHexF64 } from "./skp/codec";
import { closeDataset, SkpCallError } from "./skp/client";
import type { Bbox } from "./skp/types";
import { ViewportStreamManager } from "./streaming/viewportStreamManager";

function toWireBbox(bbox: AuthoritativeBbox): Bbox {
  return {
    xmin: encodeHexF64(bbox.xmin),
    ymin: encodeHexF64(bbox.ymin),
    xmax: encodeHexF64(bbox.xmax),
    ymax: encodeHexF64(bbox.ymax),
  };
}

/**
 * Cut 1's whole shell: an admission flow, a working canvas, and viewport-driven streaming with
 * supersede-on-pan (`docs/07` Prototype-completion arc). No style panel, no publish affordance --
 * neither exists anywhere in this tree, not even as a disabled control (NEXT-CUT.md's own
 * constraint).
 */
export default function App() {
  const [admitted, setAdmitted] = useState<Admitted | null>(null);
  const [hover, setHover] = useState<PickResult | null>(null);
  const [canvasRefusal, setCanvasRefusal] = useState<string | null>(null);
  const [viewportRefusal, setViewportRefusal] = useState<FormattedRefusal | null>(null);
  const canvasRef = useRef<WorkingCanvasHandle>(null);
  const managerRef = useRef<ViewportStreamManager | null>(null);

  useEffect(() => {
    if (!admitted) {
      managerRef.current = null;
      return;
    }

    const manager = new ViewportStreamManager({
      dataset: admitted.dataset,
      onBatch: (streamHandle, batchSeq, payload) => {
        canvasRef.current?.pushBatch(streamHandle, batchSeq, payload);
      },
      onSuperseded: (streamHandle) => {
        canvasRef.current?.clearStream(streamHandle);
      },
    });
    managerRef.current = manager;

    async function issueViewportQuery(bbox: Bbox | null, bboxCrs: string | null) {
      try {
        await manager.requestViewport(bbox, bboxCrs);
        setViewportRefusal(null);
      } catch (e) {
        // A typed engine refusal (e.g. `engine.no_covering_bbox` on a file with no covering-bbox
        // column) is product truth the same way an admission refusal is -- it must render with its
        // own code and message, not surface as a generic "Unhandled promise rejection" banner.
        if (e instanceof SkpCallError) {
          setViewportRefusal(formatRefusal(e.skpError));
          return;
        }
        throw e; // an unexpected failure still reaches the ADR-010 rule 7 handlers
      }
    }

    // The first look is unfiltered: `describe` establishes no dataset extent to aim a viewport at
    // (SKP-V0.md's C1), so the canvas's own auto-recenter-on-first-batch is what puts the camera
    // somewhere the data actually is.
    void issueViewportQuery(null, null);

    return () => {
      void manager.stop();
      // Every admitted dataset stays open (and its DuckDB pool resident) until explicitly closed;
      // opening a second one must not leak the first (S1, architect review of this cut).
      void closeDataset(admitted.dataset).catch(() => {});
      managerRef.current = null;
    };
    // `issueViewportQuery` is intentionally defined and used only inside this effect -- it closes
    // over `manager`, which is itself effect-local, so it is not a dependency of anything outside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admitted]);

  return (
    <div className="app">
      <ErrorBanner />
      <header className="app-header">Spatial IDE</header>
      <main className="app-main">
        <AdmissionPanel onAdmitted={setAdmitted} />
        {admitted && (
          <div className="canvas-container">
            <WorkingCanvas
              ref={canvasRef}
              geometryColumn={admitted.describe.geometry.column}
              onHover={setHover}
              onCanvasRefusal={(streamHandle, message) => {
                setCanvasRefusal(message);
                // limits.ts's own declared remedy is "cancel the offending stream", not just "show
                // a message" -- a batch that already crossed a ceiling must not keep the stream
                // running to consume more credit and more connection capacity for nothing.
                void managerRef.current?.cancelStream(streamHandle);
              }}
              onViewportChanged={(bbox) => {
                const manager = managerRef.current;
                if (!manager) return;
                manager.requestViewport(toWireBbox(bbox), null).then(
                  () => setViewportRefusal(null),
                  (e: unknown) => {
                    if (e instanceof SkpCallError) {
                      setViewportRefusal(formatRefusal(e.skpError));
                      return;
                    }
                    throw e;
                  }
                );
              }}
            />
            {hover && (
              <div className="hover-readout">
                id {hover.id.toString()}
                {hover.anchor && ` @ (${hover.anchor[0].toFixed(3)}, ${hover.anchor[1].toFixed(3)})`}
              </div>
            )}
            {canvasRefusal && (
              <div className="canvas-refusal" role="alert">
                {canvasRefusal}
                <button type="button" onClick={() => setCanvasRefusal(null)}>
                  Dismiss
                </button>
              </div>
            )}
            {viewportRefusal && (
              <div className="canvas-refusal" role="alert">
                <div className="admission-refusal-code">{viewportRefusal.code}</div>
                {viewportRefusal.message}
                <button type="button" onClick={() => setViewportRefusal(null)}>
                  Dismiss
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
