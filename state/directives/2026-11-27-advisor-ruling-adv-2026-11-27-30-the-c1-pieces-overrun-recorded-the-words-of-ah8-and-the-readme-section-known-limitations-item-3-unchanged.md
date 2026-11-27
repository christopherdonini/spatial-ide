# The advisor's ruling ADV-2026-11-27-30, under the human's delegation of 2026-11-13, not the human's words: the C1 piece's overrun recorded as class 8; the words of row AH8 and the e2e README section; KNOWN-LIMITATIONS item 3 unchanged; a form amendment, then one words commit

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-30.md in the advisory folder, 13355 bytes, sha256 c50cd67bfaf66e19ae7af1a1e56302fd298f253ccd5fd9a3a083e13b9fca2a8b, UTF-8, last modified at 2026-11-27T17:11:49Z by the file system. It was named by a session message received before 2026-11-27T17:12:08Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-30, to the custodian, 2026-11-27 (17:10Z). The C1 piece, `text-id-reopen-with-a-recorded-declaration`, built at 1a4b5bbe2d77352925238fd934c453cf9e0d0348 on text-id's head 2df8b4ae (PR 369, draft): the overrun, the words of Amendment 1 item 5, and KNOWN-LIMITATIONS item 3.

Read by me: the build report and the form's Amendment 4 as filed on main at f42b84f6, whole; the form's §0 to §10 and the heads of Amendments 1 to 3. At 1a4b5bbe: the step `TEXTID-C1` whole and the suite's step order; `rowPositionOffer` with its doc and the panel's render of a refused state; `RefusalBlock.tsx`; the three owner lines in `reopenNotices.ts`; the two kernel tests; `admit_identity` to its type check; the piece's diff of `engine/src/error.rs`, `kernel/src/skp.rs` and `SKP-V0.md`; in `kernel/src/project/mod.rs` the doc of `open_project`, the request it builds and `open_error_of`; the strict reader's byte check; the renderer's line-oriented writer; Part AH and its result log; the e2e README's two sections above the new one; KNOWN-LIMITATIONS item 3 with its comment; ADR-016 Amendment 3. Not read: the other tests, the fixtures, the four shell test files §7 does not name (`RefusalBlock.test.tsx`, `admitDataset.test.ts`, `client.test.ts`, `saveProject.test.ts`), `engine/tests/identity.rs`, the logs, and the two form gate reports beyond the lines that name P2.

1. **The overrun is recorded as class 8, and the piece goes on.** It is not a stop.
   - My count agrees with the report's: 775 added and 128 removed, 903 against 900, over 37 files.
   - No line is cut to meet the ceiling. A cut made for the count alone would take out comment or test lines that the gates ought to read.
   - Amendment 4 item 3 records the figure at 1a4b5bbe. The final figure is taken after the words commit of item 5 below, by §7's own command at that head. The amendment that records it carries the template's words `budget overrun, §7 not edited`, §7's estimate table with the count beside each row, and the reason in a sentence the gates can check.
   - §7 is not edited.
   - Both gates' read parts say in so many words whether every changed file is inside §7's scope as its "each" lines resolve at the base, and whether every change is inside §2 and §4 as gated. A file or an item outside them is not class 8. It comes to me before anything else.

2. **The walkthrough row AH8 and its result-log line, in my words.** The worker's draft is their base. The row goes directly after row AH7, and the line directly after the result log's AH7 line.

````text
| AH8 | This row is the Operator row of `governance/forms/frontends/TEXT-ID-REOPEN-WITH-A-RECORDED-DECLARATION-PREREGISTRATION.md` §10, run only on a build with that piece merged. Read that form's amendments, the last one first. Close the app. In the folder of AH5, open `project.spatial` in a text editor that keeps the file's line endings, and find the one line that reads `"identity": null`. Replace it with three lines: `"identity": {` at the same indent; `"column": "id"` two spaces deeper; and `}` at the first indent, followed by a comma only if the line you replaced ended with one. Use spaces and no tabs, and leave the rest of the file as it is, its last line feed included. Save, start the app, and open the project from that folder (Part AD's steps). Read the panel and click nothing. Then look at `project.spatial` in the editor again. | The reopen is refused with code `engine.identity_unusable`. Among the refusal's field rows, `column` reads `id` and `identity_source` reads `mapped:id`. The line beside the refusal reads "The project was not opened in this window. The open was tried with the claims the project file recorded for the data, if any. None was typed here." Under the refusal the button of AH1 does not show, and no form shows. `project.spatial` still holds the three lines as you typed them. If the reopen is refused with code `skp.project_file_refused` instead, the edit does not match the file's layout: record the refusal's `rule` row, correct the edit and open again. **Felt:** does what is shown tell you why this reopen is not offered the choice that AH6's was, and what you could do next? |
````

````text
- **AH8 (the number of the last amendment you read; the refusal's code; the `column` and `identity_source` rows; the line beside the refusal; whether a button or a form showed under it; whether `project.spatial` still held your three lines; felt):**
````

   - What I changed from the draft, and why:
     - The row names its own form. Part AH's lead-in and its AH0 name text-id's form, and this row belongs to another piece.
     - The edit is given as the writer lays it out, and the row says what the operator sees if the bytes are off. The reader refuses a project file whose bytes are not the writer's layout, and no earlier row of the walkthrough edits a project file.
     - "No form shows" in place of "no declaration form shows". A reopen's refusal opens no form of either kind.
     - The last sentence is a Felt question. This row is the human's first sight of the `identity_source` row beside a refusal with no way out.
   - Each clause, against the code:
     - the writer puts a member's value object on three lines, the inner member two spaces deeper, and a comma after the closing brace when another member follows;
     - a project file whose bytes differ from that layout is refused as `skp.project_file_refused`, with the fields `path` and `rule`;
     - the kernel sends the recorded identity with the reopen, and the engine hands the declared source to its type check; K-R1 (i) asserts `mapped:id` for a recorded declaration of `id` over a text `id`;
     - R-ENG stands beside every `engine.*` refusal at a reopen that carries no choice;
     - the choice is offered only beside `file:id`, a reopen's refusal opens no form, and the re-link button shows only beside the locator's line;
     - a refused reopen of a folder the machine knows writes nothing to `project.spatial`.
   - **The row's expected outcome rests on E-R1's step (5), which has not run.** If the tester's run at the port shows anything else for the copy's reopen, the row comes back to me before the run part's verdict.
   - Part AH's heading, lead-in, Before line and rows AH0 to AH7 are not changed.

3. **The e2e README's section, corrected by me.** Appended at the file's end, after one blank line.

`````text
## Recorded-declaration spec (text-id-reopen-with-a-recorded-declaration)

```
npm run e2e:admission
```

<!-- Drafted by the build worker of text-id-reopen-with-a-recorded-declaration and corrected by the advisor (ADV-2026-11-27-30 item 3); not the human's words. The step was not run by the build that added it: the run is the tester's. -->

`e2e/admission-remediation.mjs` gains the step `TEXTID-C1` (E-R1), after `TEXTID'` and before `DUPKEY'`. Its opens and its save go through the suite's hooks (`openPath`, `e2eSaveProjectToFolder`, `e2eOpenProjectFolder`), and the refusals' codes are the hooks' answers; each choice is a click on the page's own button, and the field rows and the owner line are read from the page's own refusal block. (1) `text-id-no-integer-refused.parquet` is refused as `engine.identity_unusable`, the choice is clicked, and the open is saved to a scratch folder. (2) That folder is copied, and in the copy's `project.spatial` the one line `"identity": null` is replaced by the three lines that record `{"column": "id"}`, in the layout the project file's writer gives them; the reader refuses a file whose bytes are not that layout. (3) The control: the reopen of the first folder is refused as `engine.identity_unusable` with a field row `identity_source` reading `file:id` and the choice offered, and a click on the choice opens it with the choice's line. (4) `no-id-column.parquet` is opened to replace the project in the window, and the first folder is removed, so that step (5) reaches the engine: a reopen of a project that another open holds is refused as `skp.project_open_elsewhere`, and the kernel asks about a folder while the project's first folder still holds the project. (5) The copy is opened through `e2eOpenProjectFolder`, which must answer `engine.identity_unusable` at its first call; an answer of `question` or `skp.project_open_elsewhere` fails the step by name. The refusal block must show the field row `column` reading `id`, the field row `identity_source` reading `mapped:id` and the owner line R-ENG, and the page must hold no button of the choice.

It exits as the suite does: 0 when every step passes, 1 when one fails. It is operator-run and not in CI or in `npm run verify`.

**What it proves not.** The words of R-ENG (the step compares the line with a copy of it), any timing, macOS or Linux, the native folder picker or a project file edited in place (row AH8 of the operator's Part AH), a project that a save wrote with a declaration of `id` (the kernel test K-R1 does that), that no form shows beside the refusal, or a recorded declaration of a column other than `id`. The unrun step is not an observation: M-RD8, `rowPositionOffer` without its check of `identity_source`, is the step's own mutation and was not observed by the build.
`````

   - What I changed from the draft, and why:
     - "It drives the real DOM" is too wide. The opens, the save and the refusals' codes go through the hooks.
     - Step (4) gave one reason for two acts. Each act has its own.
     - The last paragraph said the mutation "is not observed", which stops being true at the tester's run. It now says what the build did, as the section above it does.
     - Three things the step does not prove are added: the edit in place, a project a real save wrote, and the absence of a form.
   - Each clause was read against the step's body at 1a4b5bbe, lines 654 to 750, and the order at lines 1145 to 1148. The two refusals of step (4) are as SKP-V0 §12.4 and the doc of `open_project` give them. That another open replaces the project in the window I take from the step's own docblock and the reviewer's form gate, not from my own read of `App.tsx`. The reviewer's read part reads it.

4. **KNOWN-LIMITATIONS item 3 does not change.** ADV-2026-11-27-24 item 1 stands.
   - Item 3's first sentence names two things: the file's own `id` column, and a column you declare a mapping from. "A file whose `id` column cannot serve is still refused, and the app then offers a second choice" speaks of the first. After this piece the app offers the choice in exactly that case, which is ADR-016 Amendment 3 Decision 1.
   - "Opening the file or the project again refuses the column and asks again" speaks of a project saved after the choice. Such a project records `"identity": null`, its reopen sends no declaration, the refusal reads `file:id`, and the choice is offered again. K-R1 (ii) asserts that refusal in the kernel. E-R1's step (3) is written to hold the refusal and the offer through the app, and has not run.
   - A reopen whose project file records a declared mapping from `id` is the second thing. The paragraph says nothing of a recorded mapping that a reopen refuses, for `id` or for any other column, and this piece makes none of its sentences untrue.
   - The human's sentences in that paragraph are not edited, and no sentence is added to it by this piece. `KNOWN-LIMITATIONS.md` stays outside the piece.
   - If a gate reads either sentence otherwise, it comes to me, as before.
   - Rows AH1, AH4 and AH6 and the README's entry for E-1 (d) stay true, as the report says. I found no clause of the walkthrough, the README or KNOWN-LIMITATIONS that lists the fields of this refusal.

5. **The order.**
   - One words commit holds items 2 and 3 and nothing else: two files, `frontends/shell/MANUAL-WALKTHROUGH.md` and `frontends/shell/e2e/README.md`. Both are in §7's scope.
   - A form amendment first. It carries this ruling by reference and item 1's record.
   - If the read parts are not yet dispatched, they read the piece at the words commit's head. If they are, each gate reads the words commit in its run part. No separate narrow read is owed.
   - The suites that start no app are green at the new head.

6. **One thing for the next amendment, from my read of the step.** `TEXTID-C1` makes its own save in step (1) and copies that folder. It does not copy the project that `TEXTID'` (d) saved. If the form as amended still says P2 is a copy of E-1 (d)'s saved project, the amendment records the step's own save as class 2, and the gates' read parts read it.

7. **A question for your daily batch, not for this piece.** By three searches of KNOWN-LIMITATIONS, not by reading it whole, I found no sentence that says this: a reopen that the engine refuses for a claim the project file records offers no form to change that claim. By the panel's code at this head that holds for every recorded claim, and this piece does not cause it. I did not read main for it. Name the item that says it, if one does. If none does, I word one, outside this piece.

8. **At the merge check** I compare row AH8, its result-log line and the README's section with this file, byte for byte.

9. Nothing here is reserved. For the human, in the digest: limitation 3 keeps their sentences unchanged; the piece is three lines over its declared size, recorded.
