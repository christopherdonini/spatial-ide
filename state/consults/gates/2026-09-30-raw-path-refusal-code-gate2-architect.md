*Custodian's filing note (2026-09-30): the architect's gate 2 on PR #148, scoped to correction round 1 (the form's Amendment 1), for PLAN node `publish-refusal-codes-and-attempt-lifecycle` at g1, the first piece (A4-4). Reviewed: cut/raw-path-refusal-code @ 3777ad0 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b). It is transcribed from the hand-back message (enqueued 19:46:35Z) with the harness's two-space indent removed, and the text below the rule is the agent's. Its branch-only `path:line` cites are read at 3777ad0. It confirms Amendment 1's class 1. Its N1 is met by the gate-2 reviewer's mutation observation at 3777ad0, the observation of record. Profile paths redacted at filing: none.*

---

Reviewed: cut/raw-path-refusal-code @ 3777ad0

**Verdict: PASS with notes.** Nothing blocks.

I have no Bash, so I could not run git diff myself. That the delta is one line rests on the custodian's check in the filing note of `state/consults/2026-09-30-raw-path-refusal-code-worker-report-2.md`. My reading of the tree at 3777ad0 agrees with it.

**1. Class 1 is the right class: PASS.**
- Class 1, as `docs/PREREGISTRATION-TEMPLATE.md` §10 defines it, is an amendment written after results were seen. It records the result and what it invalidates. Round 15 (g) confirms that a gate round's findings count as that round's results.
- Amendment 1 does all of this:
  - Its heading and first line say it was written after the results.
  - Item 1 records the result (the reviewer's N1: a latent race, not reproduced in 60 paired runs).
  - Item 1 states that nothing is invalidated.
- The other classes do not fit:
  - Not class 2: no run deviated from a §3 or §5 prediction.
  - Not class 3: the fixture name is a declared fact, not a pointer.
  - Not class 4: no mutation was added or corrected.
  - Not class 5 or 9: nothing was narrowed, and no standing rule added work.
  - Not class 7 or 8: no sight-list entry, and no overrun.
- §3 and §4 are left unedited, as the append-only rule requires. No new class is needed, so nothing routes to the human.

**2. The delta implements item 2 and nothing else: PASS.**
- `kernel/tests/end_to_end.rs` line 525 at 3777ad0 is now `fixture("crs-raw-create", 500)`.
- The rest of T1 matches gate 1's reading: the name, the START frame (bbox `[7,46,8,47]` in EPSG:4326), the four assertions and the mutation site.
- The sibling at line 498 still uses `fixture("crs", 500)`, and no other `.rs` file in the tree uses `crs-raw-create`.
- `fixture` (lines 37-47) uses the name only in the file path. The spec is the same, so item 3's claim that P0 at 4db0865 stands is true.
- `kernel/src/lib.rs:383` is unchanged.
- §7: 44 changed lines over 2 files, against a ceiling of 60 over 2. No class 8.

**3. Gate-1 verdict at 3777ad0: unchanged.**
- My gate-1 items 1 to 5 still hold.
- Gate 1's N1 (SKP-V0 naming only one prefix site) still stands and is routed to the node's closing.
- Gate 1's N2 is sharpened: T1 and its sibling must stay separate tests, and each must keep its own fixture file.

**Blocking:** none.

**Non-blocking:**
- N1. The worker's mutation record at 3777ad0 (report 2, the mutation bullet) names the test and the panic at 546:28, which is the prefix assertion. It records no message text. This meets round 25 item 2 (c) (applied, not a `verify-mutation` run). Amendment 1 item 3 owes this re-observation, and it is not yet backed by a gate. Let the reviewer's gate-2 re-observation be the observation of record.
- N2. The worker's "43 added lines" (report 2) and the filing note's "44" do not conflict: 43 insertions plus 1 deletion make 44 changed lines, the unit §7 counts.
- N3. Round 12 (e)'s superseded index is not triggered: this is a code-correction round, not a record-correction round. Amendment 1 item 2 already names what it supersedes (F1's file name in §3). A reader of §3 alone still sees `crs`, so this is covered by "read the last amendment first". This round does not count against the record cap.

Files:
- C:/dev/spatial-ide/kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md
- C:/dev/wt/raw-path-refusal-code/kernel/tests/end_to_end.rs
- C:/dev/spatial-ide/state/consults/2026-09-30-raw-path-refusal-code-worker-report-2.md
