# Diagnosis — connection-reuse-recycled-interrupt-flake (lead-data, read-only)
Read at: main e555177c

Scope: the three questions of the human's ruling, item 1, at state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md:9, and the node at PLAN.yaml:5377 (its summary at PLAN.yaml:5392). Facts of the code at main, with pointers. No fix, design, recommendation, grade or severity.

## The token in this test

- The test creates a fresh token at engine/tests/connection_reuse.rs:169 and passes a clone of it only to `stream_with_cancel` at engine/tests/connection_reuse.rs:170-172. `Dataset::open` at engine/tests/connection_reuse.rs:160 takes no token from the test, and the warm-up stream at engine/tests/connection_reuse.rs:162 uses its own fresh token (engine/src/stream.rs:900-902).
- `is_bound` reads whether the token's interrupt slot holds a handle, under the slot's mutex (engine/src/cancel.rs:271-277). The slot is set only by `attach` (engine/src/cancel.rs:249) and emptied only by `detach` (engine/src/cancel.rs:255-261).
- On the stream path, `detach` is called on this token at two places only: engine/src/stream.rs:1273 (the producer thread, after `produce` returns) and engine/src/stream.rs:1394 (the spawn-failure path, which returns `Err`, engine/src/stream.rs:1395-1396). The other `detach` call sites (engine/src/dataset.rs:1487, engine/src/dataset.rs:1810, engine/src/index.rs:338, engine/src/layout.rs:351, engine/src/layout.rs:511, engine/src/rowgroup.rs:346) act on the token passed to those functions, not on this one.

## Question 1: where the recycled connection's interrupt handle is bound, relative to the return of `stream_with_cancel`

Answer: the bind happens on the caller's thread, before `stream_with_cancel` returns, and before the producer thread is spawned.

- `stream_with_cancel` (engine/src/stream.rs:906-923) calls `stream_inner` (engine/src/stream.rs:1140).
- `stream_inner` calls `let lease = lease_for_stream(self, &cancel)?;` at engine/src/stream.rs:1221.
- `lease_for_stream` acquires the lease (engine/src/dataset.rs:1941), then binds with `cancel.attach(Arc::clone(&lease.connection().interrupt_handle()))?;` at engine/src/dataset.rs:1942.
- Inside `attach`, the handle is stored by `*slot = Some(handle);` at engine/src/cancel.rs:249, under the lock taken at engine/src/cancel.rs:234-238.
- If `attach` fails, the `?` at engine/src/dataset.rs:1942 and at engine/src/stream.rs:1221 returns `Err`, so the test would fail at its `.expect("stream")` (engine/tests/connection_reuse.rs:172), not at line 179.
- The producer thread is spawned only after that, at engine/src/stream.rs:1251-1253. `Ok(BatchStream {` is at engine/src/stream.rs:1398.
- The lease in this test is recycled: generation 3 and reused (pool rule: engine/src/pool.rs:418-421, engine/src/pool.rs:548-550; idle pop at engine/src/pool.rs:375-378). The test asserts both facts at engine/tests/connection_reuse.rs:174-178, and neither failed in the filed log.
- So when `stream_with_cancel` returns `Ok`, the slot holds the handle. After that, the only thing on this path that can empty it is engine/src/stream.rs:1273, on the producer thread.
- The comment at engine/src/stream.rs:1227-1228 says the same place: the token is bound to the connection on the caller's thread, before the producer starts.

## The order of events the code fixes

Caller (test) thread, in program order:
1. engine/src/stream.rs:1166-1209: checks before any lease (timing refusal, `check_source_unchanged` at engine/src/stream.rs:1179, the viewport-CRS check, `build_sql` at engine/src/stream.rs:1209). None of these reads the cancel flag.
2. engine/src/dataset.rs:1941: the lease is acquired.
3. engine/src/dataset.rs:1942, engine/src/cancel.rs:233-251: the bind. It reads the flag at engine/src/cancel.rs:246 and interrupts at engine/src/cancel.rs:247 if the flag is set, then stores the handle at engine/src/cancel.rs:249.
4. engine/src/stream.rs:1222-1226: the `ConnectionFacts` are copied out of the lease. `connection_facts()` later returns this copy (engine/src/stream.rs:880-882), so it never reads the producer's state.
5. engine/src/stream.rs:1237: the channel is created, bounded at `MAX_QUEUED_BATCHES`.
6. engine/src/stream.rs:1251-1253: the producer thread is spawned.
7. engine/src/stream.rs:1398: return.
8. Back in the test: engine/tests/connection_reuse.rs:173 (facts copy), :174 and :175-178 (assertions over the copy), :179-183 (`is_bound()`), :185 (`cancel.cancel()`), :188 (`next_into`, which blocks on `recv`, engine/src/stream.rs:782-797).

Producer thread, in program order (engine/src/stream.rs:1254-1268 calls `produce`, engine/src/stream.rs:1756):
1. engine/src/stream.rs:1775: trace mark.
2. engine/src/stream.rs:1780-1783: flag check. If the flag is set, it returns `Cancelled` before prepare.
3. engine/src/stream.rs:1785-1787: prepare.
4. engine/src/stream.rs:1823-1845: `execute_guarded` around `stream_arrow`. The guard's steps are at engine/src/cancel.rs:182 (`in_execute` set), engine/src/cancel.rs:185 (flag check), engine/src/cancel.rs:188 (run), engine/src/cancel.rs:190 (`in_execute` cleared) and engine/src/cancel.rs:193 (flag re-check).
5. engine/src/stream.rs:1885-1898: the loop. The flag is checked at the top (engine/src/stream.rs:1886), and the loop breaks when `arrow.next()` yields `None` (engine/src/stream.rs:1898).
6. engine/src/stream.rs:2120-2135: a final flush only if rows are pending, then `Ok(())`.
7. engine/src/stream.rs:1273: `thread_cancel.detach();`
8. engine/src/stream.rs:1292-1295: the lease's fate (`release_healthy`, engine/src/pool.rs:560-586, or drop).
9. engine/src/stream.rs:1330-1340: the post-check.
10. engine/src/stream.rs:1343-1362: the terminal. On `Ok` with no change, the terminal is the drop of `tx` at the end of the closure.

What makes one step wait for another:
- Spawning at engine/src/stream.rs:1251 orders all of the caller's steps 1-6 before the producer's first step. This is the standard library's thread-spawn ordering, not repository code.
- The token's slot mutex (engine/src/cancel.rs:54) makes `attach`, `detach`, `is_bound` and the interrupt in `cancel_inner` (engine/src/cancel.rs:125-133) mutually exclusive. It does not fix which of them runs first.
- The flag (engine/src/cancel.rs:44) and `in_execute` (engine/src/cancel.rs:57) are `SeqCst` atomics (engine/src/cancel.rs:121, :140, :182, :185, :193).
- The producer blocks on the consumer only at a batch send: `tx.send(Ok(Item {` at engine/src/stream.rs:2565, inside `flush` (engine/src/stream.rs:2457), on a channel bounded at engine/src/stream.rs:1237.

Where nothing orders two steps:
- Between the test's steps after the return (engine/tests/connection_reuse.rs:173-185) and every producer step 1-10, nothing fixes an order.
- In particular, nothing orders the test's `is_bound()` read (engine/tests/connection_reuse.rs:180) against the producer's `detach` (engine/src/stream.rs:1273). The test holds no lock across that read and waits on no channel before it. The producer, on this query, waits on nothing the test holds (see question 3).

## Question 2: whether a cancel in any window before the bind can still let a batch through

The bind is the slot store at engine/src/cancel.rs:249, reached from engine/src/dataset.rs:1942.

In every window, a batch reaches the consumer only through `tx.send(Ok(Item {` at engine/src/stream.rs:2565, inside `flush`. `flush` is called only from engine/src/stream.rs:2017, :2066, :2102 and :2122. Each of those is reached only after the producer's flag check at engine/src/stream.rs:1780 and the guard at engine/src/stream.rs:1823-1845. The consumer side (`next_into`, engine/src/stream.rs:782-797) does not read the token: it delivers whatever is received.

The windows before the bind, each named by its two ends:

- W1: engine/src/stream.rs:906 (entry) to engine/src/dataset.rs:1941 (lease acquired). The code in between (engine/src/stream.rs:1166-1221) reads no cancel flag.
  - A cancel here sets the flag (engine/src/cancel.rs:121), finds the slot empty and interrupts nothing (engine/src/cancel.rs:125-133).
  - It spawns no re-interrupter, because no guard is open on this token (engine/src/cancel.rs:140).
  - What stops a batch: `attach` reads the set flag at engine/src/cancel.rs:246 and interrupts the idle connection at engine/src/cancel.rs:247. That interrupt is not latched (engine/src/cancel.rs:217-219; pinned by `an_interrupt_on_an_idle_connection_is_not_latched`, engine/src/cancel.rs:500-516).
  - Then the producer's check at engine/src/stream.rs:1780-1783 returns `Cancelled` before prepare. That check is ordered after the bind by the spawn, so `flush` is never reached.
  - Condition: the flag store must be ordered before the read at engine/src/cancel.rs:246. In W1 the canceller's own slot lock at engine/src/cancel.rs:125-129 comes after its flag store. If that lock is taken before `attach`'s lock, the mutex orders the store before the read.
- W2: engine/src/dataset.rs:1941 to engine/src/cancel.rs:234-238 (`attach` takes the slot lock). Same as W1.
- W3: engine/src/cancel.rs:238 (lock held) to engine/src/cancel.rs:246 (flag read).
  - A canceller's flag store (engine/src/cancel.rs:121) is not under the lock. Its interrupt waits on the lock at engine/src/cancel.rs:125-129 until `attach` returns (engine/src/cancel.rs:250-251), then finds the handle and interrupts the idle connection.
  - If the store is ordered before the read at engine/src/cancel.rs:246, the outcome is as in W1. If not, the case is W4.
- W4: engine/src/cancel.rs:246 (flag read, unset) to engine/src/cancel.rs:249 (store).
  - `attach` does not interrupt. The canceller's interrupt runs after `attach` releases the lock, on a now-bound handle.
  - The code does not order this flag store before any particular producer read. No lock or wait links the canceller to the producer, only the `SeqCst` atomics.
  - So this cancel has the same coverage as a cancel arriving just after the bind. It is caught by the first producer read that observes it: engine/src/stream.rs:1780, the guard at engine/src/cancel.rs:185 or engine/src/cancel.rs:193, the loop at engine/src/stream.rs:1886 or engine/src/stream.rs:1976, or flush's check at engine/src/stream.rs:2541.
  - The guard's step 1 then step 2 (engine/src/cancel.rs:182, then :185) and the canceller's store then load (engine/src/cancel.rs:121, then :140) mean that at least one of two things happens: the guard sees the flag, or the canceller sees `in_execute` and starts the re-interrupter (engine/src/cancel.rs:140-164).
  - Not before the bind but adjacent, a fact for completeness: inside `flush`, the flag check at engine/src/stream.rs:2541 and the send at engine/src/stream.rs:2565 are two separate steps. A flag first observed after engine/src/stream.rs:2541 lets that one batch be sent. The counter `batches_after_cancel` (engine/src/stream.rs:2547) counts only batches caught at the check and not sent.

The comment on `lease_for_stream` reads "so there is no window in which a cancel could arrive before anything is interruptible" (engine/src/dataset.rs:1931). Facts at main: in W1 and W2 there is no handle in the slot, and the code that stops a cancel landing there is the flag check at engine/src/stream.rs:1780, not an interrupt.

In this test, on any interleaving: the query matches no row (engine/tests/connection_reuse.rs:83-104). The row loop runs zero times (engine/src/stream.rs:1975). Every `flush` call needs pending rows (engine/src/stream.rs:2014, :2063 via `cut_reason`, :2098, :2120). So no batch is generated and none is sent, whatever the cancel's timing. The test says so itself at engine/tests/connection_reuse.rs:189-190.

## Question 3: whether the test's `is_bound()` read can run before the bind

Answer: no. The read at engine/tests/connection_reuse.rs:180 runs on the same thread as the bind, after `stream_with_cancel` has returned (engine/tests/connection_reuse.rs:170-172). The bind (engine/src/dataset.rs:1942, engine/src/cancel.rs:249) comes before that return (engine/src/stream.rs:1221 is before engine/src/stream.rs:1398) in program order.

An interleaving in which the assertion at line 179 fails does exist. In it, the read runs after the producer's `detach`, not before the bind.
- Test lines that decide the order: engine/tests/connection_reuse.rs:170-172 (return), :173-178 (reads of the facts copy; no wait on the producer), :179-183 (the read).
- Producer lines that decide the order: engine/src/stream.rs:1775, :1780, :1785-1787, :1823-1845, :1885-1898 (a `None` from `arrow.next()` breaks the loop), :2120 (nothing pending, so no flush), :2135 (`Ok(())`), then engine/src/stream.rs:1273 (`thread_cancel.detach();`).
- On this query the producer never reaches `tx.send` before the detach. The only `Ok` send is at engine/src/stream.rs:2565, inside `flush`, and `flush` is not called (question 2). The `Err` sends at engine/src/stream.rs:1349 and :1360 come after the detach. So the channel bound at engine/src/stream.rs:1237 does not hold the producer back, and the producer reaches engine/src/stream.rs:1273 without waiting on anything the test does.
- The interleaving: the test thread returns from engine/tests/connection_reuse.rs:170-172; the producer runs engine/src/stream.rs:1775 through engine/src/stream.rs:2135 and then engine/src/stream.rs:1273; the test thread then reads at engine/tests/connection_reuse.rs:180, sees an empty slot (engine/src/cancel.rs:271-277), and the assertion at line 179 fails. Nothing in the code excludes it.
- How long the producer takes from spawn to engine/src/stream.rs:1273 on this fixture (`big_spec`, engine/tests/connection_reuse.rs:56-62) is DuckDB's execution of a query matching nothing. No record I read measures it; that pointer is missing.
- The other order: the read at engine/tests/connection_reuse.rs:180 comes before engine/src/stream.rs:1273, so line 179 passes. The terminal then depends on whether `cancel.cancel()` at engine/tests/connection_reuse.rs:185 lands before `produce` returns.
  - If it does not, the stream ends with `None` and the test panics at engine/tests/connection_reuse.rs:198-201, the message that calls the trial inconclusive.
  - So the test passes only when the producer is still inside `produce` at engine/tests/connection_reuse.rs:185. That is the same race, which the test names for its terminal (engine/tests/connection_reuse.rs:85-90, :189-190, :198-201) and does not name for its `is_bound()` read.

## Whether the filed log is consistent with each reading

Filed log: state/consults/2026-10-16-pr222-ci-run-38910535607-attempt-1-failed-steps.txt. Byte-copied substrings, with their line numbers in that file:
- line 902: "panicked at engine/tests/connection_reuse.rs:179:5:"
- line 903: "a recycled connection's interrupt handle must reach the token, or cancellation degrades to the between-batches flag this engine's whole premise rejects"
- line 884: "running 12 tests"
- line 910: "test result: FAILED. 11 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 7.34s"
- line 437: "Run cargo test --workspace --locked"

Each reading against the log:
- Reading (a), the read ran before the bind. Excluded by the code (question 3), not by the log. The log is consistent with the bind having succeeded: the failure is at line 179 (log line 902), not at the `.expect("stream")` on line 172 that a failed `attach` would reach. It is also consistent with the lease being recycled at generation 3: lines 174 and 175-178 did not fail.
- Reading (b), the producer reached engine/src/stream.rs:1273 before the read at engine/tests/connection_reuse.rs:180.
  - Consistent: the panic is at 179:5 with the assertion's own message (log lines 902-903).
  - On this path, engine/src/stream.rs:1273 is the only place that empties this token's slot after an `Ok` return. The other, engine/src/stream.rs:1394, returns `Err`.
  - The log carries no producer-side timing, so it neither confirms the timing nor excludes it.
  - Log line 884 and the completion order on log lines 885-896 show the file's 12 tests completing interleaved. Log line 437 shows the command carries no `--test-threads`. Running a test binary's tests concurrently by default is libtest's behaviour, not repository code.
- Reading (c), bound at return and never unbound, yet read as unbound. Not possible in the code: `is_bound` reads the same slot under the same mutex that `attach` writes (engine/src/cancel.rs:249, engine/src/cancel.rs:271-277).
- The push run of the same commit passed the same job (PLAN.yaml:5392). Its log is not filed; that pointer is missing.

## Missing pointers

- No measurement of the producer's time from spawn (engine/src/stream.rs:1251) to detach (engine/src/stream.rs:1273) for the matches-nothing query on `big_spec`.
- No filed log of push run 38910527939.
- I did not read the fixture writer, so this read establishes nothing about how many row groups `big_spec` produces or whether DuckDB skips them for this viewport.

## Files read

- engine/README.md: 526-561
- kernel/README.md: 356-399
- state/directives/2026-10-17-placements-item-44-governance-clause-composition-readme-item-41-unknown-attempt.md: 1-20
- PLAN.yaml: 5377-5407
- state/consults/2026-10-16-pr222-ci-run-38910535607-attempt-1-failed-steps.txt: 1-238, 880-1004; search hits at 437, 511-880 (test-result lines), 914
- engine/tests/connection_reuse.rs: 1-621
- engine/src/cancel.rs: 1-518
- engine/src/stream.rs: 655-824, 860-1559, 1740-2259, 2470-2579; searches for `is_cancelled()`, `tx.send(`, `.detach()`, `fn flush`
- engine/src/dataset.rs: 1910-1945; searches for function definitions and `attach`/`detach` call sites
- engine/src/pool.rs: 355-614
- engine/src/index.rs, engine/src/layout.rs, engine/src/rowgroup.rs: search hits for `attach`/`detach` only
