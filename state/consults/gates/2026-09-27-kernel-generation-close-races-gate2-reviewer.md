*Custodian's filing note (2026-09-27): gate 2, attempt 2 (reviewer), the scoped read of record round 1 of 2, of PLAN node `kernel-generation-close-races`. Reviewed: cut/kernel-generation-close-races @ baf1a00 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/kernel-generation-close-races @ baf1a00

**Verdict: PASS** (record round 1 of 2, scoped read). D1, D2 and E1 from gate 1 are resolved, and I found no new defect.

**What changed since af77861**
- Merge 9df1890 brings in main at 68d261e and is signed off. Outside `state/**`, `PLAN.yaml`, `CUSTODIAN-QUEUE.*` and `site/**` it touches no file.
- baf1a00 is signed off and adds Amendment 3 to `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, nothing else.
- Append-only holds against af77861: 15 added lines, 0 removed.
- Amendment 3's first line says post-result (class 1) and names the two gate-1 reports. Both are tracked and on main at 68d261e.

**Row 1 (D1)**
- It is in row position: preregistration line 464 begins `- withdrawn-test:`.
- The pin recomputes. Line 173 at d4245fe hashes to 031d3e86…8c8242. It is unchanged in the current tree, and d4245fe is an ancestor of origin/main.
- The riders resolve.
- Citing round 15 (g) for a class-1 withdrawal row in a record-correction round is correct.
- `runVerifyTestClaims({plannedGates: new Set()})` at baf1a00 returns 0 binding findings. The row appears under withdrawn, matching the custodian's 0.

**Row 2 (D2 / architect F1)**
- It is three sentences, within the ceiling: the defect, the corrected reference, the proof.
- It does not restate an earlier amendment's claim.
- The reference recomputes: `state/consults/2026-09-27-kernel-close-races-suites-76f92ba.md:230-258 @ bfb436d` hashes to 4be31d1b…4b073, and bfb436d is on main.
- The superseded index is present.
- The directive's item (1), "the record cap, item (1)", exists.
- Class 3 is a defensible reading: the row changes only where the record points, not what it claims.

**Verify tools at baf1a00** (all exit 0; merge-base 68d261e):
- verify-test-claims @ b82941e: PASS, 0 planned, 17 withdrawn.
- verify-cites @ 522e448: PASS.
- verify-quotes @ f9444a4: PASS, 0 hash-reference errors.
- verify-mutation @ 7d24ed1 (`--base 68d261e`): PASS, 6 of 6.
- verify.mjs @ db9d20b `--offline`: PASS.

**E1, branch CI at baf1a00** (the remote head matches)
- Governance CI run 36354285942: completed, success.
- Product CI Rust workspace run 36354285917: in progress.
- Product CI shell run 36354286104: in progress.
- Both product runs are pending. Read them before merge.

**Nit**: row 10's third bullet ("include the one-line form…") remains. It is not wrong, since "include" is not exclusive, and it does not block.

No files were edited. `git status --porcelain` in C:/dev/wt/kernel-close-races is empty, and HEAD is baf1a00.

Relevant file: C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md
