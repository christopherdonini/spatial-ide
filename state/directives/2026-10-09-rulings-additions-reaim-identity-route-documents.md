# Rulings, added — the e2e re-aim placed in slot 1, milestone 2's start, the identity declaration route, the documents, KNOWN-LIMITATIONS items as disjoint paths (the human, verbatim)

*Custodian's filing note (2026-10-09): typed by the human as a new message, received mid-turn at 08:41:34Z by the transcript (its queued-command record, origin human). Below the rule, byte-copied by script from that record, is the message (from line 6 to the end), with one final newline added and nothing else changed. It adds to `state/directives/2026-10-09-rulings-on-the-eight-forms.md` and answers the custodian's three questions after the e2e triage. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
Added to my rulings on the eight forms.

1. e2e-stale-expectations-reaim: placed in slot 1, right after the K6 fix. Slot 1 is now: the K6 fix, the e2e re-aim, map-refill, milestone 2. The architect drafts its form now, alone. Do the solo re-run of console GROUP' and REFUSAL' first; the form cites it.
   Its rules:
   - No product change. If a step turns out to need one, or shows a defect, stop and tell me.
   - A step whose behaviour a ruled change replaced moves to the ruled behaviour and cites the ruling. A step whose behaviour still exists keeps what it asserts and changes only what it assumes. Each re-aimed step is shown still able to fail, by one observed mutation.
   - C2'/C3', MAP' and BOTHNEEDED': the file with no id column is asserted to open on the session tier, with its statement shown. The refuse-then-declare route stays proven, on a file that still refuses and offers a column to declare. New test-only fixture generators are allowed for that. Fixture names and comments that say "refused" for files that now open are corrected.
   - HEXLIM': the exact key list, with columns added.
   - GROUP' and REFUSAL': option 1. REFUSAL' polls with a declared bound. GROUP' asserts its group by what the entries are, not by counting every new header. The suite stays on the arm that ships; nothing pins the baseline arm. The form says how GROUP' stays inside the recorder's capacity.
   - source-changed S3 and S4: re-aimed to a change the watcher cannot see, so the pre-check route is still proven. It must run on the e2e machine without administrator rights.
   - Walkthrough rows C2/C3, I4 and I5: the form proposes the new row text for my sight. No result log is edited.
   - It also carries the KNOWN-LIMITATIONS paragraph of item 4 below.

2. Milestone 2's code starts after the K6 fix, the e2e re-aim and map-refill have merged. The re-aim replaces the triage in that list. Phase A's proof is every suite passing unedited, and today the admission steps stop before the route phase A rewires.

3. The identity declaration for a file that opened without an id column: yes, the app needs a route. The summary already tells the user to declare an identity column, and the app offers no way to do it. Append a proposed node, graded S2. I place it after milestone 2 merges. It is not part of the re-aim and it blocks nothing. Its form asks me how the candidate columns reach the shell.

4. The documents.
   - QUICKSTART.md stays as it is. It describes the v0.1.0 download, and for that it is right. Note on release-v0-1-1 that its identity bullet changes with the next release.
   - KNOWN-LIMITATIONS item 3 gains this paragraph, after its existing text, in the re-aim PR:

   **On `main` (not the v0.1.0 artifact above).** A single file that has no `id` column and no declared mapping opens instead of being refused. Its features are identified for that session only, by their position in the file, and the summary says so. That identity does not survive a reopen or a change to the source, and it is never saved or published. This is the one case in which a row position stands in for identity. The app does not yet offer a way to declare an identity column for a file that opened this way: the declaration form appears only when a file's identity is refused. A file whose `id` column cannot serve is still refused.

5. For the disjoint-paths check: two pieces that edit different numbered items of KNOWN-LIMITATIONS.md count as disjoint. The later one merges main in before its last gate run.
