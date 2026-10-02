*Custodian's filing note (2026-10-02): the architect's gate 2 on PR #156, for PLAN node `test-claims-same-pr-superseded-pin`, full gating, scoped to correction round 1 (7bff7c1..1546752). Reviewed: cut/test-claims-same-pr-pin @ 1546752eed9985722c8836f98ecdccbb77a50705 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 1546752. Verdict PASS. S2-1 (Amendment 1 is class 4 with class 1, not class 9), S2-2 (the superseded index leaves out Amendment 1 item 3 as to T1) and S2-3 (neither T1 nor E2 discriminates H2's merge clause; reasoned) are carried by the closing record, as the report rules; together they are the piece's record-correction round 1 of 2. N-3 is met by e04fdf7, which committed worker report 2 on main. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/test-claims-same-pr-pin @ 1546752 (1546752eed9985722c8836f98ecdccbb77a50705). This is PR #156, gate 2, architect, for node `test-claims-same-pr-superseded-pin`.

**Scope.** I reviewed only the delta after 7bff7c1: 0ce47aa, a758290, e9735d4, 270bc75 and 1546752. The commit order comes from the worktree's HEAD reflog, and 0ce47aa comes before a758290. My gate-1 PASS areas outside this delta carry forward. I ran nothing, because I have no Bash, so the reviewer recomputes the counts and the observations. Cites to lines on main are rooted. Lines that exist only on the branch are named by file and function or section.

## S1
None.

## S2 (the closing record carries these; none of them blocks the merge)

**S2-1. Amendment 1 is filed under the wrong class. It should be class 4, not class 9.**
- **What class 9 requires.** By `docs/PREREGISTRATION-TEMPLATE.md:170`, class 9 applies when "a standing rule of the human, a permanent ruling or a standing directive, adds work to a piece already preregistered." Its first line must cite that rule by round and item, or by the directive's path.
- **Why Amendment 1 does not meet it.** Amendment 1 cites no such rule. It cites two gate reports. The work comes from a gate finding against the form's own §2 item 3 last paragraph and §8 item 4, which bound the piece before any finding.
- **Why class 4 fits.** By `docs/PREREGISTRATION-TEMPLATE.md:115`, class 4 is "A mutation added or corrected after a gate finding". The reviewer's gate-1 S1-1 asked for exactly that: a test with its own recorded mutation (`state/consults/gates/2026-10-02-test-claims-same-pr-pin-gate1-reviewer.md:21`).
- **Class 4 is a fit, not an exact fit.** Its text speaks of an existing test whose mutation is missing. Here a whole test was missing. That is closer than any other class, so nothing needs routing under `docs/PREREGISTRATION-TEMPLATE.md:99`.
- **No harm.** Declaring the test before its code was over-compliance. Nothing was landed against an undeclared shape.
- **The fix under the record cap.** This is the piece's record-correction round 1 of 2. The closing record gets one correction row, at most three sentences by round 12 (d):
  - the defect: Amendment 1 is labelled class 9 but cites no standing rule;
  - the corrected reference: class 4, plus class 1 because it was written post-result;
  - the proof: Amendment 1 item 1 names gate reports as its source.
- No new clause comes of it (the record cap).

**S2-2. The superseded index "None" (Amendment 2 item 7) leaves one line out.**
- Amendment 1 item 3 declares "every other test" unchanged.
- In the same round, a758290 changed T1's code. Amendment 2 item 3 records that change under class 4.
- Read literally, Amendment 1 item 3 is now false as to T1.
- The closing record's superseded index must list Amendment 1 item 3 ("every other test", as to T1), superseded by Amendment 2 item 3. This is the same record-correction round as S2-1.

**S2-3. T1 now runs (f2) and (f3) at a merge HEAD, but neither T1 nor E2 discriminates §0 H2's merge clause.**
- **What the change fixed.** The reviewer's S2-1 found that T1's merge half read from the caches its branch half had filled. T1 now scans a separate `git worktree add --detach` root, so that defect is gone.
- **Why it still does not discriminate.**
  - Both T1 and E2 are positive cases: the claiming line exists only on the PR side.
  - Blame may credit the line to P1 or to the merge commit itself. Neither commit is an ancestor of `origin/main`, so both read as "in range" and both pass.
  - The case that matters for fail-closed is the opposite one: a line that is unchanged since main is never credited to a merge commit. That case is tested only at a branch tip (T3), never at a merge HEAD.
- **What the closing record must say.**
  - H2's merge clause is exercised by T1 and E2 and discriminated by neither. It is reasoned from blame's semantics, the same way rebase is reasoned (see the next point).
  - It must not say T1 or E2 alone discriminates it.
  - An optional alternative is a merge half for T3, recorded as class 4. I do not require it.
- **A correction to my own gate 1.** My gate-1 N-1 (`state/consults/gates/2026-10-02-test-claims-same-pr-pin-gate1-architect.md:29`) says "blame still credited the line to 880a13a". E2's listing shows the pin's rev, not blame's commit, so that statement is unsupported. The reviewer's N-1 makes the same statement (`state/consults/gates/2026-10-02-test-claims-same-pr-pin-gate1-reviewer.md:40`). The closing record carries neither.

## N

- **N-1. Deferring rebase to the closing record is acceptable.** This covers my gate-1 N-3 and the reviewer's N-4. They impose a wording duty, not code. The closing record must say rebase is reasoned, not tested. §1 may-claim 3 cites T4, which tests squash only.
- **N-2. Amendment 2 item 6 gives the count of 391 changed lines over 3 files without naming its commit.** §7 requires a named commit. Worker report 2 ran the count at merge-base…270bc75; 1546752 touches only the form, which §7 excludes. The closing record names both ends of the count, and the reviewer recounts.
- **N-3. Amendment 2 item 1 cites worker report 2, which is still untracked on main.** It is cited as evidence, not Authority (the round-15 distinction), so this is not a defect. Commit it on main before the PR merges.
- **N-4. Commit 270bc75's message says it records the re-observations of M1, M3 and M7.** Only M3's comment gained a line. The comments on M1 (in T1) and M7 still name 0e20437 only, which remains true as history. The proof that M1 and M7 were re-observed at e9735d4 is worker report 2 plus the reviewer's own re-observation. This is not a record defect, because a commit message is not a record. Amendment 2 item 4 states it accurately.
- **N-5. T10 writes `.git/refs/remotes/origin/main` directly.** This depends on git's files ref backend. Under reftable, the write would be ignored and T10 would fail red, so the failure is loud, not silent. Nothing is owed now.

## Asked items
1. **(f3) as fixed in e9735d4: it meets §2 item 3's last paragraph and §8 item 4.**
   - In `lineIsIntroducedInRange`, the range test is `gitExitStatus(...) === 1`.
   - `gitExitStatus` uses `spawnSync` with an argument array. It returns `status`, which is null on a spawn error or a signal. So exit 128, a null status and any other code all read as not accepted.
   - A blame failure still lands in `catch`, which reads false.
   - The memoization and the three-spawn ceiling (§2 item 6) are unchanged.
   - §1's may and may-not claims all still hold. The fix only narrows (f3), and the `if (anc.checked && !anc.ok)` guard in `findMarkedSpan` is untouched.
   - The README's line "Any git failure is not acceptance" and the tool comment "Any git failure is false" are now true. Both were false at 7bff7c1.
2. **Class 9: misfiled.** The correct record is class 4 with class 1, carried by one correction row in the closing record (S2-1). This counts as record-correction round 1 of 2.
3. **Amendment 2.**
   - Classes 1 and 4 are right for T1's rework and M1's re-observation.
   - The claims are references, within round 12 (d)'s ceiling of three sentences per item, and none restates an earlier amendment.
   - The discharge claims resolve. The proof for T10 failing at a758290 and for M10 at e9735d4 is the RECORDED MUTATION comment on `a_git_error_in_the_range_check_does_not_exempt`.
   - The superseded index "None" is incomplete (S2-2).
   - Deferring rebase is acceptable (N-1).
4. **T1:** the path is now exercised but not discriminated (S2-3). The closing record says that neither T1 nor E2 discriminates the merge clause, and that it is reasoned.
5. **R1–R6 on the delta: clear.**
   - No `process.platform`, no shell, no skip, no timeout, and no drive-letter literal.
   - T1's `mergeRoot` comes from the patched `fs.mkdtempSync` under `os.tmpdir()`, so the `after()` sweep removes it. The linked worktree's metadata lives inside the fixture's `.git`, so removing the fixture removes it too.
   - The merge commit takes the fixture's local user config, which the linked worktree shares.
   - T10 builds its path with `path.join`.
6. **§8, item by item, on the delta.**
   - 1: clear. `samePrAccept` is built only in `findSupersededSpan`, and `isAncestorOfMain` is unchanged.
   - 2: clear. In `findMarkedSpan`, e9735d4 changed only the doc comment.
   - 3: clear.
   - 4: clear (item 1 above).
   - 5: clear. The delta touches the form, `verify-test-claims.mjs` and its test file.
   - 6: clear.
   - 7: clear.
   - 8: clear. The new comments quote nothing, and assertion output is tool output (gate-1 N-5).
   - 9: clear. `gitExitStatus` is not exported, and `lineIsIntroducedInRange` is its product caller.
   - 10: clear. No `verify-mutation` run is called an observation, and M1, M3, M7 and M10 are each named at e9735d4.
   - 11: clear. 391 is within ≤ 650, over 3 files, and 0ce47aa precedes a758290. The class label is S2-1.
   - 12: clear, apart from S2-2's index content. There is no ledger line cite, no hash at a branch commit, and no bare self-line. Commits are named by id with no hash. Both amendments say post-result in their first body line.
   - 13: pending. The merge method is decided at the click, and it must be a merge commit.
   - 14: clear. There is no profile path in `scripts/plan/` on the branch.

## Files
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/verify-test-claims.mjs
- C:/dev/wt/test-claims-same-pr-pin/scripts/plan/verify-test-claims.test.mjs
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-test-claims-same-pr-pin-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-test-claims-same-pr-pin-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-02-test-claims-same-pr-pin-worker-report-2.md
