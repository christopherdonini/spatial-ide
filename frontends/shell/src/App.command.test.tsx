// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, the PR A render rows RC1, RC2, RC8 (both cases), RC9, RC10, RC13, RC15 and RC17, and Amendment 1 item 9's RC-SLASH, through the REAL `App`.
 * The harness is `App.selection.test.tsx`'s (Amendment 3 item 9): the same mocked boundaries (the SKP transport, the baseline stream manager, the WebGL canvas, `publish/client`), with the SKP
 * client's `recordStep` logged and refusable as `App.recording.test.tsx` has it, the canvas stand-in counting `fitToBounds` as well as `fitToBbox`, and the picker (`skp/dialog`) counted.
 * The registry, the layout, the bar and the panels are never mocked (invalidator I6).
 */

import { act, forwardRef, useEffect, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  opens: 0,
  /** When set, `openDataset` waits for it: an open in flight. */
  holdOpen: null as Promise<void> | null,
  picks: 0,
  pickPath: null as string | null,
  prepares: 0,
  pendingPrepare: null as Promise<import("./publish/types").PrepareOutcome> | null,
  recorded: [] as { dataset: string; intent: unknown }[],
  refuseRecordWith: null as string | null,
  manager: { requests: [] as { bbox: unknown; filter: unknown }[] },
  canvas: { mounted: [] as string[], fitToBounds: 0, fitToBbox: [] as unknown[], props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: { source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000", max_value: "99999", js_exact: true, class: "native", session_statement: null },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }],
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
      await mocks.holdOpen;
      const hex = mocks.opens.toString(16).padStart(32, "0");
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
      if (mocks.refuseRecordWith !== null) throw new SkpCallError({ code: "skp.session_history_stopped", message: mocks.refuseRecordWith, fields: {} });
      return {};
    },
  };
});

vi.mock("./skp/dialog", () => ({
  pickFile: async (): Promise<string | null> => {
    mocks.picks += 1;
    return mocks.pickPath;
  },
}));

vi.mock("./publish/client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./publish/client")>()),
  subscribePublishProgress: () => () => {},
  publishPrepare: async (): Promise<import("./publish/types").PrepareOutcome> => {
    mocks.prepares += 1;
    return mocks.pendingPrepare ?? { status: "picker-cancelled" };
  },
  publishCancel: async (): Promise<boolean> => true,
}));

vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    requestViewport(bbox?: unknown, _bboxCrs?: unknown, _nowMs?: unknown, filter?: unknown): Promise<unknown> {
      mocks.manager.requests.push({ bbox, filter: filter ?? null });
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

vi.mock("./canvas/WorkingCanvas", () => {
  const MockWorkingCanvas = forwardRef<import("./canvas/WorkingCanvas").WorkingCanvasHandle, import("./canvas/WorkingCanvas").WorkingCanvasProps>(function MockWorkingCanvas(props, ref) {
    mocks.canvas.props = props;
    useEffect(() => {
      mocks.canvas.mounted.push(props.dataset);
    }, [props.dataset]);
    useImperativeHandle(
      ref,
      () => ({
        pushBatch: () => 0,
        clearStream: () => {},
        fitToBounds: () => {
          mocks.canvas.fitToBounds += 1;
          return true;
        },
        fitToBbox: (bbox) => {
          mocks.canvas.fitToBbox.push(bbox);
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
import { COMMAND_BUSY_NOTE, COMMAND_UNAVAILABLE_NOTE } from "./command/CommandBar";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const handleOf = (n: number) => `ds_${n.toString(16).padStart(32, "0")}`;

describe("App: the command bar (milestone 3, PR A), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { opens: 0, holdOpen: null, picks: 0, pickPath: null, prepares: 0, pendingPrepare: null, recorded: [], refuseRecordWith: null });
    Object.assign(mocks.manager, { requests: [] });
    Object.assign(mocks.canvas, { mounted: [], fitToBounds: 0, fitToBbox: [], props: null });
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
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const bar = () => q<HTMLInputElement>(".command-input")!;
  const mark = () => consoleRecorder.count();
  const rowsSince = (from: number) => consoleRecorder.entries().slice(from).filter(isGuiActionEntry).map((e) => e.action);
  const pressed = (name: "Navigate" | "Select") => [...container.querySelectorAll(".tool-switch-button")].find((b) => b.textContent === name)?.getAttribute("aria-pressed");

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

  /** A key on `target`, bubbling to the window as the browser's would. Answers whether its default was left alone (a prevented key is not typed). */
  function press(target: Element | Window, key: string, init: KeyboardEventInit = {}): boolean {
    let notPrevented = true;
    act(() => {
      const code = /^[A-Za-z]$/.test(key) ? `Key${key.toUpperCase()}` : key;
      notPrevented = target.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true, cancelable: true, ...init }));
    });
    return notPrevented;
  }

  /** Types `draft` into the bar and presses Enter on it. */
  async function runBar(draft: string): Promise<void> {
    act(() => bar().focus());
    setValue(bar(), draft);
    await inAct(() => void press(bar(), "Enter"));
  }
  const options = () => [...container.querySelectorAll(".command-list [role=option]")];
  const hiddenOf = (region: string) => q(`#region-${region}`)!.hidden;

  // RECORDED MUTATION for "RC1": in StudioLayout.tsx's `runAction`, drop the focus call from `command.focus`'s arm (delete `barRef.current?.take();`). Expected failure: the bar's input does not hold the focus.
  it("RC1: Ctrl+K through the real window listener focuses the bar's input, and the map is mounted once", async () => {
    await open("C:/data/a.parquet");
    expect(document.activeElement).not.toBe(bar());
    const notPrevented = press(window, "k", { ctrlKey: true });
    expect(document.activeElement, "the bar's input holds the focus").toBe(bar());
    expect(notPrevented, "the chord's default is prevented").toBe(false);
    expect(mocks.canvas.mounted, "the map is mounted once").toEqual([handleOf(1)]);
  });

  // RECORDED MUTATION for "RC2": in StudioLayout.tsx's `runAction` toggle arm, dispatch the action without `apply` (`dispatch({ kind: "toggle", region })`, a copy that records no row). Expected failure: the row assertion.
  it("RC2: each layout entry run from the bar flips the region its button flips and records the same row, and Zoom to layer calls fitToBounds once", async () => {
    await open("C:/data/a.parquet");
    const entries: [string, string, string][] = [["/layers", "layers", "layout.toggleLayers"], ["/inspector", "inspector", "layout.toggleInspector"], ["/activity", "activity", "layout.toggleActivity"]];
    for (const [word, region, row] of entries) {
      const before = hiddenOf(region);
      const fromButton = mark();
      click(q(`.top-bar-toggle[aria-controls="region-${region}"]`));
      expect(hiddenOf(region), `${region}: the button flips it`).toBe(!before);
      expect(rowsSince(fromButton)).toEqual([row]);
      click(q(`.top-bar-toggle[aria-controls="region-${region}"]`));
      const fromBar = mark();
      await runBar(word);
      expect(hiddenOf(region), `${word}: the bar flips it`).toBe(!before);
      expect(rowsSince(fromBar), `${word}: the same row`).toEqual([row]);
    }
    await runBar("/zoom-to-layer");
    expect(mocks.canvas.fitToBounds, "Zoom to layer fits once").toBe(1);
  });

  // RECORDED MUTATION for "RC8": in App.tsx wire `onOpenDataset` to a no-op (`() => "started"`). Expected failure: the picker count.
  it("RC8: /open calls the picker once, the button's path; while an open is in flight it calls nothing and shows the busy line", async () => {
    await runBar("/open");
    expect(mocks.picks, "the picker is called once").toBe(1);
    let release = () => {};
    mocks.holdOpen = new Promise<void>((resolve) => (release = resolve));
    await act(async () => void window.__SPATIAL_E2E__!.openPath!("C:/data/a.parquet"));
    expect(text(".admission-panel button")).toBe("Opening…");
    await runBar("/open");
    expect(mocks.picks, "an open in flight: nothing more is called").toBe(1);
    expect(text(".command-note")).toBe(COMMAND_BUSY_NOTE);
    release();
    await inAct(() => {});
  });

  // RECORDED MUTATION for "RC8 case b": in App.tsx make `onOpenDataset` answer busy while the ask stands (`asking ? "busy" : ...`). Expected failure: the picker count.
  it("RC8 case b: with the ask showing, /open calls the picker once more and the first open does not proceed", async () => {
    await open("C:/data/a.parquet");
    mocks.pendingPrepare = new Promise(() => {});
    click(q(".publish-disclosure"));
    click(q('input[name="publish-scope"][value="whole"]'));
    await inAct(() => q<HTMLButtonElement>(".publish-open")!.click());
    mocks.pickPath = "C:/data/b.parquet";
    await runBar("/open");
    expect([mocks.picks, mocks.opens], "the first /open reached the ask and no further").toEqual([1, 1]);
    expect(q(".open-during-export-ask")).not.toBeNull();
    await runBar("/open");
    expect(mocks.picks, "the picker is called once more, as a second click would").toBe(2);
    expect(mocks.opens, "the first open did not proceed").toBe(1);
    expect(q(".open-during-export-ask"), "the second open stands at the ask").not.toBeNull();
  });

  // RECORDED MUTATION for "RC9": in PublishPanel.tsx make `reveal()` also call `handlePublishClick()` (the panel's click handler). Expected failure: the prepare count.
  it("RC9: /export opens the Inspector and its Layer tab, expands Export and focuses .publish-open, and publishPrepare is not called", async () => {
    await open("C:/data/a.parquet");
    press(window, "i", { ctrlKey: true });
    click(q("#inspector-tab-style"));
    expect([q("#region-inspector")!.hidden, q("#inspector-panel-layer")!.hidden]).toEqual([true, true]);
    const from = mark();
    await runBar("/export");
    expect([q("#region-inspector")!.hidden, q("#inspector-panel-layer")!.hidden], "the Inspector and its Layer tab are showing").toEqual([false, false]);
    expect(q(".publish-disclosure")!.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement, "the button is disabled until the map reports a view: focus is on the disclosure").toBe(q(".publish-disclosure"));
    expect(rowsSince(from)).toEqual(["layout.toggleInspector", "layout.selectInspectorTab", "publish.togglePanelExpanded"]);
    await inAct(() => mocks.canvas.props!.onViewShown!({ xmin: 0, ymin: 0, xmax: 100, ymax: 100 }));
    await runBar("/export");
    expect(document.activeElement, "focus is on the Export button").toBe(q(".publish-open"));
    expect(mocks.prepares, "nothing is exported").toBe(0);
  });

  // RECORDED MUTATION for "RC10": in StudioLayout.tsx's `leaveBar` do not restore focus (delete `back?.focus();`). Expected failure: the focus is not on the filter input.
  it("RC10: Escape returns focus to the filter input it came from, or to the map region when that input's region is closed", async () => {
    await open("C:/data/a.parquet");
    press(window, "k", { ctrlKey: true });
    press(bar(), "Escape");
    expect(document.activeElement, "nothing held it before: the map region").toBe(q("#region-map"));
    const field = q<HTMLInputElement>(".filter-predicate")!;
    act(() => field.focus());
    press(window, "k", { ctrlKey: true });
    expect(document.activeElement).toBe(bar());
    press(bar(), "Escape");
    expect(document.activeElement, "back to the filter input").toBe(field);
    act(() => field.focus());
    press(window, "k", { ctrlKey: true });
    press(bar(), "i", { ctrlKey: true });
    expect(q("#region-inspector")!.hidden, "the chord acts with the focus in the bar").toBe(true);
    press(bar(), "Escape");
    expect(document.activeElement, "the input's region is closed: the map region").toBe(q("#region-map"));
  });

  // RECORDED MUTATION for "RC13": in CommandBar.tsx stop updating `aria-activedescendant` (pass `undefined`). Expected failure: the active descendant after ArrowDown.
  it("RC13: the combobox has aria-expanded, aria-controls naming the listbox, and aria-activedescendant following the arrow keys", async () => {
    expect([bar().getAttribute("role"), bar().getAttribute("aria-expanded"), q(".command-list")]).toEqual(["combobox", "false", null]);
    act(() => bar().focus());
    setValue(bar(), "/");
    expect(bar().getAttribute("aria-expanded")).toBe("true");
    const list = document.getElementById(bar().getAttribute("aria-controls")!)!;
    expect([list.getAttribute("role"), list.className]).toEqual(["listbox", "command-list"]);
    expect(options().length).toBeGreaterThan(5);
    const active = () => bar().getAttribute("aria-activedescendant");
    expect(active()).toBeNull();
    press(bar(), "ArrowDown");
    expect(active()).toBe(options()[0].id);
    press(bar(), "ArrowDown");
    expect(active()).toBe(options()[1].id);
    press(bar(), "ArrowUp");
    expect(active()).toBe(options()[0].id);
    press(bar(), "Escape");
    expect([bar().getAttribute("aria-expanded"), q(".command-list")]).toEqual(["false", null]);
  });

  // RECORDED MUTATION for "RC15": in actionRegistry.ts's `isEditable` make the guard skip the bar (`if (focus?.closest?.(".command-bar")) return false`, a milestone 2 text-field guard that skips `.command-bar`). Expected failure: s switches the tool.
  it("RC15: typing s and n in the bar types them and switches no tool", async () => {
    await open("C:/data/a.parquet");
    act(() => bar().focus());
    expect([press(bar(), "s"), press(bar(), "n")], "neither key is prevented, so both are typed").toEqual([true, true]);
    expect([pressed("Navigate"), pressed("Select")]).toEqual(["true", "false"]);
    expect([press(document.body, "s"), pressed("Select")], "outside the bar the same key still selects").toEqual([false, "true"]);
  });

  // RECORDED MUTATION for "RC-SLASH": in actionRegistry.ts's `matchCommandOpener` also ignore Shift (add `|| event.shiftKey` to the ignored modifiers). Expected failure: the Shift case leaves the bar empty.
  it("RC-SLASH: / with no field focused focuses the bar and leaves / in it, so does Shift+/, and / in a text field changes nothing outside that field", async () => {
    await open("C:/data/a.parquet");
    expect(press(document.body, "/", { code: "Slash" }), "the slash is not typed twice").toBe(false);
    expect([document.activeElement, bar().value]).toEqual([bar(), "/"]);
    setValue(bar(), "");
    act(() => q("#region-map")!.focus());
    expect(press(document.body, "/", { code: "Digit7", shiftKey: true }), "Shift+7 on a layout where / needs Shift: the default is prevented").toBe(false);
    expect([document.activeElement, bar().value], "Shift+7: the bar holds the focus and the slash").toEqual([bar(), "/"]);
    setValue(bar(), "");
    const field = q<HTMLInputElement>(".filter-predicate")!;
    act(() => field.focus());
    expect(press(field, "/", { code: "Slash" }), "the slash stays in the field").toBe(true);
    expect([document.activeElement, bar().value]).toEqual([field, ""]);
  });

  // RECORDED MUTATIONS for "RC17": (a) in App.tsx pass `onClearSelection` a copy that records no row (`() => transit({ action: "selection.clear", params: {} })`). Expected failure: the selection.clear row.
  // (b) in StudioLayout.tsx's `available` leave the selection out of both selection cases (delete `selectionAvailable === true && `). Expected failure: the empty case.
  it("RC17: Navigate and Select run from the bar and record one tool.set row each; with nothing selected both selection entries are aria-disabled and run nothing; with a feature selected Zoom to selection and Clear selection run once and record their rows", async () => {
    await open("C:/data/a.parquet");
    const tools = mark();
    await runBar("/select");
    await runBar("/navigate");
    expect([pressed("Select"), pressed("Navigate")]).toEqual(["false", "true"]);
    expect(rowsSince(tools), "one tool.set row each").toEqual(["tool.set", "tool.set"]);

    const none = mark();
    act(() => bar().focus());
    setValue(bar(), "selection");
    expect(options().map((o) => o.getAttribute("aria-disabled"))).toEqual(["true", "true"]);
    press(bar(), "ArrowDown");
    await inAct(() => void press(bar(), "Enter"));
    expect(text(".command-note"), "an unavailable entry never runs").toBe(COMMAND_UNAVAILABLE_NOTE);
    await runBar("/clear-selection");
    expect([mocks.canvas.fitToBbox.length, rowsSince(none)]).toEqual([0, []]);

    click([...container.querySelectorAll(".tool-switch-button")].find((b) => b.textContent === "Select") ?? null);
    const bounds = { xmin: 0, ymin: 0, xmax: 10, ymax: 10 };
    await inAct(() => mocks.canvas.props!.onClickPick!({ kind: "feature", pick: { streamHandle: "st_1", batchSeq: 0, id: 1n, anchor: null }, bounds }));
    expect(mocks.canvas.props!.highlight!.selected.size).toBe(1);
    const some = mark();
    await runBar("/zoom-to-selection");
    expect([mocks.canvas.fitToBbox, rowsSince(some)], "one fit, one row").toEqual([[bounds], ["selection.zoomTo"]]);
    const cleared = mark();
    await runBar("/clear-selection");
    expect([mocks.canvas.props!.highlight!.selected.size, rowsSince(cleared)]).toEqual([0, ["selection.clear"]]);
  });
});
