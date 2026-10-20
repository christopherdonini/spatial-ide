Reviewed: PR #234 at 95bd9747e9042982b4baab42cc20330f9652fc52 (base d2045496), gate 1, architect. Branch: cut/shell-migration-milestone-3-pr-b @ 95bd9747e9042982b4baab42cc20330f9652fc52
Verdict: PASS WITH NOTES

I found nothing to report under Correctness or Evidence. There are seven Documentation findings (D1 to D7). Each must be fixed in this PR before the merge, with no re-gate. None of the sentences concerned is the human's wording, so the worker or the custodian applies the words below as given and the PR body lists them.

## Correctness
None.

## Evidence
None. H3 at 95bd9747 rests on an inference that is sound but not stated anywhere (D7).

## Documentation (must fix before the merge)

**D1. `e2e/command-bar.mjs` header (worker's text).** Three problems:

(a) Line 34 says PR B's mutations are "not run". The custodian has now run all of them.
Replace line 34 with:
`// PR B's MUTATIONS (section 4; Amendment 3 item 4(d)). Written down by the worker. Each is a replacement of one exact text, found exactly once at 984d7e34d060af384d59e9abdab0bbb8993876e6, and each is to be reverted after it is observed. The custodian ran each alone, seven at 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24 and E-SEL at 95bd9747e9042982b4baab42cc20330f9652fc52, and each failed the step its entry names (state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md):`
Clause check against the record: lines 40-47 (seven runs at 4b9f7c89), line 57 (E-SEL at 95bd9747), lines 70 and 112 (E-SEL's run at 4b9f7c89 was not an observation).

(b) The header does not predict that the E-REFUSE mutation also fails E-TOOLONG. PR A's gate required the same kind of statement for E-REVEAL (Amendment 8 item 7).
After line 42, add:
`//             Step E-TOOLONG fails too, and this is expected: the mutation also adds E-TOOLONG's refused card B before its outcome, so that step fails with "E-TOOLONG: after the refusal the cards read 2 card(s) ...; card A alone was expected". Two steps fail for this one mutation.`
Clause check:
- E-TOOLONG starts from the panel's Clear (lines 464 and 367-372).
- Under the mutation, card B's `filter.clauses.set` is dispatched before `applyFilterWith` resolves.
- The kernel still refuses `skp.filter_too_long`, so the code check at line 469 passes.
- The card check at line 471 then throws. This matches the record's line 139.

(c) Line 24 now predicts "expected 12". That message was never observed: line 13 says the run was at 2fa7c8d0, and there the record shows "expected 11" (round-2 record, line 64).
Replace line 24 with:
`//             Expected: step E-HELP fails, "E-HELP: ? lists 4 options, expected 12" (12 entries since PR B's filter.addClause; observed at 2fa7c8d0, with 11 entries, as "expected 11").`
Clause check: actionRegistry.ts:61-72 holds 12 entries, 4 of them with a chord (lines 61-63 and 69).

**D2. `e2e/README.md:809`, the last sentence (worker's draft).** It says "they have not been run".
Replace it with:
`PR B's eight mutations are written down in the header with the exact text each replaces and the step and message expected; the custodian ran each alone, seven at 4b9f7c89 and E-SEL at 95bd9747, and each failed that step (state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md). The header also states that the E-REFUSE mutation fails E-TOOLONG as well.`
Clause check: as D1 (a) and (b).

**D3. `src/App.tsx`, the doc comment over `applyFilterWith` (worker's text).** It was moved from `handleApplyFilter` and is now wrong in three places:
- **Line 1019.** Replace "`FilterPanel`'s own `onApply` prop." with "The one call behind `FilterPanel`'s `onApply` (`handleApplyFilter`, below) and a card or bar change (`changeClauses`), each passing its own `commit`."
- **Line 1025.** Replace "`handleApplyFilter`'s own `requestViewport` here" with "`applyFilterWith`'s own `requestViewport` here".
- **Line 1036.** Replace "`useCallback([commitActiveFilter])`: stable for the same reason `handleAdmitted` above is." with "`useCallback([])`: it reads only refs and its `commit` argument, so it is stable for the same reason `handleAdmitted` above is."

Clause check:
- `onApply={handleApplyFilter}` is at line 2024, and `handleApplyFilter` passes `commitActiveFilter` at line 1077.
- `changeClauses` passes its own commit at line 1962.
- The deps are `[]` at line 1073.
- The body (lines 1043-1070) reads only `admittedDatasetRef`, `issueQueryRef`, `viewportDebounceRef`, `lastViewportBboxRef`, `activeFilterRef` and `canvasRef`, plus `commit`.

**D4. `MANUAL-WALKTHROUGH.md:1947`, row AB11 (worker's draft, outside §7's count).**
- PR A's report put its strings on "the AB11 sight". That report is `state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md`, its section "User-visible strings added" and its Differences item 9.
- AB11 lists none of those strings except the "not available" line.
- AB11 also folds `CLAUSE_ADVANCED_NEW_LINE` into its other lead lines without naming it.
- §2.10 Y11 requires "every new string".
- §8 item 16 still passes, because every PR A string except the registry labels and words is marked. The unmarked labels and words are exactly what AB11 leaves out.

Replace the Step cell with:
`The P6 sight of every new string of this milestone, and of the sentences OPEN-9 drafts; **read the last amendment first.** The bar: its name and its placeholder text; the list's mark for a command that is not available; the bar's lines for an empty bar, a list to choose from, an unknown command, nothing matching, a command that is not available, a file already being opened, an empty condition, a change still being applied, and Enter on a field name; the field list's overflow line. The commands: the labels Command bar, Open dataset, Export and Add filter, and the words /layers, /inspector, /activity, /zoom-to-layer, /navigate, /select, /zoom-to-selection, /clear-selection, /open, /export and /filter. The cards: the statement, the switch and Remove labels, the mark on an expression, and the lead lines for a refusal, a change not applied, a new condition that can only be used on its own, and a card that is in the way. The Console statement of filter.clauseNotSent.`

Replace the Expected cell with:
`Record the wording you approve or replace. Every one starts with [P6 placeholder] except the command labels and words, and stays a placeholder until then.`

Clause check:
- CommandBar.tsx: lines 32-41, 161, 200 and 201.
- ClauseCards.tsx: lines 18-26.
- actionRegistry.ts: lines 61-72. Labels "Command bar", "Open dataset", "Export" and "Add filter" are at 69-72. The words are on lines 61-72, and `command.focus` has none.
- surfaceRegistry.ts: line 201.
- Every string in this list except the registry labels and words starts with `[P6 placeholder]`.

**D5. The form's Amendment 10, on main (the custodian's record).** Three problems:
- Its first line does not say it was written after outcomes were seen, which the form's header requires. Only its e2e item is labelled class 1.
- Items 2 and 3 name no class.
- Its preamble gives the e2e record's sha256 with no `@ <rev>` (round 15 (e)). PR A's gates raised the same thing for Amendment 6, and Amendment 7 item 2 fixed it.

Append this correction (three sentences, round 12 (d)):
`Correction to Amendment 10 (class 3): its first line does not say it was written after results were seen, its items 2 and 3 name no class, and its preamble's sha256 of the e2e record names no rev. Amendment 10 was written after the build's count and the custodian's runs (class 1); item 3's E-SEL failure at 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24 is class 2 against §3's prediction for e2e:command-bar, and its reading of §7 G-E as A-E and B-E is class 3; the record's sha256 89512292823e70c1ff087e8a0d672fd5dc9feecd59bded3605dc993bd42e48d1 is @ <the main commit that added the record>. Proof: the form's header rule on amendments made after an outcome, the template's classes 1 to 3, and round 15 (e).`

The custodian fills the rev from `git log`. I cannot run git.

**D6. E-SEL picks the Select tool with its button, not with the bare S key the form's row names.** The button click is at `e2e/command-bar.mjs:536` (the E-SEL row says "S, then a click at a pixel found by capturePixels"). The build report does not list this as a difference.
Add to the PR body:
`E-SEL selects the tool with the Select button (.tool-switch-button), not the bare S key the form's E-SEL row names; the step's assertion, the selection count after a card is switched off, does not depend on how the tool was chosen.`
Clause check: line 536 clicks the button, and lines 540-546 assert the count.

**D7. H3 "held at the head": which head is not stated.**
- Every existing suite ran at 4b9f7c89. Only command-bar and E-SEL's mutation ran again at 95bd9747 (the record's lines 21-49 and 55-59).
- The e2e record's "at the head" and Amendment 10 item 4's "H3 held" do not say which head.

Add to the PR body:
`H3: every existing suite passed at 4b9f7c89 (the custodian's record); 4b9f7c89..95bd9747 changes only e2e/command-bar.mjs (step 9's report), which no other suite imports, so those runs stand for 95bd9747.`
Clause check:
- The step 9 report's `git diff --stat` shows 1 file.
- A grep shows `command-bar.mjs` referenced only at package.json:38.
- The reviewer should recompute `git diff --stat 4b9f7c89 95bd9747`; I have no shell.

## Observations (no class, no action required)
- **O1. An unreachable path in `runAction`.** At StudioLayout.tsx:223-226, the one-argument overload is typed `RunOutcome`, but for `filter.addClause` it returns `Promise.resolve(not-applied)`. That path cannot be reached:
  - `available` is false when `onAddClause` is absent (line 208);
  - `CommandBar.applyEntry` stops entries that take a condition before running them (CommandBar.tsx:149);
  - the entry has no chord.
- **O2. Unchanged-filter changes still send.** A change that leaves the combined filter the same, such as removing a card that is off, still sends, re-fits the camera and records an identical `filter.apply` step. This is what §2.5 specifies ("On `propose`, it calls `applyFilterWith`"). The operator will see the re-fit at AB4a.
- **O3. The e2e record's wording on E-TOOLONG.** The record says E-TOOLONG failed "behind" E-REFUSE's mutation. In fact the failure is the mutation acting on E-TOOLONG's own refusal: the step starts from Clear (D1 (b)). The record is evidence on main and needs no edit.
- **O4. Part U's U1 is stale.** It still says the top bar holds "the title and three toggles" (MANUAL-WALKTHROUGH.md:1730). This dates from PR A. The worker disclosed it, and §8 item 23 forbids changing a row's meaning here, so it belongs in the docs lane.
- **O5. Merge method.** Merge so that the branch's `OBSERVED AT` commits stay reachable from main, as PR A's two-parent merge did. If main is merged into the branch first, recount §7 from the new merge base (§7).

## §8, item by item, at 95bd9747
1. Pass. The 23 files in the build report are all inside §2.9 (commandConstants.ts and actionRegistry.test.ts included). I could not run the diff myself.
2. Pass, by the report: no package.json, lockfile or dependency change.
3. Pass.
   - Nothing is edited under skp/, streaming/, residency/, canvas/ or src-tauri/.
   - `filterClauses.ts` only imports types and the dialect constant from `skp/types`.
   - `filter.clauses.set` is a shell transition, not an SKP shape.
4. Pass.
   - `applyFilter`, `ApplyFilterDeps` and `ApplyFilterOutcome` read the same at head App.tsx:288-394 as at main App.tsx:283-389 (I compared them by reading both).
   - FilterPanel, `predicateInput.ts` and the `Filter` type are untouched, by the report.
5. Pass: `combineClauses` (filterClauses.ts:35-40), UC3, RC3, E-AND.
6. Pass.
   - The only trim is the `filter-empty` test (commandDraft.ts:53).
   - The recognizer decides display and sending only.
   - The kernel's refusal is shown in RefusalBlock under the shell's lead line.
7. Pass: RC4, RC5, E-REFUSE, E-TOOLONG.
8. Pass: `/filter` goes through the one `runAction` (StudioLayout.tsx:226), and the other arms are unchanged.
9. Pass: PR B adds no publish call from the bar.
10. Pass: Tab's rule is unchanged, and `completed` makes a second Tab leave (commandDraft.ts:119).
11. Pass: the list renders only while `shown` (CommandBar.tsx:236), and the note is transient.
12. Pass: no card or bar action changes the canvas's key. The cards are keyed by dataset (App.tsx:2097).
13. Pass: the geometry column is excluded and only the name and `arrow_type` are shown (fieldCompletion.ts:48-49; UC6, RC-FIELD).
14. Pass: no log, undo or "undoable" in the new files.
15. Pass: the lines state shell consequences only; RC16 shows the owner's notice.
16. Pass on marking. Every new PR B string is `[P6 placeholder]` except the label and word "Add filter" / "filter", and AB11 lists those. AB11's completeness is D4.
17. Pass. Product callers:
   - `onAddClause`, `clausePending` and `filterFields`: App.tsx:1981-1983.
   - `ClauseCards`: App.tsx:2097.
   - `changeClauses`: from both the bar and the cards.
   - The exports are used in product.
   - O1 is the only unreachable path.
18. Pass.
19. Pass.
20. Pass: no verbatim quote of the human in the files I read.
21. Pass. Every new test has an `OBSERVED AT` comment, and the eight e2e mutations are observed in the custodian's record.
22. Pass: every OPEN item is ruled (Amendments 1, 2 and 4).
23. Pass. Only `command-bar.mjs` (B-E) is edited, and Part AB is appended. That no existing row was edited rests on the report.
24. Pass.
25. Pass.
   - The only filter enqueue is in `commitFilterChange` (App.tsx:1003), and it runs only as `applyFilterWith`'s commit after an issued outcome.
   - It records the combined filter (RC3, RC5, E-AND-b).
26. Pass: RC7 asserts no request and no `recordStep` for `filter.clauseNotSent`.

## What I checked, with evidence
1. **§8:** as above.
2. **The clause model:**
   - `recognizeSimple` is anchored, returns only yes or no, and is used only for the card mark and the refusal rule (filterClauses.ts:50-61; ClauseCards.tsx:39 and :73). I found no token outside a literal or quoted name that could unbalance the bracketing.
   - `proposeClauseChange`'s refusals match §2.5 and OPEN-3 (A), and turning a card off or removing one is never refused (filterClauses.ts:84-108; UC5).
   - The card path is `changeClauses`, then `applyFilterWith`, then the unchanged `applyFilter`, which satisfies I8 (App.tsx:1038-1074, 1948-1968).
   - RC3, RC4, RC12 and RC16 run through the real App, StudioLayout, CommandBar, ClauseCards, PublishPanel and step queue. The mocks are only `skp/client`, `skp/dialog`, `skp/events`, part of `publish/client`, the stream manager and the canvas (App.command.test.tsx:49-162). Nothing I6 forbids is mocked.
3. **`/filter`, completion and the cards:**
   - The trigger, the candidates and the quoting follow §2.4 (fieldCompletion.ts:39-56).
   - The `/filter` draft keeps its condition byte for byte (commandDraft.ts:49-54).
   - The cards follow §2.6.
   - Amendment 7 item 5 is settled as §2.3 says: ArrowDown and ArrowUp do nothing while `completed` (commandDraft.ts:130 and :133). This is tested by UC2's PR B row and by RC-FIELD.
4. **The nine differences:** all are within the form. No. 1 adds `step` to the proposal, which the transition needs. No. 2 is the one-dispatch overload (O1). No. 3:
   - substring matching is a reading of "matched case-insensitively";
   - Enter on a field option shows a hint, because "Enter never completes".
   No. 4 changed no tracked file. No. 5 concerns process only. No. 6's added rows each have an observed mutation. No. 7 is Amendment 10 item 2. No. 8 is D1 (c). No. 9 was overtaken by the custodian's runs. One difference the report does not list is D6.
5. **Amendment 10:**
   - Item 1 meets class 8: the words are in its heading; it records 120 declared and 136 at 95bd9747 from 19eacc52, with a reason that matches CommandBar.tsx:230-266; and §7's line on main is unedited.
   - Item 2: the group sums match the build report (537, 550, 270; total 1,517).
   - Item 3: the reading of G-E as A-E and B-E is the natural one, since §7 names no G-E group.
   - The record-form gaps are D5.
6. **The e2e record:**
   - Every suite in package.json except `e2e:debug` ran, plus pan-anchor, source-watch-idle and source-changed on both routes (Amendment 3 item 12).
   - The post route failed on S5d alone. I verified that no other suite imports `command-bar.mjs`.
   - Gaps in the wording are D7.
7. **Strings:** listed at item 16 and in D4.

**Not run (no shell in this role):**
- `git diff origin/main...HEAD` and the §7 numstat. Amendment 10's 107/29 figures are taken from the record.
- Recomputing any sha256.
- `gh pr view 234`, so I have not seen the PR body's suite list or its naming of each tool's commit.
- Branch CI, `npm run verify`, and verify-cites, verify-quotes and verify-test-claims.
- The e2e, by order.

The reviewer should cover the byte-level checks.

No ADR skeleton is needed: no decision is missing.
