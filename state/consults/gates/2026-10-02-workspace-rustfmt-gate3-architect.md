*Custodian's filing note (2026-10-02): the architect's gate 3 on PR #157, for PLAN node `workspace-rustfmt`, scoped to branch commit 460c5a1 (a draft Amendment 2). Reviewed: cut/workspace-rustfmt @ 460c5a1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed; the text below the rule is the agent's. Its branch-only `path:line` cites are read at 460c5a1. Verdict PASS. The human merged #157 at 17:43:24Z (51ed3b2) at head 275d305, before 460c5a1 existed on origin, so 460c5a1 is not in main. Its content, read through this report (N1: the withdrawal is class 1, not class 3), is restated in the closing record on main, the form's Amendment 2. The gate-3 reviewer was stopped unfinished, because its scope could no longer merge; gate 2's recount and verify-quotes on main cover its checks. Profile paths redacted at filing: none.*

---

VERDICT: PASS. Reviewed cut/workspace-rustfmt @ 460c5a1 (460c5a1b07b1fc4482ff282714ee43c0df639432). PR #157, gate 3, architect. Scope: 460c5a1 only (form Amendment 2).

**Method.** I had no Bash. I did not run git diff or numstat, recompute any hash, or read any CI run. I took the head from the worktree's reflog (`275d305 → 460c5a1`). I read the form in C:/dev/wt/workspace-rustfmt, and I read main's checkout, including the uncommitted round 37 RULED block in `DECISIONS-PENDING.md`. Form cites below are read at 460c5a1. My comparison by eye shows §0 to §9 of the form are the same on main and at 460c5a1.

## S1
None.

## S2
None.

## N
- **N1. Item 3's class label is wrong, and nothing is owed for it.**
  - Class 3 says, byte-copied from `docs/PREREGISTRATION-TEMPLATE.md:112` (sub-line span): "Never changes a claim, only where it points."
  - Item 3 withdraws a claim, Amendment 1 item 6's "None". It does not re-point a cite.
  - Class 1 says, byte-copied from `docs/PREREGISTRATION-TEMPLATE.md:105` (sub-line span): "Records what the result was and what, if anything, it invalidates."
  - Round 15 (g) puts a withdrawal row in a record-correction round in class 1.
  - The amendment also declares class 1, so the row is covered. A mislabel is not a failure the rules name. Under the record cap, I do not ask for a third amendment to fix a label. This report is the reading of record.
- **N2. Round 12 (d), the three-sentence ceiling.** Item 3 has four sentences. I read it as two corrections:
  - §0's line 29: the defect with its reference, then the proof (run 37036923447). Two sentences.
  - §9's reason at line 217: the reference, then "local runs still stand". Two sentences.
  - Each is within the ceiling.
  - Item 3 says "misses one line", while item 5 indexes two spans. That is consistent only because the third bullet says §9's reason rests on §0's line, so line 217 is read with line 29. It is not false.
- **N3. The quoted "None" matches its source.** It matches Amendment 1 item 6 byte for byte. It is cited by amendment and item, which is the self-reference form round 14 requires, and it names the entry rather than reproducing a passage. `budget overrun, §7 not edited` is wording the template requires, not a quote.
- **N4. Headroom on the line ceiling is now 9 lines.** Amendment 2 is lines 233 to 250, so the form adds 29 lines. By my reading of the file, §7's command at 460c5a1 gives 80 + 2 + 29 = 111 lines over 3 files. The reviewer's numstat is the proof. Any further append on the branch past 9 lines is a second class 8, this time on lines.
- **N5. I8 does not fire.** By its text, I8 reads C2's own counts, which are 2 files. The overrun is at the head, and §8 item 13 covers it. Amendment 2 item 1 records it.
- **N6. Record rounds.** Item 3 is this piece's first record-correction round. One more round remains before the record cap's reduction.

## Judged items

**1. S1-1 is discharged as gate 2 specified.**
- **First line.** The heading and the first body line both carry `budget overrun, §7 not edited`. The body line also says the amendment is post-result. This meets the class 8 rule at `docs/PREREGISTRATION-TEMPLATE.md:169` and form §8 item 14.
- **Figures and reason.**
  - Declared: 120 lines over 2 files.
  - Final: 93 lines over 3 files at 275d305, by §7's own command, with C1 named. Per file: 2, 80 and 11, which matches the gate-2 reviewer's numstat.
  - Reason: the counting command has no self-exclusion.
- **§7 unedited.** §7 at 460c5a1 matches main line for line (`WORKSPACE-RUSTFMT-PREREGISTRATION.md:160-162`). The amendment declares no fourth file. The reviewer's diff of 460c5a1 has to prove two things: the commit touches only the form, and it has 0 deletions against a0f0da7.
- **Figure at 275d305, merged head deferred: acceptable.**
  - An amendment cannot name the commit that creates it. The only consistent shape is the gate-2 head's figure now and the final head's figure in the closing record.
  - 275d305 is a commit id, not a hash reference, so round 15 (e) does not apply. A merge commit keeps it reachable from main.
  - The condition is in item 5, the closing record.

**2. Item 2 is correct.**
- It cites round 37, item 1 by round and item, with no line cite into the ledger.
- It quotes the human not at all, not even the option label. That is permitted.
- Its effect, that the form's own appended §10 amendments are outside §8 item 3, matches the Applied line and my gate-2 option (1).
- 460c5a1 is itself such an amendment, so it is covered.
- Resolution depends on the RULED block reaching main (item 5).

**3. The class 3 row and the superseded index.**
- **Pins.** Both are at 7b45af8. The gate-2 reviewer confirms 7b45af8 is on main, so round 15 (e) holds. Each is contiguous on one line.
  - At 460c5a1, line 29 is §0's Governance CI line and line 217 is §9's "because governance CI does not trigger (§0)" line. Pin and tree agree, so there is no question of which is authoritative.
  - The reviewer recomputes both hashes.
- **Index.** Item 5 indexes both spans. The index ends the correction round, as round 12 (e) requires.
- **Nothing else is made false.** I checked §0 to §9 and Amendment 1 against the branch at 460c5a1:
  - §1 Unchanged: no rewrite; appends only.
  - §2 item 4: C2 still touches exactly 2 files.
  - §9's list of CI suites: it is a list of record, not a claim that nothing else runs.
  - Amendment 1 items 2 and 5: still true.
  - I8: N5.
  - §7's estimate: an estimate, not a claim.

**4. Labels.** Class 8 (item 1) is right. Class 1 is right: the amendment is post-result, and it covers items 2 and 3. Class 3 for item 3 is wrong (N1); it is not blocking, and nothing is owed.

**5. The owed list, corrected.** I confirm your list, with these additions.

*Before the click:*
- **(a) Gate 3 reviewer PASS, scoped to 460c5a1.** The reviewer checks:
  - 460c5a1 touches only the form, with 0 deletions against a0f0da7;
  - §7 recounted at 460c5a1 (my reading: 111 over 3);
  - both 7b45af8 hashes recomputed;
  - sign-off.
- **(b) Commit to main.** These are uncommitted in main's checkout and must be on main before the click:
  - the round 37 RULED block, so that item 2's cite resolves there;
  - `state/questions/round-37.md`;
  - the window directive and its draft;
  - `PLAN.yaml`'s generation 3, which supports item 4.
- **(c) P1 at merge, recorded** (§8 item 9). Two worktrees are open, stop-hook-stale-continuity and questions-mirror-t11-copy-glob. P1 must show that neither touches a `.rs` file.
- **(d) The head marked ready fully green.** That head is 460c5a1, or the final head if it moves. Every check:
  - product-ci-shell on a merge ref containing e4e864e;
  - product-ci-rust;
  - Rust fmt;
  - Governance CI, which now triggers;
  - exposure-scan;
  - DCO.
- **(e) E1 named by run id at that head.** 37036923635 is 275d305's run. It is E1 only if the head has not moved.
- **(f) No merge of main into the branch.** §7's command is two-dot from C1, so a merge from main would count main's drift.
- **(g) The PR body** asks for a merge commit (§2 item 6) and carries the C=994 disclosure.

*At and after the merge:*
- **The closing record** is references and hashes only (the record cap). It carries:
  - §7's figure, by its own command, at the PR's final head, named as the merge commit's second parent and not the merge commit itself (Amendment 2 item 1's deferral);
  - E1 and E2 (37005634673) by run id;
  - E3;
  - round 35's note 2 by reference only: `state/directives/2026-10-02-rustfmt-notes.md:15-17` @ a main commit with its sha256, and the merge id stated separately. The line is never presented as a quote with `<the rustfmt merge commit>` replaced by the id. If the rule is restated, it is labelled as the custodian's instantiation (gate-2 N5).
- **The `AUTONOMY.md` section** goes after whatever section is last at that moment: §28 now, but stop-hook-stale-continuity edits `AUTONOMY.md`. It follows the same N5 rule. It lands on main after the merge and never on the branch: there, §8 item 3 would fire, because round 37 exempts only §10 amendments.
- **E3** is the first push to main after the merge. A red E3 stops all Rust dispatch.

No ADR is needed.

Files:
- C:/dev/wt/workspace-rustfmt/WORKSPACE-RUSTFMT-PREREGISTRATION.md
- C:/dev/spatial-ide/WORKSPACE-RUSTFMT-PREREGISTRATION.md
- C:/dev/spatial-ide/DECISIONS-PENDING.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-workspace-rustfmt-gate2-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-02-workspace-rustfmt-gate2-reviewer.md
- C:/dev/spatial-ide/state/directives/2026-10-02-rustfmt-notes.md
- C:/dev/spatial-ide/state/directives/2026-10-02-window-amendment-exemption.md
- C:/dev/spatial-ide/state/drafts/weekly-window-2026-10-09.md
