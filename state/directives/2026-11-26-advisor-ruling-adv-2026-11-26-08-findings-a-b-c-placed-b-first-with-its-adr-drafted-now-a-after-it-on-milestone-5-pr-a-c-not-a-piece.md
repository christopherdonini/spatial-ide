# The advisor's ruling ADV-2026-11-26-08, under the human's delegation of 2026-11-13, not the human's words: findings A, B and C of Part AD placed; B first, with its ADR drafted now; A after it, on milestone 5's PR A; C not a piece

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-08.md in the advisory folder, 6050 bytes, sha256 2daf3a6508e649a504172fa9e488541595ab7e04dd21977c1924a7ce723d6ab6, UTF-8, last modified at 2026-11-26T19:04:44Z by the file system. It was named by a session message received after 2026-11-26T19:04:43Z and before 2026-11-26T19:05:40Z (both from date -u). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-08, to the custodian, 2026-11-26 (19:04Z). Findings A, B and C of Part AD are placed. I read the architect's read as filed (`state/consults/2026-11-26-part-ad-findings-a-b-c-architect-read.md`, sha256 67e7eee89ca2a2d2b9d5b8dfcafca221c2ed261a66b3efe83b8e06851130c25a). At main c28c8cf1 I checked `frontends/shell/src/App.tsx:2193` and `:2502`, `frontends/shell/src-tauri/src/lib.rs:215-218`, and `kernel/src/project/mod.rs:259-266` and `:780-782`. The rest of the read I take as the architect's.

1. **B is placed first of the two.** It is a fault a user can meet, and the heavier one: after a reload of the window, a saved project is refused in its own window until the app is closed, and every open of the old page stays held.
   - One proposed node, a full form, both gates. The piece is the read's: at the start of a main-window page load, the host ends every open the old page made, then `release_ended` runs.
   - **Base: main's tip**, as long as the piece stays out of `kernel/src/project/mod.rs` (PR 361 changes it) and `kernel/src/skp.rs`. By git today, no open PR's branch changes `src-tauri/src/lib.rs`, `e2e/project.mjs`, `kernel/src/skp.rs` or `kernel/src/lib.rs`. If the form's author finds that one of those two files must change, the base comes to me with the form's OPEN items.
   - No protocol file. If one turns out to be needed, that is a stop to me.
   - **S0, before any code:**
     - (a) the fault shown red at the base by the end-to-end step: open, save, reload the page, open the project, refused with `skp.project_open_elsewhere`;
     - (b) in a release build of the base, one reload by key (Ctrl+R, and F5), and what the session log shows for it. Use a release build that already stands if one does. If a script cannot press the key in that build, the form says so and leaves it not established; the human presses once at a later part of the sitting.
     - If no reload reaches a release build, tell me before the build starts. The piece keeps its node; its place and its words change.

2. **The ADR goes to the architect to draft now.** It is filed under `state/drafts/` as Proposed, with the next number unused on main and on the held branches. I rule on its acceptance from the filed draft, and the accepted text lands in B's PR. Beyond the read's skeleton, the draft answers:
   - (a) **Whose opens.** Whether the catalog can hold an open that the page did not make (another client under `docs/10`, a second window), today and as planned, and what the decision does to such an open. "Every dataset the catalog holds" is right only if every one is the page's.
   - (b) **Calls of the old page still in flight** when the load starts: an open, a save, an export, a stream. For each, what the user's data ends as. An open that completes after the closing must not leave a dataset that no page can reach.
   - (c) The first load at start, and a window other than the main one.
   - (d) **What the user loses at a reload** (the open dataset, the filter, the style, anything not saved), and that nothing asks first. Whether the installed build should ask, or switch the reload keys off, is listed as an open question with its cost, and with whether it needs a dependency or a setting. If it needs either, that part is the human's and is not in this piece.
   - (e) What a reload in the middle of a recorded step leaves in the step record (ADR-036).

3. **A is placed after B, built on milestone 5's first part.** It is a fault a user can meet, and it is small.
   - One proposed node, a full form sized to the piece, both gates.
   - **Base: PR A's head, once it has taken PR 365's head in** (ADV-2026-11-24-19). If the piece changes `App.tsx`, PR 366's head joins by a merge commit, because 366 changes that file. It merges after them.
   - The form may be written now from PR A's branch. Its code waits until PR A's reviewer has passed its second attempt.
   - **What the user must get, both:** each save's lines are new elements, so that they are announced again; and something true on the screen differs from the last save's.
   - My leaning, not yet words: the saved line carries the time of the save by the machine's clock. The form brings its candidates as OPEN items, each with what it costs in the tests. The words are mine then.
   - The line S-5 (`Raised again`) is not used for a save.
   - A click while a save is in flight changes nothing today (`saveProject.ts:98`). Whether the control shows a state while a save runs is an OPEN item of the form, in or out.
   - The regression is red before and green after, from the real app: save twice, and assert what changed (the human's message of 2026-11-21).
   - AD1's row changes with it. Its words are mine at the form's gates.

4. **Order** (the human's message of 2026-11-23: what a user can see or do, then faults a user can meet, then the rest).
   - B's ADR draft and B's form start now, as places allow. A's form follows B's.
   - Builds, as worker places come free: the identity route's code once its Amendment 5 has passed; PR A's remaining work; the case-fold build; B; A; then the stall measurement.
   - The text-id build enters ahead of B when the human approves ADV-2026-11-23-34. B does not wait for that approval.

5. **C is not placed as a piece.** AD3's row already takes what the human met as one of its two outcomes, so the row stays as it is.
   - A larger file would cost the human an upload and a second project. It is decided with the amendment that brings OP6 into Part AD, from the read's table, with the 145 MB file's attributes checked then.
   - Until then nothing is generated or uploaded for AD3.

6. **v0.2.** Under the human's message of 2026-11-23, A and B merge after the tag unless they say otherwise. Whether v0.2 carries either is theirs. I put it to them with the candidate, not now. If v0.2 goes without them, the KNOWN-LIMITATIONS words for each are mine, in the candidate.

7. Nothing here is reserved, except what items 2 (d) and 6 leave to the human.
