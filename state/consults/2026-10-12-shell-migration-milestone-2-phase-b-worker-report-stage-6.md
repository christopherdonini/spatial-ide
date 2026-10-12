*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 6 of 8, branch cut/shell-migration-milestone-2-phase-b at d7f61f1c9491b2badc5f141d38e6abbb3dde070e, the run 2026-10-12T07:39:15Z to 2026-10-12T07:56:05Z by its transcript (Read 13, Bash 50); its one SubagentHandback call, at 07:56:04Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is f474c9c31ce9679fcd6b800831c408c72e678aad11a56c63267a857d92f34927.*

---

STAGE 6 of 8, phase B (scope and export), is built, verified and pushed. I ran no e2e suite. Model: Sonnet 5.5 as the harness states, no override, no context handoff.

## Head and commits
Branch cut/shell-migration-milestone-2-phase-b in C:/dev/wt/mm2b. Head d7f61f1c9491b2badc5f141d38e6abbb3dde070e = origin after a plain push (f60329ef..d7f61f1c). The start was f60329ef, with `git fetch origin` run, an empty porcelain and an unchanged origin. No merge, rebase, amend or force-push. Every commit is signed off (`-s`) and carries the Co-Authored-By trailer.
- 7b3f934e (X0): code, RB7 and RB8.
- 3dc687a1 (X): RB7-hook. Every mutation was observed at this commit.
- a94a8f19: the observed mutations recorded (comments only; I checked that every diff line is a comment).
- 7f216ada: selection.mjs E-EXPORT and E-SCOPE (written, not run).
- d7f61f1c: EXPORT_SELECTION_SENTENCE made local, because it had no importer.

The a94a8f19 body states the counts: 3 mutations applied, run and reverted at 3dc687a1, one per test, for 3 tests (RB7, RB7-hook, RB8). Failures read: 4 (RB7 and RB7-hook under RB7's mutation, RB7-hook under its own, RB8 under its own). I also applied the RB7 and RB8 mutations at 7b3f934e before RB7-hook existed. I did not record those two, and re-observed both at 3dc687a1.

Not touched: state/, PLAN.yaml, the form, src-tauri, the host, the kernel, WorkingCanvas.wiring.test.tsx, StudioLayout.test.tsx, `Slots`, and what Current view sends or when it is available.

## Changes by file (all under frontends/shell)
- src/publish/PublishPanel.tsx (47 insertions, 2 deletions; B-X ceiling 100):
  - PublishPanelProps gains `stageScope: () => ResolvedScope | null` and `checkStagedScope: (staged) => ScopeCheck`. Both are required, so no unstaged panel is possible. Only App renders the panel.
  - `stagedScopeRef` is set by `stageScope()` at the start of both `runPrepare` and `runPrepareWithDestination`, after the defensive null return and before the preparing state.
  - New `executeInStagedScope(attemptId, phrase)` is the staged-scope wrapper stage 7 reuses. It calls `checkStagedScope(stagedScopeRef.current)`. If the check fails, it returns `{status:"refused", message}` and `publishExecute` is not called. Otherwise it returns `publishExecute(...)`.
  - It is the single execute path. PublishControls gets it through a new prop, `execute`, which feeds PublishDialog's `execute` prop. `runExecute`, the `publishExecute` dev hook, goes through it too.
  - `PublishControlsProps.execute` is optional and defaults to `publishExecute`. `PublishPanel.test.ts` builds PublishControls without it, and H3 forbids editing that suite. This is the same pattern as the standing decisions.
  - `scopeChangedOutcome(changed)` builds the shell's own refusal from a `SCOPE_CHANGE_WORDS` record over the five ScopeChange values. The message is: [P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again. It has no colon-space, so `formatPublishRefusal` passes it through, and the panel's existing refusal path renders it with the code `publish-refused`.
  - The Export section gets one sentence, `.publish-selection-sentence`, always shown whenever the section shows: [P6 placeholder] The selection is not used. The export covers the row scope chosen above. It is a local constant.
  - No host or dialog string changed. PublishDialog and src-tauri are untouched.
- src/App.tsx (+21):
  - `workspaceRef`, assigned each render like `viewIdRef`.
  - `stageExportScope()` is `resolveScope(workspaceRef.current, viewIdRef.current, {selection:false})`.
  - `checkStagedExportScope(staged)` returns `{ok:false, changed:["view"]}` for a null staged scope. Otherwise it calls `checkScope(staged, resolveScope(current...))`.
  - Both read refs, so the dev hook's closure, registered in an effect, cannot go stale. Both are passed to PublishPanel.
- src/styles.css (+2/-1): `.publish-selection-sentence` joins the `.publish-scope-disabled-reason` rule.
- src/App.selection.test.tsx (+106/-2): RB7, RB7-hook and RB8. Added `publish/client` mocked to client.ts's real signatures through `importOriginal`, with the real PublishPromptData, PrepareOutcome and ExecuteOutcome types. `mocks.publish` records the arguments of every prepare and execute. Added the helpers `prepareExport` and `submitExport`.
- e2e/selection.mjs (+74/-4): E-EXPORT and E-SCOPE, plus their entries in the header's mutation list.

## The caller rule
- `stageScope` and `checkStagedScope`: callers are App.tsx:2200-2201, with the panel's uses at PublishPanel.tsx:385, :429 and :472.
- `resolveScope` and `checkScope` from scope.ts now have their first product callers, in App.tsx `stageExportScope` and `checkStagedExportScope`.
- `executeInStagedScope`, `scopeChangedOutcome` and the `execute` prop: used inside PublishPanel.tsx, at 471-473, 503 and 564.
- The types ResolvedScope, ScopeChange and ScopeCheck: imported by PublishPanel and App.
- Every symbol added this stage has its product caller in this stage. Nothing relies on the second exemption.
- Stage 7 will add `onExportRunning` and `settleExecuteOutcome`, and will reuse `executeInStagedScope`. B3 is not built.

## Tests, each with its mutation and observed failure (all at 3dc687a11445a931a4fee46ca4ef8cb0e8ee8888)
1. RB7: a prepare, then Apply of zone = 'residential', then Submit. It asserts the host call count is 0, the refusal message, and that the dialog is closed. Then a second prepare, a Select click on feature 1 (the selection changes), and Submit. It asserts exactly one host call, `["at_2","bundle"]`, and "Exported.". This shows a selection change is not a scope change.
   - Mutation: in executeInStagedScope, `const check: ScopeCheck = { ok: true };`.
   - Failure: AssertionError: the host was not called: expected [ [ 'at_1', 'bundle' ] ] to deeply equal []. RB7-hook failed too.
2. RB7-hook (a row beyond §4's table): the `publishExecute` dev hook after the filter changes returns the same refused outcome. The host is not called and the panel shows it.
   - Mutation: in runExecute, call `publishExecute` directly.
   - Failure: the same host-call assertion. RB7 passed under this mutation.
3. RB8: it asserts the sentence with and without a selection. The second prepare's arguments equal the first's, and equal `[handle, string, {kind:"whole-file"}, false]`.
   - Mutation: App.tsx passes `filterActive={activeFilter !== null || selection.size > 0}`.
   - Failure: the prepare with a selection does not equal the one without; the fourth argument is true where false was expected.

The form's RB8 mutation is "pass the selection; tsc or the assertion fails". The host takes no selection parameter, so the mutation reaches the prepare through `filterActive`, the only argument that App derives and could carry a selection into. The assertion catches it.

UB6, the form's unit row for checkScope, was built in stage 1 and is unchanged. No UB row is assigned to this work beyond it.

## e2e steps written (selection.mjs, run none)
Both steps are inserted after E-KINDS and before EXPORT-TODAY. Neither disturbs E-GEN, which needs the selection that E-SEL-FILTER leaves standing.
- E-EXPORT:
  - It opens filter-zoned and builds a scene.
  - It makes one Select click in Add only mode and expects Selected 1.
  - It expands the Export section.
  - For Selected 1 and then Selected 0 (after Clear selection), it prepares a whole-file export through `publishPrepareWithDestination` and executes it through the `publishExecute` hook with the destination's basename as the phrase.
  - It asserts that the prompt succeeds, the execute succeeds, the section's sentence matches /selection is not used/, and `prompt.filter_scope` is null.
  - It then asserts that `row_scope` and `rows` are equal across the two runs.
  - Mutation, for the custodian: src/App.tsx, the PublishPanel element: `filterActive={activeFilter !== null || selection.size > 0}`. Expected: E-EXPORT fails on the run with a selection, because the prompt carries a filter scope sentence. The hook re-registers on a `filterActive` change, so it sees the mutated value.
- E-SCOPE:
  - It opens filter-zoned and prepares an export.
  - It applies zone = 'residential' through the filter panel.
  - It executes through the hook.
  - It expects `{status:"refused"}` with a message matching /changed after it was prepared/, and the panel's refusal text equal to that message.
  - It expects the destination directory absent and no .staging-* debris in its parent, then clears the filter.
  - Mutation: src/publish/PublishPanel.tsx, `const check: ScopeCheck = { ok: true };`. Expected: E-SCOPE fails because the execute is sent and returns a success. That mutation writes a bundle under target/e2e-selection-out, so clean it up.

## H3
`npm run verify` exited 0 at d7f61f1c, run under a granted shared hold (MACHINE_HOLD, then MACHINE_RELEASED, no exit 96 to 99). It ran 93 test files and 1324 tests, all passed. Residency-trace passed 76 and citation-integrity passed 30. Typecheck, build and the dist checks passed. No base suite was edited this stage. The only edits to base files are the ones already accepted: App.layout.test.tsx R4, actionRegistry.test.ts U5, the UA4 line, and additions only in pickResolution.test.ts and workspaceState.test.ts. PublishPanel.test.ts and PublishDialog.test.ts are unedited and pass.

## Governance, at d7f61f1c
- verify-cites rc 0: 1815 files, 38 loose advisories.
- verify-quotes rc 0: 121 checked, 90 verified, 30 baselined. I wrote no verbatim quotes. A `--show-cites` run on my four changed files printed no cite of mine.
- verify-test-claims rc 0: 545 claimed tests.
- verify.mjs rc 0: verify:plan PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: rc 0, 457 pass, 0 fail.

## §7, by §7's own command from B (c96e5329, three-dot, at d7f61f1c)
- Cumulative: 4,968 insertions plus 102 deletions = 5,070. At stage 5's head f60329ef the same command gives 4,823, so this stage adds 247 by the cumulative command. The per-file figures for this stage sum to 259: 78 + 108 + 21 + 49 + 3. The two totals differ because a few lines are inserted and later deleted within the stage.
- PublishPanel.tsx: 47 insertions plus 2 deletions = 49, against B-X's 100. AM7-P's +30 is stage 7's.
- selection.mjs: 571 plus 8 = 579 cumulative. Stage 5 reported 509, so this stage adds 70 net (74 insertions, 4 deletions). Against the "about 660" allowance, 81 remain for stage 7's E-ASK third step.
- App.selection.test.tsx: 769 insertions, 0 deletions. App.tsx: 164 plus 4 = 168. styles.css: 96 plus 2 = 98 against B-S's 200.
- The ceiling is 8,352. No overrun is declared this stage.

## The exact e2e list for the custodian at d7f61f1c
- Required: `npm run e2e:selection`. It is the only suite carrying the new steps, and it exercises E-EXPORT, E-SCOPE and every earlier step. Observe each new step's mutation as above, one at a time.
- Required: `npm run e2e:publish`. The dev hooks and PublishDialog's execute prop now go through the staged-scope path. Its APPROVED', REFUSED' and FILTERED' steps apply any filter before the prepare, so the scope is unchanged at execute. A real run is the proof, since I ran none.
- Not needed at this head: regression, layout, console, style, filter, admission and residency. No canvas code changed this stage. No other e2e file mentions `.publish-disclosure`, `.publish-open` or "Export interactive". The Export section is collapsed by default, so the added sentence cannot move the layout suites.
- Stage 5's recommended full e2e list at its head stands separately and is not mine.

## Notes
- The staged scope is captured when a prepare starts, which is when the filter state it reads is also fixed. The scope is the view, resource, generation and the filter as applied, with the selection `"none"`. The camera is not part of it, so a pan never refuses. A rebind, a session-ended event or a filter change does. Only the filter path is tested at the App level (RB7 and RB7-hook). The other changed values are covered at unit level by UB6.
- The host's pending attempt is left to expire after a shell-side refusal, as an abandoned dialog's is. No host call is made, so there is no console row for it. The refusal's code in the panel reads publish-refused, the existing label for "no typed code".
- `selection.zoomTo` stays "staged and run in one handler", as stage 5 built it. I did not route it through resolveScope, since the brief names only the export.
- New strings are all marked [P6 placeholder] for the sitting: the selection sentence, the five scope-change words, and the refusal text.
- Pending items are untouched and nothing here depends on them: WorkingCanvas.wiring.test.tsx, StudioLayout.test.tsx (`status.selectionEnded` is still optional in `Slots`), and a double-click reaching the click once. OPEN-11's fourth term is respected: Current view is unchanged.

## Not done as written
- Nothing in the stage list was skipped. Beyond it, I added RB7-hook (a row beyond the table, with its own observed mutation) and made PublishControls' `execute` optional with a default, so that the base render tests stay unedited.
- The brief says the AM7-P allowance is stage 7's. I used none of it.

## Final porcelain
`git status --porcelain` in C:/dev/wt/mm2b prints nothing. Local head d7f61f1c equals origin/cut/shell-migration-milestone-2-phase-b. node_modules are unchanged real installs. Run artefacts are in my temp directory, outside the repo.
