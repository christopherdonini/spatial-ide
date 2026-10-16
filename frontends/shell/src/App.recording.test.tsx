// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1B-RECORDING-PREREGISTRATION.md section 4, A1 to A3: what the real `App` sends to `record_step`, and what it shows when a
 * step is not kept. The harness is `App.workspace.test.tsx`'s (the same mocked boundaries: the SKP transport, the baseline
 * stream manager, the WebGL canvas), with `recordStep` logged, and refused on demand, and the manager's `requestViewport`
 * refusing the predicate `bad`. The workspace, the filter panel, the style panel and the step queue are never mocked.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  /** Every `recordStep` the mocked client received, in order. */
  recorded: [] as { dataset: string; intent: unknown }[],
  /** When set, `recordStep` is refused with this message. */
  refuseRecordWith: null as string | null,
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
      return { dataset: `ds_${hex}`, session: `sr_${hex}` };
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
    recordStep: async (dataset: string, intent: unknown): Promise<Record<string, never>> => {
      mocks.recorded.push({ dataset, intent });
      if (mocks.refuseRecordWith !== null) {
        throw new SkpCallError({ code: "skp.session_history_stopped", message: mocks.refuseRecordWith, fields: {} });
      }
      return {};
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async () => () => {},
}));

vi.mock("./streaming/viewportStreamManager", async () => {
  const { SkpCallError } = await import("./skp/client");
  class MockViewportStreamManager {
    requestViewport(_bbox: unknown, _bboxCrs: unknown, _limit: unknown, filter?: { predicate: string } | null): Promise<unknown> {
      if (filter?.predicate === "bad") {
        return Promise.reject(new SkpCallError({ code: "skp.filter_unknown_column", message: "no such column", fields: {} }));
      }
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
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const filterOf = (predicate: string) => ({ action: "filter.apply", params: { filter: { predicate, dialect: "duckdb-expr/0" } } });

describe("App: a committed filter or style edit is recorded in the session history (B2 piece 1b), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.mintCounter = 0;
    mocks.recorded = [];
    mocks.refuseRecordWith = null;
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

  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
  }

  /** One `input` event, which is one drag tick of a range or one move of a colour picker. */
  function setValue(input: HTMLInputElement, value: string): void {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  async function apply(predicate: string): Promise<void> {
    setValue(q<HTMLInputElement>(".filter-predicate")!, predicate);
    await act(async () => q<HTMLButtonElement>(".filter-apply")!.click());
  }

  // RECORDED MUTATION for "A1": in `handleApplyFilter` (App.tsx) enqueue the `filter.apply` step before `applyFilter(...)`
  // resolves, instead of in `commitActiveFilter`. Expected failure: the refused Apply of `bad` is recorded.
  it("A1: an issued Apply records one filter.apply; a refused Apply and the admission reset record none", async () => {
    await open("C:/data/a.parquet");
    const a = "ds_" + "1".padStart(32, "0");

    await apply("bad");
    expect(mocks.recorded, "a refused Apply records none").toEqual([]);

    await apply("zone = 'residential'");
    expect(mocks.recorded, "an issued Apply records one").toEqual([{ dataset: a, intent: filterOf("zone = 'residential'") }]);

    await open("C:/data/b.parquet");
    expect(q(".filter-active"), "the admission reset cleared the filter").toBeNull();
    expect(mocks.recorded, "the admission reset records none").toHaveLength(1);
  });

  // RECORDED MUTATION for "A2": in `App.tsx` `handleStyleChange` (the per-tick `onChange` path), enqueue each `style.set`
  // transition as well. Expected failure: a step is recorded while the drag is live.
  it("A2: a style drag records one style.set at release, not one per tick", async () => {
    await open("C:/data/a.parquet");
    click(q("#inspector-tab-style"));
    click(q(".style-disclosure"));
    const range = q<HTMLInputElement>(".style-fill-opacity")!;

    for (const tick of ["0.30", "0.31", "0.32"]) setValue(range, tick);
    expect(mocks.recorded, "no step while the drag is live").toEqual([]);

    act(() => {
      range.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(mocks.recorded).toEqual([
      { dataset: "ds_" + "1".padStart(32, "0"), intent: { action: "style.set", params: { property: "fillOpacity", value: 0.32 } } },
    ]);
  });

  // RECORDED MUTATION for "A3": in `drain` (stepRecorder.ts) do not report a failed send. Expected failure: no notice stands.
  it("A3: a refused record shows the owner's notice with the kernel's message", async () => {
    mocks.refuseRecordWith = "this session history takes no more steps: an earlier write to it failed";
    await open("C:/data/a.parquet");

    await apply("zone = 'residential'");
    expect(mocks.recorded).toHaveLength(1);
    const notice = q(".record-notice");
    expect(notice?.textContent).toBe(
      "Filter applied. The session history did not confirm keeping it: this session history takes no more steps: an earlier write to it failed"
    );
    expect(q(".filter-active")?.textContent, "the filter stays applied").toBe("Applied: zone = 'residential'");
  });

  // RECORDED MUTATIONS for "A4", each applied alone (Amendment 8, the architect's C-3). (i) In `handleStyleCommit` (App.tsx) remove
  // `recordNamed("gui-action", "style.resetToDefault")`. Expected failure: the Reset at the default shows no console row. (ii) In the same
  // line remove the `transitions.length === 0` condition. Expected failure: the Reset that changed the style also shows a row.
  it("A4: a Reset that changes nothing records no step and shows one console row; a Reset that changes the style records its steps and shows none", async () => {
    await open("C:/data/a.parquet");
    click(q("#inspector-tab-style"));
    click(q(".style-disclosure"));
    const resetRows = () => consoleRecorder.entries().filter(isGuiActionEntry).filter((e) => e.action === "style.resetToDefault").length;
    const before = resetRows();

    click(q(".style-reset"));
    expect(mocks.recorded, "a Reset at the default records no step").toEqual([]);
    expect(resetRows() - before, "and shows one console row").toBe(1);

    const range = q<HTMLInputElement>(".style-fill-opacity")!;
    setValue(range, "0.30");
    act(() => {
      range.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(mocks.recorded, "the edit is recorded").toHaveLength(1);
    await act(async () => q<HTMLButtonElement>(".style-reset")!.click());
    expect(mocks.recorded, "a Reset that changes the style records its step").toHaveLength(2);
    expect(resetRows() - before, "and shows no further row").toBe(1);
  });
});
