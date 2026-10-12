*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 3 worker report, the diagnosis of the I3 failures, with no tracked change (the same worker-high, resumed about 06:03Z, report at 06:50:17Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript. Its sha256 as written, with one final newline, is e00acce44560439e66a86a03ad63d49c8ecac24bd3f1b3bbc2911d992b1b103e. One disclosed rewrite: on the line about scratch files, a folder path under the user profile is replaced by the words the session scratchpad's m1w folder, since no user-profile path is filed. The branch is at f214f1f4b0a3a1ee43c265c639521c35ca1ee55f, and names below are at that head or at the base e888787e.*

---

# Stage 3 report: node:shell-migration-milestone-1@g4, diagnosis only

**Result: all six failures are class (G). I found no (B).** For each one, the base e888787e run at the m1 map size fails the same step. The base also failed 3 of the 4 pan-anchor checks and the post-route S4 in exactly the same numbers as m1 (the two exceptions are in the pan-anchor row).

No tracked file changed and I made no commits. The m1 worktree is clean at f214f1f4b0a3a1ee43c265c639521c35ca1ee55f. `C:/dev/wt/m1-base` is removed. Ports 9223 and 5400 have no listener; one TIME_WAIT client socket on 9223 is lingering. I started no process that is still running.

## How the base was sized

- **Measuring.** `Browser.setWindowBounds` over CDP sets the page's inner size exactly, even beyond the screen. I measured the m1 map and then fitted the base window until its canvas matched.
- **m1 head** (`.working-canvas`, with the 100k fixture admitted):

| Window | m1 canvas |
|---|---|
| 1280x800 (all suites except pan-anchor) | 668 x 730.2 |
| 820x640 (pan-anchor "small") | 328 x 570.2 |
| 1400x900 (pan-anchor "large") | 788 x 830.2 |

- **Base windows that give the same canvas.** The base canvas is the window width by (window height minus about 723), because the panels stack above it. The fractional height always ends in .7, since the window height is an integer:

| Base window | Base canvas |
|---|---|
| 668x1454 | 668 x 730.7 |
| 668x1453 | 668 x 729.7 |
| 328x1428 | 328 x 570.7 |
| 788x1554 | 788 x 830.7 |

- **Which window each base run used.**
  - The A9', K6 and FIND' comparisons used 668x1454.
  - The post-route source-changed run used 668x1454.
  - The pan-anchor run used 328x1428 and 788x1554.
  - The extra regression run, to match m1's buffer height, used 668x1453 (buffer 668x730).
- **How I ran them.** A scratch wrapper starts the hand-launched app (the same exe and the same port 5400 workaround as stage 2), sets the window, logs the canvas size every 2 s, and imports the suite from the chosen tree in-process. The suite therefore attaches and reports `launched:false`. Stage 2 saw the identical source-changed result with `launched:true`.

## Per failure

### A9' (regression.mjs, step stepA9)

- **Assumption.**
  - A zoom-in search of up to 15 notches finds a pixel whose 5x5 neighbourhood is entirely non-background with alpha >= 150. It stops early after two consecutive notches where the frame-wide non-background count falls ("rise then fall to zero", calibrated on the old small canvas).
  - It then hovers that pixel and expects an id readout.
  - This presumes the first interior patch appears at a zoom above the hover's pick-resolution threshold. That threshold is `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 9` in `canvas/pickResolution.ts`: a hover is refused while the average feature extent times px per metre is below 9 px.
- **m1, run twice (stage 2 and a control today).** It stops at notch 3 on two declines with no interior-verified candidate. Non-background pixels per notch were 210282, 251790, 223330 and 192213 of 487,640. The best candidate at notch 3 had 3/25 neighbourhood pixels touching background.
- **Base at 668x730.7:** FAIL, twice, identically: "`.hover-readout` never appeared over any of 4 read-back-verified attempts".
  - A candidate at buffer (253,571) was interior-verified at notch 3 (zoom -1.78, alpha 180).
  - Its hover read "below pick resolution" (and "clear" with the other flipY).
  - The same ledger shows the next notch (zoom -0.85) answers with an id.
- **Base at 668x729.7 (buffer 668x730, as m1):** FAIL with m1's exact signature. It stops at notch 3 on two declines, the notch-0 count is 210282 as at m1, and the candidates are edge-adjacent.
- **Why the two base sizes differ.** The only difference is one buffer row, 731 versus 730. It changes which 4x4 sub-cell the bisection picks at notch 3. The scene is the same: the counts are 191392 against 192213, and zoom is -1.78 both times.
- **Class: (G).**
- **Mechanism, from this evidence.** The fit zoom on a 668x730 canvas is -4.57. Notch 3 is zoom -1.78, one notch below the pick threshold, and notch 4 (zoom -0.85) is the first that answers. The early-stop rule ends the search at notch 3, because the 43% filled frame can only shrink as it zooms in. Whether the notch-3 pixel then fails on interior or on hover is decided by a rounding of the buffer height.

### K6 (regression.mjs, step stepK6)

- **Assumption.** From a hover that shows an id, zoom out 8 or more discrete notches. It expects the standing id's "confirming" marker to be sighted at least once between a camera change and its settle. It also expects that one zoom-in then one zoom-out notch, pointer still, returns the same feature id.
- **m1, run twice.** It fails in the discrete part: "across 8 discrete notch(es), 1 of them with a confirmed id standing when the notch arrived, the labelled "confirming" state was NEVER observed". Only one notch ever has a standing id, because zoom-out immediately drops below pick resolution (the zoom sequence runs below -1.78). The marker check is a one-read race on that single notch.
- **Base at 668x729.7 (buffer 730):** the identical failure, the same text. Parts (i), (iii) and (iv) passed first.
- **Base at 668x730.7 (buffer 731), twice:** FAIL earlier, in the re-pick. The id was 50244 before the zoom-in/zoom-out pair and 53722 after (53722 was also the id after the zoom-in). That is the same candidate-pixel sensitivity as A9': one buffer row changes which pixel gets hovered.
- **Class: (G).** Every K6 variant fails at this map size and none passes. The failing sub-assertion depends on a one-row difference in the buffer.

### FIND' (filter-panel.mjs, step stepFind)

- **Assumption.** After a filter that matches the last 100 ids of the 4M-row slow fixture, the whole-canvas non-background fraction must exceed a floor of 0.5%. The step's own calibration quotes "1.41% non-background, 4036/285440 px".
- **Fixture geometry.** `fixture.rs` lays features on a row-major grid with `cols = ceil(sqrt(N))` and 40 m cells. For 4M features that is 2000 columns. The last 99 matching ids are one row of the grid: a strip about 3960 m wide and 40 m tall.
- **m1 (stage 2):** 0.275% against a floor of 0.5%.
- **Base at 668x730.7:** FAIL, 0.284% non-background, settled=true, with the same error text. The canvas at that point was 668x705.7 because the base's panels shift the canvas by their state.
- **regression.mjs's FIND' is a different step.** It is on a different fixture and passes everywhere: 0.28% to 0.29% against its own bound, on m1 and on the base at both sizes.
- **Class: (G).**
- **Mechanism (arithmetic, an inference, not measured).**
  - A strip that fits the canvas width has its pixel area scale with the width squared, and the fraction scales with width over height.
  - Scaling 4036 px by (668/1280)^2 gives about 1100 px. The measured count at m1 is about 1340 px (0.275% of 487,640), the same order.
  - The 1.41% calibration was a wide, short canvas. The floor only holds for a canvas at least about twice as wide as tall.

### pan-anchor.mjs (4 checks)

The suite's own `resizeWindow(820,640)` and `resizeWindow(1400,900)` set the window, and the instrument is identical in both trees. For the base I ran a scratch copy that took the two sizes from env, with nothing else changed.

| Check | m1 | Base at the same canvas | Assumption and mechanism |
|---|---|---|---|
| small paint-vs-event dx=250 and dx=-250 | "content left frame" | **identical** | Dataset width at z=-6.5 is 12680 m times 2^-6.5, about 140 px. A 250 px drag moves its centre from 164 to 414, past the 328 px canvas edge. |
| small there-and-back-net | -292 px | **-292.00 px** | Drag 1 goes +300 from x=164, so the pointer ends at 464, outside the 328 px canvas. Drag 2 starts at 464, outside the canvas, so it pans nothing. |
| large paint-vs-event dx=250 | 4.35 px (tolerance 4) | **5.35 px** | The centroid uses 128 vertical strips of 6.16 px at 788 px wide; the tolerance is 4 px. A ±3 px quantisation per read is an inference. dx=-250 passes in both trees (0.04 px). |

- Base results on the other checks: small normal-A and recenter-crossing passed, large normal-A (dx=±300), pixel-spaces-coincide, there-and-back-net (1.00 px) and recenter dx=+1200 passed.
- The base scratch run then crashed on the last check (large recenter dx=-1200): `TypeError: Cannot read properties of undefined (reading 'targetX')`, which is an empty view-state read after `setCam`. It is outside the four checks. It was not reproduced.
- **Class: (G)** for all four checks. Note these are not the old geometry: the base passed 16/16 at its own window sizes in stage 2. The small canvas is 328 px wide, and the suite's drag distances need roughly 640 px or more.

### source-changed.mjs, post route, S4 to S5d

- **What S4 waits for.**
  - Step `S4-issue-one-query-and-touch-on-mint`. `touchOnFirstNewStreamIssued` polls every 5 ms for a new `[render-trace] stream-issued` line above the baseline, up to 30 s per rung.
  - Rung 1 is "pan beyond viewport": two drags, each from 90% to 10% of the canvas width, which is 534 css px per drag and 1069 px in all at m1.
  - Rung 2 is one zoom-in notch.
  - On the first new line it touches the scratch parquet's mtime. Two rungs make the 60 s timeout.
  - S5a to S5d fail because the file was never touched. They report no `.canvas-session-ended`, 20163 resident features still shown, a hover still naming id 131, and no `tile-session-ended-source-changed` line.
- **Why nothing arrives at m1 within 60 s.**
  - After the pan and the zoom rung there are 0 `viewport_query` and 0 `stream-issued` lines. The 17 and 17 present at the end were all issued before S4, in S2's notch search.
  - After the last query line at trace index 163 (212 entries in all) there are 25 view-state lines. The camera moved from targetX 0 to 1799 m at zoom -0.90, then the zoom notch went to 0.03.
  - No `tile-ingest` or `batch` lines follow, and the residency status stays "Showing all 20163 features in view".
  - The tiled arm plans a query only for a covering tile that is not resident. The suite's own header says this about run 4. The tile cover that S2's zoom-in search left resident already includes the 1.8 km of pan.
  - Estimated, not measured: a 1280-wide canvas travels about 3.4 km for the same two drags, from the 1.68 m per pixel in this trace. At the old width it could leave the cover.
- **Base at 668x730.7, post route:** the same failure. S1 and S2 pass, S4 times out at 60000 ms, and S5a to S5d fail with the same messages. The trace shows 17 and 17 query/stream lines, the last at index 165 of 214. After it: 25 view-states, targetX 0 to 1799, zoom -1.83 to 0.03, and resident features 10000 before and 20163 after.
- **Class: (G).** The "pan larger than the viewport leaves the resident cover" premise is measured in canvas widths, but the cover is measured in world tiles. The narrower map pans less far in the world.

## CLASSC'

Left out, as asked.

## Smallest fix for any (B)

There is none, because there is no (B).

## Commands, exit codes, holds

- All heavy commands were one held call each, in the form `cd <tree>/frontends/shell && powershell machine.ps1 hold shared ... && <env assignments only> node diag-run.mjs ; rc=$? ; ... release ; exit $rc`. The wrapper starts and stops the app inside that single command.
- None of the held calls repeats the stage 2 slip.

| # | Command (all under `hold shared -Project SpatialIDE`) | rc |
|---|---|---|
| 1 | `npm ci` in the base worktree's `frontends/shell` | 0 |
| 2 | probe of base canvas sizes (first try) | 1: my wrapper hung because the app inherited its stdout pipe. I stopped it with `app-down.ps1` and `taskkill` on the one node PID I had started, then fixed the wrapper. |
| 3 | probe of base canvas sizes (second try) | 0 |
| 4 | probe of m1 canvas sizes | 0 |
| 5 | fit of the base window to the m1 canvases | 0 |
| 6 | base `e2e/regression.mjs` at 668x1454 | 1 (A9', K6 and C2'/C3' fail) |
| 7 | base `e2e/filter-panel.mjs` at 668x1454 | 1 (FIND' fails) |
| 8 | base `pan-anchor-diag.mjs` at 328x1428 and 788x1554 | 2 (the harness TypeError after the four checks) |
| 9 | base `e2e/source-changed.mjs`, post route, at 668x1454 | 1 |
| 10 | m1 `e2e/regression.mjs` control at 1280x800 | 1 (same A9' and K6 as stage 2) |
| 11 | base `e2e/regression.mjs` repeat at 668x1454 | 1 (same signatures as run 6) |
| 12 | m1 `reg-diag-m1.mjs` (logging copy, A9' evidence only) | 0 |
| 13 | base `reg-diag-base.mjs` (same, at 668x1454) | 0 |
| 14 | base `e2e/regression.mjs` at 668x1453 | 1 (matches m1 exactly) |

- **Not held, because light:** `git worktree add` and `remove`, `app-down.ps1` calls, reading ledgers and reports, and one `taskkill` of the stuck wrapper (PID 10508, which I started).
- **Scratch only, outside the repo:** `diag-run.mjs`, `pan-anchor-diag.mjs`, `reg-diag-m1.mjs` and `reg-diag-base.mjs` in the session scratchpad's m1w folder. The two reg-diag files and pan-anchor-diag differ from their sources only by absolute import paths, a one-line `console.log` of A9' notch evidence (with an early exit under an env flag), and the env-driven window sizes.

## Noticed

- **A fractional pixel changes the result.** A9' and K6 depend on a 1-row buffer difference: the m1 canvas is 730.2 (buffer 730), and a base window giving 730.7 (buffer 731) picks a different candidate and fails at a different K6 sub-assertion. Any re-aim of these two should not rely on one specific candidate pixel.
- **The map size is the shared cause.** All seven failures share the new map shape (668x730 at 1280x800; 328x570 and 788x830 in pan-anchor) and none needs a product change. Options for the human are to re-aim each suite, or to have the harness set the window to a wide, short size so the map region approximates the old 1280x204. I did not test the second option.
- **Dropped signature.** My stage 2 report listed K6's failure as "marker never observed"; at the base-size run K6 can instead fail earlier in the re-pick, per the above.
- **Window sizing.** CDP `Browser.setWindowBounds` sets the inner viewport exactly (inner equals outer), and heights beyond the screen work.
- **Process note.** The pan-anchor base scratch run ended on a harness exception after its four target checks, so its exit code 2 is not a verdict on them.
- **Model:** Sonnet 5.5 (claude-sonnet-5-5).
