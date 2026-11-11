*Custodian's filing note (2026-11-11): the worker's stop on P6 of piece 1c's step 1, given by file (17301 bytes, sha256 c881b512333ac32f36a5de87bbb3e0184d65ba7268bf57772945b0d77b5d4445). Dispatched at 11:42:26Z by its transcript; the hand-back came at 12:17:21Z (claude-sonnet-5-5, a fresh worker-high; one compaction of its own context at 11:55:10Z; unique calls from that dispatch: Read 33, Bash 104, Edit 11, Write 5, the hand-back, 154 in all). Three calls errored: one edit of a file not yet read, which the harness refused, and two foreground sleeps, which the harness blocked; none was a Guardian refusal. The report below was extracted by script from the hand-back in that transcript (10192 bytes, sha256 91667ecec69a90cb027df200dba99c3f55b25846db684f361ba423ac07e46bfd) and is unchanged; one final newline is added. The custodian checked by script: C1's six files and its parent, a3a1ba4e, and commit 2's one file; one sign-off each, git's own; the worktree at commit 2, the porcelain empty, origin's branch still at a3a1ba4e, and no push call; each run's first, step and rc lines in its harness log, the three failing lines it gives found in their logs, both ports free after each run; the two verify logs' vitest summaries; the counting command at B = e57d75e1 recomputed, 70 files and 7200 lines, the e2e group at 444. Its line cites are into the branch.*

---

Stopped: b2-piece-1c-save-and-reopen P6 at 9d55f1f5e45f8468b95b6c52cd1042b5d1ec7983 (two commits, NOT pushed). Step 5's `npm run verify` at the head failed on one vitest test, `src/notices/noticeDeterminism.test.ts`, and the brief forbids a repeated run, so I stopped.

**Core**
- Two commits on cut/b2-piece-1c-save-and-reopen, off a3a1ba4ea550c75fe85b1bf0bbd1ad7398670060.
  - C1 = 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4, `feat: e2e suite for Save project, with a DEV-only hook that supplies its folder`. It holds the six files and nothing else (`git diff --name-only` named exactly those).
  - Commit 2 = 9d55f1f5e45f8468b95b6c52cd1042b5d1ec7983, `docs: record E-SAVE's three mutations in its header` (`project.mjs` only, +16 lines).
- C1's checks all passed:
  - `node --check e2e/project.mjs` rc 0.
  - `npm run verify`, exit 0. vitest: 111 files, 1453 tests passed (the P5 baseline).
  - `check:dist-clean: PASS -- 0 hits for 25 instrument identifiers, 0 surviving call sites for 2 expected-absent-caller identifiers, and >=1 surviving call site each for 7 expected-present identifiers, across 4 dist file…`
  - verify-quotes and verify-cites: PASS.
- Four runs at C1 all went as predicted (details below).
- At the head:
  - `r1` exit 0, every step PASS.
  - `npm run verify` rc=1. This is the stop.
  - The other checks are in the list under "Step 5".
- No push. origin's branch is still at a3a1ba4e; the worktree porcelain is empty.

**The stop**
- In `verify-head.log`, `noticeDeterminism.test.ts` "produces byte-identical output across two independent runs, including two real cargo calls" failed:
  - `Error: Test timed out in 30000ms.` (32247 ms).
  - Counts: `Test Files  1 failed | 110 passed (111)`, `Tests  1 failed | 1452 passed (1453)`.
- The same test passed at C1. The test has a fixed 30 s timeout and runs two real cargo calls; the cargo output in both logs shows `Blocking waiting for file lock on package cache` (34 lines at the head, 39 at C1).
- Likely cause, not proven: I ran `node --test` and the other script checks while verify was running, which loaded the machine. The cargo lock waits also appear in the passing C1 run.
- My changes at the head are `project.mjs` header comments only. The test and `cargo` are untouched by this commit.
- I did not retry, as the brief orders. The caller decides whether to re-run `npm run verify` alone, or to rule on the test's 30 s timeout.

**Start state and resources**
- Worktree C:/dev/wt/b2c at a3a1ba4e, clean. Harness `<H>` = `<S>/b2c-e2e-h`.
- Harness file sizes and sha256 (first 16 hex digits) match the brief:
  - app-down.ps1: 884 bytes, 5973d53fc81973e1
  - app-up-wait.ps1: 210, d908d78d9906ca04
  - app-up.ps1: 1833, 5c9b285d165b56fb
  - build-exe.sh: 626, 3bd30d472694a39b
  - busy.ps1: 983, 134866948a831261
  - run-suite.sh: 1583, d261957b9fc3c8cd
  - tauri.conf.json: 293, 0dc02596e3f90f36
  - shim/npx.cmd: 224, 30a3d9934df1e86c
  - shim-wait/npx.cmd: 304, 48e10cb6f5a11fa6
- Fixture before and after every run: 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, unchanged.
- Exe: built before any code, copied to `D:/wt-targets/b2c/exes/spatial-ide-shell-b2c.exe` (91542528 bytes, Nov 11 12:46).

**E-SAVE's steps (`e2e/project.mjs`, 9 steps)**
OPEN, CLAUSES, STYLE, POSE, SAVE, READBACK-FILTER, READBACK-STYLE, READBACK-VIEW, SECOND-SAVE.
- Every save goes through `e2eSaveProjectToFolder`.
- The driver reads `project.spatial` from disk.
- The pose is three non-short numbers, checked as HexF64 patterns.

**Runs** (each in a shared hold, background mode, the audit file absent before the run)
- `e-save`: log first line `worktree C:/dev/wt/b2c head 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4 start 2026-11-11T11:57:28Z`; all 9 steps PASS; last line `rc=0 end 2026-11-11T11:57:56Z`.
- `m-filter`: SAVE moved between OPEN and CLAUSES (a two-line move). Reverted by `git checkout --`; porcelain empty. Failed at:
  `[READBACK-FILTER] FAIL (0ms): READBACK-FILTER: the file's clauses read [], expected [{"text":"\"zone\" = 'residential'","enabled":true},{"text":"\"zone\" <> 'residential'","enabled":false},{"text":"\"zone\" IS NOT NULL","enabled":true}]`
  `rc=1 end 2026-11-11T11:59:17Z`.
- `m-view`: in `WorkingCanvas.tsx`'s `currentView`, `centre` returned as `[camera.targetX, camera.targetY]`. Reverted; porcelain empty. Failed at:
  `[READBACK-VIEW] FAIL (1ms): READBACK-VIEW: the file's view reads {"centre":["0000000000000000","0000000000000000"],"zoom":"bfeb6db6db6db6dc"}, expected the pose's HexF64 patterns {"centre":["4143d7e22aaaaaab","4132530449249249"],"zoom":"bfeb6db6db6db6dc"}`
  `rc=1 end 2026-11-11T12:00:38Z`.
- `m-hook`: in `App.tsx`, the hook built its own `createProjectSaver` whose `pickFolder` answers the supplied folder, in place of `await handleSaveProject()`. Reverted; porcelain empty. Failed at:
  `[SAVE] FAIL (29ms): SAVE: the first e2eSaveProjectToFolder answered "not-asked", expected "asked"`
  `rc=1 end 2026-11-11T12:02:13Z`.
- `r1` (at the head 9d55f1f5, unmutated): all 9 steps PASS; `rc=0 end 2026-11-11T12:05:30Z`.
- For every run (including `r1`):
  - app-down printed two `killed tree` lines, then `port 9223 free` and `port 5400 free`.
  - `app.err.log` has 2 lines in all: the session-log line, then `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`.
  - Reports copied: the console ledger json and `tauri.e2e.conf.json` (`e-save` also `app.log`).
  - Audit log: none written. `SPATIAL_IDE_AUDIT_LOG` named a file the app never created, so its size is absent.
  - Session log copied to `<S>/b2c-p6-<tag>.session.log` (6364 bytes each).
  - The suite's three scratch folders were gone after each run.
- The three Observed lines in commit 2's header were checked with `grep -Fx` against the run logs: byte-identical.

**Step 5** (exit code, last line)
- `r1`: 0.
- `npm run verify`: 1, the stop above.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` from the worktree root: 0; `ℹ pass 598`, `ℹ fail 0` (598 tests).
- verify-cites: 0; `verify:cites PASS — every rooted (in-tree) path:line reference across 2831 file(s) resolves. (176 loose reference(s) advised above.)`
- verify-quotes (in a hold): 0; `verify:quotes PASS — 155 checked, 124 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 924 ruling cites resolved, 0 ruling-cite errors.`
- verify-test-claims: 0; `verify:test-claims PASS — all 783 claimed test(s) across 252 file(s) exist or are planned, superseded or withdrawn (25 planned, 14 superseded, 17 withdrawn, advisory).`
- `verify.mjs --offline`: 0; `verify:plan PASS — C:\dev\wt\b2c\governance\PLAN.yaml agrees with the repository.`

**Counting command** (`git diff --numstat e57d75e191ea35fe44c3a26887d73b82f4b53262...HEAD` with the form's pathspecs; this counts everything since B, so it includes earlier steps' work)
- Total: 7,200 lines (6,982 added, 218 deleted), 70 files, against ≤ 4,790 lines and ≤ 77 files. Lines overrun; files are within.
- Groups, as I assigned paths (the form's table does not name every path, so the assignment is mine):

| Group | Lines | Files | Ceiling |
|---|---|---|---|
| probe | 144 | 3 | 150 |
| ADR text | 45 | 2 | 80 |
| renderer | 123 | 1 | 200 |
| protocol product | 407 | 4 | 320 |
| protocol tests and fixtures | 539 | 25 | 260 |
| kernel product | 3,206 | 8 | 1,350 |
| kernel tests, the three named | 1,066 | 3 | 1,000 |
| kernel tests, `project_save_skp.rs` and `record_step_match.rs` | 481 | 2 | none named |
| src-tauri | 66 | 2 | 100 |
| shell product, the five named | 266 | 5 | 380 |
| shell product, other non-test src (canvas, layout, actionRegistry, e2e-test-surface) | 41 | 4 | none named |
| shell tests | 372 | 7 | 380 |
| e2e | 444 | 4 | 320 |
| records | 0 | 0 | 120 |

- The e2e group is `project.mjs` 424, `README.md` 16, `checkDistClean.mjs` 3, `package.json` 1. It overruns 320 by 124, and `project.mjs` alone is 424 (408 at C1, +16 header). Reported, not trimmed.
- Of the protocol tests, 10 `tests/data` files are one-line version-literal edits (20 lines). They are counted inside the protocol-tests row.

**Additions the form does not name**
- None in code. Scratch files are in `<S>`, all named `b2c-p6-*`.

**Departures from the brief**
- I ran `node --test`, verify-cites, verify-test-claims and `verify.mjs --offline` (all light) while `npm run verify` was running in its hold. This is the likely load behind the timeout; stated, not proven.
- `m-view` and `m-hook` edited `WorkingCanvas.tsx` and `App.tsx`; both were reverted and the porcelain shown empty. The `m-filter` and `m-hook` edits were mine.

**Harness disclosure**
- Port-5400 harness under item 1 of the 2026-10-11 approval. It wrote only to `<H>/out/`, `<H>`'s app logs, `<S>`, `D:/wt-targets/b2c`, `C:/dev/wt/b2c/frontends/shell/e2e/out/` (ignored), and the app's per-user session-log folder and the suite's own scratch folders under the OS temp folder (removed after each run).

**Hold lines**
- Each hold printed `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid> also=…` (with `also=` elided). No exit 90, 96 to 99, or hung run.

**Background shells left:** none; every task I started completed. Nothing was killed by me.

**Model:** Sonnet 5.5 (claude-sonnet-5-5).

**Pre-gate self-check of the four failure classes**
1. Misquotes: the only quoted text is byte-copied log lines, checked by `grep -Fx`.
2. Scope: C1 holds the six files and commit 2 holds one; the reverted mutations aside, nothing else was touched.
3. Record fidelity: both commit messages carry the trailer lines and no email or ruling name. `git -s` added the sign-off.
4. Claims: every number above comes from a log or command output. The timeout cause is labelled as not proven.

**Off-scope list:** none.

**Caller grep for the hook**
- `e2eSaveProjectToFolder` is registered only in `src/App.tsx` (the top-level effect behind `isInstrumentedBuild()`), declared in `src/e2e-test-surface.ts`, listed in `e2e/checkDistClean.mjs`, and called only from `e2e/project.mjs`.
