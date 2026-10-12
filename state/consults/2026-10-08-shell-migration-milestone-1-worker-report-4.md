*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 4 worker report, the seven re-aims under the human's Decision A (Amendment 6), at the branch head 65391e79b048f51f3ca4d7b5eeac7533f5b64639 (the same worker-high, resumed about 14:30Z, report at 15:42:37Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript. Its sha256 as written, with one final newline, is a5d2dbdd0a522f70b5a28dfece36fe8546c1a9bd9a38dc33418d049afc07db04. One disclosed rewrite: on the line about scratch tooling, a folder path under the user profile is replaced by the words the session scratchpad's m1w folder, since no user-profile path is filed. Decision A's condition that each re-aimed check is shown still able to fail is NOT met: the worker's one product-file mutation edit was refused by the permission system, and it made no other attempt. That goes to the human. Names below are at that head or at the merge base it names.*

---

# Stage 4 report: node:shell-migration-milestone-1@g7, the seven re-aims

**Status: the five re-aims are committed and pass twice at the fix head. The "still able to fail" mutations are NOT observed, because the permission system denied the one product-file edit I tried (details in section 4). Treat the work as incomplete until the human decides that.**

Fix head: **65391e79b048f51f3ca4d7b5eeac7533f5b64639**, published. Two things are not done: the recorded-mutation comments commit (it names observed mutations, so it was not made), and the PR-body mutation statements (proposed in section 4, unobserved). The m1 worktree is clean at the fix head, no tracked file carries a mutation, and ports 9223 and 5400 are free.

## 1. Commits (signed off, message from a file, two trailers, each pushed in its own call)

| Hash | Subject |
|---|---|
| 25a8a881 | fix: regression.mjs A9' and K6 stop depending on one candidate pixel (milestone 1 re-aim, Amendment 6) |
| c026acb6 | fix: filter-panel.mjs FIND' floor derived from the measured canvas (milestone 1 re-aim, Amendment 6) |
| 315409c0 | fix: console.mjs CLASSC' clicks the Style tab before its real fill (milestone 1 re-aim, Amendment 6) |
| db8aa161 | fix: pan-anchor.mjs drags and reads derived from the measured map (milestone 1 re-aim, Amendment 6) |
| 65391e79 | fix: source-changed.mjs post-route S4 pans as far as the mint needs (milestone 1 re-aim, Amendment 6) |

Only the five e2e files changed. No other suite, step, threshold or product file was touched.

## 2. The seven checks

**How the runs were done.**
- All runs use the hand-launched app of stage 2 (port 5180 is still excluded). "Shim" means the suite launched the app itself (`launched:true`). "Wrapper" means my scratch launcher started a fresh app, set the window, and imported the suite, so the suite reports `launched:false`.
- The map is 668 x 730.2 at a 1280 x 800 window and 668 x 731.2 at 1280 x 801.

### A9' (regression.mjs, stepA9)

- **Old assumption.** The first notch with an interior-verified pixel is also a notch where the product answers a hover. A search that sees the frame-wide non-background count fall on two notches in a row has overshot, so it stops. On the old map (about 1280 x 200) both held. The outcome then rode on one pixel.
- **New assumption.** The search goes on until the product answers a hover with an id. The product's own named refusal ("below pick resolution") at a notch is the signal to go on, not a failure. The two-decline stop is removed; the zero-count stop stays.
- **Derivation** (stated in the comment above `stepA9`).
  - `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX` is 9, so a hover is refused while average extent x 2^zoom < 9.
  - Parcels are rings of radius 0.42 of the 40 m cell (`parcel` in `engine/src/fixture.rs`), so the extent is at most 33.6 m and an answer needs zoom >= log2(9/33.6) = -1.90.
  - The fit on this map is zoom -4.57 and one wheel notch adds 0.93, so the first notch that can answer is notch 3 (-1.78) at the earliest.
  - Measured in the render trace: refusal at -1.78, id at -0.85. So the extent is between 16.2 and 30.9 m, and the first answering notch is 4.
  - The 15-notch budget is unchanged.
- **Results at 65391e79.**

| Run | Map | A9' |
|---|---|---|
| 1 (shim) | 668 x 730.2 | PASS at notch 4, pixel (425,5), 1 attempt, "id 27683" |
| 2 (wrapper, window 1280 x 801) | 668 x 731.2 | PASS at notch 4, a different pixel (425,471), 5 attempts, "id 29272" |

  - Run 2 is the one-row-different buffer that failed before. The same code also passed in a trial run at 1280 x 800.
  - Whole suite: only the pre-existing C2'/C3' fails, rc 1 each.

### K6 (regression.mjs, stepK6)

- **Old assumption, case (iii).** The id after a zoom-in then zoom-out pair equals the id the hover was first established with. This held only if the stationary pointer stays on the same feature across the zoom-in notch. On the 731-row buffer it did not (50244 -> 53722).
- **New assumption, case (iii).** The zoom-out step is compared with the id **standing when that step begins**. If the zoom-in left no id standing, the hover is established again from the current camera. What the case asserts about the product is unchanged: after one zoom-out with the pointer stationary the readout still names the feature under it, backed by a confirming re-pick trace.
- **Old assumption, case (ii).** The hover is established far enough above the threshold that several zoom-out notches keep an id standing, so the "confirming" marker has several mid-gesture reads.
- **Why that failed here.** On this map the first answerable notch is the first one tried, so the first zoom-out notch crosses the threshold, where the product answers with the refusal and not the marker. One notch had an id standing and the case read it once.
- **New assumption, case (ii).** Zoom in `K6_STANDING_NOTCHES_MARGIN` = 2 more notches first.
  - The established camera is at most one notch above the threshold, so the first two zoom-out notches then stay above it.
  - Two independent reads are what "never sighted once" needs to mean something.
  - The assertion on those reads is unchanged.
- **Results at 65391e79.** K6 PASS on both runs, all of (i) to (v).
  - Run 1: (ii) "8 notches, 2 showed an id, marker sighted at 2/3 notches with an id standing, 0 settle races".
  - Run 2 (buffer 731): same shape.

### FIND' (filter-panel.mjs, stepFind)

- **Old assumption.** A floor of 0.5% non-background, calibrated on 4036 of 285,440 px (1280 x 223).
- **New assumption.** The matches are the last 99 ids of a row-major grid of 2,000 columns (`id % cols`, `id / cols`, `cols = ceil(sqrt(4,000,000))`): one strip 99 cells wide, one cell high. It is fitted to the canvas width, so the drawn area scales with width squared.
  - `floor = (0.005 / (4036/285440)) x 4036 x (width/1280)^2 / (width x height)`, using the capture's own width and height.
  - That is 0.5% at 1280 x 223 and about 0.08% at 668 x 730. A blank canvas is 0%.
  - The old floor's own ratio to its own measurement (the ~2.8x headroom) is kept.
- **Results at 65391e79.**

| Run | Map | FIND' |
|---|---|---|
| 1 (shim) | 668 x 730 | PASS, 0.27% > 0.08% |
| 2 (wrapper, 1280 x 801) | 668 x 731 | PASS, 0.27% > 0.08% |

  - The whole suite is 5/5 in both runs.

### CLASSC' (console.mjs, stepClassC)

- **Old assumption.** The Style disclosure is visible.
- **New assumption.** One real click on `#inspector-tab-style` before the fill.
- **One click beyond the ruling.** A second click returns to the Layer tab (`#inspector-tab-layer`) after the fill. Without it the console suite's REGRESS' subprocess ran regression.mjs on the same page with the Style tab showing, and its FIND' timed out on the hidden filter input. I observed that in a trial run.
- **Results.** CLASSC' PASS on both console runs (shim, twice). The statement, the owner "ADR-022 / ADR-023" and the no-copy-button check are intact.
- **Remaining failures in the console suite**, all pre-existing:
  - HEXLIM' fails (key set now includes `columns`) in both runs.
  - GROUP' fails in both runs.
  - REGRESS' fails in both runs, carrying only C2'/C3' in its tail.
  - REFUSAL' failed once (run 1: "no refused viewport_query class-A entry found in the DOM") and passed in run 2. This is a flake of an untouched step.

### pan-anchor.mjs (the four checks)

- **Old assumptions.**
  - The paint-vs-event drag of 250 px keeps the dataset in frame.
  - There-and-back drags of 300 px start inside the box.
  - A fixed 500 ms after a camera jump is enough for the dataset to fill.
- **Cause of the large-box failure.** Not strip quantisation. I measured it at 1400 x 900: the first centroid read saw 2,484 non-background pixels where the filled dataset has 18,410. After the fill is stable, painted and deck shifts agree to within 0.1 px at every dx tried.
- **New assumptions.**
  - Paint-vs-event drag = `min(250, floor((cw - 140.2)/2 - 8))`.
    - 140.2 px = 317 columns x 40 m at zoom -6.5, from the fixture.
    - 8 = twice the frozen 4 px tolerance.
    - That gives 85 at the 328 px box and 250 at 788.
  - There-and-back drag = `min(300, floor(cw/2) - 8)`, so the second mousedown is inside the box (156 at 328, 300 at 788).
  - Each centroid is read after the frame-wide non-background count is unchanged on three consecutive reads (300 ms apart, 20 s bound).
- **Unchanged.** The 4.0 px tolerance and every other check.
- **Results at 65391e79 (shim, twice).** 16/16 both times.
  - small: paint-vs-event ±85 within 0.01 px, there-and-back-net 0.00 px.
  - large: paint-vs-event 250 at -0.08 px and -250 at 0.03 px, there-and-back-net 1.00 px.
- **One extra edit.** `setCam` now waits up to 5 s for its view-state line.
  - Two of the first three trial runs, and one base run in stage 3, died there with `undefined.targetX`, on a loaded machine.
  - It sits outside the four checks but is a shared helper they need. Flagged as a deviation in section 5.

### source-changed.mjs, post-route S4 (S5a to S5d follow)

- **Old assumption.** Two drags of 80% of the box width leave the resident tile cover. At the 668-wide map that is 1.8 km of world, inside the cover.
- **New assumption.** Drag as far as the mint needs and no further.
  - The post route drags until the first new `stream-issued` line has been answered with the mtime touch, stopping at the next drag boundary.
  - It is bounded by the fixture's own extent in px at the current zoom: `ceil(317 x 40 x 2^zoom / (0.8 x box width))`, which is 13 at zoom -0.90.
  - `panByViewports` gained an optional `shouldStop`. The pre route's call is unchanged.
- **Results at 65391e79 (shim, `launched:true`, twice).** S1 to S5d and fixture-integrity all PASS.
  - S4 PASS: "a stream-issued line followed the pan-beyond-viewport gesture (17 -> 19)".
  - The ladder was 13 drags, 6947 px.
  - S5d confirms `tile-session-ended-source-changed` and no `tile-stream-mint-refused`.

## 3. Governance checks

`node e2e/citationIntegrity.test.mjs`: 30 passed, 0 failed. `node e2e/residencyTrace.test.mjs`: 76 passed, 0 failed. `node --check` on all five files.

## 4. "Still able to fail": NOT OBSERVED, and why

**What happened.** I applied, in the m1 worktree, the first mutation (`sed -i '1099d' src/streaming/tileViewportStreamManager.ts`, deleting the `traceStreamIssued` call, followed by `git diff` and my `app-down.ps1`). It was denied by the auto-mode classifier, reason "[Modify Shared Resources]", and the denial covers the outcome. I made no further attempt to edit a product file through any route (no other tool, no scratch worktree copy). The command did not run, so nothing was modified. The tree is clean at 65391e79.

**What I need from the human.** Permission to temporarily edit product files in the m1 worktree, one at a time and reverted after each run, to observe these mutations. Stage 2 did this for the E rows without a denial. The coordinator cannot grant it.

**Mutations I intended**, each to be observed at 65391e79 by running the named suite on a fresh launch:

| Check | Mutation | Expected failure |
|---|---|---|
| S4 | delete the `traceStreamIssued(...)` call, `tileViewportStreamManager.ts:1099` | S4 fails ("no stream-issued line followed any gesture in the ladder") and S5a to S5d cascade |
| S5b (the file's recorded mutation, header lines 40 to 59) | delete `canvas?.clearAllTiles();` in `endCandidateSession`, `candidateArmSession.ts:1089` | S5b fails with "resident vertices are N (features M), expected 0" and S5a, S5c pass |
| A9' | `isBelowPickResolution` returns `true` (`pickResolution.ts:204-206`) | the 15-notch walk ends in "A9': .hover-readout never appeared" with refusal attempts |
| K6 (ii) | delete the marker `<span>` (`HoverReadoutView.tsx:88`, recorded mutation 1 of HOVER-CONFIRMING-MARKER-PREREGISTRATION.md) | K6 (ii) fails "the labelled state rendered ... with NO marker element" or "never observed" |
| K6 (v) (recorded, HOVER-REPICK Amendment 5) | delete `lastPointerPxRef.current = null;` in `onPointerRelease`, `WorkingCanvas.tsx:1860` | K6 (v) fails: an id after the release edge |
| FIND' | make `resetFitForNewGeneration()` a no-op (`WorkingCanvas.tsx:1505-1508`) | FIND' "effectively blank" |
| CLASSC' | change the `style.setFillColor` owner away from "ADR-022" (`surfaceRegistry.ts:179`) | "no .console-entry-class-c entry with an ADR-022 owner" |
| pan-anchor paint-vs-event | multiply the `traceViewState` target x by 1.1 (`WorkingCanvas.tsx:1943`) | paint-vs-event fails by name |
| pan-anchor there-and-back-net | none chosen. A trace-scale mutation cancels in the net, and I have not found an honest product mutation for it. | |

**What I did instead (input side only, no product file).** I ran a scratch copy of filter-panel.mjs with a predicate matching no row. FIND' failed earlier than the floor: "button.filter-cancel never appeared after Apply", because a zero-row scan is instantaneous. So that is not evidence about the floor. That the floor rejects a blank canvas rests on arithmetic only (0% <= about 0.08%). All seven checks did fail at the pre-re-aim head f214f1f4 (stage 2 and stage 3), but that shows they respond to the map, not to a product defect.

## 5. §7 per group, three-dot from the merge base

Command: `git diff --numstat origin/main...HEAD -- frontends/shell` with the form's three excludes. Merge base 45e7a0b052261adb97bd8541340f30834a6088bb, head 65391e79, taken after a fetch. This merge base differs from the one in the earlier reports (they counted from e888787e), so the groups below are read at 45e7a0b0.

| Group | Lines | Ceiling | |
|---|---|---|---|
| G1 | 952 | 1,000 | within |
| G2 | 273 | 450 | within |
| G3 | 337 | 400 | within |
| G4 | 66 | 100 | within |
| G5 | 1,004 | 900 | over by 104 (unchanged) |
| G6 | 621 | 400 | over by 221 (it was 383 before this stage) |
| Total | 3,253 | 3,250 | over by 3, over 28 files (the form says 25; console, filter-panel and pan-anchor are the three added) |

- G6 by file: layout 357, regression 148, pan-anchor 56, source-changed 31, filter-panel 18, console 6, style 3, source-watch-idle 2.
- Class 8 records for G5, G6 and the total are for the gated head, and the form is not edited.

## 6. Commands, exit codes, holds

Every heavy command was held (`hold shared -Project SpatialIDE`), one per call, `cd` first, the command step alone, with no pipe or `&&` after it. `app-down.ps1` ran in its own unheld call between runs.

| # | Command (all held) | rc |
|---|---|---|
| 1 | pan-anchor centroid exploration (scratch copy, wrapper, 1400 x 900) | 0 |
| 2 | trial: source-changed post route (wrapper) | 0 |
| 3 | trial 1, 2, 3: pan-anchor.mjs (wrapper) | 2, 2, 0 (the first two are the `setCam` crash fixed afterwards) |
| 4 | trial: filter-panel.mjs | 0 |
| 5 | trial: console.mjs | 1 (HEXLIM', GROUP', REGRESS' pre-existing; the REGRESS' subprocess FIND' hit the Style tab state, which led to the restore click) |
| 6 | trial: regression.mjs | 1 (only C2'/C3', pre-existing) |
| 7 | final run 1 of regression.mjs (shim) | 1 (only C2'/C3') |
| 8 | final run 2 of regression.mjs (wrapper, 1280 x 801) | 1 (only C2'/C3') |
| 9 | final run 1 of filter-panel.mjs (shim) | 0 |
| 10 | final run 2 of filter-panel.mjs (wrapper, 1280 x 801) | 0 |
| 11 | final run 1 and 2 of console.mjs (shim) | 1, 1 (pre-existing failures as above; CLASSC' PASS) |
| 12 | final run 1 and 2 of pan-anchor.mjs (shim) | 0, 0 |
| 13 | final run 1 and 2 of source-changed.mjs, post route (shim) | 0, 0 |
| 14 | scratch FIND' input check (predicate matching no row, wrapper) | 1 (earlier failure, as in section 4) |

Not held: `git commit` (5) and `git push` (5), each in its own call; `git fetch`; the numstat; `node --check`; the two light `node` test files.

## 7. Deviations, with classes

- **Mutations unobserved (section 4).** Blocked by the permission denial. Needs the human's decision; I do not classify it.
- **Class 2, run 2 launch method.** Run 2 of regression.mjs and of filter-panel.mjs used the wrapper (a fresh app, but `launched:false`) at a window 1 row taller, to exercise a one-row-different buffer. Everything else used the shim, as in stage 2.
- **Class 2, judgement flag on K6 case (iii).** Comparing with the id standing when the zoom-out begins, not the id the hover was first established with. I believe this keeps what is asserted about the product, but it is the one change most likely to be read as touching the assertion, so the reviewer should look at it first.
- **Class 3, `setCam` wait in pan-anchor.mjs.** A shared helper, outside the four named checks, fixed for a crash on a loaded machine.
- **Class 3, CLASSC' restore click.** A second click, beyond the ruled one.
- **Class 3, source-changed `panByViewports(page, rect, drags, shouldStop)`.** The pre route's call and behaviour are unchanged.
- **Class 8, G5, G6 and the total** (section 5), for the gated head. Stage 2's launch workaround (excluded port 5180) is unchanged.

## 8. Noticed

- S4's pan is now 13 drags (6947 px, about 13 km) and ends just past the dataset's east edge (12.7 km). The bound is by construction and sufficient. It could be tightened if the human wants.
- The first stream-issued line arrives only after the pan has ended (planning is on settle), so the stop-at-touch does not shorten the pan in practice.
- Console's REFUSAL' flakes (one fail in four m1 runs). I did not touch it.
- The pre route of source-changed still fails S4 as before (pre-existing, out of scope).
- Scratch tooling, all outside the repo, in the session scratchpad's m1w folder: `diag-run.mjs`, `pa-explore.mjs`, `fp-blank.mjs`, `cm1.txt` to `cm5.txt`.
- `C:/dev/wt/m1-base` is not recreated.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).
