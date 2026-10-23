# The sitting script — the operator sitting queue, assembled (draft, 2026-10-23)

*The custodian's draft, on the human's ruling headed 2026-10-23, item 9 (`state/directives/2026-10-22-242-h-1-round-72-pin-f7-open-items-milestone-4-open-16-b-adr-020-corrigendum-a-1c-adr-036-words-approved-disk-parity-node.md`), from the PLAN node `operator-sitting-queue`. Section 2 is the architect's report, byte for byte (filed at `state/consults/2026-10-23-operator-sitting-queue-p6-strings-and-verdicts-architect.md`); section 3 holds each Part the queue names, byte-copied by script from `frontends/shell/MANUAL-WALKTHROUGH.md` at main c68245c462ea6fd17602a9420a1bf50c6901ae62, its lines given with each. Section 1 is the custodian's order. The sitting's date is the human's; nothing here is applied before the human's answers, and no walkthrough line is changed by this draft.*

# 1. The order of the sitting (the custodian's)

1. The build: the app at main's head on the day, with each Part's own prerequisites and fixtures as its rows give them.
2. Part P (points), P1 to P7, P7 read with its dated note (D7); the topmost-symbol verdict at P2 (C2; the queue's "P4", D3).
3. Part P (the degrees tile grid), P1 only, as the architect recommends (section 2, "Which Part P").
4. Part T, T1 to T6; T4's width and casing verdict (C1).
5. Part W, W0 to W11; the filter-scope sentence is read at Part G's G8, or at W11 with a filter on (A3).
6. Part Y, Y4. Then Part Z, Part AA and Part AB (AB11).
7. Part G, G1 to G8: G3's expiry sentence (C5) and G8's filter-scope sentence (A3, N1).
8. Part L, L5: entry 48's re-check (C4), either discharged by the 2026-09-07 sighting or re-run with the 30-second wait.
9. The sights with no row (D5): item 40 read whole (B1); the Reset line (B2), by its steps; O3 and its filter counterpart at source (B3, D6); entry 95's pan re-feel and the candidate-2 decision in round 1's sense, the press-point anchor (C3, D4).
10. The words: findings N1 to N7, each the human's yes, own words, or acceptance as it stands; N5 is already the human's wording.
11. After the merges now awaited, what joins (section 2, D): #244's rows in Parts F and G, milestone 4 PR A's Part AC, #241's R2.

# 2. The strings, the sights and the verdicts (the architect's report, byte for byte)

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


# 3. The Parts, byte-copied from `frontends/shell/MANUAL-WALKTHROUGH.md` at main c68245c4

<!-- Part P (points): lines 1614 to 1650 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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

<!-- Part P (the degrees tile grid): lines 1455 to 1484 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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
| P1 | Verify the fixture's hash against `MANIFEST.json` as Part N's own "Before N1" note describes. Click **Open GeoParquet…** and select the file above. The candidate arm is the default (`residencyArm.ts:50`'s own `DEFAULT_RESIDENCY_ARM`) — no arm switch needed. Let the first view settle (Part A's A4 shows what "settled" looks like), then open the newest `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-*.log` (Part M's M12 own path) and find its `candidate-grid-frame-established` line (`frontends/shell/src/residency/candidateArmSession.ts:1218-1221`). | Nothing on screen changes from what Part N's own N1 row already shows for this file — same summary, same CRS/provenance/display-convention lines, same rendered features. The session log's `candidate-grid-frame-established` line reads `baseSpan=0.8005154172768005…` (the JavaScript number for `2*Math.max(0.40025770863840027, 0.39821605223940537)`, approximately 0.8005; it was `baseSpan=2` before this piece — `MANUAL-WALKTHROUGH.md`'s own Part N run record above and the consult's P0 Step 3, `state/consults/2026-09-24-crs-unit-fact-and-bounds.md`) — the degree-keyed `MIN_ANCHOR_SPAN` (`1e-6`, `frontends/shell/src/canvas/tileGrid.ts`) applied to this file's own ~0.40°×0.40° extent, padded x2, instead of the metre-basis floor of 1. Record the line's exact `baseSpan=` value. |

**If anything deviates:** stop, record the exact step, and report it, same as every earlier Part. A
visible change on screen, or a `baseSpan` value that is not approximately 0.8005, is the deviation
this row exists to catch.

**Sitting estimate — scheduling only, not a claim about the app:** a few minutes: one corpus open, one
settle, one session-log read.

---

<!-- Part T: lines 1672 to 1702 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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

<!-- Part W: lines 1813 to 1833 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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

<!-- Part Y: lines 1856 to 1867 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

## Part Y — Export's Current view after the map moves by itself: the numbers in the dialog's Row scope, and the wording of the new strings (export-current-view-after-unreported-fit)

This Part is the Operator gate of `frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md` §9 (its rows X0 to X4 are this Part's Y0 to Y4, per its Amendment 3 item 7), run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict on whether Current view sends the area the map shows, and is discharged only once it has been run and its result log filled in. **No duration appears in any row or expected outcome** (`docs/08_Testing.md`; ADR-018). **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e): the rows are the form's, and their sentences are not the human's wording.*

| # | Step | Expected outcome |
|---|---|---|
| Y0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| Y1 | Open `filter-zoned.parquet` and wait until the map has drawn its data. Before any pan or zoom, open the Export section. | Current view can be chosen, and no reason is shown beside it. |
| Y2 | Pan the map to a corner of the data, then Apply `zone = 'residential'`; the map fits itself to the matches. Click **Export interactive map…** with Current view chosen, read the four numbers in the dialog's Row scope, and abandon the dialog. Then click Zoom to layer, export again, read the numbers, and abandon. | The Row scope line reads: the map's extent when Export interactive map… was clicked, with xmin, ymin, xmax and ymax. Record both sets of numbers. **Felt:** do the numbers tell you the area is the one on the map? |
| Y3 | Clear the filter; the map fits itself to the whole file. Click **Export interactive map…** with Current view chosen, read the four numbers, and abandon. Then drag a splitter to shrink the map, export Current view again, read the numbers, and abandon. | The numbers after the shrink differ from those before it. Record both sets. |
| Y4 | The P6 sight of the new strings: the reason Current view cannot be chosen yet (it shows only while the map has not drawn the file's data), and the Row scope sentence in the approval dialog. | Record the wording you approve or replace. If you did not see the reason in this run, say so. |

<!-- Part Z: lines 1881 to 1892 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

## Part Z — the status bar keeps one height: a notice coming or going does not move the map (shell-status-bar-one-height)

This Part is the Operator gate of `frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md` §9 as Amendment 1 restates it, run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict; it is discharged only once it has been run and its result log filled in. **No duration appears in any row.**

| # | Step | Expected outcome |
|---|---|---|
| Z0 | Read the form's section 10, the last amendment first. | Done before Z1. |
| Z1 | Open `filter-zoned.parquet`, choose Select, and click one feature. Open the file again: the ended-selection notice is in the status bar. Click a feature with Select: the notice clears. | **Felt:** did the map move or change size when the notice came? Did it move when the notice cleared? |
| Z2 | With a file open and no notice, read the bar. | It is two lines tall while it holds one line. **Record** anything that reads as wrong. |
| Z3 | With Narrator on, open the file again over a selection. | **Record** whether the whole notice is read. |
| Z4 | At 1024 × 640 (a dev build, `npm run tauri dev`, with DevTools' device toolbar at 100%, as Part U's U1 sets it), open the file again over a selection and read the bar. | It stays two lines tall, and if its items need more it scrolls inside. **Record** whether the notice needed scrolling to be seen. |

<!-- Part AA: lines 1902 to 1913 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

## Part AA — a crash leaves the session's filter and style changes on this machine, and a normal close removes them (b2-piece-1b-recording)

This Part is the Operator gate of `kernel/B2-1B-RECORDING-PREREGISTRATION.md` §9 (its rows X0 to X4 are this Part's AA0 to AA4: every letter A to Z is in use, so this Part takes the next name), run only on a build after that piece's merge, with a blank result log. It is the human's felt verdict on the console's `record_step` entries, and it carries the form's E2 (a normal close removes that run's record), because the e2e harness cannot close the app normally (the form's H5). It is discharged only once it has been run and its result log filled in. **No duration appears in any row.** **If anything deviates:** stop, record the exact step, and report it, as in every earlier Part. *Draft for the human's sight (the form's §9 and item 2e of `state/directives/2026-10-11-direction-after-status-review.md`): the step lines are the form's, and the Expected outcome cells are drafts, not the human's wording.*

| # | Step | Expected outcome |
|---|---|---|
| AA0 | Read the form's §10, the last amendment first. | Record the number of the last amendment you read. |
| AA1 | Open `filter-zoned.parquet` and apply `zone = 'residential'`. | The console shows `viewport_query`, then `record_step`. |
| AA2 | Drag the fill opacity and release; pick a colour and close the picker. | One `record_step` per release or close. **Felt:** does the console's `record_step` entry read as noise? |
| AA3 | End the app from Task Manager. | A new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions` holds the header and AA1's and AA2's steps, in order. |
| AA4 | Start the app, open `filter-zoned.parquet`, apply a filter, and note the new `unsaved-` folder under `%LOCALAPPDATA%\spatial-ide\sessions`; then close the app normally. | The folder you noted is gone; AA3's folder stays. This row carries E2. |

<!-- Part AB: lines 1927 to 1948 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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

<!-- Part G: lines 307 to 374 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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
| G3 | Read the approval dialog that appears, in full, before typing anything. | A modal appears, rendering `PublishPromptData`'s own fields in this exact order (`PublishDialog.tsx`, transcribed directly from source): a header line reading **`publish-static-bundle — class 3 — irreversible`**; immediately below it, set apart in its own shaded block, **one plain-language sentence** naming the concrete outcome — e.g. *"This will create a folder named "my-parcels" at C:\dev\spatial-ide\target\manual-walkthrough-publish, containing the selected rows as one or more data partitions, the interactive viewer page, and a manifest."* (ADR-017's Exposure review, 2026-08-17, condition 1 — the human's own G3 finding on the PRE-condition dialog, verbatim: *"there's a lot of things written but not necessarily that clear"*; this sentence is the fix, composed host-side from the destination you chose in G2, and it names no row/partition COUNT because none is known yet at this point — the wording says "the selected rows" and "one or more data partitions" rather than inventing a number); then the field list — **Source** (the dataset's own logical name), **Source content hash** (`sha256:…`), **Style hash** (`sha256:…` — the style you set in G1), **Destination** (the FULL path you chose in G2, never truncated or ellipsized), **Grantor** (`os-user <your Windows account name> — grant remaining: <N>s`, a static number the host sent once, never ticking down), **Row scope** (a sentence naming whichever radio you left selected in G1 — *"row scope: the whole file — every row the dataset contains"* for Whole dataset, or the current-viewport wording for Current view); no filter-scope block (none is active yet — G8 is where that appears); then a standing, bold, red-orange warning reading **"This cannot be undone. Nothing here can remove a published bundle."** (verbatim — the same sentence `kernel/src/permission/approval.rs`'s CLI prompt already carries); then the instruction **"Type the destination's final path component to confirm."**, then, as a placeholder under P6 (`publish-approval-ttl-ten-minutes`), one sentence reading **"This approval expires after 10 minutes, and the publish then has to be started over."**, an empty text input, and **Cancel**/**Publish** buttons (**Publish** greyed out while the input is empty — typing anything at all enables it; nothing about what you type is checked client-side, only that it is non-empty). **JUDGE:** is the scope complete and readable — do you know exactly what will be written where, from what source, with what style, before you type anything? |
| G4 | Type a phrase you know is WRONG (e.g. `nope`) into the field and click **Publish**. | The dialog closes immediately — no re-prompt, no retry loop. In the Export section below, a typed refusal renders: code `publish-refused`, message **"refused: the confirmation did not name the destination. Expected exactly `<the destination's own final path component you chose in G2>`. Approval names *this* execution — a bare `y` would confirm that a key was pressed, not that the operator read where an irreversible publish was going (ADR-006 class 3; docs/09)"** (verbatim, with the bracketed part replaced by your own G2 destination's own final component — `kernel/src/permission/approval.rs`'s `ApprovalRefused::NotMatched` Display, crossing to the panel unmodified). No bundle exists at the destination you chose (the folder is empty or absent — check in Explorer if you like). **This is the one-prompt-no-retry property, felt live**: there is no "try again" control anywhere on the refusal itself — a new attempt means clicking **Export interactive map…** again, from the top, native picker included. |
| G5 | Click **Export interactive map…** again — either the same destination (now known to be untouched) or a fresh one — and this time type the CORRECT phrase (the destination's own final path component, read exactly off the dialog's own **Destination** field) and click **Publish**. | The confirming view is replaced by an executing view: a phase line (`role="status"`) that updates through the publish's real phases (`verifying-source`, `querying`, `query-running`, `writing-partitions`, `writing-style`, `writing-viewer`, `writing-manifest`, `finalizing` — `kernel/src/publish/mod.rs::PublishPhase::as_str`; not every phase is guaranteed to be observed on a fast, small-fixture run, `query-running` in particular per its own doc comment; no duration or percentage anywhere, ADR-018) and a **Cancel publish** button. On a fixture this small these may flash by too fast to read individually — judge only that phase text is present and changing, never its speed. The dialog then closes and a quiet summary renders in the panel: **"Exported."**, then a definition list — **Destination** (the bundle path), **Rows**, **Partitions**. No duration/`build_millis` figure anywhere (the evidence guard rail: the UI publish path is UNMEASURED this cut, and stays that way). Nothing auto-opens — no browser tab, no file-explorer window. |
| G6 | Open a text viewer (Notepad is fine) on `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`. | One JSON object per line — this file accumulates across every publish attempt ever made on this machine (every earlier automated `publish.mjs` run included), so scroll to the **last few lines**: your G4 attempt's own pair (an `intent` line, then an `outcome` line reading `"outcome":"refused"`, `"error_kind":"ApprovalRefused"`), then your G5 attempt's own pair (`intent` + `"outcome":"success"`). Both outcome lines read `"approval_route":"shell-dialog"`. Both intent lines' `"destination"` field is forward-slash-normalized and does not contain `C:\Users\<you>` or `C:/Users/<you>` — a `target\` destination like this walkthrough's own is outside the audit machinery's recognized user-profile roots, so it is reported plainly, as itself, with `"residual_classes":["local-filesystem-path"]` on the intent line **naming** that fact rather than hiding it (`kernel/PERMISSION-BOUNDARY.md`'s own declared behavior for this class — only a `credential`-class residual is fatal). **JUDGE:** is this the audit record you asked for — would it satisfy you, reading it in six months?<br><br>**Reading the audit log** (ADR-017's Exposure review, 2026-08-17, condition 2 — the human's own G6 finding, verbatim: *"honestly can't tell what's going on"*): rather than reading the raw JSONL above by eye, from `C:\dev\spatial-ide` run `cargo run -p spatial-kernel --bin publish-bundle -- --audit-show` (add a path argument, or set `SPATIAL_IDE_AUDIT_LOG`, to point at a log other than the default `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`). It prints one plain sentence per intent/outcome pair — your own G5 attempt should read something like `2026-08-17 08:44 — publish to C:/dev/spatial-ide/target/manual-walkthrough-publish/my-parcels — APPROVED via shell dialog and SUCCEEDED (2000 rows, 1 partition)`, and your G4 attempt something like `... — REFUSED: the confirmation did not match the destination (wrong phrase, or none given)`; an interrupted attempt (an intent with no outcome) reads `... — intent recorded, no outcome (interrupted?)`, and any line that fails to parse is reported as its own `CORRUPT` line rather than silently dropped. Read-only — this command never writes to the log. |
| G7 | From `C:\dev\spatial-ide\renderer\bundle-viewer`, run `node scripts/serve-bundle.mjs "<G5's own destination>" 8732` (Part F's own F7 command, pointed at G5's own bundle path, on a fresh port so it does not collide with a still-running Part F session). Open the printed URL (`http://127.0.0.1:8732/viewer/index.html`). | The bundle viewer loads (a status line reads something like "1/1 partitions verified · 2000 features drawn, ..."), and the polygons' fill colour, fill opacity, and outline in this separately-loaded static page visibly match the style you set in G1 — the same look-and-feel comparison Part F's F7 asks for, now reached by clicking **Export interactive map…** in the shell instead of running `publish-bundle.exe` by hand. The bundle is real: nothing about G5's success summary was a simulation. |
| G8 | Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then click **Export interactive map…** again (either scope option). | The approval dialog carries, in its own alert block below **Row scope**, this sentence verbatim: **"this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter"** (`publish.rs::FILTER_SCOPE_SENTENCE`). **Cancel without publishing** — either dismiss the native picker instead of confirming it (G2's own step), or, once the dialog appears, click its own **Cancel** button. No bundle is written either way. (Optionally, if curious: reopen the audit log — no new pair appears for either cancellation. This was checked, not merely asserted: reading `publish.rs` shows `AuditLog::open_for` and the intent record are written only *inside* `execute_with_progress`/`boundary::execute` — never during `prepare`, and `PublishDialog.tsx`'s own Cancel button (`handleAbandon`) never calls `execute` at all, so an abandoned-after-picker attempt reaches neither. Confirmed live as well, not only read: preparing an attempt through the dev-only test seam and deliberately never executing it left the audit log's line count and content completely unchanged — zero lines mentioned that attempt's own destination.) |
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

<!-- Part L: lines 766 to 836 of frontends/shell/MANUAL-WALKTHROUGH.md at c68245c462ea6fd17602a9420a1bf50c6901ae62 -->

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
control is unchanged and still worth noticing). **MANDATORY after EVERY Ctrl+R (added 2026-09-06,
after the first half-sitting's verdicts turned out arm-unverifiable): the arm silently resets to
`"baseline"` on every reload, and baseline on this fixture shows Part D's ceiling refusal
("accepting this batch would carry N resident vertices…", "N of M features rendered — declared
ceiling reached") where the candidate shows a declared partial view — so before each open, run
`await window.__SPATIAL_E2E__.getResidencyArm()` and require it to print `"candidate"`. A step
whose arm was not verified this way is recorded as arm-unverified, not as a verdict.** Also
verified this sitting (`engine/src/fixture.rs:618`): this fixture is laid out row-major by id, so
the candidate arm's 10,000-row first look is a bottom STRIP of the layer, and "Zoom to layer" fits
that strip (the fit anchor is the union of what has rendered — DECISIONS-PENDING entry 42), not the
dataset. Every "at fit" expectation below means that strip view.

| # | Step | Expected outcome |
|---|---|---|
| L1 | **Block A reference, not itself judged. [CORRECTED 2026-09-06 after the sitting's trace — the original expected the over-budget settled suffix; on this fixture under 1b the fit view is WITHIN budget.]** Arm candidate/fine per K2 (verify the arm!), open `polygons-100k.parquet`, let it settle, then click **Zoom to layer** and let the whole fill run to quiescence WITHOUT touching Cancel. | The button fits the rendered strip (see the fixture note above), whose covering set fits the render budget — 1b's P6b made the truncated first look evictable, which frees ~900k vertices (the sitting's own trace: `evictedTileKeys: 1`, resident 19,082 → 9,352). So: **no status line at all during the fill** (a within-budget fill emits `candidate-fill-progress`, reduced to no status — entry 36's own "re-earn at settle" rule), tiles arriving three at a time in row-major order over tens of seconds to minutes with only the liveness indicator as a signal, then at settle *"Showing all `<N>` features in view"* — IF the covering set was not truncated (entry 43: a truncated within-budget settle is silent by design). The over-budget sentence and string 4 do not appear here at all; they belong to a zoomed-OUT view. **Form the felt reference:** how does a long, text-less fill read? |
| L2 | Ctrl+R, re-arm per K2, reopen the fixture, click **Zoom to layer** again — and this time, while tiles are visibly still arriving, click **Cancel**. | Filling stops; **everything already rendered stays on canvas** (the view is retained, not cleared); the status reads (verbatim) *"Filling stopped — showing `<N>` features already loaded; the rest of this view was not loaded."* **Judge (the repointed Cancel, rulings 32a/33b):** does the stop read as *obeyed the click* — visibly prompt, in-flight work actually dying rather than draining out — and does the wording read honest (it must never say or imply "complete")? |
| L3 | From L2's cancelled state, pan the canvas one ordinary drag in any direction. | Filling resumes for the newly exposed area — Cancel relieved the backlog without disabling tiling (the defect Item A existed to fix: the old lever was permanent). **Judge:** does the resume feel ordinary — indistinguishable from any fresh pan — with no sense the earlier Cancel left the canvas wounded? |
| L4 | **Lightly scoped — a timing-tight window, and a miss is not a deviation (Part I's I6 precedent).** Ctrl+R, re-arm, reopen — and click **Cancel** as early as you can after the open, while the very first (untiled) data load is still delivering. | If the frame is already established, Cancel now reaches the untiled stream too (entry 35's ruling) — the stop obeys just as in L2. If you catch the pre-frame window instead, the status reads (verbatim, ruled 2026-09-06) *"Tile filling stopped — showing `<N>` features already loaded; this view's first data load is still running and Cancel does not stop it."* — sticky until the state resolves. **Judge whichever you catch:** honest, or evasive? |
| L5 | **Block B. [CORRECTED TWICE, 2026-09-06 — the original expected the paused suffix; a first correction (same day, code-read only) expected the over-budget sentence with a transient stall; the sitting's own trace then showed the fit view is WITHIN budget, so neither applies. This row now states what was observed and verified.]** Reproduce L1's fill (Ctrl+R, **verify the arm**, reopen, Zoom to layer) and watch the status line DURING the fill. | **[CORRECTED 2026-09-07 — the "none at settle" half predates F2 (PR #24): a truncated within-budget settle now speaks string 6, *"Filling has finished for this view — some areas were not loaded; pan or zoom to load them."*, sighted by the operator on the 48-(a) build.] Expect no status text DURING this fill; at settle, string 6 if the covering set was truncated** — the fill's silence is by 1b's own design, not a miss: a within-budget fill emits `candidate-fill-progress` → no status (`residencyStatus.ts:192`), and a within-budget settle that is incomplete by truncation is *"deliberately left silent"* (`candidateArmSession.ts:693-696`) — recorded as DECISIONS-PENDING entry 43 because it is silence representing state, the class entry 36 ruled against. The `stalled` suffix (string 1) cannot appear in a within-budget view; its home is an over-budget view whose in-viewport tiles are unevictable (the 5 GB shape, behind entry 40). String 1's wording is ruled and BS3 unit-pinned; nothing in the close gates on sighting it live here. **What to watch instead:** whether the canvas fills to the edges of the view or stops with space left (the sitting saw it stop — entry 43's own case) — record which. The optional probe (paste BEFORE opening the dataset, then Open GeoParquet, then Zoom to layer — its printed "click Zoom to layer now" line skips the open step; ignore that wording): `(async()=>{const out=[];const t0=performance.now();const timer=setInterval(async()=>{const q=await window.__SPATIAL_E2E__.residencyQueuedTileCount();const el=document.querySelector(".residency-status");const text=el?el.textContent:null;const last=out[out.length-1];if(!last||last.q!==q||last.text!==text)out.push({t:Math.round(performance.now()-t0),q,text});},50);window.__L5_PROBE_STOP__=()=>{clearInterval(timer);console.table(out);return out.filter(s=>s.text&&s.text.includes("paused")).length+" paused sightings";};console.log("L5 probe armed — open the dataset, then click Zoom to layer; run __L5_PROBE_STOP__() after settle.");})();` — a queue count that reaches 0 with the canvas still incomplete is the truncation signature. |
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
