# Reuse archaeology — Round 1 report

**Date:** 2026-10-08. **Spatial IDE at:** `4561f3b`, plus open PR #190 (ADR-036, Proposed).
**Scope:** six deep tracks on the current product path, three shallow tracks and a catalogue of later ones.
**Results:**
- 55 capabilities and 188 candidate rows in `reuse-index.json`;
- 154 repositories read at pinned commits (`repos.lock.json`);
- 121 per-repository records.

**Nothing was built or run, and no dependency was added.**

Every finding states its licence, verified from the repository's own files. Code with no licence, or an incompatible one, is reference only, and `tools/check-index.mjs` fails on any entry that marks such code for reuse. **Every new dependency below is a proposal; adopting it is your typed word.**

## 1. What matters now, in the order it bites

### ADR-036 — the B2 file formats (Proposed; acceptance due before piece 1c merges)

This is where Round 1 pays off first. Several of these points change the version-1 shape, and the key sets are closed, so they cost a format version if they are missed now.

1. **§5 containment, as drafted, is the racy pattern.** "Resolve, then open if inside" leaves a gap between the check and the open.
   - **The race-free designs** (cap-std, Go's `os.Root`, Rust std's CVE-2022-21658 fix) open one segment at a time, relative to directory handles they hold, and never follow a link silently.
   - **Recommendation:** own the one-operation resolver. Port cap-std's algorithm and escape tests (Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT), with Go's as a concept donor.
   - **Your call:** follow relative links that stay inside the folder, or refuse every link. Every Windows junction is absolute, so even "follow" refuses junctions.
   - **The engine re-opens by path.** DuckDB opens the file with `CreateFileW` and full sharing, so piece 1c must say how the opened file stays the checked one: held handles, or a file-identity comparison.
2. **§1 OPEN: the project file name.** `project.spatial.json` still opens as `.json` on Windows and macOS, which pick a file's type from its last extension. (This is inferred from Wine's code and Apple's documentation, not tested on either OS.)
   - **Recommendation:** a fixed single-segment name, Godot-style, such as `project.<ext>`, with content that stays canonical JSON.
   - **Tauri 2** already writes the Windows per-user association, and the macOS document types, from configuration. Linux needs a MIME glob added.
   - **Single instance:** without `tauri-plugin-single-instance` (**a new dependency, your word**), a second double-click starts a second process holding the same project identity.
3. **§9 torn writes:** "a final line without LF" is not a sufficient test. After power loss a line can end in LF and still hold NUL bytes.
   - Keep the longest prefix of lines that end in LF, contain no NUL, parse, and chain through `parent`. Concepts from LevelDB, RocksDB, etcd and SQLite.
4. **§8 files from different saves:** the project file records the lineage file's sha256 and step count, and the lineage file is renamed first. This member must be in the version-1 shape.
5. **§6 collapse key = (action, property, target),** not the property alone.
   - Merge only adjacent equal keys, and never across `saved-here`.
   - A merge that returns to the starting value removes the run (toggle cancel).
   - An unknown action is opaque and ends a run.
   - Sources: Qt's undo stack and QGIS, concepts only (LGPL/GPL).
6. **§3 forward compatibility:** only the `intent.params` of an unregistered action, under a newer `actions` header, is opaque. That step is kept byte for byte on rewrite. Everything else stays closed. (nbformat's model; Excalidraw is the counter-example.)
7. **§2 duplicate keys:** every reader today parses through `serde_json::Value`, which silently keeps the last duplicate. This was verified at 1.0.151. `spatial_renderer::canonical` only writes, so it needs a reader half. Decide serde_json's `float_roundtrip` before relying on a byte round-trip.
8. **§4 identity:** Godot 4.4+ uses the same rule as ADR-036.
   - Always give the new identity to the newly opened folder.
   - Re-read the identity in the old folder; don't only check that the folder exists.
9. **§5 "one spelling on every operating system" is overstated.** Case-insensitivity, 8.3 short names and macOS Unicode decomposition all alias. Refuse reserved device names and names ending in a dot or space in the canonical text itself.
10. **Atomic save:** use `std::fs::rename` after `sync_all`, with a bounded retry on sharing violations.
    - Do not use `ReplaceFileW`, or `MOVEFILE_WRITE_THROUGH` as a durability measure.
    - The `tempfile` crate's `persist` does no sync.
    - Own a helper of about 60 lines.

### Milestone 3 — command bar and filter cards

- **Build it, with no new dependency.**
  - cmdk's defaults work against three acceptance items: a focus-trapping dialog, Ctrl+K bound as a vim key, and `aria-expanded` always true.
  - cmdk also brings about 26 packages.
  - No product read turns arbitrary query text back into pills.
- **Fuzzy matching:** port CodeMirror's `FuzzyMatcher` (MIT, about 130 lines), or write one fresh from the published algorithm. Which is cleaner is counsel's call.
- **Filter cards:** each card holds the user's text verbatim plus an on/off flag. Enabled cards are each wrapped in parentheses and joined with `AND`. An exact-shape recogniser decides only how a card is *displayed*.
- **Native menus:** the locked `@tauri-apps/api` already has `Menu`, accelerators and `setAsAppMenu`.
- **Accessibility:** the W3C APG combobox pattern is the baseline. It defines nothing for Tab, so Tab-to-complete is a declared extension.
- **Gap:** the shipped NOTICE is generated only from build manifests and DuckDB's tree. A ported MIT file in `frontends/shell/src` would be missing from it. A notice route is needed before any port.

### Milestone 4 — the feature table

- **Build a small grid and port four MIT pieces:**
  - hightable's range fetching and height scaling;
  - the keyboard model, with its ARIA deviations fixed;
  - VS Code's reference-counted page cancellation;
  - AG Grid's `aria-rowcount=-1`.

  No candidate meets the accessibility acceptance item on React 18. hightable needs React 19.2 from 0.26.1.
- **Data source with today's commands:** one `viewport_query` with no bbox, the layer's filter and the shown columns, pulling credit as visible rows need it. This is duckdb-ui's read-until pattern. It reads forward only.
- **Your rulings:**
  - how the table holds a stream slot while it waits (a started stream keeps its lease with no timeout):
    - yield the slot when hidden or when the map is busy;
    - drop the tile streams from 3 to 2 (a LOCKED constant);
    - or queue streams, which ADR-014 reserves;
  - whether to add a range command for random access and engine-side sort. Perspective is the reference shape.
- **Selected scopes:** build them from the selection's ids as `id IN (…)` filters, split to stay under the 4,096-byte limit.

### ADR-029 — scan progress (returns at B2's preregistration)

- The published `duckdb` crate (1.10506.0) still has no progress accessor.
- Upstream `main` has one in an **unpublished experimental crate**, `duckdb-neo`, built on DuckDB's v2 C API: a tracker that holds the connection handle and is read from another thread.
  - It does not latch, and its total is the same estimate ADR-029 1(c) refuses.
  - Route 2 (a patch) now has an upstream-authored shape to port (MIT).
  - Route 3 means moving onto an experimental wrapper.

### The compatibility corpus (`corpus-line-files`)

- **Real-world lines:**
  - one Microsoft Road Detections partition (ODbL; Monaco is 19 KB), kept local-only with a pinned hash;
  - a project-generated GeoParquet file from Natural Earth's 50m river centerlines (public domain, real MultiLineStrings), written with a covering and an integer id.
  - Plus the GeoParquet spec repository's LineString and MultiLineString test files (Apache-2.0) as refusal tests.
  - **Your call:** whether public domain counts as an open licence under the corpus rules.
- **Found on the way (code reading, not run):**
  - DuckDB v1.5.5 decodes a Parquet-native `GEOMETRY` column through its own WKB reader, whatever `enable_geoparquet_conversion` says.
  - Corpus file #11 carries that type, and the manifest records no logical types.
  - A probe against the bundled DuckDB is owed.

### LOD tier selection (unscheduled; ready for its preregistration)

- **Rule:** draw the coarsest tier whose area × 4^zoom ≤ τ px², with a declared hysteresis margin under about 0.58 zoom levels.
  - The thresholds follow by arithmetic, not by measurement.
  - τ must be declared, and tier drift measured.
- **While a tier loads:** deck.gl's best-available / no-overlap / never vocabulary, plus MapLibre's rule of keeping the coarser tile until the finer one is complete.
- **Hazard:** the shell's pick anchor is read from the picked feature's resident geometry, which may be a simplified tier. Route it to tier 0 by stable id, or pin the behaviour with a test.

## 2. Licence watch

These are things a declared-identifier audit would miss.

- **earcut**, which is in the tree through `geo`, moved from ISC to MIT OR Apache-2.0 in April 2026. It still ships `LICENSE-ISC` for code derived from Mapbox. The ISC notice stays owed after the next `geo` bump, even though the label will change.
- **The notice route for ported shell code is missing** (see milestone 3).
- **loader-utils 4.4.4** in the shell's lockfile restarts its request debounce on every completion. This is fixed in 4.5.3.
- **maplibre-style-spec** declares ISC in `package.json`, but its LICENSE is BSD-3-Clause.
- **async-tiff** declares MIT OR Apache-2.0 but ships only MIT.
- **The MCP spec and `rmcp`** carry a licence text in mid-transition.
- **proj4rs** has no LICENSE file.
- **PROJ's `proj.db`** embeds the whole EPSG dataset.
- **clipper2-rust's `BSL-1.0`** is the permissive Boost licence, not Business Source.

## 3. Records to correct

- **ADR-032 is Accepted** (2026-09-23). My first brief called it pending; that was wrong.
  - PLAN node `adr-032-decision` still says `proposed`, waiting for a ruling.
  - `docs/README.md:27 @ 4561f3b8` is also stale.
- **`docs/08_Testing.md`** still calls Overture and OSM extracts "redistributable", which conflicts with the ruling on corpus #12.

## 4. Registers

The "do not reinvent" and "worth owning" registers are the `register` field of each capability: `node tools/reuse.mjs --list`. The master table follows. These are dated findings. Whether consulting them becomes a standing step before planning is your ruling, after the governance freeze lifts.

## 5. Method, and where it departed from the brief

- **Tools.** GitHub search and the GitHub API were blocked in this environment, because the session is bound to other repositories. So:
  - discovery used the crates.io and npm search APIs plus web search;
  - inspection used shallow, blob-less clones at pinned commits, `rg`, and `git log` / `git log -S` / blame;
  - GitHub issue and PR pages could not be read (robots.txt), so an open upstream PR could exist unseen (for example against `duckdb-rs`).
- **Independent check.** Two checkers who had not seen the research re-verified 37 high-stakes claims and 20 random citations in source:
  - 28 claims confirmed, 8 partly right, 1 wrong;
  - 19 spot-checks confirmed, 1 partly right.

  Every correction is applied in the index and appended as errata to the notes file it touches.
- **Not done in Round 1:**
  - deep dives on styling, publishing, plugins, labels and the native renderer (catalogued only);
  - any measurement;
  - any upstream issue search.
- **Candidates for Round 2,** each before its PLAN node is preregistered:
  - the label-pipeline spike's prior art, when the bake-off is scheduled;
  - the style DSL's semantics, before `style-dsl-editor`;
  - the plugin runtime, before `first-external-plugin-skp-client`.

## 6. Master table

One row per candidate. "Dependency" appears only for reuse modes: *already present*, *new — the human's typed word*, or *none* (ported code, test data or a specification).

| Priority | Capability | Need-by (PLAN) | Candidate | Repository @ commit | Licence | Class | Mode | Dependency | Register | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| P0 | duckdb-native-geometry-decoding | corpus-line-files | DuckDB | duckdb/duckdb @ d8cdaa3 | MIT | permissive | WATCH | — | open | extension/parquet/parquet_reader.cpp IsGeometryType; parquet_geometry.cpp. |
| P0 | geoparquet-conformance-files | corpus-line-files | GeoParquet spec repo | opengeospatial/geoparquet @ 4c9f87e | Apache-2.0 | permissive | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | test_data/ and examples/ at a pinned tag. |
| P0 | geoparquet-conformance-files | corpus-line-files | geoarrow-data | geoarrow/geoarrow-data @ e8eaa04 | NOASSERTION | data | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | Examples and EPSG:4326 lat-first files; licence per dataset (some unidentified). |
| P0 | geoparquet-conformance-files | corpus-line-files | gpq | planetlabs/gpq @ a5a6b20 | Apache-2.0 | permissive | CONCEPTUAL | — | do-not-reinvent | Validator test cases. |
| P0 | real-world-line-test-files | corpus-line-files | Microsoft Road Detections (Source Cooperative mirror) | microsoft/RoadDetections @ unversione | ODbL (Microsoft LICENSE, no version; ODbL-1.0 per the mirror's catalogue) | data | ADOPT | none (test data fetched by pinned URL, or a specification) | open | Local-only, sha256-pinned; attribution if a derivative is ever published. |
| P0 | real-world-line-test-files | corpus-line-files | natural-earth-vector | nvkelso/natural-earth-vector @ ca96624 | NOASSERTION | data | ADOPT | none (test data fetched by pinned URL, or a specification) | open | Public domain; regenerate by a project generator. |
| P0 | real-world-line-test-files | corpus-line-files | docs | OvertureMaps/docs @ 4415e90 | NOASSERTION | data | REJECT | — | open | Reference only: text id refused; ODbL. |
| P0 | aria-grid-accessibility | b1-shell-half | WAI-ARIA APG grid pattern | w3.org/WAI/ARIA/apg/patterns/grid @ fetched 20 | W3C specification | spec | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | The baseline. |
| P0 | aria-grid-accessibility | b1-shell-half | react-data-grid | adazzle/react-data-grid @ f5f8abd | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | Closest keyboard model. |
| P0 | arrow-cell-access | b1-shell-half | apache-arrow (JS) | apache/arrow-js @ 8a7fda4 | Apache-2.0 | permissive | ADOPT | already-present | do-not-reinvent | Already a dependency. |
| P0 | selection-scope-table | b1-shell-half | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | open | Selected-features table mode. |
| P0 | stale-range-cancellation | b1-shell-half | VS Code | microsoft/vscode @ d3d31f6 | MIT | permissive | PORT | none (ported code: notice route needed) | do-not-reinvent | PagedModel reference-counted page cancellation. |
| P0 | table-data-source | b1-shell-half | duckdb-ui | duckdb/duckdb-ui @ 0628932 | MIT | permissive | CONCEPTUAL | — | worth-owning | DuckDBDataReader: read-until. |
| P0 | table-data-source | b1-shell-half | Perspective | finos/perspective @ 6dbc6b8 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Viewport/range model for a future ruled command. |
| P0 | table-data-source | b1-shell-half | Mosaic | uwdata/mosaic @ 3faf153 | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | Table querying DuckDB by range as you scroll. |
| P0 | table-data-source | b1-shell-half | quak | manzt/quak @ 41549f9 | MIT | permissive | CONCEPTUAL | — | worth-owning | Mosaic-based data table. |
| P0 | table-data-source | b1-shell-half | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Attribute table model and feature cache; scope model. |
| P0 | table-data-source | b1-shell-half | tad | antonycourtney/tad @ 272ffa0 | MIT | permissive | CONCEPTUAL | — | worth-owning | Desktop DuckDB table viewer. |
| P0 | table-data-source | b1-shell-half | rill | rilldata/rill @ 46764c3 | Apache-2.0 | permissive | REJECT | — | worth-owning | Server architecture; no fit. |
| P0 | table-data-source | b1-shell-half | kepler.gl | keplergl/kepler.gl @ e591395 | MIT | permissive | REJECT | — | worth-owning | Materialises in the client. |
| P0 | virtualized-grid | b1-shell-half | hightable | hyparam/hightable @ 0989abd | MIT | permissive | PORT | none (ported code: notice route needed) | worth-owning | DataFrame fetch interface and createScale height scaling; 0.26.0 is the last React 18 release. |
| P0 | virtualized-grid | b1-shell-half | react-data-grid | adazzle/react-data-grid @ f5f8abd | MIT | permissive | CONCEPTUAL | — | worth-owning | Keyboard-to-position map; React 19 from beta.49. |
| P0 | virtualized-grid | b1-shell-half | ag-grid | ag-grid/ag-grid @ 89faa99 | MIT AND LicenseRef-AG-Grid-Commercial | permissive | CONCEPTUAL | — | worth-owning | aria-rowcount=-1 while the total is unknown; version-stamped ranges. Server-side and viewport row models are Enterprise (red). |
| P0 | virtualized-grid | b1-shell-half | glide-data-grid | glideapps/glide-data-grid @ 0875d78 | MIT | permissive | REJECT | — | worth-owning | Canvas behind a hidden copy for screen readers. |
| P0 | virtualized-grid | b1-shell-half | TanStack Table | TanStack/table @ 6aa0d74 | MIT | permissive | REJECT | — | worth-owning | No accessibility attributes. |
| P0 | virtualized-grid | b1-shell-half | TanStack Virtual | TanStack/virtual @ 78371e8 | MIT | permissive | REJECT | — | worth-owning | Virtualiser only; no grid semantics. |
| P0 | virtualized-grid | b1-shell-half | revogrid | revolist/revogrid @ d838028 | MIT | permissive | REJECT | — | worth-owning | Web component; poor fit. |
| P0 | virtualized-grid | b1-shell-half | regular-table | finos/regular-table @ 47f99d3 | Apache-2.0 | permissive | REJECT | — | worth-owning | Different model. |
| P0 | virtualized-grid | b1-shell-half | Observable Inputs | observablehq/inputs @ 04a1a8b | ISC | permissive | REJECT | — | worth-owning | Materialises rows. |
| P0 | query-progress | decision-adr-029-scan-progress-route, briefb-b2-save-reopen | duckdb-neo QueryProgressTracker | duckdb/duckdb-rs @ b907911 | MIT | permissive | PORT | none (ported code: notice route needed) | open | Shape for route 2 (a patch adding an accessor to the classic crate); WATCH the crate's publication for route 3. |
| P0 | append-log-torn-tail-recovery | b2-piece-1b-recording | LevelDB | google/leveldb @ 7ee830d | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | Length + CRC record framing; reporter on corruption. |
| P0 | append-log-torn-tail-recovery | b2-piece-1b-recording | RocksDB | facebook/rocksdb @ dec6799 | GPL-2.0-only OR Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | kPointInTimeRecovery semantics (taken under the Apache-2.0 option). |
| P0 | append-log-torn-tail-recovery | b2-piece-1b-recording | etcd | etcd-io/etcd @ f061acd | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Zero-sector / torn-tail handling in its WAL. |
| P0 | append-log-torn-tail-recovery | b2-piece-1b-recording | SQLite | sqlite/sqlite @ 74675a9 | blessing (public domain) | permissive | CONCEPTUAL | — | worth-owning | WAL frame checksums and salt chaining. |
| P0 | append-log-torn-tail-recovery | b2-piece-1b-recording | nedb | louischatriot/nedb @ 35be491 | MIT | permissive | REJECT | — | worth-owning | Silently drops corrupt lines up to a ratio. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | Rust std | rust-lang/rust @ 42cfc04 | MIT OR Apache-2.0 | permissive | ADOPT | already-present | worth-owning | rename + sync_all are the primitives; already in the toolchain. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | Chromium | chromium/chromium @ 8fe23318 | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | ImportantFileWriter: flush and measured retries. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | rust-atomic-write-file | andreacorbellini/rust-atomic-write-file @ e1ee3a5 | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | Unix directory fsync; O_TMPFILE option. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | git | git/git @ 6de20f6 | GPL-2.0-only | likely-incompatible | CONCEPTUAL | — | worth-owning | Lockfile + rename discipline and retry; GPL-2.0-only, ideas only. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | tempfile | Stebalien/tempfile @ 1c294cc | MIT OR Apache-2.0 | permissive | REJECT | — | worth-owning | NamedTempFile::persist does no sync. |
| P0 | atomic-file-replace | b2-piece-1c-save-and-reopen | rust-atomicwrites | untitaker/rust-atomicwrites @ a15afcb | MIT | permissive | REJECT | — | worth-owning | Adds no Windows flush or retry. |
| P0 | cross-file-save-consistency | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | git | git/git @ 6de20f6 | GPL-2.0-only | likely-incompatible | CONCEPTUAL | — | open | Commit-to-tree hash link as the consistency model. |
| P0 | cross-file-save-consistency | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | blender | blender/blender @ fbe76d9 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | open | Single-file save with recovery as the contrast. |
| P0 | cross-file-save-consistency | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | REJECT | — | open | .qgz zips both into one container — not ADR-036's folder model. |
| P0 | engine-open-identity | b2-piece-1c-save-and-reopen | DuckDB | duckdb/duckdb @ f2f9329 | MIT | permissive | BENCHMARK | — | open | How the engine actually opens the file (by path, full sharing). |
| P0 | path-containment | b2-piece-1c-save-and-reopen | cap-std | bytecodealliance/cap-std @ b7acf8e | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT | permissive | PORT | none (ported code: notice route needed) | worth-owning | Per-segment resolution beneath a directory handle on Windows and Unix; refuses absolute link targets, so every Windows junction is refused; ~9 crates if taken as a dependency instead. |
| P0 | path-containment | b2-piece-1c-save-and-reopen | Go | golang/go @ 3b98edd | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | os.Root (Go 1.24+): same model, public escape history (three Root escape fixes since 2025); its tests are a ready escape table. |
| P0 | path-containment | b2-piece-1c-save-and-reopen | Rust std | rust-lang/rust @ 42cfc04 | MIT OR Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | The CVE-2022-21658 remove_dir_all fix as symlink-race prior art. |
| P0 | path-containment | b2-piece-1c-save-and-reopen | fs_at | rbtcollins/fs_at @ 8443962 | Apache-2.0 | permissive | WATCH | — | worth-owning | Openat-style API for Rust including Windows; young. |
| P0 | path-containment | b2-piece-1c-save-and-reopen | libpathrs | cyphar/libpathrs @ 3abe8bb | MPL-2.0 OR LGPL-3.0-or-later | weak-copyleft | WATCH | — | worth-owning | Linux-only safe path resolution; weak copyleft. |
| P0 | path-containment | b2-piece-1c-save-and-reopen | filepath-securejoin | cyphar/filepath-securejoin @ 9e667ca | BSD-3-Clause AND MPL-2.0 | weak-copyleft | REJECT | — | worth-owning | Lexical join plus Linux-only re-checks; not race-free on Windows. |
| P0 | reserved-filename-checks | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | Go | golang/go @ 3b98edd | BSD-3-Clause | permissive | CONCEPTUAL | — | do-not-reinvent | isReservedName / isReservedBaseName, including the Windows 11 change. |
| P0 | reserved-filename-checks | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | cap-std | bytecodealliance/cap-std @ b7acf8e | Apache-2.0 WITH LLVM-exception OR Apache-2.0 OR MIT | permissive | PORT | none (ported code: notice route needed) | do-not-reinvent | Reserved-name list with tests. |
| P0 | file-association-double-click | b2-piece-1c-save-and-reopen | Tauri 2 | tauri-apps/tauri @ a225a18 | Apache-2.0 OR MIT | permissive | ADOPT | already-present | do-not-reinvent | Configuration of a dependency already present. |
| P0 | file-association-double-click | b2-piece-1c-save-and-reopen | KiCad | kicad/code/kicad (gitlab.com) @ 05cc3ed | GPL-3.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | do-not-reinvent | .kicad_pro: JSON with its own extension and schema migrations. |
| P0 | file-association-double-click | b2-piece-1c-save-and-reopen | VS Code | microsoft/vscode @ d3d31f6 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | .code-workspace as a JSON document with its own extension. |
| P0 | format-forward-compatibility | b2-piece-1a-step-record-and-dataset-reference | nbformat | jupyter/nbformat @ 4346f97 | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | Minor-version rules and the unrecognised-cell slot. |
| P0 | format-forward-compatibility | b2-piece-1a-step-record-and-dataset-reference | KiCad | kicad/code/kicad (gitlab.com) @ 05cc3ed | GPL-3.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Schema migrations keeping the original. |
| P0 | format-forward-compatibility | b2-piece-1a-step-record-and-dataset-reference | OpenLineage | OpenLineage/OpenLineage @ 9f9c4cb | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Facets with producer and schema URL. |
| P0 | format-forward-compatibility | b2-piece-1a-step-record-and-dataset-reference | excalidraw | excalidraw/excalidraw @ 4c00f31 | MIT | permissive | REJECT | — | worth-owning | Counter-example: drops unknown types. |
| P0 | stable-identity-copy-move | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | Godot | godotengine/godot @ e7b12e749 | MIT | permissive | CONCEPTUAL | — | worth-owning | uid:// and .uid files; duplicate handling. |
| P0 | stable-identity-copy-move | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | VS Code | microsoft/vscode @ d3d31f6 | MIT | permissive | CONCEPTUAL | — | worth-owning | Counter-example; the reverse-pointer file idea only. |
| P0 | strict-json-reader | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | serde_json | serde-rs/json @ afdf6fc | MIT OR Apache-2.0 | permissive | ADOPT | already-present | worth-owning | Tokenising; never parse into Value for these files. |
| P0 | strict-json-reader | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | serde | serde-rs/serde @ 6693a89 | MIT OR Apache-2.0 | permissive | ADOPT | already-present | worth-owning | deny_unknown_fields on derived structs. |
| P0 | strict-json-reader | b2-piece-1c-save-and-reopen, b2-piece-1a-step-record-and-dataset-reference | serde-json-canonicalizer | evik42/serde-json-canonicalizer @ cf6a483 | MIT | permissive | REJECT | — | worth-owning | RFC 8785 crates are writers only. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | Qt QUndoStack | qt/qtbase @ bc887a1 | LicenseRef-Qt-Commercial OR LGPL-3.0-only OR GPL-2.0-only OR GPL-3.0-only | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | QUndoCommand::id / mergeWith / setObsolete; ideas only. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Same-target check on merge. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | prosemirror-history | ProseMirror/prosemirror-history @ 445409b | MIT | permissive | CONCEPTUAL | — | worth-owning | Time- and event-based grouping. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | @codemirror/commands | codemirror/commands @ 5b9bac9 | MIT | permissive | CONCEPTUAL | — | worth-owning | History grouping by user event. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | kafka | apache/kafka @ c553733 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Compaction by key; the active segment is never compacted. |
| P0 | undo-merge-collapse-keys | b2-piece-1b-recording, b2-piece-1a-step-record-and-dataset-reference | tldraw | tldraw/tldraw @ 035b741 | LicenseRef-tldraw (editor) AND MIT (packages/store) | red | REJECT | — | worth-owning | Editor licence is red; the MIT store does not cancel toggles. |
| P0 | combobox-accessibility | shell-migration-milestone-3 | WAI-ARIA APG combobox pattern | w3.org/WAI/ARIA/apg/patterns/combobox @ fetched 20 | W3C specification | spec | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | Follow the attribute set and key table. |
| P0 | command-palette | shell-migration-milestone-3 | VS Code | microsoft/vscode @ d3d31f6 | MIT | permissive | CONCEPTUAL | — | worth-owning | registerAction2 fan-out, MRU ranking, live result count. |
| P0 | command-palette | shell-migration-milestone-3 | Lumino | jupyterlab/lumino @ c5e4fac | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | One CommandRegistry for palette and menus. |
| P0 | command-palette | shell-migration-milestone-3 | cmdk | pacocoursey/cmdk @ dd2250e | MIT | permissive | CONCEPTUAL | — | worth-owning | IME guard; not as a dependency. |
| P0 | command-palette | shell-migration-milestone-3 | Zed | zed-industries/zed @ 4240146 | GPL-3.0-or-later AND Apache-2.0 | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Usage-ranked palette; ideas only. |
| P0 | command-palette | shell-migration-milestone-3 | kbar | timc1/kbar @ 26ec0f4 | MIT | permissive | REJECT | — | worth-owning | Less fit than cmdk for the same cost. |
| P0 | command-registry-native-menus | shell-migration-milestone-3 | @tauri-apps/api | tauri-apps/tauri @ a225a18 | Apache-2.0 OR MIT | permissive | ADOPT | already-present | do-not-reinvent | Already a shell dependency. |
| P0 | command-registry-native-menus | shell-migration-milestone-3 | VS Code | microsoft/vscode @ d3d31f6 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | registerAction2: one entry, many surfaces. |
| P0 | command-registry-native-menus | shell-migration-milestone-3 | Lumino | jupyterlab/lumino @ c5e4fac | BSD-3-Clause | permissive | CONCEPTUAL | — | do-not-reinvent | isEnabled / isVisible / isToggled. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | Kibana | elastic/kibana @ 2a3a7079 | AGPL-3.0-only OR SSPL-1.0 OR Elastic-2.0 | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Structured pills; disabled pills dropped before composition. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | Metabase | metabase/metabase @ 8363349 | AGPL-3.0 AND LicenseRef-Metabase-Commercial | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Pill only on an exact shape match, else a custom expression. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | Superset | apache/superset @ 100f512 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | User SQL kept verbatim since 2026-07, with stated exceptions. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | Grafana Scenes | grafana/scenes @ 737eb53 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Ad-hoc filter model. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | Grafana | grafana/grafana @ 782afc6 | AGPL-3.0-only | core-combinable-copyleft | REJECT | — | worth-owning | SQL builder rewrites. |
| P0 | filter-cards-round-trip | shell-migration-milestone-3 | react-querybuilder | react-querybuilder/react-querybuilder @ ff8482b | MIT | permissive | REJECT | — | worth-owning | Full parser that drops what it cannot read. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | @codemirror/autocomplete | codemirror/autocomplete @ 9a01794 | MIT | permissive | PORT | none (ported code: notice route needed) | do-not-reinvent | FuzzyMatcher, checked against the npm 6.20.3 release. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | uFuzzy | leeoniya/uFuzzy @ 9bcdc09 | MIT | permissive | WATCH | — | do-not-reinvent | Zero-dependency matcher for large lists. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | fzf | junegunn/fzf @ b1be3a8 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | Scoring algorithm reference. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | fzy.js | jhawthorn/fzy.js @ 327b2ae | MIT | permissive | BENCHMARK | — | do-not-reinvent | Scoring comparison. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | command-score | superhuman/command-score @ a192b81 | MIT | permissive | REJECT | — | do-not-reinvent | cmdk's scorer; weaker ranking. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | Fuse | krisk/Fuse @ edf2fb6 | Apache-2.0 | permissive | REJECT | — | do-not-reinvent | Too heavy for command-list scale. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | fuzzysort | farzher/fuzzysort @ ac4d42e | MIT | permissive | REJECT | — | do-not-reinvent | Not needed at this scale. |
| P0 | fuzzy-matching | shell-migration-milestone-3 | nucleo | helix-editor/nucleo @ 8c16d47 | MPL-2.0 | weak-copyleft | REJECT | — | do-not-reinvent | Rust, MPL-2.0; wrong layer. |
| P0 | typed-slash-command-completion | shell-migration-milestone-3 | tiptap | ueberdosis/tiptap @ 5e4c112 | MIT | permissive | CONCEPTUAL | — | worth-owning | Suggestion trigger rule. |
| P0 | typed-slash-command-completion | shell-migration-milestone-3 | @codemirror/autocomplete | codemirror/autocomplete @ 9a01794 | MIT | permissive | CONCEPTUAL | — | worth-owning | Completion-range model. |
| P1 | axis-order-handling | accept-adr-032 | gdal | OSGeo/gdal @ 4386ba2 | MIT | permissive | CONCEPTUAL | — | open | OGR Parquet driver CRS handling. |
| P1 | axis-order-handling | accept-adr-032 | geopandas | geopandas/geopandas @ 2c7a442 | BSD-3-Clause | permissive | CONCEPTUAL | — | open | Writer behaviour. |
| P1 | axis-order-handling | accept-adr-032 | duckdb-spatial | duckdb/duckdb-spatial @ eb1e57c | MIT | permissive | CONCEPTUAL | — | open | ST_Transform axis behaviour. |
| P1 | axis-order-handling | accept-adr-032 | geoarrow | geoarrow/geoarrow @ 6ff51fb | BSD-3-Clause | permissive | CONCEPTUAL | — | open | Spec text on CRS. |
| P1 | malformed-input-files | corpus-line-files | parquet-testing | apache/parquet-testing @ 56653c4 | Apache-2.0 | permissive | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | bad_data/ARROW-GH-4131{7,21}.parquet. |
| P1 | malformed-input-files | corpus-line-files | GeoParquet spec repo | opengeospatial/geoparquet @ 4c9f87e | Apache-2.0 | permissive | PORT | none (ported code: notice route needed) | do-not-reinvent | scripts/test_json_schema.py cases. |
| P1 | malformed-input-files | corpus-line-files | gpq | planetlabs/gpq @ a5a6b20 | Apache-2.0 | permissive | PORT | none (ported code: notice route needed) | do-not-reinvent | internal/validator/testdata. |
| P1 | malformed-input-files | corpus-line-files | gdal | OSGeo/gdal @ 4386ba2 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | autotest parquet data; test-data licence unidentified. |
| P1 | malformed-input-files | corpus-line-files | arrow-testing | apache/arrow-testing @ 9ff285c | Apache-2.0 | permissive | REJECT | — | do-not-reinvent | Nothing geospatial of use. |
| P1 | native-parquet-geometry-files | corpus-line-files | parquet-testing | apache/parquet-testing @ 56653c4 | Apache-2.0 | permissive | ADOPT | none (test data fetched by pinned URL, or a specification) | do-not-reinvent | data/geospatial with generator scripts. |
| P1 | native-parquet-geometry-files | corpus-line-files | parquet-format | apache/parquet-format @ bf09939 | Apache-2.0 | permissive | CONCEPTUAL | — | do-not-reinvent | The logical-type spec. |
| P1 | native-parquet-geometry-files | corpus-line-files | arrow | apache/arrow @ beccec0 | Apache-2.0 | permissive | CONCEPTUAL | — | do-not-reinvent | Writer behaviour. |
| P1 | native-parquet-geometry-files | corpus-line-files | arrow-rs | apache/arrow-rs @ 6c31f41 | Apache-2.0 | permissive | WATCH | — | do-not-reinvent | Rust reader support. |
| P1 | style-expressions | style-dsl-editor | maplibre-expr-rs | reearth/maplibre-expr-rs @ 3a6352f | MIT OR Apache-2.0 | permissive | ADOPT | new — the human's typed word | do-not-reinvent | Candidate; the human decides on the dependency. |
| P1 | style-expressions | style-dsl-editor | maplibre-style-spec | maplibre/maplibre-style-spec @ a2f5f94 | BSD-3-Clause | permissive | ADOPT | new — the human's typed word | do-not-reinvent | Candidate TS half; licence files BSD-3-Clause, package.json says ISC. |
| P1 | style-expressions | style-dsl-editor | vega-expression | vega/vega @ — | BSD-3-Clause | permissive | CONCEPTUAL | — | do-not-reinvent | Sandboxed expression subset. |
| P1 | style-expressions | style-dsl-editor | CartoCSS | mapbox/carto @ — | Apache-2.0 | permissive | CONCEPTUAL | — | do-not-reinvent | Dead since 2020; cascade ergonomics only. |
| P1 | lod-hysteresis | lod-tier-selection | Godot | godotengine/godot @ e7b12e7 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | renderer_scene_cull visibility-range margin. |
| P1 | lod-hysteresis | lod-tier-selection | bevy | bevyengine/bevy @ fd98063 | MIT OR Apache-2.0 | permissive | WATCH | — | do-not-reinvent | Visibility ranges without a band. |
| P1 | lod-refinement-while-loading | lod-tier-selection | deck.gl | visgl/deck.gl @ a1cca05 | MIT | permissive | CONCEPTUAL | — | do-not-reinvent | Tileset2D refinement strategies and tests. |
| P1 | lod-refinement-while-loading | lod-tier-selection | MapLibre GL JS | maplibre/maplibre-gl-js @ dc4192c | BSD-3-Clause | permissive | CONCEPTUAL | — | do-not-reinvent | TileManager completeness rule. |
| P1 | lod-selection-metric | lod-tier-selection | Cesium | CesiumGS/cesium @ a3aea90 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Orthographic screen-space error form. |
| P1 | lod-selection-metric | lod-tier-selection | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | Visvalingam area in px². |
| P1 | lod-selection-metric | lod-tier-selection | topojson-simplify | topojson/topojson-simplify @ e37de14 | ISC | permissive | CONCEPTUAL | — | worth-owning | Area threshold in screen units. |
| P1 | lod-selection-metric | lod-tier-selection | openlayers | openlayers/openlayers @ 45d79b2 | BSD-2-Clause | permissive | CONCEPTUAL | — | worth-owning | Nearest level in an arbitrary ladder with direction bias. |
| P1 | lod-selection-metric | lod-tier-selection | three.js | mrdoob/three.js @ a2254fd | MIT | permissive | CONCEPTUAL | — | worth-owning | Distance-based LOD. |
| P1 | lod-selection-metric | lod-tier-selection | Leaflet | Leaflet/Leaflet @ 125bda1 | BSD-2-Clause | permissive | REJECT | — | worth-owning | No comparable mechanism. |
| P1 | racy-mtime-change-detection | b2-piece-1c-save-and-reopen | git | git/git @ 6de20f6 | GPL-2.0-only | likely-incompatible | CONCEPTUAL | — | open | read-cache.c racy-git handling; Documentation/technical/racy-git.txt. |
| P1 | racy-mtime-change-detection | b2-piece-1c-save-and-reopen | cargo | rust-lang/cargo @ 33f504c | MIT OR Apache-2.0 | permissive | CONCEPTUAL | — | open | Fingerprinting with mtime and hashes. |
| P1 | racy-mtime-change-detection | b2-piece-1c-save-and-reopen | ninja | ninja-build/ninja @ 4e4df1e | Apache-2.0 | permissive | CONCEPTUAL | — | open | Restat and log-based mtime comparison. |
| P1 | racy-mtime-change-detection | b2-piece-1c-save-and-reopen | watchman | facebook/watchman @ 038eee6 | MIT | permissive | CONCEPTUAL | — | open | Clock-based change tracking. |
| P1 | processing-history-record | b2-piece-1b-recording, notebooks-record-replay | QGIS | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | open | src/core/history and the processing history provider. |
| P1 | processing-history-record | b2-piece-1b-recording, notebooks-record-replay | dvc | iterative/dvc @ 56e5982 | Apache-2.0 | permissive | CONCEPTUAL | — | open | dvc.lock: inputs by hash. |
| P1 | processing-history-record | b2-piece-1b-recording, notebooks-record-replay | OpenLineage | OpenLineage/OpenLineage @ 9f9c4cb | Apache-2.0 | permissive | CONCEPTUAL | — | open | Run/job/dataset facets. |
| P1 | single-instance-open | b2-piece-1c-save-and-reopen | tauri-plugin-single-instance | tauri-apps/plugins-workspace @ 8489575 | Apache-2.0 OR MIT | permissive | WRAP | new — the human's typed word | do-not-reinvent | tauri-plugin-single-instance; a new dependency whose own dependencies are already in the shell's lock. |
| P2 | boolean-ops-and-buffer | data-doctor-legacy-imports, basic-editing-plugin | geo | georust/geo @ c12769f | MIT OR Apache-2.0 | permissive | ADOPT | already-present | do-not-reinvent | bool_ops and buffer over i_overlay 4.5.x. |
| P2 | boolean-ops-and-buffer | data-doctor-legacy-imports, basic-editing-plugin | i_overlay | iShape-Rust/iOverlay @ — | MIT | permissive | WATCH | — | do-not-reinvent | Park until geo lifts its pin. |
| P2 | boolean-ops-and-buffer | data-doctor-legacy-imports, basic-editing-plugin | clipper2-rust | clipper2-rust @ 517f5d3 | BSL-1.0 | permissive | WATCH | — | do-not-reinvent | Boost licence (permissive), not Business Source. |
| P2 | boolean-ops-and-buffer | data-doctor-legacy-imports, basic-editing-plugin | cavalier_contours | jbuckmccready/cavalier_contours @ 22887a8 | MIT OR Apache-2.0 | permissive | WATCH | — | do-not-reinvent | CAD-grade polyline offsets. |
| P2 | boolean-ops-and-buffer | data-doctor-legacy-imports, basic-editing-plugin | GEOS | libgeos/geos @ 0d790d1 | LGPL-2.1 | weak-copyleft | BENCHMARK | — | do-not-reinvent | Oracle in tests. |
| P2 | crs-transformation | — | PROJ via `proj` crate | georust/proj @ a67b941 | MIT (PROJ); MIT OR Apache-2.0 (bindings) | permissive | ADOPT | new — the human's typed word | do-not-reinvent | Candidate at the first reprojection; native dependency. |
| P2 | crs-transformation | — | geographiclib-rs | georust/geographiclib-rs @ c5e906d | MIT | permissive | ADOPT | already-present (transitive via geo) | do-not-reinvent | Already transitive via geo. |
| P2 | crs-transformation | — | Rust Geodesy | busstoptaktik/geodesy @ ccbee46 | MIT OR Apache-2.0 | permissive | CONCEPTUAL | — | do-not-reinvent | Pipeline-as-composition model. |
| P2 | crs-transformation | — | proj4rs | 3liz/proj4rs @ 4e5ee1b | MIT OR Apache-2.0 | permissive | REJECT | — | do-not-reinvent | Proj strings only; no WKT/PROJJSON; no LICENSE file. |
| P2 | interactive-label-placement | — | MapLibre GL JS | maplibre/maplibre-gl-js @ dc4192c | BSD-3-Clause | permissive | CONCEPTUAL | — | worth-owning | Placement, CollisionIndex, GridIndex, cross-tile index, fade. |
| P2 | interactive-label-placement | — | MapLibre Native | maplibre/maplibre-native @ 5ae8ce4 | BSD-2-Clause | permissive | CONCEPTUAL | — | worth-owning | Same algorithm in C++ with HarfBuzz shaping. |
| P2 | interactive-label-placement | — | deck.gl | visgl/deck.gl @ a1cca05 | MIT | permissive | BENCHMARK | — | worth-owning | CollisionFilterExtension + TextLayer font atlas; not a shell dependency today. |
| P2 | interactive-label-placement | — | OpenLayers | openlayers/openlayers @ 45d79b2 | BSD-2-Clause | permissive | CONCEPTUAL | — | worth-owning | Canvas 2D declutter; analogue for the bundle viewer. |
| P2 | interactive-label-placement | — | Tangram ES | tangrams/tangram-es @ ebe6e4d | MIT | permissive | REJECT | — | worth-owning | Dormant since 2024-01; read-only donor. |
| P2 | interactive-label-placement | — | osmic-text | crates.io/osmic-text @ 0.1.1 | unverified | red | WATCH | — | worth-owning | Claims label collision; no commit since 2026-05. |
| P2 | mcp-sdk | mcp-server-permission-model | MCP specification | modelcontextprotocol/modelcontextprotocol @ 0a11bf6 | Apache-2.0 (transition text; residual MIT) | permissive | ADOPT | none (protocol specification) | do-not-reinvent | The protocol the adapter speaks. |
| P2 | mcp-sdk | mcp-server-permission-model | rmcp | modelcontextprotocol/rust-sdk @ 08e0211 | Apache-2.0 (transition text; residual MIT) | permissive | ADOPT | new — the human's typed word | do-not-reinvent | Candidate; the human decides on the dependency. |
| P2 | mcp-sdk | mcp-server-permission-model | rust-mcp-sdk | rust-mcp-stack/rust-mcp-sdk @ d18de2c | MIT | permissive | WATCH | — | do-not-reinvent | Alternative SDK. |
| P2 | plugin-isolation-and-abi | first-external-plugin-skp-client | Zed | zed-industries/zed @ 4240146 | GPL-3.0-or-later AND Apache-2.0 | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | since_vX WIT layout and host shims. |
| P2 | plugin-isolation-and-abi | first-external-plugin-skp-client | wasmtime | bytecodealliance/wasmtime @ 1bde3f9 | Apache-2.0 WITH LLVM-exception | permissive | WATCH | — | worth-owning | Runtime. |
| P2 | plugin-isolation-and-abi | first-external-plugin-skp-client | Component model / WIT | WebAssembly/component-model @ 6c48079 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | Interface types as the ABI. |
| P2 | plugin-isolation-and-abi | first-external-plugin-skp-client | Extism | extism/extism @ d5da297 | BSD-3-Clause | permissive | WATCH | — | worth-owning | Framework over wasmtime. |
| P2 | plugin-isolation-and-abi | first-external-plugin-skp-client | VS Code extension host | microsoft/vscode @ d3d31f6 | MIT | permissive | CONCEPTUAL | — | worth-owning | Separate-process host, activation events. |
| P2 | polygon-repair | data-doctor-legacy-imports | geo | georust/geo @ c12769f | MIT OR Apache-2.0 | permissive | ADOPT | already-present | do-not-reinvent | MakeValid in repair_polygon/. |
| P2 | polygon-repair | data-doctor-legacy-imports | GEOS | libgeos/geos @ 0d790d1 | LGPL-2.1 | weak-copyleft | BENCHMARK | — | do-not-reinvent | Oracle in tests; not a product dependency. |
| P2 | polygon-triangulation | — | earcut | georust/earcut @ 65f4d2a | (MIT OR Apache-2.0) AND ISC | permissive | ADOPT | already-present (transitive via geo) | do-not-reinvent | Already in the tree; notice action only. |
| P2 | static-tile-archives | briefb-b3-publish-v2, publishing-bundles-hardened | PMTiles | protomaps/PMTiles @ aec8fa1 | BSD-3-Clause AND CC0-1.0 | permissive | WATCH | — | open | When a web/MapLibre branch exists. |
| P2 | static-tile-archives | briefb-b3-publish-v2, publishing-bundles-hardened | tippecanoe | felt/tippecanoe @ — | BSD-2-Clause | permissive | CONCEPTUAL | — | open | Dropping and coalescing heuristics. |
| P2 | static-tile-archives | briefb-b3-publish-v2, publishing-bundles-hardened | qgis2web | tomchadwin/qgis2web @ — | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | open | What users expect to survive export. |
| P2 | memory-pressure-coarsening | lod-tier-selection | Cesium | CesiumGS/cesium @ a3aea90 | Apache-2.0 | permissive | CONCEPTUAL | — | open | memoryAdjustedScreenSpaceError. |
| P2 | request-scheduling | lod-tier-selection | loaders.gl | visgl/loaders.gl @ 2b8d775 | MIT | permissive | CONCEPTUAL | — | worth-owning | RequestScheduler; mixed licence (tiles/ has Cesium-derived Apache-2.0). |
| P2 | request-scheduling | lod-tier-selection | Cesium | CesiumGS/cesium @ a3aea90 | Apache-2.0 | permissive | CONCEPTUAL | — | worth-owning | RequestScheduler priorities. |
| P3 | font-parsing-rasterisation | — | fontations (skrifa, read-fonts) | googlefonts/fontations @ 8767519 | MIT OR Apache-2.0 | permissive | WATCH | — | do-not-reinvent | Font parsing and outlines. |
| P3 | glyph-atlas-gpu-text | — | glyphon | grovesNL/glyphon @ 49dc8f7 | MIT OR Apache-2.0 OR Zlib | permissive | WATCH | — | open | wgpu text renderer. |
| P3 | glyph-atlas-gpu-text | — | deck.gl | visgl/deck.gl @ a1cca05 | MIT | permissive | BENCHMARK | — | open | TextLayer TinySDF font atlas. |
| P3 | glyph-atlas-gpu-text | — | msdfgen (crate) | crates.io/msdfgen @ — | MIT | permissive | REJECT | — | open | Last release 2023-01. |
| P3 | native-gpu-2d-renderer | — | wgpu | gfx-rs/wgpu @ 03017a1 | MIT OR Apache-2.0 | permissive | WATCH | — | open | GPU abstraction. |
| P3 | native-gpu-2d-renderer | — | lyon | nical/lyon @ da19a62 | MIT OR Apache-2.0 | permissive | WATCH | — | open | CPU path tessellation. |
| P3 | native-gpu-2d-renderer | — | vello | linebender/vello @ 96d4643 | Apache-2.0 OR MIT | permissive | WATCH | — | open | Compute 2D renderer. |
| P3 | native-gpu-2d-renderer | — | galileo | Maximkaaa/galileo @ 4255076 | MIT OR Apache-2.0 | permissive | CONCEPTUAL | — | open | Whole Rust geo renderer; no label collision. |
| P3 | print-quality-label-placement | — | QGIS | qgis/QGIS @ fa8f961 | GPL-3.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | worth-owning | src/core/pal/: problem.cpp init_sol_falp, chainSearch. |
| P3 | print-quality-label-placement | — | Mapnik | mapnik/mapnik @ 84107b6 | LGPL-2.1-or-later | weak-copyleft | CONCEPTUAL | — | worth-owning | Placement finder along lines. |
| P3 | print-quality-label-placement | — | d3fc label layout | d3fc/d3fc @ 55ee594 | MIT | permissive | CONCEPTUAL | — | worth-owning | Greedy / annealing / remove-overlaps sketches. |
| P3 | raster-io | — | async-tiff | developmentseed/async-tiff @ 2465c23 | MIT OR Apache-2.0 (MIT file only) | permissive | WATCH | — | open | Async COG reader. |
| P3 | raster-io | — | zarrs | zarrs/zarrs @ 8407fe6 | MIT OR Apache-2.0 | permissive | WATCH | — | open | Zarr v2/v3. |
| P3 | raster-io | — | geotiff | georust/geotiff @ 8c76946 | MIT | permissive | WATCH | — | open | Small GeoTIFF reader. |
| P3 | raster-io | — | GDAL + gdal crate | OSGeo/gdal @ 4386ba2 | MIT | permissive | WATCH | — | open | Everything raster; per-driver licences; heavy native dependency. |
| P3 | text-shaping | — | HarfRust | harfbuzz/harfrust @ 549c33e | MIT | permissive | WATCH | — | do-not-reinvent | Matches HarfBuzz; started as a rustybuzz fork. |
| P3 | text-shaping | — | cosmic-text | pop-os/cosmic-text @ f1a3461 | MIT OR Apache-2.0 | permissive | WATCH | — | do-not-reinvent | Shaping, layout, fallback, bidi. |
| P3 | text-shaping | — | rustybuzz | harfbuzz/rustybuzz @ — | MIT | permissive | REJECT | — | do-not-reinvent | Superseded; last release 2024-11. |
| P3 | topology-editing | basic-editing-plugin | GEOS | libgeos/geos @ 0d790d1 | LGPL-2.1 | weak-copyleft | BENCHMARK | — | open | Oracle. |
| P3 | topology-editing | basic-editing-plugin | JTS | locationtech/jts @ 5a0a736 | EPL-2.0 OR EDL-1.0 | permissive | CONCEPTUAL | — | open | Design source; EDL-1.0 is BSD-style. |
| P3 | topology-editing | basic-editing-plugin | QGIS editing internals | qgis/QGIS @ fa8f961 | GPL-2.0-or-later | core-combinable-copyleft | CONCEPTUAL | — | open | Snapping, vertex tool. |
| WATCH | spatial-index | spatial-indexing-measurement-close | geo-index | kylebarron/geo-index @ e6efbb0 | MIT OR Apache-2.0 | permissive | WATCH | — | open | Hilbert/STR sorts and packed index; serves (2) and (3). Its geo feature is geo 0.31. |
| WATCH | spatial-index | spatial-indexing-measurement-close | rstar | georust/rstar @ 8a0f397 | MIT OR Apache-2.0 | permissive | WATCH | — | open | Already in the lock via geo; serves (2). |
| WATCH | spatial-index | spatial-indexing-measurement-close | FlatGeobuf packed Hilbert R-tree | flatgeobuf/flatgeobuf @ 543346d | BSD-2-Clause | permissive | CONCEPTUAL | — | open | Serves (1). |
| WATCH | spatial-index | spatial-indexing-measurement-close | static_aabb2d_index | jbuckmccready/static_aabb2d_index @ a511a63 | MIT OR Apache-2.0 | permissive | WATCH | — | open | Serves (2). |
