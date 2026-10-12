*Custodian's filing note (2026-10-11): the architect's draft of map-refill's Amendment 2 (FILL after invalidator I3), on the custodian's brief at main 76c3ea34 and the branch at 64de82e6, after worker reports 2 and 3. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4bb5c582273cbea3c685c5632fda51064403d07cca417f9c2fc7e0204a96c321. Write audit PASS: zero write calls (Grep 33, Read 25, SubagentHandback 1). Run window from the transcript: 01:33:08Z to 01:45:43Z. Appended to the form `frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md` as Amendment 2 in the same commit, with the custodian's 17 pins; it names no OPEN item.*

---

Reviewed: main @ 76c3ea346fff486467be4330b67f331b501234e3; the branch at 64de82e6

## 1. The cause, from the code

FILL's two precondition terms have no common zoom with this fixture and canvas. The bigger finding is that neither term tests what FILL's claim needs.

- **The cell term** (the cell on screen is smaller than the growth per side) is only a stand-in for "the growth covers at least one cell the current view does not". RESIZEQ already computes that count exactly.
  - FILL needs something else: a cell that **no plan in the session** has asked for. The planner only issues cells that are neither tracked nor complete.
  - The auto-fit after E-REOPEN does not report, so the first wheel notch is the session's first plan.
  - The measured scale per notch is about 1.90 (2^0.930). The grown-to-current width ratio is 792/480, about 1.65. So from the second notch on, the grown view lies inside the first notch's view, and every cell it covers has already been planned.
  - Had the terms held at notch 2 or later, the toggle would have issued no stream. The step would have failed its assertion and blamed the product for a fault in the step.
- **The anchor term** was meant to put the grown view over features. It does not do that.
  - The box layout.mjs builds is the padded square `deriveTileGridFrame` starts from: the first look's longer span, centred on the first look.
  - Its y range starts at 1194303.50. That is about 5.7 km south of the fixture's southern edge, N_LO = 1200000, and every parcel centre lies at or north of N_LO + 20.
  - It is not needed for planning either, because the grid has no boundary. Only the new cells need features.
- **Why the window is empty** (my arithmetic from report 3's table):
  - The cell term needs 1584.13 · 2^z < 156, so z < −3.344.
  - The view centre is at x ≈ 2603460.1, which is 3456.6 m east of the box's xmin. The inside term therefore needs 396/2^z ≤ 3456.6, so z ≥ −3.126.
  - Even with the view centred in the box, the window would be −4.0 ≤ z < −3.344. That is narrower than one notch (0.930), and the notches from the fit land at −4.169 and −3.239.
- **What FILL actually needs** is three facts:
  1. a cell the grown view covers that no plan has asked for;
  2. features in that cell;
  3. for the mutation to fail, every cell of the last plan complete before the toggle.

## 2. Class, and what is the human's

- **Class 1** (post-result amendment). It records the I3 result and what it invalidates, and it replaces FILL's setup and precondition before any code of the change.
  - Not class 2: no §3 or §5 prediction was missed, because FILL's outcome was never reached.
  - Not class 5: no ruling narrows. Not class 9: no standing rule adds work. Not class 8: no overrun.
- **It does not narrow or replace an acceptance item the human ruled.** The human's rulings are OPEN-1, OPEN-2, item 39's wording and the slot order (Amendment 1), plus the authority the form cites in its header. None of them names FILL's design. The assertion, its window, the mutation and §4's "It fills" item are unchanged.
- The amendment also drops BURST from the evidence for "a burst is coalesced". This removes an unasserted observation from the form's own evidence list; it adds no claim.
- **Nothing here is the human's, and nothing is a red line.** Part V's V1 edit reaches the human through the usual P6 sight.

## 3. The amendment

````markdown
### Amendment 2 — FILL after invalidator I3: the cause, and FILL's setup and precondition replaced before any code of them (class 1), written after results were seen

*Written by the architect after results were seen: worker report 2 (`state/consults/2026-10-11-shell-map-refill-after-resize-worker-report-2.md`) and worker report 3 (`state/consults/2026-10-11-shell-map-refill-after-resize-worker-report-3.md`), each cited by section; their filing notes carry their hashes. The branch head is 64de82e6, which this amendment does not change. Code was read at main 76c3ea346fff486467be4330b67f331b501234e3 and on the branch at 64de82e6. Nothing below is a quotation. Arithmetic marked "mine" is computed from report 3's table.*

1. **The result.** I3 fired at FILL at the head (report 2, Runs and the layout comparison's FILL bullets). The diagnostic (report 3, Diagnostic (A)) recorded 26 states at the head. No state satisfies both precondition terms. The grid level is medium in every row, so a stale level is not the cause.

2. **The cause, from the code.**
   - (a) **The cell term** (`frontends/shell/e2e/layout.mjs` (`:424-429` at 64de82e6)) stands in for a cell newly covered relative to the current view. RESIZEQ computes that count exactly (`frontends/shell/e2e/layout.mjs` (`:374-376` at 64de82e6)).
     - FILL needs a different fact: a cell no plan of the session has asked for (H3's wording).
     - The planner issues only cells neither tracked nor complete (frontends/shell/src/streaming/tileViewportStreamManager.ts:600-611 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD). Planning reads completeness (frontends/shell/src/residency/candidateArmSession.ts:927 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
     - Tiled planning starts at the first reported view (frontends/shell/src/residency/candidateArmSession.ts:65-76 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD). The auto-fit does not report (§0.3). So the first wheel notch after E-REOPEN is the session's first plan.
     - Mine: the measured scale per notch is 2^0.930 ≈ 1.90, more than the grown-to-current width ratio 792/480 ≈ 1.65. From the second notch on, the grown view lies inside the first notch's view, and every cell it covers was already planned.
   - (b) **The anchor term** (`frontends/shell/e2e/layout.mjs` (`:420-421` at 64de82e6)) was meant to place the grown view over features.
     - The box it builds is the square the frame is padded from (frontends/shell/src/canvas/tileGrid.ts:120-132 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD), not the fixture's footprint.
     - Its y range starts at 1194303.50 (report 3's table). Every parcel centre lies at or north of N_LO + 20 (engine/src/fixture.rs:68 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD; engine/src/fixture.rs:1266 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
     - Planning does not need the box either, because the grid has no boundary (frontends/shell/src/canvas/tileGrid.ts:46-51 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
   - (c) **No common zoom** (mine; medium level, a 480 × 576 map, 156 px growth per side):
     - The cell term needs z < −3.344.
     - The view centre lies 3456.6 m east of the box's xmin, so the inside term needs z ≥ −3.126. The window is empty.
     - Centred in the box, the window would be −4.0 ≤ z < −3.344. That is narrower than one notch (0.930), and the notches from the fit land at −4.169 and −3.239.
   - (d) **Neither term is needed for §4's "It fills" item.** FILL needs three facts: a cell the grown view covers that no plan has asked for; features in that cell; and, for the mutation, every cell of the last plan complete before the toggle.

3. **What it invalidates.**
   - In §4's FILL row: the setup sentence (notches computed by a search) and the precondition sentence.
   - In layout.mjs: the search and `MAX_FILL_NOTCHES` (`frontends/shell/e2e/layout.mjs` (`:43`, `:435-446` at 64de82e6)).
   - Unchanged:
     - FILL's assertion, its 10 s window, its settle, the Inspector restore, and its mutation with its expected failure;
     - §3's FILL outcome;
     - H1 to H3 and I1 to I7. H3 held through RESIZEQ (report 2: 96 new cells predicted).

4. **FILL′ replaces them. Declared before any code of it. layout.mjs only, after E-REOPEN, on the 100k fixture.**
   1. Wait for the grid frame and settle fully, as now. Mark the trace.
   2. Make one real wheel notch at the canvas centre (`ZOOM_NOTCH_DELTA_Y`), then settle fully. Record the zoom.
      - One notch is declared, not searched. It gives the session's first reported view (item 2(a)). A further notch cannot add an unasked cell while the measured scale per notch exceeds the grown-to-current width ratio.
   3. The precondition, computed and recorded. If either part fails: STOP (I3).
      - (i) `.residency-status` matches the complete within-budget pattern that regression.mjs already reads (frontends/shell/e2e/regression.mjs:1993 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
        - That sentence is shown only when every cell the last plan covers is complete (frontends/shell/src/residency/candidateArmSession.ts:661-682 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD; frontends/shell/src/residency/residencyStatus.ts:463 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
      - (ii) At least one qualifying cell. Compute it as follows:
        - take the cells the grown view covers: `tilesCoveringBbox` at the frame's level, the last view-state line, width `size.width + inspectorGrowthPx`;
        - remove the cells covered by every view-state line after the mark, at the size before the toggle;
        - keep only the cells whose box lies wholly inside the parcel area (item 5).
      - Why every line after the mark: every camera write traces a view-state line (`frontends/shell/src/canvas/WorkingCanvas.tsx` (`:1336`, `:1975` at 64de82e6)), and every plan uses a reported box. The union is therefore a superset of what was asked, whatever the debounce merged.
   4. Ctrl+I, then §4's assertion, unchanged.
   5. Confirm (ii) again, at the canvas size measured after the toggle.
      - If it is below one: I3, STOP. The run's assertion outcome is then void, neither PASS nor FAIL.
      - Record both counts beside the stream and row counts.
   6. The trace settles (H2). Ctrl+I restores the Inspector in a `finally`, as now.

5. **The parcel area.** This is an e2e-local declared value in layout.mjs, not a product constant (§7's first bullet): x 2,600,000 to 2,612,680 and y 1,200,000 to 1,212,600, in LV95 metres.
   - Derived in a comment from the generator:
     - features: 100,000 (kernel/tests/manual_walkthrough_fixtures.rs:43-54 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD);
     - the default domain (engine/src/fixture.rs:566 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD);
     - grid origin E_LO and N_LO (engine/src/fixture.rs:67-68 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD) and a 40 m cell (engine/src/fixture.rs:93 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD);
     - placement by id over 317 columns (engine/src/fixture.rs:1258-1266 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD), giving 315 full rows (315 × 317 = 99,855).
   - Each ring is drawn around its parcel centre (engine/src/fixture.rs:1273 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD). So a grid cell (1584.13 m at medium) lying wholly inside the area holds parcel centres, and the parcels intersect it.
   - The fixture hashes the suite prints tie this value to its file (report 2, Setup).

6. **Predicted (mine; report 2's layout; not adjusted at the run).**
   - After the notch (zoom −3.239), the view covers columns 4 to 7 and rows 5 to 9. The grown view adds columns 3 and 8.
   - The qualifying cells are column 8, rows 8 and 9: two cells. This holds at the DOM growth (312 px) and at the growth RESIZEQ measured (480 → 758 px, report 2).
   - A different count at the run is recorded. Below one is I3.

7. **The mutation is unchanged** (§4's FILL row), and it fails by name by construction.
   - The mutated handler reports `lastQueried`, which is the notch's own box.
   - By 4.3(i), every cell of that box is complete, so the re-plan issues no stream and the assertion fails on 0 streams.
   - It is observed at the fix head, by §4's method.

8. **§7.**
   - The windows are unchanged: RESIZEQ 3 s, FILL 10 s. FILL's step timeout (180,000 ms) is unchanged.
   - `MAX_FILL_NOTCHES` is removed. It bounded a search FILL′ does not have, and it is not an assertion threshold (§8 item 11).
   - New e2e-local value: the parcel area (item 5).
   - G3 stood at 182 lines at 64de82e6 (worker report 1, the budget table: 169 added, 13 removed). The replaced lines (`:43` and `:412-471` at 64de82e6) are 61 of the 169 added.
   - G3's ceiling of 200 holds if FILL′ and the area add at most 79 lines. Measure with §7's command at the fix commit. An overrun is class 8, and §7 is not edited.

9. **RESIZEQ, as run, stands** (report 2). Its 96 predicted cells and 72 lines are different units.
   - Observation: FILL's message gives 156 px growth per side, summed from the DOM (`frontends/shell/e2e/layout.mjs` (`:339-340` at 64de82e6)). RESIZEQ's note shows the map going from 480 to 758 px.
   - If both steps read the same DOM sum, the sum overstates the growth by 34 px.
   - RESIZEQ's prediction is recorded, not asserted, and stays as it is. FILL′ confirms at the measured size (item 4, step 5) for this reason.

10. **BURST, as run** (report 2): 0 lines.
    - Mine: the last asked box was FILL's first-notch view at 480 px. A drag of at most 96 px (24 × 4 px) leaves the covered columns at 4 to 7, so nothing new was asked for. In this arm a `viewport_query` line is traced per tile request (frontends/shell/src/streaming/tileViewportStreamManager.ts:937 @ 76c3ea346fff486467be4330b67f331b501234e3 sha256:HASH-TBD).
    - After FILL′, BURST starts inside FILL′'s grown box, so it records 0 lines by construction.
    - BURST stays recorded and not asserted. A 0 reads as no growth beyond the last asked box, never as coalescing.
    - §4's "a burst is coalesced" rests on the debounce tests it names and on V3. Its BURST clause is superseded by this item. BURST is not edited.

11. **Part V.**
    - With V1's two notches (§2.6), the strip V2 uncovers can lie inside the first notch's view, which that notch's plan already filled at the base too.
    - V1 becomes one wheel notch. Nothing else in Part V changes.
    - The walkthrough line count stays 28 of 30, because the Part's lines are new.

12. **e2e/README.md.** The FILL sentence is restated for FILL′, inside the README's 12-line allowance.

13. **The runs at 64de82e6.**
    - If the fix commit changes only layout.mjs, e2e/README.md and MANUAL-WALKTHROUGH.md against 64de82e6, the pairs recorded at 64de82e6 stand for the fix head. None of those files is an exe input (report 2, Diff and exe), and no other e2e suite imports or reads them. The PR body names both commits.
    - Re-run: the layout head run at the fix commit (the base run stands).
    - Observe both e2e mutations at the fix head.
    - Any other path in that diff re-runs every pair.

14. **Reuse index.** The custodian ran the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c and found no prior art for this. A miss does not block.

**Superseded index:**
- §4's FILL setup and precondition → item 4.
- §4's coalescing line, its BURST clause → item 10.
- §2.6's V1 → item 11.
- §2.7's FILL clause → item 12.
- §7's e2e-local values → item 8.

Nothing above is edited.
````

## 4. OPEN items

None. Nothing here is the human's, and nothing touches a red line. The Part V change reaches the human only through the ordinary P6 sight.

Not handled here: the console K7 failure in the shared base run (report 3, Stop) is outside this amendment and stays with the solo re-run.

## 5. Files read

- C:\dev\spatial-ide\frontends\shell\SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-11-shell-map-refill-after-resize-worker-report-2.md
- C:\dev\spatial-ide\state\consults\2026-10-11-shell-map-refill-after-resize-worker-report-3.md
- C:\dev\spatial-ide\state\consults\2026-10-10-shell-map-refill-after-resize-worker-report-1.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (§10 and the Round 25 additions)
- C:\dev\spatial-ide\state\directives\2026-10-07-round-66-and-67-rulings.md (lines 20-30)
- C:\dev\spatial-ide\state\directives\2026-10-09-rulings-on-the-eight-forms.md (lines 20-27)
- C:\dev\spatial-ide\frontends\shell\SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md (Amendments 5 and 6, as precedent)
- On main, checked by grep: frontends\shell\src\canvas\tileGrid.ts, frontends\shell\src\streaming\tileViewportStreamManager.ts, frontends\shell\src\residency\candidateArmSession.ts, frontends\shell\src\residency\residencyStatus.ts, frontends\shell\src\canvas\tileGridConstants.ts, frontends\shell\e2e\regression.mjs, engine\src\fixture.rs, kernel\tests\manual_walkthrough_fixtures.rs
- In C:\dev\wt\refill at 64de82e6:
  - frontends\shell\e2e\layout.mjs (lines 280-574) and frontends\shell\e2e\lib.mjs (lines 550-599)
  - frontends\shell\e2e\console.mjs (HEXLIM)
  - frontends\shell\e2e\README.md (line 754) and frontends\shell\MANUAL-WALKTHROUGH.md (Part V)
  - frontends\shell\src\canvas\tileGrid.ts
  - frontends\shell\src\canvas\WorkingCanvas.tsx (fitToExtent and the Deck construction)
  - frontends\shell\src\streaming\tileViewportStreamManager.ts (lines 440-640)
  - frontends\shell\src\residency\candidateArmSession.ts (lines 55-115, 625-682, 1180-1240, 1420-1500)
  - frontends\shell\src\e2e-test-surface.ts (lines 170-339)
  - frontends\shell\src\diagnostics\renderTrace.ts
  - engine\src\fixture.rs (lines 1255-1290) and kernel\tests\manual_walkthrough_fixtures.rs (lines 28-87)
- The diagnostic's raw output, out\fill-diag.log in the custodian's scratchpad: all 27 rows match report 3's table. I did not open the diagnostic's diff; report 3 describes it.
