# Manual operator walkthrough — `frontends/shell` cut 1

Covers exactly the two items on `NEXT-CUT.md`'s acceptance list that need an actual click-through
of the running desktop app: the happy path (picker → admission → canvas → pan/zoom/hover) and a
refusing file's typed refusal (no CRS; missing identity). Every other acceptance-list item is
verified programmatically — see the tester's report folded into this cut's design-note commit.

**Evidence class: operator-verified against this scripted walkthrough** — a human performing these
exact numbered steps by hand and recording the result, **not automated by this document itself**
(see the 2026-08-12 update below: most of the same ground is now *separately* automated by
`e2e/regression.mjs`, a distinct **E2E-verified** evidence class, not a replacement for this one). A
run of this document is recorded as: date, who ran it, pass/fail per numbered step, and any
deviation verbatim. That is a different, weaker evidence class than an assertion in a test suite,
and this file exists so the gap between the two is a named, comparable thing rather than an
unstated one.

## Why this is a script, not automation

Standing up desktop UI automation for this app (`tauri-driver` + a WebDriver client, the standard
approach for a Tauri app) is **deferred**, not attempted:

- **The file picker cannot be automated this way regardless.** `binding_pick_file`
  (`frontends/shell/src-tauri/src/commands.rs`) opens a native OS common dialog outside the
  WebView2 DOM entirely. WebDriver only reaches page content; it cannot click a button in that
  dialog. Reaching the picker step at all would need OS-level UI automation (Win32 UI Automation,
  or similar), a materially larger and more fragile undertaking than `tauri-driver` itself, and a
  different automation surface from the one that would cover the canvas/admission/pan/zoom/hover
  steps.
- **It is a new dependency and a download** (`tauri-driver`, plus a WebView2-matched
  `msedgedriver.exe`), unscoped in `NEXT-CUT.md`.
- **It earns its cost once shell E2E regressions are a real, recurring risk** — i.e. once the
  shell has enough surface and enough churn that a human re-running this script every cut is the
  more expensive path. That is not true yet: this is the shell's first cut.

When that changes, the WebDriver half (canvas, admission, pan/zoom, hover — everything inside the
DOM) is worth building; the native-picker half stays a structural limitation no Tauri e2e setup
resolves, and the picker step here would still need either a manual click or an OS-level automation
tool.

**2026-08-12 update: this deferral is superseded, not retracted.** A human-approved
`playwright-core`-over-CDP harness now exists (`frontends/shell/e2e/README.md`) — it drives the
app's own dev-mode WebView2 through the Chrome DevTools Protocol, not `tauri-driver`/WebDriver, and
was scoped and approved on those terms rather than the WebDriver path this section argued against.
Every DOM- and canvas-assertable step below is now **also** encoded as `e2e/regression.mjs`, the
**E2E-verified** class (`e2e/README.md`'s own evidence-class paragraph): driven through real IPC
and a real render loop, via the same `window.__SPATIAL_E2E__.openPath` in-page hook this document's
own reasoning above already named as the one structural gap (no driver reaches the native dialog).
What stays **operator-verified only**, unchanged by this: the native file-picker step (A2 — no CDP
driver reaches WebView2's own dialog chrome, the same limitation this section describes) and every
look-and-feel judgment call in Part A (smoothness, no visible jump/tearing/ghosting/jitter in
A4–A9; A10's exit-without-crash claim). The operator walkthrough below remains the acceptance
instrument for those; the table after the intro maps exactly which numbered steps below the script
covers and what it deliberately leaves for a human to still judge.

## What `e2e/regression.mjs` covers

Short-form cross-reference, not a duplicate of either document: each automated step ID is the exact
one `e2e/regression.mjs`'s own summary table prints. "Does not cover" only lists what that same
numbered walkthrough step *claims* that the script cannot assert — not everything a script could
never know.

**Status as of 2026-08-13: GREEN** — confirmed by a real run of the exact committed tree
(`e2e/out/regression-render-trace-1786583532688.json`, 2026-08-13: all 12 steps PASS). The
2026-08-12 RED status this replaces was diagnosed, not merely observed: `DECISIONS-PENDING.md`
entry 0 found the *fixture itself* — not the shell — carrying a true ring-vertex total over the
declared `MAX_RESIDENT_VERTICES` ceiling by construction: the `avg_vertices: 24` spec the happy-path
fixture originally carried has a true total of **2,508,699 vertices, 25.4% over the 2,000,000
ceiling** (client-decoded and writer-side counts agree bit-identically — there is no separate metric
to reconcile), so the happy path tripped a designed ceiling refusal on every first load instead of
demonstrating a clean one. (A different, smaller number — 2,012,436 — was misread at the time as
this fixture's true total; the run ledger cited above resolved it as a truncated partial sum a
since-cancelled stream carried at the shell's own refusal moment, 1,961,249 already resident +
51,187 attempted, never a file total.) Resolved 2026-08-13 by the human's option (a), entry 0: the
happy-path fixture is regenerated under the ceiling (`avg_vertices: 18`, true total 1,885,130 —
114,870 vertices / 5.7% of headroom below the ceiling, not the ~25% a casual reading of the old
`avg_vertices: 24` spec's shortfall might suggest — still the same `features: 100_000` figure
docs/07 and this suite both name, no change to any `A3'` assertion), and the ceiling refusal itself
gets its own deliberate acceptance step (`OVERCEIL'`, Part D below) against a new, purpose-built
over-ceiling fixture (true total 2,508,699, the same spec the happy path used to carry; its own
refusal lands at 78,191 of 100,000 features, 78.19%), instead of the happy path accidentally
exercising it. "Covers" below names what each step *asserts when it passes*.

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `A1'` | A1 | DOM: window title/header read "Spatial IDE"; "Open GeoParquet…" button present | that a window actually opens (this asserts page content, not window chrome) |
| `A3'` | A3 | `openPath` admits; `DescribeSummary` DOM contains these five expected substrings (CRS identifier, geometry encoding, identity source, row count, license fallback) — not a full-text verbatim match of the whole summary; no refusal panel present afterward | the transient "Opening…" button label; the picker itself (A2, not attempted — see above); any summary text outside the five asserted substrings |
| `A4'` | A4 | canvas non-blank (overall + 3×3 grid-cell sampling) after settle; "Zoom to layer" button present | whether the render *looks* like "a field of parcels" — any visual/aesthetic judgment |
| `A5'`/`A6'` | A5, A6 | after one pan and one zoom-in-then-out: no `.canvas-refusal`, no `ErrorBanner`, a fresh `[render-trace]` view-state/viewport_query entry, pixels still non-blank | smoothness; absence of visible jump, tearing, ghosting, or coordinate jitter (A5/A6's own qualitative claims); A6 itself asks for zooming "several times... including at least one large jump" — the script does exactly one zoom-in-then-out, not a repeated or large-jump gesture |
| `A7'` | A7 | pan far, click "Zoom to layer", pixels non-blank again after the re-fit settles | that the resulting fit is *the same fit A4 produced* — only non-blank pixels are asserted, not that the two fits match |
| `A8'` | A8 | a rapid ≥15-gesture burst produces no `.canvas-refusal`/`ErrorBanner` and no `too_many_pending_streams` text anywhere in the run | "never freezes or becomes unresponsive" — a responsiveness/latency claim, not measured here |
| `A9'` | A9 | a `.hover-readout` matching `id <number>` appears over a feature (located from real pixel data, not a guessed coordinate) and disappears over empty space | the `@ (x.xxx, y.xxx)` coordinate suffix's formatting; that the id changes between two specific, different polygons |
| `B2'`/`B3'` | B2, B3 | `openPath` refuses with `engine.crs_undeclared`; the panel shows that code, the verbatim message, the cut-2 remediation note, no dismiss control, and `.describe-summary` is absent (the "no summary" half of B2's own claim) | "no canvas change" (B2's other half) — that a canvas already showing a previously-admitted dataset is left pixel-for-pixel untouched by this refusal is not asserted |
| `C2'`/`C3'` | C2, C3 | same, for `engine.identity_unusable` | same as B2'/B3' above |
| `OVERCEIL'` | D1, D2, D3 | `openPath` admits the over-ceiling fixture (`{kind:"admitted"}`, not a refusal — D1); after settle, both `.canvas-refusal` and `.residency-status` are present, the latter matching the exact `<N> of 100000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)` pattern, and pixels are non-blank (D2); clicking the banner's Dismiss removes `.canvas-refusal` but leaves `.residency-status` present with unchanged text (D3, rider 1's core claim) | that "most parcels render" is actually ~97.5% or any other specific proportion — only "pixels non-blank, >2%" and the status line's own reported count are checked, not a match against a human-observed percentage; look-and-feel (does the red banner *look* alarming, does the status line read as legible/persistent to a human) |
| `REOPEN'` | the "works from any state" claim in this doc's own prose (not a numbered step); also D4's re-render/status-clear half | reopening the happy-path fixture (run immediately after `OVERCEIL'`, so from an *already-admitted*, ceiling-degraded state, not a refused one) admits, `.residency-status` is absent immediately (a dataset change clears it — D4, entry 0 rider 1, asserted before `.canvas-refusal` is even checked), no stale refusal banner is present, and the canvas is non-blank after settle | reopening from *idle* (never having admitted anything) or immediately after a *refused* state (B2'/C2' leave AdmissionPanel refused, but `OVERCEIL'` now runs — and re-admits — in between) — the other two states the prose claims but this step's current position in the run does not exercise directly |
| `NET'` | — (informational, not a walkthrough claim) | whether any `>=400` HTTP response was observed during the run | — this row exists only because `regression.mjs`'s own summary table prints a `NET'` row; it names no walkthrough step and asserts nothing that fails the run |

A10 (close the window; no crash, no hang) has no automated counterpart at all — a CDP-attached
session has no way to assert "the window closed cleanly" about the very connection it is using to
assert anything else.

## What `e2e/filter-panel.mjs` covers

A separate suite (`npm run e2e:filter-panel`, `frontends/shell/e2e/filter-panel.mjs`, filter-panel
cut P5) drives Part E's own filter-panel DOM directly — a sibling to `regression.mjs` above, not
folded into it. Same cross-reference convention: "Does not cover" lists only what the numbered Part
E step *claims* that the script cannot assert.

**Status as of the 2026-08-15 Part E E5 design-revision fresh run: GREEN** — `6/6 PASS (OPEN, PANEL',
PANELREFUSE', CLEAR', SLOW'/CANCEL', FIND')`, ledger
`frontends/shell/e2e/out/filter-panel-render-trace-1786808100036.json`. `SLOW'`/`CANCEL'` is one
combined automated step (`runStep("SLOW'/CANCEL'", ...)` in the script itself) covering both the
liveness/Cancel-appears half and the Cancel-actually-stops half in a single pass over the same
issued stream handle — not two independently run steps. `FIND'` (added this pass) is the operator's
own E5 finding permanently encoded: on a fresh open, applying the same late-matching predicate and
letting the scan run to genuine completion lands the camera on the matches (`99` rows, `1.41%`
non-background pixels observed, floor set at `0.5%`) rather than a blank canvas.

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `PANEL'` | E2 | typing `zone = 'residential'` into the real `input.filter-predicate` and clicking the real `button.filter-apply`; the filtered non-background pixel fraction is measurably lower than the unfiltered fraction (a pixel-fraction margin, not a visual read); `.filter-active` shows the applied predicate verbatim | whether the resulting scatter of polygons *looks* like a plausible "about a fifth of the shapes, not a patch removed" to a human — a look-and-feel judgment E2 itself asks for |
| `PANELREFUSE'` | E3 | typing the unknown-column predicate and clicking Apply surfaces `.filter-refusal` with the exact code `skp.filter_unknown_column` and the exact verbatim message; the canvas fraction after the refusal stays within 2 percentage points of `PANEL'`'s own filtered fraction (confirms the typo-blanks-canvas recovery re-issue actually happened, not just that *some* fraction rendered) | refusal readability in the height-capped, scrolling `.filter-refusal` region (`max-height: 12rem; overflow-y: auto`, should-fix 4) — a look-and-feel judgment only the operator makes, in a short/cramped window |
| `CLEAR'` | E4 | clicking the real `button.filter-clear` restores the unfiltered pixel fraction to within margin of the original and removes `.filter-refusal`/`.filter-active` from the DOM | nothing beyond the pixel-fraction/DOM-presence checks — no look-and-feel gap named for this step |
| `SLOW'`/`CANCEL'` | E5, E6, E7 | the OVERCEIL' pattern's `.residency-status` text on the slow fixture's own unfiltered first look, matched by regex (not a fixed `<N>`); that `button.filter-cancel` and the literal `.scan-liveness` text `"Filtering — scanning, no matching rows yet"` both appear while GENUINELY ZERO `[render-trace] batch` lines exist yet for the issued stream handle — the acceptance condition itself, asserted literally; that clicking Cancel produces `.scan-incomplete` reading `"Filtered view incomplete — scan cancelled at 0 rows"` with zero further batch lines for that handle across a bounded settle window | whether the liveness indicator *reads as* "working, not hung" to a human (E5's own qualitative claim); whether Cancel *feels* responsive/immediate (E6 — ADR-018 forbids the script from making any timing claim here, so there is nothing in that direction for it to assert); the legibility of the persistent `.scan-incomplete` text to a human eye over continued observation (E7's own look-and-feel half, beyond the exact-string match the script already performs) |
| `FIND'` | E5's point (3) | the operator's exact 2026-08-15 Part E, E5 finding, permanently encoded, on a FRESH open (not chained off `SLOW'/CANCEL'`'s own cancelled-scan state): applying the SAME late-matching predicate via the real panel DOM, letting the scan run to genuine completion (liveness/Cancel both gone, no `.scan-incomplete`), then asserting the canvas is NOT blank — non-background pixels clearly above a calibrated floor, i.e. that the camera actually landed on the matching features rather than staying wherever the unfiltered look left it | whether the camera visually looks "centered/well-framed" on the matches to a human eye (a look-and-feel judgment only an operator makes); `Zoom to layer` re-fitting to the filtered results specifically (E5 point (3)'s second half) — no automated step clicks it while a filter is active |

## Prerequisites

- Build/run from `frontends/shell`: `npm run tauri dev` (runs the Vite dev server via
  `beforeDevCommand`, compiles `src-tauri`, and opens the app window). The dev server binds
  `localhost:5180`, not Tauri's default 1420 — 1420 falls inside this machine's Windows
  excluded-port range (1335-1434), the same finding the ADR-003 spike recorded. Nothing to do
  here; named in case a bind failure ever needs explaining.
- The four fixture files below, generated by `kernel/tests/manual_walkthrough_fixtures.rs`
  (`cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`
  regenerates them from the committed generator if they are missing — nothing about the fixture
  *files* is committed, only the code that writes them, matching every other fixture in this repo).

| Fixture | Path | Purpose |
|---|---|---|
| 100k happy path | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\100k-happy-path.parquet` | Part A — the ordinary admitted case, no refusal anywhere; regenerated 2026-08-13 (`avg_vertices: 18`, entry 0 option (a)) to stay under `MAX_RESIDENT_VERTICES` — same `features: 100_000` |
| No CRS | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\no-crs-refused.parquet` | Part B — `engine.crs_undeclared` |
| Missing identity | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\missing-identity-refused.parquet` | Part C — `engine.identity_unusable` |
| Over-ceiling (deliberate) | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\over-ceiling-refused.parquet` | Part D — a valid, admitting file whose true vertex total is deliberately kept over `MAX_RESIDENT_VERTICES` (entry 0 option (a), rider 1): the same `features: 100_000, avg_vertices: 24` spec the happy path used to carry, regenerated by `generate_the_over_ceiling_refusing_fixture` (same regeneration command as the row above) |

All four open the same running app instance in sequence — no relaunch needed between parts;
clicking **Open GeoParquet…** again works from any state (idle, refused, or already admitted).

---

## Part A — happy path (100k fixture)

| # | Step | Expected outcome |
|---|---|---|
| A1 | Launch the app (`npm run tauri dev`). | A window titled "Spatial IDE" opens with an "Open GeoParquet…" button and nothing else below it. |
| A2 | Click **Open GeoParquet…**. | The native file-open dialog appears, filtered to `*.parquet` (filter label "GeoParquet"). |
| A3 | Select `100k-happy-path.parquet` and confirm. | The button briefly reads "Opening…", then a summary list appears: **CRS** `EPSG:2056 — file, axis order easting,northing`; **Geometry** `geometry (geoarrow.polygon)`; **Identity** `file:id — verified-at-open-full-file`; **Row count** `100000 (identity-uniqueness-scan-full-file)`; **Extent** the static "not established at open…" text; **Schema** column count; **License** "not declared". No refusal panel appears. |
| A4 | Observe the canvas area below the summary. | A canvas fills the remaining window space. Within a few seconds, translucent blue-ish polygons (a cadastral-parcel-like field of irregular shapes, some with holes) render, and the view **fits itself to the extent of the arriving data** — a field of parcels filling a good portion of the canvas, not a single speck at a fixed zoom. A **"Zoom to layer"** button appears at the top-right of the canvas. You should not have to hunt for the data. |
| A5 | Click-and-drag on the canvas. | The view pans smoothly; polygons track the drag with no visible jump, tearing, or stale ghosting. |
| A6 | Scroll to zoom in and out several times, including at least one large jump (e.g. scroll far in, then far back out). | The view zooms smoothly around the cursor. Polygons stay sharp — no visible coordinate jitter or drift at high zoom (this is `OffsetFrame`'s recentering; you should not be able to see it happen, only that precision holds). |
| A7 | Pan far away from the data (drag until the canvas is empty), then click **Zoom to layer**. | The camera jumps back to fit the layer's known extent — the same fit A4 produced, deterministically, regardless of what is currently loaded. |
| A8 | Pan/zoom repeatedly and rapidly for several seconds (simulating impatient use). | No error banner appears (see `ErrorBanner`/global handlers — a red banner fixed to the top would mean an unhandled error or rejection fired; in particular, no `skp.too_many_pending_streams` refusal). The app keeps responding to input throughout — never freezes or becomes unresponsive. Fresh data for wherever you land may take a brief moment (well under a second) to arrive after motion stops — pan/zoom queries are now debounced to settle rather than issued continuously mid-drag, so this pause is expected, not a hang. |
| A9 | Hover the mouse over a rendered polygon, then over empty space, then over another polygon. | A small dark readout box appears at the bottom-left reading `id <number>` (and often `@ (x.xxx, y.xxx)`) while over a feature, and disappears over empty space. The id changes when you move to a different polygon. |
| A10 | Close the app window. | No crash dialog, no hang on exit. |

**If anything deviates** (an error banner appears, the canvas never renders, pan/zoom is inert,
hover never populates, the app hangs or crashes): stop, record the exact step and what you saw
(screenshot if practical), and report it — do not continue to Parts B/C assuming it was unrelated.

## Part B — refusing file: no CRS

| # | Step | Expected outcome |
|---|---|---|
| B1 | Click **Open GeoParquet…** again (canvas from Part A may still be visible; that's fine). | File dialog appears. |
| B2 | Select `no-crs-refused.parquet` and confirm. | No summary, no canvas change. A red-bordered refusal panel appears instead, showing the code `engine.crs_undeclared` and the message **"refused: the file declares no CRS and none was asserted by the caller (no \`geo\` metadata CRS on the primary geometry column). This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent conversion)"** (verbatim). |
| B3 | Read the panel fully. | Below the message, a note reads that remediation (asserting a CRS) is cut-2 work, not available in this build. There is no dismiss control on this panel — it is replaced, not closed, the next time you pick a file. |

## Part C — refusing file: missing identity

| # | Step | Expected outcome |
|---|---|---|
| C1 | Click **Open GeoParquet…**. | File dialog appears. |
| C2 | Select `missing-identity-refused.parquet` and confirm. | A red-bordered refusal panel appears showing the code `engine.identity_unusable` and the message **"refused: `id` cannot serve as stable feature identity — the file has no such column, and no identity mapping was declared. Stable per-feature identity is required (docs/11); declare a mapping to a column that carries it. Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent"** (verbatim). |
| C3 | Read the panel fully. | The same cut-2 remediation note as Part B appears (declaring an identity-mapping column is cut-2 work). |

## Part D — deliberate ceiling refusal (over-ceiling fixture)

Entry 0's rider 1 (`DECISIONS-PENDING.md`, the human's 2026-08-13 option-(a) decision): the declared
`MAX_RESIDENT_VERTICES` ceiling is designed behavior (`limits.ts`: refuse, never silently evict or
tile), and deserves its own deliberate acceptance step — this fixture's true vertex total is kept
over the ceiling on purpose, unlike the happy-path fixture above.

| # | Step | Expected outcome |
|---|---|---|
| D1 | Click **Open GeoParquet…** and select `over-ceiling-refused.parquet`. | The button briefly reads "Opening…", then a summary appears exactly as A3 does — this file is valid and admits normally, including row count `100000 (...)`. No refusal panel appears at this stage: the refusal below is render-side, not admission-side. |
| D2 | Observe the canvas area. | Most parcels render (delivery streams in and renders for a while before the ceiling trips partway through). A red-bordered refusal banner appears, naming the stream that carried the ceiling-breaching batch, cancelled — **and** a persistent status line also appears reading `<N> of 100000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`, where `<N>` is however many features were actually resident at the moment of refusal. |
| D3 | Click **Dismiss** on the red banner. | The banner disappears. **The status line remains, unchanged.** This is the acceptance point rider 1 exists for: an incomplete-render state must stay visible for as long as it actually holds, independent of whether the operator has acknowledged the one-time banner event — dismissing the banner is not the same act as the render becoming complete. |
| D4 | Click **Open GeoParquet…** again and select `100k-happy-path.parquet`. | The canvas re-renders fully (this fixture is under the ceiling by construction, entry 0 option (a)) and the status line disappears — a dataset change clears it unconditionally (`nextResidencyStatus`'s `"dataset-changed"` transition), the same as any other reopen. |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–C.

---

## Part E — the filter panel (filter-panel cut)

ADR-021's binding acceptance condition: before any user-facing filter UI ships, the panel must
present liveness and a working cancel affordance during zero-batch filtered scans. This part is
that acceptance instrument's operator half — `e2e/filter-panel.mjs` above covers the DOM-assertable
half of the same ground; the coverage table names exactly where the two halves overlap and where
this operator pass is the only evidence.

Two new fixtures, opened in the same running app instance as Parts A–D — no relaunch needed:

| Fixture | Path | Purpose |
|---|---|---|
| Filter-zoned | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\filter-zoned.parquet` | E1–E4, E8 — 2,000 features, a nullable `zone` text column with four declared values plus NULL, scattered by a per-feature hash (not clustered in one region); `zone = 'residential'` admits some rows and excludes others, by construction. Regenerate: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture` |
| Slow filter scan | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\slow-filter-scan.parquet` | E5–E7 — 4,000,000 features, one single Parquet row group (`id` ascending with physical row order, unprunable by DuckDB's own row-group statistics), true vertex total deliberately kept over `MAX_RESIDENT_VERTICES` on its own unfiltered first look (same OVERCEIL' pattern as Part D's fixture), so that a late-matching predicate (`id > 3999900`) genuinely takes long enough, wall-clock, for zero-batch liveness/cancel to be observed rather than simulated. Regenerate: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_slow_filter_fixture -- --ignored --nocapture` |

| # | Step | Expected outcome |
|---|---|---|
| E1 | Click **Open GeoParquet…** (canvas from Part D may still be visible; that's fine) and select `filter-zoned.parquet`. | The button briefly reads "Opening…", then a summary appears exactly as A3 does (2000 features this time). No refusal panel. Below the summary, a new **filter panel** appears in the app's normal flow: an empty text input (placeholder `e.g. zone = 'residential'`), an **Apply** button, and a **Clear** button — no Cancel button, no liveness line, no refusal region yet. The canvas fits and renders `filter-zoned.parquet`'s own field of polygons (2,000 features — visibly sparser than the 100k happy-path fixture). |
| E2 | Type `zone = 'residential'` into the filter input and click **Apply** (or press Enter). | A line reading `Applied: zone = 'residential'` appears below the controls. The canvas visibly redraws to noticeably fewer polygons than E1 — the matching subset is scattered across the same extent (each feature's zone is assigned by a per-feature hash, not clustered in one region), so this should read as *the same field with roughly a fifth of the shapes*, not a patch removed from one corner. No refusal region, no liveness/Cancel (this fixture is small enough to resolve well within the anti-flicker delay). |
| E3 | Clear the input, type the typo `bogus_column_xyz = 1`, and click **Apply**. | A red-outlined refusal region appears below the controls, showing the code `skp.filter_unknown_column` and the message **"refused: `bogus_column_xyz` is not a column this dataset carries"** (verbatim). **Read it in a short window right after it appears** — this region is height-capped (`max-height: 12rem`, scrolls internally) rather than growing the panel, so judge whether the code, the message, and any field list stay reachable/readable in that capped space, not whether the panel can grow arbitrarily tall. The canvas is UNCHANGED from E2 — it still shows the `zone = 'residential'` filtered view, not blank and not reverted to unfiltered (the typo-blanks-canvas recovery re-issue). |
| E4 | Click **Clear**. | The input empties, the refusal region and the `Applied: …` line both disappear, and the canvas returns to the full unfiltered view — the same density as E1. |
| E5 | Click **Open GeoParquet…** and select `slow-filter-scan.parquet`. Wait for the first (unfiltered) look to settle, then type `id > 3999900` into the filter input and click **Apply**. | Two things, in order, both expected and stated openly — neither is a defect to report: **(1)** the unfiltered first look overflows the declared ceiling **by construction** (this fixture's true vertex total is kept far over `MAX_RESIDENT_VERTICES` on purpose, the same as Part D's fixture) — expect the same red-bordered ceiling banner plus a persistent status line reading `<N> of 4000000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)` (the automated suite's own runs against this exact fixture consistently read `163440 of 4000000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`; your own `<N>` may land elsewhere, but the surrounding text must match exactly). **(2)** After Apply: a **Cancel** button appears immediately next to Apply/Clear, and shortly after, a liveness line reads the literal text **"Filtering — scanning, no matching rows yet"** — no percentage, no ETA, no "N of M" figure. The canvas itself does not change (the predicate matches only the last 100 of 4,000,000 physically-ascending ids, so nothing has matched yet). **Judge:** does this read as *working*, not *hung*? **(3)** Design note, not part of this script's own click-path (E6 below cancels the scan before it finishes): Apply now behaves exactly like opening a dataset — it issues an unrestricted look and resets the canvas's fit anchor for the new filter generation (2026-08-15 walkthrough Part E, E5 finding: the matches used to be unfindable, off the viewport the unfiltered look happened to leave the camera at, and Zoom to layer was inert for the same reason). So *if* a filtered scan is left to run to completion rather than cancelled, the camera automatically lands on the matching features once they arrive — the same one-shot fit a fresh dataset-open performs — and **Zoom to layer**, clicked while that filter is still active, re-fits to the filtered results specifically, not the whole dataset. `e2e/filter-panel.mjs`'s `FIND'` step encodes exactly this scenario end to end (fresh open, Apply, let the scan finish, assert the canvas is not blank). |
| E6 | Click **Cancel**. | The canvas stops changing — no further polygons appear after the click. Judge only *that* it stopped, from your own observation; **do not** describe how fast or immediate the stop felt, and do not attach any duration or figure to it (ADR-018 — the shell itself cannot even measure the producer's own clock, so no such claim is available to make). If operating remotely (e.g. RustDesk), record the same degraded-channel caveat the 2026-08-14 Part A entry used for its own motion-quality judgments. |
| E7 | Read the status line that remains after clicking Cancel. | A persistent status line reads the literal text **"Filtered view incomplete — scan cancelled at 0 rows"** (0 rows — the late predicate never matched anything before the cancel). It has no dismiss control and does not disappear on its own; judge whether it stays legible over a few seconds of continued observation. The Cancel button and the liveness line are both gone — the scan is no longer in flight. |
| E8 | Click **Open GeoParquet…** again and select `filter-zoned.parquet`. | The filter panel remounts for the new dataset: the predicate input is empty again, and the refusal region, the `Applied: …` line, and the `Filtered view incomplete…` status are all gone — none of it carries over from the slow fixture. The canvas shows `filter-zoned.parquet`'s own unfiltered view, the same as E1. |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–D.

---

## Result log

Fill in after running the script above.

- **Date run:** 2026-08-14
- **Run by:** the human (Christopher), operating remotely over RustDesk. Motion-quality judgments
  (A5/A6/A8 smoothness, tearing) therefore carry a **degraded-channel caveat**: correctness was
  judged firmly; smoothness only as far as the remote channel allows. Corroborated by the app's own
  session log (`session-1786658855.log`): both refusal messages logged verbatim, the Part-D ceiling
  refusal at the predicted 2,012,436 partial sum, clean exit.
- **Build/commit:** `3f50456` (branch `cut/sql-filter` tip — supersets the merged PR #8 tree plus
  PRs #9/#10 candidate work).
- **Part A (A1–A10):** **pass with one functional deviation.** A1–A6, A8, A9, A10 pass. **A7
  deviates:** "Zoom to layer" worked once at the start (fitting from ~20% visible to the whole
  layer), and re-centers when the layer is visible — but **when the layer was panned fully out of
  view, clicking it did nothing**, which is A7's own scenario. Diagnosed same day: `fitToBounds`
  fits `residentExtentRef` (current residency only), and supersede-on-pan clearing empties
  residency when the viewport leaves the data, so the button has no target exactly when the user is
  lost. A consequence of the 2026-08-13 residency-clearing fix; the E2E A7′ step missed it because
  its fixed drags never fully left the data extent. **Fixed same day (`3748666`), two halves:** a
  dataset-lifetime fit anchor (a residency-clearing-immune union of every extent ever rendered)
  gives the button a target, and a user-initiated fit now emits the fitted view's authoritative
  bbox into the ordinary debounced query pipeline so the target repopulates (programmatic
  `setProps` camera moves never fire deck's view-state callback — verified in deck.gl source — so
  without this no query was ever issued for the fitted location). The E2E A7′ step is strengthened
  to pan provably off-data first (the operator's exact sequence); all twelve steps green on the
  fixed tree (`regression-render-trace-1786727379404.json`).
  Also observed (recorded, no action): the post-pan/zoom refill pause "seems a bit slow" — the
  designed debounce, inflated by RustDesk latency; a tuning question for panel-era polish, not a
  defect.
- **Part B (B1–B3):** **pass** — refusal code and message verbatim, cut-2 note present, no dismiss
  control.
- **Part C (C1–C3):** **pass** — same, `engine.identity_unusable` verbatim.
- **Part D (D1–D4):** **pass** (rider 1's visual acceptance point confirmed by the operator: banner
  and persistent status simultaneously readable; Dismiss removed the banner and the status
  remained; status cleared on the D4 reopen). One cosmetic deviation: the banner's **Dismiss button
  abuts the message's last word ("tiling") with no spacing** — recorded; trivial CSS fix.

### Part E run (separate pass — filter panel)

Part E did not exist during the 2026-08-14 run recorded above (that run covered Parts A–D only).
Fill in the fields below when Part E is actually run by an operator.

- **Date run:**
- **Run by:**
- **Build/commit:**
- **Part E (E1–E8):**
