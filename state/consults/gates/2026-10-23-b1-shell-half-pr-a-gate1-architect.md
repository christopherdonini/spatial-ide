Reviewed: PR #246 at 35085072824b5bcd657c37e3ca1603cbb1693e93 (base c1f782db), gate 1, architect. Branch and commit: cut/b1-shell-half-pr-a @ 35085072824b5bcd657c37e3ca1603cbb1693e93

Verdict: PASS WITH NOTES

The code's Correctness and Evidence are closed. Every finding below is in the words of a record, a comment, a string mark or the PR body. Each one carries replacement words, and none needs a re-gate (`state/directives/2026-10-11-direction-after-status-review.md` item 2; `AUTONOMY.md` §31; `state/directives/2026-10-05-product-first-direction.md` section 2). All of them must be fixed before the merge, and the PR body lists the words that were applied. None of these sentences is the human's wording: the KNOWN-LIMITATIONS items, Part AC and the README entry are drafts for the human's sight, and the rest is the worker's text. Every path:line below is read at 35085072.

## Evidence: wording only, closed by these words

**E1. The PR body's Runs bullet, "no `skp.projection_` line in any run's app stderr or session log (H2)".**
- **What is wrong.** That count cannot see a projection refusal, and the series' own mutation run proves it.
  - Under PA-E1's mutation, `projectionFor` returns `[]` for `filter-zoned.parquet`, because the length check comes before the slice (`frontends/shell/src/attributes/projection.ts:869`). That file's one projected column is `zone`: PA-E3's unmutated run asserts `["zone"]` and passed.
  - So that run sends `columns: []`, which the kernel refuses as `skp.projection_empty_list` (asserted in `kernel/tests/skp_projection.rs`). PA-E3's camera search found 0 features at every notch, which fits.
  - The tester records a count of 0 for that run (the full-series report, Mutations).
  - Why the count is blind: the host writes nothing about a typed SKP refusal to the session log. `binding_log_session_event` (`frontends/shell/src-tauri/src/commands.rs:184`) only persists what the page's global error handler sends.
  - H2 itself is discharged: its discriminator in §0.4 is "the suites at PR A's head", and all 14 base suites passed with the projection sent. Only the attribution is unsupported.
- **Replacement**, for "each rc 0 on its first run; no `skp.projection_` line in any run's app stderr or session log (H2);":
  `each rc 0 on its first run, with the projection sent (H2, by the suites, as §0.4 discriminates it; the tester's \`skp.projection_\` count over each run's app stderr and session log was 0 in every run, but it is not an instrument for a projection refusal: under PA-E1's mutation \`filter-zoned.parquet\`'s one projectable column becomes \`columns: []\`, which the kernel refuses, and that run's count was 0 as well);`
- **Clause check.**
  - H2 by the suites: §0.4's H2 row, and the full-series table (14 suites, rc 0).
  - The mutation gives `[]`: `projection.ts:869`.
  - One projectable column: PA-E3's assertion `tab.names == ["zone"]` (`frontends/shell/e2e/attributes.mjs:349`), which passed unmutated.
  - The kernel refuses it: `kernel/tests/skp_projection.rs` asserts `skp.projection_empty_list` for an empty list.
  - That run's count was 0: the full-series report, PA-E1 mutation lines.
- The closing amendment should not cite this count as I6 or H2 evidence.

## Correctness: a claim of a limit, wording only

**C1. KNOWN-LIMITATIONS item 51, title and body (`KNOWN-LIMITATIONS.md:411-412`).**
- **What is wrong.**
  - The title, "once the map holds 268,435,456 bytes", is untrue as a limit. A batch is not held when it would take the sum past the ceiling (`frontends/shell/src/canvas/limits.ts`, `withinAttributeCeiling`), even while the map holds less.
  - "the feature you click" is untrue under the Select tool, and while a feature is pinned (`frontends/shell/src/feature/clickEffect.ts:57-67`).
  - "from then", which reads as from the click, is untrue. The status item is set when the batch is decoded (`WorkingCanvas.tsx`, `withinAttributes`).
- **Replacement** for lines 411-412, keeping the 4-space indent:
```
51. **Attributes are not held for a batch of features that would take the map past 268,435,456 bytes of attribute data.**
    The Feature tab shows the attribute values read at the click for the feature you inspect with the Navigate tool. The map holds at most 268,435,456 bytes (256 MiB) of attribute data in all, over every batch of features it keeps. A batch that would take it past that keeps its shapes without its attribute values; this limit drops nothing from the map and refuses nothing. Inspecting a feature of such a batch shows that its attributes are not held. From the first such batch until the next dataset is opened, the status bar says that some features' attributes were not held. A batch the map loads again after letting it go is read again under the same limit.
```
- **Clause check.**
  - "would take the map past": `limits.ts`, `withinAttributeCeiling` (`heldBytes + block.bytes <= RESIDENT_ATTRIBUTE_MAX_BYTES`).
  - "read at the click … inspect with the Navigate tool": `clickPick.ts`, `resolveClickPick`, calls `readRow` at the click; `clickEffect.ts:66-71` sends `inspect.set` with the row only in Navigate and only when nothing is pinned.
  - "at most … every batch it keeps": `residentAttributeBytes` over each arm's `getBatches()` at every push (`WorkingCanvas.tsx:1460`, `:1682`).
  - "keeps its shapes … refuses nothing": `withinAttributeCeiling` returns `{...batch, attributes: "not-held"}` and does not throw.
  - "shows that its attributes are not held": `NOT_HELD_TEXT`, `FeatureTab.tsx`.
  - "From the first such batch … next dataset is opened": `withinAttributes` reports at decode, and App keys the item to `admitted.dataset` (`App.tsx:2151-2157`, `:2304-2321`). The App test for the status item asserts the clear.
  - "read again": every push decodes and calls `withinAttributes`.
- **Not covered:** see D1.

## Documentation: must-fix before the merge, no re-gate

**D1. KL 51's source comment (`KNOWN-LIMITATIONS.md:413`) has no "Not covered" clause.** Amendment 4 row 13 names one, and it went only to `App.tsx`. Insert before ` -->`:
` Not covered (Amendment 4 rows 4 and 13): the dev-only baseline arm reports a batch before its vertex-ceiling check, and the candidate arm reports it before it evicts, trims or deduplicates, so a batch that is then refused, trimmed to nothing or found already resident from another tile can still set the status item (App.tsx, the comment on ATTRIBUTES_NOT_HELD_TEXT).`
- Clause check: see D2.

**D2. The comment on `ATTRIBUTES_NOT_HELD_TEXT` (`frontends/shell/src/App.tsx:817`), last sentence.**
- **What is wrong.** "The candidate arm's `pushTileBatch` refuses no batch." The candidate arm has the same ordering as the baseline arm:
  - `withinAttributes` runs on the decoded batch (`WorkingCanvas.tsx:1682`) before `ingestTileBatch` (`:1692`);
  - that call evicts (`tileIngest.ts:159-161`) and trims to the vertex budget, possibly to nothing (`:169-172`);
  - `addBatch` accepts nothing when every feature is a duplicate (`tileResidentSet.ts:221-222`).
- The status sentence's clauses stay true of the decoded batch. The only reading this case falsifies, a fully duplicated batch whose features are held through another tile, cannot be told apart in the shipped app. So it is named here and does not block.
- **Replacement** for that sentence:
  `The candidate arm's \`pushTileBatch\` has no vertex-ceiling refusal, but the same order holds there: \`withinAttributes\` runs on the decoded batch before \`ingestTileBatch\` evicts, trims or deduplicates it, so a batch that the vertex budget then trims to nothing, or whose every feature is already resident from another tile, can still set this item, and a batch is judged against the bytes held before that call's evictions.`
- Clause check: the four lines just named.

**D3. KL 52 (`KNOWN-LIMITATIONS.md:415-416`) and Part AC row AC9 (`frontends/shell/MANUAL-WALKTHROUGH.md:1981`).**
- **What is wrong.**
  - The readout is not beside the pointer. It is absolute at the bottom left of `.canvas-container` (`styles.css:551-554`, `:533-534`; `App.tsx:2239`).
  - It does not show where the pointer picked. It shows the feature's first vertex (`HoverReadoutView.tsx:33-35`; `pick.ts:141`).
  - "clicking it does" is untrue under Select and while a feature is pinned.
- **Replacement** for KL 52:
```
52. **Hovering a feature shows no attributes; inspecting it with the Navigate tool does.**
    The readout at the bottom left of the map shows the hovered feature's id and the coordinates of its first vertex, and nothing from its attribute columns. The values show in the Feature tab when you click the feature with the Navigate tool and no other feature is pinned.
```
- **Replacement** for AC9's expected cell, keeping its Felt sentence:
  `The readout at the bottom left of the map shows the feature's id and the coordinates of its first vertex only.`
- Clause check: the lines above, and `clickEffect.ts:57-71`.

**D4. The README entry (`frontends/shell/e2e/README.md:819`) leaves out PA-E3's re-read under `id = N`** (row 15). Replace the `PA-E3` parenthetical with:
`(six features clicked unfiltered show at least two different zones, and each one's zone, read again under the filter \`id = N\`, where its batch holds that one row, is the same; under \`zone = 'residential'\` three features clicked all show \`residential\`)`
- Clause check: `attributes.mjs:353-377`.

**D5. AC1 (`MANUAL-WALKTHROUGH.md:1979`) promises "an Attributes section".** There is no visible heading: the section carries only `aria-label` (`FeatureTab.tsx:71`). Replace "The Feature tab shows an Attributes section under the feature's id:" with:
`Under the feature's id, the Feature tab lists`
- Clause check: `attributesSection` is rendered after the id line, Pin and status (`FeatureTab.tsx`, inspected block). The names and their order are PA-E1's assertion.

**D6. AC10 (`MANUAL-WALKTHROUGH.md:1982`) says "every new string of PR A" but lists only some of them.** After "The console's row for inspecting a feature." insert:
` The Attributes section's name as a screen reader reads it. The messages for a batch the shell refuses to read: its attribute columns are not the ones the open asked for, or one has a type the shell does not read.`
- Clause check: `FeatureTab.tsx:71`; `UnexpectedProjectionError`, and the type message in `copyAttributes` (`decodeBatch.ts`). With D7, `values.ts:48` is marked as well.

**D7. A new string with no P6 mark (§8 item 15): `frontends/shell/src/attributes/values.ts:48`.** It cannot be reached, because decode refuses the same types first. Prefix it so that it reads:
`` `[P6 placeholder] attribute column of type ${String(type)} is not readable` ``

**D8. A stale clause in a sentence this PR edited: `frontends/shell/src/skp/client.ts:98`, "a future filter panel".** The filter panel exists. Replace that phrase with:
`` the filter panel (`FilterPanel`'s `onApply`, through App's `applyFilterWith`) ``
Rewrap as the file wraps.
- Clause check: `App.tsx:1089-1091`, and `:353-358` (`applyFilter` → `deps.requestViewport` → the managers or the session → `viewportQuery`).

**D9. PR body, Scope: "against PR A's 3,524".** Amendment 3 item 6 raised the total. Replace it with:
`against PR A's 3,940 (§7's 3,524 and Amendment 3 item 6's 416)`

**D10. The closing amendment, as references and hashes only.** It records the four per-file overruns as class 8, counted by §7's command over `c1f782db...35085072`, with §7 not edited:
- `style/document.ts` 7 of 6 (Amendment 4 row 1);
- `canvas/buildLayers.ts` 7 of 6 (Amendment 2 item 5's four lines). This one is recorded nowhere in the form yet;
- `viewportStreamManager.test.ts` 88 of 40, and `candidateArmSession.test.ts` 149 of 60 (Amendment 4 row 2).

I counted the two comment-only files from the diff (4 lines removed and 3 added each). The two test-file figures are the workers' and are for the reviewer's run of §7's command. The amendment also carries the open item in the notes below (Utf8 variants), by reference to the Amendment 4 draft's item 2.

## Notes (no action needed)

- `onAttributesNotHeldRef.current?.()` guards a prop that is now required (disclosed by the fixes worker). It adds no behaviour a caller can select, and nothing in §8 item 13 turns on it.
- **LargeUtf8 and Utf8View stay open** (the Amendment 4 draft's item 2). `admit_attribute_type` emits both unchanged (`engine/src/attributes.rs:78-94`), and the shell reads `Utf8` only. The engine changes no DuckDB export setting (`engine/src/pool.rs:185-187`), so at DuckDB's defaults a string column is exported as `Utf8`. No test proves that.
- **docs/08:** the decode now re-serializes the projected columns once per batch (`tableToIPC`). That is one named copy (ADR-004), unmeasured, with no claim made (OPEN-2 (b)). AC11 is the felt check.
- In both arms, the attribute ceiling is checked before the push's own evictions. That is the conservative direction and is consistent with C1's words.

## §8 at the head

| Item | Reading at 35085072 |
|---|---|
| 1 | Met. 54 files, each in §2.6 or Amendment 3's list. None under `protocol/`, `kernel/src`, `engine/` or `src-tauri/`. `FeaturePanel.tsx` and `workspaceState.test.ts` are listed but not edited. |
| 2 | Met: the lock diff is empty (the buildLayers worker report), and `package.json` gains one script line. The reviewer confirms. |
| 3 | Met: the existing `columns` field, no new literal. |
| 4 | Met, with Amendment 3 item 9's cases. `data` is indexed only in `readRow` (`values.ts:60-65`). The trim carries the block (`tileIngest.ts:231`). `rows[dst] = srcIdx` is written in the same `keepIdx` step as `ids` and `parts` (`tileResidentSet.ts:243-246`). |
| 5 | Met: `readCell` makes every integer a `bigint`, proved by PA-U4. |
| 6, 7, 10, 11 | Not applicable to PR A. |
| 8 | Met: `null`, never `[]` (`projection.ts:869`), and only `projectable` columns. |
| 9 | Met: the marker for a NULL; an empty string stays `""`. |
| 12 | Met: no undo wording in the new text. |
| 13 | Met. Row 2 is fixed: the two managers' `columns`, `CandidateArmSessionDeps.columns` and `onAttributesNotHeld` are required, and App passes each. |
| 14 | Met: the new messages state the shell's own facts. |
| 15 | Met except `values.ts:48` (D7). |
| 16 | Met. |
| 17 | Met: the request fixture (PA-U2); PA-E1 passing at H; the rebuild seam (PA-U8 to PA-U10, from the real decode); real engine batches decoded with the projection in all 15 suites. |
| 18 | Three overruns are recorded or pre-declared and `buildLayers.ts` still has to be recorded (D10); §7 is not edited. No scope addition beyond Amendment 3. No `verify-mutation` run is called an observation. Test text is named with H. |
| 19 | Met: no quote of the human's words, no ledger cite, no bare self-line in the diff. |
| 20 | Met: no OPEN-16 code. The 1c-shared files are edited under OPEN-17 (b). |

## What I checked, with its evidence

- **The form**, whole: Amendment 5 first, then 4 to 1. The PR body. The full-series, buildlayers-sentence, Amendment 4 fixes, row 15, attributes-evidence and worker reports. The Amendment 4 draft's open items.
- **The PR's diff** (three dots, 54 files), whole. The files at the head in the worktree where the diff was not enough.
- **ADR-023 §11 items 2 to 9:**
  - Item 2: no new refusal mapping.
  - Item 3: read as in Amendment 4 row 12; the Utf8 variants are an open note.
  - Items 4, 5, 6 and 8: met.
  - Item 7: the hover is unchanged, and the click reads through `partToRow` (`clickPick.ts`).
  - Item 9: no perf or workflow claim.
- **ADR-010:**
  - Rule 1: the frame check comes before `copyAttributes`.
  - Rule 2: the same table and the same pass (`decodeBatch.ts`).
  - Rule 5: `row` lives on `InspectedFeature`, and `endViewGeneration` sends `inspect.set` null (`viewTransitions.ts:181-187`).
  - Rule 6: `RESIDENT_ATTRIBUTE_MAX_BYTES` and `ATTRIBUTE_PROJECTION_MAX` are declared.
- **ADR-006:** the inspection is class 1, pure view state (the `surfaceRegistry` row). No export file is touched.
- **Round 8's exemption:** closed for the non-null path. `client.ts` takes a required `columns`, App passes `projectionFor(admitted.describe)` at both sites, and the PR body says so correctly.
- **§2.2 (g):** every comment re-checked clause by clause: `client.ts` (F3), `types.ts`, `document.ts`, `buildLayers.ts` (Amendment 2 item 5), `style_shell_agreement.rs` and `viewTransitions.ts`.
- **§4's text checks:** I ran them myself.
  - Line by line, and joined across comment markers by a multiline search: zero in `frontends/shell/src` and `renderer/tests` at the head.
  - The joined pattern is positive in six files of main's tree (the pre-PR text).
  - The worker's base and b24e5281 self-tests are as recorded.
- **The PR body's seven word sets:** compared with the form's lines and the head by reading, and found equal. I have no shell, so this was not a byte comparison by script.
- **Rows 7, 8 and 15 against the full series:**
  - PA-E1: two oracle ids, 242 among them, at notch 0. Its mutation is caught by name.
  - PA-E3: its mutation is caught by the `id = N` half.
  - The candidate arm is proved end to end.
- **Part AC:** rows 0, 1, 2, 9, 10 and 11, as §9 numbers them, with a blank log. Item numbers 51 and 52 are free on main (the highest there is 46). AC is free, and main's last Part is AB.
- **Not run (I have no shell):** `npm run verify`, `tsc`, `cargo test`, the §7 numstat, `verify-cites`, `verify-quotes` and `verify-test-claims`, any mutation, any e2e suite. Those are the reviewer's.

No missing decision, so no ADR skeleton.
