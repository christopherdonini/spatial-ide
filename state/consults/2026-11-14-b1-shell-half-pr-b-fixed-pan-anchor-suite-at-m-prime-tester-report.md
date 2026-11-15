*Custodian's filing note (2026-11-14): the tester's report of the fixed pan-anchor suite run against PR B's build at M′ under the advisor's ruling ADV-2026-11-14-12 item 2 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-12-pr-b-code-stays-stopped-the-fixed-pan-anchor-suite-run-against-pr-b-at-m-prime-16-of-16-not-i3-provisional.md`), its brief given as the prompt, byte for byte (10837 bytes, sha256 814f2079ba85c6f480e26b6780de389b2d8a0fff3e1c50d0fb1cf830745564e0). Dispatched at 2026-11-14T06:39:07Z by its transcript; handed back at 2026-11-14T06:47:59Z (claude-sonnet-5-5, tester; calls Bash 12, Read 1 and the hand-back, 14 in all; none errored; no Write or Edit call). The report below was extracted by script from the hand-back in that transcript (7018 bytes, sha256 ad30b67feb5105ca57730f681edeb495653abd3baab25d7fbfde76d507b75202). One change, the custodian's: on its line 91 the scratchpad folder's path is written as <the custodian's scratchpad>. Nothing else is changed. The advisor's ruling on its result is ADV-2026-11-14-13 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-13-the-fixed-suite-pass-holds-pr-b-code-goes-ahead-a-pass-under-load-before-pr-b-gates-the-sweep-closed.md`); PR B's form's Amendment 14 item 5 records the run.*

---

Fixed pan-anchor suite at M′: b1-shell-half PR B at 6649a443a38763759339c7813e3fdbe9eca09be0 with pan-anchor.mjs at 08bed11cd25066976a116cc6e2dbfb9aa8d647ac, tester, port-5400 harness

Result: 16/16

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override, no context handoff. No usage figures at hand.

Four failure classes as they apply:
- Interface: the debug exe driven over CDP 9223 with Vite on 5400, not the packaged exe.
- Claims point to files: all lines below are in the harness out folder `<H>/out/m4b-e2e-fx12-pan-anchor.log` or the `fx12-` files in `<S>`.
- Operator-facing lines: they describe this run at 6649a443 with the suite file at 08bed11c. The load lines are 3-sample readings taken just before and just after the run.
- Reaches its assertion: yes. All 16 check lines printed PASS.

Start state (step 0)
- HEAD was 6649a443a38763759339c7813e3fdbe9eca09be0 and the porcelain was empty.
- `df -h`: C: 44G free (91% used), D: 269G free.
- Blob `HEAD:<F>` was ed20f8aec2827c12659b05bbc926cd6e51faaf62.
- Blob `08bed11c:<F>` was 7642086bcc702c9f4c3ff45045c02ae1ef65d810.
- File sha256 at step 0: 17765b25d12ecfe6ee3cd9bbad4bfe455b3f934a1ad5a0403df0ce91d14bf866.
- At step 4, after the edit (`git show` rc 0), the sha256 was c9df3e57fec7b0af8a8e23ff02232b94b023bd073c015a352456847281e9d16c and the porcelain was exactly ` M frontends/shell/e2e/pan-anchor.mjs`.
- At step 8, after the revert (rc 0), the sha256 was 17765b25d12ecfe6ee3cd9bbad4bfe455b3f934a1ad5a0403df0ce91d14bf866 and the porcelain was empty.
- The ruling copy `<S>/adv-2026-11-14-12.copy.md` is 4045 bytes with sha256 6d327e8dffd2f2bbaf7e2060d7f5a601aca6c9d3343182dea2cdb59e5df77348. I read it whole, and read the prior series report's pan-anchor rows and its item 3.

Harness: `sha256sum -c` printed all ten OK (rc 0). They are app-down.ps1, app-up-wait.ps1, app-up.ps1, build-exe.sh, busy.ps1, run-suite.sh, tauri.conf.json, shim-wait/npx.cmd, shim/npx.cmd and load.sh. I read run-suite.sh and load.sh whole and changed no harness file.

Exe: `D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe` is 91547648 bytes with sha256 bb4bee07557c7c26df31d5c17cc585f78a00cb1165fce24059b50666b498f41b, as required.

Resources:
- `renderer/bundle-viewer/dist/app.js`: 333011 bytes.
- `renderer/bundle-viewer/dist/index.html`: 6463 bytes.
- `renderer/bundle-viewer/dist/NOTICE.txt`: 163998 bytes.
- `frontends/shell/src/generated/NOTICE.txt`: 3506979 bytes.
- Both `node_modules` folders exist.

Fixture `100k-happy-path.parquet`:
- Before the run: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49.
- After the run: the same size and sha256.
- `cmp` of the two files rc 0.
- Nothing regenerated.

Machine status (step 5 and step 7 readings)
- Before: no SpatialIDE line, `quiet=False`, average 30.3%, peaks-over-25=60 of 60 samples. Another project's shared run was present; that is its `<m>` value.
- After: no SpatialIDE line, `quiet=False`, average 23.8%, peaks-over-25=15 of 60 samples.

Load lines:
- `load fx12-pan-anchor 06:41:27Z 41,19,34`
- `load fx12-pan-anchor-after 06:46:01Z 15,13,16`
- Every reading is under 50, so item 3(d) of the ruling applies. The pass still stands under 3(a); the gate weighs it.

Hold: the call started at 2026-11-14T06:41:24Z. A shared hold was granted with no refusal (exit 96 to 99), and no exit 90 or 94. The hold line reads `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:17352 <m>`. The release line reads `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:17352 affinity=FF (cores 0-7)`. The hard timeout was run-suite's 1500 s, and the call's timeout was 2700 s. `--measure` was not passed.

Run: the log's first line gives start 2026-11-14T06:41:36Z. It ended 06:45:55Z with rc 0 (the call's rc was 0 too).

Byte-copied lines from `<H>/out/m4b-e2e-fx12-pan-anchor.log`:
- First line: `worktree C:/dev/wt/m4b head 6649a443a38763759339c7813e3fdbe9eca09be0 start 2026-11-14T06:41:36Z`
- Check lines (16 PASS, 0 FAIL):
```
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: paint-vs-event dx=85  ::  painted 83.0 vs deck 83.0 -> 0.01 buffer px (tol 4)
PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)
PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=-1200  ::  grab-point residual 0.00 buffer px (tol 4)
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)
PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)
PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=-1200  ::  grab-point residual -0.00 buffer px (tol 4)
```
- `==== 16/16 PASS ====`
- No FAILED, fatal or progress line.
- Last two lines: `==== 16/16 PASS ====` and `rc=0 end 2026-11-14T06:45:55Z`.
- App-down output: `killed tree 81412`, `killed tree 28312`, `port 9223 free`, `port 5400 free`, `copied report tauri.e2e.conf.json`.

Session log: the app's stderr copy names it on its first line, `[spatial-ide-shell] session log: <the app's per-user log folder>/session-1794638501.log`. The copy is `<S>/fx12-pan-anchor.session.log`, 166569 bytes, sha256 575d4381bf54ba19f25d477f635a9b05949171b39ff5750c792dffe614c52677.

`skp.projection_` count in the app.err.log copy: 0.

End state:
- Every process I started was stopped by the harness's app-down. I started no other background process.
- `m4b-e2e-busy.ps1` printed FREE.
- HEAD is 6649a443a38763759339c7813e3fdbe9eca09be0 and the porcelain is empty.
- Nothing was committed, pushed or built.

Departures: none from the brief. One stray `cp` of a nonexistent `.bak` file to /dev/null failed harmlessly. My status-reading commands use a grep that reads only the SpatialIDE count and the reading line's quiet, average and peaks values.

Files in `<S>`: `fx12-fix-before.txt`, `fx12-fix-after.txt`, `fx12-status-before.txt`, `fx12-status-after.txt`, `fx12-load1.txt`, `fx12-load2.txt`, `fx12-hold.txt`, `fx12-release.txt`, `fx12-run.txt`, `fx12-rc.txt`, `fx12-callstart.txt`, `fx12-prior-report.md`, `fx12-pan-anchor.session.log`. `<S>` is `<the custodian's scratchpad>`. The run log is `<S>/m4b-e2e-h/out/m4b-e2e-fx12-pan-anchor.log`.
