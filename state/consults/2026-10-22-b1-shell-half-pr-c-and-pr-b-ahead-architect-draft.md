*Custodian's filing note (2026-10-22): milestone 4's PR C and PR B dispatch amendments, drafted ahead by the architect, read only at main e6dfe624, with PR A's code at 507197c1. The run 22:35:37Z to 22:50:18Z by its transcript (Read 37, Grep 45, Glob 3; no Write, Edit or Bash). Nothing in it is committed to the form: PR C's amendment is committed after PR A merges and its re-sweep at that base, PR B's after PR C merges, each pinned by script then. OPEN-18 (the widening's placement, the same question as piece 1c's OPEN-A2), OPEN-19 (KL-3's words) and OPEN-20 (the colour of features whose attributes are not held) are the human's, on Monday 2026-10-26; `TABLE_MAX_ATTRIBUTE_BYTES`'s value and §8 item 10's reading are the custodian's, at PR C's and PR B's dispatch. Its item 5 under what it could not settle is met by piece 1c's Amendment 1, item 6. Extracted by script from its SubagentHandback call; nothing else is changed. Its sha256, from line 5 to the end, is f306ec6394641a9dd6ea152785955009d67b60bc05f402935617c6ec3656f67d.*

---

Drafted ahead: b1-shell-half, PR C and PR B, at main e6dfe624

Read at main e6dfe624 (the main checkout), with PR A at `cut/b1-shell-half-pr-a` @ 507197c125179e002eb28fe961e44348466ff66e (the branch ref, read in `C:/dev/wt/m4a`; I could not run `git status` to confirm the worktree is clean at that head). I have no shell, so this report carries no sha256. Every `path:line @ e6dfe624` below is pinned by script when the amendment is committed. PR A's code is cited by path, symbol and commit 507197c1. **[base]** marks a statement that the base can change. A reference to "the form" means `frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md`, cited by section, amendment and item. Nothing below is a quotation.

---

## PR C: draft amendment

**Heading (filled in at commit):** Amendment N: PR C's re-sweep at C, written after the re-sweep's and the base series' results were seen. It contains: [results]; a scope addition (class 9) of four product files, their tests and the fills that carry the stream's filter; the table's held bytes; the Part rows and the numbers; rule (00) (class 1).

*Preamble (the custodian completes it):* Written after the re-sweep and the base series at C, before any PR C code. C is PR A's merge commit on main, or a later main commit named here. Drafted read-only by the architect at main e6dfe624, with PR A's code at 507197c1. Every `@ 4b26d279` pin and every 507197c1 branch fact is historical (§0.3), and the tree at C is authoritative. The scope addition rests on the cross-module seam rule (RULED 2026-09-16, question round 4) and on §2.6's last paragraph (round 25, item 2 (a)). §7 is not edited.

**1. The re-sweep at C (§0.3).** Each fact the form or this amendment relies on that PR A's merge can move, the check that reads it again, and what follows if it differs:

| # | Fact (where read) | Check at C | If different |
|---|---|---|---|
| 1 | `viewportQuery` takes six parameters with `columns` required, and `limit` is `DecU64 \| null` (`frontends/shell/src/skp/client.ts`, `viewportQuery`, 507197c1) | read the symbol | I4 |
| 2 | `decodeBatch` takes six parameters with `projection` required. `ResidentBatch.attributes` is required. `BatchAttributes` carries `rows` (`frontends/shell/src/canvas/decodeBatch.ts`, 507197c1) | read the symbols | I4 |
| 3 | `readRow` is the only reader of `data`, and it reads through `rows` (`frontends/shell/src/attributes/values.ts`, 507197c1) | read it, and search for `.data` | I4 |
| 4 | `ClickPick`'s feature member carries `row` (`resolveClickPick`, `frontends/shell/src/canvas/clickPick.ts`, 507197c1) | read it | I4 |
| 5 | `clickEffect`'s Select branch sends `selection.apply` with `{mode, id, bounds}` only. `ClickInput` mirrors `ClickPick` (`frontends/shell/src/feature/clickEffect.ts`, 507197c1) | read it | I4 |
| 6 | The two rebuilds name every field and use no spread (`trimBatchToVertexBudget` in `frontends/shell/src/canvas/tileIngest.ts`; `TileResidentSet.addBatch` in `frontends/shell/src/canvas/tileResidentSet.ts`; 507197c1). `withinAttributeCeiling` uses a spread (`frontends/shell/src/canvas/limits.ts`) | read them | a new rebuild site joins item 2 by class 9 before code |
| 7 | The push signatures `WorkingCanvasHandle.pushBatch(streamHandle, batchSeq, ipcBytes)` and `pushTileBatch(tileKey, streamHandle, batchSeq, ipcBytes)` (`frontends/shell/src/canvas/WorkingCanvas.tsx`, 507197c1). The managers' `onBatch` signatures. The candidate session's `ingestAndMaybeEstablishFrame` and `issueUntiledQuery`'s sink (`frontends/shell/src/residency/candidateArmSession.ts`, 507197c1) | read them, and search for `.pushBatch(` and `.pushTileBatch(` | I4 |
| 8 | App acquires an export consumer in `handleExportRunning`, which replaces the App pin of §2.4 (e) (`frontends/shell/src/App.tsx`, 507197c1). The `projection` memo is built from `projectionFor(admitted.describe)` | read them | moved cite: class 3; changed seam: I4 |
| 9 | PublishPanel reports an execute run after `publishExecute` (§2.4 (e)'s PublishPanel pin) | read it. The proposed node `publish-dev-hook-attempt-from-effect` would edit this file | I4 |
| 10 | `ACTIVITY_TABS` holds Console and Notices (`frontends/shell/src/layout/contributions.ts:40-43 @ e6dfe624`), and the comment naming the eleven sighted headings is at `:11-13 @ e6dfe624` | read them | I4 |
| 11 | `SelectionMembers` maps an id to its bounds (`frontends/shell/src/workspace/selection.ts:28 @ e6dfe624`), and `applySelectionMode` is at `:76-95 @ e6dfe624`. PR A leaves the file unedited | read them | I4 |
| 12 | UA6 forbids only `skp/client`, `streaming/`, `residency/` and `canvas/` (`frontends/shell/src/workspace/workspaceBoundary.test.ts:28-32 @ e6dfe624`) | read it | I4 |
| 13 | The tile manager's single-retry comment (the doc comment on `RETRYABLE_ENGINE_CODE`, `frontends/shell/src/streaming/tileViewportStreamManager.ts`, 507197c1), `MAX_IN_FLIGHT_TILE_STREAMS`, the two engine pool constants and the kernel lease (§0.2) | read them | I4 |
| 14 | The plan's three scope labels and its word for rows (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49-52 @ e6dfe624`) | read them | I4 |
| 15 | The e2e scripts: 15 `e2e:` entries other than `e2e:debug`, `e2e:attributes` among them (`frontends/shell/package.json`, 507197c1) | read them | the base series runs what is there |
| 16 | The one IPC builder is `frontends/shell/src/testUtils/attributeBatchIpc.ts` (Amendment 3 item 7) | read it | I4 |
| 17 | The fixtures `filter-zoned.parquet`, `100k-happy-path.parquet` and `slow-filter-scan.parquet` | sha256 against the shared folder's copies. #241 edits `engine/src/fixture.rs` (§2.9) | a changed hash stops the run before any suite (§3). A changed `write_geoparquet` is I4 |
| 18 | KNOWN-LIMITATIONS: the highest item on main is 46 (`KNOWN-LIMITATIONS.md:407 @ e6dfe624`). PR A holds 51 and 52 (Amendment 2 item 3) | read at C and on every in-flight branch | class 3, tree authoritative |
| 19 | Part AC's rows AC6 to AC8 are reserved for PR C (Amendment 4 item 10) | read Part AC at C | class 3 |

Invalidators tested at C: I3 by the base series; I4 by rows 1 to 17; I1 by item 2's list. The base series at C is every row-15 suite plus the three scriptless drivers that Amendment 2 item 9 ran, on an exe built at C. It runs under §9's port-5400 harness unless port 5180 has been freed **[base]** (the human's Monday list, `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md:26 @ e6dfe624`). Amendment 2 item 4's harness corrections carry over.

**2. Files and ceilings.**

- **(a) §2.6's list for PR C stands.** One Documentation note: §2.6 says 31 files, but its list names 30 (19 product, 10 test, 1 e2e). The re-sweep records the figure as class 3.
- **(b) Scope addition (class 9).** `ResidentBatch.filter` (§2.4 (c)) is required under Amendment 3 item 5's reading. PR A's code shows that the filter can only reach a batch through these files outside PR C's list:
  - `WorkingCanvas.tsx`, the only product caller of `decodeBatch`;
  - the two rebuilds (Amendment 3 item 11's forward note);
  - `clickEffect.ts`, the only product builder of `selection.apply`.

| Group | Files (ceiling each) | At most |
|---|---|---|
| C-P, added | `frontends/shell/src/canvas/WorkingCanvas.tsx` 40, `frontends/shell/src/canvas/tileIngest.ts` 4, `frontends/shell/src/canvas/tileResidentSet.ts` 4, `frontends/shell/src/feature/clickEffect.ts` 10 | 58 |
| C-T, added | `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx` 60, `frontends/shell/src/canvas/tileIngest.test.ts` 40, `frontends/shell/src/canvas/tileResidentSet.test.ts` 40, `frontends/shell/src/feature/clickEffect.test.ts` 50, `frontends/shell/src/canvas/clickPick.test.ts` 40 | 230 |
| C-T, fills **[base]** | `canvas/buildLayers.test.ts` 12, `canvas/highlightLayers.test.ts` 6, `canvas/pick.test.ts` 10, `canvas/residentSet.test.ts` 4, `attributes/values.test.ts` 4, `canvas/limits.test.ts` 4, `feature/FeatureTab.test.tsx` 4, `App.command.test.tsx` 4, `App.selection.test.tsx` 4, `App.attributes.test.tsx` 4, `workspace/scope.test.ts` 4, `workspace/viewTransitions.test.ts` 6, `layout/StudioLayout.test.tsx` 2 | 68 |
| **Added** | | **356** |

- **New totals:** 52 files, and 3,840 + 356 = 4,196 lines.
- **The fill forms:**
  - `null` as `decodeBatch`'s seventh argument;
  - `filter: null` in a `ResidentBatch` or click literal;
  - `row: null, filter: null` in a `selection.apply` literal;
  - `"activity.table": null` in a slots record (`StudioLayout.test.tsx` builds `Record<SlotId, …>`; the slots record is at `App.tsx` `"activity.notices"`, 507197c1).
- **A fill outside the list** is I1, recorded by class 9 before its code, as Amendment 3 did.
- **Risk:** `decodeBatch.test.ts` has 28 `decodeBatch` calls at 507197c1, each taking the seventh argument, against C-T's `decodeBatch 60`. An overrun there is class 8.

- **(c) Readings (class 1):**
  - **The filter is `decodeBatch`'s required seventh parameter.** It sits beside `streamHandle` and `batchSeq`, which are already stream facts passed in, so every member is set in the decode call, as `projection` is.
    - Each manager's `onBatch` gains the filter its stream was issued with: the tile manager's `this.currentFilter` at issue; `requestViewport`'s `filter`; `issueUntiledQuery`'s `filter`.
    - The canvas's `pushBatch` and `pushTileBatch` take it and pass it to `decodeBatch`.
    - `trimBatchToVertexBudget` and `addBatch` carry it as the same object.
    - `withinAttributeCeiling`'s spread carries it.
  - **`candidateArmSession.ts`.** It is one of §2.6's "three managers named in PR A" for PR C, and §2.6's "Not edited by any PR: `residency/`, beyond the first look's argument" conflicts with that. This amendment reads the line for PR C as: no change to residency planning, budget, retry or lifecycle. The session's edit is carrying the stream's filter from its `onBatch`, and from the untiled sink, to `pushTileBatch`. Any other edit there is I1.
  - **Selection members.** `SelectionMembers` values become `{bounds, row, filter}`.
    - `unionOfBounds` and `countSelection` read `.bounds`.
    - `FeaturePanel.tsx` and `workspaceState.ts` are unchanged, because they name only the type.
    - The existing assertion at `frontends/shell/src/workspace/selection.test.ts:62 @ e6dfe624` reads `.bounds`. Its claim is unchanged; only its access path changes.
  - **`CAPTURED_ROW_MAX_BYTES` lives in `table/tableConstants.ts`, which imports nothing.** `workspace/selection.ts` may import it: UA6 does not forbid `table/` (row 12). The cut is pure and happens in `selection.ts` when a member is added.
  - **`tableSource.ts` decodes through the real `decodeBatch`.** It uses the open's geometry column, encoding and projection and keeps `ids` and `attributes`. A second decoder would be a second frame and projection check (§2.1). The geometry is walked and dropped, with no figure claimed (OPEN-2 (b)). `encodeDecU64(BigInt(TABLE_MAX_ROWS))` is the `limit`, as `issueUntiledQuery` does it.
  - **Second-scope leg 2** ("in a resident batch streamed under it") uses one canvas handle method, say `residentIdsUnder(filter)`, in `WorkingCanvas.tsx`. Its product caller is `tableScope` through App (§8 item 13).
  - **Nothing for PR B lands in PR C.** `tableSource` has the Table tab as its only product caller. Amendment 5's 30 lines in PR B carry the second consumer. Round 8's producer exemption is not invoked.

- **(d) The table's held bytes (ADR-010 rule 6; class 9 on that rule, otherwise a finding for the human).**
  - **The gap.** The first scope's copied attribute bytes have no declared ceiling, and they are not in `RESIDENT_ATTRIBUTE_MAX_BYTES`'s sum (residentAttributeBytes sums the canvas's active set only). `MAX_BATCH_BYTES` (`engine/src/stream.rs:49 @ e6dfe624`) bounds each batch, not the sum of up to 1,000 rows' batches.
  - **Proposal.** Declare `TABLE_MAX_ATTRIBUTE_BYTES` in `tableConstants.ts` beside §7, at 67,108,864. This is a declared value, not a measurement. A first-scope result that would pass it keeps its ids, is marked not-held, and its count line says so (P6). That also gives PR B a defined outcome: an apply over a not-held result is refused with the owner's line.
  - The value is the custodian's to approve or replace.

**3. Tests, e2e, fixtures, Part and numbers.**

- §4's PC-U1 to PC-E4 stand. `tableSource.test.ts` builds its batches with `testUtils/attributeBatchIpc.ts` and mocks only the transport. Mocking `decodeBatch` is I5.
- **New rows, each with a mutation observed as §4 states** (round 25, item 2 (c)):
  - **PC-U7** (`WorkingCanvas.wiring.test.tsx`): a batch pushed through `pushBatch` and `pushTileBatch` under filter F is resident with `filter` F. Mutation: the push passes `null`; fails.
  - **PC-U8** (`tileIngest.test.ts`): the trim carries `filter` as the same object. Mutation: the literal writes `null`; fails.
  - **PC-U9** (`tileResidentSet.test.ts`): the duplicate drop carries `filter`. Mutation: the same; fails.
  - **PC-U10** (`clickEffect.test.ts`): a Select click on a feature carries `row` and `filter` into `selection.apply`, and the reducer keeps them on the member. Mutation: the Select branch sends `filter: null`; fails.
  - **PC-U11** (`clickPick.test.ts`): `resolveClickPick` carries the candidate batch's `filter`. Mutation: `null`; fails.
  - **PC-U12** (the three managers' tests, PA-U7's shape): every `onBatch` carries its stream's filter, the first look included. Mutation: the first look passes `null`; fails.
  - **PC-U13** (`tableSource.test.ts`, if item 2 (d) is adopted): past `TABLE_MAX_ATTRIBUTE_BYTES` the result is not-held with its ids. Mutation: omit the sum; fails.
- **§5 additions, declared unchanged:** every existing assertion in `tileIngest.test.ts` and `tileResidentSet.test.ts`; the trim's and the dedupe's choices; `applySelectionMode`'s outcomes and `SELECTION_MAX_FEATURES`; `countSelection`'s counts; the layout reducer (§2.1). I1 fires if `tsc --noEmit` needs a file outside item 2.
- **E2E:** `frontends/shell/e2e/table.mjs`, one `e2e:table` script line, one `e2e/README.md` entry. The tester's series at PR C's gate head is every suite at C, plus `e2e:table`, with PC-E1 to PC-E4's mutations observed (apply, run, record, revert), under THE MACHINE paragraph.
- **Fixtures.** No new generator, and `kernel/tests/manual_walkthrough_fixtures.rs` is not edited.
  - PC-E1's oracle count is what `generate_the_filter_fixture` prints, counted while writing (zone_counts). The tester runs it at C into its own folder and checks that its file's sha256 equals the shared copy's. The count and the hash go into the series report.
  - §3's "complete under one zone" needs `residential`'s count below 1,000. A miss is class 2.
- **Part:** AC, rows AC6 to AC8, with PR C's new strings named in those rows (Amendment 4 item 10). Part AC's heading, which names PR A, gains PR C (Documentation).
- **Numbers:** KL-1, KL-2 and KL-5 at 53, 54 and 55 **[base]**. They are read again at C and at PR C's KNOWN-LIMITATIONS commit against #241 (47), 1c (48 to 50) and any in-flight branch.

**4. Rule (00) at C**, by file. Everything here is **[base]** and re-checked at dispatch.

- **1c's step 1** is plausibly still in progress outside `frontends/shell` under OPEN-17 (b).
  - PR C shares `App.tsx`, `console/surfaceRegistry.ts` and `package.json` with step 1's shell and e2e groups (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:454 @ e6dfe624`, `:456 @ e6dfe624`).
  - At dispatch, step 1's branch diff from its base must name none of these, nor any file in item 2. Milestone 4 goes first (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:575-577 @ e6dfe624`).
  - Step 1's version-literal group (up to 30 files) is read for any PR C file.
  - Steps 2 and 3 are not in flight.
- **#241, #242 and #244:** after Monday's clicks, merged or awaiting; disjoint by file. #241's `fixture.rs` edit is read through row 17. Once #242 has merged, every round + item cite in this amendment must resolve.
- **#243** merged before PR A (Amendment 2 item 10), so it is on main at C.
- **`record-step-style-match-widening`** (unplaced): disjoint from PR C, since PR C edits neither `skp/types.ts` nor `client.test.ts`.
- **The docs lane's next piece:** read at dispatch for any PR C path, including the new Part AC rows and README entry, which are separate paths.
- **Records:** Part AC rows, items 53 to 55 and the `table` README entry are separate paths.
- **The 1c record:** 1c's form records the OPEN-17 (b) interleave for PR C before PR C's dispatch. See "What I could not settle", item 5.

**5. §8 and §9 additions.**
- **§8 item 4** also covers a rebuilt `ResidentBatch` that drops or defaults `filter`.
- **§8 item 13:** the canvas's new method has its product caller in this PR.
- **§8 item 17** gains the filter seam, proven by PC-U7 to PC-U12 from the real decode.
- **The architect adds:** no PR B hook in `tableSource`; the `candidateArmSession.ts` diff is only the filter argument.
- **The reviewer adds:** `tsc --noEmit` clean, and the fills only in item 2's forms.

**6. Next:**
1. The re-sweep (a worker-high) and the base series (a tester) at C.
2. This amendment, pinned by script.
3. PR C's code by a worker-high on `cut/b1-shell-half-pr-c`.
4. The node's generation goes up by one.

---

## PR B: draft amendment

**Heading:** Amendment M: PR B's re-sweep at B′, written after the re-sweep's and the base series' results were seen: OPEN-16 (b) applied through PR C's `tableSource`; a scope addition (class 9) of `tableSource.test.ts`, with the files OPEN-20 decides; KL-3 as OPEN-19 decides; the Part rows and the numbers; rule (00) (class 1).

*Preamble:* B′ is PR C's merge commit on main, or a later main commit if OPEN-18 puts 1c's step 1 first. Written before any PR B code. §7 is not edited.

**1. The re-sweep at B′.** These are the facts PR C's merge (and, under OPEN-18, step 1's merge and the widening) can move:

| # | Fact | Check at B′ | If different |
|---|---|---|---|
| 1 | **The seam:** `tableSource`'s exported API as PR C merged it, meaning its request, result, supersede, cancel, the export-consumer refusal and `TABLE_MAX_IN_FLIGHT` | read it whole before any PR B line. PR B's caller is written to that interface (the seam rule) | a missing shape is written inside Amendment 5's 30 lines. An overrun is class 8 |
| 2 | `WorkingCanvas.tsx`'s push signatures and `decodeBatch`'s seven parameters (PR C) | read them | I4 |
| 3 | `viewTransitions.ts`, `App.tsx`, `actionRegistry.ts`, `surfaceRegistry.ts`, `styles.css` and `package.json` as PR C left them | read them | class 3 |
| 4 | §0.2's style interfaces: `StyleState`, `StyleDocumentV0`, the Literal-only bullet as PR A rewrote it (Amendment 2 item 2 (c)), style-ts's `legend`/`groups`/`resolve`/`groupFor`, `when: string` (`renderer/style-ts/src/style.ts:55 @ e6dfe624`), `compiled.rs`'s key rule, `buildLayers.ts`'s one colour with #243's and PR A's comment | read them | I4 |
| 5 | `StylePanel.tsx`'s Proposed line (`frontends/shell/src/style/StylePanel.tsx:55 @ e6dfe624`) | a docs-lane piece or a 1c step may correct it first (1c §2.10) | class 3, and PR B drops that edit |
| 6 | `record_step` and the shell's step value type (`frontends/shell/src/skp/types.ts`, `StepIntent` and the `fillColor` member). `SKP_VERSION` | the widening on main or not (§2.3 (h)) | decides `types.ts`'s conditional |
| 7 | 1c's saved `style` member on main | read it | I10. PR B proves a category style saves, by class 9, and reopens only if step 2 has merged |
| 8 | `recording.mjs`'s history reader (PB-E4) | read it | I4 |
| 9 | `publishPrepare` and `publish.rs`'s match-column derivation | read them | I4 |
| 10 | KL numbers, with PR C's at 53 to 55; Part AC rows AC3 to AC5 | read them | class 3 |
| 11 | #241 merged | read it | PR B's suites add the viewer build's scan (§2.9) |
| 12 | The F7 piece merged | read it | the Part F location-word rows may proceed (§2.6) |

The base series at B′ is every suite at B′, `e2e:table` among them, plus the three drivers.

**2. Files and ceilings.**
- §2.6's list stands, with Amendment 5's `tableSource.ts` 30.
- **Documentation:** §2.6 says 33 files, but its list names 30. Recorded as class 3.
- **Class 9 (round 25, item 2 (a), on the seam rule):**

| Group | Files (ceiling each) | At most |
|---|---|---|
| B-T, added | `frontends/shell/src/table/tableSource.test.ts` 80. Amendment 5 added the product file but not its test. A class 9 addition carries §4 tests (template class 9) | 80 |
| B-P, added under OPEN-20 (a) | `frontends/shell/src/canvas/limits.ts` 25, `frontends/shell/src/attributes/values.ts` 40 | 65 |
| B-T, added under OPEN-20 (a) | `frontends/shell/src/canvas/limits.test.ts` 60, `frontends/shell/src/attributes/values.test.ts` 60 | 120 |
| Fills **[base]** | the files `tsc` names when `"not-held"` changes shape, recorded before code | — |

- **Why the OPEN-20 rows exist.** §2.2 (d) says a not-held batch keeps its match column after PR B. No file in PR B's list does that, and item 51's words at 507197c1 (it keeps its shapes without its attribute values; at most 268,435,456 bytes in all) would then be untrue. That is a Correctness risk at PR B's gate. PR B edits item 51 in the same PR (records).
- **A column reader.** `matchGroups.ts` reads the key column through a `values.ts` column reader rather than a `readRow` per row. §8 item 4 keeps `values.ts` the only reader of `data`.

**3. Tests, e2e, fixtures, Part and numbers.**

- §4's PB-U1 to PB-E4 stand. **New rows:**
  - **PB-U8** (`App.colour.test.tsx` or `categoryCases.test.ts`): the apply builds its cases from `tableSource`'s first-scope result only (`bbox: null`, the view's filter, `limit` 1,000, the projection). Mutation: build from the canvas's resident batches; fails.
  - **PB-U9** (`tableSource.test.ts`), the second consumer:
    - with a complete result for the same filter, the apply reuses it and issues nothing;
    - with that stream running, it joins it, with never a second stream;
    - with an export consumer held, the request is refused;
    - the Table tab's hide does not cancel a stream an apply waits on.
    - Mutation: always issue; fails on the stream count.
  - **PB-R3** (`StylePanel.test.tsx`): while the cases query runs, the Style tab shows a P6 line with Cancel (docs/01: never block, every operation cancellable). Cancel ends the stream and applies nothing. Mutation: Cancel not wired; fails.
  - **PB-U10** (OPEN-20 (a)): a not-held batch keeps the match column, and its features draw by it. Mutation: drop it; fails.
- **§3's filter-zoned row, read (class 1):** the four categories are predicted from the first scope's 1,000 of 2,000 features. PB-E1 asserts the legend as built, and each feature's pixel against its zone's swatch, or Other, or No value. A fifth-case miss is class 2.
- **§8, readings:**
  - **Item 10:** a cases query is a table stream. It is issued at the Colour-by apply, a user action, never on pan, and never while a consumer is held. Hiding the tab does not block it, because OPEN-16 (b) puts the cases on that stream. This reading needs the custodian's sign-off, since item 10 says "while hidden".
  - **Item 11:** §2.3 (d)'s owner line counts only within the first scope. It states how many distinct values were found among the N features read and how many of those draw as Other, never a count of features elsewhere.
- **Suites:** every suite at B′, `e2e:colour`, `cargo test -p spatial-renderer`, and the viewer build's scan once #241 has merged.
- **Part:** AC, rows AC3 to AC5, with PR B's strings.
- **Numbers:** KL-3 at the next free number **[base]**. Item 4 gains its "On main" note. Item 51 changes per OPEN-20. KL-5 (PR C's) adds the colour apply's use of the table's stream.

**4. Rule (00) at B′** **[base]**:
- **1c:** see OPEN-18. Under any of its options, PR B is not in flight beside a 1c step that edits `App.tsx`, `surfaceRegistry.ts`, `package.json`, or `types.ts` when the conditional applies.
- **The widening:** shares `types.ts` with PR B only under §2.3 (h)'s second case.
- **The docs lane** (`buildLayers.ts`): #243 is on main by then.
- **The F7 piece:** Part F only.
- **#241 and #242:** as for PR C.
- Re-check each in-flight branch's diff at dispatch.

**5. OPEN-16 (b) applied (class 5, Amendment 5 item 1).**
- §2.3 (d)'s source is one first-scope query through `tableSource`'s single stream, inside `TABLE_MAX_IN_FLIGHT`: reuse, join or issue (PB-U9).
- The cases are taken at the apply and fixed until the next apply.
- KL-3 is worded as OPEN-19 decides.

**6. Next:**
1. OPEN-18 to OPEN-20 answered.
2. The re-sweep and the base series at B′.
3. This amendment, pinned.
4. PR B's code. Its merge waits for the widening on main (§2.3 (h)).

---

## OPEN items

**OPEN-18 (the human's): the widening's placement and PR B's place relative to 1c's step 1.**

The conflict:
- The widening's paths (`protocol/`, `kernel/src/session_history.rs`, `types.ts`, `client.test.ts`; `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:563-566 @ e6dfe624`) overlap step 1's groups, and step 1 is in progress. So the widening cannot run until step 1 merges.
- PR B's merge waits for the widening (§2.3 (h)).
- Under "milestone 4 first" (`:575-577 @ e6dfe624`), step 1's shell groups wait for PR B's merge.

Read literally, that is a deadlock. Options:
- **(a)** Step 1's shell groups run after PR C merges. Step 1 merges, the widening follows as its own piece before step 2 dispatches, and PR B is dispatched after step 1's merge and merges after the widening. I10 fires.
- **(b)** The widening becomes step 1's first commit, by class 9 to 1c's form (the node's title names this route). PR B is dispatched after step 1's merge, and `types.ts`'s conditional drops. This needs one fewer `protocol/` slot and one fewer version step.
- **(c)** PR B merges without the widening. This is excluded by §8 item 12 and OPEN-4 (A′).

**Recommend (b).** Both (a) and (b) put step 1 ahead of PR B on shared shell paths. In your reading, OPEN-17 (b) left 1c's order unchanged, so this is yours to decide.

**OPEN-19 (the human's wording: KL-3).**
- **Source:** your line in the OPEN-7 ruling (`state/directives/2026-10-21-d-s10-go-adr-036-route-i-redaction-open-items-1c-and-milestone-4-ruled-docs-open-1-yes.md:20 @ e6dfe624`, the OPEN-7 clause).
- **The problem.** Written as is, it has a reading that ordinary use makes untrue. "The rest" read as features is false: a feature beyond the first 1,000 whose value is a category draws in that category's colour. A missing value draws as No value. The 13th and later values found inside the 1,000 also draw as Other. "First" has no declared order. The plan's word for rows in the table is "features" (`state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:49 @ e6dfe624`).
- **My words:**

  **Colour by takes its categories from at most the first 1,000 features that pass the layer's filter; other values draw as Other.**
  When you apply Colour by, the app reads at most 1,000 features that pass the layer's filter, in whatever order the engine returns them, and takes the distinct values of the chosen column from those features. At most 12 of those values, the first 12 in code-point order, become categories, each with its colour. On the map a feature whose value is a category draws in its colour, a feature with no value draws as No value, and every other feature draws as Other, including a feature whose value appears only outside those 1,000. The categories are fixed when you apply them; panning, zooming or changing the filter afterwards does not change them.

- **Clause check**, against the form now and against PR B's head at its gate:
  - **"At most 1,000 … pass the filter":** §2.4 (b)'s query with `TABLE_MAX_ROWS` (§7) and the view's filter (PB-U8).
  - **"Whatever order":** there is no sort (§2.4 (b); KL-1).
  - **"Distinct values … first 12 in code-point order":** §2.3 (d) and `CATEGORY_MAX_CASES` (PB-U2).
  - **"No value", "Other":** `onNull` and `onUnmatched` (PB-U3, PB-E1).
  - **"Fixed when you apply":** `fillMatch` is set once by `style.set` (§2.3 (g)), and `filter.apply` leaves the style alone. This is checked at PR B's head.
  - **Not covered:** the not-held case, which OPEN-20 decides.
- **Answer by one of:** Yes; your own words, which I check once; or accept it as it stands.

**OPEN-20 (the human's: the colour of features whose attributes are not held; §2.2 (d)).**
- **(a)** A not-held batch keeps the current match column. Its bytes are counted in the sum, and item 51 is reworded. A Colour-by on a new column, while the attributes-not-held item stands, re-issues both arms' queries under the same filter, so every batch is read again with that column (the map refills).
- **(b)** No re-issue. Features without the column draw as Other, and a KNOWN-LIMITATIONS line says so. This is a declared colour that may be wrong.
- **(c)** Keep every key-admissible text column for not-held batches. That defeats the ceiling.

**Recommend (a).** Amendment 4 item 4 shows that ordinary use reaches the ceiling.

---

## What I could not settle

1. **Rule (00) depends on facts I cannot read until dispatch:** step 1's branch contents (it was at the probe commit a88d0186 when PLAN recorded it), the docs lane's next piece, and whether the widening is placed.
2. **The exact fill list** (PR C item 2, PR B's OPEN-20 fills) needs `tsc` at each base. Amendment 3's I1-stop pattern covers a miss.
3. **`TABLE_MAX_ATTRIBUTE_BYTES`'s value** is a declared choice, unmeasured. It is the custodian's to approve or replace.
4. **§8 item 10's reading** for PR B's cases query while the tab is hidden: I recommend it, and the custodian signs it off.
5. **Documentation, on main.** Milestone 4's Amendment 1 item 4 says 1c's form records OPEN-17 (b) by its own amendment before its dispatch. At e6dfe624, 1c's §10 is empty (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:785-787 @ e6dfe624`), although step 1 is in progress. That record, extended to PR C's and PR B's interleave, is owed before PR C's dispatch.
6. **The fixture hashes, PC-E1's count and every pin** come from the tester and the custodian's script. I have no shell.
