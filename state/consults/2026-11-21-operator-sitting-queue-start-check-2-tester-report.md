*Filed by the custodian: the report of the start of the app before the sitting that ADV-2026-11-21-16 item 7 and ADV-2026-11-21-24 item 2 allow, made in the main checkout at c4b5643b98be5d10f8b93251af8efc8c4fcae042 by the script's two commands as written. The drive script's log holds only its time stamps: its mask function's parameter and the script's scratch-path variable are one variable in PowerShell, so every logged line was replaced whole (ADV-2026-11-21-25 item 8). What the stamps suggest is the custodian's reading, in the message filed at state/consults/2026-11-21-operator-sitting-queue-start-check-2-custodian-stop-message.md, not an observation, the hand-back of the tester (claude-sonnet-5-5), 6941 bytes, sha256 f9bea4c9ad99e413ce0cdefe950faa0a4a81222a0d4702a0795b506ec5573baf, below the rule, masked by the custodian: the scratch folder path 1 times, the hold lines project value 2 times, the user application data folder 1 times; nothing else changed. Its result line: RESULT FAIL dialog. Its calls in the transcript, by unique call ids: Read 3, Bash 10, SubagentHandback 1; errored: 0, from 2026-11-21T16:32:50Z to 2026-11-21T16:41:28Z.*

---

Checked: operator-sitting-queue, ADV-2026-11-21-16 item 7, the start, tester

**RESULT FAIL dialog.** The window showed and the Open GeoParquet… button was invoked, but the run ended in a dialog failure. I could not tell from the log which dialog step failed, and I did not re-run.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5), with no override and no context handoff. Token usage: none at hand.

**Harness failure classes**
- **Product interface:** the harness used the script's two commands as the product exposes them, and drove the window through UIAutomation. This held.
- **Results table or report:** every claim below points to a file in `<S>`. The drive log and `sit8-after.txt` are content-destroyed, as described under "Harness defect".
- **Operator-facing lines:** the lines about this commit's start describe what was measured at c4b5643b.
- **Assertion reached:** the run got past setup into the dialog step, but the log does not show which assertion failed.

**Head, fixture, before state**
- HEAD is c4b5643b98be5d10f8b93251af8efc8c4fcae042, which equals the expected commit.
- The fixture is 409872 bytes, the expected size.
- Before the run there was no `spatial-ide-shell.exe` process and no listener on port 5180 (`<S>/sit8-before.txt`). The porcelain before was 7 lines, saved to `<S>/sit8-porcelain-before.txt`.

**Step 1: the viewer build**
- It started at 2026-11-21T16:33:16.379Z and ended at 16:33:21.250Z, about 4.9 s. The rc was 0.
- The last 5 lines of `<S>/sit8-viewer.log`:
```
dist/index.html + dist/app.js + dist/NOTICE.txt + dist-metafile.json
scan-dist: 3 files scanned, 2 findings, all reviewed; record written
scan-dist: reviewed row NOTICE.txt credential 19092: matched
scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
scan-dist: reviewed row app.js local-filesystem-path 7291: not found
```
- The last line says a reviewed `app.js` row was "not found". The build still exited 0. I note it and make no more of it.

**The hold's lines** (masked)
- `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, with no `others=`.
- The call then printed `drive-rc=0`.
- `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- The drive script's own rc was 0, even though its RESULT line says FAIL.
- The hold was granted at once. No exit code 96 to 99.

**Drive script:** `<S>/sit8-drive.ps1` is `sit7-drive.ps1` with these changes:
- Every `sit7-` name became `sit8-`.
- The overall deadline went from 28 to 48 minutes.
- The window poll went from 20 to 40 minutes.
- Everything else is as the brief steps 2a to 2h describe, and I did not reproduce the script's 230 lines here. It is at the path above.

**Harness defect**
- The script's `Mask` function takes a parameter `$s`, and PowerShell variable names are case-insensitive.
- So `$s.Replace($S,'<S>')` replaces the whole string with `<S>`.
- As a result, every line of `sit8-drive.log` (261 bytes) shows only its timestamp followed by `<S>`. The same bug emptied the text of `sit8-after.txt`.
- The log's whole content, as far as it is readable:
```
16:33:32.219 <S>
16:33:32.313 <S>
16:39:16.328 <S>
16:39:22.603 <S>
16:39:22.730 <S>
16:39:25.777 <S>
16:39:26.824 <S>
16:39:26.837 <S>
16:39:26.840 <S>
16:39:26.849 <S>
16:39:29.204 <S>
<S>
<S>
<S>
<S>
<S>
16:39:34.576 <S>
RESULT FAIL dialog
```
- The step text is lost, so I cannot say which dialog step failed.
- The EPSG text was never seen, and I cannot tell whether the fixture opened.

**Times** (UTC, from the log's stamps; the step each stamp belongs to is my inference from the script's order)

| Step | Time |
|---|---|
| Start and cmd.exe PID line | 16:33:32.2 to .3 |
| Window found | 16:39:16.328, about 5 min 44 s after the start |
| Button found | 16:39:22.603 |
| Open invoked | 16:39:22.730 |
| Dialog confirmed | 16:39:25.777 |
| Box, Open button and related lines | 16:39:26.82 to .85 |
| Another stamped line, probably the FAIL dialog line | 16:39:29.204 |
| Final times line | 16:39:34.576 |

- The EPSG time is absent. Close and cmd.exe exit times are not readable.
- The run ended about 6 min 2 s after the start.

**After state**
- `sit8-after.txt` is masked away by the defect. It has 5 lines: a header plus the 4 section headings, with no `LEFT` line.
- That is consistent with nothing being left, but I did not see the entries.
- My own check after the run found no `spatial-ide-shell.exe` process and no listener on 5180. Only TIME_WAIT sockets remain.
- A `msedgewebview2.exe` count of 13 exists on the machine. I cannot attribute those to the app or to other programs. I killed nothing.
- **Porcelain:** `sit8-porcelain-after.txt` has no difference from the before file, so the tracked tree is unchanged.

**App log (`sit8-app.log`) findings**
- It is mostly ANSI cargo output. The shape is:
  - vite is ready on localhost:5180.
  - The first cargo build compiles libduckdb-sys, duckdb and the shell, finishing in 25.82 s.
  - Several "Info File src-tauri\target\debug changed. Rebuilding application..." rebuild cycles follow.
  - The app runs `target\debug\spatial-ide-shell.exe` and the second build finishes in 1.36 s.
- The last lines of the log, user-profile path masked:
```
Running `target\debug\spatial-ide-shell.exe`
[spatial-ide-shell] session log: <u>\dev.spatialide.shell\logs\session-1795279156.log
[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180
```
- The shell's own session log shows `origin-self-check ok pinned=http://localhost:5180`.
- It then shows the line "recovery policy: none -- fail visibly and terminate the canvas with a surfaced error". I do not know what that line means here, so I note it and make no claim about it.
- The rebuild loop is a finding. The `tauri dev` watcher saw `src-tauri\target\debug` change during the first run and restarted the build several times. The window came about 5 min 44 s after the start.

**Findings and stops**
- Nothing beyond the script's two commands was needed to get the window. That means no install, no extra build and no extra file.
- The start check fails at the file dialog (2d). The cause is unknown because of the masking bug.
- This is the one allowed run. A second or third start needs the advisor first. I made no second start, and I edited no tracked file.
- Before any next start, the custodian should fix `Mask` in the drive script. Rename the parameter, for example `$txt`, so the log is readable. The failing dialog step then becomes visible.
- I did not do the rest of the steps that depend on the dialog. Whether the fixture opens is unknown.

Files (all in `<S>/`):
- `sit8-drive.ps1`
- `sit8-drive.log`
- `sit8-app.log`
- `sit8-viewer.log`
- `sit8-before.txt`
- `sit8-after.txt`
- `sit8-porcelain-before.txt`
- `sit8-porcelain-after.txt`
