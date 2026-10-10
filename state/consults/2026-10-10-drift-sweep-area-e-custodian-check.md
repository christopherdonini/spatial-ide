# Drift sweep, area E (parts 1 and 2) — the custodian's check at 9e7362db

The custodian checked the human's drift sweep of area E, stated limits and tests against main. Both parts were copied byte-identical from the human's advisory folder, and each sha256 matches the human's:
- `state/consults/DRIFT-SWEEP-AREA-E-2026-10-10.md`: b89be82d67ed39744a51ae47f9c14bc2ed3cc028d22c64a5f1fad66b3ba82669
- `state/consults/DRIFT-SWEEP-AREA-E-PART-2-2026-10-10.md`: 39b8c78b5484c74ccf01271c35d698278b8850fb21b699809349ed39abdafa7d

Both parts name the commit they swept: 9e7362dbc67d00cae0c3ecc931de4e6c3b46a263. Every cite below is read at that commit with `git show`, and the filing script asserts each cited line's content there. Main's head when this was filed, d9a99e87dcf398ef5c5024fd8886d009675a86e3, has no change since the sweep under `engine/`, `kernel/`, `frontends/`, `renderer/`, `protocol/` or `docs/`, nor in `KNOWN-LIMITATIONS.md` or `RELEASE-0.1.md`.

**All ten findings hold.** The human's instructions (`state/directives/2026-10-10-drift-sweep-area-e-instructions.md`) are answered at the end.

## Finding 1 — holds

Item 2 states three CRS refusals that main no longer makes for a pinned version:
- **Easting-first only:** KNOWN-LIMITATIONS.md:38.
- **No default:** KNOWN-LIMITATIONS.md:39.
- **An absent `crs` key is refused:** KNOWN-LIMITATIONS.md:43.
- **A latitude-first CRS is refused** (KNOWN-LIMITATIONS.md:52), EPSG:4326 included (KNOWN-LIMITATIONS.md:55).

What main does:
- **The versions:** engine/src/geoparquet.rs:37 pins the two versions.
- **An absent key** under one of them admits as OGC:CRS84, `crs:format-default` (engine/src/geoparquet.rs:16).
- **A declared non-x-first definition** admits with the WKB order, `axis:format-override`, keeping its declared order (engine/src/geoparquet.rs:532).
- **The tests:** engine/tests/admission_format_semantics.rs:75; engine/tests/admission_format_semantics.rs:219.

## Finding 2 — holds

The test's name says refused: engine/tests/identity.rs:139, with its watchdog label at engine/tests/identity.rs:140. Its body says the shape now admits (engine/tests/identity.rs:149).

The name is repeated at:
- engine/src/identity.rs:254;
- engine/tests/admission_instruments.rs:67.

No form names it, so a rename trips no test claim.

## Finding 3 — holds

`App.test.ts` says the remount is not tested anywhere in this suite, and that no harness here can mount React (frontends/shell/src/App.test.ts:53, frontends/shell/src/App.test.ts:59). The same premise appears at:
- frontends/shell/src/admission/AdmissionPanel.test.ts:24;
- frontends/shell/src/admission/CrsAssertionForm.test.ts:13;
- part 2's added location, frontends/shell/src/canvas/WorkingCanvas.test.ts:122.

`App.layout.test.tsx` mounts `App` with a canvas stand-in that counts mounts and unmounts per dataset handle (frontends/shell/src/App.layout.test.tsx:14).

## Finding 4 — holds

The comment says `viewport_query` carries no attributes (renderer/tests/style_shell_agreement.rs:37, renderer/tests/style_shell_agreement.rs:38). The request has carried `columns` since `skp/0.6` (protocol/skp/src/v0/commands.rs:447). The same sentence also appears in product code, at `frontends/shell/src/canvas/buildLayers.ts`, which the report places in area A.

## Finding 5 — holds

engine/src/geoparquet.rs:868 says the default is not applied (engine/src/geoparquet.rs:869). The module comment says it is applied (engine/src/geoparquet.rs:16).

## Finding 6 — holds

The unpinned cites in these comments land on unrelated code:
- **Item 19's comment:** KNOWN-LIMITATIONS.md:235. Line 342 is `),`, and `SourceChanged`'s Display is at engine/src/error.rs:377.
- **Item 20's comment** (KNOWN-LIMITATIONS.md:246):
  - its cited lines read `&CancelToken::new(),`, `level,`, an Arrow arm and an `OpenRecord` comment (engine/src/dataset.rs:283, engine/src/dataset.rs:1356, engine/src/error.rs:348, kernel/src/skp.rs:1187);
  - the gate is at engine/src/dataset.rs:326, the detail function at engine/src/dataset.rs:1646, the Display at engine/src/error.rs:383, and the wire code at kernel/src/skp.rs:2093.
- **Item 22's comment** (KNOWN-LIMITATIONS.md:267):
  - `sanity_check` is at engine/src/dataset.rs:1193 (`convicts` at engine/src/dataset.rs:1223);
  - `convict_or_record` is at engine/src/dataset.rs:1332.

## Finding 7 — holds

kernel/tests/first_batch_factorial.rs:1291. ADR-018 is Accepted.

## Finding 8 — holds (S1)

Item 8 says a filtered view is refused at publish (KNOWN-LIMITATIONS.md:101). The app never sends the filter:
- **Main:** the publish scope builds its query with no filter (frontends/shell/src-tauri/src/publish.rs:119).
- **The v0.1.0 tag:** the same, at frontends/shell/src-tauri/src/publish.rs:110 @ b391e43.
- **The dialog:** with a filter active, the prompt carries the filter-scope sentence (frontends/shell/src-tauri/src/publish.rs:634), and the approval dialog shows it (frontends/shell/src/publish/PublishDialog.tsx:254).
- **The bundle:** `BUNDLE_VERSION` is 1.

## Finding 9 — holds

Two e2e suites describe the old stacked layout:
- **`style.mjs`'s top comment** (frontends/shell/e2e/style.mjs:34, frontends/shell/e2e/style.mjs:41) and its poll's doc (frontends/shell/e2e/style.mjs:242).
- **The residency harness's F1 note** (frontends/shell/e2e/residency-harness.mjs:692).

Neither `.app-main` nor `.canvas-status-stack` is a selector in `styles.css` at 9e7362db; the filing script checks that.

## Finding 10 — holds

Two tests mark ruled decisions as pending.

**String 6** (the settled-partial-within-budget string):
- the markers: frontends/shell/src/residency/residencyStatus.test.ts:195 and frontends/shell/e2e/regression.mjs:1755;
- the ruling: entry 45, RULED 2026-09-06 (DECISIONS-PENDING.md:3011).

**The `HOVER_REPICK_ON_PAN` switch:**
- the markers: frontends/shell/src/canvas/pickResolution.test.ts:237 and frontends/shell/e2e/regression.mjs:1068, with the closed branch at frontends/shell/e2e/regression.mjs:1069;
- the ruling: entry 75 (DECISIONS-PENDING.md:1404). The node `entry-75-hover-repick-defaults` is done.

The same marker is in product code at frontends/shell/src/canvas/hoverRepickConstants.ts:37.

**Observed in the check, not in the report:** the string's own doc comment carries the same stale marker (frontends/shell/src/residency/residencyStatus.ts:397).

## The human's instructions

### Part 1, item 1 — the item 2 paragraph (directive line 9), clause by clause. No clause is wrong.

1. **"For a file that declares GeoParquet version 1.0.0 or 1.1.0":** exactly those two strings are pinned (engine/src/geoparquet.rs:37), compared as exact strings (engine/src/geoparquet.rs:509).
2. **"A file with no `crs` key opens as OGC:CRS84 … the summary records it as `crs:format-default`":** the absent-key branch under a pinned version (engine/src/geoparquet.rs:566). The summary's CRS provenance row prints the wire's two provenance strings verbatim (frontends/shell/src/admission/describeSummaryText.ts:48), here `crs:format-default, axis:format-override`.
3. **"A file whose CRS declares latitude first, EPSG:4326 included, opens with the coordinate order the format lays down, recorded as `axis:format-override`":** the R-C4 branch, as finding 1 shows. F-4 opens an EPSG:4326 file this way.
4. **"its declared order is kept as a recorded fact and no coordinate is transformed":** the declared order is kept on the admission record and carried on every batch envelope as `declared_axis_order` (engine/src/envelope.rs:164). The data-order function transforms nothing (engine/src/geoparquet.rs:597). It is not shown on the summary, and the paragraph does not say it is.
5. **"Still refused: a `crs` key that is present and `null`, a latitude-first CRS that you assert yourself, and either case in a file of any other GeoParquet version":**
   - `null` reaches `CrsUndeclared` (Part 1, item 3 below);
   - an assertion's own non-x-first order meets `AxisOrderUnsupported` (engine/src/dataset.rs:422);
   - an unpinned version takes no format rule, so the absent key reaches `CrsUndeclared` and a lat-first declaration meets `AxisOrderUnsupported`.

**Three precision notes, none making a clause wrong:**
- (a) **"two of these refusals no longer happen"** can read as two of the item's three codes being retired. Both codes still fire, in the cases the paragraph's last sentence lists.
- (b) **The admitted cases are wider than latitude-first.** The R-C4 branch also admits a northing-first definition under a pinned version.
- (c) **A `crs` value that is neither an object nor `null`** is treated as `null` (engine/src/geoparquet.rs:450). An assertion still opens every `CrsUndeclared` case, as item 2's existing text says.

### Part 1, item 2 — where each test finding goes

- **The new node `stale-test-names-and-comments`** takes findings 2 (the test in `engine/tests/identity.rs`, and the reference in `engine/tests/admission_instruments.rs`), 3, 4, 7 and 10. Its scope is names and comments only.
- **`module-docs-stale-statements`** takes the items whose file is already in it:
  - finding 5 (`engine/src/geoparquet.rs`);
  - finding 2's reference at `engine/src/identity.rs`, which follows the rename.

### Part 1, item 3 — when `engine.crs_undeclared` still fires on main

Only when the caller asserts no CRS, and one of these holds:
- **(a) The `crs` key is present and `null`,** in any version (engine/src/crs.rs:286). The detail is: no `geo` metadata CRS on the primary geometry column.
- **(b) The `crs` key is present but neither an object nor `null`.** It is parsed as (a), with the same refusal and detail.
- **(c) The `crs` key is absent and `geo.version` is anything other than exactly 1.0.0 or 1.1.0** (engine/src/dataset.rs:403). The detail names the version and says its text is not pinned in this tree.

Under a pinned version an absent key never reaches it. With an assertion, each case opens, unless the assertion's order is not x-first or it carries no coordinate system.

The message's second sentence, *This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent conversion)* (engine/src/error.rs:285), is no longer the reason in any case:
- in (a) and (b), the key is not absent, so the default does not apply;
- in (c), the default is not applied because the version's text is not pinned, which the detail already says;
- on main the default is applied under a pinned version.

The text is also quoted in:
- `KNOWN-LIMITATIONS.md` item 2;
- `frontends/shell/MANUAL-WALKTHROUGH.md` row B2;
- the e2e suites `regression.mjs` and `admission-remediation.mjs`;
- `formatRefusal.test.ts`;
- the SKP fixture `protocol/skp/tests/data/v0-error-example.json`;
- `engine/ADMISSION-RESULTS.md`, a results record that is not edited.

### Part 2, item 1 — the item 8 text (directive line 18), clause by clause. No clause is wrong; one is narrower than it reads.

1. **"The bundle format cannot record a row filter, so the app does not send one":**
   - `BUNDLE_VERSION` is 1;
   - the publish query has no filter (finding 8);
   - `publish-bundle` has no filter flag, by the report.
2. **"still exports the current view or the whole file, unfiltered":** the scope is the whole file or the viewport's bounding box, each built with no filter (finding 8).
3. **"and the approval dialog says so: …":** the quoted sentence is `FILTER_SCOPE_SENTENCE`, byte for byte, checked by the filing script. It shows in the dialog whenever a filter is active (frontends/shell/src/publish/PublishDialog.tsx:254). Row frontends/shell/MANUAL-WALKTHROUGH.md:331 already expects it.
4. **"Rows you filtered out of the map are in the bundle":** true of a whole-file export. A current-view export holds the filtered-out rows that fall inside the view's extent, and no rows outside it. The sentence is not wrong, but it reads as if every filtered-out row is included.
5. **"A bundle that carries a filtered subset is `bundle_version` 2 and does not exist yet":** `BUNDLE_VERSION` is 1, and the kernel's own refusal text says the same.

**The correction notes:**
- **`KNOWN-LIMITATIONS.md` records a revision inside the item's own HTML source comment.** It names the occasion and what changed (KNOWN-LIMITATIONS.md:336, item 30's Round-1 revision; also KNOWN-LIMITATIONS.md:317). Those notes record draft rewording before merge, not a shipped claim found false, and a rendered page does not show them. The file's other main-versus-artifact form is the "on `main` (not the v0.1.0 artifact above)" paragraph (KNOWN-LIMITATIONS.md:20).
- **`RELEASE-0.1.md` has one:** a "Corrections to this record" section inside an appended amendment (RELEASE-0.1.md:1082).
- **Row M8:** its current text is at frontends/shell/MANUAL-WALKTHROUGH.md:880.

### Part 2, item 2 — the P6 sight

The dialog's sentence says "the viewport extent" even for a whole-file export. It goes on milestone 2's list for the P6 sight, beside the Export statement (milestone 2's Amendment 1: one sentence in the Export section saying the selection is not used). It is recorded on the node for the form's next amendment, and nothing changes before the sight.

### Part 2, item 3

- **Finding 9** joins `shell-stale-frame-comments`.
- **Finding 10** joins `stale-test-names-and-comments`, with `hoverRepickConstants.ts`'s marker.
- **Not added:** the same marker on the string's own doc comment in `residencyStatus.ts`, observed above. It waits for the human's word.
