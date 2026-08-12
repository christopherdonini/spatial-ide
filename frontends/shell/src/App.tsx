import { useCallback, useEffect, useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import { FormattedRefusal, formatRefusal } from "./admission/formatRefusal";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import { logSessionEvent } from "./diagnostics/log";
import { Debounced, debounce } from "./streaming/debounce";
import ErrorBanner from "./ErrorBanner";
import { encodeHexF64 } from "./skp/codec";
import { closeDataset, SkpCallError } from "./skp/client";
import type { Bbox } from "./skp/types";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS, ViewportStreamManager } from "./streaming/viewportStreamManager";

function toWireBbox(bbox: AuthoritativeBbox): Bbox {
  return {
    xmin: encodeHexF64(bbox.xmin),
    ymin: encodeHexF64(bbox.ymin),
    xmax: encodeHexF64(bbox.xmax),
    ymax: encodeHexF64(bbox.ymax),
  };
}

/**
 * D4's stale-banner fix, isolated from React rendering: every `App`-level piece of UI state that
 * names something about the *previous* dataset (a canvas refusal, a viewport refusal, a hover
 * readout naming a feature id) is cleared before the new `Admitted` value is adopted. Exported and
 * parameterized over explicit setters (not a closure over `App`'s own hooks) so `App.test.ts` can
 * assert this exact sequencing directly -- see `handleAdmitted`'s doc comment in `App` for why a
 * full `<App />` render is not a practical way to test it here.
 */
export function admitAndResetStaleUiState(
  next: Admitted,
  setters: {
    setCanvasRefusal: (value: string | null) => void;
    setViewportRefusal: (value: FormattedRefusal | null) => void;
    setHover: (value: PickResult | null) => void;
    setAdmitted: (value: Admitted) => void;
  }
): void {
  setters.setCanvasRefusal(null);
  setters.setViewportRefusal(null);
  setters.setHover(null);
  setters.setAdmitted(next);
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
  const viewportDebounceRef = useRef<Debounced<[Bbox, string | null]> | null>(null);

  /**
   * The single admission callback `AdmissionPanel` calls on every successful `open_dataset` --
   * first open and every reopen alike. Clears every piece of UI state a *previous* dataset could
   * have left behind before adopting the new one, so a refusal or hover reading from dataset N
   * never survives into dataset N+1's UI (D4, custodian forensic run: the stale banner from one
   * ceiling refusal read as identical across every later step because nothing here ever reset it).
   * The actual sequencing is `admitAndResetStaleUiState` below, kept as a plain function over
   * explicit setter parameters (no closure over this component's hooks) specifically so
   * `App.test.ts` can assert it without rendering `<App />` -- `WorkingCanvas`'s real `Deck`
   * construction needs a WebGL context jsdom does not provide, so this indirection is what keeps
   * the reset sequencing itself testable without a DOM/WebGL harness this repo does not carry.
   *
   * `useCallback([])`: every `useState` setter closed over here is identity-stable for the
   * component's whole lifetime (React's own guarantee), so this callback never needs to change --
   * without it, a plain function literal gets a new identity every `App` render, which flows into
   * `AdmissionPanel`'s `onAdmitted` prop, its `admitPath` (`useCallback([onAdmitted])`), and the
   * `useEffect([admitPath])` that (un)registers the `openPath` E2E hook -- unregistering and
   * re-registering that hook on every render, for no reason.
   */
  const handleAdmitted = useCallback((next: Admitted): void => {
    admitAndResetStaleUiState(next, { setCanvasRefusal, setViewportRefusal, setHover, setAdmitted });
  }, []);

  function reportViewportOutcome(promise: Promise<void>) {
    promise.then(
      () => setViewportRefusal(null),
      (e: unknown) => {
        if (e instanceof SkpCallError) {
          setViewportRefusal(formatRefusal(e.skpError));
          return;
        }
        throw e; // an unexpected failure still reaches the ADR-010 rule 7 handlers
      }
    );
  }

  useEffect(() => {
    if (!admitted) {
      managerRef.current = null;
      viewportDebounceRef.current = null;
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
      // Every data-plane terminal used to be dropped on the floor here (docs/01 principle 8
      // violation, found alongside the origin-mismatch bug this cut fixes): a `TransportFailed`
      // from a rejected WebSocket upgrade produced no error banner and no console output, so a
      // stream that could never deliver a single batch looked identical to an idle canvas.
      //
      // `ViewportStreamManager` never forwards a terminal for a stream it cancelled itself (an
      // ordinary supersede-on-pan, or an explicit `cancelStream` refusal) -- see its own
      // `selfCancelledHandles` doc comment. It is the layer that knows "I cancelled this", which
      // CANCELLATION-FACTS.md §1 established cannot be read back off `terminal.kind` alone: the SKP
      // cancel path yields `ProducerFailed`, never `Cancelled`. What reaches here is therefore
      // either a stream's own natural `Completed` (benign, whitelisted below) or a genuine failure
      // this manager did not cause -- which must still banner.
      onTerminal: (streamHandle, terminal) => {
        if (terminal.kind === "Completed" || terminal.kind === "Cancelled") {
          return;
        }
        logSessionEvent("stream-terminal-failure", `${streamHandle}: ${terminal.kind} — ${terminal.detail}`);
        setCanvasRefusal(`stream ${terminal.kind}: ${terminal.detail}`);
      },
    });
    managerRef.current = manager;

    // Pan/zoom-driven queries are debounced to settle (`streaming/debounce.ts`'s own doc comment):
    // deck.gl's `onViewStateChange` fires on every pointer-move frame during a drag, and issuing a
    // query per frame -- even throttled to the manager's own 120 ms window -- let overlapping
    // in-flight `viewport_query` calls pile up kernel-side tickets faster than ordinary dragging
    // should (Custodian walkthrough finding: `skp.too_many_pending_streams` from plain dragging).
    // Debouncing means continuous motion issues nothing; only a settled view issues a query.
    const debounced = debounce((bbox: Bbox, bboxCrs: string | null) => {
      reportViewportOutcome(manager.requestViewport(bbox, bboxCrs));
    }, VIEWPORT_QUERY_MIN_INTERVAL_MS);
    viewportDebounceRef.current = debounced;

    // The first look is unfiltered: `describe` establishes no dataset extent to aim a viewport at
    // (SKP-V0.md's C1), so the canvas's own fit-to-bounds-on-open is what puts the camera somewhere
    // the data actually is. Issued immediately, not debounced -- there is nothing yet to coalesce.
    reportViewportOutcome(manager.requestViewport(null, null));

    return () => {
      debounced.cancel();
      viewportDebounceRef.current = null;
      void manager.stop();
      // Every admitted dataset stays open (and its DuckDB pool resident) until explicitly closed;
      // opening a second one must not leak the first (S1, architect review of this cut).
      void closeDataset(admitted.dataset).catch(() => {});
      managerRef.current = null;
    };
    // `reportViewportOutcome` is stable across renders (it only reaches `setViewportRefusal`,
    // itself stable) and `manager`/`debounced` are effect-local, so neither is a dependency of
    // anything outside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admitted]);

  return (
    <div className="app">
      <ErrorBanner />
      <header className="app-header">Spatial IDE</header>
      <main className="app-main">
        <AdmissionPanel onAdmitted={handleAdmitted} />
        {admitted && (
          <div className="canvas-container">
            {/* Keyed on the dataset handle -- not just re-rendered with new props -- so a reopen
              * (a *new* `open_dataset`, `Admitted` object, even for the same file: SKP-V0.md never
              * promises the same dataset handle back) unmounts and remounts this component,
              * discarding `residentRef`/`residentExtentRef`/`hasAutoFitRef`/`frameRef` entirely
              * rather than reconciling the same instance across two different datasets' CRS/extent/
              * identity spaces. D4 (custodian forensic run): without a `key`, React reconciles the
              * *same* WorkingCanvas instance across a reopen (same position in this tree), so the
              * new dataset's first batch landed on the old dataset's still-fully-resident 1,961,249
              * vertices -- 1,961,249 + 51,187 (the new stream's own first batch) = 2,012,436, the
              * exact refusal this run's own evidence names. ADR-010 rule 1 ("a frame is a type
              * too" -- `frameRef`'s origin, like `residentRef`'s buffers, is tagged to the dataset
              * that produced it) is the constitutional reason a *new* dataset's canvas state may
              * never survive as an untagged carryover from the old one, not merely this bug's fix. */}
            <WorkingCanvas
              key={admitted.dataset}
              dataset={admitted.dataset}
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
                // Debounced to settle -- see the effect above's own comment and
                // `streaming/debounce.ts` for why a pan/zoom-driven query is never issued directly
                // from this callback.
                viewportDebounceRef.current?.call(toWireBbox(bbox), null);
              }}
            />
            <button
              type="button"
              className="zoom-to-layer"
              onClick={() => canvasRef.current?.fitToBounds()}
            >
              Zoom to layer
            </button>
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
