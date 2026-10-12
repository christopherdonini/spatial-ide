*Custodian's filing note (2026-10-09): the architect's draft of Amendment 1 of `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md`, recording the human's rulings of 2026-10-09 (item 4 of `state/directives/2026-10-09-rulings-on-the-eight-forms.md`, its item 1's placement bullet, and item 2 of the additions), on the custodian's brief at main b4dc05e0. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 8c07fab5859acbb8eba48a8054935fd75f6c785a586bd45dfc281ed8b396f3f3. Write audit PASS: zero write calls (Read and Grep only, 27 tool uses). Run window from the transcript: 08:46:53Z to 08:55:14Z. The amendment as appended is part 1's block with its 38 pins computed at b4dc05e0, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 75e0db4e63153b1e02febf9309c7cd71c6abe9411b7048c6737df79e9eb8706b). Its part 2 holds two items for the human, both conditional on EXPORT-TODAY showing H4: the reach of OPEN-8's last sentence beyond canvas/ (a red line, typed), and whether a cancel that arrives after an export has finished is stated.*

---

Reviewed: main @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b

**1. The amendment**

````markdown
### Amendment 1 — the human's rulings on OPEN-1 to OPEN-10 and on the start order (class 5), and the scope they add (class 9)

Records the human's rulings of 2026-10-09 (RULED 2026-10-09, eight forms, item 4 and item 1's placement bullet; RULED 2026-10-09, additions, item 2) and is written before any code of this piece; no outcome of this piece has been seen. Every summary of a ruling below is a paraphrase, marked here once; the ruling's own words are at its pin. Each pin is historical (§0.3); the tree at the code base is authoritative for the work.

#### A. Class 5 — the rulings recorded

**A1. Start order.** state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:19 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD; slot 1's order, state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:8 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- The code starts after e2e-hover-establishing-read-stale (the K6 fix), e2e-stale-expectations-reaim and shell-map-refill-after-resize have merged. The re-aim takes the place of e2e-failures-present-at-the-base in the Authority line's list.
- §0.3's three pieces are these three. The re-sweep at the code base takes their merged state.
- H3's proof is every suite at that base passing unedited. Before any phase A code, the re-sweep runs every e2e suite at the base and lists the runs (B7, I14).

**A2. The establishing barrier.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:12 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- The K6 fix puts the barrier, and the read that follows it, in frontends/shell/e2e/lib.mjs, exported, with regression.mjs as its caller. The K6 form's §2.1 as committed (frontends/shell/E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md:73 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) says otherwise. That ruling supersedes it in the K6 form's own record, not here.
- §0.5's establishing-helper bullet and §2.8 now read as follows. e2e/selection.mjs imports that one exported function from e2e/lib.mjs and takes every oracle id through it. It never copies, wraps or re-implements the barrier, and never takes a first poll.
- The function's name is read at the code base and recorded in the re-sweep amendment. If lib.mjs does not export it there, B5 applies.

**A3. OPEN-1 (A).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:28 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- §2.2's Picking stands as drafted and binds.
- §8 item 3 binds.
- §2.8's KNOWN-LIMITATIONS items 36 and 38 extend to a click, unconditionally.

**A4. OPEN-2, package (a) with the human's fixes.** Each part has its own pin.
- **Select.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:30 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. A feature click changes the selection only and never inspects. §2.2's [OPEN-2] in the Select line resolves to no.
- **Navigate.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:31 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. A feature click inspects only. The Inspector's active tab does not change, and a closed Inspector stays closed. §2.6's [OPEN-2] line resolves to no. The tabs are at frontends/shell/src/layout/contributions.ts:25-28 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. Row V3: B4.
- **A click on nothing.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:32 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. See B1.
- **Cursors.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:33 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
  - Navigate: `crosshair`. Select: the CSS keyword `default`. §2.2's declared keyword is `default`.
  - A drag is `grabbing` and pans in both tools.
- **The top bar.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:34 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
  - The tool switch and the mode picker sit in `topBar.tools`, and each tool has one line saying what a click does.
  - The picker shows only while Select is active.
  - §2.2 stands as drafted.
- **Keys.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:35 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
  - Bare `N` is `tool.navigate` and bare `S` is `tool.select`, matched by `matchToolKey`.
  - §2.2's guards apply: any modifier, `repeat`, `isComposing`, and focus in an input, textarea, select or contenteditable.
- **Default mode.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:36 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. It is `toggle`, labelled Add / remove. §7's Defaults row reads: Navigate; `toggle`; nothing pinned.
- **Outlines.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:37 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
  - §7's SELECTED_OUTLINE_RGBA and INSPECTED_OUTLINE_RGBA stand: solid blue and solid amber, placeholders the human sights at the sitting.
  - No dashed line and no dependency (I2; §8 item 2).
  - A feature that is both selected and inspected: B2.

**A5. OPEN-3 (a).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:38 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- While `pinned`, a Navigate feature click leaves `inspected` unchanged. The last-click line names the clicked feature and states that the pinned feature is kept (P6 text).
- Unpinning does not change `inspected`; the next Navigate click inspects as normal.
- No dialog.
- RB11 now asserts the following. With A pinned, a Navigate click on B leaves A inspected, and the last-click line names B and states that A is kept. After unpinning, a click on B inspects B. No element with `role="dialog"` is rendered. Mutation: ignore `pinned` in the Navigate click path; it fails on the inspected id.

**A6. OPEN-4 (A).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:39 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- The export's scope is ADR-024's two shapes, the whole file or the current view (docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:217-219 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
- The filter is not applied, as the existing sentence says (frontends/shell/src/publish/types.ts:127-129 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). The selection is never used.
- One new sentence in the Export section, shown whenever the section shows, says the selection is not used (P6). RB8 asserts it with and without a selection.
- The host prompt, src-tauri and ADR-024 are unchanged; §8 item 9 stands.
- **The plan's §6.4 export sentence is recorded as wrong against ADR-024.** ADR-024 stands, and the plan is not edited. The sentence is at state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:191 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- The plan's §6.8 fifth test item (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:218 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) and §4's sixth acceptance item are read as follows: export states its scope, that the filter is not applied, and that the selection is not used. RB8, E-EXPORT and V8 prove it.

**A7. OPEN-5 (a), conditional.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:40 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD. EXPORT-TODAY runs in phase A, and its outcome is recorded as a class 1 amendment before any phase B code.
- **H4 holds** (while the host's export runs on, the old panel leaves the screen and nothing says so): B3 is built in phase B.
- **The export already waits or asks:** nothing visible changes, and §2.1(c)'s H4-false route stands. The phase A PR body and that class 1 amendment state what EXPORT-TODAY showed, for the human.
- **Any other outcome:** I11.

**A8. OPEN-6 (b).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:41 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- §2.6 stands: the readout stays over the map.
- The Feature tab's id line comes from the exported `idLine`, in the same format.
- No walkthrough row's location word changes.

**A9. OPEN-7 (A).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:42 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- Only Selected, ignoring filter, is shown.
- Filtered, and the count selected within the filter, first appear with milestone 4's table. For this piece, the plan's §3 rows (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:50-51 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD) are read that way.
- §1's last may-not-claim item stands; §8 item 30 is added (B8).

**A10. OPEN-8 (A).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:43 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- `fitToBbox` is a handle method that reuses `fitToExtent`.
- HoverReadoutView exports `idLine` and its two refusal texts, and its rendered text is unchanged.
- Under canvas/, nothing is edited beyond §2.7's list.
- Whether the ruling's last sentence reaches beyond canvas/ is held for the human, before any code of B3.

**A11. OPEN-9 (a).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:44 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- Approved as they stand: Feature, Navigate, Select, Add / remove, Replace, Add only, Remove only, Pin, Zoom to selection, Clear selection.
- Every other new string, including this amendment's, is sighted at the sitting (row V11).

**A12. OPEN-10 (b).** state/directives/2026-10-09-rulings-on-the-eight-forms.md:45 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- Two PRs, and phase A merges first.
- Phase B's branch is cut from main after that merge. A class 3 row at phase B's base re-pins every cite phase A moved.
- §7's per-PR count stands. Every line of Part B below counts in phase B's PR.

**A13. The walkthrough Part.** state/directives/2026-10-09-rulings-on-the-eight-forms.md:46 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- Map-refill takes Part V (frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md:281 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). The walkthrough's last Part at b4dc05e is U (frontends/shell/MANUAL-WALKTHROUGH.md:1715 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
- This piece's Part is W. The re-sweep confirms W is free at the code base and renumbers V0 to V11, and B3's row, as W rows.

**A14. KNOWN-LIMITATIONS.**
- §2.8's two new items take the next free numbers at the code base.
- Items 36 and 38 are edited in place.
- Other pieces' items are disjoint by number (state/directives/2026-10-09-rulings-additions-reaim-identity-route-documents.md:29 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).

#### B. Class 9 — scope addition, on RULED 2026-10-09 (eight forms), item 4 (OPEN-2 and OPEN-5) and item 1 (placement)

Declared before any code of the addition. Each item gives its §2 shape, its §4 rows with one observed mutation each, and its §5, §7, §8 and §9 entries.

**B1. A click on nothing** (A4).
- **Shape.** On `{kind:"nothing"}`:
  - No selection transition, in any tool or mode.
  - In Navigate, `inspect.set null` unless `pinned`, with one `feature.inspect` class-C row.
  - In Select, nothing.
  - A refused pick keeps §2.2's rule.
- **RB13**, the one row the ruling names (render, App.selection.test.tsx):
  - In Select, in each mode, a click on nothing leaves the selection unchanged.
  - In Navigate, it leaves the selection unchanged, clears an unpinned inspected feature and keeps a pinned one.
  - Mutation: dispatch `selection.clear` on a click on nothing in Replace; it fails on the count.

**B2. Both selected and inspected** (§7, as the ruling asks).
- **The §7 constants**, in `canvas/highlightLayers.ts`:
  - HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX = 7. A polygon or line that is both draws its selected outline at 7 px beneath its inspected outline at HIGHLIGHT_OUTLINE_WIDTH_PX (3). That leaves 2 px of the selected colour on each side.
  - HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX = 11. A point that is both draws its selected ring at 11 px, outside its inspected ring at HIGHLIGHT_POINT_RING_RADIUS_PX (7).
- **Order:** the data layers, then the selected highlight layers, then the inspected ones. All are prefixed `highlight:` and none is pickable.
- **UB9 now also asserts,** for an id that is both: the selected layer carries 7 px (11 px for a point), the inspected layer carries 3 px (7 px for a point) and comes later in the list, and an id that is only selected carries 3 px.
- Second recorded mutation, UB9-b: draw a both feature's selected outline at HIGHLIGHT_OUTLINE_WIDTH_PX; it fails on the width.

**B3. The ask while an export runs.** It is built only on A7's first branch, and after the human's word on A10's reach.
- **Runs.** An export runs from PublishPanel's prepare call to its outcome, and from its execute call to its outcome. The approval prompt between them is not a run.
- **The report.** §2.5's `onExportRunning` carries `{cancel: () => Promise<boolean>} | null`. `cancel` calls the existing `publishCancel` with the running phase's key: frontends/shell/src/publish/PublishPanel.tsx:427-429 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD in prepare, and the attempt id at frontends/shell/src/publish/PublishPanel.tsx:461 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD in execute. There is no new host call.
- **The consumer.** App holds the operation consumer while a run stands. It releases it at the run's outcome, never on unmount.
- **The open.** AdmissionPanel gains one prop, `confirmOpen: () => Promise<boolean>`. It is passed into `runAdmitPath`'s deps and awaited before the first `setState` (frontends/shell/src/admission/AdmissionPanel.tsx:205-211 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD; Props at frontends/shell/src/admission/AdmissionPanel.tsx:258-260 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD).
  - `runAdmitPath` returns `Promise<AdmissionOutcome | null>`, where null means the open was dropped.
  - With no run, `confirmOpen` resolves true at once.
  - Otherwise App renders `src/feature/OpenDuringExportAsk.tsx` in `section.source`, beneath AdmissionPanel and never over the map. It offers two choices, worded at P6:
    - **Keep exporting:** false. `admit` is not called, `setState` is not called, and nothing is queued.
    - **Cancel the export and go on:** `cancel()` is called once, then true. The old resource closes once the export has released it.
  - Each choice records one class-C row, `dataset.openDuringExport`, with its P6 statement. The cancel it triggers is the existing call, recorded as it already is.
  - The ask stands until a choice is made.
- **Close.** At b4dc05e the shell has no close action: `closeDataset`'s only callers are the `[admitted]` cleanups (frontends/shell/src/App.tsx:1447 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD; frontends/shell/src/App.tsx:1640 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD). So the ask stands at the open. A close action found at the code base is I4. Closing the window is out of scope.
- **Rows:**
  - **UB13** (unit, admission/AdmissionPanel.test.ts): false means no `admit`, no `setState` and null; true means today's flow. Mutation: call `admit` before awaiting `confirmOpen`; it fails on the `admit` count.
  - **RB12a**: Keep exporting means no `openDataset`, an unchanged handle and no `closeDataset`. Mutation: resolve true on Keep exporting; it fails on the `openDataset` count.
  - **RB12b**: Cancel and go on means one `cancel`, one `openDataset`, and `closeDataset(old)` once, only after the run's outcome. Mutation: release the consumer on unmount (§4 RB12's mutation); it fails.
  - **RB12c**: with no run, no ask is rendered. Mutation: always render the ask; it fails.
  - **E-ASK** (e2e, selection.mjs): during a whole-file export of `100k-happy-path.parquet`, opening `filter-zoned.parquet` shows the ask.
    - Keep exporting leaves the handle unchanged, and the export reaches its outcome.
    - Repeated with Cancel and go on, the new dataset is admitted, and the old one's `close_dataset` row follows the run's outcome.
    - Mutation: `confirmOpen` always true; it fails on the absent ask.
    - If the export has ended before the open, the step is inconclusive (class 2), never a pass.
  - **Walkthrough row** (after V8): start the export above, open `filter-zoned.parquet` while it runs, choose Keep exporting, then repeat and choose Cancel the export and go on. Felt: are the two choices clear, and did anything happen that you did not choose?

**B4. Row V3** (A4).
- It also asks whether the human expected the Feature tab to come forward on a Navigate click.
- It also asks whether a feature that is both selected and inspected visibly shows both.

**B5. Moving the barrier.** This applies only if lib.mjs does not export the barrier at the code base; state/directives/2026-10-09-rulings-on-the-eight-forms.md:12 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:HASH-TBD.
- **Shape.** In phase B's PR, the barrier and the read that follows it move to e2e/lib.mjs, exported, with their bodies byte-identical. regression.mjs and selection.mjs call that export.
- **Rows:**
  - e2e:regression passes A9′ and K6 in one run at the K6 fix's odd window and one at 1280 × 800.
  - Mutation M-MOVE: in the export, delete only the leave move. At the odd window, the first establishing call with an id standing fails by name at the clear-wait.

**B6. Rows behind A4's ruled choices.** Each has one observed mutation.
- **UB12** (workspaceState.test.ts): a minted view starts in Navigate, with `toggle` and nothing pinned. Mutation: default `replace`.
- **RB14:** a Navigate click leaves the Layer tab active and a closed Inspector closed. Mutation: activate `feature` on inspect.
- **RB15:** a Select click leaves `inspected` unchanged. Mutation: dispatch `inspect.set` on a Select click.
- **RB16:** the picker is absent in Navigate and present in Select. Mutation: render it in both tools.
- **UB11's second mutation:** return the tool's cursor while dragging in Select; it fails on `grabbing`.
- **E-NODRAG also asserts** that the view box changed. Second mutation: `dragPan: false` while Select is active; it fails on the unchanged box.
- **E-CLICK** brings the Feature tab forward itself before its click.

**B7. §5 additions.**
- **Declared unchanged:**
  - PublishDialog, `admitDataset.ts`, the host prompt, src-tauri, ADR-024 and `FILTER_SCOPE_SENTENCE`'s text;
  - AdmissionPanel, beyond B3's prop and deps member;
  - `layoutState.ts`;
  - e2e/lib.mjs and regression.mjs, beyond B5.
- **Invalidators:**
  - **I11:** EXPORT-TODAY shows neither H4 nor an export that already waits or asks.
  - **I12:** B5's move cannot be byte-identical or exported.
  - **I13:** B3 needs an edit beyond its declared shape.
  - **I14:** a suite fails at the code base before any phase A code. It is recorded and goes to the custodian before any code.
  - **I15:** RB14's property needs an edit to `layoutState.ts`.

**B8. §8 additions.**
25. A Navigate click that changes the Inspector's tab or opens a closed Inspector.
26. A Select click that inspects, or a Navigate click that changes the selection.
27. A click on nothing that changes the selection, or that clears a pinned inspected feature.
28. A dashed line, or an encoding other than §7's and B2's.
29. A dialog for pin.
30. The label Filtered, or a count of selected features within the filter.
31. An open issued while an export runs without B3's ask, a queued open, or a silent cancel.
32. A barrier or an establishing read in selection.mjs other than the call to lib.mjs's export.
Item 18 also admits the strings of A5, A6, B1 and B3, each sighted at P6.

**B9. §9 additions.**
- The base suite run (A1) is listed in phase A's PR.
- EXPORT-TODAY's class 1 amendment comes before any phase B code.
- No code of B3 before the human has ruled on A10's reach.
- The re-sweep names lib.mjs's export.
- The sitting sights B2's encodings and every new string.

**B10. §7 additions.** Counted by §7's command, in phase B's PR.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| AM1-P | highlightLayers.ts +40, App.tsx +40, surfaceRegistry.ts +5, styles.css +10 | 95 |
| AM1-T | highlightLayers.test.ts +60, App.selection.test.tsx +220, workspaceState.test.ts +30, pickResolution.test.ts +15 | 325 |
| AM1-E | selection.mjs +40 | 40 |
| AM1-X (B3, conditional) | AdmissionPanel.tsx ≤ 20, AdmissionPanel.test.ts ≤ 60, OpenDuringExportAsk.tsx ≤ 100, PublishPanel.tsx +30, App.tsx +60, App.selection.test.tsx +150, selection.mjs +90, styles.css +15, surfaceRegistry.ts +5 | 530 |
| AM1-M (B5, conditional) | lib.mjs ≤ 120, regression.mjs ≤ 120 | 240 |
| **Amendment 1** | | **1,230** |

- The piece's ceiling is 6,644 + 1,230 = 7,874, over about 35 files.
- MANUAL-WALKTHROUGH.md: ≤ 160, outside the count.
- An overrun is class 8, and neither §7 nor this table is edited to match it.

#### C. Superseded index

| Form passage | Superseded by |
|---|---|
| Authority line, the third prerequisite | A1 |
| §0.3, which three pieces | A1 |
| §0.5 and §2.8, the establishing helper | A2 (B5 if needed) |
| §2.1(c) | A7 |
| §2.2 Tools, the default mode, the keys and the Select cursor | A4 |
| §2.2 The click, the Select inspect question and a click on nothing | A4, B1 |
| §2.2 Highlight, the two encodings | A4, B2 |
| §2.5, the export's scope and the export as a consumer | A6, B3 |
| §2.6, the Navigate tab question | A4 |
| §2.8, the Part letter, V3, items 36 and 38 | A13, B4, A3 |
| §4 RB11, RB12, UB9, UB11, E-NODRAG, E-CLICK, and the sixth acceptance item | A5, B3, B2, B6, A6 |
| §7, the Defaults row and the total | A4, B10 |
| §11, OPEN-1 to OPEN-10 | A3 to A12 |

Read the last amendment first.
````

**2. What the human must still decide**

Both items matter only if EXPORT-TODAY shows that H4 holds.

1. **Whether OPEN-8's "nothing else beyond §2.7's list" covers files outside canvas/** (A10). OPEN-5's ask has to come before the open is issued. Today the open is issued inside `runAdmitPath` in AdmissionPanel (`frontends/shell/src/admission/AdmissionPanel.tsx:205-211 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b`) before App hears about it. AdmissionPanel is on §2.7's not-edited list.
   - If the sentence is read as covering canvas/ only, B3 adds one prop and one deps member to AdmissionPanel.
   - If it is read as covering the whole piece, the ask cannot come first. OPEN-5 would then need a different ruling.
   - OPEN-8 was a red line, so this needs the human's typed word. No code of B3 starts before it.
2. **A late cancel is not reported.** Under "Cancel the export and go on", the export panel unmounts. If the cancel arrives after the export has finished, the bundle is written and nothing says so. The amendment builds nothing for this. The human decides whether that end should be stated, for example as a status item.

**3. Files read**
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-additions-reaim-identity-route-documents.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (classes 1 to 9, and the Round 25 additions)
- C:\dev\spatial-ide\frontends\shell\E2E-HOVER-ESTABLISHING-READ-PREREGISTRATION.md
- C:\dev\spatial-ide\frontends\shell\SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md (searched for Part V)
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md (Part headings)
- C:\dev\spatial-ide\state\directives\SHELL-MIGRATION-PLAN-2026-10-07.md (lines 40-59, 160-219)
- C:\dev\spatial-ide\docs\adr\ADR-024-class-3-permission-boundary-and-first-exposure.md (lines 212-229)
- C:\dev\spatial-ide\frontends\shell\src\publish\types.ts (lines 114-130)
- C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx (searched)
- C:\dev\spatial-ide\frontends\shell\src\admission\AdmissionPanel.tsx (lines 170-300)
- C:\dev\spatial-ide\frontends\shell\src\layout\contributions.ts
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (item headings 34 to 39)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (searched for the two RULED 2026-10-09 block headers; not cited by line)
- C:\dev\spatial-ide\frontends\shell\src (searched for the `closeDataset` callers)

Every `sha256:HASH-TBD` must be computed by script over the LF bytes at b4dc05e08c1e24ef7d6904596bb2332b87dcf75b before the commit. I have no Bash, so I computed none.
