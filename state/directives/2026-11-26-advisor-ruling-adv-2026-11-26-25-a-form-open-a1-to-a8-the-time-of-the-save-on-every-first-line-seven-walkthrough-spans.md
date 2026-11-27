# The advisor's ruling ADV-2026-11-26-25, under the human's delegation of 2026-11-13, not the human's words: A's form, OPEN-A1 to OPEN-A8: (a) the time of the save with (ii) on every save's first line, its four strings; OPEN-A2 (a) out; seven walkthrough spans; OPEN-A4 (i); OPEN-A5 neither; OPEN-A6 (a) out with a finding for milestone 5's second part; OPEN-A7 (b); OPEN-A8 as proposed; the runs under ADV-2026-11-26-24 item 5; the ceiling; the merge check

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-26-25.md in the advisory folder, 5722 bytes, sha256 42d60457a97390ec2d32b3eb236465b31637279befdf65b525ad6e786d77c608, UTF-8. It was named by a session message received before 2026-11-26T21:09:57Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-26-25, to the custodian, 2026-11-26 (21:08Z). A's form draft (`state/drafts/a-second-save-is-announced-form-architect.draft.md`, on main at 1b044372, read by me whole): its OPEN-A1 to OPEN-A8. Read by me as well: `frontends/shell/src/project/saveProject.ts` at PR A's head 806ad308, its strings and its `save`; and the rows AD1 (main), AE2 and AF3a (PR A's head) of the walkthrough. Every string and every walkthrough word below is the advisor's, not the human's.

1. **OPEN-A1: (a), the time of the save, and (ii), on the first line of every save's batch.**
   - The time is the machine's local time, read once when the saver has that save's outcome. It is written as hours, minutes and seconds on the 24-hour clock, two digits each, with colons: `HH:MM:SS`. No locale form.
   - The four first lines, where `{time}` is that time and `{message}` is the kernel's or the picker's message as today:

````text
The project was saved. ({time})
The project was not saved: {message} ({time})
The project was not saved. ({time})
The folder already holds a project. ({time})
````

   - They are S3, S4, S23 and S7, in that order. No other string of the saver changes.
   - **Why the time and not a count:** a user can check it against the clock, and it answers when the project was last saved. A count of saves in this open means nothing to them.
   - **Why every first line:** a second refused save that shows the same line again is the same fault on the other path.
   - **The bounds, accepted:** two saves whose outcomes fall in one clock second show the same text, in new elements; a clock that is set back can show an earlier time. The line says when the shell had the outcome, not when the file was written.
   - (b) and (c) are not taken.

2. **OPEN-A2: (a), out.** A click while a save is in flight still changes nothing. `App.tsx` is not changed, and PR 366 does not join.

3. **OPEN-A3: the walkthrough's words.** Seven spans change; each Old text stands once in its row.
   - **AD1**, four spans:

````text
Old: a line in the strip above the map reads `The project was saved.` When
New: a line in the strip above the map begins `The project was saved.` and ends with the time of that save in brackets, by this machine's clock. When
````

````text
Old: followed by the kernel's message; record the message.
New: followed by the kernel's message and the time in brackets; record the message.
````

````text
Old: The second click opens no picker, shows the saved line again, and leaves the folder holding only `project.spatial`.
New: The second click opens no picker and shows the saved line anew, ending with the time of the second save, and leaves the folder holding only `project.spatial`. Record the two times as the lines showed them.
````

````text
Old: is it clear what each line means?
New: is it clear what each line means, and is it clear from the screen that the second save happened?
````

   - **AE2**, one span:

````text
Old: the strip shows `The project was saved.` The last open
New: the strip shows the saved line, which begins `The project was saved.` and ends with the time of the save in brackets. The last open
````

   - **AF3a**, two spans:

````text
Old: After the save the strip shows `The project was saved.` and no `more in Problems` button
New: After the save the strip shows the saved line, which begins `The project was saved.` and ends with the time of the save in brackets, and no `more in Problems` button
````

````text
Old: and then the line `The project was saved.`, with no Dismiss button.
New: and then the saved line, with no Dismiss button.
````

   - AD1 does not ask the human to listen with Narrator. The form claims no announcement, and the row is long enough.
   - No Result log line is edited.

4. **OPEN-A4: (i).** The key is on both roots, for every route. One rule in one renderer.

5. **OPEN-A5: neither.** No KNOWN-LIMITATIONS item, and no words in AD1 beyond "by this machine's clock". The bounds of item 1 are recorded in the form's §1 and in the saver's doc comment.

6. **OPEN-A6: (a), out.** The order of notices and `conditions.ts` stay as milestone 5 rules them.
   - It leaves a state that ordinary use reaches: while an older notice holds the strip's top, a save's line shows only in Problems.
   - Record it as a finding for milestone 5's second part. When that part's form comes, two things come to me with it: whether a newer notice of the same urgency should take the strip's top, and whether its KNOWN-LIMITATIONS words cover a save's line under an older notice.

7. **OPEN-A7: (b).** M-A1 is unit-only for E-A1. E-A1's red at T is the proof that its check can fail.

8. **OPEN-A8: as proposed.** A head of PR A or PR 365 that moves before A's runs is merged in by a merge commit, with a narrow read, and recorded by amendment.

9. **The runs, under ADV-2026-11-26-24 item 5.** Commit T is the red commit. Once PR A's reviewer has passed its second attempt, A's code and its vitest runs may go ahead inside holds, in A's turn, though the port is still held. E-A1's run at T is made when the port is free, and the five conditions of ADV-2026-11-26-24 item 2 hold. §9a's first bullet under Runs follows.

10. **The ceiling** of 250 lines over 7 files stands for item 1's choice, by the form's own estimates. If the author's count with (ii) passes it, it is restated before the form is committed.

11. **The strings carry no placeholder mark** once this ruling is filed. The human sees them at AD1 in a later sitting; I list them in the digest now.

12. **The merge check** compares item 1's four lines and item 3's seven New texts with the diff byte for byte.

13. Nothing here is reserved.
