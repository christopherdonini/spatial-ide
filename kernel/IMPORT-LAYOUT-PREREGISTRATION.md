# Preregistration — import-time spatial layout (Hilbert order vs. raster vs. a shuffled control)

**Committed before the harness exists and before any measured number exists.** Same discipline as
`kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`,
`kernel/CANCEL-RESCORE-PREREGISTRATION.md` and `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`.
Every cell, trigger, ceiling, sample count, verdict rule and invalidator below is fixed by this
commit; an amendment made after a result has been seen **must say so in its first line** and
invalidates the work it touches. This file is **append-only once committed** — amendments are
dated additions, never edits, per this repository's convention for preregistrations.

**Authority.** `docs/07` line 22 names this item architect-first with its own preregistered gate.
The architect design consult ran 2026-08-13; its design note is the binding design this file
preregisters. `NEXT-CUT.md` is the transient brief carrying that note; this file is its durable
record and the retained artifact once `NEXT-CUT.md` is deleted.

**Unattended-run rule, binding.** This work runs with the human away. Declared scopes are
ceilings; an unattended session **may never improvise past one nor amend this preregistration.**
A phase that cannot run as declared is recorded `unmeasured — <reason>` and work proceeds to the
next phase. Every amendment waits for the human.

**Semantics are not defined here.** The Hilbert-order mechanism (`ClusterOrder::Hilbert16`,
`write_clustered_variant`, `DeclaredExtent`) and the raster control (`ClusterOrder::SourceIdentity`)
are frozen in code from the `first-batch-and-pruning` cut (commit `bf0c385`) and are not
redeclared here. **The shuffled control `R` is new and does not exist in code yet** — its
specification (`ORDER BY hash(id), id`, deterministic, never `random()`) is declared in this
document and is owed to the writer that phase 2 implements; nothing about it is measured by this
piece. This file declares only *what is run and how it is scored*.

---

## 0. Disclosure: this preregistration is informed by a pilot

**Stated first, for the same reason `FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` §0 states it
first: it is the thing most likely to make a reader distrust the rest.** Before this file was
written, a throwaway probe (`engine/examples/pilot_page_index.rs`, built, run, and then deleted —
not retained, not part of any harness) queried DuckDB's `parquet_metadata()` against two existing
fixtures from the `first-batch` cut: `parcels-145mb-duckdb-raster.parquet` (writer: DuckDB `COPY`)
and `parcels-145mb.parquet` (writer: arrow-rs `ArrowWriter`). It was not a measurement of the gate
below and none of its numbers appear in any verdict. Full findings, including the exact queries
run, are recorded in `CUT-STATE.md`.

**What the pilot established:**

1. **Neither `column_index_offset` nor `offset_index_offset` exists in this DuckDB's
   `parquet_metadata()` output schema, under either name, for either writer.** The 31-column schema
   is identical for both files and does not include either field by name. `index_page_offset` *is*
   present, but it is a different, older Parquet field (the legacy "index page" pointer that
   predates PARQUET-922's column/offset index structures) and is not evidence about the modern
   page index either way.
2. **This is a schema fact, not a silently-wrong-key failure.** Before drawing conclusion 1, the
   pilot positively verified the query mechanism against a field known present
   (`path_in_schema`, `stats_min_value`) for both files, per the phase-1b lesson recorded in this
   repository's `NIGHT-STATE.md`: a struct child's `path_in_schema` is reported as `"bbox, xmin"`
   — comma-space, not a dot — and a wrong key fails silently (every row NULL, reading as a clean
   "absent"). Both files returned non-null values and the expected comma-space spelling, so the
   "absent" finding above rests on `DESCRIBE`'s column list, not on a failed value query.
3. **Consequence for this cut, stated now rather than discovered mid-harness:** whether either
   file's *actual footer bytes* carry a modern parquet page index is **not established** by this
   pilot and is **out of scope for the rest of this cut** — reading the raw thrift footer directly
   would need a second parquet reader, which `NEXT-CUT.md`'s non-goals (§9 below) rule out for the
   whole cut. No cell in this preregistration's gate or predictions depends on page-index presence;
   this pilot exists only to close out `NEXT-CUT.md`'s phase 0b as a disclosed, findings-only
   question, and it is closed as `unmeasured — instrument (this DuckDB's parquet_metadata()) does
   not expose the field under either name`, for both the DuckDB-written and the arrow-rs-written
   file.

---

## 1. What this preregistration may and may not claim

- **Every comparison is within-session.** No number produced under this file is differenced
  against any earlier section of `kernel/RESULTS.md`. Different session, different build,
  different tree.
- **`H` is a different file with a different content hash than `C` or `R`, never a same-file
  claim** (the gate's own scope clause, §2 below).
- Nothing in §0 is evidence for or against the gate. It answers a different, disclosed,
  ungated question.
- Only the two quantities named in the gate (§2) are scored. Time to first batch is reported
  beside every cell and is never gated and never quotable against `docs/08`.

---

## 2. The gate — lifted verbatim from `NEXT-CUT.md`

> **Gate — import-time spatial layout.**
>
> **The claim.** *At a fixed dataset class, writer and row-group granularity, a Hilbert-ordered
> file's viewport query asks the file system for materially fewer bytes than the same rows in
> source order, and the reduction is not paid for by a whole-file regression.*
>
> **Scored on two quantities and no others:**
>
> 1. **Read volume — primary.** Query-scoped `GetProcessIoCounters` read-byte delta. `H` reads
>    **≤ 70%** of `C`'s bytes at the **near-quarter** viewport, at the 5 GB class, in **all 7
>    trials**. 70% is declared as the point where the decision changes — below a 30% reduction
>    the rewrite cost and product surface are not worth a default change — and it is deliberately
>    weaker than any A1 figure, which is not carried into this verdict.
>    **Determinism condition, not a statistic:** each cell must produce exactly **one distinct**
>    `read_bytes` across its 7 trials. More than one distinct value = **`unmeasured — read
>    counter non-deterministic`**, an instrument fault, never a spread.
> 2. **Total query time — secondary.** `H` beats `C` at the near quarter: **p50 lower and ≥ 42
>    of 49 pairwise** at n = 7 vs 7, same session, same phase. Payload-retention setting
>    identical on both arms of every pair, recorded in the artifact.
>
> **And all of:** no whole-file regression — `H` whole-file read ≤ **100.5%** of `C`'s · row
> count equals the generator-derived count **before the phase runs** · the **sorted per-feature
> digest set `{(id, sha256(coords))}` is identical across `C`, `H`, `R`** at every viewport,
> computed by a dedicated correctness phase, **never substituted by a fold** · rewrite cost
> reported separately, **never netted** against any query time.
>
> **Fail condition.** Any one unmet is a **fail**, and a fail is a complete result: layout stays
> out of the import path, no ADR is filed, and the cut's value is the bracket it establishes.
>
> **Explicitly not gated, not quotable:** time to first batch (reported beside every cell so a
> reader sees it did not move). docs/08 wording untouched.
>
> **Scope every number carries:** warm-OS-cache **logical** bytes · **Windows only** · one
> machine, one session, one writer (DuckDB `COPY`), one data shape · within-session comparisons
> only · **`H` is a different file with a different content hash**, never a same-file claim.

---

## 3. Dataset classes

`docs/08`: 145 MB = the Polygons matrix row (100k features / ~10M vertices). **The 5 GB fixture is
NOT a matrix row** — it serves the "cold open of a 5 GB GeoParquet" budget, and every number at
that class is stated as such, never as a `docs/08` matrix figure.

---

## 4. The factorial

```
order ∈ {raster C, Hilbert H, shuffled R}
      × viewport ∈ {whole, near quarter, far quarter, 1/64}
      × granularity ∈ {8192, 4096, 2048 rows/group}     — 145 MB only
```

**At 145 MB:** all three orders × all four viewports × all three granularities. F3 (this
repository's own finding, `first-batch` cut): DuckDB's parquet writer quantizes to 2,048-row
multiples, so 100k rows caps at 49 groups regardless of the requested size; `write_clustered_variant`
verifies the written layout and **refuses** on a mismatch rather than letting a wrongly-grouped
variant reach a results table — a refusal stops the phase, it is not worked around.

**At 5 GB:** three orders (`C5`, `H5`, `R5`) at shipped granularity only — no granularity sweep at
this class.

**All files come from the same writer** (DuckDB `COPY`) — finding 6 of the `first-batch` cut
(`kernel/RESULTS.md`: "The parquet writer moved first-batch time more than the layout did", ~40%
at whole-file, larger than the layout effect it would have been mistaken for). `G5` — the
arrow-rs-written 5 GB source fixture, `parcels-5gb.parquet` — is **never a comparison arm**; it is
only ever the read-only source `H5`/`C5`/`R5` are rewritten from.

The gate viewport is the **near quarter**, at the **5 GB class**, at shipped granularity (§2).
The 145 MB factorial and the 5 GB whole/far-quarter/1/64 cells are reported but do not gate.

---

## 5. Registered predictions — lifted verbatim from `NEXT-CUT.md`, committed before the harness

1. `R` reads ≥ 95% at every viewport at both classes — no zone-map pruning survives a shuffle.
2. `H`-from-`R` and `H`-from-`C` have identical row order (`(hilbert_key, id)` is a total order
   independent of input) — asserted at 145 MB by digest and file comparison; licenses the single
   5 GB Hilbert rewrite.
3. At 145 MB the quarter-viewport crossover does not reverse between 13 and 49 groups (blob ≈
   E/7 vs viewport E/2 — the boundary term still dominates).
4. n = 7 admitted, a floor not a target.

Being wrong about any of them is a result, not an embarrassment.

---

## 6. Instruments

| quantity | instrument | notes |
|---|---|---|
| **read volume — primary** | `GetProcessIoCounters` read-byte delta, taken immediately before and after the query, one query per process | see limits below; this is the gate's scored instrument, §2 |
| total query time — secondary | outer wall clock | never derived from a trace |
| time to first batch | producer wall clock, `stream()` call → first `next_into` return | reported beside every cell, **never gated, never quotable against docs/08** (§2) |
| rows, payload bytes | `BatchInfo` | identical across files/viewports or the cell is inadmissible |
| row order, per file | sorted per-feature digest set `{(id, sha256(coords))}` | correctness phase only, never a fold, never substituted (§2) |
| written layout | verified against the request; `write_clustered_variant`'s own refusal (F3) | a refusal stops the phase |

**The read-volume instrument, inherited unchanged from `FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`
§4** (the architect's originally-declared `EXPLAIN ANALYZE` instrument was withdrawn there after
that pass's own pilot showed `TABLE_SCAN` reports post-filter *output* rows, identical with and
without pruning — not a measure of bytes read). Its limits, declared now:

- **Windows-only.** A bare `extern "system"` declaration against kernel32, zero new dependencies.
  On any other platform the cell is `unmeasured — instrument unavailable`, and nothing about macOS
  or Linux follows from this pass — the same limit `docs/07` places on ADR-003.
- It counts **logical** read bytes issued by the process, warm OS file cache included. It is
  evidence about *what the query asked the file system for*, and it is **not** evidence about
  physical disk traffic.
- It is a whole-process counter — one query per process is what makes it attributable.

**Determinism condition, not a statistic (restated from §2 for visibility as an instrument
declaration, not only a gate clause).** Each scored cell's 7 trials must produce exactly **one**
distinct `read_bytes` value. Any more than one distinct value in a cell is **not** treated as a
spread, a mean, or a median-worthy sample — it is recorded as `unmeasured — read counter
non-deterministic`, an instrument fault, and that cell does not enter the gate's verdict.

---

## 7. Declared watchdog ceilings, before measuring

| watchdog | ceiling |
|---|---|
| rewrite, 145 MB | 900 s |
| rewrite, 5 GB | 1,800 s |
| one 145 MB trial | 120 s |
| one 5 GB trial | 900 s |
| digest phase, per file | 1,800 s |
| stream-silence, any streaming phase | 120 s |

**Invalidators, inherited from this repository's standing practice** (§8 below): a fired watchdog
records the row `unmeasured — watchdog at N s` and the phase is **not** re-run within this cut · a
trial whose declared conditions (writer, granularity, payload-retention setting) differ from the
cell's declaration is an observation, not a sample, and is not promoted into the cell's statistics
· a fixture hash mismatch invalidates the cell · a `write_clustered_variant` layout refusal (F3)
stops the phase it occurs in.

---

## 8. Standing measurement rules (restated from `NEXT-CUT.md`, binding)

Mechanism self-check before the opening settle (a harness that cannot measure fails in seconds,
never produces a complete-looking artifact of `unmeasured` rows) · one process per trial,
interleaving by a committed pure function · fixtures hashed before the trial loop **and**
re-hashed after the last trial · 120 s opening settle, 60 s pre-canary, canary spread ≤ 10% per
phase · free-disk check at every phase boundary, deletion policy declared in advance · registered
element not run ⇒ `unmeasured` with reason · attempt invalidated ⇒ recorded and re-run; a phase is
never re-run after its result is seen · trace policy: untraced carries every verdict.

---

## 9. Non-goals, explicit — lifted from `NEXT-CUT.md`

Geometry LOD columns (separate architect-first item) · hive/sidecar partitioning, any persisted
derived cache · **a second parquet reader** (binds §0's finding 3 above: page-index presence stays
unmeasured rather than reached for by adding one) · reviving lever A or B2 (the `first-batch` cut's
retired candidates) · any SKP/MCP/CLI exposure of the rewrite · any first-pixels/`docs/08`-budget
claim · macOS/Linux · physical disk traffic · in-place modification of any user file · headed/GUI
cells (away-mode: queued for the human).

---

## 10. ADR touches — lifted from `NEXT-CUT.md`

Nothing accepted is amended. Cited: ADR-005 (rewritten file = new resource, own hash/grade,
recorded recipe) · ADR-006 (**ruling:** copy-producing rewrite = pure transformation, replayable,
owes no undo; in-place replacement would be an external side effect — the harness only ever
writes under `target/slice-evidence/` and **refuses** to regenerate or overwrite
`parcels-5gb.parquet`) · ADR-007 · ADR-016 (physical order never promised — finding 5, `first-batch`
cut) · ADR-017 §12 (publish determinism asserted across layouts at 145 MB).

**If — and only if — the gate passes:** ADR-021 (import-time layout policy) is filed from the
draft the architect holds; number allocated at filing; ADR-014 stays reserved. **This cut's worker
pieces never file ADRs, never edit `docs/`.**

**Owed, worker-assignable, not this piece's scope:** `engine/README.md`'s unqualified "Until an
index prunes actual IO, `ScanOnly` is the preferred product plan" sentence — to be bound per
`kernel/RESULTS.md`'s "Obligations" once this gate's result exists.

---

## 11. Outcome this preregistration is pre-authorized to reach

**"The gate fails" is a legitimate and complete result.** §2's fail condition already says so:
layout stays out of the import path, no ADR is filed, and the cut's value is the bracket
established — including, at minimum, whatever `R` turns out to cost an unordered ETL-shaped
source (prediction 1) and where the 145 MB quarter-viewport crossover sits across granularities
(prediction 3), independent of whether `H` beats `C` at 5 GB.

---

## 12. Amendments

*(none)*
