*Custodian's filing note (2026-10-24): milestone 4 PR C's worker-high, stopped at I1 before any commit, on `cut/b1-shell-half-pr-c` at 4e9dd53def3019fa0f5b08e2e655fcb032cf8c10 (the branch and the worktree unchanged, its porcelain empty). The run 08:39:28Z to 08:55:10Z by its transcript (Read 34, Bash 68, Write 4; writes only in its worktree, since reverted, and to its own scratch files; no commit, push, merge, rebase or PR action). Its step-1 patch and raw outputs stay in the custodian's scratch folder under the names it gives. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is d6b46362cda8e6e42dc58e7002577ad1c243e1c8dee987e3309281f757340e3c.*

---

STOPPED AT I1. Nothing built: b1-shell-half PR C stays at 4e9dd53def3019fa0f5b08e2e655fcb032cf8c10. I made no commit and no push. This follows your rule that an edit `tsc --noEmit` needs outside the list is I1: STOP and report.

**The invalidator**
- One file outside §2.6's PR C list and outside Amendment 7 item 3's 22 additions needs an edit: `frontends/shell/src/App.test.ts`.
- Cause: Amendment 7 item 4 makes the filter a required argument of each manager's `onBatch`. `makeManagerCallbacks` in `App.tsx` is the product site that passes it on to `pushBatch`. `App.test.ts` is that function's only test, and it calls `callbacks.onBatch(...)` with three arguments.
- The re-sweep's row 7 counted callers of `.pushBatch(` and `.pushTileBatch(`. These calls go through the callbacks object, so they were not counted.
- `npx tsc --noEmit` on my step-1 edits, exit code 2: 100 errors in 20 files, all TS2554 or TS2741 about the new argument or member.
  - 19 of the 20 files are in the list.
  - The 20th is `src/App.test.ts`, 5 errors "Expected 4 arguments, but got 3", at lines 428, 439, 510, 519 and 526.
- The vitest suite at the same state showed one more runtime failure in that file:
  - the `toHaveBeenCalledWith("sh_old", 0, new Uint8Array([9]))` assertion in the test "onBatch and onSuperseded hit the exact canvas passed at construction…" (about line 432);
  - it received a trailing `undefined`.
- Suite result: 11 failed files, 24 failed tests, 93 files passing.
  - Failures in listed files were expected, because I had not updated their tests yet.
  - Four `src/notices/*` files also failed. Their causes are a missing `dist-metafile.json` and the provisional `NOTICE.txt` in this worktree, which `npm run build` replaces. I did not check whether they fail at the base, so treat them as environment, not mine.
- Edit needed: `, null` on the 5 calls and on that assertion. That is 6 lines changed, or 12 by §7's command.
- I did not route around it:
  - An optional fourth `onBatch` parameter would compile but still fail the assertion at line 432.
  - It would also be a defaulted parameter used only by tests (Amendment 3 item 5, §8 item 13).
- A class 9 amendment is needed before code. Suggested: add `frontends/shell/src/App.test.ts` as a fill file with ceiling 12. That makes 53 files and 368 added lines in the amendment's table, so 4,208 in all by item 3's reckoning.

**Other things to settle in that same amendment** (found while reading; none acted on)
1. **`actionRegistry.ts`:** it is on the list at 15 lines, but `actionRegistry.test.ts` pins the exact twelve ids (line 133 of that test, "holds exactly the twelve ids…"). That test is not on the list, so any added entry (for example a `/table` reveal) would itself be I1. §2.4 names no registry entry for PR C, so I would leave the file unedited. Say if you want otherwise.
2. **`TABLE_MAX_IN_FLIGHT` (§7 declares it):** it would have no product caller (§8 item 13), because the source holds one stream structurally. I would omit it and disclose that. Say if you want it declared anyway.
3. **The new `WorkingCanvas` handle method:** the second scope needs one. It must be optional in the type, like `fitToBbox?`, because 7 App test files build stand-in handles that are not on the list.
4. **`PC-U6`:** it needs a home. I proposed `tableSource.test.ts`, with the real tile manager and the real table source over one mocked transport.
5. **`PC-E4` "no stream left":** `residencyInFlightStreamCount` counts a stream only while the instrument is enabled, so the table's stream would not show in it. I would assert from the DOM, `traceStreamIssued` and the Console's class-A `cancel` row instead.

**State left**
- `git status --porcelain` is empty. HEAD is 4e9dd53def3019fa0f5b08e2e655fcb032cf8c10, and origin/cut/b1-shell-half-pr-c is the same.
- I reverted my uncommitted edits with `git checkout -- .` and removed the one new file.
- My step-1 product edits are saved, unreviewed, in my scratch folder.
  - `m4c-pc-wip-step1.patch` is 12 product files, +101 −44. It carries the filter seam: `ResidentBatch.filter` and `decodeBatch`'s seventh parameter, the managers' `onBatch`, the candidate session, `WorkingCanvas`, the two rebuilds, `clickPick`, `clickEffect`, `selection.ts` with `capturedRow` and the cut marker, `viewTransitions.ts`, the `App.tsx` callback, and the tile-manager comment restated.
  - `m4c-pc-wip-tableConstants.ts` holds `CAPTURED_ROW_MAX_BYTES`.
  - `m4c-pc-tsc1.txt` and `m4c-pc-vitest1.txt` are the raw outputs.
  - Tests were not updated in that patch.

**Checks run** (not the full list; I stopped at I1)
- `npx tsc --noEmit` at the base: exit code 0. After my step-1 edits: exit code 2, 100 errors in 20 files, as above.
- `npx vitest run --reporter=dot` in a shared hold, exit code 1: "Test Files 11 failed | 93 passed (104)", "Tests 24 failed | 1389 passed (1413)".
- Not run, because I stopped: §7 by group and file, the fill diffs, the lock diffs, `verify-cites`, `verify-quotes`, `verify-test-claims`, `verify.mjs`, the scripts suite, `node --check e2e/table.mjs`.
- No test was written, so no mutations were observed. There are no e2e mutations to list, no carried texts to compare, and no §7 table.

**Hold lines** (my project only, one hold for the vitest run)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:20828 also=bash.exe:38484 (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:20828 affinity=FF (cores 0-7)`
- No exit code 96 to 99 occurred.

No process I started still runs. I observe myself as Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
