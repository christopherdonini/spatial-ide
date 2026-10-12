// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, RB1 to RB6, RB9 to RB11 and RB13 to RB18 (the App side): tools,
 * the click, the selection and the inspection, through the REAL `App`. The harness is `App.workspace.test.tsx`'s (the same
 * mocked boundaries: the SKP transport, the baseline stream manager, the WebGL canvas), with these changes: the canvas
 * stand-in keeps its latest props (so a test calls the callbacks `App` passed, as the canvas would), records the boxes
 * `fitToBbox` is given, and the manager stand-in latches `notifySessionEnded` into the options' `onSessionEnded` as the real
 * one does (`ViewportStreamManager.endSession`), so that a `dataset_session_ended` event takes the real route (Amendment 5,
 * the reviewer's S4): the listener `App` registers, `routeDatasetSessionEndedEvent`, the owner dispatch and the manager. The
 * workspace, the selection and the scope are never mocked (invalidator I6). Rows beyond the table are named as such.
 */

import { act, forwardRef, useEffect, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  /** Every `openDataset`, `closeDataset`, manager `stop` and manager `requestViewport`, in order, with its handle. */
  order: [] as string[],
  mintCounter: 0,
  viewportRequests: 0,
  /** The listener `App` registered with `listenDatasetSessionEnded`. */
  sessionEnded: null as ((event: import("./skp/types").DatasetSessionEnded) => void) | null,
  canvas: {
    mounted: [] as string[],
    unmounted: [] as string[],
    fits: [] as unknown[],
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
  listenDatasetSessionEnded: async (listener: (event: import("./skp/types").DatasetSessionEnded) => void) => {
    mocks.sessionEnded = listener;
    return () => {};
  },
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    private readonly opts: { dataset: string; onSessionEnded?: (detail: string) => void };
    private ended = false;
    constructor(opts: { dataset: string; onSessionEnded?: (detail: string) => void }) {
      this.opts = opts;
    }
    requestViewport(): Promise<unknown> {
      mocks.viewportRequests += 1;
      mocks.order.push(`request:${this.opts.dataset}`);
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
    }
    /** As the real manager's `endSession`: latched, then the owner's `onSessionEnded`. */
    notifySessionEnded(detail: string): void {
      if (this.ended) return;
      this.ended = true;
      this.opts.onSessionEnded?.(detail);
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {
      mocks.order.push(`stop:${this.opts.dataset}`);
    }
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
        fitToBbox: (bbox) => {
          mocks.canvas.fits.push(bbox);
        },
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
import { HOVER_BELOW_RESOLUTION_TEXT } from "./canvas/HoverReadoutView";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const handleOf = (n: number) => `ds_${n.toString(16).padStart(32, "0")}`;
const sessionOf = (n: number) => `sr_${n.toString(16).padStart(32, "0")}`;
const box = (xmin: number, ymin: number, xmax: number, ymax: number) => ({ xmin, ymin, xmax, ymax });
const pick = (id: bigint) => ({ streamHandle: "st_1", batchSeq: 0, id, anchor: null });
/** The class-C rows milestone 2 records (section 2.6). */
const MILESTONE_ROWS = new Set(["tool.set", "selection.change", "selection.clear", "selection.zoomTo", "feature.inspect", "feature.pin"]);

describe("App: tools, the click, the selection and the inspection (milestone 2, phase B), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.order = [];
    mocks.mintCounter = 0;
    mocks.viewportRequests = 0;
    mocks.sessionEnded = null;
    mocks.canvas.mounted = [];
    mocks.canvas.unmounted = [];
    mocks.canvas.fits = [];
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
  const text = (selector: string): string | null => q(selector)?.textContent ?? null;
  const props = () => mocks.canvas.props!;
  const inAct = (fn: () => void) => act(async () => fn());
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  /** Two debounce windows (the mocked manager module exports 120 ms) plus slack, in real time. */
  const twoWindows = () => act(async () => void (await new Promise((r) => setTimeout(r, 300))));

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

  /** A key on `target`, bubbling to the window as the browser's would. */
  const key = (target: Element | Window, letter: string, init: KeyboardEventInit = {}) =>
    act(() => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key: letter, code: `Key${letter.toUpperCase()}`, bubbles: true, cancelable: true, ...init }));
    });

  const toolButton = (name: "Navigate" | "Select") => [...container.querySelectorAll(".tool-switch-button")].find((b) => b.textContent === name) ?? null;
  const modeButton = (label: string) => [...container.querySelectorAll(".tool-switch-mode")].find((b) => b.textContent === label) ?? null;
  const useTool = (name: "Navigate" | "Select") => click(toolButton(name));
  const useMode = (label: "Add / remove" | "Replace" | "Add only" | "Remove only") => click(modeButton(label));
  const pressed = (element: Element | null) => element?.getAttribute("aria-pressed");

  const clickFeature = (id: bigint, bounds = box(0, 0, 10, 10)) =>
    act(() => props().onClickPick!({ kind: "feature", pick: pick(id), bounds }));
  const clickNothing = () => act(() => props().onClickPick!({ kind: "nothing" }));
  const selected = () => [...props().highlight!.selected].sort();
  const selectedCount = () => text(".feature-selected");
  const inspectedLine = () => text(".feature-id");
  const rowsSince = (mark: number) =>
    consoleRecorder.entries().slice(mark).filter(isGuiActionEntry).map((e) => e.action).filter((a) => MILESTONE_ROWS.has(a));
  const mark = () => consoleRecorder.count();

  // RECORDED MUTATION for "RB1": PLACEHOLDER
  it("RB1: a Navigate click inspects the feature and leaves the selection unchanged, with one feature.inspect row", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n);
    useTool("Navigate");
    expect(selected()).toEqual([1n]);

    const before = mark();
    await clickFeature(7n, box(50, 50, 60, 60));
    expect(inspectedLine()).toBe("id 7");
    expect(props().highlight!.inspected, "the canvas is told what is inspected").toBe(7n);
    expect(selected(), "the selection is unchanged").toEqual([1n]);
    expect(selectedCount()).toBe("Selected, ignoring filter: 1");
    expect(rowsSince(before)).toEqual(["feature.inspect"]);
  });

  // RECORDED MUTATION for "RB2": PLACEHOLDER
  it("RB2: a Select click changes the selection by each of the four modes, with one selection.change row per change", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    const before = mark();

    await clickFeature(1n);
    expect(selected(), "Add / remove, the default: adds").toEqual([1n]);
    await clickFeature(1n);
    expect(selected(), "Add / remove: removes").toEqual([]);

    useMode("Replace");
    await clickFeature(1n);
    await clickFeature(2n);
    expect(selected(), "Replace: the set becomes this id alone").toEqual([2n]);

    useMode("Add only");
    await clickFeature(3n);
    await clickFeature(3n);
    expect(selected(), "Add only: adds, and never removes").toEqual([2n, 3n]);

    useMode("Remove only");
    await clickFeature(2n);
    await clickFeature(9n);
    expect(selected(), "Remove only: removes, and never adds").toEqual([3n]);
    expect(selectedCount()).toBe("Selected, ignoring filter: 1");
    // 2 (Add / remove) + 2 (Replace) + 1 of 2 (Add only) + 1 of 2 (Remove only): a click that changes nothing records nothing.
    expect(rowsSince(before)).toEqual(Array(6).fill("selection.change"));
  });

  // RECORDED MUTATION for "RB3": PLACEHOLDER
  it("RB3: after an Apply through FilterPanel the Selected count is unchanged and the hidden count is shown", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    await clickFeature(2n, box(20, 0, 30, 10));
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n, 2n])));
    expect(selectedCount()).toBe("Selected, ignoring filter: 2");
    expect(text(".feature-in-view-not-drawn")).toContain(": 0");

    setValue(q<HTMLInputElement>(".filter-predicate")!, "zone = 'residential'");
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
    expect(text(".filter-active")).toBe("Applied: zone = 'residential'");
    // The stand-in does what the canvas does after an Apply: the auto-fit reports the view it shows (Amendment 3 item 2), and the
    // filtered data no longer draws feature 2.
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n])));

    expect(selectedCount(), "the count is unchanged").toBe("Selected, ignoring filter: 2");
    expect(selected()).toEqual([1n, 2n]);
    expect(text(".feature-in-view-not-drawn"), "the hidden count is shown").toContain(": 1");
    expect(text(".feature-outside-view")).toContain(": 0");
  });

  // RECORDED MUTATION for "RB4": PLACEHOLDER
  it("RB4: a reopen, and a session ended by the real dataset_session_ended route, each end the selection with a notice naming the count and the cause", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n);
    await clickFeature(2n);
    expect(selectedCount()).toBe("Selected, ignoring filter: 2");
    expect(q(".feature-notice")).toBeNull();

    await open("C:/data/b.parquet");
    expect(selectedCount(), "the selection is empty").toBe("Selected, ignoring filter: 0");
    expect(selected()).toEqual([]);
    expect(text(".feature-notice")).toContain("2 selected features were dropped");
    expect(text(".feature-notice")).toContain("a dataset was opened");
    expect(text(".selection-ended"), "the status bar item says the same").toBe(text(".feature-notice"));

    await clickFeature(5n);
    expect(q(".feature-notice"), "the notice stands until the next selection transition").toBeNull();
    expect(q(".selection-ended")).toBeNull();
    expect(selectedCount()).toBe("Selected, ignoring filter: 1");

    // The source changes under the open dataset: the event the host emits, through the listener App registered.
    expect(mocks.sessionEnded).not.toBeNull();
    await inAct(() => mocks.sessionEnded!({ session: sessionOf(2), reason: "observed-change" }));
    expect(selectedCount(), "the selection is empty").toBe("Selected, ignoring filter: 0");
    expect(text(".feature-notice")).toContain("1 selected feature was dropped");
    expect(text(".feature-notice")).toContain("the source file changed");
    expect(text(".selection-ended")).toBe(text(".feature-notice"));

    // Once the session has ended the click is the named session-ended state and changes nothing (the latch the hover has).
    await clickFeature(6n);
    expect(text(".feature-last-click-session-ended")).toContain("The source file changed while it was open");
    expect(selected()).toEqual([]);
  });

  // RECORDED MUTATION for "RB5": PLACEHOLDER
  it("RB5: a click below the pick resolution changes no selection and no inspection, and the named state is shown", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n);
    useTool("Navigate");
    await clickFeature(7n);
    const before = mark();
    const selectedSet = props().highlight!.selected;

    await act(() => props().onClickPick!({ kind: "below-pick-resolution" }));
    expect(text(".feature-last-click-below-resolution")).toBe(HOVER_BELOW_RESOLUTION_TEXT);
    expect(inspectedLine(), "the inspection is unchanged").toBe("id 7");
    expect(props().highlight!.selected, "the selection is the same set").toBe(selectedSet);
    useTool("Select");
    await act(() => props().onClickPick!({ kind: "below-pick-resolution" }));
    expect(selected(), "the selection is unchanged in Select").toEqual([1n]);
    expect(rowsSince(before), "nothing was applied, so nothing is recorded, apart from the tool").toEqual(["tool.set"]);
  });

  // RECORDED MUTATION for "RB6": PLACEHOLDER
  it("RB6: Zoom to selection calls fitToBbox once with the union of the kept bounds, and is disabled while the selection is empty", async () => {
    await open("C:/data/a.parquet");
    const zoom = () => q<HTMLButtonElement>(".feature-actions button:nth-child(1)")!;
    const clear = () => q<HTMLButtonElement>(".feature-actions button:nth-child(2)")!;
    expect(zoom().disabled).toBe(true);
    expect(clear().disabled).toBe(true);

    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    await clickFeature(2n, box(20, 5, 30, 40));
    expect(zoom().disabled).toBe(false);
    const before = mark();
    click(zoom());
    expect(mocks.canvas.fits).toEqual([box(0, 0, 30, 40)]);
    expect(rowsSince(before)).toEqual(["selection.zoomTo"]);

    click(clear());
    expect(selected()).toEqual([]);
    expect(zoom().disabled, "disabled again once the selection is empty").toBe(true);
    expect(rowsSince(before)).toEqual(["selection.zoomTo", "selection.clear"]);
  });

  // RECORDED MUTATION for "RB9": PLACEHOLDER
  it("RB9: the tool switch is in the top bar and outside the map region, shows aria-pressed, and a tool key typed in the filter input does nothing", async () => {
    await open("C:/data/a.parquet");
    const toolSwitch = q(".tool-switch")!;
    expect(toolSwitch).not.toBeNull();
    expect(q(".region-map")!.contains(toolSwitch), "outside the map region").toBe(false);
    expect(q(".top-bar")!.contains(toolSwitch)).toBe(true);
    expect([pressed(toolButton("Navigate")), pressed(toolButton("Select"))]).toEqual(["true", "false"]);

    key(window, "s");
    expect([pressed(toolButton("Navigate")), pressed(toolButton("Select"))], "a bare S selects Select").toEqual(["false", "true"]);
    key(window, "n");
    expect(pressed(toolButton("Navigate"))).toBe("true");

    const before = mark();
    const input = q<HTMLInputElement>(".filter-predicate")!;
    key(input, "s");
    expect(pressed(toolButton("Navigate")), "a tool key typed in a text field does nothing").toBe("true");
    expect(rowsSince(before)).toEqual([]);
  });

  // RECORDED MUTATION for "RB10": PLACEHOLDER
  it("RB10: the map is mounted once per handle across tool, mode, selection, inspection, pin, zoom and clear", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    useMode("Replace");
    await clickFeature(1n);
    click(q<HTMLButtonElement>(".feature-actions button:nth-child(1)"));
    key(window, "n");
    await clickFeature(2n);
    click(q(".feature-pin"));
    await clickNothing();
    click(q(".feature-pin"));
    useTool("Select");
    click(q<HTMLButtonElement>(".feature-actions button:nth-child(2)"));
    expect(mocks.canvas.mounted).toEqual([handleOf(1)]);
    expect(mocks.canvas.unmounted).toEqual([]);

    await open("C:/data/b.parquet");
    expect(mocks.canvas.mounted, "a reopen mounts the new handle once").toEqual([handleOf(1), handleOf(2)]);
    expect(mocks.canvas.unmounted).toEqual([handleOf(1)]);
  });

  // RECORDED MUTATION for "RB-SET" (a row beyond the table): PLACEHOLDER
  it("RB-SET: the canvas is given the same selected Set while the selection is unchanged (highlightLayers caches on its identity)", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n);
    const set = props().highlight!.selected;

    useTool("Navigate");
    await clickFeature(7n);
    useTool("Select");
    useMode("Add only");
    expect(props().highlight!.selected, "a tool change, a mode change and an inspection leave the set alone").toBe(set);
    await clickFeature(1n);
    expect(props().highlight!.selected, "an Add only click on a member changes nothing").toBe(set);
    await clickFeature(2n);
    expect(props().highlight!.selected, "a changed selection is a new set").not.toBe(set);
  });

  // RECORDED MUTATION for "RB11": PLACEHOLDER
  it("RB11: a pinned feature stays inspected under a Navigate click, which names the clicked one; unpinning changes nothing; no dialog", async () => {
    await open("C:/data/a.parquet");
    await clickFeature(1n);
    expect(inspectedLine()).toBe("id 1");
    const before = mark();
    click(q(".feature-pin"));
    expect(pressed(q(".feature-pin"))).toBe("true");

    await clickFeature(2n);
    expect(inspectedLine(), "A stays inspected").toBe("id 1");
    expect(text(".feature-last-click")).toBe("[P6 placeholder] Last click: id 2. The pinned feature, id 1, stays inspected.");
    expect(document.querySelector('[role="dialog"]'), "no dialog").toBeNull();

    click(q(".feature-pin"));
    expect(pressed(q(".feature-pin"))).toBe("false");
    expect(inspectedLine(), "unpinning does not change the inspected feature").toBe("id 1");
    await clickFeature(2n);
    expect(inspectedLine(), "after unpinning, a click inspects").toBe("id 2");
    expect(rowsSince(before)).toEqual(["feature.pin", "feature.pin", "feature.inspect"]);
  });

  // RECORDED MUTATION for "RB13": PLACEHOLDER
  it("RB13: a click on nothing leaves the selection unchanged in every Select mode, and in Navigate clears an unpinned inspection and keeps a pinned one", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n);
    const set = props().highlight!.selected;
    const before = mark();
    for (const label of ["Add / remove", "Replace", "Add only", "Remove only"] as const) {
      useMode(label);
      await clickNothing();
      expect(selected(), `${label}: the selection is unchanged`).toEqual([1n]);
      expect(props().highlight!.selected).toBe(set);
    }
    expect(rowsSince(before), "nothing applied").toEqual([]);

    useTool("Navigate");
    await clickFeature(7n);
    await clickNothing();
    expect(inspectedLine(), "an unpinned inspection is cleared").toBeNull();
    expect(selected(), "and the selection is unchanged").toEqual([1n]);
    await clickFeature(7n);
    click(q(".feature-pin"));
    await clickNothing();
    expect(inspectedLine(), "a pinned inspection is kept").toBe("id 7");
    expect(text(".feature-last-click")).toBe("[P6 placeholder] Last click: no feature there.");
  });

  // RECORDED MUTATION for "RB14": PLACEHOLDER
  it("RB14: a Navigate click leaves the Layer tab active and a closed Inspector closed", async () => {
    await open("C:/data/a.parquet");
    await clickFeature(1n);
    expect(q("#inspector-tab-layer")!.getAttribute("aria-selected"), "the Layer tab stays active").toBe("true");
    expect(q("#inspector-tab-feature")!.getAttribute("aria-selected")).toBe("false");

    key(window, "i", { ctrlKey: true });
    expect(q(".region-inspector")!.hasAttribute("hidden"), "closed").toBe(true);
    await clickFeature(2n);
    expect(inspectedLine()).toBe("id 2");
    expect(q(".region-inspector")!.hasAttribute("hidden"), "still closed").toBe(true);
    expect(q("#inspector-tab-layer")!.getAttribute("aria-selected")).toBe("true");
  });

  // RECORDED MUTATION for "RB15": PLACEHOLDER
  it("RB15: a Select click leaves the inspected feature unchanged", async () => {
    await open("C:/data/a.parquet");
    await clickFeature(1n);
    useTool("Select");
    await clickFeature(2n);
    expect(selected()).toEqual([2n]);
    expect(inspectedLine(), "A is still inspected").toBe("id 1");
    expect(props().highlight!.inspected).toBe(1n);
  });

  // RECORDED MUTATION for "RB16": PLACEHOLDER
  it("RB16: the mode picker is absent in Navigate and present in Select, with Add / remove the default", async () => {
    await open("C:/data/a.parquet");
    expect(q(".tool-switch-modes")).toBeNull();
    useTool("Select");
    expect([...container.querySelectorAll(".tool-switch-mode")].map((b) => `${b.textContent}:${pressed(b)}`)).toEqual([
      "Add / remove:true",
      "Replace:false",
      "Add only:false",
      "Remove only:false",
    ]);
    useTool("Navigate");
    expect(q(".tool-switch-modes")).toBeNull();
  });

  // RECORDED MUTATION for "RB17": PLACEHOLDER
  it("RB17: the split is shown only from a reported box, and the within-report counts as a report", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    expect(q(".feature-outside-view"), "no box, no split").toBeNull();
    expect(q(".feature-in-view-not-drawn")).toBeNull();

    await inAct(() => props().onViewportChanged(box(0, 0, 100, 100)));
    expect(text(".feature-outside-view")).toContain(": 0");
    expect(text(".feature-in-view-not-drawn"), "in the view, and nothing is drawn yet").toContain(": 1");
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n])));
    expect(text(".feature-in-view-not-drawn")).toContain(": 0");

    await inAct(() => props().onViewportWithinLastQuery!(box(50, 50, 100, 100)));
    expect(text(".feature-outside-view"), "the within-report shrank the box: outside the view").toContain(": 1");
    expect(text(".feature-in-view-not-drawn")).toContain(": 0");
  });

  // RECORDED MUTATION for "RB18": PLACEHOLDER
  it("RB18: onViewShown writes the box and nothing else: no query, no last-asked box, no settled view", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    click(q(".publish-disclosure"));
    const current = () => q<HTMLInputElement>('input[name="publish-scope"][value="current"]')!;
    expect(current().disabled, "no settled view yet").toBe(true);
    const before = mocks.viewportRequests;

    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await twoWindows();
    expect(text(".feature-in-view-not-drawn"), "the box was written").toContain(": 1");
    expect(mocks.viewportRequests - before, "no query").toBe(0);
    expect(current().disabled, "no last-asked box and no settled view").toBe(true);
  });

  // RECORDED MUTATION for "RB-S1" (a row beyond the table; the reviewer's S1 of PR #212's gate 1): PLACEHOLDER
  it("RB-S1: a reopen stops the old session, then closes the old handle, then starts the new one", async () => {
    await open("C:/data/a.parquet");
    const [a, b] = [handleOf(1), handleOf(2)];
    expect(mocks.order).toEqual([`open:${a}`, `request:${a}`]);
    await open("C:/data/b.parquet");
    expect(mocks.order.slice(2)).toEqual([`open:${b}`, `stop:${a}`, `close:${a}`, `request:${b}`]);
  });

  // RECORDED MUTATION for "RB-DRAWN" (a row beyond the table): PLACEHOLDER
  it("RB-DRAWN: a rebind clears the drawn set and the view box, because the canvas is keyed on the handle", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(7n, box(0, 0, 10, 10));
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([7n])));
    expect(text(".feature-in-view-not-drawn")).toContain(": 0");

    await open("C:/data/b.parquet");
    await clickFeature(7n, box(0, 0, 10, 10));
    expect(q(".feature-outside-view"), "the new canvas has reported no box yet").toBeNull();
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    expect(text(".feature-in-view-not-drawn"), "the old canvas's drawn set is not the new one's").toContain(": 1");
  });
});
