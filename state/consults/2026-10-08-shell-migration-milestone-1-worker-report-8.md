*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s worker report for correction round 1 (the form's Amendment 9), everything but K6 case (iii), at the branch head 773d42af809d14e96e639d01a45960cead882c94 (the same worker-high, resumed at 21:01:24Z, report at 21:16:40Z, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is be697ed4722c57171c521d358bba73d3a003e96e363b6cb83e49ad1a9e1750ce. The custodian read the commits 8127b0f5..773d42af (four, 90 lines added and 22 removed over 8 files) and the CSS diff (two border-box lines). Names below are at that head.*

---

# Correction round 1 report, milestone 1 (Amendment 9)

Everything Amendment 9 asks of the worker is done except K6 case (iii), which I did not touch. The branch is published as an ordinary update: 8127b0f5..773d42af, no force, rebase or merge. The worktree is clean, ports 9223 and 5400 have no listener, and I made no product-file mutation edit. The permission system refused nothing.

## Commits (all signed off, message from a file, two trailers, no outside reference or @mention)

| Hash | What it holds |
|---|---|
| **757271d4154dbb948c8f049d399f05bf184f79ba** | `test:` the new `E-FLOOR` step in `e2e/layout.mjs` (61 insertions, 1 deletion) |
| **2e17ee52a52f5813d9d4fefb36b5bb69a8e51efb** | `fix:` `src/styles.css`, `box-sizing: border-box` on `.attention-strip` and `.status-bar` (2 lines) |
| **03654b9758a113f678d2009e946123fd8d7a7ed3** | `docs:` KNOWN-LIMITATIONS item 39's body sentence |
| **773d42af809d14e96e639d01a45960cead882c94** | `docs:` the code and test text fixes, the walkthrough coverage prose, and the UTF-8 repair |

## E-FLOOR

- **How the bars are filled.** By DOM content added in the step, as the reviewer's probe did. The product has no path that fills either bar past its cap: the attention strip has no items today and the status bar holds a handful. In each bar, 40 marker rows (`data-floor-probe`) are appended, and the strip is un-hidden. The step sets the viewport to 1024 x 640 with `page.setViewportSize`, as E-FIT does, and opens Activity with Ctrl+J. The `finally` removes the probe nodes, restores the strip's `hidden` flag, clears the metrics override and closes Activity.
- **At the test commit 757271d4 (CSS not yet fixed), held, rc 1.** The step failed by name:
  - `[E-FLOOR] FAIL (1976ms): E-FLOOR: .canvas-container is 480 x 306.21875, below 480 x 320`
  - This matches the reviewer's 480 x 306.2. Every other step passed (OPEN, E-KEYS, E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT, RESIZEQ, E-REOPEN, FIXTURES).
- **After the fix, at 2e17ee52, held, rc 0.**
  - `[E-FLOOR] PASS (2020ms): at 1024x640 with Activity open and both bars filled past their caps (attention strip 128px, status bar 48px): map 480x320`
  - Every step and FIXTURES passed.
- **Side effect worth knowing.** The map at the 1280 x 800 default is now 668 x 736 (it was 668 x 730.2), because the empty bars no longer carry content-box padding. E-FIT records 668x530 and 754x498. This is the intended effect of the fix; my earlier comments that quote "668 x 730" remain true of the earlier heads and are listed under Noticed.
- **Border-box held.** The fix did not need padding put into the fit.

## KNOWN-LIMITATIONS item 39 (`KNOWN-LIMITATIONS.md:369`)

- **Old:** "What you will see is a strip of the map with no features in it where the map has grown, the same as after resizing the window today. A pan or a zoom fills it."
- **New:** "The part of the map that was uncovered may show no features until a pan or a zoom, as after resizing the window today. Walkthrough row U6 records what is seen there."
- The rest of the item and its evidence comment are unchanged.

## Text fixes (all in 773d42af)

- **D3, `e2e/source-changed.mjs:836-842`.** The S4 comment now says the pan is bounded by the fixture's extent, and that in practice it runs to its bound (13 drags at S2's zoom), because the first `stream-issued` line arrives only after the pan ends. The name "as long as it needs to be" is gone.
- **D10, `src/layout/layoutConstants.ts:14-17`.** VIEWPORT_FLOOR's reader is U1 (`layoutState.test.ts`), not `effectiveSizes`.
- **D11, `frontends/shell/MANUAL-WALKTHROUGH.md:378` and `:390`.** "Part G's own Publish button" becomes "Export button", and "the Publish disclosure's own DOM" becomes "Export disclosure". F8's and S1's sentences are untouched.
- **D12, `e2e/regression.mjs`.**
  - The K6 header's description of case (v) (lines 1011-1017) now includes the camera-settle re-pick condition and cites the comment above `afterReleaseAllowed`.
  - The A9' decline comment (lines 771-775) now reads as tracking, not an active stop.
  - `e2e/pan-anchor.mjs:129-131`: the garbled clause is fixed to "measured at this branch's head".
- **Reviewer D12, `e2e/regression.mjs:2454`.** ABSENTCRS' return string now says "no describe-summary in the Layers region".
- **Not touched.** K6 case (iii): its comparison, its fallback, its summary string and its comment.

## UTF-8 scan

- **Cause and repair.** The two lone bytes came from my own earlier Python edits: they read UTF-8 with the Windows default text encoding and wrote single bytes. I repaired both byte-exactly as UTF-8 and made every edit this round with an explicit `utf-8` encoding. The repairs are at `regression.mjs:855` (§ in "§3.3") and `pan-anchor.mjs:148` (± in "small ±85" and "large ±250"; these were two bytes on one line).
- **Scan.** Strict UTF-8 decode of every file changed since the base (`git diff --name-only e888787e HEAD`, 108 files, including both named files): all valid. Before the repair, only those two lines in those two files failed.

## Runs (all held, shared hold, one per call, `cd` first)

| Run | Head | rc | Result |
|---|---|---|---|
| `node e2e/layout.mjs` | 757271d4 | 1 | E-FLOOR failed by name (above); all else passed |
| `node e2e/layout.mjs` | 2e17ee52 | 0 | all passed, E-FLOOR included |
| `npm run verify` in `frontends/shell` | 773d42af | 0 | 78 vitest files, 1184 tests passed; residency-trace 76 passed, 0 failed; citation-integrity 30 passed, 0 failed; build and dist checks ran |
| `node e2e/layout.mjs` | 773d42af | 0 | every step passed, E-FLOOR map 480x320 |
| `node e2e/regression.mjs` | 773d42af | 1 | only C2'/C3' failed (pre-existing). A9' notch 4 (a different pixel, buffer 138,437), K6 all cases, K7, FIND', B2'/B3' and ABSENTCRS' passed. |
| `node e2e/pan-anchor.mjs` | 773d42af | 0 | 16/16 (the map is 328 x 576 and 788 x 836 now) |
| `node e2e/source-changed.mjs`, `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` | 773d42af | 0 | S1 to S5d and fixture-integrity passed (`launched:true`) |
| `node --check` on `layout`, `regression`, `pan-anchor`, `source-changed` (`.mjs`) | 773d42af | 0 | each ok (unheld, light) |

- The e2e runs used the same fresh-launch workaround as before (`app-down.ps1` between, unheld). Rust did not change, so I did not rebuild the exe.

## §7 per group, `git diff --numstat 176ab912...HEAD` with the form's three excludes (head 773d42af)

| Group | Lines | Ceiling |
|---|---|---|
| G1 | 953 | 1,000 |
| G2 | 273 | 450 |
| G3 | 339 | 400 |
| G4 | 66 | 100 |
| G5 | 1,004 | 900 |
| G6 | 762 | 400 |
| Total | 3,397 | 3,250 |

G6 by file: layout 417, regression 207, pan-anchor 62, source-changed 40, filter-panel 22, console 9, style 3, source-watch-idle 2. This round added 61 (E-FLOOR) to layout.mjs and 2 (CSS) to G3. Class 8 records are the custodian's.

## Deviations

- **Class 3.** The E-FLOOR step lives in `layout.mjs` as a new `stepFloor` and a header mention; its constants restate `VIEWPORT_FLOOR` (an e2e module imports no src).
- **Class 3.** Two text-fix commits (KNOWN-LIMITATIONS, then everything else) instead of one.
- None otherwise.

## Noticed

- **Stale numbers.** Comments I wrote in earlier stages quote map sizes of 668 x 730 and 328 x 570 or 788 x 830. After the CSS fix the maps are 668 x 736, 328 x 576 and 788 x 836. They are accurate for the heads they were measured at. Updating them would be another text round.
- **Gate 2.** The strip-hidden flag set directly on the DOM in E-FLOOR is restored in `finally`; a re-render in between would also restore it, which is harmless.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).
