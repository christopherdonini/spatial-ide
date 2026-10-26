Reviewed: PR #257 at 68dfa3b74d82e97da99852bc9c93be53c3d5df61 (base f031fa3c), gate 1, reviewer
Verdict: FAIL
cut/verify-cites-out-of-range-line-count @ 68dfa3b74d82e97da99852bc9c93be53c3d5df61

The FAIL is about wording only. The code is correct: the count fix, T1 to T4, M1 to M4 and the settlement run all hold. What blocks is one header sentence that still states the old bound, which makes the form's guarantee clause untrue at the head. None of the affected sentences is the human's wording (they are doc comments and the PR body), so under the wording-blocks rule (2026-10-11 directive, item 2; AUTONOMY §31) the worker applies the words below with no re-gate, and the PR body lists them.

## Correctness

**C1. The Out-of-scope guarantee clause is untrue at the head: one header sentence still states the bound as the line count.**
- **What the form says.** The clause says "the header's bound sentences are corrected to state the bound the code already applies". Note 1 says W1 makes "the bound sentence (lines 11-12) … true as worded". Note 5 says leaving the claim untrue "would be a Correctness finding".
- **What the head has.** scripts/plan/verify-cites.mjs:12 still reads "must be within that file's line count".
- **Why W1 does not cover it.** W1 (:15-20) defines being "within a file", not being within a file's line count. W1 itself uses "line count" for the true count ("that is one more than its line count"). And its "Here and below" sits three lines after :12.
- **What the code does.** checkCitation (:264) and checkPinned (:302) bound by `pieces`. So a cite to line 4 of a three-line file that ends in a newline passes, while :12 says it must fail. That is a claim of a limit the code does not apply.
- **Fix.** Change line 12 in place (the line count of the file stays the same), to read:
  `// both endpoints) must be within that file, as the bound below defines it. Every reference that does NOT resolve is`
- **Clause check:**
  - "within that file": W1 (:15-17) defines it as no higher than the piece count. The code is `maxL <= lineCount(repoRoot, c).pieces` (:264) and `maxL > lc.pieces` failing (:302). Holds.
  - "as the bound below defines it": W1 is at :15-20, below :12. Holds.
  - The kept words "(or, for a range, both endpoints)": the larger end must be within the bound (:261), and both ends must be at least 1 (:263). Holds.
- **Visible to an operator?** No. This is a header comment.

## Evidence

No findings.

## Documentation (each must be fixed before the merge; no re-gate)

**D1. A comment at scripts/plan/verify-cites.mjs:104 still states the old reading.**
- It says "an unpinned line cite past the end of either is advisory".
- At the head, a cite to the line just past the end of a ledger that ends in a newline is reported nowhere. W1 itself says such a cite "passes".
- The ledger rule (:365) also routes line-0 cites and no-match cites, not only cites past the end. W2's disclosure (:67-68) covers the gap in context, so this is graded Documentation.
- Replace line 104 with:
  `// The two rotating ledgers: an unpinned line cite into either that does not resolve is advisory, from any citing folder.`
- Clause check:
  - "unpinned": `!cite.pin` (:365).
  - "into either": `ROTATING_LEDGERS.has(cite.pathRaw.replace(/^\.\//, ''))` (:365), with the set at :105.
  - "that does not resolve": :362 returns on `ok`, and every other status (no-match, oob-exact, oob-suffix, line 0) reaches :365.
  - "is advisory": `advisory.push` (:366).
  - "from any citing folder": :365 has no condition on relPath.
  - All hold.

**D2. Two of the PR body's figures name no commit, and one is loose.**
- "2391 files scanned by both … 82 differences" is the worker's run over main ff406cea (worker report, lines 33-35), but the body says only "over main's tree". At 147cc32c my run gives 2392.
- "M1 to M4 each fail their test by name": M1 fails two tests.
- Replace the first two Evidence bullets with:
  - `- T1 to T4 fail at the base and pass at the head; M1 to M4 each fail the tests the form names, by name (M1 two, M2 to M4 one each), observed at 4ec98d9f and recorded in RECORDED MUTATION: comments.`
  - `- The base checker and the head checker over main's tree: at ff406cea (the worker) 2391 files scanned by both, at 147cc32c (the gate, a clean tree) 2392; in each run gated 0 and 0, advisory 97 and 97, and 82 differences, each the same finding with its reason's count one lower at the head; nothing else differs.`
- Clause check:
  - The worker report (lines 33-35) gives ff406cea, 2391, 0/0, 97/97 and 82.
  - My clean-tree run at 147cc32c gives 2392, 0/0, 97/97, 82 count-only and 0 other.
  - My M1 run fails T1 and T4; M2, M3 and M4 each fail one test.
  - The RECORDED MUTATION comments name 4ec98d9f.

**D3. The PR body does not list the words applied.**
- Note 1 and the wording rule say "the PR body lists them".
- Add:
  `**Words applied** (not the human's wording; no re-gate): W1 to W3 from the form's note 1, at scripts/plan/verify-cites.mjs:15-20, :67-68 and :239; the gate's words at :12 and :104.`
- Clause check: my comparison script found W1 spanning :15-20, W2 at :67-68 and W3 as the whole of :239. The C1 and D1 replacements are in place and keep their line numbers.

## What I checked

All commands ran in the foreground with output redirected to scratch files named `vcol-g1r-*`, each followed by its rc.

**Setup.**
- PR worktree: HEAD 68dfa3b7, porcelain empty. The merge base of origin/main and HEAD is f031fa3c.
- Main was 147cc32c at the start. `git log origin/main..HEAD` shows two commits: 4ec98d9f and 68dfa3b7.
- `git diff 4ec98d9f 68dfa3b7 --stat` gives 4 insertions in the test file only, so the mutation base 4ec98d9f has the head's code.

**1. The guarantee clause (rc=0 on each step).**
- The bound is still the piece count: `.pieces` at :264 and :302.
- `git diff origin/main...HEAD -- scripts/plan/` gives the test file as 31/0 (insertions only). The diff of rotate-decisions-pending.test.mjs is empty.
- `node --test scripts/plan/verify-cites.test.mjs` gives 36/36, rc=0.
- `node --test scripts/plan/rotate-decisions-pending.test.mjs` gives 12/12, rc=0.
- No cite changes outcome or tier (see check 5).
- The header part of the clause fails: C1.

**2. The diff (rc=0).**
- `git diff --numstat origin/main...HEAD` gives 21/14 for verify-cites.mjs and 31/0 for verify-cites.test.mjs: 66 lines in the Scope's two files, within the budget of 100.
- `countOf` (:240-243) is unexported and returns `{pieces, lines}`, with `lines = pieces - 1` when the text is empty or ends in `\n`.
- The bound uses `pieces` (:264, :302). The three count-bearing reasons print `lines` (:268, :274, :303).
- The line-0 reasons (:267, :273, :301) and `Math.max(cite.startL, cite.endL)` (:261, :289) are unchanged.
- The only callers of `lineCount` and `countOf` are in verify-cites.mjs (grep over scripts/, rc=0).
- Correctness of the change: a cite fails only when it is above `pieces`, which is never less than `lines`, so a printed count is never at or above the cited line.

**3. W1 to W3.**
- A one-off scratch script (not committed) took each W from note 1 and searched the head's comment text, with the `//` markers stripped and the wrapped lines joined at spaces. Each was found exactly once:
  - W1: at :15-20, directly before "PINNED FALLBACK:" (:21).
  - W2: at :67-68, directly after "same-basename siblings; " and before " and, by the tiering above".
  - W3: as the whole of :239, above the helper; the old comment at the base's :237-238 is gone.
- The search for the old reading (`grep -i -E` over lenient, line count, past the end, file's length, trailing newline and similar) gave rc=0. Its pattern was checked positive: "lenient" counts 1 at main's file and 0 at the head. Its hits gave C1 (:12) and D1 (:104).
- The other hits fall below W1's "Here and below" and are true under it: :24, :50, :255, :281.
- The test file's top RECORDED MUTATION comment (:6-10) stays true, as note 1 says.

**4. T1 to T4, and M1 to M4.**
- At the head, all four pass (see 1).
- At the base: in the throwaway C:/dev/wt/vcol-g1r (detached at 68dfa3b7), with the f031fa3c verify-cites.mjs written over the head's, the head's tests give rc=1: tests 36, pass 32, fail 4, exactly T1 to T4. The actual reasons were:
  - T1: `(4 lines)`
  - T2: `(4 lines)`
  - T3: `… (6 lines)`
  - T4: `line 2 exceeds "engine/src/pool.rs" (1 lines)`
- After `git checkout --`, the porcelain was 0 bytes.
- I applied each mutation myself by an exact one-occurrence replacement (no verify-mutation), ran the test file, reverted, and found the porcelain at 0 bytes after each:
  - M1 (:268 `.lines` → `.pieces`): rc=1, fail 2. T1 fails, and T4 too, as the form says.
  - M2 (:274): rc=1, fail 1, T2 only.
  - M3 (:303 `${lc.lines}` → `${lc.pieces}`): rc=1, fail 1, T3 only.
  - M4 (the `text === '' ||` term dropped): rc=1, fail 1, T4 only (actual `(1 lines)`).
  - My first M4 attempt failed to apply (0 occurrences, because the shell collapsed a backslash), changed nothing (porcelain 0) and was redone.
- Each `RECORDED MUTATION:` comment (test file :512, :520, :528, :535) names its mutation, the failing test(s) by name and 4ec98d9f9e90e3f437073507fd0e1ad6b60c9629, a commit on the branch.

**5. The settlement run.**
- Main's verify-cites.mjs (identical to f031fa3c's: `git diff --quiet` rc=0) and the head's were copied to scratch and run with `runVerifyCites({ repoRoot: 'C:/dev/spatial-ide' })`. Main's HEAD was 147cc32c both before and after.
- **Deviation: main's porcelain was not empty.** `--untracked-files=no` gave 292 bytes, the same before and after (cmp rc=0). These were staged changes to CUSTODIAN-QUEUE.*, DECISIONS-PENDING.md, PLAN.yaml, site/*, state/CUT-STATE.md and state/FILLER-QUEUE.md, plus one staged new directive. Main later moved to fb361420, which adds that content; I did not check it byte for byte, and verify-cites.mjs is unchanged in it.
  - Main checkout result: scanned 2393/2393, gated 0/0, advisory 97/97. 15 identical, 82 count-only (all advisory), 0 other.
- **Clean-tree rerun.** I also ran both checkers over a clean tree: the throwaway checked out at 147cc32c, porcelain empty before and after.
  - Result: scanned 2392/2392, gated 0/0, advisory 97/97. 82 count-only, 0 other.
  - No base-only or head-only key, no tier change, and no other reason difference. The comparison key was relPath, citeLine and target, with tiers and multiplicity compared too.

**6. The scripts at the head (68dfa3b7, in C:/dev/wt/vcol).**
- The governance suite (`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`) ran inside one shared hold, which was granted and released. It gave tests 561, pass 561, fail 0.
  - The rc could not be printed after the hold-shaped call's `exit $rc`. The tool reported no non-zero exit.
- `verify.mjs --offline`: rc=0, PASS.
- `verify-cites.mjs`: rc=0, PASS, 2391 files, 97 advised.
- `verify-quotes.mjs`: rc=0, PASS.
- `verify-test-claims.mjs`: rc=0, PASS, 661 claims.
- The worktree's porcelain was empty after them.

**7. The PR and CI.**
- `gh pr view 257`: draft, head 68dfa3b7. The body's 66 of 100, the 5 gated with the bound fixed (the settlement) and the 561 hold. For its other figures see D2 and D3.
- `gh pr checks 257` (rc=0): all pass. The runs, all at head 68dfa3b7, all completed with success:
  - 40214644122 Governance CI (pull_request)
  - 40214584748 Governance CI (push)
  - 40214644069 and 40214584681 Ported notices
  - 40214644048 DCO
  - 40214644050 Exposure scan
  - the cfg-boundary jobs inside the Governance runs
- Nothing was pending, so no wait loop was needed.

**Cleanup.**
- `git worktree remove C:/dev/wt/vcol-g1r`: rc=0, its porcelain empty first, no `--force`. `git worktree list` no longer shows it, and the folder is gone.
- PR worktree porcelain: 0 bytes, HEAD 68dfa3b7.
- The only node.exe still running is PID 30540, started 2026-10-22T17:28Z, which I did not start. Every process I started has ended.
- I made no commits, pushes or PR actions, and wrote nothing outside the scratch folder and the throwaway.
