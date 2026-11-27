Reviewed: the branch cut/a-second-save-is-announced at dab4e9d3b45f487d9e0af2531030104a6dd5b761 in the read checkout D:/wt/read-1126c, with the form and the rulings at main a0aaa767a035548fb9a1007796ec765c544e6365 in D:/wt/read-1127c, read only. This is the custodian's filing note, 2026-11-27: the architect's build gate, THE READ PART (the form's Amendment 6; ADV-2026-11-27-18 item 2), node:a-second-save-is-announced@build-gate-architect-read-part; its run, from its completion notice only (ADV-2026-11-26-02), 19 tool uses. A read part gives no verdict and takes no gate-log row. Below the rule, the report as handed back (saved by Write with the harness's indent removed; 10825 bytes, sha256 199c2188cd3717f91656d38cf43e05b20ad88c9eb7f651bb18986194814d4a25), byte for byte. Its findings F1, D1 and D2 go to the advisor with the reviewer's read part, before any correction.

---

READ PART, no verdict: cut/a-second-save-is-announced @ dab4e9d3b45f487d9e0af2531030104a6dd5b761 (code, read in D:/wt/read-1126c); main @ a0aaa767a035548fb9a1007796ec765c544e6365 (form, rulings and docs, read in D:/wt/read-1127c)

Under ADV-2026-11-27-18 item 2 and the form's Amendment 6, the verdict waits for the run part. I read Amendment 6 first and then the form whole. I also read ADR-018, ADV-2026-11-26-25, ADV-2026-11-27-18, the worker's report, the diff f64fac32...dab4e9d3 (all 592 lines) and these files at the head: conditions.mjs, ConditionView.tsx, the top of saveProject.ts, the end of App.save.test.tsx, the save hook in App.tsx, and the render helpers in ConditionView.test.tsx. I ran nothing. Every line number below is a line of the tree at dab4e9d3, given in words because that commit is not on main.

## Findings to correct before the run at P

**F1. Evidence. The correction changes code: one test line, outside E-A1's frozen block.** Step 3's saved-line assertion is weaker than it was (§8 item 8).
- What changed: at the base, step 3's check "each .save-notice is once in the DOM" required the Problems row to be exactly `saved`, the saved notice. At the head (`frontends/shell/e2e/conditions.mjs` line 188) it only requires the row to equal `afterSecondSave.text`, which nothing checks is a saved line.
- Why that matters: the save hook answers "not-asked" whenever the picker was not asked (`App.tsx` line 1488). A refused second save therefore also answers "not-asked", and so does a save whose first line is S4.
- The consequence: at P, a second save the kernel refused would pass E-A1's three checks (its line still differs from the first) and step 3. No check in C-E2 would then show that the second save was saved.
- Why it is outside §4: §4 changes line 153 (at the base) "to the ruled line at its set clock", with "No assertion is removed or loosened". The new check drops the saved-line half.
- The run at T is not affected: it runs T's text, where line 188 still reads `=== saved`.
- The count stays 267: the line is already counted as changed.
- Exact pair, which occurs once in `frontends/shell/e2e/conditions.mjs`:
  - Old: `open.saveNotices.length === 1 && open.saveNotices[0] === afterSecondSave.text,`
  - New: `open.saveNotices.length === 1 && open.saveNotices[0] === afterSecondSave.text && isSavedLine(open.saveNotices[0], saved),`
- Clause check against the code:
  - `isSavedLine` is defined at line 86 (startsWith `saved`, then ` (HH:MM:SS)` by pattern, so no literal time and §8 item 9 holds).
  - `saved` is in scope from line 134.
  - The row equals the strip's line after the second save, so the strip's line is then a saved line too.
- These are not the human's words and not ruled words. They change only P's step 3, so no re-gate is owed. The PR body lists the pair.

**D1. Documentation, must fix before the merge. The correction changes no code.** SP-T1's test name differs by one word from its preregistered name.
- §4 preregisters the name with "two confirmed saves of one open answer saved lines that differ, each carrying its own save's fact". The test at `frontends/shell/src/project/saveProject.test.ts` line 476, and its RECORDED MUTATION and OBSERVED lines (lines 472-475), read "answered saved lines" instead.
- CV-K1's and A-A1's names match §4 byte for byte. SP-T2's name is not preregistered as quoted text.
- Correction: record the difference by appended amendment, and leave the test unrenamed. A rename would stop the OBSERVED lines from matching the run they record. My words for that amendment item (paraphrase-free, not the human's): "SP-T1's `it` name at T and at the head reads `answered` where §4's preregistered name reads `answer`; the test is SP-T1, and no assertion differs."

**D2. Documentation, must fix before the merge. The correction changes a comment and a README line, with no change in behaviour.** "A whole second past" says more than the wait proves.
- What the code does: it takes the page clock once after step 1's checks (line 145), then waits only until the next whole-second boundary (lines 146-147). That can be a few milliseconds later, not a full second.
- Pair 1, in `frontends/shell/e2e/README.md` (worker's words, the C-E2 sentence):
  - Old: `Step 1b then saves again once the page's clock reads a whole second past the first save's, and checks`
  - New: `Step 1b then waits until the page's clock reads a later second than its reading after step 1, saves again, and checks`
- Pair 2, in `frontends/shell/e2e/conditions.mjs` (the header, line 14; §4 places the header's changes at P):
  - Old: `save again once the page's clock reads a whole second past step 1's:`
  - New: `save again once the page's clock reads a later second than its reading after step 1's checks:`
- Clause check: "its reading after step 1" is line 145, which comes after lines 136-139. "A later second" is lines 146-147. "Saves again" is line 150.
- Line 142 says the same thing, but it sits inside E-A1's block, which is frozen at T (§9a). It is not edited, and the exact code beside it fixes its meaning.
- None of this is the human's wording. The PR body lists the pairs, with no re-gate.

## §2 against the code

Every change to product code is inside §2 as it was gated. Nothing goes to the advisor.
- **ConditionView.tsx:**
  - both roots carry `key={condition.id}` (lines 60 and 63);
  - the doc comment gains one sentence (line 13);
  - App.tsx is unchanged.
- **saveProject.ts:**
  - one new export, `saveTimeText` (line 47), which uses the local getters and padStart(2) and no locale form;
  - a private `timed` (line 49) that reads `new Date()` at each of the four outcomes: no view, picker failure, after `deps.save`, and the catch;
  - the cancelled picker still returns `[]`;
  - no other string changes, and no option or dependency is added;
  - the doc bullet (lines 17-19) names ADV-2026-11-26-25 item 1 and states its three bounds, and nothing more.
- **Test-side support:** fake `Date` set in beforeEach in two files, and `vi.useRealTimers()` added to the App.conditions harness teardown. These are §4's set-clock changes, they remove no assertion, and the worker disclosed them.

## I6

No path under protocol/, kernel/, engine/ or src-tauri/ is changed (a-numstat.txt, 9 files). True.

## ADR-018's vocabulary

- "acknowledged" does not occur in the diff, and no duration, elapsed time or progress figure is added.
- The waits are declared as harness bounds on readiness, not timings (conditions.mjs lines 21, 142 and 152).
- The time of day is a clock reading, which §1 already says.
- Nothing here departs from ADR-018 §1 or §4.

## The seam rule

Both seams are driven from the real shape, read on the consuming side.
- **A-A1** goes through the real App. It uses the `e2eSaveProjectToFolder` hook, which runs the product's `handleSaveProject` and answers "asked" or "not-asked" (App.tsx lines 1484-1488). It reads ConditionView's real props (ConditionView.tsx line 56).
- **E-A1** goes through the same hook in the real app, through Playwright `page.$` and `ElementHandle.evaluate` (lib.mjs line 27, playwright-core). Any answer other than "not-asked" makes the run VOID (line 151), as §4 says.
- **CV-K1** goes through the real reducer and a React root that is reused, so the key is reconciled for real (test lines 101 and 107-108).
- **Caller rule:** `saveTimeText` has a product caller, `timed`. Nothing lands without a product caller.

## §1's claims

- **May claim, each true against the code:**
  - a new element at each save, carrying the alert role, from the key on both roots;
  - the time on all four first lines, read once at the outcome;
  - two saves in different seconds of one day show different lines;
  - no S-5 line, since the save uses `replaceBatch`;
  - the three bounds, stated in the doc bullet.
- **May not claim:**
  - a screen reader announcing the line: no such claim in the diff;
  - a save's line under an older top: not claimed;
  - a duration, a docs/08 figure, or macOS or Linux above L1: none claimed;
  - the time as the moment the file was written: claimed only in the negative (saveProject.ts line 19).

## §8, item by item

| Item | Holds? | Where |
|---|---|---|
| 1 | Holds | The diff touches only the 7 paths plus MANUAL-WALKTHROUGH.md and e2e/README.md. |
| 2 | Holds | No protocol/, kernel/, engine/ or src-tauri/ path, and none of conditions.ts, ProblemsTab.tsx or StudioLayout.tsx. |
| 3 | Holds | `raisedTimesText` is used only in CV-K1 for stream-terminal. C-A6's no-occurrence assertion stands (App.conditions.test.tsx line 518). |
| 4 | Holds | App.tsx is not in the diff. |
| 5 | Holds by reading | The composition gives item 1's four lines: `SAVED_NOTICE`, `notSavedNotice`, `NO_VIEW_NOTICE` and `FOLDER_HOLDS_PROJECT_NOTICE`, each followed by ` (`, the time and `)`. Item 3's seven New texts stand in the diff (walkthrough lines 2030, 2060 and 2086). No `[P6 placeholder]` is A's: the one in AF6 is unchanged context. The byte-for-byte check is the reviewer's. |
| 6 | Holds | No duration on any line. |
| 7 | Holds | See the step 1b answer below. The README carries only the negative ("it does not check what a screen reader announces"). |
| 8 | **Breached** | F1 (conditions.mjs line 188). Every other changed assertion is equal or stricter. |
| 9 | Holds | Times are built from Date components and checked by pattern and by the clock's fields. The OBSERVED lines elide the time. |
| 10 | Not checkable by reading | The worker reports the four reds as assertion failures. T's own text is the reviewer's to read by git. |
| 11 | Holds | No merge yet. |
| 12 | Holds | No app was started. That E-A1's block did not change after T rests on the worker's hash; the reviewer confirms it by git. |

**E-A1's step 1b comment (conditions.mjs line 141, frozen at T).** It says "a second save is announced" (paraphrase of the comment). It does not make a claim item 7 forbids, so there is no finding. The phrase is the piece's name, used as a label, and the clause after its colon says what the step checks: a new element whose text differs. It names no screen reader and claims no speech. Commit P's message uses the name in the same way.

## Ruled texts

Item 1's four lines and item 3's seven New texts of ADV-2026-11-26-25 were read against the code. No clause in them is untrue for what an operator can see.
- AD1's not-saved span covers S4, and S7 cannot arise in an empty folder.
- "Anew, ending with the time of the second save" stays true even when both saves fall in one second.

I propose no words for them.

## Not a decision gap

No ADR skeleton is needed.

## For the run part

- E-A1 at T, 6ccd00d011b9765504c9e088c1354f530827491f: red at its first two checks alone, every other C-E2 check passing.
- E-A1 at P, run after F1's correction: green.
