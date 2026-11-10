*Custodian's filing note (2026-11-05): the architect's triage reading of the seventeen behaviours the cloud KNOWN-LIMITATIONS audit calls undeclared (U1 to U17), under the human's direction of 2026-11-05, item 2 (`state/directives/2026-11-05-platform-runs-filed-c1-governance-next-fixtures-kernel-node-8b-route-a-f-b-after-8c.md`): triage as on 2026-10-10, confirmed findings to nodes by the custodian's grading, area E's KNOWN-LIMITATIONS items first. Its brief by file (sha256 4b0ce9226dfb0b77f1a364b75826ebb2975ca4a4aa8ca0735cd4112123d2d828); the inputs the filed audits `state/consults/2026-11-03-cloud-kl-audit-report.md` and `state/consults/2026-11-03-platform-drift-sweep-area-e.md` and their comparison `state/consults/2026-11-05-platform-and-cloud-kl-audit-comparison.md`; read at main d8e52f77. The run 17:41:58Z to 17:49:22Z by its transcript (claude-opus-5-5; unique calls Read 53, Grep 59 and the hand-back, equal to the notification's). Extracted by script from the hand-back message in that transcript (21720 bytes, sha256 549d2d0e84e3bdf1effb9d1e9741b02e1e245207a5f7b7270b01ff8806e7a1e8). One change: the path of its brief in the custodian's scratch folder, a user-profile path, is written as `<the session scratchpad>/`; nothing else is changed. A reading, not Authority: the grading and any node are the custodian's, and the wording of any KNOWN-LIMITATIONS.md text waits for the human's sight.*

---

main @ d8e52f77. Triage report under `triage:area-e-kl@undeclared`, no gate verdict: the brief asks for findings, and grading them is the custodian's. I have no shell, so I could not check the brief's sha256 (4b0ce922…). The product files are as the brief states. The checkout's `governance/PLAN.yaml` has staged, uncommitted changes, so PLAN nodes are cited by id, never by line. Every other path:line is the checkout as it stands. Audit text is byte-copied from the bold lead of each row's second cell in `state/consults/2026-11-03-cloud-kl-audit-report.md` (a sub-line span of the line named). Code excerpts are byte-copied. Anything marked *(mine)* is my own wording.

## Findings, U1 to U17

**U1** (C:99) > **A file opened with session-only identity can be exported.**
- **On main: CONFIRMED** by reading.
  - The native lookup is exact: `engine/src/dataset.rs:1933` `find(|f| f.name() == &column)`. A file with no column named exactly `id` falls through to `DatasetIdentity::new_session_ordinal` (`:1957`).
  - `preflight_pinless_parts` (`kernel/src/publish/mod.rs:457-566`) has no identity-class check.
  - The ceiling check gets `verified_rows()`, which is `None` on the session tier (`engine/src/identity.rs:235`). `check_reader_ceilings` skips a `None` (`kernel/src/publish/ceilings.rs:138`).
  - The manifest writes `id_source` `session-ordinal:file_row_number` (`engine/src/identity.rs:88`, `kernel/src/publish/mod.rs:1440`). It keeps the fixed caveat `"uniqueness was verified over this file at open.` (`kernel/src/publish/mod.rs:1444`), which is false for this tier: no scan ran.
  - No kernel test publishes a session-tier dataset (a grep of `kernel/tests`).
- **Declared:** no. `KNOWN-LIMITATIONS.md:70` states the opposite ("it is never saved or published").
- **Kind: defect.** The published manifest states a verification that never happened. ADR-016 Amendment 1 (`docs/adr/ADR-016-stable-feature-identity-admission.md:192-203`) bounds this tier to one generation, and publishing it carries those ordinals outside that bound.
- **Node:** `publish-session-tier-identity`, plus item 3's clause in `kl-items-graded-untrue-or-stale`.

**U2** (C:100) > **A 32-, 16- or 8-bit integer `id` (or mapped) column is admitted at open, but no stream can carry it.**
- **On main: CONFIRMED** by reading.
  - Admission accepts the narrow types: `engine/src/identity.rs:332` `D::UInt64 | D::UInt32 | D::UInt16 | D::UInt8 | D::Int64 | D::Int32 | D::Int16 | D::Int8 => {`.
  - The SQL aliases the column with no cast (`engine/src/stream.rs:1440` `format!("{source_column} AS {id}, {geom}")`).
  - Every chunk decodes ids through `column_u64` (`:1947`), which accepts UInt64 or Int64 only and otherwise returns `"`{name}` is {}; expected a 64-bit integer"` (`:2688-2691`).
  - No engine test streams a narrow-integer identity (a grep of `engine/tests`).
  - Not decidable by reading: that DuckDB hands a Parquet INT32 to Arrow as Int32. Nothing was run.
- **Declared:** no. `KNOWN-LIMITATIONS.md:64` says the column must widen into `u64`, which a narrow type does.
- **Kind: defect.** The open succeeds, then every stream fails with `engine.query`. No identity form is offered, because admission did not refuse. Nothing in the app lets the user act on it.
- **Node:** `narrow-integer-id-unstreamable`.

**U3** (C:101) > **A null geometry stops the stream** at that row, with `engine.wkb` "row N has a null geometry".
- **On main: CONFIRMED.** `engine/src/stream.rs:2695-2696`: `if col.is_null(row) {` / `return Err(EngineError::Wkb(format!("row {row} has a null geometry")));`. It is called per row at `:1995`, and `engine.wkb` is mapped at `kernel/src/skp.rs:2134`.
  - Not in the audit: `row` is the index within the DuckDB chunk (`:1980` `for (row, id) in ids.iter().enumerate()`), not the file's row number. The engine message names a row the operator cannot locate *(mine)*.
- **Declared:** no. Item 31's list of rows that stop a stream (`KNOWN-LIMITATIONS.md:356`) does not include a null geometry, and a search of the repo's Markdown finds it in no operator-read file.
- **Kind: limit to declare.** It is consistent with item 31's stop-by-name rule. The chunk-local row number is a minor engine-message defect. Whether GeoParquet admits null geometries was not read here.
- **Node:** none beyond `kl-undeclared-behaviours-u1-to-u17`.

**U4** (C:102) > **The session can end with no change to the file.**
- **On main: CONFIRMED** by reading.
  - `engine/src/watch.rs:73` `WATCH_BUFFER_BYTES: usize = 65536`.
  - A 0-byte completion signals `CoverageLost` (`:343-350`, `"the notification buffer overflowed (a 0-byte completion)"`), and so does any non-abort read error (`:335-340`).
  - The kernel ends the generation on either signal (`kernel/src/skp.rs:1164-1170`).
  - The shell text is `frontends/shell/src/App.tsx:741`.
  - Not decidable by reading: how much folder activity fills the buffer, since that is OS behaviour.
- **Declared:** to operators, no.
  - `KNOWN-LIMITATIONS.md:236` (item 19) says "a difference in any component present ends the session". A coverage loss ends it with no difference.
  - `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:88` names "coverage lost" as a wire reason only.
  - Walkthrough Q2 (`frontends/shell/MANUAL-WALKTHROUGH.md:1516`) says a sitting does not provoke one.
- **Kind: limit to declare.** It is a safe refusal: reopening recovers.
- **Node:** none beyond the umbrella.

**U5** (C:103) > **"[P6 placeholder]" prefixes show in ordinary UI.**
- **On main: CONFIRMED.** Examples:
  - the watcher status item on every open dataset: `frontends/shell/src/layout/statusItems.ts:31-32`, reached whenever `facts !== null`;
  - the Table tab label: `frontends/shell/src/layout/contributions.ts:43`;
  - the Feature tab: `frontends/shell/src/feature/FeatureTab.tsx:51-185`;
  - the filter cards: `frontends/shell/src/filter/ClauseCards.tsx:18-26`;
  - the command bar, its input placeholder included: `frontends/shell/src/command/CommandBar.tsx:32-41`, `:201`;
  - `frontends/shell/src/App.tsx:741`, `:821`;
  - `frontends/shell/src/feature/OpenDuringExportAsk.tsx:40`.
- **Declared: PARTLY.** The practice is declared in `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:200` and `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:108`, and the walkthrough's Q2 row lists them (`frontends/shell/MANUAL-WALKTHROUGH.md:1516`). `KNOWN-LIMITATIONS.md` names placeholders only in items 31, 32 and 45's comment (`:357`, `:360`, `:407`).
- **Kind:** neither a limit nor a defect. It is the P6 process made visible: the strings are the human's at the sitting.
- **Node:** `operator-sitting-queue` owns the sights. A one-line statement at release level is the most a declaration would take.

**U6** (C:104) > **A build from main reports version 0.1.0**, and its installer carries the file name item 14 gives the v0.1.0 artifact.
- **On main: PARTLY.**
  - Confirmed: all three manifests say 0.1.0 (`frontends/shell/src-tauri/tauri.conf.json:4`, `frontends/shell/src-tauri/Cargo.toml:13`, `frontends/shell/package.json:4`).
  - Not confirmed: "reports". No shell code reads a version (no `getVersion` or `CARGO_PKG_VERSION` in `frontends/shell/src*` or `kernel/src`), so the app never shows one.
  - Only the installer name and the OS's installed-app metadata carry it. That the NSIS file name follows the version is Tauri's convention, not read here. `KNOWN-LIMITATIONS.md:149` records the v0.1.0 name.
- **Declared:** no.
- **Kind: defect, in the release process.** A main build cannot be told apart from the v0.1.0 artifact that `KNOWN-LIMITATIONS.md:3-12` scopes its lines to.
- **Node:** `release-v0-2-0` names the v0.2.0 tag but does not name the manifests' version field.

**U7** (C:105) > **Opening a file, the same one or another, clears the applied filter and every filter card, and keeps the style.**
- **On main: CONFIRMED.**
  - `frontends/shell/src/workspace/workspaceState.ts:108-109`: "the view's filter is / reset and its style kept". The code is `:152-156`, ending `filter: null`.
  - It is pinned by `frontends/shell/src/App.workspace.test.tsx:239` "RA2: a reopen resets the filter and keeps the style".
- **Declared:** no. `KNOWN-LIMITATIONS.md:75-76` says "reopening a dataset starts from the default", the opposite for the style, and no operator-read file declares the filter reset.
- **Kind: limit to declare.** It is designed behaviour, and the declared text is stale.
- **Node:** item 4 in `kl-items-graded-untrue-or-stale`.

**U8** (C:106) > **The Feature tab and the Table show at most 32 attribute columns**: the first 32 projectable ones in schema order.
- **On main: CONFIRMED.** `frontends/shell/src/attributes/projection.ts:8` `ATTRIBUTE_PROJECTION_MAX = 32` and `:17` `names.slice(0, ATTRIBUTE_PROJECTION_MAX)`. The Table uses the same set (`frontends/shell/src/App.tsx:842`, `frontends/shell/src/table/TableTab.tsx:39`).
- **Declared: PARTLY.**
  - In the app, the Feature tab states the count left out (`frontends/shell/src/feature/FeatureTab.tsx:63`), shown only beside an inspected feature. The Table states nothing.
  - Walkthrough AC10 (`frontends/shell/MANUAL-WALKTHROUGH.md:1987`) is a sight row.
  - `KNOWN-LIMITATIONS.md:81`'s `MAX_ATTRIBUTE_COLUMNS 32` is the bundle's ceiling, not the app's.
- **Kind: limit to declare.**
- **Node:** none beyond the umbrella.

**U9** (C:107) > **Hiding the Table (or closing Activity) cancels its Filtered scope.**
- **On main: CONFIRMED.**
  - The effect runs only while `shown` and cancels on cleanup: `frontends/shell/src/table/TableTab.tsx:64-66`.
  - `shown` means "Activity is open and this tab is the selected one" (`:31`), so switching to another Activity tab cancels it too.
  - A re-show calls `start`, which `reset`s every row (`frontends/shell/src/table/tableSource.ts:121`, `:197-204`).
- **Declared:** no. `KNOWN-LIMITATIONS.md:437` says the scope "asks the kernel once", but each re-show asks again.
- **Kind: limit to declare.** It is minor, though it also discards the complete result that item 55's counting uses.
- **Node:** none.

**U10** (C:108) > **A file over 2,000,000 rows cannot be exported at all.**
- **On main: PARTLY.**
  - Confirmed for a dataset with a verified identity: the prediction is the whole file's `verified_rows()`, whatever the scope (`kernel/src/publish/mod.rs:553-557`, `kernel/src/publish/ceilings.rs:138-146`). So Current view is refused however small the view. The refusal's remedy, "publish the current-viewport bbox instead of the whole file" (`kernel/src/publish/ceilings.rs:97`), is refused too.
  - Not confirmed for a session-tier or `DeclaredNotVerified` dataset. Its `verified_rows()` is `None`, so preflight predicts nothing and lets a publish of any size through, a residual named at `kernel/src/publish/ceilings.rs:114-119`. Such a file over 2,000,000 rows does export.
- **Declared: PARTLY.** `KNOWN-LIMITATIONS.md:82-86` declares a refusal "at preflight" with that remedy quoted. That the remedy is itself refused is not declared.
- **Kind: defect.** The refusal names a remedy that cannot work, and the bypass on the unverified routes shares U1's cause.
- **Node:** `export-refused-above-row-ceiling-every-scope`. The bypass half overlaps `publish-session-tier-identity`.

**U11** (C:109) > **Every bundle exported from the app carries no attribute columns.**
- **On main: CONFIRMED.**
  - `style_attributes` returns only a `match` column (`frontends/shell/src-tauri/src/publish.rs:1239-1243`) and is the only source of `attributes` (`:406`).
  - The shell's style type has no `match` variant (`frontends/shell/src/style/document.ts:18`).
  - With no attributes, the viewer's hover shows only `id ${hit.id.toString()}` (`renderer/bundle-viewer/src/main.ts:445-448`).
- **Declared:** no. `KNOWN-LIMITATIONS.md:74` covers the canvas only, and `KNOWN-LIMITATIONS.md:413` ("including the values of the columns your style uses") implies the opposite.
- **Kind: limit to declare.** It follows from ADR-023's literal-only style.
- **Node:** none beyond the umbrella. Item 47's clause sits with it.

**U12** (C:110) > **With a filter applied and Whole dataset chosen, the dialog contradicts itself.**
- **On main: CONFIRMED.**
  - The approval dialog shows the sentence whenever a filter is on, whatever the scope: `frontends/shell/src-tauri/src/publish.rs:635` `filter_scope: filter_active.then(|| FILTER_SCOPE_SENTENCE.to_string()),`.
  - The sentence says "publishing publishes the viewport extent, not your filter" (`:73-75`).
  - Whole dataset's row scope reads `"row scope: the whole file — every row the dataset contains"` (`:128`).
  - The panel shows the same sentence on `filterActive` alone (`frontends/shell/src/publish/PublishPanel.tsx:693`).
- **Declared: PARTLY.** `KNOWN-LIMITATIONS.md:105` quotes the sentence for both scopes as if it were accurate.
- **Kind: defect.** The UI contradicts itself, and one of its two statements about what is published is false.
- **Words:** the string is shown to the user, so it falls under P6. Its comment (`frontends/shell/src-tauri/src/publish.rs:71`) calls it verbatim from `NEXT-CUT.md`. Whether that makes it the human's own wording I did not establish.
- **Node:** none.

**U13** (C:111) > **Polygon hover and click are refused whenever the average extent of all resident features is under 9 px.**
- **On main: CONFIRMED.**
  - `averageFeatureExtent` runs over every resident batch (`frontends/shell/src/canvas/pickResolution.ts:90-117`), so off-screen resident features count.
  - It is compared with `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 9` (`:81`, `:204-206`), with no reference to the feature under the pointer.
  - The click takes the same branch: `frontends/shell/src/canvas/clickPick.ts:48` `if (deps.belowPickResolutionNow()) return { kind: "below-pick-resolution" };`.
  - The text is at `frontends/shell/src/canvas/HoverReadoutView.tsx:41`.
- **Declared: PARTLY.** Walkthrough K6 (`frontends/shell/MANUAL-WALKTHROUGH.md:744`) declares the refusal but not the averaging. Items 36 and 38 (`KNOWN-LIMITATIONS.md:376`, `:386`) declare it for points and lines only.
- **Kind: limit to declare.** Zooming in clears it.
- **Node:** none.

**U14** (C:112) > **The fit at open frames the first batch that carries geometry, not the file's extent.**
- **On main: CONFIRMED.**
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:1551-1560` fits once, on the first non-null `residentExtentRef`.
  - `fitToBounds` uses `fitAnchorRef`, the union of every batch pushed in the dataset's lifetime (`:1550`, `:1594`).
  - `describe` carries no extent (`:1541-1542`).
- **Declared: PARTLY.** Walkthrough H2 (`frontends/shell/MANUAL-WALKTHROUGH.md:449`) declares the Zoom to layer half ("**not** the full dataset extent"). The open-fit half is undeclared.
- **Kind: limit to declare.**
- **Node:** none.

**U15** (C:113) > **Cancel during a view's first data load does not stop that load**, including the first load after an Apply or Clear.
- **On main: PARTLY.**
  - `relinquishFill` also cancels the untiled stream whenever `manager.gridFrame` exists (`frontends/shell/src/residency/candidateArmSession.ts:260-264`). Only the frameless window stays uncancellable: "bootstrap, or an Apply/Clear reissue racing the first look's own frame-establishing terminal" (`:269-270`).
  - So after an Apply or Clear, Cancel does stop the reissue once a frame exists. The audit's "including" clause is too broad.
  - The status text is at `frontends/shell/src/residency/residencyStatus.ts:447`.
- **Declared:** yes for operators. The app's own status line says it, and walkthrough L4 (`frontends/shell/MANUAL-WALKTHROUGH.md:818`) quotes it. It is ruled behaviour (decision entry 35, cited in the code). It is not in `KNOWN-LIMITATIONS.md`.
- **Kind: limit,** already stated in the UI.
- **Node:** none.

**U16** (C:114) > **After any click or drag on the map, a wheel zoom does not restore the hover readout** until the pointer moves: the release clears the stored pointer pixel.
- **On main: CONFIRMED.**
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:1979` `lastPointerPxRef.current = null;` runs on every window `pointerup` or `pointercancel` (`:1982-1983`).
  - The settle emits no pick on a null capture (`:826-834`).
  - That deck.gl fires `onHover` only on pointer movement is assumed from the code's comment (`:1977-1978`), not read in deck.gl.
- **Declared:** no operator-read file says so. The code comment cites HOVER-REPICK-PREREGISTRATION §12 Amendment 3, a form.
- **Kind: limit to declare.** It is a designed refusal to act, and minor.
- **Node:** none.

**U17** (C:115) > **Opening a directory, or a file whose path contains `[`, `]`, `{` or `}`, gives a refusal whose advice cannot be followed in the app.**
- **On main: PARTLY.**
  - Confirmed for a file name with `[ ] { }`. The gate runs before anything else in `open_inner` (`engine/src/dataset.rs:325-327`), so no declared identity can get past it. The panel opens no form for this code (`frontends/shell/src/admission/AdmissionPanel.tsx:28-32`).
  - The message is `"refused: this source is partitioned across more than one file ({detail}), and \` … `declare an identity column that is carried in the data"` (`engine/src/error.rs:388-390`; the elision drops the middle sentence and no qualifier). For a single file, the engine message misstates the fact ("partitioned across more than one file"), and its first remedy, "Open a single file", is what the user already did.
  - Not reachable in the app: the directory half. The app's picker is `pick_file` (`frontends/shell/src-tauri/src/commands.rs:239`), so a directory cannot be chosen through ordinary use.
- **Declared: PARTLY.** `KNOWN-LIMITATIONS.md:248-256` declares the refusal, but not that its advice cannot be followed.
- **Kind: defect.** The engine message states an untrue fact, and the refusal cannot be acted on.
- **Words:** the engine message is an engine fact under P6. Whether its wording is the human's was not established.
- **Node:** none.

## Proposal (grading is the custodian's)

**Fix nodes, by module:**
- **kernel publish:**
  - U1, via `publish-session-tier-identity`. Its paths are `kernel/src/publish/mod.rs` and `kernel/src/publish/ceilings.rs`.
  - U10, via `export-refused-above-row-ceiling-every-scope`, same paths. Its unverified-route bypass is U1's cause and is best decided with U1.
- **engine:**
  - U2, via `narrow-integer-id-unstreamable`. Its paths are `engine/src/stream.rs`, `engine/src/identity.rs`.
  - U17, new. Its paths are `engine/src/dataset.rs` (`partitioned_source_detail`) and `engine/src/error.rs`.
  - U3's chunk-local row number, new and minor, in `engine/src/stream.rs`.
- **shell publish:** U12, new. Its paths are `frontends/shell/src-tauri/src/publish.rs`, `frontends/shell/src/publish/types.ts` and `PublishPanel.tsx`. The string is P6.
- **release:** U6, the manifests' version field, at `release-v0-2-0`. Its paths are the three manifests.

**Declaration groups, by KNOWN-LIMITATIONS item:**
- Items 3 and 5: U1 and U10, only if the human keeps the behaviour.
- Items 4, 10 and 40: U7.
- Items 8 and 47: U11.
- Item 19, or 23 to 28: U4.
- Item 31: U3.
- Items 36 and 38: U13.
- Item 42 or 39: U14.
- Items 51, 52 and 54: U8 and U9.
- Item 7 or the unnumbered paragraph: U15, optional, since the UI already says it.
- Item 13's neighbour: U16.
- Item 20: U17's advice, if the message stays.
- U5 is not an item: `operator-sitting-queue` owns it.

**Misstates or hides what a user can do or what is published** (the 2026-10-10 finding 8 class):
- U1: the manifest's verification claim, and item 3 contradicted.
- U10: a remedy that is itself refused.
- U11: no attributes are ever published, while item 47 implies otherwise.
- U12: the dialog says "viewport extent" under Whole dataset.
- U17: the engine says "partitioned" for one file, and its advice cannot be followed.
- U7: item 4 says the reverse.
- U2: the open succeeds and nothing draws, with no action offered.
- U6: the build identity, moderate.

**Minor gaps:** U3, U4, U5, U8, U9, U13, U14, U15, U16.

## Files read
- <the session scratchpad>/brief-tri-e2.md
- C:/dev/spatial-ide/state/consults/2026-11-03-cloud-kl-audit-report.md
- C:/dev/spatial-ide/state/consults/2026-11-05-platform-and-cloud-kl-audit-comparison.md (lines 85-124)
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md
- C:/dev/spatial-ide/governance/PLAN.yaml (nodes `kl-items-graded-untrue-or-stale` to `module-readme-moved-form-paths`, and `release-v0-2-0`; greps)
- C:/dev/spatial-ide/docs/adr/ADR-016-stable-feature-identity-admission.md (180-204)
- C:/dev/spatial-ide/engine/src/dataset.rs, engine/src/identity.rs, engine/src/stream.rs, engine/src/watch.rs, engine/src/error.rs (spans)
- C:/dev/spatial-ide/kernel/src/publish/mod.rs, kernel/src/publish/ceilings.rs, kernel/src/skp.rs (spans and greps)
- C:/dev/spatial-ide/frontends/shell/src-tauri/src/publish.rs, frontends/shell/src-tauri/tauri.conf.json (spans; greps of commands.rs, Cargo.toml, package.json)
- C:/dev/spatial-ide/frontends/shell/src/: App.tsx, layout/statusItems.ts, attributes/projection.ts, feature/FeatureTab.tsx, table/TableTab.tsx, table/tableSource.ts, workspace/workspaceState.ts, canvas/pickResolution.ts, canvas/HoverReadoutView.tsx, canvas/clickPick.ts, canvas/WorkingCanvas.tsx, residency/residencyStatus.ts, residency/candidateArmSession.ts, admission/AdmissionPanel.tsx (spans; greps of the rest)
- C:/dev/spatial-ide/renderer/bundle-viewer/src/main.ts (438-452)
- C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md (lines 245, 449-450, 744, 818, 1516, 1987)
