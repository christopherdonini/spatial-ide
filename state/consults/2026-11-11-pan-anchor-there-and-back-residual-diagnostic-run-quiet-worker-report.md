*Custodian's filing note (2026-11-11): the worker-high's report on run quiet for slot 2's `pan-anchor-there-and-back-residual-diagnostic`, at main 00bcb07d, from its second brief, given by file (4857 bytes, sha256 372c52485d5ec8eacac132b31372a732fad5a084da54e93f38c2dcf4640d1fcf), sent after slot 1's hand-back at 08:02:44Z and after the custodian's process list at 08:03:04Z showed no heavy process of this repository. Dispatched at 08:03:17Z by its transcript; the run went to 08:15:18Z (claude-sonnet-5-5; unique calls: Read 5, Bash 21, Grep 1, Write 2, Edit 3, the hand-back, 33 in all; no errored call). The custodian dispatched nothing else from 08:03:04Z to the report; its last script before the suite ended at 08:06:49Z, and its calls in the suite's window (08:07:31Z to 08:10:57Z) were text writes in its scratch folder. The report below was extracted by script from the hand-back in that transcript (32176 bytes, sha256 f078afb8a14be51806574061ae7801b175bff7cab5153fd6d71145c785161a71) and is unchanged; one final newline is added. The custodian checked by script: each of the 17 files it gives with a sha256, equal on disk (all kept in the scratch folder, outside the repository); its read script re-run on its inputs, the output's sha256 equal to the one reported, its routes line reading route 2; the worktree at 00bcb07d on the node's local branch, the porcelain empty; no load target. Not briefed: one temporary file written under the shell's /tmp, and a `node --check` of its read script while the suite ran. The page's collection hit its bound in this run, so its gaps are the stall lines the node received. The fields meet route 2 by the worker's reading; note 6's reviewer recomputes them.*

---

Observed: pan-anchor-there-and-back-residual-diagnostic, run quiet at 00bcb07db100c56e672afe99dbe3fe27f2638010

`<S>` is the scratch folder this session gives me, `<H>` is `<S>/dg-e2e-h`, `<M>` is the machine script. I elide user-profile paths with `<…>`.

The run's page record is partial. The page collection hit its 15 s bound, so `dg-quiet.page.json` holds no gaps array, no emissions and no seam records. The closing clock check is also absent. The reading below says for each item whether it rests on the page's record or on the node file alone.

**Step 1: shown**
- Worktree `C:/dev/wt/dg`: HEAD `00bcb07db100c56e672afe99dbe3fe27f2638010`. Branch `cut/pan-anchor-there-and-back-residual-diagnostic`. Porcelain empty.
- `<S>/dg-instrument.patch`: 12221 bytes, sha256 a3e44da80c6d69fbabac220eb579633c205a0a729a1e34e0a2fec4bdca999f7a. Same as the first report.
- Harness files, each as the first brief gave it:
  - `dg-e2e-app-down.ps1`: 880, ea7bd80a5ec9d1c314db49b20aad51aba1a16b962786fc6530344718a2519b26
  - `dg-e2e-app-up-wait.ps1`: 208, 81ac5e4e68f3bc6cca77fbca3ac29f49d0162c8bcdd81247e7e13f1ba88ec185
  - `dg-e2e-app-up.ps1`: 1822, f2e5b3ecce3512f4412bb1048d3010fc75ccc591c7c0d04baba5ae1e27dc1215
  - `dg-e2e-build-exe.sh`: 616, 8c8fa06935f72bf65526bd9064f2ac7677226ad7d9173eb99218ad9ce9fbede1
  - `dg-e2e-busy.ps1`: 983, 134866948a8312611a22c5f304d2c695b29680852c06bb90471a630ba499c6c5
  - `dg-e2e-run-suite.sh`: 1556, 25270e15ef108581a0b5bcb208e07a648c7020d2d0926911211ec35681fdb707
  - `dg-e2e-tauri.conf.json`: 293, 0dc02596e3f90f369be28a70119e4000538d61e694d6945de989afd6f0b163e0
  - `shim/npx.cmd`: 220, d9717837d747cc5897b92c845b2fb7a2247a8142fb15096f9734ba96747ad55e
  - `shim-wait/npx.cmd`: 301, cbaec2daa9171aaa41f1ad2fded68eb8a401e5d5a6ad1705c61c04c1eaf1a87d
- Fixture `target/fixtures/manual-walkthrough/100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. Identical before and after the run.
- Free space: C: 20G (476G size, 96% used). D: 204G (466G size, 57% used). Neither is under the floor.

**Step 2: the quiet check** (one list, before the hold)
- `<S>/dg-quiet.procs-before.txt`: 794 bytes, sha256 c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c. It was taken by `<S>/dg-procs.ps1`, the same lister as run build.
- The list names four node.exe: PIDs 23772, 54352, 62936 and 69844. No cargo, rustc, cl, clang-cl, link, msbuild, vite or app exe was present.
- None of the four command lines names the main checkout or any worktree of this repository. Three run `./server.mjs` or `cua-repl.mjs` from a per-user runtime folder. One runs `host-daemon.mjs` from a per-user runtime folder.
- Nothing was rooted in the repository, so I did not stop.

**Step 3: the run**
- Patch applied with `git apply`. `git diff --stat` showed `frontends/shell/e2e/pan-anchor.mjs | 172 ++++++++++++++++++++++++++++++++++++-` and `1 file changed, 168 insertions(+), 4 deletions(-)`. `git diff | sha256sum` was a3e44da80c6d69fbabac220eb579633c205a0a729a1e34e0a2fec4bdca999f7a, the patch's. `node --check` rc 0.
- `<S>/dg-quiet-run.sh` (995 bytes, sha256 b59c2475af0546cb2f031cdacf7734f7924ce3f77fc67c549fee983f1fd018c8). I wrote it fresh with the Write tool and showed it whole before the run. Whole file, with the `S=` line elided as it holds a user-profile path:
```
#!/bin/bash
# dg run quiet: the suite once at B, no load build. Called inside a shared hold. Stamps go to dg-quiet.stamps.txt.
S=<…scratch folder, in full…>
H=$S/dg-e2e-h
STAMPS=$S/dg-quiet.stamps.txt
AUDIT=$S/dg-quiet.audit.jsonl
st() { local t; t=$(date -u +%FT%TZ); echo "$1 $t" >> "$STAMPS"; echo "stamp: $1 $t"; }
procs() { powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$S/dg-procs.ps1" -Out "$1" > "$1.stdout" 2>&1; echo "procs -> $1 (rc=$?)"; }

[ -e "$STAMPS" ] && { echo "stamps file exists"; exit 94; }
[ -e "$AUDIT" ] && { echo "REFUSED: audit log exists"; exit 92; }
st script-start

cd C:/dev/wt/dg || exit 97

procs "$S/dg-quiet.procs-suite-start.txt"

st suite-start
SPATIAL_IDE_AUDIT_LOG=$AUDIT DG_DIAG_PREFIX=$S/dg-quiet bash "$H/dg-e2e-run-suite.sh" quiet e2e/pan-anchor.mjs 1500
SRC=$?
st suite-end
echo "suite exit code: $SRC"

procs "$S/dg-quiet.procs-suite-end.txt"
exit $SRC
```
- The script has no load-build line. It refuses to start if the stamps file or the audit log exists.
- It was called once, in background mode, inside a shared hold:
  - Shape: `cd <H> && <hold> && bash <S>/dg-quiet-run.sh > <S>/dg-quiet.run.out 2>&1 ; rc=$? ; <release> ; exit $rc`.
  - `-What` was "pan-anchor-there-and-back-residual-diagnostic: run quiet, node e2e/pan-anchor.mjs", `-Minutes 20`, `-MaxWaitMinutes 8`.
  - `--measure` was not passed.
  - The `> dg-quiet.run.out` redirect inside the call is my addition. The file holds the script's own output (562 bytes, sha256 849ffbbfc66e00daf4d9e3cfa4414cf944e4bee4084f59df91d9690f66f9d9fc).
- Hold lines, with `also=` elided:
```
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21380 also=… (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:21380 affinity=FF (cores 0-7)
```
- The call exited 0, and the suite's exit code was 0.
- The script's output, byte-copied:
```
stamp: script-start 2026-11-11T08:07:31Z
procs -> …/dg-quiet.procs-suite-start.txt (rc=0)
stamp: suite-start 2026-11-11T08:07:31Z
killed tree 35316
killed tree 67204
port 9223 free
port 5400 free
copied report tauri.e2e.conf.json
stamp: suite-end 2026-11-11T08:10:57Z
suite exit code: 0
procs -> …/dg-quiet.procs-suite-end.txt (rc=0)
```
(I wrote `…` for the scratch path in the two `procs ->` lines.)

**Step 4: after release**
- `<S>/dg-quiet.procs-after.txt`: 794 bytes, sha256 c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c. It names the same four node.exe: 23772, 54352, 62936 and 69844.
- All four lists (before, suite-start, suite-end, after) are byte-identical. Each is 794 bytes with that same sha256.
- No cargo, rustc, cl, clang-cl, link, msbuild, vite or app exe appeared in any of them.
- No heavy process of step 2's kinds was rooted in the repository after release.
- I also checked the process table by name for cargo, vite and the shell exe. It found none.

**Step 5**
- `git checkout -- frontends/shell/e2e/pan-anchor.mjs`: rc 0. Porcelain empty. `git diff --name-only` empty. HEAD is still `00bcb07d…`. No commit was made.
- The session log is `session-1794384458.log`, in the app's per-user log folder. I copied it right after the run to `<S>/dg-quiet.session.log`: 155847 bytes, sha256 7634e1ed6c892e168de955b1f93b2c56bab1fb287bd89a07e78956580ce202d8.
- Suite log `<H>/out/dg-e2e-quiet.log` (1906 bytes, sha256 3afd0728cd3504509716c278587712336faffe15feed8daae6b705c7b4555b24). First line:
```
worktree C:/dev/wt/dg head 00bcb07db100c56e672afe99dbe3fe27f2638010 start 2026-11-11T08:07:34Z
```
  Every check line:
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
  Last two lines, then `rc=`:
```
==== 16/16 PASS ====
rc=0 end 2026-11-11T08:10:51Z
```
- Between the first line and the checks, the log holds a Node `DEP0190` deprecation warning and a `--- window … ---` header per window size. I did not copy them.
- App-down output (`dg-e2e-quiet.down.txt`, 70 bytes, sha256 aaffe6d1cb6ae2a7bfe467f0d3c7e74a7ee7cb45fd23295acbb9ab3ebaf6cc68):
```
killed tree 35316
killed tree 67204
port 9223 free
port 5400 free
```
  The busy file reads `FREE`.
- `app.err.log` (203 bytes, sha256 3210ca6fca0e595bda0a48a1f75c4d148e81cc6a13b741610ae06664e23a2df6) has two lines, so first and last 20 are the same two (the session-log path elided):
```
[spatial-ide-shell] session log: <…>\logs\session-1794384458.log
[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180
```
- Files copied by the run-suite step into `<H>/out/`: `dg-e2e-quiet.app.err.log` (203), `dg-e2e-quiet.app.out.log` (0), `dg-e2e-quiet.busy.txt` (6), `dg-e2e-quiet.down.txt` (70), `dg-e2e-quiet.log` (1906), `dg-e2e-quiet.rep.tauri.e2e.conf.json` (305), `dg-e2e-quiet.vite.err.log` (0). There was no `app.log` this time.
- The audit log `<S>/dg-quiet.audit.jsonl` was never created.
- Stamps file whole (`dg-quiet.stamps.txt`, 98 bytes, sha256 e9ea0da1560db0eaf3444b2930c5492bd380e020ca8be20259dc518f4490fe63):
```
script-start 2026-11-11T08:07:31Z
suite-start 2026-11-11T08:07:31Z
suite-end 2026-11-11T08:10:57Z
```
- Other files:

| File | Bytes | sha256 |
|---|---|---|
| `dg-quiet.node.jsonl` | 223610 | 7a578da74dbbd3bc7c6c93ac53e6147f9ed297ad3563d1de445d9e90032b7a87 |
| `dg-quiet.page.json` | 230 | 3e5d150cfb337691fa49c70196aba3c67773c3e7be1eeee83a31d9fe62bf8234 |
| `dg-quiet-run.sh` | 995 | b59c2475af0546cb2f031cdacf7734f7924ce3f77fc67c549fee983f1fd018c8 |
| `dg-quiet.procs-*` (four lists) | 794 each | c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c |

- `dg-quiet.page.json` whole (230 bytes). It shows the collection absent:
```
{"clocks":[{"label":"after-install","t0":1794384462676,"p":1794384462677,"t1":1794384462677}],"closing":{"t0":1794384636472,"p":null,"t1":1794384651483},"collect":{"boundReached":true},"node":{"recv":558,"push":558,"writeFail":0}}
```
- The node file's last two events show the same:
```
{"t":1794384636471,"ev":"step","name":"cases-done","tw":1794384636471}
{"t":1794384651483,"ev":"collect","t0":1794384636472,"ok":false,"failed":null,"boundReached":true,"missing":false,"tw":1794384651483}
```
- The collection's single evaluate did not return within the 15011 ms bound that the instrument gives it. That bound is the first patch's choice 2, and it was kept in this run.
- The node file holds 558 `vs-recv`, 558 `vs-push`, 20 `stall-recv`, 16 `record`, 0 `pageerror`, 0 `console-error` and 0 `fatal`.
- The page-side gaps array, the emissions, the seam records and the closing clock check are therefore absent for run quiet. The 20 `[dg-stall]` console lines the node received are the gap record for this run.

**Step 6: the reading over both runs**
- Script `<S>/dg-read2.mjs`: 15511 bytes, sha256 6acdae8f690b2390415ab35f572f80096f2d2a83262d7508f5fa812275a9e415.
- Output `<S>/dg-quiet.read2.txt`: 39078 bytes, sha256 8928ccc18db52c210863e11955494c5ae2ec5dd23fbe7b0c7a837df39349f2b7. It is the output of the script's second execution.
- Fields it reads, per its header comment: both runs' node and page files, both stamps files, and the process lists (four per run for quiet; start and end for build).
- Its first execution stopped at a TypeError, because its first draft assumed a gaps array in the quiet page file. I changed the script, deleted that run's output and ran it again. Both executions only read; neither touched the runs' files.
- The script runs `dg-read.mjs` unchanged (c6868c10d8b6c206517c18c2c5b79605301a4ee73cd06c7ea6504a3abc5870e5) once per run. Then it adds the "OVER BOTH RUNS" section.
- The run-build part of the output (lines 3 to 213 of `dg-quiet.read2.txt`) is byte-identical to `dg-build.read.txt`: 22681 bytes, sha256 cfb7fd413fb9ba3c13fd81fd12b191e6010cdbc8a186f8db243601c804136741. That text is the whole reading printed in my first report. I do not repeat it here.
- Run quiet's `dg-read.mjs` output, whole (it prints this because the page collection is absent):
```
node file events: 1283; page file: present
events: vs-recv 558, vs-push 558, stall-recv 20, setCam-start 14, drag-start 16, record 16, pageerror 0, console-error 0, fatal 0, install seamWrapped=true, collect ok=false

cases seen: 17 (small: pixel-spaces-coincide[PASS]; small: normal-A dx=300[PASS]; small: normal-A dx=-300[PASS]; small: paint-vs-event dx=85[PASS]; small: paint-vs-event dx=-85[PASS]; small: there-and-back-net[PASS]; small: recenter-crossing-A dx=1200[PASS]; small: recenter-crossing-A dx=-1200[PASS]; large: pixel-spaces-coincide[PASS]; large: normal-A dx=300[PASS]; large: normal-A dx=-300[PASS]; large: paint-vs-event dx=250[PASS]; large: paint-vs-event dx=-250[PASS]; large: there-and-back-net[PASS]; large: recenter-crossing-A dx=1200[PASS]; large: recenter-crossing-A dx=-1200[PASS]; (unfinished))

PAGE COLLECTION NOT AVAILABLE: {"boundReached":true}
stall lines received by node: 20; lengths: 207, 206, 232, 209, 207, 219, 233, 5967, 705, 19377, 693, 19344, 714, 20308, 2488, 18126, 696, 18957, 317, 949; at or over 1000 ms: 7
```
- The "OVER BOTH RUNS" section, whole (lines 223 to 319 of the output file):
```
==================== OVER BOTH RUNS ====================

RUN BUILD stamps: script-start 2026-11-11T07:04:49Z; build-start 2026-11-11T07:04:49Z; compiling-line-seen 2026-11-11T07:04:52Z; suite-start 2026-11-11T07:04:54Z; suite-end 2026-11-11T07:13:42Z; build-checked-after 2026-11-11T07:13:44Z; killed 2026-11-11T07:13:44Z; target-removed 2026-11-11T07:13:55Z
  page collection: ok=true boundReached=false; clock checks usable for the mapping: 2 (half-width used 339 ms)
  gap source for this section: the page's collected gaps array; stall lines received by node: 147
  kept gaps 147; at or over 1000 ms: 25
    1002 ms, mapped start 2026-11-11T07:06:13.498Z (t+68.6 s, 79.5 s after the suite-start stamp), end 2026-11-11T07:06:14.500Z; in s:paint-vs-event dx=85 drag#6; inside the suite stamps (+/- half-width +/- 1 s): yes
    8341 ms, mapped start 2026-11-11T07:07:12.809Z (t+128.0 s, 138.8 s after the suite-start stamp), end 2026-11-11T07:07:21.147Z; in s:recenter-crossing-A dx=1200 drag#13; inside the suite stamps (+/- half-width +/- 1 s): yes
    18528 ms, mapped start 2026-11-11T07:07:21.160Z (t+136.3 s, 147.2 s after the suite-start stamp), end 2026-11-11T07:07:39.682Z; in s:recenter-crossing-A dx=1200 drag#13; inside the suite stamps (+/- half-width +/- 1 s): yes
    12163 ms, mapped start 2026-11-11T07:07:40.503Z (t+155.7 s, 166.5 s after the suite-start stamp), end 2026-11-11T07:07:52.662Z; in s:recenter-crossing-A dx=1200 drag#13; inside the suite stamps (+/- half-width +/- 1 s): yes
    10897 ms, mapped start 2026-11-11T07:07:52.821Z (t+168.0 s, 178.8 s after the suite-start stamp), end 2026-11-11T07:08:03.714Z; in s:recenter-crossing-A dx=1200 drag#13; inside the suite stamps (+/- half-width +/- 1 s): yes
    10417 ms, mapped start 2026-11-11T07:08:03.916Z (t+179.1 s, 189.9 s after the suite-start stamp), end 2026-11-11T07:08:14.330Z; in s:recenter-crossing-A dx=1200 drag#13; inside the suite stamps (+/- half-width +/- 1 s): yes
    12203 ms, mapped start 2026-11-11T07:08:14.743Z (t+189.9 s, 200.7 s after the suite-start stamp), end 2026-11-11T07:08:26.942Z; in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14; inside the suite stamps (+/- half-width +/- 1 s): yes
    1484 ms, mapped start 2026-11-11T07:08:26.942Z (t+202.1 s, 212.9 s after the suite-start stamp), end 2026-11-11T07:08:28.425Z; in s:recenter-crossing-A dx=-1200 setCam#14 + s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    7434 ms, mapped start 2026-11-11T07:08:30.786Z (t+205.9 s, 216.8 s after the suite-start stamp), end 2026-11-11T07:08:38.217Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    15443 ms, mapped start 2026-11-11T07:08:38.384Z (t+213.5 s, 224.4 s after the suite-start stamp), end 2026-11-11T07:08:53.822Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    6622 ms, mapped start 2026-11-11T07:08:54.030Z (t+229.2 s, 240.0 s after the suite-start stamp), end 2026-11-11T07:09:00.650Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    10626 ms, mapped start 2026-11-11T07:09:00.801Z (t+236.0 s, 246.8 s after the suite-start stamp), end 2026-11-11T07:09:11.424Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    10423 ms, mapped start 2026-11-11T07:09:11.586Z (t+246.7 s, 257.6 s after the suite-start stamp), end 2026-11-11T07:09:22.006Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    11496 ms, mapped start 2026-11-11T07:09:22.167Z (t+257.3 s, 268.2 s after the suite-start stamp), end 2026-11-11T07:09:33.659Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    10594 ms, mapped start 2026-11-11T07:09:33.825Z (t+269.0 s, 279.8 s after the suite-start stamp), end 2026-11-11T07:09:44.416Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    11740 ms, mapped start 2026-11-11T07:09:44.615Z (t+279.8 s, 290.6 s after the suite-start stamp), end 2026-11-11T07:09:56.351Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    1736 ms, mapped start 2026-11-11T07:09:57.458Z (t+292.6 s, 303.5 s after the suite-start stamp), end 2026-11-11T07:09:59.193Z; in l:normal-A dx=300 setCam#16; inside the suite stamps (+/- half-width +/- 1 s): yes
    35874 ms, mapped start 2026-11-11T07:10:49.476Z (t+344.6 s, 355.5 s after the suite-start stamp), end 2026-11-11T07:11:25.338Z; in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25; inside the suite stamps (+/- half-width +/- 1 s): yes
    12935 ms, mapped start 2026-11-11T07:11:43.725Z (t+398.9 s, 409.7 s after the suite-start stamp), end 2026-11-11T07:11:56.656Z; in l:recenter-crossing-A dx=1200 drag#28; inside the suite stamps (+/- half-width +/- 1 s): yes
    9530 ms, mapped start 2026-11-11T07:11:56.788Z (t+411.9 s, 422.8 s after the suite-start stamp), end 2026-11-11T07:12:06.315Z; in l:recenter-crossing-A dx=1200 drag#28; inside the suite stamps (+/- half-width +/- 1 s): yes
    5401 ms, mapped start 2026-11-11T07:12:06.473Z (t+421.6 s, 432.5 s after the suite-start stamp), end 2026-11-11T07:12:11.872Z; in l:recenter-crossing-A dx=1200 drag#28; inside the suite stamps (+/- half-width +/- 1 s): yes
    5714 ms, mapped start 2026-11-11T07:12:12.064Z (t+427.2 s, 438.1 s after the suite-start stamp), end 2026-11-11T07:12:17.776Z; in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29; inside the suite stamps (+/- half-width +/- 1 s): yes
    1767 ms, mapped start 2026-11-11T07:12:17.776Z (t+432.9 s, 443.8 s after the suite-start stamp), end 2026-11-11T07:12:19.543Z; in l:recenter-crossing-A dx=-1200 setCam#29 + l:recenter-crossing-A dx=-1200 drag#30; inside the suite stamps (+/- half-width +/- 1 s): yes
    5206 ms, mapped start 2026-11-11T07:13:03.426Z (t+478.6 s, 489.4 s after the suite-start stamp), end 2026-11-11T07:13:08.631Z; in l:recenter-crossing-A dx=-1200 drag#30; inside the suite stamps (+/- half-width +/- 1 s): yes
    16210 ms, mapped start 2026-11-11T07:13:08.818Z (t+484.0 s, 494.8 s after the suite-start stamp), end 2026-11-11T07:13:25.022Z; in l:recenter-crossing-A dx=-1200 drag#30; inside the suite stamps (+/- half-width +/- 1 s): yes
  view-state lines (node file): receipts with >=3 args 558, pushes 558; [receipt, push] overlaps a kept gap by more than the half-width: yes 7; edge 80; no 471
    the five longest receipt-to-push intervals (ms): n550: 22068 [no]; n119: 4543 [no]; n544: 2129 [yes]; n558: 1995 [yes]; n265: 1766 [yes]
  setCam node intervals [setCam-start, setCam-return] (the node's own clock, not the page's seam interval) overlapping a kept gap: yes 4; no 10; durations (ms): 1:556 3:572 5:527 7:640 9:616 12:704 14:1115* 16:1855* 18:629 20:627 22:649 24:626* 27:622 29:1402*
  there-and-back cases finished (small, large): true, true; record events 16; fatal events 0

RUN QUIET stamps: script-start 2026-11-11T08:07:31Z; suite-start 2026-11-11T08:07:31Z; suite-end 2026-11-11T08:10:57Z
  page collection: ok=false boundReached=true; clock checks usable for the mapping: 1 (half-width used 0.5 ms)
  gap source for this section: the [dg-stall] console lines received by the node (the page collection is absent); stall lines received by node: 20
  kept gaps 20; at or over 1000 ms: 7
    5967 ms, mapped start 2026-11-11T08:08:12.274Z (t+37.1 s, 41.3 s after the suite-start stamp), end 2026-11-11T08:08:18.241Z; in s:there-and-back-net setCam#9 + s:there-and-back-net drag#10; inside the suite stamps (+/- half-width +/- 1 s): yes
    19377 ms, mapped start 2026-11-11T08:08:26.401Z (t+51.2 s, 55.4 s after the suite-start stamp), end 2026-11-11T08:08:45.778Z; in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14; inside the suite stamps (+/- half-width +/- 1 s): yes
    19344 ms, mapped start 2026-11-11T08:08:47.589Z (t+72.4 s, 76.6 s after the suite-start stamp), end 2026-11-11T08:09:06.933Z; in s:recenter-crossing-A dx=-1200 drag#15; inside the suite stamps (+/- half-width +/- 1 s): yes
    20308 ms, mapped start 2026-11-11T08:09:07.837Z (t+92.6 s, 96.8 s after the suite-start stamp), end 2026-11-11T08:09:28.145Z; in l:normal-A dx=300 setCam#16 + l:normal-A dx=300 drag#17; inside the suite stamps (+/- half-width +/- 1 s): yes
    2488 ms, mapped start 2026-11-11T08:09:45.273Z (t+130.1 s, 134.3 s after the suite-start stamp), end 2026-11-11T08:09:47.761Z; in l:paint-vs-event dx=-250 drag#23; inside the suite stamps (+/- half-width +/- 1 s): yes
    18126 ms, mapped start 2026-11-11T08:09:48.924Z (t+133.7 s, 137.9 s after the suite-start stamp), end 2026-11-11T08:10:07.050Z; in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25; inside the suite stamps (+/- half-width +/- 1 s): yes
    18957 ms, mapped start 2026-11-11T08:10:15.234Z (t+160.0 s, 164.2 s after the suite-start stamp), end 2026-11-11T08:10:34.191Z; in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29; inside the suite stamps (+/- half-width +/- 1 s): yes
  all 20 kept gaps of this run, by window:
    g1 t+15.416 s len 207 ms tick 143 vis visible: between steps
    g2 t+18.329 s len 206 ms tick 174 vis visible: between steps
    g3 t+18.916 s len 232 ms tick 179 vis visible: between steps
    g4 t+19.663 s len 209 ms tick 186 vis visible: between steps
    g5 t+22.480 s len 207 ms tick 216 vis visible: between steps
    g6 t+22.947 s len 219 ms tick 222 vis visible: between steps
    g7 t+23.898 s len 233 ms tick 231 vis visible: between steps
    g8 t+37.066 s len 5967 ms tick 463 vis visible: in s:there-and-back-net setCam#9 + s:there-and-back-net drag#10
    g9 t+50.487 s len 705 ms tick 612 vis visible: in s:recenter-crossing-A dx=1200 drag#13
    g10 t+51.193 s len 19377 ms tick 613 vis visible: in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14
    g11 t+71.688 s len 693 ms tick 632 vis visible: in s:recenter-crossing-A dx=-1200 drag#15
    g12 t+72.380 s len 19344 ms tick 633 vis visible: in s:recenter-crossing-A dx=-1200 drag#15
    g13 t+91.915 s len 714 ms tick 638 vis visible: in l:normal-A dx=300 setCam#16
    g14 t+92.629 s len 20308 ms tick 639 vis visible: in l:normal-A dx=300 setCam#16 + l:normal-A dx=300 drag#17
    g15 t+130.065 s len 2488 ms tick 956 vis visible: in l:paint-vs-event dx=-250 drag#23
    g16 t+133.715 s len 18126 ms tick 976 vis visible: in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25
    g17 t+159.329 s len 696 ms tick 1123 vis visible: in l:recenter-crossing-A dx=1200 drag#28
    g18 t+160.025 s len 18957 ms tick 1124 vis visible: in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29
    g19 t+179.171 s len 317 ms tick 1129 vis visible: in l:recenter-crossing-A dx=-1200 drag#30
    g20 t+180.215 s len 949 ms tick 1144 vis visible: in l:recenter-crossing-A dx=-1200 drag#30
  view-state lines (node file): receipts with >=3 args 558, pushes 558; [receipt, push] overlaps a kept gap by more than the half-width: yes 8; edge 2; no 548
    the five longest receipt-to-push intervals (ms): n266: 956 [yes]; n558: 945 [yes]; n545: 715 [yes]; n280: 703 [yes]; n265: 693 [yes]
  setCam node intervals [setCam-start, setCam-return] (the node's own clock, not the page's seam interval) overlapping a kept gap: yes 5; no 9; durations (ms): 1:527 3:514 5:514 7:556 9:566* 12:543 14:18729* 16:895* 18:557 20:542 22:548 24:558* 27:542 29:18289*
  there-and-back cases finished (small, large): true, true; record events 16; fatal events 0

BUILD OVERLAP (run build): processes naming dg-load in the suite-start list: 6 (rustc.exe); in the suite-end list: 8 (clang-cl.exe)
  stamps: compiling-line-seen 2026-11-11T07:04:52Z before suite-start 2026-11-11T07:04:54Z; suite-end 2026-11-11T07:13:42Z before build-checked-after 2026-11-11T07:13:44Z and killed 2026-11-11T07:13:44Z
  the build's overlap shown (its processes in both lists, compiling-line stamp before suite-start, kill stamp after suite-end): YES
  long stalls (>= 1000 ms) in run build inside the shown overlap: 25 of 25

QUIET CONDITION (run quiet): each list, by kind (the repository's roots: the main checkout and the worktrees under C:/dev/wt/; "mine" = this run's own worktree, harness and exe)
  dg-quiet.procs-before.txt: 4 processes; heavy-kind not mine 0; node naming a repo path, not mine 0; node naming no repo path 4; mine 0
  dg-quiet.procs-suite-start.txt: 4 processes; heavy-kind not mine 0; node naming a repo path, not mine 0; node naming no repo path 4; mine 0
  dg-quiet.procs-suite-end.txt: 4 processes; heavy-kind not mine 0; node naming a repo path, not mine 0; node naming no repo path 4; mine 0
  dg-quiet.procs-after.txt: 4 processes; heavy-kind not mine 0; node naming a repo path, not mine 0; node naming no repo path 4; mine 0
  the quiet condition by these four lists (no heavy-kind process of another run, no node naming a repo path other than this run's): SHOWN
  (the custodian's dispatch record, the other half of the condition in the form's note 3, is not a file this script reads)
  long stalls (>= 1000 ms) in run quiet: 7 (inside the suite stamps: 7)

GRADING per window size (the 2026-11-10 grading), per run, from the lines dg-read.mjs printed above
  run build, small: page net 0.00 buffer px [within]; suite net 0.00 [within]; s0 reads that were not the page's reset line: 1; s1 reads that were not the page's last line: 2; unmatched reads: 0
      page net outside the tolerance: no; page net within while the suite's net is not: no; any s0 or s1 read not the page's own line: YES
  run build, large: page net 1.00 buffer px [within]; suite net 1.00 [within]; s0 reads that were not the page's reset line: 1; s1 reads that were not the page's last line: 2; unmatched reads: 0
      page net outside the tolerance: no; page net within while the suite's net is not: no; any s0 or s1 read not the page's own line: YES
  run quiet, small: NOT GRADED against the page's own lines (the page's emitted lines were not collected; dg-read.mjs printed no there-and-back line). The suite's own record, from the node file: "net residual 0.00 buffer px (tol 4)", PASS
  run quiet, large: NOT GRADED against the page's own lines (the page's emitted lines were not collected; dg-read.mjs printed no there-and-back line). The suite's own record, from the node file: "net residual 1.00 buffer px (tol 4)", PASS

ROUTES (the form's note 4; the human's message of 2026-11-11, item 2)
  long stalls beside the build (run build, inside the shown overlap): 25
  long stalls in run quiet: 7; quiet condition shown by the lists: true
  a run that ended before there-and-back: no
  route 1 condition (at least one long stall beside the build and none in a quiet run): not met
  route 2 condition (at least one long stall in a quiet run): MET
  route 3 condition (anything else): not met
  the fields meet: route 2
```
- The condition the fields meet is route 2: at least one stall of a second or more in a quiet run, with the quiet condition shown by the four process lists.
  - Run quiet: 7 stalls of 1000 ms or more, among 20 kept gaps. The lengths are 5967, 19377, 19344, 20308, 2488, 18126 and 18957 ms.
  - Run build: 25 of 147 gaps, all inside the build's shown overlap.
  - The other half of the quiet condition is the custodian's dispatch record. The script does not read it.
- Grading limits:
  - Run build was graded against the page's own lines. Its page nets were 0.00 (small) and 1.00 (large), both within the tolerance of 4. The suite's nets equalled them. Per window size one s0 read and two s1 reads were not the page's own lines.
  - Run quiet could not be graded against the page's own lines, because the page's emissions were not collected. The suite's own records are 0.00 (small) and 1.00 (large), PASS.
- Differences between the two runs' record:
  - Run quiet has the suite at 16/16 PASS. Run build has 14/16, with both `recenter-crossing-A dx=-1200` FAIL.
  - Run quiet's gap lengths and windows are read from the node's console receipts with one clock check (half-width 0.5 ms). Run build's come from the page's array with two checks (half-width 339 ms).
  - Where I compared the two sources on run build, the counts agree: 147 gaps and 147 lines received.
- I give no cause, no fix and no rate.

**Harness disclosure**
- This is the port-5400 harness under item 1 of the 2026-10-11 approval, the same as run build. The debug exe is the one built on `D:/wt-targets/dg` with the TAURI_CONFIG overlay. CDP is on 9223, and localhost:5180 maps to 127.0.0.1:5400. Vite ran on 5400 with `--strictPort`, and the npx shim was first on PATH for this run only. Port 5180 was untouched.
- Places it wrote:
  - `<H>/out/` and `<H>`'s own pid, vite, app and shim files.
  - `C:/dev/wt/dg`'s gitignored `e2e/out/`.
  - `<S>` files named `dg-quiet*` and `dg-read2.mjs`.
  - The app's own per-user log folder and webview data.
- `D:/wt-targets/dg-load` was not created. No cargo build ran.
- No tracked file changed except `pan-anchor.mjs`, which was reverted. Porcelain is empty and HEAD is still B.

**Background shells and model**
- The one background shell I started (the hold call) exited 0 and completed on its own. A bounded wait loop of 62 two-second turns (hard-bounded at 280) ran in the foreground. No process of mine is running. I killed none by PID.
- Left in place for the gate, as ordered: the worktree `C:/dev/wt/dg`, its local branch `cut/pan-anchor-there-and-back-residual-diagnostic`, and `D:/wt-targets/dg`.
- Model as the harness reports it: Sonnet 5.5 (`claude-sonnet-5-5`). No model override, and no context handoff received or produced.

**Pre-gate self-check**
- Cross-module code: none was written. The run uses the patch from run build unchanged, hash-checked.
- Completion claims: each rests on a file or output above, with its hash. Two items are not observed: why the collection's evaluate did not return, and what the page was doing then.
- User-facing messages: none were added.
- Required test reaches its assertion: no test was added. The 16 PASS lines are the suite's own.
- Nothing was committed, pushed, retried or fixed.
