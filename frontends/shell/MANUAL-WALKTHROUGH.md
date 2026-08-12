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

**Status as of 2026-08-12: this suite is currently RED on `A5'`–`A9'`.** A queued, unresolved shell
defect (`DECISIONS-PENDING.md` entry 0 — a spurious resident-vertex-ceiling refusal, reproduced
deterministically across three verified-fresh launches) trips early in every run and its banner
never clears, so every later banner-absence assertion fails identically. "Covers" below names what
each step *asserts when it passes*, not that it currently does — read a fresh run's own output for
current status, not this table.

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
| `REOPEN'` | the "works from any state" claim in this doc's own prose (not a numbered step) | one of the three claimed states specifically: reopening *from a refused state* admits, with no stale refusal banner present beforehand, and the canvas is non-blank after settle | reopening from *idle* (never having admitted anything) or from *already-admitted* (reopening over a still-showing canvas, no refusal in between) — the other two states the prose claims but this step does not exercise |
| `NET'` | — (informational, not a walkthrough claim) | whether any `>=400` HTTP response was observed during the run | — this row exists only because `regression.mjs`'s own summary table prints a `NET'` row; it names no walkthrough step and asserts nothing that fails the run |

A10 (close the window; no crash, no hang) has no automated counterpart at all — a CDP-attached
session has no way to assert "the window closed cleanly" about the very connection it is using to
assert anything else.

## Prerequisites

- Build/run from `frontends/shell`: `npm run tauri dev` (runs the Vite dev server via
  `beforeDevCommand`, compiles `src-tauri`, and opens the app window). The dev server binds
  `localhost:5180`, not Tauri's default 1420 — 1420 falls inside this machine's Windows
  excluded-port range (1335-1434), the same finding the ADR-003 spike recorded. Nothing to do
  here; named in case a bind failure ever needs explaining.
- The three fixture files below, generated by `kernel/tests/manual_walkthrough_fixtures.rs`
  (`cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture`
  regenerates them from the committed generator if they are missing — nothing about the fixture
  *files* is committed, only the code that writes them, matching every other fixture in this repo).

| Fixture | Path | Purpose |
|---|---|---|
| 100k happy path | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\100k-happy-path.parquet` | Part A — the ordinary admitted case, no refusal anywhere |
| No CRS | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\no-crs-refused.parquet` | Part B — `engine.crs_undeclared` |
| Missing identity | `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\missing-identity-refused.parquet` | Part C — `engine.identity_unusable` |

All three open the same running app instance in sequence — no relaunch needed between parts;
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
| A7 | Pan far away from the data (drag until the canvas is empty), then click **Zoom to layer**. | The camera jumps back to fit the full extent of whatever is still resident, the same fit A4 produced. |
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

---

## Result log

Fill in after running the script above.

- **Date run:** _______________
- **Run by:** _______________
- **Build/commit:** _______________
- **Part A (A1–A10):** pass / fail — deviations: _______________
- **Part B (B1–B3):** pass / fail — deviations: _______________
- **Part C (C1–C3):** pass / fail — deviations: _______________
