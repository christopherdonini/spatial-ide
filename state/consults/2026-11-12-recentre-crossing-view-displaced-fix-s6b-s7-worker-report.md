*Custodian's filing note (2026-11-12): the S1 fix's S6b to S7 worker-high report, from its hand-back (16181 bytes, sha256 ffa04b0627a2869f4ac606024682829e5bc807f2cb96367cd31221651aa6fe66), below the rule; a final newline is added where missing; nothing else is changed. Its brief by file (14952 bytes, sha256 342e6d232baf7f5b706fcdf764cad02bee4fcd6c26668d4762e8cfd7a2739cfe); the run 14:00:40Z to 14:20:39Z by its transcript, 73 calls (Read 13, Bash 45, Grep 1, Write 7, Edit 6, the hand-back), 3 shared holds, each released, model claude-sonnet-5-5. Two calls errored: two Edit calls refused because the file had not been read first; the report does not name them. The branch head is b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a, pushed. A report, a reading and not Authority.*

---

Built: recentre-crossing-view-displaced-fix S6b to S7 at b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a

Brief sha256 342e6d23…739cfe matched. Form sha256 6d6abf50…809aa31 matched at main 6cfea93be992018afe020306a1122730f4375f86 (fetch rc 0). Worker file read first. `<S>` is the scratchpad folder holding the brief.

**Where checks (all as given)**
- Worktree HEAD 3df3e57c38b82859eb9f01b294557fb143769ef7, branch cut/recentre-crossing-view-displaced-fix, porcelain empty.
- Lockfile `git diff --quiet a74a9d5c… HEAD -- frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json` rc 0. deck core 9.3.9. Disk: C: 17G free, D: 208G free.
- Base exe 72487424 B, sha256 ac400813…ed323, mtime 2026-11-12 07:32:20 +0100. Head exe 72488960 B, sha256 abb38571…6ed, mtime 08:39:22 +0100. Both equal their pins; no build was made.
- Fixture 29933646 B, sha256 fd0c74ab…ddb49.
- The four stored images equal Amendment 2's Images list: start 34623 B 102996b1…f3f2 (both runs), base end 3169 B 4ad95262…f062, head end 107990 B cf7fd271…f519.

**S6b commit f88bc008315f32f8445ffe2248ce93ba854e06f7**
- Subject: `test: E1 case 1 (d), the drawn data's inner edges; (c) reported, its B from the start image`. Message file shown before the commit (`<S>/rcf-s6b-msg.txt`).
- Checks, each rc 0: `node --check`, `verify-cites` (PASS), `profile-path-scan --staged` (clean).
- `git diff --name-only 3df3e57c..HEAD` at that commit named `frontends/shell/e2e/recentre-crossing.mjs` alone. Numstat 47 insertions, 17 deletions.
- F2's and F3's words were extracted from the filed draft by regex in `<S>/rcf-s6b-apply.mjs`, not retyped. Both are pure ASCII.
- The whole diff (`git diff HEAD~1 HEAD`, 125 lines, sha256 81cc682c…2dd4) was shown in my transcript. In summary (mine):
  - Header: line 18's (c) clause is replaced by F3's words.
  - `analyze` is split into `rgbAt`, `ringB(img)` (B from the START image's outermost ring) and `analyze(img, box, bg)`. It now also returns `edge`, the bounding box of the marked pixels.
  - New `edgeVerdict(s, e, box)` implements rule (d) exactly as Amendment 2 item 4 declares it.
  - F2's replacement comment sits before the capture settle.
  - `capture` returns the decoded image.
  - Case 1 prints the Amendment 3 item 3 REPORT line after the end capture.
  - (c) is now a `console.log` line starting `REPORT  case 1 (c): …` with its verdict text kept, and is not in `results`.
  - (d) is `record("case 1 (d): the drawn data's inner edges do not move", …)` and counts in the exit code.
  - Precondition, VOID, TOLERANCE_BUFFER_PX, case 2, (a) and (b) are untouched.

**S6b scratch check** (`<S>/rcf-s6b-dcheck.mjs`, not committed; output in `<S>/rcf-s6b-dcheck.out`)
- It loads the code with `git show f88bc008…:frontends/shell/e2e/recentre-crossing.mjs`. It slices from `function decodePng(buf)` to `async function capture(` (5426 chars, sha256 db217dd1…98b5), plus the `const TOLERANCE_BUFFER_PX = 4.0;` line, and builds it with `new Function`. It checks each image's sha256 first.
- Head pair: B 255,255,255, N 35248 -> 127606. (d) readable, differs false. Start box [left 66, right 667, top 258, bottom 357], end box [left 66, right 667, top 0, bottom 357]. K {left, bottom}, moves left 0.00, bottom 0.00. (c) differs, C shift 129.55.
- Base pair: N 35248 -> 0. (d) readable, differs true, end box none, N_end 0. (c) differs.
- Both match the expected answers; no code was changed.

**S6c: E1 once at the base exe**
- Before: `<S>/rcf-s6c.procs-before.txt` had 5 processes, none of them cargo, rustc, vite or `spatial-ide-shell`. Four node processes and one grep process belong to others, and I touched none. `rcf-s6c.port-before.txt` is empty.
- Stamps 2026-11-12T14:05:37Z to 14:08:49Z, rc 1. Log `<S>/rcf-s6c-e1.log`, 2338 B, sha256 89610aa2…d7d7.
- After: no `spatial-ide-shell` process. 9223 shows one TIME_WAIT line only (a closed connection, no owner, not a listener). I started and killed nothing.
- Byte-copied lines:
```
--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---
  image case1-start: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794492339351-case1-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
  image case1-end: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794492339351-case1-end.png 3169 bytes sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062
  REPORT  case 1 view-state lines, as (b) reads them: start target (0, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801; end target (-9.5042196335271e-11, 0) origin (1932318.4507132026, 1200019.902370003) zoom -3.692532927362801
  origin changes: 5; in leg 1 3, in leg 2 2; at drags 35, 36, 37, 38, 39
FAIL  case 1 (a): W is continuous across each origin change  ::  5 origin change(s), worst jump 10730.00 buffer px (tol 4)
FAIL  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (671141.663, 0.000) vs d 3749.395
REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 0, C shift 0.00 buffer px
FAIL  case 1 (d): the drawn data's inner edges do not move  ::  differ: start box [left 66, right 667, top 258, bottom 357], end box none; N_end 0, K n/a, no move to read
--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---
  target 968.002 below the bound
FAIL  case 2 (i): no origin change from the double-click to its settle  ::  11 line(s), 1 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
FAIL  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  2 origin change(s), worst jump 20426.00 buffer px (tol 4)
==== 1/6 PASS ====
FAILED: case 1 (a): W is continuous across each origin change; case 1 (b): |W_end - W_start| <= d per axis; case 1 (d): the drawn data's inner edges do not move; case 2 (i): no origin change from the double-click to its settle; case 2 (iii): W is continuous across the origin change at the wheel tick
```
- No VOID or fatal line.
- Copies in `<S>` (size, sha256):
  - `rcf-s6c.session.log` 210420, 08e8f18f…eefa
  - `rcf-s6c.app.log` 831, 059d9b3b…1a8
  - `rcf-s6c-recentre-crossing-e1-1794492339351-case1-start.png` 34623, 102996b1…f3f2
  - `rcf-s6c-recentre-crossing-e1-1794492339351-case1-end.png` 3169, 4ad95262…f062
  - procs/port before and after files and `rcf-s6c.stamps.txt` are also there.
- Reading against P-E1-base under (d):
  - Precondition met.
  - (a) and (b) fail.
  - (c) is reported and differs (N_end 0).
  - (d) fails on N_end 0.
  - Case 2 (i) fails and (ii) passes. (iii) failed; it is recorded as seen.
  - Exit 1.
  - This meets the prediction. I5, I6 and I2 did not occur.

**S6d: E1 once at the head exe**
- Before: 5 processes, none of the named kinds or `spatial-ide-shell`. The port file had one TIME_WAIT line left by S6c's closed connection, not a listener, so I proceeded.
- Stamps 14:09:32Z to 14:12:44Z, rc 0. Log `<S>/rcf-s6d-e1.log`, 2097 B, sha256 b2328fbb…b7.
- After: no `spatial-ide-shell`; TIME_WAIT only. I killed nothing.
- Byte-copied lines:
```
--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---
  image case1-start: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794492574082-case1-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
  image case1-end: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794492574082-case1-end.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
  REPORT  case 1 view-state lines, as (b) reads them: start target (0, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801; end target (-4.547473508864641e-13, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801
  origin changes: 2; in leg 1 1, in leg 2 1; at drags 35, 74
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 127606, C shift 129.55 buffer px
PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 258, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)
--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---
  target 968.002 below the bound
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)
==== 6/6 PASS ====
```
- Copies in `<S>`:
  - `rcf-s6d.session.log` 136536, ee0a909d…e118b
  - `rcf-s6d.app.log` 1108, 22c851d2…06d9
  - start and end PNGs prefixed `rcf-s6d-` (34623 and 107990 B, the same shas as the stored head pair)
  - procs/port before and after, and stamps.
- Reading against P-head under (d): precondition met; exactly two origin changes at drags 35 and 74, matching Amendment 2 item 6's derivation (floor(T/d)+1 = 35; 37+37 = 74; one per leg); (a) and (b) pass; (c) reported and differs as at S6; (d) passes with K {left, bottom} and moves 0.00; case 2 (i), (ii), (iii) pass; exit 0. P-head under (d) is met; I6 did not occur.

**S6e: N's run** (S6d met P-head)
- `<S>/rcf-s6e-copy.diff` (sha256 e15618ff…1460) is the `git diff --no-index` of the copy against the committed file, shown before the run.
  - It adds `caseN` (wheel notches out with a capture each, then leftward drags of floor(cw/3) = 222 CSS px).
  - In `main` it replaces the `case1`/`case2` calls with `await caseN(ctx);`.
  - Nothing else differs.
- Stamps 14:14:25Z to 14:16:20Z, rc 0, log `<S>/rcf-s6e.log`. Nothing was listening on 9223 before or after: no `spatial-ide-shell` process, TIME_WAIT only.
- After the run the copy was moved to `<S>/rcf-s6e-n.mjs` (sha256 2bde106d…31d0) and the porcelain was empty.
- Notches, byte-copied:
```
  notch 0: zoom -3.692532927362801, box width 602 of 668
  notch 1: zoom -4.240591844279753, box width 517 of 668
  notch 2: zoom -4.788650761196704, box width 459 of 668
  notch 3: zoom -5.336709678113657, box width 314 of 668
  notch 4: zoom -5.884768595030609, box width 215 of 668
  notch 5: zoom -6.432827511947561, box width 147 of 668
  notch 6: zoom -6.980886428864514, box width 101 of 668
  notch 7: zoom -7.528945345781466, box width 69 of 668
  notch 8: zoom -8.077004262698418, box width 48 of 668
  notches stop: box width 48 <= 66.8 after 8 notch(es); under a twentieth (33.4): false
  drag 1 (dx -222): 31 line(s) since the notches, settled true, origin changes 0
  drag 2 (dx -222): 62 line(s) since the notches, settled true, origin changes 0
  drag 3 (dx -222): 93 line(s) since the notches, settled true, origin changes 0
  drag 4 (dx -222): 124 line(s) since the notches, settled true, origin changes 1
  k 3, N 5
```
- k = 3, N = 5. The origin change first shows on drag 4's first line, so by E1's rule it belongs to drag 3's settled tick (k = 3). None of Amendment 3's three wait cases applies. Notch 8 is the first box at or under a tenth, and it is not under a twentieth.
- Copies: session log (309466 B), app log, the nine notch PNGs prefixed `rcf-s6e-`, and the listings, all in `<S>`. The notch-0 image has the same sha as the stored start image.

**S7 commit b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a**
- Subject: `docs: e2e:recentre-crossing's README entry; walkthrough row A7a`. Message file `<S>/rcf-s7-msg.txt` was shown before the commit.
- Checks, each rc 0: `verify-cites` (PASS), `verify-test-claims` (PASS, 793 claimed tests), `profile-path-scan --staged` (clean).
- README (12 lines appended, via Edit):
  - It is the prepared entry `rcf-s47-readme-entry.txt` (sha256 6920c2a8…ccf6), changed by three substring replacements made by `<S>/rcf-s6-docs-gen.mjs`.
  - (c) becomes reported on a `REPORT` line, and `case 1 (d)` is asserted.
  - The exit-code sentence now reads "all six asserted steps pass".
  - One sentence is added to "What it proves not".
  - I checked that the README file ends byte-for-byte with the generated entry (`rcf-s6-readme-entry.txt`, sha256 4adc0973…623a).
  - The README text itself is not repeated in this report; that is my abbreviation of "diff (whole)".
- Walkthrough row (1 line, inserted after A7, byte-equal to `<S>/rcf-s6-a7a-row.txt`, sha256 afe5a8ac…cb45):
  `| A7a | Scroll out until the field of parcels is about a tenth of the canvas wide. Drag left by about a third of the canvas width, 5 times; then drag right 5 times by about the same amount. | The parcels come back to about where they started, give or take the difference between your drags. They do not stay away, and Zoom to layer is not needed to find them. |`
- Source spans:
  - Step: the 181-byte span from the directive's line 19 (between the quotes after "The step reads:"), sha256 4572484e…bb17, equal to Amendment 3 item 7's pin. Both `N times` became `5 times` (cell sha256 c773fddd…4f90).
  - Outcome: the 167-byte italic span from the draft's OPEN-4 (A) line, sha256 6268732a…073f. The cell has the same sha256.

**Size**, `git diff --numstat 9398efc6…...HEAD -- frontends/shell`:
- `e2e/recentre-crossing.mjs` 347 (ceiling 450)
- `package.json` 1 (ceiling 2)
- `WorkingCanvas.recentre.test.tsx` 218 (ceiling 300)
- `WorkingCanvas.tsx` 37+23 = 60 (ceiling 70)
- `e2e/README.md` 12 (ceiling 45)
- `MANUAL-WALKTHROUGH.md` 1 (ceiling 4)
- No overrun.

**Written beyond or differing from the brief (disclosed)**
- I applied S6b's edits and the walkthrough insertion with Write-created node scripts in `<S>`: `rcf-s6b-apply.mjs`, `rcf-s6-docs-gen.mjs`, `rcf-s6-docs-apply.mjs`. Also `rcf-s6-procs.ps1` (lists cargo, rustc, node, vite and `spatial-ide-shell` processes) and `rcf-s6b-dcheck.mjs`. Every scratch file starts with `rcf-s6`.
- I restructured `analyze` into `rgbAt`, `ringB` and `analyze` to implement F1 and the boxes. That is a larger diff than a one-line F1 fix, but the (c) rule itself is unchanged apart from B coming from the start image.
- The `capture` function now returns the decoded image, and `analyze` runs after both captures.
- The waits used foreground until-loops with a 10 s sleep and a hard bound. The harness moved them to the background after 180 s; all completed.
- The 9223 port listings before S6d and S6e showed a TIME_WAIT line left by the previous run. That is a closed connection with no owner, not a listener, so I did not treat it as a STOP.
- The process listings include other users' node and grep processes. I touched none and do not name them.
- Nothing in the app's per-user folders was written by me except by the app's own runs (session logs).

**Hold lines** (`also=` elided):
- S6c: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:65436`, then `MACHINE_RELEASED … shell=bash.exe:65436`
- S6d: `… shell=bash.exe:80572`, released
- S6e: `… shell=bash.exe:5608`, released
- All three were granted at once.

**Push**
- `git -C C:/dev/wt/rcf push origin cut/recentre-crossing-view-displaced-fix` in its own call: `3df3e57c..b7ba9f77`.
- `git ls-remote origin refs/heads/cut/recentre-crossing-view-displaced-fix` gives `b7ba9f77cf737d1e1ea4d23545c36ea87b26a41a refs/heads/cut/recentre-crossing-view-displaced-fix`.
- Porcelain empty. No PR action, no CI wait.

**Background shells left:** none. All run and wait shells exited, and no `spatial-ide-shell` process remains (checked after S6e and again at the end). I killed nothing.

**Model:** Sonnet 5.5 (`claude-sonnet-5-5`), as the harness reports it.
