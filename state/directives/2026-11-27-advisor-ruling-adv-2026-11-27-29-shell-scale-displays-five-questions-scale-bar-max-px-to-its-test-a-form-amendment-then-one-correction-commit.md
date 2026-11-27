# The advisor's ruling ADV-2026-11-27-29, under the human's delegation of 2026-11-13, not the human's words: shell-scale-display's five questions: SCALE_BAR_MAX_PX leaves the product file for its test, the item with a bar an image, the seam's comment, two README clauses, F3 and F5 change; a form amendment, then one correction commit

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-29.md in the advisory folder, 12476 bytes, sha256 6a53ebedd17f9d669989a663dd3a42980199e8c66ff0f37242fbaae82fcf1f98, UTF-8, last modified at 2026-11-27T15:06:03Z by the file system. It was named by a session message received before 2026-11-27T15:07:16Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-29, to the custodian, 2026-11-27 (15:05Z). `shell-scale-display` at cbea7d4e (PR 368, draft): the five questions from its two build-gate read parts. It replaces three places of ADV-2026-11-27-28: the second span of item 2's comment, one span of row AI1 in item 3, and item 4 for two clauses. Everything else of that ruling stands.

Read by me: both read parts as filed on main at 646b8b88, whole. At cbea7d4e: `scaleBar.ts`, `scaleBar.test.ts`, `regionParts.tsx`, `App.scale.test.tsx` and `canvas/viewportBbox.ts` whole; `layout.mjs` lines 520 to 612; the status rules of `styles.css`; in `e2e-test-surface.ts` lines 185 to 205 and its other caller lines; App's registration of `e2eReadWorkspace`; the README's entry. On main: the form's §1, §2, §4, §7, §8, §9 and Amendments 12 to 16; the caller rule and its exemption in `governance/AI_DEVELOPMENT.md`; the admission form's record of the exemption's first boundary case and of the human's addition. On B's branch: commit 2962d546 for `e2e-test-surface.ts`. The two ARIA statements in item 3 were checked today against the tables of the WAI-ARIA 1.2 Recommendation for the roles `generic` and `img`. Not read: the logs, the PR body, and the form's Amendments 2 to 11 beyond the lines that name each mutation's failing cases.

1. **`SCALE_BAR_MAX_PX` leaves the product file. This is the reviewer's way (b).**
   - The exemption is the human's sentence. It names a read-only accessor over state the shipped build maintains. A constant is not that, and I do not stretch the human's exemption to it. F1's doc line is not applied.
   - The record has this case already. At the exemption's first boundary case, an item it did not cover was deleted, and its check became a local helper of the one test that called it.
   - Way (a) is not taken. A branch no input reaches is dead code.
   - What changes:
     - in `scaleBar.ts`, the line `export const SCALE_BAR_MAX_PX = 150;` goes, and two doc spans change;
     - in `scaleBar.test.ts`, the import of the name goes, and the file declares the name as a local constant below its imports.
   - U-SB2's title, its assertions and M2's comment stay as they are.
   - §7's values and §1's claim do not change. The width is still declared, and tested, as 60 to under 150. §7 is not edited.
   - Class 9 on this ruling: §2 item 1 and §7's table are read so that `scaleBar.ts` holds the constants its code reads, and the maximum is declared in U-SB2's file.

````text
scaleBar.ts, the file's header doc, one span:
Old: kept in [SCALE_BAR_MIN_PX, SCALE_BAR_MAX_PX).
New: at least SCALE_BAR_MIN_PX and under 2.5 times it.

scaleBar.ts, the doc line above SCALE_BAR_MIN_PX, whole:
Old: /** The bar's CSS width, [min, max) (§7). The smallest 1-2-5 length with a width of at least the minimum is under 2.5 times it, so under the maximum. */
New: /** The bar's least CSS width (§7). The smallest 1-2-5 length with a width of at least it is under 2.5 times it, so under §7's maximum of 150. No code here reads that maximum: `scaleBar.test.ts` declares it, and its U-SB2 checks it at every step of its sweep of zooms. */

scaleBar.test.ts, two new lines below the imports:
/** §7's maximum of the bar's CSS width. No product code reads it, so it is declared here, beside the one test that checks it (U-SB2). */
const SCALE_BAR_MAX_PX = 150;
````

   - Each clause, against the code: two neighbouring lengths of the 1-2-5 series differ by a factor of 2 or 2.5; the search starts one exponent below the range, so the length before the smallest bar is always tried; U-SB2 sweeps the zooms -19 to 16 in steps of 1/64 and asserts a width under the maximum at each.

2. **F2: the comment is corrected, in my words.**
   - Class 9: `frontends/shell/src/e2e-test-surface.ts` joins the piece for this one comment. The count then reads 11 files against §7's 10. That is class 8, in the same amendment, and §7 is not edited.
   - This doc is an instrument-accessor declaration. The human's rule has it name each caller and say why that caller needs the read. The architect's New says what E-SCALE reads, not why.

````text
Old: Only caller: `e2e/reopen.mjs`, which must see the state a reopen applied.
New: Its callers: `e2e/reopen.mjs`, which must see the state a reopen applied, and E-SCALE in `e2e/layout.mjs`, which must know the zoom the canvas holds after a wheel notch to say what the scale item should then show.
````

   - Wrapped as that file's lines are.
   - Each clause, against the code: under `e2e/`, only `reopen.mjs` and `layout.mjs` call the hook; E-SCALE's step W reads `.view.zoom` after the wheel notch and takes the expected label and width from `scaleReading` at that zoom (`layout.mjs` lines 587 to 598); the hook's `view` is the canvas's `currentView()` (`App.tsx` lines 1501 to 1508).
   - **A shared path with B.** B's commit 2962d546 changes two other caller lines of this file. They are lines 188 and 193 at this head, and this pair is line 199. It counts under rule (00), and it is met as ADV-2026-11-27-27 item 2 has it. Nothing is held. Whichever of the two pieces merges second takes main in by a merge commit, with the reviewer's narrow read of that file and the suites that start no app green, before my merge check.
   - This form's amendment records the row, and so does B's next amendment. By my git read, B's is the only unmerged branch that changed the file since 2026-11-18. You check the rest of rule (00)'s list.

3. **F6: with a bar, the item gets `role="img"`.**
   - ARIA 1.2 prohibits `aria-label` on the generic role, which is the role of a `div` that names none. So §2 item 2 drafts a label the specification does not allow. That is a fault of the form's design, not of the worker.
   - The `img` role takes its name from the author, and its children are presentational. With the role, S-2 names the whole item for assistive technology, in place of the short label.
   - It is no live region. §8 item 7 and §2 item 2's reason stand.
   - The lines S-3 and S-4 are plain text. They get no role and no label.
   - What changes:
     - in `ScaleItem`, the `div` that holds the bar gains `role="img"`;
     - in R-SC1 case (ii), the expectation on the role becomes `"img"`;
     - the doc and message texts below.
   - Class 9 on this ruling, an addition to §2 item 2, recorded before its code.
   - No test reads the accessibility tree. So a test message and the README say `aria-label`, and nothing of the piece says that a test checked an accessible name.
   - E-SCALE asserts nothing new. R-SC1 holds the role through the real App.

````text
regionParts.tsx, ScaleItem's doc, one line added after the line that begins "No `role="status"`":
With a bar the item has `role="img"`: ARIA 1.2 prohibits `aria-label` on a `div` with no role, and with this role the label names the whole item and its children are presentational.

scaleBar.ts, S-2's doc line, whole:
Old: /** SHELL-SCALE-DISPLAY S-2: the title and accessible name of the bar's item. */
New: /** SHELL-SCALE-DISPLAY S-2: the `title` and the `aria-label` of the bar's item, which has `role="img"`. */

App.scale.test.tsx, case (ii), two lines:
Old: expect(item()?.getAttribute("aria-label"), "(ii) the accessible name is the title").toBe(item()?.getAttribute("title"));
New: expect(item()?.getAttribute("aria-label"), "(ii) the aria-label is the title").toBe(item()?.getAttribute("title"));
Old: expect(item()?.getAttribute("role"), "no live region").toBeNull();
New: expect(item()?.getAttribute("role"), "(ii) an image, not a live region").toBe("img");

layout.mjs, assertBar's last message, one span:
Old: and the accessible name ${JSON.stringify(seen.aria)} are not
New: and the aria-label ${JSON.stringify(seen.aria)} are not
````

4. **The e2e README's entry for E-SCALE: two clauses, in my words.** This replaces ADV-2026-11-27-28 item 4 for these two. The rest of the entry stays the worker's.

````text
Old: and its title and accessible name agree)
New: and its `title` and `aria-label` attributes are both S-2 at that length)

Old: It records `devicePixelRatio` and claims the bar's length at no ratio other than 1.0 (KNOWN-LIMITATIONS item 80; Part AI's row AI5 is the human's check at their own display scaling).
New: It records `devicePixelRatio` in its note and asserts the same CSS widths whatever that ratio is. It does not measure the map: that a bar of that CSS width spans its length on the map rests on the reading in `src/canvas/viewportBbox.ts`, measured at a ratio of 1.0 only (KNOWN-LIMITATIONS item 80; Part AI's row AI5 is the human's check at their own display scaling).
````

   - Each clause, against `layout.mjs`: `assertBar` fails unless the `title` and the `aria-label` each equal `scaleBarTitle` at the row's length; the ratio is taken from the last bar row and returned in the step's note; no line branches on it; the step reads the item's DOM and the held zoom, and no pixel of the map.
   - `viewportBbox.ts` lines 16 to 22 give the reading and say it was measured at a ratio of 1.0.

5. **F3, F4 and F5, the clauses in my words.**
   - **F3 changes now.** The architect is right. At this head the span says a record exists, and none does. It replaces the second New of ADV-2026-11-27-28 item 2. The new span is true at this head and after the run.

````text
KNOWN-LIMITATIONS item 80's comment, one span:
Old: The last sentence stands on E-SCALE's record of a devicePixelRatio of 1 (form §2 item 8).
New: The last sentence stands only if E-SCALE's record of devicePixelRatio is 1 (form §2 item 8); the build gate's run part reads that record.
````

   - ADV-2026-11-27-28 item 2's rule stands: a record of any value but 1 comes to me before the run part's verdict.
   - **F4 does not change, now or at the run part.** The app shows the bar at every display scaling, so the bar itself says what S-2 says. Item 80's last sentence tells what was checked. Row AI5, with invalidator I7, is the check at the human's own scaling. A red AI5 comes to me.
   - **F5 changes now.** One span of row AI1. It replaces that span of ADV-2026-11-27-28 item 3.

````text
MANUAL-WALKTHROUGH.md, row AI1, one span:
Old: and the bar stays between about 60 and 150 pixels long.
New: and the bar stays between about 60 and 150 pixels long at 100% display scaling, and longer in proportion at a higher scaling.
````

   - Against the code: the bar's width is set inline in CSS pixels, and a CSS pixel covers as many screen pixels as the ratio says.

6. **E1: recorded as unobserved. No test changes for it.**
   - The kill is observed for all five mutations.
   - For M1, M3 and M4 the form's sets name a second case: 12, k = -1 and `unestablished`. Those were not reached, because each test stops at its first failing expectation.
   - The next amendment records it as class 2: each observed at its first named case, the second named case not observed. Nothing may call those three cases observed.
   - The tests are not made soft to reach them. That would change how the shipped tests fail, and it would show nothing more about the kill.
   - **After the correction commit,** the reviewer's run part observes M2 and M5 again at the corrected head. Item 1 changes U-SB2's file, and item 3 changes `ScaleItem` and R-SC1 case (ii). M1, M3 and M4 stand as observed at cbea7d4e, unless the run part finds that the correction touched their code or their test's body.

7. **The order.**
   - One form amendment first. It carries items 1 to 3 as class 9, item 2's class 8 and its row for B, item 6's class 2, and the three places of ADV-2026-11-27-28 this ruling replaces.
   - Then one correction commit that holds items 1 to 5 and nothing else.
   - The shell's typecheck and tests, CI's `node --test` and the verify scripts are green at the new head.
   - The PR body takes D3's pairs and names this commit. Those are your words.
   - Each gate reads the correction in its run part. No separate narrow read is owed.
   - E-SCALE stays last at the port.

8. **D2, D3, D4, F7 and F8** are recorded as you have them.

9. **At the merge check** I compare the texts of items 1 to 5 with this file, byte for byte, and everything this ruling does not replace with ADV-2026-11-27-28.

10. Nothing here is reserved. For the human, in the digest: with a bar, the scale's item is an image for a screen reader, named by its title; and the bar's maximum width is declared beside its test, not in the product file.
