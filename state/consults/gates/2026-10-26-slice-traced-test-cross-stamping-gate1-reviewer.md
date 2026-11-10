Reviewed: PR #260 at 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778 (base 1fd4923c), gate 1, reviewer
Verdict: PASS

cut/slice-traced-test-cross-stamping @ 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778

I found nothing in Correctness, Evidence or Documentation. There are two notes at the end that need no action.

## Findings

**Correctness:** none.

**Evidence:** none. Each of M-1 to M-3, applied as its recorded line words it on a fresh export of C, failed exactly its predicted set with the recorded message.

**Documentation:** none to fix. The two disclosures:
- **M-2's scaffolding.** I applied M-2 without the `#[allow(unreachable_code)]`, with the guard bound to a local. It compiled with two warnings only: `unreachable expression` and `unused variable: g`. So the allow was not needed to compile. The worker's report says the guard-local and allow scaffolding "was only needed to compile the mutation"; that holds for the local, not for the allow. The report is a record, so I offer no replacement words. The allow changes nothing the run observes.
  - Binding the guard to a local is what "after the read guard is taken" means in a function that ends in a tail expression. M-1 needs the same binding.
  - The recorded M-2 line at engine/tests/slice.rs:132-145 therefore describes the observed mutation faithfully. No change is needed.
- **`quiesce`'s message.** The text "this test's dataset still held a lease {WINDOW:?} after its stream was dropped, so its producer could still stamp the traced test's trace" (engine/tests/slice.rs:180-181) names the dataset's state, and `assert_eq!` prints left and right. On a real miss the loop has run the whole 10 s window, so "10s" is true. Under M-3 it prints "10s" after a shorter wait (the run finished in 6.89 s), but only the mutation reaches that. "its producer could still stamp" is hedged. I accept the worker's wording; it is not the human's wording and it is not a red line.

## Checks

**1. The diff**
- `git diff --numstat 1fd4923c...HEAD` (rc=0) gives `92	0	engine/tests/slice.rs`: one file, under the 100 budget.
- My one-off script compared the base and head copies of the file (rc=0, FAILS 0):
  - No CR in either. All 1077 base lines are kept in order, and 92 lines are inserted.
  - The 22 tests parsed. `let _serial = exclusive();` is the first statement of `cancelling_mid_stream_stops_production_promptly`. `let _serial = shared();` is the first statement of exactly the ten tests the Tests+mutation line names. The other 11 tests take no guard.
  - `quiesce(&ds);` is the last statement of exactly the five it names. It comes after `drop(s);` (lines 601 and 1003) in `the_payload…` and `a_paused_consumer…`, where `s` is still live; in the other three, after the temporary or the block.
  - In all eleven, `let _wd` comes right after the guard.
  - Placement: `impl Drop for Watchdog` (105), then W1 (111), `static TRACE_LOCK` (146), `exclusive` (148), `shared` (152), `quiesce` (171), `fn small` (185).
  - 74 inserted lines are inside that helper block. The 18 outside it are only guard, quiesce or drop lines (11 + 5 + 2).
  - No existing assertion, message, bound, test name, fixture, constant or watchdog changed.
- No other open PR touches `engine/tests/slice.rs` or `protocol/` (`gh pr list` over files, rc=0: #252, #249, #244 and #241 touch neither).

**2. The words** (same script, against the form as it is at 1fd4923c; the form is identical on main fa4c8650 by `cmp`, sha256 5ea2247d0eb0…)
- The form gives W1 as 18 lines and W2 as 7, each ending in its placeholder lines (2 and 1).
- The 16 fixed lines of W1 and the 6 of W2 match the head byte for byte, with the leading `> ` dropped. Every line is a doc line of at most 100 columns.
- The placeholders became M-1 and M-2 lines in W1 and an M-3 line in W2. Each names the 40-hex commit 8a79b7f06cee3068314ea583792f56c98049b078 (three occurrences).
- M-1's line names exactly the traced test, M-2's exactly the ten, and M-3's exactly the five.
- Each recorded line matches what the worker ran and what I observed (check 4).

**3. The code's claims**
- **Guard and recovery.** `_serial` is declared first, a named binding rather than `_`, so it drops last. Both guards recover from poisoning with `unwrap_or_else(|e| e.into_inner())` (slice.rs:148-154). The traced test's `TraceGuard` is dropped at :886, or unwinds before the lock on a panic. The watchdog comes after the guard.
- **`quiesce`.** It reads `active_leases()`, which sums the counts under `state.lock()` (engine/src/pool.rs:494-497).
- **Where the lease is taken.** The lease is taken on the caller's thread before the spawn (engine/src/stream.rs:1234, then the spawn at :1265). So a lease count of 0 cannot be read before a producer exists.
- **No stamp after the lease is released.** Every `PRODUCER_CANCELLED` site (stream.rs:1795, 1845, 1854, 1901, 1934, 2001, 2558) is in `produce` or `flush`. Both return before the lease is decided at :1306-1309.
- **The only `Err` frames.** They are sent at :1363 and :1374, after the lease is decided. `next_into` blocks in `recv()` (:795-810). So `cancelling_before_the_first_batch…` can only end its body after its producer has left `produce`.
- **Who stamps `cancellation_requested`.** Only `cancel_inner(true)` (cancel.rs:120-124). A drop goes through `cancel_for_drop` (stream.rs:906). The other `.cancel()` callers in engine/src are all in `#[cfg(test)]` modules (index.rs from 764, pin.rs from 136, stream.rs from 2680). In slice.rs the only callers are :807 and :877.
- **Where `mark(` is called.** Only cancel.rs, stream.rs and trace.rs call it, so `Dataset::open` stamps nothing.
- **The unguarded streams are refused before a lease.** `a_viewport_in_another_crs…` is refused at stream.rs:1212-1219. The first stream of `a_viewport_without_a_covering…` is refused in `build_sql` (:1222). Both come before the lease at :1234.
- I find no test that can stamp either name left outside the lock. Note 1's table re-derives.

**4. The mutations, again**
- **Export.** `git archive` of 8a79b7f0 went into a new D:/wt-targets/sc-g1r-export, built with the export's own new D:/wt-targets/sc-g1r-target, never used for the worktree. Its slice.rs sha256 is ac5f6cefb1c3d38e765d7e17722429c7757ba8d99f5fb13fda07ece6ca752238, equal to `git show 8a79b7f0:engine/tests/slice.rs`.
- **Unmutated** (cold build, `Finished … in 15m 16s`, rc=0): `test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 6.79s`.
- **M-1**: `let g = TRACE_LOCK.write()…; std::mem::forget(trace::start(trace::TraceKey::default())); g`, run with `-- --exact cancelling_mid_stream_stops_production_promptly`. rc=101: `test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 21 filtered out`. The only failure is `cancelling_mid_stream_stops_production_promptly`, which panicked at slice.rs:845:6 (the start's `expect`) with `no other trace is running`. As predicted.
- **M-2**: `let g = TRACE_LOCK.read()…; panic!("M-2: shared() reached"); g`, with no allow, over the whole binary. rc=101: `test result: FAILED. 12 passed; 10 failed`.
  - The ten failing names are exactly the ten shared tests, each panicking at slice.rs:137:5 with `M-2: shared() reached` (10 panics).
  - The 12 that passed are the eight admission tests, `a_viewport_in_another_crs…`, h6, the arrow-version test and `cancelling_mid_stream_stops_production_promptly`. As predicted.
- **M-3**: the left side became `ds.connections().active_leases() + 1`, over the whole binary. rc=101: `test result: FAILED. 17 passed; 5 failed`.
  - The failures are exactly the five quiescing tests, each at slice.rs:152:5 with quiesce's message, `left: 1`, `right: 0`. As predicted.
- **Restore.** After each mutation the file was restored and its sha256 shown as ac5f6cef… each time; after the last, `cmp` against C gave rc=0.
- These are observations. No `verify-mutation` run was used.

**5. The head** (PR worktree, CARGO_TARGET_DIR=D:/wt-targets/sc)
- `cargo test -p spatial-engine --locked --test slice` in a shared hold, rc=0: `test result: ok. 22 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 26.51s`. The time was taken beside my own concurrent cold build, so it is not a timing.
- `cargo fmt --all -- --check`: rc=0, no output.
- I also re-ran the PR body's clippy claim: `cargo clippy -p spatial-engine --tests --locked`, rc=0. It printed 39 `warning` lines, and none names slice.rs.

**6. Verify scripts and CI** (PR worktree)
- `verify.mjs --offline`: rc=0, "verify:plan PASS".
- `verify-cites.mjs`: rc=0, "verify:cites PASS … (101 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc=0, "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, …"
- `verify-test-claims.mjs`: rc=0, "verify:test-claims PASS — all 669 claimed test(s) across 205 file(s) …"
- `gh pr checks 260`: rc=0, all 18 checks pass. By `gh run view`, all twelve runs have headSha 6859cc1b852ef0f38c8a632b5fd759d4e4fbd778 and conclusion success:
  - 40256844712, 40256844678, 40256844720, 40256844709, 40256844994
  - 40257357943, 40257358128, 40257358101, 40257357980, 40257358027, 40257358100, 40257358090
- In run 40257357943's log, the slice binary gives `test result: ok. 22 passed; 0 failed; …` on windows-latest (4.23s) and on ubuntu-24.04 (3.34s).

**7. The PR body**
- Each figure and claim matches the head and my runs: 92 added and 0 removed of 100; 22 pass at C and at the head; M-1, M-2 (ten fail, 12 pass) and M-3 (the five) as observed; the reverts; fmt, clippy and the four verify scripts green; rule (00).
- The disclosures are dealt with under Documentation above.

## Hold lines (SpatialIDE only; each line is cut after its shell id, and the omitted tail lists other holders' shells)
- **Export cold build and unmutated run:** `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:28768 …`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:28768 affinity=FF (cores 0-7)`.
- **Head test:** shell bash.exe:49108, held and released.
- **Head clippy:** bash.exe:35604, held and released.
- **M-1:** bash.exe:49948, held and released.
- **M-2:** bash.exe:5932, held and released.
- **M-3:** bash.exe:3832, held and released.
- All six were shared holds with CARGO_BUILD_JOBS=8 (and RUST_TEST_THREADS=8 for the test runs). No exit code from 96 to 99, no exclusive hold.

## Final state
- The PR worktree's `git status --porcelain` is empty, and its HEAD is still 6859cc1b.
- D:/wt-targets/sc-g1r-export and D:/wt-targets/sc-g1r-target are removed (`ls` rc=2, both missing). The scratch tar is deleted.
- `tasklist` shows no cargo, rustc, clippy or slice process.
- I made no commit, push or PR action.

## Notes (no action)
- A shared test that panics before its `quiesce` releases its read guard with its producer still live. Unwinding drops the stream (`cancel_for_drop`) and then `_serial`. The traced test could then read a foreign stamp, but only in a run that has already failed. Note 2's list of what the lock does not cover leaves this case out; I raise no finding because W1 claims nothing about failing runs.
- The read guard does not include waiting for the lock in the watchdog's bound. A waiter is still bounded, by each holder's own 120 s watchdog, as note 2 says.
