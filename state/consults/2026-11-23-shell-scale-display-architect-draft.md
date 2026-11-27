*Filed by the custodian: the architect's draft preregistration for shell-scale-display, the scale in the status bar (the human's message of 2026-11-23 item 3 (d); ADV-2026-11-23-15 item 7 (d), the second gap piece), node:shell-scale-display@architect-draft-1, dispatched at 2026-11-23T14:04:59.007Z. It read the repository at 0bcf5434 in a detached read worktree and ran nothing. Its run: Read 42, Grep 39, Glob 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-23T14:04:59Z to 2026-11-23T14:14:57Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 26295 bytes, sha256 3d1041862c130b04b33f29729630d8d9a06033f3d093fa0ba5b7c69a1d7e8e55, byte for byte, with one final newline added. Its form is filed beside it in the same commit.*

---

# The scale display in the status bar (node `shell-scale-display`): preregistration, full form

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
---END OF FORM---

**Note (the architect, for the custodian)**

What I could not settle from the code:
1. **deck.gl's own zoom limits.** I found no `minZoom` or `maxZoom` under `frontends/shell/src/`. I did not read deck's defaults. OPEN-3's bound and U-SB4's non-finite cases cover any value, so nothing depends on them.
2. **DPR other than 1.0.** The CSS reading of zoom is measured only at DPR 1.0 (`viewportBbox.ts:16-23`). The KL item's last sentence depends on E-SCALE's recorded `devicePixelRatio`. On a scaled display the claim is withheld, not refuted.
3. **Corpus #8 on the e2e rig.** I could not check that the file is present where E-SCALE runs. If it is absent, I5 stops the run. Under OPEN-5 (b) the degree half leaves the suite.
4. **Room in the status bar.** It is one fixed height with `overflow-y: auto` (`styles.css:159-171`). With residency, liveness, incomplete, watcher and selection items all present at 1366 px, the scale could wrap out of view. E-SCALE's rect check and Part row 3 are the guards. I did not compute the widths.
5. **The App test harness.** R-SC1's budget assumes `App.save.test.tsx`'s mocks (:39-120) can be copied and given the report props. If the copy needs more, §7's file ceiling is the limit, and an overrun is class 8.
6. **Commits behind §0.** I read the code only at 0bcf5434. The claim that every zoom write reports a box rests on four sites (§0). A later commit on the re-link's base that adds a camera write is I1.

For the human:
- **No dependency, lockfile, port or workflow change.** Nothing touches src-tauri capabilities.
- **OPEN-1 departs from a shape the human ruled.** OPEN-7 (c) said "with (a)'s shape as drafted", and (A) drops (a)'s new handle method. The departure narrows the change: there is no new exception under `canvas/`. Still, the advisor should say whether it can rule on this under the delegation or must pass it to the human. If (B) is ruled, §2 items 3 and 6 change, `WorkingCanvas.tsx` grows by about 25 lines, and every structural fake of `WorkingCanvasHandle` that lacks the method is affected only if the method is made required. I recommend that it stay optional, as `currentView?` is (`WorkingCanvas.tsx:145-150`).
- **No red-line text.** The strings and the KL item are drafts for the advisor. None of them is an ADR, a gate ruling, a licence text or a security-posture text.

Class reasoning in brief: ADV-2026-11-16-06 item 2 (a) names "CRS or reprojection". That fits a length typed by the CRS unit, shown only for one unit. The size alone (about 760 lines) also puts the piece over 260. Both route it to full.

Overlap: the custodian builds on the re-link's head because three documentation files are shared. The product files are shared only with forms that are not built.

Files named:
- `C:/dev/wt/read-1123/frontends/shell/src/canvas/WorkingCanvas.tsx`
- `C:/dev/wt/read-1123/frontends/shell/src/App.tsx`
- `C:/dev/wt/read-1123/frontends/shell/src/feature/FeaturePanel.tsx`
- `C:/dev/wt/read-1123/frontends/shell/src/layout/contributions.ts`
- `C:/dev/wt/read-1123/frontends/shell/src/layout/regionParts.tsx`
- `C:/dev/wt/read-1123/frontends/shell/e2e/layout.mjs`
- `C:/dev/wt/read-1123/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md`
