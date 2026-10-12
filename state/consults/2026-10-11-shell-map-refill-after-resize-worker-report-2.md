*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 2, phase 2 (the e2e runs), the worker-high run 00:10:26Z to 00:19:57Z by its transcript. It stopped after the layout pair because invalidator I3 fired at the head's FILL step; 12 of the 14 pairs and both e2e step mutations are outstanding. The worktrees were C:/dev/wt/refill at 64de82e6 (head) and D:/wt/refill-base at 4fd3259a (base); nothing was committed. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is b5aba87c93d127f350f02488cf067ff40379dacc5783dbe9bcc87d2957a94225.*

---

REPORT: shell-map-refill-after-resize, phase 2. STOPPED after the layout pair because invalidator I3 fired at the head (FILL). Only 2 of the 14 pairs ran, and the two e2e step mutations were not run. Nothing was fixed or re-run. The model observed is Sonnet 5.5. Sources are the logs in the scratchpad's `refill/out/`, and I byte-copied all quoted text from them.

## Diff and exe
- `git diff --name-only 4fd3259a 64de82e6` (head worktree), rc 0, listed 10 paths:
  - `KNOWN-LIMITATIONS.md`
  - `frontends/shell/MANUAL-WALKTHROUGH.md`
  - `frontends/shell/e2e/README.md`
  - `frontends/shell/e2e/layout.mjs`
  - `frontends/shell/src/App.layout.test.tsx`
  - `frontends/shell/src/App.tsx`
  - `frontends/shell/src/canvas/WorkingCanvas.test.ts`
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`
  - `frontends/shell/src/canvas/viewportBbox.test.ts`
  - `frontends/shell/src/canvas/viewportBbox.ts`
- None is under `src-tauri/`, `engine/`, `kernel/`, `protocol/` or `renderer/`, and none is `Cargo.toml` or `Cargo.lock`. The exe was built once, from the head's `frontends/shell/src-tauri`.
- Build:
  - The overlay was `tauri.k6-800.conf.json`, and `CARGO_TARGET_DIR` was `D:/wt-targets/reaim-base`.
  - The run was a shared hold, background shape, exit code 0. The log says "Finished `dev` profile [unoptimized + debuginfo] target(s) in 3m 43s".
- Copy: `D:/wt-targets/reaim-base/exes/spatial-ide-shell-refill.exe`. Its sha256 is `9497bd712c2c9eecb4a5afc9618f1507651f3682c657ac49272384fe3f46c8ae`, the same as `debug/spatial-ide-shell.exe`.

## Setup
- Base worktree: I ran `npm ci` in `frontends/shell` and in `renderer/bundle-viewer`, then `node scripts/buildViewerFirst.mjs` and `npm run build` in `frontends/shell`. Those make gitignored `dist/` and `src/generated/` outputs, as the head already had.
- Head worktree: `node_modules` is present in both packages.
- Tools: the scratchpad's `refill/` has `build-h.sh`, `run-suite.sh`, `app-up.ps1`, `app-down.ps1`, `shim/npx.cmd`, `tauri.k6-800.conf.json` and `out/`.
  - `run-suite.sh <base|head> <tag> <script> [timeout]` sets `REFILL_WT`, which `app-up.ps1` reads.
  - The `crs/`, `reaim2/` and `cust2/` originals were not touched.
- Fixtures: the suites hardcode `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`. That is one copy shared by both arms, and it was present, so I generated nothing. Both hashes were equal before and after each run.

| Fixture | sha256 |
|---|---|
| `filter-zoned.parquet` | `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46` |
| `100k-happy-path.parquet` | `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49` |

## Runs
All runs used the exe above, a fresh launch and `app-down` before and after. Each was in its own shared hold, with the hold granted and released.

| Suite | Arm | Worktree commit | rc | Failing steps |
|---|---|---|---|---|
| layout | base | `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23` | 0 | none |
| layout | head | `64de82e688aac402264d225852c70c752148971a` | 1 | FILL |

FILL at the head, byte-copied from `layout-head.log`:
`[FILL] FAIL (8108ms): FILL: no zoom within 15 further notches satisfies the precondition (growth per side 156px, cell 1584.129979002464): invalidator I3, STOP and report`

The suites after layout (regression, refusal-contract-baseline, admission, filter, filter-panel, style, publish, console, residency-harness, the two source-changed routes, source-watch-idle, pan-anchor) have not run. That is 12 of the 14 pairs.

## Layout comparison, step by step
- OPEN, E-KEYS, E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR, E-REOPEN and FIXTURES: same outcome, PASS at both.
  - The notes were also equal: the E-KEYS map sizes, E-FIT `668x530` and `754x498`, and E-FLOOR `480x320`.
- RESIZEQ differs, as predicted.
  - Base, byte-copied: `RECORDED, NOT ASSERTED (H1): viewport_query lines within 3 s of Ctrl+I with the pointer still: 0 after closing the Inspector, 0 after reopening it`
  - Head, byte-copied: `closing the Inspector gave 72 new viewport_query lines within 3000ms (base: 0), reopening gave 0; predicted new cells 96 (recorded beside the observed count; 480x576 -> 758x576 CSS px), the trace settled after the close`
  - So the computed cell count is 96, the observed `viewport_query` count is 72, and the reopen count is 0. They are different units: new cells against query lines.
- FILL: it does not exist at the base. At the head it failed with I3 (above).
  - Notch count: not reached, because the precondition was never satisfied.
  - No toggle was done, so there are no `stream-issued` or `batch` lines.
- BURST: it does not exist at the base. At the head it passed, recorded only. Byte-copied: `RECORDED, NOT ASSERTED: 24 moves of 4px; 0 viewport_query lines at ms after the first move [] (last move at 397 ms, release at 400 ms)`.
  - The `viewport_query` times are none (0 lines).
  - Context: FILL threw first, so BURST ran on the 100k fixture without FILL's notches, and the earlier state had a larger last-queried box. That is a reading of mine, not a measurement.
- I2 did not fire: no existing step differed.

## Invalidators and H1
- **I3 fired:** FILL's precondition search found no satisfying zoom (message above). It is a precondition failing by construction, with no workaround applied.
- **Reading of the cause (derived from the code, not observed in a run):**
  - In `layout.mjs`, `stepFill` needs `cellPx < growth/2` and the grown view inside the anchor box. The anchor box is the middle half of the frame, per the code comment.
  - If that frame comment holds, the grown view (about `size.width + growth` px wide) must span at most `baseSpan/2`, so `2^zoom >= 2*(width+growth)/baseSpan`.
  - The cell bound is `2^zoom < (growth/2)*dim/baseSpan`. A window exists only if `(growth/2)*dim > 2*(width+growth)`, with `dim` 8, 16 or 32 for the level.
  - The window can be empty or narrower than one wheel notch's zoom step, so the search can miss it. The log does not print the level, the width or the zoom, so I could not confirm this.
  - A diagnostic run would need the custodian's word.
- **I1:** did not fire. RESIZEQ at the head shows a `viewport_query` after a layout change: 72 lines within 3000 ms.
- **I6:** did not fire. Both `settleFully` calls in RESIZEQ passed, and BURST's settles passed.
- **H1 (what was shown):**
  - A region toggled: shown at the head by RESIZEQ, closing then reopening the Inspector, with 72 lines then 0. FILL (the other named step) did not complete.
  - A splitter dragged: BURST ran and recorded 0 `viewport_query` lines. It asserts nothing, so it shows no query for that drag in that state.
  - The window resized: no step does a window resize with a `viewport_query` check. E-FIT and E-FLOOR resize the window but do not count queries. I added no step.

## Differences from the form or brief
- Only the layout pair ran, because I3 fired. Pairs 2 to 14 and both §4 mutations are outstanding.
- The suites read fixtures from the main checkout's `target/fixtures`, not from per-worktree copies. Nothing was generated.
- The base's `src/generated/NOTICE.txt` came from `npm run build`, matching the head's state.
- I kept `run-suite.sh`'s default 1500 s timeout and ran each held call in the background shape. The wait was a single blocking `until grep` on the log's `rc=` line.

## Final state
- Head worktree: HEAD `64de82e688aac402264d225852c70c752148971a`, `git status --porcelain` empty.
- Base worktree: HEAD `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23`, `git status --porcelain` empty.
- No app, vite or hold of mine is running.
  - `app-down` reported "port 9223 free" and "port 5400 free" after both runs.
  - Nothing is listening on either port, and the holds folder is empty.
  - Some `msedgewebview2.exe` processes remain in the task list. I did not start them as separate processes (the app's trees were killed by `app-down`) and did not touch them.
- Logs are in the scratchpad's `refill/out/`: `layout-base.log`, `layout-head.log`, `build-exe.log` and the two `.down.txt` files.
