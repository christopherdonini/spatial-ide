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
