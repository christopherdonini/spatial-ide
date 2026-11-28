// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md section 4: S-4, S-5 and S-6, the recovery offer through the REAL `App`. The harness is `App.reopen.test.tsx`'s (the SKP transport, the stream
 * manager and the WebGL canvas are stand-ins), with the client's three recovery commands answering from the test and `recordStep` logged.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  /** Each `listRecoverable` call's argument, in order, and what the next calls answer. */
  listed: [] as (string | null)[],
  lists: [] as (() => Promise<import("./skp/types").ListRecoverableResponse>)[],
  recovers: [] as { record: string; dataset: string | null }[],
  recoverReply: null as null | (() => Promise<import("./skp/types").RecoverSessionResponse>),
  reopenReply: null as null | (() => Promise<import("./skp/types").OpenProjectResponse>),
  recorded: [] as unknown[],
  requests: [] as ({ predicate: string } | null)[],
  styles: [] as import("./style/document").StyleState[],
}));

vi.mock("./skp/client", () => {
  class SkpCallError extends Error {
    readonly skpError: import("./skp/types").SkpError;
    constructor(skpError: import("./skp/types").SkpError) {
      super(skpError.message);
      this.skpError = skpError;
    }
  }
  return {
    SkpCallError,
    listRecoverable: async (dataset: string | null) => {
      mocks.listed.push(dataset);
      return (mocks.lists.shift() ?? (async () => ({ records: [], more: false })))();
    },
    recoverSession: async (record: string, _cancelKey: string, dataset: string | null) => {
      mocks.recovers.push({ record, dataset });
      return mocks.recoverReply!();
    },
    discardRecoverable: async () => ({}),
    openProject: async () => mocks.reopenReply!(),
    openDataset: async () => ({ dataset: "ds_x", session: "sr_x" }),
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
    closeDataset: async () => ({ cancelled_streams: 0 }),
    cancel: async () => ({ state: "requested" }),
    viewportQuery: async (): Promise<never> => {
      throw new Error("viewportQuery must not be reached directly -- ViewportStreamManager is mocked at the module boundary");
    },
    recordStep: async (dataset: string, intent: unknown) => {
      mocks.recorded.push({ dataset, intent });
      return {};
    },
    saveProject: async () => ({ project: "spatial://project/0000000000000000000000000000000a", history_mark: "written", project_relative: "carried" }),
  };
});

vi.mock("./skp/dialog", () => ({ pickProjectFolder: async () => "C:/projects/parcels", pickFile: async () => null }));
vi.mock("./diagnostics/log", () => ({ logSessionEvent: () => {} }));
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
    mocks.styles.push(props.style);
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
        applyView: () => {},
      }),
      []
    );
    return <div className="working-canvas-stub" data-dataset={props.dataset} />;
  });
  return { default: MockWorkingCanvas };
});

import App from "./App";
import { CHANGED_TEXT, PROJECT_OFFER_TEXT } from "./project/RecoveryOffer";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { encodeHexF64 } from "./skp/codec";
import type { RecoverableRecord, RecoverSessionResponse, ReopenCheck } from "./skp/types";
import { DEFAULT_STYLE_STATE, toStyleDocument } from "./style/document";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const UNSAVED = `unsaved-${"0".repeat(32)}`;
const PROJECT_RECORD = "0".repeat(32);
const AT = "2026-11-27T10:15:30.000Z";
const recordOf = (record: string): RecoverableRecord => ({ record, file_name: "parcels.parquet", last_step_at: AT, steps: 2, data: { state: "found" } });
const recovered = (check: ReopenCheck): (() => Promise<RecoverSessionResponse>) => async () => ({
  dataset: "ds_00000000000000000000000000000001",
  opened: { session: "sr_00000000000000000000000000000001", check },
  steps: [
    { action: "filter.apply", params: { filter: { dialect: "duckdb-expr/0", predicate: "zone = 'a'" } } },
    { action: "style.set", params: { property: "fillOpacity", value: 0.5 } },
  ],
});
const none: ReopenCheck = { observed: [], admission: [] };

describe("App: the recovery offer (the recovery offer's Part 1), through the real App", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { listed: [], lists: [], recovers: [], recoverReply: null, reopenReply: null, recorded: [], requests: [], styles: [] });
    setResidencyArm("baseline");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.__SPATIAL_E2E__ = undefined;
    __resetResidencyArmForTests();
  });

  const settle = () => act(async () => { for (let i = 0; i < 4; i += 1) await new Promise((resolve) => setTimeout(resolve, 0)); });
  const texts = (selector: string): string[] => [...container.querySelectorAll(selector)].map((el) => el.textContent ?? "");
  async function mount(): Promise<void> {
    await act(async () => root.render(<App />));
    await settle();
  }
  async function click(selector: string): Promise<void> {
    const button = container.querySelector<HTMLButtonElement>(selector);
    if (button === null) throw new Error(`no element matches ${selector}`);
    await act(async () => button.click());
    await settle();
  }

  // RECORDED MUTATION for S-4: in `handleRecovered` each returned step is also sent through `recordStep`. Expected failure: a step was recorded.
  it("recover_applies_the_steps_and_records_none", async () => {
    mocks.lists.push(async () => ({ records: [recordOf(UNSAVED)], more: false }));
    mocks.recoverReply = recovered(none);
    await mount();
    await click(".recovery-recover");
    expect(mocks.recovers).toEqual([{ record: UNSAVED, dataset: null }]);
    expect(mocks.requests.at(-1), "the first look runs under the recovered filter").toEqual({ dialect: "duckdb-expr/0", predicate: "zone = 'a'" });
    expect(mocks.styles.at(-1)?.fillOpacity, "the recovered style applies").toBe(0.5);
    expect(mocks.recorded, "no step is recorded for a recovery").toEqual([]);
  });

  // RECORDED MUTATION for S-5: App asks for the project's record only at mount (no call after an `opened` reopen). Expected failure: the second list call is absent.
  it("a_reopen_asks_for_its_projects_record", async () => {
    mocks.reopenReply = async () => ({
      opened: {
        project: "spatial://project/0000000000000000000000000000000a",
        dataset: "ds_00000000000000000000000000000002",
        session: "sr_00000000000000000000000000000002",
        workspace: { filter: null, clauses: [], style: { ...toStyleDocument(DEFAULT_STYLE_STATE) }, view: { centre: [encodeHexF64(2_600_000.5), encodeHexF64(1_200_000.25)], zoom: encodeHexF64(6.5) } },
        view: { state: "applies" },
        check: { observed: [], admission: [] },
        lineage: { folder_file: "absent", previous_file: null },
      },
    });
    await mount();
    mocks.lists.push(async () => ({ records: [recordOf(PROJECT_RECORD)], more: false }));
    await click(".admission-open-project");
    expect(mocks.listed).toEqual([null, "ds_00000000000000000000000000000002"]);
    expect(texts(".recovery-entry-text")).toEqual([PROJECT_OFFER_TEXT.replace("{time}", new Date(AT).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }))]);
  });

  // RECORDED MUTATION for S-6: the check a recover returns is not raised as a notice. Expected failure: no notice shows.
  it("recover_shows_the_check_it_returns", async () => {
    mocks.lists.push(async () => ({ records: [recordOf(UNSAVED)], more: false }));
    mocks.recoverReply = recovered({ observed: ["size"], admission: ["crs"] });
    await mount();
    await click(".recovery-recover");
    expect(texts(".reopen-notice")).toEqual([CHANGED_TEXT.replace("{file}", "parcels.parquet").replace("{components}", "size, crs")]);
  });
});
