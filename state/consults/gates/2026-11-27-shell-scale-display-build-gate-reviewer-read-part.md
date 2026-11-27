Reviewed: governance/forms/frontends/SHELL-SCALE-DISPLAY-PREREGISTRATION.md at main @ f39536be767cedc2f6637e3d0d48d286e2bc2688, against the code run in the worktree D:/wt/scale at cbea7d4e06622e5b1debc058ba2a23ea696df761 (PR 368, draft). Shell-scale-display's build gate, the reviewer (Opus), THE READ PART, with no verdict; its run, from its completion notice only (ADV-2026-11-26-02), was 106 tool uses. Filed by the custodian, 2026-11-27: the hand-back saved by Write with the harness's indent removed (24213 bytes, sha256 4d967dac963c24612997edcc7dbc16ad6333b21ceb99be6c507b68fba8398dee), byte for byte below the rule.

---

READ PART: cut/shell-scale-display @ cbea7d4e06622e5b1debc058ba2a23ea696df761 (PR 368, draft). No verdict. The form, the rulings and the worker reports were read in D:/wt/read-1127c at main f39536be767cedc2f6637e3d0d48d286e2bc2688. The code was read and run in D:/wt/scale. `git -C D:/wt/scale fetch -q origin` reported origin/cut/shell-scale-display = cbea7d4e. The tree was clean at the start and after every step (`git status --porcelain` printed nothing).

Everything below is my paraphrase unless it is marked verbatim.

## 1. The diff against §2 and §4 as amended (530d7b0e...cbea7d4e)

**Commands:**
- `git log --oneline 530d7b0e..cbea7d4e` listed six commits: f9604f29, 0fd5b1bb, 1d613b04, 9f8b67cd, 8c1e68d3, cbea7d4e.
- `git diff --stat 530d7b0e...cbea7d4e`: 13 files, 522 insertions and 4 deletions.
- `git merge-base` printed 530d7b0e.

**Files:**
- **App.tsx.** The `ScaleItem` import, `readZoom` (useCallback over `canvasRef.current?.currentView?.()?.zoom ?? null`) and the `status.scale` slot as §2 item 3 writes it. Nothing else.
- **regionParts.tsx.** The header now says "three", the `useSyncExternalStore` and scaleBar imports, and `ScaleItem`. The snapshot is `getBox() === null ? null : readZoom()`. There is no role, timer or await. The `unit: string` and `getBox: () => object | null` types follow ADV-2026-11-27-25 item 2.
- **scaleBar.ts.** The constants, `scaleLabel`, `readingAtPxPerUnit` (bounded search from k = -4 to 7, with a guard on 0 and non-finite values) and `scaleReading(unit: string, …)`, as Amendments 2, 4 and 6 restate them, and the four strings.
- **contributions.ts.** `{ id: "scale" }`, last.
- **styles.css.** `.status-scale` and `.status-scale-bar`; `.status-bar` is untouched.
- **WorkingCanvas.tsx.** One comment line, now :149 at the base. Its sentence matches Amendment 2 item 10's New byte for byte.
- **StudioLayout.test.tsx.** One NO_SLOTS line.
- **Tests.** U-SB1 to U-SB4 in scaleBar.test.ts, R-SC1 in App.scale.test.tsx and E-SCALE in layout.mjs match §4 and Amendments 2, 4 and 6:
  - U-SB1 has the cases 30, 12, 29.999, 11.99 and Z1 to Z3;
  - U-SB2 sweeps -19 to 16 in steps of 1/64 and asserts a bar at every step;
  - U-SB3 has k = -3, -1, 0, 3, 5 and 7;
  - U-SB4 adds NaN, ±Infinity and ±1100. It also has extra in-range and out-of-range cases (-19.68, -20, 16.88, 17 and -19.6, 16.8), which sit inside its title;
  - R-SC1 (ii) fires in one act and asserts at once;
  - E-SCALE runs Z1 to Z6, then Z1 again, W and D, checks the rect, and records the DPR.
- **Docs.** KNOWN-LIMITATIONS.md (item 80), MANUAL-WALKTHROUGH.md (Part AI) and e2e/README.md (the E-SCALE entry).

**Result:** every product item and every test is inside §2 and §4 as amended. I found no change §2 does not describe.

**One record departure.** P0 commit 2 (0fd5b1bb) also carried KNOWN-LIMITATIONS, Part AI and the README entry: `git diff --stat f9604f29 0fd5b1bb` showed 5 files, 54 insertions and 7 deletions. §4 has commit 2 hold only the implementations and the :148 comment. It touches no result; see finding D2.

U4 correction 8c1e68d3: `git diff 9f8b67cd 8c1e68d3` changes only the three import lines, the two types and the two doc sentences (ADV-2026-11-27-25 item 4).

Words commit cbea7d4e: `git diff 8c1e68d3 cbea7d4e` changes only the ruled texts and four literals in App.scale.test.tsx's expectations, as ADV-2026-11-27-28 item 1 allows. The title assertion still checks the length.

## 2. §7's count

Command: `git diff --numstat 530d7b0e...cbea7d4e -- frontends/shell ':!frontends/shell/MANUAL-WALKTHROUGH.md' ':!frontends/shell/e2e/README.md'`, summed by awk. It printed (verbatim) `ins 487 del 4 total 491 files 10`. The ceiling is 760 lines over 10 files.

| File | Changed lines | Ceiling |
|---|---|---|
| scaleBar.ts | 71 | 90 |
| regionParts.tsx | 37 | 45 |
| App.tsx | 7 | 20 |
| contributions.ts | 1 | 3 |
| styles.css | 15 | 25 |
| WorkingCanvas.tsx | 2 | 3 |
| scaleBar.test.ts | 89 | 180 |
| StudioLayout.test.tsx | 1 | 2 |
| App.scale.test.tsx | 184 | 240 |
| layout.mjs | 84 | 150 |

Outside the count, by the full numstat:
- KNOWN-LIMITATIONS.md: 4 of 10;
- MANUAL-WALKTHROUGH.md: 29 of 45;
- e2e/README.md: 2 of 20.

`git diff --name-only … -- ':!frontends/shell'` printed only KNOWN-LIMITATIONS.md. There is no overrun and no class 8.

§7 is not edited. Lines 1 to 323 of the form have the same sha256 at its first commit b42c0ed7 and at main (be9bcb52…).

## 3. The mutations, observed again at cbea7d4e

**The driver.** D:/wt/scale-logs/mutate.py: `sha256sum` printed a7ec5f85616c049443fcaa0b6fceb845d888ec552ca200007b3fb9d56fd02dae and `wc -c` printed 1200, so it matches the brief. I read it whole. It applies one replacement and asserts that the Old text occurs exactly once. It names a test file but never runs one; there is no subprocess call. I ran each test myself.

**Each entry against §4, as amended:**
- **M1** (`>=` becomes `>` in readingAtPxPerUnit). This is the mutation of Amendment 6 item 8: there is one comparison with SCALE_BAR_MIN_PX. It matches the RECORDED MUTATION line in scaleBar.test.ts:22.
- **M2** (`[1, 2, 5]` becomes `[1, 5]`). This is §4's mutation and matches :43.
- **M3** (`exponent = Math.abs(exponent);` at the start of scaleLabel). It drops the sign for k < 0, as §4 has it, and matches :60.
- **M4** (`unit !== "metre"` becomes `unit === "degree"`). This is the logical form of Amendment 4 item 10's M4 at the one unit check, and it matches :76.
- **M5** (`useSyncExternalStore` becomes a single read). This is §4's mutation and matches App.scale.test.tsx:153-154.

**Old texts.** A python count at the head printed 1 for each of M1 to M5, and the files have LF endings. Each entry was applied as the driver has it.

**Runs.** Each ran in its own shared hold: `python3 D:/wt/scale-logs/mutate.py Mn && npx vitest run <file> > D:/wt/scale-logs/read-Mn-at-cbea7d4e.log`. Each exited 1. Each was reverted with `git checkout -- <file>`, and porcelain was empty after each.

| Mutation | Log | Result |
|---|---|---|
| M1 | read-M1-at-cbea7d4e.log | U-SB1 fails at the assertion at scaleBar.test.ts:25:69. Verbatim: `AssertionError: 30 px per unit: L 2, width 60: expected { kind: 'bar', mantissa: 5, …(2) } to deeply equal { kind: 'bar', mantissa: 2, …(2) }`. 1 failed, 3 passed. The 30 case is observed; the 12 case (:26) is unobserved. |
| M2 | read-M2-at-cbea7d4e.log | U-SB2 fails at :52:87. Verbatim: `zoom -18.34375: the width stays under SCALE_BAR_MAX_PX: expected 150.29724551276078 to be less than 150`. U-SB1 also fails at :25. 2 failed, 2 passed. |
| M3 | read-M3-at-cbea7d4e.log | U-SB3 fails at :73:124. Verbatim: `5 x 10^-3: expected '5,000' to be '0.005'`. k = -3 is observed; k = -1 is unobserved. |
| M4 | read-M4-at-cbea7d4e.log | U-SB4 fails at :79:126. Verbatim: `other at zoom 0: expected { kind: 'bar', mantissa: 1, …(2) } to deeply equal { kind: 'not-metre' }`. `other` is observed; `unestablished` is unobserved. |
| M5 | read-M5-at-cbea7d4e.log | R-SC1 fails at App.scale.test.tsx:164:62. Verbatim: `(ii) the label for zoom 0: expected undefined to be '100 m (CRS)'`. Case (ii) is observed. |

- Every failure is at the test's own assertion. None is a compile or import error. Under M5 the unused `useSyncExternalStore` import would fail tsc, but vitest does not type-check, so the red is at the assertion.
- The unobserved cases are unobserved because each test stops at its first failing expectation. No test was changed to reach them.
- M6 and E-SCALE's P0 red are the tester's.

**P0's red.** The record shows f9604f29's tests red for their own reasons:
- f9604f29's scaleBar.ts has the three stubs: scaleLabel returns "", and readingAtPxPerUnit and scaleReading return none (`git show f9604f29:…scaleBar.ts`).
- c1-red-run-at-f9604f29.log has 5 failed of 5, each an AssertionError at the reason Amendments 2 and 4 predict:
  - U-SB1: 30 gives none;
  - U-SB2: zoom -19 gives none;
  - U-SB3: '' where '0.005' was expected;
  - U-SB4: metre gives none;
  - R-SC1 (ii): undefined.
- c1-red-run1.log is a second run that differs only in timings (by diff).

## 4. The suites at the head (shared holds)

| Suite | Exit | What it printed |
|---|---|---|
| `npm run typecheck` (frontends/shell) | 0 | tsc printed no error (read-typecheck-at-cbea7d4e.log) |
| `npm test` | 0 | Verbatim: `Test Files  134 passed (134)`, `Tests  1688 passed (1688)` (read-npmtest-at-cbea7d4e.log) |
| CI's `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | tests 623, pass 623, fail 0 |
| verify-cites (tool e0c84fe2) | 0 | Verbatim: `verify:cites PASS — every rooted (in-tree) path:line reference across 3747 file(s) resolves. (221 loose reference(s) advised above.)` |
| verify-quotes (e46167d5) | 0 | PASS: 159 checked, 128 verified, 0 hash-reference errors, 944 ruling cites, 0 ruling-cite errors |
| verify-test-claims (494cea7b) | 0 | PASS: 901 claimed tests across 293 files |
| verify-mutation (7d24ed15) `--base 530d7b0e… --head HEAD` | 0 | Verbatim: `verify:mutation PASS — all 5 new test(s) have a recorded mutation naming them.` This is not an observation. |
| verify-plan (scripts/plan/verify.mjs, 494cea7b) | 0 | PASS against the branch's own PLAN.yaml |

Notes on the suites:
- **A cargo call inside `npm test`.** During vitest, an existing test (src/notices/noticeDeterminism.test.ts, which calls `cargo metadata`) printed 35 lines of "Blocking waiting for file lock on package cache". Another process held the cache lock. The run still passed. I ran no cargo command of my own.
- **§9's "the shell's format check"** has no script: frontends/shell/package.json has none, and product-ci-shell.yml runs `npm run verify`. Nothing was run for it.
- **Branch CI** (`gh run list --branch cut/shell-scale-display`): at cbea7d4e, these completed with success:
  - Governance CI;
  - Product CI — shell (two runs);
  - DCO;
  - Exposure scan;
  - Ported notices (two runs);
  - Rust fmt;
  - Product CI — Rust workspace.
- No clippy was run.

## 5. The clause checks, byte for byte

A node script took the five ````text fences from ADV-2026-11-27-28's filed file and counted each against the head files.

- **S-1 to S-4**, with {L} as `${decimal}`, the value scaleLabel returns: each stands once in scaleBar.ts (lines 34, 37, 39, 41).
- **The doc comment.** Its New stands once, with the line wraps joined (lines 29-30). Its Old stands 0 times.
- **`MARK` and the placeholder prefix.** In scaleBar.ts, `MARK` occurs 0 times, `P6 placeholder` 0 and `[P6` 0.
- **Item 80** (title and paragraph): the fence occurs once in KNOWN-LIMITATIONS.md, with no `P6 placeholder` after it.
- **Item 80's comment spans.** Span 1: New 1, Old 0. Span 2: New 1, Old 0.
- **Part AI's body.** It stands once, directly after its heading, and ends the walkthrough file.
- **Other rulings' New texts the form carries:**
  - Amendment 2 item 10's caller sentence: once, in WorkingCanvas.tsx.
  - Amendment 10's ids: by script, no added code or test line names S-1 to S-4 without `SHELL-SCALE-DISPLAY ` before it (0 lines; 12 lines carry the form's name).

## 6. ADV-2026-11-27-28's places

**AI1 and filter-zoned.parquet: confirmed, a dataset in metres.**
- The generator is `generate_the_filter_fixture` in kernel/tests/manual_walkthrough_fixtures.rs:616-628. Its `FixtureSpec { features: 2_000, …, ..Default::default() }` sets no CRS or domain.
- The defaults are in engine/src/fixture.rs:681-705: `crs_mode: CrsMode::DeclaredLv95` (:688) and `domain: CoordinateDomain::Lv95Metres` (:696).
- DeclaredLv95 writes `"crs":{LV95_PROJJSON}` (:882). LV95_PROJJSON is `include_str!("../tests/data/epsg2056.projjson")` (:45).
- That file's top-level coordinate_system is Cartesian (:39), with Easting and Northing in `"unit": "metre"` (:41-42), and id EPSG 2056 (:45).
- The engine reads only `coordinate_system.axis[0..1]` (engine/src/geoparquet.rs:816-833, `coordinate_unit_from_projjson`). Both axes say metre, so it records `CoordinateUnit::Metre`.
- AI1 needs no change.

**The e2e README's E-SCALE entry against layout.mjs at the head.** Clauses not listed below hold.

| Clause | Holds? | Where |
|---|---|---|
| last step before the fixtures check | yes | :658 runs E-SCALE after BURST and before the FIXTURES push |
| on the 100k dataset open at the end of the suite | yes | E-REOPEN opens FIXTURE_100K at :403. The only openPath calls are at :110, :403 and :603, and the centre is that fixture's PARCEL_AREA (:422, :568) |
| then on corpus #8 | yes | :603 |
| Z1 to Z5 at zooms 0, -3, 2.5, -10 and 10 through e2eSetViewState | yes | SCALE_BAR_ROWS and setZoom at :533-539 and :569 |
| the labels in the label's own form | yes | waitForScale(scaleBarLabel(decimal)) at :574 |
| the widths within 1 CSS px | yes | assertBar, SCALE_WIDTH_TOLERANCE_PX = 1 |
| the item's rect inside .status-bar's | yes | assertBar, with 0.5 px slack |
| **"its title and accessible name agree"** | **not as stated** | The script compares `getAttribute("title")` and `getAttribute("aria-label")` with S-2. It never reads an accessible name computed by the accessibility tree. To the advisor, unreworded. |
| Z6 at zoom -30: S-4 and no bar | yes | :582-585 |
| W: Z1 again, one notch, zoom not 0, label and width are scaleReading's through loadShellModule | yes | :587-598. It also asserts the label differs from Z1's, which the clause does not mention. |
| D: sha256 must equal MANIFEST.json's or stop on I5; S-3 and no bar | yes | :600-607. An absent file also stops on I5. |
| records devicePixelRatio | yes | It is taken from the last barRow (Z1 again) and returned in the step's note |
| **"claims the bar's length at no ratio other than 1.0"** | **no line does this** | The step neither checks nor qualifies the ratio. At any DPR it asserts the same CSS widths and prints PASS, with the DPR in the note. To the advisor, unreworded. |
| Windows only | yes, in substance | Windows fixture paths and WebView2 through attachOrLaunch. There is no explicit platform check. |

## 7. SCALE_BAR_MAX_PX

Searched frontends/shell/src and e2e for the exports, excluding *.test.ts. SCALE_BAR_MAX_PX is defined at scaleBar.ts:13 and appears otherwise only in comments (:6, :11). No product code and no e2e code reads it; scaleBar.test.ts imports it.

The Block-on-sight item on exports with no product caller (§8 item 9) is therefore true against it.

The other exports:
- SCALE_BAR_MIN_PX, SCALE_EXPONENT_MIN/MAX and SCALE_MANTISSAS are read by product code inside the module (:53-57).
- ScaleMantissa and ScaleReading are types in the module's exported signatures.

Ways out, and whether each moves a §7 constant or a claim:
- (a) **A product reader.** For example, readingAtPxPerUnit refuses `widthPx >= SCALE_BAR_MAX_PX`. No constant or claim changes. It adds a branch no input reaches in exact arithmetic, so its mutation would survive.
- (b) **Un-export it.** `noUnusedLocals: true` (tsconfig.json:15) would then fail typecheck. So it must be removed, and the test must restate 150. That moves a §7 constant out of `layout/scaleBar.ts` and changes §7's table, so it goes to the advisor.
- (c) **Keep it.** The instrument-accessor exemption covers read-only accessors over state, not constants, so it does not apply as written.

## 8. U4

- `npm test` above includes `src/layout/layoutBoundary.test.ts` (U4), and it passed: 134 of 134 files.
- `grep -rnE 'from "\.\./(skp|canvas|streaming|residency)/' src/layout/ | grep -v '\.test\.tsx\?:'` printed nothing (rc 1). The same search for dynamic imports also printed nothing.
- App passes `unit={admitted.describe.crs.unit}` and `getBox={viewBox.get}` (App.tsx:2638). The store's get returns `AuthoritativeBbox | null`, an interface (viewportBbox.ts:5, FeaturePanel.tsx:26-40). A search for `\bas [A-Za-z]` in App.tsx's diff found nothing (rc 1). There is no cast, and the typecheck is green.

## 9. Block-on-sight (§8), item by item

1. **Untrue.** All 13 files are in §7's list or its three declared outside the count (check 2).
2. **Untrue.** The only change under canvas/ is the comment line (WorkingCanvas.tsx:149, the hunk at -146,7).
3. **Untrue.** No dependency, lockfile, workflow, wire, kernel, engine or src-tauri change (file list).
4. **Untrue.** A bar is shown only for metre (scaleBar.ts:69). There is no ratio. A grep for "ground" in the strings shows only S-2's negation (:37).
5. **Untrue.**
   - The open writes `viewBox.set(null)` synchronously before the setters (App.tsx:1203).
   - `showBox` writes only for the current dataset (:2431).
   - The snapshot is null while the box is null (regionParts.tsx:246).
6. **Untrue.** App.tsx has no `useSyncExternalStore` (grep) and holds only the `readZoom` callback.
7. **Untrue.** ScaleItem has no timer, await or role (regionParts.tsx:228-258), and R-SC1 asserts that no role is set.
8. **Untrue.** The four strings are ADV-2026-11-27-28's. The drafts landed under the mark, which ADV-2026-11-27-25 item 5 (i) held right.
9. **True for SCALE_BAR_MAX_PX** (check 7). Every prop and callback has a product caller.
10. **Untrue.** StudioLayout.test.tsx gains only the NO_SLOTS line. App.save.test.tsx and WorkingCanvas.wiring.test.tsx are not in the diff.
11. **Untrue.** The worker's report calls verify-mutation a check only, and its mutations carry the commit 1d613b04. Mine carry cbea7d4e (check 3).
12. **Untrue.** There is no overrun, and §7 is unedited (check 2).
13. **Untrue in the diff.**
    - No DECISIONS-PENDING cite was added, and none of the new lines carries a hash.
    - Part AI carries no cite into its own file (grep rc 1).
    - The new cites point into files this piece does not edit: viewportBbox.ts:16-23, which still holds the CSS/DPR-1.0 reading at the head; pan-anchor.mjs:47-50; fixture.rs:93.
14. **Not applicable.** No merge has been made. Amendment 8 item 8 replaced the reading "after the tag".

Class 9 order:
- Amendment 10 (156559cb, 12:15:56+01:00) is before f9604f29 (12:33:13).
- Amendment 13 (05b18d55, 14:01:58) is before 8c1e68d3 (14:05:06).
- Amendment 14 (90d7286f, 14:25:05) is before cbea7d4e (14:26:45).

## 10. Seams (§9) and their tests

| Seam | Test | Status |
|---|---|---|
| `currentView?()` | R-SC1 (stand-in); E-SCALE through the real app (every row's readZoom; W's e2eReadWorkspace) | R-SC1 green, red under M5. E-SCALE is the tester's (M6). |
| The report props `onViewShown` and `onViewportChanged` (WorkingCanvas.tsx:580, :605; App.tsx:2456, :2509) | R-SC1 fires both | Green, red under M5 at (ii) |
| The DEV seam, the interactive notch and the auto-fit | E-SCALE only | Not run |
| `createViewBoxStore` get and subscribe | R-SC1 through the real App | Green, red under M5 |
| `CrsUnit` | The typecheck proves the assignment at App's slot (ADV-2026-11-27-25 item 2) | Green |
| `STATUS_ITEMS`, `Slots`, the footer | R-SC1 through the real StudioLayout; the typecheck; StudioLayout.test.tsx | Green |
| `e2eSetViewState`, `doWheel`, `e2eReadWorkspace` | E-SCALE only | The tester's |

Guarantees:
- The bounds and the 1-2-5 rule: U-SB2, red under M2.
- Metre only: U-SB4, red under M4.
- The label format: U-SB3, red under M3.
- The boundary: U-SB1, red under M1.

All four are green at the head.

## 11. The workers' departures

- **Build report:**
  - The code drafted before step 0 was set aside. Step 0's vitest log has 0 scaleBar or App.scale entries and 132 files / 1683 tests, so it ran on the clean base.
  - The mark and the Part AI points are superseded by ADV-2026-11-27-28.
  - The verify chain killed at 1d613b04 was re-run at 9f8b67cd.
  - The tests briefly made soft and reverted: mut-M1 to M5.log each show a single assertion error, so no recorded result came from soft tests.
  - Its mutations at 1d613b04 predate 8c1e68d3 and cbea7d4e, which change code those mutations touch. Check 3 re-observes them at the head.
  - No departure touches a result.
- **U4 correction report:** "none". Its verify batch ran outside a hold, and those scripts are not heavy. No result is touched.
- **Words report:** "none". Its background wait timed out and its verify scripts were unaffected. No result is touched.

## Findings

**C1. Correctness (caller rule, §8 item 9). SCALE_BAR_MAX_PX is an export with no product caller.**
- Evidence: check 7's search; its only readers are scaleBar.test.ts and comments.
- ADV-2026-11-27-25 item 6 gives the architect's read part the call on whether item 9 blocks.
- The correction changes code, or the form if way (b) is taken. Way (b) moves a §7 constant, so it goes to the advisor.

**E1. Evidence. Three of §4's named failing sets are observed at their first case only.**
- M1's 12, M3's k = -1 and M4's `unestablished` are unobserved, at 1d613b04 and at cbea7d4e alike, because each test stops at its first failing expectation (check 3).
- The kill itself is observed for all five.
- The record must not call those three cases observed. Reaching them would change test code (for example, soft expectations), so that is the advisor's call.
- No code change is owed for the record as it stands.

**D1. Documentation (to the advisor, unreworded, under ADV-2026-11-27-28 item 4).** Two clauses of the e2e README's E-SCALE entry are not what layout.mjs does:
- "its title and accessible name agree": the script reads the aria-label attribute, not an accessible name;
- "claims the bar's length at no ratio other than 1.0": no line acts on the ratio.

No words are proposed. A correction that makes the script read the accessibility tree, or check the DPR, would change test code.

**D2. Documentation. The record omits part of P0 commit 2.**
- The build report and Amendment 11 do not say that 0fd5b1bb also carried KNOWN-LIMITATIONS, Part AI and the README entry (54+/7- over 5 files), beyond §4's statement of what commit 2 holds.
- It touches no result.
- The fix is one reference in the closing amendment. It changes no code.

**D3. Documentation, must-fix before the merge. PR 368's body is stale at the head.** Each Old below was checked by node against `gh pr view 368 --json body` (saved to D:/wt/scale-logs/read-pr368-body.txt) and occurs exactly once. These are the custodian's words, not ruled, and none changes code.
1. Old: `Amendments 1 to 13 are on main. Amendment 14, the words under ADV-2026-11-27-28, is in the records commit now at its gate.`
   New: `Amendments 1 to 14 are on main; Amendment 14, the words under ADV-2026-11-27-28, is at 90d7286f.`
2. Old: `so the layout boundary test U4 holds (ADV-2026-11-27-25; the form's Amendment 13).` followed by its newline.
   New: the same line, then the new line `  - cbea7d4e: the words under ADV-2026-11-27-28 (the form's Amendment 14): S-1 to S-4 without the mark, KNOWN-LIMITATIONS item 80 and Part AI.`
3. Old: ``(`git diff 530d7b0e...8c1e68d3`, 13 files``
   New: ``(`git diff 530d7b0e...cbea7d4e`, 13 files``
   The counts that follow it (522/4, 491 of 760 over 10) hold at cbea7d4e by check 2.
4. Old: `- **Checks at 8c1e68d3**, the worker's runs in shared holds:`
   New: `- **Checks at 8c1e68d3 and again at cbea7d4e**, the workers' runs in shared holds:`
   The figures under it are the same at both heads, by the words report and check 4.
5. Old: `  - one words commit under ADV-2026-11-27-28: S-1 to S-4 without the mark, KNOWN-LIMITATIONS item 80, and Part AI;` followed by its newline.
   New: nothing (delete the line).

**D4. Documentation. §9's suite "the shell's format check" has no script to run** (check 4). The record should say that none exists rather than count it green. No code change.

**Owed at the run part, not findings:**
- E-SCALE's P0 red and its series;
- M6;
- the DPR record that item 80's last sentence rests on (ADV-2026-11-27-28 item 2).

## Logs

New logs in D:/wt/scale-logs/:
- read-M1-at-cbea7d4e.log to read-M5-at-cbea7d4e.log;
- read-typecheck-at-cbea7d4e.log;
- read-npmtest-at-cbea7d4e.log;
- read-nodetest-at-cbea7d4e.log;
- read-verify-cites-at-cbea7d4e.log, read-verify-quotes-at-cbea7d4e.log, read-verify-test-claims-at-cbea7d4e.log, read-verify-mutation-at-cbea7d4e.log, read-verify-plan-at-cbea7d4e.log;
- read-pr368-body.txt.

No earlier log was overwritten. The last `df -m /c` read 41954 MB available.
