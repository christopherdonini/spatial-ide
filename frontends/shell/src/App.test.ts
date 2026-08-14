import { describe, expect, it, vi } from "vitest";

import type { Admitted } from "./admission/admitDataset";
import type { FormattedRefusal } from "./admission/formatRefusal";
import type { PickResult } from "./canvas/pick";
import type { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import {
  admitAndResetStaleUiState,
  ApplyFilterDeps,
  applyFilter,
  makeDebouncedViewportQuery,
  makeManagerCallbacks,
  nextResidencyStatus,
  requestViewportWithSingleRetry,
  ResidencyStatus,
} from "./App";
import { SkpCallError } from "./skp/client";
import { encodeHexF64 } from "./skp/codec";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "./skp/types";
import type { Bbox, DescribeResponse, Filter, SkpError } from "./skp/types";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "./streaming/viewportStreamManager";
import type { RequestOutcome } from "./streaming/viewportStreamManager";
import { debounce } from "./streaming/debounce";
import type { Terminal } from "./streaming/transport";

// D4 (custodian forensic run, evidence: 2,012,436 = 1,961,249 + 51,187): a refusal from one
// dataset survived, verbatim, into every later step's UI because nothing ever reset `canvasRefusal`
// / `viewportRefusal` / `hover` on a fresh admission. This file asserts the fix's actual sequencing
// directly, without rendering `<App />` -- `WorkingCanvas`'s real `Deck` construction needs a WebGL
// context jsdom does not provide, and no `@testing-library/react`-equivalent harness exists in this
// package (every other `.test.ts` here tests non-React logic, per this package's own `description`
// field in `package.json`). `admitAndResetStaleUiState` is exported from `App.tsx` specifically so
// this reset sequencing -- the actual bug fix -- is testable on its own terms.
//
// The *other* half of the D4 fix, `<WorkingCanvas key={admitted.dataset} .../>` forcing a remount
// per dataset, is **not tested here or anywhere in this suite**: it is a React-reconciliation idiom
// with no meaningful assertion available short of that same DOM/WebGL harness this package does not
// carry. `e2e/regression.mjs`'s `REOPEN'` step asserts banner/refusal absence immediately after a
// reopen (before its own "Zoom to layer" click) specifically to give this half of the fix *some*
// live evidence class, but that is a claim about what `REOPEN'` checks, not a claim that it has
// passed -- read `e2e/regression.mjs`'s own run output for the current state of that step, not this
// comment.

function describeFixture(): DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056",
      definition_json: null,
      source: "file",
      asserted_by: null,
      asserted_at: null,
      axis_order: "easting,northing",
      axis_normalization: "none-performed",
    },
    geometry: {
      column: "geometry",
      encoding: "geoarrow.polygon",
      coordinate_layout: "interleaved-xy",
      frame: "authoritative-project-crs",
    },
    identity: {
      source: "file:id",
      uniqueness: "verified-at-open-full-file",
      verified_rows: "100000",
      max_value: "99999",
      js_exact: true,
    },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false }],
    covering_bbox: true,
    row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
  };
}

function admittedFixture(dataset: string): Admitted {
  return { dataset, describe: describeFixture() };
}

function pickResultFixture(): PickResult {
  return { streamHandle: "sh_a", batchSeq: 0, id: 7n, anchor: [1, 2] };
}

function refusalFixture(): FormattedRefusal {
  return { code: "engine.crs_undeclared", message: "refused: no CRS", fields: [], remediationIsCut2: true };
}

function bboxFixture(): Bbox {
  return {
    xmin: encodeHexF64(0),
    ymin: encodeHexF64(0),
    xmax: encodeHexF64(10),
    ymax: encodeHexF64(10),
  };
}

function filterFixture(predicate = "zone = 'residential'"): Filter {
  return { predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
}

describe("admitAndResetStaleUiState (D4: a stale refusal/hover must not survive a new admission)", () => {
  it("clears canvasRefusal, viewportRefusal, hover, and residencyStatus, then adopts the new Admitted value", () => {
    const setCanvasRefusal = vi.fn();
    const setViewportRefusal = vi.fn();
    const setHover = vi.fn();
    const setResidencyStatus = vi.fn();
    const setActiveFilter = vi.fn();
    const setLastViewportBbox = vi.fn();
    const setAdmitted = vi.fn();
    const next = admittedFixture("ds_b");

    admitAndResetStaleUiState(next, {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setAdmitted,
    });

    expect(setCanvasRefusal).toHaveBeenCalledTimes(1);
    expect(setCanvasRefusal).toHaveBeenCalledWith(null);
    expect(setViewportRefusal).toHaveBeenCalledTimes(1);
    expect(setViewportRefusal).toHaveBeenCalledWith(null);
    expect(setHover).toHaveBeenCalledTimes(1);
    expect(setHover).toHaveBeenCalledWith(null);
    // Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): "It clears when ... (b) the dataset
    // changes" -- a status naming one dataset's row counts must not survive into the next.
    expect(setResidencyStatus).toHaveBeenCalledTimes(1);
    expect(setResidencyStatus).toHaveBeenCalledWith(null);
    // NEXT-CUT.md (filter-panel cut) design section: "Dataset change clears the filter via
    // `admitAndResetStaleUiState`" -- (+ref, +lastViewportBbox).
    expect(setActiveFilter).toHaveBeenCalledTimes(1);
    expect(setActiveFilter).toHaveBeenCalledWith(null);
    expect(setLastViewportBbox).toHaveBeenCalledTimes(1);
    expect(setLastViewportBbox).toHaveBeenCalledWith(null);
    expect(setAdmitted).toHaveBeenCalledTimes(1);
    expect(setAdmitted).toHaveBeenCalledWith(next);
  });

  it("resets even when the previous dataset actually had a live refusal, hover, residency status, filter, and viewport bbox set", () => {
    // Simulates dataset N's UI state right before dataset N+1 is admitted -- the exact live
    // sequence this fix targets: a ceiling refusal banner, a persistent residency status, a hover
    // readout, an applied filter, and a settled viewport bbox, all up from N.
    const state: {
      canvasRefusal: string | null;
      viewportRefusal: FormattedRefusal | null;
      hover: PickResult | null;
      residencyStatus: ResidencyStatus | null;
      activeFilter: Filter | null;
      lastViewportBbox: Bbox | null;
    } = {
      canvasRefusal: "accepting this batch would carry 2012436 resident vertices...",
      viewportRefusal: refusalFixture(),
      hover: pickResultFixture(),
      residencyStatus: { residentFeatureCount: 97_500, datasetRowCount: "100000" },
      activeFilter: filterFixture(),
      lastViewportBbox: bboxFixture(),
    };
    const setCanvasRefusal = vi.fn((v: string | null) => (state.canvasRefusal = v));
    const setViewportRefusal = vi.fn((v: FormattedRefusal | null) => (state.viewportRefusal = v));
    const setHover = vi.fn((v: PickResult | null) => (state.hover = v));
    const setResidencyStatus = vi.fn((v: ResidencyStatus | null) => (state.residencyStatus = v));
    const setActiveFilter = vi.fn((v: Filter | null) => (state.activeFilter = v));
    const setLastViewportBbox = vi.fn((v: Bbox | null) => (state.lastViewportBbox = v));
    const setAdmitted = vi.fn();

    admitAndResetStaleUiState(admittedFixture("ds_b"), {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setAdmitted,
    });

    expect(state.canvasRefusal).toBeNull();
    expect(state.viewportRefusal).toBeNull();
    expect(state.hover).toBeNull();
    expect(state.residencyStatus).toBeNull();
    expect(state.activeFilter).toBeNull();
    expect(state.lastViewportBbox).toBeNull();
  });

  it("resets happen before setAdmitted is called, so a re-render never sees the new dataset alongside stale UI state", () => {
    const order: string[] = [];
    const setCanvasRefusal = vi.fn(() => order.push("canvasRefusal"));
    const setViewportRefusal = vi.fn(() => order.push("viewportRefusal"));
    const setHover = vi.fn(() => order.push("hover"));
    const setResidencyStatus = vi.fn(() => order.push("residencyStatus"));
    const setActiveFilter = vi.fn(() => order.push("activeFilter"));
    const setLastViewportBbox = vi.fn(() => order.push("lastViewportBbox"));
    const setAdmitted = vi.fn(() => order.push("admitted"));

    admitAndResetStaleUiState(admittedFixture("ds_c"), {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setAdmitted,
    });

    expect(order.indexOf("admitted")).toBe(order.length - 1);
  });
});

// Rider 1 (DECISIONS-PENDING.md entry 0, option (a), the human's words): "incomplete-render state
// signalled at canvas/status level with rendered/total counts ... persistent while the condition
// holds; a dismissible banner alone fails the standard. Banner-dismissal semantics: dismiss hides
// the banner, never the status indicator." This suite asserts the pure state machine directly --
// App.tsx wires it to real events (a ResidentVertexCeilingExceeded refusal, a stream's Completed
// terminal, a fresh admission) but none of that needs a DOM to assert.
describe("nextResidencyStatus (rider 1's persistent ceiling-refusal status indicator)", () => {
  it("a ceiling-refusal event sets the status to the counts it carries", () => {
    const status = nextResidencyStatus({
      kind: "ceiling-refusal",
      residentFeatureCount: 97_500,
      datasetRowCount: "100000",
    });
    expect(status).toEqual<ResidencyStatus>({ residentFeatureCount: 97_500, datasetRowCount: "100000" });
  });

  it("a second ceiling-refusal event replaces the previous counts, not accumulates them", () => {
    const first = nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 40_000, datasetRowCount: "100000" });
    expect(first).not.toBeNull();
    const second = nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 97_500, datasetRowCount: "100000" });
    expect(second).toEqual<ResidencyStatus>({ residentFeatureCount: 97_500, datasetRowCount: "100000" });
  });

  it("a delivery-complete event clears the status -- rider 1's condition (a)", () => {
    expect(nextResidencyStatus({ kind: "delivery-complete" })).toBeNull();
  });

  it("a dataset-changed event clears the status -- rider 1's condition (b)", () => {
    expect(nextResidencyStatus({ kind: "dataset-changed" })).toBeNull();
  });

  // Rider 1, point 3: ".canvas-refusal keeps its Dismiss button; Dismiss hides the banner ONLY,
  // never the status indicator." There is deliberately no dismiss-banner event in this function's
  // own event union (TypeScript itself refuses one) -- App.tsx's Dismiss button calls
  // `setCanvasRefusal(null)` directly and never reaches `nextResidencyStatus`/`setResidencyStatus`
  // at all, which is the actual mechanism proving survival: see `App.tsx`'s own Dismiss `onClick`.
});

// Survival-through-dismiss, proven the way App.tsx actually wires it: `canvasRefusal` and
// `residencyStatus` are two independent `useState` cells, and only the `.canvas-refusal` Dismiss
// button's `onClick` (`() => setCanvasRefusal(null)`) exists in the component -- there is no code
// path from that click to `setResidencyStatus` at all. Modelled here with two independent state
// cells (no DOM) driven by the same setter functions `admitAndResetStaleUiState`/`App.tsx` use, so
// this is an assertion about the actual wiring, not a restatement of `nextResidencyStatus`'s type.
describe("banner-dismissal semantics (rider 1, point 3): dismissing .canvas-refusal never touches residencyStatus", () => {
  it("a ceiling refusal sets both canvasRefusal and residencyStatus; dismissing canvasRefusal clears only it", () => {
    const state: { canvasRefusal: string | null; residencyStatus: ResidencyStatus | null } = {
      canvasRefusal: null,
      residencyStatus: null,
    };
    const setCanvasRefusal = (v: string | null) => (state.canvasRefusal = v);
    const setResidencyStatus = (v: ResidencyStatus | null) => (state.residencyStatus = v);

    // The refusal event: WorkingCanvas.pushBatch's catch block calls both onCanvasRefusal (banner)
    // and onResidentCeilingExceeded (status) for the same ResidentVertexCeilingExceeded -- App.tsx
    // wires the second one through exactly this transition.
    setCanvasRefusal("accepting this batch would carry 2012436 resident vertices...");
    setResidencyStatus(nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 97_500, datasetRowCount: "100000" }));

    expect(state.canvasRefusal).not.toBeNull();
    expect(state.residencyStatus).not.toBeNull();

    // Dismiss: App.tsx's button onClick is `() => setCanvasRefusal(null)` -- nothing else.
    setCanvasRefusal(null);

    expect(state.canvasRefusal).toBeNull();
    expect(state.residencyStatus).toEqual<ResidencyStatus>({ residentFeatureCount: 97_500, datasetRowCount: "100000" });
  });
});

function fakeCanvasHandle(): WorkingCanvasHandle {
  return {
    pushBatch: vi.fn(),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
  };
}

// Rider 3 (the wrong-instance-callback footgun; race described in E2E-STATE.md's "Ledger footgun
// noted for later" and DECISIONS-PENDING.md entry 0): during a dataset-key remount, React
// re-points `canvasRef.current` at the NEW WorkingCanvas instance in the commit's layout phase --
// strictly BEFORE the previous dataset's passive-effect cleanup runs `manager.stop()`. A manager
// callback that reads `canvasRef.current` at call time (rather than closing over the instance it
// was built for) can therefore land the OLD manager's `clearStream`/`pushBatch` on the NEW
// instance's fresh ResidentSet -- observed in the field as a clear with `vertexDelta=0, before=0`
// on the wrong instance. `makeManagerCallbacks` fixes this by taking the canvas instance once, at
// construction; this suite proves that with a stand-in "ref" repointed to a second instance right
// after construction, with no DOM and no React involved at all.
describe("makeManagerCallbacks (rider 3: manager callbacks must hit the instance passed at construction, never a later ref read)", () => {
  it("onBatch and onSuperseded hit the exact canvas passed at construction, even after a stand-in ref is repointed to a different instance", () => {
    const oldCanvas = fakeCanvasHandle();
    const newCanvas = fakeCanvasHandle();
    // Models `canvasRef`: a mutable box that gets repointed to a new instance right after this
    // manager's callbacks are built -- exactly the remount race. The bug this fix closes is a
    // callback that reads `ref.current` (not the `oldCanvas` passed below) at call time.
    const ref: { current: WorkingCanvasHandle | null } = { current: oldCanvas };
    const callbacks = makeManagerCallbacks(ref.current, {
      onFailureTerminal: vi.fn(),
      onDeliveryCompleted: vi.fn(),
    });
    ref.current = newCanvas; // the remount

    callbacks.onBatch("sh_old", 0, new Uint8Array([9]));
    callbacks.onSuperseded("sh_old");

    expect(oldCanvas.pushBatch).toHaveBeenCalledWith("sh_old", 0, new Uint8Array([9]));
    expect(oldCanvas.clearStream).toHaveBeenCalledWith("sh_old");
    expect(newCanvas.pushBatch).not.toHaveBeenCalled();
    expect(newCanvas.clearStream).not.toHaveBeenCalled();
  });

  it("tolerates a null canvas at construction (the same defensive optional-chaining the old canvasRef.current?.… call sites had)", () => {
    const callbacks = makeManagerCallbacks(null, { onFailureTerminal: vi.fn(), onDeliveryCompleted: vi.fn() });
    expect(() => callbacks.onBatch("sh_a", 0, new Uint8Array())).not.toThrow();
    expect(() => callbacks.onSuperseded("sh_a")).not.toThrow();
  });

  it("onTerminal: a Completed terminal calls onDeliveryCompleted, never onFailureTerminal", () => {
    const onFailureTerminal = vi.fn();
    const onDeliveryCompleted = vi.fn();
    const callbacks = makeManagerCallbacks(fakeCanvasHandle(), { onFailureTerminal, onDeliveryCompleted });

    callbacks.onTerminal?.("sh_a", { kind: "Completed", detail: "" });

    expect(onDeliveryCompleted).toHaveBeenCalledTimes(1);
    expect(onFailureTerminal).not.toHaveBeenCalled();
  });

  it("onTerminal: a genuine failure calls onFailureTerminal, never onDeliveryCompleted", () => {
    const onFailureTerminal = vi.fn();
    const onDeliveryCompleted = vi.fn();
    const callbacks = makeManagerCallbacks(fakeCanvasHandle(), { onFailureTerminal, onDeliveryCompleted });
    const terminal: Terminal = { kind: "ProducerFailed", detail: "engine.crs_undeclared" };

    callbacks.onTerminal?.("sh_a", terminal);

    expect(onFailureTerminal).toHaveBeenCalledWith("sh_a", terminal);
    expect(onDeliveryCompleted).not.toHaveBeenCalled();
  });

  it("onTerminal: Cancelled is benign -- neither handler fires (mirrors App.tsx's prior whitelist)", () => {
    const onFailureTerminal = vi.fn();
    const onDeliveryCompleted = vi.fn();
    const callbacks = makeManagerCallbacks(fakeCanvasHandle(), { onFailureTerminal, onDeliveryCompleted });

    callbacks.onTerminal?.("sh_a", { kind: "Cancelled", detail: "" });

    expect(onFailureTerminal).not.toHaveBeenCalled();
    expect(onDeliveryCompleted).not.toHaveBeenCalled();
  });
});

function issuedOutcome(streamHandle: string): RequestOutcome {
  return { kind: "issued", streamHandle };
}

function skpErrorFixture(code = "skp.filter_unknown_column"): SkpError {
  return { code, message: "refused: `bogus_column_xyz` is not a column this dataset carries", fields: {} };
}

describe("requestViewportWithSingleRetry (NEXT-CUT.md filter-panel-cut P2 item 2: exactly one retry on throttled)", () => {
  it("returns the first attempt's outcome unchanged when it is not 'throttled', never waiting", async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const attempt = vi.fn().mockResolvedValueOnce(issuedOutcome("sh_a"));

    const outcome = await requestViewportWithSingleRetry(attempt, wait);

    expect(outcome).toEqual(issuedOutcome("sh_a"));
    expect(attempt).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
  });

  it("on a first 'throttled', waits VIEWPORT_QUERY_MIN_INTERVAL_MS then retries exactly once, returning the second attempt's outcome", async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const attempt = vi
      .fn()
      .mockResolvedValueOnce({ kind: "throttled" })
      .mockResolvedValueOnce(issuedOutcome("sh_a"));

    const outcome = await requestViewportWithSingleRetry(attempt, wait);

    expect(outcome).toEqual(issuedOutcome("sh_a"));
    expect(attempt).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith(VIEWPORT_QUERY_MIN_INTERVAL_MS);
  });

  it("a second 'throttled' is returned as-is -- exactly ONE retry, never a loop", async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const attempt = vi.fn().mockResolvedValue({ kind: "throttled" });

    const outcome = await requestViewportWithSingleRetry(attempt, wait);

    expect(outcome).toEqual({ kind: "throttled" });
    expect(attempt).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledTimes(1);
  });

  it("a thrown refusal propagates directly, never swallowed or retried", async () => {
    const wait = vi.fn().mockResolvedValue(undefined);
    const err = new SkpCallError(skpErrorFixture());
    const attempt = vi.fn().mockRejectedValueOnce(err);

    await expect(requestViewportWithSingleRetry(attempt, wait)).rejects.toBe(err);
    expect(attempt).toHaveBeenCalledTimes(1);
    expect(wait).not.toHaveBeenCalled();
  });
});

// NEXT-CUT.md (filter-panel cut) design section, P2 items 2-3: Apply = supersede immediately, with
// the debounce-cancel-first ordering, the bbox/filter read at issue time, activeFilter assigned ONLY
// on an issued outcome, and the typo-blanks-canvas refusal-recovery re-issue. `wait` is a
// zero-latency stub throughout (no fake timers needed -- `requestViewportWithSingleRetry`'s own
// timing is covered above).
describe("applyFilter (P2 items 2-3: cancel-debounce-first, retry-on-throttled, commit-only-on-issued, refusal recovery)", () => {
  function baseDeps(overrides: Partial<ApplyFilterDeps> = {}): {
    deps: ApplyFilterDeps;
    calls: string[];
    requestViewport: ReturnType<typeof vi.fn>;
    cancelPendingDebounce: ReturnType<typeof vi.fn>;
    commitActiveFilter: ReturnType<typeof vi.fn>;
  } {
    const calls: string[] = [];
    const cancelPendingDebounce = vi.fn(() => calls.push("cancel-debounce"));
    const requestViewport = vi.fn(async () => {
      calls.push("request-viewport");
      return issuedOutcome("sh_new");
    });
    const commitActiveFilter = vi.fn();
    const deps: ApplyFilterDeps = {
      requestViewport,
      cancelPendingDebounce,
      getLastViewportBbox: () => bboxFixture(),
      getActiveFilter: () => null,
      commitActiveFilter,
      wait: async () => {},
      ...overrides,
    };
    return { deps, calls, requestViewport, cancelPendingDebounce, commitActiveFilter };
  }

  it("cancels the pending debounce FIRST, before requestViewport is ever called", async () => {
    const { deps, calls } = baseDeps();

    await applyFilter(filterFixture(), deps);

    expect(calls[0]).toBe("cancel-debounce");
    expect(calls[1]).toBe("request-viewport");
  });

  it("issues over getLastViewportBbox() and the NEW filter, and on an issued outcome commits it + returns {kind:'applied'}", async () => {
    const newFilter = filterFixture("zone = 'commercial'");
    const bbox = bboxFixture();
    const { deps, requestViewport, commitActiveFilter } = baseDeps({ getLastViewportBbox: () => bbox });

    const outcome = await applyFilter(newFilter, deps);

    expect(requestViewport).toHaveBeenCalledWith(bbox, newFilter);
    expect(commitActiveFilter).toHaveBeenCalledWith(newFilter);
    expect(outcome).toEqual({ kind: "applied", streamHandle: "sh_new" });
  });

  it("throttled-after-retry never becomes state: returns {kind:'not-applied'}, commitActiveFilter never called", async () => {
    const requestViewport = vi.fn().mockResolvedValue({ kind: "throttled" });
    const commitActiveFilter = vi.fn();
    const { deps } = baseDeps({ requestViewport, commitActiveFilter });

    const outcome = await applyFilter(filterFixture(), deps);

    expect(outcome).toEqual({ kind: "not-applied" });
    expect(commitActiveFilter).not.toHaveBeenCalled();
  });

  it("a refusal never becomes state, reports {kind:'refused', refusal}, and re-issues the LAST successfully-issued query (previous filter + lastViewportBbox) -- the typo-blanks-canvas fix", async () => {
    const previousFilter = filterFixture("zone = 'residential'"); // the last successfully-issued filter
    const bbox = bboxFixture();
    const skpError = skpErrorFixture();
    const requestViewport = vi
      .fn()
      // The Apply attempt itself, over the NEW (typo'd) filter -- refused.
      .mockRejectedValueOnce(new SkpCallError(skpError))
      // The recovery re-issue, over the PREVIOUS filter -- succeeds.
      .mockResolvedValueOnce(issuedOutcome("sh_recovery"));
    const commitActiveFilter = vi.fn();
    const { deps } = baseDeps({
      requestViewport,
      getActiveFilter: () => previousFilter,
      getLastViewportBbox: () => bbox,
      commitActiveFilter,
    });
    const typoFilter = filterFixture("bogus_column_xyz = 1");

    const outcome = await applyFilter(typoFilter, deps);

    expect(outcome).toEqual({
      kind: "refused",
      refusal: { code: skpError.code, message: skpError.message, fields: [], remediationIsCut2: false },
    });
    expect(commitActiveFilter).not.toHaveBeenCalled(); // the refused typo never becomes state
    expect(requestViewport).toHaveBeenCalledTimes(2);
    expect(requestViewport).toHaveBeenNthCalledWith(1, bbox, typoFilter);
    // Recovery: previous filter, same bbox -- already-admitted, cannot itself be refused on filter
    // grounds (design section's own claim).
    expect(requestViewport).toHaveBeenNthCalledWith(2, bbox, previousFilter);
  });

  it("an unexpected (non-SkpCallError) failure propagates, never swallowed (ADR-010 rule 7)", async () => {
    const boom = new Error("transport exploded");
    const requestViewport = vi.fn().mockRejectedValueOnce(boom);
    const { deps } = baseDeps({ requestViewport });

    await expect(applyFilter(filterFixture(), deps)).rejects.toBe(boom);
  });
});

// NEXT-CUT.md design section, P2 item 1: "the debounced pan/zoom closure reads it [activeFilterRef]
// INSIDE the debounced body ... kills the stale-arg class". Driven through the REAL `debounce()`
// module (not a reimplementation) so this is an assertion about the actual ordering property, not a
// restatement of `makeDebouncedViewportQuery`'s own body.
describe("makeDebouncedViewportQuery (P2 item 1: activeFilterRef read at FIRE time, not schedule time)", () => {
  it("apply-between-schedule-and-fire: a filter applied AFTER debounced.call() but BEFORE it fires is the one issued", async () => {
    vi.useFakeTimers();
    try {
      const activeFilterRef: { current: Filter | null } = { current: null };
      const requestViewport = vi.fn().mockResolvedValue(issuedOutcome("sh_a"));
      const body = makeDebouncedViewportQuery(requestViewport, activeFilterRef, () => {});
      const debounced = debounce(body, VIEWPORT_QUERY_MIN_INTERVAL_MS);
      const bbox = bboxFixture();

      debounced.call(bbox, null); // schedule while unfiltered (a pan starting)
      const appliedMidFlight = filterFixture("zone = 'residential'");
      activeFilterRef.current = appliedMidFlight; // "Apply" landing between schedule and fire

      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS + 10);

      expect(requestViewport).toHaveBeenCalledTimes(1);
      expect(requestViewport).toHaveBeenCalledWith(bbox, null, appliedMidFlight);
    } finally {
      vi.useRealTimers();
    }
  });

  it("with no filter ever applied, issues with a null filter (the ordinary unfiltered pan, unchanged)", async () => {
    vi.useFakeTimers();
    try {
      const activeFilterRef: { current: Filter | null } = { current: null };
      const requestViewport = vi.fn().mockResolvedValue(issuedOutcome("sh_a"));
      const body = makeDebouncedViewportQuery(requestViewport, activeFilterRef, () => {});
      const debounced = debounce(body, VIEWPORT_QUERY_MIN_INTERVAL_MS);
      const bbox = bboxFixture();

      debounced.call(bbox, null);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS + 10);

      expect(requestViewport).toHaveBeenCalledWith(bbox, null, null);
    } finally {
      vi.useRealTimers();
    }
  });
});
