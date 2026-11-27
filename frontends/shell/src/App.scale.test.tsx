// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-SCALE-DISPLAY-PREREGISTRATION.md §4, R-SC1, through the REAL `App`, `StudioLayout` and `ScaleItem`. The mocked boundaries are
 * `App.save.test.tsx`'s (the SKP transport, the baseline stream manager, the WebGL canvas); the canvas stand-in keeps the props it was
 * rendered with, so the test fires the canvas's three reports itself, and answers `currentView` from the test.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  opens: 0,
  /** The unit the next describe answers with. */
  unit: "metre" as import("./skp/types").CrsUnit,
  /** What the canvas stand-in answers for `currentView`. */
  view: null as { centre: [number, number]; zoom: number } | null,
  /** The props the newest canvas stand-in was rendered with. */
  canvas: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null,
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: mocks.unit },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: { source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000", max_value: "99999", js_exact: true, class: "native", session_statement: null },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }, { name: "geometry", arrow_type: "Binary", nullable: false, projectable: false }],
    covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
    extent: { basis: "not-established-at-open", value: null },
    license: { license: null, attribution: null, redistribution: null, declares_anything: false },
    sanity: { level: "none", reason: "the file declares its own CRS, so no format rule was applied and there is nothing assumed to check. Not checked" },
    coverage: { state: "watching", reason: null }, checks: { state: "full", components: [] }, session_end: null,
  };
}

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
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mocks.opens += 1;
      const hex = mocks.opens.toString(16).padStart(32, "0");
      return { dataset: `ds_${hex}`, session: `sr_${hex}` };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
    recordStep: async (): Promise<Record<string, never>> => ({}),
  };
});

vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    async requestViewport(): Promise<unknown> {
      return { kind: "issued", streamHandle: "st_1" };
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

vi.mock("./canvas/WorkingCanvas", () => {
  const MockWorkingCanvas = forwardRef<import("./canvas/WorkingCanvas").WorkingCanvasHandle, import("./canvas/WorkingCanvas").WorkingCanvasProps>(function MockWorkingCanvas(props, ref) {
    mocks.canvas = props;
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
        currentView: () => mocks.view,
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const BOX = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_100, ymax: 1_200_100 };

describe("App: the status bar's scale (SHELL-SCALE-DISPLAY R-SC1), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { opens: 0, unit: "metre", view: null, canvas: null });
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

  const item = () => container.querySelector<HTMLElement>(".status-scale");
  const barWidth = () => container.querySelector<HTMLElement>(".status-scale-bar")?.style.width ?? null;

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }

  // RECORDED MUTATION R-SC1 (M5): in `ScaleItem`, the `useSyncExternalStore` call becomes one plain read, `const zoom = getBox() === null ? null : readZoom();`,
  // so the item reads once per render and does not subscribe. Expected failure: case (ii), the item is still empty after `onViewShown`.
  it("the scale item follows the box the canvas reports, at the zoom the canvas holds, for the dataset on the map", async () => {
    // (i) The dataset is on the map and its canvas has reported nothing: no item, though the stand-in already answers a zoom.
    mocks.view = { centre: [2_600_050, 1_200_050], zoom: 0 };
    await open("C:/data/parcels.parquet");
    expect(mocks.canvas, "the canvas stand-in was rendered").not.toBeNull();
    expect(item(), "(i) nothing before a report").toBeNull();

    // (ii) One report at zoom 0, in one act, asserted at once: L 100, 100 CSS px, SHELL-SCALE-DISPLAY S-1.
    act(() => mocks.canvas!.onViewShown!(BOX));
    expect(item()?.textContent, "(ii) the label for zoom 0").toBe("[P6 placeholder] 100 m (CRS)");
    expect(barWidth(), "(ii) the bar's width in CSS px").toBe("100px");
    expect(item()?.getAttribute("title"), "(ii) the title carries the length").toContain("A length of 100 metres");
    expect(item()?.getAttribute("aria-label"), "(ii) the accessible name is the title").toBe(item()?.getAttribute("title"));
    expect(item()?.getAttribute("role"), "no live region").toBeNull();

    // (iii) The canvas holds zoom -3 and reports a box: L 500, 62.5 CSS px.
    mocks.view = { centre: [2_600_050, 1_200_050], zoom: -3 };
    act(() => mocks.canvas!.onViewportChanged(BOX));
    expect(item()?.textContent, "(iii) the label for zoom -3").toBe("[P6 placeholder] 500 m (CRS)");
    expect(barWidth(), "(iii) the bar's width in CSS px").toBe("62.5px");

    // (iv) A second open whose describe names degrees: nothing until its own canvas reports, then SHELL-SCALE-DISPLAY S-3 and no bar.
    mocks.unit = "degree";
    await open("C:/data/degrees.parquet");
    expect(item(), "(iv) nothing until the new canvas reports, though the old box was a bar").toBeNull();
    act(() => mocks.canvas!.onViewShown!(BOX));
    expect(item()?.textContent, "(iv) the not-metre line").toBe("[P6 placeholder] No scale bar: this dataset's coordinates are not known to be in metres.");
    expect(barWidth(), "(iv) no bar").toBeNull();
  });
});
