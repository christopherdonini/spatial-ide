Series: open-first-look-fills-fit-view S9 re-runs at e1fd84957b7ae042a075e7ccc5628a3de5670eb7, tester (the custodian's filing note, 2026-11-19: the Sonnet tester, model claude-sonnet-5-5, its run 2026-11-19T02:34:55Z to 02:47:43Z by its transcript, Bash 16, none errored; 7132 bytes, sha256 446d944008e8d77f79f477538a8419c3a6639928292902ee941277a1ad96ea2e; below byte for byte, with this note and one final newline)

Result: `console-2` passed. `command-bar-2` failed again at E-AND, with the same line. `project-2` failed again at STYLE, with the same line. Each is a failing suite once, and I made no further re-run.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff.

Paths: `<S>` is the session scratchpad and `<H>` is `<S>/fl-e2e-h`. `<u>` is the app's per-user folder. `<m>` marks a masked value. Times are UTC, from the logs and from `<S>/fl9-h<n>.asked`, `.granted` and `.ended`.

Pre-checks, before the first re-run:
- `sha256sum -c <S>/fl-harness.sha256` printed ten OK, rc 0.
- HEAD in `C:/dev/wt/fl` was e1fd84957b7ae042a075e7ccc5628a3de5670eb7 and the porcelain was empty.
- The debug exe sha256 was 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5, as in the brief.

Each re-run had a `fl-e2e-busy.ps1` check in a call of its own right before its hold. All three printed FREE. Each run's busy-at-launch was FREE too. Tags `s9-console-2`, `s9-command-bar-2` and `s9-project-2` were new, so exit 94 did not fire. Each run used the same command shape, env and harvest as its first run.

## 1. `s9-console-2` (hold 26)
- Start 02:35:41Z, end 02:42:10Z, rc **0**, 11 PASS and 0 FAIL.
- Load line: `load s9-console-2 02:35:32Z 12,4,12`
- FAIL lines: none.
- The step that failed in the first run, REGRESS', in this run (cut at 700):
  - `[REGRESS'] PASS (368008ms): npm run e2e:regression exited 0 (326741ms); npm run e2e:admission exited 0 (41266ms); both attached to THIS run's own already-launched app (same fresh session)`
  - So the nested `regression`, K7 included, exited 0 here. In the first run REGRESS' exited 1.
- The other 10 steps PASS: HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL', CLASSB', CLASSC', GROUP', COPYTRUNC', UNCLASS'.
- Last two lines: `Full render-trace ledger: C:\dev\wt\fl\frontends\shell\e2e\out\console-render-trace-1795056130199.json`, `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`, then `rc=0 end 2026-11-19T02:42:10Z`.
- Hold: asked 2026-11-19T02:35:30Z, granted 2026-11-19T02:35:32Z, ended 2026-11-19T02:42:17Z. Lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:22576 also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:22576 affinity=FF (cores 0-7)`. No MACHINE_WAITING line, and the hold exit was 0.
- App-down: `killed tree 2960`, `killed tree 59120`, `port 9223 free`, `port 5400 free`.
- Session-log copy: `<S>/fl9-s9-console-2.session.log` (911270 bytes), copied from `<u>/dev.spatialide.shell/logs/session-1795055746.log`.

## 2. `s9-command-bar-2` (hold 27)
- Start 02:42:54Z, end 02:45:26Z, rc **1**, 13 PASS and 1 FAIL.
- Load line: `load s9-command-bar-2 02:42:42Z 7,17,12`
- FAIL line (byte-copied, not cut):
  - `[E-AND] FAIL (47916ms): E-AND: after card B was added the console holds 1 record_step rows against 1 + 1, the last carrying the combined text: true`
- The step that failed in the first run is the same step, E-AND. First run: `[E-AND] FAIL (49669ms): E-AND: after card B was added the console holds 1 record_step rows against 1 + 1, the last carrying the combined text: true`. The text is identical; only the duration differs (47916 ms against 49669 ms).
- The other 13 steps PASS (OPEN, E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS, E-REVEAL, E-SLASH, E-FIELD, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL), and FIXTURES PASS.
- Last two lines: the FIXTURES line (hashes unchanged, 92ed800c... -> 92ed800c...) and `This run launched the app; it stays RUNNING on CDP port 9223.`, then `rc=1 end 2026-11-19T02:45:26Z`.
- Hold: asked 2026-11-19T02:42:40Z, granted 2026-11-19T02:42:42Z, ended 2026-11-19T02:45:33Z. Lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:21680 also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:21680 affinity=FF (cores 0-7)`. No MACHINE_WAITING line, and the hold exit was 1 (the suite's rc).
- App-down: `killed tree 52016`, `killed tree 59844`, `port 9223 free`, `port 5400 free`.
- Session-log copy: `<S>/fl9-s9-command-bar-2.session.log` (179014 bytes), copied from `<u>/dev.spatialide.shell/logs/session-1795056179.log`.
- The run's load was low (7,17,12). On the custodian's ruling this run was the I4 re-run. It did not pass, so the first run's E-AND failure is not excused by it, and neither run counts as a pass.

## 3. `s9-project-2` (hold 28), the custodian's diagnostic re-run
- Start 02:46:13Z, end 02:47:02Z, rc **1**, 2 PASS and 1 FAIL.
- Load line: `load s9-project-2 02:46:01Z 13,4,10`
- FAIL line (byte-copied, not cut):
  - `[STYLE] FAIL (30230ms): STYLE: waited 30000ms for at least 5 record_step rows, all ok (after the opacity); the last reading was ["ok","ok"]`
- The step that failed in the first run is the same step, STYLE. First run: `[STYLE] FAIL (30273ms): STYLE: waited 30000ms for at least 5 record_step rows, all ok (after the opacity); the last reading was ["ok","ok"]`. The text is identical.
- OPEN PASS (5165 ms) and CLAUSES PASS (7688 ms); CLAUSES again reads `4 record_step rows reached ok`.
- Last line: `Full console ledger: C:\dev\wt\fl\frontends\shell\e2e\out\project-console-ledger-1795056422377.json`, then `rc=1 end 2026-11-19T02:47:02Z`.
- Hold: asked 2026-11-19T02:45:58Z, granted 2026-11-19T02:46:00Z, ended 2026-11-19T02:47:07Z. Lines: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:52284 also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:52284 affinity=FF (cores 0-7)`. No MACHINE_WAITING line, and the hold exit was 1 (the suite's rc).
- App-down: `killed tree 80208`, `killed tree 49568`, `port 9223 free`, `port 5400 free`.
- Session-log copy: `<S>/fl9-s9-project-2.session.log` (32599 bytes), copied from `<u>/dev.spatialide.shell/logs/session-1795056377.log`.

## Summary of the two series together
| Suite | First run | Re-run |
|---|---|---|
| console | rc 1 (REGRESS' via nested K7) | rc 0, 11/0 |
| command-bar | rc 1 (E-AND) | rc 1 (E-AND, same text) |
| project | rc 1 (STYLE) | rc 1 (STYLE, same text) |

Files: `<S>/fl9-harvest-console-2.txt`, `<S>/fl9-harvest-command-bar-2.txt`, `<S>/fl9-harvest-project-2.txt`, and `<H>/out/fl-e2e-s9-<tag>.*` for each tag.

## End state
- Processes: none of mine is running. The three hold tasks completed, and each run's app was stopped by run-suite's app-down (ports 9223 and 5400 free).
- Final busy check, in a call of its own, after `s9-project-2`: `FREE`, rc 0.
- HEAD in `C:/dev/wt/fl` is e1fd84957b7ae042a075e7ccc5628a3de5670eb7 and its porcelain is empty.

## Things I did that this message does not name
- I wrote the same extra stamp files as in the first series (`<S>/fl9-h26` to `fl9-h28` `.asked`, `.granted`, `.ended`, `.rc`) and `<S>/fl9-s9-<tag>.runout`.
- The post-run harvest ran in a separate call from the busy checks, as before.
- I read no source file and ran no other run.
