*Custodian's filing note (2026-10-12): the worker-high's report on the E-KINDS point click (the hover names id 0, the click finds nothing), at cdc8a423 with no commit: cause (c), the hover's truncated and the tap's rounded pointer coordinates, shown by a harness outside the repository; it stopped before any product change because every product fix changes a rule the form states, the run 2026-10-12T09:18:09Z to 2026-10-12T09:36:31Z by its transcript (Read 2, Bash 68); its one SubagentHandback call, at 09:36:29Z. It arrived as a message and is extracted here by script. One change: the scratchpad path of its harness, which held a local profile path, is replaced by the bracketed placeholder. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is a5e6cf16ca76feae62548de7a3a562f3aa1786a287a0a0d4beb2b0a47a5b950d; this file's, from line 5 to the end, is 0d06700f62d421c8ef762e77418ac3e7f4e83a1a8c331a53ec768556e08f581d.*

---

REPORT: E-KINDS (point), hover names id 0 but the click finds no feature. I stopped before any fix and made no commit.

**Head and commits.** Head is cdc8a423d4793eafc17c2c0f8985abc63876326d, as given. I fetched origin first and the porcelain was empty. I made no commit and no push. Final porcelain: empty.

**Cause: (c), with an e2e trigger. It is not (a) and not (b).**

1. **The hover and the tap read the pointer through two different rounding rules.**
   - Hover is deck's `onHover`, fed by mjolnir's `mousemove` listener. It reports `event.clientX` and `clientY` as `MouseEvent` delivers them (`node_modules/mjolnir.js/dist/inputs/move-input.js:119-122`).
   - Chromium truncates those to whole CSS pixels.
   - The tap is Hammer's. It rounds the pointer-up position (`node_modules/mjolnir.js/dist/hammerjs/input/get-center.js:9-10`), and `offsetCenter` is that rounded value minus the rect (`utils/event-utils.js:65-68`).
   - So for a fractional pointer coordinate, such as the .5 coordinates the e2e supplies, the tap lands on the pixel down and right of the hover pixel. At .5 that is +1 px per axis.
   - At integer coordinates the two agree exactly.
   - Product wiring: `onClick: (_info, event) => onTap(event)` (`WorkingCanvas.tsx:2023`), then `pickCandidateAt` (`WorkingCanvas.tsx:1236-1244`), which is exact-pixel for points.
2. **Why only points fail.**
   - On a polygon, a 1 px shift stays inside the polygon.
   - An 8 px dot (`POINT_RADIUS_PX` = 4) has no slack at its edge.
   - The e2e puts the hover at `hits[0].css`. For a sparse point file I expect that to be the unverified fallback pixel: `candidatePoints` falls back to a region's `samplePoint` (the first pixel of the densest colour bin in scan order). That is not verified against `INTERIOR_PATCH_RADIUS`, and I read it as an edge pixel of the dot.
   - I did not observe `hits[0]`. That is an inference, not a measurement.
3. **The evidence line is consistent with this.**
   - Point (331.5, 533.5) with rect left 266 and top 40 gives hover pixel (65, 493) and tap pixel (66, 494).
   - The rounded retry sits at integer (332, 534). Its hover and tap pixel is (66, 494), and it gave null. That fits a dot whose edge pixel is (65, 493) with (66, 494) outside it.
   - The buffer-centre retry is the same point as `point`, so it taps (66, 494) too.
   - Hammer rounding the rounded retry again changes nothing.
   - The final hover readout, id 0, comes from the last move at (65, 493).
4. **What I checked and ruled out.**
   - (a): `pickingRadiusFor` is undefined for points. Deck's `pickingRadius` default is 0, and the hover and the tap both call `pickObject` with radius 0. The only difference is deck's `mode`, hover versus query, and it does not enter the pick (`pick-info.js`, `deck-picker.js`).
   - (b): a vitest case with the real decoded `lv95-point-batch` (ids 0n to 5n), through `resolveClickPick` and `resolvePick`, gave a feature for every ordinal including 0. This was a scratch test, not kept. `boundsOfRow` on the one-vertex part is non-null.
   - The device pixel is the same for hover at 331.5 and tap at 332. luma's `scalePixels` rounds both to the same pixel, so the pick call itself does not cause the miss.

**Evidence run.** I made a throwaway harness outside the repo. It is deck 9.3.9 from the lockfile, a `ScatterplotLayer` with radius 4 px, and the product's wiring: mjolnir hover, and `onClick` calling `pickObject` at `event.offsetCenter`. It ran in Playwright's headless Chromium with SwiftShader at DPR 1, not WebView2. It is in the session scratchpad's `h1/` folder ([a profile path, removed by the custodian]), as `main.js`, `main2.js`, `drive.mjs`, `drive2.mjs` and `drive3.mjs`.
- Mouse at (602.5, 410.5): hover offsetCenter (336, 370) picked index 0. The click's offsetCenter was (337, 371), and `pickObject` returned null.
- 11 x 11 grid of positions around the dot, DPR 1, all at .5 coordinates: 13 of 121 positions had hover hit and click miss, and another 13 had the reverse.
- Same grid at integer coordinates: 0 mismatches, 60 both hit and 61 both miss.
- DPR 1.25 on a 0.8 px grid: 0 hover-only and 5 click-only of 121.

**Reproducing test.** I wrote none. The mismatch lives in mjolnir and Chromium event coordinates, so a vitest case cannot reproduce it. Every product function the click uses passes on a point batch. I did not add a guard test, because it would be a green test for a path that is not at fault.

**Why I stopped.** Any product fix changes a rule the form states.
- §2.2 says the tap takes `event.offsetCenter` and picks that exact pixel.
- §8 item 3 forbids taking the pick from the hover or from deck's pointer-down info.
- The options below either change the pixel source or add a tolerance. The brief says to prefer neither.

**The smallest fixes**

1. **E2E, recommended.** A real mouse at 100% scaling cannot produce a .5 client coordinate, so this is a test defect. In `hoverHits` (`e2e/selection.mjs`, the line `const css = bufferPointToCss(point, rect, bw, bh, fy);`), round both coordinates to integers:
   `const exact = bufferPointToCss(point, rect, bw, bh, fy); const css = { x: Math.round(exact.x), y: Math.round(exact.y) };`
   - Hover and tap then use the identical pixel. The harness shows 0 mismatches at integer coordinates.
   - It is not a barrier or an establishing read, so §8 item 32 is untouched.
   - `selection.mjs` counts 650 added and 8 deleted, so 658 on the §7 count, against the file ceiling of 650 and G-E's disclosed margin of 100. This change adds about 2 lines.
   - I did not make it, because the task named a product defect and I cannot run e2e.
2. **Product, only on a ruling.** There is a real mismatch of up to 1 CSS px between the hover pixel and the tap pixel at fractional pointer positions. A user on a 125% or 150% display can hit it at the edge of a dot.
   - Option P1: pick at the pixel `Math.floor(srcEvent.clientX) - rect.left`, and the same for y, so the tap matches the hover's convention. This leans on Chromium truncating `MouseEvent` coordinates.
   - Option P2: give the click on points `radius: 1`.
   - Both change the pixel rule or add a tolerance, so I recommend a ruling, not a worker call.

**Lines: affected, but only at the pick tolerance boundary.**
- The harness used a 2 px `PathLayer` with radius 4 on both the hover and the `pickObject`, over 30 positions.
- It gave 1 hover-only and 1 click-only. The hover-only case was a pixel exactly 4 px from the line, hover at (334, 372) against click at (335, 373).
- The e2e hover candidates are drawn line pixels, so they sit within about 1 px of the stroke. The 1 px shift stays well inside the 4 px radius. I expect the line branch to pass.

**Commands and exit codes** (all at head, nothing changed)

| Command | Exit | Result |
|---|---|---|
| `node scripts/plan/verify-cites.mjs` | 0 | PASS |
| `node scripts/plan/verify-quotes.mjs` | 0 | PASS |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node --test` over the three script suites | 0 | 457 pass, 0 fail |

- I did not run `npm run verify`, because no code changed. The scratch vitest case ran once outside it and I deleted the file.
- The harness ran no app and no hold. It ran about 6 minutes in total, headless and non-heavy (headless Chromium with SwiftShader, one browser at a time), and I started no hold because of that. I found no leftover browser process afterwards.

**§7's count for files touched:** none touched. For reference, `selection.mjs` is 658 now.

**For the next e2e run**, with fix 1 applied:
- Check that the E-KINDS point step passes.
- If it still fails, the `retries.rounded` entry will now be at the very pixel the hover confirmed. If that retry also returns null, the cause is not rounding. It would then be a real pick-versus-hover state difference inside the app, which my harness did not reproduce. I would next log the `info.x` and `info.y` that `onHover` and the tap each receive.
- The line branch of E-KINDS, which has never run, should pass. If its hover hit comes from the fallback sample, it could still land at the radius boundary.

**Untouched:** I did not edit `WorkingCanvas.wiring.test.tsx`, `StudioLayout.test.tsx`, any double-click code, `state/`, `PLAN.yaml` or the form.
