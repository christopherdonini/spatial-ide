*Custodian's filing note (2026-10-08): `shell-pick-paths-disagree-at-1280x801`'s diagnosis report, reported only. One worker-high ran from 22:51:40Z to 23:51:27Z by its transcript, with Bash 69, Read 1 and Write 6; all six writes went to the custodian's scratch folder and none to a repository. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 2c7af7e9cff26340664a3901f4c1493e119afa0c08c0ec4512408c391bdc9098. The custodian checked three things. `git status --porcelain` in the worktree was empty at bac14f81a4a8ce1eae30684da8a4cfbbfabd8d9f. No process from the runs was left, and ports 5400 and 9223 were free. The code matches the report's description: the establishing read in `frontends/shell/e2e/regression.mjs` (lines 1114 to 1125), the poll helper in the same file (lines 145 to 154, one read before the first sleep), and `doWheel` in `frontends/shell/e2e/lib.mjs` (lines 581 to 584). Paths in the report are relative to `frontends/shell/` unless they start with a drive letter. The ids, counts and run results are the worker's, and the custodian re-ran nothing.*

---

# Report: shell-pick-paths-disagree-at-1280x801 (diagnosis only)

**Verdict in one paragraph.** I found no disagreement between the two pick paths. At one camera and pointer they pick the same feature in every comparison I made. The "disagreement" K6 case (iii) shows comes from the step's own establishing read, not from the product. After `page.mouse.move` onto the candidate pixel, the step reads `.hover-readout` at once. That readout still shows the feature under the previous pointer (the canvas centre), because deck's hover pick for the new pointer has not run yet. The 50244 in the ruling is very probably that stale centre read (an inference, below). So it is neither a product defect nor an artefact of the old fractional geometry. The fault is in the harness, it is not fixed by `box-sizing: border-box`, and it reproduces on merged main with integral map heights. This conflicts with the ruling's stated reason for keeping (iii) as written, so I am flagging it for the human.

I changed no tracked file, made no commit and published nothing. Worktree `C:/dev/wt/pick` is at bac14f81a4a8ce1eae30684da8a4cfbbfabd8d9f.

## 1. The two pick paths, at bac14f81 (`frontends/shell/...`)

**Hover path.**
- `src/canvas/WorkingCanvas.tsx:1906-1909`: `pickingRadius` (undefined for polygons) goes into `new Deck`.
- Deck stores the pointer, it does not pick at that moment. These are in the installed `node_modules/@deck.gl/core/dist/lib/deck.js` (9.3.9 per `package-lock.json`):
  - `deck.js:146-171` `_onPointerMove`: x,y = `event.offsetCenter`, radius = `props.pickingRadius`, stores the request. The comment at 143-145 says the pick is deferred to the next animation frame.
  - `deck.js:1016-1033` `_onRenderFrame` calls `_pickAndCallback`.
  - `deck.js:856-875` `_pickAndCallback` uses `_getPointPickOptions` (560) with `mode:'hover'`, then `_pickPointSync` (569), `_pick` (637), `_applyHoverCallbacks`.
  - `deck.js:583-595`: the `onHover` callback receives the last info of the result list. In hover mode the unhover info comes first and the picked one last.
- `WorkingCanvas.tsx:1989` `onHover` -> `:1996` `captureHoverPointer(info.x, info.y)`. That function is at `:1157-1159`; it stores `{x, y, clientWidth, clientHeight, devicePixelRatio}` (`:1143` `framebufferIdentityNow`).
- Then `:1998` `hoverRepick.cancel()`, `:2007` `batchForLayerId(activeBatches(), info.layer.id)`, `:2016` the below-resolution test, `:2020` `emitHoverReadout(resolvePick(batch, info.index))`.
- Pixel coordinates are deck's `offsetCenter`, in CSS pixels. The buffer coordinate is computed inside deck at pick time (`deck-picker.js` `_pickClosestObject`, via luma `cssToDevicePixels([x,y], true)`). The shell computes none.

**Camera-settle re-pick.**
- Camera sites call `scheduleHoverRepick` (`WorkingCanvas.tsx:1219`, callers at `:1312`, `:1940`, `:2176`), which calls `hoverRepick.schedule()` (`:1239`). The debounce delay is `HOVER_REPICK_SETTLE_MS` (`src/canvas/hoverRepickConstants.ts:34`).
- At settle, `createHoverRepickScheduler` runs (`:774-811`). It compares the framebuffer identity (`:782`, `pickResolution.ts:324-330`), then calls `deps.pickCandidateAt(capture.x, capture.y)` (`:794`) with the captured x,y from the last hover.
- `WorkingCanvas.tsx:1186-1194`: `deck.pickObject(radius === undefined ? {x,y} : {x,y,radius})` at `:1190`. Deck returns `infos[0]` (`deck.js:472-475`), query mode, no `mode:'hover'`, no `unproject3D`.
- Then `batchForLayerId(activeBatches(), ...)` (`:1192`), the threshold (`:795`), `resolvePick(candidate.batch, candidate.gpuOrdinal)` (`:1195`, `:796`), `decideHoverReadoutAtSettle` (`:797`), emit.
- `src/canvas/pickResolution.ts` has no pixel arithmetic. It holds the capture type (`:300-312`), `isFramebufferIdentical` (`:324`) and the decision functions.

## 2. Where they can differ

Both paths hand the same x,y (CSS px), the same radius and the same `resolvePick` to the same deck picker. By code they differ in only three ways:
- **The deck `mode` argument** ('hover' vs default 'query'). I read this only as affecting the returned info list.
- **The moment each pick runs:** the next animation frame after the pointer event, versus after the settle debounce.
- **The readout DOM:** it shows whichever pick emitted last.

By run (probe below):
- **Rounding and fractional height.** On integral frames the hover x,y are integers: a CDP move to 467.5 arrives as offset 201. On a fractional map (injected, see 3) y is fractional, e.g. 30.82034. In each log pair the settle pick used exactly the hover pick's x,y.
- **Different camera.** The view matrices of the establishing hover and the post-zoom-out settle are equal to 6 decimals. Zoom differs by one ulp: -0.848138760145841 against -0.8480857... shows the round trip is exact enough.
- **Stale pointer.** The capture is the last `onHover` x,y. It is cleared at button release (`:1860`).
- **Device-pixel ratio.** By code it can only make the settle refuse to pick (`:782`, `pickResolution.ts:324-330`), never pick differently. **Not exercised in a run:** my CDP DPR override did not resize the canvas buffer, so it is not a real stand-in for display scaling.
- **Buffer row origin.** One luma function serves both paths.
- **Same-instant sweep.** At the established camera I called a hover-style and a settle-style pick at the same instant over 918 points, whole and fractional offsets, per config. Mismatches: 0 of 918 in each of 4 configs (map 668x737, 668x731.2, 668x736, 668x736.5), about 1,100 hits in total (303 + 206 + 308 + 306).
- **Single-point checks.** Every pre/post-pair `directCompare` agreed too (hover-style, settle-style, hover-style again).

**What does differ: the establishing read in K6 (iii).**
- `e2e/lib.mjs:581-584` `doWheel` moves the pointer to the canvas centre for every zoom notch. Each notch's hover and settle therefore leave the readout at the centre feature.
- `e2e/regression.mjs:1115` then moves the pointer to the candidate pixel. Lines `1119-1125` poll `.hover-readout` with `waitForCondition`, which reads once immediately (`:145-152`), before any frame has run. `:1125` stores that id; `:1309` takes it as `repickId`.
- Deck's hover pick for the new pixel lands about 40-55 ms later. In the pair of logs below, pick #41 is at t=137389.7 and the DOM mutation at 137394.0.
- The comment at `regression.mjs:1117-1119` ("the pointer just moved, so a fresh pick owns the readout") is not true at the first poll.

## 3. Reproduction on merged main

Setup: the debug exe was built at bac14f81 with the e2e overlay (plus the host-resolver rule) into `D:/wt-targets/pick`, vite on 127.0.0.1:5400. The page's `WorkingCanvas.tsx` response is rewritten in flight by playwright to expose the Deck instance and wrap `deck._pick`. Nothing on disk changed. Fixture: 100k-happy-path.

**Default window, 1280x800: map 668x736, buffer 668x736, integral.** Two rounds. Hover and settle agree: ids 2371 and 42964 are unchanged through the zoom-in/zoom-out pair.

**Window-size survey of the map box.**
- Heights 800, 801, 802, 805, 810 at 1280 give map heights 736, 737, 738, 741, 746; widths 800-1200 gave integral too.
- All 16 specs I ran came out integral on the merged frame, including the 1.25 and 1.5 DPR-override specs (which do not change the layout, see 2).
- With the attention strip empty, the status bar is 24 px at every size tried. Attention and status content are not in these results.

**Unmodified main, scratch probe, integral window heights. Case (iii) logic with the hover id read at once, against the same id read 1 s later:**

| window height | map | id read at once (stale) | id 1 s later = after zoom-in = after zoom-out | case (iii) as written |
|---|---|---|---|---|
| 799 | 668x735 | 50244 | 54990 | differs |
| 801 | 668x737 | 5230 | 8406 | differs |
| 803 | 668x739 | 50244 | 47080 | differs |
| 805 | 668x741 | 50244 | 47080 | differs |
| 800 | 668x736 | 52144 | 52144 | same |
| 802 | 668x738 | 52144 | 52144 | same |

- At 803, the log shows hover pick #39 at the centre pointer (334,369) giving `:2#157` -> 50244, then #41 hover at the candidate pointer (467,586) giving `:1#379` -> 47080.
- The settle re-picks at that pointer after the zoom-in and after the zoom-out both gave 47080.
- At 801: centre hover pick #8 (334,368) -> 5230; candidate hover pick #10 (467,142) -> 8406; both settle re-picks -> 8406.

**Scratch copy of the real K6 (iii).**
- It uses verbatim slices of `regression.mjs` (lines 112-114, 145-154, 249-256, 575-583, 1093-1138, 1150-1154, 1177-1193, 1199-1201, 1218-1224, 1243-1246) and the case body of `:1306-1346`.
- Verbatim variant: FAIL at 801 ("expected id 5230, last seen id 8406") and FAIL at 803 ("expected 50244, last seen 47080"). PASS at 800 and 802.
- Variant "waited" (only change: the establishing id is taken 1 s after the move): PASS at 801 and 803 (ids 43579 and 47080).

**Old fractional geometry, injected into the page style only** (`--top-bar-h` lengthened):
- Map 668x731.2: stale read 40417, id 1 s later 42949, both settle re-picks 42949.
- 668x736.8 / 736.5: stale 5230 / 50244, then different ids.
- 668x736.3: no stale hit, case passes.
- Fractional height is therefore not what causes the failure.

**Fractional heights on the real merged frame:** I did not find an input that gives one. The 1280x800/801 window gives integral heights; fractional attention/status content and OS display scaling were not exercised. Fractional DPR: not exercised (see 2).

## 4. Verdict, with evidence and inferences

- **Observed:** hover and settle picks agree at the same camera and pointer. 0 of 918 mismatches in each of 4 geometries (about 1,100 hits in all). The establishing read is stale: logs and DOM timeline show the centre feature's id (5230 and 50244 here) standing until the hover pick lands.
- **Observed:** it reproduces at map heights 735, 737, 739 and 741. Heights 736, 738 and 800/802 did not, in 3 even runs.
- **Observed:** the 668x731.2 geometry failed in the same way (stale 40417 against 42949).
- **Inference:** odd map-row counts put the centre pixel on a feature at the establishing notch, so the stale read has an id to return; even counts put it in a gap, and the readout is clear. This fits all 8 runs but I did not test the pixel geometry directly. It also fits the old record: report-3/4 saw buffer 731 fail and 730 pass.
- **Inference:** the 50244 in the ruling was the same kind of stale centre read. Evidence: 50244 is the id the centre pointer resolved at 799, 803, 805 and 801+0.5. The ruling's own 53722 is the real hover id at the candidate. I could not re-run the exact original window, so this stays an inference.
- **Reviewer S4 and architect N-D5 readings:** "fractional map height" is not the mechanism. The border-box fix only moved the default window from an odd row count (731) to an even one (736).
- **Fix sketch for the harness, not made:**
  - In `establishAboveThresholdHoverK6` (`regression.mjs:1115-1125`), do not accept a confirmed id taken before the hover pick for the new pointer. The unchanged-id check cannot tell "same feature" from "stale".
  - Options: move first to a known-empty pixel and wait for the readout to clear, or wait two animation frames (deck picks in `_onRenderFrame`, `deck.js:1016-1033`).
  - A DEV-only accessor for the last hover pick's x,y (like `capturePixels`) would let the harness wait for it to equal the move target.
- **Case (iii):** while the establishing read can be stale, it fails at odd map heights for a reason that is not the product's. A9' has the same read pattern at `regression.mjs:852-858`; I did not examine it.
- **Milestone 2 (inference):** selection should take its pick at the click and not read the readout DOM. The shell wires no `onClick` today; deck's own pointer-down pick (`deck.js:192-242`) would be a third path. I did not test it.

## Runs (all exit codes; a "shared hold" is `hold shared -Project SpatialIDE`)

| # | what | rc | hold |
|---|---|---|---|
| 1 | `npm ci` in `frontends/shell`, then in `renderer/bundle-viewer` | 0, 0 | no (light) |
| 2 | `buildViewerFirst.mjs`, `generate:notice` | 0 | no (light) |
| 3 | `cargo build` in `src-tauri` with the overlay, `CARGO_TARGET_DIR=D:/wt-targets/pick`, jobs 8 (18m25s) | 0 | shared, granted |
| 4 | probe at the default window, 2 rounds | 0 | shared, granted |
| 5 | window-size survey (16 specs) | 0 | shared |
| 6 | fractional offsets 0.2, 0.5, 0.7 at 801 x 3 rounds | 0 | shared |
| 7 | integral heights 799-805, no injection | 0 | shared |
| 8 | scratch K6 (iii), heights 801, 803, 800, 802 x {verbatim, waited} | 0 | shared |
| 9 | same-instant sweep, first try (step 17) | 124 (my own `timeout 560` fired) | shared |
| 10 | same-instant sweep, step 41, 4 configs | 0 | shared |

- No hold was refused (no rc 96-99).
- In run 9 the app was left up after the timeout until I ran `app-down` myself; I then added a self-exit timer. Run 10 shut down by itself.
- The apps and vite I started were stopped after every run by `app-down` (the predecessor's scratch folder tool, copied, never edited). Ports 9223 and 5400 are free. I killed nothing else.
- **For the custodian:** the K6 (iii) failures are race-dependent in principle. Here they reproduced in 5 of 5 odd-height runs (799, 801, 803, 805 and the injected 731.2) and 0 of 3 even-height runs. All were in shared holds; re-running one alone is the custodian's call.

## Off-scope noticed, not done
- `WorkingCanvas.tsx` comments say deck 9.3.7 is pinned; the lockfile installs 9.3.9.
- My probe's `directCompare` called hover-mode `_pick`, which mutates deck's `lastPickedInfo`; the shipped code does not.

## Files (all outside the repository)
All in my scratch folder: `pickw/probe-k6.mjs`, `pickw/k6iii-run.mjs`, `pickw/k6iii-gen.mjs`, `pickw/mkgen.mjs`, `pickw/build-pick.sh`, `pickw/tauri.pick.conf.json`, `pickw/app-up.ps1`, `pickw/app-down.ps1` and `pickw/shim/npx.cmd` (copied from the predecessor's scratch folder), console logs `pickw/*.console.txt`, build log `pickw/build.log`, outputs in `pickw/out/`.

## Final state
- `git status --porcelain` in `C:/dev/wt/pick`: **empty**. HEAD bac14f81a4a8ce1eae30684da8a4cfbbfabd8d9f.
- Gitignored outputs I created there: `frontends/shell/node_modules/`, `frontends/shell/src/generated/`, `frontends/shell/src-tauri/gen/`, `renderer/bundle-viewer/node_modules/`, `renderer/bundle-viewer/dist/` and `dist-metafile.json`.
- Build target `D:/wt-targets/pick` holds the debug build. No commit, no publish.
- Model observed: Sonnet 5.5, no override, no context handoff.
