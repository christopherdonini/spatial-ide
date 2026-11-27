// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The mint window (`governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md` §4, its Amendment 1 item 2.3 and its
 * Amendment 2 item 3): once a reissue has begun, an earlier untiled look is not read as current, whether its batch or terminal
 * arrives before or after the new look's mint; a look minted after a later reissue began is cancelled and never started; and an
 * earlier look's terminal establishes no grid frame. Committed before the change, so each test's outcome at the base is the one
 * the form predicts. Drives the REAL `startCandidateArmSession` and `TileViewportStreamManager` against a fake canvas typed as
 * `WorkingCanvasHandle`, with no cast; only the kernel's boundary is mocked, with the mock set of
 * `candidateArmSession.refusal.test.ts`. A held mint is a deferred promise the `viewportQuery` mock returns once, and a terminal
 * goes only to a stream `startStream` received.
 */

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

vi.mock("../instrument/residencyInstrument", () => ({
  recordResidencyStreamIssued: vi.fn(),
  recordResidencyTileRequested: vi.fn(),
  recordResidencyStreamEnded: vi.fn(),
  recordResidencyBatchArrived: vi.fn(),
}));

const logSessionEventMock = vi.hoisted(() => vi.fn());
vi.mock("../diagnostics/log", () => ({ logSessionEvent: logSessionEventMock }));

import { applyFilter, nextScanState } from "../App";
import type { ApplyFilterDeps, ScanState } from "../App";
import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { unionBbox } from "../canvas/extent";
import { tileKeyToString, tilesCoveringBbox } from "../canvas/tileGrid";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import type { Filter } from "../skp/types";
import type { StreamSink } from "../streaming/transport";
import { startCandidateArmSession } from "./candidateArmSession";
import { nextResidencyStatus, residencyStatusText } from "./residencyStatus";
import type { ResidencyStatus, ResidencyStatusEvent } from "./residencyStatus";

// SHOWN_BOX, PENDING_BOX and the degenerate fit anchor are copied from the describe block in `candidateArmSession.test.ts` whose
// name ends with `(open-first-look-fills-fit-view)`: a first look whose batches union to the degenerate box freezes a frame with
// origin (-1, -1) and 0.125-wide cells at the default level; SHOWN_BOX covers two cells and PENDING_BOX one other.
const SHOWN_BOX: AuthoritativeBbox = { xmin: -0.99, ymin: -0.99, xmax: -0.8, ymax: -0.9 };
const PENDING_BOX: AuthoritativeBbox = { xmin: -0.5, ymin: -0.5, xmax: -0.45, ymax: -0.45 };
const DEGENERATE: AuthoritativeBbox = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 };
// The frame tests' extents: distinct, non-degenerate, and E2 differs from E2 ∪ E3.
const E1: AuthoritativeBbox = { xmin: 0, ymin: 0, xmax: 10, ymax: 10 };
const E2: AuthoritativeBbox = { xmin: 20, ymin: 20, xmax: 30, ymax: 30 };
const E3: AuthoritativeBbox = { xmin: 40, ymin: 40, xmax: 50, ymax: 50 };
const E4: AuthoritativeBbox = { xmin: 60, ymin: 60, xmax: 70, ymax: 70 };
const EXTENTS = [DEGENERATE, E1, E2, E3, E4];
/** A batch's one byte names its extent, so the fake canvas can report the extent the real decode would. */
const batch = (extent: AuthoritativeBbox): Uint8Array => new Uint8Array([EXTENTS.indexOf(extent)]);

const FEATURES = 7;
const COMPLETED: Parameters<StreamSink["onTerminal"]>[0] = { kind: "Completed", detail: "" };
const F: Filter = { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" };
const F2: Filter = { predicate: "zone = 'industrial'", dialect: "duckdb-expr/0" };
/** The within-budget complete sentence, computed through the app's own fold and text. */
const COMPLETE_TEXT = residencyStatusText(
  nextResidencyStatus({ kind: "candidate-within-budget", residentFeatureCount: FEATURES, settled: "complete" })!
);

/** The fake canvas. Each `pushTileBatch` reports `fitAnchor` as the union of the batch extents given since the last
 * `resetFitForNewGeneration`, as the real canvas does; the first batch after a reset is the one-shot auto-fit, which moves the
 * shown box to `view.fitTo` when a test has set it. Tile completeness follows `markTileComplete` and `clearAllTiles`. */
function mintCanvas(shown: AuthoritativeBbox | null) {
  const complete = new Set<string>();
  const view = { shown, fitTo: null as AuthoritativeBbox | null };
  let anchor: AuthoritativeBbox | null = null;
  let fitted = false;
  const isComplete = (tileKey: string): boolean => complete.has(tileKey);
  const canvas: WorkingCanvasHandle = {
    pushBatch: vi.fn(() => 0),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
    resetFitForNewGeneration: vi.fn(() => {
      anchor = null;
      fitted = false;
    }),
    getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: FEATURES })),
    residentIdsStreamedUnder: vi.fn(() => new Set<bigint>()),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    pushTileBatch: vi.fn((_tileKey: string, _streamHandle: string, _batchSeq: number, ipcBytes: Uint8Array) => {
      const extent = EXTENTS[ipcBytes[0]];
      anchor = unionBbox(anchor, extent);
      if (!fitted) {
        fitted = true;
        if (view.fitTo !== null) view.shown = view.fitTo;
      }
      return { rowsAdmitted: 1, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: anchor, batchExtent: extent };
    }),
    clearTile: vi.fn((tileKey: string) => void complete.delete(tileKey)),
    clearAllTiles: vi.fn(() => complete.clear()),
    isTileResidentInCandidateSet: vi.fn(isComplete),
    isTileCompleteInCandidateSet: vi.fn(isComplete),
    markTilePartial: vi.fn(),
    markTileComplete: vi.fn((tileKey: string) => void complete.add(tileKey)),
    markTileResidentEmpty: vi.fn((tileKey: string) => void complete.add(tileKey)),
    establishTileGridContext: vi.fn(),
    applyTileViewportContext: vi.fn(() => true),
    shownViewportBbox: vi.fn(() => view.shown),
  };
  return { canvas, view };
}

/** The session with App's two folds: the status through `nextResidencyStatus`, the scan through `nextScanState`. */
function start(shown: AuthoritativeBbox | null = SHOWN_BOX) {
  const { canvas, view } = mintCanvas(shown);
  const statusEvents: ResidencyStatusEvent[] = [];
  let status: ResidencyStatus | null = null;
  let scan: ScanState = { kind: "idle" };
  const session = startCandidateArmSession({
    dataset: "ds_x",
    crsUnit: "metre",
    canvas,
    columns: null,
    onResidencyStatusChange: (event) => {
      statusEvents.push(event);
      status = nextResidencyStatus(event, status);
    },
    applyScanEvent: (event) => {
      scan = nextScanState(scan, event);
    },
  });
  return { session, canvas, view, statusEvents, text: () => (status === null ? null : residencyStatusText(status)), scanKind: () => scan.kind };
}
type Probe = ReturnType<typeof start>;

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((res) => (resolve = res));
  return { promise, resolve };
}
type Ticket = ReturnType<typeof deferred<{ stream: string }>>;

/** The untiled look (bbox null) is answered by the next item of `untiled`, a handle or a held ticket, and never past its end; a
 * tile query is answered at once as sh_t1, sh_t2, ... */
function routeQueries(untiled: Array<string | Ticket>): void {
  let tiles = 0;
  viewportQueryMock.mockReset().mockImplementation((_dataset: string, bbox: unknown) => {
    if (bbox !== null) return Promise.resolve({ stream: `sh_t${++tiles}` });
    const answer = untiled.shift();
    if (answer === undefined) return new Promise(() => {});
    return typeof answer === "string" ? Promise.resolve({ stream: answer }) : answer.promise;
  });
}

function sinkFor(handle: string): StreamSink {
  const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
  if (!call) throw new Error(`no stream started for ${handle}`);
  return call[0].sink as StreamSink;
}
const started = (): string[] => startStreamMock.mock.calls.map((c) => c[0].ticketHandle);
const startedSince = (mark: number, except = ""): string[] => started().slice(mark).filter((h) => h !== except);
const tileQueryCalls = (): unknown[][] => viewportQueryMock.mock.calls.filter((c) => c[1] !== null);
const plannedLines = (): unknown[][] => logSessionEventMock.mock.calls.filter((c) => c[0] === "candidate-first-look-view-planned");
/** The `observedUnion` of every `candidate-grid-frame-established` line written since the log mock was last cleared. */
function frameUnions(): AuthoritativeBbox[] {
  return logSessionEventMock.mock.calls
    .filter((c) => c[0] === "candidate-grid-frame-established")
    .map((c) => {
      const m = /observedUnion=\{xmin:([^,]+),ymin:([^,]+),xmax:([^,]+),ymax:([^}]+)\}/.exec(String(c[1]));
      if (!m) throw new Error(`no observedUnion in ${String(c[1])}`);
      return { xmin: Number(m[1]), ymin: Number(m[2]), xmax: Number(m[3]), ymax: Number(m[4]) };
    });
}
const coverOf = (p: Probe, box: AuthoritativeBbox): string[] =>
  tilesCoveringBbox(p.session.manager.gridFrame!, p.session.manager.activeLevel, box).map(tileKeyToString);

async function flush(): Promise<void> {
  for (let i = 0; i < 25; i++) await Promise.resolve();
}
function complete(handle: string): void {
  sinkFor(handle).onBatch(batch(DEGENERATE), true);
  sinkFor(handle).onTerminal(COMPLETED);
}

/** S step 1: look sh_1 delivers a batch, then Completed; the frame exists, and every tile of its plan completes. */
async function firstLookWithFrame(p: Probe): Promise<void> {
  await p.session.reissueUnrestricted(null, null);
  const mark = started().length;
  complete("sh_1");
  await flush();
  for (const handle of startedSince(mark)) complete(handle);
  expect(p.session.manager.gridFrame, "the first look froze the frame").not.toBeNull();
}

/** The common setup S: step 1; `reissueUnrestricted(null, null)` mints sh_2, which delivers a batch and stays running; then
 * `reissueUnrestricted(null, F)` with its mint held. `mark` counts the streams started by then. */
async function setupS(p: Probe) {
  const mint3 = deferred<{ stream: string }>();
  routeQueries(["sh_1", "sh_2", mint3]);
  await firstLookWithFrame(p);
  await p.session.reissueUnrestricted(null, null);
  sinkFor("sh_2").onBatch(batch(DEGENERATE), true);
  void p.session.reissueUnrestricted(null, F);
  await flush();
  return { mint3, mark: started().length };
}

beforeEach(() => {
  vi.useFakeTimers();
  logSessionEventMock.mockReset();
  cancelMock.mockReset().mockResolvedValue({ state: "requested" });
  dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
  startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("an earlier look inside the mint window is not read as current (§4)", () => {
  // M-1 fails it.
  it("MW1: the earlier look's Completed terminal inside the window plans nothing under the new filter", async () => {
    const p = start();
    await setupS(p);
    const apply = vi.mocked(p.canvas.applyTileViewportContext);
    apply.mockClear();
    viewportQueryMock.mockClear();
    logSessionEventMock.mockClear();

    sinkFor("sh_2").onTerminal(COMPLETED);
    await flush();

    expect(apply, "no plan reached the canvas").not.toHaveBeenCalled();
    expect(tileQueryCalls(), "no viewportQuery with a non-null bbox").toEqual([]);
    expect(plannedLines(), "no planned line").toEqual([]);
  });

  // M-1 fails it.
  it("MW2: after that terminal, the new look's own Completed terminal plans its fit view, once, under the new filter", async () => {
    const p = start();
    const s = await setupS(p);
    sinkFor("sh_2").onTerminal(COMPLETED);
    await flush();
    p.view.fitTo = PENDING_BOX;
    s.mint3.resolve({ stream: "sh_3" });
    await flush();
    sinkFor("sh_3").onBatch(batch(DEGENERATE), true);
    const apply = vi.mocked(p.canvas.applyTileViewportContext);
    apply.mockClear();
    viewportQueryMock.mockClear();

    sinkFor("sh_3").onTerminal(COMPLETED);
    await flush();

    expect(apply, "one plan at the new look's terminal").toHaveBeenCalledTimes(1);
    expect(apply.mock.calls[0][0], "of PENDING_BOX's cover").toEqual(coverOf(p, PENDING_BOX));
    expect(tileQueryCalls()).toHaveLength(coverOf(p, PENDING_BOX).length);
    for (const call of tileQueryCalls()) expect(call[4], "a tile query under the new filter").toBe(F);
  });

  // M-1 fails it.
  it("MW3: the status does not read complete for a view never asked for, and reads complete once the fit view's tiles end", async () => {
    const p = start();
    const s = await setupS(p);
    sinkFor("sh_2").onTerminal(COMPLETED);
    await flush();
    for (const handle of startedSince(s.mark, "sh_3")) complete(handle);
    await flush();
    p.view.fitTo = PENDING_BOX;
    s.mint3.resolve({ stream: "sh_3" });
    await flush();
    const afterMint = started().length;
    sinkFor("sh_3").onBatch(batch(DEGENERATE), true);
    sinkFor("sh_3").onTerminal(COMPLETED);
    await flush();

    expect(p.text(), "not the complete sentence at the new look's terminal").not.toBe(COMPLETE_TEXT);
    for (const handle of startedSince(afterMint)) complete(handle);
    await flush();
    expect(p.text(), "complete once PENDING_BOX's tiles end").toBe(COMPLETE_TEXT);
  });

  // M-2 fails it.
  it("MW4: a batch on the earlier look's sink before the mint is not ingested", async () => {
    const p = start();
    await setupS(p);
    const push = vi.mocked(p.canvas.pushTileBatch);
    push.mockClear();

    sinkFor("sh_2").onBatch(batch(DEGENERATE), true);

    expect(push.mock.calls.filter((c) => c[1] === "sh_2"), "sh_2's batch reached pushTileBatch").toEqual([]);
  });

  // M-1 fails it.
  it("MW5: the earlier look's failure inside the window emits no status; the new look's fill then settles complete", async () => {
    const p = start();
    const s = await setupS(p);
    const before = p.statusEvents.length;

    sinkFor("sh_2").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
    await flush();

    expect(p.statusEvents.slice(before), "no status event at the earlier look's terminal").toEqual([]);
    s.mint3.resolve({ stream: "sh_3" });
    await flush();
    const afterMint = started().length;
    sinkFor("sh_3").onBatch(batch(DEGENERATE), true);
    sinkFor("sh_3").onTerminal(COMPLETED);
    await flush();
    for (const handle of startedSince(afterMint)) complete(handle);
    await flush();
    expect(p.text()).toBe(COMPLETE_TEXT);
  });

  // M-3, M-4 and M-6 fail them.
  for (const [id, inOrder] of [
    ["(a)", true],
    ["(b)", false],
  ] as const) {
    it(`MW6 ${id}: with a frame, two reissues with both mints held, resolved ${inOrder ? "in order" : "out of order"}: the earlier look is superseded, cancelled and never started`, async () => {
      const p = start();
      const [m2, m3] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
      routeQueries(["sh_1", m2, m3]);
      await firstLookWithFrame(p);
      const first = p.session.reissueUnrestricted(null, F);
      void p.session.reissueUnrestricted(null, F2);
      await flush();
      const resolves = [() => m2.resolve({ stream: "sh_2" }), () => m3.resolve({ stream: "sh_3" })];
      for (const resolve of inOrder ? resolves : resolves.reverse()) {
        resolve();
        await flush();
      }

      expect(await first, "the first reissue's outcome").toEqual({ kind: "superseded" });
      expect(cancelMock).toHaveBeenCalledWith("sh_2");
      expect(started(), "no stream started for the superseded look").not.toContain("sh_2");
      const push = vi.mocked(p.canvas.pushTileBatch);
      push.mockClear();
      sinkFor("sh_3").onBatch(batch(DEGENERATE), true);
      expect(push.mock.calls.map((c) => c[1]), "the second look's batch is ingested").toEqual(["sh_3"]);
      const apply = vi.mocked(p.canvas.applyTileViewportContext);
      apply.mockClear();
      viewportQueryMock.mockClear();
      sinkFor("sh_3").onTerminal(COMPLETED);
      await flush();
      expect(apply, "its terminal plans").toHaveBeenCalledTimes(1);
      expect(tileQueryCalls().length).toBeGreaterThan(0);
      for (const call of tileQueryCalls()) expect(call[4], "a tile query under the second filter").toBe(F2);
    });
  }

  // M-3 and M-4 fail it.
  it("MW7: through App's applyFilter on the real session, two Applies with the mints resolved out of order commit only the second", async () => {
    const p = start();
    const [m2, m3] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    routeQueries(["sh_1", m2, m3]);
    await firstLookWithFrame(p);
    const deps = {
      requestViewport: p.session.reissueUnrestricted,
      cancelPendingDebounce: vi.fn(),
      getLastViewportBbox: () => null,
      getActiveFilter: () => null,
      commitActiveFilter: vi.fn(),
      resetFitForNewGeneration: vi.fn(),
    } satisfies ApplyFilterDeps;
    const first = applyFilter(F, deps);
    const second = applyFilter(F2, deps);
    await flush();
    m3.resolve({ stream: "sh_3" });
    await flush();
    m2.resolve({ stream: "sh_2" });
    await flush();

    expect(await first, "the superseded Apply").toEqual({ kind: "not-applied" });
    expect(await second).toEqual({ kind: "applied", streamHandle: "sh_3" });
    expect(deps.commitActiveFilter.mock.calls).toEqual([[F2]]);
    expect(deps.resetFitForNewGeneration, "the ApplyFilterDeps mock, not the canvas's").toHaveBeenCalledTimes(1);
  });
});

describe("an earlier look's terminal establishes no grid frame (Amendment 1 item 2.3, Amendment 2 item 3)", () => {
  // M-5 fails it.
  it("FE1 (a): without a frame, an earlier look's terminal after the new look's mint freezes no frame; the new look's own terminal freezes it on its own union", async () => {
    const p = start(null);
    routeQueries(["sh_1", "sh_2"]);
    await p.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    await p.session.reissueUnrestricted(null, F);
    sinkFor("sh_2").onBatch(batch(E2), true);

    sinkFor("sh_1").onTerminal(COMPLETED);

    expect(p.session.manager.gridFrame, "after sh_1's terminal, no frame").toBeNull();
    expect(p.canvas.establishTileGridContext).not.toHaveBeenCalled();
    expect(frameUnions(), "no frame line at sh_1's terminal").toEqual([]);
    sinkFor("sh_2").onBatch(batch(E3), true);
    sinkFor("sh_2").onTerminal(COMPLETED);
    expect(p.session.manager.gridFrame, "the new look's terminal froze the frame").not.toBeNull();
    expect(p.canvas.establishTileGridContext).toHaveBeenCalledTimes(1);
    expect(frameUnions()).toEqual([unionBbox(E2, E3)]);
  });

  // M-5 fails it.
  it("FE1 (b): with a frame, an orphan's terminal writes no frame line; the current look's own terminal writes the one line, and the frame never moves", async () => {
    const p = start(null);
    routeQueries(["sh_1", "sh_2", "sh_3"]);
    await p.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    sinkFor("sh_1").onTerminal(COMPLETED);
    const frame = p.session.manager.gridFrame;
    expect(frame, "sh_1 froze the frame").not.toBeNull();
    await p.session.reissueUnrestricted(null, F);
    sinkFor("sh_2").onBatch(batch(E2), true);
    await p.session.reissueUnrestricted(null, F2);
    sinkFor("sh_3").onBatch(batch(E3), true);
    logSessionEventMock.mockClear();
    const contexts = vi.mocked(p.canvas.establishTileGridContext).mock.calls.length;

    sinkFor("sh_2").onTerminal(COMPLETED);

    expect(frameUnions(), "sh_2's terminal writes no candidate-grid-frame-established line").toEqual([]);
    expect(p.canvas.establishTileGridContext, "no establishTileGridContext call added").toHaveBeenCalledTimes(contexts);
    expect(p.session.manager.gridFrame).toEqual(frame);
    sinkFor("sh_3").onBatch(batch(E4), true);
    sinkFor("sh_3").onTerminal(COMPLETED);
    expect(frameUnions()).toEqual([unionBbox(E3, E4)]);
    expect(p.session.manager.gridFrame).toEqual(frame);
  });

  // M-6 fails it.
  it("FE2: a look superseded at its mint is cancelled, never started, and has no terminal; the newer look freezes the frame on its own union", async () => {
    const p = start(null);
    const [ma, mb] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    routeQueries([ma, mb]);
    const first = p.session.reissueUnrestricted(null, null);
    void p.session.reissueUnrestricted(null, F);
    await flush();
    ma.resolve({ stream: "sh_a" });
    await flush();
    mb.resolve({ stream: "sh_b" });
    await flush();
    sinkFor("sh_b").onBatch(batch(E1), true);
    sinkFor("sh_b").onBatch(batch(E2), true);
    sinkFor("sh_b").onTerminal(COMPLETED);

    expect(await first, "the first look's outcome").toEqual({ kind: "superseded" });
    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    expect(startStreamMock.mock.calls.filter((c) => c[0].ticketHandle === "sh_a"), "no stream started for sh_a").toEqual([]);
    expect(frameUnions()).toEqual([unionBbox(E1, E2)]);
  });

  // Green at the base by design: it guards today's path. M-7 fails it.
  it("FE3: stop() during the bootstrap, with no later reissue begun, freezes the frame on the look's own union", async () => {
    const p = start(null);
    routeQueries(["sh_1"]);
    await p.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    sinkFor("sh_1").onBatch(batch(E2), true);
    await p.session.stop();

    sinkFor("sh_1").onTerminal({ kind: "Cancelled", detail: "" });

    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    expect(p.session.manager.gridFrame, "a frame exists").not.toBeNull();
    expect(p.canvas.establishTileGridContext).toHaveBeenCalledTimes(1);
    expect(frameUnions()).toEqual([unionBbox(E1, E2)]);
  });

  // The mutation that removes both §2.3 item 4's onBatch term and §2.3 item 7's conjunct fails it; either alone does not.
  it("FE3 (b): stop() inside a frameless mint window, after a reissue was held, freezes no frame from the earlier look's later batch", async () => {
    const p = start(null);
    routeQueries(["sh_1", deferred<{ stream: string }>()]);
    await p.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    void p.session.reissueUnrestricted(null, F);
    sinkFor("sh_1").onBatch(batch(E2), true);
    await p.session.stop();

    sinkFor("sh_1").onTerminal({ kind: "Cancelled", detail: "" });

    expect(p.session.manager.gridFrame, "no frame is established").toBeNull();
    expect(frameUnions(), "no candidate-grid-frame-established line").toEqual([]);
  });
});
