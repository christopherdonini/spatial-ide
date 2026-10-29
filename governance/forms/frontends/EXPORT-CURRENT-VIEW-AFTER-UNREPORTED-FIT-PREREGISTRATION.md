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
- **The printed lines,** byte-copied by the custodian's script from that run (for `export`, `current view`, then `viewport`):

  ```text
  No prior art recorded for "export". Research it before planning an implementation.
  No prior art recorded for "current view". Research it before planning an implementation.
  capability: lod-selection-metric → Cesium [CONCEPTUAL], QGIS [CONCEPTUAL], topojson-simplify [CONCEPTUAL], openlayers [CONCEPTUAL], three.js [CONCEPTUAL], Leaflet [REJECT]   (worth-owning, P1)
  ```

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
  - The declaration: frontends/shell/src/App.tsx:837 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:2daa358861a63fab6d72d65f99577c21371241ec20612716b6708ef30196e50b.
  - The admission reset: frontends/shell/src/App.tsx:1019-1025 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:5ed75a07879d64d2793c443f2d963ba65f6ef2bbb7f9c87159d4c8eb8b1ffe9d.
  - `onViewportChanged`: frontends/shell/src/App.tsx:1886-1900 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:1bec01beec3d484252f8711be37aa9ca18ff90bc51cd637c5106cd9eee249af8.
  - `onViewportWithinLastQuery`: frontends/shell/src/App.tsx:1901-1906 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:940750fe28e83d7cfea81c74982acd6140e71be94901ea67888d551ad2e1b53d.
- **The ref's readers.**
  - The refusal recovery: frontends/shell/src/App.tsx:327-331 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:228c3274148903e2b752b8e8be3a53ade786ddaf86c1e9583d13b9fb5a821bed, through frontends/shell/src/App.tsx:968 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:15c0aefd863c40b2bf3ad7e16370100b0fcf9a7a81d1f625fd26871640c11564 and the two dev `queryWithFilter` hooks.
  - The Export panel: frontends/shell/src/App.tsx:2034-2043 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:a8d9b976d89d4f7ec2cac70e5ea711c6771e40729d00e2120bf96aaa4db25c85.
- **The Apply path.** An issued Apply re-arms the fit: frontends/shell/src/App.tsx:345-349 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:07dd6f09435de3afccf8d2f1bd667bcf0e2d6d59502b88907f0177c690777b30 and frontends/shell/src/canvas/WorkingCanvas.tsx:1532-1536 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:e82b33496db058c3b71421e7cabd6b3facbe4a6e6b4b7ebd3b7546f2aa7ac706.
- **The unreported camera writes.**
  - The fit writes the camera and reports nothing: frontends/shell/src/canvas/WorkingCanvas.tsx:1326-1356 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:13152c661775673fd416b83faf54e0aa2da184c16c7126b1717cb0a1515755d9.
  - It is called from frontends/shell/src/canvas/WorkingCanvas.tsx:1478-1488 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:c27ca0ad6214c9518162452c50c83da344fabdf2b9999483e97d2a47f4a85405 and frontends/shell/src/canvas/WorkingCanvas.tsx:1683 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:1888da38288257b416ba8a99a0e25d74ac697859628e1bc4c01b40f2acd1b6c7.
  - A change of size reports nothing when no area was last asked for: frontends/shell/src/canvas/WorkingCanvas.tsx:1954-1958 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:00298acdd3ba2d68d4fecb804c6c5b9cc65e61b0d88df335ac348f1b024bb8bb and frontends/shell/src/canvas/viewportBbox.ts:70-80 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:551ab53a8cc1e6af91f49d40e8ef54ae8e68af060b2e0107bedf3b96cf75005c.
- **The panel.**
  - Current view is the default: frontends/shell/src/publish/PublishPanel.tsx:316-319 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:2268f4f10b571247d480a8e74fa6d80eade3ad18e4bcdea686c8f6934abc16aa and frontends/shell/src/publish/PublishPanel.tsx:329 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b.
  - It is disabled only by `!hasSettledView`: frontends/shell/src/publish/PublishPanel.tsx:30-38 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:af1d3bea9a849189934a2db30227daa8d5cfe6cbc919d208933aa8a504151739.
  - The reason: frontends/shell/src/publish/PublishPanel.tsx:595-599 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:1ef8b38c7af70613c33d27243dd7bab8684c601841068b52d1704e383662d90b.
  - The box is read at the click: frontends/shell/src/publish/PublishPanel.tsx:347-358 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:7e071f92c19ac62ec602e8958968563e53f6f00d6abe904939aae029ba3f1529.

0.5 Consuming-side interfaces, read before any seam is drafted.
- **The host's request.** `publishPrepare(datasetHandle, styleDoc, scope: PublishScopeInput, filterActive)`: frontends/shell/src/publish/client.ts:31-44 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:ed08a8f9d56d3cf7ff55a799688c6ca809178ddbd87b7b663325aa8cfedabad6.
  - `PublishScopeInput` is `whole-file`, or `viewport-bbox` with four plain numbers: frontends/shell/src/publish/types.ts:89-97 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:f0749ea735ba56136918ffcbaa2b50e455ad32e7202c9b9dd9407b9d47363d6e.
  - The host side is `PublishScope`/`JsBbox`: frontends/shell/src-tauri/src/publish.rs:83-99 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:b8ab9bdabc0297f75ea21b8bb52bf87abb31e8f2e47a32bbee43b4725887495f.
  - **Unchanged by this piece.** Only the four numbers' source changes.
- **The pure scope builder.** `resolvePublishScope(choice, bbox: Bbox | null)` decodes the wire HexF64 box: frontends/shell/src/publish/PublishPanel.tsx:40-63 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:1947dea339bfcb946675b0a68d2862f06846e8f70311a3d91b96238ddb7001e8.
- **The approval prompt's Row scope.**
  - It is composed by the host: frontends/shell/src-tauri/src/publish.rs:124-135 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:5b3088e1a740b7e19bf89e8aee875a00c86003bf858e2511d5a007b80d559d38.
  - It is rendered as given: frontends/shell/src/publish/PublishDialog.tsx:251-252 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:45e66e2c707fa32d8a2fbe87b3aeabca80d334059227980c3b18a85102d31381.
  - The attempt's query is fixed at prepare: frontends/shell/src-tauri/src/publish.rs:169-191 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:6d418f080d9786d27fc0f9db4e06bebed0d2833d6b6a4fb3e8f91551ef991a22.
- **The counts' box and `onViewShown`.** Phase B's; read at the code base (RS1 to RS6). This form draws against Amendment 2 item 2 and Amendment 3 as written, and every assumption about them is an RS item.
- **The real-App harness.**
  - The publish-client mock records each prepare's scope: frontends/shell/src/App.layout.test.tsx:121-128 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:e2908d269d87299a36641e1034a3c22d2e3fae5a165e8405f4f4344925055291.
  - The canvas stand-in keeps App's props: frontends/shell/src/App.layout.test.tsx:130-171 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:884308b174615e14f33d8c9de6d8eb7363f632af2e6ef523f1d22fc6a34bc648.
  - RF8, the precedent: frontends/shell/src/App.layout.test.tsx:502-514 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:907619046c658db3364d5190130e33a8e34a2e24e158721d3c8fa458fe50dc96.
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
- (e) **Comments** that name the Export panel as a reader of `lastViewportBboxRef` are corrected (the ref's comment block, frontends/shell/src/App.tsx:834-846 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:a292ca12eb1f53a1e94023c5c8b3e562150effad22b47f9c6f202cb751676c18, and the within handler's comment). They are Documentation.

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
- (d) **The defensive refusal text** in `runPrepare` (frontends/shell/src/publish/PublishPanel.tsx:352-355 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:f51b9c8a64ed1ae26ac034f7a0b581ccb94ae0b6d8200e35b781e6b629e0e903) is unchanged.
  - It is reachable only through the dev hooks: the button is disabled whenever the box is null.
  - Named under item 2c; the worker records it in that line's source comment.
- (e) **Doc comments** naming `lastViewportBboxRef` as the source (lines 30-63, 296-304) are corrected, and so is types.ts's comment at frontends/shell/src/publish/types.ts:89-94 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:108fb9ce4cf372ba702c7ecf8e019d5c7742218a45d4c1086915fe72680e44e7. They are Documentation.

### 2.3 Tests that change
- **RB18 (milestone 2)** [RS7]. If RB18 observes `lastViewportBboxRef` through the Export panel's prepare, it is re-aimed to observe the ref through the refusal recovery (RCV4's observer).
  - Its assertion (a call of `onViewShown` writes neither the ref nor the last-asked area, and issues no query) and its mutation are unchanged.
  - The re-aim is listed in the PR body.
- **PublishPanel.test.ts**, only under OPEN-1 (a): the `currentViewOptionDisabled` cases (frontends/shell/src/publish/PublishPanel.test.ts:58-64 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:b33a585469b314fb529b14074604957b1c7363fd08af6436e96aa9d737183fac) and the `PublishControls` props case at line 412 follow the new input. They are listed in the PR body.
- **RF8** is predicted to pass unedited.

### 2.4 Words (item 2e). Each is the human's to approve or replace; P6 applies.
- **[OPEN-1 (a)] The disabled reason, replacing frontends/shell/src/publish/PublishPanel.tsx:597 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:fbfb380b5afbb5079f7f8d329e78adef8a3b72c6b18650e9a34497998e6989a1:**
  `Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.`
  - **The clause check:**
    - *"Not available yet"*: the option is disabled exactly when the counts' box is null (§2.2(c)).
    - *"the map has not drawn this file's data"*:
      - the box is emptied at each admission (§2.1(c));
      - the canvas is keyed on the dataset, so a new file starts unfitted;
      - the auto-fit runs on the first batch that carries geometry, before that batch is drawn (WorkingCanvas.tsx:1478-1488 and :1683 above), and it reaches `onViewShown` (RS3);
      - so no data of this file is drawn while the box is null. The reverse is not claimed.
    - *"Pan or zoom the map"*: an interactive pan or zoom reports through `onViewStateChange` (frontends/shell/src/canvas/WorkingCanvas.tsx:2018-2028 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2), which writes the box and enables the option. This is true even for a file with no geometry.
    - *"or choose Whole dataset"*: that radio is never disabled (frontends/shell/src/publish/PublishPanel.tsx:574-583 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:b06081552179ca24596a1008a3a15d7cfcfa9117671417c27146976ad0e9bd17).
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
The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 2ca3a53ca812684a7b2579980db2f980c5d2a286 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for running builds.

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-3 (class 5)

*Written by the custodian on the human's typed ruling, before any code. References only, except item 2's sentence and item 3's words, byte-copied by script. The ruling is `state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md`, item 2.*

1. **OPEN-1: (a).** Every passage marked [OPEN-1 (a)] binds: §2.1(d), §2.2(c), §2.3's PublishPanel.test.ts cases, RCV3, UPP1, E-CV-OPEN and X1. The passages marked [OPEN-1 (b)] fall away.
   - §2.4's disabled-reason sentence is not ruled by this answer. It stays the architect's draft until the human answers it under item 2b, at the latest at X4 (§9).
2. **OPEN-2: (b), a red line, confirmed by the human.** The host's Row scope sentence is the human's typed words, line 14 of the directive less its three leading spaces (state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md:14 @ 88067f2c6f23d434cfaf086c5f0ca3899b564e23 sha256:2fa4cefe536f82c266bbd4e15ddab24d34fe3be42f756e2d06d0a8dc28c7c0f5):

   ```text
   row scope: the map's extent when Export interactive map… was clicked (xmin {}, ymin {}, xmax {}, ymax {}) — not the whole file
   ```

   - Each `{}` is one of the four numbers, in the order the line names them. PRS asserts the sentence byte for byte with the four numbers filled.
   - The passages marked [OPEN-2 (b)] bind, and OPEN-2 (a)'s and (c)'s fall away. The sentence is outside the wording-block rule, as §9 says (item 2f).
3. **OPEN-3: the drafted words, with the OPEN-1 (a) sentence and without the OPEN-2 (a) one** (the draft's OPEN-3, `state/consults/2026-10-12-export-current-view-after-unreported-fit-architect-draft.md`, section 3). Item 42's on-main note becomes:

   ```text
   On main, fixed by export-current-view-after-unreported-fit: Current view sends the area the map shows when Export interactive map… is clicked, including after the map fits itself to the data and after a change of size. It can be chosen as soon as the map has drawn the file's data. The v0.1.0 build still behaves as described above.
   ```

   - **Placement, the custodian's:** the added sentence stands second, after the sentence about Current view, so that its "It" names Current view. Placed last, it would follow the sentence about the v0.1.0 build and read as being about that build. This is told to the human with this amendment; a different placement is the human's word.
   - §2.5 applies: the note replaces item 42's on-main paragraph when this piece lands. If item 42 has not merged when code starts (RS9), the edit moves to a docs-lane follow-up, as the draft says.
4. **Generation:** the node's generation goes up by one.
5. **Superseded index:** §11's OPEN-1 to OPEN-3 → items 1 to 3; §2.4's [OPEN-2 (b)] bullet → item 2.

Nothing above is edited.

### Amendment 2 — the human's ruling on OPEN-3's placement (class 5)

*Written by the custodian on the human's typed ruling (`state/directives/2026-10-14-215-c1-216-merge-current-view-open-3-b2-1b-open-1-to-10.md`, item 3), before any code. References only.*

1. **OPEN-3:** the added sentence (Amendment 1 item 3) stands second, as the custodian placed it.
2. **The start:** milestone 2 has merged (PR #217, 2026-10-14). This piece is next in slot 1; §0.3's re-sweep comes first, in its own amendment, before any code.

Nothing above is edited.

### Amendment 3 — the re-sweep at the code base (§0.3), item 42 merged, and the human's ruling on OPEN-3's note and the zero-size case (class 3, class 1 and class 5)

*Written by the custodian before any code. Sources: the architect's re-sweep, `state/consults/2026-10-14-export-current-view-resweep-architect.md` (read at 73a638e5; pass with notes, no invalidator), whose rows are adopted as written; and the human's ruling of 2026-10-14, `state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md`, item 2. Every pin below is computed by script at the code base, main 2cf707a37be51100865999a5bd2991a8d9d1762f; no file under frontends/shell differs between 73a638e5 and 2cf707a3, and from 2cf707a3 to this amendment's parent only the status-bar form does. A row's "same text" is a hash equality with the form's own pin at 2ca3a53c.*

1. **The code base** is main 2cf707a37be51100865999a5bd2991a8d9d1762f: milestone 2 merged as #217, and #215 and #216 have merged since. This is the re-sweep §0.3 asks for, before any code.

2. **Class 3: the form's pins at the code base.** The five rows marked no are the ones phase B changed; each is re-pinned at its new text, and none is I2.

| Where | What | The form's pin | At the code base | Same text |
|---|---|---|---|---|
| §0.4 | the ref declaration | src/App.tsx:837 @ 2ca3a53c | frontends/shell/src/App.tsx:896 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2daa358861a63fab6d72d65f99577c21371241ec20612716b6708ef30196e50b | yes (hash equal) |
| §0.4 | the admission reset | src/App.tsx:1019-1025 @ 2ca3a53c | frontends/shell/src/App.tsx:1081-1087 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:5ed75a07879d64d2793c443f2d963ba65f6ef2bbb7f9c87159d4c8eb8b1ffe9d | yes (hash equal) |
| §0.4 | `onViewportChanged` (phase B added `showBox(bbox);` at line 2110) | src/App.tsx:1886-1900 @ 2ca3a53c | frontends/shell/src/App.tsx:2104-2119 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c459753009f5876d8801f91e3812a26a7cb4d38ad0e1cb6a36e4ed6f900c2e8d | no (re-pinned; see What) |
| §0.4 | `onViewportWithinLastQuery` (phase B added `showBox(bbox);` at line 2125) | src/App.tsx:1901-1906 @ 2ca3a53c | frontends/shell/src/App.tsx:2120-2126 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f44044e5ebfe5944a535a67eb10587f3fc291d120863f8cf07f09940c8483282 | no (re-pinned; see What) |
| §0.4 | the refusal recovery | src/App.tsx:327-331 @ 2ca3a53c | frontends/shell/src/App.tsx:362-366 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:228c3274148903e2b752b8e8be3a53ade786ddaf86c1e9583d13b9fb5a821bed | yes (hash equal) |
| §0.4 | the recovery's getter | src/App.tsx:968 @ 2ca3a53c | frontends/shell/src/App.tsx:1027 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:15c0aefd863c40b2bf3ad7e16370100b0fcf9a7a81d1f625fd26871640c11564 | yes (hash equal) |
| §0.4 | the dev `queryWithFilter` hook, candidate | — | frontends/shell/src/App.tsx:1594 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:12623abc4922f42e9c86e292220e2b26202d3f5b1166bedd68dce4fd45a1b1a8 | new |
| §0.4 | the dev `queryWithFilter` hook, baseline | — | frontends/shell/src/App.tsx:1754 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:12623abc4922f42e9c86e292220e2b26202d3f5b1166bedd68dce4fd45a1b1a8 | new |
| §0.4 | the Export panel's props (now also `stageScope`, `checkStagedScope`, `onExportRunning`, lines 2290-2292; the ref read at line 2289) | src/App.tsx:2034-2043 @ 2ca3a53c | frontends/shell/src/App.tsx:2282-2294 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3228332a1d2dce8b9fa61063110194c957ec029bac39ac9d588e2a2ac491d071 | no (re-pinned; see What) |
| §0.4 | an issued Apply re-arms the fit (App) | src/App.tsx:345-349 @ 2ca3a53c | frontends/shell/src/App.tsx:380-384 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:07dd6f09435de3afccf8d2f1bd667bcf0e2d6d59502b88907f0177c690777b30 | yes (hash equal) |
| §0.4 | an issued Apply re-arms the fit (canvas) | src/canvas/WorkingCanvas.tsx:1532-1536 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:1589-1593 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e82b33496db058c3b71421e7cabd6b3facbe4a6e6b4b7ebd3b7546f2aa7ac706 | yes (hash equal) |
| §0.4 | the fit (its else arm now reports to `onViewShown`, lines 1405-1407: the bullet reads that the fit reports only to `onViewShown`) | src/canvas/WorkingCanvas.tsx:1326-1356 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:1376-1409 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:953361a5d758c9119fb6c25e3e87ec39d2416b262b25f477e4a454f9b70448ac | no (re-pinned; see What) |
| §0.4 | a call site of the fit | src/canvas/WorkingCanvas.tsx:1478-1488 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:1531-1541 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c27ca0ad6214c9518162452c50c83da344fabdf2b9999483e97d2a47f4a85405 | yes (hash equal) |
| §0.4 | a call site of the fit | src/canvas/WorkingCanvas.tsx:1683 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:1740 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1888da38288257b416ba8a99a0e25d74ac697859628e1bc4c01b40f2acd1b6c7 | yes (hash equal) |
| §0.4 | a change of size (now with the second `onViewShown` call site, lines 2041-2047) | src/canvas/WorkingCanvas.tsx:1954-1958 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:2037-2048 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:835c7ccada0359ef52dc635ce28149d04da8e59e886de28dff9f3c3fec43576d | no (re-pinned; see What) |
| §0.4 | a change of size, the box function | src/canvas/viewportBbox.ts:70-80 @ 2ca3a53c | frontends/shell/src/canvas/viewportBbox.ts:70-80 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:551ab53a8cc1e6af91f49d40e8ef54ae8e68af060b2e0107bedf3b96cf75005c | yes (hash equal) |
| §0.4 | Current view is the default | src/publish/PublishPanel.tsx:316-319 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:353-356 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2268f4f10b571247d480a8e74fa6d80eade3ad18e4bcdea686c8f6934abc16aa | yes (hash equal) |
| §0.4 | Current view is the default (the key) | src/publish/PublishPanel.tsx:329 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:369 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d6cb8b2ec7e6c0b7d1cd6c60f2bc2811414c1d7be0a5a0752b8b441f9ebac81b | yes (hash equal) |
| §0.4 | disabled only by `!hasSettledView` | src/publish/PublishPanel.tsx:30-38 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:61-69 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:af1d3bea9a849189934a2db30227daa8d5cfe6cbc919d208933aa8a504151739 | yes (hash equal) |
| §0.4 | the reason | src/publish/PublishPanel.tsx:595-599 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:672-676 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1ef8b38c7af70613c33d27243dd7bab8684c601841068b52d1704e383662d90b | yes (hash equal) |
| §0.4 | the box read at the click (`stageScope()` follows at line 409) | src/publish/PublishPanel.tsx:347-358 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:397-408 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7e071f92c19ac62ec602e8958968563e53f6f00d6abe904939aae029ba3f1529 | yes (hash equal) |
| §0.4 | the second reader | — | frontends/shell/src/publish/PublishPanel.tsx:445 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4ec6b8a27bb61e0d3c89af4229342c6b51f2cb7be19c7f3e57fdf3fbdf81a54f | new |
| §0.5 | `publishPrepare` | src/publish/client.ts:31-44 @ 2ca3a53c | frontends/shell/src/publish/client.ts:31-44 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ed08a8f9d56d3cf7ff55a799688c6ca809178ddbd87b7b663325aa8cfedabad6 | yes (hash equal) |
| §0.5 | `publishPrepare`, its caller | — | frontends/shell/src/publish/PublishPanel.tsx:416 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:52d5e8d10913f34827b90f6c63dd04702315e98d38f2e977eb5d85bf257389ba | new |
| §0.5 | `publishPrepare`, its dev caller | — | frontends/shell/src/publish/PublishPanel.tsx:460 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9a88c897688abdc56209f5ffa88a3fa8066b313e9355860ebf0a5368daea1662 | new |
| §0.5 | `PublishScopeInput` | src/publish/types.ts:89-97 @ 2ca3a53c | frontends/shell/src/publish/types.ts:89-97 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f0749ea735ba56136918ffcbaa2b50e455ad32e7202c9b9dd9407b9d47363d6e | yes (hash equal) |
| §0.5 | `PublishScope`/`JsBbox` | src-tauri/src/publish.rs:83-99 @ 2ca3a53c | frontends/shell/src-tauri/src/publish.rs:83-99 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b8ab9bdabc0297f75ea21b8bb52bf87abb31e8f2e47a32bbee43b4725887495f | yes (hash equal) |
| §0.5 | `resolvePublishScope` (callers at lines 398 and 445) | src/publish/PublishPanel.tsx:40-63 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:71-94 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1947dea339bfcb946675b0a68d2862f06846e8f70311a3d91b96238ddb7001e8 | yes (hash equal) |
| §0.5 | `resolvePublishScope`'s tests | — | frontends/shell/src/publish/PublishPanel.test.ts:67-84 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f99fafd3ab79aac241f011ca3943939d27b5df1220d04d2492d5a045d29beb6e | new |
| §0.5 | the Row scope, composed | src-tauri/src/publish.rs:124-135 @ 2ca3a53c | frontends/shell/src-tauri/src/publish.rs:124-135 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:5b3088e1a740b7e19bf89e8aee875a00c86003bf858e2511d5a007b80d559d38 | yes (hash equal) |
| §0.5 | `row_scope_sentence`'s one caller | — | frontends/shell/src-tauri/src/publish.rs:404 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7b3b4fc3aa0d5829cad6d6bbba261b3837e5c0af372e248a2f9559ddd14391a8 | new |
| §0.5 | the Row scope, rendered | src/publish/PublishDialog.tsx:251-252 @ 2ca3a53c | frontends/shell/src/publish/PublishDialog.tsx:251-252 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:45e66e2c707fa32d8a2fbe87b3aeabca80d334059227980c3b18a85102d31381 | yes (hash equal) |
| §0.5 | the attempt's query fixed at prepare | src-tauri/src/publish.rs:169-191 @ 2ca3a53c | frontends/shell/src-tauri/src/publish.rs:169-191 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6d418f080d9786d27fc0f9db4e06bebed0d2833d6b6a4fb3e8f91551ef991a22 | yes (hash equal) |
| §0.5 | the publish-client mock | src/App.layout.test.tsx:121-128 @ 2ca3a53c | frontends/shell/src/App.layout.test.tsx:121-128 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e2908d269d87299a36641e1034a3c22d2e3fae5a165e8405f4f4344925055291 | yes (hash equal) |
| §0.5 | the canvas stand-in | src/App.layout.test.tsx:130-171 @ 2ca3a53c | frontends/shell/src/App.layout.test.tsx:130-171 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:884308b174615e14f33d8c9de6d8eb7363f632af2e6ef523f1d22fc6a34bc648 | yes (hash equal) |
| §0.5 | RF8 | src/App.layout.test.tsx:502-514 @ 2ca3a53c | frontends/shell/src/App.layout.test.tsx:502-514 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:907619046c658db3364d5190130e33a8e34a2e24e158721d3c8fa458fe50dc96 | yes (hash equal) |
| §2.1(e) | the ref's comment block | src/App.tsx:834-846 @ 2ca3a53c | frontends/shell/src/App.tsx:893-905 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a292ca12eb1f53a1e94023c5c8b3e562150effad22b47f9c6f202cb751676c18 | yes (hash equal) |
| §2.2(d) | the defensive refusal in `runPrepare` | src/publish/PublishPanel.tsx:352-355 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:402-405 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f51b9c8a64ed1ae26ac034f7a0b581ccb94ae0b6d8200e35b781e6b629e0e903 | yes (hash equal) |
| §2.2(d) | the defensive refusal in `runPrepareWithDestination` | — | frontends/shell/src/publish/PublishPanel.tsx:449-452 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:76871f46602ac693c46cdfb692186647476c4ee36ec0b2b4f5584d7e68802778 | new |
| §2.2(e) | the bare lines 30-63 | src/publish/PublishPanel.tsx:30-63 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:61-94 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:111ddd0235797e34a45e878ffcf3f0def26a938f0fed9b3040c05500f39a1645 | yes (hash equal) |
| §2.2(e) | the bare lines 296-304 | src/publish/PublishPanel.tsx:296-304 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:327-335 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:afe0c1058ca88e5269601809f72741ba3bef94d28a5b20deb0c92ab7a9c782b0 | yes (hash equal) |
| §2.2(e) | `PublishControls`' copy of the prop | — | frontends/shell/src/publish/PublishPanel.tsx:605-616 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6663ca422113f0c23007608e20a198453707ff2e1833ac3ca08d00b75b708a2f | new |
| §2.2(e) | `PublishControls`' copy of the prop, its use | — | frontends/shell/src/publish/PublishPanel.tsx:642 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:497030e00818461a620364da449b6d1b91c4c49aee8a2279c8843709e33b1110 | new |
| §2.2(e) | types.ts's comment | src/publish/types.ts:89-94 @ 2ca3a53c | frontends/shell/src/publish/types.ts:89-94 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:108fb9ce4cf372ba702c7ecf8e019d5c7742218a45d4c1086915fe72680e44e7 | yes (hash equal) |
| §2.3 | the `currentViewOptionDisabled` cases | src/publish/PublishPanel.test.ts:58-64 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.test.ts:58-64 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b33a585469b314fb529b14074604957b1c7363fd08af6436e96aa9d737183fac | yes (hash equal) |
| §2.3 | the `PublishControls` props case | src/publish/PublishPanel.test.ts:412 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.test.ts:412 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7581fca565e8c4ab8906f87a23c9a6c59f0e97fff9fc24856d67605d7e977acf | yes (hash equal) |
| §2.4 | the reason line | src/publish/PublishPanel.tsx:597 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:674 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fbfb380b5afbb5079f7f8d329e78adef8a3b72c6b18650e9a34497998e6989a1 | yes (hash equal) |
| §2.4 | an interactive pan or zoom reports | src/canvas/WorkingCanvas.tsx:2018-2028 @ 2ca3a53c | frontends/shell/src/canvas/WorkingCanvas.tsx:2108-2118 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2 | yes (hash equal) |
| §2.4 | Whole dataset is never disabled | src/publish/PublishPanel.tsx:574-583 @ 2ca3a53c | frontends/shell/src/publish/PublishPanel.tsx:651-660 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b06081552179ca24596a1008a3a15d7cfcfa9117671417c27146976ad0e9bd17 | yes (hash equal) |

3. **RS1 to RS9, answered.** The re-sweep's rows (state/consults/2026-10-14-export-current-view-resweep-architect.md:43-51 @ eafcf3f66515c546a8a5e9b877cb896a52b3aa8a sha256:f68e470ee89da78800b4bb83026f3a02b8159cfd78ef91f50612a08a5e2f9bd5) are adopted as written: I1 to I9 do not fire, RS7 is class 1 (item 4 (b)), RS9 is item 5, and RS4's map of zero size is item 6. Their pins at the code base:
   - RS1, the holder `viewBox`: frontends/shell/src/App.tsx:854 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:dd29d8dc06894ae16bea6f917a2b9f0a524726812ffba314e747f0a308f3ce33.
   - RS1, `createViewBoxStore`: frontends/shell/src/feature/FeaturePanel.tsx:26-40 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fbe6df055ceb37bb9d7df9fb50a07ddff2f18539200f22491f01e00c3287f0c1.
   - RS1, the `ViewBoxStore` interface, not exported: frontends/shell/src/feature/FeaturePanel.tsx:20-24 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9d51aefe72532c6cb297a950223b62b9644c04b5cdf5e33e44e200a1d16ded63.
   - RS1, `AuthoritativeBbox`: frontends/shell/src/canvas/viewportBbox.ts:5-10 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7c067130ec2dd644c11afd62a70c9a0db87ab282809e7650e5e635666a349691.
   - RS2, `showBox`, guarded on the current dataset: frontends/shell/src/App.tsx:2042-2044 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:865844271ffb755e59a5d7b8c6a81eb47a73c1c82bd35dbd8f83247e43966415.
   - RS2, `showBox`'s caller, `onViewShown`: frontends/shell/src/App.tsx:2064 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:dbd5746b99c9f22a6634ddc26f3072af8ca298f74eca887f274fe3f4b223529b.
   - RS2, `showBox`'s caller in `onViewportChanged`: frontends/shell/src/App.tsx:2110 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3a50103e4cfa5d16685af6f7ff797a92f49194148f529917b7fe37976a97e146.
   - RS2, `showBox`'s caller in `onViewportWithinLastQuery`: frontends/shell/src/App.tsx:2125 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3a50103e4cfa5d16685af6f7ff797a92f49194148f529917b7fe37976a97e146.
   - RS2, RS6, the one other write, `set(null)` at an admission: frontends/shell/src/App.tsx:1071 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2871fc752f3157a0208667f41ab8d4604fa893234285d0ed0b54794ed8c634e7.
   - RS3, the fit's `onViewShown` call: frontends/shell/src/canvas/WorkingCanvas.tsx:1405-1407 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6c1d5975fc43f16ca05d27e4c997230ec4047c5449b14ed145d6233baa425b64.
   - RS3, reached from (baseline): frontends/shell/src/canvas/WorkingCanvas.tsx:1540 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2b8f88dc7fbc4d71211b93fa8782e6ff49e81d1839b1b9e8b600caaa80cf66df.
   - RS3, reached from (candidate): frontends/shell/src/canvas/WorkingCanvas.tsx:1740 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1888da38288257b416ba8a99a0e25d74ac697859628e1bc4c01b40f2acd1b6c7.
   - RS3, the resize's `onViewShown` call: frontends/shell/src/canvas/WorkingCanvas.tsx:2041-2047 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4dae842548057328a31459758c05d6d97a29a6d0b99fbeee24b5ac2199d028a9.
   - RS4, interactive pan and zoom: frontends/shell/src/canvas/WorkingCanvas.tsx:2049-2119 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:068d4f65874eff32db56fe0c776d81136915a4a0a1884988bfa53a4f754cdef5.
   - RS4, the recenter, in the same tick: frontends/shell/src/canvas/WorkingCanvas.tsx:2099-2106 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f15c8865a6517c6bebf1535de9d4944fe3c1f0148fc69b0bc8b62fb2dfae66f7.
   - RS4, Zoom to layer: frontends/shell/src/canvas/WorkingCanvas.tsx:1567-1583 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:88afff7efad298b9fd8be76deadf6c1e8aa1a9cd11a7f5a5109191fdb9a05d80.
   - RS4, `fitToBbox`: frontends/shell/src/canvas/WorkingCanvas.tsx:1585-1587 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a64de487b8741edfd9a809f1621f91772f175b12621dfd755f49fec13710da05.
   - RS4, Zoom to selection calls it: frontends/shell/src/App.tsx:1867-1870 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:88e733b64896f3231c000e68e19617e430a31eaa44bff3420e9e4fbdbc1be792.
   - RS4, their report: frontends/shell/src/canvas/WorkingCanvas.tsx:1402 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:efa4c701adca75f6159e8915a822f36971deb8d6a8408b1dddc3b2100d5fe1d3.
   - RS4, the dev seam reports: frontends/shell/src/canvas/WorkingCanvas.tsx:2317 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:0e55e1533e335865443e9d4e4d3730f073210a09c57e79c133a51d7c096812eb.
   - RS4, phase B's tap writes no camera: frontends/shell/src/canvas/WorkingCanvas.tsx:2022-2029 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:de9ecdb1019de9905e3153b6b4b8d38247aa2fbb5fc138777800510082c1e695.
   - RS4, the initial camera: frontends/shell/src/canvas/WorkingCanvas.tsx:2011 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:67d0187e8123da0567b86b10d1836f20becb9685a19bef8fc0d39c063c63306e.
   - RS4, zero size, `VIEWPORT_FLOOR`: frontends/shell/src/layout/layoutConstants.ts:10-17 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:816f1568d23b7810ee42506c152403d230995484330ccdc71e5a04cbaf5ac7e5.
   - RS4, zero size, below the floor nothing is claimed: frontends/shell/src/layout/layoutState.ts:107-118 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ca67d8e3aaf1ae14dfa3b533ab3e99226499f8386ed6cf366898abae748e3413.
   - RS4, zero size, no minimum window size: frontends/shell/src-tauri/tauri.conf.json:17-18 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:63c05c696c88d43fbddef29c975462f7ce3372c693cd3b282cb694907efb6531.
   - RS4, zero size, the map width can reach 0: frontends/shell/src/layout/layoutState.ts:147-148 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b573005d84f7042b5681aae84c760f3a918637bb91db67d14d2bbea07a76acb0.
   - RS4, zero size, a resize to 0 reports nothing (the box function): frontends/shell/src/canvas/viewportBbox.ts:76-77 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:0729bab2aa1f3dea9d36cd8da3b2cdd8b7ee9cf6f171a0935013f3457b09e902.
   - RS4, zero size, a resize to 0 reports nothing (the canvas): frontends/shell/src/canvas/WorkingCanvas.tsx:2041 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a061efba06923f5fe3471e63bd28a57e48f30e3ccf7f9a6eb913cf5c5c2093c3.
   - RS4, zero size, a fit at size 0 computes with 1 px: frontends/shell/src/canvas/WorkingCanvas.tsx:1378-1379 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3eb50f227a9d99040b53840e33fcc2a00b0c7d26deb11abf715ef8573359ea19.
   - RS5, FeaturePanel treats null as not current: frontends/shell/src/feature/FeaturePanel.tsx:47-65 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:07cce582f7ecbb6e3c4a33ab40ce9f869e2ee7e98f9fdc92f6d1694881bc026a.
   - RS5, the canvas is keyed: frontends/shell/src/App.tsx:2047 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:474be9d286cea85dc96571ca3d33aa4cffb7f8fbffb275278eea954163c8b00c.
   - RS6, RB-DRAWN mutation (b): frontends/shell/src/App.selection.test.tsx:721-722 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:77a4d3e44fe735cedfe8d50e48323ef26490bb0f16a3307b1378a4a6c93a9be9.
   - RS7, RB18: frontends/shell/src/App.selection.test.tsx:685-703 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:13218faaed3296317de2a8393ef8e30ac0d832180a6d141a09286fad21903fe6.
   - RS7, RB18's disabled-attribute reads: frontends/shell/src/App.selection.test.tsx:694-695 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3061399f0577f9218041865a49cbce6a095e04c1dfe6651be4031a542bd94bd3.
   - RS7, RB18's disabled expectation: frontends/shell/src/App.selection.test.tsx:702 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:df9dc194cd34b5b7edc55b0dfc2d7fb0eeaf49a06fa054b833f0c6f84bb14e45.
   - RS8, PublishPanel's props: frontends/shell/src/publish/PublishPanel.tsx:315-342 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9362bc438c9976adb35b78ff6a7250015cfed81fec7781d4a743cc90a4648f74.
   - RS8, App passes the three: frontends/shell/src/App.tsx:2290-2292 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3997913983bc3aea22cc2559def877ad9f9e45a6ddc0d766853ba1fc1eb7aef2.
   - RS8, `PublishControls`' own `hasSettledView`: frontends/shell/src/publish/PublishPanel.tsx:608 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7de3c5448aac5e1c7b4594dff59e470df94c7537c49cf20bab68174c65d58b10.
   - RS8, `PublishControls`' own `hasSettledView`, its use: frontends/shell/src/publish/PublishPanel.tsx:634 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:40341dfce29946ee3f6223a23b79f9d3dd1aacca0b94071a1909b11d9642d9a5.
   - §0.5, a scope leaves the camera out: frontends/shell/src/workspace/scope.ts:9-11 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:245aa781bf05ae1576dc37e9a830c25aaa55af72b830bcb7eecc927cb1ac0d0b.
   - §0.5, the selection line: frontends/shell/src/publish/PublishPanel.tsx:44-45 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f902d7717554b39b66e565f3d5793cfe5042e4d93c6f582e494cfe7516cb653d.
   - §0.5, the selection line, rendered: frontends/shell/src/publish/PublishPanel.tsx:681 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e17d72b15e4d077e84e69b55873042850da910032ffff3c0636afdcd03591c17.
   - §9, Part X is taken: frontends/shell/MANUAL-WALKTHROUGH.md:1791 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:5dabcf1da2255813b55dc14f4ae1388634c74a88f81aa2ec8eb3832354d9feca.
   - §9, Part Z is claimed by the status bar's form: frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md:439 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6eaa72a9a81161f5a282d99febba8372cf1fd4396e061127440ea58b45ca6a08.

4. **Class 1 rows, before code** (the re-sweep's verdict, item 3: state/consults/2026-10-14-export-current-view-resweep-architect.md:66-83 @ eafcf3f66515c546a8a5e9b877cb896a52b3aa8a sha256:c0e50cd0c3ed6899b7cf508288c0a00ae0773a93fcb7b91ce984688308e346ab):
   - **(a) The getter and availability.** App passes PublishPanel `getViewBox: () => AuthoritativeBbox | null` and `subscribeViewBox`, as `viewBox.get` and `viewBox.subscribe` (RS1). Both props are typed in PublishPanel.tsx, so `ViewBoxStore` stays unexported and nothing under `src/feature/` is edited. `PublishControls` takes a boolean in place of its own `hasSettledView` (RS8). RS2, RS3, RS5 and RS6 hold as answered. §2.1(c) adds nothing, because phase B already empties the box at an admission (App.tsx:1071, item 3), and RCV2's mutation drops that line.
   - **(b) RB18's re-aim, redefined** (RS7). RB18 reads the Current view radio's `disabled` attribute, not the prepare, so §2.3's condition is false as written. Its disabled-attribute observer is replaced by RCV4's refusal-recovery observer, which checks that the ref is not written. Its clause about a settled view leaves together with `hasSettledView` (§2.1(d)). The checks at :700 and :701 stay. The mutation is unchanged, still fails first at :701, and is re-observed at the new head. The comment at :685-686 is updated, and the title edit is listed in the PR body. This stays within OPEN-11's term 3. Pins: RB18's disabled-attribute observer, frontends/shell/src/App.selection.test.tsx:693-695 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:13224380c90232e6c9fce6f33f12bf5ddce8e1d46edc816eb6404907d58bac01; the check that stays, frontends/shell/src/App.selection.test.tsx:700 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1a37e9c5b2c6192b03eb2650aa5779efac4bf4b98be9f9ee2146b64be90ff752; the check that stays, where the mutation fails first, frontends/shell/src/App.selection.test.tsx:701 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:43b492f9a8a390a2d09c7923f5717bdb3384944f2ba3607ae59c2439d2a3b036; the comment naming `hasSettledView`, frontends/shell/src/App.selection.test.tsx:685-686 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e0258dc6e6a18b1c912bb8f42b7400ee38080dd5194e3641741036d46f06ef7e.
   - **(c) §2.3 gains PublishPanel.test.ts's `resolvePublishScope` cases, `wireBbox` and the imports,** because §2.2(b) makes the box an `AuthoritativeBbox`; without this row, I9. **A §7 addition, declared before code:** PublishPanel.test.ts at most 60 lines (was 40), the T group 280 (was 260), the total 690 (was 670). §7 is not edited. Pins: `resolvePublishScope`'s tests at item 2's §0.5 row; `wireBbox`, frontends/shell/src/publish/PublishPanel.test.ts:37-39 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a2f75c03a1e4c8c6c35ffc1df477a836a0fde974124bdc56280941973a5f53c5; the imports, frontends/shell/src/publish/PublishPanel.test.ts:12-13 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:16eadbc9e3b7a4b7a6a53e5beefc6f100519759b82b9096894a0a68d357f4b8b.
   - **(d) The harness additions,** all inside App.selection.test.tsx: the canvas stand-in's `resetFitForNewGeneration` counts its calls (RCV1), and the viewport-manager stand-in records each request's argument and can refuse (RCV4 and RB18's re-aim). Not I7. Pins: the stand-in's `resetFitForNewGeneration`, a no-op, frontends/shell/src/App.selection.test.tsx:181 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:af1cf9ff93bbcc5c1f29f4f6d5c2c11bf41efaeb0876624b0b61e961f12f3d51; the manager stand-in, frontends/shell/src/App.selection.test.tsx:134-158 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b153ffa76991c55a94fe54b539890f0995b7416779cb8f8d573c1209eb5c21c1.
   - **(e) §2.1(e)'s comment list also covers** these four places; the last two go with §2.1(d). They are Documentation. Pins: the box now also feeds the export, frontends/shell/src/App.tsx:853 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1a761ba6b9f887e4dc434447eb86615f792c36c8a409a12a6ba7fb64d83f3556; names `hasSettledView`, frontends/shell/src/App.tsx:2062-2063 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:753ce914cdde653f0b4499ed069cb39f3674e62459b5e21232dd873083def56a; goes with §2.1(d), frontends/shell/src/App.tsx:897-904 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d79cb867966ba69d6322c43443e8043c50ae6189b4b1451d0db6373494aa7070; goes with §2.1(d), frontends/shell/src/App.tsx:2111-2113 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8e28b196c6296ea4b9bcb43d647a7c16fd2302eca0d9946f2658d1f6820fa452.

5. **RS9: item 42 has merged, so §2.5 runs here** (the re-sweep's option (A)). PR #215 merged at 2026-10-14T08:07:12Z, merge commit 4095407cc36a815c71709bc067d4c5d242395602.
   - Item 42 is number 42: KNOWN-LIMITATIONS.md:191 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:5e99269df64111a8c264fa9d45ef54394431f182ebb4616ac6f919a14c05ee99. Its on-main note is one line: KNOWN-LIMITATIONS.md:194 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c24fec9831bfb8f85b49286d36816eba3b10b8a48265e0da1288ab67e4ae2a6e.
   - That line is replaced by four spaces and item 6's note, byte for byte. Nothing else in item 42 changes, and item 39 is not edited.
   - §2.6's `KNOWN-LIMITATIONS.md` is the repository root's (class 3). It stays outside §7's count, at most 8 lines.
   - PLAN: the node's dependency, known-limitations-current-view-stale-box, is done.

6. **OPEN-3's note and the zero-size case (class 5),** on the human's ruling (state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:14 @ eafcf3f66515c546a8a5e9b877cb896a52b3aa8a sha256:553e7f5b977f4f53954d4a12e8ec70083cc8f04278bed5876a59f7e9c4136aa6).
   - **The clause.** The note's first sentence gains the human's clause, byte-copied by script from that line, between its quotation marks:

     ```text
     , as long as the map has a width and a height
     ```

     It goes before the first sentence's full stop. Item 42's on-main note becomes, built by script from Amendment 1 item 3's text:

     ```text
     On main, fixed by export-current-view-after-unreported-fit: Current view sends the area the map shows when Export interactive map… is clicked, including after the map fits itself to the data and after a change of size, as long as the map has a width and a height. It can be chosen as soon as the map has drawn the file's data. The v0.1.0 build still behaves as described above.
     ```

   - Amendment 1 item 3's placement of the added sentence, and Amendment 2, stand.
   - **The zero-size case in the source comment.** The doc comment of `getViewBox` in `PublishPanelProps`, which both reads at the click rely on, records the case RS4 found. When the map has a width or a height of 0, Current view does not send an area the map shows: after a resize to 0 it sends the box from before, and after a fit at size 0 it sends a box computed for 1 px (item 3's RS4 pins). The comment's words are the worker's, and they are Documentation, not the human's.
   - The re-sweep's item 6 is the clause check (state/consults/2026-10-14-export-current-view-resweep-architect.md:92-99 @ eafcf3f66515c546a8a5e9b877cb896a52b3aa8a sha256:9efef28f1f9364b21a57207e142b376221bbb3f9765b8781ec713023235e4dcc).

7. **Part Y (class 3).** Part X is taken and Part Z is the status-bar piece's (item 3's §9 pins), so this piece's Part is Y. §9's rows X0 to X4 read Y0 to Y4, and Amendment 1 item 1's X4 reads Y4.

8. **Still owed:** §2.4's disabled-reason sentence is not yet ruled (Amendment 1 item 1). It is answered under item 2b, at Y4 at the latest. The zero-size case does not falsify it (the re-sweep's item 6).

9. **Generation:** the node's generation goes up by one.

10. **Superseded index:**
    - the pins of §0.4, §0.5, §2.1(e), §2.2(d) and (e), §2.3 and §2.4 → item 2;
    - §0.3's RS1 to RS9 → item 3;
    - §2.1(c) and §2.2(a)'s name → item 4 (a);
    - §2.3's RB18 bullet → item 4 (b);
    - §2.3's PublishPanel.test.ts bullet, and §7's PublishPanel.test.ts ceiling, T group and total → item 4 (c);
    - §2.4's bullet on a map of zero size → items 3 and 6;
    - §2.6's `KNOWN-LIMITATIONS.md`, and Amendment 1 item 3's last sentence → item 5;
    - Amendment 1 item 3's note → item 6;
    - §9's Part letter and rows, and Amendment 1 item 1's X4 → item 7.

Nothing above is edited.

### Amendment 4 — the human's word on §2.4's disabled-reason sentence (class 5)

*Written by the custodian on the human's typed ruling (`state/directives/2026-10-14-e15-named-i2-live-row-build-24px-provenance-cv-2-4-item-40-comment.md`, item 5), while the code is being built, before any gate. References only.*

1. **§2.4's disabled reason** [OPEN-1 (a)] is approved by the human as drafted. The P6 sight at Y4 shows it with the other strings.
2. **Amendment 1 item 1's open part is closed,** and so is Amendment 3 item 8.
3. **The source comment** that marks the constant as a placeholder awaiting the human's word is Documentation: it says, in the PR, that the words are the human's, approved on 2026-10-14.
4. **Generation:** the node's generation goes up by one.
5. **Superseded index:** Amendment 1 item 1's second bullet and Amendment 3 item 8 → items 1 and 2.

Nothing above is edited.

### Amendment 5 — the build's results: two files over their ceilings, §7 not edited (class 8); the worker's deviations (class 2)

*Written by the custodian after the build's results were seen, at the head eebf7298, before any gate. References only. The report is `state/consults/2026-10-14-export-current-view-after-unreported-fit-worker-report.md`.*

1. **§7 (class 8).** By §7's own command against the merge base f8bc2951, the branch counts 467 lines against 690, over 8 files. Two files are over their ceilings: `src/publish/PublishPanel.tsx` at 72 against 60, and `src-tauri/src/publish.rs` at 26 against 20, which also takes group R past its 20. Group P is 109 against 110, and every other file is under its ceiling. §7 is not edited.
2. **The worker's deviations (class 2),** as its report gives them:
   - (a) UPP1 takes the availability boolean, not the box, as §2.2(c) allows; it adds a render case that the reason shows only while the option is disabled.
   - (b) `npm ci` in `renderer/bundle-viewer`, which `npm run verify`'s typecheck step needs, ran in a shared hold.
   - (c) E-CV's corner view, which §4 leaves unplaced: the suite reads the fit's box from the prompt's Row scope, then sets the camera at that box's lower-left corner, one zoom level in.
   - (d) Line 194, item 42's on-main paragraph, was replaced whole, its bold lead included, as Amendment 3 item 5 says.
3. **For the custodian's e2e,** the report names two risks: E-CV-RESIZE's mutation may not discriminate if, after Clear, the resize reaches `onViewportWithinLastQuery` and not the `onViewShown` arm; and E-CV-RESIZE is inconclusive by design if the window is already at or below 1024 by 640.
4. **Owed, Documentation:** the disabled reason's source comment still calls the sentence a placeholder. Under Amendment 4 item 3 it is corrected in the PR.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 6 — correction round 1, declared before its code: the e2e suite's open waits for the canvas; the disabled reason's comment (class 2)

*Written by the custodian after the first e2e run was seen (`state/consults/2026-10-14-export-current-view-after-unreported-fit-e2e-custodian-run-1.md`), before any gate. References only. This is the piece's first correction round.*

1. **e2e/export-view.mjs, `stepOpen` (EV0):** the poll for the first pixels reads `capturePixels` only once the hook exists, and treats its absence as nothing drawn yet, within the same bound. A defect of the suite (the record's E-CV-OPEN), not of the product; §4's rows, their assertions and their mutations are unchanged.
2. **The disabled reason's source comment** says that the words are the human's, approved on 2026-10-14 (Amendment 4 item 3). The constant is unchanged.
3. **Nothing else changes.** No product code beyond that comment. The custodian then runs every suite at the new head, and the three e2e mutations.
4. **§7:** both changes are counted by §7's command at the new head. An overrun is class 8, and §7 is not edited.
5. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 7 — PR #219 gate 1: both PASS WITH NOTES; their documentation (class 3); the architect's D-2 record items (classes 1 and 2); the walkthrough follow-up (class 1)

*Written by the custodian after both gate 1 reports (`state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-architect.md`, `state/consults/gates/2026-10-14-export-current-view-after-unreported-fit-gate1-reviewer.md`). References only.*

1. **Gate 1:** the architect PASS WITH NOTES (gate log 517) at a792293d; the reviewer PASS WITH NOTES (520) at a23c5624.
2. **The documentation, in the gates' words (class 3), no re-gate (AUTONOMY §31 (d)):** the architect's D-1, D-3 and D-4 at a23c5624; the reviewer's DOC-3 at db44c7ff; the architect's D-5 and the reviewer's DOC-1 in the PR body.
3. **The architect's D-2, by reference:**
   - (a) class 2: E-CV's mutation falls back to the view box while the ref is null, which §4's row does not have (D-2 (a));
   - (b) §3's third prediction was not run and does not hold as written; the E-CV mutation stands in for it (D-2 (b); `state/consults/2026-10-14-export-current-view-after-unreported-fit-e2e-custodian-run-2.md`, its E-CV-OPEN mutation);
   - (c) H3 is undecided (D-2 (c));
   - (d) §7, by its own command against f8bc2951: 471 lines over 8 files at a23c5624 and at db44c7ff, against 690. Amendment 5 item 1's class 8 entries are unchanged, and there is no new overrun.
4. **Class 2 against §9 X3:** Y3's step and expected outcome are the architect's D-4 words, not X3's (D-4).
5. **The walkthrough's rows G1 and N5** still describe Current view as disabled until a pan or zoom. §2.6 keeps this piece's walkthrough edit to Part Y, so they are not edited here; the docs-lane follow-up `walkthrough-current-view-rows-g1-n5` is placed for them (the reviewer's DOC-4).
6. **Generation:** the node's generation goes up by one.

Nothing above is edited.

### Amendment 8 — closing record: PR #219 merged

*Written by the custodian after the merge. References only.*

1. **Merged** by the human at 2026-10-14T16:49:13Z, merge commit e57e6436ab3e7452f3f1a7b61837cba6b93a6211 (two parents: main fa9bc7bd and the branch head 8a8f7c24).
2. **Main merged in before the merge,** after #218 merged: 8a8f7c24, whose one conflict, at the walkthrough's tail, kept both Parts, Y then Z, each byte-identical to its side; CI passed at 8a8f7c24.
3. **Gates:** gate 1, both PASS WITH NOTES (gate log 517 and 520; Amendment 7). The e2e evidence is run 2 (Amendment 7 item 3 (b)).
4. **Part Y** merged as it stood, with the gates' words in Y1 and Y3; its rows and the P6 sight stay queued for the sitting.
5. **Follow-ons:** `walkthrough-current-view-rows-g1-n5` (Amendment 7 item 5) and `e2e-readme-status-bar-steps`, in the docs lane.
6. **PLAN:** the node is done, with `{pr: 219}`.

Nothing above is edited.
