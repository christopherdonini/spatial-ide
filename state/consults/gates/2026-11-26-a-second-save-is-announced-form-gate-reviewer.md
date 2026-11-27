Reviewed: the form text a-form-r4-text.txt in the scratch folder, 44909 bytes, sha256 122eae6f26904f0d142e819714c3876ce41e3537cf652710213ae2e3c2513453 (r3 with the architect's 87 pairs carrying ADV-2026-11-26-25 applied by script), against the code in the read checkout D:/wt/read-1126c at 7dbf2f3e635db418d4a6cc0c24a66970939eff59 and the documents in D:/wt/read-1124f at c28c8cf10a5b616af3ce660d13b1478d90e4ea08, read only. This is the custodian's filing note, 2026-11-26: the reviewer's form gate, attempt 1, node:a-second-save-is-announced@form-gate-reviewer, under ADV-2026-11-26-17 item 2. Dispatched just before 2026-11-26T21:21:52Z (date -u after the call), with its brief byte for byte (brief-a-form-gate-reviewer.md in the scratch folder, 7740 bytes, sha256 8b62d244). No message was sent to it during the run. Its run, from its completion notice only (ADV-2026-11-26-02: no transcript opened, so no count by kind, no first or last time and no count of calls naming the main checkout): 42 tool uses, 731661 ms, 182474 tokens; model opus, by its definition's model line. It handed back once, before 2026-11-26T21:35:52Z (date -u after saving). The custodian wrote the report below through the Write tool from the hand-back message, with the harness's two-space indent removed. The scratch folder's full path is written below as `<scratch folder>` (1 place); nothing else is changed, so the filed report is not byte-identical to the saved one (16907 bytes, sha256 60411d37). Verdict: BLOCK (Correctness C1, C2; Evidence E1 to E4), Documentation D1 to D5; 17 pairs, applied by script, giving r5 (47224 bytes, sha256 0a0e88f5). The report's own figure, 47221 bytes and sha256 8f863be8, is r5 with E1's three backslashes removed: its check run lost them, as the custodian found by script and the narrow read confirmed. E4 restates the ceiling to 280 under ADV-2026-11-26-25 item 10; the advisor was told before the commit and did not overturn it. Gate-log row 918.

---

**Verdict: BLOCK (form gate, reviewer). Two Correctness and three Evidence findings, all fixable by the exact pairs below.** Reviewed text: `a-form-r4-text.txt`, 44909 bytes, sha256 122eae6f26904f0d142e819714c3876ce41e3537cf652710213ae2e3c2513453 (I recomputed it). Code read in detached D:/wt/read-1126c @ 7dbf2f3e635db418d4a6cc0c24a66970939eff59 (its parents are 806ad30843269f8012ec1d89f0224703a8078ad7 and 639a96cc25873c99d606b4d75541bd8f3de37543). Forms and docs read in detached D:/wt/read-1124f @ c28c8cf10a5b616af3ce660d13b1478d90e4ea08. The form is not on a branch yet.

## Mechanical checks (by script)
- I recomputed every hash in the brief, all inputs and rulings, and each matches. ADV-2026-11-24-19 was read in D:/wt/read-1124f/state/directives/.
- The chain from the draft to r4 contains exactly the stated pairs and nothing else:
  - the draft plus the architect report's 24 bare-fenced pairs gives a-form-r2-text.txt byte for byte;
  - r2 plus the narrow read's 1 pair gives r3 byte for byte;
  - r3 plus the 87 ```text pairs (fence indent stripped) gives r4 byte for byte;
  - the whole chain from the draft gives r4;
  - every Old text occurred exactly once at its turn. r4 is LF only and ends with a newline.
- Observation, no pair: the header of `a-form-25-pairs-report.md` says 74 pairs, but it contains 87.
- ADV-2026-11-26-25 item 1's four lines and item 3's fourteen Old/New texts: none appears in r4. They are carried by reference only.
- Item 3's seven Old texts each occur exactly once in their row and in the whole file (`MANUAL-WALKTHROUGH.md` at 7dbf2f3e, AD1 line 2030, AE2 line 2060, AF3a line 2086).
- Every code line the form cites was read at 7dbf2f3e and is correct:
  - `saveProject.ts` lines 27, 67, 98, 101, 104, 108, 110, 113, 115-121 and 123;
  - `conditions.ts` lines 52, 76, 156, 166, 187-203, 216-218 and 221-224;
  - `ConditionView.tsx` lines 54, 58 and 61;
  - `StudioLayout.tsx` lines 388-391; `ProblemsTab.tsx` lines 23 and 27; `types.ts` lines 365-369;
  - `App.tsx` lines 887-895, 1267, 2237-2259, 2249, 2256 and 2541;
  - `e2e/conditions.mjs` lines 5, 17, 18, 35-36, 39, 76-82, 119, 126-127, 131, 134, 153, 155-159, 161-163, 171-172 and 189;
  - `e2e/lib.mjs` lines 27, 37 and 193; `e2e/project.mjs` lines 274 and 372-391; `e2e/colour.mjs` lines 201-202;
  - the test lines in §0.2 and §4.
- The four verbatim code spans match byte for byte.
- Searching `frontends/` for the four exports and their words finds no reader outside §0.2 and §4's list (I3 holds at 7dbf2f3e). The search for clock formatting (§0's reuse line) finds only `PublishPanel.tsx` line 246.
- Milestone 5's form, the partitioned-ordinal form and the colour-by-refill form are unchanged between c28c8cf1 and a85e0556.
- PR 365's head is not yet an ancestor of 806ad308. §9a's `--is-ancestor` stop is therefore live and correct.

## ADV-2026-11-26-25 as r4 carries it
- **Item 1: true** (§1 bullet 2, §2.2, §2.5, §9b OPEN-A1). The clock is read at lines 101, 108, 113 and 123. The cancelled picker at line 110 answers no lines. No other saver string changes. The time is `HH:MM:SS` from local getters, with no locale form. Item 1's bounds are in §1 and in §2.2's doc comment. But the form of the time has no test that can fail (E1), and the S4 line at line 108 has no test (E2).
- **Item 2: true** (Base, Merge, §1, §2.4, §4 A-S1/M-A4, §8 item 4, §9a).
- **Item 3: true** (§2.5, §7 Records, §9b OPEN-A3). Seven spans by reference, no Narrator step, no Result log line edited.
- **Item 4: true** (§2.1).
- **Item 5: true** (§7 Records, §9a, §9b OPEN-A5). The form paraphrases item 5's "words in AD1" limit as "beyond item 3's". That is acceptable as a paraphrase.
- **Item 6: true** (§1, §0.1, §9c). §9c is labelled paraphrase and carries both questions.
- **Item 7: true** (M-A1, §6).
- **Item 8: true** (§9a, §7 Counting).
- **Item 9: true in substance** (§5 Stops, §9a Runs) against ADV-2026-11-26-24 items 2 and 5. Each of the five conditions is carried, but the fourth (E-A1's text unchanged after T) is contradicted by §4 (C1). The reading "first commit with code" should be named (D3).
- **Item 10: true** (Size line, the table summing to 241 over the same 7 files, §8 item 1). The figure is sound: my own sum per file is about 235-250, which is within about 4% of 250, so the margin is thin. E1 and E2 add about 14 lines and push the count past 250, so under item 10's own condition the ceiling must be restated before commit (E4).
- **Item 11: true** (§2.5).
- **Item 12: carried** (§2.5, §8 item 5, §9 Reviewer build). As worded it cannot be applied to item 1's lines (D1).

§9a checked against ADV-2026-11-26-08 items 3, 4 and 6, ADV-2026-11-26-15 items 4 and 7, ADV-2026-11-26-19 items 2 to 5 and 7, and ADV-2026-11-24-19 item 5: the base, the merge, the order, the Runs and the Overlap rows are all true. A worker cannot build on the wrong head: 7dbf2f3e is excluded, the base is recorded in the first amendment before code, and the ancestor check stops the piece. §9b: every ruling line matches -25. No option that was not taken binds anything outside §9b (I searched for leftover text).

## Correctness (blocking)

**C1. E-A1's P-only time check changes E-A1's text after T.** This contradicts §9a Runs ("E-A1's text does not change after commit T"), §8 item 12 and ADV-2026-11-26-24 item 2's fourth condition, which ADV-2026-11-26-25 item 9 applies to A. If it is recorded by class, the T run must be made on the changed text. The time check then fails at T as a third reason, which trips §9a's stop for "red for another reason". The fix moves the pattern check into step 1's checks, which already change at P (lines 131 and 134), and leaves E-A1 fixed from T.
Old:
```text
    - no `.condition-occurrences` stands;
    - at P only, its text begins with `SAVED_NOTICE`'s words, read by name, and ends with a time in brackets in item 1's `HH:MM:SS` form, matched by pattern and never by a literal time (§8 item 9).
  - Steps 2 to 4 then read the second save's line wherever they read the saved line.
```
New:
```text
    - no `.condition-occurrences` stands.
  - E-A1's text is the same at T and at P (§9a). The time's form is checked at P in step 1, whose checks change at P (lines 131 and 134): its line begins with `SAVED_NOTICE`'s words, read by name, and ends with a time in brackets in item 1's `HH:MM:SS` form, matched by pattern and never by a literal time (§8 item 9). At P, step 3 (line 153) reads the second save's line where it reads the saved line.
```
Old:
```text
and a pattern match on the time's form in E-A1.
```
New:
```text
and a pattern match on the time's form in C-E2's step 1 at P.
```

**C2. §1's "less than a day apart" claim is untrue.** The saver uses local getters, so two saves exactly one hour apart in the repeated hour after daylight saving ends, or exactly 23 hours apart across the spring change, show the same `HH:MM:SS`. A change of time zone can do the same. Replacement words, which are the architect's and not the human's. Each clause checked against §2.2's code: "as the machine's local clock reads them" is the local getters. Each second of one local day has exactly one `HH:MM:SS`, so different seconds give different text. The repeated hour gives equal readings, which falls outside the claim. A save across midnight is no longer claimed.
Old:
```text
two saves whose clock readings are less than a day apart and fall in different seconds therefore show different first lines.
```
New:
```text
two saves whose times, as the machine's local clock reads them, fall in different seconds of one day therefore show different first lines.
```

## Evidence (blocking)

**E1. No test can fail on the time's form.** SP-T1, SP-T2 and the changed tests compare the line against the exported time function, so a 12-hour or unpadded function passes them all. E-A1's pattern cannot distinguish a 12-hour clock from a 24-hour one. §1 claims "on the 24-hour clock" only "as far as §4 tests it". The fix tests the fields with no literal string, so §8 item 9 stands.
Old:
```text
  - At P it also asserts each line against the exported template, at its set clock.
- **A-A1**
```
New:
```text
  - At P it also asserts each line against the exported template, at its set clock.
  - Its two clocks are built from local components, `new Date(2026, 10, 26, 23, 4, 5)` and the second after it. At P it also asserts that the time in brackets matches `^\d{2}:\d{2}:\d{2}$` and that its three fields, read as numbers, equal the set clock's `getHours()`, `getMinutes()` and `getSeconds()`. That proves the 24-hour clock and the two digits with no literal clock string (§8 item 9). It tells local getters from UTC ones only on a machine whose zone is not UTC.
- **A-A1**
```

**E2. The picker's S4 line (`saveProject.ts` line 108) is tested nowhere.** No existing or new test reaches it, yet §1 and §2.2 claim that it carries the time.
Old:
```text
At P it also asserts each line against `notSavedNotice` and the time's form at its set clock.
```
New:
```text
At P it also asserts each line against `notSavedNotice` and the time's form at its set clock, and adds one case: a picker that throws (line 108) answers a first line that carries the time at its set clock, asserted against `notSavedNotice` with the picker's message and the time's form.
```
The mutations for E1 and E2:
Old:
```text
- **M-A5:** the not-saved line with the kernel's message (S4) carries no time. Fails SP-T2 at its differs assertion.
```
New:
```text
- **M-A5:** the not-saved line with the kernel's message (S4) carries no time. Fails SP-T2 at its differs assertion.
- **M-A6:** the time's hours are taken modulo 12. Fails SP-T1 at its field assertion at P.
- **M-A7:** the picker's failure line (line 108) carries no time. Fails SP-T2 at its picker case at P.
```

**E3. Two predicted results at T cannot be observed as stated.** Vitest ends an `it` at its first failing assertion.
- CV-K1's kept half is predicted "green at T", but it is only observed if it runs before the new-element half.
- A-A1's differs assertion is never reached at T.
Old:
```text
It asserts that the element is the same node and that S-5 shows. This half is a guard, green at T and at P.
```
New:
```text
It asserts that the element is the same node and that S-5 shows. This half is a guard, green at T and at P. It runs first in the `it`, so that its green at T is observed before the new-element half fails.
```
Old:
```text
  - Red at T at the not-connected and differs assertions.
```
New:
```text
  - Red at T at the not-connected assertion, the first it reaches: vitest ends the `it` there, so at T the differs assertion is red in SP-T1 and E-A1, and A-A1's own differs assertion is shown able to fail by M-A3.
```

**E4. The ceiling after E1 and E2.** The new estimate is about 255, over 250, so item 10's restatement applies before the commit. The figure 280 is my proposal, at about a 10% margin.
Old:
```text
at most 250 changed lines (insertions plus deletions) over at most 7 files.
```
New:
```text
at most 280 changed lines (insertions plus deletions) over at most 7 files, restated under item 10 (see below).
```
Old:
```text
| `frontends/shell/src/project/saveProject.test.ts` | about 63 |
```
New:
```text
| `frontends/shell/src/project/saveProject.test.ts` | about 77 |
```
Old:
```text
| **Total** | **about 241** |
```
New:
```text
| **Total** | **about 255** |
```
Old:
```text
with (ii) it comes to about 241 lines over 7 files, under the 250, so item 10's ceiling stands and is not restated.
```
New:
```text
with (ii) and the two assertions the reviewer's form gate added to `saveProject.test.ts` (M-A6, M-A7) it comes to about 255 lines over 7 files, over the 250, so the ceiling is restated before the form is committed, as item 10 provides.
```

## Documentation (must fix before the commit)

**D1. Item 12's byte comparison cannot be done on item 1's lines as worded.** §2.2 keeps the fixed words in the unchanged exports and builds each line by composition, so the diff never contains item 1's lines as they stand.
Old:
```text
No string carries the `[P6 placeholder]` mark (item 11). The merge check compares item 1's four lines and item 3's seven New texts with the diff byte for byte (item 12).
```
New:
```text
No string carries the `[P6 placeholder]` mark (item 11). The merge check compares item 1's four lines and item 3's seven New texts with the diff byte for byte (item 12). Item 3's New texts stand in the walkthrough's diff as they are. Item 1's lines are composed, so for each the check reads the line as the saver builds it at the head: the export's fixed words (`SAVED_NOTICE`, `notSavedNotice`'s words before the message, `NO_VIEW_NOTICE`, `FOLDER_HOLDS_PROJECT_NOTICE`), then the text the diff adds around the message and the time; it compares that with item 1's line byte for byte, with `{message}` and `{time}` standing for the values.
```

**D2. Stale reference to B's form.** The custodian's fact is from B's round-3 text.
Old:
```text
By its round-1 draft, B's piece touches neither this file nor the walkthrough.
```
New:
```text
By its round-3 text, B's piece touches neither this file nor the walkthrough.
```

**D3. Name the reading of ADV-2026-11-26-24 item 2.** The ruling says the first commit after the base; the form says "first commit with code".
Old:
```text
- Commit T is the red commit: the first commit with code after the base, holding the new tests and nothing of the fix (§4). Product code starts in commit P.
```
New:
```text
- Commit T is the red commit: the first commit with code after the base, holding the new tests and nothing of the fix (§4). Product code starts in commit P. Only record commits (this form, its amendments and PLAN) may stand between the base and T; that is this form's reading of the first commit after the base in ADV-2026-11-26-24 item 2.
```

**D4. The line gap is miscounted.** `saveProject.test.ts` line 70 is `skp: "skp/0.14",`.
Old:
```text
line 65 and line 70 are four lines apart.
```
New:
```text
line 65 and line 70 are five lines apart, with four unchanged lines between.
```

**D5. The fake clock in App tests (low).** A fake `Date` set before the real time can make `requestViewport`'s throttle comparison (`streaming/viewportStreamManager.ts` line 170, `nowMs = Date.now()`) run backwards.
Old:
```text
Tests set the clock with vitest's fake `Date` alone (`vi.useFakeTimers({ toFake: ["Date"] })`).
```
New:
```text
Tests set the clock with vitest's fake `Date` alone (`vi.useFakeTimers({ toFake: ["Date"] })`). In the App tests it is installed before the open and only moved forward, so that the viewport throttle's `Date.now()` (`streaming/viewportStreamManager.ts` line 170) never reads a time before its last query.
```

## Applying the pairs
- I checked all 17 pairs by script on a-form-r4-text.txt. Each Old occurs exactly once, and they apply in the order given with no overlap.
- Applied in that order, they give 47221 bytes, sha256 8f863be805646721c1a5412019970029c5c490ee463f9e3e554ab9aab99f147b.
- None of these is the human's wording, and none changes an advisor string.
- C2 and D1 to D5 are words only. C1, E1, E2 and E3 change what is planned (one check moves, two assertions and two mutations are added, and one prediction is reduced), and E4 restates the ceiling under item 10. So I recommend a narrow reviewer read of the applied text before the commit, and telling the advisor about the restated ceiling.

## Checked and found true (no finding)
- §2.1's key on the returned root: a different key on a component's single returned element remounts it, so H1 holds. M-A1 and M-A2 each fail where §4 says.
- SP-T1, SP-T2, CV-K1, A-A1 and E-A1 need no export that the base lacks, so their red at T is the test's own reason.
- The E-A1 hook answers `"not-asked"` at T and at P (`App.tsx` lines 1484-1493), and its connection wait records FAIL, never VOID.
- The clock wait puts the two saves in different seconds.
- The §2.6 seams match the consuming interfaces. The exported time function's product caller is the saver.
- The gating claims check out against `governance/AUTONOMY.md` §21a and §21c and the template's Round 25 additions, items (a), (c) and (e). The tool claim names `a5d8b8b`.
- §6's runs and §9's list of which runs start the app match `e2e/lib.mjs` and `e2e/conditions.mjs`.
- Not verifiable within my limits: the lead-data draft's size and hash, and the reuse run's output (both are the custodian's).

Files:
- <scratch folder>/a-form-r4-text.txt
- D:/wt/read-1126c/frontends/shell/src/project/saveProject.ts
- D:/wt/read-1126c/frontends/shell/src/conditions/ConditionView.tsx
- D:/wt/read-1126c/frontends/shell/e2e/conditions.mjs
- D:/wt/read-1126c/frontends/shell/src/streaming/viewportStreamManager.ts
