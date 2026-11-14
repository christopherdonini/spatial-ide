*Custodian's filing note (2026-11-11): the worker-high's report on run build for slot 2's `pan-anchor-there-and-back-residual-diagnostic`, at main 00bcb07d. Its brief was given by file (16310 bytes, sha256 28a13bd8d02d571106756985c50ae4af24237f8059a14711f0ee63fffdca365d). Dispatched at 06:40:19Z by its transcript; the run went to 07:20:45Z (claude-sonnet-5-5; unique calls: Read 14, Bash 68, Edit 16, Write 5, the hand-back, 104 in all). One call errored: an Edit of the suite file at 06:46:38Z, refused by the tool because the file had not been read in that run first. The report below was extracted by script from the hand-back in that transcript (38951 bytes, sha256 4082158df890a49fd124f265e60838045452d5a379ff8d5576829a264c715a9f) and is unchanged; one final newline is added. The custodian checked by script: each of the 15 files the report gives with a sha256, recomputed from disk and equal (all kept in the scratch folder, outside the repository); its read script re-run on the two diag files, its output's sha256 equal to the one reported; the worktree at 00bcb07d on the node's local branch with empty porcelain; the load build's target absent. By its own report, three steps the brief did not name: a `cargo fetch --locked --offline` in the worktree; a headless check of the instrument's helper block against a stub page, using no port; a second read script written and never run. Its process list before the run shows the custodian's own gate of commit 1111d running node tests in the main checkout. This is run build's first reading, alone; no route is read from it before run quiet.*

---

Observed: pan-anchor-there-and-back-residual-diagnostic, run build at 00bcb07db100c56e672afe99dbe3fe27f2638010

`<S>` is the scratch folder this session gives me, `<H>` is `<S>/dg-e2e-h`, `<M>` is the machine script. I elide user-profile paths with `<…>`. Every other path is as written.

**Preconditions**
- After `git fetch -q origin`, the form at B is 6a741cb2b2195072b4bd7f23d7f102e265ebc0fca8e5d0a51edc45d62f8deba7. `merge-base --is-ancestor` exit 0, and `origin/main` is B. `git diff --name-only c56996b7… B -- frontends/` printed nothing.
- Disk: C: 20G free, D: 211G free. Neither is under the floor.
- Worktree: `git worktree add -b cut/pan-anchor-there-and-back-residual-diagnostic C:/dev/wt/dg B` made the worktree at B. Nothing was committed or pushed.
- `npm ci` in `frontends/shell` and in `renderer/bundle-viewer`: both exit 0 (each ended with only the allow-scripts warning for esbuild).
- bundle-viewer `npm run build` in a shared hold: rc 0. Last lines: "scan-dist: 3 files scanned, 2 findings, all reviewed; record written", "reviewed row NOTICE.txt credential 19092: matched", "reviewed row NOTICE.txt local-filesystem-path 111337: matched", "reviewed row app.js local-filesystem-path 7291: not found".
- shell `npm run generate:notice` in a shared hold: rc 0. It wrote a provisional NOTICE: "src/generated/NOTICE.txt (3427745 bytes)".
- Porcelain empty after both builds.
- Every `resources` path exists: `dist/NOTICE.txt` 163998, `dist/app.js` 333011, `dist/index.html` 6463, `viewer-asset-hashes.json` 261, `src/generated/NOTICE.txt` 3427745.
- `cargo fetch --locked --offline` in the worktree: rc 0. I ran it so that the load build needed no network.

**Harness files and fixture**
- All nine files matched the given sizes and sha256 (880, 208, 1822, 616, 983, 1556, 293, 220, 301 bytes). I read each whole and changed none.
- Fixture `target/fixtures/manual-walkthrough/100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. Identical before the exe build, before the run, and after the run. I only read it.

**Exe build** (shared hold, background)
- Last lines: "Compiling spatial-engine…", "Compiling spatial-kernel…", "Finished `dev` profile [unoptimized + debuginfo] target(s) in 19m 47s", "copied exe", then `exe_rc=0`.
- `D:/wt-targets/dg/exes/spatial-ide-shell-dg.exe` is 90899456 bytes, mtime 2026-11-11 08:02:46 +0100.

**Instrument**
- Patch `<S>/dg-instrument.patch`: 12221 bytes, sha256 a3e44da80c6d69fbabac220eb579633c205a0a729a1e34e0a2fec4bdca999f7a.
- Only `frontends/shell/e2e/pan-anchor.mjs` changed, with 168 insertions and 4 deletions.
- `node --check` passed. I printed the whole patch during the work.
- I applied it for the run, and `git diff | sha256sum` equalled the patch's. Reverted with `git checkout --`, and porcelain was empty both times (after saving the patch, and after the run).
- Choices I made where note 1 left one:
  1. The scratch path comes from the env var `DG_DIAG_PREFIX`, set to `<S>/dg-build` by my run script. The patch has no path in it. Files are created with flag `wx`, so an existing name is refused.
  2. The closing clock check is inside the one collection `page.evaluate` (the page's `Date.now()` is its first field). That evaluate is raced against a 15 s bound.
  3. The node listener is registered right after `setup()` and before the install call. Receipts are linked to pushes by position. I did not wrap the JSHandle. A receipt with fewer than 3 args is recorded as `nargs`. A receipt whose `jsonValue` threw is not observed directly. The reader finds it from count and field misalignment (none occurred).
  4. The seam wrapper records `tRet` (synchronous return) and `tRes` (promise settle). It also records `seq0` and `seq1`, the emission counter at call and return, so the seam's own lines are exact.
  5. The patch also adds `step` markers, a `record` event per suite case (for window naming), and `drag-up`, `drag-settled` and `drag-end` events.
  6. A node-side `vs` snapshot is taken at each `setCam` return, each `last` read, and between the two there-and-back drags.
- Before the run I checked the helper block alone against a stub page in Playwright's own headless Chromium. This was not the suite, used no port, and is not a repeated run. Its files are `<S>/dg-itest*`. It showed install, wrapper, stall line, collection, and refusal of a second init.
- I wrote `dg-read-patch.mjs` and never ran it. It is a leftover in `<S>`.

**Processes before the run** (`<S>/dg-build.procs-before.txt`, 4580 bytes, sha256 b5c084a99757eefda4cfc3799cf023072f7642097eb8c8aac6c5cf6c6e19464c)
- Ancestor chains: `<S>/dg-build.procs-before.ancestors.txt`, sha256 f670eb555bbfd166a40c3522021297328dea526393747d5441cb50472095aa0b.
- Rooted in `C:/dev/wt/b2c` (slot 1's current run): cargo.exe 55640 and 74484, `cargo test --locked --features spatial-engine/fixture`. The bash command that started them reads `cd C:/dev/wt/b2c … hold shared … "b2-piece-1c P2: cargo test"`. They were still alive at my suite's start. They were gone by the suite's end list. The mtime of their rc file in `<S>`, which I read only, is 08:11:28 +0100, which is 07:11:28Z. That is inside the suite window (07:04:54Z to 07:13:42Z).
- Rooted in the main checkout: node.exe 58244 (`node --test scripts/plan/…`) with children 23052, 37916 and 81468. Their ancestor is `gate.sh`, which does `cd /c/dev/spatial-ide`.
- No process was rooted in any other worktree.
- Four more node.exe processes are outside this repository.
- Suite-start list (`dg-build.procs-suite-start.txt`, 8066 bytes, sha256 7b560224d0d10282967d0e4eb9292803f81a7f1e6740e1ab4d8d63c877a1304c): cargo.exe ×4 (my build's two, b2c's two), rustc.exe ×6, node.exe ×4. Six processes name `dg-load`.
- Suite-end list (`dg-build.procs-suite-end.txt`, 37317 bytes, sha256 2310ef9b1c28cd1245764cfd35dca5cb1425b74b3c539e7f1ee27eb1e7cfbbc8): my cargo ×2, clang-cl ×8 (all naming `dg-load`), node.exe ×6. Two of the node.exe are `npm run check:dev-origin` and `npm run verify`; their roots are not visible in the command line.
- After-kill list (`dg-build.procs-after-kill.txt`, 5216 bytes, sha256 7e32494dcbd3440c4579d4721410da4e9740e57dcf4975d352f521f382210c36): zero processes name `dg-load`. The survivors are rooted in `C:/dev/wt/b2c` (rustc ×2 and link.exe for its `scan-dist`) and in the main checkout.

**Run build** (`<S>/dg-build-run.sh`, 3057 bytes, sha256 b5d2238b4b523b6eaad009f5f034dd97107f3da04c737c22a5cc2f648c1e0941; the suite's exit code was 1)

Stamps file whole (317 bytes, sha256 f7a9f4daa13434f3a1561eed4fcd02817c93ce4c8f7b0cf0a4d3b26e0d526239):
```
script-start 2026-11-11T07:04:49Z
build-start 2026-11-11T07:04:49Z
build msys pid 31987, windows pid 47752
compiling-line-seen 2026-11-11T07:04:52Z
suite-start 2026-11-11T07:04:54Z
suite-end 2026-11-11T07:13:42Z
build-checked-after 2026-11-11T07:13:44Z
killed 2026-11-11T07:13:44Z
target-removed 2026-11-11T07:13:55Z
```
- Free space on D: was 204G before the load build. `clang-cl` is `/c/Program Files/LLVM/bin/clang-cl`.
- First Compiling line: `   Compiling proc-macro2 v1.0.107`.
- Build liveness at the suite's start: "build ALIVE (msys pid 31987)". At the suite's end: "build ALIVE at suite end". The build did not end during the run.
- The cargo log's mtime is 08:07 local (07:07Z). Its last Compiling line is spatial-data-plane. Its last 5 lines:
```
   Compiling futures v0.3.33
   Compiling parquet v58.4.0
   Compiling spatial-skp v0.0.0 (C:\dev\wt\dg\protocol\skp)
   Compiling spatial-renderer v0.0.0 (C:\dev\wt\dg\renderer)
   Compiling spatial-data-plane v0.0.0 (C:\dev\wt\dg\protocol\data-plane)
```
- Log file `dg-build.cargo.log`: 7073 bytes, sha256 949dd33ab6ce865db110b497452abdf36a38203dd08874f78ba66159daea856e.
- Kill: `taskkill //T //F //PID 47752` killed 13 processes and reported two errors (PIDs 30328 and 17464: "operation not supported" and "no running instance"), rc 128. Afterwards the after-kill list had zero `dg-load` processes, "msys pid 31987 gone", and "load target absent" (`D:/wt-targets/dg-load`).
- `D:/wt-targets/dg` (the exe build's target) remains.
- Harness busy check: `FREE`. Hard timeout 1500 s was not reached.

Suite log `<H>/out/dg-e2e-build.log` (1992 bytes, sha256 6d5b694f0d44c2e716eebd54a37004e0a963f5aa3f6f94fa75fff7a02b95eef2). First line, byte-copied:
```
worktree C:/dev/wt/dg head 00bcb07db100c56e672afe99dbe3fe27f2638010 start 2026-11-11T07:05:02Z
```
Every check line:
```
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: paint-vs-event dx=85  ::  painted 83.5 vs deck 83.0 -> 0.53 buffer px (tol 4)
PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)
PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)
PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)
PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
```
Last two lines and `rc=`:
```
==== 14/16 PASS ====
FAILED: small: recenter-crossing-A dx=-1200, large: recenter-crossing-A dx=-1200
rc=1 end 2026-11-11T07:13:28Z
```
- The suite exited 1 with no fatal line. Both FAIL lines are recorded as observed.

App-down output, byte-copied. It is not "both ports free":
```
killed tree 67292
killed tree 73744
port 9223 still listening, owner pid 79056
port 5400 free
```
- About 15 minutes later a listen check on 9223, 5400 and 5180 found nothing listening, and no process of mine was left. I did not stop anything holding a port.
- Reports copied by the run-suite step: `app.log` and `tauri.e2e.conf.json`, as `dg-e2e-build.rep.app.log` (0 bytes) and `dg-e2e-build.rep.tauri.e2e.conf.json`. Also copied: `dg-e2e-build.app.err.log`, `dg-e2e-build.app.out.log` (0 bytes) and `dg-e2e-build.vite.err.log` (0 bytes).
- `app.err.log` (203 bytes, sha256 e35584cc4e4a29f7fa39414bcd5a69db5a1e62c9f60637723d05a8c78f41c99c) has two lines, so first and last 20 are the same two:
```
[spatial-ide-shell] session log: <…>\logs\session-1794380716.log
[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180
```
- Session log copied to `<S>/dg-build.session.log`: 350026 bytes, sha256 6c63477c9658583b9b7fc9da353f3ec1d6ec43b9d35d69cbdc50cea214e0a599.
- Audit log: `<S>/dg-build.audit.jsonl` was never created. Only the publish path writes it, and this suite does not publish.
- Diag files:
  - `dg-build.node.jsonl`: 242358 bytes, sha256 bab6a4febdb6ca55e81ce5ae920fd855583525ea8bc45f299d3aafed47df189d.
  - `dg-build.page.json`: 79764 bytes, sha256 d2fef64ba235dcee08e37e0267f68a2b6836663f70200c711aa06117bb0a413f.
  - Collection `ok=true`, 0 pageerror, 0 console errors, 0 write failures, wrapper still installed at collection.

**Step 6: first reading**
- Script `<S>/dg-read.mjs`: 16130 bytes, sha256 c6868c10d8b6c206517c18c2c5b79605301a4ee73cd06c7ea6504a3abc5870e5. It names no route.
- It reads only the two diag files. The fields are listed in its header comment.
- Output `<S>/dg-build.read.txt`: 22681 bytes, sha256 cfb7fd413fb9ba3c13fd81fd12b191e6010cdbc8a186f8db243601c804136741. Whole output:
```
node file events: 1410; page file: present
events: vs-recv 558, vs-push 558, stall-recv 147, setCam-start 14, drag-start 16, record 16, pageerror 0, console-error 0, fatal 0, install seamWrapped=true, collect ok=true

cases seen: 17 (small: pixel-spaces-coincide[PASS]; small: normal-A dx=300[PASS]; small: normal-A dx=-300[PASS]; small: paint-vs-event dx=85[PASS]; small: paint-vs-event dx=-85[PASS]; small: there-and-back-net[PASS]; small: recenter-crossing-A dx=1200[PASS]; small: recenter-crossing-A dx=-1200[FAIL]; large: pixel-spaces-coincide[PASS]; large: normal-A dx=300[PASS]; large: normal-A dx=-300[PASS]; large: paint-vs-event dx=250[PASS]; large: paint-vs-event dx=-250[PASS]; large: there-and-back-net[PASS]; large: recenter-crossing-A dx=1200[PASS]; large: recenter-crossing-A dx=-1200[FAIL]; (unfinished))
clock check after-install: node-minus-page offset in [-91, 297] ms, midpoint 103, half-width 194
clock check closing: node-minus-page offset in [-388, 290] ms, midpoint -49, half-width 339
half-width used: 339 ms (the larger of the checks'); midpoints differ by 152 ms; the mapping interpolates the midpoints linearly in node time

(i) KEPT GAPS (page heartbeat 50 ms, kept over 200 ms): 147; page ticks 3107; stall lines received by node: 147
  (times below: node seconds since the init event at epoch ms 1794380704849; the gaps are page times mapped to node time)
  g1 t+30.194 s len 308 ms vis visible tick 1: between steps
  g2 t+30.628 s len 274 ms vis visible tick 3: between steps
  g3 t+31.849 s len 212 ms vis visible tick 19: between steps (at the edge of s:normal-A dx=300 setCam#1, s:normal-A dx=300 drag#2)
  g4 t+32.442 s len 425 ms vis visible tick 25: in s:normal-A dx=300 drag#2 (at the edge of s:normal-A dx=300 setCam#1)
  g5 t+41.639 s len 320 ms vis visible tick 185: between steps
  g6 t+42.116 s len 203 ms vis visible tick 188: between steps
  g7 t+43.007 s len 204 ms vis visible tick 194: between steps
  g8 t+43.497 s len 262 ms vis visible tick 198: between steps
  g9 t+44.208 s len 212 ms vis visible tick 202: between steps
  g10 t+44.694 s len 219 ms vis visible tick 206: between steps
  g11 t+44.971 s len 230 ms vis visible tick 208: between steps
  g12 t+45.201 s len 231 ms vis visible tick 209: between steps
  g13 t+46.110 s len 275 ms vis visible tick 216: between steps
  g14 t+46.385 s len 337 ms vis visible tick 217: between steps
  g15 t+47.438 s len 316 ms vis visible tick 225: between steps
  g16 t+47.753 s len 256 ms vis visible tick 226: between steps
  g17 t+48.585 s len 373 ms vis visible tick 232: between steps
  g18 t+49.136 s len 205 ms vis visible tick 234: between steps
  g19 t+49.341 s len 282 ms vis visible tick 235: between steps
  g20 t+49.968 s len 316 ms vis visible tick 239: between steps
  g21 t+50.628 s len 217 ms vis visible tick 242: between steps
  g22 t+51.460 s len 275 ms vis visible tick 247: between steps
  g23 t+51.735 s len 208 ms vis visible tick 248: between steps
  g24 t+51.943 s len 275 ms vis visible tick 249: between steps
  g25 t+52.570 s len 368 ms vis visible tick 254: between steps
  g26 t+53.021 s len 410 ms vis visible tick 256: between steps
  g27 t+53.431 s len 327 ms vis visible tick 257: between steps
  g28 t+53.887 s len 217 ms vis visible tick 260: between steps
  g29 t+54.104 s len 250 ms vis visible tick 261: between steps
  g30 t+54.354 s len 356 ms vis visible tick 262: between steps
  g31 t+54.710 s len 226 ms vis visible tick 263: between steps
  g32 t+55.073 s len 217 ms vis visible tick 265: between steps
  g33 t+55.290 s len 244 ms vis visible tick 266: between steps
  g34 t+55.534 s len 377 ms vis visible tick 267: between steps
  g35 t+55.911 s len 222 ms vis visible tick 268: between steps
  g36 t+56.133 s len 560 ms vis visible tick 269: between steps
  g37 t+56.820 s len 214 ms vis visible tick 271: between steps
  g38 t+57.034 s len 478 ms vis visible tick 272: between steps
  g39 t+57.512 s len 387 ms vis visible tick 273: between steps
  g40 t+57.899 s len 218 ms vis visible tick 274: between steps
  g41 t+58.117 s len 242 ms vis visible tick 275: between steps
  g42 t+58.604 s len 228 ms vis visible tick 278: between steps
  g43 t+58.990 s len 208 ms vis visible tick 280: between steps
  g44 t+59.198 s len 377 ms vis visible tick 281: between steps
  g45 t+59.745 s len 224 ms vis visible tick 283: between steps
  g46 t+60.166 s len 243 ms vis visible tick 286: between steps
  g47 t+60.409 s len 259 ms vis visible tick 287: between steps
  g48 t+60.668 s len 365 ms vis visible tick 288: between steps
  g49 t+61.553 s len 373 ms vis visible tick 293: between steps
  g50 t+61.926 s len 292 ms vis visible tick 294: between steps
  g51 t+62.218 s len 211 ms vis visible tick 295: between steps
  g52 t+62.429 s len 314 ms vis visible tick 296: between steps
  g53 t+62.743 s len 287 ms vis visible tick 297: between steps
  g54 t+63.488 s len 337 ms vis visible tick 301: between steps
  g55 t+64.560 s len 364 ms vis visible tick 308: between steps
  g56 t+64.924 s len 222 ms vis visible tick 309: between steps
  g57 t+65.339 s len 370 ms vis visible tick 311: between steps
  g58 t+66.333 s len 581 ms vis visible tick 322: between steps
  g59 t+66.914 s len 579 ms vis visible tick 323: between steps
  g60 t+68.054 s len 330 ms vis visible tick 330: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g61 t+68.384 s len 266 ms vis visible tick 331: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g62 t+68.650 s len 1002 ms vis visible tick 332: in s:paint-vs-event dx=85 drag#6
  g63 t+69.683 s len 307 ms vis visible tick 334: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g64 t+69.990 s len 211 ms vis visible tick 335: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g65 t+70.201 s len 344 ms vis visible tick 336: in s:paint-vs-event dx=85 drag#6
  g66 t+71.332 s len 268 ms vis visible tick 350: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g67 t+71.600 s len 203 ms vis visible tick 351: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g68 t+71.803 s len 295 ms vis visible tick 352: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g69 t+72.098 s len 235 ms vis visible tick 353: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g70 t+92.274 s len 212 ms vis visible tick 705: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g71 t+92.775 s len 239 ms vis visible tick 712: between steps
  g72 t+93.531 s len 206 ms vis visible tick 721: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g73 t+93.776 s len 228 ms vis visible tick 723: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g74 t+94.424 s len 210 ms vis visible tick 733: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g75 t+94.973 s len 216 ms vis visible tick 741: between steps
  g76 t+95.525 s len 249 ms vis visible tick 749: between steps
  g77 t+96.073 s len 240 ms vis visible tick 756: between steps
  g78 t+107.220 s len 229 ms vis visible tick 912: between steps (at the edge of s:paint-vs-event dx=-85 drag#8)
  g79 t+107.733 s len 243 ms vis visible tick 919: between steps
  g80 t+108.270 s len 219 ms vis visible tick 926: between steps (at the edge of s:there-and-back-net setCam#9)
  g81 t+108.489 s len 245 ms vis visible tick 927: between steps (at the edge of s:there-and-back-net setCam#9)
  g82 t+108.771 s len 228 ms vis visible tick 929: between steps (at the edge of s:there-and-back-net setCam#9, s:there-and-back-net drag#10)
  g83 t+109.369 s len 349 ms vis visible tick 938: in s:there-and-back-net drag#10 (at the edge of s:there-and-back-net setCam#9)
  g84 t+116.068 s len 330 ms vis visible tick 1017: between steps (at the edge of s:there-and-back-net drag#10, s:there-and-back-net drag#11)
  g85 t+124.166 s len 228 ms vis visible tick 1119: between steps (at the edge of s:there-and-back-net drag#11, s:recenter-crossing-A dx=1200 setCam#12)
  g86 t+124.914 s len 318 ms vis visible tick 1131: between steps (at the edge of s:recenter-crossing-A dx=1200 setCam#12, s:recenter-crossing-A dx=1200 drag#13)
  g87 t+125.915 s len 885 ms vis visible tick 1142: in s:recenter-crossing-A dx=1200 drag#13
  g88 t+126.963 s len 868 ms vis visible tick 1146: in s:recenter-crossing-A dx=1200 drag#13
  g89 t+127.960 s len 8341 ms vis visible tick 1148: in s:recenter-crossing-A dx=1200 drag#13
  g90 t+136.312 s len 18528 ms vis visible tick 1150: in s:recenter-crossing-A dx=1200 drag#13
  g91 t+155.654 s len 12163 ms vis visible tick 1163: in s:recenter-crossing-A dx=1200 drag#13
  g92 t+167.972 s len 10897 ms vis visible tick 1166: in s:recenter-crossing-A dx=1200 drag#13
  g93 t+179.068 s len 10417 ms vis visible tick 1170: in s:recenter-crossing-A dx=1200 drag#13
  g94 t+189.692 s len 202 ms vis visible tick 1176: between steps (at the edge of s:recenter-crossing-A dx=1200 drag#13)
  g95 t+189.894 s len 12203 ms vis visible tick 1177: in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14
  g96 t+202.093 s len 1484 ms vis visible tick 1178: in s:recenter-crossing-A dx=-1200 setCam#14 + s:recenter-crossing-A dx=-1200 drag#15
  g97 t+203.577 s len 256 ms vis visible tick 1179: between steps (at the edge of s:recenter-crossing-A dx=-1200 drag#15)
  g98 t+204.539 s len 694 ms vis visible tick 1191: in s:recenter-crossing-A dx=-1200 drag#15
  g99 t+205.403 s len 378 ms vis visible tick 1195: in s:recenter-crossing-A dx=-1200 drag#15
  g100 t+205.937 s len 7434 ms vis visible tick 1199: in s:recenter-crossing-A dx=-1200 drag#15
  g101 t+213.536 s len 15443 ms vis visible tick 1204: in s:recenter-crossing-A dx=-1200 drag#15
  g102 t+229.182 s len 6622 ms vis visible tick 1210: in s:recenter-crossing-A dx=-1200 drag#15
  g103 t+235.952 s len 10626 ms vis visible tick 1213: in s:recenter-crossing-A dx=-1200 drag#15
  g104 t+246.738 s len 10423 ms vis visible tick 1216: in s:recenter-crossing-A dx=-1200 drag#15
  g105 t+257.319 s len 11496 ms vis visible tick 1219: in s:recenter-crossing-A dx=-1200 drag#15
  g106 t+268.977 s len 10594 ms vis visible tick 1223: in s:recenter-crossing-A dx=-1200 drag#15
  g107 t+279.766 s len 11740 ms vis visible tick 1227: in s:recenter-crossing-A dx=-1200 drag#15
  g108 t+292.010 s len 353 ms vis visible tick 1237: between steps (at the edge of l:normal-A dx=300 setCam#16)
  g109 t+292.609 s len 1736 ms vis visible tick 1243: in l:normal-A dx=300 setCam#16 (at the edge of l:normal-A dx=300 drag#17)
  g110 t+294.511 s len 310 ms vis visible tick 1248: between steps (at the edge of l:normal-A dx=300 setCam#16, l:normal-A dx=300 drag#17)
  g111 t+303.564 s len 283 ms vis visible tick 1376: between steps (at the edge of l:normal-A dx=-300 setCam#18, l:normal-A dx=-300 drag#19)
  g112 t+308.004 s len 360 ms vis visible tick 1439: in l:normal-A dx=-300 drag#19
  g113 t+312.658 s len 207 ms vis visible tick 1508: between steps (at the edge of l:normal-A dx=-300 drag#19, l:paint-vs-event dx=250 setCam#20)
  g114 t+313.304 s len 326 ms vis visible tick 1518: between steps (at the edge of l:paint-vs-event dx=250 setCam#20)
  g115 t+313.952 s len 335 ms vis visible tick 1526: between steps
  g116 t+314.602 s len 348 ms vis visible tick 1534: between steps
  g117 t+315.002 s len 362 ms vis visible tick 1536: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g118 t+315.453 s len 250 ms vis visible tick 1539: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g119 t+326.549 s len 363 ms vis visible tick 1716: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g120 t+327.249 s len 321 ms vis visible tick 1724: between steps
  g121 t+327.898 s len 328 ms vis visible tick 1732: between steps
  g122 t+328.248 s len 382 ms vis visible tick 1734: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g123 t+328.698 s len 219 ms vis visible tick 1737: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g124 t+329.349 s len 369 ms vis visible tick 1747: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g125 t+329.998 s len 382 ms vis visible tick 1754: between steps
  g126 t+330.698 s len 368 ms vis visible tick 1762: between steps
  g127 t+331.098 s len 394 ms vis visible tick 1764: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g128 t+331.547 s len 243 ms vis visible tick 1767: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g129 t+333.147 s len 201 ms vis visible tick 1790: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g130 t+342.244 s len 346 ms vis visible tick 1936: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g131 t+342.893 s len 352 ms vis visible tick 1944: between steps
  g132 t+343.543 s len 374 ms vis visible tick 1951: between steps
  g133 t+343.943 s len 404 ms vis visible tick 1953: between steps (at the edge of l:there-and-back-net setCam#24)
  g134 t+344.394 s len 233 ms vis visible tick 1955: between steps (at the edge of l:there-and-back-net setCam#24)
  g135 t+344.627 s len 35874 ms vis visible tick 1956: in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25
  g136 t+387.529 s len 253 ms vis visible tick 2067: between steps (at the edge of l:there-and-back-net drag#25, l:there-and-back-net drag#26)
  g137 t+395.979 s len 272 ms vis visible tick 2194: between steps (at the edge of l:recenter-crossing-A dx=1200 setCam#27, l:recenter-crossing-A dx=1200 drag#28)
  g138 t+398.175 s len 221 ms vis visible tick 2226: between steps (at the edge of l:recenter-crossing-A dx=1200 drag#28)
  g139 t+398.877 s len 12935 ms vis visible tick 2235: in l:recenter-crossing-A dx=1200 drag#28
  g140 t+411.940 s len 9530 ms vis visible tick 2238: in l:recenter-crossing-A dx=1200 drag#28
  g141 t+421.624 s len 5401 ms vis visible tick 2240: in l:recenter-crossing-A dx=1200 drag#28
  g142 t+427.216 s len 5714 ms vis visible tick 2244: in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29
  g143 t+432.928 s len 1767 ms vis visible tick 2245: in l:recenter-crossing-A dx=-1200 setCam#29 + l:recenter-crossing-A dx=-1200 drag#30
  g144 t+434.694 s len 326 ms vis visible tick 2246: between steps (at the edge of l:recenter-crossing-A dx=-1200 drag#30)
  g145 t+436.979 s len 220 ms vis visible tick 2280: between steps (at the edge of l:recenter-crossing-A dx=-1200 drag#30)
  g146 t+478.578 s len 5206 ms vis visible tick 3103: in l:recenter-crossing-A dx=-1200 drag#30
  g147 t+483.969 s len 16210 ms vis visible tick 3107: in l:recenter-crossing-A dx=-1200 drag#30
  at or over 1000 ms: 25 -> 1002 ms at t+68.650; 8341 ms at t+127.960; 18528 ms at t+136.312; 12163 ms at t+155.654; 10897 ms at t+167.972; 10417 ms at t+179.068; 12203 ms at t+189.894; 1484 ms at t+202.093; 7434 ms at t+205.937; 15443 ms at t+213.536; 6622 ms at t+229.182; 10626 ms at t+235.952; 10423 ms at t+246.738; 11496 ms at t+257.319; 10594 ms at t+268.977; 11740 ms at t+279.766; 1736 ms at t+292.609; 35874 ms at t+344.627; 12935 ms at t+398.877; 9530 ms at t+411.940; 5401 ms at t+421.624; 5714 ms at t+427.216; 1767 ms at t+432.928; 5206 ms at t+478.578; 16210 ms at t+483.969
  by window (a gap in both kinds counts in both): setCam 6, drag 32, between steps 114

(ii) VIEW-STATE LINES: receipts 558 (with >=3 args: 558), pushes 558, page emissions 558
  pushes matched to a page emission by fields, in order: 558; unmatched: 0
  receipts with >=3 args minus pushes: 0 (a receipt with no push is the listener's catch or a push not yet made)
  positional pairs (i-th receipt with >=3 args, i-th push) with no field-equal page emission: 0
  interval [receipt, push] overlaps a kept gap by more than the half-width: yes 7; only within the half-width (edge) 80; no 471
  the five longest receipt-to-push intervals (ms): n550/k550: 22068 [no]; n119/k119: 4543 [no]; n544/k544: 2129 [yes]; n558/k558: 1995 [yes]; n265/k265: 1766 [yes]
  receipt minus the page's mapped emission time, the five largest (ms): n550: 7797.557; n119: 599.785; n537: 83.879; n553: 82.824; n554: 79.895

(iii) SEAM CALLS: 14 calls recorded; setCam calls in the node file 14; wrapper still installed at collection: true
  interval [call, return] overlaps a kept gap: yes 10; no 4
  call durations (ms, call to sync return): 1:42* 2:15 3:11 4:103* 5:104* 6:93* 7:255* 8:250* 9:82 10:85* 11:78* 12:83* 13:77 14:283*   (* overlaps a kept gap)
  results: true; visibility at call: visible

PER setCam: the s0 the suite read, against the page's own reset line (emissions seq0 < seq <= seq1 of its seam call)
  small: normal-A dx=300 setCam#1 (seam call 1, args match true, emissions during the call 1): s0 is the page's own reset line (seq 1, push k1); vs held 1 lines at its return
  small: normal-A dx=-300 setCam#3 (seam call 2, args match true, emissions during the call 1): s0 is the page's own reset line (seq 43, push k43); vs held 1 lines at its return
  small: paint-vs-event dx=85 setCam#5 (seam call 3, args match true, emissions during the call 1): s0 is the page's own reset line (seq 85, push k85); vs held 1 lines at its return
  small: paint-vs-event dx=-85 setCam#7 (seam call 4, args match true, emissions during the call 1): s0 is the page's own reset line (seq 127, push k127); vs held 1 lines at its return
  small: there-and-back-net setCam#9 (seam call 5, args match true, emissions during the call 1): s0 is the page's own reset line (seq 169, push k169); vs held 1 lines at its return
  small: recenter-crossing-A dx=1200 setCam#12 (seam call 6, args match true, emissions during the call 1): s0 is the page's own reset line (seq 252, push k252); vs held 1 lines at its return
  small: recenter-crossing-A dx=-1200 setCam#14 (seam call 7, args match true, emissions during the call 1): s0 is NOT the reset line: it is page emission seq 265 (push k265); the reset is seq 266; vs held 1 lines at its return
  large: normal-A dx=300 setCam#16 (seam call 8, args match true, emissions during the call 1): s0 is the page's own reset line (seq 280, push k280); vs held 1 lines at its return
  large: normal-A dx=-300 setCam#18 (seam call 9, args match true, emissions during the call 1): s0 is the page's own reset line (seq 322, push k322); vs held 1 lines at its return
  large: paint-vs-event dx=250 setCam#20 (seam call 10, args match true, emissions during the call 1): s0 is the page's own reset line (seq 364, push k364); vs held 1 lines at its return
  large: paint-vs-event dx=-250 setCam#22 (seam call 11, args match true, emissions during the call 1): s0 is the page's own reset line (seq 406, push k406); vs held 1 lines at its return
  large: there-and-back-net setCam#24 (seam call 12, args match true, emissions during the call 1): s0 is the page's own reset line (seq 448, push k448); vs held 1 lines at its return
  large: recenter-crossing-A dx=1200 setCam#27 (seam call 13, args match true, emissions during the call 1): s0 is the page's own reset line (seq 531, push k531); vs held 1 lines at its return
  large: recenter-crossing-A dx=-1200 setCam#29 (seam call 14, args match true, emissions during the call 1): s0 is NOT the reset line: it is page emission seq 544 (push k544); the reset is seq 545; vs held 1 lines at its return

PER drag: the s1 the suite read (the last-read after it), against the last line emitted before the next setCam call
  small: normal-A dx=300 drag(s) [#2 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 42, push k42); vs held 42 lines
  small: normal-A dx=-300 drag(s) [#4 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 84, push k84); vs held 42 lines
  small: paint-vs-event dx=85 drag(s) [#6 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 126, push k126); vs held 42 lines
  small: paint-vs-event dx=-85 drag(s) [#8 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 168, push k168); vs held 42 lines
  small: there-and-back-net drag(s) [#10 settled=true count=42, #11 settled=true count=83]: s1 is the last line emitted before the next setCam (seq 251, push k251); vs held 83 lines
  small: recenter-crossing-A dx=1200 drag(s) [#13 settled=true count=13]: s1 is NOT the last line before the next setCam: it is page emission seq 264 (push k264); that last is seq 265; vs held 13 lines
  small: recenter-crossing-A dx=-1200 drag(s) [#15 settled=true count=14]: s1 is NOT the last line before the next setCam: it is page emission seq 278 (push k278); that last is seq 279; vs held 14 lines
  large: normal-A dx=300 drag(s) [#17 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 321, push k321); vs held 42 lines
  large: normal-A dx=-300 drag(s) [#19 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 363, push k363); vs held 42 lines
  large: paint-vs-event dx=250 drag(s) [#21 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 405, push k405); vs held 42 lines
  large: paint-vs-event dx=-250 drag(s) [#23 settled=true count=42]: s1 is the last line emitted before the next setCam (seq 447, push k447); vs held 42 lines
  large: there-and-back-net drag(s) [#25 settled=true count=42, #26 settled=true count=83]: s1 is the last line emitted before the next setCam (seq 530, push k530); vs held 83 lines
  large: recenter-crossing-A dx=1200 drag(s) [#28 settled=true count=13]: s1 is NOT the last line before the next setCam: it is page emission seq 543 (push k543); that last is seq 544; vs held 13 lines
  large: recenter-crossing-A dx=-1200 drag(s) [#30 settled=true count=14]: s1 is NOT the last line before the next setCam: it is page emission seq 557 (push k557); that last is seq 558; vs held 14 lines

THERE-AND-BACK per window size (formula pan-anchor.mjs: net = ((s1.targetX+s1.originX)-(s0.targetX+s0.originX)) * 2^s1.zoom * (bw/cw); tolerance 4)
  small: ratio 1; page net (reset line seq 169 to the last line before the next setCam, seq 251) = 0.00 buffer px [within tolerance]; suite net from vs = 0.00 [within]; the suite's own record: "net residual 0.00 buffer px (tol 4)"; case PASS
      emissions between the case's setCam and the next setCam: 82; vs lines between its two drags: 42
  large: ratio 1; page net (reset line seq 448 to the last line before the next setCam, seq 530) = 1.00 buffer px [within tolerance]; suite net from vs = 1.00 [within]; the suite's own record: "net residual 1.00 buffer px (tol 4)"; case PASS
      emissions between the case's setCam and the next setCam: 82; vs lines between its two drags: 42
```

**Reader caveats** (my notes, not route calls)
- "Between steps" includes the suite's own `waitForFill`, `columnCentroid` and `settleCanvasSize` page calls. The instrument does not label them.
- The clock checks had half-widths of 194 and 339 ms, because the check's evaluate itself took 297 ms and 678 ms. Window placement is coarse at that width, and 80 of the receipt-to-push intervals count only as "edge".
- A read of the node file for the longest receipt-to-push interval, n550, shows a 22 s push delay and an 8 s receipt delay. Page heartbeat gaps in that stretch were at most 220 ms. Whether the delay was in the CDP path or on the node side is not something these files separate.
- Of the 25 gaps of 1 s or more, 22 fall in the recenter-crossing windows (small and large), one in `paint-vs-event dx=85`, one in `l:normal-A dx=300 setCam#16`, and one (35874 ms) in `l:there-and-back-net setCam#24` and `drag#25`.
- Both `recenter-crossing-A dx=-1200` cases got a stale s0: the previous drag's last line, whose push landed after `vs.length = 0` in `setCam`. In `small:` setCam#14 s0 is seq 265, while the reset is seq 266 (push k266, landed 1.47 s after its receipt). Both `recenter-crossing-A dx=1200` and `dx=-1200` drags read s1 one line behind the last emitted line.

**Harness disclosure** (port-5400 harness, item 1 of the 2026-10-11 approval)
- A debug exe built with the TAURI_CONFIG overlay (CDP on 9223, localhost:5180 mapped to 127.0.0.1:5400). Vite on 5400 with `--strictPort`. The `shim/npx.cmd` stand-in first on PATH for that run only.
- Port 5180 was untouched.
- Where it wrote:
  - `<H>/out/`, and the pid, vite and app logs and shim outputs directly in `<H>`.
  - `D:/wt-targets/dg` (exe build, and the exe copy in `exes/`).
  - `D:/wt-targets/dg-load` (created and removed).
  - `C:/dev/wt/dg`: gitignored `node_modules`, `renderer/bundle-viewer/dist` and `viewer-asset-hashes.json`, `src/generated/NOTICE.txt`, and `e2e/out/` (`app.log`, `tauri.e2e.conf.json`).
  - `<S>` files named `dg-*`.
  - The app's own per-user log folder (the session log) and webview data, as any run of the app writes them.
- No tracked file changed except `pan-anchor.mjs`, which was reverted. Porcelain is empty and `git diff --name-only` is empty. The branch `cut/pan-anchor-there-and-back-residual-diagnostic` is at B with no commit.

**Hold lines**
```
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:25464 also=… (bundle-viewer build)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:25464 affinity=FF (cores 0-7)
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:21920 also=… (generate:notice)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:21920 affinity=FF (cores 0-7)
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:19792 also=… (exe build)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:19792 affinity=FF (cores 0-7)
MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:19744 also=… (run build)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:19744 affinity=FF (cores 0-7)
```

**Pre-gate self-check**
- Cross-module code: I wrote against the real seam, `e2eSetViewState` registered at `frontends/shell/src/canvas/WorkingCanvas.tsx:2324-2349`, and the real trace shape from `renderTrace.ts`. The wrapper recorded 14 calls, all with matching args.
- Completion claims: each rests on a file or output above, with its hash. The two items I could not observe directly are named above (the `jsonValue` catch, and what held the thread).
- User-facing messages: none were added.
- Required test reaches its assertion: no test was added. I only read the suite's own PASS and FAIL lines.

**Other**
- Background shells: the four I started (the exe build, the run, and two bounded wait loops) all exited on their own. None is left, and I killed none by PID.
- No process of mine is running.
- Model as the harness reports it: Sonnet 5.5 (`claude-sonnet-5-5`). No model override. No context handoff received or produced.
- Nothing was committed, pushed, retried or fixed. Run `quiet` was not started.
- Off-scope, noticed, not done: `D:/wt-targets/dg` (the exe target) remains for run `quiet`.
