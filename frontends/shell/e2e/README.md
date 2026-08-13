# E2E harness

Drives the shell's own dev-mode WebView2 with `playwright-core` over the Chrome DevTools Protocol (CDP) -- not a
Playwright-managed browser, no browser download. `lib.mjs` attaches to (or launches) the real `tauri dev` app;
`debug-session.mjs` admits a fixture through the real admission path and reads the rendered frame's pixels back.

## Security posture (docs/09, binding)

The WebView2 remote-debugging port is **never** a shipped or checked-in default. `attachOrLaunch` generates a Tauri
config overlay at `e2e/out/tauri.e2e.conf.json` (gitignored), setting the window's `additionalBrowserArgs` to wry's
own default args plus `--remote-debugging-port=<port>`, then runs `tauri dev --config <that path>` -- the only place
the flag touches disk, regenerated fresh per launch. `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` is **not** used: wry
always sets `additionalBrowserArgs` itself, so WebView2 ignores that env var (verified live against
`msedgewebview2.exe`; root cause in `wry-0.55.1/src/webview2/mod.rs`). Setting it *replaces* wry's defaults rather
than appending (`spikes/adr-003-crs-rendering/README.md`'s "Remote debugging" note), so the overlay repeats them
verbatim. Nothing in `tauri.conf.json`, Vite config, or Rust ever references the port; a packaged `tauri build`
never sees the overlay. The in-page hooks (`src/e2e-test-surface.ts`, registered in
`AdmissionPanel.tsx`/`WorkingCanvas.tsx`) are gated on `import.meta.env.DEV` and compiled out of production -- `npm
run build` succeeding proves that, not this paragraph.

## Running it

```
npm run e2e:debug [-- <fixturePath>]
```

Defaults to `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\100k-happy-path.parquet` (regenerate: `cargo test
-p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`). Attaches to an already-running
instance on CDP port 9223 (`SPATIAL_E2E_CDP_PORT` overrides) if one exists -- including one an operator launched by
hand the same way (`tauri dev --config e2e/out/tauri.e2e.conf.json`) -- else generates the overlay and launches
`tauri dev` itself. Prints a summary and writes the full report to `e2e/out/debug-session-<epochms>.json`. Exit 0
means the run completed, not that anything rendered -- this is an instrument, read the report. A run this script
launches is left running afterward; a run it merely attached to was never its to stop.

## Evidence class

Findings from this harness are **E2E-verified** -- driven through real IPC and a real render loop, but via an
in-page hook that bypasses the native file dialog. That is a distinct, weaker claim than **operator-verified**
(`MANUAL-WALKTHROUGH.md`): the native dialog and look-and-feel judgment calls stay operator-verified, since no CDP
driver reaches WebView2's own dialog chrome.

## Regression suite

```
npm run e2e:regression
```

`e2e/regression.mjs` encodes `MANUAL-WALKTHROUGH.md`'s automatable steps as assertions -- same
harness, same **E2E-verified** evidence class, not a replacement for the operator-verified
walkthrough (its own coverage table maps exactly which step each covers). Prints a per-step
PASS/FAIL table (`NET'` informational only); exit is non-zero iff any step FAILed; leaves the app
running afterward, same as `e2e:debug`.

**Currently RED on `A5'`-`A9'`**: a queued shell defect trips a spurious ceiling refusal early in
every run (`DECISIONS-PENDING.md` entry 0) -- read a fresh run's own output, not this file.

## Filter spec (sql-filter cut, P5)

```
npm run e2e:filter
```

`e2e/filter.mjs` -- a sibling to `regression.mjs`, not folded into it, so a real filter defect is
never entangled with the unrelated `A5'`-`A9'` flakiness noted above. Opens
`target/fixtures/manual-walkthrough/filter-zoned.parquet` (regenerate: `cargo test -p spatial-kernel
--test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`), then
drives `window.__SPATIAL_E2E__.queryWithFilter` (registered only once a dataset is admitted, mirrors
`capturePixels`) -- the same `ViewportStreamManager.requestViewport` seam a future filter panel would
call, per NEXT-CUT.md P5. `FILTER'` asserts a valid predicate (`zone = 'residential'`) renders
measurably fewer non-background pixels than the unfiltered load, over the same fixed camera viewport,
without going blank. `REFUSED'` asserts an invalid predicate (an unknown column) surfaces a typed
`skp.filter_*` code/message with no crash or hang. Same **E2E-verified** evidence class as
`regression.mjs`; same watchdog/deadline discipline; leaves the app running afterward.
