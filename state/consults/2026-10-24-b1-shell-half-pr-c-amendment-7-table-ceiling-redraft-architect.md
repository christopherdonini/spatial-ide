*Custodian's filing note (2026-10-24): milestone 4 PR C's dispatch amendment (Amendment 7) redrafted read only by the architect at main 4de4b9a9 for the human's ruling headed 2026-10-24, item 2 (TABLE_MAX_ATTRIBUTE_BYTES approved as a declared, unmeasured ceiling, its derivation at the constant, the table stopping and saying so at the ceiling). Its Amendment 7 block is appended to the form in the commit that files it, with its slots filled and its full-commit cites pinned by script. Its reading of the table's own words, and the other reading it names, go to the human's sight with the stopped line. The run 07:54:41Z to 08:00:52Z by its transcript (Read 12, Grep 7; no Write, Edit or Bash). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is fd27cba3f59cc058cba17379162cceeee22950eb085c6ecbd5103e91926658c4.*

---

Redrafted: b1-shell-half PR C Amendment 7 for the table ceiling ruling, at main 4de4b9a9 (main @ 4de4b9a91837a4faa181e8f1e8b6260158db665d)

I had no shell, so I ran no git. I read the main checkout's working tree. At the start of the session git status showed only two untracked files, neither of which I read, so every tracked file was read as it stands at 4de4b9a9. I read the following: my draft from its line 5; the ruling at line 10 (item 2); the milestone 4 form at §1, §2.2 (d), §2.4, §2.6, §2.7, §3, §4, §5, §7, §8, §9, §10, §11 and Amendments 4 to 6; ADR-010 rule 6; `frontends/shell/src/canvas/limits.ts`; `frontends/shell/src/canvas/decodeBatch.ts` at lines 80 to 139; the plan's label table at `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:42-52` @ 4de4b9a9; KNOWN-LIMITATIONS items 45 to 52; and the PLAN node `table-max-attribute-bytes-measurement`, which is on main with status proposed. No sha256 appears below. Every word below is mine (the architect's), and none of it is the human's wording. Where I restate the ruling, it is a paraphrase, never a quotation.

## Changes against my draft, by item

1. **Item 5's ceiling bullet.** The value is stated as 67,108,864 (64 MiB), declared and not measured, and the custodian's slot is removed. The bullet names the derivation and the measurement node (`table-max-attribute-bytes-measurement`, before any performance claim). The constant's doc comment follows. These are my words, a draft and not the human's wording. The worker applies them and the PR body lists them.
   ```ts
   /**
    * The attribute data the first scope's rows may hold in all: the sum of `attributes.bytes` (each batch's copy of its projected
    * columns, an Arrow IPC stream, so offsets, validity and framing count) over the batches tableSource has added. Milestone 4's
    * form, Amendment 7 item 5; ADR-010 rule 6; approved by the human on 2026-10-24
    * (state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md, item 2).
    * 64 MiB, declared, not measured: 1,000 rows (TABLE_MAX_ROWS) x 32 columns (ATTRIBUTE_PROJECTION_MAX) x about 2 KiB a value
    * (67,108,864 / 32,000 = 2,097 bytes). The node table-max-attribute-bytes-measurement measures it, before any performance claim.
    * At the ceiling the table stops adding rows and says so: a batch that would pass it is not added, the stream is cancelled, and
    * the stopped line shows the rows already added; no row is left out without that line.
    */
   export const TABLE_MAX_ATTRIBUTE_BYTES = 67_108_864;
   ```
   Clause check:
   - "`attributes.bytes` … an Arrow IPC stream" holds by `decodeBatch.ts:128-129` @ 4de4b9a9, where `bytes` is `data.byteLength` of `tableToIPC(...)`.
   - The arithmetic: 1,000 × 32 × 2,048 = 65,536,000 ≤ 67,108,864, and 67,108,864 / 32,000 = 2,097.152.
   - The ruling's path is tracked on main, and the comment keeps it unbroken on one line (round 15 (d)).

2. **Item 5's behaviour bullet.** The not-held behaviour is replaced by the stop.
   - **Adding rows** is `tableSource` appending each decoded batch's ids and values, in arrival order.
   - **The stop.** If a batch would take the held sum past the ceiling (`>`, as `limits.ts:89` @ 4de4b9a9 reads it), that batch is not appended. The source cancels its stream and appends no later batch from it.
   - **What is kept.** The table keeps and shows every row already appended. The refused batch is released.
   - **What it says.** The stopped line takes the count line's place, and the liveness line ends.
   - **The rest of the first scope:**
     - The not-held marking leaves the table altogether, and the canvas's marking is unchanged.
     - The count line becomes three lines.
     - The ids are those of the shown rows only.
     - A stopped result is not complete for §2.4 (c), which is new and needed for Correctness: otherwise a member the stop cut off would be failed.
     - Nothing for PR B lands. PR B meets the same stop through `tableSource`, and PR B's amendment says what happens then.
   - **The stopped line** is a P6 placeholder drafted in item 5. It is not the human's wording, and the human sights it at row AC7.
   - **Reading of "the table's own words".** I took it as the Table's own line, shown in its tab: the owner states its own consequence. It is worded in the label the user sees for rows, "features" (plan §3's table, `state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49` @ 4de4b9a9, pinned in §2.4 (a)).
   - **The other reading.** The ruling's clause after its colon is itself the wording, to be carried byte for byte (by script, marked) wherever the behaviour is stated. Under that reading the app's line would say "rows", which the plan's label table replaces with "features" in text the user sees. That conflict is the human's to resolve.

3. **PC-U13 and a new PC-U14.**
   - PC-U13 is rewritten for the stop.
   - PC-U14 (`tableScope.test.ts`, already on §2.6's list) proves that a stopped result is not complete.
   - No other test, e2e step or Part row asserted the not-held table behaviour. I checked §4 and §9's rows 6 to 8.
   - Item 6's E2E bullet gains one sentence: no step is designed to reach the ceiling, and the stopped line in any suite is a §3 miss (class 2).

4. **Carried.**
   - The heading and the italic paragraph name the ruling, and the paragraph names this redraft.
   - Item 8: AC7 names the stopped line, and item 54 gains the ceiling sentence.
   - Item 10: §8 items 11 and 13, the architect's check against the ruling, and the reviewer's PC-U7 to PC-U14.
   - The Superseded index gains two lines.
   - Section 3 of my draft, item 9 becomes: "TABLE_MAX_ATTRIBUTE_BYTES joins §8 item 13's check, and the architect checks it and its stop against ADR-010 rule 6 and the human's ruling of 2026-10-24, item 2. Reason: it is a class 9 addition on a standing rule, and its value and behaviour are the human's, so its caller, rule and ruling are named at the gate."
   - A new section 3 item 16: "Item 5's not-held behaviour is replaced by the stop, PC-U13 is rewritten and PC-U14 added. Reason: the human's ruling of 2026-10-24, item 2."
   - Section 3 item 8 stands.
   - What I could not settle item 2 is settled by the ruling.

5. **KNOWN-LIMITATIONS: yes.** Item 54 (KL-1) must state the ceiling. "At most `TABLE_MAX_ROWS`" stays true, but an operator could meet a shorter list with no item naming why. The words are a draft for the human's sight, not the human's wording, and they add no line: one sentence joins item 54's paragraph line, and one clause joins its source comment.
   - The sentence: `In its Filtered scope the Table also stops adding features when the next ones returned would take its attribute data past 67,108,864 bytes (64 MiB): it shows the features already added and says that it stopped, and more features may pass the filter than it shows.`
   - The comment clause: `TABLE_MAX_ATTRIBUTE_BYTES in frontends/shell/src/table/tableConstants.ts, declared, not measured (PLAN node table-max-attribute-bytes-measurement), and its check in frontends/shell/src/table/tableSource.ts (milestone 4's form, Amendment 7 item 5; the human's ruling of 2026-10-24, item 2).`
   - Clause check:
     - "Filtered" is plan §3's first scope label (§2.4 (a)'s pin).
     - The rest is checked against item 5's stop, keep and say bullets.
     - "may pass" holds because the stream is cancelled before its terminal.
   - Items 55 and 56 are unaffected. KL-2's "not established" stays true, and covers more members.

6. **1c's Amendment 3 stays as drafted.** It cites only Amendment 7 item 3's additions, and item 5 adds no file.

## Amendment 7, as it should commit

```markdown
## Amendment 7: PR C's re-sweep at C e7eb8f2e and its base series at a533a598, written after both results were seen. No invalidator. Rows 8 and 13 are moved cites, and row 18's number and §2.6's count are corrected (class 3). Four product files, five test files and thirteen fill files join PR C's list, and the first scope's held bytes are bounded under ADR-010 rule 6 by a declared ceiling, at which the first scope stops and its line says so, on the human's ruling of 2026-10-24 (class 9). The base series, the readings, the Part rows, the numbers 54 to 56 and rule (00) are class 1.

*Written after PR C's re-sweep and its base e2e series were seen, before any PR C code. Drafted read-only by the architect at main 858092e340ac650822afea87b50b3ce00e50bd40 (`state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, item 1), from its PR C draft drafted ahead (`state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md`, PR C part); item 5 and the lines that depend on it redrafted read-only at main 4de4b9a91837a4faa181e8f1e8b6260158db665d (`state/consults/2026-10-24-b1-shell-half-pr-c-amendment-7-table-ceiling-redraft-architect.md`). References only; nothing below is a quotation, and none of it is the human's wording. Item 5's value and behaviour rest on the human's ruling of 2026-10-24 (`state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md`, item 2), restated in the architect's words. The re-sweep is `state/consults/2026-10-23-b1-shell-half-pr-c-re-sweep.md` [custodian: its sha256 from line 5, by script], at C = e7eb8f2e98c4dcb033161573f8b8fa312169d70d. The base series is `state/consults/2026-10-23-b1-shell-half-pr-c-base-series-tester-report.md` [custodian: its sha256 from line 5, by script], run at a533a598e4e139e2fbd2793ded328472cc977036 [custodian: by script, the file list of `git diff --name-only e7eb8f2e98c4dcb033161573f8b8fa312169d70d a533a598e4e139e2fbd2793ded328472cc977036`, records only]. Every pin at 4b26d279, 55618ab5, c6de9b48, 0ff8db4e, 72868422 or e6dfe624, and every fact of 507197c1, is historical (§0.3). For PR C's work the tree at C is authoritative, and at the code's base the tree at that base. The scope addition rests on the cross-module seam rule (RULED 2026-09-16, question round 4) and on §2.6's last paragraph (round 25, item 2 (a)). §7 is not edited.*

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

5. **The first scope's held bytes (class 9, on ADR-010 rule 6: capacity ceilings are declared, not discovered; the value and the behaviour are the human's ruling of 2026-10-24, item 2, restated here in the architect's words).**
   - **The gap.** The first scope's copied attribute bytes have no declared ceiling, and they are not in `RESIDENT_ATTRIBUTE_MAX_BYTES`'s sum, which covers the canvas's active set only. The engine bounds each batch, not the sum over up to 1,000 rows' batches.
   - **The ceiling.** `TABLE_MAX_ATTRIBUTE_BYTES` = 67,108,864 (64 MiB), declared in `table/tableConstants.ts` beside §7's table constants. Its doc comment states the derivation: 1,000 rows (`TABLE_MAX_ROWS`) × 32 columns (`ATTRIBUTE_PROJECTION_MAX`) × about 2 KiB a value. The value is declared, not measured. Its measurement is the PLAN node `table-max-attribute-bytes-measurement`, before any performance claim. The comment's words are the architect's (the redraft consult, section 1 of its changes), applied by the worker and listed in the PR body.
   - **What it sums.** The `attributes.bytes` of each batch the first scope has added, as `RESIDENT_ATTRIBUTE_MAX_BYTES` sums them for the canvas; a batch with `attributes` null adds 0. The sum is per result: a superseding stream starts it at 0. `tableSource` does not call `withinAttributeCeiling` and holds no `"not-held"` batch.
   - **Its behaviour: the first scope stops adding rows, and its line says so.**
     - **Adding rows** is `tableSource` appending each decoded batch of its one stream, its ids and values, to the result, in arrival order.
     - **Where it stops.** Before appending a batch, the source adds that batch's bytes to the sum held. If the total would pass the ceiling, the batch is not appended. A total equal to the ceiling is within, as `withinAttributeCeiling` reads it. The source then cancels its stream through the client's `cancel`, as Cancel does, and appends no later batch of that stream.
     - **What it keeps and shows.** Every row of the batches appended before the stop, with its values, in arrival order. The batch that would pass is decoded before the check and released, so the result holds at most the ceiling.
     - **What it says, and where.** The stopped line below shows in the count line's place, and the liveness line ends. No count line shows for a stopped result.
     - The stop is the source's own, not an operator action, so it records no class C row (§2.5).
     - Supersede, hide, collapse, open, replace, generation end, session end and `engine.source_changed` act on a stopped result as §2.4 (b) states.
   - **What else this changes in the first scope.**
     - **Not-held:** the first scope has no not-held state, and no table row is marked not-held. The canvas's not-held marking (§2.2 (d)) is unchanged.
     - **The count line:** §2.4 (b)'s two lines stand for a result that ends Completed. The stopped line is a third, for a stopped result.
     - **The ids:** a stopped result holds the ids of the rows it shows, and only those. For §2.4 (c), a stopped result is not complete. A member whose id it lacks is counted not established (P6), never failed. A member whose id it holds passes, by §2.4 (c)'s third case.
     - **PR B:** nothing for PR B lands in PR C (item 4). PR B's cases query through `tableSource` meets the same stop, and PR B's amendment states what follows.
   - **The stopped line** (a P6 placeholder in the architect's words, not the human's wording; sighted at Part row AC7):
     `[P6 placeholder] The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first ${n} features returned, in no declared order; more may pass the filter.`
     - "stopped adding features": no batch is appended after the one that would pass. "Features" is plan §3's label for the table's rows (§2.4 (a)).
     - "the next ones returned would have taken its attribute data past 64 MiB": the batch the stream returned and the source did not append. "64 MiB" is written from `TABLE_MAX_ATTRIBUTE_BYTES`.
     - "the first ${n} features returned": `n` is the rows held, in arrival order.
     - "in no declared order": the query has no sort (§2.4 (b)).
     - "more may pass the filter": the stream is cancelled before its terminal.
   - **Files.** No file is added: `tableConstants.ts`, `tableSource.ts`, `TableTab.tsx`, `tableSource.test.ts` and `tableScope.test.ts` are on §2.6's list, inside their §7 ceilings.

6. **Tests, e2e and fixtures.**
   - **The standing rows.** §4's PC-U1 to PC-E4 stand. `tableSource.test.ts` builds its batches with `testUtils/attributeBatchIpc.ts` and mocks only the transport; mocking `decodeBatch` is I5.
   - **New rows.** Each mutation is observed as §4 states: apply it, run the named test, record its failure by name with the commit, and revert. No `verify-mutation` run is an observation.
     - **PC-U7** (`WorkingCanvas.wiring.test.tsx`): a batch pushed through `pushBatch` and through `pushTileBatch` under filter F is resident with `filter` F. Mutation: the push passes `null`; fails.
     - **PC-U8** (`tileIngest.test.ts`): the trim carries `filter` as the same object. Mutation: the literal writes `null`; fails.
     - **PC-U9** (`tileResidentSet.test.ts`): the duplicate drop carries `filter`. Mutation: the same; fails.
     - **PC-U10** (`clickEffect.test.ts`): a Select click on a feature carries `row` and `filter` into `selection.apply`, and the reducer keeps them on the member. Mutation: the Select branch sends `filter: null`; fails.
     - **PC-U11** (`clickPick.test.ts`): `resolveClickPick` carries the candidate batch's `filter`. Mutation: `null`; fails.
     - **PC-U12** (the three managers' tests, in PA-U7's shape): every `onBatch` carries its stream's filter, the first look included. Mutation: the first look passes `null`; fails.
     - **PC-U13** (`tableSource.test.ts`): batches are decoded by the real `decodeBatch` from the helper's IPC, and the test reads each batch's `attributes.bytes` from its decode. The first k batches sum within `TABLE_MAX_ATTRIBUTE_BYTES`, and the next one passes it. The result holds exactly the first k batches' ids and values, in arrival order. The source cancels its stream once, and a batch delivered after the stop is not added. The stopped line shows with `n` equal to the rows held, and no count line shows. Mutation: the sum omitted, each batch checked alone; fails.
     - **PC-U14** (`tableScope.test.ts`): a stopped first-scope result is not complete. A member whose id it lacks is counted not established, never failed. Mutation: a stopped result read as complete; fails.
   - **§5, declared unchanged:**
     - every existing assertion in `tileIngest.test.ts` and `tileResidentSet.test.ts`;
     - the trim's and the dedupe's choices;
     - `applySelectionMode`'s outcomes and `SELECTION_MAX_FEATURES`;
     - `countSelection`'s counts;
     - the layout reducer (§2.1).
   - **E2E.** PR C adds `frontends/shell/e2e/table.mjs`, one `e2e:table` script line and one `e2e/README.md` entry.
     - The tester's series at PR C's gate head is every suite at the base plus `e2e:table`, with PC-E1 to PC-E4's mutations observed.
     - It runs on the port-5400 harness under THE MACHINE paragraph (§9), with Amendment 2 item 4's harness corrections carried over.
     - No e2e step is designed to reach item 5's ceiling. PC-U13 and PC-U14 prove the stop from real decoded batches. The stopped line in any suite is a §3 prediction miss, class 2.
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
     - AC7 names item 5's stopped line, for sight as its text: no Part step is designed to reach the ceiling.
   - **KNOWN-LIMITATIONS: KL-1 is item 54, KL-2 item 55 and KL-5 item 56.**
     - Item 47 is #241's, items 48 to 50 are 1c's K-2 to K-4, and items 51 and 52 are PR A's (`KNOWN-LIMITATIONS.md:411` @ 858092e340ac650822afea87b50b3ce00e50bd40, `KNOWN-LIMITATIONS.md:415` @ 858092e340ac650822afea87b50b3ce00e50bd40).
     - Item 53 is held by covering-case's committed form: its Scope line (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:6` @ 858092e340ac650822afea87b50b3ce00e50bd40) and its section 4 (`engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-PREREGISTRATION.md:88` @ 858092e340ac650822afea87b50b3ce00e50bd40). That piece stopped at H3 before any code (its Amendment 2), and its route is the human's. The number stays held until that route releases it. PR C's numbers do not move if it is released.
     - Unless item 53 stands directly above item 54 at PR C's KNOWN-LIMITATIONS commit, a line at column 0 goes before item 54 so that it renders as 54, as for items 42 and 44 (`KNOWN-LIMITATIONS.md:190` @ 858092e340ac650822afea87b50b3ce00e50bd40).
     - Item 54 also states item 5's ceiling and its stop, as one sentence in its paragraph and one clause in its source comment. The words are the architect's (the redraft consult, section 5 of its changes), a draft for the human's sight and not the human's wording.
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
    - **§8 item 11** also covers the stopped line: it claims no more than item 5 establishes, and a stopped result is never read as complete.
    - **§8 item 13:** the canvas's new handle method, and `TABLE_MAX_ATTRIBUTE_BYTES` with its check, have their product callers in PR C.
    - **§8 item 17** gains the filter seam, proved from the real decode by PC-U7 to PC-U12.
    - **The architect adds:**
      - no PR B hook in `tableSource`;
      - `candidateArmSession.ts`'s diff is only the filter argument (item 4);
      - item 5's ceiling and its stop are checked against ADR-010 rule 6 and the human's ruling of 2026-10-24, item 2: the derivation at the constant, the measurement node named, no performance claim, no not-held state in the table, and no row left out without the stopped line.
    - **The reviewer adds:**
      - `tsc --noEmit` clean at the head;
      - the thirteen fill files' diffs contain only item 3's forms;
      - the mutations of PC-U7 to PC-U14, applied again.

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
- §2.4 (b)'s terminals and count line: added to by item 5 (the stop and its line).
- §2.4 (c)'s complete result: read with item 5 (a stopped result is not complete).

Read the last amendment first.

Nothing above is edited.
```

## What I could not settle

1. **The reading of "the table's own words"** (change 2) is the human's to confirm. The two readings differ on whether the app's line says "features" (plan §3's label) or "rows" (the ruling's word).
2. **PC-U13's memory.** To pass 64 MiB, the test must decode batches whose attribute copies sum past 67,108,864 bytes, for example five rows each carrying a value of about 16 MB. A test-only smaller ceiling would be an option with no product caller (§8 item 13), so I did not propose one. If the worker finds that the helper cannot build such a batch, that is I1, reported before code.
3. **The stop is proven at unit level only.** An e2e proof would need a fixture carrying about 64 KiB of attribute data a row, and item 6 forbids a new generator. That fixture is the measurement node's, if anyone's.
4. **PR B (forward note, not PR C's).** The KL-3 words ruled yes say the categories come from "at most" 1,000 features, which stays true under the stop. Whether PR B's cases query shows the stopped line, and whether its Colour by applies over a stopped result, is PR B's amendment's to state.
5. **The stop's cancel and the client's recorder.** I did not read whether `cancel` writes a class A row. Item 5 says only that the stop records no class C row.

Files read: `C:/dev/spatial-ide/state/consults/2026-10-23-b1-shell-half-pr-c-dispatch-amendment-architect-draft.md`, `C:/dev/spatial-ide/state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md`, `C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, `C:/dev/spatial-ide/docs/adr/ADR-010-render-frames-origins-boundaries.md`, `C:/dev/spatial-ide/frontends/shell/src/canvas/limits.ts`, `C:/dev/spatial-ide/frontends/shell/src/canvas/decodeBatch.ts`, `C:/dev/spatial-ide/state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md`, `C:/dev/spatial-ide/KNOWN-LIMITATIONS.md`, `C:/dev/spatial-ide/PLAN.yaml`, `C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-c-and-pr-b-ahead-architect-draft.md`.
