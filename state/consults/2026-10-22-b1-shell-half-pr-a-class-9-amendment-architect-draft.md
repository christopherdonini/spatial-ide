*Custodian's filing note (2026-10-22): the architect's draft of milestone 4 PR A's Amendment 3 (class 9), read only at main 0ff8db4e with the code at B 55618ab5. The run 16:52:48Z to 17:03:44Z by its transcript (Read 28, Glob 4, Grep 29; no Write, Edit or Bash). It resolves PR A's I1 stop: three product files, their tests, one test helper and nine null fills join PR A's list; the duplicate drop keeps a row map; every new member is required; PR A becomes 53 files and 3,940 lines. No OPEN item. The amendment is committed to the form from its heading to its closing line, its 25 line cites pinned by script. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 2f1526ec71ce34348fd12f4c3d93a7ca9a2b7b724b9fe0c8f6eb340202c03b3a.*

---

Drafted: b1-shell-half, PR A's Amendment 3 (class 9), at main 0ff8db4e

Reviewed: main @ 0ff8db4e (the form, the 1c form, the engine and the SKP text), and the code at cut/b1-shell-half-pr-a @ 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f, read in the worktree C:/dev/wt/m4a. Its branch ref resolves to that commit. I made no edits.

I have no shell, so this draft carries no sha256. The custodian pins every cite by script: code at 55618ab5, a main commit since Amendment 2 pins there, and everything else at 0ff8db4e.

---

## Amendment 3: scope addition (class 9), written after the worker's I1 stop was seen. Three product files, their tests, one test helper and nine null fills join PR A's list in §2.6. The duplicate drop keeps a row map. Every new member is required (class 1).

*Written after PR A's worker stopped at I1, and before any PR A code. The stop is recorded in `state/consults/2026-10-22-b1-shell-half-pr-a-i1-stop-worker-report.md`. This is a scope addition. §2.6's last paragraph makes a file added to a PR's list class 9 (round 25, item 2 (a)). The standing rule that adds the work is the cross-module seam rule (RULED 2026-09-16, question round 4): the decode, residency and inspect seam is written against what the residency and click code have at B. The architect drafted this read-only at main 0ff8db4e, with the code at B 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. §7 is not edited. Nothing below is a quotation.*

1. **The need (class 1).** At B, three product sites outside §2.6 build, by naming fields, the objects that §2.2 (c) and (e) widen:
   - `trimBatchToVertexBudget` rebuilds a `ResidentBatch` (`frontends/shell/src/canvas/tileIngest.ts:222-230 @ 55618ab5`).
   - `TileResidentSet.addBatch` rebuilds one after a duplicate drop and re-indexes the rows (`frontends/shell/src/canvas/tileResidentSet.ts:225-254 @ 55618ab5`).
   - `clickEffect` builds `inspect.set`'s params from the click (`frontends/shell/src/feature/clickEffect.ts:67-71 @ 55618ab5`). Its `ClickInput` mirrors `ClickPick` (`frontends/shell/src/feature/clickEffect.ts:17-34 @ 55618ab5`), and App passes the canvas's click to it unchanged (`frontends/shell/src/App.tsx:1880-1886 @ 55618ab5`).

   Both rebuilds are on the candidate arm's ingest path (`frontends/shell/src/canvas/tileIngest.ts:169-179 @ 55618ab5`). Left unedited, each one drops the new member.

2. **The trim (`tileIngest.ts`): carried unchanged.**
   - The trim keeps a prefix. Kept row r is source row r for every r below the count, and `partToRow` is the source's prefix (`frontends/shell/src/canvas/tileIngest.ts:195-205 @ 55618ab5`). So every row a kept part resolves to is the decode pass's own row for that id.
   - The trimmed batch therefore carries `attributes` as the same object: `null`, `"not-held"`, or the block. No copy is made (ADR-004).
   - `bytes` stays the source's. The rows trimmed away stay in `data` until the batch is released, so PA-U6's sum is the bytes actually held.
   - The trim's choice of rows and the vertex ceiling are unchanged. I8 is not met.

3. **The duplicate drop (`tileResidentSet.ts`): carried with a row map.**
   - **The rebuild.** The attribute block gains `rows: Int32Array | null`. `decodeBatch` sets it to `null`. `addBatch`'s rebuild sets `rows[dst] = srcIdx` in the same `keepIdx` loop that writes `ids`, `parts` and `partToRow` (`frontends/shell/src/canvas/tileResidentSet.ts:235-244 @ 55618ab5`). It carries `names`, `data` and `bytes` unchanged, as the same objects. `"not-held"` and `null` are carried unchanged. The no-duplicate path, which returns the same batch, is unchanged.
   - **The reader.** `values.ts`'s `readRow(batch, row)` reads `data` at `row` when `rows` is null, and at `rows[row]` otherwise. It is the only reader of `data`.
   - **No second map.** In product, every batch reaches `addBatch` with `rows` null: either from `decodeBatch`, or from a trim that carries it unchanged. So no map is ever composed, and no code path does it.
   - **Why §5's falsification and §8 item 4 are untouched.** `data` is read at the decode pass's own row index for that feature. That index is written in the same loop step that copies the feature's id and parts from the decoded batch. §8 item 4 is met as written. §5's first condition is what PA-U9 tests.
   - **Why not mark the batch not-held instead.** A deduped batch would then hold no attributes whenever it repeats a feature that is already resident. In the candidate arm that means every feature straddling a tile edge, and every tile overlapping the first look (`frontends/shell/src/canvas/tileResidentSet.ts:58-82 @ 55618ab5`). That is ordinary use, so KL-4 (not held past the ceiling) would be untrue, which is a Correctness finding.
   - **Why not copy the kept rows.** That would be a second copy per deduped batch on the ingest path (ADR-004), and it is a docs/08 risk with no budget to measure it against (OPEN-2 (b)).
   - **What the row map costs.** `rows` is not attribute data and is not summed into `RESIDENT_ATTRIBUTE_MAX_BYTES`. It costs 4 bytes per kept row. `partToRow` costs the same per part and is not summed either.

4. **The click (`clickEffect.ts`).**
   - `ClickInput`'s feature member gains `row`, mirroring `ClickPick` (`frontends/shell/src/canvas/clickPick.ts:30-33 @ 55618ab5`).
   - The Navigate branch's `inspect.set` params carry `{pick, bounds, row}`.
   - The Select branch and the pinned branch are unchanged. Neither sets an inspected feature.

5. **Every new member is required (class 1, the reading of §2.2 (c) and (e)).**
   - **The choice.** These are required, each typed with `null` as §2.2 writes it: `ResidentBatch.attributes`, `row` on `ClickPick`, on `ClickInput`, on `inspect.set`'s params and on `InspectedFeature`. `decodeBatch`'s projection is a required sixth parameter, and `WorkingCanvas`'s `projection` prop is required.
   - **Against (c).** §2.2 (c) puts the attributes in the decode pass under ADR-010 rule 2, which builds the decoded members together so that a desync is structurally hard. A required member makes the compiler find every site that builds a `ResidentBatch`: the two found at this stop, and any later one. If the member were optional, both rebuilds would have compiled and silently dropped the data. The missing member would then read as `null`, and the Feature tab would state that no column is projected, which is untrue for that feature.
   - **Against (e).** `row` is kept for the generation (ADR-010 rule 5). Required, the compiler proves that each of its four product writers carries it: `resolveClickPick`, App's pass-through, `clickEffect`, and the `inspect.set` reducer (`frontends/shell/src/workspace/viewTransitions.ts:141-147 @ 55618ab5`).
   - **No defaults.** A default value for the sixth parameter or for the prop would be used only by tests. That is a code path with no product caller (§8 item 13).
   - **What this means for the unlisted tests.** Nine of them take a null fill (item 6). Each fill is true of its fixture, because none of them projects a column. App's describe fixture has no projectable column (`frontends/shell/src/App.selection.test.tsx:62 @ 55618ab5`), and the canvas tests' batches carry no attribute column. No assertion, title, comment or recorded mutation changes. In-list test files take their fills inside their own §7 ceilings.

6. **The files added to PR A's list in §2.6, and their lines (class 9).** §7 is not edited. These figures are declared beside it, they are counted by §7's command, and an overrun of either is class 8.

| Group | Files (ceiling each) | At most |
|---|---|---|
| A-P, added | `frontends/shell/src/feature/clickEffect.ts` 10, `frontends/shell/src/canvas/tileIngest.ts` 8, `frontends/shell/src/canvas/tileResidentSet.ts` 30 | 48 |
| A-T, added | `frontends/shell/src/feature/clickEffect.test.ts` (new) 70, `frontends/shell/src/canvas/tileIngest.test.ts` 60, `frontends/shell/src/canvas/tileResidentSet.test.ts` 110, `frontends/shell/src/testUtils/attributeBatchIpc.ts` (new) 80 | 320 |
| A-T, null fills | `frontends/shell/src/canvas/buildLayers.test.ts` 14, `frontends/shell/src/canvas/highlightLayers.test.ts` 6, `frontends/shell/src/canvas/pick.test.ts` 8, `frontends/shell/src/canvas/residentSet.test.ts` 4, `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` 4, `frontends/shell/src/App.command.test.tsx` 4, `frontends/shell/src/App.selection.test.tsx` 2, `frontends/shell/src/workspace/selection.test.ts` 4, `frontends/shell/src/workspace/scope.test.ts` 2 | 48 |
| **Added** | | **416** |

   - **PR A's new totals:** 53 files, and 3,524 + 416 = 3,940 lines.
   - **The four fill forms.** Each null fill takes one of these forms: `attributes: null` in a `ResidentBatch` literal; `row: null` in a click or `inspect.set` literal; `null` as `decodeBatch`'s sixth argument; or `projection: null` in props.
   - **The fill sites at B:**
     - `frontends/shell/src/canvas/buildLayers.test.ts:55 @ 55618ab5`, `:148`, `:185`, `:270`, `:357`, `:407`;
     - `frontends/shell/src/canvas/highlightLayers.test.ts:36 @ 55618ab5`, `:48`, `:57`;
     - `frontends/shell/src/canvas/pick.test.ts:32 @ 55618ab5`, `:79`, `:116`, `:143`;
     - `frontends/shell/src/canvas/residentSet.test.ts:11 @ 55618ab5`, `:45`;
     - `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:93-106 @ 55618ab5` (the base props: the cast hides the required prop from `tsc`, so the fill is named here) and `:306`;
     - `frontends/shell/src/App.command.test.tsx:487 @ 55618ab5`, `:594`;
     - `frontends/shell/src/App.selection.test.tsx:309 @ 55618ab5`;
     - `frontends/shell/src/workspace/selection.test.ts:187 @ 55618ab5`, `:260`;
     - `frontends/shell/src/workspace/scope.test.ts:68 @ 55618ab5`.

7. **Tests, one mutation each.** Each mutation is observed as §4 states: apply it, run the named test, record its failure by name with the commit, and revert. No `verify-mutation` run is an observation.

| ID | File | Test | Asserts | Mutation; expected failure |
|---|---|---|---|---|
| PA-U8 | `tileIngest.test.ts` | `trimBatchToVertexBudget carries the attributes unchanged, so each kept row reads its own values` | The batch is decoded from the helper's IPC: ids 11, 22 and 33, with a text column `tag` holding a, b and c. Trimmed to two whole features, `trimmed.attributes` is the source's object (`toBe`), and `readRow` gives a and b. A not-held batch, trimmed, stays `"not-held"`. | The trim's literal writes `attributes: null`. The test fails. |
| PA-U9 | `tileResidentSet.test.ts` | `a duplicate drop carries the attributes with a row map, so each kept row reads its own values` | Tile `0:0` owns id 2. A decoded batch of ids 2, 5 and 7 (`tag` two, five, seven; id 2 has two parts) is added under `0:1`. The accepted ids are 5 and 7, and `readRow` gives five and seven. `accepted.attributes.data` is the decoded batch's `data` (`toBe`), and `bytes` are equal. `partToRow` is as the SH-7 test states. | The rebuild carries the block with `rows: null`. Row 0 then reads two, and the test fails. |
| PA-U10 | `tileResidentSet.test.ts` | `a duplicate drop keeps a not-held batch not-held and a null batch null` | The same drop over a not-held batch accepts it not-held. Over a batch decoded with projection `null`, it accepts it with `attributes` null. | The rebuild writes `null` for any block that is not an object. The not-held case fails. |
| PA-U11 | `clickEffect.test.ts` | `a Navigate click on a feature carries its row into inspect.set, and the reducer keeps it on the inspected feature` | The test calls `clickEffect` with a Navigate view and a feature click. The click's `row` is `readRow` of a decoded batch's row 1. The effect's `inspect.set` carries that row, and `applyViewTransition` puts it on `inspected.row`. This is pure: nothing is mocked. | The Navigate branch sends `row: null`. The test fails. |

   - **One IPC builder, used by all.** The batches in PA-U8 to PA-U11 come from the real `decodeBatch` and `readRow`, over IPC built by `testUtils/attributeBatchIpc.ts`. PA-U3 uses the same helper, so there is one builder.
   - **The helper writes the engine's envelope shape:** `id`, then geometry, then the attributes, with `attribute_columns` as a JSON array of names (`engine/src/envelope.rs:239-256 @ 0ff8db4e`; `engine/tests/data/golden/polygon-wire.golden:34 @ 0ff8db4e`).
   - **No literal blocks.** No test writes an attribute block as a literal (§8 item 17).
   - **End to end.** The product's own end-to-end proof of the click path stays PA-E1.

8. **§5.**
   - **Declared unchanged:**
     - every existing test in `tileIngest.test.ts` and `tileResidentSet.test.ts`, by assertion;
     - the trim's choice of rows;
     - the dedupe's ownership, its suppressor bookkeeping and `duplicatesDropped`;
     - a rebuilt batch's `partToRow`, `partCount` and `totalVertices`;
     - the vertex ceiling;
     - H6. Neither the trim nor the dedupe copies the data; PA-U8 and PA-U9 assert that `data` is the same object.
   - **Invalidators:**
     - I1 fires if `tsc --noEmit` at PR A's head needs an edit to a file outside §2.6 and this amendment.
     - I8 is as stated in §5.

9. **§8 and §9.**
   - **§8 item 4** is read to include two more cases, for every PR: `data` indexed anywhere other than `values.ts`'s reader; and a rebuilt `ResidentBatch` that drops, defaults or re-copies its attributes.
   - **§8 item 17's seams** gain the rebuild seam, proved from the real decode by PA-U8 to PA-U10.
   - **The reviewer adds:**
     - `tsc --noEmit` clean at the head;
     - the nine null-fill files' diffs contain only item 6's four forms;
     - the mutations of PA-U8 to PA-U11, applied again.
   - **The architect adds:** a check of item 3's row map against §8 item 4.

10. **Rule (00) for the added paths** (§2.9; Amendment 2 item 6):
    - **#241**, at 2fc01f59: it has no path under `frontends/shell/src`. Disjoint.
    - **#242**, `verify-quotes-round-item-cites`: its paths are `scripts/plan/**` and `.github/workflows/governance-ci.yml`. Disjoint.
    - **#243**, the docs lane at b24e5281: its four paths (§2.9) include `frontends/shell/src/canvas/buildLayers.ts`, not `buildLayers.test.ts`. Disjoint.
    - **#244**, F7: it edits Part F of `frontends/shell/MANUAL-WALKTHROUGH.md` only. Disjoint.
    - **1c's step 1:** its groups name none of the added paths (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:441-458 @ 0ff8db4e`). Its shell-tests group names no file. Under OPEN-17 (b) (Amendment 1 item 4) and 1c's own order (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:575-577 @ 0ff8db4e`), it edits nothing under `frontends/shell` until PR A merges. Disjoint.
    - **This form's later PRs:** PR C edits `workspace/selection.test.ts`, and PR B edits `canvas/buildLayers.test.ts`. Each comes after PR A's merge, in OPEN-11's order.

11. **Forward note (class 1).** PR C's `ResidentBatch.filter` (§2.4 (c)) is required under item 5's reading, and it meets the same two rebuild sites. PR C's re-sweep adds `tileIngest.ts` and `tileResidentSet.ts`, by class 9, before its code.

12. **Next:** PR A's code from B under this amendment, by one worker-high.

Read the last amendment first.

Nothing above is edited.

---

**OPEN items:** none.
- No choice here is the human's. There is no red line, no ruling narrowed and no sentence of the human's.
- The addition meets no invalidator. It resolves I1. I2 (no dependency: `apache-arrow` is already used by the tests), I5 (PA-U8 to PA-U11 mock nothing) and I8 are not met.

**What I could not settle:**
1. **I ran no `tsc`.** The null-fill list comes from the worker's prototype run (its report's need 3: 30 errors across 19 files) and my own reading at B. The proof is `tsc --noEmit` clean at the head; any further file is I1.
2. **This choice differs from the worker's.** It goes beyond the worker's "optional, none edited" reading: nine unlisted test files take null fills. I chose that on Correctness grounds (item 5). If the custodian wants fewer files, the only change I would accept is optional `row` members with `attributes` kept required. That would trade compiler proof for tests at four named writers, and an absent `row` would still need a reading that is not a test-only path. I do not recommend it.
3. **PA-E1 and PA-E3 may not reach the rebuild.** Whether their clicked feature lies in a deduped tile batch is not established. The rebuild is proven in-process by PA-U9 from the real decode, not by an e2e.
4. **The shape of a decode with no projection.** `protocol/skp/SKP-V0.md:1169 @ 0ff8db4e` reads as no `attribute_columns`. But `engine/tests/data/golden/polygon-wire.golden:8 @ 0ff8db4e` carries `attribute_columns = []`, and `engine/src/envelope.rs:239-251 @ 0ff8db4e` inserts the key with no condition in that span. I did not establish which request produced the golden's line 8, or whether the committed `.arrows` fixtures carry the key (grep cannot read them). `decodeBatch`'s `null` case must accept what the engine actually sends; that is PA-U3's to read, not this amendment's.
5. **The worker's report is staged but not committed at 0ff8db4e.** It must be committed with or before this amendment, which cites it by path as evidence, not as Authority.
6. **`data`'s representation stays the worker's.** Its report proposes an IPC re-encode of the selected columns. The row map does not depend on that choice.

Files read:
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-22-b1-shell-half-pr-a-i1-stop-worker-report.md
- C:/dev/wt/m4a/frontends/shell/src/canvas/tileIngest.ts, tileResidentSet.ts and their tests; decodeBatch.ts; clickPick.ts
- C:/dev/wt/m4a/frontends/shell/src/feature/clickEffect.ts
- C:/dev/wt/m4a/frontends/shell/src/workspace/viewTransitions.ts and workspaceState.ts
- C:/dev/spatial-ide/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md
- C:/dev/spatial-ide/engine/src/envelope.rs
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
