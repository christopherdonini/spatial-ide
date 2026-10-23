*Custodian's filing note (2026-10-23): milestone 4 PR C's dispatch amendment (Amendment 7), drafted read only by the architect at main 858092e3 from its PR C draft drafted ahead, the re-sweep and the base series, with the words of 1c's Amendment 3 (the OPEN-17 (b) interleave for PR C). The run 19:59:04Z to 20:06:49Z by its transcript (Read 16, Grep 9, Glob 2; no Write, Edit or Bash). Nothing is committed from it yet. Its item 5 adds a declared ceiling, TABLE_MAX_ATTRIBUTE_BYTES at 67,108,864, a value no one has measured, which the custodian holds for the human's sight before the amendment commits; its What I could not settle item 3, KNOWN-LIMITATIONS items 51 and 52 rendering as 47 and 48 on main, is routed by the custodian. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 90fcabe541aa5f49b5d4d922c4f626f3a93edda8dd4ea98f5793eb05ff0c0e62.*

---

Drafted: b1-shell-half PR C's dispatch amendment, at main 858092e3 (main @ 858092e340ac650822afea87b50b3ce00e50bd40)

I had no shell, so I could not run git. I read the main checkout's working tree. At the start of the session git status showed changes only to the queue, PLAN, site and CUT-STATE files, plus one staged file (the base-series report), so every tracked file cited below as `@ 858092e3` was read as it stands at that commit. The two reports were read as filed. No sha256 appears below: the custodian pins every cite by script. Every word below is mine (the architect's). It is not the human's wording, and none of it is a quotation.

## 1. The amendment's text

```markdown
## Amendment 7: PR C's re-sweep at C e7eb8f2e and its base series at a533a598, written after both results were seen. No invalidator. Rows 8 and 13 are moved cites, and row 18's number and §2.6's count are corrected (class 3). Four product files, five test files and thirteen fill files join PR C's list, and the first scope's held bytes are bounded under ADR-010 rule 6 (class 9). The base series, the readings, the Part rows, the numbers 54 to 56 and rule (00) are class 1.

*Written after PR C's re-sweep and its base e2e series were seen, before any PR C code. Drafted read-only by the architect at main 858092e340ac650822afea87b50b3ce00e50bd40 (`state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, item 1), from its PR C draft drafted ahead (`state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md`, PR C part). References only; nothing below is a quotation, and none of it is the human's wording. The re-sweep is `state/consults/2026-10-23-b1-shell-half-pr-c-re-sweep.md` [custodian: its sha256 from line 5, by script], at C = e7eb8f2e98c4dcb033161573f8b8fa312169d70d. The base series is `state/consults/2026-10-23-b1-shell-half-pr-c-base-series-tester-report.md` [custodian: its sha256 from line 5, by script], run at a533a598e4e139e2fbd2793ded328472cc977036 [custodian: by script, the file list of `git diff --name-only e7eb8f2e98c4dcb033161573f8b8fa312169d70d a533a598e4e139e2fbd2793ded328472cc977036`, records only]. Every pin at 4b26d279, 55618ab5, c6de9b48, 0ff8db4e, 72868422 or e6dfe624, and every fact of 507197c1, is historical (§0.3). For PR C's work the tree at C is authoritative, and at the code's base the tree at that base. The scope addition rests on the cross-module seam rule (RULED 2026-09-16, question round 4) and on §2.6's last paragraph (round 25, item 2 (a)). §7 is not edited.*

1. **The re-sweep at C (§0.3).** By the re-sweep's step 1, rows 1 to 7, 9 to 12, 14 to 17 and 19 are Same. I4 does not fire.
   - **Row 6.** No `ResidentBatch` rebuild site exists in product code beyond `trimBatchToVertexBudget` (`tileIngest.ts`) and `TileResidentSet.addBatch` (`tileResidentSet.ts`), plus `withinAttributeCeiling`'s spread (`limits.ts`).
   - **Row 7.** The product callers of `.pushBatch(` and `.pushTileBatch(` are `App.tsx` and `candidateArmSession.ts` only.
   - **Row 8, moved (class 3).** §2.4 (e)'s App pin and §0.2's two arm pins are at the lines that row names at C, and their bytes are identical. The `projection` memo is `projectionFor(admitted.describe)`.
   - **Row 13, moved (class 3).** §0.2's and §2.4 (e)'s tile-manager comment pins are three lines later at C, and their bytes are identical. The comment still calls the class composition-unreachable, so §2.4 (e)'s restatement stands as written.
   - **Row 18 (class 3, tree authoritative).** The highest KNOWN-LIMITATIONS item at C is 52, not 46.
   - **The pins (class 1).** The re-sweep's step 3 recomputes all 138 of the form's pins at their own commits, and all 138 match.
     - In PR C's sections, 10 pins are Changed at C. Each one is PR A's own merged edit, declared by Amendments 2 to 4, and rows 1 to 7 read the interfaces that result. Reading: a §0.2 interface that PR A changed as this form declares is the base's interface, not I4.
   - **The fixtures (row 17).** The three named fixtures hash equal to the records.
     - #241's branch changes `engine/src/fixture.rs` only by adding `write_zone_texts`.
     - `MultiType` and `write_geoparquet` are untouched.

2. **§2.6's count (class 3).** §2.6 says PR C has 31 files, but its list names 30: 19 product, 10 test and 1 e2e (the re-sweep's step 2). The 19 existing files are present at C. The 11 declared-new files are absent, and no `src/table/` path exists.

3. **Scope addition (class 9), declared before any of its code.**
   - **Why.** `ResidentBatch.filter` (§2.4 (c)) is required, under Amendment 3 item 5's reading and its item 11's forward note. The filter can reach a batch and a selection member only through files outside §2.6's PR C list:
     - the canvas's decode and push site, `WorkingCanvas.tsx`;
     - the two rebuilds (row 6);
     - `clickEffect.ts`, whose Select branch builds `selection.apply` (the re-sweep's row 5).
   - **Confirmed at C.** All 22 paths below are present at C (the re-sweep's step 2, last bullet), and rows 6 and 7 find no further site.

   | Group | Files (ceiling each) | At most |
   |---|---|---|
   | C-P, added | `frontends/shell/src/canvas/WorkingCanvas.tsx` 40, `frontends/shell/src/canvas/tileIngest.ts` 4, `frontends/shell/src/canvas/tileResidentSet.ts` 4, `frontends/shell/src/feature/clickEffect.ts` 10 | 58 |
   | C-T, added | `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` 60, `frontends/shell/src/canvas/tileIngest.test.ts` 40, `frontends/shell/src/canvas/tileResidentSet.test.ts` 40, `frontends/shell/src/feature/clickEffect.test.ts` 50, `frontends/shell/src/canvas/clickPick.test.ts` 40 | 230 |
   | C-T, fills | `frontends/shell/src/canvas/buildLayers.test.ts` 12, `frontends/shell/src/canvas/highlightLayers.test.ts` 6, `frontends/shell/src/canvas/pick.test.ts` 10, `frontends/shell/src/canvas/residentSet.test.ts` 4, `frontends/shell/src/attributes/values.test.ts` 4, `frontends/shell/src/canvas/limits.test.ts` 4, `frontends/shell/src/feature/FeatureTab.test.tsx` 4, `frontends/shell/src/App.command.test.tsx` 4, `frontends/shell/src/App.selection.test.tsx` 4, `frontends/shell/src/App.attributes.test.tsx` 4, `frontends/shell/src/workspace/scope.test.ts` 4, `frontends/shell/src/workspace/viewTransitions.test.ts` 6, `frontends/shell/src/layout/StudioLayout.test.tsx` 2 | 68 |
   | **Added** | | **356** |

   - **PR C's new totals:** 52 files, and 3,840 + 356 = 4,196 lines. These are counted by §7's command, and an overrun of a file or a group is class 8.
   - **The fill forms.** Each fill takes one of these forms, and each is true of its fixture, which is streamed with no filter:
     - `null` as `decodeBatch`'s seventh argument;
     - `filter: null` in a `ResidentBatch` or click literal;
     - `row: null, filter: null` in a `selection.apply` literal;
     - `"activity.table": null` in a slots record.
   - **A fill outside the list,** or any edit that `tsc --noEmit` needs outside §2.6 and this item, is I1. It is recorded by class 9 before its code, as Amendment 3 did.
   - **Risks.** `decodeBatch.test.ts` and the three managers' tests take the new argument at every call. PR A overran two of the same managers' test files (Amendment 6 item 1). An overrun is class 8, and §7 is not edited.

4. **Readings (class 1).**
   - **The filter is `decodeBatch`'s required seventh parameter,** beside `streamHandle` and `batchSeq`, so every member is set in the decode call, as `projection` is.
     - Each manager's `onBatch` carries the filter its stream was issued with.
     - `pushBatch` and `pushTileBatch` take that filter and pass it to `decodeBatch`.
     - The two rebuilds carry it as the same object, and `withinAttributeCeiling`'s spread carries it with no edit.
     - With the parameter required, `tsc` finds every caller, `tableSource.ts` included.
   - **`candidateArmSession.ts`.** §2.6 lists it among PR C's three managers, and also says `residency/` is not edited beyond the first look's argument. For PR C, the line is read as: no change to residency planning, budget, retry or lifecycle. The session's only edit carries the stream's filter from its `onBatch`, and from the untiled sink, to `pushTileBatch`. Any other edit there is I1.
   - **Selection members.**
     - `SelectionMembers` values become `{bounds, row, filter}`, and `unionOfBounds` and `countSelection` read `.bounds`.
     - The assertion at `frontends/shell/src/workspace/selection.test.ts:62` @ 858092e340ac650822afea87b50b3ce00e50bd40 keeps its claim; only its access path changes.
     - `FeaturePanel.tsx` and `workspaceState.ts` are not edited.
   - **`CAPTURED_ROW_MAX_BYTES` lives in `table/tableConstants.ts`, which imports nothing.** `workspace/selection.ts` may import it: UA6 forbids only React, `skp/client`, `streaming/`, `residency/` and `canvas/` (`frontends/shell/src/workspace/workspaceBoundary.test.ts:28-32` @ 858092e340ac650822afea87b50b3ce00e50bd40). The cut is pure, and it happens in `selection.ts` when a member is added.
   - **`tableSource.ts` decodes through the real `decodeBatch`,** with the open's geometry column, encoding and projection. It keeps `ids` and `attributes`, and walks the geometry and drops it, with no figure claimed (OPEN-2 (b)). Its `limit` is `encodeDecU64(BigInt(TABLE_MAX_ROWS))`.
   - **The second scope's second test** (an id in a resident batch streamed under the view's filter) uses one `WorkingCanvas` handle method. Its product caller is `tableScope`, through App.
   - **Nothing for PR B lands in PR C.** `tableSource` has the Table tab as its only product caller. Round 8's producer exemption is not invoked.

5. **The first scope's held bytes (class 9, on ADR-010 rule 6: capacity ceilings are declared, not discovered).**
   - **The gap.** The first scope's copied attribute bytes have no declared ceiling, and they are not in `RESIDENT_ATTRIBUTE_MAX_BYTES`'s sum, which covers the canvas's active set only. The engine bounds each batch, not the sum over up to 1,000 rows' batches.
   - **The ceiling.** `TABLE_MAX_ATTRIBUTE_BYTES` = 67,108,864 [custodian: approve or replace the value before commit], declared in `table/tableConstants.ts` beside §7. It is a declared value, not a measurement.
   - **Its behaviour.** A first-scope result that would pass the ceiling keeps its ids and is marked not-held, and the count line says so (P6).
   - **Files.** No file is added: `tableConstants.ts`, `tableSource.ts`, `TableTab.tsx` and `tableSource.test.ts` are on §2.6's list, inside their §7 ceilings.

6. **Tests, e2e and fixtures.**
   - **The standing rows.** §4's PC-U1 to PC-E4 stand. `tableSource.test.ts` builds its batches with `testUtils/attributeBatchIpc.ts` and mocks only the transport; mocking `decodeBatch` is I5.
   - **New rows.** Each mutation is observed as §4 states: apply it, run the named test, record its failure by name with the commit, and revert. No `verify-mutation` run is an observation.
     - **PC-U7** (`WorkingCanvas.wiring.test.tsx`): a batch pushed through `pushBatch` and through `pushTileBatch` under filter F is resident with `filter` F. Mutation: the push passes `null`; fails.
     - **PC-U8** (`tileIngest.test.ts`): the trim carries `filter` as the same object. Mutation: the literal writes `null`; fails.
     - **PC-U9** (`tileResidentSet.test.ts`): the duplicate drop carries `filter`. Mutation: the same; fails.
     - **PC-U10** (`clickEffect.test.ts`): a Select click on a feature carries `row` and `filter` into `selection.apply`, and the reducer keeps them on the member. Mutation: the Select branch sends `filter: null`; fails.
     - **PC-U11** (`clickPick.test.ts`): `resolveClickPick` carries the candidate batch's `filter`. Mutation: `null`; fails.
     - **PC-U12** (the three managers' tests, in PA-U7's shape): every `onBatch` carries its stream's filter, the first look included. Mutation: the first look passes `null`; fails.
     - **PC-U13** (`tableSource.test.ts`): past `TABLE_MAX_ATTRIBUTE_BYTES`, the result is not-held with its ids. Mutation: the sum omitted; fails.
   - **§5, declared unchanged:**
     - every existing assertion in `tileIngest.test.ts` and `tileResidentSet.test.ts`;
     - the trim's and the dedupe's choices;
     - `applySelectionMode`'s outcomes and `SELECTION_MAX_FEATURES`;
     - `countSelection`'s counts;
     - the layout reducer (§2.1).
   - **E2E.** PR C adds `frontends/shell/e2e/table.mjs`, one `e2e:table` script line and one `e2e/README.md` entry.
     - The tester's series at PR C's gate head is every suite at the base plus `e2e:table`, with PC-E1 to PC-E4's mutations observed.
     - It runs on the port-5400 harness under THE MACHINE paragraph (§9), with Amendment 2 item 4's harness corrections carried over.
   - **Fixtures.** No new generator, and `kernel/tests/manual_walkthrough_fixtures.rs` is not edited.
     - PC-E1's oracle count is what `generate_the_filter_fixture` prints. The tester runs it into its own folder and checks that its file's sha256 equals the shared copy's, and the series report records both the count and the hash.
     - §3's "complete under one zone" prediction needs `residential`'s count to be below 1,000. A miss is class 2.

7. **The base series at a533a598 (class 1).**
   - **The suites.** Every one of the 15 `e2e:` scripts other than `e2e:debug` ended rc 0 on its first run, on an exe built at that commit. `e2e:residency-harness` was read by its exit code only. PA-E1 and PA-E3 pass, so H2 holds at the base.
   - **The scriptless drivers.** `pan-anchor.mjs`, `source-watch-idle.mjs` and `source-changed.mjs`'s default route pass. The post route ended rc 3 twice, with S5d INCONCLUSIVE and every other step passing. That is the result Amendment 2 item 9 records for PR A, so it is not I3.
   - **I6.** No `skp.projection_` line appears in any of the 20 runs' app stderr, so I6 does not fire.
   - **Fixtures.** All 34 files are hash-identical before and after. Nothing was regenerated, and the 5 GB fixture was not used.
   - **The one harness failure.** The first exe build failed because the shell's generated notice file did not yet exist, as in Amendment 2 item 4. A build is not a suite.

8. **The Part and the numbers.**
   - **The Part.** PR C's rows are AC6 to AC8, which are §9's rows 6 to 8 (Amendment 4 item 10), with PR C's new strings named in those rows.
     - Part AC's heading (`frontends/shell/MANUAL-WALKTHROUGH.md:1970` @ 858092e340ac650822afea87b50b3ce00e50bd40) and its opening sentence (`frontends/shell/MANUAL-WALKTHROUGH.md:1972` @ 858092e340ac650822afea87b50b3ce00e50bd40) name PR A's rows only. PR C's records commit adds PR C to both.
     - The Part's fixture line gains `filter-zoned.parquet`, `100k-happy-path.parquet` and `slow-filter-scan.parquet`.
   - **KNOWN-LIMITATIONS: KL-1 is item 54, KL-2 item 55 and KL-5 item 56.**
     - Item 47 is #241's, items 48 to 50 are 1c's K-2 to K-4, and items 51 and 52 are PR A's (`KNOWN-LIMITATIONS.md:411` @ 858092e340ac650822afea87b50b3ce00e50bd40, `KNOWN-LIMITATIONS.md:415` @ 858092e340ac650822afea87b50b3ce00e50bd40).
     - Item 53 is held by covering-case's committed form: its Scope line (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:6` @ 858092e340ac650822afea87b50b3ce00e50bd40) and its section 4 (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:88` @ 858092e340ac650822afea87b50b3ce00e50bd40). That piece stopped at H3 before any code (its Amendment 2), and its route is the human's. The number stays held until that route releases it. PR C's numbers do not move if it is released.
     - Unless item 53 stands directly above item 54 at PR C's KNOWN-LIMITATIONS commit, a line at column 0 goes before item 54 so that it renders as 54, as for items 42 and 44 (`KNOWN-LIMITATIONS.md:190` @ 858092e340ac650822afea87b50b3ce00e50bd40).
     - The numbers are read again at that commit, against every branch in flight. A change there is class 3, with the tree authoritative.

9. **Rule (00) at C (class 1), by the re-sweep's step 5, file by file against PR C's 52 files and its records.**
   - **#241** (at 147ef82c at the re-sweep): `KNOWN-LIMITATIONS.md` only, for item 47, a separate path.
   - **#244, F7:** `frontends/shell/MANUAL-WALKTHROUGH.md`, Parts F and G only. Separate Parts are separate paths.
   - **1c's step 1** (at 7109aeb2): its diff from 43a39222 names no path under `frontends/`. Its version-literal sites are none of PR C's files. 1c's form records the OPEN-17 (b) interleave for PR C in its own Amendment 3, appended before PR C's code.
   - **port-2** (fb162627 at the re-sweep): its 16 declared files are at `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md:260-276` @ 858092e340ac650822afea87b50b3ce00e50bd40, and none is under `frontends/`. Its KNOWN-LIMITATIONS edits are items 1 and 43.
   - **`cut/flush-crlf-field-rewrite`:** `scripts/hooks/` only.
   - **covering-case:** no branch commit. Its form's files are disjoint, apart from item 53 (a separate path).
   - **`record-step-style-match-widening`** is unplaced. PR C edits neither `skp/types.ts` nor `skp/client.test.ts`.
   - **No other `cut/*` branch ahead of main overlaps** (the re-sweep's step 5, last bullet).
   - **`protocol/`:** PR C touches none, and step 1 is its one piece.
   - **Before PR C's code,** each in-flight branch's `git diff --name-only origin/main...<branch>` is read again at the dispatch commit (#241 at 50c634a8, port-2 at 83d2ecef, and any branch moved since C), and the result is recorded in the PR body.

10. **§8 and §9.**
    - **§8 item 4** also covers a rebuilt `ResidentBatch` that drops or defaults `filter`.
    - **§8 item 13:** the canvas's new handle method and `TABLE_MAX_ATTRIBUTE_BYTES`'s path have their product callers in PR C.
    - **§8 item 17** gains the filter seam, proved from the real decode by PC-U7 to PC-U12.
    - **The architect adds:**
      - no PR B hook in `tableSource`;
      - `candidateArmSession.ts`'s diff is only the filter argument (item 4);
      - item 5's ceiling is checked against ADR-010 rule 6.
    - **The reviewer adds:**
      - `tsc --noEmit` clean at the head;
      - the thirteen fill files' diffs contain only item 3's forms;
      - the mutations of PC-U7 to PC-U13, applied again.

11. **Next.**
    1. 1c's Amendment 3 is appended (class 1).
    2. This amendment is pinned by script.
    3. `cut/b1-shell-half-pr-c` is brought to main at this amendment's commit, by a fast-forward or a merge, never a rebase. The PR body names §7's base.
    4. PR C's code, by one worker-high.
    5. The node's generation goes up by one.

**Superseded for PR C:**
- §2.6's PR C count: by item 2.
- §2.6's PR C list: added to by item 3.
- §0.2's and §2.4 (e)'s App and tile-manager pins: by item 1, rows 8 and 13.
- §7's PR C totals: read with item 3's additions, §7 unedited.

Read the last amendment first.

Nothing above is edited.
```

## 2. The words of one amendment appended to piece 1c's form

These are the architect's words, for the custodian to append by class 1.

```markdown
## Amendment 3 — OPEN-17 (b) for milestone 4's PR C, written before PR C's code: which step 1 commits proceed beside PR C and which wait for its merge (class 1); steps 2 and 3 unchanged; rule (00) at this amendment (class 1)

*Written by the custodian. The words are the architect's (`state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, item 2), drafted read-only at main 858092e340ac650822afea87b50b3ce00e50bd40. References only, and nothing below is a quotation. Self-references are by section and item. The sources are milestone 4's form (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`): OPEN-17's option (b) and its recommendation, its Amendment 1 item 4, its Amendment 5 item 3, and its Amendment 7. "PR C's files" means milestone 4's §2.6 PR C list with its Amendment 7 item 3's additions. "Beside PR C" means from PR C's dispatch until its merge.*

1. **Why.** Amendment 1 item 6 replaced §2.14's milestone-4 order for step 1, and it orders step 1 against PR A only. Now that PR A has merged, nothing in this form keeps step 1's shell work off PR C's files. For the time beside PR C, this amendment governs step 1, and item 6 holds for everything else.

2. **Step 1 beside PR C:**

   | Step 1 work (Amendment 1 item 6) | Beside PR C |
   |---|---|
   | N0 to N7 | Built (Amendment 2 item 1). No PR C file. |
   | O1, after O0's amendment | Proceeds: kernel only. |
   | P1, main merged | Proceeds. |
   | P2, the bump | Proceeds. Its literal sites are `frontends/shell/src/skp/types.ts`, `frontends/shell/src/skp/client.test.ts` and `frontends/shell/src/admission/admitDataset.test.ts` (milestone 4's PR C re-sweep, step 5), and none of them is a PR C file. The version named in the comment at `frontends/shell/src/console/surfaceRegistry.ts:78` @ 858092e340ac650822afea87b50b3ce00e50bd40 states when `record_step` was added. It is not a literal site, and P2 leaves it as it is. |
   | P3, the kernel's handler | Proceeds: `kernel/src` only. |
   | P4, `src-tauri` | Waits for PR C's merge. It is disjoint by file, but the shell's completeness test requires a class-B row in `console/surfaceRegistry.ts`, a PR C file, for every `binding_*` handler in `lib.rs` (`frontends/shell/src/console/surfaceCompleteness.test.ts:250-253` @ 858092e340ac650822afea87b50b3ce00e50bd40). So `binding_pick_project_folder` cannot land green without it. |
   | P5, the shell product and its tests | Waits for PR C's merge. `App.tsx` and `console/surfaceRegistry.ts` are PR C files. A seventh `call(...)` in `skp/client.ts` must change the registry's class-A rows with it (`frontends/shell/src/console/surfaceRegistry.ts:76-78` @ 858092e340ac650822afea87b50b3ce00e50bd40; `frontends/shell/src/console/surfaceCompleteness.test.ts:209` @ 858092e340ac650822afea87b50b3ce00e50bd40). |
   | P6, the e2e work | Waits for PR C's merge. `package.json` is a PR C file. The `e2e/README.md` entry is a separate path. |
   | R1, after #241 merges | Proceeds: `kernel/README.md`; the KNOWN-LIMITATIONS items 48 to 50, which are separate paths; and the Part, at a letter no piece in flight holds, so not AC. |

3. **Files step 1 does not edit beside PR C: any of PR C's files.**
   - That includes `workspace/viewTransitions.ts`, which §2.14 lets step 1 edit only under I1.
   - The shell-tests group names no file. A new test file is disjoint, but an edit to any of PR C's test or fill files is not.
   - A need for any of PR C's files beside PR C is I1 for step 1: stop and report.

4. **After PR C merges.**
   - Main is merged into step 1's branch, by a merge, never a rebase.
   - Then P4 to P6 are written against `App.tsx`, `console/surfaceRegistry.ts`, `package.json` and `workspace/viewTransitions.ts` as PR C left them (the seam rule; §2.14's last order bullet).
   - Every literal site is found again at that merge's base, PR C's new files included. A site PR C added is bumped inside the version-literal group (≤ 30 files). An overrun is class 8.

5. **Steps 2 and 3.** §2.14's order sentence, that no 1c step dispatches while a milestone 4 PR is in progress or awaiting merge, stands for them. Amendment 1 item 6 replaced it for step 1 only. Neither step is in flight beside PR C.

6. **Milestone 4's PR B.** This amendment orders nothing against PR B. That order is the human's, and it is recorded before PR B's dispatch.

7. **Rule (00) at this amendment (class 1).**
   - Step 1's branch, at 7109aeb2431d9ca9379cb15b0d027dba78a20217, names no path under `frontends/` in its diff from 43a39222 (milestone 4's PR C re-sweep, step 5).
   - Step 1 is the one piece on `protocol/`, and PR C touches none.

Nothing above is edited.
```

## 3. What changes from my ahead draft, with reasons

```text
1. Rows 8 and 13 are recorded as moved and row 18's number as 52 (class 3). Reason: the re-sweep's step 1 results.
2. Rule (00) now names the 10 Changed pins in PR C's sections as PR A's declared edits, read as "not I4" (class 1). Reason: the re-sweep's step 3 found them changed, and without that reading a gate could take them for I4.
3. C is named as e7eb8f2e, and the series as run at a533a598, with a by-script file-list slot. Reason: the re-sweep and the series ran at different commits. The claim that main changed records only between them has to be proved, not asserted.
4. The KNOWN-LIMITATIONS numbers are 54, 55 and 56, not 53, 54 and 55. Reason: covering-case's committed Scope line and its section 4 hold 53. That piece stopped at H3 (its Amendment 2), but it is still in flight and its route is the human's.
5. A line at column 0 goes before item 54. Reason: items 51 and 52 follow item 46 with no column-0 line (KNOWN-LIMITATIONS.md:407-415 @ 858092e3), so PR C's items would not render at their numbers otherwise.
6. The base series result is filled in: no I3, I6 not fired, and source-changed's post route S5d INCONCLUSIVE, read under Amendment 2 item 9. Reason: the tester's report.
7. "WorkingCanvas.tsx is the only product caller of decodeBatch" is removed. The claim now rests on the required parameter and tsc. Reason: at C only the push callers were re-read (row 7), and tableSource.ts becomes a second caller.
8. Item 5 drops the sentence giving PR B a defined outcome. Reason: no PR B hook in PR C (§8 item 13, and the architect's own added check). PR B's amendment decides that.
9. TABLE_MAX_ATTRIBUTE_BYTES joins §8 item 13's check, and the architect checks it against ADR-010 rule 6. Reason: it is a class 9 addition on a standing rule, so its caller and rule are named at the gate.
10. The Part note now covers AC's opening sentence (MANUAL-WALKTHROUGH.md:1972) and its fixture line as well as its heading. Reason: that sentence says "PR A's rows only, run only on a build after PR A's merge", which is untrue once PR C adds rows.
11. The managers' tests are named as a class 8 risk beside decodeBatch.test.ts. Reason: PR A overran candidateArmSession.test.ts (149 of 60) and viewportStreamManager.test.ts (88 of 40), and PC-U12 edits the same files.
12. Rule (00) now gives per-branch facts at C from the re-sweep's step 5. It adds port-2's declared 16 files and covering-case, and requires a re-read at the dispatch commit for #241 at 50c634a8 and port-2 at 83d2ecef. Reason: branches moved after C.
13. The 1c record is drafted (item 2) instead of noted as owed. It adds P4's hold through the completeness test. Reason: the brief asked for it. Also, P4 is disjoint by file but coupled to surfaceRegistry.ts through surfaceCompleteness.test.ts:250-253, which my ahead draft did not see.
14. Every e6dfe624 or 507197c1 cite is replaced by @ 858092e3 or a re-sweep row at C. The [base] marks are resolved. Reason: the pins must be at a commit I read, and the facts are now settled at C.
15. "Superseded for PR C" and the Next order are added: 1c's Amendment 3 first, then the branch brought to main by fast-forward or merge. Reason: the amendment must land on the code's branch before code, and the 1c record must precede PR C's code.
```

## What I could not settle

1. **The base series report is not committed at 858092e3.** It is staged in the main checkout. I read it from the working tree, so I cannot pin it to a commit. The custodian should commit it before the amendment, which cites it by path only. The claim that main changed records only between e7eb8f2e and a533a598 is the custodian's to prove by the file list.
2. **The value of `TABLE_MAX_ATTRIBUTE_BYTES` (67,108,864)** is a declared choice and is not measured. It is the custodian's to approve or replace before commit. If it is not adopted, delete item 5, PC-U13 and their item 10 lines.
3. **Finding on main (Documentation, not PR C's path).** Items 51 and 52 (`KNOWN-LIMITATIONS.md:411`, `:415` @ 858092e3) follow item 46 with no line at column 0. Under CommonMark they render as 47 and 48. This is inferred from the source lines; I could not render the file. Covering-case's section 4 adds a column-0 line before 53 only when the item above is not 52, so 53 would mis-render too. The fix route (one column-0 line before 51) is the custodian's.
4. **`tableSource`'s ending on a `decodeBatch` throw has no stated terminal.** That covers the projection mismatch, the frame check, and a column type the shell does not read. §2.4 (b) names Completed, a refusal and `engine.source_changed` only. My recommended reading, class 1 at code: the stream ends, its handle is cancelled, and the shell's own line states the shell's consequence. LargeUtf8 and Utf8View stay open (Amendment 6 item 4; the re-sweep's step 6).
5. **The fill sites at C are not re-proved site by site.** Only the 22 paths are. `tsc` at the code's base finds them, and a miss is I1 under item 3.
6. **Treating `skp/0.12` at `surfaceRegistry.ts:78` as not a literal site is my reading.** If the custodian reads it as one, P2 waits for PR C's merge as well.
7. **Outside PR C:** 1c's O1 and port-2 both list `kernel/tests/no_generation_in_persisted_artifacts.rs` (1c Amendment 1 item 6, O1; port-2 §7 file 14). Rule (00) between those two pieces is the custodian's.
8. **Rule (00) after C** rests on records only. I could not read the branch diffs of #241 at 50c634a8, port-2 at 83d2ecef or #248. Item 9's last bullet orders that re-read.

Files I read: `C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md`, `C:/dev/spatial-ide/state/consults/2026-10-23-b1-shell-half-pr-c-re-sweep.md`, `C:/dev/spatial-ide/state/consults/2026-10-23-b1-shell-half-pr-c-base-series-tester-report.md`, `C:/dev/spatial-ide/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, `C:/dev/spatial-ide/engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md`, `C:/dev/spatial-ide/KNOWN-LIMITATIONS.md`, `C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md`, `C:/dev/spatial-ide/frontends/shell/src/console/surfaceCompleteness.test.ts`, `C:/dev/spatial-ide/frontends/shell/src/console/surfaceRegistry.ts`, `C:/dev/spatial-ide/frontends/shell/src/workspace/selection.test.ts`, `C:/dev/spatial-ide/frontends/shell/src/workspace/workspaceBoundary.test.ts`, `C:/dev/spatial-ide/PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md`, `C:/dev/spatial-ide/docs/adr/ADR-010-render-frames-origins-boundaries.md`, `C:/dev/spatial-ide/engine/src/stream.rs`.
