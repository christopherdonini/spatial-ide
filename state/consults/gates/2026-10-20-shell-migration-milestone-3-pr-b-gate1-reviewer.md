Reviewed: PR #234 at 95bd9747e9042982b4baab42cc20330f9652fc52 (base d2045496), gate 1, reviewer; cut/shell-migration-milestone-3-pr-b @ 95bd9747e9042982b4baab42cc20330f9652fc52
Verdict: PASS WITH NOTES

There are no Correctness or Evidence findings. Every check the brief names was run, and none failed. Eight Documentation findings (D1 to D8) must be fixed in this PR before the merge, with no re-gate. None of the sentences involved is the human's wording: each comes from the worker or the custodian, and the README entry and Part AB are marked as drafts. So the worker applies the words below and the PR body lists them.

## Correctness
None.

## Evidence
None.

## Documentation (each must be fixed before the merge)

**D1. The README says PR B's mutations were not run, which is stale at the head.**
- Where: `frontends/shell/e2e/README.md:809`. The sentence reads: "PR B's eight mutations are written down in the header with the exact text each replaces and the step and message expected; they have not been run."
- What the evidence shows: the custodian ran all eight (e2e record lines 40-47 and 57).
- Replacement words: "PR B's eight mutations are in the header the same way. The custodian ran each alone, seven at 4b9f7c89 and E-SEL at 95bd9747, and each failed the step its entry names; E-REFUSE's also failed E-TOOLONG (state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md)."
- Clause check:
  - seven at 4b9f7c89 and E-SEL at 95bd9747: record lines 40-47 and 57;
  - each failed the step its entry names: record lines 119-163;
  - E-REFUSE's mutation also failed E-TOOLONG: record line 139.

**D2. The `command-bar.mjs` header says PR B's mutations were not run, and does not predict E-REFUSE's second failure.**
- Line 34 reads: "Written down by the worker and not run: the app is the custodian's."
  - Replace that sentence with: "Written down by the worker; the custodian ran each alone, seven at 4b9f7c890a6f5c0f36849861a9084e53e0ba2e24 and E-SEL at 95bd9747e9042982b4baab42cc20330f9652fc52, and each failed the step its entry names (state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md)."
  - The rest of line 34 stays.
- After line 42, the E-REFUSE entry, add: "Step E-TOOLONG fails too: the same mutation adds E-TOOLONG's refused card B before its outcome, so its `after the refusal the cards read 2 card(s)` check fails."
  - This follows the precedent of E-REVEAL's line, from Amendment 8 item 7.
- Clause check:
  - `stepTooLong` calls `clearCards` first (command-bar.mjs:280), so no card from E-REFUSE carries over;
  - under the mutation, `changeClauses` dispatches `filter.clauses.set` before every outcome, B's included;
  - record line 139 shows 2 cards and a bracketed Applied line.

**D3. "Each starts from the Filter section's Clear" is untrue for E-FIELD.**
- Where:
  - `command-bar.mjs:7`, "each starts from the Filter section's Clear and sets its own cards through the bar.";
  - `README.md:805`, "PR B adds seven steps, each starting from the Filter section's Clear and setting its own cards through the bar".
- What the code does: `stepField` (command-bar.mjs:212-225) calls only `resetBar` and sets no card.
- Replacement words:
  - header: "each but E-FIELD starts from the Filter section's Clear and sets its own cards through the bar.";
  - README: "PR B adds seven steps, each but `E-FIELD` starting from the Filter section's Clear and setting its own cards through the bar".
- Clause check: `clearCards` is the first call in `stepAnd`, `stepRefuse`, `stepTooLong`, `stepAdvanced`, `stepPanel` and `stepSelection`, and is absent from `stepField`.

**D4. Part AB, three cells an operator can see disagree with the app** (`frontends/shell/MANUAL-WALKTHROUGH.md`).
- **AB3, line 1938.**
  - Current: "After the `@zo`, the list holds the file's field names with their types."
  - Replacement: "After the `@zo`, the list holds the file's field names that contain `zo`, each with its type."
  - Clause check: `fieldOptions` keeps only names that contain the partial, case-insensitively, and each option renders `.command-field-type`.
- **AB7, line 1943.**
  - Current: "Tab and Shift+Tab leave the bar in one press (a second Tab if a name was just completed)."
  - The problem: with `/fil` in the bar, the first Tab completes and does not leave.
  - Replacement: "Shift+Tab leaves the bar in one press; Tab leaves it in one press, or in two when the first completes the only candidate or the chosen option."
  - Clause check, `commandBarKey`'s Tab case: Shift is never intercepted; Tab completes the active option or the single candidate unless `completed` is set; a second Tab returns `none` and the browser moves the focus.
- **AB11, line 1947.**
  - Current: "a command that is not available," is listed among the new strings. That line is PR A's `COMMAND_UNAVAILABLE_NOTE`, and the two shell-refusal lines are not named apart.
  - Replacement for the strings clause: "the bar's lines for an empty condition, a change still being applied, and Enter on a field name; the field list's overflow line; the cards' statement, the switch and Remove labels, the mark on an expression, the lead lines for a refusal and for a change not applied, and the two lines for a change the shell does not send (an expression beside a card that is on, and any card beside an expression that is on); and the Console statement of `filter.clauseNotSent`."
  - Current Expected cell: "Every one starts with `[P6 placeholder]` (the command's label does not) and stays a placeholder until then."
  - Replacement: "Every one but the command `/filter` and its label starts with `[P6 placeholder]`, and stays a placeholder until then."
  - Clause check:
    - `COMMAND_FILTER_EMPTY_NOTE`, `CLAUSE_BUSY_LINE`, `COMMAND_FIELD_NOTE`, `commandFieldMore`;
    - `CLAUSE_STATEMENT`, `CLAUSE_ON_LABEL` and `CLAUSE_REMOVE_LABEL` and their aria-labels, `CLAUSE_ADVANCED_MARK`;
    - `CLAUSE_REFUSED_LINE`, `CLAUSE_NOT_APPLIED_LINE`;
    - `CLAUSE_ADVANCED_NEW_LINE` (the card in the way is simple) and `clauseBlockedLine` (the card in the way is an expression), in `clauseResultLine`;
    - surfaceRegistry.ts:201;
    - the registry label "Add filter" and the word `filter` are unmarked.

**D5. Three App.tsx doc comments are stale or imprecise.**
- **Line 1019**, "`FilterPanel`'s own `onApply` prop.". It now sits on `applyFilterWith`.
  - Replacement: "The one `applyFilter` call behind `FilterPanel`'s `onApply` (`handleApplyFilter`, below) and a card change (`changeClauses`), each passing its own `commit`."
- **Line 1036**, "`useCallback([commitActiveFilter])`: stable for the same reason `handleAdmitted` above is.". The deps are now `[]`.
  - Replacement: "`useCallback([])`: it reads only refs and its own arguments, so it never changes."
- **Line 1946**, "Under OPEN-3 (A) the shell sends nothing for an advanced clause beside another card, and records the class-C row `filter.clauseNotSent`."
  - Replacement: "Under OPEN-3 (A) the shell sends nothing for an advanced clause beside a card that is on, or for any clause beside an advanced card that is on, and records the class-C row `filter.clauseNotSent`."
- Clause check:
  - `handleApplyFilter` is `applyFilterWith(filter, commitActiveFilter)`, and `changeClauses` passes `(f) => commitFilterChange(f, …filter.clauses.set…)`;
  - the body of `applyFilterWith` reads only `admittedDatasetRef`, `issueQueryRef`, `viewportDebounceRef`, `lastViewportBboxRef`, `activeFilterRef`, `canvasRef` and its arguments;
  - `blockerOf` in filterClauses.ts filters `enabled` and picks the blocking card both ways, and `recordNamed` runs on `refuse`.

**D6. Amendment 10's hash reference carries no revision** (form on main, Amendment 10's preamble; round 15, item (e)).
- Correction words, appended on main:
  1. "Amendment 10's preamble hash of `state/consults/2026-10-20-shell-migration-milestone-3-pr-b-e2e-custodian-runs.md` carries no rev (round 15, item (e))."
  2. "It is the whole file @ d2045496e50fd03a2401daa6275b9cdc7da6316e."
  3. "Recomputed there: 89512292823e70c1ff087e8a0d672fd5dc9feecd59bded3605dc993bd42e48d1."
- That hash matches my recomputation. d2045496 is the only commit on main that touches the file.

**D7. E-SEL selects differently from §4's row, and no differences list says so.**
- §4's E-SEL row names `S`, then a click.
- The step clicks the tool switch's Select button instead (command-bar.mjs:352).
- Neither the build report's nine differences nor the PR body lists this. Add it to the PR body's differences: "E-SEL selects with the tool switch's Select button and a click, where §4's row names S then a click."

**D8. A causal sentence in the custodian's e2e record is inaccurate.**
- Record line 112 reads: "Under E-REFUSE's mutation the refused card stood, so E-TOOLONG, the next step, failed behind it."
- E-TOOLONG clears the cards first, so E-REFUSE's card does not carry over. E-TOOLONG fails on its own refused card (see D2). No result changes.
- Fix: a one-sentence appended note, or leave the record as it is and do not copy the sentence into the header.

**Not findings (cases that depend on timing inside one request round trip):**
- `CommandBar.sendCondition` clears the draft once a change is applied. Text typed while the request is pending is lost.
- A result that arrives after the bar has lost the focus shows its note until the next focus and key.

## §8, item by item
1. Pass: all 23 files are inside §2.9.
2. Pass: no change to package.json, the lockfile or any dependency.
3. Pass: nothing under engine/, kernel/, protocol/, src-tauri/, skp/, streaming/, residency/ or canvas/, and no new SKP shape.
4. Pass: `applyFilter`, `ApplyFilterDeps`, `ApplyFilterOutcome`, predicateInput, FilterPanel and `Filter` are untouched. The App.tsx hunks do not reach lines 283-400 or the dev hooks.
5. Pass: texts are sent byte for byte, combined as `(t1) AND (t2)` (UC3, RC3).
6. Pass: the only trim is the emptiness test; there is no shell ceiling or case fold; the recognizer only decides how a text is shown.
7. Pass: RC4, RC5 and RC-BUSY hold, and their mutations reproduce.
8. Pass: `/filter` goes through StudioLayout's one `runAction` overload.
9. Pass: the bar never calls `publishPrepare` or `publishExecute`.
10. Pass: Shift+Tab is never intercepted; after a completion a second Tab leaves (UC2 B, RC-FIELD).
11. Pass: the list renders only while `shown`; the note is fixed, transient, and cleared on blur.
12. Pass: no map key or region.map edit.
13. Pass: the geometry column is excluded and only name and `arrow_type` are shown (UC6, RC-FIELD).
14. Pass: no log, no undo, no "undoable".
15. Pass: the shell's lines state only the shell's consequences, and the kernel's refusal goes through RefusalBlock.
16. Pass: every new string is marked or listed at AB11 (see D4).
17. Pass: the caller check found a product caller for every new export and prop.
18. Pass: no path parsing and no platform read.
19. Pass: no performance claim.
20. Pass: no quote marked verbatim.
21. Pass: every new `it` has its recorded mutation.
22. Pass: every OPEN item was ruled before its code.
23. Pass: e2e edits are limited to command-bar.mjs and its README entry; no walkthrough row or result log was edited.
24. Pass: case-insensitive substring match, no fuzzy matcher.
25. Pass: `commitFilterChange` (App.tsx:1003) is the single enqueue site, called only as `applyFilterWith`'s commit (RC3-b, RC5-b, RC16).
26. Pass: `filter.clauseNotSent` is recorded only on `refuse` (RC7).

## What I checked, with the evidence

Every command ran in the foreground with a timeout of at least 300 s. The check commands wrote their output to my scratch folder and printed `$?`. A few read-only `grep`, `sed` and `git show` reads printed straight to the transcript.

1. **The diff.**
   - `git fetch origin` rc=0. origin/main is d2045496 and the merge base is 19eacc52.
   - `git diff origin/main...HEAD`: 2,291 lines, rc=0. `--name-only` gives 23 files, rc=0. `git ls-files --eol` shows every file LF.
   - I read the whole diff against §2 to §8 and Amendments 1 to 10.
   - App.tsx was read at the head: lines 340-391 (`applyFilter` is unchanged) and 1015-1080.
   - The caller grep found a product caller for each of the 42 new exports and props.
2. **The mutations.**
   - My own worktree was C:/dev/wt/rv234g1. `npm ci` for the shell and bundle-viewer ran in a shared hold, rc=0.
   - The driver ran inside a shared hold and exited rc=0. It made all 27 recorded mutations, each at its OBSERVED AT commit:
     - at 9a9d1849: UC3, UC4, UC5, UC7, UC7 (resource.admitted), UA4 again;
     - at 5aa84a3f: UC6 quote, UC6 trigger;
     - at ca98a85d: UC1 B, UC2 B, UC8 twelve ids;
     - at 174dfced: UC6 quote and trigger again, RC3-a, RC3-b, RC4, RC5-a, RC5-b, RC6, RC7-a, RC7-b, RC11, RC12, RC14, RC16, RC-FIELD;
     - at 5bb3c30c: RC-BUSY.
   - Before any mutation, each (commit, test file) pair passed unmutated, 9 baselines, all rc=0.
   - Each mutation was one exact replacement whose text was found the expected number of times. vitest returned rc=1, with the named test failing on the recorded assertion message. Each was then reverted, rc=0, and the porcelain was clean. The final HEAD was 95bd9747, clean.
   - The RC3-b and RC5-b messages are the labelled equality assertions, as the build report's item 69 states.
   - No `verify-mutation` run was used.
3. **§7.**
   - `git diff --numstat 19eacc52...HEAD` with §7's three excludes, rc=0.
   - B-W: filterClauses.ts 123/200, viewTransitions.ts 27/60, workspaceState.ts 10/50. Group 160 of 310.
   - B-P: fieldCompletion.ts 56/80, commandDraft.ts 28/80, CommandBar.tsx **136/120**, ClauseCards.tsx 110/220, actionRegistry.ts 9/15, StudioLayout.tsx 19/40, App.tsx 72/200, surfaceRegistry.ts 11/40, styles.css 93/100, plus commandConstants.ts 3. Group 537 of 895.
   - B-T: filterClauses.test.ts 96/400, fieldCompletion.test.ts 63/120, commandDraft.test.ts 47/120, viewTransitions.test.ts 74/150, workspaceState.test.ts 17/40, App.command.test.tsx 247/600, plus actionRegistry.test.ts 6. Group 550 of 1,430.
   - B-E: command-bar.mjs 270/420. Group 270 of 500.
   - Total 1,517. Outside the count: walkthrough 43/130, README 4/40.
   - This matches Amendment 10 items 1 and 2. CommandBar.tsx is 107 insertions plus 29 deletions; the overrun is recorded as class 8, and §7's line is not edited.
4. **`npm run verify`** at 95bd9747 in my worktree, inside a shared hold: rc=0.
   - vitest: 100 files, 1,391 tests passed.
   - residency-trace 76 passed, citation-integrity 30 passed, export-elapsed passed.
   - Porcelain clean afterwards.
5. **Governance**, at 95bd9747 (the tools at that commit), inside a shared hold:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` rc=0, 483 passed and 0 failed;
   - `verify.mjs --offline` rc=0;
   - `verify-cites.mjs` rc=0, 2,056 files;
   - `verify-quotes.mjs` rc=0, 129 checked;
   - `verify-test-claims.mjs` rc=0, 571 claims.
6. **The e2e FROM texts.** A script read all 16 mutation rows in the header, PR A's 8 and PR B's 8. Each FROM text is found exactly once at 95bd9747, rc=0.
   - A first version of the script lost its backslashes in the shell and reported COUNT=0 for 15 rows. It was replaced by a version with no backslashes, whose result is the one above.
7. **Hashes**, LF bytes, by script, rc=0.
   - Amendment 9: every new pin at d7dfb18e and every old pin at its own rev match their hashes, 51 in all.
   - Item 5's two "changed" old spans hash to 80fbe985… at ceff6d82 and b88b1d2f, not to the new hash, which is consistent with "changed".
   - Amendment 10: the e2e record's hash 89512292… equals the whole file at d2045496 (see D6).

**The e2e evidence** is the custodian's record, read and not re-run:
- H3 held at 4b9f7c89.
- Between 4b9f7c89 and 95bd9747 only `e2e/command-bar.mjs` changed, and no other suite imports it.
- No exe source changed between be6aa620 and 95bd9747: the diff holds only two .md files.

**Clean-up:** C:/dev/wt/mm3b was never written; its porcelain was empty at the start and at the end. C:/dev/wt/rv234g1 was removed with `git worktree remove --force`, rc=0.
