// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * N8 late-result integration test (the human's word of 2026-09-22,
 * `state/directives/2026-09-22-n8-late-result-test.md` item 1; the preregistration's "Deviation before
 * the late-result integration test" line): a source-text assertion (`App.test.ts`'s
 * `the_pre_check_refusal_latches_the_session_in_the_untiled_catch`) does not prove the guard holds
 * under real delivery order. Mounts the REAL `App` (`App.tsx`'s default export) in jsdom and drives
 * an admit-then-reopen sequence through the actual product wiring -- `AdmissionPanel`'s own
 * `onAdmitted` (via the SAME `openPath` E2E hook a real operator's click runs), the real `[admitted]`
 * effect, and the real `reportViewportOutcome`/`endSession`/`endSessionForDataset` guards.
 *
 * Mocked at the FOUR boundaries `App` does not own: `./skp/client` (the SKP transport),
 * `./streaming/viewportStreamManager` (the baseline stream manager), `./residency/candidateArmSession`
 * (the candidate-arm session -- the product's own shipped default, `residencyArm.ts`'s
 * `DEFAULT_RESIDENCY_ARM`), and `./canvas/WorkingCanvas` (deck.gl's real `Deck` needs a WebGL context
 * jsdom does not provide, `App.test.ts`'s own top comment). Everything else is the real, unmocked
 * product code. No `@testing-library/react`-equivalent harness exists in this package; this follows
 * the same `react-dom/client` + React's own `act` pattern `OriginMismatchState.test.tsx` and
 * `canvas/HoverReadoutView.test.tsx` already use.
 *
 * Late-result correction round (`state/directives/2026-09-22-n8-late-result-test.md` item 1;
 * reviewer/architect FAIL, `state/gate-log.json` records 109-110): both gates found a real window
 * between `handleAdmitted(B)` writing `admittedDatasetRef.current` and A's own passive-effect cleanup
 * calling `stop()`, in which a still-live A can write B's state. `App.tsx` now guards, in that window,
 * the baseline issue path's `.then` and the candidate session's two App callbacks; this file's own
 * tests hold delivery to each producer's real `stop()` contract and exercise the window itself.
 *
 * N8 residual correction (`state/directives/2026-09-23-n8-residual-and-sequence.md`, section 1):
 * `App.tsx` now also guards, on the same admitted-handle key, the old generation's in-flight filter
 * Apply completion (`handleApplyFilter` and both arms' own dev-only `queryWithFilter` hooks) and, in
 * the dev-gated baseline arm only, its `onStreamOpened`/`onFailureTerminal`/`onDeliveryCompleted`/
 * `onBatchRows`/`onCanvasRefusal`/`onResidentCeilingExceeded` callbacks. Some blocks below drive the
 * full sequence -- A admitted, an in-flight filter Apply, A ended by `engine.source_changed`, a
 * successful reopen, then A's late filter completion and (baseline arm) its own callbacks -- with
 * positive controls proving B's own equivalents still work.
 *
 * N8 residual correction round 1 (same directive): the Apply guard widens to A's late ERROR path too
 * (the refusal-recovery re-issue and its retry). A second family of blocks drives the human's own
 * literal sequence for a plain (non-Apply) `reportViewportOutcome` outcome -- A ended through its OWN
 * owner route (`onSessionEnded`), THEN a successful reopen, THEN A's late first-request SUCCESS/
 * REJECTION -- so, unlike the earlier round, **some blocks below end A before reopening B**, not only
 * the "A still live when B is admitted" shape used exclusively before; each block names which shape it
 * drives. `App.test.ts` separately covers the reset/`endSessionForDataset` in isolation; the E2E route
 * covers ended, reopen, a second change, with no late delivery. Guards key on the admitted dataset
 * HANDLE (`admittedDatasetRef.current`), not on A's own `sessionEnded`/`stopped` flag.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// `vi.hoisted` runs before any `vi.mock` factory body, so this registry exists by the time either
// mocked module is resolved -- the same reason `admitDataset.test.ts`'s own `invokeMock` uses it.
const viewportMockState = vi.hoisted(() => {
  interface Deferred {
    promise: Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }
  function makeDeferred(): Deferred {
    let resolve!: (value: unknown) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<unknown>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  // Keyed by dataset handle -- one entry per manager's FIRST `requestViewport` call (the baseline
  // arm's untiled first look, issued immediately).
  const firstRequestDeferreds = new Map<string, Deferred>();
  // N8 residual correction: the manager's SECOND call -- App's own filter-Apply issue -- controlled
  // independently of the first (this suite never drives a pan/zoom, so nothing else reaches it).
  const secondRequestDeferreds = new Map<string, Deferred>();
  // The `onTerminal` callback captured off App's own `ViewportStreamManager` construction, keyed by
  // dataset -- the render-prop analogue of `candidateMockState.depsByDataset` below.
  const onTerminalByDataset = new Map<string, (streamHandle: string, terminal: { kind: string; detail: string }) => void>();
  // N8 residual correction round 1: the SAME construction's `onSessionEnded`/`onStreamOpened`/
  // `onBatch` options, captured the identical way -- `onSessionEnded` for item 2 (ending A through
  // its own owner route, the way the real manager fires it, `viewportStreamManager.ts:315`);
  // `onStreamOpened`/`onBatch` for item 7's probe (both otherwise unreachable directly -- neither is
  // routed through `onTerminal`).
  const onSessionEndedByDataset = new Map<string, (detail: string) => void>();
  const onStreamOpenedByDataset = new Map<string, (streamHandle: string) => void>();
  const onBatchByDataset = new Map<string, (streamHandle: string, batchSeq: number, payload: unknown) => void>();
  return {
    firstRequestDeferreds,
    secondRequestDeferreds,
    onTerminalByDataset,
    onSessionEndedByDataset,
    onStreamOpenedByDataset,
    onBatchByDataset,
    makeDeferred,
  };
});

// Candidate-arm registry, the identical shape as `viewportMockState` above, for the
// `./residency/candidateArmSession` boundary mocked below.
const candidateMockState = vi.hoisted(() => {
  interface Deferred {
    promise: Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }
  function makeDeferred(): Deferred {
    let resolve!: (value: unknown) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<unknown>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
  // One entry per session's own "first look" `reissueUnrestricted` call (App.tsx's dataset-open call
  // site). `depsByDataset` captures the exact `CandidateArmSessionDeps` `App.tsx` passed at
  // construction, so a test can invoke `onResidencyStatusChange`/`applyScanEvent` directly, standing
  // in for this module's own internal async callers of those two callbacks (mocked away entirely at
  // this boundary).
  const firstReissueDeferreds = new Map<string, Deferred>();
  // N8 residual correction: the session's SECOND `reissueUnrestricted` call -- App's own filter-Apply
  // issue -- mirroring `viewportMockState.secondRequestDeferreds` above.
  const secondReissueDeferreds = new Map<string, Deferred>();
  const depsByDataset = new Map<string, CandidateArmSessionDeps>();
  const stoppedByDataset = new Map<string, boolean>();
  return { firstReissueDeferreds, secondReissueDeferreds, depsByDataset, stoppedByDataset, makeDeferred };
});

// N8 residual correction: the mocked `WorkingCanvas`'s own props, captured by dataset -- lets a test
// invoke a SPECIFIC (possibly superseded) instance's `onCanvasRefusal`/`onResidentCeilingExceeded`/
// `onHover` directly, the render-prop analogue of `candidateMockState.depsByDataset` above.
// `resetFitForNewGenerationCalls` is a single running count (never per-dataset): the real
// `canvasRef.current?.resetFitForNewGeneration()` always targets whichever instance is mounted.
const workingCanvasMockState = vi.hoisted(() => ({
  propsByDataset: new Map<string, import("./canvas/WorkingCanvas").WorkingCanvasProps>(),
  resetFitForNewGenerationCalls: 0,
}));

// `skp/0.4`, crs-unit-fact-and-bounds: lets one test set the mocked `describe`'s `crs.unit` to
// something other than this file's own `describeFixture()` default ("metre"), so
// "App threads describe's unit to the canvas and the candidate session" (this piece's own
// preregistration §4 item 11) can prove the real threading without a second, hand-built fixture.
// Reset to "metre" in both describe blocks' own `beforeEach` below, so no other test observes it.
const crsUnitMockState = vi.hoisted(() => ({
  current: "metre" as "degree" | "metre" | "other" | "unestablished",
}));

// A function DECLARATION (hoisted by the language, independent of `vi.mock`'s own hoisting below)
// so the `./skp/client` mock can reference it regardless of textual order. Field-for-field identical
// to `admitDataset.test.ts`'s own `describeFixture()` -- a known-good shape, not re-derived by hand.
function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null,
      definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed",
      provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null,
      unit: crsUnitMockState.current,
    },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: {
      source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000",
      max_value: "99999", js_exact: true, class: "native", session_statement: null,
    },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false }],
    covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
    sanity: { level: "none", reason: "the file declares its own CRS, so no format rule was applied and there is nothing assumed to check. Not checked" },
    // skp/0.5, the advisory source-change watcher: additive, so this builder keeps the wire's
    // baseline (unpopulated) shape.
    coverage: { state: "watching", reason: null },
    checks: { state: "full", components: [] },
    session_end: null,
  };
}

// The SKP transport boundary. `openDataset` mints a fresh handle every call, in the real wire shape
// (`ds_` + 32 lowercase hex, `protocol/skp/SKP-V0.md:145`) -- the same contract the real kernel carries, a fresh
// distinct handle every time, same file or not, so admitting the SAME path twice (a
// same-file reopen, this file's own scenario) still mints two distinct handles here. Counter-based
// (never derived from `path` or `cancelKey`), so uniqueness never depends on either one's own shape.
vi.mock("./skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(`${skpError.message} (${skpError.code})`);
      this.name = "SkpCallError";
      this.skpError = skpError;
    }
  }
  let mintCounter = 0;
  return {
    SkpCallError,
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mintCounter += 1;
      return {
        dataset: `ds_${mintCounter.toString(16).padStart(32, "0")}`,
        session: `sr_${mintCounter.toString(16).padStart(32, "0")}`,
      };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    // Never reached: `ViewportStreamManager` itself is mocked below, so nothing calls through.
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
  };
});

// `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2d: `App`'s own `[]`-effect now registers the real
// `dataset_session_ended` listener (`skp/events.ts::listenDatasetSessionEnded`), which reaches
// `@tauri-apps/api/event`'s `listen` -- unavailable in this jsdom suite, which has no Tauri IPC
// shim. Mocked at the module boundary, the same discipline `./skp/client` gets above: a no-op
// listener that resolves to an unlisten function and never calls back, since no test in this file
// exercises the event route itself.
vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

// The baseline stream-manager boundary. Every `RequestOutcome` promise this suite drives is a
// deferred this file controls directly (`viewportMockState` above). `stop()` now honours the real
// contract (`viewportStreamManager.ts:417-421`), asymmetrically, exactly as the real manager's own
// `requestViewport` does: a SUCCESSFUL delivery to a manager already stopped resolves
// `{kind:"superseded"}` instead (the post-`await viewportQuery` generation check, `:192-198`) -- but a
// REJECTED delivery propagates unconverted regardless of `stop()` (`:192`'s own `await` has no
// `catch`, so the real manager never intercepts a rejection to reclassify it either).
vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    private readonly dataset: string;
    private requestCount = 0;
    private stoppedFlag = false;
    constructor(opts: {
      dataset: string;
      onTerminal?: (streamHandle: string, terminal: { kind: string; detail: string }) => void;
      onSessionEnded?: (detail: string) => void;
      onStreamOpened?: (streamHandle: string) => void;
      onBatch?: (streamHandle: string, batchSeq: number, payload: unknown) => void;
    }) {
      this.dataset = opts.dataset;
      // N8 residual correction: captured so a test can invoke `onFailureTerminal` directly (via
      // `makeManagerCallbacks`'s own `onTerminal` routing, `App.tsx`).
      if (opts.onTerminal) viewportMockState.onTerminalByDataset.set(opts.dataset, opts.onTerminal);
      // N8 residual correction round 1: `onSessionEnded` (item 2), `onStreamOpened`/`onBatch` (item 7
      // probe) -- captured the same way, this constructor's own doc comment above.
      if (opts.onSessionEnded) viewportMockState.onSessionEndedByDataset.set(opts.dataset, opts.onSessionEnded);
      if (opts.onStreamOpened) viewportMockState.onStreamOpenedByDataset.set(opts.dataset, opts.onStreamOpened);
      if (opts.onBatch) viewportMockState.onBatchByDataset.set(opts.dataset, opts.onBatch);
    }
    requestViewport(): Promise<unknown> {
      this.requestCount += 1;
      // N8 residual correction: the SECOND call (App's own filter-Apply issue) is controlled the
      // same way as the first, in its own registry.
      const registry =
        this.requestCount === 1 ? viewportMockState.firstRequestDeferreds : this.requestCount === 2 ? viewportMockState.secondRequestDeferreds : null;
      if (!registry) return new Promise(() => {});
      const deferred = viewportMockState.makeDeferred();
      // The map stores the WRAPPED promise as `.promise` (not the raw settle-only promise `resolve`/
      // `reject` close over) -- `issueViewportQuery`'s own `.then` is attached to exactly this
      // wrapped promise, and a `.then` attached later (a test's own `await deferred.promise`) must
      // resolve AFTER it, in attachment order, or a test could observe state from before that
      // callback ran.
      // Only the SUCCESS path is converted -- no `onRejected` handler, so a rejection propagates
      // through `.then` unchanged (ordinary promise chaining), matching the real manager exactly.
      const wrapped = deferred.promise.then((value) => (this.stoppedFlag ? { kind: "superseded" } : value));
      registry.set(this.dataset, { ...deferred, promise: wrapped });
      return wrapped;
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {
      this.stoppedFlag = true;
    }
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

// The candidate-arm session boundary. `reissueUnrestricted`'s own "first look" deferred mirrors
// `viewportMockState` above; `stop()` honours THIS producer's own real, DIFFERENT contract, the same
// success-only asymmetry as the baseline mock above -- `issueUntiledQuery`'s own `stopped` checks
// resolve `{kind:"stopped"}` once stopped, never `"superseded"` (`candidateArmSession.ts:1262-1264`,
// `:1267-1269`), but only on a SUCCESSFUL delivery: its own `await viewportQuery(...)` (`:1261`) has
// no `catch` either, so a rejection propagates unconverted regardless of `stopped`.
vi.mock("./residency/candidateArmSession", () => {
  return {
    startCandidateArmSession: (deps: CandidateArmSessionDeps) => {
      const { dataset } = deps;
      candidateMockState.depsByDataset.set(dataset, deps);
      candidateMockState.stoppedByDataset.set(dataset, false);
      let reissueCount = 0;
      return {
        manager: { queuedCount: 0, gridFrame: null, activeLevel: 1 },
        onViewportChanged: () => {},
        cancelPendingViewportChange: () => {},
        reissueUnrestricted: (): Promise<unknown> => {
          reissueCount += 1;
          // N8 residual correction: the SECOND reissue (App's own filter-Apply issue), mirroring the
          // baseline mock's own split above.
          const registry =
            reissueCount === 1 ? candidateMockState.firstReissueDeferreds : reissueCount === 2 ? candidateMockState.secondReissueDeferreds : null;
          if (!registry) return new Promise(() => {});
          const deferred = candidateMockState.makeDeferred();
          // Same discipline as the baseline mock (store the wrapped promise), and the same
          // success-only conversion (no `onRejected` handler), as the baseline mock above.
          const wrapped = deferred.promise.then((value) => (candidateMockState.stoppedByDataset.get(dataset) ? { kind: "stopped" } : value));
          registry.set(dataset, { ...deferred, promise: wrapped });
          return wrapped;
        },
        stop: async (): Promise<void> => {
          candidateMockState.stoppedByDataset.set(dataset, true);
        },
        relinquishFill: () => {},
      };
    },
  };
});

// The WebGL boundary. A minimal stand-in satisfying `WorkingCanvasHandle` structurally -- every
// method a no-op/neutral stub, since the mocked managers above never invoke the options that would
// reach `makeManagerCallbacks`'s own `canvas?.pushBatch`/`clearStream` closures.
vi.mock("./canvas/WorkingCanvas", () => {
  const MockWorkingCanvas = forwardRef<
    import("./canvas/WorkingCanvas").WorkingCanvasHandle,
    import("./canvas/WorkingCanvas").WorkingCanvasProps
  >(function MockWorkingCanvas(props, ref) {
    // N8 residual correction: `workingCanvasMockState.propsByDataset`'s own doc comment above has
    // the full account.
    workingCanvasMockState.propsByDataset.set(props.dataset, props);
    useImperativeHandle(
      ref,
      () => ({
        pushBatch: () => 0,
        clearStream: () => {},
        fitToBounds: () => false,
        resetFitForNewGeneration: () => {
          workingCanvasMockState.resetFitForNewGenerationCalls += 1;
        },
        getResidentCounts: () => ({ totalResidentVertices: 0, totalResidentFeatures: 0 }),
        armFirstPixelRenderHook: () => false,
        disarmFirstPixelRenderHook: () => true,
        pushTileBatch: () => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null, batchExtent: null }),
        clearTile: () => {},
        clearAllTiles: () => {},
        isTileResidentInCandidateSet: () => false,
        isTileCompleteInCandidateSet: () => false,
        markTilePartial: () => {},
        markTileComplete: () => {},
        markTileResidentEmpty: () => {},
        establishTileGridContext: () => {},
        applyTileViewportContext: () => false,
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import type { RequestOutcome } from "./streaming/viewportStreamManager";
import type { CandidateArmSessionDeps } from "./residency/candidateArmSession";
import { SkpCallError } from "./skp/client";
import App, { SCAN_LIVENESS_DELAY_MS } from "./App";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

// React 18.3's own `act` (not `react-dom/test-utils`'s deprecated re-export) requires this flag,
// the same one `OriginMismatchState.test.tsx` sets.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const REOPEN_PATH = "C:/data/reopen-fixture.parquet";

// Drives an admission through the REAL product path: `window.__SPATIAL_E2E__.openPath`, the same
// seam `AdmissionPanel.tsx`'s own top comment documents. Returns the freshly minted dataset handle
// by observing which key newly appeared in `firstRequestDeferreds` -- by watching the real
// `[admitted]` effect actually construct a manager and issue its first request, never by predicting
// the handle string ourselves.
async function openPathAndCaptureHandle(): Promise<string> {
  const hook = window.__SPATIAL_E2E__?.openPath;
  if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
  const before = new Set(viewportMockState.firstRequestDeferreds.keys());
  await act(async () => {
    const outcome = await hook(REOPEN_PATH);
    if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
  });
  const after = [...viewportMockState.firstRequestDeferreds.keys()].filter((k) => !before.has(k));
  if (after.length !== 1) throw new Error(`expected exactly one new dataset to have issued its first request; got ${after.length}`);
  return after[0];
}

async function settleFirstRequest(handle: string, outcome: RequestOutcome): Promise<void> {
  const deferred = viewportMockState.firstRequestDeferreds.get(handle);
  if (!deferred) throw new Error(`no first-request deferred recorded for dataset ${handle}`);
  await act(async () => {
    deferred.resolve(outcome);
    await deferred.promise;
  });
}
async function rejectFirstRequest(handle: string, error: unknown): Promise<void> {
  const deferred = viewportMockState.firstRequestDeferreds.get(handle);
  if (!deferred) throw new Error(`no first-request deferred recorded for dataset ${handle}`);
  await act(async () => {
    deferred.reject(error);
    await deferred.promise.catch(() => {});
  });
}
// N8 residual correction round 1, item 1 (B1): the manager's SECOND call -- App's own filter-Apply
// issue (`viewportMockState.secondRequestDeferreds`'s own doc comment above) -- rejected the same way.
async function rejectSecondRequest(handle: string, error: unknown): Promise<void> {
  const deferred = viewportMockState.secondRequestDeferreds.get(handle);
  if (!deferred) throw new Error(`no second-request deferred recorded for dataset ${handle}`);
  await act(async () => {
    deferred.reject(error);
    await deferred.promise.catch(() => {});
  });
}

describe("App: a late old-generation viewport outcome, after a reopen, through the real product wiring (N8) -- baseline arm", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    viewportMockState.firstRequestDeferreds.clear();
    viewportMockState.secondRequestDeferreds.clear();
    viewportMockState.onTerminalByDataset.clear();
    viewportMockState.onSessionEndedByDataset.clear();
    viewportMockState.onStreamOpenedByDataset.clear();
    viewportMockState.onBatchByDataset.clear();
    workingCanvasMockState.propsByDataset.clear();
    workingCanvasMockState.resetFitForNewGenerationCalls = 0;
    crsUnitMockState.current = "metre";
    // Baseline arm: the vitest suite's shipped default is `"candidate"` (`residencyArm.ts`), which
    // would construct `startCandidateArmSession` instead of the `ViewportStreamManager` mocked above.
    setResidencyArm("baseline");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<App />);
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.__SPATIAL_E2E__ = undefined;
    __resetResidencyArmForTests();
  });

  // RECORDED MUTATION for "a late old-generation SUCCESS after a reopen does not clear the new generation's standing viewport refusal":
  // remove the resolved arm's `if (forDataset !== admittedDatasetRef.current) return;` guard from `reportViewportOutcome` (App.tsx).
  // Expected failure: A's late `{kind:"issued"}` then falls through to `setViewportRefusal(null)` unconditionally, wiping B's refusal.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, "engine.no_covering_bbox"/undefined, summarized):
  //   AssertionError: expected undefined to be 'engine.no_covering_bbox' // Object.is equality
  // Reverted after observing.
  it("a late old-generation SUCCESS after a reopen does not clear the new generation's standing viewport refusal", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's own per-call minting, not a kernel proof (see the transport boundary comment above)

    // B's own first query is refused for an ordinary reason (never `engine.source_changed`) -- a
    // real, standing refusal, so the resolved arm's "does not clear a standing refusal" claim has
    // something to clear.
    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // A's own effect cleanup has already run by this point (the reopen above already flushed it) --
    // its manager is stopped, so the real contract (`viewportStreamManager.ts:417-421`) is that this
    // still-pending first request resolves `superseded`, which is what is delivered below; the
    // mock's own `stop()` handling would convert an `issued` delivery the same way.
    await settleFirstRequest(handleA, { kind: "superseded" });

    // B's standing refusal must survive untouched -- neither cleared nor overwritten.
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
  });

  // RECORDED MUTATION for "a late old-generation REJECTION carrying engine.source_changed after a reopen neither ends the new generation nor writes its refusal":
  // remove the rejected arm's `if (forDataset !== admittedDatasetRef.current) return;` guard from `reportViewportOutcome` (App.tsx).
  // Expected failure: A's late rejection reaches `setViewportRefusal(formatRefusal(e.skpError))` unconditionally, writing A's code onto
  // live generation B. `endSessionForDataset`'s own, separate guard still blocks the session-ended write even under this mutation, so
  // the refusal-code assertion (not only `.canvas-session-ended`) is what is load-bearing here.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, null/<div class="admission-refusal-code">engine.source_changed</div>, summarized):
  //   AssertionError: expected <div …(1)></div> to be null
  // Reverted after observing.
  it("a late old-generation REJECTION carrying engine.source_changed after a reopen neither ends the new generation nor writes its refusal", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof

    await settleFirstRequest(handleB, { kind: "issued", streamHandle: "stream-b-1" });
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    await rejectFirstRequest(handleA, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
  });

  // RECORDED MUTATION for "a late old-generation REJECTION carrying a different refusal code after a reopen does not write the new generation's viewport refusal either":
  // identical guard removal as the previous test's mutation, observed against a non-ending code so the write-guard's reach (every
  // rejection, not only the session-ending one) is itself proven, not assumed.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, null/<div class="admission-refusal-code">engine.connections_exhausted</div>, summarized):
  //   AssertionError: expected <div …(1)></div> to be null
  // Reverted after observing.
  it("a late old-generation REJECTION carrying a different refusal code after a reopen does not write the new generation's viewport refusal either", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof

    await settleFirstRequest(handleB, { kind: "issued", streamHandle: "stream-b-1" });
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();

    // A real, non-ending refusal code already used elsewhere (`tileViewportStreamManager.ts`'s own
    // `RETRYABLE_ENGINE_CODE`), so the non-ending write guard is exercised against a genuine code.
    await rejectFirstRequest(handleA, new SkpCallError({ code: "engine.connections_exhausted", message: "too many open connections", fields: {} }));

    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
  });

  // Control: an engine.source_changed rejection issued FOR B does end B, so the test can tell the guard from a dead path.
  // Structurally identical to the previous two tests except WHICH promise carries the rejection, isolating the guard's own
  // discriminating fact from everything else in the sequence.
  //
  // RECORDED MUTATION for "an engine.source_changed rejection issued FOR the live generation still ends it -- the guard is generation-specific, not a dead path":
  // remove `if (isSessionEndedRefusal(e)) endSession(refusalDetailOf(e), forDataset);` from `reportViewportOutcome`'s rejected arm
  // entirely (App.tsx). Expected failure: B's own `engine.source_changed` rejection no longer ends B's session at all.
  // OBSERVED 2026-09-23: FAILED -- AssertionError: expected null not to be null. Reverted after observing.
  it("an engine.source_changed rejection issued FOR the live generation still ends it -- the guard is generation-specific, not a dead path", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof
    // A's own first request is left deliberately pending for the whole of this test.

    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();
    expect(container.querySelector(".canvas-session-ended .admission-refusal-code")?.textContent).toBe("engine.source_changed");
    expect(container.querySelector(".hover-readout-session-ended")).not.toBeNull();
  });

  // `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4, SH4: the same control, on the advisory watch's
  // own code -- `isSessionEndedRefusal` (renamed §2d) matches it too, never only
  // `engine.source_changed` (block-on-sight 3 is a kernel-side rule; this is its client mirror).
  //
  // RECORDED MUTATION for the test below: narrow
  // `reportViewportOutcome`'s guard back to `e.skpError.code === "engine.source_changed"` (undoing
  // the §2d rename's widening). Expected failure: the first assertion below fails -- no
  // `.canvas-session-ended` block appears.
  it("an engine.source_coverage_lost pre-check refusal also ends the session", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);

    await rejectFirstRequest(
      handleB,
      new SkpCallError({ code: "engine.source_coverage_lost", message: "coverage was lost", fields: {} })
    );

    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();
    expect(container.querySelector(".canvas-session-ended .admission-refusal-code")?.textContent).toBe(
      "engine.source_coverage_lost"
    );
    expect(container.querySelector(".hover-readout-session-ended")).not.toBeNull();
  });

  // RECORDED MUTATION for "a genuine A ISSUED arriving in the real pre-cleanup window -- before A's own effect cleanup runs -- does not write B's scan/residency state":
  // remove the new `if (forThisEffect !== admittedDatasetRef.current) return;` guard from `issueViewportQuery`'s `.then` (App.tsx).
  // Expected failure: A's late `{kind:"issued"}`, delivered before A's own cleanup runs, reaches `applyScanEvent`/`setResidencyStatus`
  // unconditionally, making B's scan state "issuing" for A's dead stream.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, null/<button class="filter-cancel" type="button">Cancel</button>, summarized):
  //   AssertionError: expected <button type="button" …(1)></button> to be null
  // Reverted after observing.
  it("a genuine A ISSUED arriving in the real pre-cleanup window -- before A's own effect cleanup runs -- does not write B's scan/residency state", async () => {
    const handleA = await openPathAndCaptureHandle();
    const hook = window.__SPATIAL_E2E__!.openPath!;

    await act(async () => {
      // This await runs past `handleAdmitted(B)` (`runAdmitPath` calls `onAdmitted` synchronously
      // right after `admit()` resolves), so `admittedDatasetRef.current` is already B -- but React's
      // `act()` does not flush passive effects (A's cleanup, `manager.stop()`) until this ENTIRE
      // callback returns, so A's manager is still live right here.
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);

      const deferred = viewportMockState.firstRequestDeferreds.get(handleA);
      if (!deferred) throw new Error(`no first-request deferred recorded for dataset ${handleA}`);
      deferred.resolve({ kind: "issued", streamHandle: "stream-a-pre-cleanup" });
      await deferred.promise;
    });

    // B's own first request is left deliberately pending (never settled) -- isolates A's write.
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".scan-liveness")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();
    expect(container.querySelector(".canvas-refusal")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
  });

  // N8 residual correction round 1, item 7 probe: the dev-gated baseline arm's own
  // `onStreamOpened`/`onDeliveryCompleted`/`onBatchRows` (App.tsx, the `ViewportStreamManager`
  // construction) write the SAME single App-level `scanState`/`residencyStatus` `onFailureTerminal`
  // already guards. This probe is a guard proof only, the same as this file's own full-sequence
  // header below states -- the real manager does not deliver any of the three after `stop()` (`onBatch` drops a non-current
  // batch, `viewportStreamManager.ts:249-258`; a self-cancelled stream's terminal is suppressed via
  // `stop()`, `:332-338`/`:417-420`), so this probe calls A's captured raw closures directly, well
  // after A's own effect cleanup has already run (both admissions below fully flush), bypassing that
  // producer-level suppression on purpose to prove the App-level guard itself carries the whole weight
  // in the window the producer does NOT cover. `nextScanState`'s transitions gate `streamOpened` on a
  // matching `streamHandle`, so a stale open naming A's own (necessarily different) handle is already
  // a structural no-op regardless of any App-level guard -- its guard stays for defensive consistency,
  // but is not what this test demonstrates. `batch` and `completed`, by contrast, read only the
  // CURRENT scan state's `kind`, never the event's stream identity, so an unguarded late arrival of
  // either DOES overwrite whatever B is currently showing (probed rather than assumed: the guard proof
  // holds for both).
  //
  // RECORDED MUTATION for "A's late onBatchRows/onDeliveryCompleted, delivered well after A's own effect cleanup has run, do not overwrite B's own in-flight scan state (baseline arm, item 7 probe)":
  // remove the two new `if (admitted.dataset !== admittedDatasetRef.current) return;` guards (App.tsx:
  // `onBatchRows`, `onDeliveryCompleted`), one at a time.
  // Expected failure: A's stale `batch` (no real rows arrived for B) flips B from "open-no-rows" to
  // "delivering", changing B's own liveness text; A's stale `completed` then force-ends B's still-
  // in-flight scan, removing Cancel.
  // OBSERVED 2026-09-23: FAILED, `onBatchRows` -- vitest's printed bytes (first line):
  //   AssertionError: expected 'Filtering — 0 rows so far' to contain 'scanning, no matching rows yet'
  // OBSERVED 2026-09-23: FAILED, `onDeliveryCompleted` -- vitest's printed bytes (first line):
  //   AssertionError: expected null not to be null
  // Each reverted after observing.
  it("A's late onBatchRows/onDeliveryCompleted, delivered well after A's own effect cleanup has run, do not overwrite B's own in-flight scan state (baseline arm, item 7 probe)", async () => {
    const handleA = await openPathAndCaptureHandle();
    const onBatchA = viewportMockState.onBatchByDataset.get(handleA);
    const onTerminalA = viewportMockState.onTerminalByDataset.get(handleA);
    if (!onBatchA || !onTerminalA) throw new Error(`missing captured callbacks for dataset ${handleA}`);

    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);

    // Give B its own in-flight "open-no-rows" scan through B's OWN second query and B's OWN captured
    // `onStreamOpened` -- deliberately no batch of B's own, so a later text change to "N rows so far"
    // can only be A's stale batch, never B's own.
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'residential'");
    });
    const deferredB = viewportMockState.secondRequestDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-request deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-second-stream" });
      await deferredB.promise;
    });
    const onStreamOpenedB = viewportMockState.onStreamOpenedByDataset.get(handleB);
    if (!onStreamOpenedB) throw new Error(`missing captured onStreamOpened for dataset ${handleB}`);
    act(() => onStreamOpenedB("b-second-stream"));
    // Real (not faked) `SCAN_LIVENESS_DELAY_MS` wait -- `.scan-liveness`'s own text is gated by that
    // timer (`FilterPanel.tsx`'s own `showLivenessText` effect), the same discipline this file's own
    // real-button test above uses.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, SCAN_LIVENESS_DELAY_MS + 20));
    });
    expect(container.querySelector(".scan-liveness")?.textContent).toContain("scanning, no matching rows yet");

    // A's own stale `onBatch`, delivered well after A's own effect cleanup has already run (both
    // admissions above have fully flushed) -- not a promise, so it does not go through the manager
    // mock's own `stop()` conversion the way a stale `requestViewport` delivery does. The mocked
    // `WorkingCanvas.pushBatch` always reports 0 rows admitted regardless of the payload given here,
    // so this is `{kind:"batch", rows: 0}` at the App level -- the CLASS of bug (ignoring stream
    // identity) is what this asserts, not a specific row count.
    act(() => onBatchA("a-first-stream", 1, {}));
    expect(container.querySelector(".scan-liveness")?.textContent).toContain("scanning, no matching rows yet");
    expect(container.querySelector(".filter-cancel")).not.toBeNull();

    // A's own stale `onTerminal` (Completed), the identical reachability -- must not force-end B's
    // still-in-flight scan.
    act(() => onTerminalA("a-first-stream", { kind: "Completed", detail: "" }));
    expect(container.querySelector(".filter-cancel")).not.toBeNull();
  });

  // N8 residual correction (state/directives/2026-09-23-n8-residual-and-sequence.md, section 1): the
  // full ended -> reopen -> late-arrival sequence, for A's in-flight filter Apply and the dev-gated
  // baseline arm's three own callbacks. The filter completion is delivered PRE-cleanup (A's manager
  // not yet stopped): post-cleanup, the mock's own `stop()` conversion (matching
  // `viewportStreamManager.ts:417-421`) already turns a genuinely ISSUED delivery into
  // `{kind:"superseded"}`, which never reaches `commitActiveFilter` regardless of this piece's guard
  // -- so PRE-cleanup is the one window where the vulnerability, and the fix, is observable. A
  // rejected filter completion is not separately reproduced: `applyFilter`'s own catch (App.tsx)
  // never calls `commitActiveFilter`/`resetFitForNewGeneration` on any outcome but `"issued"`. The
  // three baseline callbacks are delivered post-cleanup, through the RAW captured closure -- this is
  // a guard proof only, not a claim that the real product has no other protection anywhere: the real
  // `ViewportStreamManager` itself suppresses much of this before App ever sees it (`onBatch` drops a
  // non-current batch, `viewportStreamManager.ts:249-258`; a self-cancelled stream's terminal is
  // suppressed via `stop()`, `:332-338`/`:417-420`), but this mock calls the captured callback
  // directly, bypassing that producer-level suppression on purpose, to prove the App-level guard
  // itself carries the whole weight in the window the producer does NOT cover.
  //
  // RECORDED MUTATION for "A's ended -> reopen sequence: the late filter-Apply completion and the dev-gated baseline arm's canvas-refusal/failure-terminal/resident-ceiling callbacks do not contaminate B -- B's own equivalents still work (baseline arm)":
  // (1) THIS test drives Apply through the dev-only `queryWithFilter` E2E hook, so its own two new
  //     `if (forThisEffect !== admittedDatasetRef.current) return;` guards (App.tsx's baseline
  //     `registerE2eHook("queryWithFilter", ...)` block) are what it exercises -- remove both.
  // Expected failure: `.filter-active` renders "Applied: zone = 'residential'" on B.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected <p class="filter-active"></p> to be null
  // Reverted after observing. (`handleApplyFilter`'s own, structurally identical guards -- the ones
  // the real FilterPanel Apply button reaches -- are proven load-bearing by the separate real-DOM
  // test below instead.)
  // (2) remove the three new `if (admitted.dataset !== admittedDatasetRef.current) return;` guards (App.tsx:
  //     `onFailureTerminal`, `onCanvasRefusal`, `onResidentCeilingExceeded`), one at a time.
  // Expected failure: each of A's three late callbacks writes onto B in turn.
  // OBSERVED 2026-09-23: FAILED, `onFailureTerminal` -- vitest's printed bytes (first line):
  //   AssertionError: expected <div class="canvas-refusal" …(1)>…(1)</div> to be null
  // OBSERVED 2026-09-23: FAILED, `onCanvasRefusal` -- vitest's printed bytes (first line):
  //   AssertionError: expected <div class="canvas-refusal" …(1)>…(1)</div> to be null
  // OBSERVED 2026-09-23: FAILED, `onResidentCeilingExceeded` -- vitest's printed bytes (first line):
  //   AssertionError: expected <div class="residency-status" …(1)></div> to be null
  // Each reverted after observing.
  it("A's ended -> reopen sequence: the late filter-Apply completion and the dev-gated baseline arm's canvas-refusal/failure-terminal/resident-ceiling callbacks do not contaminate B -- B's own equivalents still work (baseline arm)", async () => {
    const handleA = await openPathAndCaptureHandle();
    const canvasA = workingCanvasMockState.propsByDataset.get(handleA);
    if (!canvasA) throw new Error(`no captured WorkingCanvas props for dataset ${handleA}`);
    const onTerminalA = viewportMockState.onTerminalByDataset.get(handleA);
    if (!onTerminalA) throw new Error(`no captured onTerminal for dataset ${handleA}`);

    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'residential'");
    });
    expect(viewportMockState.secondRequestDeferreds.has(handleA)).toBe(true);

    await rejectFirstRequest(handleA, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();

    const hook = window.__SPATIAL_E2E__!.openPath!;
    const beforeB = new Set(viewportMockState.firstRequestDeferreds.keys());
    await act(async () => {
      // Same act()-deferred-flush mechanics as this file's own earlier pre-cleanup tests: A's manager
      // is not yet stopped right here.
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
      const deferred = viewportMockState.secondRequestDeferreds.get(handleA);
      if (!deferred) throw new Error(`no second-request deferred recorded for dataset ${handleA}`);
      deferred.resolve({ kind: "issued", streamHandle: "a-filter-late" });
      await deferred.promise;
    });
    const handleB = [...viewportMockState.firstRequestDeferreds.keys()].find((k) => !beforeB.has(k));
    if (!handleB) throw new Error("expected exactly one new dataset to have issued its first request");

    expect(container.querySelector(".filter-active")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".scan-liveness")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(0);

    act(() => onTerminalA("a-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: A's own stream" }));
    expect(container.querySelector(".canvas-refusal")).toBeNull();
    act(() => canvasA.onCanvasRefusal("a-stream-ceiling", "A's own ceiling refusal"));
    expect(container.querySelector(".canvas-refusal")).toBeNull();
    act(() => canvasA.onResidentCeilingExceeded("a-stream-ceiling-2", 999999));
    expect(container.querySelector(".residency-status")).toBeNull();

    // Positive controls: B's own equivalents still work.
    const canvasB = workingCanvasMockState.propsByDataset.get(handleB);
    if (!canvasB) throw new Error(`no captured WorkingCanvas props for dataset ${handleB}`);
    const onTerminalB = viewportMockState.onTerminalByDataset.get(handleB);
    if (!onTerminalB) throw new Error(`no captured onTerminal for dataset ${handleB}`);

    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'commercial'");
    });
    const deferredB = viewportMockState.secondRequestDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-request deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-filter" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(1);

    act(() => onTerminalB("b-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: B's own stream" }));
    expect(container.querySelector(".canvas-refusal")?.textContent).toContain("ProducerFailed");
    act(() => canvasB.onResidentCeilingExceeded("b-stream-ceiling", 42));
    expect(container.querySelector(".residency-status")).not.toBeNull();
    // Item 5 (positive-control extension): B's own `onCanvasRefusal` -- not only `onTerminal`/
    // `onResidentCeilingExceeded` above -- still shows on B (the negative-control pair above only
    // proves A's OWN late `onCanvasRefusal` does not).
    act(() => canvasB.onCanvasRefusal("b-stream-ceiling-2", "B's own ceiling refusal"));
    expect(container.querySelector(".canvas-refusal")?.textContent).toContain("B's own ceiling refusal");
  });

  // N8 residual correction: `handleApplyFilter` (App.tsx) is what `FilterPanel`'s own `onApply` prop
  // binds to for a real Apply click -- the dev-only `queryWithFilter` hook exercised above
  // constructs its OWN, separate `applyFilter` deps, so this drives the real
  // `.filter-predicate`/`.filter-apply` DOM instead, proving `handleApplyFilter`'s own guards.
  //
  // RECORDED MUTATION for "the real FilterPanel Apply button's own late completion, delivered in the pre-cleanup window after ended -> reopen, does not contaminate B (baseline arm)":
  // remove `handleApplyFilter`'s two new `if (forThisApply !== admittedDatasetRef.current) return;` guards (App.tsx).
  // Expected failure: `.filter-active` renders "Applied: zone = 'residential'" on B.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected <p class="filter-active"></p> to be null
  // Reverted after observing.
  it("the real FilterPanel Apply button's own late completion, delivered in the pre-cleanup window after ended -> reopen, does not contaminate B (baseline arm)", async () => {
    function typeAndApply(predicate: string): void {
      const input = container.querySelector(".filter-predicate") as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
      act(() => {
        setter.call(input, predicate);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      act(() => {
        (container.querySelector(".filter-apply") as HTMLButtonElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    }

    const handleA = await openPathAndCaptureHandle();
    typeAndApply("zone = 'residential'");
    expect(viewportMockState.secondRequestDeferreds.has(handleA)).toBe(true);

    await rejectFirstRequest(handleA, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    const hook = window.__SPATIAL_E2E__!.openPath!;
    const beforeB = new Set(viewportMockState.firstRequestDeferreds.keys());
    await act(async () => {
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
      const deferred = viewportMockState.secondRequestDeferreds.get(handleA);
      if (!deferred) throw new Error(`no second-request deferred recorded for dataset ${handleA}`);
      deferred.resolve({ kind: "issued", streamHandle: "a-button-late" });
      await deferred.promise;
    });
    const handleB = [...viewportMockState.firstRequestDeferreds.keys()].find((k) => !beforeB.has(k));
    if (!handleB) throw new Error("expected exactly one new dataset to have issued its first request");

    expect(container.querySelector(".filter-active")).toBeNull();
    // Item 5 (positive-control extension): B's own hover latch is untouched by A's late completion.
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // Positive controls: B's own Apply, through the SAME real button, still works -- including the
    // scan-liveness family (`.filter-cancel`, `.scan-liveness`) and `.residency-status`, not only
    // `.filter-active` (item 5, extending this test's own prior, narrower positive control).
    // `applyScanEvent({kind:"issued",...})` fires only once `issueViewportQuery`'s own promise
    // resolves (App.tsx), not at click time -- so `.filter-cancel` is checked AFTER resolving, not
    // before.
    typeAndApply("zone = 'commercial'");
    const deferredB = viewportMockState.secondRequestDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-request deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-button" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");
    expect(container.querySelector(".filter-cancel")).not.toBeNull(); // "issuing" -- still in flight

    const onStreamOpenedB = viewportMockState.onStreamOpenedByDataset.get(handleB);
    if (!onStreamOpenedB) throw new Error(`no captured onStreamOpened for dataset ${handleB}`);
    act(() => onStreamOpenedB("b-button"));
    // Real (not faked) `SCAN_LIVENESS_DELAY_MS` wait -- `.scan-liveness` is gated by that timer
    // (`FilterPanel.tsx`'s own `showLivenessText` effect), never immediate like `.filter-cancel`.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, SCAN_LIVENESS_DELAY_MS + 20));
    });
    expect(container.querySelector(".scan-liveness")).not.toBeNull();

    const canvasB = workingCanvasMockState.propsByDataset.get(handleB);
    if (!canvasB) throw new Error(`no captured WorkingCanvas props for dataset ${handleB}`);
    act(() => canvasB.onResidentCeilingExceeded("b-button-ceiling", 42));
    expect(container.querySelector(".residency-status")).not.toBeNull();
  });

  // N8 residual correction round 1, item 1 (B1): the old Apply's ERROR path, both arms (reviewer/
  // architect attempt 1 FAIL). `applyFilter`'s refusal-recovery re-issue and its own throttled retry
  // both funnel through the SAME `deps.requestViewport` closure `handleApplyFilter` builds, which
  // reads `issueQueryRef.current` AT CALL TIME -- after A's own cleanup repointed it at B. Through the
  // REAL FilterPanel Apply button (`handleApplyFilter`'s own guards, not the dev hook's separate ones
  // the success-path test above already covers).
  //
  // RECORDED MUTATION for "the real FilterPanel Apply button's own late ERROR (refusal-recovery re-issue), delivered after ended -> reopen, does not reach B's own manager (baseline arm)":
  // remove `handleApplyFilter`'s new `if (forThisApply !== admittedDatasetRef.current) return Promise.resolve({ kind: "stopped" });` guard inside its `requestViewport` closure (App.tsx).
  // Expected failure: A's own refusal-recovery re-issue lands on B's own manager, issuing B's SECOND
  // request without B itself ever calling Apply.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected true to be false // Object.is equality
  // Reverted after observing.
  it("the real FilterPanel Apply button's own late ERROR (refusal-recovery re-issue), delivered after ended -> reopen, does not reach B's own manager (baseline arm)", async () => {
    function typeAndApply(predicate: string): void {
      const input = container.querySelector(".filter-predicate") as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
      act(() => {
        setter.call(input, predicate);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      act(() => {
        (container.querySelector(".filter-apply") as HTMLButtonElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    }

    const handleA = await openPathAndCaptureHandle();
    typeAndApply("zone = 'residential'");
    expect(viewportMockState.secondRequestDeferreds.has(handleA)).toBe(true);

    // End A through the SAME owner route the real manager fires, before reopening.
    const onSessionEndedA = viewportMockState.onSessionEndedByDataset.get(handleA);
    if (!onSessionEndedA) throw new Error(`no captured onSessionEnded for dataset ${handleA}`);
    act(() => onSessionEndedA("engine.source_changed: the source file changed"));

    const hook = window.__SPATIAL_E2E__!.openPath!;
    const beforeB = new Set(viewportMockState.firstRequestDeferreds.keys());
    await act(async () => {
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
    });
    const handleB = [...viewportMockState.firstRequestDeferreds.keys()].find((k) => !beforeB.has(k));
    if (!handleB) throw new Error("expected exactly one new dataset to have issued its first request");

    // A's own Apply completion, delivered well after A's own effect cleanup has already run (the
    // reopen above already flushed it) -- REJECTED, so `applyFilter`'s own catch runs its
    // refusal-recovery re-issue through `deps.requestViewport`.
    await rejectSecondRequest(handleA, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));

    // If the recovery re-issue reached B, it would have called `issueQueryRef.current` (by then B's
    // own `issueViewportQuery`), consuming B's own SECOND `requestViewport` slot -- so B never having
    // one recorded is exactly "did not reach B's own manager".
    expect(viewportMockState.secondRequestDeferreds.has(handleB)).toBe(false);
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(0);
  });

  // N8 residual correction round 1, item 2 (B2): the human's ruling names the full sequence -- "old
  // generation ends, successful reopen establishes the new generation, then old success/error/filter
  // completion arrives" (state/directives/2026-09-23-n8-residual-and-sequence.md, section 1). A ends
  // through its OWN owner route (`onSessionEnded`, the same callback the real manager fires,
  // `viewportStreamManager.ts:315`) with its first request still pending, THEN a successful reopen,
  // THEN A's late first-request outcome -- proving `reportViewportOutcome`'s guards hold across the
  // FULL composition, not merely a reopen without first ending A (this file's earlier, narrower tests).
  //
  // RECORDED MUTATION for "the human's full ended -> reopen -> old SUCCESS sequence through reportViewportOutcome does not clear B's standing refusal (baseline arm)":
  // extends this file's own first RECORDED MUTATION (`reportViewportOutcome`'s resolved-arm guard, App.tsx) to the full ended -> reopen composition.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected undefined to be 'engine.no_covering_bbox' // Object.is equality
  // Reverted after observing.
  it("the human's full ended -> reopen -> old SUCCESS sequence through reportViewportOutcome does not clear B's standing refusal (baseline arm)", async () => {
    const deliver = (handle: string) => settleFirstRequest(handle, { kind: "issued", streamHandle: "a-post-end-late" });

    const handleA = await openPathAndCaptureHandle();
    const onSessionEndedA = viewportMockState.onSessionEndedByDataset.get(handleA);
    if (!onSessionEndedA) throw new Error(`no captured onSessionEnded for dataset ${handleA}`);

    // End A through the SAME owner route the real manager fires, with A's own first request still
    // pending.
    act(() => onSessionEndedA("engine.source_changed: the source file changed"));
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();

    // A successful reopen -- clears A's session-ended block, establishes B.
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // B holds a standing refusal of its own before A's late outcome arrives.
    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");

    // A's own late first-request outcome, delivered after A's own effect cleanup has already run
    // (the reopen above already flushed it).
    await deliver(handleA);

    expect(container.querySelector(".filter-active")).toBeNull();
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();

    // Positive controls: B's own equivalents still work.
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'commercial'");
    });
    const deferredB = viewportMockState.secondRequestDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-request deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-filter" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");

    const onTerminalB = viewportMockState.onTerminalByDataset.get(handleB);
    if (!onTerminalB) throw new Error(`no captured onTerminal for dataset ${handleB}`);
    act(() => onTerminalB("b-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: B's own stream" }));
    expect(container.querySelector(".canvas-refusal")?.textContent).toContain("ProducerFailed");

    const canvasB = workingCanvasMockState.propsByDataset.get(handleB);
    if (!canvasB) throw new Error(`no captured WorkingCanvas props for dataset ${handleB}`);
    act(() => canvasB.onResidentCeilingExceeded("b-stream-ceiling", 42));
    expect(container.querySelector(".residency-status")).not.toBeNull();
  });

  // RECORDED MUTATION for "the human's full ended -> reopen -> old engine.source_changed REJECTION sequence through reportViewportOutcome does not write or end B (baseline arm)":
  // extends this file's own second RECORDED MUTATION (`reportViewportOutcome`'s rejected-arm guard, App.tsx) to the full ended -> reopen composition.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected 'engine.source_changed' to be 'engine.no_covering_bbox' // Object.is equality
  // Reverted after observing.
  it("the human's full ended -> reopen -> old engine.source_changed REJECTION sequence through reportViewportOutcome does not write or end B (baseline arm)", async () => {
    const deliver = (handle: string) =>
      rejectFirstRequest(handle, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    const handleA = await openPathAndCaptureHandle();
    const onSessionEndedA = viewportMockState.onSessionEndedByDataset.get(handleA);
    if (!onSessionEndedA) throw new Error(`no captured onSessionEnded for dataset ${handleA}`);

    // End A through the SAME owner route the real manager fires, with A's own first request still
    // pending.
    act(() => onSessionEndedA("engine.source_changed: the source file changed"));
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();

    // A successful reopen -- clears A's session-ended block, establishes B.
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // B holds a standing refusal of its own before A's late outcome arrives.
    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");

    // A's own late first-request outcome, delivered after A's own effect cleanup has already run
    // (the reopen above already flushed it).
    await deliver(handleA);

    expect(container.querySelector(".filter-active")).toBeNull();
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();

    // Positive controls: B's own equivalents still work.
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'commercial'");
    });
    const deferredB = viewportMockState.secondRequestDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-request deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-filter" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");

    const onTerminalB = viewportMockState.onTerminalByDataset.get(handleB);
    if (!onTerminalB) throw new Error(`no captured onTerminal for dataset ${handleB}`);
    act(() => onTerminalB("b-stream-failed", { kind: "ProducerFailed", detail: "engine.upstream_failed: B's own stream" }));
    expect(container.querySelector(".canvas-refusal")?.textContent).toContain("ProducerFailed");

    const canvasB = workingCanvasMockState.propsByDataset.get(handleB);
    if (!canvasB) throw new Error(`no captured WorkingCanvas props for dataset ${handleB}`);
    act(() => canvasB.onResidentCeilingExceeded("b-stream-ceiling", 42));
    expect(container.querySelector(".residency-status")).not.toBeNull();
  });
});

describe("App: a late old-generation viewport outcome, after a reopen, through the real product wiring (N8) -- candidate arm", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    candidateMockState.firstReissueDeferreds.clear();
    candidateMockState.secondReissueDeferreds.clear();
    candidateMockState.depsByDataset.clear();
    candidateMockState.stoppedByDataset.clear();
    workingCanvasMockState.propsByDataset.clear();
    workingCanvasMockState.resetFitForNewGenerationCalls = 0;
    crsUnitMockState.current = "metre";
    // The product ships this arm by default (`residencyArm.ts`'s `DEFAULT_RESIDENCY_ARM`) -- set
    // explicitly anyway so this block's own intent reads plainly.
    setResidencyArm("candidate");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<App />);
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.__SPATIAL_E2E__ = undefined;
    __resetResidencyArmForTests();
  });

  async function openPathAndCaptureCandidateHandle(): Promise<string> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    const before = new Set(candidateMockState.firstReissueDeferreds.keys());
    await act(async () => {
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
    });
    const after = [...candidateMockState.firstReissueDeferreds.keys()].filter((k) => !before.has(k));
    if (after.length !== 1) throw new Error(`expected exactly one new dataset to have issued its first reissue; got ${after.length}`);
    return after[0];
  }
  async function settleFirstReissue(handle: string, outcome: RequestOutcome): Promise<void> {
    const deferred = candidateMockState.firstReissueDeferreds.get(handle);
    if (!deferred) throw new Error(`no first-reissue deferred recorded for dataset ${handle}`);
    await act(async () => {
      deferred.resolve(outcome);
      await deferred.promise;
    });
  }
  async function rejectFirstReissue(handle: string, error: unknown): Promise<void> {
    const deferred = candidateMockState.firstReissueDeferreds.get(handle);
    if (!deferred) throw new Error(`no first-reissue deferred recorded for dataset ${handle}`);
    await act(async () => {
      deferred.reject(error);
      await deferred.promise.catch(() => {});
    });
  }
  // N8 residual correction round 1, item 1 (B1): the SECOND reissue -- App's own filter-Apply issue.
  async function rejectSecondReissue(handle: string, error: unknown): Promise<void> {
    const deferred = candidateMockState.secondReissueDeferreds.get(handle);
    if (!deferred) throw new Error(`no second-reissue deferred recorded for dataset ${handle}`);
    await act(async () => {
      deferred.reject(error);
      await deferred.promise.catch(() => {});
    });
  }

  // N8 residual correction round 1, item 1 (B1): the candidate arm's OWN dev-only `queryWithFilter`
  // hook (App.tsx, `registerE2eHook("queryWithFilter", ...)`'s own `requestViewport` guard, inside the
  // candidate-arm branch) builds a SEPARATE `applyFilter` deps object from `handleApplyFilter`'s own
  // (this file's own baseline-block test above proves that one, reached by the real button
  // regardless of arm) -- guarded independently, so proven independently.
  //
  // RECORDED MUTATION for "A's late ERROR (reissueUnrestricted's own refusal-recovery re-issue) through the candidate arm's own dev hook, delivered after ended -> reopen, does not reach B's own session (candidate arm)":
  // remove the candidate dev hook's new `if (admitted.dataset !== admittedDatasetRef.current) return Promise.resolve({ kind: "stopped" });` guard inside its `requestViewport` closure (App.tsx).
  // Expected failure: A's own refusal-recovery re-issue lands on B's own session, issuing B's SECOND
  // reissue without B itself ever calling Apply.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected true to be false // Object.is equality
  // Reverted after observing.
  it("A's late ERROR (reissueUnrestricted's own refusal-recovery re-issue) through the candidate arm's own dev hook, delivered after ended -> reopen, does not reach B's own session (candidate arm)", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'residential'");
    });
    expect(candidateMockState.secondReissueDeferreds.has(handleA)).toBe(true);

    // End A through the SAME owner route the real session fires, before reopening.
    const depsA = candidateMockState.depsByDataset.get(handleA);
    if (!depsA) throw new Error(`no captured deps for dataset ${handleA}`);
    act(() => depsA.onSessionEnded?.("engine.source_changed: the source file changed"));

    const hook = window.__SPATIAL_E2E__!.openPath!;
    const beforeB = new Set(candidateMockState.firstReissueDeferreds.keys());
    await act(async () => {
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
    });
    const handleB = [...candidateMockState.firstReissueDeferreds.keys()].find((k) => !beforeB.has(k));
    if (!handleB) throw new Error("expected exactly one new dataset to have issued its first reissue");

    // A's own Apply completion, delivered well after A's own effect cleanup has already run (the
    // reopen above already flushed it) -- REJECTED, so `applyFilter`'s own catch runs its
    // refusal-recovery re-issue through `deps.requestViewport`.
    await rejectSecondReissue(handleA, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));

    expect(candidateMockState.secondReissueDeferreds.has(handleB)).toBe(false);
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(0);
  });

  // Control, the candidate-arm analogue of the baseline block's own control above -- proves the shared
  // `reportViewportOutcome` guard also reaches the candidate call site (`session.reissueUnrestricted`).
  // RECORDED MUTATION for "an engine.source_changed rejection issued FOR the live candidate-arm generation still ends it":
  // identical removal as the baseline block's own control mutation (`endSession` call, App.tsx).
  // OBSERVED 2026-09-23: FAILED -- AssertionError: expected null not to be null. Reverted after observing.
  it("an engine.source_changed rejection issued FOR the live candidate-arm generation still ends it", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();
    const handleB = await openPathAndCaptureCandidateHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof

    await rejectFirstReissue(handleB, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();
    expect(container.querySelector(".canvas-session-ended .admission-refusal-code")?.textContent).toBe("engine.source_changed");
    expect(container.querySelector(".hover-readout-session-ended")).not.toBeNull();
  });

  // RECORDED MUTATION for "a late old-generation SUCCESS from the candidate arm's own reissueUnrestricted after a reopen does not clear the new generation's standing refusal":
  // extends the baseline block's first RECORDED MUTATION (`reportViewportOutcome`'s resolved-arm guard, App.tsx) to this candidate call site.
  // OBSERVED 2026-09-23: FAILED -- AssertionError: expected undefined to be 'engine.no_covering_bbox' (summarized). Reverted after observing.
  it("a late old-generation SUCCESS from the candidate arm's own reissueUnrestricted after a reopen does not clear the new generation's standing refusal", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();
    const handleB = await openPathAndCaptureCandidateHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof

    await rejectFirstReissue(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");

    // A's session is already stopped by this point (the reopen above already flushed it) -- the
    // mock's own `stop()` contract converts this delivery to `{kind:"stopped"}` regardless of what
    // is delivered here (`candidateArmSession.ts:1262-1269`).
    await settleFirstReissue(handleA, { kind: "issued", streamHandle: "candidate-a-late" });

    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
  });

  // RECORDED MUTATION for "a late old-generation REJECTION from the candidate arm's own reissueUnrestricted after a reopen does not write the new generation's refusal":
  // extends the baseline block's second RECORDED MUTATION (`reportViewportOutcome`'s rejected-arm guard, App.tsx) to this candidate call site.
  // OBSERVED 2026-09-23: FAILED -- AssertionError: expected <div …(1)></div> to be null (summarized). Reverted after observing.
  it("a late old-generation REJECTION from the candidate arm's own reissueUnrestricted after a reopen does not write the new generation's refusal", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();
    const handleB = await openPathAndCaptureCandidateHandle();
    expect(handleB).not.toBe(handleA); // precondition of the mock's minting, not a kernel proof

    await settleFirstReissue(handleB, { kind: "issued", streamHandle: "candidate-b-1" });
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();

    await rejectFirstReissue(handleA, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
  });

  // RECORDED MUTATION for "A's late onResidencyStatusChange/applyScanEvent callbacks, firing in the real pre-cleanup window, do not write B's state (candidate arm)":
  // (1) remove the `onResidencyStatusChange` guard (`if (admitted.dataset !== admittedDatasetRef.current) return;`, App.tsx's
  //     candidate-arm construction branch). Expected failure: A's late `candidate-within-budget` event reaches
  //     `setResidencyStatus` unconditionally, so `.residency-status` renders it on B.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, null/<div class="residency-status" role="status">Showing all 5 features in view</div>, summarized):
  //   AssertionError: expected <div class="residency-status" …(1)></div> to be null
  //   Reverted after observing. Note: in the product this half would not stand on B -- the real
  //   reissueUnrestricted emits B's own query-issued status on B's first reissue
  //   (candidateArmSession.ts:1674-1675), which the mock does not; mutation (2)'s scan-state half is a
  //   standing contamination in the product too.
  // (2) remove the `applyScanEvent` guard (same construction branch). Expected failure: A's late `{kind:"issued"}` scan event
  //     reaches `applyScanEvent` unconditionally, so `.filter-cancel` renders on B.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line; the -Expected/+Received block, null/<button class="filter-cancel" type="button">Cancel</button>, summarized):
  //   AssertionError: expected <button type="button" …(1)></button> to be null
  //   Reverted after observing.
  it("A's late onResidencyStatusChange/applyScanEvent callbacks, firing in the real pre-cleanup window, do not write B's state (candidate arm)", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();
    const hook = window.__SPATIAL_E2E__!.openPath!;

    await act(async () => {
      // Same act()-deferred-flush mechanics as the baseline block's pre-cleanup test above -- A's
      // captured `deps` here are still the live generation's, not yet torn down by `session.stop()`.
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
      const depsA = candidateMockState.depsByDataset.get(handleA);
      if (!depsA) throw new Error(`no captured deps for dataset ${handleA}`);
      depsA.onResidencyStatusChange?.({ kind: "candidate-within-budget", residentFeatureCount: 5 });
      depsA.applyScanEvent?.({ kind: "issued", streamHandle: "candidate-session-scan" });
    });

    expect(container.querySelector(".residency-status")).toBeNull();
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".scan-incomplete")).toBeNull();
  });

  // N8 residual correction: the candidate-arm analogue of the baseline block's own full-sequence
  // test above (its doc comment has the full pre-cleanup-window reasoning). The dev-gated baseline
  // arm's own three callbacks do not apply here -- the shipped candidate arm never reaches
  // `onFailureTerminal`/`onCanvasRefusal`/`onResidentCeilingExceeded` (no `ViewportStreamManager`
  // exists for this arm; `WorkingCanvas.tsx:186-190`'s `pushTileBatch` calls neither).
  //
  // RECORDED MUTATION for "A's ended -> reopen sequence: the late filter-Apply completion (reissueUnrestricted) does not contaminate B -- B's own Apply still works (candidate arm)":
  // remove the candidate-arm dev hook's two new `if (admitted.dataset !== admittedDatasetRef.current) return;` guards (App.tsx).
  // Expected failure: `.filter-active` renders "Applied: zone = 'residential'" on B.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected <p class="filter-active"></p> to be null
  // Reverted after observing.
  it("A's ended -> reopen sequence: the late filter-Apply completion (reissueUnrestricted) does not contaminate B -- B's own Apply still works (candidate arm)", async () => {
    const handleA = await openPathAndCaptureCandidateHandle();

    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'residential'");
    });
    expect(candidateMockState.secondReissueDeferreds.has(handleA)).toBe(true);

    await rejectFirstReissue(handleA, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();

    const hook = window.__SPATIAL_E2E__!.openPath!;
    const beforeB = new Set(candidateMockState.firstReissueDeferreds.keys());
    await act(async () => {
      const outcome = await hook(REOPEN_PATH);
      if (outcome.kind !== "admitted") throw new Error(`openPath(${REOPEN_PATH}) was refused: ${JSON.stringify(outcome)}`);
      const deferred = candidateMockState.secondReissueDeferreds.get(handleA);
      if (!deferred) throw new Error(`no second-reissue deferred recorded for dataset ${handleA}`);
      deferred.resolve({ kind: "issued", streamHandle: "a-filter-late" });
      await deferred.promise;
    });
    const handleB = [...candidateMockState.firstReissueDeferreds.keys()].find((k) => !beforeB.has(k));
    if (!handleB) throw new Error("expected exactly one new dataset to have issued its first reissue");

    expect(container.querySelector(".filter-active")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    // Item 5 (positive-control extension): B's own hover latch is untouched by A's late completion.
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(0);

    // Positive controls: B's own Apply still works -- including `.filter-cancel` and
    // `.residency-status` (item 5, extending this test's own prior, narrower positive control). The
    // mocked `startCandidateArmSession` (this file, above), unlike the real `candidateArmSession.ts`,
    // never invokes `deps.applyScanEvent`/`deps.onResidencyStatusChange` on its own -- driven here
    // directly through B's own captured `deps`, the same pattern this file's own "A's late
    // onResidencyStatusChange/applyScanEvent callbacks" test above already uses. `.scan-liveness`
    // itself is not asserted here: `CandidateArmSessionDeps.applyScanEvent`'s own narrower type
    // (`candidateArmSession.ts:136`) accepts only `"issued"`/`"reset"`, never `"streamOpened"`/
    // `"batch"` -- this arm's own scan state never advances past "issuing", the one `scanLivenessText`
    // state that reads `null` (its own doc comment), so `.scan-liveness` never renders for this arm.
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'commercial'");
    });
    const depsB = candidateMockState.depsByDataset.get(handleB);
    if (!depsB) throw new Error(`no captured deps for dataset ${handleB}`);
    act(() => depsB.applyScanEvent?.({ kind: "issued", streamHandle: "b-filter" }));
    expect(container.querySelector(".filter-cancel")).not.toBeNull();
    act(() => depsB.onResidencyStatusChange?.({ kind: "candidate-within-budget", residentFeatureCount: 5 }));
    expect(container.querySelector(".residency-status")).not.toBeNull();
    const deferredB = candidateMockState.secondReissueDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-reissue deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-filter" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");
    expect(workingCanvasMockState.resetFitForNewGenerationCalls).toBe(1);
  });

  // N8 residual correction round 1, item 2 (B2): the candidate-arm analogue of the baseline block's
  // own full-sequence test above (its doc comment has the full ruling/reasoning). A ends here through
  // its own owner route -- `depsA.onSessionEnded`, fired by `endCandidateSession` via
  // `TileViewportStreamManager.endSession`'s own `onSessionEnded` callback
  // (`residency/candidateArmSession.ts:1046, :1076-1082`), NOT by `session.stop()` -- with A's first
  // reissue still pending.
  //
  // RECORDED MUTATION for "the human's full ended -> reopen -> old SUCCESS sequence through reportViewportOutcome does not clear B's standing refusal (candidate arm)":
  // extends this file's own candidate-arm SUCCESS RECORDED MUTATION (`reportViewportOutcome`'s resolved-arm guard, App.tsx) to the full ended -> reopen composition.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected undefined to be 'engine.no_covering_bbox' // Object.is equality
  // Reverted after observing.
  it("the human's full ended -> reopen -> old SUCCESS sequence through reportViewportOutcome does not clear B's standing refusal (candidate arm)", async () => {
    const deliver = (handle: string) => settleFirstReissue(handle, { kind: "issued", streamHandle: "a-post-end-late" });
    await runB2CandidateSequence(deliver);
  });

  // RECORDED MUTATION for "the human's full ended -> reopen -> old engine.source_changed REJECTION sequence through reportViewportOutcome does not write or end B (candidate arm)":
  // extends this file's own candidate-arm REJECTION RECORDED MUTATION (`reportViewportOutcome`'s rejected-arm guard, App.tsx) to the full ended -> reopen composition.
  // OBSERVED 2026-09-23: FAILED -- vitest's printed bytes (first line):
  //   AssertionError: expected 'engine.source_changed' to be 'engine.no_covering_bbox' // Object.is equality
  // Reverted after observing.
  it("the human's full ended -> reopen -> old engine.source_changed REJECTION sequence through reportViewportOutcome does not write or end B (candidate arm)", async () => {
    const deliver = (handle: string) =>
      rejectFirstReissue(handle, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));
    await runB2CandidateSequence(deliver);
  });

  async function runB2CandidateSequence(deliver: (handle: string) => Promise<void>): Promise<void> {
    const handleA = await openPathAndCaptureCandidateHandle();
    const depsA = candidateMockState.depsByDataset.get(handleA);
    if (!depsA) throw new Error(`no captured deps for dataset ${handleA}`);

    // End A through the SAME owner route the real session fires, with A's own first reissue still
    // pending.
    act(() => depsA.onSessionEnded?.("engine.source_changed: the source file changed"));
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();

    // A successful reopen -- clears A's session-ended block, establishes B.
    const handleB = await openPathAndCaptureCandidateHandle();
    expect(handleB).not.toBe(handleA);
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // B holds a standing refusal of its own before A's late outcome arrives.
    await rejectFirstReissue(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");

    // A's own late first-reissue outcome, delivered after A's own effect cleanup has already run
    // (the reopen above already flushed it).
    await deliver(handleA);

    expect(container.querySelector(".filter-active")).toBeNull();
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
    expect(container.querySelector(".filter-cancel")).toBeNull();
    expect(container.querySelector(".residency-status")).toBeNull();

    // Positive controls: B's own equivalents still work.
    act(() => {
      void window.__SPATIAL_E2E__!.queryWithFilter!("zone = 'commercial'");
    });
    const depsB = candidateMockState.depsByDataset.get(handleB);
    if (!depsB) throw new Error(`no captured deps for dataset ${handleB}`);
    act(() => depsB.applyScanEvent?.({ kind: "issued", streamHandle: "b-filter" }));
    expect(container.querySelector(".filter-cancel")).not.toBeNull();
    act(() => depsB.onResidencyStatusChange?.({ kind: "candidate-within-budget", residentFeatureCount: 5 }));
    expect(container.querySelector(".residency-status")).not.toBeNull();
    const deferredB = candidateMockState.secondReissueDeferreds.get(handleB);
    if (!deferredB) throw new Error(`no second-reissue deferred recorded for dataset ${handleB}`);
    await act(async () => {
      deferredB.resolve({ kind: "issued", streamHandle: "b-filter" });
      await deferredB.promise;
    });
    expect(container.querySelector(".filter-active")?.textContent).toBe("Applied: zone = 'commercial'");
  }

  // `skp/0.4`, crs-unit-fact-and-bounds, §4 item 11: the real seam from `describe`'s wire shape,
  // through `App.tsx`, to both the canvas prop and the candidate session dep -- not a hand-built
  // value at either destination.
  //
  // RECORDED MUTATION for "App threads describe's unit to the canvas and the candidate session":
  // App passes the literal `"metre"` as `crsUnit` to both `WorkingCanvas` and
  // `startCandidateArmSession` instead of `admitted.describe.crs.unit` (App.tsx).
  // Expected failure: this test's two `toBe("degree")` assertions both fail, observing `"metre"`.
  it("App threads describe's unit to the canvas and the candidate session", async () => {
    // This mock pairs unit "degree" with `describeFixture()`'s own EPSG:2056 identifier and null
    // `display_convention` -- a shape the real engine never admits (§5's falsification condition:
    // `unit == "degree"` iff `display_convention` is `Some`). It is deliberate here: this test
    // proves only that the wire's `unit` value threads to `WorkingCanvas` and the candidate session
    // unchanged, so the mock's only job is to carry a `unit` distinct from the file's "metre"
    // default -- the identifier and `display_convention` fields are irrelevant to that seam and are
    // left at their default values on purpose.
    crsUnitMockState.current = "degree";
    const handle = await openPathAndCaptureCandidateHandle();

    const canvasProps = workingCanvasMockState.propsByDataset.get(handle);
    if (!canvasProps) throw new Error(`no captured WorkingCanvas props for dataset ${handle}`);
    expect(canvasProps.crsUnit).toBe("degree");

    const deps = candidateMockState.depsByDataset.get(handle);
    if (!deps) throw new Error(`no captured deps for dataset ${handle}`);
    expect(deps.crsUnit).toBe("degree");
  });
});
