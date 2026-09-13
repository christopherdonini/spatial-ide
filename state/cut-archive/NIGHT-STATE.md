# NIGHT-STATE — the night cut and both morning amendments, complete

**All work is committed and PR #5 is open.** This file is the session's own record; the durable
record is `kernel/RESULTS.md`'s seventh section plus its amendment, and
`kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` with A1, A2 and A2.1.

## Morning session (operator present) — status

| item | state |
|---|---|
| **A1 — 5 GB clustered cell** | **done.** `first-batch-5gb-clustered.json`. Crossover moved on IO; gate still fails |
| **A2/A2.1 — probe, headless** | **done, attempt 2.** Attempt 1 invalidated at 53 % canary; three instrument defects fixed |
| **A2/A2.1 — probe, headed** | **done.** Canary 6.5 %; all four comparisons not resolvable |
| Amend the seventh section with both | **done** — `5e5aaec`, after a reviewer pass that found 6 blocking prose defects (all fixed) and verified all 100+ table numbers correct |
| PR | **open — https://github.com/christopherdonini/spatial-ide/pull/5** |

### A1 result in one line
Read volume: the curve reads **30.8 %** at the near quarter against raster's 50.1 % (at 13 groups it
read *more*), and **3.0 %** against 12.7 % at 1/64. **Prediction 4 confirmed on the mechanism.**
First-batch gate: near quarter **31/49** (p50 lower, rank short of 42), far quarter 20/49, 1/64
**49/49**. **Gate still fails at the declared quarter viewport** — but it fails differently from
145 MB, where it lost on p50 (0/49); here the sign flipped and only the separation fell short. Total
time is where the win lands: **4,265 ms vs 5,821 ms** at the near quarter, ~27 %.
Writer control at 5 GB is **larger** than at 145 MB: `C5` vs `G5` is 0/49 whole, 2/49 near quarter.

### A2 headless result in one line
**All four comparisons `not-resolvable-by-this-instrument`** (Δ −12.8 / +4.0 / −5.7 / +1.3 ms against
the 29 ms floor declared in A2.1 before the run). Full payload does move with IO — `H` 1,837 ms vs
`C` 2,078 ms at the quarter — reported, not claimed.

### Three probe-instrument defects, found in use and not in review (commit `5c0cdb0`)
1. **A stale gitignored `dist/` bundle**, two days behind `src/main.ts`. The page ignored **both**
   `scenario=solo` and `bbox`: every trial streamed the whole 100 000 rows under the supersede
   scenario while filed as a quarter-viewport solo trial. Silent, and the timings looked plausible.
   Now: refuse a bundle older than its source, **and** assert each cell's row count.
2. **The record was read at the wrong level** (`results.trial` / `results.segments`, not top level),
   so all 23 trials were dropped while the page loads were fine. The duplication this script's header
   recorded as owed is exactly what cost this.
3. **The instrument loaded the machine it measured**: 459 live `msedge.exe` holding 44 profiles by the
   end of one block, canary **53 %**. Now killed by command-line match (never image name — the
   operator's own browser is open) and swept per trial. Canary went 53 % → **5.4 %**.

**The two probe attempts side by side are the argument for the pre-declared floor.** The contaminated
block reported `H` faster by 46.3 ms at the quarter *and* `C` faster by 156.6 ms at 1/64 — two
"resolvable" verdicts in **opposite directions**. The clean block reports −12.8 and −5.7 ms, same
sign, both below the floor.

### Binary/artifact pins this morning
`3596ae4e` (5 GB clustered harness) · `194d7468` (slice-host rebuilt for the probe) · probe bundle
rebuilt 11:25. Nothing differenced across any pin.

---



**Untracked by design** (`NIGHT-CUT.md` autonomy rule 2). A fresh session must be able to continue
from this file alone.

- **Brief:** `NIGHT-CUT.md` — **retired**, per its own Status line ("transient; deleted by the final
  docs commit"). It was never tracked, so a copy is in this session's scratchpad
  (`…/scratchpad/NIGHT-CUT.md.backup`) in case the operator wants the original wording. Its substance
  is fully carried by the **retained** `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` and by
  `kernel/RESULTS.md`'s seventh section.
- **Branch:** `cut/first-batch-and-pruning` · **HEAD:** `b0585ee` · started from `8f896f6`.
- **Run: 2026-08-08, unattended overnight. Complete.**

## `git status --porcelain` — what is left, and why it is not empty

```
?? NATIVE-WGPU-BAKEOFF-DRAFT.md
?? NEXT-CUT.md
?? NIGHT-STATE.md
```

`NIGHT-STATE.md` is expected. **The other two belong to a different, docs-only cut** (`NEXT-CUT.md`
is its brief and the draft is its input); they were untracked before this cut began and this cut did
not touch them. Deleting another cut's untracked brief to satisfy a cleanliness check would destroy
work, so they are left and named here instead.

## Phase log

| # | Phase | State | Commit / evidence |
|---|---|---|---|
| 0 | Preflight — brief, engine, disk (96 GiB free ≥ 20 GiB) | done | — |
| 1 | Architect declarations | done | recorded below |
| 1b | DuckDB capability probe (pilot, disclosed) | done | four findings below |
| 2–4 | Levers A, B1, B2 + tests | done | `bf0c385` |
| 5 | Reviewer over code — 5 BLOCKING + 8 SHOULD-FIX + 12 notes, **all fixed** | done | `bf0c385` |
| 6 | Preregistration, retained, committed before the harness | done | `60d3d57` |
| 7a | Factorial harness | done | `9ddb1e3` |
| 7b | Factorial run — **attempt 1** | **INVALIDATED** | instrument defect, zero samples |
| 7c | Harness fix + mechanism self-check | done | in `b0585ee` |
| 7d | Factorial run — **attempt 2, run of record** | done | 384 trials, 0 unmeasured |
| 7e | Cancellation re-asserted with pruning in the path | done | `first-batch-cancel.json` |
| 8 | 5 GB spot cells — ScanOnly arm (the declared scope) | done | `first-batch-5gb.json` |
| 9 | RESULTS.md seventh section | done | `b0585ee` |
| 10 | Reviewer over the write-up — 8 BLOCKING + 15 SHOULD-FIX + 13 notes, **all blocking fixed** | done | `b0585ee` |
| 11 | Working tree clean except this file and the other cut's two | done | see above |
| 12 | PR | **morning task** | with deferred items noted |

## The result, in six lines

- **Lever A: gate NO.** The time budget fired **0 times in 426 trials**. `source_to_first_batch` is
  0.030–0.255 ms; the budget is 8 ms. An **unexercised** null, not a refutation.
- **Lever B2: gate NO**, on the condition the lever exists for: its query read **exactly the same
  bytes** as `ScanOnly`, zero difference, 4 of 4 viewports.
- **Lever B1: gate NO** at its declared quarter viewport (**0 of 49**), **beats at 1/64** (45–47 of
  49, half the read volume). Not a gate pass; a real result.
- **The baseline nobody had measured:** a quarter-extent query already reads **51.8 %** of a
  13-row-group file with no index in the path, and **50.5 %** of a 403-row-group 5 GB file.
- **The mechanism worth keeping:** raster strips cost a viewport its **height**; curve blobs cost its
  **area plus a boundary term**. Cluster for small viewports, not for large ones.
- **The confound that would have been reported as a finding:** the parquet **writer** moves whole-file
  first batch by 20.1 ms (~40 %) — larger than the layout effect it would have been mistaken for.

## Morning items, in priority order

1. **The 5 GB clustered cell.** Registered prediction 4 says the height-vs-area crossover moves with
   row-group count: at 403 groups the curve should win at a quarter where at 13 it lost 0/49. The 5 GB
   ScanOnly arm run tonight shows the **raster** baseline does *not* improve with group count
   (50.5 % at 403 vs 51.8 % at 13), so the prediction now rests entirely on the curve's boundary term
   — the untested half. Needs a Hilbert rewrite of the 5 GB fixture and a declaration covering it.
   **Not run tonight because `NIGHT-CUT.md` scoped 5 GB cells to "ScanOnly vs the *winning* candidate"
   and an unattended run may not improvise past a declared scope.**
2. **Browser-probe cells**, deferred per rule 3 — they need a visible window. No number in the
   seventh section depends on one.
3. **Open the PR**, noting 1 and 2 as deferred.
4. **`docs/07`'s open item** "an index that prunes actual IO" needs finding 3's second clause — *and
   that the storage layer would not have skipped anyway*. This cut is engine-only and does not edit
   `docs/`; `engine/README.md`'s twin sentence **was** bounded here. Recorded as owed in the section.
5. **ADR-019 is not filed**, deliberately: the architect drafted it to be filed only if a lever
   passed. Its five clauses stand as the discipline a future candidate must meet.

## Scope decisions taken under the autonomy rules

| decision | why |
|---|---|
| 5 GB **ScanOnly** cells run; 5 GB **clustered** cell not | the first is explicitly declared ("same-session ScanOnly re-baseline first"); the second is not |
| Cancellation is a **property re-assertion**, not a preregistered scored cell | the brief requires it, the preregistration is silent, and an unattended run may not add a scored cell. Nothing in the gate verdicts rests on it |
| Attempt 1 recorded and re-run; no *phase* re-run after a canary breach | an instrument that produced zero samples is not a result; a phase re-run after seeing a result is a different experiment |
| The brief's three false statements corrected in the preregistration, not harmonized | `docs/01` principle 8 |
| Two other cuts' untracked files left in place | deleting them to satisfy a cleanliness check would destroy work |

## What a successor needs to know

### The architect's binding declarations (phase 1)

**Three things in `NIGHT-CUT.md` were blocked as written. The corrections bind.**

**C1 — the brief's premise about the fixture is false.** `fixture::parcel` places feature `id` at grid
`(id % cols, id / cols)` — **raster-ordered, not spatially random**. Row groups already have narrow y
envelopes, so DuckDB's zone maps already prune. **Confirmed empirically in phase 1b and in the run.**
Consequence: every registered viewport is south-west anchored, so its rows are at the *front* of the
scan while row-group elimination removes work from the *tail* — a **far-quarter** viewport was added
and is the only cell where B2's mechanism could act.

**C2 — "the first batch is emitted at *T* ms" is an unmeetable delivery deadline.** Replacement,
binding: *the first batch is **cut** at the first opportunity after T has elapsed since the first
source row, or at the size target, whichever comes first.* Never quotable as "first batch within 8 ms
of query start".

**C3 — "byte-identical payload" is impossible for B1 and unguaranteed for B2.** Replaced by a
three-tier comparison. **See the shortfall recorded in the seventh section: the harness implemented a
64-bit FNV-1a fold rather than the declared SHA-256, and never computed the per-feature digest set.**

1. **Lever A.** *T* = **8 ms** (≈ half a 60 Hz vsync interval). Batch index 0 only; `target_for`
   untouched. `MIN_BATCH_BYTES` waived on the budget arm only. **No empty batch is ever emitted** —
   if *T* elapses with zero rows the budget re-arms. Clock read at chunk boundaries and a 256-row
   stride, never per row.
2. **Clock start:** `trace::FIRST_SOURCE_ROW`, as an unconditional `Instant` (not a `trace::mark`,
   which is a no-op when tracing is off).
3. **Toggle:** `BatchCutPolicy { SizeOnly, TimeBudgetedFirstBatch }`, **no `Default`**. ADR-017 §12
   protected **structurally**: `stream_inner` refuses `ByIdentityAscending` + a time budget.
4. **B1: Hilbert order 16** over bbox centroids, quantized against a **declared** extent; tie-break
   `(key, id)`. B1 is a **layout** candidate, not an index candidate.
5. **B2: DuckDB's own `parquet_metadata()`**, never the `parquet` crate. Admissibility refuses when
   the identity's per-row-group stats are absent, overlapping or unordered; retention is the default
   on every unknown. Cache in-memory, never persisted.
6. **n = 7** admitted, a floor not a target. One process per trial. Interleaving by a committed pure
   function.
7. **Trace policy:** untraced carries every verdict; traced supplies decomposition only.
8. **Gate:** p50 lower **and** ≥ 42 of 49 pairwise.
9. **No accepted ADR needs amendment** given item 3. ADR-016 is consumed beyond its guarantee (it
   promises uniqueness/non-nullity/u64-representability, **not physical ordering**) — hence the
   mandatory per-file check. **An unattended run may never amend a preregistration.**

### Phase 1b — the pilot, and the finding that reshaped lever B

Disclosed in the preregistration §0 as a pilot run *before* it was written.

1. `parquet_metadata()` reports struct children as `bbox, xmin` — **comma-space, not a dot**. Getting
   this wrong fails silently: every group loses its envelope, every group is retained, and the lever
   reports a flawless null. Pinned by a test.
2. `COPY … (FORMAT PARQUET, …, KV_METADATA {…})` works, so a variant carries its source's `geo` key.
3. **`EXPLAIN ANALYZE` cannot evidence pruning** — its `TABLE_SCAN` reports post-filter *output* rows.
   The architect's declared instrument was **withdrawn** and replaced by `GetProcessIoCounters`
   read-volume (a bare `extern "system"` against kernel32; zero dependencies; Windows-only, declared).
4. **DuckDB already prunes on covering-bbox statistics**: 77,631,970 B of a 151,642,404 B file, 7 of
   13 row groups, no index in the path.

### Implementation findings beyond the declarations

- **F3 — DuckDB's parquet writer does not honour an arbitrary `ROW_GROUP_SIZE`**; it flushes on a
  multiple of its 2 048-row vector size (8 000 rows asked for groups of 1 000 → **four** groups).
  Material confound for B1, so `write_clustered_variant` verifies the written layout and **refuses**.
- **F4 — the two levers are mutually exclusive on one file, structurally.** B1 reorders rows; B2 needs
  identity monotone in file order. Clustering destroys it, so a clustered file is refused by name
  (`IdRangesOverlap`). Not a scoping choice — a fact about the design.
- **The writer control (`C`) is the single most important piece of setup** and the brief did not ask
  for it. Without it, the writer's 20.1 ms would have been reported as a property of Hilbert order.

### Attempt 1 — invalidated, and the transferable lesson

384 trials, 384 `unmeasured`, zero samples: libtest with `--nocapture` writes a test's output *on the
same line as its own banner*, so the driver's `strip_prefix("@@TRIAL@@")` never matched. **The
mechanism was smoke-tested and the smoke test passed** — a person reading a console sees the sentinel
and does not notice it is not first on the line, because a person does not parse. **The check passed a
human and would never have passed the code.** Fixed by moving the result into a **file**, and — the
part that matters — by a **mechanism self-check that runs before the opening settle**, so a harness
that cannot measure costs seconds rather than a night and cannot emit a complete-looking artifact in
which every row says the same thing.

### Known limits of tonight's evidence

- Every 145 MB figure is **warm-OS-cache**; the read counter is **logical** bytes, not disk traffic.
- **Windows only.** Nothing here says anything about macOS or Linux.
- **No tree pin was taken**, and the binary was hashed once *after* the factorial run — which brackets
  nothing. Recorded in the section rather than smoothed over.
- **Two binary pins**: the factorial ran on `ab9c5aa4…`, the cancellation and 5 GB phases on
  `f6790f56…`. **Nothing is differenced across them.**
- Four registered elements did not run and are recorded `unmeasured` with reasons: the 5 GB traced
  trials, the 5 GB trace-drop check, the 145 MB post-run re-hash, and lever A's empirical
  publish-determinism assertion.
