Reviewed: PR #278 at fa4d009562185de498f5ed5b23979e0ecf7f05ba (base b1d8d02c), gate 1, reviewer · cut/redaction-hostname-off-windows @ fa4d009562185de498f5ed5b23979e0ecf7f05ba
Verdict: PASS WITH NOTES

Nothing blocks. There are no Correctness or Evidence findings. Two Documentation findings need fixing before the merge. Neither one is the human's wording, so each is applied with no re-gate and listed in the PR body (AUTONOMY §31).

## Correctness
None.

## Evidence
None. M1 failed on my export exactly as predicted. M2's failure is in CI. CI is green at the head.

## Documentation (must-fix before the merge)

**D1. `kernel/tests/redaction_hostname_off_windows.rs:88` (at fa4d0095), M2's RECORDED MUTATION line.**
- What is wrong: the line says "this test failed on that job and no other test did". That is true only of the test binaries that ran. `cargo test` stops at the first failing binary.
  - In run 41686068307's ubuntu job, `##[error]Process completed with exit code 101.` follows T2's result immediately.
  - T2's binary is the 79th of the 112 that the ordinary-suite step runs at the head (run 41689563500's ubuntu job). The 33 binaries after it never ran under M2: the kernel's later test binaries, renderer, skp and the doc-tests.
- The same line also carries the CI runner's machine name. The words below replace it with a placeholder.
- Who changes it: this is the worker's comment, so the worker applies these words.
- Replacement words (one line; rustfmt does not reflow comments):
  `/// RECORDED MUTATION (M2, observed at 06f54ec004ee090ffdff351becf14647b403121f on the Linux L1 job: run 41686068307, job 126092020662; reverted by 52e65e2888efcd80c324fab8bd211bfa94b55a36): `os_hostname` returns `None`. OBSERVED FAILURE: this test failed on that job, and no test that ran before it failed; cargo stops at the first failing test binary, so the binaries after this one did not run. The child exited non-zero and the parent reported its stderr, `the record carrying the uname -n name "<the runner's name>" does not list machine-identifier in residual_classes`.`
- Clause check against the job's log:
  - "this test failed on that job": log line 1778 reads `test an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname ... FAILED`, and the job's conclusion is `failure`.
  - "no test that ran before it failed": the only `FAILED` lines are 1778 and 1797 (T2 and its result line). The 78 `test result:` lines before them all read `ok`.
  - "the binaries after this one did not run": lines 1799–1800 show the error and exit 101, and the step has no `Running` line after T2's. The head run of the same step has 112 binaries against 79 here.
  - The stderr text matches log line 1788, with the name elided.

**D2. The form's Amendment 2 (`governance/forms/kernel/REDACTION-HOSTNAME-OFF-WINDOWS-PREREGISTRATION.md`, on main).**
- What is wrong:
  - It labels the overrun class 8. In `docs/PREREGISTRATION-TEMPLATE.md`, item 8 is "Budget overrun, full form, §7 not edited", and it says "Class 6 stays the short form's budget class". Item 6 is "(short form only …)".
  - Class 6 asks for "the reason". Amendment 2 says the worker "did not trim", which is not a reason.
- The fix is an appended row, because the form is append-only. The custodian applies it. It is three sentences (round 12, item (d)). Replacement words:
  `### Amendment 3 — 2026-11-03 — record correction of Amendment 2's class; written after the piece's tests, mutations and CI runs were seen`
  `- Amendment 2 names its class as 8, which is the full form's budget class; this five-line form's overrun is class 6, budget deviation, Scope not edited (`docs/PREREGISTRATION-TEMPLATE.md`, its items 6 and 8). Its figures stand, and the reason it omits is that the new test file alone is 122 lines (T2's child-process harness, its two helpers and its module doc), against a 145 declared for all three files with no per-file split. The 198 lines are over §21c's 150, so class 6's closing of the single-gate route applies; the reviewer and the architect already gate the piece from dispatch.`
- Clause check:
  - The class 6 and class 8 texts are template lines 125–131 and 169.
  - 122 lines: by the numstat in check 1. The test file holds `intent`, `residual_classes`, `child` and a module doc (test file lines 4–11).
  - 145 and no per-file split: the Scope line gives only "declared line budget 145".
  - The route clause is class 6's "the single-gate route closes … and the architect gate is taken; the short form stays".
  - Both gates from dispatch: the settlement's Guarantee bullet.
- The worker report's line "that is a class 8" is a filed hand-back. It stays byte-identical, and this row corrects it.

## Notes for the custodian (not findings)
- **§36 and the size.** §36 admits a filler that "fits a five-line form under §21c's size". At 198 lines the piece no longer fits. Amendment 2 says "its route does not change" but does not address the slot. Whether the piece stays in the filler slot is for you or the human to record.
- **The guarantee line.** The `Out-of-scope` line names "guarantee: TOUCHED". I read it first, as §21d asks. It is not a §25(e) failure: §36 sets §25(e) aside for a filler, and the human's ruling (the 2026-10-30 directive, line 19) keeps the piece "a guarantee touched, both gates, under §36".
- **Common-word hostnames on Linux.** When neither variable is exported, a kernel name that is a common word (for example `localhost`) is now scanned for. Any bundle or record whose bytes contain that word in a 12-byte printable run is then refused or flagged. This fails closed, and it already happens today when HOSTNAME is exported. The shipped app is Windows-only, so ordinary use cannot reach it.
- **T2's scratch folder.** It is the fixed path `temp_dir()/spatial-kernel-rhow-tests/child`, and the test runs `remove_dir_all` on it. Two runs of the binary at once on one Linux host would collide. Threads inside one run share nothing, because the binary holds only this test.
- **README preregistration list.** All 29 `kernel/…-PREREGISTRATION.md` paths on line 387 no longer exist at the head (piece F, #270, merged 2026-10-31). Only this piece's own entry uses the governance path. This predates the piece; the worker disclosed it.

## Check 1: the diff and the bytes
- `git diff --numstat origin/main...HEAD` (rc 0) gives `2 2 kernel/README.md`, `62 10 kernel/src/bundle/redaction.rs` and `122 0 kernel/tests/redaction_hostname_off_windows.rs`. That is 198 lines, matching Amendment 2's figures.
- No product file changed between B and main under `kernel` or `renderer`: `git diff --name-only b1d8d02c origin/main -- kernel renderer` printed nothing (rc 0).
- **The fix (N3):** `from_environment` now calls `hostnames_from(|key| std::env::var(key).ok(), os_hostname)`. `hostnames_from` reads `COMPUTERNAME` and `HOSTNAME` (3-byte floor, dedup) first, and calls `os()` only `if hostnames.is_empty()`. The OS name is trimmed and held to the same floor. There are at most two names, so P ≤ 25 holds.
- **N2 and the stop rules:** `os_hostname` and `hostnames_from` are private and std-only, and their one caller is `from_environment`. The diff adds no OS cfg, no `unsafe`, no `set_var`, no dependency (`git diff b1d8d02c HEAD -- kernel/Cargo.toml Cargo.lock` is 0 lines) and no user-visible string.
- **Callers:** `git diff --name-only b1d8d02c HEAD` over `log.rs`, `publish/mod.rs`, `normalize.rs` and `tests/publish.rs` printed nothing (rc 0).
- **Unchanged constants:** the floor, `RESIDUAL_CLASSES` (log.rs:93) and `MIN_PRINTABLE_RUN` (redaction.rs:214).
- **Existing tests:** the diff only adds to the redaction.rs test module. No assertion was changed or removed.
- **T2's ignore reason:** `boundary: machine identity (os_hostname in kernel/src/bundle/redaction.rs)`, which names the boundary as R6 asks.
- **README:** only lines 360 and 387 changed. The form exists at b1d8d02c (`git cat-file -e`, rc 0).
- **Bytes** (all rc 0):
  - CR count is 0 in all three files, tab count is 0, and each ends in LF.
  - The 186 added lines contain no non-ASCII byte (node scan).
  - redaction.rs has 68 non-ASCII bytes and README has 330, the same counts as at B.
  - `file` reports the new test file as ASCII.
- **The seam:** T2 builds a real `IntentRecord` and goes through `AuditLog::open_for`, `append_intent` and `classify`. `classify` calls `from_environment` once per pass (log.rs:244–256). The viewer's standalone compile is check 2.

## Check 2: the head, in the worktree on `D:/wt-targets/rhow`
- `cargo test -p spatial-kernel --locked`: rc 0. Summed over the result lines: 391 passed, 0 failed, 43 ignored, and no `FAILED` line.
  - `test bundle::redaction::tests::the_os_hostname_is_taken_only_when_the_environment_names_none ... ok`
  - `test the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle ... ok`
  - `test an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname ... ignored, boundary: machine identity (os_hostname in kernel/src/bundle/redaction.rs)`
- `cargo test -p spatial-kernel --locked --test redaction_hostname_off_windows -- --list --ignored`: rc 0, listing `an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname: test` and `1 test, 0 benchmarks`.
- `cargo fmt --all -- --check`: rc 0, with empty output.
- `cargo clippy -p spatial-kernel --locked --tests --no-deps`: rc 0. It replayed from the cache (finished in 1.80s). There are 33 warnings, and none sits in a changed file: no warning location contains "redaction".
- **Standalone compile:** `scan-dist.mjs:59` runs `rustc --edition 2021 -A warnings -o <exe> scripts/scan-dist.rs`. Run that way from `renderer/bundle-viewer`, with the output in my scratch folder: rc 0. The binary ran over a scratch directory with rc 0 and no output. Without `-A warnings` it is also rc 0 with no warning. This compile was light and ran outside a hold.

## Check 3: mutations
- **M1:** I exported `git archive fa4d0095` into `D:/wt-targets/rhow-g1r-export` (`tar --force-local`, rc 0), with the cold target `D:/wt-targets/rhow-g1r-target`.
  - The mutation: `    if hostnames.is_empty() {` became `    {`, which drops the guard. `git diff --no-index` shows only that line.
  - `cargo test -p spatial-kernel --locked --lib the_os_hostname_is_taken_only_when_the_environment_names_none`: rc 101. Byte-copied:
    `thread 'bundle::redaction::tests::the_os_hostname_is_taken_only_when_the_environment_names_none' (42080) panicked at kernel\src\bundle\redaction.rs:685:9:`
    `assertion `left == right` failed: an environment name is used alone`
    `  left: ["envhost", "oshost"]`
    ` right: ["envhost"]`
  - This is the predicted assertion with the predicted values. Line 685 at fa4d0095 is the worker's line 683 at f7be3a30, before 2a3fae53 added two lines.
  - Restored by copy: sha256 6910ae8c8c2abe566caf1373e0a891d4c989e3f864610ffca561267d7c67a7c3, equal to `git show fa4d0095:kernel/src/bundle/redaction.rs | sha256sum`.
- **M2 (from CI):**
  - `git show 06f54ec0`: one file, one line, `std::fs::read_to_string("/proc/sys/kernel/hostname").ok()` changed to `None`.
  - `git diff 2a3fae53 52e65e28 -- kernel/src` is empty (0 bytes, rc 0), and `git diff 2a3fae53 52e65e28 --stat` is also empty.
  - Run 41686068307 (head 06f54ec0, push, failure): ubuntu job 126092020662 failed and windows job 126092021037 succeeded.
  - `gh run view --job 126092020662 --log`: T2 is the only test that failed (log 1778 and 1797). The parent panicked at `kernel/tests/redaction_hostname_off_windows.rs:114:5` and the child at `:80:5`, the child's `machine-identifier` assertion (log 1788; runner name not quoted).
  - Binaries after T2's did not run (D1).

## Check 4: the tests' soundness
- **T1:** calls `hostnames_from` with closures and mutates no environment. It makes the three assertions N6 lists.
- **T2:**
  - It re-runs itself as a child (`current_exe`, `--exact`, `--test-threads=1`). The only environment changes are `env_remove` of HOSTNAME and COMPUTERNAME plus `.env` of the marker and an absolute `SPATIAL_IDE_AUDIT_LOG` under `temp_dir()`, outside `dest`. The `is_inside` check passes.
  - The oracle is `uname -n`, a separate read from the implementation's procfs read.
  - It fails by name when the name is under 3 bytes (lines 56–59) or appears in the control record (lines 70–75).
  - The control record lacking `machine-identifier` is checked (lines 76–79), and the named record listing it is checked (lines 80–83).
  - There is no sleep, retry or timeout. Threads share no state (one test per binary; see the scratch-folder note).

## Check 5: verify scripts and CI
- **Verify scripts at the head:**
  - `verify.mjs --offline`: rc 0, `verify:plan PASS`.
  - `verify-cites.mjs`: rc 0, PASS (82 advisory).
  - `verify-quotes.mjs` (timeout 580s): rc 0, `verify:quotes PASS — 135 checked, 104 verified, 30 baselined, 1 advisory, … 0 hash-reference errors`.
  - `verify-test-claims.mjs`: rc 0, PASS, 729 claimed tests.
  - I also recomputed four of the form's pins, and all four match: Amendment 1's POSIX form :163 @ 652752af (an ancestor of main), PERMISSION-BOUNDARY :293-296, AUTONOMY :692 (read at its pre-move root path) and product-ci-rust.yml :196-197, all @ 53e0a0a1.
- **`gh pr checks 278`:** the first read was rc 8, with run 41695916288 pending. I waited with a loop that slept 30s per turn under a 540s deadline; it completed after 127s. The second read was rc 0, with all 20 checks passing.
- **Head sha of every run:** all 14 push and pull_request runs at fa4d0095 report headSha fa4d009562185de498f5ed5b23979e0ecf7f05ba (gh run view, each rc 0).
- **Rust workspace runs:**
  - In both 41689563500 (push) and 41695916288 (pull_request, success), the ubuntu jobs (126104278223, 126126278691) show T1 `ok`, T2 `ok` and `the_redaction_scan_passes_over_every_byte_of_an_emitted_bundle ... ok`.
  - In the same two runs, the windows jobs (126104278819, 126126278138) show T1 `ok` and T2 `ignored, boundary: machine identity (os_hostname in kernel/src/bundle/redaction.rs)`, and the ignored listing names T2.
- **Bundle viewer:** in run 41689563271 (fa4d0095, success), the `npm run verify` step's `node --test` reports `ℹ pass 104` and `ℹ fail 0`. The four `scan-dist.test.mjs` tests pass, among them `✔ a finding outside the reviewed record fails the viewer build and writes no hash record`. Run 41695916624 shows the same scan-dist build lines.

## Hold lines (my project only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:65632 … (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:65632 affinity=FF (cores 0-7)`: the full kernel test.
- The same pair with `shell=bash.exe:63244`: `--list --ignored`, fmt and clippy.
- The same pair with `shell=bash.exe:40652`: M1 on the cold export target.
- No hold was refused (no exit 96 to 99).

## Cleanup and background shells
- `D:/wt-targets/rhow-g1r-export` and `D:/wt-targets/rhow-g1r-target` were removed (rm rc 0 each, and `test -e` rc 1 for each afterwards).
- The worktree is at fa4d0095 and `git status --porcelain` is empty (0 bytes).
- Background shells left: none. All four I started ended on their own: the kernel test, verify-quotes, M1 and one wait loop. No process was killed. `tasklist` shows no cargo.exe or rustc.exe running.
- My scratch files are under `<the custodian's scratchpad>` with names starting `rhow-g1r-`.
