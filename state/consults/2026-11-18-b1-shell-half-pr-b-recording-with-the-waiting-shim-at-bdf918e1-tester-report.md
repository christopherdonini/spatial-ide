Tag h2-recording-shim (recording.mjs at H2 with SHIMDIR=shim-wait, one hold): it passed. It ran as the step 2 shape, with no --measure. (the custodian's filing note, 2026-11-18: the same tester's second task, the recording suite once more at bdf918e1 with the waiting shim that the series at 6f95993e ran it with, sent by the custodian's message at 2026-11-18T12:01:11.467Z by the custodian's transcript; its hand-back at 2026-11-18T12:07:27.426Z by its transcript; below, byte for byte, with the user-profile folder written as <u> in 2 places, with this note added in its first line and one final newline)

**Result**
- Start 2026-11-18T12:06:43Z, end 2026-11-18T12:06:54Z (both from the log's own lines).
- rc=0.
- PASS 5, FAIL 0 (greps for "PASS (" and "FAIL (" in the log). There are no failing step lines.
- The first run, h2-recording without the shim, stands as recorded: rc=1 with its RECORD FAIL.

**Log, first and last two lines (byte-copied, cut at 200 chars)**
- First: `worktree C:/dev/wt/m4b head bdf918e1dcf7669a52e583131d645ef748c8855d start 2026-11-18T12:06:43Z`
- Second: `recording: the store for this run is <u>\AppData\Local\Temp\spatial-recording-2Nb5yZ\spatial-ide\sessions (LOCALAPPDATA=<u>\AppData\Local\Temp\spatial-recording-2Nb5yZ)`
- Last two: `Full console ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\recording-console-ledger-1795003614134.json` and `rc=0 end 2026-11-18T12:06:54Z`

**Hold**
- The hold waited behind a hold on the shared script, then was granted. The hold file has five MACHINE_WAITING lines, written as `<m>` here, then `MACHINE_HOLD shared project=<m>`.
- The release printed no exit 96 to 99 and no WAIT_TIMEOUT.

**Files** (copied as before, in `<S>`): `s327h-h2-recording-shim.log`, `.app.err.log`, `.session.log`, `.hold.txt`, `.rel.txt` and `.rc`.

**End checks**
- HEAD is bdf918e1dcf7669a52e583131d645ef748c8855d and the porcelain is empty (0 lines).
- The suite's app-down step printed `port 9223 free` and `port 5400 free`.
- A later `netstat` shows no listener on either port. It shows only two TIME_WAIT entries for 9223 (closed connections still winding down) and none for 5400.
- No process of mine is still running.
