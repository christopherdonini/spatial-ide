*Custodian's filing note (2026-10-03): the gate-2 reviewer for PR #167 wrote this report to this path itself, through its shell as its brief permitted, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 34270837421e857a17c7dcaf3bb58a4464f73426c70a61b342e98ce91cfddc04, computed by the custodian. It equals the reviewer's returned sha256.*

---

VERDICT: FAIL
Reviewed cut/subagent-write-audit-script @ 8173b1e60c214ed0296df0628aa9fa3347a6d44e. PR #167, gate 2, reviewer.

Scope: correction round 1 (`git diff 7a9784cb 8173b1e6`) and the form's second Amendment, read in the worktree C:/dev/wt/write-audit after `git fetch` (origin's head equal to 8173b1e6; tree clean). Sources read on main at 14a9636f. Line cites into branch files are named in words at 8173b1e6, with no hash (round 15 (e)). Every mutation was reverted with `git checkout`, and the worktree was clean after each. Scratch fixtures were made in a directory outside both checkouts. No commit, no push, no tracked edit. The main checkout's index (DECISIONS-PENDING.md, state/CUT-STATE.md and worker report 4, all staged) was found that way and left untouched.

## S1 (blocking)

S1-1. A correction round without its superseded index (round 12, item 1 (e); the reviewer checklist fails it by name).
- The second Amendment is a gate correction round, and it supersedes text in the first Amendment and in the form:
  - the "Class 8" label;
  - "falls back to the script's directory";
  - the "Mutations added" clause "so that every new test has a recorded mutation", which gate 1's S1-2 found false at 7a9784cb;
  - the Out-of-scope line's single-gate claim.
- It ends at its "Worker report 4" bullet, with no index. Two supersessions are stated inline. The "every new test" clause is not marked at all: the Class 4 bullet says only that T4, T6 and T7 "now have mutations of their own".
- The `DECISIONS-PENDING.md` OPEN entry (on main at 50331054) recommends that the "Mutations added" bullet stand "as records of fact". Without an index, that leaves a false clause standing unmarked.
- Precedents: the correction block in `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md` was itself corrected for this defect, and the short form `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md` carries an index in its correction round.
- Fix: append a superseded index, one row per superseded span: the first Amendment's Class 8 label, its fallback phrase, its "every new test" clause, and the Out-of-scope line's single-gate clause. This is round 1 of the record cap's two.

## Checklist results

1. S1-3 (gate 1) is resolved.
   - Lines 85-95 of `scripts/hooks/subagent-write-audit.mjs` at 8173b1e6 push `line <n> is not parseable JSON: ...` onto `voids` for any non-empty line that fails `JSON.parse`.
   - The truncated-line probe was re-run, the scratch fixture outside both checkouts: one good Write to the allowed path, then a truncated Write to another path. Result: VOID, rc 1, voids ["line 2 is not parseable JSON: the audit cannot see what it carried"].
   - Further probes:

     | Fixture | Verdict | rc | Note |
     |---|---|---|---|
     | Truncated last line with no final newline | VOID | 1 | names line 2 |
     | CRLF line ends | PASS | 0 | correct: `\r` is JSON whitespace |
     | Whitespace-only lines | PASS | 0 | skipped |
     | Garbage only | VOID | 1 | line 1, plus zero calls |
     | A leading BOM | VOID | 1 | fail-closed |

   - Live seam re-run from the worktree against the three canonical transcripts (session e12d1b11-44e2-419b-9288-452e5556bf9f), with no regression:
     - a1761dc9daea9c1e5: PASS, rc 0.
     - aaa04ea882704ee94: PASS, rc 0.
     - a11d6c7e3a67ec44d: VOID, rc 1, 76 voids.
     - Each toolCounts equals gate 1's.
   - T9 tests the fix and asserts status 1, verdict VOID and /line 2 is not parseable/.
   - M6, observed by this gate at 8173b1e6: I commented out the `voids.push` in the catch and ran `--test-name-pattern="^T9:"`. The run gave `not ok 1 - T9: VOID on an unparseable line, naming its line number`, actual 0, expected 1, rc 1. Reverted; T9 then passes.
2. S1-2 (gate 1) is resolved.
   - T4, T6 and T7 each have their own `RECORDED MUTATION` comment directly above the test: M7, M8 and M9.
   - Observed by this gate at 8173b1e6, each test run alone, each reverted and passing again after the revert:
     - M7: `allowed === null || target !== allowed` became `allowed !== null && target !== allowed`. Result: `not ok 1 - T4: VOID under NONE with one Edit`, 0 !== 1.
     - M8: `.toLowerCase()` dropped from `norm`. Result: `not ok 1 - T6: PASS across slash and drive-letter case differences`, 1 !== 0.
     - M9: the usage path's `process.exit(2)` became `process.exit(1)`. Result: `not ok 1 - T7: exit 2 on a missing argument`, 1 !== 2.
   - Each failure matches its recorded assertion.
   - `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, "all 9 new test(s) have a recorded mutation naming them". Tool commit 7d24ed155a120556d6e726eea68237409270d975. That is a recording check, not an observation (round 25, item 2 (c)). The observations of record are the ones above.
3. S1-1 (gate 1) and the second Amendment.
   - Recount: `git diff --numstat origin/main...HEAD -- . ':!scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md'` gives 114 0 for the script and 179 0 for the test. That is 293 over 2 files, which equals the Amendment's figure. c656076e..8173b1e6 touches the form only, so the figure "at c656076e" holds at the head.
   - Class 6:
     - The first line carries "budget deviation, Scope not edited". The bullet records the declared figure and the final figure by §21c's counting rule, and the Scope line is unedited.
     - It closes the single-gate route and takes the architect gate, keeping the short form. That matches template §10 class 6 ("If the final figure crosses §21c's bound, ...") and AUTONOMY.md §21b's mid-piece clause ("the piece keeps its five-line form").
     - The overrun was over the bound at dispatch, not discovered mid-piece. The Amendment owns that as the custodian's error, and class 6's own condition does not require mid-piece discovery. Sound.
     - The bullet gives no reason for 264 rising to 293 (S2-1).
   - Class 4: the first line names it. "All four mutations are unit-only" satisfies class 4's last sentence. The bullet records each observed failure by name with its commit, in the test file's comments.
   - Pure append. The form is 25 lines at 7a9784cb and 43 at 8173b1e6. sha256 of the first 25 lines at 8173b1e6 = sha256 of the whole file at 7a9784cb = f05e9451a8b05e6c29de048ec51a75d88567459feb960d88433518c8713331f2. Lines 1-11 at 8173b1e6 equal the form at 8715ad1b (on main): c121ab13b48b9318682a80cfd66d337874d127191c335a3963452bedc3222e37. The five lines and the first Amendment are byte-unchanged. LF, no CR.
   - References:
     - The gate-1 report exists on main at 14a9636f. `tail -n +5 | sha256sum` gives a77bb1bd8c944145e65cf41cca366996ca309b15496772a1cc73e07569e30932, equal to its filing note.
     - `state/gate-log.json` record 367 (index 366) is node subagent-write-audit-script, reviewer, attempt 1, FAIL.
     - Worker report 4 and the DECISIONS-PENDING OPEN entry: staged only at 14a9636f when this review began; both committed on main at 50331054 during the review, and both resolve there (S2-2).
4. Gate 1's S2 and N items.
   - S2-1: the fallback is corrected in the Amendment, and the code (line 58 at 8173b1e6) falls back to `path.resolve(scriptDir, '..', '..')`. Addressed.
   - S2-2: the worktree-only clause sits above M2's comment in the test file at 8173b1e6, and the Amendment says so. Addressed.
   - S2-3: routed to the human, not re-classed. The OPEN entry is on main at 50331054 (S2-2).
   - S2-4: not taken. The reason is half sound (S2-3 below).
   - N-2: not taken. The reason ("cannot PASS") is sound. A throw exits 1 with no JSON, which a caller reading rc takes as not-PASS, so it fails closed.
   - N-1: the header is reworded at lines 22-25 of the script at 8173b1e6. It names `git rev-parse --git-common-dir` and "never git status or refs", which is accurate. The Amendment's note that worker report 4's third Deviations bullet is imprecise is correct: "export anything" is kept.
5. New in the round:
   - No regression: the seam re-run and the full suite.
   - No test that cannot fail: T9 fails under M6.
   - Two stale comments (S2-4).
   - The PR body now reads "T1 to T9, each with its own recorded mutation (M1 to M9)", which matches the file.
6. Round 25, item 2 fail-by-name list:
   - No full-form §7 overrun.
   - No class 9.
   - No record calls a verify-mutation run an observation. Worker report 4 lists it under Checks.
   - No test-text span pinned by hash at a branch commit. The S2-2 clause adds a comment line and supersedes no span.
   - The Out-of-scope line names no §21a category as touched.

## Exit codes

All runs are in the worktree at 8173b1e6, node v24.18.1. Each tool commit is the last commit touching that script at the head.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0. 424 tests, 424 pass, 0 fail.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1169 files, 38 loose advisories. Tool commit 522e448d55e089b974e115e23f0c72bfc6e1120a.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS (113 checked, 82 verified, 30 baselined, 1 advisory). Tool commit f9444a4d99a9087394c55d4b1d4c414a8b11f980.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 483 claims over 114 files. Tool commit e9735d4749f094f03b69a8b570e8bf10f511c279.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, 9 of 9. Tool commit 7d24ed155a120556d6e726eea68237409270d975.
- `timeout 570 node scripts/plan/verify.mjs`, tool commit 260720226f136d1ec7d72da64656f07d29400ed7:
  - First run: rc 124 (timed out, no output). At the same time, `gh pr checks 167` took several minutes to answer, and verify.mjs calls `gh api`.
  - `--offline`: rc 0, PASS.
  - Second online run: rc 0, PASS, 87 s.
- `gh pr checks 167`: rc 0, all pass. `gh run view` confirms each run at headSha 8173b1e60c214ed0296df0628aa9fa3347a6d44e, completed success:
  - Governance CI, push: 37128414650.
  - Governance CI, pull_request: 37128416910.
  - DCO sign-off: 37128416912.
  - Exposure scan: 37128416922.
  - `gh pr view` reported mergeable as UNKNOWN at its read.

## S2 (should fix in the same correction round)

S2-1. The Class 6 bullet records the declared and final figures but not the reason for the final figure. Template §10 class 6 requires "the reason". The first Amendment's reason covers 264 only. Fix: one clause naming the cause of the 29-line rise (T9, M6 to M9 and the parse fix), by reference.

S2-2. Resolved during this review; recorded for the trail. Two of the Amendment's references did not resolve on main when this review began:
- `state/consults/2026-10-03-subagent-write-audit-script-worker-report-4.md`;
- the `DECISIONS-PENDING.md` "OPEN 2026-10-03" entry.
At 14a9636f both existed only staged in the main checkout's index. Both were committed on main at 50331054 while this review ran, and both resolve there. Neither is Authority (the worker report is evidence), so the round-14 untracked-Authority rule is not engaged. No change asked.

S2-3. The S2-4 reason is half sound.
- "The Change line defines the verdict by the write and shell tools" is sound and suffices: the ruling's text governs Write calls.
- "no granted tool list reaches another tool today" is contradicted by the piece's own seam evidence:
  - The harness meta file for agent a1761dc9daea9c1e5 (under the main checkout's project slug, session e12d1b11-44e2-419b-9288-452e5556bf9f, `subagents/agent-a1761dc9daea9c1e5.meta.json`) records agentType general-purpose for "lead-data dispatch 2". `.claude/agents/lead-data.md`'s `tools:` line (Read, Grep, Glob, Write) did not bound that run, and the run made an Edit call.
  - SubagentHandback, in no `tools:` line, appears in all three seam transcripts, including the architect run (agentType architect; tools Read, Grep, Glob).
- Fix: drop or correct the clause, and carry to the follow-up that lead-data runs are dispatched as general-purpose. This report did not survey other transcripts.

S2-4. Two comments went stale this round:
- Lines 14-15 of the script at 8173b1e6 still list the VOID cases ending "transcript, or zero tool calls parsed, is VOID.", without the unparseable line.
- Line 5 of the test file at 8173b1e6 still reads "(Tests+mutation line, T1-T8)". T9 exists, and neither T8 nor T9 is on the Tests+mutation line.

## N (nits)

N-1. M2's comment names 8d296b9c as the observation commit. By the Amendment, the edit was applied to uncommitted work on 8d296b9c, so that id does not identify the code the mutation edited. The Amendment discloses this, and gate 1's re-observation at 7a9784cb is the observation that resolves.

N-2. The S2-2 clause was placed above M2's comment so that "mutation" stays inside verify-mutation's 500-character window (worker report 4). Clause order is now constrained by a tool heuristic. Noted for the follow-ups; no change asked.

N-3. The PR body's "An audit that cannot see everything never passes" holds for the transcript it reads. It does not cover a write made by another agent that this run spawns, or by a tool outside both lists (S2-3). Narrow it to the transcript read.
