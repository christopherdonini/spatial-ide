*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B e2e step fixes (E-SCENE, E-REFUSED, E-KINDS; between stages 6 and 7), branch cut/shell-migration-milestone-2-phase-b at 9773d5c01abc5ee27b2b707b69b6df5f0b1e1d06, the run 2026-10-12T08:13:20Z to 2026-10-12T08:27:42Z by its transcript (Read 6, Bash 44, Monitor 1, Write 1); its one SubagentHandback call, at 08:27:41Z. It arrived as a message and is extracted here by script. 1 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is 0bbd50a7519ddb4e9654961c165837ab175ded3838fca97ce0c5ce95d0778069; this file's, from line 5 to the end, is 0506af589365e4763915a96382aea3c0e1b4a982fed15c9b0b13ff8db6191bf5.*

---

The three steps are fixed in `frontends/shell/e2e/selection.mjs`, written but not run. No product file changed, so E-REFUSED needed no product fix. I read E-REFUSED as (a), a stale readout, from the code. The run did not log enough to prove it, so the next run settles it.

**Head and commits**
- Head is `9773d5c01abc5ee27b2b707b69b6df5f0b1e1d06`, pushed to `cut/shell-migration-milestone-2-phase-b`. The fetch showed d7f61f1c with an empty porcelain.
- One commit on top of d7f61f1c: `fix: e2e selection.mjs, E-SCENE, E-REFUSED and E-KINDS (written, not run)`. It is signed off, with the Co-Authored-By line.
- Only `frontends/shell/e2e/selection.mjs` changed. I did not touch `lib.mjs`, `state/`, `PLAN.yaml` or the form.

**What I changed**
- The old `interiorCandidates` and `sampleHits` are removed.
- Two new functions are shared by all three steps: `candidatePoints` (an async generator) and `hoverHits`.
- `hoverHits` takes every oracle id through `hoverIdAfterBarrier`. It never reads the readout itself.
- Two constants are added, `HOVER_ATTEMPTS_MAX` (40) and `HOVER_MISSES_MAX` (4). They are harness bounds, not measurements.

**E-SCENE**
- **Cause.**
  - The old `interiorCandidates` returned only points whose 5x5 neighbourhood is fully non-background and has alpha of at least 150, out of 16 lattice points. At notch 1 the parcels (2000 grid cells, `line 617-629 of kernel/tests/manual_walkthrough_fixtures.rs (at 9773d5c0)`) are only just over the pick threshold, so only the bisection candidate verified.
  - That matches the log: one hover at notch 1, which found id 288. A second candidate would have printed another barrier line.
  - `buildScene` then threw at the first camera that answered but gave fewer than `min` ids (old lines 225-226).
  - It differs from E-SEL-FILTER only in the camera. E-SEL-FILTER calls the same `buildScene` after `zoomToLayer`, and its camera happened to verify six points.
  - I inferred this from the code and the log. I cannot see the camera numbers.
- **Fix.**
  - `candidatePoints` yields lazily: the bisection candidate, the old 15-point lattice, then a 7x7 finer lattice. A point is verified only when the search asks for the next.
  - `buildScene` now zooms in from a camera that gives fewer than `min` ids. Features that are small at one notch are larger at the next.
  - The thrown message lists what each notch gave, for example `notch 1: 1 distinct id(s) in N hover(s)`.
  - A hover that ends in the refusal stops the search at once, so notch 0 costs one hover where it used to cost two.
  - The oracle ids still come only through `hoverIdAfterBarrier`.

**E-KINDS**
- **Cause.**
  - The old `sampleHits` hovered `region.samplePoint` of each grid cell. That is the first non-background pixel in row-major order (`src/canvas/WorkingCanvas.tsx`, `summarizePixels`, line 652). It is the shape's extreme boundary pixel, not an interior one.
  - F-1 is three large irregular polygons. The hover at an edge pixel's half-pixel centre found no pick. That matches the ten `found clear already; no id, last state clear` lines: 5 candidates, each tried with both `flipY` values.
  - The `flipY` handling itself is right. The E-SCENE notch-0 log shows `flipY` true answers and false does not.
  - The edge-pixel reading is also inferred from the code, since the log does not show it.
- **Fix.**
  - E-KINDS now calls `hoverHits(page, label, 16, false)`, which uses the interior-verified points first.
  - The edge-pixel cell samples remain only as a last resort. Thin lines have no 5x5 interior.
  - Point and line have never run. They may need a second pass if their dots or lines are too thin to hit, and the next run will show it.
  - The failure message now gives the hover count and says whether the hover was refused as below the pick resolution.

**E-REFUSED: reading (a), a stale readout**
- Evidence, all from code at my head:
  - Both paths pick at the same CSS pixel.
    - The hover is `onHover`, `src/canvas/WorkingCanvas.tsx:2115-2143`. It uses `info.x` and `info.y`, which deck takes from `event.offsetCenter` at `node_modules/@deck.gl/core/dist/lib/deck.js:158-161`.
    - The tap uses `onClick: (_info, event) => onTap(event)` at line 2023, then `createTapHandler` in `src/canvas/clickPick.ts:56-63` with `offsetCenter`.
    - Both call `deck.pickObject({x,y})` through `pickCandidateAt`, lines 1236-1246, with the same radius from `pickingRadiusFor`, which is undefined for polygons.
    - Device pixel ratio plays no part. The hover can emit a refusal only after `info.index >= 0`, a layer and a batch.
    - The tap checks `candidate === null` before the threshold, `clickPick.ts:40-42`.
    - So I found no difference in candidate lookup (b).
  - A refusal can stand with no pick at the pointer.
    - `reevaluateStandingHoverOnCameraChange` (`src/canvas/pickResolution.ts` ~247-268) turns any standing readout into the refusal when the camera crosses the threshold.
    - `decideHoverReadoutAtSettle` (`pickResolution.ts:391-401`) returns the refusal whatever the pick returned.
    - E-REFUSED calls `zoomToLayer` and zoom-out wheels with the pointer standing over a readout.
  - deck defers the hover pick to the next animation frame (`deck.js:141-166` and `_pickAndCallback` at 856-877). The old step moved the pointer and polled once at once, with no barrier, so it could read the refusal left by the camera change.
  - The run log shows `standing before refusal` readouts in E-SCENE, which is the same stale-readout mechanism.
  - The step took 4.4 s, so the poll succeeded straight away.
- Fix: the pixel now comes from `hoverHits`. It uses `hoverIdAfterBarrier`'s returned `last.state === "refusal"`, which is the refusal after the pointer left the canvas, the readout cleared, and the pointer moved to the target. That state can only come from a hover pick with a candidate there.
- If the click still reports no feature at such a pixel, that is reading (b) with decisive evidence. The failure message names the pixel and says the hover had found a candidate. The step also gets 600_000 ms instead of 300_000, since a non-refusing camera costs up to 40 s per notch.
- No product test or mutation, because there is no product change.

**Mutations and the header**
- The recorded mutations are unchanged. E-SCENE, E-KINDS and E-REFUSED each changed logic: the pixel source, the barrier and the camera search.
- E-REFUSED's mutation still fails on the same assertions, class first, then count. The header comment is untouched.

**Commands and exit codes** (`npm run verify` was not run, because no product or test file changed)
- `node --check frontends/shell/e2e/selection.mjs`: 0.
- `node scripts/plan/verify-cites.mjs`: 0.
- `node scripts/plan/verify-quotes.mjs`: 0, with pre-existing advisories only.
- `node scripts/plan/verify-test-claims.mjs`: 0.
- `node scripts/plan/verify.mjs`: 0.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 0, 457 pass, 0 fail.
- I also ran the new `buildScene` and `hoverHits` logic against a stubbed page, and it behaved as designed. That is not an e2e result.

**§7 count**
- The §7 command's numstat for `selection.mjs` is now `562 8`, which is 570. It was `571 8`, which is 579, so this change nets nine lines fewer.
- Against the stated ceiling of about 660, that leaves about 90 lines, so stage 7's roughly 70 for E-ASK fits.
- No other file changed. `selection.mjs` is 631 lines on disk.

**What the custodian should run and look for at 9773d5c0**
- Run `npm run e2e:selection`.
- E-SCENE:
  - Look for `camera at zoom-in notch N; features A, B` with two ids, probably at notch 2 or deeper.
  - If it fails, the message lists each notch's count.
  - Notch 0 should show a single refusal barrier line.
- E-CLICK through E-SEL-PAN run for the first time. Watch E-CLICK-FAST and E-NODRAG, since they have never run.
- E-REFUSED:
  - A PASS means it was a stale readout.
  - A FAIL reading `last-click line is "[P6 placeholder] Last click: no feature there."` with the pixel and the `hover barrier had confirmed` clause means a product defect. Send me the pixel and I will diagnose it. I would not change `clickPick.ts` or the click's resolution order without a ruling.
- E-KINDS:
  - Check the multipolygon first. The note should read like `multipolygon: N id(s) over M pixels; two pixels of id X gave Selected 1`, with N at most 3.
  - Then check point and line. A failure of `only N hovered feature pixel(s) found in T hover(s)` there would mean their hit pixels need work.
- The hover-barrier lines now carry labels like `E-SCENE (notch 2)`.

**Not done as written**
- Nothing departs from the brief except the 600_000 ms step bound for E-REFUSED.
- For the reviewer: `hoverHits` reads `result.last.state` from the helper's return value. I treat that as part of the call under §8 item 32, not as a separate establishing read. It adds no barrier of its own.

**Final porcelain:** empty, and the branch is pushed to `9773d5c0`.
