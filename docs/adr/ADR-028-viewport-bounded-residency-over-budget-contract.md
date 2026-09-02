# ADR-028 — Viewport-bounded residency and the over-budget render contract

Status: Proposed — binds nothing. Filed as the home of record for ADR-011 gate 8's
"what replaces whole-dataset residency" question. Not architect-blockable until accepted.
Related: ADR-010 (rules 1, 3, 5, 6 — the invariants this must satisfy, not replace),
ADR-011 (the unmeasured tiled direction this works toward; not presumed),
ADR-016 (stable identity, which cross-tile de-duplication depends on),
ADR-019/ADR-014 (stream admission and concurrency, which fan-out pressures),
ADR-027 (console display of a per-pan command fan-out).

## Context
- The shell's MAX_RESIDENT_VERTICES = 2,000,000 refusal is a declared ceiling
  (frontends/shell/src/canvas/limits.ts), honest interim per ADR-011 gate 8.
- Part H at 5 GB (2026-08-30, operator observations, not measurements): ~19k of
  3,300,000 features resident; every pan/zoom refills from empty; Zoom-to-layer fits the
  visited-viewport union, not the dataset extent.
- At fit-to-extent the viewport IS the dataset, so viewport scoping alone cannot retire
  the refusal; and at that zoom features are sub-pixel, so hover has no honest answer
  (PR #15 disclosure 4).
- kernel/RESULTS.md fifth section finding 4: smaller viewports cost more to first batch.

## Decision
DELIBERATELY OPEN pending the preregistered measurement
(frontends/shell/RESIDENCY-PREREGISTRATION.md). Candidate, to be accepted or rejected on
that evidence:
1. Residency is bounded by viewport and a declared vertex budget, held as a tile-keyed
   cache over a fixed, declared grid; a single render origin is retained (ADR-010 rule 3
   untouched; ADR-011's per-tile origins are NOT adopted here).
2. Over-budget is a declared, labelled partial view with distance-ordered eviction — not
   an error and not a cancelled stream. The persistent rendered/total status is retained.
3. Cross-tile de-duplication by stable feature id is required; a boundary-spanning
   feature returned by two tile queries resolves to exactly one resident feature.
4. Picking below a declared pixel-size threshold refuses by name rather than returning a
   plausible-but-arbitrary feature (ADR-010 rule 6 discipline).
5. Completeness at overview scales is NOT delivered by this decision; LOD/aggregation is
   separate and owes its own preregistered gate.

## Consequences
- If accepted: retires the ceiling-refusal interim for the hero path in the restated
  form; ADR-011 gate 8 gains its written answer (the human rules on the gate, not this ADR);
  gates 1–7 of ADR-011 remain entirely open.
- If rejected: the declared-ceiling refusal with its persistent status remains the shell's
  contract, per ADR-011 gate 8's own text, and LOD becomes the only remaining lever.
- docs/08: no row is added by this ADR. Rows land with measurements, human-sight-approved.
- docs/07 line 22 reopen condition (2) is NOT triggered by this ADR — that condition needs
  ADR-011 accepted in a form removing whole-extent reads from the hot path, and a fresh
  preregistered gate either way.

## Resolved inputs (2026-08-30)

The human resolved three of this cut's outstanding decisions (`NEXT-CUT.md` 24(a)–(c)) on
2026-08-30. They do not change the Decision above — the candidate stays deliberately open,
pending the preregistered measurement — but they are now inputs the candidate assumes
rather than open questions the candidate would otherwise still be carrying:

- **24(a)** confirms Decision item 2's shape as the only one considered: over-budget
  renders as a **declared partial view**, never an error-shaped refusal and never a
  cancelled stream, with the **persistent rendered/total status indicator retained** — the
  indicator's presence is settled; only its wording (24(b)) was still open.
- **24(b)** approves that the status indicator's *meaning* changes (from "the whole
  dataset, capped" to "this tile-bounded view, capped") — the exact wording is deferred to
  the human's sight at the PR that implements it, not preregistered or decided here.
- **24(c)** confirms Decision item 4's mechanism: a hover below a declared pixel-size
  threshold **refuses by name** (a typed, named refusal — e.g. sub-pixel, no honest
  single-feature answer), rather than snapping to a plausible-but-arbitrary feature or
  silently returning nothing.

These resolutions are recorded here as the state the preregistration
(`frontends/shell/RESIDENCY-PREREGISTRATION.md` §2c) cites and assumes; they do not
themselves accept or reject the candidate decision above, which still awaits the
preregistered measurement's evidence.

## Architect-gate clarifications to the candidate Decision (2026-08-31, appended — Proposed)

The architect gate at the complex's tip found the as-built code diverging from the candidate's
Decision text in three ways the evidence session would otherwise silently absorb. Proposed
clarifications (the human rules at acceptance):

1. Item 1's grid is *fixed for a dataset session and declared in shape, derived in position*
   from a bounded bootstrap query — the derivation, its declared row bound, and its unproven
   representativeness are part of the decision, not an implementation detail.
2. Item 2 requires partiality to be a **durable property of the resident set** — a truncated
   or superseded-partial tile is marked partial, is re-requestable when headroom returns, and
   no completeness claim ("Showing all N…") may be emitted while any covering tile is partial
   or unfilled.
3. Item 3's "never evict a tile intersecting the current viewport" admits one declared
   exception — the dedupe-owner cascade — or the cascade is replaced by a re-fetch marker.

Item 4 (sub-pixel pick refusal by name) had no implementation at the gate's tip; ADR-028's
candidate cannot be accepted or rejected on evidence until it exists, since the
preregistration's pick-agreement assertion has no subject without it.

## Gate-8 written answer and ruling (2026-09-02, appended — Proposed)

This section is ADR-011 gate 8's own written answer (C4: "the cut produces the written answer +
evidence; the ruling is the human's"). It does not change the Status line above.

**The evidence, both campaigns, gate-by-gate** (client-clock only,
`frontends/shell/RESULTS.md`'s two dual-arm sections — the P8 pre-fix campaign and the
Amendment-23/P10 post-fix re-measure over the same preregistered protocol at two different
commits; G1/G2/G5 out of scope in both — G1/G2 are 5 GB-fixture assertions, deferred per
Amendment 22; G5 is scored producer-side, outside this client-side instrument's reach by
Amendment 19's own resolution):

- **G7 (cold first-view, anti-cherry-pick): PASS, both campaigns.** Pre-fix: candidate p95 was
  49.3% of baseline's. Post-fix: candidate p95 257.8ms vs baseline p95 558.8ms, 46.1% — ~2.2×
  faster, stable across both campaigns and comfortably inside the 110% ceiling. `open-drain` was
  never the P9 paint fix's target, so the stability itself is evidence the gate measures what it
  claims to measure, not an artifact of the fix.
- **G3 (first-pixels per step-class): mixed pre-fix, materially improved post-fix.** Pre-fix:
  candidate won `pan`-median and `open-drain`; lost `pan`-tail and `zoom-in`. Post-fix: `zoom-in`
  and `zoom-out` flip outright to candidate (paint segment −85% / −93%); `pan` median stays
  candidate, tail stays baseline; `fit`/`zoom-to-layer` stay structurally uncomparable (baseline
  runs no-batch on both steps every trial, by construction of the trace order, not a missing
  measurement).
- **G4 (frame time, no regression vs. baseline): FAIL, both campaigns**, scored on the gate's own
  strict letter (no declared tolerance band). Pre-fix: candidate 1.8×-2.3× baseline. Post-fix
  **the shape of the failure changed, not merely its size**: the median gap closed to
  near-parity (1.12×, was 2.30×) while the tail widened (3.70×, was 1.81×) — traced, by direct
  per-step attribution rather than guessed, to the two named mechanisms below.
- **G6 (budget adherence): PASS, both campaigns**, structural per Amendment 21 (admission trims
  before insert; the ceiling is unexceedable by construction) — not a sampled measurement either
  time.
- **G1, G2, G5: out of scope, both campaigns.** Neither the pre-fix nor the post-fix evidence
  speaks to correctness-at-5GB, zero-refusal-at-5GB, or producer-side cancellation; this answer
  does not speak to them either. They remain the deferred 5 GB session's own evidence to supply.

**The two tail mechanisms, named by direct per-step attribution** (RESULTS.md, Amendment-23
section §5):

1. **Zoom-to-layer's sustained new-tile admission window.** The same step wins the candidate's
   worst-step p95 in all 7 post-fix trials (1079-1325ms). Its own first-batch paint is fast under
   the P9 fix (mean 92ms) — the cost is the step's ~20-23s wall-clock window requesting 83
   distinct tiles, the large majority genuinely new `ResidentBatch` admissions this trace has not
   seen before: a correct cache miss by the fix's own stated invalidation rule, not a defect in
   it, but a real, reproducible cost every one of the 7 trials paid.
2. **Pan-west's large-batch re-admission spike.** 5 of 7 post-fix trials show a reproducible spike
   (`duplicatesDropped` 10,140-11,098; `firstPixelMs` 2,587-2,974ms) — already-resident tiles
   re-delivered as fresh `ResidentBatch` objects; dedupe correctly drops the duplicate features,
   but each still misses the geometry cache as a new object. The other 2 of 7 trials show
   ordinary `pan-west` behaviour, confirming this is real and reproducible but intermittent, not
   universal.

**The human's ruling (2026-09-02), verbatim:** *"(d) — accept, with the two tail mechanisms
(zoom-to-layer's new-tile admission window; pan-west's re-admission spike) recorded as named
binding debt in ADR-028, the ADR-021-condition pattern."*

**Applying the ADR-021-condition pattern.** Per ADR-021's own 2026-08-13 precedent — a named
shortfall carried forward as a binding obligation on a specific future line of work, "resolved
there or explicitly re-deferred with reason, never silently dropped" — the two mechanisms above
are **binding debt on the ADR-011 tiling/LOD line of work**: neither may be dropped from a future
cut's scope without comment. Either mechanism gets its own preregistered gate and fix, or is
explicitly re-deferred with reason, at the point a future cut next touches tile admission,
`ResidentBatch` object identity, or the candidate residency planner. Whether that happens by
reopening ADR-011 gate 8's own text (rider 2 of the 2026-08-13 entry-0 resolution) or by a fresh
ADR-011 sub-gate is not decided here — only that the debt is named and tracked, not silently
absorbed into "the fix as scoped."

**Rider — this ruling does not itself accept ADR-028 (the human's own condition, verbatim):**
*"ADR-028's acceptance itself is NOT discharged by this ruling — it waits until walkthrough Part K
and the deferred 5 GB G1/G2 cells are in; if K's felt verdict or the 5 GB trace contradicts the
accept-class reading (error-shaped refusals still reachable, or the partial view illegible in
practice), the ruling reopens rather than stands."* Concretely: this section records the gate-8
ruling as **accept-class, conditionally** — the Status line at the top of this ADR stays
**Proposed** until both walkthrough Part K (`frontends/shell/MANUAL-WALKTHROUGH.md`, the operator
judgment of whether the declared-partial-view status and the sub-pixel pick refusal read as
honest and legible in practice, not merely check out mechanically) and the deferred 5 GB G1/G2
cells (Amendment 22, a separate headed session) are in. A contradicting result from either —
an error-shaped refusal still reachable at 5 GB, or the partial view proving illegible to the
operator in practice — **reopens this ruling** rather than leaving it standing on the evidence
recorded above. When both land clean, moving the Status line to Accepted, marking ADR-011 gate 8
met, and the `docs/02`/`docs/README` index entries are a subsequent, separate custodian action
recording an outcome already decided here — not a new judgment call.
