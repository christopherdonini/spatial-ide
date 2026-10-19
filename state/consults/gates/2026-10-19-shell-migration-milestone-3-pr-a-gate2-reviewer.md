Reviewed: PR #233 at 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2 (base 564aadae; gate 2, reviewer, scoped to round 1)
Branch and commit: cut/shell-migration-milestone-3-pr-a @ 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2
Verdict: FAIL

The gate fails on one Correctness finding. Round 1 fixed the Filter-input case of my gate 1 C1, but the same rule still breaks on two paths that ordinary keys reach: one the fix left open, one the fix itself introduced. Everything else in the round holds:
- All four recorded unit and render mutations reproduce by name.
- The e2e record matches its artifacts exactly.
- All seven anchors are found once at the head and match the header.
- §7 is within every ceiling, and every check passes.
- Every word from gate 1 landed byte for byte.

Line numbers below are in the files at 621cd1f3.

## Correctness (blocks)

**C1. When the bar runs a toggle, the focus still ends up away from where the §2.3 rule puts it. The fix decides at toggle time, before the commit.**

The rule is SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md §2.3: under Escape, the element held before, unless it is "gone or inside a closed region"; under Running, focus returns "as Escape does". Round 1's fix is the line at frontends/shell/src/layout/StudioLayout.tsx:176. It clears `heldRef` at toggle time, before the commit, and only when the region element contains the held element. That leaves two failures:

- **(a) The splitter is missed.** A region's splitter is outside the region but hidden with it (StudioLayout.tsx:73, :296). `apply`'s own `holdsFocus` counts it (StudioLayout.tsx:173); line 176 does not. So `leaveBar` (StudioLayout.tsx:206-210) focuses the splitter before the commit hides it.
  - Ordinary use reaches this. Drag the Inspector splitter with the mouse (pressing on it focuses it: `tabIndex={0}`, regionParts.tsx:148), or Tab to it. Then press Ctrl+K, type `/inspector` and press Enter.
  - The worker's round 1 report discloses it under its Differences.
  - Probe, in a temporary copy of App.command.test.tsx in my gate worktree: vitest rc=1. It logged `PROBE SPLITTER inspector hidden: true active: DIV splitter-inspector active hidden: true closest hidden: true`, and the assertion read `AssertionError: expected <div id="splitter-inspector" …(10)></div> to be <main id="region-map" …(3)>…(1)</main> // Object.is equality`.
  - jsdom leaves the focus on the hidden splitter. In WebView2 a focused element that is hidden loses the focus to the body. I did not observe that, because the app was not launched. Either way the focus is not on the map.
- **(b) A regression from round 1.** Close and reopen the region while the bar holds the focus, then press Escape. The focus now goes to the map, not to the held field. The field is visible again in an open region, so the rule says it should get the focus back.
  - Ordinary keys reach this: focus in the Filter input, Ctrl+K, Ctrl+I, Ctrl+I, Escape.
  - Probe at the head: rc=1. It logged `PROBE TWICE active: MAIN region-map region-map field hidden-ancestor: false`.
  - The same probe with 7e4ea32a's StudioLayout.tsx: rc=0, logging `PROBE TWICE active: INPUT  filter-predicate field hidden-ancestor: false`.
- **The C1 probe from gate 1 passes now.** Filter input, Ctrl+K, `/inspector`, Enter: rc=0, `PROBE C1 inspector hidden: true active: MAIN region-map region-map`. The Escape path from the splitter (Ctrl+K, Ctrl+I, Escape) also passes, because it runs after the commit.

**Fix (verified in my gate worktree, then reverted):**
- Remove StudioLayout.tsx:175-176.
- In CommandBar.tsx `applyEntry`, replace `const outcome = run(id);` with `const outcome = flushSync(() => run(id));`, and add `import { flushSync } from "react-dom";`.
- `leave()` then reads the committed DOM, and `leaveBar`'s existing `closest("[hidden]")` handles all three cases. The splitter carries `hidden` itself, and `closest` matches the element itself.
- Result with the change: all four probes and the 83 tests passed (vitest rc=0, 9 files, 98 tests), and `tsc --noEmit` rc=0. commandBoundary (UC9) passes with the react-dom import.
- §7 under this change: StudioLayout.tsx goes from 87 to 85 of 90, and CommandBar.tsx from 193 to about 195 of 300.

**Other route, not enough on its own.** Extend line 176 with `|| heldRef.current.id === splitterId(action.region)`. I verified it fixes (a) (rc=0) and keeps every line count unchanged. It leaves (b).

**Tests to add:**
- RC10 case c: the splitter path, the focus on `#region-map`.
- RC10 case d: Ctrl+K from the Filter input, Ctrl+I twice, Escape, the focus back on the field.
- Each with its recorded mutation, observed (§4). For the flushSync route, the mutation is to drop `flushSync`.
- RC10 case b's recorded-mutation comment (App.command.test.tsx:337-339) is rewritten for the new mechanism.
- The custodian re-runs command-bar and layout at the new head, since both files touch the focus path.

## Evidence

No blocking finding. One note, not blocking:

- **E-SEARCH-b never exercised the `elementFromPoint` assertion.** The hit check (e2e/command-bar.mjs:170) runs before the top check (:171). The mutation's run failed on the top check, so under the mutation the hit check passed (the run's FAIL line is byte-copied in the round 1 e2e record).
- So the `elementFromPoint` assertion still has no observed failing mutation.
- Amendment 6 item 4 records the wrong prediction as class 2, which is honest.
- If the form's Amendment 3 item 2 intent is to be met, a mutation that defeats only hit-testing would do it, for example `pointer-events: none;` added to the `.command-list, .command-note` rule. That is the custodian's call.

## Documentation (must be fixed before the merge; no re-gate)

None of these sentences is the human's wording. The worker applies the words and the PR body lists them. Each set of words is checked against the head.

**D1. The header's MUTATIONS sentence is now wrong about where and when the mutations ran.** e2e/command-bar.mjs:12 says the custodian ran each mutation at 7e4ea32a, each anchor found at the head that adds the file. E-SEARCH-b was first run at 621cd1f3, and E-SEARCH-b's and E-BARFOCUS's anchors exist only from 621cd1f3.
- Words for line 12, through "observed:": `// MUTATIONS (section 4: every mutation is observed). Written down by the worker. Each is a replacement of one exact text, found exactly once at 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2, and each is to be reverted after it is observed. The custodian ran each alone at that head and each failed its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md); the six other than E-SEARCH-b were also run at 7e4ea32a0ccef474b8b05ed582271a4baa24101f, E-BARFOCUS on its earlier anchor (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md):`
- Clause check:
  - "found exactly once at 621cd1f3": my check 3, all seven at count 1.
  - "each failed its named step": all seven runs are rc=1, and their FAIL lines equal the record. E-BARFOCUS also fails E-CTRLK, and E-REVEAL also fails E-SLASH, as the header predicts.
  - "six … at 7e4ea32a": the gate 1 record, re-derived at gate 1.

**D2. E-SEARCH-b's "Expected" line still holds only the failed prediction.** e2e/command-bar.mjs:18, from "Expected, a prediction" to the end.
- Words: `Predicted: step E-SEARCH fails on its elementFromPoint assertion. Observed at 621cd1f3 (the round 1 record): step E-SEARCH fails, "E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)"; the elementFromPoint assertion, checked first, passed under it.`
- Clause check:
  - The quoted line is byte-equal to mut-E-SEARCH-b.suite.log's FAIL line and to the record.
  - "checked first": command-bar.mjs:170 runs before :171.

**D3. README's session-state sentence has the same staleness.** e2e/README.md:817, the last sentence.
- Words: `Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 621cd1f3 (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md), and all but E-SEARCH-b at 7e4ea32a before it (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md).`
- Clause check: as D1.

**D4. E-BARFOCUS's wording is too broad since round 1.** With no list open and one candidate, Tab now completes instead of leaving (commandDraft.ts:223-228, the human's OPEN-1 point). The step itself runs from an empty bar.
- e2e/README.md:813, the clause "Tab and Shift+Tab leave in one press with no list open": replace with `from an empty bar with no list open, Tab and Shift+Tab leave in one press`.
- Clause check: `resetBar` fills the bar with "" (command-bar.mjs:78), then Ctrl+K and Tab (:215-216), then Ctrl+K and Shift+Tab (:219-221).
- The form's §4 E-BARFOCUS row still reads "With no list open, Tab leaves the bar". The architect's gate 1 C1 asked for a class 3 reading, and Amendment 6 does not carry it. The custodian appends: `E-BARFOCUS's row (A's C1, class 3) reads: with no list open and no single candidate, Tab leaves the bar; the step runs from an empty bar.`

**D5. The PR body is stale after round 1.**
- "with Amendments 1 to 5" becomes "with Amendments 1 to 6 (5 and 6 on main)".
- The §7 bullet becomes: "1,592 lines at 621cd1f3 against 564aadae. A-P is 582 of 902, A-T 655 of 1,080 and A-E 355 of 460; every file is within its own ceiling." Recount after C1's fix.
- "Among them: Tab completes only while the list is open" becomes "Among them, as built at 7e4ea32a: Tab completed only while the list was open (reversed in correction round 1)".
- Add one bullet listing the gate 1 words applied with no re-gate: reviewer D1 (the styles.css and CommandBar.tsx comments), reviewer D2 (the header's E-SLASH and MUTATIONS sentences, and the README's session-state sentence), architect D3 (the README's CDP sentence), architect D4 (the actionRegistry.test.ts comment), architect C2 (COMMAND_PICK_NOTE) and architect E2 (RC2's comment). Add these D1 to D4 when they land.

## Gate 1 findings: resolved?

Reviewer (550):
- **C1:** partly.
  - The Filter-input path is fixed. RC10 case b exists, and its mutation fails by name and passes reverted.
  - The splitter path is not fixed, and the fix regressed reopen-then-Escape. Both are this gate's C1.
- **E1:** resolved. E-SEARCH-b is written in the header, run and recorded. Amendment 6 item 4 records the wrong prediction as class 2. See the Evidence note.
- **D1:** resolved. Both texts landed byte for byte (by script).
- **D2:** applied byte for byte, but now stale (D1 and D3 above).
- **D3:** resolved by Amendment 6 items 1 to 3. Recorded as class 3 rather than the class 1 I named; acceptable, since the rows are references to the as-built.

Architect (549):
- **C1:** resolved in code.
  - UC2 has the closed-list, one-candidate state.
  - UC2's mutations (a), (b) and (c) each fail by name and pass reverted.
  - The doc comment is updated.
  - The E-BARFOCUS class 3 reading is missing (D4).
- **C2:** resolved, byte for byte.
- **E1:** resolved, as reviewer E1.
- **E2:** resolved, byte for byte.
- **D1 and D2:** superseded by reviewer D2's words, which were applied.
- **D3 and D4:** applied byte for byte. D4 took the comment form.
- **D5:** Amendment 6 item 1.
- **D6:** the PR body names `filter.addClause` and the AB11 lists.

## Commands and exit codes

**Setup and reading:**
- `git fetch origin`: 0.
- mm3a HEAD = 621cd1f3, porcelain empty.
- `sha256sum` of the round 1 e2e record: 0, giving 2773fdc5…5228, which equals Amendment 6's.
- `gh pr view 233`: 0. `gh pr view --json`: 0. The head is 621cd1f3 and the PR is a draft.
- `git diff --stat 7e4ea32a..621cd1f3` and `git diff 7e4ea32a..621cd1f3`: 0 each. 9 files, +64 and −28.

**Gate worktree:**
- `git worktree add --detach C:/dev/wt/gate233b 621cd1f3`: 0.
- Viewer `npm ci`: 0. Shell `npm ci`: 0. `node scripts/buildViewerFirst.mjs`: 0. `npm run generate:notice`: 0. 18 s in all.
- Baseline vitest (command, layout, App.command): 0. 8 files, 83 tests.

**Recorded mutations** (each applied alone: apply 0; failing run 1, by its named test; revert 0; reverted run 0; porcelain empty):
- UC2 (a), "Tab closes the list and sets completed".
- UC2 (b), "a second Tab leaves".
- UC2 (c), "Tab with the list closed completes the only candidate".
- RC10 case b, "the field's region is closed: the map region, not the field".

**Probes:**
- C1, splitter and splitter-Escape probe run: 1. C1 passed, the splitter case failed, splitter-Escape passed.
- The same, verbose: 1.
- Splitter one-line fix tried: vitest 0, `tsc` 0, then reverted.
- Reopen probe at the head: 1. With 7e4ea32a's StudioLayout.tsx: 0, then restored.
- flushSync fix tried with all probes: vitest 0 (98 tests), `tsc` 0, then reverted.
- After each probe and each tried fix, the probe file was deleted and the porcelain was empty.

**Check 3 and the anchors:**
- c3 re-derivation and anchor script: 0, "NO DIFFERENCE".
  - The runs block equals summary.txt, 13 lines.
  - command-bar, layout and regression: rc=0 with no FAIL line.
  - All seven mutation runs: rc=1 at 621cd1f3, their FAIL lines equal to the record, diff-lines 2 each.
  - No suite log contains `unknown-attempt`.
  - All seven anchors are found once at the head, and the file, from-text and to-text of each equal the header.
- Negative control (one altered character): 1.
- `git diff --name-only be6aa620 621cd1f3`: 0. No exe source differs; only two engine .md files.
- The gate 1 words byte check: 0, all nine landed.

**Check 4** (run in gate233b at the head):
- vitest: 0, 83 tests.
- `npx tsc --noEmit`: 0.
- `node --test` over the three CI globs: 0, 483 passed.
- `verify.mjs`: 0. `verify-cites.mjs`: 0. `verify-quotes.mjs`: 0. `verify-test-claims.mjs`: 0. These are the tools at 621cd1f3.
- `gh pr checks 233`: 0, all 8 pass.

**Check 5:** §7 numstat 564aadae...HEAD: 0.
- Total 1,592.
- A-P is 582 of 902. StudioLayout.tsx is 87 of 90, commandDraft.ts 128 of 220 and CommandBar.tsx 193 of 300.
- A-T is 655 of 1,080. App.command.test.tsx is 436 of 500.
- A-E is 355 of 460.
- README +14 of 40.
- No overrun.

**Teardown:**
- `git worktree remove C:/dev/wt/gate233b`: 0.
- mm3a porcelain is empty, at 621cd1f3.

**Heavy runs:** none qualified, so none was held. The longest was `node --test` at about 48 s; each vitest run took about 6 s or less.

The app was not launched. Nothing was committed or pushed, I took no PR action, and the only files I wrote were in my scratch folder and in the temporary worktree, which is now removed.
