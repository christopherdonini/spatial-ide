# Preregistration — residency-debt cut (1b)

**Committed before the fixes are written.** This is a **correctness cut, not a perf cut**: it makes
no perf claim, adds no docs/08 row, and has no p50/p95 gate (the docs/08 no-numbers discipline
cuts both ways — inventing a perf gate for a principle-7/8 fix would be its own violation, architect
consult 2026-09-04 Q4). "Preregistered" here means: the block-on-sight conditions and the specific
test cases below are fixed by this commit, so each fix is judged against a stated bar, not a
post-hoc "looks fixed." Everything is **asserted-by-test**; the only operator evidence is the
**felt re-verdict at the headed sitting** (analogous to Part K), never a metric.

Authority: Item A is what 1a convicted (docs/01 principle 7 gap, `spikes/viewport-residency-1a-diagnosis/`).
Item B is directed by ADR-028 Amendment 1 + principle 8 (not diagnosed by 1a). Item C is
human-ruled-in (DECISIONS-PENDING entry 29) off Part K's K6 finding + ADR-010 rule 6. All three
carry accepted-ruling authority; the architect consult (2026-09-04, task abddd70ccbfc422b1) is
"pass with notes."

## Two forks the human owns before Item A/B code lands (queued: DECISIONS-PENDING entries 32, 33)

Item A's mechanism shape is not fully determined until these are ruled. Item C is unblocked and
proceeds regardless.

- **Entry 32 — Cancel semantics (operator-facing behavior change).** Repoint the existing Cancel
  button from "kill tiling for this dataset" to "stop filling, keep the view, allow future tiling,"
  or add a second affordance. A felt/UX call, not architecture.
- **Entry 33 — scoped-lever depth.** Does the relief lever cancel in-flight streams too, or only
  drop the queued backlog (leaving in-flight to finish productively)? Both are honest; the choice
  changes the settled/relinquished wording.

Standard, not a pre-block: the settled-partial / stalled **status wording and shape** go to the
human on sight at the implementing PR (24(b) precedent), and whether the headed sitting also runs
a **scored campaign** (which would adopt the queued 5 GB trial + heap fold-in + #31 defects) is the
human's call, not compelled by these correctness fixes (queued note, entry 34).

## Item A — scoped cancellation + honest progress for the held queue

**The gap (verified):** `TileViewportStreamManager.stop()` sets `stopped = true`
(`tileViewportStreamManager.ts:413`) with no reset anywhere but the constructor (`:142`); every
later `onCameraChange` short-circuits (`:249`). The operator Cancel is wired straight to it
(`App.tsx:1233-1236`). `drainQueueIfRoom` refuses while over budget (`:448`); only a camera change
clears the flag and drains (`:233`). So the only lever reaching a held queue is a permanent kill
switch — a docs/01 principle 7 violation (`docs/01_Principles.md:13`).

**Design (client-side, no wire):**
- A new manager method (working name `relinquishOutstanding()`) modeled on `clearAll` (`:368-392`),
  NOT on `stop`: drops the queued backlog (bump `issueEpoch` per dropped tile, report each drop),
  never sets `stopped`, never clears `this.frame`, never reports residency superseded. Whether it
  also cancels in-flight (via the existing `cancel` SKP command, ADR-018 — no new wire) is entry 33.
- Session seam: a new entry on the `CandidateArmSession` interface (`candidateArmSession.ts:166-194`),
  which App's candidate Cancel path calls instead of `manager.stop()` (subject to entry 32).
- Honest progress signal, a pure function of manager state (no timer, no producer signal):
  **stalled** iff `queuedCount > 0 && overBudgetFlag && !hasHeadroom()`; **filling** while
  `inFlightCount > 0` and not stalled; **settled** = Item B; **relinquished** = the lever fired.
  Computed in the session (already owns `hasOutstandingWork`/`syncScanLiveness`, `:297-316`),
  surfaced through the existing `ResidencyStatusEvent` union (`residencyStatus.ts:50-56`) — one
  arm-aware state machine, not a second signal.

**Test cases (pre-committed):**
1. The scoped lever relieves the queue AND a subsequent `onCameraChange` still plans (`stopped`
   never set — BS1).
2. Every tile dropped by the lever emits a reported, distinguishable event — distinct from an
   out-of-view supersede and from a budget self-cancel (BS2, matching `:124-129`).
3. The stall predicate reads stalled exactly under `queuedCount > 0 && overBudget && !hasHeadroom`,
   and filling otherwise while in-flight > 0 (BS3). No measured stall frequency is claimed (1a
   declined to estimate one).

## Item B — the settled-partial signal (depends on A)

**Predicate, pure function of client-observable state:**
`isSettled = hasPlanned && !pendingViewportChange && manager.trackedTileCount === 0`.
Classification (orthogonal, only when settled): **settled-complete** = today's `isFillComplete`
(`candidateArmSession.ts:379-392`); **settled-partial** = settled AND
`(overBudget || lastCoveringTruncated || some covering tile partial/missing)`. Inputs are exactly
`isFillComplete`'s current surface plus `pendingViewportChange` — a modest generalization of an
existing pure function.

**Amendment-1-aware:** the reopening chain (evict frees vertices → headroom reopens → issuance
reopens) can only fire during a live admission (`trackedTileCount > 0`), which the predicate
excludes; so a settled reading is never taken from a state where Amendment 1's partial-covering
eviction can still fire.

**Test case (pre-committed, pure, no DOM):** over-budget with a durably-partial covering tile +
queued work (not settled) → evict the partial covering tile (frees vertices) → next `onCameraChange`
with headroom re-admits a queued tile (still not settled, `trackedTileCount > 0`) → all terminate →
settled, classified settled-partial (still over budget). Exercises the reopening case AND the
Amendment-1 clause (BS5). No false-finality claim; `viewportTotal` stays `null` (BS6).

Surface: a refinement of the existing `candidate-over-budget` status variant
(`residencyStatus.ts:26-40`) — a `settled` field or a `candidate-settled-partial` variant threaded
through `nextResidencyStatus`/`residencyStatusText` — NOT a second parallel signal. Wording on
sight (entry 32/33-adjacent, 24(b)).

## Item C — K6 hover staleness (independent, unblocked)

**The defect (DECISIONS-PENDING entry 29):** hover a feature fully zoomed in, keep the pointer
stationary, zoom out — the sub-pixel id readout persists past the zoom where a fresh hover would
refuse by name, because the refusal is not re-evaluated on camera change while the pointer is
stationary. Pick/hover path only (`WorkingCanvas.tsx` hover site `:1221-1244`, `pickResolution.ts`),
disjoint from A/B.

**Design:** on camera change, re-run the declared pick-resolution threshold at the new zoom against
the standing hover; if below resolution, replace the readout with the named refusal (ADR-010 rule
6, ADR-028 item 4) — never keep a stale id, never fabricate a coordinate (ADR-010 rule 2).

**Escape hatch (human-ruled):** if honest re-evaluation needs more than re-running the declared
threshold at the new zoom — e.g. a full re-pick because the feature under the stationary pointer
changed — Item C **exits to the decision queue** rather than expanding 1b silently (BS7).

**Test case (pre-committed):** its own E2E step — hover fully zoomed in, pointer stationary, zoom
out, assert the readout re-evaluates to the named refusal.

## Block-on-sight conditions (architect consult §5)

- **BS1** No new relief lever sets `stopped` or disables future `onCameraChange`. (P7)
- **BS2** Every lever-dropped tile is reported, distinguishable from supersede and from self-cancel
  (`:124-129`). (P7, ADR-010 rule 5/7)
- **BS3** Filling/stalled is a pure function of `overBudget/queuedCount/inFlightCount/hasHeadroom`;
  no producer scan-progress (ADR-029/SKP-V0 §4 item 5), no SKP field (ADR-004 Amendment 4). (P7, P8)
- **BS4** Renderer/frontends-shell-scoped; the only protocol touch permitted is the existing
  `cancel` command (ADR-018). Any new SKP message reopens ADR-010 rule 1 and needs its own ADR.
- **BS5** Settled predicate is pure; a unit test constructs the reopening case AND the
  partial-covering-eviction case, both not-settled; never declared while `trackedTileCount > 0` or
  a re-plan is pending. (P8, ADR-010 rule 5, ADR-028 Amendment 1)
- **BS6** No completeness/finality claim over a partial/truncated/mid-fill set (the twice-convicted
  "Showing all N" class); `viewportTotal` stays `null`. (P8, docs/08)
- **BS7** Item C refuses by name, never keeps a stale id, never fabricates a coordinate; exits to
  the queue if it needs more than re-running the declared threshold. (ADR-010 rules 2/6, ADR-028 item 4)
- **BS8** All three are ephemeral/derived-state ops (ADR-010 rule 5): none is a workspace mutation
  (ADR-006 class 2) or external side effect (class 3); nothing approval-gated, nothing undoable.
- **BS9** 1b touches neither request-identity keying nor the LOD line; if any change moves the
  gate-8 measured step-classes, an anti-regression re-measure is owed before claiming no regression
  (G7/L7) — but 1b asserts no perf claim of its own.

ADR-010 architect-blockable surfaces: rule 5 (A's reported drops, B's staleness signal), rule 6
(C's declared pick resolution), rule 7 (A's observable progress), rule 1 (only if a wire message is
added — BS4 forbids).

## The missing contract — ADR-028 Amendment 2 (or child ADR), human's choice

The scoped-relief lever + quiescence signal are anticipated by ADR-028 (named 1b debt; Amendment 1
requires the settled predicate) but their semantics are not yet recorded. To be filed as ADR-028
Amendment 2 (append-only) or a small child ADR cross-referencing ADR-028 — the architect drafted a
skeleton (consult §"Drafted skeleton"); the custodian files it for the human's approval alongside
the implementing PR, not before the forks (entries 32/33) are ruled.

## Sequencing

A before B (dependency). C parallelizable and unblocked — proceeds now. A/B implementation waits on
entries 32/33. Reviewer gate before every merge. At close: **C's E2E felt-verification and the
human's felt re-verdict stay human-present** (24(g) unchanged for felt verdicts). **The 5 GB
clean-instrument attribution trial is reported-only, so under the 2026-09-04 amendment to 24(g)
(DECISIONS-PENDING) it MAY run unattended with RustDesk stopped, gated on the one-time
kill-and-restore dry-run passing first** — it no longer has to wait for the human-present sitting.
Then rule-10 archive, then the LOD scheduling call.

## Forks resolved (2026-09-05, appended — the human's rulings, before any Item A/B code)

- **Entry 32 → (a), repoint Cancel**, with the rider: the post-relief status states the
  partiality per the 24(b) discipline — **a user-stopped fill never reads as complete.**
- **Entry 33 → (b), cancel in-flight too** via the existing `cancel` SKP command (ADR-018, no new
  wire), the human overruling the drop-queue-only recommendation on the attribution pass's own
  evidence: at 5 GB single streams run tens of seconds, so "settles within seconds" fails exactly
  where the button matters most, and Part K's verdict was about buttons that visibly obey; ≤3
  tiles of class-1 replayable work is the acceptable price for Cancel meaning cancel. **Rider:
  cancellation is asserted as a PROPERTY with ADR-018 instants (interval labels wherever an
  interval is even mentioned), never timed** — no "cancels within X ms" claim anywhere in 1b.
- **Entry 34 → (c)**, decided at the sitting's own scheduling, leaning correctness-only.

**Item A's test cases, amended accordingly (pre-committed here before the code):** the three
original cases stand, and case 4 is added — the lever issues a cancel for every in-flight stream
and the property holds: cancel issued, terminal observed, **no post-cancel batches admitted for
that stream's tile beyond the terminal**; asserted as a property, never a duration. Case 2's
"reported, distinguishable" now covers BOTH drop classes: queued-dropped and in-flight-cancelled,
each distinct from an out-of-view supersede and from a budget self-cancel.

## Item B input-list amendment (2026-09-05, appended — before the corrected code lands)

Item B's reviewer gate found the predicate as preregistered ("Inputs are exactly
`isFillComplete`'s current surface plus `pendingViewportChange`") **insufficient to satisfy this
file's own BS5/BS6**: the untiled first-look/reissue stream is exempt from `trackedTileCount`, so
in a filter-reissue window the predicate could read settled — and the status claim "filling has
stopped" / "Showing all N" — while that stream keeps delivering batches into the same view (the
exact false-claim class Item A's M1 convicted). **The input list therefore widens by one
client-observable session fact: `untiledStreamRunning: boolean`, forcing `not-settled` while
true.** Recorded here, dated, before the corrected code lands — a block-on-sight-driven
strengthening of the preregistered design, not a post-hoc loosening; no gate, scoring, or test
case weakens. The same gate's S2 is also taken as part of Item B's own surfacing obligation: the
settling moment itself (the last outstanding tile's terminal/supersede) now emits the status,
rather than the signal waiting for the next batch or camera change to become visible.

## Close-out fix piece — F1 geometric protection + F2 the settled-partial voice (2026-09-06, appended BEFORE any code)

**What fires this.** DECISIONS-PENDING entry 44: ADR-028 Amendment 1's own reopen condition
met, felt by the human at the Part L sitting (their words, verbatim in the entry), and their
ruling, verbatim: *"we either fix it and I re-do L5 to L9, otherwise is pointless."* Entry 43
(the silent truncated settle) rides with it — the architect consult (2026-09-06, pass with notes)
establishes the two must ship together: widening the covering set makes `isFillComplete()`
correctly stricter, which routes MORE states into the branch F2 exists to give a voice to;
F1 without F2 would increase silence.

**F1 — the protected set becomes geometric.** `TileViewportStreamManager.onCameraChange` already
computes the true covering set (`covering`/`coveringKeys`, `tileViewportStreamManager.ts:277-278`)
and discards it — `TilePlanOutcome` (`:365`) returns only `issued`/`queued`/`alreadyResident`, and
`candidateArmSession.ts:1281` rebuilds a PSEUDO-covering set from those three arrays, which omits
(i) tiles tracked from a prior round (`:316`) and (ii) candidates dropped for lack of headroom
(`:353`) — 1a Q2's gap, the thrash's seam. The fix: `TilePlanOutcome` gains `covering: string[]`
(every key `tilesCoveringBbox` returned this round), and `candidateArmSession.ts` uses it for BOTH
`lastCoveringTileKeys` (`:1281-1282`) and `applyTileViewportContext` (`:1285`). One seam, three
effects: eviction protection (`WorkingCanvas.tsx:1131` -> `tileIngest.ts:123` and the cascade
backstop `tileResidentSet.ts:335-341`), the `fits` recomputation (`WorkingCanvas.tsx:1161-1167`,
today blind to the very partials that caused over-budget), and the completeness claim
(`isFillComplete`, `candidateArmSession.ts:590`). ADR-028 item 3's rule is geometric — *"never
evict a tile intersecting the current viewport"* — and this makes the code say what the rule says.

**Declared absorbing state (named here so the PR and the re-run watch for it, not discover it).**
With in-view partials unevictable, an over-budget view with an all-in-view resident set has no
pressure valve: `fits` stays false while any in-view partial exists, over-budget stays latched,
`drainQueueIfRoom` refuses (`tileViewportStreamManager.ts:534-535`), and the exits are a real
pan/zoom — exactly string 4's own remedy — or a re-fetch that `hasHeadroom()` denies. A STABLE
declared partial view replaces a flickering one. Status in that state is one of two ALTERNATIVES
(not a sequence — they are mutually exclusive by construction, `residencyStatus.ts:75-76`): the
over-budget sentence + `STALLED_SUFFIX` iff tiles were queued before the flag latched
(`queuedCount > 0`), else at quiescence the over-budget sentence + `SETTLED_PARTIAL_SUFFIX`.
Non-regression, argued from code: P6b item 7's re-scan/trim/cancel thrash needs `hasHeadroom()`
true, and protection only ever ADDS resident vertices, so exposure is monotone-decreasing; the
Defect-A resume lever (`setOverBudget(false)` -> `drainQueueIfRoom()`, `:256`, called on every
camera change from `candidateArmSession.ts:1294`) is untouched. Amendment 2 reopen conditions
(1)/(3) are the watch at the re-run.

**F2 — the settled-partial voice.** `candidate-within-budget.settled` widens to
`"complete" | "partial" | "partial-failure"` (`residencyStatus.ts:52`, `:129`). At
`candidateArmSession.ts:693` the silent fall-through becomes an emission mirroring the
`partial-failure` branch (`:684-691`) and placed AFTER it, so failure keeps its own sentence:
`{kind:"candidate-within-budget", residentFeatureCount, settled:"partial"}`,
`standingWithinBudgetComplete = false`, return. Safer than the clearing dispatch by construction:
the sticky-relinquished refusal (`residencyStatus.ts:164-169`) covers this kind, whereas
`candidate-fill-progress` reduces to `null` unconditionally (`:192-193`). **String 6, a DRAFT for
the human's 24(b) sight, direction-free because the state has two causes** (truncation IS
farthest-first, `tileViewportStreamManager.ts:336-339`; a covering tile that never completed was
requested in row-major order, `:324`, so "farthest from centre" would be false for it):
*"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*
Never the word "all" (BS6). Truncation additionally gets ONE always-on `renderTrace` line per
truncating plan (pattern `renderTrace.ts:95`; always-on precedent `tileViewportStreamManager.ts:
550-553`) — justified as test/console observability, never as the operator disclosure, which is
the status line itself.

**The second finding this piece pins (structural, unobserved, NOT yet a defect until the test
says so).** A resident-but-partial covering tile is not `alreadyResident` (`:317` is wired to
`isTileCompleteInCandidateSet`, `candidateArmSession.ts:820`), becomes a fresh candidate (`:321`),
is dropped at `:353` while over budget without headroom, and so falls out of all three outcome
arrays — `isFillComplete()` cannot see it, `fits` can read true, and "Showing all N" could render
over a never-requested tile: ADR-028 Amendment 2 reopen condition (2), verbatim in the ADR. F1's
widened `lastCoveringTileKeys` closes it by construction; unit test 6 below is its pin.

**Pre-committed tests (all in existing files, existing idioms).**
1. `tileResidentSet.test.ts` — `planTileEviction` where the only room-maker is a resident,
   high-vertex tile in `viewportTileKeys`: `evict: []`, `overBudget: true`.
2. `candidateArmSession.test.ts` — THE ENTRY-44 PIN: after a plan round in which a covering tile
   is durably partial and untracked, the array passed to `applyTileViewportContext` CONTAINS that
   key (idiom: `(canvas.applyTileViewportContext as ...).mock.calls.at(-1)![0]`, cf. `:1169`).
3. `tileIngest.test.ts` — over-budget admission whose only distance-ordered candidate is an
   in-viewport partial: `evictedTileKeys` is `[]`, `overBudget` true (mirrors `:131`).
4. `residencyStatus.test.ts` — the exact string-6 draft for `settled: "partial"`, plus the guard
   `expect(text).not.toMatch(/\ball\b/i)`.
5. `candidateArmSession.test.ts` — within budget, settled, incomplete, no failure: exactly one
   `candidate-within-budget` event with `settled: "partial"`; never `"complete"`; never silence.
6. `candidateArmSession.test.ts` — a headroom-dropped in-viewport partial never yields
   `settled: "complete"` (the second finding's pin).
7. E2E (`residency-harness.mjs` or a sibling step, instrumented build only): at an over-budget
   zoom-out step, read `residencyGridFrame()`, recompute `tilesCoveringBbox(frame, level, bbox)`
   with the shell's own export, collect `evictedTileKeys` from `[render-trace] tile-ingest` lines,
   assert the intersection with the covering set is EMPTY; corroborate the step was genuinely
   over budget via `residencyQueuedTileCount()`. Two disclosures the assertion carries: it is
   instrument-gated (`WorkingCanvas.tsx:1027`), and the debounce window — between a gesture and
   its debounced plan the protected set describes the PREVIOUS bbox (`candidateArmSession.ts:1285`
   is the only refresh) — so evictions are evaluated post-settle, after the step's last plan.

**Scope fence.** ADR-006 class 1 / derived state only; NO wire change (ADR-010 rule 1 untouched;
tile keys never cross a boundary); ADR-010 rule 5 ("staleness is signalled, never silently
served") is architect-blockable and applies to the silent branch F2 removes; ADR-011 is not
cited either way, no per-tile origins, no LOD (the structural cure for overview zoom is the next
cut's, entry 44); entry 42 stays OUT (a `describe` extent is a wire change); the two named
binding-debt mechanisms (pan-west keying, zoom-to-layer admission window) stay untouched.
**No perf claim attaches in either direction** — F1 moves the resident set nearer
`MAX_RESIDENT_VERTICES` for longer at over-budget zoom-out, the same axis G4 measured; the L5-L9
re-run is a FELT re-verdict and is never presented as a G4 re-measure.

**Human-side, at PR sight (not the custodian's):** string 6's final wording (draft above, option
A; option B = two strings gated on `lastCoveringTruncated` if the human wants "farthest from
centre" said when it is true); ADR-028 Amendment 3's text (the reopen record, what it withdraws
— Amendment 1's exception 2 only — what it keeps — exception 1, the dedupe-owner cascade — and
its clause 5, the gate-8 re-measure stance: the ruling stands on its own commits, no re-measure
owed now, a future cross-commit arm comparison must declare the eviction-policy change);
the declared absorbing state, acknowledged; then the L2-L9 re-run under a verified arm.

### Sub-amendment — the untiled first look is eviction-protected while in view (entry 48 (a), 2026-09-07, appended BEFORE any code)

**What fires this.** DECISIONS-PENDING entry 48, ruled by the human 2026-09-07 (verbatim there):
hold 1b; *"protect the untiled first look while its extent intersects the viewport; reuses F1's
geometric protection, one unit test"*; reviewer-gated; then the human re-runs only the zoom-out
steps; then L9 closes the cut. Evidence: the live probe's single eviction (t = 43.5 s) — an 8-row
admission into `18:12` evicted `["initial-untiled-look"]`, resident 19,090 → 9,090 — is the
"already rendered content disappears" of the post-fix L9.

**Design — two channels, deliberately NOT one.** `INITIAL_TILE_KEY` (`tileGridConstants.ts`) is
the key `TileResidentSet` holds the first look under; it is not a grid key, so F1's geometric
covering set never contains it and `planTileEviction` may evict it. The piece:
1. **Eviction protection (the fix).** While the first look's union extent
   (`candidateArmSession.ts`'s `latestUnionedExtent`, the same value `establishFrameFromExtent`
   consumed) intersects the current viewport bbox (plain AABB overlap; a touching edge counts),
   `INITIAL_TILE_KEY` is added to the protected set `planTileEviction` receives — via
   `applyTileViewportContext`'s protected-keys input, alongside the geometric covering keys — so
   the cascade backstop (`tileResidentSet.ts` ~:335-341) and the admission-path plan
   (`tileIngest.ts` ~:120-126) both honor it. When the extent no longer intersects the bbox
   (the operator has panned/zoomed away from it), the first look is evictable exactly as today.
2. **NOT in completeness, NOT in `fits`.** `INITIAL_TILE_KEY` must NOT enter `lastCoveringTileKeys`
   (`isFillComplete`'s per-tile loop) and must NOT be read by `anyPartialAmongCovering`
   (`WorkingCanvas.tsx` `applyTileViewportContext`'s `fits` recomputation). Reason, code-grounded:
   the first look is durably partial whenever it was truncated by `UNTILED_FIRST_LOOK_ROW_LIMIT`
   (P6b item 2b), so if it counted toward `fits`, every fit view containing it would latch
   over-budget at plan time, `drainQueueIfRoom` would refuse, and L5's own fill would stop after
   three tiles — a regression of the very step the human just passed. The completeness claim's
   honesty is already carried by `lastCoveringTruncated` and the grid tiles' own completeness.
   Implementation shape: `applyTileViewportContext(covering, viewCentre, extraProtectedKeys)` (or
   an equivalent named field) that unions `extraProtectedKeys` into `currentViewportTileKeysRef`'s
   PROTECTION read only — `anyPartialAmongCovering` iterates `covering` alone. If the canvas API
   cannot separate the two reads without a second ref, add the second ref; never fold the pseudo-key
   into `covering`.
3. **Lifecycle.** `reissueUnrestricted` (a filter generation) already clears the first look with
   `clearAllTiles`; the protection needs no separate reset. A first look that was self-cancelled
   (entry 35's frame-exists cancel) keeps whatever it admitted and is protected the same way —
   protection is about what is resident and in view, not about how the stream ended.

**Declared consequence (named, not discovered).** At an over-budget overview with the first look
protected and in view, `planTileEviction` may find nothing evictable: the batch is trimmed to the
remaining budget (possibly to zero rows), the tile is marked partial, over-budget latches — the
same declared absorbing state the close-out piece named, now with the first look STANDING instead
of vanishing. The overview therefore reads as "the first look plus whatever tiles fit", declared by
the over-budget sentence and its paused/finished suffix. This is the honest v0.1 limitation the
human's LOD ruling accepts (flip-first; LOD is the first post-flip quality cut); no perf claim
attaches in either direction.

**Pre-committed tests.**
1. `tileResidentSet.test.ts` — `planTileEviction` with `INITIAL_TILE_KEY` resident (high vertex
   count) and present in the protected set, plus one evictable grid tile: the plan evicts the grid
   tile, never `INITIAL_TILE_KEY`; with ONLY the first look resident and protected: `evict: []`,
   `overBudget: true`.
2. `candidateArmSession.test.ts` — THE ENTRY-48 PIN: after a plan whose bbox intersects the first
   look's union extent, the protected keys handed to the canvas CONTAIN `INITIAL_TILE_KEY`; after
   a plan whose bbox does not intersect it, they do NOT; and in both cases `lastCoveringTileKeys`
   does NOT contain it (channel 2).
3. `candidateArmSession.test.ts` — the fit-view non-regression: a truncated (partial) first look in
   view with a within-budget covering set still plans and drains tiles (no over-budget latch from
   the first look's partiality) — pins channel 2's `fits` exclusion.
4. Felt: the human's zoom-out-only re-run — already-rendered content does not disappear on zoom-out;
   the over-budget sentence appears; then L9.

**Scope fence.** Client-side only, ADR-006 class 1; no wire change; ADR-010 rule 5 untouched
(nothing becomes silent); no perf claim; entry 47 stays next-cut; LOD untouched (ruled flip-first).

### Sub-amendment, third attempt — protection derived from the batches admitted under `INITIAL_TILE_KEY`, never from a terminal-time snapshot (entry 48 (a), 2026-09-07, appended BEFORE any code; the FINAL attempt, pre-declared)

**Authorization, the human verbatim (DECISIONS-PENDING entry 48, 2026-09-07):** *"third attempt
AUTHORIZED, with three conditions. (1) The dated prereg amendment first, as you say it needs. (2) The
gate must include the two tests the prior gates lacked: a tile batch landing between rounds with the
pan-away release asserted (M1's blind spot), and the operator-Cancel self-cancel repro plus the
generation-2/reissue window (M2's). The design is right because it derives protection from the
batches actually admitted under INITIAL_TILE_KEY rather than from any terminal-time snapshot — so
the tests must attack exactly the paths where snapshots died. (3) Rule 7, pre-declared: this is the
final attempt. If it fails its gate, 48 converts to named binding debt on the ADR-011 line, 1b
closes without it, and my original close-ruling reason is recorded as overtaken by rule 7 — three
failed attempts is the evidence that "small fix" was a misdiagnosis, and holding the cut hostage to
it would repeat the sunk-cost shape I capped on entry 40."*

**Why the two prior attempts died (the gates' own words, condensed).** Attempt 1 (`543a5f2`, M1):
the predicate read `latestUnionedExtent`, the dataset-lifetime union every batch feeds
(`candidateArmSession.ts` ~:1003; `tileIngest.ts` ~:158 unions unconditionally), so once any grid
batch landed the first look was protected for the rest of the generation — release-on-pan-away
never existed, and test 2 could not see it. Attempt 2 (`48c19ea`, M2): a snapshot written at the
untiled stream's terminal, `wasCurrent`-gated — but `cancelUntiledStream` (~:1130-1137) clears
`untiledStreamHandle` BEFORE `skpCancel`, so an operator-Cancel self-cancel arrives with
`wasCurrent === false` and is never snapshotted (probe-proven); and in generation 2+ the grid frame
survives `reissueUnrestricted`'s clear, so a tile batch can land before the new first look's
terminal — a window with nothing snapshotted. Both deaths share one cause: protection was derived
from an EVENT (a terminal) instead of from the STATE (what is resident under `INITIAL_TILE_KEY`).

**Design (binding).**
1. `TileBatchIngestOutcome` (`tileIngest.ts`) gains `batchExtent: AuthoritativeBbox | null` — the
   extent of THIS batch's rows as actually admitted (post-trim; `null` when nothing was admitted),
   computed where `:158` already calls `extentOfBatch` — no second decode. `fitAnchor` is unchanged.
2. `candidateArmSession.ts` keeps ONE first-look extent field, `firstLookRunningExtent`
   (`AuthoritativeBbox | null`), unioned per batch INSIDE the existing `tileKey === INITIAL_TILE_KEY`
   branch of `ingestAndMaybeEstablishFrame` (~:1008) from `outcome.batchExtent` — grid batches
   cannot reach it by construction. Reset to `null` at `reissueUnrestricted` beside
   `latestUnionedExtent` (~:1475). The terminal-time snapshot `firstLookExtent` (~:402, the
   `onTerminal` write ~:1229-1240) is REMOVED, not kept alongside.
3. The eviction-protection predicate (~:1388-1389) reads `firstLookRunningExtent` only:
   `INITIAL_TILE_KEY` is in `extraProtectedKeys` iff that extent is non-null AND intersects the
   plan's bbox (`bboxesIntersect`, touching edge counts). Channel 2 (never in `covering`, never in
   `fits`/`anyPartialAmongCovering`) is unchanged from the sub-amendment above.
4. Consequences the design buys for free, to be asserted, not assumed: a self-cancelled first look is
   protected by the batches it admitted before the cancel (no terminal involved); generation 2's
   first look is protected from its FIRST admitted batch, before its terminal, with the old
   generation's extent gone at the reset; a grid batch landing anywhere never widens it.

**Pre-committed tests — the gate MUST see all of these green, and the first two are the human's
named conditions:**
- **T-A (M1's blind spot, pan-away release with a tile batch between rounds).** Round 1: first-look
  batches admitted (extent E1); plan bbox ∩ E1 ≠ ∅ → `extraProtectedKeys` contains
  `INITIAL_TILE_KEY`. Then a GRID tile batch lands with extent E2 disjoint from E1 (through the same
  `ingestAndMaybeEstablishFrame` path, tile-keyed). Round 2: plan bbox ∩ E2 ≠ ∅, bbox ∩ E1 = ∅ →
  `extraProtectedKeys` does NOT contain it. The test must FAIL against a predicate that reads
  `latestUnionedExtent` (state that in its comment; verify by temporarily pointing the predicate
  there — the worker reports the observed failure).
- **T-B (M2's self-cancel repro).** First-look batches admitted (E1); the session's own
  `cancelUntiledStream` path fires (via `relinquishFill`'s frame-exists cancel or `stop()`-free
  equivalent the test can drive) BEFORE the untiled terminal; the terminal then arrives
  self-cancelled (`wasCurrent === false` by the existing ordering, which this attempt does NOT
  change); a plan with bbox ∩ E1 ≠ ∅ → protected. Must FAIL against `48c19ea`'s snapshot design
  (worker verifies by observation, as above).
- **T-C (M2's generation-2/reissue window).** After `reissueUnrestricted`: (i) a plan before any
  new first-look batch → not protected (nothing resident under the key); (ii) a grid batch lands
  while the new untiled stream is still running (frame persists); (iii) the new first look's FIRST
  batch lands (extent E3) → a plan with bbox ∩ E3 ≠ ∅ is protected before any terminal; (iv) a plan
  with bbox ∩ E1 ≠ ∅ but ∩ E3 = ∅ (the OLD generation's extent) → not protected.
- **T-D (`tileIngest.test.ts`).** `batchExtent` equals the admitted rows' extent; `null` for a
  batch admitting nothing (all duplicates, or trimmed to zero); `fitAnchor` unchanged.
- The sub-amendment's tests 1–3 above stay green (test 2's `firstLookExtent` wording updated to the
  running extent; its sensitisation — a tile batch between rounds — is now T-A's job and may be
  merged into it rather than duplicated).

**The cap (binding).** One worker pass, one reviewer gate, one fix batch at most, one affirmative
re-review. If the gate's final verdict is not an affirmative PASS: no further attempt; entry 48
converts to named binding debt on the ADR-011 line; 1b closes without it; the human's close ruling
of 2026-09-07 ("hold 1b — do the entry-48 (a) piece first") is recorded as overtaken by rule 7, in
the human's own words above. Scope fence unchanged from the sub-amendment above (client-side only,
no wire change, no perf claim, entry 47 next-cut, LOD flip-first).
