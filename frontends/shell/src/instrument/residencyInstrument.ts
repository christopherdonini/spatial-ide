// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The residency measurement instrument (viewport-residency cut, P1/P1b;
 * `RESIDENCY-PREREGISTRATION.md` §6: "Instruments -- the quantities table"). DEV-ONLY, gated
 * exactly like `e2e-test-surface.ts` (`import.meta.env.DEV`, Vite's literal-`false` replacement for
 * `npm run build`, letting esbuild's minifier dead-code-eliminate every guarded branch -- proven by
 * `npm run build` succeeding and the dist grep this piece's own `check:dist-clean` script runs, not
 * merely claimed here).
 *
 * **Instrument-off is the default, and "off" means ZERO code beyond the flag check.**
 * `RESIDENCY-PREREGISTRATION.md` §8's wire-bytes-identity assertion depends on this literally: only
 * `enableResidencyInstrument` carries its own `import.meta.env.DEV` guard (the one place this
 * module's runtime `enabled` flag can ever become `true`); every other exported mutator below gates
 * on that ALREADY-false-unless-enabled-in-DEV flag alone, so calling any of them before
 * `enableResidencyInstrument` ever ran costs exactly one boolean read and a return -- no timer, no
 * state mutation.
 *
 * **P1d B6a: the REAL two-layer mechanism, stated precisely (an earlier version of this comment
 * overclaimed uniformity that did not hold).** (1) PRIMARY: every call site that reaches this module
 * from PRODUCT code (`WorkingCanvas.tsx`, `streaming/viewportStreamManager.ts`, `App.tsx`) is meant
 * to be wrapped in its OWN `if (import.meta.env.DEV)` check at the call site itself -- not merely
 * inside this module -- so Vite's literal-`false` replacement plus esbuild's minifier's dead-code
 * elimination removes the call, and (via tree-shaking, once nothing reachable references this
 * module's exports) this module's own code, entirely from a production build (the same mechanism
 * that already gets `__SPATIAL_E2E__` to zero dist hits despite `e2e-test-surface.ts` being imported
 * unconditionally at the top of those same files). This is what `check:dist-clean` actually tests
 * for (absence of the literal identifier strings) -- **it was NOT uniformly true**:
 * `WorkingCanvas.tsx`'s own persistent `onAfterRender` closure (installed by
 * `armFirstPixelRenderHook`) called `recordResidencyRenderTick()` with no such guard, found and
 * fixed at that call site (P1d B6a) rather than merely disclosed here. (2) SECONDARY, independent
 * safety net: even if some reference to this module's code survived un-eliminated in a production
 * build (exactly the shape the bug just fixed could have produced), it would still be a RUNTIME
 * no-op, because `enabled` can only ever become `true` via `enableResidencyInstrument`, which is
 * ITSELF `import.meta.env.DEV`-gated and therefore always takes its early-return branch in
 * production regardless of whether its own call site happens to survive -- this is enabled-constant
 * propagation as a BACKSTOP, never a substitute for (1)'s own DCE, and never by itself what
 * `check:dist-clean` measures (see that script's own doc comment for the resulting one-directional
 * limit: a hit proves a leak; a miss proves absence of the literal identifier, never absence of the
 * underlying call).
 *
 * **P1b reviewer-gate remediation (M1/M2/M3/M6, this file's own share of it):**
 * - **M1.** `firstPixelMs`'s clock now starts at the step's FIRST `recordStreamIssued` (the query
 *   actually issuing), not at `beginStep` -- and the stamp only fires once BOTH a query was issued
 *   AND its first ACCEPTED batch has arrived (`firstBatchArrived`, set by `recordBatch` only on a
 *   non-refused batch) -- never from a render caused by the step's own input gesture alone. A step
 *   with zero streams or zero accepted batches reports `firstPixelMs: null` with an honest
 *   `firstPixelReason` (`"no-query"` / `"no-batch"` / `"no-paint"`), never a gesture-repaint number.
 * - **M2.** `recordBatch` now takes a `refused` boolean and counts decoded-and-accepted
 *   (`batchesReceived`/`featuresDecoded`/`bytesDecoded`) separately from decoded-and-refused
 *   (`batchesRefused`/`featuresRefused`/`bytesRefused`) -- a ceiling-refused batch is no longer
 *   silently dropped from every counter.
 * - **M3.** The old `requestAnimationFrame` loop (`frameTick`) is GONE. `recordFrame` is now driven
 *   exclusively by `WorkingCanvas.tsx`'s own persistent, per-step, timeout-guarded `onAfterRender`
 *   hook (`recordResidencyRenderTick`, called on every REAL deck.gl render while armed) -- so
 *   `frameTimestamps` is a real render/paint series, not an idle rAF tick series that happened to be
 *   mislabeled as one.
 * - **M6.** `recordStreamEnded`/`recordResidencyStreamEnded` pairs with `recordStreamIssued`
 *   (`viewportStreamManager.ts`'s own single terminal call site) to maintain a driver-visible
 *   in-flight stream count (`getResidencyInFlightStreamCount`), so a driver's settle check can
 *   require in-flight === 0, not merely console quiescence.
 *
 * **P3i (RESIDENCY-PREREGISTRATION.md's own §12 Amendment 15, paraphrased, not quoted): three
 * per-step sub-spans, REPORTED-BESIDE `firstPixelMs`, never gated.** `recordBatchArrived`/
 * `recordBatchDecoded` are two new ONE-SHOT-per-step markers, each set only by the FIRST call this
 * step observes: `recordBatchArrived` at each arm's own manager batch-arrival hook
 * (`viewportStreamManager.ts`/`tileViewportStreamManager.ts`/`candidateArmSession.ts`'s own untiled
 * sink -- literally the earliest client-observable moment for a batch's own data-plane bytes, BEFORE
 * decode; see that method's own doc comment for why this is a DEFINED PROXY, not a true
 * first-TCP-byte timestamp), `recordBatchDecoded` right after `WorkingCanvas.tsx`'s own
 * `decodeBatch` call completes, for either arm's own `pushBatch`/`pushTileBatch`.
 *
 * **P3i-b S7 (instrument mini-review): the "same physical batch" claim, qualified, not asserted
 * absolutely.** In the common case -- decode running synchronously, immediately after arrival, in
 * this codebase's single-threaded ingest path, with no `await` between a manager's own
 * `recordBatchArrived` call and `WorkingCanvas.tsx`'s own paired `recordBatchDecoded` call -- the
 * FIRST `recordBatchArrived` and the FIRST `recordBatchDecoded` this step observes describe the SAME
 * physical batch. This module cannot itself PROVE that from in here: it observes two independent
 * one-shot markers, never a shared batch identity token passed between them, so the guarantee rests
 * entirely on each caller's own code shape staying as it is today, not on anything this module
 * enforces. Two known "drop sites" already exist upstream of the SECOND marker only in principle --
 * `viewportStreamManager.ts`'s own supersession check in `onBatch` (baseline) and
 * `tileViewportStreamManager.ts`'s own equivalent (candidate) -- both of which are placed BEFORE
 * their own `recordBatchArrived` call today (so a superseded batch never arms the marker at all, the
 * pairing holds for THAT specific hazard) -- but neither this module nor those call sites assert
 * that no OTHER early return can ever separate a batch's own arrival from its own decode (a null
 * `canvas` ref, a thrown decode, or a future refactor could). Not fixed by pairing the markers with a
 * shared token here (a larger, riskier change across three call sites, out of this piece's own
 * scope) -- documented as a qualification instead, and backstopped structurally: `endStep` below
 * derives `firstByteToDecodedMs` from each of its own two operands independently (never from a
 * single shared "was something null" flag), so the case this qualification names -- arrival recorded,
 * decode never observed -- reports a real, honest `null` with a real reason, never a silently wrong
 * number (S5).
 *
 * `endStep` derives `queryToFirstByteMs` (arrival minus `firstStreamIssuedAtMs`),
 * `firstByteToDecodedMs` (decode minus arrival), and `decodedToPaintedMs` (the existing
 * `firstPixelMs` stamp's own raw paint timestamp minus decode) from these two markers plus the
 * existing M1 stamp -- never a new clock, never a new render hook.
 *
 * **Disclosed divergence, corrected (P3i-b B1: the original wording here inverted the structural
 * truth).** The first TWO spans key on literally the step's first batch (any fate) while
 * `firstPixelMs`/`decodedToPaintedMs` key on the first ACCEPTED batch (M1's own criterion,
 * unchanged) -- but whenever all four raw timestamps this derivation needs are non-null, the three
 * spans sum to EXACTLY `firstPixelMs` ALWAYS, by simple construction (a telescoping chain of
 * subtractions sharing endpoints on the SAME clock: `(arrived - issued) + (decoded - arrived) +
 * (painted - decoded) = painted - issued`, algebraically, in every case, not "only in the common
 * case"). A step whose first batch is REFUSED and never followed by an accepted one does not produce
 * an inconsistent sum -- it produces a NULL `decodedToPaintedMs`/`firstPixelMs` (reason `"no-batch"`,
 * per M1's existing rule: zero ACCEPTED batches) beside real, non-null `queryToFirstByteMs`/
 * `firstByteToDecodedMs` (that first batch genuinely arrived and decoded); there is no partial or
 * mismatched sum to observe, because the fourth operand the sum would need (`firstPixelAtMs`) is
 * itself null in that case. **Entry 31 (2026-09-03): the sum is additionally unavailable in any
 * row where the S5/entry-31 clamps fired** (reasons `"cross-step-stream"`/`"cross-step-stream-zero"`
 * on any span) -- the clamps null one or two of the three terms in exactly those rows, so a scorer
 * checking B1 must skip clamped rows rather than reading the missing terms as zero.
 *
 * **P3i-b B2 (the real divergence -- a MISLABELING, not a missing sum): mixed refused-then-accepted
 * batches.** When the step's first batch is REFUSED but a LATER batch within the SAME step is the
 * first ACCEPTED one, `queryToFirstByteMs`/`firstByteToDecodedMs` still describe the (refused) first
 * batch, while `decodedToPaintedMs` is computed against the ACCEPTED batch's own `firstPixelAtMs` but
 * subtracts the FIRST (refused) batch's own `firstBatchDecodedAtMs` -- the three spans still sum to
 * exactly `firstPixelMs` (B1's own algebra does not care which batches the endpoints came from), but
 * `decodedToPaintedMs` in this case silently ABSORBS the accepted batch's own transport+decode time,
 * mislabeled as pure "paint" time. `segmentsSpanSingleBatch` (below) is `false` exactly in this case
 * -- `false` whenever the batch that armed `firstBatchArrived` (the first ACCEPTED one) was not also
 * the step's very first batch overall (any fate) -- so a scorer/reader can tell the two situations
 * apart without re-deriving it from the raw counters each time.
 *
 * **A measurement SIBLING to `console/recorder.ts`, not an extension of it** (this piece's own
 * instruction) -- same discipline (a subscriber-shaped consumer failing must never break the frame
 * that produced the event it consumes), but a completely separate bounded state machine with no
 * shared storage: the recorder logs requests for display; this module counts and times ONE active
 * camera-trace step at a time for a driver to score OFFLINE -- computed offline by the driver
 * (`residency-harness.mjs`'s own `frameTimeStatsMs`), never in-page: this module only ever records
 * raw per-frame timestamps and raw counters, consistent with §6's table naming these a "client
 * clock"/"client compositor-frame timer" instrument, never a percentile (paraphrase of §6's own
 * framing, not a quotation of it -- corrected here, P1b M4: an earlier version of this comment
 * attributed a fabricated sentence to §6 that does not appear in that section's actual text).
 *
 * The state machine itself is the pure `ResidencyInstrumentCore` class below, exported so
 * `residencyInstrument.test.ts` can drive it directly with synthetic timestamps -- no DOM, no real
 * `requestAnimationFrame`, matching `WorkingCanvas.tsx`'s own established pure-seam precedent
 * (`applyStyleChange`, `summarizePixels`): "DOM-free testability... a pure seam a unit test can
 * actually drive."
 */

import { isInstrumentedBuild } from "../isInstrumentedBuild";

export interface ResidencyStepCounters {
  streamsIssued: number;
  /** M6: paired with `streamsIssued` via `viewportStreamManager.ts`'s single terminal call site
   * (`recordResidencyStreamEnded`, at `sink.onTerminal`, before the self-cancel-suppression check --
   * every terminal transition ends a stream's in-flight lifetime, self-cancelled or not). */
  streamsEnded: number;
  /** Decoded-and-ACCEPTED only (M2) -- a batch `ResidentSet.addBatch` actually admitted. */
  batchesReceived: number;
  featuresDecoded: number;
  bytesDecoded: number;
  /** Decoded-and-REFUSED (M2) -- a batch a declared ceiling (`ResidentVertexCeilingExceeded`,
   * `PickCeilingExceeded`) refused. Counted separately from the accepted totals above, never
   * folded in: a refused batch was decoded (the bytes/features numbers are real) but never
   * rendered. */
  batchesRefused: number;
  featuresRefused: number;
  bytesRefused: number;
  /** P3w's own placeholder, wired by P3i (this piece): incremented once per real per-tile fetch the
   * candidate arm's own `TileViewportStreamManager` issues (`candidateArmSession.ts`'s
   * `countTileStreamIssuedOnce`, deduped by tile key -- the SAME dedupe `streamsIssued` already gets
   * for the candidate arm, just under a tile-specific name a scorer can read without inferring it
   * from the general stream counter). The baseline arm never calls `recordTileRequested` -- always 0
   * for a baseline step, never null (the instrument's own "off means zero work" discipline applies
   * per-counter, not per-arm; see this field's own consumers for how a reader tells baseline's
   * honest-zero from the candidate arm's own zero-because-no-tiles-this-step). */
  tilesRequested: number;
  /** P3i: candidate-arm-only, summed across every `WorkingCanvas.pushTileBatch` call this step
   * (`tileIngest.ts`'s own `ingestTileBatch` -- `outcome.duplicatesDropped`). Always 0 for the
   * baseline arm, which has no tile-keyed dedupe concept at all -- `pushBatch` never calls the
   * recorder this field is fed by. */
  duplicatesDropped: number;
  /** P3i: candidate-arm-only, summed `outcome.evictedTileKeys.length` across every
   * `pushTileBatch` call this step. Always 0 for the baseline arm, same reasoning as
   * `duplicatesDropped` above -- `ResidentSet` (baseline) has no per-tile eviction concept. */
  evictionsApplied: number;
}

function zeroCounters(): ResidencyStepCounters {
  return {
    streamsIssued: 0,
    streamsEnded: 0,
    batchesReceived: 0,
    featuresDecoded: 0,
    bytesDecoded: 0,
    batchesRefused: 0,
    featuresRefused: 0,
    bytesRefused: 0,
    tilesRequested: 0,
    duplicatesDropped: 0,
    evictionsApplied: 0,
  };
}

/** S9: an explicit cap on the per-step frame/proxy series, with a `truncated` flag rather than
 * unbounded growth -- a step that somehow never settles (a watchdog-bound trial, §7) must not grow
 * these arrays without limit. Generous relative to any real step's actual render count (a 5s
 * per-step watchdog at even 240 fps is 1200 renders); existing solely as a declared ceiling, per
 * ADR-010 rule 6's "declared, not discovered" discipline this codebase already applies elsewhere
 * (`limits.ts`). */
const MAX_FRAME_TIMESTAMPS = 5000;
const MAX_INPUT_PROXIES = 1000;

export type FirstPixelReason = "no-query" | "no-batch" | "no-paint";

/** P3i: `FirstPixelReason`'s own three-value vocabulary, reused rather than duplicated --
 * `queryToFirstByteReason`/`firstByteToDecodedReason`/`decodedToPaintedReason` below all draw from
 * it, per this file's own top doc comment on the P3i paragraph (the disclosed divergence between
 * "step's first batch, any fate" and "step's first ACCEPTED batch"). **P3i-b S5: extended with one
 * segment-only value, `"cross-step-stream"`** -- a span's own two raw endpoints share one clock
 * (`performance.now()`), so a negative delta would mean the "later" marker's own timestamp predates
 * the "earlier" one's: structurally impossible within one step's own consistent ordering, but not
 * something this pure state machine can itself prevent if ever fed timestamps whose stream/batch
 * pair straddled a step boundary. Guarded in `endStep` (clamped to `null` with this reason), never
 * asserted unreachable outright -- believed unreachable in a clean trial, per S5's own report.
 * **DECISIONS-PENDING entry 31 fix (2026-09-03): extended with `"cross-step-stream-zero"`**, for
 * `queryToFirstByteMs` only -- the S5 pathology's degenerate case where arrival and issuance land
 * in the SAME ~100us clock quantum, producing a delta of exactly 0 that the `< 0` clamp let
 * through as an apparent measurement (two such impostors sit in the P12 evidence file). A genuine
 * 0 is unreachable for THIS span: the issue stamp is recorded after the `viewport_query` mint and
 * `dataPlaneAttach` awaits have already resolved, so a genuine span still covers the server
 * producing and delivering the stream's first data frame -- the smallest clean value on record is
 * ~200ms, and no reachable path produces a legitimate same-quantum pair (this change's own
 * reviewer gate checked, including a new stream's issue coinciding with an OLDER stream's arrival
 * -- still not a measurement). So 0 is always the cross-step signature. The other two spans keep
 * their `< 0`-only clamps deliberately: 0 is legitimate for `firstByteToDecodedMs` (decode is
 * synchronous with arrival -- same quantum is expected) and not provably impostor for
 * `decodedToPaintedMs` (a frame callback can fire within one quantum of decode). */
export type SegmentReason = FirstPixelReason | "cross-step-stream" | "cross-step-stream-zero";

export interface ResidencyStepResult {
  stepId: string;
  counters: ResidencyStepCounters;
  /** M1: ms from the step's FIRST `recordStreamIssued` call to the FIRST `recordFrame` call this
   * instrument observed AFTER the step's first ACCEPTED batch arrived -- `null` if that never
   * happened before `endStep` was called. */
  firstPixelMs: number | null;
  /** M1: present iff `firstPixelMs` is `null`, naming exactly why -- `"no-query"` (zero
   * `recordStreamIssued` calls this step), `"no-batch"` (a query issued but zero ACCEPTED batches
   * arrived), or `"no-paint"` (a query issued and a batch accepted, but no `recordFrame` was
   * observed before `endStep` -- an honest residual case, never silently absorbed into one of the
   * other two). `undefined` when `firstPixelMs` is non-null. */
  firstPixelReason?: FirstPixelReason;
  /** P3i: ms from the step's first `recordStreamIssued` call to `recordBatchArrived`'s own one-shot
   * timestamp for the step's FIRST batch to arrive (any accept/refuse fate -- see this file's own top
   * doc comment). `null` when either never happened this step; see `queryToFirstByteReason`. */
  queryToFirstByteMs: number | null;
  /** Present iff `queryToFirstByteMs` is `null` -- `"no-query"` (zero streams issued this step) or
   * `"no-batch"` (a stream issued, but no batch ever arrived before `endStep`). Never `"no-paint"`:
   * this span does not depend on painting at all. */
  queryToFirstByteReason?: SegmentReason;
  /** P3i: ms from that same first-batch arrival to `recordBatchDecoded`'s own one-shot timestamp for
   * the same batch (around `WorkingCanvas.tsx`'s own `decodeBatch` call). `null` when the arrival
   * itself never happened, OR (P3i-b S5/S7, guarded rather than assumed unreachable) when arrival
   * happened but decode was never observed before `endStep` -- believed unreachable given decode's
   * own synchronous, immediate-after-arrival placement in this codebase's ingest path, but this
   * module cannot itself prove that from in here (see this file's own top doc comment, S7's
   * qualification of the "same physical batch" claim); either way `firstByteToDecodedReason` below is
   * always set, never left `undefined` beside a `null` value. */
  firstByteToDecodedMs: number | null;
  /** P3i-b S5: derived from this span's OWN two operands directly, no longer a value mirrored from
   * `queryToFirstByteReason` (an earlier version of this field shared one variable across both
   * reasons, which could leave this one `undefined` beside a `null` value in an edge ordering that
   * variable's own single null-check did not cover -- see S5's own report). `"no-query"` (zero
   * streams issued), `"no-batch"` (a stream issued but no batch ever arrived, OR a batch arrived but
   * was never observed decoding -- S7's qualified case), never `"no-paint"`: this span does not
   * depend on painting at all. */
  firstByteToDecodedReason?: SegmentReason;
  /** P3i: ms from that same batch's decode completing to `firstPixelMs`'s own raw paint timestamp
   * (the existing M1 stamp, never a new render hook). `null` whenever `firstPixelMs` is `null` -- see
   * `decodedToPaintedReason`. **P3i-b B1 (corrected structural claim):** `queryToFirstByteMs` +
   * `firstByteToDecodedMs` + `decodedToPaintedMs` sum to exactly `firstPixelMs` ALWAYS whenever all
   * four raw timestamps are present -- a telescoping chain on one shared clock, algebraically true
   * regardless of whether the step's first batch (any fate) is also its first ACCEPTED batch (this
   * file's own top doc comment has the full account, including B2's mixed-batch mislabeling case,
   * where the sum still holds but `decodedToPaintedMs` no longer means only "paint"). Recorded for a
   * scorer to check, never enforced by this module -- see `segmentsSpanSingleBatch` for whether this
   * step's own labels can be trusted at face value. **Entry 31 (2026-09-03): the telescoping sum no
   * longer holds in a row where a clamp fired** -- the clamps below null one or two of the three
   * terms in exactly the cross-step rows; a scorer checking the B1 sum must skip rows carrying any
   * `"cross-step-stream"`/`"cross-step-stream-zero"` reason. */
  decodedToPaintedMs: number | null;
  /** Historically mirrored `firstPixelReason` exactly (this span's own numerator is `firstPixelMs`'s
   * raw timestamp). **Entry 31 (2026-09-03): no longer an exact mirror** -- the paint-arm-delayed
   * clamp in `endStep` can null this span (reason `"cross-step-stream"`) while `firstPixelMs` is
   * non-null and `firstPixelReason` is `undefined`. */
  decodedToPaintedReason?: SegmentReason;
  /** Entry 31 (2026-09-03, reviewer should-fix 5): `true` iff this step's cross-step signature
   * fired (raw `queryToFirstByteMs` <= 0 -- the step's first batch arrived at-or-before its first
   * issue record). In such a row `firstPixelMs` -- a §6-GATED quantity, unlike the reported-only
   * segments -- is computed against the same issue stamp the clamp just declared not a
   * measurement: it reads as arrival->paint, not query->paint (P12's pan-northeast 513.6ms /
   * zoom-to-layer 125.8ms). Flagged, not nulled: the value is still a real span on a real clock,
   * it just does not mean what the M1 label says in this row. Absent (`undefined`) when clean. */
  firstPixelCrossStepSuspect?: boolean;
  /** P3i-b B2 (instrument mini-review): `true` iff the batch that armed `firstBatchArrived` (the
   * step's first ACCEPTED batch, M1's own criterion) was ALSO the step's very first batch overall,
   * any fate -- i.e. `queryToFirstByteMs`/`firstByteToDecodedMs` (keyed on "first batch, any fate")
   * and `decodedToPaintedMs`/`firstPixelMs` (keyed on "first ACCEPTED batch") describe the SAME
   * physical batch, so the three spans are honestly labeled, not merely arithmetically summing.
   * `false` in the mixed refused-then-accepted case this file's own top doc comment (B2) discloses --
   * `decodedToPaintedMs` still sums correctly but silently absorbs a LATER batch's own transport+
   * decode time, mislabeled as pure paint time. Defaults to `true` (vacuously) when
   * `firstBatchArrived` never arms this step at all (no accepted batch -- nothing to mislabel);
   * captured exactly once, the FIRST time `firstBatchArrived` arms, never re-evaluated by a later
   * accepted batch the same step (`recordBatch`'s own doc comment has the capture-site detail,
   * including why `batchesReceived === 1` alone -- the reviewer's original sketch -- needed
   * `batchesRefused === 0` added to it). */
  segmentsSpanSingleBatch: boolean;
  /** M3: one raw timestamp per REAL render observed while the step was active (`WorkingCanvas.tsx`'s
   * own persistent per-step `onAfterRender` hook, via `recordResidencyRenderTick`) -- p50/p95 are the
   * driver's own job (§6), never computed here. */
  frameTimestamps: number[];
  /** S9: `true` iff `frameTimestamps` hit `MAX_FRAME_TIMESTAMPS` and further renders were observed
   * but not recorded -- an honest cap flag, never a silent truncation. */
  frameTimestampsTruncated: boolean;
  /** One entry per input event whose next render was observed before `endStep` -- each entry is that
   * render's timestamp minus the input event's own timestamp. A PROXY (§6's own "Input-to-present
   * proxy" row: "client clock, pointer/keyboard event → next composited frame carrying its effect"),
   * not a true present-time measurement -- reported, never gated. **Disclosed divergence from §6's
   * own text (M4, carried into evidence per S13):** this proxy resolves against the NEXT
   * `recordFrame` (a real deck.gl `onAfterRender` fire while armed), not against the browser's own
   * compositor-present event -- deck.gl's `onAfterRender` fires once its WebGL draw call issues,
   * which the browser's compositor may actually present on a later frame boundary than this
   * timestamp reflects, and is only observed for the window between `residencyArmFirstPixel` and
   * `residencyDisarmFirstPixel` (both driver-controlled), not for the app's whole lifetime. */
  inputToPresentProxiesMs: number[];
  /** S9: same truncation discipline as `frameTimestampsTruncated`, for `inputToPresentProxiesMs`. */
  inputToPresentProxiesTruncated: boolean;
}

interface ActiveStep {
  stepId: string;
  counters: ResidencyStepCounters;
  /** M1: the step's own clock origin -- the timestamp of the FIRST `recordStreamIssued` call this
   * step observed, or `null` if none has fired yet. */
  firstStreamIssuedAtMs: number | null;
  /** M1: has this step's first ACCEPTED (non-refused) batch arrived yet. */
  firstBatchArrived: boolean;
  firstPixelMs: number | null;
  /** P3i: raw `performance.now()`-scale companion to `firstPixelMs` (which stores the already-computed
   * delta) -- needed so `endStep` can derive `decodedToPaintedMs` (a delta against
   * `firstBatchDecodedAtMs`, another raw timestamp) without re-deriving `firstStreamIssuedAtMs +
   * firstPixelMs` (equivalent arithmetically, but this is the more direct source). Set at the exact
   * same call, in `recordFrame`, that sets `firstPixelMs`. */
  firstPixelAtMs: number | null;
  /** P3i: one-shot -- the timestamp of the FIRST `recordBatchArrived` call this step observes, any
   * accept/refuse fate (this file's own top doc comment). `null` until that first call. */
  firstBatchArrivedAtMs: number | null;
  /** P3i: one-shot -- the timestamp of the FIRST `recordBatchDecoded` call this step observes, paired
   * 1:1 with `firstBatchArrivedAtMs` in practice (synchronous decode). `null` until that first call. */
  firstBatchDecodedAtMs: number | null;
  /** P3i-b B2: mirrors `ResidencyStepResult.segmentsSpanSingleBatch`'s own doc comment -- captured
   * once, in `recordBatch`, the first time `firstBatchArrived` arms this step; `true` until then
   * (the field's own default-vacuous-true, matching the returned snapshot's own default). */
  segmentsSpanSingleBatch: boolean;
  frameTimestamps: number[];
  frameTimestampsTruncated: boolean;
  inputToPresentProxiesMs: number[];
  inputToPresentProxiesTruncated: boolean;
  pendingInputAtMs: number | null;
}

/**
 * Pure state machine, no DOM/timer of its own -- `nowMs`/frame ticks are always handed in by the
 * caller (the DEV-only wiring below, or a test's synthetic clock). Every mutator no-ops unless a
 * step is active (`beginStep` was called and `endStep` has not yet consumed it) -- one level below
 * this module's own top-level "off means zero work" discipline: a `recordX` call between `endStep`
 * and the next `beginStep` costs one null check, exactly like a disabled instrument costs one
 * boolean check above.
 */
export class ResidencyInstrumentCore {
  private active: ActiveStep | null = null;

  get isStepActive(): boolean {
    return this.active !== null;
  }

  /** P3i-b S6: `true` once this step's one-shot `firstBatchArrivedAtMs` marker is already set --
   * exposed so the DEV-only singleton wrapper below can check this BEFORE computing a
   * `performance.now()` reading at all, rather than always reading the clock and handing it to
   * `recordBatchArrived`, which would then discard it internally on every call after the step's
   * first (the one-shot check was always correctly placed AHEAD of the STORE inside that method --
   * S6's finding is that the wrapper's own clock READ happened unconditionally, one level further
   * out, where this class could not previously be consulted first). */
  get firstBatchArrivedRecorded(): boolean {
    return this.active !== null && this.active.firstBatchArrivedAtMs !== null;
  }

  /** P3i-b S6: mirrors `firstBatchArrivedRecorded` for `firstBatchDecodedAtMs`/`recordBatchDecoded`. */
  get firstBatchDecodedRecorded(): boolean {
    return this.active !== null && this.active.firstBatchDecodedAtMs !== null;
  }

  beginStep(stepId: string, _nowMs: number): void {
    // `_nowMs` kept as a parameter (unused beyond documenting call-time) for API stability with
    // existing callers/tests -- M1 moved the step's own clock origin to the first
    // `recordStreamIssued` timestamp, not `beginStep`'s own argument, so it is no longer stored here.
    this.active = {
      stepId,
      counters: zeroCounters(),
      firstStreamIssuedAtMs: null,
      firstBatchArrived: false,
      firstPixelMs: null,
      firstPixelAtMs: null,
      firstBatchArrivedAtMs: null,
      firstBatchDecodedAtMs: null,
      segmentsSpanSingleBatch: true, // P3i-b B2: vacuously true until firstBatchArrived arms
      frameTimestamps: [],
      frameTimestampsTruncated: false,
      inputToPresentProxiesMs: [],
      inputToPresentProxiesTruncated: false,
      pendingInputAtMs: null,
    };
  }

  /** Ends the active step and returns its snapshot, or `null` if no step was active. Idempotent: a
   * second call before the next `beginStep` returns `null`, never a stale or duplicate snapshot. */
  endStep(): ResidencyStepResult | null {
    if (!this.active) return null;
    const s = this.active;
    this.active = null;

    let firstPixelReason: FirstPixelReason | undefined;
    if (s.firstPixelMs === null) {
      if (s.counters.streamsIssued === 0) {
        firstPixelReason = "no-query";
      } else if (s.counters.batchesReceived === 0) {
        firstPixelReason = "no-batch";
      } else {
        firstPixelReason = "no-paint";
      }
    }

    // P3i-b S5: each span below is derived from ITS OWN operands directly -- never from one shared
    // variable computed off a single different null-check (the earlier `arrivalReason`, keyed only
    // on `firstBatchArrivedAtMs === null`, could leave a span's own reason `undefined` beside a
    // `null` value whenever THAT span's own null cause was something `arrivalReason`'s one check
    // didn't cover -- see S5's own report for both holes this closes: `firstByteToDecodedMs` null
    // because `firstBatchDecodedAtMs` alone is null (arrival happened, decode did not -- S7's
    // qualified "believed unreachable" case), and `queryToFirstByteMs` null because
    // `firstStreamIssuedAtMs` alone is null while `firstBatchArrivedAtMs` is somehow non-null, an
    // ordering violation this pure state machine does not itself prevent). Both are guarded here even
    // though neither is believed reachable in a clean trial.
    let queryToFirstByteMs: number | null = null;
    let queryToFirstByteReason: SegmentReason | undefined;
    if (s.firstStreamIssuedAtMs === null) {
      queryToFirstByteReason = "no-query";
    } else if (s.firstBatchArrivedAtMs === null) {
      queryToFirstByteReason = "no-batch";
    } else {
      queryToFirstByteMs = s.firstBatchArrivedAtMs - s.firstStreamIssuedAtMs;
    }

    let firstByteToDecodedMs: number | null = null;
    let firstByteToDecodedReason: SegmentReason | undefined;
    if (s.firstStreamIssuedAtMs === null) {
      firstByteToDecodedReason = "no-query";
    } else if (s.firstBatchArrivedAtMs === null) {
      firstByteToDecodedReason = "no-batch";
    } else if (s.firstBatchDecodedAtMs === null) {
      // S7's qualified case: arrival was observed, decode never was -- believed unreachable given
      // synchronous decode, guarded anyway rather than left to fall through to `undefined`.
      firstByteToDecodedReason = "no-batch";
    } else {
      firstByteToDecodedMs = s.firstBatchDecodedAtMs - s.firstBatchArrivedAtMs;
    }

    let decodedToPaintedMs: number | null = null;
    let decodedToPaintedReason: SegmentReason | undefined = firstPixelReason;
    if (s.firstBatchDecodedAtMs !== null && s.firstPixelAtMs !== null) {
      decodedToPaintedMs = s.firstPixelAtMs - s.firstBatchDecodedAtMs;
      decodedToPaintedReason = undefined;
    }

    // S5: the negative-span clamp -- see `SegmentReason`'s own doc comment for the full rationale.
    // Applied last, after each span's own honest value/reason pair above is already computed, so a
    // clamp never has to re-derive anything -- it only ever downgrades an already-honest `{ms,
    // reason}` pair to a `{null, "cross-step-stream"}` one.
    //
    // Entry-31 fix (2026-09-03), two tightenings, both attribution-pass-traced
    // (spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md §2), the second's predicate
    // corrected by this change's own reviewer gate:
    // (1) `queryToFirstByteMs`'s clamp is `<= 0`, not `< 0` -- a delta of exactly 0 is the same
    //     arrival-before-issue call chain landing inside one clock quantum, never a measurement
    //     (see `SegmentReason`'s doc comment for why 0 is impossible for this span alone).
    // (2) `decodedToPaintedMs` is invalidated iff the step's issue record POSTDATES its decode
    //     record: only then could the paint stamp not arm at decode time (`recordFrame`'s
    //     `firstStreamIssuedAtMs !== null` guard), so the span measures "decode -> waiting for
    //     any issue record -> next frame" -- 13.6s/16.4s in P12's zoom-in-3/zoom-out-1 rows --
    //     not paint. The cross-step SIGN signature alone (raw span <= 0) does NOT imply this:
    //     in P12's four in-chain quantum rows (pan-east, zoom-in-2, pan-northeast,
    //     zoom-to-layer) the issue record precedes the decode, the stamp was armable on time,
    //     and their decodedToPaintedMs values (15-501ms) are genuine paint measurements --
    //     nulling those would have destroyed the very evidence the attribution pass's verdict
    //     rests on (the reviewer's must-fix 2). `firstByteToDecodedMs` always stays: arrival ->
    //     decode of that same batch is a real decode cost regardless of which step issued the
    //     stream.
    const crossStepDetected = queryToFirstByteMs !== null && queryToFirstByteMs <= 0;
    const paintArmDelayed =
      s.firstStreamIssuedAtMs !== null &&
      s.firstBatchDecodedAtMs !== null &&
      s.firstStreamIssuedAtMs > s.firstBatchDecodedAtMs;
    if (crossStepDetected) {
      queryToFirstByteReason = queryToFirstByteMs! < 0 ? "cross-step-stream" : "cross-step-stream-zero";
      queryToFirstByteMs = null;
    }
    if (firstByteToDecodedMs !== null && firstByteToDecodedMs < 0) {
      firstByteToDecodedMs = null;
      firstByteToDecodedReason = "cross-step-stream";
    }
    if (decodedToPaintedMs !== null && (decodedToPaintedMs < 0 || paintArmDelayed)) {
      decodedToPaintedMs = null;
      decodedToPaintedReason = "cross-step-stream";
    }

    return {
      stepId: s.stepId,
      counters: s.counters,
      firstPixelMs: s.firstPixelMs,
      firstPixelReason,
      queryToFirstByteMs,
      queryToFirstByteReason,
      firstByteToDecodedMs,
      firstByteToDecodedReason,
      decodedToPaintedMs,
      decodedToPaintedReason,
      ...(crossStepDetected ? { firstPixelCrossStepSuspect: true } : {}), // entry 31, should-fix 5
      segmentsSpanSingleBatch: s.segmentsSpanSingleBatch, // P3i-b B2
      frameTimestamps: s.frameTimestamps,
      frameTimestampsTruncated: s.frameTimestampsTruncated,
      inputToPresentProxiesMs: s.inputToPresentProxiesMs,
      inputToPresentProxiesTruncated: s.inputToPresentProxiesTruncated,
    };
  }

  /** M1: `nowMs` is the moment the query actually issued -- the FIRST call this step observes sets
   * the step's own clock origin (`firstStreamIssuedAtMs`); later calls within the same step only
   * increment the counter. */
  recordStreamIssued(nowMs: number): void {
    if (!this.active) return;
    this.active.counters.streamsIssued++;
    if (this.active.firstStreamIssuedAtMs === null) {
      this.active.firstStreamIssuedAtMs = nowMs;
    }
  }

  /** M6: pairs with `recordStreamIssued` -- one call per terminal transition, whatever its kind
   * (`viewportStreamManager.ts`'s own single call site, `sink.onTerminal`). */
  recordStreamEnded(): void {
    if (!this.active) return;
    this.active.counters.streamsEnded++;
  }

  /** M2: `refused` splits decoded-and-accepted from decoded-and-refused counting. A refused batch
   * never renders anything new, so it never arms `firstBatchArrived` either (M1).
   *
   * **P3i-b B2: `segmentsSpanSingleBatch` captured here, exactly once, the first time this call arms
   * `firstBatchArrived`.** The reviewer's original sketch was `counters.batchesReceived === 1` alone
   * (after this call's own increment) -- verified against the actual counter semantics and found
   * insufficient on its own: `batchesReceived` only counts ACCEPTED batches, so a batch refused
   * earlier this step leaves it at `0` right up until this call, satisfying `=== 1` after increment
   * even though a refusal genuinely preceded it (exactly the mixed case B2 exists to detect).
   * `batchesRefused === 0` closes that gap: together, `batchesReceived === 1 && batchesRefused === 0`
   * at the moment `firstBatchArrived` arms means this accepted batch is BOTH the step's first
   * accepted batch AND its first batch of any fate -- the two markers this file's own top doc
   * comment discusses (`firstBatchArrivedAtMs`/`firstBatchDecodedAtMs`) describe this SAME batch. */
  recordBatch(features: number, bytes: number, refused: boolean): void {
    if (!this.active) return;
    if (refused) {
      this.active.counters.batchesRefused++;
      this.active.counters.featuresRefused += features;
      this.active.counters.bytesRefused += bytes;
      return;
    }
    this.active.counters.batchesReceived++;
    this.active.counters.featuresDecoded += features;
    this.active.counters.bytesDecoded += bytes;
    if (!this.active.firstBatchArrived) {
      this.active.segmentsSpanSingleBatch =
        this.active.counters.batchesReceived === 1 && this.active.counters.batchesRefused === 0;
    }
    this.active.firstBatchArrived = true;
  }

  /** `tilesRequested` increment -- P3w's own placeholder, wired by P3i (this piece,
   * `candidateArmSession.ts`'s `countTileStreamIssuedOnce`, once per real per-tile fetch). Never
   * called by the baseline arm. */
  recordTileRequested(): void {
    if (!this.active) return;
    this.active.counters.tilesRequested++;
  }

  /** P3i: `count` is the caller's own pre-aggregated total for ONE `pushTileBatch` call (`tileIngest
   * .ts`'s `outcome.duplicatesDropped`) -- summed across the step, not called once per duplicate. */
  recordDuplicatesDropped(count: number): void {
    if (!this.active) return;
    this.active.counters.duplicatesDropped += count;
  }

  /** P3i: `count` is the caller's own pre-aggregated total for ONE `pushTileBatch` call
   * (`outcome.evictedTileKeys.length`) -- summed across the step, not called once per evicted tile. */
  recordEvictionsApplied(count: number): void {
    if (!this.active) return;
    this.active.counters.evictionsApplied += count;
  }

  /** P3i: called once per batch's own data-plane bytes arriving, at each arm's own manager
   * batch-arrival hook -- BEFORE decode. One-shot per step: only the FIRST call sets
   * `firstBatchArrivedAtMs`; this file's own top doc comment has the full "honest earliest hook"
   * account (a DEFINED PROXY for "first byte," never a true first-TCP-byte timestamp -- this
   * codebase's transport layer hands a fully-received message to `StreamSink.onBatch` in one call,
   * with no lower-level hook this shell can observe). */
  recordBatchArrived(nowMs: number): void {
    if (!this.active) return;
    if (this.active.firstBatchArrivedAtMs === null) {
      this.active.firstBatchArrivedAtMs = nowMs;
    }
  }

  /** P3i: called once per batch's decode completing, around `WorkingCanvas.tsx`'s own `decodeBatch`
   * call. One-shot per step, pairing 1:1 with `recordBatchArrived` in practice (this file's own top
   * doc comment: decode is synchronous and immediate after arrival in this codebase's ingest path). */
  recordBatchDecoded(nowMs: number): void {
    if (!this.active) return;
    if (this.active.firstBatchDecodedAtMs === null) {
      this.active.firstBatchDecodedAtMs = nowMs;
    }
  }

  /**
   * M3: called once per REAL render observed while a step is active -- `WorkingCanvas.tsx`'s own
   * persistent per-step `onAfterRender` hook, never a `requestAnimationFrame` tick. Three things
   * happen on every call, in order: (1) the render's timestamp is appended to the frame series
   * (S9-capped); (2) any pending input-to-present proxy resolves against THIS render (the FIRST one
   * observed after `recordInput`); (3) M1's first-pixel stamp fires, exactly once, the FIRST time
   * this is called after BOTH a stream has issued and its first accepted batch has arrived --
   * never from a render caused by the step's own input gesture alone, since a gesture-only render
   * (no new batch yet) leaves `firstBatchArrived` false and this stamp does not fire.
   */
  recordFrame(nowMs: number): void {
    if (!this.active) return;
    const s = this.active;

    if (s.frameTimestamps.length < MAX_FRAME_TIMESTAMPS) {
      s.frameTimestamps.push(nowMs);
    } else {
      s.frameTimestampsTruncated = true;
    }

    if (s.pendingInputAtMs !== null) {
      if (s.inputToPresentProxiesMs.length < MAX_INPUT_PROXIES) {
        s.inputToPresentProxiesMs.push(nowMs - s.pendingInputAtMs);
      } else {
        s.inputToPresentProxiesTruncated = true;
      }
      s.pendingInputAtMs = null;
    }

    if (s.firstBatchArrived && s.firstPixelMs === null && s.firstStreamIssuedAtMs !== null) {
      s.firstPixelMs = nowMs - s.firstStreamIssuedAtMs;
      s.firstPixelAtMs = nowMs; // P3i: raw companion -- `firstPixelAtMs`'s own doc comment.
    }
  }

  /** Records an input event's timestamp -- resolved into `inputToPresentProxiesMs` by the NEXT
   * `recordFrame` call, per this class's own doc comment. A second input recorded before the pending
   * one resolves overwrites the pending timestamp (only the most recent unresolved input is tracked)
   * -- reported, never gated (§6), so this is not a loss any gate's scoring depends on. */
  recordInput(nowMs: number): void {
    if (!this.active) return;
    this.active.pendingInputAtMs = nowMs;
  }
}

// ---------------------------------------------------------------------------------------
// DEV-only singleton wiring -- the seam every product call site (WorkingCanvas.tsx,
// streaming/viewportStreamManager.ts, App.tsx, and, since P3i, streaming/tileViewportStreamManager.ts
// and residency/candidateArmSession.ts) reaches, each behind its OWN `import.meta.env.DEV` check at
// the call site (this module's own top doc comment explains why the check is duplicated there rather
// than relied on solely here).
// ---------------------------------------------------------------------------------------

const core = new ResidencyInstrumentCore();
let enabled = false;
/** M6: a driver-visible, session-wide (not step-scoped) in-flight `viewport_query` count -- a
 * request can legitimately still be in flight across a step boundary in principle, so this is not
 * reset by `beginStep`/`endStep`. S3: no-ops (stays untouched) while `enabled` is `false`, exactly
 * like every other counter in this module -- a `--control` run therefore always reads `0` here; a
 * disclosed limitation (this piece's own report), not a silent one. */
let inFlightStreamCount = 0;
/** P1d suggestion 10: a driver-visible, session-wide (mirroring `inFlightStreamCount`'s own scope,
 * not step-scoped) running total of bytes a superseded stream's batch carried when it arrived AFTER
 * its own supersession (`viewportStreamManager.ts`'s `onBatch` drop branch -- see that call site's
 * own doc comment: "a batch that arrives after its stream was superseded is dropped here, never
 * handed to the canvas"). These bytes are cheaply observable AT THE MANAGER (the payload has already
 * arrived; only forwarding it is skipped) -- `RESIDENCY-PREREGISTRATION.md` §6's own "Refill work per
 * step" row is reported-never-gated, and this closes what would otherwise be a silent under-count of
 * it: bytes genuinely received over the wire for a step whose supersession this driver's own
 * `bytesDecoded`/`bytesRefused` counters never see (neither counter fires for a dropped batch --
 * `recordResidencyBatch` is only ever called from `WorkingCanvas.tsx`'s `pushBatch`, which a dropped
 * batch never reaches). Kept SESSION-WIDE, not folded into `ResidencyStepCounters`, deliberately: a
 * supersede can legitimately straddle a step boundary (the same reasoning `inFlightStreamCount`'s own
 * doc comment gives), and adding a new field to the tested per-step counters shape was judged riskier
 * than a parallel, independently-read total for this piece's own bounded scope. */
let supersededBytesDropped = 0;

export function isResidencyInstrumentEnabled(): boolean {
  return enabled;
}

/** Flips the instrument on. Driver-only in practice (via a dev-only/measure-build-only E2E hook
 * `App.tsx` registers) -- a no-op, `enabled` staying `false`, outside a dev or measure build,
 * matching `registerE2eHook`'s own guard in `e2e-test-surface.ts`. This is the ONE function in this
 * module that checks a build-class gate itself, since it is the only place `enabled` can ever become
 * `true`.
 *
 * **P3r handoff, closed here (P3i-b):** `isInstrumentedBuild.ts`'s own top doc comment named this
 * exact line as the one gate its shared predicate could not reach when that piece landed --
 * `import.meta.env.DEV` alone, unlike every other DEV-only gate that piece's own scope touched, kept
 * this module's `enabled` flag permanently `false` even in the measure build
 * (`VITE_MEASURE_BUILD === "1"`), so the residency instrument itself could never actually turn on
 * inside the release-optimized-but-instrumented measure artifact -- Amendment 16's whole point.
 * Replaced with `isInstrumentedBuild()` (`true` for DEV OR the measure build, `false` for a plain
 * production build, same literal-replacement + dead-code-elimination guarantee `isInstrumentedBuild
 * .ts`'s own doc comment documents), the one line that makes the measure build's instrument live.
 * `disableResidencyInstrument` below is DELIBERATELY left on its own plain `import.meta.env.DEV`
 * guard -- out of this piece's own scope (P3r's handoff names this ONE line only) -- a disclosed
 * asymmetry: in a measure build, `enabled` can be flipped true here but `disableResidencyInstrument`
 * itself is a no-op, so nothing in THIS module can ever flip it back off within that same process.
 * Harmless for every validation this piece runs (module-load default is already `false`, and a plain
 * measure-build smoke never needs to re-disable mid-run), but a real gap for a later piece that needs
 * an ON-then-OFF toggle inside one measure-build session (e.g. a measure-build `--wire-identity` run,
 * not attempted by this piece). */
export function enableResidencyInstrument(): void {
  if (!isInstrumentedBuild()) return;
  enabled = true;
}

/** Flips the instrument off and discards any step in progress. DEV-gated for the same reason
 * `enableResidencyInstrument` is (symmetry; `enabled` is already `false` outside DEV regardless). */
export function disableResidencyInstrument(): void {
  if (!import.meta.env.DEV) return;
  enabled = false;
  // An honest reset -- a disabled instrument tracks nothing, matching every other "off means zero
  // work" mutator in this module; a driver reading this mid-disable sees 0, never a stale count.
  inFlightStreamCount = 0;
  supersededBytesDropped = 0; // P1d suggestion 10 -- same reset discipline as inFlightStreamCount.
  core.endStep();
}

/** Starts a new step -- resets the step-scoped counters/timings. M3: no longer starts any timer or
 * listener of its own (the old `requestAnimationFrame` loop is gone); the frame series is fed
 * exclusively by `recordResidencyRenderTick`, called from `WorkingCanvas.tsx`'s own persistent
 * per-step `onAfterRender` hook, armed separately by the driver via `residencyArmFirstPixel`. */
export function beginResidencyStep(stepId: string): void {
  if (!enabled) return;
  core.beginStep(stepId, performance.now());
}

/** Ends the active step and returns its snapshot -- `null` if the instrument is disabled or no step
 * was active. */
export function endResidencyStep(): ResidencyStepResult | null {
  if (!enabled) return null;
  return core.endStep();
}

export function recordResidencyStreamIssued(): void {
  if (!enabled) return;
  inFlightStreamCount++;
  core.recordStreamIssued(performance.now());
}

/** M6: pairs with `recordResidencyStreamIssued` -- called once per terminal transition
 * (`viewportStreamManager.ts`'s own single call site). */
export function recordResidencyStreamEnded(): void {
  if (!enabled) return;
  inFlightStreamCount = Math.max(0, inFlightStreamCount - 1);
  core.recordStreamEnded();
}

/** M6: driver-visible in-flight `viewport_query` count, read via the `residencyInFlightStreamCount`
 * E2E hook (`App.tsx`). Always `0` while disabled (S3) -- see this module's own `inFlightStreamCount`
 * doc comment for the disclosed control-arm limitation that follows from that. */
export function getResidencyInFlightStreamCount(): number {
  return inFlightStreamCount;
}

/** M2: `refused` is `true` for a batch a declared ceiling refused (nothing was added to residency),
 * `false` for one `ResidentSet.addBatch` actually admitted. */
export function recordResidencyBatch(features: number, bytes: number, refused: boolean): void {
  if (!enabled) return;
  core.recordBatch(features, bytes, refused);
}

/** P3i: called at each arm's own manager batch-arrival hook -- `viewportStreamManager.ts`'s and
 * `tileViewportStreamManager.ts`'s own `sink.onBatch` (the "still active" branch, never the
 * dropped/superseded one), and `candidateArmSession.ts`'s own untiled "first look" sink -- BEFORE
 * decode. `ResidencyInstrumentCore.recordBatchArrived`'s own doc comment has the full "honest
 * earliest hook" account. */
export function recordResidencyBatchArrived(): void {
  if (!enabled) return;
  core.recordBatchArrived(performance.now());
}

/** P3i: called from `WorkingCanvas.tsx`'s own `pushBatch`/`pushTileBatch`, right after their shared
 * `decodeBatch` call completes -- `ResidencyInstrumentCore.recordBatchDecoded`'s own doc comment. */
export function recordResidencyBatchDecoded(): void {
  if (!enabled) return;
  core.recordBatchDecoded(performance.now());
}

/** P3i: called from `candidateArmSession.ts`'s own `countTileStreamIssuedOnce` -- once per real
 * per-tile fetch the candidate arm issues, deduped by tile key. Never called by the baseline arm. */
export function recordResidencyTileRequested(): void {
  if (!enabled) return;
  core.recordTileRequested();
}

/** P3i: called from `WorkingCanvas.tsx`'s own `pushTileBatch`, once per call, with that call's own
 * pre-aggregated `outcome.duplicatesDropped` total (`tileIngest.ts`). Never called for baseline's
 * `pushBatch`, which has no tile-keyed dedupe concept. */
export function recordResidencyDuplicatesDropped(count: number): void {
  if (!enabled) return;
  core.recordDuplicatesDropped(count);
}

/** P3i: called from `WorkingCanvas.tsx`'s own `pushTileBatch`, once per call, with that call's own
 * pre-aggregated `outcome.evictedTileKeys.length` total. Never called for baseline's `pushBatch`,
 * which has no per-tile eviction concept. */
export function recordResidencyEvictionsApplied(count: number): void {
  if (!enabled) return;
  core.recordEvictionsApplied(count);
}

/** P1d suggestion 10: called from `viewportStreamManager.ts`'s own `onBatch` drop branch, once per
 * batch that arrived AFTER its stream was superseded -- never counted by `recordResidencyBatch`
 * above (a dropped batch never reaches `WorkingCanvas.tsx`'s `pushBatch`, the only caller of that
 * function). See `supersededBytesDropped`'s own doc comment for why this is a session-wide total,
 * not a per-step counter. */
export function recordResidencySupersededBytes(bytes: number): void {
  if (!enabled) return;
  supersededBytesDropped += bytes;
}

/** P1d suggestion 10: driver-visible total, read via the `residencySupersededBytesDropped` E2E hook
 * (`App.tsx`). Always `0` while disabled, the same disclosed control-arm limitation
 * `getResidencyInFlightStreamCount`'s own doc comment already names for its sibling counter. */
export function getResidencySupersededBytesDropped(): number {
  return supersededBytesDropped;
}

/** M3: called from `WorkingCanvas.tsx`'s own persistent per-step `onAfterRender` hook, once per REAL
 * render observed while armed -- replaces the old one-shot `recordResidencyAfterRender` AND the old
 * `requestAnimationFrame`-driven frame-time loop at once (both fed a stamp from a DIFFERENT event;
 * this single call now feeds both concerns from the SAME real render event, `ResidencyInstrumentCore
 * .recordFrame`'s own doc comment has the full mechanism). */
export function recordResidencyRenderTick(): void {
  if (!enabled) return;
  core.recordFrame(performance.now());
}

export function recordResidencyInput(): void {
  if (!enabled) return;
  core.recordInput(performance.now());
}
