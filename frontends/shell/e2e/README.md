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

## Filter panel spec (filter-panel cut, P5)

```
npm run e2e:filter-panel
```

`e2e/filter-panel.mjs` -- a further sibling, this one driving the actual rendered `.filter-panel` DOM
(`input.filter-predicate`, `button.filter-apply`, `button.filter-clear`, `button.filter-cancel`,
`.filter-refusal`, `.scan-liveness`, `.scan-incomplete`) rather than the `queryWithFilter` hook
`filter.mjs` uses -- P3/P4 of the filter-panel cut built the panel `filter.mjs` predates. `PANEL'`
types `zone = 'residential'` into the input and clicks Apply, reusing `filter.mjs`'s own 60%-margin
pixel-fraction check. `PANELREFUSE'` types an unknown column, asserts `.filter-refusal` shows
`skp.filter_unknown_column` verbatim, and that the canvas still shows the PREVIOUS filtered view (the
typo-blanks-canvas recovery re-issue). `CLEAR'` asserts the unfiltered fraction is restored.
`SLOW'`/`CANCEL'` is ADR-021's own acceptance condition, asserted literally: opens a new
~4,000,000-feature fixture (regenerate: `cargo test -p spatial-kernel --test
manual_walkthrough_fixtures generate_the_slow_filter_fixture -- --ignored --nocapture` -- see that
generator's own doc comment for why it is sized the way it is, and why a single Parquet row group is
what makes the late-matching scan genuinely slow rather than collapsing to a near-instant, prunable
tail read), asserts the OVERCEIL' pattern openly first (this fixture's declared precondition: it
overflows `MAX_RESIDENT_VERTICES` on its own unfiltered first look), then applies a late-matching
predicate (`id > <features - 100>`) and asserts `button.filter-cancel` + `.scan-liveness` are BOTH
present while GENUINELY ZERO `[render-trace] batch` lines exist yet for the issued stream handle,
then clicks Cancel and asserts `.scan-incomplete` appears with no further batch lines for that handle
over a settle window. That one step applies its predicate via `window.__SPATIAL_E2E__.queryWithFilter`
rather than the DOM input/Apply pair -- disclosed in the script's own top comment -- because obtaining
the issued stream handle needs a return value a DOM click cannot give, and NEXT-CUT.md's own evidence
plan names the hook as a sanctioned handle source; `queryWithFilter` reaches the identical `applyFilter`
seam the real Apply button calls (the filter-panel cut's own "deviation-3 retrofit"), so the resulting
DOM state is exactly what a real Apply click would produce. No timing assertion anywhere in this
step (ADR-018) -- every wait is a bounded robustness poll, never a claim about how fast anything
happened. Same **E2E-verified** evidence class; same watchdog/deadline discipline (longer default,
600s, for the larger fixture's own admission/settle time); leaves the app running afterward.

## Style spec (style-panel cut, P6)

```
npm run e2e:style
```

`e2e/style.mjs` -- a further sibling, driving the real rendered `.style-panel` DOM (`input.style-
fill-color`, `input.style-fill-opacity`, `input.style-outline-color`, `input.style-outline-width`,
`button.style-reset`, `pre.style-document`) rather than any hook. `STYLE'` sets fill colour + opacity
1.0 through the real inputs (plain `page.fill()` -- verified empirically to fire React's `onChange`
correctly for both `type="color"` and `type="range"` on this app's installed playwright-core@1.62.1 +
React 18.3.1, per this script's own top comment; a native-setter-bypass fallback was tested and
confirmed to also work but is not needed) and asserts `capturePixels`' dominant non-background
`topColors` bin is an EXACT match for the set colour -- opacity 1.0 means no blending, the one case
this suite claims bit-for-bit. `OPACITY'` lowers opacity to 0.4 and asserts only that the dominant bin
CHANGED (never a literal -- the buffer blends over transparent black). `OUTLINE'` sets a distinctive
outline colour/width and asserts that exact colour family appears in `topColors`, then sets width back
to 0 and asserts it disappears. `DOC'` parses `pre.style-document`'s own `textContent` and asserts it
matches the current controls field for field. `RESET'` clicks `button.style-reset` and asserts the
document returns to `DEFAULT_STYLE_STATE` exactly and pixels return to `STYLE''s` own baseline colour
family (a small per-channel tolerance, not bit-for-bit -- only the opacity-1.0 case is claimed exact).
Every `capturePixels` call in this suite happens with the panel EXPANDED, once, and never collapsed
again (reviewer gate, style-panel cut P7 fixes, S4) -- `StylePanel` now renders BELOW
`.canvas-container` (`App.tsx`), so `.canvas-container`'s own top/height no longer depend on whether
the panel is collapsed or expanded (CUT-STATE.md's own re-measurement); the collapse-before-capture
dance this suite originally needed, from when the panel sat above the canvas and expanding pushed it
toward and past the 200px floor, is gone. Expanding still narrows `.canvas-container` by ~15px
(`.app-main`'s own vertical scrollbar appearing once the expanded panel's content exceeds the 800px
viewport), so this suite expands exactly once, before its first capture, and stays expanded for every
later one -- comparable widths throughout, never a collapsed-vs-expanded mismatch within one run. Same
**E2E-verified** evidence class; same watchdog/deadline discipline; leaves the app running afterward.

## Publish spec (publish cut, P4)

```
npm run e2e:publish
```

`e2e/publish.mjs` -- a further sibling, driving `window.__SPATIAL_E2E__.publishPrepareWithDestination`
(a **dev-only test seam**, `commands.rs::binding_publish_prepare_e2e_destination`,
`#[cfg(debug_assertions)]`, compiled out of a release build) rather than `publishPrepare`.
`binding_publish_prepare`'s own native OS save dialog has no CDP-reachable automation path at all --
unlike admission's picker (a separate command `openPath` can simply skip calling), publish's picker
is fused inside that one Tauri command, so reaching anything past it needs this host-side seam. The
seam supplies a destination directly and otherwise runs the identical `publish::prepare` the real
command runs, minting the grant host-side from that supplied path exactly as the real command does
(F-5 holds through it) -- **this suite therefore does not exercise the native picker itself, only
the operator's manual walkthrough (MANUAL-WALKTHROUGH.md Part G) does.** `publishExecute` (the real
Submit button's own function) is driven unchanged.

Opens `target/fixtures/manual-walkthrough/filter-zoned.parquet` (regenerate:
`cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture --
--ignored --nocapture`). `APPROVED'` prepares a fresh `target/e2e-publish-out/...` destination and
asserts the prompt data reaching JS: `source_content_hash`/`style_hash` present, `destination_display`
naming the chosen destination, `row_scope` reading whole-file, `filter_scope` null, and
`outcome_summary` (ADR-017's Exposure review, 2026-08-17, condition 1 -- G3) naming the destination's
own basename and pattern-matching its stable skeleton (folder/data partition/viewer/manifest,
never a digit -- no row or partition count is known yet at `prepare` time). **No
`confirmation_phrase` field exists on `PublishPromptData` at all** (reviewer gate, publish cut B1 --
the host never hands the expected typed phrase to JS); this suite derives the phrase it types from
`destination_display`'s own basename, the same defence-in-depth derivation a page script could
perform, and executes with it, verifies the resulting bundle with the conforming reader
(`kernel/examples/verify-bundle.rs`, ADR-017 §14), and reads back the two `spatial-audit/1` lines
for that attempt (`approval_route` `"shell-dialog"`, a normalized destination, no
credential-looking content). `REFUSED'` executes with a wrong phrase and asserts no bundle
directory, no `.staging-*` debris, and an audit pair `refused`/`ApprovalRefused`. `EXPIRED'` is
SKIPPED with a stated reason (`publish.mjs`'s own comment): `PENDING_ATTEMPT_TTL` has no
env/test-shortenable knob, and the property is already unit-tested
(`publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown`) without a 120s sleep.
`FILTERED'` applies `zone = 'residential'` through `queryWithFilter` (the same seam a real
`FilterPanel` Apply click uses), asserts the prompt's `filter_scope` is the conditional block's own
sentence verbatim, then publishes whole-file and asserts the manifest's `operation.filter` says
`{"kind":"whole-file"}` and the bundle's row count is the FULL fixture's 2 000 rows -- both by the
manifest's own claim and by the reader's independent decode -- proving the active filter never
leaked into the published stream (P0's own guarantee, exercised end to end through the real
boundary). **Audit-log determinism**: reads `SPATIAL_IDE_AUDIT_LOG` if the invoking environment set
one, else the real per-user default; `main()` refuses to proceed if `attachOrLaunch` attached to an
already-running instance rather than launching fresh, since only a fresh launch is guaranteed to
have inherited this process's own environment. Same **E2E-verified** evidence class; longer default
deadline (900s, matching `filter-panel.mjs`'s own heavier-suite precedent -- this suite also builds
and runs a Rust example as a subprocess); leaves the app running afterward.
