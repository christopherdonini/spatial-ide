*Filed by the custodian: the report of the third and last start that ADV-2026-11-21-26 allows, made in the main checkout at 77106988b3c60569f4a557784c7a9777e03bdd39 by the script's second command alone, with the drive script made by the custodian from the second start's by the ruling's two changes, the hand-back of the tester (claude-sonnet-5-5), 8096 bytes, sha256 7c2f74ce3828547e143d469a631b66e37a5f9783a4eb18cb964f0ff44ea03861, below the rule, masked by the custodian: the scratch folder path 1 times, the user application data folder 1 times, the times line, its twelve-hour clock stamps 5 times; nothing else changed. Its result line, the drive log's own: RESULT FAIL dialog. Its calls in the transcript, by unique call ids: Bash 9, SubagentHandback 1; errored: 1, from 2026-11-21T17:16:35Z to 2026-11-21T17:21:13Z.*

---

Checked: operator-sitting-queue, ADV-2026-11-21-26, the third start, tester

RESULT FAIL dialog (the drive script's final line). The watch ran with the window open and found no change. The file was not opened.

Model: I observe myself running as Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. The usage figures are not at hand.

**Before**
- Head: `git rev-parse HEAD` returned 77106988b3c60569f4a557784c7a9777e03bdd39, which is the required head.
- Fixture: `filter-zoned.parquet` is 409872 bytes. I did not regenerate it.
- Drive script: `<S>/sit10-drive.ps1` is 14498 bytes, sha256 8dfb4a3fcc78a6e4583b8fa564608126bed27380cde6c79f8148d24b2f10e530. Both match the brief.
- Before state: no `spatial-ide-shell.exe` process and no listener on 5180. `sit10-before.txt` is empty (0 bytes).
- Porcelain before: 7 untracked lines, six under `.codex-remote-attachments/` and `PROMPT-AUDIT-2026-10-04.md`. All were already present.

**Diff of sit9 to sit10**
- The diff holds exactly the two changes and nothing else.
- Every other hunk is a `sit9` to `sit10` rename: the app log, the session log, the after file, the `Sit9` to `Sit10` namespace, and the `*sit10-drive.ps1*` exclusion in the snapshot.
- The old watch block (b2) is removed before step c, and a new block (e2) is added after the open.
- In e2 an empty lookup is logged ("watch: empty lookup, tried again in 5 s"), waits 5 s and looks up again.
- Only a second empty lookup counts as the window gone.
- The watch runs whenever the window was found, whatever the open's result.
- A watch change still ends in `FAIL watcher`.

**Mask test, whole**
```
scratch path line: <S>\sit10-app.log
profile path line: <u>\x
plain line: nothing to mask
```

**Hold lines**
```
MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:58064 also=<m> (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=<m> shell=bash.exe:58064 affinity=FF (cores 0-7)
drive-rc=0
```
There was no MACHINE_WAITING or MACHINE_ERROR line, and no `others=`.

**Drive log, whole** (`<S>/sit10-drive.log`)
```
17:17:10.701 start utc 2026-11-21T17:17:10.6907956Z
17:17:10.783 cmd.exe pid 72544
17:17:19.092 window 'Spatial IDE' found, app pid 82732, utc 2026-11-21T17:17:19.0929051Z
17:17:19.103 time since start: 8.4 s
17:17:19.180 Rebuilding application count at window: 0
17:17:23.404 button found: 'Open GeoParquet.'
17:17:23.500 Open invoked utc 2026-11-21T17:17:23.4420679Z
17:17:26.157 dialog confirmed: class #32770 name 'Open' utc 2026-11-21T17:17:26.1546566Z
17:17:27.194 file-name box found, control type ControlType.Pane
17:17:27.484 dialog error: Exception calling "SetFocus" with "0" argument(s): "Target element cannot receive focus."
17:17:27.504 FAIL dialog
17:17:27.514 watch start: rebuilding=0 running-target=0 pid=82732
17:20:29.456 watch end: no change in 3 min (rebuilding=0 running-target=0 pid=82732)
17:20:29.464 window Close called utc 2026-11-21T17:20:29.4648751Z
17:20:31.652 cmd.exe exited utc 2026-11-21T17:20:31.6506925Z code 0
17:20:31.820 session log copied: session-1795281439.log
sitting start check: after state (utc 2026-11-21T17:20:36.2999958Z)
== spatial-ide-shell.exe
== command line contains frontends\shell or frontends/shell
== msedgewebview2.exe descended from app pid
== listeners on 5180
17:20:36.318 times: start=2026-11-21T17:17:10.6907956Z window=<t> invoke=<t> dialog=<t> epsg= close=<t> cmdexit=<t>
RESULT FAIL dialog
```

**Times**
- Start was 17:17:10.7 and the window was found at 17:17:19.09. That is 8.4 s between them. The Rebuilding application count at the window was 0.
- Open GeoParquet was invoked at 17:17:23.44. The dialog (class #32770, name 'Open') was confirmed at 17:17:26.15.
- The value read back was not reached. The drive script found the file-name box as a Pane, and its `SetFocus` failed with "Target element cannot receive focus." No path was set and no key was typed. The EPSG text was not seen; the epsg time is empty.
- The watch started at 17:17:27.5 with rebuilding=0, running-target=0 and pid=82732. There were no empty lookups logged. It ran the full 3 minutes and ended at 17:20:29.46 with "no change in 3 min". There was no Rebuilding line and no second Running line.
- The window Close was called at 17:20:29.46. cmd.exe exited at 17:20:31.65 with code 0.

**sit10-session.log, whole** (masked)
```
1795281439738 info data-plane expected origin (config mirror): http://localhost:5180
1795281440658 info origin-self-check ok pinned=http://localhost:5180
1795281440667 policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error
```
The session log holds nothing for an open, because the open was not reached.

**After**
- No `spatial-ide-shell.exe` process, no msedgewebview2 descended from the app, and no listener on 5180. This comes from the drive script's own snapshot and my `tasklist` and `netstat` check.
- The porcelain after is identical to the porcelain before (diff output "SAME"), so the tracked tree is unchanged.

**Last 30 lines of `sit10-app.log`**
```
> spatial-ide-shell@0.1.0 tauri
> tauri dev

     Running BeforeDevCommand (`npm run dev`)

> spatial-ide-shell@0.1.0 dev
> vite

  VITE v6.4.3  ready in 673 ms

  ➜  Local:   http://localhost:5180/
  ➜  Network: use --host to expose
     Running DevCommand (`cargo  run --no-default-features --color always --`)
        Info Watching C:\dev\spatial-ide\frontends\shell\src-tauri for changes...
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.74s
     Running `target\debug\spatial-ide-shell.exe`
[spatial-ide-shell] session log: <u>\dev.spatialide.shell\logs\session-1795281439.log
[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180
```
The file has about 20 lines, so this is all of it. ANSI escapes are stripped.

**Material for the item 8 message**
- Shown by this start: the script's second command alone gives the window in 8.4 s with no rebuild. The three minutes with the window open showed no rebuild, no second start and no empty lookup (the dialog had already failed by then). This is the longest clean watch so far, against 83 s before.
- Not shown: the file opening through the dialog. The dialog opens, but the drive script cannot focus the file-name box, which UI Automation reports as a Pane. The dataset was therefore never open during the watch, so the watch was not run with the dataset open as item 2 intended.
- The brief asks me to name the suite and row that open this file under the suites' own launch. I did not search for it and name none. The human's own start at the sitting is the check of the dialog.
- Item 5 does not apply: there was no real rebuild or restart.

**Not done**
- No second run and no other start command. No viewer build, e2e, install or cargo command.
- No git command other than `rev-parse`, `status` and the one `diff --no-index`.
- No edit of any tracked file or of the drive script. No key was sent by me. No screenshot.
- The fixture was not regenerated.
- I made no stop. This was the last start of this check.

Files, all under the scratchpad `<S>\`:
- `sit10-drive.log`
- `sit10-app.log`
- `sit10-session.log`
- `sit10-after.txt`
- `sit10-masktest.txt`
- `sit10-before.txt`
- `sit10-porcelain-before.txt`
- `sit10-porcelain-after.txt`

**The four failure classes, as they apply to this harness**
- The harness uses the interface the product exposes: the real `npm --prefix frontends/shell run tauri dev` start, the real window and the real Open button. The dialog step did not reach its assertion, so it is not shown.
- Every result claim above points to the drive log, which exists.
- The operator-facing lines describe this commit's run (77106988, 2026-11-21).
- The watch test reached its assertion, "no change in 3 min", but with the dataset not open. That is a limit of the claim, stated above.
