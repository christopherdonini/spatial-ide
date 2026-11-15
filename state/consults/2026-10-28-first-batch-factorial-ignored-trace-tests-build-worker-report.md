*Custodian's filing note (2026-10-28): the worker-high's report on `first-batch-factorial-ignored-trace-tests`, the filler queue's entry 6b, resumed from its stop of 2026-10-25 under its form and the human's ruling of 2026-10-28 (S from the fixture-S entry point's output; the form's Amendment 1). The observation ran on an export of the code commit with S copied in, its full sha256 checked on the copy: the first test passed unmutated and failed under M-1 by name at its start's expect; H5 is absent, so the second test's M-1 is a reading (OPEN-2 (B)). The custodian's check: the branch head a45c206d and its numstat (30 of 40 lines, one file) by git; the transcript shows 4 cargo calls, each inside a shared hold, one commit and one push, no exclusive hold, writes only to the piece's file and scratch, and two taskkill calls on its own wait loop and that loop's parent shell (already gone), as it discloses. The run 09:44:01Z to 10:21:48Z by its transcript (Bash 46, TaskStop 1, Read 2, Edit 2, Write 1). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 739e00123d9351d2d76fa36b32db6e20346ad75314a06f0312bf8b60aff0ca7e.*

---

Built: first-batch-factorial-ignored-trace-tests at a45c206d34c0e367c8e8df2251fcafa1bbafd590

Only the first test was observed. H5 is absent, so OPEN-2 (B) applies and the second test's M-1 is recorded as a reading.

**Commits** (branch `cut/first-batch-factorial-ignored-trace-tests`, worktree `C:/dev/wt/fbf`)
- Code commit 3c8e91f634246b620e8346b2d34acca597a6385e: `test: first-batch-factorial-ignored-trace-tests, the file-local trace lock (form Change line, note 1)`. It was already pushed before this resume.
- Record commit a45c206d34c0e367c8e8df2251fcafa1bbafd590: `test: first-batch-factorial-ignored-trace-tests, the RECORDED MUTATION lines (form Tests+mutation line, note 2)`. It adds 8 doc lines.
- The message file had no `@` outside the Co-Authored-By line (grep showed only line 9). `-s` added the sign-off. The push returned rc 0 (`3c8e91f6..a45c206d`).
- After a fetch, HEAD and origin's branch are both a45c206d, and `git status --porcelain` is 0 lines.

**Briefs and form**
- Both briefs matched their sha256 (resume 8808fe8e..., original e842a316...).
- I read the form on main, Amendment 1 included. The worktree's copy is the pre-amendment form, sha256 03592580..., unchanged.

**Fixtures as found**
- S: the main checkout's `target/slice-evidence/first-batch/parcels-145mb.parquet`, 151629665 B on the main checkout's listing (the amendment gives 151,629,665 B).
- S's sha256 on the main-checkout source was fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a. The copy in the export gave the same full hash, checked before any run. This matches Amendment 1.
- H5: absent. `first-batch/` held only S.
- Disk floor: D: showed 143G free before and after the 145 MB copy, so the 40 GiB floor held.
- The export is `git archive` of 3c8e91f6 at `D:/wt-targets/fbf-export`. Its `kernel/tests/first_batch_factorial.rs` sha256 was 99a07cb5b4bd9bee59922c0e59da0ed2a488a85ad2a3d2de73cb6f2d2a60f881, equal to the code commit's.
- I touched its kernel and engine sources before the first run. Its cargo target was `D:/wt-targets/fbf-export-target`, its own.

**Observation** (release, `--ignored --exact`, `--nocapture`, each in its own shared hold)
- Unmutated `cancellation_holds_with_pruning_in_the_path`: rc 0, `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 6 filtered out; finished in 6.94s`.
  - All 7 trials had a RowGroupsPruned plan. requested→observed was at most 0.156 ms, well inside docs/08's 100 ms.
- M-1 applied on the export as the form gives it: in `serial()`, the lock taken into `guard`, then `std::mem::forget(spatial_engine::trace::start(spatial_engine::trace::TraceKey::default()));`, then `guard` returned.
  - The run failed with rc 101: `thread 'cancellation_holds_with_pruning_in_the_path' panicked at kernel\tests\first_batch_factorial.rs:1348:10:` followed by `no other trace is running`.
  - That is the start's expect (original line 1346, plus the 2 lines M-1 added). No trial line had printed, and the result was `0 passed; 1 failed`.
- `cancellation_holds_with_pruning_in_the_path_on_h5` was not run, neither unmutated nor under M-1. Its M-1 is recorded in the doc as a reading, not an observation.
- Restore check: I restored the export's file from `git show 3c8e91f6:...`. Its sha256 is 99a07cb5..., equal to the code commit's, and `cmp` returned rc 0.
- The export folder is removed (`ls` says no such file). `fbf-export-target` remains for reuse.

**Scope count**
- `git diff --numstat 8d8d412e...HEAD` gives `30 0 kernel/tests/first_batch_factorial.rs`, 30 of 40. No overrun.
- The only file changed is `kernel/tests/first_batch_factorial.rs`. No assertion, message, test name, ignore reason, fixture path or constant changed.
- The record's longest line is 99 columns.

**Checks at head a45c206d**
- `cargo test -p spatial-kernel --locked --test first_batch_factorial` (in a shared hold, worktree target): rc 0. Last result line: `test result: ok. 2 passed; 0 failed; 5 ignored; 0 measured; 0 filtered out; finished in 0.00s`. The ignored tests stayed ignored.
- `cargo fmt --all -- --check`: rc 0.
- `cargo clippy -p spatial-kernel --tests --locked`: rc 0, last line `Finished dev profile [unoptimized + debuginfo]`.
  - The log shows 39 warning headers, all pre-existing in other test files.
  - The one reported against the `first_batch_factorial` test target is `assertions_on_constants` at `kernel/tests/support/mod.rs:342`, not in my lines.
  - I did not diff the warnings against the base, so "pre-existing" for the other 38 is not checked.
- `node scripts/plan/verify.mjs --offline`: rc 0, PASS.
- `verify-cites.mjs`: rc 0, PASS. It advised 100 loose references elsewhere.
- `verify-test-claims.mjs`: rc 0, PASS.
- `verify-quotes.mjs --show-cites` with no file argument timed out at my 120 s limit (rc 124, nothing printed).
  - Re-run on the changed file with a 280 s limit, `verify-quotes.mjs --show-cites kernel/tests/first_batch_factorial.rs`: rc 0, PASS, 0 checked.
  - It also printed an advisory about 2 stale baseline entries. That is not mine.

**Stop rules and disclosures**
- No stop rule met, no timing miss and no hold refusal. No change was needed outside the one file.
- Disclosure: the file's RECORDED MUTATION text states the unmutated pass without figures. Raw logs are in my scratch folder under `fbf-w-*`.
- Disclosure: I started an unwanted busy-wait loop (an `until ... read -t` wait on the log) and killed it by PID (46044).
  - Its parent bash, 48084, was already gone.
  - The three background wait/tail calls I started all completed.
  - A final process check found no cargo, rustc or test process on `fbf-export` or `first_batch_factorial`. I did not check the other processes I started (hold, wait and tail calls), which were all reported as exited or killed.
- Cross-module seams: none. This is a test-file-local lock, with no module boundary crossed.
- Pre-gate self-check: no cross-module code. Every completion claim points to a log or hash above. No user-facing message was added. The unmutated and M-1 runs of the first test each reached their intended assertion: the first completed all 7 trials, and the second failed at the start's expect before any trial.

**Holds (own project only, all shared)**
- Four holds, each granted with `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` and released with `MACHINE_RELEASED project=SpatialIDE`: the unmutated release build and run, the M-1 run, the debug test run, and clippy.

**Model and handoff:** Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override. No context handoff received or produced.
