*Custodian's filing note (2026-10-24): the worker-high's build of milestone 4 PR C (`b1-shell-half`) on `cut/b1-shell-half-pr-c`, from main e5e6e03a (the form's Amendment 8), final head bc315fb9d163dc292501618836bc25353c467bd8; draft PR #253. The run 09:48:41Z to 11:03:41Z by its transcript (Read 29, Bash 185, Grep 3, Write 11; Edit and Write only under `frontends/shell/` in its worktree (8 files) and on its own scratch files; no rebase, reset, merge, amend, force push or PR action). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. It ran no e2e suite (its own disclosure); the tester runs it next. Its sha256, from line 5 to the end, is b6a07c8ee3dbedcd85c075fa01904d4c58fd52501389dd3cb5cdbd96ec92fd1e.*

---

Built: b1-shell-half PR C at bc315fb9d163dc292501618836bc25353c467bd8
(worktree C:/dev/wt/m4c, branch cut/b1-shell-half-pr-c; base e5e6e03a3a10e1c9427efd153d74b5a997023436; origin's branch equals HEAD and `git status --porcelain` is empty, both shown by script at the end; no PR action.)

NO INVALIDATOR (I1 to I10) MET. Disclosures are at the end. I did not run the app or any e2e suite. `table.mjs` has only been through `node --check`.

FIRST RUN (Amendment 8 item 7), before any edit, in one shared hold:
- `renderer/bundle-viewer/node_modules` was present, so no `npm ci`.
- `npm run build` in frontends/shell: rc=0.
- `npx vitest run src/notices`: rc=0, 6 files and 38 tests passed (the 6 files are duckdbAmalgamation, metafileKey, noticeByteIdentity, noticeDeterminism, portedNotices, spdxTokenisation).

STEP-1 PATCH: I read `m4c-pc-wip-step1.patch` (scratch folder) against Amendments 7 and 8, then applied it with `git apply` and changed it afterwards (`tableConstants.ts` was written afresh).
- I added the required handle method `residentIdsStreamedUnder` and its stand-ins.
- I added the two fill forms and the stub lines.
- I added the tests.
- The step-1 `selection.ts` stays as the patch had it.

COMMITS (each builds; each signed off; each pushed in its own call; no `@` in any message file outside the Co-Authored-By line, shown by grep before each commit)
- 8cd440af `feat(shell): milestone 4 PR C step 1, the filter seam: each stream's filter reaches its resident batch and its selection member`
- 0c3d54c4 `feat(shell): milestone 4 PR C step 2, the table in Activity: its first scope, its other two scopes, its grid and its tab`
- 0c200a71 `feat(shell): milestone 4 PR C step 3, the table's e2e suite and records: e2e:table, README entry, Part AC rows 6 to 8, KNOWN-LIMITATIONS items 54 to 56`
- bc315fb9 `feat(shell): milestone 4 PR C step 4, the Table tab is as tall as the Activity region and the selection's row cut is private to selection.ts`

FILES AGAINST §2.6 + AMENDMENT 7 ITEM 3 + AMENDMENT 8 (script `m4c-pc-listcheck.py`)
- 57 allowed (30 + 22 + 5). 56 changed under frontends/shell, plus `KNOWN-LIMITATIONS.md`.
- The records outside the list are exactly the allowed ones: Part AC (heading, opening sentence, fixture line, rows AC6 to AC8, result-log lines), items 54 to 56 with the column-0 line, one `e2e/README.md` entry, one `e2e:table` line in package.json.
- Changed and not allowed: none.
- Allowed and not changed: `layout/actionRegistry.ts` only (Amendment 8 item 2).
- Lock diff `e5e6e03a...HEAD` for lock files, Cargo.toml and package-lock: empty. Nothing under protocol/, kernel/src, engine/ or src-tauri/.
- The soleCaptureSite scan allows `recordNamed` only from named modules and `table/TableTab.tsx` is not among them. Editing that scan would have been I1 (the file is outside the list), so the two class-C rows (`table.scopeSet`, `table.cancel`) are recorded by App.tsx, which is allowed. TableTab takes two callbacks, `recordScopeSet` and `recordCancel`.

§7 BY ITS COMMAND over `e5e6e03a...HEAD` (numstat added+deleted; scratch `m4c-pc-numstat.txt` is from before step 4, the group sums were recomputed at the head)
- 56 files, 2,513 lines of 4,248. By group:
  - Product, 22 files incl. package.json and styles.css: 971 (ceiling 1,600 + 58 added).
  - Tests, 33 files, fills included: 1,124 (ceiling 1,700 + 230 + 68 + Amendment 8's 52).
  - e2e: 418 (ceiling 540).
- Per file, no ceiling passed, no class 8. Figures are changed lines; the per-file ceilings are in brackets.
  - Product: tableSource.ts 289 [300], TableTab.tsx 149 [280], TableGrid.tsx 131 [260], tableScope.ts 64 [140], tableConstants.ts 31 [40], selection.ts 64 [70], viewTransitions.ts 4 [30], clickPick.ts 8 [20], decodeBatch.ts 10 [40], the three managers 12+7+11=30 [40, with the tile comment in the tile manager's 12 of [15]], contributions.ts 3 [10], StudioLayout.tsx 5 [30], App.tsx 59 [180], surfaceRegistry.ts 16 [30], styles.css 71 [100], WorkingCanvas.tsx 25 [40], tileIngest.ts 1 [4], tileResidentSet.ts 1 [4], clickEffect.ts 9 [10].
  - Tests: tableSource.test 185 [320], tableScope.test 66 [220], selection.test 43 [120], TableGrid.test 78 [250], TableTab.test 178 [200], decodeBatch.test 58 [60], the three managers' tests 17+18+17 [80 + 2], App.table.test 274 [450], WorkingCanvas.wiring.test 31 [60], tileIngest.test 22 [40], tileResidentSet.test 15 [40], clickEffect.test 24 [50], clickPick.test 15 [40], App.test.ts 25 [30].
  - Fill files: App.lateResult 7 [8], App.layout 1, App.recording 1, App.workspace 1 [2 each], App.command 5 [6], App.selection 3 [6], App.attributes 3 [6], buildLayers.test 9 [12], highlightLayers.test 6 [6], pick.test 7 [10], residentSet.test 2 [4], values.test 4 [4], limits.test 2 [4], FeatureTab.test 2 [4], scope.test 2 [4], viewTransitions.test 2 [6], StudioLayout.test 1 [2].
  - e2e: table.mjs 418 [480 + 60 margin].

FILL DIFFS against Amendment 7 item 3's four forms and Amendment 8 item 1's two (diffs read in full)
- Each fill file's diff holds only: `, null` as decodeBatch's seventh argument; `filter: null` in a ResidentBatch or click literal; `row: null, filter: null` in a `selection.apply` literal; `"activity.table": null`; `null` as `onBatch`'s fourth argument and as `pushBatch`'s fourth expected argument; a fourth `filter: unknown` parameter in the lateResult mock capture types; and the one stub line `residentIdsStreamedUnder: () => new Set<bigint>()` (`vi.fn(...)` where the literal uses `vi.fn`).
- No assertion, title, comment or recorded mutation changed in them. The listed test files (decodeBatch, managers, selection, clickPick and the others) took their `null` fills and the assertions that now see the fourth or fifth argument, inside their ceilings.
- selection.test.ts (listed) keeps its 24 call sites through a local wrapper named `applySelectionMode` over the real one, and reads `.bounds` where it read a box.

AMENDMENT 8 ITEM 1's SEARCH at the head: `onBatch\b` over frontends/shell/src hits 20 files.
- The original 15 are unchanged in kind. The five new are App.table.test.tsx, table/TableTab.test.tsx, table/tableSource.test.ts and table/tableSource.ts, plus candidateArmSession.test.ts's existing hits.
- In the new files, `onBatch` is the `StreamSink.onBatch(payload, contiguous)` interface.
- Every manager `onBatch` call or capture now has its fourth argument or parameter: the 6 calls in App.test.ts, 1 in App.lateResult.test.tsx, the 2 pushBatch/tile assertions, the managers' tests. No three-argument call or capture remains.

CARRIED TEXTS, byte-equal to their sources by script (`m4c-pc-carried.py`, all EQUAL)
- `TABLE_MAX_ATTRIBUTE_BYTES` doc comment and declaration: the redraft consult's lines 13 to 23 with the fence's 3-space indent removed (sha256 6af8d0e71389dbd7…, 1022 chars).
- Item 54's ceiling sentence (263 chars) and its source-comment clause (289 chars): the consult's change 5, each read between its backticks (sha256 3052c0893c313572…, 03946a4991958d5c…).
- The stopped line: tableSource.ts equals both the form's Amendment 7 item 5 and the consult (sha256 5d33874384bc42b0…, 213 chars). "64 MiB" is literal as the architect wrote it; PC-U13 asserts `TABLE_MAX_ATTRIBUTE_BYTES` is 64 MiB.
- The `TABLE_MAX_IN_FLIGHT` comment in tableConstants.ts equals Amendment 8 item 3's quoted text (183 chars).

TESTS, EACH BY NAME WITH ITS ONE MUTATION
Each mutation was applied by script (`m4c-pc-mut.py`), the named test run alone, the failure recorded, and the file reverted with `git checkout`, with `git status --porcelain` printed EMPTY after each. The assertion lines have a `�` where the output printer drops a character. Each failing test's name starts with its ID.

Observed at 8cd440af:
- PC-U7 (WorkingCanvas.wiring.test.tsx): pushBatch passes `null` to decodeBatch. Failed: "expected 0 to be greater than 0".
- PC-U8 (tileIngest.test.ts): the trim's literal writes `filter: null`. Failed: "expected null to be { �(2) } // Object.is equality".
- PC-U9 (tileResidentSet.test.ts): the rebuild writes `filter: null`. Same failure.
- PC-U10 (clickEffect.test.ts): the Select branch sends `filter: null`. Failed: "expected [ { action: 'selection.apply', �(1) } ] to deeply equal [ ... ]".
- PC-U11 (clickPick.test.ts): `resolveClickPick` returns `filter: null`. Failed: null where the object was expected.
- PC-U12 in three files, one mutation each:
  - viewportStreamManager.test.ts: onBatch gets `null`.
  - tileViewportStreamManager.test.ts: onBatch gets `null`.
  - candidateArmSession.test.ts: the first look passes `null` to `ingestAndMaybeEstablishFrame`.
  - All three failed with "expected null to be { �(2) }".
- PC-U15 (App.test.ts): `makeManagerCallbacks` passes `null` to pushBatch. Failed: "expected null to be { �(2) }".
- PC-U3 (selection.test.ts): `capturedRow` returns the row whole. Failed: "expected [ Array(3) ] to deeply equal { cut: [ { name: 'a', �(1) } ], �(1) }".

Observed at 0c3d54c4:
- PC-U1 (tableSource.test.ts): the query's `limit` is `null`. Failed: "expected "vi.fn()" to be called with arguments: [ 'ds_x', null, null, '1000', �(2) ]".
- PC-U13: each batch checked alone (`bytes > TABLE_MAX_ATTRIBUTE_BYTES`). Failed: "expected 'loading' to be 'stopped'".
- PC-U6 (tableSource.test.ts): `isRetryableRefusal` returns false. Failed: "expected [ [ 'ds_x', { �(4) }, null, �(3) ] ] to have a length of 2 but got 1".
- PC-U2 (tableScope.test.ts): `sameFilter` returns true. Failed: "expected [ 1n, 2n, 3n, 4n, 5n ] to deeply equal [ 1n, 2n, 3n ]" (a second test also failed).
- PC-U14 (tableScope.test.ts): a stopped result read as complete. Failed: "expected { listed: [ 1n ], failed: 1, �(1) } to deeply equal { listed: [ 1n ], failed: +0, �(1) }".
- PC-U5 (TableGrid.test.tsx): `const last = rowCount - 1`. Failed: "expected 10001 to be less than or equal to 22" (the DOM count; the second test also timed out).
- PC-R1 (TableTab.test.tsx): the `!shown` test dropped. Failed: "expected "vi.fn()" to not be called at all, but actually been called 1 times".
- PC-R2 (TableTab.test.tsx): `end()` without `this.reset`. Failed: "expected [ '1', 'north' ] to deeply equal []".

Observed at 0c200a71:
- PC-U4 (App.table.test.tsx): `const exportHeld = false;`. Failed: "expected [ [ �(6) ], [ �(6) ] ] to have a length of 1 but got 2". At 0c3d54c4 the same mutation failed on a later assertion, so I moved the note assertion after the count.
- Only App.table.test.tsx changed after 0c3d54c4 among these tests.

PC-U13 batches: `attributeBatchIpc` builds them.
- Each batch is one row with a 20,000,000-character text value.
- Four batches are real IPC, each decoded by the real `decodeBatch`.
- The test reads `attributes.bytes` from a probe decode (k = 3) and asserts `bytes*(k+1) > 67,108,864`.
- No smaller test-only ceiling was used.
- The test took under the 60 s allowance.

E2E MUTATIONS FOR THE TESTER (exact edits, also in table.mjs's header)
- PC-E1: src/table/tableSource.ts, `start`: `encodeDecU64(BigInt(TABLE_MAX_ROWS)), filter, this.opts.projection` becomes `encodeDecU64(BigInt(TABLE_MAX_ROWS)), null, this.opts.projection`. Expected: PC-E1 fails (the line is not "all N").
- PC-E2: src/table/tableScope.ts, `secondScope`: `if (viewFilter === null || sameFilter(member.filter, viewFilter) || residentUnderView.has(id) || (firstForView && first.ids.has(id))) listed.push(id);` becomes `if (true) listed.push(id);`. Expected: PC-E2 fails (three listed where two were expected).
- PC-E3: src/table/tableSource.ts, `tableLine`, `completed` case: `n < TABLE_MAX_ROWS` becomes `true`. Expected: PC-E3 fails ("Showing all 1000 features").
- PC-E4: src/table/tableSource.ts, `cancel` (not `end`): delete `if (handle !== null) void this.cancelHandle(handle);` that precedes `if (this.phase === "loading") {`. Expected: PC-E4 fails at assertion 3 (no class-A `cancel` row carrying the handle).
- PC-E1 needs the oracle: the generator's printed `zone_counts` array as env `SPATIAL_E2E_FILTER_ZONE_COUNTS` (e.g. `[517, 498, 480, 505]`, `residential` first). Without it the step FAILs and says why; it is never skipped. I ran no generator.
- PC-E4 expands the Console panel while on its tab, then selects the Table tab. The Console's rows stay in the DOM, hidden, and are read from there.

CHECKS AT THE HEAD bc315fb9 (rc and last line; outputs redirected, `$?` printed right after)
- `npx tsc --noEmit` in frontends/shell: rc=0, no output.
- `npm run verify`: rc=0 (twice, at 0c200a71 and bc315fb9). At bc315fb9 vitest was "Test Files 109 passed (109)" and "Tests 1443 passed (1443)". Its last line is "ℹ duration_ms 13.5077" from the s5d-verdict node test (7 tests, 7 pass).
- `node --check e2e/table.mjs`: rc=0.
- `node scripts/plan/verify-cites.mjs`: rc=0, "verify:cites PASS — every rooted (in-tree) path:line reference across 2333 file(s) resolves. (95 loose reference(s) advised above.)"
- `node scripts/plan/verify-quotes.mjs`: rc=0, "verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 856 ruling cites resolved, 0 ruling-cite errors."
- `node scripts/plan/verify-test-claims.mjs`: rc=0, "verify:test-claims PASS — all 656 claimed test(s) across 198 file(s) exist or are planned, superseded or withdrawn (65 planned, 11 superseded, 17 withdrawn, advisory)."
- `node scripts/plan/verify.mjs`: rc=0, "verify:plan PASS — … PLAN.yaml agrees with the repository."
- The scripts suite `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc=0 at 0c200a71 and at bc315fb9; "ℹ tests 553", "ℹ pass 553", "ℹ fail 0". No `guardian parity` fixture or hooks test failed.
- Timing flake, reported to the custodian and not recorded as a failure: in one full shared vitest run at 0c3d54c4, `src/notices/noticeDeterminism.test.ts` ("produces byte-identical output across two independent runs, including two real cargo calls") hit its 30 s timeout. The same file alone, in its own hold, passed (1 file, 1 test); the two later full runs inside `npm run verify` passed it.
- Two earlier failures in my own work, both fixed before step 2's commit:
  - `App.test.ts`'s `the_pre_check_refusal_latches_the_session_in_the_untiled_catch` counts `onSessionEnded: (detail) => endSession(detail, admitted.dataset),` at exactly two sites. My third site matched it, so the table's site now reads `endSession(detail, dataset)`, with the generation bound unchanged.
  - The soleCaptureSite failure above.

PRE-GATE SELF-CHECK, the four classes
- (1) Cross-module code uses the interface the other side has. The `viewportQuery`, `cancel`, `dataPlaneAttach`, `startStream`, `decodeBatch`, `readRow`, `formatRefusal` and `liveTicketSet` helpers were each read before use. PC-U6 runs the real tile manager and the real table source over one mocked transport. The table's source is the real one in every test (I5): the only mocks are the transport (client with the real `SkpCallError`, data-plane attach, `startStream`, the session log) and two platform stand-ins in App.table.test.tsx (the canvas and PublishPanel).
- (2) Every completion claim names a test or a command above.
- (3) Every new string is a P6 placeholder, except the plan's labels (`Filtered`, `Selected`, `Selected, ignoring filter`) and the word `features`, which are byte-for-byte plan §3's. The stopped line is the architect's. Item 54's sentence and clause are the architect's.
- (4) Each required test reaches its intended assertion. I did not test the app end to end.

CALLER GREP (pasted from my run)
- `residentIdsStreamedUnder`: App.tsx:1401-1402 (a useCallback over `canvasRef.current?.residentIdsStreamedUnder(streamedUnder)`, with the `?.` on the ref and none on the method), passed at App.tsx:2483 to TableTab, which calls it from `secondScope`'s inputs. The WorkingCanvas.tsx declaration (no `?`) and implementation use `activeBatches()`.
- `onTableShownChange`: App.tsx:2038 `={setTableShown}`.
- `recordScopeSet` and `recordCancel`: App.tsx:2485-2486.
- `TableSource`: `cancel()` is called at App.tsx:1175 (export handler) and from TableTab; `dispose()` at App.tsx:1395; `start`/`end` from TableTab; `subscribe` and `getSnapshot` through `useSyncExternalStore`.
- Table-side checks: one `traceStreamIssued` (tableSource.ts:163); no `recordResidency*` in table/; no `TABLE_MAX_IN_FLIGHT` export (only the comment); `actionRegistry.ts` unedited.

DISCLOSURES (none is an invalidator)
- Rule (00) at the dispatch commit was the custodian's. Since dispatch, main moved to 94e3549d (records and docs only: CUSTODIAN-QUEUE, PLAN, site, state, two forms); none touches a PR C file. KNOWN-LIMITATIONS has no item 53 on this branch, so the column-0 line goes before item 54. If covering-case's item 53 lands first, the column-0 line becomes the thing to remove.
- Readings of mine, flagged for the gates:
  - With no filter in force, every selected feature passes the second scope (`viewFilter === null`).
  - A first-scope result issued under another filter says nothing about this one.
  - A cancelled, stopped, refused or limit-sized result is not complete.
  - At the limit with no filter, the count line says "the file may hold more"; with a filter it says "more may pass the filter". The stopped line is the architect's and says "more may pass the filter" always.
  - Hide, collapse, a scope change and an export's consumer cancel the stream and keep the rows it delivered (phase "cancelled"); only a session end clears them.
  - The second scope reads the resident set again when the map's scan state changes (`mapSettled`), not on every batch.
- Production behaviour of mine: `TableSource.start` yields one microtask when nothing is held, so a start whose effect is cleaned up at once (React's development double-invoke, `StrictMode` is on in `bootstrap.tsx`) issues no query. Without it the e2e's development build would issue and cancel a first query.
- Words of mine, all P6 placeholders for sight: the Table tab's label `[P6 placeholder] Table`, the scope selector's label, the grid's name, the liveness, cancelled, refusal-lead, ended and export-held lines, the selection lines, the `not held` and `cut` cell markers, the two class-C statements, items 55 and 56 and the first two sentences of item 54, Part AC rows AC6 to AC8 and the README entry.
- `layout.selectActivityTab`'s existing class-C statement named "Console and Notices tabs"; it now says "Console, Notices and Table tabs" (surfaceRegistry.ts is on the list).
- `contributions.ts`'s header comment gained one sentence saying the Table label is a P6 placeholder, not one of the eleven sighted headings.
- Part AC's heading, opening sentence and fixture line now name PR C and AC6 to AC8, as Amendment 7 item 8 says.
- Not done and not claimed: the e2e suite has never run. PC-E2's selected-count read (`.feature-selected` matching `\b3\b`) and PC-E4's trace/console reads follow existing suites' selectors but are unproven. No figure is claimed (OPEN-2 (b)). The stop is proven at unit level only.
- No PR body was written (no PR action); the PR body will need the handle method's name and signature (`residentIdsStreamedUnder(streamedUnder: (filter: Filter | null) => boolean): ReadonlySet<bigint>`), the TABLE_MAX_IN_FLIGHT comment, the three carried texts, and the rule (00) re-read.

HOLD LINES (my project's only): 12 shared holds, one per heavy run — the first-run build and notices, six vitest runs, two `npm run verify` runs and the two scripts-suite runs; for example the first one:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:8012 also=bash.exe:32728 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:8012 affinity=FF (cores 0-7)`
- Each of the others printed the same pair with its own shell id. No exit code 96 to 99 occurred.
- Small single-file vitest runs for the mutations (one test file each) ran outside a hold, being under the heavy bar.

STATE LEFT: HEAD = origin/cut/b1-shell-half-pr-c = bc315fb9d163dc292501618836bc25353c467bd8 (shown by `git rev-parse HEAD origin/cut/b1-shell-half-pr-c`), `git status --porcelain` empty. Every command I started has exited: both background tasks exited code 0, and the only node process listed afterward belongs to another tool's daemon. Scratch files are in my scratch folder under names starting m4c-pc-.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff received or produced.
