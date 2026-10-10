*Custodian's filing note (2026-10-10): shell-map-refill-after-resize worker report 1, phase 1 (code and non-e2e tests; no e2e run, by the brief, because another piece held the app ports), the worker-high run 23:28:11Z to 23:47:31Z by its transcript, on cut/shell-map-refill-after-resize, head 64de82e688aac402264d225852c70c752148971a, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is d66cab77309ab6a54845d65caf805e45c846f85fb2f5c37753682be00918f751. Phase 2 (every e2e suite at the base and the head, and the two e2e step mutations) is the custodian's to schedule after crs-undeclared-message-wording's e2e runs end.*

---

REPORT: shell-map-refill-after-resize (slot 1), phase 1. Worker model observed: Sonnet 5.5. No e2e suite was run, the app was not started, and `app-up` was not run. No §5 invalidator fired, no §8 item was breached, and no step needed a file outside §2.8.

## State
- Branch `cut/shell-map-refill-after-resize` is published. HEAD is `64de82e688aac402264d225852c70c752148971a`, and `git ls-remote` shows the same id.
- `git status --porcelain` is empty.
- Cargo was not used, so no target directory was touched.

## Commits
Each is signed off and ends with the Co-Authored-By line you gave. I also added the `Claude-Session:` trailer from this session's attribution reminder, so the Co-Authored-By line is not the very last trailer. If your check needs it last, say so.
- `6de4d246` feat: G1 product.
  - `viewportBbox.ts` gains `viewportAfterResize` and the `ViewportCamera` type.
  - `WorkingCanvas.tsx` gains a camera ref written at the three camera sites, `reportViewport` as the only call of `onViewportChangedRef.current(`, deck's `onResize`, and the prop `onViewportWithinLastQuery`.
  - `App.tsx` gains one JSX prop, after `return (`.
- `bc32f0ad` test: RF1 to RF9 (G2).
- `4b2f4801` test: `layout.mjs` RESIZEQ and FILL asserted, BURST recorded. Written, not run (G3).
- `6d8f18a2` docs: KNOWN-LIMITATIONS item 39 retired.
- `52df6eab` docs: walkthrough Part V.
- `6554b96c` docs: e2e README's layout paragraph.
- `4769dc33` test: the observed mutations recorded in the test files, with the commit they were observed at.
- `64de82e6` chore: un-export `ResizeViewport`, because nothing imports it (§8 item 10). Only the `export` keyword changed.

## Item 39 and Part V
- **Item 39 byte-copy method.** A script read the form's lines 124 and 125 and wrote them into `KNOWN-LIMITATIONS.md` in place of the old three lines. The script asserted both lines' prefixes and that the old item was the file's last.
  - The item line is byte-identical to form line 124: sha256 of line 124 (with its newline) is `9ac51c1ae1e89932fbb20e9681b237cc3e745e7cff1272e49533daffbd57f1bf`, and the `KNOWN-LIMITATIONS.md` line matches.
  - The comment is form line 125 with exactly one span replaced by script: `DRAFT wording for the human's sight, not the human's own wording` became `wording approved by the human on 2026-10-09 (this form's Amendment 1, item 4)`. The resulting line's sha256 is `3211a47c9a2250cd632aaf37ca59766dfcbb5558316bc21e9b4782ddcb5c4ff0`, and it equals the same `sed` replacement applied to form line 125.
  - The change is +2 and −3 lines, with no CR bytes.
- **Part V as committed.** It is appended after Part U, with a heading, a one-paragraph intro, a six-row table and a blank result log. It has no duration anywhere, and no Sitting-estimate line.
  - Rows V1 to V6 follow §2.6. The V3 splitter row escapes `|` as `\|`.
  - The result log has ten blank fields: date, run by, build, last amendment, V1 to V6.
  - It is 28 added lines and 0 removed. No other Part or result log was touched.

## Mutations
Each was applied by script, the named test was run with `npx vitest run <file> -t "RFn:"`, the edit was reverted with `git checkout`, and `git status --porcelain` was empty after each (printed as `''`). All were observed at commit `6554b96c926a7f884b2cde952660df42f4238110`, with a clean tree before and after. The failures are recorded in the test-file comments of `4769dc33`.

| ID | Edit | Failing test and message |
|---|---|---|
| RF1 | The box is computed at the size implied by `lastQueried`. The camera carries no size per §2.2, so this is my realisation of "the camera's last-written size". | RF1: `expected { kind: 'within', …(1) } to deeply equal { kind: 'query', …(1) }` |
| RF2 | `kind: "query"` for any size change. | RF2: `expected { kind: 'query' } to deeply equal { kind: 'within' }` |
| RF3 | Containment checks widths only. | RF3: `expected { kind: 'within' } to deeply equal { kind: 'query' }` |
| RF4 | The `lastQueried` guard is dropped. | RF4: `TypeError: Cannot read properties of null (reading 'xmin')` |
| RF5 | The size guard line is removed. | RF5: `0 x 600: expected { kind: 'within' } to deeply equal { kind: 'none' }` |
| RF6 | Containment is strict (`>` and `<`). | RF6: `expected 'query' to be 'within'` |
| RF7 | The fit site is restored to a direct call of `onViewportChangedRef.current(`. | RF7: `expected 2 to be 1` |
| RF7b (extra) | `onResize:` renamed away in the Deck props. | RF7: `expected 'new Deck({...' to match /\bonResize:/` |
| RF8 | App's within handler emptied. | RF8: the diff shows expected `xmin 100, ymin 100, xmax 600, ymax 500` (b2), received `0, 0, 1000, 800` (b1). |
| RF9 | The within handler also calls `viewportDebounceRef.current?.call(...)`. | RF9: `after a within-report: expected 2 to be 1` |

- **Code that differs from the observation commit.** `64de82e6` changed only the `export` keyword on `ResizeViewport` after the observations. The recorded hash stays `6554b96c`.
- **E2E step mutations.** These are phase 2's: remove `onResize` from the Deck props for RESIZEQ, and report `lastQueried` instead of the new box for FILL.

## Checks at the head
- `npm ci` ran in `frontends/shell` and in `renderer/bundle-viewer`; both exited 0.
- `npm run verify` ran twice, each in its own `hold shared -Project SpatialIDE` call, with `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. Both holds were granted and released.
  - Run 1, at `4769dc33`, exited 0.
  - Run 2, at the final head `64de82e6`, exited 0.
  - Both runs gave the same per-part results.

| Part of `verify` | Result |
|---|---|
| typecheck (`tsc --noEmit`) | pass |
| `check:dev-origin` | PASS |
| `check:origin-event` | PASS |
| `verify:adr-index` | PASS (34 ADRs) |
| `build` | pass |
| `check:dist-clean` | PASS |
| `check:dist-notice` | PASS |
| `test` (vitest) | 78 files and 1193 tests passed |
| `test:residency-trace` | 76 passed, 0 failed |
| `test:citation-integrity` | 30 passed, 0 failed |

- No timing-sensitive failure was seen.
- `verify-quotes --show-cites` over my changed files showed no finding on any line I added. It lists failures elsewhere, in old walkthrough Parts, which I did not touch.

## §7 figures
Taken with the §7 command at base `4fd3259a`. The base is the merge base with origin/main, so it is the cut.

| File | Lines | Ceiling |
|---|---|---|
| `viewportBbox.ts` | 31 | 45 |
| `WorkingCanvas.tsx` | 47 (40 added, 7 removed) | 90 |
| `App.tsx` | 6 | 15 |
| **G1** | **84** | 150 |
| `viewportBbox.test.ts` | 52 | 120 |
| `WorkingCanvas.test.ts` | 19 | 40 |
| `App.layout.test.tsx` | 63 | 90 |
| **G2** | **134** | 250 |
| `layout.mjs` (G3) | 182 (169 added, 13 removed) | 200 |
| **Total** | **400** | 600 |

Outside the count: `MANUAL-WALKTHROUGH.md` 28 (limit 30), `e2e/README.md` 2 (limit 12), `KNOWN-LIMITATIONS.md` 5 (limit 8). Nothing was trimmed.

## §8 items, one by one
1. **Timer or constant in the resize path.** None in the product. The new constants (`RESIZEQ_WINDOW_MS`, `FILL_WINDOW_MS`, `MAX_FILL_NOTCHES`, `BURST_MOVES`, `BURST_STEP_PX`) are e2e-local in `layout.mjs`.
2. **Second call site of `onViewportChangedRef.current`.** None. RF7 pins exactly one, in `reportViewport`, and the mutation reached 2.
3. **Query when the new box lies inside the last asked box.** The `within` path calls only `onViewportWithinLastQuery`. RF2 and RF6 pin it, and RF9 shows App issues no request for it.
4. **Query before the first reported view.** `viewportAfterResize` returns `none` when `lastQueried` is null (RF4). The auto-fit does not set `lastQueried`.
5. **Read of deck's view state.** None. The `onResize` handler ignores deck's arguments and reads `canvas.clientWidth` and `canvas.clientHeight`.
6. **Hover, re-pick or frame origin.** The handler touches none of them, and the existing D4 disarm is unchanged.
7. **File outside §2.8.** None. The changed files are the three product files, the three test files, `layout.mjs`, and the three outside-the-count files.
8. **App.tsx above `return (`.** Unchanged. The only edit is one JSX prop at about line 1847, with a 3-line JSX comment.
9. **Dependency or lockfile.** None.
10. **Callback or export without a product caller.**
    - `onViewportWithinLastQuery`: caller `App.tsx:1847`.
    - `viewportAfterResize`: caller `WorkingCanvas.tsx:1947`.
    - `ViewportCamera`: imported by `WorkingCanvas.tsx` and the test.
    - `ResizeViewport`: un-exported.
11. **e2e files and thresholds.**
    - Only `layout.mjs` and `e2e/README.md` changed.
    - The RESIZEQ step timeout is unchanged at 120000.
    - FILL and BURST are new steps with new timeouts of 180000 and 90000.
    - `e2eSetViewState` appears 0 times in `layout.mjs`.
12. **Performance claim or docs/08 row.** None. The README, Part V and the comments make no timing claim.
13. **KNOWN-LIMITATIONS or walkthrough claiming more than §4 shows.** Item 39 is byte-copied; Part V records neutral outcomes and asks the human to record what they see.
14. **New product string.** None.
15. **Verbatim human quote.** None written.
16. **New test without its mutation.** RF1 to RF9 each have one.

## e2e changes written in `layout.mjs` (not run)
- **RESIZEQ is now asserted.**
  - It waits for the trace to settle, then does a real `.zoom-to-layer` click and settles fully: quiet trace for 3 s, and in-flight plus queued stream counts both 0.
  - The precondition is computed before the toggle, using `loadShellModule` for `computeAuthoritativeViewportBbox` and the tile-grid functions. It uses the grid frame, the last view-state line, the canvas CSS size, and the Inspector plus splitter width measured from the DOM. If the predicted new cell count is below 1 it throws "invalidator I3, STOP".
  - Ctrl+I must then give at least 1 new `viewport_query` line within 3 s. The trace must settle, and Ctrl+I again must give 0.
  - The predicted count is recorded beside the observed count. A `finally` block reopens the Inspector.
- **FILL (new, after E-REOPEN).**
  - It waits for the grid frame and a settled trace. One wheel notch measures the zoom per notch.
  - Extra notches are added until the cell on screen is below the growth per side and the grown view lies inside the anchor box. If that is not reached within 15 notches, or does not hold after the notches, it throws "STOP".
  - Ctrl+I must then give at least 1 `stream-issued` line and at least 1 `batch` line with rows above 0 on those handles within 10 s. The trace must settle, and the Inspector is restored.
- **BURST (new, recorded and not asserted).** It does a 24-move splitter drag (4 px per move) and records the `viewport_query` times relative to the first move, the last move and the release. A second, unrecorded drag puts the splitter back.
- **Unverified assumptions phase 2 must watch.**
  - The console text formats are taken from an older run ledger, not from a live run. Those are `stream-issued {dataset: …, streamHandle: …}`, `batch {streamHandle: …, batchSeq: …, rows: …}` and the `view-state` line.
  - `#splitter-inspector` and `.zoom-to-layer` must be clickable, and `residencyGridFrame` exists only on the candidate arm.
  - RESIZEQ's 120000 ms step timeout is unchanged and may be tight with the added settles.

**What phase 2 must run:**
1. Every e2e suite at the base `4fd3259a` and at the head `64de82e6`, step by step, listed in the PR body (§9). Include `layout.mjs`: at the base its RESIZEQ is the old recorded step, and FILL and BURST do not exist.
2. The two e2e step mutations: remove `onResize` from the Deck props (the close count should be 0), and make the resize handler report `lastQueried` instead of the new box (no stream after the toggle).
3. Check H1 and the I1, I3 and I6 invalidators on the real app.

## Differences from the form, or worth flagging
- **RF1 mutation wording.** The form says "the camera's last-written size", but the camera ref carries no size (§2.2). I used the size implied by `lastQueried` and say so above.
- **Item 39 comment.** The approval note's exact words are mine, per Amendment 1 item 4: "wording approved by the human on 2026-10-09 (this form's Amendment 1, item 4)". Nothing else changed.
- **`layout.mjs` imports `loadShellModule`** from `tsModuleLoader.mjs` for the computed preconditions. Its header says an e2e module imports no src; this is the loader `residency-harness.mjs` already uses. I did not edit that header sentence.
- **App render tests.** `./publish/client` is mocked with `importOriginal`, overriding `publishPrepare` and `subscribePublishProgress` (Tauri's `listen` needs a runtime). The manager is already mocked. Layout, the Export panel and App are real, so I7 does not fire.
- **Auto-fit after a filter.** `resetFitForNewGeneration` followed by an auto-fit with notify false writes the camera but not `lastQueried`. A later resize then compares against the older `lastQueried`. This follows the form (the camera is written whether or not the fit notifies), and I did not change it. It is an edge a reviewer may want to see.
- **Base merges.** The base contains PRs #196 (e2e-hover-establishing-read-stale) and #202 to #204 (K6 fix and re-aim).
