*Custodian's filing note (2026-09-26): gate attempt 2, architect (scoped), for the Stop-hook lease piece (branch `governance/stop-hook-lease` at `74b5fe2`, local, not yet pushed), transcribed from the hand-back message with the harness's two-space indent removed. Every line cite below is into the branch, not into main. Everything below the rule is the architect's text.*

---

**Gate 2, architect (scoped): "the Stop hook honours the custodian lease"**
Head read: `74b5fe2`, the working tree of `C:/dev/wt/stop-hook-lease`. The worktree reflog (`.git/worktrees/stop-hook-lease/logs/HEAD`) shows the correction range as b68b17f (regex), e3decbd (tests), 6bbe7b6 (README and §24) and 74b5fe2 (Amendment 2). I have no Bash, so the reviewer should confirm three things: the tree is clean, 74b5fe2 touches only the form, and `AI_DEVELOPMENT.md` is not in `origin/main...HEAD`.

**Verdict: block.** The block is on Documentation only, low severity, and fails by name. Correctness and Evidence pass.

## Correctness: PASS (carried forward; no severity)
- **Semantic applicability check (§22), done because the correction changed source.**
  - The b68b17f regex, `/^lease:\s*(\S+)/`, changes only one thing: which first lines count as held.
  - The Change line and the three named tests' claims are unchanged.
  - The dedupe test now has its second session write its own held lease, which restores the reviewer's C3 coverage. Its comment matches the code (the dedupe key is `waiting:<hash>` of the waiting set).
  - The step comment in the background_tasks test now says step 4 (the reviewer's D2 is fixed). Nothing reopens gate 1's PASS.
- **Scope item 4, the relaxed regex.**
  - It matches the Change line's "`lease: <id> ...`" shape (the form, line 3).
  - It is consistent with `AI_DEVELOPMENT.md`, "The lease and handover". That rule defines the lease as a line carrying a session id and a timestamp and gives the `refreshed:` shape as "e.g.". Relinquishing is either deleting the file or writing a single `relinquished:` line, and neither can match `^lease:`.
  - The hook reads the rule without enforcing it, and no rule text changes.
  - "Active" still means only "a `lease:` line, not `relinquished:`", with no freshness check. That is within item (4) of the directive (`state/directives/2026-09-26-corpus-positions-and-stop-hook.md` §2), because a takeover rewrites the id and so allows.
  - `\s*` also accepts `lease:<id>` with no space. This is harmless.
- Carried from gate 1, not blocking: the unreachable `?? 'unknown-session'` in step 6, and C2 (the lease id is not bound to the stdin `session_id`), which stays a follow-up for the human (ledger, 19:50Z entry).

## Evidence: PASS with notes (low; scope `scripts/hooks/hooks.test.mjs`; disposition: optional)
1. **Item 1: discharged under round 7, and class 4 is right.**
   - The in-code RECORDED MUTATION comment above `stop-queue: allows when this session's lease is relinquished` now names the `if (!match)` branch returning `{ held: true }`.
   - On reading, that mutation lets `relinquished: <id>` through to the plan load, which leads to `block` and fails `assert.equal(result.decision, 'allow')`. The reviewer's gate-1 mutation (c) observed exactly this.
   - The `!match` path is the same under both regexes, so the observation carries across b68b17f.
   - Class 4 is the template's own class for a mutation mis-described and corrected after a gate finding. The test-comment change sits under the round-14 test-text exception. On pinning the superseded span, see Documentation D3.
2. **Item 2: the dry run evidence is sufficient; the piece need not carry it.**
   - §3's dry-run rule places the result "recorded in `CUT-STATE.md`". The 19:50Z entry does this by naming the reviewer's gate-1 report, check 5, which is filed on main and states its tested head, `7f3a013`.
   - The form's dry-run text is the preregistered plan, not an amendment's discharge clause, so round 7 does not reach it.
   - Carry-forward across the regex change (semantic check): the regex relaxation cannot change any of the four dry-run inputs' results.
     - The holder and other-session cases must have carried `refreshed:`, because under the old regex they produced "block" and "another session's lease".
     - Relinquished and absent never reach the regex change.
   - The reviewer's gate-2 re-run at 74b5fe2 is the confirming run. The closing summary should cite both runs as path plus tested revision (§22).
3. **Note (low, suggestion): the widened shape has no test.**
   - No test writes a bare `lease: <id>` line, so a mutation that restores `\s+refreshed:` survives the suite.
   - The Tests+mutation line never claimed this shape, so it is not missing required evidence.
   - Fix if wanted: one assertion in the own-lease test using a bare line.

## Documentation: FAIL (low; scope: the form's Amendment 2; disposition: one appended Amendment 3, which is this piece's second and last record-correction round under the 2026-09-18 record-cap directive; then a scoped read. The architect reduces anything left after it; there is no third round.)
- **D1, by name: a correction round without its superseded index (round 12, item 1 (e)).**
  - Amendment 2 is a correction round. It supersedes Amendment 1's final figure and its basis label, and the relinquished test's comment as committed at `7f3a013`.
  - It ends with no superseded index.
- **D2: the README exclusion is an unenumerated exemption (Scope item 3, second bullet).**
  - §21c's own text, following the human's note (round 5, item 2), enumerates the exempt set as the form plus the obliged governing-doc sentence(s), "nothing else".
  - That set only makes sense if prose otherwise counts. §21b also routes docs pieces through §21c's threshold, which would be meaningless if docs lines counted zero.
  - So `README.md` counts, and "judged documentation" is an exclusion the note does not grant.
  - I own the error: my gate-1 Documentation item 2 said the README "is neither" code nor tests, and that seeded this exclusion. That sentence of mine is withdrawn.
  - The correct §21c figure is the Scope-line basis with only the form and `AUTONOMY.md`'s §24 hunk excluded. The reviewer should recompute it at 6bbe7b6. It is over 150 either way, so the route does not change.
- **D3 (low): the class-4 row omits template class 4's harness statement.**
  - The template requires the row to say "unit-only" if no second harness run was made.
  - The row also names no tested revision for its observation.
  - Pinning the superseded comment span is impossible before merge: round 15(e) forbids a branch-commit hash pin in an append-only record, and `7f3a013` is branch-only.
  - The superseded-index row below, naming the commit without a hash, together with the gate-1 reports on main, is the resolvable reference. If this tension recurs, it is a ledger finding for the weekly proposal, not a new clause.
- **Class-3 label (note, no action).**
  - The row mixes two things: a basis-label fix, where class 3 is defensible because it changes where the figure points and not the conclusion, and new final figures, which are class-6 content.
  - "At the new head (`6bbe7b6`)" names the pre-amendment commit, not the head. That is harmless if 74b5fe2 touches only the form. It is a measurement revision, not a hash reference, so round 15(e) does not apply.
- **Pass on the rest.**
  - The README Decision-order lead-in now names §24 as step 3.
  - The Tests section lists the three lease cases.
  - The skipped-notice clause in README step 3 and in §24 matches `decide()`: non-holders return at step 3, before step 5's notify, while HALT's notify at step 2 runs for every session.
  - The in-place edit of §24 is to this piece's own unlanded text at the end of the file. It moves no line that anything cites, and the only external cite, the reviewer's gate-1 `AUTONOMY.md:474`, is pinned to `7f3a013` by its filing note.
  - There are no quotations in Amendment 2, §24 or the README additions.

**Proposed Amendment 3 (append; references only; fill N from the reviewer's recount):**
`Amendment 3 (class 3, class 4; gate 2's findings, <the gate-2 report path(s) as filed>): (1) Amendment 2's §21c figure excluded README.md, which §21c's exempt set (round 5, item 2) does not enumerate; corrected figure N lines, git diff --numstat origin/main...6bbe7b6 with this form and AUTONOMY.md excluded. (2) Amendment 2's class-4 mutation was unit-only (node --test), no harness run. Superseded index (round 12, item 1 (e)): Amendment 1's final figure and basis, by Amendment 2's class-3 row and item (1); Amendment 2's §21c figure, by item (1); the relinquished test's RECORDED MUTATION comment as committed at 7f3a013 (branch commit), by Amendment 2's class-4 row.`
Use "unit-only" only if it is true of the worker's run.

## Red lines
None. No ADR, security, wire or lease-rule text is touched; `AUTONOMY.md` gains only §24.

**Files:** `C:/dev/wt/stop-hook-lease/scripts/hooks/STOP-HOOK-LEASE-PREREGISTRATION.md`, `C:/dev/wt/stop-hook-lease/scripts/hooks/stop-queue.mjs`, `C:/dev/wt/stop-hook-lease/scripts/hooks/hooks.test.mjs`, `C:/dev/wt/stop-hook-lease/scripts/hooks/README.md`, `C:/dev/wt/stop-hook-lease/AUTONOMY.md` (§21c, §24), `C:/dev/wt/stop-hook-lease/docs/PREREGISTRATION-TEMPLATE.md` (classes 3, 4, 6), `C:/dev/spatial-ide/state/CUT-STATE.md` (19:50Z entry), `C:/dev/spatial-ide/state/directives/2026-09-26-corpus-positions-and-stop-hook.md`.
