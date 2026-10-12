# Flake hunt, run 1 — 2026-10-10

Provenance. An independent agent on the Claude Platform (Claude Opus 5.5, high effort) cloned the public repository into its own sandbox, built the Rust workspace there and ran the suite repeatedly. It changed nothing outside its sandbox; its one experiment edited its sandbox copy only and was reverted. The human started the run; the advisor fetched this text from the session's final message (session sesn_01PEuVnBEnceNujnVAUcjzTA). Run figures from the session record: about 2 h 53 min active, US$ 3.88. The agent's evidence files (both failing logs, the experiment's diff and logs, the run tables and the loop scripts) are beside this file in the folder FLAKE-HUNT-RUN-1-2026-10-10-logs, with their sha256 in SHA256SUMS. The text below the rule is the agent's report, unedited. The advisor's check of the code is in the advisor's reply to the human, not in this file.

---

I ran 8 ordinary and 7 two-core workspace runs before the two-hour limit, short of the 10 + 10 you asked for. One test failed: `cancelling_mid_stream_stops_production_promptly` in the engine's `slice` test binary, at commit `116deb53293bb62ebbaa49ee795e3b1f0093745d` (head of main). A 15/20 vs 0/20 sleep experiment points the race at the product code, not the test's setup.

**Commit:** `116deb53293bb62ebbaa49ee795e3b1f0093745d`.

**Machine:** 4 cores, 15 GiB RAM, no swap, Ubuntu 24.04.5 LTS (kernel 6.18.44, x86_64), rustc 1.97.0 (2d8144b78 2026-07-07).

**Build:** the cold `cargo build --workspace --tests --locked` took 1005 s (16 m 44 s) in this sandbox and succeeded.

**Run durations in this sandbox:** an ordinary run took 403–438 s and a two-core run 464–484 s. That's why 10 + 10 didn't fit, so I alternated the two conditions to keep their counts even.

**Runs done:**

| Condition | Runs | Failed |
|---|---|---|
| Ordinary `cargo test --workspace --locked` | 8 | 0 |
| Two-core (`taskset -c 0,1`, same command) | 7 | 1 (`twocore-07`) |
| `slice` binary alone, all cores | 8 | 0 |
| `slice` binary alone, two cores | 7 | 1 (`slicebin-alone-2core-06`) |
| Background CPU load | not run | – |

- **`twocore-07` was partial.** `cargo test` stops at the first failing binary, so 47 of the 102 result blocks ran; the binaries after `slice` didn't run in that run.
- **Excluded runs:** an ordinary run 09 that I aborted to start the solo loop, and one solo two-core run cut off mid-run.
- **Every complete run** had the same totals: 890 passed, 73 ignored.

## Failing tests

| Binary | Test | Count | Condition | Log |
|---|---|---|---|---|
| engine `tests/slice.rs` (`slice-f2f9711d36270b38`) | `cancelling_mid_stream_stops_production_promptly` | 1 of 7 workspace runs; 1 of 7 solo runs | two cores, both times | `twocore-07.log`, `slicebin-alone-2core-06.log` |

It failed 0 times in 8 ordinary workspace runs and 0 times in 8 solo all-core runs.

## engine `slice` / `cancelling_mid_stream_stops_production_promptly`

**Failure (both logs show the same thing):**
```
test cancelling_mid_stream_stops_production_promptly ... FAILED
thread 'cancelling_mid_stream_stops_production_promptly' panicked at engine/tests/slice.rs:809:50:
cancel_observed was stamped
```
The trace had the cancel request in it, but no `producer_cancelled` event. The test failed before reaching its timing assertion.

**The suspected interleaving (read from code):**
1. The test receives the first batch and calls `cancel.cancel()`, which records `cancellation_requested`.
2. Meanwhile the producer thread is in `flush()` (`engine/src/stream.rs`). It has already passed the per-row cancel check at line 1975 for the batch's last row, and is building the batch.
3. The cancel lands during that build. The check at lines 2540–2544 sees it, increments `batches_after_cancel` and returns `Cancelled` **without recording `producer_cancelled`**.
4. The consumer gets `Cancelled` and stops, so the trace never gets that event and the test panics at :809.

Every other `Cancelled` exit after the first batch (lines 1830, 1839, 1886, 1919, 1986) records the event; this one doesn't.

**The experiment that discriminates it (observed).** I ran the `slice` binary alone on two cores, 20 runs per phase, in the sandbox clone only:

| Phase | Change | Failed |
|---|---|---|
| A | test prints diagnostics when the event is missing | 0 / 20 |
| B | A, plus a 20 ms sleep in `flush()` just **before** the check at 2540 (only while a trace runs) | 15 / 20 |
| C (control) | the same sleep just **after** that check | 0 / 20 |

- **Same assertion:** all 15 phase-B failures panicked at the same assertion.
- **Same diagnostics:** every one printed `dropped=0 batches_generated=2 batches_after_cancel=1`.
- **`dropped=0`** rules out the other candidate, the shared trace buffer filling with other tests' events.
- **`batches_after_cancel=1`** shows the producer left through 2540–2544, the only place that counter goes up.

The changes are reverted and rebuilt, and `git status` is clean.

**Limit of the evidence:** the two original failures had no diagnostics. That they took this path is inferred from the identical message and line, not observed directly.

**Product or test:** the race is in the product. The cancellation itself works: the stream stops, with at most one batch after the cancel. What's missing is one trace event on that exit, and it's the event the test's 100 ms cancellation-budget assertion is measured from.

**From code, not observed:** four kernel tests also read `producer_cancelled`: `trace_spans`, `first_batch_factorial`, `skp_filter_cancellation` and `skp_admission`. I didn't check whether they hit the same gap.

**PLAN.yaml:** node `slice-traced-test-cross-stamping` (proposed) already tracks this test. It describes a different mechanism (other tests' events landing in this test's trace) and says "not observed failing". What I observed is the missing event above, with `dropped=0`.

## What I could not do
- **Run counts:** 8 ordinary and 7 two-core runs instead of 10 + 10, because of the run lengths above.
- **Background CPU load:** not run.
- **Solo loop:** short (15 completed runs), because I stopped it to run the experiment.
- **Unpatched failures with diagnostics:** none were captured; phase A's 20 runs didn't fail.
- **Missed failures:** a failure in a binary that runs after `slice` would have gone unseen in `twocore-07`.
- **Other tests:** zero failures elsewhere in these counts doesn't show they're free of races.

Everything is in `/mnt/session/outputs/flake-hunt-logs/`; `README.md` there describes each file, including both failing logs, the experiment diff and its logs, and the loop scripts.

