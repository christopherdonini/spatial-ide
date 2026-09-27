*Custodian's filing note (2026-09-27): gate attempt 2, architect (scoped to Amendment 2), for PR #129 (node governance-weekly-proposals-2026-09-26) at `c85fc55`, transcribed from the hand-back message with the harness's two-space indent removed. Line references below are into the branch at `c85fc55`. Everything below the rule is the architect's text.*

---

governance/weekly-proposals-2026-09-26 @ c85fc55. I confirmed the head from the branch ref at c85fc55a7f9c0c7fb78aa8bb8a40a88805f5cea1. I have no shell, so I read the worktree files and could not run git status.

**Verdict: pass with notes.** Scope was Amendment 2 of `scripts/plan/GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26-PREREGISTRATION.md`. Byte equality is the reviewer's check. My comparisons below are by eye.

## Three verdicts (AUTONOMY.md §22)

- **Correctness: PASS.** The resolution follows merge order: T2 becomes §25 and T3 becomes Amendment 5. This keeps each file's append-at-end convention, and main's §24 and Amendment 4 are left alone.
  - Item 3's substitution counts match the T blocks as written. T2 has one `§24` and one `§23`, both in its heading, and the order (§24 first, then §23) is correct. T3 has one `Amendment 4` in its heading and one `§24` in its first bullet. T4 and T5 have one `§24` each. T1's `Amendment 4` is the source-change watcher's, and T6 has neither token.
  - Item 4's "no other file" claim holds on grep. `verify-cites*.mjs` has no §24/§25 or Amendment 4/5 token. The PLAN node summary names no section number. The hit in `PLAN.yaml` is in main's `governance-stop-hook-lease` node, not this piece.
- **Evidence: PASS**, provided the reviewer's byte check is green.
  - By eye, T2–T5 as landed differ from their T blocks only by item 3's substitutions: `AUTONOMY.md` §25 heading and body, `AI_DEVELOPMENT.md` Amendment 5 heading and first bullet, and the last line of `.claude/agents/architect.md` and of `.claude/agents/reviewer.md`. `.claude/agents/worker.md`'s last line matches T6 unchanged.
  - The commit ids item 1 names (3718a39, ae92f10, 4c4ec06, f205478) agree with `state/CUT-STATE.md` and `state/gate-log.json`. 340f516 is the form's commit per the PLAN node summary and CUT-STATE. I could not check reachability without git.
- **Documentation: PASS with note N1.**

## Checks

1. **Class and first line (template §10).** Class 1 is correct. Its heading says "written after both gates' results were seen" and names the gate-log node and the attempt, which is the shape class 1 requires. The form's header rule is also met.
   - Class 3 does not fit: the renumbered headings are the sections' own names, not pointers.
   - Class 5 does not fit: no ruling narrows anything.
   - No class was invented.
2. **References, not restatement (record cap).** Amendment 2 is operative (it changes what lands), not a closing amendment.
   - Item 1's account of how the invalidator fired is the "what the result was" that class 1 requires.
   - Nothing restates Amendment 1 or the gate-1 reports.
   - It does not count as a record-correction round: it answers a registered invalidator, not a record-fidelity finding.
3. **Fences.** No `~~~` line appears in Amendment 2.
   - The T6 fence that Amendment 1 recorded is still unclosed, so Amendments 1 and 2 render inside a code block. That predates this amendment, and Amendment 2 adds no fence that would change T6's one-line extent.
4. **Branch-only line cites.** None. Amendment 2 has no `path:line` token. It names branch commits (4c4ec06, 340f516, f205478) as commits only, with no hash reference, so round 15 (e) does not apply.
5. **Superseded index.** Present, in the last paragraph.
6. **Human's word.** Not needed; I agree with the consult.
   - The round 25, item 2 ruling in the RULED block names no section number.
   - `state/questions/round-25.md` has no `§24` or `Amendment 4 to the Custodian` token (grep returns nothing).
   - T1 states that the operative text is the form's own, and the renumbering changes only numbers, not rule text.
   - Main's §24 (the human's directive of 2026-09-26, via #131) and Amendment 4 (round 27, item 6) are unchanged.

## Notes (no correction round asked)

- **N1: the superseded index misses two readings.** It lists §2.1, the Appendix T headings, and §8 item 2 / §9 for T2–T5. It leaves out:
  - §5's first invalidator, which item 6 re-reads as §25 / Amendment 5;
  - §8 item 1's pre-piece state, which item 5 says is read per item 2.

  Both readings are stated plainly in items 5 and 6 of the same amendment, and a fix would take a further appended amendment that spends the record-correction cap. So I am noting this, not failing it: an index exists, and only a missing index fails by name.
- **N2: merge with a merge commit, not a squash.** Item 3 extracts at 340f516, and the filed gate-1 reports name f205478. Both must stay reachable from main, which T3's own branch-retention clause also requires.

## Files

- C:/dev/wt/governance-weekly/scripts/plan/GOVERNANCE-WEEKLY-PROPOSALS-2026-09-26-PREREGISTRATION.md
- C:/dev/wt/governance-weekly/AUTONOMY.md
- C:/dev/wt/governance-weekly/AI_DEVELOPMENT.md
- C:/dev/wt/governance-weekly/.claude/agents/architect.md
- C:/dev/wt/governance-weekly/.claude/agents/reviewer.md
- C:/dev/wt/governance-weekly/.claude/agents/worker.md
- C:/dev/wt/governance-weekly/docs/PREREGISTRATION-TEMPLATE.md
