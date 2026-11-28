// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * A Colour-by refill keeps the view (`governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md` §4 and its Amendment 2 items 2 to 4, Amendment 4 item 6 D-b):
 * the REAL `App` on the candidate arm with the REAL candidate session, so `issueQueryRef`'s binding, the Colour-by effect and the session's reset are the shipped ones. The
 * client, data-plane and stream mocks and the Colour-by helpers are `App.colour.test.tsx`'s (its client mock answers a `viewportQuery` at once, which `App.reopen.test.tsx`'s does not,
 * and its capture of the canvas's props lets the test raise the not-held fact through `onAttributesNotHeld`, as its PB-U11 does). The canvas stand-in is typed as `WorkingCanvasHandle`,
 * with no cast, and records `clearAllTiles`, each reset with the arguments it received and each `viewportQuery` in one list, in order.
 */

import { act, forwardRef, useImperativeHandle } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PublishPanelHandle } from "./publish/PublishPanel";

type Event =
  | { call: "clearAllTiles" }
  | { call: "reset"; args: unknown[] }
  | { call: "viewportQuery"; bbox: unknown; limit: unknown; filter: unknown };

const mocks = vi.hoisted(() => ({
  mintCounter: 0,
  streamCounter: 0,
  /** The canvas stand-in's `clearAllTiles` and reset calls and the client's `viewportQuery` calls, in one list, in order. */
  events: [] as Event[],
  sinks: new Map<string, { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void }>(),
  canvas: { props: null as import("./canvas/WorkingCanvas").WorkingCanvasProps | null },
}));

function describeFixture(): import("./skp/types").DescribeResponse {
  const field = (name: string, arrow_type: string, projectable: boolean) => ({ name, arrow_type, nullable: projectable, projectable });
  return {
    source: { path_display: "C:/data/parcels.parquet", geoparquet_version: "1.1.0" },
    crs: { identifier: "EPSG:2056", definition_json: null, source: "file", asserted_by: null, asserted_at: null, definition_provenance: null, axis_order: "easting,northing", axis_normalization: "none-performed", provenance: "crs:declared", axis_provenance: "axis:declared", display_convention: null, unit: "metre" },
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
  class SkpCallError extends Error {}
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
    viewportQuery: async (_dataset: string, bbox: unknown, _bboxCrs: unknown, limit: unknown, filter: unknown): Promise<import("./skp/types").ViewportQueryResponse> => {
      mocks.events.push({ call: "viewportQuery", bbox, limit, filter });
      return { stream: `st_t${++mocks.streamCounter}`, expires_in_ms: 30_000 };
    },
    recordStep: async (): Promise<Record<string, never>> => ({}),
  };
});

vi.mock("./diagnostics/log", () => ({ logSessionEvent: () => {} }));
vi.mock("./skp/events", () => ({ listenDatasetSessionEnded: async () => () => {} }));
vi.mock("./streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
vi.mock("./streaming/adapterWs", () => ({
  startStream: (opts: { ticketHandle: string; sink: { onBatch: (payload: Uint8Array, contiguous: boolean) => void; onTerminal: (terminal: { kind: string; detail: string }) => void } }) => {
    mocks.sinks.set(opts.ticketHandle, opts.sink);
    return { cancel: () => {}, stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } };
  },
}));

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
        resetFitForNewGeneration: (...args: unknown[]) => {
          mocks.events.push({ call: "reset", args });
        },
        getResidentCounts: () => ({ totalResidentVertices: 0, totalResidentFeatures: 0 }),
        armFirstPixelRenderHook: () => false,
        disarmFirstPixelRenderHook: () => true,
        pushTileBatch: () => ({ rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null, batchExtent: null }),
        clearTile: () => {},
        clearAllTiles: () => {
          mocks.events.push({ call: "clearAllTiles" });
        },
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
import { UNTILED_FIRST_LOOK_ROW_LIMIT } from "./canvas/tileGridConstants";
import { __resetResidencyArmForTests, setResidencyArm } from "./residency/residencyArm";
import { encodeDecU64 } from "./skp/codec";
import { attributeBatchIpc } from "./testUtils/attributeBatchIpc";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
/** A viewport query of the session's untiled look: no box, and the first look's row limit (the Table's own query carries another limit). */
const isUntiledLook = (event: Event): event is Extract<Event, { call: "viewportQuery" }> =>
  event.call === "viewportQuery" && event.bbox === null && event.limit === encodeDecU64(BigInt(UNTILED_FIRST_LOOK_ROW_LIMIT));
const resets = (events: Event[]): Extract<Event, { call: "reset" }>[] => events.filter((e): e is Extract<Event, { call: "reset" }> => e.call === "reset");

describe("App: a Colour-by refill keeps the view (colour-by-refill-keeps-the-view), through the real App and the real candidate session", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(mocks, { mintCounter: 0, streamCounter: 0, events: [] });
    mocks.sinks.clear();
    mocks.canvas.props = null;
    expect(setResidencyArm("candidate")).toEqual({ ok: true });
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
  /** Chooses `column` in the Style tab's chooser and presses Apply. */
  async function colourBy(column: string): Promise<void> {
    click(q("#inspector-tab-style"));
    const select = q<HTMLSelectElement>(".style-colour-column")!;
    act(() => {
      select.value = column;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    click(q(".style-colour-apply"));
    await flush();
  }
  /** One batch of the open's projection (zone, name, area) on the stream `handle`, with its terminal when `done`. */
  function deliver(handle: string, zones: Array<string | null>, done: boolean): void {
    const ids = zones.map((_, i) => BigInt(i + 1));
    const { ipc } = attributeBatchIpc(ids, [
      { name: "zone", kind: "utf8", values: zones },
      { name: "name", kind: "utf8", values: zones.map((z) => `n-${String(z)}`) },
      { name: "area", kind: "float64", values: zones.map(() => 1) },
    ]);
    act(() => {
      mocks.sinks.get(handle)!.onBatch(ipc, true);
      if (done) mocks.sinks.get(handle)!.onTerminal({ kind: "Completed", detail: "" });
    });
  }
  function setValue(input: HTMLInputElement, value: string): void {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  // RECORDED MUTATION for "RK-A1: with the not-held fact standing, a Colour by on a new column clears the tiles, resets the canvas with keepCamera, and issues one new untiled look under the active filter" (M-A1): in the
  // Colour-by effect (App.tsx) do not pass `{ keepCamera: true }`. Expected failure: the reset records no `keepCamera`. (M-A2: the `issueQueryRef` binding at the candidate session's construction drops its fourth argument; the same failure.)
  it("RK-A1: with the not-held fact standing, a Colour by on a new column clears the tiles, resets the canvas with keepCamera, and issues one new untiled look under the active filter", async () => {
    await open("C:/data/a.parquet");
    await flush();
    expect(mocks.events.filter(isUntiledLook), "the open's own first look").toHaveLength(1);
    act(() => mocks.canvas.props!.onAttributesNotHeld!());
    const mark = mocks.events.length;

    await colourBy("zone");
    deliver(`st_t${mocks.streamCounter}`, ["park", "civic"], true); // the apply's one cases query
    await flush();
    await flush();

    const after = mocks.events.slice(mark);
    const refill = after.findIndex(isUntiledLook);
    expect(refill, "the refill's untiled look was issued").toBeGreaterThanOrEqual(0);
    expect(after.filter(isUntiledLook), "one new untiled look").toHaveLength(1);
    expect(after.slice(0, refill).filter((e) => e.call !== "viewportQuery"), "before it: the clear, then the reset with keepCamera").toEqual([{ call: "clearAllTiles" }, { call: "reset", args: [{ keepCamera: true }] }]);
    expect((after[refill] as Extract<Event, { call: "viewportQuery" }>).filter, "under the active filter, none here").toBeNull();
  });

  // RECORDED MUTATION for "RK-A2: an Apply and a Clear each reset the canvas plain, the session's reset included" (M-A3): the `issueQueryRef` binding at the candidate session's construction (App.tsx)
  // always passes `{ keepCamera: true }`. Expected failure: the session's reset after `clearAllTiles` records `keepCamera`. (App's own reset after the issue is plain whatever the binding passes, so it cannot show M-A3.)
  it("RK-A2: an Apply and a Clear each reset the canvas plain, the session's reset included", async () => {
    await open("C:/data/a.parquet");
    await flush();
    for (const [name, press] of [
      ["an Apply", () => { setValue(q<HTMLInputElement>(".filter-predicate")!, "zone = 'residential'"); click(q(".filter-apply")); }],
      ["a Clear", () => click(q(".filter-clear"))],
    ] as const) {
      const mark = mocks.events.length;
      press();
      await flush();
      await flush();
      const after = mocks.events.slice(mark);
      const clear = after.findIndex((e) => e.call === "clearAllTiles");
      expect(clear, `${name}: the session's clear`).toBeGreaterThanOrEqual(0);
      expect(after[clear + 1]?.call, `${name}: the session's reset follows the clear`).toBe("reset");
      expect(resets(after).length, `${name}: the session's reset and App's own`).toBeGreaterThanOrEqual(2);
      for (const reset of resets(after)) expect(reset.args[0], `${name}: a plain reset`).toBeUndefined();
      expect(after.filter(isUntiledLook), `${name}: one untiled look`).toHaveLength(1);
    }
  });
});
