// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PB-R1 (the chooser), PB-U8 and PB-R3, Amendment 25's PB-U13 and PB-U15, and PB-U16 and PB-U17 (the line against a second wait): the Colour by block of the REAL `StylePanel`, over a real `TableSource` whose transport is the stand-in
 * (`categoryCases.test.ts` has the same one). The legend is `Legend.test.tsx`'s.
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../skp/client")>();
  return { ...actual, viewportQuery: viewportQueryMock, cancel: cancelMock };
});
const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));
const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/adapterWs", () => ({ startStream: startStreamMock }));
vi.mock("../diagnostics/log", () => ({ logSessionEvent: vi.fn() }));

import { ENCODING_POLYGON } from "../canvas/decodeBatch";
import { consoleRecorder, isGuiActionEntry } from "../console/recorder";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { StreamSink } from "../streaming/transport";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { TABLE_MAX_ROWS } from "../table/tableConstants";
import { TableSource } from "../table/tableSource";
import { DEFAULT_STYLE_STATE } from "./document";
import type { StyleState } from "./document";
import StylePanel from "./StylePanel";
import { CATEGORY_NULL_COLOR, CATEGORY_OTHER_COLOR, CATEGORY_PALETTE } from "./styleConstants";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const flush = (): Promise<void> => act(async () => new Promise<void>((resolve) => setTimeout(resolve, 0)));
const filter = { predicate: "zone = 'a'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
const COLUMNS = [
  { name: "tag", arrowType: "Utf8" },
  { name: "area", arrowType: "Float64" },
  { name: "day", arrowType: "Date32" },
  { name: "dict", arrowType: "Dictionary(Int32, Utf8)" },
  { name: "wide", arrowType: "LargeUtf8" },
  { name: "view", arrowType: "Utf8View" },
];

describe("the Colour by block of the Style tab", () => {
  let container: HTMLDivElement;
  let root: Root;
  const onChange = vi.fn<(next: StyleState) => void>();
  const onCommit = vi.fn<(next: StyleState, source?: "reset") => void>();

  beforeEach(() => {
    let minted = 0;
    viewportQueryMock.mockReset().mockImplementation(async () => ({ stream: `sh_${++minted}`, expires_in_ms: 30_000 }));
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
    onChange.mockReset();
    onCommit.mockReset();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const source = () => new TableSource({ dataset: "ds_x", geometryColumn: "geometry", geometryEncoding: ENCODING_POLYGON, projection: ["tag"], onSessionEnded: vi.fn() });
  function mount(table: TableSource | null, exportHeld = false): void {
    act(() => {
      root.render(<StylePanel style={DEFAULT_STYLE_STATE} onChange={onChange} onCommit={onCommit} columns={COLUMNS} source={table} filter={filter} exportHeld={exportHeld} />);
    });
  }
  const q = <T extends Element = HTMLElement>(selector: string): T | null => container.querySelector<T>(selector);
  const line = () => q(".style-colour-line")?.textContent ?? "(no line)";
  function choose(column: string): void {
    const select = q<HTMLSelectElement>(".style-colour-column")!;
    act(() => {
      select.value = column;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
  const deliver = (handle: string, tags: Array<string | null>): void => {
    const sink = startStreamMock.mock.calls.find((call) => call[0].ticketHandle === handle)![0].sink as StreamSink;
    act(() => {
      sink.onBatch(attributeBatchIpc(tags.map((_, i) => BigInt(i)), [{ name: "tag", kind: "utf8", values: tags }]).ipc, true);
      sink.onTerminal({ kind: "Completed", detail: "" });
    });
  };

  // RECORDED MUTATION for PB-R1 (the chooser), applied alone: in `StylePanel` (style/StylePanel.tsx) let `candidates` be every column, with no filter by `admitsMatchKeyType`.
  // Expected failure: the chooser lists every column.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-R1: the chooser lists exactly the columns whose type the style rule admits as a key, and Apply waits for a choice": AssertionError: the chooser's options, the empty choice first: expected [ '', 'tag', 'area', 'day', …(3) ] to deeply equal [ '', 'tag', 'wide', 'view' ]. Reverted after observing.
  it("PB-R1: the chooser lists exactly the columns whose type the style rule admits as a key, and Apply waits for a choice", () => {
    mount(source());
    const options = [...container.querySelectorAll<HTMLOptionElement>(".style-colour-column option")];
    expect(options.map((o) => o.value), "the chooser's options, the empty choice first").toEqual(["", "tag", "wide", "view"]);
    expect(q<HTMLButtonElement>(".style-colour-apply")!.disabled, "Apply with no column chosen").toBe(true);
    choose("tag");
    expect(q<HTMLButtonElement>(".style-colour-apply")!.disabled, "Apply with a column chosen").toBe(false);
    mount(null);
    expect(q<HTMLButtonElement>(".style-colour-apply")!.disabled, "Apply with no table source").toBe(true);
  });

  // RECORDED MUTATION for PB-U8, applied alone: in `StylePanel` (style/StylePanel.tsx) call `waitForFirstScope(source, null)`, with no filter.
  // Expected failure: the viewport_query call carries no filter.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U8: the apply asks the table source for one first scope under the view's filter and builds its cases from those rows alone, as one edit and one commit": AssertionError: viewport_query calls: dataset, bbox, bbox CRS, limit, filter, projection: expected [ Array(1) ] to deeply equal [ Array(1) ]. Reverted after observing.
  it("PB-U8: the apply asks the table source for one first scope under the view's filter and builds its cases from those rows alone, as one edit and one commit", async () => {
    mount(source());
    choose("tag");
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    expect(viewportQueryMock.mock.calls, "viewport_query calls: dataset, bbox, bbox CRS, limit, filter, projection").toEqual([["ds_x", null, null, String(TABLE_MAX_ROWS), filter, ["tag"]]]);
    deliver("sh_1", ["b", "a", null, "b"]);
    await flush();
    const cases = [{ when: "a", then: CATEGORY_PALETTE[0] }, { when: "b", then: CATEGORY_PALETTE[1] }];
    const next = { ...DEFAULT_STYLE_STATE, fillMatch: { column: "tag", cases, onNull: CATEGORY_NULL_COLOR, onUnmatched: CATEGORY_OTHER_COLOR } };
    expect([onChange.mock.calls, onCommit.mock.calls], "one edit and one commit with the same next style").toEqual([[[next]], [[next]]]);
    expect(line(), "the owner line names the column and the counts").toContain("2 distinct values found among the first 4 features read");
  });

  // RECORDED MUTATION for PB-R3, applied alone: in `handleCancelColourBy` (style/StylePanel.tsx) do not call `abandon()`.
  // Expected failure: the stream the apply issued is not cancelled.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-R3: while the cases query runs a line and Cancel are shown, and Cancel ends the stream and applies nothing": AssertionError: the stream the apply issued: expected "vi.fn()" to be called with arguments: [ 'sh_1' ]. Reverted after observing.
  it("PB-R3: while the cases query runs a line and Cancel are shown, and Cancel ends the stream and applies nothing", async () => {
    mount(source());
    choose("tag");
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    expect(line(), "the line while the query runs").toContain("Reading the first features");
    expect(q(".style-colour-cancel"), "Cancel while the query runs").not.toBeNull();
    act(() => q<HTMLButtonElement>(".style-colour-cancel")!.click());
    await flush();
    expect(cancelMock, "the stream the apply issued").toHaveBeenCalledWith("sh_1");
    expect([onChange.mock.calls.length, onCommit.mock.calls.length], "edits and commits after Cancel").toEqual([0, 0]);
    expect(line(), "the line after Cancel").toContain("Nothing was applied");
    expect(q(".style-colour-cancel"), "Cancel after Cancel").toBeNull();
    expect(q<HTMLButtonElement>(".style-colour-apply")!.disabled, "Apply after Cancel").toBe(false);
  });

  const panel = (style: StyleState, table: TableSource | null, columns = COLUMNS, view = filter): void =>
    act(() => {
      root.render(<StylePanel style={style} onChange={onChange} onCommit={onCommit} columns={columns} source={table} filter={view} exportHeld={false} />);
    });
  const rows = (action: string): number => consoleRecorder.entries().filter(isGuiActionEntry).filter((e) => e.action === action).length;
  const MATCH = { column: "tag", cases: [{ when: "a", then: CATEGORY_PALETTE[0] }], onNull: CATEGORY_NULL_COLOR, onUnmatched: CATEGORY_OTHER_COLOR };

  // RECORDED MUTATIONS for PB-U13, each applied alone: in `StylePanel` (style/StylePanel.tsx) remove (1) the `recordNamed` call in `applyColourBy`, (2) the one in `handleOneColour`.
  // Expected failure: (1) no style.colourBy row at the apply; (2) no style.oneColour row before One colour's commit.
  it("PB-U13: Colour by and One colour each record their class C row at the action, before the outcome, whatever the outcome", async () => {
    const colourBy = rows("style.colourBy");
    mount(source());
    choose("tag");
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    expect([rows("style.colourBy") - colourBy, onChange.mock.calls.length], "the Colour by row at the apply, before its outcome").toEqual([1, 0]);
    await flush();
    act(() => q<HTMLButtonElement>(".style-colour-cancel")!.click());
    await flush();
    expect([rows("style.colourBy") - colourBy, onCommit.mock.calls.length], "the row of an apply cancelled, nothing applied").toEqual([1, 0]);
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    deliver("sh_2", [null]);
    await flush();
    expect(line(), "the line of an apply that applies nothing").toContain("holds no value");
    expect([rows("style.colourBy") - colourBy, onCommit.mock.calls.length], "the row of an apply that applies nothing").toEqual([2, 0]);

    const oneColour = rows("style.oneColour");
    let atCommit = -1;
    onCommit.mockImplementation(() => {
      atCommit = rows("style.oneColour") - oneColour;
    });
    panel({ ...DEFAULT_STYLE_STATE, fillMatch: MATCH }, null);
    act(() => q<HTMLButtonElement>(".style-one-colour")!.click());
    expect([atCommit, onCommit.mock.calls.length], "the One colour row before its commit, and the one commit").toEqual([1, 1]);
  });

  // RECORDED MUTATIONS for PB-U15, each applied alone: in `StylePanel` (style/StylePanel.tsx) (1) keep the line when the match ends other than by the panel; (2) keep a chosen column the candidates no longer list.
  // Expected failure: (1) the Colour by line after the match ended; (2) Apply with the column no longer offered.
  it("PB-U15: under the same panel, a match ended from outside clears the Colour by line, and a chosen column no longer offered is reset", async () => {
    const table = source();
    panel(DEFAULT_STYLE_STATE, table);
    choose("tag");
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    deliver("sh_1", ["a", "b"]);
    await flush();
    const applied = onChange.mock.calls[0][0];
    panel(applied, table);
    expect(line(), "the line with the match applied").toContain("Coloured by tag");
    panel({ ...applied, fillMatch: null }, table, COLUMNS.filter((c) => c.name !== "tag"));
    expect(line(), "the Colour by line after the match ended from outside").toBe("");
    expect(q<HTMLButtonElement>(".style-colour-apply")!.disabled, "Apply with the chosen column no longer offered").toBe(true);
    expect(q<HTMLSelectElement>(".style-colour-column")!.value, "the chosen column").toBe("");
  });

  const lastChange = (): StyleState => onChange.mock.calls[onChange.mock.calls.length - 1][0];
  function fillColour(value: string): void {
    const input = q<HTMLInputElement>(".style-fill-color")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  /** Colour by on `tag` applied through the panel over `table`'s first scope, its next style handed back as App would, with the controls shown. */
  async function colouredBy(table: TableSource, handle: string | null, view = filter): Promise<StyleState> {
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    if (handle !== null) deliver(handle, ["a", "b"]);
    await flush();
    const applied = lastChange();
    panel(applied, table, COLUMNS, view);
    return applied;
  }
  const other = { predicate: "zone = 'b'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };

  // RECORDED MUTATION for PB-U16, applied alone: in `StylePanel` (style/StylePanel.tsx) put back the flag the Fill colour, One colour and Reset set so that the effect on the match leaves the line (`endedHereRef`, as at d1d3a29f).
  // Expected failure: (a) the Colour by line after the Fill colour change.
  it("PB-U16: with Colour by applied, a Fill colour change and Reset each clear the Colour by line", async () => {
    const table = source();
    panel(DEFAULT_STYLE_STATE, table);
    act(() => q<HTMLButtonElement>(".style-disclosure")!.click());
    choose("tag");
    await colouredBy(table, "sh_1");
    expect(line(), "the line with the match applied").toContain("Coloured by tag");
    fillColour("#ff0000");
    panel(lastChange(), table);
    expect(line(), "(a) the Colour by line after a Fill colour change").toBe("");
    await colouredBy(table, null); // the first scope is held complete under the view's filter: reused, no wait
    expect(line(), "the line with the match applied again").toContain("Coloured by tag");
    act(() => q<HTMLButtonElement>(".style-reset")!.click());
    panel(DEFAULT_STYLE_STATE, table);
    expect(line(), "(b) the Colour by line after Reset").toBe("");
  });

  // RECORDED MUTATIONS for PB-U17, each applied alone: in `StylePanel` (style/StylePanel.tsx) (1) clear the line on an end of a match whether or not a wait runs (drop `waitRef.current === null` from the effect on the match);
  // (2) in `handleOneColour`, `setLine(null)` unconditionally. Expected failure: (1) the line during the second wait, after the Fill colour change; (2) the line after One colour during the wait.
  it("PB-U17: while a second Colour by waits, a Fill colour change, Reset, One colour and an open leave the line the wait's, and the wait's outcome sets it", async () => {
    const table = source();
    panel(DEFAULT_STYLE_STATE, table);
    act(() => q<HTMLButtonElement>(".style-disclosure")!.click());
    choose("tag");
    const waiting = (label: string): void => {
      expect(line(), `${label}: the line`).toContain("Reading the first features");
      expect(q(".style-colour-cancel"), `${label}: Cancel`).not.toBeNull();
    };

    // (a) A Fill colour change during the wait, then rows: the match is applied over the new fill colour.
    const applied = await colouredBy(table, "sh_1");
    panel(applied, table, COLUMNS, other); // the view's filter changed, so the first scope is read again
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    waiting("(a) the second wait");
    fillColour("#ff0000");
    panel(lastChange(), table, COLUMNS, other);
    waiting("(a) after a Fill colour change during the wait");
    deliver("sh_2", ["c"]);
    await flush();
    expect([lastChange().fillColor, lastChange().fillMatch?.column], "(a) the wait's apply: the fill colour chosen during it, and the match").toEqual(["#ff0000", "tag"]);
    expect(line(), "(a) the line after the wait's rows").toContain("Coloured by tag");
    panel(lastChange(), table, COLUMNS, other);

    // (b) Reset during the wait, then Cancel: nothing is applied.
    panel(lastChange(), table); // the view's filter back, so the first scope is read again
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    act(() => q<HTMLButtonElement>(".style-reset")!.click());
    panel(DEFAULT_STYLE_STATE, table);
    waiting("(b) after Reset during the wait");
    const changes = onChange.mock.calls.length;
    act(() => q<HTMLButtonElement>(".style-colour-cancel")!.click());
    await flush();
    expect([line(), onChange.mock.calls.length - changes], "(b) the line after Cancel, and the edits since").toEqual(["[P6 placeholder] Cancelled. Nothing was applied.", 0]);
    expect(cancelMock, "(b) the stream the second wait issued").toHaveBeenCalledWith("sh_3");

    // (d) One colour during the wait, then rows: the match is applied again.
    const coloured = await colouredBy(table, "sh_4");
    panel(coloured, table, COLUMNS, other);
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    act(() => q<HTMLButtonElement>(".style-one-colour")!.click());
    expect(lastChange().fillMatch, "(d) One colour's edit").toBeNull();
    panel(lastChange(), table, COLUMNS, other);
    waiting("(d) after One colour during the wait");
    deliver("sh_5", ["c"]);
    await flush();
    expect(lastChange().fillMatch?.column, "(d) the wait's apply").toBe("tag");
    expect(line(), "(d) the line after the wait's rows").toContain("Coloured by tag");
    panel(lastChange(), table); // the view's filter back, so the first scope is read again

    // (c) The panel's side of an open under the same dataset key (App.tsx's table source effect, its cleanup and `resource.admitted`): the old
    // source is disposed, then the style comes without the match, then the new source; the open ends the wait, as cancelled.
    const again = await colouredBy(table, "sh_6");
    panel(again, table, COLUMNS, other);
    act(() => q<HTMLButtonElement>(".style-colour-apply")!.click());
    await flush();
    waiting("(c) the wait before the open");
    const before = [onChange.mock.calls.length, viewportQueryMock.mock.calls.length];
    act(() => {
      table.dispose();
      root.render(<StylePanel style={{ ...again, fillMatch: null }} onChange={onChange} onCommit={onCommit} columns={COLUMNS} source={table} filter={other} exportHeld={false} />);
    });
    await flush();
    panel({ ...again, fillMatch: null }, source(), COLUMNS, other);
    await flush();
    expect(line(), "(c) the line after the open").toBe("[P6 placeholder] Cancelled. Nothing was applied.");
    expect(q(".style-colour-cancel"), "(c) Cancel after the open").toBeNull();
    expect([onChange.mock.calls.length, viewportQueryMock.mock.calls.length], "(c) edits and viewport_query calls since the open").toEqual(before);
    expect(cancelMock, "(c) the stream of the wait the open ended").toHaveBeenCalledWith("sh_7");
  });
});
