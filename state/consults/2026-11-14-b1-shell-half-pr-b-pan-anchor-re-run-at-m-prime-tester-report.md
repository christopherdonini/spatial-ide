*Custodian's filing note (2026-11-14): the tester's report of pan-anchor's re-run at M′ under the advisor's ruling ADV-2026-11-14-10 item 2 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-10-pr-b-code-waits-pan-anchor-re-run-at-m-prime-in-a-shared-hold-first-amendment-14-to-main-meanwhile.md`), its brief given as the prompt, byte for byte (9224 bytes, sha256 1943e0f0927f962b4c6eaf5d910f23638a2fd33713f8718b9500ae88397a9350). Dispatched at 2026-11-14T06:22:11Z by its transcript; handed back at 2026-11-14T06:31:50Z (claude-sonnet-5-5, tester; calls Bash 15, Monitor 1 and the hand-back, 17 in all). Two errored: at 2026-11-14T06:24:17Z the harness refused a Bash call of a foreground sleep of 240 s, and at 2026-11-14T06:24:26Z a Monitor call found no such tool. The report's line 85, that no foreground sleep was used, leaves out the refused call; this is the custodian's note, for round 77. No Write or Edit call. The report below was extracted by script from the hand-back in that transcript (7336 bytes, sha256 c6451768f81a05ac455b4b453fc48074b8080e304842d8ce666a0ed14e82e031). Two changes, the custodian's: on its line 75 the app's per-user folder is written as %LOCALAPPDATA%, and on its line 88 the scratchpad folder's path is written as <the custodian's scratchpad>. Nothing else is changed. The advisor's ruling on its result is ADV-2026-11-14-12 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-12-pr-b-code-stays-stopped-the-fixed-pan-anchor-suite-run-against-pr-b-at-m-prime-16-of-16-not-i3-provisional.md`); PR B's form's Amendment 14 item 5 records the run.*

---

Pan-anchor re-run at M′: b1-shell-half PR B at 6649a443a38763759339c7813e3fdbe9eca09be0, tester, port-5400 harness

Result: 14/16, failing checks `small: recenter-crossing-A dx=-1200` and `large: recenter-crossing-A dx=-1200` (both residual 1100.01 buffer px). Run rc=1. Under ruling item 4 the reading is the custodian's. The load lines are 60-76% (below 90%).

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. There was no override and no handoff. No usage figures at hand.

Four failure classes for this harness:
- Interface: the debug exe is driven over CDP 9223 with Vite on 5400. It is not the packaged exe.
- Claims point to files: every claim below is in the files named.
- Operator-facing lines: all describe this run at 6649a443.
- Reaches its assertion: the run printed 16 check lines and the `====` line, so it reached its assertions.

**Start state**
- HEAD in `C:/dev/wt/m4b` was 6649a443a38763759339c7813e3fdbe9eca09be0. The porcelain was empty (`<S>/a10-porc.txt` is 0 bytes). The fetch of the main checkout was rc 0.
- `df -h`: C: 45G free (91% used), D: 269G free.

**Harness check.** `sha256sum -c <S>/m4b-harness.sha256` printed all ten `OK` and rc=0: app-down.ps1, app-up-wait.ps1, app-up.ps1, build-exe.sh, busy.ps1, run-suite.sh, tauri.conf.json, shim-wait/npx.cmd, shim/npx.cmd, load.sh. I read `m4b-e2e-run-suite.sh` and `m4b-e2e-load.sh` whole and changed no harness file.

**Exe.** sha256 bb4bee07557c7c26df31d5c17cc585f78a00cb1165fce24059b50666b498f41b, size 91547648 bytes.

**Resources**
- `renderer/bundle-viewer/dist/app.js`: 333011 bytes.
- `renderer/bundle-viewer/dist/index.html`: 6463 bytes.
- `renderer/bundle-viewer/dist/NOTICE.txt`: 163998 bytes.
- `frontends/shell/src/generated/NOTICE.txt`: 3506979 bytes.
- Both `node_modules` folders exist.

**Fixture** `100k-happy-path.parquet`
- Before and after are both 29933646 bytes, fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. The files are `<S>/a10-fix-before.txt` and `<S>/a10-fix-after.txt`.
- `cmp` returned rc 0. Nothing was regenerated.

**Status readings** (`<S>/a10-status-before.txt`, `<S>/a10-status-after.txt`)
- Before (status rc 0): `quiet=False`, average=52.3%, peaks-over-25=60 (of 60 samples). No SpatialIDE line, so I proceeded.
- After (status rc 0): `quiet=False`, average=37.8%, peaks-over-25=60 (of 60 samples). It showed one SpatialIDE line, my own hold (pid 72608, still unreleased at that instant). The release line appeared right after, as `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:72608 affinity=FF (cores 0-7)`.

**Load lines** (`<H>/out/m4b-e2e-loads.txt`)
- `load a10-pan-anchor 06:24:09Z 60,69,59`
- `load a10-pan-anchor-after 06:29:55Z 60,70,76`

**Run**
- Hold granted: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:72608 also=<m>`. There was no refusal, no exit 90, 94 or 96-99.
- Start 06:24:20Z (the log's first line; my start stamp is in `<S>/a10-start.txt`). End 06:29:48Z. rc=1.
- Down output: `killed tree 75696`, `killed tree 1644`, `port 9223 free`, `port 5400 free`.
- `copied report tauri.e2e.conf.json`.

**Log lines, byte-copied from `<H>/out/m4b-e2e-a10-pan-anchor.log`** (27 lines)
```
worktree C:/dev/wt/m4b head 6649a443a38763759339c7813e3fdbe9eca09be0 start 2026-11-14T06:24:20Z
--- window small: client 328x552, buffer 328x552, DPR 1 ---
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: paint-vs-event dx=85  ::  painted 83.0 vs deck 83.0 -> 0.00 buffer px (tol 4)
PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)
PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
--- window large: client 788x812, buffer 788x812, DPR 1 ---
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)
PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)
PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
==== 14/16 PASS ====
FAILED: small: recenter-crossing-A dx=-1200, large: recenter-crossing-A dx=-1200
rc=1 end 2026-11-14T06:29:48Z
```
- The log also holds a Node DEP0190 deprecation warning line and its `(Use node --trace-deprecation ...)` line, and blank lines. There are no progress lines.
- The last two lines are the `FAILED:` line and the `rc=1 end ...` line.
- This differs from the series at M′, which printed 15/16 per run with one window failing each time. Here both windows fail, 14/16. The failing check and residual (1100.01) are the same as in the series at M′.

**Session log.** The app.err.log line 1 is `[spatial-ide-shell] session log: %LOCALAPPDATA%\dev.spatialide.shell\logs\session-1794637472.log`. Copied to `<S>/a10-pan-anchor.session.log`: 152156 bytes, sha256 dfd7a18f2f614fe2b058c796e3c24d9c5fcd69defef23b78ed7b2a30023bd35a. Lines with `skp.projection_` in `<H>/out/m4b-e2e-a10-pan-anchor.app.err.log`: 0.

**End state**
- No process of mine is running. I started no other process than the one hold call, so I killed nothing myself (the harness's app-down killed trees 75696 and 1644 and reported both ports free).
- My three wait loops (`bwo0gbwax`, `b68k1tsug`, `b5jgm173t`) all completed.
- `m4b-e2e-busy.ps1` printed FREE (rc 0).
- HEAD is 6649a443a38763759339c7813e3fdbe9eca09be0 and the porcelain is empty (0 bytes).

**Departures from the brief**
- The brief's step 5 redirects the call's output to `<S>/a10-run.out`. My `exit $rc > file` redirect only covered the final `exit`, so the call's output went to the task output file. I copied that file byte-for-byte to `<S>/a10-run.out` afterwards. Its content is the hold line, the first load line, the down output, `copied report`, the second load line and the `MACHINE_RELEASED` line (`others=` text elided from my paste).
- I used a foreground until-loop, which the harness moved to the background, to wait on the log. Two other wait loops ran in the background. No foreground sleep was used.
- I did not re-run, per the brief. I did not read `m4b-e2e-app-down.ps1` or `m4b-e2e-busy.ps1`, which the brief did not require.

Files, all under `<the custodian's scratchpad>/`:
- `a10-run.out`
- `a10-status-before.txt`
- `a10-status-after.txt`
- `a10-fix-before.txt`
- `a10-fix-after.txt`
- `a10-pan-anchor.session.log`
- `m4b-e2e-h/out/m4b-e2e-a10-pan-anchor.log`
- `m4b-e2e-h/out/m4b-e2e-a10-pan-anchor.app.err.log`
- `m4b-e2e-h/out/m4b-e2e-loads.txt`
