Reviewed: PR #264 at a45c206d34c0e367c8e8df2251fcafa1bbafd590 (base 8d8d412e), gate 1, reviewer
Verdict: PASS WITH NOTES
Branch: cut/first-batch-factorial-ignored-trace-tests @ a45c206d34c0e367c8e8df2251fcafa1bbafd590

Brief: sha256 728209c246b5cb7015e13190dd2942933fe66d449073c8aabf83f78ce081c5d6, equal to the one given (sha256sum, rc 0). It has 35 lines by `wc -l` and `cat -n`, with a final LF, not the 36 the dispatch says. The hash matched, so I proceeded.

## Correctness
None.
- The lock lines at the head, kernel/tests/first_batch_factorial.rs:1303-1307, hash to sha256 34df4f7d5e01eb83a92a658e40c11dc1c418c1928a21d2267019949cc25286a6. That equals the sibling at kernel/tests/wire_bytes_invariant.rs:183-187 @ 82f497b1, which I hashed again by `git show`, and the Change line's pin.
- `let _serial = serial();` is the first statement of both bodies (:1330 and :1465), before `refuse_debug`.
- Drop order: `guard` is declared inside the trial loop, after `_serial`, so it unwinds first on a panic.
- No other in-process `trace::start` is reachable in the ordinary run. The only other site is `night_trial_child` (:510), which is env-gated.

## Evidence
None blocking. One note:
- E-note 1 (record only, no fix to the PR): the worker's report gives the head test run's target as "worktree target". Its log `fbf-w-chk-test.log` shows the target was `D:/wt-targets/m4a`, a leftover target of the milestone-4 PR A worktree, which is not in `git worktree list`.
- That log also shows every path crate (skp, engine, data-plane, renderer, kernel) compiled from `C:\dev\wt\fbf\…`, so no other tree's build was reused. The settlement's separate-targets term holds, because the export used `fbf-export-target`.
- My head run used the same target (see check 3).

## Documentation (must fix before the merge; no re-gate)
D1. kernel/tests/first_batch_factorial.rs:1299 (line sha256 47fb4ce6526179306db60bde3a21d35076257480da64593c0b4f72dc8bf7446f at a45c206d).
- The defect: "each test alone" describes two observed runs, but only one test ran. The text two lines later says `_on_h5` was not run.
- Not the human's wording (a doc comment). The worker applies the words below and the PR body lists them.
- Replace the span `` `--ignored --exact`, each test alone. `` with `` `--ignored --exact`, run alone. ``
- Resulting line, 92 columns: /// `--ignored --exact`, run alone. Unmutated, `cancellation_holds_with_pruning_in_the_path`
- Clause check: "run alone": the one observed test ran by itself under `--exact`. The worker's logs `fbf-w-run1-t1.log` and `fbf-w-run2-t1-m1.log` show "running 1 test … 6 filtered out", and so do my two export runs below. Holds. The rest of the line is unchanged.
- The numstat stays at 30 (one line replaced, the same count).

## Check 1: the diff
- `git diff --numstat 8d8d412e...a45c206d` (rc 0): `30 0 kernel/tests/first_batch_factorial.rs`. One file, 30 of 40.
- `git log 8d8d412e..a45c206d` (rc 0): two commits, 3c8e91f6 (code) and a45c206d (record). `git diff --numstat 3c8e91f6 a45c206d` gives 8 lines.
- The full diff (rc 0) adds only:
  - the doc comment;
  - the `static` and `fn serial()`;
  - the two `let _serial = serial();` lines.
- No assertion, message, test name, `#[ignore]` reason, fixture path or constant is changed (the diff has no deletions).
- W1's words, checked by my one-off script `fbf-g1r-w1.js` (rc 0): form lines 76-88 against head lines 1281-1294.
  - 157 words against 157, equal.
  - The blank `///` separators sit where W1 has them.
  - The longest doc line is 100 columns.
- The RECORDED MUTATION lines (1296-1302) fill W1's placeholder:
  - the M-1 insertion as the Tests+mutation line words it;
  - the test name and its message `no other trace is running`;
  - the 40-hex code commit 3c8e91f634246b620e8346b2d34acca597a6385e.
  - `_on_h5` is marked a reading, not an observation (OPEN-2 (B)).
  - Each is true against my check 2, apart from D1.

## Check 2: the observation on an export
- `git archive 3c8e91f6` (rc 0), extracted with `tar --force-local` (rc 0) into the new folder `D:/wt-targets/fbf-g1r-export`.
- The export's test file hashes to sha256 99a07cb5b4bd9bee59922c0e59da0ed2a488a85ad2a3d2de73cb6f2d2a60f881, equal to `git show 3c8e91f6:…`.
- I touched 142 of 142 `.rs` files under kernel/ and engine/ (rc 0).
- S copied (cp rc 0) to the export's `target/slice-evidence/first-batch/`, which is where `evidence_dir()` and `FileId::S.path()` (:91-98, :221) resolve. The copy is 151629665 B, sha256 fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a, equal, checked before any run.
- D: had 140G free.
- CARGO_TARGET_DIR was `D:/wt-targets/fbf-g1r-target` (new, cold).
- Unmutated run: `cargo test --release --locked -p spatial-kernel --test first_batch_factorial -- --ignored --exact cancellation_holds_with_pruning_in_the_path --nocapture`.
  - cargo_rc=0, after a cold build of 32m 37s.
  - Result line: `test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 6 filtered out; finished in 9.34s`.
  - All 7 trials printed `plan RowGroupsPruned { total: 13, kept: 7, ranges: 1 }`.
  - This was a shared run, so I record no timing.
- M-1: applied by script (`fbf-g1r-m1.js`, rc 0, exactly one occurrence). `serial()` became: lock into `guard`; `std::mem::forget(spatial_engine::trace::start(spatial_engine::trace::TraceKey::default()));`; return `guard`. A diff against the code commit shows only those lines.
  - The same command gave cargo_rc=101.
  - It panicked at `kernel\tests\first_batch_factorial.rs:1348:10:` with `no other trace is running`. Line 1348 is the S test's start `.expect` (1346 at 3c8e91f6, plus the 2 lines M-1 adds; the h5 test's `.expect` is at :1481/:1483).
  - No trial line printed. Result: `FAILED. 0 passed; 1 failed`.
- Restored from `git show 3c8e91f6:…`: sha256 99a07cb5…f881, equal, and `cmp` rc 0.
- The H5 cell was not run (H5 absent; OPEN-2 (B)).
- The export was removed (rm rc 0; `ls` rc 2, "No such file or directory"). `D:/wt-targets/fbf-g1r-target` remains.

## Check 3: the head
- `cargo test -p spatial-kernel --locked --test first_batch_factorial` in `C:/dev/wt/fbf`, with `CARGO_TARGET_DIR=D:/wt-targets/m4a` (the worker's target, see E-note 1).
  - cargo_rc=0. `Finished … in 0.78s`: the worker's head build was fresh, so there was no recompile.
  - Result line: `test result: ok. 2 passed; 0 failed; 5 ignored; 0 measured; 0 filtered out; finished in 0.00s`.
  - All five ignored tests were reported ignored, the two cancellation cells among them.
- `cargo fmt --all -- --check`: rc 0, no output.
- `node scripts/plan/verify.mjs --offline`: rc 0, `verify:plan PASS`.
- `verify-cites.mjs`: rc 0, PASS (100 loose references advised).
- `verify-test-claims.mjs`: rc 0, PASS (669 claimed tests).
- `verify-quotes.mjs`, the full run under a 1800 s limit: rc 0, `verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), …`.
- CI: `gh pr checks 264` showed all 18 checks passing at 11:09:50Z (rc 0). On the first call the two `cargo test --workspace (windows-latest)` jobs were pending (rc 8). `gh run view` (rc 0 each) gives headSha a45c206d34c0e367c8e8df2251fcafa1bbafd590 for all 12 runs (push and pull_request), each completed with success.

## Check 4: the PR body and the disclosures
- The body's claims checked:
  - "30 lines of 40": numstat.
  - "1 file": numstat.
  - "151,629,665 B" and the sha256 on the copy: check 2.
  - "passed unmutated (all 7 trials with a pruned plan)": check 2.
  - "failed under M-1 by name at its start's expect (`no other trace is running`)": check 2.
  - "RECORDED MUTATION lines naming 3c8e91f6": :1298.
  - "H5 is absent … reading": :1301-1302.
  - "tests pass with the ignored ones ignored": check 3.
  - "fmt … and the verify scripts pass": check 3, with verify-quotes now passing in full at the head.
  - "clippy": not re-run by me (check 3 does not list it). It rests on the worker's log, rc 0.
- The worker's disclosures:
  - (a) The RECORDED MUTATION states the unmutated pass without figures. True (:1299-1300). The Tests+mutation line asks for name, message and commit, not figures. No finding.
  - (b) The busy-wait loop: `tasklist /FI "PID eq 46044"` reports no such task.
  - (c) verify-quotes on the changed file only: superseded by my full run, rc 0, PASS.
  - (d) 39 clippy warning headers: `grep -c warning` on the worker's log gives 39. The only one for this test target is `assertions_on_constants` at kernel/tests/support/mod.rs:342, a file the diff does not touch (numstat). "None in its lines" holds.

## Hold lines (this project's only; all shared)
1. MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:16964 also=bash.exe:46672 … / MACHINE_RELEASED project=SpatialIDE shell=bash.exe:16964 affinity=FF (cores 0-7): the export's unmutated release run.
2. MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:41304 also=bash.exe:45536 … / MACHINE_RELEASED project=SpatialIDE shell=bash.exe:41304 affinity=FF (cores 0-7): the M-1 run.
3. MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21768 also=bash.exe:45996 … / MACHINE_RELEASED project=SpatialIDE shell=bash.exe:21768 affinity=FF (cores 0-7): the head debug test run.
No hold was refused, no exit code was 96-99, and no timing miss occurred.

## End state
- `C:/dev/wt/fbf`: `git status --porcelain` is 0 lines (rc 0), HEAD a45c206d.
- `D:/wt-targets/fbf-g1r-export` is gone (ls rc 2).
- The main checkout's porcelain shows only the two untracked entries present at the session start.
- No process I started still runs. All four background tasks completed. `tasklist` shows no `first_batch_factorial*` and no rustc. The two cargo.exe processes (PIDs 24440 and 43632) were running before my first run, their command lines name no path of this piece, and I did not touch them.
- I wrote no file outside my scratch folder (`fbf-g1r-*`), the export, `D:/wt-targets/fbf-g1r-target` and the worker's target `D:/wt-targets/m4a`. The scratch tar is deleted.
