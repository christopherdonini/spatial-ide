*Filed by the custodian: the report of the one more start that ADV-2026-11-21-25 allows, made in the main checkout at d4681ab55a537bf4b4e54cd7496b3fea38fa945f by the script's second command alone, with the drive script's two defects fixed, the hand-back of the tester (claude-sonnet-5-5), 4739 bytes, sha256 42b7ddd059f66ea72a1cf13a76ee022875b7f702e4c540aba0c75dc313d704bc, below the rule, masked by the custodian: the scratch folder path 1 times, the hold lines also value 1 times; nothing else changed. Its result line: RESULT FAIL watcher. Its calls in the transcript, by unique call ids: Read 2, Bash 8, Edit 4, SubagentHandback 1; errored: 2, from 2026-11-21T16:50:31Z to 2026-11-21T16:55:08Z.*

---

Checked: operator-sitting-queue, ADV-2026-11-21-25, the second start, tester

Model: Sonnet 5.5, no override, no handoff. RESULT FAIL watcher (probably a harness defect, see below). Button not invoked; open of filter-zoned.parquet NOT measured. One run only, no second start. Comes to the custodian before the item 8 message (item 5).

Four failure classes: interface = product's own second command (npm --prefix frontends/shell run tauri dev) + UIA window lookup; no results table claimed; every figure is from this run at d4681ab5; the file-open assertion was NOT reached (watch step failed first).

HEAD d4681ab55a537bf4b4e54cd7496b3fea38fa945f (matches). Fixture 409872 bytes. Before: no spatial-ide-shell.exe, no listener on 5180; porcelain 7 untracked lines (6 under .codex-remote-attachments/, PROMPT-AUDIT-2026-10-04.md).

Mask test (whole):
scratch path line: <S>\sit9-app.log
profile path line: <u>\x
plain line: nothing to mask

Hold lines:
MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:47296 also=<m> (...)
MACHINE_RELEASED project=<m> shell=bash.exe:47296 affinity=FF (cores 0-7)
drive-rc=0
No WAITING/ERROR lines.

Drive script changes vs sit8 (git diff --no-index read): param([switch]$MaskTest); Mask param renamed $txt, -MaskTest prints 3 samples and exits; deadline 40 min, window bound 20 min; AppLines/CountApp helpers; at window logs time since start and Rebuilding count; 3-min watch (5 s poll: window pid, Rebuilding count, Running `target count; any change = FAIL watcher with new app-log lines, skips c/d/e); step d: ComboBox -> first Edit descendant, ValuePattern set + read-back logged, else foreground check vs dialog NativeWindowHandle then SendKeys only if foreground; session-log copy (newest session-*.log since start, masked) placed after step f; sit8- names -> sit9-. Full diff is reproducible: git diff --no-index sit8-drive.ps1 sit9-drive.ps1 in the scratchpad.

Drive log (whole):
16:52:32.822 start utc 2026-11-21T16:52:32.8084802Z
16:52:32.932 cmd.exe pid 2624
16:52:43.865 window 'Spatial IDE' found, app pid 66472, utc 2026-11-21T16:52:43.8648758Z
16:52:43.876 time since start: 11.1 s
16:52:43.958 Rebuilding application count at window: 0
16:52:44.015 watch start: rebuilding=0 running-target=0 pid=66472
16:54:07.238 watch change: rebuilding 0->0 running-target 0->0 window pid 66472->
16:54:07.247 FAIL watcher
16:54:07.267 window Close called utc 2026-11-21T16:54:07.2664081Z
16:54:10.638 cmd.exe exited utc 2026-11-21T16:54:10.6334952Z code 0
16:54:10.876 session log copied: session-1795279963.log
after-state snapshot: all four sections empty
16:54:15.852 times: start=...16:52:32Z window=16:52:43Z invoke= dialog= epsg= close=16:54:07Z cmdexit=16:54:10Z
RESULT FAIL watcher

Times: start to window 11.1 s (app already compiled); rebuilds at window 0. Watch ended at 83 s of 180 s: counts unchanged (rebuild 0, Running `target unchanged), only FindTopWindow returned null (window pid read empty). App log has no rebuild and no second launch; the window still existed 29 ms later (WindowPattern.Close on the same element succeeded). My reading, not established: a transient null from FindTopWindow or a title change, i.e. a false positive of my harness (a retry on null would be needed), not a watcher restart. Watcher behaviour in the remaining 97 s is unmeasured. Open invoked, dialog, read-back value, EPSG text: not reached. Close 16:54:07.3Z, cmd.exe exit 16:54:10.6Z code 0.

sit9-session.log (whole, masked):
1795279963433 info data-plane expected origin (config mirror): http://localhost:5180
1795279964528 info origin-self-check ok pinned=http://localhost:5180
1795279964539 policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error
(nothing about opening a file)

After: no spatial-ide-shell.exe, no LISTEN on 5180 (only TIME_WAIT), porcelain identical to before (no differences), HEAD unchanged.

sit9-app.log (19 lines, last 30 = whole, ANSI stripped): npm tauri dev banner; vite ready in 964 ms at localhost:5180; Running DevCommand cargo run; Info Watching frontends\shell\src-tauri; Finished dev in 2.00s; Running target\debug\spatial-ide-shell.exe; session log path (<u>); data-plane expected origin http://localhost:5180. No Rebuilding line.

Not done: no second start; watch incomplete; ComboBox/Edit dialog path unexercised; no tracked edit; git only rev-parse/status/diff --no-index; no screenshot.

Files (scratchpad <S>\): sit9-drive.ps1, sit9-drive.log, sit9-masktest.txt, sit9-app.log, sit9-session.log, sit9-after.txt, sit9-before.txt, sit9-porcelain-before.txt, sit9-porcelain-after.txt.
