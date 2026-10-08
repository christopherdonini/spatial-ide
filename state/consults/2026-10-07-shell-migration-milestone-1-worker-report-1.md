*Custodian's filing note (2026-10-08): `shell-migration-milestone-1`'s stage 1 worker report, at the branch head 02d70ddedadb9d6fdd7484bf054c38032b988f10 (worker-high run 22:42:21Z to 23:52:44Z on 2026-10-07, by its transcript). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 5d6034a49c3eb7d6218837d7b54d9f83b45e871de8ad378e0721d6ffecf1fcd8. Paths and lines below are at the branch head, not main.*

---

# Stage 1 report: node:shell-migration-milestone-1@g3

Everything is committed and published on `cut/shell-migration-milestone-1`. Head is 02d70ddedadb9d6fdd7484bf054c38032b988f10, equal to origin's. The worktree is clean, and no force flag or rebase was used. Nothing outside `frontends/shell` changed except `KNOWN-LIMITATIONS.md` item 18, which the brief assigns to commit 4. The model is Sonnet 5.5 (`claude-sonnet-5-5`) as the harness reports it. There was no model override and no context handoff.

## 1. Commits (all `-s`, each published as an ordinary push in its own call)

| Hash | Subject |
|---|---|
| d19c84a6c455029a7ec4bdca077ac1e9295f8b8a | feat: the layout seams (reducer, contributions, action registry, status items) and unit tests U1 to U6 |
| 420bc3153ed2ec4623c89e88eb13ae78da304463 | feat: the Map Studio frame in App's return block, styles, component edits and render tests R1 to R8 |
| effd675f4fa34d88e303c1a3a408ea18413cd529 | feat: the e2e changes of §2.7 and the new e2e:layout suite |
| 4b0fb07740a8e1238c3a31d19bf27b56593c0882 | fix: e2e/layout.mjs selects the Inspector's Layer tab after its first open |
| 13df4cb531c1a1fe18bac0d8e855ac2c68ab012c | docs: the walkthrough, e2e/README.md, and KNOWN-LIMITATIONS 18's retirement |
| 05fe2fe114a53b98c53896f572aeaff5f90863c8 | test: observed mutations of U1 to U6 and R1 to R8 recorded in the suites |
| 64eb6e7689731eab0dc529cc0632a22d58fc288f | fix: give REGIONS and VIEWPORT_FLOOR their callers (§8 item 11) |
| 02d70ddedadb9d6fdd7484bf054c38032b988f10 | test: U1 and R1 to R8 re-observed at 64eb6e76 (OBSERVED lines only) |

The brief named four commits. The other four are explained in section 6, items 2 and 3.

## 2. §7 count at head, by its command (base e888787e, three-dot)

| Group | Lines | Ceiling |
|---|---|---|
| G1 (7 files) | 952 | 1,000 |
| G2 | 273 | 450 |
| G3 | 337 | 400 |
| G4 | 66 | 100 |
| **G5 (7 files)** | **1,004** | **900, over by 104** |
| G6 | 383 | 400 |
| **Total (25 files)** | **3,015** | 3,250 |

- **G4 parts:** AdmissionPanel 6 (ceiling 6), PublishPanel 10 (12), surfaceRegistry 49 (70), package.json 1 (2).
- **G5 parts:** App.layout.test 468, layoutState.test 219, actionRegistry.test 146, statusItems.test 111, layoutBoundary.test 57, PublishPanel.test 2, soleCaptureSite.test 1. The 52 mutation-record comment lines are part of it.
- **G6 parts:** layout.mjs 357 (360), regression 19 (24), style 3 (8), source-changed 2 (4), source-watch-idle 2 (4).
- **Outside the count:** MANUAL-WALKTHROUGH 118 (180), e2e/README 12 (40), KNOWN-LIMITATIONS 11 (20).
- **By commit, total:** d19c84a6 908; 420bc315 2,572 (G5 951, already over); effd675f 2,955; 4b0fb077 2,956; 13df4cb5 2,956; 05fe2fe1 3,008; 64eb6e76 and 02d70dde 3,015.

The G5 overrun is class 8 and §7's line is not edited. The tests were not trimmed, because that would force every mutation to be observed again. The call is yours.

## 3. Mutations, U1 to U6 and R1 to R8

Each was applied by hand, its test run alone with `-t`, the failure read, and the file reverted with `git checkout`. The tree was clean after each. U2 to U6 were observed at d19c84a6. U1 and R1 to R8 were observed first at 420bc315 (U1 at d19c84a6) and again at 64eb6e76. The suites' OBSERVED lines name 64eb6e76 for U1 and R1 to R8. No `verify-mutation` run was used as an observation.

| Row | Mutation | Failing assertion |
|---|---|---|
| U1 | `effectiveSizes` shrink step deleted | `expected [ …(3) ] to deeply equal []`; the first offender is a 458 x 424 map at 1024 x 640. Both state-sweep cases fail |
| U2 | `toggle(layers)` also closes Activity | "toggle(layers) flips that region's open and leaves everything else deep-equal": `activity.open` is received false, expected true |
| U3 | max clamp removed | `expected 980 to be 480` (layers; inspector 1060 to 560; activity also fails) |
| U4 | `import "../skp/client"` added to layoutState.ts | received `['layout/layoutState.ts imports ../skp/client']` |
| U5 | I and J bindings swapped | first of 4 failures is "Mod+I toggles the Inspector (Ctrl)": `expected 'layout.toggleActivity' to be 'layout.toggleInspector'` |
| U6 | session-ended guard dropped | `expected '[P6 placeholder] source watch: watchi…' to be null` |
| R1 | `<main>` keyed on `inspector.open` | "mounts after every layout action": `expected [ …(5) ] to deeply equal [ Array(1) ]` (the form's "reaches 2"; here 5) |
| R2 | closed section content rendered as null | the node-identity assertion: the reopened input is fresh with `value=""` |
| R3 | focus relocation removed | `expected <input class="filter-predicate"> to be <main id="region-map">` |
| R4 | Inspector aside moved before `<main>` | "region 4 follows region 3 in the DOM: expected +0 to be truthy" |
| R5 | `onZoomToLayer={() => {}}` | `expected +0 to be 1` (the `fitToBounds` call count) |
| R6 | `key={admitted?.dataset}` on StudioLayout | "Layers still closed after the reopen: expected false to be true" |
| R7 | the `layout.toggleLayers` `recordNamed` call removed | `expected [] to deeply equal ['layout.toggleLayers']` |
| R8 | DescribeSummary restored in AdmissionPanel and App's `section.source` dropped | `the given combination of arguments (undefined and string) is invalid for this assertion`, at the first Source summary check. The message is poor, but the assertion is the right one |

The E rows' mutations are stage 2's.

## 4. Light checks, with exit codes (at head)

- **`npx tsc --noEmit`:** rc 0. It was also rc 0 at the base and after each commit.
- **`npx vitest run <file>`, one file at a time, all rc 0:**
  - layoutState.test 12 passed; layoutBoundary.test 2; actionRegistry.test 27; statusItems.test 10; App.layout.test 8.
  - soleCaptureSite.test 5; PublishPanel.test 42.
  - Also run as neighbours, rc 0: surfaceRegistry.test, consoleLanguage.test, surfaceCompleteness.test, DescribeSummary.test, AdmissionPanel.test, App.test (71) and App.lateResult.test (21).
- **`node --check`** on layout.mjs, regression.mjs, style.mjs, source-changed.mjs and source-watch-idle.mjs: rc 0.
- **eslint:** the package has none (no eslint in its devDependencies), so none was run.
- **`node scripts/plan/verify-quotes.mjs --show-cites`** on the three doc files:
  - rc 1 both before and after my edits, with the identical set of 30 "quote not found" lines, so none is new.
  - I ran it unprompted. It is not a gate run, and I did not run verify-cites or verify-test-claims.
- **Test setup:** `src/generated/NOTICE.txt` did not exist in the fresh worktree and `App.tsx` imports it. I wrote a gitignored stub so the vitest runs could resolve it. It is not tracked. `npm run verify`'s prebuild regenerates the real file.

## 5. §0.4 at the base (I4)

No difference, so I4 is clear. Hashes were recomputed for every §0.4 cite.
- These are identical: DescribeSummary.tsx:20, App.tsx:1843, recorder.ts:360, surfaceRegistry.ts:207-214, soleCaptureSite.test.ts:49-60, skp/types.ts:66-69, App.tsx:484 and :493, FilterPanel.tsx:10, App.lateResult.test.tsx:324-360.
- types.ts watcher facts moved down one line, to 201-204 and 210-231. Their content hashes match the pins exactly.
- App.tsx:1649-2024 and :767 are unchanged. The WorkingCanvas and regression.mjs lines moved (the lines cut touched them); I did not rely on them.

Amendment 2 is not in this branch's copy of the form. It is on main at 4efa042a, which is a child of the base. I read it with `git show 4efa042a:frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md` and added nothing to the branch. The branch needs main merged, by you, before the gates.

## 6. Deviations from the form and from the brief

1. **G5 overrun** of 104 lines, class 8 (section 2).
2. **Commit split.**
   - StudioLayout.tsx and regionParts.tsx are in commit 2, not 1. StudioLayout imports `recordNamed` with row names that exist only once G4's surfaceRegistry rows and the soleCaptureSite allowlist line land, so it could not be green on its own in commit 1.
   - `contributions.ts` gained `INSPECTOR_SLOT_IDS` in commit 2.
3. **Four extra commits.**
   - 4b0fb077 is a one-line layout.mjs fix.
   - 05fe2fe1 and 02d70dde carry the OBSERVED comments. A comment that names the commit a test was observed at cannot be inside that commit.
   - 64eb6e76 gave `REGIONS` and `VIEWPORT_FLOOR` callers under §8 item 11. `VIEWPORT_FLOOR`'s only reader is U1 (test-only), which §7 names as its consumer.
4. **Strings outside §2.8's list:** three splitter `aria-label`s and the attention strip's landmark name. All are `[P6 placeholder]`-marked, because the separators and the labelled section need accessible names. Walkthrough row U10 lists them for sight.
5. **The walkthrough Part is lettered U, not X.** The form's rows X1 to X9 are U1 to U9, because U is the next unused letter. U10 is the sight of the placeholder strings; this is an addition. I read the form's "X" as a placeholder for the letter.
6. **Button and disclosure labels followed the export label** in every row that names them, not only where the headline is quoted. This extends Amendment 1 item 4 on the model of T5. The rows are G1, G2, G4, G5, G7, G8, H6, H8, J4, M8, M10, N5, R1, S3, P4 and T5.
7. **layout.mjs differences from the form's wording.**
   - E-FIT's "fallback: a launch with a config overlay" is not built; the suite throws a STOP message instead.
   - E-LANDMARKS reads the accessibility tree over CDP on a best-effort basis, with a DOM check as the assertion.
8. **R7's single test also asserts** one `layout.resizeRegion` row per finished drag and per keyboard step.
9. **KNOWN-LIMITATIONS item 18** is retired in place with its number kept, as DRAFT wording for your sight. The OPEN-7 line is not written; it depends on RESIZEQ.
10. **ScanLivenessMirror has no `role="status"`**, to avoid announcing the same text twice beside FilterPanel's own. Cancel stays only in FilterPanel.

## 7. Walkthrough rows changed, old to new

Only location words and labels changed. No result-log text was edited.

**Location words**

| Row | Old | New |
|---|---|---|
| A1 | `nothing else below it` | `button in the Layers region and no dataset on the map yet` |
| A3 | `a summary list appears:` | `appears in the Inspector's Source section (Layer tab):` |
| A4 | `canvas area below the summary` | `the map region` |
| A4 | `fills the remaining window space` | `fills the map region` |
| A4 | `Zoom to layer ... at the top-right of the canvas` | `on the dataset's row in the Layers region` |
| D2 | `the canvas area` | `the map region, the attention strip above it and the status bar` |
| D2 | `banner appears` | `banner appears in the attention strip` |
| D2 | status line | `status line also appears in the status bar` |
| D3 | `Dismiss on the red banner` | `... in the attention strip` |
| D3 | `The status line remains` | `The status line in the status bar remains` |
| E1 | `Below the summary, ... in the app's normal flow` | `In the Inspector's Filter section (Layer tab)` |
| E5 | banner and status line | `banner (in the attention strip)` and `status line (in the status bar)` |
| E7 | `status line that remains` | `... in the status bar` |
| F1 | `Below the filter panel`; `BELOW the canvas (not above it ...)` | `In the Inspector, open the Style tab`; `in the Inspector's Style tab` |
| G1 | `Below the filter panel, expand ▸ Style` | `In the Inspector, open the Style tab, expand ▸ Style` |
| G1 | `expand ▸ Publish, below Style`; `▾ Publish` | `go back to the Layer tab and expand ▸ Export, in its Export section below Filter`; `▾ Export` |
| J1 | `Console disclosure at the bottom of the window` | `Open the Activity region (Ctrl+J, or its top-bar toggle), then click ▸ Console in its Console tab` |
| J1 | `drawer` (twice) | `Console panel` |
| J3 | `Expand ▸ Style` | `In the Inspector's Style tab, expand ▸ Style` |
| J4 | `drawer's text` | `Console panel's text` |
| M3 | `bottom of the window, beside ▸ Console` | `in the Activity region's Notices tab: open the region first with Ctrl+J or its top-bar toggle` |
| N6 | `canvas status stack` (twice, with `status stack:`) | `attention strip above the map` / `attention strip:` |
| Q1 | `the status stack` | `the attention strip above the map` |
| T4 | `click the ▸ Style disclosure` | `open the Inspector's Style tab, click ▸ Style` |

**OPEN-1 (A)**
- B2 and I1: `No summary, no canvas change` becomes `No new summary, no canvas change (a dataset already on the map keeps its summary in the Inspector's Source section)`. The refusal panel is now stated to be in the Layers region.
- Coverage rows `B2'/B3'` and `ABSENTCRS'`: `.describe-summary is absent` becomes `... absent from the Layers region`.

**OPEN-4: export labels and headline**
- Old `**Publish…**` becomes `**Export interactive map…**` in G1, G2, G4, G5, G7, G8, H6, H8, J4, M8, M10, N5, R1, S3, P4 and T5.
- H6's prose `before clicking Publish` follows.
- `▸ Publish` and `▾ Publish` become `▸ Export` and `▾ Export`.
- `Publish panel` becomes `Export section` in G4, M10 and N5.
- `"Published."` becomes `"Exported."` in G5 and M8.

## 8. What stage 2 must run

**Base `package.json` scripts**
- `npm run verify`. At the base it runs, in order: typecheck, check:dev-origin, check:origin-event, verify:adr-index, build, check:dist-clean, check:dist-notice, test, test:residency-trace, test:citation-integrity.
- `e2e:regression`, `e2e:refusal-contract-baseline`, `e2e:admission`, `e2e:filter`, `e2e:filter-panel`, `e2e:style`, `e2e:publish`, `e2e:console`, `e2e:residency-harness`, and `e2e:debug`, a debug driver rather than a suite.
- The new `e2e:layout`.

**Suites with no script line, run as `node e2e/<file>.mjs`**
- `source-changed.mjs`: two routes, default and `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post`, each on its own fresh launch (README).
- `source-watch-idle.mjs`.
- `pan-anchor.mjs`.

**Also**
- `e2e:console`'s `REGRESS'` step re-runs `e2e:regression` and `e2e:admission` as subprocesses.
- The governance scripts' `node --test`.
- The E rows' mutations.
- RESIZEQ is run and recorded, then the OPEN-7 limitation line is written from it.
- Fixture drive recorded as a confound (§0.6).

**Predictions that need your decision**
- **Probable I3 in `e2e/console.mjs` step `CLASSC'`.** It does a real Playwright `page.fill(".style-fill-color", ...)` after only a JS-click on `.style-disclosure`. That input is now in the Inspector's Style tab, hidden by default, so the fill will time out unless an earlier suite left the Style tab selected. §2.7's list does not name console.mjs, so I did not touch it.
- **E-FIT's mutation "Inspector default width 900" will not fail.** `effectiveSizes` shrinks it to a 481 px map at 1280 x 800, which passes. A mutation that deletes the shrink step does fail it.
- **Layout is session state.** `e2e:style` leaves the Style tab selected, so a following suite that attaches to the same app can fail on hidden Layer-tab elements. `layout.mjs` clicks the Layer tab first, and `e2e/README.md` says to relaunch between suites.

## 9. Noticed and not done

- Walkthrough S1 says `No describe summary and no canvas appear` with the same OPEN-1 (A) issue as B2, but Amendment 1 names only B2 and I1.
- Not changed:
  - The coverage prose for `publish.mjs` (`Part G's own Publish button`, `the Publish disclosure's own DOM`).
  - F8's stale "no publish button" sentence.
  - Part K's "dark red" status wording, now theme-dependent.
  - The old-layout measurement comments in untouchable files (FilterPanel, StylePanel, `style.mjs` and others).
- Console, Notices and Style keep their own collapsed disclosure inside their tabs, which is the double step the architect's draft noted.

## 10. Pre-gate self-check

- **Interfaces:** every cross-module seam uses the real interface, hash-checked at the base. This covers `scanLivenessText`, `scanLivenessTextShouldShow`, `isScanInFlight`, `SCAN_LIVENESS_DELAY_MS`, `ScanState`, `recordNamed`, `DescribeSummary({describe})`, `canvasRef.current?.fitToBounds()` and the class-C row shape.
- **Evidence:** each completion claim points to a test and a recorded mutation. The e2e suite has not been run, so nothing is claimed for it.
- **Messages:** the user-facing strings describe behaviour present at this commit. New strings are placeholders or sighted names. The watcher text claims only the at-open fact.
- **Assertions:** the R tests assert after the actions, not just the setup. The U1 sweeps assert across the 25-viewport matrix.
- **Caller grep:** every new value export has a non-test caller in `layout/`, `App.tsx` or `regionParts.tsx`. The exceptions are `VIEWPORT_FLOOR` (U1 only, as §7 intends) and `platformOf` (used by `currentPlatform` in its own file). The remaining type-only exports have no cross-file reader.
