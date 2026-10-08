# Track e-lod-selection — LOD tier selection (which tier a viewport draws)

Researcher notes, 2026-10-08. Spatial IDE read at `4561f3b` (`/tmp/spatial-ide`). Candidates were cloned shallow (sparse where large) under `~/spatial-ide-archaeology/candidates/e-lod-selection/`. Nothing was built, installed or run. "Inference" marks reasoning that is not read directly from a file.

---

## 1. Spatial IDE facts relied on (all at `4561f3b`)

**The tiers and their key**
- Tier 0 is the source. Tiers 1–3 are built at the declared minimum-triangle-area ladder `[0.1, 1.0, 5.0]` m², converted into the source CRS's **squared** linear unit. Source: `engine/src/lod.rs:67-79 @ 4561f3b8`. The values are areas, never lengths (`:70-74`).
- Each tier is simplified **from the source independently**, not from the previous tier. The ladder loop is at `engine/src/lod.rs:1042-1051 @ 4561f3b8`, and each tier opens `source.path()` at `:1359-1361`.
- The module does no selection and has no viewport, pixel or zoom (`engine/src/lod.rs:18-20 @ 4561f3b8`). Selection is "renderer/shell work under its own gate" (`engine/LOD-PREREGISTRATION.md:54 @ 4561f3b8`).
- **Pixels belong to selection, in the client, through the visible view transform.** Build is in CRS units and selection is in pixels (`engine/LOD-PREREGISTRATION.md:94-96 @ 4561f3b8`, citing `docs/01_Principles.md:21 @ 4561f3b8`). Any pixel↔CRS conversion inside the engine blocks on sight (`engine/LOD-PREREGISTRATION.md:311 @ 4561f3b8`, §8 item 7).
- **Budget.** Resident tier vertices are charged against the same `MAX_RESIDENT_VERTICES`, and LOD does not redefine "over budget" (`engine/LOD-PREREGISTRATION.md:128-136 @ 4561f3b8`). `MAX_RESIDENT_VERTICES = 2_000_000` (`frontends/shell/src/canvas/limits.ts:70 @ 4561f3b8`).
- **Labels.** The label `lod.tier_resident{tier}` is reserved and must show beside rendered/total (`engine/LOD-PREREGISTRATION.md:132 @ 4561f3b8`). `lod.tier_stale` must ride any stale-tier batch (`:117`). Both shell surfaces are owed by the selection piece (`:400`).
- **Owed to the selection piece.** A fourth miss reason for a present-but-altered tier (`engine/LOD-PREREGISTRATION.md:451 @ 4561f3b8`). The derived path must be checked against the recorded path on reuse (`:453`). The prepare report and the first operator walkthrough are also owed (`:329`, `:400`).
- PLAN node `lod-tier-selection` is **proposed**, renderer lane, and its own preregistration comes first (`PLAN.yaml:835-851 @ 4561f3b8`). Its hard precondition: no product path calls `build_tiers` before the lifecycle is declared. The lifecycle ruling is that the prepare machinery is the runner, the operation lifecycle is the scheduler, priority is background, and the prepare token owns cancellation (`PLAN.yaml:816-833 @ 4561f3b8`).
- ADR-028: residency is viewport-bounded and tile-keyed over a fixed declared grid with one render origin. Over-budget is a declared, labelled partial view. Cross-tile dedupe is by stable id. Item 5 says completeness at overview scales is *not* delivered and LOD owes its own gate (`docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:28-38 @ 4561f3b8`).
- ADR-010 rule 2: "any cull, chunk, sort or LOD" desyncs a GPU ordinal from identity, so picking resolves ordinal → stable id → authoritative f64 (`ADR-010:33`). Rule 5: staleness is signalled, never silently served (`:68`). Rule 6: ceilings are declared, not discovered (`:70`).
- ADR-011 is Proposed and unmeasured. It defers quantization "only after LOD exists" (`ADR-011:30`).

**The renderer and view transform**
- The working canvas uses deck.gl custom views and layers in the source CRS (`docs/06_Rendering.md:35 @ 4561f3b8`). "Every render is cancellable mid-frame batch" (`:7`).
- `OrthographicView` is used (`frontends/shell/src/canvas/WorkingCanvas.tsx:1910 @ 4561f3b8`). **One world unit = 2^zoom CSS pixels.** The file states that CSS pixels, not device pixels, are the unit (`frontends/shell/src/canvas/WorkingCanvas.tsx:543-549 @ 4561f3b8`).
- World units are source CRS units. `toLocal` is a pure translation (`frontends/shell/src/canvas/offsetFrame.ts:196-198 @ 4561f3b8`), and layers are `COORDINATE_SYSTEM.CARTESIAN` (`frontends/shell/src/canvas/buildLayers.ts:404 @ 4561f3b8`).

**The shell's existing tile and request machinery**
- The grid level is fixed for a session's lifetime (`frontends/shell/src/canvas/tileGridConstants.ts:16-20 @ 4561f3b8`). `MAX_IN_FLIGHT_TILE_STREAMS = 3` (`:40`) and `MAX_QUEUED_TILES = 512` (`:54`).
- `TileViewportStreamManager.onCameraChange` does per-tile supersede, cancelling in-flight streams that are no longer covered (`frontends/shell/src/streaming/tileViewportStreamManager.ts:495-506 @ 4561f3b8`, `:586`). The queue is nearest-to-view-centre first (`:620-631`).
- The viewport query debounce is `VIEWPORT_QUERY_MIN_INTERVAL_MS = 120` (`frontends/shell/src/streaming/viewportStreamManager.ts:25 @ 4561f3b8`). There is a declared-margin precedent: `HEADROOM_REFETCH_FRACTION = 0.9` (`frontends/shell/src/residency/candidateArmSession.ts:180-189 @ 4561f3b8`).
- **Pick anchor.** The anchor is "the exterior ring's first vertex" of the *resident batch* (`frontends/shell/src/canvas/pick.ts:11-14 @ 4561f3b8`, `:141`).
- The sub-pixel pick refusal uses the resident average feature extent × pixels per world unit < 9 px (`frontends/shell/src/canvas/pickResolution.ts:81 @ 4561f3b8`, `:204-206`).
- **Dependencies.** `@deck.gl/core`/`@deck.gl/layers` `^9.3.7` (`frontends/shell/package.json:42-43 @ 4561f3b8`) resolve to 9.3.9 (`frontends/shell/package-lock.json:452 @ 4561f3b8`). `@loaders.gl/loader-utils` **4.4.4 is already in the lockfile transitively** (`frontends/shell/package-lock.json:1016 @ 4561f3b8`, pulled in by `@loaders.gl/core`). The shell `src/` does not import any `loaders.gl` package directly (grep: none).
- `engine/LOD-RESULTS.md:99-102 @ 4561f3b8` and `:250-252` record per-tier vertex counts. They are not quoted here; per METHOD rule 5 no Spatial IDE number is used outside `docs/08`. `TierRecord::vertices_after()` (`engine/src/lod.rs:655 @ 4561f3b8`) is where a selection piece could read them.

---

## 2. The sweep (15 considered)

| # | Project | Commit | Licence (verified) | Verdict |
|---|---|---|---|---|
| 1 | visgl/deck.gl — `Tileset2D`, `TileLayer` | a1cca05 | MIT | **Kept, deep.** It is the renderer Spatial IDE already uses. Has refinement strategies, request abort, and distance priority |
| 2 | visgl/loaders.gl — `RequestScheduler` (+ `tiles` Tileset3D) | 2b8d775 | MIT (mixed: `tiles` contains Cesium-derived Apache-2.0 files) | **Kept**, scheduler only. Already transitively in the shell lockfile |
| 3 | CesiumGS/cesium — 3D Tiles traversal, `QuadtreePrimitive`, `RequestScheduler` | a3aea90 | Apache-2.0 | **Kept, deep.** Canonical screen-space error (SSE), skip-LOD, budget-adaptive SSE |
| 4 | godotengine/godot — visibility ranges, mesh LOD | e7b12e7 | MIT | **Kept, deep.** The only true hysteresis band found, plus three fade modes |
| 5 | maplibre/maplibre-gl-js — `TileManager`, covering zoom | dc4192c | BSD-3-Clause | **Kept, medium.** Retain-children/parents and cancel-while-zooming |
| 6 | bevyengine/bevy — `VisibilityRange` | fd98063 | MIT OR Apache-2.0 | Kept as a minor donor. Dithered crossfade with no hysteresis |
| 7 | mrdoob/three.js — `LOD` | a2254fd | MIT | Kept as a minor donor. Fractional hysteresis, equivalent to an additive zoom margin |
| 8 | openlayers/openlayers — `TileGrid.getZForResolution`, `TileQueue` | 45d79b2 | BSD-2-Clause | Kept as a minor donor. `zDirection` is a bias and hook for arbitrary resolution ladders |
| 9 | qgis/QGIS — map-to-pixel simplification | fa8f961 | GPL-2.0-or-later | Kept as a concept only. Squares the pixel tolerance for Visvalingam (direct evidence for the px² metric) |
| 10 | topojson/topojson-simplify | e37de14 (2019) | ISC | Kept as a concept only. VW area documented "typically in square pixels". Inactive since 2019 |
| 11 | Leaflet/Leaflet — `Polyline.smoothFactor` | 125bda1 | BSD-2-Clause | Dropped. Per-zoom RDP in pixels with no tiers and no hysteresis. One line of context |
| 12 | georust/geo 0.33.1 — `simplify_vw.rs` (crate tarball) | crate 0.33.1 | MIT/Apache-2.0 (Spatial IDE's own dep, prior track) | Read for metric semantics only (VW epsilon is non-monotonic) |
| 13 | mapbox/mapbox-gl-js v2+ | npm 3.32.0 metadata | "SEE LICENSE IN LICENSE.txt" (proprietary since v2) | **Dropped, red.** MapLibre is the BSD-3 fork of ≤1.13 |
| 14 | crates.io search "level of detail hysteresis" | — | — | Dropped. Nothing relevant (voxel/bevy plugins, task queues) |
| 15 | Unreal / Unity LOD systems | not cloned | source-available / proprietary | Dropped, red, not inspected |

**Deep read: deck.gl, Cesium and Godot. Medium read: MapLibre and loaders.gl.**

---

## 3. Dossiers

### 3.1 deck.gl `Tileset2D` (+ loaders.gl `RequestScheduler`)

- **Repo / commit:** visgl/deck.gl `a1cca05` (2026-10-07); visgl/loaders.gl `2b8d775` (2026-10-07).
- **Licence:**
  - Verified MIT from `deck.gl/LICENSE`, the SPDX headers (`modules/geo-layers/src/tileset-2d/tileset-2d.ts:1-3`) and `modules/geo-layers/package.json:4`.
  - loaders.gl is MIT (`LICENSE`, `modules/loader-utils/package.json:5`, header of `request-scheduler.ts:1-3`).
  - **Mixed flag:** loaders.gl `modules/tiles/src/tileset-3d/common/tile-3d.ts:1-6` carries `SPDX: MIT` *and* "derived from the Cesium code base under Apache 2 license". This is not in `tileset-2d/` or `request-utils/`; grep for Cesium/Apache in both directories returned nothing.
- **Upstream activity:**
  - `@deck.gl/geo-layers` has had 26 stable npm releases since 2025-10-01; latest 9.4.0 (2026-09-05). `@loaders.gl/loader-utils` has had 9; latest 4.5.3 (2026-10-06).
  - Tests: `test/modules/geo-layers/tileset-2d/{tileset-2d,tile-2d-header,utils}.spec.ts`. These cover all three strategies (`tileset-2d.spec.ts:468`), abort (`:203-205`) and priority tiers (`:100`). `request-scheduler.spec.ts` exists.
  - CI is Ubuntu only (`.github/workflows/test.yml`). No native deps.
  - Size: `@deck.gl/geo-layers@9.3.9` unpacks to 2,624,447 B with 17 deps (h3-js, a5-js, @loaders.gl/{mvt,3d-tiles,terrain,tiles,wms,gis}, …) and 7 peers. `loader-utils@4.4.4` unpacks to 584,343 B with 4 deps.
- **Why it matters:** this is the renderer Spatial IDE already runs. Its tile machinery is the closest working model of "which level does this viewport draw, what is shown while the wanted level loads, and which requests die when the wanted level changes".
- **How it works:**
  - *Level selection.* For a non-geospatial (orthographic) viewport the level is `z = Math.ceil(viewport.zoom + zoomOffset)`. It is `Math.round` for geospatial (`utils.ts:291-295`), then clamped to min/max zoom (`:297-312`). There is no hysteresis, and the choice is a pure function of the current zoom.
  - *Selected vs visible.* `update()` marks the covering tiles `isSelected`. A strategy then decides which cached tiles are `isVisible` (`tileset-2d.ts:224-276`, `:374-406`).
  - *Strategies* (`tileset-2d.ts:38-57`, functions `:675-737`):
    - `best-available`: each selected-but-unloaded tile uses its nearest loaded ancestor, else its loaded descendants (`updateTileStateDefault`, `:675-688`).
    - `no-overlap`: ancestors only. Once a tile is drawn its children are hidden, so two levels never overlap (`updateTileStateReplace`, `:690-716`).
    - `never`: draw only selected tiles.
    - A custom function can be passed.
    - The docs say `no-overlap` "is usually favorable when tiles do not have opaque backgrounds" (`deck.gl/docs/api-reference/geo-layers/tile-layer.md:306-317`).
  - *Draw order.* Tiles are sorted by zoom so finer draws on top (`_resizeCache`, `:588-633`). `TileLayer.renderLayers` simply maps tiles to sublayers with no fade or opacity ramp (`tile-layer/tile-layer.ts:394-440`). **Transitions are a swap.**
  - *Priority.* Selected tiles get `0 + d`, visible placeholders get `1e8 + d`, and everything else gets `-1`, which means cancel (`_getRequestPriority`, `:443-455`). `d` is the squared screen distance from the viewport centre to the tile's projected outline (`:456-482`). This centre-distance ordering arrived in `a75dc38` (2026-06-13, "prioritize tile requests by viewport center (#10364)"). 9.3.9, which Spatial IDE pins, has the older `tile.isSelected ? 1 : -1` (verified from unpkg `@deck.gl/geo-layers@9.3.9/src/tileset-2d/tile-2d-header.ts:120-121`).
  - *Cancellation, in two layers:*
    1. *Queued:* loaders.gl `RequestScheduler` re-asks `getPriority` for every queued request only when a slot frees. A negative value resolves the request to `null`, cancelling it before it is issued (`request-scheduler.ts:203-229`).
    2. *In flight:* `_pruneRequests` aborts (via `AbortController`) tiles that are loading but neither selected nor visible, and only while ongoing requests exceed `maxRequests` (`tileset-2d.ts:539-560`; `tile-2d-header.ts:190-197`).
    - A late result is discarded by a monotonic `_loaderId` (`tile-2d-header.ts:145`).
  - *Cache.* Size is `5 × selected` tiles or a byte cap, evicting tiles that are neither visible nor selected (`:588-633`).
  - *Debounce defect.* loaders.gl `d1d2cc0` (2026-09-29, "don't restart RequestScheduler debounce when a request finishes (#4067)") fixed completions restarting the quiet period. **The 4.4.4 in Spatial IDE's lockfile still restarts it** (unpkg 4.4.4 `request-scheduler.ts:135-145` calls `_issueNewRequests()` from `done`). **So does 4.5.3** (no `scheduleRefill`). The fix is on master only.
- **Reuse:**
  - Use the three strategy semantics as the vocabulary for the preregistration. Re-key them as **(tile, tier)**, with "parent" = (same tile, next coarser tier). Inference: Spatial IDE's tiers share one fixed grid (`frontends/shell/src/canvas/tileGridConstants.ts:16-20 @ 4561f3b8`), so the "pyramid" is a ladder and `getParentIndex` becomes `tier + 1`.
  - Two smaller ideas to borrow:
    - Re-evaluate priority lazily at slot-free time, where negative means cancel.
    - Use a monotonic loader id to drop late arrivals.
- **Do not reuse:**
  - **`@deck.gl/geo-layers` as a dependency.** It is 2.6 MB with 17 deps. Its `getTileData` is a Promise per tile with an `AbortSignal`, while Spatial IDE uses ticketed SKP streams with admission trims, partial tiles and the ADR-028 dedupe-owner rules. Wrapping it would duplicate `TileViewportStreamManager`.
  - **`loader-utils` `RequestScheduler` directly**, for three reasons:
    - The shell already owns an equivalent slot+queue+supersede manager.
    - The lockfile version has the debounce defect above.
    - Turning a transitive package into a direct one is a dependency question for the human.
- **Licence implications:** MIT, so it is green and a notice is owed if any code is ported. Keep loaders.gl `tiles` (Cesium-derived) out of any port.
- **Reuse mode:** CONCEPTUAL DONOR (high confidence).
- **Avoided work:** moderate. The placeholder and cancel semantics and their edge cases are written and tested.
- **Recommendation:** the selection preregistration should name its mid-load policy in deck.gl's vocabulary (best-available / no-overlap / never) applied per (tile, tier), with `no-overlap` as the default candidate. Spatial IDE polygons are styled fills, so overlapping tiers would double-blend.
- **Timing:** before `lod-tier-selection` (its preregistration).

### 3.2 Cesium 3D Tiles traversal, `QuadtreePrimitive`, `RequestScheduler`

- **Repo / commit:** CesiumGS/cesium `a3aea90` (2026-10-06).
- **Licence:**
  - Apache-2.0, verified from `LICENSE.md:1-5`, `package.json:6` and `packages/engine/package.json:73`.
  - `LICENSE.md` also lists bundled third-party works (earcut, kdbush, rbush, protobuf, …, `:213-592`), and `ThirdParty.json` exists. None of them are in the files read here.
  - The source files read carry no per-file SPDX header.
- **Upstream activity:** 15 stable npm releases since 2025-10-01 (monthly; 1.146.0 on 2026-10-01). Specs exist (`packages/engine/Specs/Core/RequestSchedulerSpec.js`, 33 `it(`). CI is `ubuntu-latest` (`.github/workflows/dev.yml`). Production users were not checked.
- **Why it matters:** the canonical screen-space-error (SSE) system. Its **orthographic branch** is exactly Spatial IDE's case, and it is the only donor that couples LOD choice to a memory budget, which is the ADR-028/§2f question.
- **How it works:**
  - *SSE.* In 2D/orthographic, `error = geometricError / pixelSize`, where `pixelSize = max(frustum extent) / max(drawing-buffer px)`. Distance plays no part. The result is divided by `frameState.pixelRatio` (`Scene/Cesium3DTile.js:955-1004`, branch `:976-987`, `:1001`). A tile refines while `SSE > memoryAdjustedScreenSpaceError` (`Cesium3DTilesetTraversal.js:56-66`). The default `maximumScreenSpaceError` is 16 (`Cesium3DTileset.js:252`).
  - *Mid-load (base traversal).* With replacement refinement a tile refines **only when all its children are loaded** (`Cesium3DTilesetBaseTraversal.js:108` `checkRefines`, `:110-160`). The parent stays drawn until then, which is the equivalent of deck.gl's `no-overlap`.
  - *Skip-LOD* (`skipLevelOfDetail`, default false, `Cesium3DTileset.js:778`):
    - Tiles with SSE above `baseScreenSpaceError` (1024, `:815`) form a base layer that always loads.
    - Below that, intermediate levels are skipped unless `reachedSkippingThreshold` holds: SSE < ancestor's SSE / `skipScreenSpaceErrorFactor` (16, `:828`) and depth > ancestor's depth + `skipLevels` (1, `:840`). See `Cesium3DTilesetSkipTraversal.js:185-199`, `:240-258`.
    - An unloaded desired tile is drawn via its nearest loaded ancestor, else its descendants up to depth 2 (`:34`, `:94-142`).
    - `immediatelyLoadDesiredLevelOfDetail` (default false, `Cesium3DTileset.js:853`) skips the base layer and loads only the desired tiles.
  - *Stability.* No SSE hysteresis band was found in the 3D Tiles traversal files read.
    - Stability comes from load-gated refinement plus `cullRequestsWhileMoving`. That option drops a load when `60 × camera movement / tile diameter ≥ 1` (`Cesium3DTilesetTraversal.js:160-179`; defaults `Cesium3DTileset.js:312-322`).
    - The terrain `QuadtreePrimitive` adds **last-frame memory**. A coarser desired tile is drawn only if it was rendered last frame, was culled or not visited, is fully loaded, or the provider says it "can render without losing detail". Otherwise the finer tiles from last frame keep rendering (`QuadtreePrimitive.js:735-823`, comment `:815-822`).
  - *Budget-adaptive LOD.*
    - When memory exceeds `cacheBytes + maximumCacheOverflowBytes` (512 MiB each by default, `Cesium3DTileset.js:255-261`), `memoryAdjustedScreenSpaceError *= 1.02` per frame. When usage falls below `cacheBytes` it relaxes by `/1.02`, never below the declared maximum (`:3013-3036`, called at `:3001-3005`).
    - The only signal is a debug-build one-time console warning (`:3014-3021`).
  - *Priority.* A composite base-10 digit number: preload-flight | foveated-defer | foveated | progressive-resolution | distance-or-reverse-SSE . depth (`Cesium3DTile.js:2445-2505`). `progressiveResolutionHeightFraction` (0.3, `Cesium3DTileset.js:330`) prioritises a coarse layer first.
  - *Cancellation.*
    - `cancelOutOfViewRequests` cancels any in-flight tile request not touched this frame (`Cesium3DTileset.js:2823-2850`).
    - The global `RequestScheduler` keeps a bounded priority heap (`priorityHeapLength = 20`, `Core/RequestScheduler.js:23-28`). A new higher-priority request bumps and **cancels** the lowest (`:384-437`).
    - Priorities are re-evaluated every `update()` (`:277-336`). There is a per-server cap (`maximumRequestsPerServer = 18`, `:62`; `maximumRequests = 50`, `:54`).
    - `cancelRequest` rejects the deferred and calls the request's `cancelFunction` (`:247-275`).
  - *Cache.* A sentinel-split LRU: tiles touched this frame move right of the sentinel, and only the left side is unloadable (`Cesium3DTilesetCache.js:17-35`).
- **Reuse:**
  1. Take the orthographic SSE as the shape of the selection rule (see §4).
  2. Use "refine only when replacements are resident" as the default mid-load rule.
  3. Use the QuadtreePrimitive "do not lose detail that was visible last frame" rule as a zoom-out stability policy.
  4. Bring `memoryAdjustedScreenSpaceError` to the human as an *option*: tier choice driven by budget as well as scale.
- **Do not reuse:**
  - The perspective SSE with `sseDenominator`, the dynamic/fog SSE, foveation, per-server throttling and the global 20-slot heap. These are tuned for remote HTTP tile servers, not a local engine with three in-flight SKP streams.
  - Cesium's silent (debug-only warning) SSE inflation would violate ADR-028 rule 2 and the `lod.tier_resident` obligation unless it is labelled.
- **Licence implications:** Apache-2.0 is permissive, one-way compatible into GPLv3/AGPLv3 (flag for counsel). A port owes a notice and attribution and must state changes (Apache-2.0 §4). Concept use owes nothing.
- **Reuse mode:** CONCEPTUAL DONOR (high confidence).
- **Avoided work:** moderate. The budget-coupled LOD controller and its pitfalls (oscillation is avoided by the asymmetric 2%-per-frame ramp) are documented in code.
- **Recommendation:** the selection preregistration must state, as a pre-committed choice, whether tier choice is **scale-only** or **scale + budget**. A Cesium-style controller is the second option: coarsen while the resident tier vertices would exceed `MAX_RESIDENT_VERTICES`. It is admissible under §2f only if every coarsening is visible through `lod.tier_resident` and never reads as completeness at the source. This is the human's choice.
- **Timing:** before `lod-tier-selection`.

### 3.3 Godot visibility ranges and mesh LOD

- **Repo / commit:** godotengine/godot `e7b12e7` (2026-10-07). Latest stable tag `4.7.2-stable`.
- **Licence:** MIT, verified from `LICENSE.txt` and the file headers (`servers/rendering/renderer_scene_cull.cpp:1-30`).
- **Upstream activity:** CI builds on Windows, macOS, Linux, Android, iOS, Web and visionOS (`.github/workflows/*_builds.yml`). Very active.
- **Why it matters:** the only system found with a **true hysteresis band** on the LOD switch, and the clearest statement of swap vs fade as a declared per-instance mode. It also shows how distance-based LOD degenerates for an orthographic camera.
- **How it works:**
  - *Hysteresis.* `_visibility_range_check` (`renderer_scene_cull.cpp:2854-2892`):
    - Offsets start at `begin_offset = -begin_margin` and `end_offset = +end_margin`.
    - **When the fade mode is `DISABLED` and the instance was not visible in this viewport last frame, the signs flip** (`:2861-2864`).
    - Each instance keeps a **per-viewport last-state bitmask** (`viewport_state`, set or cleared at `:2867-2874`).
    - The result is a Schmitt trigger of width 2×margin around each threshold.
    - The docs state it: with `FADE_DISABLED` the margin "acts as a hysteresis distance" (`doc/classes/GeometryInstance3D.xml:78-88`, `:133-135`).
  - *Fades.*
    - `FADE_SELF` fades the instance itself.
    - `FADE_DEPENDENCIES` fades in the dependent (child) LOD while the parent is still drawn (`children_fade_alpha`, `:2875-2887`).
    - Both are **Forward+ only**. On Mobile/Compatibility they "act like FADE_DISABLED but with hysteresis disabled" (`GeometryInstance3D.xml:136-143`).
  - *Automatic mesh LOD.*
    - `mesh_surface_get_lod` chooses the coarsest LOD whose `edge_length × model_scale / distance` ≤ `screen_mesh_lod_threshold` (`renderer_rd/storage_rd/mesh_storage.h:485-503`).
    - The threshold is `mesh_lod_threshold` in pixels / viewport width (`renderer_viewport.cpp:334`; default 1.0, `doc/classes/Viewport.xml:371-375`).
    - **For an orthographic camera `lod_distance = 1.0`** (`renderer_forward_clustered.cpp:1105-1108`), so the choice depends on projection scale only. `lod_bias` multiplies the model scale (`:1129-1131`; doc `GeometryInstance3D.xml:57-60`).
    - The importer forces each LOD's error to grow at least ×1.5 "to limit the switching (pop) distance" (`scene/resources/3d/importer_mesh.cpp:812-815`).
- **Reuse:**
  1. A **per-view last-tier memory with a symmetric margin**: switching to a finer tier needs crossing threshold − margin, and switching back needs threshold + margin.
  2. Treat swap vs fade as a *declared mode*, not an implementation detail.
  3. Borrow the importer's idea that ladder spacing bounds pop distance.
- **Do not reuse:**
  - Per-object distance LOD (Spatial IDE has one uniform view scale).
  - Fades. They require two tiers resident and drawn at once, which double-charges `MAX_RESIDENT_VERTICES` and doubles draw cost on a workload ADR-010 rule 4 already shows is GPU-bound at full extent.
- **Licence implications:** MIT, green; a notice is owed only on a port.
- **Reuse mode:** CONCEPTUAL DONOR (high confidence).
- **Avoided work:** small, but this is the piece most likely to be got wrong (one-sided margins, margin wider than a band).
- **Recommendation:** declare a hysteresis margin **in zoom units** (equivalently log-scale; see §4) as a named constant at its own site, with the Godot sign-flip semantics, and **swap** transitions (`FADE_DISABLED`).
- **Timing:** before `lod-tier-selection`.

### 3.4 MapLibre GL JS `TileManager`

- **Repo / commit:** maplibre/maplibre-gl-js `dc4192c` (2026-10-08).
- **Licence:** BSD-3-Clause, verified from `LICENSE.txt:1-3` and `package.json:7`. It contains mapbox-gl-js ≤1.13 code, also BSD-3 (`LICENSE.txt:32-36`).
- **Upstream activity:** 37 stable npm releases since 2025-10-01.
- **How it works:**
  - *Ideal level.* `coveringZoomLevel` is `round` or `floor` of zoom + log2(tileSize ratio) (`src/geo/projection/covering_tiles.ts:172-178`), with no hysteresis.
  - *Retain logic.* `_updateRetainedTiles` keeps every ideal tile even when unloaded (`src/tile/tile_manager.ts:676-725`). For each one without data:
    - It first retains loaded **descendants**, using the topmost loaded generation within `maxOverzooming = 3` and checking it is complete: 4^Δz children (`:370-445`).
    - Otherwise it climbs to a loaded **ancestor**, up to `maxUnderzooming = 10` (`:97-98`, `:690-722`).
  - *Cancel while zooming.* `cancelPendingTileRequestsWhileZooming` (default true, `src/ui/map.ts:396-402`, `:554`) decides whether still-loading parents from a farther zoom are kept or cancelled.
  - *Removal.* `_removeTile` aborts and unloads a tile that has no data, else moves it to an out-of-view cache (`tile_manager.ts:818-836`).
  - *Fades.* Cross-fades are **raster only** (`:592-595`; `tile_manager_raster.ts:24-55`). Vector tiles get a symbol-fade hold.
  - *Identity across zooms.* Feature state is keyed by (source layer, feature id), independent of tile and zoom (`src/source/source_state.ts:45-50`), so highlight and selection state survive level changes.
- **Reuse:**
  - The "complete coverage" test before a coarser placeholder is dropped. In Spatial IDE this becomes: a tile's tier-k content must be *complete*, not ADR-028-partial, before tier j is released.
  - The explicit cancel-vs-keep-coarser switch as a declared option.
  - Keying UI state by stable id so it survives a tier swap (Spatial IDE's identity order makes this free).
- **Do not reuse:** overzoom/underzoom across a quadtree, and the raster fades.
- **Reuse mode:** CONCEPTUAL DONOR (medium confidence).
- **Avoided work:** small.
- **Recommendation:** adopt the completeness check as a hard rule of the mid-load policy. It interacts with ADR-028's "partiality is a durable property of the resident set" (`ADR-028:84-87`).
- **Timing:** before `lod-tier-selection`.

### Minor donors (sweep-level, read in source)

- **Bevy `VisibilityRange`** (`crates/bevy_camera/src/visibility/range.rs:44-161`, `:230-284`):
  - Start and end margins are ranges; inside a margin the object **dithers** in and out.
  - Adjacent LODs must share margins to crossfade (`:72-78`).
  - There is no last-state memory: `is_visible_at_all` is stateless, so it has **no hysteresis**.
  - Mode: WATCH.
- **three.js `LOD`** (`src/objects/LOD.js:113-134`, `:188-216`, `:255-280`):
  - When a level is visible, its switch distance is reduced by `distance × hysteresis`. This is a one-sided, *fractional* margin.
  - Inference: a fractional margin on distance or scale is an *additive* margin in log-scale, which for Spatial IDE means additive in deck.gl zoom.
  - Mode: CONCEPTUAL DONOR.
- **OpenLayers** (`src/ol/tilegrid/TileGrid.js:652-659`, `src/ol/array.js:86-141`, `src/ol/source/Tile.js:119-125`):
  - Picks a level from an **arbitrary, non-power-of-two resolution ladder**, nearest by default.
  - `zDirection` biases to nearest, lower or higher, and accepts a function. That is a ready hook for custom hysteresis and the closest analogue to a three-entry tier ladder.
  - The queue priority is `65536·ln(resolution) + centre-distance/resolution`, with unwanted tiles DROPped (`src/ol/TileQueue.js:141-169`).
  - Mode: CONCEPTUAL DONOR.
- **QGIS** (`src/core/vector/qgsvectorlayerrenderer.cpp:396-458`; `src/core/qgsmaptopixelgeometrysimplifier.cpp:245-256`):
  - The tolerance is a threshold in **pixels** × `mapUnitsPerPixel`. For Visvalingam, `map2pixelTol *= map2pixelTol` ("Use mappixelTol for 'Area' calculations").
  - Direct precedent: **a VW area threshold is pixel² × (map units per pixel)²**.
  - GPL-2.0-or-later (`COPYING` is GPLv2 and the file headers say "or (at your option) any later version"). Core-combinable copyleft. Concept only.
- **topojson-simplify** (`README.md:116`: "minimum planar triangle area, typically in square pixels"; `src/presimplify.js:44-48`):
  - Enforces **monotonic** effective areas, which geo's epsilon mode does not (§4).
  - ISC. Inactive since 2019. Concept only.

---

## 4. Synthesis: the four questions

### Q1. Selection metric: what rule is natural for a minimum-triangle-area tier key

In Spatial IDE's `OrthographicView` the scale is uniform across the viewport. Every mature metric therefore collapses to **one scalar per view**: pixels per source unit, `p = 2^zoom` CSS px (`frontends/shell/src/canvas/WorkingCanvas.tsx:543-549 @ 4561f3b8`).

- **Cesium:** the orthographic SSE has no distance term: `error/pixelSize` (`Cesium3DTile.js:976-987`).
- **Godot:** an orthographic camera has `lod_distance = 1.0` (`render_forward_clustered.cpp:1108`).
- **deck.gl, MapLibre, OpenLayers:** choose a level from zoom or resolution alone.

So selection is **per view**, not per tile or per feature. One tier choice holds for the whole viewport, and per-tile variation arises only transiently while loading (Q2).

**Inference:** the tier key is an *area*, so the natural screen unit is **CSS px²**, not px. Tier k's threshold A_k projects to `A_k · p² = A_k · 4^zoom` px². Precedents:
- QGIS squares its pixel tolerance for Visvalingam (`qgsmaptopixelgeometrysimplifier.cpp:247`).
- topojson documents VW thresholds "typically in square pixels".
- Cesium's length-based SSE is the right analogue for an RDP *length* tolerance, not for a VW area.

**The rule, in Cesium's form:** draw the **coarsest tier whose projected minimum triangle area is ≤ τ px²**, with τ a declared value; tier 0 (the source) applies when none qualifies. Equivalently, tier k is admissible while `zoom ≤ z_k = ½·log2(τ / A_k)` (A_k in source units², after the §2c conversion). The tier boundaries are therefore fixed zoom thresholds:
- Ladder ratios 10× (0.1 → 1.0) and 5× (1.0 → 5.0) put adjacent thresholds ½·log2(10) ≈ 1.66 and ½·log2(5) ≈ 1.16 zoom levels apart, whatever τ is. This is arithmetic, not a measurement.
- **No value of τ is proposed here.** It is a declared value the selection preregistration owes (ADR-010 rule 6).
- It must state CSS vs device pixels. The shell already declares CSS (`frontends/shell/src/canvas/WorkingCanvas.tsx:544-548 @ 4561f3b8`), while Cesium divides out `pixelRatio` (`Cesium3DTile.js:1001`).

**Caveat (inference from `geo-0.33.1/src/algorithm/simplify_vw.rs:60-73`):** with a user epsilon, geo removes any triangle whose *current* area is below epsilon and recomputes its neighbours **without** the monotonic "use the previous eliminated area" rule. topojson does apply that rule (`presimplify.js:44-48`). So A_k bounds each single removal step, not the cumulative change from the source. The visible difference between tier k and the source at the switch zoom is therefore **not bounded by τ by construction**, and needs its own preregistered measurement (e.g. per-feature symmetric-difference area in px² at z_k). The spike and preregistration measured validity and vertex reduction, not visual deviation.

### Q2. Hysteresis and stability; behaviour mid-load

**Hysteresis**
- **Only Godot has a true band.** It keeps a per-viewport last state, and the margin sign flips (Schmitt trigger, `renderer_scene_cull.cpp:2861-2874`).
- three.js has a one-sided fractional margin.
- deck.gl, MapLibre, OpenLayers and Cesium 3D Tiles have **no band**. They rely on load-gated refinement, debouncing (deck.gl `debounceTime`, Cesium `cullRequestsWhileMoving`) and, in Cesium terrain, last-frame memory that refuses to lose visible detail (`QuadtreePrimitive.js:815-822`).
- **Recommended shape for Spatial IDE:** a declared margin `m` in zoom units, with switching thresholds `z_k ± m` depending on the last tier.
  - Inference from Q1: the margin must stay below half the narrowest band (≈ 0.58 zoom levels for the 5× step), or the bands overlap and a tier can be skipped or stick.
  - The shell already has a 120 ms query debounce (`frontends/shell/src/streaming/viewportStreamManager.ts:25 @ 4561f3b8`) that acts as a minimum dwell for requests. A separate dwell for *tier* changes would be redundant unless measured otherwise.

**Mid-load**

| Donor | Behaviour while the wanted level loads |
|---|---|
| deck.gl `no-overlap` | Never draws two levels over each other |
| Cesium base traversal | Refines only when every replacement is loaded |
| MapLibre | Keeps the coarser placeholder until a complete covering generation exists |
| deck.gl `best-available` | Shows whatever is loaded nearest, including finer content |
| Cesium skip-LOD / `immediatelyLoadDesiredLevelOfDetail` | Trade continuity for fewer intermediate loads |

For Spatial IDE, inference:
- Residency becomes keyed by **(tile, tier)** over the unchanged ADR-028 grid.
- While the desired tier changes, a tile keeps its old-tier content until its new-tier content is **complete**. Content that is ADR-028-partial does not qualify.
- The swap is then per tile and atomic (`no-overlap`). Consequences the preregistration must declare:
  - **(a) Mixed-tier views.** Tiles can show different tiers at once, so **`lod.tier_resident` must be able to name a set or range of tiers**, not one tier.
  - **(b) Double residency.** During a swap both tiers' vertices for a tile are resident and both are charged to `MAX_RESIDENT_VERTICES` (§2f forbids a second budget).
  - **(c) Supersede.** A tile whose desired tier changed is "superseded" in a new sense. Today an out-of-view supersede drops residency entirely (`frontends/shell/src/residency/candidateArmSession.ts:881 @ 4561f3b8`), so a **distinct supersede reason** ("tier-superseded, keep until replaced") is needed. It parallels the existing distinct lever-dropped reason (`frontends/shell/src/streaming/tileViewportStreamManager.ts:241-255 @ 4561f3b8`).

### Q3. Transitions; identity across levels

**Swap is the norm for vector geometry:**
- deck.gl `TileLayer` has no fade (`tile-layer.ts:394-440`).
- Cesium 3D Tiles: no fade or dither found in `Cesium3DTile.js` / `Cesium3DTileset.js`.
- Godot `FADE_DISABLED`; three.js.

**Cross-fade appears in:**
- Godot `FADE_SELF` / `FADE_DEPENDENCIES` (Forward+ only).
- Bevy's dithered crossfade.
- MapLibre and OpenLayers **raster** tile fades only.

A fade needs both tiers resident and drawn. In Spatial IDE that doubles the per-vertex cost §2f charges, and semi-transparent fills of the same feature would double-blend; dithering avoids the blend but not the cost. **Swap is the natural choice.** Godot's importer keeps the pop small through ladder spacing (×1.5 minimum error growth), and Spatial IDE's ladder spacing is already declared.

**Identity:** Spatial IDE's tiers keep source identity order and ids (§2d), so cross-tier swaps preserve feature identity by construction. This is the property MapLibre gets by keying feature state by id (`source_state.ts:45-50`) and that Cesium 3D Tiles does not guarantee across levels. Selection and highlight state keyed by stable id survive a swap.

**Hazard found in the shell (not in a donor):** the hover/pick **anchor is the resident batch's first exterior vertex** (`frontends/shell/src/canvas/pick.ts:11-14 @ 4561f3b8`, `:141`).
- Inference from `simplify_vw.rs:105-113`, `:322-326`: VW only ever removes interior vertices (triangles are indexed at `i + 1`), so ring vertex 0 survives simplification, and the anchor would equal the source's.
- That is an **algorithmic accident**, not a contract. Tiers are "never authoritative for … picking" (§8 item 6).
- The selection piece must either resolve anchors from tier 0 by stable id (ADR-010 rule 2's indirection) or preregister that reliance with a test and a mutation.
- Related: `isBelowPickResolution` would compute the average feature extent from tier geometry (`frontends/shell/src/canvas/pickResolution.ts:204-206 @ 4561f3b8`). Its interaction with tier selection is unexamined.

### Q4. Cancellation, queueing and caching

**Donor patterns:**
- **Cancel queued work lazily by re-evaluated priority.** In loaders.gl, priority < 0 means cancel, evaluated when a slot frees (`request-scheduler.ts:203-229`). In Cesium, every `update()` re-sorts the heap and a full heap cancels the lowest (`RequestScheduler.js:277-336`, `:384-437`).
- **Abort in-flight work no longer wanted.** deck.gl does it only under slot pressure (`_pruneRequests`); Cesium does it whenever a tile was not touched this frame (`cancelOutOfViewRequests`); MapLibre does it on `_removeTile` of a data-less tile.
- **Discard late results** by loader id (deck.gl) or `RequestState.CANCELLED` (Cesium `:192-205`).
- **Priority order.** Every donor puts currently wanted tiles before placeholders (deck.gl `0` vs `1e8`). Within a class the order is distance to the view centre (deck.gl since 2026-06; OpenLayers; Cesium for non-skip). Cesium optionally runs coarse-first (`progressiveResolutionHeightFraction`).

**Spatial IDE already has:** slots (3), a bounded queue (512), nearest-first ordering and per-tile supersede-with-cancel. That is roughly deck.gl 9.4 + Cesium `cancelOutOfViewRequests`, under ADR-018's measured cancel semantics.

**What tier selection adds:**
1. A **tier dimension in priority.** For example, desired-tier tiles first and placeholder-tier tiles second, as in deck.gl; or Cesium-style coarse-first. That is a declared choice.
2. **Cancel-on-tier-change.** An in-flight stream for a tier no longer wanted is cancelled *unless* it is the only content that will cover that tile. MapLibre's `cancelPendingTileRequestsWhileZooming` names this exact trade-off; it should be a pre-committed choice, not a default.
3. **Tier not yet built.** The lifecycle ruling makes building a background prepare operation. Selection must treat a missing or `TierMiss` tier as a declared fallback (e.g. nearest built tier, else tier 0 under ADR-028's partial-view contract) and never wait on a build. "Basic Save never waits for LOD" (`PLAN.yaml:850 @ 4561f3b8`).

**Cache:** Cesium's sentinel LRU and deck.gl's "5 × selected" are render-cache policies. Spatial IDE's residency eviction is already distance-ordered under a vertex budget (ADR-028), and the tier *file* cache lifecycle is ruled separately (`PLAN.yaml:832 @ 4561f3b8`). Nothing more to borrow here.

---

## 5. "Do not reinvent" and "worth owning"

**Do not reinvent**
- *Spatial IDE should not invent its own mid-load vocabulary* because deck.gl `Tileset2D` already defines and tests `best-available` / `no-overlap` / `never` (MIT, `tileset-2d.ts:38-57`, `:675-737`; tests `tileset-2d.spec.ts:468`), unless a requirement emerges for placeholders that are not tier-adjacent.
- *Spatial IDE should not design hysteresis from scratch* because Godot's visibility-range check already gives a symmetric margin with per-viewport last-state semantics (MIT, `renderer_scene_cull.cpp:2854-2892`), unless the selection piece needs a time-based dwell, which no donor implements as a band.
- *Spatial IDE should not invent the screen unit for a VW-area tier key* because QGIS (GPL-2.0-or-later, concept only) and topojson-simplify (ISC) already use area in px² for Visvalingam, and Cesium's orthographic SSE (Apache-2.0) gives the scale-only form. This holds unless the tier key is ever changed to a length (RDP), in which case Cesium's length SSE applies directly.
- *Spatial IDE should not take `@deck.gl/geo-layers` or loaders.gl `RequestScheduler` as dependencies* to get the above. It already owns an equivalent stream manager. geo-layers is 2.6 MB with 17 deps. The loader-utils version in its lockfile (4.4.4) has the debounce-restart defect fixed only on loaders.gl master (`d1d2cc0`, 2026-09-29; not in 4.5.3). Dependencies are the human's decision.

**Worth owning (Spatial IDE should own these, borrowing the named pieces)**
- **The selection function:** tier = f(scale, τ, margin, last tier, built tiers), as one pure, unit-testable function at its own site, with τ and the margin declared. It borrows Cesium's orthographic SSE form, Godot's margin semantics and OpenLayers' "nearest in an arbitrary ladder with a direction bias".
- **The (tile, tier) residency extension:**
  - The completeness rule before release (MapLibre).
  - The distinct tier-supersede reason.
  - Double-residency accounting under the single `MAX_RESIDENT_VERTICES`.
  - `lod.tier_resident` able to name mixed tiers.
- **Optionally, a budget-coupled coarsening controller (Cesium-style),** visible through `lod.tier_resident`. The human decides whether it exists at all.
- **Pick-anchor routing to tier 0 by stable id,** or a preregistered test of the endpoint-preservation reliance.

---

## 6. Could not verify

- Whether any of these donors measured flapping or pop with or without their margins. No benchmark was read, and none would transfer to Spatial IDE (METHOD rule 5).
- Cesium 3D Tiles: I found no SSE hysteresis in the traversal files read. Other parts of the engine (e.g. `Cesium3DTilesetMostDetailedTraversal.js`, imagery layers) were not read. The documented production users of all candidates were not checked.
- Whether `geo` 0.33.1's VW-preserve always keeps ring vertex 0 for every input path. This was inferred from `visvalingam_indices` and `visvalingam_preserve` (`simplify_vw.rs:105-113`, `:288-330`), not tested. Also not checked: whether the `MIN_POINTS` / `INITIAL_MIN` guards (`:616-626`) or `geo_traits` conversion can reorder ring starts.
- Whether `viewport_query` can target a tier file at all, and whether a tier needs its own spatial index (`engine/src/index.rs`), was not examined; it belongs to the engine side of the selection piece.
- PR #190 (`pr190`) has no merge base with `4561f3b` in this clone. Its file list contains the same LOD files, but I did not diff them for selection-relevant changes.
- Bevy and three.js history (why Bevy chose no hysteresis) was not read. GitHub issues and PRs are not reachable here.
- The QGIS default simplification threshold value was not read (only the setter and getter in `qgsvectorsimplifymethod.h:52-55`).


## Errata from the independent check (2026-10-08)

- VERIFICATION-B row 3: the shell's pick anchor is the first vertex of the **picked feature's** first part's exterior ring (`frontends/shell/src/canvas/pick.ts:11-14 @ 4561f3b8, :130-132, :139-141`), read from that feature's copy in the resident batch — not the first vertex of the batch. The hazard stands: the anchor is read from resident (possibly simplified) geometry.
- VERIFICATION-B row 20 (**WRONG** in these notes): the `RequestScheduler` debounce fix is in loaders.gl **v4.5.3** too (cherry-picked as `83b4f53f8`; published `loader-utils@4.5.3` `request-scheduler.ts:143-146`). Only 4.4.4, which the shell's lockfile carries, has the defect.
