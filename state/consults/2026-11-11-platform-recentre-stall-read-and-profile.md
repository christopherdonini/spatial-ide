*Custodian's filing note (2026-11-11): a Claude Platform session's report, filed as a consult under the human's direction of 2026-11-11 (17:40Z) (`state/directives/2026-11-11-seven-platform-runs-read-hourly-filed-as-consults-307-review-into-its-gate-round-stall-report-beside-the-reads.md`, line 7); a reading and not Authority. Provenance: the human's advisory folder for this project, `PLATFORM-RUNS-2026-11-11/RECENTRE-STALL-READ-AND-PROFILE-2026-11-11.md` (46172 bytes, sha256 8b7dc0282bade46ee975004a128cd7b7e28ad2cedf7510fb2d43b67cf9658043; modified 2026-11-11T22:25:17Z; the folder holds no index file at this reading): session sesn_01CNeGbhScgbS9vEKnaqdb8k, agent spatial-ide-flake-hunter (claude-opus-5-5, effort high; system prompt overridden by the advisor for this task), US$ 6.18, about 962 s active. The file's own provenance paragraph, the advisor's, comes first under its title; below the rule the file is unchanged, byte for byte. It read and ran parts of main at 572416aa73b1c0f2aaa479ad3476a4829c14d26a in a Linux sandbox with no browser, GPU or WebView2; its timings claim nothing about Windows, its own words say. From 572416aa to main at 8b5e3d21, 8 commits changed no file outside state/, governance/ and site/ (by git diff --name-only), so its readings of product, docs and KNOWN-LIMITATIONS files hold at this filing; its readings of governance and state records are read again before any node rests on them. By that direction it goes beside the architect's read (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-main-thread-consult-architect.md`) and the measure-build reading (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-measure-worker-report.md`) for the human's grade. It landed after the human graded the diagnostic at 21:49Z (item 5 of `state/directives/2026-11-11-adr-035-item-2-arm-stands-1c-open-20-1-a-21-1-b-21-3-a-diagnostic-graded-pan-anchor-released-s1-candidate-origin-move-reproducer.md`), so it is put to the human as a reading to weigh on return; nothing here regrades.*

---

# Re-centring stall: read and profile in a sandbox, 2026-11-11

Provenance. An independent agent on the Claude Platform (claude-opus-5-5, effort high; agent `spatial-ide-flake-hunter`, system prompt overridden by the advisor for this task) cloned the public repository in a fresh sandbox and worked at the commit its first lines name (origin/main was 572416aa when the run started). It changed nothing outside its sandbox, pushed nothing, opened nothing. The advisor started the run through the platform API at the human's request (session sesn_01CNeGbhScgbS9vEKnaqdb8k) and fetched the agent's messages verbatim, in order, separated by rules; run figures from the session record: about 962 s active, US$ 6.18, last stop reason end_turn. Nothing below this line is edited.

---

Commit checked out: 572416aa73b1c0f2aaa479ad3476a4829c14d26a (head of main, 2026-11-11 18:04 +0100).

I couldn't find 19 seconds of work. The parts of the re-centre path I could run cost about 0.65 s per re-centre in this sandbox, and the run itself (or the reports) still has to supply the missing ~25×.

**What runs at a re-centre** (read from code):
- **The trigger.** When a drag ends past the bound, or `e2eSetViewState` moves the origin, the next synchronous `render()` rebuilds a new `[x,y]` array for every resident vertex (`frontends/shell/src/canvas/buildLayers.ts:144,159-161 @ 572416aa`).
- **The deck frame after it.** deck.gl then re-tessellates every layer and regenerates and re-uploads all its buffers, with positions in fp64. The cost scales with all resident vertices (1,885,130 for this fixture), not with what is on screen.
- **Release vs DEV.** All of this ships in the release build. Only `e2eSetViewState` itself is DEV-only (`WorkingCanvas.tsx:2320`). It uses the same steps as the release "Zoom to layer", so a release build pays the same cost when "Zoom to layer" moves the origin.

**Measured here** (Linux VM, Xeon 2.1 GHz, 4 cores, 15 GiB, Node v22.22.0; medians of 5–7 runs; none of this is a claim about Windows):

| Step | medium tiles | fine tiles |
|---|---|---|
| Rebuilding positions at the new origin (`buildLayers`, cache miss) | 174 ms | 148 ms |
| Same call, origin unchanged | 0.3 ms | 0.85 ms |
| Vertex walk that runs on every `render()` | 58 ms | 68 ms |
| deck.gl's own polygon tessellator, all layers | 476 ms | 412 ms |
| Re-centre arithmetic | ≈56 ns per call | ≈56 ns per call |
| Tile cover for the suite's camera positions | ≤0.72 ms | — |
| Real tile manager re-planning 515 tracked tiles | 6–11 ms | up to 20 ms |

- **Synthetic data.** I ported the fixture generator exactly rather than guessing a parcel distribution. It reproduces the 1,885,130-vertex total the repository records.
- **Killed as causes.** The re-centre arithmetic, tile assignment and the tile planner are far too cheap to matter.

**Ranked candidates for 19 s:**
1. **Re-centre rebuild plus deck's frame after it.** The trigger is read from code; the CPU part is measured; the 19 s size is a hypothesis.
   - **For it:** four of the long gaps come one heartbeat after a ~0.7 s gap, about what I measured for the rebuild plus tessellation, and they fall at the re-centring drags and the resets after them.
   - **Against it:** about 25× is missing. Two gaps (g8, 6 s; g16, 18 s) fall at resets that, by my reading, don't move the origin.
2. **WebView2's GPU process holding up the page thread** while about 10² MB of buffers are re-uploaded. This would supply the missing factor. Hypothesis; I had no GPU to test it.
3. **Garbage collection pressure.** Seven rebuilds here caused 56 GCs, about 0.39 s in total. A page heap near its limit would make this much worse (hypothesis).
4. **Draining 515 mostly empty tile queries after each big camera move.** 515 ÷ 3 × ~110 ms ≈ 19 s is a suspicious match, but the per-tile page work I read is small and async.
5. **Bursts of synchronous `render()` calls.** Each costs about 60 ms even when nothing moved, but I found no loop that would make the ~300 calls 19 s needs.

**What the dev build adds** on this path, as far as the code shows: nothing on the rebuild path differs between dev and release. The DEV-only `capturePixels` adds a forced layer update and a full-frame `readPixels` inside the suite's `waitForFill`, but not in the recentre-crossing cases. React StrictMode doesn't touch `render()`, and the code is just unminified.

**Three smallest observations on Windows to confirm or kill candidate 1:**
1. **Timer:** log `performance.now()` at the existing `begin`/`end("layer-construct")` around `render()` (`WorkingCanvas.tsx:1333,1360`). About 0.5–1 s at re-centres and about 60 ms elsewhere confirms the trigger. The existing watchdog can't see a stall like this, because its timer runs on the same thread.
2. **Counter:** read deck's `metrics.updateAttributesCount` and `updateAttributesTime` before and after one recentre-crossing drag. A count jump with a small time means the missing factor sits in the GPU or GC, not deck's CPU work.
3. **Log line:** check the timestamps of the existing `[render-trace] layers` line (with `totalPositions` ≈ 1.88M) against the gap edges. Rerunning with a 10k-feature fixture also splits the candidates: if the gap shrinks about 10× it is 1–3; if it stays near 19 s it is 4 or something unknown.

**Gaps and departures:**
- **`npm ci`:** a plain run failed here under npm 10.9.4 (lock file "Missing: esbuild@0.28.2"); the repository names npm 11+. `npm ci --legacy-peer-deps` installed cleanly.
- **renderer/:** I didn't run `npm ci` there. The shell imports `renderer/style-ts` by path, but that package has no runtime dependencies, and none of the benchmarks needed it.
- **Not executed:** the batch decoder, deck's attribute fill, GPU upload and draw, React, the WebSocket and Tauri traffic, and the suite itself. The heartbeat instrument patch isn't in the repository, so I couldn't check exactly what it measures.

The report has the full step-by-step table and a `path:line @ 572416aa` citation for every claim.

Files are in `/mnt/session/outputs/`:
- REPORT.md
- bench/fixture.ts
- bench/bench.ts
- bench/manager.test.ts
- bench/results-medium.json
- bench/results-fine.json
- bench/manager-results.json

-----

Commit checked out: 572416aa73b1c0f2aaa479ad3476a4829c14d26a (head of main, 2026-11-11 18:04 +0100). All citations are `path:line @ 572416aa`.

**Resume note.** The run was stopped by the usage limit after this report and its benchmark files had been written. On resuming I checked the sandbox and it still held everything: the clone at the same commit, `/tmp/bench`, and `/mnt/session/outputs`. I redid nothing. The report below is the one written before the stop. The run used well under the US$27 guide.

=== FILE: REPORT.md ===
# What runs on the page's main thread at a re-centre, and where 19 seconds could come from

**Labels.** [E] means I ran it in this sandbox. [R] means I read it in the code. [H] is a hypothesis.

**Machine.** Linux VM, kernel 6.18, x86_64. Intel Xeon @ 2.10 GHz, 4 cores, 15 GiB RAM. Node v22.22.0, npm 10.9.4. Every duration below was measured on this sandbox only. None of them is a claim about the product on Windows/WebView2.

**What I could not run.** No browser, no WebGL/GPU, no Tauri, no React, no WebSocket, and not the e2e suite. I ran the pure functions and two pieces of the deck.gl CPU path (layer construction and `PolygonTesselator`). I did not run deck's attribute generation, GPU upload, draw, or frame loop.

## Summary

- **The trigger.** A re-centre moves the frame origin. On the next `render()`, the shell then re-builds a nested `[x,y]` array for every resident vertex. deck.gl then re-tessellates every layer and regenerates and re-uploads every layer's buffers. The work is proportional to all resident vertices (1,885,130 for this fixture). It is not proportional to what is on screen. [R]
- **The cost here.** The CPU parts I could run add up to about 0.65 s per re-centre on this sandbox [E]:
  - re-basing: 0.15–0.17 s
  - the per-render vertex walk: 0.06–0.07 s
  - deck's tessellator: 0.41–0.48 s
- **That is not 19 s.** About 25× is missing. It would have to come from what I could not run: deck's attribute regeneration and GPU upload, the WebView2 GPU process, GC pressure, or something not yet found [H].
- **Killed as causes.** The re-centre computation, tile assignment and the tile planner are each far too cheap. The real `TileViewportStreamManager.onCameraChange` took 6–20 ms even when it pruned and re-planned 515 tracked tiles [E].
- **Not explained by the re-centre.** Two of the long gaps (g8: 6 s; g16: 18 s) fall at camera resets that, by my reading, do not move the origin.

## Setup notes

**npm ci.**
- A plain `npm ci` in `frontends/shell` failed here [E]. npm 10.9.4 reported `Missing: esbuild@0.28.2 from lock file`. That package is an optional peer of the nested `vite-node/node_modules/vite` 8.3.0 (`frontends/shell/package-lock.json:3993-4040 @ 572416aa`).
- The repository names Node 24 / npm 11+ (`CLAUDE.md:29 @ 572416aa`). I did not install a different npm.
- `npm ci --legacy-peer-deps` succeeded: 196 packages, `@deck.gl/core` 9.3.9 [E].

**renderer/.**
- The shell imports `renderer/style-ts` by source path (`frontends/shell/src/style/document.ts:41 @ 572416aa`; type-only in `frontends/shell/src/canvas/buildLayers.ts:7 @ 572416aa`). That package has no runtime dependencies (`renderer/style-ts/package.json`).
- `renderer/bundle-viewer` is only needed by the build (`frontends/shell/scripts/buildViewerFirst.mjs:25-33 @ 572416aa`).
- So I did not run `npm ci` in renderer/, and no benchmark needed it.

**Synthetic data: what I assumed.**
- I did not invent a parcel distribution. I ported the fixture generator exactly:
  - `SplitMix64`: `engine/src/fixture.rs:736-752 @ 572416aa`
  - `parcel`: `engine/src/fixture.rs:1404-1433 @ 572416aa`
  - `ring`: `engine/src/fixture.rs:1683-1695 @ 572416aa`
  - default seed: `engine/src/fixture.rs:685-686 @ 572416aa`
  - the 100k spec (100,000 features, `avg_vertices: 18`, `hole_every: 7`): `kernel/tests/manual_walkthrough_fixtures.rs:44-55 @ 572416aa`
- The shape that follows: outer rings of 9–27 vertices (uniform), and every 7th parcel has a hole of max(⌊n/3⌋, 4) vertices.
- The port produces **1,885,130 vertices** [E]. That is exactly the total recorded at `kernel/tests/manual_walkthrough_fixtures.rs:77 @ 572416aa`.

Assumptions beyond the generator:
- **(a) First look.** The untiled first look is the first 10,000 rows in file order (`frontends/shell/src/canvas/tileGridConstants.ts:185 @ 572416aa`). This gives a tile frame with a 25,346 m base span. A medium cell is then 1,584 m; a fine cell is 792 m.
- **(b) Tiles.** A tile returns every feature whose bbox meets the tile. Duplicates go through the real `TileResidentSet.addBatch`.
- **(c) Batches.** Batches are cut as the engine does: 64 KiB first, ×4 per batch, up to 1 MiB (`engine/src/stream.rs:49-71 @ 572416aa`), at about 16 B per vertex.
- **(d) Level.** I tested medium, the default (`frontends/shell/src/canvas/tileGridConstants.ts:35 @ 572416aa`), and fine.
- **(e) No outline.** I assumed `outlineWidth` 0. An outline would double the layers per batch (`frontends/shell/src/canvas/buildLayers.ts:501-514 @ 572416aa`).

Result of that shaping:
- medium: 84 data tiles, 181 resident batches
- fine: 287 data tiles, 485 resident batches

## (1) The path, step by step [R unless marked]

The candidate (tiled) arm is the default (`frontends/shell/src/residency/residencyArm.ts:50 @ 572416aa`). `render()` therefore reads `TileResidentSet` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1099-1101 @ 572416aa`). In the table:
- V is the number of resident vertices; B is the number of resident batches (= SolidPolygonLayers); T is the number of tracked tiles.
- **Ships?** says whether the step is in the release build or exists only in DEV.
- WC means `frontends/shell/src/canvas/WorkingCanvas.tsx`.

### A. A pan that crosses the re-centring bound

| # | Step (where) | Ships? | Cost | Repeated |
|---|---|---|---|---|
| A0 | Each drag tick: `onViewStateChange` (WC:2077-2147). It re-evaluates the hover (2097), re-arms the re-pick timer (2098), and calls `setThreshold(recenterThresholdForBudget(...))` (2100; `frontends/shell/src/canvas/offsetFrame.ts:84-91 @ 572416aa`). It logs `traceViewState` with `console.debug`, always on (WC:2101; `frontends/shell/src/diagnostics/renderTrace.ts:52-53 @ 572416aa`). It skips the re-centre while `isDragging` (WC:2127). It ends with `reportViewport` (WC:2136-2146), which goes to the session's debounced `onViewportChanged` (`frontends/shell/src/residency/candidateArmSession.ts:1625-1631 @ 572416aa`). | release | O(1) | per tick |
| A1 | The trailing `isDragging:false` tick: `maybeRecenter` (`frontends/shell/src/canvas/offsetFrame.ts:166-173 @ 572416aa`). At zoom −7 the threshold is min(131,072, 0.5/(2⁻²⁴·2⁻⁷)) = 131,072 m. A 1,200 px drag is 153,600 m, so it crosses [E]. Then `toLocal`, `setProps({initialViewState})` and a **synchronous `render()`** (WC:2131-2133). | release | O(1) + A2 | once per gesture |
| A2 | `render()` (WC:1330-1363). `getBatches` (`frontends/shell/src/canvas/tileResidentSet.ts:155 @ 572416aa`) is O(B). Then `buildLayers` (`frontends/shell/src/canvas/buildLayers.ts:377-517 @ 572416aa`): `geometryForBatch` misses its cache for **every** resident batch, because the origin no longer matches (`buildLayers.ts:144`). It allocates a new `[x,y]` array per vertex via `frame.toLocal` (`buildLayers.ts:159-161`). This is the only "re-encoding relative to the new centre". `offsetPositions`/`toF32Positions` are not on this path (`frontends/shell/src/canvas/offsetFrame.ts:18-24 @ 572416aa`). It builds a new `SolidPolygonLayer` per batch (`buildLayers.ts:463-471`). Then `buildHighlightLayers` (WC:1348), `deck.setProps({layers})` (WC:1350), and `averageFeatureExtent`, which walks **every resident vertex on every render**, cache or no cache (WC:1358; `frontends/shell/src/canvas/pickResolution.ts:90-117 @ 572416aa`). | release | O(V) allocations + O(V) walk + O(B) layers | per re-centre (the re-basing); per render (the walk) |
| A3 | After the debounce (`frontends/shell/src/streaming/debounce.ts:35-42 @ 572416aa`), as a separate task: `handleViewportChange` (`frontends/shell/src/residency/candidateArmSession.ts:1465-1621 @ 572416aa`), then `onCameraChange` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:511-668 @ 572416aa`). That runs: the cover (`frontends/shell/src/canvas/tileGrid.ts:345-381 @ 572416aa`), a key `Set`, `coverMembershipFor` (`tileGrid.ts:446-469`), and a prune over the tracked tiles with an O(Q) `queue.filter` per queued tile (`tileViewportStreamManager.ts:571-592`, 574). An in-flight tile that leaves the view is cancelled, then `onTileSuperseded`, then `clearTile`, then a **synchronous `render()`** (`candidateArmSession.ts:956-967`; WC:1794-1797). New candidates are truncated to 3 + 512 (`tileViewportStreamManager.ts:627`; `frontends/shell/src/canvas/tileGridConstants.ts:40,54 @ 572416aa`). Then `applyTileViewportContext` (WC:1834-1902), `emitResidencyStatus`, and a React `setState` (`frontends/shell/src/App.tsx:1638-1643 @ 572416aa`). | release | O(T + Q² + cover) + up to 3×(A2 without re-basing) | per settled camera change |
| A4 | The next animation frame, inside deck. `updateLayers` runs because every layer has `dataChanged`, so `SolidPolygonLayer.updateGeometry` calls `PolygonTesselator`, which runs earcut per polygon (`@deck.gl/layers` 9.3.9 `dist/solid-polygon-layer/solid-polygon-layer.js:207-236`). Then every attribute is regenerated: indices, `vertexPositions` as **fp64** (`use64bitPositions()` is true for `'cartesian'`, `@deck.gl/core` 9.3.9 `dist/lib/layer.js:235-240`), vertexValid, and per-vertex `pickingColors`. Then GPU re-upload and draw. | release (same library code; only minified) | O(V) CPU + O(V) bytes uploaded | per re-centre, per layer |
| A5 | Refetch. The re-centre itself refetches nothing: residency does not depend on the origin. The camera move plans new tiles, though. At −7 the cover is 1,316 medium cells (small window) or 4,416 (large), of which 84 hold data [E]. That leaves 515 tiles tracked [E], each one an engine query plus its own WebSocket (`frontends/shell/src/streaming/adapterWs.ts:39 @ 572416aa`), drained 3 at a time. | release | async; small per-tile main-thread work | per tile |

### B. `e2eSetViewState` (WC:2319-2357)

**DEV only.** It is gated by `if (!import.meta.env.DEV) return` (WC:2320). In order:

1. Hover re-evaluate and re-pick arm (2335-2336).
2. **`forceRecenter(targetX, targetY)`, unconditional** (2338).
3. `setThreshold` (2339), `traceViewState` (2340), `setProps({initialViewState})` (2343).
4. A **synchronous `render()`** (2344). This is A2.
5. `reportViewport(bboxForFit(...))` (2345). This leads to A3, and then A4 on the next frame.

When does it re-base? `pan-anchor.mjs` always passes the dataset centre (`frontends/shell/e2e/pan-anchor.mjs:50,226,238,258,271 @ 572416aa`). So the cache misses, and A2 re-bases everything, only when the previous drag had re-centred:
- at the setCam after each `recenter-crossing` drag
- at the next size's first setCam

It uses the same primitives as the release build's `fitToExtent` / "Zoom to layer" (WC:1396-1429). A release build re-bases the same way when "Zoom to layer" moves the origin.

## (2) Executed timings (this sandbox only; vite-node / vitest, `performance.now()`)

Medians over 5–7 runs. The raw runs are in `bench/results-*.json`.

| What (function, real repo code unless noted) | medium (181 batches) | fine (485 batches) |
|---|---|---|
| `setThreshold`+`maybeRecenter`, ×1,000,000 | 55.8 ms (≈56 ns/call) | 57.8 ms |
| `tileCoverForBbox`+key Set+`coverMembershipFor`+membership over resident keys, per pose | 0.03–0.72 ms | — |
| Real `TileViewportStreamManager.onCameraChange`, 515 tracked, transport mocked: centre −7 → +153.6 km (the drag) | 9.7 ms small / 11.3 ms large | 10.6 / 20.3 ms |
| same: far −7 → centre −1 (the setCam) | 7.9 / 8.4 ms | 7.1 / 8.5 ms |
| same: centre −6.5 → centre −1 | 7.4 / 7.4 ms | 5.9 / 7.3 ms |
| `TileResidentSet.addBatch`, the whole dataset (sum) | 124.5 ms (median 0.35 ms per batch) | 120.9 ms |
| `buildLayers`, cache **hit** (no origin move) | 0.31 ms | 0.85 ms |
| `buildLayers`, cache **miss** (origin moved = re-centre re-basing) | **174 ms** | **148 ms** |
| `averageFeatureExtent` (runs on every `render()`) | **58 ms** | **68 ms** |
| `render()` equivalent on a cache hit (getBatches + buildLayers + extent) | 57 ms | 58 ms |
| deck.gl `PolygonTesselator.updateGeometry`, all layers, fp64, normalize (deck's own code) | **476 ms** | **412 ms** |
| Proxy, NOT deck code: an f64→f32 hi/lo split per vertex, allocating per ring (a crude upper bound on fp64 attribute fill) | 618 ms | 628 ms |
| GC across the 7 cache-miss runs (PerformanceObserver) | 56 GCs, 394 ms total, max 95 ms | 56 GCs, 379 ms, max 113 ms |
| Node `heapUsed` before → after the miss runs (includes the generator's own copies) | 530 → 1,087 MB | 539 → 1,089 MB |

Where the 515 comes from: every large camera move in the suite leaves T = 3 in flight + 512 queued. The small window at −7 covers 1,316 cells (medium) and the large covers 4,416, against 84 data tiles; at fine the large covers 17,408 [E].

## Where 19 s could come from, ranked

The quiet run's long gaps were 5,967, 19,377, 19,344, 20,308, 2,488, 18,126 and 18,957 ms (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md:232-238 @ 572416aa`). Four of the ~19 s gaps come one heartbeat tick after a ~0.7 s gap:
- g9→g10: ticks 612→613
- g11→g12: 632→633
- g13→g14: 638→639
- g17→g18: 1123→1124

(`...-quiet-worker-report.md:248-257 @ 572416aa`)

**1. A re-centre re-bases all resident geometry, and deck then rebuilds every layer (A2 + A4).**
- **Status:** the trigger is [R]; the CPU portion is [E], ≈0.65 s here; the 19 s magnitude is [H].
- **For it:**
  - The long-gap windows match the re-centre events: drags #13, #15 and #28 at −7 by ±1,200 px, and the setCams #14, #16 and #29 that follow them.
  - The ~0.7 s companion gaps are the size of what I measured for A2 + tessellation.
  - The last crossing drag (#30) was followed by a page that did not answer a 15 s collection evaluate (`...-quiet-worker-report.md:162-169 @ 572416aa`). That fits a gap that was still open and so never reported. This is an inference [H].
  - The cost does not depend on window size. Neither do the gaps: about 19 s in both sizes.
- **Against it:**
  - About 25× is missing.
  - g16 (setCam#24) and g8 (setCam#9) go from −6.5 to −1 with no origin move by my reading. setCams #20/#22 and #5/#7 had already put the origin at the centre.
- **Caveat on the windows:** the node assigns gaps to windows by its own clock, and that clock waits on the page. The labels may be shifted by one step.

**2. The multiplier for #1 comes from the WebView2 GPU process [H].**
- After a re-centre, deck re-uploads every buffer: fp64 positions split into high and low halves, 32-bit indices, and picking colours, for 1.885M vertices. That is on the order of 10² MB [H].
- When the GPU process is slow, the renderer's main thread can wait on command-buffer or transfer-buffer space, or on a sync point. A software WebGL fallback or a remote session would make it slow.
- DEV `capturePixels` adds `readPixels` sync points (WC:2251, 2286, 2291) inside `waitForFill`. That could also cover g15/g16 at the −6.5 → −1 transition.
- I cannot run any of this here.

**3. GC pressure [E for the mechanism here, H for the size there].**
- Each re-centre throws away one full coordinate copy and allocates another. The code itself discloses a third retained coordinate copy as unmeasured (`frontends/shell/src/canvas/buildLayers.ts:124-129 @ 572416aa`).
- Here, 7 re-basings cost about 0.39 s of GC.
- A renderer heap near its limit would make that grow without bound [H].

**4. The 515-tile empty drain [R for the mechanism, H as a stall cause].**
- Each big camera move queues 515 tile queries, mostly for empty cells. 515/3 × ~110 ms ≈ 19 s is a coincidence of scale.
- The per-tile main-thread work I read is small and async, so this should not block the heartbeat unless the per-terminal work is far heavier than it reads.

**5. Bursts of synchronous `render()` calls [R + E].**
- Every `render()` walks all V vertices (≈58–68 ms here) even on a cache hit.
- The synchronous call sites are `clearTile` (at most 3 per plan), eviction (WC:1874), `clearStream` and `fitToExtent`.
- 19 s would take about 300 calls in one task. I found no loop that does that. Low.

**Killed [E]:**
- the re-centre arithmetic: ≈56 ns per call
- the cover and membership: ≤0.72 ms
- the full plan and prune: ≤20 ms

**What the dev build adds, as far as the code shows [R]:**
- **The DEV-only hooks themselves.** `e2eSetViewState` and `capturePixels` are DEV-only. `capturePixels` forces `flush()`, then `layerManager.updateLayers()`, then `redraw` and a full-frame `readPixels` (WC:2203-2300).
- **Instrument counters.** `isInstrumentedBuild()` is true in DEV (`frontends/shell/src/isInstrumentedBuild.ts`). That turns on the residency counters and `traceTileIngest` (WC:1471, 1699, 1722, 1753).
- **React StrictMode.** Present (`frontends/shell/src/bootstrap.tsx:26 @ 572416aa`). It double-invokes React renders, but `render()` here is not a React render.
- **No minification.** The production build minifies with esbuild (`frontends/shell/vite.config.ts:91 @ 572416aa`). The dev server serves the same deck.gl and luma.gl code, unminified.
- **Same in both builds.** The `[render-trace]` `console.debug` lines are always on, in release too.
- **Net:** the code shows nothing on the re-centre path (A1–A4) that differs between dev and release. A release "Zoom to layer" that moves the origin runs the same rebuild.

## Three smallest observations on the Windows app to confirm or kill candidate 1

1. **Timer.** Log `performance.now()` around `render()`, at its existing `begin`/`end("layer-construct")` (WC:1333, 1360).
   - Why a log: the watchdog cannot see a synchronous stall. It checks on a `setInterval` on the same thread, after `end()` has already run (`frontends/shell/src/diagnostics/watchdog.ts`).
   - **Confirms** if it reads about 0.5–1 s exactly at the re-centring tick and at the setCam after it, and about 60 ms elsewhere.
   - **Kills** if the reading is small there too.
2. **Counter.** Read deck's `metrics.updateAttributesCount` ("Layers updated") and `updateAttributesTime` before and after one `recenter-crossing` drag (`@deck.gl/core` 9.3.9 `dist/lib/deck.js:1074-1085`; also available through the `_onMetrics` prop).
   - **Confirms the trigger** if the count jumps by the number of resident layers.
   - **Puts the multiplier inside deck's CPU work** if the time jumps by seconds.
   - **Points to candidate 2 (GPU) or 3 (GC)** if the count jumps but the time stays small while the gap is 19 s.
3. **Log line.** The existing `[render-trace] layers {layerCount, totalPositions}` line (`frontends/shell/src/diagnostics/renderTrace.ts:48-49 @ 572416aa`), emitted by every `render()` (WC:1355).
   - Read its timestamps against the gap edges.
   - **Confirms** if the gap opens right after a `layers` line with totalPositions ≈ 1.88M, and the next `view-state` line comes about 19 s later.
   - A cheap scale test discriminates further: rerun with a 10k-feature fixture.
     - If the gap shrinks about 10×, it is candidate 1, 2 or 3.
     - If it stays near 19 s, it is candidate 4 or something unknown.

## Gaps in this report

- Not executed:
  - `decodeBatch` (it needs Arrow IPC bodies; I did not build them)
  - deck's attribute regeneration, GPU upload and draw
  - React re-renders
  - WebSocket and Tauri traffic
  - the instrument patch, which is not in the repository
- g8/g16 are unexplained by the code I read.

Files: `REPORT.md`; `bench/fixture.ts` (the generator port), `bench/bench.ts`, `bench/manager.test.ts`, and the three result JSONs, all in `/mnt/session/outputs/`.
=== END ===

-----

Commit checked out: 572416aa73b1c0f2aaa479ad3476a4829c14d26a (head of main, 2026-11-11 18:04 +0100). All citations are `path:line @ 572416aa`.

**Resume note.** I checked the sandbox again after this second resumption and it still held everything: the clone at the same commit, `/tmp/bench`, and `/mnt/session/outputs` with REPORT.md unchanged since it was written. I redid nothing. The run stayed well under the US$27 guide.

=== FILE: REPORT.md ===
# What runs on the page's main thread at a re-centre, and where 19 seconds could come from

**Labels.** [E] means I ran it in this sandbox. [R] means I read it in the code. [H] is a hypothesis.

**Machine.** Linux VM, kernel 6.18, x86_64. Intel Xeon @ 2.10 GHz, 4 cores, 15 GiB RAM. Node v22.22.0, npm 10.9.4. Every duration below was measured on this sandbox only. None of them is a claim about the product on Windows/WebView2.

**What I could not run.** No browser, no WebGL/GPU, no Tauri, no React, no WebSocket, and not the e2e suite. I ran the pure functions and two pieces of the deck.gl CPU path (layer construction and `PolygonTesselator`). I did not run deck's attribute generation, GPU upload, draw, or frame loop.

## Summary

- **The trigger.** A re-centre moves the frame origin. On the next `render()`, the shell then re-builds a nested `[x,y]` array for every resident vertex. deck.gl then re-tessellates every layer and regenerates and re-uploads every layer's buffers. The work is proportional to all resident vertices (1,885,130 for this fixture). It is not proportional to what is on screen. [R]
- **The cost here.** The CPU parts I could run add up to about 0.65 s per re-centre on this sandbox [E]:
  - re-basing: 0.15–0.17 s
  - the per-render vertex walk: 0.06–0.07 s
  - deck's tessellator: 0.41–0.48 s
- **That is not 19 s.** About 25× is missing. It would have to come from what I could not run: deck's attribute regeneration and GPU upload, the WebView2 GPU process, GC pressure, or something not yet found [H].
- **Killed as causes.** The re-centre computation, tile assignment and the tile planner are each far too cheap. The real `TileViewportStreamManager.onCameraChange` took 6–20 ms even when it pruned and re-planned 515 tracked tiles [E].
- **Not explained by the re-centre.** Two of the long gaps (g8: 6 s; g16: 18 s) fall at camera resets that, by my reading, do not move the origin.

## Setup notes

**npm ci.**
- A plain `npm ci` in `frontends/shell` failed here [E]. npm 10.9.4 reported `Missing: esbuild@0.28.2 from lock file`. That package is an optional peer of the nested `vite-node/node_modules/vite` 8.3.0 (`frontends/shell/package-lock.json:3993-4040 @ 572416aa`).
- The repository names Node 24 / npm 11+ (`CLAUDE.md:29 @ 572416aa`). I did not install a different npm.
- `npm ci --legacy-peer-deps` succeeded: 196 packages, `@deck.gl/core` 9.3.9 [E].

**renderer/.**
- The shell imports `renderer/style-ts` by source path (`frontends/shell/src/style/document.ts:41 @ 572416aa`; type-only in `frontends/shell/src/canvas/buildLayers.ts:7 @ 572416aa`). That package has no runtime dependencies (`renderer/style-ts/package.json`).
- `renderer/bundle-viewer` is only needed by the build (`frontends/shell/scripts/buildViewerFirst.mjs:25-33 @ 572416aa`).
- So I did not run `npm ci` in renderer/, and no benchmark needed it.

**Synthetic data: what I assumed.**
- I did not invent a parcel distribution. I ported the fixture generator exactly:
  - `SplitMix64`: `engine/src/fixture.rs:736-752 @ 572416aa`
  - `parcel`: `engine/src/fixture.rs:1404-1433 @ 572416aa`
  - `ring`: `engine/src/fixture.rs:1683-1695 @ 572416aa`
  - default seed: `engine/src/fixture.rs:685-686 @ 572416aa`
  - the 100k spec (100,000 features, `avg_vertices: 18`, `hole_every: 7`): `kernel/tests/manual_walkthrough_fixtures.rs:44-55 @ 572416aa`
- The shape that follows: outer rings of 9–27 vertices (uniform), and every 7th parcel has a hole of max(⌊n/3⌋, 4) vertices.
- The port produces **1,885,130 vertices** [E]. That is exactly the total recorded at `kernel/tests/manual_walkthrough_fixtures.rs:77 @ 572416aa`.

Assumptions beyond the generator:
- **(a) First look.** The untiled first look is the first 10,000 rows in file order (`frontends/shell/src/canvas/tileGridConstants.ts:185 @ 572416aa`). This gives a tile frame with a 25,346 m base span. A medium cell is then 1,584 m; a fine cell is 792 m.
- **(b) Tiles.** A tile returns every feature whose bbox meets the tile. Duplicates go through the real `TileResidentSet.addBatch`.
- **(c) Batches.** Batches are cut as the engine does: 64 KiB first, ×4 per batch, up to 1 MiB (`engine/src/stream.rs:49-71 @ 572416aa`), at about 16 B per vertex.
- **(d) Level.** I tested medium, the default (`frontends/shell/src/canvas/tileGridConstants.ts:35 @ 572416aa`), and fine.
- **(e) No outline.** I assumed `outlineWidth` 0. An outline would double the layers per batch (`frontends/shell/src/canvas/buildLayers.ts:501-514 @ 572416aa`).

Result of that shaping:
- medium: 84 data tiles, 181 resident batches
- fine: 287 data tiles, 485 resident batches

## (1) The path, step by step [R unless marked]

The candidate (tiled) arm is the default (`frontends/shell/src/residency/residencyArm.ts:50 @ 572416aa`). `render()` therefore reads `TileResidentSet` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1099-1101 @ 572416aa`). In the table:
- V is the number of resident vertices; B is the number of resident batches (= SolidPolygonLayers); T is the number of tracked tiles.
- **Ships?** says whether the step is in the release build or exists only in DEV.
- WC means `frontends/shell/src/canvas/WorkingCanvas.tsx`.

### A. A pan that crosses the re-centring bound

| # | Step (where) | Ships? | Cost | Repeated |
|---|---|---|---|---|
| A0 | Each drag tick: `onViewStateChange` (WC:2077-2147). It re-evaluates the hover (2097), re-arms the re-pick timer (2098), and calls `setThreshold(recenterThresholdForBudget(...))` (2100; `frontends/shell/src/canvas/offsetFrame.ts:84-91 @ 572416aa`). It logs `traceViewState` with `console.debug`, always on (WC:2101; `frontends/shell/src/diagnostics/renderTrace.ts:52-53 @ 572416aa`). It skips the re-centre while `isDragging` (WC:2127). It ends with `reportViewport` (WC:2136-2146), which goes to the session's debounced `onViewportChanged` (`frontends/shell/src/residency/candidateArmSession.ts:1625-1631 @ 572416aa`). | release | O(1) | per tick |
| A1 | The trailing `isDragging:false` tick: `maybeRecenter` (`frontends/shell/src/canvas/offsetFrame.ts:166-173 @ 572416aa`). At zoom −7 the threshold is min(131,072, 0.5/(2⁻²⁴·2⁻⁷)) = 131,072 m. A 1,200 px drag is 153,600 m, so it crosses [E]. Then `toLocal`, `setProps({initialViewState})` and a **synchronous `render()`** (WC:2131-2133). | release | O(1) + A2 | once per gesture |
| A2 | `render()` (WC:1330-1363). `getBatches` (`frontends/shell/src/canvas/tileResidentSet.ts:155 @ 572416aa`) is O(B). Then `buildLayers` (`frontends/shell/src/canvas/buildLayers.ts:377-517 @ 572416aa`): `geometryForBatch` misses its cache for **every** resident batch, because the origin no longer matches (`buildLayers.ts:144`). It allocates a new `[x,y]` array per vertex via `frame.toLocal` (`buildLayers.ts:159-161`). This is the only "re-encoding relative to the new centre". `offsetPositions`/`toF32Positions` are not on this path (`frontends/shell/src/canvas/offsetFrame.ts:18-24 @ 572416aa`). It builds a new `SolidPolygonLayer` per batch (`buildLayers.ts:463-471`). Then `buildHighlightLayers` (WC:1348), `deck.setProps({layers})` (WC:1350), and `averageFeatureExtent`, which walks **every resident vertex on every render**, cache or no cache (WC:1358; `frontends/shell/src/canvas/pickResolution.ts:90-117 @ 572416aa`). | release | O(V) allocations + O(V) walk + O(B) layers | per re-centre (the re-basing); per render (the walk) |
| A3 | After the debounce (`frontends/shell/src/streaming/debounce.ts:35-42 @ 572416aa`), as a separate task: `handleViewportChange` (`frontends/shell/src/residency/candidateArmSession.ts:1465-1621 @ 572416aa`), then `onCameraChange` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:511-668 @ 572416aa`). That runs: the cover (`frontends/shell/src/canvas/tileGrid.ts:345-381 @ 572416aa`), a key `Set`, `coverMembershipFor` (`tileGrid.ts:446-469`), and a prune over the tracked tiles with an O(Q) `queue.filter` per queued tile (`tileViewportStreamManager.ts:571-592`, 574). An in-flight tile that leaves the view is cancelled, then `onTileSuperseded`, then `clearTile`, then a **synchronous `render()`** (`candidateArmSession.ts:956-967`; WC:1794-1797). New candidates are truncated to 3 + 512 (`tileViewportStreamManager.ts:627`; `frontends/shell/src/canvas/tileGridConstants.ts:40,54 @ 572416aa`). Then `applyTileViewportContext` (WC:1834-1902), `emitResidencyStatus`, and a React `setState` (`frontends/shell/src/App.tsx:1638-1643 @ 572416aa`). | release | O(T + Q² + cover) + up to 3×(A2 without re-basing) | per settled camera change |
| A4 | The next animation frame, inside deck. `updateLayers` runs because every layer has `dataChanged`, so `SolidPolygonLayer.updateGeometry` calls `PolygonTesselator`, which runs earcut per polygon (`@deck.gl/layers` 9.3.9 `dist/solid-polygon-layer/solid-polygon-layer.js:207-236`). Then every attribute is regenerated: indices, `vertexPositions` as **fp64** (`use64bitPositions()` is true for `'cartesian'`, `@deck.gl/core` 9.3.9 `dist/lib/layer.js:235-240`), vertexValid, and per-vertex `pickingColors`. Then GPU re-upload and draw. | release (same library code; only minified) | O(V) CPU + O(V) bytes uploaded | per re-centre, per layer |
| A5 | Refetch. The re-centre itself refetches nothing: residency does not depend on the origin. The camera move plans new tiles, though. At −7 the cover is 1,316 medium cells (small window) or 4,416 (large), of which 84 hold data [E]. That leaves 515 tiles tracked [E], each one an engine query plus its own WebSocket (`frontends/shell/src/streaming/adapterWs.ts:39 @ 572416aa`), drained 3 at a time. | release | async; small per-tile main-thread work | per tile |

### B. `e2eSetViewState` (WC:2319-2357)

**DEV only.** It is gated by `if (!import.meta.env.DEV) return` (WC:2320). In order:

1. Hover re-evaluate and re-pick arm (2335-2336).
2. **`forceRecenter(targetX, targetY)`, unconditional** (2338).
3. `setThreshold` (2339), `traceViewState` (2340), `setProps({initialViewState})` (2343).
4. A **synchronous `render()`** (2344). This is A2.
5. `reportViewport(bboxForFit(...))` (2345). This leads to A3, and then A4 on the next frame.

When does it re-base? `pan-anchor.mjs` always passes the dataset centre (`frontends/shell/e2e/pan-anchor.mjs:50,226,238,258,271 @ 572416aa`). So the cache misses, and A2 re-bases everything, only when the previous drag had re-centred:
- at the setCam after each `recenter-crossing` drag
- at the next size's first setCam

It uses the same primitives as the release build's `fitToExtent` / "Zoom to layer" (WC:1396-1429). A release build re-bases the same way when "Zoom to layer" moves the origin.

## (2) Executed timings (this sandbox only; vite-node / vitest, `performance.now()`)

Medians over 5–7 runs. The raw runs are in `bench/results-*.json`.

| What (function, real repo code unless noted) | medium (181 batches) | fine (485 batches) |
|---|---|---|
| `setThreshold`+`maybeRecenter`, ×1,000,000 | 55.8 ms (≈56 ns/call) | 57.8 ms |
| `tileCoverForBbox`+key Set+`coverMembershipFor`+membership over resident keys, per pose | 0.03–0.72 ms | — |
| Real `TileViewportStreamManager.onCameraChange`, 515 tracked, transport mocked: centre −7 → +153.6 km (the drag) | 9.7 ms small / 11.3 ms large | 10.6 / 20.3 ms |
| same: far −7 → centre −1 (the setCam) | 7.9 / 8.4 ms | 7.1 / 8.5 ms |
| same: centre −6.5 → centre −1 | 7.4 / 7.4 ms | 5.9 / 7.3 ms |
| `TileResidentSet.addBatch`, the whole dataset (sum) | 124.5 ms (median 0.35 ms per batch) | 120.9 ms |
| `buildLayers`, cache **hit** (no origin move) | 0.31 ms | 0.85 ms |
| `buildLayers`, cache **miss** (origin moved = re-centre re-basing) | **174 ms** | **148 ms** |
| `averageFeatureExtent` (runs on every `render()`) | **58 ms** | **68 ms** |
| `render()` equivalent on a cache hit (getBatches + buildLayers + extent) | 57 ms | 58 ms |
| deck.gl `PolygonTesselator.updateGeometry`, all layers, fp64, normalize (deck's own code) | **476 ms** | **412 ms** |
| Proxy, NOT deck code: an f64→f32 hi/lo split per vertex, allocating per ring (a crude upper bound on fp64 attribute fill) | 618 ms | 628 ms |
| GC across the 7 cache-miss runs (PerformanceObserver) | 56 GCs, 394 ms total, max 95 ms | 56 GCs, 379 ms, max 113 ms |
| Node `heapUsed` before → after the miss runs (includes the generator's own copies) | 530 → 1,087 MB | 539 → 1,089 MB |

Where the 515 comes from: every large camera move in the suite leaves T = 3 in flight + 512 queued. The small window at −7 covers 1,316 cells (medium) and the large covers 4,416, against 84 data tiles; at fine the large covers 17,408 [E].

## Where 19 s could come from, ranked

The quiet run's long gaps were 5,967, 19,377, 19,344, 20,308, 2,488, 18,126 and 18,957 ms (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md:232-238 @ 572416aa`). Four of the ~19 s gaps come one heartbeat tick after a ~0.7 s gap:
- g9→g10: ticks 612→613
- g11→g12: 632→633
- g13→g14: 638→639
- g17→g18: 1123→1124

(`...-quiet-worker-report.md:248-257 @ 572416aa`)

**1. A re-centre re-bases all resident geometry, and deck then rebuilds every layer (A2 + A4).**
- **Status:** the trigger is [R]; the CPU portion is [E], ≈0.65 s here; the 19 s magnitude is [H].
- **For it:**
  - The long-gap windows match the re-centre events: drags #13, #15 and #28 at −7 by ±1,200 px, and the setCams #14, #16 and #29 that follow them.
  - The ~0.7 s companion gaps are the size of what I measured for A2 + tessellation.
  - The last crossing drag (#30) was followed by a page that did not answer a 15 s collection evaluate (`...-quiet-worker-report.md:162-169 @ 572416aa`). That fits a gap that was still open and so never reported. This is an inference [H].
  - The cost does not depend on window size. Neither do the gaps: about 19 s in both sizes.
- **Against it:**
  - About 25× is missing.
  - g16 (setCam#24) and g8 (setCam#9) go from −6.5 to −1 with no origin move by my reading. setCams #20/#22 and #5/#7 had already put the origin at the centre.
- **Caveat on the windows:** the node assigns gaps to windows by its own clock, and that clock waits on the page. The labels may be shifted by one step.

**2. The multiplier for #1 comes from the WebView2 GPU process [H].**
- After a re-centre, deck re-uploads every buffer: fp64 positions split into high and low halves, 32-bit indices, and picking colours, for 1.885M vertices. That is on the order of 10² MB [H].
- When the GPU process is slow, the renderer's main thread can wait on command-buffer or transfer-buffer space, or on a sync point. A software WebGL fallback or a remote session would make it slow.
- DEV `capturePixels` adds `readPixels` sync points (WC:2251, 2286, 2291) inside `waitForFill`. That could also cover g15/g16 at the −6.5 → −1 transition.
- I cannot run any of this here.

**3. GC pressure [E for the mechanism here, H for the size there].**
- Each re-centre throws away one full coordinate copy and allocates another. The code itself discloses a third retained coordinate copy as unmeasured (`frontends/shell/src/canvas/buildLayers.ts:124-129 @ 572416aa`).
- Here, 7 re-basings cost about 0.39 s of GC.
- A renderer heap near its limit would make that grow without bound [H].

**4. The 515-tile empty drain [R for the mechanism, H as a stall cause].**
- Each big camera move queues 515 tile queries, mostly for empty cells. 515/3 × ~110 ms ≈ 19 s is a coincidence of scale.
- The per-tile main-thread work I read is small and async, so this should not block the heartbeat unless the per-terminal work is far heavier than it reads.

**5. Bursts of synchronous `render()` calls [R + E].**
- Every `render()` walks all V vertices (≈58–68 ms here) even on a cache hit.
- The synchronous call sites are `clearTile` (at most 3 per plan), eviction (WC:1874), `clearStream` and `fitToExtent`.
- 19 s would take about 300 calls in one task. I found no loop that does that. Low.

**Killed [E]:**
- the re-centre arithmetic: ≈56 ns per call
- the cover and membership: ≤0.72 ms
- the full plan and prune: ≤20 ms

**What the dev build adds, as far as the code shows [R]:**
- **The DEV-only hooks themselves.** `e2eSetViewState` and `capturePixels` are DEV-only. `capturePixels` forces `flush()`, then `layerManager.updateLayers()`, then `redraw` and a full-frame `readPixels` (WC:2203-2300).
- **Instrument counters.** `isInstrumentedBuild()` is true in DEV (`frontends/shell/src/isInstrumentedBuild.ts`). That turns on the residency counters and `traceTileIngest` (WC:1471, 1699, 1722, 1753).
- **React StrictMode.** Present (`frontends/shell/src/bootstrap.tsx:26 @ 572416aa`). It double-invokes React renders, but `render()` here is not a React render.
- **No minification.** The production build minifies with esbuild (`frontends/shell/vite.config.ts:91 @ 572416aa`). The dev server serves the same deck.gl and luma.gl code, unminified.
- **Same in both builds.** The `[render-trace]` `console.debug` lines are always on, in release too.
- **Net:** the code shows nothing on the re-centre path (A1–A4) that differs between dev and release. A release "Zoom to layer" that moves the origin runs the same rebuild.

## Three smallest observations on the Windows app to confirm or kill candidate 1

1. **Timer.** Log `performance.now()` around `render()`, at its existing `begin`/`end("layer-construct")` (WC:1333, 1360).
   - Why a log: the watchdog cannot see a synchronous stall. It checks on a `setInterval` on the same thread, after `end()` has already run (`frontends/shell/src/diagnostics/watchdog.ts`).
   - **Confirms** if it reads about 0.5–1 s exactly at the re-centring tick and at the setCam after it, and about 60 ms elsewhere.
   - **Kills** if the reading is small there too.
2. **Counter.** Read deck's `metrics.updateAttributesCount` ("Layers updated") and `updateAttributesTime` before and after one `recenter-crossing` drag (`@deck.gl/core` 9.3.9 `dist/lib/deck.js:1074-1085`; also available through the `_onMetrics` prop).
   - **Confirms the trigger** if the count jumps by the number of resident layers.
   - **Puts the multiplier inside deck's CPU work** if the time jumps by seconds.
   - **Points to candidate 2 (GPU) or 3 (GC)** if the count jumps but the time stays small while the gap is 19 s.
3. **Log line.** The existing `[render-trace] layers {layerCount, totalPositions}` line (`frontends/shell/src/diagnostics/renderTrace.ts:48-49 @ 572416aa`), emitted by every `render()` (WC:1355).
   - Read its timestamps against the gap edges.
   - **Confirms** if the gap opens right after a `layers` line with totalPositions ≈ 1.88M, and the next `view-state` line comes about 19 s later.
   - A cheap scale test discriminates further: rerun with a 10k-feature fixture.
     - If the gap shrinks about 10×, it is candidate 1, 2 or 3.
     - If it stays near 19 s, it is candidate 4 or something unknown.

## Gaps in this report

- Not executed:
  - `decodeBatch` (it needs Arrow IPC bodies; I did not build them)
  - deck's attribute regeneration, GPU upload and draw
  - React re-renders
  - WebSocket and Tauri traffic
  - the instrument patch, which is not in the repository
- g8/g16 are unexplained by the code I read.

Files: `REPORT.md`; `bench/fixture.ts` (the generator port), `bench/bench.ts`, `bench/manager.test.ts`, and the three result JSONs, all in `/mnt/session/outputs/`.
=== END ===

-----

