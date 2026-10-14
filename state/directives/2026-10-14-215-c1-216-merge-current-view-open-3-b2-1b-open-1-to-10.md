# #215 C-1 in the reviewer's words; #216 merge approved (E7 to E11 after the human's reload); the Current view fix OPEN-3; b2 piece 1b OPEN-1 to OPEN-10, the ADR-022 amendment and the docs/07 note in the human's words, and the impact answer's questions — the human, verbatim

*Custodian's filing note (2026-10-14): typed by the human mid-turn, queued, received at 07:04:52Z by the transcript. Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
1. PR #215, C-1: yes, the reviewer's words: "Current view then publishes the area the map shows, unfiltered, as item 8 says."

2. PR #216 (guardian-v1): I approve the merge. The live checks I allow after my reload: E7, E8, E9, E10 and E11. I click the merge and run the reload myself, and tell you when both are done.

3. The Current view fix, OPEN-3: the added sentence stands second, as you placed it.

4. B2 piece 1b.
   OPEN-1: (A). My words for ADR-022, with the date you receive this in place of <date>:
      ## Amendment 1 — style persistence granted for the session history (<date>, the human)
      From piece `b2-piece-1b-recording`, a committed style edit is persisted as a `style.set` step in the session history ADR-036 defines (Proposed). This is the grant Consequences (b) left open, for that store only.
      - ADR-006's class-2 machinery is the kernel's step record: each edit is one step, recorded by the kernel's `record_step` command (ADR-036 §12), as one line flushed before the reply; a line that is not whole is never recovered (ADR-036 §9).
      - docs/11's obligations: the record's and the step's identities (URI), ADR-036 §6 (schema), ADR-036 §9 (lifecycle), and the step's `actor` and `at` (provenance).
      - Consequence (a) stands: nothing is undone, and no UI implies undo.
      - Persisting a style in a project file or a lineage is not granted here.
   OPEN-2: (A).
   OPEN-3: (a). Blocks 0 and A to G as drafted, with "recovered". The blocks also spell the three values the impact answer found unspelled: an absent geometry_types is a named state; "or a state" applies to each member of dependencies on its own; geometry_types are the file's declared types, not the engine's encoding.
   OPEN-4: (A).
   OPEN-5: (A).
   OPEN-6: (A), confirmed.
   OPEN-7: (A).
   OPEN-8: (A). Block F as drafted.
   OPEN-9: (B), before 1b's code. The architect drafts these as further blocks of section 2.7, for my sight:
      - dependencies.crs gains a definition member: the sha256 of the definition the engine admitted, or a named state where there is none. The block names the exact bytes hashed; I prefer this ADR's canonical JSON if it can carry a definition. The identifier stays, as a label only.
      - its source holds the provenance class as describe reports it, so that a format-default admission is visible. That is also crs.source's closed vocabulary.
      - the coordinate epoch is reserved by name in section 11, as a dataset fact that may later be one value, a named column or not stated, added by a version step. The "(§11)" pointer for the selection scope is corrected.
      - the registry paragraph says that a parameter holding coordinates names its space.
   OPEN-10: my words for the docs/07 note, with the date you receive this in place of <date>:
      *(Appended <date>.)* **Split.** The Prototype's B2 records; it does not replay. From B2 piece 1b, the kernel records each filter and style change a user commits as a typed step (ADR-006, workspace mutations), in a session history kept on this machine that a crash of the app does not lose and a normal close clears. Later B2 pieces keep the contributing steps in the project's lineage at Save project, and restore a project to a recorded step. This is not the Alpha item: replaying recorded steps, notebooks and workflows (13's Workflow IR) **stay Alpha**. It is not the Beta item either: B2 keeps no branch, and **lineage time travel and scenario branches stay Beta**.
   The KNOWN-LIMITATIONS item of section 2.10 L: approved as drafted.
   The impact answer's questions:
      Q1: yes. AdmittedPredicate keeps its referenced column names behind a pub accessor, with its test and mutation; class 9 in Amendment 1, inside the engine group's ceiling.
      Q2: the Arrow type, as describe spells it. The engine keeps no surrogate types.
      Q3: the live check is the one ordering point. A close or an end that lands after it does not stop the write; the line is true of the open it names. The form says so, record_step takes no lock a close waits on, and no test waits on a race.
      The style check: the kernel checks each value by wrapping it in a whole style document and calling the renderer's parse; the renderer is not changed. The lower-case rule is the kernel's own check, refused by name. One test each.
