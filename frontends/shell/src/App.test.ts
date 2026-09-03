// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import type { Admitted } from "./admission/admitDataset";
import type { FormattedRefusal } from "./admission/formatRefusal";
import type { HoverReadout, PickResult } from "./canvas/pick";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import type { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import {
  admitAndResetStaleUiState,
  ApplyFilterDeps,
  applyFilter,
  handleCanvasCeilingRefusal,
  isScanInFlight,
  makeCandidateViewportDispatcher,
  makeDebouncedViewportQuery,
  makeManagerCallbacks,
  nextResidencyStatus,
  nextScanState,
  requestViewportWithSingleRetry,
  ResidencyStatus,
  ScanEvent,
  ScanState,
  scanLivenessText,
  scanLivenessTextShouldShow,
  SCAN_LIVENESS_DELAY_MS,
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
      definition_provenance: null,
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
  return { code: "engine.crs_undeclared", message: "refused: no CRS", fields: [] };
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
    const setScanState = vi.fn();
    const setAdmitted = vi.fn();
    const next = admittedFixture("ds_b");

    admitAndResetStaleUiState(next, {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setScanState,
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
    // NEXT-CUT.md P4: the scan-liveness machine is App-owned (`.scan-incomplete`, `FilterPanel`'s
    // Cancel affordance) and gets the identical D4-class reset every other per-dataset state does.
    expect(setScanState).toHaveBeenCalledTimes(1);
    expect(setScanState).toHaveBeenCalledWith({ kind: "idle" });
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
      hover: HoverReadout;
      residencyStatus: ResidencyStatus | null;
      activeFilter: Filter | null;
      lastViewportBbox: Bbox | null;
      scanState: ScanState;
    } = {
      canvasRefusal: "accepting this batch would carry 2012436 resident vertices...",
      viewportRefusal: refusalFixture(),
      hover: pickResultFixture(),
      residencyStatus: { kind: "baseline-ceiling", residentFeatureCount: 97_500, datasetRowCount: "100000" },
      activeFilter: filterFixture(),
      lastViewportBbox: bboxFixture(),
      scanState: { kind: "delivering", streamHandle: "sh_a", rows: 42 },
    };
    const setCanvasRefusal = vi.fn((v: string | null) => (state.canvasRefusal = v));
    const setViewportRefusal = vi.fn((v: FormattedRefusal | null) => (state.viewportRefusal = v));
    const setHover = vi.fn((v: HoverReadout) => (state.hover = v));
    const setResidencyStatus = vi.fn((v: ResidencyStatus | null) => (state.residencyStatus = v));
    const setActiveFilter = vi.fn((v: Filter | null) => (state.activeFilter = v));
    const setLastViewportBbox = vi.fn((v: Bbox | null) => (state.lastViewportBbox = v));
    const setScanState = vi.fn((v: ScanState) => (state.scanState = v));
    const setAdmitted = vi.fn();

    admitAndResetStaleUiState(admittedFixture("ds_b"), {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setScanState,
      setAdmitted,
    });

    expect(state.canvasRefusal).toBeNull();
    expect(state.viewportRefusal).toBeNull();
    expect(state.hover).toBeNull();
    expect(state.residencyStatus).toBeNull();
    expect(state.activeFilter).toBeNull();
    expect(state.lastViewportBbox).toBeNull();
    expect(state.scanState).toEqual<ScanState>({ kind: "idle" });
  });

  it("resets happen before setAdmitted is called, so a re-render never sees the new dataset alongside stale UI state", () => {
    const order: string[] = [];
    const setCanvasRefusal = vi.fn(() => order.push("canvasRefusal"));
    const setViewportRefusal = vi.fn(() => order.push("viewportRefusal"));
    const setHover = vi.fn(() => order.push("hover"));
    const setResidencyStatus = vi.fn(() => order.push("residencyStatus"));
    const setActiveFilter = vi.fn(() => order.push("activeFilter"));
    const setLastViewportBbox = vi.fn(() => order.push("lastViewportBbox"));
    const setScanState = vi.fn(() => order.push("scanState"));
    const setAdmitted = vi.fn(() => order.push("admitted"));

    admitAndResetStaleUiState(admittedFixture("ds_c"), {
      setCanvasRefusal,
      setViewportRefusal,
      setHover,
      setResidencyStatus,
      setActiveFilter,
      setLastViewportBbox,
      setScanState,
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
// Viewport-residency cut P4 (decisions 24(a)/(b)): `ResidencyStatus`/`nextResidencyStatus` now live in
// `residency/residencyStatus.ts` (re-exported here, unchanged import surface) and gained a `kind`
// discriminant once the type became a union of three shapes (baseline's own `"baseline-ceiling"` plus
// two candidate-arm variants). Baseline's own rendered WORDING is untouched by this piece --
// `residencyStatusText`'s own tests (`residency/residencyStatus.test.ts`) prove that byte-for-byte; the
// candidate-arm variants and the shared clearing transitions are also tested there, not duplicated
// here -- this describe block stays scoped to baseline, as it always was.
describe("nextResidencyStatus (rider 1's persistent ceiling-refusal status indicator)", () => {
  it("a ceiling-refusal event sets the status to the counts it carries", () => {
    const status = nextResidencyStatus({
      kind: "ceiling-refusal",
      residentFeatureCount: 97_500,
      datasetRowCount: "100000",
    });
    expect(status).toEqual<ResidencyStatus>({ kind: "baseline-ceiling", residentFeatureCount: 97_500, datasetRowCount: "100000" });
  });

  it("a second ceiling-refusal event replaces the previous counts, not accumulates them", () => {
    const first = nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 40_000, datasetRowCount: "100000" });
    expect(first).not.toBeNull();
    const second = nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 97_500, datasetRowCount: "100000" });
    expect(second).toEqual<ResidencyStatus>({ kind: "baseline-ceiling", residentFeatureCount: 97_500, datasetRowCount: "100000" });
  });

  it("a delivery-complete event clears the status -- rider 1's condition (a)", () => {
    expect(nextResidencyStatus({ kind: "delivery-complete" })).toBeNull();
  });

  it("a dataset-changed event clears the status -- rider 1's condition (b)", () => {
    expect(nextResidencyStatus({ kind: "dataset-changed" })).toBeNull();
  });

  // Rider-1 refinement (DECISIONS-PENDING.md entry 1, architect recommendation, approved to
  // proceed): applying a filter (or any new query) supersedes and clears the canvas exactly as a
  // dataset change or full delivery does -- a stale ceiling status must not survive it.
  it("a query-issued event clears the status -- rider-1 refinement (DECISIONS-PENDING.md entry 1)", () => {
    const withStatus = nextResidencyStatus({ kind: "ceiling-refusal", residentFeatureCount: 1, datasetRowCount: "2" });
    expect(withStatus).not.toBeNull();
    expect(nextResidencyStatus({ kind: "query-issued" })).toBeNull();
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
    expect(state.residencyStatus).toEqual<ResidencyStatus>({
      kind: "baseline-ceiling",
      residentFeatureCount: 97_500,
      datasetRowCount: "100000",
    });
  });
});

function fakeCanvasHandle(): WorkingCanvasHandle {
  return {
    pushBatch: vi.fn(),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
    resetFitForNewGeneration: vi.fn(),
    getResidentCounts: vi.fn(() => ({ totalResidentVertices: 0, totalResidentFeatures: 0 })),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    // Viewport-residency cut P3w item B: the candidate arm's own ingest methods -- stubbed here
    // purely so this fake keeps satisfying `WorkingCanvasHandle`'s full shape; none of the tests in
    // this file (baseline-arm only) ever call them.
    pushTileBatch: vi.fn(() => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null })),
    clearTile: vi.fn(),
    clearAllTiles: vi.fn(),
    isTileResidentInCandidateSet: vi.fn(() => false),
    isTileCompleteInCandidateSet: vi.fn(() => false),
    markTilePartial: vi.fn(),
    markTileComplete: vi.fn(),
    establishTileGridContext: vi.fn(),
    applyTileViewportContext: vi.fn(() => true),
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

  // NEXT-CUT.md P4 item 1: `onBatchRows` -- the `batch(rows cumulative)` scan-liveness input needs a
  // per-batch row count, which only `WorkingCanvasHandle.pushBatch`'s own return value carries.
  it("onBatch calls onBatchRows with pushBatch's own return value (the admitted row count)", () => {
    const pushBatch = vi.fn().mockReturnValue(37);
    const canvas: WorkingCanvasHandle = {
      pushBatch,
      clearStream: vi.fn(),
      fitToBounds: vi.fn(() => false),
      resetFitForNewGeneration: vi.fn(),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 0, totalResidentFeatures: 0 })),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    pushTileBatch: vi.fn(() => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null })),
    clearTile: vi.fn(),
    clearAllTiles: vi.fn(),
    isTileResidentInCandidateSet: vi.fn(() => false),
    isTileCompleteInCandidateSet: vi.fn(() => false),
    markTilePartial: vi.fn(),
    markTileComplete: vi.fn(),
    establishTileGridContext: vi.fn(),
    applyTileViewportContext: vi.fn(() => true),
    };
    const onBatchRows = vi.fn();
    const callbacks = makeManagerCallbacks(canvas, { onFailureTerminal: vi.fn(), onDeliveryCompleted: vi.fn(), onBatchRows });

    callbacks.onBatch("sh_a", 0, new Uint8Array([1]));

    expect(onBatchRows).toHaveBeenCalledWith("sh_a", 37);
  });

  it("onBatchRows is optional -- a caller that omits it (every pre-existing call site) still works", () => {
    const canvas = fakeCanvasHandle();
    const callbacks = makeManagerCallbacks(canvas, { onFailureTerminal: vi.fn(), onDeliveryCompleted: vi.fn() });

    expect(() => callbacks.onBatch("sh_a", 0, new Uint8Array())).not.toThrow();
  });

  it("a null canvas reports 0 rows to onBatchRows rather than throwing (nothing was actually pushed)", () => {
    const onBatchRows = vi.fn();
    const callbacks = makeManagerCallbacks(null, { onFailureTerminal: vi.fn(), onDeliveryCompleted: vi.fn(), onBatchRows });

    callbacks.onBatch("sh_a", 0, new Uint8Array());

    expect(onBatchRows).toHaveBeenCalledWith("sh_a", 0);
  });
});

// NEXT-CUT.md P6 reviewer gate, B1 (blocking, "corrupts the very indicator Part E judges"): a
// declared-ceiling refusal (ResidentVertexCeilingExceeded OR PickCeilingExceeded, both routed through
// WorkingCanvas's own onCanvasRefusal) calls cancelStream, whose terminal ViewportStreamManager then
// suppresses -- without a scan event dispatched AT that call site, the scan machine would stay
// in-flight forever, showing a live indicator + enabled Cancel for a scan the app itself killed.
describe("handleCanvasCeilingRefusal (P6 review, B1: a ceiling refusal must leave the in-flight family)", () => {
  it("dispatches {kind:'failed'} (at the call site) alongside setCanvasRefusal and cancelStream", () => {
    const setCanvasRefusal = vi.fn();
    const applyScanEvent = vi.fn();
    const cancelStream = vi.fn();

    handleCanvasCeilingRefusal("sh_a", "accepting this batch would carry 2100000 resident vertices...", {
      setCanvasRefusal,
      applyScanEvent,
      cancelStream,
    });

    expect(setCanvasRefusal).toHaveBeenCalledWith("accepting this batch would carry 2100000 resident vertices...");
    expect(applyScanEvent).toHaveBeenCalledWith({ kind: "failed" });
    expect(cancelStream).toHaveBeenCalledWith("sh_a");
  });

  it("end to end through the real nextScanState: a ceiling refusal while delivering leaves the in-flight family -- indicator and Cancel disappear", () => {
    // Models App.tsx's own wiring: `applyScanEvent` reduces through the real `nextScanState`, exactly
    // as `commitScanState`/`applyScanEvent` do in the component.
    let scanState: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 250 };
    const applyScanEvent = (event: ScanEvent) => {
      scanState = nextScanState(scanState, event);
    };

    handleCanvasCeilingRefusal("sh_a", "ceiling message", {
      setCanvasRefusal: () => {},
      applyScanEvent,
      cancelStream: () => {},
    });

    // The indicator (isScanInFlight) and Cancel (also isScanInFlight) both key off the same
    // predicate -- "leaves the in-flight family" is exactly isScanInFlight flipping to false.
    expect(isScanInFlight(scanState)).toBe(false);
    expect(scanState).toEqual<ScanState>({ kind: "failed", streamHandle: "sh_a" });
  });
});

// ADR-021's binding acceptance condition / NEXT-CUT.md P4 item 1: "idle -> issuing -> open-no-rows
// -> delivering(rows) -> {complete | cancelled(rows) | failed}". Every transition, including
// cancel-without-terminal (P4 binding note 6) and failure.
describe("nextScanState (P4: the scan-liveness/cancel state machine)", () => {
  const idle: ScanState = { kind: "idle" };

  it("idle -- issued(handle) --> issuing(handle)", () => {
    expect(nextScanState(idle, { kind: "issued", streamHandle: "sh_a" })).toEqual<ScanState>({
      kind: "issuing",
      streamHandle: "sh_a",
    });
  });

  it("issuing -- streamOpened(same handle) --> open-no-rows", () => {
    const issuing: ScanState = { kind: "issuing", streamHandle: "sh_a" };
    expect(nextScanState(issuing, { kind: "streamOpened", streamHandle: "sh_a" })).toEqual<ScanState>({
      kind: "open-no-rows",
      streamHandle: "sh_a",
    });
  });

  it("a streamOpened for a DIFFERENT (stale) handle is a no-op -- the late-TAG_OPEN guard", () => {
    const issuing: ScanState = { kind: "issuing", streamHandle: "sh_current" };
    expect(nextScanState(issuing, { kind: "streamOpened", streamHandle: "sh_stale" })).toEqual<ScanState>(issuing);
  });

  it("a streamOpened while not issuing (e.g. idle) is a no-op", () => {
    expect(nextScanState(idle, { kind: "streamOpened", streamHandle: "sh_a" })).toEqual<ScanState>(idle);
  });

  it("open-no-rows -- batch(rows) --> delivering(rows)", () => {
    const openNoRows: ScanState = { kind: "open-no-rows", streamHandle: "sh_a" };
    expect(nextScanState(openNoRows, { kind: "batch", rows: 12 })).toEqual<ScanState>({
      kind: "delivering",
      streamHandle: "sh_a",
      rows: 12,
    });
  });

  it("delivering -- batch(rows) --> delivering(rows), replacing (not accumulating) the count", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 12 };
    expect(nextScanState(delivering, { kind: "batch", rows: 30 })).toEqual<ScanState>({
      kind: "delivering",
      streamHandle: "sh_a",
      rows: 30,
    });
  });

  it("a batch while idle (no scan tracked) is a no-op", () => {
    expect(nextScanState(idle, { kind: "batch", rows: 5 })).toEqual<ScanState>(idle);
  });

  it("open-no-rows -- completed --> complete", () => {
    const openNoRows: ScanState = { kind: "open-no-rows", streamHandle: "sh_a" };
    expect(nextScanState(openNoRows, { kind: "completed" })).toEqual<ScanState>({ kind: "complete", streamHandle: "sh_a" });
  });

  it("delivering -- completed --> complete", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 500 };
    expect(nextScanState(delivering, { kind: "completed" })).toEqual<ScanState>({ kind: "complete", streamHandle: "sh_a" });
  });

  it("issuing -- failed --> failed", () => {
    const issuing: ScanState = { kind: "issuing", streamHandle: "sh_a" };
    expect(nextScanState(issuing, { kind: "failed" })).toEqual<ScanState>({ kind: "failed", streamHandle: "sh_a" });
  });

  it("delivering -- failed --> failed", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 3 };
    expect(nextScanState(delivering, { kind: "failed" })).toEqual<ScanState>({ kind: "failed", streamHandle: "sh_a" });
  });

  it("completed/failed while idle are no-ops (defensive, never crashes)", () => {
    expect(nextScanState(idle, { kind: "completed" })).toEqual<ScanState>(idle);
    expect(nextScanState(idle, { kind: "failed" })).toEqual<ScanState>(idle);
  });

  // P4 binding note 6, the load-bearing property: "a cancelled stream's terminal never reaches App"
  // -- the machine must reach `cancelled` from the cancel call site ALONE, never waiting on (or
  // needing) a `completed`/`failed` event that, for a self-cancelled stream, will never arrive.
  it("cancel-without-terminal: issuing -- cancelledByUser(same handle) --> cancelled(rows: 0), no batch ever arrived", () => {
    const issuing: ScanState = { kind: "issuing", streamHandle: "sh_a" };
    expect(nextScanState(issuing, { kind: "cancelledByUser", streamHandle: "sh_a" })).toEqual<ScanState>({
      kind: "cancelled",
      streamHandle: "sh_a",
      rows: 0,
    });
  });

  it("cancel-without-terminal: open-no-rows -- cancelledByUser(same handle) --> cancelled(rows: 0)", () => {
    const openNoRows: ScanState = { kind: "open-no-rows", streamHandle: "sh_a" };
    expect(nextScanState(openNoRows, { kind: "cancelledByUser", streamHandle: "sh_a" })).toEqual<ScanState>({
      kind: "cancelled",
      streamHandle: "sh_a",
      rows: 0,
    });
  });

  it("cancel-without-terminal: delivering(rows) -- cancelledByUser(same handle) --> cancelled(rows), carrying the count forward", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 12_345 };
    expect(nextScanState(delivering, { kind: "cancelledByUser", streamHandle: "sh_a" })).toEqual<ScanState>({
      kind: "cancelled",
      streamHandle: "sh_a",
      rows: 12_345,
    });
  });

  // P6 review, should-fix 1: `cancelledByUser` now carries a `streamHandle` and no-ops on mismatch,
  // mirroring `streamOpened`'s own guard -- a stale cancel meant for an already-superseded handle
  // must never mark a FRESHLY-issued stream cancelled.
  it("a cancelledByUser for a DIFFERENT (stale) handle than the one currently tracked is a no-op", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_current", rows: 42 };
    expect(nextScanState(delivering, { kind: "cancelledByUser", streamHandle: "sh_stale" })).toEqual<ScanState>(
      delivering
    );
  });

  it("once cancelled, a LATE completed/failed/batch/streamOpened for the same handle changes nothing", () => {
    const cancelled: ScanState = { kind: "cancelled", streamHandle: "sh_a", rows: 7 };
    expect(nextScanState(cancelled, { kind: "completed" })).toEqual<ScanState>(cancelled);
    expect(nextScanState(cancelled, { kind: "failed" })).toEqual<ScanState>(cancelled);
    expect(nextScanState(cancelled, { kind: "batch", rows: 99 })).toEqual<ScanState>(cancelled);
    expect(nextScanState(cancelled, { kind: "streamOpened", streamHandle: "sh_a" })).toEqual<ScanState>(cancelled);
  });

  it("a cancelledByUser while idle/complete/cancelled/failed is a no-op", () => {
    expect(nextScanState(idle, { kind: "cancelledByUser", streamHandle: "sh_a" })).toEqual<ScanState>(idle);
    const complete: ScanState = { kind: "complete", streamHandle: "sh_a" };
    expect(nextScanState(complete, { kind: "cancelledByUser", streamHandle: "sh_a" })).toEqual<ScanState>(complete);
  });

  it("a fresh issued event ALWAYS supersedes -- even a cancelled/complete/failed scan starts a new one", () => {
    const cancelled: ScanState = { kind: "cancelled", streamHandle: "sh_old", rows: 7 };
    expect(nextScanState(cancelled, { kind: "issued", streamHandle: "sh_new" })).toEqual<ScanState>({
      kind: "issuing",
      streamHandle: "sh_new",
    });
  });

  it("reset unconditionally returns idle -- the dataset-change clear", () => {
    const delivering: ScanState = { kind: "delivering", streamHandle: "sh_a", rows: 999 };
    expect(nextScanState(delivering, { kind: "reset" })).toEqual<ScanState>({ kind: "idle" });
  });
});

describe("isScanInFlight / scanLivenessText / scanLivenessTextShouldShow (P4 items 2, 6, 7)", () => {
  it("isScanInFlight is true for issuing/open-no-rows/delivering, false otherwise", () => {
    expect(isScanInFlight({ kind: "idle" })).toBe(false);
    expect(isScanInFlight({ kind: "issuing", streamHandle: "sh_a" })).toBe(true);
    expect(isScanInFlight({ kind: "open-no-rows", streamHandle: "sh_a" })).toBe(true);
    expect(isScanInFlight({ kind: "delivering", streamHandle: "sh_a", rows: 1 })).toBe(true);
    expect(isScanInFlight({ kind: "complete", streamHandle: "sh_a" })).toBe(false);
    expect(isScanInFlight({ kind: "cancelled", streamHandle: "sh_a", rows: 1 })).toBe(false);
    expect(isScanInFlight({ kind: "failed", streamHandle: "sh_a" })).toBe(false);
  });

  it("scanLivenessText: the two literal strings NEXT-CUT.md's design section names, no percentage/ETA/N-of-M", () => {
    expect(scanLivenessText({ kind: "open-no-rows", streamHandle: "sh_a" })).toBe(
      "Filtering — scanning, no matching rows yet"
    );
    expect(scanLivenessText({ kind: "delivering", streamHandle: "sh_a", rows: 250 })).toBe("Filtering — 250 rows so far");
  });

  it("scanLivenessText is null for idle/issuing and every terminal state", () => {
    expect(scanLivenessText({ kind: "idle" })).toBeNull();
    expect(scanLivenessText({ kind: "issuing", streamHandle: "sh_a" })).toBeNull();
    expect(scanLivenessText({ kind: "complete", streamHandle: "sh_a" })).toBeNull();
    expect(scanLivenessText({ kind: "cancelled", streamHandle: "sh_a", rows: 1 })).toBeNull();
    expect(scanLivenessText({ kind: "failed", streamHandle: "sh_a" })).toBeNull();
  });

  // The gating logic itself, pure: below the declared delay -> hidden; at/above it -> shown; never
  // shown at all when nothing is in flight, however much time has "elapsed".
  it("scanLivenessTextShouldShow is false below SCAN_LIVENESS_DELAY_MS, true at and above it", () => {
    const openNoRows: ScanState = { kind: "open-no-rows", streamHandle: "sh_a" };
    expect(scanLivenessTextShouldShow(openNoRows, 0)).toBe(false);
    expect(scanLivenessTextShouldShow(openNoRows, SCAN_LIVENESS_DELAY_MS - 1)).toBe(false);
    expect(scanLivenessTextShouldShow(openNoRows, SCAN_LIVENESS_DELAY_MS)).toBe(true);
    expect(scanLivenessTextShouldShow(openNoRows, SCAN_LIVENESS_DELAY_MS + 500)).toBe(true);
  });

  it("scanLivenessTextShouldShow is false when not in flight, regardless of elapsed time", () => {
    expect(scanLivenessTextShouldShow({ kind: "idle" }, SCAN_LIVENESS_DELAY_MS + 1000)).toBe(false);
    expect(scanLivenessTextShouldShow({ kind: "complete", streamHandle: "sh_a" }, SCAN_LIVENESS_DELAY_MS + 1000)).toBe(
      false
    );
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
    resetFitForNewGeneration: ReturnType<typeof vi.fn>;
  } {
    const calls: string[] = [];
    const cancelPendingDebounce = vi.fn(() => calls.push("cancel-debounce"));
    const requestViewport = vi.fn(async () => {
      calls.push("request-viewport");
      return issuedOutcome("sh_new");
    });
    const commitActiveFilter = vi.fn();
    const resetFitForNewGeneration = vi.fn();
    const deps: ApplyFilterDeps = {
      requestViewport,
      cancelPendingDebounce,
      getLastViewportBbox: () => bboxFixture(),
      getActiveFilter: () => null,
      commitActiveFilter,
      resetFitForNewGeneration,
      wait: async () => {},
      ...overrides,
    };
    return { deps, calls, requestViewport, cancelPendingDebounce, commitActiveFilter, resetFitForNewGeneration };
  }

  it("cancels the pending debounce FIRST, before requestViewport is ever called", async () => {
    const { deps, calls } = baseDeps();

    await applyFilter(filterFixture(), deps);

    expect(calls[0]).toBe("cancel-debounce");
    expect(calls[1]).toBe("request-viewport");
  });

  // Human-approved design revision, 2026-08-15 walkthrough Part E E5: Apply (and Clear, the SAME
  // code path with `newFilter: null`) now issues an UNRESTRICTED first look -- `bbox: null`, never
  // `getLastViewportBbox()` -- exactly like opening a dataset. Also resets the canvas's fit anchor
  // for the new filter generation, so the first-batch auto-fit lands on the matches.
  it("issues bbox: null (NOT getLastViewportBbox()) over the NEW filter, and on an issued outcome commits it + resets the fit anchor + returns {kind:'applied'}", async () => {
    const newFilter = filterFixture("zone = 'commercial'");
    const { deps, requestViewport, commitActiveFilter, resetFitForNewGeneration } = baseDeps({
      // Deliberately non-null, to prove the primary attempt ignores it entirely.
      getLastViewportBbox: () => bboxFixture(),
    });

    const outcome = await applyFilter(newFilter, deps);

    expect(requestViewport).toHaveBeenCalledWith(null, newFilter);
    expect(commitActiveFilter).toHaveBeenCalledWith(newFilter);
    expect(resetFitForNewGeneration).toHaveBeenCalledTimes(1);
    expect(outcome).toEqual({ kind: "applied", streamHandle: "sh_new" });
  });

  it("throttled-after-retry never becomes state: returns {kind:'not-applied'}, commitActiveFilter/resetFitForNewGeneration never called", async () => {
    const requestViewport = vi.fn().mockResolvedValue({ kind: "throttled" });
    const commitActiveFilter = vi.fn();
    const { deps, resetFitForNewGeneration } = baseDeps({ requestViewport, commitActiveFilter });

    const outcome = await applyFilter(filterFixture(), deps);

    expect(outcome).toEqual({ kind: "not-applied" });
    expect(commitActiveFilter).not.toHaveBeenCalled();
    expect(resetFitForNewGeneration).not.toHaveBeenCalled();
  });

  it("a refusal never becomes state, reports {kind:'refused', refusal}, and re-issues the LAST successfully-issued query (previous filter + lastViewportBbox, UNCHANGED recovery semantics) -- the typo-blanks-canvas fix", async () => {
    const previousFilter = filterFixture("zone = 'residential'"); // the last successfully-issued filter
    const bbox = bboxFixture();
    const skpError = skpErrorFixture();
    const requestViewport = vi
      .fn()
      // The Apply attempt itself, over the NEW (typo'd) filter -- refused. bbox: null (the design
      // revision), not getLastViewportBbox().
      .mockRejectedValueOnce(new SkpCallError(skpError))
      // The recovery re-issue, over the PREVIOUS filter -- succeeds. Recovery keeps its EXISTING
      // semantics: getLastViewportBbox(), not null -- it restores the last real view, not a fresh
      // unrestricted look.
      .mockResolvedValueOnce(issuedOutcome("sh_recovery"));
    const commitActiveFilter = vi.fn();
    const { deps, resetFitForNewGeneration } = baseDeps({
      requestViewport,
      getActiveFilter: () => previousFilter,
      getLastViewportBbox: () => bbox,
      commitActiveFilter,
    });
    const typoFilter = filterFixture("bogus_column_xyz = 1");

    const outcome = await applyFilter(typoFilter, deps);

    expect(outcome).toEqual({
      kind: "refused",
      refusal: { code: skpError.code, message: skpError.message, fields: [] },
    });
    expect(commitActiveFilter).not.toHaveBeenCalled(); // the refused typo never becomes state
    expect(resetFitForNewGeneration).not.toHaveBeenCalled(); // no new generation on a refusal
    expect(requestViewport).toHaveBeenCalledTimes(2);
    // The primary (refused) attempt: bbox: null, per the design revision.
    expect(requestViewport).toHaveBeenNthCalledWith(1, null, typoFilter);
    // Recovery: previous filter, over getLastViewportBbox() -- already-admitted, cannot itself be
    // refused on filter grounds (design section's own claim), and deliberately NOT bbox: null.
    expect(requestViewport).toHaveBeenNthCalledWith(2, bbox, previousFilter);
  });

  // NEXT-CUT.md P6 reviewer gate, B2 (blocking): the recovery attempt failing (too_many_pending_streams,
  // a transport failure, the dataset having since closed -- anything, not just a second filter refusal)
  // must never blank the refusal the user's OWN typed predicate actually earned, nor propagate and
  // surface as an unrelated global banner for a query the user never made.
  it("the recovery re-issue itself failing does not blank or swallow the user's own refusal -- outcome is still {kind:'refused'} with it", async () => {
    const previousFilter = filterFixture("zone = 'residential'");
    const bbox = bboxFixture();
    const skpError = skpErrorFixture();
    const recoveryError = new Error("skp.too_many_pending_streams");
    const requestViewport = vi
      .fn()
      // The Apply attempt itself, over the NEW (typo'd) filter -- refused.
      .mockRejectedValueOnce(new SkpCallError(skpError))
      // The recovery re-issue ALSO fails -- a non-filter rejection (transport/ceiling/dataset-closed),
      // not another SkpCallError necessarily, but any rejection at all is the case B2 covers.
      .mockRejectedValueOnce(recoveryError);
    const { deps } = baseDeps({
      requestViewport,
      getActiveFilter: () => previousFilter,
      getLastViewportBbox: () => bbox,
    });
    const typoFilter = filterFixture("bogus_column_xyz = 1");

    const outcome = await applyFilter(typoFilter, deps);

    // The user's own refusal, unchanged and un-swallowed -- not a thrown error, not {kind:"not-applied"}.
    expect(outcome).toEqual({
      kind: "refused",
      refusal: { code: skpError.code, message: skpError.message, fields: [] },
    });
    expect(requestViewport).toHaveBeenCalledTimes(2);
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

// P5f complex-gate must-fix 4 (the double-debounce fix): before this piece, `App.tsx`'s own
// `[admitted]` effect wrapped the candidate arm's `session.onViewportChanged` in a SECOND
// `debounce(fn, VIEWPORT_QUERY_MIN_INTERVAL_MS)` -- stacked on top of `candidateArmSession.ts`'s own
// internal debounce (`onViewportChanged` IS already that module's debounced entry point). The
// reviewer's own finding: "the existing test can't see the App layer" -- `candidateArmSession.test.ts`
// only ever drove `session.onViewportChanged` directly, in isolation, so a stacked SECOND layer added
// at the `App.tsx` call site was invisible to it. This test closes that blindness: it wires
// `makeCandidateViewportDispatcher` around a fake session whose OWN `onViewportChanged` debounces via
// the REAL `debounce()` module (mirroring `candidateArmSession.ts`'s own real internal wiring
// byte-for-byte), and asserts the WHOLE path -- from a raw `dispatcher.call(...)` through to the
// underlying handler actually firing -- crosses exactly ONE `VIEWPORT_QUERY_MIN_INTERVAL_MS` settle
// window, not two.
describe("makeCandidateViewportDispatcher (P5f complex-gate must-fix 4: the double-debounce fix)", () => {
  it("a raw viewport-change call settles after exactly ONE debounce window end to end, never two stacked ones", async () => {
    vi.useFakeTimers();
    try {
      const handler = vi.fn();
      // Mirrors `candidateArmSession.ts`'s own internal debounce exactly -- the real `debounce()`
      // module, the same constant, never a reimplementation.
      const sessionDebounced = debounce(handler, VIEWPORT_QUERY_MIN_INTERVAL_MS);
      const session = {
        onViewportChanged: (bbox: AuthoritativeBbox) => sessionDebounced.call(bbox),
        cancelPendingViewportChange: () => sessionDebounced.cancel(),
      };
      const dispatcher = makeCandidateViewportDispatcher(session);
      const bbox = bboxFixture();

      dispatcher.call(bbox, null);
      expect(handler).not.toHaveBeenCalled(); // still debouncing -- zero elapsed

      // Before this fix: a SECOND, App-owned debounce layer meant the underlying handler had not
      // fired even after this FULL settle window (the outer layer's own timer would still be
      // running, needing a second full window on top). This is the fix's own direct assertion.
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(handler).toHaveBeenCalledTimes(1);

      // `dispatcher.cancel()` reaches the session's own internal debounce directly (no App-owned
      // layer of its own to cancel instead) -- a call scheduled then cancelled never fires at all.
      dispatcher.call(bbox, null);
      dispatcher.cancel();
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(handler).toHaveBeenCalledTimes(1); // unchanged -- the second call was cancelled
    } finally {
      vi.useRealTimers();
    }
  });
});
