*Custodian's filing note (2026-10-12): the architect's draft of `export-current-view-after-unreported-fit`'s form (forms ahead, while milestone 2 phase B is in code; the 2026-10-12 direction, item 2), at main 2ca3a53c; the run 2026-10-12T05:17:31Z to 2026-10-12T05:27:43Z by its transcript. It arrived as a message and is extracted here by script from the SubagentHandback call in its transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is bc5a3b2eb18ef878bc0a33d6091a6f80e6cab37c633fb23d33b5f6c77c27d3be. Write audit PASS: zero write calls (Glob 6, Read 36, Grep 24). The form is committed beside it with its 37 pins hashed at 2ca3a53c and 0.2's reuse lines byte-copied; its HASH-TBD placeholders here are left as drafted.*

---

Reviewed: main @ 2ca3a53ca812684a7b2579980db2f980c5d2a286

## 1. Form choice, and what the human decides

**The full form, with full gating by architect and reviewer.** Three reasons, each enough alone:
- **§21c:** the change is new user-visible behaviour (what the class-3 export sends, and under OPEN-1 (a) when Current view can be chosen). §21c's threshold excludes that whatever the size. By my bottom-up estimate the piece is also about 670 lines over about 9 files, which is over both bounds.
- **§21a:** it touches a property already under test. RF8 (App.layout.test.tsx) asserts the box Current view sends, and RB18 in milestone 2 asserts which box `onViewShown` writes.
- **§25(e):** an honest `Out-of-scope` line would have to say "guarantee" (the scope of a class-3 export) and, under OPEN-2 (b), the approval prompt too. So no five-line form is possible.

**What the human decides:**
- OPEN-1: whether Current view becomes available once the map has fitted itself after an open.
- OPEN-2: whether the dialog's Row scope line changes. I read it as a red line: it is the class-3 approval prompt that ADR-017's 2026-08-17 exposure review passed, so it takes the human's typed words.
- OPEN-3: the words of item 42's narrowed on-main note (item 2e).
- The P6 sight of every string.
- **The shape in the 2026-10-12 directive, item 2:** the form confirms it. It adds two findings that come out of that shape:
  - (i) **The counts' box must be emptied when a file is opened.** If it is not, a reopen sends the previous dataset's box (ADR-010 rule 1). Amendment 2 does not say phase B empties it, so the piece adds this if phase B lacks it.
  - (ii) **RB18 may lose its observer.** If RB18 checks `lastViewportBboxRef` through the Export panel, this piece takes that reader away. RB18 then moves to the refusal recovery, the ref's remaining reader.

Neither finding needs a ruling, since both stay inside the human's terms. They are §5 items and re-sweep items.

## 2. The draft

````markdown
# The Export panel's Current view sends the box the map shows now
# (PLAN node export-current-view-after-unreported-fit)

File: frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md
Authority: the human's direction of 2026-10-12, `state/directives/2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md`, items 1 to 5, with its RULED block in `DECISIONS-PENDING.md`. Cited by item; nothing below quotes it.
Drafted by: the architect agent, alone (no engine or kernel path; the product-first direction, section 1), read at main 2ca3a53ca812684a7b2579980db2f980c5d2a286 while milestone 2 phase B is in code (forms ahead, item 2).
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: a property currently under test; §21c: new user-visible behaviour and size; §25(e)).
Code starts only after shell-migration-milestone-2 has merged, phase B included (item 2). The re-sweep of §0.3 comes first.

## §0. Disclosure

0.1 Inputs.
- The 2026-10-12 direction, items 1 to 5.
- The read: state/consults/2026-10-11-export-current-view-after-unreported-fit-read.md, whole. It was made at 58c2d153 and at the v0.1.0 tag b391e43622056324c56d35cc33065305140a8415. Its runs are evidence, not Authority.
- Milestone 2's form, frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md, read last amendment first: Amendment 6 back to Amendment 1; §2.3, §2.5 and §2.7; Amendment 2 item 2; Amendment 3.
- The OPEN-11 ruling: state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md, item 1. Its fourth term keeps the Export panel's Current view unchanged in milestone 2. The 2026-10-12 direction, item 2, now places that change in this piece. Milestone 2's term binds milestone 2 only.
- ADR-006, ADR-010 rules 1 and 2, ADR-017 §8 and its Exposure review of 2026-08-17. ADR-024 is Proposed, binds nothing, and is read as the record of the approval surface.
- docs/PREREGISTRATION-TEMPLATE.md; AUTONOMY.md §21a to §21d, §22, §25(e) and §31.
- The product-first direction, sections 1, 2 and 4. The 2026-10-11 direction, item 2 (the wording-block rule; item 2e binds §2.4).
- The port-5400 harness approval: state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md, item 1.
- The shell's code, tests, e2e suites, MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md at 2ca3a53c.
- No pilot, no spike, nothing measured.

0.2 The reuse index (the standing step).
- **The run.** The custodian ran `node tools/reuse.mjs <words>` in christopherdonini/spatial-ide-reuse at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit, for three words:
  - `export`: a miss;
  - `current view`: a miss;
  - `viewport`: one capability, `lod-selection-metric` (worth-owning, P1).
- The custodian appends the printed lines beneath this item, byte-copied by script and marked.
- **What this form takes from it:** nothing.
  - `lod-selection-metric` is level-of-detail selection, a different subject.
  - The two misses are noted and do not block. The piece has no algorithm to research: it changes which existing box an existing reader reads.
- **No dependency** is proposed.

0.3 Pins and the re-sweep.
- **What the pins mean.** Every `@ 2ca3a53c…` pin is historical. Phase B is unmerged and changes App.tsx, PublishPanel.tsx and WorkingCanvas.tsx.
- **Which is authoritative.** For the work, the tree at the code base is authoritative. For what this form read, the pin is (round 14).
- **The re-sweep.** At the code base (after milestone 2 merges) the custodian re-sweeps every pin below and answers RS1 to RS9 in a class 3 / class 1 amendment, before any code.
  - A moved pin is class 3.
  - An interface that differs from §0.5 is I2.

| Item | Question at the code base |
|---|---|
| RS1 | Name the counts' box: its holder (Amendment 2 item 2(b) says a ref with a listener set), its value type (AuthoritativeBbox or wire Bbox), its read function and its subscribe function, at file:line. |
| RS2 | Is it written by exactly `onViewportChanged`, `onViewportWithinLastQuery` and `onViewShown`'s handler (Amendment 2 item 2(a), Amendment 3)? Does `onViewShown`'s handler write nothing else (OPEN-11 terms)? |
| RS3 | Is `onViewShown` called at the unreported branch of the fit (both arms' auto-fit go through it) and at the change of size that asks for nothing because no area was last asked for? Give the canvas lines. |
| RS4 | List every camera write and every size change in WorkingCanvas.tsx and the callback each reaches, including phase B's `fitToBbox`. Any write or size change that an ordinary input reaches and that reaches none of the three is I3. |
| RS5 | Does the counts' box carry a freshness mark (Amendment 2 item 2(c))? If so, list each state in which it reads "not current", and whether the map's shown box can then differ from the stored one in ordinary use. If it can, that is I3. |
| RS6 | Is the counts' box emptied at an admission? If not, §2.1(c) adds it. If adding it changes any phase B test's assertion, that is I4. |
| RS7 | Which reader does RB18 use to observe `lastViewportBboxRef`? If it is the Export panel's prepare, §2.3 re-aims it. |
| RS8 | PublishPanel's props after phase B (`stageScope`, `checkStagedScope`, `onExportRunning`), so §2.2 edits beside them. |
| RS9 | Has KNOWN-LIMITATIONS item 42 (node known-limitations-current-view-stale-box) merged? Give its text, its number and its on-main note. If it has not merged, §2.5 does not run here and becomes a docs-lane follow-up node. |

0.4 The defect as read (the read's §1, at main 2ca3a53c).
- **The ref and its three writers.**
  - The declaration: frontends/shell/src/App.tsx:837 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The admission reset: frontends/shell/src/App.tsx:1019-1025 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - `onViewportChanged`: frontends/shell/src/App.tsx:1886-1900 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - `onViewportWithinLastQuery`: frontends/shell/src/App.tsx:1901-1906 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The ref's readers.**
  - The refusal recovery: frontends/shell/src/App.tsx:327-331 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD, through frontends/shell/src/App.tsx:968 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and the two dev `queryWithFilter` hooks.
  - The Export panel: frontends/shell/src/App.tsx:2034-2043 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The Apply path.** An issued Apply re-arms the fit: frontends/shell/src/App.tsx:345-349 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/canvas/WorkingCanvas.tsx:1532-1536 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The unreported camera writes.**
  - The fit writes the camera and reports nothing: frontends/shell/src/canvas/WorkingCanvas.tsx:1326-1356 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - It is called from frontends/shell/src/canvas/WorkingCanvas.tsx:1478-1488 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/canvas/WorkingCanvas.tsx:1683 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - A change of size reports nothing when no area was last asked for: frontends/shell/src/canvas/WorkingCanvas.tsx:1954-1958 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/canvas/viewportBbox.ts:70-80 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The panel.**
  - Current view is the default: frontends/shell/src/publish/PublishPanel.tsx:316-319 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD and frontends/shell/src/publish/PublishPanel.tsx:329 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - It is disabled only by `!hasSettledView`: frontends/shell/src/publish/PublishPanel.tsx:30-38 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The reason: frontends/shell/src/publish/PublishPanel.tsx:595-599 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The box is read at the click: frontends/shell/src/publish/PublishPanel.tsx:347-358 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.

0.5 Consuming-side interfaces, read before any seam is drafted.
- **The host's request.** `publishPrepare(datasetHandle, styleDoc, scope: PublishScopeInput, filterActive)`: frontends/shell/src/publish/client.ts:31-44 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - `PublishScopeInput` is `whole-file`, or `viewport-bbox` with four plain numbers: frontends/shell/src/publish/types.ts:89-97 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The host side is `PublishScope`/`JsBbox`: frontends/shell/src-tauri/src/publish.rs:83-99 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - **Unchanged by this piece.** Only the four numbers' source changes.
- **The pure scope builder.** `resolvePublishScope(choice, bbox: Bbox | null)` decodes the wire HexF64 box: frontends/shell/src/publish/PublishPanel.tsx:40-63 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The approval prompt's Row scope.**
  - It is composed by the host: frontends/shell/src-tauri/src/publish.rs:124-135 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - It is rendered as given: frontends/shell/src/publish/PublishDialog.tsx:251-252 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The attempt's query is fixed at prepare: frontends/shell/src-tauri/src/publish.rs:169-191 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
- **The counts' box and `onViewShown`.** Phase B's; read at the code base (RS1 to RS6). This form draws against Amendment 2 item 2 and Amendment 3 as written, and every assumption about them is an RS item.
- **The real-App harness.**
  - The publish-client mock records each prepare's scope: frontends/shell/src/App.layout.test.tsx:121-128 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - The canvas stand-in keeps App's props: frontends/shell/src/App.layout.test.tsx:130-171 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - RF8, the precedent: frontends/shell/src/App.layout.test.tsx:502-514 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD.
  - Phase B's App.selection.test.tsx drives an issued Apply with its stand-in calling `onViewShown` (Amendment 3 item 2). It is read at the code base.

0.6 Hypotheses.
- **H1.** After milestone 2, the counts' box equals the box the map shows at every moment ordinary use can reach.
  - Discriminators: RS4 and RS5, then E-CV and E-CV-RESIZE.
  - If it fails: I3.
- **H2.** The auto-fit after an issued Apply runs on the first batch carrying geometry and reaches `onViewShown` on both arms (the shipped candidate arm and baseline).
  - Discriminator: RS3, then E-CV on the shipped arm.
- **H3.** When the Apply's matches all arrive before the fit, Zoom to layer just after the fit reports the same box as the fit.
  - Discriminator: E-CV step EV5, recorded and not asserted.

## §1. May and may not claim

- **May claim:** §2's behaviour and the properties §4 tests.
- **May not claim:**
  - any performance figure or docs/08 row;
  - macOS or Linux above L1;
  - that the export applies the filter (ADR-017 §8; ADR-024; unchanged);
  - that the exported rows are those whose geometry meets the box. The query is covering-bbox intersection (ADR-017 §8).
  - anything undoable (ADR-006: publishing is class 3, approval-gated).
- **No change** to the wire, SKP, the kernel, the engine, the renderer, `canvas/` or PublishDialog.tsx.
  - src-tauri changes only under OPEN-2 (b): one format string and its test.
- **ADRs cited, none amended:** 006, 010, 017; and 024 (Proposed).
- **Strings.** Every new or changed operator string is the human's at P6. §2.4 drafts them under item 2e.

## §2. The change

### 2.1 App.tsx
- (a) **The getter.** App passes PublishPanel the counts' box as the source of Current view, read at the click. It never passes `lastViewportBboxRef`.
  - If the counts' box is an AuthoritativeBbox, the panel builds `PublishScopeInput` from its numbers directly, and the HexF64 round trip leaves the export path (§2.2(b)).
- (b) **Unchanged:** `lastViewportBboxRef`, its declaration, its three writers, the refusal recovery, `handleApplyFilter`'s deps, both dev `queryWithFilter` hooks, `applyFilter`, and item 39's behaviour (the 2026-10-12 direction, item 2).
- (c) **The admission reset** [RS6]. If phase B leaves the counts' box standing across an admission, `handleAdmitted` empties it beside `setLastViewportBbox(null)`.
  - This is one statement at the admission site, not in `onViewShown`'s handler, so OPEN-11's handler term is untouched.
  - Without it, a reopen's Current view would send the previous dataset's box (ADR-010 rule 1).
- (d) **[OPEN-1 (a) only]** `hasSettledView`, its state, its guarded set in `onViewportChanged` and its reset in the admission closure leave App. Its only reader was PublishPanel, so after the change it has no caller (block-on-sight 11).
  - `lastViewportBboxRef`'s write in that closure stays.
  - Under OPEN-1 (b), `hasSettledView` stays as it is.
- (e) **Comments** that name the Export panel as a reader of `lastViewportBboxRef` are corrected (the ref's comment block, frontends/shell/src/App.tsx:834-846 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD, and the within handler's comment). They are Documentation.

### 2.2 PublishPanel.tsx
- (a) **The prop.** `getLastViewportBbox` is replaced by one getter of the counts' box.
  - It is named for what it returns. The name is fixed at RS1.
  - It is read at the click in `runPrepare` and `runPrepareWithDestination`, never snapshotted.
- (b) **`resolvePublishScope`'s input type** follows the box's type (RS1). Its null refusal stays.
- (c) **[OPEN-1 (a)]**
  - Availability is "the counts' box is not null", read through its subscribe function with `useSyncExternalStore` over a boolean snapshot, so the panel re-renders only when availability changes.
  - `currentViewOptionDisabled` takes that boolean or the box.
  - The `hasSettledView` prop is removed.
  - The disabled reason is §2.4's ruled sentence.
  - [OPEN-1 (b)]: availability stays `hasSettledView`, and the reason is unchanged.
- (d) **The defensive refusal text** in `runPrepare` (frontends/shell/src/publish/PublishPanel.tsx:352-355 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD) is unchanged.
  - It is reachable only through the dev hooks: the button is disabled whenever the box is null.
  - Named under item 2c; the worker records it in that line's source comment.
- (e) **Doc comments** naming `lastViewportBboxRef` as the source (lines 30-63, 296-304) are corrected, and so is types.ts's comment at frontends/shell/src/publish/types.ts:89-94 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. They are Documentation.

### 2.3 Tests that change
- **RB18 (milestone 2)** [RS7]. If RB18 observes `lastViewportBboxRef` through the Export panel's prepare, it is re-aimed to observe the ref through the refusal recovery (RCV4's observer).
  - Its assertion (a call of `onViewShown` writes neither the ref nor the last-asked area, and issues no query) and its mutation are unchanged.
  - The re-aim is listed in the PR body.
- **PublishPanel.test.ts**, only under OPEN-1 (a): the `currentViewOptionDisabled` cases (frontends/shell/src/publish/PublishPanel.test.ts:58-64 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD) and the `PublishControls` props case at line 412 follow the new input. They are listed in the PR body.
- **RF8** is predicted to pass unedited.

### 2.4 Words (item 2e). Each is the human's to approve or replace; P6 applies.
- **[OPEN-1 (a)] The disabled reason, replacing frontends/shell/src/publish/PublishPanel.tsx:597 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD:**
  `Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.`
  - **The clause check:**
    - *"Not available yet"*: the option is disabled exactly when the counts' box is null (§2.2(c)).
    - *"the map has not drawn this file's data"*:
      - the box is emptied at each admission (§2.1(c));
      - the canvas is keyed on the dataset, so a new file starts unfitted;
      - the auto-fit runs on the first batch that carries geometry, before that batch is drawn (WorkingCanvas.tsx:1478-1488 and :1683 above), and it reaches `onViewShown` (RS3);
      - so no data of this file is drawn while the box is null. The reverse is not claimed.
    - *"Pan or zoom the map"*: an interactive pan or zoom reports through `onViewStateChange` (frontends/shell/src/canvas/WorkingCanvas.tsx:2018-2028 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD), which writes the box and enables the option. This is true even for a file with no geometry.
    - *"or choose Whole dataset"*: that radio is never disabled (frontends/shell/src/publish/PublishPanel.tsx:574-583 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD).
  - **Named and not blocking (item 2c):** the dev seam `e2eSetViewState` also enables it.
  - **To check at RS4:** a map of zero size. If the layout lets the map region reach width or height 0, the fit still writes a box (it computes with a size of at least 1). Say so at RS4.
- **[OPEN-2 (b)] The host's Row scope sentence:** §11 OPEN-2 carries candidate words for the human to type, since it is a red line by my reading. It is not drafted here as a sentence to approve.

### 2.5 KNOWN-LIMITATIONS item 42 (RS9)
- **Narrowed, not retired.** It stays true of the v0.1.0 artifact, and the release hold (item 4) means the next release is the first to ship the fix.
- **Its on-main note** becomes OPEN-3's words.
- **At the next release,** the release notes retire it, outside this piece.
- **Item 39 is not edited.**

### 2.6 Boundaries
- **May edit:**
  - `src/App.tsx`;
  - `src/publish/PublishPanel.tsx` and `src/publish/types.ts` (comment only);
  - the tests of §4, and the RB18 re-aim in `src/App.selection.test.tsx`;
  - `src/publish/PublishPanel.test.ts`;
  - new `e2e/export-view.mjs`;
  - `package.json` (one script line, `e2e:export-view`);
  - `e2e/README.md`;
  - `MANUAL-WALKTHROUGH.md` (the new Part only, appended at the tail);
  - `KNOWN-LIMITATIONS.md` (item 42's note only);
  - under OPEN-2 (b) only, `src-tauri/src/publish.rs` (`row_scope_sentence`'s ViewportBbox arm and one test).
- **Not edited:**
  - everything under `src/canvas/`, `src/skp/`, `src/streaming/`, `src/residency/`, `src/workspace/` and `src/feature/`;
  - PublishDialog.tsx, FilterPanel.tsx and AdmissionPanel.tsx;
  - `src-tauri/**` except as above;
  - every file outside `frontends/shell`, records excepted.

### 2.7 Portability (R1 to R6)
- No new OS boundary.
- No paths parsed or built.
- No OS-conditional code, and no new ignore.
- **Levels:**
  - Windows: unit, render and e2e tests, and the walkthrough rows;
  - macOS and Linux: by construction, L1 unit only. L2 is deferred to PLAN node `shell-real-app-run-macos-linux`.
- **Expected reduction:** none.

## §3. Fixtures and predicted outcomes
- **Fixture:** `filter-zoned.parquet` (2,000 polygons, `zone`). Its sha256 is recorded before and after each run. No new fixture.
- **Predicted:**
  - every existing suite passes at the head, with only §2.3's edits;
  - E-CV and E-CV-RESIZE pass;
  - at main before the change, E-CV's EV4 fails with F equal to A (the defect);
  - EV5 is recorded (H3).

## §4. Tests, and one mutation each

Every mutation is observed:
- by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it;
- a `verify-mutation` run is not an observation;
- recorded-mutation comment lines count in §7.

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| RCV1 (the human's test) | render, App.selection.test.tsx | Open; the stand-in reports b1 (`onViewportChanged`); an issued Apply through FilterPanel; the stand-in's `resetFitForNewGeneration` is called once; the stand-in calls `onViewShown(b2)`, the fit; the Export button's prepare carries exactly `viewport-bbox` b2 | App's Current-view getter reads `lastViewportBboxRef`; fails on toEqual, receiving b1 |
| RCV2 | render, same | Open A; report b1; open B; with no canvas report, Current view is disabled, and the panel's `publishPrepare("current")` dev hook returns the refusal with no prepare call | drop §2.1(c)'s reset (if phase B lacks one, drop phase B's); fails: b1 is sent, or the option is enabled |
| RCV3 [OPEN-1 (a)] | render, same | Open; the stand-in calls only `onViewShown(b0)`; Current view is enabled with no reason; Export carries b0 | availability from the old `hasSettledView` signal; fails on the `disabled` attribute |
| RCV4 | render, same | The ref and the recovery stay: report b1; issued Apply; `onViewShown(b2)`; a refused Apply; the recovery re-issue carries b1, not b2 | `handleApplyFilter`'s `getLastViewportBbox` reads the counts' box; fails, receiving b2 |
| UPP1 [OPEN-1 (a)] | unit, PublishPanel.test.ts | Disabled for null, enabled for a box; the reason constant equals the ruled words | return enabled always; fails on null |
| PRS [OPEN-2 (b)] | unit, src-tauri/src/publish.rs | The ViewportBbox sentence equals the human's typed words with the four numbers | restore the old words; fails |
| E-CV | e2e, e2e/export-view.mjs | EV0 open, first pixels. EV2: `e2eSetViewState` to a corner view, then prepare Current view through `publishPrepareWithDestination`; box A is parsed from the prompt's `row_scope`; abandon. EV3: apply `zone = 'residential'` through the `queryWithFilter` seam (applied), then wait until the resident count is above 0 after it. EV4: prepare Current view gives F; F ≠ A. EV5: click Zoom to layer, prepare, Z; whether Z = F is recorded, not asserted (H3) | App's getter reads `lastViewportBboxRef`; fails at EV4 (F = A) |
| E-CV-RESIZE | e2e, same | EV6: Clear through the same seam and wait for the refit; prepare gives F′. Shrink the map (`setViewportSize`); prepare gives R; R ≠ F′ | remove `onViewShown`'s call at the resize site in WorkingCanvas.tsx; fails (R = F′) |
| E-CV-OPEN [OPEN-1 (a)] | e2e, same | EV1: after the first pixels and before any input, `input[value=current]` is not disabled | availability from `hasSettledView`; fails |

- **The proofs:**
  - the human's property is proved by RCV1 (render, deterministic) and E-CV (the real canvas, the real fit, the real host prompt);
  - the resize window by E-CV-RESIZE;
  - no carry-over between files by RCV2;
  - the ref and the recovery staying as they are by RCV4;
  - availability after an open by RCV3 and E-CV-OPEN.
- **The e2e runs** are the custodian's, under the human's port-5400 harness approval (§0.1). The form names no other rule for running them.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H3 and §3.

**Declared unchanged:**
- `lastViewportBboxRef`, its writers and the refusal recovery;
- `onViewShown`'s handler and its call sites (OPEN-11's terms);
- `canvas/` whole, item 39, the panel's default and its key;
- `FILTER_SCOPE_SENTENCE`;
- PublishDialog.tsx, the host prompt's fields, ADR-017 §8's two shapes, `bbox_crs: None`;
- every string except §2.4's and OPEN-2 (b)'s, once ruled;
- the dependencies and the lockfile.

**Invalidators.** Each one means STOP and report.
- **I1:** at the code base there is no counts' box written by the three callbacks (RS1, RS2).
- **I2:** its interface differs from §0.5's assumptions beyond a class 3 rename.
- **I3:** a camera write or a size change that ordinary use reaches leaves the counts' box differing from the map (RS4, RS5).
- **I4:** the admission reset changes a phase B test's assertion.
- **I5:** an edit is needed under `canvas/` or in src-tauri beyond OPEN-2 (b).
- **I6:** a dependency seems necessary.
- **I7:** a test can pass only by mocking the counts' box or PublishPanel.
- **I8:** code of an OPEN item is needed before its ruling.
- **I9:** an existing suite fails for a reason not in §2.3.

**Falsification.** The form is wrong if the counts' box cannot serve as the export's source without changing its writers, which are OPEN-11's terms.

## §6. Instruments
- **Assertions:** every R, U, P and E row.
- **Observation:** EV5.
- **Measurements:** none.
- **The human's:** the new Part's felt rows and the P6 sight.

## §7. Declared values and ceilings

**Constants:** none new.

**Budget.** Insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.
- `<base>` is the merge base with origin/main when the branch is cut.
- After a merge of main, the count is taken from the new merge base, and the record names it.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| P product | App.tsx ≤ 40, PublishPanel.tsx ≤ 60, types.ts ≤ 8, package.json ≤ 2 | 110 |
| R host [OPEN-2 (b)] | src-tauri/src/publish.rs ≤ 20 | 20 |
| T tests | App.selection.test.tsx ≤ 220 (RCV1 to RCV4 and the RB18 re-aim), PublishPanel.test.ts ≤ 40 | 260 |
| E e2e | export-view.mjs ≤ 220, margin 60 | 280 |
| **Total** | **9 files** | **670** |

- **Outside the count:** MANUAL-WALKTHROUGH.md ≤ 50; e2e/README.md ≤ 25; KNOWN-LIMITATIONS.md ≤ 8.
- An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight
1. A file edited outside §2.6.
2. A dependency or lockfile change.
3. Any change to `lastViewportBboxRef`'s declaration or writers, or to the refusal recovery's read.
4. `onViewShown`'s handler writing more than the counts' box, or a new call site of `onViewShown`.
5. The export's Current view reading any box other than the counts' box, or reading it at any time other than the click.
6. A box from an earlier admission reaching the export.
7. Any change to the wire, SKP, the kernel, the engine or `canvas/`; any src-tauri change except OPEN-2 (b)'s, as ruled.
8. Any edit to PublishDialog.tsx.
9. A new operator string outside §2.4 and OPEN-2, or one that is unruled or unsighted.
10. Code of an OPEN item before its ruling.
11. A prop, state, export or callback without a product caller (for example `hasSettledView` left with no reader under OPEN-1 (a)).
12. A performance claim.
13. A quote of the human's words marked verbatim that does not match its source.
14. A new test without its observed mutation, or a `verify-mutation` run called an observation.
15. Item 42 retired while v0.1.0 is the latest release, or item 39 edited.

## §9. Gates
- **Architect and reviewer,** full gating. Verdicts follow the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a Documentation finding is fixed in the same PR before the merge;
  - each gate checks §8 item by item.
- **Wording-block rule** (the 2026-10-11 direction, item 2; AUTONOMY.md §31):
  - a gate whose only blocking findings are a sentence's words writes replacement words with their clause check;
  - §2.4's words and OPEN-3's words are the human's, and are answered as item 2b says;
  - comments and README lines are not the human's, so item 2d applies to them;
  - OPEN-2 (b)'s words are red-line, typed, and outside the rule (item 2f).
- **Suites,** green first:
  - `npm run verify`;
  - every e2e suite at the code base, listed in the PR body, plus `e2e:export-view`;
  - under OPEN-2 (b), `cargo test` for the shell crate;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Operator.** The new Part, at the next unused letter at the code base (after milestone 2's), with a blank result log, queued to the sitting:
  - X0: read §10, the last amendment first.
  - X1 [OPEN-1 (a)]: open `filter-zoned.parquet` and, before any input, open Export. Current view is available.
  - X2: pan to a corner, then Apply `zone = 'residential'`; the map fits. Export Current view, read the dialog's Row scope numbers, abandon. Zoom to layer, export again, read them, abandon. Felt: do the numbers tell you the area is the one on the map?
  - X3: Clear; the map fits. Drag a splitter to shrink the map, export Current view, abandon. The numbers differ from X2's.
  - X4: the P6 sight of §2.4's and OPEN-2's words.

## §10. Amendments
Opens empty, append-only.
- Amendment 1 records the human's rulings on OPEN-1 to OPEN-3.
- Amendment 2 is the re-sweep at the code base (§0.3), before any code.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | Current view available once the map has fitted itself after an open | (a) | no |
| OPEN-2 | The dialog's Row scope line | (b), the human's typed words | yes, by my reading |
| OPEN-3 | Item 42's narrowed on-main note | the drafted words | no |

## §12. Heavy runs
The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD. This form names no other rule for running builds.
````

## 3. OPEN items

**OPEN-1: is Current view available once the map has fitted itself after an open?**
- **(a) Yes.**
  - Current view is available exactly when the counts' box is not null.
  - PublishPanel subscribes through the box's listener set and re-renders only when availability changes.
  - `hasSettledView` leaves App, because it has no other reader.
  - The new reason sentence in §2.4 is checked clause by clause.
  - About 30 more lines, plus RCV3, UPP1, E-CV-OPEN and row X1.
- **(b) No.**
  - `hasSettledView` stays the signal and the reason sentence is unchanged.
  - After an open, the default-checked Current view still blocks Export until the first pan, zoom, Zoom to layer or reported resize, even though the box it would send is already correct.
- **Recommendation: (a).** Availability and the box sent then come from one source and cannot disagree, and an open no longer leaves the default scope blocked.
- **Red line:** no. The string goes to P6 sight.
- **What waits on it:** §2.2(c), §2.1(d), §2.4's sentence, RCV3, UPP1, E-CV-OPEN and X1. The core fix does not wait.

**OPEN-2: does the dialog's Row scope line change?**
- **Today's line** is composed by the host (`frontends/shell/src-tauri/src/publish.rs:129-133 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:HASH-TBD`) and says "the current viewport extent".
  - After the fix, the numbers are the map's extent at the click.
  - **One ordinary case is still not covered:** a pan made while the in-app approval dialog is open. That dialog does not block the map. The attempt's query is already fixed at prepare (`publish.rs:169-191`), so "current" is then untrue.
- **(a) Unchanged.** No src-tauri edit. The gap above is recorded in item 42's note and in the line's source comment, which is the "accepted as it stands" route and is the human's to choose.
- **(b) The host's sentence names the moment.** These are candidate words, for the human to type or replace: `row scope: the map's extent when Export interactive map… was clicked (xmin {}, ymin {}, xmax {}, ymax {}) — not the whole file`. Clause check:
  - "the map's extent": the counts' box is the canvas's full CSS extent from the camera (`viewportBbox.ts` computation);
  - "when Export interactive map… was clicked": `handlePublishClick` → `runPrepare` reads it at the click (PublishPanel.tsx:347-348, 413-415). The dev hook path reads it at the hook call (dev-only, item 2c);
  - "(xmin … ymax …)": unchanged format;
  - "not the whole file": unchanged.
  - Cost: about 20 lines in publish.rs plus test PRS. PublishDialog.tsx is unchanged.
- **(c) Also show the numbers in the Export panel.** Not recommended: it is scope the human did not ask for.
- **Recommendation: (b).** It is the only option that leaves no untrue word in an ordinary case.
- **Red line: yes, by my reading.** It is the class-3 approval prompt that ADR-017's 2026-08-17 exposure review passed. So it is ruled in typed words only, and item 2f keeps it out of the wording-block rule. The human confirms whether it is a red line.
- **What waits on it:** only the publish.rs edit and PRS.

**OPEN-3: item 42's narrowed on-main note (item 2e; drafted for the human to approve or replace).**
- **Draft words:** `On main, fixed by export-current-view-after-unreported-fit: Current view sends the area the map shows when Export interactive map… is clicked, including after the map fits itself to the data and after a change of size. The v0.1.0 build still behaves as described above.`
- **Under OPEN-1 (a), add:** `It can be chosen as soon as the map has drawn the file's data.`
- **Under OPEN-2 (a), add:** `A pan made while the approval dialog is open does not change the area; the dialog's Row scope numbers are the area exported.`
- **Clause check:**
  - "sends the area the map shows when … clicked": read at the click, from the counts' box, which every camera write and size change updates (RS4/RS5, H1);
  - "after the map fits itself": `onViewShown` at the auto-fit (RS3);
  - "after a change of size": `onViewShown` at the resize that asks for nothing; within and query report;
  - "v0.1.0 still behaves as described": the tag is unchanged;
  - the OPEN-1 (a) sentence: §2.4's clause check;
  - the OPEN-2 (a) sentence: the query is fixed at prepare (publish.rs:169-191), and the dialog's numbers are that query's box.
- **Red line:** no. It is P6 sight.
- **What waits on it:** the KNOWN-LIMITATIONS edit only. If item 42 has not merged when code starts (RS9), the edit moves to a docs-lane follow-up.

**For the custodian, not the human:** the node's `gate` field should name the form path, and its `depends_on` should gain `known-limitations-current-view-stale-box`. Under the overlap check, this piece's paths are milestone 2's (App.tsx, PublishPanel.tsx), so it starts only after that merge, as placed.

## 4. Files read
- C:\dev\spatial-ide\state\directives\2026-10-12-current-view-graded-s1-placed-limitation-release-hold-214-merged.md
- C:\dev\spatial-ide\state\consults\2026-10-11-export-current-view-after-unreported-fit-read.md
- C:\dev\spatial-ide\state\directives\2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md
- C:\dev\spatial-ide\state\directives\2026-10-11-direction-after-status-review.md
- C:\dev\spatial-ide\state\directives\2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md (lines 10-23)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (§0 to §12, Amendments 2 to 6)
- C:\dev\spatial-ide\frontends\shell\src\App.tsx (90-390, 800-1039, 1840-2062)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx (whole)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishDialog.tsx (220-270)
- C:\dev\spatial-ide\frontends\shell\src\publish\types.ts (85-130)
- C:\dev\spatial-ide\frontends\shell\src\publish\client.ts (20-60)
- C:\dev\spatial-ide\frontends\shell\src-tauri\src\publish.rs (70-199)
- C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx (526-543, 1310-1359, 1470-1544, 1940-1964; greps)
- C:\dev\spatial-ide\frontends\shell\src\canvas\viewportBbox.ts (40-81)
- C:\dev\spatial-ide\frontends\shell\src\App.layout.test.tsx (1-260, 470-530)
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (365-371; item list)
- C:\dev\spatial-ide\PLAN.yaml (the two nodes; dependants)
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §22, §25 to §31)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (whole)
- C:\dev\spatial-ide\docs\adr\ADR-024-class-3-permission-boundary-and-first-exposure.md (1-30, 120-240)
- C:\dev\spatial-ide\docs\adr\ADR-017-static-bundle-format-and-publish-semantics.md (342-396, 1110-1143)
- C:\dev\spatial-ide\docs\adr\ADR-010-render-frames-origins-boundaries.md (headings)
- e2e greps across C:\dev\spatial-ide\frontends\shell\e2e\ (no suite uses the Current view scope today)
- C:\dev\wt\mm2b\frontends\shell\src\ (looked at only, not cited: phase B's counts' box and `onViewShown` are not in that worktree yet, which confirms that RS1 to RS6 have to wait for the code base)
