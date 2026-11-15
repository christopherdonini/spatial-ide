Reviewed: PR #274 at 1a251a153406f4e6a9000ed1e24cec9f19efbc66 (base 12ba6974), gate 1, reviewer
cut/walkthrough-stale-cites-l5-degrees-p1 @ 1a251a153406f4e6a9000ed1e24cec9f19efbc66
Verdict: PASS WITH NOTES

## Correctness (blocking): none

I checked each new clause against the code at B. The code is byte-equal to main's: `git diff --stat 12ba6974 b84a2b26 -- frontends engine` printed nothing, rc 0.
- **W-L5**
  - Mid-fill silence holds. `emitResidencyStatus` (candidateArmSession.ts:713-848) returns early on the over-budget branch (725-756). Its partial-failure and partial branches need a settled reading (`settledState`, residencyStatus.ts:330-336). The not-complete path returns at :840.
  - The single `candidate-fill-progress` fires only inside `if (standingWithinBudgetComplete)` (835-839). The flag is set only beside the `settled: "complete"` dispatch (842-847). It is cleared at :754, :781, :805, :1669, and in `relinquishFill` (:1788).
  - `nextResidencyStatus` returns null for that event (residencyStatus.ts:204-205).
  - The `settled-partial` branch dispatches `settled: "partial"` (799-807). `residencyStatusText` maps that to `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (:462, literal :435). App renders `residencyStatusText(residencyStatus)` into `.residency-status`.
  - Entry 43 (archive, by entry number) records the truncated settle as "SILENT by design … contradicts entry 36's own rule". This matches the span's history clause.
- **W-P1:** the one `logSessionEvent(` call writing `"candidate-grid-frame-established"` is at candidateArmSession.ts:1229-1230, inside `establishFrameFromExtent` (1209-1235). The other occurrence, :1400, is a comment.
- **W-FN:** `parcel` (fixture.rs:1258) computes `(gx, gy) = (id % cols, id / cols)` at :1260.
- **W-L1:** the same facts as W-L5's first and third clauses. These are the ruled words, and the human's ruling at the 2026-10-23 directive's line 22 reads "Walkthrough L5/P1: OPEN-1 yes, OPEN-2 yes."

## Evidence (blocking): none
E1, E2 and E3 all hold. Details are under the checks below.

## Documentation (must be fixed before the merge, no re-gate)

**D1. The quote L1 keeps does not resolve against entry 36.** At frontends/shell/MANUAL-WALKTHROUGH.md:815 at H, the kept trailing span holds the quoted phrase "re-earn at settle".
- The form's W-L1 says the gate resolves it against entry 36. It does not resolve.
- `git grep -c -i 're-earn' 12ba6974 -- governance/DECISIONS-PENDING.md state/cut-archive/` returned rc 1, meaning zero matches in the ledger or its archive. At B the phrase appears only in this row, the sitting-script copy of it, the form and its two drafts.
- Entry 36's RULED block (the human's words and consequences (i)-(iii)) has no such phrase.
- The span is pre-existing. It came in with commit 472e8839 or earlier, and every commit in its `git log -L` history carries a Claude trailer, so it is not the human's wording.
- §2.0(b) and §8 item 1 forbid changing it in this piece, and widening a ruled item is a red line (2026-10-31 direction, item 4).
- **Fix in this PR:** record it, with no change to the walkthrough. Add a form amendment row, or a PR-body line, saying the gate found the quote unresolved, for the human's review, in the same shape as OPEN-3 (a).
- **Proposed words for a later piece:** replace `— entry 36's own "re-earn at settle" rule` with `— entry 36's rule (i)`.
  - Clause check: entry 36's consequence (i) says a covering set that invalidates a standing within-budget claim clears it through the entry-1 transition class. In code, that is the single `candidate-fill-progress` clear at candidateArmSession.ts:835-839, reduced to null at residencyStatus.ts:204-205.
  - The cite is by entry and item, per round 14 (a′), with no quote.

**D2. A pre-existing L1 clause outside §2.1 is now contradicted by the row the new span points to.**
- L1 (MANUAL-WALKTHROUGH.md:815 at H) still says `(entry 43: a truncated within-budget settle is silent by design)`. That has been untrue since F2: a truncated within-budget settle reaches `settled-partial` (isFillComplete false at candidateArmSession.ts:671; settledState residencyStatus.ts:334-335), and the shell then shows string 6 (candidateArmSession.ts:799-807, residencyStatus.ts:462).
- The new W-L1 words "(L5 below has the account)" send the reader to L5, which states string 6.
- This is a claim the code does not support, so it is not documentation-only in kind. But this diff did not write it, and the piece's §1 and §5 bound the gate to the rewritten clauses. It therefore does not fail this gate.
- It is not the human's wording. It came in with commit 472e8839, which carries a Claude trailer.
- **Fix in this PR:** record it for the human beside D1, as a finding to place. It cannot be edited here without a class-9 scope addition on a ruled item, which is a red line.
- **Proposed words for a later piece:** replace `(entry 43: a truncated within-budget settle is silent by design)` with `(if it was truncated, string 6 instead — L5 has the account)`.
  - "if it was truncated, string 6": truncation makes isFillComplete false (:671), giving settled-partial (residencyStatus.ts:335), dispatched as `settled: "partial"` (799-807) and rendered as SETTLED_PARTIAL_WITHIN_BUDGET_TEXT (:462).
  - "L5 has the account": true at H, line 819.

Note, not a finding: the worker report's E2 lines name the tools' commit only as "the worktree at H". The tools ran at 1a251a15, and the last commit touching them is 494cea7b. The done commit's E2 should name the commit explicitly (§5, round 15 (c)).

## Check 1: the diff
- `git diff 12ba6974...1a251a15` rc 0; `--name-only` rc 0 gives `frontends/shell/MANUAL-WALKTHROUGH.md` only; `--numstat` rc 0 gives `4	4`. That is 8 lines against the §7 ceiling of 8: no overrun, and the form's history is the single commit 12ba6974, so §7 is unedited. Merge base is 12ba6974849b86ebda0cd8b93fa99dc254135b41.
- My script `wsc-g1r-check1.mjs` (scratch folder), rc 0, CHECK1 PASS.
  - It takes the four old and new spans from the form on main at b84a2b26 (form lines 79/86, 127/129, 142, 151, one outer backtick pair removed).
  - Each old span occurs exactly once on its row at B and once in the whole file, and is absent at H. Each new span is absent at B and occurs exactly once at H.
  - B with the four replacements equals H byte for byte. Changed lines are exactly 808, 815, 819 and 1476; line count is 2006 at both; there is no CR.
  - The points Part P's P1 (B line 1639) and that whole section are byte-identical.
- §8 items 1-11:
  1. Only the four lines changed. Holds.
  2. No code, test, string or `scripts/` change. Holds.
  3. No new double-quoted prose. `settled: "partial"` sits in backticks and is byte-equal to code line 803. Existing quotes are unchanged by whole-file equality. Holds.
  4. No overclaim. Holds, per the Correctness section; the L5 re-check and P1 are not claimed run.
  5. No new bare `path:line` (item 5 below and verify-cites) and no pin added. Holds.
  6. The points P1 is untouched. Holds.
  7. No result log or `state/` record edited. Holds.
  8. W-FN and W-L1 equal the ruled words. Holds.
  9. No overrun. Holds.
  10. No scope addition. Holds.
  11. No record calls a `verify-mutation` run an observation of a mutation. Holds.

## Check 2: §4 items 1-6
My script `wsc-g1r-sec4.mjs` (no `grep -iF`).
- **Mode B, item 6:** rc 0, SEC4-B PASS.
  - The negative line checks fail on all four old cites (rs:192 is `stalled: event.stalled,`; fixture.rs:618 is `}`; cas 693-696 and 1218-1221 lack the needles). Control: the same check passes at rs:204, cas:1230 and fx:1260.
  - Item 3's eight content checks pass at B.
  - Item 5's patterns match 3 line cites (0,2,1 on L1, L5, P1), 1 `fixture.rs` cite and 1 phrase.
  - The first run had rc 1 on 3d. That was my selector's fault: it matched the type member at :292. I fixed it to an exact match on the implementation at :1734 and re-ran, rc 0.
- **Mode H, items 1, 3, 4 and 5:** rc 0, SEC4-H PASS.
  - Item 1: four hunks (@@ -808, -815, -819, -1476), each -1/+1, of kinds FN, L1, L5 and P1. P1 sits at line 1476, between the degrees heading (1457) and the next `## ` (1487).
  - Item 3: 3a-3h all pass.
  - Item 4: the L5 quote equals the constant literal byte for byte.
  - Item 5: counts are 0/0/0.
- **Item 2:** proven by check 1.
- **Independent grep -E cross-check:** rc 0 at B, with 3 cites, 1 and 1. rc 1 at H, with no matches.

## Check 3: E2 at H, in C:/dev/wt/wsc
Tools at 1a251a15; the last commit touching them is 494cea7b.
- `verify-cites.mjs` rc 0: "verify:cites PASS — every rooted (in-tree) path:line reference across 2564 file(s) resolves. (112 loose reference(s) advised above.)"
- `verify-quotes.mjs` rc 0: "verify:quotes PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 908 ruling cites resolved, 0 ruling-cite errors." The harness moved this call to the background at 180 s; it completed with exit code 0.
- `verify-test-claims.mjs` rc 0: "verify:test-claims PASS — all 707 claimed test(s) across 224 file(s) exist or are planned, superseded or withdrawn (50 planned, 12 superseded, 17 withdrawn, advisory)."
- `verify.mjs` rc 0: verify:plan PASS (PLAN.yaml agrees with the repository).
- `queue.mjs --check` rc 0: "queue.mjs --check: CUSTODIAN-QUEUE.md/.json are current."
- `site.mjs --check` rc 0: "site.mjs --check: site/ is current."
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"` rc 0: 586 tests, 586 pass, 0 fail.

## Check 4: E3, CI
- `gh pr checks 274` rc 0: all 8 checks pass. PR head is 1a251a15, draft, open.
- `gh run view` gives head sha 1a251a153406f4e6a9000ed1e24cec9f19efbc66 and completed/success for each run: 41274304467 (DCO), 41274304447 (Exposure scan), 41274156618 and 41274304453 (Ported notices, push and PR), 41274156563 and 41274304482 (Product CI — shell, push and PR).
- No run was in progress, so no wait loop was needed.

## Check 5: authorship invalidator
- `git log -L` at B on 808, 815, 819 and 1476 all rc 0. Commits: 472e8839 and 5b264cc1 (808, 815); debe3b23, 472e8839, b945d701 and 5b264cc1 (819); 1eabf0c2 and 6da92064 (1476).
- `-S` on each replaced span (`wsc-g1r-auth.mjs`, rc 0) gives the introducing commits:
  - W-L1, W-FN and L5's sentence parts: 472e8839.
  - The whole L5 span: debe3b23, which only rewrote its lead-in.
  - W-P1: 6da92064.
- All six commits carry a Claude Co-Authored-By trailer (Fable 5.1, Fable 5 or Sonnet 5).
- The replaced spans are code-description prose. The one quote inside them (*"deliberately left silent"*) was a quote of a code comment. **The invalidator does not fire.**

## Background shells and the worktree
- No background shell or process I started is still running. The single harness-backgrounded call (verify-cites plus verify-quotes) exited with code 0, as its completion notice reported. Everything else ran in the foreground and exited.
- I killed nothing, since there was nothing of mine to kill.
- `git status --porcelain` in C:/dev/wt/wsc: rc 0, 0 bytes. HEAD is still 1a251a153406f4e6a9000ed1e24cec9f19efbc66.
- I wrote nothing outside my scratch folder, which holds only `wsc-g1r-*` files.
