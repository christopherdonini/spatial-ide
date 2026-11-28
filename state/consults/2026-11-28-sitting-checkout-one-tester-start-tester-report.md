*Filed by the custodian: the report of the one tester's start of the app in the sitting's checkout, before the human sits a part from it (ADV-2026-11-26-01 item 4, approved by the human; ADV-2026-11-26-15 item 4; ADV-2026-11-26-19 item 5). It was made in D:/wt/sit-v02, detached at release/v0.2's tip 7402b64564ca9476664f7871716588335261aaa5, by the sitting script's second command alone, after port 5180 was read free. The tester (claude-sonnet-5-5) was dispatched at 2026-11-28T10:34:35Z (date -u). By the facts script its records run from 2026-11-28T10:34:29.725Z to 2026-11-28T10:41:12.804Z, every one on claude-sonnet-5-5; it made 12 Bash calls, 2 Write calls and its hand-back; and 6 of its calls show the main checkout only as their working folder, the start folder of its shell, with no path of the main checkout in them. Its hand-back is below as received, with the harness indent removed: 6282 bytes, sha256 d544df12c958f7bb4d6313363fbff45c3caa66cda04363233ea2bfe7c448a808. One span is masked here and nowhere else: the profile path in the dev log's session-log line is written `<profile>`, as the report itself asks. Its words are the tester's.*

---

RESULT PASS
(verbatim from drive-01.log: `2026-11-28T10:40:45.861Z RESULT PASS`)

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff. Usage figures: not at hand.

**Before state (step 1)**
- Saved in D:/wt/sit-start-logs/drive-01-before.txt.
- HEAD was 7402b64564ca9476664f7871716588335261aaa5, as required.
- Porcelain of D:/wt/sit-v02 was 0 lines (empty). It is saved as porcelain-before.txt.
- renderer/bundle-viewer/viewer-asset-hashes.json and frontends/shell/src/generated/NOTICE.txt both exist.
- No spatial-ide-shell.exe process was running, and there was no listener on port 5180.
- The app's log folder is %LOCALAPPDATA%\dev.spatialide.shell\logs. The `app_log_dir` call is at frontends/shell/src-tauri/src/lib.rs line 328, and src/state.rs line 47 names the file `session-{stamp}.log`.
- The newest three session logs were session-1795715245.log, session-1795714984.log and session-1795714024.log.
- Disk before the run: C: 41415 MB free, D: 17700 MB free. Both were above the floors.

**Drive script**
- File: D:/wt/sit-start-logs/drive-01.ps1, 5495 bytes.
- sha256: fa5c85769478078c23c66dcf495e6cfea710fc8fbd00e3166814b37239abe311.
- Parse check: `Parser::ParseFile` returned 0 errors.

**Hold and release lines**
- I do not have them. The hold script's output went to the background task's output file, which sits under a temp folder, and the brief bars reading that.
- The hold ran and the Bash call exited 0. drive-01.out holds the drive script's own output (12 lines, a copy of the log lines).
- I did not read the release line either. If the lines are needed, say where I may read them.

**drive-01.log, whole**
```
2026-11-28T10:35:34.827Z before sessions: session-1795715245.log, session-1795714984.log, session-1795714024.log
2026-11-28T10:35:34.871Z step a: start tauri dev
2026-11-28T10:35:34.978Z cmd.exe pid 29508
2026-11-28T10:40:10.931Z window found after 276.1 s; app pid 36840
2026-11-28T10:40:10.936Z step c: wait 30 s, touching nothing
2026-11-28T10:40:41.146Z session log: session-1795862410.log, 3 lines
2026-11-28T10:40:41.188Z self-check line present: True
2026-11-28T10:40:41.192Z step e: close window via WindowPattern
2026-11-28T10:40:41.213Z close sent
2026-11-28T10:40:45.267Z cmd.exe exited, code 0
2026-11-28T10:40:45.856Z nothing left: no shell process, no webview2 of the app, no 5180 listener, no sit-v02 command line
2026-11-28T10:40:45.861Z RESULT PASS
```
The window appeared 276.1 s after the start, and the start compiled. Closing took about 4 s. Nothing was left over, so no process was stopped.

**Session log copy**
- File: session-1795862410.log, copied to D:/wt/sit-start-logs/drive-01-session.log. It has 3 lines.
- Self-check line, verbatim: `1795862413283 info origin-self-check ok pinned=http://localhost:5180`
- Warn or error lines: none. The other two lines are an info line (`data-plane expected origin (config mirror): http://localhost:5180`) and a `policy` line (`recovery policy: none -- fail visibly and terminate the canvas with a surfaced error`).

**Step 4**
- Porcelain after, compared with porcelain before using `diff`: exit code 0, identical. Both are empty.
- HEAD after is still 7402b64564ca9476664f7871716588335261aaa5.
- Disk after: C: 41432 MB free, D: 17399 MB free.
- Dev log (drive-01-dev.log): 1 line containing `Compiling` and 1 line containing `Finished`. The `Finished` line reads "in 4m 26s". My first count of `^ *Compiling` read 0 because ANSI colour codes precede the word, so I recounted without the anchor.
- Last 15 lines, with ANSI codes elided:
```
> spatial-ide-shell@0.1.0 dev
> vite

  VITE v6.4.3  ready in 1948 ms

  ➜  Local:   http://localhost:5180/
  ➜  Network: use --host to expose
     Running DevCommand (`cargo  run --no-default-features --color always --`)
        Info Watching D:\wt\sit-v02\frontends\shell\src-tauri for changes...
   Compiling spatial-ide-shell v0.1.0 (D:\wt\sit-v02\frontends\shell\src-tauri)
    Building [=======================> ] 570/571: spatial…
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4m 26s
     Running `target\debug\spatial-ide-shell.exe`
[spatial-ide-shell] session log: <profile>\AppData\Local\dev.spatialide.shell\logs\session-1795862410.log
[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180
```
The tail has fewer than 15 lines of text because the progress bar uses carriage returns. The block above is the `tail -15` output with the codes removed and the two `Building` redraws merged into one line. The session log path line shows the profile path as the app printed it. Treat that line as masked (<profile>) wherever you quote it.

**Failure classes for this harness**
- The harness drives the product's real interface: the sitting script's own `tauri dev` command, a UIA window search, and a window close through WindowPattern. It sends no click or key.
- Every result claim here points to drive-01.log, drive-01-session.log, drive-01-dev.log, drive-01-before.txt, porcelain-before.txt and porcelain-after.txt, all in D:/wt/sit-start-logs, and all exist.
- This is a single start, not a measurement run. The 276.1 s window time is one observation, and it includes a 4m 26s compile. It carries no p50 or p95.
- The test reached its assertions: the window was found, the self-check line was found, cmd.exe exited, and the left-over check ran. Each is logged.

**Departures and stops**
- The hold and release output was not read, as described above.
- The whole-script 30-minute bound is not a general timer in the script. The window wait stops at 20 minutes or at the 30-minute mark, whichever comes first. The later steps are each capped at 3 minutes, so the worst case is under 30 minutes. The run ended in about 5 minutes, so the bound was never reached.
- The brief's step e says to wait up to 3 minutes for cmd.exe to exit. Step f's "left 3 minutes after the close" is checked as a poll from the close time, and it ended as soon as nothing was left.
- Nothing stopped the run and nothing was refused.
- No start of the app happened outside the drive script.

Files, all in D:/wt/sit-start-logs: drive-01.ps1, drive-01.log, drive-01.out, drive-01-dev.log, drive-01-session.log, drive-01-before.txt, porcelain-before.txt, porcelain-after.txt.
