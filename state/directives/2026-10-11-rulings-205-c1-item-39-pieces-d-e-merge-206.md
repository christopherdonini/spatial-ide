# #205's C-1 (A) with two sentences appended; item 39's third sentence replaced; pieces d and e's open items; #206 merged now, #205 and #207 after the wording commits — the human, verbatim

*Custodian's filing note (2026-10-11): typed by the human, received at 08:28:47Z by the transcript. Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
1. PR #205, C-1: (A). Keep my paragraph as it is and append these two sentences at its end:
   Also refused: a file with no `crs` key whose coordinates the open-time check (item 22) finds outside ±180/±90, because they cannot be longitude and latitude. The code is `engine.format_default_contradicted`, and asserting the CRS the file is really in opens it.
   Correct the PR body and the worker report's claim that every clause held.

2. Item 39: replace its third sentence (from "Before the first pan" to "asks for nothing new.") with:
   One exception: after a file is opened, a filter is applied or cleared, or the map fits itself to the data, the map shows the features already loaded, and a change of size asks for nothing new until the next pan, zoom or Zoom to layer.
   The other sentences stay as they are. Record it on the map-refill form as an amendment on my ruling, and have a gate check the new sentence against Amendment 3, item 3 before I merge #207. If the sentence is wrong in any case, tell me and do not reword it.

3. Piece d (module-docs-stale-statements): OPEN-1 (a), the identity.rs reference moves into piece f's rename commit, as a one-file exception to that node's test-files-only rule. OPEN-2 (b), take the listed lines plus the two sites in engine/src/predicate.rs.

4. Piece e (skp-v0-live-sections-current-area-c): OPEN-1 (a), leave the nine fixture values and disclose them in the §8 note. Add them to the named open item on first-external-plugin-skp-client, so they are settled with the produce-or-not decision. OPEN-2 (a), take both rows, and the stale Proposed label at commands.rs:199-200 as well. Each corrected label states the amendment's status as the ADR records it.

5. I merge #206 now. #205 and #207 after these wording commits, on your word that they are ready.
