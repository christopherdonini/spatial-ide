// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, RA1 and RA2: the workspace state of phase A,
 * through the REAL `App`. The harness is `App.layout.test.tsx`'s (the same mocked boundaries: the SKP transport,
 * the baseline stream manager, the WebGL canvas), with two changes the form's Amendment 2 item 4 names: every
 * `openDataset` and `closeDataset` is logged in order with its handle, and the mocked manager's
 * `requestViewport` resolves as issued, so an Apply commits. The workspace itself is never mocked (invalidator I6).
 */

import { act, forwardRef, useEffect, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  /** Every `openDataset` and `closeDataset` the mocked SKP client received, in order: `open:<handle>`, `close:<handle>`. */
  order: [] as string[],
  mintCounter: 0,
  canvas: {
    mounted: [] as string[],
    unmounted: [] as string[],
    props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null,
  },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
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
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }],
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
      this.name = "SkpCallError";
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    openDataset: async (): Promise<import("./skp/types").OpenDatasetResponse> => {
      mocks.mintCounter += 1;
      const hex = mocks.mintCounter.toString(16).padStart(32, "0");
      mocks.order.push(`open:ds_${hex}`);
      return { dataset: `ds_${hex}`, session: `sr_${hex}` };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (handle: string): Promise<import("./skp/types").CloseDatasetResponse> => {
      mocks.order.push(`close:${handle}`);
      return { cancelled_streams: 0 };
    },
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
    useEffect(() => {
      mocks.canvas.mounted.push(props.dataset);
      return () => {
        mocks.canvas.unmounted.push(props.dataset);
      };
    }, [props.dataset]);
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
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("App: the workspace state keyed by view (milestone 2, phase A), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.order = [];
    mocks.mintCounter = 0;
    mocks.canvas.mounted = [];
    mocks.canvas.unmounted = [];
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
  const inAct = (fn: () => void) => act(async () => fn());

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }

  function setValue(input: HTMLInputElement, value: string): void {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const press = (letter: string) =>
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: letter, code: `Key${letter.toUpperCase()}`, ctrlKey: true, bubbles: true, cancelable: true }));
    });

  /** Apply a filter through the real FilterPanel, edit the style through the real StylePanel, and run the layout actions. */
  async function applyStyleAndLayout(predicate: string, outlineWidth: string): Promise<void> {
    setValue(q<HTMLInputElement>(".filter-predicate")!, predicate);
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
    click(q("#inspector-tab-style"));
    if (q(".style-outline-width") === null) click(q(".style-disclosure"));
    setValue(q<HTMLInputElement>(".style-outline-width")!, outlineWidth);
    click(q("#inspector-tab-layer"));
    for (const letter of ["b", "i", "j"]) {
      press(letter);
      press(letter);
    }
    for (const button of container.querySelectorAll(".top-bar-toggle")) {
      click(button);
      click(button);
    }
  }

  // RECORDED MUTATION for "RA1": in `selectClosable` (workspaceState.ts) drop the `entry.consumers.length === 0` check, so a
  // resource is closed whether or not it still has a consumer. Expected failure: the live handle is closed at once.
  // OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "RA1: openDataset runs once per admission, closeDataset once per
  // replaced handle and after the new admission, and the map mounts once per handle": AssertionError: after the first admission:
  // expected [ …(2) ] to deeply equal [ Array(1) ] (the second entry is the close of the live handle). Reverted after observing.
  it("RA1: openDataset runs once per admission, closeDataset once per replaced handle and after the new admission, and the map mounts once per handle", async () => {
    const [a, b, c] = ["ds_" + "1".padStart(32, "0"), "ds_" + "2".padStart(32, "0"), "ds_" + "3".padStart(32, "0")];

    await open("C:/data/a.parquet");
    expect(mocks.order, "after the first admission").toEqual([`open:${a}`]);
    await applyStyleAndLayout("zone = 'residential'", "4");
    expect(mocks.order, "after Apply, a style edit and the layout actions").toEqual([`open:${a}`]);
    expect(mocks.canvas.mounted).toEqual([a]);

    await open("C:/data/b.parquet");
    expect(mocks.order, "the new admission first, then the old handle closed once").toEqual([`open:${a}`, `open:${b}`, `close:${a}`]);
    await applyStyleAndLayout("zone = 'industrial'", "6");
    await open("C:/data/c.parquet");
    expect(mocks.order).toEqual([`open:${a}`, `open:${b}`, `close:${a}`, `open:${c}`, `close:${b}`]);
    expect(mocks.canvas.mounted, "one mount per handle").toEqual([a, b, c]);
    expect(mocks.canvas.unmounted, "one unmount per replaced handle").toEqual([a, b]);
  });

  // RECORDED MUTATION for "RA2": in `admit` (workspaceState.ts) keep the filter on a rebind (`filter: view.filter`).
  // Expected failure: the reopened dataset still shows the Applied line of the filter.
  // OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "RA2: a reopen resets the filter and keeps the style": AssertionError: the filter is reset:
  // expected <p class="filter-active"></p> to be null. Reverted after observing.
  it("RA2: a reopen resets the filter and keeps the style", async () => {
    await open("C:/data/a.parquet");
    await applyStyleAndLayout("zone = 'residential'", "5");
    expect(q(".filter-active")?.textContent).toBe("Applied: zone = 'residential'");
    expect(mocks.canvas.props?.style.outlineWidth).toBe(5);

    await open("C:/data/b.parquet");
    expect(q(".filter-active"), "the filter is reset").toBeNull();
    expect(mocks.canvas.props?.dataset).not.toBe(mocks.canvas.mounted[0]);
    expect(mocks.canvas.props?.style.outlineWidth, "the style is kept").toBe(5);
  });
});
