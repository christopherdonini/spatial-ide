// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- viewport-residency cut P1's own committed pure functions
// (RESIDENCY-PREREGISTRATION.md §4b, §8). Plain ESM, zero dependencies: this module is pure DATA and
// MATH, no CDP, no DOM, no `fetch` -- `e2e/residency-harness.mjs` (the driver) is the only consumer
// that turns this data into real actions against a running app; this file itself never touches a
// page. Kept dependency-free deliberately so `residencyTrace.test.mjs` can assert its determinism
// and shape with nothing more than `node:assert`.
//
// **Never uses `Date.now()`, `Math.random()`, or any other non-deterministic source** -- paraphrase
// of RESIDENCY-PREREGISTRATION.md §8's own text, not a quotation of it: trial interleaving happens
// by a committed pure function, never by hand, never by a live random call. (P1d B1: an earlier
// version of this comment additionally attributed a fabricated sentence to CLAUDE.md's workflow
// section -- no such text exists there; that attribution is removed here, not merely reworded.)

// ---------------------------------------------------------------------------------------
// §4d/§4e/§2d: the three proposed-pending-the-human's-sight values, named in ONE place.
// ---------------------------------------------------------------------------------------

/**
 * PROPOSED, PENDING THE HUMAN'S SIGHT (RESIDENCY-PREREGISTRATION.md §2d, gate G7) -- not settled.
 * Paraphrase of G7's own margin (not a quotation of it -- P1d B1/B2's own citation-integrity fix
 * corrected this to a paraphrase, since the real text carries markdown/Unicode this comment does not
 * reproduce character-for-character): the candidate arm's cold first-view first-pixels p95 must not
 * exceed 110% of the baseline arm's own cold first-view first-pixels p95. Named here so
 * no later piece (P3/P6) hard-wires scoring logic to a bare `1.10` literal; this piece itself scores
 * nothing (the piece text: "NO scoring, NO budget comparison in this piece"), so this constant is
 * declared and exported, never referenced by any comparison in this file or in
 * `residency-harness.mjs`.
 */
export const G7_COLD_FIRST_VIEW_MARGIN_PROPOSED = 1.1;

/**
 * M9 (P1b reviewer-gate remediation): a literal, bumped whenever this module's own trace/interleave
 * shape changes, so every evidence file can declare exactly which committed-trace definition
 * produced it (`residency-harness.mjs` carries this into `evidence.cell.traceVersion`). "1" is this
 * literal's inception value -- there is no prior version to have bumped from.
 */
export const TRACE_VERSION = "1";

/**
 * PROPOSED, PENDING THE HUMAN'S SIGHT (§4d) -- three grid resolutions, candidate arm only, swept not
 * chosen. Named here for the same reason as `G7_COLD_FIRST_VIEW_MARGIN_PROPOSED` above; this piece's
 * own driver never issues a tile-keyed query (the tile concept arrives in P3, §9), so this constant
 * is declared but unused by any logic in this piece.
 */
export const TILE_SIZE_LEVELS_PROPOSED = Object.freeze(["coarse", "medium", "fine"]);

/**
 * PROPOSED, PENDING THE HUMAN'S SIGHT (§4e) -- the shell's own declared fan-out ceiling for
 * concurrent `viewport_query` streams a single pan/zoom step may issue, once tiling exists (P3).
 * Named here for the same reason as the two constants above; unused by this piece's own driver,
 * which issues at most one `viewport_query` per step (today's whole-viewport-refill behaviour, no
 * tiling in this piece).
 */
export const MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED = 3;

// ---------------------------------------------------------------------------------------
// §4b: the committed camera trace, as data.
// ---------------------------------------------------------------------------------------

/** Settle criterion, identical at every step. Paraphrase of §4b's own settle criteria, not a
 * quotation of it (P1d B1/B2's own citation-integrity fix -- the real text wraps across the doc's
 * own markdown line-length and carries bold/backtick markup this comment does not reproduce
 * character-for-character): a step is complete when (a) the camera transform has not changed for
 * 300 ms, AND (b) zero in-flight `viewport_query` streams remain for that step's request set,
 * fully drained or cancelled-and-observed. `quietMs` is (a)'s own figure; `timeoutMs` is the
 * per-step watchdog, §7's own declared ceiling of 5 s for "per-step settle (§4b)" -- a step that has
 * not settled within it invalidates the whole trial (§4b), never a partial success. See
 * `residency-harness.mjs`'s own doc comment for the concrete signal (render-trace console
 * quiescence) it uses to detect (a)+(b) together, and why that signal suffices. */
export const SETTLE_QUIET_MS = 300;
export const SETTLE_PER_STEP_TIMEOUT_MS = 5_000;

/** §7's own declared ceiling of 180 s for "one full camera-trace trial (all 11 steps, one
 * arm/fixture/tile-size cell)" -- that quoted fragment is verbatim (§7's own table cell); "180 s" is
 * carried as this constant's own value, not re-quoted, since joining table cells with a colon (as an
 * earlier version of this comment did) is not how the source table itself reads (P1d B1/B2). */
export const TRIAL_WATCHDOG_MS = 180_000;

/**
 * The 11-step camera trace (§4b), as DATA -- `kind`/`params` are interpreted by the driver
 * (`residency-harness.mjs`'s own `applyStep`), never by this module. Every step shares the same
 * `settle` object (identical at every step, §4b) by reference -- deliberate: a test asserting every
 * step's settle criterion is well-formed is asserting one shape, not eleven independent ones.
 *
 * **Disclosed interpretation, `pan-northeast`'s magnitude (a preregistration ambiguity, reported per
 * this piece's own instructions rather than amending the frozen preregistration).** §4b step 6 reads
 * "one full viewport diagonal (√2 × the pan distance above, same direction convention)" -- "the pan
 * distance above" does not unambiguously name which of step 2's height-based distance or step 5's
 * width-based distance it means (steps 2/4 use viewport HEIGHT, steps 3/5 use viewport WIDTH, and
 * step 6 immediately follows step 5). This module resolves it as **step 5's own basis (viewport
 * WIDTH), scaled by sqrt(2)** -- "the pan distance above" read as "the immediately preceding step's
 * distance" -- and both the numerator basis (`"width"`) and the multiplier are carried explicitly in
 * `params` below so a reader (or a later piece) never has to re-derive the choice from prose.
 */
function frozenStep(step) {
  Object.freeze(step.params);
  Object.freeze(step.settle);
  return Object.freeze(step);
}

export const CAMERA_TRACE_STEPS = Object.freeze([
  { id: "fit", kind: "fit", params: {}, settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS } },
  {
    id: "pan-north",
    kind: "pan",
    params: { direction: "N", distanceBasis: "height", distanceMultiplier: 1 },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "pan-east",
    kind: "pan",
    params: { direction: "E", distanceBasis: "width", distanceMultiplier: 1 },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "pan-south",
    kind: "pan",
    params: { direction: "S", distanceBasis: "height", distanceMultiplier: 1 },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "pan-west",
    kind: "pan",
    params: { direction: "W", distanceBasis: "width", distanceMultiplier: 1 },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "pan-northeast",
    kind: "pan",
    // See this export's own doc comment ("Disclosed interpretation") for why `distanceBasis` is
    // "width" (step 5's own basis) here, not "height".
    params: { direction: "NE", distanceBasis: "width", distanceMultiplier: Math.SQRT2 },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "zoom-in-1",
    kind: "zoom",
    params: { factor: 2, focal: "center" },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "zoom-in-2",
    kind: "zoom",
    params: { factor: 2, focal: "center" },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "zoom-in-3",
    kind: "zoom",
    params: { factor: 2, focal: "center" },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "zoom-out-1",
    kind: "zoom",
    params: { factor: 0.5, focal: "center" },
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
  {
    id: "zoom-to-layer",
    kind: "zoom-to-layer",
    params: {},
    settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: SETTLE_PER_STEP_TIMEOUT_MS },
  },
].map(frozenStep));

/** `true` iff `settle` has the shape every `CAMERA_TRACE_STEPS` entry declares: both fields present,
 * finite, and positive. Exported so `residencyTrace.test.mjs` can assert "every step's settle
 * criterion is well-formed" without re-deriving the shape itself. */
export function isWellFormedSettleCriterion(settle) {
  return (
    typeof settle === "object" &&
    settle !== null &&
    Number.isFinite(settle.quietMs) &&
    settle.quietMs > 0 &&
    Number.isFinite(settle.timeoutMs) &&
    settle.timeoutMs > 0 &&
    settle.timeoutMs > settle.quietMs
  );
}

const VALID_KINDS = new Set(["fit", "pan", "zoom", "zoom-to-layer"]);

/** Structural validation of the whole trace -- every step has a non-empty string `id` (unique across
 * the trace), a `kind` from `VALID_KINDS`, a `params` object, and a well-formed `settle`. Returns an
 * array of human-readable problems, empty iff the trace is well-formed -- never throws, so a test
 * (or a future driver) can report every problem at once rather than stopping at the first. */
export function validateCameraTrace(steps) {
  const problems = [];
  const seenIds = new Set();
  if (!Array.isArray(steps) || steps.length === 0) {
    return ["trace must be a non-empty array"];
  }
  steps.forEach((step, i) => {
    if (!step || typeof step !== "object") {
      problems.push(`step ${i}: not an object`);
      return;
    }
    if (typeof step.id !== "string" || step.id.length === 0) {
      problems.push(`step ${i}: id must be a non-empty string`);
    } else if (seenIds.has(step.id)) {
      problems.push(`step ${i}: duplicate id "${step.id}"`);
    } else {
      seenIds.add(step.id);
    }
    if (!VALID_KINDS.has(step.kind)) {
      problems.push(`step ${i} (${step.id ?? "?"}): kind "${step.kind}" is not one of ${[...VALID_KINDS].join(", ")}`);
    }
    if (typeof step.params !== "object" || step.params === null) {
      problems.push(`step ${i} (${step.id ?? "?"}): params must be an object`);
    }
    if (!isWellFormedSettleCriterion(step.settle)) {
      problems.push(`step ${i} (${step.id ?? "?"}): settle criterion is not well-formed: ${JSON.stringify(step.settle)}`);
    }
  });
  return problems;
}

// ---------------------------------------------------------------------------------------
// §8: ABBA interleave, as a committed pure function.
// ---------------------------------------------------------------------------------------

/**
 * ABBA interleave across arm x tile-size cells (§8: "ABBA by committed pure function, both across
 * arms and across tile-size levels -- never a fixed order that could let session drift (thermal,
 * cache warmth, background load) masquerade as an arm or tile-size effect"). Pure and deterministic:
 * the SAME `(cellCount, trialsPerCell)` pair
 * always produces the SAME play order -- no `Date`/`Math.random`, matching this file's own top
 * doc comment.
 *
 * `cellCount` is the number of distinct declared cells for one fixture, **cell index 0 is always the
 * baseline arm** (§4: "P2 runs the baseline arm first; it must exist before the candidate does" --
 * the caller is responsible for building its own cell list with baseline at index 0; this function
 * does not itself know which cell is which arm). Cells 1..cellCount-1 are each interleaved against
 * cell 0 in a classic ABBA block, in turn, `trialsPerCell` times: for an even trial index the block is
 * (baseline, candidate); for an odd trial index it flips to (candidate, baseline) -- so baseline is
 * never isolated at one end of a candidate's whole run, where a monotonic session drift (thermal
 * ramp, cache warmth) could otherwise masquerade as the arm effect this factorial exists to measure.
 *
 * Returns a flat array of `{cellIndex, trial}` entries, `2 * (cellCount - 1) * trialsPerCell` long for
 * `cellCount > 1` (baseline appears once per candidate block, `cellCount - 1` blocks), or
 * `trialsPerCell` long for `cellCount === 1` (nothing to interleave against).
 */
// ---------------------------------------------------------------------------------------
// S2 (P1b reviewer-gate remediation): the percentile convention, declared and unit-tested here
// rather than left as an undocumented formula inline in `residency-harness.mjs`.
// ---------------------------------------------------------------------------------------

/**
 * S2: the NEAREST-RANK percentile convention this repository's own driver uses for every p50/p95
 * figure it reports (paraphrase of `residencyInstrument.ts`'s own comment -- p50/p95 scoring is the
 * driver's job, never computed inside the instrument -- not a quotation of §6; P1d B2: an earlier
 * version of this comment misattributed that phrasing to §6's own text, which contains no such
 * sentence). This module is the ONE declared, tested definition every such computation goes
 * through. `sortedAscending` must
 * already be sorted ascending (this function does not sort -- the caller's own sort is the one
 * source of truth for what "ascending" means for its particular value type, e.g. numeric vs.
 * lexicographic). `p` is 0..100.
 *
 * **Definition:** `index = floor((p / 100) * n)`, clamped to `[0, n - 1]`, 0-indexed into
 * `sortedAscending` -- a floor-based nearest-rank variant, not the textbook ceil-based one (the two
 * agree everywhere except exactly at ranks landing on an integer boundary, where floor's own
 * clamping keeps the result inside the array rather than one item past a would-be `n`-th rank).
 *
 * **Declared property: p95 equals the max for every `n` in `[1, 20]`.** `floor(0.95 * n) === n - 1`
 * (the last index) for every integer `n` from 1 through 20 inclusive -- e.g. `n=20`:
 * `floor(0.95*20) = floor(19.0) = 19`, the last index of a 20-element array. At `n=21`,
 * `floor(0.95*21) = floor(19.95) = 19`, the SECOND-to-last index of a 21-element array -- the first
 * `n` where p95 stops being the max. This is exactly the shape `kernel/IMPORT-LAYOUT-
 * PREREGISTRATION.md`-style preregistrations elsewhere in this repository declare for small-`n`
 * percentiles, restated here as a tested property rather than an assumed one (`residencyTrace.test
 * .mjs`'s own "p95 is max for n<=20" test).
 */
export function percentileNearestRank(sortedAscending, p) {
  if (!Array.isArray(sortedAscending) || sortedAscending.length === 0) {
    throw new Error("percentileNearestRank: sortedAscending must be a non-empty array");
  }
  const n = sortedAscending.length;
  const index = Math.min(n - 1, Math.max(0, Math.floor((p / 100) * n)));
  return sortedAscending[index];
}

// ---------------------------------------------------------------------------------------
// §12 Amendment 6: the instrument-identity mode's own deterministic camera SCRIPT.
// ---------------------------------------------------------------------------------------

/**
 * Three programmatic view-state steps, literal world-space (authoritative-CRS) targets and zooms
 * -- never randomness, never `Date`, matching this module's own top doc comment. Consumed ONLY by
 * `residency-harness.mjs`'s identity mode (`--wire-identity`), via the DEV-gated `e2eSetViewState`
 * seam (`WorkingCanvas.tsx`) -- **measured cells never touch this array**; they keep driving
 * `CAMERA_TRACE_STEPS` through real synthetic gestures (`applyStep`), unchanged.
 *
 * **Why this mode exists at all (RESIDENCY-PREREGISTRATION.md §12 Amendment 6).** The identity
 * guard's ORIGINAL implementation drove real synthetic pointer/wheel gestures -- the same
 * `CAMERA_TRACE_STEPS` measured cells still use. CDP-driven synthetic-pointer timing jitter
 * interacting with the shell's own real 120ms pan/zoom debounce
 * (`VIEWPORT_QUERY_MIN_INTERVAL_MS`) made two ON runs disagree with each other as much as ON vs
 * OFF -- proven, not assumed, by the committed gate evidence
 * (`e2e/residency-field-sequence-identity-gate-evidence.json`'s P1b record: `on#1` differed from
 * `on#2`, the SAME instrument state). Realism is not the property under test in the identity mode,
 * so Amendment 6 replaces the gesture with an exact, declared camera pose instead.
 *
 * **Derivation ("derive from the same bboxes the smoke steps visit," this piece's own
 * instruction).** The first two poses are the REAL, observed `viewState.post` values
 * (`targetX + originX`, `targetY + originY`, `zoom`) a genuine `--smoke` run's own first two steps
 * (`fit`, `pan-north`) actually landed on against the same fixture this mode always opens
 * (`FIXTURE_FILTER_ZONED`) -- captured from
 * `e2e/out/residency-harness-instrument-on-smoke-1788108725642.json` (P1c, pre-run capture,
 * 2026-08-30), not invented.
 *
 * **P1d suggestion 14: the third pose is `identity-zoom-in-equivalent`, not
 * `identity-pan-east-equivalent`.** Live re-verification (P1d, this piece's own re-review
 * remediation) found `pan-east`'s own landing pose returns ZERO rows against this fixture in EVERY
 * observed run (both the `--smoke` capture above and a fresh full 11-step trace run live for this
 * fix) -- the fixture's own data does not extend east of the `pan-north` position, so a
 * `--wire-identity` run built on that pose would compare an empty response on every arm, never
 * exercising a real batch delivery. Replaced with `CAMERA_TRACE_STEPS`' OWN "zoom-in-1" semantics
 * instead (×2 magnification, same focal point as the PRECEDING pose -- here, `fit`'s own target,
 * `zoom + 1` in deck.gl's logarithmic scale) -- live-verified (a direct `e2eSetViewState` probe
 * against a running session, this piece's own report) to return 1305 rows across 3 batches against
 * this same fixture, comfortably nonzero.
 *
 * Because the first two poses are real camera poses a real fit-to-extent and one real pan actually
 * reached against this fixture, and the third is a live-verified zoom from the first, all three are
 * guaranteed to intersect its extent (the `fit` step's own target is the dataset's own bbox centre).
 * Frozen as LITERAL numbers here -- this mode never recomputes them from a live bbox at run time.
 *
 * **Window-size dependency, disclosed.** Like every `CAMERA_TRACE_STEPS` pan/zoom step (whose own
 * distances are `box.width`/`box.height`-relative), these literals are only exactly reproducible
 * against the SAME window dimensions (`src-tauri/tauri.conf.json`'s `app.windows[0]`) the
 * capturing run used -- not a new fragility this mode introduces, the same standing dependency the
 * rest of this file already carries.
 */
export const IDENTITY_VIEW_STATE_STEPS = Object.freeze(
  [
    { id: "identity-fit-equivalent", targetX: 2600900.1915728687, targetY: 1200899.782897822, zoom: -3.486093929686878 },
    { id: "identity-pan-north-equivalent", targetX: 2600900.1915728687, targetY: 1202804.6635114393, zoom: -3.486093929686878 },
    { id: "identity-zoom-in-equivalent", targetX: 2600900.1915728687, targetY: 1200899.782897822, zoom: -2.486093929686878 },
  ].map((step) => Object.freeze(step))
);

export function abbaInterleave(cellCount, trialsPerCell) {
  if (!Number.isInteger(cellCount) || cellCount < 1) {
    throw new Error(`abbaInterleave: cellCount must be a positive integer, got ${cellCount}`);
  }
  if (!Number.isInteger(trialsPerCell) || trialsPerCell < 1) {
    throw new Error(`abbaInterleave: trialsPerCell must be a positive integer, got ${trialsPerCell}`);
  }

  const order = [];
  if (cellCount === 1) {
    for (let t = 0; t < trialsPerCell; t++) order.push({ cellIndex: 0, trial: t });
    return order;
  }

  for (let candidate = 1; candidate < cellCount; candidate++) {
    for (let t = 0; t < trialsPerCell; t++) {
      if (t % 2 === 0) {
        order.push({ cellIndex: 0, trial: t });
        order.push({ cellIndex: candidate, trial: t });
      } else {
        order.push({ cellIndex: candidate, trial: t });
        order.push({ cellIndex: 0, trial: t });
      }
    }
  }
  return order;
}
