*Custodian's filing note (2026-10-04): timing-assertions-under-contention worker report 1, under the tag node:timing-assertions-under-contention@g1. A worker-high wrote Parts A1 and A2 in the worktree `C:/dev/wt/tauc`, on branch `cut/timing-assertions-under-contention`. It arrived as a message, and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. The run lasted 23:24:48Z to 23:44:51Z, with Read 6, Bash 23, Monitor 1 and Write 2, plus the hand-back. Its two Writes were commit messages, to the session scratchpad; it made its code edits through its shell. The custodian read the diff origin/main...ede20044: `kernel/tests/end_to_end.rs` (35 insertions, 13 deletions) and `kernel/README.md` (2 lines). It matches the form's §2 Parts A1 and A2, and both commits carry the Sonnet 5.5 trailer. After the run, no cargo or rustc process was found running. Not a ruling.*

---
Part A1 and Part A2 are written, committed and pushed. Both h2 tests pass, and each mutation failed its named test at the assertion §4 names.

**Commits (full hashes)**
- Code: 5bb2b10439b0d3b3477f3cd3f659842f14fcfd62, `kernel/tests/end_to_end.rs` only.
- Index: ede20044ba29918fe1f2433fdfcee98e3abba4af, `kernel/README.md` only.
- Pushed head: ede20044ba29918fe1f2433fdfcee98e3abba4af, equal to origin/cut/timing-assertions-under-contention. I did not open a PR.
- Start state matched: HEAD acb3d035dd83b9785c9f949150257d5c5e9ec54b and an empty porcelain.

**Changes by test**
- `h2_a_cancel_before_the_first_batch_still_stops_the_query` (A1):
  - The 100 ms assertion is removed.
  - Kept: zero batches, TERM_CANCELLED, observed_at present.
  - Added: `observed_at >= sent_at` and a 5 s liveness bound on client pre-send to terminal. The liveness message says it is not the docs/08 budget.
  - Added the `h2_a REPORT:` line naming client pre-send to adapter receipt, "not cancel_observed".
  - The comment is reworded and keeps its first sentence.
  - It carries a `RECORDED MUTATION:` doc and a `// Mutation: see …` line.
- `h2_cancellation_is_observed_by_the_producer_inside_the_budget` (A2):
  - The 100 ms assertion is removed.
  - Kept: the 5 s to_terminal bound and the batches_after_cancel assertion.
  - Added: the same ordering assertion and the `h2 REPORT:` line.
  - The function name is kept, with a one-line comment that it predates the re-aim (round 52, item 3).
  - It carries the same two mutation lines.
- Nothing is changed under kernel/src, engine/src, protocol or frontends, and `engine/tests/slice.rs` is untouched.
- The mutation docs in `end_to_end.rs` follow the `source_watch_ordering.rs` convention, because that file had none of its own.

**Runs (after the code commit)**
- Whole binary: `test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 4.93s`. I re-ran it after the mutations were reverted: ok, 10 passed, 4.63s.
- `h2_a` alone: ok, 1 passed. It printed `h2_a REPORT: client pre-send -> adapter receipt (observed_at) = 366.9µs; not cancel_observed`.
- `h2` alone: ok, 1 passed. It printed `h2 REPORT: client pre-send -> adapter receipt (observed_at) = 102.6µs; not cancel_observed`.
- Each is a single sample, not a measurement.

**Mutations**
Each was applied to `protocol/data-plane/src/adapter_ws.rs`, run on the named test alone, and reverted. The tree was clean after each revert, and the commit observed at was 5bb2b104. These are real applications, not `verify-mutation` runs.
- **M-A1a on `h2_a`:** failed by name at `kernel\tests\end_to_end.rs:465:5`, the liveness assertion. Text: `client pre-send -> terminal took 6.0161099s: a liveness bound, not the docs/08 budget`. The result line was `FAILED. 0 passed; 1 failed`.
- **M-A1b on `h2_a`:** failed by name at `end_to_end.rs:473:5`, the ordering assertion. Text: `observed_at precedes the cancel this test sent: the observation cannot come first`.
- **M-A1b on `h2` (A2), observed separately:** failed by name at `end_to_end.rs:417:5` with the same ordering text.

**Owner's index (`kernel/README.md`)**
- The preregistrations bullet now lists `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`.
- Last verified at is now 5bb2b104.
- I checked every file and test pointer with a script before the README commit: 70 checked, 0 unresolved. That commit changes only the README, so the check holds at 5bb2b104.

**§7 count**
- Command: `git diff --numstat origin/main...HEAD -- '*.rs' '*.ts' '*.tsx' '*.js' '*.mjs' '*.toml'`.
- Result: 35 insertions and 13 deletions in `end_to_end.rs`, 48 lines in total, with no overrun.
- By hunk, A1 is 28 against its ceiling of 40, and A2 is 20 against its ceiling of 30. That split is my own attribution.
- Non-generated files touched in this work: `end_to_end.rs` and `kernel/README.md`. No change to the form, PLAN or the consult.

**Pre-gate (rc)**
- `verify-cites.mjs`: 0. It advised 34 loose references, none in files I touched.
- `verify-quotes.mjs --show-cites` on `kernel/tests/end_to_end.rs` and `kernel/README.md`: 0.
- `verify-test-claims.mjs`: 0.
- `cargo fmt -p spatial-kernel --check`: 0.

**Seam read before writing**
- `protocol/data-plane/src/adapter_ws.rs:130-137`: the reader's `Control::Cancel` arm stamps `state.observe_cancel(Instant::now())` before `source_cancel.cancel()`.
- `protocol/data-plane/src/transport.rs:150-152`: the observation doc.
- `protocol/data-plane/src/transport.rs:186-190`: `observe_cancel`, where the first stamp wins.
- All three are cited in the code commit message.

**Four failure classes**
1. Cross-module interface: the tests use the adapter's real stamp and `observed_at()` as read above. No new code crosses a module boundary.
2. Completion claims: each claim above has a run or mutation result behind it, recorded with its commit.
3. User-facing messages: the assertion and report texts describe what the code does at this commit, and each names its pair.
4. Assertions reached: both mutation families failed at the intended assertion, not at setup.

**Off-scope, not acted on**
- `h2` still carries the `h2` function name and the `docs/07` cite, per the form.
- `verify-quotes --show-cites` reported 0 checked for the files I changed.
- Nothing else.

**Final state**
- `git status --porcelain` is empty.
- No cargo, rustc or test process of mine is still running.
- The first build took roughly 25 to 30 minutes with `CARGO_TARGET_DIR=D:/wt-targets/tauc`.
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override and no context handoff.
