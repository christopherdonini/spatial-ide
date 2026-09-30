# Consult — the architect's draft for engine-cancel-before-stream-window (2026-09-30)

*Custodian's filing note: the architect agent's final report, delivered as a hand-back message on 2026-09-30 before 08:23:18Z, when the form it drafted was committed (c6f61f5), on the custodian's brief sent after 08:06:46Z (8efc554) (a drafting consult, not a gate), read at main 8efc554. Recorded verbatim below the rule, from the message, with the harness's report indentation removed, except for two elisions, each marked in parentheses at the end: the DRAFT section (committed as the form) and the closing list of local paths. The committed form is `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`; its header lists the custodian's edits to the draft. The custodian's checks before commit: the three in-code statements named in item 1 (`engine/src/dataset.rs:1751-1752`, `engine/src/cancel.rs:29-30` and `:4-11`) read as the report describes them at 8efc554; the three tests named in §5 exist; `Dataset::stream_with_cancel` and the engine's `fixture` feature exist; `Cargo.lock` line 1188 carries the checksum P0-2 names. The DuckDB source reading in item 1 is the architect's, from an untracked build output, and is P0-2's to confirm.*

---

**Verdict:** n/a (a drafting consult, not a gate). Read at `main @ 8efc554`.

I have no shell, so no span hash below is computed. Every `sha256:TBD` in the draft needs the custodian to run `git show 8efc554:<path> | sed -n '<a>,<b>p' | sha256sum` before committing.

## 1. Governing texts and the clause this defect misses

- **ADR-018 item 5** (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md` §Decision 5): attaching an engine's interrupt establishes reachability. Inside this window it does not, because the interrupt is attached but cannot reach the query. So the premise item 5 rests on fails here.
- **ADR-018 item 1**: `cancel_observed` requires the worker to stop advancing. Here the query keeps going until the next poll after `stream_arrow`.
- **In-code guarantees that are false at 8efc554:**
  - `engine/src/dataset.rs:1751-1752` (the `lease_for_stream` doc) says there is no window in which a cancel can arrive before anything is interruptible.
  - `engine/src/cancel.rs:29-30` says a cancel that arrives before attach is not lost, because attach interrupts. By `cancel.rs:87-92`'s own measurement, that interrupt lands on an idle connection and is lost.
  - `engine/src/cancel.rs:4-11` (the module header) says the flag is the second line of defence, not the only one.
- `engine/README.md` §3 (lines 43-47) is incomplete rather than false.
- `kernel/CANCELLATION-AND-TRACING.md:93` classifies DuckDB execution as class (b), which presumes reachability.
- No `engine/*PREREGISTRATION*.md` states the producer's pre-execute behaviour. I searched all eleven.

**Mechanism, from reading the source.** I read the bundled DuckDB `src/main/client_context.cpp` from a `libduckdb-sys` build output under `target/debug/build/libduckdb-sys-d3315d555f4f8af8/out/`. That is untracked, and I could not confirm it matches the locked 1.10505.0 (four debug builds exist). What it shows:
- `ClientContext::Interrupt` only sets `interrupted`, and takes no lock.
- `InitialCleanup` clears the flag. It runs at the start of `Prepare` and of `PendingQueryPreparedInternal`, which is the execute path.
- `RunFunctionInTransactionInternal` also clears it when it opens an autocommit transaction.

So the window is wider than the brief states. It runs from the check at `stream.rs:1755` into `stream_arrow` itself, up to DuckDB's clear. Moving the check later cannot close it.

## 2. Sibling search (AUTONOMY.md:215)

Every other `cancel.attach` site has the same window, and a wider one: **none has any check before executing**. At each, attach's interrupt-if-cancelled lands on an idle connection, and the statement's own prepare clears the flag again.
- **Outcome is still correct at every site**, because each checks `is_cancelled` after detach and returns `Cancelled`.
- **What is lost is stopping**: the statement runs to its end.

| Site | What runs to completion | Product caller |
|---|---|---|
| `dataset.rs:1332` `cancellable` | metadata reads, bounded by the footer; the covering sample, bounded by `SANITY_SAMPLE_MAX_ROWS` | open |
| `dataset.rs:1636` identity scan | a whole-column scan at open, unbounded by file size | open, `kernel/src/lib.rs:189` |
| `index.rs:332` | `query_arrow` fully materialises, up to `MAX_INDEXED_FEATURES` | index build |
| `rowgroup.rs:336` | `parquet_metadata`, bounded by the footer | row-group index |
| `layout.rs:345` | the COPY sort and write | measurement harness only (`layout.rs:46`) |
| `layout.rs:438` | the curve-key scan | measurement harness only |

**Recommendation:** scope them out of this piece. Record one PLAN node, `engine-cancel-before-execute-siblings`, blocked on this piece, to reuse the same window guard. `dataset.rs:1636` and `index.rs:332` come first, because their work is unbounded.

## 3. Fix shapes

**A. The token re-raises the interrupt while an execute call is in flight. Recommended.**
- *Producer side:* the token gains an `in_execute` flag. A crate-private window guard sets it, checks the cancel flag, runs the execute closure, clears it, then checks the cancel flag again. That second check returns `Cancelled` on an `Ok`.
- *Canceller side:* `cancel_inner` sets the flag and interrupts once. On the false-to-true transition, if `in_execute` is set, it spawns one thread. That thread re-interrupts at a declared interval while `in_execute` is set and the token is bound.
- *Why it closes the window:* both flags are SeqCst, so either the producer's check sees the cancel, or the canceller sees `in_execute` and keeps re-raising past every DuckDB clear point, however many there are. A cancel that arrives after the window closes is caught by the post-return check.
- *Cost:*
  - an uncancelled run pays two atomic stores and one load;
  - a cancel landing in the window pays one thread spawn;
  - there is one new declared constant.
- *What it cannot claim:*
  - a time bound (ADR-018 item 5): the interval says how often it looks, class (a); DuckDB's reaction and thread scheduling are class (b);
  - stopping at the siblings;
  - that a failed spawn still stops the work. It degrades to today's behaviour; the outcome stays `Cancelled`.
- *Exposed by the crate:* yes. It needs only `InterruptHandle::interrupt`, which is `pub`, Send and Sync (`duckdb-1.10505.0/src/inner_connection.rs:285-315`).

**B. The pending-query API: check after DuckDB's clear, then step tasks.**
- Closes the window exactly, with no interval.
- *Not exposed by the crate:*
  - `Statement.stmt` is `pub(crate)` (`statement.rs:30`);
  - `Connection` has no raw-handle accessor;
  - `ArrowStream::new` is private.
- The FFI functions do exist (`libduckdb-sys` `bindgen_bundled_version.rs:1577`, `:1592`; re-exported at `duckdb/src/lib.rs:58`). Using them means re-implementing prepare, bind, stream and Arrow fetch in `unsafe` code. That is too much for this piece; it is the exact fix if the crate ever exposes pending results.

**C. The post-return check alone.**
- Fixes the outcome only; the scan inside `stream_arrow` still runs, so it falls short of ADR-018 item 1.
- Admissible only as part of A, whose ordering argument needs it.

A per-execute helper thread was rejected: it puts a thread spawn on every query's critical path, a docs/08 first-batch risk that has not been measured.

## 4. P0, before any code

- **P0-1, pin the premise at the producer's exact ordering.** The existing test at `cancel.rs:197-212` cancels before prepare, so it cannot tell a prepare clear from an execute clear. New test: attach, prepare, cancel, `query_arrow` on `range(0,1000)`.
  - Predicted: `Ok` (not latched).
  - An `Err` falsifies the defect as described: stop, and re-scope by an amendment.
- **P0-2, enumerate the clear points** in the source extracted from the tarball that matches the `Cargo.lock` checksum (lock line 1188), recorded by function name. This turns my untracked read into evidence at a named artifact.
- **P0-3, a deterministic reproduction with no hook in product code.** The guard's closure is the hook: `guard(|| { t.cancel(); stmt.query_arrow(..) })` lands the cancel after the guard's check and before DuckDB's clear.
  - Failing reproducer (A's re-interrupt removed): the query is ended by the test's liveness watchdog, not by the token.
  - At the stream level, no deterministic reproduction exists without a `cfg(test)` fault point. That would be a code path with only a test caller, so I did not propose one.
- **Gate question to raise.** The watchdog's liveness deadline bounds only how long a failing test runs. Nothing asserts it as a latency, and elapsed time is printed. Confirm this fits round 25 item 1(a), or the tests must accept hanging as their failure mode.

## 5. Other notes

- **Size:** the draft declares ≤ 400 lines across ≤ 4 files, which is over §21c. It takes full gating anyway under §21a, as a cancellation guarantee.
- **Time:** the node's `budget_minutes: 90` is likely short; I have not changed it.
- **Portability:** not OS-dependent (no `cfg`, only std threads and atomics), so R3 does not apply.
- **Instrument accessor:** `CancelToken::is_executing()` is new and relies on round 5 item 4's instrument-accessor exemption.
- **Constants to confirm:** `REINTERRUPT_INTERVAL` = 10 ms is proposed by precedent (`PUBLISH_STREAM_POLL_INTERVAL`, `kernel/CANCELLATION-AND-TRACING.md:89`). `TEST_LIVENESS_DEADLINE` = 60 s is a harness-only bound. Both are my proposals for the custodian to confirm. They are not measurements.

---

(The report's DRAFT section followed here. It is not repeated: the committed form, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, is that draft with the edits its header lists.)

(The report closed with a list of the paths it read: the six engine source files named above, ADR-018, the vendored `duckdb-1.10505.0/src/statement.rs` under the local cargo registry cache, and the untracked `client_context.cpp` build output named in item 1. The local absolute paths are not reproduced.)
