Reviewed: PR #250 at 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d, gate 1, reviewer
Verdict: PASS WITH NOTES (no Correctness or Evidence finding; one Documentation finding, to fix before the merge with no re-gate)

Branch reviewed: cut/publish-sort-window-cancel-not-exercised-on-ci @ 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d. Main: 462c49e58badf28760155e57f2ab95d71ea1291d.

## Correctness
None.

## Evidence
None.

## Documentation (must fix before the merge; no re-gate)

**D1. The comment's claim about the toolchain does not name the toolchain.** `kernel/tests/publish_cancellation.rs:256-257` at the head reads "That is observed behaviour of the toolchain, not a documented guarantee". Section A's rewritten-comment bullet says the line's visibility "rests on the observed capture behaviour at the recorded toolchain version", and round 15 (c) requires a statement about a tool's behaviour to name the tool's commit. The comment names no version and no commit. The behaviour itself is true. These are the worker's words (a doc comment), not the human's, so the worker applies the replacement with no re-gate and the PR body lists it.

Replacement for lines 256-257, which keeps `// ` and stays under 100 columns:
```
    // behaviour observed at rustc 1.97.1 (8bab26f4f) locally and rustc 1.99.1 (58cf8f9c3) on CI's
    // windows-latest and ubuntu-24.04 (run 40079051071), not a documented guarantee: if a toolchain
    // stops showing the line, this test goes silent again, which is the defect this branch exists
    // to remove.
```
Line 255 ends "and not a write to the stderr handle. That is", so the new text starts with "behaviour". Each clause checked:
- "rustc 1.97.1 (8bab26f4f) locally": my `rustc -V` in `C:/dev/wt/sw` printed `rustc 1.97.1 (8bab26f4f 2026-07-14)`. My L0 run on that toolchain printed the line under default capture.
- "rustc 1.99.1 (58cf8f9c3) on CI's windows-latest and ubuntu-24.04 (run 40079051071)": the job logs of run 40079051071 print `rustc 1.99.1 (58cf8f9c3 2026-10-13)` (windows log line 271, ubuntu log line 290). Both jobs' "Run the ordinary suite" step carries the INCONCLUSIVE line (windows 1616, ubuntu 1696).
- "not a documented guarantee … the defect this branch exists to remove": the head's words, unchanged.

## Notes (no finding)
- **The form's Out-of-scope line.** I read it first, per §21d. It names `guarantee` as touched. Round 25, item 2 would fail a five-line form on that, by name. `AUTONOMY.md` §25 (e) ("The full form at dispatch") is the clause the human set aside for this piece, in the ruling headed 2026-10-24, item 1 ("§25 (e) set aside for it"). I confirmed by search that §25 (e) is that clause. I do not fail the form on it; it is the human's ruling.
- **The RECORDED MUTATION line.** It names the branch commit e58f98e3. That is a commit id, not a hash pin of a span. The repo merges with merge commits (for example 4356db14 for #248), so e58f98e3 stays reachable from main. Its format follows the repo's existing convention (for example `engine/tests/source_observation.rs:83`).
- **The M1 failure location moved.** The worker recorded M1 failing at `:271:18` at e58f98e3. At the head it fails at `:277:18`, because six doc lines were added above. The two are consistent, and the doc line quotes only the message.
- **The head's CI reached the window.** In all four Rust jobs at the head (push run 40079949343 and pull_request run 40081118873), the test passed with no INCONCLUSIVE line, so it reached the window and ran the existing assertions. The line's visibility on CI is shown only by C0.
- **No `verify-mutation` run** is called an observation anywhere in the diff or the PR body.

## Check 1: the diff
- `git diff --numstat dc040c26830e017ad05ec039acb54cb6ed44f70a...14cdbcc0…`: rc=0, `42	14	kernel/tests/publish_cancellation.rs`. One file, 56 lines against the budget of 80.
- The merge base of B and the head is B (rc=0).
- `git diff 23c58cdc 14cdbcc0…`: rc=0, 0 bytes.
- The window branch's assertions, checked by script (`sw-g1r-check1.mjs`, rc=0):
  - B's file is byte-identical to 5c6b7e37's (cmp rc=0).
  - B's lines 257-282 hash to sha256 ce081b383c6adc3d159a1e583338707e038f8e2ae7429290d4b0f4d464035785, which matches the form's pin.
  - All 26 lines are present, contiguous and unchanged at the head, starting at line 285. No line is missing.
  - B and the head each have 6 `#[test]` and 0 `#[ignore]`. Only `a_cancel_inside_the_sort_is_observed_rather_than_waited_out` changed; the other five are byte-identical.

## Check 2: the code, read whole at the head (lines 1-330)
- **INCONCLUSIVE shape (lines 258-276).** It is exactly Amendment 1, item 3: no `QueryRunning`; `Ok(done)` with `done.rows == FEATURES as u64 && done.partitions > 0`; `!acknowledged`.
- **When QueryRunning fired,** the existing assertions run unchanged (lines 285-310).
- **No assertion on the token's flag.** No `is_cancelled` appears in the test.
- **Any other shape** panics with outcome, acknowledged flag and phases (lines 277-281).
- **The write** is `let _ = writeln!(std::io::stderr().lock(), …)` (lines 264-274).
- **The line's words equal section A's,** by script (`sw-g1r-check2b.mjs`, rc=0, `equal: true`). The Rust `\` continuations were rebuilt into one string, and the file has no CR.
- **No product file touched;** numstat shows one file.
- **The M1 doc text equals the panic I re-observed,** byte for byte, by script (`sw-g1r-check3.mjs`, rc=0, `equal: true`).
- **Amendment 1's two pins re-hashed at 80713d44 (rc=0):**
  - `engine/src/stream.rs:898-908` → 59e6fb89…196bb, a match. The span is `Drop` calling `cancel_for_drop()` on every drop.
  - `engine/src/cancel.rs:100-115` → 816d5f0a…481f, a match.

## Check 3: M1 and L0, re-observed in `C:/dev/wt/sw` at the head
- **M1.**
  - Applied with sed to line 754 of `kernel/src/publish/mod.rs`: `watch.check()?;` → `return Err(PublishError::Cancelled);` (sed rc=0; the diff is 1 line in that file only).
  - Run in a shared hold, `CARGO_TARGET_DIR=D:/wt-targets/p2 … cargo test -p spatial-kernel --test publish_cancellation --locked a_cancel_inside_the_sort_is_observed_rather_than_waited_out`: rc=101.
  - Output: `test a_cancel_inside_the_sort_is_observed_rather_than_waited_out ... FAILED`, panicked at `kernel\tests\publish_cancellation.rs:277:18`, then `QueryRunning never fired and the publish did not complete with every row and no acknowledgement. Outcome: Err(Cancelled). Acknowledged: true. Phases seen: [VerifyingSource, Querying]`, then `test result: FAILED. 0 passed; 1 failed; … 5 filtered out`.
  - Reverted with `git checkout -- kernel/src/publish/mod.rs` (rc=0). Porcelain empty, 0 bytes.
- **L0.**
  - `git diff 23c58cdc e520e30d` was written to a patch and applied with `git apply` (rc=0). The working diff is byte-identical to the patch (cmp rc=0): `fn phase(&self, _phase: PublishPhase) {}`, 1 line added and 6 removed.
  - Same command in a shared hold, rc=0, default capture.
  - Output: `INCONCLUSIVE (not a failure; the sort-window cancel was not exercised on this run): kernel/tests/publish_cancellation.rs a_cancel_inside_the_sort_is_observed_rather_than_waited_out: QueryRunning never fired, so the sort ended inside one poll interval and the publish completed uncancelled (60000 rows, 31 partitions). Phases seen: []`, then `test a_cancel_inside_the_sort_is_observed_rather_than_waited_out ... ok`, then `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 5 filtered out; finished in 10.39s`.
  - `rustc -V`: `rustc 1.97.1 (8bab26f4f 2026-07-14)`.
  - Reverted (rc=0). Porcelain empty, 0 bytes.
- **At the end:** porcelain 0 bytes, HEAD still 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d.

## Check 4: CI
- **C0 run 40079051071** (`gh run view`, rc=0): headSha e520e30d2d7e43e1f7810c8cad5cdb309e0fee9c, completed success.
  - `git diff 23c58cdc e520e30d` is only the QueryRunning arm dropped.
  - Job 120828765042 (windows-latest), success. Its log (`--log --job`, rc=0) carries the INCONCLUSIVE line at 1616, ending `(60000 rows, 31 partitions). Phases seen: []`, and `test a_cancel_inside_the_sort_is_observed_rather_than_waited_out ... ok` at 1617. Both are in the "Run the ordinary suite" step.
  - Job 120828765385 (ubuntu-24.04), success. The same line at 1696 and `... ok` at 1697, in the same step.
- **Head.** `gh pr checks 250` first returned rc=8 with the Rust and shell pull_request runs pending.
  - The head sha of every run, from `gh run view`: 40081118873, 40081118820, 40081118825, 40081118901, 40081118800, 40081118767, 40081118836 (pull_request) and 40079949343, 40079949334, 40079949332, 40079949339, 40079949345 (push). All twelve are at 14cdbcc0adec72b2d9d6b7f10bdd152d9c43439d.
  - Push run 40079949343 had completed with success. The test is `... ok` with no INCONCLUSIVE line on windows (job 120831230222, log line 1588) and on ubuntu (job 120831230068, line 1665).
  - I waited for pull_request run 40081118873 with `timeout 570 gh run watch`. The first call returned rc=124 (still running); the second returned rc=0, completed success.
  - Its windows-latest job 120834714511 succeeded, with `... ok` at log line 1605 and no INCONCLUSIVE line. Its ubuntu-24.04 job 120834714381 succeeded, with `... ok` at line 1687 and no INCONCLUSIVE line.
  - `gh pr checks 250` re-run: rc=0, 0 pending, every check passing.

## Check 5: fmt and clippy
- `cargo fmt --all -- --check`: rc=0, no output.
- `cargo clippy -p spatial-kernel --tests --locked` in a shared hold (CARGO_TARGET_DIR=D:/wt-targets/p2): rc=0.
  - `Checking spatial-kernel v0.0.0 (C:\dev\wt\sw\kernel)` appears at output line 74, and `Finished dev profile` follows.
  - 39 `^warning` lines, from other test targets. 0 lines mention `publish_cancellation`.

## Hold lines (this project only)
- M1: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:18412 also=bash.exe:21224 (commands started from now on inherit it; release when done)` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:18412 affinity=FF (cores 0-7)`
- L0: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:26328 also=bash.exe:38248 (…)` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:26328 affinity=FF (cores 0-7)`
- clippy: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:24652 also=bash.exe:39992 (…)` / `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:24652 affinity=FF (cores 0-7)`
- No exit code from 96 to 99 occurred.

## Also noted
- A tool limit hit during the work: the Bash tool collapsed backslashes in a heredoc regex. My first words-check script (`sw-g1r-check2.mjs`) therefore reported `equal: false` falsely. `sw-g1r-check2b.mjs`, which builds the backslash from a char code, is the valid check.

Scratch files are all `sw-g1r-*` under `<the session scratch folder>/`. Nothing was committed or pushed, and the worktree is clean.
