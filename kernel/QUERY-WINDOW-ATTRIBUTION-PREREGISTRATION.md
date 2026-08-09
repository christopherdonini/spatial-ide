# Preregistration — attributing the query window: `lease_acquired` → `first_source_row`

**Committed before the harness exists and before any measured number exists.** Same discipline as
`kernel/SCALE-PASS-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, and
`kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`. Every cell, ceiling, sample count, scoring rule
and decision rule below is fixed by this commit; an amendment made after a result has been seen must
say so in its first line and invalidates the work it touches.

**Semantics are not defined here.** The event vocabulary (`SQL_BUILT`, `PRODUCER_STARTED`,
`EXECUTE_CALLED`, and the four existing events they compose with) and the derived-span table are
frozen in `engine/src/trace.rs`'s doc comments and `SPANS` constant, committed first and reviewed
before this file. This file declares only *what is run and how it is scored*.

---

## 0. Disclosure — this preregistration is informed by an architect ruling, not a pilot run

**Stated first, per this repository's own rule for pilot disclosure**, because the same reasoning
applies to any input that shaped what is registered below before results existed. `NEXT-CUT.md`
Phase 1 asked the architect to freeze the event vocabulary; the ruling that came back corrected three
premises in the brief and is the reason this preregistration's window, decision rule and registered
prediction are not the brief's literal text. In full:

1. **The window is wider than the brief's own example implied.** The brief called it "lease acquired
   → first source row" but named the pre-existing `query` span (`sql_prepared → first_source_row`) as
   its 21.3–74.6 ms evidence. Those are different spans — `query` excludes the gap between
   `lease_acquired` and `sql_prepared` entirely. The window this pass attributes is the wider one,
   `lease_to_first_row` (`lease_acquired → first_source_row`), so that segment is not structurally
   excluded from ever being found dominant. `query` is still reported, for continuity with the night
   pass's figures.
2. **One of the brief's four named events cannot be built.** `statement_ready` ("prepared/bound, if
   the API distinguishes") does not exist as a separate instant from `sql_prepared`: the vendored
   `duckdb` crate's `Statement::stream_arrow` binds parameters and executes in one call, with no
   public API on this path that observes an intermediate "bound but not executing" state. Patching the
   vendored crate to observe it is ruled out — a measurement against a locally patched dependency
   describes a binary nobody ships. `statement_ready` is dropped from the vocabulary.
3. **A prior finding this pass's prediction leans on has already had its causal claim withdrawn.**
   `kernel/RESULTS.md`'s sixth section reported, at n = 1, `sql_prepared → execute_returned` = 55.109
   ms (96.3% of that sample) and called it "the sort". The cell that produced it
   (`kernel/tests/cancel_rescore.rs`'s consistency demonstration) runs `ViewportQuery::all()` —
   `RowOrdering::Unordered`, no `ORDER BY` — so there is no sort in that query. The 55.109/2.127 ms
   split stands as a number; "the sort is inside `stream_arrow`" is withdrawn (see `kernel/RESULTS.md`
   §8 and `kernel/CANCELLATION-AND-TRACING.md` §8 for the corrections). What that n = 1 sample
   actually shows — cost concentrated in the bind-and-execute call rather than in fetching — still
   informs §6's registered prediction below, just without the sort label.

None of the three numbers above are treated as measurements of this pass's cells. They are disclosed
because they shaped the window definition (§3), the dropped event (§2), and the direction of the
registered prediction (§6).

---

## 1. What this pass may and may not claim

- **Every comparison is within-session.** No number here is differenced against the night pass's
  21.3–74.6 ms `query` figure, against the n = 1 consistency-demonstration split, or against any other
  earlier section of `kernel/RESULTS.md`. Different session, different build, different tree.
- **This pass measures attribution, not a lever's effect.** No Phase-2 lever is built or measured
  here. A finding that a segment dominates is not evidence the segment can be shortened, only that it
  is the one worth investigating.
- **A composite span is not a fifth sample.** `query` and `lease_to_first_row` are sums of the leaf
  segments reported alongside them (`engine/src/trace.rs`'s `SPAN_LEASE_TO_FIRST_ROW` doc comment).
  They are never added to the leaf segments when computing a total.
- **`dropped_records` travels with every trace-derived figure**, even though every segment here closes
  early (query-window segments, per `trace.rs`'s own rule) and so remains derivable even from a trace
  that dropped records elsewhere. Zero is asserted, not assumed.
- **No throughput claim.** Bytes and durations, where both are recorded, are never divided.

---

## 2. The fixture — reused, re-verified, not regenerated

This pass reuses `target/slice-evidence/first-batch/parcels-145mb.parquet` (`FileId::S` in
`kernel/tests/first_batch_factorial.rs`: 100,000 features, avg 100 vertices, raster order, written by
arrow-rs, `row_group_rows = 8_192` → 13 row groups) rather than writing a new fixture. Reusing it
means this pass's viewports select the exact row counts already registered and independently checked
in that file's `the_predicted_row_counts_match_the_numbers_registered_before_this_harness` test:
whole = 100,000, near quarter = 25,281, 1/64 = 1,600.

**Before any trial runs**, the harness asserts:

- the file exists at that path (a missing file is `unmeasured — fixture absent`, never regenerated
  silently — regenerating here would produce a file with the same spec but no guarantee of the same
  bytes, and this pass's whole point is a same-file, same-session comparison);
- its SHA-256 (`spatial_engine::index::content_hash`) is recorded in the artifact;
- `Dataset::open` succeeds and the file's row count matches 100,000.

No writer control, no layout variant. This pass has one file, one plan, one batch policy — the
factorial that varied those was the previous cut's; this one varies only the viewport and holds
everything else fixed, because attribution inside the query window does not depend on which candidate
layout or pruning plan is in force upstream of it.

---

## 3. The cells

```
{viewport: whole, near-quarter, 1/64} × plan: ScanOnly × batch: size-only × traced: always
```

Three cells, all traced — this pass has no untraced arm, because its only output is the segment
decomposition, and an untraced trial would contribute nothing this pass reports. (Contrast
`kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, where untraced trials carried the gate verdict
and traced trials only decomposed it — there is no gate verdict here.)

**Far quarter is declared out of scope**, per the architect's ruling (D7): it exists in the previous
factorial to give lever B2 (row-group pruning) a viewport whose rows are at the tail of the scan. That
distinction is irrelevant to this pass, which does not vary the plan and is not measuring pruning.

`n = 7` admitted trials per viewport — a floor, not a target. A cell that cannot reach 7 within the
declared per-trial ceiling (§7) is reported with whatever `n` it reached and flagged, never padded.

**One process per trial**, for the same reason `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`
gives: `trace::start` refuses a second concurrent trace in one process, and running all cells of this
pass in one process would make trial order load-bearing for an instrument this pass exists to trust.
The driver re-executes the same test binary with the cell in an environment variable; the child prints
its result to a file, never to stdout (`kernel/RESULTS.md`'s attempt-1 lesson: a console sentinel that
is not first on its own line is invisible to a parser and invisible to a human skimming the same
console).

Trial order is interleaved across the three cells using the same round-robin function
(`interleaved`) `kernel/tests/first_batch_factorial.rs` already uses, so no cell's trials all run
consecutively.

---

## 4. What every trial's traced record must carry

Per trial, from the frozen vocabulary in `engine/src/trace.rs`:

- **Leaf segments** (p50/p95 computed across the cell's trials in §5): `producer_handoff`,
  `statement_prepare`, `param_assembly`, `bind_and_execute`, `first_fetch`.
- **Composite segments**, reported beside the leaves, never summed with them: `query`
  (`param_assembly + bind_and_execute + first_fetch`), `lease_to_first_row` (`producer_handoff +
  statement_prepare + query`).
- **Reported, never scored** (§8): `lease_bind` (`sql_built → lease_acquired`), and the wall-clock
  time-to-first-batch the untraced cells of the previous factorial already established this figure's
  relationship to.
- `dropped_records`, per trial.
- **The additivity self-check, per trial, in raw `offset_nanos` — not in the `segment_ms` f64
  output.** `producer_handoff + statement_prepare + param_assembly + bind_and_execute + first_fetch`
  must equal `lease_to_first_row`'s own nanosecond delta exactly, and `param_assembly +
  bind_and_execute + first_fetch` must equal `query`'s. A trial whose additivity check fails is an
  **instrument defect that stops the harness**, not a data point — the same class of failure the
  `spans_table_has_unique_names_and_unique_event_pairs` and
  `the_query_windows_events_telescope_exactly` unit tests in `engine/src/trace.rs` exist to catch
  before any trial runs at all (§7's mechanism self-check re-derives this on a live trial, not just in
  the unit tests).
- `reused_an_existing_connection` (`ConnectionFacts`), `filter_plan`, row count, `dropped_records` —
  the same per-trial identity fields `first_batch_factorial.rs` already records, reused rather than
  reinvented.

---

## 5. Dominance, scored exactly as the architect's ruling requires

**Per-trial share, not a ratio of aggregates.** For each trial, each leaf segment's share of
`lease_to_first_row` is computed as `segment_nanos / lease_to_first_row_nanos`. The cell's reported
dominance figure is the **p50 of the per-trial shares** — not `p50(segment) / p50(window)`, which is a
different number and is reported separately, alongside, so the two are never conflated (the
architect's ruling is explicit that this must be declared before any trial runs, not decided after
seeing which one looks better).

p95 is reported for every leaf and composite segment, for the same reason `docs/08` always reports
both: a p50 comparison alone cannot distinguish "consistently large" from "usually small, occasionally
huge".

---

## 6. The decision rule, registered before any trial runs

Scored on `lease_to_first_row` at the **near-quarter viewport** — the gate viewport carried over from
`kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, kept as the reference viewport across cuts rather
than substituted for "quarter" or any other unregistered term.

| dominant segment (≥ 40% of `lease_to_first_row`, p50-of-shares) | consequence |
|---|---|
| `statement_prepare` | **Phase 2 proceeds** — the prepared-statement-reuse lever, subject to the architect's D10–D13 corrections to the brief's cache-identity design, and subject to a declared warm-connection protocol for Phase 3 (D13) without which the lever is unmeasurable by the established one-process-per-trial harness discipline. |
| `bind_and_execute` | **Not** the prepared-statement lever — that lever cannot reach this segment (it binds and executes on every call regardless of whether the statement object was freshly prepared). Recorded as a finding; the architect proposes a lever for this segment as its own preregistered phase, not improvised here. |
| `first_fetch` | As above — recorded, an architect-proposed lever for a separate phase. |
| `producer_handoff` | As above — a thread-handoff lever is a different design with its own gate. |
| `lease_bind` | **Cannot win this table** — it is reported but never scored (§8), by the docs/07 scope bound the architect's ruling states. If it turns out to dominate wall time-to-first-batch, that is a finding for a separate, undesignated phase, not license to score it here. |
| nothing reaches 40% | **"Attribution complete, no single lever justified."** Phase 2 is skipped. A legitimate end state, not a failure — stated in `NEXT-CUT.md` itself. |

**Registered prediction, recorded before any trial runs, from the architect's ruling (§0):**
`statement_prepare` will be **under 5%** of `lease_to_first_row` at every viewport, and
`bind_and_execute` will dominate. Mechanism: `stream.rs` builds `FROM read_parquet(?)` with the path
as a bound parameter, so at `conn.prepare()` time DuckDB does not know which file it will read and
cannot open it, read its footer, resolve the projected columns, or plan the scan — all of that work
must defer to the call that does know the file, which is `stream_arrow`. If this prediction holds,
the honest outcome of this cut is attribution plus a named finding, and the briefed Phase 2 is not
warranted — that is a legitimate, pre-authorized result and is not treated as this pass having failed
to find something.

**This prediction does not decide the outcome.** The table above is applied to whatever the trials
actually show; the prediction exists so a reader can see whether the result confirmed or surprised
before the trials ran, not to pre-select the answer.

---

## 7. Ceilings, settle, canary — reused, not re-derived

Same values `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` §7 declared, for the same 145 MB
class this pass shares with it:

- `CEIL_TRIAL` = 120 s per trial.
- `SETTLE_OPENING` = 120 s before the first canary; `SETTLE_CANARY` = 60 s before each subsequent one.
- Canary: `kernel/tests/support`'s `Canary`/`CANARY_ITERS_LONG`/`CANARY_MAX_SPREAD` (10% declared
  ceiling), taken at setup-end, before each repetition, and at pass-end.
- **Mechanism self-check before the settle**, on a probe cell (near-quarter, traced), asserting the
  child round-trips a parseable result **and** that its additivity check (§4) passes on a live trial —
  not just in the unit tests committed alongside the event implementation. A harness that cannot
  measure costs seconds, not a night; a harness whose additivity is wrong on a live trial and is only
  caught after 21+ trials have run is the same class of defect this self-check exists to catch before
  it is expensive.
- `refuse_debug` and `require_disk` gates run first, same as every prior pass in this family.

This pass is much smaller than the factorial it follows — 3 cells × n ≥ 7 = 21 trials minimum, all at
the 145 MB class, no fixture generation (§2) — so it is expected to complete in minutes, not overnight.
It is still run under the same discipline because the discipline is what makes the numbers trustworthy,
not because this pass is expensive.

---

## 8. Scope bound (docs/07), restated from the architect's ruling

`lease_bind` (`sql_built → lease_acquired`) is measured and reported because it is a class-(b) section
(`kernel/CANCELLATION-AND-TRACING.md` §3) nothing had ever measured before this cut. It **may not name
a Phase-2 lever in this cut** regardless of its size — that would be improvising past this cut's
declared scope (engine/kernel query-window attribution only). If it dominates wall time-to-first-batch,
that is a recorded finding for its own future preregistered phase.

---

## 9. Workflow

Preregistration (this document, committed) → harness implementation → reviewer over the harness code
→ tester executes the trials and owns every number → decision rule (§6) applied mechanically to the
result → `kernel/RESULTS.md` eighth section, dated, citing the night pass's 21.3–74.6 ms and the n = 1
consistency-demonstration split as another-session context only, never differenced → reviewer over the
write-up.
