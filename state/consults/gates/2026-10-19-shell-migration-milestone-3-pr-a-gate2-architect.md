Reviewed: PR #233 at 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2 (base 564aadae; gate 2, architect, scoped to round 1)
Verdict: FAIL
Branch: cut/shell-migration-milestone-3-pr-a @ 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2

The verdict is FAIL because of two Correctness findings and one Evidence finding. All three come from round 1's own diff, and all three are small to fix.

**What I could not run.** I have no shell, so none of these ran:
- `git fetch`, `gh pr view 233` and `git diff 7e4ea32a..621cd1f3`;
- the tests and the verify scripts;
- a recomputation of the sha256 that Amendment 6 gives for its e2e record.

I read the head's files in C:/dev/wt/mm3a and took the brief's word that the worktree is at 621cd1f3 and clean. I read the form, Amendment 6 included, on main. The behaviour below comes from reading the code; nothing was executed. I did not run the tests I propose under C1 and C2.

## Correctness (blocks)

**C1. The reviewer's gate 1 C1 fix misses the region's splitter (the gap the round 1 report names).**
- frontends/shell/src/layout/StudioLayout.tsx:176 forgets the held element only when the region `contains` it. The splitter sits outside the region but carries `hidden` with it: its id is checked at StudioLayout.tsx:173, it is focusable at regionParts.tsx:148, and it gets `hidden` at regionParts.tsx:156.
- Ordinary keyboard use reaches it: Tab to the Inspector's splitter, press Ctrl+K, type `/inspector`, press Enter.
- `leaveBar` (StudioLayout.tsx:206-210) runs before the toggle commits, so it focuses the splitter. The commit then hides the splitter, and the focus ends up on neither the map nor any visible control.
- Escape from the same held element would go to the map, because `closest("[hidden]")` matches the element itself after the commit. So the run path does not "return focus as Escape does" (§2.3, Running), and the doc comment at :205 is untrue on this path.

**C2. Round 1's fix also breaks the Escape rule when a region is closed and opened again.**
- StudioLayout.tsx:176 also clears the held element when the region is closed by a chord pressed in the bar.
- The steps: focus in the Filter input, then Ctrl+K, Ctrl+I, Ctrl+I, Escape. Focus now goes to the map, though the input is visible again.
- §2.3's Escape rule sends focus to the map only if the element "is gone or inside a closed region". OPEN-1's ruled point is that Escape "returns focus to where it came from".
- At 7e4ea32a this sequence returned the focus to the input, so round 1 introduced the regression. No test covers it: RC10's third case (App.command.test.tsx:329-334) closes the region once and never reopens it.

**Fix for C1 and C2.** Run the action and commit it before leaving, and take the clearing back out:
- In CommandBar.tsx:108, replace `const outcome = run(id);` with `const outcome = flushSync(() => run(id));`, and add `import { flushSync } from "react-dom";`. `flushSync` returns its callback's value.
- Delete StudioLayout.tsx:175-176.
- `leaveBar`'s check after the commit then covers both cases: a hidden splitter matches `closest("[hidden]")` on itself, and a reopened field is visible again.
- Add RC10 case c to App.command.test.tsx: focus `#splitter-inspector`, then Ctrl+K, then `runBar("/inspector")`. The focus must be on `#region-map`.
- Add RC10 case d: focus `.filter-predicate`, then Ctrl+K, Ctrl+I in the bar, Ctrl+I in the bar, Escape. The focus must be back on the field.
- Mutations: (c) replace `flushSync(() => run(id))` with `run(id)`; it should fail on case c and on case b. (d) put line 176 back; it should fail on case d. Each must be observed (§4).
- §7 room: StudioLayout drops to about 85 of 90, and App.command.test.tsx rises to about 460 of 500.
- Any other fix that passes cases b, c and d is acceptable.

## Evidence (blocks)

**E1. The `elementFromPoint` assertion has still never been seen to fail (check 5).**
- E-SEARCH-b was run, and its record is right: a wrong prediction is a result, class 2 (Amendment 6 item 4).
- The run shows that under the mutation the assertion at frontends/shell/e2e/command-bar.mjs:170 passed. The failure came from :171, and the round 1 e2e record's line 51 gives the failing line.
- Amendment 3 item 2, C6, added this assertion to prove its "Why it is not clipped" claim, and declared its own mutation for it. That mutation exercises the next assertion instead.
- So §4's "every mutation is observed" holds for E-SEARCH-b, but the assertion has no observed failure, which is §8 item 21.
- **Fix:** add E-SEARCH-c to the header, a mutation that matches C6's named risk, an ancestor transform. In frontends/shell/src/styles.css, replace `.top-bar {\n  grid-area: top;` (found once, at :57-58) with `.top-bar {\n  transform: translateZ(0);\n  grid-area: top;`.
  - The expected failure, a prediction until it is observed: step E-SEARCH fails with "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option".
  - The custodian runs it alone at the fixed head and records its failing line.
  - If the transform does not clip the list, the fallback is `z-index: 900;` → `z-index: -1;`, found once in that file.

## Documentation (fix before the merge; no re-gate)

None of these sentences is the human's wording. The worker applies the words, and the PR body lists them.

**D1. frontends/shell/e2e/command-bar.mjs:12 is now untrue.** It says each mutation ran at 7e4ea32a. E-SEARCH-b never ran there, and E-BARFOCUS's anchor changed after that run.
- Replace from "the custodian ran each alone at" through "-e2e-custodian-runs.md)" with: `the custodian ran each alone and recorded its failing line with the commit it ran at (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md, and <the record of E-SEARCH-c's run>)`
- Clause check:
  - "each ran alone": the round 1 record, lines 17-23, has seven mutation runs at 621cd1f3, each with rc=1 and reverted clean.
  - "its failing line": that record, lines 36-77.
  - E-SEARCH-c's run: true once E1 is run.

**D2. frontends/shell/e2e/command-bar.mjs:18, E-SEARCH-b's expected line, is now falsified.**
- Replace from "Expected, a prediction" to the end of the line with: `Predicted: step E-SEARCH fails on its elementFromPoint line. Observed at 621cd1f3: step E-SEARCH fails, "E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)", the next assertion (class 2, the form's Amendment 6 item 4); the elementFromPoint line is E-SEARCH-c's.`
- Clause check: the round 1 record, line 51, and the order of command-bar.mjs:170-171.

**D3. frontends/shell/e2e/README.md:817's last sentence has the same defect as D1.**
- Replace with: "Each step's mutation is in the file's header, with the exact text it replaces; the custodian's runs of them, each with its commit and failing line, are recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md and <the record of E-SEARCH-c's run>."
- Same clause check as D1.

**D4. §4's E-BARFOCUS row needs the class 3 reading that gate 1 C1 asked for.** Amendment 6 does not carry it.
- The custodian appends it in the next amendment: "§4's E-BARFOCUS row reads: With no list open and no single candidate, Tab leaves the bar; Escape returns focus to the element held before."
- Clause check: commandDraft.ts:107-110. With no candidate, or with the list closed and two or more candidates, the reducer returns `none`, so Tab is not intercepted. With the list closed and exactly one candidate, it completes.

**D5. Two references in Amendment 6 need fixing; the correction goes in the next amendment, by reference, because Amendment 6 is append-only.**
- Item 2's "the round 0 report" names no path. It is state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md, whose Differences item 1 is at :114.
- Item 4's "at the head" should be 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2.
- The preamble's sha256 of the e2e record carries no `@ <rev>`. Name the main commit that added the record.

**Note for PR B, not blocking here.** After a completion, ArrowDown reopens the list (commandDraft.ts:117-119), but §2.3 says it "stays closed until the next typed character".
- PR A cannot reach this. Every PR A completion is an exact word whose entry takes "nothing", so `resolveDraft` gives `run` with no candidates, and ArrowDown does nothing.
- PR B's `/filter` reaches it.

## Checks

**1. Gate 1 findings at the head.**

| Finding | Status | Where |
|---|---|---|
| A C1 | resolved | commandDraft.ts:61-66, :90-91, :107-111; doc comment :94-99 |
| A C2 | resolved | CommandBar.tsx:27; the clause check still holds, via commandDraft.ts:117-119 and :113-114 |
| A E1 | run and recorded, but the assertion it was for is still unobserved | new E1 |
| A E2 | resolved; matches my words byte for byte | App.command.test.tsx:237 |
| A D1 | applied, now stale | new D1 |
| A D2 | applied, now stale | new D3 |
| A D3 | resolved | README.md:815 |
| A D4 | resolved, by the comment form; true against actionRegistry.ts:59-61 and :67 | actionRegistry.test.ts:49 |
| A D5 | resolved; matches my words byte for byte | Amendment 6 item 1 |
| A D6 | not verified; I could not read the PR body | — |
| R C1 | resolved for a field inside the region; RC10 case b is at App.command.test.tsx:337-349, its mutation observed at 31ae009b | the splitter and the reopen case are new C1 and C2 |
| R E1 | as A E1 | — |
| R D1 | resolved | styles.css:1187-1188, CommandBar.tsx:16 |
| R D2 | applied | :6 holds; :12 and README:817 are new D1 and D3 |
| R D3 | resolved | Amendment 6 items 1-3 |

R D3 asked for class 1; Amendment 6 records the three items as class 3. Each is a reading of built behaviour, and I accept that.

**2. Tab against OPEN-1's ruled point** (state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md:651, quoted at gate 1).
- Tab completes the active option of an open list, or else the only candidate whether the list is open or not (:108). It never applies, because the effect is `none` (:111).
- After a completion, `completed` makes the next Tab leave (:107). `completed` is cleared only by `typeDraft` (:91), which matches §2.3's "until the next typed character".
- In PR A the completed draft is always an exact `run` word with zero candidates, so a second Tab also leaves because there is nothing to complete.
- UC2 asserts the closed-list, one-candidate case and the several-candidates case (commandDraft.test.ts:118-126), with three observed mutations (:75-82).
- `completed` has a product caller: CommandBar.tsx:117 passes it into the reducer.
- Verdict: held.

**3. The reviewer's C1 fix against §2.3:** fails, as C1 (the splitter) and C2 (Escape after a close and reopen).

**4. Amendment 6 items 1-4 against the reports.**
- Item 1 matches gate 1's D5.
- Item 2 matches the round 0 report's Differences item 1 and the `Draft` type (commandDraft.ts:18-24). Its reference is fixed under D5.
- Item 3 matches the round 1 report's findings 1 and the UC2 mutation lines at commandDraft.test.ts:80-82.
- Item 4 matches the round 1 e2e record, lines 19, 32 and 51.
- None claims more than its source.

**5. E-SEARCH-b:** §4 is met for that mutation, but not for the `elementFromPoint` assertion, which needs its own mutation (E1).

Files read:
- C:/dev/spatial-ide/state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-19-shell-migration-milestone-3-pr-a-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-1-e2e-custodian-runs.md
- C:/dev/spatial-ide/state/consults/2026-10-19-shell-migration-milestone-3-pr-a-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-3-architect-draft.md
- C:/dev/spatial-ide/state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
- C:/dev/wt/mm3a/frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md
- C:/dev/wt/mm3a/frontends/shell/src/command/commandDraft.ts
- C:/dev/wt/mm3a/frontends/shell/src/command/commandDraft.test.ts
- C:/dev/wt/mm3a/frontends/shell/src/command/CommandBar.tsx
- C:/dev/wt/mm3a/frontends/shell/src/layout/StudioLayout.tsx
- C:/dev/wt/mm3a/frontends/shell/src/layout/regionParts.tsx
- C:/dev/wt/mm3a/frontends/shell/src/layout/actionRegistry.ts
- C:/dev/wt/mm3a/frontends/shell/src/layout/actionRegistry.test.ts
- C:/dev/wt/mm3a/frontends/shell/src/App.command.test.tsx
- C:/dev/wt/mm3a/frontends/shell/src/styles.css
- C:/dev/wt/mm3a/frontends/shell/e2e/command-bar.mjs
- C:/dev/wt/mm3a/frontends/shell/e2e/README.md
