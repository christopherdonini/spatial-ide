// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PC-U4 and the App side of the table (section 2.4): the Table tab in Activity, through the REAL `App`. The harness is `App.attributes.test.tsx`'s (the same mocked
 * boundaries: the SKP transport, the baseline stream manager, the WebGL canvas), with these changes: the transport records the table's `viewport_query` and `cancel` calls and hands out stream handles, `startStream` keeps
 * each stream's sink, and `PublishPanel` is a stand-in that hands the test the `onExportRunning` callback `App` passed (the platform stand-in reading of Amendment 4 item 8; no export is run). The table's source, `decodeBatch`,
 * `readRow` and the grid are the real ones (I5), and the batches are the helper's IPC.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  queries: [] as unknown[][],
  cancels: [] as string[],
  sinks: new Map<string, { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void }>(),
  exportRunning: null as null | ((run: { cancel: () => Promise<boolean>; ended: Promise<unknown> }) => void),
  canvas: { props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
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
    schema: [field("id", "UInt64", false), field("zone", "Utf8", true), field("area", "Float64", true), field("d32", "Date32", false), field("geometry", "Binary", false)],
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
  class SkpCallError extends Error {}
  return {
    SkpCallError,
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mocks.mintCounter += 1;
      const hex = mocks.mintCounter.toString(16).padStart(32, "0");
      return { dataset: `ds_${hex}`, session: `sr_${hex}` };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (handle: string): Promise<import("./skp/types").CancelResponse> => {
      mocks.cancels.push(handle);
      return { state: "requested" };
    },
    viewportQuery: async (...args: unknown[]): Promise<import("./skp/types").ViewportQueryResponse> => {
      mocks.queries.push(args);
      return { stream: `st_t${++mocks.streamCounter}`, expires_in_ms: 30_000 };
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

vi.mock("./streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
vi.mock("./streaming/adapterWs", () => ({
  startStream: (opts: { ticketHandle: string; sink: { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void } }) => {
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
  const MockPublishPanel = forwardRef<{ reveal(): void }, { onExportRunning: NonNullable<typeof mocks.exportRunning> }>(function MockPublishPanel(props, ref) {
    mocks.exportRunning = props.onExportRunning;
    useImperativeHandle(ref, () => ({ reveal: () => {} }), []);
    return null;
  });
  return { default: MockPublishPanel };
});

vi.mock("./canvas/WorkingCanvas", () => {
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
        getResidentCounts: () => ({ totalResidentVertices: 0, totalResidentFeatures: 0 }),
        armFirstPixelRenderHook: () => false,
        disarmFirstPixelRenderHook: () => true,
        pushTileBatch: () => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null, batchExtent: null }),
        clearTile: () => {},
        clearAllTiles: () => {},
        residentIdsStreamedUnder: () => new Set<bigint>(),
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

import App from "./App";
import { resolveClickPick } from "./canvas/clickPick";
import { decodeBatch } from "./canvas/decodeBatch";
import { resolvePick } from "./canvas/pick";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { attributeBatchIpc } from "./testUtils/attributeBatchIpc";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));

describe("App: the Table tab in Activity (milestone 4 PR C), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.mintCounter = 0;
    mocks.streamCounter = 0;
    mocks.queries = [];
    mocks.cancels = [];
    mocks.sinks.clear();
    mocks.exportRunning = null;
    mocks.canvas.props = null;
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

  const q = <T extends Element = HTMLElement>(selector: string): T | null => container.querySelector<T>(selector);
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const cells = (): string[] => [...container.querySelectorAll('.table-tab [role="gridcell"]')].map((cell) => cell.textContent ?? "");
  const props = () => mocks.canvas.props!;

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }
  const activity = () => click(q('.top-bar-toggle[aria-controls="region-activity"]'));
  const tab = (id: string) => click(q(`#activity-tab-${id}`));
  const sinkOf = (handle: string) => mocks.sinks.get(handle)!;
  const run = () => {
    let end!: (value: unknown) => void;
    const ended = new Promise<unknown>((resolve) => (end = resolve));
    return { run: { cancel: async () => true, ended }, end };
  };

  it("the Table tab is third in Activity; the table issues nothing until it is shown, then one query with bbox null, the limit, the view's filter and the open's projection", async () => {
    await open("C:/data/a.parquet");
    expect([...container.querySelectorAll("#region-activity [role='tab']")].map((t) => t.textContent)).toEqual(["Console", "Notices", "[P6 placeholder] Table"]);
    await flush();
    expect(mocks.queries).toEqual([]);
    activity();
    await flush();
    expect(mocks.queries).toEqual([]); // Activity is open on the Console tab
    tab("table");
    await flush();
    expect(mocks.queries).toHaveLength(1);
    expect(mocks.queries[0].slice(1)).toEqual([null, null, "1000", null, ["zone", "area"]]);
    expect(q(".table-liveness")?.textContent).toContain("Loading features");

    tab("console");
    await flush();
    expect(mocks.cancels).toEqual(["st_t1"]); // another tab selected: the stream is cancelled
  });

  // RECORDED MUTATION for "PC-U4": in `App`, ignore the consumer (`const exportHeld = false;`). Expected failure: the table issued a query while an export run held its consumer.
  it("PC-U4: nothing is issued while an export consumer is held, a reported run cancels the table's stream, and the table issues again when the run ends", async () => {
    await open("C:/data/a.parquet");
    activity();
    tab("table");
    await flush();
    expect(mocks.queries).toHaveLength(1);

    const first = run();
    await act(async () => mocks.exportRunning!(first.run));
    await flush();
    expect(mocks.cancels).toEqual(["st_t1"]); // the run's report cancels the table's running stream
    expect(q(".table-liveness")).toBeNull();

    tab("console");
    tab("table"); // shown again, but the consumer is held
    await flush();
    expect(mocks.queries).toHaveLength(1);
    expect(q(".table-note")?.textContent).toContain("not loading while an export runs");

    await act(async () => first.end({ phase: "execute", outcome: { kind: "cancelled" } }));
    await flush();
    expect(mocks.queries).toHaveLength(2);
    expect(q(".table-note")).toBeNull();
  });

  it("a selected feature's clicked row reaches the second and third scopes, whose columns are the open's projection", async () => {
    await open("C:/data/a.parquet");
    const { ipc, encoding } = attributeBatchIpc([1n, 2n], [{ name: "zone", kind: "utf8", values: ["north", "south"] }, { name: "area", kind: "float64", values: [10.5, 20.25] }]);
    const batch = decodeBatch("st_1", 0, ipc, "geometry", encoding, props().projection, null);
    const feature = resolveClickPick({ pickCandidateAt: () => ({ batch, gpuOrdinal: 0 }), belowPickResolutionNow: () => false, resolveCandidate: (c) => resolvePick(c.batch, c.gpuOrdinal) }, 1, 1);
    click([...container.querySelectorAll(".tool-switch-button")].find((b) => b.textContent === "Select") ?? null);
    act(() => props().onClickPick!(feature));
    activity();
    tab("table");
    await flush();
    sinkOf("st_t1").onBatch(ipc, true);
    sinkOf("st_t1").onTerminal({ kind: "Completed", detail: "" });
    await flush();
    expect(cells()).toEqual(["1", "north", "10.5", "2", "south", "20.25"]);

    const select = q<HTMLSelectElement>(".table-scope select")!;
    const before = consoleRecorder.count();
    for (const value of ["selected", "selected-ignoring-filter"]) {
      act(() => {
        select.value = value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      expect(cells()).toEqual(["1", "north", "10.5"]);
    }
    expect(mocks.queries).toHaveLength(1); // neither selection scope asked the kernel for anything
    expect(consoleRecorder.entries().slice(before).filter(isGuiActionEntry).map((entry) => entry.action)).toEqual(["table.scopeSet", "table.scopeSet"]);
  });
});
