*Custodian's filing note (2026-10-26): the architect's read-only draft of the five-line form for `slice-traced-test-cross-stamping`, the filler queue's entry 6c (S3), read at main dcd85569. The custodian commits the form on main from it, its cites pinned by script at dcd85569, with OPEN-1 (A), the RwLock, and OPEN-2 (A), no evidence beyond the mutations. The run 01:04:21Z to 01:13:10Z by its transcript (Grep 17, Read 29, Glob 1; no write tool). Its closing list of files read names engine/src/pool.rs and engine/src/dataset.rs, which the transcript shows read through Grep with context, not Read; engine/ADMISSION-PREREGISTRATION.md, which it cites, was read the same way. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 171b35c04d592cb473f9668a076e671f4aeba8581762fb38d22c538cf1c270ac.*

---

Drafted: slice-traced-test-cross-stamping, five-line form, architect

Read only, at main dcd85569 (the main checkout). Every cite is `path:line @ dcd85569`. I have no shell, so this draft carries no sha256; the custodian expands each cite into a pin. Everything below is my own wording unless it is marked as a byte copy. Code strings in backticks are copied from the cited line.

---

## The five lines (my draft)

```
Authority: PLAN node `slice-traced-test-cross-stamping` (PLAN.yaml:4489-4505 @ dcd85569), generation 2; filler queue entry 6c, graded S3 (state/directives/2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md:14 @ dcd85569; state/FILLER-QUEUE.md:15 @ dcd85569), running in the filler slot by the human's message of 2026-10-26, item 1 (state/directives/2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md:10 @ dcd85569); the filler rule, AUTONOMY.md §36 (AUTONOMY.md:692 @ dcd85569): a five-line form under §21c, the reviewer and the architect from dispatch, round 25, item 2 (e) set aside; proposed by the human's rulings of 2026-10-09, item 6 (state/directives/2026-10-09-rulings-on-the-eight-forms.md:52 @ dcd85569), as the sibling site at kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md §0.7 (its Amendment 1, item 2), with the human's note of 2026-10-10, item 3 (state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:9 @ dcd85569); the budget assertion is kept as round 53 orders (state/directives/2026-10-04-round-53-open-1-ruling.md:6-7 @ dcd85569); the reuse index found no prior art on either search (trace test lock; test serialisation), a miss noted here.
Scope: 1 file, engine/tests/slice.rs: one file-local `static TRACE_LOCK: std::sync::RwLock<()>` with `fn exclusive()`, `fn shared()` and `fn quiesce(ds: &Dataset)` and their docs, placed after `impl Drop for Watchdog` and above `fn small()`; one new first statement in each of the eleven tests the next line but one names; one `quiesce(&ds);` (after `drop(s);` where `s` is still live) at the end of the five it names; declared line budget 100 (insertions plus deletions, comments counted, AUTONOMY.md:357 @ dcd85569); this form exempt; no assertion, message, test name, fixture, constant, watchdog or other test changes, and no other file changes.
Change: while `cancelling_mid_stream_stops_production_promptly` holds its trace, no other test in the slice binary can stamp `cancellation_requested` or `producer_cancelled` into it: that test takes `exclusive()` as its first statement, and every test whose stream reaches a producer takes `shared()` as its first statement and, if it drops a stream that has not ended, waits in `quiesce` until its dataset holds no lease, so the budget reading pairs only the test's own two stamps.
Tests+mutation: no new test; changed by one first statement each: cancelling_mid_stream_stops_production_promptly (`exclusive()`) and, taking `shared()`, streaming_the_whole_file_returns_every_feature_with_bit_identical_coordinates, the_payload_is_variable_width_geoarrow_with_holes, a_viewport_filter_selects_a_subset_and_every_selected_feature_intersects_it, a_viewport_cannot_name_a_definition_only_crs_because_that_identifier_names_nothing, a_viewport_without_a_covering_bbox_column_is_refused_not_silently_scanned, every_batch_carries_the_envelope_not_just_the_first, cancelling_before_the_first_batch_stops_the_stream_without_producing_anything, dropping_the_stream_cancels_the_query, a_paused_consumer_bounds_producer_resident_memory and the_first_batch_is_handed_over_before_the_result_is_materialized, of which the_payload_is_variable_width_geoarrow_with_holes, a_viewport_cannot_name_a_definition_only_crs_because_that_identifier_names_nothing, a_viewport_without_a_covering_bbox_column_is_refused_not_silently_scanned, dropping_the_stream_cancels_the_query and a_paused_consumer_bounds_producer_resident_memory also end with `quiesce(&ds)`; M-1: in `exclusive()`, after the lock is taken, insert `std::mem::forget(trace::start(trace::TraceKey::default()));`, predicted to fail cancelling_mid_stream_stops_production_promptly, run alone, by name at its start's expect (`no other trace is running`); M-2: in `shared()`, after the lock is taken, insert `panic!("M-2: shared() reached");`, predicted to fail exactly the ten shared tests by name with that message, in a run of the whole binary; M-3: in `quiesce`'s assertion, replace its left side with `ds.connections().active_leases() + 1`, predicted to fail exactly the five quiescing tests by name with quiesce's message, in a run of the whole binary; each is observed in a debug build on the branch's code commit, recorded by name with the 40-hex commit it was observed at in a `RECORDED MUTATION:` doc line, and reverted; a verify-mutation run is not an observation; a mutation that passes, fails a test outside its predicted set, or fails anywhere else, is a stop.
Out-of-scope: ADR: no status line or amendment (ADR-010 rule 6's one-traced-stream limit and ADR-018's scored pair are read, not changed); security: nothing ADR-020, ADR-009 or ADR-021 governs; wire: no SKP, data-plane or MCP surface, nothing under protocol/, no literal, code or message text; guarantee: none changed, "touched" read as changed as settled for governance-hash-grammar-shared: the traced test re-asserts a property under test (docs/08's cancel_requested → cancel_observed budget on the producer's clock, ADR-018), and its assertion, message, bound and pair keep their text, as round 53 orders; the lock narrows what a pass can rest on to the test's own two stamps, a property-under-test contact disclosed here, and no figure is re-taken; the five-line form stands under §36, which sets round 25, item 2 (e) aside.
```

Proposed form path: `engine/SLICE-TRACED-TEST-CROSS-STAMPING-PREREGISTRATION.md`. It sits in the engine lane, beside engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md.

**The reuse index**, byte for byte as given in the brief (the read-only clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c):

```text
$ node tools/reuse.mjs trace test lock
No prior art recorded for "trace test lock". Research it before planning an implementation.
$ node tools/reuse.mjs test serialisation
No prior art recorded for "test serialisation". Research it before planning an implementation.
```

---

## Notes (my reading)

### 1. What crosses into the traced test

**The site.**
- The traced test is engine/tests/slice.rs:756 @ dcd85569. It starts the trace at :776-782 and expects `no other trace is running`. It cancels at :791, reads the events at :799 and drops the guard at :800.
- It takes the first event by name from the sorted list (:802-807). The two instants are read at :808-809.
- docs/08's assertion is at :811-818: `observed.saturating_sub(requested)` must be under 100 ms. The budget is docs/08_Testing.md:8 @ dcd85569.
- It is the only test in the binary that starts a trace (search for `trace::start` in the file: :776 only). So its start is never refused by another test here. Unlike in 6b, an overlap cannot fail loudly at `expect`; it can only change the reading.

**The facility.**
- One flag (engine/src/trace.rs:88 @ dcd85569) and one slot (:98).
- `mark` records from any thread while the flag is on (:302-307, :312-316).
- An event carries a name, an offset, rows and bytes, with no stream identity (:100-111, and :113-118 says this is deliberate).
- `events()` sorts by offset (:189-197).
- `TEST_LOCK` is `#[cfg(test)]` and `pub(crate)` (:554-560), so it is not visible to an integration test. A file-local lock is needed.

**Who stamps the two names.**
- `cancellation_requested` is stamped only by `CancelToken::cancel`, once, on the false→true transition (engine/src/cancel.rs:96-98, :120-124 @ dcd85569). A drop cancels without stamping (cancel.rs:113-115; engine/src/stream.rs:898-908 @ dcd85569). The only other caller in this binary is engine/tests/slice.rs:722 @ dcd85569 (cancelling_before_the_first_batch…).
- `producer_cancelled` is stamped inside `produce` and `flush` whenever the producer finds its token cancelled: engine/src/stream.rs:1795, :1845, :1854, :1901, :1934, :2001, :2558 @ dcd85569. A dropped stream's token is cancelled (:906). So any test that drops a stream while its producer is still running can stamp it.
- The producer is spawned at `stream()` time (stream.rs:1265-1268) and is never joined: the handle is discarded by `?;` at :1410. So a producer can outlive its stream and its test's body.
- Search for `mark(` in engine/src: only stream.rs, cancel.rs and trace.rs. `Dataset::open` and the fixture writer stamp nothing.

**The tests, one by one** (fn lines in engine/tests/slice.rs @ dcd85569):

| Test | Stream reaches a producer? | Leaves a live producer? | This piece |
|---|---|---|---|
| admission tests :184-435 | no stream | — | none |
| streaming_the_whole_file… :442 | yes (:449) | no, drained to None | shared |
| the_payload… :466 | yes (:483) | yes, one batch read, `s` dropped at the end | shared + drop + quiesce |
| a_viewport_filter… :528 | yes (:546-548) | no, drained | shared |
| a_viewport_in_another_crs… :559 | no: refused at stream.rs:1212-1219, before `build_sql` (:1222) and `SQL_BUILT` (:1227) | — | none |
| a_viewport_cannot_name… :580 | first refused at stream.rs:1209-1210; second admitted (:609-616) | yes, a temporary dropped at once | shared + quiesce |
| a_viewport_without_a_covering… :620 | first refused in `build_sql` (stream.rs:1492); second admitted (:642) | yes, a temporary dropped at once | shared + quiesce |
| every_batch_carries… :646 | yes (:656) | no, looped to None | shared |
| cancelling_before_the_first_batch… :689 | yes (:717-719) and cancels (:722) | no: `next_into` returned after `produce` did (the Err send is at stream.rs:1374, after the lease decision) | shared |
| cancelling_mid_stream… :756 | the traced test | — | exclusive |
| dropping_the_stream… :845 | yes (:857) | yes, dropped in the block :856-860 | shared + quiesce |
| a_paused_consumer… :868 | yes (:880) | yes, the producer blocked on send at the end | shared + drop + quiesce |
| the_first_batch… :917 | yes (:937) | no, drained (:947) | shared |
| h6 :981, arrow version :1055 | no stream | — | none |

A drained stream ends at None only when the sender drops at the end of the producer closure, which comes after every mark (stream.rs:1399).

**What a foreign stamp does to the reading.** `at` picks the earliest stamp of each name:
- A foreign `cancellation_requested` earlier than the test's own makes the interval longer: a false failure.
- A foreign `producer_cancelled` earlier than the test's own observation makes it shorter, or 0 through `saturating_sub` if it lands before the request: a false pass.
- A foreign `producer_cancelled` also satisfies :809's expect when the test's own is missing. That is the exact failure the flake hunt found, and a foreign stamp would have hidden it.

**Observed?** No.
- The human's note (state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:9 @ dcd85569) records that the flake hunt's failures were a missing event, with nothing dropped.
- That missing exit is now marked (stream.rs:2555-2558).
- The custodian's check (state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:55-57 @ dcd85569) records four `events=11` runs with the extra event unnamed. That fits this mechanism but does not show it.
- This piece rests on the code reading above.

### 2. The fix

**OPEN-1 (A), my recommendation: an RwLock.** `exclusive()` takes the write guard and `shared()` takes a read guard. The writer excludes the ten stamping tests, and those ten still run beside each other. Five of them quiesce.

**The lock order argument.**
- The traced test is granted the write guard only when no read guard is held.
- Each reader's body has then ended. Its producer has either finished (drained, or the cancel test) or released its lease (quiesced).
- Every `producer_cancelled` site is inside `produce`/`flush`, before the lease is decided at stream.rs:1306-1309. The pool's count goes down under the pool mutex that `quiesce` reads (engine/src/pool.rs:494-497, :589-596 @ dcd85569). So no stamp of either name can follow.
- No `cancel()` runs outside a body.
- Until the traced test's body ends, no reader starts.

**Drop order.**
- `_serial` is declared first, so it drops last.
- If the traced test panics before :800, the `TraceGuard` unwinds before the lock and clears the flag (trace.rs:353-358).
- A write-guard panic poisons the lock; `unwrap_or_else(|e| e.into_inner())` recovers it, as in the sibling's `serial()`. A read-guard panic does not poison.
- The lock comes before `Watchdog::new`, so the watchdog bounds the body only. A holder that hangs is aborted by its own watchdog (:76-109), so a waiter cannot wait forever.

**`quiesce`** is the shape of kernel/tests/trace_spans.rs:163-175 @ dcd85569: wait for `ds.connections().active_leases() == 0`, then assert it, in a 10 s window.

**Seams consumed, all read:**
- `trace::start`, `TraceGuard`, `TraceKey: Default` (trace.rs:119, :329-339);
- `CancelToken::cancel`;
- `Dataset::connections` (engine/src/dataset.rs:704-706 @ dcd85569);
- `ConnectionPool::active_leases` (pool.rs:494-497).

No `pub` item is added and no interface is invented.

**What the lock does not cover:**
- a quiesced producer's later marks: the post-check pair (stream.rs:1344, :1347) and `producer_finished` (:1399). The test reads neither.
- the test's own flag-before-stamp window: cancel.rs:121 sets the flag before :123 stamps, so its own producer can stamp first and `saturating_sub` reads 0. That is not cross-stamping, and it is out of scope.
- the remaining unmarked exits. Those are filler entry 4b's (`stream-cancel-returns-left-unmarked`).

### 3. docs/08 and recorded figures

- No docs/08 figure rests on this test. It is a CI pass/fail check against the declared number.
- The docs/08:8 figures of record come from the kernel harnesses (the test's own comment, engine/tests/slice.rs:704-706 @ dcd85569; docs/08_Testing.md:13-21 @ dcd85569).
- Phase R's R-5 to R-7 values were reports, not measurements (kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:223 @ dcd85569).
- The change cannot move a recorded figure. It can change a CI outcome only in a run where a foreign stamp would have entered, in either direction.
- It also removes the ten streaming tests' load from the traced test's window. The admission and h6 tests still run beside it.
- No figure and no direction of effect is claimed. Round 53's re-run practice stands.

### 4. Tests, mutations, observation

**What the mutations prove.** They are deterministic and show that each call is on each declared path:
- M-1: the exclusive call precedes the start, and the refusal is kept.
- M-2: exactly the ten tests take `shared()`, and the traced test does not.
- M-3: exactly the five tests reach quiesce's assertion.

**What the exclusion rests on.** Section 2's argument, plus the trace_spans precedent for how much `quiesce` can detect. As in the siblings, the race itself is not forced.

**The route:**
1. On the branch's code commit, run `cargo test -p spatial-engine --test slice` unmutated; all tests pass.
2. M-1: `cargo test -p spatial-engine --test slice -- --exact cancelling_mid_stream_stops_production_promptly`.
3. M-2 and M-3: the whole binary.
4. After each mutation, revert it and confirm the file matches the code commit.

These are debug builds, run in a shared hold. CI on both platforms follows.

**Stops:**
- an unmutated failure. A failure at the budget assertion follows round 53: the failing log is filed, the test is re-run once alone, and both run ids are recorded. It is not counted as a stop until the custodian has the re-run.
- a mutation outside its predicted set;
- a file outside Scope must change.

**May not claim:**
- that cross-stamping was observed;
- any rate;
- that the trace holds only this test's events;
- any timing;
- that the flake hunt's failures had this cause.

### 5. Size (AUTONOMY.md:349-357 @ dcd85569)

- My estimate is about 70 changed lines in 1 file:
  - W1 and two RECORDED MUTATION lines, about 18;
  - the static and two fns, about 8;
  - quiesce with W2 and its RECORDED line, about 19;
  - blank lines, about 3;
  - eleven first statements;
  - seven quiesce or drop lines.
- The declared budget is 100, under §21c's 150 lines and 8 files.
- No dependency, no exposure surface, no user-visible behaviour.
- An overrun is class 6 (AUTONOMY.md:345 @ dcd85569), with the Scope line unedited.
- The node's budget is 60 min (PLAN.yaml:4499 @ dcd85569). That is plausible for one debug build and four runs, but it is not measured.

### 6. Out-of-scope readings

- **ADR, security, wire:** none touched.
- **Guarantee:** this follows the settled reading, "touched" means changed (kernel/KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md:99 @ dcd85569). Unlike 6b, the lock here does decide what a pass proves, which is the wire-bytes §0.11 shape (kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md:82 @ dcd85569). The line therefore discloses the property-under-test contact (AUTONOMY.md:325-327 @ dcd85569) rather than asserting there is none.
- §36 sets §25(e) aside (AUTONOMY.md:482, :692 @ dcd85569), so the five-line form stands.
- No red-line text and no P6 string.
- Round 53's assertion keeps its text, so I do not read this piece as reopening round 53. If the custodian reads the change of load in the window as altering the assertion, that becomes the human's question.
- No KNOWN-LIMITATIONS item and no README line is owed: the piece is test only, and #241 holds engine/README.md.

### 7. Rule (00)

This piece's paths are engine/tests/slice.rs and the form on main.

| In flight | Overlap |
|---|---|
| slot 2, 1c step 1 | none |
| port-2 | none. Contact only: engine/src/lib.rs re-exports what slice.rs imports. |
| 6b (held, out of the slot) | none |
| #252 | none. Contact: engine/src/dataset.rs holds `Dataset::connections`; if #252 merges first, the worker re-reads it at its base. |
| #249, #244 | none |
| #241 | none. Contact: engine/src/fixture.rs supplies `write_geoparquet`, `FixtureSpec` and the constants slice.rs uses. |

Nothing is under protocol/. The path lists are the brief's; I cannot read branches.

### 8. Doc words

These are not the human's wording; they are doc comments. The worker applies them as written, wrapped at 100 columns. Neither carries a path:line.

**W1**, above the static:

> /// **The trace is process-global, and one test here reads two of its stamps.**
> ///
> /// While a trace runs, `spatial_engine::trace` records the `mark` of every thread in this process,
> /// and an event names no stream. `cancelling_mid_stream_stops_production_promptly` reads the first
> /// `cancellation_requested` and the first `producer_cancelled` in its trace and asserts docs/08's
> /// cancellation budget on the interval between them. Another test here that cancels a token can
> /// stamp the first, and a producer that finds its stream cancelled, a dropped stream included, can
> /// stamp the second; either, landing in that trace, could stand in for the test's own. So that
> /// test takes `exclusive()` as its first statement, and every test here whose stream reaches a
> /// producer takes `shared()` as its first statement; each holds its guard to the end of its body,
> /// and the shared tests still run beside each other. A producer is never joined and can outlive its
> /// stream, so a shared test that drops a stream before the stream has ended calls `quiesce` before
> /// its body ends. Tests that open no stream, or whose only stream is refused before it is built,
> /// stamp nothing and take neither. A quiesced producer can still stamp the post-check pair and
> /// `producer_finished` after its lease is released; the test reads neither name.
> ///
> /// RECORDED MUTATION: <M-1: the insertion; the test's name and message; the 40-hex commit>
> /// RECORDED MUTATION: <M-2: the insertion; the ten names and the message; the 40-hex commit>

Each clause checked against the code at dcd85569:
- "records the mark of every thread … names no stream": trace.rs:302-316 and :100-111. Holds.
- "reads the first … and asserts … budget": slice.rs:802-818. Holds.
- "cancels a token can stamp the first": cancel.rs:120-124; slice.rs:722. Holds, and it says "can".
- "a producer that finds its stream cancelled, a dropped stream included, can stamp the second": stream.rs:906 plus the sites listed in note 1. Holds.
- "could stand in for the test's own": trace.rs:189-197 and slice.rs:802-807. Holds.
- "exclusive … shared … to the end of its body": this is what the change makes true; the gate checks the eleven tests.
- "still run beside each other": std's RwLock admits several readers. This is a library claim, read at the toolchain.
- "never joined and can outlive its stream": stream.rs:1265-1268, :1410 and :898-908. Holds.
- "refused before it is built, stamp nothing": stream.rs:1179-1220 and :1492, ahead of :1227; Dataset::open has no mark. Holds.
- "post-check pair and producer_finished after its lease is released": stream.rs:1306-1309, :1344, :1347, :1399. Holds.

**W2**, above `quiesce`:

> /// Wait until this dataset holds no lease, before a shared test's guard is released.
> ///
> /// A producer stamps `producer_cancelled` inside `produce`, before it gives its lease up, so a
> /// dataset with no active lease has no producer left that can stamp it. Bounded at ten seconds and
> /// loud on a miss, in the shape of the kernel's trace-span suite.
> ///
> /// RECORDED MUTATION: <M-3: the replacement; the five names and the message; the 40-hex commit>

Each clause checked against the code at dcd85569:
- "inside produce, before it gives its lease up": the sites in note 1 are in `produce`/`flush`, and the lease is decided at stream.rs:1306-1309. Holds.
- "no active lease … no producer left": pool.rs:494-497 and :589-596. Holds.
- "ten seconds … kernel's trace-span suite": kernel/tests/trace_spans.rs:163-175. Holds once the change sets the window.

---

## OPEN items (both are the custodian's; neither is the human's)

- **OPEN-1, the lock's shape.**
  - (A) RwLock: the traced test exclusive, ten tests shared, five of them quiesce. **I recommend (A).**
  - (B) One Mutex taken by all eleven, in the sibling's exact `serial()` shape, with the same quiesce. Simpler, but it runs the ten one at a time, which changes their running conditions and lengthens the binary.
  - (C) Move the traced test into its own binary. Not recommended: records cite it by this path (engine/ADMISSION-PREREGISTRATION.md:1195 @ dcd85569), round 53 keeps the assertion where it is, and the wire-bytes form's §8 item 7 is the precedent.
- **OPEN-2, evidence beyond the mutations.**
  - (A) None: one unmutated local run plus CI on both platforms. **I recommend (A)**, given the 60 min budget and that no claim rests on more.
  - (B) Also a scratch probe at the base, never committed: N runs of the binary with a diagnostic counting each of the two names in the trace. More than one of either is a foreign stamp. Reported with no prediction, it would answer the human's 2026-10-10 note with evidence.

## What I could not settle

- No hashes, and no runs.
- Whether rustfmt's wrapping keeps the count near 70.
- std RwLock's writer-priority policy depends on the platform. The reader set is finite, so the writer is delayed, never starved; this is a library claim at the toolchain, not read.
- Whether #252 or #241 change `Dataset::connections` or the fixture API before this lands. These are contacts, not path overlaps; the worker re-reads them at its base.
- Branch contents beyond the brief's path lists.

Files read (absolute):
- C:\dev\spatial-ide\engine\tests\slice.rs
- C:\dev\spatial-ide\engine\src\trace.rs
- C:\dev\spatial-ide\engine\src\cancel.rs
- C:\dev\spatial-ide\engine\src\stream.rs
- C:\dev\spatial-ide\engine\src\pool.rs
- C:\dev\spatial-ide\engine\src\dataset.rs
- C:\dev\spatial-ide\kernel\tests\trace_spans.rs
- C:\dev\spatial-ide\kernel\FIRST-BATCH-FACTORIAL-IGNORED-TRACE-TESTS-PREREGISTRATION.md
- C:\dev\spatial-ide\kernel\WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md
- C:\dev\spatial-ide\kernel\TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md
- C:\dev\spatial-ide\kernel\KERNEL-CLOSE-DURING-OPEN-ADMISSION-PREREGISTRATION.md
- C:\dev\spatial-ide\AUTONOMY.md
- C:\dev\spatial-ide\PLAN.yaml
- C:\dev\spatial-ide\state\FILLER-QUEUE.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md
- C:\dev\spatial-ide\state\directives\2026-10-10-flake-hunt-run-1-flush-cancel-exit.md
- C:\dev\spatial-ide\state\directives\2026-10-04-round-53-open-1-ruling.md
- C:\dev\spatial-ide\state\directives\2026-10-24-weekend-exception-third-product-slot-placements-forms-ahead-250-click.md
- C:\dev\spatial-ide\state\directives\2026-10-26-o1-s1-257-258-259-merged-6b-r3b-held-on-the-human-6c-runs-fixture-s-entry-point-6d.md
- C:\dev\spatial-ide\state\directives\2026-10-26-resent-2026-10-25-o1-s1-clang-cl-route-a-hugeint-cast-b-five-nodes-placed.md
- C:\dev\spatial-ide\state\consults\FLAKE-HUNT-RUN-1-2026-10-10.md
- C:\dev\spatial-ide\state\consults\2026-10-10-flake-hunt-run-1-custodian-check.md
- C:\dev\spatial-ide\docs\08_Testing.md
- C:\dev\spatial-ide\kernel\RESULTS.md (lines 160-179)
