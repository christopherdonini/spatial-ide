# ADR-018 — What "cancellation acknowledged" means, and what an operation owes after it

**Status:** **Proposed** — 2026-08-07. Not accepted, not binding, and **not citable to block a
review** until it is. Drafted by the cut that closes `kernel/RESULTS.md`'s fifth-section publish
cancellation miss; the human rules on acceptance.

**Related:** `docs/01` principle 7 (never block the canvas) and principle 8 (no numbers, no claim) ·
`docs/08` (the cancellation budget) · ADR-004 amendment 2 · ADR-006 (class-3 side effects) ·
ADR-010 rules 6 and 7 · ADR-017 §15 and its Corrigendum 4 · ADR-016.

---

## Context

`docs/08` requires **"cancellation acknowledged < 100 ms, any operation"** and **defines
*acknowledged* nowhere.** Every cancellable operation this project has built has therefore had to
pick a meaning, and they have not picked the same one.

`kernel/RESULTS.md`'s fifth section measured `cancel()` → `boundary::execute` returns, a window that
also contains staging removal over ~100 files and the audit record's own `fsync`, and scored the
budget on it. That was legitimate — a *pass* on a wider window is a pass a fortiori — but it produced
a **miss** (3,920 ms in the sort; 418.321 ms p95 while writing partitions), and a miss on a
composite window **cannot be attributed to any of its parts**.

Diagnosis, established by the cut that drafts this ADR:

- The publish consumer had no way to observe cancellation at all while parked in `Receiver::recv()`.
  **The interrupt had always been attached**; the thread that had to notice was asleep.
- `sync_all`, `File::create` and `remove_dir_all` have **no bounded duration in `std` on Windows**.
- The 418 ms cell turned out to measure *post-observation teardown*, not writing — the trigger fired
  two statements before a cancellation check, so its observation latency was ~zero.

Three distinctions are load-bearing here, and the constitution currently makes none of them:
**reachable**, **bounded**, and **measured**. Every cancellable operation this project adds will need
them, so they belong in an ADR rather than in one module's design note.

---

## Decision

### 1. Three named instants, binding on every cancellable operation

| Instant | Definition |
|---|---|
| `cancel_requested` | the cancellation call returns to its caller |
| `cancel_observed` | the worker owning the operation loads the flag set and **stops advancing the operation** |
| `cancel_quiescent` | the operation is finished unwinding: side effects reversed or recorded, resources released, outcome durable |

**No cancellation figure may be published without naming which pair of instants it spans.** A figure
saying "cancellation = 37 ms" is not a figure.

> **"Acknowledged" is retired from prose.** `docs/08` uses it, so it survives in quotation, but a
> write-up must say `observed` or `quiescent`. The word has been read both ways in this repository
> already and that is the whole reason this ADR exists.

### 2. The budget is scored on `cancel_requested → cancel_observed`

**Measured on the producer's clock** — the thread that owns the operation — never across a clock
domain. `cancel_quiescent` is **reported beside it, with no budget attached.**

The quiescent interval is not exempted because it is inconvenient. It is exempted because it is
**structurally unboundable**: it contains `remove_dir_all` over up to `MAX_PUBLISH_PARTITIONS` =
100,000 files and a durability `fsync`, and an operation that skipped those to hit a number would be
violating ADR-006's class-3 obligations to meet `docs/08`. **Reporting it is mandatory** so the trade
stays visible.

### 3. Scoring: p50 and p95 carry the verdict; max is reported

A budget verdict is taken on **p50 and p95**. **The maximum is always reported and never suppressed**,
but it does not by itself fail a verdict when the excursion is attributable to a class-(b) section
(below).

The reasoning is the taxonomy's, not convenience: a distribution whose tail is set by a blocking
syscall has a maximum that measures the operating system, not this software. **A max that is *not*
attributable to a class-(b) section is a failure like any other**, and the burden of attribution is on
whoever claims the exemption — with the instrument output to show it, not an argument.

### 4. Every operation classifies its critical path

Each section of a cancellable operation's path is declared as exactly one of:

- **(a) code-controlled cadence** — a declared constant (ADR-010 rule 6) with the quantity it bounds
  stated **in the units it actually bounds**. A byte cadence bounds bytes. It becomes a *time* bound
  only if the rate is bounded, which for a filesystem it is not.
- **(b) unbounded external section** — named, with the reason it cannot be bounded.

**No derived bound may exclude a class-(b) section, and no class-(a) cadence may be presented as a
latency bound by netting it against one.**

### 5. Attaching an external engine's interrupt establishes reachability, not a bound

It may never be cited as one. This project has the empirical case: DuckDB's `InterruptHandle` was
attached throughout the 3,920 ms window.

### 6. "Achieved typically, not guaranteeable at maximum" is a legitimate reportable outcome

Where a path crosses a class-(b) section, that sentence is an **admissible result**. This is what
stops the budget from being met by redefinition: an operation may honestly report that it meets
`docs/08` at p50 and p95 and cannot guarantee a maximum, rather than quietly narrowing the window it
measures until the number fits.

### 7. Instrument surface is never an SKP field

Producer-side counters, spans and connection facts never cross the wire. **Proving it is a regression
test over serialized bytes, not a review conclusion** — with tracing enabled and disabled, the same
deterministic operation must serialize byte-identical frames.

This item is the normative half of what would otherwise be a note in `docs/10`. `docs/10` is marked
"Changes via ADR", and a constraint foreclosing a future SKP design option belongs in an ADR rather
than in a pointer. **It is drafted separately as a proposed appended amendment to ADR-004**, whose
subject the wire is; if that amendment is accepted, this item defers to it and should be struck from
here rather than duplicated.

---

## Consequences

**ADR-017 §15 needs its Corrigendum 4**, which this cut appends: its "uninterruptible window"
sentence bounded the window in bytes while reading as a time bound.

**`docs/08`'s budget line gains a definition it never had.** That is an amendment note against
`docs/08`, not a rewrite of it, and it does not move the 100 ms number.

**Existing measurements are not retroactively rescored.** `kernel/RESULTS.md`'s fifth section
measured `cancel_requested → cancel_quiescent` and said so; under this ADR that remains a correct
measurement of a named interval, reported without a budget verdict. **It is not differenced against
later `cancel_observed` figures** — different intervals, different trees, and the within-session rule
forbids it regardless.

**A cost this ADR imposes deliberately:** every future cancellable operation must stamp two instants
rather than one, and must classify its path before it may quote a bound. That is more work per
operation, and it is the point — the alternative is what this project just spent a measurement pass
discovering.

---

## Alternatives considered

**Score the budget on `cancel_quiescent`.** Rejected: it makes `docs/08` unmeetable for any operation
with durable side effects, and the pressure that creates is toward skipping cleanup rather than toward
faster cancellation — the opposite of ADR-006's intent.

**Leave *acknowledged* undefined and let each operation say what it measured.** Rejected: that is the
status quo, and it produced two incompatible readings of one word inside a single results file.

**Score on the maximum.** Rejected: on a path crossing a blocking filesystem the maximum measures the
operating system's writeback behaviour. Reported always, verdict-bearing only when attributable to
this software — see item 3.
