# The sitting script for Tuesday 2026-11-24: the operator sitting queue, assembled (draft, 2026-11-21)

*The custodian's draft, on the advisor's ruling ADV-2026-11-21-16 items 2 to 4, under the human's delegation of 2026-11-13 and not the human's words. Assembled at main ad2088a8b3e57a900eca2d732799aa740d06e369, which holds P6's first group (PR 346, merged at that commit). Section 3 is the architect's report, byte for byte (38594 bytes, sha256 1ae072bb62937488b490c4c63fb8b2fcc5f4882dd90205215b1321bdb5aff867); section 4 is the standard worker's split of the marked strings, byte for byte (58861 bytes, sha256 e3e73fb5916503a04fad3583f8f422be83bbcb82e6891f7c408a4205dedaeb4a); section 5 holds the Parts, byte-copied by script from the walkthrough at that commit. No string changes before the sitting (the ruling's item 4 (c)), and from this script's commit on main until the sitting nothing merges that changes a shown string, a walkthrough row or behaviour (its item 6).*

# 1. Before you start

**What to have ready.**
- The fixtures, made once from the repository root with: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`. The Parts name a few more generators where a row needs them (the Have ready lines of section 3).
- For Part AD: OneDrive signed in on this laptop, with Files On-Demand on, and three empty folders inside your OneDrive folder (one for the project, one for AD2 and AD3, one for AD5). File Explorer open for AD2 to AD4. AD5 starts the app a second time while the first is running, on this same laptop.
- For the publish rows (Parts G and AC): the bundle viewer built once with `npm --prefix renderer/bundle-viewer run build`, and a destination folder under `C:\dev\spatial-ide\target\`.
- For AC11 and AC12: a real parcel file with many columns, and a file whose attribute data is over 268,435,456 bytes. These are yours to bring; they are not in the repository.
- For Parts W and AB: a window of 1366 by 768, set with DevTools' device toolbar; Z4 needs 1024 by 640. Narrator for Z3, Task Manager for AA3.
- For R1 alone: its own Before list (Part R), which uses a debug build and Part H's 5 GB fixture.

**Starting the app.** From the repository root: `npm --prefix frontends/shell run tauri dev`. If the shell's packages are not installed yet, run `npm --prefix frontends/shell ci` and `npm --prefix renderer/bundle-viewer ci` once first. The app opens its own window; close it to stop.

**Where you type an answer.** In the custodian's session, as a message, each answer led by its row or item id (for example: AD3: cancelled before the file came back). Answers on wording (N1 to N8, the Extent row, the 37 strings, OPEN-3, OPEN-5, entry 79, R1 and the split) are yours to type in your own words or as yes, or as accepted as it stands. The custodian files your messages as you typed them and writes the walkthrough's result logs from them.

# 2. The order, with rows and minutes

| Block | What | Rows | Minutes |
|---|---|---|---|
| (i) | Part AD, the reopen: save into a OneDrive folder, open again, the question, a second window; then the 37 strings of the reopen | 6 rows and the 37 strings | 40 |
| (ii) | N1 to N8, the wording answers, with OPEN-3 and OPEN-5 | 10 answers | 20 |
| (iii) | The hero path and milestone 4: Parts A, L, G, Y and AC, entry 79, W1 and W2 | 33 rows or answers | 80 |
| (iv) | The felt verdicts: P1, P2, T1, T2, T4 and entry 95 | 6 | 15 |
| (v) | The proposed split of the marked strings into set A and set B (section 4) | 1 answer: accept, or move strings by number | 15 |
| (vi) | Every other Part and sight: Parts P, T, W, V, Z, AA, AB and R, item 40 and the Reset line | 52 | 110 |
| | Total | | 280 |

The minutes are the custodian's estimate. The blocks run in this order (the ruling's item 3). Each block's content (what to copy, what to have ready, the strings with their clause checks, and the questions) is in section 3 under the same number, and its Parts are in section 5.

**The custodian's notes on section 3.**
- Its task 5 item 1: L1, L2 and L5 have no blank field in the walkthrough; type them in the session like the rest, and the custodian adds them to Part L's log.
- Its task 5 item 2: `Opening…` and `Open cancelled` carry no mark, and their source comment names no one's wording; they are for sight only.
- Its task 5 item 9: the start command above is the one a tester runs once before the sitting (the ruling's item 7); its result is filed before the sitting.
- Its record finding R1 (Part V's V2 and V3 join the queue) is carried in block (vi); the queue's node is amended in the records.

# 3. The strings, the sights and the verdicts (the architect's report, byte for byte)

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

# 4. Block (v): the proposed split of the marked strings (the standard worker's report, byte for byte)

The split proposed under the ruling's item 4 (b): set A, a string shown while a user opens, filters, styles or publishes a file, or one a form of piece 1c or milestone 4 built; set B, every other marked string; a string not placed goes to set A. After the sitting, set A loses its marks in groups and set B keeps them, with one KNOWN-LIMITATIONS line (item 4 (c)). Accept the split as it stands, or move strings by their number in the table.

Split: 187 marked strings at ad2088a8, 152 in set A, 35 in set B, 21 not placed (the 21 are inside the 152).

DEPARTURES and caveats that touch the table (read before the table):
1. The "symbol" column is a script heuristic: the nearest preceding const/fn/class/id on the same or up to 14 (TS) or 40 (Rust) earlier lines, "-" when none. It is NOT verified; some are wrong (e.g. rows 5-6 "str", row 16 "P_FILTER", row 41 "code" where the real symbol is buildSessionEndedOwnerDetail, rows 134-139 "filtered"). Treat the path:line as authoritative.
2. In the text column, backticks inside the source line were replaced by apostrophes, because the cell is wrapped in backticks. Text is the trimmed source line (so JSX lines start with `<dt>` etc.). Row 133 (tableSource.ts:52) is the line holding the mark, but its first 80 characters stop before the mark.
3. "built by" paths are relative to governance/forms/. For the three engine/ and kernel/ rows that list two or three forms (rows 5-6, 17-38), I list every candidate form named by the inventory rather than pinning one. "built by" for each was chosen by the inventory's column 5 plus `git blame` of the line's commit subject (<S>/spl-blame.tsv); only milestone 4's form was also searched by symbol. No string is reasoned as built by the 1c form or the second-open form: the 37 strings of ADV-2026-11-21-14 were the 1c strings, so reason "1c" never occurs in the table.
4. Placement of "shows" is my reading of the inventory's column 3 and the source, not a run of the app. Set A "m4" is set from the blame commit (milestone 4 PR A/B/C and its session-end phase), not from wording.
5. The split mark the inventory found at canvas/decodeBatch.ts:76-77 is "a P6 / placeholder" in a comment, with no bracket: it is not a bracketed mark and not a string. My cross-line detector found exactly that one (and no bracketed mark split across lines).
6. Marks in git-tracked .md files (e.g. the walkthrough, 16 lines) and in test/e2e files are left out as the inventory leaves them out. Comment-only marks (9 lines: error.rs:422, geoarrow.rs:135 and 158, stream.rs:2594, publish.rs:72, App.tsx:749, publish/types.ts:122, terminalShapes.ts:37, skp.rs:1559) are Section B of the inventory and not rows. 16 more bracketed lines sit inside `#[cfg(test)]` modules (wkb.rs x8, publish.rs x3, skp.rs x5), excluded as Section D excludes them (list: <S>/spl-cfgtest.tsv).

START STATE
`git -C C:/dev/wt/sit rev-parse HEAD` printed ad2088a8b3e57a900eca2d732799aa740d06e369; `git status --porcelain` printed nothing (re-checked at the end: 0 lines). No file outside <S> written; scripts are `<S>/spl-grep.mjs` (step 1), `spl-blame.mjs`, `spl-table.mjs`, helper fixers `spl-fix*.mjs`; outputs `spl-marks.tsv`, `spl-cfgtest.tsv`, `spl-blame.tsv`, `spl-table.md`. No background process left.

RECONCILIATION (step 2)
- Marks at ad2088a8 (bracketed `[P6 placeholder]`, tracked non-test, non-.md files under frontends, engine, kernel, protocol, cfg(test) lines excluded): 196 lines = 187 string rows + 9 comment marks.
- Inventory Section A rows matched: 187 = 137 of part 1 (173 rows in part 1 minus 36) + 50 of part 2 (51 rows minus 1). Matched per file and symbol/line; per-file counts equal the inventory's Section D counts for every remaining file (checked by script output spl-class.out against the Section D lists).
- Marks at ad2088a8 with no inventory row: none.
- Inventory rows with no mark at ad2088a8: 37, exactly the reopen's strings of ADV-2026-11-21-14: project/reopenNotices.ts 24, project/saveProject.ts 8, layout/actionRegistry.ts 2 (project.save, project.open), admission/AdmissionPanel.tsx 2, src-tauri/src/commands.rs 1 (PROJECT_FOLDER_PICKER_TITLE). `git -C C:/dev/wt/sit log --oneline -1 -- <path>`: reopenNotices.ts, saveProject.ts, actionRegistry.ts -> 13e1a7e9 (docs: the reviewer's words for three comments of P6's first group); AdmissionPanel.tsx and commands.rs -> b42ccb3e (feat: the reopen's 37 strings without the P6 mark). The 37 are in set A and not tabled, as the brief says.
- Caller/imagined-interface note: read-only task, nothing landed.

TABLE (step 4, byte for byte from <S>/spl-table.md; paths in "built by" are under governance/forms/)

| # | set | reason | path:line @ ad2088a8 | symbol | text (the first 80 characters as the source has them, then …) | built by | shows |
|---|---|---|---|---|---|---|---|
| 1 | A | not placed | engine/src/error.rs:427 @ ad2088a8 | - | `"[P6 placeholder] refused: the advisory watch on this source lost coverage ({det…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | refusal text for a lost source watch; surfaces at any step after open |
| 2 | A | open | engine/src/geoarrow.rs:169 @ ad2088a8 | mixed_kinds_detail | `"[P6 placeholder] {}",` | engine/GEOMETRY-POINTS-PREREGISTRATION.md | open refusal: a geometry_types set mixing kinds |
| 3 | A | open | engine/src/geoparquet.rs:415 @ ad2088a8 | - | `"[P6 placeholder] 'geo.columns.*.geometry_types' member {i} is not \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | open refusal: malformed geometry_types metadata |
| 4 | A | open | engine/src/geoparquet.rs:425 @ ad2088a8 | - | `"[P6 placeholder] 'geo.columns.*.geometry_types' is not a list".into(),` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | open refusal: malformed geometry_types metadata |
| 5 | A | filter | engine/src/predicate.rs:1446 @ ad2088a8 | str | `"[P6 placeholder] an operand of text or BOOLEAN type beside NULL or beside an \` | engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md; engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md | filter refusal: type not admitted |
| 6 | A | filter | engine/src/predicate.rs:1450 @ ad2088a8 | str | `"[P6 placeholder] a conversion between a float type and an integer or decimal ty…` | engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md; engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md | filter refusal: type not admitted |
| 7 | A | filter | engine/src/stream.rs:2596 @ ad2088a8 | OUT_OF_RANGE_DETAIL | `const OUT_OF_RANGE_DETAIL: &str = "[P6 placeholder] a value computed while this …` | engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md | query terminal detail: value out of range |
| 8 | A | open | engine/src/watch.rs:93 @ ad2088a8 | arm | `"[P6 placeholder] this platform is not Windows; the advisory source-change \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 9 | A | open | engine/src/watch.rs:524 @ ad2088a8 | await_first_read | `format!("[P6 placeholder] could not arm the {which} directory watch: {e}")` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 10 | A | open | engine/src/watch.rs:531 @ ad2088a8 | await_first_read | `"[P6 placeholder] could not arm the {which} directory watch: the watch thread \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 11 | A | open | engine/src/watch.rs:579 @ ad2088a8 | spawn_watch_thread | `"[P6 placeholder] could not spawn the {which} watch thread: {e}"` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 12 | A | open | engine/src/watch.rs:609 @ ad2088a8 | arm | `reason: format!("[P6 placeholder] could not canonicalize the source path: {e}"),` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 13 | A | open | engine/src/watch.rs:615 @ ad2088a8 | arm | `reason: "[P6 placeholder] the source's canonicalized path has no parent director…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 14 | A | open | engine/src/watch.rs:621 @ ad2088a8 | arm | `reason: "[P6 placeholder] the source's canonicalized path carries no file name"` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 15 | A | open | engine/src/watch.rs:632 @ ad2088a8 | arm | `"[P6 placeholder] could not open the parent directory to watch it: {e}"` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 16 | A | open | engine/src/watch.rs:689 @ ad2088a8 | P_FILTER | `"[P6 placeholder] could not open the grandparent directory to \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | source-watch reason in the describe summary shown at open |
| 17 | A | open | engine/src/wkb.rs:93 @ ad2088a8 | push_wkb | `"[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 18 | A | open | engine/src/wkb.rs:193 @ ad2088a8 | push_wkb | `"[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 19 | A | open | engine/src/wkb.rs:204 @ ad2088a8 | push_wkb | `"[P6 placeholder] MultiPolygon with zero parts".into(),` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 20 | A | open | engine/src/wkb.rs:214 @ ad2088a8 | push_wkb | `"[P6 placeholder] MultiPolygon part {part} carries EWKB flags \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 21 | A | open | engine/src/wkb.rs:221 @ ad2088a8 | push_wkb | `"[P6 placeholder] MultiPolygon part {part} has WKB geometry type \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 22 | A | open | engine/src/wkb.rs:230 @ ad2088a8 | - | `"[P6 placeholder] WKB geometry type {other} met; this open's encoding, \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 23 | A | open | engine/src/wkb.rs:239 @ ad2088a8 | - | `"[P6 placeholder] {} trailing bytes after the geometry",` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 24 | A | open | engine/src/wkb.rs:252 @ ad2088a8 | push_part | `"[P6 placeholder] MultiPolygon part {part} has zero rings"` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 25 | A | open | engine/src/wkb.rs:288 @ ad2088a8 | push_wkb | `"[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 26 | A | open | engine/src/wkb.rs:295 @ ad2088a8 | push_wkb | `"[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 27 | A | open | engine/src/wkb.rs:303 @ ad2088a8 | push_wkb | `"[P6 placeholder] a Point with a NaN coordinate (WKB's empty Point) was met".int…` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 28 | A | open | engine/src/wkb.rs:308 @ ad2088a8 | push_wkb | `"[P6 placeholder] {} trailing bytes after the point",` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 29 | A | open | engine/src/wkb.rs:327 @ ad2088a8 | read_line | `"[P6 placeholder] {what} has {n_pts} positions; a line needs at least 2"` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 30 | A | open | engine/src/wkb.rs:380 @ ad2088a8 | decode | `"[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 31 | A | open | engine/src/wkb.rs:387 @ ad2088a8 | decode | `"[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 32 | A | open | engine/src/wkb.rs:394 @ ad2088a8 | decode | `"[P6 placeholder] {} trailing bytes after the linestring",` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 33 | A | open | engine/src/wkb.rs:453 @ ad2088a8 | decode | `"[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 34 | A | open | engine/src/wkb.rs:464 @ ad2088a8 | decode | `"[P6 placeholder] MultiLineString with zero parts".into(),` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 35 | A | open | engine/src/wkb.rs:474 @ ad2088a8 | decode | `"[P6 placeholder] MultiLineString part {part} carries EWKB flags \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 36 | A | open | engine/src/wkb.rs:481 @ ad2088a8 | decode | `"[P6 placeholder] MultiLineString part {part} has WKB geometry type \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 37 | A | open | engine/src/wkb.rs:490 @ ad2088a8 | - | `"[P6 placeholder] WKB geometry type {other} met; this open's encoding, \` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 38 | A | open | engine/src/wkb.rs:498 @ ad2088a8 | - | `"[P6 placeholder] {} trailing bytes after the geometry",` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md; engine/GEOMETRY-POINTS-PREREGISTRATION.md; engine/GEOMETRY-LINES-PREREGISTRATION.md | row-decode refusal that stops the stream of the opened file |
| 39 | A | publish | frontends/shell/src-tauri/src/publish.rs:79 @ ad2088a8 | FILTER_SCOPE_SENTENCE | `"[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 \` | frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md | publish approval dialog, filter-scope block |
| 40 | A | publish | frontends/shell/src-tauri/src/publish.rs:1495 @ ad2088a8 | read_build_record | `"[P6 placeholder] the reference bundle viewer's build record could not be read a…` | kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md | export refusal: bundle viewer build record unreadable |
| 41 | A | not placed | frontends/shell/src/App.tsx:754 @ ad2088a8 | code | `return '${code}: [P6 placeholder] the advisory source watcher ended this dataset…` | not stated (blame: the source-watcher groundwork commit d90837d1) | Console/log line when the source watcher ends the session |
| 42 | A | m4 | frontends/shell/src/App.tsx:834 @ ad2088a8 | ATTRIBUTES_NOT_HELD_TEXT | `const ATTRIBUTES_NOT_HELD_TEXT = "[P6 placeholder] Some features' attributes wer…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | status item: attributes not held |
| 43 | A | open | frontends/shell/src/admission/DescribeSummary.tsx:36 @ ad2088a8 | - | `<dt>[P6 placeholder] Geometry (encoding chosen by the engine)</dt>` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | describe summary labels shown at open |
| 44 | A | open | frontends/shell/src/admission/DescribeSummary.tsx:41 @ ad2088a8 | - | `<dt>[P6 placeholder] Geometry types declared by the file</dt>` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | describe summary labels shown at open |
| 45 | A | open | frontends/shell/src/admission/DescribeSummary.tsx:88 @ ad2088a8 | - | `<dt>[P6 placeholder] Source watch</dt>` | engine/SOURCE-WATCHER-PREREGISTRATION.md | describe summary labels shown at open |
| 46 | A | open | frontends/shell/src/admission/DescribeSummary.tsx:95 @ ad2088a8 | - | `<dt>[P6 placeholder] Structural checks</dt>` | engine/SOURCE-WATCHER-PREREGISTRATION.md | describe summary labels shown at open |
| 47 | A | open | frontends/shell/src/admission/describeSummaryText.ts:81 @ ad2088a8 | checksOnlyStatusLine | `return '[P6 placeholder] checks-only — ${coverage.reason ?? "(no reason on the p…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | describe summary text shown at open |
| 48 | A | open | frontends/shell/src/admission/describeSummaryText.ts:94 @ ad2088a8 | degradedChecksLine | `return '[P6 placeholder] degraded — unestablished: ${checks.components.join(", "…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | describe summary text shown at open |
| 49 | A | open | frontends/shell/src/admission/describeSummaryText.ts:108 @ ad2088a8 | declared | `return "[P6 placeholder] the file declares no geometry_types key";` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | describe summary text shown at open |
| 50 | A | open | frontends/shell/src/admission/describeSummaryText.ts:111 @ ad2088a8 | declared | `return "[P6 placeholder] the file declares an empty geometry_types list";` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | describe summary text shown at open |
| 51 | A | not placed | frontends/shell/src/admission/formatRefusal.ts:86 @ ad2088a8 | refusalGuidance | `"[P6 placeholder] The advisory watch on this source lost coverage of it while it…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | refusal block message for lost coverage; any step after open |
| 52 | A | m4 | frontends/shell/src/attributes/values.ts:31 @ ad2088a8 | ATTRIBUTE_NULL_MARKER | `export const ATTRIBUTE_NULL_MARKER = "[P6 placeholder] NULL";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | NULL marker in the Feature and Table tabs |
| 53 | A | m4 | frontends/shell/src/attributes/values.ts:48 @ ad2088a8 | raw | `throw new Error('[P6 placeholder] attribute column of type ${String(type)} is no…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | thrown Error message (unreadable attribute type) |
| 54 | A | m4 | frontends/shell/src/canvas/HoverReadoutView.tsx:43 @ ad2088a8 | HOVER_SESSION_COVERAGE_LOST_TEXT | `"[P6 placeholder] The source watch lost coverage of the file while it was open, …` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md (session-end phase, Amendment 12 continued) | hover readout when the source watch lost coverage |
| 55 | A | open | frontends/shell/src/canvas/decodeBatch.ts:64 @ ad2088a8 | UnexpectedEncodingError | `'[P6 placeholder] batch schema names geometry encoding ${JSON.stringify(batchEnc…` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | thrown Error: batch geometry encoding mismatch |
| 56 | A | m4 | frontends/shell/src/canvas/decodeBatch.ts:86 @ ad2088a8 | UnexpectedProjectionError | `'[P6 placeholder] batch schema names attribute_columns ${declared ?? "(absent)"}…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | thrown Error: attribute projection mismatch |
| 57 | A | m4 | frontends/shell/src/canvas/decodeBatch.ts:129 @ ad2088a8 | field | `throw new Error('[P6 placeholder] attribute column ${JSON.stringify(field.name)}…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | thrown Error: attribute projection mismatch |
| 58 | A | open | frontends/shell/src/canvas/limits.ts:104 @ ad2088a8 | PickCeilingExceeded | `'[P6 placeholder] batch has ${pickOrdinalCount} pick ordinals (polygon parts, li…` | engine/GEOMETRY-LINES-PREREGISTRATION.md | thrown Error: pick ordinal ceiling exceeded (batch not rendered) |
| 59 | A | not placed | frontends/shell/src/command/CommandBar.tsx:32 @ ad2088a8 | COMMAND_UNAVAILABLE_MARK | `export const COMMAND_UNAVAILABLE_MARK = "[P6 placeholder] not available";` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 60 | A | not placed | frontends/shell/src/command/CommandBar.tsx:33 @ ad2088a8 | COMMAND_UNAVAILABLE_NOTE | `export const COMMAND_UNAVAILABLE_NOTE = "[P6 placeholder] That command is not av…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 61 | A | open | frontends/shell/src/command/CommandBar.tsx:34 @ ad2088a8 | COMMAND_BUSY_NOTE | `export const COMMAND_BUSY_NOTE = "[P6 placeholder] A file is already being opene…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note: a file is already being opened |
| 62 | A | not placed | frontends/shell/src/command/CommandBar.tsx:35 @ ad2088a8 | COMMAND_EMPTY_NOTE | `export const COMMAND_EMPTY_NOTE = "[P6 placeholder] Type a command, or ? for the…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 63 | A | not placed | frontends/shell/src/command/CommandBar.tsx:36 @ ad2088a8 | COMMAND_PICK_NOTE | `export const COMMAND_PICK_NOTE = "[P6 placeholder] Choose a command with the arr…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 64 | A | not placed | frontends/shell/src/command/CommandBar.tsx:37 @ ad2088a8 | COMMAND_UNKNOWN_NOTE | `export const COMMAND_UNKNOWN_NOTE = "[P6 placeholder] No command has that name. …` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 65 | A | not placed | frontends/shell/src/command/CommandBar.tsx:38 @ ad2088a8 | COMMAND_NONE_NOTE | `export const COMMAND_NONE_NOTE = "[P6 placeholder] Nothing matches that.";` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 66 | A | filter | frontends/shell/src/command/CommandBar.tsx:39 @ ad2088a8 | COMMAND_FILTER_EMPTY_NOTE | `export const COMMAND_FILTER_EMPTY_NOTE = "[P6 placeholder] Type a condition afte…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note for /filter |
| 67 | A | filter | frontends/shell/src/command/CommandBar.tsx:40 @ ad2088a8 | COMMAND_FIELD_NOTE | `export const COMMAND_FIELD_NOTE = "[P6 placeholder] Press Tab to put the field n…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note for /filter |
| 68 | A | filter | frontends/shell/src/command/CommandBar.tsx:41 @ ad2088a8 | commandFieldMore | `export const commandFieldMore = (hidden: number): string => '[P6 placeholder] ${…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note for /filter |
| 69 | A | not placed | frontends/shell/src/command/CommandBar.tsx:200 @ ad2088a8 | - | `aria-label="[P6 placeholder] Command bar"` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 70 | A | not placed | frontends/shell/src/command/CommandBar.tsx:201 @ ad2088a8 | - | `placeholder="[P6 placeholder] Type / for commands or ? for help"` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | command bar note, list mark, label or placeholder; shown for any command |
| 71 | A | style, m4 | frontends/shell/src/console/surfaceRegistry.ts:205 @ ad2088a8 | CLASS_C_ROWS | `"[P6 placeholder] no API equivalent exists -- Colour by is the app's own control…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for Colour by / One colour |
| 72 | A | style, m4 | frontends/shell/src/console/surfaceRegistry.ts:212 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- One colour is the app's own contro…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for Colour by / One colour |
| 73 | A | style | frontends/shell/src/console/surfaceRegistry.ts:219 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- Reset to default found the style a…` | not stated (blame: PR 222 correction round 1) | Console statement for Reset to default |
| 74 | A | filter | frontends/shell/src/console/surfaceRegistry.ts:227 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- the app did not send this filter c…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | Console statement for a filter change not sent |
| 75 | A | m4 | frontends/shell/src/console/surfaceRegistry.ts:322 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- switching the Activity region betw…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for the Table (tabs, scope, Cancel) |
| 76 | A | m4 | frontends/shell/src/console/surfaceRegistry.ts:378 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- inspecting the feature under a cli…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for inspecting the attributes of a feature |
| 77 | A | open | frontends/shell/src/console/surfaceRegistry.ts:392 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- answering the question asked when …` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for the ask when opening during an export |
| 78 | A | m4 | frontends/shell/src/console/surfaceRegistry.ts:399 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- choosing which features the Table …` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for the Table (tabs, scope, Cancel) |
| 79 | A | m4 | frontends/shell/src/console/surfaceRegistry.ts:406 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- the Cancel button beside the Table…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Console statement for the Table (tabs, scope, Cancel) |
| 80 | A | m4 | frontends/shell/src/feature/FeatureTab.tsx:57 @ ad2088a8 | NO_COLUMN_PROJECTED_TEXT | `const NO_COLUMN_PROJECTED_TEXT = "[P6 placeholder] No attribute column is projec…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Feature tab: Attributes section lines |
| 81 | A | m4 | frontends/shell/src/feature/FeatureTab.tsx:58 @ ad2088a8 | NOT_HELD_TEXT | `const NOT_HELD_TEXT = "[P6 placeholder] Attributes are not held for this feature…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Feature tab: Attributes section lines |
| 82 | A | m4 | frontends/shell/src/feature/FeatureTab.tsx:66 @ ad2088a8 | parts | `return parts.length === 0 ? null : '[P6 placeholder] ${parts.join(". ")}.';` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Feature tab: Attributes section lines |
| 83 | A | m4 | frontends/shell/src/feature/FeatureTab.tsx:72 @ ad2088a8 | unprojected | `<section className="feature-attributes" aria-label="[P6 placeholder] Attributes"…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Feature tab: Attributes section lines |
| 84 | A | open | frontends/shell/src/feature/OpenDuringExportAsk.tsx:38 @ ad2088a8 | OpenDuringExportAsk | `<div className="open-during-export-ask" role="group" aria-label="[P6 placeholder…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | dialog asking what to do when a dataset is opened while an export runs |
| 85 | A | open | frontends/shell/src/feature/OpenDuringExportAsk.tsx:40 @ ad2088a8 | OpenDuringExportAsk | `[P6 placeholder] An export of the open dataset is still running. Keep exporting,…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | dialog asking what to do when a dataset is opened while an export runs |
| 86 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:18 @ ad2088a8 | CLAUSE_STATEMENT | `export const CLAUSE_STATEMENT = "[P6 placeholder] Cards that are on are combined…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 87 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:19 @ ad2088a8 | CLAUSE_ON_LABEL | `export const CLAUSE_ON_LABEL = "[P6 placeholder] On";` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 88 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:20 @ ad2088a8 | CLAUSE_REMOVE_LABEL | `export const CLAUSE_REMOVE_LABEL = "[P6 placeholder] Remove";` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 89 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:21 @ ad2088a8 | CLAUSE_ADVANCED_MARK | `export const CLAUSE_ADVANCED_MARK = "[P6 placeholder] Expression, used on its ow…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 90 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:22 @ ad2088a8 | CLAUSE_REFUSED_LINE | `export const CLAUSE_REFUSED_LINE = "[P6 placeholder] Not applied. Your filter ca…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 91 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:23 @ ad2088a8 | CLAUSE_NOT_APPLIED_LINE | `export const CLAUSE_NOT_APPLIED_LINE = "[P6 placeholder] Not applied. Try again.…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 92 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:24 @ ad2088a8 | CLAUSE_BUSY_LINE | `export const CLAUSE_BUSY_LINE = "[P6 placeholder] A filter change is still being…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 93 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:25 @ ad2088a8 | CLAUSE_ADVANCED_NEW_LINE | `export const CLAUSE_ADVANCED_NEW_LINE = "[P6 placeholder] Not applied: this cond…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 94 | A | filter | frontends/shell/src/filter/ClauseCards.tsx:26 @ ad2088a8 | clauseBlockedLine | `export const clauseBlockedLine = (text: string): string => '[P6 placeholder] Not…` | frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md | filter cards text and refusal lines |
| 95 | A | style, m4 | frontends/shell/src/layout/actionRegistry.ts:87 @ ad2088a8 | layer.revealStyle | `{ id: "layer.revealStyle", label: "[P6 placeholder] Colour by", chord: null, bar…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | control label (command bar and control) for Colour by |
| 96 | A | m4 | frontends/shell/src/layout/actionRegistry.ts:88 @ ad2088a8 | layer.revealTable | `{ id: "layer.revealTable", label: "[P6 placeholder] Table", chord: null, bareKey…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | control label for revealing the Table |
| 97 | A | m4 | frontends/shell/src/layout/contributions.ts:43 @ ad2088a8 | table | `{ id: "table", label: "[P6 placeholder] Table" },` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab label in Activity |
| 98 | A | not placed | frontends/shell/src/layout/statusItems.ts:31 @ ad2088a8 | coverage | `? '[P6 placeholder] source watch: checks-only — ${facts.coverage.reason ?? "(no …` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | status bar: source watch and structural checks state of the open dataset |
| 99 | A | not placed | frontends/shell/src/layout/statusItems.ts:32 @ ad2088a8 | coverage | `: '[P6 placeholder] source watch: ${facts.coverage.state}';` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | status bar: source watch and structural checks state of the open dataset |
| 100 | A | not placed | frontends/shell/src/layout/statusItems.ts:34 @ ad2088a8 | coverage | `return '${coverage} · [P6 placeholder] structural checks: degraded — unestablish…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | status bar: source watch and structural checks state of the open dataset |
| 101 | A | publish | frontends/shell/src/publish/PublishPanel.tsx:44 @ ad2088a8 | EXPORT_SELECTION_SENTENCE | `const EXPORT_SELECTION_SENTENCE = "[P6 placeholder] The selection is not used. T…` | not stated (blame: phase B stage 6, scope and export) | Export panel lines and refusal |
| 102 | A | publish | frontends/shell/src/publish/PublishPanel.tsx:57 @ ad2088a8 | what | `return { status: "refused", message: '[P6 placeholder] The export was not run, b…` | not stated (blame: phase B stage 6, scope and export) | Export panel lines and refusal |
| 103 | A | publish | frontends/shell/src/publish/PublishPanel.tsx:664 @ ad2088a8 | busy | `<p className="publish-purpose">[P6 placeholder] Writes a folder containing an in…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Export panel lines and refusal |
| 104 | A | publish | frontends/shell/src/publish/types.ts:133 @ ad2088a8 | FILTER_SCOPE_SENTENCE | `"[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, …` | frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md | Export panel echo of the filter-scope sentence |
| 105 | A | style, m4 | frontends/shell/src/style/Legend.tsx:8 @ ad2088a8 | LEGEND_NULL_LABEL | `export const LEGEND_NULL_LABEL = "[P6 placeholder] No value";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Legend |
| 106 | A | style, m4 | frontends/shell/src/style/Legend.tsx:9 @ ad2088a8 | LEGEND_OTHER_LABEL | `export const LEGEND_OTHER_LABEL = "[P6 placeholder] Other";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Legend |
| 107 | A | style, m4 | frontends/shell/src/style/Legend.tsx:10 @ ad2088a8 | LEGEND_EMPTY_VALUE_LABEL | `const LEGEND_EMPTY_VALUE_LABEL = "[P6 placeholder] (empty text)";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Legend |
| 108 | A | style, m4 | frontends/shell/src/style/Legend.tsx:21 @ ad2088a8 | parsed | `<ul className="style-legend" aria-label={'[P6 placeholder] Legend for ${parsed.m…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Legend |
| 109 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:52 @ ad2088a8 | LINE_WAITING | `const LINE_WAITING = "[P6 placeholder] Reading the first features to find the va…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 110 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:53 @ ad2088a8 | LINE_EXPORT_HELD | `const LINE_EXPORT_HELD = "[P6 placeholder] Colour by is not available while an e…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 111 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:54 @ ad2088a8 | LINE_NO_COLUMN | `const LINE_NO_COLUMN = "[P6 placeholder] No column of this file can colour the m…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 112 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:56 @ ad2088a8 | LINE_NOT_APPLIED | `cancelled: "[P6 placeholder] Cancelled. Nothing was applied.",` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 113 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:57 @ ad2088a8 | LINE_NOT_APPLIED | `abandoned: "[P6 placeholder] Cancelled. Nothing was applied.",` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 114 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:58 @ ad2088a8 | LINE_NOT_APPLIED | `refused: "[P6 placeholder] The values could not be read, so nothing was applied.…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 115 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:59 @ ad2088a8 | LINE_NOT_APPLIED | `ended: "[P6 placeholder] The dataset's session ended, so nothing was applied.",` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 116 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:60 @ ad2088a8 | LINE_NOT_APPLIED | `filter: "[P6 placeholder] The filter changed while the values were read, so noth…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 117 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:61 @ ad2088a8 | LINE_NOT_APPLIED | `none: "[P6 placeholder] The column holds no value among the features read, so no…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 118 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:213 @ ad2088a8 | next | `setLine('[P6 placeholder] Coloured by ${column}: ${found} distinct values found …` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 119 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:317 @ ad2088a8 | - | `[P6 placeholder] Colour by` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 120 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:319 @ ad2088a8 | - | `<option value="">[P6 placeholder] Choose a column</option>` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 121 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:328 @ ad2088a8 | - | `[P6 placeholder] Apply` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 122 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:332 @ ad2088a8 | - | `[P6 placeholder] Cancel` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 123 | A | style, m4 | frontends/shell/src/style/StylePanel.tsx:336 @ ad2088a8 | - | `[P6 placeholder] One colour` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Colour by panel lines and controls |
| 124 | A | m4 | frontends/shell/src/table/TableTab.tsx:26 @ ad2088a8 | NOT_HELD_TEXT | `const NOT_HELD_TEXT = "[P6 placeholder] not held";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 125 | A | m4 | frontends/shell/src/table/TableTab.tsx:27 @ ad2088a8 | CUT_TEXT | `const CUT_TEXT = "[P6 placeholder] cut";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 126 | A | m4 | frontends/shell/src/table/TableTab.tsx:104 @ ad2088a8 | line | `[P6 placeholder] Scope{" "}` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 127 | A | m4 | frontends/shell/src/table/TableTab.tsx:122 @ ad2088a8 | - | `[P6 placeholder] The table is not loading while an export runs.` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 128 | A | m4 | frontends/shell/src/table/TableTab.tsx:127 @ ad2088a8 | - | `<span>{'[P6 placeholder] Loading features: ${snapshot.count} so far.'}</span>` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 129 | A | m4 | frontends/shell/src/table/TableTab.tsx:136 @ ad2088a8 | - | `[P6 placeholder] Cancel` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 130 | A | m4 | frontends/shell/src/table/TableTab.tsx:146 @ ad2088a8 | - | `<TableGrid label="[P6 placeholder] features" columns={["id", ...columns]} rowCou…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 131 | A | m4 | frontends/shell/src/table/tableScope.ts:61 @ ad2088a8 | selectionLine | `if (scope === "selected-ignoring-filter") return '[P6 placeholder] Showing all $…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 132 | A | m4 | frontends/shell/src/table/tableScope.ts:63 @ ad2088a8 | rest | `return '[P6 placeholder] Showing ${second.listed.length} of ${selected} selected…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 133 | A | m4 | frontends/shell/src/table/tableSource.ts:52 @ ad2088a8 | EMPTY_TABLE | `export const EMPTY_TABLE: TableSnapshot = { phase: "idle", filter: null, request…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 134 | A | m4 | frontends/shell/src/table/tableSource.ts:66 @ ad2088a8 | filtered | `? '[P6 placeholder] Showing all ${n} features${filtered ? " that pass the filter…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 135 | A | m4 | frontends/shell/src/table/tableSource.ts:67 @ ad2088a8 | filtered | `: '[P6 placeholder] Showing the first ${n} features returned, in no declared ord…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 136 | A | m4 | frontends/shell/src/table/tableSource.ts:69 @ ad2088a8 | filtered | `return '[P6 placeholder] The table stopped adding features: the next ones return…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 137 | A | m4 | frontends/shell/src/table/tableSource.ts:71 @ ad2088a8 | filtered | `return '[P6 placeholder] Cancelled. Showing the first ${n} features returned bef…` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 138 | A | m4 | frontends/shell/src/table/tableSource.ts:73 @ ad2088a8 | filtered | `return "[P6 placeholder] The table could not be loaded.";` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 139 | A | m4 | frontends/shell/src/table/tableSource.ts:75 @ ad2088a8 | filtered | `return "[P6 placeholder] The dataset's session ended, so the table was cleared; …` | frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md | Table tab lines |
| 140 | A | not placed | frontends/shell/src/testUtils/terminalShapes.ts:41 @ ad2088a8 | REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL | `"engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on th…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | test-support fixture copying engine/kernel text; shown to no user |
| 141 | A | not placed | frontends/shell/src/testUtils/terminalShapes.ts:57 @ ad2088a8 | REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL | `"engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on th…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | test-support fixture copying engine/kernel text; shown to no user |
| 142 | A | not placed | frontends/shell/src/testUtils/terminalShapes.ts:58 @ ad2088a8 | REAL_SOURCE_COVERAGE_LOST_PRE_CHECK_REFUSAL_DETAIL | `"coverage ([P6 placeholder] this dataset's session ended when the advisory watch…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | test-support fixture copying engine/kernel text; shown to no user |
| 143 | A | not placed | kernel/src/lib.rs:546 @ ad2088a8 | liveness_refusal | `detail: "[P6 placeholder] this dataset's session ended when the advisory \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | terminal detail when the session ends on lost coverage; any step after open |
| 144 | A | publish | kernel/src/publish/error.rs:432 @ ad2088a8 | - | `"[P6 placeholder] refused: a version-1 bundle carries the {carried} encoding onl…` | engine/MULTIPOLYGON-MP1-PREREGISTRATION.md | publish refusal |
| 145 | A | publish | kernel/src/publish/error.rs:438 @ ad2088a8 | - | `"[P6 placeholder] refused: this dataset's features are identified by their \` | kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md | publish refusal |
| 146 | A | publish | kernel/src/publish/error.rs:445 @ ad2088a8 | - | `"[P6 placeholder] refused: the redaction scan (ADR-017 §13) found {count} \` | kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md | publish refusal |
| 147 | A | open | kernel/src/skp.rs:1033 @ ad2088a8 | engine_error_of_pre_admission_signal | `detail: "[P6 placeholder] a notification arrived for this source before admissio…` | engine/SOURCE-WATCHER-PREREGISTRATION.md | open refusal: a source notification arrived before admission |
| 148 | A | open | kernel/src/skp.rs:1271 @ ad2088a8 | - | `detail: "[P6 placeholder] a notification arrived for this source \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | open refusal: a source notification arrived before admission |
| 149 | A | open | kernel/src/skp.rs:1392 @ ad2088a8 | describe | `"[P6 placeholder] no watch was armed for this dataset".to_string(),` | engine/SOURCE-WATCHER-PREREGISTRATION.md | describe summary reason: no watch armed |
| 150 | A | not placed | kernel/src/skp.rs:1567 @ ad2088a8 | viewport_query_attribute | `detail: "[P6 placeholder] this dataset's session ended while this query was \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | refusal when the session ends on lost coverage; any step after open |
| 151 | A | not placed | kernel/src/skp.rs:1706 @ ad2088a8 | require_live | `detail: "[P6 placeholder] this dataset's session ended when the advisory \` | engine/SOURCE-WATCHER-PREREGISTRATION.md | refusal when the session ends on lost coverage; any step after open |
| 152 | A | not placed | protocol/data-plane/src/adapter_ws.rs:384 @ ad2088a8 | discard_queued | `"[P6 placeholder] the source ended without reporting a failure after its owner c…` | protocol/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md | data-plane terminal detail after an owner cancels a stream; not tied to a hero step |
| 153 | B | B | frontends/shell/src/console/surfaceRegistry.ts:294 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- showing or hiding the Layers regio…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Console statement for a region toggle or resize |
| 154 | B | B | frontends/shell/src/console/surfaceRegistry.ts:301 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- showing or hiding the Inspector re…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Console statement for a region toggle or resize |
| 155 | B | B | frontends/shell/src/console/surfaceRegistry.ts:308 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- showing or hiding the Activity reg…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Console statement for a region toggle or resize |
| 156 | B | B | frontends/shell/src/console/surfaceRegistry.ts:315 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- switching the Inspector between it…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 157 | B | B | frontends/shell/src/console/surfaceRegistry.ts:329 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- expanding or collapsing the Source…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Console statement for a region toggle or resize |
| 158 | B | B | frontends/shell/src/console/surfaceRegistry.ts:336 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- resizing a region with its splitte…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | Console statement for a region toggle or resize |
| 159 | B | B | frontends/shell/src/console/surfaceRegistry.ts:343 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- choosing the Navigate or Select to…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 160 | B | B | frontends/shell/src/console/surfaceRegistry.ts:350 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- choosing how a click changes the s…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 161 | B | B | frontends/shell/src/console/surfaceRegistry.ts:357 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- changing which features are select…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 162 | B | B | frontends/shell/src/console/surfaceRegistry.ts:364 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- clearing the selection is pure vie…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 163 | B | B | frontends/shell/src/console/surfaceRegistry.ts:371 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- Zoom to selection moves the camera…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 164 | B | B | frontends/shell/src/console/surfaceRegistry.ts:385 @ ad2088a8 | - | `"[P6 placeholder] no API equivalent exists -- pinning or unpinning the inspected…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Console statement for an inspector tab, tool, selection or feature pin |
| 165 | B | B | frontends/shell/src/feature/FeatureTab.tsx:52 @ ad2088a8 | STATUS_TEXT | `drawn: "[P6 placeholder] Drawn in the view.",` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 166 | B | B | frontends/shell/src/feature/FeatureTab.tsx:53 @ ad2088a8 | STATUS_TEXT | `"outside-view": "[P6 placeholder] Not drawn: outside the view.",` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 167 | B | B | frontends/shell/src/feature/FeatureTab.tsx:54 @ ad2088a8 | STATUS_TEXT | `"in-view-not-drawn": "[P6 placeholder] Not drawn: in the view.",` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 168 | B | B | frontends/shell/src/feature/FeatureTab.tsx:96 @ ad2088a8 | lastClickLine | `? '[P6 placeholder] Last click: ${idLine(click.pick)}.'` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 169 | B | B | frontends/shell/src/feature/FeatureTab.tsx:97 @ ad2088a8 | lastClickLine | `: '[P6 placeholder] Last click: ${idLine(click.pick)}. The pinned feature, id ${…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 170 | B | B | frontends/shell/src/feature/FeatureTab.tsx:101 @ ad2088a8 | lastClickLine | `return <p className="feature-last-click">[P6 placeholder] Last click: no feature…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 171 | B | B | frontends/shell/src/feature/FeatureTab.tsx:118 @ ad2088a8 | noticeText | `return '[P6 placeholder] The selection holds at most ${notice.refusal.max} featu…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 172 | B | B | frontends/shell/src/feature/FeatureTab.tsx:122 @ ad2088a8 | dropped | `return '[P6 placeholder] The selection ended: ${dropped}, because ${because}.';` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 173 | B | B | frontends/shell/src/feature/FeatureTab.tsx:156 @ ad2088a8 | nothingSelected | `<section className="feature-inspected" aria-label="[P6 placeholder] Inspected fe…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 174 | B | B | frontends/shell/src/feature/FeatureTab.tsx:158 @ ad2088a8 | nothingSelected | `<p className="feature-empty">[P6 placeholder] No feature is inspected.</p>` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 175 | B | B | frontends/shell/src/feature/FeatureTab.tsx:171 @ ad2088a8 | - | `<section className="feature-selection" aria-label="[P6 placeholder] Selection">` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 176 | B | B | frontends/shell/src/feature/FeatureTab.tsx:174 @ ad2088a8 | - | `<p className="feature-outside-view">{'[P6 placeholder] Outside the view: ${count…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 177 | B | B | frontends/shell/src/feature/FeatureTab.tsx:177 @ ad2088a8 | - | `<p className="feature-in-view-not-drawn">{'[P6 placeholder] In the view, not dra…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 178 | B | B | frontends/shell/src/feature/FeatureTab.tsx:192 @ ad2088a8 | - | `<p className="feature-scope">{'[P6 placeholder] ${zoom.label} acts on: ${zoom.sc…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Feature tab lines (drawn state, last click, selection, labels) |
| 179 | B | B | frontends/shell/src/feature/ToolSwitch.tsx:46 @ ad2088a8 | ToolSwitch | `<div className="tool-switch" role="group" aria-label="[P6 placeholder] Map tool"…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Map tool and Selection mode controls |
| 180 | B | B | frontends/shell/src/feature/ToolSwitch.tsx:65 @ ad2088a8 | - | `<div className="tool-switch-modes" role="group" aria-label="[P6 placeholder] Sel…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Map tool and Selection mode controls |
| 181 | B | B | frontends/shell/src/feature/ToolSwitch.tsx:85 @ ad2088a8 | entry | `{'[P6 placeholder] ${entry.label} (${entry.bareKey?.letter.toUpperCase()}): ${cl…` | frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md | Map tool and Selection mode controls |
| 182 | B | B | frontends/shell/src/layout/StudioLayout.tsx:308 @ ad2088a8 | emptyInspectorText | `<p className="inspector-empty">[P6 placeholder] Nothing to show until a dataset …` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |
| 183 | B | B | frontends/shell/src/layout/StudioLayout.tsx:365 @ ad2088a8 | region | `{'[P6 placeholder] ${entry.label} (${shortcutLabel(entry.chord, platform)})'}` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |
| 184 | B | B | frontends/shell/src/layout/StudioLayout.tsx:377 @ ad2088a8 | - | `{splitter("layers", "x", 1, sizes.layersWidth, "[P6 placeholder] Resize Layers")…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |
| 185 | B | B | frontends/shell/src/layout/StudioLayout.tsx:379 @ ad2088a8 | - | `<section className="attention-strip" aria-label="[P6 placeholder] Attention" hid…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |
| 186 | B | B | frontends/shell/src/layout/StudioLayout.tsx:389 @ ad2088a8 | - | `{splitter("inspector", "x", -1, sizes.inspectorWidth, "[P6 placeholder] Resize I…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |
| 187 | B | B | frontends/shell/src/layout/StudioLayout.tsx:434 @ ad2088a8 | - | `{splitter("activity", "y", -1, sizes.activityHeight, "[P6 placeholder] Resize Activity")…` | frontends/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md | inspector empty text, button label, splitter and attention labels |

The 37 strings of ADV-2026-11-21-14: set A, nothing more (1 line, not tabled).

NOT PLACED (21, all in set A), with why
- 1 engine/src/error.rs:427, 143 kernel/src/lib.rs:546, 150 kernel/src/skp.rs:1567, 151 kernel/src/skp.rs:1706, 51 admission/formatRefusal.ts:86, 41 App.tsx:754, 140-142 testUtils/terminalShapes.ts: all concern a source watch that lost coverage / a session that ended on it. They surface at any step after open, not in a particular hero step, and the SOURCE-WATCHER form (not 1c or m4) built them. 140-142 are test-support fixture copies shown to no user.
- 98-100 layout/statusItems.ts:31,32,34: status-bar source-watch and structural-checks text, always on once a dataset is open; built by milestone 1, not a hero step.
- 59, 60, 62-65, 69, 70 command/CommandBar.tsx (not-available mark and note, empty/pick/unknown/none notes, aria-label, input placeholder): shown for any command typed in the bar, not tied to one hero step; built by milestone 3. (Rows 61 and 66-68 I did place: "a file is already being opened" as open; the /filter notes as filter.)
- 152 protocol/data-plane/src/adapter_ws.rs:384: data-plane terminal detail after an owner cancels a stream; not tied to a hero step; TERMINAL-WITHOUT-CREDIT form.

PLACEMENT CALLS the human may want to move (judgement, not facts): set B holds only milestone 1/2 strings (region toggles, tool/selection, Feature tab lines other than Attributes, StudioLayout labels). Everything in the Table, Colour by, Legend and Attributes is set A by "m4". The wkb.rs row refusals and describe-summary/watch reasons are placed "open" by where they show; the Console statements for the ask (row 77) are placed "open".

Scope departures: none beyond the above. Nothing written outside <S> under spl- names; no commit, push, fetch, network, build, test or app; no background process left. The record is the transcript.

Model: the harness names me Sonnet 5.5 (claude-sonnet-5-5); no override; no context handoff received or produced.

# 5. The Parts, byte-copied from `frontends/shell/MANUAL-WALKTHROUGH.md` at main ad2088a8

## (i) Part AD: lines 2021 to 2035 of the walkthrough at ad2088a8

*Byte for byte by script, 6789 bytes, sha256 81c993f832dc1294db3dae9884ba353c663ea29a3aea30d022010a23b6137398.*

## Part AD — save a project into a folder under OneDrive and open it again: Save project, Open project, the question, an online-only file and a second window (b2-piece-1c-save-and-reopen, steps 1 and 2)

This Part is the Operator gate of `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §9, for steps 1 and 2, run only on a build with step 2 merged, with a blank result log. Its rows are §9's P0 and OP1 to OP5. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). Every sentence in it is a draft for the human's sight (P6) and none is the human's wording. OP6 joins this Part with step 3.

**Before AD1:** fixture `filter-zoned.parquet`, no new fixture (Part E's table; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`, which is the fixture `frontends/shell/e2e/project.mjs` opens); an empty folder that you make inside your OneDrive folder, for the project; the app started with no dataset open, so that AD1 opens one. **Before AD2 to AD5:** AD1's project, saved; a second empty folder inside your OneDrive folder for AD2 and AD3; File Explorer, for AD2 to AD4; and, for AD5, a third empty folder inside your OneDrive folder and a second start of the app while the first is running.

| # | Step | Expected outcome |
|---|---|---|
| AD0 | P0. Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AD1 | OP1. Click **Open GeoParquet…** and select `filter-zoned.parquet`. In the Inspector's Filter section (Layer tab), type `"zone" = 'residential'` into the input and click Apply. Then click the control labelled Save project in the Layers region (it shows only while a dataset is open), or press Ctrl+K, type `/save` and press Enter. When the folder picker opens, choose the empty folder you made inside OneDrive. Then click Save project a second time. | The first save opens the native folder picker once, titled `Choose the project folder`. After you choose the folder, a line in the strip above the map reads `The project was saved.` When the session history took no saved-here mark for the save, a second line reads `The session history holds no saved-here mark for this save.`; record whether it appeared. If the save is refused, a line reads `The project was not saved: ` followed by the kernel's message; record the message. The folder you chose holds one file, `project.spatial`, and no other file. Opened in a text editor, the file is laid out in lines, and its members are `format`, `version`, `project`, `datasets`, `lineage` and `workspace`, in that order; the clause you applied and the filter built from it are under `workspace`. The second click opens no picker, shows the saved line again, and leaves the folder holding only `project.spatial`. **Felt:** did OneDrive show the file syncing; did either save seem to wait; is it clear what each line means? **Strings for sight (P6):** the control's label, the picker's title, the saved line, the saved-here line and the not-saved line. |
| AD2 | OP2. In the second empty OneDrive folder, put a copy of `filter-zoned.parquet`. Click **Open GeoParquet…**, select that copy, type `"zone" = 'residential'` into the Filter input and click Apply, then click Save project and choose that same folder in the picker. Close the app. In File Explorer, right-click the copy of `filter-zoned.parquet` and choose Free up space, so that the file is online-only. Start the app, click **Open project…** (or press Ctrl+K, type `/open-project` and press Enter) and choose that folder. | The picker opens, titled `Choose the project folder`. While the open runs, the button reads `Opening project…` and a Cancel button shows; once the open has taken a little while, a line reads `Opening…`. When the open ends, the map shows the data and the Filter section shows the filter you applied. Record whether a line about changed data appeared, and whether the file was small enough to arrive before you could see Cancel. **Felt:** did the app look frozen at any moment; did `Opening…` and Cancel stay in view until the open ended? **Strings for sight (P6):** the control's label, its opening label and the picker's title. |
| AD3 | OP3. Close the app. In File Explorer, choose Free up space again on the copy of `filter-zoned.parquet`. Start the app, click **Open project…**, choose the same folder, and click Cancel as soon as the button reads `Opening project…`. | Either a line reads `Open cancelled` and no project is open, or the project opens as in AD2 because the data had arrived before the Cancel was seen. Record which, and whether Cancel seemed to wait for the file. **Felt:** did Cancel seem to wait; did the app look frozen while it waited? |
| AD4 | OP4. In File Explorer, copy the folder of AD1's project, the one holding `project.spatial`, to a new folder with Copy and Paste. Start the app, click **Open project…** and choose the copy. | A question appears. It begins `This machine remembers this project in another folder. Is the project in this folder a copy, or the same project?` and offers `A copy`, `The same project` and `Do not open`. Choose A copy: the project opens with the filter AD1 applied. In a text editor, the copy's `project.spatial` holds a different `project` value from the first folder's file, and the first folder's file is unchanged. Close the app, start it and open the copy again: no question is asked. Copy the first folder once more to a new folder and open that one, choosing The same project: it opens, and opening that folder again asks nothing. **Felt:** are the question and its three choices clear? **Strings for sight (P6):** the question and its three choices. |
| AD5 | OP5. Start the app, open `filter-zoned.parquet` and save a project into a new empty folder inside OneDrive, as in AD1. Start the app a second time, so that two windows run. In the second window click **Open project…** and choose the same folder. Then, in the first window, click **Open GeoParquet…** and select `filter-zoned.parquet`, so that the first window no longer holds the project, and in the second window choose the same folder again with **Open project…**, again if the try is refused. | In the second window the first try is refused: a line reads `The project was not opened in this window. Close it where it is open, then try again.` beside a refusal block with the code `skp.project_open_elsewhere`. After the first window has opened the other file, the second window's try opens the project; record how many tries it took. If the second window does not start, record that and run nothing else in this row. **Felt:** is it clear where the project is open? **Strings for sight (P6):** that line. |


## (iii) Part A: lines 156 to 175 of the walkthrough at ad2088a8

*Byte for byte by script, 4067 bytes, sha256 a7bf237ab17a96ec74591ea919e9e8f044cc358365f262e0859da56e8305c302.*

## Part A — happy path (100k fixture)

| # | Step | Expected outcome |
|---|---|---|
| A1 | Launch the app (`npm run tauri dev`). | A window titled "Spatial IDE" opens with an "Open GeoParquet…" button in the Layers region and no dataset on the map yet. |
| A2 | Click **Open GeoParquet…**. | The native file-open dialog appears, filtered to `*.parquet` (filter label "GeoParquet"). |
| A3 | Select `100k-happy-path.parquet` and confirm. | The button briefly reads "Opening…", then a summary list appears in the Inspector's Source section (Layer tab): **CRS** `EPSG:2056 — file, axis order easting,northing`; **[P6 placeholder] Geometry (encoding chosen by the engine)** `geometry (geoarrow.polygon)`; **[P6 placeholder] Geometry types declared by the file** (the file's own declaration); **Identity** `file:id — verified-at-open-full-file`; **Row count** `100000 (identity-uniqueness-scan-full-file)`; **Extent** the static "not established at open…" text; **Schema** column count; **License** "not declared"; **CRS provenance**. No refusal panel appears. |
| A4 | Observe the map region. | A canvas fills the map region. Within a few seconds, translucent blue-ish polygons (a cadastral-parcel-like field of irregular shapes, some with holes) render, and the view **fits itself to the extent of the arriving data** — a field of parcels filling a good portion of the canvas, not a single speck at a fixed zoom. A **"Zoom to layer"** button appears on the dataset's row in the Layers region. You should not have to hunt for the data. |
| A5 | Click-and-drag on the canvas. | The view pans smoothly; polygons track the drag with no visible jump, tearing, or stale ghosting. |
| A6 | Scroll to zoom in and out several times, including at least one large jump (e.g. scroll far in, then far back out). | The view zooms smoothly around the cursor. Polygons stay sharp — no visible coordinate jitter or drift at high zoom (this is `OffsetFrame`'s recentering; you should not be able to see it happen, only that precision holds). |
| A7 | Pan far away from the data (drag until the canvas is empty), then click **Zoom to layer**. | The camera jumps back to fit the layer's known extent: the union of everything the map has held since the open (KNOWN-LIMITATIONS item 61). That includes the tiles the open's own fill loaded and anything loaded while you panned, so it can frame more than A4's fit. |
| A7a | Scroll out until the field of parcels is about a tenth of the canvas wide. Drag left by about a third of the canvas width, 5 times; then drag right 5 times by about the same amount. | The parcels come back to about where they started, give or take the difference between your drags. They do not stay away, and Zoom to layer is not needed to find them. |
| A8 | Pan/zoom repeatedly and rapidly for several seconds (simulating impatient use). | No error banner appears (see `ErrorBanner`/global handlers — a red banner fixed to the top would mean an unhandled error or rejection fired; in particular, no `skp.too_many_pending_streams` refusal). The app keeps responding to input throughout — never freezes or becomes unresponsive. Fresh data for wherever you land may take a brief moment (well under a second) to arrive after motion stops — pan/zoom queries are now debounced to settle rather than issued continuously mid-drag, so this pause is expected, not a hang. |
| A9 | Hover the mouse over a rendered polygon, then over empty space, then over another polygon. | A small dark readout box appears at the bottom-left reading `id <number>` (and often `@ (x.xxx, y.xxx)`) while over a feature, and disappears over empty space. The id changes when you move to a different polygon. |
| A10 | Close the app window. | No crash dialog, no hang on exit. |

**If anything deviates** (an error banner appears, the canvas never renders, pan/zoom is inert,
hover never populates, the app hangs or crashes): stop, record the exact step and what you saw
(screenshot if practical), and report it — do not continue to Parts B/C assuming it was unrelated.


## (iii) Part L: lines 777 to 844 of the walkthrough at ad2088a8

*Byte for byte by script, 16817 bytes, sha256 f81da651757f8baec98d2c8e2f279e6f4993ef73f1069006f78d4e5d5c5c15c9.*

## Part L — the residency-debt close: scoped Cancel, honest quiescence, live hover (residency-debt cut 1b)

The 1b cut's close bundles this sitting (CUT-STATE's own dispatch): Items A (scoped
cancellation + honest progress for the held queue), B (the settled-partial signal), and C (the K6
hover fix) all landed through reviewer gates to affirmative passes, with their properties
unit-pinned and C carrying its own E2E step (`stepK6`). What none of that can answer — the same
division of labor every Part here draws — is whether Cancel *feels* obeyed, whether "paused" and
"finished" read as honest accounts of a frozen queue and a settled fill, and whether the live
hover re-evaluation reads as protective. Those are docs/01 principle 7's own terms ("cancellable,
streaming, progress-reporting" as felt qualities), and they are this Part's ground. **Felt
verdicts are human-present by decision 24(g) — run this at the machine, not over RustDesk** (Part
K's result log shows the degraded-channel caveat remote judging forces). **No duration appears
anywhere in this Part** (ADR-018): every step asks what a wait or a stop *reads as*, never how
long it took.

**Scheduling notes, both decided at the sitting's own start:** (1) decision 34c — whether a scored
campaign cell rides this sitting — was deferred to scheduling time, leaning correctness-only; a
scored cell would need the full preregistration protocol, so the lean is to keep this sitting
purely felt. (2) **The 5 GB fixture is deliberately NOT in this Part** — entry 40's
producer-side tile-stream hang makes a 5 GB fill unable to complete regardless of the client, and
the felt verdicts this Part exists for need only the Polygons-scale fill below (its zoom-to-layer
window runs tens of seconds — ample to click Cancel mid-fill). The 5 GB Cancel-felt case rides a
later sitting, after entry 40's producer diagnosis.

**Pre-checks (before the app opens):** working tree on merged `main` (PR #22, `4549c35` or later),
suite green (`npx vitest run`, `npx tsc --noEmit`, `node e2e/citationIntegrity.test.mjs`); no
stale `spatial-ide-shell.exe` / `msedgewebview2` processes from earlier sessions (Task Manager or
`Get-Process`); `target/fixtures/slice-budgets/polygons-100k.parquet` present (regeneration
fallback in Part K); C: comfortably free (the fill writes no evidence, but a fresh src-tauri
compile in a disk-starved tree is the known trap — the main checkout's warm target avoids it).

Fixture and arm: `polygons-100k.parquet`, candidate arm at `fine` — the same fixture, hook, and
honest DevTools note as Part K (K2's exact console incantations; the absence of a shipped arm
control is unchanged and still worth noticing). **MANDATORY after EVERY Ctrl+R (added 2026-09-06, after the first half-sitting's verdicts turned out arm-unverifiable; [CORRECTED 2026-11-05: a reload does not set the arm to `"baseline"`]): after a reload the arm is the shipped default, `"candidate"`, and the tile-size level is unset (`null`), which a candidate session runs at `"medium"`, not this Part's `fine`. So after each Ctrl+R, re-arm per K2 (both calls resolve `{ok:true}`); then, before each open, run `await window.__SPATIAL_E2E__.getResidencyArm()` and require it to print `"candidate"`, and run `await window.__SPATIAL_E2E__.getResidencyTileSizeLevel()` and require it to print `"fine"`. A step whose arm and level were not both verified this way is recorded as unverified, not as a verdict.** Also
verified this sitting (`parcel`'s grid cell in `engine/src/fixture.rs`): this fixture is laid out row-major by id, so
the candidate arm's 10,000-row first look is a bottom STRIP of the layer. Since
open-first-look-fills-fit-view the open, when that first look completes, asks for the tiles of the view
it then shows, with no pan or zoom. "Zoom to layer" fits the union of what the map has held (the fit
anchor — DECISIONS-PENDING entry 42; KNOWN-LIMITATIONS item 61), not the dataset: after the open's fill
that is the strip and the tiles that fill loaded, which can be more than the strip. The rows below were
sighted when "at fit" meant the strip view; what they expect at fit is not sighted again since that change.

| # | Step | Expected outcome |
|---|---|---|
| L1 | **Block A reference, not itself judged. [CORRECTED 2026-09-06 after the sitting's trace — the original expected the over-budget settled suffix; on this fixture under 1b the fit view is WITHIN budget.]** Arm candidate/fine per K2 (verify the arm and the level!), open `polygons-100k.parquet`, let it settle, then click **Zoom to layer** and let the whole fill run to quiescence WITHOUT touching Cancel. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** The open now asks for the tiles of its own view when the first look completes, so tiles arrive, and that fill settles with a status sentence, before you click anything. Zoom to layer then frames the strip and the tiles the open's fill loaded, which can be more than the strip view this row was sighted on. Whether that view's covering set fits the render budget, and so which sentence speaks at its settle, is for the next sitting to record. **As sighted before the change:** The button fits the rendered strip (see the fixture note above), whose covering set fits the render budget — 1b's P6b made the truncated first look evictable, which frees ~900k vertices (the sitting's own trace: `evictedTileKeys: 1`, resident 19,082 → 9,352). So: **no status line at all during the fill** (until a within-budget fill settles it sends no status (L5 below has the account) — entry 36's own "re-earn at settle" rule), tiles arriving three at a time in row-major order over tens of seconds to minutes with only the liveness indicator as a signal, then at settle *"Showing all `<N>` features in view"* — IF the covering set was not truncated (entry 43: a truncated within-budget settle is silent by design). The over-budget sentence and string 4 do not appear here at all; they belong to a zoomed-OUT view. **Form the felt reference:** how does a long, text-less fill read? |
| L2 | Ctrl+R, re-arm per K2, reopen the fixture, click **Zoom to layer** again (**[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** tiles of the open's own fill arrive before the click, and the fill after the click can be shorter than it was, because the open's fill has loaded part of that view) — and this time, while tiles are visibly still arriving, click **Cancel**. | Filling stops; **everything already rendered stays on canvas** (the view is retained, not cleared); the status reads (verbatim) *"Filling stopped — showing `<N>` features already loaded; the rest of this view was not loaded."* **Judge (the repointed Cancel, rulings 32a/33b):** does the stop read as *obeyed the click* — visibly prompt, in-flight work actually dying rather than draining out — and does the wording read honest (it must never say or imply "complete")? |
| L3 | From L2's cancelled state, pan the canvas one ordinary drag in any direction. | Filling resumes for the newly exposed area — Cancel relieved the backlog without disabling tiling (the defect Item A existed to fix: the old lever was permanent). **Judge:** does the resume feel ordinary — indistinguishable from any fresh pan — with no sense the earlier Cancel left the canvas wounded? |
| L4 | **Lightly scoped — a timing-tight window, and a miss is not a deviation (Part I's I6 precedent).** Ctrl+R, re-arm, reopen — and click **Cancel** as early as you can after the open, while the very first (untiled) data load is still delivering. | If the frame is already established, Cancel now reaches the untiled stream too (entry 35's ruling) — the stop obeys just as in L2. If you catch the pre-frame window instead, the status reads (verbatim, ruled 2026-09-06) *"Tile filling stopped — showing `<N>` features already loaded; this view's first data load is still running and Cancel does not stop it."* — sticky until the state resolves. **Judge whichever you catch:** honest, or evasive? |
| L5 | **Block B. [CORRECTED TWICE, 2026-09-06 — the original expected the paused suffix; a first correction (same day, code-read only) expected the over-budget sentence with a transient stall; the sitting's own trace then showed the fit view is WITHIN budget, so neither applies. This row now states what was observed and verified.]** Reproduce L1's fill (Ctrl+R, **re-arm per K2, then verify the arm and the level**, reopen, Zoom to layer) and watch the status line DURING the fill. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** The open's own fill now runs and settles first, and its status sentence shows before the click. What this row expects is for the fill after the click. **[CORRECTED 2026-09-07 — the "none at settle" half predates F2 (PR #24): a truncated within-budget settle now speaks string 6, *"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*, sighted by the operator on the 48-(a) build.] Expect no status text DURING this fill; at settle, string 6 if the covering set was truncated** — the fill's silence is by 1b's own design, not a miss: until a within-budget fill settles, `emitResidencyStatus` sends no status, except one `candidate-fill-progress` while the complete status it sent last is still standing, and `nextResidencyStatus` reduces that event to no status. A within-budget settle left incomplete by truncation was silent before F2, which DECISIONS-PENDING entry 43 recorded as silence representing state, the class entry 36 ruled against; since F2, `emitResidencyStatus`'s `settled-partial` branch sends `settled: "partial"`, which `residencyStatusText` renders as string 6 (`emitResidencyStatus` in `frontends/shell/src/residency/candidateArmSession.ts`; `nextResidencyStatus` and `residencyStatusText` in `frontends/shell/src/residency/residencyStatus.ts`). The `stalled` suffix (string 1) cannot appear in a within-budget view; its home is an over-budget view whose in-viewport tiles are unevictable (the 5 GB shape, behind entry 40). String 1's wording is ruled and BS3 unit-pinned; nothing in the close gates on sighting it live here. **What to watch instead:** whether the canvas fills to the edges of the view or stops with space left (the sitting saw it stop — entry 43's own case) — record which. The optional probe (paste BEFORE opening the dataset, then Open GeoParquet, then Zoom to layer — its printed "click Zoom to layer now" line skips the open step; ignore that wording): `(async()=>{const out=[];const t0=performance.now();const timer=setInterval(async()=>{const q=await window.__SPATIAL_E2E__.residencyQueuedTileCount();const el=document.querySelector(".residency-status");const text=el?el.textContent:null;const last=out[out.length-1];if(!last||last.q!==q||last.text!==text)out.push({t:Math.round(performance.now()-t0),q,text});},50);window.__L5_PROBE_STOP__=()=>{clearInterval(timer);console.table(out);return out.filter(s=>s.text&&s.text.includes("paused")).length+" paused sightings";};console.log("L5 probe armed — open the dataset, then click Zoom to layer; run __L5_PROBE_STOP__() after settle.");})();` — a queue count that reaches 0 with the canvas still incomplete is the truncation signature. |
| L6 | **[CORRECTED 2026-09-06.]** From L5's settled strip view (already within budget), zoom in several notches so the covering set is small enough not to truncate, and let it settle. **Then zoom OUT past the strip toward the whole layer and watch.** | Zoomed in: *"Showing all `<N>` features in view"* at settle — structurally gated on settled-complete (Item B: never while any covering stream is in flight or queued). **Judge:** does the claim arrive at a moment that feels *earned* — the fill visibly done — rather than optimistic? Zoomed out: the over-budget sentence *"Showing `<N>` features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."* and, at settle, string 4's suffix. **Known finding, record don't chase (entry 44):** at this zoom the sitting observed tiles appearing for a moment and disappearing, one after another, ending with a single tile standing — ADR-028 Amendment 1's own reopen condition (partial in-viewport tiles evicted by the next admission). If you see it, describe it in your own words for the log. *(String 5, the failure-partial wording — "Filling has finished for this view, but part of this view failed to load; pan or zoom to retry." — is NOT reachable on demand without fault injection and is deliberately not staged here; it is ruled and unit-pinned. If it appears naturally at any point, record the step and judge it then.)* |
| L7 | **Block C — the hover readout across a camera change, forward direction.** Zoom in until individual polygons are clearly larger than a pixel, hover one until its `id <number>` readout shows, then — **pointer stationary** — zoom OUT (mouse wheel, no pointer movement): first by just ONE step, while the feature is still plainly big enough to tell apart, and then further, past sub-pixel scale. | **[UPDATED 2026-09-10 for entry 47 (the re-pick on camera settle) — this row's re-run is QUEUED FOR THE NEXT ACCUMULATED SITTING BUNDLE (`AI_DEVELOPMENT.md` rule 11); the result log below is the PREVIOUS build's and is not evidence for this text.]** While the wheel is still turning the readout never holds a stale id — below the declared threshold it refuses by name, above it it clears. **When the gesture stops, one fresh pick at the pointer's own pixel decides what you see.** After the one-step zoom-out (the case you reported on 2026-09-07: *"as long as I can tell on which feature I'm hovering, there's no reasono to remove the id"*) the same `id <number>` comes BACK — re-picked at the new camera, never a retained string. Past sub-pixel scale you get the named refusal instead, verbatim: *"Features here are below pick resolution — zoom in to inspect them."* — the refusal always wins over any id. **Judge:** does the readout keeping pace with the zoom read as the app staying honest under your hands — and does the id returning after the small zoom-out read as *right*, or as jumpy? |
| L8 | With the refusal standing from L7 and the pointer still stationary, zoom back IN above the threshold. | **[UPDATED 2026-09-10 for entry 47 — re-run QUEUED FOR THE NEXT ACCUMULATED SITTING BUNDLE (rule 11); the result log below is the PREVIOUS build's.]** Mid-gesture the refusal clears. **When you stop, the re-pick answers on its own, without you moving the mouse:** the ordinary `id <number>` readout returns if a feature really is under that pixel at the new camera, and nothing at all is shown if nothing is — never a guessed id (a pick that resolves nothing clears; a tile not yet resident there resolves nothing). Moving the mouse still behaves exactly as it always did. **Judge:** does the readout coming back by itself read as correct restraint finally paying off — or as the readout flickering unhelpfully (blank, then back)? |
| L9 | **Block D — the felt re-verdict, this sitting's deliverable.** Consider Blocks A-C together over the whole session. | Record, verbatim in the result log, your overall verdict on the residency behavior as it now stands: with a scoped Cancel, honest stall/settle wording, and a live hover readout — does the canvas at this scale now read as "never blocked: cancellable, streaming, progress-reporting" in docs/01 principle 7's own felt sense? This verdict is what closes the cut (rule 10 archive follows it) and what the LOD scheduling call (34c) builds on. |

**If anything deviates** (Cancel clearing the canvas or reading ignored; a status text matching
none of the verbatim strings above; "Showing all N" appearing while tiles are visibly still
arriving; an id surviving L7's zoom-out at a camera where you can no longer tell which feature is
under the pointer (entry 47 makes a RE-PICKED id correct there, a retained one still a defect); the
ceiling-refusal banner appearing under the candidate arm): stop, record the exact step and what you saw, and report — do not continue
assuming it was unrelated. L4's missed window, L5's paused suffix not appearing (a within-budget
view has no over-budget sentence to carry it), a text-less fill and a silent truncated settle
(entries 36/43 — by design, recorded), the zoom-out appear/disappear cycling (entry 44 — the
Amendment-1 reopen condition, recorded), and string 5 never appearing are all named expected
outcomes of THIS sitting, not deviations to stop for. The ceiling-refusal banner under a
VERIFIED candidate arm remains a stop-and-report deviation.

---


## (iii) Part G: lines 316 to 383 of the walkthrough at ad2088a8

*Byte for byte by script, 19286 bytes, sha256 71e9c9ffcadccbf9200d418d9aa00d7ccf3b686ea24cf19e3dd8ed6fcf184b29.*

## Part G — publish (publish cut)

`NEXT-CUT.md`'s own framing, verbatim and binding: *"This cut builds and evidences the first
exposure surface for a class-3 publish, against machinery that ALREADY EXISTS... **It does not
discharge ADR-017's acceptance condition.** The condition's discharge is the human's decision at
the end, on the evidence and the surface itself."* Every step below through G9 is that evidence —
including the one click no CDP driver can reach (the native destination picker, G2) and two
judgment calls only an operator can make (G3, G6). **G10, at the end, is the decision itself** — not
a table row, a question addressed to the human alone.

Reuses `filter-zoned.parquet` (already listed in Part E's own fixtures table above — publish v0
needs no fixture of its own; any admitted, styleable dataset works, and reusing this one keeps the
row-count/zone-filter facts Parts E/F already established available for G8's own filter-active
step).

| # | Step | Expected outcome |
|---|---|---|
| G1 | Click **Open GeoParquet…** and select `filter-zoned.parquet` (canvas from Part F may still be visible; that's fine). In the Inspector, open the Style tab, expand **▸ Style** and set a distinctive style (Part F's F2/F4 — an unusual fill colour and a visible, distinct outline) so the published bundle is visually identifiable later. Then go back to the Layer tab and expand the collapsed **▸ Export** disclosure, in its Export section below Filter. | The summary/canvas admit and the style panel behave exactly as Parts E/F describe. The Export disclosure expands (**▾ Export**) to reveal a **Row scope** fieldset with two radio options — **Whole dataset** and **Current view** (checked by default) — and, below them, one **Export interactive map…** button. With the file's data drawn on the map, **Current view** is enabled and no reason paragraph appears. After an open it is disabled only until the map draws the file's first data, or until a pan or zoom if one comes first. While it is disabled, a reason paragraph below the two options reads, verbatim, *"Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset."* (`CURRENT_VIEW_DISABLED_REASON` in `frontends/shell/src/publish/PublishPanel.tsx`, the human's words; Part Y's Y4 is their sight). No filter-scope sentence appears yet (none is active — that is G8), and no refusal/summary block is present. |
| G2 | Click **Export interactive map…**. | **The one step no automation in this document's own suites can reach**: a native OS **Save** dialog appears — the same structural limitation this document's intro names for the Open dialog's own picker (no CDP driver reaches WebView2's dialog chrome), except here there is not even a JS-only bypass to script around it: publish's picker is fused *inside* one Tauri command (`e2e/publish.mjs`'s own top comment). Choose a destination **under `C:\dev\spatial-ide\target\`**, giving it a memorable final name of your own choosing (e.g. `C:\dev\spatial-ide\target\manual-walkthrough-publish\my-parcels`), and confirm. The **Export interactive map…** button briefly reads "Preparing…". |
| G3 | Read the approval dialog that appears, in full, before typing anything. | A modal appears, rendering `PublishPromptData`'s own fields in this exact order (`PublishDialog.tsx`, transcribed directly from source): a header line reading **`publish-static-bundle — class 3 — irreversible`**; immediately below it, set apart in its own shaded block, **one plain-language sentence** naming the concrete outcome — e.g. *"This will create a folder named "my-parcels" at C:\dev\spatial-ide\target\manual-walkthrough-publish, containing the selected rows as one or more data partitions, the interactive viewer page, and a manifest."* (ADR-017's Exposure review, 2026-08-17, condition 1 — the human's own G3 finding on the PRE-condition dialog, verbatim: *"there's a lot of things written but not necessarily that clear"*; this sentence is the fix, composed host-side from the destination you chose in G2, and it names no row/partition COUNT because none is known yet at this point — the wording says "the selected rows" and "one or more data partitions" rather than inventing a number); then the field list — **Source** (the dataset's own logical name), **Source content hash** (`sha256:…`), **Style hash** (`sha256:…` — the style you set in G1; the dialog names that style by this hash alone and shows none of its colours, opacity or outline — added by `publish-approval-consult-gate-findings`, the advisor's wording, under the delegation of 2026-11-13), **Destination** (the FULL path you chose in G2, never truncated or ellipsized), **Grantor** (`os-user <your Windows account name> — grant remaining: <N>s`, a static number the host sent once, never ticking down), **Row scope** (a sentence naming whichever radio you left selected in G1 — *"row scope: the whole file — every row the dataset contains"* for Whole dataset, or the current-viewport wording for Current view), then directly after it, with no label of its own, **the columns line** — with G1's literal style it reads **"Columns published: id and the geometry only."** (composed host-side by `publish.rs::compose_published_columns`; added 2026-11-13 by `publish-approval-columns-line`); no filter-scope block (none is active yet — G8 is where that appears); then a standing, bold, red-orange warning reading **"This cannot be undone. Nothing here can remove a published bundle."** (verbatim — the same sentence `kernel/src/permission/approval.rs`'s CLI prompt already carries); then the instruction **"Type the destination's final path component to confirm."**, then, as a placeholder under P6 (`publish-approval-ttl-ten-minutes`), one sentence reading **"This approval expires after 10 minutes, and the publish then has to be started over."**, an empty text input, and **Cancel**/**Publish** buttons (**Publish** greyed out while the input is empty — typing anything at all enables it; nothing about what you type is checked client-side, only that it is non-empty). **JUDGE:** is the scope complete and readable — do you know exactly what will be written where, from what source, with what style, before you type anything? |
| G4 | Type a phrase you know is WRONG (e.g. `nope`) into the field and click **Publish**. | The dialog closes immediately — no re-prompt, no retry loop. In the Export section below, a typed refusal renders: code `publish-refused`, message **"refused: the confirmation did not name the destination. Expected exactly `<the destination's own final path component you chose in G2>`. Approval names *this* execution — a bare `y` would confirm that a key was pressed, not that the operator read where an irreversible publish was going (ADR-006 class 3; docs/09)"** (verbatim, with the bracketed part replaced by your own G2 destination's own final component — `kernel/src/permission/approval.rs`'s `ApprovalRefused::NotMatched` Display, crossing to the panel unmodified). No bundle exists at the destination you chose (the folder is empty or absent — check in Explorer if you like). **This is the one-prompt-no-retry property, felt live**: there is no "try again" control anywhere on the refusal itself — a new attempt means clicking **Export interactive map…** again, from the top, native picker included. |
| G5 | Click **Export interactive map…** again — either the same destination (now known to be untouched) or a fresh one — and this time type the CORRECT phrase (the destination's own final path component, read exactly off the dialog's own **Destination** field) and click **Publish**. | The confirming view is replaced by an executing view: a phase line (`role="status"`) that updates through the publish's real phases (`verifying-source`, `querying`, `query-running`, `writing-partitions`, `writing-style`, `writing-viewer`, `writing-manifest`, `finalizing` — `kernel/src/publish/mod.rs::PublishPhase::as_str`; not every phase is guaranteed to be observed on a fast, small-fixture run, `query-running` in particular per its own doc comment; no duration or percentage anywhere, ADR-018) and a **Cancel publish** button. On a fixture this small these may flash by too fast to read individually — judge only that phase text is present and changing, never its speed. The dialog then closes and a quiet summary renders in the panel: **"Exported."**, then a definition list — **Destination** (the bundle path), **Rows**, **Partitions**. No duration/`build_millis` figure anywhere (the evidence guard rail: the UI publish path is UNMEASURED this cut, and stays that way). Nothing auto-opens — no browser tab, no file-explorer window. |
| G6 | Open a text viewer (Notepad is fine) on `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`. | One JSON object per line — this file accumulates across every publish attempt ever made on this machine (every earlier automated `publish.mjs` run included), so scroll to the **last few lines**: your G4 attempt's own pair (an `intent` line, then an `outcome` line reading `"outcome":"refused"`, `"error_kind":"ApprovalRefused"`), then your G5 attempt's own pair (`intent` + `"outcome":"success"`). Both outcome lines read `"approval_route":"shell-dialog"`. Both intent lines' `"destination"` field is forward-slash-normalized and does not contain `C:\Users\<you>` or `C:/Users/<you>` — a `target\` destination like this walkthrough's own is outside the audit machinery's recognized user-profile roots, so it is reported plainly, as itself, with `"residual_classes":["local-filesystem-path"]` on the intent line **naming** that fact rather than hiding it (`kernel/PERMISSION-BOUNDARY.md`'s own declared behavior for this class — only a `credential`-class residual is fatal). **JUDGE:** is this the audit record you asked for — would it satisfy you, reading it in six months?<br><br>**Reading the audit log** (ADR-017's Exposure review, 2026-08-17, condition 2 — the human's own G6 finding, verbatim: *"honestly can't tell what's going on"*): rather than reading the raw JSONL above by eye, from `C:\dev\spatial-ide` run `cargo run -p spatial-kernel --bin publish-bundle -- --audit-show` (add a path argument, or set `SPATIAL_IDE_AUDIT_LOG`, to point at a log other than the default `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`). It prints one plain sentence per intent/outcome pair — your own G5 attempt should read something like `2026-08-17 08:44 — publish to C:/dev/spatial-ide/target/manual-walkthrough-publish/my-parcels — APPROVED via shell dialog and SUCCEEDED (2000 rows, 1 partition)`, and your G4 attempt something like `... — REFUSED: the confirmation did not match the destination (wrong phrase, or none given)`; an interrupted attempt (an intent with no outcome) reads `... — intent recorded, no outcome (interrupted?)`, and any line that fails to parse is reported as its own `CORRUPT` line rather than silently dropped. Read-only — this command never writes to the log. |
| G7 | From `C:\dev\spatial-ide\renderer\bundle-viewer`, run `node scripts/serve-bundle.mjs "<G5's own destination>" 8732` (on a fresh port, so it does not collide with any other `serve-bundle.mjs` session still running). Open the printed URL (`http://127.0.0.1:8732/viewer/index.html`). | The bundle viewer loads (a status line reads something like "1/1 partitions verified · 2000 features drawn, ..."), and the polygons' fill colour, fill opacity, and outline in this separately-loaded static page visibly match the style you set in G1 — the look-and-feel comparison Part F's F7 points to, reached by clicking **Export interactive map…** in the shell. The bundle is real: nothing about G5's success summary was a simulation. |
| G8 | Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then choose **Current view** and click **Export interactive map…** again; read the Export section, confirm a destination in the native picker, read the approval dialog, and click its **Cancel**. Then choose **Whole dataset**, keep the same filter on, and do the same once more. | With **Current view** chosen and a filter on, the Export section shows a filter sentence below the **Row scope** options and above the button, and the approval dialog carries it in its own alert block below **Row scope**: a placeholder sentence beginning **"[P6 placeholder] "**, saying this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1) (`publish.rs::FILTER_SCOPE_SENTENCE`). With **Whole dataset** chosen and the same filter on, neither the Export section nor the dialog shows it, and **Row scope** reads *"row scope: the whole file — every row the dataset contains"*. **Cancel without publishing** — either dismiss the native picker instead of confirming it (G2's own step), or, once the dialog appears, click its own **Cancel** button. No bundle is written either way. (Optionally, if curious: reopen the audit log — no new pair appears for either cancellation. This was checked, not merely asserted: reading `publish.rs` shows `AuditLog::open_for` and the intent record are written only *inside* `execute_with_progress`/`boundary::execute` — never during `prepare`, and `PublishDialog.tsx`'s own Cancel button (`handleAbandon`) never calls `execute` at all, so an abandoned-after-picker attempt reaches neither. Confirmed live as well, not only read: preparing an attempt through the dev-only test seam and deliberately never executing it left the audit log's line count and content completely unchanged — zero lines mentioned that attempt's own destination.) |
| G9 | Close the app window. | No crash dialog, no hang on exit — the same claim A10 makes. |
| G11 (added 2026-09-14 by rule 11 — entry 86's own preregistration queues the row into **this** Part, verbatim: *"one walkthrough row queued for the next sitting bundle (**Part G**), written as "zoom anchored at a window size that is not 1280×900""* (`renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md:55`). Numbered **after G9 and not before G10**, because G10 is the decision block below, not a table row — nothing is renumbered. **Needs a bundle published by a build that carries entry 86's fix (PR #53):** a bundle published earlier keeps its own frozen copy of the viewer, verbatim — *"it is absent only from bundles published by a build that carries this fix"* (`:47`) — so re-publish through G1–G5 on a current build rather than reusing an older bundle.) | Serve that bundle with G7's own command (`node scripts/serve-bundle.mjs "<the destination you just published to>" <a fresh port>`) and open the printed URL. **Resize the browser window so the viewer's canvas is clearly NOT its native 1280×900** — do the whole step once at a window much LARGER than that and once much SMALLER. In each size: put the pointer well **off-centre**, over a polygon corner or another feature you can name to yourself, hold the mouse completely still, and wheel-zoom IN two or three notches, then back OUT the same number. | The preregistration's binding rule, verbatim (`renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md:14`): **"The pointer and the view share ONE pixel space, and the conversion into it happens in exactly one function."** What to look at (this row's own paraphrase of that rule, not a quote): **the point under the pointer stays under the pointer** — the picture grows and shrinks about that point at both window sizes, and the corner you named does not walk off toward a window edge. Coming back out the same number of notches puts the view back where it started (verbatim, `:10`: *"Not cumulative: in-then-out returns exactly."*). **PASS/FAIL per the preregistration** — §3's post-fix discriminator, verbatim (`:30`): *"all three sizes read no displacement beyond the declared tolerance, in and out, and the solved anchor equals the pointer's world point."* **FAIL** is the pre-fix shape §3 records, verbatim (`:29`): *"large window → NW on zoom-in, SE on zoom-out; small window → reversed; CSS box forced to exactly 1280×900 → none."* — in the operator's terms (paraphrase): the named point sliding away from under the pointer one way going in and the other way coming out, at either non-native window size. **No speed, smoothness, sharpness or quality judgment is asked for here, and none may be recorded** (that preregistration's own block-on-sight list, `:51`). |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–F. (Except
G4 and G8's refusals/cancellations themselves — those ARE the expected outcome, not a deviation.)

### G10 — the decision

Addressed to the human, not to whoever is running this script. Nothing below is a checkbox.

**ADR-017's Status block, verbatim:** *"Acceptance condition attached by the human: before publish
is exposed through SKP, any shipped CLI/UI, MCP, plugin, notebook or AI surface — and **no later
than Prototype exit** — the kernel must enforce a **scoped publish grant, explicit approval, and a
redacted audit record** (the §15/§18 obligations). Until then `publish-bundle` remains
developer/test tooling only."*

**The 2026-08-07 clarification to that condition, verbatim:** *"...exposure through SKP, any
shipped CLI/UI, MCP, plugin, notebook or AI surface additionally requires that **the exposure
surface itself pass review**, and that review must verify one rule in particular: **the requester
must never mint the grant** (F-5). Until such a surface exists and passes, `publish-bundle` remains
developer/test tooling."*

**What this cut built and evidenced, briefly:** a binding-local, two-command host seam
(`binding_publish_prepare`/`binding_publish_execute`, never SKP); a grant minted host-side from the
native picker's own answer and the dataset's own `ContentPin`, never from anything JS asserts (F-5,
exercised by every automated and manual attempt above); a DOM approval surface whose one comparison
stays in Rust (no JS ever sees or checks an expected phrase); per-attempt audit logging (F-9); a
reviewer gate over the whole cut (B1/B2 fixed as blocking, S1/S2/S5 fixed, S3/S4 named as debt, not
silently dropped); an automated suite (`e2e/publish.mjs`: `OPEN`/`APPROVED'`/`REFUSED'`/`FILTERED'`
green, `EXPIRED'` unit-tested instead of run); and this walkthrough, G1–G9, as the operator's own
click-through of exactly what none of that automation can reach.

**The question only you answer:** does this surface satisfy the clarified condition — has the
exposure surface itself passed review, with F-5 verified live (the requester never mints the
grant)? Is publish now permitted to be a product feature **on this surface** — the shell's UI, this
exact two-command seam, this exact DOM dialog — and on this surface *alone*? (SKP, MCP, any
plugin/notebook/AI surface stay fenced regardless of this ruling; ADR-017's condition is per-surface,
and none of those have been built or reviewed by this cut.)

Your ruling goes in this Part's own result log below, in your own words. **Nothing else in this
tree — no ADR, no `CUT-STATE.md` section, no docs page — may claim the condition discharged until
it is written there.**


## (iii) Part Y: lines 1864 to 1875 of the walkthrough at ad2088a8

*Byte for byte by script, 2447 bytes, sha256 9d58da5e6329f42c6aedbe8f502d58020f3ede0df1ba97ca75073c844e6cf83e.*

## Part Y — Export's Current view after the map moves by itself: the numbers in the dialog's Row scope, and the wording of the new strings (export-current-view-after-unreported-fit)

This Part is the Operator gate of `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md` §9 (its rows X0 to X4 are this Part's Y0 to Y4, per its Amendment 3 item 7), run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict on whether Current view sends the area the map shows, and is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e): the rows are the form's, and their sentences are not the human's wording.*

| # | Step | Expected outcome |
|---|---|---|
| Y0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| Y1 | Open `filter-zoned.parquet` and wait until the map has drawn its data. Before any pan or zoom, open the Export section. | Current view can be chosen, and no reason is shown beside it. |
| Y2 | Pan the map to a corner of the data, then Apply `zone = 'residential'`; the map fits itself to the matches. Click **Export interactive map…** with Current view chosen, read the four numbers in the dialog's Row scope, and abandon the dialog. Then click Zoom to layer, export again, read the numbers, and abandon. | The Row scope line reads: the map's extent when Export interactive map… was clicked, with xmin, ymin, xmax and ymax. Record both sets of numbers. **Felt:** do the numbers tell you the area is the one on the map? |
| Y3 | Clear the filter; the map fits itself to the whole file. Click **Export interactive map…** with Current view chosen, read the four numbers, and abandon. Then drag a splitter to shrink the map, export Current view again, read the numbers, and abandon. | The numbers after the shrink differ from those before it. Record both sets. |
| Y4 | The P6 sight of the new strings: the reason Current view cannot be chosen yet (it shows only while the map has not drawn the file's data), and the Row scope sentence in the approval dialog. | Record the wording you approve or replace. If you did not see the reason in this run, say so. |


## (iii) Part AC: lines 1978 to 1999 of the walkthrough at ad2088a8

*Byte for byte by script, 12613 bytes, sha256 0140655d0104e43b1143c0e5da59f6b837febfb93a8b72db8af501a6d408104d.*

## Part AC — the attributes of the inspected feature, colour by a column, and the table in Activity: click a feature and read its columns, a NULL, and what the app leaves out; colour a layer by a column, go back to one colour and export it; list the features in the table under its three scopes (shell-migration-milestone-4, PR A, PR B and PR C)

This Part is the Operator gate of `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md` §9, with PR A's rows, PR B's rows and PR C's rows, run only on a build after PR A's, PR B's and PR C's merges, with a blank result log. It is the human's felt verdict on O-07 step 5's attributes, on O-07 step 7's colour by a column, and on the form's OPEN-2 (b) question (does the first view feel slower on a file with many columns). Its row numbers are §9's own: AC3 to AC5 are PR B's, AC6 to AC8 are PR C's, and AC12 is PR B's one added row. Every sentence in it is a draft for the human's sight (P6) and none is the human's wording; PR B's rows are drafts that become the advisor's wording, under the human's delegation of 2026-11-13, once the advisor rules them.

**Before AC1:** fixture `attributes-multitype.parquet`, new (500 polygons with seven attribute columns; regenerate with `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_attributes_multitype_fixture -- --ignored --nocapture`, which also writes `attributes-multitype.oracle.json`, the values of five ids that `e2e/attributes.mjs` compares); the app started with no dataset open, so that AC1 opens one. For AC3 to AC5 the fixture is `filter-zoned.parquet` (2,000 features; its `zone` column has four values, and at least one feature has none), and AC5 also needs a destination under `C:\dev\spatial-ide\target\` as Part G's G2 names it. For AC6 to AC8 the fixtures are `filter-zoned.parquet`, `100k-happy-path.parquet` and `slow-filter-scan.parquet` (the manual-walkthrough fixtures the filter suite uses). For AC12 the file is one whose attribute data passes the map's limit of 268,435,456 bytes (KNOWN-LIMITATIONS item 51); no fixture of this document reaches it, so bring one, and record which.

| # | Step | Expected outcome |
|---|---|---|
| AC0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AC1 | O-07 step 5. Open `attributes-multitype.parquet`. With the Navigate tool, click a feature. Open the Feature tab if it is not showing. | Under the feature's id, the Feature tab lists `zone`, `area`, `f32`, `i64`, `flag` and `text`, in that order, each with its value. The `i64` value shows every digit. **Felt:** is it readable, and where did you look? |
| AC2 | Click features until one shows no value for `zone` (about one in five). Read the line under the values. | A missing value shows the marker, not an empty cell. A line under the values names the columns that are not shown (`d32`, and the covering box column if the file has one). **Felt:** is it clear what the marker means and why those columns are left out? |
| AC3 | O-07 step 7. Open `filter-zoned.parquet`. In the Inspector's Style tab, choose `zone` in **Colour by** (this control sits below the **▸ Style** disclosure, which can stay collapsed), click **Apply**, and read the line and the legend under the button. Look at the map. | While the first features are read, the line says so and a **Cancel** button shows. Then the line reads that some number of distinct `zone` values were found among the first features read, and how many of them are drawn as Other; the file has 2,000 features and the app reads at most 1,000, so record the three numbers. The legend lists the `zone` values found, in code-point order, then **No value**, then **Other**, each with a swatch. On the map each feature is drawn in the swatch of its value, and a feature with no `zone` in the **No value** swatch (KNOWN-LIMITATIONS item 65). **Felt:** where did you look for the legend, and does it feel like the layer's style? **Strings for sight (P6):** the **Colour by** label and the chooser's first option, the **Apply**, **Cancel** and **One colour** buttons, the line while the values are read, the line after the apply (`Coloured by <column>: <n> distinct values found among the first <m> features read, <k> of them drawn as Other. A value not among those features also draws as Other.`, with the mark `[P6 placeholder]` before it), the five lines that say nothing was applied (cancelled; the values could not be read; the session ended; the filter changed while the values were read; the column holds no value among the features read), the line for an export in progress, the line for a file with no column that can colour the map, the legend's name as a screen reader reads it, the legend's **No value**, **Other** and empty-text entries, and the command bar's two entries **Colour by** and **Table** (`/colour` and `/table`). No step here reaches the five lines that say nothing was applied, the line for an export in progress or the line for a file with no such column, so those seven are for sight as their text from the source. |
| AC4 | With the colour from AC3 on, click **One colour**. | The map returns to one colour, the one the **Fill colour** swatch shows. The legend is gone, the line under the button is empty and the button is disabled. With **▸ Style** expanded, the text block's `fill_color` is a literal again. **Felt:** is it the colour you expected back? |
| AC5 | Colour `filter-zoned.parquet` by `zone` again as AC3 does. Export it by Part G's route: G1's **▸ Export** disclosure, **Export interactive map…**, G2's native Save dialog with a destination under `C:\dev\spatial-ide\target\`, then read G3's approval dialog before typing. Then type the destination's final path component, click **Publish**, serve the bundle and open it as G7 does, and hover a feature in the viewer. | **Prediction (the milestone-4 form's Amendment 14 item 2; a wrong prediction is class 2):** directly after **Row scope**, with no label of its own, the approval dialog's field list shows the line `Columns published: id, the geometry, and zone.`, above the sentence that the publish cannot be undone. The bundle draws each zone in the swatch colour the shell's legend showed, and a feature with no `zone` in the **No value** colour; the viewer's legend lists the same entries; and the viewer's hover lists the feature's id and `zone` with its value, or `(no value)` for a missing one (KNOWN-LIMITATIONS item 59). A column whose name contains a comma and a space would read in that line as more than one column (KNOWN-LIMITATIONS item 66); `zone` does not. **Felt:** does the bundle look like the map you exported, and did the line say what you expected it to? **Strings for sight (P6):** the viewer's own words, which are not placeholders: its legend's two entries for a missing value and for any other value, and its hover's marker for a missing value. |
| AC6 | O-07 step 6. Open `filter-zoned.parquet`. Choose the Select tool and click five features. Apply a filter that hides some of them (for example `zone = 'residential'`). Open Activity, choose the Table tab, and look at the three scope options before you open the selector: `Filtered`, `Selected` and `Selected, ignoring filter`. Then open the selector and switch between them. | `Filtered` lists the features that pass the filter, with a line that says how many (below 1,000 it says all of them). `Selected, ignoring filter` lists all five, each with its values. `Selected` lists the selected features the app knows pass the filter, and its line counts the others: those that do not pass, and those it could not check (KNOWN-LIMITATIONS item 55). **Felt:** is the scope clear before you open the selector? **Strings for sight (P6):** the Table tab's label, the selector's label, the grid's name, the "Showing all … features" line, the "Showing … of … selected features" line, the "Showing all … selected features, ignoring the filter" line, and the markers a selected feature's cell can show when its attribute data was not held or was cut. |
| AC7 | Open `100k-happy-path.parquet`, open Activity and choose the Table tab. | The Table fills to 1,000 features and its line says it shows the first 1,000 features returned, in no declared order, and that more may be there (KNOWN-LIMITATIONS item 54). **Felt:** is the line at the limit clear about what the table does not show? **Strings for sight (P6):** that line, and the line the table shows if it stops adding features because its attribute data would pass 64 MiB: "The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first N features returned, in no declared order; more may pass the filter." No step here is designed to reach that ceiling, so that line is for sight as its text. |
| AC8 | Open `slow-filter-scan.parquet`. Apply the filter `id > 3999900`. Open Activity, choose the Table tab, and click Cancel while the loading line shows. | While the scan runs, the Table shows a line that it is loading features, with a Cancel button. After Cancel the line and the button are gone, and the Table says it was cancelled and shows the features it had, in no declared order. The Console tab shows the Table's `viewport_query` and then a `cancel` row. **Felt:** is it clear that Cancel stopped the load? **Strings for sight (P6):** the loading line, the Cancel button, the cancelled line, the "could not be loaded" line, the line the table shows while an export runs, the line it shows after the dataset's session ended, the Console's statements for the Table's scope choice and Cancel, the Console's statement for switching Activity tabs, which now names the Table tab, and the code `table-failed` the table shows when it fails for a reason the kernel did not give. |
| AC9 | Move the pointer over a feature without clicking. | The readout at the bottom left of the map shows the feature's id and the coordinates of its first vertex only. **Felt:** did you expect attributes on hover? (KNOWN-LIMITATIONS item 52.) |
| AC10 | The P6 sight of every new string of PR A, and of B1's eight projection refusal messages from their committed error fixtures (`protocol/skp/tests/data/v0-error-projection_*.json`, OPEN-14). The Attributes section: its three lines (no column is projected, the attributes are not held for this feature, and the not-projected line with its count of columns left out over the limit of 32) and the marker for a missing value. The status bar: its line for attributes that are not held. The console's row for inspecting a feature. The Attributes section's name as a screen reader reads it. The three messages for attribute data the shell does not read, from the source: `UnexpectedProjectionError` and the column-type message in `frontends/shell/src/canvas/decodeBatch.ts`, and `readCell`'s message in `frontends/shell/src/attributes/values.ts`. PR B's two sentences for a session that ended because the source watch lost coverage of the file, which no step here provokes (KNOWN-LIMITATIONS item 57), so they are for sight as their text from the source: the last-click line's refusal (`HOVER_SESSION_COVERAGE_LOST_TEXT` in `frontends/shell/src/canvas/HoverReadoutView.tsx`), and the reason in the selection-ended line (`ENDED_BECAUSE` in `frontends/shell/src/feature/FeatureTab.tsx`). **Read the last amendment first.** | Record, for each string, whether it stands, and the wording you want where it does not. |
| AC11 | OPEN-2 (b). Open a real parcel file with many columns, and look at the map as it first fills. | **Felt:** did the first view feel slower than before this change? No figure is taken and none is claimed. |
| AC12 | A Colour by on a column the map is not already coloured by while the status bar says that some features' attributes were not held. Open the file you brought for AC12 (see Before AC1) and wait until the status bar says that some features' attributes were not held. In the Style tab, choose a column in **Colour by** and click **Apply**. Watch the map, then read the status bar. Then pan or zoom once. | The map is cleared and the view moves to fit the first features that arrive. The map then shows at most the first 10,000 rows the file returns under the filter in force, until your pan or zoom, and the status bar still says that some features' attributes were not held (KNOWN-LIMITATIONS item 51). Record what the status bar says besides, and whether the view moved. **Felt:** did the jump of the view surprise you, and is it clear from the screen that the map shows only part of the file? |


## (iv) and (vi) Part P, points: lines 1622 to 1658 of the walkthrough at ad2088a8

*Byte for byte by script, 9613 bytes, sha256 0ff17f92f2bd63454375816893da9f9d2291490392544c2c04320874439553f0.*

## Part P — points: the P-1 fixture, the pick rule, and the wording of the new strings (geometry-points-cut)

**This is the points cut's Part P.** An earlier Part P exists above (crs-unit-fact-and-bounds, the degrees tile grid); the two are told apart by their titles, and a row here is cited as "P2 (points)" where the earlier one could be meant.

This Part is the Operator gate of `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, run in the same sitting as Part S. It is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). The form's amendments are read last amendment first. The radius and the pick rule are the human's declared choices (question round 62, items 3 and 4), and a verdict recorded here may revise them.

**Before P1:**
- Read the form's §10, its last amendment first.
- Generate the fixtures: from `C:\dev\spatial-ide`, run `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture generate_the_point_p1_fixture generate_the_point_pile_fixture generate_the_declared_linestring_fixture generate_the_declared_polygon_and_point_fixture generate_the_multipolygon_f1_with_covering_fixture`.
- Verify corpus files #2, #4 and #5 against `MANIFEST.json` as Part N's "Before N1" note describes.

| Fixture | Path | Used by |
|---|---|---|
| P-1, six Point rows with distinct coordinates, LV95, declared `["Point"]`, with a covering | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\point-p1.parquet`, written by `generate_the_point_p1_fixture` | P1, P2, P3, P4 |
| The pile file (P-1's six points and a pile of five more within about 7 cm of P-1's second point, LV95, declared `["Point"]`, with a covering) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\point-pile.parquet`, written by `generate_the_point_pile_fixture` | P2 |
| Compat-corpus file #5 (a `geoarrow.point` file in degrees, no `crs` key) | `C:\dev\spatial-ide\target\fixtures\compat-corpus\duckdb-spatial\duckdb-degreesrange-nokey.parquet` — sha256 `b471a90f2e87e91e83c2de6c5fd73bc9ea7ab83fbea1c733988eeaef725357af` (`MANIFEST.json`'s own `sha256` field) | P5 |
| Compat-corpus file #2 (a Point file whose `crs` key is explicitly null) | `C:\dev\spatial-ide\target\fixtures\compat-corpus\geopandas\gp-nocrs-nokey.parquet` — sha256 `a55e41bbfd4c3e43d0771484ee99f2543a9089523e9ba90066499a2c136a46a6` | P6 |
| Compat-corpus file #4 (a Point file in the LV95 range, no `crs` key) | `C:\dev\spatial-ide\target\fixtures\compat-corpus\duckdb-spatial\duckdb-lv95range-intkey.parquet` — sha256 `7a9da027167681ee04d7f4d25c85bbfff6795bed9829c5c3ab71addfc9a7e403` | P6 |
| The LineString-declared file (P-1's rows, `geometry_types` declares `["LineString"]`) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\declared-linestring.parquet`, written by `generate_the_declared_linestring_fixture` | P7 |
| The Polygon-and-Point file (P-1's rows, `geometry_types` declares `["Polygon","Point"]`) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\declared-polygon-and-point.parquet`, written by `generate_the_declared_polygon_and_point_fixture` | P7 |

| # | Step | Expected outcome |
|---|---|---|
| P1 | **P-1 opens and draws as symbols.** Click **Open GeoParquet…** and select P-1. Let the first view settle (Part A's A4 shows what "settled" looks like), and click **Zoom to layer** if the points are small. | The open is admitted and the canvas draws six round symbols, each with a fixed on-screen radius of 4 pixels, in the style's fill. The describe summary shows the geometry row as `geometry (geoarrow.point)` and, as a separate labelled row, the file's own declaration, `Point`. No refusal and no error banner appears after the stream settles. Record what the six symbols look like (size, colour, whether any is clipped), and whether the two summary rows read as two separate facts. |
| P2 | **Hover, the refusal, and a pile of points.** With P-1 open: **(a)** hover the centre of one symbol. **(b)** Hover a place between symbols. **(c)** Zoom out with the wheel, a notch at a time, hovering over a symbol after each notch, until the hover shows the named refusal instead of an id. **(d)** Open the pile file (`point-pile.parquet`, below), click **Zoom to layer**, and hover the pile: the place where six symbols overlap on screen, on the second point of P-1's bottom row. P-1's own points sit about 9.6 m apart or more and the refusal in (c) begins before their symbols touch, so P-1 shows no pile that the hover still answers; the pile file holds P-1's six points and five more within about 7 cm of that second point, and its average on-screen spacing stays at or above the 9 px threshold at the zooms where the pile's symbols overlap. If the file cannot be opened, write "no pile available" on the verdict line and report it: the verdict then stays open. | (a) One readout, one `id` line; the six symbols give six different ids, in the order the file holds them. (b) No readout appears. (c) At a coarse enough zoom the readout is the named refusal state (the same state and text that Part L's L7 shows for polygons), and it stays until you zoom back in. (d) Whatever the hover names, it is one id. **Record, on the last line of this row's result: whether naming the topmost symbol of a pile is acceptable to you.** Option (B) of question round 62, item 4 is the follow-up only if this verdict says it is not. |
| P3 | **Style edits apply to the points.** With P-1 open, click the **▸ Style** disclosure and change **Fill colour**, **Fill opacity**, **Outline width** (to above 0) and **Outline colour**, as Part F's F2 and F4 do. | Each edit changes the symbols at once: the fill colour and opacity change the circles' fill, an outline width above 0 gives each circle an outline in the chosen colour and width, and an outline width of 0 removes it. The radius does not change. The text block at the bottom of the panel still reads `"geometry":"polygon"`, because the style document has no point geometry yet (KNOWN-LIMITATIONS item 35). Nothing is saved. Record whether the symbols read as the style you chose, and whether the 4 pixel radius is the size you want. |
| P4 | **Publishing P-1 is refused.** With P-1 open, click **Export interactive map…** and start a publish to a fresh destination under `C:\dev\spatial-ide\target\`. | The publish is refused before any approval prompt: a refusal carrying the code `publish.geometry_encoding_not_publishable` and a message that starts with `[P6 placeholder]` and names `geoarrow.point`. No approval dialog opens and the destination folder is not created. Record the code and the message verbatim, and whether it was clear why a point file cannot be published. |
| P5 | **Corpus #5 opens, and the canvas refuses for want of a covering.** Click **Open GeoParquet…** and select corpus file #5. | The open is admitted under the format rule (`crs:format-default`): the CRS line reads `OGC:CRS84` with the format-rule source, the geometry row reads `geometry (geoarrow.point)`, and the declaration row reads `Point`. The canvas then shows a refusal with the code `engine.no_covering_bbox`, because this file declares no covering and a viewport query needs one. No point is drawn. Record the code and the message verbatim. |
| P6 | **Corpus #2 and #4 are refused by name.** Open corpus file #2, then corpus file #4. | #2 is refused with the code `engine.crs_undeclared` (its `crs` key is explicitly null), and the CRS assertion form appears under it, as Part N's N4 shows for a no-CRS file. #4 is refused with the code `engine.format_default_contradicted`, because its `bbox` leaves the ±180 and ±90 range that the format's absent-key default would imply. Record each code and message verbatim. |
| P7 | **The wording, for your decision.** **(a)** Open the LineString-declared file and read the refusal: the code is `engine.geo_metadata`, and the detail is the engine's sighted wording, whose readable-set clause now names Polygon, MultiPolygon and Point. **(b)** Open the Polygon-and-Point file and read the refusal: the code is `engine.geo_metadata`, and the detail is a `[P6 placeholder]` stating that this build reads one kind per geometry column. **(c)** Read every other new `[P6 placeholder]` string where it is written: `engine/src/wkb.rs` (the Point row refusals: EWKB flags, a type other than 1, a NaN coordinate, trailing bytes), `engine/src/geoarrow.rs` (`MIXED_KINDS_DRAFT`), `frontends/shell/src/canvas/decodeBatch.ts` (`UnexpectedEncodingError`) and `frontends/shell/src/canvas/limits.ts` (`PickCeilingExceeded`). **(d)** Read `KNOWN-LIMITATIONS.md` items 31 to 36, which are draft wording. | (a) The detail is not a placeholder; record whether it reads as honest and clear with three types in its clause. (b) The detail starts with `[P6 placeholder]`. For each string in (b) and (c) the log records either the wording you want in its place, or "keep". Until then every one stays a placeholder, and none ships as settled wording. For items 31 to 36, record whether each reads as honest to you; items 35 and 36 are the drafts of the radius and the pick rule. |

**If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. In P1, the deviation this row exists to catch is a refusal, an error banner, or a point drawn at the wrong place (for instance, mirrored along a diagonal). In P4, it is an approval dialog opening, or a destination created.

**Sitting estimate (scheduling only, not a claim about the app):** a few minutes for P1 to P6 and a reading pass for P7.

---


## (iv) and (vi) Part T: lines 1680 to 1710 of the walkthrough at ad2088a8

*Byte for byte by script, 8887 bytes, sha256 55e5d54cd076b5634f0b114d0642f82050411bef211d726f0120727eac534ea9.*

## Part T — lines: the L-1 and ML-1 fixtures, the pick tolerance, the casing, and the wording of the new strings (geometry-lines-cut)

This Part is the Operator gate of `engine/GEOMETRY-LINES-PREREGISTRATION.md`, run in the same sitting as Part S and Part P (points), and only on a build after that cut's merge. It is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). The form's amendments are read last amendment first. The line width, the casing and the pick tolerance are the human's declared choices (the form's Amendment 1, items 3 and 4), and a verdict recorded here may revise them.

**Before T1:**
- Read the form's §10, its last amendment first.
- Generate the fixtures: from `C:\dev\spatial-ide`, run `cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture generate_the_line_l1_fixture generate_the_multilinestring_ml1_fixture generate_the_declared_geometrycollection_fixture generate_the_declared_polygon_and_linestring_fixture generate_the_declared_linestring_fixture`.

| Fixture | Path | Used by |
|---|---|---|
| L-1, five LineString rows of 2, 3, 5, 2 and 4 positions (rows 1 and 3 cross), LV95, declared `["LineString"]`, with a covering | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\line-l1.parquet`, written by `generate_the_line_l1_fixture` | T1, T2, T4, T5 |
| ML-1, three MultiLineString rows of 2, 1 and 3 parts, LV95, declared `["MultiLineString"]`, with a covering | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\multilinestring-ml1.parquet`, written by `generate_the_multilinestring_ml1_fixture` | T3 |
| The GeometryCollection-declared file (P-1's rows, `geometry_types` declares `["GeometryCollection"]`) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\declared-geometrycollection.parquet`, written by `generate_the_declared_geometrycollection_fixture` | T6 |
| The Polygon-and-LineString file (L-1's rows, `geometry_types` declares `["Polygon","LineString"]`) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\declared-polygon-and-linestring.parquet`, written by `generate_the_declared_polygon_and_linestring_fixture` | T6 |
| The LineString-declared file (P-1's point rows, `geometry_types` declares `["LineString"]`, no covering) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\declared-linestring.parquet`, written by `generate_the_declared_linestring_fixture` | T6 |

| # | Step | Expected outcome |
|---|---|---|
| T1 | **L-1 opens and draws as lines.** Click **Open GeoParquet…** and select L-1. Let the first view settle (Part A's A4 shows what "settled" looks like), and click **Zoom to layer** if the lines are small. | The open is admitted and the canvas draws five lines, each 2 pixels wide at any zoom, with rounded joins and ends, in the style's fill colour; two of them cross. The describe summary shows the geometry row as `geometry (geoarrow.linestring)` and, as a separate labelled row, the file's own declaration, `LineString`. No refusal and no error banner appears after the stream settles. Record what the five lines look like (width, colour, whether any is clipped), and whether the two summary rows read as two separate facts. |
| T2 | **Hover, the tolerance, the crossing and the refusal.** With L-1 open: **(a)** hover directly on a line. **(b)** Hover about 3 pixels beside a line. **(c)** Hover about 10 pixels away from every line. **(d)** Hover where L-1's two crossing lines meet (rows 1 and 3). **(e)** Zoom out with the wheel, a notch at a time, hovering over a line after each notch, until the hover shows the named refusal instead of an id. | (a) One readout, one `id` line. (b) The same `id` as (a) for that line. (c) No readout appears. (d) One readout, one `id` line; **record which of the two ids it names.** (e) At a coarse enough zoom the readout is the named refusal state (the same state and text that Part L's L7 shows for polygons), and it stays until you zoom back in. **Record, on the last line of this row's result: whether naming the topmost of two crossing lines is acceptable to you.** |
| T3 | **ML-1: two parts of one feature.** Open ML-1 and let its first view settle. Click **Zoom to layer** if the lines are small. Row 0 is the two lines at the bottom left (a straight one, and a bent one above it). Hover the straight line, then the bent one, and read the hover readout each time. Then hover the single vertical line to their right (row 1) and read it. | The summary shows `geometry (geoarrow.multilinestring)` and the declaration `MultiLineString`. The two parts of row 0 give the **same readout**: the same `id` line, from one feature, and never two different ids. Row 1's readout is a different `id`. The canvas draws all six lines. Record the three readouts, in the order hovered. |
| T4 | **Style edits apply to the lines.** With L-1 open, open the Inspector's Style tab, click the **▸ Style** disclosure and change **Fill colour**, **Fill opacity**, **Outline width** (to above 0) and **Outline colour**, as Part F's F2 and F4 do. | The fill colour and opacity change the lines at once. An outline width above 0 draws a casing beneath each line, in the chosen outline colour, 2 pixels plus twice the outline width wide, so that the outline shows on both sides; an outline width of 0 removes it. The width of the line itself does not change. With a fill opacity below 1 the casing shows through the line, and where lines cross they are drawn darker. The text block at the bottom of the panel still reads `"geometry":"polygon"`, because the style document has no line geometry yet (KNOWN-LIMITATIONS item 37). Nothing is saved. **Record whether 2 pixels is the width you want, and whether the casing looks right at the default opacity.** |
| T5 | **Publishing L-1 is refused.** With L-1 open, click **Export interactive map…** and start a publish to a fresh destination under `C:\dev\spatial-ide\target\`. | The publish is refused before any approval prompt: a refusal carrying the code `publish.geometry_encoding_not_publishable` and a message that starts with `[P6 placeholder]` and names `geoarrow.linestring`. No approval dialog opens and the destination folder is not created. Record the code and the message verbatim, and whether it was clear why a line file cannot be published. |
| T6 | **The wording, for your decision.** **(a)** Open the GeometryCollection-declared file and read the refusal: the code is `engine.geo_metadata`, and the detail is the engine's sighted wording, whose readable-set clause now names five types. **(b)** Open the Polygon-and-LineString file and read the refusal: the code is `engine.geo_metadata`, and the detail is a `[P6 placeholder]` stating that this build reads one kind per geometry column and naming the kinds present. **(c)** Open the LineString-declared file. **(d)** Read every other new `[P6 placeholder]` string where it is written: `engine/src/wkb.rs` (the line and multiline row refusals: EWKB flags, a type other than 2, fewer than two positions, zero parts, trailing bytes), `engine/src/geoarrow.rs` (`MIXED_KINDS_DRAFT`), `frontends/shell/src/canvas/decodeBatch.ts` (`UnexpectedEncodingError`) and `frontends/shell/src/canvas/limits.ts` (`PickCeilingExceeded`). **(e)** Read `KNOWN-LIMITATIONS.md` items 31 to 33, 37 and 38, which are draft wording. | (a) The detail is not a placeholder; record whether it reads as honest and clear with five types in its clause. (b) The detail starts with `[P6 placeholder]`; record the kinds it names. (c) The open is admitted: the summary shows `geometry (geoarrow.linestring)` and the declaration `LineString`. The rows are points, so the engine stops the stream at row 0 with `engine.wkb`, naming the type met; this file declares no covering, so the canvas's viewport query may meet `engine.no_covering_bbox` first, as P5 shows for another file without one. **Record the code shown and the message verbatim.** For each string in (b) and (d) the log records either the wording you want in its place, or "keep". Until then every one stays a placeholder, and none ships as settled wording. For items 31 to 33, 37 and 38, record whether each reads as honest to you; items 37 and 38 are the drafts of the line width and the pick tolerance. |

**If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. In T1, the deviation this row exists to catch is a refusal, an error banner, or a line drawn at the wrong place (for instance, mirrored along a diagonal). In T3, it is a second id for one feature (a hover on one part and a hover on another part of row 0 giving different readouts). In T5, it is an approval dialog opening, or a destination created.

**Sitting estimate (scheduling only, not a claim about the app):** a few minutes for T1 to T5 and a reading pass for T6.

---


## (vi) Part P, the degrees tile grid: lines 1463 to 1492 of the walkthrough at ad2088a8

*Byte for byte by script, 3104 bytes, sha256 a8059a895f92c543009dd360b62f9fa8e19e14f3bd5e8e4f110ffab6354b8213.*

## Part P — crs-unit-fact-and-bounds: the degrees tile grid, at corpus #8 (P6)

**Part O is reserved** (`PLAN.yaml` node `briefb-part-o-walkthrough`, "the nine-step recipe
walkthrough, after B3 only") — this piece's own row lands as Part P instead, so Part O's own future
content is never displaced.

This Part is `frontends/shell/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md` §9's own Operator gate,
discharged once it is run and its result log is filled, not before. **No duration in the row or its
expected outcome** (`docs/08_Testing.md`; ADR-018) — the expected outcome is a session-log field and
an absence of visible change, never a time, a rate, or a smoothness judgment.

**Fixture this Part reuses — nothing new is written for it.**

| Fixture | Path | Used by |
|---|---|---|
| Compat-corpus file #8 (`crs:format-default`, OGC:CRS84) | `C:\dev\spatial-ide\target\fixtures\compat-corpus\gdal\ogr2ogr-epsg4326-default.parquet` — sha256 `79dabf9db66acad5c3adf6c001d1be2a68ecb4ea08afd73690dfaa1519a96bb7` (`target\fixtures\compat-corpus\MANIFEST.json`'s own `sha256` field; first 12 hex `79dabf9db66a` matches `engine/ADMISSION-PREREGISTRATION.md` §3 row 8; the same file Part N's N1/N5 already use) | P1 |

| # | Step | Expected outcome |
|---|---|---|
| P1 | Verify the fixture's hash against `MANIFEST.json` as Part N's own "Before N1" note describes. Click **Open GeoParquet…** and select the file above. The candidate arm is the default (`residencyArm.ts:50`'s own `DEFAULT_RESIDENCY_ARM`) — no arm switch needed. Let the first view settle (Part A's A4 shows what "settled" looks like), then open the newest `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log` (Part M's M12 own path) and find its `candidate-grid-frame-established` line (the `logSessionEvent` call in `establishFrameFromExtent` that writes the `candidate-grid-frame-established` event, `frontends/shell/src/residency/candidateArmSession.ts`). | Nothing on screen changes from what Part N's own N1 row already shows for this file — same summary, same CRS/provenance/display-convention lines, same rendered features. The session log's `candidate-grid-frame-established` line reads `baseSpan=0.8005154172768005…` (the JavaScript number for `2*Math.max(0.40025770863840027, 0.39821605223940537)`, approximately 0.8005; it was `baseSpan=2` before this piece — `MANUAL-WALKTHROUGH.md`'s own Part N run record above and the consult's P0 Step 3, `state/consults/2026-09-24-crs-unit-fact-and-bounds.md`) — the degree-keyed `MIN_ANCHOR_SPAN` (`1e-6`, `frontends/shell/src/canvas/tileGrid.ts`) applied to this file's own ~0.40°×0.40° extent, padded x2, instead of the metre-basis floor of 1. Record the line's exact `baseSpan=` value. |

**If anything deviates:** stop, record the exact step, and report it, same as every earlier Part. A
visible change on screen, or a `baseSpan` value that is not approximately 0.8005, is the deviation
this row exists to catch.

**Sitting estimate — scheduling only, not a claim about the app:** a few minutes: one corpus open, one
settle, one session-log read.

---


## (vi) Part W: lines 1821 to 1841 of the walkthrough at ad2088a8

*Byte for byte by script, 5683 bytes, sha256 f5d01f9f366e6ac59de33e5ce5d693b63b49e12b6cfbaebbd061d8a87b5f7aee.*

## Part W — selection and scope: the Select tool, a selection that survives a filter and a pan, the hidden count, a stated export scope (shell-migration-milestone-2)

This Part is the Operator gate of `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md` §9, run only on a build after that piece's merge, at 1366 x 768, with a blank result log. It is the human's felt verdict on O-07 steps 4, 5 and 6, and is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e of `state/directives/2026-10-11-direction-after-status-review.md`): the step lines follow the form's §2.8 rows and Amendments 1, 2 and 7; the Expected outcome cells and the sentences around the table are drafts.*

| # | Step | Expected outcome |
|---|---|---|
| W0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| W1 | Open `filter-zoned.parquet`. Read the tool switch and its statements. | The switch shows Navigate and Select, with one line each saying what a click does. The mode picker is absent while Navigate is active. |
| W2 | Step 4. Choose Select, then Replace. Click five features, then choose Add only and click one more. Look at the cursor over the map in Select. | Under Replace each click leaves only the clicked feature selected (Selected, ignoring filter: 1); Add only then adds the sixth (2). The cursor in Select is the arrow, and a drag is the grabbing hand. **Felt:** are the four modes clear without trying them, and can you say how the selection differs from the filter? **This row also observes H7:** real mouse clicks reach the map's tap in WebView2. |
| W3 | Step 5. Choose Navigate. Click a selected feature, then an unselected one. Open the Feature tab and try Pin. | A Navigate click inspects and leaves the selection as it was. **Felt:** did you think the selection had changed, and are the two encodings enough to tell selected from inspected? **Felt:** did you expect the Feature tab to come forward on a Navigate click, and does a feature that is both selected and inspected visibly show both? |
| W4 | Step 6. Apply the filter `zone = 'residential'`, and read the summary. | The selected count is unchanged, and the hidden count is shown. **Felt:** is the hidden count explained where you looked? |
| W5 | Choose Zoom to selection. | The map moves over the selected features. |
| W6 | Pan away and back, then clear the filter. | The selection is intact. |
| W7 | Zoom out until the readout shows the below-resolution state, then click in Select. | Nothing changes, and the state is shown. |
| W8 | Read the Export section's scope statement with a selection standing. | The statement says what the export covers and that the selection is not used. **Felt:** did you expect export to use the selection? |
| W8a | Start a whole-file export of `100k-happy-path.parquet` and, while it runs, open `filter-zoned.parquet`. (1) Choose Keep exporting. (2) Repeat the start and the open, and choose Cancel the export and go on. (3) Start and open again, let the export finish while the ask stands, then choose Cancel the export and go on, read the statement, and open the folder it names. | (1) The ask shows, the open does not happen and the export carries on. (2) The new dataset opens, and nothing is shown that you did not choose. (3) The statement says the export was not cancelled, that it finished, and gives the bundle's folder, and that folder holds the bundle. **Felt:** are the two choices clear, and did anything happen that you did not choose? **Felt:** did it tell you the export had happened, and where it is? |
| W9 | Reopen the file. | If a selection stands, the notice in the Feature tab and the status bar names the count dropped; W8a's opens have already ended the earlier selection, so select two features first. |
| W10 | Open `point-p1.parquet`, `line-l1.parquet` and `multipolygon-f1.parquet`, one at a time, and click in Select. | One click selects one feature, and every part of it highlights. |
| W10a | OPEN-15. With a real mouse, at your display's own scaling, open `point-p1.parquet`, choose Select and Replace, and move the pointer onto the edge of a point until the hover readout names a feature. Click without moving; repeat on the edge of a few other points. Record the Windows scale factor. | *Draft for the human's words:* each click selects the point the readout named (the highlight is on it and Selected is 1). A click that selects another point, or none, is a deviation: report it with the scale factor. |
| W11 | The P6 sight of the new strings: the tool switch, the Feature tab and the status bar's ended-selection notice, the Export section's sentence and its refusal when the scope changed, the ask, the two late-cancel statements, and the console statements of `tool.set`, `mode.set`, `selection.change`, `selection.clear`, `selection.zoomTo`, `feature.inspect`, `feature.pin`, `dataset.openDuringExport` and the edited `layout.selectInspectorTab`. | Record the wording you approve or replace. The two late-cancel statements are the human's approved wording (Amendment 8, item 1) and are read again here. Three [P6 placeholder] strings are untrue in ordinary use and are to be read at this sitting: the ask's still-running clause (untrue once the run ends while the ask stands), the ask's new-dataset-opened clause (untrue for a refused open) and the tool switch's click-inspects clause (untrue while a feature is pinned). |


## (vi) Part V: lines 1776 to 1788 of the walkthrough at ad2088a8

*Byte for byte by script, 2535 bytes, sha256 4a53c9cb6a613262d35820c9e26fcf76be3fce143545411069b2bfc38c609731.*

## Part V — the map after a resize: whether the area a resize uncovers fills with no pan or zoom (shell-map-refill-after-resize)

This Part is the Operator gate of `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` §9, run only on a build after that piece's merge. It is the human's felt verdict on what a resize does to the map, and is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). **Before V1:** read the form's last amendment first. Fixture: `100k-happy-path.parquet` (Part A's), no new fixture. **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part.

| # | Step | Expected outcome |
|---|---|---|
| V1 | Launch the app, open `100k-happy-path.parquet`, wait until features appear, zoom in one wheel notch at the map's centre, and wait until the map stops changing. | The map shows features and then holds still. |
| V2 | Press **Ctrl+I**. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** Since that change the open has already loaded the tiles around the view it first showed. After V1's one notch the strip the map gains can lie inside that loaded area, and then it shows features at once whether or not the refill works. To tell the two apart, after V1's notch and before this step drag the map to one side by about a third of its width, as the app-window test FILL now does. Whether the strip then lies on ground not yet loaded depends on the window's size, so record what you did and what you saw. The Inspector hides and the map grows. **Record** whether the strip the map gains fills with features with no pan or zoom, or stays empty until one. |
| V3 | Press **Ctrl+I** again. Then drag the map \| Inspector splitter back and forth several times without letting go, and let go. | **[CHANGED 2026-11-18 by open-first-look-fills-fit-view, by reading; not sighted since.]** V2's note applies here too. The map stays usable during the drag. **Record** whether the area it uncovered fills with no pan or zoom. |
| V4 | Restore the window down, then maximise it. | **Record** the same: whether the area the map gains fills with no pan or zoom. |
| V5 | **Felt.** Does the map keep up when panels and the window change size? | Record your verdict in your own words. |
| V6 | Open the file again. Before any pan or zoom, press **Ctrl+B**. | **Record** what the uncovered strip shows (`KNOWN-LIMITATIONS.md` item 39). |


## (vi) Part Z: lines 1889 to 1900 of the walkthrough at ad2088a8

*Byte for byte by script, 1460 bytes, sha256 11d0dfa858b77febd9de2cc20d54e6e5e1d19b2a86c1f40b188bf23543a96b6a.*

## Part Z — the status bar keeps one height: a notice coming or going does not move the map (shell-status-bar-one-height)

This Part is the Operator gate of `frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md` §9 as Amendment 1 restates it, run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict; it is discharged only once it has been run and its result log filled in. **No duration appears in any row.**

| # | Step | Expected outcome |
|---|---|---|
| Z0 | Read the form's section 10, the last amendment first. | Done before Z1. |
| Z1 | Open `filter-zoned.parquet`, choose Select, and click one feature. Open the file again: the ended-selection notice is in the status bar. Click a feature with Select: the notice clears. | **Felt:** did the map move or change size when the notice came? Did it move when the notice cleared? |
| Z2 | With a file open and no notice, read the bar. | It is two lines tall while it holds one line. **Record** anything that reads as wrong. |
| Z3 | With Narrator on, open the file again over a selection. | **Record** whether the whole notice is read. |
| Z4 | At 1024 × 640 (a dev build, `npm run tauri dev`, with DevTools' device toolbar at 100%, as Part U's U1 sets it), open the file again over a selection and read the bar. | It stays two lines tall, and if its items need more it scrolls inside. **Record** whether the notice needed scrolling to be seen. |


## (vi) Part AA: lines 1910 to 1921 of the walkthrough at ad2088a8

*Byte for byte by script, 1946 bytes, sha256 04eb44645b439d736a58d071e5b39d2bae8b35e3d42396901c793b5f776d837f.*

## Part AA — a crash leaves the session's filter and style changes on this machine, and a normal close removes them (b2-piece-1b-recording)

This Part is the Operator gate of `kernel/B2-1B-RECORDING-PREREGISTRATION.md` §9 (its rows X0 to X4 are this Part's AA0 to AA4: every letter A to Z is in use, so this Part takes the next name), run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict on the console's `record_step` entries, and it carries the form's E2 (a normal close removes that run's record), because the e2e harness cannot close the app normally (the form's H5). It is discharged only once it has been run and its result log filled in. **No duration appears in any row.** **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e of `state/directives/2026-10-11-direction-after-status-review.md`): the step lines are the form's, and the Expected outcome cells are drafts, not the human's wording.*

| # | Step | Expected outcome |
|---|---|---|
| AA0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AA1 | Open `filter-zoned.parquet` and apply `zone = 'residential'`. | The console shows `viewport_query`, then `record_step`. |
| AA2 | Drag the fill opacity and release; pick a colour and close the picker. | One `record_step` per release or close. **Felt:** does the console's `record_step` entry read as noise? |
| AA3 | End the app from Task Manager. | A new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions` holds the header and AA1's and AA2's steps, in order. |
| AA4 | Start the app, open `filter-zoned.parquet`, apply a filter, and note the new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions`; then close the app normally. | The folder you noted is gone; AA3's folder stays. This row carries E2. |


## (vi) Part AB: lines 1935 to 1956 of the walkthrough at ad2088a8

*Byte for byte by script, 6140 bytes, sha256 a3039f07c5f23e004d1060db89f4a5fbdd8f3be48ed54ebb111ffc3106800e23.*

## Part AB — the command bar and the filter cards at 1366 × 768: Ctrl+K, slash commands, `/filter` with field completion, and cards you switch on and off (shell-migration-milestone-3)

This Part is the Operator gate of `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md` §9 (its rows Y0 to Y11 are this Part's AB0 to AB11, per its Amendment 3 item 10; AB4a is the felt row Amendment 1 item 3 adds after AB4; the scale row Y12 is not built, Amendment 1 item 8), run only on a build after PR B's merge, at 1366 x 768, with a blank result log. It is the human's felt verdict on O-07 steps 2 and 3, and the human's observation of the form's H2 (does a real Ctrl+K reach the page in WebView2; AB1) and H4 (do keys typed in the bar stay out of the map; AB7). It is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e of `state/directives/2026-10-11-direction-after-status-review.md`): the step lines follow the form's §2.10 rows as its Amendments 1 and 3 change them; the Expected outcome cells and the sentences around the table are drafts, not the human's wording.*

**Before AB1:** fixture `filter-zoned.parquet` (Part E's table), no new fixture; the window at 1366 x 768 (Part U's U1); the app started with no dataset open, so that AB1 opens one.

| # | Step | Expected outcome |
|---|---|---|
| AB0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AB1 | O-07 step 2; **H2.** With real keys, press Ctrl+K, type `/open`, press Enter, then pick `filter-zoned.parquet`. | Ctrl+K puts the focus in the command bar in the top bar, and the browser does not take it. `/open` opens the file picker once, as the Open button does, and the picked file opens. **This row is the human's observation of H2:** if Ctrl+K does nothing with real keys, stop and record what happened. |
| AB2 | Press Ctrl+K, type `?`, and read the help. | The help lists every command with its word and shortcut. **Felt:** are the prefixes (`/` for a command, `?` for help, plain words for search) clear without being told? |
| AB3 | O-07 step 3. Press Ctrl+K, type `/filter @zo`, press Tab, type ` = 'residential'`, press Enter. Then type `/filter "zone" IS NOT NULL` and press Enter. | After the `@zo`, the list holds the file's field names that contain `zo`, each with its type. Tab puts `"zone"` in, double-quoted, and the `@` is gone. Enter adds a card, the bar empties and keeps the focus, and the map shows the filtered data. The second Enter adds a second card, and the Filter section's Applied line reads the two joined with AND, each inside brackets. **Felt:** the moment between Tab and Enter; did you know the two cards combine with AND; do they read as one filter on the layer; any trouble with the quotes? |
| AB4 | Switch one card off, and on again. | The switch shows which cards are on. The Applied line follows: with a card off it is the other card's text alone. **Felt:** is it clear what is on? |
| AB4a | Amendment 1 item 3, OPEN-2. Switch a card off and on again, and watch the map. | Each applied change re-fits the camera, as an Apply does. **Felt:** does the map re-fitting each time help or disorient? |
| AB5 | With one feature selected (Part W), switch a card off. | The selected count in the Feature tab is unchanged. |
| AB6 | OPEN-3 (A). With a card on, press Ctrl+K and add `/filter "zone" = 'residential' OR "zone" IS NULL`. | The bar shows a line that the shell did not apply it and why, nothing is sent, the cards and the Applied line do not change, and the Console in the Activity region (Ctrl+J) shows a `filter.clauseNotSent` row. Switch the other card off and add it again: it is added, with a mark that it is used on its own. |
| AB7 | H4. In the bar, press Tab, then Shift+Tab, then Escape; then type, and press the arrow keys. | Shift+Tab leaves the bar in one press; Tab leaves it in one press, or in two when the first completes the only candidate or the chosen option. Escape closes an open list, then returns the focus to where it was. Arrow keys in the bar move the list or the caret and never move the map. **This row is the human's observation of H4.** |
| AB8 | OPEN-5 (A). Type `/export` in the bar and press Enter. | The Inspector's Layer tab shows, the Export section opens, and the focus is on the Export button. Nothing is exported and no approval prompt appears. |
| AB9 | OPEN-2 (A). Type a predicate in the Filter section's own input and press Apply; then press Clear. | The cards become that one card, holding the text as you typed it. Clear removes every card. **Felt:** was that what you expected? |
| AB10 | With the focus in the bar and text in it, press Ctrl+B, Ctrl+I and Ctrl+J. | Each toggles its region, and the bar keeps its text. |
| AB11 | The P6 sight of every new string of this milestone, and of the sentences OPEN-9 drafts; **read the last amendment first.** The bar: its name and its placeholder text; the list's mark for a command that is not available; the bar's lines for an empty bar, a list to choose from, an unknown command, nothing matching, a command that is not available, a file already being opened, an empty condition, a change still being applied, and Enter on a field name; the field list's overflow line. The commands: the labels Command bar, Open dataset, Export and Add filter, and the words /layers, /inspector, /activity, /zoom-to-layer, /navigate, /select, /zoom-to-selection, /clear-selection, /open, /export and /filter. The cards: the statement, the switch and Remove labels, the mark on an expression, and the lead lines for a refusal, a change not applied, a new condition that can only be used on its own, and a card that is in the way. The Console statement of filter.clauseNotSent. | Record the wording you approve or replace. Every one starts with [P6 placeholder] except the command labels and words, and stays a placeholder until then. |


## (vi) Part R: lines 1543 to 1563 of the walkthrough at ad2088a8

*Byte for byte by script, 3753 bytes, sha256 bcc4074855e4aa31b00840056a88be1a23f847a6b30beb0454c5fbe0d2e3ee72.*

## Part R — closing the window during a publish, then relaunching at once (publish-attempt-lifecycle-src-tauri)

This Part is the operator gate of `frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md` §9 (row R1), and the only proof of the exit seam in a running app (question round 40, item 3). It is discharged only once it has been run and its result log filled in. Windows only: nothing is claimed off Windows (§2 item 5, R5). **No duration is measured in any row or expected outcome** (`docs/08_Testing.md`; ADR-018): the 30 s wait is the declared ceiling, not a timing.

**Before R1:**
- Use the normal build, not the measure build (`npm run build:measure`), whose fixed CDP port two processes would contend for.
- Build `npx tauri build --debug --no-bundle` and run the executable directly from `frontends/shell/src-tauri/target/debug/spatial-ide-shell.exe`, as Part M's M12 does for its mode 2, both times. Do not use `npm run tauri dev`: its dev server binds a fixed port (`strictPort`), so a second `tauri dev` started while the first is still alive would fail for a reason unrelated to this row.
- Part H's 5 GB fixture and Part A's 100k fixture must exist (their fixture tables).
- Build `target\debug\publish-bundle.exe` if it is not yet built, as Part F says: run `cargo build -p spatial-kernel --bin publish-bundle` from `C:\dev\spatial-ide`. Step R1(iv) runs it.
- Show hidden items in File Explorer.

| # | Step | Expected outcome |
|---|---|---|
| R1 | **1.** Open `parcels-5gb.parquet` (Part H's H1). **2.** Click **Export interactive map…**, choose **Current view** after sizing the viewport as H6 does (about 1/8 × 1/8 of the layer's extent, under about 300k rows: **Whole dataset** is refused before the pin at this size, Part M's M10), pick a fresh destination under `C:\dev\spatial-ide\target\`, and confirm. **3.** While the phase line reads `verifying-source` or `writing-partitions`, close the window with its close button. **4.** Relaunch the app at once, the same way it was launched. **5.** In the relaunched window, open `100k-happy-path.parquet` (Part A). **6.** Wait at least 30 s after the close. | **(i)** The relaunched app starts with no startup-refusal dialog, admits the 100k fixture and draws it (the data plane works). **(ii)** After the wait, only one instance of the app's process (`spatial-ide-shell.exe`) remains. **(iii)** The destination is absent, and with hidden items shown its parent holds no `.<name>.staging-*` entry. **(iv)** From `C:\dev\spatial-ide`, `target\debug\publish-bundle.exe --audit-show` reads that attempt as CANCELLED (Part H's H9 runs the same command), not as "no outcome (interrupted?)", and no line is reported corrupt. **(v)** `%LOCALAPPDATA%\dev.spatialide.shell\logs` holds two distinct `session-*.log` files for this sitting, one per process. A result of "no outcome (interrupted?)" together with a staging entry is the declared ceiling case (KNOWN-LIMITATIONS 30): record it as a deviation, never as a pass. If step 3's publish finished before the window could be closed, record that and repeat from step 2 with another fresh destination, closing the window while the phase line reads `verifying-source`, which re-hashes the whole source at any viewport. Row G9 is unchanged. |

**If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. In R1, the deviations this row exists to catch are a refusal dialog or a failed draw in the relaunched app (i), a surviving or second process (ii), a leftover staging entry (iii), an attempt read as no outcome (iv), and a missing second session log (v).

**Sitting estimate (scheduling only, not a claim about the app):** one sitting, a few minutes plus the 30 s wait.

---


