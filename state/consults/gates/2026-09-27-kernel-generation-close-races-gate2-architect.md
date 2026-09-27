*Custodian's filing note (2026-09-27): gate 2, attempt 2 (architect), the scoped read of record round 1 of 2, of PLAN node `kernel-generation-close-races`. Reviewed: cut/kernel-generation-close-races @ baf1a00 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: cut/kernel-generation-close-races @ baf1a00

**Verdict: FAIL.** One finding fails by name (round 15 (c)), and it takes a one-row fix. Everything else in Amendment 3 passes. That fix is record round 2 of 2, so any record failure after it means I reduce the record to references and the piece lands (the record cap, item (3)).

## Finding

**G2-1 — Amendment 3 row 1 makes a tool claim without the tool's commit (round 15 (c), by name).**
- Exact text: "§2e item 4 claims the test this piece deletes, and that claim binds once the node is done."
- The clause "that claim binds once the node is done" describes how `verify-test-claims` behaves. Its PLANNED/BINDING split lives in the tool's own header: `scripts/plan/README.md` §`verify-test-claims.mjs` sends the reader there for it.
- The row names no tool commit. The reviewer's D1 names `b82941e`, but row 1 cites D1 by label only, not by a pinned reference.
- Fix: append Amendment 4, class 3 (record round 2 of 2), one row of at most three sentences:
  - the defect: row 1's clause states the tool's behaviour with no tool commit;
  - the corrected reference: the reviewer's D1 line, pinned `state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-reviewer.md:15 @ <the main commit carrying it> sha256:<hex>`, which names `verify-test-claims @ b82941e`;
  - the proof: that span.
- End it with a superseded index: "Amendment 3, row 1, second clause → that pin". Add no other prose.

## Checked and passing

- **Class 1 labelling.** The first line says post-result and names record round 1 of 2. Row 1 is class 1 as round 15 (g) confirms for a withdrawal row in a correction round.
- **The withdrawal row.**
  - It sits in row position with the `withdrawn-test` marker and the ruling/carrier grammar: round 23, item 2 for both.
  - It pins `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:173 @ d4245fe…`. Line 173 is §2e item 4, the claim of `a_generation_minted_by_live_or_mint_carries_an_unheld_reference_and_its_end_emits`.
  - d4245fe is on main, so round 15 (e) holds.
  - It is a self-line, but pinned at a commit the citing commit does not create, which is round 14's permitted form for a reference that must carry a line. That grammar requires a line.
  - The pin matches the current tree, because the file is append-only.
  - I could not recompute the hash (no shell); the reviewer made it (gate-1 reviewer D1).
- **Row 2.**
  - Class 3 fits: it changes only where the claim points.
  - It has three sentences (defect, corrected reference, proof), within round 12 (d)'s ceiling.
  - It does not restate the superseded bullet's words.
  - The pin is at bfb436d, on main.
  - The superseded index is present (round 12 (e)).
- **Record cap.** Apart from G2-1, Amendment 3 is references plus the minimum defect statements.
- **Round 15 (f).** Nothing was restored. Amendment 2's text, including row 10's second bullet, reads the same as at af77861 by my comparison of the text, so it was not edited in place. The reviewer proves append-only against 00c3807 by byte.
- **Nothing else changed, as far as I could spot-check.** At baf1a00, `live_generation` (552), `begin_close` (711) and `viewport_query_attribute` (1368) are at the same lines as at af77861, and `live_or_mint` is still absent. The reflog shows 9df1890 (merge of origin/main), then baf1a00 (Amendment 3). The reviewer confirms with `git diff af77861 baf1a00 -- . ':!state/**' ':!PLAN.yaml' ':!CUSTODIAN-QUEUE.*' ':!site/**'` that only the preregistration changed.
- **Cited evidence.** Amendment 3 cites both gate-1 reports by path. They are tracked (present on main and in the worktree) and are cited as evidence, not Authority.

## Note, not blocking

The reviewer's D2 "related" item is not carried. That is row 10's third-bullet sentence, which is true but partial (the span also lists skp.rs 1341, 1343 and 1377, session_generation.rs 23 and 351, and source_watch_ordering.rs 19). Neither gate made it blocking. Do not fold it into round 2; the round-2 row carries G2-1 only.

## Files

- `C:/dev/wt/kernel-close-races/kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` (§10, Amendment 3)
- `C:/dev/wt/kernel-close-races/state/consults/gates/2026-09-27-kernel-generation-close-races-gate1-reviewer.md`
- `C:/dev/wt/kernel-close-races/scripts/plan/README.md`
