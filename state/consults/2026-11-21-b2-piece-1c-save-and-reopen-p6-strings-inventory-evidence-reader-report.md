*Filed by the custodian: the P6 inventory ordered by ADV-2026-11-21-11 item 4, its part 1, by the evidence reader (read only, no run), on main at 89238a20. The reader stopped at its eight-turn limit with no report; the custodian's message let it continue; its hand-back is a summary, and its full text is the one long text block of its transcript, at 2026-11-21T09:02:16.082Z. Below the first rule, the hand-back, 1940 bytes, sha256 3ae608ece9eefe4f53a33f069bc438eca4f9cbb34e6d666aa7b28a370fa96b91; below the second, that text block, 35119 bytes, sha256 df970187a089e5ed3e152f73489fc1f558996864fb15e1cf616ef240cda3cd1d; each with a final newline added where it had none, nothing else changed. Its calls in the transcript, by unique call ids: Read 11, Grep 9, SubagentHandback 1; none errored; from 2026-11-21T08:59:07.909Z to 2026-11-21T09:02:22.003Z. The custodian's check, by script: of its 148 marked texts in backticks, 144 match the source by their words up to the first slot; 3 are joined across source lines (OpenDuringExportAsk.tsx, formatRefusal.ts, publish/types.ts), read by the custodian; 1 is outside the shell src (commands.rs), in part 2. Its section D counts agree with a grep (176 in 29 files). Its columns 4 to 6 marked not stated or not searched are in part 2. It proposes no words and no grouping.*

---

Partial inventory. Full report was written in my previous message text but handback requires it here; summary: PARTIAL. Covered: shell src/ product files (29 files with bracketed mark, 176 marks agree with grep; A+B per file equals 'P6 placeholder' grep count for every file; split mark at canvas/decodeBatch.ts:76-77 not matched by grep). Per-file counts (A+B; bracket grep/plain grep): App.tsx 2+2;3/4. values.ts 2+1;2/3. CommandBar.tsx 12+1;12/13. AdmissionPanel.tsx 2+1;2/3. DescribeSummary.tsx 4+1;4/5. saveProject.ts 8+1;8/9. formatRefusal.ts 1+0;1/1. reopenNotices.ts 24+1;24/25. StudioLayout.tsx 6+0;6/6. decodeBatch.ts 3+1;3/4. statusItems.ts 3+1;3/4. ClauseCards.tsx 9+1;9/10. limits.ts 1+0;1/1. contributions.ts 1+1;1/2. TableTab.tsx 7+1;7/8. surfaceRegistry.ts 21+0;21/21. HoverReadoutView.tsx 1+0;1/1. actionRegistry.ts 4+3;4/7. tableSource.ts 7+1;7/8. publish/types.ts 1+2;2/3. tableScope.ts 2+1;2/3. describeSummaryText.ts 4+1;4/5. FeatureTab.tsx 18+1;18/19. PublishPanel.tsx 3+3;3/6. OpenDuringExportAsk.tsx 2+1;2/3. ToolSwitch.tsx 3+1;3/4. terminalShapes.ts (test support) 3+1;4/4. StylePanel.tsx 15+1;15/16. Legend.tsx 4+1;4/5. Comment-only files: highlightLayers.ts 0+1, styleConstants.ts 0+1, PublishDialog.tsx 0+1, styles.css 0+5. NOT COVERED: all 73 marks outside src/ (src-tauri commands.rs 1, publish.rs 7; engine wkb.rs 30, watch.rs 9, geoarrow.rs 3, error.rs 2, geoparquet.rs 2, predicate.rs 3, stream.rs 2; kernel skp.rs 11, lib.rs 1, publish/error.rs 6; protocol adapter_ws.rs 1, data-plane README.md 1) and the tests there; section A cols 4-6 where marked not stated/not searched; section C beyond a start (form 2.12 lines 494-517; S2 marked at src-tauri/src/commands.rs:334 PROJECT_FOLDER_PICKER_TITLE; S22 unmarked per actionRegistry.ts:84 and form line 1354; S13-S15 no mark found in shell files; K-1..K-4 not searched). Row texts were given in full in the prior message; reproduce on request as second task.

---

Inventory: the [P6 placeholder] strings, at main (no commit named in the files I read; the coordinator gave 89238a20 or later)

**Status: partial.** Result: the shell `src/` product files (29 files with the bracketed mark, plus 4 with unbracketed comment marks only) are covered for sections A, B and D. The 73 marks under `src-tauri/`, `engine/`, `kernel/` and `protocol/` are only counted, not inventoried (list at the end). Section C is only started.

Columns 4 to 6 are filled only where the source comment or the form I read says so; otherwise they read `not stated` or `not searched`.

## Section A (shell `src/`, product files)

All rows are in `frontends/shell/src/`. One row per occurrence, so a file's rows are listed as ranges. Col 2 is the text exactly as in the source, with `${…}` and `{…}` slots left in. Col 3 is my reading of where it shows. Col 5 is given only where I read the form line.

**project/reopenNotices.ts** (24 rows)
- Col 4: the file's header comment (line 5-7) says the words are the advisor's, ADV-2026-11-20-05 item 2, or for W-STYLE and O-18 ADV-2026-11-20-09 item 2, copied by script, and "none is the human's (S8 is theirs to overturn at P6)".
- Col 5: form `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` line 4222 (Amendment 54 item 12). Line 4250 covers S8. Lines 503-512 list S8 to S17.
- Col 3: notices, the S8 question dialog and its choices, and the re-link control. Where each shows is the caller's routing (comment, line 12).
- Rows, symbol and line:
  - `QUESTION_TEXT` :20 `[P6 placeholder] This machine remembers this project in another folder. Is the project in this folder a copy, or the same project? A copy gets a new identity, written to the project file in this folder, and its data links become its own. The same project: this folder is remembered for it, and the question is not asked here again.` (S8, dialog)
  - `QUESTION_COPY` :22 `[P6 placeholder] A copy`
  - `QUESTION_SAME` :24 `[P6 placeholder] The same project`
  - `QUESTION_CANCEL` :26 `[P6 placeholder] Do not open`
  - `OPEN_ELSEWHERE_OWN_NOTICE` :29 `[P6 placeholder] It is the project open in this window, which stays as it is.`
  - `OPEN_ELSEWHERE_OTHER_NOTICE` :31 `[P6 placeholder] The project was not opened in this window. Close it where it is open, then try again.`
  - `CHANGED_FILE` :33 `[P6 placeholder] The data differs from what the project recorded when it was saved.{parts} The project was opened on the data as it is now.`
  - `RELINKED_FILE` :34 `[P6 placeholder] The file you chose differs from what the project recorded when it was saved.{parts} On this machine the project now finds its data at the file you chose.`
  - `NOT_FOUND` :61 `[P6 placeholder] The project's data file was not found where this machine recorded it: {file_name}. Choose the file to re-link it.`
  - `NOT_FOUND_NONE` :62 `[P6 placeholder] This machine records no location for the project's data. Choose the file to re-link it.`
  - `RELINK_CHOICE` :64 `[P6 placeholder] Choose the data file…` (control)
  - `LINEAGE_NOT_RECORDED_NOTICE` :72 `[P6 placeholder] A history file found for this project, in its folder or on this machine, is not the one the project file records. It was not read as this project's history.`
  - `LINEAGE_NOT_KEPT_NOTICE` :74 `[P6 placeholder] The project file records a history, which this version does not keep. A save of this project will be refused.`
  - `LINEAGE_FILE_REFUSED` :75 `[P6 placeholder] A history file of this project was refused: {reason}.`
  - `VIEW_NOT_APPLIED` :87 `[P6 placeholder] The saved view was not applied: it was saved in another coordinate space than the one the data is in now. The view was fitted to the data instead.`
  - `KNOWN_FOLDERS_FULL_NOTICE` :95 `[P6 placeholder] The project was not opened in this window. The folders this machine remembers for it are unchanged.`
  - `MACHINE_RECORD_REFUSED_NOTICE` :97 `[P6 placeholder] The project was not opened in this window. The record was left as it is.`
  - `ENGINE_REFUSAL_NOTICE` :99 `[P6 placeholder] The project was not opened in this window. The claims this refusal names are the ones the project file recorded for the data. None was typed here.`
  - `REOPEN_REFUSAL_NOTICE` :101 `[P6 placeholder] The project was not opened in this window.`
  - `REOPEN_LOCATOR_REFUSAL_NOTICE` :103 `[P6 placeholder] The project was not opened in this window. If its data file was moved or renamed, put it back where the project recorded it, then open the project again.`
  - `OPEN_PANICKED_NOTICE` :105 `[P6 placeholder] The open failed inside the application, and this window did not receive the project. The project may stay held until the application is closed.`
  - `WORKSPACE_TEXT` :107 `[P6 placeholder] Saved text holds characters that do not show, or that change the direction of text, in: {members}. It was applied as saved, and what you see of it may not be all of it.`
  - `COLOUR_BY_NOT_RESTORED` :114 `[P6 placeholder] Colour by was not restored: the data does not offer the column {column} for it now. The rest of the saved style was applied. A save now replaces the saved style with the one shown.`
  - `STYLE_NOT_APPLIED_NOTICE` :122 `[P6 placeholder] The saved style was not applied: this version cannot show it. The default style is shown. A save now replaces the saved style with the one shown.`
- Col 6: my grep found 7 test or e2e files that name some of the constants (`App.reopen.test.tsx`, `openProject.test.ts`, `saveProject.test.ts`, `App.save.test.tsx`, `App.command.test.tsx`, `e2e/reopen.mjs`, `e2e/second-open.mjs`). I did not check which constants each one quotes. Form line 4222 says "no test asserts a place's words".

**project/saveProject.ts** (8 rows)
- Col 4: header comment :15 says "Every string here is a P6 placeholder ... None is the human's wording." The author is not stated.
- Col 5: form §2.12 lines 496-512 (S3 498, S4 499, S5 500, S6 501, S7 502, S18 512). `THROUGH_LINK_NOTICE` (O-9) is under Amendment 54 item 12, line 4222.
- Col 3: notices.
- Rows:
  - `SAVED_NOTICE` :26 `[P6 placeholder] The project was saved.` (S3)
  - `MARK_WITHHELD_NOTICE` :28 `[P6 placeholder] The session history holds no saved-here mark for this save.` (S5)
  - `NO_CANONICAL_SPELLING_NOTICE` :31 `[P6 placeholder] The data is inside the project folder, but its path has no canonical spelling on this machine. The project will not find that file on another machine.` (S18)
  - `THROUGH_LINK_NOTICE` :33 `[P6 placeholder] The data is inside the project folder, but the path it was opened by reaches it through a link. The project will not find that file on another machine.`
  - `SELECTION_NOTICE` :35 `[P6 placeholder] A selection made by clicking is not saved.` (S6)
  - `FOLDER_HOLDS_PROJECT_NOTICE` :37 `[P6 placeholder] The folder already holds a project.` (S7)
  - `NO_VIEW_NOTICE` :39 `[P6 placeholder] The project was not saved.` (S23)
  - `notSavedNotice` :41 `` `[P6 placeholder] The project was not saved: ${message}` `` (S4)
- Col 6: see the 7 files listed above, not checked per text.

**layout/actionRegistry.ts** (4 rows)
- Col 4: comments :84, :86, :89 say "a P6 placeholder, so marked". :89 cites ADV-2026-11-20-05 item 6 for the bar's word.
- Col 5: S1 is form line 496.
- Col 3: control labels.
- Rows:
  - `project.save` :85 `[P6 placeholder] Save project`
  - `layer.revealStyle` :87 `[P6 placeholder] Colour by`
  - `layer.revealTable` :88 `[P6 placeholder] Table`
  - `project.open` :90 `[P6 placeholder] Open project`
- Col 6: not searched.

**admission/AdmissionPanel.tsx** (2 rows)
- Col 4: comment :305 says "the advisor's words, ADV-2026-11-20-05 item 2".
- Col 5: not stated.
- Col 3: the Open project control, idle and opening.
- Rows:
  - `OPEN_PROJECT_IDLE` :306 `[P6 placeholder] Open project…`
  - `OPEN_PROJECT_OPENING` :307 `[P6 placeholder] Opening project…`
- Col 6: not searched.

**command/CommandBar.tsx** (12 rows)
- Col 4: header comment :22 says "Every operator string is a P6 placeholder". The author is not stated.
- Col 3: the bar's notes (rendered in a fixed note), a list mark, the input's aria-label and placeholder.
- Rows:
  - :32 `[P6 placeholder] not available` (`COMMAND_UNAVAILABLE_MARK`)
  - :33 `[P6 placeholder] That command is not available right now.`
  - :34 `[P6 placeholder] A file is already being opened.`
  - :35 `[P6 placeholder] Type a command, or ? for the list.`
  - :36 `[P6 placeholder] Choose a command with the arrow keys, then press Enter.`
  - :37 `[P6 placeholder] No command has that name. Type ? for the list.`
  - :38 `[P6 placeholder] Nothing matches that.`
  - :39 `[P6 placeholder] Type a condition after /filter.`
  - :40 `[P6 placeholder] Press Tab to put the field name in, then Enter to add the filter.`
  - :41 `commandFieldMore`: `` `[P6 placeholder] ${hidden} more. Type more letters to narrow the list.` ``
  - :200 `aria-label="[P6 placeholder] Command bar"`
  - :201 `placeholder="[P6 placeholder] Type / for commands or ? for help"`
- Col 6: `e2e/command-bar.mjs` quotes `[P6 placeholder] Not applied. Try again.` in a header comment (that text is `ClauseCards.tsx` `CLAUSE_NOT_APPLIED_LINE`, not a bar string). Otherwise not searched.

**filter/ClauseCards.tsx** (9 rows)
- Col 4: comment :15 says "Every operator string is a P6 placeholder".
- Col 3: the filter cards' text and refusal lines.
- Rows:
  - :18 `CLAUSE_STATEMENT` `[P6 placeholder] Cards that are on are combined with AND. The filter keeps only features that meet every card that is on.`
  - :19 `[P6 placeholder] On`
  - :20 `[P6 placeholder] Remove`
  - :21 `[P6 placeholder] Expression, used on its own`
  - :22 `[P6 placeholder] Not applied. Your filter cards are unchanged.`
  - :23 `[P6 placeholder] Not applied. Try again.`
  - :24 `[P6 placeholder] A filter change is still being applied.`
  - :25 `[P6 placeholder] Not applied: this condition is not one of the simple forms, so it can only be used on its own. Turn off the other cards first.`
  - :26 `clauseBlockedLine`: `` `[P6 placeholder] Not applied: the card ${text} can only be used on its own. Turn it off first.` ``
- Col 6: `e2e/command-bar.mjs` comment :45 quotes :23.

**feature/FeatureTab.tsx** (18 rows)
- Col 4: comment :33 says "Everything else is a P6 placeholder". The author is not stated.
- Col 3: Feature tab lines and aria-labels.
- Rows:
  - :52 `[P6 placeholder] Drawn in the view.`
  - :53 `[P6 placeholder] Not drawn: outside the view.`
  - :54 `[P6 placeholder] Not drawn: in the view.`
  - :57 `[P6 placeholder] No attribute column is projected for this dataset.`
  - :58 `[P6 placeholder] Attributes are not held for this feature: the resident attribute limit was reached.`
  - :66 `` `[P6 placeholder] ${parts.join(". ")}.` ``
  - :72 aria-label `[P6 placeholder] Attributes`
  - :96 `` `[P6 placeholder] Last click: ${idLine(click.pick)}.` ``
  - :97 `` `[P6 placeholder] Last click: ${idLine(click.pick)}. The pinned feature, id ${click.keptPinned.id.toString()}, stays inspected.` ``
  - :101 `[P6 placeholder] Last click: no feature there.`
  - :118 `` `[P6 placeholder] The selection holds at most ${notice.refusal.max} features: this one was not added.` ``
  - :122 `` `[P6 placeholder] The selection ended: ${dropped}, because ${because}.` ``
  - :156 aria-label `[P6 placeholder] Inspected feature`
  - :158 `[P6 placeholder] No feature is inspected.`
  - :171 aria-label `[P6 placeholder] Selection`
  - :174 `` `[P6 placeholder] Outside the view: ${counts.outsideView}` ``
  - :177 `` `[P6 placeholder] In the view, not drawn: ${counts.inViewNotDrawn}` ``
  - :192 `` `[P6 placeholder] ${zoom.label} acts on: ${zoom.scopeWords}` ``
- Col 6:
  - `feature/FeatureTab.test.tsx` quotes :96, :97, :101, :174, :177, :192 and :122 (lines 130-134, 168-169, 193, 206-224). It also quotes the "Not projected: d32." line at :247, which is not in `FeatureTab.tsx` in this pass.
  - `App.selection.test.tsx` quotes :96/:97 and :101 (lines 585, 622).
  - `App.attributes.test.tsx:202` quotes `[P6 placeholder] Not projected: d32.`

**layout/StudioLayout.tsx** (6 rows)
- Col 4 and 5: not stated.
- Col 3: inspector empty text, a button label, splitter and attention aria-labels.
- Rows:
  - :308 `[P6 placeholder] Nothing to show until a dataset is on the map.`
  - :365 `` `[P6 placeholder] ${entry.label} (${shortcutLabel(entry.chord, platform)})` ``
  - :377 `[P6 placeholder] Resize Layers`
  - :379 aria-label `[P6 placeholder] Attention`
  - :389 `[P6 placeholder] Resize Inspector`
  - :434 `[P6 placeholder] Resize Activity`
- Col 6: not searched.

**layout/statusItems.ts** (3 rows)
- Col 4: comment :23 says "Every string is a P6 placeholder".
- Col 3: status items.
- Rows:
  - :31 `` `[P6 placeholder] source watch: checks-only — ${facts.coverage.reason ?? "(no reason on the payload)"}` ``
  - :32 `` `[P6 placeholder] source watch: ${facts.coverage.state}` ``
  - :34 `` `${coverage} · [P6 placeholder] structural checks: degraded — unestablished: ${facts.checks.components.join(", ")}` ``
- Col 6: `layout/statusItems.test.ts` lines 31, 39, 44, 50, 63.

**layout/contributions.ts** (1 row)
- Col 4: comment :13 says the Table label is a P6 placeholder (milestone 4 PR C, section 2.4 (a)).
- Col 3: a tab label.
- Row: :43 `[P6 placeholder] Table`
- Col 6: `App.table.test.tsx:206`.

**App.tsx** (2 rows)
- Col 4: comment :749 says "`[P6 placeholder]`-marked (§7)" with its wording. Comment :828 cites milestone 4 PR A, section 2.2 (d).
- Rows:
  - :754 `` `${code}: [P6 placeholder] the advisory source watcher ended this dataset's session (${reason})` ``, `buildSessionEndedOwnerDetail`. Col 3: a log line.
  - :834 `ATTRIBUTES_NOT_HELD_TEXT` `[P6 placeholder] Some features' attributes were not held since this dataset was opened: the resident attribute limit was reached.` Col 3: a status item.
- Col 6: `App.test.ts:1336-1339`; `e2e/s5dVerdict.test.mjs:20,22` quote the :754 text.

**feature/ToolSwitch.tsx** (3 rows)
- Col 4: comment :18 says the tool and mode labels are the human's (Amendment 1 A11) and "the lines are P6 placeholders".
- Col 3: control group labels and each tool or mode's line.
- Rows:
  - :46 aria-label `[P6 placeholder] Map tool`
  - :65 aria-label `[P6 placeholder] Selection mode`
  - :85 `` `[P6 placeholder] ${entry.label} (${entry.bareKey?.letter.toUpperCase()}): ${click}` ``
- Col 6: `feature/ToolSwitch.test.tsx:66` quotes the :85 shape in a comment.

**feature/OpenDuringExportAsk.tsx** (2 rows)
- Col 4: comment :11 says the line is a P6 placeholder and the two labels are the form's.
- Col 3: dialog (ask).
- Rows:
  - :38 aria-label `[P6 placeholder] Open while an export runs`
  - :40-41 `[P6 placeholder] An export of the open dataset is still running. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and the export is asked to stop and the new dataset is opened; the open dataset is closed once the export has ended.`
- Col 6: not searched.

**style/StylePanel.tsx** (15 rows)
- Col 4: comment :51 says "The Colour by lines (P6 placeholders)".
- Col 3: panel lines and controls.
- Rows:
  - :52 `[P6 placeholder] Reading the first features to find the values.`
  - :53 `[P6 placeholder] Colour by is not available while an export is in progress.`
  - :54 `[P6 placeholder] No column of this file can colour the map.`
  - :56 and :57 `[P6 placeholder] Cancelled. Nothing was applied.` (cancelled, abandoned)
  - :58 `[P6 placeholder] The values could not be read, so nothing was applied.`
  - :59 `[P6 placeholder] The dataset's session ended, so nothing was applied.`
  - :60 `[P6 placeholder] The filter changed while the values were read, so nothing was applied.`
  - :61 `[P6 placeholder] The column holds no value among the features read, so nothing was applied.`
  - :213 `` `[P6 placeholder] Coloured by ${column}: ${found} distinct values found among the first ${outcome.snapshot.count} features read, ${other} of them drawn as Other. A value not among those features also draws as Other.` ``
  - :317 `[P6 placeholder] Colour by`
  - :319 `[P6 placeholder] Choose a column`
  - :328 `[P6 placeholder] Apply`
  - :332 `[P6 placeholder] Cancel`
  - :336 `[P6 placeholder] One colour`
- Col 6: `style/StylePanel.test.tsx:278, 311` quote the "Cancelled. Nothing was applied." line.

**style/Legend.tsx** (4 rows)
- Col 4: comment :7 says "P6 placeholders".
- Col 3: panel (legend).
- Rows:
  - :8 `[P6 placeholder] No value`
  - :9 `[P6 placeholder] Other`
  - :10 `[P6 placeholder] (empty text)`
  - :21 `` `[P6 placeholder] Legend for ${parsed.matchColumn}` `` (aria-label)
- Col 6: `style/Legend.test.tsx:49`; `e2e/colour.mjs:42,43`.

**attributes/values.ts** (2 rows)
- Col 4: comment :30 says "(a P6 placeholder)".
- Rows:
  - :31 `[P6 placeholder] NULL`. Col 3: the marker a NULL shows.
  - :48 `` `[P6 placeholder] attribute column of type ${String(type)} is not readable` ``. Col 3: a thrown Error message.
- Col 6: `table/TableTab.test.tsx:139`; `e2e/attributes.mjs:52` for :31.

**table/TableTab.tsx** (7 rows)
- Col 4: comment :19 says the labels and the word "features" are a P6 placeholder.
- Col 3: panel.
- Rows:
  - :26 `[P6 placeholder] not held`
  - :27 `[P6 placeholder] cut`
  - :104 `[P6 placeholder] Scope`
  - :122 `[P6 placeholder] The table is not loading while an export runs.`
  - :127 `` `[P6 placeholder] Loading features: ${snapshot.count} so far.` ``
  - :136 `[P6 placeholder] Cancel`
  - :146 `label="[P6 placeholder] features"`
- Col 6: not searched for these.

**table/tableSource.ts** (7 rows)
- Col 4: comment :59 says "a P6 placeholder".
- Col 3: table line, except :52, which is a thrown Error message.
- Rows:
  - :52 `[P6 placeholder] the table holds no rows`
  - :66 `` `[P6 placeholder] Showing all ${n} features${filtered ? " that pass the filter" : ""}.` ``
  - :67 `` `[P6 placeholder] Showing the first ${n} features returned, in no declared order; ${filtered ? "more may pass the filter" : "the file may hold more"}.` ``
  - :69 `` `[P6 placeholder] The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first ${n} features returned, in no declared order; more may pass the filter.` ``
  - :71 `` `[P6 placeholder] Cancelled. Showing the first ${n} features returned before it stopped, in no declared order; ${filtered ? "more may pass the filter" : "the file may hold more"}.` ``
  - :73 `[P6 placeholder] The table could not be loaded.`
  - :75 `[P6 placeholder] The dataset's session ended, so the table was cleared; open the file again to load it.`
- Col 6: `table/tableSource.test.ts` 63, 83, 147, 196; `table/TableTab.test.tsx` 140, 163, 174; `e2e/table.mjs` 257, 312.

**table/tableScope.ts** (2 rows)
- Col 4: comment :59 says "a P6 placeholder".
- Col 3: table line.
- Rows:
  - :61 `` `[P6 placeholder] Showing all ${selected} selected features, ignoring the filter.` ``
  - :63 `` `[P6 placeholder] Showing ${second.listed.length} of ${selected} selected features that pass the filter${rest.length > 0 ? `; ${rest.join("; ")}` : ""}.` ``
- Col 6: `table/tableScope.test.ts` 54, 55; `table/TableTab.test.tsx` 143, 144.

**admission/DescribeSummary.tsx** (4 rows)
- Col 4: comment :35 says "P6 placeholders".
- Col 3: panel (describe summary labels).
- Rows:
  - :36 `[P6 placeholder] Geometry (encoding chosen by the engine)`
  - :41 `[P6 placeholder] Geometry types declared by the file`
  - :88 `[P6 placeholder] Source watch`
  - :95 `[P6 placeholder] Structural checks`
- Col 6: `admission/DescribeSummary.test.tsx` 45, 46.

**admission/describeSummaryText.ts** (4 rows)
- Col 4: comment :102 says "the human's wording at P6".
- Col 3: panel text.
- Rows:
  - :81 `` `[P6 placeholder] checks-only — ${coverage.reason ?? "(no reason on the payload)"}` ``
  - :94 `` `[P6 placeholder] degraded — unestablished: ${checks.components.join(", ")}` ``
  - :108 `[P6 placeholder] the file declares no geometry_types key`
  - :111 `[P6 placeholder] the file declares an empty geometry_types list`
- Col 6: `DescribeSummary.test.tsx:64,65` match the prefix by regex only.

**admission/formatRefusal.ts** (1 row)
- Col 4: comment :80-84 says user-visible wording is the human's at P6 (SOURCE-WATCHER-PREREGISTRATION §1, addition 2), and "no test asserts it verbatim".
- Row: :86 `[P6 placeholder] The advisory watch on this source lost coverage of it while it was open -- this is not a statement that the file changed, only that this session can no longer tell. Reopen the dataset to continue.` Col 3: a refusal's message.
- Col 6: `admission/formatRefusal.test.ts:221` matches the prefix by regex.

**canvas/HoverReadoutView.tsx** (1 row)
- Row: :43 `[P6 placeholder] The source watch lost coverage of the file while it was open, so what was on the canvas was cleared and features here can no longer be identified — reopen the dataset to continue.` Col 3: panel (hover readout). Cols 4 to 6: not stated or not searched.

**canvas/decodeBatch.ts** (3 rows)
- Col 4: comments :55 and :76-77 say "the human's wording at P6, ADR-034 Acceptance item 6" and "states the shell's own fact only". The second comment's mark is split across two lines.
- Col 3: thrown Error messages (reach the Console or a log; not confirmed).
- Rows:
  - :64-67 `` `[P6 placeholder] batch schema names geometry encoding ${JSON.stringify(batchEncoding)}; this open's ` + `encoding is ${JSON.stringify(expectedEncoding)}, and the shell reads ${ENCODING_POLYGON}, ` + `${ENCODING_MULTIPOLYGON}, ${ENCODING_POINT}, ${ENCODING_LINESTRING} and ` + `${ENCODING_MULTILINESTRING} -- refusing rather than walking the batch at a guessed nesting depth` ``
  - :86-87 `` `[P6 placeholder] batch schema names attribute_columns ${declared ?? "(absent)"} and fields ${JSON.stringify(fieldNames)}; ` + `this open projects ${JSON.stringify(expected)} -- refusing rather than reading columns by position` ``
  - :129 `` `[P6 placeholder] attribute column ${JSON.stringify(field.name)} has type ${String(field.type)}, which the shell does not read` ``
- Col 6: `canvas/decodeBatch.test.ts:235` matches the prefix by regex.

**canvas/limits.ts** (1 row)
- Row: :104-105 `` `[P6 placeholder] batch has ${pickOrdinalCount} pick ordinals (polygon parts, line parts or points), above the declared ` + `24-bit picking ceiling of ${DECKGL_PICK_INDEX_CEILING} (ADR-010 rule 6) -- refused, not rendered` ``, `PickCeilingExceeded`. Col 3: a thrown Error message. Cols 4 to 6: not stated or not searched.

**publish/types.ts** (1 row)
- Col 4: comment :121-123 says the human's ruling of 2026-11-05 evening item 2, with the prefix the custodian's reading, confirmed by the human 2026-11-06.
- Row: :133-134 `FILTER_SCOPE_SENTENCE` `[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`. Col 3: the Export panel's echo and the prompt dialog.
- Col 6: `e2e/export-view.mjs:25,27`. The `PublishPanel` test is named in the comment as pinning it against `src-tauri/src/publish.rs`; I did not open it.

**publish/PublishPanel.tsx** (3 rows)
- Col 4: comments :43, :54 say "A P6 placeholder" and "the shell's own words". Comment :663 cites question round 66, item 4 (OPEN-4).
- Rows:
  - :44 `[P6 placeholder] The selection is not used. The export covers the row scope chosen above.` Col 3: panel.
  - :57 `` `[P6 placeholder] The export was not run, because ${what} changed after it was prepared. Nothing was written. Prepare it again.` `` Col 3: a refusal's message.
  - :664 `[P6 placeholder] Writes a folder containing an interactive map of this layer.` Col 3: panel.
- Col 6: `App.command.test.tsx:618`; `App.selection.test.tsx` 844, 868, 879.

**testUtils/terminalShapes.ts** (3 rows; this file is test support)
- Col 4: comment :37 refers to a test, `a_coverage_lost_terminal_detail_carries_its_typed_code_and_exact_text`.
- Col 3: fixture text copying engine and kernel strings.
- Rows:
  - :41 `engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source lost …`
  - :57 the same prefix
  - :58 `coverage ([P6 placeholder] this dataset's session ended when the advisory watch on its …`
- These continue across lines; I read only the first line of each. Col 6: not searched.

**console/surfaceRegistry.ts** (21 rows)
- Col 4 and 5: not stated in the lines read. The 1c form lists P6 under P4 to P6 (form lines 1127 and 1154), but I did not read what it says of this file.
- Col 3: the Console (each statement is a row of "no API equivalent exists").
- Every row begins `[P6 placeholder] no API equivalent exists -- ` and goes on with the rest quoted below, at the line given.
- Rows:
  - :205 `Colour by is the app's own control: it reads the chosen column's values from the first features of the Table's request, which is the viewport_query row shown beside this one when Colour by asks for it; a Colour by that changes the style sends one step to the session history, the record_step row beside it, and one that changes nothing sends none; when it applies nothing, Colour by's line says why.`
  - :212 `One colour is the app's own control: it ends Colour by, so that every feature draws in the Fill colour, and sends one step to the session history, the record_step row shown beside this one.`
  - :219 `Reset to default found the style already at the default, so nothing changed and no step was sent to the session history.` (:219-220)
  - :227 `the app did not send this filter change, because a condition that is not one of the simple forms can only be used on its own; nothing reached the kernel and the filter cards are unchanged.`
  - :294 `showing or hiding the Layers region is pure view state for this session, never sent to the kernel.`
  - :301 the same, with `Inspector region`.
  - :308 the same, with `Activity region`.
  - :315 `switching the Inspector between its Layer, Style and Feature tabs is pure view state for this session, never sent to the kernel.`
  - :322 `switching the Activity region between its Console, Notices and Table tabs is pure view state for this session, never sent to the kernel.`
  - :329 `expanding or collapsing the Source or Filter section of the Inspector is pure view state for this session, never sent to the kernel.`
  - :336 `resizing a region with its splitter is pure view state for this session, never sent to the kernel; it is recorded once per finished drag and once per keyboard step.`
  - :343 `choosing the Navigate or Select tool is pure view state for this session, never sent to the kernel.`
  - :350 `choosing how a click changes the selection (Add / remove, Replace, Add only or Remove only) is pure view state for this session, never sent to the kernel.`
  - :357 `changing which features are selected with a click is pure view state for this session, never sent to the kernel and not saved.`
  - :364 `clearing the selection is pure view state for this session, never sent to the kernel.`
  - :371 `Zoom to selection moves the camera over the selected features, which is pure view state for this session; it sends nothing but the viewport query any camera move causes.`
  - :378 `inspecting the feature under a click, and the attribute values it shows, is pure view state for this session: the values came with the batches the map already holds, and nothing is sent to the kernel.`
  - :385 `pinning or unpinning the inspected feature is pure view state for this session, never sent to the kernel.`
  - :392 `answering the question asked when a dataset is opened while an export runs is a choice made in the window; the cancel request it may send and the open that follows are recorded by their own rows.`
  - :399 `choosing which features the Table lists (Filtered, Selected, or Selected, ignoring filter) is pure view state for this session; only Filtered asks the kernel for features, and its query is the viewport_query row shown beside this one.`
  - :406 `the Cancel button beside the Table's loading line is the app's own control; the cancel request it sends is the cancel row shown beside this one.`
- Col 6: not searched.

## Section B (comments, shell `src/`)

Each comment is listed only where it says whose words; a comment that only says "placeholder" is marked.
- `App.tsx:749` and `:828`: placeholder only; :828 cites milestone 4 PR A §2.2 (d).
- `layout/statusItems.ts:23`: "Every string is a P6 placeholder".
- `layout/contributions.ts:13`: the Table label is a P6 placeholder (milestone 4 PR C §2.4 (a)).
- `layout/actionRegistry.ts:84, 86, 89`: placeholder; :89 cites ADV-2026-11-20-05 item 6.
- `feature/ToolSwitch.tsx:18`: labels are the human's (Amendment 1 A11); the lines are P6 placeholders.
- `feature/OpenDuringExportAsk.tsx:11`: the line is a placeholder; the labels are the form's.
- `admission/AdmissionPanel.tsx:305`: the advisor's words, ADV-2026-11-20-05 item 2.
- `admission/DescribeSummary.tsx:35`: placeholders.
- `admission/describeSummaryText.ts:102`: "the human's wording at P6".
- `canvas/decodeBatch.ts:55`: "the human's wording at P6, ADR-034 Acceptance item 6". Line 76-77 says "placeholder" with the mark split across lines, so grep does not match it.
- `canvas/highlightLayers.ts:16`: "two colours are P6 placeholders the human sights at the sitting".
- `command/CommandBar.tsx:22`: "Every operator string is a P6 placeholder".
- `filter/ClauseCards.tsx:15`: the same.
- `project/saveProject.ts:15`: "None is the human's wording".
- `project/reopenNotices.ts:5`: the advisor's wording from ADV-2026-11-20-05 item 2 and -09 item 2, "none is the human's (S8 is theirs to overturn at P6)".
- `attributes/values.ts:30`: placeholder only.
- `style/StylePanel.tsx:51`, `style/Legend.tsx:7`: placeholder only.
- `style/styleConstants.ts:6`: the colours are P6 placeholders, "none is a design decision".
- `table/TableTab.tsx:19`, `table/tableScope.ts:59`, `table/tableSource.ts:59`: placeholder only.
- `publish/types.ts:121-122`: the human's ruling of 2026-11-05 evening item 2; the prefix is the custodian's reading, confirmed by the human 2026-11-06.
- `publish/PublishDialog.tsx:10`: placeholder, citing AUTONOMY.md section 31 f.
- `publish/PublishPanel.tsx:43, 54, 663`: placeholder; :54 "the shell's own words"; :663 question round 66 item 4.
- `testUtils/terminalShapes.ts:37`: refers to a test (see section A).
- `styles.css:23, 265, 1258, 1327, 1352`: "Colours are P6 placeholders" (and :1352 "the marker and the foot are P6 placeholders").
- Comments in test files that quote the mark are not rows. `App.test.ts:1336` and `formatRefusal.test.ts:212` have such comments.

## Section C (started only)

Lines of form `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §2.12, which opens at line 492:
- Line 494: kernel messages, "one per code in §2.2". I did not enumerate them or search the kernel for marks.
- Line 497: S2, the folder picker's title. A marked string exists at `frontends/shell/src-tauri/src/commands.rs:334` `PROJECT_FOLDER_PICKER_TITLE` = `[P6 placeholder] Choose the project folder`. I did not confirm the link to S2.
- Lines 508-509: S13 (recovery offer), S14 and S15. I found no mark for them in the shell files; I did not search further.
- Lines 514-517: K-1 to K-4. K-1 is withdrawn; I did not search `KNOWN-LIMITATIONS.md`.
- S22: `actionRegistry.ts:84` says it is "the bar's `/save`, which carries no marker". Form line 1354 says "S22 is the bar's save word: it is typed after the slash and carries no marker".
- Form line 1188 puts a kernel message under P6: `no folder was given, and this open of the dataset has no project to save to`.
- Form line 1520 puts `skp.project_file_refused`'s message under P6.

## Section D (counts, shell `src/`)

Each row is `file: A rows + B rows; grep of [P6 placeholder] / grep of P6 placeholder`. B rows include 3 bracketed comment marks, so A + B is the count of grep lines. The grep counts here come from Grep count mode on non-test files, plus the earlier all-file count for the unbracketed figure.

- App.tsx: 2+2; 3/4
- attributes/values.ts: 2+1; 2/3
- command/CommandBar.tsx: 12+1; 12/13
- admission/AdmissionPanel.tsx: 2+1; 2/3
- admission/DescribeSummary.tsx: 4+1; 4/5
- project/saveProject.ts: 8+1; 8/9
- admission/formatRefusal.ts: 1+0; 1/1
- project/reopenNotices.ts: 24+1; 24/25
- layout/StudioLayout.tsx: 6+0; 6/6
- canvas/decodeBatch.ts: 3+1; 3/4
- layout/statusItems.ts: 3+1; 3/4
- filter/ClauseCards.tsx: 9+1; 9/10
- canvas/limits.ts: 1+0; 1/1
- layout/contributions.ts: 1+1; 1/2
- table/TableTab.tsx: 7+1; 7/8
- console/surfaceRegistry.ts: 21+0; 21/21
- canvas/HoverReadoutView.tsx: 1+0; 1/1
- layout/actionRegistry.ts: 4+3; 4/7
- table/tableSource.ts: 7+1; 7/8
- publish/types.ts: 1+2 (the comment on lines 121-122 counts as 2 lines); 2/3
- table/tableScope.ts: 2+1; 2/3
- admission/describeSummaryText.ts: 4+1; 4/5
- feature/FeatureTab.tsx: 18+1; 18/19
- publish/PublishPanel.tsx: 3+3; 3/6
- feature/OpenDuringExportAsk.tsx: 2+1; 2/3
- feature/ToolSwitch.tsx: 3+1; 3/4
- testUtils/terminalShapes.ts: 3+1; 4/4
- style/StylePanel.tsx: 15+1; 15/16
- style/Legend.tsx: 4+1; 4/5
- Files with an unbracketed comment mark only: canvas/highlightLayers.ts 0+1; 0/1. style/styleConstants.ts 0+1; 0/1. publish/PublishDialog.tsx 0+1; 0/1. styles.css 0+5; 0/5.

Agreement:
- The bracketed total is 176 in 29 files, as the custodian counts.
- Every file's A+B equals its "P6 placeholder" grep count.
- Row counts are per source line. A multi-line string is one row, and one line holding two strings would count once. `FeatureTab.tsx:96-97` are two lines and two rows.
- The split mark at `decodeBatch.ts:76-77` is not in either grep. I counted it in the B note above but not in the B row count for `decodeBatch.ts`.

## Not yet covered (second task)

- Outside `src/`: the grep reports 114 occurrences in 27 files, tests included (the advisor's 73 marks are tests left out). Non-test files with marks:
  - `frontends/shell/src-tauri/src/commands.rs` (1) and `publish.rs` (7).
  - `engine/src/wkb.rs` (30 plus assert lines in its own test module), `watch.rs` (9), `geoarrow.rs` (3), `error.rs` (2), `geoparquet.rs` (2), `predicate.rs` (3), `stream.rs` (2).
  - `kernel/src/skp.rs` (11), `kernel/src/lib.rs` (1), `kernel/src/publish/error.rs` (6).
  - `protocol/data-plane/src/adapter_ws.rs` (1) and `protocol/data-plane/README.md` (1).
- Test files holding the mark that I did not open: `engine/tests/*.rs`, `kernel/tests/*.rs`, `protocol/data-plane/tests/candidate_a.rs`.
- Section A cols 5 and 6 for the files marked `not stated` or `not searched`. Walkthrough rows were not searched at all.
- Section C beyond the start above.

Files read in full or in part:
- `<S>/adv-21-11.copy.md`
- `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (lines 490-565, plus grep hits for "P6")
- `frontends/shell/src/project/reopenNotices.ts`
- `frontends/shell/src/project/saveProject.ts`
- Excerpts of `OpenDuringExportAsk.tsx`, `decodeBatch.ts`, `formatRefusal.ts`, `limits.ts`, `surfaceRegistry.ts` and `publish/types.ts`
- The grep output for the rest.

Injected instructions found: none.
