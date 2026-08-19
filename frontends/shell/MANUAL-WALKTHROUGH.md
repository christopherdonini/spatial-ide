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

## Part F — the style panel, and the hero round-trip (style-panel cut)

NEXT-CUT.md's own binding note 8: "the hero round-trip is: style in shell → copy the visible
document → `publish-bundle --style` → bundle viewer." Every earlier part shows the shell rendering
what it already knows; this part is the whole point of the cut — a style edited live in the shell,
carried by hand through the publish CLI, and checked against a completely separate consumer
(`renderer/bundle-viewer`, the same TS resolver `renderer/style-ts/src/style.ts` powers on both
sides) that never talked to the shell at all.

Reuses `filter-zoned.parquet` (already listed in Part E's own fixtures table above — style v0 has
no filter/attribute dependency of its own, so no new fixture is needed).

| # | Step | Expected outcome |
|---|---|---|
| F1 | Click **Open GeoParquet…** (canvas from Part E may still be visible; that's fine) and select `filter-zoned.parquet`. Below the filter panel, click the collapsed **▸ Style** disclosure. | The summary/canvas admit exactly as Part E's E1 describes. The style disclosure expands (**▾ Style**) to reveal, BELOW the canvas (not above it — the panel was moved below `.canvas-container` after the reviewer gate's S4 fix): a **Fill colour** colour swatch, a **Fill opacity** slider, an **Outline colour** swatch, an **Outline width** slider, a **"Reset to default"** button, and a read-only, monospace text block showing the current style document. |
| F2 | Pick a distinctive **Fill colour** (something visually unlike the current blue-ish fill) and drag **Fill opacity** all the way to its maximum (1.0). | The canvas updates live — no admission dialog, no query, nothing round-trips through the kernel (a style edit is a re-render of already-resident data only). Judge: does the colour change land promptly with no flicker worth reporting? (Renders are rAF-coalesced — at most one GPU frame per animation tick — so an isolated repaint, not a visible flash or double-draw, is the expected result.) |
| F3 | Drag the **Fill opacity** slider continuously from one end to the other, watching the canvas the whole time. | The fill's transparency tracks the drag smoothly — judge only whether it *looks* smooth to you, in the moment; do not attach a duration, frame rate, or any other figure to what you saw (ADR-018 — the shell cannot measure its own paint timing here, so no such claim is available). If operating remotely (e.g. RustDesk), record the same degraded-channel caveat earlier motion-quality judgments in this document used. |
| F4 | Pick a distinctive **Outline colour**, then drag **Outline width** up from 0; once outlines are visibly present, drag it back down to exactly 0. | Once width is above 0, outlines appear around every polygon in that colour. Once width is back down at exactly 0, outlines disappear entirely — not merely thin, genuinely absent (`buildLayers.ts` never draws the outline layer at `outlineWidth === 0`). |
| F5 | Read the text block at the bottom of the expanded panel. | It is valid JSON: `{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#rrggbb"},"fill_opacity":{"literal":<0..1>},"outline_color":{"literal":"#rrggbb"},"outline_width":{"literal":<0..64>}}}`. Judge: does `fill_color.literal` match the swatch you picked in F2 (as a lowercase `#rrggbb`), does `fill_opacity.literal` read `1` (from F2), and do `outline_color.literal`/`outline_width.literal` match F4's own last-set values (width `0`, since F4 ends by dragging it back down)? This text IS the model — nothing about the panel's controls exists that this block does not already say. |
| F6 | Click **"Reset to default"**. | The controls and the canvas return to exactly today's original rendering (`fill_color` `#4285f4`, `fill_opacity` `0.7058823529411765` i.e. `180/255`, `outline_color` `#000000`, `outline_width` `0` — visible in the text block). This is a **fresh edit**, not an undo: there is no history to step back through, no "redo" available afterward, and nothing about the earlier F2–F4 edits is retained anywhere — clicking Reset a second time in a row simply re-applies the identical default state. |
| F7 | **The hero round-trip.** Repeat F2/F4 to set a style you like (any distinctive fill colour, opacity, outline colour/width). Select all the text in the document block (click inside it, Ctrl+A, Ctrl+C) and save it verbatim to a file — e.g. open Notepad (Start → Notepad; RustDesk reaches the desktop fine for this), paste, and **Save As** `C:\dev\spatial-ide\target\my-style.json`. Then open a terminal (PowerShell or `cmd`) and run, exactly: <br><br>`C:\dev\spatial-ide\target\debug\publish-bundle.exe --data "C:\dev\spatial-ide\target\fixtures\manual-walkthrough\filter-zoned.parquet" --style "C:\dev\spatial-ide\target\my-style.json" --viewer "C:\dev\spatial-ide\renderer\bundle-viewer\dist" --out "C:\dev\spatial-ide\target\filter-zoned-styled" --name filter-zoned --attributes zone --viewer-program "Spatial IDE bundle viewer" --viewer-copyright "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors" --viewer-license AGPL-3.0-or-later --viewer-notice NOTICE.txt --corresponding-source-url "https://example.invalid/spatial-ide" --approve filter-zoned-styled`<br><br>This is a class-3 external side effect (ADR-006) — it will print the gate banner and, because `--approve filter-zoned-styled` already names the destination's own final path component, it publishes without an interactive prompt. It should end by printing `bundle`, `rows`, `partitions`, and the rest of the summary lines, with no error. Then, from `C:\dev\spatial-ide\renderer\bundle-viewer`, run: <br><br>`node scripts/serve-bundle.mjs "C:\dev\spatial-ide\target\filter-zoned-styled" 8731`<br><br>It prints `serving ... at http://127.0.0.1:8731/viewer/index.html` — open that exact URL in a browser (Edge is already on this machine). | The bundle viewer loads the published bundle (status line reads something like "1/1 partitions verified · 2000 features drawn, ..."), and — **the judgment call this whole round-trip exists for** — the polygons' fill colour, fill opacity, and outline (colour and width) in this separately-loaded static page visibly match the style you set on the shell's own canvas in F7's first half. This is a look-and-feel comparison only you can make; no automation touches `publish-bundle` or the viewer's rendered pixels. |
| F8 | Close the browser tab/terminal from F7; return to the shell. | Nothing about the shell changed — the style panel still shows whatever F7's edit left it at (or F6's default, if you reset after). The shell itself has no publish button anywhere in this tree; the round-trip you just performed by hand is the only path from a shell style edit to a published bundle. |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–E. In
particular, if `publish-bundle.exe` is not yet built, run `cargo build -p spatial-kernel --bin
publish-bundle` first (from `C:\dev\spatial-ide`); if `renderer/bundle-viewer/dist` does not exist,
run `npm run build` from `renderer/bundle-viewer` first.

## What `e2e/style.mjs` covers

A separate suite (`npm run e2e:style`, `frontends/shell/e2e/style.mjs`, style-panel cut P6) drives
Part F's own style-panel DOM directly — a sibling to `regression.mjs`/`filter-panel.mjs` above, not
folded into either. Same cross-reference convention as Parts A–E's own tables: "Does not cover"
lists only what the numbered Part F step *claims* that the script cannot assert.

**Status as of the reviewer-gate P7-fixes tree (`f0c3b7a`): GREEN** — `6/6 PASS (OPEN, STYLE',
OPACITY', OUTLINE', DOC', RESET')`, ledger
`frontends/shell/e2e/out/style-render-trace-1786819236324.json` (CUT-STATE.md, style-panel cut
reviewer-gate-fixes section).

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `OPEN` | F1 | `filter-zoned.parquet` admits; `.style-disclosure`'s `aria-expanded` is `"false"` (collapsed by default) on a freshly admitted dataset | that the panel visually renders below the canvas rather than above it (a DOM-order fact, not asserted by this step directly — though `App.tsx`'s own JSX structure is what S4 fixed) |
| `STYLE'` | F2 | setting fill colour + opacity 1.0 through the real `input.style-fill-color`/`input.style-fill-opacity` controls changes the canvas's dominant non-background pixel bin to an EXACT match for the set colour (opacity 1.0 blends over nothing, so this is the one case asserted bit-for-bit) | whether the change "lands promptly with no flicker worth reporting" — a look-and-feel judgment only F2 itself asks for |
| `OPACITY'` | F3 (indirectly) | lowering `fill_opacity` changes the dominant pixel bin (asserted as a CHANGE, never a literal — the buffer blends over transparent black) | smoothness of a continuous drag — F3's own qualitative claim; this step sets one discrete value, it does not drag |
| `OUTLINE'` | F4 | setting outline colour + width > 0 makes that exact colour family appear in the canvas's pixel data; setting width back to 0 makes it disappear entirely | nothing beyond the pixel-presence/absence checks — no look-and-feel gap named for this step |
| `DOC'` | F5 | `pre.style-document`'s parsed JSON matches the current controls field-by-field (`fill_color.literal`, `fill_opacity.literal`, `outline_color.literal`, `outline_width.literal`) | nothing — this step's own claim is exactly F5's claim, machine-checked |
| `RESET'` | F6 | clicking `button.style-reset` returns the document to `DEFAULT_STYLE_STATE` exactly, and the dominant pixel bin returns to the baseline colour family (a 3-per-channel tolerance, not bit-for-bit) | that no undo/redo affordance exists anywhere in the DOM — not asserted directly, only that Reset itself produces the same default state whether it is the first or a later click |
| — | F7 | — | **the entire round-trip.** No automated suite touches `publish-bundle`, the bundle viewer's serve step, or a pixel-level comparison between the shell's canvas and the viewer's rendered page — this is Part F's own reason to exist as an operator-verified step. (`renderer/tests/style_shell_agreement.rs`, a Rust test, separately proves a shell-emitted document is *accepted* by the publish-side grammar and *resolves* to the same draw parameters — but it asserts none of what F7 asks a human to look at.) |
| — | F8 | — | nothing beyond `OPEN`'s own admission — F8 makes no new claim of its own |

---

## Part G — publish (publish cut)

`NEXT-CUT.md`'s own framing, verbatim and binding: *"This cut builds and evidences the first
exposure surface for a class-3 publish, against machinery that ALREADY EXISTS... **It does not
discharge ADR-017's acceptance condition.** The condition's discharge is the human's decision at
the end, on the evidence and the surface itself."* Every step below through G9 is that evidence —
including the one click no CDP driver can reach (the native destination picker, G2) and two
judgment calls only an operator can make (G3, G6). **G10, at the end, is the decision itself** — not
a table row, a question addressed to the human alone.

Reuses `filter-zoned.parquet` (already listed in Part E's own fixtures table above — publish v0
needs no fixture of its own; any admitted, styleable dataset works, and reusing this one keeps the
row-count/zone-filter facts Parts E/F already established available for G8's own filter-active
step).

| # | Step | Expected outcome |
|---|---|---|
| G1 | Click **Open GeoParquet…** and select `filter-zoned.parquet` (canvas from Part F may still be visible; that's fine). Below the filter panel, expand **▸ Style** and set a distinctive style (Part F's F2/F4 — an unusual fill colour and a visible, distinct outline) so the published bundle is visually identifiable later. Then expand the collapsed **▸ Publish** disclosure, below **Style**. | The summary/canvas admit and the style panel behave exactly as Parts E/F describe. The Publish disclosure expands (**▾ Publish**) to reveal a **Row scope** fieldset with two radio options — **Whole dataset** and **Current view** (checked by default) — and, below them, one **Publish…** button. If the canvas has had no pan/zoom gesture yet this session, **Current view** is disabled and a reason paragraph reads *"No settled view yet — pan or zoom the canvas once before publishing the current view."*; pan or zoom once and it enables. No filter-scope sentence appears yet (none is active — that is G8), and no refusal/summary block is present. |
| G2 | Click **Publish…**. | **The one step no automation in this document's own suites can reach**: a native OS **Save** dialog appears — the same structural limitation this document's intro names for the Open dialog's own picker (no CDP driver reaches WebView2's dialog chrome), except here there is not even a JS-only bypass to script around it: publish's picker is fused *inside* one Tauri command (`e2e/publish.mjs`'s own top comment). Choose a destination **under `C:\dev\spatial-ide\target\`**, giving it a memorable final name of your own choosing (e.g. `C:\dev\spatial-ide\target\manual-walkthrough-publish\my-parcels`), and confirm. The **Publish…** button briefly reads "Preparing…". |
| G3 | Read the approval dialog that appears, in full, before typing anything. | A modal appears, rendering `PublishPromptData`'s own fields in this exact order (`PublishDialog.tsx`, transcribed directly from source): a header line reading **`publish-static-bundle — class 3 — irreversible`**; immediately below it, set apart in its own shaded block, **one plain-language sentence** naming the concrete outcome — e.g. *"This will create a folder named "my-parcels" at C:\dev\spatial-ide\target\manual-walkthrough-publish, containing the selected rows as one or more data partitions, the interactive viewer page, and a manifest."* (ADR-017's Exposure review, 2026-08-17, condition 1 — the human's own G3 finding on the PRE-condition dialog, verbatim: *"there's a lot of things written but not necessarily that clear"*; this sentence is the fix, composed host-side from the destination you chose in G2, and it names no row/partition COUNT because none is known yet at this point — the wording says "the selected rows" and "one or more data partitions" rather than inventing a number); then the field list — **Source** (the dataset's own logical name), **Source content hash** (`sha256:…`), **Style hash** (`sha256:…` — the style you set in G1), **Destination** (the FULL path you chose in G2, never truncated or ellipsized), **Grantor** (`os-user <your Windows account name> — grant remaining: <N>s`, a static number the host sent once, never ticking down), **Row scope** (a sentence naming whichever radio you left selected in G1 — *"row scope: the whole file — every row the dataset contains"* for Whole dataset, or the current-viewport wording for Current view); no filter-scope block (none is active yet — G8 is where that appears); then a standing, bold, red-orange warning reading **"This cannot be undone. Nothing here can remove a published bundle."** (verbatim — the same sentence `kernel/src/permission/approval.rs`'s CLI prompt already carries); then the instruction **"Type the destination's final path component to confirm."**, an empty text input, and **Cancel**/**Publish** buttons (**Publish** greyed out while the input is empty — typing anything at all enables it; nothing about what you type is checked client-side, only that it is non-empty). **JUDGE:** is the scope complete and readable — do you know exactly what will be written where, from what source, with what style, before you type anything? |
| G4 | Type a phrase you know is WRONG (e.g. `nope`) into the field and click **Publish**. | The dialog closes immediately — no re-prompt, no retry loop. In the Publish panel below, a typed refusal renders: code `publish-refused`, message **"refused: the confirmation did not name the destination. Expected exactly `<the destination's own final path component you chose in G2>`. Approval names *this* execution — a bare `y` would confirm that a key was pressed, not that the operator read where an irreversible publish was going (ADR-006 class 3; docs/09)"** (verbatim, with the bracketed part replaced by your own G2 destination's own final component — `kernel/src/permission/approval.rs`'s `ApprovalRefused::NotMatched` Display, crossing to the panel unmodified). No bundle exists at the destination you chose (the folder is empty or absent — check in Explorer if you like). **This is the one-prompt-no-retry property, felt live**: there is no "try again" control anywhere on the refusal itself — a new attempt means clicking **Publish…** again, from the top, native picker included. |
| G5 | Click **Publish…** again — either the same destination (now known to be untouched) or a fresh one — and this time type the CORRECT phrase (the destination's own final path component, read exactly off the dialog's own **Destination** field) and click **Publish**. | The confirming view is replaced by an executing view: a phase line (`role="status"`) that updates through the publish's real phases (`verifying-source`, `querying`, `query-running`, `writing-partitions`, `writing-style`, `writing-viewer`, `writing-manifest`, `finalizing` — `kernel/src/publish/mod.rs::PublishPhase::as_str`; not every phase is guaranteed to be observed on a fast, small-fixture run, `query-running` in particular per its own doc comment; no duration or percentage anywhere, ADR-018) and a **Cancel publish** button. On a fixture this small these may flash by too fast to read individually — judge only that phase text is present and changing, never its speed. The dialog then closes and a quiet summary renders in the panel: **"Published."**, then a definition list — **Destination** (the bundle path), **Rows**, **Partitions**. No duration/`build_millis` figure anywhere (the evidence guard rail: the UI publish path is UNMEASURED this cut, and stays that way). Nothing auto-opens — no browser tab, no file-explorer window. |
| G6 | Open a text viewer (Notepad is fine) on `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`. | One JSON object per line — this file accumulates across every publish attempt ever made on this machine (every earlier automated `publish.mjs` run included), so scroll to the **last few lines**: your G4 attempt's own pair (an `intent` line, then an `outcome` line reading `"outcome":"refused"`, `"error_kind":"ApprovalRefused"`), then your G5 attempt's own pair (`intent` + `"outcome":"success"`). Both outcome lines read `"approval_route":"shell-dialog"`. Both intent lines' `"destination"` field is forward-slash-normalized and does not contain `C:\Users\<you>` or `C:/Users/<you>` — a `target\` destination like this walkthrough's own is outside the audit machinery's recognized user-profile roots, so it is reported plainly, as itself, with `"residual_classes":["local-filesystem-path"]` on the intent line **naming** that fact rather than hiding it (`kernel/PERMISSION-BOUNDARY.md`'s own declared behavior for this class — only a `credential`-class residual is fatal). **JUDGE:** is this the audit record you asked for — would it satisfy you, reading it in six months?<br><br>**Reading the audit log** (ADR-017's Exposure review, 2026-08-17, condition 2 — the human's own G6 finding, verbatim: *"honestly can't tell what's going on"*): rather than reading the raw JSONL above by eye, from `C:\dev\spatial-ide` run `cargo run -p spatial-kernel --bin publish-bundle -- --audit-show` (add a path argument, or set `SPATIAL_IDE_AUDIT_LOG`, to point at a log other than the default `%LOCALAPPDATA%\spatial-ide\audit\publish.jsonl`). It prints one plain sentence per intent/outcome pair — your own G5 attempt should read something like `2026-08-17 08:44 — publish to C:/dev/spatial-ide/target/manual-walkthrough-publish/my-parcels — APPROVED via shell dialog and SUCCEEDED (2000 rows, 1 partition)`, and your G4 attempt something like `... — REFUSED: the confirmation did not match the destination (wrong phrase, or none given)`; an interrupted attempt (an intent with no outcome) reads `... — intent recorded, no outcome (interrupted?)`, and any line that fails to parse is reported as its own `CORRUPT` line rather than silently dropped. Read-only — this command never writes to the log. |
| G7 | From `C:\dev\spatial-ide\renderer\bundle-viewer`, run `node scripts/serve-bundle.mjs "<G5's own destination>" 8732` (Part F's own F7 command, pointed at G5's own bundle path, on a fresh port so it does not collide with a still-running Part F session). Open the printed URL (`http://127.0.0.1:8732/viewer/index.html`). | The bundle viewer loads (a status line reads something like "1/1 partitions verified · 2000 features drawn, ..."), and the polygons' fill colour, fill opacity, and outline in this separately-loaded static page visibly match the style you set in G1 — the same look-and-feel comparison Part F's F7 asks for, now reached by clicking **Publish…** in the shell instead of running `publish-bundle.exe` by hand. The bundle is real: nothing about G5's success summary was a simulation. |
| G8 | Apply a filter if not already active (Part E's panel — e.g. `zone = 'residential'`), then click **Publish…** again (either scope option). | The approval dialog carries, in its own alert block below **Row scope**, this sentence verbatim: **"this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter"** (`publish.rs::FILTER_SCOPE_SENTENCE`). **Cancel without publishing** — either dismiss the native picker instead of confirming it (G2's own step), or, once the dialog appears, click its own **Cancel** button. No bundle is written either way. (Optionally, if curious: reopen the audit log — no new pair appears for either cancellation. This was checked, not merely asserted: reading `publish.rs` shows `AuditLog::open_for` and the intent record are written only *inside* `execute_with_progress`/`boundary::execute` — never during `prepare`, and `PublishDialog.tsx`'s own Cancel button (`handleAbandon`) never calls `execute` at all, so an abandoned-after-picker attempt reaches neither. Confirmed live as well, not only read: preparing an attempt through the dev-only test seam and deliberately never executing it left the audit log's line count and content completely unchanged — zero lines mentioned that attempt's own destination.) |
| G9 | Close the app window. | No crash dialog, no hang on exit — the same claim A10 makes. |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–F. (Except
G4 and G8's refusals/cancellations themselves — those ARE the expected outcome, not a deviation.)

### G10 — the decision

Addressed to the human, not to whoever is running this script. Nothing below is a checkbox.

**ADR-017's Status block, verbatim:** *"Acceptance condition attached by the human: before publish
is exposed through SKP, any shipped CLI/UI, MCP, plugin, notebook or AI surface — and **no later
than Prototype exit** — the kernel must enforce a **scoped publish grant, explicit approval, and a
redacted audit record** (the §15/§18 obligations). Until then `publish-bundle` remains
developer/test tooling only."*

**The 2026-08-07 clarification to that condition, verbatim:** *"...exposure through SKP, any
shipped CLI/UI, MCP, plugin, notebook or AI surface additionally requires that **the exposure
surface itself pass review**, and that review must verify one rule in particular: **the requester
must never mint the grant** (F-5). Until such a surface exists and passes, `publish-bundle` remains
developer/test tooling."*

**What this cut built and evidenced, briefly:** a binding-local, two-command host seam
(`binding_publish_prepare`/`binding_publish_execute`, never SKP); a grant minted host-side from the
native picker's own answer and the dataset's own `ContentPin`, never from anything JS asserts (F-5,
exercised by every automated and manual attempt above); a DOM approval surface whose one comparison
stays in Rust (no JS ever sees or checks an expected phrase); per-attempt audit logging (F-9); a
reviewer gate over the whole cut (B1/B2 fixed as blocking, S1/S2/S5 fixed, S3/S4 named as debt, not
silently dropped); an automated suite (`e2e/publish.mjs`: `OPEN`/`APPROVED'`/`REFUSED'`/`FILTERED'`
green, `EXPIRED'` unit-tested instead of run); and this walkthrough, G1–G9, as the operator's own
click-through of exactly what none of that automation can reach.

**The question only you answer:** does this surface satisfy the clarified condition — has the
exposure surface itself passed review, with F-5 verified live (the requester never mints the
grant)? Is publish now permitted to be a product feature **on this surface** — the shell's UI, this
exact two-command seam, this exact DOM dialog — and on this surface *alone*? (SKP, MCP, any
plugin/notebook/AI surface stay fenced regardless of this ruling; ADR-017's condition is per-surface,
and none of those have been built or reviewed by this cut.)

Your ruling goes in this Part's own result log below, in your own words. **Nothing else in this
tree — no ADR, no `CUT-STATE.md` section, no docs page — may claim the condition discharged until
it is written there.**

## What `e2e/publish.mjs` covers

A separate suite (`npm run e2e:publish`, `frontends/shell/e2e/publish.mjs`, publish cut P4) drives
the SAME `binding_publish_prepare`/`execute` seam Part G's own Publish button drives — through a
dev-only destination-supplying seam (`publishPrepareWithDestination`) rather than the real Open
dialog, since the native picker itself has no CDP-reachable path at all (this file's own top
comment). Same cross-reference convention as every earlier coverage table: "Does not cover" lists
only what the numbered Part G step *claims* that the script cannot assert.

**Status as of the publish-cut reviewer-gate tree (`21bb90b`): GREEN** — `OPEN`/`APPROVED'`/
`REFUSED'`/`FILTERED'` all PASS, `EXPIRED'` SKIPPED with a stated reason (`CUT-STATE.md`'s
`P5-fixes` section: exit code 0, checked directly).

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `OPEN` | G1 | `filter-zoned.parquet` admits; `publishPrepareWithDestination` registers (dataset-scoped) | the Style panel edit, or the Publish disclosure's own DOM (radio buttons, disabled reason text) — `OPEN` only calls `openPath`, it never touches either panel |
| `APPROVED'` | G2–G7 (everything past the native picker) | every field `PublishPromptData` carries (`source_content_hash`/`style_hash` present and well-formed, `destination_display` names the chosen path, `row_scope` reads whole-file, `filter_scope` is `null`); executing with the phrase derived from `destination_display`'s own basename succeeds; the real bundle is verified by `kernel/examples/verify-bundle.rs` (ADR-017 §14's conforming reader); the audit pair (`approval_route:"shell-dialog"`, a normalized destination, no credential-looking substring) | **the native Save dialog itself** (G2 — no CDP path reaches it at all); the operator's own reading/judgment of the rendered dialog (G3's own JUDGE call); serving and visually comparing the bundle in a browser (G7's own JUDGE call, which this script never attempts — it decodes bytes, not pixels); reading the audit file by eye (G6's own JUDGE call) |
| `REFUSED'` | G4 | executing with a wrong phrase returns a typed refusal; no bundle directory is created; no `.staging-*` debris under the destination's own parent; the audit pair reads `outcome:"refused"`, `error_kind:"ApprovalRefused"` | that the refusal actually **renders** in the DOM as `RefusalBlock` (`.admission-refusal`/`.admission-refusal-code`/`.admission-refusal-message`) — this script only inspects the hook's own returned outcome object, never the page's rendered markup, for this suite |
| `FILTERED'` | G8 (the sentence-and-manifest half only) | the filter-scope sentence is present, verbatim, when a filter is active; the published manifest's own `operation.filter` reads `whole-file` and the bundle's row count equals the FULL dataset, both by the manifest's own claim and by the conforming reader's independent decode — the active filter never leaks into the published rows | **G8's own cancel-at-picker/cancel-at-dialog scenario** — `FILTERED'` always executes to a real success, it never cancels; the no-audit-record-on-cancel claim in G8's own parenthetical was checked separately, by direct source reading plus one throwaway, non-suite CDP script (prepare via the dev-only seam, deliberately never execute, re-read the real audit log — zero new lines), not by anything committed to this suite |
| `EXPIRED'` | — (no Part G step) | — | this step is SKIPPED in every run (no TTL-shortening test knob exists; `PENDING_ATTEMPT_TTL` is a hardcoded 120s constant) — its own property is covered only by `publish.rs::tests::a_pending_attempt_past_its_ttl_is_treated_as_unknown`, a Rust unit test with no sleep; nothing in Part G exercises a 120-second wait either |
| — | G9 | — | nothing beyond `OPEN`'s own admission — no automated step closes the app window, the same gap A10/F8 already name |
| — | G10 | — | **entirely.** No automated suite, and nothing in this repository, can make the human's own ruling — that is G10's whole reason to be a distinct block rather than a table row |

---

## Part H — the hero slice at 5 GB (at-scale cut)

`NEXT-CUT.md`'s own framing, binding — architect design consult 2026-08-17, the human's own "pass
to the next cut" approval, including its three premise corrections (sub-second open; NO
publish-side whole-file refusal, the reader refuses only after an irreversible write; the fixture
has NO attribute column and 403 prunable row groups). This Part runs the `docs/07` hero slice — open
a 5 GB GeoParquet → filter in SQL → style it → publish a static interactive bundle — at the scale
`docs/07` actually names, for the first time. **Steps H1–H9 below are cited throughout to
`kernel/RESULTS.md`'s own recorded figures; none of those figures is this operator run's own
number. H10, at the end, is the human's own exit judgment, not a table row** — the same shape G10
already established.

### The observation-vs-claim rule (binding, inline here — `NEXT-CUT.md`'s own text, compressed but complete)

Every duration this Part's own steps record carries this verbatim prefix:

> Observation (operator wall-clock, over RustDesk; no preregistration, no canary, no binary pin —
> not a measurement, and not comparable to any figure in `kernel/RESULTS.md`):

And, seven rules, none of them optional:

1. **Buckets only** — under-a-second / a-few-seconds / tens-of-seconds / minutes. Never a raw
   figure of this run's own.
2. **Never beside a budget verb** — no duration recorded in this Part sits next to "meets,"
   "budget," or a `docs/08` line.
3. **Never met/missed** — no verdict is scored against anything recorded here.
4. **Never compared** — not against another step in this run, not against an earlier Part, not
   against `kernel/RESULTS.md`.
5. **Never divided** — no throughput, ever (the standing rule every section of
   `kernel/RESULTS.md` already keeps).
6. **Cancellation gets NO duration** — ADR-018's own instant-pair discipline in full; a
   cancellation step in this Part records only that it happened and what it left behind, never how
   long.
7. **Citing a `kernel/RESULTS.md` figure ≠ attributing it to this run** — every kernel-side number
   quoted below is that file's own, from its own tree, its own session, its own build; none of it
   describes anything this operator run measures.

One new fixture, opened in the same running app instance as every earlier Part — no relaunch
needed:

| Fixture | Path | Purpose |
|---|---|---|
| 5 GB scale-pass parcels | `C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet` | Part H — the declared `docs/07` hero-slice scale. `kernel/tests/scale_pass.rs`'s `spec_5gb()` (seed `0x5EED_2056_0000_0005`, `AttributeMode::None` — no attribute column, `id` ascending, ~403 row groups; **do not edit the pinned harness**); 3,300,000 features, 5,004,376,705 B, `sha256:5ae955c5…c1788` (`kernel/RESULTS.md` fifth section's own fixture table, exact). **Do not regenerate** — hash-gated restoration only (ADR-006: regeneration is a restoration only if the hash matches; every fifth- and sixth-section `kernel/RESULTS.md` figure keyed to this file depends on it). Gitignored, ~5 GB — not committed, same as every other fixture in this document |

| # | Step | Expected outcome |
|---|---|---|
| H1 | Click **Open GeoParquet…** and select `parcels-5gb.parquet` (any earlier Part's canvas may still be visible; that's fine). | Per `docs/01` principle 7's declare-and-observe framing: the button reads **"Opening…"**, BRIEFLY — `kernel/RESULTS.md` fifth section's own cold-open row measured **146.681 / 146.679 / 181.267 ms**, kernel-side, cold, across three independent full-boot samples (cite, never attribute: a `Dataset::open` figure from a dedicated cold-open protocol, not a UI paint-to-paint measurement, and not this run's own number). A summary appears with **row count `3300000`** (RESULTS fifth section's fixture table, exact). By the same fixture's own vertex density — **~104.7 vertices/feature** (RESULTS fifth section: 345,507,850 vertices ÷ 3,300,000 features) — the shell's `MAX_RESIDENT_VERTICES = 2,000,000` ceiling (`frontends/shell/src/canvas/limits.ts`) is expected to trip almost immediately: **N ≈ 2,000,000 ÷ 104.7 ≈ 19,000 features (~0.6% of 3,300,000)**. Expect the Part D/OVERCEIL' ceiling shape — a red-bordered banner plus the persistent `.residency-status` line reading `<N> of 3300000 features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`, `<N>` near but not exactly 19,000 (that arithmetic is a derived estimate; the exact trip point is this run's own observation). **Auto-fit fits ONLY what arrived** — a thin band or a sparse scatter across the fixture's own grid, not the whole layer, is the expected, designed shape here, never a defect to report. |
| H2 | Pan and zoom around the canvas, the same motion Part A's A5/A6/A8 exercised. | Every viewport re-fills toward the same `MAX_RESIDENT_VERTICES` ceiling H1 tripped — expect the ceiling banner/status to reappear on most stops, by H1's own arithmetic. **A tighter (more zoomed-in) viewport is expected to feel SLOWER to its first pixels than a wide one** — the inverse of ordinary intuition, cited, never attributed: `kernel/RESULTS.md` fifth section, finding 4 ("Without an index, a tighter viewport costs *more* to first batch") — whole file 72.175 ms → quarter 94.943 ms → 1/64 256.684 ms, first-batch p50, with no index in this engine's default planner (ADR-011 is unmeasured direction, not settled design — never cited as a fix here). Click **Zoom to layer** at some point: the fit anchor is the dataset-lifetime union of every extent a viewport has actually **visited** this session (the A7 fix, Part A's run record) — **not** the full dataset extent, which was never fully resident at once at this scale to establish. |
| H3 | Type a late, engineered-non-prunable predicate into the filter panel — `id * 2 > 6599800` — and click **Apply**. | **Read this callout before judging the step** (P1 pre-check, `CUT-STATE.md`, this cut). Admission succeeds — ADR-021's three stages (structural/namespace/bind, `engine/src/predicate.rs`) admit this predicate exactly as they would any arithmetic comparison on `id`, the fixture's ONE filterable column (`AttributeMode::None` — no attribute column exists to filter on instead). **The P1 probe found this predicate is NOT genuinely slow on this fixture**: it, its declared fallback (`id / 2 > 1649950`), and a quadratic candidate tried live (`id * id > 10889340010000`) all returned their ~99-row tail match with an under-a-second first batch and total time against the real 5 GB file (bucket language; a pre-check, not a measurement — n=1 per cell, no canary, no pin). The likely reason, stated as an observation with a plausible mechanism, not a proven decomposition: with no attribute column, a `WHERE` clause on `id` alone only ever has to decode a ~26 MB column across 3,300,000 rows to be evaluated — the ~4.95 GB geometry column is fetched only for matching rows — so an admitted, arithmetically-obscured predicate is cheap here regardless of whether DuckDB's own row-group statistics can prune on it. **So: expect Apply to succeed and resolve quickly, camera landing on the ~99-row tail match** (Part E's E5 finding — Apply behaves like opening a dataset). **If** a **Cancel** button and the `"Filtering — scanning, no matching rows yet"` liveness line (`SCAN_LIVENESS_DELAY_MS = 200`, `App.tsx`) DO appear with a real window to click during your own live run, exercise them: the click carries **no duration** in this record (ADR-018 — "acknowledged" is retired from prose; no instant pair is named for it here), and the status afterward should read the persistent `"Filtered view incomplete — scan cancelled at <N> rows"` shape, judged only as present and legible, never timed. **If no such window appears** (the P1 finding's predicted case), record that plainly: the acceptance condition's ADMISSION half is demonstrated live at 5 GB; its LIVENESS/CANCEL half is not exercisable on this fixture's own shape — `slow-filter-scan.parquet` (Part E, 4,000,000 features, ONE row group, `id > 3999900`) remains the one fixture in this tree that has actually produced that behavior, and substituting it here would be exactly the "faked on a small fixture" the P1 pre-check was told never to do. **Either outcome is a PASS for this step** — the honest report is the acceptance condition, not a particular UI affordance appearing. |
| H4 | Clear the filter, type `id < 15000`, click **Apply**. | A direct column comparison on `id` — DuckDB's own row-group statistics prune this cleanly (unlike H3's engineered case) and it selects an early, contiguous slice: 15,000 rows × ~104.7 vertices/feature ≈ 1,570,500 vertices, comfortably under the 2,000,000 ceiling — **expect NO ceiling banner this time**, the clean-filter demonstration this step exists for. Apply behaves like opening a dataset (Part E's E5 finding, cited above): the camera lands on the matching subset, not wherever H1–H3 left the viewport. |
| H5 | Expand **▾ Style** and edit fill/outline as Part F's F2/F4 describe. | A pure re-render of whatever is currently resident — no admission, no query, nothing round-trips through the kernel (Part F's own claim, unchanged by scale: a style edit never re-fetches data). |
| H6 | **Mandatory sizing pre-step, before clicking Publish**: pan/zoom to roughly **1/8 × 1/8 of the layer's own extent** (an eighth of the width, an eighth of the height — not an eighth of the area). Arithmetic, shown rather than asserted: 1/8 × 1/8 = **1/64 of the layer's area**; `kernel/RESULTS.md` fifth section's own fixture table gives the 1/64 viewport's row count over this exact grid, EXACTLY: **51,984 rows** (≈52k). Bytes: the fifth section's Results table gives the full-file publish's own totals — **5,737,397,728 B ÷ 3,300,000 rows ≈ 1,738 B/row** — so 51,984 rows × ~1,738 B/row ≈ **90,348,192 B ≈ 90 MB**. Partitions: `PUBLISH_PARTITION_TARGET_BYTES` is 1 MiB (`engine/src/stream.rs`) and binds before `PUBLISH_PARTITION_ROWS` (8,192) at this per-row byte size — 90 MB ÷ 1,048,576 B ≈ **86 partitions** (the fifth section's own full-file run landed 6,636 partitions over 3,300,000 rows, ≈497 ≈ **~500 rows/partition** average — consistent with the byte cap binding first, not the row cap). **Stay under ~300k rows, or H7 quietly becomes H8** (H8 is the whole-dataset case; H7 assumes a viewport-sized publish). Click **Publish…**, choose **Current view**, pick a destination under `target\`. | Four things, in this declared order. **(1)** the **Publish…** button reads **"Preparing…"** — per `docs/01` principle 7 and `DECISIONS-PENDING.md` item 7 (the architect's and custodian's declare-and-observe recommendation, standing unless overridden before the run): this is `ensure_pinned`'s own whole-file SHA-256 (`frontends/shell/src-tauri/src/publish.rs`'s own disclosed-limitation comment: "no cancel affordance and no progress report of its own"), **long, uncancellable, and progress-less** at this file's size, **paid once per admitted dataset** (idempotent — a later publish attempt on the same still-open dataset does not pay it again). **The only figure ever on record for this phase is WITHDRAWN**: a draft of `kernel/RESULTS.md`'s sixth section printed 20,046.3 ms for a whole-file rehash, sourced from an INVALIDATED attempt, and withdrew it explicitly ("withdrawn here rather than laundered into the run of record" — sixth section, its own two provenance gaps). **Record this phase's own length in buckets only**, per this Part's rule box — no figure from this repository may stand in for it. **(2)** the approval dialog (Part G's G3 describes every field) — **no row count anywhere on it, by design**: nothing before `querying` executes knows how many rows a viewport predicate will actually select. **(3)** executing, in phase order (`PublishPhase::as_str`, Part G's G5): `verifying-source` re-hashes the 5 GB file a SECOND time — this phase IS cancellable and labelled, unlike phase (1) (`kernel/RESULTS.md` fifth section's own A6 cancellation cell for this exact phase: `VerifyingSource` p50 13.700 ms, **met** the 100 ms budget, n=7 of 7 — cite, never attribute; ADR-018's own instant-pair naming: that figure is `cancel_requested → cancel_observed` on the KERNEL's own producer clock, not this UI run's) — then `querying`, then `writing-partitions`. Once `writing-partitions` has started, click **Cancel publish** and confirm the same "leaves nothing" property Part G's G8 parenthetical already checked (no destination, no staging debris) — **cancellation itself carries no duration in this write-up, full stop** (ADR-018; this Part's own rule box). **(4)** if left to complete instead: a quiet success summary, **no `build_millis`, no duration anywhere** — the standing evidence guard rail Part G's G5 already names. |
| H7 | From `renderer/bundle-viewer`, run `node scripts/serve-bundle.mjs "<H6's own destination>" 8733` (Part F/G's own command, a fresh port). Open the printed URL. Optionally, from `C:\dev\spatial-ide`, also run `cargo run --release -p spatial-kernel --example verify-bundle -- --bundle "<H6's own destination>"` (the strict ADR-017 §14 reader — `kernel/RESULTS.md` fifth section's own full-file run of this reader took **29,384.239 ms** by its own clock at 3,300,000 rows / 6,636 partitions, cite, never attribute; H6's own viewport-sized bundle is expected far below that, bucketed only if timed at all). | The bundle viewer loads this viewport-sized bundle (well under both ADR-017 §16 reader ceilings at H6's declared sizing) and renders your H5 style. `verify-bundle`, if run, reports every partition byte-count/hash/decode/row-count check passing — the same conforming-reader contract Part G's own coverage table already cites. |
| H8 | **The honesty step. Say plainly, before clicking anything: there is NO publish-side refusal above the reader's ceilings anywhere in this tree.** `kernel/RESULTS.md` fifth section, finding 2 ("`docs/07`'s hero slice does not complete end-to-end at 5 GB under bundle format v1"): a whole-file 5 GB publish SUCCEEDS — 6,636 partitions = **6.6% of `MAX_PUBLISH_PARTITIONS`** (100,000, `engine/src/stream.rs`) — cite, same fifth-section fixture table — and only the reference viewer then refuses, typed, at load. Two shapes, gated by which the human chooses live. **H8a (default — proceed on this unless overridden before the run)**: click **Publish…**, choose **Whole dataset**, watch the phase line move through `verifying-source` → `querying` → `writing-partitions`, then click **Cancel publish** mid-flight. Judge only: nothing appears at the destination, no staging debris, and a cancellation audit pair (`--audit-show`, H9) records it — a property, never a timing; **no duration attached to any part of this step.** **H8b (ONLY on the human's own explicit go-ahead, IN THE MOMENT — `DECISIONS-PENDING.md` item 8, not this document's to authorize)**: let the SAME whole-dataset publish run to completion instead of cancelling (`kernel/RESULTS.md` fifth section's own full-file publish run of record: A **98,983 ms**, B **106,492 ms** — cite, never attribute, and note the fifth section's own rule that these two runs' wall times may be reported as individual facts and MAY NOT be differenced), serve it (H7's own command), and read the bundle viewer's own typed ceiling-exceeded refusal — RESULTS finding 2, now reached at the UI rather than only argued from the manifest arithmetic; this is the evidence ADR-025 (named as this decision's home in `DECISIONS-PENDING.md` item 8; not yet filed — P4 files it as proposed only if H8 confirms) would cite. | **H8a:** destination absent afterward, audit pair present, no duration reported anywhere. **H8b (only if authorized live):** success summary (no duration, same as H6/G5), then the viewer's own typed refusal on load — read its exact code/message and record it verbatim in the result log, the same discipline Parts B/C's refusal panels used. |
| H9 | From `C:\dev\spatial-ide`, run exactly: `target\debug\publish-bundle.exe --audit-show` (the built binary directly — `target/debug/publish-bundle.exe` already exists per this cut's own pre-check; no `cargo run` needed). | One plain sentence per intent/outcome pair, Part G's G6 format, now over a log carrying H6's and H8's own attempts too — **judge legibility at THIS volume**: G6's own remediation (`--audit-show`, filed against the human's 2026-08-17 exposure-review condition 2) was built and reviewed at a handful of lines; this is that same reader meeting a log a real 5 GB session has actually grown. Does it stay a plain sentence per line, or does scale make it harder to read than G6's own small-log demonstration suggested? |

**If anything deviates:** stop, record the exact step, and report it, same as Parts A–G. (Except
H3's own no-window outcome, and H8a's cancellation / H8b's refusal — those ARE the expected
outcome, not a deviation.)

### H10 — the exit judgment

Addressed to the human alone, not to whoever is running this script. Nothing below is a checkbox.

**The question `NEXT-CUT.md` poses, verbatim:** is the hero slice demonstrated at 5 GB, **"and
which verb, if any, is not"** — predicted, before any run, in that same document: **"publish holds
for a viewport subset; whole-file is publishable but not viewable."** H6/H7 above are the
viewport-subset case; H8b, if run, is the direct test of the whole-file half of that prediction.

**What this piece built and evidenced, briefly:** the P1 predicate probe (`CUT-STATE.md`),
corroborating H3's own callout rather than the architect's original untested assumption about this
fixture's shape; H1–H9 above, cited throughout to `kernel/RESULTS.md`'s actual recorded figures,
never this run's own numbers.

Your ruling goes in this Part's own result log below, in your own words — verbatim, exactly as
G10's own instruction reads. **Nothing else in this tree — no ADR, no `CUT-STATE.md` section, no
docs page — may claim at-scale demonstrated until it is written there** (`NEXT-CUT.md` P4's own
instruction).

---

## Part I — admission remediation (admission-remediation cut)

`NEXT-CUT.md`'s own one-sentence framing: a refused dataset can be admitted by an explicit operator
act — asserting a CRS for a file that declares none, or declaring which column carries feature
identity — with the claim recorded as a claim, nothing persisted, and no proposal, ranking, or
confidence anywhere. `e2e/admission-remediation.mjs` above covers the DOM/wire-assertable half of
the same ground (its own coverage table, below, names exactly which numbered step each automated
step covers); this Part is the judgment-call half only a human makes: does a rendered claim read as
a claim you made, not a fact the file stated; does an unranked candidate list read as neutral
information, not a recommendation; does a protective refusal read as protective, not as the tool
having failed you. **Evidence-class wording, as every earlier Part in this document uses it**: the
steps below are **operator-verified** (a human running them by hand and recording the result); the
suite named above is separately **E2E-verified** (driven through real IPC and a real render loop via
the same `openPath`/`crsCatalog` in-page hooks) — a distinct, weaker-than-neither, not-a-replacement
pairing, `e2e/README.md`'s own evidence-class paragraph. **No duration appears anywhere in this
Part** (ADR-018) — I6's own honest note is about a window being *reachable*, never about how fast
anything was.

Three fixtures, opened in the same running app instance as every earlier Part — no relaunch needed:

| Fixture | Path | Purpose |
|---|---|---|
| No CRS | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\no-crs-refused.parquet` | I1–I3 — reused from Part B; declares no `crs` key at all |
| Missing identity | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\missing-identity-refused.parquet` | I4, I6, I8 — reused from Part C; declares a CRS, but the stable key lives in `parcel_key`, not `id` |
| Both remediations needed | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\bothneeded-refused.parquet` | I5 — **new this cut**: no `crs` key AND no `id` column, together. Regenerate: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_bothneeded_refusing_fixture -- --ignored --nocapture` |

`dupkey-refused.parquet` (also new this cut, regenerate: `cargo test -p spatial-kernel --test
manual_walkthrough_fixtures generate_the_dupkey_refusing_fixture -- --ignored --nocapture`) is
**E2E-only** — `e2e/admission-remediation.mjs`'s own `DUPKEY'` step covers it; no Part I step opens
it, since I4/I8 already exercise the identity-declaration surface with a fixture that admits, and a
second small fixture that never admits adds no new operator judgment to make.

**I3's own copy block** (referenced from its row below, not inline in the table — a table cell
cannot hold a readable multi-line fence): the pinned EPSG:2056 definition with its two TOP-LEVEL
`coordinate_system.axis` entries' `direction` values swapped — everything else, including the
nested `base_crs.coordinate_system` block, byte-for-byte unchanged; constructed the same way
`e2e/admission-remediation.mjs`'s own `stepAxistrap`/`buildAxisTrapDefinition` builds its copy
(pretty-printed here for legibility; the script's own `JSON.stringify` output is compact, not
byte-identical to this formatting — functionally identical JSON either way):

```json
{
  "$schema": "https://proj.org/schemas/v0.5/projjson.schema.json",
  "type": "ProjectedCRS",
  "name": "CH1903+ / LV95",
  "base_crs": {
    "name": "CH1903+",
    "datum": {
      "type": "GeodeticReferenceFrame",
      "name": "CH1903+",
      "ellipsoid": {
        "name": "Bessel 1841",
        "semi_major_axis": 6377397.155,
        "inverse_flattening": 299.1528128
      }
    },
    "coordinate_system": {
      "subtype": "ellipsoidal",
      "axis": [
        { "name": "Geodetic latitude", "abbreviation": "Lat", "direction": "north", "unit": "degree" },
        { "name": "Geodetic longitude", "abbreviation": "Lon", "direction": "east", "unit": "degree" }
      ]
    },
    "id": { "authority": "EPSG", "code": 4150 }
  },
  "conversion": {
    "name": "Swiss Oblique Mercator 1995",
    "method": { "name": "Hotine Oblique Mercator (variant B)", "id": { "authority": "EPSG", "code": 9815 } },
    "parameters": [
      { "name": "Latitude of projection centre", "value": 46.9524055555556, "unit": "degree", "id": { "authority": "EPSG", "code": 8811 } },
      { "name": "Longitude of projection centre", "value": 7.43958333333333, "unit": "degree", "id": { "authority": "EPSG", "code": 8812 } },
      { "name": "Azimuth of initial line", "value": 90, "unit": "degree", "id": { "authority": "EPSG", "code": 8813 } },
      { "name": "Angle from Rectified to Skew Grid", "value": 90, "unit": "degree", "id": { "authority": "EPSG", "code": 8814 } },
      { "name": "Scale factor on initial line", "value": 1, "unit": "unity", "id": { "authority": "EPSG", "code": 8815 } },
      { "name": "Easting at projection centre", "value": 2600000, "unit": "metre", "id": { "authority": "EPSG", "code": 8816 } },
      { "name": "Northing at projection centre", "value": 1200000, "unit": "metre", "id": { "authority": "EPSG", "code": 8817 } }
    ]
  },
  "coordinate_system": {
    "subtype": "Cartesian",
    "axis": [
      { "name": "Easting", "abbreviation": "E", "direction": "north", "unit": "metre" },
      { "name": "Northing", "abbreviation": "N", "direction": "east", "unit": "metre" }
    ]
  },
  "id": { "authority": "EPSG", "code": 2056 }
}
```

(Before the swap, the top-level `coordinate_system.axis` block above read `direction: "east"` for
`Easting` and `direction: "north"` for `Northing` — the ordinary, admissible case I1/I2 already
exercised. Only those two `direction` values are swapped; the pinned catalog's own bytes are
otherwise reproduced exactly.)

| # | Step | Expected outcome |
|---|---|---|
| I1 | Click **Open GeoParquet…** (canvas from Part H may still be visible; that's fine) and select `no-crs-refused.parquet`. | No summary, no canvas change. A red-bordered refusal panel shows code `engine.crs_undeclared` and the same verbatim message Part B's B2 quotes. Below it, a **CRS assertion form** renders: a "Pick a pinned definition" list (one entry — `CH1903+ / LV95 (EPSG:2056)`, a "Full definition" disclosure, collapsed), an "Or paste a definition" route with an empty textarea, neither route pre-selected; an **Identifier** field; a notice reading *"This records a CLAIM you are making about this file's coordinate reference system -- recorded with who asserted it and when. Nothing is saved: reopening this file will ask you to assert again."*; and an **"Assert this CRS"** button, disabled. (ADR-015 §4: assertion is admissible only over a file that declares nothing — this is that admissible case.) |
| I2 | Expand the pinned entry's **Full definition** disclosure and read it in full — ADR-026 decision 1(a): "displayed in full before assertion, never selected silently" — before selecting it. Select it (the Identifier field fills with `EPSG:2056` — edit it if you like, it is yours to change), then click **Assert this CRS**. | Admitted. The canvas renders (the same shape Part A's A4 describes, over this fixture's own small feature count). The summary's **CRS** line reads: `EPSG:2056 — caller-asserted by <your OS account> at <an RFC-3339 timestamp>, catalog:epsg-2056@sha256:<12 hex chars>, axis order easting,northing` (ADR-015 §3/§6: `crs_source`, `by`, `at` all recorded; ADR-026 decision 2: provenance names the pinned catalog entry and its content hash, not a bare "trusted"). **Judge:** reading that line, does it read as a CLAIM you just made — attributed to you, timestamped, its own provenance named — rather than a fact the file itself stated? |
| I3 | Click **Open GeoParquet…** again and reselect `no-crs-refused.parquet` (I7 below confirms formally that nothing persisted; here it only resets to a fresh refusal). In the **Or paste a definition** box, paste the copy block above VERBATIM. Give it any identifier (e.g. `TEST:AXISTRAP`) and click **Assert this CRS**. | Refused again — code `engine.axis_order_unsupported`, message **"refused: established axis order is northing,easting; this slice performs no axis normalization and emits (easting, northing) only"** (verbatim), plus guidance copy reading *"The definition does not establish an x-first axis order. The file was refused, not reinterpreted (ADR-015 §5) -- this is protective behavior, not an error in your file."* The CRS assertion form is STILL present — not dead-ended (P3b MF1's own fix). **Honest note:** this refusal is protective. The engine DID read an axis order from what you pasted (north-first is a real, establishable order) — it refused to silently normalize it rather than failing to understand it, the exact EPSG:4326 trap `docs/05` names. |
| I4 | Click **Open GeoParquet…** and select `missing-identity-refused.parquet`. | A red-bordered refusal panel shows code `engine.identity_unusable` and the same verbatim message Part C's C2 quotes. Below it, an **identity declaration form** renders: a candidate list titled "64-bit integer columns, schema order, unranked" with exactly one entry, `parcel_key`, its radio UNCHECKED; below that, an equal "Or type a column name" free-text route (ADR-016 §3–§7: a name the engine happened to suggest is not privileged over one you type yourself); a cost notice (I8 reads this in full); and a **"Declare this column"** button, disabled until a route is chosen. **Judge:** does this list read as neutral information — "here is what qualifies" — or does it read as a recommendation — "pick this one"? Select `parcel_key` (or type it into the free-text box instead — an equally valid route) and click **Declare this column**. | Admitted. The summary's **Identity** line reads `mapped:parcel_key — verified-at-open-full-file` (ADR-016 §6: what was actually checked, recorded verbatim — never the bare word "unique" on its own). |
| I5 | Click **Open GeoParquet…** and select `bothneeded-refused.parquet` (new this cut — no `crs` key AND no `id` column). Assert `EPSG:2056` the same way I2 did. | This time the SAME assert does NOT admit — refused again, now as `engine.identity_unusable` (the file's OTHER remediation need only surfaces once the first is satisfied — `NEXT-CUT.md`'s own I11: CRS admission precedes identity, footer read vs. full scan). Below the identity form, one line reads: *"This attempt will also include your CRS assertion (EPSG:2056, asserted this session)."* — **the carried-claim line**. **Judge:** is it clear that declaring now will ALSO resend the CRS claim you already made, not silently drop it? Declare `parcel_key`. | Admitted. The summary shows BOTH the caller-asserted CRS line (I2's own shape) AND `mapped:parcel_key — verified-at-open-full-file` together — this file genuinely needed both remediations, and both are visible in the one summary. |
| I6 | Click **Open GeoParquet…** and reselect `missing-identity-refused.parquet` (refuses exactly as I4 did — nothing from I4 persisted). This time, select `parcel_key` again, and the INSTANT you click **Declare this column**, watch immediately for a **Cancel** button and a liveness line beside it, and click **Cancel** if you catch it. | If you catch it: a **Cancel** button appears with no delay next to the (now disabled) "Declare this column" button, and shortly after, a liveness line reads *"Opening — checking the declared column across the whole file…"* (I11: named as the cost it actually is, not a plain "Opening…" — this IS the whole-dataset uniqueness scan, paid because you declared a column, not because the file is large). Clicking Cancel restores the SAME refused panel you were already looking at (code, message, candidate list, your own typed/selected input all intact) — no new refusal panel, no crash, a note reading **"Open cancelled"** where the button was. **Honest note:** at this fixture's size (100 features), the scan this pays for has very little to do — over a remote-desktop session in particular, the window to see Cancel/liveness before the declare already resolves on its own (admitted or refused) may be too short to hit reliably. If you never manage to catch it, record that observation plainly — **it is not a failure of this step**, only a property of how fast a 100-row scan resolves. NO duration is recorded either way (ADR-018). |
| I7 | Click **Open GeoParquet…** and reselect `no-crs-refused.parquet` (the same file you asserted a CRS for in I2/I3). | Refused again, exactly as I1 first showed it — same code, same verbatim message. I2's assertion notice already promised this ("Nothing is saved: reopening this file will ask you to assert again") — this step is that promise, checked live: you must pick or paste the definition again from nothing, the CRS form starting exactly as blank as it did in I1 (no route pre-selected, no prior text remembered). *(The form is blank here because I6 opened a different file in between, so the CRS form remounts fresh. Re-picking a file that is already showing its refusal keeps whatever you typed — that is deliberate, and it is view state, not persistence: the assertion itself is gone either way, which is what this step checks.)* |
| I8 | On any identity declaration form still open from I4/I5/I6 (or reopen `missing-identity-refused.parquet` fresh), read the paragraph ABOVE the candidate list, before submitting anything. | It reads, verbatim: *"Declaring a column here triggers a whole-dataset uniqueness check when this file is opened. A wrong declaration is refused only after that full scan of the dataset runs -- retrying a failed declaration is not free. Nothing is saved: reopening this file will ask you to declare again."* (I11: refusal-cost honesty — CRS admission precedes identity in `dataset.rs`, so a wrong first guess costs a full scan before you find out it was wrong.) **Judge:** having now actually watched I4/I5/I6 pay that scan (however briefly, even at this fixture's small size), does this sentence read as an accurate, legible warning of what you are about to pay for a wrong guess — not boilerplate you'd skim past? |

**If anything deviates:** stop, record the exact step, and report it, same as every earlier Part.
(Except I3's own refusal and I6's own "Cancel never reachable" observation — those ARE the expected
outcome, not a deviation.)

## What `e2e/admission-remediation.mjs` covers

A separate suite (`npm run e2e:admission`, `frontends/shell/e2e/admission-remediation.mjs`,
admission-remediation cut P5) drives this Part's own admission-panel DOM directly, plus the
`openPath`/`crsCatalog` in-page hooks for the remediation submits themselves (no CDP driver reaches
a real form's Submit click any differently than calling the identical `admitPath` function it calls
— this file's own top comment). Same cross-reference convention as every earlier coverage table:
"Does not cover" lists only what the numbered Part I step *claims* that the script cannot assert.

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `ASSERT'` | I1, I2 | `engine.crs_undeclared` refusal verbatim + CRS form present; the pinned catalog is reachable via `crsCatalog()` (one entry, `epsg-2056`, non-empty definition); asserting it admits, canvas renders, and the summary's CRS line shows `caller-asserted by`/non-empty by-at/`catalog:epsg-2056@sha256:` (prefix only) | I2's own claim-vs-fact legibility judgment; the "Full definition" disclosure's own click-to-expand interaction |
| `PASTED'` | — (no Part I step; a no-normalization property this doc's own I2/I3 do not need repeated) | pasting the SAME definition with one whitespace byte changed admits with provenance `pasted`, never `catalog:...` | — |
| `AXISTRAP'` | I3 | the axis-swapped definition establishes a real, non-x-first order → `engine.axis_order_unsupported` verbatim, refused not reinterpreted, CRS form still present (P3b MF1) | I3's own "reads as protective" judgment |
| `NODEF'` | — (no Part I step; I3 already exercises the axis-order family) | a definition with no `coordinate_system` at all → `engine.axis_order_unestablished`, form still present | — |
| `MAP'` | I4 | `engine.identity_unusable` refusal verbatim + `parcel_key` in the candidate list; declaring it admits with `mapped:parcel_key — verified-at-open-full-file` in the summary | I4's own "candidate list implies no recommendation" judgment |
| `DUPKEY'` | — (no Part I step, `dupkey-refused.parquet` is E2E-only — see this Part's own fixtures note) | a plain open of a native-duplicate-id file already refuses (genuine uniqueness detail, not missing-column); declaring the same column re-refuses identically, form still present | — |
| `BOTHNEEDED'` | I5 | crs refusal → assert (carried) → identity refusal with the carried-option line verbatim → declare (combined request) → admitted with BOTH `caller-asserted` and `mapped:` in the summary (MF2 regression guard) | I5's own "is the carried claim clear" judgment |
| `CONFLICT'` | — (no Part I step; I1–I8 never assert over an already-declaring file — G1's own admitted-CRS fixture already stands in for "a file that declares a CRS" elsewhere in this document) | asserting over an already-declaring file → `engine.crs_assertion_conflict`, NO remediation form/control renders at all (I1) | — |
| `CANCELOPEN'` | I6 | a declared-identity open against the LARGEST fixture on disk (4,000,000 features) shows Cancel + the declared-column liveness line while genuinely in flight, or records SKIPPED-FAST honestly if the scan resolves first; clicking Cancel restores the idle "Open cancelled" note, form inputs intact. NO duration asserted (ADR-018) | I6's own "was the window even reachable, over RustDesk" judgment — the script's own fixture is 40,000× larger than I6's, deliberately, so its own catch window is comfortably wider than a human's; the two are not the same claim |
| `NOPERSIST'` | I7 | reopening the ASSERT'-admitted path plain refuses again, verbatim — nothing persisted | — |
| `OVERBOUND'` | — (no Part I step; pasting 65,000+ bytes by hand is not a productive operator action to script into a walkthrough) | pasting an oversized definition through the real form shows `.crs-assertion-definition-validation` naming the byte counts, Submit stays disabled, no request is issued | — |

---

## Part J — the action console (action-console cut)

`NEXT-CUT.md`'s own one sentence, binding: every shell GUI action accounts for itself — the exact
control-plane request it actually sent (SKP, copyable), or the named host-local command (name only,
no arguments, no copy, explicitly not-API), or a plain statement that no API equivalent exists and
which filed decision owns that gap. ADR-027 (Proposed, filed by this cut's own P6 — see
`docs/adr/ADR-027-action-console-and-display-truth.md`) is the decision record this Part evidences;
principle 4 (docs/01) and principle 8 (no numbers, no claim) are its constitutional source.
`e2e/console.mjs` above covers the DOM-assertable half of the same ground (its own coverage table,
below, names exactly which numbered step each automated step covers); this Part is the judgment-call
half only a human makes — does display truth *read* as honest, not merely check out mechanically.
**Evidence-class wording, as every earlier Part in this document uses it**: the steps below are
**operator-verified** (a human running them by hand and recording the result); the suite named above
is separately **E2E-verified** (driven through real IPC and a real render loop via the same
`openPath`/`queryWithFilter`/`publishPrepareWithDestination` in-page hooks) — a distinct,
weaker-than-neither, not-a-replacement pairing, `e2e/README.md`'s own evidence-class paragraph.

**Honest note (updated 2026-08-19 — the original note below is superseded, kept for the record):**
entries 20/21 RESOLVED same day: the A9' red was a harness defect (a structurally top-edge-biased
sample-pixel selector meeting the new interior verification; the product's fill and pick paths were
proven healthy by an instrumented session), fixed by densest-patch candidate selection (commit
`dc3c7aa`); the regression suite is fully green, and `e2e:console` had its first all-green run.
*(Original note, historical:)* `DECISIONS-PENDING.md` entry 20 records that the
REGRESSION suite's `A9'` (hover-pick) step is RED, with a fix decision queued to the human. **Part J
does not depend on hover** — none of J1–J6 below reads or asserts a hover readout — so this Part's
own pass/fail is independent of entry 20's outcome; do not treat A9' being red as a reason to skip
or discount this Part.

Reuses `filter-zoned.parquet` (already listed in Part E's own fixtures table above — the console
records requests already flowing through every earlier Part's own admission/filter/style/publish
actions; no new fixture is needed, and `e2e/console.mjs` itself reuses this exact file).

| # | Step | Expected outcome |
|---|---|---|
| J1 | Click the collapsed **▸ Console** disclosure at the bottom of the window to expand it (**J1's own preamble**: before opening anything, read the standing header sentence at the top of the now-expanded drawer aloud, in full). Then click **Open GeoParquet…** (canvas from Part I may still be visible; that's fine) and select `filter-zoned.parquet`. | **Preamble, judged first:** the expanded drawer (**▾ Console**) shows a standing header sentence (`consoleViewModel.ts`'s `CONSOLE_STANDING_HEADER`, verbatim): *"These are the requests this app sent over its own Tauri IPC control plane. SKP has one transport binding today and no out-of-process client (SKP-V0 §4 item 2); handles are session-scoped and there is no idempotency (§3, §4 item 9). This is a faithful record, not a script you can run."* **Judge:** having read it aloud, is "a faithful record, not a script you can run" clear on a first read — does it land as an honest limit, not as hedging? **Main step:** the admission behaves exactly as Part E's E1 describes, and this ONE click on **Open GeoParquet…** produces exactly **two** new class-A entries, in order: an `open_dataset` entry, then a `describe` entry, each labeled `SKP <version> · control plane` with its own copyable request text and a **Copy** button — never one merged entry, never more than two (`skp/client.ts::call()`'s own two sequential invocations, I2: each captured by reference at the one choke point). **Judge:** does seeing two distinct, individually-readable requests for one click read as *legible* — "I clicked once, and here is exactly what that click actually sent, in order" — or does it read as surprising/noisy? |
| J2 | Pan or zoom the canvas once (any drag or scroll works) to produce a fresh `viewport_query` class-A entry. Click that entry's **Copy** button, then paste the clipboard contents somewhere visible outside the app — e.g. open Notepad (Start → Notepad; RustDesk reaches the desktop fine for this) and paste (Ctrl+V). | The pasted text is valid JSON with exactly the keys `{skp, dataset, bbox, bbox_crs, filter, limit}`. If `bbox` is non-null, its four members (`xmin`/`ymin`/`xmax`/`ymax`) are each a bare 16-lowercase-hex-digit string (`HexF64`, `skp/codec.ts`) — e.g. `"3ff0000000000000"`, not a decimal number — and `limit` is either `null` or a quoted digits-only string (`DecU64`), never a bare number. Compare the pasted text side-by-side against the console entry's own on-screen `.console-request-text` block: they must match byte-for-byte (I2: the copy button hands the clipboard the exact same string the entry displays, sourced from one captured object by reference, never re-derived). **Judge — this is the cut's real open question for an operator:** is this honesty *tolerable*? A hex-string coordinate in a record you might file away or hand to someone is unusual and, on its own, illegible as a place on a map — but the alternative (a decimal `x`/`y` inside the copy region) would show a request the wire itself never accepts and never sent (ADR-004 amendment 1's bit-critical scalars; I5, "no scalar prettified inside copy text"). Which is the more honest artifact to hand someone: a faithfully unreadable hex pair, or a readable but fabricated decimal one? Record your own answer, not a checkbox. |
| J3 | Expand **▸ Style** (Part F's F1) and change any one style value (e.g. drag **Fill opacity**). | A new class-C entry appears in the console. Its statement text contains, verbatim, **"no API equivalent exists"**, naming the specific control you moved (e.g. fill opacity) as local `StylePanel` state, never sent to the kernel. Its owner line names **ADR-022** (and ADR-023). No copy button appears anywhere on this entry — there is no field on it a copy button could even read (`ClassCRowViewModel` carries no `request`/`copyText`). **Judge:** having just watched a real style edit repaint the canvas with nothing sent anywhere, does this entry read as *honest bookkeeping* — "here is a real gap, and here is who owns closing it" — rather than as a broken or missing feature? |
| J4 | Expand **▸ Publish** (Part G's G1) and click **Publish…**; when the native destination dialog appears, choose any destination under `target\` and confirm; when the approval dialog appears (Part G's G3), click **Cancel** rather than approving. | A new class-B entry appears in the console, naming the binding command **`binding_publish_prepare`** by name in its prose, alongside a plain-language effect sentence (never the request/response shape). Its citation reads, verbatim, that this command is **"host-local, not part of the API"** and **"not callable"** by a script, plugin, notebook, CLI, or AI client (`surfaceRegistry.ts`'s `BINDING_LOCAL_CITATION`, cited by ADR-024 and SKP-V0 §4 items 1/3/11/13). **No arguments appear anywhere on this entry** — in particular, the destination path you just chose in the native dialog must appear NOWHERE in the console (search the whole expanded drawer's text with your own eyes, or Ctrl+F if the app's dev tools are open). There is no copy button on this entry (structurally absent, same as J3's class-C row). |
| J5 | Trigger a refusal: type the unknown-column predicate `bogus_column_xyz = 1` into the filter panel (Part E's E3) and click **Apply**. | A `viewport_query` class-A entry's outcome reads **`refused`**. Below the request text, a refusal block shows the typed code **`skp.filter_unknown_column`** and the exact verbatim message Part E's E3 already quotes — read straight from the same `SkpError` the filter panel's own refusal region rendered, never re-composed by the console (I10: refusals route through `formatRefusal.ts` only, reused, not reimplemented). **Judge:** does the code + verbatim message pairing on this entry match what the filter panel itself showed at the moment of refusal — the same words, not a summary of them? |
| J6 | With the console still expanded from the steps above, pan the canvas hard for several seconds — repeated drags, including at least one large jump, the same motion Part A's A5/A6/A8 exercise. | Fresh `viewport_query` entries accumulate in the console as you go (coalescing consecutive identical-shape queries into a `×N` group, I8 — click it to expand and see the real individual entries, never a synthesized one). **Judge only whether the canvas itself feels unchanged** with the drawer open and actively recording, compared to your own memory of the same gesture in Parts A/H with the drawer collapsed — **do not attach any number, frame rate, or duration to this observation** (the standing rule: ADR-018 — a feel judgment carries no figure, and I9 is the structural claim this step is checking by hand: a closed console does zero per-entry DOM work, but this step's own drawer is deliberately open, so what you are judging is the recorder's own live-open cost, not its closed cost). If operating remotely (e.g. RustDesk), record the same degraded-channel caveat earlier Parts' motion-quality judgments used. |

**If anything deviates** (a class-A entry missing or merged, a class-B/C entry showing an argument,
a copy button where none should be, a refusal not matching verbatim, a destination path visible
anywhere in the console): stop, record the exact step and what you saw, and report it — do not
continue assuming it was unrelated.

## What `e2e/console.mjs` covers

A separate suite (`npm run e2e:console`, `frontends/shell/e2e/console.mjs`, action-console cut P5)
drives this Part's own console DOM directly, reading only the rendered `.console-entry-*` markup
produced by real user-reachable actions (a real `openPath` admission, a real mouse pan, a real
style-panel input, the dev-only publish destination seam) — never the `consoleRecorder` singleton
read directly. Same cross-reference convention as every earlier coverage table: "Does not cover"
lists only what the numbered Part J step *claims* that the script cannot assert.

| Automated step | Walkthrough step(s) | Covers | Does not cover |
|---|---|---|---|
| `HEADER'` | J1 (the preamble half) | the standing header is absent from the DOM entirely while collapsed (I9) and present with all 3 required phrases ("one transport binding", "session-scoped", "not a script you can run") while expanded | J1's own "does this land as an honest limit, not hedging" judgment |
| `ECHO'`/`TWOCMD'` | J1 (the two-entries half) | one `openPath` call produces both an `open_dataset` and a `describe` class-A entry; the `describe` entry's request parses with exactly `{skp, dataset}`; the entry's own label version token equals the parsed request's own `skp` field (no hard-coded version) | J1's own "legible rather than surprising" judgment |
| `HEXLIM'` | J2 (the fidelity half) | after a real mouse pan, the newest `viewport_query` entry's request parses with exactly `{skp, dataset, bbox, bbox_crs, filter, limit}`; any non-null bbox member is a bare 16-lowercase-hex string, verified to appear quoted verbatim in the raw pretty-printed text (I5: no scalar prettified inside copy text); `limit` is `null` or a digits-only string | J2's own "is this honesty tolerable" judgment — the script proves the hex text is faithful, it does not and cannot judge whether a human finds that faithfulness acceptable; it also does not exercise the actual clipboard/paste-into-Notepad path J2 asks for, only the DOM text the Copy button would send |
| `CLASSC'` | J3 | a real style-panel fill-colour edit produces a class-C entry whose statement contains "no API equivalent" and whose owner contains "ADR-022"; no copy button present | J3's own "honest bookkeeping vs. broken feature" judgment |
| `CLASSB'` | J4 | `publishPrepareWithDestination` (the dev seam standing in for the native picker no CDP driver reaches) produces a class-B entry naming `binding_publish_prepare_e2e_destination`; no copy button; no `{` anywhere in the row's rendered text; citation contains "not callable"; the destination path string is absent from the ENTIRE `.console-panel` DOM text, not merely the one entry | that the *real* `binding_publish_prepare` (native picker, not the dev seam) behaves identically — structurally guaranteed by both commands sharing one `ClassBRow`/`ClassBRowViewModel` shape, but not independently re-asserted by this step; also does not click through to Cancel at the approval dialog the way J4 does |
| `REFUSAL'` | J5 | an unknown-column predicate refuses; the console's own rendered code/message are compared against the SAME live `SkpError` the calling code's own returned outcome carries (self-consistency), never a hard-coded literal | J5's own "matches what the filter panel itself showed" cross-check — the script never opens the filter panel's own refusal region in the same run to compare the two renderings side by side |
| `GROUP'`/`UNCLASS'`/`COPYTRUNC'` | — (no Part J step names these directly) | 3 consecutive identical filter queries coalesce into one `×N` group that expands to the real individual entries, never a synthesized merge (I8); `UNCLASS'` asserts the `.console-entry-unclassified` count is 0 ACROSS THE WHOLE RUN (the registry is complete enough that the defect row, present in `ConsolePanel.tsx`'s own `ConsoleRow` switch, is never reached — a zero-occurrence assertion, not an exercise of the row); `COPYTRUNC'` drives the largest `crsAssertion.definitionJson` any real, UI-reachable request could ever carry (a near-cap, empirically-built definition, not an arithmetic estimate) and recorded NOT-REACHABLE — it renders UNTRUNCATED, under `MAX_ENTRY_RENDER_BYTES` with margin — i.e. no real operator action can construct a request that crosses the render ceiling | the `UNCLASSIFIED — this is a defect, report it` row's own rendering (I7's unclassified-row path) — the suite proves the row is never reached, not what it looks like when it is; the truncated, non-copyable preview and its own reason text (I7's truncation path) — `COPYTRUNC'` confirms empirically that no real, UI-reachable request can cross `MAX_ENTRY_RENDER_BYTES`, so this branch stays a real, unexercised code path, not a fired one, at any level in this suite or any Part J step |
| `REGRESS'` | J6 (partially) | the full `regression.mjs`/`admission-remediation.mjs` suites pass end-to-end while attached to the SAME session this console suite already drove — i.e. the console recording live in the background does not break any of the pan/zoom/admission behavior those suites assert | J6's own subjective "does the canvas feel unchanged" judgment — this step is pass/fail on correctness only; ADR-018 bars it from asserting anything about feel, and it asserts nothing about feel |

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

- **Date run:** 2026-08-14/15 (spanning midnight, one continuous session)
- **Run by:** the human (Christopher), over RustDesk — same degraded-channel caveat as the Part A–D
  run for motion/feel judgments; correctness judged firmly.
- **Build/commit:** `046b41d`.
- **Part E (E1–E8):** **pass with one functional deviation, fixed same session.** E1–E4 perfect
  (panel, real filter visibly subsetting, refusal readable with the canvas preserved by the
  recovery query, Clear restoring). E5's liveness and the **ADR-021 acceptance-condition behaviors
  — E6 cancel and E7 persistent incomplete status — perfect**; E8 clean-slate perfect. **E5
  deviation:** after a *completed* filtered scan on the slow fixture, the matching tail features
  were unfindable (the filtered query carried the current viewport bbox, and Zoom to layer fit the
  all-time anchor — the operator's "too far up / zoom to layer does nothing" report, exactly).
  Human-approved design revision applied same session (`55dec4d`): **Apply behaves like opening a
  dataset** — unrestricted first look (`bbox: null`), fit anchor + one-shot auto-fit reset per
  filter generation, so filter → scan → the camera lands on the matches, and Zoom to layer fits
  the filtered layer deterministically. Encoded as E2E step `FIND'` (the operator's scenario
  through the real panel DOM; camera lands on the 99 matches). All suites green on the fixed tree
  (12/12, 3/3, 6/6).

### Part F run (separate pass — style panel)

Part F did not exist during either run recorded above. Fill in the fields below when Part F is
actually run by an operator.

- **Date run:** 2026-08-16
- **Run by:** the human (Christopher), over RustDesk — the standing degraded-channel caveat
  applies to F3's continuous-drag smoothness judgment; every other judgment is
  channel-insensitive. F7's terminal steps were run by the operator at the machine (via RustDesk),
  with the custodian verifying the saved style file's validity beforehand (valid §5a JSON, no BOM).
- **Build/commit:** `29eebd1` (branch `cut/style-panel` tip — supersets the merged tree plus PRs
  #9/#10/#11 candidate work).
- **Part F (F1–F8):** **pass, operator's verdict verbatim: "Everything's perfect!"** — including
  F7, **the hero round-trip this cut exists for**: a style authored live in the shell
  (fill `#f0e800` at opacity 1.0, outline `#00e1ff` at width 5 — the custodian-verified saved
  document), published by hand through `publish-bundle --style`'s class-3 gate
  (`--approve` naming the destination), served, and visually confirmed by the operator to render
  **identically** in the bundle viewer — a separately-loaded static page sharing only the
  renderer-owned resolver with the shell. No deviations reported at any step.

### Part G run (separate pass — publish)

Part G did not exist during any run recorded above. Fill in the fields below when Part G is
actually run by an operator. **G10 is not a pass/fail step** — record the human's own ruling on the
acceptance condition there, in their own words, not a checkbox.

- **Date run:** 2026-08-16/17 (one continuous session over midnight)
- **Run by:** the human (Christopher), over RustDesk. The custodian assisted mechanically at two
  points, both recorded: supplied the G4 wrong-phrase instruction on request, and decoded the
  audit log's pairs + supplied the G7 serve command with the operator's real destination — the
  latter assistance is itself part of the G6 finding.
- **Build/commit:** `066a3cd` (branch `cut/publish-ui` tip).
- **Part G (G1–G9):** **pass, with two operator-found legibility deviations** (both real findings,
  neither a mechanics failure — every gate property held: the wrong phrase refused with no bundle
  and a clean refused audit pair; the correct phrase published; the bundle served and rendered the
  operator's own style; the filter-scope warning appeared; a cancelled attempt wrote nothing).
  **G3 deviation:** asked "do you know exactly what will be written where," the operator's answer
  was **no** — "there's a lot of things written but not necessarily that clear" (verbatim): strong
  provenance, missing a plain-outcome sentence. **G6 deviation:** the operator found the audit
  JSONL but "honestly can't tell what's going on" (verbatim) — machine-honest, not human-legible;
  the custodian had to decode the pairs.
- **G10 — the ruling (the human's own words):** *"for me this product feature can be included"* —
  **with G3 and G6 as binding conditions** (the human's explicit choice when offered
  conditions-vs-follow-ups): the approval dialog gains a plain-language outcome statement, and the
  audit record gains a human-legible reader. Recorded in ADR-017's appended "Exposure review —
  2026-08-17" section; the condition discharges for this UI surface only when both conditions
  land through the ordinary gates.

### Part H run (separate pass — at-scale)

Part H did not exist during any run recorded above. Fill in the fields below when Part H is
actually run by an operator. **H10 is not a pass/fail step** — record the human's own ruling on the
exit judgment there, in their own words, not a checkbox.

- **Date run:** —
- **Run by:** —
- **Build/commit:** `807648f` pinned for the batch (main tip 2026-08-19 — all three cuts'
  surfaces in one tree; Parts H, I and J must record this same commit so Part J's REGRESS'
  claim is meaningful).
- **Part H (H1–H9):** —
- **H10 — the ruling (the human's own words):** —

### Part I run (separate pass — admission remediation)

Part I did not exist during any run recorded above. Fill in the fields below when Part I is
actually run by an operator, queued for the next batch session per this cut's own P5 brief.

- **Date run:** —
- **Run by:** —
- **Build/commit:** `807648f` pinned for the batch (same single tree as Parts H and J).
- **Part I (I1–I8):** —

### Part J run (separate pass — the action console)

Part J did not exist during any run recorded above. Fill in the fields below when Part J is
actually run by an operator, queued for the next batch session per this cut's own P6 brief.
(Entries 20/21 resolved 2026-08-19 — the A9' red was harness-side, fixed, all suites green; see
this Part's own honest note above.)

- **Date run:** —
- **Run by:** —
- **Build/commit:** `807648f` pinned for the batch (same single tree as Parts H and I).
- **Part J (J1–J6):** —
