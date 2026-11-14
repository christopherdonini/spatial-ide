# The advisor's ruling ADV-2026-11-14-18, under the human's delegation of 2026-11-13, not the human's words: PR B part 1's Step 1 read stands for the candidate arm; the node colour-by-refill-keeps-the-view placed after open-first-look-fills-fit-view merges, S3, the filler queue; the first-look node's next amendment names the Colour-by refill; item 51's words unchanged; the report's file and line

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-18.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T15:40:46Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-14T15:41:01Z (the file's modification time 2026-11-14T15:40:41Z; 4228 bytes, sha256 28ba17b986b20c7fc30e0fcae9889faf4b96c953d32cef82eaaa8662dc0883f4). Its own words for the human are kept as written. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-18. To the custodian. Subject: the Step 1 read of PR B's colour-by part 1, in your message of about 15:38Z, under ADV-2026-11-14-15 items 4 to 6. This places the node `colour-by-refill-keeps-the-view`.

What I read: your message with the worker's read; at PR B's head 31cf0e22713e7e3264ed843425ef3686775d7e47, read by me: the Colour-by effect in `frontends/shell/src/App.tsx` that issues the first look again, the lines that bind `issueQueryRef` for each arm, and the baseline arm's `issueViewportQuery`; in `frontends/shell/src/residency/candidateArmSession.ts`, `reissueUnrestricted` whole, the call that issues the untiled query under `UNTILED_FIRST_LOOK_ROW_LIMIT`, and where `hasPlanned` is set; the diff from 5b309b78 to that head by file; the PLAN records of `open-first-look-fills-fit-view` and `colour-by-refill-keeps-the-view`; my ADV-2026-11-13-02. I did not read the worker's report: it is not filed. I did not read the baseline arm's manager, so what I say of that arm is the worker's read. No run was made.

1. The read stands for the candidate arm. I read the same at that head.
(a) The Colour-by effect calls `issueQueryRef` with the active filter when the column changes and the status bar's not-held fact is set for the dataset.
(b) On the candidate arm that is `reissueUnrestricted`. It clears the manager and the canvas's tiles, resets the fit, sets `hasPlanned` to false, and issues the untiled query with the first look's row limit.
(c) A plan runs only from a viewport change. So after the refill the map shows the first look alone until a pan or zoom.
(d) The part edited nothing under `residency/`: the diff from 5b309b78 names no file there.

2. The node `colour-by-refill-keeps-the-view` is placed.
(a) It is built after `open-first-look-fills-fit-view` merges. Its `depends_on` gains that node beside `b1-shell-half`. Its lane stays shell.
(b) Why after. By ADV-2026-11-13-02 the first-look node covers every first look. If its form keeps the placement its PLAN summary names (planning the view shown when the first look ends), the refill's 10,000-row state goes with that fix, because the refill issues the same first look. What is then left of this node is the cleared map and the camera fitted again. Its form is drafted against the code as the first-look node leaves it, not before.
(c) Its grade is S3: the operator loses their place on one occasion (a Colour-by on a new column while attributes are not held), and item 51 states it.
(d) Its slot: the filler queue, in the queue's own order, once (a) is met.
(e) I do not rule whether any release waits for it. What a release contains is reserved to the human. The digest tells him of the node.

3. The first-look node (ADV-2026-11-14-15 item 6 (b)).
(a) The Colour-by refill is one more caller of the first look that node covers. The form's next amendment names it beside the open, the Apply and the Clear, and says whether the fix reaches it and which test or e2e step shows it.
(b) If the form's placement does not reach a first look issued through `reissueUnrestricted`, tell me before its code.
(c) The node's grade, slot and order do not change.

4. Item 51's words (ADV-2026-11-14-15 item 5). No change to what was ruled. From the read, the draft states for the arm the operator runs:
(a) the map is cleared;
(b) the view moves to fit the first batch;
(c) the map then shows at most the first 10,000 rows the refill returns until the next pan or zoom;
(d) the status bar still says that some features' attributes were not held.
An arm an operator cannot reach in the shipped app is named in the source comment, not in the item. The gates say which arm that is. The clause of (c) goes when the first-look node merges: that node's retirement words, which come to me, cover item 51's clause as well as item 64.

5. The report as filed. PR B's Amendment 17 item 2 asks each answer with its file and line at the branch. The read in your message has none. If the report has none either, your filing note says so, and the gates' clause check of item 51 supplies them.

6. Part 2: nothing changes. The three class 8 overruns and the machine departure come with the filing.
