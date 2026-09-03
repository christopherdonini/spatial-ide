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

**Historical note (stale as of the action-console cut, corrected here):** this section once read
"Currently RED on `A5'`-`A9'`: a queued shell defect trips a spurious ceiling refusal early in
every run (`DECISIONS-PENDING.md` entry 0)." That entry resolved 2026-08-13 (`DECISIONS-PENDING.md`'s
own Resolved section) and `A5'`-`A8'` have been green in every run since -- only `A9'` went red
later, for an unrelated reason (candidate-selection during hover-pick, its own saga below, entries
20/21 and P8-P11). Read a fresh run's own output, not this file, for current status.

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

## Action console spec (action-console cut, P5)

```
npm run e2e:console
```

`e2e/console.mjs` -- a further sibling, proving NEXT-CUT.md's display-truth claim ("the console
composes no command text") **at the UI seam**: every assertion reads the real rendered
`.console-panel` DOM (`.console-entry-class-a/-b/-c`, `.console-request-text`, `.console-refusal`,
`.console-group-header`, …), never the `consoleRecorder` module directly -- this file imports
nothing from `src/console/`. Opens `filter-zoned.parquet` exactly once (NEXT-CUT.md's
"one-click-two-commands" truth is about ONE `openPath` call). `HEADER'` expands the drawer and
asserts `.console-standing-header` carries all three required phrases, then collapses and asserts
the header (and `.console-entries`) is absent from the DOM entirely (I9). `ECHO'` asserts the
`open_dataset` entry's request parses to exactly `{skp, path, cancel_key, crs_assertion, identity}`
with the last two explicit `null`, and that the entry's OWN label version equals the entry's OWN
parsed `skp` field (self-consistent, no hard-coded version anywhere in this suite). `TWOCMD'`
re-reads that SAME open to assert `describe` also appears, parsing to exactly `{skp, dataset}`.
`HEXLIM'` drives a real pan and asserts the resulting `viewport_query` entry's bbox members are
16-lowercase-hex strings surviving quoted verbatim in the raw text (I5), and `limit` is
digits-or-null. `REFUSAL'` drives an invalid predicate through `queryWithFilter` and asserts
`.console-outcome` reads "refused" with `.console-refusal` showing the SAME typed code/message the
call's own returned outcome carries. `CLASSB'` drives `publishPrepareWithDestination` (the dev-only
seam) and asserts the resulting class-B entry names `binding_publish_prepare_e2e_destination` with
no copy button, no `{` anywhere in its row, a citation containing "not callable", and the
destination path string absent from the WHOLE `.console-panel` DOM (ADR-024's fence, proven at the
UI). `CLASSC'` sets the fill colour through the real `.style-fill-color` input and asserts the
resulting class-C entry names "no API equivalent" with an owner containing "ADR-022". `GROUP'`
issues 3 identical `queryWithFilter` calls and asserts exactly one NEW `.console-group-header`
reading "×3" whose expansion shows 3 individually-parseable `.console-request-text` blocks, never a
merged/synthetic one (I8) -- and reports what actually varies between them (nothing:
`viewport_query` carries no per-call nonce, unlike `open_dataset`'s `cancel_key`). `COPYTRUNC'`
drives a NEAR-CAP (exactly `MAX_CRS_DEFINITION_BYTES` = 65 536 bytes) `crsAssertion.definitionJson`
-- built from the REAL pinned catalog definition padded with low-quote-density filler, so the
double-JSON-encoding a naive arithmetic check would miss (the field is a STRING holding already-
serialized JSON text, so its own `"` characters double to `\"` under the OUTER request's
`JSON.stringify`) cannot silently invalidate the result -- and confirms EMPIRICALLY, not just by
arithmetic, that the largest `definition_json` any real, UI-reachable request could ever carry (the
real `CrsAssertionForm` disables Submit past this same 65 536-byte bound, per
`admission-remediation.mjs`'s OVERBOUND' step) renders UNTRUNCATED, well under
`MAX_ENTRY_RENDER_BYTES` = 80 000; recorded `NOT-REACHABLE` with the measured byte margin, not
skipped. `UNCLASS'` asserts `.console-entry-unclassified` count is 0 across the whole run, every
group expanded first. `REGRESS'` spawns `npm run e2e:regression` and `npm run e2e:admission` from
THIS process -- both attach to the already-launched app rather than relaunching, so this is
genuinely the same fresh session, not three separate app instances -- and requires both exit 0.
Same **E2E-verified** evidence class; longer default deadline (2400s, since `REGRESS'` alone can
spend up to ~25 minutes across its two sub-suites' own worst-case deadlines); leaves the app running
afterward.

**EXPECTED-FAIL, `REGRESS'` (action-console cut, P5b diagnosis, 2026-08-18):** `e2e:regression`'s own
`A9'` (canvas hover-pick) currently fails deterministically -- same buffer candidates, same CSS
coordinates, same non-background sample colour (`12,23,43,45`) across repeated fresh runs -- so
`REGRESS'` fails too via its own `e2e:regression` sub-invocation, expected until that separate defect
is fixed. **Diagnosed NOT to be this drawer's own layout**: the isolation experiment (the identical
A1'-A8' sequence, then `.console-panel { display: none }` injected via CDP immediately before A9's
own hover sequence, re-run against the SAME session/camera/dataset state) still misses with the same
signature -- `.working-canvas`'s `getBoundingClientRect()` and the GL drawing buffer's own
`width`/`height` agree with each other in BOTH the shown (1265x200) and hidden (1280x212.25) states,
the canvas stays fully inside the 800px viewport with `.app-main`'s `scrollTop` at 0 in both (no
scroll-driven miss), and hiding the drawer removes it from `.app-main`'s flex flow entirely yet the
hover still lands nowhere. The cause is elsewhere (deck.gl pick-layer vs fill-rendering divergence,
per `regression.mjs`'s own `stepA9` comment on this failure shape) -- not re-diagnosed further here;
see the action-console P5b piece's own state file/report for the full evidence.

**P5c (2026-08-18), two bounded fixes attempted, STOPPED per custodian rule 7 -- still
EXPECTED-FAIL, unchanged.** Fix 1 (`.app-rail-top`/`.app-rail-bottom`, `styles.css`/`App.tsx`):
`.app-main` no longer grows its own scrollbar at all -- mechanically verified against a live
session at the 1280x800 reference, `.app-main` `scrollHeight === clientHeight` (762 === 762) and
`.working-canvas` `getBoundingClientRect().width === 1280` (never 1265). Fix 2 (`regression.mjs`'s
own `verifyInteriorCandidate`): `stepA9` now requires a candidate's 5x5 pixel neighbourhood to be
entirely non-background AND the frame's own densest non-background `topColors` bin to clear a
150/255 alpha floor (picked from `DEFAULT_STYLE_STATE.fillOpacity` = 180/255, the actual interior
alpha this suite renders at) before preferring it, falling back to the old heuristic with a loud
`console.error` when no candidate qualifies. **With BOTH fixes live, `A9'` still fails
deterministically, byte-identical across two fresh runs** -- same `12,23,43,45` recapture colour,
and NONE of the 3 candidates now interior-verify at all (10/25, 13/25, 16/25 of each candidate's own
5x5 neighbourhood touch background) even with the canvas confirmed full-width. This independently
reproduces P5b's own isolation-experiment conclusion from a different angle: the miss is not a
layout/width artifact and does not correlate with proximity to a rendered edge either -- something
about deck.gl's own pick buffer at this camera state does not agree with the fill buffer at ANY of
the candidate points tried. Per this piece's own scope, no further attempt was made (WorkingCanvas.tsx
and the deck.gl layer/pick configuration are out of scope for an e2e-only piece); the defect now
escalates per custodian rule 7. Both fixes are otherwise real, independently-verified corrections
(the layout one in particular is unconditionally worth keeping) -- both committed (`720b6a1`,
`2e345d4`); see that piece's own final report for the full run transcripts.

**Entry 20 (2026-08-19), bounded third attempt, escalated again:** rule 7's precedent (two failed
attempts stop, a third needs the human's word) held `A9'` for the human; authorized option (a) --
a bounded, test-side-only third attempt, `stepA9` zooming in a FIXED `[3, 2]`-notch budget before
hovering, interior-verification kept unchanged. Committed as `54526d5` (the step red and loud by
design, an evidence instrument, not a claimed fix). Ran same day: escalation trigger hit --
**zero interior-verified candidates at both +3 and +5 cumulative notches**, several candidates
sitting at buffer row `y=0` (the 200px-tall frame's own top edge -- features look CLIPPED at the
canvas boundary, not merely small). Queued as entry 21: authorize one instrumented
render-diagnosis session (the entry-0 pattern) -- diagnose only, any fix through the normal gates
after.

**Entry 21 (2026-08-19), P9 instrumented session -- DECISIVE diagnosis, none of the named
mechanisms confirmed except a new one:** the human authorized the session ("start it"); it ran
against A9's exact post-A1'-A8' camera state, capturing view-state, fit-anchor, layer draw params,
and full-frame read-backs at several camera states. Findings: content is **not** clipped (rows
20-179 of the buffer are populated pre-zoom, ruling out the entry-21-named "features clipped at
the canvas boundary" reading of entry 20's own evidence); the fill layer is **healthy** (two
independent baselines each showed 22,000+ px sitting at the EXACT configured fill alpha, 180/255 --
this suite's own `ALPHA_INTERIOR_THRESHOLD` = 150 sits comfortably below that); that alpha-180
population is strongly **zoom-dependent** -- A9's own starting camera (post-A7' "Zoom to layer",
a whole-dataset fit of the fixture's 100,000 features onto a 1280x200 canvas) sits roughly **11.6x**
further out than the zoom level P9's baselines showed as interior-rich. **The one-line diagnosis:
feature-scale-vs-canvas-scale at the whole-dataset-fit zoom** -- at that scale, individual features
are near-sub-pixel, so no 5x5 interior patch (`INTERIOR_PATCH_RADIUS`) can exist for ANY feature,
regardless of which pixel a heuristic picks; entry 20's own fixed 2-4-notch budget was simply far
too small for a camera this far out, not itself evidence of a render defect. No product trace line
was needed to reach this; the product-UX question this raises (hover-pick at whole-dataset zoom
with individually sub-pixel features) is a real one, but is **not this suite's to own or fix** --
see the NOTE at the end of this section.

**P10 (2026-08-19), the fix authorized by entries 20/21 together -- bounded evidence-driven zoom
search, interior-verification retained verbatim:** `stepA9`'s fixed `[3, 2]`-notch budget (entry
20) is gone; the current `stepA9` instead searches for the zoom the interior check itself needs,
one wheel-in notch at a time (`doWheel`, canvas centre, unchanged), up to `MAX_ZOOM_NOTCHES` = 15,
re-capturing and re-running the UNCHANGED `verifyInteriorCandidate` (interior 5x5 + alpha >= 150,
untouched by this fix) after every single notch, settling between notches, stopping at the first
notch that yields a verified candidate. **Empirical result, run twice, fresh sessions, byte-
identical per-notch evidence both times: still RED -- but with a signature DIFFERENT from entry
20's, and one that CONTRADICTS P9's own diagnosis rather than confirming it.** The frame's
frame-wide non-background pixel count does not climb monotonically toward an interior-rich state
as the search zooms in: it rises for the first two notches (peaking at 90,250 of the buffer's
256,000 px, notch 2 of 15), then falls -- 63,400 / 44,433 / 27,707 / 7,557 px at notches 3-6 --
reaching **exactly 0 non-background pixels at notch 7 and staying there through notch 15**. Every
candidate through notch 6 sits at buffer row `y=0` -- the same top-edge row entry 20's own evidence
named -- so its own neighbourhood is edge-clipped to 15 pixels (3 of the full 5x5 patch's 5 rows),
of which 1-8 touch background each time; none ever reaches full interior coverage at any notch
tried. Since P9's own diagnosis predicts a camera only ~11.6x out needs a search well inside a 15-notch budget at
this `doWheel` magnitude, a full-budget miss is new evidence, not a confirmation -- surfaced here
per this piece's own instruction, not absorbed. A plausible mechanism, named but **not diagnosed
further here** (out of this test-side-only piece's own scope; `WorkingCanvas.tsx` and the deck.gl
camera/pick configuration are untouched): the zoom search anchors every notch on the CANVAS
CENTRE, not on the data's own densest region: the rise-then-fall-to-zero curve above is consistent
with the canvas-centre world point, at this exact post-A1'-A8' camera state, sitting nearer a gap
or edge of the dataset's density than its interior, so zooming in around it walks the visible frame
away from data rather than into more of it. **`A9'` therefore remains EXPECTED-FAIL** -- entries
20 and 21 are both resolved (their own recommendations were followed exactly, and the fill-layer/
scale diagnosis they produced is not contradicted, only entry 21's implicit "a modest zoom-in
resolves it" corollary is), but the step itself has not gone green; this is a NEW, undiagnosed
result, not a restatement of the entry-20/P5c evidence above. `npm run e2e:console`'s own
`REGRESS'` step (which re-runs `e2e:regression` as a subprocess) fails for the same reason; `npm
run e2e:admission` is unaffected and independently green (11/11).

**P11 (2026-08-19), GREEN -- the custodian's code-verified re-synthesis of the P9+P10 evidence,
fixing candidate SELECTION rather than the zoom search:** P10's own contradiction (a full 15-notch
evidence-driven search finding nothing, despite 90,250 non-background px existing at notch 2) sent
the investigation back to the code rather than another zoom attempt. Reading
`WorkingCanvas.tsx::summarizePixels` directly settled it: every `samplePoint` this suite has ever
used -- per-region AND frame-wide alike -- is documented BY ITS OWN TESTS as "the first
non-background pixel encountered in that region's row-major scan," i.e. structurally the TOP EDGE
of whatever content a region contains, at ANY zoom. `verifyInteriorCandidate` (P5c, unchanged
throughout P8-P11) demands a full 5x5-interior patch; a structurally-top-edge point can only ever
supply one by accident. The **complete three-part mechanism**, all three now consistent with every
prior run's evidence: (1) P9's scale diagnosis holds exactly as stated, at A9's original zoom (only
~3 alpha-180 px exist frame-wide there); (2) at P10's own notch 2-3, genuine interior fill exists
in abundance (90k+ non-background px) but the top-edge-biased `samplePoint` never once offers one
of those interior pixels as a candidate, regardless of notch; (3) the pre-P5c green (before the
interior-hardening verifier existed) worked anyway, through deck.gl's own pick tolerance around an
edge pixel -- never through an actually-sampled interior pixel, which is why hardening the
verifier (P5c) surfaced a defect that had been latent, not newly introduced, since.

**The fix, entirely e2e-side, `WorkingCanvas.tsx` and `verifyInteriorCandidate` both untouched:**
`findInteriorCandidate` (`regression.mjs`) replaces `samplePoint`-based selection with
densest-PATCH bisection over the ALREADY-exposed `capturePixels(regions)` hook -- a coarse 8x5
grid over the whole buffer picks its densest region; that region is subdivided 4x4 and the densest
sub-region kept; repeated once more only if the patch is still bigger than ~12x12px; the FINAL
patch's own CENTER pixel is the candidate, interior by construction whenever the patch's own
non-background fraction is high. The densest grid region's own (still top-edge-biased) `samplePoint`
rides along as a second, fallback candidate -- `verifyInteriorCandidate` decides between the two,
unchanged, so a wrong bisection guess can never silently pass. The zoom search keeps P10's shape
(one notch at a time, re-verifying after each, `MAX_ZOOM_NOTCHES` = 15 unchanged) but now tries
notch 0 -- the CURRENT camera, no zoom at all -- FIRST (P10 never tried pre-zoom), and adds an
early-stop: two consecutive notch-over-notch decreases in frame-wide non-background pixel count
stops the search (P10's own rise-then-fall-to-zero curve is exactly that signature).

**Empirical result, run twice, fresh sessions, byte-identical: GREEN at notch 0/15 both times**,
densest-patch bisection final fraction **100.0%** -- the very first coarse-to-fine bisection at the
UNCHANGED starting camera (no zoom-in needed at all) already lands a fully non-background 5x5
patch. This does not contradict P9's own per-FEATURE scale diagnosis (individually near-sub-pixel
at this zoom, never re-tested or refuted here): a 100%-dense small patch at this zoom is consistent
with a locally dense CLUSTER of many adjacent tiny features whose combined fill covers every pixel
in that patch contiguously, which is exactly what a real hover there would correctly pick -- not
with any single feature suddenly being large enough to fill a 5x5 area on its own. The fix bisects
toward wherever the DATA is densest, not toward a bigger single feature; on this fixture, at this
camera, that was enough on its own, with zero notches spent. `npm run e2e:regression` GREEN 2/2
fresh runs (12/12 steps each); `npm run e2e:console` GREEN 10/10 -- the first time `REGRESS'`
(which re-runs `e2e:regression` AND `e2e:admission` as subprocesses) has ever passed; `npm run
e2e:admission` independently GREEN 11/11. See DECISIONS-PENDING.md entries 20/21 (both RESOLVED,
neither's own diagnosis contradicted by this outcome) for the full authorization trail this fix
completes.

**NOTE, flagged for the architect at the next consult, not a decision made here:** hover-pick UX
at whole-dataset zoom with individually sub-pixel features (P9's own diagnosis, restated above,
never re-tested by P11's own fix -- P11 fixed candidate SELECTION, not the underlying per-feature
scale question) is a real product question, but this suite is not the place to answer it -- it is
owned by ADR-011's tiled render batches / GPU cache lifecycle direction (its own LOD slice, gate
8's territory: pick targets at a scale where individual features cannot resolve to a distinct
screen pixel need a tiling/LOD answer, not a bigger E2E zoom budget or a smarter E2E candidate
picker). This note records the question for that slice's own eventual work, not an attempt to
answer it here -- P11's own green result is an E2E-harness fix, not evidence the product-UX
question is closed.

## Residency measurement harness (viewport-residency cut, P1/P1b)

```
npm run e2e:residency-harness -- [--smoke] [--control] [--wire-identity] [--attest "<text>"] [--cold|--warm] [--arm baseline|candidate] [--tile-size coarse|medium|fine] [--fixture <path>] [--per-stream-trace]
```

`e2e/residency-harness.mjs` -- `RESIDENCY-PREREGISTRATION.md` is this suite's ENTIRE spec (§4b the
camera trace, §6 instruments/quantities, §7 watchdogs, §8 standing rules). **This piece MEASURES, it
does not SCORE** -- no G1-G7 verdict anywhere in this file; every evidence file (`e2e/out/residency-
harness-*.json`, gitignored) is a flat record for a later piece (P2 baseline / P6 tester) to score.

Real synthetic pointer/wheel gestures over `.working-canvas` drive the exact deck.gl controller code
path a real operator's drag/scroll would (two disclosed approximations: zoom's wheel-delta-to-factor
mapping is not empirically calibrated to exactly x2, and pan's screen-to-world mapping assumes
north-is-up in this fixture's stored CRS -- both named in the script's own top comment).

**Modes:** default (instrument-on baseline trial) · `--smoke` (first 3 steps only) · `--control`
(instrument-off, the §6/§8 control cell -- asserts off-ness unconditionally at run start, M10) ·
`--wire-identity` (the render-trace field-sequence identity proxy, below). `--attest`/`--cold`/
`--warm`/`--arm` declare M9's own cell-metadata fields (machine attestation, cache state, baseline vs
candidate); every evidence file also carries `buildCommit` (git rev-parse at run start),
`fixtureSha256` (hashed at start AND end, mismatch recorded), `traceVersion`
(`residencyTrace.mjs`'s own literal), and `buildClass` (a constant: `"vite-dev (tauri dev; DEV-gated
hooks; unminified client)"`, M13).

**`--tile-size coarse|medium|fine`** (viewport-residency cut P7, "the tile-size sweep selector -- the
campaign's last missing wire"): selects one of the three LOCKED grid resolutions
(`tileGridConstants.ts`'s own `TILE_GRID_LEVELS`, Amendment 11) for a candidate-arm run's own
`TileViewportStreamManager`, set pre-open via `__SPATIAL_E2E__.setResidencyTileSizeLevel`. Candidate
arm only -- given without `--arm candidate` it is WARNED loudly and NOT applied (a baseline session
never constructs a tile grid); an unrecognized value is REFUSED loudly (non-zero exit) before any
browser launch. Omitted entirely, a candidate-arm run keeps today's implicit default
(`DEFAULT_TILE_GRID_LEVEL`, currently `"medium"`) unchanged. `evidence.cell.tileSize` records the
ACTUAL level the run established (`evidence.gridFrame.level`, `TileViewportStreamManager.activeLevel`)
-- not merely what was requested -- `null` for the baseline arm or a run whose grid frame never
established.

**Entry 31 (2026-09-03, post-campaign) -- three additions with three different protocol
standings, split deliberately (this change's own reviewer gate, should-fix 7):**

- **Always-on, passive, Amendment 24:** every run now persists `wireTraceLines` (the
  wire-relevant `viewport_query`/`stream-issued`/`batch` console lines the harness already
  captured, with `at` stamps -- copied at write time, zero run-time effect) plus
  `wireTraceTimestampBasis` declaring `at` as a driver-receipt-time PROXY (Playwright delivery,
  not page emit -- fine at seconds scale, never a wire timing), so an offline pass can join
  per-stream lifecycles against the Rust session log's `candidate-tile-terminal` lines: the
  cross-step attribution the per-step segments structurally cannot express (the P12 finding, the
  attribution pass §6). Size note: a P12-shaped run carries ~2-3k wire lines, growing the
  evidence file by roughly half a MB; the captured `batch` text is Chromium's console preview
  (drops `cumulativeVertices`; `streamHandle` survives, which is all the join needs). Recorded as
  `RESIDENCY-PREREGISTRATION.md` Amendment 24, the Amendment-21 evidence-shape class.
- **Always-on, value-affecting, Amendment 24:** the instrument's segment clamp is tightened
  (entry 31 fixes 1-2): `queryToFirstByteMs` clamps at `<= 0` (a 0 is the IN-CHAIN
  arrival-then-issue delivery stamping both marks in one clock quantum -- within one step, not a
  step-boundary straddle -- never a measurement; reason `"issue-arrival-same-quantum"`, distinct
  from the negative case); `decodedToPaintedMs` is nulled
  iff the step's issue record POSTDATES its decode record (only then does the span measure
  decode -> issue-wait -> frame -- P12's 13.6s/16.4s mislabels -- while the in-chain quantum
  rows' 15-501ms paint values are genuine and KEPT); and `firstPixelCrossStepSuspect: true`
  flags such a row's `firstPixelMs` as NOT query->paint (its baseline is the late/at-arrival
  issue stamp), flagged not nulled, and only when a `firstPixelMs` exists to suspect. **This is
  NOT diagnosis-only: it changes the segment values every future run
  reports**, disclosed via the amendment; past evidence files are unchanged.
- **Opt-in, measurement-conditions-changing:** `--per-stream-trace` enables a ~1s queue-depth
  sampler (`queueDepthSamples`: `{at, inFlight, queued}` via the existing E2E hooks, awaited --
  they are async -- with a runtime type guard so a serialization regression counts as
  `queueDepthSampleErrors`, never an impostor sample) -- an extra `page.evaluate` per tick, so it
  is opt-in and declared in `cell.perStreamTraceEnabled` (the EFFECTIVE value; gated off in
  `--control`/`--wire-identity`, with `cell.perStreamTraceRequested` beside it); never use such
  a cell for scored protocol readings.

**M7 -- the `open-drain` pre-step.** Before step 1 ("fit") ever runs, this driver measures the
dataset OPEN's own natural query + first-batch paint (G7's real "cold first view" subject) as its own
row, then drains (waits for in-flight===0 + settle) before continuing. **Reported observation, not
resolved here (for the custodian's amendment):** §4b step 1's own text describes fitting "from a
cold, empty resident set" -- by the time step 1 actually runs, `open-drain` has already populated the
resident set once, so step 1's own precondition is not literally met by this trace as currently
sequenced.

**M6 -- settle requires BOTH console quiescence AND in-flight===0**, §4b's own letter
(`waitForSettleWithInFlight`), not console quiescence alone. **Disclosed limitation:** the in-flight
counter is gated by the residency instrument's own `enabled` flag (S3, no-op when off) -- in
`--control` mode it always reads 0, so a control-arm step's settle still rests on console quiescence
alone.

**M1/M3 -- first-pixel and frame-time series.** The old `requestAnimationFrame` loop is gone; a
persistent per-step `onAfterRender` hook (`WorkingCanvasHandle.armFirstPixelRenderHook`/
`disarmFirstPixelRenderHook`, proxied through a retrying `App.tsx`-level E2E hook so it can find
whichever `WorkingCanvas` instance is CURRENTLY mounted -- or none yet, for `open-drain` -- rather
than a stale one) feeds both the real frame-time series and the first-pixel stamp, which only fires
once a step's first ACCEPTED batch has ALSO arrived (never a bare gesture repaint). S7: explicit
disarm, boolean recorded (`armDisarmedCleanly`); the self-restore watchdog is scaled to the calling
step's own `settle.timeoutMs` (P1d B5 fix -- a fixed 5s previously capped `open-drain`'s 60s-settle
measurement at 5s regardless).

**M8 -- the diagonal pan's realized magnitude.** `pan-northeast`'s declared total is `distance =
width * sqrt(2)` (Amendment 1's width basis); each SCREEN-axis component is `distance / sqrt(2)` (NOT
`distance` on both axes, which would realize `distance * sqrt(2)` -- doubly diagonal). See
`applyStep`'s own doc comment in `residency-harness.mjs`.

**S1 -- pre/post view-state + realized displacement**, captured from the always-on `traceViewState`
render-trace line (world units, origin-corrected across any recenter) per step, with a genuine
assertion (not just a recording): a settled `pan` step realizing exactly zero displacement is flagged
`"FAIL: zero realized displacement for a settled pan step"`. A pan whose declared screen distance
would exceed the canvas's own footprint splits into multiple MOVE LEGS within a single continuous
mousedown -> mouseup (never released mid-pan -- releasing between legs was found, live, to risk an
extra premature debounced query; see the field-sequence identity note below).

### Render-trace field-sequence identity (proxy) -- `--wire-identity` (M11, renamed from P1's
"wire-bytes-identity assertion")

`RESIDENCY-PREREGISTRATION.md` §6/§8 asks for the bytes ACTUALLY ON THE WIRE to be identical
instrument-on vs instrument-off. This harness has no raw-byte capture (a disclosed upgrade path, not
built here) -- what it actually proves is narrower, named for exactly that: a PROXY over the ordered
sequence of typed values three always-on render-trace lines carry (`viewport_query`, `stream-issued`
-- folded in per S6, `dataset`/`streamHandle` normalized out -- and `batch`), run **OFF-ON-ON-OFF,
interleaved (S4)**, every pairwise comparison recorded, not just one ON-vs-OFF pair. **Explicitly
excluded** (named, not silently absorbed): the `residency` push/clear lines (canvas-side bookkeeping,
not wire content), and two REQUEST fields render-trace never logs at all -- `limit` and `filter`.

**Camera control: a deterministic literal camera SCRIPT, not a synthetic gesture (P1c,
`RESIDENCY-PREREGISTRATION.md` §12 Amendment 6).** `IDENTITY_VIEW_STATE_STEPS` (`residencyTrace.mjs`)
-- 3 declared literal world-space (authoritative-CRS) target/zoom poses, applied programmatically via
the DEV-gated `e2eSetViewState` seam (`WorkingCanvas.tsx`), never a real pointer/wheel gesture. Every
MEASURED cell (`--smoke`/`--control`/plain instrument-on runs) still drives real synthetic gestures
unchanged -- `e2eSetViewState` is reachable ONLY from `--wire-identity`, and the driver asserts a call
count of exactly 0 from every other mode (`measuredModeViewStateSeamAssertion` in the evidence file,
now ALSO re-checked from a `finally` block if the try block exited early, P1d suggestion 9).

**Per-step machinery, genuinely armed on every run, ON and OFF alike (P1d B3 fix).** Both an ON run
and an OFF run call the identical sequence -- `residencyBeginStep` -> `residencyArmFirstPixel` ->
settle -> `residencyDisarmFirstPixel` -> `residencyEndStep` -- for the fixture-open (`identity-open`)
and each of the 3 camera-pose steps, via `measureOneStep`'s `alwaysCallHooks: true` path. It is each
hook's OWN internal `enabled` check that no-ops on an OFF run, never a driver-side skip -- that is the
comparison this mode exists to make (an OFF run whose driver never even CALLED the instrument's own
functions would not be comparable to an ON run that did).

**Attempt history (kept as dated records in the committed gate artifact below, never overwritten):**
- **P1b** -- real synthetic pointer/wheel gestures drove the identity check. FAIL: 2 `on` runs
  disagreed with EACH OTHER (proof of a timing artifact, not an instrument effect) -- traced to CDP
  pointer-drag interpolation racing the shell's own 120ms pan/zoom debounce.
- **P1c** -- Amendment 6's deterministic camera script replaced the gesture, removing the race's own
  precondition. PASS, all 6 pairwise comparisons identical -- but the driver never called
  `residencyBeginStep`/`residencyArmFirstPixel`/`residencyDisarmFirstPixel`/`residencyEndStep` at all,
  so the PASS was later found (P1d re-review, finding B3) to be vacuous: ON differed from OFF only by
  a flag gating no code this driver ever reached.
- **P1d** -- B3's fix (above) arms the real per-step machinery on every run. Re-run live, fresh
  session (seven stale `spatial-ide-shell.exe` process trees found holding CDP port 9223 from prior
  work sessions, killed first). PASS, all 6 pairwise comparisons identical, this time with the
  instrument's own code genuinely exercised on both ON and OFF runs.

**Committed gate artifact (S11):** `e2e/residency-field-sequence-identity-gate-evidence.json` -- a
small, committed (NOT gitignored `out/`) JSON capturing each of the three attempts above verbatim (an
array of dated attempts, oldest first, none ever deleted), each with its own `_honest_result` block.
`_current_status` at the top of the file always names which attempt is authoritative and why.
