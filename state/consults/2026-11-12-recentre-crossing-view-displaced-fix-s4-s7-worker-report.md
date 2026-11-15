*Custodian's filing note (2026-11-12): the S1 fix's S4 to S7 worker-high report, from its hand-back (12766 bytes, sha256 4d8c8e2298bfcec2ddb1bdaa6ae6beca6faaa28351507997cfbc31f0136c27fc), below the rule; one path is elided at filing (the app's per-user log folder) and one final newline is added; nothing else is changed. Its brief by file (15900 bytes, sha256 e900ceee55493eab2722c4e9828c3a93cada50c9d5b9d8a74dd4411f267bc079); the run 07:03:33Z to 07:46:35Z by its transcript, 92 calls (Read 17, Bash 54, Write 6, Edit 13, Monitor 1, the hand-back), 7 holds, model claude-sonnet-5-5. 5 calls errored: a Read over its size limit, two diff-and-grep calls that exited 1, the Monitor call (no such tool here; disclosed), and a grep that exited 2; the report discloses only the Monitor one. It stopped at S6 by its brief: E1 at the head build passed 5 of 6, and case 1 (c), the reproducer's note 5 image rule, failed, so P-head is not met and S7 did not run. The custodian's reading of the two images, unmeasured: the drawn data has the same left and bottom edges at start and end, and the end shows more of it, so (c) counted resident data and not a displacement; the architect drafts the form's amendment on (c). A report, a reading and not Authority.*

---

Stopped: recentre-crossing-view-displaced-fix S6, E1 case 1 (c) FAILED (rc 1, 5/6 PASS). S7 not done, per the brief's rule. The fix commit S4 is pushed.

Tag: node:recentre-crossing-view-displaced-fix@s4-s7. Worktree C:/dev/wt/rcf, branch cut/recentre-crossing-view-displaced-fix. Brief sha256 e900ceee55493eab2722c4e9828c3a93cada50c9d5b9d8a74dd4411f267bc079 (matched).

**Where checks**
- Start HEAD was 8cbc250ba568cd29485663990f27c63451f2a67f, on the branch above, porcelain empty.
- The form's sha256 is bb654dfc…c602e9, verified at main a8125f81.
- Lockfile: `git diff --quiet` against a74a9d5c gave rc 0.
- deck `@deck.gl/core` is 9.3.9.
- Disk: C: 19G free, D: 228G free. `D:/wt-targets/rcf-head` did not exist before the build.
- Fixture `target/fixtures/manual-walkthrough/100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. It is the same before and after the run. The fixture path is in `recentre-crossing.mjs` line 39.

**Pin table** (C14–C27 in `WorkingCanvas.tsx` at HEAD 8cbc250b). Every hash equals its pin, and every pin was found whole. #307 added 6 lines near line 140 and 6 near line 1612, which accounts for the shifts.

| Pin | Lines at HEAD |
|---|---|
| C14 | 95-111 |
| C15 | 449-490 |
| C16 | 592-598 |
| C17 | 1414-1423 |
| C18 | 2047-2053 |
| C19 | 2089-2159 |
| C20 | 2095-2103 |
| C21 | 2113 |
| C22 | 2115-2123 |
| C23 | 2125-2138 |
| C24 | 2139-2146 |
| C25 | 2148-2158 |
| C26 | 2241-2242 |
| C27 | 2331-2369 |

**S4 commit**
- Id: 3df3e57c38b82859eb9f01b294557fb143769ef7.
- Subject: `fix: the re-centre's camera move is the view-state callback's return value, and waits for a transition to end`. `-s` added the sign-off. The two trailer lines are in the message file `<S>/rcf-s47-msg-s4.txt`.
- Diff: `frontends/shell/src/canvas/WorkingCanvas.tsx` only, 37 insertions and 23 deletions, which is 60 lines against the 70 ceiling. The whole diff was shown in my run.
- What changed, in short:
  - The top doc comment is relabelled 9.3.9, and its "later programmatic jump" sentence is replaced by the §2.4 draft.
  - The settled-tick note is restated on 9.3.9 and names the three guards.
  - The in-callback `setProps` is removed. The handler now returns `{...viewState, target:[localX, localY, vs.target[2] ?? 0]}` on a re-centring tick, and `render()` stays.
  - The guard is `!isDragging && !inTransition && !startsTransition`. `startsTransition` is `(transitionDuration > 0 || transitionDuration === "auto") && Boolean(transitionInterpolator)`.
  - The comment on the drag deferral is edited to match.
  - C26, the DEV-only `capturePixels` 9.3.7 label, is untouched, as OPEN-9 says.
- Disclosure: the drag-deferral comment still contains the literal text `setProps({ initialViewState })`, in the sentence "then by … now the return value". The code has no `setProps` inside the callback.
- Checks, all rc 0:
  - `npm run typecheck` rc 0, with no TS errors.
  - `verify-cites` rc 0 (PASS, 188 loose references advised).
  - `profile-path-scan --staged` rc 0 ("clean").

**S5 (vitest at the head, plus the mutations by hand)**
- Recentre test file at the head: 1 file passed, 2/2 tests passed, rc 0.
- Whole suite at the head: Test Files 112 passed (112), Tests 1458 passed (1458), no FAIL in the log, rc 0.
- M-U1 (restore the in-callback `setProps`, return nothing): both tests failed, rc 1.
  - U1's line: `AssertionError: crossing 1: W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001`
  - U2 also failed under M-U1, at (c): `AssertionError: (c): W.x moved by 157286.3999999999 world units: expected 157286.3999999999 to be less than or equal to 0.000001`
  - Reverted with Edit. `git diff --quiet HEAD -- …WorkingCanvas.tsx` gave rc 0.
- M-U2 (remove the transition clauses from the `if`): U2 failed and U1 passed (1 failed | 1 passed), rc 1.
  - U2's line: `AssertionError: (a) a settled tick with inTransition true: the origin stays: expected [ [ 2600040.6260723933, …(1) ], …(1) ] to deeply equal [ [ 2600040.6260723933, …(1) ], …(1) ]`
  - Reverted. The revert check gave rc 0 and the porcelain is empty.
- Logs are in `<S>`: `rcf-s47-vitest-head-recentre.log`, `-head-all.log`, `-mu1.log`, `-mu2.log`.

**Build and exe**
- Command: `CARGO_TARGET_DIR=D:/wt-targets/rcf-head`, `CARGO_BUILD_JOBS=8`, `timeout 4200`, in a shared hold. rc 0.
- Last lines: "Finished `release` profile [optimized] target(s) in 26m 15s" and "Built application at: D:\wt-targets\rcf-head\release\spatial-ide-shell.exe".
- Log `<S>/rcf-s47-build.log`: 15232 bytes, sha256 97713ad7fd0de2f56e3089d052e36159a6f36b990b21e411d78482f5221b93f1.
- Exe: 72488960 bytes, sha256 abb38571221ae4b26d035914df1d3dfad7214fab3a2eee82cc5b6645e46ec6ed, mtime 2026-11-12 08:39:22 +0100.
- HEAD stayed 3df3e57c and the porcelain stayed empty through the build.

**Checks before the run**
- `<S>/rcf-s47.procs-before.txt` (listed 2026-11-12T07:39:47Z): 15 processes, namely 2 cargo, 8 clang-cl and 5 node. The clang-cl processes all reference another target folder (`padb`), not mine. There was no `spatial-ide-shell`.
- `rcf-s47.port-before.txt` is empty, so there was no listener on 9223 (the netstat grep gave rc 1).

**The run (once)**
- The command was `npm run e2e:recentre-crossing -- --measure-build D:/wt-targets/rcf-head/release/spatial-ide-shell.exe`, run once inside a shared hold, in the background, under `timeout 1800`.
- Stamps (`rcf-s47.stamps.txt`): start 2026-11-12T07:40:18Z, end 2026-11-12T07:44:44Z. rc **1**.
- It was not re-run.

**Checks after the run**
- `rcf-s47.procs-after.txt` (listed 07:45:03Z): 7 processes (2 cargo test, 5 node). There is no `spatial-ide-shell`, so I started nothing that needed killing.
- Netstat for 9223 shows only `TCP 127.0.0.1:9223 127.0.0.1:2749 TIME_WAIT 0`. That is a closed connection, not a listener, and no process owns it.

**E1 log lines, byte-copied** (`<S>/rcf-s47-e1.log`, 1654 bytes, sha256 52ce1b80c631cd9f82ac7ad0c7c6855145abf208a832297d5a0565b229dfc698)
```
--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---
  image case1-start: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794469226237-case1-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
  image case1-end: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794469226237-case1-end.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
  origin changes: 2; in leg 1 1, in leg 2 1; at drags 35, 74
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
FAIL  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 127606, C shift 129.55 buffer px

--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---
  target 968.002 below the bound
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)

==== 5/6 PASS ====
FAILED: case 1 (c): the start and end images do not differ
```
There is no VOID or fatal line.

**Reading against P-head**
- P-head predicted that all six parts pass with rc 0. It did not hold: 5 of 6 pass, rc 1. Part (c) fails.
- Case 1's origin changes follow the derivation:
  - T = 131072 and d = 3749.395, so floor(T/d)+1 = floor(34.96)+1 = 35. The out leg's change is at drag 35, as seen.
  - n1 = 37, so the back leg's n1-th drag is overall drag 37+37 = 74. The back leg's change is at drag 74, as seen.
  - That is exactly two changes, one per leg.
- W is continuous across both (worst jump 0.00 buffer px, tolerance 4). The end W equals the start W (|E| = (0.000, 0.000), against d 3749.395). So parts (a) and (b) show the view is put back, but (c) says the images differ.
- I record only what the log says. The N figures went 35248 -> 127606 and the C shift is 129.55 buffer px. The start image is 34623 bytes and the end image is 107990 bytes. I have not looked at the pictures or at why the image rule fails, since that is outside the brief.
- Per the brief, the piece ends here: no S7, no re-run.

**Copied files** (all in `<S>`)
- `rcf-s47.session.log`: 140883 bytes, sha256 25b5a13443c462bdf31438266f050fbba4ca011cf0f2e60e30231aef62b501e1. It is a copy of `<the app's per-user log folder>/session-1794469227.log`, my run's session. Its only "error"/"policy" matches are the info line "policy recovery policy: none -- fail visibly…", at lines 2, 4 and 835.
- `rcf-s47.app.log`: 554 bytes, sha256 bcd02b863ab05f66521e78ad8b6234cddb0684539c606958292d241580a3465d. It is `e2e/out/measure-app.log`, which appends: it holds S3's session (1794465184) and mine (1794469227).
- `rcf-s47-recentre-crossing-e1-1794469226237-case1-start.png`: 34623 bytes, sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2.
- `rcf-s47-recentre-crossing-e1-1794469226237-case1-end.png`: 107990 bytes, sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519.
- `rcf-s47.procs-before.txt`: sha256 4fcf72c9674a865c70defe2789b30370fe3ecf7e694a665d2f61319eeffe542b.
- `rcf-s47.procs-after.txt`: sha256 2ff0723b17ea9d4ef141b341e69cd6c0fb453b4ca58572e0e9057c2439131076.
- `rcf-s47.port-before.txt`: empty, sha256 e3b0c442….
- `rcf-s47.port-after.txt`: 73 bytes, sha256 0134f5fd5c6eb968601eef4aba8ae24e13ca614bbee7d9b5e60261338e762920.
- `rcf-s47.stamps.txt`: sha256 ab60ed0184df8ed5b9ac18ff8e04226f5baf557e45355a4cb5269b01054c856d.
- The images are also still in `e2e/out/` (gitignored), next to S3's `…1794465184091-case1-{start,end}.png`.

**Numstat** (`git diff --numstat 9398efc6e3db7474cc9b1346ea9e1a5f1d5c7832...HEAD -- frontends/shell`, rc 0)
```
317	0	frontends/shell/e2e/recentre-crossing.mjs      (ceiling 450)
1	0	frontends/shell/package.json                   (ceiling 2)
218	0	frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx  (ceiling 300)
37	23	frontends/shell/src/canvas/WorkingCanvas.tsx   (60 against ceiling 70)
```
The README (ceiling 45) and walkthrough (ceiling 4) are untouched, because S7 did not run. The branch is within every §7 ceiling.

**Written but not named by the brief, and departures**
- Scratch files in `<S>`, all named `rcf-s47*`: `-pins.mjs`, `-procs.ps1`, `-extract-a7a.mjs`, `-a7a.json`, `-readme-entry.txt`, `-msg-s4.txt`, `-typecheck.log`, `-cites-s4.log`, `-scan-s4.log`, `-netstat-after.txt`, `-procs-after.run.log`, `-numstat.txt`, `-push.log`, `-lsremote.txt`, plus the logs and copies listed above.
- The README entry text and the A7a sentences are prepared in scratch but not applied. `rcf-s47-readme-entry.txt` and `rcf-s47-a7a.json` hold them, byte-copied from the filed draft. They are ready if the piece resumes.
- The app's own per-user log folder gained session-1794469227.log from the run.
- Departures:
  - The Monitor tool was unavailable, so I used hard-bounded `sleep 10` loops, which the harness auto-backgrounded.
  - My first S4 message file wrote "entry 95 comment", a ruling name. I rewrote it as "the comment on the drag deferral" before committing.
  - Otherwise none.
- Nothing was done that the brief forbids.

**Hold lines** (`also=` elided)
- typecheck: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:22224`
- recentre vitest: `…shell=bash.exe:59676`
- whole vitest suite: `…shell=bash.exe:81032`
- M-U1: `…shell=bash.exe:13688`
- M-U2: `…shell=bash.exe:22120`
- build: `…shell=bash.exe:9980`
- E1 run: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:64392`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:64392 affinity=FF (cores 0-7)`
- Each earlier hold was released too.

**Push and ls-remote**
- Push, in its own call, `git -C C:/dev/wt/rcf push origin cut/recentre-crossing-view-displaced-fix`, rc 0: `8cbc250b..3df3e57c`.
- `git ls-remote origin refs/heads/cut/recentre-crossing-view-displaced-fix` gives `3df3e57c38b82859eb9f01b294557fb143769ef7`.
- Porcelain is empty and HEAD is 3df3e57c.

**Background shells left**
- None. bf8soncm1 has exited. The build and test shells all ended, and no `spatial-ide-shell` process remains.
- The two other background agents listed in my session (a18da343, a229e728) are not mine.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`).
