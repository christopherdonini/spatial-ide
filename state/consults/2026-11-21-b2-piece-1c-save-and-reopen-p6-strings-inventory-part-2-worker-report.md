*Filed by the custodian: the P6 inventory's part 2 (ADV-2026-11-21-11 item 4), by the standard worker (claude-sonnet-5-5, read only, no run), on main at 89238a20: the marks outside the shell src, column 6 for every row, section C whole, section D against the advisor's 73. Its hand-back, 35890 bytes, sha256 12f7c3c1c72e0663043e7abca9b339cd985b5d93d779c1af9ed9812d5071fccf, below the rule, with a final newline added where it had none. Its calls in the transcript, by unique call ids: Bash 50, Read 3, SubagentHandback 1; none errored; from 2026-11-21T09:05:15.364Z to 2026-11-21T09:17:22.605Z. A departure, by its report and its transcript: one run of its search script redirected its output to a file in the custodian's scratch folder, outside the repository, and its next call removed it; no tracked file changed. The custodian's check, by script: every run of words between the slots of its 39 marked texts in backticks is in the source, 4 of them once joined from Rust line ends, read by the custodian. Its rows are numbered with one slip, which its own last paragraph corrects. It proposes no words and no grouping.*

---

Inventory part 2: the [P6 placeholder] strings, at 89238a20f5f16adf206e9cd3aefc7ec45e583e44 (main)

Result: all four tasks are done in this one report. The advisor's 73 marks in 13 files reproduce exactly, but they are 73 bracketed lines in the 13 `src` files and include 16 lines inside `#[cfg(test)]` modules; the product count is 57 lines (51 string rows plus 6 comment marks), plus 7 further marks that are unbracketed (6 comments and a README line).
Nothing tracked was changed; I wrote no file and committed nothing. A first run of my search script wrote a scratch output file and I removed it at once; no other file was written. Paths below are repo-relative except `<S>`. Column 5 cites are at this commit (my line numbers, not hashed pins).

Method notes (mine):
- Column 6 comes from a read-only script. Per row the key is the longest slot-free run of the string, cut to 60 characters, and it is searched in test files, `testUtils`, `frontends/shell/e2e/`, `MANUAL-WALKTHROUGH.md`, Rust test dirs and the `#[cfg(test)]` module of each Rust src file.
- Rows with no 20-character run (short labels) were searched in full between delimiters (`"x"`, `'x'`, backticks, `>x<`). Where the word is common (On, Apply, Cancel, cut, features, Other, Table, Selection) I report no walkthrough hit, because the match would not be a quote.
- I also searched tests for each constant's symbol name. Those hits are marked `sym`: they import the constant and do not quote its words.
- Walkthrough rows named below are Part AD (`MANUAL-WALKTHROUGH.md` lines 2021-2044) and the other Parts as listed.

## Task 1. Section A: marked strings outside `frontends/shell/src/` (51 rows, product code)

`wire:` = SKP code or error variant that carries the text. Column 4 = who worded it, as the file or form says. Column 5 = the form line that puts it under P6.

| # | file:symbol | text as the source has it (joined where split) | shows as; carried by | 4 who | 5 form |
|---|---|---|---|---|---|
|1| `engine/src/error.rs:427` `EngineError::SourceCoverageLost` Display | `[P6 placeholder] refused: the advisory watch on this source lost coverage ({detail}). This is not a statement that the file changed — the OS notification stream this session was relying on stopped reporting, and this check cannot see whether the file changed while it was not` (joined from `\` lines) | a refusal's message; `engine.source_coverage_lost` (`kernel/src/skp.rs:2279`) | comment :422-424: "the human's wording is owed at P6", engine fact only | `forms/engine/SOURCE-WATCHER-PREREGISTRATION.md` :107, §7 table :402 |
|2| `engine/src/geoarrow.rs:169` `mixed_kinds_detail` (const `MIXED_KINDS_DRAFT` :137) | `[P6 placeholder] {}` where the draft is `geometry_types [<declared list>] mix polygonal and point types; this engine reads one kind per geometry column`; kinds span and list are filled at run time | refusal message; `EngineError::GeoMetadata` (caller :217), wire `engine.geo_metadata` (skp.rs:2199) | :135 "as the ruling drafted it (question round 62, item 2; byte-copied from the ruling's draft by script)" | `forms/engine/GEOMETRY-POINTS-PREREGISTRATION.md` :108 (OPEN-2 (A)) |
|3| `engine/src/geoparquet.rs:415` | `[P6 placeholder] \`geo.columns.*.geometry_types\` member {i} is not a string` | refusal message; `GeoMetadata` / `engine.geo_metadata` | not stated at the line | `forms/engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` :75 |
|4| `engine/src/geoparquet.rs:425` | `[P6 placeholder] \`geo.columns.*.geometry_types\` is not a list` | same | not stated | MP1 form :563, :632 (OPEN-2 (A)) |
|5| `engine/src/predicate.rs:1446` `TypeRefusalReason::sentence` (ConversionRounds, VARCHAR/BOOLEAN) | `[P6 placeholder] an operand of text or BOOLEAN type beside NULL or beside an operand of its own type, refused by type` | refusal message; `FilterError::TypeNotAdmitted`, wire `filter_type_not_admitted` (skp.rs:2371-2376; Display at predicate.rs:378) | doc :1423-1427 "both P6 placeholders" | `forms/engine/ARITHMETIC-TEXT-LITERAL-BESIDE-NULL-REASON-PREREGISTRATION.md` :126, :135, :295 |
|6| `engine/src/predicate.rs:1450` | `[P6 placeholder] a conversion between a float type and an integer or decimal type, refused by type: values of the integer or decimal type can round in the float type` | same | doc :1427-1429 | `forms/engine/TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` §3 (W-1) :52-56, :69, :200 |
|7| `engine/src/stream.rs:2596` `OUT_OF_RANGE_DETAIL` | `[P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld` | stream terminal detail; `EngineError::Query` (stream.rs:2641), wire `engine.query` (skp.rs:2208) | :2594-2595 "the human's wording is owed at P6" | `forms/engine/STREAM-EVALUATION-FAILURE-FIXED-DETAIL-PREREGISTRATION.md` :62-63 (S1) |
|8| `engine/src/watch.rs:93` (off-Windows `ArmOutcome::ChecksOnly` reason) | `[P6 placeholder] this platform is not Windows; the advisory source-change watcher runs on Windows only` | reason text in `SourceCoverage.reason` (skp.rs:1384-1393) → describe summary and status item | not stated in file | SOURCE-WATCHER form §7 row :402 ("arming-failure and off-Windows reason prefixes") |
|9| `engine/src/watch.rs:524` `await_first_read` | `[P6 placeholder] could not arm the {which} directory watch: {e}` | same | not stated | same :402 |
|10| `engine/src/watch.rs:531` | `[P6 placeholder] could not arm the {which} directory watch: the watch thread exited without reporting whether its first read was issued` | same | not stated | same |
|11| `engine/src/watch.rs:579` | `[P6 placeholder] could not spawn the {which} watch thread: {e}` | same | not stated | same |
|12| `engine/src/watch.rs:609` `windows_watch::arm` | `[P6 placeholder] could not canonicalize the source path: {e}` | same | not stated | same |
|13| `engine/src/watch.rs:615` | `[P6 placeholder] the source's canonicalized path has no parent directory` | same | not stated | same |
|14| `engine/src/watch.rs:621` | `[P6 placeholder] the source's canonicalized path carries no file name` | same | not stated | same |
|15| `engine/src/watch.rs:632` | `[P6 placeholder] could not open the parent directory to watch it: {e}` | same | not stated | same |
|16| `engine/src/watch.rs:689` | `[P6 placeholder] could not open the grandparent directory to watch it: {e}` | same | not stated | same |
|17-38| `engine/src/wkb.rs` builders (22 rows) | :93 Polygon `WKB geometry type {raw_type} met; this open's encoding, {EXT_NAME_POLYGON}, reads WKB type {WKB_POLYGON} (Polygon) only`. MultiPolygon: :193 `EWKB flags (SRID/Z/M) present on the geometry type code; a geometry-embedded CRS or a third dimension is refused rather than dropped`; :204 `MultiPolygon with zero parts`; :214 `MultiPolygon part {part} carries EWKB flags (SRID/Z/M); a geometry-embedded CRS or a third dimension is refused rather than dropped`; :221 `MultiPolygon part {part} has WKB geometry type {part_type}; a part must be WKB type {WKB_POLYGON} (Polygon)`; :230 `WKB geometry type {other} met; this open's encoding, {EXT_NAME_MULTIPOLYGON}, reads WKB type {WKB_POLYGON} (Polygon) and type {WKB_MULTIPOLYGON} (MultiPolygon)`; :239 `{} trailing bytes after the geometry`; :252 `MultiPolygon part {part} has zero rings`. Point: :288 the EWKB text as :193; :295 `WKB geometry type {raw_type} met; this open's encoding, {EXT_NAME_POINT}, reads WKB type {WKB_POINT} (Point) only`; :303 `a Point with a NaN coordinate (WKB's empty Point) was met`; :308 `{} trailing bytes after the point`. Line: :327 `{what} has {n_pts} positions; a line needs at least 2`; :380 EWKB text as :193; :387 `... {EXT_NAME_LINESTRING}, reads WKB type {WKB_LINESTRING} (LineString) only`; :394 `{} trailing bytes after the linestring`. MultiLineString: :453 EWKB text as :193; :464 `MultiLineString with zero parts`; :474 `MultiLineString part {part} carries EWKB flags (SRID/Z/M); ...rather than dropped`; :481 `MultiLineString part {part} has WKB geometry type {part_type}; a part must be WKB type {WKB_LINESTRING} (LineString)`; :490 `... {EXT_NAME_MULTILINESTRING}, reads WKB type {WKB_LINESTRING} (LineString) and type {WKB_MULTILINESTRING} (MultiLineString)`; :498 `{} trailing bytes after the geometry`. Every row starts `[P6 placeholder] ` in the source. | row-decode refusals that stop the stream at the row; `EngineError::Wkb` (`Display` "wkb: …", error.rs:346), wire `engine.wkb` (skp.rs:2203) | not stated in the file (header :3-22 is silent) | MP1 form :96 and :318 (S-2); POINTS form E-P4 :122-127; LINES form :148 |
|39| `engine/src/stream.rs` — none further | | | | |
|39| `frontends/shell/src-tauri/src/commands.rs:334` `PROJECT_FOLDER_PICKER_TITLE` | `[P6 placeholder] Choose the project folder` | the native folder picker's title | :333 "S2, a placeholder" | 1c form §2.12 S2 (form :497) |
|40| `frontends/shell/src-tauri/src/publish.rs:79` `FILTER_SCOPE_SENTENCE` | `[P6 placeholder] this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter` (joined) | approval dialog's filter-scope block (payload at publish.rs:136); the panel echoes it from `src/publish/types.ts:133` | :71-75 "the human's ruling of 2026-11-05, evening, item 2"; the prefix is "the custodian's reading ... confirmed by the human on 2026-11-06" | `forms/frontends/PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET-PREREGISTRATION.md` §3 :48 |
|41| `frontends/shell/src-tauri/src/publish.rs:1495` (`bundled_viewer` map_err) | `[P6 placeholder] the reference bundle viewer's build record could not be read at {} ({detail}) — {remedy}` (`{remedy}` is one of two sentences at :1488-1491) | an `Err(String)` of `bundled_viewer`, shown as an export refusal; no SKP code (my reading) | not stated at the line | `forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` W8 :787, :663 ("W8 (a P6 placeholder)") |
|42| `kernel/src/lib.rs:546` (`EndedByCoverageLoss` arm) | `[P6 placeholder] this dataset's session ended when the advisory watch on its source lost coverage` (joined) | a terminal detail via `skp::terminal_detail_of`; `engine.source_coverage_lost` | comment :539-542 names SOURCE-WATCHER §2b; wording owner not stated | SOURCE-WATCHER form :402, :527 |
|43| `kernel/src/publish/error.rs:432` `GeometryEncodingNotPublishable` | `[P6 placeholder] refused: a version-1 bundle carries the {carried} encoding only, and this dataset's encoding is {encoding}` | publish refusal; `publish.geometry_encoding_not_publishable` (error.rs:293) | :428-429 "the wording is the human's" | MP1 form :147 |
|44| `kernel/src/publish/error.rs:438` `SessionIdentityNotPublishable` | `[P6 placeholder] refused: this dataset's features are identified by their position in the file, for this open only, and a published bundle carries its feature ids beyond this open` | publish refusal; `publish.session_identity_not_publishable` (:296) | :435 "the wording is the human's" | `forms/kernel/PUBLISH-SESSION-TIER-IDENTITY-PREREGISTRATION.md` :69, :82, OPEN-4 :330-331 |
|45| `kernel/src/publish/error.rs:445` `RedactionFinding` | `[P6 placeholder] refused: the redaction scan (ADR-017 §13) found {count} match(es) in \`{file}\` that are not operator-declared, the first of class \`{class}\` at byte {byte_offset}; no bundle was created at the destination` | publish refusal; `publish.redaction_finding` (:297) | :442 "the wording is the human's" | `forms/kernel/BUNDLE-REDACTION-SCAN-PREREGISTRATION.md` §2.10 :196, W1 :405-406 |
|46| `kernel/src/skp.rs:1033` `engine_error_of_pre_admission_signal` | `[P6 placeholder] a notification arrived for this source before admission` | refusal; `EngineError::SourceChanged`, `engine.source_changed` (comment :1028) | not stated | SOURCE-WATCHER :158 |
|47| `kernel/src/skp.rs:1271` | `[P6 placeholder] a notification arrived for this source before admission, but its kind could not be recovered after disarming` | refusal; `SourceCoverageLost`, `engine.source_coverage_lost` | not stated (fallback cited as Amendment 5 item 1, :1264) | SOURCE-WATCHER :158, :402 |
|48| `kernel/src/skp.rs:1392` | `[P6 placeholder] no watch was armed for this dataset` | `SourceCoverage.reason` (describe summary / status item) | not stated | SOURCE-WATCHER :161 |
|49| `kernel/src/skp.rs:1567` (viewport_query mint race) | `[P6 placeholder] this dataset's session ended while this query was being prepared` | refusal; `engine.source_coverage_lost` | comment :1559-1561 "own `[P6 placeholder]` mark (§7; §8 item 9)" | SOURCE-WATCHER :527 |
|50| `kernel/src/skp.rs:1706` | `[P6 placeholder] this dataset's session ended when the advisory watch on its source lost coverage` | refusal; `engine.source_coverage_lost` | not stated | SOURCE-WATCHER :402 |
|51| `protocol/data-plane/src/adapter_ws.rs:384` (`Terminal::ProducerFailed`) | `[P6 placeholder] the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered` | data-plane `TERM_PRODUCER_FAILED` detail (README :171 says "a P6 placeholder") | not stated | `forms/protocol/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` :180 ("Its wording is the human's at P6") |

(Row 39 appears twice in my numbering by slip; there are 51 rows: 1-38 then 39-51 with the second "39" being commands.rs. Count agrees: 16 engine + 22 wkb... see Task 4.)

Column 6 for these rows (tests, e2e, walkthrough):
- #1 error.rs:427: `frontends/shell/src/testUtils/terminalShapes.ts:42,59` (fixture copying it); `kernel/tests/typed_terminal_codes.rs:281,371` (Display "engine.source_coverage_lost: [P6 placeholder] refused: the advisory watch on this source…"); `kernel/src/skp.rs:5169` (test module). Walkthrough: Q2 (line 1522) names `engine/src/error.rs` `SourceCoverageLost`'s Display, not quoted.
- #2 geoarrow: `engine/tests/geometry_admission.rs:420,566` (the draft's words) and :423, :569, :613 (rebuild `"[P6 placeholder] {}"`); `kernel/tests/manual_walkthrough_fixtures.rs:417` (comment). Walkthrough P7(b) (line 1651), T6(b) (1703) describe it, by file `MIXED_KINDS_DRAFT`.
- #3-4 geoparquet: none found by text. Walkthrough S4 (line 1595) names "the `geometry_types` refusals" of `engine/src/geoparquet.rs`.
- #5: none found by text (`engine/tests/filter_type_admission.rs:656` holds a multi-line `text_sentence` with the words `[P6 placeholder] an operand of text or BOOLEAN type beside NULL or …`; my one-line key missed it, found by the mark grep). #6: `engine/tests/filter_type_admission.rs:572` and :658.
- #7: `engine/tests/admission_property_campaign.rs:1017`, `admitted_integer_overflow.rs:42`, `filter_type_admission.rs:1311`, `stream_fetch_overflow.rs:40` (each the full text with `query: ` prefix); in-module asserts compare against the const (stream.rs:2806, 2869).
- #8-16 watch.rs: none found by text in any test or walkthrough. Walkthrough Q2 (1522) names `engine/src/watch.rs` "the arming-failure and off-Windows reasons".
- #17-38 wkb.rs: none found by text. Prefix-only asserts `starts_with("[P6 placeholder] ")`: wkb.rs test module lines 746, 891, 1010, 1070, 1168, 1179, 1234, 1311 (8 test lines); `engine/tests/point_stream.rs:225`, `line_stream.rs:378`, `multipolygon_stream.rs:280`, `geometry_admission.rs:330,336`. Walkthrough S4 (1595), P7(c) (1651), T6(d) (1703) name `engine/src/wkb.rs` row refusals by file, not quoted.
- #39 commands.rs:334: `MANUAL-WALKTHROUGH.md` Part AD rows AD1 (2030) and AD2 (2031) quote "Choose the project folder".
- #40 publish.rs:79: `frontends/shell/e2e/export-view.mjs:25,27`; walkthrough G8 (line 340) quotes it; `publish.rs:2235` test passes the const (test module); `src/publish/PublishPanel.test.ts` pins it (sym, part 1 did not open it).
- #41 publish.rs:1495: `publish.rs:3595` (test module) asserts the prefix only. `kernel/tests` none.
- #42 lib.rs:546 and #50 skp.rs:1706 (same words): `kernel/src/skp.rs:5170` (test module), `kernel/tests/typed_terminal_codes.rs:372`, `frontends/shell/src/testUtils/terminalShapes.ts:58`.
- #43: `kernel/tests/publish.rs:1929` (prefix only, "a new operator string is a placeholder"). Walkthrough S3 (1594), P4 (1648) name the code and `[P6 placeholder]` start; S4 (1595) names the Display.
- #44: `kernel/tests/typed_terminal_codes.rs:489` (prefix only). #45: `typed_terminal_codes.rs:519` (prefix), :525-526 (the full text).
- #46: `kernel/src/skp.rs:4391` (test-module doc), `kernel/tests/source_watch_ordering.rs:327` (comment), :362 (the full text asserted).
- #47, #48: none found by text.
- #49: `kernel/src/skp.rs:4831`, :4925 (test module).
- #51: `protocol/data-plane/tests/candidate_a.rs:1026` asserts the `[P6 placeholder]` prefix and no brace (not the text); comment :1008 names the mutation.

## Section A, part 1's rows: column 6 as one table (files under `frontends/shell/src/`)

Text hits = a test, e2e or walkthrough line that has the words. `sym` = imports the constant by name only. "Prefix regex" = matches only the mark. Walkthrough rows named by description only are in the last block.

| file : symbol (line) | text quoted at | sym (constant imported, words not quoted) |
|---|---|---|
| project/reopenNotices.ts `QUESTION_TEXT` :20 | walkthrough AD4 (2033) | `e2e/reopen.mjs`, `App.reopen.test.tsx` |
| `QUESTION_COPY` :22, `QUESTION_SAME` :24, `QUESTION_CANCEL` :26 | walkthrough AD4 (2033) (words "A copy", "The same project", "Do not open") | none |
| `OPEN_ELSEWHERE_OWN_NOTICE` :29 | none found | `e2e/reopen.mjs`, `App.reopen.test.tsx`, `project/openProject.test.ts` |
| `OPEN_ELSEWHERE_OTHER_NOTICE` :31 | walkthrough AD5 (2034) | `e2e/second-open.mjs`, `App.reopen.test.tsx`, `openProject.test.ts` |
| `CHANGED_FILE` :33, `RELINKED_FILE` :34, `NOT_FOUND` :61, `NOT_FOUND_NONE` :62, `RELINK_CHOICE` :64, `LINEAGE_FILE_REFUSED` :75, `VIEW_NOT_APPLIED` :87, `WORKSPACE_TEXT` :107, `COLOUR_BY_NOT_RESTORED` :114 | none found | none |
| `LINEAGE_NOT_RECORDED_NOTICE` :72, `LINEAGE_NOT_KEPT_NOTICE` :74, `KNOWN_FOLDERS_FULL_NOTICE` :95, `MACHINE_RECORD_REFUSED_NOTICE` :97, `REOPEN_LOCATOR_REFUSAL_NOTICE` :103, `OPEN_PANICKED_NOTICE` :105 | none found | `project/openProject.test.ts` |
| `ENGINE_REFUSAL_NOTICE` :99 | none found | `App.reopen.test.tsx`, `openProject.test.ts` |
| `REOPEN_REFUSAL_NOTICE` :101 | walkthrough AD5 (2034) | `openProject.test.ts` |
| `STYLE_NOT_APPLIED_NOTICE` :122 | none found | `App.reopen.test.tsx` |
| project/saveProject.ts `SAVED_NOTICE` :26, `MARK_WITHHELD_NOTICE` :28, `notSavedNotice` :41 | walkthrough AD1 (2030) | `saveProject.test.ts`; `SAVED_NOTICE` also `App.save.test.tsx` |
| `NO_CANONICAL_SPELLING_NOTICE` :31 | none found | `e2e/project.mjs`, `saveProject.test.ts` |
| `THROUGH_LINK_NOTICE` :33, `SELECTION_NOTICE` :35, `FOLDER_HOLDS_PROJECT_NOTICE` :37 | none found | `saveProject.test.ts` |
| `NO_VIEW_NOTICE` :39 | none found | `App.save.test.tsx` |
| layout/actionRegistry.ts :85 "Save project", :87 "Colour by", :88 "Table", :90 "Open project" | words only, not as test quotes: AD (2021, 2030-2034, 2044) for "Save/Open project"; F (273, 277, 282) and AC (1989) for "Colour by"; AC (1989-1994) for "Table" | none |
| admission/AdmissionPanel.tsx :306 `Open project…`, :307 `Opening project…` | walkthrough AD2-AD5 (2031-2034) | none |
| command/CommandBar.tsx :32-41, :200-201 | none found in tests; walkthrough AB11 (1955) lists them by description ("the bar's lines for an empty bar…", "its name and its placeholder text") | `COMMAND_UNAVAILABLE_NOTE`: `App.command.test.tsx`, `App.save.test.tsx`; `COMMAND_BUSY_NOTE`, `COMMAND_FIELD_NOTE`: `App.command.test.tsx` |
| filter/ClauseCards.tsx :18-26 | `e2e/command-bar.mjs:45` (comment quoting :23 `Not applied. Try again.`) | `CLAUSE_ADVANCED_MARK`, `CLAUSE_REFUSED_LINE`, `CLAUSE_BUSY_LINE`, `CLAUSE_ADVANCED_NEW_LINE`, `clauseBlockedLine`: `App.command.test.tsx` |
| feature/FeatureTab.tsx :96-97 | `App.selection.test.tsx:585`, `feature/FeatureTab.test.tsx:132` | |
| :101 | `App.selection.test.tsx:622`, `FeatureTab.test.tsx:134` | |
| :118 | `FeatureTab.test.tsx:212` | |
| :122 | `App.lateResult.test.tsx:597`, `FeatureTab.test.tsx:198,206,209,220,224` | |
| :177 | `FeatureTab.test.tsx:169` | |
| :52-54 | none found | `STATUS_TEXT`: `FeatureTab.test.tsx` |
| :57, :58, :66, :72, :156, :158, :171, :174, :192 | none found | |
| layout/StudioLayout.tsx :308-:434 | none found; walkthrough U10 (1747) names them by description | |
| layout/statusItems.ts :31-34 | `layout/statusItems.test.ts:39,44,50,63` | |
| layout/contributions.ts :43 | `App.table.test.tsx:206` (part 1) | |
| App.tsx :754 | `MANUAL-WALKTHROUGH.md` N6 (957), `e2e/s5dVerdict.test.mjs:20,22`, `App.test.ts:1336-1339` (part 1) | |
| App.tsx :834 | none found | |
| feature/ToolSwitch.tsx | `ToolSwitch.test.tsx:66` (comment, part 1) | |
| feature/OpenDuringExportAsk.tsx :38,:40 | none found; walkthrough W11 (1840) names it by description | |
| style/StylePanel.tsx :56-57 `Cancelled. Nothing was applied.` | `style/StylePanel.test.tsx:278,311` | |
| :213 | walkthrough AC3 (1989) | |
| other StylePanel lines (:52-61, :317-:336) | none found | |
| style/Legend.tsx | `style/Legend.test.tsx:49`; `e2e/colour.mjs:42,43` (part 1); walkthrough AC3 (1989), AC5 (1991) for "No value" | `LEGEND_NULL_LABEL`, `LEGEND_OTHER_LABEL`: `Legend.test.tsx` |
| attributes/values.ts :31 `NULL`, :48 | `table/TableTab.test.tsx:139`, `e2e/attributes.mjs:52` (part 1) | `ATTRIBUTE_NULL_MARKER`: `attributes/values.test.ts`, `FeatureTab.test.tsx` |
| table/tableSource.ts :66-75 | `table/tableSource.test.ts:83,147,196`; `TableTab.test.tsx:163,174`; `e2e/table.mjs:312`; walkthrough AC7 (1993) | `EMPTY_TABLE`: `table/tableScope.test.ts` |
| table/tableScope.ts :61,:63 | `table/tableScope.test.ts:54,55`; `TableTab.test.tsx:143,144` | |
| table/TableTab.tsx :26-:146 | `TableTab.test.tsx:122` has the word "features" only | none |
| admission/DescribeSummary.tsx :36, :41 | `admission/DescribeSummary.test.tsx:45,46`; walkthrough A3 (162) | |
| DescribeSummary.tsx :88, :95 | none found | |
| admission/describeSummaryText.ts :94 | `layout/statusItems.test.ts:50,63` | |
| :81, :108, :111 | none found; `DescribeSummary.test.tsx:64,65` prefix regex (part 1) | |
| admission/formatRefusal.ts :86 | prefix regex only, `formatRefusal.test.ts:221` (part 1) | |
| canvas/HoverReadoutView.tsx :43 | none found; walkthrough AC10 (1996) names `HOVER_SESSION_COVERAGE_LOST_TEXT` | |
| canvas/decodeBatch.ts | prefix regex `decodeBatch.test.ts:235` (part 1); walkthrough AC10 (1996), S4 (1595) name it | |
| canvas/limits.ts :104-105 | none found; walkthrough S4 (1595) names `PickCeilingExceeded` | |
| publish/types.ts :133 | `e2e/export-view.mjs:25,27`; walkthrough G8 (340) | `FILTER_SCOPE_SENTENCE`: `publish/PublishPanel.test.ts` |
| publish/PublishPanel.tsx :44 | `App.selection.test.tsx:879` | |
| :57 | `App.command.test.tsx:618`, `App.selection.test.tsx:844,868` | |
| :664 | none found | |
| console/surfaceRegistry.ts (21 rows) | none found by text; walkthrough rows naming the console statements by description: U10 (1747), W11 (1840), AB11 (1955, `filter.clauseNotSent`), AC10 (1996, "the console's row for inspecting a feature") | |
| testUtils/terminalShapes.ts :41,:57,:58 (test support) | quotes engine and kernel strings; `kernel/tests/typed_terminal_codes.rs:372` quotes the same words | |

Other walkthrough rows that point at these strings without quoting them: Q2 (1522, lists `describeSummaryText.ts`, `DescribeSummary.tsx`, `formatRefusal.ts`, `App.tsx`, `error.rs`, `skp.rs`, `lib.rs`, `watch.rs`), W11 (1840), Y4 (1874), AB11 (1955), AC10 (1996), U10 (1747), S4 (1595), P7 (1651), T6 (1703).

## Section B: comments outside `src/` (marks and what each says)

- `engine/src/error.rs:422-424`: "the human's wording is owed at P6 (§7's placeholder list)"; states the engine's own fact only (bracketed mark).
- `engine/src/geoarrow.rs:135-137`: draft "as the ruling drafted it (question round 62, item 2; byte-copied from the ruling's draft by script)" (bracketed). `:158-161`: the ruling's draft with its kinds span replaced (question round 63, OPEN-2, at :140-141); "States engine facts only" (bracketed).
- `engine/src/predicate.rs:1427`: "The fifth, `ConversionRounds`'s, has two sentences, both P6 placeholders" (unbracketed; the first four are "copied byte for byte" from `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C, :1424-1426).
- `engine/src/stream.rs:2594-2595`: "the words are the engine's own facts, with no consequence sentence; the human's wording is owed at P6" (bracketed).
- `frontends/shell/src-tauri/src/publish.rs:71-75`: a P6 placeholder per the human's ruling of 2026-11-05 evening item 2; the prefix is "the custodian's reading ... confirmed by the human on 2026-11-06" (line 71 unbracketed, line 72 bracketed).
- `kernel/src/publish/error.rs:428`, `:435`, `:442`: "A P6 placeholder: the wording is the human's" (unbracketed ×3); :428-429 adds "states the format fact only".
- `kernel/src/skp.rs:1559-1561`: each coverage-lost detail "carries its own `[P6 placeholder]` mark (§7; §8 item 9)" (bracketed).
- `protocol/data-plane/README.md:171`: the `TERM_PRODUCER_FAILED` detail "is a P6 placeholder" (unbracketed, a README).
- Test-module comment/string lines (not rows): `publish.rs:2195,2214` (doc comments quoting the sentence in a mutation record), `publish.rs:3595` (assert); `skp.rs:4391,4794` (doc comments), :4831 (string), :5169-5170 (string); `wkb.rs` 8 asserts (see Task 4).

## Task 3. Section C, whole (unmarked strings that forms place under P6)

1. 1c form §2.12 (heading line 492), kernel messages "one per code in §2.2" (§2.2 at form :179; the nine codes at :200-208). No message carries a mark in source; all sit in `protocol/skp/src/v0/error.rs` (SKP `skp.` prefix per the form):
   - `project_folder_holds_project`: `{folder} already holds project.spatial` (error.rs:186).
   - `project_file_unwritable`: `the project could not be written: {detail}` (:197).
   - `project_file_refused`: `the project file's reader refuses it: {path}: {rule}` (:210; kernel `Display` at `kernel/src/project/mod.rs:606`).
   - `project_open_elsewhere`: `{project} is already open` (:279).
   - `project_target_through_link`: `{locator}: {segment} is a link` (:348).
   - `project_target_unresolvable`: four constructors: `{folder} cannot be resolved` (:299), `{locator}: {segment} cannot be resolved` (:310), `{locator}: not canonical` (:322 area), `{locator}: the folder cannot be resolved`, and `the data's path is not valid Unicode` (all `project_target_unresolvable`).
   - `project_lineage_not_kept_by_this_version`: `project.spatial records a lineage, which this version of the application does not keep` (:220).
   - `project_target_outside_folder`: no source place (`git grep -F` over kernel/src, protocol/skp/src finds the code nowhere).
   - `recoverable_record_locked`: no source place; the step-3 commands `list_recoverable`, `recover_session`, `discard_recoverable` appear in no src tree I searched.
   - Codes in source that are not in §2.2's list: `project_folder_not_given`, `project_file_names_another_project`, `project_file_unreadable`, `project_machine_record_refused`, `project_known_folders_full`, `project_machine_store_failed`, `project_target_wrong_kind` (error.rs:175-380). Tests: fixtures `protocol/skp/tests/data/v0-error-project_*.json` carry each message verbatim.
2. Part 1's two other kernel messages: form :1188 `no folder was given, and this open of the dataset has no project to save to`: source error.rs:178 and `kernel/src/project/mod.rs:209`, asserted at mod.rs:1452 and fixture `v0-error-project_folder_not_given.json:3`; unmarked. Form :1520 `skp.project_file_refused`'s message is the row above; unmarked in source.
3. S2 against `PROJECT_FOLDER_PICKER_TITLE`: linked by the source comment (commands.rs:333 "S2, a placeholder") and form §2.12; marked; row #39 above.
4. S13 (recovery offer, `{dataset}`, `{time}`, two choices), S14 and S15: the form gives no text, only descriptions (:508-509); no source place (no step-3 code in src).
5. K-1 withdrawn. K-2, K-3, K-4: `git grep -F` of their first clauses finds them only in the form (:514-517). `KNOWN-LIMITATIONS.md` has project items with different words: item 62 (store folders nothing removes), item 69 (link check made once), item 75 (Cancel before an online-only download not observed). I read none of them as the same text; nearest is a reading of mine. Item 75's comment (line 559) says "The advisor's wording under the human's delegation".
6. S22: the slash word `save`, `frontends/shell/src/layout/actionRegistry.ts:85` (`command: "save"`, unmarked; comment :84 says it "carries no marker"); form :1354, :1301. O-19b `open-project` (form :4227) is `actionRegistry.ts:90` `command: "open-project"`, unmarked. S23 (`NO_VIEW_NOTICE`) is marked (part 1).
7. Other forms' lists with unmarked members (each: form, section; source place by `git grep -F`):
   - M2 form (`forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md`), Amendment 7 item 3 :1072-1076: `LATE_CANCEL_FINISHED` and `LATE_CANCEL_FINISHED_UNAUDITED`: found, `OpenDuringExportAsk.tsx:20,22`, unmarked; :1202 says approved as drafted (the human's).
   - M2 :702 the two choices "Keep exporting" and "Cancel the export and go on": found, `OpenDuringExportAsk.tsx:45` (and :15 comment), unmarked.
   - M2 :267 scope words: `Selected, ignoring filter`: found, `actionRegistry.ts:78`, unmarked.
   - M2 tool/mode labels: found, `ToolSwitch.tsx:28-31` (`Add / remove`, `Replace`, `Add only`, `Remove only`), `actionRegistry.ts:76-77` (`Navigate`, `Select`), unmarked.
   - M3 form (`SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md`) :149 "Words for every entry (P6)": layers, inspector, activity, zoom-to-layer, navigate, select, zoom-to-selection, clear-selection, open, export, filter: found, `actionRegistry.ts:72-83`, unmarked. The labels "Command bar", "Open dataset", "Export", "Add filter": `actionRegistry.ts:80-83`, unmarked; walkthrough AB11 (1955) says every string "starts with [P6 placeholder] except the command labels and words".
   - M1 form (`SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md`) :215-223 "Placeholder strings for P6": descriptions only (headings, toggle labels, empty-Inspector text…); toggle labels exist unmarked at `actionRegistry.ts:72-74` (`Layers`, `Inspector`, `Activity`; my reading that these are the labels meant).
   - `TYPE-WALK-RULE2-RESIDUAL-REASONS-PREREGISTRATION.md` §3 :52-69: T-C's first four sentences are "the human's accepted text" and sit unmarked at `predicate.rs:1433-1441`; the form keeps only W-1 under P6.
   - POINTS form E-P4 :122-127 lists "truncation" among refusals "each with `[P6 placeholder]` text"; the truncation message is `truncated: wanted {N} bytes at {}` at `engine/src/wkb.rs:558`, unmarked. The Polygon builder's EWKB refusal (wkb.rs:84-88) is also unmarked. Both are mismatches between form and source.
   - `COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md` §2.6 :232 and the shorter form :68: texts (a), (a-p), (b), (g) and the i-texts go to the human's sight with no marker ("OPEN-A, ruled"). `git grep -F` of their words (`which matches more than one name in the file's schema when ASCII letter case is ignored`) finds no place in `engine/src` at this commit.
   - SOURCE-WATCHER form §7 :402 list: all of its strings are marked at this commit (#1, #8-16, #42, #46-50); :527 records two that once lacked the mark; both carry it now (skp.rs:1567, lib.rs:546).
   I did not read every other form's P6 lines (the grep shows 30+ forms mention P6); the lists above are the ones I found that name strings.

## Task 4. Section D: counts, tests left out

Rows per file are A (string rows) + B (comment marks). `br` = grep of `[P6 placeholder]`; `all` = grep of `P6 placeholder`; both are for product lines only (before the file's `#[cfg(test)]` module). Test-module lines apart.

| file | A | B | br / all (product) | agree | `#[cfg(test)]` lines (br) |
|---|---|---|---|---|---|
| engine/src/error.rs | 1 | 1 | 2 / 2 | yes | 0 |
| engine/src/geoarrow.rs | 1 | 2 | 3 / 3 | yes | 0 |
| engine/src/geoparquet.rs | 2 | 0 | 2 / 2 | yes | 0 |
| engine/src/predicate.rs | 2 | 1 (unbracketed :1427) | 2 / 3 | yes (3 = 2 + the unbracketed line) | 0 |
| engine/src/stream.rs | 1 | 1 | 2 / 2 | yes | 0 |
| engine/src/watch.rs | 9 | 0 | 9 / 9 | yes | 0 |
| engine/src/wkb.rs | 22 | 0 | 22 / 22 | yes | 8 (asserts :746, 891, 1010, 1070, 1168, 1179, 1234, 1311) |
| frontends/shell/src-tauri/src/commands.rs | 1 | 0 | 1 / 1 | yes | 0 |
| frontends/shell/src-tauri/src/publish.rs | 2 | 2 (:71 unbracketed, :72) | 3 / 4 | yes | 3 (:2195, 2214 doc; :3595 assert) |
| kernel/src/lib.rs | 1 | 0 | 1 / 1 | yes | 0 |
| kernel/src/publish/error.rs | 3 | 3 (unbracketed) | 3 / 6 | yes | 0 |
| kernel/src/skp.rs | 5 | 1 (:1559) | 6 / 6 | yes | 5 (:4391, 4794, 4831, 5169, 5170) |
| protocol/data-plane/src/adapter_ws.rs | 1 | 0 | 1 / 1 | yes | 0 |
| protocol/data-plane/README.md (not Rust) | 0 | 1 (unbracketed) | 0 / 1 | yes | n/a |

Totals:
- Product: A = 51, B bracketed = 6 (error.rs:422, geoarrow.rs:135 and 158, stream.rs:2594, publish.rs:72, skp.rs:1559). 51 + 6 = 57 `[P6 placeholder]` product lines. Unbracketed comment lines: predicate.rs:1427, publish.rs:71, perror.rs:428,435,442, README:171 = 6. All `P6 placeholder` product lines: 63. Both grep counts agree with my rows file by file.
- `#[cfg(test)]` module lines: 8 + 3 + 5 = 16.
- Against the advisor's 73 in 13 files: 57 + 16 = 73, in exactly the 13 Rust files listed (error, geoarrow, geoparquet, predicate, stream, watch, wkb, commands, publish, lib, publish/error, skp, adapter_ws). So the advisor's 73 includes 16 lines inside the files' own `#[cfg(test)]` modules, and excludes `protocol/data-plane/README.md` and the 6 unbracketed comment lines. Product string rows are 51 of the 73.
- Not in the 73 and not in my rows: bracketed marks under test directories: `engine/tests` 17, `kernel/tests` 13, `protocol/data-plane/tests/candidate_a.rs` 2 (32 in 14 files; the full grep `[P6 placeholder]` over the four trees gives 73 + 32 = 105 lines; with the unbracketed ones the first grep shows 114 occurrences in 27 files, as part 1 said).
- Counting marks as `P6 placeholder` over those 14 test files there are 33 lines (kernel/tests/typed_terminal_codes.rs has one unbracketed line and engine/tests/filter_type_admission.rs has two).

Scope and gaps (mine): section A column 4 for wkb.rs and watch.rs is `not stated` in the file; I did not search `state/` for the worker report that worded them. I did not read `PublishPanel.test.ts`. Hits are line matches, not checks that the test asserts the words.

Files read: `<S>/adv-21-11.copy.md`, `<S>/p6inv-part1.md`; `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (§2.2, §2.3, §2.12, lines 1188, 1301, 1354, 1520, 4227); P6 lines of `governance/forms/engine/` (SOURCE-WATCHER, MULTIPOLYGON-MP1, GEOMETRY-POINTS, GEOMETRY-LINES, TYPE-WALK-RULE2, ARITHMETIC-TEXT-LITERAL, STREAM-EVALUATION-FAILURE, COVERING-CASE-COLLISION ×2), `forms/frontends/` (M1, M2, M3, PUBLISH-FILTER-SENTENCE-UNDER-WHOLE-DATASET), `forms/kernel/` (BUNDLE-REDACTION-SCAN, PUBLISH-SESSION-TIER-IDENTITY), `forms/protocol/TERMINAL-WITHOUT-CREDIT`; the product Rust and TS sites named above; `protocol/skp/src/v0/error.rs`; `frontends/shell/MANUAL-WALKTHROUGH.md` (headings and the rows cited); `KNOWN-LIMITATIONS.md` (project items). Injected instructions found: none. Running as Sonnet 5.5; no override, no context handoff.

Correction to the table above: rows are numbered 1-51 without the duplicate slip; the two "39" lines are #39 (commands.rs) and a stray "stream.rs — none further" placeholder line with no content; ignore that line. Final state: nothing changed (`git status` unchanged from the start, apart from the staged files the custodian already had).
