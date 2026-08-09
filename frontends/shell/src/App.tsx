import { useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import ErrorBanner from "./ErrorBanner";

/**
 * Cut 1's whole shell: an admission flow and a working canvas (`docs/07` Prototype-completion arc).
 * No style panel, no publish affordance -- neither exists anywhere in this tree, not even as a
 * disabled control (NEXT-CUT.md's own constraint). Viewport streaming (the canvas actually
 * receiving batches, and supersede-on-pan) lands in the next commit; this one establishes the
 * render surface and its pick chain.
 */
export default function App() {
  const [admitted, setAdmitted] = useState<Admitted | null>(null);
  const [hover, setHover] = useState<PickResult | null>(null);
  const [canvasRefusal, setCanvasRefusal] = useState<string | null>(null);
  const canvasRef = useRef<WorkingCanvasHandle>(null);

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
