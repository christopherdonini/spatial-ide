*Custodian's filing note (2026-10-22): milestone 4 PR A's fixes under Amendment 4 (rows 2, 4, 7, 13 and 14) by a worker-high, three commits on 37b9d756 to 3e14068e. The run 19:19:25Z to 19:47:34Z by its transcript (Read 17, Bash 75, Edit 11, bash 1, Write 4); its claims were read against that transcript's calls before filing: three commits and three pushes, origin's branch equal to the head, the porcelain empty, no force push or rebase; PA-U7's three mutations each failed and were reverted by its script, the porcelain empty at the end; both development runs' PA-E1 and PA-E3 lines are in the transcript; the shared fixture folder was only listed and hashed. Its runs of the suite are development, not evidence: a tester runs the suite and both e2e mutations at this head next. Row 2's two class 8 overruns are as it states, to be recorded in the closing amendment. Its note that row 4's and row 13's not-covered remarks were not added as source comments goes with the buildLayers.ts step after #243. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 223b343d1a6d0c313b5374218c372fec2be0c34536cf25178acac07d360ca1d0.*

---

Fixed: b1-shell-half PR A at 3e14068e13396453edeb70d2017afbfca2f8d26c

Tag node:b1-shell-half@g7. Branch cut/b1-shell-half-pr-a. Origin's branch equals HEAD: `git ls-remote` printed 3e14068e13396453edeb70d2017afbfca2f8d26c and `git rev-parse HEAD` the same. `git status --porcelain` printed nothing. No PR action, no force push, no rebase. The form was read at main 0775b4bd (Amendment 4 first, then Amendments 3 to 1 and the sections they name).

**Commits** (each signed off, with the two trailer lines, each pushed in its own call; parent 37b9d756)
- b64cf890 `fix(shell): milestone 4 PR A, Amendment 4 row 2: the managers' columns and the canvas's onAttributesNotHeld are required`. Row 2.
- ee39c841 `fix(shell): milestone 4 PR A, Amendment 4 rows 4, 13, 14: the not-held status item states a past fact; item 51 and the slot comment follow`. Rows 4, 13, 14.
- 3e14068e `fix(shell): milestone 4 PR A, Amendment 4 row 7: PA-E1 finds the grid from confirmed hovers and aims at the oracle cells`. Row 7, and the e2e/README.md attributes entry (its "What it proves not" sentence described the old aim, so it now states the new one).

**Files against the rows**
- Row 2:
  - viewportStreamManager.ts: `columns: string[] | null` is required; the call passes `this.opts.columns`; the doc comment says "REQUIRED, with no default".
  - candidateArmSession.ts: `CandidateArmSessionDeps.columns` is required; the tile manager's option and the first look pass `deps.columns`.
  - WorkingCanvas.tsx: `onAttributesNotHeld` is required.
  - viewportStreamManager.test.ts and candidateArmSession.test.ts: `columns: null` at the 41 and 64 construction sites tsc reported (105 sites in all). The fills were applied by script from tsc's line and column list.
  - The two PA-U7 recorded-mutation comments now read `this.opts.columns` and `deps.columns`.
  - Other files: tsc needed no edit outside these. WorkingCanvas.wiring.test.tsx has no fill.
- Row 4: `ATTRIBUTES_NOT_HELD_TEXT` in App.tsx. The one test that reads it (App.attributes.test.tsx, `toContain("not held")`) still passes.
- Row 13: KNOWN-LIMITATIONS item 51, its title line and body line. The DRAFT comment line under it is unchanged.
- Row 14: the sentence is on its own comment line, appended to the `status.residency` slot's comment in App.tsx.
- Rows 4, 13 and 14 were byte-copied by script from the form as git shows it at main 0775b4bd. I re-checked each with `grep -F` against the form's lines (counts 1, 1 and 2 lines) and `file` shows no CRLF.
- Row 7: e2e/attributes.mjs and the README entry only. The generator and the oracle are unchanged.
- Not touched: buildLayers.ts, the lockfiles, any port or SKP file.

**§7** by its command over `55618ab5...HEAD`: 50 files, 1,876 lines against 3,940.
- A-P: 454 against 1,094.
- A-T: 788 against 1,860.
- A-E: 422 against 570 (attributes.mjs 340 of 420; generator 82 of 90).
- A-P added: 19 against 48.
- A-T added: 157 against 320.
- A-T null fills: 36 against 48.
- Per-file overruns, all class 8, with §7 not edited:
  - viewportStreamManager.test.ts: 88 against 40 (over by 48).
  - candidateArmSession.test.ts: 149 against 60 (over by 89).
  - style/document.ts: 7 against 6 (D1, recorded in Amendment 4 item 1).
- Every other file is at or under its ceiling. pick.test.ts, App.command.test.tsx, App.selection.test.tsx, selection.test.ts, scope.test.ts and style_shell_agreement.rs sit exactly at theirs.

**PA-U7's three mutations, each observed at 3e14068e13396453edeb70d2017afbfca2f8d26c**
Each was applied alone, its test run alone with `vitest run <file> -t <name>`, the failure recorded, the file reverted by `git checkout`, and the porcelain printed `[]` after each. The porcelain was `[]` before the first and after the last. Each run ended with vitest rc 1 and "Tests 1 failed".
1. Baseline manager: `this.opts.columns` becomes `null` at the viewportQuery call. FAIL `src/streaming/viewportStreamManager.test.ts > ViewportStreamManager (supersede-on-pan, D3.7) > PA-U7: the manager passes its columns option on every viewport_query call`. `AssertionError: expected [ null ] to deeply equal [ [ 'area', 'zone' ] ]`.
2. Tile manager: `this.opts.columns` becomes `null` at the viewportQuery call. FAIL `src/streaming/tileViewportStreamManager.test.ts > TileViewportStreamManager > PA-U7: every tile's viewport_query passes the columns option`. `AssertionError: expected [ null, null, null ] to deeply equal [ [ 'area', 'zone' ], …(2) ]`.
3. First look: `filter, deps.columns)` becomes `filter, null)`. FAIL `src/residency/candidateArmSession.test.ts > startCandidateArmSession > PA-U7: the first look and every tile's query pass the session's columns`. `AssertionError: expected [ null, [ 'area', 'zone' ], …(2) ] to deeply equal [ [ 'area', 'zone' ], …(3) ]`.
These were applied by hand with sed, not by `verify-mutation`. Every other test is as it stood, and `npm run verify` passes (below).

**Checks at 3e14068e, each with exit code and last line**
- `npx tsc --noEmit` (frontends/shell): rc 0, empty output.
- `npm run verify` (under a hold): rc 0. Last npm line `ℹ duration_ms 15.5223`; vitest inside it: Test Files 104 passed, Tests 1413 passed.
  - It ran twice. The first run's output file was overwritten by my own file-name collision with the next check's output, so I re-ran it. The first run's exit code was 0 (the background call's), but its last line is lost.
- `node --check e2e/attributes.mjs`: rc 0, empty output.
- Lock diff `git diff --stat 55618ab5...HEAD -- Cargo.lock package-lock.json '*.lock' frontends/shell/package-lock.json`: rc 0, empty. The only manifest change is package.json's one script line, from 37b9d756. 53 files in the branch diff: 50 under §7, plus KNOWN-LIMITATIONS.md, e2e/README.md and MANUAL-WALKTHROUGH.md.
- `node scripts/plan/verify-cites.mjs`: rc 0, `verify:cites PASS — every rooted (in-tree) path:line reference across 2207 file(s) resolves. (118 loose reference(s) advised above.)`
- `verify-quotes.mjs`: rc 0, `verify:quotes PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors.` With `--show-cites` on my changed files: rc 0, 0 checked.
- `verify-test-claims.mjs`: rc 0, `verify:test-claims PASS — all 613 claimed test(s) across 190 file(s) exist or are planned, superseded or withdrawn (36 planned, 9 superseded, 17 withdrawn, advisory).`
- `verify.mjs`: rc 0, `verify:plan PASS — C:\dev\wt\m4a\PLAN.yaml agrees with the repository.`
- Scripts suite `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` (under a hold): rc 0, tests 527, pass 527, fail 0, last line `ℹ duration_ms 83493.7153`.

**Text checks** (my script, searching `frontends/shell/src` and `renderer/tests` through `git show`, each pattern line by line and over the joined text with leading whitespace, comment marker and trailing whitespace stripped)
- At B 55618ab5, each is positive:
  - `requests none`: document.ts:20 and style_shell_agreement.rs:39.
  - `requests no projection`: client.test.ts:43 and client.ts:122.
  - `gains no parameter`: types.ts:262.
  - `carries no attributes`: buildLayers.ts:31.
  - `Proposed, so it binds nothing`: joined run only, in viewTransitions.ts.
- At 3e14068e, `requests none`, `requests no projection`, `gains no parameter` and `Proposed, so it binds nothing` are 0 in both runs.
- `carries no attributes` is still positive at buildLayers.ts:31, in both runs. That is the expected positive: the file waits for #243.

**Development runs of `npm run e2e:attributes`** (development only, not the evidence; the port-5400 harness under the 2026-10-11 approval, item 1, read whole). I used a copy of the tester's adapted harness under m4a-fix- names, the exe sha256 295beb0cc6bc623e176bec0c6735963911deb4b665edf27c6eabdc007b958c7b checked equal, and nothing built. Vite served this worktree on 5400. I wrote only in my scratch folder, this worktree and D:/wt-targets/m4a, and the shared fixture folder was read only. Two runs of the six allowed:
- Run 1: head ee39c841 plus the uncommitted row-7 code, which was committed unchanged as 3e14068e. rc 0, 2026-10-22T19:29:35Z to 19:31:31Z.
  - `[PA-E1] PASS (11632ms): 2 oracle ids (242 at notch 0, 240 at notch 0) reached by click showed the oracle's values in declared order, a NULL zone as the marker, in 12 hovers`
  - `[PA-E3] PASS (98614ms): unfiltered clicks showed ["[P6 placeholder] NULL","residential","industrial"]; under zone = 'residential' 3 clicks all showed residential`
- Run 2: head 3e14068e. rc 0, 19:32:29Z to 19:34:24Z.
  - `[PA-E1] PASS (11299ms)`, the same text as run 1, 12 hovers.
  - `[PA-E3] PASS (97773ms)`, the same text.
- Both runs: `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS`, and the fixtures were hash-identical before and after (attributes-multitype.parquet afbd4b909a22, its oracle 29e54fec6fcb, filter-zoned.parquet 92ed800ccbcc).
- Both runs' PA-E1 diagnostic line: canvas left 266, top 40, 668 x 712; fitted cell 23.9 x 23.5 px; fitted from 8 confirmed hovers (222, 30, 34, 26, 38, 42, 325, 329); aimed 242@(625,184), 240@(577,184), 241@(601,184), 263@(577,161), 264@(601,161).
- Ids reached by click: 242 (the NULL zone) and 240, at notch 0, with no zoom.
- The oracle is as the form says: all five ids carry an `i64` over 2^53 (read from the generated oracle file). The tab's values equalled the oracle's, or the step would have failed.
- The two e2e mutations were not run; that is the tester's.

**How row 7 differs from the row's text, to disclose**
- Around each predicted centre the step tries, after the centre itself, up to 8 nearby points at a quarter of a fitted cell (`AIM_OFFSETS`), and a hover that confirms a new id is added to the fit. Each point is still confirmed through `hoverIdAfterBarrier` before any click. I cannot say from the PASS line how many of the 12 hovers were aim hovers beyond the centre.
- If every unreached oracle cell is predicted outside the canvas, the step stops early. Zooming about the canvas middle only moves such a cell further out, and the failure message carries each camera's rect, fit and aimed points. That path was not exercised.
- "Zoom to layer" was not used and was not needed.
- The hover count comes from a module-level counter, `hoverAt`, that wraps `hoverIdAfterBarrier`; `hoverFeatures` also uses it.

**Disclosures**
- Row 2 keeps the `?.` in `onAttributesNotHeldRef.current?.()` in WorkingCanvas.tsx, because the row says only that the prop becomes required and the wiring test's cast base props carry none. It is a harmless guard now.
- Row 4's "Not covered, named for the source comment" (the baseline arm) and row 13's matching note were not added as source comments; the brief did not list them. A successor or the architect may want them.
- No invalidator of §5 was met. I1: tsc needed no file outside the list. I2: no dependency, port or lockfile change. I5: nothing mocked that is forbidden.
- Pre-gate self-check:
  - Seams: the fills and options meet the interfaces as they are, with `new ViewportStreamManager(` and `startCandidateArmSession(` still having App.tsx as their one product caller, and App passing both options.
  - Completion claims: each points to a call above.
  - User-facing text: the status text states what the code does at this commit (the not-held report fires only from `withinAttributes`, and the item clears on the next dataset).
  - Assertions: PA-E1 reached its value assertions. The step would have thrown on any mismatch, and it passed.
- Context: no handoff received or produced.

**Hold lines** (my own project's only; each granted, none of exit codes 96 to 99). Seven shared holds were granted and released: the two e2e runs, `npm run verify` twice and the scripts suite. For example, run 1: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:13492 also=bash.exe:38168 (commands started from now on inherit it; release when done)` then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:13492 affinity=FF (cores 0-7)`. Run 2: the same pair, with shell=bash.exe:25924 also=bash.exe:19888. No timing-sensitive failure was seen.

**Processes.** The harness's own app-down script killed only the PIDs it had recorded, after each run: two process trees each (27320 and 36872 after run 1; 3816 and 46584 after run 2), and ports 9223 and 5400 were reported free. At the end the busy check printed FREE (rc 0), the PID file is gone, and the process list shows no vite, app, node or cargo process of mine. Cargo was not run. The bash.exe entries that remain are the tool's own shells.

**State left.** HEAD = origin = 3e14068e13396453edeb70d2017afbfca2f8d26c; porcelain empty. Scratch files are named m4a-fix-* in my scratch folder, with the harness copy in its m4a-fix-h subfolder. Nothing was written in another worktree or in the shared fixture folder.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override.
