# Directive — B2's brief filed, the human's rulings of the evening, and B2 re-described (the human, verbatim)

*Custodian's filing note (2026-10-07): the human's message, received at 19:52:44Z by the session transcript. Below the rule is its text, byte-copied by script from the transcript, with one final newline and nothing else changed (lines 6 to 42). It names no other project. Item 1 was done first: both files were copied from the human's advisory folder for this project into `state/directives/`, and each matched its stated sha256 and size. `B2-BRIEF-2026-10-07.md` is 71f29b559ee2810cde580fdac7e18725a47afd0b6bc74860bc5c2362e51d8ff1, 18,697 bytes. `O-07-WALKTHROUGH-2026-10-05.md` is d34845eb6233788166acc84a1e90d09469b055997980c973d7a8e2f7fdb7c8c6, 26,750 bytes, and it replaces the copy filed at 30e77c10 (c154b27b… was the plan; the walkthrough's earlier copy was 2f7a82a1…), as the human directs. Against that copy, the change is in its decisions' section 4.2: one bullet is replaced by three new bullets and one sub-bullet (four lines added, one removed). These rulings refine those of 19:23Z, and where they differ these hold. They get a RULED block in `DECISIONS-PENDING.md`.*

---
Custodian: B2's brief and my rulings of this evening. File, record, re-describe.

1. File. Copy both from my advisory folder to state/directives/ and check sha256.
   If a hash differs, stop and tell me.
   - B2-BRIEF-2026-10-07.md
     71f29b559ee2810cde580fdac7e18725a47afd0b6bc74860bc5c2362e51d8ff1 (18,697 bytes)
   - O-07-WALKTHROUGH-2026-10-05.md, changed since you filed it; it replaces that copy
     d34845eb6233788166acc84a1e90d09469b055997980c973d7a8e2f7fdb7c8c6 (26,750 bytes)

2. My rulings (Chris). They refine those of 19:23Z; where they differ, these hold.
   - The session history is on the machine, found by the project's identity, not
     its path. After a crash, the next open offers to recover the unsaved steps;
     they enter the lineage only at Save project.
   - The dated docs/07 note lands with stage 1 or just before it. I type it then.
   - No kept branches in B2, neither "keep this branch" nor "keep every branch".
     The parent field stays in the record.
   - Five stages. Stage 1's form fixes the full step record and proposes the
     format ADR.
   - Steps left behind by going back after a save leave the lineage at the next
     Save project; they stay in the session history until the session ends. An
     export made from them keeps its own copy of those steps in its audit record.
     The session history has a "saved here" mark.
   - An incomplete lineage keeps the data's grade and shows "recipe incomplete,
     N steps withheld" beside it. No ADR-005 amendment; the format ADR defines
     the marker.
   - Stage 1 runs as pieces 1a, 1b and 1c, and stage 3 as 3a and 3b, per the
     brief's §9. Piece 1a's form is stage 1's form.
   - The brief replaces the plan's §10 as the brief for B2's forms. The rest of
     the plan stands.

3. Do:
   - Re-describe briefb-b2-save-reopen to cite the brief.
   - Add proposed nodes for 1a, 1b and 1c with the needs in §9. Stages 2 to 5
     stay in the parent node for now.
   - Place 1a's form in slot 2's order after the pieces already there. Its form
     confirms whether it needs the ADR-029 ruling.
   - Change no ADR status and no docs/ text in this step.
