*Custodian's filing note (2026-10-02): the reviewer's gate 3 on PR #153, for PLAN node `exposure-scan-ci-backstop`, scoped to correction round 2 and the form's Amendment 2, full gating; the record cap's last round. Reviewed: cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 65793d6. Verdict FAIL on one record item (S1-1): Amendment 2's purpose clause about verify-mutation names no tool commit (round 15 (c)); the tool's last change is 7d24ed1. The gate-3 architect reduced the same item under the record cap, so it goes to the architect's reduction (`state/directives/2026-09-18-record-cap.md`, item (3)), not to a third round. S2-1 (the carrier and the PR body) was met on main before this filing: a carrier line on `workspace-rustfmt`, and the PR body's rows. Profile paths redacted at filing: none.*

---

VERDICT: FAIL. Reviewed cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645 (gate 3, correction round 2).

The code and test hunks pass and S2-1 is discharged. The verdict fails on one record item that the rules fail by name (S1-1). This is the piece's second correction round, so the record cap routes the fix to the architect's reduction rather than a round 3.

## S1

**S1-1. Amendment 2 makes a tool claim without naming the tool's commit (round 15 (c)).** `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:306` says T8's comment carries its own name "so that verify-mutation's window finds it". That describes how verify-mutation behaves, and no tool commit is named, so round 15 (c) fails it by name.
- **The claim is true.** verify-mutation was last changed at 7d24ed1, on both the branch and origin/main; the window is `MUTATION_WINDOW = 500` at `scripts/plan/verify-mutation.mjs:40`. With `--head c0277fc` it reports MISS for `a_clean_range_exits_zero_and_leaves_unchanged_lines_and_pure_renames_unscanned` (rc 1, 12 of 13). With `--head HEAD` it reports 13 of 13 (rc 0).
- **The fix is one appended reference:** "verify-mutation at 7d24ed1". Alternatively, drop the purpose clause in the reduction. Amendment 2 is append-only, so it cannot be edited in place.

## S2

**S2-1. Round 25 item 2 (d)'s carriers for the two branch-commit spans are missing.** The template's paragraph on a test-text span on an unmerged branch has two parts:
- **PR body.** The PR body must name the row and ask for a merge that keeps the commit reachable. #153's body does ask for "a merge commit, never squash or rebase". It does not name Amendment 2's class-3 rows. It is also stale: it still says 545 changed lines and mentions only Amendment 1.
- **PLAN node.** The post-merge hash pin is to be "carried until then by a PLAN node blocked on the piece". No such node exists on origin/main's PLAN.yaml. Amendment 2 item 3 (`:308`) sends the pins to "the closing record" instead.

Both can be fixed outside the branch: edit the PR body and add a node on main. Rule (d) itself fails by name only a hash pin at a branch commit or a span named without its commit id. Amendment 2 does neither.

## N

- **N-1. The discharge clause at `:304` names no item.** "the architect's S1, which this amendment discharges" can be resolved against Amendment 2 items 1 to 4 (the post-result line, the class-4 and class-3 rows, the index). Naming item 4 would make it resolve directly (round 7).
- **N-2. Two new comment lines pass 100 columns.** Test file `:1306` (T7) is 101 columns and `:1332` (T8, the test name) is 104. The test file already has 40 lines over 100 and no rule applies to it. The workflow header's maximum is 100.

## What to confirm, item by item

1. **S2-1 (gate 2) is discharged.** I applied the edit as `profile-path-scan.test.mjs:1305-1307` names it: in `stagedAddedLinesAgainst`, after the `parent !== 'HEAD'` push, `if (runGit(['rev-parse', '-q', '--verify', 'HEAD'], cwd) !== null) args.push('--bogus-option');`. T7 rc 1:
   - the first failure is at `:1297`, the finding assertion (actual false), with git's usage text in the message and "commit refused -- the profile-path scan aborted." in stderr;
   - so the init commit's `:1291` and `:1295-1296` (notEqual, `commit refused`) passed.

   Reverted with `git checkout --`; porcelain is empty.
2. **0e07e55 changes only T8's comment** (`:1332-1334`): one hunk, 3 added and 2 removed. The observation's words are unchanged and only re-wrapped. verify-mutation (tool at 7d24ed1) with `--base origin/main --head HEAD`: rc 0, 13 of 13. This checks that each mutation is recorded; it is not an observation of any mutation.
3. **Header** (`.github/workflows/exposure-scan.yml:25-26`, `:31-32`).
   - The clause "caught, if at all, only by the hooks of an armed clone under that person's own home" is true of the code: `localName` comes from `os.homedir()`'s basename, and `runner` is in `MACHINE_ACCOUNTS` (my gate-2 N-1 analysis; the scanner is unchanged since).
   - It quotes nothing.
   - No header line passes 100 columns (the maximum is 100, at `:4`, `:11` and `:25`). Both hunks are comment-only.
4. **Amendment 2** (`:296-314`).
   - **Spans.** Lines 1389-1391 of the test file at 5d3951f are M10's three-line "first case" record. Lines 1305-1307 at e0442e0 are the unscoped "Abort mutation … appended" sentence. Both are correct.
   - **Commits.** a5e2e79 (the header) and e0442e0 (T7, M7, M10) make up round 1. c0277fc and 0e07e55 make up round 2. All are correct, and none is on origin/main.
   - **Form.** The first line (`:298`) says post-result and "References only". There is no sha256 or `@ rev` pin anywhere in it.
   - **Index.** The superseded index (`:309-314`) covers both rounds.
   - **Append-only.** The only form hunk is additions after `:294`; Amendment 1 is untouched.
   - **Discharge claims.** Item 1's "confirmed there by gate 2's reviewer" resolves to my gate-2 report (M10 at case 4). Item 2's "observed at e0442e0 with that edit applied" resolves to my gate-2 run, and I re-observed it here at 65793d6.
   - **Cited reports.** All four gate reports it names are on origin/main.
   - **Item 2.** It does not call a verify-mutation run an observation. Its one defect is S1-1.
5. **Scope.** The diff touches three files only: the workflow (comments), the form (Amendment 2) and the test file (T7 and T8 comments). The scanner and hooks are untouched. All three commits are signed off.

## What I ran (exit codes)

- `git fetch -q origin`: rc 0. HEAD is 65793d6.
- **T7 with the scoped abort:** `node --test --test-name-pattern=a_staged_type_change_is_refused_by_the_pre_commit_hook scripts/hooks/profile-path-scan.test.mjs` (timeout 300), rc 1, first failure at `:1297`. Reverted with `git checkout --`, rc 0, porcelain empty.
- **Full suite:** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` (timeout 580), rc 0. 366 tests: 366 pass, 0 fail, 0 cancelled, 0 skipped.
- **verify-mutation** (tool at 7d24ed1):
  - `--base origin/main --head HEAD`: rc 0, 13 of 13.
  - `--base origin/main --head c0277fc`: rc 1, T8 MISS. This was a read-only check of the S1-1 claim.
- **§7 recount** with the form's command at `:220`, `422f8f8...65793d6`, rc 0:
  - `exposure-scan.yml`: 94+0
  - `profile-path-scan.mjs`: 85+1
  - `profile-path-scan.test.mjs`: 378+0
  - Total 558 over 3 files, within ≤800 over ≤3. No overrun, so no class 8.
- **Range scan:** `node scripts/hooks/profile-path-scan.mjs --range 422f8f8 65793d6`: rc 0. stdout "profile-path-scan: clean"; stderr "profile-path-scan: range read 11 commits, 584 added lines, 1 path names".
- **`gh pr checks 153`:** rc 0, all four pass, as seen:
  - every commit is signed off: run 37000392389
  - no profile path in the range: run 37000392402
  - test · verify:plan · queue/site drift: runs 37000392436 (pull_request) and 37000386818 (push)

  All four runs are at headSha 65793d6. `gh pr view 153` shows head 65793d6, OPEN, mergeable UNKNOWN.
- **Column checks** with awk on the workflow and the test file, and grep for sha256 or `@ ` in Amendment 2 (none found, rc 1).
- **Clean finish:** the final porcelain is empty, HEAD is still 65793d6, and no node process is left running.

Files:
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/hooks/profile-path-scan.test.mjs`
- `C:/dev/wt/exposure-scan-ci-backstop/.github/workflows/exposure-scan.yml`
- `C:/dev/wt/exposure-scan-ci-backstop/scripts/plan/verify-mutation.mjs`
