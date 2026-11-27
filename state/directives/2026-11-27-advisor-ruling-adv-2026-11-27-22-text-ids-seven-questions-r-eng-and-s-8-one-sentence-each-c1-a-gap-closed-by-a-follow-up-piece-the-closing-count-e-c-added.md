# The advisor's ruling ADV-2026-11-27-22, under the human's delegation of 2026-11-13, not the human's words: text-id's seven questions at fc6d4b00; R-ENG's and S-8's second sentences in the advisor's words, class 9; C1 a gap in the form, closed by a follow-up piece with a full form; §9 item 8 did not fire; the closing count's two ranges; the gates' pairs as filed; E-c's missing cases added

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-22.md in the advisory folder, 11455 bytes, sha256 765b9c1d2f87df945e475e6d3f72a11ca92b7e8c5334c296568a593ca3e49f2f, UTF-8, last modified at 2026-11-27T10:19:59Z by the file system. It was named by a session message received before 2026-11-27T10:20:51Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-22, to the custodian, 2026-11-27 (10:20Z). Text-id at fc6d4b0098a08bc554f7f3ce15a1aa89564925cb: the seven questions from its two build-gate read parts.

Read by me: both reports as filed on main aca0b05f, whole. At the head: `reopenNotices.ts` whole; `admitProject` and `reopenRefusalPlace` in `openProject.ts`; `open_project`, its request literal and `open_error_of` in `kernel/src/project/mod.rs`; `admit_identity` to its scan and `set_aside_outcome` in `engine/src/dataset.rs`; the two identity variants in `engine/src/error.rs`; `AdmissionPanel.tsx` lines 196 to 252; `OpenProjectRequest`; ADR-016's Amendment 3; KNOWN-LIMITATIONS item 3; the piece's own diff of `SKP-V0.md`; K-5, K-6 and the pattern K-6 names; rows AH3 to AH7; the form's §2, §4, §5, §7, §9, §10 and Amendments 9 to 14. Not read: `client.ts`, the callers of `reopenPath`, the declaration form, `publish/mod.rs`.

1. **R-ENG: one sentence changes. The words are mine, on the architect's substance.** The new sentence says what the attempt carried, and no longer what the refusal names. That holds for every `engine.*` code, because it does not depend on the code.

````text
Old: The claims this refusal names are the ones the project file recorded for the data. None was typed here.
New: The open was tried with the claims the project file recorded for the data, if any. None was typed here.
````

   - Each clause, against the code: the kernel's request carries `admission.crs_assertion` and `admission.identity` of the project file, and `set_aside_file_id` as sent; `admitProject` shows R-ENG only when the attempt carried no choice; `OpenProjectRequest` has no member for a claim. "If any" is there because a project file may record neither claim, as on the path of ADV-2026-11-27-12 item 2.
   - The first and third sentences stay. Both gates found them true.
   - It lands in this piece as class 9, as ADV-2026-11-27-12 item 4 has it.

2. **S-8 is corrected with it, in the architect's scope.** The two gates do not disagree: the reviewer names the one case its test drives, and the architect names the rest. By my reading of `set_aside_outcome`, S-6a names a fact of the file beside the choice, so the old clause is untrue there as well.

````text
Old: The claims this refusal names are the ones the project file recorded for the data, and the choice you made here to open it by row position.
New: The open was tried with the claims the project file recorded for the data, if any, and with the choice you made here to open it by row position.
````

   - `admitProject` turns R-ENG into S-8 on the same value it sends as the choice.

3. **Three places that name these words.** Each Old stands once in its file at the head, by my count.
   - `reopenNotices.ts`, R-ENG's doc:

````text
Old: (S-8) instead (`admitProject` in `project/openProject.ts`). */
New: (S-8) instead (`admitProject` in `project/openProject.ts`). Its second sentence is the advisor's from ADV-2026-11-27-22 item 1, in place of the one ADV-2026-11-20-05 item 2 gave: it says what the attempt carried and not what the refusal names, because a refusal can name a fact of the file, as the refusal of the file's own `id` column does. */
````

   - `reopenNotices.ts`, S-8's doc:

````text
Old: ADV-2026-11-24-05 item 2 (b)): beside
New: ADV-2026-11-24-05 item 2 (b); its second sentence is the advisor's from ADV-2026-11-27-22 item 2, in place of the one that ruling gave): beside
````

   - `MANUAL-WALKTHROUGH.md`, row AH7. Row AH6's reopen carries no choice, so its panel shows R-ENG (T-11, by the architect's reading; I did not read the render). A new shown sentence goes before the human's sight:

````text
Old: summary. (S-5,
New: summary. Seen in AH6: the line beside the refusal, whose second sentence is new, "The open was tried with the claims the project file recorded for the data, if any." (S-5,
````

   - The tests hold the constants, so no test text changes. If a check of the repository pins either old text, tell me before the check is changed.
   - `engine/ADMISSION-RESULTS.md` is a record of a past run and stays as it is.

4. **C1 is not a departure from §2 item 12. It is a gap in the form, and it departs from ADR-016 in one case.**
   - The code does what item 12 says: the offer reads the refusal and the run's own options, and at a reopen those hold no declaration (S-T4's options; the architect's reading).
   - What does not hold is §2's sentence that S-6b is reachable only if the file changes between attempts or through another client. Recorded as class 2; the sentence is not edited.
   - ADR-016 Amendment 3, Decision 1, has a client offer the choice only "in an attempt that declared no column". At a reopen whose project file records a declaration of the column `id`, the attempt declared one, and the shell offers the choice all the same. The engine then refuses by name (Decision 2), so nothing opens wrongly and nothing falls back.
   - **No code changes in text-id for it.** The shell cannot tell the two refusals apart: the engine's refusal carries the column, a detail and the candidate list, and no word of where the column came from. A fix needs either a new fact on the wire or another rule for the choice at a reopen, and that is a design, not a correction.
   - **A follow-up piece closes it, with its own form: full form and both gates, because it touches the wire or the ADR.** Its form is drafted now, on text-id's corrected head, by the drafter of this form. It chooses between two ways and says why: the offer is not made at such a reopen; or the choice opens the file without the recorded declaration. The second changes ADR-016 and what a later save records, and comes to me as an OPEN question.
   - **Main does not hold the gap unrecorded.** At text-id's merge check, either that piece is ready to merge directly behind it, or I rule a KNOWN-LIMITATIONS sentence first.

5. **D1: other words than the architect's, and one sentence more at the offer.** Its list in brackets leaves out a re-link to another file, and its last sentence says "the file's own `id` column" where this path is a declared one.
   - `engine/src/error.rs`, the `IdentitySetAsideRefused` doc. The Old is the architect's, from "Two of the three are" to "only beside the refusal." The New, wrapped as that doc's lines are:

````text
Through the shell, the first case is reached at the reopen of a project whose file records a declaration of the column `id`, when the engine refuses that column: the shell offers the choice beside an `engine.identity_unusable` refusal that names `id` in a run whose own options hold no declaration, and the kernel sends the recorded declaration with the choice. The other two are reached through the shell only if the file changes between attempts. All three can be reached through another client.
````

   - The clause on the other two is the architect's, by its check of `reopenRetryOptions`. I did not read every caller.
   - `AdmissionPanel.tsx`, `rowPositionOffer`'s doc:

````text
Old: so a reopen asks again. The one decision site for the
New: so a reopen asks again. At a reopen the recorded claims are the kernel's to send and this function does not see them: a reopen refused for a recorded declaration of the column `id` is offered the choice too, and the engine then refuses the choice beside the declaration the kernel sends with it (`IdentitySetAsideRefused` in `engine/src/error.rs`). The one decision site for the
````

6. **§9 item 8 did not fire, and the missing skeleton is recorded as class 2.** Both readings are right about what they look at.
   - Item 8 blocks on a red that is a compile error. 29 reds were observed, and none was one.
   - §4's "How red is read" and the first half of §5's first prediction were not carried out: no skeleton commit exists, so no red at a skeleton was read. That is a deviation, recorded in the closing amendment. Neither line is edited, and no skeleton is built after the fact.
   - The mutations' reds stand for what item 8 guards. They do not show that a test was written before its code, and nothing of this piece may say so: not the closing amendment, and not the PR body.

7. **The closing count names two ranges and adds them:** 83812fd5..ebf961d3, and fc6d4b00 to the closing head.
   - 83812fd5 is the recorded base §7 names. By my run of §7's command on the first range: 84 files, 2313 insertions and 221 deletions.
   - The merge commit is counted in neither. Its 13 files are the route's. Its one resolved line, the comment under KNOWN-LIMITATIONS item 3, is named in a sentence.

8. **The gates' pairs go into the correction as filed. The report's bytes govern.**
   - **E-b:** the reviewer's pair for K-5's doc. The scan keeps its positive control, so no second mutation is owed.
   - **D-a:** the reviewer's ten doc lines.
   - **D-b:** the reviewer's pair. The closing amendment says that M-24b is a mutation beside T-1 that §4 does not list.
   - **D3,** in `SKP-V0.md`'s skp/0.16 entry. The piece's diff edits §12.1's literal, §12.2 and §12.3:

````text
Old: blocks and §12.2 are brought current in place.
New: blocks, §12.2 and §12.3 are brought current in place.
````

9. **E-c: the missing cases are added. Test code only.**
   - §4 names the pattern of `publish_identity_tier.rs`, and that pattern is R1 in both scopes and R2 through the real boundary in both scopes. K-6 has R1 in one scope. "Nothing of the choice is saved or published" stands in KNOWN-LIMITATIONS by the human's approval, and "plausibly held" is not its evidence.
   - Added, for a dataset opened by the choice: R1 in the second scope, and R2 in both scopes with no destination, no staging folder and no audit record, as K-U1 has them.
   - Where: in K-6's file with the helpers it needs, or as a test beside K-U1 in `kernel/tests/publish_identity_tier.rs`. You take the one with fewer lines. The second is a path outside §7: class 9, after your overlap check on that file.
   - No new mutation is owed: M-15 fails at R1 first, as K-U1's own mutation does.

10. **The corrections.** An amendment comes first. It records items 1 to 3 as class 9, and item 9's path too if it is outside §7; items 4 and 6 as class 2; and items 5, 7 and 8.
    - Then the commits hold items 1, 2, 3, 5, 8 and 9 and nothing else, the words apart from the test code.
    - The architect's E1 is for the run part. No test is added for the owner line on the path of item 1: `reopenRefusalPlace` chooses the line from the code alone, and by both gates T-11 drives that code.
    - The suites that start no app are green at the corrected head before the series.
    - Each gate reads the corrections in its run part. The reviewer runs M-15 again there.
    - The overrun stays class 8. The closing count is item 7's.

11. **The reviewer's three departures** are accepted as it disclosed them, and go into the closing amendment.

12. **Noted, where the gates agree:** nothing outside §2; the merge brings the route's corrections and nothing else; ADV-2026-11-27-19 items 1 and 2 and ADV-2026-11-27-15 item 7's three places hold; ADR-016's block holds; §9 item 10 by your check.

13. Nothing here is reserved. For the human, in the digest: the two new shown sentences, which are the advisor's and come to their sight in row AH7; and item 4, where the piece merges with one case of ADR-016's Decision 1 open and a piece behind it to close it.
