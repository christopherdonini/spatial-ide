# The advisor's ruling ADV-2026-11-26-23, under the human's delegation of 2026-11-13, not the human's words: B's form, round 1: OPEN-1, E-1 at the end of the chain with an open and a save of its own; OPEN-4, the session-log line's words; OPEN-5, (a) under the form's own condition; the findings outside the form; the piece on the shared log folder one proposed node after A

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-23.md in the advisory folder, 3461 bytes, sha256 cff5d4accc17e73a2addef9488b0989fd92402a306c2fcab8f06178c9f1e212f, UTF-8. It was named by a session message received before 2026-11-26T20:56:21Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-23, to the custodian, 2026-11-26 (20:55Z). B's form, round 1 (`state/drafts/reload-ends-the-old-pages-opens-form-architect-round-1.draft.md`, on main at 2b4e5f5a): its OPEN-1, OPEN-4 and OPEN-5. Read by me there: the header, §0 to §2, §4 to §9, the OPEN section and the findings outside the form. Not read: §3's detail, §10 and §10a. The words of item 2 are the advisor's, not the human's.

1. **OPEN-1: neither as offered. E-1 goes at the end of the chain, with an open and a save of its own.**
   - At the end, E-1 opens the fixture, saves a project into a scratch folder of its own, reloads the page, and opens that folder. No close in the page comes between its save and its reload.
   - It is red at the base there: the old page's open still holds that folder's lock.
   - No existing step then runs in a reloaded page, so the chain goes on proving what it proves today, and a later step cannot stop this piece for a reason outside its claims.
   - If the author finds that this is not red at the base, or that it breaks §7's ceiling, (a) stands, and you tell me which. (b) is not taken.
   - §4's row for E-1, §3's fixture line and §5's fourth invalidator follow.

2. **OPEN-4: the session-log line.** Level `info`. Its text, with each `<n>` a count in decimal digits:

````text
page-end opens_closed=<n> opens_cancelled=<n> publishes_cancelled=<n>
````

   - It is written at every end, the first load's included, where all three are 0.
   - The form says what each count counts, so that each word is true: an open is counted as closed only when the host's close answered for it, and as cancelled only when the kernel answered `requested`.
   - It carries no handle, path, name or project identity, as §2 item 5 (iv) has it.

3. **OPEN-5: (a), under the form's own condition.** If the human's approval of ADV-2026-11-26-21 is on main before this PR's documents commit, the note is appended to ADR-020 in this PR, by script from the approved item's fenced block, and both gates' posture check reads it.
   - Otherwise ADR-020 is not changed in this piece. If the approval comes later, I bring the human the one line that says where the note then lands.
   - This replaces the last sentence of ADV-2026-11-26-18 item 5, which said that the note lands on its own.
   - B does not wait for that approval.

4. **The findings outside the form:**
   - **The shared WebView2 data folder (finding 4).** I searched `frontends/shell/src`, and the `src` folders under `renderer/`, for `localStorage`, `sessionStorage`, `indexedDB` and `document.cookie`. The only matches are two comments in the shell saying that none is used. So by that search no page storage carries from a run into the human's own runs. The small piece after B keeps the question, with the log folder.
   - **Finding 6** (reaching wry's setting needs raw `webview2-com` access or a dependency) is noted for the piece on the reload keys: those two options are then the human's, and the two page-code options are mine.
   - **Findings 1, 2 and 7** are recorded with the form. None needs a ruling now.
   - **Finding 5** (the recovery offer has no product caller) is the recovery offer's own piece.

5. **The piece on the shared log folder** (ADV-2026-11-26-17 item 5): one proposed node, after A in the order of builds, no form yet.

6. Nothing here is reserved. Item 3 rests on the human's own approval if it comes.
