*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #153, for PLAN node `exposure-scan-ci-backstop`, scoped to correction round 1, full gating. Reviewed: cut/exposure-scan-ci-backstop @ e0442e0c9b1b4e52ad13acc86e3979e115f597ce (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at e0442e0. Verdict PASS with one S2 (S2-1): T7's recorded abort observation names an edit that also aborts the root commit, so the observation as worded is false; the property holds with the abort scoped to the type-change commit. It is taken in correction round 2, with N-1 and N-3. Profile paths redacted at filing: none.*

---

VERDICT: PASS. Reviewed cut/exposure-scan-ci-backstop @ e0442e0c9b1b4e52ad13acc86e3979e115f597ce. The verdict carries one S2. It is a comment-only fix, and a re-read of that hunk is enough for this verdict to hold.

The round's diff (`git diff 5d3951f e0442e0`, commits a5e2e79 and e0442e0) touches only the four changes in scope: two header-comment hunks in `.github/workflows/exposure-scan.yml`, plus the T7 assertion and the M7 and M10 comments in `scripts/hooks/profile-path-scan.test.mjs`. It changes 14 lines added and 6 removed over 2 files. The scanner, the hooks and the form are untouched.

## S1
None.

## S2

**S2-1. The recorded abort observation is not what its named edit produces.** The comment is at `scripts/hooks/profile-path-scan.test.mjs:1305-1307`. It records that appending `'--bogus-option'` to the staged content diff's arguments made the finding assertion fail while the `commit refused` assertion passed.
- **The edit as worded.** I applied it as the comment words it: `'--bogus-option'` appended to the args array at `scripts/hooks/profile-path-scan.mjs:442`. Twice, the first failure was test line 1291, the `init` commit's `assert.equal(r.status, 0)`. The output showed actual 1, expected 0, stderr "commit refused -- the profile-path scan aborted." The root commit's staged scan aborts too, so the test never reaches line 1296 or 1297. The comment's "Observed:" sentence is false for the edit it names. Report 2's line 22 has the same problem.
- **The property itself holds.** I scoped the abort to the type-change commit by pushing `'--bogus-option'` only when `git rev-parse -q --verify HEAD` resolves. With that edit, the `commit refused` assertion at 1296 passed and the new assertion at 1297 failed. Its message was git's usage text, and stderr carried "commit refused -- the profile-path scan aborted." So T7 now does catch an abort.
- **Fix.** Name the scoped edit in the comment (the abort only once HEAD resolves, so the root commit's scan is clean), or drop the abort sentence. The form's mutation table does not require it; the form's §4 lists M1 to M13 only. This is the same defect class as my gate-1 N1, now on the new sentence. Report 2's line 22 should not be cited as evidence for the abort.

## N

**N-1. Change 1's wording is true of the code; one clause could be tighter.** The header at `.github/workflows/exposure-scan.yml:23-25` quotes nothing.
- **What the code does.** `localName` is `path.basename(os.homedir())` (`scripts/hooks/profile-path-scan.mjs:629`). The workflow runs on `ubuntu-latest` (`exposure-scan.yml:45`), so the home's basename is `runner`. `runner` is in `MACHINE_ACCOUNTS` (`profile-path-scan.mjs:27`), which spares it in rule (iii) (`:216`) and in `classifySegment` (`:61-62`). No other rule matches a flattened form: `WINDOWS_ROOT` needs a drive and a separator (`:85`), and `POSIX_ROOT` needs `/users/` or `/home/` (`:89`).
- **Live check.** I ran `--message` over a line carrying the flattened forms `C--Users-<invented>` and `home-<invented>`. With HOME and USERPROFILE set to `runner` it printed the clean line, rc 0. With both set to the invented name it found `local-profile` twice, rc 1.
- **The loose clause.** "is caught only by an armed clone's local hooks" is accurate only for a clone whose home is that person's. Another person's armed clone does not catch it either. If the hunk is touched for S2-1 anyway, "caught, if at all, only by the hooks of an armed clone under that person's own home" would be exact. Not required.

**N-2. The header and the form's §1 now word this item differently.** The header lists a person's flattened form as one of the items "The preregistration's section 1 lists". §1's item at `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:59` names "the scanning machine's own flattened profile form, in CI", which is the misstatement the architect's S2 fixed in the header. The form is not edited (§8 item 11). Note the difference in the closing record.

**N-3. Change 2's reflow left one long line.** "could skip" is present at `exposure-scan.yml:29`. The reflow left line 30 at 113 columns; the rest of the header wraps at 100. Wording only.

**Changes 3 and 4 hold.**
- **T7 unmutated:** passes (1/1, rc 0).
- **M7:** I set `:442`'s filter to `ACMR`. The test failed at test line 1295, the `notStrictEqual` on the commit status (actual 0). That matches the re-observation recorded at 1304.
- **M10 as the form's row at line 166 and the comment at 1394-1397 word it:** I changed `runGitCaptured`'s catch at `profile-path-scan.mjs:500` to return `''`. To identify the case, I temporarily changed the assertion message at test line 1387 to print the case index. The first failure was **case 4**, the status assertion at 1387, 0 !== 2, with stderr "range read 1 commits, 0 added lines, 0 path names". Cases 1 to 3 passed, matching the comment.

Each mutation was reverted with `git checkout --`. `git status --porcelain` is empty, HEAD is still e0442e0, and no background process was started.

## What I ran (exit codes)
- `git fetch -q origin`: rc 0. HEAD and `origin/cut/exposure-scan-ci-backstop` are both e0442e0.
- `node --test --test-name-pattern=a_staged_type_change_is_refused_by_the_pre_commit_hook` on the test file: unmutated rc 0, M7 rc 1, abort as worded rc 1 (twice), scoped abort rc 1.
- `node --test --test-name-pattern=a_range_that_cannot_be_computed_aborts` with M10 applied: rc 1, case 4.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (timeout 580): rc 0. 366 tests, 366 pass, 0 fail, 0 cancelled, 0 skipped.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, captured directly with output to a file. PASS line: "verify:mutation PASS — all 13 new test(s) have a recorded mutation naming them." This run checks that each mutation is recorded; it is not an observation of any mutation.
- §7 recount with the form's command at `EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:220`, merge base 422f8f8, head e0442e0 (rc 0):
  - `.github/workflows/exposure-scan.yml`: 93+0
  - `scripts/hooks/profile-path-scan.mjs`: 85+1
  - `scripts/hooks/profile-path-scan.test.mjs`: 374+0
  - Total 553 changed lines over 3 files, within ≤800 over ≤3 files. No overrun.
- `node scripts/hooks/profile-path-scan.mjs --range 422f8f8 e0442e0`: rc 0. Stderr "range read 8 commits, 559 added lines, 1 path names"; stdout "profile-path-scan: clean".
- `gh pr checks 153`: rc 0, all 4 checks pass (no profile path in the range, every commit is signed off, and test · verify:plan · queue/site drift twice). `gh pr view 153` gives head e0442e0, OPEN, mergeable UNKNOWN. Run 36976961522 (pull_request) is headSha e0442e0, success.
- The scanner's `--message` mode on a scratch file of invented flattened forms (N-1): rc 0 under a `runner` home, rc 1 under the invented home.

Files: `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/profile-path-scan.test.mjs`, `C:/dev/wt/exposure-scan-ci-backstop/.github/workflows/exposure-scan.yml`, `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/profile-path-scan.mjs`, `C:/dev/spatial-ide/state/consults/2026-10-02-exposure-scan-ci-backstop-worker-report-2.md`.
