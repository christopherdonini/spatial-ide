*Custodian's filing note (2026-11-03): the architect's read-only preparation of the sitting script's wording findings N1 to N7 as pieces A to D with the words, each on the full form, read at main ab9b52ab (dispatched 2026-11-03T11:35:14Z by the main transcript, its prompt equal to its brief by script). No form is committed and no string changes before the human answers at the sitting, as the node is placed. Its OPEN-3 (item 8 carried in piece A) and OPEN-5 (the placeholder marks) are red lines by its marking and wait for the human at the sitting; OPEN-1, OPEN-2, OPEN-4, OPEN-6 and OPEN-7 take its recommendations under the human's direction of 2026-10-31, item 4, for the forms drafted after the sitting; OPEN-8 (the hover readout's session-ended text) is a finding for the human, no node. The brief glossed the template's line 176 as saying that a test's asserted figure counts; those are not that line's words but the custodian's reading of it with section 21a's fourth category, as the architect notes, and the brief's wording is the custodian's slip. The run 11:35:15Z to 11:46:06Z by its transcript (Grep 45, Read 50, Glob 2; no write tool; no call outside the repository). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256 from line 5 to the end is 430befd95f1dcc75c840db440429a60a483bfe5ae31a9852c504e045762e903a.*

---

Prepared: sitting-wording-n1-to-n7, architect (main @ ab9b52abf15e17693133d395330657e9840a5663)

I read the main checkout only. I took its HEAD to be ab9b52ab from the session's git status; I have no shell to confirm that. For the same reason I computed no sha256 and none appears below. Every cite is `path:line @ ab9b52ab`. The script's cites were taken at c715c96b. Where a line has moved I found it by its text and give both positions. I used no wait loop and I leave no background shell. Strings in backticks are byte-copied from the file. Where a Rust `\` continuation or a JSX line break joins two source lines, the string is also given as it renders. My own words are marked **(mine)**.

---

## N1. The filter-scope sentence

1. **The string at main.** `frontends/shell/src-tauri/src/publish.rs:73-75 @ ab9b52ab` (unmoved):
   `    "this bundle format cannot record a row predicate (ADR-017 \` / `     §8, bundle_version 1); publishing publishes the viewport extent, not your filter";`
   It renders as `this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`.
   - The panel's echo: `frontends/shell/src/publish/types.ts:126-128 @ ab9b52ab` (unmoved), the same text.
   - **A third copy the script did not list:** `frontends/shell/e2e/publish.mjs:66-68 @ ab9b52ab`.
   - Both copies read as the script quotes them.
2. **The words (the script's, byte-copied):** `this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); the export covers the row scope above, not your filter`. Every clause is true at main (item 3), so I give no corrected words.
3. **The check again at main:**
   - "the row scope above", in the dialog: true. `Row scope` and its value render at `frontends/shell/src/publish/PublishDialog.tsx:261-262 @ ab9b52ab`, before the filter-scope block at :264-268.
   - "the row scope above", in the panel: true. The fieldset is at `frontends/shell/src/publish/PublishPanel.tsx:665-691 @ ab9b52ab`, and the sentence follows it at :693.
   - "not your filter": true. The whole-file arm is `ViewportQuery::all()` (`publish.rs:105 @ ab9b52ab`), whose `filter: None` is at `engine/src/stream.rs:258-265 @ ab9b52ab`. The bbox arm sets `filter: None` at `publish.rs:120 @ ab9b52ab`.
   - The sentence is shown under either scope whenever a filter is active: `publish.rs:635 @ ab9b52ab`.
   - The old clause is untrue at main, and a test already reaches the case. `frontends/shell/e2e/publish.mjs:458-487 @ ab9b52ab` (FILTERED') prepares a **whole-file** scope with a filter on and asserts the "viewport extent" sentence.
   - Named, not blocking: in the panel the new words sit directly above `[P6 placeholder] The selection is not used. The export covers the row scope chosen above.` (`PublishPanel.tsx:44 @ ab9b52ab`, rendered at :695). That is a repetition, not an untruth.
4. **What follows the string** (each changes in the same piece):
   - **Tests:**
     - `PublishPanel.test.ts` "matches frontends/shell/src-tauri/src/publish.rs::FILTER_SCOPE_SENTENCE exactly, Rust line-continuation collapsed" (`frontends/shell/src/publish/PublishPanel.test.ts:222-240 @ ab9b52ab`). It reads the copies, so its text does not change.
     - `the_filter_scope_sentence_is_present_only_when_filter_active_is_true` (`publish.rs:2001-2046 @ ab9b52ab`). It compares against the constant, so its text does not change either.
     - e2e FILTERED' (`e2e/publish.mjs:66-68`, :483-487). Its copy changes.
   - **Doc comments that call the old text "verbatim" from NEXT-CUT.md:** `publish.rs:71-72`, `types.ts:115-125`, `e2e/publish.mjs:63-65` and :460-461, and `frontends/shell/e2e/README.md:216-218 @ ab9b52ab` ("the conditional block's own sentence verbatim"). All of these become untrue after the change.
   - **Documents that quote it:**
     - KNOWN-LIMITATIONS item 8 (`KNOWN-LIMITATIONS.md:105 @ ab9b52ab`). Its source comment at :107 holds historical pins at 8e093734 and b391e436; those are authoritative as history and stay.
     - Walkthrough G8 (`frontends/shell/MANUAL-WALKTHROUGH.md:333 @ ab9b52ab`; the script cited :331). It says "either scope option" and quotes the sentence "verbatim".
     - `governance/RELEASE-0.1.md:1190 @ ab9b52ab` is the human's sighting at M8. It is history and does not change.
5. **P6.** The operator sees this string in the approval dialog and in the panel. Neither the current string nor the words carry `[P6 placeholder]`. The code calls the current text the NEXT-CUT.md block's verbatim wording. Whether the human typed it is unsettled (last section). See OPEN-5.

## N2. The ask

1. **The string at main.** `frontends/shell/src/feature/OpenDuringExportAsk.tsx:40-41 @ ab9b52ab` (unmoved):
   `        [P6 placeholder] An export of the open dataset is still running. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and the` / `        export is asked to stop and the new dataset is opened; the open dataset is closed once the export has ended.`
   It renders as the script quotes it.
2. **The words (the script's, byte-copied):** `[P6 placeholder] An export of the open dataset was running when this open was asked for. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and an export still running is asked to stop and the new dataset is opened if its open is admitted; the dataset it replaces is closed once the export has ended.`
3. **The check again at main** (every App.tsx line has moved):
   - "was running when … asked for": true. `confirmOpen` asks only when `exportRunsRef.current.size !== 0` (`frontends/shell/src/App.tsx:1193-1205 @ ab9b52ab`; script :1175-1181). The path is already chosen when `confirmOpen` runs (`frontends/shell/src/admission/AdmissionPanel.tsx:198-203 @ ab9b52ab`).
   - Keep exporting: true. `runAdmitPath` returns `null` before any state change (`AdmissionPanel.tsx:203 @ ab9b52ab`).
   - "an export still running is asked to stop": true. `run.cancel()` is called for each run of the ask and each run standing (`App.tsx:1216-1222 @ ab9b52ab`; script :1194-1199). The clause claims nothing about runs that have already ended.
   - "opened if its open is admitted": true. A refused open and a cancelled open both set the refused or idle state and admit nothing (`AdmissionPanel.tsx:222-260 @ ab9b52ab`).
   - "the dataset it replaces is closed once the export has ended": true, in three steps:
     - The rebind drops the view from the old resource's consumers (`frontends/shell/src/workspace/workspaceState.ts:144-146 @ ab9b52ab`).
     - The export's consumer is released when its `ended` resolves (`App.tsx:1183-1189 @ ab9b52ab`; script :1161-1166).
     - Once no consumer is left the resource is closable (`workspaceState.ts:220-225 @ ab9b52ab`; script :214-219), and `closeDataset` is called (`App.tsx:1520-1525 @ ab9b52ab`; script :1471-1472).
     With a refused open nothing is replaced, so the clause has no subject; I read that as no untruth.
   - Named, not claimed: a prepare run also counts as "an export" (`frontends/shell/src/publish/PublishPanel.tsx:402-408 @ ab9b52ab`). The current string has the same reading.
4. **What follows the string:**
   - **Tests:** no test pins its text. The only hits for `open-during-export-text` are the component and `styles.css`. RB12a to RB12g (`frontends/shell/src/App.selection.test.tsx:932-1111 @ ab9b52ab`) pin the behaviour.
   - **Documents:** W11 (`MANUAL-WALKTHROUGH.md:1834 @ ab9b52ab`; the script cited :1832) names "the ask's still-running clause" and "the ask's new-dataset-opened clause" as untrue. That becomes untrue after the change. KNOWN-LIMITATIONS item 40 (:395) does not quote the ask.
5. **P6.** The operator sees it, and the words carry the mark.

## N3. The tool hints

1. **The string at main.** `frontends/shell/src/feature/ToolSwitch.tsx:22-23 @ ab9b52ab` (unmoved): `a click inspects the feature.` and `a click changes the selection, by the mode.`. Both render through the template at :85, `[P6 placeholder] ${entry.label} (${entry.bareKey?.letter.toUpperCase()}): ${click}`. They read as the script quotes them.
2. **The words (the script's, byte-copied):**
   - Navigate: `a click on a feature inspects it, unless a feature is pinned.`
   - Select: `a click on a feature changes the selection, by the mode.`
   - **The Select words are untrue at main, in ordinary use.** A click on a feature leaves the selection unchanged in three cases (`frontends/shell/src/workspace/selection.ts:126-133 @ ab9b52ab`):
     - Replace on the only selected feature;
     - Add only on a feature already selected;
     - Remove only on a feature not selected.
     `clickEffect` then records no row (`frontends/shell/src/feature/clickEffect.ts:60-64 @ ab9b52ab`).
   - **My corrected Select words (mine):** `a click on a feature applies the mode to the selection.`
     - Check: every live click on a feature in Select, above the 9 px rule, dispatches `selection.apply` with the view's mode (`clickEffect.ts:58-65 @ ab9b52ab`). That holds whether or not the selection changes. True.
     - At the ceiling, Add is refused with its own notice. That is named, not claimed.
   - **The Navigate words** stand as the script gives them.
4. **The check again at main** (clickEffect lines moved by 2):
   - Navigate, pinned: the pinned feature is kept (`clickEffect.ts:67-68 @ ab9b52ab`; script :65-66). Unpinned: `inspect.set` (:69-73; script :67-71). Pinning needs a feature to be inspected (`frontends/shell/src/workspace/viewTransitions.ts:150 @ ab9b52ab`), so "unless a feature is pinned" never leaves a pin with nothing inspected. True.
   - A click on nothing (:49-56) and a click below the 9 px rule (:47) are not clicks on a feature. A click after the session ended gets the named session-ended state (:46). Each gets its own last-click line. Named, not claimed.
   - Select: the script's own check, `selection.apply` by the mode, is true. Its clause "changes the selection" is not (item 2).
5. **What follows the string:**
   - **Tests:** ToolSwitch.test.tsx "states in one line what a click does in each tool, and each button points at its own line" asserts both literals (`frontends/shell/src/feature/ToolSwitch.test.tsx:67-73 @ ab9b52ab`). Its RECORDED MUTATION note quotes the old Select string (:63-66).
   - The behaviour is pinned by RB1, RB2, RB11 and RB13 (`App.selection.test.tsx:343`, :362, :575, :599 @ ab9b52ab).
   - **Documents:** W11 (`MANUAL-WALKTHROUGH.md:1834 @ ab9b52ab`) names "the tool switch's click-inspects clause" as untrue.
6. **P6.** The operator sees it, and the mark comes from the template at :85, not from the words.

## N4. `COMMAND_UNKNOWN_NOTE`

1. **The string at main.** `frontends/shell/src/command/CommandBar.tsx:37 @ ab9b52ab` (unmoved): `export const COMMAND_UNKNOWN_NOTE = "[P6 placeholder] No command has that name. Type ? for the list.";`. It reads as quoted.
2. **The words (the script's, byte-copied):** `[P6 placeholder] No command matches that. Type ? for the list.`
3. **The check again at main:**
   - The note is chosen for `unresolved` with any reason other than `filter-empty` (`CommandBar.tsx:48-49 @ ab9b52ab`).
   - `unknown-command` covers two cases:
     - a word that takes nothing, followed by text (`frontends/shell/src/command/commandDraft.ts:49-52 @ ab9b52ab`);
     - a word that no entry starts with (:58-59).
   - In both cases no entry resolves the draft. True.
   - The words stay distinct from `COMMAND_NONE_NOTE` (`CommandBar.tsx:38`), which is shown for a search with no candidates (:54).
4. **What follows the string:** no test pins its text. `commandDraft.test.ts:36-37` and :73-74 @ ab9b52ab pin only the reason. No document quotes it.
5. **P6.** The operator sees it, and the words carry the mark.

## N5. O3 and its counterpart (the human's wording; the human answers)

1. **The string at main.** `frontends/shell/src/workspace/stepRecorder.ts:85 @ ab9b52ab` (unmoved): ``    : `${applied} It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent.`;``. It reads as quoted.
2. **The words (the script's, byte-copied):** `It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent or answered.` This is the human's wording, so I do not reword it.
3. **The check again at main:**
   - The head stays in `waiting` until its call settles (`stepRecorder.ts:45-61 @ ab9b52ab`), so it has been sent and is waiting for its answer. The rest have not been sent.
   - If `report` throws, the queue is left undrained (:62-65). The head is then unsent, and "sent or answered" covers that case too.
   - The bound is at :69-73. True.
4. **What follows the string:**
   - **Test:** "R2: at its bound, sends nothing and reports the change as not sent" asserts the full literal with the figure 64 (`frontends/shell/src/workspace/stepRecorder.test.ts:50-63 @ ab9b52ab`). The figure does not change.
   - **The form:** the B2-1B form now lives at `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md`; the script cited `kernel/B2-1B-…`. Its O3 row is at :400 and Amendment 9 item 2 is at :915 @ ab9b52ab. Both are records and are not edited.
   - No KNOWN-LIMITATIONS item or walkthrough row quotes it.
5. **P6.** The operator sees it (the record notice). It carries **no** mark, though Amendment 9 item 2 keeps it a placeholder until the sitting. That is D6. See OPEN-5.

## N6. The NaN Point refusal

1. **The string at main.** `engine/src/wkb.rs:303 @ ab9b52ab` (unmoved): `"[P6 placeholder] a Point with a NaN coordinate (WKB's empty Point) was met".into(),`. It reads as quoted.
2. **The words (the script's, byte-copied):** `[P6 placeholder] a Point with a NaN coordinate was met (WKB writes an empty Point with NaN coordinates)`
3. **The check again at main:**
   - The check fires when x or y is NaN (`wkb.rs:300 @ ab9b52ab`). The parenthesis does not call every such point empty. True.
   - "WKB writes an empty Point with NaN coordinates" is a claim about an external encoding convention. The code cannot prove or disprove it. Named, not blocking.
   - The source comment at :301 ("WKB's empty-Point convention") makes the same over-reach as the string and should be reworded in the same piece.
   - **The script's open question is now settled.** `error_of` sets the message to the error's Display (`kernel/src/skp.rs:2069-2070 @ ab9b52ab`), with code `wkb` (:2134) and the Display prefix `wkb: ` (`engine/src/error.rs:346 @ ab9b52ab`). On the data plane the detail is `"<code>: <display>"` (`kernel/src/skp.rs:2062-2064 @ ab9b52ab`).
4. **What follows the string:**
   - **Test:** `a_point_with_a_nan_in_either_coordinate_is_refused` (`wkb.rs:1061-1073 @ ab9b52ab`) asserts only the mark and `NaN`, so it still passes.
   - **Documents:** KNOWN-LIMITATIONS item 31 (`KNOWN-LIMITATIONS.md:356 @ ab9b52ab`) says "An empty Point (WKB's NaN coordinates) is such a row". That is not a quote and it is not untrue. The walkthrough's P7(c) (`MANUAL-WALKTHROUGH.md:1645 @ ab9b52ab`) only names the string.
5. **P6.** The operator sees it, after `wkb: `, and the words carry the mark.

## N7. The ended-selection reason

1. **The string at main.** `frontends/shell/src/feature/FeatureTab.tsx:113 @ ab9b52ab` (moved; the script cited :73):
   `  const because = notice.reason === "source-changed" ? "the source file changed" : "a dataset was opened";`
   Template at :115: ``  return `[P6 placeholder] The selection ended: ${dropped}, because ${because}.`;``. It reads as quoted.
2. **The words (the script's, byte-copied):** `the dataset's session ended`, rendering `[P6 placeholder] The selection ended: 2 selected features were dropped, because the dataset's session ended.`
3. **The check again at main:**
   - `source-changed` is written only by `endGeneration` (`workspaceState.ts:162-170 @ ab9b52ab`; script :158-166).
   - `endViewGeneration` has two callers, :151 (`reopened`) and :167.
   - `resource.generationEnded` is dispatched only inside `endSession` (`App.tsx:1363-1372 @ ab9b52ab`; script :1341-1349).
   - Both `observed-change` and `coverage-lost` reach `endSession`, by the event route (`App.tsx:740-741`, :760-779 @ ab9b52ab) and by the refusal route (`frontends/shell/src/streaming/liveTicketSet.ts:80-85 @ ab9b52ab`).
   - Coverage loss is reachable in ordinary use: `engine/src/watch.rs:335`, :348 and :387 @ ab9b52ab.
   - The words match the owner's own term, "ended this dataset's session" (`App.tsx:741`). True for both reasons.
4. **What follows the string:**
   - **Tests:**
     - FeatureTab.test.tsx "the notice names the count dropped and which of the two ended the selection, or the ceiling, and none when there is none" (`frontends/shell/src/feature/FeatureTab.test.tsx:196-213 @ ab9b52ab`; the literal is at :206).
     - RB4 (`App.selection.test.tsx:423`, :448 @ ab9b52ab).
     - e2e E-GEN (`frontends/shell/e2e/selection.mjs:487-488 @ ab9b52ab`).
     No test drives `coverage-lost` to the notice.
   - **Documents:** KNOWN-LIMITATIONS item 40 (`KNOWN-LIMITATIONS.md:394-396 @ ab9b52ab`) does not quote it.
5. **P6.** The operator sees it, and the mark comes from the template at :115.

---

## The pieces

**Gating, for all four.** §21a's fourth category ("any property currently under test", `governance/AUTONOMY.md:325-327 @ ab9b52ab`) is touched by every piece, as #274 read it. Each set of new words restates a property under test:
- N1: P0, through FILTERED';
- N2: RB12a to RB12g, and the ADR-018 cancellation statement;
- N3: RB1, RB2, RB11 and RB13;
- N4: the `unknown-command` cases;
- N5: R2;
- N6: PE-4;
- N7: RB4.

The precedent is `governance/forms/frontends/WALKTHROUGH-STALE-CITES-L5-DEGREES-P1-PREREGISTRATION.md:19-28 @ ab9b52ab`. So each `Out-of-scope` line below names `guarantee` as touched. That closes the five-line form from dispatch (`docs/PREREGISTRATION-TEMPLATE.md:176 @ ab9b52ab`), and each piece takes the full form. The five lines below are each form's summary. A piece dispatched on a five-line form would fail by name.

No test's asserted figure changes in any piece; 64 stays 64. Line 176 at ab9b52ab is the Out-of-scope-at-dispatch rule. I found no text there or elsewhere saying "a test's asserted figure counts". See the last section.

**Piece A: N1, the filter-scope sentence.** Form: `governance/forms/frontends/SITTING-WORDING-A-FILTER-SCOPE-SENTENCE-PREREGISTRATION.md`
```
Authority: PLAN node sitting-wording-n1-to-n7; placed by state/directives/2026-10-23-weekend-covering-case-s1-session-log-redaction-s2-governance-and-docs-order-v0-2-scope-port-2-approved.md, item 4; finding N1 of state/drafts/sitting-script-2026-10-23.md ("Findings and replacement words"); the words as the human answers at the sitting
Scope: frontends/shell/src-tauri/src/publish.rs, frontends/shell/src/publish/types.ts, frontends/shell/src/publish/PublishDialog.test.ts, frontends/shell/e2e/publish.mjs, frontends/shell/e2e/README.md (the publish suite entry), KNOWN-LIMITATIONS.md (item 8), frontends/shell/MANUAL-WALKTHROUGH.md (Part G, row G8); 7 files; 70 lines
Change: the dialog's and the panel's filter-scope sentence says the export covers the row scope above, not the filter, in the human's answered words, with its three copies, their "verbatim" comments, item 8's quote and G8's quote carried
Tests+mutation: PublishPanel.test.ts's copy-equality test and publish.rs's the_filter_scope_sentence_is_present_only_when_filter_active_is_true unchanged and green; e2e FILTERED' copy changed and run once; new PublishDialog.test.ts test "the filter-scope block renders after the Row scope field", failed by name by moving the block above the <dl>
Out-of-scope: ADR none; security none (ADR-020/009/021 untouched); wire none (filter_scope is a Tauri binding field, not SKP; its value changes, the field does not); guarantee TOUCHED (restates P0's no-filter property, under test) — full form
```
Paths against rule (00): `cut/port-2-macos-l1-and-app-dirs` touches `KNOWN-LIMITATIONS.md`, and I cannot tell which item. If it edits item 8, A waits. All other in-flight paths are disjoint. `cut/b1-shell-half-pr-c` shows no paths yet; re-check it at dispatch.

**Piece B: N2, N3 and N7, the feature folder and W11.** Form: `governance/forms/frontends/SITTING-WORDING-B-ASK-TOOL-HINTS-ENDED-SELECTION-PREREGISTRATION.md`
```
Authority: as A, findings N2, N3 and N7
Scope: frontends/shell/src/feature/OpenDuringExportAsk.tsx, frontends/shell/src/feature/ToolSwitch.tsx, frontends/shell/src/feature/ToolSwitch.test.tsx, frontends/shell/src/feature/FeatureTab.tsx, frontends/shell/src/feature/FeatureTab.test.tsx, frontends/shell/src/App.selection.test.tsx, frontends/shell/e2e/selection.mjs, frontends/shell/MANUAL-WALKTHROUGH.md (Part W, row W11); 8 files; 80 lines
Change: the ask, the two tool hints and the ended-selection cause say what the shell does at main in the human's answered words, and W11 no longer names them as untrue
Tests+mutation: ToolSwitch.test.tsx's hint test and FeatureTab.test.tsx's notice test changed (each recorded mutation re-observed at the piece's commit); RB4 changed and extended with a coverage-lost session end through the real dataset_session_ended listener, asserting the new cause (fails by name with FeatureTab's source-changed words restored); RB12a asserts the ask's text (fails by name with the old text restored); e2e E-GEN changed and run once
Out-of-scope: ADR none; security none; wire none; guarantee TOUCHED (RB1/RB2/RB11/RB12/RB13 properties; ADR-018 cancellation wording) — full form
```
Paths: disjoint from every listed branch. Part W counts as a separate path from A's Part G under `state/directives/2026-10-18-229-not-i6-item-23-words-approved-no-release-line-rule-00-e2e-readme-entries-227-merged.md`, item 3. `cut/b1-shell-half-pr-c` must be re-checked at dispatch.

**Piece C: N4 and N5, the command note and O3.** Form: `governance/forms/frontends/SITTING-WORDING-C-COMMAND-NOTE-AND-O3-PREREGISTRATION.md`
```
Authority: as A, findings N4 and N5 (N5 the human's wording, Amendment 9 item 2 of governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md)
Scope: frontends/shell/src/command/CommandBar.tsx, frontends/shell/src/App.command.test.tsx, frontends/shell/src/workspace/stepRecorder.ts, frontends/shell/src/workspace/stepRecorder.test.ts; 4 files; 40 lines
Change: the bar's unknown note and the not-sent record notice say what the shell does at main in the human's answered words
Tests+mutation: new App.command.test.tsx test "RC-UNKNOWN: Enter on /layers x and on /zzz shows the unknown note", failed by name with noteFor returning COMMAND_NONE_NOTE for unknown-command; R2's literal changed (figure 64 unchanged), its mutation re-observed
Out-of-scope: ADR none; security none; wire none; guarantee TOUCHED (the unknown-command cases and R2's bound, under test) — full form
```
Paths: disjoint. `cut/b2-piece-1c-save-and-reopen` touches `kernel/src/session_history.rs`, not `stepRecorder.ts`.

**Piece D: N6, the NaN Point refusal.** Form: `governance/forms/engine/SITTING-WORDING-D-NAN-POINT-REFUSAL-PREREGISTRATION.md`
```
Authority: as A, finding N6
Scope: engine/src/wkb.rs; 1 file; 15 lines
Change: the NaN Point refusal and its source comment no longer call every NaN point WKB's empty Point
Tests+mutation: a_point_with_a_nan_in_either_coordinate_is_refused gains an assertion on the new clause, failed by name with "(WKB's empty Point)" restored
Out-of-scope: ADR none; security none; wire none; guarantee TOUCHED (PE-4's refusal property) — full form
```
Paths: port-2 touches `engine/src/lib.rs` and `lod.rs`, not `wkb.rs`. Filler 4b is expected under `engine/src/` and is not settled, so D waits until 4b's form names its files. None of the four pieces touches `protocol/`.

**At the sitting:**
- An N the human accepts as it stands leaves its piece. Its gap is recorded in its source comment and on the form (§31).
- If the human gives their own words for N5, those are what land.
- §31's "applied with no re-gate" does not cover strings the app shows (P6). So each piece is gated after the human answers.

## OPEN items

- **OPEN-1. Gating.**
  - (a) Full form for all four, on the #274 reading of §21a's fourth category.
  - (b) A five-line form where only a literal changes.
  - **Recommend (a).** The template's line 176 closes (b) once the Out-of-scope line must name a category. Not a red line.
- **OPEN-2. N1's "verbatim" doc comments and the e2e README entry.**
  - (a) Rewrite them in piece A to name the sitting as the source.
  - (b) Leave them.
  - **Recommend (a).** After the change they would be untrue. Not a red line.
- **OPEN-3. KNOWN-LIMITATIONS item 8's quote.**
  - (a) Carry it in piece A, with the human's N1 answer read as covering it, and ask the human so at the sitting.
  - (b) Give it its own piece.
  - **Recommend (a).** **Red line:** it is release-facing text, so it waits for the human's answer and is not taken by recommendation.
- **OPEN-4. W11 and G8.**
  - (a) Edit the row text in place and leave the result logs untouched, as #274 did.
  - (b) Leave the rows and append a dated note under each Part.
  - **Recommend (a).** For W11 this means after its log is filled at the sitting. Not a red line.
- **OPEN-5. Placeholder marks for N1 and N5 (D6).**
  - (a) A "yes" or the human's own words settles a string, and no mark is added. "Accepted as it stands" keeps it a placeholder, and the piece adds the mark.
  - (b) Add the marks now.
  - **Recommend (a).** **Red line** (P6): the human answers at the sitting.
- **OPEN-6. The e2e runs.**
  - (a) Run `e2e/publish.mjs` (A) and `e2e/selection.mjs` (B) once at each head, inside `hold shared -Project SpatialIDE`, with THE MACHINE paragraph in the brief.
  - (b) Unit tests only.
  - **Recommend (a).** The changed copies are e2e assertions. Not a red line.
- **OPEN-7. Order in the docs lane.**
  - (a) C, then B, then A (after port-2 if it edits item 8), then D (after 4b's form).
  - (b) A first.
  - **Recommend (a).** Not a red line.
- **OPEN-8. A finding outside N1 to N7.** `HOVER_SESSION_ENDED_TEXT` says "The source file changed while it was open…" (`frontends/shell/src/canvas/HoverReadoutView.tsx:39-40 @ ab9b52ab`). It is shown for every ended session, coverage loss included, and the Feature tab's last-click line uses it too (`FeatureTab.tsx:104`). Under coverage loss it carries the same untruth as N7.
  - (a) Record it for the human; no node.
  - (b) Join it to piece B.
  - **Recommend (a).** Joining would widen a node the human placed, and the string carries no mark. **Red line** if it is ever changed (P6).

## What I could not settle

- Whether the human typed N1's current sentence. No tracked NEXT-CUT.md holds the conditional block: `state/NEXT-CUT.md` and `state/cut-archive/` have no "row predicate". The only record is the human's M8 sighting at `governance/RELEASE-0.1.md:1190 @ ab9b52ab`.
- Which KNOWN-LIMITATIONS item port-2 edits. I cannot read branches.
- Filler 4b's files.
- `cut/b1-shell-half-pr-c`'s future paths.
- The brief's "the template's line 176: a test's asserted figure counts". Line 176 @ ab9b52ab is the Out-of-scope-at-dispatch rule, and I found no such sentence anywhere. I applied §21a's "any property currently under test" instead.
- Whether "WKB writes an empty Point with NaN coordinates" holds as a format fact. It is not a code fact.
- No e2e or unit test was run, and nothing was measured.
- HEAD itself: no shell, so no sha256 and no confirmation that the checkout is at ab9b52ab.
