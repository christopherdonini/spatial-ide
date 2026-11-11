*Custodian's filing note (2026-11-11): the architect's read-only consult that the human's message of 2026-11-11 (17:17Z) ordered, on what runs on the page's main thread at a re-centre and inside e2eSetViewState and which of it ships, from its hand-back (24002 bytes, sha256 39b3b4b49ab0cdd8f61103273375b59c6c0fbbeb86ded5b6fe1679da43b89a69), below the rule unchanged; one final newline is added. Its brief by file (4363 bytes, sha256 a71fd94953601e7b8a11b925768b829e230d6263abfcb5859b080bc5e74a4dbd); the run 2026-11-11T17:59:55.827Z to 2026-11-11T18:13:50.230Z by its transcript, 87 calls (Read 46, Glob 6, Grep 34, the hand-back), none errored, none writing, model claude-opus-5-5. A reading and not Authority, with no grade and no fix. It opens with its base line, and the brief's opening line is its third. It goes to the human with the measure-build run's reading and the dev-build records, for the human's grade.*

---

main @ c1aea32a166ef9727b059d3038a559181df0a86d

Consulted: pan-anchor-there-and-back-residual-diagnostic, the main thread at a re-centre and inside e2eSetViewState

This is not a gate and carries no verdict. I changed nothing, wrote no file, graded nothing and name no fix. I have no shell, so I leave no background shell (`state/directives/2026-10-29-wait-loops-sleep-and-time-out-background-shells-killed-at-closing.md`). The question is the one at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:19` @ c1aea32a166ef9727b059d3038a559181df0a86d. I cite it and do not reproduce it.

How I cite. Every repository cite is `path:line @ c1aea32a166ef9727b059d3038a559181df0a86d`. Library cites point into the installed copy under `frontends/shell/node_modules`, which is not tracked: @deck.gl/core and @deck.gl/layers at 9.3.9 (the `version` field of the package's package.json). Those cites are evidence of how the library behaves, not Authority. "Scales with" comes from reading the code. No time or cost is claimed anywhere, and nothing here is measured (docs/08). Everything below that is not a cite is my own words.

---

## 1. At a re-centre, from the drag that crosses the bound to the next frame

**The crossing tick itself does not re-centre.**
- Each pointermove in a drag reaches the handler with `isDragging: true`: `@deck.gl/core/dist/controllers/controller.js:282-293` (9.3.9), then `:226-240`.
- The bound check is skipped while that is true: `frontends/shell/src/canvas/WorkingCanvas.tsx:2127 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
- The re-centre runs on the first tick where `isDragging` is false. That is deck's trailing panend tick, `controller.js:312-317` (9.3.9; the Deck sets `controller: true` at `WorkingCanvas.tsx:2040 @ c1aea32a166ef9727b059d3038a559181df0a86d`, so the inertia branch at `:296` is not taken), or a wheel or zoom tick.
- The code's own note says this trailing tick was observed on 9.3.7 and not re-checked on 9.3.9: `WorkingCanvas.tsx:2083-2091 @ c1aea32a166ef9727b059d3038a559181df0a86d`.

**Work on every drag tick, the crossing one included.** These run in call order, all synchronously in deck's pointer-event dispatch.

- D1. The controller turns the pointer event into a view state and calls the callback.
  - Cite: `controller.js:282-293, :226-240` (9.3.9).
  - Scales with: nothing in the data.
  - Owner: library.
- D2. deck calls the shell's handler.
  - Cite: `@deck.gl/core/dist/lib/deck.js:1044-1046` (9.3.9).
  - Scales with: nothing in the data.
  - Owner: library.
- D3. The handler's preamble: zoom-change and standing-readout reads, `reevaluateHoverForZoom`, `scheduleHoverRepick`, `setThreshold`, `traceViewState`.
  - Cites: `WorkingCanvas.tsx:2092-2101` and `:1145-1154`, `:1307-1328 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `pickResolution.ts:261-280, :439-447 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `offsetFrame.ts:84-91 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `diagnostics/renderTrace.ts:52-54 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - What it does: these are constant work. While the button is down, `scheduleHoverRepick` disarms, cancels its debounce and clears the standing labelled state. Either hover call may emit a readout to App, which is a React state update; I did not trace when React runs the render that follows. `traceViewState` writes one `console.debug` line, the one the instrument records.
  - Scales with: nothing in the data.
  - Owner: shell.
- D4. Camera bookkeeping, the world point, and the bound check skipped because `isDragging` is true.
  - Cite: `WorkingCanvas.tsx:2107-2111, :2127 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: nothing in the data.
  - Owner: shell.
- D5. `reportViewport(computeAuthoritativeViewportBbox(...))`, on every tick.
  - Cites:
    - `WorkingCanvas.tsx:2136-2146, :1082-1085 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `canvas/viewportBbox.ts:37-49 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - It reads `canvas.clientWidth/Height`, a layout read, at `:2141-2142`.
    - It then calls App's `onViewportChanged`: `App.tsx:2248-2259 @ c1aea32a166ef9727b059d3038a559181df0a86d`. That does `toWireBbox`, the ref write, then `showBox` (`:2182-2184`), which sets the view-box store.
    - The store notifies its listeners: `feature/FeaturePanel.tsx:26-40 @ c1aea32a166ef9727b059d3038a559181df0a86d`. FeaturePanel's snapshot runs `summarize` and `countSelection`: `:87-99`.
    - Then the viewport debounce is reset: `streaming/debounce.ts:35-54 @ c1aea32a166ef9727b059d3038a559181df0a86d`, a setTimeout.
  - Scales with: the box work is constant. `countSelection` scales with the selection's members.
  - Owner: shell.
- D6. deck folds the returned view state into its own and pushes it to the ViewManager, which rebuilds the viewport and sets the controller's props.
  - Cites: `deck.js:1048-1054` (9.3.9); `view-manager.js:127-146`, `:182-194`, `:237-274` (9.3.9).
  - Scales with: the number of views (one, `WorkingCanvas.tsx:2038`).
  - Owner: library.

**Added on the settled tick (`isDragging` false) when `maybeRecenter` returns true.** These come between D4 and D5.

- R1. `frame.maybeRecenter(worldX, worldY)`: a hypot against the threshold, then `recenterTo`, which appends one entry to the frame's `events` array.
  - Cite: `offsetFrame.ts:166-173, :187-193 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: constant per call. The array grows by one per re-centre and nothing trims it.
  - Owner: shell.
- R2. `frame.toLocal(worldX, worldY)`.
  - Cite: `WorkingCanvas.tsx:2131`, `offsetFrame.ts:196-198 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: constant.
  - Owner: shell.
- R3. `deck.setProps({ initialViewState })`.
  - Cites: `WorkingCanvas.tsx:2132 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `deck.js:315-376` (9.3.9).
  - What it does: a depth-3 deepEqual, then a replace of `this.viewState` (`:323-328`). Then it sets props on the animation loop, the ViewManager (viewport rebuild and controller props), `layerManager.activateViewport`, and `layerManager.setProps`. The layers are unchanged here, so nothing new is stored.
  - Scales with: views (one).
  - Owner: library.
- R4. `render()`: `WorkingCanvas.tsx:1330-1363 @ c1aea32a166ef9727b059d3038a559181df0a86d`. It runs inside the watchdog span `begin("layer-construct")` (`diagnostics/watchdog.ts:27-36 @ c1aea32a166ef9727b059d3038a559181df0a86d`, map set and delete).
  - R4a. `activeBatches()`, the candidate arm's resident tile batches.
    - Cite: `WorkingCanvas.tsx:1099-1101, :1344 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - Scales with: resident batches.
    - Owner: shell.
  - R4b. `buildLayers`. Per batch, `checkPickCeiling` runs, then `geometryForBatch`, `pointsForBatch` or `pathsForBatch`. These are cached per (batch, originX, originY), so a moved origin misses for every resident batch. On a miss, every vertex goes through `frame.toLocal` into fresh nested arrays. Then a new `SolidPolygonLayer` per batch is built, plus a `PathLayer` outline when `outlineWidth > 0`.
    - Cite: `canvas/buildLayers.ts:140-165, :201-216, :242-260, :353-517` (`:385`, `:463-472`, `:501-514`) @ c1aea32a166ef9727b059d3038a559181df0a86d.
    - Scales with: the arrays scale with resident vertices and parts. The layer objects scale with resident batches, doubled with outlines. The ceiling is `MAX_RESIDENT_VERTICES` (`canvas/limits.ts:72 @ c1aea32a166ef9727b059d3038a559181df0a86d`).
    - Owner: shell. The layer classes are the library's.
  - R4c. `buildHighlightLayers`.
    - Cite: `canvas/highlightLayers.ts:146-180`, `scanBatch :87-123 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - What it does: with nothing highlighted, it returns after one emptiness check (`:152`). With a highlight, the scan is cached by origin, so it misses and scans every resident batch's rows.
    - Scales with: nothing (no highlight); resident rows (with a highlight).
    - Owner: shell.
  - R4d. `deck.setProps({ layers })`: the same chain as R3, and `layerManager.setProps` stores `_nextLayers` only.
    - Cites: `WorkingCanvas.tsx:1350 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `layer-manager.js:121-136` (9.3.9).
    - Scales with: constant. The layer diff is deferred to the frame.
    - Owner: library.
  - R4e. The `totalPositions` reduce and `traceLayerUpdate`, which writes one `console.debug` "layers" line carrying the layer count and total positions.
    - Cites: `WorkingCanvas.tsx:1354-1355 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `renderTrace.ts:48-50 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - Scales with: resident batches.
    - Owner: shell.
  - R4f. `pickResolutionExtentFor`, the average feature extent or point spacing over the resident set. It runs on every render, not only a re-centre.
    - Cites: `WorkingCanvas.tsx:1358 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `canvas/pickResolution.ts:90-117, :137-163, :173-175 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - Scales with: resident vertices.
    - Owner: shell.
  - R4g. `end("layer-construct")`, then `emitDrawn`, which compares id sets.
    - Cites: `WorkingCanvas.tsx:1360-1362 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `highlightLayers.ts:194-201 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
    - Scales with: the highlighted ids drawn. If the set changed, it calls a parent callback.
    - Owner: shell.
- Then D5 and D6 run as on any tick. D5's box is built from the pre-re-centre origin (`:2143-2144`).

**The next animation frame.** deck's `_onRenderFrame`, `deck.js:1016-1042` (9.3.9).
- F1. `_updateCursor`, which calls the shell's `getCursor`.
  - Cite: `:1028`; `WorkingCanvas.tsx:2049 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: constant.
- F2. `layerManager.updateLayers()`. Every new layer is matched to its old one and diffed (`layer-manager.js:148-160, :184-217, :220-256`, 9.3.9). The data references are new after a miss, so `dataChanged` is set for every layer, and:
  - `attributeManager.invalidateAll()`: `layer.js:330-343` (9.3.9);
  - the SolidPolygonLayer tessellator re-runs over every polygon, normalize and earcut triangulation: `solid-polygon-layer.js:193-239`, `polygon-tesselator.js:49, :107-125` (@deck.gl/layers 9.3.9);
  - attributes are regenerated and written to the GPU: `layer.js:737-789, :485-505`, `attribute/data-column.js:301-338` (9.3.9);
  - outline PathLayers re-tessellate their paths in the same way.
  - Scales with: resident vertices and layers.
  - Owner: library.
- F3. `_pickAndCallback`, the pending hover pick. No hover is picked while a button is down (`deck.js:146-156`, 9.3.9). On the panend tick the button is up.
  - Scales with: a pick request, if any.
  - Owner: library.
- F4. `redraw`, one draw per layer.
  - Cite: `deck.js:1035, :991-1014` (9.3.9).
  - Scales with: layers.
  - Owner: library.
- F5. `viewManager.updateViewStates()`.
  - Cite: `:1039-1041` (9.3.9).
  - Owner: library.

**Set off by the window but run later, on timers.** Each is its own task, not the panend tick.
- T1. The debounced viewport handler. It runs `manager.onCameraChange`, `coverMembershipFor` and `canvas.applyTileViewportContext`. That builds the cover set, runs `protectionSetFor` and `planTileEviction` over the resident tile keys, may evict and render, and runs `anyPartialInView`.
  - Cites: `residency/candidateArmSession.ts:1454, :1465-1621, :1625-1631 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `WorkingCanvas.tsx:1834-1902 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: covering tiles and resident tiles.
  - Owner: shell.
- T2. Each new tile batch goes through `pushTileBatch`: decode, ingest, `traceStreamBatch`, the instrumented traces, a possible auto-fit, and a coalesced render.
  - Cites: `WorkingCanvas.tsx:1689-1792 @ c1aea32a166ef9727b059d3038a559181df0a86d`; `canvas/coalesceOncePerFrame.ts:44-72 @ c1aea32a166ef9727b059d3038a559181df0a86d` (rAF).
  - That render does R4 again. The caches hit for unchanged batches, but R4f walks every resident vertex again and F2 tessellates the new batch's layer.
  - Scales with: the batch's vertices (decode, F2) and resident vertices (R4f).
  - Owner: shell, with the library for F2.

## 2. Inside e2eSetViewState, from entry to return, then the frame

The entry is `applyDeterministicE2eViewState`, `WorkingCanvas.tsx:2324-2349 @ c1aea32a166ef9727b059d3038a559181df0a86d`. It is registered through `registerE2eHook` (`:2351-2352`; `e2e-test-surface.ts:360-364 @ c1aea32a166ef9727b059d3038a559181df0a86d`). The suite calls it through a CDP evaluate.

- S1. A call counter, then a read of `canvas.clientWidth/Height` (a layout read).
  - Cite: `:2325, :2329-2330`.
  - Scales with: constant.
  - Owner: shell.
- S2. Zoom change, `currentZoomRef`, `reevaluateHoverForZoom`, `scheduleHoverRepick`. The same as D3 with the button up.
  - Cite: `:2332-2336`.
  - Scales with: constant.
  - Owner: shell.
- S3. `frame.forceRecenter(targetX, targetY)`.
  - Cite: `:2338`; `offsetFrame.ts:182-185 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - What it does: the origin becomes the target. When the target differs from the current origin, every per-origin cache in R4b and R4c misses.
  - Scales with: constant.
  - Owner: shell.
- S4. `setThreshold`, `traceViewState(0, 0, …)` (one view-state line), `cameraRef`.
  - Cite: `:2339-2341`.
  - Scales with: constant.
  - Owner: shell.
- S5. `deck.setProps({ initialViewState: { target: [0,0,0], zoom } })`. The same as R3.
  - Cite: `:2343`.
  - Scales with: views.
  - Owner: library.
- S6. `render()`, all of R4a to R4g.
  - Cite: `:2344`.
  - Scales with: on a miss, resident vertices and batches, as in R4.
  - Owner: shell, and the library's layer constructors.
- S7. `reportViewport(bboxForFit(...))`, the same chain as D5.
  - Cites: `:2345-2347`; `canvas/extent.ts:166 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - Scales with: the selection's members (FeaturePanel).
  - Owner: shell.
- S8. `return true`.
  - Cite: `:2348`.

The seam is not inside deck's view-state callback, so D2, D6 and the handler do not run for it. The frame it sets off is F1 to F5, with F2 re-tessellating and re-uploading every layer after a miss. That work runs after the seam has returned. T1 and T2 follow on timers as in 1.

Beside the seam, in the same suite windows, the suite calls `capturePixels` (`e2e/pan-anchor.mjs:161, :174, :198 @ c1aea32a166ef9727b059d3038a559181df0a86d`).
- That handler is `WorkingCanvas.tsx:2203-2300 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
- It runs `coalescedRenderRef.flush()` (R4 if a render is pending, `:2263`), `layerManager.updateLayers()` (F2, `:2286`) and `deck.redraw("e2e-capture")` (`:2291`).
- It then reads back the whole drawing buffer (`:2251`) and runs `summarizePixels` over every pixel (`:604-687`). That scales with canvas pixels and layers.

## 3. Which of it ships

**Release build, the measure build included.**
- What runs: D1 to D6, R1 to R4g, F1 to F5, T1 and T2. That is the handler, `render`, `buildLayers`, `buildHighlightLayers`, `pickResolutionExtentFor`, App's `onViewportChanged`, FeaturePanel, the candidate session, the debounce, the watchdog's begin and end, and all of deck.
- Why: none of it is gated. The Deck and its `onViewStateChange` are built in an effect with no DEV or instrumented check (`WorkingCanvas.tsx:2018-2196 @ c1aea32a166ef9727b059d3038a559181df0a86d`).
- `traceViewState`, `traceLayerUpdate` and `traceStreamBatch` are unconditional `console.debug` calls (`renderTrace.ts:37-54 @ c1aea32a166ef9727b059d3038a559181df0a86d`). The build drops no console calls (`frontends/shell/vite.config.ts:87-93 @ c1aea32a166ef9727b059d3038a559181df0a86d`), so they ship.
- The shipped twin of S3 to S7 is `fitToExtent`: `forceRecenter :1408`, `setProps initialViewState :1416`, `render() :1417`, then a report (`WorkingCanvas.tsx:1396-1429 @ c1aea32a166ef9727b059d3038a559181df0a86d`). It runs on auto-fit, Zoom to layer and zoom to selection.

**Dev and measure builds, not a plain release.**
- `traceTileIngest` and the `recordResidency*` calls in T2 (`WorkingCanvas.tsx:1722, :1753 @ c1aea32a166ef9727b059d3038a559181df0a86d`).
- `registerE2eHook` registers only here (`e2e-test-surface.ts:360-364 @ c1aea32a166ef9727b059d3038a559181df0a86d`).
- The gate is `isInstrumentedBuild()`, which is `import.meta.env.DEV || import.meta.env.VITE_MEASURE_BUILD === "1"` (`isInstrumentedBuild.ts:31-33 @ c1aea32a166ef9727b059d3038a559181df0a86d`).

**DEV only.**
- S1 to S8, the seam: `if (!import.meta.env.DEV) return;` at `WorkingCanvas.tsx:2320 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
- The `capturePixels` handler: the same check at `:2204 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
- The measure build has neither. Its drags exercise only the panend path in 1.

## 4. What the records can and cannot tell

The fields come from the form's instrument note, `governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md:21-36 @ c1aea32a166ef9727b059d3038a559181df0a86d`:
- the page heartbeat on setInterval and its `[dg-stall]` lines;
- a `console.debug` wrapper that keeps only `view-state` lines and their five fields;
- the seam wrapper's page call and return times;
- the node's receipt times;
- setCam's start, evaluate-return and return;
- the drag's start, mouseup, waitForSettle and end.

**What they can place, in the build run, where page records exist.**
- A `view-state` line's page time shows that D3 (at `:2101`) or S4 (at `:2340`) ran at that time.
- A change in `originX/originY` between two lines shows that a re-centre (R1, or S3) happened between them.
- The handler's line is written before R1 in the same tick. So a gap that begins after the panend line is consistent with R1 to R4, D5 and D6 of that tick, or F1 to F5 of the next frame. The records do not say which.
- The seam's page call and return bracket S1 to S8. A gap that contains both is the seam's synchronous body. Any part of a gap after the return is outside the seam: the next frame (F2 among it), T1, T2, or something else.

**What they cannot place, in any run.**
- R4's rebuild against F2's tessellation and upload, or against F4's draws.
- T1 and T2: decode, the tile plan, and eviction.
- React renders set off by D3, D5 or S2.
- GC, the compositor and the GPU driver.
- CDP delivery of console lines.
- The instrument's own wrapper and collection.
- The "layers" line (R4e). It is written at the end of every `render()` and carries its scale variables (layer count, total positions), but the instrument records only `view-state` lines.
- The `traceStreamBatch` line that would place T2. It is filtered out in the same way.
- The watchdog's span (`watchdog.ts:56-59 @ c1aea32a166ef9727b059d3038a559181df0a86d`). Its check runs on setInterval on the same thread. It cannot run during a synchronous R4, and `end` deletes the span before any later check, so it records nothing of R4.

**Run quiet.** Page collection hit its bound, so there are no page arrays, emissions or seam records. Only the `[dg-stall]` lines and the node-side times exist.
- A node-side time can place a gap relative to the suite's actions only: after mouseup, before setCam's evaluate-return, and so on.
- A receipt time bounds its emission from above only.
- Nothing in run quiet can say which of the items in 1 or 2 held the thread.

## 5. For the human (my words, no grade, no fix)

- **H1, a question from my reading. No run verifies it.**
  - In the code:
    - After the handler returns from a re-centre at `WorkingCanvas.tsx:2127-2133 @ c1aea32a166ef9727b059d3038a559181df0a86d`, deck runs `deck.js:1048-1054` (9.3.9). That spreads `this.viewState`, which R3 just set to the snapped target, and adds `working: params.viewState`, the tick's pre-re-centre local target.
    - It then pushes that to the ViewManager.
    - `view-manager.js:93-98` (9.3.9) reads `this.viewState[view.getViewStateId()]` before the root. The view's id is `"working"` (`WorkingCanvas.tsx:2038`).
  - My reading, unverified: the snap at `:2132` may be replaced by the pre-re-centre target whenever the re-centre runs inside the callback. The next frame and the controller would then hold a local target from the old origin over geometry rebuilt at the new one. If so, the next settled tick could compute a world point off by the origin delta and cross again, with one R4 and one F2 rebuild each time.
  - The seam (S5) is outside the callback and is not affected.
  - The code's comment at `:2117-2119` describes a re-crossing runaway of this shape before the deferral.
  - What could test it: in the build run's records, the `view-state` lines just after the re-centre (the gate report names seq 264 to 266 and 543 to 545). Their `targetX/originX` against the snapped value, and their page times against the gap starts.
- **H2.** The shipped path rebuilds every resident batch's local geometry (R4b), and the library re-tessellates and re-uploads all of it (F2) on the frame after any re-centre. It does the same after `fitToExtent`. All of it scales with resident vertices, up to `MAX_RESIDENT_VERTICES`.
  - ADR-010 records a whole-buffer origin rebase as O(dataset): `docs/adr/ADR-010-render-frames-origins-boundaries.md:60 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - The rule it bears on is `docs/01_Principles.md:20 @ c1aea32a166ef9727b059d3038a559181df0a86d`.
  - This is stated as a fact of the code, not a measurement.
- **H3.** The dev runs' windows contain DEV-only work a measure-build record will not: S1 to S8, and `capturePixels`'s flush, `updateLayers`, redraw, full-buffer readback and per-pixel summary. Dev records and measure records therefore do not cover the same work.
- **H4.** Facts of the shipped build. The view-state and layer `console.debug` lines ship in release builds. `offsetFrame`'s `events` array grows by one per re-centre and is never trimmed (`offsetFrame.ts:187-193 @ c1aea32a166ef9727b059d3038a559181df0a86d`). No cost is claimed for either.

## What I read

Repository files, at c1aea32a166ef9727b059d3038a559181df0a86d, all in `C:/dev/spatial-ide`:
- In `frontends/shell/src/canvas/`: `offsetFrame.ts`, `offsetFrame.test.ts`, `WorkingCanvas.tsx`, `coalesceOncePerFrame.ts`, `buildLayers.ts`, `highlightLayers.ts`, `pickResolution.ts`, `viewportBbox.ts`, `extent.ts`, `limits.ts`.
- In `frontends/shell/src/`: `diagnostics/renderTrace.ts`, `diagnostics/watchdog.ts`, `isInstrumentedBuild.ts`, `e2e-test-surface.ts`, `App.tsx`, `feature/FeaturePanel.tsx`, `residency/candidateArmSession.ts`, `streaming/debounce.ts`.
- `frontends/shell/vite.config.ts` and `frontends/shell/e2e/pan-anchor.mjs`.
- `docs/01_Principles.md` and `docs/adr/ADR-010-render-frames-origins-boundaries.md`.
- `governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md`.
- The directive, `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md`.
- The run and gate records: `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md`, `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md`, `state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate1-reviewer.md`.

Installed library copy, not tracked, under `C:/dev/spatial-ide/frontends/shell/node_modules`:
- @deck.gl/core 9.3.9: `dist/lib/deck.js`, `dist/lib/view-manager.js`, `dist/views/view.js`, `dist/controllers/controller.js`, `dist/lib/layer-manager.js`, `dist/lib/layer.js`, `dist/lib/attribute/data-column.js`.
- @deck.gl/layers 9.3.9: `dist/solid-polygon-layer/solid-polygon-layer.js`, `dist/solid-polygon-layer/polygon-tesselator.js`, and `package.json`.

I read no node_modules folder in any other worktree.

Model, as the harness reports it: Opus 5.5 (`claude-opus-5-5`).
