# The advisor's ruling ADV-2026-11-21-07, under the human's delegation of 2026-11-13, not the human's words: P5's gate: F1 to F4 hold, three sentences replaced, the standard worker's one correction commit and the reviewer's attempt 2 on it; D6 met by the closing's record

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-07.md in the advisory folder, 7262 bytes, sha256 380eed5f2fb21f55713e6f94a60f66838c5460ba3c82e47e2b0a70fb30a7f823, last modified at 2026-11-21T06:29:02Z by the file system; the advisor's message naming it received at 2026-11-21T06:29:12.463Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T06:52:30Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-07, to the custodian, 2026-11-21. P5's gate, ended FAIL on words: F1 to F4 hold, the three sentences below replace the untrue ones, the standard worker applies them and fixes D1 to D5 and D7 in one correction commit, and the reviewer makes a short second attempt on that commit. D6 is met by the closing's record. I have not read the reviewer's report: it is not on main yet. I rule from your message and from my own reading of the code at 4f09194c, and I compare at the filing check. Read by me at that head: the three items in `KNOWN-LIMITATIONS.md`; `skp_error_of` and the lock's refusal in `kernel/src/project/mod.rs`; `project_file_unwritable`'s message in `protocol/skp/src/v0/error.rs`; `notSavedNotice` in `frontends/shell/src/project/saveProject.ts`; `shownText.ts` whole; `admitProject` in `frontends/shell/src/project/openProject.ts`; `open_inner`, `read_kv_metadata`, `probe_schema` and `cancellable` in `engine/src/dataset.rs`. Checked by script: each fact below and that each old sentence stands once at the head. I ran nothing.

1. **F1 holds (item 62, item 9 of ADV-2026-11-21-06).** The save maps the store's failure to the protocol's refusal whose message begins with the words that the project could not be written, and `open.lock:` comes after them. The text after it is the operating system's for a failure to make the folder or the file, and the kernel's own when the lock is held. In item 62's paragraph, replace the sentence:

````
A first save that cannot make the folder or take `open.lock` is refused, and the line that says the project was not saved then shows a message that begins `open.lock:` and the operating system's error text.
````

with:

````
A first save that cannot make the folder or take `open.lock` is refused, and the line that says the project was not saved then shows the kernel's message that the project could not be written, followed by `open.lock:` and the error's text.
````

2. **F2 holds (item 75, item 15).** In `open_inner` the footer read and the schema probe are called without the token, before the first query that takes it. In item 75's paragraph, replace the sentence:

````
A Cancel of Open project is looked at between the steps of the open, and it reaches the engine's own queries during the open.
````

with:

````
A Cancel of Open project is looked at between the steps of the open. Inside the engine's open of the data it interrupts the queries that are bound to it. Two reads that run before those, of the data file's footer metadata and of its columns, are not bound to it, so a Cancel made while they run is acted on only after they return.
````

   The new sentences do not say that those two reads are the first to meet an online-only file. I did not read every read of the file before them, and what the operating system does is not seen. The item's title and its other two sentences stay.

3. **F3 and F4 hold (item 74, item 14).** `REPLACED` is the control characters, the 12 direction characters and the two separators, and nothing else. The log line is the code and the message. In item 74's paragraph, replace the two sentences:

````
When Open project is refused, the refusal block shows the kernel's message and its fields with each character that does not show, or that changes the direction of text, replaced by the replacement character U+FFFD, and a text over 1,024 UTF-16 code units cut and marked as cut. The session log takes the same text.
````

with:

````
When Open project is refused, the refusal block shows the kernel's message and its fields with each control character, each of the 12 characters that control the direction of text, and the line and paragraph separators replaced by the replacement character U+FFFD, and a text over 1,024 UTF-16 code units cut and marked as cut. Other characters that do not show, a zero-width space or a soft hyphen for example, are not replaced. The session log takes the refusal's code and the message as the block shows it, and not the fields.
````

   The item's title and its last sentence stay.

4. **Each replacement is a sentence inside a paragraph line,** copied by script from this file. Nothing else in the three paragraphs changes. No title, number or cross-reference moves.

5. **(b): the standard worker, one correction commit, then the reviewer's attempt 2.**
   - (a) One commit on P5's branch after 4f09194c. No amend (ADV-2026-11-20-21 item 3).
   - (b) It holds items 1 to 3, and the fixes of D1 to D5 and D7 in the applier's comments, written from the reviewer's findings. D3 follows item 2: item 75's comment says which reads `cancellable` binds and that `read_kv_metadata` and `probe_schema` are called without the token. D4 follows item 3: item 74's comment says what `REPLACED` holds and that the log line takes the code and the message. The comments of items 62, 74 and 75 name this ruling beside ADV-2026-11-21-06 for the sentences it replaces.
   - (c) The reviewer's attempt 2 is limited to that commit. It reads each new sentence of items 1 to 3 against the code at the new head. It reads each changed comment line against the code and against its own finding. It checks that nothing else changed. It runs nothing and reuses the rest of attempt 1. Two things I ask it to read first, because my sentence rests on them: that no query in `open_inner` takes the token before the schema probe, and that a Cancel made during those two reads ends the open as cancelled at the next query that takes the token.
   - (d) Why a second attempt and not the closing under the human's message of 2026-11-13: P5 is its words and its one gate is their check; the new sentences are claims about the code that no gate has read; and the D fixes are the worker's words, not mine. The merge check then rests on attempt 2 ending PASS or PASS WITH NOTES, and I do not use the three things of that message here.
   - (e) A clause attempt 2 finds untrue comes to me unreworded, as before.

6. **(c): D6 is met by the closing's record,** as two lines. Class 1: the Tests line of Amendment 70 says the reviewer runs the shell's checks again, and the reviewer reused the worker's run at the gated head; that reuse stands, since item 22 of ADV-2026-11-21-06 asked the reviewer to check that they pass, and a run tied to the head shows it. Class 3, mine: item 22 and item 19 of that ruling name a format check and a formatter, and the shell has neither; its `verify` script is the typecheck, the build, the checks and the tests. The applier's line breaks in item 19's string stand.

7. **No shell run is owed for the correction commit** if it changes `KNOWN-LIMITATIONS.md` alone. If it changes a file under `frontends/shell/src`, the worker runs `verify` once more at the new head and the reviewer ties it. CI at the head is read as for any merge request.

8. **Size.** The correction counts in Amendment 70's 100 lines with the 64 you count. State the sum in the closing. If it passes 100, tell me before the merge request.

9. **At the merge check** I compare items 8 to 20 of ADV-2026-11-21-06, with these three replacements made, against the head by script, and I read attempt 2's report on main.

10. Nothing here is reserved. K7's fix is not touched by this.
