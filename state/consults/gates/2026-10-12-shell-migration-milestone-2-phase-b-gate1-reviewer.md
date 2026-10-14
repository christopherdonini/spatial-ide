# PR #217 gate 1 — reviewer
Reviewed: cut/shell-migration-milestone-2-phase-b @ 575cd4b3330a89c6303c65655128adcfc3aebd6f

**Verdict: FAIL.** Two findings block: C1 (Correctness) and E1 (Evidence). There are seven Documentation findings (D1 to D7). Each must be fixed before the merge and is not re-gated.

## Correctness

**C1 (blocking): "Cancel the export and go on" does not cancel an execute that started after the ask appeared.**
- **Where:** frontends/shell/src/App.tsx:1142 @ 575cd4b3 records the runs that stand when the ask opens. The loop at frontends/shell/src/App.tsx:1155 @ 575cd4b3 marks and cancels only those runs. A run reported later through `handleExportRunning` (frontends/shell/src/App.tsx:1115-1120 @ 575cd4b3) is never added to the ask.
- **How ordinary use reaches it:** the PublishDialog is rendered inline, so it stays usable while the ask stands.
  1. Start a whole-file export. The prepare run starts.
  2. Open another file. The ask shows.
  3. The prepare finishes into the approval prompt. Type the phrase and Submit. The execute starts.
  4. Choose "Cancel the export and go on".
- **Proven by a probe test.** I appended it to App.selection.test.tsx in my scratch worktree, ran it, then reverted the file and confirmed the worktree was clean. It reused the file's own helpers and mocks. Observed:
  - askDuringPrepare true; executes `[["at_x","bundle"]]`; askStillShown true;
  - openResult `{kind:"admitted"}`; handleIsNew true;
  - the only cancel was `["prepare:ds_…01"]`: the execute `at_x` was never cancelled;
  - oldClosedBeforeOutcome 0;
  - the execute then ended in success with statementAfterSuccess "absent", and oldClosedAfterOutcome 1.
- **Why it matters:** the operator chose cancel, the export ran on and wrote its bundle, the old panel left the screen, and nothing said so. That is H4's defect, the one B3 exists to fix (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:634 @ 575cd4b3).
  - It breaks B3's rule that `cancel()` is called once (:704 @ 575cd4b3).
  - It breaks Amendment 7 item 2(c): the run is never marked as chosen.
  - It falls under §8 item 31, a silent export alongside an open (:759 @ 575cd4b3).
  - The ask's own text says the export is asked to stop (frontends/shell/src/feature/OpenDuringExportAsk.tsx:41 @ 575cd4b3), which is untrue here.
- **Fix (a code change, so it is re-gated):** at the choice, act on the union of the ask's runs and the runs standing now, `new Set([...ask.runs, ...exportRunsRef.current.values()])`. Add one RB row for this sequence with one observed mutation: iterate `ask.runs` only, which fails on the cancels list.

**Non-blocking notes:**
- **N1 (§8 item 19, for the architect).** The selection branch of `resolveScope` (frontends/shell/src/workspace/scope.ts:55 @ 575cd4b3) and the `selection` change of `checkScope` are called only by UB6's tests. The one product caller passes `{selection: false}`. Their words in `SCOPE_CHANGE_WORDS` can never be shown (frontends/shell/src/publish/PublishPanel.tsx:52 @ 575cd4b3). The shape itself is preregistered by §2.5 and asserted by UB6, so I do not block on it. `countSelection`'s unread `_facts` parameter is already recorded (Amendment 9 item 2(d)).
- **N2.** The rest of the diff checks out against §2, Amendments 2, 3, 7 and 8, and §8:
  - **Item 1:** only §2.7's files, plus OPEN-13's two (pending with the human) and the AdmissionPanel pair under Amendment 6 item 1.
  - **Item 3:** the tap reads only `offsetCenter`, through the shared `pickCandidateAt`. deck's info is unused, and the deps have no readout member.
  - **Item 5:** the canvas is keyed on `admitted.dataset` only.
  - **Item 9:** `filterActive` is unchanged, the scope is staged with `selection:false`, and the panel has no selection prop.
  - **Item 11:** the Submit and the dev hook both go through `executeInStagedScope`, and the scope is staged at both prepare paths.
  - **Items 34 to 37:**
    - the statement is decided by `lateCancelOutcome` from the outcome only, and the cancel's answer is never read;
    - it is shown only for an execute outcome of success or succeeded-unaudited;
    - the path is `bundle_path`, wrapped with `overflow-wrap:anywhere` and never truncated;
    - it has no timer and sits in `region.layers`.
  - **The approved words:** the two `LATE_CANCEL_*` strings equal Amendment 7 item 3's text byte for byte.
  - **HoverReadoutView:** the two refusal constants equal the base JSX text by Amendment 2 item 7's rule, checked by script (EQUAL, 162 and 68 bytes).
  - **Cursor:** deck 9.3.9's `_onRenderFrame` calls `_updateCursor` on every frame (node_modules/@deck.gl/core/dist/lib/deck.js lines 1016-1028, read in the scratch install), so the tool needs no re-set.
- **N3.** OPEN-13, OPEN-14 and OPEN-15 are with the human. The build follows §2.2's pixel rule.

## Evidence

**E1 (blocking): the base e2e suites were not run at phase B's head.**
- **What the form requires:** §3 predicts every existing suite passes at phase B's head (frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:360 @ 575cd4b3). §9 requires every e2e suite at the code base, listed in the PR body (:543 @ 575cd4b3).
- **The suite list:** phase A ran 14 base suites (state/consults/2026-10-11-shell-migration-milestone-2-phase-a-worker-report-1.md:24-38 @ 575cd4b3).
- **Six ran in phase B, three of them only before later product code:**
  - regression and layout last ran at f60329ef;
  - style ran only at e4940dbe;
  - stages 6 and 7 then changed 293 product lines after f60329ef, including AdmissionPanel's `confirmOpen` await on every open and the App and PublishPanel export path;
  - console, publish and admission ran at 5d45e2d9, whose product code equals the head's.
- **Eight never ran on any phase B commit:** refusal-contract-baseline, filter, filter-panel, residency-harness, source-changed (both routes), source-watch-idle and pan-anchor.
  - Phase B changed paths these suites drive: the auto-fit's unreported branch and the resize branch in WorkingCanvas.tsx (filter, pan-anchor), the generation-end reducer (source-changed, source-watch-idle), and the open path.
- **What the records claim is accurate.** Amendment 10 item 2 and the PR body say "stages 3 to 7", which is true. What is missing is evidence for the head.
- **Remedy:** run all 14 at 575cd4b3 (code equal to 719568f8) under the harness approval, record them, and list them in the PR body.

**Otherwise the evidence holds:**
- run 2's e2e mutations match the header of selection.mjs at the head (one gap, D1);
- the record's reading ("observed by its own step", with E-ASK (2) to RB12b) agrees with its tables;
- fixtures were hashed (17 unchanged per run);
- the sampled test comments match the stage reports' observed failures (stage-1 line 105, stage-5 lines 67-84, stage-6 lines 47-52, stage-7 line 14).

## Documentation (must fix before the merge; no re-gate)

**D1. The E-NODRAG (2) mutation text in the header of selection.mjs** (frontends/shell/e2e/selection.mjs:35-36 @ 575cd4b3).
- **The problem:** the observed patch also re-set the controller in an effect on `tool` (the mutation-patches report, ambiguity 1). The header's line alone would be a no-op, because the Deck is built once.
- **Not the human's wording.** Replace with: `E-NODRAG (2)   src/canvas/WorkingCanvas.tsx: in the Deck props, controller: toolRef.current === "select" ? { dragPan: false } : true; and, because the Deck is built once, after toolRef.current = tool, useEffect(() => { deckRef.current?.setProps({ controller: tool === "select" ? { dragPan: false } : true }); }, [tool]). Expected: E-NODRAG fails on the view box (the selected feature never leaves the view).`
- **Clause check:** both hunks are the patch report's text, and run 2 records E-NODRAG FAIL under E-NODRAG-2 at a6607738 and 719568f8.

**D2. EXPORT-TODAY is described as recorded** (frontends/shell/e2e/README.md:772 @ 575cd4b3).
- **The problem:** it is skipped at the head.
- **A draft, not the human's.** Replace with: `Not run: EXPORT-TODAY, phase A's recorded observation, is skipped since B3 and prints its reason: its reopen now meets the ask, which E-ASK and E-ASK-STATEMENT cover.`
- **Clause check:** the SKIP line in frontends/shell/e2e/selection.mjs:733 @ 575cd4b3, and Amendment 10 item 3(l).

**D3. The dev-hook message for a dropped open** (frontends/shell/src/admission/AdmissionPanel.tsx:329 @ 575cd4b3), "the operator kept the running export".
- **The problem:** this is untrue when a later open replaced the ask (frontends/shell/src/App.tsx:1135 @ 575cd4b3). It is also the panel stating the export owner's consequence.
- **Not the human's; dev-only.** Replace the message with: `The open was dropped while an export ran: Keep exporting was chosen, or a later open replaced this one.`
- **Clause check:** the two `answer(false)` sites, App.tsx:1135 and the Keep branch of `answerOpenAsk`.

**D4. KNOWN-LIMITATIONS items 36 and 38: the added click sentences** (KNOWN-LIMITATIONS.md:359 and :369 @ 575cd4b3).
- **The problem:** "in Select it selects" and "inspects or selects" are untrue under Add / remove (the default) and Remove only, and under a pin.
- **Drafts awaiting the human's item 2e words; my words replace the drafts:**
  - 36: `A click uses the same pick and the same comparison: instead of refusing, it acts on the topmost symbol under the pointer there, which in Navigate it inspects (unless a pinned feature is kept) and in Select it changes the selection by the chosen mode.`
  - 38: `A click uses the same pick, the same 4 pixels and the same comparison: where many long lines cross, it acts on the topmost line under the pointer instead of refusing, which in Navigate it inspects (unless a pinned feature is kept) and in Select it changes the selection by the chosen mode.`
- **Clause check:**
  - the pick: `pickCandidateAt`, with the line radius from `pickingRadiusFor`;
  - the comparison: `belowPickResolutionNow` is the same `isBelowPickResolution` that hover uses;
  - the pin: frontends/shell/src/feature/clickEffect.ts:65 @ 575cd4b3;
  - the mode: clickEffect.ts:56 @ 575cd4b3, then `applySelectionMode`.

**D5. Part W: the expected-outcome cells of rows W2 and W9** (frontends/shell/MANUAL-WALKTHROUGH.md:1816 and :1824 @ 575cd4b3). These are drafts, not the human's.
- **W2:** "The selection grows as the modes say" is untrue under Replace (frontends/shell/src/workspace/selection.ts:86 @ 575cd4b3). Replace that sentence with: `Under Replace each click leaves only the clicked feature selected (Selected, ignoring filter: 1); Add only then adds the sixth (2).` Keep the rest of the cell.
- **W9:** by this row, W8a's opens have already ended the selection. With nothing dropped there is no notice (the `selection.end` case, `dropped > 0`). Replace with: `If a selection stands, the notice in the Feature tab and the status bar names the count dropped; W8a's opens have already ended the earlier selection, so select two features first.`
  - Clause check: `admit` ends the selection on every rebind, and `status.selectionEnded` renders the notice.

**D6. The PR body.**
- §9 asks for verify-cites, verify-quotes and verify-test-claims, each with its commit. They are absent. My runs at 575cd4b3 (the tools at that commit) all exited 0.
- After E1's runs, list the 14 suites with the commit each ran at.

**D7. Amendment 10 item 1** does not say where viewTransitions.test.ts (82 lines; UA4's union edit, Amendment 9 item 2(b)) counts. If it is one of B-T's 7 files, the UB group is 1,027 against 1,125, and Amendment 10's within-ceiling sentence holds. A single reference row settles it.

**§7 recount, by its own command, from the merge base after the merge (f87a7b66):**
- Phase B is 5,644 lines, so the piece is 6,814 of 8,352. Amendment 10 is confirmed.
- The overruns are only Amendment 9's: HoverReadoutView.tsx 17 of 12, and the two workspace files 187 of 180.
- Other figures: selection.mjs 706 of about 750; App.tsx 251 of 565; App.selection.test.tsx 959 of 1,290; B-C 413; B-L with FeaturePanel and clickEffect 558 of 700.
- Counting from c96e5329 would also include main's EXPORT-CURRENT-VIEW form (375 lines). That is correctly excluded.

## Commands and exit codes
- `git fetch origin`: 0. origin/main is f87a7b66 and the PR head is 575cd4b3.
- `git worktree add --detach C:/dev/wt/mm2b-review 575cd4b3`: 0.
- `npm ci` in renderer/bundle-viewer: 0. `npm ci` in frontends/shell: 0.
- `npm run verify` at 575cd4b3, inside a shared hold (granted, then released): 0.
  - vitest: 93 files and 1,330 tests passed.
  - residency-trace: 76 passed. citation-integrity: 30 passed.
- §7's `git diff --numstat f87a7b66...575cd4b3 -- frontends/shell` with its three excludes: 0, total 5,644.
- Mutation runs, inside one shared hold (granted, then released):
  - 11 single-file vitest runs, each mutation alone: every one exited 1;
  - each mutation was reverted with `git checkout`, and porcelain was empty after each;
  - 6 unmutated baselines of the same files: every one exited 0.
- The C1 probe (vitest, `-t PROBE`): 1, by design: a printing assertion. Reverted, and porcelain was empty.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` at main f87a7b66: 0, with 457 pass and 0 fail.
- At 575cd4b3: `verify-cites` 0; `verify-quotes` 0 (121 checked); `verify-test-claims` 0 (560 claims); `verify.mjs` 0.
- `gh pr checks 217`: 12 pass and 1 pending, "cargo test --workspace (windows-latest)". That is run 38243664373 at 575cd4b3, still in progress when read.
- The script byte-compare of HoverReadoutView's constants: both EQUAL.
- KNOWN-LIMITATIONS comment cites, read at 2f18ad39 (clickPick.ts lines 40-48, WorkingCanvas.tsx 1236-1244, workspaceState.ts 140-141 and 149-158, viewTransitions.ts 156-165, FeatureTab.tsx 68-76, selection.ts 119-157): all resolve. The two pinned hashes at c96e5329 recompute equal.
- No exit code from 96 to 99 came from the machine script.

## Mutation table (applied at 575cd4b3, one at a time, then reverted)

| Test, comment at @ 575cd4b3 | Mutation | Observed failing list | Matches the record |
|---|---|---|---|
| UB1, frontends/shell/src/workspace/selection.test.ts:29 | toggle adds only | UB1 "toggle adds an absent id…" (toggle removes a present id: [1n,2n] vs [2n]); also UB2 "at the ceiling a present id…" (10000 vs 9999) | Yes. The extra UB2 failure is not in the comment, which does not claim to be the only failure. |
| UB7 (all parts), frontends/shell/src/canvas/clickPick.test.ts:68 | bounds from the first part only | "a candidate gives the pick and the authoritative bounds over every part…" | Yes |
| UB9 (non-pickable), frontends/shell/src/canvas/highlightLayers.test.ts:83 | `pathLayer` `pickable: true` | "the layers are non-pickable…" (highlight:selected:sh_hl:0: true vs false) | Yes, exact |
| UB10 (text-field guard), frontends/shell/src/layout/actionRegistry.test.ts:225 | delete `if (isEditable(focus)) return null;` | "ignores each of the four…" ({"tagName":"INPUT"}: 'tool.navigate' vs null) | Yes, exact |
| UB13, frontends/shell/src/admission/AdmissionPanel.test.ts:576 | `confirmOpen` check moved below `deps.admit` | UB13 "false means no admit…" (no admit: called 1 time) | Yes, exact |
| RB1, frontends/shell/src/App.selection.test.tsx:314 | `if (!navigate)` changed to `if (navigate)` | RB1 ([] vs [1n]) plus 14 other App tests that click | Yes. Stage-5 report line 136 explains the spread. |
| RB4 (a), App.selection.test.tsx:393 | `const notice = null` | RB4 (no .feature-notice; '2 selected features were dropped') | Yes, exact |
| RB4 (b), App.selection.test.tsx:396 | latch dropped | RB4 (no .feature-last-click; 'The source file changed…') | Yes, exact |
| RB7, App.selection.test.tsx:724 | `const check: ScopeCheck = { ok: true }` | RB7 and RB7-hook (the host was not called: [['at_1','bundle']] vs []) | Yes, both named |
| RB12d, App.selection.test.tsx:891 | statement only when `cancel()` answers false | RB12d ((i) …) and RB12e (decided at the choice: null vs 'C:/out/early') | Yes, both named |
| RB18 (App side), App.selection.test.tsx:671 | `onViewShown` routed into `onViewportChanged`'s body | RB18 (no query: 1 vs 0) | Yes, exact |

## The scratch worktree
- C:/dev/wt/mm2b-review was clean (porcelain empty) before removal.
- It was removed with `git worktree remove --force` (exit 0) and pruned. It is absent from `git worktree list` and from C:/dev/wt.
- No background process from this review is running.
- Nothing was written in the repository or in C:/dev/wt/mm2b.
