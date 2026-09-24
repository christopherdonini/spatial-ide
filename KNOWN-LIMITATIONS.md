# Known limitations — Spatial IDE v0.1.0

*What this release does not do, declared rather than discovered. Every line below is true of the
artifact that carries the v0.1.0 tag — the installer built from this branch, walked through by the
operator on a clean Windows account (`frontends/shell/MANUAL-WALKTHROUGH.md` Part M; the sittings are
recorded verbatim in `RELEASE-0.1.md` Amendments 15–18). Part M was run across two builds: the rows
whose code paths this build changed (M1–M5, M7, M12 mode 3, M14, M15 and the hover row) were re-run
on it; the rows it did not touch (M6, M8, M9, M10, M11, M12 modes 1–2, M13) stand from the candidate
build `998be05`, with `git diff --stat 998be05 13471a9` as the proof that nothing under their paths
changed — the classification and that diff are Amendment 17's. Each line carries its source in an HTML
comment so it can be checked. No line here states a speed, a duration or a rate: this release makes
no performance claim at all (`docs/08_Testing.md`).*

1. **Windows only.** One artifact ships, a Windows x64 installer, and the only walkthrough that
   verifies it ran on Windows. macOS and Linux are not built, not validated and not claimed — the
   renderer/CRS evidence behind this architecture is Windows/WebView2 evidence, and the
   macOS/WKWebView and Linux/WebKitGTK hardware-validation gate is open by name.
   <!-- docs/07_Roadmap.md, "Gate — open, follow-up to the above: macOS/WKWebView and Linux/WebKitGTK hardware validation"; MACOS-BRINGUP.md (bring-up paused); RELEASE-0.1.md Amendment 17 (RC2: one NSIS artifact) -->

2. **Two pinned coordinate reference systems, and three refusals by name.** The catalog the app
   carries holds exactly two entries, in this order: `epsg-2056` — **CH1903+ / LV95** (EPSG:2056),
   and `epsg-3857` — **WGS 84 / Pseudo-Mercator** (EPSG:3857). Those two are what the app can supply
   a definition for, and the only choices the assertion panel offers. A file that declares its own
   CRS is admitted on that declaration, and only if the declaration establishes an easting-first axis
   order. The app never guesses a CRS, never applies a default, and never fetches a definition from
   the network.
   <!-- engine/src/crs-catalog.json (the whole file: two entries, in this order); engine/src/crs.rs:218-240 (admit: a file-declared CRS is a file fact; the catalog is consulted for assertions, not as a whitelist); ADR-026; MANUAL-WALKTHROUGH.md I1/ASSERT' (the panel's list: two entries in file order) -->

   - **A file whose `geo` metadata has no `crs` key is refused** — GeoParquet's OGC:CRS84 default is
     deliberately not applied — and so is **a file whose `crs` key is present and explicitly
     `null`**. Both reach the same typed refusal, code `engine.crs_undeclared`: *"refused: the file
     declares no CRS and none was asserted by the caller (no `geo` metadata CRS on the primary
     geometry column). This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent
     conversion)"*. The app then offers to let you **assert** a CRS — a pinned catalog entry or a
     pasted PROJJSON definition — and records the assertion as a claim; nothing is saved.
     <!-- engine/src/geoparquet.rs:94-104 (the three distinguishable states: object = declared, null = not declared, absent = default NOT applied); engine/src/error.rs:176-179 (the message); MANUAL-WALKTHROUGH.md B2 (the message verbatim as the panel shows it), I1 (the assertion form) -->

   - **A CRS whose definition declares latitude first is refused, not reinterpreted** — code
     `engine.axis_order_unsupported`: *"refused: established axis order is northing,easting; this
     slice performs no axis normalization and emits x-first orders only — (easting, northing) or (longitude, latitude)"*. EPSG:4326 — what most
     public GeoParquet declares — is refused for exactly this reason, by decision and not by
     accident. A declaration that establishes no axis order at all — a definition with no coordinate
     system — is refused too, as `engine.axis_order_unestablished`.
     <!-- engine/src/dataset.rs:303-306 (the gate); engine/src/error.rs:213-216 (the message); engine/src/geoparquet.rs:101 (the file-declared CRS's own axis order is read here) with :164, :169, :185 (the three axis_order_unestablished refusals: no `coordinate_system.axis`, fewer than two axes, directions that are not a planar east/north pair); MANUAL-WALKTHROUGH.md NODEF'; MANUAL-WALKTHROUGH.md I3 (the message verbatim, "refused, not reinterpreted"); ADR-015 §5 -->

3. **Identity must already exist in the file, as a single integer column.** The app uses the file's
   own `id` column, or one column you declare a mapping from, and scans it for uniqueness at open.
   The column must be an integer type that widens into `u64` without transformation; anything else is
   refused — *"refused: `<column>` cannot serve as stable feature identity — type is `<type>`;
   identity must be an integer that widens into u64 without transformation. …"*. Composite keys are
   not supported, and no hash, dictionary index or row ordinal is ever synthesized in their place.
   <!-- engine/src/identity.rs:196-217 (admit_column_type: the admitted integer types and the refusal detail); engine/src/error.rs:234-238 (IdentityUnusable Display); ADR-016; ADR-010 rule 2; MANUAL-WALKTHROUGH.md A3 (`file:id — verified-at-open-full-file`), M4 (the same summary on the packaged build) -->

4. **Styling is by literal only.** The shell's style document has no categorical form at all — its
   type carries no `match` variant, so there is no control and no code path that could produce one.
   "Colour by attribute" does not exist in this release's canvas; the hover panel shows `id` only. A
   style is held in memory and is never persisted: no project file, no saved style, and reopening a
   dataset starts from the default.
   <!-- frontends/shell/src/style/document.ts:18-21 ("Literal-only … no `match` variant at all") and :33-37 (ephemeral only); ADR-023 (the limitation as ADR-017 §5a's style v0 leaves it: the bundle format admits at most one `match`, the shell produces none); MANUAL-WALKTHROUGH.md M6 (styling on the packaged build) -->

5. **The published bundle has declared ceilings, and a publish above one of them is refused before
   anything is written.** The viewer's ceilings are `MAX_FEATURES` 2000000, `MAX_PARTITIONS` 100000,
   `MAX_RESIDENT_BYTES` 536870912, `MAX_ATTRIBUTE_COLUMNS` 32, `MAX_ATTRIBUTE_DISPLAY_CHARS` 512 —
   declared limits, not measurements. A source predicted above `MAX_FEATURES` is refused at
   preflight: *"refused: this publish is predicted to exceed the bundled viewer's declared ceiling
   MAX_FEATURES — limit 2000000, predicted 3300000 — before any bytes were written (ADR-025: refuse,
   typed, at preflight; reopens when a second reader exists). Instead, publish the current-viewport
   bbox instead of the whole file (the viewer's ceilings apply to what a bundle carries, not to what
   the source dataset holds)"*; the approval dialog never opens and no destination is created.
   <!-- renderer/bundle-viewer/ceilings.json (the five values); kernel/src/publish/error.rs:253-259 (ReaderCeilingExceeded Display); MANUAL-WALKTHROUGH.md M10 (the refusal verbatim, on a 3,300,000-row source); RELEASE-0.1.md Amendment 15 ("M10 is fine") -->

6. **That prediction does not cover every ceiling.** `MAX_RESIDENT_BYTES` is checked at **no** stage:
   a bundle under `MAX_FEATURES` but over the 512 MiB resident ceiling still publishes unwarned, and
   the viewer refuses it at load instead. `MAX_PARTITIONS` is enforced only when partitions are
   written, never predicted beforehand.
   <!-- kernel/src/publish/ceilings.rs:109-116 ("`MAX_RESIDENT_BYTES` is checked at NO stage, ever"; the partition gap named); RELEASE-0.1.md Amendment 5 item 2 -->

7. **At overview zoom the view is declared partial, in words.** Within the render budget the status
   line reads *"Showing all `<N>` features in view"*; past it, *"Showing `<N>` features — the farthest
   areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail."*
   Filling can also stop with part of the view not loaded, which the status says as *"Filling has
   finished for this view — some areas were not loaded; pan or zoom to load them."* This is the
   declared-partial-view contract of v0.1.0 — a fuller view needs the level-of-detail work that is
   not in this release.
   <!-- frontends/shell/src/residency/residencyStatus.ts:458 (within budget), :463 (over budget), :429-430 (the settled-partial sentence); MANUAL-WALKTHROUGH.md M7, M15; RELEASE-0.1.md Amendment 18 (both sentences sighted on RC2, no refusal banner); ADR-028 -->

8. **A filtered view cannot be published.** With a row predicate applied, publish is refused by name:
   *"refused: this query carries a row predicate (`query.filter`), and a `bundle_version` 1 manifest
   cannot record one (ADR-017 §8: the operation digest's `filter` member is exactly `whole-file` or
   `covering-bbox-intersects`, and Corrigendum 3 spent the v1 schema exception). Publishing it would
   produce a manifest claiming a whole-file (or bbox) extent over a filtered subset — a false record
   (docs/01 principle 3). Clear the filter and publish the whole file, or publish the viewport bbox
   instead — a filtered-subset bundle format is bundle_version 2 and does not exist yet"*.
   <!-- kernel/src/publish/error.rs:238-249 (RowFilterNotRecordable Display); MANUAL-WALKTHROUGH.md M8; RELEASE-0.1.md Amendment 15 (the human's M8 report and the custodian's reading: the refusal is ADR-017's declared one) -->

9. **Polygons only, WKB only, and a `covering.bbox` is required.** A GeoParquet whose
   `geometry_types` name anything but `Polygon` is refused (*"geometry_types … include non-polygon
   types; this slice reads polygons only"*), as is any encoding other than WKB (*"geometry encoding is
   `…`; this slice reads WKB-encoded GeoParquet only"*). A file whose `geo` metadata declares no
   `covering.bbox` is refused when the view is queried, because there is nothing to index with.
   <!-- engine/src/dataset.rs:275-281 (polygon gate), :269-272 (encoding gate); engine/src/stream.rs:1185-1187 (NoCoveringBbox, raised on the bbox branch of the view query itself) -->

10. **One file per session, and nothing is remembered.** The app holds a single admitted dataset;
    opening another replaces it, and there is no layer list. Nothing persists across a session: no
    project file, no saved style, no saved CRS assertion — the assertion panel says so itself
    (*"Nothing is saved: reopening this file will ask you to assert again."*).
    <!-- frontends/shell/src/App.tsx:614 (one `admitted` dataset, `Admitted | null`); frontends/shell/src/style/document.ts:33-37 (ephemeral style); MANUAL-WALKTHROUGH.md I1 (the assertion notice verbatim), M7/M8 (each row reopens rather than adding a layer) -->

11. **No reprojection, analytical or on screen.** Data is read and drawn in the coordinates of its own
    declared CRS; this release converts nothing. A viewport expressed in another CRS is refused:
    *"refused: the viewport is expressed in `…` and the dataset is in `…`. This slice performs no
    reprojection, so a viewport in another CRS cannot be honoured (docs/05: mixing CRS without a
    declared transform is an error)"*. Two datasets in different CRSs cannot be shown together.
    <!-- engine/src/error.rs:197-202 (ViewportCrsMismatch Display); docs/05_Data_Engine.md (no silent conversion); CLAUDE.md non-negotiable "CRS is a type" -->

12. **A published bundle has to be served to be viewed, and the app does not serve it.** The bundle is
    static files loaded over HTTP from a served folder — the walkthrough's own route is
    `node scripts/serve-bundle.mjs "<destination>" <port>` from a checkout of
    `renderer/bundle-viewer`. The installed application ships no server script and no command-line
    tool of any kind; reading the publish audit log (`publish-bundle --audit-show`) likewise needs a
    development checkout.
    <!-- MANUAL-WALKTHROUGH.md M11 ("this step alone needs the dev tree, since the packaged app does not ship that server script"), M9 ("the packaged installer ships no `publish-bundle` CLI itself"); RELEASE-0.1.md Amendment 14 (what the installer packages) -->

13. **A drag that never reports its release leaves the hover re-pick inert for the session.** If
    neither `pointerup` nor `pointercancel` is delivered after a drag — the window losing focus
    mid-drag, for instance — the button-down flag stays set and every later camera change cancels the
    pending re-pick: the readout stops being restored after a zoom until the app is restarted. It can
    never pick at a pixel the pointer has left, so this is refusal to act rather than a wrong answer.
    <!-- frontends/shell/HOVER-REPICK-PREREGISTRATION.md §12 Amendment 4, final paragraph ("Known limitation, recorded here for the human's word on a KNOWN-LIMITATIONS line"); RELEASE-0.1.md Amendment 16 (the human: this line "belongs to the release that ships 47", which is this one) -->

14. **The installer is not signed.** Authenticode reports `NotSigned` for
    `Spatial IDE_0.1.0_x64-setup.exe`, so Windows may warn that the publisher is unrecognised, and on
    a machine with Smart App Control an unsigned file may be blocked outright. There is no signature
    to verify: the SHA-256 published with the release is the only check this release offers, and an
    unsigned build is not thereby a safe one. Signing was deliberately deferred — nothing is signed
    for v0.1.0, and the options are evaluated after the tag.
    <!-- RELEASE-0.1.md Amendment 17 (RC2: 10,559,893 B, SHA-256 c3f48320…, NotSigned); DECISIONS-PENDING.md, RULED 2026-09-11, entry 77 ("sign nothing for v0.1.0; post-tag evaluate SignPath OSS first, Certum second") and entry 77's note (no option gives instant SmartScreen trust; Smart App Control blocks unsigned files) -->

15. **The installer bundles no Visual C++ redistributable.** The executable imports `MSVCP140.dll`
    dynamically — the Microsoft Visual C++ 2015–2022 runtime — and the installer does not carry it.
    Part M could not observe what a machine lacking that runtime does, because the walkthrough machine
    already had it; that case is untested, and what to do about it is an open decision.
    <!-- RELEASE-0.1.md Amendment 14, the imports row (`dumpbin /DEPENDENTS`: MSVCP140.dll, "which the installer does not bundle"); state/drafts/part-m-prep-pack.md §3 ("Record in M1/M2: 'VC++ redistributable dependency not exercised'"); DECISIONS-PENDING.md entry 69 (open) -->

---

Under a row filter at wide zooms, some of the view's per-tile queries are refused by the
app's own filter-admission check and never run. The status then reports those areas as not loaded,
which is true: any matching features there are not drawn until you pan or zoom in and they are
queried again. The app cannot know whether those areas are empty.
<!-- DECISIONS-PENDING entry 87 (diagnosis 2026-09-13: skp.filter_rejected_by_binder refusals discarded in tileViewportStreamManager.ts mintAndStart's catch; the fix is queued post-tag with the suspended FIND' assertion as its test); RELEASE-0.1 Amendment 18; M15; resolved on the human's word of 2026-09-13 -->

16. **In every bundle already published — including every v0.1.0 bundle — the published viewer's
    wheel-zoom anchors on the wrong point unless the browser window happens to size the canvas to
    its own backing store, and this is unfixable in place.** A published bundle's viewer is a frozen
    copy of whatever build produced it (`kernel/src/publish/viewer_assets.rs`), so no already-shipped
    bundle can pick up a later viewer fix — the direction depends on whether the window was larger or
    smaller than the frozen 1280×900 backing store, undone by zooming back out, and the same mismatch
    scaled a drag's pan distance and shifted hover picking. Fixed for every bundle published by a
    build that includes the viewer zoom-anchor fix (PR #53) or later.
    <!-- kernel/src/publish/viewer_assets.rs:4-19, :85 and frontends/shell/src-tauri/src/publish.rs:1109-1120 (publish copies the viewer's dist/ into the bundle — a frozen copy, not a version reference); docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:527-530 (§14: a bundle's viewer cannot verify itself); renderer/bundle-viewer/ZOOM-ANCHOR-PREREGISTRATION.md §5 (already-published bundles are not updated) and its Amendments 1-3; the fix: PR #53 (viewer/zoom-anchor, merged 2026-09-13); DECISIONS-PENDING.md entry 86 (the human's sighting of this line, 2026-09-13). Scope line, not a retirement: it stands for every bundle published before the fix. -->

## On main since v0.1.0 — not in any release yet

*The lines below are true of `main`'s build after the v0.1.0 tag, not of the v0.1.0 artifact the
header above describes. They move into the next release's list when that release is cut.*

17. **A dataset whose unit is neither degrees nor metres uses tile and drift bounds declared for
    metres.** `skp/0.4` (crs-unit-fact-and-bounds) gives the tile grid's minimum anchor span and the
    re-centering drift cap their own declared value for degrees: the drift cap's declared value
    happens to equal the metre value (131 072, by derivation); the minimum anchor span's does not
    (1e-6 against 1). A dataset the engine records as `other` (a named unit that is neither) or
    `unestablished` still keeps the one-unit minimum anchor span and the same 131 072 drift cap
    every unit shares, with no declared value of its own for either bound.
    <!-- DRAFT wording, for the human's sight, written by this piece (crs-unit-fact-and-bounds); not
    the human's own wording. frontends/shell/CRS-UNIT-FACT-AND-BOUNDS-PREREGISTRATION.md §2 (i), §7,
    §8 item 8, and the STOP LIST's Q1 attach point, state/consults/2026-09-24-crs-unit-fact-and-bounds.md:
    frontends/shell/src/canvas/tileGrid.ts's MIN_ANCHOR_SPAN (a per-CrsUnit record: metre 1, degree
    1e-6, other 1, unestablished 1) and frontends/shell/src/canvas/offsetFrame.ts's
    RECENTER_MAX_DRIFT (metre/degree/other/unestablished all 131_072), pinned by
    tileGrid.test.ts's "declares metre 1, degree 1e-6, other 1, unestablished 1" and
    offsetFrame.test.ts's "declares 131072 for every unit; degree hands over at zoom 6" (this
    piece's preregistration §4 items 7 and 9); docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md,
    Amendment 1 item 6, true of the build for degree and metre only per DECISIONS-PENDING.md entry 120,
    the RULED 2026-09-23 (later) block, item (1)(a) -- scoped to the two constants this item names,
    MIN_ANCHOR_SPAN and RECENTER_MAX_DRIFT; MAX_ZOOM and extent.ts's fit and degenerate zoom
    constants are the same item-6 class and remain open, the consult's STOP LIST Q2,
    state/consults/2026-09-24-crs-unit-fact-and-bounds.md. Entry 120 (1)(c)'s bound statement: PR #109
    (open for the click) states the P0 bound for today's build on main; this scope line replaces it at
    landing, the point after which PR #109's P0 bound no longer describes the build (see PR #109 and
    the consult's P0 section, state/consults/2026-09-24-crs-unit-fact-and-bounds.md, by name). -->

18. **After a failed or cancelled open, a dataset in degrees can stay drawn without its display
    statement.** A later open attempt, whether in flight, cancelled or refused, clears the describe
    summary, but the dataset already on the canvas stays drawn. Its equirectangular statement is then
    shown nowhere until the next successful open.
    <!-- frontends/shell/src/admission/AdmissionPanel.tsx:206-209 (an attempt replaces the admitted state), :230 (a cancel ends idle), :240-249 (a refusal); :411 (the summary renders only for the admitted state); the earlier dataset stays drawn: the human's N8 retest session log session-1790201742.log, where the earlier dataset's tiles are still delivered after the 22:18:04Z refusal; DECISIONS-PENDING.md entry 120 (2) and the RULED 2026-09-23 (later) block, item (2) -->
