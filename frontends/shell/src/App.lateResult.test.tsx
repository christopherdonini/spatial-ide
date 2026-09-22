// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * N8 late-result integration test (the human's word of 2026-09-22,
 * `state/directives/2026-09-22-part-n-n8-and-sequencing.md`; the preregistration's "Deviation before
 * the late-result integration test" line): a source-text assertion (`App.test.ts`'s
 * `the_pre_check_refusal_latches_the_session_in_the_untiled_catch`) does not prove the guard holds
 * under real delivery order. Mounts the REAL `App` (`App.tsx`'s default export) in jsdom and drives
 * an admit-then-reopen sequence through the actual product wiring -- `AdmissionPanel`'s own
 * `onAdmitted` (via the SAME `openPath` E2E hook a real operator's click runs), the real `[admitted]`
 * effect, and the real `reportViewportOutcome`/`endSession`/`endSessionForDataset` guards.
 *
 * Mocked ONLY at the three boundaries `App` does not own: `./skp/client` (the SKP transport),
 * `./streaming/viewportStreamManager` (the baseline stream manager -- the arm is forced to
 * `"baseline"` below since the vitest suite's shipped default is `"candidate"`,
 * `residency/residencyArm.ts`'s own doc comment), and `./canvas/WorkingCanvas` (deck.gl's real
 * `Deck` needs a WebGL context jsdom does not provide, `App.test.ts`'s own top comment). Everything
 * else is the real, unmocked product code. No `@testing-library/react`-equivalent harness exists in
 * this package; this follows the same `react-dom/client` + React's own `act` pattern
 * `OriginMismatchState.test.tsx` and `canvas/HoverReadoutView.test.tsx` already use.
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
  // arm's untiled first look, issued immediately). This suite never drives a pan/zoom, so no
  // manager instance here ever issues a second request.
  const firstRequestDeferreds = new Map<string, Deferred>();
  return { firstRequestDeferreds, makeDeferred };
});

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
  };
}

// The SKP transport boundary. `openDataset` mints a handle from the per-call `cancelKey`
// (`crypto.randomUUID()` per `runAdmitPath` call), never from `path` -- the same "a fresh, distinct
// handle every time, same file or not" contract the real kernel carries -- so admitting the SAME
// path twice (a same-file reopen, this file's own scenario) still mints two distinct handles here.
vi.mock("./skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(`${skpError.message} (${skpError.code})`);
      this.name = "SkpCallError";
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    openDataset: async (_path: string, cancelKey: string): Promise<import("./skp/types").OpenDatasetResponse> => ({
      dataset: `dataset-${cancelKey}`,
    }),
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    // Never reached: `ViewportStreamManager` itself is mocked below, so nothing calls through.
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
  };
});

// The stream-manager boundary. Every `RequestOutcome` promise this suite drives is a deferred this
// file controls directly -- see `viewportMockState` above.
vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    private readonly dataset: string;
    private requestCount = 0;
    constructor(opts: { dataset: string }) {
      this.dataset = opts.dataset;
    }
    requestViewport(): Promise<unknown> {
      this.requestCount += 1;
      if (this.requestCount === 1) {
        const deferred = viewportMockState.makeDeferred();
        viewportMockState.firstRequestDeferreds.set(this.dataset, deferred);
        return deferred.promise;
      }
      // Not exercised by this suite (no pan/zoom is ever driven) -- left permanently pending so an
      // unexpected second call hangs this file's own tests rather than silently misreporting.
      return new Promise(() => {});
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

// The WebGL boundary. A minimal stand-in satisfying `WorkingCanvasHandle` structurally -- every
// method a no-op/neutral stub, since the mocked `ViewportStreamManager` above never invokes the
// options that would reach `makeManagerCallbacks`'s own `canvas?.pushBatch`/`clearStream` closures.
vi.mock("./canvas/WorkingCanvas", () => {
  const MockWorkingCanvas = forwardRef<
    import("./canvas/WorkingCanvas").WorkingCanvasHandle,
    import("./canvas/WorkingCanvas").WorkingCanvasProps
  >(function MockWorkingCanvas(props, ref) {
    useImperativeHandle(
      ref,
      () => ({
        pushBatch: () => 0,
        clearStream: () => {},
        fitToBounds: () => false,
        resetFitForNewGeneration: () => {},
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
import { SkpCallError } from "./skp/client";
import App from "./App";
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

describe("App: a late old-generation viewport outcome, after a reopen, through the real product wiring (N8)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    viewportMockState.firstRequestDeferreds.clear();
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
  // OBSERVED 2026-09-23: FAILED -- `AssertionError: expected undefined to be 'engine.no_covering_bbox'`. Reverted after observing.
  it("a late old-generation SUCCESS after a reopen does not clear the new generation's standing viewport refusal", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    // N8: every successful `open_dataset` mints a fresh, distinct handle -- same file or not.
    expect(handleB).not.toBe(handleA);

    // B's own first query is refused for an ordinary reason (never `engine.source_changed`) -- a
    // real, standing refusal, so the resolved arm's "does not clear a standing refusal" claim has
    // something to clear.
    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.no_covering_bbox", message: "no covering bbox for this dataset", fields: {} }));
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.no_covering_bbox");
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();

    // A's delayed SUCCESS arrives late, after the reopen.
    await settleFirstRequest(handleA, { kind: "issued", streamHandle: "stream-a-late" });

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
  // OBSERVED 2026-09-23: FAILED -- `AssertionError: expected <div class="admission-refusal-code">engine.source_changed</div> to be null`.
  // Reverted after observing.
  it("a late old-generation REJECTION carrying engine.source_changed after a reopen neither ends the new generation nor writes its refusal", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);

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
  // OBSERVED 2026-09-23: FAILED -- `AssertionError: expected <div class="admission-refusal-code">engine.connections_exhausted</div> to
  // be null`. Reverted after observing.
  it("a late old-generation REJECTION carrying a different refusal code after a reopen does not write the new generation's viewport refusal either", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);

    await settleFirstRequest(handleB, { kind: "issued", streamHandle: "stream-b-1" });
    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();

    // A real, non-ending refusal code already used elsewhere (`tileViewportStreamManager.ts`'s own
    // `RETRYABLE_ENGINE_CODE`), so the non-ending write guard is exercised against a genuine code.
    await rejectFirstRequest(handleA, new SkpCallError({ code: "engine.connections_exhausted", message: "too many open connections", fields: {} }));

    expect(container.querySelector(".canvas-refusal .admission-refusal-code")).toBeNull();
    expect(container.querySelector(".canvas-session-ended")).toBeNull();
    expect(container.querySelector(".hover-readout-session-ended")).toBeNull();
  });

  // Control (the preregistration's own "Deviation before the late-result integration test" line):
  // "a engine.source_changed rejection issued FOR B does end B (so the test can tell the guard from
  // a dead path)." Structurally identical to the previous two tests except WHICH promise carries the
  // rejection, isolating the guard's own discriminating fact from everything else in the sequence.
  //
  // RECORDED MUTATION for "an engine.source_changed rejection issued FOR the live generation still ends it -- the guard is generation-specific, not a dead path":
  // remove `if (isSourceChangedRefusal(e)) endSession(refusalDetailOf(e), forDataset);` from `reportViewportOutcome`'s rejected arm
  // entirely (App.tsx). Expected failure: B's own `engine.source_changed` rejection no longer ends B's session at all.
  // OBSERVED 2026-09-23: FAILED -- `AssertionError: expected null not to be null`. Reverted after observing.
  it("an engine.source_changed rejection issued FOR the live generation still ends it -- the guard is generation-specific, not a dead path", async () => {
    const handleA = await openPathAndCaptureHandle();
    const handleB = await openPathAndCaptureHandle();
    expect(handleB).not.toBe(handleA);
    // A's own first request is left deliberately pending for the whole of this test.

    await rejectFirstRequest(handleB, new SkpCallError({ code: "engine.source_changed", message: "the source file changed", fields: {} }));

    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();
    expect(container.querySelector(".canvas-session-ended .admission-refusal-code")?.textContent).toBe("engine.source_changed");
    expect(container.querySelector(".hover-readout-session-ended")).not.toBeNull();
  });
});
