# Cancellation reach, and the producer-side trace instrument

Design note for the cut that closes `kernel/RESULTS.md`'s fifth-section publish-cancellation miss and
adds the trace surface that explains it. Written **before** the measurements, so the semantics cannot
be defined by whatever the numbers turn out to be.

Authority: `docs/01` principles 7 and 8, `docs/08` (the cancellation budget), `docs/10`, ADR-004,
ADR-006, ADR-010 rules 6 and 7, ADR-017 §15. **ADR-011 is not cited here and may not be** (CLAUDE.md).

---

## 1. What was actually wrong — two premises corrected

The fifth section measured a **3,920 ms** window inside the publish sort during which cancellation
was not acknowledged, and a `WritingPartitions` p95 of **418.321 ms** against `docs/08`'s 100 ms.

**Correction 1 — the interrupt was never missing.** `engine/src/dataset.rs`'s `lease_for_stream`
attaches DuckDB's `InterruptHandle` to the publish path's token before the producer thread exists,
and always did. Any write-up saying "the interrupt was not attached, and why is itself a finding" is
wrong and must not be published. The cancel *reached DuckDB*; the thread that had to notice was
parked in `Receiver::recv()` with no timeout, holding a token it had no way to look at.

**Correction 2 — the 418 ms cell does not measure what it appears to.** A6's trigger fires inline
from `partition_written`, and the next two statements are `payload.clear(); check_cancel(...)`. There
is no partition write between the fire and the check, so observation latency in that cell is
approximately **zero** and the measured window is entirely *post-observation teardown*: stream drop,
staging removal over ~100 files, and the audit record's fsync.

Two consequences bind this cut:

- The fifth section's own stated hypothesis — *"a cancel landing at the start of a stall would wait
  it out"* — is **refutable from the retained source**. That refutation is a finding for the sixth
  section, and a good one: the fifth section labelled it a hypothesis precisely so it could be.
- **Re-scoring that cell may not be presented as evidence that intra-partition polling works.** A
  separate cell with a trigger that fires *inside* a write is required, and exists
  (`partition_write_progress`).

---

## 2. Frozen measurement semantics

Frozen before implementation so implementation cannot define a boundary by accident.

### The three cancellation instants

| Instant | Definition | Stamped at |
|---|---|---|
| `cancel_requested` | `CancelToken::cancel()` returns to its caller | `engine/src/cancel.rs`, `trace::CANCELLATION_REQUESTED` |
| `cancel_observed` | the worker loads the flag set and stops advancing | `publish::trace_names::CANCEL_OBSERVED`; producer side `trace::PRODUCER_CANCELLED` |
| `cancel_acknowledged` | operation quiescent: unwound, staging removed, outcome fsynced, lease released | `publish::trace_names::STAGING_REMOVED` + return |

**`docs/08`'s "acknowledged < 100 ms" is scored on `cancel_requested → cancel_observed`.**
`cancel_acknowledged` is reported **beside** it, with no budget attached.

> **This is a reading of the budget, not a change to it** — `docs/08` says *acknowledged*, and
> acknowledged is not completed. It is declared here, before any number exists, because declaring it
> after seeing a number is exactly the failure A6 refused to commit.

**The fifth section's 3,920 ms and 418 ms are `cancel_acknowledged` figures.** They are therefore
**not like-for-like** with the new budget-bearing ones. The sixth section prints both intervals for
the new runs, so the old-beside-new comparison is against the same interval.

### Producer boundaries

Every one is a `std::time::Instant` captured at the named statement. **One monotonic clock domain per
operation; JSONL carries relative nanoseconds from an operation-local epoch; no wall clock is
recorded and none is differenced.** Producer instants and consumer instants are **never** subtracted
— the mistake spike M5 made, per `protocol/data-plane/src/transport.rs`.

`sql_prepared` and `execute_returned` straddle the two opaque FFI calls one line apart; **which of
them the sort blocks in is not established anywhere in this repository**, and that pair exists to
settle it. That is piece 2 answering a question piece 1 raised.

### Events vs spans

An **event** is one stamped instant. A **span** is an ordered pair of events with a duration. They
are distinct record kinds in the artifact and are never merged. Derived spans: `lease_acquire`,
`query`, `source_to_first_batch`. Reserved and deliberately not implemented, named so the vocabulary
does not mislead: `encode`, `wire_send`, `consumer_decode`.

---

## 3. The cancellation-bound taxonomy, applied

Three things, never conflated. **Only the third carries a verdict.**

| Section | Class | Statement |
|---|---|---|
| publish consumer waiting for a partition | **(a) code-controlled** | `PUBLISH_STREAM_POLL_INTERVAL` = 10 ms; derived worst case **25.625 ms** (one interval + the 15.625 ms Windows default timer tick). Bounds the whole pre-first-batch window including the sort. |
| bytes between cancellation checks inside a partition write | **(a) code-controlled** | `PUBLISH_WRITE_CHUNK_BYTES` = 256 KiB. Bounds the window **in bytes, exactly**. |
| one chunk's `write_all`, `File::create`, `sync_all` | **(b) unbounded external** | `std` on Windows offers no interruptible file write. No bound is derivable. The cadence max of **999.924 ms** against a p50 of 8.573 ms in the fifth section is this term, measured. |
| DuckDB query execution incl. the sort | **(b) unbounded external** | **Attaching the interrupt establishes reachability, not a bound**, and may never be cited as one. |
| DuckDB connection teardown on the cancel path | **(b) unbounded external** | Currently *inside* the return window; the poll fix moves the acknowledgement out ahead of it. |
| staging `remove_dir_all`, audit `sync_all` | **(b) unbounded external** | Up to `MAX_PUBLISH_PARTITIONS` = 100,000 files. Why `cancel_acknowledged` carries no budget. |

**No derived bound excludes a class-(b) section, and none below does.**

### The honest answer, stated in advance

- `cancel_requested → cancel_observed` **before the first batch**: bounded, 25.625 ms derived.
- `cancel_requested → cancel_observed` **during partition writing**: bounded in bytes, **not in
  time** — it contains a class-(b) syscall.
- `cancel_observed → cancel_acknowledged`: **not bounded and cannot be made so.**

Per `NEXT-CUT.md`, *"achieved typically (p50/p95), not guaranteeable at maximum across a blocking
filesystem"* is a **pre-authorized** outcome. If that is what the measurement says, it is written up
as a finding about the budget's wording and not engineered around.

---

## 4. Inventory of inherited work against the rev-2 semantics

The implementation began under rev 1 of the brief and was adopted as work-in-progress after rev 2
superseded it. Rev 2 added the taxonomy, the events/spans split, the clock and buffer rules, and the
wire-bytes invariant — **none of which rev 1 required**. Every inherited change was re-checked
against them.

| Inherited | Verdict | Action |
|---|---|---|
| `PUBLISH_STREAM_POLL_INTERVAL` + `next_into_timeout` + `BatchPoll` | **conforms** | kept. The derivation is genuinely class (a) and correctly scoped to the pre-first-batch window. |
| `PublishPhase::QueryRunning`, reported once on first `WouldBlock` | **conforms** | kept. Deterministic by construction — reachable only with a batch demanded and none arrived. |
| `CancelWatch` + `cancellation_observed(Instant)` | **conforms** | kept; now also stamps the trace event. |
| Chunked `write_inner` + `partition_write_progress` | **conforms mechanically** | kept. |
| `PUBLISH_WRITE_CHUNK_BYTES` **doc**: "derived worst case … 262,144 B ÷ 10 MB/s = 25.0 ms" | **NON-CONFORMING** | **withdrawn and rewritten.** A declared floor write rate for a blocking filesystem is an assumption about an external system, not a derivation — the syscall is class (b). Retained as an explicitly labelled *estimate*, which may not be quoted as a ceiling. |
| `trace.rs` clock: `Instant` origin + `offset_nanos` | **conforms** | kept. |
| `trace.rs` off-by-default: relaxed load, `#[cold]` recording | **conforms** | kept, with the repo's own `cfg(test)` precedent as the argument. |
| `trace.rs` buffer: `Vec::with_capacity(4096)` | **NON-CONFORMING** | **fixed.** Reserving is not bounding — it would have grown by reallocating, on the path it measures, which the file's own header forbids. Now a hard ceiling `TRACE_BUFFER_RECORDS` with **drop-with-count, never block**, and the count in the artifact. |
| `trace.rs` JSONL: every event emitted as `"kind":"span"` | **NON-CONFORMING** | **fixed.** That is the exact conflation rev 2 forbids — it made the artifact claim durations it did not hold. Events and spans are now distinct kinds, with spans derived from a named pair table. |
| `trace.rs` cancellation vocabulary: only `PRODUCER_CANCELLED` | **incomplete** | `CANCELLATION_REQUESTED` added and emitted. Generic `observed`/`acknowledged` names deliberately **not** added — nothing would emit them, and an always-absent name reads as "did not happen". |
| kernel `trace_names` incl. `PARTITION_SYNC_START/END` | **conforms, and is better than required** | kept. It instruments the class-(b) term directly, which is what lets the sixth section measure which term dominates rather than argue it. |
| Wire-bytes invariant | **NOT PRESENT** | required by rev 2; see §5. |

---

## 5. The wire-bytes invariant

**With tracing enabled and disabled, the serialized protocol bytes of the same deterministic
operation are byte-identical.** Proven by a regression test, not concluded from reading.

`TAG_OPEN` is **excluded from the comparison, with the reason stated in the test**: its payload
carries `OperationId`/`StreamId`, minted from a process-global counter XORed with the pid, so two
runs differ there *with tracing untouched*. Its **length** is asserted unchanged instead. Every other
frame must match byte for byte.

Fixed inputs, or the test measures the wrong thing: same fixture, same `ViewportQuery`
(`bbox: None, limit: None`), and a credit schedule that does not depend on consumer timing.

---

## 6. Decisions flagged for the human, not taken here

1. **ADR-017 §15 goes stale.** It states "the uninterruptible window is one partition's encode and
   write". Intra-partition polling makes shipped behaviour *narrower* than the accepted text — not a
   violation, but the ADR is immutable. Needs an **appended corrigendum**, proposed not applied.
2. **ADR-018 is missing and is drafted as Proposed** — *"What 'cancellation acknowledged' means, and
   what an operation owes after it"*. `docs/08` requires acknowledgement in 100 ms and defines
   *acknowledged* nowhere; the reachable / bounded / measured distinction is currently made nowhere
   in the constitution and every future cancellable operation needs it.
3. **`docs/10` is marked "Changes via ADR".** A *descriptive pointer* (the engine-side half exists as
   instrument surface at these paths; the protocol-level design remains open) needs no ceremony and
   lands in this cut. A *normative invariant* ("no instrument surface may become an SKP field")
   forecloses a future SKP design option and **needs ADR ceremony** — it is item 5 of the ADR-018
   draft rather than a line added to docs/10.
4. **`engine/src/pool.rs`'s declared ADR-014 hazard widens.** The gap between "publish returns" and
   "lease slot freed" grows now that the consumer no longer waits on the producer's final send.
   Recorded in `pool.rs`; per that module's header it may not be cited as evidence for or against
   ADR-014.

## 7. Known limits, named rather than discovered later

- **One traced stream per traced run.** `trace::CURRENT` is a single slot; a second `start` is
  refused rather than silently replacing the first. The consistency demonstration is a single-stream
  run, so the limit costs nothing today.
- **`TRACE_BUFFER_RECORDS` is reached in normal use.** `BATCH_FULL` fires per batch and the
  hero-slice fixture streams 6,637 of them. Every segment the demonstration needs is a *first*
  occurrence, and first occurrences are never what gets dropped — but the drop count travels with the
  artifact and must be printed beside any derived figure.
- **§5d's `temp_directory` control remains unimplemented and unreachable** (`Lease::connection()` is
  `pub(crate)`). Out of this cut's scope; a ~7 GB sort can still spill somewhere unrecorded.
