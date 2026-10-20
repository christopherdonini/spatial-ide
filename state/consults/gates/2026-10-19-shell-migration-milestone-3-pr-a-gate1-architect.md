Reviewed: PR #233 at 7e4ea32a0ccef474b8b05ed582271a4baa24101f (base 564aadae; gate 1, architect)
Verdict: FAIL
Branch: cut/shell-migration-milestone-3-pr-a @ 7e4ea32a0ccef474b8b05ed582271a4baa24101f

The verdict is FAIL because of two Correctness findings and two Evidence findings. All four are small to fix.

**What I could not run.** I have no shell, so I did not run `git fetch`, `gh pr view 233`, `git diff 564aadae...7e4ea32a`, the numstat, the tests or the verify scripts. I did not confirm the worktree's HEAD myself.
- I read the head's files in C:/dev/wt/mm3a, taking the brief's word that it is at 7e4ea32a and clean.
- I read main's copies of StudioLayout.tsx and of the form. Main's form adds Amendment 5, which the branch does not carry; that is expected, since it was committed after the cut.
- I read the worker's transcript at <the session's transcript folder>/subagents/agent-a1f206d8370278add.jsonl, lines 446-451.
- §7's figures and §8 item 1's file list rest on the worker's numstat and on reading the files, not on a diff I ran.

## Correctness (blocks)

**C1. Tab with the list closed: worker's difference 2 is a defect against the human's ruling.**
- The human ruled OPEN-1 as `   OPEN-1: package (A), all eight points as listed.` (state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:19). The listed point is `  - Tab completes an active option, or the only candidate, and never applies, so a second Tab always leaves;` (state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md:651). Both are byte-copied.
- §2.3 (form :177) puts "when the list is open" on the first case only: "or when exactly one candidate exists" stands on its own.
- The code at frontends/shell/src/command/commandDraft.ts:103 (`if (key.shiftKey || !state.open || count === 0) return none;`) never completes with the list closed. Ordinary use reaches this: type `/lay`, press Escape or Enter, then Tab. Focus leaves the bar where the ruling says Tab completes `/layers`.
- The worker's reason does not hold. E-BARFOCUS's step starts from an empty bar, which has no candidate, and "a second Tab always leaves" can be kept with a flag set after a completion (§2.3: "the list stays closed until the next typed character").
- **Fix.**
  - Add a `completed` member to `BarPos`, set by Tab's completion and cleared by `typeDraft`.
  - Tab completes the only candidate whether or not the list is open, and is not intercepted while `completed` is set.
  - UC2's grid gains the closed-list, one-candidate state.
  - UC2's mutation is observed again.
  - Update the doc comment at commandDraft.ts:91-95.
- E-BARFOCUS's sentence then reads, as a class 3 reading: "with no list open and no single candidate".
- The other route is that the human accepts the narrower rule in typed words. OPEN-1 is a red line, so that is the human's call.

**C2. A note in the app tells the operator to do something the code does not do.**
- frontends/shell/src/command/CommandBar.tsx:28: `[P6 placeholder] Choose a command with the arrow keys, or press Tab to complete its name.`
- It is shown after Enter on a draft that lists candidates, and that same Enter closes the list (CommandBar.tsx:126-131).
- The next Tab then leaves the bar (commandDraft.ts:103). With two or more candidates and none active, it leaves under C1's fix too.
- Ordinary use reaches it: type `/zoom`, Enter, Tab.
- **Fix.** Placeholder words, still P6 and still sighted at AB11: `[P6 placeholder] Choose a command with the arrow keys, then press Enter.`
- **Clause check.**
  - "the arrow keys": ArrowDown opens the list on the first option when there is at least one candidate (commandDraft.ts:113-115).
  - "then press Enter": Enter applies the active option (commandDraft.ts:110, CommandBar.tsx:123-125).
- This is not the human's wording; it is a worker placeholder.

## Evidence (blocks)

**E1. The declared mutation E-SEARCH-b was never observed.**
- Amendment 3 item 2, C6 (form :642) adds the `elementFromPoint` assertion with the mutation "draw `.command-list` in normal flow; it fails on `elementFromPoint`".
- The assertion is at frontends/shell/e2e/command-bar.mjs:161-170.
- The mutation is not in the suite's header, the worker's report or the custodian's run record. Nothing under state/ names it. That is §8 item 21.
- **Fix.**
  - Write the mutation into the header: in frontends/shell/src/styles.css, in the `.command-list, .command-note` rule, replace `position: fixed;` with `position: static;`.
  - The expected failure, a prediction until it is observed: "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option".
  - The custodian runs it at the fixed head and records it beside the six.

**E2. RC2's recorded-mutation comment names a mutation that was not the one run.**
- frontends/shell/src/App.command.test.tsx:237 says the mutation was in `runAction`'s toggle arm. That edit would also stop the toggle buttons recording, so the test would fail at :248, which has no message. It could not fail with the recorded "/layers: the same row".
- The transcript (tool call toolu_01YEHeNmSHkQiaczgepYiWU3, file mm3a-mut-rc2.json) shows what actually ran: `run={runAction}` replaced by a copy for the bar only. That matches the form's RC2 mutation and the recorded failure.
- The observation exists. Only the comment is wrong, so no new run is needed.
- **Fix.** Replace the first line of the comment with: `// RECORDED MUTATION for "RC2": in StudioLayout.tsx pass CommandBar a copy of runAction whose toggle arm dispatches without apply (replace run={runAction} with run={(id) => { const region = TOGGLE_REGION[id]; if (region !== undefined) { dispatch({ kind: "toggle", region }); return "done"; } return runAction(id); }}), so the bar's path records no row and the buttons' path still does. Expected failure: the row assertion.`
- **Clause check:** the transcript's mutation file and its result line `AssertionError: /layers: the same row: expected [] to deeply equal [ 'layout.toggleLayers' ]`.

## Documentation (must be fixed in this PR before the merge; no re-gate)

None of D1 to D6 is the human's wording, so the worker applies them and the PR body lists them.

**D1. The suite header says the e2e mutations were never run.**
- frontends/shell/e2e/command-bar.mjs:12-13 says "WRITTEN DOWN AND NOT RUN" and attributes that to section 4. §4 (form :361-364) says every mutation is observed, and the custodian ran all six.
- Replace those two lines with: `// MUTATIONS (section 4: every mutation is observed). Each replaces one exact text, found exactly once at the head that adds this file; the custodian applied each alone at 7e4ea32a, ran this suite, recorded its failure by name and reverted it (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md):`
- Clause check: that record, lines 38-43 (rc=1, reverted-clean-at=7e4ea32a) and lines 74-110 (the failing lines). Add E-SEARCH-b's row once E1 is observed.

**D2. The README repeats the same stale claim.**
- frontends/shell/e2e/README.md:817 ends "those are written down and not run".
- Replace with: "the custodian ran each at 7e4ea32a and each failed by its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md)."
- Same clause check as D1.

**D3. The README points at walkthrough rows that do not exist.**
- frontends/shell/e2e/README.md:815's last sentence, "Those are rows of the walkthrough's Part for this milestone", names rows that are not there. Part AB is not committed, and no row of §2.10 presses a bare `/`.
- Replace with: "Row AB1 of the walkthrough's Part AB is the real-key check for Ctrl+K (H2); no row checks a real `/`."
- Clause check: §2.10's Y1 is AB1 by Amendment 3 item 10, and its keys are Ctrl+K, `/open`, Enter (form :323). None of Y0 to Y12 presses a bare `/`.
- For the custodian: Amendment 1 item 9's "H2 covers whether `/` reaches the page" has no row that does it. When Part AB is written, AB1 should gain a bare `/`, as class 9.

**D4. A test name now miscounts the chords.**
- The test name at frontends/shell/src/layout/actionRegistry.test.ts:49, "a letter outside the three", is no longer accurate: there are four chords.
- If no record cites the name, rename it to "a letter no chord holds matches nothing".
- Otherwise add the comment `// Milestone 3: four chords (B, I, J, K); x is a letter no chord holds.`
- Clause check: actionRegistry.ts:59-61 and :67.

**D5. Difference 4 needs a class 3 row in the form.**
- §2.2's third availability bullet (form :156) is not met, and Amendment 3's index of replaced passages does not list it.
- The custodian appends: "§2.2's third availability bullet reads: `dataset.open` is available whenever App passes its handler; while an open is in flight it is listed as available, and running it starts nothing and shows the busy line, because `requestPick()` answers busy on the Open button's own condition (Amendment 3 item 11; RC8)."
- Clause check: StudioLayout.tsx:193-194, AdmissionPanel.tsx:316, CommandBar.tsx:110, App.command.test.tsx:262-274.

**D6. The PR body, which I could not read.**
- It must name `filter.addClause` (PR B) as the consumer of `takes: "condition"`. That is the round 8 exemption: commandDraft.ts:45 reads `takes`, and no entry in PR A uses "condition".
- It must list for the AB11 sight the unmarked registry labels and words (worker's difference 9) and the nine CommandBar strings.

## Checks

**1. §8 at the head.**
- Items 1-4: held, from the files the worker listed and from reading them. Nothing under skp/, streaming/, residency/ or canvas/ is touched, and applyFilter's code is unchanged.
- Items 5-7, 13 and 25-26: PR B's.
- Item 8: held. The bar, the chords, the toggle buttons and the Layers row all call the one `runAction` (StudioLayout.tsx:211-229, :320, :332).
- Item 9: held (RC9, E-REVEAL).
- Item 10: held, but see C1.
- Item 11: held. The list exists only while open, and the note goes on blur.
- Item 12: held (RC1, E-CTRLK).
- Item 14: held.
- Item 15: held. COMMAND_BUSY_NOTE matches `isOpenInFlight` (AdmissionPanel.tsx:124-126).
- Item 16: see D6.
- Item 17: held. Every new prop and handle has a product caller in App (App.tsx:1932-1936, :1945, :2326). `takes` is under D6.
- Item 18: held. The bar receives the platform as a prop.
- Items 19, 20, 22, 23 and 24: held.
- Item 21: fails for E-SEARCH-b, and RC2's record is wrong (E1, E2).
- §7: the worker's figures are A-P 578, A-T 624 and A-E 354. No file is over its ceiling and there is no class 8. I did not recount.

**2. Seams.**
- Seam 1, the registry: held. Entries gain `command` and `takes`, `matchChord` is unchanged, and the third matcher is pure.
- Seam 2, the draft: stays narrow, with no parser and no SKP shape.
- UC9 holds: src/command/ imports only ../layout/actionRegistry.
- The two handles match §2.7: `requestPick(): "started" | "busy"` and `reveal(): void`. Each is proven from its real shape through the real App (RC8 including case b, RC9) and on WebView2 (E-REVEAL).

**3. The worker's ten differences.**
- 1: within the form, class 3; see D6.
- 2: defect (C1).
- 3: within. The worst-case UC2 grid is a fair strengthening; PR B's `/filter` reaches that state.
- 4: within, by Amendment 3 item 11, RC8, and §2.9's "the handles only", which leaves no way to read the in-flight state. Needs D5.
- 5: within, but it is what makes C2 reachable.
- 6: within. It changes no behaviour; checked against main's listener, StudioLayout.tsx:176-183.
- 7 and 8: within.
- 9: within, if D6 is done.
- 10: within.

**4. Amendment 3's class 1 items as built.**
- The bar's place, the fixed list and the `--top-bar-h` top: held, and E-SEARCH passed. Its mutation is missing (E1).
- One dispatch: held, and RC17 passed with both mutations observed.
- The third matcher: held. UC10 and RC-SLASH passed with their mutations observed, and so did E-SLASH.
- The harness with `recordStep`: held.
- `/open` during the picker or the ask: held (RC8 case b, mutation observed).
- H3: held. Every suite passed at the head except S5d alone on the post route.

**5. Strings.** CommandBar's nine are marked; the registry's labels and words are listed (D6). One string is untrue (C2).

**6. Accessibility and portability.**
- Held:
  - the combobox has its roles and states, and `aria-activedescendant` is tested (RC13);
  - the note is a `role="status"`;
  - the focus goes back to the element held before, or to the map when that element is gone or hidden (StudioLayout.tsx:204-208);
  - Meta on macOS is unit-tested (UC8);
  - composing keys are ignored;
  - there is no OS-conditional code.
- Notes, not blocking:
  - the listbox has no accessible name of its own;
  - `aria-controls` names an element that is absent while the list is closed, which §2.3's "nothing rendered while closed" accepts;
  - the screen-reader checks stay deferred to L2 (§2.11).

Files read, all absolute:
- C:/dev/wt/mm3a/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md (Amendment 5)
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-re-sweep-2-custodian.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md
- C:/dev/wt/mm3a/frontends/shell/src/command/commandDraft.ts
- C:/dev/wt/mm3a/frontends/shell/src/command/CommandBar.tsx
- C:/dev/wt/mm3a/frontends/shell/src/command/commandConstants.ts
- C:/dev/wt/mm3a/frontends/shell/src/command/commandDraft.test.ts
- C:/dev/wt/mm3a/frontends/shell/src/command/commandBoundary.test.ts
- C:/dev/wt/mm3a/frontends/shell/src/layout/actionRegistry.ts
- C:/dev/wt/mm3a/frontends/shell/src/layout/actionRegistry.test.ts
- C:/dev/wt/mm3a/frontends/shell/src/layout/StudioLayout.tsx
- C:/dev/wt/mm3a/frontends/shell/src/App.tsx
- C:/dev/wt/mm3a/frontends/shell/src/App.command.test.tsx
- C:/dev/wt/mm3a/frontends/shell/src/admission/AdmissionPanel.tsx
- C:/dev/wt/mm3a/frontends/shell/src/publish/PublishPanel.tsx
- C:/dev/wt/mm3a/frontends/shell/src/styles.css
- C:/dev/wt/mm3a/frontends/shell/e2e/command-bar.mjs
- C:/dev/wt/mm3a/frontends/shell/e2e/README.md
- C:/dev/wt/mm3a/frontends/shell/package.json
