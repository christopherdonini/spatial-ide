# Worker report 1 — exposure-scan-ci-backstop (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `exposure-scan-ci-backstop` (form `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`, committed 422f8f8), recorded verbatim below with the harness's report indentation removed. Branch `cut/exposure-scan-ci-backstop` at fa24680. The custodian's checks: the five commits and the numstat (91/0, 85/1, 368/0 over the three §7 files) read from origin; the probe runs 36975271367 (failure), 36975323133 (success) and 36975368380 (failure) read by id, each on `probe/exposure-scan-push` with the printed lines the report gives; the probe's diff against fa24680 is one line in the workflow file. The S3 deviation is recorded as the form's Amendment 1 (class 2), branch commit 5d3951f.*

---

exposure-scan-ci-backstop: built and pushed on `cut/exposure-scan-ci-backstop`. E2 to E4 came out as the form predicted.

**Commits (branch head fa24680b0385)**
- 02bde66: test: the range mode's thirteen tests (T1-T13), test-only, before the scanner change
- 7680dc9: feat: the exposure scan's range mode (--range <base> <head>) and the staged filter's type-change token
- 3942d6b: test: record the first failing assertion of each of M1-M13 in the range tests' comments (comment-only)
- a1088a2: ci: the exposure-scan workflow on every pull request and every push to main
- fa24680: test: name T1 in its own RECORDED MUTATION comment (comment-only; see Deviations)

**Tests**
- At 02bde66, 47 tests: 34 passed and 13 failed. T1-T6, T8, T9, T12 and T13 failed on the status assertion (2 instead of 1 or 0). T10 and T11 failed on stderr, which was `aborted\n` instead of the fact line plus `aborted`. T7 failed because the commit staging the type change was accepted with status 0 (the staged filter was still ACMR).
- At 7680dc9 and after, all 47 pass.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` at fa24680: exit 0, 366 tests, 366 pass, 0 fail.

**M1-M13**
All were applied to the scanner at 7680dc9, run, and reverted; the tree was clean after the run. In each case the first failing assertion is the test's status assertion, except where noted.
- M1: 0 !== 1.
- M2: 0 !== 1.
- M3: 0 !== 1.
- M4: 0 !== 1.
- M5: 0 !== 1.
- M6: 0 !== 1.
- M7: the `assert.notEqual` on the commit status failed; the type-change commit was accepted.
- M8: 1 !== 0, because `mv2.txt:1` was read as an added line.
- M9: first status assertion, 1 !== 0, with `f.txt:1`.
- M10: first case (all-zeros base), 0 !== 2.
- M11: the "no `fatal`" assertion failed; stderr carried `fatal: Needed a single revision`.
- M12: the no-text assertion failed ("a refused segment or message text was printed").
- M13: 1 !== 0, with two `local-profile` findings.

No `verify-mutation` run was used as an observation.

**Check results (exit codes)**
Tool commit: `git log -1` over the five verify scripts gives 2607202.
- `verify-cites`: rc 0 (PASS, 1052 files).
- `verify-quotes`: rc 0 (PASS, 113 checked, 0 hash-reference errors).
- `verify-test-claims`: rc 0 (PASS, 438 claimed tests).
- `verify-mutation --base origin/main --head HEAD`: rc 0 at fa24680 (PASS, 13 of 13).
- `timeout 570 node scripts/plan/verify.mjs`: rc 0 (PASS) at a1088a2, not rerun after the two comment-only commits.
- Versions: git 2.49.0.windows.1, node v24.18.1.

**§7 size count**
- Merge base 422f8f8, head fa24680, over 3 files: `exposure-scan.yml` 91/0, `profile-path-scan.mjs` 85/1, `profile-path-scan.test.mjs` 368/0.
- Total 545 changed lines, within the 800 budget. The three-file count is within the declared 3, so I7 did not fire.

**E2 to E4**
Probe branch `probe/exposure-scan-push`. Its first commit is 5969fc2; `git diff --stat` against my head showed 1 file with 1 line changed (`branches: [main]` became `branches: [probe/exposure-scan-push]`).
- **E2**, creation push: run 36975271367, failure. `PUSH_BEFORE` was all zeros. The step printed `profile-path-scan: range not computable`, `aborted`, then `exposure-scan: the range is not accepted (scanner exit 2)`, and the step exited 2.
- **E3**, fast-forward push of one clean commit (59b7c6b): run 36975323133, success. The step printed `profile-path-scan: range read 1 commits, 1 added lines, 1 path names`. `git rev-list --count 5969fc2..59b7c6b` gave 1, which matches.
- **E4**, force push (`--force-with-lease`) rewriting that commit (df19bac): run 36975368380, failure. The step printed the same three lines as E2, scanner exit 2. This is the form's "`before` absent from the clone" case.
- The probe branch is left in place, pushed, with three commits. It was never merged into the piece's branch. I am back on `cut/exposure-scan-ci-backstop`; head equals origin and `git status --porcelain` is empty. No background process is left.

**§8 self-check**
- 1: no output of the range mode carries a segment or message text. T12 asserts this over the segment, the 8.3 name, the marker word and the message's first line. T11 and M11 cover git's stderr.
- 2 and 3: I did not touch the matcher, the lists, the canary, `parseAddedLines`, the redact modes, `--message` or either hook. In the staged mode only the one token changed. A new `runGitCaptured` sits beside the old `runGit`.
- 4: the workflow has no `paths`, `paths-ignore`, `concurrency`, `pull_request_target`, `secrets.`, `continue-on-error` or `|| true`. It uses only checkout@v4 and setup-node@v4, has no install step, and has no `${{ }}` inside `run:`. Event values come through `env`. Acceptance requires status 0 and the exact clean line. The scanned head is the PR head sha, not the merge ref.
- 5: the probe trigger is not on the piece's branch.
- 6: no quotations in the workflow header, scanner comments or new test comments.
- 7: tests build every profile-shaped string from `mk(...)` parts or listed names, and there is no symlink, no direct `sh` spawn, no drive letter in a temp path and no ignored test. Every test removes its temp dir in `finally`. T7 reaches the hook through `git commit`.
- 8: only the three §7 files changed.
- 9: no user-profile path appears in the diff or the commit messages.
- 10: the mutation observations are listed above with their commit.
- 11: the §7 budget was not overrun and the form was not edited.
- 12: no ledger line cites, bare self-lines or hash references in my records.
- 13: no squash or rebase merge was made.
- R1-R6: one matcher and one range reading everywhere. No OS-conditional code was added. Windows ran the suites locally and ubuntu runs the probe. No filesystem symlinks. No test is ignored.

**Deviations and open points**
- S3 uses index plumbing (`git rm --cached` plus `update-index --cacheinfo`) instead of `git mv`, which avoids creating a `~1` directory on the Windows filesystem. It still yields R100.
- The bad-argument cases print the scanner's fact line then `aborted`, so S10's exact-stderr rule holds for every case.
- The form's 4 and 5 mutation-record dispositions are as stated in the form. T1's mutation comment names the test explicitly, because T1's body is longer than `verify-mutation`'s 500-character window. That fix is the fa24680 commit.
- Nothing else is off-scope. E1 and E5 are the custodian's.
