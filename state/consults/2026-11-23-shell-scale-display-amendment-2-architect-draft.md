*Filed by the custodian: the architect's draft of Amendment 2 to `governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md`, after the architect's form gate, attempt 1 (FAIL; `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md`, gate-log row 864), node:shell-scale-display@amendment-2-architect-draft, dispatched at 2026-11-23T15:36:10Z. Its run: Read 20, Grep 10, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T15:36:10Z to 2026-11-23T15:42:20Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 16994 bytes, sha256 014d5ed7f89ca06cd18961951764e07f9ac1c98de72b153d4d40fa9a637842c8, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 3 follows it.*

---

Result: Amendment 2 is drafted. It adopts E1 to E4 as the gate wrote them, with one addition each to E1/E3 (the new function's P0 stub) and E4 (an assertion that does not depend on the notch size), each checked against the code. It adopts D1 to D6 as the gate wrote them, with one correction each to D1 and D3, shown from the code. Reviewed: detached read worktree C:/dev/wt/read-1123c @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e.

---AMENDMENT 2---
## Amendment 2 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 1 (FAIL): E1 to E4 and the documentation findings

*Post-result amendment (class 1): written after the outcome of the architect's form gate, attempt 1 (FAIL), was seen. Written before any code.*

1. **Basis.** The gate report is `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md`, cited by finding id. Every `path:line` in this amendment is read at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e, which is on main. Item 12 lists each pin, and the custodian adds each sha256 by script before the commit. Nothing was run. Each Old text below occurs once in this form above this amendment. Where an Old text is part of a longer line, only that part is replaced.

2. **E1 and the P0 stubs (with E3's new function).** At P0, `scaleLabel` was a working function, so U-SB3 passed and I3 voided the run. Both commits now stub and implement every exported function of `scaleBar.ts`.
````text
  - `scaleBar.ts` with §7's constants, `scaleLabel`, and `scaleReading` that always returns `{kind:"none"}`;
````
````text
  - `scaleBar.ts` with §7's constants, `scaleLabel` that always returns `""`, and `scaleReading` and `readingAtPxPerUnit` that always return `{kind:"none"}`;
````
````text
- Commit 2 implements `scaleReading` and the comment at :148.
````
````text
- Commit 2 implements `scaleReading`, `readingAtPxPerUnit`, `scaleLabel` and the comment at :148.
````

3. **E2, U-SB2's sweep.** The bar exists only while −log2(5×10⁷/60) < zoom < log2(60/(5×10⁻⁴)), which is about −19.67 < zoom < 16.87. The old range [−9, 20] ran into `out-of-range`. The new range [−19, 16] lies inside the bar range: zoom −19 gives L 5×10⁷ (k = 7, width about 95.4), and zoom 16 gives L 0.001 (k = −3, width about 65.5).
````text
a sweep of zoom from -9 to 20 in steps of 1/64.
````
````text
a sweep of zoom from -19 to 16 in steps of 1/64, asserting `kind: "bar"` at every step.
````

4. **E3, U-SB1's exact boundaries.**
- Equality m·10^k·2^zoom = 60 is not reachable through a zoom. At an integer zoom it would need 60/(m·10^k) to be a power of two, and 3 divides 60 but no m in {1, 2, 5}. At any other zoom, 2^zoom is irrational.
- At pixels per unit 30 and 12, the products 2×30 and 5×12 are exactly 60 in floating point.
- The comparison therefore moves into a pure function that U-SB1 calls directly.
````text
Otherwise, the smallest m × 10^k with m × 10^k × 2^zoom ≥ SCALE_BAR_MIN_PX.
````
````text
Otherwise, `readingAtPxPerUnit(unit, 2 ** zoom)`: the smallest m × 10^k with m × 10^k × pxPerUnit ≥ SCALE_BAR_MIN_PX, and `widthPx` is that same product. `readingAtPxPerUnit` is pure and exported. Its product caller is `scaleReading`, and U-SB1 also calls it at exact pixels per unit (Amendment 2, item 4).
````
````text
- M1: `≥` becomes `>`. Fails at 30.
````
````text
- The comparison is made by a pure exported `readingAtPxPerUnit(unit, pxPerUnit)` in `scaleBar.ts`, whose product caller is `scaleReading` (passing `2 ** zoom`). U-SB1's 30, 29.999, 12 and 11.99 cases call it directly.
- M1: `≥` becomes `>`. Fails at 30 and 12.
````
````text
- the caller rule for `scaleReading`, `scaleLabel`, `ScaleItem` and `readZoom`;
````
````text
- the caller rule for `scaleReading`, `readingAtPxPerUnit`, `scaleLabel`, `ScaleItem` and `readZoom`;
````
- Caller rule: `readingAtPxPerUnit` has a product caller, `scaleReading`. The test's direct call is in addition to that caller, not instead of it.
- Requiring `widthPx` to be the product the comparison tested means U-SB2's bound `widthPx ≥ SCALE_BAR_MIN_PX` cannot disagree with the choice by one ulp.

5. **E4, E-SCALE's row W.** After Z6 (S-4), one notch cannot bring back a bar, so W proved nothing. W now starts from a bar.
````text
It runs Z1 to Z6, then W, then D.
````
````text
It runs Z1 to Z6, then Z1 again, then W, then D. Each row's zoom differs from the one before it, so deck's deep-equal on the seam's `initialViewState` (`frontends/shell/src/canvas/WorkingCanvas.tsx:2409`) drops none of them. W turns one notch of `ZOOM_NOTCH_DELTA_Y` (`frontends/shell/e2e/lib.mjs:618`) from Z1. It asserts that the zoom `e2eReadWorkspace` returns is not 0, that the label differs from Z1's, and that the label and the width (within 1 CSS px) equal `scaleLabel` and `scaleReading` at that zoom, loaded through `loadShellModule` (`frontends/shell/e2e/layout.mjs:26`; `frontends/shell/e2e/tsModuleLoader.mjs:77-80`). Predicted: one notch adds about 0.93 to the zoom (`frontends/shell/e2e/regression.mjs:729`), so L is 50 and the width about 95.
````
- Check: the notch reaches the interactive handler, which writes the camera and then reports (`frontends/shell/src/canvas/WorkingCanvas.tsx:2169`, `frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210`).
- `e2eReadWorkspace` returns `currentView` (`frontends/shell/src/App.tsx:1475`).
- At zoom 0.93 the pixels per unit are 1.905. 20 m gives 38 px, below the 60 px minimum, so L is 50 at about 95.3 px. Z1's label is `100 m (CRS)`.
- M6 (`readZoom` returns 0) leaves W showing Z1's reading, so W fails under it.

6. **D6, the mutations' failing cases.** For M5, checked against the code: `onViewShown` is `showBox` (`frontends/shell/src/App.tsx:2388`). `showBox` only writes the store (`frontends/shell/src/App.tsx:2362-2364`), and the store is a ref with a listener set, not App state (`frontends/shell/src/feature/FeaturePanel.tsx:13-19`). So an item that does not subscribe stays empty at (ii). At (iii), `onViewportChanged` also starts the debounced query (`frontends/shell/src/App.tsx:2438`), and a later App render could re-read, so (iii) is not a sure kill. The gate's last word, "(ii)", is adopted. (ii) is pinned so that no later render can mask it.
````text
- (ii) `onViewShown` at zoom 0 gives Z1;
````
````text
- (ii) `onViewShown` at zoom 0, fired in one `act` after the open has settled and asserted at once after that `act`, with no wait, gives Z1;
````
````text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (iii).
````
````text
- M5: `ScaleItem` reads once and does not subscribe. Fails at (ii).
````
````text
- M3: the exponent's sign is ignored for k < 0. Fails at k = -1.
````
````text
- M3: the exponent's sign is ignored for k < 0. Fails at k = -3 and k = -1.
````
````text
- M4: `unit === "metre"` becomes `unit !== "degree"`. Fails at `other`.
````
````text
- M4: `unit === "metre"` becomes `unit !== "degree"`. Fails at `other` and `unestablished`.
````

7. **D1, Overlap.** These are the gate's words with one correction. The colour-by form edits `WorkingCanvas.tsx` code as well as comments: `resetFitForNewGeneration` at :193 and its body at :1660-1664 (`governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:90`, `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:96`, `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:121`). Milestone 5's lists are at `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:293-319`.
````text
- `App.tsx`, `styles.css`, `WorkingCanvas.tsx` and `src/layout/` (`contributions.ts`, `regionParts.tsx`, `scaleBar.ts`, `scaleBar.test.ts`, `StudioLayout.test.tsx`): milestone 5's form. `App.tsx` is also in the recovery offer's form. Neither is built, so the order goes to whichever is built first.
````
````text
- `App.tsx`, `styles.css`, `WorkingCanvas.tsx`, `contributions.ts` and `StudioLayout.test.tsx`: milestone 5's form (PR A; `App.tsx`, `contributions.ts` and `styles.css` also in its PR B). `App.tsx` is also in the recovery offer's form. `App.tsx`, `WorkingCanvas.tsx` (its `resetFitForNewGeneration` at :164-193 and :1660-1664, not :148), `KNOWN-LIMITATIONS.md`, `MANUAL-WALKTHROUGH.md` and `e2e/README.md` are also in the colour-by-refill form. None is built, so the order goes to whichever is built first.
````
````text
- `e2e/layout.mjs`: possibly milestone 5's e2e suites, which are not named.
````
````text
- `e2e/layout.mjs`: milestone 5's PR A, if its re-sweep declares it (its candidate list names `layout.mjs`).
````

8. **D2, §8 item 4.**
````text
4. A bar for a unit other than `metre`; a ratio; the word "ground" anywhere but S-2's negation.
````
````text
4. A bar for a unit other than `metre`; a ratio; the word "ground" in a string the app shows, other than S-2's negation.
````

9. **D3, the KNOWN-LIMITATIONS draft (§2 item 8).** These are the drafter's words, not the human's and not the advisor's. They are adopted only as this form's draft and go to the advisor with §2 item 8. They are the gate's words with one clause added, because a reopened project shows the item before any feature is drawn. The open calls `applyView` (`frontends/shell/src/App.tsx:1836`, `frontends/shell/src/App.tsx:2034`). `applyView` writes the camera unreported (`frontends/shell/src/canvas/WorkingCanvas.tsx:1646-1650`), which goes to `onViewShown` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1458`).
````text
When the dataset's CRS names the metre on both axes, the status bar shows a bar and the length it spans on the map at the current zoom:
````
````text
When the dataset's CRS names the metre on both axes, the status bar shows, once the map has drawn the first of the dataset's features, a reopened project has restored its saved view, or you have moved the map, a bar and the length it spans on the map at the current zoom:
````
````text
For a dataset in degrees, in another unit or in a unit not established, no bar is shown and the status bar says so.
````
````text
For a dataset in degrees, in another unit or in a unit not established, no bar is shown, and from the same moment the status bar says so.
````
- Clause check:
  - "drawn the first of the dataset's features": the auto-fit on the first batch (`frontends/shell/src/canvas/WorkingCanvas.tsx:1591`, `frontends/shell/src/canvas/WorkingCanvas.tsx:1819`) reports through `frontends/shell/src/canvas/WorkingCanvas.tsx:1458`.
  - "restored its saved view": the `applyView` route above.
  - "moved the map": the interactive report (`frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210`).
  - A resize reports only once a camera exists (`frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127`), and only these routes create one.
  - "from the same moment": S-3 needs a non-null box, by §2 item 2's snapshot.
- An empty file, or a first look refused at open, shows no item until the map is moved. That is consistent with the words.

10. **D4 and D5, the callers.**
````text
"Its product callers are `App.tsx`'s save and the status bar's scale item (`layout/regionParts.tsx`)."
````
````text
"Its product callers are `App.tsx`'s save and `App.tsx`'s `readZoom`, which the status bar's scale item (`layout/regionParts.tsx`) calls."
````
````text
`scaleLabel(mantissa, exponent)` builds the decimal from the digits, with no float arithmetic, in OPEN-4's format.
````
````text
`scaleLabel(mantissa, exponent)` builds the decimal from the digits, with no float arithmetic, in OPEN-4's format. Its product caller is `ScaleItem`, for S-1 and S-2.
````

11. **Every new or changed test.** All files are as in §4. At P0, every test fails at its first bar or statement assertion, which satisfies I3. Each mutation's "fails at" set is the one this amendment shows.

| Test | File | Red at P0 because | Mutation | Fails at |
|---|---|---|---|---|
| U-SB1 | `src/layout/scaleBar.test.ts` | `readingAtPxPerUnit(…, 30)` returns `none`, not L 2 | M1 | 30 and 12 (direct calls) |
| U-SB2 | same | zoom −19 returns `none`, not `kind: "bar"` | M2 | the first sweep width ≥ 150 |
| U-SB3 | same | `scaleLabel` returns `""` | M3 | k = −3 and k = −1 |
| U-SB4 | same | `metre` returns `none`, not a bar | M4 | `other` and `unestablished` |
| R-SC1 | `src/App.scale.test.tsx` (new) | (ii) shows nothing, not Z1 | M5 | (ii) |
| E-SCALE | `e2e/layout.mjs` | no `.status-scale` at Z1 (I4) | M6 | Z2, the first row whose zoom is not 0. It would also fail at W, and R-SC1 at (iii). |

No named mutation has a known case in its named set where it passes. M1 does pass U-SB2, because the sweep never reaches equality (item 4). U-SB2 is not in M1's set.

12. **Scope and §7.** §7 is not edited.
- No file is added and no row is added: `readingAtPxPerUnit` and the label stub fall inside `scaleBar.ts`, the direct calls inside `scaleBar.test.ts`, and Z1-again and W's assertions inside `e2e/layout.mjs`. So nothing here is a class-9 addition.
- The per-file ceilings (90, 180, 150) and the totals (760 lines over 10 files; README 20, KNOWN-LIMITATIONS 10, walkthrough 45) still hold as declared. An overrun is class 8.
- I1 to I6 are unchanged.

Pins, each `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`, with each sha256 added by the custodian's script:
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2409`
- `frontends/shell/e2e/lib.mjs:618`
- `frontends/shell/e2e/layout.mjs:26`
- `frontends/shell/e2e/tsModuleLoader.mjs:77-80`
- `frontends/shell/e2e/regression.mjs:729`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2169`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210`
- `frontends/shell/src/App.tsx:1475`
- `frontends/shell/src/App.tsx:2388`
- `frontends/shell/src/App.tsx:2362-2364`
- `frontends/shell/src/feature/FeaturePanel.tsx:13-19`
- `frontends/shell/src/App.tsx:2438`
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:90`
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:96`
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:121`
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:293-319`
- `frontends/shell/src/App.tsx:1836`
- `frontends/shell/src/App.tsx:2034`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1646-1650`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1458`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1591`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1819`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127`

13. **For the advisor, unruled here:**
- OPEN-1 to OPEN-7 and the strings S-1 to S-4 are untouched.
- D3's two sentences (item 9) are the drafter's words and join §2 item 8's draft.
- The reuse index's miss stays as recorded in the form's header (Authority, fourth bullet).

**Superseded index.** By this amendment:
- §2 item 1: the "Otherwise" sentence and `scaleLabel`'s sentence.
- §2 item 6's quoted comment.
- §2 item 8: two sentences.
- §4: the P0 commit 1 `scaleBar.ts` line and the commit 2 line; U-SB2's sweep; M1, M3, M4 and M5; R-SC1 (ii); E-SCALE's order.
- §8 item 4.
- §9: the caller-rule line and two Overlap lines.

Read the last amendment first.

Nothing above is edited.
---END OF AMENDMENT---

What I could not settle:
- **Hashes.** I have no Bash, so I did not compute or recompute any hash. Item 12's pins need their sha256 values added by script before the commit.
- **The gate report is not on main yet.** It must be filed at `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md` in or before this commit, or item 1 cites an untracked file.
- **Where I departed from the brief's "adopt the gate's words":**
  - D1: the colour-by form edits `resetFitForNewGeneration`'s code, not only comments.
  - D3: one clause added for a reopened project's restored view, which ordinary use reaches.
  - E1: also stubs `readingAtPxPerUnit`.
  - E4: W asserts that the label differs, not that the width differs, and is tied to `loadShellModule`.
  The custodian may strip any of these. Each is shown from the code above.
- **E4 rests on deck's wheel step.** W's "label differs from Z1's" depends on the notch adding at least log2(1.2), about 0.26, to the zoom. I took 0.93 from the comment at `regression.mjs:729`. I did not read deck's scroll code.
- **Two gate notes left out of the amendment, for the custodian:**
  - §1's "over 260 lines" rests on a ceiling, not an estimate.
  - The DEV seam's missing write id is dev-only.
- **Very large zooms.** Zoom has no clamp (§0). A zoom large enough that `2 ** zoom` gives 0 or Infinity should produce `out-of-range`. The form does not test this, because ordinary use is not shown to reach it. A U-SB4 case at zoom ±1100 would close it if the advisor wants one.
- **Not this piece's finding:** the colour-by form changes a handle method's signature (`resetFitForNewGeneration(options?)`), which bears on the order on `WorkingCanvas.tsx`.

Model: claude-opus-5-5 (Opus 5.5).
