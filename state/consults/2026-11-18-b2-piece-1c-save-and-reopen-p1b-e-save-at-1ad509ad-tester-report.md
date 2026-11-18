Series: b2-piece-1c-save-and-reopen P1b E-SAVE at 1ad509ad69f1be832ef92af43c26cb03ada00a56, tester, port-5400 harness (the custodian's filing note, 2026-11-18: the one series for PR 331, E-SAVE at F; the tester, model claude-sonnet-5-5, its run 2026-11-18T16:37:52Z to 17:15:01Z by its transcript, Bash 38, Read 1, Write 1, Monitor 1, four errored; its third hand-back, after two setup stops of the custodian's brief (16:54:34Z and 17:04:47Z); 6877 bytes, sha256 d69df863c748a85c3db5dbf567a36e2443f443f4ffbd7810f520e0521f3f5fa6; below byte for byte, with this note and one final newline)

Result: E-SAVE rc=0. All 12 steps PASS in one run at 2026-11-18T17:13:43Z to 17:14:17Z (about 34 s). The step lines are byte-copied below. Under a load of 12,19,31 % CPU, nothing in this run was timing-sensitive. The `SPATIAL_IDE_AUDIT_LOG` file was never written (details below).

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

**Start state**
- HEAD was 1ad509ad69f1be832ef92af43c26cb03ada00a56, the porcelain was empty, and `sha256sum -c` printed ten `OK`. I re-checked all three after your second correction.
- I read the three scripts whole before the first hold. I read `p1b-e2e-load.sh` after the exe build. I changed no harness file.

**Installs (hold 1)**
- Both `npm ci` runs exited 0, and `git diff --quiet` exited 0 afterwards.

**Attempt history before the exe**
- Exe attempt 1 failed at rc 101: the viewer's `dist/*` glob matched nothing. The log is now `<H>/out/p1b-e2e-build-exe.attempt1.log`.
- Step 2a, `npm run build` in `renderer/bundle-viewer`, exited 0 and left the porcelain empty. Its last line was `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`, with the build still returning 0.
- Exe attempt 2 failed at rc 101: `src\generated\NOTICE.txt` did not exist. The log is now `<H>/out/p1b-e2e-build-exe.attempt2.log`.
- Step 2c, `npm run build` in `frontends/shell`, exited 0 (`build rc=0`). It ended with the Vite "built in 18.57s" line after the chunk-size warning. `src/generated/NOTICE.txt` (3506979 bytes) and `dist/index.html` (533 bytes) both exist, and the porcelain was empty.

**Exe (step 2d, attempt 3)**
- rc 0. The last five lines it printed were:
```
   Compiling duckdb v1.10505.0
   Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\1c-p1b\frontends\shell\src-tauri)
   Compiling spatial-engine v0.0.0 (C:\dev\wt\1c-p1b\engine)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p1b\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 4m 30s
```
- The script then printed `copied exe`.
- The exe `D:/wt-targets/1c-p1b/exes/spatial-ide-shell-p1b.exe`:
  - Size: 91540992 bytes
  - mtime: 2026-11-18 18:13:14 +0100
  - sha256: 8c0e7cd8b8865b9246e3ef46485ba91f01b55dfe41185d2842c05afe13b491de
- The porcelain was empty after the build.

**E-SAVE (step 3, tag `e-save`, port 5400, not `--measure`)**
- Load before the run: `load e-save 17:13:33Z 12,19,31`.
- Log: `<H>/out/p1b-e2e-e-save.log`, begins `worktree C:/dev/wt/1c-p1b head 1ad509ad69f1be832ef92af43c26cb03ada00a56 start 2026-11-18T17:13:43Z`.
- The run printed its fixture sha256 as 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, and printed the same value again at the end ("unchanged").
- The step lines, byte-copied:
```
[OPEN] PASS (3630ms): admitted; the Save control and the first pixels are there
[CLAUSES] PASS (4568ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); 4 record_step rows reached ok
[STYLE] PASS (3453ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok
[POSE] PASS (3857ms): camera set to centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572
[SAVE] PASS (31ms): answered "asked"; the folder holds project.spatial alone (2497 characters); spatial://project/aa9998cf7dbdac5b572a5c5d65c9c75b
[READBACK-FILTER] PASS (0ms): the file holds the three clauses in order, the second off, and the filter ("zone" = 'residential') AND ("zone" IS NOT NULL)
[READBACK-STYLE] PASS (0ms): the file's style holds the fill colour #112233 and the applied opacity 0.37
[READBACK-VIEW] PASS (1ms): the file's view holds the pose's patterns: centre 4143d7e22aaaaaab, 4132530449249249, zoom bfeb6db6db6db6dc
[SECOND-SAVE] PASS (25ms): answered "not-asked"; the second folder stays empty; the first folder's project.spatial still reads back
[INSIDE-OPEN] PASS (3796ms): the copy under "parcels.parquet" in the third folder was admitted
[INSIDE-SAVE] PASS (24ms): answered "asked"; the third folder holds project.spatial and the copy; spatial://project/172f9daafe90eb58ba3235a42c348c7a
[NOTICE-S18] PASS (7ms): the save notices hold S18's text once; the dataset entry's locators read machine-recorded
```
- The log ends with `rc=0 end 2026-11-18T17:14:17Z`.
- Reports the harness copied to `<H>/out/`: `p1b-e2e-e-save.rep.app.log`, `p1b-e2e-e-save.rep.project-console-ledger-1795022057583.json`, `p1b-e2e-e-save.rep.tauri.e2e.conf.json`. The harness also copied the app's stdout, stderr and vite stderr logs there.
- My copies in `<S>`:
  - `p1be-e-save.log`
  - `p1be-e-save.app.err.log`
  - `p1be-e-save.session.log` (7544 bytes, the file the stderr names: `...dev.spatialide.shell/logs/session-1795022033.log`)
- The audit log `<S>/p1be-e-save.audit.jsonl` was not created. `SPATIAL_IDE_AUDIT_LOG` was set in the command, but the suite wrote nothing there. I did not look into why.
- The app's stderr has three lines: the session-log path, the data-plane origin line, and `the advisory source watcher signalled observed-change`. I did not read it for anything further.

**Four failure classes for this measurement**
- Interface: the harness drives the packaged debug exe through WebView2/CDP, which is the interface the product exposes.
- Results table: no performance number is claimed. The per-step millisecond values are the suite's own timings, not benchmark measurements. The pointer for the result is the log named above.
- Operator-facing lines: every line above describes this run at this commit.
- Assertions: the suite reached its read-back and notice assertions (READBACK-* and NOTICE-S18), not only its setup.

**Holds** (asked times from the stamps; each hold line carried `also=<m>`)
- Hold 1, npm ci: 2026-11-18T16:38:31Z.
- Hold 2, exe attempt 1: 2026-11-18T16:39:14Z.
- Hold 3, viewer build: 2026-11-18T17:03:15Z.
- Hold 4, exe attempt 2: 2026-11-18T17:03:48Z.
- Hold 5, shell `npm run build`: 2026-11-18T17:06:32Z.
- Hold 6, exe attempt 3: 2026-11-18T17:08:33Z.
- Hold 7, E-SAVE: 2026-11-18T17:13:23Z.
- All were granted and released. There was no 96 to 99 exit and no WAIT_TIMEOUT.

**Processes at the end**
- The suite's own teardown printed `killed tree 38764` and `killed tree 78752`, then `port 9223 free` and `port 5400 free`.
- A final `ps` for `spatial-ide-shell` or vite returned count 0.
- All my background commands have finished. I killed nothing myself.

**Not named in the brief or your corrections**
- I wrote `<S>/p1be-install.sh`.
- I wrote the stamps `p1be-h1.asked` through `p1be-h7.asked`.
- I wrote the build logs and rc files: `p1be-viewer-build.log`/`.rc` and `p1be-shell-build.log`/`.rc`.
- I ran bounded wait loops.
- I ran read-only `ls`, `grep` and `cat` checks.
- Final porcelain of `C:/dev/wt/1c-p1b` is empty.
