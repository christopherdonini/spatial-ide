# PR #207 gate 1 — reviewer
Reviewed: cut/shell-map-refill-after-resize @ cf24f9b41b218e798d365587db57bb82230a0ed4

**Verdict: FAIL, on one Correctness finding (C1).** There are no Evidence blockers. Five Documentation findings must be fixed before the merge. All suites, the e2e run, CI, the hash pins and §7 are green.

## Correctness (blocks)

**C1. After a filter is applied or cleared, a change of map size can ask for a query, including on a shrink.** That breaks §8 item 3, H2, §2.4's "auto-fit reason unchanged", and the second sentence of item 39. I found this by reading the code; I did not observe it in a run. All cites are at cf24f9b4.

How it happens:
- `applyFilter` issues an unrestricted look (`bbox: null`) and then calls `resetFitForNewGeneration` (frontends/shell/src/App.tsx:305, :338). The candidate arm does the same (frontends/shell/src/residency/candidateArmSession.ts:1658).
- `resetFitForNewGeneration` clears only `fitAnchorRef` and `hasAutoFitRef` (frontends/shell/src/canvas/WorkingCanvas.tsx:1526-1529). `lastQueriedRef` keeps the box from before the filter.
- The first batch's auto-fit, `fitToExtent(…, false)` (WorkingCanvas.tsx:1481 for baseline, :1676 for candidate), now writes `cameraRef` (:1337) but not `lastQueriedRef`.
- At the next size change, `viewportAfterResize(fitted camera, pre-filter box, …)` returns `query` whenever the fitted view is not inside the pre-filter view, whether the map grew or shrank. `reportViewport` then sends it to App's debounced query with the active filter.

Why it matters:
- **§8 item 3.** After Apply, the area last asked for is unrestricted, so every new box lies inside it. A query on that size change is item 3, literally.
- **Item 39 is false on this path.** It says, byte-copied from KNOWN-LIMITATIONS.md:367 @ cf24f9b4: "When the map shrinks it asks for nothing, because what it shows is already inside that area."
- **Baseline arm.** The query supersedes the filter's unrestricted look while it is still delivering. That is the cost `notifyViewport: false` exists to avoid (WorkingCanvas.tsx:1474-1480), and §2.4 declares that reason unchanged.
- **Candidate arm (the default).** The query starts a tile plan while the filtered first look is still running.
- **No pointer input is needed.** The status bar and the attention strip are auto-height rows around the map (frontends/shell/src/styles.css:34; form §0.4).

Worker report 1 flagged this edge under "Auto-fit after a filter". Amendment 2 does not address it.

Remedy, for the custodian to decide (either way it needs an amendment before the code changes):
- **Recommended:** set `lastQueriedRef.current = null` in `resetFitForNewGeneration`, so a filter generation's first look stands until its first reported view, as an open's does under OPEN-2 (A). Add a test that proves it and observe its mutation.
- **Otherwise:** narrow item 39's wording. That wording is the human's.

## Evidence (none blocks; observations)

- **E1. The splitter and window cases in item 39 have no asserting e2e.** Item 39's first sentence names a splitter dragged and a window enlarged. RESIZEQ asserts only a region toggle. BURST records 0 lines by construction (Amendment 2 item 10), and no step resizes the window. Those two cases rest on H1 (deck's documented `onResize`, which uses the same callback) and on Part V's V3 and V4.
- **E2. The two e2e mutations do not tell RESIZEQ and FILL apart.** Both fail both steps (`p3-mut-resizeq-head.log` and `p3-mut-fill-head.log`, each rc 1). No mutation is caught by FILL's batch-arrival clause alone.
- **E3. The `onViewportWithinLastQuery` seam is proven by RF8 from the stub, not from the real producer.** RF8 calls the typed prop from the stub. No e2e from the real producer reaches the Export prepare after a shrink. This was preregistered and is not an imagined interface; I record it only.

## Documentation (must fix in this PR before the merge)

- **D1. The PR body's Checks section is missing §9's governance suites.** It omits verify-cites, verify-quotes and verify-test-claims, each named with the tool's commit (round 15(c)), and the governance `node --test`. My runs of them all passed at cf24f9b4. `scripts/plan/` is identical between 4fd3259a and main 5b64b9f8 (`git diff --stat` printed nothing).
- **D2. The PR body's e2e table puts RESIZEQ under "same at both arms".** The step changed from recorded (0 and 0) at the base to asserted (72 and 0) at the head. Move it to Differences.
- **D3. The PR body says every run had "its own shared hold".** The console base arm was the custodian's solo run in an exclusive hold. Qualify the bullet.
- **D4. Two comments in layout.mjs are now false.** frontends/shell/e2e/layout.mjs:35 and :273 say "an e2e module imports no src". The same file now loads `src/canvas/viewportBbox.ts` and `src/canvas/tileGrid.ts` through `loadShellModule` (:370-371, :426-427). Reword them. The fix is in Scope: it is the file.
- **D5. The `onViewportChanged` doc says it fires on "a fit".** That is WorkingCanvas.tsx:530. The auto-fit on open, and after Apply, does not fire it (`notifyViewport: false`, :1474-1481). Say Zoom to layer's fit.
- **Note, no action.** Reports 3 and 4 list console's steps without GROUP′, but both logs carry `GROUP' PASS`. The PR body is right. The reports are filed records and are not in this diff.

## §8, item by item
1. Pass. The product adds no timer, debounce, throttle or constant. The new e2e-local values are in layout.mjs.
2. Pass. `onViewportChangedRef.current(` is called once, at WorkingCanvas.tsx:1023; RF7 pins it.
3. **Fail on the filter path (C1).** It holds on the open path.
4. Pass. Every open remounts the canvas (`key={admitted.dataset}`, App.tsx:1783), and handles are CSPRNG-minted (protocol/skp/SKP-V0.md:169).
5. Pass. The added lines have no viewManager, getViewports, viewState read, unproject or pickObject.
6. Pass. The handler calls only `reportViewport` or the within prop.
7. Pass. The diff is 10 paths: §2.8's 9 plus KNOWN-LIMITATIONS.md.
8. Pass. The App.tsx hunk starts at 1844, below `return (` at 1652.
9. Pass. No package, lockfile or src-tauri change.
10. Pass. Callers: `onViewportWithinLastQuery` at App.tsx:1847; `viewportAfterResize` at WorkingCanvas.tsx:1947; `ViewportCamera` at WorkingCanvas.tsx:74. `ResizeViewport` is not exported.
11. Pass. `e2eSetViewState` and `setViewState` appear 0 times in layout.mjs. RESIZEQ's step timeout is unchanged at 120000. FILL (180000) and BURST (90000) are new steps.
12. Pass. A scan of the added lines for performance words found none.
13. See C1 (second sentence) and E1 (first sentence).
14. Pass. No new product string.
15. Pass. No verbatim quote of the human.
16. Pass. RF1 to RF9 were observed at 6554b96c. Both e2e mutations were observed at cf24f9b4. I re-observed RF6 (below).

## Checks run (every command and its exit code)

**Worktree.**
- `git fetch` and `git rev-parse` gave rc 0. HEAD and origin are both cf24f9b4, and the merge base is 4fd3259a.
- At the end, the tree is clean and at the head.

**Diff.** `git diff --name-only origin/main...origin/cut/shell-map-refill-after-resize` lists 10 paths, all within §2.8 plus KNOWN-LIMITATIONS.md. All 10 are valid UTF-8 at the head, with 0 CR bytes and a final LF. Both checks were self-tested on a positive case.

**`npm run verify`** (frontends/shell): shared hold granted (cores 0-7) and released; rc 0.
- typecheck: pass
- check:dev-origin: PASS
- check:origin-event: PASS
- verify:adr-index: PASS (34 ADRs)
- build: pass
- check:dist-clean: PASS
- check:dist-notice: PASS
- vitest: 78 files, 1193 tests passed
- residency-trace: 76 passed, 0 failed
- citation-integrity: 30 passed, 0 failed

**e2e `layout.mjs` at the head** (`refill/run-suite.sh head rev207-layout e2e/layout.mjs 420`): ports 9223 and 5400 were free before, fresh launch, shared hold granted and released, rc 0. `app-down` killed the two trees I started and reported both ports free.
- All 12 steps PASS: OPEN, E-KEYS, E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR, RESIZEQ, E-REOPEN, FILL, BURST, FIXTURES.
- RESIZEQ: 72 new lines on close, 0 on reopen, 96 cells predicted, map 480x576 to 758x576.
- FILL′ confirmed: zoom -4.1693 to -3.2394, 2 qualifying cells before and 2 after, 10 streams carrying 2432 rows (the row count is read at the poll that ends the loop), trace settled.
- BURST: 0 lines.
- Fixture hashes unchanged.
- Log: the scratchpad's `refill/out/rev207-layout-head.log`.

**Unit mutation, re-observed (light, no hold).** In `boxInside` I made containment strict. `npx vitest run src/canvas/viewportBbox.test.ts -t "RF6"` gave rc 1, and RF6 failed with "expected 'query' to be 'within'". Reverted with `git checkout`; `git status --porcelain` was empty, HEAD cf24f9b4.

**Run logs against the PR body table** (the scratchpad's `refill/out/`, read only).
- All 14 rows' exit codes and step statuses match the logs. Console's base column comes from the solo log; layout's head column from `p3-layout-head.log`.
- residency-harness: the 12 measured steps have the same features, bytes and tiles at both arms.
- pan-anchor: the step lists diff empty.
- Both e2e mutation logs show RESIZEQ and FILL failing as report 5 says.

**Amendment 2 item 13.** `git diff --name-only 64de82e6 cf24f9b4` lists exactly layout.mjs, e2e/README.md and MANUAL-WALKTHROUGH.md. No other suite imports or reads them. The condition holds.

**§7, by the form's command at base 4fd3259a.** No overrun.

| Group | File | Lines | Ceiling |
|---|---|---|---|
| G1 | viewportBbox.ts | 31 | 45 |
| G1 | WorkingCanvas.tsx | 47 | 90 |
| G1 | App.tsx | 6 | 15 |
| **G1** | | **84** | 150 |
| G2 | viewportBbox.test.ts | 52 | 120 |
| G2 | WorkingCanvas.test.ts | 19 | 40 |
| G2 | App.layout.test.tsx | 63 | 90 |
| **G2** | | **134** | 250 |
| **G3** | layout.mjs | **191** | 200 |
| **Total** | 7 files | **409** | 600 |

Outside the count: MANUAL-WALKTHROUGH.md 28 of 30, e2e/README.md 2 of 12, KNOWN-LIMITATIONS.md 5 of 8.

**Hash pins.** 54 of 54 recompute: 35 at d88cedda, 2 at b4dc05e0, 17 at 76c3ea34. All three commits are on main. A negative self-test detected a mismatch. Amendment 2's references at 64de82e6 name their commit, carry no hash, and resolve to the lines described.

**Item 39.**
- Its item line is byte-identical to form line 124 (sha256 9ac51c1a…).
- Its comment line equals form line 125 with the one approved span replaced by script (sha256 3211a47c…).
- Both are the same at f06a76fd and on main.

**Filed hashes.** The console-solo files and reports 1 to 5 recompute to the hashes their notes give. The solo log is byte-identical to the scratchpad copy.

**Governance checks**, at the head (tool commit cf24f9b4; `scripts/plan/` is the same as main):

| Check | rc | Result |
|---|---|---|
| verify-cites | 0 | PASS |
| verify-quotes | 0 | 121 checked, 90 verified, 30 baselined, 0 hash errors |
| verify-test-claims | 0 | PASS, 534 claims |
| verify | 0 | PASS |
| queue --check | 0 | current |
| site --check | 0 | current |
| cfg-boundary | 0 | 18 sites, 0 outside |
| `node --test` (plan, hooks, evidence) | 0 | 457 of 457 |

**verify-quotes `--show-cites` over the 10 changed files:** rc 1.
- All 28 "quote not found" findings are in MANUAL-WALKTHROUGH.md, at lines that were already there.
- None is on a line this PR adds: the scripted intersection with the added lines is empty.
- layout.mjs:413-418 are advisory cite listings only, and they resolve to the lines they name.

**CI.** `gh pr checks 207` gave rc 0 and 6 lines, all pass, none pending:
- every commit is signed off;
- no profile path in the range;
- tauri build (NSIS) twice;
- typecheck · build · vitest · cargo test twice.

**Low profile.** The commit messages, the title and the body carry no outside issue or PR reference and no outside @mention. The only links in the body are its attribution lines.

**Final state.** `C:/dev/wt/refill` is clean, at cf24f9b41b218e798d365587db57bb82230a0ed4. Nothing is listening on 9223 or 5400. My holds are released. I did not touch D:/wt/refill-base.

Files to fix:
- C:/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/wt/refill/frontends/shell/e2e/layout.mjs
- C:/dev/wt/refill/KNOWN-LIMITATIONS.md
- C:/dev/spatial-ide/frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
