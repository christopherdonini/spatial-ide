*Custodian's filing note (2026-11-11): the architect's draft of the diagnostic form's Amendment 1, the measure-build run, from its hand-back (28620 bytes, sha256 f36c27bd41defd4aad47ea2e22e00f498e70b66b360f53d5b0725eee286181cb), below the rule unchanged; one final newline is added. Its brief by file (5796 bytes, sha256 cb5803da3c99ab767c76b3bcd8466cb24725edfaf1efc9a6add6d75558708fb9); the run 2026-11-11T17:59:55.809Z to 2026-11-11T18:10:10.997Z by its transcript, 43 calls (Read 24, Grep 16, Glob 2, the hand-back), none errored, none writing, model claude-opus-5-5. A draft, a reading and not Authority. Before appending, the custodian checked by script: the fenced block is appended to the form whole, each sha256:<H> filled at c1aea32a with the sha256 of the cited whole lines (58 pins in 15 files), and nothing else changed, but for one cite: the root .gitignore's keeps its commit and has no hash, since verify-quotes reads a bare file name as ambiguous (nine tracked files share it); the form's Amendments section was empty. Its OPEN-6 to OPEN-12 are none of them a red line and each takes the draft's recommendation (the 2026-10-31 directive, item 4, held to 2026-11-16), recorded here with the date. On OPEN-10 the custodian reads the measure build's own compiled CDP port as that build class's existing posture, not a change to it, and says so to the human.*

---

Drafted: pan-anchor-there-and-back-residual-diagnostic Amendment 1

Read at: main @ c1aea32a166ef9727b059d3038a559181df0a86d (the main checkout, read only).

```

## Amendment 1 — written after both runs (build and quiet) and gate 1's report were seen: the measure-build run the human ruled on OPEN-2 (A), declared before that run (class 1)

*Class 1 (post-result) [OPEN-6]. Authority: the human's message of 2026-11-11 (17:17Z), its paragraphs on the diagnostic, route 2, OPEN-2, OPEN-1 and OPEN-5 (`state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:17-21 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), with OPEN-2 (A) at `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:18 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`. This settles the OPEN-2 that note 4, Route 2 names, and adds no clause the ruling does not carry. Each choice the ruling leaves open is marked [OPEN-n]. Each is the drafting architect's recommendation, and none is a red line (the filed draft, `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-amendment-1-architect-draft.md`). Evidence, not Authority: the two run reports and gate 1's reviewer report, cited below. The reuse index (`measure build drag recentre stall record`, exit 1) found no prior art; that miss is noted here. Everything below is paraphrase unless marked otherwise; nothing here is quoted.*

**(a) The build.**
- What it is: `npm run build:measure` (`frontends/shell/package.json:48 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). That is a release `tauri build` with the `measure-build` feature and no bundle. Its frontend is `vite build --mode measure` into `dist-measure/` (`frontends/shell/package.json:47 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/e2e/writeMeasureConfigOverlay.mjs:45-52 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), built with `VITE_MEASURE_BUILD=1`, which keeps the `isInstrumentedBuild()` sites compiled in (`frontends/shell/src/isInstrumentedBuild.ts:31-33 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- How it is reached: the build opens its CDP port from its own compiled block (`frontends/shell/src-tauri/src/lib.rs:511-529 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). The suite reaches it through the measure launch route (`frontends/shell/e2e/lib.mjs:254-303 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), at the packaged origin (`frontends/shell/e2e/lib.mjs:229-233 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- It is not the shipped build. It carries the `isInstrumentedBuild()` hooks, `openPath` among them (`frontends/shell/src/admission/AdmissionPanel.tsx:325-326 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), the pool-poll instrument (`frontends/shell/src-tauri/src/lib.rs:21-27 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`) and the CDP port.
- Absent on it: the DEV-only camera seam `e2eSetViewState` and its call count (`frontends/shell/src/canvas/WorkingCanvas.tsx:2319-2320 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `frontends/shell/src/canvas/WorkingCanvas.tsx:2351-2352 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Also absent: `capturePixels` (`frontends/shell/src/canvas/WorkingCanvas.tsx:2203-2204 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), and every other site gated on `import.meta.env.DEV` alone (`frontends/shell/e2e/lib.mjs:13 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/src/isInstrumentedBuild.ts:7-13 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>` names the directories that still read it).
- Also absent: the Rust `debug_assertions` items, the publish destination seam among them (`frontends/shell/src-tauri/src/lib.rs:552-557 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), and a console for `eprintln!` (`frontends/shell/src-tauri/src/lib.rs:85-86 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Also absent: Vite's dev server and React's development build, since the page is the production bundle. So the port-5400 harness's dev server, shim and config overlay are not started.
- The base [OPEN-12]: the build is made at 00bcb07db100c56e672afe99dbe3fe27f2638010, the commit both dev runs ran, in the piece's worktree `C:/dev/wt/dg`, with its HEAD shown. Before the build, the custodian shows by script that `git diff --name-only 00bcb07d c1aea32a -- frontends/`, and the same from 00bcb07d to main at dispatch, prints nothing. If it prints anything, the paths are named. The build stays at 00bcb07d; for the run, the tree at 00bcb07d is authoritative and the pins here are historical.
- How it is built: built fresh, with `CARGO_TARGET_DIR` set to a new, empty directory on D: that no other worktree uses, after free space is checked against the custodian's floor. It runs in its own Bash call inside `hold shared -Project SpatialIDE`. It is finished (its `Finished` line and rc 0 recorded) and its hold released before the run's pre-check (item (d)).
- What is recorded: the exe's path, size, sha256 and mtime; the build log's sha256 and last lines; porcelain shown empty after the build (`dist-measure/` is ignored, `.gitignore:7 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).

**(b) The drags.**
- The bound: T(z) = min(RECENTER_MAX_DRIFT[unit], RECENTER_BUDGET_PX / (2^-24 · 2^z)) (`frontends/shell/src/canvas/offsetFrame.ts:84-91 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `frontends/shell/src/canvas/offsetFrame.ts:38 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `frontends/shell/src/canvas/offsetFrame.ts:64-69 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). Pixels per unit are 2^z (`frontends/shell/src/canvas/WorkingCanvas.tsx:586-592 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). Every unit's cap is 131 072, so T(z) = min(131 072, 2^(23−z)), which is 131 072 for every z ≤ 6.
- When it applies: T is reset at every view-state tick (`frontends/shell/src/canvas/WorkingCanvas.tsx:2100-2101 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). It is tested only at a tick that is not dragging, where the origin moves to the view (`frontends/shell/src/canvas/WorkingCanvas.tsx:2127-2134 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/src/canvas/offsetFrame.ts:166-173 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). A crossing is that move.
- The view at start is the fit after load: the one-shot auto-fit over the first batch's resident extent (`frontends/shell/src/canvas/WorkingCanvas.tsx:1551-1560 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/src/canvas/WorkingCanvas.tsx:1766-1768 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; `frontends/shell/src/canvas/extent.ts:126-149 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). Its own view-state line carries its zoom z_fit with target (0, 0) (`frontends/shell/src/canvas/WorkingCanvas.tsx:1408-1410 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- Getting there: `setup()` runs as committed (`frontends/shell/e2e/pan-anchor.mjs:57-74 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), on the measure launch route. There is no window resize, no setCam and no other camera call.
- Reading z_fit: from that line, the last `vs` line at `setup()`'s return. If `vs` holds none, the run waits for one under setCam's own bound (`frontends/shell/e2e/pan-anchor.mjs:103 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`) [OPEN-8]. If there is still none, the run stops before its first drag; that is recorded and not retried.
- Each drag is the suite's `drag()` (`frontends/shell/e2e/pan-anchor.mjs:108-117 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), started from the canvas centre (`frontends/shell/e2e/pan-anchor.mjs:215 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), in 40 steps. L = 300 CSS px, or floor(cw/2) − EDGE_MARGIN_PX where the box is narrower (the rule at `frontends/shell/e2e/pan-anchor.mjs:257 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- The count: per drag, d = (L − L/40) · 2^(−z_fit) world units, net of the first-step deficit (`frontends/shell/e2e/pan-anchor.mjs:27-34 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). n1 = floor(T(z_fit) / d) + 3. Leg 1 is n1 drags of dx = +L, leg 2 is n1 drags of dx = −L, and one closing drag of dx = +L follows: 2·n1 + 1 drags in all [OPEN-7].
- Why this crosses twice: k1 = floor(T/d) + 1 ≤ n1 − 2 is the first leg-1 drag whose settle has drift k1·d > T. Crossing 1 moves the origin to the view, k1·d from the fit centre. Leg 2 brings the view back to the fit view at its n1-th drag. There the drift from that origin is k1·d > T, and at the drag before it is (k1 − 1)·d ≤ T. So crossing 2 is at drag 2·n1. The closing drag crosses nothing (drift ≈ d), and the view ends at the fit view with the data back in frame. If leg 1 does not cross, leg 2 does not either; that is recorded as it comes.
- The arithmetic (mine, an estimate and not a measurement; the run uses the recorded z_fit), case: assume a first batch spanning the whole fixture, 12 680 × 12 640 m (`frontends/shell/e2e/pan-anchor.mjs:47-50 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). Take the default window's canvas of 668 × 736 CSS px (that comment's own figure, at its commit: `frontends/shell/e2e/pan-anchor.mjs:129-131 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- The arithmetic, result: 1 CSS px = 1 / min(534.4/12 680, 588.8/12 640) ≈ 23.73 m, and z_fit ≈ −4.57, so T = 131 072 m. d ≈ 292.5 × 23.73 ≈ 6 940 m and T/d ≈ 18.9. So k1 = 19 and n1 = 21: crossings at drags 19 and 42, and 43 drags in all. A first batch smaller than the fixture gives a higher z_fit, a shorter d and a larger n1. The formula sets the count, not this estimate.
- How the records show a crossing: the view-state line (`frontends/shell/src/diagnostics/renderTrace.ts:52-53 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`) carries the target in the current frame and the origin, so the drift at a line is hypot(targetX, targetY). A crossing at drag k is shown by (i) its last line's drift being over T(zoom), and (ii) the next drag's first line carrying an origin that differs from (i)'s by (i)'s target.
- What stands in for the recentre itself: the recentre emits no line (the trace at `:2101` runs before it), which is why the closing drag exists; its first line is (ii) for crossing 2. The frame's own event list (`frontends/shell/src/canvas/offsetFrame.ts:130 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `frontends/shell/src/canvas/offsetFrame.ts:187-193 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`) is page memory that no hook exposes on any build. (i) and (ii) stand in for it.

**(c) The records.**
- Note 1's instrument as it can run here, tag `measure`, page side: the stall record as note 1 sets it, each kept gap held in the page array and also sent once as a `[dg-stall]` line; the `console.debug` wrapper and its view-state emissions.
- Node side: view-state receipts and pushes; `[dg-stall]` receipts; `pageerror`; console `error`. Per drag: its start, mouse up, `waitForSettle`'s `{settled, count}` (`frontends/shell/e2e/lib.mjs:348-369 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), its end, and `vs` whole at each read. Also note 1's two clock checks, its per-event append, its refused-name rule and its bounded collection.
- The closing clock check is its own `page.evaluate` right before the collection, as note 1 words it, not inside it (gate 1's report, check 2 (c): `state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate1-reviewer.md:77 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- The view-state line is emitted on this build: `traceViewState` is called with no gate (`frontends/shell/src/canvas/WorkingCanvas.tsx:1408-1410 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`, `frontends/shell/src/canvas/WorkingCanvas.tsx:2100-2101 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), and it emits through `console.debug`. Whether `frontends/shell/vite.config.ts` at 00bcb07d drops console calls is shown by script at the gate (item (f)).
- The edit [OPEN-9]: one new patch, made from note 1's patch (sha256 a3e44da80c6d69fbabac220eb579633c205a0a729a1e34e0a2fec4bdca999f7a, per the two run reports), with only these changes: `setup()` launches through the measure route, with the exe path from an environment variable; `main` runs item (b)'s drags in place of the resizes and the cases; the closing clock check stands apart; the seam wrapper records the seam's absence by name. Its sha256 is recorded. It is applied, `git diff | sha256sum` is checked equal, it is reverted, and porcelain is shown empty.
- Missing on the measure build, each with its reason:
  1. The seam wrapper's records: the seam is not registered (`:2319-2320` above).
  2. The setCam windows, the per-setCam node records, the s0 reads and the 2026-11-10 grading's reset-line comparison: there is no setCam (the ruling) and no seam.
  3. Paint-vs-event, the fill wait and the centroid: `capturePixels` is not registered (`:2203-2204` above).
  4. The suite's check lines, its PASS/FAIL, its cases and its two window sizes: the drags replace the cases, and there is one window size, the build's own.
  5. The build-overlap records: this run is quiet only.
  6. The dev harness's `app.log`, `app.err.log`, vite logs and app-down output: there is no dev server. The app's output goes to `measure-app.log` (`frontends/shell/e2e/lib.mjs:274 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), which may hold no `eprintln!` line (item (a)). The session log is the app-side record.
  7. The recentre event list: no hook exposes it (item (b)).
  8. The fit's own line among the page emissions, if the fit came before the install: the node side holds it, from the listener registered before the reload (`frontends/shell/e2e/pan-anchor.mjs:60-63 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
  9. A gap still open when the run ends: it is never sent (gate 1's report, N2: `state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate1-reviewer.md:391-392 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
  10. The page arrays, if the collection reaches its bound: the `[dg-stall]` lines stand in, as in run quiet (`state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md:171 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).

**(d) The run.**
- One run, tag `measure`, quiet under note 3's quiet condition. The custodian sends its brief only when no other SpatialIDE heavy run is in flight, and dispatches none from it until its report. The worker takes note 3's one process list before the hold, with the exe of item (a) added to its kinds, and stops before the hold if a heavy process is rooted in the repository. The same list is taken at the suite's start, at its end and after release. The build's hold has ended before that first list.
- One Bash call inside `hold shared -Project SpatialIDE`, from `frontends/shell`, under a hard `timeout 1500`. Stamps come from `date -u`. The fixture's sha256 is taken before and after. `--measure` is never passed and `validate` is never used.
- The port [OPEN-10]: the settlement's port rule governs the dev server, and this run starts none. The page loads from the build's own bundle at the packaged origin. CDP is the build's default, 9223 (`frontends/shell/src-tauri/src/lib.rs:517-518 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), as in both dev runs. 5180 and 5400 are not touched.
- The 9223 check: before the hold, a listen check shows nothing on 9223, or the worker stops before the hold, since the launch route attaches to whatever listens there (`frontends/shell/e2e/lib.mjs:257-267 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- After the run: the session stop kills the exe it launched (`frontends/shell/e2e/lib.mjs:305-314 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`). A process list and a listen check on 9223 follow. `measure-app.log` and the session log are copied right after the run, with their sha256.
- Nothing is committed (OPEN-1 (A), `state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:21 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`), predicted, retried or fixed. Exit codes (124 included) and fatal lines are recorded as they come.
- Pan-anchor stays held (OPEN-5 (B), the same line). The architect consult that the same message orders (`state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:19 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`) is a separate piece, not this run.

**(e) The reading.**
- A script over the run's files gives these fields:
  - per drag: index, leg, dx, start, mouse up, `{settled, count}` and end;
  - each crossing shown, with its drag index, (i)'s drift and (ii)'s origins, and their count;
  - each kept gap, with its node-mapped start, length, tick, visibility and window (drag k, or between drags), flagged where the window is a crossing drag or the drag after it;
  - the gaps that meet note 4's long-stall length, with their count, lengths and windows;
  - the view-state [receipt, push] intervals that overlap a kept gap;
  - the collection's outcome, the clock checks' half-widths and the process lists' outcome.
- The dev-build records beside it, as filed: run build, `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md:297 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`; run quiet, `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md:188 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`.
- There is no route and no grade. The human grades (`state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md:20 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`).
- What one run cannot support:
  - a rate, a bound, a p50/p95 or any docs/08 measurement, and no number from it is quoted as one (`:18` above);
  - from an absence, that the measure build has no such stall;
  - from a presence, a cause (note 4: a kept gap shows when the page's timers did not run, not what held the thread);
  - a difference from the dev runs that is the build's alone: their crossings came after a setCam, at the suite's zoom −7 and in two window sizes, and these come at z_fit in one window size;
  - the instrument's own cost, page side and node side, which is unmeasured (gate 1's report, N5: `state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate1-reviewer.md:396 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`);
  - anything about the shipped build itself (item (a)).

**(f) The gate.** Note 6's single reviewer under §21b checks this run [OPEN-11]. It checks:
- the Out-of-scope line first;
- the build's provenance by item (a): the worktree HEAD, the new target, the `Finished` line and rc, the exe's sha256 and an mtime after the build's start, and the build's hold ending before the pre-check stamp;
- the patch, by its sha256, against note 1 and items (b) and (c): no setCam, no seam call, no `capturePixels`, no added wait beyond item (b)'s fit-line wait, and the drag count by item (b)'s formula from the recorded z_fit;
- that `frontends/shell/vite.config.ts` at 00bcb07d drops no console call, by script;
- the worktree clean after the revert;
- the quiet condition and the 9223 checks;
- item (e)'s fields, the crossings included, recomputed by its own script from the files by their sha256;
- that nothing was committed, retried or fixed.
Runs are not re-observed.

**(g) The budget.** About 110 minutes of work (my estimate, not a measurement):
- about 45 for the release build from an empty target, DuckDB included (the dev-profile build took 19m 47s: `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md:25 @ c1aea32a166ef9727b059d3038a559181df0a86d sha256:<H>`);
- about 20 for the patch;
- about 10 for the run (setup, item (b)'s drags and the collection), under the 1 500 s hard bound;
- about 35 for the lists, the reading and the report.
The wait for the quiet condition is not budget time. It is stamped and reported separately.

Nothing above is edited.
```

**My answers to (a) to (g), with reasons**

- **(a) The build.**
  - The measure build is `build:measure`: a release Tauri build with `--features measure-build`, a `vite build --mode measure` frontend, and `VITE_MEASURE_BUILD=1`, so `isInstrumentedBuild()` is true.
  - I chose 00bcb07d so the code matches what both dev runs ran. Otherwise the comparison with the dev records would mix a code difference into the build difference.
  - The DEV-only seam (WorkingCanvas.tsx:2320) and `capturePixels` (:2204) are compiled out. `openPath` stays in (AdmissionPanel.tsx:325), so the suite's `setup()` still works.
  - I name what makes the measure build "not shipped" (the hooks, pool_poll, the CDP port), because the human's grade treats a measure-build stall as one ordinary use can hit.
- **(b) The drags.**
  - The bound is the cap, 131 072 units, for any zoom ≤ 6. At the fit zoom (about −4.6) the budget term is far larger than the cap, so the cap is what binds.
  - I chose two symmetric legs plus one closing drag, for three reasons:
    1. The second crossing is guaranteed whenever the first one happens, because the return to the start lies k1·d > T from the moved origin.
    2. The view ends at the fit view with the data back in frame, which is closer to ordinary use.
    3. The closing drag is the only way the lines can show crossing 2's new origin, because the re-centre emits no view-state line.
  - The count comes from the recorded fit zoom, not from my estimate. The auto-fit uses the first batch's extent, which can be smaller than the fixture's.
- **(c) The records.**
  - The view-state line is emitted on the measure build: `traceViewState` is ungated at WorkingCanvas.tsx:1410 and :2101.
  - I found no `drop` or `pure` in vite.config.ts. That absence is left to the gate's script, not asserted here.
  - The closing clock check goes back to note 1's own shape. Gate 1 found that merging it into the collection lost it in run quiet.
  - The recentre has no record on any build; `OffsetFrame.events` has no hook. So the lines' drift and origin change stand in for it.
- **(d) The run.**
  - The form's port settlement is about the dev server, which a measure run does not start. CDP 9223 is the build's own default, and the attach-first launch route makes a 9223 listen check necessary.
  - OPEN-1 (A) and OPEN-5 (B) are cited at :21.
- **(e) The reading.** It gives fields only, set beside the dev reports' long-stall lines. The claim limits add the zoom and case difference against the dev runs' z = −7 recenter cases, and the not-shipped build.
- **(f) The gate.** Yes. The run is this node's, under the same §21b route that gate 1 used. Its checks are note 6's, adapted to what the measure run records.
- **(g) The budget.** It is an estimate, scaled from run build's 19m 47s dev-profile build.

**OPEN items** (none is a red line, so each takes the drafting agent's recommendation under the 2026-10-31 directive, item 4, held to 2026-11-16)

- **OPEN-6 (class).** Recommendation: class 1 only.
  - Class 9 covers a standing rule, a permanent ruling or a standing directive. OPEN-2 (A) is a one-off ruling that settles an OPEN the form already carried, at note 4, Route 2.
  - The alternative is to record it as class 9 as well, with its §2/§4/§5/§8/§9 declarations.
- **OPEN-7 (drag plan).** Recommendation: (A).
  - (A), as drafted: L = 300, 40 steps, from the centre, legs of n1 = floor(T/d) + 3, and one closing drag.
  - (B) One direction, 2·n1 drags. The view ends about 290 km away, with the data out of frame, and crossing 2's origin is never shown without an extra drag.
  - (C) Drag until the node's record shows a crossing. The count is not fixed before the run, and it adds a decision between steps.
- **OPEN-8 (fit-line wait).** Recommendation: before the first drag, wait for a view-state line under setCam's own bound (20 × 250 ms). If none comes, stop and record it. The alternative is no wait, which risks a run with no z_fit.
- **OPEN-9 (the edit).** Recommendation: (A), one file under the discipline the gate already checks.
  - (A) Read the launch-route and drag-driver changes as inside the form's Scope: pan-anchor.mjs edited in the worktree, uncommitted and reverted, with 0 committed lines.
  - (B) A scratch driver outside the repository that imports the worktree's lib.mjs.
- **OPEN-10 (port).** Recommendation: no dev-server port, CDP 9223, and 5180/5400 untouched.
  - The measure exe's compiled CDP port is that build class's existing posture (lib.mjs:12-14), and it runs on the human's own order. I read this as no posture change.
  - If the custodian or the gate reads it as a security-posture change, it becomes a red line and waits for the human's typed word. Options: (A) run as declared, or (B) hold. I recommend (A).
- **OPEN-11 (gate).** Recommendation: note 6's single reviewer over this amendment's run, filed as a new gate of the node. The custodian names the attempt number.
- **OPEN-12 (base).** Recommendation: build at 00bcb07d, with the custodian's diff to main at dispatch shown by script. The alternative is main at dispatch, which loses code identity with the dev runs if frontends/ has moved.

The reuse index returned no prior art (exit 1). That miss is noted in the amendment.

**Notes for the custodian**

- Each `<H>` is a whole-line sha256 at c1aea32a, LF bytes. The extent.ts:126-149 range comes from a Grep with context, not a full Read.
- WorkingCanvas.tsx:1551-1560 was read only at its first and last lines; please check the range when you hash it.
- The amendment's head names the filed draft by path only, because it is not yet tracked. It is a path, not a pin.
- I leave no background shell; I have no shell.

**What I read** (read only, main checkout)

- `C:/dev/spatial-ide/state/directives/2026-11-11-307-c-2-a-reply-member-c1-a-mark-withheld-h1-counts-diagnostic-open-2-a-measure-build-drags-consult-open-1-a-open-5-b.md`
- `C:/dev/spatial-ide/governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md`
- `C:/dev/spatial-ide/state/consults/gates/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-gate1-reviewer.md`
- `C:/dev/spatial-ide/frontends/shell/src/canvas/offsetFrame.ts`
- `C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx` (lines 420-559, 920-959, 1370-1499, 2040-2369, and Grep hits)
- `C:/dev/spatial-ide/frontends/shell/src/diagnostics/renderTrace.ts`
- `C:/dev/spatial-ide/frontends/shell/src/isInstrumentedBuild.ts`
- `C:/dev/spatial-ide/frontends/shell/e2e/lib.mjs` (1-405)
- `C:/dev/spatial-ide/frontends/shell/e2e/pan-anchor.mjs`
- `C:/dev/spatial-ide/frontends/shell/src-tauri/src/lib.rs` (14-43, 78-93, 390-579)
- `C:/dev/spatial-ide/frontends/shell/package.json`
- Supporting, outside the brief's list:
  - `C:/dev/spatial-ide/frontends/shell/e2e/writeMeasureConfigOverlay.mjs`
  - `C:/dev/spatial-ide/frontends/shell/.env.measure`
  - `C:/dev/spatial-ide/frontends/shell/src/canvas/extent.ts` (Grep, 126-149)
  - `C:/dev/spatial-ide/frontends/shell/src/e2e-test-surface.ts` and `C:/dev/spatial-ide/frontends/shell/src/admission/AdmissionPanel.tsx` and `C:/dev/spatial-ide/frontends/shell/src/App.tsx` (Grep for gates)
  - `C:/dev/spatial-ide/frontends/shell/vite.config.ts` (Grep)
  - `C:/dev/spatial-ide/.gitignore` and `C:/dev/spatial-ide/frontends/shell/.gitignore` (Grep)
  - `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md` (100-173, for classes 1-9)

**Model, as the harness reports it:** Opus 5.5 (`claude-opus-5-5`).
