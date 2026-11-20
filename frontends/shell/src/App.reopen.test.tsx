// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 item 7 (b) and Amendment 57 item 3: the reopen through the REAL `App`, `AdmissionPanel`,
 * `RefusalBlock` and action registry. The harness is `App.save.test.tsx`'s (the SKP transport, the stream manager and the WebGL canvas are
 * stand-ins), with the client's `openProject` answering from a queue the test fills, the two pickers answering from the test, the canvas
 * stand-in counting `applyView`, and the session log captured.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Reply = () => Promise<import("./skp/types").OpenProjectResponse>;

const mocks = vi.hoisted(() => ({
  opens: 0,
  datasets: 0,
  /** Every `openProject` the mocked client received, in order. */
  reopens: [] as { folder: string; cancelKey: string; answer: string | null; relink: string | null }[],
  /** What the next `openProject` answers, in order. */
  replies: [] as (() => Promise<import("./skp/types").OpenProjectResponse>)[],
  cancels: [] as string[],
  saves: [] as { dataset: string; folder: string | null; workspace: import("./skp/types").ProjectWorkspace }[],
  folderPicks: 0,
  /** What the next `pickFile` answers. */
  files: [] as (string | null)[],
  filePicks: 0,
  /** The filter of each `requestViewport`, in order. */
  requests: [] as ({ predicate: string } | null)[],
  applied: [] as { centre: readonly [number, number]; zoom: number }[],
  logs: [] as { level: string; message: string }[],
}));

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
    openProject: async (folder: string, cancelKey: string, answer: string | null, relink: string | null) => {
      mocks.reopens.push({ folder, cancelKey, answer, relink });
      const reply = mocks.replies.shift();
      if (reply === undefined) throw new Error("no reply queued for openProject");
      return reply();
    },
    describe: async (): Promise<import("./skp/types").DescribeResponse> => ({
      source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
      crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
      geometry: { column: "geometry", encoding: "geoarrow.polygon", declared_types: ["Polygon"], coordinate_layout: "interleaved-xy", frame: "authoritative-project-crs" },
      identity: { source: "file:id", uniqueness: "verified-at-open-full-file", verified_rows: "100000", max_value: "99999", js_exact: true, class: "native", session_statement: null },
      schema: [{ name: "id", arrow_type: "UInt64", nullable: false, projectable: false }, { name: "zone", arrow_type: "Utf8", nullable: true, projectable: true }, { name: "geometry", arrow_type: "Binary", nullable: false, projectable: false }],
      covering_bbox: true, row_count: { basis: "identity-uniqueness-scan-full-file", value: "100000" },
      extent: { basis: "not-established-at-open", value: null },
      license: { license: null, attribution: null, redistribution: null, declares_anything: false },
      sanity: { level: "none", reason: "the file declares its own CRS. Not checked" },
      coverage: { state: "watching", reason: null }, checks: { state: "full", components: [] }, session_end: null,
    }),
    closeDataset: async (): Promise<import("./skp/types").CloseDatasetResponse> => ({ cancelled_streams: 0 }),
    cancel: async (key: string): Promise<import("./skp/types").CancelResponse> => {
      mocks.cancels.push(key);
      return { state: "requested" };
    },
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
    recordStep: async (): Promise<Record<string, never>> => ({}),
    saveProject: async (dataset: string, folder: string | null, workspace: import("./skp/types").ProjectWorkspace): Promise<import("./skp/types").SaveProjectResponse> => {
      mocks.saves.push({ dataset, folder, workspace });
      return { project: "spatial://project/0000000000000000000000000000000a", history_mark: "written", project_relative: "carried" };
    },
  };
});

vi.mock("./skp/dialog", () => ({
  pickProjectFolder: async (): Promise<string | null> => {
    mocks.folderPicks += 1;
    return "C:/projects/parcels";
  },
  pickFile: async (): Promise<string | null> => {
    mocks.filePicks += 1;
    return mocks.files.shift() ?? null;
  },
}));

vi.mock("./diagnostics/log", () => ({
  logSessionEvent: (level: string, message: string) => {
    mocks.logs.push({ level, message });
  },
}));

vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));

vi.mock("./streaming/viewportStreamManager", () => {
  class MockViewportStreamManager {
    requestViewport(_bbox?: unknown, _bboxCrs?: unknown, _nowMs?: unknown, filter?: { predicate: string } | null): Promise<unknown> {
      mocks.requests.push(filter ?? null);
      return Promise.resolve({ kind: "issued", streamHandle: "st_1" });
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
        currentView: () => ({ centre: [2_600_050.5, 1_200_050.25], zoom: 7.5 }),
        applyView: (view) => {
          mocks.applied.push(view);
        },
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { OPEN_LIVENESS_DELAY_MS } from "./admission/AdmissionPanel";
import { refusalGuidance } from "./admission/formatRefusal";
import { shownText } from "./project/shownText";
import {
  ENGINE_REFUSAL_NOTICE,
  fileNotFoundNotice,
  OPEN_ELSEWHERE_OTHER_NOTICE,
  OPEN_ELSEWHERE_OWN_NOTICE,
  QUESTION_TEXT,
  STYLE_NOT_APPLIED_NOTICE,
  viewNotAppliedNotice,
  workspaceTextNotice,
} from "./project/reopenNotices";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { SkpCallError } from "./skp/client";
import { encodeHexF64 } from "./skp/codec";
import type { OpenedProject, ProjectWorkspace, SkpError } from "./skp/types";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "./style/document";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PROJECT = "spatial://project/0000000000000000000000000000000a";
const OTHER_PROJECT = "spatial://project/0000000000000000000000000000000b";
const CENTRE: [number, number] = [2_600_321.123456789, 1_200_654.987654321];
const ZOOM = 6.123456789012345;
/** The Cc and Bidi_Control characters, U+2028 and U+2029 (Amendment 54 item 5 (j)). */
const HIDDEN = /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029]/;

function workspace(over: Partial<ProjectWorkspace> = {}): ProjectWorkspace {
  return {
    filter: null,
    clauses: [],
    style: { ...toStyleDocument(DEFAULT_STYLE_STATE) },
    view: { centre: [encodeHexF64(CENTRE[0]), encodeHexF64(CENTRE[1])], zoom: encodeHexF64(ZOOM) },
    ...over,
  };
}

/** An `opened` reply on a new dataset handle. */
function opened(over: Partial<OpenedProject> = {}): Reply {
  return async () => {
    mocks.datasets += 1;
    const hex = (0x100 + mocks.datasets).toString(16).padStart(32, "0");
    return {
      opened: {
        project: PROJECT, dataset: `ds_${hex}`, session: `sr_${hex}`, workspace: workspace(), view: { state: "applies" },
        check: { observed: [], admission: [] }, lineage: { folder_file: "absent", previous_file: null }, ...over,
      },
    };
  };
}
const refusedWith = (error: SkpError): Reply => async () => {
  throw new SkpCallError(error);
};
const question: Reply = async () => ({ question: { kind: "copy-or-same" } });
const notFound = (file_name: string | null): Reply => async () => ({ not_found: { file_name } });
/** A reply the test releases itself. */
function held(): { reply: Reply; release: (reply: Reply) => void } {
  let release!: (reply: Reply) => void;
  const answer = new Promise<Reply>((resolve) => (release = resolve));
  return { reply: async () => (await answer)(), release };
}

describe("App: the reopen (B2 piece 1c, Amendment 54), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { opens: 0, datasets: 0, reopens: [], replies: [], cancels: [], saves: [], folderPicks: 0, files: [], filePicks: 0, requests: [], applied: [], logs: [] });
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
  const texts = (selector: string): string[] => [...container.querySelectorAll(selector)].map((el) => el.textContent ?? "");
  /** Lets every pending promise and timer of zero delay run, inside `act`. */
  const settle = () => act(async () => {
    for (let i = 0; i < 4; i += 1) await new Promise((resolve) => setTimeout(resolve, 0));
  });
  async function click(selector: string): Promise<void> {
    const button = q<HTMLButtonElement>(selector);
    if (button === null) throw new Error(`no element matches ${selector}`);
    await act(async () => button.click());
    await settle();
  }
  /** The Open project control, with `replies` queued for the calls it makes. */
  async function reopen(...replies: Reply[]): Promise<void> {
    mocks.replies.push(...replies);
    await click(".admission-open-project");
  }
  async function open(path: string): Promise<void> {
    const hook = window.__SPATIAL_E2E__?.openPath;
    if (!hook) throw new Error("openPath E2E hook is not registered -- isInstrumentedBuild() must be true under vitest");
    await act(async () => {
      await hook(path);
    });
    await settle();
  }
  const shownDataset = () => q(".working-canvas-stub")?.getAttribute("data-dataset") ?? null;

  // RECORDED MUTATION for T-2: in `AdmissionPanel.tsx` the reopen's handler calls `admitProject` and `onReopened` itself, not through `runAdmitPath`.
  // Expected failure: no Cancel shows while the call is in flight.
  it("T-2: reopen goes through runAdmitPath and shows liveness and Cancel", async () => {
    const call = held();
    await reopen(call.reply);
    expect(mocks.reopens).toHaveLength(1);
    expect(mocks.reopens[0], "the first call").toMatchObject({ folder: "C:/projects/parcels", answer: null, relink: null });
    expect(q<HTMLButtonElement>(".admission-open-project")!.disabled, "the control is busy").toBe(true);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, OPEN_LIVENESS_DELAY_MS + 20));
    });
    expect(q(".admission-open-liveness"), "the liveness line").not.toBeNull();
    await click(".admission-open-cancel");
    expect(mocks.cancels, "Cancel reaches the run's key").toEqual([mocks.reopens[0].cancelKey]);
    call.release(refusedWith({ code: "engine.cancelled", message: "cancelled", fields: {} }));
    await settle();
    expect(texts(".admission-open-cancelled-note")).toEqual(["Open cancelled"]);
    expect(mocks.opens, "a reopen never reaches open_dataset").toBe(0);
  });

  // RECORDED MUTATION for T-3: in `AdmissionPanel.tsx` a choice of S8 re-enters the run with `answer: null`. Expected failure: the second request's answer.
  it("T-3: question re-calls with the answer", async () => {
    await reopen(question, opened());
    expect(texts(".admission-reopen-question p")).toEqual([QUESTION_TEXT]);
    await click(".admission-reopen-same");
    expect(mocks.reopens.map((r) => r.answer)).toEqual([null, "same"]);
    expect(mocks.reopens[1].cancelKey, "a fresh key").not.toBe(mocks.reopens[0].cancelKey);
    expect(shownDataset()).toBe(`ds_${(0x101).toString(16).padStart(32, "0")}`);

    await reopen(question, opened());
    await click(".admission-reopen-copy");
    expect(mocks.reopens.map((r) => r.answer)).toEqual([null, "same", null, "copy"]);

    await reopen(question);
    await click(".admission-reopen-cancel");
    expect(mocks.reopens, "the third choice ends the run").toHaveLength(5);
    expect(q(".admission-reopen-question"), "no question stands").toBeNull();
    expect(mocks.opens).toBe(0);
  });

  // RECORDED MUTATIONS for T-4, each applied alone, in `AdmissionPanel.tsx`: (a) the re-link call is made with `answer: null`; (b) the first call
  // of the Open project control sends `relink: ""`. Expected failures: (a) the third request's answer; (b) the first request's relink.
  it("T-4: not_found offers the re-link and the second call carries relink and the run's answer", async () => {
    await reopen(question, notFound("parcels.parquet"), opened());
    await click(".admission-reopen-same");
    expect(texts(".admission-reopen-not-found p")).toEqual([fileNotFoundNotice("parcels.parquet")]);
    mocks.files.push("D:/moved/parcels.parquet");
    await click(".admission-reopen-relink");
    expect(mocks.reopens.map(({ answer, relink }) => ({ answer, relink }))).toEqual([
      { answer: null, relink: null },
      { answer: "same", relink: null },
      { answer: "same", relink: "D:/moved/parcels.parquet" },
    ]);
    expect(shownDataset(), "opened after the re-link").not.toBeNull();

    await reopen(notFound(null));
    expect(texts(".admission-reopen-not-found p")).toEqual([fileNotFoundNotice(null)]);
    await click(".admission-reopen-relink");
    expect(mocks.filePicks).toBe(2);
    expect(mocks.reopens, "a dismissed pick sends nothing").toHaveLength(4);
    expect(texts(".admission-open-cancelled-note")).toEqual(["Open cancelled"]);
  });

  // RECORDED MUTATION for T-5: in `runAdmitPath` (AdmissionPanel.tsx) the cancelled keys are not read (`wasCancelled` ignored). Expected failure: S8 shows.
  it("T-5: a question or not_found after Cancel asks nothing and ends at the cancelled note", async () => {
    for (const late of [question, notFound("parcels.parquet")]) {
      const call = held();
      await reopen(call.reply);
      await click(".admission-open-cancel");
      call.release(late);
      await settle();
      expect(q(".admission-reopen-question"), "no S8").toBeNull();
      expect(q(".admission-reopen-not-found"), "no S11").toBeNull();
      expect(texts(".admission-open-cancelled-note")).toEqual(["Open cancelled"]);
    }
    expect(mocks.filePicks, "no picker").toBe(0);
    expect(mocks.reopens).toHaveLength(2);
  });

  // RECORDED MUTATION for T-7: in App's reopen handler the saved view is written whatever `view.state` says. Expected failure: the camera was written.
  it("T-7: a view saved in another space is not applied and the owner says so", async () => {
    await reopen(opened());
    expect(mocks.applied, "applies: written once, bit for bit").toEqual([{ centre: CENTRE, zoom: ZOOM }]);
    expect(Object.is(mocks.applied[0].centre[0], CENTRE[0]) && Object.is(mocks.applied[0].zoom, ZOOM)).toBe(true);

    const basis = `saved in EPSG:2056 \u202E${"x".repeat(1100)}`;
    await reopen(opened({ view: { state: "saved-in-another-space", basis } }));
    expect(mocks.applied, "no camera write; the canvas's own fit runs").toHaveLength(1);
    expect(texts(".reopen-notice")).toEqual([viewNotAppliedNotice(shownText(basis))]);
  });

  // RECORDED MUTATION for T-8: in App's reopen handler the saved filter is written in an effect after the admission's render. Expected failure:
  // the first query's filter is null.
  it("T-8: the saved filter and clauses apply in the admission's turn, so the first look runs under them", async () => {
    const clauses = [{ text: "zone = 'a'", enabled: true }, { text: "id > 3", enabled: false }];
    await reopen(opened({ workspace: workspace({ filter: { predicate: "zone = 'a'", dialect: "duckdb-expr/0" }, clauses }) }));
    expect(mocks.requests[0], "the first query").toEqual({ predicate: "zone = 'a'", dialect: "duckdb-expr/0" });
    await click(".save-project");
    expect(mocks.saves[0].workspace.clauses, "the clauses as saved").toEqual(clauses);
  });

  // RECORDED MUTATION for T-9's W-STYLE case (Amendment 57 item 3): in App's reopen handler, when the reader answers with none, the style the window
  // held is kept and no place is shown. Expected failure: the state is the earlier style, and W-STYLE's place is missing.
  it("T-9 (W-STYLE): a saved style the shell cannot show is not applied, the state is the default, and the owner says so", async () => {
    const shown = { ...toStyleDocument({ ...DEFAULT_STYLE_STATE, fillColor: "#112233" }) };
    await reopen(opened({ workspace: workspace({ style: shown }) }));
    const layer = toStyleDocument(DEFAULT_STYLE_STATE).layer as unknown as Record<string, unknown>;
    const unshowable = { style_version: 1, layer: { ...layer, fill_opacity: { match: { column: "zone", cases: [], on_null: 0.5, on_unmatched: 0.5 } } } };
    await reopen(opened({ workspace: workspace({ style: unshowable }) }));
    expect(texts(".reopen-notice")).toEqual([STYLE_NOT_APPLIED_NOTICE]);
    await click(".save-project");
    expect(mocks.saves[0].workspace.style, "the state is the default").toEqual({ ...toStyleDocument(DEFAULT_STYLE_STATE) });
  });

  // RECORDED MUTATION for T-10: in App's reopen handler the saver is not told (`projectSaver.adopt` not called). Expected failure: the picker opens.
  it("T-10: a save after a reopen sends folder null and opens no picker", async () => {
    await reopen(opened());
    expect(mocks.folderPicks, "the reopen's own folder pick").toBe(1);
    await click(".save-project");
    expect(mocks.saves.map((s) => s.folder)).toEqual([null]);
    expect(mocks.folderPicks, "no picker for the save").toBe(1);
  });

  // RECORDED MUTATION for T-11: in `runAdmitPath` (AdmissionPanel.tsx) a reopen refusal takes `nextFormFamily` as a dataset open's does. Expected
  // failure: the CRS form shows.
  it("T-11: a reopen refusal opens no remediation form, and an engine refusal carries the owner's line", async () => {
    for (const code of ["engine.crs_unknown", "engine.crs_undeclared", "engine.identity_unusable", "engine.crs_assertion_conflict"]) {
      await reopen(refusedWith({ code, message: `refused: ${code}`, fields: {} }));
      expect(q(".admission-refusal-code")?.textContent).toBe(code);
      expect(q(".crs-assertion-form"), `${code}: no CRS form`).toBeNull();
      expect(q(".identity-declaration-form"), `${code}: no identity form`).toBeNull();
      expect(texts(".admission-panel .admission-refusal-owner"), `${code}: R-ENG`).toEqual([ENGINE_REFUSAL_NOTICE]);
    }
    expect(q(".admission-refusal-guidance"), "the user's assertion is not named at a reopen").toBeNull();
    await reopen(refusedWith({ code: "engine.axis_order_unestablished", message: "refused", fields: {} }));
    expect(texts(".admission-refusal-guidance"), "every other code keeps its guidance").toEqual([refusalGuidance("engine.axis_order_unestablished")]);
  });

  // RECORDED MUTATION for T-12: in `shownText` (project/shownText.ts) the text is returned as given. Expected failure: the refusal block holds U+202E.
  it("T-12: text from a file is shown and logged through the bound", async () => {
    const path = `C:/${"p".repeat(1997)}`;
    await reopen(refusedWith({ code: "skp.project_file_refused", message: `the file \u202Enaps\u0007 ${path}`, fields: { path, rule: "rule \u202E" } }));
    const block = q(".admission-panel .admission-refusal")!;
    expect(HIDDEN.test(block.textContent ?? ""), "no hidden character in the block").toBe(false);
    for (const text of [...block.querySelectorAll(".admission-refusal-message, dd")].map((el) => el.textContent ?? "")) {
      expect(text.length, "at most the bound and the mark").toBeLessThanOrEqual(1030);
    }
    expect(texts(".admission-panel dd")[0].endsWith(" [cut]")).toBe(true);
    const logged = mocks.logs.filter((l) => l.level === "reopen-refused");
    expect(logged, "one log line").toHaveLength(1);
    expect(HIDDEN.test(logged[0].message)).toBe(false);
    expect(logged[0].message.length).toBeLessThanOrEqual("skp.project_file_refused: ".length + 1030);
  });

  // RECORDED MUTATION for T-13: in App's reopen handler the clauses' texts pass through `shownText`. Expected failure: the saved filter is not the file's.
  it("T-13: workspace text with a control or format character applies whole and the owner names the member", async () => {
    const text = "zone = '\u202Ea\u0007'";
    await reopen(opened({ workspace: workspace({ filter: { predicate: text, dialect: "duckdb-expr/0" }, clauses: [{ text, enabled: true }] }) }));
    expect(texts(".reopen-notice")).toEqual([workspaceTextNotice(["filter", "filter clauses"])]);
    expect(mocks.requests[0]?.predicate, "the first query runs the file's text").toBe(text);
    await click(".save-project");
    expect(mocks.saves[0].workspace.filter?.predicate, "written back unchanged").toBe(text);
    expect(mocks.saves[0].workspace.clauses).toEqual([{ text, enabled: true }]);
  });

  // RECORDED MUTATION for T-18: in `reopenRefusalPlace` (project/openProject.ts) the refusal's `project` is not compared with the held identity
  // (S9-other always). Expected failure: the own-window place is missing.
  it("T-18: a refusal of the project this window holds shows the own-window place", async () => {
    await open("C:/data/parcels.parquet");
    await click(".save-project");
    expect(mocks.saves).toHaveLength(1);
    const before = shownDataset();
    await reopen(refusedWith({ code: "skp.project_open_elsewhere", message: "held", fields: { project: PROJECT } }));
    expect(texts(".admission-panel .admission-refusal-owner")).toEqual([OPEN_ELSEWHERE_OWN_NOTICE]);
    expect(shownDataset(), "the window's open is kept").toBe(before);
    await reopen(refusedWith({ code: "skp.project_open_elsewhere", message: "held", fields: { project: OTHER_PROJECT } }));
    expect(texts(".admission-panel .admission-refusal-owner")).toEqual([OPEN_ELSEWHERE_OTHER_NOTICE]);
    expect(shownDataset()).toBe(before);
  });
});
