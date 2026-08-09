import { useEffect, useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import ErrorBanner from "./ErrorBanner";
import { encodeHexF64 } from "./skp/codec";
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
    // The first look is unfiltered: `describe` establishes no dataset extent to aim a viewport at
    // (SKP-V0.md's C1), so the canvas's own auto-recenter-on-first-batch is what puts the camera
    // somewhere the data actually is.
    void manager.requestViewport(null, null);

    return () => {
      void manager.stop();
      managerRef.current = null;
    };
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
              onCanvasRefusal={(_streamHandle, message) => setCanvasRefusal(message)}
              onViewportChanged={(bbox) => {
                void managerRef.current?.requestViewport(toWireBbox(bbox), null);
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
          </div>
        )}
      </main>
    </div>
  );
}
