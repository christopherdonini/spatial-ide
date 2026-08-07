# Preregistration — the cancellation re-score, and the tracing cells

**Committed before the instruments run and before any number exists.** Same discipline as
`kernel/SCALE-PASS-PREREGISTRATION.md`, applied to a new pass on a changed tree. Every trigger,
ceiling, sample count, verdict rule and invalidator below is fixed by this commit; an amendment made
after a result has been seen must say so in its first line and invalidates the work it touches.

Semantics are **not** defined here — they are frozen in `kernel/CANCELLATION-AND-TRACING.md` §2 and
§3, which was committed first, deliberately, so that this file cannot quietly redefine a boundary
while declaring a measurement of it. This file declares only *what is run and how it is scored*.

---

## 1. Why this is a new preregistration and not an amendment

The scale pass's preregistration governs a pass over a specific tree. **This pass runs on a tree that
has changed** — the whole point of it is that publish cancellation now polls where it did not.

The consequence is the one the repo's own rule already implies and it is stated up front so no
reader has to derive it:

> **No number produced by this pass may be differenced against a number in `RESULTS.md`'s fifth
> section.** Different session, different build, different tree. The within-session rule forbids it
> and this pass does not do it.

What this pass *may* do, and what it is for, is **take a verdict against the same `docs/08` budget,
independently**. The fifth section scored a miss; this pass scores whatever it scores. Both verdicts
stand on their own evidence and neither is evidence about the other. "It got faster" is not a claim
available to this pass and will not appear in the sixth section.

There is one further asymmetry, from `CANCELLATION-AND-TRACING.md` §1 and §2, and it matters more
than the session rule:

> The fifth section's **3,920.251 ms** and **418.321 ms** are `cancel_acknowledged`-class figures —
> they measure `cancel()` → `boundary::execute` returns. This pass's budget-bearing figures are
> `cancel_requested → cancel_observed`. **These are different intervals.** The old numbers are not a
> baseline for the new ones in any direction. This pass therefore reports *both* intervals for every
> cell, so that a reader who wants the old-style number has it, measured on this tree, rather than
> inferred.

---

## 2. The fixture, and what is verified before anything runs

The **same two files** the scale pass used, unmodified and not regenerated:

| | path | bytes | recorded SHA-256 |
|---|---|---|---|
| 5 GB | `target/slice-evidence/scale-pass/parcels-5gb.parquet` | 5,004,376,705 | `sha256:5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788` |
| 145 MB control | `target/slice-evidence/scale-pass/parcels-control-145mb.parquet` | 151,987,739 | recorded in `scale-pass.json` |

**The harness re-hashes the 5 GB file and refuses to run on a mismatch.** It also **refuses to
generate a fixture**: a pass that could silently create its own input could measure a different file
from the one it names, which is the failure the scale pass's own §5 guarded against.

Reusing the file is deliberate and is not a between-session comparison — the *file* is an input, not
a measurement. What may not cross sessions is a number, and no number does.

---

## 3. The cells

Every cell reports **two intervals**, always together, never one alone:

- **`observed`** — `cancel_requested` → `cancel_observed`. **This is what carries the `docs/08`
  verdict** (`< 100 ms`, any operation).
- **`acknowledged`** — `cancel_requested` → `boundary::execute` returns. **Reported with no budget
  attached**, because it contains staging removal over up to 100,000 files and the audit record's
  own fsync, which are class-(b) unbounded sections per the design note's taxonomy.

Both come from one run of one trial. Quoting `observed` without `acknowledged` beside it is
forbidden by this preregistration, for the same reason the fifth section had to report cadence
beside cancellation: one is a bound the code controls, the other is what the operator actually waits
for, and either alone misleads.

### C1 — cancel inside the sort · n = 7 · 5 GB

**Trigger, declared now:** on `PublishPhase::QueryRunning`, wait `DELAY_INSIDE_SORT = 250 ms`, then
`cancel()`. `QueryRunning` is emitted only when a batch has been demanded and a full poll interval
passed with none delivered, so the trigger is **inside the sort by construction**, not by wall-clock
luck. This is the cell A6 could only hit 1 time in 7.

**On-target guard, kept from A6:** a trial counts only if `partitions_at_fire == 0`. If a future
faster sort lets the 250 ms overshoot, the trial is **discarded as an observation, not re-tuned** —
re-tuning a declared trigger after seeing where it landed is the exact failure this file exists to
prevent.

**Predicted before running:** `observed` ≤ 25.625 ms (the derived bound); `acknowledged` dominated by
DuckDB's interrupt handling and connection teardown, **unbounded and possibly seconds**. A large
`acknowledged` here is an expected result, not a failure.

### C2 — cancel inside a partition write · n = 7 · 5 GB

**Trigger:** on the first `partition_write_progress` callback of partition index ≥ 100 where
`bytes_written < bytes_total` — strictly inside the file, with bytes still to go. Index ≥ 100 so the
writeback cache is loaded rather than cold.

**This is the cell that tests intra-partition polling**, and it exists because
`CANCELLATION-AND-TRACING.md` §1 established that A6's `WritingPartitions` cell **does not**: A6's
trigger fired inline from `partition_written`, with `payload.clear()` and a cancel check as the very
next statements, so its observation latency was ≈ 0 and its 418 ms was teardown. **Re-scoring A6's
cell may not be presented as evidence that chunked writing works.** C2 is that evidence or nothing is.

**Predicted:** `observed` bounded in bytes exactly (256 KiB) but **not in time** — it contains one
`write_all` of ≤ 256 KiB, which is a class-(b) syscall. p50 small; **the maximum may exceed 100 ms
and that is an admissible result.**

### C3 — cancel immediately before the fsync · n = 7 · 5 GB

**Trigger:** on the `partition_write_progress` callback where `bytes_written == bytes_total`, which
the trait contract guarantees fires exactly once per partition immediately before `sync_all`.
Partition index ≥ 100, as C2.

**This cell is designed to produce the worst case honestly.** Acknowledgement must traverse a full
`sync_all` — the one term on this path with no declared ceiling and no derivable one. It is declared
in advance precisely because a pass that measured only C1 and C2 could report two comfortable numbers
and leave the expensive path unmeasured.

**Predicted:** `observed` ≈ the duration of one `sync_all`, **unbounded**. This is the cell most
likely to miss the budget, and if it does, that is the finding.

### C4 — the A6 cell, re-run for continuity · n = 7 · 5 GB

**Trigger:** identical to A6's — inline from `partition_written`, after 100 partitions.

Run **only** so the sixth section can state, on this tree, what that trigger measures. Per the design
note it is a teardown measurement. **It carries no verdict about intra-partition cancellation** and
the write-up must say so where the number appears.

### C5 — tracing overhead · 145 MB · n = 6 per arm

Whole-file stream of the 145 MB control, tracing **off** and tracing **on**, as **alternating ABBA
pairs after a discarded warm-up**, so DuckDB's first-instance cost lands in neither arm — the same
shape as the scale pass's identity-scan A/B, and for the same reason.

**Both order estimates are reported and deliberately not averaged**, as A2 item 2 required of the
earlier A/B.

**Reported as:** total wall time per arm (p50, p95) and the delta. If enabling tracing shifts p50 by
more than the canary's own spread, **that number is printed next to every trace-derived figure in the
sixth section** — which is the brief's condition for using traces at all.

**Predicted:** below noise. A disabled `mark` is one relaxed load and a not-taken branch; an enabled
one is a lock and a push, ≤ 8 per batch and none per row. If the measurement disagrees, the
measurement wins and the design note's overhead argument is wrong and gets written up as such.

### C6 — the consistency demonstration · 145 MB

Trace-derived segments against the instruments that already measure the same thing, **on the same
run**:

| trace-derived | existing instrument | agreement required |
|---|---|---|
| count of `batch_full` | `StreamStats::batches_generated` | **exact** |
| sum of `batch_full.rows` | `StreamStats::rows_generated` | **exact** |
| `lease_acquired → first_batch_full` | the harness's own wall clock over the same code | traced segment **contained by** the wall interval |

Exact where both count the same events; containment where one interval strictly encloses the other.
**Asserting equality on the timing pair would be asserting that the code between the two clocks costs
nothing**, which is false, and a test that demands it is a flake generator rather than a check.

**Disagreement is a finding about one of the two instruments and is written up, not reconciled.** It
blocks neither this cut nor the truth.

**Validity condition, declared because it is easy to miss:** the exact comparisons hold only on a
trace that dropped no records. `TRACE_BUFFER_RECORDS` is a hard ceiling and `batch_full` fires per
batch, so a large enough run reaches it by design. The harness asserts `dropped == 0` **before**
making any exact claim, and the sixth section prints the drop count beside every trace-derived
figure regardless.

---

## 4. Declared ceilings and watchdogs (ADR-010 rule 6)

| | value | what it does |
|---|---|---|
| `DELAY_INSIDE_SORT` | 250 ms | C1's trigger delay. Declared before measuring; not re-tuned after. |
| C2/C3 partition floor | index ≥ 100 | so the writeback cache is loaded, not cold |
| per-trial watchdog | 900,000 ms | a stuck trial is killed and **excluded**, never reported as a sample |
| publish watchdog | 900,000 ms | as above, for the cadence publish |

A trial whose watchdog fires is **excluded from the sample and counted in the artifact**. The fifth
section's harness discarded a watchdog result silently in its first revision and review caught it;
this file declares the behaviour so review does not have to catch it twice.

---

## 5. Canary, and what it gates

Same instrument and same bound as the scale pass: a 400M-iteration canary at **each phase boundary**,
`spread > 10 %` invalidates **that phase**.

Per A5's rule, carried forward verbatim in intent: **the canary gates a phase whose output is a
timing number used against a budget or in a comparison.** It does not gate a correctness claim.
So C1–C4's latency figures and C5's overhead figures are gated; C6's exact counts are not, because
no clock decides them.

---

## 6. Declared invalidators

1. **Fixture hash mismatch** on either file — the pass refuses to start.
2. **Canary spread > 10 %** in a phase — that phase's timing numbers are invalid; correctness claims
   from it survive, per A5.
3. **A cell with fewer than 7 usable samples** — reported with its actual `n` and the reason, and
   **may not be quoted as a distribution**. A single sample establishes an order of magnitude and the
   write-up must say so, exactly as the fifth section had to for its n = 1 sort window.
4. **Any trial where the cancel fired off-target** (C1's `partitions_at_fire != 0`; C2's
   `written == total`; C3's `written != total`) — an **observation**, not a sample. Reported
   separately with its latency, never pooled.
5. **A debug build** — the harness refuses; a measurement on an unoptimised binary is not a
   measurement.
6. **Tree or binary pin mismatch** at run time — recorded with its cause named, per the scale pass's
   §7. Not a silent repair.

---

## 7. Out of scope, declared now

- **The 5 GB cold-open row.** Not re-measured; needs an operator and three reboots, and nothing in
  this cut touches open.
- **Streaming throughput, viewport rows, publish determinism.** Unchanged by this cut and not
  re-measured. The fifth section's numbers stand as that tree's numbers.
- **`temp_directory` / `memory_limit`.** Still unreachable — `Lease::connection()` is `pub(crate)`
  by design. A ~7 GB sort can still spill somewhere unrecorded, and that stays an open ADR-010 rule 6
  gap rather than being quietly closed here.
- **Any macOS or Linux claim.** Windows reference profile only.
- **The data-plane half of the span model.** `protocol/data-plane` does not depend on the engine and
  giving it that dependency would create exactly the coupling `engine/tests/slice.rs` forbids.
  Producer-side only, declared as a limit.

---

## 8. The outcome this pass is pre-authorized to reach

**A second miss is an admissible result and is not a failure of the cut.**

`CANCELLATION-AND-TRACING.md` §3 establishes that `cancel_observed → cancel_acknowledged` cannot be
bounded, and that the in-write path contains a class-(b) syscall. If the measurement says
*"achieved typically (p50/p95), not guaranteeable at maximum across a blocking filesystem"*, that is
written up as a finding about the budget's wording and about where the remaining cost lives — not
engineered around, and not reframed into a pass.

**What would make this pass dishonest**, stated so it can be checked against the write-up:

- quoting `observed` without `acknowledged`;
- comparing any number here against the fifth section's;
- presenting C4's re-run as evidence about intra-partition cancellation;
- re-tuning a declared trigger after seeing where it landed;
- reporting a cell's p50 while omitting that its n is below 7.

---

## 9. Amendments

### A1 — 2026-08-07 — attempt 3 invalidated by its own canary; a per-phase settle is added

**This amendment was written after a result was seen.** Attempt 3 produced 28 on-target trials and a
full set of timing numbers, and I looked at them before writing this. That is disclosed in the first
line because the discipline this pass inherits requires it, and because a reader must be able to ask
whether the amendment was shaped by what the numbers said.

**What fired.** §6 invalidator 2, in five of six phases:

| phase | canary spread | declared bound |
|---|---|---|
| after-c1-inside-sort | 10.15 % | 10 % |
| after-c2-mid-write | 15.70 % | 10 % |
| after-c3-pre-sync | 20.67 % | 10 % |
| after-c4-a6-continuity | 23.28 % | 10 % |
| after-overhead | 11.98 % | 10 % |
| after-consistency | 1.75 % | 10 % — **within** |

**The cause is not in dispute and is visible in the readings themselves.** The 400 M canary's long
minimum climbed 105.7 → 116.5 → 134.7 → **162.6** ms and then *fell back* to 131.9 → 117.8 → 119.8 as
the load lightened. That is thermal drift under sustained work — 28 cancelled publishes, each reading
5 GB, over about 25 minutes — not a step change and not a competing process. The machine stopped
being itself, which is precisely what the instrument is for.

**What is invalidated:** every timing number from C1–C5. **What survives**, per A5's rule carried
forward from the scale pass — the canary gates a phase whose output is a timing number used against a
budget or in a comparison, not a correctness claim:

- 28 of 28 trials fired on target and ended as `Cancelled`;
- 28 of 28 left nothing on disk — no destination, no staging directory;
- C6's exact counts, whose phase was within bound anyway, and which no clock decides.

**The fix, declared now and applied before the re-run:** a **60-second settle immediately before
every canary reading**, so each reading is taken from a machine that has been given a chance to
return toward baseline rather than one still hot from the phase it just ran. §5's existing 120 s
settle before the *first* canary is unchanged; this extends the same idea to the rest, which attempt
3 shows was needed and the original §5 did not anticipate.

**What this amendment does not do, stated so it can be checked.** It changes no trigger, no ceiling,
no sample count, no verdict rule and no cell definition. It changes only how long the machine rests
before it is asked whether it is still itself. **No number from attempt 3 is carried forward** — the
re-run's numbers stand alone, and attempt 3's artifact is retained as
`attempt-3-invalidated-by-canary.json` so this claim can be checked rather than believed.

**One thing a re-run cannot fix, and it is not a canary problem.** C2, C3 and C4 fire their triggers
*inline*, from a callback the publishing thread itself invokes — so the very next statement that
thread runs is a cancellation check, and `cancel_requested → cancel_observed` is ~0 **by
construction**. Attempt 3 measured 0.001–0.002 ms in all three, which is that artifact and not a
property of the code being fast. This is the **same defect `CANCELLATION-AND-TRACING.md` §1 identified
in A6's cell**, and §3 of this file asserted that C2 escaped it. **That assertion was wrong.** It is
recorded here rather than quietly dropped, and the consequence binds the write-up:

> **Only C1 carries a real acknowledgement-latency measurement**, because only C1 cancels from
> another thread while the publishing thread is parked. C2/C3/C4's `observed` figures may not be
> quoted as latencies, and their `MET` verdicts against the 100 ms budget are **vacuous** — a
> comparison of an artifact against a budget. What C2 and C3 do establish is unchanged and real: a
> cancel raised inside a partition write ends the operation and leaves nothing.

Fixing that would mean re-declaring C2's and C3's triggers after seeing where they landed, which §8
forbids. They are re-run as declared, and the limitation is reported.
