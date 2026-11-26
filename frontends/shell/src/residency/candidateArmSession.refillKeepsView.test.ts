// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * A Colour-by refill keeps the view (`governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md` §4 and its Amendment 2 items 2 and 3):
 * `reissueUnrestricted(bbox, filter, { keepCamera: true })` hands the option to the canvas's reset and changes nothing else in the reissue. Drives the REAL
 * `startCandidateArmSession` and `TileViewportStreamManager` against a fake canvas typed as `WorkingCanvasHandle`, with no cast; only the kernel's boundary is
 * mocked, with the mock set of `candidateArmSession.mintWindow.test.ts`, whose helpers this file copies (they are not exported there). A held mint is not used:
 * every mint here answers at once, and a terminal goes only to a stream `startStream` received.
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
import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { unionBbox } from "../canvas/extent";
import { tileKeyToString, tilesCoveringBbox } from "../canvas/tileGrid";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import type { Filter } from "../skp/types";
import type { StreamSink } from "../streaming/transport";
import { startCandidateArmSession } from "./candidateArmSession";
import { nextResidencyStatus } from "./residencyStatus";
import type { ResidencyStatus } from "./residencyStatus";

// The boxes are `candidateArmSession.mintWindow.test.ts`'s: SHOWN_BOX covers two cells of the frame a degenerate first look freezes, PENDING_BOX one other.
const SHOWN_BOX: AuthoritativeBbox = { xmin: -0.99, ymin: -0.99, xmax: -0.8, ymax: -0.9 };
const PENDING_BOX: AuthoritativeBbox = { xmin: -0.5, ymin: -0.5, xmax: -0.45, ymax: -0.45 };
const DEGENERATE: AuthoritativeBbox = { xmin: 0, ymin: 0, xmax: 0, ymax: 0 };
const E1: AuthoritativeBbox = { xmin: 0, ymin: 0, xmax: 10, ymax: 10 };
const E2: AuthoritativeBbox = { xmin: 20, ymin: 20, xmax: 30, ymax: 30 };
const EXTENTS = [DEGENERATE, E1, E2];
/** A batch's one byte names its extent, so the fake canvas can report the extent the real decode would. */
const batch = (extent: AuthoritativeBbox): Uint8Array => new Uint8Array([EXTENTS.indexOf(extent)]);

const FEATURES = 7;
const COMPLETED: Parameters<StreamSink["onTerminal"]>[0] = { kind: "Completed", detail: "" };
const F: Filter = { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" };
const KEEP = { keepCamera: true } as const;

/** The fake canvas. Each `pushTileBatch` reports `fitAnchor` as the union of the batch extents given since the last `resetFitForNewGeneration`, as the real
 * canvas does, and the reset clears it, whatever it is given. */
function fakeCanvas(shown: AuthoritativeBbox | null) {
  const complete = new Set<string>();
  const view = { shown };
  let anchor: AuthoritativeBbox | null = null;
  const isComplete = (tileKey: string): boolean => complete.has(tileKey);
  const canvas: WorkingCanvasHandle = {
    pushBatch: vi.fn(() => 0),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
    resetFitForNewGeneration: vi.fn((_options?: { keepCamera: true }) => {
      anchor = null;
    }),
    getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: FEATURES })),
    residentIdsStreamedUnder: vi.fn(() => new Set<bigint>()),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    pushTileBatch: vi.fn((_tileKey: string, _streamHandle: string, _batchSeq: number, ipcBytes: Uint8Array) => {
      const extent = EXTENTS[ipcBytes[0]];
      anchor = unionBbox(anchor, extent);
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

function start(shown: AuthoritativeBbox | null = SHOWN_BOX) {
  const { canvas, view } = fakeCanvas(shown);
  let status: ResidencyStatus | null = null;
  let scan: ScanState = { kind: "idle" };
  const session = startCandidateArmSession({
    dataset: "ds_x",
    crsUnit: "metre",
    canvas,
    columns: null,
    onResidencyStatusChange: (event) => {
      status = nextResidencyStatus(event, status);
    },
    applyScanEvent: (event) => {
      scan = nextScanState(scan, event);
    },
  });
  return { session, canvas, view };
}
type Probe = ReturnType<typeof start>;

/** The untiled look (bbox null) is answered by the next of `untiled`, at once, and never past the end; a tile query is answered at once as sh_t1, sh_t2, ... */
function routeQueries(untiled: string[]): void {
  let tiles = 0;
  viewportQueryMock.mockReset().mockImplementation((_dataset: string, bbox: unknown) => {
    if (bbox !== null) return Promise.resolve({ stream: `sh_t${++tiles}` });
    const answer = untiled.shift();
    return answer === undefined ? new Promise(() => {}) : Promise.resolve({ stream: answer });
  });
}

function sinkFor(handle: string): StreamSink {
  const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
  if (!call) throw new Error(`no stream started for ${handle}`);
  return call[0].sink as StreamSink;
}
const started = (): string[] => startStreamMock.mock.calls.map((c) => c[0].ticketHandle);
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

/** The first look sh_1 delivers a batch, then Completed: the frame exists, the Completed terminal plans the shown box (so `hasPlanned` is true), and every tile of that plan completes. */
async function firstLookWithPlan(p: Probe): Promise<void> {
  await p.session.reissueUnrestricted(null, null);
  const mark = started().length;
  complete("sh_1");
  await flush();
  for (const handle of started().slice(mark)) complete(handle);
  expect(p.session.manager.gridFrame, "the first look froze the frame").not.toBeNull();
  expect(plannedLines(), "the first look's terminal planned").toHaveLength(1);
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

describe("RK-S: a keep-camera reissue changes the canvas's reset and nothing else (colour-by-refill-keeps-the-view)", () => {
  // RECORDED MUTATION for "RK-S1: reissueUnrestricted with keepCamera calls the canvas reset once with it, and without it once with no keepCamera" (M-S1): in `reissueUnrestricted`
  // (candidateArmSession.ts) call `canvas?.resetFitForNewGeneration()` with no argument. Expected failure: the reset's argument is undefined.
  it("RK-S1: reissueUnrestricted with keepCamera calls the canvas reset once with it, and without it once with no keepCamera", async () => {
    const p = start();
    routeQueries(["sh_1", "sh_2"]);
    const reset = vi.mocked(p.canvas.resetFitForNewGeneration);
    await p.session.reissueUnrestricted(null, F, KEEP);
    expect(reset, "the reset, once").toHaveBeenCalledTimes(1);
    expect(reset.mock.calls[0], "with the option").toEqual([{ keepCamera: true }]);
    reset.mockClear();
    await p.session.reissueUnrestricted(null, F);
    expect(reset, "the reset, once").toHaveBeenCalledTimes(1);
    expect(reset.mock.calls[0][0], "without the option: no keepCamera").toBeUndefined();
  });

  // RECORDED MUTATION for "RK-S2: after a keep-camera refill with a frame and a plan already run, a Completed terminal plans the shown view under the new filter" (M-S2): in
  // `reissueUnrestricted` (candidateArmSession.ts) skip `hasPlanned = false` when `keepCamera` is passed. Expected failure: the terminal plans nothing.
  it("RK-S2: after a keep-camera refill with a frame and a plan already run, a Completed terminal plans the shown view under the new filter", async () => {
    const p = start();
    routeQueries(["sh_1", "sh_2"]);
    await firstLookWithPlan(p);
    p.view.shown = PENDING_BOX; // the camera stands elsewhere when the refill comes
    await p.session.reissueUnrestricted(null, F, KEEP);
    sinkFor("sh_2").onBatch(batch(DEGENERATE), true);
    const apply = vi.mocked(p.canvas.applyTileViewportContext);
    apply.mockClear();
    viewportQueryMock.mockClear();
    logSessionEventMock.mockClear();

    sinkFor("sh_2").onTerminal(COMPLETED);
    await flush();

    expect(plannedLines().map((c) => c[1]), "one planned line, the shown box").toEqual([`{xmin:${PENDING_BOX.xmin},ymin:${PENDING_BOX.ymin},xmax:${PENDING_BOX.xmax},ymax:${PENDING_BOX.ymax}}`]);
    expect(apply, "one plan at the refill's terminal").toHaveBeenCalledTimes(1);
    expect(apply.mock.calls[0][0], "of the shown box's cover").toEqual(coverOf(p, PENDING_BOX));
    expect(tileQueryCalls()).toHaveLength(coverOf(p, PENDING_BOX).length);
    for (const call of tileQueryCalls()) expect(call[4], "a tile query under the new filter").toBe(F);
  });

  // RECORDED MUTATION for "RK-S3: a frameless keep-camera refill freezes its frame on the new look's batches alone, and writes no frame line when it admitted none" (M-S3): in
  // `reissueUnrestricted` (candidateArmSession.ts) skip `latestUnionedExtent = null` when `keepCamera` is passed. Expected failure: part (b) writes a frame line from the earlier look's union.
  it("RK-S3: a frameless keep-camera refill freezes its frame on the new look's batches alone, and writes no frame line when it admitted none", async () => {
    // (a) the new look admits batch E2: the frame line's union is E2 alone, though the earlier look admitted E1 and its terminal was never delivered
    const a = start(null);
    routeQueries(["sh_1", "sh_2"]);
    await a.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    await a.session.reissueUnrestricted(null, F, KEEP);
    sinkFor("sh_2").onBatch(batch(E2), true);
    sinkFor("sh_2").onTerminal(COMPLETED);
    expect(frameUnions(), "(a) the new look's batch alone").toEqual([E2]);

    // (b) the new look admits nothing: no frame line, and no frame
    logSessionEventMock.mockClear();
    startStreamMock.mockClear();
    const b = start(null);
    routeQueries(["sh_1", "sh_2"]);
    await b.session.reissueUnrestricted(null, null);
    sinkFor("sh_1").onBatch(batch(E1), true);
    await b.session.reissueUnrestricted(null, F, KEEP);
    sinkFor("sh_2").onTerminal(COMPLETED);
    expect(frameUnions(), "(b) no frame line").toEqual([]);
    expect(b.session.manager.gridFrame, "(b) no frame").toBeNull();
    expect(b.canvas.establishTileGridContext, "(b) no grid context").not.toHaveBeenCalled();
  });
});
