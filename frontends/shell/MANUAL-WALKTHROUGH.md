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
- **G10 — the human's decision on ADR-017's (clarified) acceptance condition, for this surface:**
