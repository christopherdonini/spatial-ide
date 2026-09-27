*Custodian's filing note (2026-09-27): gate 3, attempt 3 (architect), the scoped read of record round 2 of 2, of PLAN node `kernel-generation-close-races`. Reviewed: cut/kernel-generation-close-races @ d040891 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/kernel-generation-close-races @ d040891

**Verdict: PASS.** The record closes at round 2 of 2, so no reduction under the record cap's item (3) is needed.

What I checked in Amendment 4 (preregistration §10):
- **Class 3 fits.** It re-points Amendment 3 row 1's second clause to a reference and changes no claim. Its first line says it was written post-result and names this as record round 2 of 2.
- **Round 12 (d): pass.** The row is three sentences: the defect, the corrected reference and the proof. None of them repeats the superseded clause.
- **Round 12 (e): pass.** It ends with the superseded index.
- **Round 15 (c): discharged.** The pinned line, `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-reviewer.md:15`, names the tool's commit, `verify-test-claims @ b82941e`, with its PLANNED/BINDING behaviour. I read that line in the worktree. The defect sentence talks about the clause, not about how the tool behaves, so it is not a new tool claim.
- **Round 15 (d) and (e): pass.** The pin sits on one line with an explicit rev, `68d261e`, which the custodian states is on main.
- **The record cap: pass.** The amendment is references plus the minimal defect statement.
- **Round 15 (f): pass.**
  - Amendments 2 and 3 read the same as at baf1a00, so neither was edited in place.
  - The reflog shows exactly one commit from baf1a00 to d040891, the Amendment 4 commit.

What I could not verify (no shell), for the reviewer:
- recompute `git show 68d261e:state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-reviewer.md | sed -n 15p | sha256sum` against `4a539e0ce83c497dc979014413b50ea7441d7d40efb235e9e691e1e8714c8fab`;
- confirm that 68d261e is an ancestor of origin/main;
- confirm that `git diff baf1a00 d040891` touches only the preregistration.

Carried forward from gate 1, not blocking:
- The squash/rebase ban (block-on-sight 16) still has to be honoured at the click, so 12ccbeb, 051c56f and 4682866 stay reachable.
- `adr-035-close-races-note` still waits on the human's ruling.

File: `C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`
