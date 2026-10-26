*Custodian's filing note (2026-10-24): milestone 4 PR C's Amendment 8, drafted read only by the architect at main 905f31c8 after the worker-high's I1 stop (`state/consults/2026-10-24-b1-shell-half-pr-c-i1-stop-worker-report.md`). The run 09:24:23Z to 09:33:35Z by its transcript (Read 24, Grep 22; no Write, Edit or Bash). Its Amendment 8 block is appended to the form in the commit that files it, every custodian slot filled by script. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 799dbdab62ae6e0669b7a70b264e3eb8fbb3583f047b470efa873bd0ca20e0ae.*

---

Drafted: b1-shell-half PR C's Amendment 8, at main 905f31c8 (main @ 905f31c8633570057c24c15173f1400cdb32214c; this is a draft, not a gate, so there is no verdict). I changed no file.

## What I settled, item by item

**1. `App.test.ts` joins the list (class 9), and a second caller exists by the same route.**
- `App.test.ts` joins with a ceiling of 30, not the worker's 12. That covers:
  - the six-line `null` fill: 12 lines by §7's command;
  - two handle-stub lines (item 4);
  - one new test, PC-U15.
- **Why PC-U15 is needed.** With `null` fills alone, nothing proves that `makeManagerCallbacks` passes the filter on. A mutation passing `null` at `App.tsx:599` would survive every test, because PC-U7 starts at `pushBatch` and PC-U12 ends at `onBatch`.
- **The second caller.** `App.lateResult.test.tsx` captures App's `onBatch` option through its mocked `ViewportStreamManager`, typed by the mock's own three-parameter list (lines 87 and 242), and calls it with three arguments (line 678).
  - `tsc` passes because the mock declares its own type.
  - vitest passes because the mocked canvas's `pushBatch` ignores its arguments.
  - After PR C it encodes an interface the manager no longer has, which the seam rule fails by name. It joins as a fill file.
- **The search.** The regex `onBatch\b` over `frontends/shell/src` gives 15 files at 905f31c8. I read every hit outside the managers, `candidateArmSession.ts` and their tests:
  - `transport.ts` and `adapterWs.ts` (and its test) use `StreamSink.onBatch(payload, contiguous)`, a different interface;
  - `residencyInstrument.ts`, `e2e-test-surface.ts` and `WorkingCanvas.tsx` hit only in comments;
  - `App.tsx` is the product site;
  - `App.test.ts` and `App.lateResult.test.tsx` are the only two callers.
  - A second search, for `new (TileViewportStreamManager|ViewportStreamManager)\(` and `startCandidateArmSession\(`, finds code only in `App.tsx`, `candidateArmSession.ts` and the two managers' tests.
- **Totals.** 57 files and 4,248 lines, not 53 and 4,208. Four more files and 40 more lines come from items 1 and 4.

**2. `actionRegistry.ts`: not edited.** §2.4 names no registry entry, OPEN-10 (a)'s reveal entries belong to PR B (§2.3 (j)), and the Table tab is reached through Activity's tabs (§2.4 (a)). Its 15 lines stay unused, since §7's figures are ceilings. The twelve-id test is at line 132 at main, not 133 as the worker wrote, and it stays off the list.

**3. `TABLE_MAX_IN_FLIGHT`: left out as a constant (class 1).**
- A constant with no reader is §8 item 13, and a guard compared against it could never fire.
- The bound still holds by structure: the source keeps one handle and cancels it before it issues another. That is proven by PC-U1, read to include the call order, by PC-R1, and checked under §8 item 10.
- A one-sentence comment in `tableConstants.ts`, in my words, records the omission.

**4. The canvas handle method: required, with no `?`.**
- The governing rules are Amendment 3 item 5, Amendment 4 item 2 and §8 item 13.
- If it were optional, the component could omit it and still compile, and App's call would need a guard that only stand-ins take.
- `fitToBbox?` was milestone 2's own reading for its own member.
- The worker's count was off. By the search for `clearAllTiles:` in test files, there are 10 stand-in literals in 9 files. Three App files are already fill files under Amendment 7 item 3, `candidateArmSession.test.ts` is on §2.6's list, and two files join by item 1. That leaves only `App.layout`, `App.recording` and `App.workspace` to join here, at 2 lines each.

**5. PC-U6 goes in `tableSource.test.ts`,** with the real tile manager and the real source. Only the transport is mocked: the same modules the tile manager's test mocks (lines 9 to 32). The batches come from the shared helper through the real `decodeBatch`. Nothing on I5's list is mocked. The mutation is `isRetryableRefusal` returning `false`.

**6. PC-E4.** It asserts five things:
- the liveness line shows;
- the table's handle is the one on the `stream-issued` trace line that follows its class-A `viewport_query` row;
- that row is identified by `bbox` null and limit 1,000, not the first look's 10,000;
- after Cancel, there is a class-A `cancel` row for that handle with an ok outcome;
- no table re-issue follows.

"No stream left" is read as: the stream was cancelled through the client and accepted, and no other table stream was issued. The suite claims nothing about the engine releasing the stream. `tableSource` calls `traceStreamIssued` as the other issuers do, and calls no `recordResidency*`. `residencyInFlightStreamCount` is rejected: it counts only while the instrument is enabled, and only the residency managers' streams (residencyInstrument.ts:785-804). The mutation is §4's own, unchanged.

**7. The four notices failures.** Amendment 2 item 4 does not cover them. It is a reading under I3 about the exe build, and they don't need it: `npm run verify` builds before it tests (package.json:12, 14, 15, 17). The worker hit them by running `npx vitest run` in a fresh worktree with no build first. At the base, before any edit, the worker runs:
1. `npm ci` in `renderer/bundle-viewer`, if its `node_modules` is missing;
2. `npm run build`;
3. `npx vitest run src/notices`.

A failure at that point is a stop.

## Amendment 8

```
## Amendment 8: PR C's scope addition and readings, written after the worker-high's I1 stop was seen, before any PR C code. Six test files join PR C's list, two fill forms are added, and four listed test files gain fill lines (class 9). `actionRegistry.ts` is not edited, `TABLE_MAX_IN_FLIGHT` is met by structure, the canvas's new handle method is required, PC-U6 has its home, PC-E4's last clause is read, and the worker's first run is named (class 1).

*Written after PR C's worker-high stopped at I1 on `cut/b1-shell-half-pr-c` at 4e9dd53def3019fa0f5b08e2e655fcb032cf8c10, with nothing committed, and before any PR C code. Drafted read-only by the architect at main 905f31c8 [custodian: full hash] (`state/consults/2026-10-24-b1-shell-half-pr-c-amendment-8-architect-draft.md`). The stop is `state/consults/2026-10-24-b1-shell-half-pr-c-i1-stop-worker-report.md` (its sha256 from line 5 [custodian: recompute; its filing note gives d6b46362cda8e6e42dc58e7002577ad1c243e1c8dee987e3309281f757340e3c]). References only; nothing below is a quotation, and none of it is the human's wording. The scope addition rests on the cross-module seam rule (RULED 2026-09-16, question round 4) and on §2.6's last paragraph (round 25, item 2 (a)). Every `@ 905f31c8` pin is read at that commit; for PR C's work the tree at its code's base is authoritative (§0.3). §7 and Amendment 7 are not edited.*

1. **`App.test.ts`, and the second caller by the same route (class 9).**
   - **The need.** Amendment 7 item 4 makes the filter `onBatch`'s required fourth argument. `makeManagerCallbacks`'s `onBatch` passes it to `pushBatch` (`frontends/shell/src/App.tsx:598-601` @ 905f31c8 sha256:[custodian: …]), on the baseline arm only (`frontends/shell/src/App.tsx:1707` @ 905f31c8 sha256:[custodian: …]).
   - **Caller 1, found by `tsc`.** `App.test.ts` calls `callbacks.onBatch` with three arguments (`frontends/shell/src/App.test.ts:428` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/App.test.ts:439` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/App.test.ts:510` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/App.test.ts:519` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/App.test.ts:526` @ 905f31c8 sha256:[custodian: …]) and asserts three arguments on `pushBatch` (`frontends/shell/src/App.test.ts:431` @ 905f31c8 sha256:[custodian: …]).
   - **Caller 2, found by neither `tsc` nor the suite.** `App.lateResult.test.tsx` captures App's `onBatch` option through its mocked `ViewportStreamManager`, typed by the mock's own three-parameter list (`frontends/shell/src/App.lateResult.test.tsx:87` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/App.lateResult.test.tsx:242` @ 905f31c8 sha256:[custodian: …]), and calls it with three arguments (`frontends/shell/src/App.lateResult.test.tsx:678` @ 905f31c8 sha256:[custodian: …]).
     - It compiles because the mock declares its own type. It passes because the mocked canvas's `pushBatch` ignores its arguments.
     - After PR C it encodes an interface the manager no longer has, so it joins the list.
   - **Reading (class 1).** Amendment 7 item 4's statement that `tsc` finds every caller holds for a call typed by the real option. It does not reach a callback captured through a mock's own type. Such callers are found by the search below.
   - **The search, at 905f31c8** [custodian: confirm by script]:
     - The regex `onBatch\b` over `frontends/shell/src` gives 15 files.
     - Outside the three managers, `candidateArmSession.ts` and their tests, every hit was read:
       - `streaming/transport.ts`, `streaming/adapterWs.ts` and its test use `StreamSink.onBatch(payload, contiguous)`, a different interface;
       - `instrument/residencyInstrument.ts`, `e2e-test-surface.ts` and `canvas/WorkingCanvas.tsx` hit only in comments;
       - `App.tsx` is the product site;
       - `App.test.ts` and `App.lateResult.test.tsx` are the two callers.
     - `new (TileViewportStreamManager|ViewportStreamManager)\(` and `startCandidateArmSession\(` appear in code only in `App.tsx`, `candidateArmSession.ts` and the two managers' tests.
     - No third caller exists.
   - **Fill forms, added to Amendment 7 item 3's:**
     - `null` as `onBatch`'s fourth argument, and as `pushBatch`'s fourth expected argument in the assertion that mirrors that call;
     - in a mock's own capture type, a fourth parameter, typed as that type types `payload`.
     - Each is true of its fixture: every stream these tests model is issued with no filter (synthetic handles in `App.test.ts`; A's first look in `App.lateResult.test.tsx`).
     - No assertion, title, comment or recorded mutation changes, apart from PC-U15 below.
   - **PC-U15** (`App.test.ts`, new; the title in the architect's words: `onBatch passes its stream's filter to pushBatch as the same object`).
     - It calls `makeManagerCallbacks` over a stand-in canvas, then `onBatch` with a filter object F.
     - `pushBatch`'s fourth argument is F (`toBe`).
     - Mutation: `makeManagerCallbacks` passes `null` to `pushBatch`; the test fails.
     - It proves the App site of the filter seam, which PC-U7 (from `pushBatch` on) and PC-U12 (up to `onBatch`) do not reach. The baseline arm only a dev switch selects, so this site has no end-to-end proof. That is named here, not claimed.

2. **`frontends/shell/src/layout/actionRegistry.ts`: not edited (class 1).**
   - §2.4 names no registry entry. OPEN-10 (a)'s reveal entries are PR B's (§2.3 (j)), and the Table tab is reached through Activity's tabs (§2.4 (a)).
   - The test that pins exactly twelve ids (`frontends/shell/src/layout/actionRegistry.test.ts:132` @ 905f31c8 sha256:[custodian: …]) stays off the list.
   - C-P's `actionRegistry 15` goes unused; §7's figures are ceilings.
   - An entry added in PR C is outside §2.4, and its test edit would be I1.

3. **`TABLE_MAX_IN_FLIGHT`: met by structure, not declared as a constant (class 1).**
   - A constant with no reader is a `pub` item without a product caller (§8 item 13), and a guard compared against it could never fire.
   - **The bound** (§7: 1 table stream per open) holds by the source's structure. `tableSource` keeps one stream handle, and calls `cancel` on it before it issues the next `viewport_query`. Hide, collapse, open, replace, generation end and session end cancel it (§2.4 (b)).
   - **Proof.** PC-U1's "supersede cancels" is read to include call order: the held handle's `cancel` call comes before the next `viewport_query` call. PC-R1 also applies, and §8 item 10 checks it.
   - **No claim past the shell's own count.** The engine may hold a cancelled stream until its cancel completes. That is the window §2.4 (e) and KL-5 name.
   - **The comment** (the architect's words, not the human's). The worker adds it to `frontends/shell/src/table/tableConstants.ts`, and the PR body lists it: `TABLE_MAX_IN_FLIGHT (milestone 4 section 7, 1) is not a constant here: tableSource holds one stream handle and cancels it before it issues another, so no code would read the constant.`
     - The reviewer checks each clause at the head: the one handle field; PC-U1's order assertion; the constant's absence.
   - **PR B:** its cases query (OPEN-16 (b)) goes through the same handle. PR B's amendment states how.

4. **The canvas's new handle method (Amendment 7 item 4): required (class 1), with its stand-ins (class 9).**
   - **The reading.** The method has no `?` in `WorkingCanvasHandle`, and App calls it with no `?.` on the method (Amendment 3 item 5; Amendment 4 item 2; §8 item 13).
     - If optional, the component could omit it and still compile.
     - App's call would then need a branch for an absent method that only a stand-in takes.
     - `fitToBbox?` (`frontends/shell/src/canvas/WorkingCanvas.tsx:138-142` @ 905f31c8 sha256:[custodian: …]) is milestone 2's reading for its own member, and it is not followed here.
   - **The stand-ins.** The search for `clearAllTiles:` in `frontends/shell/src/**/*.test.*` finds 10 handle literals in 9 files at 905f31c8 [custodian: confirm by script]:
     - `App.command.test.tsx`, `App.selection.test.tsx` and `App.attributes.test.tsx` are already on the list (Amendment 7 item 3);
     - `residency/candidateArmSession.test.ts` is on §2.6's list;
     - `App.test.ts` (two literals) and `App.lateResult.test.tsx` join by item 1;
     - `App.layout.test.tsx`, `App.recording.test.tsx` and `App.workspace.test.tsx` join here.
     - The stop report's seven files outside the list are four.
   - **The fill form.** One line in each literal: the method stubbed to answer that no id is resident, in the method's return type. It is true of every stand-in, because none stores a batch.
   - **The method's name and signature are the worker's,** and the PR body names them. It reads the resident set and changes nothing.

5. **PC-U6's home: `frontends/shell/src/table/tableSource.test.ts` (class 1), inside its §7 320.**
   - **Real code.** The real `TileViewportStreamManager` and the real `tableSource`.
   - **What is mocked: only the transport,** as the tile manager's test mocks it (`frontends/shell/src/streaming/tileViewportStreamManager.test.ts:9-32` @ 905f31c8 sha256:[custodian: …]):
     - `skp/client`'s `viewportQuery` and `cancel`, with the real `SkpCallError`;
     - `dataPlaneAttach`;
     - `startStream`;
     - `logSessionEvent`.
     - If `tableSource` reaches the transport through other modules, those modules are the ones mocked; the source's imports are read first.
   - **Batches** come from `testUtils/attributeBatchIpc.ts` through the real `decodeBatch` (Amendment 7 item 6).
   - **Asserts:**
     - while the table's stream is open, a tile whose first `viewport_query` is rejected with `engine.connections_exhausted` is issued again exactly once: two calls with its bbox, and the mint-recovered log line;
     - there is no `cancel` for the table's handle;
     - a table batch delivered after the retry is added.
   - **Mutation:** `isRetryableRefusal` returns `false` (`frontends/shell/src/streaming/tileViewportStreamManager.ts:327-330` @ 905f31c8 sha256:[custodian: …]); the test fails.
   - **Limits.** Nothing on I5's list is mocked. PC-U6 claims nothing about the engine's admission count; that is KL-5.

6. **PC-E4 (class 1).**
   - **What it asserts.** The fixture is `slow-filter-scan.parquet`, with Activity open on the Table tab and the first scope, after the canvas settles:
     1. the liveness line shows, with Cancel;
     2. the table's handle is the one named by the `stream-issued` render-trace line that follows the table's class-A `viewport_query` row. That row is identified by `bbox` null and `limit` 1,000, against the first look's 10,000 (`frontends/shell/src/canvas/tileGridConstants.ts:185` @ 905f31c8 sha256:[custodian: …]);
     3. after Cancel, a class-A `cancel` row whose request carries that handle shows, with an ok outcome (`frontends/shell/src/skp/client.ts:46-68` @ 905f31c8 sha256:[custodian: …]; `frontends/shell/src/console/ConsolePanel.tsx:162-175` @ 905f31c8 sha256:[custodian: …]);
     4. the liveness line and Cancel are gone, and no further class-A `viewport_query` row with the table's request appears within the suite's settle window.
   - **"With no stream left"** reads: the table's one stream was cancelled through the client, the kernel accepted the cancel, and the table issued no other. No SKP reply or operator surface shows the engine releasing the stream. That case is not covered, and the suite's source comment says so.
   - **The trace call.** `tableSource` calls `traceStreamIssued` once at its mint (`frontends/shell/src/diagnostics/renderTrace.ts:33-35` @ 905f31c8 sha256:[custodian: …]), as `frontends/shell/src/streaming/viewportStreamManager.ts:373` @ 905f31c8 sha256:[custodian: …], `frontends/shell/src/streaming/tileViewportStreamManager.ts:1102` @ 905f31c8 sha256:[custodian: …] and `frontends/shell/src/residency/candidateArmSession.ts:1442` @ 905f31c8 sha256:[custodian: …] do. It calls no `recordResidency*` function.
   - **Not `residencyInFlightStreamCount`.** It counts only while the instrument is enabled, and only the residency managers' streams (`frontends/shell/src/instrument/residencyInstrument.ts:785-804` @ 905f31c8 sha256:[custodian: …]).
   - **Mutation: §4's, unchanged.** Cancel is not wired to `cancel` (`frontends/shell/src/skp/client.ts:128` @ 905f31c8 sha256:[custodian: …]; the tree is authoritative over the 4b26d279 pin). Expected failure: assertion 3.

7. **The worker's first run (class 1).**
   - **The four `src/notices/*` failures** came from `npx vitest run` with no build in a fresh worktree. Those tests read the metafiles that `pretest` builds (`frontends/shell/src/notices/portedNotices.test.ts:13-14` @ 905f31c8 sha256:[custodian: …]).
   - **Amendment 2 item 4 does not cover them.** It is a reading under I3 for the exe build. `npm run verify` needs no cover: it builds before it tests (`frontends/shell/package.json:17` @ 905f31c8 sha256:[custodian: …]), with `prebuild` building the viewer and the notice first (`frontends/shell/package.json:12` @ 905f31c8 sha256:[custodian: …]). A notices failure inside `npm run verify` is a verify failure.
   - **First, at the base, before any edit, under one shared hold:**
     1. `npm ci` in `renderer/bundle-viewer`, if its `node_modules` is absent (`frontends/shell/scripts/buildViewerFirst.mjs:27-33` @ 905f31c8 sha256:[custodian: …]);
     2. `npm run build` in `frontends/shell`;
     3. `npx vitest run src/notices`, recording rc and each file's result.
   - A failure there is a stop, reported before code.

8. **The addition (class 9).** These lines are counted by §7's command. An overrun of a file or a group is class 8.

   | Group | Files (ceiling each) | At most |
   |---|---|---|
   | C-T, added | `frontends/shell/src/App.test.ts` 30 (fills 12, stubs 2, PC-U15 16) | 30 |
   | C-T, fills added | `frontends/shell/src/App.lateResult.test.tsx` 8, `frontends/shell/src/App.layout.test.tsx` 2, `frontends/shell/src/App.recording.test.tsx` 2, `frontends/shell/src/App.workspace.test.tsx` 2 | 14 |
   | C-T, lines added to listed files | `frontends/shell/src/App.command.test.tsx` 2, `frontends/shell/src/App.selection.test.tsx` 2, `frontends/shell/src/App.attributes.test.tsx` 2 (each beside Amendment 7 item 3's 4), `frontends/shell/src/residency/candidateArmSession.test.ts` 2 (beside §7's C-T managers 80) | 8 |
   | **Added** | | **52** |

   - **PR C's new totals:** 57 files, and 4,196 + 52 = 4,248 lines.
   - **I1.** A further edit that `tsc --noEmit` needs outside §2.6, Amendment 7 item 3 and this amendment is I1. So is a caller found by item 1's search outside them.

9. **§8 and §9.**
   - **§8 item 17** gains the filter seam's App site, proved by PC-U15.
   - **The architect adds:**
     - the handle method required, with no `?.` on it;
     - one `traceStreamIssued` per table mint, and no `recordResidency*` in `table/`;
     - no `TABLE_MAX_IN_FLIGHT` export;
     - `actionRegistry.ts` unedited.
   - **The reviewer adds:**
     - item 1's search run again at the head, with no three-argument `onBatch` call or capture;
     - the diffs of item 8's files contain only item 1's and item 4's forms, plus PC-U15;
     - the mutations of PC-U6 and PC-U15, applied again.

10. **Rule (00) for the added paths.** The five added paths are under `frontends/shell/src`. They join Amendment 7 item 9's re-read at dispatch [custodian: by script, `git diff --name-only origin/main...<branch>` for each in-flight branch, PR #250's included, against these five paths; the result recorded in the PR body].

11. **Next.**
    1. This amendment is pinned by script.
    2. `cut/b1-shell-half-pr-c` is brought to main at this amendment's commit, by a fast-forward or a merge, never a rebase.
    3. The worker-high runs item 7's base run, then writes PR C's code. Its step-1 patch is its own unreviewed work.
    4. The node's generation goes up by one.

**Superseded for PR C:**
- §2.6's PR C list: added to by items 1, 4 and 8.
- §7's PR C totals: read with Amendment 7 item 3 and item 8. §7 is unedited.
- Amendment 7 item 3's fill forms and three of its ceilings: added to by items 1, 4 and 8. Amendment 7 is unedited.
- Amendment 7 item 4's statement that `tsc` finds every caller: read with item 1.
- §7's `TABLE_MAX_IN_FLIGHT` row: met by structure, item 3.
- §4's PC-U1: read with item 3. PC-U6: its home is item 5. PC-E4: read by item 6. §4 gains PC-U15 (item 1).
- The stop report's count of stand-in files: item 4.

Read the last amendment first.

Nothing above is edited.
```

## What I could not settle

1. **Every `[custodian: …]` slot.** I have no shell, so all the hashes need recomputing, and both searches (items 1 and 4) need confirming by script.
2. **Rule (00) for the five added paths (item 10).** I cannot read the in-flight branches, PR #250's included, so I cannot say whether any of them touches these paths.
3. **The handle method's name and signature.** They are the worker's choice. I have not checked that the method fits inside Amendment 7's `WorkingCanvas.tsx` 40.
4. **Whether `tableSource` imports the transport from the same modules the tile manager's test mocks (item 5).** The source does not exist yet.
5. **Whether the four notices tests pass at the base after a build.** That is the worker's first run (item 7).
6. **Whether `tsc` needs more edits once the method is required and the slots are filled.** I derived the stand-ins by search, not by a compile.
7. **The PC-U15 and tableConstants comment wordings.** They are mine, not the human's, and a clause check is possible only at the head.

Files read:
- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-10-24-b1-shell-half-pr-c-i1-stop-worker-report.md
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/frontends/shell/src/App.test.ts
- C:/dev/spatial-ide/frontends/shell/src/App.lateResult.test.tsx
- C:/dev/spatial-ide/frontends/shell/src/App.layout.test.tsx
- C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/spatial-ide/frontends/shell/src/layout/actionRegistry.ts and its test
- C:/dev/spatial-ide/frontends/shell/src/instrument/residencyInstrument.ts
- C:/dev/spatial-ide/frontends/shell/src/diagnostics/renderTrace.ts
- C:/dev/spatial-ide/frontends/shell/src/skp/client.ts
- C:/dev/spatial-ide/frontends/shell/src/console/ConsolePanel.tsx
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts and its test
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.test.ts
- C:/dev/spatial-ide/frontends/shell/package.json
- C:/dev/spatial-ide/frontends/shell/scripts/buildViewerFirst.mjs
