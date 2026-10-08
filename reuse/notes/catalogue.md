# Catalogue track (Round 1): B, I, R shallow; F, G, H, D, L, M, O, P, C catalogue

Researcher: Claude (advisor session), 2026-10-08. TRACK `catalogue`. This track is shallow by instruction:
licence verified from each repository's own files, HEAD commit date recorded, one line of relevance, one
reuse mode, and timing. No deep code archaeology. Clones are at
`~/spatial-ide-archaeology/candidates/catalogue/<TRACK>-<repo>`. Every one is
`git clone --depth 1 --filter=blob:none --no-checkout`, with only LICENSE/COPYING/NOTICE, `Cargo.toml`,
`package.json`, `.gitmodules` and README checked out, plus the few extra files named below. Nothing was
built, installed or run.

Licence classes follow METHOD.md rule 3. Every code row would land in the AGPL-3.0-or-later core. "SDK" means
the empty Apache-2.0 layer (ADR-009 item 4). A proprietary plugin links that layer, never the core.

---

## 1. Spatial IDE facts relied on (at `4561f3b`)

- Labels are a declared differentiator (`docs/06_Rendering.md:15 @ 4561f3b8`). They are also a "declared, unpriced cost".
  No phase schedules a label engine, and a label-pipeline design spike is owed before any renderer-replacement
  decision (`docs/06_Rendering.md:17 @ 4561f3b8`).
- Determinism (`docs/06_Rendering.md:21 @ 4561f3b8`): same style plus same data gives identical style and layout
  *decisions*. Rasterised output is compared within tolerances.
- The native `wgpu` bake-off is filed but unscheduled (`docs/06_Rendering.md:35 @ 4561f3b8`). Its own header says its
  workloads "contain no text" and that label cost "stays a named open line-item"
  (`docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md:34-38 @ 4561f3b8`).
- In v1, every bundle renders in the projected publishing canvas and the MapLibre branch is unimplemented
  (`docs/06_Rendering.md:37 @ 4561f3b8`; `docs/adr/ADR-008-static-publishing-first.md:39-43 @ 4561f3b8`). The bundle viewer draws on
  a Canvas 2D context (`renderer/bundle-viewer/src/main.ts:122 @ 4561f3b8`) and its only runtime dependency is
  `apache-arrow` (`renderer/bundle-viewer/package.json`).
- ADR-008 says publishing means "style + metadata + PMTiles or partitioned assets"
  (`docs/adr/ADR-008-static-publishing-first.md:11 @ 4561f3b8`). ADR-017 v1 builds no PMTiles: `derived_caches: []`
  (`docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:414-415 @ 4561f3b8`). Bundle v2 is PLAN node
  `briefb-b3-publish-v2` (`PLAN.yaml:1887 @ 4561f3b8`, proposed). `publishing-bundles-hardened` is Beta
  (`PLAN.yaml:2106 @ 4561f3b8`).
- Style v0 is the single style model, with exactly two implementations (Rust and TS) pinned by a shared
  agreement vector (`docs/adr/ADR-022-style-v0-as-the-single-style-model.md:37-43 @ 4561f3b8`). Expression languages, labels and
  scale-dependent rules are named refusals (`ADR-022:68-71`; `renderer/src/style.rs:60-76 @ 4561f3b8`, `V0_EXCLUDED`). The
  style DSL and editor are Beta (`docs/07_Roadmap.md:51 @ 4561f3b8`; `PLAN.yaml:2088 @ 4561f3b8`, `style-dsl-editor`).
- Editing is phased (ADR-002). Topology is post-processing (`ADR-002:17`). Geometry repair needs consent and
  shows original, proposed and diff (`ADR-002:34`; `docs/05_Data_Engine.md:18 @ 4561f3b8` names `ST_MakeValid`). The
  basic editing plugin comes last in 1.0 (`docs/07_Roadmap.md:59 @ 4561f3b8`; `PLAN.yaml:2160 @ 4561f3b8`). The data doctor is
  Alpha (`docs/07_Roadmap.md:30 @ 4561f3b8`; `PLAN.yaml:1998 @ 4561f3b8`).
- The engine has no PROJ dependency (`docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:30 @ 4561f3b8`;
  `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md:20 @ 4561f3b8`). It has two definition-supply routes, a pinned
  catalogue and pasted PROJJSON (`ADR-026:28-33`). "When PROJ ... arrives, the set becomes an interim"
  (`ADR-026:51-52`). docs/05 requires a pinned PROJ pipeline, grid content hashes and the PROJ database
  version (`docs/05_Data_Engine.md:30-31 @ 4561f3b8, :38-41`). Equivalence is decided by normalised definitions
  (`:59-71`).
- The engine depends on `geo = "0.33.1"`, `wkb = "0.9.2"` and `geo-traits = "0.3.0"` (`engine/Cargo.toml:53-59 @ 4561f3b8`).
  `geo` 0.33.1 resolves with `earcut`, `geographiclib-rs`, `i_overlay`, `robust`, `rstar`, `sif-itree` and
  `spade` (`Cargo.lock:763-781 @ 4561f3b8`): earcut 0.4.5 (`:558-559`), i_overlay 4.5.2 (`:1027-1028`), rstar 0.12.2
  (`:1603-1604`), spade 2.15.1 (`:1858-1859`).
- The DuckDB build has statically built-in extensions `core_functions`, `parquet` and `json` only, with
  autoload off (`engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md:34-35 @ 4561f3b8`). There is no `spatial` extension, so no
  `ST_MakeValid` in-engine today. That is an inference from the closed list.
- The licence ledger reads **declared identifiers, not licence files** (`DEPENDENCY-LICENSES.md:32 @ 4561f3b8`). It lists
  earcut 0.4.5 as `ISC` (`:562`). It keeps a hand-written EPSG-terms record for the two definitions shipped
  (`:93-120`).
- The shell depends on `@deck.gl/core` and `@deck.gl/layers` ^9.3.7 and not on `@deck.gl/extensions`
  (`frontends/shell/package.json:42-43 @ 4561f3b8`).
- MCP is an adapter over the kernel's semantic API and never carries bulk data (`docs/04_AI_and_MCP.md:9 @ 4561f3b8`). The
  node is `mcp-server-permission-model` (Alpha, `PLAN.yaml:1944 @ 4561f3b8`).
- Plugins are out-of-process SKP clients, and "WASM is the leading candidate" for the sandbox
  (`docs/12_Plugin_Runtime.md:5 @ 4561f3b8`). ADR-009 item 4 makes SDKs Apache-2.0
  (`docs/adr/ADR-009-license-and-open-core-boundary.md:23 @ 4561f3b8`). Item 5 permits proprietary plugins "across the documented
  out-of-process SKP boundary only ... no in-process linking against AGPL code" (`ADR-009:27-31`). Node:
  `first-external-plugin-skp-client` (`PLAN.yaml:1962 @ 4561f3b8`).
- Spatial indexing is closed by measurement. Reopen conditions (1) small-viewport-dominant workload,
  (2) ADR-011 tiled batches remove whole-extent reads, and (3) a writer/instrument confound
  (`docs/07_Roadmap.md:22 @ 4561f3b8`). The Hilbert fixture was written by DuckDB `COPY` "Hilbert order 16"
  (`kernel/RESULTS.md:2990 @ 4561f3b8`).

---

## 2. The sweep (56 repositories cloned licence-only, plus crates.io and npm metadata)

HEAD is the short sha and committer date at clone time (2026-10-08). The licence column is what the
repository's own files say. Where the manifest disagrees, the discrepancy is noted with ⚠.

| Trk | Repository | HEAD | Licence (verified from) | Kept? |
|---|---|---|---|---|
| B | georust/geo | `c12769f` 2026-09-19 | MIT OR Apache-2.0 (LICENSE-MIT, LICENSE-APACHE) | kept |
| B | iShape-Rust/iOverlay | `552e547` 2026-09-24 | MIT OR Apache-2.0 (LICENSE-*, iOverlay/Cargo.toml) | kept |
| B | georust/earcut | `65f4d2a` 2026-07-26 | MIT OR Apache-2.0 **plus ISC-derived portions** (LICENSE-ISC, LICENSE-MIT, LICENSE-APACHE, Cargo.toml) | kept (licence note) |
| B | georust/geos (crate) | `6994ef2` 2026-09-30 | MIT bindings (LICENSE, Cargo.toml) over GEOS, LGPL-2.1 (`sys/geos-src/source` submodule → libgeos/geos) | kept |
| B | Stoeoef/spade | `c8befc9` 2026-03-24 | MIT OR Apache-2.0 | dropped: already transitive via geo, no separate role |
| B | earcutr | (crates.io only) | ISC; last release 2025-05-29 | dropped: geo 0.33 replaced it with `earcut` |
| I | maplibre/maplibre-style-spec | `a2f5f94` 2026-10-05 | **BSD-3-Clause ×2** (LICENSE.txt: MapLibre + Mapbox ≤v1.13); ⚠ package.json declares `ISC` | kept |
| I | reearth/maplibre-expr-rs | `3a6352f` 2026-10-06 | MIT OR Apache-2.0 (LICENSE-*, Cargo.toml); vendors BSD-3 `v8.json` and conformance fixtures with ATTRIBUTION.md | kept (new find) |
| I | vega/vega (`vega-expression`) | `f83954e` 2026-10-05 | BSD-3-Clause (LICENSE; packages/vega-expression/package.json) | kept as concept |
| I | mapbox/carto | `3051072` **2020-10-14** | Apache-2.0 | kept as concept; dormant 6 years |
| I | QGIS expression engine | (QGIS clone) | GPL-2.0-or-later (`src/core/expression/qgsexpression.cpp:10-12`) | concept only |
| R | protomaps/PMTiles | `aec8fa1` 2026-09-16 | spec **CC0-1.0**, implementations BSD-3-Clause, sample tiles ODbL/CC-BY (LICENSE, REUSE.toml) | kept |
| R | stadiamaps/pmtiles-rs | `17e403c` 2026-10-01 | MIT OR Apache-2.0 | kept |
| R | felt/tippecanoe | `4f26211` 2026-08-13 | BSD-2-Clause (LICENSE.md); vendors Boost-1.0 clipper2, wagyu (Clipper-derived), MIT milo | kept |
| R | tomchadwin/qgis2web | `19afac1` 2026-09-18 | GPL-2.0-or-later (file headers, e.g. `qgis2web.py:7-9`; LICENSE is the GPL-2 text) | kept as concept |
| F | maplibre/maplibre-gl-js | `dc4192c` 2026-10-08 | BSD-3-Clause (LICENSE.txt, package.json) | kept |
| F | maplibre/maplibre-native | `5ae8ce4` 2026-10-07 | BSD-2-Clause (LICENSE.md); submodules incl. harfbuzz, freetype, boost | kept |
| F | qgis/QGIS (`src/core/pal/`) | `fa8f961` 2026-10-08 | PAL files **GPL-3.0-or-later** (`pal.cpp`, `labelposition.cpp`, `problem.cpp` headers); QGIS COPYING GPL-2; `qgslabelingengine.cpp` GPL-2.0-or-later | kept |
| F | mapnik/mapnik | `84107b6` 2026-09-23 | LGPL-2.1-or-later (COPYING; `src/text/placement_finder.cpp` header) | kept |
| F | tangrams/tangram-es | `ebe6e4d` **2024-01-08** | MIT | kept as concept; dormant |
| F | openlayers/openlayers | `45d79b2` 2026-10-07 | BSD-2-Clause | kept |
| F | d3fc/d3fc (`d3fc-label-layout`) | `55ee594` **2024-07-30** | MIT | kept as concept; dormant |
| F | visgl/deck.gl (collision filter, text layer) | `a1cca05` 2026-10-07 | MIT (LICENSE, package.json) | kept (added) |
| F | epistates/osmic (`osmic-text`) | `c0cdc2f` 2026-05-08 | MIT | kept as the only Rust label-collision find; early (0.1.1) |
| F | oxigis-render, ezu-* (crates.io search) | — | not cloned | dropped: 0.1.0 / niche, no evidence of serious placement |
| G | Maximkaaa/galileo | `4255076` 2026-07-30 | MIT OR Apache-2.0 | kept |
| G | linebender/vello | `96d4643` 2026-10-08 | Apache-2.0 OR MIT | kept |
| G | nical/lyon | `da19a62` 2026-10-06 | MIT OR Apache-2.0 | kept |
| G | gfx-rs/wgpu | `03017a1` 2026-10-07 | MIT OR Apache-2.0 | kept |
| H | pop-os/cosmic-text | `f1a3461` 2026-09-30 | MIT OR Apache-2.0 | kept |
| H | grovesNL/glyphon | `49dc8f7` 2026-07-09 | MIT OR Apache-2.0 OR Zlib | kept |
| H | harfbuzz/harfrust | `549c33e` 2026-10-07 | MIT | kept |
| H | googlefonts/fontations (skrifa, read-fonts) | `8767519` 2026-10-07 | MIT OR Apache-2.0 | kept |
| H | nical/etagere | `2a17899` 2026-03-18 | MIT OR Apache-2.0 | kept (folded into glyphon row) |
| H | rustybuzz, swash, fontdb, parley, msdfgen (crates.io metadata only) | — | rustybuzz MIT, **last release 0.20.1 on 2024-11-12**; msdfgen crate MIT, last release 2023-01-17 | dropped / noted |
| D | OSGeo/PROJ | `beef414` 2026-10-08 | MIT (COPYING); `proj.db` built from the EPSG dataset, `data/sql/metadata.sql:12` = `EPSG.VERSION v13.104` | kept |
| D | georust/proj | `a67b941` 2026-06-17 | MIT OR Apache-2.0; features `bundled_proj`, `network`; needs `libsqlite3-sys` | kept |
| D | 3liz/proj4rs | `4e5ee1b` 2026-10-08 | MIT OR Apache-2.0 (Cargo.toml `license` field only; **no LICENSE file in the repository**); vendors Karney `geodesic.c` (MIT/X11) | kept |
| D | georust/geographiclib-rs | `c5e906d` 2026-02-17 | MIT | kept (already transitive via geo) |
| D | busstoptaktik/geodesy | `ccbee46` 2026-03-03 | MIT OR Apache-2.0 | dropped: experimental platform, no EPSG/PROJJSON path (`git ls-tree src` shows none) |
| L | OSGeo/gdal | `4386ba2` 2026-10-07 | MIT-style (LICENSE.TXT, 467 lines; no GPL/LGPL hits by grep); optional drivers not checked | kept |
| L | georust/gdal | `c0a6266` 2026-07-04 | MIT (bindings); `gdal-src` submodule → OSGeo/gdal | kept |
| L | developmentseed/async-tiff | `2465c23` 2026-10-01 | ⚠ Cargo declares MIT OR Apache-2.0; repository ships **MIT only** (LICENSE) | kept |
| L | georust/geotiff | `8c76946` 2026-07-31 | MIT; crate 0.1.0 (2025-06-10) | kept |
| L | zarrs/zarrs | `8407fe6` 2026-10-07 | MIT OR Apache-2.0 (LICENCE-*) | kept |
| M | libgeos/geos | `0d790d1` 2026-10-05 | LGPL-2.1 (COPYING; `MakeValid.cpp` header, relicensed GPL→LGPL from rttopo) | kept |
| M | locationtech/jts | `5a0a736` 2026-09-28 | EPL-2.0 / EDL-1.0 dual | concept only |
| M | larsbrubaker/clipper2-rust | `517f5d3` 2026-10-06 | **BSL-1.0 = Boost Software License** (permissive, *not* Business Source License) | kept |
| M | jbuckmccready/cavalier_contours | `22887a8` 2026-08-19 | MIT OR Apache-2.0 | kept |
| O | modelcontextprotocol/modelcontextprotocol | `0a11bf6` 2026-10-06 | **Transition text**: Apache-2.0 for new and consented contributions, MIT residual, docs CC-BY-4.0 (LICENSE:1-5) | kept |
| O | modelcontextprotocol/rust-sdk (`rmcp`) | `08e0211` 2026-10-06 | Cargo declares `Apache-2.0`; ⚠ LICENSE carries the same MIT/Apache transition text | kept |
| O | rust-mcp-stack/rust-mcp-sdk | `d18de2c` 2026-09-19 | MIT | kept as alternative |
| P | bytecodealliance/wasmtime | `1bde3f9` 2026-10-07 | Apache-2.0 WITH LLVM-exception | kept |
| P | WebAssembly/component-model | `6c48079` 2026-10-07 | Apache-2.0 | kept |
| P | extism/extism | `d5da297` 2026-09-02 | BSD-3-Clause; pins wasmtime 48 (`runtime/Cargo.toml:12`) | kept |
| P | zed-industries/zed | `4240146` 2026-10-08 | Host GPL-3.0-or-later (`crates/extension_host/Cargo.toml:6`), API **Apache-2.0** (`crates/extension_api/Cargo.toml:11`) | kept (added) |
| P | microsoft/vscode | `d3d31f6` 2026-10-08 | MIT (code-oss) | concept only |
| C | flatgeobuf/flatgeobuf | `543346d` 2026-10-07 | BSD-2-Clause (root LICENSE, `src/rust/Cargo.toml:11`); ts/cpp packed R-tree ISC (Agafonkin) | kept |
| C | kylebarron/geo-index | `e6efbb0` 2026-09-15 | MIT OR Apache-2.0 | kept |
| C | georust/rstar | `8a0f397` 2026-09-11 | MIT OR Apache-2.0 | kept (already transitive) |
| C | jbuckmccready/static_aabb2d_index | `a511a63` 2026-08-08 | MIT OR Apache-2.0 | kept |

---

## 3. Catalogue rows by track (one line each: what it solves, mode, timing)

Avoided-work grades are rough. No Spatial IDE performance claim is made anywhere below.

### B. Geometry beyond `geo` (shallow)

1. **`geo` 0.33.1, already a dependency.** Tag `geo-0.33.1` contains `repair_polygon` (`MakeValid`), `buffer.rs`
   (over i_overlay), `bool_ops`, `voronoi.rs`, `validation` and three triangulators (verified with
   `git ls-tree geo-0.33.1 geo/src/algorithm/`).
   - `MakeValid` implements *prepair* (Ledoux, Arroyo Ohori and Meijers 2014) with an **odd-even fill rule**.
     Nested interior rings become islands, and the set-difference rule is not implemented
     (`geo/src/algorithm/repair_polygon/mod.rs:1-35`, HEAD).
   - That is a semantic difference from GEOS/PostGIS `ST_MakeValid`. The data doctor's original→proposed→diff
     (ADR-002:34) is exactly where that difference would surface.
   - Upstream risk: geo main pins `i_overlay = "4.5.1, < 4.6.0"` (`geo/Cargo.toml:43`), while i_overlay is at
     9.0.0 on crates.io (2026-09-19). geo's boolean engine is five majors behind its own upstream.
   - **ADOPT** (already in the tree). Timing: before `data-doctor-legacy-imports` (Alpha). Avoided work: large.
2. **i_overlay.** Booleans, buffering and path/polygon offset, integer and float APIs (iOverlay/README.md TOC).
   It powers geo's booleans. Any direct use would be a second version line beside geo's pinned 4.5.x.
   **WATCH**. Timing: park until geo lifts its pin.
3. **`earcut` (georust).** Triangulation, already transitive. It matters for its licence, not its function
   (see §4). **ADOPT** (already in the tree, notice action only). Timing: now, at the next geo bump.
4. **GEOS via `geos` crate.** The full JTS-lineage suite (MakeValid with GEOS semantics, overlay NG,
   coverage). It is LGPL-2.1. The `static` feature compiles GEOS into the binary (`sys/Cargo.toml:33`), which
   brings LGPL relink and notice obligations even inside an AGPL core. It is also a native C++ dependency on
   three platforms. **BENCHMARK AGAINST**: use it as the oracle for geo's `MakeValid` and booleans in tests,
   not as a product dependency. Timing: before `data-doctor-legacy-imports`.

### I. Styling (shallow)

1. **maplibre-expr-rs (`maplibre-expr` 0.5.4).**
   - A pure-Rust parse → typecheck → evaluate of MapLibre expressions. The README claims it passes the
     **entire upstream conformance suite, 563/563** (its own claim, not run here). It vendors those fixtures
     from maplibre-style-spec at a pinned commit (`tests/fixtures/ATTRIBUTION.md`).
   - In 0.5.4 it moved to `libm` so that "an expression evaluates to the same bits on every host, native and
     WebAssembly alike" (`CHANGELOG.md`). That is the docs/06_Rendering.md:21 @ 4561f3b8 determinism requirement, met upstream.
   - CI runs on ubuntu, macos and windows (`.github/workflows/ci.yml:46-50`).
   - Young: first release 2026-07-01, 11 releases in 3 months.
   - Paired with maplibre-style-spec's TS evaluator, it is a ready-made instance of ADR-022's shape: one Rust
     and one TS implementation, pinned by an agreement vector that neither generates (upstream's conformance
     fixtures).
   - **ADOPT** candidate, if the Beta DSL chooses MapLibre expression semantics. The human decides on the
     dependency. Timing: before `style-dsl-editor`'s design. Avoided work: large.
2. **maplibre-style-spec.** The reference TS expression evaluator (`src/expression/`) plus the v8 spec JSON and
   conformance fixtures. Its licence files say BSD-3-Clause, but package.json says ISC (§4). It would be the TS
   half of the pair above. **ADOPT** candidate, same condition and timing. As a dependency it is 9.75 MB
   unpacked (npm `dist.unpackedSize`) with 6 runtime dependencies. As a concept donor, the fixtures alone are
   the agreement vector.
3. **vega-expression.** A safe JS expression parser and codegen (BSD-3) and the precedent for a sandboxed
   expression subset. **CONCEPTUAL DONOR**. Timing: `style-dsl-editor`.
4. **CartoCSS.** A CSS-like cascade compiling to Mapnik XML. Last commit 2020-10-14. It is the
   human-authorable-text-style precedent (docs/01 "plain text everywhere"), and it is dead. **CONCEPTUAL
   DONOR** (cascade and selector ergonomics only). Timing: park.
5. **QGIS expression engine.** GPL-2.0-or-later, concept only (data-defined overrides everywhere).
   **CONCEPTUAL DONOR**. Timing: park.

### R. Static publishing (shallow), tied to B3

1. **PMTiles (spec v3).** The spec is CC0 and the implementations BSD-3. The header bounds and centre are
   **latitude/longitude** (`spec/v3/spec.md:207-243`) and TileIDs walk Hilbert curves over the z/x/y pyramid
   (`:281`). It fits the web publishing canvas only, which v1 does not implement (ADR-008:39-43). It does not
   fit B3's projected-source bundles. **WATCH**. Timing: when the MapLibre branch gets its equivalence check.
   Not B3.
2. **pmtiles-rs.** A Rust reader and writer (MIT OR Apache-2.0) if the web branch ever lands. **WATCH**. Same
   timing.
3. **tippecanoe (felt).** Projections are hard-coded to EPSG:4326 and EPSG:3857 (`projection.cpp:13-15`). It is a
   C++ CLI. Its value is the dropping and coalescing heuristics for display caches. **CONCEPTUAL DONOR**.
   Timing: park, until `derived_caches` gets an entry shape (ADR-017:407).
4. **qgis2web.** GPL-2.0-or-later Python QGIS plugin. It exports a project to a self-contained
   OpenLayers/Leaflet page, which is the closest product precedent for a "viewer shipped in the artifact"
   bundle (ADR-008 clarification). **CONCEPTUAL DONOR** (what users expect to survive export: categorised and
   graduated styles, popups). Timing: `publishing-bundles-hardened`.

### F. Label engine (catalogue, one row each as requested). Starting list for the docs/06 spike

| Engine | Licence | Placement style it does best | Where | HEAD | Mode |
|---|---|---|---|---|---|
| MapLibre GL JS | BSD-3-Clause | **Fast interactive**: per-frame greedy placement against a screen-space `GridIndex`/`CollisionIndex`, cross-tile symbol index, fade | `src/symbol/placement.ts` (`class Placement`, l.190), `collision_index.ts`, `grid_index.ts`, `shaping.ts`, `bidi.ts` | `dc4192c` 2026-10-08 | CONCEPTUAL DONOR (the interactive reference) |
| MapLibre Native | BSD-2-Clause (submodules incl. HarfBuzz, FreeType) | The same algorithm in C++ with real shaping via HarfBuzz | `src/mln/text/placement.cpp`, `collision_index.cpp`, `shaping.cpp` | `5ae8ce4` 2026-10-07 | CONCEPTUAL DONOR (closest to a native port) |
| QGIS PAL | **GPL-3.0-or-later** (libpal headers) | **Print-quality**: candidate generation, then a global optimisation (FALP initial solution, `Problem::init_sol_falp`, `problem.cpp:148-150`, then `chainSearch`, `:535`) with cost functions and priorities | `src/core/pal/` (22 files) | `fa8f961` 2026-10-08 | CONCEPTUAL DONOR (core-combinable copyleft if ever ported; never SDK) |
| Mapnik | LGPL-2.1-or-later | Server-side print/tile rendering: placement finder along lines, collision detector | `src/text/placement_finder.cpp`, `include/mapnik/label_collision_detector.hpp` | `84107b6` 2026-09-23 | CONCEPTUAL DONOR |
| Tangram ES | MIT | Interactive GL with curved labels and a label collider | `core/src/labels/labelCollider.cpp`, `curvedLabel.cpp` | `ebe6e4d` **2024-01-08** | REJECT as dependency (dormant); read-only donor |
| OpenLayers | BSD-2-Clause | Canvas 2D declutter with z-index contexts; the right analogue for the **Canvas 2D bundle viewer** | `src/ol/render/canvas/TextBuilder.js`, `ZIndexContext.js` | `45d79b2` 2026-10-07 | CONCEPTUAL DONOR (for the projected publishing viewer) |
| d3fc label layout | MIT | Chart-scale strategies: greedy, simulated annealing, remove-overlaps | `packages/d3fc-label-layout/src/{greedy,annealing,removeOverlaps}.js` | `55ee594` **2024-07-30** | CONCEPTUAL DONOR (algorithm sketches only) |
| deck.gl (added) | MIT | **Already in the stack's family**: `CollisionFilterExtension` (GPU collision pass, `getCollisionPriority` −1000…1000, collision groups) and `TextLayer` with a TinySDF font atlas | `modules/extensions/src/collision-filter/*`, `modules/layers/src/text-layer/font-atlas-manager.ts:6` | `a1cca05` 2026-10-07 | BENCHMARK AGAINST (the spike's zero-cost baseline; `@deck.gl/extensions` is not a shell dependency today) |
| Rust labelling | — | **No serious Rust map-label placement found.** galileo has text rendering (`galileo/src/render/text/rustybuzz.rs`), but `rg -i 'collision\|declutter\|overlap' galileo/src` finds nothing; its MapLibre style crate only *parses* `text-allow-overlap` (`galileo-maplibre/src/style/layer/symbol.rs:246-247`) and says "This crate is WIP". `osmic-text` 0.1.1 ("Text shaping, label collision, glyph atlas") has had no commit since 2026-05-08. | — | — | WATCH |

Consequence for the spike: the **placement algorithm** is the part no permissive Rust crate supplies. Shaping
and atlases are supplied (G/H below). The interactive reference is BSD (MapLibre). The print-quality
reference is GPL-3.0-or-later (PAL).

### G, H. Native wgpu renderer and text (catalogue)

| Candidate | Licence | What it supplies | HEAD / release | Mode |
|---|---|---|---|---|
| wgpu | MIT OR Apache-2.0 | GPU abstraction (Metal, Vulkan, DX12, GL, WebGPU) | `03017a1` 2026-10-07; 30.0.1 | WATCH (bake-off's Candidate N substrate) |
| lyon | MIT OR Apache-2.0 | CPU path tessellation (fill/stroke) into GPU meshes | `da19a62` 2026-10-06; 1.0.19 | WATCH |
| vello | Apache-2.0 OR MIT | GPU compute 2D vector renderer (paths, glyphs) | `96d4643` 2026-10-08; 0.11.0 | WATCH |
| Galileo | MIT OR Apache-2.0 | A whole Rust geo renderer (wgpu, lyon, rustybuzz, MVT, MapLibre styles WIP). Last crates.io release 0.2.1 on **2025-07-11**; CI ubuntu-only | `4255076` 2026-07-30 | CONCEPTUAL DONOR (architecture reference for the bake-off; not a dependency candidate at this release cadence) |
| cosmic-text | MIT OR Apache-2.0 | Shaping and layout (now on **harfrust 0.5 + skrifa 0.40 + fontdb 0.24**, `Cargo.toml:16-30`), fallback, bidi | `f1a3461` 2026-09-30; 0.19.0 | WATCH |
| glyphon | MIT OR Apache-2.0 OR Zlib | wgpu text renderer = cosmic-text + etagere atlas + wgpu 30 (`Cargo.toml:11-13`) | `49dc8f7` 2026-07-09; 0.12.0 | WATCH |
| HarfRust | MIT | Pure-Rust HarfBuzz port "matches HarfBuzz v14.5.1"; **started as a fork of RustyBuzz** (README) | `549c33e` 2026-10-07; 0.14.0 | WATCH |
| fontations (skrifa, read-fonts) | MIT OR Apache-2.0 | Font parsing, outlines, hinting (Google Fonts) | `8767519` 2026-10-07; skrifa 0.48.0 | WATCH |
| rustybuzz | MIT | Superseded: last release 0.20.1 on 2024-11-12. Galileo still depends on it (`Cargo.toml:89`) | — | REJECT (use HarfRust) |
| msdfgen (crate) | MIT | MSDF atlas; last release 2023-01-17 | — | REJECT |

Timing for all G/H rows: park until the bake-off is scheduled *and* the label spike exists
(docs/06_Rendering.md:17 @ 4561f3b8). The bake-off header already binds that.

### D. CRS (catalogue)

| Candidate | Licence | Fit to docs/05's contract | HEAD | Mode |
|---|---|---|---|---|
| PROJ via `proj` crate | PROJ MIT; bindings MIT OR Apache-2.0 | **Matches docs/05's vocabulary**: pipelines, grids, database version, PROJJSON in and out. `bundled_proj` builds PROJ from source and needs sqlite (`libsqlite3-sys`); the `network` feature adds tiff and HTTP (`proj-sys/Cargo.toml:15,25-31`). `proj.db` is built from the EPSG dataset (v13.104, `data/sql/metadata.sql:12`), which scales the existing two-definition EPSG-terms record (`DEPENDENCY-LICENSES.md:93 @ 4561f3b8`) to the whole dataset | PROJ `beef414` 2026-10-08; `proj` `a67b941` 2026-06-17 | ADOPT candidate at the first reprojection (human's dependency call; ADR-026:51 already anticipates it) |
| proj4rs | MIT OR Apache-2.0 (Cargo only, no LICENSE file in repo) | **Does not fit.** Proj strings only, "no support for WKT" (README:29-30; `lib.rs:71-77`); no PROJJSON input, no pipeline or database notion; grid support "experimental" (README:85-88); no `.github/workflows` in the repo; the `aeqd` feature compiles vendored C `geodesic.c` via `cc` | `4e5ee1b` 2026-10-08; 0.2.0 on 2026-09-09 | REJECT for the engine; WATCH for an in-bundle viewer transform |
| geographiclib-rs | MIT | Geodesic distance and area (Karney); already transitive via geo (`Cargo.lock:808 @ 4561f3b8`) | `c5e906d` 2026-02-17 | ADOPT (already in tree, via geo's `Geodesic*`) |
| Rust Geodesy | MIT OR Apache-2.0 | Experimental transformation-primitive platform; no EPSG/PROJJSON path | `ccbee46` 2026-03-03 | CONCEPTUAL DONOR (pipeline-as-composition model) |

### L. Raster (catalogue). No PLAN node schedules raster.

| Candidate | Licence | Supplies | HEAD | Mode |
|---|---|---|---|---|
| GDAL (OSGeo) + `gdal` crate | GDAL MIT-style (LICENSE.TXT, per-component list; driver deps unchecked); crate MIT | Everything raster (and vector import); a heavy native dependency with per-driver licences | `4386ba2` 2026-10-07 / crate `c0a6266` 2026-07-04 | WATCH (legacy-imports breadth; big native cost) |
| async-tiff | ⚠ MIT OR Apache-2.0 declared, MIT file only | Async tiled TIFF/COG reader, object_store, GeoTIFF tags, many codecs | `2465c23` 2026-10-01; 0.4.0 | WATCH (first raster candidate, pure Rust) |
| geotiff (georust) | MIT | Small GeoTIFF reader; 0.1.0 (2025-06-10) | `8c76946` 2026-07-31 | WATCH |
| zarrs | MIT OR Apache-2.0 | Zarr v2/v3 arrays (chunked, typed); fits docs/05's "typed chunked representations" | `8407fe6` 2026-10-07; 0.23.14 | WATCH |

### M. Editing and topology (catalogue)

| Candidate | Licence | Supplies | HEAD | Mode |
|---|---|---|---|---|
| GEOS | LGPL-2.1 | Topology validation, MakeValid (GEOS semantics), snapping, coverage ops; the 2.x professional-editing reference | `0d790d1` 2026-10-05 | BENCHMARK AGAINST (oracle for geo) |
| JTS | EPL-2.0 / EDL-1.0 | The design source for GEOS and for geo's relate and validity vocabulary | `5a0a736` 2026-09-28 | CONCEPTUAL DONOR |
| clipper2-rust | **BSL-1.0 (Boost)**, permissive | Pure-Rust Clipper2 port: booleans and offsetting | `517f5d3` 2026-10-06; 1.2.0 | WATCH (alternative overlay engine; note the acronym collision with Business Source License) |
| cavalier_contours | MIT OR Apache-2.0 | Polyline offsets with arcs (CAD-grade parallel offsets) | `22887a8` 2026-08-19; 0.9.0 | WATCH (2.x constraints and offsets) |
| QGIS editing internals | GPL-2.0-or-later | Snapping environments, vertex tool, topology editing | (QGIS clone) | CONCEPTUAL DONOR at 2.x |

Timing: 1.0's minimal snapping (ADR-002 amendment) needs none of these beyond geo. The rows matter at 2.x.

### O. AI and tool execution (catalogue)

| Candidate | Licence | Supplies | HEAD | Mode |
|---|---|---|---|---|
| MCP specification | Apache-2.0 (new and consented), residual MIT, docs CC-BY-4.0: a **transition** licence (LICENSE:1-5) | Protocol schemas: `schema/2024-11-05` … `schema/2026-07-28`, `draft` | `0a11bf6` 2026-10-06 | ADOPT (the protocol the adapter speaks) |
| `rmcp` (official Rust SDK) | Declared Apache-2.0 (workspace `Cargo.toml:16`); repo LICENSE is the same transition text | Server and client, macros, transports (`crates/rmcp/Cargo.toml:125-144`). Releases roughly weekly: 3.2.0 (08-31) → 3.5.1 (10-05). CI ubuntu-only | `08e0211` 2026-10-06 | ADOPT candidate at `mcp-server-permission-model` (human's dependency call; churn is the cost) |
| rust-mcp-sdk | MIT | Alternative SDK | `d18de2c` 2026-09-19 | WATCH |

### P. Plugins (catalogue)

| Candidate | Licence | Relevance | HEAD | Mode |
|---|---|---|---|---|
| wasmtime | Apache-2.0 WITH LLVM-exception | The WASM runtime docs/12 leans toward; CI covers Linux, macOS and Windows (`.github/workflows`) | `1bde3f9` 2026-10-07; 49.0.2 | WATCH until `first-external-plugin-skp-client` |
| Component model / WIT | Apache-2.0 | Interface types as the plugin ABI; an Apache-2.0 WIT package is a natural "SDK" artefact under ADR-009 item 4 | `6c48079` 2026-10-07 | CONCEPTUAL DONOR |
| Extism | BSD-3-Clause | Plugin framework over wasmtime (pins 48; upstream is 49); last commit 2026-09-02, last release 1.30.0 (2026-06-04) | `d5da297` 2026-09-02 | WATCH |
| **Zed** (added) | Host GPL-3.0-or-later, `extension_api` **Apache-2.0** | The exact ADR-009 split in a shipping product: copyleft host, permissive API crate, and WIT interfaces versioned by directory (`crates/extension_api/wit/since_v0.0.1` … `since_v0.8.0`) with per-version host shims (`crates/extension_host/src/wasm_host/wit/since_v*.rs`). **But Zed's extensions run in-process under wasmtime**, and ADR-009 item 5 permits proprietary plugins only out-of-process | `4240146` 2026-10-08 | CONCEPTUAL DONOR (API versioning; the in-process question goes to the human and counsel) |
| VS Code extension host | MIT | Separate-process host, activation events, contribution points | `d3d31f6` 2026-10-08 | CONCEPTUAL DONOR |

### C. Spatial indexes (catalogue, only for a reopen)

| Candidate | Licence | Which reopen condition (docs/07_Roadmap.md:22 @ 4561f3b8) it serves | HEAD | Mode |
|---|---|---|---|---|
| geo-index | MIT OR Apache-2.0 | **(3) writer confound**: has its own Hilbert and STR sorts (`src/rtree/sort/hilbert.rs`, `str.rs`). A non-DuckDB writer path (arrow-rs, the `S` fixture's writer) could produce Hilbert order with pinned encodings to separate writer from layout (inference). **(2)**: a packed, immutable, flatbush-compatible per-tile index. Note its optional `geo` feature is **geo 0.31** (`Cargo.toml:23`), a second geo major if enabled. CI covers macOS, Linux and Windows | `e6efbb0` 2026-09-15; 0.4.0 | WATCH |
| rstar | MIT OR Apache-2.0 | **(2)**: dynamic R-tree for per-tile picking or culling; **already resolved in `Cargo.lock:1603 @ 4561f3b8` via geo** (a direct use would still be a new *direct* dependency) | `8a0f397` 2026-09-11 | WATCH |
| FlatGeobuf packed Hilbert R-tree | BSD-2-Clause (Rust); ISC (ts/cpp) | **(1)**: the on-disk, HTTP-range-friendly index format, if a small-viewport-dominant workload made a sidecar index worth re-measuring (`src/rust/src/packed_r_tree.rs`) | `543346d` 2026-10-07 | CONCEPTUAL DONOR |
| static_aabb2d_index | MIT OR Apache-2.0 | **(2)**: Hilbert-packed static AABB index (flatbush port) | `a511a63` 2026-08-08 | WATCH |

Nothing here reopens the close. Each row only names what a fresh preregistered gate would reach for.

---

## 4. Do not reinvent / worth owning

**Do not reinvent**

- Spatial IDE should not implement **polygon repair** from scratch. `geo` 0.33.1, already a dependency, provides
  `MakeValid` (prepair, Ledoux 2014) under MIT OR Apache-2.0. The exception is if the data doctor requires
  **GEOS/PostGIS `ST_MakeValid` semantics** (set-difference holes, structure-preserving modes). geo implements
  odd-even only, and that requirement would bring GEOS (LGPL-2.1).
- Spatial IDE should not implement **a MapLibre-compatible expression evaluator** from scratch.
  maplibre-expr-rs (Rust, MIT OR Apache-2.0) and maplibre-style-spec (TS, BSD-3-Clause) provide the pair, plus
  563 upstream conformance fixtures, under permissive licences. The exception is if the Beta DSL rejects
  MapLibre expression semantics for its own language.
- Spatial IDE should not implement **text shaping or font parsing**. HarfRust (MIT) and skrifa/read-fonts
  (MIT OR Apache-2.0) provide HarfBuzz-conformant shaping and font parsing. The exception is if the bake-off
  never leaves the browser, which supplies them.
- Spatial IDE should not implement **CRS transformation maths** once reprojection is scheduled. PROJ (MIT) via
  `proj` provides pipelines, grids and database versioning, which docs/05 already names verbatim. The
  exception is if the native-dependency or EPSG-terms cost is ruled unacceptable, in which case nothing
  permissive in Rust meets docs/05 (proj4rs does not).
- Spatial IDE should not write **MCP framing and transport**. `rmcp` (Apache-2.0) provides it. The exception is
  if its weekly-release churn conflicts with the SKP conformance discipline.

**Worth owning**

- **Label placement policy.** No permissive Rust crate does map-label placement. Spatial IDE would own the
  placement and priority policy (the differentiator, docs/06_Rendering.md:15 @ 4561f3b8). It would borrow shaping and atlases (G/H),
  borrow MapLibre's grid-index collision *design* (BSD), and treat PAL's FALP/chain-search optimisation as a
  GPL-3.0-or-later concept source.
- **The style document and its refusal set** (ADR-022). Even if expression semantics are borrowed, the
  document, canonical form and hashing stay in `renderer/`.
- **The plugin ABI versioning.** It borrows Zed's `since_vX` WIT layout and wasmtime, but owns the
  out-of-process boundary ADR-009 requires.

**Licence observations a declared-identifier audit (`DEPENDENCY-LICENSES.md:32 @ 4561f3b8`) would miss**

1. **earcut** (in the tree). It moved from declared `ISC` to `MIT OR Apache-2.0` in commit `c4e2cdc`
   (2026-04-25, "prepare transfer of `earcut-rs` to GeoRust"), first published as 0.4.10 on 2026-05-07. The
   repository still ships `LICENSE-ISC` (Copyright 2016 Mapbox) and says it "contains portions derived from
   mapbox/earcut, originally distributed under the ISC License". The engine's lock is at 0.4.5 (ISC). At the
   next geo bump the ledger row changes expression (and returns to review), and the **ISC notice obligation
   stays even though the declared identifier no longer names it**.
2. **maplibre-style-spec** declares `ISC` in package.json. Its LICENSE.txt is BSD-3-Clause twice (MapLibre and
   Mapbox ≤v1.13), each with a non-endorsement clause.
3. **async-tiff** declares `MIT OR Apache-2.0`, but the repository ships only an MIT LICENSE.
4. **rmcp** declares `Apache-2.0`. The repository LICENSE is a transition text under which un-consented earlier
   contributions "remain licensed under the MIT License". It is permissive either way, but the notice set is
   mixed.
5. **proj4rs** has no LICENSE file at all, only the Cargo field. It also vendors Karney's `geodesic.c`
   (MIT/X11, header lines 21-23).
6. **PROJ `proj.db`** embeds EPSG v13.104. Shipping it extends the IOGP terms question from two definitions to
   the dataset.
7. **clipper2-rust `BSL-1.0`** is the Boost licence (permissive). A keyword scan for "BSL" as Business Source
   License would misfile it as red.

---

## 5. What I could not verify

- No candidate's behaviour or performance was run. maplibre-expr-rs's "563/563" is its own README claim.
- Issue and PR pages (for example whether geo has an open PR lifting the `i_overlay < 4.6` pin, or Zed's stance
  on out-of-process extensions) are unreadable here (robots/`gh` blocked). This is single-commit history
  except where deepened (earcut).
- GDAL's per-driver third-party licences and the `gdal-src` bundled build closure were not walked.
- The MapLibre Native `src/mln/...` path naming: I listed files only. Whether `src/mbgl` was fully renamed
  was not checked.
- Whether `@deck.gl/extensions`' `CollisionFilterExtension` works on the shell's custom projected views was not
  checked. It is the spike's first question.
- The legal reading of in-process WASM for proprietary plugins under ADR-009 item 5 is reserved for counsel.
- Whether the engine's ADR-021 static-parser posture permits a bundled `proj.db` (a runtime-read data file) is
  for the architect.


## Errata from the independent check (2026-10-08)

- VERIFICATION-A row 16: proj4rs has no LICENSE file (confirmed), but its licence is declared in `proj4rs-clib/Cargo.toml` too and in a `README.md:3` badge, and that badge links to another project's LICENSE (`image-rs/imageproc`).
- VERIFICATION-A row 15 (precision): QGIS `src/core/pal/` is mixed — 19 of 22 files carry the libpal GPL-3.0-or-later header; QGIS as a whole is GPL-2.0-or-later.
