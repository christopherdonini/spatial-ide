# Quickstart — Spatial IDE v0.1.0, your first five minutes with a GeoParquet

*Windows only in this release. Every sentence here can be checked against a file in the repository;
where the app shows you text, it is quoted as the app shows it. What the installed application does
is written from the operator's own walkthrough of this build — `frontends/shell/MANUAL-WALKTHROUGH.md`
Part M, rows cited as they are used — and from nothing else.*

## 1. Install

Download `Spatial IDE_0.1.0_x64-setup.exe` from the v0.1.0 release and run it. It installs for the
current user only, into `%LOCALAPPDATA%\Spatial IDE`, and needs no administrator rights — Part M
installed it that way on a clean Windows account (M1), and the app then opened with the title
**Spatial IDE**, no console and no crash dialog (M2). The installer is **not code-signed**
(Authenticode: `NotSigned`), so Windows may say the publisher is unrecognised; compare the file's
SHA-256 with the release page's before you run it, and read that as a fact about the build rather
than as any assurance about it (`KNOWN-LIMITATIONS.md`, entry 14). If the Microsoft WebView2 runtime
is missing, the setup program downloads Microsoft's bootstrapper for it — the only network access in
the install; the application itself makes none. That branch was not exercised in Part M: the runtime
was already present on the machine the walkthrough ran on.

## 2. What your file needs

Spatial IDE opens **GeoParquet** files and refuses, with a typed message, anything it cannot handle
honestly. Two requirements will meet most first-time users:

- **A coordinate reference system the app admits.** The file's `geo` metadata must declare a CRS, and
  that declaration must establish an easting-first axis order. The two definitions the app itself
  carries — what it can offer you when a file declares nothing — are **EPSG:2056** (CH1903+ / LV95)
  and **EPSG:3857** (WGS 84 / Pseudo-Mercator). A file declaring **EPSG:4326** (WGS 84
  latitude/longitude — what most public GeoParquet declares) is refused at admission: its definition
  declares latitude first, and this release establishes axis order from the definition and refuses
  rather than reinterprets (ADR-015 §5; `KNOWN-LIMITATIONS.md`, entry 2). A file that declares **no**
  CRS at all is refused with the code `engine.crs_undeclared`, and the app offers to let you
  **assert** one — a panel titled *"Pick a pinned definition"* (the catalog) or *"Or paste a
  definition"* (a full PROJJSON document, verbatim). It never guesses, never applies a default, and
  never fetches a definition from the network (ADR-026). Admission also needs WKB-encoded polygon
  geometry. Separately, the `geo` metadata must carry a `covering.bbox`: without one the file may
  open, but the view cannot be queried, and that is refused too. Each refusal is typed and names
  what is missing.
- **An identity column.** Every feature needs a stable, per-row identity; by default the app looks for
  an integer column named `id`. If none is usable it refuses with `engine.identity_unusable` and lets
  you declare which column carries identity. Composite and non-integer keys are not supported in
  v0.1.0 (`KNOWN-LIMITATIONS.md`, entry 3).

If the file passes, you see a summary of what was admitted — **CRS**, **Geometry** (column and
encoding), **Identity**, **Row count** — and the canvas fits the data. Part M opened the
walkthrough's own EPSG:2056 fixture on the packaged build and read that summary (M4; the lines are
Part A's A3): **CRS** `EPSG:2056 — file, axis order easting,northing`; **Geometry** the column and
the encoding the canvas is fed, `geometry (geoarrow.polygon)`; **Identity**
`file:id — verified-at-open-full-file`; **Row count** `100000 (identity-uniqueness-scan-full-file)`;
then Extent, Schema and License lines, and no refusal panel. A **Zoom to layer** button appears at
the top right of the canvas.

## 3. Look at it

Pan and zoom. Hover a feature and the readout reads `id <value>`; zoom out past the point where
features are smaller than the pick can resolve and it is replaced, never blanked, by *"Features here
are below pick resolution — zoom in to inspect them."* The readout survives a zoom-out with the
pointer held still, and it clears and comes back at each camera change while you are zooming (the
hover row Part M re-ran on this build — Part L's L7 and L8).

A status line above the canvas says what is drawn. Within the render budget it reads *"Showing all
`<N>` features in view"*; past it, *"Showing `<N>` features — the farthest areas of this view are
not drawn, to stay within the render budget. Zoom in to see more detail."* Part M read both on the
packaged build at M7 — `Showing all 17752 features in view` after **Zoom to layer**, then
`Showing 19100 features — the farthest areas…` on zooming out, with no refusal banner anywhere. A
third sentence, *"Filling has finished for this view — some areas were not loaded; pan or zoom to
load them."*, means filling stopped with part of the view not loaded (M15). These are declared
limits of v0.1.0, not glitches (`KNOWN-LIMITATIONS.md`, entry 7). Far past "Zoom to layer" a further
declared limit applies — tiles already drawn may vanish while still on screen
(`KNOWN-LIMITATIONS.md`, entry 13b).

## 4. Filter in SQL

Open the filter panel and type a predicate over your file's columns (the field's own hint reads
`e.g. zone = 'residential'`), then **Apply**. The canvas becomes the result set; the action console
shows the exact request the app sent for it. A predicate that cannot be admitted is refused with a
message naming why; **Clear** returns to the whole file. Part M applied `id < 100` on the packaged
build: the panel echoed it on an `Applied:` line, the canvas redrew to the matching subset, and
**Zoom to layer** fitted the filtered features — on the first click and on every click after it
(M5, M14).

## 5. Style

Styling in v0.1.0 is **by literal**: the style panel offers **Fill colour**, **Fill opacity**,
**Outline colour** and **Outline width** for the layer, and a **Reset to default** button. There is
no "colour by attribute" in the shell yet — that is a named limit (ADR-023;
`KNOWN-LIMITATIONS.md`, entry 4). An
edit re-renders what is already resident; nothing round-trips through the kernel. Part M styled the
packaged build this way (M6), and the bundle it then published rendered in the browser with the same
fill, opacity and outline (M11). The style is held in memory only — it is not written to any project
file, and reopening the dataset starts from the default.

## 6. Publish

Choose **Publish…**, pick a destination folder with the native picker, read the approval dialog — it
states in one sentence what will be written and where — and type the destination's final path
component to confirm. While the source file is being hashed the panel says **Preparing…**, shows the
bytes hashed so far, and offers **Cancel**. The app then writes a folder holding the data partitions,
a self-contained viewer page and a manifest, and records the operation in an audit log.
That log is per-user — `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl` — and is read with
`publish-bundle --audit-show`, which needs a development checkout because the installer ships no
command-line tool. Part M read it after two publishes from the packaged app, a current view and a
whole dataset; each is one plain line, of this shape (M9, as the operator's own run printed it):
`2026-09-13 12:24 — publish to C:/Users/Public/spatial-ide-fixtures/100k-happy-path — APPROVED via
shell dialog and SUCCEEDED (84 rows, 1 partition)`.

With a row filter applied, publishing is refused by name instead: *"refused: this query carries a row
predicate (`query.filter`), and a `bundle_version` 1 manifest cannot record one…"* — the bundle
format has no way to say "these rows", so the app declines rather than write a manifest that would
claim more than the bundle holds (ADR-017; Part M M8). Clear the filter and publish the whole file,
or publish the viewport bbox instead.

If the app predicts the bundle would exceed the bundled viewer's declared ceilings, it refuses
**before** hashing or writing anything, and names the alternative (`KNOWN-LIMITATIONS.md`,
entries 5 and 6). Part M saw that on the packaged build with a 3,300,000-row source (M10): *"refused:
this publish is predicted to exceed the bundled viewer's declared ceiling MAX_FEATURES — limit
2000000, predicted 3300000 — before any bytes were written (ADR-025: refuse, typed, at preflight;
reopens when a second reader exists). Instead, publish the current-viewport bbox instead of the whole
file (the viewer's ceilings apply to what a bundle carries, not to what the source dataset holds)"* —
the approval dialog never opened and no destination folder was created.

To look at a published bundle, serve its folder over HTTP from a checkout of
`renderer/bundle-viewer`: `node scripts/serve-bundle.mjs "<the destination you chose>" 8732`, then
open the printed `http://127.0.0.1:8732/viewer/index.html`. The packaged application does not ship
that server script. Part M loaded a bundle that way and saw the style it had set in the app (M11).

## 7. Where things are

Notices — licences, the EPSG/IOGP data acknowledgement, the AGPL §6(d) corresponding-source URL — are
in three files the installer puts on your machine, all three opened at Part M M3: the **▸ Notices**
disclosure at the bottom of the window, `NOTICE.txt` beside the installed executable (the same bytes
as the in-app text), and `bundle-viewer\NOTICE.txt` in the install directory, which is the published
viewer's own notice and says so. Limits: `KNOWN-LIMITATIONS.md`. Everything else: `README.md`.
