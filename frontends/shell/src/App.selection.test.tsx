// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, RB1 to RB11 and RB13 to RB18 (the App side): tools,
 * the click, the selection, the inspection and the export's scope, through the REAL `App`. The harness is `App.workspace.test.tsx`'s (the same
 * mocked boundaries: the SKP transport, the baseline stream manager, the WebGL canvas), with these changes: the canvas
 * stand-in keeps its latest props (so a test calls the callbacks `App` passed, as the canvas would), records the boxes
 * `fitToBbox` is given, and the manager stand-in latches `notifySessionEnded` into the options' `onSessionEnded` as the real
 * one does (`ViewportStreamManager.endSession`), so that a `dataset_session_ended` event takes the real route (Amendment 5,
 * the reviewer's S4): the listener `App` registers, `routeDatasetSessionEndedEvent`, the owner dispatch and the manager. The
 * workspace, the selection and the scope are never mocked (invalidator I6). Rows beyond the table are named as such.
 * RB12a to RB12g (the ask and the late-cancel statement, Amendment 1 B3 and Amendment 7 item 6; RB12f and RB12g from gate 1) drive the real panel and dialog with `publish/client` mocked to client.ts's real signatures.
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
  /** The arguments of every `publishPrepare` and `publishExecute` the real panel made (`publish/client` is mocked to client.ts's real signatures), the keys of every
   * `publishCancel` with the answer it gives, and the outcomes a test holds back (`pendingPrepare`, `pendingExecute`) to end a run when it chooses. */
  publish: {
    prepares: [] as unknown[][],
    executes: [] as unknown[][],
    cancels: [] as string[],
    cancelAnswer: true,
    pendingPrepare: null as Promise<import("./publish/types").PrepareOutcome> | null,
    pendingExecute: null as Promise<import("./publish/types").ExecuteOutcome> | null,
  },
  canvas: {
    mounted: [] as string[],
    unmounted: [] as string[],
    fits: [] as unknown[],
    /** The calls of the stand-in's `resetFitForNewGeneration`: an issued Apply re-arms the fit. */
    resets: 0,
    props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null,
  },
  /** Every `requestViewport` the manager stand-in got (its bbox and filter), and a refusal it gives the next one (the refusal-recovery observer). */
  manager: { requests: [] as { bbox: unknown; filter: unknown }[], refuseNext: null as unknown },
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

/** A `success` outcome whose bundle is at `path`: client.ts's real `ExecuteOutcome`. */
function success(path: string): import("./publish/types").ExecuteOutcome {
  return { status: "success", bundle_path: path, rows: 2000, partitions: 1, total_bytes: 1, manifest_bytes: 1, style_hash: "sha256:def", operation_digest: "sha256:ghi", build_millis: 0 };
}

function promptFixture(): import("./publish/types").PublishPromptData {
  return {
    operation: "publish", class: 3, reversibility: "irreversible", source_name: "parcels.parquet", source_content_hash: "sha256:abc", style_hash: "sha256:def",
    destination_display: "C:/out/bundle", grantor: "operator", grant_remaining_s: 300, row_scope: "the whole file", filter_scope: null, outcome_summary: "a folder",
  };
}

vi.mock("./publish/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./publish/client")>()),
  subscribePublishProgress: () => () => {},
  publishPrepare: async (...args: Parameters<typeof import("./publish/client").publishPrepare>): Promise<import("./publish/types").PrepareOutcome> => {
    mocks.publish.prepares.push(args);
    return mocks.publish.pendingPrepare ?? { status: "prompt", attempt_id: `at_${mocks.publish.prepares.length}`, prompt: promptFixture() };
  },
  publishExecute: async (...args: Parameters<typeof import("./publish/client").publishExecute>): Promise<import("./publish/types").ExecuteOutcome> => {
    mocks.publish.executes.push(args);
    return mocks.publish.pendingExecute ?? success("C:/out/bundle");
  },
  publishCancel: async (key: string): Promise<boolean> => {
    mocks.publish.cancels.push(key);
    return mocks.publish.cancelAnswer;
  },
}));

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
    requestViewport(bbox?: unknown, _bboxCrs?: unknown, _nowMs?: unknown, filter?: unknown): Promise<unknown> {
      mocks.viewportRequests += 1;
      mocks.order.push(`request:${this.opts.dataset}`);
      mocks.manager.requests.push({ bbox, filter: filter ?? null });
      const refusal = mocks.manager.refuseNext;
      mocks.manager.refuseNext = null;
      return refusal === null ? Promise.resolve({ kind: "issued", streamHandle: "st_1" }) : Promise.reject(refusal);
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
        resetFitForNewGeneration: () => {
          mocks.canvas.resets += 1;
        },
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
import { HOVER_BELOW_RESOLUTION_TEXT } from "./canvas/HoverReadoutView";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { SkpCallError } from "./skp/client";
import { encodeHexF64 } from "./skp/codec";
import { prepareCancelKey } from "./publish/client";
import { LATE_CANCEL_FINISHED, LATE_CANCEL_FINISHED_UNAUDITED } from "./feature/OpenDuringExportAsk";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const handleOf = (n: number) => `ds_${n.toString(16).padStart(32, "0")}`;
const sessionOf = (n: number) => `sr_${n.toString(16).padStart(32, "0")}`;
const box = (xmin: number, ymin: number, xmax: number, ymax: number) => ({ xmin, ymin, xmax, ymax });
const pick = (id: bigint) => ({ streamHandle: "st_1", batchSeq: 0, id, anchor: null });
/** The class-C rows milestone 2 records (section 2.6). */
const MILESTONE_ROWS = new Set(["tool.set", "selection.change", "selection.clear", "selection.zoomTo", "feature.inspect", "feature.pin", "dataset.openDuringExport"]);

describe("App: tools, the click, the selection and the inspection (milestone 2, phase B), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.order = [];
    mocks.mintCounter = 0;
    mocks.viewportRequests = 0;
    mocks.sessionEnded = null;
    mocks.publish.prepares = [];
    mocks.publish.executes = [];
    mocks.publish.cancels = [];
    mocks.publish.cancelAnswer = true;
    mocks.publish.pendingPrepare = null;
    mocks.publish.pendingExecute = null;
    mocks.canvas.mounted = [];
    mocks.canvas.unmounted = [];
    mocks.canvas.fits = [];
    mocks.canvas.props = null;
    mocks.canvas.resets = 0;
    mocks.manager.requests = [];
    mocks.manager.refuseNext = null;
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
  /** The text of `selector`, or a sentence saying there is no such element, so that a missing element fails with its name. */
  const shown = (selector: string): string => text(selector) ?? `(no element matches ${selector})`;
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
    act(() => props().onClickPick!({ kind: "feature", pick: pick(id), bounds, row: null, filter: null }));
  const clickNothing = () => act(() => props().onClickPick!({ kind: "nothing" }));
  const selected = () => [...props().highlight!.selected].sort();
  const selectedCount = () => text(".feature-selected");
  const inspectedLine = () => text(".feature-id");
  const rowsSince = (mark: number) =>
    consoleRecorder.entries().slice(mark).filter(isGuiActionEntry).map((e) => e.action).filter((a) => MILESTONE_ROWS.has(a));
  const mark = () => consoleRecorder.count();

  /** The Export section's Whole dataset scope, then its Publish button: the real panel's prepare, which the mocked host answers with a prompt. */
  async function prepareExport(): Promise<void> {
    click(q('input[name="publish-scope"][value="whole"]'));
    await inAct(() => q<HTMLButtonElement>(".publish-open")!.click());
  }
  const currentView = () => q<HTMLInputElement>('input[name="publish-scope"][value="current"]')!;
  /** An Apply of `predicate` through the real FilterPanel. With `refuse`, the manager stand-in refuses it, so the refusal recovery re-issues the last query. */
  async function applyFilter(predicate: string, refuse = false): Promise<void> {
    if (refuse) mocks.manager.refuseNext = new SkpCallError({ code: "skp.filter_rejected_by_binder", message: "the filter was rejected", fields: {} });
    setValue(q<HTMLInputElement>(".filter-predicate")!, predicate);
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
  }
  const lastRequest = () => mocks.manager.requests[mocks.manager.requests.length - 1];
  const wire = (b: ReturnType<typeof box>) => ({ xmin: encodeHexF64(b.xmin), ymin: encodeHexF64(b.ymin), xmax: encodeHexF64(b.xmax), ymax: encodeHexF64(b.ymax) });
  /** The dialog's typed phrase and Submit, as an operator would. */
  async function submitExport(): Promise<void> {
    setValue(q<HTMLInputElement>(".publish-dialog-phrase")!, "bundle");
    await inAct(() => q<HTMLButtonElement>(".publish-dialog-submit")!.click());
  }

  // RECORDED MUTATION for "RB1": in `feature/clickEffect.ts` invert the Select branch's condition (`if (!navigate)` becomes `if (navigate)`), so a Navigate click is routed to the selection and a Select click to the inspection.
  // Expected failure: the selection assertion before or after the Navigate click.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB1: a Navigate click inspects the feature and leaves the selection unchanged, with one feature.inspect row": AssertionError: expected [] to deeply equal [ 1n ]
  // (the Select click had inspected instead of selecting). Reverted after observing.
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

  // RECORDED MUTATION for "RB2": in `feature/clickEffect.ts` ignore the mode (`const mode = "toggle"` in the Select branch). Expected failure: Replace adds.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB2: a Select click changes the selection by each of the four modes, with one selection.change row per change": AssertionError: Replace: the set
  // becomes this id alone: expected [ 1n, 2n ] to deeply equal [ 2n ]. Reverted after observing.
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

  // RECORDED MUTATION for "RB3": in `commitActiveFilter` (App.tsx) also dispatch `selection.clear` after `filter.apply` (a clear on Apply). Expected failure: the count after the Apply.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB3: after an Apply through FilterPanel the Selected count is unchanged and the hidden count is shown": AssertionError: the count is unchanged:
  // expected 'Selected, ignoring filter: 0' to be 'Selected, ignoring filter: 2'. Reverted after observing.
  it("RB3: after an Apply through FilterPanel the Selected count is unchanged and the hidden count is shown", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    await clickFeature(2n, box(20, 0, 30, 10));
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n, 2n])));
    expect(selectedCount()).toBe("Selected, ignoring filter: 2");
    expect(shown(".feature-in-view-not-drawn")).toContain(": 0");

    setValue(q<HTMLInputElement>(".filter-predicate")!, "zone = 'residential'");
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
    expect(text(".filter-active")).toBe("Applied: zone = 'residential'");
    // The stand-in does what the canvas does after an Apply: the auto-fit reports the view it shows (Amendment 3 item 2), and the
    // filtered data no longer draws feature 2.
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n])));

    expect(selectedCount(), "the count is unchanged").toBe("Selected, ignoring filter: 2");
    expect(selected()).toEqual([1n, 2n]);
    expect(shown(".feature-in-view-not-drawn"), "the hidden count is shown").toContain(": 1");
    expect(shown(".feature-outside-view")).toContain(": 0");
  });

  // RECORDED MUTATIONS for "RB4", each applied alone. (a) No notice: in App.tsx `const notice` is `null`. Expected failure: the notice after the reopen.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB4: a reopen, and a session ended by the real dataset_session_ended route, each end the selection with a notice naming the count and the cause":
  // AssertionError: expected '(no element matches .feature-notice)' to contain '2 selected features were dropped'. Reverted after observing.
  // (b) No latch: in `feature/clickEffect.ts` `if (sessionEnded) return` becomes `if (false as boolean) return`. Expected failure: the click after the session ended.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- same test: AssertionError: expected '(no element matches .feature-last-cli…' to contain 'The source file changed while it was …'. Reverted after observing.
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
    expect(shown(".feature-notice")).toContain("2 selected features were dropped");
    expect(shown(".feature-notice")).toContain("a dataset was opened");
    expect(text(".selection-ended"), "the status bar item says the same").toBe(text(".feature-notice"));

    await clickFeature(5n);
    expect(q(".feature-notice"), "the notice stands until the next selection transition").toBeNull();
    expect(q(".selection-ended")).toBeNull();
    expect(selectedCount()).toBe("Selected, ignoring filter: 1");

    // The source changes under the open dataset: the event the host emits, through the listener App registered.
    expect(mocks.sessionEnded).not.toBeNull();
    await inAct(() => mocks.sessionEnded!({ session: sessionOf(2), reason: "observed-change" }));
    expect(selectedCount(), "the selection is empty").toBe("Selected, ignoring filter: 0");
    expect(shown(".feature-notice")).toContain("1 selected feature was dropped");
    expect(shown(".feature-notice")).toContain("the source file changed");
    expect(text(".selection-ended")).toBe(text(".feature-notice"));

    // Once the session has ended the click is the named session-ended state and changes nothing (the latch the hover has).
    await clickFeature(6n);
    expect(shown(".feature-last-click-session-ended")).toContain("The source file changed while it was open");
    expect(selected()).toEqual([]);
  });

  // RECORDED MUTATION for "RB5": in `feature/clickEffect.ts` a click below the pick resolution returns a `selection.apply` of id 99n (select on refusal). Expected failure: the selection after the refusal.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB5: a click below the pick resolution changes no selection and no inspection, and the named state is shown": AssertionError: the selection is the
  // same set: expected Set{ 1n, 99n } to be Set{ 1n }. Reverted after observing.
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

  // RECORDED MUTATION for "RB6": in `unionOfBounds` (workspace/selection.ts) return the first member's bounds only. Expected failure: the box `fitToBbox` is given.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB6: Zoom to selection calls fitToBbox once with the union of the kept bounds, and is disabled while the selection is empty": AssertionError:
  // expected '[{"xmin":0,"ymin":0,"xmax":10,"ymax":…' to be '[{"xmin":0,"ymin":0,"xmax":30,"ymax":…'. Reverted after observing.
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
    expect(JSON.stringify(mocks.canvas.fits)).toBe(JSON.stringify([box(0, 0, 30, 40)]));
    expect(rowsSince(before)).toEqual(["selection.zoomTo"]);

    click(clear());
    expect(selected()).toEqual([]);
    expect(zoom().disabled, "disabled again once the selection is empty").toBe(true);
    expect(rowsSince(before)).toEqual(["selection.zoomTo", "selection.clear"]);
  });

  // RECORDED MUTATION for "RB9": mount `<ToolSwitch>` inside the map region (the `topBar.tools` slot is `null` and the switch is rendered in the canvas container, beside the hover readout).
  // Expected failure: the switch is inside `.region-map`.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB9: the tool switch is in the top bar and outside the map region, shows aria-pressed, and a tool key typed in the filter input does nothing":
  // AssertionError: outside the map region: expected true to be false. Reverted after observing.
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

  // RECORDED MUTATION for "RB10": key the canvas on `admitted.dataset + tool` (App.tsx). Expected failure: the map is mounted again at the first tool change.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB10: the map is mounted once per handle across tool, mode, selection, inspection, pin, zoom and clear": AssertionError: expected
  // 'ds_00000000000000000000000000000001 d…' to be 'ds_00000000000000000000000000000001' (the same handle mounted again). Reverted after observing.
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
    expect(mocks.canvas.mounted.join(" ")).toBe(handleOf(1));
    expect(mocks.canvas.unmounted).toEqual([]);

    await open("C:/data/b.parquet");
    expect(mocks.canvas.mounted.join(" "), "a reopen mounts the new handle once").toBe(`${handleOf(1)} ${handleOf(2)}`);
    expect(mocks.canvas.unmounted).toEqual([handleOf(1)]);
  });

  // RECORDED MUTATION for "RB-SET" (a row beyond the table): in App.tsx `selectedIds` is `new Set(selection.keys())` on every render, with no memo. Expected failure: the identity assertion.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB-SET: the canvas is given the same selected Set while the selection is unchanged (highlightLayers caches on its identity)": AssertionError: a tool change,
  // a mode change and an inspection leave the set alone: expected Set{ 1n } to be Set{ 1n } (Object.is). Reverted after observing.
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

  // RECORDED MUTATION for "RB11": in `feature/clickEffect.ts` the Navigate click ignores the pin (`const kept = null`). Expected failure: the inspected id under the pin.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB11: a pinned feature stays inspected under a Navigate click, which names the clicked one; unpinning changes nothing; no dialog": AssertionError:
  // A stays inspected: expected 'id 2' to be 'id 1'. Reverted after observing.
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

  // RECORDED MUTATION for "RB13": in `feature/clickEffect.ts` a click on nothing in Select, in Replace, returns a `selection.clear` (the form's mutation). Expected failure: the count in Replace.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB13: a click on nothing leaves the selection unchanged in every Select mode, and in Navigate clears an unpinned inspection and keeps a pinned one":
  // AssertionError: Replace: the selection is unchanged: expected [] to deeply equal [ 1n ]. Reverted after observing.
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

  // RECORDED MUTATION for "RB14": in `handleClickPick` (App.tsx) click the Feature tab after an inspection (`document.getElementById("inspector-tab-feature")?.click()`). Expected failure: the Layer tab is no longer active.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB14: a Navigate click leaves the Layer tab active and a closed Inspector closed": AssertionError: the Layer tab stays active: expected 'false' to be
  // 'true'. Reverted after observing.
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

  // RECORDED MUTATION for "RB15": in `feature/clickEffect.ts` the Select branch also returns an `inspect.set`. Expected failure: the inspected id.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB15: a Select click leaves the inspected feature unchanged": AssertionError: A is still inspected: expected 'id 2' to be 'id 1'. Reverted after observing.
  it("RB15: a Select click leaves the inspected feature unchanged", async () => {
    await open("C:/data/a.parquet");
    await clickFeature(1n);
    useTool("Select");
    await clickFeature(2n);
    expect(selected()).toEqual([2n]);
    expect(inspectedLine(), "A is still inspected").toBe("id 1");
    expect(props().highlight!.inspected).toBe(1n);
  });

  // RECORDED MUTATION for "RB16": in `feature/ToolSwitch.tsx` render the mode picker for both tools (`{tool === "select" && (` becomes `{true && (`). Expected failure: the picker in Navigate.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB16: the mode picker is absent in Navigate and present in Select, with Add / remove the default": AssertionError: expected <div …(3)>…(4)</div> to be
  // null. Reverted after observing.
  // RECORDED MUTATIONS for the mode.set clause of "RB16" (gate 1 of PR 217, the architect's C-1), each applied alone. (i) In `handleSelectMode` (App.tsx) remove `recordNamed("gui-action", "mode.set")`. Expected failure: the first row assertion.
  // OBSERVED AT b258dff0620ea5e46a6a53856b8c70d4c0ce8781: FAILED -- "RB16: the mode picker is absent in Navigate and present in Select, with Add / remove the default": AssertionError: a change of mode records one mode.set row: expected [] to deeply equal [ 'mode.set' ].
  // Reverted after observing. (ii) In `handleSelectMode` remove the same-mode guard (`|| viewSelectionMode(view) === next`). Expected failure: the second row assertion.
  // OBSERVED AT b258dff0620ea5e46a6a53856b8c70d4c0ce8781: FAILED -- same test: AssertionError: the mode already chosen records none: expected [ 'mode.set', 'mode.set' ] to deeply equal [ 'mode.set' ]. Reverted after observing.
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

    // The mode picker records its class-C row (docs/01 principle 4; section 1): once per change of mode, none for the mode already chosen.
    useTool("Select");
    const modeRowsFrom = mark();
    const modeRows = () => consoleRecorder.entries().slice(modeRowsFrom).filter(isGuiActionEntry).map((e) => e.action).filter((a) => a === "mode.set");
    useMode("Replace");
    expect(modeRows(), "a change of mode records one mode.set row").toEqual(["mode.set"]);
    useMode("Replace");
    expect(modeRows(), "the mode already chosen records none").toEqual(["mode.set"]);
  });

  // RECORDED MUTATIONS for "RB17", each applied alone (Amendment 2 item 2 (e)). (i) Feed the box from `onViewportChanged` only: remove the `showBox` call from `onViewportWithinLastQuery` (App.tsx).
  // Expected failure: at the shrink step.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB17: the split is shown only from a reported box, and the within-report counts as a report": AssertionError: the within-report shrank the box: outside the
  // view: expected '[P6 placeholder] Outside the view: 0' to contain ': 1'. Reverted after observing.
  // (ii) Read a null box as containing every member: in `countSelection` (workspace/selection.ts) a null box returns an outside count of 0 and the undrawn members as in the view. Expected
  // failure: at the first step.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- same test: AssertionError: no box, no split: expected <p class="feature-outside-view"></p> to be null. Reverted after observing.
  it("RB17: the split is shown only from a reported box, and the within-report counts as a report", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    expect(q(".feature-outside-view"), "no box, no split").toBeNull();
    expect(q(".feature-in-view-not-drawn")).toBeNull();

    await inAct(() => props().onViewportChanged(box(0, 0, 100, 100)));
    expect(shown(".feature-outside-view")).toContain(": 0");
    expect(shown(".feature-in-view-not-drawn"), "in the view, and nothing is drawn yet").toContain(": 1");
    await inAct(() => props().onSelectionDrawnChange!(new Set([1n])));
    expect(shown(".feature-in-view-not-drawn")).toContain(": 0");

    await inAct(() => props().onViewportWithinLastQuery!(box(50, 50, 100, 100)));
    expect(shown(".feature-outside-view"), "the within-report shrank the box: outside the view").toContain(": 1");
    expect(shown(".feature-in-view-not-drawn")).toContain(": 0");
  });

  // RECORDED MUTATION for "RB18" (the App side; Amendment 3 item 3): the `onViewShown` prop is routed into `onViewportChanged`'s handler (it writes `lastViewportBboxRef` and calls the
  // debounced entry point). Expected failure: the query it issues.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB18: onViewShown writes the box and nothing else: no query, no last-asked box, no settled view": AssertionError: no query: expected 1 to be +0.
  // Reverted after observing. Re-aimed by export-current-view-after-unreported-fit (its Amendment 3 item 4 (b)): the title lost ", no settled view", and the radio's `disabled` reads
  // gave way to the refusal-recovery observer at the end.
  // RE-OBSERVED AT 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4 (i) the mutation above: FAILED -- "RB18: onViewShown writes the box and nothing else: no query, no last-asked box": AssertionError: no query: expected 1 to be +0 (the same
  // first failure as before the re-aim). (ii) the new observer alone, with the query dropped (`onViewShown` writes `lastViewportBboxRef` and the box only): FAILED -- same test: AssertionError: no last-asked box: the recovery
  // asks the whole dataset: expected { xmin: '0000000000000000', …(3) } to be null. Both reverted after observing.
  it("RB18: onViewShown writes the box and nothing else: no query, no last-asked box", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(1n, box(0, 0, 10, 10));
    const before = mocks.viewportRequests;

    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await twoWindows();
    expect(shown(".feature-in-view-not-drawn"), "the box was written").toContain(": 1");
    expect(mocks.viewportRequests - before, "no query").toBe(0);
    await applyFilter("zone = 'residential'", true);
    expect(lastRequest().bbox, "no last-asked box: the recovery asks the whole dataset").toBeNull();
  });

  // RECORDED MUTATION for "RCV1" (export-current-view-after-unreported-fit): App's Current-view getter reads `lastViewportBboxRef` (`getViewBox` decodes it). Expected failure: the toEqual, receiving b1.
  // OBSERVED AT 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4: FAILED -- "RCV1: after an issued Apply and the fit it triggers, Current view sends the box the fit showed": AssertionError: the box of the fit, not of the last pan: expected { kind: 'viewport-bbox', …(1) }
  // to deeply equal { kind: 'viewport-bbox', …(1) } (receiving xmin 0, ymin 0, xmax 100, ymax 100, which is b1). The same mutation also failed RCV3. Reverted after observing.
  it("RCV1: after an issued Apply and the fit it triggers, Current view sends the box the fit showed", async () => {
    await open("C:/data/a.parquet");
    click(q(".publish-disclosure"));
    const [b1, b2] = [box(0, 0, 100, 100), box(40, 40, 60, 60)];
    await inAct(() => props().onViewportChanged(b1));
    await applyFilter("zone = 'residential'");
    expect(text(".filter-active")).toBe("Applied: zone = 'residential'");
    expect(mocks.canvas.resets, "an issued Apply re-arms the fit once").toBe(1);
    await inAct(() => props().onViewShown!(b2));
    await inAct(() => q<HTMLButtonElement>(".publish-open")!.click());
    expect(mocks.publish.prepares, "one prepare").toHaveLength(1);
    expect(mocks.publish.prepares[0][2], "the box of the fit, not of the last pan").toEqual({ kind: "viewport-bbox", bbox: b2 });
  });

  // RECORDED MUTATION for "RCV2": drop the reset of the view box at an admission (`viewBox.set(null)` in `handleAdmitted`, App.tsx). Expected failure: Current view is enabled for B.
  // OBSERVED AT 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4: FAILED -- "RCV2: a reopen empties the view box: Current view is disabled again, and a prepare is refused with no call": AssertionError: B's canvas has reported nothing: expected false to be true.
  // The same mutation also failed RB-DRAWN. Reverted after observing.
  it("RCV2: a reopen empties the view box: Current view is disabled again, and a prepare is refused with no call", async () => {
    await open("C:/data/a.parquet");
    await inAct(() => props().onViewportChanged(box(0, 0, 100, 100)));
    click(q(".publish-disclosure"));
    expect(currentView().disabled, "A has reported a box").toBe(false);
    await open("C:/data/b.parquet");
    click(q(".publish-disclosure"));
    expect(currentView().disabled, "B's canvas has reported nothing").toBe(true);
    const outcome = await act(async () => window.__SPATIAL_E2E__!.publishPrepare!("current"));
    expect(outcome.status, "the dev hook is refused").toBe("refused");
    expect(mocks.publish.prepares, "A's box is not sent for B").toEqual([]);
  });

  // RECORDED MUTATION for "RCV3": availability from the old signal (a `hasSettledView` state set by `onViewportChanged` only; App passes `getViewBox={() => (hasSettledView ? viewBox.get() : null)}`).
  // Expected failure: the radio is disabled after `onViewShown` alone.
  // OBSERVED AT 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4: FAILED -- "RCV3: Current view is available once the map has drawn the data, with no pan or zoom reported, and Export carries that box": AssertionError: a view was shown: expected true to be false.
  // Reverted after observing.
  it("RCV3: Current view is available once the map has drawn the data, with no pan or zoom reported, and Export carries that box", async () => {
    await open("C:/data/a.parquet");
    click(q(".publish-disclosure"));
    expect(currentView().disabled, "nothing drawn yet").toBe(true);
    expect(text(".publish-scope-disabled-reason")).toBe("Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.");
    const b0 = box(10, 20, 30, 40);
    await inAct(() => props().onViewShown!(b0));
    expect(currentView().disabled, "a view was shown").toBe(false);
    expect(q(".publish-scope-disabled-reason"), "no reason").toBeNull();
    await inAct(() => q<HTMLButtonElement>(".publish-open")!.click());
    expect(mocks.publish.prepares[0][2]).toEqual({ kind: "viewport-bbox", bbox: b0 });
  });

  // RECORDED MUTATION for "RCV4": `handleApplyFilter`'s `getLastViewportBbox` reads the view box (encoded) in place of `lastViewportBboxRef`. Expected failure: the recovery's bbox, receiving b2's.
  // OBSERVED AT 304ba2495dc7d4792ee9e104e146dfbc84b0a4b4: FAILED -- "RCV4: a refused Apply's recovery re-issues the box of the last pan or zoom, not the box a fit showed since": AssertionError: the recovery asks the last pan or zoom's box: expected { xmin: '4044000000000000', …(3) }
  // to deeply equal { xmin: '0000000000000000', …(3) } (b2's box encoded, where b1's is expected). Reverted after observing.
  it("RCV4: a refused Apply's recovery re-issues the box of the last pan or zoom, not the box a fit showed since", async () => {
    await open("C:/data/a.parquet");
    const [b1, b2] = [box(0, 0, 100, 100), box(40, 40, 60, 60)];
    await inAct(() => props().onViewportChanged(b1));
    await applyFilter("zone = 'residential'");
    await inAct(() => props().onViewShown!(b2));
    await applyFilter("zone = 'industrial'", true);
    expect(lastRequest().bbox, "the recovery asks the last pan or zoom's box").toEqual(wire(b1));
    expect(lastRequest().filter, "over the last issued filter").not.toBeNull();
  });

  // RECORDED MUTATION for "RB-S1" (a row beyond the table; the reviewer's S1 of PR #212's gate 1, Amendment 5 item 1(d)): move the close effect (App.tsx) after the `[admitted]` effect.
  // Expected failure: the new session starts before the old handle is closed.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB-S1: a reopen stops the old session, then closes the old handle, then starts the new one": AssertionError: expected 'open:ds_00000000000000000000000000000…' to be
  // 'open:ds_00000000000000000000000000000…' (the order differs: request:<new> before close:<old>). Reverted after observing.
  it("RB-S1: a reopen stops the old session, then closes the old handle, then starts the new one", async () => {
    await open("C:/data/a.parquet");
    const [a, b] = [handleOf(1), handleOf(2)];
    expect(mocks.order.join(" ")).toBe(`open:${a} request:${a}`);
    await open("C:/data/b.parquet");
    expect(mocks.order.slice(2).join(" ")).toBe([`open:${b}`, `stop:${a}`, `close:${a}`, `request:${b}`].join(" "));
  });

  // RECORDED MUTATIONS for "RB-DRAWN" (a row beyond the table), each applied alone. (a) Read the drawn set whatever resource reported it (App.tsx: `drawnState !== null ? drawnState.ids : NO_IDS`).
  // Expected failure: the old canvas's set is read for the new one.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- "RB-DRAWN: a rebind clears the drawn set and the view box, because the canvas is keyed on the handle": AssertionError: the old canvas's drawn set is not the new
  // one's: expected '[P6 placeholder] In the view, not dra…' to contain ': 1'. Reverted after observing.
  // (b) Do not reset the view box on a new open (remove `viewBox.set(null)` from `handleAdmitted`). Expected failure: a split from the old canvas's box.
  // OBSERVED AT f51b96a9cafbaf57b5f562edb8a0d64b51d9a604: FAILED -- same test: AssertionError: the new canvas has reported no box yet: expected <p class="feature-outside-view"></p> to be null. Reverted after observing.
  it("RB-DRAWN: a rebind clears the drawn set and the view box, because the canvas is keyed on the handle", async () => {
    await open("C:/data/a.parquet");
    useTool("Select");
    await clickFeature(7n, box(0, 0, 10, 10));
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    await inAct(() => props().onSelectionDrawnChange!(new Set([7n])));
    expect(shown(".feature-in-view-not-drawn")).toContain(": 0");

    await open("C:/data/b.parquet");
    await clickFeature(7n, box(0, 0, 10, 10));
    expect(q(".feature-outside-view"), "the new canvas has reported no box yet").toBeNull();
    await inAct(() => props().onViewShown!(box(0, 0, 100, 100)));
    expect(shown(".feature-in-view-not-drawn"), "the old canvas's drawn set is not the new one's").toContain(": 1");
  });

  // RECORDED MUTATION for "RB7": in `PublishPanel.tsx`'s `executeInStagedScope` skip the check (`const check: ScopeCheck = { ok: true }`). Expected failure: the host call after the filter changed.
  // OBSERVED AT 3dc687a11445a931a4fee46ca4ef8cb0e8ee8888: FAILED -- "RB7: an export whose filter changed since its prepare is refused and never sent; with its scope unchanged it is sent": AssertionError: the host was not called:
  // expected [ [ 'at_1', 'bundle' ] ] to deeply equal [] (the same mutation also failed RB7-hook, below). Reverted after observing.
  it("RB7: an export whose filter changed since its prepare is refused and never sent; with its scope unchanged it is sent", async () => {
    await open("C:/data/a.parquet");
    click(q(".publish-disclosure"));
    await prepareExport();
    expect(mocks.publish.prepares, "one prepare, which staged the scope").toHaveLength(1);

    // The filter changes while the approval prompt stands.
    setValue(q<HTMLInputElement>(".filter-predicate")!, "zone = 'residential'");
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
    expect(text(".filter-active")).toBe("Applied: zone = 'residential'");
    await submitExport();
    expect(mocks.publish.executes, "the host was not called").toEqual([]);
    expect(shown(".publish-panel .admission-refusal-message")).toBe(
      "[P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again."
    );
    expect(q(".publish-dialog"), "the dialog is closed").toBeNull();

    // Prepared again under the filter, the scope is the same at execute. The selection changes meanwhile, and an export's scope has no selection.
    await prepareExport();
    expect(mocks.publish.prepares).toHaveLength(2);
    useTool("Select");
    await clickFeature(1n);
    await submitExport();
    expect(mocks.publish.executes, "the host was called once, for the second attempt").toEqual([["at_2", "bundle"]]);
    expect(shown(".publish-summary-headline")).toBe("Exported.");
  });

  // RECORDED MUTATION for "RB7-hook" (a row beyond the table; section 2.5: the publishExecute dev hook goes through the same wrapper): in `runExecute` (PublishPanel.tsx) call `publishExecute` directly. Expected failure: the host call.
  // OBSERVED AT 3dc687a11445a931a4fee46ca4ef8cb0e8ee8888: FAILED -- "RB7-hook: the publishExecute dev hook is refused by the same staged-scope path": AssertionError: the host was not called: expected [ [ 'at_1', 'bundle' ] ] to deeply equal [].
  // RB7 alone passed with this mutation. Reverted after observing.
  it("RB7-hook: the publishExecute dev hook is refused by the same staged-scope path", async () => {
    await open("C:/data/a.parquet");
    click(q(".publish-disclosure"));
    await prepareExport();
    setValue(q<HTMLInputElement>(".filter-predicate")!, "zone = 'residential'");
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());

    const refusal = "[P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again.";
    const outcome = await act(async () => window.__SPATIAL_E2E__!.publishExecute!("bundle"));
    expect(mocks.publish.executes, "the host was not called").toEqual([]);
    expect(outcome).toEqual({ status: "refused", message: refusal });
    expect(shown(".publish-panel .admission-refusal-message"), "the panel renders it as it renders the dialog's").toBe(refusal);
  });

  // RECORDED MUTATION for "RB8": in App.tsx pass the selection to the panel (`filterActive={activeFilter !== null || selection.size > 0}`). Expected failure: the second prepare's arguments.
  // OBSERVED AT 3dc687a11445a931a4fee46ca4ef8cb0e8ee8888: FAILED -- "RB8: an export is prepared with the same arguments with and without a selection, and says the selection is not used": AssertionError: the prepare with a selection equals the
  // prepare without: the fourth argument was true where false was expected. Reverted after observing.
  it("RB8: an export is prepared with the same arguments with and without a selection, and says the selection is not used", async () => {
    const sentence = "[P6 placeholder] The selection is not used. The export covers the row scope chosen above.";
    await open("C:/data/a.parquet");
    click(q(".publish-disclosure"));
    expect(text(".publish-selection-sentence"), "shown with no selection").toBe(sentence);
    await prepareExport();
    click(q(".publish-dialog-cancel"));

    useTool("Select");
    await clickFeature(1n);
    await clickFeature(2n);
    expect(selected()).toEqual([1n, 2n]);
    expect(text(".publish-selection-sentence"), "shown with a selection").toBe(sentence);
    await prepareExport();
    expect(mocks.publish.prepares).toHaveLength(2);
    expect(mocks.publish.prepares[1], "the prepare with a selection equals the prepare without").toEqual(mocks.publish.prepares[0]);
    expect(mocks.publish.prepares[0]).toEqual([handleOf(1), expect.any(String), { kind: "whole-file" }, false]);
  });

  // The ask and the statement (Amendment 1 B3, Amendment 7). A run is held open by a deferred outcome, which a test resolves to end it.
  function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => (resolve = r));
    return { promise, resolve };
  }
  /** Expands the Export section of the current panel, prepares (the mocked host answers with a prompt) and submits: an execute run that stands until its outcome is resolved. */
  async function startExecute() {
    const outcome = deferred<import("./publish/types").ExecuteOutcome>();
    mocks.publish.pendingExecute = outcome.promise;
    click(q(".publish-disclosure"));
    await prepareExport();
    await submitExport();
    return outcome;
  }
  /** Ends a run with its outcome, as the host's answer arriving would. */
  const endRun = <T,>(held: { resolve: (value: T) => void }, value: T) =>
    act(async () => {
      held.resolve(value);
      await new Promise((r) => setTimeout(r, 0));
    });
  let pendingOpen: Promise<unknown> | null = null;
  /** The open hook is started and not awaited: with a run standing it waits for the ask's answer. */
  const startOpen = (path: string) => act(async () => void (pendingOpen = window.__SPATIAL_E2E__!.openPath!(path)));
  const finishOpen = async () => {
    let result: unknown;
    await act(async () => void (result = await pendingOpen));
    return result;
  };
  const closes = (handle: string) => mocks.order.filter((entry) => entry === `close:${handle}`).length;
  const opens = () => mocks.order.filter((entry) => entry.startsWith("open:")).length;
  const ASK = ".open-during-export-ask";

  // RECORDED MUTATION for "RB12a": in `App.tsx`'s `answerOpenAsk` answer true on Keep exporting (`ask.answer(true)` for both choices). Expected failure: the open count after Keep exporting.
  // OBSERVED AT aa25137f91bf4b35f71de5f1e42e9b646c86989a: FAILED -- "RB12a: Keep exporting opens nothing, leaves the handle unchanged, closes nothing and queues nothing, and the export reaches its outcome": AssertionError: no openDataset: expected 2 to be 1. Reverted after observing.
  it("RB12a: Keep exporting opens nothing, leaves the handle unchanged, closes nothing and queues nothing, and the export reaches its outcome", async () => {
    await open("C:/data/a.parquet");
    const run = await startExecute();
    const before = mark();
    await startOpen("C:/data/b.parquet");
    expect(q(ASK), "the ask shows while the export runs").not.toBeNull();
    expect(opens(), "nothing is opened before a choice").toBe(1);

    click(q(".open-during-export-keep"));
    const dropped = await finishOpen();
    expect(opens(), "no openDataset").toBe(1);
    expect(dropped, "the open was dropped").toMatchObject({ kind: "refused", code: "open.dropped" });
    expect(props().dataset, "the handle is unchanged").toBe(handleOf(1));
    expect(closes(handleOf(1)), "no closeDataset").toBe(0);
    expect(mocks.publish.cancels, "no cancel").toEqual([]);
    expect(q(ASK), "the ask is gone").toBeNull();
    expect(rowsSince(before)).toEqual(["dataset.openDuringExport"]);

    await endRun(run, success("C:/out/kept"));
    expect(shown(".publish-summary-headline"), "the export reached its outcome in its own panel").toBe("Exported.");
    expect(opens(), "nothing was queued").toBe(1);
    expect(q(".late-cancel-statement"), "no statement after Keep exporting").toBeNull();
  });

  // RECORDED MUTATION for "RB12b": in `handleAdmitted` (App.tsx) release every standing export consumer (`dispatch({ type: "consumer.released", resource, consumer })` for each run), as releasing it when the old panel goes would.
  // Expected failure: the old handle is closed before the run's outcome.
  // OBSERVED AT aa25137f91bf4b35f71de5f1e42e9b646c86989a: FAILED -- "RB12b: Cancel the export and go on cancels once, opens once, and closes the old handle once, only after the run's outcome": AssertionError: the old handle stays open while the export runs: expected 1 to be +0.
  // The same mutation also failed RB12d, at "(i) the old handle is not closed before the outcome". Reverted after observing.
  it("RB12b: Cancel the export and go on cancels once, opens once, and closes the old handle once, only after the run's outcome", async () => {
    await open("C:/data/a.parquet");
    const run = await startExecute();
    await startOpen("C:/data/b.parquet");
    const before = mark();
    click(q(".open-during-export-cancel"));
    expect(await finishOpen()).toEqual({ kind: "admitted" });
    expect(mocks.publish.cancels, "one cancel, with the executing attempt").toEqual(["at_1"]);
    expect(opens(), "one more openDataset").toBe(2);
    expect(props().dataset).toBe(handleOf(2));
    expect(closes(handleOf(1)), "the old handle stays open while the export runs").toBe(0);
    expect(rowsSince(before)).toEqual(["dataset.openDuringExport"]);

    await endRun(run, { status: "refused", message: "cancelled" });
    expect(closes(handleOf(1)), "closed once, after the outcome").toBe(1);
    expect(mocks.order.indexOf(`close:${handleOf(1)}`)).toBeGreaterThan(mocks.order.indexOf(`open:${handleOf(2)}`));
  });

  // RECORDED MUTATION for "RB12c": in the render of `region.layers` (App.tsx) always render the ask (`{asking && <OpenDuringExportAsk` becomes `{true && <OpenDuringExportAsk`). Expected failure: the ask shows with no run.
  // OBSERVED AT aa25137f91bf4b35f71de5f1e42e9b646c86989a: FAILED -- "RB12c: with no run standing no ask is rendered, and a run that has ended is not standing": AssertionError: no run, no ask: expected <div ...> to be null.
  // The same mutation also failed RB12a, at "the ask is gone". Reverted after observing.
  it("RB12c: with no run standing no ask is rendered, and a run that has ended is not standing", async () => {
    await open("C:/data/a.parquet");
    await startOpen("C:/data/b.parquet");
    expect(q(ASK), "no run, no ask").toBeNull();
    expect(await finishOpen()).toEqual({ kind: "admitted" });

    const run = await startExecute();
    await endRun(run, success("C:/out/done"));
    await startOpen("C:/data/c.parquet");
    expect(q(ASK), "an ended run, no ask").toBeNull();
    expect(await finishOpen()).toEqual({ kind: "admitted" });
    expect(mocks.publish.cancels).toEqual([]);
  });

  // RECORDED MUTATION for "RB12d": in `answerOpenAsk` (App.tsx) show the statement only when `cancel()` answers false (the loop body becomes `run.cancelChosen = false; void run.cancel().then((answer) => { run.cancelChosen = !answer; });`).
  // Expected failure: case (i), where the answer is true and the statement is absent.
  // OBSERVED AT aa25137f91bf4b35f71de5f1e42e9b646c86989a: FAILED -- "RB12d: the statement is decided by the run's own outcome, never by cancel()'s answer": AssertionError: (i) the answer is true and the outcome is success: expected { Object (text, path, ...) } to deeply equal { ...(3) }.
  // The same mutation also failed RB12e, at "decided at the choice". Reverted after observing.
  it("RB12d: the statement is decided by the run's own outcome, never by cancel()'s answer", async () => {
    const statement = () => ({ text: text(".late-cancel-text"), path: text(".late-cancel-path"), detail: text(".late-cancel-detail") });
    const cancelAndGo = async (path: string) => {
      await startOpen(path);
      click(q(".open-during-export-cancel"));
      await finishOpen();
    };
    await open("C:/data/a.parquet");

    const first = await startExecute();
    mocks.publish.cancelAnswer = true;
    await cancelAndGo("C:/data/b.parquet");
    expect(q(".late-cancel-statement"), "(i) none before the outcome").toBeNull();
    expect(closes(handleOf(1)), "(i) the old handle is not closed before the outcome").toBe(0);
    await endRun(first, success("C:/out/p1"));
    expect(statement(), "(i) the answer is true and the outcome is success").toEqual({ text: LATE_CANCEL_FINISHED, path: "C:/out/p1", detail: null });
    expect(closes(handleOf(1)), "(i) closed once, after the outcome").toBe(1);

    const second = await startExecute();
    expect(q(".late-cancel-statement"), "the next export report ends the statement").toBeNull();
    mocks.publish.cancelAnswer = false;
    await cancelAndGo("C:/data/c.parquet");
    await endRun(second, success("C:/out/p2"));
    expect(statement(), "(ii) the answer is false and the outcome is success: the same").toEqual({ text: LATE_CANCEL_FINISHED, path: "C:/out/p2", detail: null });

    const third = await startExecute();
    mocks.publish.cancelAnswer = true;
    await cancelAndGo("C:/data/d.parquet");
    await endRun(third, { status: "refused", message: "cancelled" });
    expect(q(".late-cancel-statement"), "(iii) the answer is true and the outcome is refused").toBeNull();

    const prepare = deferred<import("./publish/types").PrepareOutcome>();
    mocks.publish.pendingPrepare = prepare.promise;
    click(q(".publish-disclosure"));
    await prepareExport();
    await cancelAndGo("C:/data/e.parquet");
    await endRun(prepare, { status: "prompt", attempt_id: "at_late", prompt: promptFixture() });
    expect(q(".late-cancel-statement"), "(iv) a prepare run ends as a prompt after the choice").toBeNull();
    expect(closes(handleOf(4)), "(iv) the old handle closes after the prepare run").toBe(1);

    mocks.publish.pendingPrepare = null;
    const fifth = await startExecute();
    await cancelAndGo("C:/data/f.parquet");
    await endRun(fifth, { status: "succeeded-unaudited", bundle_path: "C:/out/p5", detail: "the outcome record could not be written" });
    expect(statement(), "(v) succeeded-unaudited").toEqual({ text: LATE_CANCEL_FINISHED_UNAUDITED, path: "C:/out/p5", detail: "the outcome record could not be written" });
  });

  // RECORDED MUTATION for "RB12e" (a row beyond the table; Amendment 7 item 2(c): if `ended` has already resolved when the choice is made, the statement is decided at the choice): in `answerOpenAsk` (App.tsx) remove the decision at the choice (the `lateCancelOutcome(true, run.end)` lines).
  // Expected failure: no statement after the choice.
  // OBSERVED AT aa25137f91bf4b35f71de5f1e42e9b646c86989a: FAILED -- "RB12e: a run that ended while the ask stood is decided at the choice, and the choice still calls cancel once": AssertionError: decided at the choice: expected null to be 'C:/out/early'. Reverted after observing.
  it("RB12e: a run that ended while the ask stood is decided at the choice, and the choice still calls cancel once", async () => {
    await open("C:/data/a.parquet");
    const run = await startExecute();
    await startOpen("C:/data/b.parquet");
    await endRun(run, success("C:/out/early"));
    expect(q(ASK), "the ask stands until a choice").not.toBeNull();
    expect(q(".late-cancel-statement"), "no choice, no statement").toBeNull();

    click(q(".open-during-export-cancel"));
    await finishOpen();
    expect(mocks.publish.cancels).toEqual(["at_1"]);
    expect(text(".late-cancel-path"), "decided at the choice").toBe("C:/out/early");
    expect(closes(handleOf(1))).toBe(1);
  });

  // RECORDED MUTATION for "RB12f" (a row beyond the table; the architect's S2, gate 1 of PR 217; it pins the behaviour of stage 7, Amendment 10 item 3(j)): in `confirmOpen` (App.tsx) remove the answer to the first ask
  // (`askRef.current?.answer(false);`). Expected failure: the first open is still pending.
  // OBSERVED AT b258dff0620ea5e46a6a53856b8c70d4c0ce8781: FAILED -- "RB12f: a second open while the ask stands drops the first as Keep, records one row for the choice, and asks again": AssertionError: the first open was answered Keep by the second: expected 'pending' to match
  // object { kind: 'refused', …(1) }. Reverted after observing.
  it("RB12f: a second open while the ask stands drops the first as Keep, records one row for the choice, and asks again", async () => {
    await open("C:/data/a.parquet");
    const run = await startExecute();
    await startOpen("C:/data/b.parquet");
    const first = pendingOpen!;
    const before = mark();
    await startOpen("C:/data/c.parquet");
    const second = pendingOpen!;

    let firstResult: unknown = "pending";
    await act(async () => {
      firstResult = await Promise.race([first, new Promise((r) => setTimeout(() => r("pending"), 100))]);
    });
    expect(firstResult, "the first open was answered Keep by the second").toMatchObject({ kind: "refused", code: "open.dropped" });
    expect(rowsSince(before), "the drop is not a choice and records no row").toEqual([]);
    expect(container.querySelectorAll(ASK).length, "the ask is asked again, once").toBe(1);
    expect(opens(), "nothing is opened before a choice").toBe(1);

    click(q(".open-during-export-keep"));
    let secondResult: unknown = "pending";
    await act(async () => void (secondResult = await second));
    expect(secondResult, "the second open is answered by the choice").toMatchObject({ kind: "refused", code: "open.dropped" });
    expect(rowsSince(before), "one row, for the one choice").toEqual(["dataset.openDuringExport"]);
    expect(opens(), "no openDataset").toBe(1);
    expect(mocks.publish.cancels, "no cancel").toEqual([]);
    expect(q(ASK), "the ask is gone").toBeNull();
    await endRun(run, success("C:/out/kept"));
    expect(shown(".publish-summary-headline"), "the export reached its outcome in its own panel").toBe("Exported.");
  });

  // RECORDED MUTATION for "RB12g" (a row beyond the table; the reviewer's C1, gate 1 of PR 217): in `answerOpenAsk` (App.tsx) iterate the ask's runs only (`for (const run of ask.runs)`).
  // Expected failure: the cancels list, which lacks the execute's key.
  // OBSERVED AT b258dff0620ea5e46a6a53856b8c70d4c0ce8781: FAILED -- "RB12g: Cancel the export and go on cancels an execute that started after the ask appeared, once, and the statement follows its outcome": AssertionError: the prepare's key and the execute's key,
  // once each: expected [ Array(1) ] to deeply equal [ …(2) ]. Reverted after observing.
  // AT f64418bcc7eee2d0f418bd59f8c00c9554f2c04b (PR 217 gate 3) this mutation survives (28 of 28 pass): since d245975c a run reported while the ask stands is added to the ask's runs, so they hold every run the choice acts on. With that line also removed, RB12g fails as observed above.
  // RECORDED MUTATION for "RB12g" pass 3 (the reviewer's C1-R, gate 2 of PR 217): in `handleExportRunning` (App.tsx) remove the line that adds the run to the standing ask (`if (askRef.current !== null) askRef.current = { ...askRef.current, runs: [...askRef.current.runs, run] };`).
  // Expected failure: pass 3's statement is null, because the execute ended before the choice and is in neither the ask's runs nor the runs standing.
  // OBSERVED AT d245975c9511a6336bea4867c3b15c4d4e833a04: FAILED -- "RB12g: Cancel the export and go on cancels an execute that started after the ask appeared, once, and the statement follows its outcome": AssertionError: pass 3: decided at the choice, the statement names the bundle
  // the finished execute gave: expected null to be 'C:/out/g3'. The file's other 27 tests passed. Reverted after observing.
  // RECORDED MUTATION for "RB12g" pass 4 (the reviewer's C1, gate 3 of PR 217): in `answerOpenAsk` (App.tsx) replace the append at the choice with a single slot (`setLateCancel((shown) => [...shown, finished]);` becomes `setLateCancel([finished]);`).
  // Expected failure: pass 4's statement paths, which hold the second bundle only.
  // OBSERVED AT 41f270b4896642e3c6a05dd61397cb0b48409481: FAILED -- "RB12g: Cancel the export and go on cancels an execute that started after the ask appeared, once, and the statement follows its outcome": AssertionError: pass 4: one statement for each bundle,
  // in the order decided: expected [ 'C:/out/second' ] to deeply equal [ 'C:/out/first', 'C:/out/second' ]. The file's other 27 tests passed, RB12d among them. Reverted after observing.
  it("RB12g: Cancel the export and go on cancels an execute that started after the ask appeared, once, and the statement follows its outcome", async () => {
    const statement = () => text(".late-cancel-path");
    /** The ask appears over a prepare run; the prepare ends into the approval prompt; the phrase is submitted, so that an execute starts; then the choice is made. */
    async function lateExecute(openPath: string, attemptId: string, handle: string, outcome: import("./publish/types").ExecuteOutcome) {
      const prepare = deferred<import("./publish/types").PrepareOutcome>();
      mocks.publish.pendingPrepare = prepare.promise;
      click(q(".publish-disclosure"));
      await prepareExport();
      await startOpen(openPath);
      expect(q(ASK), "the ask shows over the prepare run").not.toBeNull();
      await endRun(prepare, { status: "prompt", attempt_id: attemptId, prompt: promptFixture() });
      const execute = deferred<import("./publish/types").ExecuteOutcome>();
      mocks.publish.pendingExecute = execute.promise;
      mocks.publish.pendingPrepare = null;
      await submitExport();
      expect(mocks.publish.executes.at(-1)?.[0], "the execute started while the ask stood").toBe(attemptId);
      expect(q(ASK), "the ask still stands").not.toBeNull();

      const cancelsBefore = mocks.publish.cancels.length;
      click(q(".open-during-export-cancel"));
      await finishOpen();
      expect(mocks.publish.cancels.slice(cancelsBefore), "the prepare's key and the execute's key, once each").toEqual([prepareCancelKey(handle), attemptId]);
      expect(closes(handle), "the old handle stays open while the execute runs").toBe(0);
      await endRun(execute, outcome);
      expect(closes(handle), "closed once, after the execute's outcome").toBe(1);
    }

    await open("C:/data/a.parquet");
    await lateExecute("C:/data/b.parquet", "at_g1", handleOf(1), success("C:/out/g1"));
    expect(statement(), "the execute finished: the statement names its bundle").toBe("C:/out/g1");

    await lateExecute("C:/data/c.parquet", "at_g2", handleOf(2), { status: "refused", message: "cancelled" });
    expect(q(".late-cancel-statement"), "the execute was stopped: no statement").toBeNull();

    // Pass 3 (the reviewer's C1-R, gate 2 of PR 217): the execute is reported after the ask appeared and has ended before the choice, so it is in neither the ask's runs at the time of asking
    // nor the runs standing at the choice. The statement is decided at the choice, from the run it was added to.
    const handle = handleOf(3);
    const prepare = deferred<import("./publish/types").PrepareOutcome>();
    mocks.publish.pendingPrepare = prepare.promise;
    click(q(".publish-disclosure"));
    await prepareExport();
    await startOpen("C:/data/d.parquet");
    expect(q(ASK), "pass 3: the ask shows over the prepare run").not.toBeNull();
    await endRun(prepare, { status: "prompt", attempt_id: "at_g3", prompt: promptFixture() });
    mocks.publish.pendingPrepare = null;
    mocks.publish.pendingExecute = Promise.resolve(success("C:/out/g3"));
    await submitExport();
    expect(mocks.publish.executes.at(-1)?.[0], "pass 3: the execute started while the ask stood").toBe("at_g3");
    expect(q(ASK), "pass 3: the ask still stands").not.toBeNull();
    expect(shown(".publish-summary-headline"), "pass 3: the execute finished while the ask stands").toBe("Exported.");
    expect(q(".late-cancel-statement"), "pass 3: no choice, no statement").toBeNull();

    const cancelsBefore = mocks.publish.cancels.length;
    click(q(".open-during-export-cancel"));
    expect(await finishOpen()).toEqual({ kind: "admitted" });
    expect(statement(), "pass 3: decided at the choice, the statement names the bundle the finished execute gave").toBe("C:/out/g3");
    expect(mocks.publish.cancels.slice(cancelsBefore), "pass 3: the prepare's key and the execute's key, once each").toEqual([prepareCancelKey(handle), "at_g3"]);
    expect(closes(handle), "pass 3: the old handle is closed once").toBe(1);

    // Pass 4 (the reviewer's C1, gate 3 of PR 217): two executes finish while one ask stands, and the choice is made after both. Each is decided at the choice, and each gets its statement.
    const handle4 = handleOf(4);
    const executesBefore = mocks.publish.executes.length;
    const prepare4 = deferred<import("./publish/types").PrepareOutcome>();
    mocks.publish.pendingPrepare = prepare4.promise;
    click(q(".publish-disclosure"));
    await prepareExport();
    await startOpen("C:/data/e.parquet");
    expect(q(ASK), "pass 4: the ask shows over the prepare run").not.toBeNull();
    await endRun(prepare4, { status: "prompt", attempt_id: "at_g4a", prompt: promptFixture() });
    mocks.publish.pendingPrepare = null;
    mocks.publish.pendingExecute = Promise.resolve(success("C:/out/first"));
    await submitExport();
    expect(shown(".publish-summary-headline"), "pass 4: the first execute finished while the ask stands").toBe("Exported.");
    expect(q(ASK), "pass 4: the ask still stands").not.toBeNull();
    mocks.publish.pendingExecute = Promise.resolve(success("C:/out/second"));
    await prepareExport();
    await submitExport();
    expect(q(ASK), "pass 4: the ask still stands after the second execute").not.toBeNull();
    expect(q(".late-cancel-statement"), "pass 4: no choice, no statement").toBeNull();
    const executeKeys = mocks.publish.executes.slice(executesBefore).map((args) => args[0]);
    expect(executeKeys, "pass 4: two executes started while the ask stood").toEqual(["at_g4a", `at_${mocks.publish.prepares.length}`]);

    const cancelsBefore4 = mocks.publish.cancels.length;
    click(q(".open-during-export-cancel"));
    expect(await finishOpen()).toEqual({ kind: "admitted" });
    expect([...container.querySelectorAll(".late-cancel-path")].map((element) => element.textContent), "pass 4: one statement for each bundle, in the order decided").toEqual([
      "C:/out/first",
      "C:/out/second",
    ]);
    expect(mocks.publish.cancels.slice(cancelsBefore4), "pass 4: each run's key, once each (the two prepare runs share the handle's key)").toEqual([
      prepareCancelKey(handle4),
      "at_g4a",
      prepareCancelKey(handle4),
      executeKeys[1],
    ]);
    expect(closes(handle4), "pass 4: the old handle is closed once").toBe(1);
  });
});
