Reviewed: main at a846072d4be622ade7356d36bccd13c346ffa34a, in the detached read worktree C:/dev/wt/read-1123e (the custodian's filing note, 2026-11-23: the architect's form gate on the full form through Amendment 3, attempt 2, node:shell-scale-display@form-gate-architect-2, dispatched at 2026-11-23T16:40:07Z; its run: Read 22, Grep 12, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:40:08Z to 2026-11-23T16:48:24Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 12601 bytes, sha256 626f3a75fef147aa2d67eb40e5a612d2bfadf5062b8a1e9e1ee43e358e43bb64, byte for byte, nothing masked, with one final newline added. FAIL: E5 (a unit parameter on readingAtPxPerUnit gives M4 a sure survival; the words drop it and bound the search); no Correctness finding; D7 to D10 Documentation, D10 asking for each pin sha256; the OPEN items unchanged.)

---

Verdict: FAIL
Reviewed: C:/dev/wt/read-1123e @ a846072d4be622ade7356d36bccd13c346ffa34a (detached, main)

Tag: node:shell-scale-display@form-gate-architect-2. I used Read, Grep and Glob only and ran nothing. I did not recompute any hash. Every cite below is at a846072d. The code is the same as at b42c0ed7.

Amendment 2 answers E1 to E4 and D1 to D6 against the code. One new Evidence fault blocks: E5, which comes from the signature that attempt 1's own E3 words proposed and Amendment 2 adopted. The fix is words only, given below.

## Evidence (blocking)

**E5. Amendment 2 item 4 (form :443 and :449): `readingAtPxPerUnit(unit, pxPerUnit)` gives M4 a sure survival.**
- The amended §2 item 1 keeps the `not-metre` check in `scaleReading` (form :95) and then passes `unit` on to `readingAtPxPerUnit` (:443).
- `noUnusedParameters` is on (`frontends/shell/tsconfig.json:16`), so the build forces the callee to use `unit`. The natural use is a second unit check.
- With two checks, M4 applied at either one is caught by the other. U-SB4's `other` and `unestablished` cases still pass, so M4 survives its whole named set. That contradicts form :567.
- U-SB1's direct calls pass only `metre`, so they cannot catch it.
- Exact words follow. They are the form drafter's words, not the human's. §31(d) would let them land with no re-gate, but §31(a) assumes code gates, and this form is before code. Which reading applies is the advisor's call.

```text
Otherwise, `readingAtPxPerUnit(unit, 2 ** zoom)`: the smallest m × 10^k with m × 10^k × pxPerUnit ≥ SCALE_BAR_MIN_PX, and `widthPx` is that same product. `readingAtPxPerUnit` is pure and exported. Its product caller is `scaleReading`, and U-SB1 also calls it at exact pixels per unit (Amendment 2, item 4).
```
```text
Otherwise, `readingAtPxPerUnit(2 ** zoom)`. It returns `out-of-range` when `pxPerUnit` is 0 or not finite, or when the smallest m × 10^k with m × 10^k × pxPerUnit ≥ SCALE_BAR_MIN_PX has k outside [SCALE_EXPONENT_MIN, SCALE_EXPONENT_MAX]; otherwise that bar, with `widthPx` that same product. Its search is bounded by those exponents, so it ends for every input. It takes no unit: the unit is checked once, by `scaleReading`'s `not-metre` case above. `readingAtPxPerUnit` is pure and exported. Its product caller is `scaleReading`, and U-SB1 also calls it at exact pixels per unit (Amendment 2, item 4).
```
```text
- The comparison is made by a pure exported `readingAtPxPerUnit(unit, pxPerUnit)` in `scaleBar.ts`
```
```text
- The comparison is made by a pure exported `readingAtPxPerUnit(pxPerUnit)` in `scaleBar.ts`
```
```text
`readingAtPxPerUnit(…, 30)` returns `none`
```
```text
`readingAtPxPerUnit(30)` returns `none`
```
```text
Cases include NaN and ±Infinity.
```
```text
Cases include NaN and ±Infinity, and zoom 1100 and -1100, where `2 ** zoom` is Infinity and 0, which give S-4.
```

Clause check of these words:
- **One unit check.** `ScaleItem` receives the dataset's own unit from App's slot (form :110). So `not-metre` is reached in the product for degree, other and unestablished, at exactly one site. M4 then has one place to land, and U-SB4's `other` and `unestablished` cases kill it.
- **0 or not finite.** For a finite zoom, `2 ** zoom` is Infinity from 1024 up and 0 from -1075 down (IEEE double). Zoom has no clamp (`frontends/shell/src/canvas/tileGrid.ts:320`, form :40). A saved view restores whatever zoom was saved (`frontends/shell/src/project/openProject.ts:143`, `App.tsx:1836`, `App.tsx:2034`). So this branch is reachable from the product, and the new U-SB4 case covers it. Under the current words, "the smallest" does not exist there, and an unbounded search would block the canvas (docs/01).
- **Bounded search.** If 5 × 10^(MIN-1) qualifies, k is below MIN. Otherwise k = MIN..MAX with m in {1, 2, 5} is scanned, and finding no match means k is above MAX. Both cases end.
- **Consistency.** The `out-of-range` bullet at form :97 stays true, because `scaleReading` returns what `readingAtPxPerUnit` returns. M1 stays in one comparison. U-SB1's 30 and 12 cases stay exact: 2 × 30 and 5 × 12 are both exactly 60.

## Correctness

No findings.
- **Class.** Full, both gates, unchanged (`governance/AUTONOMY.md:327`, :349-351). Amendment 2 adds no file and no row, and §7 is not edited (form :569-572). So it brings no class-9 scope addition and no §7 edit.
- **CRS and view.** Unchanged. `readingAtPxPerUnit` is pure arithmetic on CSS px per CRS unit. Nothing is converted, and no ADR-006 class is involved.
- **Caller rule.** `readingAtPxPerUnit` has a product caller in `scaleReading` (form :443). It follows the precedent of in-module pure exports that are also tested directly, such as `createFitCameraWriteSequence` (`WorkingCanvas.tsx:499`). Holds, subject to E5.

## Attempt-1 findings, by id

- **E1: answered.** The `scaleLabel` stub returns `""` and the `readingAtPxPerUnit` stub returns `none` (form :418). Commit 2 implements all three functions (:424). U-SB1 to U-SB4 are red at P0 for the reasons in :560-563. The drafter's E1 departure, stubbing `readingAtPxPerUnit` too, is needed: without it, U-SB1's direct calls would pass at P0 and trip I3.
- **E2: answered.** Over [-19, 16] in steps of 1/64, k stays within [-3, 7].
  - At -19: 5×10⁷ gives 95.4 px, and 2×10⁷ gives 38.1.
  - At 16: 0.001 gives 65.5 px, and 5×10⁻⁴ gives 32.8.
  - The reading is monotonic in between. The P0 stub fails at the first step. M2 fails at any step whose true m is 2.
- **E3: answered.** The direct calls reach the comparison exactly, and M1 is killed at 30 and at 12.
- **E4: answered.**
  - Z1 again writes `initialViewState` at zoom 0 (`WorkingCanvas.tsx:2409`). The value differs from Z6's, and the fit's earlier write carries `fitCameraWriteId` (:499-505), so deck's deep-equal (:109-112) drops nothing.
  - The notch goes through :2169 and then :2200-2210.
  - 0.93 per notch is stated at `e2e/regression.mjs:729-730`. The readouts measured at :730-731 (-4.57 to -1.78 to -0.85) agree with it. The assertion needs only about 0.263.
  - W fails if the item does not change, and under M6.
  - W cannot tell the store's notification (`App.tsx:2434`) apart from another App render that re-reads the snapshot, such as `setHover` at :2395. R-SC1 (ii) proves that part (form :478). This is a note, not a finding.
  - The drafter's E4 departure (label differs rather than width) is sound: 100 m becomes 50 m, while the width moves only from 100 to 95.3 px.
- **D1: answered.** The drafter's departure is true: the colour-by form changes `resetFitForNewGeneration`'s signature and body (its form :90, :96, :121). Milestone 5's PR B also lists `App.tsx`, `contributions.ts` and `styles.css` (its form :314).
- **D2, D4, D5: answered**, in the gate's words.
- **D3: answered.** The drafter's added clause holds: a reopened project calls `applyView` (`App.tsx:1836`, :2034), which reports through `onViewShown` (`WorkingCanvas.tsx:1646-1650`, then :1458). Ordinary use reaches it.
- **D6: answered.**
  - (ii) is now asserted at once after one `act`, and `showBox` only writes the store (`App.tsx:2362-2364`; `FeaturePanel.tsx:13-19`, :26-40). So M5 fails at (ii) whether it reads once or reads on render without subscribing.
  - M3's k = -3 case and M4's `unestablished` case are in their tests. M4 is subject to E5.
- **Old texts.** Each occurs once above Amendment 2: form :96, :99, :114, :126 (twice), :153, :157, :165, :167, :171, :174, :178, :181, :183, :256, :274, :295, :296. The superseded index (:604-610) covers each one.

## Documentation (must be fixed before the merge; carried by an appended amendment; these are the form drafter's words, not the human's)

**D7. Item 4 (form :436) and item 11 (:567): the float caveat is missing.** The sentence about irrationality holds in exact arithmetic. That the rounded product never equals 60 in floating point is not shown. The harm is nil, because M1 is not in U-SB2's set.
```text
At any other zoom, 2^zoom is irrational.
```
```text
At any other zoom, 2^zoom is irrational in exact arithmetic; that the rounded floating-point product never equals 60 is not shown.
```
```text
M1 does pass U-SB2, because the sweep never reaches equality (item 4).
```
```text
M1 is expected to pass U-SB2, since the sweep is not shown to reach equality (item 4).
```

**D8. Item 5 (form :466, :579): the 0.93 figure is on `regression.mjs:730`, not on :729.**
```text
one notch adds about 0.93 to the zoom (`frontends/shell/e2e/regression.mjs:729`)
```
```text
one notch adds about 0.93 to the zoom (`frontends/shell/e2e/regression.mjs:729-730`; the readouts measured at :730-731 agree)
```
```text
- `frontends/shell/e2e/regression.mjs:729`
```
```text
- `frontends/shell/e2e/regression.mjs:729-731`
```

**D9. Item 5 (form :466): W's label assertion compares the item's text to `scaleLabel`, which returns only the decimal.** S-1 is `{L} m (CRS)` (form :116). As worded, the assertion would fail on the fix. That is a false fail, not a false pass.
```text
that the label and the width (within 1 CSS px) equal `scaleLabel` and `scaleReading` at that zoom
```
```text
that the label is S-1 with `scaleLabel`'s decimal for `scaleReading`'s mantissa and exponent at that zoom, and the width is that reading's `widthPx` within 1 CSS px
```

**D10. Items 1 and 12 (form :411, :574): the pins carry no sha256.** Amendment 3 item 3 (:622) declines to add them. A line-carrying reference is pinned with its hash (round 14). The next amendment carries each of the 23 pins' sha256 at b42c0ed7, computed by script, and the reviewer recomputes them.
```text
Item 12 lists each pin, and the custodian adds each sha256 by script before the commit.
```
```text
Item 12 lists each pin; each pin's sha256 is carried by the amendment that answers the architect's attempt 2, computed by script.
```
```text
Pins, each `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`, with each sha256 added by the custodian's script:
```
```text
Pins, each `path:line @ b42c0ed72a8a94885bdd1f057c5c7463e5127a0e`; each sha256 is in the amendment that answers the architect's attempt 2:
```

## The drafter's unsettled points (the consult's note, :218-232)

- **Hashes:** D10. Not blocking; for the reviewer's script.
- **The gate report on main:** resolved. It is at `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md` at a846072d.
- **The departures D1, D3, E1 and E4:** each holds against the code (above).
- **E4 resting on deck's wheel step:** not blocking. The measured readouts support 0.93, and the margin is more than threefold. The zoom W records at the tester's run is the proof; that is for the code's gates.
- **§1's "over 260 lines" and the seam's write id:** notes only. Item 5 now argues the deep-equal case, and that argument holds.
- **Very large zooms:** closed by E5's words. Not for the advisor.
- **The colour-by form's handle signature change:** not blocking. This piece consumes only `currentView` (`WorkingCanvas.tsx:150`) and edits only the comment at :148. The colour-by form edits :164-193 and :1660-1664. The order of the two pieces is for the custodian.

## For the advisor (not ruled here)

- OPEN-1 to OPEN-7 and S-1 to S-4 are unchanged. Attempt 1's reading of them stands.
- D3's two sentences (form :526, :532) are sound against the code: the auto-fit (:1591, :1819, then :1458), `applyView` (above), and the interactive report (:2200). "From the same moment" follows from §2 item 2's snapshot.

Files read (in C:/dev/wt/read-1123e):
- governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md (:1-330, :400-629, grep)
- state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect.md
- state/consults/2026-11-23-shell-scale-display-amendment-2-architect-draft.md (:214-235, grep)
- governance/forms/frontends/COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md (grep)
- governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md (:288-322)
- governance/AUTONOMY.md (:315-359, :530-551)
- frontends/shell/src/canvas/WorkingCanvas.tsx (:100-159, :499-505 grep, :604-613 grep, :1425-1460, :1575-1664, :1808-1821, :2085-2423)
- frontends/shell/src/App.tsx (:1464-1479, :1826-1840, :2024-2038, :2340-2454)
- frontends/shell/src/feature/FeaturePanel.tsx (:1-45)
- frontends/shell/src/project/ (grep zoom)
- frontends/shell/e2e/lib.mjs (:600-659)
- frontends/shell/e2e/layout.mjs (:420-459, :540-598, grep)
- frontends/shell/e2e/tsModuleLoader.mjs
- frontends/shell/e2e/regression.mjs (:700-759)
- frontends/shell/tsconfig.json (grep)

Model: claude-opus-5-5 (Opus 5.5).
