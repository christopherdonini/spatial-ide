# Quickstart — Spatial IDE v0.1.0, your first five minutes with a GeoParquet

*Windows only in this release. Every sentence here can be checked against a file in the repository;
where the app shows you text, it is quoted as the app shows it in the source. **DRAFT:** bracketed
items — `[M: …]` — describe the installed application and are finalized only from the operator's own
walkthrough of the packaged build (Part M), never before it (`RELEASE-0.1.md` Amendment 13).*

## 1. Install

[M: Download `Spatial IDE_0.1.0_x64-setup.exe` from the v0.1.0 release and run it. It installs for
the current user only (no administrator rights); Windows will tell you the installer is unsigned —
that is true in v0.1.0 (`KNOWN-LIMITATIONS.md`, entry 14). If the Microsoft WebView2 runtime is
missing, the setup program downloads Microsoft's bootstrapper for it — the only network access in the
install; the application itself makes none. — confirmed or corrected from Part M M1–M2.]

## 2. What your file needs

Spatial IDE opens **GeoParquet** files and refuses, with a typed message, anything it cannot handle
honestly. Two requirements will meet most first-time users:

- **A coordinate reference system the app admits.** The file's `geo` metadata must declare a CRS, and
  that CRS must be one the app knows. In v0.1.0 the pinned catalog holds **EPSG:2056** (CH1903+ /
  LV95) and **EPSG:3857** (WGS 84 / Pseudo-Mercator). A file declaring **EPSG:4326** (WGS 84
  latitude/longitude — what most public GeoParquet declares) is refused at admission: its definition
  declares latitude first, and this release establishes axis order from the definition and refuses
  rather than reinterprets (ADR-015 §5; `KNOWN-LIMITATIONS.md`, entry 2). A file that declares **no**
  CRS at all is refused with the code `engine.crs_undeclared`, and the app offers to let you
  **assert** one — a panel titled *"Pick a pinned definition"* (the catalog) or *"Or paste a
  definition"* (a full PROJJSON document, verbatim). It never guesses, never applies a default, and
  never fetches a definition from the network (ADR-026). Admission also needs WKB-encoded polygon
  geometry and a `covering.bbox`; each refusal is typed and names what is missing.
- **An identity column.** Every feature needs a stable, per-row identity; by default the app looks for
  an integer column named `id`. If none is usable it refuses with `engine.identity_unusable` and lets
  you declare which column carries identity. Composite and non-integer keys are not supported in
  v0.1.0 (`KNOWN-LIMITATIONS.md`, entry 3).

If the file passes, you see a summary of what was admitted — **CRS**, **Geometry** (column and
encoding), **Identity**, **Row count** — and the canvas fits the data. [M: as the packaged build
shows it — Part M M4.]

## 3. Look at it

Pan and zoom. Hover a feature to see its `id`. If you zoom out far enough that the whole view no
longer fits the render budget, the status line says so in words — *"Showing `N` features — the
farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more
detail."* — followed, once the fill has stopped, by *"Filling is paused until the next pan or zoom."*
That is a declared limit of v0.1.0, not a glitch (`KNOWN-LIMITATIONS.md`, entry 7). Far past "Zoom
to layer" a second declared limit applies — tiles already drawn may vanish while still on screen
(`KNOWN-LIMITATIONS.md`, entry 13b). [M: the packaged build's status texts at those zooms — Part M
M5–M7 and the M-sight for 13b.]

## 4. Filter in SQL

Open the filter panel and type a predicate over your file's columns (the field's own hint reads
`e.g. zone = 'residential'`), then **Apply**. The canvas becomes the result set; the action console
shows the exact request the app sent for it. A predicate that cannot be admitted is refused with a
message naming why; **Clear** returns to the whole file.

## 5. Style

Styling in v0.1.0 is **by literal**: the style panel offers colour pickers for the layer and a
**Reset**. There is no "colour by attribute" in the shell yet — that is a named limit (ADR-023;
`KNOWN-LIMITATIONS.md`, entry 4).

## 6. Publish

Choose **Publish…**, pick a destination folder with the native picker, read the approval dialog — it
states in one sentence what will be written and where — and type the destination's final path
component to confirm. While the source file is being hashed the panel says **Preparing…**, shows the
bytes hashed so far, and offers **Cancel**. The app then writes a folder holding the data partitions,
a self-contained viewer page and a manifest, and records the operation in a per-user audit log.
[M: reading that log from the packaged install — `publish-bundle --audit-show` from a dev checkout,
since the installer ships no CLI; the exact route is Part M M9's.] Open the folder in a browser via a
local static server to see the bundle. If the app predicts the bundle would exceed the bundled
viewer's declared ceilings, it refuses **before** hashing or writing anything, and names the
alternative: publish the current view instead (`KNOWN-LIMITATIONS.md`, entries 5 and 6). [M: the
refusal as the packaged build renders it — Part M M10.]

## 7. Where things are

[M: Notices (licences, the EPSG/IOGP data acknowledgement, the corresponding-source URL): the
**Notices** view in the app, and `NOTICE.txt` beside the installed executable — Part M M3's three
files.] Limits: `KNOWN-LIMITATIONS.md`. Everything else: `README.md`.
