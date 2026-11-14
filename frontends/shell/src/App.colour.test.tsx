// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PB-R2, PB-R4 and PB-U11 (Amendments 12 and 16): Colour by through the REAL `App`. The harness is `App.table.test.tsx`'s (the SKP transport, the baseline
 * stream manager, the WebGL canvas and the export panel are the stand-ins), with the client's `recordStep` logged and the manager's `requestViewport` recording the filter it was asked for, as `App.command.test.tsx` has it.
 * The Style tab, the table source, `decodeBatch`, `readRow` and `categoryCases` are the real ones (I5), and the batches are the helper's IPC.
 */

import { readFileSync } from "node:fs";

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExportRunEnd, ExportRunReport, PublishPanelHandle, PublishPanelProps } from "./publish/PublishPanel";

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  queries: [] as unknown[][],
  cancels: [] as string[],
  recorded: [] as { dataset: string; intent: unknown }[],
  /** The manager's stand-in is the transport boundary for the canvas's own queries: every `requestViewport` and the filter it carried. */
  requests: [] as { filter: { predicate: string } | null }[],
  sinks: new Map<string, { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void }>(),
  exportRunning: null as null | ((run: ExportRunReport) => void),
  canvas: { props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  const field = (name: string, arrow_type: string, projectable: boolean) => ({ name, arrow_type, nullable: projectable, projectable });
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: { source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000", max_value: "99999", js_exact: true, class: "native", session_statement: null },
    schema: [field("id", "UInt64", false), field("zone", "Utf8", true), field("name", "Utf8", true), field("area", "Float64", true), field("geometry", "Binary", false)],
    covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
    sanity: { level: "none", reason: "the file declares its own CRS, so no format rule was applied and there is nothing assumed to check. Not checked" },
    coverage: { state: "watching", reason: null }, checks: { state: "full", components: [] }, session_end: null,
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
    recordStep: async (dataset: string, intent: unknown): Promise<Record<string, never>> => {
      mocks.recorded.push({ dataset, intent });
      return {};
    },
  };
});

vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));
vi.mock("./streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
vi.mock("./streaming/adapterWs", () => ({
  startStream: (opts: { ticketHandle: string; sink: { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void } }) => {
    mocks.sinks.set(opts.ticketHandle, opts.sink);
    return { cancel: () => {}, stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } };
  },
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    requestViewport(_bbox?: unknown, _bboxCrs?: unknown, _nowMs?: unknown, filter?: { predicate: string } | null): Promise<unknown> {
      mocks.requests.push({ filter: filter ?? null });
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
  const MockWorkingCanvas = forwardRef<import("./canvas/WorkingCanvas").WorkingCanvasHandle, import("./canvas/WorkingCanvas").WorkingCanvasProps>(function MockWorkingCanvas(props, ref) {
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
import { CATEGORY_NULL_COLOR, CATEGORY_OTHER_COLOR, CATEGORY_PALETTE } from "./style/styleConstants";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { SKP_VERSION } from "./skp/types";
import { attributeBatchIpc } from "./testUtils/attributeBatchIpc";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
const WIRE_FIXTURE = JSON.parse(readFileSync("../../protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json", "utf8")) as { skp: string; intent: { action: string; params: { value: { match: { cases: { when: string; then: string }[]; on_null: string; on_unmatched: string } } } } };

describe("App: Colour by (milestone 4 PR B), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { mintCounter: 0, streamCounter: 0, queries: [], cancels: [], recorded: [], requests: [], exportRunning: null });
    mocks.sinks.clear();
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
  const line = () => q(".style-colour-line")?.textContent ?? "(no line)";

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }
  /** Chooses `column` in the Style tab's chooser and presses Apply. */
  async function colourBy(column: string): Promise<void> {
    click(q("#inspector-tab-style"));
    const select = q<HTMLSelectElement>(".style-colour-column")!;
    act(() => {
      select.value = column;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    click(q(".style-colour-apply"));
    await flush();
  }
  /** One batch of the open's projection (zone, name, area) on the table's stream `handle`, with its terminal when `done`. */
  function deliver(handle: string, zones: Array<string | null>, done: boolean): void {
    const ids = zones.map((_, i) => BigInt(i + 1));
    const { ipc } = attributeBatchIpc(ids, [
      { name: "zone", kind: "utf8", values: zones },
      { name: "name", kind: "utf8", values: zones.map((z) => `n-${String(z)}`) },
      { name: "area", kind: "float64", values: zones.map(() => 1) },
    ]);
    act(() => {
      mocks.sinks.get(handle)!.onBatch(ipc, true);
      if (done) mocks.sinks.get(handle)!.onTerminal({ kind: "Completed", detail: "" });
    });
  }

  // RECORDED MUTATION for PB-R2, applied alone: in `styleTransitions` (workspace/viewTransitions.ts) a match emits the literal `next.fillColor` in place of the match.
  // Expected failure: the recorded intent is the literal.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-R2: the apply records one style.set whose intent is the wire fixture's, with the product's colours": AssertionError: the intent, in the wire fixture's shape and order: expected { action: 'style.set', …(1) } to deeply equal { action: 'style.set', …(1) }. Reverted after observing.
  // The same mutation also failed, in this file: OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U11: with the not-held state standing, a Colour by on a new column issues one re-issue under the active filter beside the cases query, and the same column issues none": AssertionError: one re-issue of the first look beside one cases query: expected [ 1, 1 ] to deeply equal [ 2, 1 ]. Reverted after observing.
  // The same mutation also failed, in this file: OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U11: with no not-held state, a Colour by issues its cases query and no re-issue": AssertionError: the style was applied: expected undefined to be 'zone' // Object.is equality. Reverted after observing.
  it("PB-R2: the apply records one style.set whose intent is the wire fixture's, with the product's colours", async () => {
    await open("C:/data/a.parquet");
    await colourBy("zone");
    expect(mocks.queries, "the apply's one cases query").toHaveLength(1);
    expect(line(), "the line while the cases query runs").toContain("Reading the first features");
    deliver("st_t1", ["park", "civic", null, "park"], true);
    await flush();
    await flush();
    expect(mocks.recorded, "record_step calls").toHaveLength(1);
    const expected = structuredClone(WIRE_FIXTURE.intent);
    const match = expected.params.value.match;
    match.cases.forEach((c, i) => (c.then = CATEGORY_PALETTE[i]));
    [match.on_null, match.on_unmatched] = [CATEGORY_NULL_COLOR, CATEGORY_OTHER_COLOR];
    expect(mocks.recorded[0].intent, "the intent, in the wire fixture's shape and order").toEqual(expected);
    expect(SKP_VERSION, "the version the fixture is written for").toBe(WIRE_FIXTURE.skp);
    expect(mocks.canvas.props!.style.fillMatch?.column, "the style the canvas draws").toBe("zone");
    expect([...container.querySelectorAll(".style-legend-label")].length, "two cases, No value and Other in the legend").toBe(4);
  });

  // RECORDED MUTATION for PB-R4, applied alone: in `waitForFirstScope` (style/categoryCases.ts) read the phase `cancelled` as a completed result, with the rows.
  // Expected failure: the apply is made after the cancel, and the line does not say that nothing was applied.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-R4: hiding Activity while the apply waits on the Table's stream applies no style and says so, and with an export held no viewport_query is issued": AssertionError: the line after the cancel: expected '[P6 placeholder] Coloured by zone: 2 …' to contain 'Nothing was applied'. Reverted after observing.
  it("PB-R4: hiding Activity while the apply waits on the Table's stream applies no style and says so, and with an export held no viewport_query is issued", async () => {
    await open("C:/data/a.parquet");
    click(q('.top-bar-toggle[aria-controls="region-activity"]'));
    click(q("#activity-tab-table"));
    await flush();
    expect(mocks.queries, "the Table's own stream").toHaveLength(1);
    deliver("st_t1", ["park", "civic"], false);
    await colourBy("zone");
    expect(mocks.queries, "the apply joined the Table's stream").toHaveLength(1);
    click(q('.top-bar-toggle[aria-controls="region-activity"]')); // hide Activity: the Table cancels its stream
    await flush();
    expect(mocks.cancels, "the stream the Table cancelled").toEqual(["st_t1"]);
    expect(line(), "the line after the cancel").toContain("Nothing was applied");
    expect([mocks.canvas.props!.style.fillMatch, mocks.recorded.length], "the style and the steps").toEqual([null, 0]);

    const held = { cancel: async () => true, ended: new Promise<ExportRunEnd>(() => {}) } satisfies ExportRunReport;
    await act(async () => mocks.exportRunning!(held));
    const before = mocks.queries.length;
    click(q(".style-colour-apply"));
    await flush();
    expect(mocks.queries.length, "viewport_query calls while the export holds the dataset").toBe(before);
    expect(line(), "the line while the export holds the dataset").toContain("export");
  });

  // RECORDED MUTATION for PB-U11, applied alone: in the Colour-by effect (App.tsx) skip the re-issue (`reportViewportOutcome(requestViewportWithSingleRetry(attempt), dataset)` is not called).
  // Expected failure: no re-issue of the first look.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U11: with the not-held state standing, a Colour by on a new column issues one re-issue under the active filter beside the cases query, and the same column issues none": AssertionError: one re-issue of the first look beside one cases query: expected [ 1, 1 ] to deeply equal [ 2, 1 ]. Reverted after observing.
  it("PB-U11: with the not-held state standing, a Colour by on a new column issues one re-issue under the active filter beside the cases query, and the same column issues none", async () => {
    await open("C:/data/a.parquet");
    await flush();
    act(() => mocks.canvas.props!.onAttributesNotHeld!());
    const mark = () => [mocks.requests.length, mocks.queries.length];
    const [requestsBefore, queriesBefore] = mark();
    await colourBy("zone");
    deliver("st_t1", ["park", "civic"], true);
    await flush();
    expect(mark(), "one re-issue of the first look beside one cases query").toEqual([requestsBefore + 1, queriesBefore + 1]);
    expect(mocks.requests[mocks.requests.length - 1].filter, "the active filter, none here").toBeNull();
    await colourBy("zone");
    expect(mark(), "the same column again: nothing issued").toEqual([requestsBefore + 1, queriesBefore + 1]);
    await colourBy("name"); // the completed first scope under the same filter is reused, so no second cases query
    await flush();
    expect(mocks.requests.length, "a second column re-issues once more").toBe(requestsBefore + 2);
  });

  it("PB-U11: with no not-held state, a Colour by issues its cases query and no re-issue", async () => {
    await open("C:/data/a.parquet");
    await flush();
    const requestsBefore = mocks.requests.length;
    await colourBy("zone");
    deliver("st_t1", ["park", "civic"], true);
    await flush();
    expect([mocks.requests.length - requestsBefore, mocks.queries.length], "re-issues and cases queries").toEqual([0, 1]);
    expect(mocks.canvas.props!.style.fillMatch?.column, "the style was applied").toBe("zone");
  });
});
