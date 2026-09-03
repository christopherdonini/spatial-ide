# Preregistration — viewport-bounded residency (the ADR-011 gate-8 slice)

**Committed before the harness exists and before any measured number exists.** Same discipline as
`kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`,
`kernel/SCALE-PASS-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md` and
`kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`. Every cell, trigger, ceiling, sample count,
verdict rule and invalidator below is fixed by this commit; an amendment made after a result has
been seen **must say so in its first line** and invalidates the work it touches. This file is
**append-only once committed** — amendments are dated additions, never edits, per this
repository's convention for preregistrations.

**Authority.** `NEXT-CUT.md` is the transient brief carrying the human's 2026-08-30 "let's go with
the next cut" approval and the 2026-08-30 architect design consult, binding, including its four
block-on-sight conditions and the restated target. This file is that brief's Preregistration
section, expanded into the structure `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` set, and is the
durable record once `NEXT-CUT.md` is archived to `.cut-archive/` (its own rule 10).

**Semantics are not defined here.** This file declares what is run and how it is scored. It does
not design the tile-keyed residency mechanism, the eviction policy, or the over-budget contract's
exact wording — those are P3/P4's implementation, owed to this document, reviewed against ADR-010
and, where the candidate is accepted, filed at ADR-028.

---

## 0. Disclosure: no pilot informs this preregistration

Unlike `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §0, which was informed by a throwaway
`parquet_metadata()` probe, **no pilot of any kind was run before this file was written.** Stated
here rather than silently omitted, for the same reason the import-layout precedent states its
pilot first: an absent disclosure is as load-bearing as a present one, and a reader should not
have to infer "no pilot" from the section simply being empty. Nothing below rests on any
throwaway measurement; the fixture set, the camera trace, the gates and the proposed values in
§§2–4 are argued from `kernel/RESULTS.md`'s prior sections (cited by section number throughout)
and from the shell's already-committed code (`limits.ts`), not from a probe run for this file.

---

## 1. What this document may and may not claim

- **Every comparison is within-session**, same build, same tree, baseline arm and candidate arm
  run back to back per §8's ABBA rule. No number produced under this file is differenced against
  any earlier `kernel/RESULTS.md` section — those are producer-clock, engine-process figures, from
  different builds and different trees entirely.
- **Client-clock results go to a NEW `frontends/shell/RESULTS.md`, not to `kernel/RESULTS.md`, and
  are never cross-attributed to any kernel producer-clock figure.** The two clocks measure
  different processes across a transport boundary; a client-clock number quoted as if it were a
  kernel figure (or vice versa) misrepresents which side paid the cost. `kernel/RESULTS.md`'s
  fifth-section finding 4 and ninth-section findings are cited below **as context that shaped this
  design**, never as numbers this pass's own gates are scored against.
- **No `docs/08` normative row is added, amended, or newly quoted-against by this document or by
  any result it produces — not even "proposed"** (`NEXT-CUT.md` C1; ADR-011 gate 2). Where a gate
  below reuses an existing `docs/08` row (first-pixels, frame time vs. vsync, cancellation), the
  row's wording is quoted verbatim in §2 and scored exactly as written; nothing is reworded, and no
  new dataset class is created.
- **The pinned 5 GB fixture is never scored against a `docs/08` matrix row.** It is reported at its
  own declared scale only — the "cold open of a 5 GB GeoParquet" budget line, same discipline
  `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §1/§3 already applies. There is no "5 GB class."
- **This is the first pass to score client-clock rows against `docs/08` at all.** Every gate that
  reuses an existing budget row therefore carries an **instrument-off control cell** (§8) so a
  regression this pass might itself introduce — the instrument, not the residency change — can be
  told apart from the thing being measured.
- Only the quantities named "gated" in §6's table are scored. Everything marked "reported, never
  gated" is reported beside its neighbouring gated quantity and is never netted against it, per the
  netting prohibition `kernel/RESULTS.md` ninth section states and enforces on its own gate
  (finding 1: "no number above is netted against any other").
- ADR-011 is never cited as settled by this document or by any result under it, and gate 8 is not
  marked met here — this preregistration produces the written answer and the evidence; the ruling
  on the gate is the human's (`NEXT-CUT.md` C4).

---

## 2. The gate — lifted verbatim from `NEXT-CUT.md`, expanded per this file's structure

### 2a. The restated target (quoted verbatim)

> **The restated target (the load-bearing correction):** at fit-to-extent the viewport IS the
> dataset — viewport scoping cannot make 3.3M features appear (that is LOD's job, NOT this cut).
> This cut retires the *error-shaped* refusal on the hero path: over-budget becomes a declared,
> labelled, navigable partial view — tile-keyed residency over a fixed declared grid,
> distance-ordered eviction, cross-tile dedupe by stable feature id, the persistent
> rendered/total status retained. A disappeared banner without the declared-partial contract
> would be a principle-8 violation dressed as a fix.

### 2b. Block-on-sight conditions (quoted verbatim; cited in every review of work under this file)

> - **C1** No docs/08 normative row lands this cut, not even "proposed" — rows land WITH a
>   measurement, human-sight-approved (ADR-011 gate 2).
> - **C2** No per-tile GPU origins / multi-origin model — single `OffsetFrame` kept; touching it
>   opens ADR-011 item 6 / gate 1 (M2-equivalent re-validation on both GPUs), unpayable here
>   (ADR-010 rule 3).
> - **C3** No new `viewport_query` parameter (no lod/tolerance/tile_id) — bbox/bbox_crs/limit/
>   filter suffice; a new parameter is an SKP change needing its own ADR.
> - **C4** ADR-011 never cited as settled; gate 8 not marked met — the cut produces the written
>   answer + evidence; the ruling is the human's. Everything is ADR-006 class 1 (ephemeral);
>   a disk-touching tile cache would be class 2 and leaves this cut.

### 2c. The human's resolved decisions this preregistration assumes as inputs (24(a)–(c))

1. **24(a).** Over-budget renders as a **declared partial view**, not an error and not a cancelled
   stream, with the persistent rendered/total status **retained** (its meaning changes — see 24(b)
   — but the indicator itself is not removed).
2. **24(b).** The status-meaning change is approved; the exact wording is decided by the human on
   sight at the PR, not preregistered here.
3. **24(c).** A hover below a declared pixel-size threshold **refuses by name** — a typed refusal
   naming the reason (sub-pixel, no honest single-feature answer), never a plausible-but-arbitrary
   pick (ADR-010 rule 6 discipline, restated at ADR-028 Decision item 4).

### 2d. Gates G1–G7

Fail = a complete result, per §11. Each gate is scored on exactly the quantities and cells §6/§7
declare; nothing here is netted against anything else (§1, ninth-section discipline).

| # | gate | scored as |
|---|---|---|
| **G1** | **Correctness.** Rendered feature set ⊆ authoritative (server-truth) set at every trace step; cross-tile dedupe exact — a boundary-spanning feature resolves to exactly one resident feature by stable id (ADR-016); no superseded batch (a stale in-flight tile response that arrives after a newer request for the same tile must never render). | assertion, every step, n = 1 sufficient per step but every trial checked |
| **G2** | **Zero error-shaped refusals across the trace at 5 GB, with an accurate status.** No `ceiling-exceeded`-shaped refusal fires anywhere in the committed camera trace (§4) at the 5 GB fixture; the rendered/total status is compared against the actual resident/authoritative counts at every step and must never overstate completeness. | assertion, every step |
| **G3** | **First-pixels p95, per step-class, n ≥ 7.** Scored **only** at the `docs/08` Polygons-class fixture (§3) — never at the 5 GB fixture (§1/§3 fixture-scoring rule) — against the existing row: *"First pixels < 100 ms after query start"* (`docs/08`, quoted §2e below). | gated, existing row, no new row |
| **G4** | **No frame-time regression vs. baseline.** Candidate arm's frame time p50/p95 across the trace does not regress against the baseline arm's, scored against the existing row (quoted §2e). | gated, existing row |
| **G5** | **Cancellation holds under fan-out.** `cancel_requested → cancel_observed`, scored against the existing 100 ms row (quoted §2e), during a multi-tile fan-out (a pan or zoom step that issues more than one concurrent `viewport_query`, up to §4's declared max-in-flight ceiling). ADR-018 vocabulary: p50/p95 carry the verdict, max always reported, `cancel_quiescent` reported beside with no budget — "acknowledged" does not appear in this document's prose. | gated, existing row |
| **G6** | **Budget adherence, every step.** Resident vertex count ≤ the declared budget (`MAX_RESIDENT_VERTICES`, currently 2,000,000 per `frontends/shell/src/canvas/limits.ts:30`, or its candidate-arm replacement) at **every** step of the trace, not only at rest between steps. | assertion, not a percentile — a single violation at any step fails the gate |
| **G7** | **Anti-cherry-pick: cold first-view first-pixels must not regress beyond a declared margin**, applying the import-layout gate's own failing-condition shape (a strict ceiling, no trade-off against a comfortable pass elsewhere) to this cut. **Margin proposed here, PENDING THE HUMAN'S SIGHT, because it is gate-defining:** candidate arm's cold first-view first-pixels p95 (docs/08 Polygons class, §3) ≤ **110 %** of the baseline arm's cold first-view first-pixels p95, same class, same n ≥ 7 discipline as G3. **Justification:** 10 % is this repository's own standing canary-noise floor (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §8 and `kernel/SCALE-PASS-PREREGISTRATION.md`'s "canary spread ≤ 10 % per phase") — a regression bar set at exactly that figure is the tightest bar this repository's own instruments have shown they can hold without mistaking ordinary session noise for a real regression. **This number is not final; it is proposed pending the human's sight at the PR, per this piece's instructions, and is marked so wherever it appears.** | gated, derived from the existing row, margin proposed-pending-sight |

### 2e. The existing `docs/08` rows G3/G4/G5 score against, quoted verbatim (no new row added, C1)

> - ≤ vsync interval, zero dropped frames, across the benchmark matrix below (06) — *(amended
>   2026-08-03, ADR-003 spike M4 …)*
> - First pixels < 100 ms after query start (06)
> - Cancellation acknowledged < 100 ms, any operation (01) — *acknowledged* is defined by
>   **ADR-018** (accepted 2026-08-08): scored on `cancel_requested → cancel_observed` on the
>   producer's clock, p50/p95 carry the verdict, max always reported; `cancel_quiescent` reported
>   beside it with no budget. The 100 ms number is unchanged.

(`docs/08_Testing.md`, "Performance budgets" section, lines 5, 6, 8.)

---

## 3. Fixtures

| fixture | role | scoring |
|---|---|---|
| **Pinned 5 GB GeoParquet** (`parcels-5gb.parquet` lineage, the Part H fixture) | The hero-path trace (§4) runs against it. Hash-gated: re-hashed before the trial loop and after the last trial, per §8; a mismatch invalidates the arm. | **Reported at its own scale only — NEVER scored against any `docs/08` matrix row.** There is no "5 GB class" (§1, `kernel/RESULTS.md` third-section identity-scan finding's own precision: "there is no '5 GB class'; 5 GB is the cold-open budget line"). G2's zero-refusal assertion and the reported-never-gated quantities (§6) are the only things this fixture feeds. |
| **`docs/08` Polygons class** (100k features / ~10M vertices) | The **only budget-scored fixture** in this preregistration. | G3 (first-pixels), G4 (frame time), G7 (cold first-view margin) are scored here and nowhere else. |
| **Existing bracket fixtures** (145 MB and other classes already committed by prior cuts) | E2E sanity only — do the tile-keyed paths behave at all at a size cheap to iterate on. | Never gated, never a source of any gate's numbers. |
| **The committed camera trace** | Defined in §4. | Not a fixture on its own — the replay script that drives every fixture above through an identical, deterministic sequence. |
| **The deliberately misaligned tile grid** | Defined in §4. | Structural precondition for G1's dedupe assertion to be a real test rather than a vacuous one. |

---

## 4. The factorial

```
arm ∈ {baseline (pre-residency), candidate (tile-keyed residency)}
    × fixture ∈ {5 GB (G1/G2 + reported-only), docs/08 Polygons (G3/G4/G7)}
    × tile size ∈ {coarse, medium, fine}         — candidate arm only, SWEPT, not chosen
    × instrument ∈ {on, off}                      — control cell, §1/§8
    × camera-trace step ∈ {fit, pan×5, zoom-in×3, zoom-out×1, zoom-to-layer}
```

The baseline arm has no tile-size dimension (it is today's whole-viewport-refill behaviour,
`limits.ts`'s declared ceiling in force) and exists so G4/G7's "vs. baseline" language has a
referent measured in the same session, per §1's within-session rule — **P2 runs the baseline arm
first; it must exist before the candidate does** (`NEXT-CUT.md` phase ordering, restated here as a
standing rule this file also carries: no candidate-arm result is admissible without a baseline-arm
result from the same session preceding it).

### 4a. The named biggest risk this factorial is built to guard against

`kernel/RESULTS.md` fifth section, finding 4: *"Without an index, a tighter viewport costs more to
first batch."* First batch: whole file **72.175 ms** → quarter **94.943 ms** → 1/64
**256.684 ms**. With `ScanOnly` planning, a smaller viewport means scanning further before enough
matching rows are found, so the filter that returns least takes longest to produce anything. Tiling
turns every request into a smaller-viewport request — potentially the measured-slowest kind. The
win this cut needs depends on cache reuse outrunning a per-request cost that grows as tiles shrink;
the failure mode is "the banner is gone but everything feels slower" — exactly Part H's reported
feel. This factorial's guards: tile size **swept, not chosen** (below); G7; refill work reported
beside first-pixels, never netted (§6); a declared max-in-flight ceiling (below); the registered
sign predictions (§5). The ninth section's own lesson — "no number above is netted against any
other," applied there to keep a comfortable read-volume pass from buying back a narrow whole-file
regression — is the same discipline this factorial applies to keep a fast warm-tile hit from
buying back a slow cold-tile refill.

### 4b. The committed camera trace, defined concretely

A single ordered sequence, replayed identically by a committed pure function (§8) for every
arm/fixture/tile-size cell:

1. **Fit** — `Zoom-to-layer`-equivalent fit-to-declared-extent from a cold, empty resident set.
2. **Pan North** — one full viewport height, current zoom held.
3. **Pan East** — one full viewport width, current zoom held.
4. **Pan South** — one full viewport height, current zoom held (returns near the fit center on the
   vertical axis).
5. **Pan West** — one full viewport width, current zoom held (returns near the fit center).
6. **Pan Northeast** — one full viewport diagonal (√2 × the pan distance above, same direction
   convention), current zoom held. (Five pans total: N, E, S, W, NE — four cardinal plus one
   diagonal, so the trace exercises a tile-boundary crossing that is not axis-aligned.)
7. **Zoom-in ×1** — ×2 magnification, focal point = the viewport center reached by step 6.
8. **Zoom-in ×2** — ×2 magnification again (cumulative ×4 from step 6), same focal point.
9. **Zoom-in ×3** — ×2 magnification again (cumulative ×8 from step 6), same focal point.
10. **Zoom-out ×1** — ×2 reduction from step 9 (back to the ×4 level), same focal point.
11. **Zoom-to-layer** — the shell's existing fit-to-extent command, run from wherever step 10 left
    the camera. This is the step Part H's operator observation named: *"Zoom-to-layer fits the
    visited-viewport union, not the dataset extent"* (ADR-028 Context) — this trace exists in part
    to give that observation a replayable, measured instance rather than leaving it anecdotal.

**Settle criteria, identical at every step:** a step is complete when (a) the camera transform has
not changed for **300 ms**, AND (b) zero in-flight `viewport_query` streams remain for that step's
request set (fully drained or cancelled-and-observed). A step that has not settled within a
**5 s** per-step watchdog (§7) invalidates the whole trial — the trace is a single ordered unit
with order-dependent preconditions (each step's resident set depends on every prior step actually
having settled), so a mid-trace watchdog fire cannot be recorded as a partial success; the trial is
recorded `unmeasured — settle watchdog at step N` and re-run once, per §8's standing invalidator
rule.

### 4c. The deliberately misaligned tile grid, and why

The tile grid is **deliberately not aligned** with the 5 GB fixture's own parcel grid (Part H's
fixture is generated on a regular `id % cols, id / cols` raster grid, per
`kernel/RESULTS.md` seventh section — the same raster-order fact that section's zone-map pruning
discussion already establishes). If the tile grid happened to coincide with the parcel grid, every
feature would fall entirely within one tile by construction, and G1's cross-tile dedupe assertion
would pass **vacuously** — it would never see a boundary-spanning feature to deduplicate. The grid
offset is therefore a **structural test precondition**, not a stylistic choice: without it, the
dedupe path ships untested by construction, which is exactly the shape of bug this preregistration
exists to prevent from hiding behind a passing suite.

### 4d. Tile size — SWEPT, not chosen; 3 levels proposed, PENDING THE HUMAN'S SIGHT

**Proposed levels** (candidate arm only): three grid resolutions over the fixture's own declared
bbox — **coarse** (8×8 tiles), **medium** (16×16 tiles), **fine** (32×32 tiles). Linear tile edge
length halves at each step, so the sweep spans **~4×** from coarse to fine (coarse edge = 4× fine
edge; area per tile spans 16×, edge length spans 4×, and it is the edge-length figure this
preregistration means by "~4×," since the finding-4 numbers below are keyed to a linear viewport
fraction, not an area fraction).

**Justification, from the fixture's own extent and finding 4's numbers.** Finding 4's steepest
cost rise sits between the quarter viewport (94.943 ms) and 1/64 (256.684 ms) — a **16×** jump in
scale producing a **~2.7×** jump in first-batch cost, the sharpest part of the curve this cut has
measured. A tile-size sweep that reached all the way to a 1/64-scale tile would (a) probe well past
the sharpest part of the known curve in one step, obscuring where inside that range the inversion
actually starts to bite, and (b) begin to approach the sub-pixel scale where 24(c)'s hover refusal
already applies — tiles that small are arguably not a tiling grid anymore so much as a
pre-decimation boundary, which is explicitly out of scope (§9, LOD). A **~4×** span (roughly the
geometric midpoint of quarter-to-1/64 on a log scale) brackets the region where the inversion is
emerging without yet being catastrophic, which is the region this cut's own risk (§4a) needs data
from. **This sweep is proposed, not chosen — the human sees it before it runs, and P6 (the tester
piece) is bound to run all three levels, never one.**

### 4e. Declared max-in-flight-tile-streams ceiling — proposed, PENDING THE HUMAN'S SIGHT

**Proposed value: 3.** **Justification:** the data plane's own admission ceiling,
`spatial_data_plane::MAX_CONCURRENT_STREAMS = 4` (`protocol/data-plane/src/server.rs:60`), is a
**server-wide** ceiling across every stream any consumer holds, refused rather than queued past it
(`server.rs:367`, "declared ceiling MAX_CONCURRENT_STREAMS={N} reached; refused, not queued"). A
multi-tile pan or zoom fan-out that itself issued 4 or more concurrent `viewport_query` streams
would collide with that ceiling directly — a self-inflicted refusal indistinguishable, from the
shell's side, from genuine contention. Declaring the shell's own fan-out ceiling at **3** leaves
one slot of headroom against the kernel's own admission boundary for an unrelated concurrent
stream (an admission ticket per ADR-019, a second panel's own query) without the residency work's
own fan-out ever being the thing that trips `MAX_CONCURRENT_STREAMS`. **Proposed pending sight; P3
implements whatever ceiling the human confirms, this value or another.**

---

## 5. Registered predictions — as predictions, wrong is a result

1. **Sign of the first-pixels effect flips with tile size.** At coarse tile size, first-pixels
   (cold, per-tile) is predicted to be *faster* than the baseline arm's whole-viewport refill
   (fewer, larger tiles approximate the old behaviour); at fine tile size, first-pixels is
   predicted to be *slower*, converging toward finding 4's 1/64 shape. The **sign** of the
   coarse-vs-baseline and fine-vs-baseline comparisons is the registered claim; the magnitude is
   not predicted.
2. **Reuse nets-reduces refill at the 5 GB fit view.** At `Zoom-to-layer` (trace step 11, and the
   original fit at step 1 revisited), the candidate arm's tile cache is predicted to serve a
   non-trivial fraction of the view from already-resident tiles rather than issuing a full refill —
   i.e., total refill work (bytes/features requested, reported per §6, never gated) at step 11 is
   predicted to be measurably less than at step 1, for the same nominal view. Being wrong (no
   measurable reduction, or an increase) is itself the answer to whether reuse is worth the
   tiling cost at this fixture's shape.
3. **Non-zero duplicate rate at the misaligned grid.** With the tile grid deliberately offset from
   the fixture's parcel grid (§4c), the raw per-tile query responses (before dedupe) are predicted
   to contain a non-zero rate of boundary-spanning feature ids returned by more than one tile —
   i.e., the dedupe path is predicted to have real work to do at least once across the trace, not
   only in principle. A zero-duplicate result would mean either the grid offset failed to produce a
   crossing case (a preregistration defect to report) or the fixture's parcels genuinely never
   straddle this grid at this resolution (a fixture fact to report) — either way, a result.

Being wrong about any of them is a result, not an embarrassment.

---

## 6. Instruments — the quantities table

| quantity | class | instrument | notes |
|---|---|---|---|
| First pixels | **gated (G3)** | client wall clock, `viewport_query` issue → first paintable batch, docs/08 Polygons class only | existing row, quoted §2e; instrument-off control cell required (§8) |
| Frame time p50/p95 vs. vsync | **gated (G4)** | client compositor-frame timer, per docs/08's own vsync-interval wording | existing row; instrument-off control cell required |
| Cancellation `cancel_requested → cancel_observed`, under fan-out | **gated (G5)** | client clock, ADR-018 vocabulary, p50/p95 scored, max always reported | existing row; `cancel_quiescent` reported beside, no budget |
| Budget adherence, every trace step | **assertion (G6)** | resident vertex counter sampled at every settle point (§4b) | not a percentile — one violation fails the gate |
| Rendered ⊆ authoritative; dedupe exact; no superseded batch | **assertion (G1)** | per-step comparison against the kernel's own response set, by stable feature id (ADR-016) | correctness, not a distribution |
| Refill work per step | **reported beside, never gated, never netted** | bytes/features requested per tile-refill event, client-side counter | sits beside first-pixels at the same step; never subtracted from it, never used to excuse a slow first-pixels number (§4a, ninth-section netting prohibition) |
| Input-to-present proxy | **reported, never gated** | client clock, pointer/keyboard event → next composited frame carrying its effect | proxy only — not a docs/08 row, no budget attaches |
| Budget-calibration observation | **reported, never gated — any change QUEUED** | is 2,000,000 (`MAX_RESIDENT_VERTICES`) still the right ceiling at this fixture's shape, observed against G6's per-step counts | any proposed change to the constant is queued to the human, never silently adjusted by this work |
| Pick agreement | **assertion** | candidate-arm pick result vs. baseline-arm pick result at identical camera state, for picks above 24(c)'s pixel-size threshold; below threshold, the refusal-by-name itself is the assertion (§2c item 3) | correctness, not a distribution |

**The instrument-off control cell.** Every gated quantity (G3–G5) is measured twice per cell: once
with the client-side instrument active, once with it compiled out or disabled, on otherwise
identical arms. This is the same discipline `docs/08`'s ADR-018 row already applies at the wire
level (ADR-004 Amendment 4: "instrument surface is never an SKP field, proven by byte comparison")
extended to the client clock — the first time this repository scores a client-clock row at all
against a `docs/08` budget, so the instrument itself is a suspect until shown otherwise.

**Wire-bytes-identity assertion.** Alongside the instrument-off cell: the bytes actually placed on
the data-plane wire (the `viewport_query` request and its streamed response frames) must be
byte-identical whether the client instrument is on or off. A difference means the instrument is not
transparent and no gated number from an instrument-on cell is admissible until it is.

---

## 7. Declared watchdog ceilings, before measuring

| watchdog | ceiling |
|---|---|
| per-step settle (§4b) | 5 s |
| one full camera-trace trial (all 11 steps, one arm/fixture/tile-size cell) | 180 s |
| fixture re-hash, 5 GB | 900 s (inherited from `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §7's 5 GB rewrite ceiling — this file only re-hashes, never rewrites, so 900 s is generous headroom, not a tight bound) |
| fixture re-hash, docs/08 Polygons class (145 MB-scale) | 120 s |
| opening settle, before the first canary | 120 s (this repository's standing figure — §8) |
| canary spread | ≤ 10 % per phase (this repository's standing figure — §8; also G7's own margin justification, §2d) |
| stream-silence, any in-flight `viewport_query` | 120 s |

**Invalidators, inherited from this repository's standing practice** (§8): a fired watchdog records
the row/trial `unmeasured — watchdog at N s` and is **not** re-run within this cut beyond the one
re-run §4b's per-step rule allows · a trial whose declared conditions (arm, tile size, instrument
state) differ from the cell's declaration is an observation, not a sample, and is not promoted into
the cell's statistics · a fixture hash mismatch invalidates the cell · an `unmeasured` cell in G3/
G4/G5/G7 removes that cell from the gate's verdict, it is never treated as a pass or a fail by
omission.

---

## 8. Standing measurement rules and confounds, binding

- **Mechanism self-check** before the opening settle — a harness that cannot measure fails in
  seconds, never produces a complete-looking artifact of `unmeasured` rows.
- **One process per trial**, interleaving arms **by a committed pure function** — never by hand,
  never by a live random call (this repository's standing ABBA discipline, e.g.
  `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §8).
- **Same build ± the residency module.** The baseline and candidate arms differ by exactly the
  residency change and nothing else — same binary hash reasoning `kernel/RESULTS.md` ninth
  section's "Instruments" note already disclosed applies here too (a relink changes a hash even
  with zero source change under this workspace's release profile; every hash is logged at time of
  use, never asserted against an earlier value). This is the same isolation discipline the
  import-layout gate used to keep the writer effect from being misattributed to the order effect
  (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4, "all files come from the same writer... `H`
  against `C` differs by the row order and by nothing else") — applied here so a candidate-vs-
  baseline difference is never confounded with an unrelated code change riding along in the same
  build.
- **Fixtures hashed before the trial loop AND re-hashed after the last trial.**
- **ABBA by committed pure function**, both across arms and across tile-size levels — never a
  fixed order that could let session drift (thermal, cache warmth, background load) masquerade as
  an arm or tile-size effect.
- **One process per trial** (restated for visibility): no two cells share a warm process, so no
  cell's first-instance cost lands in another cell's numbers.
- **Cold/warm declared** for every cell — which state the OS file cache and the resident tile cache
  are in at the start of the cell is stated, never left implicit.
- **Instrument-off control cell + wire-bytes-identity assertion** — §6, restated here as a standing
  rule: no gated quantity is admissible from an instrument-on cell alone.
- **No RustDesk in any measured cell** — headed, foreground, reference machine (decision 24(g)).
  A remote-desktop session changes compositor and input timing in ways this pass has no budget to
  characterize; any cell run under one is `unmeasured — RustDesk in path`, not a sample with extra
  noise.
- **Deterministic-or-unmeasured.** Per-step resident feature counts must be identical across a
  cell's repeated trials (ABBA-paired or otherwise); a cell whose per-step resident counts are not
  deterministic is recorded `unmeasured — non-deterministic`, an instrument/mechanism fault, never
  averaged or reported as a spread — the same treatment the import-layout gate's own read-byte
  determinism condition gives a non-deterministic instrument.
- **Registered element not run ⇒ `unmeasured` with reason.**
- **Attempt invalidated ⇒ recorded and re-run; a phase is never re-run after its result is seen.**
- **Trace policy:** untraced carries every verdict (no dependency on a tracing subsystem being
  active for any gated number).

---

## 9. Non-goals, explicit — lifted from `NEXT-CUT.md`

LOD/decimation/aggregate overviews (owes its own preregistered gate) · import-side LOD columns
(`docs/07` line-22 reopen conditions need fresh gates) · partial GPU buffer updates (ADR-011 item
2) · per-tile origins (C2) · cache versioning/stale-pick (ADR-011 items 4–5) · any `docs/08` row
(C1) · marking ADR-011 gate 8 met (C4) · macOS/Linux · transport · touching `kernel/RESULTS.md`
with client-clock figures (§1).

---

## 10. ADR touches — lifted and expanded from `NEXT-CUT.md`

Nothing accepted is amended by this preregistration or by any work it licenses. Cited:

- **ADR-010** rules 1, 3, 5, 6 — the invariants the candidate residency mechanism must satisfy, not
  replace. C2 keeps rule 3 (single render origin) untouched; rule 6 (no plausible-but-arbitrary
  pick) is exactly what 24(c)'s hover refusal-by-name discharges; rule 5 (no cache work gates or
  delays a commit) bounds how the tile cache may interact with any transactional mutation, though
  this cut's residency is ADR-006 class 1 (ephemeral) throughout (C4).
- **ADR-011** — the unmeasured tiled direction this cut works toward, not presumed settled; gate 8
  is the question this cut's evidence answers in writing, the ruling stays the human's (C4).
- **ADR-016** — stable feature identity, which G1's cross-tile dedupe assertion depends on
  directly.
- **ADR-019 / ADR-014** — stream admission and concurrency, which §4e's proposed max-in-flight
  ceiling is sized against (`MAX_CONCURRENT_STREAMS`).
- **ADR-018** — cancellation vocabulary, applied throughout (G5, §2e): "acknowledged" retired from
  prose, `cancel_requested → cancel_observed` scored, `cancel_quiescent` reported beside with no
  budget.
- **ADR-004 Amendment 4** — the instrument-surface-is-never-wire-carried pattern this file's
  instrument-off control cell and wire-bytes-identity assertion (§6, §8) extend to the client
  clock.
- **ADR-027** — console display of a per-pan command fan-out; G5's fan-out cancellation cell and
  §4e's max-in-flight ceiling both interact with what the action console shows for a multi-`viewport_query`
  pan, though this file does not itself change the console.
- **ADR-028** — filed alongside this document (see `docs/adr/ADR-028-*`), the home of record for
  the candidate decision this preregistration's evidence will let the human accept or reject.

**This piece files no ADR content beyond what §B of the parent task names** — ADR-028 is filed as
its own file, not amended into this preregistration.

---

## 11. Outcome this preregistration is pre-authorized to reach

**Any one of G1–G7 failing is a legitimate and complete result**, per each gate's own fail
condition and per the import-layout gate's precedent this file deliberately reuses: a fail is not
netted against a comfortable pass elsewhere (§1, §4a). If any gate fails, the declared-ceiling
refusal with its persistent rendered/total status remains the shell's contract exactly as ADR-011
gate 8's own text already states, ADR-028's candidate decision is rejected on the evidence, and
this cut's value is the bracket its factorial establishes regardless — including, at minimum,
whichever of the three registered predictions (§5) held and whichever did not, and where inside
the coarse/medium/fine tile-size sweep (§4d) the finding-4 inversion (§4a) actually starts to bite.
**A full pass on G1–G7 is not, by itself, a ruling that ADR-011 gate 8 is met** — that ruling is
the human's, on this evidence, per C4.

---

## 12. Amendments

**Amendment 1 (2026-08-30, pre-run — before any measured cell exists).** §4b step 6's phrase
"√2 × the pan distance above" is ambiguous between step 2's (viewport-height) and step 5's
(viewport-width) basis. Resolved: **step 5's width basis**, as implemented and disclosed inline
in `e2e/residencyTrace.mjs` (the P1 harness worker found the ambiguity and reported it rather
than amending this document — this amendment records the resolution so the committed trace and
this preregistration agree before the first measured run). No run had occurred when this
amendment was made; no measured quantity is affected.

**Amendment 2 (2026-08-30, pre-run — supersedes Amendment 1's "as implemented" certification.)**
The P0–P1 reviewer gate found (its M8) that the code Amendment 1 certified realized the diagonal
at **2 × width** (full distance applied to both axes), not the declared √2 × width. Fixed in
P1b: the realized diagonal is now total = width·√2, per-axis screen components = distance/√2
(each axis moves exactly one viewport width). Amendment 1's basis resolution stands; its
certification of the then-implementation does not. No measured cell existed at any point.

**Amendment 3 (2026-08-30, pre-run.)** §6's quantities table scored G5 (cancellation) on the
client clock; §2e's own quotation of the docs/08 row defines it on the **producer's clock**
(`cancel_requested → cancel_observed`, ADR-018), and §1 forbids exactly that cross-attribution.
Corrected: **G5 is scored producer-side from the kernel's existing ADR-018 instrumentation; the
client-observed figure is reported beside it, never gated, never compared across clocks.**

**Amendment 4 (2026-08-30, pre-run.)** Build-class disclosure: every measured cell this
document governs runs the **Vite dev build** (`tauri dev`; DEV-gated hooks; unminified client)
— the harness cannot drive a release build at all, since its hooks compile out. Every evidence
file carries `buildClass` stating this; no figure from these cells may be read as a
release-build product number, and any future release-build measurement is a new campaign under
its own amendment.

**Amendment 5 (2026-08-30, pre-run.)** §4b step 1's "from a cold, empty resident set"
precondition is not literally met by the sequenced trace: the `open-drain` pre-step (added in
P1b so G7's cold first view is measured at all — the reviewer's M7) populates residency before
the fit step runs. Resolution: **the campaign's cold first view lives in the `open-drain`
pre-step; step 1 measures fit-over-drained-residency** and is read as such in analysis. G7's
cold-view comparison uses the pre-step's figures on both arms.

**Amendment 6 (2026-08-30, pre-run.)** The §8 instrument-identity guard, as first implemented
(exact render-trace field-sequence comparison under real synthetic gestures), cannot
discriminate instrument effects: instrument-ON runs disagree with each other as much as ON vs
OFF (CDP timing jitter interacting with the 120 ms issue debounce — proven by the committed
gate evidence, which records the non-pass rather than a cherry-picked pass). Resolution: **the
identity mode drives a deterministic programmatic camera path** (realism is not the property
under test in that mode; measured cells keep real gestures); until that mode passes
OFF-ON-ON-OFF with all pairwise comparisons identical, the identity claim is recorded as
"not established", never "passed". *(Discharged same day: P1d's live run passes all six
pairwise comparisons with the per-step machinery genuinely armed on every run — the committed
gate-evidence file holds all three dated attempts.)*

**Amendment 7 (2026-08-30, pre-run.)** §7 gains a watchdog row the instrument's implementation
made necessary: the first-pixel render-hook arm carries its own self-restore watchdog, **scaled
to the owning step's declared `settle.timeoutMs`** (never a fixed constant shorter than the
step's own allowance — the re-review's B5 found a fixed 5 s cap that would have made slow cold
opens systematically unmeasurable, exactly G7's subject). A watchdog-restored arm records
`armDisarmedCleanly: false` and the step's first-pixel quantity is honestly absent, never a
stale number.

**Amendment 8 (2026-08-30, pre-run.)** §6 availability note: client-clock gated quantities
(first-pixels, frame series) exist **only in instrument-on cells** — the instrument-off control
cell guards wire behavior, not quantities, and can never produce a gated client-clock figure.
"Measured twice per cell" is therefore satisfiable for those quantities only across
instrument-on trials; the control cell's role is the identity guard plus driver-observed wall
facts. Every evidence file carries a `gatedQuantityAvailability` note stating this.

**Amendment 9 (2026-08-31, pre-run — PROPOSED-PENDING-SIGHT, joining the three §2/§4 values.)**
§7's per-step settle timeout (5,000 ms) is structurally too small for the over-ceiling fixtures:
the Polygons-class dry-run showed genuine, healthy streaming still in flight at the 5 s mark
(in-flight 1, real batch traffic, resident total climbing), and the open-drain pre-step's own
declared bound for the same full-extent stream shape is 60 s (observed need: 47–51 s). Proposed:
**the per-step settle timeout is fixture-scaled — 60,000 ms on the docs/08 Polygons class and
the 5 GB fixture, 5,000 ms retained on the small fixtures** — mirroring the open-drain
precedent rather than inventing a new bound. A step that exceeds its scaled bound still
invalidates the whole trial (§4b unchanged). This value locks with the other
proposed-pending-sight figures at the baseline run.

**Amendment 10 (2026-08-31, pre-run.)** The full-trace Polygons dry-run showed §4b's step order
makes the zoom step-class unmeasurable by construction on the scored fixture: the diagonal pan
exits the data field, so all three zoom-ins and the zoom-out query an empty region (each issued
exactly one real stream — the gestures and queries work — and each honestly returned zero
batches, leaving G3's zoom class with no first-pixel samples). Resolution: **the trace's step
order becomes fit → 5 pans → Zoom-to-layer → 3 zoom-ins → 1 zoom-out** — Zoom-to-layer (which
fits the visited union, data-rich by construction) precedes the zoom block so zooms operate
over data. Step definitions, settle criteria, and counts are unchanged; only the order moves.
No measured cell existed when this amendment was made.

**Amendment 11 (2026-08-31 — THE LOCK.)** The human approved all four proposed-pending-sight
values at the baseline session's start, in their own words: "all four approved, I'm at the
machine." Locked as of this amendment, before the first measured cell: **G7 cold-first-view
margin 110%; tile-size sweep 8×8 / 16×16 / 32×32; max-in-flight tile streams 3; per-step
settle timeout fixture-scaled (60,000 ms on the Polygons class and the 5 GB fixture, 5,000 ms
on small fixtures).** These figures are no longer proposed anywhere; every "proposed-pending-
sight" marker above and in the harness constants reads historically from here on. RustDesk was
verified stopped (process-level, not merely disconnected) before the first cell.

**Amendment 12 (2026-08-31, post-baseline, pre-candidate — 5 GB bounds).** Both baseline 5 GB
attempts were invalid for structural reasons the Polygons class cannot produce (t10/t11,
RESULTS.md §5): the 5 GB fixture's own steps need more than Amendment 9's 60 s (observed:
open-drain 64.7–64.8 s, fit 90.2 s, pan-north 65.1 s), and the OUTER trial watchdog was never
fixture-scaled at all, so it fires by construction once three steps run long. Resolution: **the
5 GB fixture's per-step settle bound becomes 150,000 ms** (observed worst 90.2 s + the same
~60% headroom Amendment 9's 60 s gave its 47–51 s evidence; the Polygons class keeps 60 s), and
**the outer trial watchdog scales to (step count + 1) × the fixture's per-step bound** rather
than a fixed constant. The scored Polygons cells are unaffected; the baseline 5 GB cells remain
honestly unmeasured until a re-run under these bounds.

**Amendment 13 (2026-08-31, post-baseline, pre-candidate — the 5 GB banner re-raise race).**
Baseline t11 failed because the over-ceiling banner RE-RAISES between the harness's dismissal
and its next click at the 5 GB fit view — every refill re-trips the ceiling, a race smaller
fixtures cannot produce. Resolution: the harness's pre-click dismissal becomes a bounded
dismiss-then-click retry (≤3 attempts, each dismissal recorded on the step's evidence row);
if the third click is still intercepted, the step fails with the banner state captured. This
mirrors what a real operator does when a banner reappears, and every dismissal remains data.

**Amendment 14 (2026-08-31, post-baseline — the §8 determinism rule's scope, clarified).** §8's
"deterministic-or-unmeasured" rule exists to catch INSTRUMENT faults (a counter that changes
between identical runs is broken bookkeeping). The baseline showed a different phenomenon:
four step-classes carried two distinct resident-feature counts across the seven trials — small,
real, realized-gesture variance (the same wheel/drag lands on slightly different frames run to
run), which is SAMPLE variance, not an instrument fault. Clarified: **per-step resident counts
that vary within 2% across a cell's trials are reported as a spread (min–max beside the
figures); variance beyond 2% keeps the original rule's meaning** — the cell is
`unmeasured — non-deterministic` pending instrument diagnosis. The baseline's four flagged
classes fall within the 2% band and stand as reported-with-spread (RESULTS.md §4's disclosed
tension resolves under this clarification).

**Amendment 15 (2026-08-31, human-directed — client-side segment decomposition; reopens the
instrument gate in bounded form).** §6 gains three per-step sub-spans, REPORTED-BESIDE and
never gated (G3's row stays the total): **query→first-byte** (issue to the first data-plane
bytes of the step's first batch), **first-byte→decoded** (to the batch decoded), and
**decoded→painted** (to the first-pixel stamp). Rationale, the human's own: without the split,
P6 cannot attribute candidate gains, and no one can say how much of the baseline's ~470 ms is
client-addressable at all. Because the P1 instrument gate has passed, this instrument change
carries its own bounded mini-review before the next measured cell; the baseline's existing
cells remain valid as recorded (totals are unaffected by decomposition added later).

**Amendment 16 (2026-08-31, human-directed — one release-class calibration cell).** Before any
budget-vs-reality ruling, ONE Polygons-class cell runs on a **measure build**: release-profile
compilation (cargo release; minified client) with the instrument hooks and the debug-gated CDP
port explicitly compiled in via a named build flag — honestly a THIRD build class, declared in
full in `buildClass` (neither pure release nor dev; its purpose is calibrating how much of the
client cost is the dev build). Reported-only, never gated, never quotable as the product's
release numbers — but it bounds every claim built on the dev-build cells. The flag's compiled-in
port stays inside docs/09's dev/debug-gate discipline: never a shipped default, the measure
build is a locally-built artifact for this campaign only.

**Amendment 17 (2026-08-31, pre-candidate-cells — the candidate arm's identity criterion).**
With real render-trace emission (P3i-c), the candidate arm's identity guard found ALL SIX
pairwise sequence comparisons differing — including OFF-vs-OFF — with identical line counts
(3,252) in every run, and a custodian multiset comparison then proved **the four runs' line
multisets byte-identical**. Diagnosis: the candidate's up-to-3-concurrent tile streams complete
in scheduling-dependent order, permuting the issue interleaving run-to-run — an arm-intrinsic
property independent of instrument state, not an instrument effect. Resolution: **the candidate
arm's identity criterion is multiset identity over the normalized line set** (exact-sequence
identity stays the baseline arm's criterion, where it passes); the ordering nondeterminism is
recorded as the candidate arm's own declared property, and per-step COUNTS remain governed by
Amendment 14's 2% band (this run: counts exactly equal across all four runs). A candidate cell
is admissible when the multiset criterion passes across OFF-ON-ON-OFF.

**Amendment 18 (2026-08-31, pre-candidate-cells — over-budget steps' determinism, decided in
advance).** At the vertex-budget boundary the candidate's three concurrent tile streams make
the surviving feature set interleaving-dependent (whole-feature prefix per batch, but the
interleaving decides which batch hits the boundary). Decided now rather than mid-campaign: an
over-budget step's RESIDENT-COUNT quantity is evaluated under Amendment 14's 2% band like any
other; if its spread exceeds the band, THAT quantity for THAT step is marked
`non-deterministic — over-budget interleaving` **without invalidating the trial's other
quantities** (first-pixels, segments, frame times are single-batch/clock quantities unaffected
by which features survived). G6's budget-adherence assertion is unaffected (adherence is about
the ceiling, not the survivor identity).

**Amendment 19 (2026-08-31, pre-candidate-cells — the P2 baseline cells are superseded for
comparison purposes).** The complex review (S8) established that the P2 baseline cells predate
both the instrument's final shape (P3i's baseline-path arrival marker) and the build-class
machinery. Therefore: **the campaign's scored comparison uses a fresh baseline arm re-run under
the final configuration, in the same session and build class as the candidate cells.** The P2
cells remain the valid record of the shipped dev-build's own behavior at their recorded
configuration — citable as that, never as the candidate's comparison arm. G7's margin applies
against the re-run baseline.

**Amendment 20 (2026-08-31 — MADE AFTER A RESULT HAS BEEN SEEN; it invalidates the pan
step-class cells it touches).** Context: under identical declared gestures, §4b step 6's
diagonal realizes either an off-data no-batch or a ~172 s fan-out — the step's geometry sits
on the fixture's data boundary, so it measures gesture jitter rather than the product; 172 s
also exceeds both Amendment 9's and Amendment 12's per-step bounds, which invalidates the
whole trial by §4b. Decision (architect-recommended option (a), its conditions met): step 6
becomes **0.5 viewport width per screen axis (total 0.5·√2·width)** — trace **v3** — chosen
structurally (bounded inside the fit extent for any fixture whose extent ≥ 2 viewport widths),
not fitted to an observed run. Both arms are measured under v3; Amendment 19 already mandates
a fresh baseline, so comparability is preserved at no additional cost. Step 6 is now
predicted data-bearing at every trial; a no-batch realization is a reportable trace defect.
Each step-6 row records realized covering-tile delta and pre/post view state. Consequences:
the existing pan-class cells are not comparison arms for v3; the non-axis-aligned corner
crossing G1's dedupe/cascade assertion depends on is retained.

**Amendment 21 (2026-08-31, pre-run).** §8 gains: every evidence file records the derived
`gridFrame {originX, originY, baseSpan, level}`; a frame that differs across a cell's trials
records the cell `unmeasured — grid frame drift`. §6's wire-bytes-identity assertion is
restated as **per-request** byte identity (each `viewport_query` request and its response
frame set), order-independent — Amendment 17's multiset reasoning applied to the assertion
that had silently retained the old wording. Amendment 16's calibration cell declares its arm
and is never compared across build classes or arms. G6's pass is recorded as **structural**
(admission trims before insert; the ceiling is unexceedable by construction) — an argument,
not a sampled measurement, and stated as such wherever G6 is reported.

**Amendment 22 (2026-08-31, pre-session — the screening reading, chosen by the human:
"Let's go with option 3".)** The tile-size sweep's purpose is SELECTING a level; only the
chosen level's cell is scored. Protocol: **(1) screening** — n=3 trials per level
(coarse/medium/fine, ABBA-interleaved); **(2) selection by the pre-declared criterion**: the
level with the most valid trials wins; ties break by lower fit-step first-pixels p50 across
its valid trials; a level whose screening trials ALL invalidate is eliminated (its
invalidation is reported as the sweep's own finding); **(3) top-up** — the winning level runs
4 further trials (its 3 screening trials count toward the scored cell's n=7: same
configuration, same session, same build — declared here); **(4) the fresh baseline** (n=7 +
2 instrument-off controls, Amendment 19) and **(5) the Amendment 16 calibration cell** run in
the same sitting. Non-winning levels' screening figures are REPORTED-NEVER-SCORED selection
data. The 5 GB reported-only cells are DEFERRED to a separate optional session (they are
never scored; no scored conclusion depends on them; they remain honestly unmeasured until
run). Same sitting also records: the human approved the four user-facing strings verbatim
("wording approved", this date) — the 24(b)/24(c) sight condition is discharged.

**Amendment 23 (2026-09-01 — MADE AFTER THE CAMPAIGN'S RESULTS WERE SEEN; the iteration
protocol, chosen by the human: "Let's iterate").** The campaign returned a mixed verdict
(G7 pass at ~2×; G4 fail, attributed by the Amendment-15 segments to a paint-segment
regression, not fetch). The human elected iteration over acceptance or rejection. Protocol:
**(1)** a bounded product fix targeting the paint regression only (layer construction/identity
for the candidate's resident tiles — fetch, planning, dedupe, eviction, and the over-budget
contract are OUT of the fix's scope; any change there voids this amendment's re-measure);
**(2) the re-measure session**: candidate at FINE only (the sweep's selection stands — its
criterion was trial validity and fit first-pixels, neither altered in direction by a
paint-side fix; re-screening would spend ~40 minutes to re-ask an answered question) at n=7,
plus a fresh baseline n=7 + 2 controls + 1 calibration cell, same sitting, same build class,
all three gates (G3/G4/G7) RE-SCORED in full — the prior campaign's scored section remains
the record of the pre-fix candidate, never averaged with the re-measure; **(3)** the gate-8
ruling happens on the re-measure's evidence. Dev-build smoke paint-segment deltas guide the
fix's development but are directional only, never quoted as results.

**Amendment 24 (2026-09-03 — MADE AFTER ALL SCORED RESULTS WERE SEEN; entry-31 instrument
repairs and the per-stream evidence-shape addition; changes no scored gate, no scored
number, and no gesture/settle protocol).** The DECISIONS-PENDING entry-31 attribution pass
(`spikes/viewport-residency-1a-diagnosis/ATTRIBUTION-PASS.md`) traced three instrument defects;
the human ordered them fixed before any further attribution runs. This amendment records
what changed, the Amendment-21 evidence-shape class: **(1)** the §6 segment clamp tightens —
`queryToFirstByteMs` clamps at `<= 0` (exactly-0 is the cross-step arrival-before-issue chain
inside one clock quantum, never a measurement; distinct reason `"cross-step-stream-zero"`);
`decodedToPaintedMs` is nulled iff the step's issue record postdates its decode record (the
only shape where the span contains the issue-wait rather than paint — in-chain rows' genuine
paint values are kept); `firstPixelCrossStepSuspect: true` flags a cross-step row's
`firstPixelMs` as arrival→paint rather than query→paint (flagged, not nulled — it is §6-gated
and stays reported). Applies from this commit forward; every already-recorded evidence file is
unchanged and P8/P10/P12's scored readings are not re-derived. **(2)** Every evidence file now
also records `wireTraceLines` (the wire-relevant console lines with driver-receipt `at` stamps,
declared a proxy in-band via `wireTraceTimestampBasis`) — passive, write-time only. **(3)** An
opt-in `--per-stream-trace` mode adds a ~1s queue-depth sampler; it is a measurement-conditions
change, declared per-cell (`cell.perStreamTraceEnabled`), and a cell carrying it is never used
for scored protocol readings. Nothing in this amendment alters §4b gestures, §7 watchdogs, §8
standing rules, or any G1–G7 definition.
