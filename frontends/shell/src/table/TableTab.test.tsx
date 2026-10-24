// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Only the transport is mocked (section 4): the real `TableSource`, the real `decodeBatch` and the real grid run.
const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../skp/client")>();
  return { ...actual, viewportQuery: viewportQueryMock, cancel: cancelMock };
});
vi.mock("../streaming/dataPlaneClient", () => ({ dataPlaneAttach: async () => ({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] }) }));
const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/adapterWs", () => ({ startStream: startStreamMock }));
vi.mock("../diagnostics/log", () => ({ logSessionEvent: vi.fn() }));

import { ENCODING_POLYGON } from "../canvas/decodeBatch";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { Filter } from "../skp/types";
import type { StreamSink } from "../streaming/transport";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import type { SelectionMember, SelectionMembers } from "../workspace/selection";
import TableTab from "./TableTab";
import type { TableTabProps } from "./TableTab";
import { TableSource } from "./tableSource";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PC-R1 and PC-R2: the Table tab's issue discipline and its session end (section 2.4 (b)). */
const filterOf = (predicate: string): Filter => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
const sinkOf = (handle: string): StreamSink => startStreamMock.mock.calls.find((call) => call[0].ticketHandle === handle)![0].sink as StreamSink;
const unit = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
const NO_MEMBERS: SelectionMembers = new Map();

let container: HTMLDivElement;
let root: Root;
let source: TableSource;
let minted: number;
const onSessionEnded = vi.fn();
const recordScopeSet = vi.fn();
const recordCancel = vi.fn();

beforeEach(() => {
  minted = 0;
  viewportQueryMock.mockReset().mockImplementation(async () => ({ stream: `sh_${++minted}`, expires_in_ms: 30_000 }));
  cancelMock.mockReset().mockResolvedValue({ state: "requested" });
  startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  recordScopeSet.mockReset();
  recordCancel.mockReset();
  onSessionEnded.mockReset();
  source = new TableSource({ dataset: "ds_x", geometryColumn: "geometry", geometryEncoding: ENCODING_POLYGON, projection: ["tag"], onSessionEnded });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  source.dispose();
  container.remove();
});

const base = (over: Partial<TableTabProps> = {}): TableTabProps => ({
  source,
  shown: false,
  exportHeld: false,
  sessionEnded: false,
  viewFilter: null,
  members: NO_MEMBERS,
  columns: ["tag"],
  residentIdsStreamedUnder: () => new Set<bigint>(),
  mapSettled: true,
  recordScopeSet,
  recordCancel,
  ...over,
});
const show = async (over: Partial<TableTabProps> = {}): Promise<void> => {
  act(() => root.render(<TableTab {...base(over)} />));
  await flush();
};
const text = (selector: string): string | undefined => container.querySelector(selector)?.textContent ?? undefined;
const cells = (): string[] => [...container.querySelectorAll('[role="gridcell"]')].map((cell) => cell.textContent ?? "");
const choose = (value: string): void => {
  const select = container.querySelector("select")!;
  act(() => {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
};

describe("PC-R1: hidden, no stream; shown, one; a filter change supersedes; a collapse cancels", () => {
  // RECORDED MUTATION for "PC-R1": in `TableTab`'s issue effect drop the `!shown` test (issue on mount). Expected failure: a viewport_query was issued while the tab was hidden.
  it("PC-R1: nothing is issued while the tab is hidden, one stream while it is shown, a filter change cancels it before the next, and a collapse cancels", async () => {
    await show({ shown: false });
    expect(viewportQueryMock).not.toHaveBeenCalled();

    const a = filterOf("zone = 'a'");
    await show({ shown: true, viewFilter: a });
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, "1000", a, ["tag"]);
    expect(text(".table-liveness")).toContain("Loading features");

    const b = filterOf("zone = 'b'");
    await show({ shown: true, viewFilter: b });
    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    expect(viewportQueryMock).toHaveBeenCalledTimes(2);
    expect(cancelMock.mock.invocationCallOrder[0]).toBeLessThan(viewportQueryMock.mock.invocationCallOrder[1]);

    await show({ shown: false, viewFilter: b }); // collapsed, or another tab selected
    expect(cancelMock).toHaveBeenCalledWith("sh_2");
    expect(viewportQueryMock).toHaveBeenCalledTimes(2);
    expect(container.querySelector(".table-liveness")).toBeNull();
  });

  it("the scope options are plan section 3's labels with the first selected; Cancel and a scope change are recorded at the action, and only the first scope issues", async () => {
    await show({ shown: true });
    expect([...container.querySelectorAll("option")].map((option) => option.textContent)).toEqual(["Filtered", "Selected", "Selected, ignoring filter"]);
    expect(container.querySelector("select")!.value).toBe("filtered");
    expect(text(".table-heading")).toBe("features");
    act(() => container.querySelector<HTMLButtonElement>(".table-cancel")!.click());
    expect(recordCancel).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    expect(container.querySelector(".table-liveness")).toBeNull();

    choose("selected");
    expect(recordScopeSet).toHaveBeenCalledTimes(1);
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
  });

  it("the rows come from the stream's decoded batches, NULLs show their marker, and the second and third scopes list the selection", async () => {
    const members: SelectionMembers = new Map<bigint, SelectionMember>([[7n, { bounds: unit, row: [{ name: "tag", value: { kind: "text", text: "kept" } }], filter: null }]]);
    await show({ shown: true, members });
    sinkOf("sh_1").onBatch(attributeBatchIpc([1n, 2n], [{ name: "tag", kind: "utf8", values: ["north", null] }]).ipc, true);
    sinkOf("sh_1").onTerminal({ kind: "Completed", detail: "" });
    await flush();
    expect(cells()).toEqual(["1", "north", "2", "[P6 placeholder] NULL"]);
    expect(text(".table-line")).toBe("[P6 placeholder] Showing all 2 features.");

    for (const [value, line] of [
      ["selected", "[P6 placeholder] Showing 1 of 1 selected features that pass the filter."],
      ["selected-ignoring-filter", "[P6 placeholder] Showing all 1 selected features, ignoring the filter."],
    ]) {
      choose(value);
      expect(cells()).toEqual(["7", "kept"]);
      expect(text(".table-line")).toBe(line);
    }
  });
});

describe("PC-R2: a session end clears the rows and shows the owner line", () => {
  // RECORDED MUTATION for "PC-R2": in `TableSource.end` (tableSource.ts) keep the rows (drop the `this.reset(this.filter);` call). Expected failure: the grid still holds the delivered row.
  it("PC-R2: after the session ends the rows are gone, the owner line shows, and nothing is issued again", async () => {
    await show({ shown: true });
    sinkOf("sh_1").onBatch(attributeBatchIpc([1n], [{ name: "tag", kind: "utf8", values: ["north"] }]).ipc, true);
    await flush();
    expect(cells()).toEqual(["1", "north"]);

    await show({ shown: true, sessionEnded: true });
    expect(cells()).toEqual([]);
    expect(text(".table-line")).toBe("[P6 placeholder] The file changed, so the table was cleared; open the file again to load it.");
    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    await show({ shown: false, sessionEnded: true });
    await show({ shown: true, sessionEnded: true });
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
  });

  it("a refusal shows the shell's lead line and the kernel's code and message", async () => {
    await show({ shown: true });
    sinkOf("sh_1").onTerminal({ kind: "ProducerFailed", detail: "engine.connections_exhausted: no connection was free" });
    await flush();
    expect(text(".table-line")).toBe("[P6 placeholder] The table could not be loaded.");
    expect(text(".admission-refusal-code")).toBe("engine.connections_exhausted");
    expect(text(".admission-refusal-message")).toBe("no connection was free");
  });
});
