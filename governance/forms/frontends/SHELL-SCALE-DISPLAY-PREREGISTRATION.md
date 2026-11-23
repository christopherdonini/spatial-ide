# The scale display in the status bar (node `shell-scale-display`): preregistration, full form

*Committed by the custodian on 2026-11-23 from the architect's draft (`state/consults/2026-11-23-shell-scale-display-architect-draft.md`; the hand-back 26295 bytes, sha256 3d1041862c130b04b33f29729630d8d9a06033f3d093fa0ba5b7c69a1d7e8e55): its text from the title to the line before its end mark, byte for byte, with this note put after the title. The note after the end mark stays in the consult. Read the last amendment first.*

**Authority:**
- The human's message of 2026-11-23, item 3 (d), and the advisor's ruling ADV-2026-11-23-15, item 7 (d), which is the advisor's wording and not the human's. Both are cited by item. Neither is on main at the read commit, so the custodian adds their filed paths.
- PLAN node `shell-scale-display` (`governance/PLAN.yaml:5416-5432`). The human's ruling it names, milestone 3's OPEN-7 (c) (`state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:25`, sub-line), says: "The scale display leaves this milestone and becomes a proposed node, with (a)'s shape as drafted."
- The drafted shape is `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md`: §2.8's OPEN-7 (a) part (:276-281), §2.9 (:301), row Y12 (:334), the constants (:472), the SC row (:494) and Amendment 1 item 8 (:587). §0 says where this form departs from it.
- The reuse index (tools/reuse.mjs in the read-only reuse clone at 89bbac37, 2026-11-23) gave, byte for byte:
  `No prior art recorded for "map scale bar display". Research it before planning an implementation.`
  This form records that miss. Its own research is §0's reading of the code.

**Drafted by:** the architect, on the custodian's brief. I read only in the read worktree at main 0bcf543452af79df6251cc7d86ab9f2cf644fcc2, and every `path:line` below is at that commit. I had no Bash, so the custodian adds the span hashes by script. Every pin is historical: for the code, the piece's base is authoritative.

**Committed before any code.** Append-only once committed. An amendment written after any outcome has been seen says so in its first line.

**Gating:** full, with both gates (§1 gives the class).

**Merge:** after the v0.2 tag (ADV-2026-11-21-15 item 1, cited by id and item), and after its base, the re-link piece (§9, Overlap).

## §0. Disclosure

**Reasoned from code.** Nothing was run.

**The read the scale needs already exists.**
- `WorkingCanvasHandle.currentView?(): { centre: [number, number]; zoom: number } | null` (`frontends/shell/src/canvas/WorkingCanvas.tsx:150`). Its doc (:145-149) says that `zoom` is the base-2 log of the CSS pixels one unit spans, and that it changes nothing. Its body (:1640-1644) reads `cameraRef` and nothing else.
- The CSS-pixel reading is the one `viewportBbox.ts:16-23` records, measured at DPR 1.0 only. `pixelsPerWorldUnitAtZoom` (`WorkingCanvas.tsx:607-613`) states the same reading.
- Its product callers today are the save and the DEV read `e2eReadWorkspace` (`frontends/shell/src/App.tsx:1475`, :2190). The doc at :148 says: "Its product caller is `App.tsx`'s save."

**Every zoom write reaches one of the three box reports, after `cameraRef` is written:**
- `fitToExtent`: :1442, then :1453 or :1458. `applyView` goes through it (:1646-1650).
- The interactive handler: :2169, then :2200-2210.
- The DEV seam: :2407, then :2411.
- A resize writes no zoom. Its reports are at :2116-2127.

App sends all three reports to `showBox` (`App.tsx:2362-2364`, :2388, :2428-2446). `showBox` writes the view-box store (`frontends/shell/src/feature/FeaturePanel.tsx:20-40`). An open sets the store to `null` before the new canvas reports (`App.tsx:1176-1177`).

**The unit.** `admitted.describe.crs.unit: CrsUnit` takes one of four values: `"degree" | "metre" | "other" | "unestablished"` (`frontends/shell/src/skp/types.ts:105-114`). The engine records `metre` only when both axes name it (`engine/src/geoparquet.rs:168-177`).

**Zoom is unbounded.** No `minZoom` or `maxZoom` is set under `frontends/shell/src/` (searched). `tileGrid.ts:320` records that no clamp exists.

**Departures from milestone 3's shape, against the code now:**
1. **No new handle method, so no fourth exception under `canvas/`** (OPEN-1). Milestone 3 drafted `cssPixelsPerUnit()` (:277). `currentView?()` now answers the same zoom, so the only edit under `canvas/` is the caller sentence at `WorkingCanvas.tsx:148`, a comment.
2. **The read is in a child that subscribes, not in App's state.** Milestone 3 said that App reads the scale when the counts' box updates (:279). A box is reported on every pan frame, and a pan renders nothing in App (`FeaturePanel.tsx:13-19`). So a small `ScaleItem` subscribes to the store, as `FeaturePanel` does (:98).
3. **`StudioLayout.tsx` is not edited.** Milestone 3 budgeted 20 lines for it. The footer renders every `STATUS_ITEMS` slot (`StudioLayout.tsx:456-460`). `StudioLayout.test.tsx:23-42` gains one `NO_SLOTS` line, because `Slots` makes every slot required (`contributions.ts:80-84`).
4. **The test files change.** `App.command.test.tsx` (held by PR 362) and `command-bar.mjs` (held by PR 359) are replaced by a new `App.scale.test.tsx` and a step in `e2e/layout.mjs`.
5. **New since milestone 3:** an exponent bound (OPEN-3), a number format (OPEN-4) and a degree fixture for the end-to-end test (OPEN-5).

**Intake:**

| Item | Disposition |
|---|---|
| Milestone 3's OPEN-7 (a) shape | In, with the departures above |
| A ratio (1:n), or distance on the ground | Out (§1) |
| A scale in the published bundle | Out |
| More than one drawn view | Out: there is one canvas today (`App.tsx:2356-2358`) |

## §1. May and may not claim

**May claim:** while a dataset whose CRS names the metre on both axes is on the map, and once its canvas has reported a box, the status bar shows the following, which follow every zoom:
- a length L = m × 10^k, with m in {1, 2, 5}, in the CRS's metres;
- a bar L × 2^zoom CSS pixels long, with SCALE_BAR_MIN_PX ≤ width < SCALE_BAR_MAX_PX.

For a dataset with any other unit, it shows S-3 and no bar.

**May not claim:**
- a distance on the ground, or any ratio;
- the bar's length at a device pixel ratio other than 1.0 (`viewportBbox.ts:16-23`);
- any performance figure or docs/08 row;
- macOS or Linux above L1;
- more than one drawn view.

**Class.** Full, with both gates.
- ADV-2026-11-16-06 item 2 (a) (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25`) lists "CRS or reprojection" and "a piece over 260 changed lines". Both hold: the piece shows a length typed by the CRS unit, and it is over 260 lines (§7).
- Item 2 (b) (:26) says: "In doubt, the piece is full."
- ADV-2026-11-23-15 item 7 (d) applies that rule at this form. `governance/AUTONOMY.md` §21a gives the same class (:327, "a CRS-is-a-type invariant"), and so does §21c (:351, "no new user-visible behaviour").

**docs/01 and the ADRs.**
- docs/01 (`docs/01_Principles.md:21`) says "Measurements are units-aware". The length carries its unit and appears only where the unit is the metre. Nothing is reprojected (KNOWN-LIMITATIONS item 11, :139-144).
- ADR-010 rule 1 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:17-27`). The zoom means CSS pixels per unit of this dataset. It is paired only with the unit of the same `admitted`, because the store is `null` from the open until the new canvas reports (§2 item 3).
- ADR-010 rule 6 (:70-72): the bounds are declared (§7).
- ADR-006: no operation, no mutation and no Console row. The item is a display.

**Unchanged:**
- the wire, the kernel, the engine, the protocol, src-tauri and the renderer;
- `surfaceRegistry.ts`;
- every handle method and its behaviour.

## §2. The change

1. **`frontends/shell/src/layout/scaleBar.ts`** (new and pure):
   - It holds §7's constants, each with the thing it bounds.
   - `scaleReading(unit: CrsUnit, zoom: number | null)` returns one of `{kind:"none"}`, `{kind:"not-metre"}`, `{kind:"out-of-range"}` or `{kind:"bar"; mantissa: 1|2|5; exponent: number; widthPx: number}`.
     - `none` when `zoom` is null or not finite.
     - `not-metre` when `unit !== "metre"`.
     - Otherwise, the smallest m × 10^k with m × 10^k × 2^zoom ≥ SCALE_BAR_MIN_PX.
     - `out-of-range` when k lies outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX].
   - Since 5/2 = 2.5 and 60 × 2.5 = 150, the width stays below SCALE_BAR_MAX_PX.
   - `scaleLabel(mantissa, exponent)` builds the decimal from the digits, with no float arithmetic, in OPEN-4's format.
2. **`ScaleItem`** in `frontends/shell/src/layout/regionParts.tsx`, the home of the status items that compute (:12-17; the header's "two" becomes "three").
   - Props: `{ unit, subscribe, getBox, readZoom }`.
   - Its snapshot is a primitive: `getBox() === null ? null : readZoom()`. It is read with `useSyncExternalStore(subscribe, snapshot)`.
   - It renders:
     - nothing for `none`;
     - `.status-scale` holding S-3 or S-4;
     - or `.status-scale` holding `.status-scale-bar` (width `widthPx` px) and S-1, with S-2 as `title` and `aria-label`.
   - It has no `role="status"`, because it changes on every zoom and a live region would announce each change.
3. **`frontends/shell/src/App.tsx`.**
   - `readZoom = useCallback(() => canvasRef.current?.currentView?.()?.zoom ?? null, [])`.
   - The slot `"status.scale": admitted && <ScaleItem unit={admitted.describe.crs.unit} subscribe={viewBox.subscribe} getBox={viewBox.get} readZoom={readZoom} />`.
   - Nothing else changes.
4. **`frontends/shell/src/layout/contributions.ts`:** `STATUS_ITEMS` gains `{ id: "scale" }`, last (OPEN-6).
5. **`frontends/shell/src/styles.css`:** `.status-scale` and `.status-scale-bar` (a 2 px bar with end ticks), with no change to `.status-bar` (:159-171).
6. **`frontends/shell/src/canvas/WorkingCanvas.tsx:148`, comment only:** "Its product callers are `App.tsx`'s save and the status bar's scale item (`layout/regionParts.tsx`)."
7. **Strings. Drafts for the advisor; none is the human's.** Each goes in `scaleBar.ts` and is shown by `ScaleItem`.
   - S-1, the label: `{L} m (CRS)` (OPEN-2).
   - S-2, the title: "A length of {L} metres as the dataset's CRS counts them, at the map's current zoom. It is not a distance on the ground."
   - S-3: "No scale bar: this dataset's coordinates are not known to be in metres."
   - S-4: "No scale bar at this zoom."
   - Clause check:
     - "not known to be in metres" holds for `degree`, `other` and `unestablished` (`types.ts:105-114`; `geoparquet.rs:168-177`).
     - "at the map's current zoom" is the zoom of the last reported box (§0).
     - S-4 is shown exactly when k is out of range.
8. **KNOWN-LIMITATIONS, a new item at the next free number at the code base** (a draft for the advisor).
   - Title: "**The scale bar shows a length in the dataset's own metres, not a distance on the ground, and only for a dataset in metres.**"
   - Paragraph: "When the dataset's CRS names the metre on both axes, the status bar shows a bar and the length it spans on the map at the current zoom: 1, 2 or 5 times a power of ten metres, as the CRS counts them. A metre of a projected CRS is not a metre on the ground; how far apart they are depends on the projection and the place, and the app does not compute it (item 11). For a dataset in degrees, in another unit or in a unit not established, no bar is shown and the status bar says so. Below 0.001 or above 50,000,000 metres, no bar is shown. The bar's length has been checked on a display at 100% scaling only."
   - Its comment names `scaleReading`, `ScaleItem`, `currentView` and `viewportBbox.ts:16-23`.
   - The last sentence stands only if E-SCALE records `devicePixelRatio` 1. Otherwise it goes back to the advisor.
9. **Portability.** No OS-dependent feature. R-SC1 and the U tests run on every CI platform. E-SCALE and the operator Part run on Windows.

## §3. Fixtures and predicted outcomes

- E-SCALE (metre): `100k-happy-path.parquet`, the dataset open at the end of the suite (`frontends/shell/e2e/layout.mjs:31`, :572-574). Its hash is already recorded (:529, :575-577).
- E-SCALE (degree), under OPEN-5 (a): compat-corpus #8, `target\fixtures\compat-corpus\gdal\ogr2ogr-epsg4326-default.parquet`. Its sha256 must equal `MANIFEST.json`'s, which Part P (`frontends/shell/MANUAL-WALKTHROUGH.md:1478`) records.

| # | Zoom (by `e2eSetViewState`) | L | Width, CSS px | S-1 under OPEN-4 (a) |
|---|---|---|---|---|
| Z1 | 0 | 100 | 100 | `100 m (CRS)` |
| Z2 | -3 | 500 | 62.5 | `500 m (CRS)` |
| Z3 | 2.5 | 20 | 113.137 | `20 m (CRS)` |
| Z4 | -10 | 100,000 | 97.656 | `100,000 m (CRS)` |
| Z5 | 10 | 0.1 | 102.4 | `0.1 m (CRS)` |
| Z6 | -30 | k = 11 | — | S-4 |
| W | one wheel notch (`lib.mjs:642-645`), then the zoom read by `e2eReadWorkspace` (`App.tsx:1466-1477`) | by `scaleReading` | by `scaleReading` | exact |
| D | the degree file | — | no bar | S-3 |

Base: no `.status-scale` on any row. After: as in the table, with each width within 1 CSS px.

## §4. Tests, one mutation each

**P0.**
- Commit 1 adds three things:
  - `scaleBar.ts` with §7's constants, `scaleLabel`, and `scaleReading` that always returns `{kind:"none"}`;
  - `ScaleItem`, the slot and `STATUS_ITEMS`;
  - every test below, with E-SCALE.
- U-SB1 to U-SB4, R-SC1 and E-SCALE fail at their first bar or statement assertion. Each failure is recorded with the commit id.
- Commit 2 implements `scaleReading` and the comment at :148.

**U-SB1** (`frontends/shell/src/layout/scaleBar.test.ts`): `scaleReading picks the smallest 1-2-5 length whose bar is at least SCALE_BAR_MIN_PX`.
- px per unit 30 gives L 2, width 60.
- 29.999 gives L 5.
- 12 gives L 5, width 60.
- 11.99 gives L 10.
- Zooms 0, -3 and 2.5 give Z1 to Z3.
- M1: `≥` becomes `>`. Fails at 30.

**U-SB2:** `the bar is never shorter than SCALE_BAR_MIN_PX nor as long as SCALE_BAR_MAX_PX, and m is 1, 2 or 5`, a sweep of zoom from -9 to 20 in steps of 1/64.
- M2: 2 is dropped from the mantissas. Fails at the first width ≥ 150.

**U-SB3:** `scaleLabel writes the length's exact decimal in OPEN-4's format`. Cases: k = -3, -1, 0, 3, 5 and 7.
- M3: the exponent's sign is ignored for k < 0. Fails at k = -1.

**U-SB4:** `a bar only for metre; S-3 for degree, other and unestablished; nothing without a zoom; S-4 outside the exponent bounds`. Cases include NaN and ±Infinity.
- M4: `unit === "metre"` becomes `unit !== "degree"`. Fails at `other`.

**R-SC1** (new `frontends/shell/src/App.scale.test.tsx`, the real App with `App.save.test.tsx:39-120`'s mocked boundaries; its canvas stand-in keeps the report props and answers `currentView` from the test): `the scale item follows the box the canvas reports, at the zoom the canvas holds, for the dataset on the map`. Its cases:
- (i) nothing before a report;
- (ii) `onViewShown` at zoom 0 gives Z1;
- (iii) the zoom set to -3, then `onViewportChanged`, gives Z2;
- (iv) a second open of a degree describe shows nothing until its canvas reports, then S-3.
- M5: `ScaleItem` reads once and does not subscribe. Fails at (iii).

**E-SCALE**, the last step of `frontends/shell/e2e/layout.mjs` (:562-574), before FIXTURES. It runs Z1 to Z6, then W, then D. At each bar row it also checks that the item's rect lies inside `.status-bar`'s visible rect. It records `devicePixelRatio`.
- M6: App's `readZoom` returns 0. Fails at Z2.

Each mutation is observed by applying it, running the named test, recording the failure by name with its commit, and reverting it. A `verify-mutation` run is not an observation. E-SCALE's runs are the tester's, inside the machine's holds.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predictions:** P0 behaves as §4 says. Every test passes on the fix, and each mutation fails as §4 says.

**Declared unchanged:**
- the assertions of `StudioLayout.test.tsx`, which gains only the NO_SLOTS line;
- every other `App.*.test.tsx`;
- `WorkingCanvas.wiring.test.tsx`'s `currentView` cases (:399-482);
- `App.save.test.tsx`;
- layout.mjs's other steps.

**Invalidators:**
- I1 (stop): a zoom write is found that reaches none of the three reports. §0 is then wrong, and the form is re-drafted.
- I2 (stop): the build needs a handle method or any edit under `canvas/` beyond :148. That is a class 9 addition before its code.
- I3 (invalid run): a P0 test passes.
- I4 (invalid run): E-SCALE at P0 fails for any reason other than a missing `.status-scale`.
- I5 (stop): corpus #8's hash differs from the manifest's, or the file is absent.
- I6 (stop): a declared-unchanged test fails.

**Falsification:** the form is falsified if, after the fix, any of these holds:
- a metre dataset with a reported box shows no bar;
- a width lies outside [60, 150) or differs from L × 2^zoom by more than 1 px;
- a non-metre dataset shows a bar;
- a length is shown with another dataset's unit.

## §6. Instruments

- Assertions only: DOM text, widths and rects, the hook answers, and `devicePixelRatio`.
- `verify-cites`, `verify-quotes`, `verify-test-claims` and `verify-mutation`, each named with the tool's commit.
- Measurements: none.

## §7. Declared values and ceilings

| Constant (`layout/scaleBar.ts`) | Value | Bounds |
|---|---|---|
| SCALE_BAR_MIN_PX / SCALE_BAR_MAX_PX | 60 / 150 | the bar's CSS width, [min, max) |
| SCALE_EXPONENT_MIN / SCALE_EXPONENT_MAX | -3 / 7 (OPEN-3) | L from 0.001 to 50,000,000 |
| Mantissas | 1, 2, 5 | the length's leading digit |

**Size:** at most 760 changed lines, insertions plus deletions, over at most 10 counted files. Each file's ceiling:

| File | Lines, at most |
|---|---|
| `scaleBar.ts` (new) | 90 |
| `regionParts.tsx` | 45 |
| `App.tsx` | 20 |
| `contributions.ts` | 3 |
| `styles.css` | 25 |
| `WorkingCanvas.tsx` (comment) | 3 |
| `scaleBar.test.ts` (new) | 180 |
| `StudioLayout.test.tsx` | 2 |
| `App.scale.test.tsx` (new) | 240 |
| `e2e/layout.mjs` | 150 |

Outside the count, declared:
- `frontends/shell/e2e/README.md` ≤ 20;
- `KNOWN-LIMITATIONS.md` ≤ 10;
- `frontends/shell/MANUAL-WALKTHROUGH.md` ≤ 45.

Counting: `git diff --numstat <merge-base>...<head> -- frontends/shell ':!frontends/shell/MANUAL-WALKTHROUGH.md' ':!frontends/shell/e2e/README.md'`, at a named commit. `<merge-base>` is taken against the base branch §9 names.

An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. A diff outside §7's files, this form, PLAN and the records.
2. A new or changed handle method, or any edit under `canvas/` beyond the comment at :148.
3. A dependency, lockfile, workflow, wire, kernel, engine or src-tauri change.
4. A bar for a unit other than `metre`; a ratio; the word "ground" anywhere but S-2's negation.
5. A zoom paired with a unit from another `admitted`; the snapshot read while the box is `null`.
6. `useSyncExternalStore` or zoom state in App itself, which would render App on a pan.
7. A timer, an await or a `role="status"` in `ScaleItem`.
8. A string beyond §2 items 7 and 8, or a draft landed before the advisor's words.
9. An export, prop or callback without a product caller.
10. A declared-unchanged test's assertions edited.
11. A `verify-mutation` run called an observation; a mutation without its commit.
12. A §7 overrun not recorded as class 8, or §7 edited.
13. A line cite into `governance/DECISIONS-PENDING.md`; a hash at a branch commit; a bare self-line.
14. A merge before the tag without the human's word; a squash or a rebase merge.

## §9. Gates

**The architect reads:**
- §0's departures and OPEN-1;
- docs/01 :21 and ADR-010 rules 1 and 6 against §2 items 1 to 3;
- the seam rule for each interface below;
- the caller rule for `scaleReading`, `scaleLabel`, `ScaleItem` and `readZoom`;
- §8, item by item.

**The reviewer reads:**
- the full diff;
- P0 and the six mutations, observed again;
- the §7 count;
- §2 item 7's clause checks.

**Seams, each against its actual interface.** The end-to-end test is E-SCALE, through the real app.
- `currentView?()` (`WorkingCanvas.tsx:150`; body :1640-1644).
- The three report props (:571-578, :599) and their call sites (§0).
- `createViewBoxStore`'s `get` and `subscribe` (`FeaturePanel.tsx:20-40`).
- `CrsUnit` (`types.ts:114`).
- `STATUS_ITEMS` and `Slots` (`contributions.ts:50-56`, :71-84) and the footer (`StudioLayout.tsx:456-460`).
- `e2eSetViewState` (used as at `e2e/export-view.mjs:126`), `doWheel` (`lib.mjs:642-645`) and `e2eReadWorkspace` (`App.tsx:1466-1477`).

**Overlap. Shared paths with held or filed pieces:**
- `frontends/shell/e2e/README.md`: PR 359 and the re-link.
- `KNOWN-LIMITATIONS.md`: PR 358 and the re-link, in a new item only.
- `frontends/shell/MANUAL-WALKTHROUGH.md`: the re-link.
- `App.tsx`, `styles.css`, `WorkingCanvas.tsx` and `src/layout/` (`contributions.ts`, `regionParts.tsx`, `scaleBar.ts`, `scaleBar.test.ts`, `StudioLayout.test.tsx`): milestone 5's form. `App.tsx` is also in the recovery offer's form. Neither is built, so the order goes to whichever is built first.
- `e2e/layout.mjs`: possibly milestone 5's e2e suites, which are not named.
- By ADV-2026-11-23-15 item 4, the build is on the re-link's head (`cut/relink-after-refusal`), which carries PR 353, 358 and 359. The merge follows the re-link's merge.

**Suites, green before either gate:**
- the shell's format check, typecheck and tests;
- the four verify scripts and `verify:plan`;
- CI's `node --test` scripts suite;
- `layout.mjs` with E-SCALE, as a tester's series;
- the branch's CI, read before gating.

**Operator.** Ordinary use reaches the scale, so a new Part is committed at the next unused letter at the code base, with a blank result log. Its rows, in sketch (the words go to the advisor):
- 0: read §10, the last amendment first.
- 1: open `filter-zoned.parquet` and zoom with the wheel. The length steps 1, 2, 5, and the bar stays about 60 to 150 px. Felt: is it clear that this is the CRS's metres, not the ground?
- 2: open corpus #8. S-3 shows, and no bar.
- 3: at 1366 × 768 with every status item showing, the scale stays visible.
- 4: the P6 sight of S-1 to S-4.

## OPEN questions

- **OPEN-1, the read.** (A) The existing `currentView?()`, with no new method and only a comment edit under `canvas/`. Recommended. (B) Milestone 3's `cssPixelsPerUnit()`, a fourth exception. The ruled shape was the human's (OPEN-7 (c)). The advisor says whether (A) needs the human's word.
- **OPEN-2, S-1 and S-2.** (a) `{L} m (CRS)` with S-2 as the title. Recommended. (b) `{L} CRS metres`. (c) `{L} m` alone. Not recommended, because it reads as a distance on the ground.
- **OPEN-3, the bounds.** (a) k in [-3, 7], with S-4 outside them. Recommended (ADR-010 rule 6). (b) No bound, with an exponent written out.
- **OPEN-4, the number format.** (a) Groups of three joined by ",", a fixed rule and never the locale, as KNOWN-LIMITATIONS writes numbers (item 51). Recommended. (b) No grouping.
- **OPEN-5, the degree half of E-SCALE.** (a) Corpus #8, hash-checked, with I5 on absence. Recommended. (b) The degree case only in R-SC1 (iv) and the Part.
- **OPEN-6, the item's place.** (a) Last in `STATUS_ITEMS`. Recommended. (b) First.
- **OPEN-7, the form's path.** Recommended: `governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md`.

## §10. Amendments (opens empty, append-only; classes 1 to 9)

## Amendment 1 — 2026-11-23 — at the first commit: the authority on main, the node's gate, the span hashes, the OPEN items

*Written by the custodian at the form's first commit, before any code and before any gate. References and hashes only.*

1. **Authority on main.** The human's message of 2026-11-23 is filed at `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, and the advisor's ruling ADV-2026-11-23-15 at `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-15-the-humans-message-filed-the-relink-built-now-on-three-held-heads-two-forms-now-the-gap-pieces-the-sitting-hour.md`. The draft is filed at `state/consults/2026-11-23-shell-scale-display-architect-draft.md`.
2. **The node's gate.** In the same commit the PLAN node `shell-scale-display` names this form as its gate. Its class is full, with both gates, by ADV-2026-11-16-06 item 2 (a), as its §1 says. The path is the one its OPEN-7 recommends.
3. **Span hashes.** Every `path:line` cite above is read at 0bcf543452af79df6251cc7d86ab9f2cf644fcc2. Each entry below names the file and lines a cite is read as, the sha256 of those lines at that commit (each line with its LF, computed by script), and the sections that cite it. A short name is read as the one tracked file it names; a bare `:n` as the file named before it in the same passage; an entry marked (r) was read by the custodian against the file its sentence or list names.

- `governance/PLAN.yaml:5416-5432` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4a41837f04b80885e80a128edcfe9b804e6fae525501e356815ea9f30ffafb25 — the header
- `state/directives/2026-10-11-merges-210-211-pilot-recorder-2f-milestone-3-rulings.md:25` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1bb6ac1989e4797a03e5dfd20d9f3015611910b2e0b19b3f1efaa2f9effb75e2 — the header
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:276-281` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:790e15fa5deda4d78dd9d75f7b41d6b5bcbcfe4035281dd4f7123896ff89e5f5 — the header; as written `:276-281` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:301` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4dfb0c7639f0ca9c363a901dac0bfcdb13b9a015e2ce141f0e3235c292f9339a — the header; as written `:301` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:334` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8c4a5cd779c042e0361f140335c5708c23e317910173214c1991eb7a1d8b5887 — the header; as written `:334` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:472` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7647b84de3c6030e647cdab885dbed6a69bd5125f3db2cacce369adc18ba2700 — the header; as written `:472` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:494` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:6b36ad9f97448daf388cf61f82e01cfc1b940e74ed13407474089c1e71e7925d — the header; as written `:494` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:587` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2dd55a9370686e5415c2be66f6e4d6978c92f0dd1271d1aaf2fc551792e15cdd — the header; as written `:587` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:150` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d86b463250ffb0ee17601829950fbf8e57e05cbe8258befb39c5e4f4e8eccb1e — §0, §9; as written `WorkingCanvas.tsx:150`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:145-149` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:dc4c789e6c6d3ef87dd383fcf36f7c271663522d25802af5543ad453ff49b657 — §0; as written `:145-149`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1640-1644` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:5bb24ce4bb02abee122d5c12fa749fb7c74aa01ba155b31a09d7f5eab486c881 — §0, §9; as written `:1640-1644`
- `frontends/shell/src/canvas/viewportBbox.ts:16-23` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9039376f9697a5defe84cf8cc350e74827dad527bc289bffd84424750da14828 — §0, §1, §2; as written `viewportBbox.ts:16-23`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:607-613` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7db079f62472bd145439421123a3d5eca1b7e56d624cf13a2c20c8917ace76e4 — §0; as written `WorkingCanvas.tsx:607-613`
- `frontends/shell/src/App.tsx:1475` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f05efb1f1050d59a94b373e2e40675538bbe4615aba088967e3352a5a65da934 — §0
- `frontends/shell/src/App.tsx:2190` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:a7b1ae381490ee107cfcbca84ad18971f0eece646f7669f642ffcab7dcc3514d — §0; as written `:2190`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:148` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:ba148574b2f205e6d489159bc8d699652cc173220963bbe4f9a47d9df4fb08fe — §0, §2, §4, §5, §8; as written `:148`, `WorkingCanvas.tsx:148` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1442` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3e8803d41ecee52f8bbae5f149c95ec5c4312d93b09efdffe7a6aa08a566a7ac — §0; as written `:1442` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1453` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:efa4c701adca75f6159e8915a822f36971deb8d6a8408b1dddc3b2100d5fe1d3 — §0; as written `:1453` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1458` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bed54217f16955b0f2b9c0a4d84ca0992b0250ad55d1d3325d4135bea5926cd4 — §0; as written `:1458` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1646-1650` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d1da1acc724510ba996761da20d03dc0db23bf55393e09380cdb209b3d30d09c — §0; as written `:1646-1650` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2169` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d3a2c4f75c4992e18a038f56b6248f3411e54c1375e1957818ea50814e50b5f2 — §0; as written `:2169` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2 — §0; as written `:2200-2210` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2407` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b962592dc52c9cae1f68df8c093052666340a781c4207f58601aede582ca10a6 — §0; as written `:2407` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2411` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0e55e1533e335865443e9d4e4d3730f073210a09c57e79c133a51d7c096812eb — §0; as written `:2411` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:835c7ccada0359ef52dc635ce28149d04da8e59e886de28dff9f3c3fec43576d — §0; as written `:2116-2127` (r)
- `frontends/shell/src/App.tsx:2362-2364` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:865844271ffb755e59a5d7b8c6a81eb47a73c1c82bd35dbd8f83247e43966415 — §0; as written `App.tsx:2362-2364`
- `frontends/shell/src/App.tsx:2388` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:dbd5746b99c9f22a6634ddc26f3072af8ca298f74eca887f274fe3f4b223529b — §0; as written `:2388`
- `frontends/shell/src/App.tsx:2428-2446` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:cb1fd3b7db226cff9314c8a3086f630471c44ff6300078c81c8749cb90f03fd1 — §0; as written `:2428-2446`
- `frontends/shell/src/feature/FeaturePanel.tsx:20-40` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1045c4cbba2fca2e724f10290546c1b1ac200d96911dc65eda4c6e14b69f8110 — §0, §9; as written `FeaturePanel.tsx:20-40`
- `frontends/shell/src/App.tsx:1176-1177` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b55fc96fae17f9c179ae831378b89749feab26b87f207fa3e2b6b6e62efa1590 — §0; as written `App.tsx:1176-1177`
- `frontends/shell/src/skp/types.ts:105-114` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9344af46244ca7331b426417438581de3928c6d9f31cd768f9e11f06b81b945f — §0, §2; as written `types.ts:105-114`
- `engine/src/geoparquet.rs:168-177` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b6249a8104d74ae031b523883082ee24d2f00213fe8c2748cb7d73eab19b8bca — §0, §2; as written `geoparquet.rs:168-177`
- `frontends/shell/src/canvas/tileGrid.ts:320` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:91f02646865f555a2621e17ec96429b16c75c1acabd5991b3d6f7f8b067e0e16 — §0; as written `tileGrid.ts:320`
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:277` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:c137ec12806cb25c661799b6aa34c0c64d2cd17299c41efafabce446ecc099ff — §0; as written `:277` (r)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md:279` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:de4a1b999bee098ee7e7c0c002433fd0b058d456ce66da2bd75320555047f425 — §0; as written `:279` (r)
- `frontends/shell/src/feature/FeaturePanel.tsx:13-19` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:7ca74ba45496e098f11569622328ed2daca8c88f997e79a744637891b8770b4e — §0; as written `FeaturePanel.tsx:13-19`
- `frontends/shell/src/feature/FeaturePanel.tsx:98` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:856199be06202956e0c7ecaa77ab86ac6e68d37af0e482ec0ce404843707e5c9 — §0; as written `:98`
- `frontends/shell/src/layout/StudioLayout.tsx:456-460` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5 — §0, §9; as written `StudioLayout.tsx:456-460`
- `frontends/shell/src/layout/StudioLayout.test.tsx:23-42` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1b856adc213558341faff169d216c180a6363649856a9e123941369eb3e9fd8c — §0; as written `StudioLayout.test.tsx:23-42`
- `frontends/shell/src/layout/contributions.ts:80-84` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:b72904c2f31872b672fe5d5f2d91117eb4e9b1dcefdfa49e11a05b49139f9078 — §0; as written `contributions.ts:80-84`
- `frontends/shell/src/App.tsx:2356-2358` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d9b9c4244f09bdd699c963255ead45a3fe586aeed84b786ccde05e5c5bded086 — §0; as written `App.tsx:2356-2358`
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:25` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f089d4fe0c367cc2935001f30ce19fb2f040b87fe6b4f4ed8cc34a8992b2f1a9 — §1
- `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md:26` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:59892aa3a058fc966b9d8089bf7ccad1387af0ae7507944bdf98bcb6cdee59a9 — §1; as written `:26`
- `governance/AUTONOMY.md:327` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:d80649bedfea2f8ac48948d94ca0d4b3f629fb1a5e3c407b5d01bae98e390a95 — §1; as written `:327` (r)
- `governance/AUTONOMY.md:351` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3f17cae50c0502e52d03294d4dac15a91121763094a4f913cd2e2d020f4c46cc — §1; as written `:351` (r)
- `docs/01_Principles.md:21` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:864a63a14b42bca0756831053f140bd45f98b90f914bb58399eaa65897c15f9c — §1, §9; as written `:21` (r)
- `KNOWN-LIMITATIONS.md:139-144` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f22206e01a5fa233594ea7c11f2ae9999715596275085746fc35201f9262c5bd — §1; as written `:139-144` (r)
- `docs/adr/ADR-010-render-frames-origins-boundaries.md:17-27` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:73dee6ea56400ce37ca93f0349461ebaa78feb8a4471513ed89a1a8a89713378 — §1
- `docs/adr/ADR-010-render-frames-origins-boundaries.md:70-72` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:0ab685667cc219d003c6654139e8abb5af4ab7f0d8c020ebe6f469b5ed381a17 — §1; as written `:70-72`
- `frontends/shell/src/layout/regionParts.tsx:12-17` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:9b547ec042fe2ff46d00e5eba711c28aa89f34e66179fa710d5467741d9731c7 — §2; as written `:12-17` (r)
- `frontends/shell/src/styles.css:159-171` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f41bbf56b22a8acd2d7a6d9e9bf0f08d4795493724b38474b503ffbf684faba0 — §2; as written `:159-171` (r)
- `frontends/shell/e2e/layout.mjs:31` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3213a4df50505009b4ee74dd02c8196667658d5be132257d25dfba6cc2079dbc — §3
- `frontends/shell/e2e/layout.mjs:572-574` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:860225d0e1bc1082bdfb5391d53daed2d161a4b8d5506213bbee3c5c8b1ca00f — §3; as written `:572-574`
- `frontends/shell/e2e/layout.mjs:529` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f00934bc1217c03af08a6a54e0ace91d6ce7bd1d81c7e61183f3a6ef74666b78 — §3; as written `:529`
- `frontends/shell/e2e/layout.mjs:575-577` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:8a332348d2d29ca8bbb113c7aa4e29cb38463da18860d17eb412a9f1465c2cec — §3; as written `:575-577`
- `frontends/shell/MANUAL-WALKTHROUGH.md:1478` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:bd0d7299ebae0675c48e6d126cd8ccee00e3c03afc2dd0f74685cc5f59c1f244 — §3
- `frontends/shell/e2e/lib.mjs:642-645` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:be5c21d1be8ea5342d935d1de018c7a916e141f63f7dd17b826d0ffc74346bdd — §3, §9; as written `lib.mjs:642-645`
- `frontends/shell/src/App.tsx:1466-1477` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:f87c82d85d07d6905cd706f5c5d278bebcacc0e76d366af411052df931730586 — §3, §9; as written `App.tsx:1466-1477`
- `frontends/shell/src/App.save.test.tsx:39-120` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:4de77d533f496eeafd8d1fc7bdff900b47da2136b810b0a6af3711c3a108b53b — §4; as written `App.save.test.tsx:39-120`
- `frontends/shell/e2e/layout.mjs:562-574` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fb3abf3b7601ce07b94ace533067a9c7dd8178b4464e7b12a4bfc8ee3811764b — §4; as written `:562-574` (r)
- `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx:399-482` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1dd4c58061a262f93ffbdc9bbf93d92db027d0b7ddb173086f23fa2d7353bdd1 — §5; as written `:399-482` (r)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:571-578` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:fb125f2c3f9efa1e139ce3bb2cccb18892cf04471e09e2997cb36e5dfaebbae6 — §9; as written `:571-578`
- `frontends/shell/src/canvas/WorkingCanvas.tsx:599` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:68f34a436c2fff82dee1cc41a6e9926c59970e3e56fc4fd1891920072b1fb698 — §9; as written `:599`
- `frontends/shell/src/skp/types.ts:114` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:3ad9047cd2c33d90b22f6f38a3df37947374c7f7b166a96c6d81e2c3139d61dc — §9; as written `types.ts:114`
- `frontends/shell/src/layout/contributions.ts:50-56` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:db972a32df2cf51c96750d865b2725296294c845e582d826e86e3da4bcb6df67 — §9; as written `contributions.ts:50-56`
- `frontends/shell/src/layout/contributions.ts:71-84` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:2adb6a16b7253f1c506f6aa07d7ae5b347ab5e3942aca4cf0a747b887d56312a — §9; as written `:71-84`
- `frontends/shell/e2e/export-view.mjs:126` @ 0bcf543452af79df6251cc7d86ab9f2cf644fcc2 sha256:1638427e77aab584d3a5074ef87c77258d2da9704cb4e1580c63e459616a91c1 — §9; as written `e2e/export-view.mjs:126`

4. **OPEN items.** OPEN-1 to OPEN-7, the strings S-1 to S-4 and the KNOWN-LIMITATIONS draft (§2 items 7 and 8), and the note's question whether OPEN-1 (A), which departs from the shape the human ruled at milestone 3's OPEN-7 (c), is the advisor's to rule or the human's go to the advisor in one message (ADV-2026-11-23-15 item 8). Their answers come as later amendments; the gates do not wait for them.

Read the last amendment first.

Nothing above is edited.

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

## Amendment 3 — 2026-11-23 — the custodian's, at the commit that files Amendment 2: references only

*Written by the custodian at the commit that files Amendment 2, before any code. References only.*

1. Amendment 2 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-shell-scale-display-amendment-2-architect-draft.md` (the hand-back's sha256 014d5ed7f89ca06cd18961951764e07f9ac1c98de72b153d4d40fa9a637842c8): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 1, FAIL: `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md` (gate-log row 864).
3. Its cites are read at b42c0ed72a8a94885bdd1f057c5c7463e5127a0e. Its sentence that the custodian adds sha256 values by script is not acted on: no hashes are added here. The architect's attempt 2 reads each cite at its own commit, and the form's re-sweep binds before code.
4. The points it could not settle (the consult's note after its end mark) go to the architect's attempt 2, and those that are rulings go to the advisor.
5. Next: the architect's form gate, attempt 2, on Amendment 2. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.

## Amendment 4 — 2026-11-23 — post-result amendment after the architect's form gate, attempt 2 (FAIL), and ADV-2026-11-23-19: E5, the documentation findings, the display-scaling question and the rulings

*Post-result amendment (class 1): written after the outcome of the architect's form gate, attempt 2 (FAIL), and the advisor's ruling ADV-2026-11-23-19 were seen. Written before any code.*

1. **Basis.**
- The gate report is `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect-attempt-2.md`, cited by finding id.
- The ruling is ADV-2026-11-23-19, cited by item. It is the advisor's ruling under the human's delegation of 2026-11-13, not the human's words. The custodian adds its filed path.
- Every `path:line` this amendment adds is read at a846072d4be622ade7356d36bccd13c346ffa34a, which is on main. Item 9 lists these pins.
- Nothing was run.
- Each Old text below occurs once in this form above this amendment, Amendments 2 and 3 included. Where an Old text is part of a longer line, only that part is replaced.

2. **The rulings (ADV-2026-11-23-19).**
- OPEN-1: (A), the existing `currentView?()`, with no new method and only the comment edit under `canvas/` (item 1). The advisor's reason why this does not need the human's word: (A) keeps every other part of the shape the human ruled at milestone 3's OPEN-7 (c) and narrows it by one exception under `canvas/`. That is a scope change to a thing the human ruled, and the grant's item 2 gives such changes to the advisor. The advisor tells the human.
- OPEN-2: (a), `{L} m (CRS)`, with S-2 as the title. (c) is refused, because a bare length in metres reads as a distance on the ground (item 2).
- OPEN-3: (a), k in [-3, 7], with S-4 outside it (item 3). OPEN-4: (a), groups of three joined by commas, never the locale (item 4). OPEN-5: (a). OPEN-6: (a), last in the status bar. OPEN-7: the path as taken (item 5).
- S-1 to S-4 and the KNOWN-LIMITATIONS item stay drafts (item 6). They are built under the placeholder mark, as ADV-2026-11-23-16 item 10 sets out. The advisor words them from the filed text after this form's gate has passed and before the build's words commit.

3. **Item 7, the display-scaling question: no.** E-SCALE cannot run again at a forced scale factor other than 1 without either a change to the launch that another suite would feel or a factor that is not a real display scaling. The reasons, from the code:
- **The only argument that reaches the browser is shared.**
  - WebView2 ignores the `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` variable under wry. Browser arguments reach it only through the window config's `additionalBrowserArgs` (`frontends/shell/e2e/lib.mjs:16-25`).
  - The suites set that config in one place, `writeConfigOverlay` (`frontends/shell/e2e/lib.mjs:97-114`). `frontends/shell/src-tauri/tauri.conf.json` sets no such key and no scale (searched).
  - Every suite that launches through `attachOrLaunch` writes and uses that same overlay (`frontends/shell/e2e/lib.mjs:169`, `frontends/shell/e2e/lib.mjs:193-200`). E-SCALE's suite is one of them (`frontends/shell/e2e/layout.mjs:540`).
  - The merged config is compiled into the dev binary (`frontends/shell/e2e/lib.mjs:92-93`).
  - So a scale argument added there would be felt by any later suite that attaches to the running app (`frontends/shell/e2e/lib.mjs:158-167`). It would also be felt by `attachSecondApp`, which runs that same debug exe with its compiled config (`frontends/shell/e2e/lib.mjs:316-318`, `frontends/shell/e2e/lib.mjs:325`).
  - No record in the tree shows that WebView2 honours a scale argument passed this way.
- **The in-session mechanism is not a display scaling.**
  - CDP `Emulation.setDeviceMetricsOverride` needs no launch change, and the suites already use it and clear it (`frontends/shell/e2e/layout.mjs:264`).
  - In this WebView2, its `deviceScaleFactor` was measured to move `window.devicePixelRatio` to 1.25 and 1.5 while the drawing buffer's ratio stayed at 1.000 (`governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:202-205`). A second report saw the same (`state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md:42`).
  - The pan-anchor form committed in advance not to record such an override as a second DPR (`governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:64-67`).
  - E-SCALE asserts CSS widths and DOM text computed from the camera's zoom (§2 item 1), and the override changes neither. A run under it would pass while showing nothing about a scaled display.
- **So, as item 7 rules for this case:** the operator Part gains one row at the human's own display scaling, and §2 item 8's last sentence stays. The precedent is milestone 2's Part W row (`governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1377`).

Addition to §9, Operator, after the row `- 4: the P6 sight of S-1 to S-4.` (a sketch; the words go to the advisor):
````text
- 5: at your own display scaling (record the percentage Windows shows for Scale), open `100k-happy-path.parquet` (`frontends/shell/MANUAL-WALKTHROUGH.md:146`) and zoom with the wheel until the label reads 200 m. Mark the bar's two ends on the edge of a sheet of paper held to the screen, lay the marks across the map, and count the parcels between them. The parcels are 40 m apart (`frontends/shell/e2e/pan-anchor.mjs:47-50`; `engine/src/fixture.rs:93`), so the marks are five parcels apart, within half a parcel. Record the percentage and the count. Red: fewer than four and a half or more than five and a half (I7).
````
- Check. The 200 m bar exists while 0.3 ≤ 2^zoom < 0.6, a band one zoom unit wide. One notch adds about 0.93 (P5 in item 8), so some notch lands inside the band. A bar wrong by the ratio of a 125% or 150% scaling would span about 4 or 6.25 parcels, or about 3.3 or 7.5. Each of these is red.

Addition to §5, Invalidators, after I6:
````text
- I7 (stop): row 5 of the operator Part is red. The bar would then show the user a wrong length at that display scaling; the result goes to the advisor (ADV-2026-11-23-19 item 7), whenever the row is run.
````

4. **E5, one unit check and a bounded search.** These are the gate's words, with one sentence of mine added to the first New text: the one about the return type. The gate's clause check (E5) holds against the code at a846072d (`frontends/shell/tsconfig.json:16`; `frontends/shell/src/project/openProject.ts:143`; P19 and P20 in item 8).
- The added sentence is there because Amendment 2 item 2's P0 stub returns `{kind:"none"}`, and a return type narrower than `scaleReading`'s would not type-check that stub.
- At 0 and Infinity, the guard on `pxPerUnit` and the bounded search give the same answer, `out-of-range`. A mutation that removed the guard would survive, so none is named for it. The added U-SB4 cases prove the outcome, not the guard.
````text
Otherwise, `readingAtPxPerUnit(unit, 2 ** zoom)`: the smallest m × 10^k with m × 10^k × pxPerUnit ≥ SCALE_BAR_MIN_PX, and `widthPx` is that same product. `readingAtPxPerUnit` is pure and exported. Its product caller is `scaleReading`, and U-SB1 also calls it at exact pixels per unit (Amendment 2, item 4).
````
````text
Otherwise, `readingAtPxPerUnit(2 ** zoom)`. It returns `out-of-range` when `pxPerUnit` is 0 or not finite, or when the smallest m × 10^k with m × 10^k × pxPerUnit ≥ SCALE_BAR_MIN_PX has k outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX]; otherwise that bar, with `widthPx` that same product. Its search is bounded by those exponents, so it ends for every input. It takes no unit: the unit is checked once, by `scaleReading`'s `not-metre` case above. It returns the same type as `scaleReading`, so the P0 stub's `{kind:"none"}` type-checks. `readingAtPxPerUnit` is pure and exported. Its product caller is `scaleReading`, and U-SB1 also calls it at exact pixels per unit (Amendment 2, item 4).
````
````text
- The comparison is made by a pure exported `readingAtPxPerUnit(unit, pxPerUnit)` in `scaleBar.ts`
````
````text
- The comparison is made by a pure exported `readingAtPxPerUnit(pxPerUnit)` in `scaleBar.ts`
````
````text
`readingAtPxPerUnit(…, 30)` returns `none`
````
````text
`readingAtPxPerUnit(30)` returns `none`
````
````text
Cases include NaN and ±Infinity.
````
````text
Cases include NaN and ±Infinity, and zoom 1100 and -1100, where `2 ** zoom` is Infinity and 0, which give S-4.
````
The S-4 clause check in §2 item 7 follows E5:
````text
S-4 is shown exactly when k is out of range.
````
````text
S-4 is shown exactly when `scaleReading` returns `out-of-range`: k is outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX], or the zoom is finite and `2 ** zoom` is 0 or Infinity (Amendment 4, item 4).
````

5. **D7, the float caveat.** The gate's words.
````text
At any other zoom, 2^zoom is irrational.
````
````text
At any other zoom, 2^zoom is irrational in exact arithmetic; that the rounded floating-point product never equals 60 is not shown.
````
````text
M1 does pass U-SB2, because the sweep never reaches equality (item 4).
````
````text
M1 is expected to pass U-SB2, since the sweep is not shown to reach equality (item 4).
````

6. **D8, the 0.93 cite.** The gate's words. Checked: the figure 0.93 is on `frontends/shell/e2e/regression.mjs:730`, and the sentence that states it runs from :729.
````text
one notch adds about 0.93 to the zoom (`frontends/shell/e2e/regression.mjs:729`)
````
````text
one notch adds about 0.93 to the zoom (`frontends/shell/e2e/regression.mjs:729-730`; the readouts measured at :730-731 agree)
````
````text
- `frontends/shell/e2e/regression.mjs:729`
````
````text
- `frontends/shell/e2e/regression.mjs:729-731`
````

7. **D9, W's label assertion.** The gate's words. Checked: S-1 is `{L} m (CRS)` (§2 item 7), and `scaleLabel` builds only the decimal (§2 item 1).
````text
that the label and the width (within 1 CSS px) equal `scaleLabel` and `scaleReading` at that zoom
````
````text
that the label is S-1 with `scaleLabel`'s decimal for `scaleReading`'s mantissa and exponent at that zoom, and the width is that reading's `widthPx` within 1 CSS px
````

8. **D10, the pins of Amendment 2 items 1 and 12.**
- Each pin below is `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`. That commit is on main.
- The custodian's Amendment 5 is filed with this amendment. It carries each pin's sha256 under its id, computed by script over the cited whole lines with LF, and the reviewer recomputes each one.
- This amendment writes no sha256.
- P5 to P7 are the spans as D8 amends them.
- P26 to P29 are item 1's pins that item 12's list leaves out (item 7's prose and its New text).
````text
Item 12 lists each pin, and the custodian adds each sha256 by script before the commit.
````
````text
Item 12 lists each pin; each pin's sha256 is in Amendment 5, the custodian's, under the pin's id in Amendment 4's item 8, computed by script and recomputed by the reviewer.
````
````text
Pins, each `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`, with each sha256 added by the custodian's script:
````
````text
Pins, each `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`; each sha256 is in Amendment 5, under the pin's id in Amendment 4's item 8:
````

| Id | Pin (@ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e) | Cited by Amendment 2 |
|---|---|---|
| P1 | `frontends/shell/src/canvas/WorkingCanvas.tsx:2409` | item 5 |
| P2 | `frontends/shell/e2e/lib.mjs:618` | item 5 |
| P3 | `frontends/shell/e2e/layout.mjs:26` | item 5 |
| P4 | `frontends/shell/e2e/tsModuleLoader.mjs:77-80` | item 5 |
| P5 | `frontends/shell/e2e/regression.mjs:729-730` | item 5, as D8 amends it |
| P6 | `frontends/shell/e2e/regression.mjs:730-731` | item 5, as D8 amends it |
| P7 | `frontends/shell/e2e/regression.mjs:729-731` | item 12, as D8 amends it |
| P8 | `frontends/shell/src/canvas/WorkingCanvas.tsx:2169` | item 5 |
| P9 | `frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210` | items 5 and 9 |
| P10 | `frontends/shell/src/App.tsx:1475` | item 5 |
| P11 | `frontends/shell/src/App.tsx:2388` | item 6 |
| P12 | `frontends/shell/src/App.tsx:2362-2364` | item 6 |
| P13 | `frontends/shell/src/feature/FeaturePanel.tsx:13-19` | item 6 |
| P14 | `frontends/shell/src/App.tsx:2438` | item 6 |
| P15 | `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:90` | item 7 |
| P16 | `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:96` | item 7 |
| P17 | `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:121` | item 7 |
| P18 | `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:293-319` | item 7 |
| P19 | `frontends/shell/src/App.tsx:1836` | item 9 |
| P20 | `frontends/shell/src/App.tsx:2034` | item 9 |
| P21 | `frontends/shell/src/canvas/WorkingCanvas.tsx:1646-1650` | item 9 |
| P22 | `frontends/shell/src/canvas/WorkingCanvas.tsx:1458` | item 9 |
| P23 | `frontends/shell/src/canvas/WorkingCanvas.tsx:1591` | item 9 |
| P24 | `frontends/shell/src/canvas/WorkingCanvas.tsx:1819` | item 9 |
| P25 | `frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127` | item 9 |
| P26 | `frontends/shell/src/canvas/WorkingCanvas.tsx:193` | item 7 (prose) |
| P27 | `frontends/shell/src/canvas/WorkingCanvas.tsx:1660-1664` | item 7 (prose and New text) |
| P28 | `frontends/shell/src/canvas/WorkingCanvas.tsx:164-193` | item 7 (New text) |
| P29 | `frontends/shell/src/canvas/WorkingCanvas.tsx:148` | item 7 (New text) |

9. **This amendment's own pins.** Each is `path:line @ a846072d4be622ade7356d36bccd13c346ffa34a`, which is on main. Amendment 5 carries each one's sha256 under its id, by the same script, and the reviewer recomputes them.

| Id | Pin (@ a846072d4be622ade7356d36bccd13c346ffa34a) | Cited by Amendment 4 |
|---|---|---|
| Q1 | `frontends/shell/e2e/lib.mjs:16-25` | item 3 |
| Q2 | `frontends/shell/e2e/lib.mjs:92-93` | item 3 |
| Q3 | `frontends/shell/e2e/lib.mjs:97-114` | item 3 |
| Q4 | `frontends/shell/e2e/lib.mjs:158-167` | item 3 |
| Q5 | `frontends/shell/e2e/lib.mjs:169` | item 3 |
| Q6 | `frontends/shell/e2e/lib.mjs:193-200` | item 3 |
| Q7 | `frontends/shell/e2e/lib.mjs:316-318` | item 3 |
| Q8 | `frontends/shell/e2e/lib.mjs:325` | item 3 |
| Q9 | `frontends/shell/e2e/layout.mjs:540` | item 3 |
| Q10 | `frontends/shell/e2e/layout.mjs:264` | item 3 |
| Q11 | `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:64-67` | item 3 |
| Q12 | `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:202-205` | item 3 |
| Q13 | `state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md:42` | item 3 |
| Q14 | `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1377` | item 3 |
| Q15 | `frontends/shell/MANUAL-WALKTHROUGH.md:146` | item 3 (row 5) |
| Q16 | `frontends/shell/e2e/pan-anchor.mjs:47-50` | item 3 (row 5) |
| Q17 | `engine/src/fixture.rs:93` | item 3 (row 5) |
| Q18 | `frontends/shell/tsconfig.json:16` | item 4 |
| Q19 | `frontends/shell/src/project/openProject.ts:143` | item 4 |
| Q20 | `frontends/shell/e2e/regression.mjs:730` | item 6 |

10. **Every new or changed test.** The files are as in §4. The P0 reasons follow from Amendment 2 item 2's stubs. Each "fails at" set has no known case in which its mutation passes.

| Test | File | Red at P0 because | Mutation | Fails at |
|---|---|---|---|---|
| U-SB1 (changed: direct calls take no unit) | `frontends/shell/src/layout/scaleBar.test.ts` | `readingAtPxPerUnit(30)` returns `none`, not L 2 | M1 (`≥` becomes `>`) | 30 and 12 |
| U-SB4 (changed: zoom 1100 and -1100 added) | same | `metre` returns `none`, not a bar; the added cases also return `none`, not `out-of-range` | M4 (`unit === "metre"` becomes `unit !== "degree"`, at the one unit check) | `other` and `unestablished` |
| E-SCALE (changed: W's label assertion, D9) | `frontends/shell/e2e/layout.mjs` | no `.status-scale` at Z1 (I4) | M6 (`readZoom` returns 0) | Z2; it would also fail at W |
- M4 now has one site, so U-SB4's `other` case sends a mutated `other` on to the bar search, which returns a bar, and the test fails. The same holds for `unestablished`.
- Row 5 is an operator row, not a test. I7 governs its red result.

11. **Scope (class 9), declared before any code.** §7 is not edited, and each addition stays within its declared ceiling:
- `frontends/shell/src/layout/scaleBar.ts`: E5's guard and bounded search, about +6 lines, within 90.
- `frontends/shell/src/layout/scaleBar.test.ts`: U-SB4's two cases, about +4 lines, within 180.
- `frontends/shell/MANUAL-WALKTHROUGH.md`: row 5 and its line in the result log, about +4 lines, within the ≤ 45 declared outside the count.
- I7 adds no file. The totals (760 lines over 10 counted files) are unchanged. An overrun is class 8.

12. **The gate's notes ("The drafter's unsettled points"):**
- Hashes: acted on here (item 8), and Amendment 5 carries the hashes.
- The gate report on main: no action; resolved at a846072d. The custodian files attempt 2's report.
- The departures D1, D3, E1 and E4: no action; each holds.
- E4 resting on deck's wheel step: left to the code's gates; the proof is the zoom W records at the tester's run.
- §1's "over 260 lines" and the seam's write id: no action; these are notes.
- Very large zooms: acted on by item 4 (E5).
- The colour-by form's handle signature change: left to the custodian, as the order of the two pieces.

13. **For the advisor, unruled here:**
- S-1 to S-4, the KNOWN-LIMITATIONS draft and row 5's words (item 3) are drafts.
- If row 5 is run at a scaling other than 100% and passes, the word "only" in the draft's last sentence no longer matches what was checked. The wording is the advisor's, under item 6.
- E5 is the drafter's words, not the human's. Whether it lands under `governance/AUTONOMY.md` §31 (d) without a re-gate, or goes to the architect's attempt 3, is the advisor's call (gate E5).

**Superseded index.** By this amendment:
- §2 item 1's "Otherwise" sentence, as Amendment 2 item 4 replaced it.
- §2 item 7's S-4 clause check.
- §4: U-SB4's cases sentence.
- Amendment 2 item 4: the irrationality sentence and the comparison bullet's signature.
- Amendment 2 item 5: the 0.93 cite and W's label assertion.
- Amendment 2 item 1's pin sentence.
- Amendment 2 item 11: U-SB1's P0 reason and the M1 sentence on U-SB2.
- Amendment 2 item 12: the pins heading and the `regression.mjs` pin.
- Added: §5 I7; §9 Operator row 5.

Read the last amendment first.

Nothing above is edited.

## Amendment 5 — 2026-11-23 — the custodian's, at the commit that files Amendment 4: references and the pins' hashes

*Written by the custodian at the commit that files Amendment 4, before any code. References, and the hashes Amendment 4 item 8 asks for.*

1. Amendment 4 is the architect's draft, appended byte for byte from its consult, `state/consults/2026-11-23-shell-scale-display-amendment-4-architect-draft.md` (the hand-back's sha256 9c28854187c363a77831557b85f7bab74f530f26ca57c1b561ecc4eb68c362fe): the text between its two marker lines.
2. Its evidence is the architect's form gate, attempt 2, FAIL (`state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect-attempt-2.md`, gate-log row 872), and the advisor's ruling ADV-2026-11-23-19 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-19-the-scale-display-open-1-a-without-the-humans-word-the-rest-as-recommended-a-question-on-display-scaling.md`), whose item 7 answer the advisor accepted in ADV-2026-11-23-22 item 8 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-22-the-bullet-as-ruled-op6-accepted-no-narrow-read-the-third-place-takes-work-5260-not-accepted-yet-c2-fix-i.md`).
3. The pins of Amendment 4 items 8 and 9, as Amendment 4 item 8 asks (the gate's D10). Each entry names the file and lines the pin is read as, the sha256 of those lines at the pin's commit (each line with its LF, computed by script from the blob at that commit), and the pin's id and citing items as Amendment 4 lists them. The reviewer recomputes each one. Nothing else in Amendment 4 is hashed here.

- `frontends/shell/src/canvas/WorkingCanvas.tsx:2409` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:742ac88b851d01ca3fee02744a604fca0b577351c49d6a8d48f6195b9b3473e5 — P1 (item 5)
- `frontends/shell/e2e/lib.mjs:618` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:45aaaf385b057e547b98b34e144b906f2ee1facc72519be6955a359c56f836f1 — P2 (item 5)
- `frontends/shell/e2e/layout.mjs:26` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:1d6acc189adf7b6ff73c54767a4243cf4bd78cb491c43dab0bd733c30a1a7ec4 — P3 (item 5)
- `frontends/shell/e2e/tsModuleLoader.mjs:77-80` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:71bb03d27cef7826cc7a7efb27e5a9348917d283b323a0aefacfdae63af8980b — P4 (item 5)
- `frontends/shell/e2e/regression.mjs:729-730` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:a0013293557f74b7af0a98a37480f78cf0343a0101983cb6993cda3958acdf58 — P5 (item 5, as D8 amends it)
- `frontends/shell/e2e/regression.mjs:730-731` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:b30843402f21e020fe80ac5f96a09be119cd08d5ba21b9bad0650115ab1e8a01 — P6 (item 5, as D8 amends it)
- `frontends/shell/e2e/regression.mjs:729-731` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:945c28b9b02d02368079b60b7a6df2f95ca4d7cf7d44abfd2167aa54b3a260f2 — P7 (item 12, as D8 amends it)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2169` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:d3a2c4f75c4992e18a038f56b6248f3411e54c1375e1957818ea50814e50b5f2 — P8 (item 5)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2200-2210` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:56e1173c56a20266ab6ec306e3e028bf077d7c50903820974c3af04c65193ba2 — P9 (items 5 and 9)
- `frontends/shell/src/App.tsx:1475` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:f05efb1f1050d59a94b373e2e40675538bbe4615aba088967e3352a5a65da934 — P10 (item 5)
- `frontends/shell/src/App.tsx:2388` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:dbd5746b99c9f22a6634ddc26f3072af8ca298f74eca887f274fe3f4b223529b — P11 (item 6)
- `frontends/shell/src/App.tsx:2362-2364` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:865844271ffb755e59a5d7b8c6a81eb47a73c1c82bd35dbd8f83247e43966415 — P12 (item 6)
- `frontends/shell/src/feature/FeaturePanel.tsx:13-19` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:7ca74ba45496e098f11569622328ed2daca8c88f997e79a744637891b8770b4e — P13 (item 6)
- `frontends/shell/src/App.tsx:2438` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:de4ffe933a3d8caaf7f142d758e450c081c50c4fc95fd0db09da2a060ef4474a — P14 (item 6)
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:90` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:d6564e3afa3d937a10c3c8a48d1e2e24f7e8b60f2f72507d3ae0d5aaf4f26b78 — P15 (item 7)
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:96` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:3ddb25496ff58c2f2b74b80c2bca17503b7c458c58dd2298358989c1de700560 — P16 (item 7)
- `governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md:121` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:23c0d1c0814c45cec62d790a3a7125a8865b17e605804cb3a299730e380864ea — P17 (item 7)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:293-319` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:5dd30a51e92a368ad87dd8ba6fc0817420c8108ec33a310e1eda378d6748a5e6 — P18 (item 7)
- `frontends/shell/src/App.tsx:1836` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:6920325d0f45716a5ffe54f7b0248ff2ed4a7fd5e2e68fe7688f73ad8377df37 — P19 (item 9)
- `frontends/shell/src/App.tsx:2034` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:9f2acd17b5d6aa59b46d155cc654fe8b430fa224617d91d7be4b62b3150bc68f — P20 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1646-1650` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:d1da1acc724510ba996761da20d03dc0db23bf55393e09380cdb209b3d30d09c — P21 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1458` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:bed54217f16955b0f2b9c0a4d84ca0992b0250ad55d1d3325d4135bea5926cd4 — P22 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1591` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:2b8f88dc7fbc4d71211b93fa8782e6ff49e81d1839b1b9e8b600caaa80cf66df — P23 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1819` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:1888da38288257b416ba8a99a0e25d74ac697859628e1bc4c01b40f2acd1b6c7 — P24 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:2116-2127` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:835c7ccada0359ef52dc635ce28149d04da8e59e886de28dff9f3c3fec43576d — P25 (item 9)
- `frontends/shell/src/canvas/WorkingCanvas.tsx:193` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:c0c7ce858b1deaf5648596d1fb88ab9bfe96b51b88f4f0992802edd8a578442e — P26 (item 7 (prose))
- `frontends/shell/src/canvas/WorkingCanvas.tsx:1660-1664` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:e82b33496db058c3b71421e7cabd6b3facbe4a6e6b4b7ebd3b7546f2aa7ac706 — P27 (item 7 (prose and New text))
- `frontends/shell/src/canvas/WorkingCanvas.tsx:164-193` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:234f79fff59d739de68b2127d4d316709e3b647c4c31dc7ea4e57c73f7696003 — P28 (item 7 (New text))
- `frontends/shell/src/canvas/WorkingCanvas.tsx:148` @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e sha256:ba148574b2f205e6d489159bc8d699652cc173220963bbe4f9a47d9df4fb08fe — P29 (item 7 (New text))
- `frontends/shell/e2e/lib.mjs:16-25` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:a4ed3cecfaef51e2767e656cc208eb2e1b2d722425c1ad9eea8a0ca4f9d7f202 — Q1 (item 3)
- `frontends/shell/e2e/lib.mjs:92-93` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:7deeff60340722ace09056140242fad5f89105bb9248bdc4822b60cfbbda39a7 — Q2 (item 3)
- `frontends/shell/e2e/lib.mjs:97-114` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:0d1a011f4f9455f51306d199ba294ef6a160cc1f01346371f635a884739c82c0 — Q3 (item 3)
- `frontends/shell/e2e/lib.mjs:158-167` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:4d80ec0e9b6e319a158d5cb9c12c4233314fb0a6128a6bdcb400ee41b7a99416 — Q4 (item 3)
- `frontends/shell/e2e/lib.mjs:169` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:3e4d9b17a54eb856a672ed8bcea4cf5bd886b7739e90be6a473838f670649564 — Q5 (item 3)
- `frontends/shell/e2e/lib.mjs:193-200` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:2302ab8d03b0a28842a478d7c8d7f004ced0b50a0342e9f1894a513370e931a3 — Q6 (item 3)
- `frontends/shell/e2e/lib.mjs:316-318` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:f2e638324a5dc16f15240d36305a0f66e831e00ab7329557e7e8530efa6abfcc — Q7 (item 3)
- `frontends/shell/e2e/lib.mjs:325` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:5467cc8d58ab2bcf224a01018da2ec4b834efa39f3dc816fccf4bac8d2c9aa83 — Q8 (item 3)
- `frontends/shell/e2e/layout.mjs:540` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:7d06a556e967782a5d9b541c43c35a1048045ec2a8a68c8fe36a5ec382302a8f — Q9 (item 3)
- `frontends/shell/e2e/layout.mjs:264` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:f07e83aa57a16b8a8219c0622394d8c07075f788c33d4adf1e45290d92a2f7d4 — Q10 (item 3)
- `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:64-67` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:2ad1a7010b9aa03c5e5767fca0b2312cf6108a4ecad519723fa35195ad9e6b0a — Q11 (item 3)
- `governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md:202-205` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:3841c58a43c30e0ca2d5a1a17fe83e6e284048d661dc53fe86694e3ef20fdbda — Q12 (item 3)
- `state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md:42` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:dd223f77ccbda0aa35964e9060225372623cf6920565c7d623dfcab57fcf304e — Q13 (item 3)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md:1377` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:5d278614002e2dfa1d9e1dc67750d6e68def18df927c835314fc601adcc37b2f — Q14 (item 3)
- `frontends/shell/MANUAL-WALKTHROUGH.md:146` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:82e9d1db32e6f8800d98a33cdc2a53b55a2ec07ade717e57b12efc741b8868de — Q15 (item 3 (row 5))
- `frontends/shell/e2e/pan-anchor.mjs:47-50` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:38a3241200a45f7bdc2928c23ea8a48102af1b4e4c091454af1dbb13ccaf0344 — Q16 (item 3 (row 5))
- `engine/src/fixture.rs:93` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:111e19e1f5635e8cee5159fc900e85b3585b3aed0e349f4d45aa860cc4c05aa4 — Q17 (item 3 (row 5))
- `frontends/shell/tsconfig.json:16` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:979334adbd35a8653f412fdfc803b09841514bd574472a7c28712e5836357423 — Q18 (item 4)
- `frontends/shell/src/project/openProject.ts:143` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:2924d5abb239640b4b855685250a7e8909ba26a78495dde765b271c5c64de6ca — Q19 (item 4)
- `frontends/shell/e2e/regression.mjs:730` @ a846072d4be622ade7356d36bccd13c346ffa34a sha256:581c37bcd2fc6f8128e2d3aedb33b066ef520a8d8c9b20917650a2a155a0fafb — Q20 (item 6)
4. Its drafts and the points it could not settle go to the advisor in one message (ADV-2026-11-23-15 item 8); none is ruled here. Any finding of its own goes to the architect's attempt 3.
5. Next: the architect's form gate, attempt 3, on Amendment 4. No code is written before it ends PASS or PASS WITH NOTES.

Read the last amendment first.

Nothing above is edited.
