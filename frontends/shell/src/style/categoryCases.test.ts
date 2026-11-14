// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

// Only the transport is mocked, as `table/tableSource.test.ts` does it: the client's `viewportQuery` and `cancel`, the data-plane attach, `startStream` and the session log.
// The `TableSource` is the real class, decoding the helper's IPC through the real `decodeBatch`.
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
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { Filter } from "../skp/types";
import type { StreamSink } from "../streaming/transport";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { TableSource } from "../table/tableSource";
import { buildCategoryCases, waitForFirstScope } from "./categoryCases";
import { CATEGORY_MAX_CASES, CATEGORY_PALETTE } from "./styleConstants";

const filterOf = (predicate: string): Filter => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));
const sinkOf = (handle: string): StreamSink => startStreamMock.mock.calls.find((call) => call[0].ticketHandle === handle)![0].sink as StreamSink;
const newSource = () => new TableSource({ dataset: "ds_x", geometryColumn: "geometry", geometryEncoding: ENCODING_POLYGON, projection: ["tag"], onSessionEnded: vi.fn() });
/** Delivers `tags` as one batch on stream `handle` and completes it. */
function deliver(handle: string, tags: Array<string | null>): void {
  const ids = tags.map((_, i) => BigInt(i));
  sinkOf(handle).onBatch(attributeBatchIpc(ids, [{ name: "tag", kind: "utf8", values: tags }]).ipc, true);
  sinkOf(handle).onTerminal({ kind: "Completed", detail: "" });
}
/** A source holding a completed first scope of `tags` under `filter`. */
async function completed(tags: Array<string | null>, filter: Filter | null = null): Promise<TableSource> {
  const source = newSource();
  await source.start(filter);
  await flush();
  deliver(`sh_${viewportQueryMock.mock.calls.length}`, tags);
  return source;
}

beforeEach(() => {
  let minted = 0;
  viewportQueryMock.mockReset().mockImplementation(async () => ({ stream: `sh_${++minted}`, expires_in_ms: 30_000 }));
  cancelMock.mockReset().mockResolvedValue({ state: "requested" });
  dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
  startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
});

describe("the cases of a Colour by (section 2.3 (d))", () => {
  it("PB-U2: distinct non-null values in code-point order, the first twelve with their palette colours, and the counts left out", async () => {
    const small = buildCategoryCases((await completed(["b", "a", null, "B", "a", "", "～", "\u{1F600}"])).getSnapshot(), "tag");
    expect(small.cases.map((c) => c.when), "the distinct non-null values, by code point (an astral character after U+FF5E)").toEqual(["", "B", "a", "b", "～", "\u{1F600}"]);
    expect(small.cases.map((c) => c.then), "the palette's colours in order").toEqual(CATEGORY_PALETTE.slice(0, 6));
    expect([small.found, small.other], "six distinct values, none left out").toEqual([6, 0]);

    const many = Array.from({ length: CATEGORY_MAX_CASES + 5 }, (_, i) => `v${String(i).padStart(2, "0")}`);
    const capped = buildCategoryCases((await completed([...many, ...many])).getSnapshot(), "tag");
    expect(capped.cases.map((c) => c.when), "the first twelve of the sorted values").toEqual(many.slice(0, CATEGORY_MAX_CASES));
    expect([capped.found, capped.other], "seventeen found, five left out").toEqual([CATEGORY_MAX_CASES + 5, 5]);
    expect(buildCategoryCases((await completed([null, null])).getSnapshot(), "tag").cases, "a column of NULLs gives no case").toEqual([]);
  });
});

describe("the wait for the first scope (Amendment 12 item 4)", () => {
  it("PB-U9 (i): a completed result under the same filter is reused, with no viewport_query", async () => {
    const a = filterOf("zone = 'a'");
    const source = await completed(["x", "y"], a);
    const outcome = await waitForFirstScope(source, filterOf("zone = 'a'")).result;
    expect(viewportQueryMock, "viewport_query calls after the reuse").toHaveBeenCalledTimes(1);
    expect(outcome.kind === "rows" && outcome.snapshot.count, "the rows the reuse resolved with").toBe(2);
  });

  it("PB-U9 (ii): a loading stream under the same filter is joined, with one viewport_query in all", async () => {
    const source = newSource();
    await source.start(null);
    await flush();
    const wait = waitForFirstScope(source, null);
    await flush();
    expect(viewportQueryMock, "viewport_query calls with the stream joined").toHaveBeenCalledTimes(1);
    deliver("sh_1", ["x"]);
    const outcome = await wait.result;
    expect(outcome.kind === "rows" && outcome.snapshot.count, "the joined stream's rows").toBe(1);
  });

  it("PB-U9 (iii): in any other state exactly one viewport_query is issued, and it resolves with that stream's rows", async () => {
    const idle = newSource();
    const first = waitForFirstScope(idle, null);
    await flush();
    expect(viewportQueryMock, "viewport_query calls from an idle source").toHaveBeenCalledTimes(1);
    deliver("sh_1", ["x"]);
    expect((await first.result).kind, "the idle source's outcome").toBe("rows");

    const other = await completed(["x"], filterOf("zone = 'a'"));
    viewportQueryMock.mockClear();
    const second = waitForFirstScope(other, filterOf("zone = 'b'"));
    await flush();
    expect(viewportQueryMock, "viewport_query calls under a different filter").toHaveBeenCalledTimes(1);
    expect(viewportQueryMock.mock.calls[0][4], "the filter the one query carried").toEqual(filterOf("zone = 'b'"));
    second.abandon();
  });

  it("PB-U9 (iv): a cancel() during the wait resolves it as not applied", async () => {
    const source = newSource();
    const wait = waitForFirstScope(source, null);
    await flush();
    source.cancel();
    expect(await wait.result, "the outcome of a source cancelled mid-wait").toEqual({ kind: "not-applied", reason: "cancelled" });
  });

  it("PB-U9 (v): abandoning cancels a stream the wait issued itself and leaves a joined stream running", async () => {
    const issued = newSource();
    const own = waitForFirstScope(issued, null);
    await flush();
    own.abandon();
    expect(cancelMock, "cancel calls for the stream the wait issued").toHaveBeenCalledWith("sh_1");
    expect(await own.result, "the abandoned wait").toEqual({ kind: "not-applied", reason: "abandoned" });

    cancelMock.mockClear();
    const joined = newSource();
    await joined.start(null);
    await flush();
    const other = waitForFirstScope(joined, null);
    other.abandon();
    expect(await other.result, "the abandoned joined wait").toEqual({ kind: "not-applied", reason: "abandoned" });
    expect(cancelMock, "cancel calls for a joined stream").not.toHaveBeenCalled();
    expect(joined.getSnapshot().phase, "the joined stream still running").toBe("loading");
  });
});
