// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, the PR A render rows RC1, RC2, RC8 (both cases), RC9, RC10, RC13, RC15 and RC17, and Amendment 1 item 9's RC-SLASH, and the PR B rows RC3 to RC7, RC11, RC12, RC14 and
 * RC16 (and RC-FIELD, a row beyond the table), through the REAL `App`.
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
  /** PR B: when set, `publishPrepare` answers with an approval prompt (RC12), and `publishExecute` counts the calls the host would get. */
  promptOnPrepare: false,
  executes: 0,
  pendingPrepare: null as Promise<import("./publish/types").PrepareOutcome> | null,
  recorded: [] as { dataset: string; intent: unknown }[],
  refuseRecordWith: null as string | null,
  /** `refuseContaining`: a request whose filter holds this text is refused `skp.filter_unknown_column`, as the kernel refuses an unknown column. */
  manager: { requests: [] as { bbox: unknown; filter: unknown }[], refuseContaining: null as string | null },
  canvas: { mounted: [] as string[], resets: 0, fitToBounds: 0, fitToBbox: [] as unknown[], props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
    geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
    identity: { source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000", max_value: "99999", js_exact: true, class: "native", session_statement: null },
    schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }, { name: "zone", arrow_type: "Utf8", nullable: true, projectable: true }, { name: "geometry", arrow_type: "Binary", nullable: false, projectable: false }],
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
    if (mocks.promptOnPrepare) return { status: "prompt", attempt_id: "at_1", prompt: { operation: "publish", class: 3, reversibility: "irreversible", source_name: "parcels.parquet", source_content_hash: "sha256:abc", style_hash: "sha256:def", destination_display: "C:/out/bundle", grantor: "operator", grant_remaining_s: 300, row_scope: "the whole file", filter_scope: null, outcome_summary: "a folder" } };
    return mocks.pendingPrepare ?? { status: "picker-cancelled" };
  },
  publishExecute: async (): Promise<import("./publish/types").ExecuteOutcome> => {
    mocks.executes += 1;
    return { status: "success", bundle_path: "C:/out/bundle", rows: 2000, partitions: 1, total_bytes: 1, manifest_bytes: 1, style_hash: "sha256:def", operation_digest: "sha256:ghi", build_millis: 0 };
  },
  publishCancel: async (): Promise<boolean> => true,
}));

vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    async requestViewport(bbox?: unknown, _bboxCrs?: unknown, _nowMs?: unknown, filter?: { predicate: string } | null): Promise<unknown> {
      mocks.manager.requests.push({ bbox, filter: filter ?? null });
      const refuse = mocks.manager.refuseContaining;
      if (refuse !== null && filter?.predicate.includes(refuse)) {
        const { SkpCallError } = await import("./skp/client");
        throw new SkpCallError({ code: "skp.filter_unknown_column", message: "no such column", fields: { column: refuse } });
      }
      return { kind: "issued", streamHandle: "st_1" };
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
        resetFitForNewGeneration: () => {
          mocks.canvas.resets += 1;
        },
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
import { COMMAND_BUSY_NOTE, COMMAND_FIELD_NOTE, COMMAND_UNAVAILABLE_NOTE } from "./command/CommandBar";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { CLAUSE_ADVANCED_MARK, CLAUSE_ADVANCED_NEW_LINE, CLAUSE_REFUSED_LINE, clauseBlockedLine } from "./filter/ClauseCards";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const handleOf = (n: number) => `ds_${n.toString(16).padStart(32, "0")}`;

describe("App: the command bar (milestone 3, PR A), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { opens: 0, holdOpen: null, picks: 0, pickPath: null, prepares: 0, promptOnPrepare: false, executes: 0, pendingPrepare: null, recorded: [], refuseRecordWith: null });
    Object.assign(mocks.manager, { requests: [], refuseContaining: null });
    Object.assign(mocks.canvas, { mounted: [], resets: 0, fitToBounds: 0, fitToBbox: [], props: null });
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
  /** PR B: the cards (their texts and switches), the filters the manager has been asked for, and one `/filter` sent from the bar. */
  const cardTexts = () => [...container.querySelectorAll(".clause-card .clause-text")].map((e) => e.textContent);
  const switches = () => [...container.querySelectorAll<HTMLButtonElement>(".clause-switch")];
  const states = () => switches().map((b) => b.getAttribute("aria-checked"));
  const asked = () => mocks.manager.requests.map((r) => (r.filter as { predicate: string } | null)?.predicate ?? null);
  const stepped = () => mocks.recorded.map((r) => (r.intent as { params: { filter: { predicate: string } | null } }).params.filter?.predicate ?? null);
  const addClause = (condition: string) => runBar(`/filter ${condition}`);
  const flip = (index: number) => inAct(() => switches()[index].click());
  const A = `"zone" = 'residential'`;
  const B = `"id" > 5`;
  const AB = `(${A}) AND (${B})`;
  const hiddenOf = (region: string) => q(`#region-${region}`)!.hidden;

  // RECORDED MUTATION for "RC1": in StudioLayout.tsx's `runAction`, drop the focus call from `command.focus`'s arm (delete `barRef.current?.take();`). Expected failure: the bar's input does not hold the focus.
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC1: Ctrl+K through the real window listener focuses the bar's input, and the map is mounted once":
  //   AssertionError: the bar's input holds the focus: expected <body> to be <input> (the focus stayed on the body). Reverted after observing.
  it("RC1: Ctrl+K through the real window listener focuses the bar's input, and the map is mounted once", async () => {
    await open("C:/data/a.parquet");
    expect(document.activeElement).not.toBe(bar());
    const notPrevented = press(window, "k", { ctrlKey: true });
    expect(document.activeElement, "the bar's input holds the focus").toBe(bar());
    expect(notPrevented, "the chord's default is prevented").toBe(false);
    expect(mocks.canvas.mounted, "the map is mounted once").toEqual([handleOf(1)]);
  });

  // RECORDED MUTATION for "RC2": in StudioLayout.tsx pass CommandBar a copy of runAction whose toggle arm dispatches without apply (replace run={runAction} with run={(id) => { const region = TOGGLE_REGION[id]; if (region !== undefined) { dispatch({ kind: "toggle", region }); return "done"; } return runAction(id); }}), so the bar's path records no row and the buttons' path still does. Expected failure: the row assertion.
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC2: each layout entry run from the bar flips the region its button flips and records the same row, and Zoom to layer calls fitToBounds once":
  //   AssertionError: /layers: the same row: expected [] to deeply equal [ 'layout.toggleLayers' ]. Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC8: /open calls the picker once, the button's path; while an open is in flight it calls nothing and shows the busy line":
  //   AssertionError: the picker is called once: expected +0 to be 1. Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC8 case b: with the ask showing, /open calls the picker once more and the first open does not proceed":
  //   AssertionError: the picker is called once more, as a second click would: expected 1 to be 2. Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC9: /export opens the Inspector and its Layer tab, expands Export and focuses .publish-open, and publishPrepare is not called":
  //   AssertionError: nothing is exported: expected 1 to be +0. Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC10: Escape returns focus to the filter input it came from, or to the map region when that input's region is closed":
  //   AssertionError: nothing held it before: the map region: expected <input> to be <main id="region-map">. Reverted after observing.
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

  // RECORDED MUTATION for "RC10 case b": in CommandBar.tsx's `applyEntry` make the run directly (replace `flushSync(() => run(id))` with `run(id)`), so `leave` reads the page before the run commits and the bar returns the focus to the field in the region it just closed. Expected failure: the focus is on the field, not the map region.
  // OBSERVED AT 0e9944eabedcb862b04abf78234a7f19f4031358: FAILED -- "RC10 case b: a command run from the bar that closes the region holding the field the focus came from leaves the focus on the map region":
  //   AssertionError: the field's region is closed: the map region, not the field: expected <input> to be <main id="region-map">. The mutation drops flushSync. Reverted after observing.
  it("RC10 case b: a command run from the bar that closes the region holding the field the focus came from leaves the focus on the map region", async () => {
    await open("C:/data/a.parquet");
    const field = q<HTMLInputElement>(".filter-predicate")!;
    act(() => field.focus());
    press(window, "k", { ctrlKey: true });
    expect(document.activeElement).toBe(bar());
    await runBar("/inspector");
    expect(hiddenOf("inspector"), "the command closed the Inspector").toBe(true);
    expect(document.activeElement, "the field's region is closed: the map region, not the field").toBe(q("#region-map"));
  });

  // RECORDED MUTATION for "RC10 case c": as case b's (replace `flushSync(() => run(id))` with `run(id)` in CommandBar.tsx's `applyEntry`), so the bar returns the focus to the Inspector's splitter, which the run then hides. Expected failure: the focus is on the splitter, not the map region.
  // OBSERVED AT 0e9944eabedcb862b04abf78234a7f19f4031358: FAILED -- "RC10 case c: a command run from the bar that closes the region whose splitter the focus came from leaves the focus on the map region":
  //   AssertionError: the splitter is hidden with its region: the map region, not the splitter: expected <div id="splitter-inspector"> to be <main id="region-map">. The mutation drops flushSync. Reverted after observing.
  it("RC10 case c: a command run from the bar that closes the region whose splitter the focus came from leaves the focus on the map region", async () => {
    await open("C:/data/a.parquet");
    act(() => q("#splitter-inspector")!.focus());
    expect(document.activeElement, "the focus starts on the splitter").toBe(q("#splitter-inspector"));
    press(window, "k", { ctrlKey: true });
    expect(document.activeElement).toBe(bar());
    await runBar("/inspector");
    expect(hiddenOf("inspector"), "the command closed the Inspector").toBe(true);
    expect(document.activeElement, "the splitter is hidden with its region: the map region, not the splitter").toBe(q("#region-map"));
  });

  // RECORDED MUTATION for "RC10 case d": in StudioLayout.tsx's `apply`, after the line `if (holdsFocus) mapRef.current?.focus();`, put back round 1's two lines (a comment, then `if (heldRef.current !== null && regionRefs[action.region].current?.contains(heldRef.current) === true) heldRef.current = null;`), so a region closed by a chord pressed in the bar makes the bar forget the field. Expected failure: the focus is on the map region, not the field.
  // OBSERVED AT 0e9944eabedcb862b04abf78234a7f19f4031358: FAILED -- "RC10 case d: a region closed and opened again by chords pressed in the bar gives the focus back to the field it came from on Escape":
  //   AssertionError: the field is showing again: back to the field: expected <main id="region-map"> to be <input>. The mutation puts back round 1's two lines in `apply`. Reverted after observing.
  it("RC10 case d: a region closed and opened again by chords pressed in the bar gives the focus back to the field it came from on Escape", async () => {
    await open("C:/data/a.parquet");
    const field = q<HTMLInputElement>(".filter-predicate")!;
    act(() => field.focus());
    press(window, "k", { ctrlKey: true });
    press(bar(), "i", { ctrlKey: true });
    expect(hiddenOf("inspector"), "the first chord closed the Inspector").toBe(true);
    press(bar(), "i", { ctrlKey: true });
    expect(hiddenOf("inspector"), "the second chord opened it again").toBe(false);
    press(bar(), "Escape");
    expect(document.activeElement, "the field is showing again: back to the field").toBe(field);
  });

  // RECORDED MUTATION for "RC13": in CommandBar.tsx stop updating `aria-activedescendant` (pass `undefined`). Expected failure: the active descendant after ArrowDown.
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC13: the combobox has aria-expanded, aria-controls naming the listbox, and aria-activedescendant following the arrow keys":
  //   AssertionError: expected null to be 'command-list-option-0' (the first ArrowDown). Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC15: typing s and n in the bar types them and switches no tool":
  //   AssertionError: neither key is prevented, so both are typed: expected [ false, false ] to deeply equal [ true, true ]. Reverted after observing.
  it("RC15: typing s and n in the bar types them and switches no tool", async () => {
    await open("C:/data/a.parquet");
    act(() => bar().focus());
    expect([press(bar(), "s"), press(bar(), "n")], "neither key is prevented, so both are typed").toEqual([true, true]);
    expect([pressed("Navigate"), pressed("Select")]).toEqual(["true", "false"]);
    expect([press(document.body, "s"), pressed("Select")], "outside the bar the same key still selects").toEqual([false, "true"]);
  });

  // RECORDED MUTATION for "RC-SLASH": in actionRegistry.ts's `matchCommandOpener` also ignore Shift (add `|| event.shiftKey` to the ignored modifiers). Expected failure: the Shift case leaves the bar empty.
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC-SLASH: / with no field focused focuses the bar and leaves / in it, so does Shift+/, and / in a text field changes nothing outside that field":
  //   AssertionError: Shift+7 on a layout where / needs Shift: the default is prevented: expected true to be false. Reverted after observing.
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
  // OBSERVED AT 6f83d5377e3592760d0286b82f45415b11c278ee: FAILED -- "RC17: Navigate and Select run from the bar and record one tool.set row each; with nothing selected both selection entries are aria-disabled and run nothing; with a feature selected Zoom to selection and Clear selection run once and record their rows":
  //   (a) AssertionError: expected [ +0, [] ] to deeply equal [ +0, [ 'selection.clear' ] ]; (b) AssertionError: expected [ null, null ] to deeply equal [ 'true', 'true' ]. Each reverted after observing.
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

  // RECORDED MUTATIONS for "RC3", each applied alone. (a) In filterClauses.ts's `combineClauses` join with ` OR ` in place of ` AND `. Expected failure: the manager's filter.
  // (b) (RC3-b, Amendment 3 item 4(d)) In App.tsx's `commitFilterChange` enqueue the step only for `filter.apply` (`if (dataset !== null && transition.action === "filter.apply")`), so the card commit records nothing. Expected failure: the step count.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: (a) FAILED -- "RC3: ...": AssertionError: the manager receives the combination with the dialect constant: expected { …(2) } to deeply equal { …(2) };
  // (b) FAILED -- "RC3: ...": AssertionError: one card sends its text byte for byte: expected [ '"zone" = \'residential\'', [] ] to deeply equal [ '"zone" = \'residential\'', …(1) ] (no step was recorded). Each reverted after observing.
  it("RC3: two simple clauses reach the manager as (t1) AND (t2) with the dialect constant, two cards are on, the Applied line shows it, and one filter.apply step holding it is recorded after each outcome", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    expect([asked().at(-1), stepped()], "one card sends its text byte for byte").toEqual([A, [A]]);
    expect(bar().value, "an applied /filter clears the draft").toBe("");
    expect(document.activeElement, "and keeps the focus").toBe(bar());
    await addClause(B);
    expect(mocks.manager.requests.at(-1)!.filter, "the manager receives the combination with the dialect constant").toEqual({ predicate: AB, dialect: "duckdb-expr/0" });
    expect([cardTexts(), states()]).toEqual([[A, B], ["true", "true"]]);
    expect(text(".filter-active"), "the Applied line shows the combination").toBe(`Applied: ${AB}`);
    expect(stepped(), "one filter.apply step per outcome, the second holding what the manager received").toEqual([A, AB]);
  });

  // RECORDED MUTATION for "RC4": in App.tsx's `changeClauses` dispatch `filter.clauses.set` with the proposal before `applyFilterWith` is awaited (insert `dispatch({ type: "view.transition", view: current.id, transition: { action: "filter.clauses.set", params: { clauses, step } } });` before `try {`). Expected failure: the card is added before the outcome.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC4: ...": AssertionError: no card is added: expected [ '"zone" = \'residential\'', …(1) ] to deeply equal [ '"zone" = \'residential\'' ]. Reverted after observing.
  it("RC4: a clause the kernel refuses by name adds no card and changes nothing applied, and the refusal shows under the bar, which keeps its text", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    mocks.manager.refuseContaining = "nope";
    await addClause(`"nope" = 1`);
    expect(cardTexts(), "no card is added").toEqual([A]);
    expect(text(".filter-active"), "the applied filter is unchanged").toBe(`Applied: ${A}`);
    expect(asked().slice(-2), "the refused request, then the last applied filter again").toEqual([`(${A}) AND ("nope" = 1)`, A]);
    expect(mocks.recorded, "nothing is recorded for a refusal").toHaveLength(1);
    expect(text(".command-result .admission-refusal-code")).toBe("skp.filter_unknown_column");
    expect(text(".command-result p")).toBe(CLAUSE_REFUSED_LINE);
    expect(bar().value, "the bar keeps its text").toBe(`/filter "nope" = 1`);
  });

  // RECORDED MUTATIONS for "RC5", each applied alone. (a) As RC4's: dispatch `filter.clauses.set` before the outcome. Expected failure: the refused toggle has flipped the card.
  // (b) (RC5-b) In App.tsx's `commitFilterChange` enqueue, for a `setEnabled` step, a filter holding the toggled clause's own text (replace the enqueued `filter` with `transition.action === "filter.clauses.set" && transition.params.step.kind === "setEnabled" ? { ...filter!, predicate: transition.params.clauses.find((c) => c.id === transition.params.step.clause)!.text } : filter`). Expected failure: the off step.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: (a) FAILED -- "RC5: ...": AssertionError: a refused toggle leaves the card as it was applied: expected [ 'true', 'true' ] to deeply equal [ 'true', 'false' ];
  // (b) FAILED -- "RC5: ...": AssertionError: the off step holds the remaining combination, the on step the restored one: expected [ '"zone" = \'residential\'', …(3) ] to deeply equal [ '"zone" = \'residential\'', …(3) ]. Each reverted after observing.
  it("RC5: off issues the remaining combination and on restores it, each recorded once, and a refused toggle leaves the card as it was applied", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    await addClause(B);
    await flip(1);
    expect([asked().at(-1), states(), text(".filter-active")], "off: the remaining card, byte for byte").toEqual([A, ["true", "false"], `Applied: ${A}`]);
    await flip(1);
    expect([asked().at(-1), states()], "on: the combination again").toEqual([AB, ["true", "true"]]);
    expect(stepped(), "the off step holds the remaining combination, the on step the restored one").toEqual([A, AB, A, AB]);
    await flip(1);
    mocks.manager.refuseContaining = `"id"`;
    await flip(1);
    expect(states(), "a refused toggle leaves the card as it was applied").toEqual(["true", "false"]);
    expect([text(".filter-active"), stepped()], "the applied filter and the history are unchanged").toEqual([`Applied: ${A}`, [A, AB, A, AB, A]]);
    expect([text(".clause-foot .clause-line"), text(".clause-foot .admission-refusal-code")]).toEqual([CLAUSE_REFUSED_LINE, "skp.filter_unknown_column"]);
  });

  // RECORDED MUTATION for "RC6": in viewTransitions.ts's `filter.apply` case append the new card to the held ones (`clauses: [...viewClauses(view), { id: ..., ... }]`). Expected failure: the panel's Apply leaves two cards.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC6: ...": AssertionError: one card, its text as typed: expected [ [ …(3) ], …(1) ] to deeply equal [ [ '  zone = \'x\'  ' ], …(1) ]. Reverted after observing.
  it("RC6: the panel's Apply replaces the cards with one holding its text, and Clear removes them all", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    await addClause(B);
    setValue(q<HTMLInputElement>(".filter-predicate")!, "  zone = 'x'  ");
    await inAct(() => q<HTMLButtonElement>(".filter-apply")!.click());
    expect([cardTexts(), text(".filter-active")], "one card, its text as typed").toEqual([["  zone = 'x'  "], "Applied:   zone = 'x'  "]);
    await inAct(() => q<HTMLButtonElement>(".filter-clear")!.click());
    expect([cardTexts(), q(".filter-active"), q(".clause-statement")], "Clear removes every card and the statement").toEqual([[], null, null]);
  });

  // RECORDED MUTATIONS for "RC7", each applied alone. (a) In filterClauses.ts's `proposeClauseChange` send it anyway (replace `blockerOf`'s return, `return recognizeSimple(candidate.text) ? on.find((clause) => !recognizeSimple(clause.text)) : on[0];`, with `return on.length < 0 ? on[0] : undefined;`, so that no change is refused). Expected failure: the request count.
  // (b) (RC7-b) Drop the row (delete `recordNamed("gui-action", "filter.clauseNotSent");`). Expected failure: the row count.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: (a) FAILED -- "RC7: ...": AssertionError: no requestViewport call: expected 3 to be 2 // Object.is equality;
  // (b) FAILED -- "RC7: ...": AssertionError: expected [] to deeply equal [ 'filter.clauseNotSent' ]. Each reverted after observing. (The first run of (a), at 8ae62df2, replaced the refusal branch in App.tsx and crashed the render with a TypeError before the count; it is not the mutation recorded.)
  it("RC7: an advanced clause beside a card that is on is not sent, with the shell's line and one filter.clauseNotSent row, and a card beside an advanced card that is on is not sent either", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    const [requests, from] = [mocks.manager.requests.length, mark()];
    await addClause(`"zone" = 'a' OR "zone" IS NULL`);
    expect(mocks.manager.requests.length, "no requestViewport call").toBe(requests);
    expect(text(".command-note")).toBe(CLAUSE_ADVANCED_NEW_LINE);
    expect([bar().value, cardTexts(), mocks.recorded.length], "the draft, the cards and the history stand").toEqual([`/filter "zone" = 'a' OR "zone" IS NULL`, [A], 1]);
    expect(rowsSince(from)).toEqual(["filter.clauseNotSent"]);
    await flip(0);
    await addClause(`"zone" = 'a' OR "zone" IS NULL`);
    expect(cardTexts().length, "with the other card off, the advanced one is added").toBe(2);
    expect(q(".clause-advanced")!.textContent).toBe(CLAUSE_ADVANCED_MARK);
    const before = mocks.manager.requests.length;
    await flip(0);
    expect([mocks.manager.requests.length, text(".clause-line")], "turning the simple card on beside an advanced one: not sent, and the advanced card is named").toEqual([before, clauseBlockedLine(`"zone" = 'a' OR "zone" IS NULL`)]);
    expect(rowsSince(from)).toEqual(["filter.clauseNotSent", "filter.clauseNotSent"]);
  });

  // RECORDED MUTATION for "RC11": in viewTransitions.ts's `filter.clauses.set` case clear the selection (add `selection: NO_MEMBERS` to the returned view). Expected failure: the count falls to 0.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC11: ...": AssertionError: the selection survived: expected +0 to be 1 // Object.is equality. Reverted after observing.
  it("RC11: with one feature selected, switching a card off leaves the count at 1", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    await addClause(B);
    click([...container.querySelectorAll(".tool-switch-button")].find((b) => b.textContent === "Select") ?? null);
    await inAct(() => mocks.canvas.props!.onClickPick!({ kind: "feature", pick: { streamHandle: "st_1", batchSeq: 0, id: 1n, anchor: null }, bounds: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 } }));
    expect(mocks.canvas.props!.highlight!.selected.size).toBe(1);
    await flip(1);
    expect(states(), "the card went off").toEqual(["true", "false"]);
    expect(mocks.canvas.props!.highlight!.selected.size, "the selection survived").toBe(1);
  });

  // RECORDED MUTATION for "RC12": in viewTransitions.ts's `filter.clauses.set` case leave the filter as it was (`filter: view.filter`). Expected failure: the host call after the toggle.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC12: ...": AssertionError: the host was not called: expected 1 to be +0 // Object.is equality. Reverted after observing.
  it("RC12: an export staged before a card toggle is refused at execute, and publishExecute is not called", async () => {
    await open("C:/data/a.parquet");
    await addClause(A);
    await addClause(B);
    mocks.promptOnPrepare = true;
    await inAct(() => mocks.canvas.props!.onViewShown!({ xmin: 0, ymin: 0, xmax: 100, ymax: 100 }));
    click(q(".publish-disclosure"));
    click(q('input[name="publish-scope"][value="whole"]'));
    await inAct(() => q<HTMLButtonElement>(".publish-open")!.click());
    expect(q(".publish-dialog"), "the approval prompt stands").not.toBeNull();
    await flip(1);
    setValue(q<HTMLInputElement>(".publish-dialog-phrase")!, "bundle");
    await inAct(() => q<HTMLButtonElement>(".publish-dialog-submit")!.click());
    expect(mocks.executes, "the host was not called").toBe(0);
    expect(text(".publish-panel .admission-refusal-message")).toBe("[P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again.");
  });

  // RECORDED MUTATION for "RC14": in App.tsx's `applyFilterWith` make the reset a no-op (delete `canvasRef.current?.resetFitForNewGeneration();`). Expected failure: the reset count after an issued card change.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC14: ...": AssertionError: an issued add: expected +0 to be 1 // Object.is equality. Reverted after observing.
  it("RC14: a card change resets the fit once on an issued outcome and never on a refusal, as an Apply does", async () => {
    await open("C:/data/a.parquet");
    const resets = () => mocks.canvas.resets;
    const base = resets();
    await addClause(A);
    expect(resets() - base, "an issued add").toBe(1);
    await flip(0);
    expect(resets() - base, "an issued toggle").toBe(2);
    mocks.manager.refuseContaining = "nope";
    await addClause(`"nope" = 1`);
    expect(resets() - base, "a refusal").toBe(2);
  });

  // RECORDED MUTATION for "RC16": in App.tsx's `commitFilterChange` send a card change's step directly (for `filter.clauses.set` call `void recordStep(dataset, { action: "filter.apply", params: { filter } }).catch(() => {})` in place of the enqueue). Expected failure: no notice stands.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC16: ...": AssertionError: expected '(no element matches .record-notice)' to be 'Filter applied. The session history d…' // Object.is equality. Reverted after observing.
  it("RC16: with recordStep refused, a card change is still applied and the strip shows the filter notice with the kernel's message", async () => {
    mocks.refuseRecordWith = "this session history takes no more steps: an earlier write to it failed";
    await open("C:/data/a.parquet");
    await addClause(A);
    await inAct(() => {});
    expect([cardTexts(), text(".filter-active")], "applied").toEqual([[A], `Applied: ${A}`]);
    expect(mocks.recorded, "the step was tried").toHaveLength(1);
    expect(text(".record-notice")).toBe("Filter applied. The session history did not confirm keeping it: this session history takes no more steps: an earlier write to it failed");
  });

  // RECORDED MUTATION for "RC-FIELD" (a row beyond the table: the bar's list of field names): in App.tsx pass no schema (`filterFields={null}`). Expected failure: no field options.
  // OBSERVED AT 174dfced0f1fcaa62a0cadde36201f13593d0d91: FAILED -- "RC-FIELD: ...": AssertionError: the schema in order, each name with its Arrow type, no geometry column: expected [] to deeply equal [ 'idUInt64', 'zoneUtf8' ]. Reverted after observing.
  it("RC-FIELD: after an @ the list holds the file's field names without the geometry column, Tab puts the name in double-quoted, the list stays closed, and Enter alone never completes", async () => {
    await open("C:/data/a.parquet");
    act(() => bar().focus());
    setValue(bar(), "/filter @");
    expect(options().map((o) => o.textContent), "the schema in order, each name with its Arrow type, no geometry column").toEqual(["idUInt64", "zoneUtf8"]);
    setValue(bar(), "/filter @ZO");
    const sent = mocks.manager.requests.length;
    expect(options().map((o) => o.querySelector(".command-field-name")!.textContent)).toEqual(["zone"]);
    press(bar(), "ArrowDown");
    await inAct(() => void press(bar(), "Enter"));
    expect([bar().value, text(".command-note")], "Enter on an option does not complete").toEqual(["/filter @ZO", COMMAND_FIELD_NOTE]);
    expect(mocks.manager.requests.length, "and sends nothing").toBe(sent);
    setValue(bar(), "/filter @ZO");
    expect(press(bar(), "Tab"), "Tab completes (and is prevented)").toBe(false);
    expect([bar().value, q(".command-list")], "double-quoted, the list closed").toEqual(['/filter "zone"', null]);
    press(bar(), "ArrowDown");
    expect(q(".command-list"), "ArrowDown does not reopen it until the next typed character").toBeNull();
    expect(press(bar(), "Tab"), "a second Tab leaves").toBe(true);
    setValue(bar(), '/filter "zone" = @i');
    click(options()[0]);
    expect(bar().value, "a click completes too").toBe('/filter "zone" = "id"');
  });
});
