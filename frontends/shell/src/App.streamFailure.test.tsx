// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The stream-refusal piece S1 (`governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`
 * §4, APP-SR1 and APP-SR2): the seam's end-to-end test from the real shape. The REAL `App` and the REAL candidate session and
 * tile manager (the arm is `DEFAULT_RESIDENCY_ARM`, `"candidate"`: `setResidencyArm` is never called here), opened through the
 * `openPath` hook. The harness is `App.table.test.tsx`'s: the SKP transport (with a `SkpCallError` class carrying `skpError`, the
 * shape the manager reads), the data plane (each stream's sink kept), the baseline stream manager, the publish panel and the
 * WebGL canvas are mocked. The canvas stand-in reports one admitted row per batch and keeps the grid frame the session gives it.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PublishPanelHandle } from "./publish/PublishPanel";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";

type Sink = { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void };

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  queries: [] as unknown[][],
  /** One reject per tile query (`bbox` not null) still waiting for its answer, oldest first. */
  tileRejects: [] as Array<(err: unknown) => void>,
  sinks: new Map<string, { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void }>(),
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
  const MockPublishPanel = forwardRef<PublishPanelHandle, object>(function MockPublishPanel(_props, ref) {
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
import { __resetResidencyArmForTests } from "./residency/residencyArm";
import { SkpCallError } from "./skp/client";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** W1, the advisor's wording under the delegation (the form's §9), copied byte for byte from the form by script. */
const W1 = "The data for the map failed to load. Open the file again to retry.";
/** The app's existing within-budget partial sentence, unchanged (`residencyStatus.ts`). */
const PARTIAL = "Filling has finished for this view — some areas were not loaded; pan or zoom to load them.";

const wait = (ms: number): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, ms)));
const flush = (): Promise<void> => wait(0);

describe("App: a refused tile or a failed first look on the tiled arm leaves a status, and Cancel goes (the stream-refusal piece S1)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.mintCounter = 0;
    mocks.streamCounter = 0;
    mocks.queries = [];
    mocks.tileRejects = [];
    mocks.sinks.clear();
    mocks.canvas.props = null;
    mocks.grid = null;
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

  const q = (selector: string): HTMLElement | null => container.querySelector<HTMLElement>(selector);
  const sinkOf = (handle: string): Sink => {
    const sink = mocks.sinks.get(handle);
    if (!sink) throw new Error(`no stream started for ${handle}`);
    return sink;
  };

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
    await flush();
  }

  it("APP-SR1: at open, the first look's stream fails before any batch: the status bar reads W1, and no Cancel or scan line shows", async () => {
    await open("C:/data/a.parquet");
    expect(mocks.queries.map((args) => args[1])).toEqual([null]); // the first look, untiled
    act(() => sinkOf("st_t1").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" }));
    await flush();

    expect(q(".residency-status")?.textContent).toBe(W1);
    expect(q(".filter-cancel")).toBeNull();
    expect(q(".scan-liveness")).toBeNull();
  });

  it("APP-SR2: case A: the last tracked tile refused twice: the status bar reads the partial sentence, and Cancel goes", async () => {
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
    expect(q(".filter-cancel")).not.toBeNull();

    const refusal = () => new SkpCallError({ code: "engine.connections_exhausted", message: "no admission lease was available", fields: { class: "admission", capacity: "4" } });
    await act(async () => mocks.tileRejects.shift()!(refusal()));
    await flush();
    expect(mocks.tileRejects).toHaveLength(1); // the map asked again once
    await act(async () => mocks.tileRejects.shift()!(refusal()));
    await flush();

    expect(mocks.tileRejects).toHaveLength(0);
    expect(q(".residency-status")?.textContent).toBe(PARTIAL);
    expect(q(".filter-cancel")).toBeNull();
  });
});
