*Custodian's filing note (2026-10-23): the P6 half of the sitting script, by the architect, read only at main c715c96b (the custodian checked by script that nothing outside the records changed between c715c96b and c68245c4). The run 02:25:00Z to 02:40:30Z by its transcript (Read 59, Grep 85, Glob 4; no Write, Edit or Bash). Its findings N1 to N7 (wording, for the human at the sitting; N5 is the human's own wording) and D1 to D7 (the script's notes and two stale walkthrough cites) are carried into `state/drafts/sitting-script-2026-10-23.md`, which holds it byte for byte beside the Parts. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 9780157796f1b2ca69ffdbf7b4d017d432f98d2783d40c2ee8929910ae188604.*

---

Prepared: the sitting's P6 strings and verdicts, at main c715c96b

I read everything in the main checkout. I took its HEAD to be c715c96b from the session's git status, because I have no shell to confirm it. For the same reason I computed no sha256, and none appears below. Every cite is `path:line @ c715c96b`. Ledger passages are cited by round and item or by entry number, never by line. Strings in backticks are copied from the code. Where the code builds a string from parts, the parts are named. Where a Rust `\` continuation or a JSX line break joins two source lines, the text is given as it renders (one space at the join). The node's list is `PLAN.yaml:5545 @ c715c96b`. The ruling is item 9, `state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md:24 @ c715c96b`. The list's own origin is item 2a of `state/directives/2026-10-20-232-redaction-go-22-rows-placed-d1-b-accepted-234-items-45-46-yes-s5d-a-ttl-ten-minutes-plan-practice-stands.md:11 @ c715c96b`.

**Which Part P.** The walkthrough has two Parts headed P:
- the degrees tile grid, crs-unit-fact-and-bounds (`frontends/shell/MANUAL-WALKTHROUGH.md:1455-1492 @ c715c96b`);
- points, geometry-points-cut (`frontends/shell/MANUAL-WALKTHROUGH.md:1614-1666 @ c715c96b`).

The list's P items (the mixed-kind placeholders, the topmost-symbol verdict) belong to the points Part P. The degrees Part P also has a blank result log, but it has no P6 string and no verdict, and I found no other node that owes it. I recommend that the sitting runs both: the degrees P1 is one open and one log read. Whether the governance sheet's L-rows include it I could not settle: the rows live in #232's PR body, which is not tracked.

---

## A. The walkthrough Parts

### A1. Part P (points) — rows P1 to P7, result log `MANUAL-WALKTHROUGH.md:1651-1666 @ c715c96b`, and the dated note at :1668

- **P4, the publish refusal (code `publish.geometry_encoding_not_publishable`).**
  - String: `[P6 placeholder] refused: a version-1 bundle carries the {carried} encoding only, and this dataset's encoding is {encoding}` (`kernel/src/publish/error.rs:402-406 @ c715c96b`).
  - Parts: `{carried}` is `format_declaration().geometry_encoding`, whose value is `geoarrow.polygon` per the comment at `kernel/src/publish/mod.rs:491 @ c715c96b`. `{encoding}` is `ds.geometry_encoding().as_str()`, so `geoarrow.point` here (`kernel/src/publish/mod.rs:493-500 @ c715c96b`).
  - Drafted by `engine/GEOMETRY-POINTS-PREREGISTRATION.md` §2, through KNOWN-LIMITATIONS item 32 (the MP-1 form's K2).
  - Clause check:
    - "a version-1 bundle carries the geoarrow.polygon encoding only" is true: the refusal fires when the encoding differs from the declaration's.
    - "this dataset's encoding is geoarrow.point" is true.
    - "refused before any approval prompt" is true: the check sits in `preflight_pinless_parts`, before the pin and before any write.
- **P7(b), the mixed-kind refusal (Polygon and Point).**
  - Built by `mixed_kinds_detail` (`engine/src/geoarrow.rs:162-174 @ c715c96b`). It starts from `MIXED_KINDS_DRAFT`, which reads `geometry_types [<declared list>] mix polygonal and point types; this engine reads one kind per geometry column` (:138).
  - The span `polygonal and point` (:142) is replaced by the kinds present, in the order polygonal, point, line, joined by `join_phrase`. `[<declared list>]` is replaced by `{types:?}`, and `[P6 placeholder] ` goes in front.
  - The operator sees it after `EngineError::GeoMetadata`'s Display prefix `geo metadata: ` (`engine/src/error.rs:340 @ c715c96b`). For this file it reads: `geo metadata: [P6 placeholder] geometry_types ["Polygon", "Point"] mix polygonal and point types; this engine reads one kind per geometry column`.
  - Drafted by question round 62, item 2 (the points form). The kinds span comes from round 63, OPEN-2 (the lines form).
  - Clause check:
    - "geometry_types [...]" is the declared list: true.
    - "mix polygonal and point types" is true. The kinds are the ones present, through `kind_of`, case-insensitively.
    - "this engine reads one kind per geometry column" is true. `encoding_for_declared_types` refuses every mix (`engine/src/geoarrow.rs:192-219 @ c715c96b`).
    - A set that also holds an unreadable type gets the readable-set detail first (:197-202), not this one.
- **P7(a), per the dated note at :1668: the GeometryCollection file.**
  - String: `geometry_types {types:?} include types this engine does not read; it reads {readable_set_phrase()}` (`engine/src/geoarrow.rs:197-202 @ c715c96b`). Shown after `geo metadata: `. It is not a placeholder (ADR-034 Decision 4's sighted wording).
  - Today it names `Polygon, MultiPolygon, Point, LineString and MultiLineString`: five types, not the three P7's row text says. The note supersedes the row.
  - Clause check: true.
- **P7(c), the other new placeholders.** All are prefixed `wkb: ` (`engine/src/error.rs:346 @ c715c96b`).
  - Point row refusals, `engine/src/wkb.rs:286-311 @ c715c96b`:
    - EWKB flags: `[P6 placeholder] EWKB flags (SRID/Z/M) present on the geometry type code; a geometry-embedded CRS or a third dimension is refused rather than dropped`. True: `EWKB_FLAGS` is the SRID, Z and M flags (:43-45).
    - A type other than 1: `[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, geoarrow.point, reads WKB type 1 (Point) only`. True.
    - A NaN coordinate: `[P6 placeholder] a Point with a NaN coordinate (WKB's empty Point) was met`. **Partly untrue.** The test (:300) fires when x or y is NaN. WKB's empty Point has both coordinates NaN, so a point with one NaN coordinate is not "WKB's empty Point". Finding N6.
    - Trailing bytes: `[P6 placeholder] {n} trailing bytes after the point`. True.
  - `UnexpectedEncodingError`: `[P6 placeholder] batch schema names geometry encoding {JSON(batch)}; this open's encoding is {JSON(expected)}, and the shell reads geoarrow.polygon, geoarrow.multipolygon, geoarrow.point, geoarrow.linestring and geoarrow.multilinestring -- refusing rather than walking the batch at a guessed nesting depth` (`frontends/shell/src/canvas/decodeBatch.ts:54-66 @ c715c96b`; the five come from the `ENCODING_*` constants). True as written. It is a shell fact.
  - `PickCeilingExceeded`: `[P6 placeholder] batch has {n} pick ordinals (polygon parts, line parts or points), above the declared 24-bit picking ceiling of 16777215 (ADR-010 rule 6) -- refused, not rendered` (`frontends/shell/src/canvas/limits.ts:72-80 @ c715c96b`; the ceiling at :27; `>` at :85). True. It cannot be reached in ordinary use, because a batch is bounded by the 16 MiB frame (:22-25), so it is read as written.
- **P7(d), KNOWN-LIMITATIONS items 31 to 36** (`KNOWN-LIMITATIONS.md:353-377 @ c715c96b`).
  - Item 31: each named reading and refusal matches `encoding_for_declared_types`.
  - Item 32: matches the preflight above.
  - Item 35 holds: `POINT_RADIUS_PX = 4` with `radiusUnits: "pixels"`, and the stroke appears only when `outlineWidth > 0` (`frontends/shell/src/canvas/buildLayers.ts:186 @ c715c96b`, :437-453). The style document still says `"polygon"` (`frontends/shell/src/style/document.ts:112 @ c715c96b`, :127).
  - Item 36 holds: `averagePointSpacing` (`frontends/shell/src/canvas/pickResolution.ts:137 @ c715c96b`). The click side holds too (`frontends/shell/src/feature/clickEffect.ts:43-72 @ c715c96b`).
  - Items 33 and 34 I did not check in code (`engine/src/lod.rs` and the part-per-datum drawing were not read).
- **On screen at P1, drafted by MP-1 (Part S), not this list.** Two summary labels and two declared-types texts:
  - `[P6 placeholder] Geometry (encoding chosen by the engine)` and `[P6 placeholder] Geometry types declared by the file` (`frontends/shell/src/admission/DescribeSummary.tsx:36 @ c715c96b`, :41);
  - `[P6 placeholder] the file declares no geometry_types key` and `[P6 placeholder] the file declares an empty geometry_types list` (`frontends/shell/src/admission/describeSummaryText.ts:108 @ c715c96b`, :111).
  - Not checked here.
- **Verdict at P2:** see C2.

### A2. Part T — rows T1 to T6, result log `MANUAL-WALKTHROUGH.md:1703-1718 @ c715c96b`

- **T5, publishing L-1.** Same string as P4, with `{encoding}` = `geoarrow.linestring`. Clause check as P4: true.
- **T6(b), Polygon and LineString.** The same `mixed_kinds_detail` build, which renders `geo metadata: [P6 placeholder] geometry_types ["Polygon", "LineString"] mix polygonal and line types; this engine reads one kind per geometry column`. Clause check as P7(b): true. "Record the kinds it names" gets `polygonal and line`.
- **T6(a).** The readable-set detail, five types. True.
- **T6(c), the LineString-declared file with point rows.**
  - String: `[P6 placeholder] WKB geometry type {raw_type} met; this open's encoding, geoarrow.linestring, reads WKB type 2 (LineString) only` (`engine/src/wkb.rs:385-390 @ c715c96b`), after `wkb: `. With point rows `{raw_type}` is `1`.
  - Or, first, `engine.no_covering_bbox`, whose text is `refused: viewport filter needs a covering bbox column ({detail}); this slice has no spatial index (docs/07 open gate)` (`engine/src/error.rs:341-345 @ c715c96b`). It is not a placeholder.
  - True.
- **T6(d), the line placeholders** (`engine/src/wkb.rs:323-329 @ c715c96b`, :378-397, :451-500):
  - EWKB flags: as for points.
  - `[P6 placeholder] {what} has {n_pts} positions; a line needs at least 2`. True, but it reads "1 positions" for one position (grammar only).
  - `[P6 placeholder] {n} trailing bytes after the linestring` and `[P6 placeholder] {n} trailing bytes after the geometry`.
  - `[P6 placeholder] MultiLineString with zero parts`.
  - `[P6 placeholder] MultiLineString part {part} carries EWKB flags (SRID/Z/M); a geometry-embedded CRS or a third dimension is refused rather than dropped`.
  - `[P6 placeholder] MultiLineString part {part} has WKB geometry type {part_type}; a part must be WKB type 2 (LineString)`.
  - `[P6 placeholder] WKB geometry type {other} met; this open's encoding, geoarrow.multilinestring, reads WKB type 2 (LineString) and type 5 (MultiLineString)`.
  - All true. `MIXED_KINDS_DRAFT`, `UnexpectedEncodingError` and `PickCeilingExceeded` are as in A1.
- **T6(e), items 31 to 33, 37 and 38.** Items 37 and 38 are checked at B4. Items 31 and 32 are as in A1. Item 33 is not checked.
- **Verdicts at T2 and T4:** see C1. T2 also asks whether naming the topmost of two crossing lines is acceptable (result log `:1713`). That verdict is in the Part, not on the list.

### A3. Part W — rows W0 to W11, `MANUAL-WALKTHROUGH.md:1813-1854 @ c715c96b`

W11 is at :1832. Every string below was drafted by `frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md` (§2.8; Amendments 1, 7 and 8).

- **The tool switch** (`frontends/shell/src/feature/ToolSwitch.tsx:21-24 @ c715c96b`, :46, :65, :85).
  - Hint template: `[P6 placeholder] ${entry.label} (${entry.bareKey?.letter.toUpperCase()}): ${click}`. Labels and keys come from `frontends/shell/src/layout/actionRegistry.ts:65-66 @ c715c96b`.
  - It renders `[P6 placeholder] Navigate (N): a click inspects the feature.` and `[P6 placeholder] Select (S): a click changes the selection, by the mode.`
  - Group labels: `[P6 placeholder] Map tool` and `[P6 placeholder] Selection mode`.
  - Clause check:
    - Navigate's "a click inspects the feature" is **untrue while a feature is pinned**: the pinned feature is kept (`clickEffect.ts:65-66`). W11 already names this. Finding N3.
    - Select's "a click changes the selection" is **untrue for a click on nothing**, which changes nothing in Select (`clickEffect.ts:47-54`). Finding N3.
- **The Feature tab** (`frontends/shell/src/feature/FeatureTab.tsx @ c715c96b`).
  - Status lines: `[P6 placeholder] Drawn in the view.`, `[P6 placeholder] Not drawn: outside the view.` and `[P6 placeholder] Not drawn: in the view.` (:43-47).
  - Last-click lines: `[P6 placeholder] Last click: ${idLine(pick)}.`, `[P6 placeholder] Last click: ${idLine(pick)}. The pinned feature, id ${id}, stays inspected.` and `[P6 placeholder] Last click: no feature there.` (:55-60).
  - `[P6 placeholder] No feature is inspected.` (:108).
  - Counts: `[P6 placeholder] Outside the view: ${n}` and `[P6 placeholder] In the view, not drawn: ${n}` (:123, :126).
  - Scope: `[P6 placeholder] Zoom to selection acts on: Selected, ignoring filter` (:141, built from `actionEntry("selection.zoomTo")`'s label and `scopeWords`).
  - Section labels: `[P6 placeholder] Inspected feature` and `[P6 placeholder] Selection` (:106, :120).
  - Clause check:
    - The counts are true per `countSelection` (`frontends/shell/src/workspace/selection.ts:143-157 @ c715c96b`).
    - "acts on: Selected, ignoring filter" is true: the zoom takes the union of every member (`frontends/shell/src/App.tsx:1900-1905 @ c715c96b`).
    - The pinned line is true (`clickEffect.ts:65-66`).
- **The ended-selection notice**, shown in the Feature tab and the status bar (`FeatureTab.tsx:69-76 @ c715c96b`; `App.tsx:2360 @ c715c96b`).
  - String: `[P6 placeholder] The selection ended: ${dropped}, because ${because}.`
  - `dropped` is `${n} selected feature was dropped` or `${n} selected features were dropped`.
  - `because` is `the source file changed` for the reason `source-changed`, else `a dataset was opened`.
  - Also: `[P6 placeholder] The selection holds at most ${max} features: this one was not added.`
  - Clause check:
    - "a dataset was opened" is true. Each open mints a new handle (`kernel/src/skp.rs:1114 @ c715c96b`), so a rebind always ends the generation (`frontends/shell/src/workspace/workspaceState.ts:147 @ c715c96b`).
    - **"the source file changed" is untrue when the session ended because the watch lost coverage.** `EndReason` is `"observed-change" | "coverage-lost"` (`frontends/shell/src/skp/types.ts:235 @ c715c96b`). Both go through `endSession`, which dispatches `resource.generationEnded` (`App.tsx:1341-1349 @ c715c96b`), and both become `source-changed` (`workspaceState.ts:158-166 @ c715c96b`).
    - A buffer overflow under heavy file activity in the folder gives coverage-lost, and so does a failed read (`engine/src/watch.rs:335-350 @ c715c96b`). Both are reachable in ordinary use. Finding N7.
- **The Export section's sentence:** `[P6 placeholder] The selection is not used. The export covers the row scope chosen above.` (`frontends/shell/src/publish/PublishPanel.tsx:44 @ c715c96b`; rendered at :695).
  - True. The scope is resolved with `selection: false`, and the Row scope fieldset (:665-691) renders above it.
- **The refusal when the scope changed:** `[P6 placeholder] The export was not run, because ${what} changed after it was prepared. Nothing was written. Prepare it again.` (`PublishPanel.tsx:55-58 @ c715c96b`).
  - `what` is the changed members' words from `SCOPE_CHANGE_WORDS` (:46-52), joined by ` and `.
  - True: the shell returns it without calling execute.
- **The ask** (`frontends/shell/src/feature/OpenDuringExportAsk.tsx:38-41 @ c715c96b`).
  - Group label: `[P6 placeholder] Open while an export runs`.
  - Text: `[P6 placeholder] An export of the open dataset is still running. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and the export is asked to stop and the new dataset is opened; the open dataset is closed once the export has ended.`
  - Button labels (the form's): `Keep exporting` and `Cancel the export and go on`.
  - Clause check:
    - **"is still running" is untrue once the run ends while the ask stands.** The ask stays up (`App.tsx:1151-1168`, :1171-1183).
    - **"the new dataset is opened" is untrue for a refused open** (`frontends/shell/src/admission/AdmissionPanel.tsx:222-260 @ c715c96b`).
    - With a refused open, "the open dataset is closed once the export has ended" is also untrue: the view stays bound to the old dataset.
    - W11 names the first two. Finding N2.
- **The two late-cancel statements** (the human's approved wording, Amendment 8 item 1; `OpenDuringExportAsk.tsx:20-22 @ c715c96b`):
  - `The export was not cancelled: it finished before the cancel could stop it. The bundle was written to:`
  - `The export was not cancelled: it finished before the cancel could stop it, but its outcome record could not be audited. The bundle was written to:`
  - Clause check: true. They are shown only for an execute run whose outcome is a bundle and for which the choice was made (:30-34; `App.tsx:1186-1203 @ c715c96b`). The window inside one round trip is named at :15-18.
- **The console statements** (`frontends/shell/src/console/surfaceRegistry.ts @ c715c96b`): `tool.set` :317, `mode.set` :324, `selection.change` :331, `selection.clear` :338, `selection.zoomTo` :345, `feature.inspect` :352, `feature.pin` :359, `dataset.openDuringExport` :366, and the edited `layout.selectInspectorTab` :289.
  - Each is true at main:
    - no command is sent for these actions;
    - Zoom to selection sends only the viewport query of the camera move;
    - for `dataset.openDuringExport`, `binding_publish_cancel` and `open_dataset` are recorded as their own rows (`frontends/shell/src/publish/client.ts:97 @ c715c96b`).
- **The publish dialog's filter-scope sentence** (the list's addition to W).
  - String: `this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter`. It lives in `frontends/shell/src-tauri/src/publish.rs:73-75 @ c715c96b`, and the panel's echo in `frontends/shell/src/publish/types.ts:126-128 @ c715c96b`.
  - It is shown in the dialog whenever `filter_active` is set (`publish.rs:635 @ c715c96b`; `frontends/shell/src/publish/PublishDialog.tsx:264-268 @ c715c96b`) and in the panel (`PublishPanel.tsx:693 @ c715c96b`).
  - Drafted by `NEXT-CUT.md`'s conditional block, item 3. The code calls it verbatim and binding.
  - Clause check:
    - "cannot record a row predicate" stands as the format's fact.
    - "not your filter" is true: both scopes build `filter: None` (`publish.rs:105 @ c715c96b`, :120).
    - **"publishing publishes the viewport extent" is untrue under Whole dataset with a filter on**, which is ordinary use: the whole file is published.
    - Already noted at `state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:164 @ c715c96b`. Finding N1.
  - **Where the human meets it:** no Part W row shows it, because W6 clears the filter before W8. Part G's G8 shows it (`MANUAL-WALKTHROUGH.md:331 @ c715c96b`). The sitting script must place the read: at W11 with a filter applied, or at G8.

### A4. Part Y — Y4, `MANUAL-WALKTHROUGH.md:1866 @ c715c96b`

Drafted by `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md`.

- **The reason** (the human's words, approved 2026-10-14): `Not available yet — the map has not drawn this file's data. Pan or zoom the map, or choose Whole dataset.` (`PublishPanel.tsx:70-71 @ c715c96b`). It is shown while `getViewBox()` is null (:382, :688-690).
  - True: no data of this file is drawn while the box is null (:328), and a pan or zoom reports a box.
- **The Row scope sentence** (the human's words, per the test name at `publish.rs:1628`):
  - `row scope: the map's extent when Export interactive map… was clicked (xmin {}, ymin {}, xmax {}, ymax {}) — not the whole file` (`publish.rs:125-136 @ c715c96b`).
  - Whole dataset gives `row scope: the whole file — every row the dataset contains`.
  - True, except with a map of zero width or height. That case is named in `getViewBox`'s comment (`PublishPanel.tsx:329-330 @ c715c96b`). It is not reachable in ordinary use as far as I read (the splitters keep the map usable, and a minimized window cannot be clicked), so it does not block.

### A5. Part Z — Z0 to Z4, `MANUAL-WALKTHROUGH.md:1881-1900 @ c715c96b`

No P6 string. Felt verdicts at Z1, and records at Z2 to Z4.

### A6. Part AA — AA0 to AA4, `MANUAL-WALKTHROUGH.md:1902-1925 @ c715c96b`

No P6 string. The `record_step` rows are class A, rendered from the captured request (`surfaceRegistry.ts:75-87 @ c715c96b`). AA2 is a felt verdict. The crash folder is KNOWN-LIMITATIONS item 43, approved as drafted.

### A7. Part AB — AB11, `MANUAL-WALKTHROUGH.md:1947 @ c715c96b`

Drafted by `frontends/shell/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md` §2.10 and its amendments.

- **The bar** (`frontends/shell/src/command/CommandBar.tsx:32-41 @ c715c96b`, :200-201):
  - `[P6 placeholder] Command bar`
  - `[P6 placeholder] Type / for commands or ? for help`
  - `[P6 placeholder] not available`
  - `[P6 placeholder] That command is not available right now.`
  - `[P6 placeholder] A file is already being opened.`
  - `[P6 placeholder] Type a command, or ? for the list.`
  - `[P6 placeholder] Choose a command with the arrow keys, then press Enter.`
  - `[P6 placeholder] No command has that name. Type ? for the list.`
  - `[P6 placeholder] Nothing matches that.`
  - `[P6 placeholder] Type a condition after /filter.`
  - `[P6 placeholder] Press Tab to put the field name in, then Enter to add the filter.`
  - `[P6 placeholder] ${hidden} more. Type more letters to narrow the list.`
- **Clause check of the bar:**
  - The busy note is true. Only `dataset.open` answers busy (`frontends/shell/src/layout/StudioLayout.tsx:236 @ c715c96b`), on an open in flight (`AdmissionPanel.tsx:316 @ c715c96b`). The Layers region is hidden, not unmounted (`StudioLayout.tsx:344`).
  - **"No command has that name" is untrue for a command word followed by a space**, for example `/open ` then Enter. `resolveDraft` matches only a condition-taking word once whitespace follows, and so returns `unknown-command` (`frontends/shell/src/command/commandDraft.ts:49-52 @ c715c96b`). Ordinary use. Finding N4.
  - The other notes are true at their sites (`CommandBar.tsx:44-56`, :146-155, :180).
- **The command labels and words** (the form's, not placeholders): `actionRegistry.ts:65-72 @ c715c96b`.
- **The cards** (`frontends/shell/src/filter/ClauseCards.tsx:18-26 @ c715c96b`; lead-line choice at :32-45):
  - `[P6 placeholder] Cards that are on are combined with AND. The filter keeps only features that meet every card that is on.`
  - `[P6 placeholder] On` and `[P6 placeholder] Remove`
  - `[P6 placeholder] Expression, used on its own`
  - `[P6 placeholder] Not applied. Your filter cards are unchanged.`
  - `[P6 placeholder] Not applied. Try again.`
  - `[P6 placeholder] A filter change is still being applied.`
  - `[P6 placeholder] Not applied: this condition is not one of the simple forms, so it can only be used on its own. Turn off the other cards first.`
  - `[P6 placeholder] Not applied: the card ${text} can only be used on its own. Turn it off first.`
  - All true against `changeClauses` (`App.tsx:1948-1968 @ c715c96b`).
- **The Console statement of `filter.clauseNotSent`:** `[P6 placeholder] no API equivalent exists -- the app did not send this filter change, because a condition that is not one of the simple forms can only be used on its own; nothing reached the kernel and the filter cards are unchanged.` (`surfaceRegistry.ts:201 @ c715c96b`).
  - True: the row is recorded on the refuse path and nothing is sent (`App.tsx:1954-1957 @ c715c96b`).

---

## B. The P6 sights

### B1. KNOWN-LIMITATIONS item 40, whole (`KNOWN-LIMITATIONS.md:392-394 @ c715c96b`)

- **Where:** no Part row. The human ruled, at `state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:11 @ c715c96b`, to see item 40 whole at the sitting.
- **Words:** drafted by milestone 2's §2.8, first new item. The source comment says they are not the human's.
- **Clause check:**
  - "ends when its dataset is reopened": true (`workspaceState.ts:147`, with a fresh handle per open).
  - "or its source changes": true (:158-166).
  - "never saved": true. The session history records only filter and style steps (`App.tsx:1003`, :1940).
  - "clears the inspected feature once the new dataset is open": true (`frontends/shell/src/workspace/viewTransitions.ts:180-186 @ c715c96b`).
  - "an open that is refused, or dropped with Keep exporting, leaves both as they were": true (`AdmissionPanel.tsx:203`, :222-260).
  - "When the app ends the open dataset's session, as it does when the file changes on disk, both end at once, with no new open": true. It also holds for coverage loss, and the clause gives the change on disk only as an example.
  - "say how many selected features were dropped and why": true as a count. The "why" is wrong for coverage loss (finding N7), which falls in the notice, not in item 40.
  - "Nothing is carried … closing the app also ends it": true.
  - **Item 40 holds at main.**

### B2. The Reset-changes-nothing console line

- **Where:** no walkthrough row. Reach it by opening a file with the style at its default, opening Style, clicking **Reset to default**, and reading the Console (Ctrl+J).
- **String:** `[P6 placeholder] no API equivalent exists -- Reset to default found the style already at the default, so nothing changed and no step was sent to the session history.` (`surfaceRegistry.ts:189-196 @ c715c96b`).
- **Drafted by** `kernel/B2-1B-RECORDING-PREREGISTRATION.md` Amendment 8, item 2 (C-3); the sight is set by Amendment 12, item 3.
- **Clause check:**
  - The row is written only when `source === "reset"` and there are no transitions from the last committed style (`App.tsx:1933-1941 @ c715c96b`; `frontends/shell/src/style/StylePanel.tsx:143-144 @ c715c96b`).
  - "found the style already at the default": true. I found no ordinary path that leaves an uncommitted live edit when Reset is clicked.
  - "nothing changed": true.
  - "no step was sent": true, because nothing is enqueued.
  - **Holds.**

### B3. O3 and its filter counterpart

- **Where:** no walkthrough row.
- **String** (`frontends/shell/src/workspace/stepRecorder.ts:81-86 @ c715c96b`): `${applied} It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent.`
  - `applied` is `Style change applied.` or, for `filter.apply`, `Filter applied.`
  - It is shown in the record notice (`App.tsx:838-848`, :2257).
- **Words:** the §2.10 O3 row (`kernel/B2-1B-RECORDING-PREREGISTRATION.md:400 @ c715c96b`), with the human's ending at Amendment 9, item 2 (:915). That makes it **the human's wording**.
- **Clause check:**
  - "Style change applied." / "Filter applied.": true. The style is applied by `onChange` before the commit, and the filter is enqueued after its issued commit (`App.tsx:997-1006`).
  - "It was not sent": true (`stepRecorder.ts:69-73`).
  - **"{n} earlier changes are still waiting to be sent" counts one change too many.** `waiting.length` includes the head, which has already been sent and is waiting for its answer (`stepRecorder.ts:45-60`). Finding N5.
- **The shown text carries no `[P6 placeholder]` mark,** though Amendment 9 keeps it a placeholder (finding D6).

### B4. KNOWN-LIMITATIONS items 37 and 38 (`KNOWN-LIMITATIONS.md:379-387 @ c715c96b`)

Drafted by the lines form §2 (new items 37 and 38) and the milestone-2 click sentences. They are not the human's words.

- **Item 37.** Every clause is true at `buildLayers.ts:227 @ c715c96b`, :398-427: 2 px in `pixels` units, rounded joints and caps, the fill colour and opacity, a casing only when `outlineWidth > 0`, in the outline colour (opaque), `2 + 2 * outlineWidth` wide, each casing pushed before its own batch's line. The style document says polygon.
  - "where lines cross they are drawn darker" holds at the default (`#4285f4` at 180/255; `document.ts:76-81 @ c715c96b`). For a fill lighter than what lies beneath it, overlap reads as more opaque rather than darker.
- **Item 38.** True:
  - `LINE_PICK_RADIUS_PX = 4`, line opens only (`pickResolution.ts:185 @ c715c96b`, :194-195);
  - applied at the hover (`frontends/shell/src/canvas/WorkingCanvas.tsx:1997-2009 @ c715c96b`) and at `pickCandidateAt` (:1236-1239);
  - `averageFeatureExtent` over all parts (`pickResolution.ts:90-117`);
  - the click semantics (`clickEffect.ts`).

### B5. The mixed-kind placeholders of Parts P and T

Covered at A1, P7(b), and A2, T6(b). One `mixed_kinds_detail` build serves both. True at main.

---

## C. The verdicts

### C1. T4, width and casing

- **Row:** T4 (`MANUAL-WALKTHROUGH.md:1693 @ c715c96b`). Result line: :1716.
- **Options on record:** keep 2 px or name the width wanted; the casing at the default opacity looks right, or not.
- **Recorded at:** `engine/GEOMETRY-LINES-PREREGISTRATION.md:657 @ c715c96b` (Amendment 1, item 3, reading round 63's OPEN-3 (A)) and item 37's source comment (`KNOWN-LIMITATIONS.md:381 @ c715c96b`). A verdict may revise `LINE_WIDTH_PX`.

### C2. "P4's topmost-symbol verdict"

- **Row:** the verdict sits at **P2 (points)**, its last line (`MANUAL-WALKTHROUGH.md:1638 @ c715c96b`). Result line: :1661.
- The walkthrough's P4 is the publish refusal. The list's "P4" is the human's wording in item 2a, so it is not edited; the script should say P2 (finding D3).
- **Options:** acceptable, not acceptable, or "no pile available". If not acceptable, question round 62, item 4's option (B) is the follow-up.
- **Recorded at:** item 36's source comment (`KNOWN-LIMITATIONS.md:377 @ c715c96b`).

### C3. Entry 95, the pan re-feel and the candidate-2 decision

- **Where:** no Part row at main. The last record is the 2026-09-14 sitting (`MANUAL-WALKTHROUGH.md:1424 @ c715c96b`).
- **Ruling:** round 1, item 1, option 2, "Re-feel first". The human feels the pan with #78's recenter fix in, then decides on the press-point anchor.
- **Options on record** (`state/questions/round-1.md:6-9 @ c715c96b`): 1, pursue the press-point anchor (preregistered and gated, with a felt re-verdict); 3, accept it and close entry 95 as geometrically pinned.
- **The naming clash:** round 1 calls deck's first-`pointermove` anchoring "candidate 2". `frontends/shell/PAN-ANCHOR-PREREGISTRATION.md:199-207 @ c715c96b` uses "candidate 2" for fractional-DPR rounding (refuted at DPR 1.0) and names the first-pointermove lag as an out-of-scope residual (:243-246). The script must say that the decision is round 1's sense, the press-point anchor (finding D4).

### C4. Entry 48, the L5 re-check

- **Row:** L5 (`MANUAL-WALKTHROUGH.md:817 @ c715c96b`).
- **What was owed:** entry 48 left open "the L5 re-check": string 6 was not seen, and a 30-second wait after the fill stops, on the same build, would settle whether that was timing.
- **The record since:** the 2026-09-07 run on the 48-(a) build logs string 6 sighted at L5 (:1367-1370). The string is still in the code, `Filling has finished for this view — some areas were not loaded; pan or zoom to load them.` (`frontends/shell/src/residency/residencyStatus.ts:434-435 @ c715c96b`).
- **For the human (my framing; no options are recorded):** (i) the 2026-09-07 sighting discharges the re-check; or (ii) re-run L5 on the current build with the 30-second wait.
- L5's own cites are stale (finding D1).

### C5. The publish dialog's expiry sentence, Part G, G3

- **Row:** G3 (`MANUAL-WALKTHROUGH.md:326 @ c715c96b`).
- **String:** `APPROVAL_EXPIRY_SENTENCE` = `This approval expires after ${APPROVAL_EXPIRY_MINUTES} minutes, and the publish then has to be started over.`, with `APPROVAL_EXPIRY_MINUTES = 10` (`PublishDialog.tsx:16-17 @ c715c96b`). It is rendered only in the confirming view (:283).
- **Drafted by:** `frontends/shell/PUBLISH-APPROVAL-TTL-TEN-MINUTES-PREREGISTRATION.md:50-63 @ c715c96b`. It is a P6 placeholder and not the human's words.
- **Clause check:**
  - "expires after 10 minutes": true. `PENDING_ATTEMPT_TTL` is 600 s, and the grant has the same lifetime (`publish.rs:62-69 @ c715c96b`). The start at the stash, before the mount, is named in the source comment (:10-15), so it does not block.
  - "has to be started over": true. An expired Submit gets `unknown-attempt` or a grant refusal, and the panel's text tells the operator to start over (`PublishPanel.tsx:305-309 @ c715c96b`).
- The text carries no `[P6 placeholder]` mark. G3 says that it is one.

---

## D. What joins the queue when the PRs awaiting merge land (named, not checked)

- **#244 (walkthrough-row-f7-cli-refusal; `PLAN.yaml:4514-4530 @ c715c96b`):**
  - row F7 in Part F, pointing at Part G's rows, with the CLI refusal line;
  - OPEN-4's parenthetical, in the architect's gate-2 words if the human says yes;
  - D1 (i), code spans in OPEN-4's clause, and D1 (ii), `serve-bundle.mjs` marked in G7, each the human's yes or no.
- **Milestone 4 PR A (`cut/b1-shell-half-pr-a` at 507197c1):**
  - Part AC, rows AC0, AC1, AC2, AC9, AC10 and AC11. AC10 carries PR A's strings. AC3 to AC8 are left for PRs B and C (`frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md:1052 @ c715c96b`).
  - KNOWN-LIMITATIONS items 51 and 52 (KL-4 and KL-7).
- **#241 (bundle-redaction-scan-not-in-product-publish; `PLAN.yaml:5428-5444 @ c715c96b`):**
  - no walkthrough Part of its own that I found;
  - R2, the human's publish from the installer at the final head;
  - any operator-visible refusal text the scan adds, not read;
  - the architect's recommended fix of `read_build_record`'s doc comment before R2.

---

## Findings and replacement words

None of these words are the human's unless marked otherwise. The human approves or replaces them at the sitting. Strings the app shows stay under P6.

**N1. The filter-scope sentence.** Its clause on the viewport extent is untrue under Whole dataset. It is NEXT-CUT.md's text; whether the human typed it I could not settle.
- Words, for `publish.rs:73-75` and its echo `types.ts:126-128`, together: `this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); the export covers the row scope above, not your filter`
- Check:
  - "the row scope above": in the dialog the Row scope field (`PublishDialog.tsx:261-262`) renders before the filter-scope block (:264-268), and in the panel the fieldset (`PublishPanel.tsx:665-691`) renders before the sentence (:693). True.
  - "not your filter": `filter: None` in both arms. True.
- The test that pins the two copies equal reads `publish.rs`. KNOWN-LIMITATIONS item 8 (`KNOWN-LIMITATIONS.md:105`) and G8 (:331) quote the sentence and follow it.

**N2. The ask.**
- Words: `[P6 placeholder] An export of the open dataset was running when this open was asked for. Keep exporting, and the new dataset is not opened. Cancel the export and go on, and an export still running is asked to stop and the new dataset is opened if its open is admitted; the dataset it replaces is closed once the export has ended.`
- Check:
  - "was running when … asked for": the ask is shown only when `exportRunsRef.current.size > 0` at `confirmOpen` (`App.tsx:1175-1181`). True.
  - Keep exporting: `runAdmitPath` returns before any state change (`AdmissionPanel.tsx:203`). True.
  - "an export still running is asked to stop": `run.cancel()` is called for each run (`App.tsx:1194-1199`), and the clause claims nothing of runs already ended. True.
  - "opened if its open is admitted": a refused open admits nothing (:222-260). True.
  - "the dataset it replaces is closed once the export has ended": after a rebind the old resource's consumers fall to the export's, whose release (`App.tsx:1161-1166`) makes it closable (`workspaceState.ts:214-219`), then `close_dataset` (`App.tsx:1471-1472`). True.

**N3. The tool hints.** These are the `click` parts at `ToolSwitch.tsx:22-23`.
- Navigate: `a click on a feature inspects it, unless a feature is pinned.` Check: pinned, kept (`clickEffect.ts:65-66`); unpinned, `inspect.set` (:67-71). True. A click on nothing, or below the 9 px rule, is not a click on a feature and gets its own last-click line.
- Select: `a click on a feature changes the selection, by the mode.` Check: `selection.apply` by the mode (:56-64); a click on nothing changes nothing (:47-54). True. At the selection's ceiling, Add is refused with its own notice. That is named, not claimed.

**N4. `COMMAND_UNKNOWN_NOTE`** (`CommandBar.tsx:37`).
- Words: `[P6 placeholder] No command matches that. Type ? for the list.`
- Check: the note is shown for `unknown-command`, which covers an unknown word (`commandDraft.ts:59`) and a word that takes nothing followed by text (:49-52). In both cases no entry resolves the whole draft. True.

**N5. O3 and its counterpart.** This is the human's wording, so the human answers.
- Words, for the tail at `stepRecorder.ts:85`: `It was not sent to the session history: ${report.waiting} earlier changes are still waiting to be sent or answered.`
- Check: `waiting` holds the head, which is sent and awaiting its answer, and the rest, which are not yet sent (:45-60). True.
- Reachability: the ceiling needs 64 commits faster than `record_step` answers, for example a held arrow key on a slider (each step is a commit) on slow storage. It is not proven either way, so I give words rather than a source-comment naming.

**N6. The NaN Point refusal** (`wkb.rs:303`).
- Words: `[P6 placeholder] a Point with a NaN coordinate was met (WKB writes an empty Point with NaN coordinates)`
- Check: the test is x or y NaN (:300). The parenthetical states the convention without calling every such point empty. True.

**N7. The ended-selection reason** (`FeatureTab.tsx:73`, the source-changed arm).
- Words: `the dataset's session ended`, rendering `[P6 placeholder] The selection ended: 2 selected features were dropped, because the dataset's session ended.`
- Check: the reason `source-changed` is written only by `endGeneration` (`workspaceState.ts:158-166`). That runs only on `resource.generationEnded`, which App dispatches only in `endSession` (`App.tsx:1341-1349`), for both `observed-change` and `coverage-lost`. True for both.

**Documentation (must-fix before the merge of whatever carries the script):**

- **D1. L5's stale cites.** At `MANUAL-WALKTHROUGH.md:817 @ c715c96b`, `residencyStatus.ts:192` and `candidateArmSession.ts:693-696` no longer point at what they claim. The quote "deliberately left silent" was replaced in the code (`residencyStatus.ts:396 @ c715c96b`).
  - Words: replace `(`residencyStatus.ts:192`)` with `(`nextResidencyStatus`'s `candidate-fill-progress` case, `frontends/shell/src/residency/residencyStatus.ts`)`.
  - Words: replace `is *"deliberately left silent"* (`candidateArmSession.ts:693-696`)` with `was silent before F2, and now speaks string 6`.
- **D2. The degrees Part P1's stale cite.** `candidateArmSession.ts:1218-1221` (`MANUAL-WALKTHROUGH.md:1474 @ c715c96b`) has moved: the call is at :1224-1228.
  - Words: `(the `logSessionEvent("candidate-grid-frame-established", …)` call in `frontends/shell/src/residency/candidateArmSession.ts`)`.
- **D3. P2 versus P4.** The script says P2 (points) for the topmost-symbol verdict. The node's "P4" is the human's wording and stays.
- **D4. Candidate 2.** The script uses round 1's meaning (the press-point anchor) and says so.
- **D5. Sights with no Part row at main.** The script must give each a step:
  - entry 95's re-feel;
  - the Reset line;
  - O3 and its counterpart (not reachable on demand; read at source);
  - the filter-scope sentence in Part W.
- **D6. Placeholder marks.** O3, its counterpart and the expiry sentence show no `[P6 placeholder]` mark. The script must tell the human they are placeholders.
- **D7. P7's dated note.** P7's row text is superseded by the dated note at `MANUAL-WALKTHROUGH.md:1668 @ c715c96b`, which moves part of it to T6. The script must read P7 with that note.

## What I could not settle

- The governance sheet's L-rows (#232's PR body, not tracked), so whether the degrees Part P is on the list.
- Whether NEXT-CUT.md's filter-scope sentence is the human's typed wording (NEXT-CUT.md is archived; not read).
- The kernel's mapping of `EngineError` into the `SkpError` message: I assumed it carries Display (`geo metadata: `, `wkb: `), but I did not read it.
- KNOWN-LIMITATIONS items 33 and 34, which I did not check in code.
- #241's new operator text, Part AC's rows and #244's rows: named only, as briefed.
- Whether the main checkout's HEAD is c715c96b: no shell.
