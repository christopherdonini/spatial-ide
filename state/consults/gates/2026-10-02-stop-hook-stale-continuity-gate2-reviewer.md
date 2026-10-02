*Custodian's filing note (2026-10-02): the reviewer's gate 2 on PR #161, for PLAN node `stop-hook-stale-continuity`, scoped to correction round 1 (7383018, b42c0dc). Reviewed: cut/stop-hook-stale-continuity @ b42c0dc554fdc1de846ed6598e5b2984af49b776 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at b42c0dc. Verdict PASS. With the architect's gate-2 PASS, the PR is ready for the human's click, merge commit only. S2-1 (M18 and M19 unit-only, `node --test` with no harness run) goes into the closing record as one clause, with the architect's gate-2 list. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/stop-hook-stale-continuity @ b42c0dc554fdc1de846ed6598e5b2984af49b776 (PR #161, gate 2, reviewer). Scope: correction round 1 only, 2542233..b42c0dc. The merge base and the branch's merge-base with origin/main are both fe1e6b7. My gate-1 PASS at 2542233 carries forward outside this delta.

## S1 (blocking)
None.

## S2
**S2-1. Amendment 2 item 2 (class 4) does not say whether M18 and M19 were unit-only.** `docs/PREREGISTRATION-TEMPLATE.md` §10, class 4, requires: "If no second harness run was made, say the mutation was unit-only." Item 2 records the observation at 2542233 and points to the RECORDED MUTATION comments, but it says nothing about a harness run. This exact omission has been raised before. `scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md` Amendment 3 (2) corrected Amendment 2 of that piece to "unit-only (`node --test`), with no harness run". This does not block, because the mutations themselves were observed (see check 2). Under the record cap, the fix belongs in the closing record as one clause, not a second correction round. The architect rules the route.

## N
- **N1. §7's timing sentence still says three calls and 11 s.** The comment at `stop-queue.mjs:60` now correctly says four calls and 13 s: the log, two shows and the stale path's `rev-parse` at `accountContinuation`. Item 6 says "Nothing else is superseded." §7 must not be edited, and the declared value of 2000 ms is unchanged. Still, as the record stands, a reader of the form meets the 11 s figure with nothing marking it wrong. The closing record could add a reference to item 3 for it.
- **N2. The buffer comment (`stop-queue.mjs:61`) credits the growth guard to "the form's I6".** I6 (form §5) is the stop invalidator for a blob larger than the 64 MiB buffer. The 1 MiB rationale lives in §0's ledger-size bullet. The comment is true in substance and no longer false (my gate-1 S2-1 is resolved); only the pointer is loose.
- **N3. Amendment 2 item 1 does not list the architect's gate-1 N6.** N6 is the same timing finding as my N1, and 7383018 answers it as well.
- **N4. The observation commit for M18/M19 is the branch commit 2542233, "with this change".** That is a named commit and not a hash pin, so round 25 (d) does not apply. It does mean §8 item 14's merge-commit requirement now also keeps 2542233 and 7383018 reachable.

## Checks

**1. 7383018's diff**
- `hooks.test.mjs` has +31 lines and 0 removed lines. Two tests are added, and their names match Amendment 2 item 2 byte for byte:
  - T18 `stop-queue: a ledger commit whose block has no flushed_at is not judged`: c0 from `stopFixture`, then c1 commits a block with no `flushed_at:` line;
  - T19 `stop-queue: a ledger commit that removes the ledger is not judged`: c1 is `git rm` of `state/CUT-STATE.md`.
- Each test asserts `block` plus `/^next: two-nodes-ready/` (the queue reason). Each then checks that stderr contains §7's whole line, `stop-queue: continuity not judged (<cause>); the stop continues to the next step.`, with the cause built from `headOf(dir)`, which is c1's `%H`.
- The stderr assertion has teeth. I changed one character in each cause string (`blocX`, `unreadablX`), and both tests failed on "stderr carries the not-judged line". Reverted.
- **`stop-queue.mjs`:** with `; //…` stripped, 2542233 and 7383018 are byte-identical, so only the two trailing comments changed. **README:** only the intro sentence of the decision order changed. "continuity is a new step 3, and the background-tasks allow moved from step 1 to step 4" is true against fe1e6b7's list (background was step 1) and the branch's list (steps 3 and 4).
- 7383018..b42c0dc touches only the form.

**2. M18 and M19, observed by me at b42c0dc (code identical to 7383018).** For each, I applied the mutation, ran the named test alone (1 test, 0 pass, 1 fail) and reverted with `git checkout`.
- M18 (`if (!current?.flushedAt) return { judged: true, stale: true, … }`): T18 fails. The first failing assertion is "The input did not match /^next: two-nodes-ready/", and the input is the stale reason with `flushed_at (null)`.
- M19 (the `blob === null` branch made stale): T19 fails at the same assertion.
- Both match their RECORDED MUTATION comments, and each comment names its own test. Unmutated, T18 and T19 pass.

**3. The suite.** `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` exits 0: 408 tests, 408 pass, 0 fail (node v24.18.1, git 2.49.0.windows.1). No `stop-continuity-*` temp directories were left behind.

**4. §7 recount.** I ran §7's own command, `git diff --numstat fe1e6b7..<head>` with §7's exclusions, at both 7383018 and b42c0dc. Both give 734 changed lines over 5 files: AUTONOMY.md 9, README 66, hooks.test 466, session-resume 5, stop-queue 188. 703 + 31 = 734.
- Amendment 2's first line carries `budget overrun, §7 not edited`.
- The form at b42c0dc is append-only: its first 296 lines are byte-identical to origin/main's and fe1e6b7's, and its first 322 lines to 2542233's. It is LF only and ends in `\n`.
- Item 6's superseded index names Amendment 1 item 1's figure (703 at 78681ec) and replaces it with 734 at 7383018.

**5. Classes and references**
- **Class 1:** the first line says it is a post-result amendment written after gate 1's results, the same shape as Amendment 1.
- **Class 8:** it records the declared 650/5, the final 734/5 at a named commit and base, and the reason by reference to Amendment 1 item 1 plus T18 and T19.
- **Class 4:** see S2-1.
- **References:** both gate-1 reports exist on main, and the finding IDs they cite (architect S2-1; reviewer S2-1, S2-4, N1, N2) all exist.
- **Quotes and hashes:** there are no quotations and no hash pins. The backticked cause fragments are byte-spans of §7.
- **Discharge claims:** "408 tests, 408 pass" at 7383018 resolves, since it differs from b42c0dc only in the form. "Observed at 2542233" resolves through my own observation on identical code.
- **Round 25 item 2:** the overrun is class 8 with §7 unedited; there is no scope addition; nothing calls `verify-mutation` an observation; no test-text span is hash-pinned at a branch commit; it is a full form.
- **Record cap:** this is correction round 1 of 2, and the amendment is references apart from the class-required figures.
- **Profile paths:** none in the delta or in the two commit messages. Both commits are signed off.
- **AUTONOMY.md:** main has gained no section since fe1e6b7 (main's last is §29), so §30 still holds.

**6. Generation.** `PLAN.yaml:3482` reads `generation: 3` for `stop-hook-stale-continuity` in the main checkout. It is committed on main at aef2030, which is HEAD and origin/main, and the bump from 2 to 3 is in that commit. The branch's PLAN.yaml reads 1. Main is authoritative, as at gate 1.

**7. CI.** PR head b42c0dc, MERGEABLE CLEAN. `gh pr checks 161` shows 4 of 4 passing, all at b42c0dc554fd; no wait was needed:
- DCO sign-off, pull_request, run 37071993697;
- Exposure scan, pull_request, run 37071993598;
- Governance CI, push, run 37071987761;
- Governance CI, pull_request, run 37071993651.

## Exit codes
Run in the worktree at b42c0dc. Each tool is named at its last-touching commit, and all of those commits are on main.
- verify-cites (@ 522e448): **0**. No advisory touches this piece's files.
- verify-quotes (@ f9444a4): **0**.
- verify-test-claims (@ e9735d4): **0**.
- `node scripts/plan/verify-mutation.mjs --base fe1e6b7 --head b42c0dc` (@ 7d24ed1): **0**, "all 19 new test(s) have a recorded mutation naming them". This only checks that the comments exist; it is not an observation.
- `timeout 570 node scripts/plan/verify.mjs` (@ 2607202): **0**, verify:plan PASS.

No hook was run against the main checkout; every execution used temp repos from the tests. The worktree `C:/dev/wt/stop-hook-stale` is clean at b42c0dc. I committed and pushed nothing.

Files:
- C:/dev/wt/stop-hook-stale/scripts/hooks/hooks.test.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/stop-queue.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/README.md
- C:/dev/wt/stop-hook-stale/scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md
- C:/dev/spatial-ide/PLAN.yaml
- C:/dev/spatial-ide/scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md (the unit-only precedent)
