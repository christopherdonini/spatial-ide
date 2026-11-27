# The advisor's ruling ADV-2026-11-27-25, under the human's delegation of 2026-11-13, not the human's words: shell-scale-display's red test U4 is met by way (a), structural types inside src/layout/ as WatcherFacts has them; a post-result amendment, then one correction commit, the suites, the draft PR and the gates' read parts; the four places of Amendment 11 item 5

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-25.md in the advisory folder, 4379 bytes, sha256 8a896b32af32d627a754601990c5fd12802ddd274acf983ad3949c7ee9c45a00, UTF-8, last modified at 2026-11-27T12:40:11Z by the file system. It was named by a session message received before 2026-11-27T12:40:48Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-25, to the custodian, 2026-11-27 (12:40Z). `shell-scale-display` at its head 9f8b67cd: the red test U4, and the four places of Amendment 11 item 5.

Read by me: at 9f8b67cd, `layoutBoundary.test.ts` and `scaleBar.ts` whole, every import line under `src/layout/`, the first forty lines of `statusItems.ts`, the unit type in `skp/types.ts`; the piece's diff over 530d7b0e in `regionParts.tsx`, `App.tsx`, `WorkingCanvas.tsx`, `contributions.ts`, `StudioLayout.test.tsx`, KNOWN-LIMITATIONS, the walkthrough and the e2e README. On main at 27ca47cd: the form's §2, §3, §8, §9, its OPEN questions and Amendment 11; the worker's report whole; milestone 1's §2.3 (a) and its U4 row; ADV-2026-11-23-19. Not read: `scaleBar.test.ts` beyond its import line, `App.scale.test.tsx`, `layout.mjs`, `styles.css`, the form's Amendments 2 to 7.

1. **U4: way (a).** The two layout files take the unit and the box by types that need no import from `skp/` or `canvas/`, and App passes the values.
   - It is how the layout already does it. `WatcherFacts` in `layout/statusItems.ts` is "written as structural types so no file under `layout/` imports from `skp/` (§2.3 (a))".
   - Not (b): it uses the gap the test's header admits.
   - Not (c): it would change a merged piece's test so that this piece passes, and by `WatcherFacts` the boundary was read to cover types as well.
   - Not (d): §2 item 2 puts the item with the status items that compute, and nothing asks for a move.

2. **What is restated. The filed lines of §2 are not edited.**
   - §2 item 1: `scaleReading`'s first parameter is the unit as a `string`, to which a `CrsUnit` is assignable. It returns `not-metre` for every value but `"metre"`, as now.
   - §2 item 2: `ScaleItem`'s `unit` is that `string`. `getBox` returns a value that the item only compares with `null`, typed without `AuthoritativeBbox`. The worker picks the type; the value App passes is assignable to it with no cast.
   - §2 item 3 stands as written: App passes `admitted.describe.crs.unit` and `viewBox.get`.
   - §9's seam line for `CrsUnit` stands. The seam is App's slot, and the typecheck proves the assignment.
   - At each of the two places a doc sentence says why the type is written so and names U4. Its words are the worker's, read by the gates.
   - `scaleBar.test.ts` may keep its type import. U4 does not read test files, and by its import line that file names the wire's type.

3. **Class and record.** A post-result amendment (class 1), whose first line says that it is made after the red was seen. It records:
   - the red by its name, at the head;
   - the three imports;
   - that the form names no import and does not name U4, and that neither its gates, the narrow read at the base nor my ADV-2026-11-27-21 item 4 read §2 against that test;
   - that the worker's light run did not hold U4, because the heavy runs were held at the disk floor, which was right.

4. **The order.**
   - The amendment.
   - Then one correction commit: the three import lines, the two types and the two doc sentences, and nothing else.
   - Then the typecheck, the shell's tests and CI's `node --test`, green at the new head.
   - Then the draft PR, naming its bases.
   - Then the gates' read parts. They read the correction with the rest. No separate narrow read is owed, because no gate has read this head.

5. **The four places.**
   - **(i) The mark is right.** The strings and item 80 are built under the placeholder mark until I word them (ADV-2026-11-23-19 item 6). §3's table gives the label's words, and the mark is not part of them. No deviation is recorded.
   - **(ii) and (iii) go with my wording.** I owe it now: S-1 to S-4, item 80, Part AI and the README entry, from the text at the head. It comes as its own ruling, next. The correction commit and the draft PR do not wait for it. The words commit does, and until then none of those words changes.
   - **(iv) stands as the form has it.** The tester's record of `devicePixelRatio` decides at the run part. Any value but 1 comes to me.

6. **Seen in the worker's report, for the gates:** its §8 item 9, `SCALE_BAR_MAX_PX` with no product caller. The architect's read part says whether item 9 blocks on it. If the way out changes one of §7's constants or a claim, it comes to me.

7. Nothing here is reserved.
