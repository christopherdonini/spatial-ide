*Filed by the custodian: the architect's draft of Amendment 4 to `governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md`, after the architect's form gate, attempt 2 (FAIL; `state/consults/gates/2026-11-23-shell-scale-display-form-gate-architect-attempt-2.md`, gate-log row 872) and the advisor's ruling ADV-2026-11-23-19 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-19-the-scale-display-open-1-a-without-the-humans-word-the-rest-as-recommended-a-question-on-display-scaling.md`), node:shell-scale-display@amendment-4-architect-draft, dispatched at 2026-11-23T16:51:15Z. Its run: Read 16, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-23T16:51:15Z to 2026-11-23T16:58:51Z by its transcript; 0 calls named the main checkout. The report below from its hand-back, 21485 bytes, sha256 9c28854187c363a77831557b85f7bab74f530f26ca57c1b561ecc4eb68c362fe, byte for byte, with one final newline added. Its amendment, the text between its two marker lines, is appended to the form byte for byte, and the custodian's Amendment 5 follows it.*

---

Result: I drafted Amendment 4 from a read of the detached read worktree (C:/dev/wt/read-1123e @ a846072d4be622ade7356d36bccd13c346ffa34a). Item 7's answer is no: the suites have no forced scale factor that is both real and invisible to the other suites, so the operator Part gains one row at the human's own display scaling, the limitation's sentence stays, and a red result in that row is a stop.

---AMENDMENT 4---
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
---END OF AMENDMENT---

**What I could not settle:**
- I have no Bash, so I checked each Old text's single occurrence with Grep and by reading, not by script. These are the ones in item 4 (four of E5's plus the S-4 clause), items 5 to 7 (five) and item 8 (two).
- The gate says the code at a846072d is the same as at b42c0ed7. I did not diff the two commits. P1 to P29 are pinned at b42c0ed7 as D10 asks, and the reviewer's recompute is the proof.
- That some wheel notch lands inside the 200 m band (row 5's check) rests on the 0.93-per-notch figure on another map (P5). If the human cannot reach a 200 m label, they can use any label and the matching parcel count (L / 40). Only the advisor can word that.
- E5's guard on `pxPerUnit` cannot be detected by any mutation, because the bounded search gives the same answer at 0 and Infinity. I disclosed this rather than dropping the guard. The reviewer may prefer to drop it.
- §8 item 8 blocks a draft that has landed before the advisor's words. Item 6 of the ruling builds the drafts under the placeholder mark and has the words commit before the build's words. I read "landed" as merged, so the two agree, and I did not edit §8.
- `governance/AUTONOMY.md` §31 (d) or a re-gate for E5: left to the advisor.

**Drafts for the advisor:**
- S-1 to S-4 (§2 item 7), under OPEN-2 (a) as ruled.
- The KNOWN-LIMITATIONS item (§2 item 8, with Amendment 2 item 9's two sentences), including its last sentence, which stays under item 7.
- Row 5 of the operator Part (Amendment 4 item 3).
- The I7 wording (Amendment 4 item 3).
- Amendment 4 item 13's note on the word "only".

Files read: `C:/dev/wt/read-1123e/governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md` (whole), `C:/dev/wt/read-1123e/frontends/shell/e2e/lib.mjs` (:1-360), `C:/dev/wt/read-1123e/frontends/shell/e2e/pan-anchor.mjs` (:1-239), `C:/dev/wt/read-1123e/frontends/shell/e2e/regression.mjs` (:726-732), `C:/dev/wt/read-1123e/governance/forms/frontends/PAN-ANCHOR-PREREGISTRATION.md` (:58-71, :190-219), `C:/dev/wt/read-1123e/frontends/shell/src/canvas/viewportBbox.ts` (:1-60), `C:/dev/wt/read-1123e/frontends/shell/src/canvas/WorkingCanvas.tsx` (:143-194, :1636-1665), `C:/dev/wt/read-1123e/frontends/shell/src/project/openProject.ts` (:136-145), `C:/dev/wt/read-1123e/engine/src/fixture.rs` (:55-134), and Grep over `frontends/shell/` (src-tauri, e2e, tsconfig, App.tsx, contributions.ts, MANUAL-WALKTHROUGH.md) and the repo. The ruling is at `<S>/adv-23-19.md` and the gate report at `<S>/report-scale-gate-a2.md`.

Model: claude-opus-5-5 (Opus 5.5).
