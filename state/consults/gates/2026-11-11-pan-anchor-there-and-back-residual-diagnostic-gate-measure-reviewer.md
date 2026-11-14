Reviewed: cut/pan-anchor-there-and-back-residual-diagnostic @ 00bcb07db100c56e672afe99dbe3fe27f2638010 (the custodian's filing note, 2026-11-11: the single reviewer over run measure, by the diagnostic form's Amendment 1 (f), PLAN node pan-anchor-there-and-back-residual-diagnostic, the gate-log's reviewer attempt 2; a local branch, never pushed, and no PR, since the piece commits nothing; below, the hand-back, one final newline added and one change: its scratch folder's path, in its last paragraph, written as the scratch folder)
Reviewed: cut/pan-anchor-there-and-back-residual-diagnostic @ 00bcb07db100c56e672afe99dbe3fe27f2638010, run measure
Verdict: PASS

All nine checks hold. My recomputed crossings (5, at drags 35, 36, 37, 38 and 39) and kept gaps (0) equal the report's. I have no Correctness or Evidence finding. The notes at the end are record or wording findings and do not change the verdict.

Inputs checked by sha256 before use. All match the brief:
- the form at main 4a51e076: 7e1eeed0…c397a, 50240 B
- dg-measure-report.txt: 4741f7b2…11b8fc
- brief-dg-measure.md: c7ffa98e…bc2e2
- dg-gate-m.worker.jsonl: 1e04f485…3f47ac5
- dg-instrument.patch: a3e44da8…999f7a

Brief against Amendment 1: one wording difference. This brief puts the build hold's release before the run's first stamp. Item (a) and item (f) put it before the pre-check stamp. Amendment 1 governs. Both orders hold (item 2).

**1. Out-of-scope line**
Commands: a node script over the worker transcript that lists every tool call, deduplicated by id, with every Write/Edit target and every git apply/checkout; a grep of the patch's +/- lines; `git check-ignore -v`.
- Write and Edit targets: 14 calls, all under `<S>`:
  - 11 Edits of the scratch copy `<S>/dg-measure-work/…/pan-anchor.mjs`
  - 3 Writes: `<S>/dg-measure.procs.ps1`, `<S>/dg-measure-run.sh`, `<S>/dg-read-measure.mjs`
- Tracked-tree changes: four git apply/checkout calls, all on pan-anchor.mjs (apply instrument at 19:27:25Z, checkout at 19:27:37Z, apply measure at 19:27:53Z, checkout at 19:30:43Z). `git diff --name-only` named only frontends/shell/e2e/pan-anchor.mjs. The patch has 1 file.
- ADR: 0 patch lines with `coordinate` or `info.`. The instrument reads the view-state console line and page timers only.
- Wire: 0 lines touching `protocol/`. Security: 0 lines touching `WorkingCanvas`.
- Guarantee: 0 lines touching TOLERANCE_BUFFER_PX (:45). The hunks start at -33, -54, -93, -206, -257, -278 and -298; :45 is untouched.
- No app string is added.
- Build products are ignored: `.gitignore:7` covers dist-measure/ and `frontends/shell/.gitignore:1` covers e2e/out/.
- Holds. No mutation claim in the report.

**2. Build provenance (item (a))**
Commands: the transcript calls #5, #6, #8, #51 and the completion notification for bicg9lek4; `ls -la --time-style=full-iso` and `sha256sum` on the exe now.
- HEAD 00bcb07d with empty porcelain, both before the build (#5) and after it (#51).
- The diff from B to c1aea32a and from B to origin/main under frontends/ printed nothing.
- New target: #6 printed `ls: cannot access 'D:/wt-targets/dg-measure': No such file or directory` (byte-copied), exists rc=2.
- One build call, #8 at 19:03:17.184Z, background, inside a shared hold.
- Its task output (read in #51) ends with MACHINE_RELEASED and `[exited with code 0]`; the call exits with the build's rc. The notification is at 19:27:13.659Z.
- The log has exactly one Finished line, 447: `Finished \`release\` profile [optimized] target(s) in 23m 14s` (byte-copied).
- Exe now: 72112640 B, sha256 384ed094bdf5b4a1c5908f0a119c56f89dc17b1d378a401ac2932b90cb86d78c, equal to the report. mtime 2026-11-11 20:27:08.36 +0100 (19:27:08Z), after the build call's start.
- Order: release by 19:27:13Z, then the pre-check process list (#55, 19:27:45Z), then the first stamp (script-start 19:28:03Z). Holds.

**3. The patch**
Commands: `sha256sum dg-measure.patch` (284833375b…5910, 14943 B, equal to the report); Read of the whole patch; a node script that compares the +/- lines of dg-measure.patch against dg-instrument.patch and pattern-scans the lines only the measure patch adds.
- 43 added lines are measure-only, and 9 instrument lines are replaced. Those changes are exactly:
  - the attachOrLaunchExe import and launch, with the DG_MEASURE_EXE refusal (the call matches `attachOrLaunchExe(exePath, { timeoutMs })` at lib.mjs:254 @ B);
  - `seamAbsent`;
  - dgClock with an optional bound;
  - main's (b) block;
  - the closing dgClock before dgCollect.
- Deleted lines: only the resize and runCasesForSize calls.
- Pattern hits in the measure-only lines:
  - setCam 0, seam call 0, resize 0, settleCanvasSize 0;
  - capturePixels 1, and it is in a comment;
  - sleep 1: the fit-line wait `for (let i = 0; i < 20 && vs.length === 0; i++) await sleep(250)`, the same as pan-anchor.mjs:103 @ B (byte-copied);
  - setTimeout 1: the closing clock's bound, a race limit and not a wait;
  - readBox 1.
- In the run: setCam events 0, record events 0, seam records 0. The fit wait ran 0 turns: fit-wait at …258 and last-read at …259.
- Drag count from the suite log's z_fit −3.692532927362801:
  - d = (300 − 7.5)·2^3.6925… = 3781.7171365684776; T = min(131072, 2^26.69) = 131072; T/d = 34.659;
  - n1 = 34 + 3 = 37; 2·37 + 1 = 75 drags;
  - L = min(300, 334 − 8) = 300 (EDGE_MARGIN_PX = 2·4.0);
  - the recorded plan equals this on every field.
- The choices the report says Amendment 1 left the worker:
  - **Scratch copy, then copied over the instrument-patched file.** (c) allows it: (c) governs the patch's content, and the line comparison shows only (c)'s changes plus (b)'s main.
  - **Per-drag `drag-vs` slices.** (c) allows it. The run's one `last(vs)` read (the fit) is recorded with vs whole (`last-read`). The slices are an extra record, contiguous from index 1 with 0 breaks, so vs whole at any drag end can be rebuilt.
  - **The closing clock's 15 s bound.** (c) allows it. (c) requires the check to be its own evaluate right before the collection, and it is: closing t1 …415, collect t0 …415. The bound adds no wait; the check took 3 ms.
  - **Every drag from the canvas centre, leg 2 included.** (b) allows it, in its own words (pan-anchor.mjs:215).
  - **The readBox read.** (b) allows it. (b)'s L and the centre need cw and ch. readBox @ B (:76-90) is a single evaluate with no capturePixels and no sleep, unlike settleCanvasSize, which calls capturePixels.
  - **Unused resize and case code left defined.** (c) allows it: the drags run in place of the resizes and cases, and 0 setCam or record events fired.
- Holds.

**4. vite.config.ts at 00bcb07d**
Command: `git show 00bcb07db100c56e672afe99dbe3fe27f2638010:frontends/shell/vite.config.ts | node -e …` (95 lines, sha256 22305ad9…639c). The script strips `//` comments and counts code-line hits:
- drop 0, console 0, pure 0, `esbuild:` 0, terser 0;
- minify 1 (`minify: !process.env.TAURI_DEBUG ? "esbuild" : false,`);
- the one `drop` in the file is in the comment at :36.

There is no drop or pure option. The run agrees: 3075 view-state emissions reached the page's console.debug wrapper. Holds.

**5. The worktree now**
Command: `git rev-parse`, `git status --porcelain | wc -c`, `git diff --name-only | wc -c`, `git diff --cached --name-only | wc -c` in C:/dev/wt/dg.
- HEAD 00bcb07db100c56e672afe99dbe3fe27f2638010, branch cut/pan-anchor-there-and-back-residual-diagnostic.
- Porcelain 0 bytes, diff names 0 bytes, cached names 0 bytes.
- Revert in the transcript: #60 at 19:30:43Z ran `git checkout -- frontends/shell/e2e/pan-anchor.mjs` then porcelain, which printed only `PORC-END`. The earlier revert (#54) printed the same.
- Holds.

**6. The quiet condition and the 9223 checks (item (d))**
Commands: the sha256 lines of my script; awk/grep counts over the four lists; a node check of each list's script paths against `git ls-files`.
- The four process lists are byte-identical: 1173 B, sha256 e9e32de3…8b34, equal to the report.
- Each list has 7 processes, all node.exe:
  - heavy kinds (cargo, rustc, cl, clang-cl, clang, link, lld-link, msbuild, vite): 0;
  - spatial-ide-shell: 0;
  - lines naming this repository, its worktrees or wt-targets: 0;
  - script tokens: 2 absolute paths, none in this repository; 6 relative paths, 0 of them tracked files of this repository.
- The suite-start list was taken in the run script before the suite started (stamp order). The suite-end list was taken after it.
- port-before.txt: 0 B (sha256 e3b0c442…b855); #55 printed grep rc=1. Nothing was on 9223 before the hold.
- port-after.txt: 73 B (sha256 d345c2e7…829d), 1 line, LISTENING 0, TIME_WAIT 1, matching the report's words. The report gives no sha256 for either port file (note N3).
- Holds.

**7. Item (e)'s fields, recomputed**
Script: `<S>/dg-gate-m-recompute.mjs`, 15527 B, sha256 3a6f2e009f6ca356f0f383fce66a7b744cd359cee1b807c87d880bc4cda8ea26. It contains no apostrophe and passed `node --check`.
Output: `<S>/dg-gate-m-recompute.out`, 11862 B, sha256 2bbaecc7372832235973466c3c048a6f5b8c7564dcde767004f2fc56c1dbf3f7, rc 0.

What the output shows:
- 75 drags, all settled; the count rises by 41 on every drag.
- Crossings by (i) and (ii): 5, at drags 35, 36, 37, 38 and 39. No (i) without (ii) and no (ii) without (i). The (ii) residual is at most 2.04e-10.
- Origin changes: 5 across the 3075 drag lines, at k = 1436, 1477, 1518, 1559 and 1600. One zoom throughout.
- (b)'s worked expectation was crossings at drags 35 and 74. The fields show 35 to 39, and none at 74.
- Kept gaps: 0 (page array 0, `[dg-stall]` lines 0). At or over 1000 ms: 0.
- [receipt, push] intervals: 3075 checked, 0 overlapping a gap. Receipt-to-emission field mismatches: 0.
- Collection ok. Both clock checks: half-width 1.5 ms, offset in [−2, 1].

The worker's script, run afterwards to stdout only (it has no write calls), gives sha256 b94e0326…71d. That equals dg-measure.read.txt, and `diff` rc is 0. Field by field against my output:
- per-drag rows: 75/75 identical (index, leg, dx, start, up, end, settled, count, lines);
- the five crossings, drifts and origins: equal;
- clocks: equal;
- collection: equal;
- gaps: 0 = 0;
- intervals: 3075/0 = 3075/0.

Whole output, byte-copied from `<S>/dg-gate-m-recompute.out`:
```
== sha256 checks against the worker report
OK   dg-measure.node.jsonl 1317645 B e0b33d006d7f48cdccaf654d424600d93291d9a3cd494c5ea7f18a6e74eef9e5
OK   dg-measure.page.json 475654 B 8672fffc0656e3a7355df74d23770e599a6b61e0a425fea67507da0037f8626e
OK   dg-measure.suite.log 2929 B be469c07d2f67c5656d1faf42599af52e541ccfec28d66ff5cef37c2bf3b52de
OK   dg-measure.stamps.txt 98 B 0151ed3274888297e6df133d1c538698c05a15ddedff610f659563eba447c2d3
OK   dg-measure.build.log 15479 B 33e31c96a2ecbe070971ea6964dd3128d6fb512940b19308802988bb9d44b290
OK   dg-measure.patch 14943 B 284833375b70b2f31fa91ea8ddafb28cf43e0de3087fa21a44b391152ceb5910
OK   dg-measure-run.sh 1339 B 45b5b51a1d6d3dd93fb486ef0852208d19a83e3b98241463f562548620c85e47
OK   dg-measure.app.log 277 B 558ec4bb191f0b4cc25bbf73136eac6297666931d40799162c8d49ec536f5044
OK   dg-measure.session.log 138878 B 83b211af3df90cabc69b0b1610244b21ec588ce2a1204b82a3d3ad4e4c93ec37
OK   dg-measure.procs-before.txt 1173 B e9e32de3f48b4004df8926d5e8fe843ecf87e5019a15aed544eb32124f138b34
OK   dg-measure.procs-suite-start.txt 1173 B e9e32de3f48b4004df8926d5e8fe843ecf87e5019a15aed544eb32124f138b34
OK   dg-measure.procs-suite-end.txt 1173 B e9e32de3f48b4004df8926d5e8fe843ecf87e5019a15aed544eb32124f138b34
OK   dg-measure.procs-after.txt 1173 B e9e32de3f48b4004df8926d5e8fe843ecf87e5019a15aed544eb32124f138b34
WORDS dg-measure.port-before.txt 0 B sha256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 lines 0 LISTENING 0 TIME_WAIT 0 (the report gives words, no sha256)
WORDS dg-measure.port-after.txt 73 B sha256 d345c2e71912b6b82ed3ecd6080f9a3d1f9b5878eb5d627d6f3b499df85a829d lines 1 LISTENING 0 TIME_WAIT 1 (the report gives words, no sha256)

== node event counts {"init":1,"install":1,"clock":2,"step":2,"last-read":1,"plan":1,"drag-plan":75,"drag-start":75,"vs-recv":3075,"vs-push":3075,"drag-up":75,"drag-settled":75,"drag-end":75,"drag-vs":75,"collect":1}

== stamps: 3 lines; suite-start count 1 ; script-start 2026-11-11T19:28:03Z | suite-start 2026-11-11T19:28:05Z | suite-end 2026-11-11T19:30:25Z
== build log Finished lines: 1 447: Finished `release` profile [optimized] target(s) in 23m 14s
== node init events: 1 ; fatal events: 0

== clock checks (offset = node - page in [t0 - p, t1 - p]; midpoint; half-width)
after-install: t0 1794425291255 p 1794425291257 t1 1794425291258 offset [-2, 1] mid -0.5 half-width 1.5
closing: t0 1794425424412 p 1794425424414 t1 1794425424415 offset [-2, 1] mid -0.5 half-width 1.5
collect evaluate (its own p, not the closing check): t0 1794425424415 p 1794425424417 t1 1794425424700 offset [-2, 283] half-width 142.5
page-to-node map: midpoint of after-install, -0.5 ms; half-width used for window placement 1.5 ms

== plan as recorded: {"fit":{"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003},"zFit":-3.692532927362801,"cw":668,"L":300,"d":3781.7171365684776,"T":131072,"n1":37,"total":75}
== recomputed: L 300 (EDGE_MARGIN_PX 8) d 3781.7171365684776 T 131072 T/d 34.65938759209645 n1 37 total 75 k1 35 predicted crossings at 35 and 74
== recorded equals recomputed: L true d true T true n1 true total true; fit target (0, 0)
== suite log first line z_fit -3.692532927362801; equals plan zFit: true

== drags: plan 75 start 75 up 75 settled 75 end 75 vs 75
legs/dx against (b): mismatches 0; id mismatches 0; slice contiguity breaks 0; first slice from 1
idx leg dx start up end (ms after init) settled count lines
1 1 300 5050 5788 6796 true 42 41
2 1 300 6798 8851 9861 true 83 41
3 1 300 9863 10889 11882 true 124 41
4 1 300 11883 12957 13966 true 165 41
5 1 300 13968 15126 16130 true 206 41
6 1 300 16132 17295 18290 true 247 41
7 1 300 18291 19341 20338 true 288 41
8 1 300 20340 21120 22124 true 329 41
9 1 300 22126 22907 23915 true 370 41
10 1 300 23916 24636 25631 true 411 41
11 1 300 25632 26369 27364 true 452 41
12 1 300 27365 28069 29062 true 493 41
13 1 300 29063 29805 30811 true 534 41
14 1 300 30812 31552 32562 true 575 41
15 1 300 32563 33267 34261 true 616 41
16 1 300 34263 34985 35993 true 657 41
17 1 300 35994 36751 37755 true 698 41
18 1 300 37757 38486 39493 true 739 41
19 1 300 39494 40219 41219 true 780 41
20 1 300 41221 41951 42954 true 821 41
21 1 300 42955 43668 44672 true 862 41
22 1 300 44674 45400 46400 true 903 41
23 1 300 46401 47100 48097 true 944 41
24 1 300 48099 48818 49825 true 985 41
25 1 300 49826 50667 51667 true 1026 41
26 1 300 51668 52385 53401 true 1067 41
27 1 300 53402 54202 55211 true 1108 41
28 1 300 55213 55934 56942 true 1149 41
29 1 300 56943 57666 58671 true 1190 41
30 1 300 58672 59419 60421 true 1231 41
31 1 300 60422 61134 62134 true 1272 41
32 1 300 62135 62916 63923 true 1313 41
33 1 300 63924 64701 65700 true 1354 41
34 1 300 65701 66441 67440 true 1395 41
35 1 300 67441 68180 69184 true 1436 41
36 1 300 69185 69950 70941 true 1477 41
37 1 300 70942 71676 72680 true 1518 41
38 2 -300 72680 73412 74409 true 1559 41
39 2 -300 74410 75143 76136 true 1600 41
40 2 -300 76138 76848 77833 true 1641 41
41 2 -300 77834 78597 79602 true 1682 41
42 2 -300 79604 80314 81320 true 1723 41
43 2 -300 81321 82030 83036 true 1764 41
44 2 -300 83037 83763 84772 true 1805 41
45 2 -300 84773 85496 86488 true 1846 41
46 2 -300 86489 87196 88205 true 1887 41
47 2 -300 88206 88914 89909 true 1928 41
48 2 -300 89911 90615 91619 true 1969 41
49 2 -300 91620 92329 93322 true 2010 41
50 2 -300 93324 94029 95035 true 2051 41
51 2 -300 95036 95763 96763 true 2092 41
52 2 -300 96764 97495 98493 true 2133 41
53 2 -300 98494 99246 100240 true 2174 41
54 2 -300 100241 100945 101941 true 2215 41
55 2 -300 101943 102646 103640 true 2256 41
56 2 -300 103641 104394 105394 true 2297 41
57 2 -300 105395 106094 107099 true 2338 41
58 2 -300 107100 107811 108814 true 2379 41
59 2 -300 108815 109527 110532 true 2420 41
60 2 -300 110533 111261 112262 true 2461 41
61 2 -300 112263 112977 113985 true 2502 41
62 2 -300 113986 114911 115911 true 2543 41
63 2 -300 115912 116643 117647 true 2584 41
64 2 -300 117648 118376 119375 true 2625 41
65 2 -300 119377 120076 121075 true 2666 41
66 2 -300 121076 121776 122779 true 2707 41
67 2 -300 122781 123493 124491 true 2748 41
68 2 -300 124492 125192 126189 true 2789 41
69 2 -300 126190 126892 127892 true 2830 41
70 2 -300 127893 128625 129628 true 2871 41
71 2 -300 129629 130362 131357 true 2912 41
72 2 -300 131358 132059 133060 true 2953 41
73 2 -300 133061 133793 134790 true 2994 41
74 2 -300 134791 135495 136491 true 3035 41
75 3 300 136492 137192 138197 true 3076 41
unsettled 0; count steps min 41 max 41; first count 42; span 5050..138197 ms after init

== crossings: (i) last line of drag k has hypot(target) > T(zoom); (ii) first line of drag k+1 has origin = (i) origin + (i) target
crossing at drag 35: drift 132133.8431990764 > T 131072; (i) target (-132133.8431990764, 0) origin (2603460.114163697, 1200019.902370003); (ii) next first origin (2471326.2709646206, 1200019.902370003) target (-132133.8431990764, 0); residual (-2.0372681319713593e-10, 0)
crossing at drag 36: drift 135909.09586190715 > T 131072; (i) target (-135909.09586190715, 0) origin (2471326.2709646206, 1200019.902370003); (ii) next first origin (2335417.1751027135, 1200019.902370003) target (-135909.09586190715, 0); residual (2.9103830456733704e-11, 0)
crossing at drag 37: drift 139684.34852473793 > T 131072; (i) target (-139684.34852473793, 0) origin (2335417.1751027135, 1200019.902370003); (ii) next first origin (2195732.8265779754, 1200019.902370003) target (-139684.34852473793, 0); residual (-1.7462298274040222e-10, 0)
crossing at drag 38: drift 135896.1669144317 > T 131072; (i) target (-135896.1669144317, 0) origin (2195732.8265779754, 1200019.902370003); (ii) next first origin (2059836.6596635438, 1200019.902370003) target (-135896.1669144317, 0); residual (8.731149137020111e-11, 0)
crossing at drag 39: drift 132107.9853041255 > T 131072; (i) target (-132107.9853041255, 0) origin (2059836.6596635438, 1200019.902370003); (ii) next first origin (1927728.6743594182, 1200019.902370003) target (-132107.9853041255, 0); residual (-8.731149137020111e-11, 0)
crossings count 5: [35, 36, 37, 38, 39]
(i) without (ii): 0 []
(ii) without (i): 0 []
origin changes across all 3075 drag lines: 5 [{"atK":1436,"fromDrag":35,"toDrag":36},{"atK":1477,"fromDrag":36,"toDrag":37},{"atK":1518,"fromDrag":37,"toDrag":38},{"atK":1559,"fromDrag":38,"toDrag":39},{"atK":1600,"fromDrag":39,"toDrag":40}]
distinct zooms in drag lines: 1 -3.692532927362801

== kept gaps: page array 0; [dg-stall] receipts 0; threshold 200 ms; period 50 ms; ticks 2639
gaps at or over 1000 ms: 0 []

== view-state: emissions 3075 receipts 3075 pushes 3075; numbering breaks 0; push fields unequal to the same-numbered emission 0
[receipt, push] intervals checked 3075; overlapping a kept gap 0; not overlapping 3075; interval min 1 max 189 ms
pageerror 0; console error 0; listener error 0; page errs array 0

== collection: ok true failed null boundReached false missing false; ticks 2639; emits 3075; seam records 0; seamAbsent e2eSetViewState; seamStill true; vis visible; node recv 3075 push 3075 writeFail 0
install: seamWrapped false seamAbsent e2eSetViewState hasSurface true vis visible
steps: fit-wait, drags-done; setCam events 0; record events 0

== off-script lookup: each stated number against node.jsonl values, rounded to its stated decimals
FOUND     drift at drag 35 last line: stated 132133.8, file 132133.8431990764
FOUND     targetX at drag 35 last line: stated -132133.84, file -132133.8431990764
FOUND     targetX at drag 36 first line: stated -132133.84, file -132133.8431990764
FOUND     targetX+originX at drag 35 last line: stated 2471326.27, file 2471326.2709646206
FOUND     targetX+originX at drag 36 first line: stated 2339192.43, file 2339192.427765544
FOUND     targetX+originX at the fit view: stated 2603460.11, file 2603460.114163697
FOUND     targetX+originX at drag 75 last line: stated 1924431.79, file 1924431.7927531789
FOUND     targetX at drag 74 last line: stated 478.37, file 478.371056591438
drag 34 last: target (-128358.59053624561, 0) origin (2603460.114163697, 1200019.902370003) sumX 2475101.5236274516 | drag 35 first: target (-128358.59053624561, 0) origin (2603460.114163697, 1200019.902370003) sumX 2475101.5236274516
drag 35 last: target (-132133.8431990764, 0) origin (2603460.114163697, 1200019.902370003) sumX 2471326.2709646206 | drag 36 first: target (-132133.8431990764, 0) origin (2471326.2709646206, 1200019.902370003) sumX 2339192.427765544
drag 36 last: target (-135909.09586190715, 0) origin (2471326.2709646206, 1200019.902370003) sumX 2335417.1751027135 | drag 37 first: target (-135909.09586190715, 0) origin (2335417.1751027135, 1200019.902370003) sumX 2199508.0792408064
drag 37 last: target (-139684.34852473793, 0) origin (2335417.1751027135, 1200019.902370003) sumX 2195732.8265779754 | drag 38 first: target (-139684.34852473793, 0) origin (2195732.8265779754, 1200019.902370003) sumX 2056048.4780532375
drag 38 last: target (-135896.1669144317, 0) origin (2195732.8265779754, 1200019.902370003) sumX 2059836.6596635438 | drag 39 first: target (-135896.1669144317, 0) origin (2059836.6596635438, 1200019.902370003) sumX 1923940.4927491122
drag 39 last: target (-132107.9853041255, 0) origin (2059836.6596635438, 1200019.902370003) sumX 1927728.6743594182 | drag 40 first: target (-132107.9853041255, 0) origin (1927728.6743594182, 1200019.902370003) sumX 1795620.6890552926
drag 40 last: target (-128319.8036938193, 0) origin (1927728.6743594182, 1200019.902370003) sumX 1799408.870665599 | drag 41 first: target (-128319.8036938193, 0) origin (1927728.6743594182, 1200019.902370003) sumX 1799408.870665599
drag 74 last: target (478.371056591438, 0); drag 75 last: target (-3296.8816062393144, 0) origin (1927728.6743594182, 1200019.902370003)
end
```

**8. Nothing committed, retried or fixed**
Commands: `git rev-list --count 00bcb07d..cut/pan-anchor-there-and-back-residual-diagnostic` gives 0. The branch tip is 00bcb07d and its reflog has one entry ("Created from 00bcb07d…").
- Remote branches of that name: 0 (`git branch -r`, no network). No upstream is configured.
- Stamps: 1 suite-start. Build log: 1 Finished line. Node init events: 1, fatal 0.
- Transcript (66 tool calls, 41 Bash): 1 build call (#8), 1 run call (#57), 2 hold calls (those two), 0 git calls with a writing verb, no tool refusals.
- All 7 background tasks have completion notifications before the hand-back (19:32:12Z): the build, the run, and five wait loops.
- Holds.

**9. The off-script paragraph**
Every number it states was looked up in dg-measure.node.jsonl by my script (section "off-script lookup" above). All 8 were found:
- the drift 132133.8;
- the target −132133.84 before and after;
- the sums 2471326.27 and 2339192.43;
- the sums 2603460.11 (fit) and 1924431.79 (drag 75 last);
- 478.37 (drag 74 last).

None is missing. Holds.

**Notes (record and wording; they do not change the verdict)**
- **N1: the report's crossings bullet.** The report says: "A sixth line, the origin at drag 39's end, stays unchanged to drag 40." (byte-copied). The file shows the origin changing between drag 39's last line and drag 40's first line (k=1600, crossing 39's (ii)). After that it is unchanged from drag 40's first line through drag 75.
  - This is not the human's wording; it is the worker's report.
  - Replacement words: "After crossing 39, the origin does not change again: it is the same from drag 40's first line to drag 75's last line, 5 origin changes in all."
  - Each clause checked against the output: "origin changes … 5"; drag 40 first and drag 75 last both have origin 1927728.6743594182.
- **N2: a user-profile path in the report.** Report line 3 names a user-profile path for S, against the worker brief's last line. It should be written as `<S>` before the custodian files the report.
- **N3: port files without hashes.** The report gives no sha256 for port-before or port-after. I checked them against its words; the values are in item 6.
- **N4: worker brief compliance, no effect on the files.**
  - Most of the worker's Bash calls set no timeout of at least 300 s.
  - Five of its wait loops ran in background mode, which the brief allowed only for hold-shaped calls. All five completed before the hand-back.
- **N5: the worker's model.** The worker reports Sonnet 5.5 (claude-sonnet-5-5). Its transcript's assistant records all carry claude-sonnet-5-5. One api-request-shape metadata record carries claude-opus-5-5.
- **N6: my own `git status`.** My first `git status --porcelain` in C:/dev/wt/dg ran without GIT_OPTIONAL_LOCKS=0, so it may have refreshed the index's stat cache. No tracked content changed. My later git calls set the variable.
- I started no app, suite or build. The only files I wrote are `<S>/dg-gate-m-recompute.mjs` and `<S>/dg-gate-m-recompute.out`.

Model as the harness reports it: Opus 5.5 (claude-opus-5-5).

Files, where `<S>` = the scratch folder:
- `<S>/dg-gate-m-recompute.mjs`
- `<S>/dg-gate-m-recompute.out`
- C:/dev/spatial-ide/governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md
