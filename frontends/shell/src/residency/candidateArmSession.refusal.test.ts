// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The stream-refusal piece S1 (`governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`
 * §4): on the tiled arm, a refused tile or a failed first look never leaves the view without a status, and the scan ends.
 * Drives the REAL `startCandidateArmSession` and `TileViewportStreamManager`; the status is folded through
 * `nextResidencyStatus` and the scan through App's `nextScanState`, the way `App.tsx` folds them. Only the kernel's boundary
 * is mocked. A file of its own because `candidateArmSession.test.ts`'s client mock drops `SkpCallError`, which the manager
 * branches on (`instanceof`): here `../skp/client` keeps the real class, the pattern `tileViewportStreamManager.test.ts` uses.
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

import { nextScanState } from "../App";
import type { ScanState } from "../App";
import type { TileBatchIngestOutcome, WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { tileBbox } from "../canvas/tileGrid";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { SkpCallError } from "../skp/client";
import type { StreamSink, TerminalKind } from "../streaming/transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL } from "../testUtils/terminalShapes";
import { startCandidateArmSession } from "./candidateArmSession";
import { nextResidencyStatus, residencyStatusText } from "./residencyStatus";
import type { ResidencyStatus, ResidencyStatusEvent } from "./residencyStatus";

/** W1 and W2, the advisor's wording under the delegation (the form's §9), copied byte for byte from the form by script. */
const W1 = "The data for the map failed to load. Open the file again to retry.";
const W2 = "The data for this view failed to load. Pan or zoom to retry.";
/** The app's existing sentences, unchanged (`residencyStatus.ts`). */
const PARTIAL = "Filling has finished for this view — some areas were not loaded; pan or zoom to load them.";
const PARTIAL_FAILURE = "Filling has finished for this view, but part of this view failed to load; pan or zoom to retry.";
const OVER_BUDGET =
  "Showing 3 features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail.";
const SETTLED_SUFFIX = " Filling has finished for this view — the render budget is full; pan or zoom to see other areas.";

const DEGENERATE = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 };
const OK_INGEST: TileBatchIngestOutcome = {
  rowsAdmitted: 1,
  duplicatesDropped: 0,
  evictedTileKeys: [],
  overBudget: false,
  fitAnchor: DEGENERATE,
  batchExtent: null,
};

/** The probe's fake canvas: tile completeness follows `markTileComplete`, `clearTile` and `clearAllTiles`, as the real one's does. */
function fakeCanvas(overrides: Partial<WorkingCanvasHandle> = {}): WorkingCanvasHandle {
  const complete = new Set<string>();
  return {
    pushBatch: vi.fn(),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
    resetFitForNewGeneration: vi.fn(),
    getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 3 })),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    pushTileBatch: vi.fn(() => OK_INGEST),
    clearTile: vi.fn((k: string) => void complete.delete(k)),
    clearAllTiles: vi.fn(() => complete.clear()),
    residentIdsStreamedUnder: vi.fn(() => new Set<bigint>()),
    isTileResidentInCandidateSet: vi.fn(() => false),
    isTileCompleteInCandidateSet: vi.fn((k: string) => complete.has(k)),
    markTilePartial: vi.fn(),
    markTileComplete: vi.fn((k: string) => void complete.add(k)),
    markTileResidentEmpty: vi.fn(),
    establishTileGridContext: vi.fn(),
    applyTileViewportContext: vi.fn(() => true),
    ...overrides,
  };
}

function connectionsExhausted(): SkpCallError {
  return new SkpCallError({ code: "engine.connections_exhausted", message: "no admission lease was available", fields: { class: "admission", capacity: "4" } });
}

function sinkFor(handle: string): StreamSink {
  const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
  if (!call) throw new Error(`no stream started for ${handle}`);
  return call[0].sink as StreamSink;
}

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
type Ticket = ReturnType<typeof deferred<{ stream: string }>>;

async function flush(): Promise<void> {
  for (let i = 0; i < 25; i++) await Promise.resolve();
}

/** The inner half of a bbox, so that a view covers exactly the tiles it is built from. */
function inner(a: AuthoritativeBbox, b: AuthoritativeBbox = a): AuthoritativeBbox {
  const qx = (a.xmax - a.xmin) / 4;
  const qy = (a.ymax - a.ymin) / 4;
  return { xmin: a.xmin + qx, ymin: a.ymin + qy, xmax: b.xmax - qx, ymax: b.ymax - qy };
}

/** The session with App's three callbacks: the status folded from null, the scan folded from idle. */
function makeProbe(canvasOverrides: Partial<WorkingCanvasHandle> = {}) {
  const statusEvents: ResidencyStatusEvent[] = [];
  const scanEvents: Array<{ kind: string }> = [];
  let standing: ResidencyStatus | null = null;
  let scan: ScanState = { kind: "idle" };
  const session = startCandidateArmSession({
    dataset: "ds_x",
    crsUnit: "metre",
    canvas: fakeCanvas(canvasOverrides),
    columns: null,
    onResidencyStatusChange: (event) => {
      statusEvents.push(event);
      standing = nextResidencyStatus(event, standing);
    },
    applyScanEvent: (event) => {
      scanEvents.push(event);
      scan = nextScanState(scan, event);
    },
  });
  return {
    session,
    statusEvents,
    scanEvents,
    text: () => (standing === null ? null : residencyStatusText(standing)),
    scanKind: () => scan.kind,
    mark: () => ({ s: statusEvents.length, sc: scanEvents.length }),
  };
}
type Probe = ReturnType<typeof makeProbe>;

async function openFirstLook(p: Probe): Promise<void> {
  expect(await p.session.reissueUnrestricted(null, null)).toEqual({ kind: "issued", streamHandle: "sh_1" });
  sinkFor("sh_1").onBatch(new Uint8Array([1]), true);
  sinkFor("sh_1").onTerminal({ kind: "Completed", detail: "" });
  expect(p.session.manager.gridFrame).not.toBeNull();
}

function tile(p: Probe, row: number, col: number): AuthoritativeBbox {
  return tileBbox(p.session.manager.gridFrame!, p.session.manager.activeLevel, { row, col });
}

async function pan(p: Probe, view: AuthoritativeBbox): Promise<void> {
  p.session.onViewportChanged(view);
  await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
  await flush();
}

/** The tile queries answer in order: each item is a stream handle (resolved) or a deferred ticket; later ones never answer. */
function tileQueries(...answers: Array<string | Ticket>): void {
  viewportQueryMock.mockReset();
  for (const a of answers) {
    if (typeof a === "string") viewportQueryMock.mockResolvedValueOnce({ stream: a });
    else viewportQueryMock.mockImplementationOnce(() => a.promise);
  }
  viewportQueryMock.mockImplementation(() => new Promise(() => {}));
}

/** Refuses the tile's first request and its one retry; the map asks again once in between. */
async function refuseTwice(first: Ticket, second: Ticket, callsBefore: number): Promise<void> {
  first.reject(connectionsExhausted());
  await flush();
  expect(viewportQueryMock).toHaveBeenCalledTimes(callsBefore + 1);
  second.reject(connectionsExhausted());
  await flush();
}

function complete(handle: string): void {
  sinkFor(handle).onBatch(new Uint8Array([2]), true);
  sinkFor(handle).onTerminal({ kind: "Completed", detail: "" });
}

beforeEach(() => {
  vi.useFakeTimers();
  logSessionEventMock.mockReset();
  viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
  cancelMock.mockReset().mockResolvedValue({ state: "requested" });
  dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
  startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
});

afterEach(() => {
  vi.useRealTimers();
});

const WITHIN_PARTIAL: ResidencyStatusEvent = { kind: "candidate-within-budget", residentFeatureCount: 3, settled: "partial" };

describe("case A: the last tracked tile dropped after its second refusal", () => {
  it("SR-A1: the only tracked tile, refused twice: the bar settles to the partial sentence and the scan ends", async () => {
    const p = makeProbe();
    await openFirstLook(p);
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries(first, second);
    await pan(p, inner(tile(p, 0, 0)));
    expect(p.session.manager.trackedTileCount).toBe(1);
    expect(p.scanKind()).toBe("issuing");
    const mark = p.mark();

    await refuseTwice(first, second, 1);

    expect(p.session.manager.trackedTileCount).toBe(0);
    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-A2: three tiles, the refused one the last tracked: the same", async () => {
    const p = makeProbe();
    await openFirstLook(p);
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries("sh_t00", "sh_t01", first, second);
    await pan(p, inner(tile(p, 0, 0), tile(p, 0, 2)));
    complete("sh_t00");
    complete("sh_t01");
    expect(p.session.manager.trackedTileCount).toBe(1);
    const mark = p.mark();

    await refuseTwice(first, second, 3);

    expect(p.session.manager.trackedTileCount).toBe(0);
    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-A3: after a stale over-budget sentence from the first look: the partial sentence replaces it and the scan ends", async () => {
    const p = makeProbe({ pushTileBatch: vi.fn().mockReturnValueOnce({ ...OK_INGEST, overBudget: true }).mockReturnValue(OK_INGEST) });
    await openFirstLook(p);
    expect(p.text()).toBe(OVER_BUDGET);
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries(first, second);
    await pan(p, inner(tile(p, 0, 0)));
    expect(p.text()).toBe(OVER_BUDGET); // stands through the plan: the node's notes, not this piece

    await refuseTwice(first, second, 1);

    expect(p.session.manager.overBudget).toBe(false); // P-A3: the drop's emit runs with overBudget false
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-A4: after a settled view, a pan to one tile refused twice: the same", async () => {
    const p = makeProbe();
    await openFirstLook(p);
    tileQueries("sh_t00");
    await pan(p, inner(tile(p, 0, 0)));
    complete("sh_t00");
    expect(p.text()).toBe("Showing all 3 features in view");
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries(first, second);
    await pan(p, inner(tile(p, 0, 5)));
    expect(p.session.manager.trackedTileCount).toBe(1);
    const mark = p.mark();

    await refuseTwice(first, second, 1);

    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-A-control: the refused tile dropped while two are in flight: nothing at the drop, the partial sentence at the last terminal", async () => {
    const p = makeProbe();
    await openFirstLook(p);
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries("sh_t00", "sh_t01", first, second);
    await pan(p, inner(tile(p, 0, 0), tile(p, 0, 2)));
    const mark = p.mark();

    await refuseTwice(first, second, 3);
    expect(p.session.manager.trackedTileCount).toBe(2);
    expect(p.statusEvents.slice(mark.s)).toEqual([]);
    complete("sh_t00");
    complete("sh_t01");

    expect(p.statusEvents.slice(mark.s)).toEqual([WITHIN_PARTIAL]);
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanEvents.slice(mark.sc)).toEqual([{ kind: "reset" }]);
    expect(p.scanKind()).toBe("idle");
  });
});

describe("case C: a view partly over the render budget, with one tile in it refused", () => {
  const overBudgetAt00 = () =>
    vi.fn((tileKey: string) => (tileKey === "0:0" ? { ...OK_INGEST, overBudget: true } : OK_INGEST)) as unknown as WorkingCanvasHandle["pushTileBatch"];

  it("SR-C: control: 0:2 refused twice before the budget fills; the view settles over budget, and the bar does not name the refusal", async () => {
    const p = makeProbe({ pushTileBatch: overBudgetAt00() });
    await openFirstLook(p);
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    tileQueries("sh_t00", "sh_t01", first, second);
    await pan(p, inner(tile(p, 0, 0), tile(p, 0, 2)));

    await refuseTwice(first, second, 3);
    expect(p.session.manager.trackedTileCount).toBe(2);
    sinkFor("sh_t00").onBatch(new Uint8Array([2]), true); // over budget: the manager self-cancels 0:0
    await flush();
    complete("sh_t01");
    await flush();

    expect(p.session.manager.trackedTileCount).toBe(0);
    expect(p.text()).toBe(`${OVER_BUDGET}${SETTLED_SUFFIX}`);
    expect(p.text()).not.toMatch(/refus|connections|failed/i); // S2's case
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-C2: the over-budget batch before 0:2's refusal: the tile is dropped, not queued, and the view settles", async () => {
    const p = makeProbe({ pushTileBatch: overBudgetAt00() });
    await openFirstLook(p);
    const first = deferred<{ stream: string }>();
    tileQueries("sh_t00", "sh_t01", first);
    await pan(p, inner(tile(p, 0, 0), tile(p, 0, 2)));
    sinkFor("sh_t00").onBatch(new Uint8Array([2]), true);
    await flush();
    first.reject(connectionsExhausted());
    await flush();
    expect(viewportQueryMock).toHaveBeenCalledTimes(3); // no retry is asked for while over budget
    complete("sh_t01");
    await flush();

    expect(p.session.manager.trackedTileCount).toBe(0);
    expect(p.session.manager.queuedCount).toBe(0);
    expect(p.scanKind()).toBe("idle");
    expect(p.text()).toBe(`${OVER_BUDGET}${SETTLED_SUFFIX}`);
  });
});

describe("case B: the first look fails before any plan", () => {
  it.each(["ProducerFailed", "TransportFailed"] as const)(
    "SR-B2-open (%s): at open, before any batch: W1, the scan ends, and a pan asks for nothing and leaves W1",
    async (kind: TerminalKind) => {
      const p = makeProbe();
      await p.session.reissueUnrestricted(null, null);
      const mark = p.mark();
      sinkFor("sh_1").onTerminal({ kind, detail: "engine.stream_failed" });
      await flush();

      expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-first-look-failed", frame: false });
      expect(p.text()).toBe(W1);
      expect(p.scanKind()).toBe("idle");
      const calls = viewportQueryMock.mock.calls.length;
      await pan(p, { xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      expect(viewportQueryMock.mock.calls.length).toBe(calls);
      expect(p.text()).toBe(W1);
    }
  );

  it("SR-B2-apply: an Apply's first look fails before any batch: W2; a pan's fill starts by clearing it", async () => {
    const p = makeProbe();
    await openFirstLook(p);
    tileQueries("sh_t00");
    await pan(p, inner(tile(p, 0, 0)));
    complete("sh_t00");
    tileQueries("sh_apply");
    await p.session.reissueUnrestricted(null, { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" });
    const mark = p.mark();
    sinkFor("sh_apply").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
    await flush();

    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-first-look-failed", frame: true });
    expect(p.text()).toBe(W2);
    expect(p.scanKind()).toBe("idle");
    const panMark = p.mark();
    const calls = viewportQueryMock.mock.calls.length;
    await pan(p, inner(tile(p, 0, 0)));
    expect(viewportQueryMock.mock.calls.length).toBe(calls + 1); // the frame survived the Apply: the pan plans
    expect(p.statusEvents.slice(panMark.s)[0]).toEqual({ kind: "candidate-fill-progress" });
    expect(p.text()).toBeNull(); // W2 does not stand through the fill it started
  });

  it("SR-B3: a first look failing after rows, before any plan: the failure sentence, and the scan ends", async () => {
    const p = makeProbe();
    await p.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(new Uint8Array([1]), true);
    const mark = p.mark();
    sinkFor("sh_1").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
    await flush();

    expect(p.session.manager.gridFrame).not.toBeNull();
    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "partial-failure" });
    expect(p.text()).toBe(PARTIAL_FAILURE);
    expect(p.scanKind()).toBe("idle");
  });

  it("SR-B-guard: a self-cancelled, a session-ended and a superseded first-look terminal each emit no candidate-first-look-failed", async () => {
    const failedAfter = (p: Probe, s: number) => p.statusEvents.slice(s).filter((e) => e.kind === "candidate-first-look-failed");

    // Self-cancelled: an Apply's first look cancelled by the relief lever while a frame exists.
    const a = makeProbe();
    await openFirstLook(a);
    tileQueries("sh_apply");
    await a.session.reissueUnrestricted(null, null);
    a.session.relinquishFill();
    const aMark = a.mark();
    sinkFor("sh_apply").onTerminal({ kind: "Cancelled", detail: "" });
    await flush();
    expect(failedAfter(a, aMark.s)).toEqual([]);

    // Session-ended: the source changed under the first look.
    const b = makeProbe();
    tileQueries("sh_b");
    await b.session.reissueUnrestricted(null, null);
    const bMark = b.mark();
    sinkFor("sh_b").onTerminal({ kind: "ProducerFailed", detail: REAL_SOURCE_CHANGED_TERMINAL_DETAIL });
    await flush();
    expect(failedAfter(b, bMark.s)).toEqual([]);

    // Superseded: an earlier first look's late failure, after a later one was issued.
    const c = makeProbe();
    tileQueries("sh_old", "sh_new");
    await c.session.reissueUnrestricted(null, null);
    await c.session.reissueUnrestricted(null, null);
    const cMark = c.mark();
    sinkFor("sh_old").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
    await flush();
    expect(failedAfter(c, cMark.s)).toEqual([]);
  });
});

// C-1 of both gates (the form's Amendment 2, items 2, 4 and 5; the reviewer's probes G330R-SIB, G330R-PRE and G330R-CTL): the
// tile ends while an Apply's first look still runs, so the view can settle only at that look's `Completed` terminal, after a plan.
// Each mutation below narrows the fix's condition so that it skips the one settled state its test reaches.
describe("case A-apply: the tile ends while an Apply's first look runs, then the look completes", () => {
  /** Open; a pan to 0:0 that settles; an Apply; a pan to 0:0 during its first look, its tile query answered by `answers`. */
  async function panDuringApply(p: Probe, ...answers: Array<string | Ticket>) {
    await openFirstLook(p);
    tileQueries("sh_t00");
    await pan(p, inner(tile(p, 0, 0)));
    complete("sh_t00");
    tileQueries("sh_apply", ...answers);
    await p.session.reissueUnrestricted(null, null);
    const mark = p.mark();
    await pan(p, inner(tile(p, 0, 0)));
    return mark;
  }
  async function lookCompletes(): Promise<void> {
    sinkFor("sh_apply").onBatch(new Uint8Array([1]), true);
    sinkFor("sh_apply").onTerminal({ kind: "Completed", detail: "" });
    await flush();
  }

  // Mutation M-C1a: the fix skips a view that settles partial (`(hasPlanned && currentSettledState() !== "settled-partial")`
  // in its condition). Expected failure: no status event after the mark, so the first status assertion reads undefined.
  it("SR-A-apply-refused: the only tracked tile refused twice during the look, which then completes: the partial sentence, and the scan ends", async () => {
    const p = makeProbe();
    const [first, second] = [deferred<{ stream: string }>(), deferred<{ stream: string }>()];
    const mark = await panDuringApply(p, first, second);
    expect(p.session.manager.trackedTileCount).toBe(1);
    await refuseTwice(first, second, 2);
    expect(p.session.manager.trackedTileCount).toBe(0);
    await lookCompletes();

    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual(WITHIN_PARTIAL);
    expect(p.text()).toBe(PARTIAL);
    expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });
    expect(p.scanKind()).toBe("idle");
  });

  // Mutation M-C1b: the fix skips a view that settles with a failure (`... !== "settled-partial-failure"`). Expected failure:
  // no status event after the mark, so the first status assertion reads undefined.
  it("SR-A-apply-failed: the tile's stream ends ProducerFailed during the look, which then completes: the failure sentence, and the scan ends", async () => {
    const p = makeProbe();
    const mark = await panDuringApply(p, "sh_t00b");
    sinkFor("sh_t00b").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
    await flush();
    expect(p.session.manager.trackedTileCount).toBe(0);
    await lookCompletes();

    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "partial-failure" });
    expect(p.text()).toBe(PARTIAL_FAILURE);
    expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });
    expect(p.scanKind()).toBe("idle");
  });

  // Amendment 2 item 4's success case. Mutation M-C1c: the fix skips a view that settles complete (`... !== "settled-complete"`).
  // Expected failure: no status event after the mark, so the first status assertion reads undefined.
  it("SR-A-apply-success: the tile completes during the look, which then completes: the settled sentence, and the scan ends", async () => {
    const p = makeProbe();
    const mark = await panDuringApply(p, "sh_t00b");
    complete("sh_t00b");
    expect(p.session.manager.trackedTileCount).toBe(0);
    await lookCompletes();

    expect(p.statusEvents.slice(mark.s).at(-1)).toEqual({ kind: "candidate-within-budget", residentFeatureCount: 3, settled: "complete" });
    expect(p.text()).toBe("Showing all 3 features in view");
    expect(p.scanEvents.slice(mark.sc).at(-1)).toEqual({ kind: "reset" });
    expect(p.scanKind()).toBe("idle");
  });
});
