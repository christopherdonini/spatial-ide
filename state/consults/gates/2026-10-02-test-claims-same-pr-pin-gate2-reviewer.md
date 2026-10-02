*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #156, for PLAN node `test-claims-same-pr-superseded-pin`, full gating, scoped to correction round 1 (7bff7c1..1546752). Reviewed: cut/test-claims-same-pr-pin @ 1546752eed9985722c8836f98ecdccbb77a50705 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 1546752. Verdict PASS. With the architect's gate-2 PASS, the PR is ready for the human's click, merge commit only. S2-1 (this report's cache probe, not M1, shows T1's merge half discriminating) and S2-2 (the section 7 count's commit; the gate-1 reviewer's N-1 and N-2) go to the closing record with the architect's S2-1 to S2-3. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/test-claims-same-pr-pin @ 1546752eed9985722c8836f98ecdccbb77a50705 (PR #156, gate 2, reviewer, node `test-claims-same-pr-superseded-pin`).

Scope: correction round 1, 7bff7c1..1546752 (0ce47aa, a758290, e9735d4, 270bc75, 1546752). Gate-1 PASS areas outside this delta carry forward. Branch-only lines are named by file and function or test. The worktree is clean (`git status --porcelain` is empty, HEAD 1546752). Every transient edit was reverted with `git checkout --`. Scratch repos were removed (0 left).

## Blocking
None.

## Suggestions

**S2-1. The recorded observation does not show T1's merge half discriminating. Only this gate's probe does.**
- Amendment 2 item 3 gives "M1 was re-observed at e9735d4" as T1's class-4 evidence.
- M1 fails on T1's branch half first (the assertion at `onBranch.findings`). So M1 never reaches the merge half that S2-1 was about.
- The proof that the merge half now runs (f2) and (f3) at a merge HEAD is item 3 below: the cache probe now fails T1 at the `onMerge.findings` assertion.
- The closing record should cite this report for that observation. Otherwise it should say that M1 does not discriminate the merge half.

**S2-2. Amendment 2 item 6 gives the §7 count (391) without the commit it was run at. §7 says the counting command is "run at a named commit".**
- My recount at 1546752 matches (item 7 below). The closing record should name the commit.
- Item 6's list of "gate-1 notes left to the closing record" names only the rebase notes (architect N-3, reviewer N-4). My gate-1 N-1 (name both a93090c and 76c6bfff for E2) and N-2 (re-read E1 at the head marked ready) are also closing-record items.
- Leaving the rebase notes to the closing record is acceptable. Nothing in code is owed. The closing record just must not call rebase tested.

## Notes

**N-1.** Amendment 1 is labelled class 9 and lands before its code (0ce47aa precedes a758290), so §8 item 11 is clear.
- Class 9's template text also asks for invalidators and §8/§9 items. Amendment 1 states neither, though §8 item 4 already covers the case.
- The trigger was a gate finding, not a standing rule, so class 9 is a cautious over-label. That is harmless and not a fail.

**N-2.** Amendment 2 item 4 says the counts on M2 to M9 "describe 0e20437 and stand". M1's comment ("63 of 64", at 0e20437) also stands and is left out.
- By reading only (not observed): M4 (f1 only) would now also fail T10. Its comment names 0e20437, so it stays true as recorded.
- The superseded index "None" holds on that reading.

**N-3. Nit.** In T10, the ref-file write puts a literal newline inside the template literal (bytes `01234567` LF backtick), not a `\n` escape. It behaves the same but reads like a broken line.

## Check items

**1. S1-1 is closed.**
- (f3) is `gitExitStatus(...) === 1`. `spawnSync`'s `status` is null on a spawn error or signal, so only exit 1 is accepted.
- (f2) (`gitSucceeds`) and the blame `try/catch` are unchanged. Every failure is false in both.
- I reproduced it without mocks, with a scratch script importing the shipped module on an S1-shaped temp repo. The "pre" column is the tool at 7bff7c1, swapped in transiently and then restored.

| Case | `merge-base --is-ancestor P1` exit | Head 1546752 | Pre (7bff7c1) |
|---|---|---|---|
| A, control | 1 | accepted, `samePr` | same |
| B, `origin/main` names a missing object (T10's shape) | 128 | 1 finding, 0 superseded | accepted, `samePr:true` |
| C, `origin/main` names a blob | 128 ("is a blob, not a commit") | 1 finding, 0 superseded | accepted |
| D, `origin/main`'s commit object corrupted | 128 ("inflate: data stream error") | 1 finding, 0 superseded | accepted |

**2. T10 and M10.**
- At a758290 (both files checked out): 64 pass, 1 fail. The failure is T10: "a git error is not a proof the line is introduced in the range: [...\"samePr\":true}]" then `1 !== 0`.
- At e9735d4: 65 of 65 pass. The tool is identical at e9735d4 and HEAD.
- M10 (`=== 1` becomes `!== 0`): 64 pass, 1 fail, T10 only, with the same first assertion as recorded. Reverted.

**3. S2-1 is closed.**
- I re-ran the gate-1 probe: `return false` when `rev-parse --verify -q HEAD^2` succeeds, placed after (f3)'s cache read.
- T1 now fails (64/1). The stack points to the `onMerge.findings` assertion, so it is the merge half.
- M1: 64/1, T1 only, failing at `onBranch.findings`, as its comment records.
- Cleanup: `mergeRoot` comes from the intercepted `fs.mkdtempSync`, so `after()` sweeps it. The linked worktree's admin directory sits inside the fixture's `.git` and is removed with it.
- Running T1 alone left 0 `verify-test-claims-samepr*` directories (0 before, 0 after). The repository's own `git worktree list` gained no entry.

**4. M3 and M7 at e9735d4.**
- M3: 62 pass, 3 fail (T3, T7, T10). The first failure is T3's "a claiming line already on main must not exempt…", unchanged. The added note's text is accurate: same first assertion, now also fails T10, 62 of 65.
- M7: 64/1, T7 only, with the first assertion unchanged.

**5. N-3 is closed.** `findMarkedSpan`'s doc now names `samePrAccept` (optional, consulted only when (e) ran and refused). It gives the return as `{ span, mainUnchecked, samePr }`, which matches both return statements.

**6. Amendment 2.**
- Each claim checks out against the commits: items 1 to 5 and 7. For item 6, see S2-2.
- Class 1 is right: the first line says post-result. Class 4 for T1 is the nearest fit (see S2-1).
- Superseded index "None" is correct. The form's diff is 23/0, appended only. No form line or recorded-mutation comment is made false. The existing comments are commit-named (0e20437), and the M3 line is appended, not substituted.
- No hash references, no line cites into the ledger, no bare self-lines, no class-3 test-text row. The round-25 test-text-span rule is not engaged.
- No record calls a `verify-mutation` run an observation.
- The prose is minimal: references with short verifiable claims. That is acceptable for a correction round's record.
- The cited worker report 2 is now on main (e04fdf7), byte-identical to the main-checkout copy (sha256 33004fcc…ed3d8).

**7. §7.** The form's command at merge-base 01b5ba0 ... 1546752 gives:
- `README.md` 12/0, `verify-test-claims.mjs` 108/15, `verify-test-claims.test.mjs` 256/0;
- total 391 lines over 3 files, against ≤ 650 and ≤ 3. No overrun.
- The test file shows 0 deletions against the base, so no existing test's lines were removed.
- There is no user-profile path in the delta.

**8. CI.** `gh pr checks 156` exited 0, with 4 of 4 passing. All four runs have headSha 1546752:

| Run | Check | Event | Result |
|---|---|---|---|
| 37030228548 | DCO | pull_request | success |
| 37030228771 | Exposure scan | pull_request | success |
| 37030220753 | Governance | push | success |
| 37030228614 | Governance | pull_request | success |

- Run 37030228614's checkout: `HEAD is now at 59f5bf26 Merge 1546752… into aedc5d59…`.
- It ran on git 2.55.0 (ubuntu): 376 tests, 376 pass. verify:test-claims PASS (464 claimed, 13 planned, 7 superseded, 17 withdrawn).
- This is E1 if 1546752 is the head marked ready.
- `mergeable` reads UNKNOWN. Main has moved to 8beb601 since that run's base.

## Branch runs
Exit codes were taken directly. Node v24.18.1, git 2.49.0.windows.1. `origin/main` was at aedc5d5 after the fetch. Each tool's last-change commit is in brackets.

| Run | Exit | Result |
|---|---|---|
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` | 0 | 376 tests, 376 pass |
| `verify-cites` [522e448] | 0 | |
| `verify-quotes` [f9444a4] | 0 | |
| `verify-test-claims` [e9735d4] | 0 | 464 claimed, 13 planned, 7 superseded, 17 withdrawn |
| `verify-mutation --base 01b5ba0 --head 1546752` [7d24ed1] | 0 | all 10 new tests named in a RECORDED MUTATION comment (a naming check, not an observation) |

## Files
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/verify-test-claims.mjs (`gitExitStatus`, `lineIsIntroducedInRange`, `findMarkedSpan`)
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/verify-test-claims.test.mjs (T1 `a_same_pr_superseded_pin_is_advisory_on_the_branch_and_on_its_test_merge`, T10 `a_git_error_in_the_range_check_does_not_exempt`, the M3 comment)
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md (§10, Amendments 1 and 2)
