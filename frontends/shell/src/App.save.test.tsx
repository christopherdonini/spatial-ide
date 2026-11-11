// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 12, the two App-level rows of step 1, through the REAL `App`, `StudioLayout`, `CommandBar` and
 * action registry. The harness is `App.command.test.tsx`'s (the same mocked boundaries: the SKP transport, the baseline stream manager, the WebGL
 * canvas), with the client's `saveProject` logged, the canvas stand-in answering `currentView` from the test, and the folder picker counted.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  opens: 0,
  /** Every `saveProject` the mocked client received, in order. */
  saves: [] as { dataset: string; folder: string | null; workspace: unknown }[],
  /** How many times the folder picker was opened. */
  picks: 0,
  /** What the canvas stand-in answers for `currentView`. */
  view: null as { centre: [number, number]; zoom: number } | null,
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
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
    saveProject: async (dataset: string, folder: string | null, workspace: unknown): Promise<import("./skp/types").SaveProjectResponse> => {
      mocks.saves.push({ dataset, folder, workspace });
      return { project: "spatial://project/00000000000000000000000000000001", history_mark: "written" };
    },
  };
});

vi.mock("./project/saveProject", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./project/saveProject")>()),
  pickProjectFolder: async (): Promise<string | null> => {
    mocks.picks += 1;
    return "C:/projects/parcels";
  },
}));

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
import { COMMAND_UNAVAILABLE_NOTE } from "./command/CommandBar";
import { NO_VIEW_NOTICE, SAVED_NOTICE } from "./project/saveProject";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { encodeHexF64 } from "./skp/codec";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("App: Save project (B2 piece 1c), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { opens: 0, saves: [], picks: 0, view: { centre: [2_600_050.5, 1_200_050.25], zoom: 7.5 } });
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
  const text = (selector: string): string => q(selector)?.textContent ?? `(no element matches ${selector})`;
  const inAct = (fn: () => void | Promise<void>) => act(async () => fn());
  const bar = () => q<HTMLInputElement>(".command-input")!;

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

  /** Types `draft` into the bar and presses Enter on it. */
  async function runBar(draft: string): Promise<void> {
    act(() => bar().focus());
    setValue(bar(), draft);
    await inAct(() => {
      bar().dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
    });
  }

  // RECORDED MUTATION for "the save word and the control": in StudioLayout.tsx's `runAction`, delete the `project.save` arm (`else if (id === "project.save") onSaveProject?.();`).
  // Expected failure: the bar's /save sends nothing.
  it("the save word in the command bar and the save control each send save_project once, and with no dataset the entry is not available", async () => {
    await runBar("/save");
    expect(text(".command-note"), "an unavailable entry never runs").toBe(COMMAND_UNAVAILABLE_NOTE);
    expect(q(".save-project"), "no control without a dataset").toBeNull();
    expect([mocks.picks, mocks.saves.length], "nothing was asked or sent").toEqual([0, 0]);

    await open("C:/data/parcels.parquet");
    expect(q(".save-project"), "the control is there once a dataset is admitted").not.toBeNull();

    await runBar("/save");
    expect([mocks.picks, mocks.saves.length], "the bar's word: one folder asked, one save sent").toEqual([1, 1]);
    expect(mocks.saves[0].folder).toBe("C:/projects/parcels");
    expect(mocks.saves[0].workspace).toMatchObject({ filter: null, view: { centre: [encodeHexF64(2_600_050.5), encodeHexF64(1_200_050.25)], zoom: encodeHexF64(7.5) } });
    expect(text(".save-notice")).toBe(SAVED_NOTICE);

    await inAct(() => q<HTMLButtonElement>(".save-project")!.click());
    expect([mocks.picks, mocks.saves.length], "the control: one more save, the folder not asked again").toEqual([1, 2]);
    expect(mocks.saves[1].folder).toBeNull();
  });

  // RECORDED MUTATION for "no view": in App.tsx's `handleSaveProject`, answer `{ centre: [0, 0], zoom: 0 }` where the canvas gives no view (`?? { centre: [0, 0], zoom: 0 }` for `?? null`).
  // Expected failure: a save is sent with a centre and zoom of 0.
  it("with no view from the canvas a save sends nothing and shows the not-saved notice", async () => {
    await open("C:/data/parcels.parquet");
    mocks.view = null;
    await inAct(() => q<HTMLButtonElement>(".save-project")!.click());
    expect([mocks.picks, mocks.saves.length], "no folder asked, nothing sent").toEqual([0, 0]);
    expect(text(".save-notice")).toBe(NO_VIEW_NOTICE);
  });
});
