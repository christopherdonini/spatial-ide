*Custodian's filing note (2026-10-02): the architect's gate 2 on PR #161, for PLAN node `stop-hook-stale-continuity`, scoped to correction round 1 (7383018, b42c0dc). Reviewed: cut/stop-hook-stale-continuity @ b42c0dc (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at b42c0dc. Verdict PASS. S2-1 (M18 and M19's observation is the gate-2 reviewer's at b42c0dc, not 2542233) and S2-2 (§7's three-call timing sentence is superseded by the code comment) go to the closing record, whose list is this report's item 4. On N1: generation 3 is committed on main at aef2030. Profile paths redacted at filing: none.*

---

VERDICT: PASS
Reviewed cut/stop-hook-stale-continuity @ b42c0dc. PR #161, gate 2, architect. Scope: correction round 1 only (7383018, b42c0dc). Gate 1's PASS at 2542233 carries forward outside this delta.

Branch cites are read at b42c0dc and pinned by no hash, because a hash may not be pinned at a branch commit. Ledger rulings are cited by round and item. Everything not marked byte-copied is my paraphrase. I have no Bash: I did not run the suite, the counts or the mutations, so those are for the reviewer. I read commit order and messages from the worktree's reflog.

Result: no S1, two S2 and four N.

## 1. My gate-1 S2-1: discharged as I specified
- **T18 matches the spec.** It is at `scripts/hooks/hooks.test.mjs:729-739`.
  - The fixture is c0, then a c1 whose block has a heading and a `tip:` line but no `flushed_at:` line. `parseSessionContinuity` therefore returns `flushedAt: null` (`precompact-flush.mjs:73-78`), and the code reaches `stop-queue.mjs:238` and no other branch.
  - It asserts `block` with the queue reason and §7's exact stderr line, with `<%H>` from `headOf`. The line match is exact (`split('\n').includes`), not a regex.
- **T19 matches the spec.** It is at `hooks.test.mjs:745-754`. c1 is `git rm` of the ledger. A deletion changes the path, so the `log` walk lists c1, `show c1:` fails, and the code reaches `:236`. The asserts take the same form as T18's.
- **M18 and M19 are the right shapes.** Each mutation turns a not-judged cause into a stale verdict (comments at `:725-728` and `:741-744`). That is the fail-closed shape of §8 item 4 (form line 250), and the queue-regex assertion catches it.
- **Hygiene holds.** Both tests go through `stopFixture`, so `makeLedgerRepo` removes the temp directory via `t.after`. The fixtures use `core.autocrlf false`, `* -text` and `/` git paths. There is no shell, network or timing assertion, and no profile path. The test names are names, not quotations (§8 item 9).

## 2. Amendment 2 (form lines 324-344 @ b42c0dc)
- **Class 4 is right.** T18 and T19 test causes that §7 already declares (form lines 223-226). This is a test addition inside the declared scope, not a scope addition, so class 9 does not apply and nothing landed ahead of a class 9 amendment.
- **Class 8 holds.**
  - The first line carries the words, at form line 326.
  - The parts sum: 9 + 66 + 466 + 5 + 188 = 734.
  - The hooks.test change, 466 − 435 = 31, equals T18 (15 lines) plus T19 (14 lines) plus two blank lines.
  - stop-queue (188) and the README (66) are unchanged in count. That is consistent with edits to lines already new against fe1e6b7.
  - §7 is unedited: the budget line is at form line 230 and the timing line at form line 219. The reviewer confirms the numstat and that the form diff 2542233..b42c0dc only appends.
- **Class 1 for the round is right.** The heading says so, item 1 is the round's record, and round 15 (g) applies.
- **Generation 3 is right.** Main's working-tree `PLAN.yaml:3482` reads `generation: 3`; see N1 on whether it is committed.
- **The superseded index names Amendment 1 item 1's figure.** That part is right. Its closing clause is not; see S2-2.
- **Round 25 item 2:**
  - the overrun is class 8 and §7 is unedited;
  - there is no scope addition;
  - nothing calls a `verify-mutation` run an observation;
  - no branch span is pinned by hash;
  - the test text is named with its commit (item 1 names 7383018);
  - it is a full form.
- **Record cap.** This is the piece's record-correction round 1 of 2. Amendment 2 is mostly references. Item 2's scenario prose is the class 4 declaration itself, so it is allowed.

## 3. The comment changes
- **Timeout comment (`stop-queue.mjs:60`): true to the code.** On the stale path there are four timed calls: `:230`, `:235`, `:240`, and `:258` via `:334`. 4 × 2 s plus 5 s is 13 s, under 20 s.
  - The comment-versus-form discrepancy is acceptable as code-truth. The declared value, 2000 ms per call, holds. Only §7's derived sentence is wrong (form line 219 counts three calls and 11 s), and its conclusion, under 20 s, still holds. §7 stays unedited.
  - The record does need to say so (S2-2).
- **Buffer comment (`stop-queue.mjs:61`): true.** See N2 for its cite.
- **README intro (`README.md:48-50`): accurate.** It says continuity is a new step 3 and the background allow moved from 1 to 4. It adds no quotation; the blockquote at `:27-33` was already there.

## S2
- **S2-1. M18 and M19 are recorded "at 2542233", where T18 and T19 do not exist.**
  - Defect: the comments at `hooks.test.mjs:728,743` and Amendment 2 item 2 (form line 334) name 2542233. The tests first exist at 7383018 (reflog), so the named commit cannot reproduce the observation. M1 to M17 differ: their tests existed at 4b1f641.
  - Corrected reference: the reviewer's gate-2 observation of M18 and M19 at b42c0dc. Between 2542233 and 7383018 the product changed only in comments, so the observation is equivalent.
  - Proof: the reviewer's gate-2 report.
  - Route: the closing record cites that report as the observation commit for M18 and M19, and supersedes Amendment 2 item 2's "at 2542233". The test text is not edited, so no third gate is needed.
- **S2-2. Amendment 2's superseded index says nothing else is superseded (form line 344), but §7's three-call, 11 s sentence (form line 219) is now contradicted by the code.**
  - Route: the closing record's superseded index adds one reference: §7's timing sentence is superseded by the `CONTINUITY_GIT_TIMEOUT_MS` comment at the merge commit (gate-1 architect N6, reviewer N1). §7 is not edited.

## N
- **N1. Is generation 3 committed on main?** Main's `PLAN.yaml` reads 3. 8e92287 predates b42c0dc and its message does not mention a generation, and the session-start git status showed `PLAN.yaml` clean, so I cannot tell whether the bump is committed. The reviewer runs `git show origin/main:PLAN.yaml` and confirms.
- **N2. The buffer comment's cite.** The comment at `stop-queue.mjs:61` attributes the growth guard to I6. That guard is §0's size bullet (form line 30). I6 (form line 205) is the invalidator on the buffer's own bound. The comment is true in substance, so no correction is needed under the record cap.
- **N3. The §7 figure is counted at 7383018; the gated head is b42c0dc.** The commit message says b42c0dc touches only the excluded form. The reviewer confirms that the count at b42c0dc is 734. If main is merged again before the click, the closing record recounts at the merge commit.
- **N4. Wording slip in Amendment 2 item 2.** It says the step "reports the queue reason". The step passes and the queue block reports it. This is a paraphrase slip with no claim at stake, so no correction.

## 4. What the closing record owes (your list, corrected)
1. M1 to M17 at 4b1f641: confirmed.
2. M18 and M19: corrected. Name the reviewer's gate-2 observation at b42c0dc, not "2542233 with the change" (S2-1).
3. Each §6 tool with its commit (round 15 (c)): confirmed. By reference to the gate reports, not restated.
4. E2 as a class 1 row on main after the merge, with the six fields at form lines 183-189: confirmed.
5. §30's final number: confirmed. Or cite Amendment 1 item 3 if main gains no section (gate-1 N3).
6. The reviewer's disclosure: confirmed, widened. Any failure of the third call (`<c>^1:` show), not only a timeout, reads fresh with no stderr line. It fails open inside §2 item 2(c), so §8 item 4 is not engaged.
7. The failed-push reading: correction. Do not restate it. §1's may-not-claim (form line 46) and the PR body already carry it. Under the record cap, a restatement is prose that a reference carries, so at most cite §1.
8. Add: the superseded-index line for §7's timing sentence (S2-2).
9. Add: the final §7 figure at the merge commit if it differs from 734 (N3).
10. Add: the merge is a merge commit (§8 item 14), so that 4b1f641, 2542233 and 7383018 stay reachable.

The closing record is references and hashes only. A defect found in it would be the piece's second and last record-correction round, after which I reduce the record.

Paths:
- C:/dev/wt/stop-hook-stale/scripts/hooks/STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md
- C:/dev/wt/stop-hook-stale/scripts/hooks/hooks.test.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/stop-queue.mjs
- C:/dev/wt/stop-hook-stale/scripts/hooks/README.md
- C:/dev/wt/stop-hook-stale/scripts/hooks/precompact-flush.mjs
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-stop-hook-stale-continuity-gate1-reviewer.md
- C:/dev/spatial-ide/PLAN.yaml
