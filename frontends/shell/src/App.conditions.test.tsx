// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4 and Amendments 2, 4 and 6 (C-A1 to C-A6): App's raise sites, the strip and
 * the Problems tab, proven from the REAL `App`, the real condition store, `ConditionView`, `ProblemsTab` and `StudioLayout`. The
 * harness is `App.streamFailure.test.tsx`'s and `App.colourRefill.test.tsx`'s: the SKP client (with a `SkpCallError` carrying `skpError`,
 * the shape the session reads), the data plane, the baseline stream manager's stand-in (which keeps the options App builds it with),
 * the publish panel and the WebGL canvas are replaced. The store, the view and the renderer are never mocked (I5). The events mock keeps
 * the handler App registers, so a session end is delivered through it as the kernel's event is. The first `/` of every case that
 * raises is an open, which sets the store's `current`.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PublishPanelHandle } from "./publish/PublishPanel";

type Sink = { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void };
type ManagerOptions = { onTerminal: (streamHandle: string, terminal: { kind: string; detail: string }) => void };

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  /** Every `viewportQuery` the client received: its arguments, in order. */
  queries: [] as unknown[][],
  /** Errors the client throws for the next untiled first looks, oldest first (the candidate session's `reissueUnrestricted`). */
  refuseUntiled: [] as unknown[],
  sinks: new Map<string, Sink>(),
  /** Every `recordStep` the client received; refused with this message when set. */
  recorded: [] as unknown[],
  refuseRecordWith: null as string | null,
  /** What the next `openProject` answers, in order (each a function the test fills). */
  replies: [] as (() => Promise<import("./skp/types").OpenProjectResponse>)[],
  saves: [] as { dataset: string; folder: string | null }[],
  historyMark: "written" as "written" | "withheld",
  /** The handler App registered with `listenDatasetSessionEnded`. */
  sessionEnded: null as null | ((event: import("./skp/types").DatasetSessionEnded) => void),
  /** The options App built the baseline `ViewportStreamManager` with. */
  managerOptions: null as ManagerOptions | null,
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
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(`${skpError.message} (${skpError.code})`);
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
    openProject: async () => {
      const reply = mocks.replies.shift();
      if (reply === undefined) throw new Error("no reply queued for openProject");
      return reply();
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => describeFixture(),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (): Promise<import("./skp/types").CancelResponse> => ({ state: "requested" }),
    viewportQuery: async (...args: unknown[]): Promise<import("./skp/types").ViewportQueryResponse> => {
      mocks.queries.push(args);
      // The session's untiled first look: no box, and the look's own row limit (`isUntiledLook`).
      if (args[1] === null && args[3] === "10000" && mocks.refuseUntiled.length > 0) throw mocks.refuseUntiled.shift();
      return { stream: `st_t${++mocks.streamCounter}`, expires_in_ms: 30_000 };
    },
    recordStep: async (dataset: string, intent: unknown): Promise<Record<string, never>> => {
      mocks.recorded.push({ dataset, intent });
      if (mocks.refuseRecordWith !== null) throw new SkpCallError({ code: "skp.session_history_stopped", message: mocks.refuseRecordWith, fields: {} });
      return {};
    },
    saveProject: async (dataset: string, folder: string | null): Promise<import("./skp/types").SaveProjectResponse> => {
      mocks.saves.push({ dataset, folder });
      return { project: "spatial://project/0000000000000000000000000000000a", history_mark: mocks.historyMark, project_relative: "carried" };
    },
  };
});

vi.mock("./skp/events", () => ({
  listenDatasetSessionEnded: async (handler: (event: import("./skp/types").DatasetSessionEnded) => void) => {
    mocks.sessionEnded = handler;
    return () => {};
  },
}));

vi.mock("./streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
vi.mock("./streaming/adapterWs", () => ({
  startStream: (opts: { ticketHandle: string; sink: Sink }) => {
    mocks.sinks.set(opts.ticketHandle, opts.sink);
    return { cancel: () => {}, stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } };
  },
}));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    constructor(options: ManagerOptions) {
      mocks.managerOptions = options;
    }
    requestViewport(): Promise<unknown> {
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
    }
    async cancelStream(): Promise<void> {}
    async stop(): Promise<void> {}
  }
  return { VIEWPORT_QUERY_MIN_INTERVAL_MS: 120, ViewportStreamManager: MockViewportStreamManager };
});

vi.mock("./publish/PublishPanel", () => {
  const MockPublishPanel = forwardRef<PublishPanelHandle, object>(function MockPublishPanel(_props, ref) {
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
      (): import("./canvas/WorkingCanvas").WorkingCanvasHandle => ({
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
        currentView: () => ({ centre: [2_600_050.5, 1_200_050.25], zoom: 7.5 }),
        applyView: () => {},
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { UNTILED_FIRST_LOOK_ROW_LIMIT } from "./canvas/tileGridConstants";
import { moreInProblemsText, NO_PROBLEMS_TEXT, raisedTimesText, SHOWN_IN_STRIP_TEXT } from "./conditions/conditionsConstants";
import { consoleRecorder, isGuiActionEntry } from "./console/recorder";
import { shownText } from "./project/shownText";
import { MARK_WITHHELD_NOTICE, SAVED_NOTICE } from "./project/saveProject";
import { viewNotAppliedNotice } from "./project/reopenNotices";
import { __resetResidencyArmForTests, getResidencyArm, setResidencyArm } from "./residency/residencyArm";
import { SkpCallError } from "./skp/client";
import { encodeDecU64, encodeHexF64 } from "./skp/codec";
import type { OpenedProject, SkpError } from "./skp/types";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "./style/document";
import { attributeBatchIpc } from "./testUtils/attributeBatchIpc";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The untiled look's row limit as the mock reads it (`UNTILED_FIRST_LOOK_ROW_LIMIT`, encoded as the client sends it). */
if (encodeDecU64(BigInt(UNTILED_FIRST_LOOK_ROW_LIMIT)) !== "10000") throw new Error("the harness's untiled-look limit is stale");

const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
const refusedWith = (error: SkpError) => new SkpCallError(error);
const EXHAUSTED: SkpError = { code: "engine.connections_exhausted", message: "no admission lease was available", fields: { class: "admission", capacity: "4" } };
const SOURCE_CHANGED: SkpError = { code: "engine.source_changed", message: "the source file changed since it was opened", fields: { class: "mtime" } };
const SESSION_1 = `sr_${"1".padStart(32, "0")}`;

/** The harness of one `describe`: the real App in a container, and the reads the cases share. */
function harness(arm: "candidate" | "baseline") {
  const state = { container: null as unknown as HTMLDivElement, root: null as unknown as Root };
  const q = <T extends Element = HTMLElement>(selector: string): T | null => state.container.querySelector<T>(selector);
  const qa = (selector: string): Element[] => [...state.container.querySelectorAll(selector)];
  const click = (element: Element | null) => act(() => (element as HTMLElement).click());
  const texts = (selector: string): string[] => qa(selector).map((el) => el.textContent ?? "");
  return {
    q,
    qa,
    click,
    texts,
    setup() {
      Object.assign(mocks, { mintCounter: 0, streamCounter: 0, queries: [], refuseUntiled: [], recorded: [], refuseRecordWith: null, replies: [], saves: [], historyMark: "written", sessionEnded: null, managerOptions: null });
      mocks.sinks.clear();
      mocks.canvas.props = null;
      __resetResidencyArmForTests();
      if (arm === "baseline") expect(setResidencyArm("baseline")).toEqual({ ok: true });
      else expect(getResidencyArm(), "the shipped arm, setResidencyArm never called").toBe("candidate");
      state.container = document.createElement("div");
      document.body.appendChild(state.container);
      state.root = createRoot(state.container);
      act(() => {
        state.root.render(<App />);
      });
    },
    teardown() {
      act(() => {
        state.root.unmount();
      });
      state.container.remove();
      window.__SPATIAL_E2E__ = undefined;
      __resetResidencyArmForTests();
    },
    async open(path: string): Promise<void> {
      const hook = window.__SPATIAL_E2E__?.openPath;
      if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
      await act(async () => {
        await hook(path);
      });
      await flush();
    },
    async reopen(...replies: (() => Promise<import("./skp/types").OpenProjectResponse>)[]): Promise<string> {
      mocks.replies.push(...replies);
      const hook = window.__SPATIAL_E2E__?.e2eOpenProjectFolder;
      if (!hook) throw new Error("e2eOpenProjectFolder E2E hook is not registered");
      let answer = "";
      await act(async () => {
        answer = await hook("C:/projects/parcels");
      });
      await flush();
      return answer;
    },
    /** The kernel's event for the open of `session`, through the handler App registered. */
    endSession(session: string = SESSION_1, reason: "observed-change" | "coverage-lost" = "observed-change"): Promise<void> {
      if (mocks.sessionEnded === null) throw new Error("App registered no dataset_session_ended handler");
      act(() => mocks.sessionEnded!({ session, reason }));
      return flush();
    },
    /** The strip: its elements, and the S-3 button's text. */
    strip: () => q(".attention-strip"),
    stripOthers: () => q<HTMLButtonElement>(".attention-strip button.attention-others"),
    problemRows: () => qa("#activity-panel-problems .problem-row"),
    problemsText: () => q("#activity-panel-problems")?.textContent ?? "",
    /** Chooses `column` in the Style tab's chooser and presses Apply (`App.colourRefill.test.tsx`'s). */
    async colourBy(column: string): Promise<void> {
      click(q("#inspector-tab-style"));
      const select = q<HTMLSelectElement>(".style-colour-column")!;
      act(() => {
        select.value = column;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      click(q(".style-colour-apply"));
      await flush();
    },
    /** One batch of the open's projection on the stream `handle`, with its terminal. */
    deliver(handle: string, zones: Array<string | null>): void {
      const ids = zones.map((_, i) => BigInt(i + 1));
      const { ipc } = attributeBatchIpc(ids, [
        { name: "zone", kind: "utf8", values: zones },
        { name: "name", kind: "utf8", values: zones.map((z) => `n-${String(z)}`) },
        { name: "area", kind: "float64", values: zones.map(() => 1) },
      ]);
      act(() => {
        mocks.sinks.get(handle)!.onBatch(ipc, true);
        mocks.sinks.get(handle)!.onTerminal({ kind: "Completed", detail: "" });
      });
    },
    /** One drag of the style's fill opacity to its release: one `style.set` step, which the client then refuses (App.recording.test.tsx's A3). */
    async styleDrag(): Promise<void> {
      click(q("#inspector-tab-style"));
      if (q(".style-fill-opacity") === null) click(q(".style-disclosure"));
      const range = q<HTMLInputElement>(".style-fill-opacity")!;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      act(() => {
        setter.call(range, "0.30");
        range.dispatchEvent(new Event("input", { bubbles: true }));
      });
      act(() => {
        range.dispatchEvent(new Event("change", { bubbles: true }));
      });
      await flush();
    },
  };
}

/** An `opened` reply of `openProject` on a fresh dataset handle, with the saved view not applying (one `reopen-notice`). */
function openedWithNotice(): () => Promise<import("./skp/types").OpenProjectResponse> {
  return async () => {
    mocks.mintCounter += 1;
    const hex = mocks.mintCounter.toString(16).padStart(32, "0");
    const opened: OpenedProject = {
      project: "spatial://project/0000000000000000000000000000000a",
      dataset: `ds_${hex}`,
      session: `sr_${hex}`,
      workspace: {
        filter: null,
        clauses: [],
        style: { ...toStyleDocument(DEFAULT_STYLE_STATE) },
        view: { centre: [encodeHexF64(2_600_321.5), encodeHexF64(1_200_654.25)], zoom: encodeHexF64(6.5) },
      },
      view: { state: "saved-in-another-space", basis: "EPSG:4326 and EPSG:2056" },
      check: { observed: [], admission: [] },
      lineage: { folder_file: "absent", previous_file: null },
    };
    return { opened };
  };
}
const refusedReopen = () => async (): Promise<never> => {
  throw refusedWith({ code: "project.folder_unreadable", message: "the folder holds no project this machine can read", fields: {} });
};

describe("App: conditions, the strip and the Problems tab (milestone 5 PR A), on the shipped candidate arm", () => {
  const h = harness("candidate");
  beforeEach(() => h.setup());
  afterEach(() => h.teardown());

  // RECORDED MUTATION for C-A1: in `App.tsx` the session-ended raise also dispatches `ownerClear` of the viewport-refusal (the clear before the raise, as the form's table words it). Expected failure: Problems has 2 entries, not 3.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A1: a refused first look, a refused record and a session end: the top is session ended, S-3 reads 2, and Problems has 3 entries": AssertionError: expected '1 more in Problems' to be '2 more in Problems' // Object.is equality. Also failed: C-A3. Reverted after observing.
  it("C-A1: a refused first look, a refused record and a session end: the top is session ended, S-3 reads 2, and Problems has 3 entries", async () => {
    mocks.refuseUntiled.push(refusedWith(EXHAUSTED));
    await h.open("C:/data/a.parquet");
    expect(h.q(".attention-strip .canvas-refusal .admission-refusal-code")?.textContent, "the viewport refusal is the top").toBe("engine.connections_exhausted");
    expect(h.stripOthers(), "alone, it shows no S-3").toBeNull();

    mocks.refuseRecordWith = "this session history takes no more steps: an earlier write to it failed";
    await h.styleDrag();
    expect(h.qa(".record-notice"), "the record notice is raised").toHaveLength(1);
    expect(h.stripOthers()?.textContent, "the refusal is above the notice").toBe(moreInProblemsText(1));

    await h.endSession();
    expect(h.qa(".attention-strip .canvas-session-ended"), "session ended is the strip's top").toHaveLength(1);
    expect(h.strip()!.firstElementChild!.matches(".canvas-session-ended")).toBe(true);
    expect(h.stripOthers()?.textContent).toBe(moreInProblemsText(2));

    h.click(h.stripOthers());
    expect(h.q("#activity-panel-problems")!.hasAttribute("hidden"), "S-3 opens Problems").toBe(false);
    expect(h.problemRows(), "Problems has the three").toHaveLength(3);
    expect(h.problemRows()[0].classList.contains("problem-row-top")).toBe(true);
    expect(h.problemRows()[0].textContent).toBe(SHOWN_IN_STRIP_TEXT);
    // Each owner element once, with its outer class; the viewport refusal now stands beside session ended, which no longer hides it.
    expect(h.qa(".canvas-session-ended")).toHaveLength(1);
    expect(h.qa(".record-notice")).toHaveLength(1);
    expect(h.qa(".canvas-refusal .admission-refusal-code")).toHaveLength(1);
    expect(h.q("#activity-panel-problems .canvas-refusal .admission-refusal-code")?.textContent).toBe("engine.connections_exhausted");
    expect(h.qa('[role="alert"]').filter((el) => h.q("#activity-panel-problems")!.contains(el)), "no row of Problems carries the alert role").toEqual([]);
  });

  // RECORDED MUTATION for C-A2: in `App.tsx`'s `onCanvasRefusal` pass the constant "vertex-ceiling" as the kind to the raise, whatever the canvas gave. Expected failure: the second refusal merges into the first (one condition).
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A2: two ceiling refusals with identical text, one vertex and one pick, through the captured onCanvasRefusal, give two conditions": AssertionError: two conditions, each once in the DOM: expected [ <div …(2)>…(2)</div> ] to have a length of 2 but got 1. Reverted after observing.
  it("C-A2: two ceiling refusals with identical text, one vertex and one pick, through the captured onCanvasRefusal, give two conditions", async () => {
    await h.open("C:/data/a.parquet");
    const props = mocks.canvas.props!;
    act(() => props.onCanvasRefusal("st_1", "the same words", "vertex-ceiling"));
    expect(h.qa(".canvas-refusal")).toHaveLength(1);
    act(() => props.onCanvasRefusal("st_1", "the same words", "pick-ceiling"));
    expect(h.qa(".canvas-refusal"), "two conditions, each once in the DOM").toHaveLength(2);
    expect(h.texts(".canvas-refusal").map((text) => text.replace("Dismiss", ""))).toEqual(["the same words", "the same words"]);
    expect(h.stripOthers()?.textContent).toBe(moreInProblemsText(1));
    expect(h.qa(".condition-occurrences"), "neither merged: no S-5 line").toHaveLength(0);
  });

  // RECORDED MUTATION for "C-A2: the same kind raised again is one condition with S-5, and a later text is shown after the first": in `raise` (conditions.ts) a repeat of an identity keeps its first display as the latest (`latest: same.latest`).
  // Expected failure: the later text is not shown after the first.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-A2: the same kind raised again is one condition with S-5, and a later text is shown after the first": AssertionError: expected [ 'first words', …(3) ] to deeply equal [ 'first words', …(3) ]. Reverted after observing.
  it("C-A2: the same kind raised again is one condition with S-5, and a later text is shown after the first", async () => {
    await h.open("C:/data/a.parquet");
    const props = mocks.canvas.props!;
    act(() => props.onCanvasRefusal("st_1", "first words", "vertex-ceiling"));
    act(() => props.onCanvasRefusal("st_1", "later words", "vertex-ceiling"));
    expect(h.qa(".canvas-refusal")).toHaveLength(1);
    expect(h.texts(".canvas-refusal .condition-occurrences")).toHaveLength(1);
    const owner = h.q(".canvas-refusal")!;
    expect([...owner.childNodes].map((node) => node.textContent)).toEqual(["first words", h.q(".condition-occurrences")!.textContent, "later words", "Dismiss"]);
    expect(h.stripOthers(), "one condition, no others").toBeNull();
  });

  // RECORDED MUTATION for C-A3: in `App.tsx`'s `confirmOpen`, which every open attempt calls before its admission, dispatch the store's `opened` with a fresh resource first (a clear on the attempt, which a refused admission makes too). Expected failure: the refused reopen ends session ended.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A3: a refused reopen keeps session ended standing": AssertionError: session ended still stands: expected [] to have a length of 1 but got +0. Reverted after observing.
  describe("C-A3: how the conditions end, through the real App", () => {
    // RECORDED MUTATION for "C-A3: Dismiss ends the one condition and is recorded as today": in `dismissCondition` (App.tsx) drop the `recordNamed` call.
    // Expected failure: the dismissal is not recorded.
    // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-A3: Dismiss ends the one condition and is recorded as today": AssertionError: the row is recorded as today: expected +0 to be 1 // Object.is equality. Reverted after observing.
    it("C-A3: Dismiss ends the one condition and is recorded as today", async () => {
      mocks.refuseUntiled.push(refusedWith(EXHAUSTED));
      await h.open("C:/data/a.parquet");
      expect(h.qa(".canvas-refusal")).toHaveLength(1);
      const before = consoleRecorder.entries().filter(isGuiActionEntry).filter((e) => e.action === "canvas.dismissViewportRefusal").length;
      h.click(h.q(".canvas-refusal button"));
      expect(h.qa(".canvas-refusal")).toHaveLength(0);
      expect(h.strip()!.hasAttribute("hidden")).toBe(true);
      expect(consoleRecorder.entries().filter(isGuiActionEntry).filter((e) => e.action === "canvas.dismissViewportRefusal").length - before, "the row is recorded as today").toBe(1);
    });

    // RECORDED MUTATION for "C-A3: a resolved viewport outcome clears its condition: a Colour-by refill after the first look was refused": in `reportViewportOutcome`'s resolved arm (App.tsx) drop the `ownerClear` of the viewport-refusal.
    // Expected failure: the refusal still stands after the refill.
    // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-A3: a resolved viewport outcome clears its condition: a Colour-by refill after the first look was refused": AssertionError: the refill's resolved outcome ended it: expected [ <div …(2)>…(2)</div> ] to have a length of +0 but got 1. Reverted after observing.
    it("C-A3: a resolved viewport outcome clears its condition: a Colour-by refill after the first look was refused", async () => {
      mocks.refuseUntiled.push(refusedWith(EXHAUSTED));
      await h.open("C:/data/a.parquet");
      expect(h.qa(".canvas-refusal")).toHaveLength(1);
      act(() => mocks.canvas.props!.onAttributesNotHeld!());
      await h.colourBy("zone");
      h.deliver(`st_t${mocks.streamCounter}`, ["park", "civic"]); // the apply's one cases query
      await flush();
      await flush();
      expect(h.qa(".canvas-refusal"), "the refill's resolved outcome ended it").toHaveLength(0);
    });

    it("C-A3: a refused reopen keeps session ended standing", async () => {
      await h.open("C:/data/a.parquet");
      await h.endSession();
      expect(h.qa(".canvas-session-ended")).toHaveLength(1);
      const answer = await h.reopen(refusedReopen());
      expect(answer, "the reopen was refused").toBe("project.folder_unreadable");
      expect(h.qa(".canvas-session-ended"), "session ended still stands").toHaveLength(1);
      expect(h.strip()!.hasAttribute("hidden")).toBe(false);
    });

    // RECORDED MUTATION for "C-A3: a successful open clears everything, and Problems says so": in `setAdmitted` (App.tsx) do not dispatch `opened`.
    // Expected failure: the store has no current generation, so no condition takes a place.
    // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-A3: a successful open clears everything, and Problems says so": AssertionError: expected [] to have a length of 3 but got +0. Reverted after observing.
    it("C-A3: a successful open clears everything, and Problems says so", async () => {
      mocks.refuseUntiled.push(refusedWith(EXHAUSTED));
      await h.open("C:/data/a.parquet");
      mocks.refuseRecordWith = "this session history takes no more steps: an earlier write to it failed";
      await h.styleDrag();
      await h.endSession();
      expect(h.problemRows()).toHaveLength(3);
      await h.open("C:/data/b.parquet");
      expect(h.qa(".canvas-session-ended, .canvas-refusal, .record-notice")).toHaveLength(0);
      expect(h.strip()!.hasAttribute("hidden")).toBe(true);
      expect(h.problemRows()).toHaveLength(0);
      expect(h.problemsText()).toContain(NO_PROBLEMS_TEXT);
    });

    // RECORDED MUTATION for "C-A3: a reopen whose file carries a notice leaves its .reopen-notice standing after its own open, and session ended of the open before is gone": in `handleReopened` (App.tsx) raise the reopen-notice under the generation "stale-generation".
    // Expected failure: the store drops it, so no .reopen-notice stands.
    // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-A3: a reopen whose file carries a notice leaves its .reopen-notice standing after its own open, and session ended of the open before is gone": AssertionError: expected [] to deeply equal [ Array(1) ]. Reverted after observing.
    it("C-A3: a reopen whose file carries a notice leaves its .reopen-notice standing after its own open, and session ended of the open before is gone", async () => {
      await h.open("C:/data/a.parquet");
      await h.endSession();
      expect(h.qa(".canvas-session-ended")).toHaveLength(1);
      const answer = await h.reopen(openedWithNotice());
      expect(answer).toBe("admitted");
      expect(h.qa(".canvas-session-ended")).toHaveLength(0);
      expect(h.texts(".reopen-notice")).toEqual([viewNotAppliedNotice(shownText("EPSG:4326 and EPSG:2056"))]);
      expect(h.qa(".reopen-notice")).toHaveLength(1);
      expect(h.strip()!.firstElementChild!.matches(".reopen-notice"), "the notice is the strip's top").toBe(true);
      expect(h.stripOthers(), "alone").toBeNull();
    });
  });

  // RECORDED MUTATION for C-A4: in `App.tsx`'s `reportViewportOutcome` rejection arm raise the viewport-refusal condition for a session-ended refusal too. Expected failure: a `.canvas-refusal` stands beside session ended and S-3 shows.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A4: a first look refused with engine.source_changed gives one condition, session ended, not two": AssertionError: no viewport-refusal condition: expected [ …(1) ] to have a length of +0 but got 1. Reverted after observing.
  it("C-A4: a first look refused with engine.source_changed gives one condition, session ended, not two", async () => {
    mocks.refuseUntiled.push(refusedWith(SOURCE_CHANGED));
    await h.open("C:/data/a.parquet");
    expect(h.qa(".canvas-session-ended")).toHaveLength(1);
    expect(h.qa(".canvas-refusal"), "no viewport-refusal condition").toHaveLength(0);
    expect(h.stripOthers(), "no S-3").toBeNull();
    h.click(h.q("#activity-tab-problems"));
    expect(h.problemRows(), "Problems holds the one condition, as its top row").toHaveLength(1);
    expect(h.problemRows()[0].classList.contains("problem-row-top")).toBe(true);
  });

  // RECORDED MUTATION for C-A6: in `App.tsx`'s `handleSaveProject` dispatch one `replaceBatch` per notice. Expected failure: the second batch replaces the first, so only MARK_WITHHELD_NOTICE stands.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A6: a save's notices are one batch: SAVED_NOTICE is the top, S-3 reads 1, and the other row is MARK_WITHHELD_NOTICE; a second save replaces both": AssertionError: expected [ Array(1) ] to deeply equal [ 'The project was saved.', …(1) ]. Reverted after observing.
  it("C-A6: a save's notices are one batch: SAVED_NOTICE is the top, S-3 reads 1, and the other row is MARK_WITHHELD_NOTICE; a second save replaces both", async () => {
    mocks.historyMark = "withheld";
    await h.open("C:/data/a.parquet");
    const save = window.__SPATIAL_E2E__?.e2eSaveProjectToFolder;
    if (!save) throw new Error("e2eSaveProjectToFolder E2E hook is not registered");
    await act(async () => {
      expect(await save("C:/projects/out")).toBe("asked");
    });
    await flush();
    expect(mocks.saves).toHaveLength(1);
    expect(h.texts(".save-notice")).toEqual([SAVED_NOTICE, MARK_WITHHELD_NOTICE]);
    expect(h.qa(".attention-strip .save-notice")).toHaveLength(1);
    expect(h.strip()!.firstElementChild!.textContent).toBe(SAVED_NOTICE);
    expect(h.stripOthers()?.textContent).toBe(moreInProblemsText(1));
    h.click(h.stripOthers());
    expect(h.texts("#activity-panel-problems .save-notice")).toEqual([MARK_WITHHELD_NOTICE]);
    expect(h.problemRows()).toHaveLength(2);

    await act(async () => {
      await save("C:/projects/out");
    });
    await flush();
    expect(h.texts(".save-notice"), "a second save replaces the batch whole").toEqual([SAVED_NOTICE, MARK_WITHHELD_NOTICE]);
    expect(h.qa(".condition-occurrences"), "and counts no occurrence").toHaveLength(0);
  });

  // RECORDED MUTATION for C-A8: in `ordered` (conditions.ts) order urgency 3 by `seq` alone. Expected failure: the strip's top stays the reopen notice after the save. Also fails C-U2b.
  it("C-A8: after an open of a project that raised a notice, a save's first line is the strip's top, and the reopen notice is listed in Problems after the top row", async () => {
    expect(await h.reopen(openedWithNotice())).toBe("admitted");
    expect(h.qa(".reopen-notice")).toHaveLength(1);
    expect(h.strip()!.firstElementChild!.matches(".reopen-notice"), "before the save the reopen notice is the top").toBe(true);
    const save = window.__SPATIAL_E2E__?.e2eSaveProjectToFolder;
    if (!save) throw new Error("e2eSaveProjectToFolder E2E hook is not registered");
    await act(async () => {
      expect(await save("C:/projects/out"), "a reopened open's folder is held by the kernel: the picker is not asked (O-11)").toBe("not-asked");
    });
    await flush();
    expect(mocks.saves.map((entry) => entry.folder)).toEqual([null]);
    expect(h.strip()!.firstElementChild!.textContent, "the save's first line is the top").toBe(SAVED_NOTICE);
    expect(h.qa(".attention-strip .reopen-notice")).toHaveLength(0);
    expect(h.stripOthers()?.textContent).toBe(moreInProblemsText(1));
    h.click(h.stripOthers());
    expect(h.problemRows()).toHaveLength(2);
    expect(h.problemRows()[0].classList.contains("problem-row-top")).toBe(true);
    expect(h.problemRows()[1].querySelector(".reopen-notice"), "the reopen notice is the row after the top").not.toBeNull();
    expect(h.qa(".reopen-notice")).toHaveLength(1);
  });

  // RECORDED MUTATION for "C-A7: two refused steps of one kind, through the step queue, leave one record notice replaced by its owner: the latest text, no S-5 line": in `App.tsx`'s `createStepQueue` report handler dispatch `raise` for the record-notice route again, as at 12a9aa98, in place of `replaceBatch`. Expected failure: the second refused step merges into the first as an occurrence, so an S-5 line stands in the notice.
  // OBSERVED 2026-11-24 at 7c18e29f: FAILED -- AssertionError: its owner replaced it: no occurrence count: expected [ <div …(1)></div> ] to have a length of +0 but got 1. Reverted after observing.
  it("C-A7: two refused steps of one kind, through the step queue, leave one record notice replaced by its owner: the latest text, no S-5 line", async () => {
    const FIRST = "this session history takes no more steps: the first words";
    const SECOND = "this session history takes no more steps: the second words";
    await h.open("C:/data/a.parquet");
    mocks.refuseRecordWith = FIRST;
    await h.styleDrag();
    expect(h.qa(".record-notice"), "the first refused step raises the notice").toHaveLength(1);
    // The second step: one more drag of the same range, to another value, which the client refuses with other words.
    mocks.refuseRecordWith = SECOND;
    const range = h.q<HTMLInputElement>(".style-fill-opacity")!;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(range, "0.55");
      range.dispatchEvent(new Event("input", { bubbles: true }));
    });
    act(() => {
      range.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await flush();
    expect(mocks.recorded, "both steps were sent").toHaveLength(2);
    expect(h.qa(".record-notice"), "one notice stands").toHaveLength(1);
    expect(h.qa(".record-notice .condition-occurrences"), "its owner replaced it: no occurrence count").toHaveLength(0);
    expect(h.q(".record-notice")!.textContent, "no S-5 line").not.toContain(raisedTimesText(2));
    expect(h.q(".record-notice")!.textContent, "the latest step's text alone").toBe(`Style change applied. The session history did not confirm keeping it: ${SECOND}`);
  });
});

describe("App: the stream-terminal raise on the pinned baseline arm (C-A5)", () => {
  const h = harness("baseline");
  beforeEach(() => h.setup());
  afterEach(() => h.teardown());

  // RECORDED MUTATION for C-A5: in `App.tsx`'s baseline `onFailureTerminal` do not raise the stream-terminal condition. Expected failure: no `.canvas-refusal` stands.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-A5: the manager's terminal ProducerFailed gives one stream-terminal condition: the strip's top, no S-3, one Problems row": AssertionError: expected [] to have a length of 1 but got +0. Reverted after observing.
  it("C-A5: the manager's terminal ProducerFailed gives one stream-terminal condition: the strip's top, no S-3, one Problems row", async () => {
    await h.open("C:/data/a.parquet");
    expect(mocks.managerOptions, "App built the baseline manager").not.toBeNull();
    act(() => mocks.managerOptions!.onTerminal("st_1", { kind: "ProducerFailed", detail: "engine.stream_failed: the producer broke off" }));
    expect(h.qa(".canvas-refusal")).toHaveLength(1);
    expect(h.q(".attention-strip .canvas-refusal")!.firstChild!.textContent).toBe("stream ProducerFailed: the producer broke off");
    expect(h.stripOthers()).toBeNull();
    h.click(h.q("#activity-tab-problems"));
    expect(h.problemRows()).toHaveLength(1);
    expect(h.problemRows()[0].classList.contains("problem-row-top")).toBe(true);
  });
});
