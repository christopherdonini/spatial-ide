# E2E-STATE — Playwright-over-CDP harness piece (human-approved amendment to the shell cut)

**Untracked by design** (NIGHT-STATE pattern). A fresh session must be able to continue from this
file alone. Piece: add a playwright-core E2E harness, use it interactively to debug the empty
canvas, then encode regression tests (E2E-verified evidence class). Branch: `cut/shell-skeleton`.

## Headline result (2026-08-11 17:18, instrument run of record)

**The canvas renders. The ADR-020 origin-admission fix cured the empty canvas.** E2E instrument
evidence, 100k happy-path fixture, full report at
`frontends/shell/e2e/out/debug-session-1786461538831.json`:

- Admission via the dev-only `openPath` hook (identical admission path, only the native dialog
  bypassed): **admitted**.
- Render trace: 1 describe.extent, 1 viewport_query (no bbox — first look), **40 batches,
  40 layers, 1,961,249 total positions**; view-state origin (2602480.2, 1200020.0) — EPSG:2056,
  sensible for the fixture.
- Pixel read-back (spike technique, readPixels in onAfterRender, 1280×312 buffer): **19.98%
  non-background**; dominant non-background color rgba(47,94,172,180) = the layer's translucent
  blue fill. 3×3 grid: top row 0%, middle ~17–24%, bottom ~30–43% — data occupies the lower
  two-thirds of the fitted view.
- **One console error, open minor item:** `Failed to load resource: … 404` with no URL attached
  (dev-server resource, favicon-class; NOT on the data path — admission and all 40 batches
  succeeded). Identify during the regression-test pass; name it, don't hand-wave it.

## Attempt log — attach/instrument step

| # | What | Outcome | Named cause |
|---|---|---|---|
| 0 | Launch via `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` env var | CDP endpoint never bound; 300 s timeout | wry 0.55.1 always calls `set_additional_browser_arguments()` (its defaults or the app's), and WebView2 ignores the env var when options are provided programmatically. Verified in wry source + live browser-process command line. Fixed: launcher now generates a Tauri `--config` overlay into gitignored `e2e/out/` (real window config + `additionalBrowserArgs` = wry defaults repeated + `--remote-debugging-port`). Nothing checked in carries the flag; `tauri build` never sees it. |
| 1 | Debug session via overlay launcher | **Instrument pass SUCCEEDED** (report above) — but the harness process hung ~16 h after printing its report; killed by the custodian 2026-08-12 | `debug-session.mjs` sets `process.exitCode` and relies on natural exit, but the launched `tauri dev` child is spawned attached (piped stdio, not `detached`, never `unref()`d) — Node's event loop holds the child handle and pipes forever. The "leave the app running" design was implemented without releasing the handles. Class fix in flight: deadlines on every wait, watchdog + explicit exit, detached child. Token-discipline rule 7 standing: if attempt 2 hangs the same way, stop and queue for the human. |

## Overnight anomaly, recorded not diagnosed

At kill time (2026-08-12): `spatial-ide-shell.exe` (PID 25880) still alive, but ports **9223 and
5180 both no longer listening** — the WebView2 debug listener and vite died overnight while the
app process survived. Swept rather than diagnosed; if attempt 2 shows the same decay, it becomes
a finding (candidate suspects: display sleep/power event on this machine — see AI_DEVELOPMENT.md
machine facts — or WebView2 browser-process exit).

## Progress log (2026-08-12)

1. **Done.** e2e class fix (deadlines fail loudly; unref'd watchdog; raw-fd detached child — the
   `.pipe()` design both held the parent's loop AND broke the child on parent exit, empirically
   shown). 2. **Done** — rule 9 committed (`da04ed4`). 3. **Done** — attempt 2 clean exit,
   identical render numbers (reproducible). 4. **Done** — `e2e/regression.mjs` +
   MANUAL-WALKTHROUGH.md evidence-class table; found real defects (below). 6. **Done** —
   DECISIONS-PENDING now carries three entries: **entry 0** (the then-unresolved ceiling
   defect, queued under rule 7 after two failed fix attempts — recommendation: authorize one
   instrumented session), entry 1 (architect's ADR-020 verdict, corrections applied, accept
   recommended), entry 2 (walkthrough re-run HELD behind entry 0).

**ADR-020 red line executed:** full architect review vs docs/09 + ADR-012 H4 → implementation
sound, text blocked (B1) + conditions C1–C6; all text corrections applied to the Proposed draft
2026-08-12; C3's negative test added (`kernel/tests/skp_admission.rs`, 401-credential vs
403-origin, 7/7 green). Acceptance queued for the human; merge only alongside that decision.

**Defect findings (regression suite, fresh-session differential 2026-08-12):**
- **D1 — onTerminal whitelist:** supersede-on-pan's SKP cancel yields `ProducerFailed`
  (CANCELLATION-FACTS.md §1), App.tsx banners it. Real, source-confirmed, fired on the churned
  session. Fix in flight.
- **D2 — transient double-residency across supersession:** full fixture = 1,961,249 resident
  vertices (under the 2M ceiling); pans overflow at 2.009–2.044M = old stream still resident when
  new batches arrive (clear fires at terminal arrival, not supersede time). NOT a fixture/ceiling
  mismatch (the fix worker's first reading — refuted by A4's own number). Fix in flight, same
  seam. Ceiling/doctrine untouched.
- **D3 — churn starvation, downgraded:** streams silently stop delivering only after extended
  single-session churn (multiple suites + diagnostics on one instance); fresh sessions clean
  twice over. Recorded as a long-session symptom to watch, not a cut-1 blocker; not queued.
- **D4 — dataset reopen keeps stale canvas residency (custodian forensic run,
  `e2e/out/debug-session-1786565609828.json` + app session logs):** the refusal number is exact
  arithmetic — 2,012,436 = 1,961,249 (previous dataset's full residency) + 51,187 (new stream's
  first batch). `WorkingCanvas` is reconciled, not remounted, on `admitted` change, so
  `residentRef`/extent/auto-fit/`OffsetFrame` survive into the new dataset; first new batch trips
  the ceiling → spurious banner + stream cancel; the cycle then SELF-HEALS (auto-fit view change
  → debounced query → supersede → D2's clearResidency wipes the stale set → fresh stream renders
  a correct 19.98%). The banner state never resets (D4b), so one spurious refusal fails every
  later banner-absence assertion identically. The fix worker's "fires on initial load of a fresh
  session" reading was an attach-to-leftover-instance artifact — the arithmetic only exists in
  reopen flows — and refuted as the mechanism for the fresh-launch instance by a verified-fresh
  reproduction. **RESOLVED 2026-08-13 by the human-authorized instrumented session (ledger:
  `e2e/out/regression-render-trace-1786578099481.json`): not a residency bug at all.** The 100k
  fixture exceeds the 2,000,000 ceiling by construction — magnitude later corrected: true total
  **2,508,699 (25.4% over)**; the diagnosis's 2,012,436 was the refusal-moment partial sum (see
  the corrected vertex-numbers bullet in the resolution section). One stream, zero → 40
  admitted batches → 1,961,249 → its next batch (51,187) refused mid-file. Fires on every first
  load (and did, DOM-only and unnoticed, in every earlier instrument run — ~78% of features
  render, pixels look right); reopen repeats
  it independently; zero cross-stream or cross-dataset residency; no interleaving. The earlier
  "1,961,249 + 51,187 = stale + new" reading was arithmetically right, interpretively wrong —
  both terms belong to the same stream. A5'–A9'/REOPEN' fail only on the never-dismissed banner.
  **Fix direction queued for the human (entry 0): recommend fixture-under-ceiling + a deliberate
  over-ceiling refusal step** (the refusal is designed behavior and deserves its own acceptance
  step). Ledger footgun noted for later: during dataset-key remount, the old canvas's
  `clearStream` (from the manager's stop) lands on the NEW instance's fresh ResidentSet — the
  `canvasRef` swap happens in React's layout phase before App's passive-effect cleanup runs.
  Harmless today (the old instance is discarded wholesale), but it is a latent
  wrong-instance-callback pattern.
- **NET':** the startup 404 did not reproduce under the regression run (no ≥400 seen; index.html
  declares no link rel). Startup-only, URL-less, benign-class; still unidentified.

## Entry-0 resolution in progress (2026-08-13, human decided: option a + three riders)

- Fixtures done: happy path retuned (avg_vertices 18 → 1,885,130 writer-side vertices, hard
  assert ≤ 1,950,000, still 100,000 features); old spec kept verbatim as
  `over-ceiling-refused.parquet` (hard assert > 2,000,000).
- **Vertex numbers, CORRECTED (reviewer-caught custodian synthesis error — the earlier
  "metric split" story here was wrong):** there is NO writer/client metric split —
  client-decoded == `facts.vertices` exactly (happy path peaks at 1,885,130 in the run ledger,
  bit-identical to the generator's figure; `decodeBatch` does no closure dedup). **2,012,436 was
  the truncated partial sum at the refusal moment** (1,961,249 resident + 51,187 attempted) on
  a stream that was then cancelled — never any file's total. The over-ceiling file's true total
  is **2,508,699 (25.4% over the ceiling)**; its refusal lands at **78,191 of 100,000 features
  (78.19%)**, corroborated by the status line itself. The byte-identical-size observation was
  right (same file content); the inference that its total was 2,012,436 was not. Happy-path
  headroom is **114,870 (5.7%)** — small; the generator's `≤ 1_950_000` hard assert is the
  guard. Do not raise `avg_vertices` on a "plenty of headroom" assumption.
- Shell done (rider 1 + 3): persistent `.residency-status` indicator — exact text
  `${residentFeatureCount} of ${datasetRowCount} features rendered — declared ceiling reached
  (MAX_RESIDENT_VERTICES)` — set on ceiling refusal, survives banner dismissal, clears on full
  delivery or dataset change; `makeManagerCallbacks(canvas, ...)` closes over the effect-time
  canvas handle (the remount-race regression test cites the ledger footgun). 133 tests green.
- Rider 2 done: ADR-011 acceptance gate 8 (the resident-ceiling question; refusal = honest
  interim, not forever behavior).
- In flight: OVERCEIL' E2E step + walkthrough Part D + the fresh full run (expect all green) →
  reviewer → signed commits.

## What remains

5. Reviewer gate: **done 2026-08-12** — verdict "implementation sound, not safe to commit as-is"
   on two blocking evidence-statement items (stale REOPEN' rationale; App.test.ts overclaim) +
   hygiene list; all dispatched to the fix worker, custodian items applied. Then: signed commits
   on `cut/shell-skeleton` (planned series: 1. harness + test surface + hooks; 2. stream/App
   fixes + tests; 3. kernel C3 test; 4. ADR-020 corrections; 5. walkthrough evidence classes +
   DECISIONS-PENDING). Push to the PR branch is fine; **merge waits for the human's ADR-020
   decision** (red line). Commit identity: `-c user.name=chris -c user.email=chrys92d@gmail.com`
   + `-s` (the 3c6b479 precedent; repo config differs).
6. Known-red steps A5'–A9' (and possibly REOPEN' after its new banner assertion) are owned by
   DECISIONS-PENDING entry 0 — the suite exits 1 by design until the human authorizes the next
   move. The E2E suite is the reproduction instrument for whoever picks it up.

## Harness facts a successor needs

- `frontends/shell/e2e/`: `lib.mjs` (attachOrLaunch/attachConsole/waitForSettle), `debug-session.mjs`
  (instrument CLI, `npm run e2e:debug`), README.md (docs/09 posture). playwright-core@1.62.1
  devDependency (human-confirmed), CDP attach only, no browser downloads.
- Dev-only test surface `window.__SPATIAL_E2E__` (`src/e2e-test-surface.ts`): `openPath` in
  AdmissionPanel, `capturePixels` in WorkingCanvas (one-shot onAfterRender; restore must be a no-op
  fn, never `undefined` — deck.gl 9.3.7 calls it unconditionally). Gated `import.meta.env.DEV`;
  grep-verified absent from production bundle.
- Implementation agent (Sonnet): id `aed8bce308196b5f4`, resumable via SendMessage, has full context.
