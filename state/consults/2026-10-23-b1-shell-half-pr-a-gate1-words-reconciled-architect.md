*Custodian's filing note (2026-10-23): the architect's one set of words for #246's gate 1, reconciled from both gates' reports (`state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-architect.md`, `state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-reviewer.md`), read only at the head 35085072. The run 12:43:03Z to 12:54:00Z by its transcript (Read 36, Grep 35, Glob 2; no Write, Edit or Bash). None of these words is the human's. Entries 1 to 10 go to a worker on the branch; 11 to 14 to the PR body; 15, the closing amendment, to the form on main at the final head, after the custodian runs section 7's command. Its line cites are read at the PR's head, a branch commit, as it says. Extracted by script from its SubagentHandback call, with one final newline added, and its 3 path:line cites into files or lines only on the branch written in words; nothing else is changed. Its sha256, from line 5 to the end, is 6e0b043eea4f45f72bafb893a62cb441fe245e84ba51a3237da38994e90ce2f4.*

---

Reconciled: PR #246 gate 1 words at 35085072824b5bcd657c37e3ca1603cbb1693e93
Branch and commit: cut/b1-shell-half-pr-a @ 35085072824b5bcd657c37e3ca1603cbb1693e93

I read the following with Read and Grep, in `C:/dev/wt/m4a` at the head unless noted: the two gate reports on main, whole; the form's §0.4, §2.2, §2.6, §2.7, §5, §7, §8, §9 and Amendments 2 to 5; the PR body as filed; and every target span below. Where a check needed the pre-PR text, I read main's checkout at fa0303fd. I have no shell. So no figure below comes from §7's command, and every §7 effect is stated as my reading. None of these words is the human's. Items 51 and 52, Part AC and the README entry stay drafts for the human's sight. No entry changes behaviour, a test's assertion, or a string that a test asserts, so **no entry needs a re-gate.**

Where a span below is called byte-copied, it was copied from the Read output at the head. Each final text is given once, between `~~~` fences.

## The worker's commit (one commit on `cut/b1-shell-half-pr-a`)

**1. KL item 51, title and body (architect C1).**
- Target: `KNOWN-LIMITATIONS.md`, lines 411 and 412, byte-copied:
~~~
51. **Attributes are not held for features loaded once the map holds 268,435,456 bytes of attribute data.**
    The Feature tab shows the attribute values read for the feature you click. The map holds at most 268,435,456 bytes (256 MiB) of attribute data in all, over every batch of features it keeps. A batch that would take it past that keeps its shapes without its attribute values; this limit drops nothing from the map and refuses nothing. Clicking a feature of such a batch shows that its attributes are not held, and from then until the next dataset is opened the status bar says that some features' attributes were not held. A batch the map loads again after letting it go is read again under the same limit.
~~~
- Final words (the architect's C1, unchanged):
~~~
51. **Attributes are not held for a batch of features that would take the map past 268,435,456 bytes of attribute data.**
    The Feature tab shows the attribute values read at the click for the feature you inspect with the Navigate tool. The map holds at most 268,435,456 bytes (256 MiB) of attribute data in all, over every batch of features it keeps. A batch that would take it past that keeps its shapes without its attribute values; this limit drops nothing from the map and refuses nothing. Inspecting a feature of such a batch shows that its attributes are not held. From the first such batch until the next dataset is opened, the status bar says that some features' attributes were not held. A batch the map loads again after letting it go is read again under the same limit.
~~~
- Clause check:
  - "would take the map past": `limits.ts:87-91`, `withinAttributeCeiling`, `heldBytes + block.bytes <= RESIDENT_ATTRIBUTE_MAX_BYTES`.
  - "read at the click": `clickPick.ts:51`, `readRow(candidate.batch, row)`.
  - "inspect with the Navigate tool": `clickEffect.ts:57-71`. Select returns at line 64. A pinned feature returns at line 67 with no `inspect.set`. `inspect.set` with a row has no other product writer (only `clickEffect.ts:70`).
  - "at most … every batch it keeps": `WorkingCanvas.tsx:1460` and `:1682` pass `getBatches()` to `withinAttributes`, which sums them with `residentAttributeBytes` (`limits.ts:82-84`).
  - "keeps its shapes … refuses nothing": `limits.ts:90` returns `{ ...batch, attributes: "not-held" }` and throws nothing.
  - "shows that its attributes are not held": `FeatureTab.tsx:57` and `:72`.
  - "From the first such batch until the next dataset is opened": `WorkingCanvas.tsx:1064` reports at decode. `App.tsx:2155-2157` keys the item to `admitted.dataset`, and `App.tsx:2309`/`:2316` show it.
  - "read again": every push decodes and calls `withinAttributes`.
- Applies: the worker.
- §7: outside the count. Lines 411 and 412 are already lines PR A adds, and the edit is in place, so `KNOWN-LIMITATIONS.md` stays 8 of 70.

**2. KL 51's source comment (architect D1).**
- Target: `KNOWN-LIMITATIONS.md:413`, the line's tail, byte-copied: `and the Feature tab's line in frontends/shell/src/feature/FeatureTab.tsx. -->`
- Final words, inserted between `FeatureTab.tsx.` and ` -->`. This is the architect's D1 widened by two clauses: the baseline's pick ceiling, and the candidate arm's pre-eviction judgement.
~~~
 Not covered (Amendment 4 rows 4 and 13): the dev-only baseline arm reports a batch before the resident set's ceiling checks, and the candidate arm reports it before it evicts, trims or deduplicates, judged against the bytes held before that push's evictions; so a batch that is then refused, trimmed to nothing or found with every feature already resident from another tile can still set the status item (App.tsx, the comment on ATTRIBUTES_NOT_HELD_TEXT).
~~~
- Clause check:
  - "before the resident set's ceiling checks": `WorkingCanvas.tsx:1460` runs before `:1501` `addBatch`. Line 1504 catches both `ResidentVertexCeilingExceeded` (`residentSet.ts:76`) and `PickCeilingExceeded` (`residentSet.ts` imports `checkPickCeiling`).
  - "before it evicts, trims or deduplicates": `WorkingCanvas.tsx:1682` runs before `:1692`. Evictions are at `tileIngest.ts:159-161`, the trim at `:169-172`, and the dedupe in `tileResidentSet.ts:221-222`.
  - "judged against the bytes held before": `withinAttributes` reads `getBatches()` before `ingestTileBatch`.
- Applies: the worker.
- §7: outside the count; in place on an added line, so 8 of 70.

**3. KL item 52 (architect D3, its KL half).**
- Target: `KNOWN-LIMITATIONS.md`, lines 415 and 416, byte-copied:
~~~
52. **Hovering a feature shows no attributes; clicking it does.**
    The readout beside the pointer shows a feature's id and where it was picked, and nothing from its attribute columns. The values show in the Feature tab after a click.
~~~
- Final words. This is the architect's D3 changed in two places, and the changes are mine. A file with no projectable column, or a not-held batch, shows no values in ordinary use. So both "inspecting it … does" and "The values show" were untrue:
~~~
52. **Hovering a feature shows none of its attributes.**
    The readout at the bottom left of the map shows the hovered feature's id and the coordinates of its first vertex, and nothing from its attribute columns. The Feature tab shows its attribute values, or says why it shows none, when you click the feature with the Navigate tool and no other feature is pinned.
~~~
- Clause check:
  - "bottom left of the map": `styles.css:551-554`, with `.canvas-container` at `:533-534`. `App.tsx:2239` renders it inside `App.tsx:2118`.
  - "coordinates of its first vertex": `HoverReadoutView.tsx:33-35`, `idLine`; `pick.ts:141`.
  - "nothing from its attribute columns": `HoverReadoutView.tsx:60-95`.
  - "its attribute values, or says why it shows none": `FeatureTab.tsx:68-87`. The three branches are `NO_COLUMN_PROJECTED_TEXT`, `NOT_HELD_TEXT` and the list.
  - "Navigate … no other feature is pinned": `clickEffect.ts:57-71`.
- Applies: the worker.
- §7: outside the count; in place, so 8 of 70.

**4. The comment on `ATTRIBUTES_NOT_HELD_TEXT` (architect D2).**
- Target: `frontends/shell/src/App.tsx:817`, its last sentence, byte-copied: ``The candidate arm's `pushTileBatch` refuses no batch.``
- Final words, replacing that sentence **on line 817 itself**. Do not add a line. These are the architect's D2, unchanged:
~~~
The candidate arm's `pushTileBatch` has no vertex-ceiling refusal, but the same order holds there: `withinAttributes` runs on the decoded batch before `ingestTileBatch` evicts, trims or deduplicates it, so a batch that the vertex budget then trims to nothing, or whose every feature is already resident from another tile, can still set this item, and a batch is judged against the bytes held before that call's evictions.
~~~
- Clause check: `WorkingCanvas.tsx:1682` runs before `:1692`; then `tileIngest.ts:159-161` and `:169-172`, and `tileResidentSet.ts:221-222`. "No vertex-ceiling refusal": `WorkingCanvas.tsx:203`, and no `throw` of either ceiling in `tileIngest.ts` or `tileResidentSet.ts`.
- Applies: the worker.
- §7: count-neutral. Lines 812-818 are all PR A's own (main has no `ATTRIBUTES_NOT_HELD`), and line 817 stays one line. App stays at the reviewer's figure, which is within 150 (it found only four overruns). I cannot give App's number.

**5. Row AC1 (architect D5).**
- Target: `frontends/shell/MANUAL-WALKTHROUGH.md` line 1979 (on the branch), sub-span byte-copied: `The Feature tab shows an Attributes section under the feature's id:`
- Final words (the architect's D5):
~~~
Under the feature's id, the Feature tab lists
~~~
- Clause check: `FeatureTab.tsx:154-159`. The id line comes first, and `attributesSection` is rendered below it. The section has only an `aria-label` (`:71`) and no visible heading.
- Applies: the worker.
- §7: outside the count; in place, so 29 of 160.

**6. Row AC9 (architect D3, its AC9 half).**
- Target: `MANUAL-WALKTHROUGH.md:1981`, sub-span byte-copied: `The readout beside the pointer shows the feature's id and position only.`
- Final words (the architect's; the Felt sentence stays):
~~~
The readout at the bottom left of the map shows the feature's id and the coordinates of its first vertex only.
~~~
- Clause check: as in entry 3.
- Applies: the worker.
- §7: 29 of 160.

**7. Row AC10 (architect D6, with D7's string).**
- Target: `MANUAL-WALKTHROUGH.md:1982`, sub-span byte-copied: `The console's row for inspecting a feature.`
- Final words, inserted after that sentence. This is the architect's D6, extended: it names `values.ts`'s message and where to read the three messages.
~~~
 The Attributes section's name as a screen reader reads it. The three messages for attribute data the shell does not read, from the source: `UnexpectedProjectionError` and the column-type message in `frontends/shell/src/canvas/decodeBatch.ts`, and `readCell`'s message in `frontends/shell/src/attributes/values.ts`.
~~~
- Clause check:
  - `FeatureTab.tsx:71`.
  - `decodeBatch.ts:78-88` and `:125`.
  - `values.ts:48`, which carries the mark after entry 9.
- Applies: the worker.
- §7: 29 of 160.

**8. The e2e README entry for PA-E3 (architect D4 and reviewer D2 merged: I chose the reviewer's).**
- Target: `frontends/shell/e2e/README.md` line 819 (on the branch), tail byte-copied:
  ``  `PA-E3` (six features clicked unfiltered show at least two different zones; under `zone = 'residential'` three features clicked all show `residential`).``
- Final words:
~~~
`PA-E3` (six features clicked unfiltered show at least two different zones; each of them, clicked again at the same point under the filter `id = N`, shows the same id and zone; under `zone = 'residential'` three features clicked all show `residential`).
~~~
- Why the reviewer's: its clauses map one to one onto the code. The architect's "where its batch holds that one row" is a claim the step does not assert.
- Clause check, in `attributes.mjs`:
  - `:274` (six), and `:279-280` (`zones.size >= 2`);
  - `:289-292`: `applyFilter(`id = ${id}`)`, then `zoneOf(point)`, then `alone.id === id && alone.zone === zone`;
  - `:295-298`.
- Applies: the worker.
- §7: excluded from the count. Line 819 is PR A's own, so the file stays 12 of 60.

**9. A P6 mark on `readCell`'s message (architect D7).**
- Target: `frontends/shell/src/attributes/values.ts` line 48 (on the branch), byte-copied:
  `  throw new Error(`attribute column of type ${String(type)} is not readable`);`
- Final words:
~~~
  throw new Error(`[P6 placeholder] attribute column of type ${String(type)} is not readable`);
~~~
- Clause check: §8 item 15. `readCell`'s branches (`:42-47`) are exactly `isReadableAttributeType` (`:34-36`). `decodeBatch.ts:124-125` refuses any other type first, so line 48 is not reached from a decoded batch.
- Tests that read the message: none. A Grep of `not readable` over `frontends/shell` excluding `node_modules` finds only `values.ts:48`, and `values.test.ts` has no `toThrow`. This is not a behaviour change and needs **no re-gate**: it adds a mark and does not reword the string.
- Applies: the worker.
- §7: a new file, edited in place, so 98 of 180.

**10. A stale clause in `viewportQuery`'s doc comment (architect D8).**
- Target: `frontends/shell/src/skp/client.ts:98`, byte-copied:
  `` * `filter` is `Filter | null`, required -- it is the ONE function both a future filter panel``
- Final words, replacing the whole line, with line 99 left as it is:
~~~
 * `filter` is `Filter | null`, required -- it is the ONE function both `FilterPanel`'s Apply
~~~
- I changed the architect's words. Its parenthetical (77 characters) needs a rewrap. A rewrap rewrites lines 99-104, which are unchanged from the base, and that adds about 12 lines against client.ts's ceiling of 20. That would be a new class 8. These words fit at 93 columns.
- Clause check:
  - `FilterPanel.tsx:107-108` is the Apply button, which calls `onApply` (`:55`).
  - `onApply` is `App.tsx:2041` `handleApplyFilter`, which goes to `applyFilterWith` (`:1089-1091`). That leads to `applyFilter` → `deps.requestViewport` (`:358`) → `issueQueryRef` → `manager.requestViewport`, and so to `viewportQuery` (`viewportStreamManager.ts:195`, `tileViewportStreamManager.ts:944`, `candidateArmSession.ts:1278`).
- Applies: the worker.
- §7: count-neutral, because line 98 is already changed against the base. My reading is 14 of 20: main's and the head's files are both 143 lines, and lines 98, 99, 106, 113 and 122-124 are deleted against 98, 105, 112, 113 and 122-124 added. This is not numstat.

## The PR body (the custodian, after the worker's push)

**11. The Runs bullet's H2 clause (architect E1 and reviewer D3 merged: I chose the reviewer's, with one change).**
- Target, byte-copied: ``each rc 0 on its first run; no `skp.projection_` line in any run's app stderr or session log (H2);``
- Final words:
~~~
each rc 0 on its first run, which for the 14 is H2's discriminator (§0.4); the tester's grep found no `skp.projection_` line in any run's app stderr or session log, but it also read 0 in the PA-E1 mutation's run, where `filter-zoned.parquet`'s projection becomes an empty list that the SKP boundary refuses, so it is not shown to detect a refusal;
~~~
- Why the reviewer's and not the architect's: "not an instrument for a projection refusal" overstates. `tileViewportStreamManager.ts:276-284` `logMintRefused` writes every typed tile-mint refusal, with its code, to the session log. That also makes E1's stated reason untrue (see Not settled, item 3). My change is "for the 14": §0.4's discriminator is the existing suites.
- Clause check:
  - H2's discriminator: §0.4, the H2 row (form line 130).
  - "read 0 in the PA-E1 mutation's run": the full-series report, its lines 66 and 81.
  - "becomes an empty list": the mutation in `attributes.mjs:20`, applied to `projection.ts:17` on the one-column projection that `attributes.mjs:270` asserts, gives `slice(0, 0)`.
  - "refuses": `protocol/skp/SKP-V0.md:1179`, and `kernel/tests/skp_projection.rs:1101`.
- §7: outside the count.

**12. Scope (architect D9).**
- Target, byte-copied: `against PR A's 3,524`
- Final words:
~~~
against PR A's 3,940 (§7's 3,524 and Amendment 3 item 6's 416)
~~~
- Clause check: form line 906.
- §7: outside the count.

**13. Words, item 2. This is new: entry 1 makes the body's block false.**
- Target: the body's item 2, from `2. **Amendment 4, row 13: KNOWN-LIMITATIONS item 51**` through its closing fence.
- Final words: the item's heading becomes:
~~~
2. **KNOWN-LIMITATIONS item 51, as replaced at gate 1** (`KNOWN-LIMITATIONS.md`; Amendment 4 row 13's words superseded by `state/consults/2026-10-23-b1-shell-half-pr-a-gate1-words-reconciled-architect.md`, entry 1):
~~~
  Its fenced block becomes entry 1's two lines, byte-copied by script from the file at the final head, with the body's 3-space indent.
- Clause check: entry 1.

**14. H, the commits, and the list the wording-block rule requires.**
- Target, byte-copied: `**H** is 35085072824b5bcd657c37e3ca1603cbb1693e93.`
- Final words:
~~~
**H** is 35085072824b5bcd657c37e3ca1603cbb1693e93, the head both gates read. The final head, <FINAL, full hash from git rev-parse>, adds to H only gate 1's words, listed below.
~~~
- Also append the worker's commit line to Commits.
- Then add a new section before `## Gates`:
~~~
## Gate 1's words, applied

None of these words is the human's. Each was applied as `state/consults/2026-10-23-b1-shell-half-pr-a-gate1-words-reconciled-architect.md` gives it, with no re-gate (`state/directives/2026-10-11-direction-after-status-review.md`, item 2), in <worker commit>:

- `KNOWN-LIMITATIONS.md`: item 51 (entry 1), its source comment's Not covered clause (entry 2), item 52 (entry 3); drafts for the human's sight.
- `frontends/shell/src/App.tsx`: the last sentence of the comment on `ATTRIBUTES_NOT_HELD_TEXT` (entry 4).
- `frontends/shell/MANUAL-WALKTHROUGH.md`: rows AC1, AC9 and AC10 (entries 5 to 7); drafts for the human's sight.
- `frontends/shell/e2e/README.md`: the `PA-E3` sentence (entry 8); a draft for the human's sight.
- `frontends/shell/src/attributes/values.ts`: the P6 mark on `readCell`'s message (entry 9).
- `frontends/shell/src/skp/client.ts`: the filter panel's name in `viewportQuery`'s doc comment (entry 10).
- This body: the Runs bullet's H2 clause, the Scope total and item 2 (entries 11 to 13).
~~~
- Clause check: "adds only gate 1's words" is checked by `git diff --stat 35085072…<FINAL>`, which should name only the six files of entries 1-10.

## The closing amendment (the custodian on main, at the final head; references only)

**15. Architect D10, reviewer D1, D4 (a) and D4 (b), merged.**

Decision on the reviewer's D4 (b): **a class 1 admission, not a revert.**
- The reworded statement is true. Both gates read it so: reviewer §8 items 14-15, and the architect's ADR-006 line.
- A revert would make AC10's sentence "The console's row for inspecting a feature" name a string PR A no longer adds, and it would cost a second edit.
- No test asserts the text. A Grep finds `feature.inspect` in tests only as a row name (`App.selection.test.tsx:228,342,355,592`, `clickEffect.test.ts:28`).
- Main has the old text at `surfaceRegistry.ts:352`, and the head has the new.

Class for D4 (a): class 1, not the reviewer's class 3. The form records readings as class 1 (Amendment 2 item 4, Amendment 3 item 5). Class 3 never changes a claim (`docs/PREREGISTRATION-TEMPLATE.md`, class 3), but this reading is what makes Amendment 2 item 2 (a)'s self-test claim hold.

I dropped the reviewer's group figures (record cap). I name no commit for the reword: I could not verify 96a78eff without git, and the diff range proves the change.

Before committing, the custodian runs §7's command over `c1f782db29c3ce4b2fd3b8954966494a21679b71...<FINAL>`. **STOP** if the four figures differ, or if any other file or group passes its ceiling. The form is excluded from the count. Append at the end of the form, on main:
~~~
## Amendment 6: PR A's closing record, written after its gate 1 results were seen. Four per-file overruns are class 8; two readings are class 1; one item stays open.

*Written by the custodian after PR A's gate 1 reports were seen, at PR A's final head <FINAL, full hash>. References only, and nothing below is a quotation. The reports are `state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-architect.md` and `state/consults/gates/2026-10-23-b1-shell-half-pr-a-gate1-reviewer.md`; the words applied are `state/consults/2026-10-23-b1-shell-half-pr-a-gate1-words-reconciled-architect.md`. §7 is not edited.*

1. **Class 8,** by §7's command over `c1f782db29c3ce4b2fd3b8954966494a21679b71...<FINAL>`: `frontends/shell/src/style/document.ts` 7 of 6 (Amendment 4 row 1); `frontends/shell/src/canvas/buildLayers.ts` 7 of 6 (Amendment 2 item 5); `frontends/shell/src/streaming/viewportStreamManager.test.ts` 88 of 40 and `frontends/shell/src/residency/candidateArmSession.test.ts` 149 of 60 (Amendment 4 row 2). No other file passes its ceiling, and no group passes its total.
2. **Class 1:** PR A rewords the `feature.inspect` statement in `frontends/shell/src/console/surfaceRegistry.ts`, a file §2.6 lists, as an exception to §5's declared-unchanged strings. It is a P6 placeholder, for sight at Part AC row AC10.
3. **Class 1:** Amendment 2 item 2 (a)'s joined run is read with the whitespace after the comment marker also removed. Read so, its self-test at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f is positive, and every pattern is zero at 35085072824b5bcd657c37e3ca1603cbb1693e93 under both readings (the reviewer's gate 1 report, What I checked, item 5).
4. **Open:** LargeUtf8 and Utf8View (`state/consults/2026-10-22-b1-shell-half-pr-a-amendment-4-architect-draft.md`, What I could not settle, item 2).

Read the last amendment first.

Nothing above is edited.
~~~
- Clause check:
  - Item 1: the four files are untouched by entries 1-10, so their figures at 35085072 (both gates) hold at the final head, subject to the custodian's run.
  - Item 2: main's `surfaceRegistry.ts:352` against the head's line 352; the file is listed at form line 344.
  - Item 3: the reviewer's report, item 5 and D4 (a).
  - Item 4: the draft's lines 185-188.
- The amendment does not cite the `skp.projection_` count (architect E1).
- §7: the form is excluded.

## Order
1. The worker: entries 1-10 in one commit, for example `docs(shell): milestone 4 PR A, gate 1 words: items 51 and 52, rows AC1, AC9 and AC10, the PA-E3 entry, two comments and one P6 mark`. None of the words contains a §4 text-check pattern or a rooted `path:line`. Push; CI then runs at the final head.
2. The custodian: entries 11-14 in the PR body, with the final head and the commit taken from git.
3. The custodian on main, after the final head's CI is green: §7's command, then entry 15 appended at the end of the form.

## Not settled
1. Per-file §7 figures by command, for `App.tsx` and `client.ts`: I have no shell. Every entry is written count-neutral, and the custodian's run in step 3 is the proof.
2. The commit that reworded `feature.inspect`. The reviewer names 96a78eff; I did not verify it, so the record uses the diff range instead.
3. Why the `skp.projection_` count read 0 under PA-E1's mutation.
   - The architect's E1 reason is contradicted by `logMintRefused` (`tileViewportStreamManager.ts:276-284`). It claims that `binding_log_session_event` persists only what the global error handler sends; 30+ product `logSessionEvent` callers exist.
   - The first look propagates its refusal (`candidateArmSession.ts:1276-1278`). I did not trace where App reports that refusal.
   - Entry 11's words do not depend on the reason.
4. The architect's gate report cites `projection.ts:869`, `attributes.mjs:349` and `attributes.mjs:353-377`. None resolves at the head; the spans are at `:17`, `:270` and `:288-294`. That report is a filed record, so I leave it as it is (record cap). No entry above carries those cites.
5. Whether AC10's list is complete rests on the architect's reading of the whole diff, which I did not redo.
6. The reviewer's `noticeDeterminism.test.ts` timeout (its run 1) still needs a run alone. It is the custodian's, outside these words.
