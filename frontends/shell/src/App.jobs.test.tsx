// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4 (J-A1, J-A2) and Amendment 2 (E-1 item 4) and Amendment 15 (items 6 and 7): the Jobs tab through the
 * REAL `App` on the shipped candidate arm (`setResidencyArm` is never called). The harness is `App.streamFailure.test.tsx`'s (the SKP transport, the data plane,
 * the baseline stream manager's stand-in and the WebGL canvas are replaced; the candidate session, the tile manager, `FilterPanel`, `JobsTab` and the store are
 * real) with one change, as `App.table.test.tsx`'s: the publish panel's stand-in keeps the `onExportRunning` App passed, and the test calls it with a report of
 * `ExportRunReport`'s real shape.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExportRunEnd, ExportRunReport, PublishPanelHandle, PublishPanelProps } from "./publish/PublishPanel";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";

type Sink = { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void };

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  queries: [] as unknown[][],
  /** One reject per tile query (`bbox` not null) still waiting for its answer, oldest first. */
  tileRejects: [] as Array<(err: unknown) => void>,
  sinks: new Map<string, { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void }>(),
  exportRunning: null as null | ((run: ExportRunReport) => void),
  canvas: { props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
  grid: null as null | { frame: import("./canvas/tileGrid").TileGridFrame; level: import("./canvas/tileGridConstants").TileGridLevel },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  const field = (name: string, arrow_type: string, projectable: boolean) => ({ name, arrow_type, nullable: projectable, projectable });
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: {
      identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null,
      definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed",
      provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre",
    },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: {
      source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000",
      max_value: "99999", js_exact: true, class: "native", session_statement: null,
    },
    schema: [field("id", "UInt64", false), field("zone", "Utf8", true), field("geometry", "Binary", false)],
    covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
    sanity: { level: "none", reason: "the file declares its own CRS, so no format rule was applied and there is nothing assumed to check. Not checked" },
    coverage: { state: "watching", reason: null },
    checks: { state: "full", components: [] },
    session_end: null,
  };
}

vi.mock("./skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(`${skpError.message} (${skpError.code})`);
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mocks.mintCounter += 1;
      const hex = mocks.mintCounter.toString(16).padStart(32, "0");
      return { dataset: `ds_${hex}`, session: `sr_${hex}` };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    viewportQuery: (...args: unknown[]): Promise<import("./skp/types").ViewportQueryResponse> => {
      mocks.queries.push(args);
      if (args[1] !== null) return new Promise((_, reject) => void mocks.tileRejects.push(reject)); // a tile: the test answers it
      return Promise.resolve({ stream: `st_t${++mocks.streamCounter}`, expires_in_ms: 30_000 });
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

vi.mock("./streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
vi.mock("./streaming/adapterWs", () => ({
  startStream: (opts: { ticketHandle: string; sink: Sink }) => {
    mocks.sinks.set(opts.ticketHandle, opts.sink);
    return { cancel: () => {}, stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } };
  },
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    requestViewport(): Promise<unknown> {
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

vi.mock("./publish/PublishPanel", () => {
  const MockPublishPanel = forwardRef<PublishPanelHandle, Pick<PublishPanelProps, "onExportRunning">>(function MockPublishPanel(props, ref) {
    mocks.exportRunning = props.onExportRunning;
    useImperativeHandle(ref, () => ({ reveal: () => {} }), []);
    return null;
  });
  return { default: MockPublishPanel };
});

vi.mock("./canvas/WorkingCanvas", () => {
  const ANCHOR = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_601_000, ymax: 1_201_000 };
  const MockWorkingCanvas = forwardRef<
    import("./canvas/WorkingCanvas").WorkingCanvasHandle,
    import("./canvas/WorkingCanvas").WorkingCanvasProps
  >(function MockWorkingCanvas(props, ref) {
    mocks.canvas.props = props;
    useImperativeHandle(
      ref,
      () => ({
        pushBatch: () => 0,
        clearStream: () => {},
        fitToBounds: () => true,
        resetFitForNewGeneration: () => {},
        getResidentCounts: () => ({ totalResidentVertices: 30, totalResidentFeatures: 3 }),
        armFirstPixelRenderHook: () => false,
        disarmFirstPixelRenderHook: () => true,
        pushTileBatch: () => ({ rowsAdmitted: 1, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: ANCHOR, batchExtent: ANCHOR }),
        clearTile: () => {},
        clearAllTiles: () => {},
        residentIdsStreamedUnder: () => new Set<bigint>(),
        isTileResidentInCandidateSet: () => false,
        isTileCompleteInCandidateSet: () => false,
        markTilePartial: () => {},
        markTileComplete: () => {},
        markTileResidentEmpty: () => {},
        establishTileGridContext: (frame, level) => {
          mocks.grid = { frame, level };
        },
        applyTileViewportContext: () => true,
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { tileBbox } from "./canvas/tileGrid";
import { EXPORT_JOB_TEXT, NOT_CANCELLED_TEXT, SCAN_JOB_TEXT } from "./jobs/jobs";
import { __resetResidencyArmForTests, getResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const wait = (ms: number): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, ms)));
const flush = (): Promise<void> => wait(0);

describe("App: the Jobs tab, through the real App on the shipped candidate arm (milestone 5 PR B)", () => {
  let container: HTMLDivElement;
  let root: Root;

  function setup(): void {
    mocks.mintCounter = 0;
    mocks.streamCounter = 0;
    mocks.queries = [];
    mocks.tileRejects = [];
    mocks.sinks.clear();
    mocks.exportRunning = null;
    mocks.canvas.props = null;
    mocks.grid = null;
    __resetResidencyArmForTests();
    expect(getResidencyArm(), "the shipped arm, setResidencyArm never called").toBe("candidate");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(<App />);
    });
  }
  function teardown(): void {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.__SPATIAL_E2E__ = undefined;
    __resetResidencyArmForTests();
  }
  beforeEach(setup);
  afterEach(teardown);

  const q = (selector: string): HTMLElement | null => container.querySelector<HTMLElement>(selector);
  const qa = (selector: string): HTMLElement[] => [...container.querySelectorAll<HTMLElement>(selector)];
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const sinkOf = (handle: string): Sink => {
    const sink = mocks.sinks.get(handle);
    if (!sink) throw new Error(`no stream started for ${handle}`);
    return sink;
  };
  const activity = () => click(q('.top-bar-toggle[aria-controls="region-activity"]'));
  const tab = (id: string) => click(q(`#activity-tab-${id}`));

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
    await flush();
  }

  /** APP-SR2's set-up (`App.streamFailure.test.tsx`): open, the first look's batch and terminal, then one pending tile. */
  async function openWithOnePendingTile(): Promise<void> {
    await open("C:/data/a.parquet");
    act(() => {
      sinkOf("st_t1").onBatch(new Uint8Array([1]), true);
      sinkOf("st_t1").onTerminal({ kind: "Completed", detail: "" });
    });
    await flush();
    expect(mocks.grid).not.toBeNull(); // the first look's terminal froze the grid frame
    const cell: AuthoritativeBbox = tileBbox(mocks.grid!.frame, mocks.grid!.level, { row: 0, col: 0 });
    const qx = (cell.xmax - cell.xmin) / 4;
    const qy = (cell.ymax - cell.ymin) / 4;
    act(() => mocks.canvas.props!.onViewportChanged({ xmin: cell.xmin + qx, ymin: cell.ymin + qy, xmax: cell.xmax - qx, ymax: cell.ymax - qy }));
    await wait(200); // past the session's debounce
    expect(mocks.tileRejects).toHaveLength(1); // one tile, tracked
  }

  // RECORDED MUTATION for J-A1: in `App.tsx` give `JobsTab` `onCancelScan={() => applyScanEvent({ kind: "reset" })}` in place of `handleCancelScan`.
  // Expected failure: the row and `.filter-cancel` go, but `relinquishFill` is not called, so the status is not the one FilterPanel's Cancel gives. J-E1 is the real-app test of the same seam; it is written and not run.
  // OBSERVED AT 12f326aa0004fc112a0ecfb37c10d710653f2a9c (2026-11-28): FAILED -- "J-A1: the Jobs scan row's Cancel is FilterPanel's Cancel: relinquishFill runs, the row and .filter-cancel go, .scan-incomplete stays absent, and the status is the one FilterPanel's Cancel gives": AssertionError: relinquishFill's own statement, the same as FilterPanel's Cancel gives: expected undefined to be 'Filling stopped — showing 3 features …'. Reverted after observing.
  it("J-A1: the Jobs scan row's Cancel is FilterPanel's Cancel: relinquishFill runs, the row and .filter-cancel go, .scan-incomplete stays absent, and the status is the one FilterPanel's Cancel gives", async () => {
    // The twin first: FilterPanel's own Cancel at the same point.
    await openWithOnePendingTile();
    expect(q(".filter-cancel")).not.toBeNull();
    const before = q(".residency-status")?.textContent;
    click(q(".filter-cancel"));
    await flush();
    const twin = q(".residency-status")?.textContent;
    expect(twin, "FilterPanel's Cancel changes the status").not.toBe(before);
    expect(twin).toBeTruthy();
    teardown();

    setup();
    await openWithOnePendingTile();
    activity();
    tab("jobs");
    expect(qa("#activity-panel-jobs .jobs-row-scan"), "the scan row stands").toHaveLength(1);
    expect(q("#activity-panel-jobs .jobs-row-scan")!.textContent).toContain(SCAN_JOB_TEXT);
    expect(q(".filter-cancel"), "and so does FilterPanel's Cancel").not.toBeNull();
    expect(q(".residency-status")?.textContent).toBe(before);

    click(q("#activity-panel-jobs .jobs-row-scan .jobs-cancel"));
    await flush();
    expect(qa("#activity-panel-jobs .jobs-row-scan"), "the row is gone").toHaveLength(0);
    expect(q(".filter-cancel"), "so is FilterPanel's Cancel").toBeNull();
    expect(q(".scan-incomplete"), "no incomplete-scan line").toBeNull();
    expect(q(".residency-status")?.textContent, "relinquishFill's own statement, the same as FilterPanel's Cancel gives").toBe(twin);
  });

  /** One export run, as `PublishPanel` reports it: the report's real shape. */
  function exportRun() {
    let end!: (value: ExportRunEnd) => void;
    const ended = new Promise<ExportRunEnd>((resolve) => (end = resolve));
    let cancels = 0;
    let answer: Promise<boolean> = Promise.resolve(false);
    const report: ExportRunReport = { cancel: () => ((cancels += 1), answer), ended };
    return { report, end, cancels: () => cancels, answerWith: (value: Promise<boolean>) => void (answer = value) };
  }
  const tableQueries = (): unknown[][] => mocks.queries.filter((args) => args[1] === null && args[3] === "1000");

  // RECORDED MUTATION for J-A2: in `handleExportRunning`'s `ended` handler (App.tsx) do not remove the run from `exportJobs`. Expected failure: the row stands after `ended`.
  // J-E2 is the real-app test of the same row; it is written and not run.
  // OBSERVED AT 12f326aa0004fc112a0ecfb37c10d710653f2a9c (2026-11-28): FAILED -- "J-A2: a run's report adds a row; its Cancel calls report.cancel once; ended removes the row and releases the consumer (the Table issues again)": AssertionError: ended removes the row: expected [ <div …(1)>…(3)</div> ] to have a length of +0 but got 1. Also failed: J-A2's second test ("two runs are two rows …"). Reverted after observing.
  it("J-A2: a run's report adds a row; its Cancel calls report.cancel once; ended removes the row and releases the consumer (the Table issues again)", async () => {
    await open("C:/data/a.parquet");
    activity();
    tab("table");
    await flush();
    expect(tableQueries(), "the Table's first scope").toHaveLength(1);

    const first = exportRun();
    await act(async () => mocks.exportRunning!(first.report));
    await flush();
    tab("jobs");
    expect(qa("#activity-panel-jobs .jobs-row-export"), "a report adds a row").toHaveLength(1);
    expect(q("#activity-panel-jobs .jobs-row-export")!.textContent).toContain(EXPORT_JOB_TEXT);
    tab("table");
    await flush();
    expect(tableQueries(), "the consumer is held: the Table asks nothing").toHaveLength(1);

    tab("jobs");
    let holdCancel!: (reached: boolean) => void;
    first.answerWith(new Promise<boolean>((resolve) => (holdCancel = resolve)));
    click(q("#activity-panel-jobs .jobs-row-export .jobs-cancel"));
    expect(first.cancels(), "the row's Cancel calls report.cancel").toBe(1);
    expect(q("#activity-panel-jobs .jobs-row-export .jobs-cancel")!.textContent).toBe("Cancelling");
    holdCancel(false);
    await flush();
    expect(q("#activity-panel-jobs .jobs-row-export .jobs-not-cancelled")?.textContent, "a false answer shows S-11 and the row stands").toBe(NOT_CANCELLED_TEXT);
    expect(qa("#activity-panel-jobs .jobs-row-export")).toHaveLength(1);

    tab("table");
    await act(async () => first.end({ phase: "execute", outcome: { status: "unknown-attempt" } }));
    await flush();
    expect(qa("#activity-panel-jobs .jobs-row-export"), "ended removes the row").toHaveLength(0);
    expect(tableQueries(), "and releases the consumer: the Table issues again").toHaveLength(2);
  });

  it("J-A2: two runs are two rows, in report order, and each leaves when its own run ends", async () => {
    await open("C:/data/a.parquet");
    const one = exportRun();
    const two = exportRun();
    await act(async () => mocks.exportRunning!(one.report));
    await act(async () => mocks.exportRunning!(two.report));
    await flush();
    expect(qa("#activity-panel-jobs .jobs-row-export")).toHaveLength(2);
    await act(async () => one.end({ phase: "prepare", outcome: { status: "picker-cancelled" } }));
    await flush();
    expect(qa("#activity-panel-jobs .jobs-row-export"), "the first run's row went; the second stands").toHaveLength(1);
    await act(async () => two.end({ phase: "execute", outcome: { status: "unknown-attempt" } }));
    await flush();
    expect(qa("#activity-panel-jobs .jobs-row-export")).toHaveLength(0);
  });
});
