*Custodian's filing note (2026-10-02): the reviewer's gate 1 on PR #153, for PLAN node `exposure-scan-ci-backstop`, full gating. Reviewed: cut/exposure-scan-ci-backstop @ 5d3951fbe337e78dfc6076e307763497b41362ff (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 5d3951f. Verdict PASS with four notes. N1 (M10's recorded case), N2 (T7's loose refusal assertion, also the architect's N2) and N4 (the header's "exactly") are taken in correction round 1, beside the architect's S2. N3 goes to the closing record. Profile paths redacted at filing: none.*

---

VERDICT: PASS — cut/exposure-scan-ci-backstop @ 5d3951fbe337e78dfc6076e307763497b41362ff

Gate 1 (reviewer) for PR #153, node `exposure-scan-ci-backstop`. Diff `422f8f8...5d3951f`. Spec `scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md`, §9 Reviewer bullets and §8 item by item. I found nothing at S1 or S2. There are four notes (N).

## Findings

**N1. M10's recorded first failure depends on how the mutation is applied, and the comment does not name the edit.** `scripts/hooks/profile-path-scan.test.mjs:1389-1391` records that the first case (all-zeros base) failed with 0 !== 2.
- I applied §4's M10 as written: `runGitCaptured`'s catch returns `''` instead of null (`scripts/hooks/profile-path-scan.mjs:491`). Under that edit cases 1 to 3 still exit 2, because `resolveCommit`'s empty result is caught by `if (!base || !head) abortRange();` at `scripts/hooks/profile-path-scan.mjs:522`. The first failure is case 4 (two unrelated roots), the status assertion at test line 1382, 0 !== 2.
- The recorded "first case" failure reproduces only when the `:522` guard is removed as well. I checked each case directly; with both edits, cases 1 to 4 all exit 0 with the clean line.
- The test is killed under either reading. To fix, the closing record (which §4 already has name the commit observed at) should also name the exact edit, or the comment should be re-recorded to the case-4 failure.

**N2. T7's refusal assertion would also pass on an abort.** `scripts/hooks/profile-path-scan.test.mjs:1296` checks only for `commit refused`. All four of the hook's refusal lines carry that text (`.githooks/pre-commit:30`, `:36`, `:40`, `:44`), so a staged scan that aborted on a type change would still pass T7. §1 may-claim 5 ("The staged mode reads type changes") needs the finding path. I drove the real hook live: commit status 1, stderr `link:1 unlisted-segment` followed by the "carries a profile path" line, no segment printed, HEAD unchanged. So the shipped code is right, and only the test is loose. Suggest asserting `link:1 unlisted-segment` or `carries a profile path`.

**N3. A failure after resolution prints the fact line as well as `aborted`.** `scripts/hooks/profile-path-scan.mjs:531` calls `abortRange()` (`:506`), which prints `profile-path-scan: range not computable` then `aborted`. §2 item 2's last bullet says such a failure prints `aborted`, and the worker's deviation list mentions only the bad-argument case. No test covers this path. I read §2's wording as non-exclusive and the extra line as true, so it is harmless. It is worth one line in the closing record.

**N4. One sentence in the workflow header overstates.** `.github/workflows/exposure-scan.yml:27` says, in paraphrase, that a paths filter would skip "exactly" the commits that carry a form. A paths filter skips events by changed path, so it could skip such commits; it would not skip exactly those. This is wording only and quotes nothing (§8 item 6 is satisfied). Suggest "could skip".

## 1. Full diff against §2 and §7
- **Files.** The three §7 files plus the form's appended Amendment 1. §7 and §§0–9 of the form are not edited.
- **CLI.** `--range` is dispatched after `checkCanary` (`profile-path-scan.mjs:658`). The argument guard is exactly two arguments, none empty and none starting with `-` (`:518`).
- **The four git argument sets match §2(a)–(d) exactly:**
  - (a) `rev-parse --verify <rev>^{commit}` for each end, then `merge-base`;
  - (b) the content diff with `-U0 -M --diff-filter=ACMRT <base>...<head>` (`:526`);
  - (c) the name diff with `--name-only -z -M --diff-filter=ACR` (`:529`);
  - (d) `log -z --format=%H%n%B <base>..<head>` with no `--no-merges` (`:530`).
- **Stderr and exit codes.** stderr is captured, never forwarded (`:491`). The count line (`:554`) and fact line match §7. Stdout is the clean or refused line on exit 0/1 and empty on exit 2.
- **Staged change.** One token, `ACMR` to `ACMRT` (`:442`). The name filter keeps `ACMR`.
- **Header.** One sentence, no quotation (`:12-14`).
- **Workflow.**
  - Triggers: `pull_request` [opened, synchronize, reopened] and `push` on `[main]`.
  - There is no paths filter, `pull_request_target`, `workflow_dispatch`, `concurrency`, `secrets.`, `continue-on-error`, `|| true` or install step.
  - Permissions are `contents: read`. The only actions are checkout@v4 (fetch-depth 0, persist-credentials false) and setup-node@v4 (node "24").
  - `${{ }}` appears only in `env` (lines 59–62).
  - The scanned head is `pull_request.head.sha`, not the merge ref.
  - Acceptance needs status 0 AND the exact clean line. Otherwise the step prints the consequence line and exits with the scanner's status, or 2.
- **No unused code.** The range mode is reached only through the CLI, and the workflow is its caller in the same PR. There is no new export.

## 2. M1–M13 re-observed
Each mutation was applied to the scanner in the worktree. I ran `node --test --test-name-pattern <name> scripts/hooks/profile-path-scan.test.mjs`, then reverted with `git checkout --`. My first run of M12 was invalid because a shell escape broke the scanner's syntax; I re-ran it correctly and the result below is the valid one. M2 needed a unique anchor because the staged mode has the same loop.

| Mutation | First failing assertion | Matches comment |
|---|---|---|
| M1 | status 0 !== 1 (`:1158`) | yes |
| M2 | status 0 !== 1 (`:1181`) | yes |
| M3 | status 0 !== 1 (`:1204`) | yes |
| M4 | status 0 !== 1 (`:1225`) | yes |
| M5 | status 0 !== 1 (`:1252`) | yes |
| M6 | status 0 !== 1 (`:1274`) | yes |
| M7 | `notStrictEqual` 0/0 (`:1295`) | yes |
| M8 | status 1 !== 0, `mv2.txt:1 unlisted-segment` | yes |
| M9 | first status 1 !== 0, `f.txt:1` | yes |
| M10 | see N1 | killed either way |
| M11 | the no-'fatal' assertion; stderr carried git's "Needed a single revision" | yes |
| M12 | "a refused segment or message text was printed" (`:1436`) | yes |
| M13 | status 1 !== 0, two `local-profile` findings | yes |

`git status --porcelain` was empty after all mutation runs and at the end.

## 3. Suites and tools (tool commit 2607202 for the verify scripts, from `git log -1` at 5d3951f)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0, 366 tests, 366 pass, 0 fail. No `profile-scan-*` temp directories were left.
- `verify-mutation --base origin/main --head HEAD`: rc 0, "13 new test(s) have a recorded mutation". This is a tool reading, not an observation.
- `verify-cites`: rc 0 (1052 files).
- `verify-quotes`: rc 0 (113 checked, 0 hash-reference errors).
- `verify-test-claims`: rc 0 (439 claimed).
- `verify.mjs` (verify:plan): rc 0, PASS.

## 4. T7 live
`git config core.hooksPath` in the worktree is `.githooks`. T7 uses the existing `initRepo` (`test.mjs:43-48`), which sets `core.hooksPath` to the worktree's real `.githooks`, and commits through `git commit` (`commit()`, `:50`). My own run of the same scenario, described in N2, refused on the finding path.

## 5. E1 to E4 by run id (`gh run view --log`)
- **E1, run 36975569067.**
  - pull_request, head 5d3951f, success.
  - env: PR_BASE 44f59c6…, PR_HEAD 5d3951f…, push fields empty.
  - Printed: `profile-path-scan: range read 6 commits, 551 added lines, 1 path names`.
  - Recomputed: `git rev-list --count 44f59c6..5d3951f` = 6, and the numstat added-line sum over `44f59c6...5d3951f` = 551. Both match.
- **E2, run 36975271367.** Push, head 5969fc2, failure. PUSH_BEFORE was all zeros. Printed the fact line, `aborted`, then `exposure-scan: the range is not accepted (scanner exit 2)`, and exited 2. As predicted.
- **E3, run 36975323133.** Push, before 5969fc2, after 59b7c6b, success. Printed `range read 1 commits, 1 added lines, 1 path names`. Recomputed: `rev-list --count 5969fc2..59b7c6b` = 1; numstat 1/0 on `probe-e3.txt`, status A. As predicted.
- **E4, run 36975368380.** Push, before 59b7c6b, after df19bac (parent 5969fc2), failure, exit 2 with the fact line. This is the declared "`before` absent from the clone" outcome. No local ref contains 59b7c6b.
- **The probe.** 5969fc2's parent is fa24680, and `git diff --stat fa24680 5969fc2` shows 1 file with one line changed (`branches: [main]` became `branches: [probe/exposure-scan-push]`). The workflow at 5d3951f carries `[main]`. `git ls-remote origin 'refs/heads/probe/*'` is empty, so the branch is deleted. All three probe commits still resolve by sha.

## 6. §7 recount
Its own counting command over `422f8f8...5d3951f` (merge base 422f8f8):
- `exposure-scan.yml` 91/0
- `profile-path-scan.mjs` 85/1
- `profile-path-scan.test.mjs` 368/0

Total 545 over 3 files, within ≤ 800 and ≤ 3. Not overrun, and §7 not edited.

## 7. Branch CI
`gh pr checks 153`, rc 0, four checks pass: signed-off, `no profile path in the range` (run 36975569067), and two runs of `test · verify:plan · queue/site drift`. The PR is open and not a draft, with head 5d3951f.

## 8. Leaks and §8
- `node scripts/hooks/profile-path-scan.mjs --range 422f8f8 5d3951f`: rc 0, clean (6 commits, 551 added lines, 1 path name).
- `git diff` has 0 matches for this machine's account name. The 6 matches in the commit messages are Signed-off-by name lines, not paths.
- No range-mode output carries a segment or message text. T11 and T12, M11 and M12, and my live T7 output confirm this, and the workflow never echoes `scan_output`.
- **§8 item by item:**
  - Items 1–9: none seen.
  - Item 10: the test header comment says a verify-mutation run is not an observation. The closing record is not written yet.
  - Item 11: none seen.
  - Item 12: Amendment 1 names its test span by branch commit 02bde66, with no hash. At 02bde66, T3 is at `test.mjs:1189` and its R100 assertion at `:1199`. Its first body line says it is a post-result amendment.
  - Item 13: not merged.
- The comment-only claims of 3942d6b and fa24680 are confirmed: no non-comment lines changed. 02bde66 changes only the test file.

## Ran (all in `C:/dev/wt/exposure-scan-ci-backstop` unless noted)
- `git status --porcelain`, `rev-parse`, `log`, `diff --stat`/`--numstat`/`--name-status`, `merge-base`, `rev-list --count`, `for-each-ref --contains`, `ls-remote`: rc 0.
- `git fetch -q origin` and `git fetch origin <three probe shas>`: rc 0. This updated the worktree's remote-tracking refs and FETCH_HEAD only, with no working-tree change. HEAD is still 5d3951f and porcelain is empty.
- The full suite (rc 0); the mutation harness (scratchpad scripts `mut.mjs`, `mut2.mjs`, `mut4.mjs`, `m10cases.mjs`, all rc 0, each reverting with `git checkout --`); `t7.mjs`, the live hook drive (rc 0, temp directory removed).
- The verify-* tools and `verify.mjs`, all rc 0; the `--range` reading, rc 0.
- `gh run view` for the four run ids (`--json` and `--log`), `gh pr checks 153` and `gh pr view 153`, all rc 0.
- I committed, pushed and edited nothing in the worktree, left no background process, and touched nothing in the main checkout.
- Versions: git 2.49.0.windows.1, node v24.18.1. The CI runner logged git 2.55.0.
