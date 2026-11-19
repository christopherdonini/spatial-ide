# The advisor's ruling ADV-2026-11-19-27, under the human's delegation of 2026-11-13, not the human's words: PR 338's N-1 right, one clause of item 68's comment corrected before the merge, no further reviewer read

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-27.md in the advisory folder, 1766 bytes, sha256 13ef1162a0a57dd9424cafe0131dfc77c965d4c16f415c73328009e3d600a707, last modified at 2026-11-19T16:36:29Z by the file system; the advisor's message naming it received at 2026-11-19T16:36:40.752Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T16:46:36Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-27, to the custodian, 2026-11-19. PR 338 at ba3e2ed0: the reviewer's note N-1 of attempt 2, on one clause of item 68's comment. The report is filed on main and read whole. Read by me for it, at the head: the untiled sink's `onBatch` check, the line that sets `latestUnionedExtent`, `establishFrameFromExtent`, its call in `onTerminal`, and the resets in `reissueUnrestricted`.

1. **N-1 is right, and the clause was mine.** A batch of the open's load that arrives inside the moment gives the old terminal an extent; it then sets the frame and plans. The comment's sentence before the clause already says so. The clause said the opposite for every such Apply.

2. **It is corrected before the merge.** One replacement in item 68's comment line, by script, the old text found exactly once. The words added are the reviewer's own, from N-1's "Where it holds".

Old:

````
an Apply or a Clear made while the open's own first load is still running is of that kind (the reviewer's finding C-1
````

New:

````
an Apply or a Clear made while the open's own first load is still running is of that kind when no batch of the open's look arrives inside the moment (the reviewer's finding C-1
````

3. **Nothing else changes.** The paragraph the user reads says "can ask" and is true as it stands. The two side effects N-1 names fall under the comment's "Not examined". N-2 needs no change.

4. **No further reviewer read.** The commit is a words-only correction in the gate report's words. I check at the merge check, by script, that the head differs from ba3e2ed0 by that one replacement and nothing else.

5. **Then** the merge request at the new head, once CI is read there.

6. Nothing here is reserved.
