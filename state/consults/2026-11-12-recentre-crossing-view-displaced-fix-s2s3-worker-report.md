*Custodian's filing note (2026-11-12): the worker's report for steps S2 and S3 of slot 2's recentre-crossing-view-displaced-fix, under its form's Amendment 1 item 2, from its hand-back (8237 bytes, sha256 b6134bb49ecfd826754463f0d058a4ba5e5986505bec48e37300c9bf7f7e58e0), below the rule unchanged; one final newline is added. Its brief by file (12084 bytes, sha256 ac805e7bcef7aa91977fcf7cd4eab3bb7cbd6718ae252bf7bc0c8fbdb50b2848); the run 02:28:08Z to 02:43:27Z by its transcript, 60 calls (Read 13, Bash 38, Write 4, Edit 4, the hand-back), one errored (the base's expected vitest failure, exit 1, inside its hold), six shared holds, model claude-sonnet-5-5. Checked by script at this commit: the branch's tip is a74a9d5cb58fbb1ccff90acd4c279b9bbb210930, and its numstat from main a43c562a names the two new files at 317 and 218 lines, each under its ceiling. A report, a reading and not Authority; its ten departures are for the piece's gates.*

---

Built: recentre-crossing-view-displaced-fix S2 and S3 at a74a9d5cb58fbb1ccff90acd4c279b9bbb210930

**Start state**
- Form sha256 in the main checkout, after fetch: bb654dfc249fa014880932bd373488ee4741d42171bf1ce2d7e775a008c602e9. Main HEAD is a43c562a3a4416ab5f00b3866b98130374e922a8.
- Worktree C:/dev/wt/rcf: HEAD a43c562a3a4416ab5f00b3866b98130374e922a8, branch cut/recentre-crossing-view-displaced-fix, porcelain empty.
- deck `@deck.gl/core` version field: 9.3.9, read after `npm ci`.
- `npm ci` in frontends/shell and in renderer/bundle-viewer: rc 0 each. Both lockfile sha256 values are unchanged (shell 8e50319…a80, bundle-viewer 6ccfc6d…617). Porcelain empty after both.
- `df -h`: C: 18G free, D: 191G free.
- Read before coding: the form whole (Amendment 1 first), notes 3 and 5 of the reproducer's form, and the other files the brief lists. Deck source read at D1, D3, D5, D8 and D19, plus `dist/utils/deep-equal.js`.

**Commits**
- S2 d4b28bf2a1a3324a4283eeb324328d0f9e8665f5, subject `test: the re-centre keeps the view where it was (U1, U2; failing at the base)`. Adds `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx`, 218 lines.
- S3 a74a9d5cb58fbb1ccff90acd4c279b9bbb210930, subject `test: e2e recentre-crossing, from the fit view out past the re-centring bound and back, on the measure build (not yet run)`. Adds `frontends/shell/e2e/recentre-crossing.mjs`, 317 lines.
- Each message file was shown before its commit. Neither holds a typed sign-off line or an email except the trailer.

**S2**
- Vitest at the S2 commit, `npx vitest run src/canvas/WorkingCanvas.recentre.test.tsx`, rc 1: 2 failed of 2 (log rcf-s2s3-vitest-2.log).
- An earlier run, before my typecheck fix to a type annotation, failed the same way.
- U1 assertion line, byte-copied: `AssertionError: crossing 1: W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001`
- U2 assertion line, byte-copied: `AssertionError: (a) a settled tick with inTransition true: the origin stays: expected [ [ 2600040.6260723933, …(1) ], …(1) ] to deeply equal [ [ 2600040.6260723933, …(1) ], …(1) ]`
- P-U-base is met: U1 fails at its first crossing and U2 fails at (a). I1 did not fire.
- The origin-changed assertion in U1 passes before the W assertion fails, so the failure is the displacement and not a missing crossing.
- `npm run typecheck`: the first run had two implicit-any errors in the new file, which I fixed before the commit. The second run, rc 0, is clean.
- The pass at the head is not observed: I may not edit the product.

**S3: E1**
- Precondition exit 2 (VOID): the fit line does not arrive, or case 1 has no origin change in a leg. The code is at lines 250 and 24-25. The leg of a change is the drag that owns the line before it.
- Drag plan, lines 112-117:
  - L = 30·floor(min(300, floor(cw/2) − 8)/30)
  - T = min(131072, 2^(23−z_fit))
  - d = (L − L/30)·2^−z_fit
  - n1 = floor(T/d) + 3
  - STEPS = 30 is at line 40.
- Plan order is in case1: n1 drags of +L, n1 of −L, then +L and −L.
- Image rule as coded, lines 157-208: PNG decode with `node:zlib` (`decodePng`), background B, marked pixels, N and C, and `pairVerdict`. Differs if |ΔN| > 0.10·max(N_start, N_end) or the C shift > 4.0. Unreadable if the dimensions differ or N_start is 0 or every pixel.
- Captures use CDP `Page.captureScreenshot` clipped to the canvas box, written with flag `wx`.
- I checked `decodePng`, `analyze` and `pairVerdict` by copying them into a scratch script with synthetic RGB and RGBA PNGs that use filters 0 to 4. The results were as expected. This was not a run of E1.
- Page members called:
  - `window.__SPATIAL_E2E__.openPath`. `AdmissionPanel.tsx` registers it under `isInstrumentedBuild()` (lines 325-326). `src/isInstrumentedBuild.ts` line 32 reads `VITE_MEASURE_BUILD === "1"`, set by `.env.measure` line 10. The measure frontend script builds with `--mode measure`, so the hook is compiled into the measure build.
  - DOM reads of `.working-canvas` (`getBoundingClientRect`, `clientWidth`/`clientHeight`, `getContext("webgl2")` buffer size), the same read as pan-anchor's `readBox`.
  - Playwright mouse, wheel and dblclick, and CDP `Page.captureScreenshot`. These are not page members.
  - No DEV-only hook is called. `e2eSetViewState` and `capturePixels` are absent from the measure build and unused.
- Launch: `attachOrLaunchExe(EXE)` only. With no `--measure-build` argument it prints why and exits 2. If an app was already listening it throws a VOID and does not attach.
- Fixture: the same `FIXTURE` constant form as pan-anchor.
- No `package.json` line. The run command is in the header comment: `node e2e/recentre-crossing.mjs --measure-build <path>`.
- `node --check e2e/recentre-crossing.mjs`: rc 0. E1 was not run, and the no-argument path was not run either.

**Checks (output files rcf-s2s3-*.log in the scratch folder)**
- `profile-path-scan --staged`: rc 0 at S2 and at S3 ("clean").
- `git diff --check a43c562a… HEAD`: rc 0 after S2 and after S3.
- Head after S3: `verify-cites` rc 0 (PASS, 295 loose references advised, none in my files). `verify-test-claims` rc 0 (PASS, 793 claimed tests).
- No `path:line` form in either file, checked by grep.
- Numstat `a43c562a…...HEAD -- frontends/shell`:

| File | Lines | Ceiling |
|---|---|---|
| `WorkingCanvas.recentre.test.tsx` | 218 | 300 |
| `recentre-crossing.mjs` | 317 | 450 |

  No overrun.

**Pre-gate self-check**
- Cross-module code uses the interface the other side exposes. `FakeDeck` implements what the app calls: `setProps`, `pickObject`, `finalize`, `onViewStateChange`. E1 uses `attachOrLaunchExe`, `attachConsole` and `waitForSettle` as exported by `lib.mjs`.
- The completion claims point to existing evidence: the vitest log, the typecheck log and the check logs.
- No user-facing messages were added.
- Both required tests reach their assertion. U1 fails at the W assertion and U2 at the (a) assertion.

**Written that the form does not name, or departures from the brief**
1. E1's view-state reader keeps lines in arrival order through a promise queue. pan-anchor's handler is not queued.
2. E1 treats the case 2 drag-out as VOID (exit 2) if it passes the bound or cannot land inside (0, half-shift]. The form lists only the case 1 preconditions.
3. The double-click shift is L px, which is 300 where the canvas allows. The aim is the middle of the window, a gap of half/2 below T.
4. Case 2 (iii) fails with "no origin change at the wheel tick" if no change appears. The wheel pointer is at the canvas centre. The wheel notches are deltaY +100 then −100.
5. The image settle before each capture is `waitForSettle` over all render-trace lines (quiet 3000 ms, bound 45 s). This comes from note 4(c); notes 3 and 5 give no settle.
6. The C shift in the image rule is Euclidean, compared against 4.0.
7. An unreadable image pair counts as a (c) FAIL, not a VOID.
8. The output files are `e2e/out/recentre-crossing-e1-<epoch>-case1-{start,end}.png`.
9. In the test, the fake models deck's `deepEqual` (no deep import is possible) and D19 for U2 (b). D19 is used as a precondition assertion on the tick.
10. I read the E2E hook line in lib.mjs's header and the form's "within half of a double-click shift" as above. This reading of "half of a 300 px shift" is mine.

**Hold lines** (`also=` elided; each was released with a MACHINE_RELEASED line)
- npm ci shell: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:31312`
- npm ci bundle-viewer: `… shell=bash.exe:63716`
- vitest run 1: `… shell=bash.exe:8320`
- typecheck 1: `… shell=bash.exe:72836`
- typecheck 2: `… shell=bash.exe:60476`
- vitest run 2: `… shell=bash.exe:78980`

**Push** (its own call, rc 0): `git -C C:/dev/wt/rcf push -u origin cut/recentre-crossing-view-displaced-fix`. Then `git ls-remote origin refs/heads/cut/recentre-crossing-view-displaced-fix` printed `a74a9d5cb58fbb1ccff90acd4c279b9bbb210930 refs/heads/cut/recentre-crossing-view-displaced-fix`. Porcelain is empty. No PR action was taken and I did not wait for CI.

**Background shells left:** none started, none running.

**Model:** claude-sonnet-5-5 (Sonnet 5.5). No override and no context handoff.
