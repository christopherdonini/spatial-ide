*Filed by the custodian: the sitting script's content for 2026-11-24 (the advisor's ruling ADV-2026-11-21-16, under the human's delegation of 2026-11-13, items 2 and 3), read only at ad2088a8, the hand-back of the architect (claude-opus-5-5), 38594 bytes, sha256 1ae072bb62937488b490c4c63fb8b2fcc5f4882dd90205215b1321bdb5aff867, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Glob 4, Read 108, Grep 67, SubagentHandback 1; errored: 3 (Read), from 2026-11-21T14:16:10Z to 2026-11-21T14:37:12Z. Copied whole into the sitting script, section 3 (state/drafts/sitting-script-2026-11-24.md).*

---

Prepared: the sitting script's content at ad2088a8

Reviewed: detached worktree C:/dev/wt/sit @ ad2088a8b3e57a900eca2d732799aa740d06e369. This is a records consult, not a gate. I worked read only, ran no shell and computed no hash. Text in backticks is copied byte for byte from the file cited, marked "copied". Where a JSX line break or a Rust `\` continuation joins two source lines, I give the text as it renders, with one space at the join, and say so. Ledger passages and rulings are cited by file and item.

- Block (i), Part AD, the reopen: 6 rows (AD0 to AD5), plus 26 strings for sight from the source.
- Block (ii), N1 to N8 with OPEN-3 and OPEN-5: 10 answers.
- Block (iii), the hero path and milestone 4: 33 rows or answers. These are Part A (5), Part L (3), Part G (4), Part Y (5), Part AC (13), entry 79 (1) and W1/W2 (2), plus F7 read once if owed (task 5).
- Block (iv), the felt verdicts: 6 rows (P1, P2, T1, T2, T4, entry 95).
- Block (v), item 4's list: 0 rows from me.
- Block (vi), every other Part and sight: 52 rows. These are P (points) P3–P7 (5), P (degrees) P1 (1), T3/T5/T6 (3), W (14), V1–V3 (3), Z (5), AA (5), AB (13), R1 (1), item 40 (1) and the Reset line (1).

---

## Block (i). Part AD, the reopen

**(a) Copy.**
- Heading, copied: `## Part AD — save a project into a folder under OneDrive and open it again: Save project, Open project, the question, an online-only file and a second window (b2-piece-1c-save-and-reopen, steps 1 and 2)`.
- Range: `frontends/shell/MANUAL-WALKTHROUGH.md:2021-2035 @ ad2088a8`.
- Its `## Result log` runs from `frontends/shell/MANUAL-WALKTHROUGH.md:2036 @ ad2088a8` to the end of the file.
- Walk all rows: AD0, AD1, AD2, AD3, AD4, AD5.

**(b) Count.** 6 rows. Then the 26 strings below for sight (one answer each, or one for the lot).

**(c) Have ready.** The row says it, at `frontends/shell/MANUAL-WALKTHROUGH.md:2025 @ ad2088a8`, copied:
- `fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens)`
- `an empty folder that you make inside your OneDrive folder, for the project`
- `a second empty folder inside your OneDrive folder for AD2 and AD3; File Explorer, for AD2 to AD4; and, for AD5, a third empty folder inside your OneDrive folder and a second start of the app while the first is running`
- AD2 and AD3 also need File Explorer's Free up space on that file, so OneDrive has to be signed in with Files On-Demand.

**(d) Strings for sight.**

The 11 strings that Part AD's notes name, each checked at ad2088a8:

| Symbol | Cite | Text (copied) | Where it shows | Whose | Clause check |
|---|---|---|---|---|---|
| PROJECT_FOLDER_PICKER_TITLE | `frontends/shell/src-tauri/src/commands.rs:334 @ ad2088a8` | `Choose the project folder` | Title of the native folder picker, set at :346 | The advisor's, under the delegation (S2, ADV-2026-11-21-14 item 2; comment at :333) | True: the picker picks the project folder (:346) |
| project.save label | `frontends/shell/src/layout/actionRegistry.ts:85 @ ad2088a8` | `Save project` | The Layers control and the command bar | The advisor's (comment at :84) | True: App.tsx:2181-2194 saves; the control shows only while admitted (App.tsx:2223-2227) |
| project.open label | `frontends/shell/src/layout/actionRegistry.ts:90 @ ad2088a8` | `Open project` | The command bar | The advisor's (O-19b, ADV-2026-11-20-05 item 2; comment at :89) | True |
| OPEN_PROJECT_IDLE and OPEN_PROJECT_OPENING | `frontends/shell/src/admission/AdmissionPanel.tsx:306-307 @ ad2088a8` | `Open project…` and `Opening project…` | The Layers button, rendered at :488-490 | The advisor's (O-19a, ADV-2026-11-20-05 item 2) | True: idle state and opening state |
| SAVED_NOTICE | `frontends/shell/src/project/saveProject.ts:27 @ ad2088a8` | `The project was saved.` | The strip above the map (App.tsx:2501-2505, in the slot at :2474) | The advisor's (header at :15-16) | True: shown only after the save resolves (:113-116) |
| MARK_WITHHELD_NOTICE (the queue's W10) | `frontends/shell/src/project/saveProject.ts:29 @ ad2088a8` | `The session history holds no saved-here mark for this save.` | Same strip | The advisor's | True: on `history_mark` withheld (:117; kernel/src/project/mod.rs:445-447 and 459-476 @ ad2088a8) |
| notSavedNotice | `frontends/shell/src/project/saveProject.ts:42 @ ad2088a8` | `The project was not saved: ${message}` | Same strip | The advisor's | True (:108, :124; the kernel writes no file on a refusal, kernel/src/project/mod.rs:429 @ ad2088a8) |
| QUESTION_TEXT | `frontends/shell/src/project/reopenNotices.ts:21 @ ad2088a8` | `This machine remembers this project in another folder. Is the project in this folder a copy, or the same project? A copy gets a new identity, written to the project file in this folder, and its data links become its own. The same project: this folder is remembered for it, and the question is not asked here again.` | The question at AD4 | The advisor's words, approved by the human (ADV-2026-11-21-12; header at :7-8). The human answers this one. | True: asked at kernel/src/project/mod.rs:742-743; a copy mints a new identity at :751 and is rewritten at :761-763 and :794-796; its locations are its own at :849-866; Same at :744 and :790-792; Known at :740 (all @ ad2088a8) |
| QUESTION_COPY, QUESTION_SAME, QUESTION_CANCEL | `frontends/shell/src/project/reopenNotices.ts:23 @ ad2088a8`, `:25`, `:27` | `A copy`, `The same project`, `Do not open` | The question's choices | Same as QUESTION_TEXT | True: Do not open ends the run (comment at :26) |
| OPEN_ELSEWHERE_OTHER_NOTICE | `frontends/shell/src/project/reopenNotices.ts:32 @ ad2088a8` | `The project was not opened in this window. Close it where it is open, then try again.` | AD5 | The advisor's | True: routed at openProject.ts:89; Held becomes OpenElsewhere at kernel/src/project/mod.rs:781-787; released at :780 when the holder opens another file (all @ ad2088a8) |

No row reaches the 26 strings below. ADV-2026-11-21-14 item 8 makes step 2's P6 the human's sight of all 37 strings in Part AD, so they are for sight as their text from the source. All are the advisor's (reopenNotices.ts header at :4-9 and saveProject.ts header at :15-16).

- **Checked by me:**
  - OPEN_ELSEWHERE_OWN_NOTICE (`reopenNotices.ts:30 @ ad2088a8`, copied: `It is the project open in this window, which stays as it is.`).
  - CHANGED_FILE (`:34`), RELINKED_FILE (`:35`), FILE_PART (`:36`), ADMISSION_PART (`:37`).
  - LINEAGE_NOT_KEPT (`:75`): its clause on a refused save is true by openProject.ts:109, kernel/src/session_history.rs:1737-1776 and kernel/src/project/mod.rs:344 @ ad2088a8.
  - SELECTION_NOTICE (`saveProject.ts:36`): true; the workspace has no selection member (:81-89).
  - NO_VIEW_NOTICE (`saveProject.ts:40`): true (:101).
  - THROUGH_LINK_NOTICE (`saveProject.ts:34`): true by the resolver at kernel/src/project/resolver.rs:36-46 and 66-98 @ ad2088a8.
- **Not clause-checked by me; they rest on PR 341's two gates (ADV-2026-11-21-14 item 6):**
  - NO_CANONICAL_SPELLING_NOTICE (`saveProject.ts:31-32`) and FOLDER_HOLDS_PROJECT_NOTICE (`:38`).
  - NOT_FOUND `:62`, NOT_FOUND_NONE `:63`, RELINK_CHOICE `:65`.
  - LINEAGE_NOT_RECORDED `:73` and LINEAGE_FILE_REFUSED `:76`.
  - VIEW_NOT_APPLIED `:88`.
  - KNOWN_FOLDERS_FULL `:96`, MACHINE_RECORD_REFUSED `:98`, ENGINE_REFUSAL `:100`, REOPEN_REFUSAL `:102`, REOPEN_LOCATOR `:104`, OPEN_PANICKED `:106`.
  - WORKSPACE_TEXT `:108`, COLOUR_BY_NOT_RESTORED `:115`, STYLE_NOT_APPLIED `:123`.
  - The custodian copies their texts from the source by script.
- Also shown in AD2 and AD3, and **not** among the 37: `Opening…` (`frontends/shell/src/admission/AdmissionPanel.tsx:172 @ ad2088a8`) and `Open cancelled` (`:241`, `:262`, `:396`). See task 5.

No finding: every string I checked is true.

**(e) Questions.**
1. AD1, felt: did OneDrive show the file syncing; did either save seem to wait; is each line clear? (free text)
2. AD2, felt: did the app look frozen; did `Opening…` and Cancel stay in view until the open ended? (free text)
3. AD3: which outcome; did Cancel wait for the file? (cancelled / opened before Cancel was seen, plus free text)
4. AD4, felt: are the question and its three choices clear? (yes / no, with your words)
5. AD5, felt: is it clear where the project is open? (yes / no, with your words)
6. For each of the 37 strings: stands / the wording you want.

---

## Block (ii). N1 to N8, the wording answers, with OPEN-3 and OPEN-5

Source: `governance/PLAN.yaml:6218 @ ad2088a8` (`sitting-wording-n1-to-n7`, blocked; ruled 2026-11-03: the answers are given at the sitting, with no form before it). The architect draft is `state/consults/2026-11-03-sitting-wording-n1-to-n7-pieces-architect-draft.md`. N8 is that draft's OPEN-8 (a). Every string here is shown by the app and stays under P6.

**(a) Copy.** No walkthrough Part. N1 is seen at Part G's G8, N2 and N3 at Part W's W8a and W11, N4 at Part AB's AB11, N7 and N8 at Part AC's AC10. N5 and N6 are read at the source.

**(b) Count.** 10 answers.

**(c) Have ready.** Nothing beyond the Parts named.

**(d) The strings.**

- **N1, the filter-scope sentence.**
  - `frontends/shell/src-tauri/src/publish.rs:78-80 @ ad2088a8`. It renders as (copied; one space at the `\` join): `[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`.
  - Where it shows: the approval dialog (`frontends/shell/src/publish/PublishDialog.tsx:267-271 @ ad2088a8`) and the panel's copy (`frontends/shell/src/publish/types.ts:132-134 @ ad2088a8`, shown at PublishPanel.tsx:693). Both show it only for Current view with a filter on (`publish.rs:136 @ ad2088a8`).
  - Whose: the source comment (:71-77) names the human's ruling of 2026-11-05 (evening), item 2, for the mark only. ADV-2026-11-21-14 item 1(c) calls it the human's own words.
  - Clause check: "cannot record a row predicate": true, `filter: None` (:125). "publishes the viewport extent": true under ViewportBbox (:146-150, :125). "not your filter": true.
  - **The 2026-10-23 finding is superseded.** Its untrue case, Whole dataset, no longer shows the sentence. Question: the sentence as it stands without the mark / your own words / keep it marked.
- **N2, the ask.**
  - `frontends/shell/src/feature/OpenDuringExportAsk.tsx:40-41 @ ad2088a8`. It renders as (copied, joined): `[P6 placeholder] An export of the open dataset is still running. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and the export is asked to stop and the new dataset is opened; the open dataset is closed once the export has ended.`
  - The group label is at :38. Whose: a P6 placeholder, not the human's.
  - Clause check:
    - "is still running": **untrue** once the run ends while the ask stands (App.tsx:1275-1281, 1285-1297 @ ad2088a8).
    - "the new dataset is opened": **untrue** for a refused open (AdmissionPanel.tsx:246-286 @ ad2088a8).
  - **Finding. Replacement words:** `[P6 placeholder] An export of the open dataset was running when this open was asked for. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and an export still running is asked to stop and the new dataset is opened if its open is admitted; the dataset it replaces is closed once the export has ended.`
  - Clause check of the replacement:
    - "was running when … asked for": true, the ask is shown only when a run exists at the open (App.tsx:1280).
    - "Keep … not opened": true (AdmissionPanel.tsx:221).
    - "asked to stop": true (App.tsx:1289-1296).
    - "if its open is admitted": true (AdmissionPanel.tsx:246-286).
    - "closed once the export has ended": true (App.tsx:1308-1313).
- **N3, the tool hints.**
  - `frontends/shell/src/feature/ToolSwitch.tsx:22-23 @ ad2088a8`, copied: `a click inspects the feature.` and `a click changes the selection, by the mode.` The template is at :85.
  - Whose: the source says the lines are P6 placeholders and the labels are the human's (:18).
  - Clause check:
    - Navigate: **untrue** while a feature is pinned (clickEffect.ts:68-73).
    - Select: **untrue** for a click on nothing, below resolution, or after the session ended (clickEffect.ts:47-57). The unchanged cases are in selection.ts:131, 134, 136.
  - **Replacement words:** Navigate `a click on a feature inspects it, unless a feature is pinned.`, true by clickEffect.ts:68-73. Select `a click on a feature applies the mode to the selection.`, true by clickEffect.ts:59-66; a click that meets no feature is not a click on a feature (:47-57).
- **N4, COMMAND_UNKNOWN_NOTE.**
  - `frontends/shell/src/command/CommandBar.tsx:37 @ ad2088a8`, copied: `[P6 placeholder] No command has that name. Type ? for the list.`
  - Clause check: "No command has that name" is **untrue** for a word that takes nothing followed by text, such as `/open x`. That case is unknown-command at `frontends/shell/src/command/commandDraft.ts:51-52 @ ad2088a8`, though the command exists.
  - **Replacement words:** `[P6 placeholder] No command matches that. Type ? for the list.`
  - Clause check of the replacement: no entry resolves the whole draft at :52 or :59; `?` opens the help (:43-45). True.
- **N5, O3 and its filter counterpart.** These are the human's wording, so the human answers.
  - `frontends/shell/src/workspace/stepRecorder.ts:85 @ ad2088a8`, copied: `${applied} It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent.` (`applied` at :82).
  - Where it shows: the record notice. It carries no mark.
  - Clause check: the count is one too many, because `waiting` holds the head that has been sent and awaits its answer (:45-46, :52-60, :70-71).
  - **Replacement words:** `It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent or answered.` True by the same lines.
  - Reached only at the 64-step ceiling. It is not reachable on demand, so it is read at the source.
- **N6, the NaN Point refusal.**
  - `engine/src/wkb.rs:303 @ ad2088a8`, copied: `[P6 placeholder] a Point with a NaN coordinate (WKB's empty Point) was met`.
  - Clause check: the test is x **or** y NaN (:300), so a Point with one NaN coordinate is called WKB's empty Point. That claim is untrue for any user file that holds such a row.
  - **Replacement words:** `[P6 placeholder] a Point with a NaN coordinate was met (WKB writes an empty Point with NaN coordinates)`. The first clause is true by :300. The parenthesis is a format convention, not a code fact (task 5).
- **N7, superseded by milestone 4 PR B.**
  - `frontends/shell/src/feature/FeatureTab.tsx:109-113 @ ad2088a8`. ENDED_BECAUSE now has `"coverage-lost": "the source watch lost coverage of the file"` (copied), selected through App.tsx:676-678 and workspaceState.ts:164-169.
  - Seen at AC10. Question: superseded, agree?
- **N8, superseded.**
  - `frontends/shell/src/canvas/HoverReadoutView.tsx:47-49 @ ad2088a8` now picks HOVER_SESSION_COVERAGE_LOST_TEXT (:42-43) for coverage loss. HOVER_SESSION_ENDED_TEXT (:40-41) is the human's at P6 by its comment (:38-39), and it is now shown only for a changed source.
  - Seen at AC10. Question: superseded, agree?
- **OPEN-3 (red line).**
  - KNOWN-LIMITATIONS item 8 (`KNOWN-LIMITATIONS.md:114 @ ad2088a8`) no longer quotes N1's clause. It describes the sentence and its condition.
  - Question: (a) carry item 8 with N1's answer / (b) its own piece / moot.
- **OPEN-5 (red line).**
  - N1's mark exists since 2026-11-06. N5, and the expiry sentence at G3, show no mark.
  - Question: (a) a yes or your own words settles the string with no mark, and acceptance as it stands adds the mark / (b) add the marks now.

**(e) Questions.** One per N: yes to the words / your own words / accepted as it stands. N7 and N8: superseded, agree / not. OPEN-3 and OPEN-5 as above, typed.

---

## Block (iii). The hero path and milestone 4

The hero slice is open, filter in SQL, style, publish (`docs/07_Roadmap.md:9 @ ad2088a8`).

**(a) Copy.** Each Part's range runs from its heading to the line before the next H2:

| Part | Heading, copied | Range | Rows walked | Result field |
|---|---|---|---|---|
| A | `## Part A — happy path (100k fixture)` | `frontends/shell/MANUAL-WALKTHROUGH.md:156-175 @ ad2088a8` | A1, A2, A3 (the Extent row, OPEN-4), A4, A7 (changed). A5, A6, A7a, A8–A10 are not owed. | Inside the A–N result log, :993-1462 |
| L | `## Part L — the residency-debt close: scoped Cancel, honest quiescence, live hover (residency-debt cut 1b)` | `:777-844` | The preamble at :808-817 (the arm and level check after each Ctrl+R), then L1 (:821), L2 (:822), L5 (:825). These are the queue's L1, L2, L5 and entry 48. L7 and L8 passed on 2026-09-14 (:1425). | Inside :993-1462; no blank field for these rows (task 5) |
| G | `## Part G — publish (publish cut)` | `:316-383` (G10 at :347 is an H3) | G1, G2, G3, G8 | Inside :993-1462, the Part G fields after :1076 |
| Y | `## Part Y — Export's Current view after the map moves by itself: the numbers in the dialog's Row scope, and the wording of the new strings (export-current-view-after-unreported-fit)` | `:1864-1875` | Y0–Y4 | :1876-1888 |
| AC | `## Part AC — the attributes of the inspected feature, colour by a column, and the table in Activity: …` (copy the full line at :1978 by script) | `:1978-1999` | AC0–AC12 | :2000-2020 |

- Part K's row K2 (`:749`) is the re-arm recipe that L's preamble points to. It is referenced only, not walked.
- Part F's F7 (`:279`) was #244's row; see task 5.

**(b) Count.** 33: A 5, L 3, G 4, Y 5, AC 13, entry 79 1, W1/W2 2.

**(c) Have ready.**
- `100k-happy-path.parquet` (`:146`).
- `polygons-100k.parquet` under `target/fixtures/slice-budgets/`, with the regenerate command at `:741-742`.
- `filter-zoned.parquet` and `slow-filter-scan.parquet` (Part E's table, `:240-241`).
- `attributes-multitype.parquet` (generator at `:1982`).
- A destination under `C:\dev\spatial-ide\target\` (G2, AC5).
- `renderer/bundle-viewer/dist` built (`:286-289`) for AC5's serve.
- DevTools in the dev build for Part L's re-arm.
- For AC11, a real parcel file with many columns. For AC12, a file whose attribute data passes 268,435,456 bytes, which the human brings (`:1982`).

**(d) Strings.**

- **The Extent row (OPEN-4), seen at A3.**
  - `frontends/shell/src/admission/DescribeSummary.tsx:52-53 @ ad2088a8`. It renders as (copied, joined): `not established at open — the canvas fits to features as they stream in (a dataset-extent operation is not part of this build)`.
  - Where it shows: the Inspector's Source section. It is unmarked.
  - Whose: not the human's. The comment at :16-19 names the architect review. The human placed it on this P6 sight (the third message of 2026-11-12, item 3(c)).
  - Clause check:
    - "not established at open": true (WorkingCanvas.tsx:1572-1573).
    - "fits to features as they stream in": **untrue**.
      - The camera fits once, to the first batch that carries geometry (WorkingCanvas.tsx:1582-1591), and not to later batches.
      - A reopened project whose saved view applies does not fit at all: App.tsx:1688-1696 and WorkingCanvas.tsx:1646-1650 (`hasAutoFitRef.current = true`). That is ordinary use, Part AD's AD2.
  - **Finding. Replacement words:** `not established at open — the map fits itself to the first features that arrive after an open, and again after an Apply or a Clear; a reopened project shows the view it was saved with, when that view applies (a dataset-extent operation is not part of this build)`
  - Clause check of the replacement:
    - "first features that arrive after an open": true, a new canvas per open (App.tsx:1684-1686) starts with the flag false (WorkingCanvas.tsx:1017) and fits at :1582-1591.
    - "again after an Apply or a Clear": true, reissueUnrestricted resets the fit (candidateArmSession.ts:1745).
    - "shows the view it was saved with": true (App.tsx:1688-1696; WorkingCanvas.tsx:1646-1650).
    - "when that view applies": true, VIEW_NOT_APPLIED exists for the other case (reopenNotices.ts:88).
  - A3's expected outcome (`:162`) quotes the start of the row, which stays.
- **A7 (`:166`).** This is walkthrough row text, a draft, not a string. It carries no `[CHANGED …]` marker. Nothing to answer beyond the row.
- **L5's string 6.** `frontends/shell/src/residency/residencyStatus.ts:442-443 @ ad2088a8`, copied: `Filling has finished for this view — some areas were not loaded; pan or zoom to load them.` Ruled 2026-09-05/06, so it is the human's. L5's cites now name functions, not lines, so D1 is fixed.
- **L2's text.** `residencyStatus.ts:463 @ ad2088a8`, copied: `Filling stopped — showing ${residentFeatureCount} features already loaded; the rest of this view was not loaded.` Ruled, the human's.
- **W1.** `residencyStatus.ts:452 @ ad2088a8`, copied: `The data for the map failed to load. Open the file again to retry.`
- **W2.** `residencyStatus.ts:459 @ ad2088a8`, copied: `The data for this view failed to load. Pan or zoom to retry.`
  - Both show in the status line. Both are the advisor's (ADV-2026-11-16-13).
  - Clause check: I rest on their source comments (:444-451, :453-458) and PR 330's gates. I did not trace the emission myself. The comments name two not-covered cases under §31: no e2e reaches either without a fault injector, and a timing case inside one round trip.
  - For sight as their text from the source.
- **G3, the Style hash entry.**
  - `frontends/shell/src/publish/PublishDialog.tsx:250-251 @ ad2088a8` (dt `Style hash`).
  - G3's row says the dialog names the style by its hash alone. That is true: the field list at :245-266 has no colour, opacity or outline field.
  - The row text is the advisor's wording (`:335`).
- **W-N.** `frontends/shell/src-tauri/src/publish.rs:324 @ ad2088a8`, copied: `Columns published: id and the geometry only.`
- **W-A.** `publish.rs:327 @ ad2088a8`, copied: `Columns published: id, the geometry, and {}.` (names joined by `, ` at :328), seen at AC5.
  - Both are the human's words by approval: the third message of 2026-11-12, item 4(b); the doc comment at :313-321.
  - Clause check: names come in the given order with no cap. A name holding `, ` reads as more than one name. That is named at :320-321 and in KNOWN-LIMITATIONS item 66.
- **G3, the expiry sentence.**
  - `frontends/shell/src/publish/PublishDialog.tsx:16-17 @ ad2088a8`, copied: `This approval expires after ${APPROVAL_EXPIRY_MINUTES} minutes, and the publish then has to be started over.` with `APPROVAL_EXPIRY_MINUTES = 10`.
  - Rendered in the confirming view only (:286). It is unmarked, and its comment calls it a P6 placeholder (:9-15). Not the human's.
  - Clause check:
    - "10 minutes": true, `PENDING_ATTEMPT_TTL` is 600 s (publish.rs:69), and the grant has the same lifetime (:62-68). The clock starts at prepare, which the comment names.
    - "started over": true, PublishPanel.tsx:305-311 ends with `— start over` (copied).
- **G8.** N1's sentence, under its condition.
- **Y4.**
  - `frontends/shell/src/publish/PublishPanel.tsx:70-71 @ ad2088a8`, copied: `Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.` G1's row (`:333`) calls these the human's words. I did not read their source comment.
  - The Row scope sentence, `publish.rs:147-148 @ ad2088a8`, rendered (copied, joined): `row scope: the map's extent when Export interactive map… was clicked (xmin {}, ymin {}, xmax {}, ymax {}) — not the whole file`. The form's draft, unmarked. Not clause-checked by me.
- **AC.**
  - The strings that the AC rows' notes name (:1989, :1991-1994, :1996) are for sight as their text. I did not clause-check them; they rest on PR A, B and C's gates.
  - AC10's two coverage-loss texts were checked under N7 and N8: `HoverReadoutView.tsx:42-43` and `FeatureTab.tsx:111` @ ad2088a8.
- **Entry 79, acceptance only.**
  - The node is `governance/PLAN.yaml:1223 @ ad2088a8` (ready). It says item 2 was built by PR A (#246) as the Feature tab's Attributes section. Under ADV-2026-11-16-20 item 2 it stays at the v0.2 sitting needing only the human's acceptance. What stays for B1's close is ADR-023's Amendment 2026-09-29 (`docs/adr/ADR-023-attribute-projection-on-viewport-query.md:163 @ ad2088a8`, Proposed).
  - **Placed here, after AC1, AC2 and AC9.** Those rows show the built surface (AC1, AC2) and the hover that does not carry attributes (AC9). Milestone 4 built it.

**(e) Questions.**
1. A3: the replacement words / your own words / as it stands.
2. A7: did Zoom to layer frame what the row says? (yes / no)
3. L1: which sentence spoke at the settle; your felt reference. (free text)
4. L2: did the stop read as obeyed, and the wording as honest? (yes / no)
5. L5, entry 48: (i) the 2026-09-07 sighting discharges the re-check / (ii) the re-run at fine, recorded. Also: did the canvas fill to the edges, or stop with space left?
6. G3 JUDGE: is the scope complete and readable? (yes / no) Then the Style hash entry, W-N and the expiry sentence, each: stands / your wording.
7. G8, Y2 felt, Y4 strings: stands / your wording.
8. AC1–AC12: each row's felt question as written. AC10: each string stands / your wording.
9. W1, W2: stand / your wording.
10. Entry 79, typed (red line): (1) accept item 2 as built in the Feature tab: yes / no. (2) Accept ADR-023's Amendment 2026-09-29: yes / no.

---

## Block (iv). The felt verdicts

**(a) Copy.**
- Part P (points): heading copied `## Part P — points: the P-1 fixture, the pick rule, and the wording of the new strings (geometry-points-cut)`, `frontends/shell/MANUAL-WALKTHROUGH.md:1622-1658 @ ad2088a8`. Rows P1 and P2 here, the rest in (vi).
- Part T: heading copied `## Part T — lines: the L-1 and ML-1 fixtures, the pick tolerance, the casing, and the wording of the new strings (geometry-lines-cut)`, `:1680-1710`. Rows T1, T2 and T4 here.
- Entry 95 has no row. Pan as A5 does (`:164`).

**(b) Count.** 6.

**(c) Have ready.** `point-p1.parquet` and `point-pile.parquet` (generator at `:1630`), `line-l1.parquet` (`:1686`), and `100k-happy-path.parquet`.

**(d) Strings.** None. P2's verdict line is at `:1646`, and its result field at `:1669`. T2 and T4's result fields are at `:1721` and `:1724`.

**(e) Questions.**
1. P2 (the queue's "P4" is the human's word and stays): is naming the topmost symbol of a pile acceptable? (acceptable / not acceptable / no pile available) If not, question round 62 item 4's option (B) follows.
2. T2: which id is named at the crossing, and is naming the topmost of two crossing lines acceptable? (acceptable / not)
3. T4: is 2 px the width you want? (yes / the width wanted) Does the casing look right at the default opacity? (yes / no)
4. Entry 95, in round 1's sense of candidate 2, the press-point anchor (`state/questions/round-1.md:6-9 @ ad2088a8`): (1) pursue the press-point anchor / (3) accept it and close entry 95.

---

## Block (v). Item 4's list

The proposed split of every marked string into two sets goes here (ADV-2026-11-21-16 item 4(b)). Another agent prepares it.

---

## Block (vi). Every other Part and sight of the queue

**(a) Copy.** Each Part from its heading to the line before its `## Result log`:

| Part | Heading line | Range | Rows | Result log |
|---|---|---|---|---|
| P (points) | :1622 | `frontends/shell/MANUAL-WALKTHROUGH.md:1622-1658 @ ad2088a8` | P3–P7. P7 is read with the dated note at :1676 (D7). | :1659-1679 |
| P (degrees) | :1463 | `:1463-1492` | P1 only, as the 2026-10-23 report recommended | :1493-1503 |
| T | :1680 | `:1680-1710` | T3, T5, T6 | :1711-1727 |
| W | `## Part W — selection and scope: …` :1821 | `:1821-1841` | W0–W11, W8a and W10a | :1842-1863 |
| V | :1776 | `:1776-1788` | V1 (set-up), V2 and V3 (changed) | :1789-1803 |
| Z | :1889 | `:1889-1900` | Z0–Z4 | :1901-1909 |
| AA | :1910 | `:1910-1921` | AA0–AA4 | :1922-1934 |
| AB | :1935 | `:1935-1956` | AB0–AB11 and AB4a | :1957-1977 |
| R | :1543 | `:1543-1563` | R1 | :1564-1575 |

Copy each heading line by script.

**(b) Count.** 52, counting item 40 and the Reset line as one row each.

**(c) Have ready.**
- The fixtures at `:1630-1641` and `:1686-1694`, with corpus #2, #4 and #5 verified against MANIFEST.json (`:1631`).
- Part P (degrees)'s corpus #8.
- `multipolygon-f1.parquet` (W10).
- A window at 1366 × 768 through DevTools' device toolbar (Part U's U1, `:1738`), for W and AB. Z4 needs 1024 × 640.
- Narrator (Z3) and Task Manager (AA3).
- For R1, the Before list copied at `:1547-1552`: `npx tauri build --debug --no-bundle`, the executable run directly, Part H's 5 GB fixture, the 100k fixture, `cargo build -p spatial-kernel --bin publish-bundle`, and hidden items shown.

**(d) Strings.**

- **Item 40 whole.**
  - `KNOWN-LIMITATIONS.md:434-435 @ ad2088a8`, heading copied: `**A selection ends when its dataset is reopened or its source changes, and it is never saved.**`
  - Whose: draft, not the human's (comment at :436).
  - Clause check at ad2088a8:
    - "and why": now true for coverage loss too, through ENDED_BECAUSE (`FeatureTab.tsx:109-113`).
    - "never saved": true; a save writes no selection (`saveProject.ts:36`, :81-89).
    - The rest stands as checked on 2026-10-23.
  - Holds.
- **The Reset line.**
  - `frontends/shell/src/console/surfaceRegistry.ts:219-220 @ ad2088a8`. It renders as (copied, joined): `[P6 placeholder] no API equivalent exists -- Reset to default found the style already at the default, so nothing changed and no step was sent to the session history.`
  - Where it shows: the Console row `style.resetToDefault`. Drafted by the 1b form's Amendment 8 item 2; not the human's.
  - Clause check: written only for a Reset with no transitions (App.tsx:2127-2131). A reopen sets the baseline (App.tsx:1234), so a restored style is not read as default. True.
  - Reach it this way: open a file at the default style, click Reset to default, and read the Console (Ctrl+J).
- **O3 and its counterpart.** See N5. Read at the source.
- **KNOWN-LIMITATIONS items 37 and 38.** `KNOWN-LIMITATIONS.md:421-427 @ ad2088a8`, read at T6(e). Drafts. Checked true at c715c96b; not re-checked at ad2088a8 (task 5).
- **The mixed-kind placeholders.** Read at P7(b) and T6(b). Not re-read at ad2088a8 (task 5).
- **W11's strings, including N2 and N3.** The late-cancel statements are the human's (Amendment 8 item 1).
- **AB11's strings, including N4.**

**(e) Questions.**
- Each row's felt question as written: W2, W3, W4, W8, W8a; V5 if V is walked whole; Z1; AA2; AB2, AB3, AB4, AB4a, AB9; P1; P3 (the 4 px radius).
- P7, T6, W11, AB11: for each string, keep / your wording.
- Item 40: stands / your wording.
- The Reset line: stands / your wording.
- R1: (i) to (v) as recorded. Accepting its result is the human's red line (`governance/PLAN.yaml:4030 @ ad2088a8`).

---

## Task 2. Everything accounted for

From the queue's history (`governance/PLAN.yaml:5995 @ ad2088a8`), each item once:

- **L1, L2, L5** go to (iii) Part L, at `frontends/shell/MANUAL-WALKTHROUGH.md:821`, `:822`, `:825 @ ad2088a8`. Each is marked `[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]` (copied).
- **A7** goes to (iii) Part A, `:166`.
- **W1 and W2** go to (iii), from the source (`residencyStatus.ts:452`, `:459`).
- **W10**, the S5 line, goes to (i) AD1 (`saveProject.ts:29`).
- **G3's Style hash entry** goes to (iii) G3, `:335`.
- **OPEN-P2's W-N** goes to (iii) G3 (`publish.rs:324`). **W-A** goes to (iii) AC5 (`:1991`, `publish.rs:327`).
- **OPEN-4's Extent row** goes to (iii) A3 (`DescribeSummary.tsx:52-53`). It is a finding.
- **Part L re-copied, and B7's L5 note** go to (iii) Part L, preamble at `:810`.
- **AC6 to AC8** go to (iii) Part AC, `:1992-1994`.
- **The publish dialog's expiry sentence** goes to (iii) G3 (`PublishDialog.tsx:16-17`).
- **The 2026-10-23 script:**
  - N1–N7 go to (ii).
  - D1 no longer applies: fixed, L5 names functions at `:825`.
  - D2 no longer applies: fixed (#274).
  - D3 and D4 go to (iv). D5 goes to (vi) and (iv). D6 goes to (ii) OPEN-5 and (iii) G3. D7 goes to (vi) P7.
- **The original list:**
  - Parts P and T go to (iv) and (vi).
  - Part W, W11 included, goes to (vi). The filter-scope sentence goes to (ii) N1 and (iii) G8.
  - Part Y with Y4 goes to (iii).
  - Parts Z and AA go to (vi).
  - Item 40 goes to (vi). The Reset line goes to (vi). O3 and its counterpart go to (ii) N5.
  - Items 37 and 38 go to (vi) T6(e). The mixed-kind placeholders go to (vi).
  - The T4 verdict and the P2 ("P4") verdict go to (iv).
  - Entry 95 goes to (iv). Entry 48 goes to (iii) L5.
  - Part AB goes to (vi).

Not on the node but owed:
- **Part V's V2 and V3**, which the first-look form's Amendment 3 item 9 joins (`governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md:550 @ ad2088a8`). They go to (vi). This is a record finding, below.
- **N8, OPEN-3, OPEN-5** go to (ii).
- **Entry 79** goes to (iii).
- **Part AD and its 37 strings** go to (i).
- **R1** (`governance/PLAN.yaml:4015 @ ad2088a8`, needs a sitting) goes to (vi).

No longer applies:
- **#244's F7 rows.** The node is done (`governance/PLAN.yaml:4814 @ ad2088a8`), and F7 now points at Part G (`:279`). Whether its D1 (i)/(ii) yes-or-no was given: task 5.
- **#241's R2.** The node is done, merged on the human's click (`governance/PLAN.yaml:5849 @ ad2088a8`).
- **L7 and L8 (entry 47)** passed on 2026-09-14 (`:1425`).
- **N7 and N8's untruth** is superseded by PR B; the texts are seen at AC10.
- **Part N** was operator-verified (`:1455`).
- **m13-bracketed-values** is blocked on the release build (`governance/PLAN.yaml:1241`).
- **briefb-part-o-walkthrough** is proposed, after B3 (`:1922`).
- **governance-e-readings** is not a walkthrough row (`:6320`).

Rows changed since c68245c4 and in the queue for that reason, all `frontends/shell/MANUAL-WALKTHROUGH.md @ ad2088a8`:
- L1 :821, L2 :822, L5 :825, A7 :166.
- V2 :1783, V3 :1784.
- G3 :335 (the Style hash entry, the columns line, the expiry sentence).
- G8 :340.
- AC6 :1992, AC7 :1993, AC8 :1994. AC5 :1991 carries W-A.
- W1 and W2 are not rows: they are `residencyStatus.ts:452` and `:459`.
- W10 is `saveProject.ts:29`, seen at AD1 :2030.
- The Extent row is `DescribeSummary.tsx:52-53`, seen at A3 :162.

---

## Task 4. Facts for the top of the script

- **The start.** The walkthrough's command is `npm run tauri dev`, run from `frontends/shell` (`frontends/shell/MANUAL-WALKTHROUGH.md:134-138 @ ad2088a8`; also A1 :160 and U1 :1738). The dev server binds localhost:5180. The walkthrough gives no command from the repository root. The custodian words the one line, and the tester's single start under item 7 proves it.
- **Installed first** (CLAUDE.md, Environment): Rust stable (MSVC), VS Build Tools with Desktop development with C++, Node 24 LTS, WebView2, and clang-cl on PATH.
- **Built first:**
  - The fixtures: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture` (`:140`), plus each Part's named generators.
  - `renderer/bundle-viewer` built with `npm run build` for any publish (`:286-289`).
  - `publish-bundle.exe` for R1 (`:1551`).
  - R1 alone uses `npx tauri build --debug --no-bundle` (`:1549`).
- **Where answers go.** Each Part's own `## Result log`, which the walkthrough opens with "Fill in after running the rows above" (for example `:1605`, `:2038`).
  - Parts A, G and L log inside the A–N result log at `:993-1462`.
  - N1–N8, OPEN-3, OPEN-5, entry 79, entry 95, W1/W2, the Extent row, item 40 and the Reset line have no field in the walkthrough.
- **Not in the repository:**
  - A signed-in OneDrive with Files On-Demand, which needs the network (AD1–AD5).
  - A file over 268,435,456 bytes of attribute data (AC12) and a real parcel file with many columns (AC11).
  - Part H's 5 GB fixture on disk (R1).
  - Real keys and a real mouse (W2, W10a, AB1, AB7).
  - Narrator (Z3).
  - No second machine: AD5 is a second start on the same machine.

## Task 5. What I could not settle

1. **Where L1, L2 and L5's new results are written.** Part L's log is inside `:993-1462` and has no blank field for them. The custodian settles it, by a field added to the script.
2. **Whether `Opening…` and `Open cancelled` (AdmissionPanel.tsx:172, :241) are anyone's settled words.** They are unmarked and not among the 37. Reading their source comments settles it.
3. **The 26 reopen strings not clause-checked by me.** They rest on PR 341's gates. A clause read of `openProject.ts` against each settles it.
4. **Items 37 and 38, MIXED_KINDS_DRAFT, the AC strings and Y4's row-scope sentence were not re-checked at ad2088a8.** A clause read at ad2088a8 settles it.
5. **N6's parenthesis is a format fact, not a code fact.** The WKB specification settles it.
6. **#244's D1 (i)/(ii) yes-or-no and #241's R2 record.** I found no record of either. Reading #244's and #241's closing amendments settles it.
7. **Whether Parts Q, S, U and X, and row A7a, are owed.** Their logs are blank, but they are not on the queue. Their nodes' closing records settle it.
8. **Whether Part P (degrees) P1 and Part V are owed whole.** The queue does not name them by those words. The custodian's reading, or the human's word, settles it.
9. **The one root command, and whether the checkout's node_modules are installed** (the walkthrough names no `npm ci`). The tester's item-7 start settles both.
10. **Colour by's refit.** AC12 says the view refits, which I did not trace to the reset line, so the Extent replacement words omit it. Tracing App.tsx:2137 to `reissueUnrestricted` settles it.

**Record findings** (documentation; fix in the records before the script is relied on):
- (R1) `operator-sitting-queue` (`governance/PLAN.yaml:5995 @ ad2088a8`) lacks Part V's V2 and V3, which `OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md:550 @ ad2088a8` says join it. Add them.
- (R2) Part AD's sight notes name 11 of ADV-2026-11-21-14's 37 strings, while item 8 places all 37 in Part AD. The script lists the other 26 for sight from the source, as block (i) does.

**Wording findings** (untrue in ordinary use; words given above, the human answers each):
- The Extent row (not the human's; the app shows it, so it is under P6).
- N2, N3, N4, N6 (P6 placeholders).
- N5 (the human's wording).

No string changes before the sitting.
