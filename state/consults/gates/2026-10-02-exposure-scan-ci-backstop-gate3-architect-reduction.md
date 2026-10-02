*Custodian's filing note (2026-10-02): the architect's reduction under the record cap (`state/directives/2026-09-18-record-cap.md`, item (3)) for PR #153, PLAN node `exposure-scan-ci-backstop`, after the gate-3 reviewer's FAIL on S1-1 (`state/consults/gates/2026-10-02-exposure-scan-ci-backstop-gate3-reviewer.md`). It is the same architect agent as gate 3, resumed on the custodian's message. Reviewed: cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. The precondition it names, the carrier reading 7d24ed1, is met in the commit that files this report. Profile paths redacted at filing: none.*

---

REDUCTION: CONFIRMED (cut/exposure-scan-ci-backstop @ 65793d6daac24dfa2e4ffe70eff55ca0f1bab645)

I confirm the reviewer's S1-1, and I correct my own gate 3 on one point. The 0e07e55 I named for verify-mutation was the tree it was read from, not the tool's commit. Round 15 (c) needs the tool's commit, which is its last-changing commit. The reviewer read that as 7d24ed1 with `git log`. I had no Bash, so that id rests on the reviewer's run.

**The reduced record:**
- **For S1-1:** the closing record reads Amendment 2, item 2, second bullet (`scripts/hooks/EXPOSURE-SCAN-CI-BACKSTOP-PREREGISTRATION.md:306`) as "verify-mutation at 7d24ed1". The reason it gives stays evidence, from worker report 3 (its line 13), and is not a claim of record. Nothing on the branch changes.
- **N-1:** the closing record gives one reference as the proof for the discharge clause at `:304`, which is "Amendment 2, items 1 and 4". N-2 (lines over 100 columns) breaks no rule, so it needs nothing.

**Precondition:** right now, the CARRIER line on main still reads verify-mutation's commit as 0e07e55 (`PLAN.yaml:3431`, node `workspace-rustfmt`, in the main checkout). Correct it to 7d24ed1 before the merge. Your message says it will be. The rest of that line matches the items my second S2 asked for, so that S2 and the reviewer's S2-1 are discharged on the record once the PR body is as you describe. I did not read the PR body.

**Landing:** yes. Once the carrier reads 7d24ed1, the piece may land on the reduced record when the human clicks, with these conditions:
- the merge is a merge commit, never a squash or rebase (§8 item 13);
- the done commit writes the closing record from the carrier, as references and hashes only;
- E5 is recorded on main as a class 1 row.

This is the second correction round under the record cap, so no third round is opened.
