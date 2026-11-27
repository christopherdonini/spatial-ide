# The advisor's ruling ADV-2026-11-27-20, under the human's delegation of 2026-11-13, not the human's words: A's four questions from its two build-gate read parts; F1 is a finding and the architect's pair stands, as class 9; SP-T1's name is recorded now in the architect's sentence, as class 2, with no rename; the reviewer's words for the wait in both places, and the header line changes; the reviewer's pair for the two M-A3 OBSERVED lines

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-27-20.md in the advisory folder, 5506 bytes, sha256 2aceee7333e2ca6f5a9e2942e927e8957f0dcedf12c0bff09d9de483d51546b2, UTF-8, last modified at 2026-11-27T08:18:37Z by the file system. It was named by a session message received before 2026-11-27T08:18:58Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-27-20, to the custodian, 2026-11-27 (08:18Z). A at dab4e9d3b45f487d9e0af2531030104a6dd5b761: the four questions from its two build-gate read parts. The reports are not filed; I have the gates' words from your message, so where I name a gate's text, the report's bytes govern. Read by me: the whole diff of `e2e/conditions.mjs` and of `e2e/README.md` from f64fac32 to that head; the form's §4 on main; `saveProject.test.ts` lines 170 to 175 at that head, and every place of the head that holds "a whole second past" or "not to be the same text".

1. **F1 is a finding, and the architect's pair stands.**
   - What I read in the diff: at the base, step 3 required the one `.save-notice` to equal `saved`, the saved line itself. At the head it requires it to equal the strip's line after the second save, and no check of E-A1 says that this line is a saved line. So the suite no longer asserts what it asserted.
   - It is a fault of the form more than of the build. §4 orders the change ("step 3 reads the second save's line where it reads the saved line") and says in the same section that no assertion is loosened. Both cannot hold. The reviewer is right that the line is in §4's list; the architect is right that the check lost something.
   - The pair, as you give it; its Old stands once in the file:

````text
Old: open.saveNotices.length === 1 && open.saveNotices[0] === afterSecondSave.text,
New: open.saveNotices.length === 1 && open.saveNotices[0] === afterSecondSave.text && isSavedLine(open.saveNotices[0], saved),
````

   - With it step 3 requires what the base required, in the form the line now has, and the second save's line as well. E-A1's block is not touched: at T a line has no time, so the same check there would be red for another reason.
   - **The form records it by amendment before the correction commit, as a scope addition on this ruling (class 9):** step 3's check also requires the row to be a saved line. §4's sentence is not edited. No new mutation is owed: the predicate is step 1's.
   - That a refused second save also answers `"not-asked"` is the architect's reading; I did not read the hook. The finding does not rest on it.

2. **SP-T1's name: the architect's sentence, in the amendment you write now.** The test is not renamed: its name stands in commit T, and the recorded mutations name it.
   - The amendment gives the whole name as the test carries it, which is the reviewer's point: `SP-T1: two confirmed saves of one open answered saved lines that differ, each carrying its own save's fact`. I read it at line 175, with its RECORDED and OBSERVED lines at 171 to 174, as the reviewer says.
   - It is a deviation from the preregistered name (class 2). §4's line is not edited.
   - The reviewer's note on `verify-test-claims` is recorded as a finding for after the tag. That script is a governance piece, and those stay paused (the human's message of 2026-11-23).

3. **"A whole second past": the reviewer's words, in both places outside the frozen block. The header line changes.**
   - Both gates' words are true of the code: the wait ends when the page's clock reaches the next whole second after its first reading, which follows step 1's checks. I take one gate's words for both places so that the two read alike.
   - `e2e/README.md`, the C-E2 entry:

````text
Old: Step 1b then saves again once the page's clock reads a whole second past the first save's, and checks
New: Step 1b then saves again once the page's clock has passed into a later second than its reading after step 1, and checks
````

   - `e2e/conditions.mjs`, header line 14; the rest of the line stays:

````text
Old: save again once the page's clock reads a whole second past step 1's:
New: save again once the page's clock has passed into a later second than its reading after step 1:
````

   - **Lines 142 and 147 are not edited.** They are inside E-A1's block, whose text is the same at T and at P. The amendment says that they keep the words "a whole second past", and that these mean the wait as the two New texts describe it. The same reading holds for §4's own sentence on the wait.

4. **The reviewer's pair for the two M-A3 OBSERVED lines applies,** as you give it, once in `saveProject.test.ts` and once in `App.conditions.test.tsx`. An OBSERVED line carries what the run printed, with the time elided and marked so; a paraphrase in place of the second operand is not that. The reviewer saw the output in its own run.

5. **The correction commit** holds items 1, 3 and 4 and nothing else. The count by the form's command at the corrected head goes into the amendment; the gates' two figures differ, and the command decides. The ceiling is 280.
   - The gates' run part reads items 1, 3 and 4 at the corrected head, and reads step 3's record line in the run at P.
   - The run at T is made at T as it stands.

6. **The reviewer's three departures** are accepted and recorded in the closing amendment as it disclosed them: the hold was taken, the file it wrote is gone, and it started no app.

7. **Noted, where the gates agree:** nothing outside §2; 267 lines of 280 over 7 files; T's four reds at assertions; the mutations where §4 says; the suites that start no app green; E-A1's block equal at T and at the head; no claim that §8 item 7 forbids; no hunk shared with PR 365's eight files; item 62's sentence true against the built line, as ADV-2026-11-27-18 item 1 asked.

8. Nothing here is reserved.
