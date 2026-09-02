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

## Design seed — pan-west's binding debt, a candidate mechanism (2026-09-02, appended — a seed for a future slice, not scheduled, not itself a proposal)

Recorded per the ADR-021-condition pattern's own discipline (binding debt is "resolved there or
explicitly re-deferred with reason, never silently dropped") so that whenever a future cut next
touches tile admission, `ResidentBatch` object identity, or the candidate residency planner, it
does not have to rediscover pan-west's own shape from nothing. **This is ADR-011 item 4's
"candidate mechanism" territory made concrete for the CURRENT single-origin implementation**
(ADR-011's own per-tile-origin proposal is untouched, unbuilt, and this seed does not depend on
it) — ADR-011 itself gains only a cross-reference pointer to here, per the point-don't-duplicate
discipline this project applies everywhere else.

**The candidate design.** Replace the render-layer geometry cache's current keying
(`buildLayers.ts`'s `WeakMap<ResidentBatch, CachedBatchGeometry>`, keyed on batch object
identity — see this ADR's own P9/P11 comment corrections above) with **request-identity keying**:
a structural key composed of —

1. **Open-generation** — a counter bumped on every dataset (re)open, so no cache entry ever
   survives across a close/reopen boundary by accident.
2. **Tile ID + grid frame** — spatial identity against the declared, derived-in-position grid
   (this ADR's own architect-gate clarification 1: the grid is fixed for a session but its
   position is bootstrap-derived, so the frame itself is part of the key, not assumed constant).
3. **Filter predicate identity** — so a filtered view's cache entries can never collide with a
   differently-filtered or unfiltered one.
4. **Render origin** — unchanged from today's need: local coordinates are origin-relative
   (`OffsetFrame`), so an origin move must still invalidate, exactly as it does now.
5. **A geometry-affecting style revision, per ADR-022** — a style edit that changes GEOMETRY
   (e.g. outline width crossing the zero/nonzero boundary, which changes whether
   `outlinePositionsFor` even runs) must invalidate; a paint-only edit (fill colour) must not,
   since it never touches this cache's own `polygons`/`outlinePositions` fields. Style v0's own
   class-C "no API equivalent, local state only" discipline (ADR-022) is what makes "geometry-
   affecting vs. paint-only" a decidable, small, closed set rather than an open one.

**Gated by a completed-untrimmed flag.** Request-identity keying applies ONLY to a tile whose
admission was completed and untrimmed. **Partial/trimmed tiles stay identity-keyed the current
way** (object identity, today's WeakMap) — never migrated to request-identity keying — because
Amendment 18 already established that a partial/trimmed tile's resident content is
interleaving-dependent: two requests carrying an identical request-identity key could legitimately
resolve to different trimmed content depending on timing, so a request-identity cache entry for a
partial tile would risk silently serving one trial's trimmed content against a different trial's
differently-trimmed request. Semantically unkeyable, not merely an engineering inconvenience —
Amendment 18's own nondeterminism is the reason, cited not re-derived.

**Constraints.** No content hashing on the hot path — the key stays structural/metadata-only, so
a lookup costs no more than today's object-identity `WeakMap` get. No wire/SKP change — entirely
`renderer`/`frontends/shell`-scoped, the protocol untouched. The escalation path, if
request-identity keying alone ever proves insufficient, is a **producer-minted etag** (the
kernel/producer stamping each tile response with a content-derived version the client could trust
directly) — that requires a wire change and **would be its own SKP ADR**, explicitly not proposed
or scheduled here, named only as the next lever if this one doesn't fully close the gap.

**Precondition before scheduling — the diagnosis pass, run 2026-09-02, result: genuinely open,
not answered by existing evidence.** The question this design's own value turns on: of pan-west's
re-admitted tiles in the P10 spiking trials, what fraction were previously completed/untrimmed
(the recoverable fraction under this design) versus previously partial/trimmed (unrecoverable by
any keying scheme, per the carve-out above)? A diagnosis pass over the seven P10 evidence files
(`frontends/shell/e2e/out/residency-harness-instrument-on-{1788291093560,1788291202624,
1788291490405,1788291615109,1788291881195,1788292007179,1788292257500}.json`, all still present
and intact) found this **not answerable from what's on disk**: every step, including `pan-west`,
carries only aggregate per-step counters (`tilesRequested`, `duplicatesDropped`,
`evictionsApplied`, etc.) — zero per-tile trim-status breakdown, in either the evidence JSON or
the raw per-trial logs. **The hook a future instrumented pass would read already exists as real
internal state, just never exported:** `tileIngest.ts`'s admission path computes
`trimmed = overBudget && toAdmit.ids.length < batch.ids.length` before calling
`tileSet.addBatch(tileKey, toAdmit, trimmed)`, and `TileResidentSet`'s own resident-tile record
carries a `partial: boolean` field, sticky (upgrades on a partial admission, never downgrades
back to `false`). A future pass would log, per re-admitted tile during `pan-west`, whether the
tile's PRIOR resident entry had `partial === true` at the moment it was superseded/duplicated —
new instrumentation and a re-run, not a re-read of P10's existing files. **Scheduling this design
without that diagnosis would be building on an assumption, not evidence** — record the
precondition as still open, not quietly dropped.

**Explicitly out of this seed's scope: zoom-to-layer's own tail.** ADR-028's OTHER named binding
debt (the sustained new-tile admission window) is a different mechanism — genuinely-new-tile
admission, first-time cache misses by construction, which the P9 fix's own doc comment already
says are correct to miss. Request-identity keying only helps when the SAME logical request
recurs; it has no purchase on a tile being admitted for the first time. Zoom-to-layer's tail
needs its own, different lever, not named here.
