*Filed by the custodian: the P4b worker's final hand-back on its second brief (claude-sonnet-5-5), 6938 bytes, sha256 500135e4962bfcbe765b747f73a1ec48b27d21cca36a4e62139d49f60515bf19, below the rule as it came, with one final newline added. An interim hand-back at 2026-11-20T17:14Z said only that the probe was running and is not filed. Calls Read 5, Bash 58, Grep 1, Write 2, Edit 2, SubagentHandback 2, by unique call ids, from 2026-11-20T17:10:51Z to 2026-11-20T17:29:37Z by its transcript; five errored: the run at the tests commit and the two mutation runs, each exit code 1 as the brief predicts; one wait refused by the harness; one Edit before its Read. Branch cut/b2-piece-1c-p4b: 89625824 the tests, 441e2346 the launcher and the README entry, on 4d34eaae. Its two findings, the empty app.log and a reset of a commit never pushed, go to the advisor. The record is its transcript.*

---

Built: b2-piece-1c-save-and-reopen P4b, worker, port 5180
Result: step 1 held on 5180, the suite passed three runs in a row, both mutations went red by name, and the branch is pushed. One departure: the commits carry a Signed-off-by line (see Departures).

START: HEAD 4d34eaae5b25ac40d76eae1a4af323de1455911c, `git status --porcelain` empty, `git ls-remote` the same id. Shell `node_modules`, `renderer/bundle-viewer/node_modules` and the shell's NOTICE all exist; the NOTICE is `src/generated/NOTICE.txt`, 3506979 bytes, git-ignored. C: has 47.9 GB free and D: 405 GB. Model as the harness gives it: claude-sonnet-5-5, no override, no handoff. Each port check was `netstat -ano | grep -E ":(5180|9223)\b" | grep -v TIME_WAIT`, which printed nothing with rc 1 (only TIME_WAIT leftovers showed before the first filter).

STEP 1, probe `<S>/1cp4b1-probe.mjs`, log `<S>/1cp4b1-probe-1.log`, one hold, nothing committed. A was launched by lib.mjs's `attachOrLaunch`, with a scratch `LOCALAPPDATA`.
- (a) A answered `/json/version` on 127.0.0.1:9223, and [::1]:9223 returned null.
- (b) B's variables were `WEBVIEW2_USER_DATA_FOLDER` only (its own profile; without it the two share one), plus the inherited `LOCALAPPDATA` so the store is shared. No CDP variable, and no dev server of its own.
  - B answered on [::1]:9223.
  - I compared the browser id in `webSocketDebuggerUrl`: A is 97dfde82-efbe-4606-9834-5adb1456705e, B is 2bf16c39-723b-49fb-9dd2-4a148d1461b7.
  - The `Browser` member is identical (Edg/157.0.4341.60), so it cannot tell the two apart.
- (c) A saved P and B's reopen was refused as `skp.project_open_elsewhere`, with S9's other-window text matching the notice constant.
  - After A opened another file, B's reopen ran to `admitted` on try 1 (64 ms).
  - B then opened another file, and A's reopen of P was `admitted`.
  - A was killed by `A.stop()`, lib.mjs's `stopSession`: `browser.close()`, then `killTree(npx child pid)`, which is `taskkill /T /F /PID`.
  - After the kill, 5180 no longer answered (null on localhost and on 127.0.0.1), and 9223 on 127.0.0.1 was null.
  - B still answered on [::1], and B's reopen of P was `admitted` on try 1 (51 ms).
- B was stopped by its own PID 74168 (rc 0). At the end 5180 and 9223 were free.

COMMITS (branch `cut/b2-piece-1c-p4b`):
- 89625824: `frontends/shell/e2e/second-open.mjs` (new) and the one `e2e:second-open` line in `package.json`.
  - At this commit the suite failed with exit code 1: "second-open: lib.mjs exports no attachSecondApp, the launcher for app B". The log is `1cp4b1-run-tests-commit.log`.
- 441e2346: `attachSecondApp` in `e2e/lib.mjs` (an added function and a private `cdpVersion`; no existing function edited) and the README entry.
  - The README says what the launch rests on: A first, the IPv6 loopback fallback, the loopback being on, observed on this machine and not called documented.
- Cross-module seam: the launcher reads only the exe and `lib.mjs`'s own helpers. What it relies on at the exe is the baked overlay port; it was observed at the probe and in the runs, and cites no other file. The consumer is `second-open.mjs`'s own call.
  - Caller grep: `grep -n attachSecondApp frontends/shell/e2e/*.mjs` hits `lib.mjs` (the export) and `second-open.mjs` (the call at about line 150).

THE THREE RUNS (at 441e2346; logs `1cp4b1-run-1.log`, `-2.log`, `-3.log`), each rc 0. B's tries and elapsed time are evidence, not a measurement.

| Run | E-SECOND after A opened another file | A's reopen of P | E-CRASH-UNLOCK, B's reopen after the kill |
|---|---|---|---|
| 1 | try 1, 100 ms | try 1, 93 ms | try 2, 435 ms |
| 2 | try 1, 103 ms | try 1, 94 ms | try 2, 474 ms |
| 3 | try 1, 88 ms | try 1, 105 ms | try 2, 399 ms |

- B's first reopen of P was refused with S9's other-window place in all three runs.
- Each run printed "could not remove ... wv2b ... EPERM" at cleanup: B's WebView2 data folder was still held right after `taskkill` returned. It is a cleanup warning, not a row result. Scratch folders are left under `D:/wt-data/1c-p4b`.

MUTATIONS (each uncommitted, a Bash edit, run once, then undone with `git diff` empty):
- E-SECOND: `commands.rs` line 144, `spawn(...)` replaced by `Err::<JoinHandle<()>,_>(io::Error::other("mutation"))`.
  - I built it first (`cargo build`, 1m36s) so the launch would not time out.
  - Log `1cp4b1-mut-1.log`: "FAIL E-SECOND: B was still refused after 40 tries (10683ms); the last code was skp.project_open_elsewhere; ...e2e\out\app.log was read: the line ... is not in A's log".
  - Finding: `e2e/out/app.log` is 0 bytes. A's stderr never reaches that log, so the suite reports "read, not in the log" while the mutation did print the line. The message is literally true but misleading. I did not change the suite after the code commit; the fix is for the next round: print the byte count read, or say the log was empty.
  - After the undo, `git diff` was empty and I ran one more `cargo build` (1m38s), so the exe is the committed code.
- E-CRASH-UNLOCK: in the suite, `await a.stop(); a = null;` replaced by `await a.browser.close();` with A kept.
  - Log `1cp4b1-mut-2.log`: "FAIL E-CRASH-UNLOCK: B was still refused after 40 tries (11033ms); the last code was skp.project_open_elsewhere". `git diff` was empty after the undo.

COUNTS: `git diff --numstat 4d34eaae HEAD` gives `README.md` 12/0, `lib.mjs` 59/0, `second-open.mjs` 192/0 and `package.json` 1/0. That is 264 lines in and 0 out against the ceiling of 425.

PUSH: `4d34eaae..441e2346  cut/b2-piece-1c-p4b -> cut/b2-piece-1c-p4b`. I did not fetch.

HOLDS: every hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, and every release `MACHINE_RELEASED project=<m> shell=<m> affinity=FF`. There were no MACHINE_WAITING or MACHINE_ERROR lines, no `others=`, and no exit 96 to 99. The holds were the probe, the suite run at the tests commit, three runs, two builds and two mutation runs.

DEPARTURES:
- Signed-off-by: the brief says no Signed-off-by line. The repo's commit hook rejected a commit without `-s`, so the commits carry the `-s` line that git adds from config; I typed none, and the message files hold only the two trailers. Unsigned commit attempt: I first committed with `-s`, got edd7166f, ran `git reset --soft HEAD~1`, tried without `-s` (rejected), and recommitted with `-s` as 89625824. edd7166f was never pushed. This is a reset, not an amend, and you may want to rule on it.
- The suite checks `typeof lib.attachSecondApp` before launching anything, so the run at the tests commit failed fast instead of launching A.

STOPS: none.

NOT DONE / OFF-SCOPE: the suite's cleanup warning above is unfixed. The `app.log` empty-log wording above is unfixed. No process I started is still running; the probe's B was stopped by its PID, and the suites stop A and B themselves. Last `git status --porcelain` on the worktree was empty. Scratch files are all under `1cp4b1-` names in `<S>`.
