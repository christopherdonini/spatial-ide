# PR B's selection E-EXPORT failure diagnosed: runs at main's base 619a7cc9 and at d1d3a29f, the tester-high's report

*Filed byte for byte by the custodian from the subagent transcript, the SubagentHandback input of 2026-11-18T09:58:36.652Z (dispatched in the background; the run 2026-11-18T09:24:05.638Z to 09:58:36.652Z by its transcript, Bash 65, Read 11, Write 4, SubagentHandback 1, model claude-opus-5-5): 19074 bytes, sha256 78c7d3a112116f2a8a48de97014a195606a26c4fb00b6a4b133c6a090c17b5f8, with one final newline added. Its user-folder paths are masked as the report wrote them. ADV-2026-11-18-05 rules on it. It is evidence, not Authority.*

---

Diagnosis: b1-shell-half PR B, selection's E-EXPORT, tester-high, port-5400 harness
Result: The failure is not caused by PR B's diff. At the merge base A (619a7cc9, without PR B's frontend diff) selection failed four export steps with `unknown-attempt` (14 PASS, 4 FAIL). At N it failed E-EXPORT alone (17 PASS, 1 FAIL). H1 passed on 2026-11-16 and failed on 2026-11-18 at the same commit and on the same exe. Every failed execute was sent 0 ms after its prepare and wrote no audit row. That matches one frontend condition (the attempt-id ref read before its effect has run) better than any host condition, but these runs cannot tell the frontend path from the host's `take` miss.

**Model.** The harness reports me as Opus 5.5 (claude-opus-5-5). I made no override and had no context handoff. No usage figures are at hand.

**Four failure classes, for this harness**
1. Interface: the real debug exe is driven over CDP through WebView2. The export goes through the dev seams `publishPrepareWithDestination` and `publishExecute`, which the suite names itself.
2. Claim to a record: every claim points to `<H>/out/m4b-e2e-<tag>.log` and to the copies `<S>/s327x-<tag>.{log,app.err.log,session.log,audit.jsonl}`.
3. Operator-facing lines: every quoted line is from the named run at its named commit.
4. Assertion reached: in both my runs every step reached an assertion. E-EXPORT failed at its execute-outcome check (`pairRead`).

**Start state** (2026-11-18T09:25:04Z)
- HEAD d1d3a29f28e6ac813a269bdd2e44d0e2f03687a7 on `cut/b1-shell-half-pr-b`, porcelain 0 bytes.
- `df -h`: `C:              476G  427G   49G  90% /c` and `D:              466G  100G  367G  22% /d`.
- Harness check (`sha256sum -c`), rc 0: `m4b-e2e-app-down.ps1: OK`, `m4b-e2e-app-up-wait.ps1: OK`, `m4b-e2e-app-up.ps1: OK`, `m4b-e2e-build-exe.sh: OK`, `m4b-e2e-busy.ps1: OK`, `m4b-e2e-run-suite.sh: OK`, `m4b-e2e-tauri.conf.json: OK`, `shim-wait/npx.cmd: OK`, `shim/npx.cmd: OK`, `m4b-e2e-load.sh: OK`.
- I read `m4b-e2e-run-suite.sh` whole, and also app-up, app-up-wait, app-down, busy, load, the tauri conf and both shims.
- Exe: `91555840 2026-11-16 03:00:15.424284100 +0100 D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe`, sha256 `01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b`.
- Diff check A..N over the brief's paths: rc 0, printed nothing.
  - The pathspec `frontends/shell/e2e/lib` names nothing in the tree; the helpers are the files `e2e/lib.mjs` and `e2e/exportElapsed.mjs`.
  - I diffed those two separately, with `src/publish`, `src/e2e-test-surface.ts`, `src/bootstrap.tsx`, `vite.config.ts` and `package.json`. Only `package.json` differs, by one added line `"e2e:colour": "node e2e/colour.mjs",`.
  - The frontend is not in the exe: vite serves `frontends/shell/src` from the worktree. A..N changes 52 files there, including `App.tsx` (75 lines), but nothing under `src/publish`.
- Fixtures: 34 files in `<S>/s327x-fix-before.txt`. It is byte-identical to `<S>/s327d-fix-after.txt` (cmp rc 0).

**Step 1: the state that outlives a run** (`<S>/s327x-state-before.txt` at 09:33:07Z, `-after.txt` at 09:56:27Z)

| path | before: files / bytes / newest | after |
|---|---|---|
| `C:/dev/wt/m4b/target/e2e-selection-out` | 973 / 704305984 / 2026-11-18T08:48:20Z | 1193 / 870426801 / 09:53:08Z |
| `C:/dev/wt/m4b/frontends/shell/e2e/out` | 121 / 191967972 / 08:58:46Z | 121 / 191967972 / 09:47:38Z |
| `<u>/AppData/Local/spatial-ide/audit` (default `publish.jsonl`) | 1 / 558154 / 2026-10-26T17:16:27Z | unchanged |
| `<u>/AppData/Local/spatial-ide/sessions` | 656 / 1328602 / 08:43:12Z | 664 / 1339910 / 09:47:00Z |
| `<u>/AppData/Local/spatial-ide/tiers` | 4 / 2111394 / 2026-11-15T07:06:45Z | unchanged |
| `<u>/AppData/Local/spatial-ide/projects` | absent | absent |
| `<u>/AppData/Local/dev.spatialide.shell/logs` | 1502 / 187993607 / 08:58:44Z | 1504 / 188169810 / 09:55:43Z |
| `<u>/AppData/Local/dev.spatialide.shell/EBWebView` | 1638 / 458043474 / 08:58:41Z | 1639 / 459317934 / 09:55:42Z |
| `<u>/AppData/Roaming/dev.spatialide.shell`, temp `spatial-ide-shell-logs` | absent | absent |

- Bundle folder top level, before: 45 entries (24 ask, 5 ask-two, 4 export-selected-0, 6 export-selected-1, 6 scope). After: 58 (31, 7, 4, 8, 8).
- Staging debris (`.staging-`): 0 before and 0 after.
- Parents without `bundle/manifest.json`: 17 before, 25 after. The added 8 are:
  - `ask-1794994766139`, `ask-1794994783639`, `ask-two-1794994917392`, `export-selected-1-1794994759638`, `scope-1794994762282` (Run A);
  - `ask-1794995367027`, `export-selected-1-1794995216745`, `scope-1794995219514` (Run N).
- The earlier failed attempts' parents are empty, 0 entries each: `export-selected-1-1794810770772`, `export-selected-0-1794811532980`, `export-selected-1-1794991390005`, `ask-1794811749090`, `ask-1794991560564`.
- Each run's audit log is a fresh file through `SPATIAL_IDE_AUDIT_LOG`. The earlier runs had one each too: `s327t-hs-…`, `s327c-hc-…` and `s327d-…audit.jsonl` exist.
- The attempt store and the grants persist nothing across launches: `PendingAttempts` and `GrantSet` are in-memory Tauri state (publish.rs:210-217, "dies with the process").
- The shell uses no localStorage, sessionStorage or IndexedDB (grep of `src`).
- Extra, launch path rather than export path: `frontends/shell/node_modules` was installed 2026-11-16 06:30:15 +0100 (05:30Z, the s327c `npm ci`). `node_modules/.vite/deps` dates from 06:50:34 +0100 (05:50Z), 38 files, `_metadata.json` `"hash": "a7f926db"`, `"browserHash": "f45f6232"`.

**Runs** (UTC; start and end from each log's first line and its `rc=` line)

| run | commit | start | end | rc | E-EXPORT | E-ASK-STATEMENT |
|---|---|---|---|---|---|---|
| hs-selection | 6f7e744c (H1) | 2026-11-16 00:20:44 | 00:30:02 | 0 | PASS | PASS |
| hc-selection | 6f95993e | 2026-11-16 06:30:27 | 06:40:14 | 1 | FAIL | PASS |
| hc-selection-2 | 6f95993e | 2026-11-16 06:43:04 | 06:50:25 | 1 | FAIL | PASS (E-ASK-TWO FAIL) |
| hc-selection-at-6f7e744c | 6f7e744c (H1) | 2026-11-18 08:40:21 | 08:51:05 | 1 | FAIL | FAIL |
| **sx-selection-at-619a7cc9** | 619a7cc9 (A) | 2026-11-18 09:36:13 | 09:43:00 | 1 | FAIL | FAIL (E-ASK and E-ASK-TWO FAIL too) |
| **sx-selection-at-n** | d1d3a29f (N) | 2026-11-18 09:44:20 | 09:55:43 | 1 | FAIL | PASS |

Two older runs passed 18/18: bs-selection at c85788f1 (2026-11-12) and mp-selection at 6649a443 (2026-11-13).

**E-EXPORT and E-ASK-STATEMENT lines, byte-copied**
- hs: `[E-EXPORT] PASS (14331ms): row scope "row scope: the whole file — every row the dataset contains" and 2000 rows with a selection and without; prepare-to-execute 0ms 0ms`
- hs: `[E-ASK-STATEMENT] PASS (87705ms): the statement named C:\dev\wt\m4b\target\e2e-selection-out\ask-1794788687224\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 0ms`
- hc: `[E-EXPORT] FAIL (11585ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 73ms, T 600000ms); prepare-to-execute 0ms`
- hc: `[E-ASK-STATEMENT] PASS (93327ms): the statement named C:\dev\wt\m4b\target\e2e-selection-out\ask-1794810878204\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 0ms`
- hc-2: `[E-EXPORT] FAIL (13140ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 22ms, T 600000ms); prepare-to-execute 0ms 0ms`
- hc-2: `[E-ASK-STATEMENT] PASS (102363ms): the statement named C:\dev\wt\m4b\target\e2e-selection-out\ask-1794811646570\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 0ms`
- hc-2: `[E-ASK-TWO] FAIL (15673ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 12613ms, T 600000ms); prepare-to-execute 0ms`
- at-6f7e744c: `[E-EXPORT] FAIL (12064ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 229ms, T 600000ms); prepare-to-execute 0ms`
- at-6f7e744c: `[E-ASK-STATEMENT] FAIL (16561ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 13418ms, T 600000ms); prepare-to-execute 0ms`
- A: `[E-EXPORT] FAIL (12281ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 86ms, T 600000ms); prepare-to-execute 0ms`
- A: `[E-ASK] FAIL (17606ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 14160ms, T 600000ms); prepare-to-execute 0ms`
- A: `[E-ASK-STATEMENT] FAIL (16778ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 13444ms, T 600000ms); prepare-to-execute 0ms`
- A: `[E-ASK-TWO] FAIL (120326ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 21ms, T 600000ms); prepare-to-execute 0ms 0ms`
- A tally: `[selection] 14 PASS, 4 FAIL: …` (cut)
- N: `[E-EXPORT] FAIL (13502ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 108ms, T 600000ms); prepare-to-execute 0ms`
- N: `[E-ASK-STATEMENT] PASS (109181ms): the statement named C:\dev\wt\m4b\target\e2e-selection-out\ask-1794995373497\bundle, whose manifest.json exists; filter-zoned was admitted; prepare-to-execute 0ms`
- N tally: `[selection] 17 PASS, 1 FAIL: …` (cut)
- E-SCOPE passed in every run: its execute came 263 to 325 ms after its prepare (`prepare-to-execute 263ms` / `277ms` / `289ms` / `325ms`).

**Steps before E-EXPORT** (ms: E-SCENE, CLICK, CLICK-FAST, SELECT, NODRAG, ZOOMSEL, SEL-PAN, SEL-FILTER, REFUSED, GEN, KINDS; all PASS in every run)
- hs: 14910, 514, 885, 636, 1347, 1998, 1122, 21027, 9596, 14299, 57797
- hc: 15577, 510, 871, 615, 1338, 2003, 1139, 21796, 9259, 14365, 57414
- hc-2: 15852, 511, 870, 659, 1339, 2015, 1147, 22122, 9426, 14720, 59033
- at-6f7e744c: 17798, 1979, 2368, 712, 1361, 2117, 1116, 23768, 9527, 15109, 70535
- A: 22627, 593, 913, 867, 1477, 2248, 1213, 26577, 10725, 16209, 80063
- N: 17251, 557, 871, 700, 1369, 2125, 1124, 22832, 9401, 14907, 64567

**Audit intent and outcome rows** (phase | outcome | at | attempt | source | destination)
- hs, 7 pairs:
  - `filter-zoned export-selected-1-1794788586362` success 00:23:07Z
  - `filter-zoned export-selected-0-1794788587898` success 00:23:09Z
  - 100k: ask-1794788594640 success; ask-1794788681360 cancelled; ask-1794788687224 success; ask-1794788775046 success; ask-two-1794788859698 success
- hc, 5 pairs, all 100k: ask-1794810776273 success, ask-1794810872185 cancelled, ask-1794810878204 success, ask-1794810971708 success, ask-two-1794811064066 success. No filter-zoned row.
- hc-2, 4 pairs:
  - `filter-zoned export-selected-1-1794811531424` success 06:45:32Z (its second execute failed)
  - 100k: ask-1794811538686 success, ask-1794811640310 cancelled, ask-1794811646570 success
- at-6f7e744c, 4 pairs, all 100k: ask-1794991395914 success, ask-1794991553184 cancelled, ask-1794991577329 success, ask-two-1794991694646 success.
- A, 1 pair: `intent | | 2026-11-18T09:40:04Z | 1418c8be | 100k-happy-p | ask-1794994800450/bundle`, then `outcome | success | 2026-11-18T09:41:57Z`.
- N, 5 pairs, all 100k: ask-1794995223829 success, ask-1794995367027 cancelled, ask-1794995373497 success, ask-1794995482825 success, ask-two-1794995583186 success. No filter-zoned row.
- In every run, each failed execute has no intent row, and its destination parent is empty.
- No `app.err.log` copy has a publish line. Each is 257 bytes: the session-log line, `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180` and `the advisory source watcher signalled observed-change`. The session logs carry no publish, binding or attempt line in any run (grep count 0).

**Where `unknown-attempt` is answered, with every condition**
1. Frontend, `frontends/shell/src/publish/PublishPanel.tsx:546-550`. `runExecute` returns `{ status: "unknown-attempt" }` without calling the host when `attemptIdRef.current === null`.
   - The ref is written only in a passive effect, `useEffect(() => { attemptIdRef.current = state.kind === "dialog" ? state.attemptId : null; }, [state])` (533-536).
   - `runPrepareWithDestination` (455-481) calls `setState(nextStateFromPrepareOutcome(outcome))` (479), then `return outcome` (480). So the prepare's promise resolves before React has rendered, committed and run that effect.
   - The prepare run's `ended` also makes App dispatch `consumer.released` (App.tsx:1211-1229, the dispatch at 1227), so the update re-renders the whole App.
   - The hook is registered at PublishPanel.tsx:578. React 18 `createRoot` in `StrictMode` (src/bootstrap.tsx:25-26).
2. Host, `src-tauri/src/commands.rs:468-508`: `run_exclusive` (489) returns `None` and the command answers `None => Ok(ExecuteOutcome::UnknownAttempt)` (506). That happens only when the same attempt id is already registered as running (`publish.rs:1242`, `if !running.try_insert`).
3. Host, `src-tauri/src/publish.rs:787-788`: `store.take(attempt_id)` misses (`PendingAttempts::take`, 235-242):
   - (a) the id is absent: never inserted (inserted at 717 before `Prompt` returns), already taken (single-use), or swept by `insert`'s `retain` of entries older than the TTL (229);
   - (b) the id is older than `PENDING_ATTEMPT_TTL` (600 s, line 69), at 238-240;
   - (c) the store is a different process's: it dies with the process (215-217).
- The suite side: `selection.mjs` `prepareExport` and `executeExport` (557-565); `stepExport` (568-592) executes at 583 with no call between the prepare's outcome and the execute; `startExportThenOpen` (617-630) sends at 621-626 with no call in between and checks with `pairRead` at 628 when the run has ended; `stepAskStatement` (671-684). The verdict is in `exportElapsed.mjs` (25-30, 40-54): FAIL when U ≤ T.
- `publish.mjs` (371) and `colour.mjs` (229, 261) wait for the hook or the dialog's DOM between prepare and execute; `selection.mjs` does not.

**Do the runs fit each condition?**
- 3(b) TTL: no. Every failure has U ≤ 14160 ms, against T 600000 ms.
- 3(a) sweep: no. Only entries past the TTL are swept.
- 3(c) another process: no. The app was launched once per run (app-down runs only after the suite) and the store persists nothing (step 1).
- 2 already running: no fit shown. Each prepare mints a fresh id, and no other execute was in flight for that id.
- 3(a) already taken: possible only if the ref still held an id already executed. The effect sets it to null on every non-dialog state, and nothing in the runs shows that.
- 1 ref null: fits every failure.
  - Every failed execute was sent 0 ms after its prepare's outcome (L 0ms). E-EXPORT's U is 22 to 229 ms, that is prepare plus an immediate answer.
  - No audit intent and no destination content.
  - E-SCOPE, which waits 263 to 325 ms and passes through the same `runExecute` null check, never failed.
  - Passing executes also had L 0ms, so the outcome varies run to run, which fits a timing race.
- Neither path writes a log line, so these runs do not tell condition 1 from 3(a).
- Hypothesis only: the execute's CDP evaluate runs before React's passive effect has set the ref.
  - Reads that would settle it: whether the action console records a `binding_publish_execute` row (client.ts:62, `recordNamed`) for a failed execute. Absent means the frontend short-circuit, present means the host's `take` miss.
  - Or: the ref or the panel state read over CDP at the execute's moment.
  - Neither is available in these runs.
- PR B's diff against the machine's state:
  - These runs separate PR B's diff from the failure: A, without the diff, fails (worse than N), and H1 both passed and failed.
  - They do not separate timing from persistent state. The load at launch does not track the outcome: mp passed at `54,93,66`, N failed at `34,31,23`. The per-step durations at A (KINDS 80063 ms) look like the 2026-11-13 mp pass (80504 ms).
  - The one persistent difference that lines up in time: every pass predates, and every failure follows, the `node_modules` reinstall at 2026-11-16 05:30Z and the `.vite/deps` cache at 05:50Z. This is a correlation of mtimes only, and the 2026-11-15 22:36Z `npm ci` before the H1 pass shows a reinstall alone is not new.

**Holds** (`MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …`, then `MACHINE_RELEASED project=<m> …`; no MACHINE_WAITING or MACHINE_ERROR line, no 95-99 exit)
- h1 (A): asked 2026-11-18T09:35:50Z, granted 09:36:02Z (load line `load sx-selection-at-619a7cc9 09:36:02Z 64,55,77`), ended 09:43:00Z.
- h2 (N): asked 09:44:00Z, granted 09:44:10Z (`load sx-selection-at-n 09:44:10Z 34,31,23`), ended 09:55:43Z.

**Checkouts**
- Before A, porcelain 0 bytes. `checkout --detach 619a7cc9…`: rc 0, `HEAD is now at 619a7cc9 Merge pull request #328 from christopherdonini/cut/known-limitations-item-56-tile-refusal-record`. HEAD 619a7cc94c6ac89768ca6d68d40ea9afff0c2a7b, porcelain 0.
- The return came right after Run A, before any copy: porcelain 0, `checkout cut/b1-shell-half-pr-b` rc 0 (`Switched to branch 'cut/b1-shell-half-pr-b'`), HEAD d1d3a29f28e6ac813a269bdd2e44d0e2f03687a7, porcelain 0.

**Fixtures:** 34 files before and after. `cmp <S>/s327x-fix-before.txt <S>/s327x-fix-after.txt`: rc 0.

**Processes at the end**
- Run-suite's app-down killed the app trees it started, by PID: `killed tree 21328`, `killed tree 62796` (A) and `killed tree 66064`, `killed tree 4420` (N); ports 9223 and 5400 free each time. `m4b-e2e-app-pids.txt` is absent.
- Every background task of mine has completed and notified (both holds and two wait loops), so I killed nothing.
- Busy check `<S>/s327x-final.busy.txt`: `FREE`, rc 0.
- Final HEAD is N on the branch, porcelain 0 bytes.

**Things I did that the brief does not name**
- I read `.claude/agents/tester.md` in the same call as the brief, as the system instruction requires.
- The harness moved two foreground wait loops to the background after 180 s. The second ended `not yet after 580s`, so I ran a third, which ended `found after 40s`.
- Extra read-only checks:
  - the bs and mp selection logs;
  - `out/m4b-e2e-loads.txt`;
  - the prior runs' audit logs, summarised by my script;
  - the contents of the failed destination folders;
  - `node_modules` and `.vite` mtimes and metadata;
  - the frontend diffs H1..N (11 files under `src`, none in `src/publish`) and A..N (helpers);
  - the code of `client.ts`, `PublishPanel.tsx`, `commands.rs`, `publish.rs`, `App.tsx` and `kernel/src/permission/audit/log.rs`.
- Scripts I wrote with the Write tool: `<S>/s327x-fix.sh`, `<S>/s327x-state.sh`, `<S>/s327x-await.sh` (5 s per turn, 580 s limit), `<S>/s327x-audit-rows.mjs`.
- Other files are `<S>/s327x-*` records: start state, checkouts, diffs, state before and after, fixture lists, and the run copies `s327x-sx-selection-at-619a7cc9.*` and `s327x-sx-selection-at-n.*`.
- Each run's log, `app.err.log` copy and session log (`session-1794994580.log`, 79853 bytes; `session-1794995065.log`, 96350 bytes) were copied right after the run. For Run A that was right after the return checkout, which the brief puts first.
