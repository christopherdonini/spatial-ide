// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { COORDINATE_SYSTEM, Deck, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { loadPickSet, type PickSet } from "./p1-loader";
import { OffsetFrame, offsetPositions, recenterThresholdForBudget } from "./offset-frame";

// M3 — picking accuracy. The metric is defined in the README section
// "M3 metric definition (written before measuring)", recorded there before
// this harness existed. In short:
//
//   picking error = |returned f64 coordinate − true f64 coordinate of the
//                    *intended* feature|,  intended = nearest to the click
//
// so < 1 cm tests id-resolution correctness plus f64 round-trip exactness,
// NOT sub-pixel unprojection (1 cm is 0.076 px at 1:500 — unrecoverable
// per-pixel by construction). Hence ADR-003's prescribed path: GPU pick
// yields an integer index, and the coordinate is *looked up* in f64
// host-side rather than reconstructed from the cursor.

// Same 1:500 basis as M2 (src/m2-precision.ts). Duplicated rather than
// imported so that reading M2's committed numbers never depends on a module
// M3 might change.
const SCALE_DENOMINATOR = 500;
const M_PER_PX = (SCALE_DENOMINATOR * 0.0254) / 96;
const PX_PER_M = 1 / M_PER_PX;
const ZOOM = Math.log2(PX_PER_M);
const TARGET_DELTA_E = -4.937;
const TARGET_DELTA_N = 3.121;
const RECENTER_BUDGET_PX = 0.1;

const BUDGET_ERROR_M = 0.01;
const CAPTURE_TIMEOUT_MS = 5000;

/**
 * Feature radius for the isolated-probe classes. 3 px means a 1-3 px offset
 * click straddles the disc edge rather than landing well inside a huge target.
 *
 * Note this does *not* make class (b) a nearest-feature test: the probes are
 * 206.5 km apart, so there is no competitor to lose to. It tests near-miss
 * resolution. Only class (c) puts discrimination under real pressure.
 */
const FEATURE_RADIUS_PX = 3;
const PICK_RADIUS_PX = 4;

/**
 * Class (c) uses a deliberately small footprint. Discrimination between two
 * features cannot possibly beat their rendered size — with a big disc the
 * nearer feature is simply occluded and the answer would measure the radius
 * this harness chose rather than anything about the coordinate pipeline.
 * At 1 px the reported separation is governed by the pixel grid instead.
 */
const PAIR_FEATURE_RADIUS_PX = 1;
const SEPARATIONS_MM = [100, 150, 200, 300, 500, 800, 1200, 2000, 3000];

const OFFSET_STEPS_PX = [1, 2, 3];
const OFFSET_DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const LOCATION_NAMES = ["SW corner", "SE corner", "NW corner", "NE corner", "centre"];

function setStatus(s: string) {
  const el = document.querySelector<HTMLParagraphElement>("#m3-status");
  if (el) el.textContent = s;
}

function appendLog(line: string) {
  const el = document.querySelector<HTMLPreElement>("#m3-log");
  if (el) el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
  console.log("[M3]", line);
}

interface PickOutcome {
  clickClass: string;
  location: string;
  intendedIndex: number;
  returnedIndex: number | null;
  idCorrect: boolean;
  /** Returned coordinate === stored source coordinate at the returned index. */
  roundTripBitExact: boolean;
  /** The metric: distance from returned coordinate to the intended feature. */
  errorM: number;
}

/**
 * Worst *finite* error plus an explicit count of clicks that produced no
 * measurement.
 *
 * `JSON.stringify` renders NaN and Infinity as `null`, so a plain
 * `Math.max(...)` over a partly-failed run serialises as `"worstErrorM": null`
 * next to `"valid": true` — which reads as "no error" and means
 * "catastrophic". That is exactly the corruption `resolve_by_id` refuses to
 * emit on the Rust side, and the JS side of the same commit should not
 * reintroduce it.
 */
function summariseErrors(outcomes: PickOutcome[]): { worstErrorM: number | null; failedClicks: number } {
  const finite = outcomes.map((o) => o.errorM).filter((v) => Number.isFinite(v));
  return {
    worstErrorM: finite.length ? Math.max(...finite) : null,
    failedClicks: outcomes.length - finite.length,
  };
}

interface M3Report {
  timestamp: string;
  valid: boolean;
  invalidReasons: string[];
  metric: string;
  budgetM: number;
  scale: { denominator: number; metresPerPixel: number; pixelsPerMetre: number };
  framebuffer: { width: number; height: number };
  failures: {
    settleTimeouts: number;
    resolveRejections: number;
    framebufferChanged: boolean;
  };
  classA: {
    clicks: number;
    idCorrect: number;
    roundTripBitExact: number;
    worstErrorM: number | null;
    failedClicks: number;
    pickRadiusPx: number;
    outcomes: PickOutcome[];
  };
  classB: {
    clicks: number;
    idCorrect: number;
    roundTripBitExact: number;
    worstErrorM: number | null;
    failedClicks: number;
    offsetsPx: number[];
    featureRadiusPx: number;
    pickRadiusPx: number;
    note: string;
  };
  idIndirection: {
    ordinalDivergedFromId: boolean;
    discriminatingProbes: number;
    totalProbes: number;
    note: string;
  };
  classC: {
    featureRadiusPx: number;
    pickRadiusPx: number;
    phases: number[];
    sweep: Array<{
      axis: string;
      separationM: number;
      separationPx: number;
      clicks: number;
      idCorrect: number;
      pickedNothing: number;
      roundTripBitExact: number;
      reliable: boolean;
      bothMembersEverReturned: boolean;
      minMembersSeenPerPair: number;
    }>;
    reliableFromSeparationPx: number | null;
    reliableFromSeparationM: number | null;
    note: string;
  };
  unprojectionControl: {
    sampled: number;
    rawCoordinateIsLocalFrame: boolean;
    exampleRawLocalCoordinate: number[] | null;
    /** (i) The local-frame value taken at face value — a frame error. */
    worstFrameErrorM: number;
    /** (ii) What remains after restoring the origin, dead-centre clicks only. */
    worstResidualDeadCentreM: number;
    /** Same, for the deliberately 1-3 px offset clicks — cursor, not feature. */
    worstResidualOffsetClicksM: number;
    wrongCrsTagSeen: boolean;
    note: string;
  };
  latency: string;
  f32Audit: string;
}

export async function runM3(): Promise<void> {
  setStatus("M3: loading pick datasets...");
  const centres = await loadPickSet("centres");
  if (centres.e.length !== LOCATION_NAMES.length) {
    throw new Error(`M3: expected ${LOCATION_NAMES.length} centres, got ${centres.e.length}`);
  }

  const canvas = document.querySelector<HTMLCanvasElement>("#deck-canvas");
  if (!canvas) throw new Error("missing #deck-canvas");

  let fbW = 0;
  let fbH = 0;
  let renderResolve: (() => void) | null = null;
  let skipFrames = 0;
  // Pinned once known. Every predicted click position depends on these, so a
  // mid-run resize silently moves every click and the class (c) curve moves
  // with it — M2's gate catches exactly this and M3 must not regress on it.
  let pinnedW = 0;
  let pinnedH = 0;
  let framebufferChanged = false;
  /**
   * Failures that would otherwise reach only the console. A settle timeout
   * means picking against a stale layer whose features are 200+ km off-screen;
   * class (a) would catch that by picking nothing, but class (c) would just
   * record a 0/40 cell and quietly corrupt the discrimination finding.
   */
  let settleTimeouts = 0;
  let resolveRejections = 0;

  const deck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho", flipY: false }),
    viewState: { target: [0, 0, 0], zoom: ZOOM },
    controller: false,
    useDevicePixels: false,
    _animate: true,
    layers: [],
    onAfterRender: () => {
      fbW = canvas.clientWidth;
      fbH = canvas.clientHeight;
      if (pinnedW && (fbW !== pinnedW || fbH !== pinnedH)) framebufferChanged = true;
      if (!renderResolve) return;
      if (skipFrames > 0) {
        skipFrames--;
        return;
      }
      const r = renderResolve;
      renderResolve = null;
      r();
    },
  });

  /** Applies props and resolves once a frame reflecting them has been drawn. */
  function renderSettled(props: Record<string, unknown>): Promise<void> {
    return new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      renderResolve = finish;
      skipFrames = 1;
      deck.setProps(props);
      const timer = setTimeout(() => {
        if (renderResolve === finish) renderResolve = null;
        settleTimeouts++;
        console.warn("[M3] render settle timed out");
        finish();
      }, CAPTURE_TIMEOUT_MS);
    });
  }

  await renderSettled({ layers: [] });
  if (!fbW || !fbH) throw new Error("M3: no framebuffer size");
  pinnedW = fbW;
  pinnedH = fbH;
  appendLog(`framebuffer ${fbW}x${fbH}, ${M_PER_PX.toFixed(6)} m/px`);

  const frame = new OffsetFrame(recenterThresholdForBudget(PX_PER_M, RECENTER_BUDGET_PX));

  function pointLayer(id: string, positions: Float32Array, count: number, radiusPx: number) {
    return new ScatterplotLayer({
      id,
      data: { length: count, attributes: { getPosition: { value: positions, size: 2 } } },
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      pickable: true,
      radiusUnits: "pixels",
      getRadius: radiusPx,
      radiusMinPixels: 0,
      radiusMaxPixels: 1000,
      getFillColor: [255, 255, 255],
    });
  }

  /**
   * Predicted framebuffer position (y-up from bottom-left) of an absolute f64
   * coordinate, computed in f64 independently of deck.gl — same basis as M2.
   */
  function predictFb(worldE: number, worldN: number, targetE: number, targetN: number) {
    return [fbW / 2 + PX_PER_M * (worldE - targetE), fbH / 2 + PX_PER_M * (worldN - targetN)];
  }

  /** Framebuffer (y-up, continuous) -> deck.gl pick coords (y-down, integer). */
  function toPickXY(fbX: number, fbY: number): [number, number] {
    return [Math.floor(fbX), Math.floor(fbH - fbY)];
  }

  let unprojectSamples = 0;
  let rawCoordinateIsLocalFrame = false;
  let exampleRawLocalCoordinate: number[] | null = null;
  /** (i) Error of the raw local-frame value read as if it were EPSG:2056. */
  let worstFrameErrorM = 0;
  /**
   * (ii) Residual once the origin is added back.
   *
   * Split by click class deliberately. Class (b) clicks are offset from the
   * feature by 1-3 px *on purpose*, so unprojecting them recovers the cursor,
   * not the feature — including those would inflate the figure with the
   * harness's own offsets and let a "the user clicked 3 px off" term
   * masquerade as "unprojection is pixel-limited". Only dead-centre clicks
   * isolate the pixel-resolution term.
   */
  let worstResidualDeadCentreM = 0;
  let worstResidualOffsetClicksM = 0;
  let wrongCrsTagSeen = false;

  /**
   * One synthetic click. Reads the id at the picked buffer ordinal, resolves
   * that *id* host-side, and measures against the intended feature's f64.
   */
  async function click(
    clickClass: string,
    location: string,
    dataset: "centres" | "pairs",
    sepMm: number,
    axis: "e" | "n" | "d",
    source: PickSet,
    intendedOrdinal: number,
    pickX: number,
    pickY: number,
    pickRadius: number,
    originE: number,
    originN: number,
  ): Promise<PickOutcome> {
    const info = await deck.pickObjectAsync({ x: pickX, y: pickY, radius: pickRadius });
    const returnedOrdinal = info && info.index >= 0 ? info.index : null;

    // Negative control, recorded as a diagnostic rather than used as the
    // measurement. deck.gl's info.coordinate unprojects the cursor through
    // the viewport, and under offset-relative rendering the viewport itself
    // is in the local frame — so the value is metres from a renderer-internal
    // origin while being shaped exactly like a coordinate. Two distinct
    // failures live here and conflating them would make a *type* error look
    // like a rounding error.
    if (info?.coordinate) {
      unprojectSamples++;
      if (exampleRawLocalCoordinate === null) exampleRawLocalCoordinate = [...info.coordinate];
      // A real EPSG:2056 easting is ~2.6e6; a local-frame one is metres.
      if (Math.abs(info.coordinate[0]) < 1e5) rawCoordinateIsLocalFrame = true;
      const localE = info.coordinate[0];
      const localN = info.coordinate[1];
      // (i) taken at face value, as a naive caller would.
      worstFrameErrorM = Math.max(
        worstFrameErrorM,
        Math.hypot(localE - source.e[intendedOrdinal], localN - source.n[intendedOrdinal]),
      );
      // (ii) after correctly restoring the frame — what is left is the
      // pixel-resolution limit, which still cannot reach 1 cm.
      const residual = Math.hypot(
        localE + originE - source.e[intendedOrdinal],
        localN + originN - source.n[intendedOrdinal],
      );
      if (clickClass.startsWith("b-offset")) {
        worstResidualOffsetClicksM = Math.max(worstResidualOffsetClicksM, residual);
      } else {
        worstResidualDeadCentreM = Math.max(worstResidualDeadCentreM, residual);
      }
    }

    const base = { clickClass, location, intendedIndex: intendedOrdinal };
    if (returnedOrdinal === null) {
      return { ...base, returnedIndex: null, idCorrect: false, roundTripBitExact: false, errorM: NaN };
    }

    // The ordinal is renderer-internal. What crosses the boundary is the id.
    const returnedId = source.ids[returnedOrdinal];
    const intendedId = source.ids[intendedOrdinal];
    let resolved: { crs: string; e: number; n: number };
    try {
      resolved = await invoke<{ crs: string; e: number; n: number }>("resolve_pick", {
        dataset,
        sepMm,
        axis,
        id: Number(returnedId),
      });
    } catch (err) {
      resolveRejections++;
      appendLog(`resolve_pick rejected for id ${returnedId}: ${err}`);
      return { ...base, returnedIndex: returnedOrdinal, idCorrect: false, roundTripBitExact: false, errorM: NaN };
    }
    if (resolved.crs !== "EPSG:2056") wrongCrsTagSeen = true;

    // Strict equality on f64 is bitwise equality here (no NaN, no -0), so
    // this asserts the transport lost nothing rather than that it was close.
    const roundTripBitExact =
      resolved.e === source.e[returnedOrdinal] && resolved.n === source.n[returnedOrdinal];
    const errorM = Math.hypot(
      resolved.e - source.e[intendedOrdinal],
      resolved.n - source.n[intendedOrdinal],
    );

    return {
      ...base,
      returnedIndex: returnedOrdinal,
      idCorrect: returnedId === intendedId,
      roundTripBitExact,
      errorM,
    };
  }

  // ---- Class (a): dead-centre clicks on isolated features ---------------
  // Run twice: once with buffer order == id order, once with the buffer
  // deliberately reversed. The second pass is the one that matters — it is
  // the only thing distinguishing "resolve the id" from the identity function
  // `dataset[i] == dataset[i]`, which would pass in any CRS at any zoom.
  const classAOutcomes: PickOutcome[] = [];
  const shuffledCentres = await loadPickSet("centres", { shuffle: true });
  let ordinalDivergedFromId = false;
  // Counted, not just flagged: reversing a 5-element array leaves the middle
  // element a fixed point, so only 4 of 5 probes actually discriminate. That
  // is a fact about the data and belongs in the artifact rather than being
  // re-derived by a reader.
  let discriminatingProbes = 0;
  for (let i = 0; i < shuffledCentres.ids.length; i++) {
    if (Number(shuffledCentres.ids[i]) !== i) discriminatingProbes++;
  }
  for (const [pass, set] of [
    ["natural", centres],
    ["shuffled", shuffledCentres],
  ] as Array<[string, PickSet]>) {
    for (let li = 0; li < LOCATION_NAMES.length; li++) {
      // In the shuffled pass the probe at buffer ordinal `li` is a different
      // feature, so drive the view from the buffer's own values.
      setStatus(`M3 (a) dead-centre [${pass}]: ordinal ${li}`);
      const targetE = set.e[li] + TARGET_DELTA_E;
      const targetN = set.n[li] + TARGET_DELTA_N;
      frame.maybeRecenter(targetE, targetN);
      const originE = frame.originE;
      const originN = frame.originN;
      if (Number(set.ids[li]) !== li) ordinalDivergedFromId = true;
      const positions = offsetPositions(set.e, set.n, originE, originN);
      await renderSettled({
        layers: [pointLayer(`m3-a-${pass}-${li}`, positions, set.e.length, FEATURE_RADIUS_PX)],
        viewState: { target: [targetE - originE, targetN - originN, 0], zoom: ZOOM },
      });
      const [fx, fy] = predictFb(set.e[li], set.n[li], targetE, targetN);
      const [px, py] = toPickXY(fx, fy);
      classAOutcomes.push(
        await click(`a-dead-centre-${pass}`, `ordinal ${li}`, "centres", 100, "e", set, li, px, py, 0, originE, originN),
      );
    }
  }
  const aIdCorrect = classAOutcomes.filter((o) => o.idCorrect).length;
  const aBitExact = classAOutcomes.filter((o) => o.roundTripBitExact).length;
  const aSummary = summariseErrors(classAOutcomes);
  appendLog(
    `(a) dead-centre: ${aIdCorrect}/${classAOutcomes.length} correct id, ${aBitExact} bit-exact, ` +
      `worst error ${aSummary.worstErrorM} m, ${aSummary.failedClicks} failed`,
  );

  // ---- Class (b): clicks offset by 1-3 px -------------------------------
  // Run against the *shuffled* set too, so the id indirection is exercised by
  // 60 more clicks rather than only by class (a)'s second pass.
  const classBOutcomes: PickOutcome[] = [];
  const bSet = shuffledCentres;
  for (let li = 0; li < LOCATION_NAMES.length; li++) {
    setStatus(`M3 (b) offset clicks: ordinal ${li}`);
    const targetE = bSet.e[li] + TARGET_DELTA_E;
    const targetN = bSet.n[li] + TARGET_DELTA_N;
    frame.maybeRecenter(targetE, targetN);
    const originE = frame.originE;
    const originN = frame.originN;
    const positions = offsetPositions(bSet.e, bSet.n, originE, originN);
    await renderSettled({
      layers: [pointLayer(`m3-b-${li}`, positions, bSet.e.length, FEATURE_RADIUS_PX)],
      viewState: { target: [targetE - originE, targetN - originN, 0], zoom: ZOOM },
    });
    const [fx, fy] = predictFb(bSet.e[li], bSet.n[li], targetE, targetN);
    const [bx, by] = toPickXY(fx, fy);
    for (const step of OFFSET_STEPS_PX) {
      for (const [dx, dy] of OFFSET_DIRECTIONS) {
        classBOutcomes.push(
          await click(
            `b-offset-${step}px`,
            `ordinal ${li}`,
            "centres",
            100,
            "e",
            bSet,
            li,
            bx + dx * step,
            by + dy * step,
            PICK_RADIUS_PX,
            originE,
            originN,
          ),
        );
      }
    }
  }
  const bIdCorrect = classBOutcomes.filter((o) => o.idCorrect).length;
  const bBitExact = classBOutcomes.filter((o) => o.roundTripBitExact).length;
  const bSummary = summariseErrors(classBOutcomes);
  appendLog(
    `(b) 1-3 px offsets: ${bIdCorrect}/${classBOutcomes.length} correct id, ${bBitExact} bit-exact, ` +
      `worst error ${bSummary.worstErrorM} m, ${bSummary.failedClicks} failed`,
  );

  // ---- Class (c): separation sweep --------------------------------------
  // Repeated at several sub-pixel view phases so a single lucky alignment
  // cannot read as discrimination.
  //
  // A note on what the phases revealed, since an earlier version of this
  // comment asserted the wrong cause: it is tempting to explain the 50% rows
  // as "both clicks land on the same pixel, so the input is identical and the
  // trial is degenerate". Recomputing the harness's own click positions
  // refutes that — at 1.13 px separation the two clicks land on *distinct*
  // pixels in all 12 axis x phase combinations, and one member still wins
  // every click. The binding floor is the rendered disc footprint, not click
  // quantization (see classC.note).
  const PHASES = [0, 0.25, 0.5, 0.75];
  const sweep: M3Report["classC"]["sweep"] = [];
  for (const axis of ["e", "n", "d"] as const) {
    for (const sepMm of SEPARATIONS_MM) {
      setStatus(`M3 (c) separation sweep: ${sepMm} mm, axis ${axis}`);
      const pairs = await loadPickSet("pairs", { sepMm, axis });
      let clicks = 0;
      let correct = 0;
      let pickedNothing = 0;
      let bitExact = 0;
      // Tracked per (location, phase) rather than pooled: a pooled set would
      // read `true` if location A always returned member 0 while location B
      // always returned member 1, which is not what the flag claims.
      let minMembersSeenPerPair = 2;
      const bothMembersReturned = new Set<number>();
      for (let li = 0; li < LOCATION_NAMES.length; li++) {
        for (const phase of PHASES) {
          const midE = (pairs.e[li * 2] + pairs.e[li * 2 + 1]) / 2;
          const midN = (pairs.n[li * 2] + pairs.n[li * 2 + 1]) / 2;
          const targetE = midE + TARGET_DELTA_E + phase * M_PER_PX;
          const targetN = midN + TARGET_DELTA_N + phase * M_PER_PX;
          frame.maybeRecenter(targetE, targetN);
          const originE = frame.originE;
          const originN = frame.originN;
          const positions = offsetPositions(pairs.e, pairs.n, originE, originN);
          await renderSettled({
            layers: [
              pointLayer(`m3-c-${axis}-${sepMm}-${li}-${phase}`, positions, pairs.e.length, PAIR_FEATURE_RADIUS_PX),
            ],
            viewState: { target: [targetE - originE, targetN - originN, 0], zoom: ZOOM },
          });
          const pairMembersSeen = new Set<number>();
          for (const member of [0, 1]) {
            const ordinal = li * 2 + member;
            const [fx, fy] = predictFb(pairs.e[ordinal], pairs.n[ordinal], targetE, targetN);
            const [px, py] = toPickXY(fx, fy);
            const outcome = await click(
              `c-sep-${sepMm}mm-${axis}`,
              LOCATION_NAMES[li],
              "pairs",
              sepMm,
              axis,
              pairs,
              ordinal,
              px,
              py,
              0,
              originE,
              originN,
            );
            clicks++;
            if (outcome.idCorrect) correct++;
            if (outcome.roundTripBitExact) bitExact++;
            if (outcome.returnedIndex === null) {
              pickedNothing++;
            } else {
              bothMembersReturned.add(outcome.returnedIndex % 2);
              pairMembersSeen.add(outcome.returnedIndex % 2);
            }
          }
          minMembersSeenPerPair = Math.min(minMembersSeenPerPair, pairMembersSeen.size);
        }
      }
      const entry = {
        axis,
        separationM: sepMm / 1000,
        separationPx: (sepMm / 1000) * PX_PER_M,
        clicks,
        idCorrect: correct,
        pickedNothing,
        roundTripBitExact: bitExact,
        reliable: correct === clicks,
        // Guards the degenerate mode where the pick always returns the same
        // member: that scores 50% and would otherwise read as "sometimes
        // works" rather than "never discriminated".
        bothMembersEverReturned: bothMembersReturned.size === 2,
        /** Weakest pair: 1 means some pair never yielded both members. */
        minMembersSeenPerPair,
      };
      sweep.push(entry);
      appendLog(
        `(c) ${axis} ${entry.separationM} m (${entry.separationPx.toFixed(2)} px): ` +
          `${correct}/${clicks} intended${entry.reliable ? "  <- reliable" : ""}` +
          (entry.bothMembersEverReturned ? "" : "  [only ever returned one member]"),
      );
    }
  }
  // Smallest separation from which every larger separation is reliable on
  // *every* axis — a single lucky pass below an unreliable band doesn't count.
  let reliableFrom: number | null = null;
  for (const sepMm of SEPARATIONS_MM) {
    const atOrAbove = sweep.filter((s) => s.separationM * 1000 >= sepMm);
    if (atOrAbove.length && atOrAbove.every((s) => s.reliable)) {
      reliableFrom = sepMm / 1000;
      break;
    }
  }

  const invalidReasons: string[] = [];
  // The one the entire result rests on. If `shuffle` ever stops taking effect
  // — a renamed param, a dataset() regression, a changed server default — then
  // ordinal == id again and class (a) silently collapses back into the
  // identity function dataset[i] == dataset[i], while still reporting 10/10
  // correct, 10/10 bit-exact and worst error 0. Ungated, that is a perfectly
  // transcribable meaningless run.
  if (!ordinalDivergedFromId) {
    invalidReasons.push(
      "buffer ordinal never diverged from feature id — the shuffled pass did not take effect, " +
        "so class (a) proves only dataset[i] == dataset[i]",
    );
  }
  if (discriminatingProbes < 2) {
    invalidReasons.push(`only ${discriminatingProbes} probes had ordinal != id`);
  }
  if (classAOutcomes.some((o) => o.returnedIndex === null)) {
    invalidReasons.push("class (a) had a click that picked nothing");
  }
  if (aBitExact !== classAOutcomes.length) {
    invalidReasons.push("class (a) f64 round-trip was not bit-exact for every click");
  }
  if (aSummary.failedClicks > 0) {
    invalidReasons.push(`class (a) had ${aSummary.failedClicks} clicks with no measurement`);
  }
  if (classBOutcomes.some((o) => o.returnedIndex === null)) {
    invalidReasons.push("class (b) had a click that picked nothing");
  }
  if (bBitExact !== classBOutcomes.length) {
    invalidReasons.push("class (b) f64 round-trip was not bit-exact for every click");
  }
  if (bSummary.failedClicks > 0) {
    invalidReasons.push(`class (b) had ${bSummary.failedClicks} clicks with no measurement`);
  }
  if (framebufferChanged) {
    invalidReasons.push("framebuffer resized mid-run — predicted click positions used stale dimensions");
  }
  if (settleTimeouts > 0) {
    invalidReasons.push(`${settleTimeouts} render settle timeouts — some clicks hit a stale layer`);
  }
  if (resolveRejections > 0) {
    invalidReasons.push(`${resolveRejections} resolve_pick rejections`);
  }
  if (unprojectSamples === 0) {
    invalidReasons.push("no info.coordinate samples — unprojection control did not run");
  }
  if (!rawCoordinateIsLocalFrame) {
    invalidReasons.push(
      "info.coordinate never looked local-frame — the control's premise did not hold, so its numbers mean something else",
    );
  }

  const report: M3Report = {
    timestamp: new Date().toISOString(),
    valid: invalidReasons.length === 0,
    invalidReasons,
    metric:
      "|returned f64 coordinate - true f64 coordinate of the intended (nearest) feature|; " +
      "tests id-resolution correctness + f64 round-trip exactness, not sub-pixel unprojection",
    budgetM: BUDGET_ERROR_M,
    scale: { denominator: SCALE_DENOMINATOR, metresPerPixel: M_PER_PX, pixelsPerMetre: PX_PER_M },
    framebuffer: { width: fbW, height: fbH },
    failures: { settleTimeouts, resolveRejections, framebufferChanged },
    classA: {
      clicks: classAOutcomes.length,
      idCorrect: aIdCorrect,
      roundTripBitExact: aBitExact,
      worstErrorM: aSummary.worstErrorM,
      failedClicks: aSummary.failedClicks,
      pickRadiusPx: 0,
      outcomes: classAOutcomes,
    },
    classB: {
      clicks: classBOutcomes.length,
      idCorrect: bIdCorrect,
      roundTripBitExact: bBitExact,
      worstErrorM: bSummary.worstErrorM,
      failedClicks: bSummary.failedClicks,
      offsetsPx: OFFSET_STEPS_PX,
      featureRadiusPx: FEATURE_RADIUS_PX,
      pickRadiusPx: PICK_RADIUS_PX,
      note:
        "Weaker evidence than 'deterministic nearest-feature selection': the nearest competing " +
        "feature is 206.5 km away, so there is nothing for the pick to lose to. What this class " +
        "actually demonstrates is near-miss resolution (a click 1-3 px off the feature still " +
        "resolves to it) plus exact round trip — not nearest-among-competitors, which only class " +
        "(c) puts under real pressure.",
    },
    idIndirection: {
      ordinalDivergedFromId,
      discriminatingProbes,
      totalProbes: shuffledCentres.ids.length,
      note:
        "Class (a) runs twice, the second time against a deliberately reversed buffer so the GPU's " +
        "buffer ordinal is not the feature id. Without this, resolving 'index' against a dataset " +
        "regenerated in the same order is the identity function dataset[i] == dataset[i] — it would " +
        "pass in any CRS, at any zoom, with no renderer attached. The id column is what makes the " +
        "result mean anything, and it is what any cull, chunk, sort or LOD would otherwise break " +
        "silently by returning a wrong-but-plausible coordinate. Scope: resolution regenerates the " +
        "dataset per call, so roundTripBitExact establishes 'same pure function, same input, same f64 " +
        "across two transports' — not 'a stored value survived storage'. A real kernel adds a " +
        "persistence hop this milestone does not cover.",
    },
    classC: {
      featureRadiusPx: PAIR_FEATURE_RADIUS_PX,
      pickRadiusPx: 0,
      phases: PHASES,
      sweep,
      reliableFromSeparationPx: reliableFrom === null ? null : reliableFrom * PX_PER_M,
      reliableFromSeparationM: reliableFrom,
      note:
        "Reported as a finding, not a pass/fail, and quoted in PIXELS first: pixels are the scale-free " +
        "property of the pick machinery, whereas the metre figure is that times m/px and is therefore a " +
        "statement about 1:500 only. What binds this number is the *rendered footprint*, not coordinate " +
        `precision: features are styled at ${PAIR_FEATURE_RADIUS_PX} px radius, two discs closer than ` +
        "twice that overlap, and the picking buffer keeps whichever drew last. A one-parameter disc " +
        "model (effective radius ~1.5 px, pixel sampled at centre, later-drawn wins) reproduces every " +
        "cell of this sweep including the bothMembersEverReturned flags — so the figure is essentially " +
        "a STYLE number and a larger styled radius would raise it with no change to the data. Note what " +
        "it is NOT: click quantization. Recomputing the harness's click positions shows the two clicks " +
        "land on distinct integer pixels in all 12 axis x phase combinations at 1.13 px separation, yet " +
        "one member still wins every click there. Scale-invariance of the pixel figure was NOT verified " +
        "at a second zoom — that remains open.",
    },
    unprojectionControl: {
      sampled: unprojectSamples,
      rawCoordinateIsLocalFrame,
      exampleRawLocalCoordinate,
      worstFrameErrorM,
      worstResidualDeadCentreM,
      worstResidualOffsetClicksM,
      wrongCrsTagSeen,
      note:
        "deck.gl's PickingInfo.coordinate unprojects the cursor, and under offset-relative rendering " +
        "the viewport is itself in the local frame — so the value is metres from a renderer-internal " +
        "origin while being shaped exactly like a coordinate. Two distinct failures, deliberately " +
        "reported separately because conflating them would make a *type* error look like a rounding " +
        "error: (i) worstFrameErrorM is the raw value read as if it were EPSG:2056, whose error is " +
        "essentially the origin offset itself — catastrophic, and a frame error rather than a precision " +
        "one; (ii) worstResidualDeadCentreM is what remains once the frame is correctly restored, over " +
        "the dead-centre classes (a and c — the worst case comes from c). worstResidualOffsetClicksM is " +
        "reported separately and is NOT a pixel-resolution figure: those clicks are 1-3 px off the " +
        "feature by design, so unprojection correctly recovers the cursor rather than the feature. " +
        "Term (ii) is also not a measure of deck.gl's unprojection quality — it equals " +
        "hypot(frac(x), frac(y)) over this harness's integer click positions to ~1e-11 m, i.e. it is " +
        "the harness feeding whole pixels, and deck.gl contributes nothing measurable. The architectural " +
        "bound is the one that matters: 1 cm is 0.076 px at 1:500, so even a perfect sub-pixel cursor " +
        "leaves ~0.5 px = 6.6 cm, still 6.6x the budget. That is why the measured path is " +
        "pick id -> host-side f64 lookup rather than unprojection.",
    },
    latency:
      "NOT MEASURED. docs/08 lists picking latency among the measured quantities and ADR-003's gate " +
      "says *interactively* edit, but M3 picks against 5- and 10-feature datasets where latency is " +
      "meaningless. A pick runs a picking render pass over the layer, and M1.5 measured 10M-point " +
      "frames at ~131-136 ms, so picking at P1 scale plausibly stalls the canvas (docs/01 principle 7). " +
      "Explicitly deferred to M4/M5 rather than left silently absent.",
    f32Audit:
      "The returned coordinate never passes through f32, verified by tracing and grepping the whole " +
      "path. (1) markers.rs builds Vec<f64> with f64 arithmetic throughout; (2) resolve_by_id indexes " +
      "those vectors and returns (f64, f64); (3) it crosses as serde_json f64 and is read as a JS " +
      "number, itself f64; (4) it is compared against a Float64Array decoded from Arrow. grep for " +
      "'f32|Float32|fround' over markers.rs, arrow_en.rs and the resolve_pick command matches only " +
      "*comments*, never code. The one Float32Array in play is offsetPositions' output, which is " +
      "uploaded to the GPU for rendering and never read back — the render path and the pick path " +
      "share the source f64 vectors and meet nowhere else. The pick id itself is integer-valued " +
      "throughout: the picking buffer encodes it as an RGB triple, so no float carries it either.",
  };

  console.log("[M3 PICKING REPORT]", report);
  const statsEl = document.querySelector<HTMLPreElement>("#m3-stats");
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  if (invalidReasons.length) {
    appendLog(`RUN INVALID — do not transcribe:\n  - ${invalidReasons.join("\n  - ")}`);
  }
  setStatus("M3: picking measurement complete");
  await invoke("log_m3_report", { reportJson: JSON.stringify(report, null, 2) });
}
