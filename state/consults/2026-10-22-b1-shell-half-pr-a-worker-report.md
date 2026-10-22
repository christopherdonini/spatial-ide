*Custodian's filing note (2026-10-22): milestone 4 PR A's code by a worker-high, built at 37b9d756 from B 55618ab5 under Amendments 1 to 3. The run 17:18:13Z to 18:21:12Z by its transcript (Read 17, Bash 203, Edit 8, Write 19); its claims were read against that transcript's calls before filing: four commits and four pushes, origin's branch equal to the head, the porcelain empty, no force push or rebase; the checks it names each have a call. **One correction, by the transcript:** the final mutation run shows 15 runs (thirteen tests, PA-U7's three counted separately), each with vitest exit code 1, one failed test and an empty porcelain after its revert, at 37b9d756; the report's "16" is a miscount. Its D9 (two earlier invalid runs) is as the transcript shows. D2 and D4 ask for a ruling, and D1 is a per-file overrun (class 8): the architect reads D1 to D11 against the form before the gates. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 70f0584e72c77a7b739ee81e30c70b0a9dc2b394f6dd4fa41278756a234856bb.*

---

Built: b1-shell-half PR A at 37b9d756267d25a30d8445615ff4e76de10b6e61

Origin's branch equals HEAD: `git ls-remote origin refs/heads/cut/b1-shell-half-pr-a` printed 37b9d756267d25a30d8445615ff4e76de10b6e61 and `git rev-parse HEAD` the same. `git status --porcelain` printed nothing. No PR action. I did not run the app or any e2e suite.

**Commits** (from 55618ab5, each signed off, each with the two trailer lines; each pushed alone; tsc clean at each one that touched TypeScript)
- 11ff097d feat(shell): milestone 4 PR A, step 1: the open's projection set and the wire's columns
- 549df0ed feat(shell): milestone 4 PR A, step 2: attributes decoded with the batch, held under a ceiling, carried through trim and dedupe
- 96a78eff feat(shell): milestone 4 PR A, step 3: the inspected feature's attributes, from the click to the Feature tab
- 37b9d756 feat(shell): milestone 4 PR A, step 4: the e2e suite, the fixture generator and the records

**Files against §2.6 and Amendment 3.** `git diff --name-only 55618ab5...HEAD` lists 53 files: 50 under §7's command plus the three records. Not touched: `canvas/buildLayers.ts` (waits for #243's merge), `feature/FeaturePanel.tsx` and `workspace/workspaceState.test.ts`.
- In list, product: client.ts, types.ts (comment), the three managers (tile manager's `columns` is required; the other two take it as optional, see D2), decodeBatch.ts, clickPick.ts, WorkingCanvas.tsx, limits.ts, attributes/projection.ts and values.ts (new), workspaceState.ts, viewTransitions.ts, style/document.ts (comment), FeatureTab.tsx, App.tsx, console/surfaceRegistry.ts, styles.css, package.json (one script line), renderer/tests/style_shell_agreement.rs (comment).
- In list, tests: projection.test.ts and values.test.ts (new), decodeBatch.test.ts, clickPick.test.ts, limits.test.ts, client.test.ts, the two manager tests, candidateArmSession.test.ts, FeatureTab.test.tsx, viewTransitions.test.ts, App.attributes.test.tsx (new).
- In list, e2e: `frontends/shell/e2e/attributes.mjs` (new) and the `#[ignore]` generator in `kernel/tests/manual_walkthrough_fixtures.rs`.
- Records: Part AC (blank log), KNOWN-LIMITATIONS items 51 and 52, one `e2e/README.md` entry. Their numbers were re-read against main (highest item 46, last Part AB) and still hold.
- Amendment 3 item 6 additions: feature/clickEffect.ts, canvas/tileIngest.ts, canvas/tileResidentSet.ts, clickEffect.test.ts (new), tileIngest.test.ts, tileResidentSet.test.ts, testUtils/attributeBatchIpc.ts (new), and the nine null-fill test files.
- I1: not met. `npx tsc --noEmit` needed no edit outside the list and Amendment 3's.

**§7 by its command** over `55618ab5...HEAD` (insertions plus deletions): 50 files, 1,625 lines against 3,940.

| Group | Files | Lines | At most |
|---|---|---|---|
| A-P | 20 | 451 | 1,094 |
| A-T | 12 | 589 | 1,860 |
| A-E | 2 | 373 | 570 |
| A-P added | 3 | 19 | 48 |
| A-T added | 4 | 157 | 320 |
| A-T null fills | 9 | 36 | 48 |

One file ceiling is exceeded: `style/document.ts` 7 against 6 (D1). Every other file is at or under its own ceiling; `pick.test.ts`, `App.command.test.tsx`, `App.selection.test.tsx`, `selection.test.ts`, `scope.test.ts` and `style_shell_agreement.rs` sit exactly at theirs.

**Null-fill diffs against item 6's four forms.** The nine files carry only:
- `attributes: null` in ResidentBatch literals: buildLayers.test (2), highlightLayers.test (3), pick.test (1), residentSet.test (1).
- `, null` as decodeBatch's sixth argument: buildLayers.test (3), pick.test (3), WorkingCanvas.wiring.test (1).
- `projection: null` in props: WorkingCanvas.wiring.test base props (1).
- `row: null` in click or `inspect.set` literals: App.command.test (2), App.selection.test (1), selection.test (2), scope.test (1).

No assertion, title, comment or recorded mutation changed in them. The three multi-line calls became `ENCODING_X, null` on the last argument's line or one added `null` line.

**Tests by name, with the mutation applied alone at 37b9d756267d25a30d8445615ff4e76de10b6e61.** Each was applied, the test run alone (`vitest -t`), the failure recorded, the file reverted by `git checkout`, and the porcelain printed `''` after every one. The log replaced the ellipsis in diff lines with `?`. Each of the 16 runs ended with vitest exit code 1 and "Tests 1 failed".
1. PA-U1, `attributes/projection.test.ts`: `projectionFor` returns `[]` when none. FAIL `PA-U1: lists the projectable rows only, in schema order, capped at 32, and is null when there are none`. `AssertionError: expected [] to be null`.
2. PA-U2, `skp/client.test.ts`: the `columns` key omitted when null. FAIL `PA-U2: sends the caller's columns as given, and its key set equals the committed request fixture with columns`. `AssertionError: expected { skp: 'skp/0.12', ?(5) } to have property "columns" with value null`.
3. PA-U3, `canvas/decodeBatch.test.ts`: `names: [...projection].reverse()`. FAIL `PA-U3: reads the columns after geometry in declared order, co-indexed with ids, off a copy; a mismatch is refused by name`. `AssertionError: expected [ 'n', 'tag' ] to deeply equal [ 'tag', 'n' ]`.
4. PA-U4, `attributes/values.test.ts`: `BigInt(Number(raw))`. FAIL `PA-U4: shows 64-bit integers exactly, NULL as the marker, float32 and float64 by their own rules, and a boolean`. `AssertionError: expected [ '9223372036854775808', ?(2) ] to deeply equal [ '9223372036854775807', ?(2) ]`.
5. PA-U5, `canvas/clickPick.test.ts`: the row read by the GPU ordinal. FAIL `PA-U5: the click's row comes through partToRow, and every part of a multipolygon gives the one row`. `AssertionError: expected [ [ { name: 'tag', ?(1) } ], ?(2) ] to deeply equal [ [ { name: 'tag', ?(1) } ], ?(2) ]`.
6. PA-U6, `canvas/limits.test.ts`: the new batch left out of the sum. FAIL `PA-U6: a batch that would pass the ceiling keeps its geometry and is marked not-held, and clearing releases the bytes`. `AssertionError: expected { names: [ 'tag' ], ?(3) } to be 'not-held' // Object.is equality`.
7. PA-U7, three tests, one mutation each (the form's mutation is the third):
   - Baseline manager passes `null`. FAIL `PA-U7: the manager passes its columns option on every viewport_query call` (`viewportStreamManager.test.ts`). `AssertionError: expected [ null ] to deeply equal [ [ 'area', 'zone' ] ]`.
   - Tile manager passes `null`. FAIL `PA-U7: every tile's viewport_query passes the columns option` (`tileViewportStreamManager.test.ts`). `AssertionError: expected [ null, null, null ] to deeply equal [ [ 'area', 'zone' ], ?(2) ]`.
   - The first look passes `null`. FAIL `PA-U7: the first look and every tile's query pass the session's columns` (`candidateArmSession.test.ts`). `AssertionError: expected [ null, [ 'area', 'zone' ], ?(2) ] to deeply equal [ [ 'area', 'zone' ], ?(3) ]`.
8. PA-U8, `canvas/tileIngest.test.ts`: the trim writes `attributes: null`. FAIL `trimBatchToVertexBudget carries the attributes unchanged, so each kept row reads its own values`. `AssertionError: expected null to be { names: [ 'tag' ], ?(3) } // Object.is equality`.
9. PA-U9, `canvas/tileResidentSet.test.ts`: the rebuild carries `rows: null`. FAIL `a duplicate drop carries the attributes with a row map, so each kept row reads its own values`. `AssertionError: expected [ { name: 'tag', value: { ?(2) } } ] to deeply equal [ { name: 'tag', value: { ?(2) } } ]`.
10. PA-U10, same file: the rebuild writes `null` for a block that is not an object. FAIL `a duplicate drop keeps a not-held batch not-held and a null batch null`. `AssertionError: expected null to be 'not-held' // Object.is equality`.
11. PA-U11, `feature/clickEffect.test.ts`: the Navigate branch sends `row: null`. FAIL `a Navigate click on a feature carries its row into inspect.set, and the reducer keeps it on the inspected feature`. `AssertionError: expected [ { action: 'inspect.set', ?(1) } ] to deeply equal [ { action: 'inspect.set', ?(1) } ]`.
12. PA-R1, `feature/FeatureTab.test.tsx`: NULL cells skipped. FAIL `PA-R1: shows every projected column in declared order, the NULL marker, the not-projected line, and the not-held and no-column states`. `AssertionError: expected [ 'n', 'f' ] to deeply equal [ 'tag', 'n', 'f' ]`.
13. PA-R2, `App.attributes.test.tsx`: `readRow` builds lazy cells, so the tab reads the live batch at render. FAIL `PA-R2: the pinned feature keeps its values after its batch is superseded`. `AssertionError: expected [ '', '0' ] to deeply equal [ 'north', '10.5' ]`.

PA-E1 and PA-E3 are e2e (below). The exact edits are also in the mutations headers of the test files and in `attributes.mjs`.

**E2E mutations for the tester** (apply one alone, run `npm run e2e:attributes`, record the failing step with the commit, revert)
- PA-E1, `src/attributes/projection.ts`, `projectionFor`: `names.slice(0, ATTRIBUTE_PROJECTION_MAX)` becomes `names.slice(0, Math.min(ATTRIBUTE_PROJECTION_MAX, names.length - 1))`. Expected: PA-E1 fails on the names of the projected columns (`text` is missing).
- PA-E3, `src/canvas/clickPick.ts`, `resolveClickPick`: `readRow(candidate.batch, row)` becomes `readRow(candidate.batch, 0)`. Expected: PA-E3 fails because every unfiltered feature clicked shows one zone.
- Fixtures first: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_attributes_multitype_fixture -- --ignored --nocapture`, from the checkout that holds the fixtures. I ran the generator once, into this worktree's gitignored `target/fixtures`: it wrote 500 features and the oracle. Oracle ids are 240, 241, 242, 263 and 264; 242 has a NULL zone; ids 240, 241 and 264 have `i64` values past 2^53.
- The suite reads the fixtures from `C:\dev\spatial-ide\target\fixtures\manual-walkthrough\`, as the other suites do.

**Checks at head 37b9d756** (exit code, last line)
- `npx tsc --noEmit` in `frontends/shell`: rc 0, empty output.
- `npm run verify` in `frontends/shell`, under a hold: rc 0, last line `ℹ duration_ms 11.3495`. Vitest inside it: Test Files 104 passed, Tests 1413 passed. The package has no lint script.
- `node --check e2e/attributes.mjs`: rc 0.
- `cargo test -p spatial-renderer`, under a hold: rc 0, last line `scripts`-free: `cargo test -p spatial-renderer rc=0`. 4 result lines, all ok (30 passed in the largest, includes `style_shell_agreement`).
- `cargo fmt --all -- --check`: rc 0, empty output.
- `cargo test -p spatial-kernel --test manual_walkthrough_fixtures --no-run`: rc 0, last line `Executable tests\manual_walkthrough_fixtures.rs (D:/wt-targets/m4a\debug\deps\manual_walkthrough_fixtures-14c7e04e1a73ad55.exe)`.
- Lock diffs `git diff --stat 55618ab5...HEAD -- Cargo.lock package-lock.json '*.lock'`: rc 0, empty. The only manifest change is `frontends/shell/package.json`, one script line (I2 not met).
- `node scripts/plan/verify-cites.mjs`: rc 0, `verify:cites PASS — every rooted (in-tree) path:line reference across 2207 file(s) resolves. (118 loose reference(s) advised above.)`
- `verify-quotes.mjs`: rc 0, `verify:quotes PASS — 130 checked, 99 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors.` With `--show-cites` on my changed files it exits 1 on 28 pre-existing baselined failures; none is on a line I added.
- `verify-test-claims.mjs`: rc 0, `verify:test-claims PASS — all 613 claimed test(s) across 190 file(s) exist or are planned, superseded or withdrawn (36 planned, 9 superseded, 17 withdrawn, advisory).`
- `verify.mjs`: rc 0, `verify:plan PASS — C:\dev\wt\m4a\PLAN.yaml agrees with the repository.`
- Scripts suite `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`, under a hold: rc 0, tests 527, pass 527, fail 0, last line `scripts node --test rc=0`.
- The five titles the form fixes (PA-U8 to PA-U11 and the `client.test.ts` title) each appear once in a test file and once in the form on main, byte for byte.

**Text checks** (`m4a-pa-textcheck.mjs` in my scratchpad). Each pattern is searched line by line and over the joined text, with Amendment 2's stripping, in `frontends/shell/src` and `renderer/tests`.
- At B, each is positive:
  - `requests none`: `style/document.ts:20` and `style_shell_agreement.rs:39`, both runs.
  - `requests no projection`: `client.ts:122` and `client.test.ts:43`, both runs.
  - `gains no parameter`: `types.ts:262`, both runs.
  - `carries no attributes`: `buildLayers.ts:31`, both runs.
  - `Proposed, so it binds nothing`: joined run only, in `viewTransitions.ts`.
- At head, `requests none`, `requests no projection`, `gains no parameter` and `Proposed, so it binds nothing` are zero in both runs.
- `carries no attributes` is still 1 in both runs, at `buildLayers.ts:31`. Expected: that file waits for #243's merge. Its `requests none` positive exists only at b24e5281, so it is not at B or here.

**Invalidators.** None of I1 to I10 met. I3 is untested by me: no e2e was run. I5: none of decodeBatch, projectionFor, the resolver or `readRow` is mocked anywhere. I8: the trim's choice of rows and the vertex ceiling are unchanged.

**Disclosures**
- D1. `style/document.ts` is 7 lines against its ceiling of 6. Amendment 2 item 2 (c)'s four-line bullet replaces four old lines with three, and cannot be done in fewer. The A-P group is far under its total.
- D2. `ViewportStreamManager`'s `columns` option and `CandidateArmSessionDeps.columns` are optional (an absent option sends `null`). The tile manager's is required, since its test has one construction site. Required would cost about 45 edits in `viewportStreamManager.test.ts` (ceiling 40) and 64 in `candidateArmSession.test.ts` (ceiling 60). App passes both. Please rule this.
- D3. The not-held status item shows in the existing `status.residency` slot, as a second element with class `attributes-not-held`. A new status slot would have needed `layout/contributions.ts`, which is outside the list.
- D4. `TileResidentSet.addBatch` throws if the batch it must deduplicate already carries a row map (Amendment 3 item 3: nothing makes a second map). A third test covers it. Please rule this.
- D5. `decodeBatch` refuses a batch with no `attribute_columns` key. Two hand-built batches in `decodeBatch.test.ts` now write the key `"[]"`. The engine's committed fixtures already carry it.
- D6. PA-E1 aims at the five oracle cells (centre-relative CSS points, then a spiral) and takes the id through `hoverIdAfterBarrier`. It does not use a `capturePixels` pixel (PA-E3 does, via the interior-candidate search). The fit estimate (`FIT_MARGIN_FRACTION` 0.8) and the cell positions are untested assumptions, so PA-E1 can fail for want of a hit; its message says so. H7 is likewise untested.
- D7. `App.attributes.test.tsx` uses the same stand-ins as `App.workspace.test.tsx`: SKP client, baseline manager and WebGL canvas. The decode, `resolveClickPick`, `readRow` and the Feature tab are real.
- D8. Extra tests without a form row or mutation: PA-A1, the not-held status item, the row-map refusal, `displayValue`'s no-projection case. I added no "OBSERVED AT" lines to test comments; the observations are above.
- D9. My first two mutation-observation runs were invalid. A crash on a non-ASCII character left PA-U1 applied, then a wrong revert path let mutations accumulate. I ran `git checkout -- .`, confirmed the porcelain empty, fixed the script, and reran from a clean tree; the 16 results above are that third run.
- D10. My first `cargo test --no-run` failed to compile (missing `use arrow::array::Array`) and was fixed before step 4's commit.
- D11. Part AC carries §9's row numbers AC0, AC1, AC2, AC9, AC10 and AC11. AC3 to AC8 are left for PR B and PR C. The status-item text, the Attributes lines, the KL texts and the registry sentence for `feature.inspect` are P6 placeholders and none is the human's wording.

**Pre-gate self-check**
- Seams: `decodeBatch` reads the engine's envelope shape (`engine/src/envelope.rs:239-256`, `engine/tests/data/golden/polygon-wire.golden:34`, committed IPC fixtures); the client test compares keys with `protocol/skp/tests/data/v0-viewport_query-request-with-columns.json`.
- Completion claims are backed by the runs above.
- Every user-facing message describes behaviour implemented at this commit.
- Each required test reaches its intended assertion; the observations show that.
- Caller grep, new symbol to its non-test files:
  - `projectionFor`: App.tsx, WorkingCanvas.tsx, candidateArmSession.ts, both managers.
  - `projectionSummary`: App.tsx, FeatureTab.tsx.
  - `ATTRIBUTE_PROJECTION_MAX`: FeatureTab.tsx.
  - `readRow`: clickPick.ts.
  - `displayValue`: FeatureTab.tsx.
  - `isReadableAttributeType`: decodeBatch.ts.
  - `residentAttributeBytes` and `withinAttributeCeiling`: WorkingCanvas.tsx.
  - `onAttributesNotHeld`: App.tsx and WorkingCanvas.tsx.
  - `ATTRIBUTE_NULL_MARKER`: used inside values.ts (exported for the tests).
  - `UnexpectedProjectionError`: thrown in decodeBatch.ts.
- Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff received or produced.

**Hold lines** (my own project's only). Eight shared holds were granted at once and each was released: the full vitest run twice, the generator test build twice (the first failed to compile), `cargo test -p spatial-renderer`, `npm run verify` twice, and the scripts suite. Example, byte-copied: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:41652 also=bash.exe:42004 (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:41652 affinity=FF (cores 0-7)`. No exit code 96 to 99 was returned. No timing-sensitive failure was seen.

**Processes.** A process listing showed no `node`, `cargo`, `rustc`, `python` or `vitest` process, and nothing but my own shells and the listing command carries this worktree in its command line. Other WebView2 processes on the machine are not mine. Cargo used only `D:/wt-targets/m4a`. Scratch files are named `m4a-pa-*` in my scratchpad.
