import { useCallback, useEffect, useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import { FormattedRefusal, formatRefusal } from "./admission/formatRefusal";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import { logSessionEvent } from "./diagnostics/log";
import { registerE2eHook, unregisterE2eHook } from "./e2e-test-surface";
import { Debounced, debounce } from "./streaming/debounce";
import type { Terminal } from "./streaming/transport";
import ErrorBanner from "./ErrorBanner";
import { encodeHexF64 } from "./skp/codec";
import { closeDataset, SkpCallError } from "./skp/client";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "./skp/types";
import type { Bbox } from "./skp/types";
import {
  VIEWPORT_QUERY_MIN_INTERVAL_MS,
  ViewportStreamManager,
  ViewportStreamManagerOptions,
} from "./streaming/viewportStreamManager";

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
    setResidencyStatus: (value: ResidencyStatus | null) => void;
    setAdmitted: (value: Admitted) => void;
  }
): void {
  setters.setCanvasRefusal(null);
  setters.setViewportRefusal(null);
  setters.setHover(null);
  // A status naming one dataset's row counts must never survive into another's UI -- the same D4
  // class of bug rider 1 (DECISIONS-PENDING.md entry 0, option (a)) explicitly calls out ("It
  // clears when ... (b) the dataset changes").
  setters.setResidencyStatus(nextResidencyStatus({ kind: "dataset-changed" }));
  setters.setAdmitted(next);
}

/**
 * Rider 1's persistent ceiling-refusal status ("N of M features rendered — declared ceiling
 * reached (MAX_RESIDENT_VERTICES)"), or `null` while nothing about the current dataset's rendering
 * is truncated.
 */
export interface ResidencyStatus {
  residentFeatureCount: number;
  /** `describe.row_count.value` verbatim (a `DecU64` string) -- never narrowed to `Number`, the
   * same discipline `skp/codec.ts`'s own doc comment states for every wire `DecU64`. */
  datasetRowCount: string;
}

/**
 * Rider 1's status-indicator state machine, kept pure and outside React state updates for the same
 * testability reason `admitAndResetStaleUiState` above is: `App.test.ts` asserts every transition
 * here directly, without a DOM/WebGL harness this package does not carry.
 *
 * - `"ceiling-refusal"`: a batch was refused by `ResidentVertexCeilingExceeded` -- (re)sets the
 *   status to the counts that refusal carried.
 * - `"delivery-complete"`: a stream's own natural `Completed` terminal reached `App` -- the human's
 *   own words, "a later stream completes fully without a ceiling refusal" (a stream this session
 *   itself cancelled for hitting the ceiling never reaches this event: `ViewportStreamManager`
 *   suppresses the terminal of any stream it cancelled itself, whatever that terminal's `kind` --
 *   see its own `selfCancelledHandles` doc comment).
 * - `"dataset-changed"`: a fresh admission -- unconditional clear, wired through
 *   `admitAndResetStaleUiState` above.
 *
 * Dismissing the `.canvas-refusal` banner is deliberately NOT a transition here -- rider 1, the
 * human's words: "dismiss hides the banner, never the status indicator". The banner's Dismiss
 * button only ever calls `setCanvasRefusal(null)`, never touching this state.
 */
export function nextResidencyStatus(
  event:
    | { kind: "ceiling-refusal"; residentFeatureCount: number; datasetRowCount: string }
    | { kind: "delivery-complete" }
    | { kind: "dataset-changed" }
): ResidencyStatus | null {
  switch (event.kind) {
    case "ceiling-refusal":
      return { residentFeatureCount: event.residentFeatureCount, datasetRowCount: event.datasetRowCount };
    case "delivery-complete":
    case "dataset-changed":
      return null;
  }
}

/**
 * Rider 3 (the wrong-instance-callback footgun, E2E-STATE.md's "Ledger footgun noted for later"):
 * during a dataset-key remount, React re-points `canvasRef.current` at the *new* `WorkingCanvas`
 * instance in the commit's layout phase -- strictly before the *previous* dataset's passive-effect
 * cleanup runs `manager.stop()`. A callback that reads `canvasRef.current` at CALL TIME (as this
 * file did before this fix) can therefore land the old manager's `clearStream`/`pushBatch` on the
 * new instance's fresh `ResidentSet` -- observed: a clear with `vertexDelta=0, before=0` on the
 * wrong instance. Harmless today only because the old instance is discarded wholesale; deliberately
 * not "the day datasets switch fast" (the human's words) safe.
 *
 * The fix: a `ViewportStreamManager` and the `WorkingCanvas` instance it feeds are 1:1 for the
 * manager's whole lifetime (both are created/torn down by the same `[admitted]` effect run, keyed
 * on the same dataset). This factory takes that instance *once, at construction* -- never a mutable
 * ref read later -- so a batch or supersede arriving after a remount always finds the canvas it was
 * actually meant for, alive or not, rather than whatever `canvasRef.current` happens to name by
 * then. Exported and pure (no React) so `App.test.ts` can assert this directly: build callbacks
 * against one stand-in canvas, repoint a stand-in "ref" to a second one, and confirm the callbacks
 * still hit the first.
 */
export function makeManagerCallbacks(
  canvas: WorkingCanvasHandle | null,
  handlers: {
    /** A stream failed for a reason this session did not itself cause (never called for a
     * `Completed` or `Cancelled` terminal -- see `ViewportStreamManager`'s own `onTerminal` doc
     * comment on why `Cancelled` never actually reaches here from the real SKP cancel path, and is
     * still filtered here defensively). */
    onFailureTerminal: (streamHandle: string, terminal: Terminal) => void;
    /** A stream's own natural `Completed` terminal -- rider 1's `"delivery-complete"` event. */
    onDeliveryCompleted: () => void;
  }
): Pick<ViewportStreamManagerOptions, "onBatch" | "onSuperseded" | "onTerminal"> {
  return {
    onBatch: (streamHandle, batchSeq, payload) => {
      canvas?.pushBatch(streamHandle, batchSeq, payload);
    },
    onSuperseded: (streamHandle) => {
      canvas?.clearStream(streamHandle);
    },
    // Every data-plane terminal used to be dropped on the floor here (docs/01 principle 8
    // violation, found alongside the origin-mismatch bug this cut fixes): a `TransportFailed` from
    // a rejected WebSocket upgrade produced no error banner and no console output, so a stream
    // that could never deliver a single batch looked identical to an idle canvas.
    //
    // `ViewportStreamManager` never forwards a terminal for a stream it cancelled itself (an
    // ordinary supersede-on-pan, or an explicit `cancelStream` refusal) -- see its own
    // `selfCancelledHandles` doc comment. It is the layer that knows "I cancelled this", which
    // CANCELLATION-FACTS.md §1 established cannot be read back off `terminal.kind` alone: the SKP
    // cancel path yields `ProducerFailed`, never `Cancelled`. What reaches here is therefore either
    // a stream's own natural `Completed` (benign, routed to `onDeliveryCompleted`) or a genuine
    // failure this manager did not cause -- which must still banner.
    onTerminal: (streamHandle, terminal) => {
      if (terminal.kind === "Cancelled") {
        return;
      }
      if (terminal.kind === "Completed") {
        handlers.onDeliveryCompleted();
        return;
      }
      handlers.onFailureTerminal(streamHandle, terminal);
    },
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
  // Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): the persistent status indicator, tracked
  // independently of `canvasRefusal` -- see `nextResidencyStatus`'s own doc comment for why
  // dismissing the banner must never touch this.
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus | null>(null);
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
    admitAndResetStaleUiState(next, {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setAdmitted,
    });
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

    // Rider 3: captured once, here, never re-read as `canvasRef.current` inside a callback below --
    // see `makeManagerCallbacks`'s own doc comment for the remount race this closes. This effect's
    // own `[admitted]` dependency means this `canvas` is exactly the `WorkingCanvas` instance the
    // JSX below mounts for *this* `admitted.dataset` (keyed on it), for this manager's whole
    // lifetime -- 1:1, never reassigned later even if `canvasRef.current` is.
    const canvas = canvasRef.current;
    if (canvas === null) {
      // Unreachable today: React's commit order re-points a `ref` at its new instance in the
      // layout phase, strictly before this passive effect runs -- by the time this line executes,
      // the `WorkingCanvas` this effect is keyed to (`admitted.dataset`) has already mounted and
      // `canvasRef.current` already names it. Logged anyway rather than silently assumed (docs/01
      // principle 8): `makeManagerCallbacks(canvas, ...)` closes over whatever `canvas` is *right
      // now*, permanently, for this manager's whole lifetime (that is the whole point of rider 3's
      // fix) -- if this ever did fire, every `onBatch`/`onSuperseded` call for this dataset would
      // silently no-op (`canvas?.pushBatch` on a permanently-null `canvas`) for the manager's
      // entire life, with no error, banner, or crash to say so. A log line here is the only thing
      // that would ever surface it.
      logSessionEvent(
        "canvas-ref-null-at-capture",
        `admitted.dataset=${admitted.dataset}: canvasRef.current was null when this effect captured it -- every batch/supersede for this dataset will silently no-op for this manager's whole lifetime`
      );
    }
    const manager = new ViewportStreamManager({
      dataset: admitted.dataset,
      ...makeManagerCallbacks(canvas, {
        onFailureTerminal: (streamHandle, terminal) => {
          logSessionEvent("stream-terminal-failure", `${streamHandle}: ${terminal.kind} — ${terminal.detail}`);
          setCanvasRefusal(`stream ${terminal.kind}: ${terminal.detail}`);
        },
        onDeliveryCompleted: () => {
          // Rider 1: "a later stream completes fully without a ceiling refusal" clears the status.
          setResidencyStatus(nextResidencyStatus({ kind: "delivery-complete" }));
        },
      }),
    });
    managerRef.current = manager;

    // E2E TEST SURFACE (dev builds only, e2e/README.md): drives `manager.requestViewport` with a
    // caller-supplied predicate over the whole dataset (bbox `null`, the same unrestricted shape the
    // initial unfiltered load below already uses) -- the exact same production call a future filter
    // panel would make, through the exact same `viewportStreamManager.ts` seam (NEXT-CUT.md P5: "not
    // a second, test-only code path", this file's own top comment). Only registered here, inside this
    // effect, because `manager` (and therefore anything to query) only exists once a dataset is
    // admitted -- mirrors `capturePixels` only existing once `WorkingCanvas` mounts.
    if (import.meta.env.DEV) {
      registerE2eHook("queryWithFilter", async (predicate: string) => {
        try {
          await manager.requestViewport(null, null, undefined, {
            predicate,
            dialect: FILTER_DIALECT_DUCKDB_EXPR_0,
          });
          // "no-refusal", not "admitted": `requestViewport` resolves `void` the same way on a
          // throttled/superseded/post-stop no-op as it does on a real mint (P6 should-fix,
          // reviewer round over P5) -- see `FilterQueryOutcome`'s own doc comment
          // (`e2e-test-surface.ts`) for why this hook cannot honestly claim more than that no
          // typed `skp.filter_*` refusal was raised.
          return { kind: "no-refusal" };
        } catch (e) {
          if (e instanceof SkpCallError) {
            return { kind: "refused", code: e.skpError.code, message: e.skpError.message };
          }
          throw e; // an unexpected failure still reaches the ADR-010 rule 7 handlers
        }
      });
    }

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
      if (import.meta.env.DEV) unregisterE2eHook("queryWithFilter");
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
              * identity spaces. ADR-010 rule 1 ("a frame is a type too" -- `frameRef`'s origin, like
              * `residentRef`'s buffers, is tagged to the dataset that produced it) is why: a *new*
              * dataset is a new frame/identity space, and every canvas ref built against the old one
              * must reset, not survive as an untagged carryover.
              *
              * Correction (2026-08-13): an earlier version of this comment cited "2,012,436 = the
              * old dataset's still-resident 1,961,249 + the new dataset's first batch (51,187)" as
              * the evidence this fix was responding to. Refuted by the run ledger
              * (e2e/out/regression-render-trace-1786582131720.json): both numbers were the *same*
              * stream's own partial sum at its own refusal moment (1,961,249 resident + 51,187
              * attempted, on a stream that was then cancelled), never two different datasets'
              * residency. This remount was never actually resting on that arithmetic -- it is
              * correct on the ADR-010 rule 1 grounds stated above regardless. */}
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
              onResidentCeilingExceeded={(_streamHandle, residentFeatureCount) => {
                setResidencyStatus(
                  nextResidencyStatus({
                    kind: "ceiling-refusal",
                    residentFeatureCount,
                    datasetRowCount: admitted.describe.row_count.value ?? "unknown",
                  })
                );
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
            {/* S1 (reviewer round, 2026-08-13): a single top-anchored flex column, not three
              * independently absolute-positioned elements at fixed offsets. `.canvas-refusal` can
              * wrap to 2+ lines (a long stream-failure or refusal message), and a fixed offset for
              * whatever sat below it (the old `.residency-status` rule) assumed a height that a
              * wrapped message violates -- occluding it. Stacking these in normal document flow
              * inside `.canvas-status-stack` (styles.css) means each element's *actual* rendered
              * height, whatever it is, is what the next one respects, not a number guessed in
              * advance -- both stay simultaneously visible regardless of message length, and both
              * stay clear of `.hover-readout` (bottom-left) and `.zoom-to-layer` (top-right) exactly
              * as before. */}
            {(canvasRefusal || viewportRefusal || residencyStatus) && (
              <div className="canvas-status-stack">
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
                {/* Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): NOT dismissible -- no close
                  * control, deliberately. Dismissing a `.canvas-refusal` above must never remove
                  * this; it only ever clears via `nextResidencyStatus`'s own "delivery-complete" /
                  * "dataset-changed" transitions. Plain digits, no thousands separators (this
                  * file's own `ResidencyStatus` doc comment: `datasetRowCount` is a wire `DecU64`
                  * string, never narrowed to `Number`). */}
                {residencyStatus && (
                  <div className="residency-status" role="status">
                    {`${residencyStatus.residentFeatureCount} of ${residencyStatus.datasetRowCount} features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
