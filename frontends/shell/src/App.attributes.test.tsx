// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PA-R2 and the App side of PA-U7 and PA-R1: the open's projection set and the inspected feature's
 * attributes, through the REAL `App`. The harness is `App.workspace.test.tsx`'s (the same mocked boundaries: the SKP transport, the baseline stream manager,
 * the WebGL canvas), with these changes: the manager stand-in keeps the options it was constructed with, the canvas stand-in keeps its latest props, and the
 * `describe` fixture projects two columns. A click is the real thing from the decode on: `attributeBatchIpc`'s bytes go through the real `decodeBatch`,
 * `resolveClickPick` and `readRow`, and the result is handed to the `onClickPick` that `App` passed, as the canvas would. Nothing in that path is mocked (I5).
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  /** The `columns` option of every `ViewportStreamManager` constructed. */
  managerColumns: [] as unknown[],
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
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    constructor(opts: { columns?: unknown }) {
      mocks.managerColumns.push(opts.columns);
    }
    requestViewport(): Promise<unknown> {
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
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
import type { BatchAttributes } from "./canvas/decodeBatch";
import { resolvePick } from "./canvas/pick";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { attributeBatchIpc } from "./testUtils/attributeBatchIpc";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("App: the open's projection set and the inspected feature's attributes (milestone 4 PR A), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.mintCounter = 0;
    mocks.managerColumns = [];
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
  const all = (selector: string) => [...container.querySelectorAll(selector)].map((e) => e.textContent);
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const props = () => mocks.canvas.props!;

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }

  /** A real batch of ids 1 and 2 with the columns of `describeFixture`, and the click on its `ordinal`-th part, resolved by the real `resolveClickPick`. */
  function realClick(zones: string[], areas: number[]) {
    const { ipc, encoding } = attributeBatchIpc(
      [1n, 2n],
      [
        { name: "zone", kind: "utf8", values: zones },
        { name: "area", kind: "float64", values: areas },
      ]
    );
    const batch = decodeBatch("st_1", 0, ipc, "geometry", encoding, props().projection);
    const on = (gpuOrdinal: number) =>
      resolveClickPick(
        { pickCandidateAt: () => ({ batch, gpuOrdinal }), belowPickResolutionNow: () => false, resolveCandidate: (c) => resolvePick(c.batch, c.gpuOrdinal) },
        1,
        1
      );
    return { batch, on };
  }

  it("PA-A1: hands the open's projection set to the manager and to the canvas", async () => {
    await open("C:/data/a.parquet");
    expect(mocks.managerColumns).toEqual([["zone", "area"]]);
    expect(props().projection).toEqual(["zone", "area"]);
  });

  // RECORDED MUTATION for "PA-R2": in `readRow` (attributes/values.ts) build each cell's value lazily (`get value() { return readCell(table.getChild(name)!, index); }`), so the
  // Feature tab reads the live batch at render. Expected failure: after the first batch's bytes are zeroed, the pinned feature's values change.
  it("PA-R2: the pinned feature keeps its values after its batch is superseded", async () => {
    await open("C:/data/a.parquet");
    click(q("#inspector-tab-feature"));
    const first = realClick(["north", "south"], [10.5, 20.25]);
    act(() => props().onClickPick!(first.on(0)));
    expect(all(".feature-attribute-name")).toEqual(["zone", "area"]);
    expect(all(".feature-attribute-value")).toEqual(["north", "10.5"]);
    expect(all(".feature-attributes-unprojected")).toEqual(["[P6 placeholder] Not projected: d32."]);

    click(q(".feature-pin"));
    (first.batch.attributes as BatchAttributes).data.fill(0); // the batch is superseded: its bytes are released
    const second = realClick(["east", "west"], [1, 2]);
    act(() => props().onClickPick!(second.on(1))); // a click on another feature leaves the pinned one inspected
    expect(all(".feature-id")[0]).toMatch(/^id 1( |$)/);
    expect(all(".feature-attribute-value")).toEqual(["north", "10.5"]);
  });

  it("shows a status item when the canvas keeps a batch without attributes, and not for the next open", async () => {
    await open("C:/data/a.parquet");
    expect(q(".attributes-not-held")).toBeNull();
    act(() => props().onAttributesNotHeld!());
    expect(q(".attributes-not-held")?.textContent).toContain("not held");
    await open("C:/data/b.parquet");
    expect(q(".attributes-not-held")).toBeNull();
  });
});
