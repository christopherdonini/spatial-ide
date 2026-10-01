*Custodian's filing note (2026-10-01): the architect's gate 2 on PR #151, scoped to correction round 1, for PLAN node `catalog-open-replace-drop-latency-note` at g1 (note only). Reviewed: cut/catalog-replace-note @ 4941e47 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 06:22:27Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 4941e47. B1 and B2 are discharged. Its N6 (no superseded index for Amendment 1's figure) is closed by the index appended to the form's §10 at the close of correction round 1, in the line its N6 gives; its other notes go to the closing record. Profile paths redacted at filing: none.*

---

Reviewed: cut/catalog-replace-note @ 4941e47

**Verdict: PASS with notes.** B1 and B2 are discharged at 4941e47 and nothing blocks. I have no Bash, so I recomputed no diff or hash. I read `kernel/src/lib.rs:162-173` and `:194` in the worktree, and the form on main at 9644933.

**1. B1: PASS.** The first sentence is now "An `open` that returns `Ok` under a name already registered replaces the entry…". The note makes no statement about the Err path. `open_cancellable`'s pointer line (`:194`) is unchanged and takes the same condition from that sentence.

**2. B2: PASS.** The note now says what drops where:
- **`get`-holder case:** the holder drops the dataset, and also its pool when no lease is in flight, on its own thread.
- **Lease case:** the lease releases the pool on its producer thread, and the dataset is dropped under the guard when the catalog's `Arc` was the last reference.

Both agree with form §0 (the lease bullet) and with `Lease` holding `pool` (`engine/src/pool.rs`, `struct Lease`). The reviewer's gate-1 N3 (the ambiguous "it") is settled too.

**3. Whole note against §1 May 1 / May not, §8 items 3–4, ADR-018 item 4: PASS.**
- There is no figure. "128" is still absent, and the "4" in "ADR-018 item 4" is a reference, not a number.
- The note has no `docs/08` reference, no Err-path claim and no reachable product path. It does not call a collision impossible.
- The waiting clause is "every other catalog caller waits on the guard", which is within May not.
- The new word "later" is an ordering word, not a duration word. Form §0 uses it the same way. See N5.

**4. Amendment 2: PASS.**
- Class 8 is the right class, and §7 still reads ≤ 120.
- The figure is 133 at 4941e47, base d8544a0: 21+3 plus 109+0. That agrees with gate 1's 18+3 plus the round's 9+/6−.
- The reason is stated, and the first line says the amendment was written after the outcome was seen.
- Its last sentence settles the third bullet of my gate-1 N3 (Amendment 1's missing first-line notice), in one sentence, by reference. N3's first two bullets stay open.

**5. Other gate-1 findings at 4941e47:**
- §8 item 1 still passes: the worker and the custodian each count 0 non-`///` lines in `53e1cf4..4941e47`.
- §8 item 14 is still pending the merge style. Only a merge commit keeps c3e8e54, 53e1cf4 and 4941e47 resolvable.
- N1, N2 and N4 stand unchanged.

**Blocking**
- None.

**Non-blocking**
- **N1 (stands):** "no product path replaces a name on purpose" should be backed by a reference to the reviewer's gate-1 H1 grep at 53e1cf4 in the closing record.
- **N2 (stands):** §2 item 2's dropped final period should be recorded by reference.
- **N3, remaining bullets:**
  - The worker reports' test-line pointers should carry their commit ids.
  - The closing record must pin test text at a main commit after the merge (round 25, item 2).
- **N4 (stands):** the nested backticks are cosmetic.
- **N5:** "later" appears twice and is read as ordering, not duration. If a reviewer reads it as a duration word, the fix is to drop the word. Not owed.
- **N6, the record defect that remains:** Amendment 2's "final figure 133" makes Amendment 1's "final figure 130" stale, but no superseded index records that. If correction round 1 closes without one, it fails §8 item 13 (round 12, item (e)). The smallest fix, within the record cap, goes in the closing amendment: one superseded-index line, "Amendment 1's figure (130 @ 53e1cf4) is superseded by Amendment 2's (133 @ 4941e47)", as references only, with no new correction round.
- **N7:** `lib.rs:170` is a short, unreflowed comment line. Cosmetic, and rustfmt does not touch it.

Files:
- C:/dev/wt/catalog-replace-note/kernel/src/lib.rs
- C:/dev/spatial-ide/kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-01-catalog-replace-note-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-01-catalog-replace-note-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-01-catalog-replace-note-worker-report-2.md
