Question round 14 — 2026-09-17 (custodian → human). Four items: the execution of both re-scopes, three governance clauses with the engine restore, two baseline dispositions, and an untracked Authority file (DECISIONS-PENDING entry 106). Status beside them: P3b held at e53bb97 after attempt 5 FAIL/FAIL with the architect's re-scope on record (state/consults/2026-09-17-p3b-re-scope.md); #84 held at d6073d8 after re-read 3 FAIL with its re-scope on record (the custodian's scratchpad, consults/2026-09-17-lod-re-scope.md, committed under state/consults/ when #84 lands); the checker's last fix round running.

1. Executing the re-scopes. Each consult carries the exact closing-amendment text and a numbered list of worker steps (byte-copy at end of file, hash computations with their commands, the engine :1371 restore, any comment-line edits the consult allows, the self-checks, the commit message). the LOD's re-scope takes the same form — §10 Amendment 13 as a state-of-the-record list (recorded verbatim in the custodian's scratchpad, to be committed under `state/consults/` when #84 lands: its cites name test files not yet on main) — with three decisions of its own: the pointer d6073d8 inserted under §10's header stays where it is and is recorded with the two-line shift it caused (moving it would delete committed text and renumber the section a third time); the pointer's home is the closing amendment's head and foot, this document having no P6 sight list; and two spans of test text — the mutation record's second pin at 43a3039 and the `#[ignore]` message's missing qualifier — are corrected in the same commit under line-count neutrality, so no cite into that file moves.
Options:
  1. A fresh default-model worker executes each consult's steps exactly, adding nothing, then both gates run under a fresh count; a FAIL at that attempt is a finding about the mechanism and returns to you, not to another worker (Recommended).
  2. Execute P3b's now; hold the LOD's until you have read its consult.
  3. Hold both.

---

2. Three clauses and the restore. Byte-copied from the consult (state/consults/2026-09-17-p3b-re-scope.md, 1a0251461aa2), each with its line and that line's sha256:
  Class 7 (`state/consults/2026-09-17-p3b-re-scope.md:204` @ 1a0251461aa2 sha256:6662739f32c34e66492117a92cd2beb1e90fb9e4a35f21ef7ea9c98c2e9ed93c): 7. **Sight-list or gate-list addition, evidence-driven** — a P6 sight-list entry, block-on-sight item or gate step added because the piece's own runs showed an operator will meet something §9 does not name. Not class 5 (no ruling is narrowed) and not class 3 (it adds a thing to be looked at, not a pointer). The first line says **"sight-list addition"**, names the evidence by report or `file:line`, and states that no claim elsewhere changes. A sight-list addition never settles wording — the strings stay the human's at P6.
  Clause (a′) (`state/consults/2026-09-17-p3b-re-scope.md:206` @ 1a0251461aa2 sha256:3ba887681e265c681c69fe6845a99f3ce717ef7e7aeb8f3d1152d8fb0a4ac122): A ledger passage with no round or item is cited by the entry number the block itself carries ('entry 98'), never by line. Because (a) forbids a line cite into the ledger, no ledger passage is pinned by (b)'s path:line + hash: round + item, or the entry number, is its reference form, and the gate's own resolution against the RULED block or the entry is the proof.
  Root-cause rule (`state/consults/2026-09-17-p3b-re-scope.md:208` @ 1a0251461aa2 sha256:b7b3f7de5fc0b1299cfe04795df667836ea16e16c8e7e10c09566b02a6823d8d): A record never carries a bare `:line` into a file the same commit edits. A self-reference inside a preregistration is by section, amendment and item, never by line. A reference that must carry a line is pinned `path:line[-line] @ <commit> sha256:<hex>` at a commit the citing commit does not create; a pinned reference is stable under any later insertion, and the gate fails a bare self-line by name.
  The restore: engine :1371's committed bytes at 60ece22 are restored by the closing commit and the correction is carried by a row, rather than declaring the in-place edit an exception.
  The LOD consult's own gap: a record correction that changes a claim living in test text or an operator-facing string fits no pre-declared class; its recommendation is class 3 with a named exception for test text.
Options:
  1. Adopt all three clauses as byte-copied — class 7 into the template's class list, (a′) and the root-cause rule beside round 12's five in the template, both checklists, the worker brief and AI_DEVELOPMENT — the restore, and class 3 with a named exception for test text (Recommended).
  2. Adopt the root-cause rule and the restore only; hold class 7 and (a′).
  3. Hold.

---

3. Two baseline dispositions. (a) Disclosure: the entry you accepted in round 12 item 4 for engine/ADMISSION-PREREGISTRATION.md:220 as unfindable-by-construction is a tool false trigger — the quoted block is tracked at state/NEXT-CUT.md:111-127 and the checker's line-initial asterisk strip caused the mismatch; the fix round corrects the disposition and reason. (b) frontends/shell/RESIDENCY-PREREGISTRATION.md:125, the example in entry 102 (3): its elided span of docs/08_Testing.md:5 carries a negation about power-saving and variable refresh bearing on the budget the piece scores against; the round-11 rider was adopted after the example was offered and never certified this instance.
Options:
  1. Accept :220's corrected disposition; :125 becomes owed-correction, an appended note in the RESIDENCY preregistration restating the passage by reference (Recommended).
  2. Accept :220's corrected disposition; :125 stays tool-false-trigger with the negation named in its reason.
  3. Hold.

---

4. An untracked Authority. state/drafts/ is untracked in this public repository; engine/ADMISSION-PREREGISTRATION.md:7 names a file in it as the preregistration's Authority and ADR-032 cites it as binding, so no cite into it can resolve and no hash can pin it.
Options:
  1. Track it: commit the directory as it stands (this publishes the drafts).
  2. Keep it out of tree: the citing records declare the Authority out of tree by appended notes, and future preregistrations cite only tracked text.
  3. Hold.
