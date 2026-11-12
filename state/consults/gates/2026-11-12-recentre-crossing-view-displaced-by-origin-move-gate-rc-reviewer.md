Reviewed: cut/recentre-crossing-view-displaced-by-origin-move @ 00bcb07db100c56e672afe99dbe3fe27f2638010 (the custodian's filing note, 2026-11-12: run rc, the single reviewer of the form's note 10, PLAN node recentre-crossing-view-displaced-by-origin-move; below, the hand-back byte-identical but for one line, elided by the custodian and marked where it stood; the hand-back ends with its own final newline, so none is added)
Reviewed: cut/recentre-crossing-view-displaced-by-origin-move @ 00bcb07db100c56e672afe99dbe3fe27f2638010, run rc
Verdict: PASS

The checks below were made against the form at main e380b76c (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-BY-ORIGIN-MOVE-PREREGISTRATION.md`). I recomputed its sha256: f7dd9f36fe7246986c7c70851b4e7f0aa5a9e0750048145fe44b08b934e2a7b7, equal to the brief's. I read the form whole, its OPEN-5 (B) variant included. I found no point where the brief and the form differ.

I recomputed the input hashes: rc-report.txt 9340 bytes, 9f3bad03…3bae; brief-rc-run.md 13542 bytes, 3d6f1894…53bb8; rc-gate.worker.jsonl 1175208 bytes, 19e65bf6…febe; dg-measure.patch 14943 bytes, 28483337…5910. Each equals the brief's value.

About the transcript: it holds 211 records. Each tool call appears twice, once as an `assistant` record and once as an `api-request-blob` copy. Deduplicated by tool_use id, there are 43 distinct calls. The `#n` numbers below are my numbering of those 43 calls, in order.

Where a check rests on a script, I show the script. Every other check is a read-only command of mine: sha256sum, stat, diff, git rev-parse, status, log, branch, reflog, show, apply --check, and node -e readers over the scratch files and the transcript.

---

**1. Out-of-scope line (read first). Holds.**
The line names ADR, security, wire and guarantee, each as "none". It names no §21a category as touched, so the five-line form stands.

What the report and the transcript show was written and run:
- **ADR.** The instrument reads the shell's `view-state` line and a devtools capture. The patch has no `info.coordinate` read.
- **Security.**
  - The capture goes out on the measure build's own 9223 port.
  - Both images are in `<S>`, outside the repository.
  - No dependency was added: `createHash` comes from `node:crypto`, which ships with node, and nothing was installed.
- **Wire.** Nothing under protocol/ was touched. The patch's only file is frontends/shell/e2e/pan-anchor.mjs (#17 `git diff --name-only`).
- **Guarantee.**
  - The tolerance line was not changed. The patch's hunks are at 33, 54, 93, 206, 257, 278 and 298 of the 00bcb07d file, and none rewrites `TOLERANCE_BUFFER_PX` (line 45).
  - No measurement is claimed: the report states that it is not a docs/08 measurement.
- **App strings.** No product file was edited, so no string the app shows changed.
- **Scope.**
  - The edit was kept as `<S>/rc.patch` with its sha256 and reverted twice (#19, #30).
  - Nothing was committed (item 8).

**2. The exe, the worktree before the hold, no build. Holds.**
- **The exe now** (`stat`, `sha256sum`): 72112640 bytes, 384ed094bdf5b4a1c5908f0a119c56f89dc17b1d378a401ac2932b90cb86d78c, mtime 2026-11-11 20:27:08 +0100. All equal to note 2's values.
- **The transcript, #5, at 23:46:02Z:**
  - HEAD 00bcb07db100c56e672afe99dbe3fe27f2638010, branch cut/recentre-crossing-view-displaced-by-origin-move, porcelain empty.
  - The settlement's base diff (00bcb07d to origin/main, outside state, governance and site) printed nothing.
  - The exe printed 72112640 bytes with the same sha256.
- **Before the hold:**
  - #19, after the first revert: the porcelain was empty.
  - #22: the patch was re-applied, with `git diff | sha256sum` = cef12e83…b512, equal to rc.patch. The only change was ` M frontends/shell/e2e/pan-anchor.mjs`, as note 4 orders.
- **No build call.** I grepped all 41 Bash commands for cargo, npm/npx, tauri build, vite, rustc and build. The only hits are the process-list name filter in #19 and #30, and the same filter inside rc-run.sh. No command builds anything.
- **Same tree.** I also checked by `git diff --name-only 00bcb07d e380b76c -- frontends renderer`: 0 paths.

**3. The patch. Holds.**
- **rc.patch:** 16649 bytes, sha256 cef12e83bc880f9cd0afdbed601ddbed9607653a2fb485c89d4dba2ddc5eb512, equal to the report. I read it whole, and `git apply --check` against 00bcb07d returns 0.
- **The two patches' difference** (`diff dg-measure.patch rc.patch`) is exactly these changes:
  - **Change 1 under (B):** the line `+    plan.push({ leg: 3, dx: L });` is deleted. The plan holds legs 1 and 2 only.
  - **Change 2:**
    - the `attachConsole` import, and `const rcConsole = attachConsole(page);` after `dgNodeSide(page, vs)`. No await stands between `setup()`'s return and the subscription.
    - after the plan, readBox and the plan's log line: `waitForSettle(() => rcConsole.renderTrace())` with its defaults, recorded as `rc-settle start`, then `rcCapture(page, box, "start")`, then the drag loop.
    - after the loop: the same settle, recorded as `rc-settle end`, then `rcCapture(..., "end")`.
    - in the `finally`: `end-capture-not-taken`, recorded when the end capture was not reached, then the carried closing `dgClock` and `dgCollect`.
    - `rcCapture` itself:
      - one `Page.captureScreenshot`, png, clip {box.left, box.top, cw, ch, scale 1}, on a `newCDPSession`;
      - `Date.now()` taken before the call and at its return;
      - the image decoded from base64 and written with `writeFileSync` flag `wx`, with no await between;
      - the byte length and sha256 then appended to the node file;
      - `capture-failed` recorded on any error, with no retry.
    - `createHash` imported from node:crypto.
  - **Change 3:** `tag: "rc"` in the init record. The prefix comes from the DG_DIAG_PREFIX variable, set to `<S>/rc` in rc-run.sh.
  - Everything else is hunk-offset churn.
- **The forbidden calls:**
  - `main` calls no setCam, no runCasesForSize, no resizeWindow and no capturePixels. The removed lines are the two resizeWindow calls and the two runCasesForSize calls. `setCam`'s `e2eSetViewState` evaluate is defined but unreachable from `main`.
  - The page calls are `dgInstall` (it wraps the seam if present and calls nothing; the record says `seamAbsent: "e2eSetViewState"`), `dgClock` (`Date.now`), `dgCollect`, `readBox` and `setup()`'s committed `openPath`. There is no other hook call.
- **Waits rc adds:** only the two settles. The fit-line wait (`sleep(250)` up to 20 times), the drag's own `waitForSettle(vs, 600/9000)` and the bounded clock and collect are carried from dg-measure.patch.

**4. The drag count. Holds.**
- The suite log's line 1, byte-copied: `plan: zFit -3.692532927362801 L 300 d 3781.7171365684776 T 131072 n1 37 drags 74`.
- My recomputation from that z_fit:
  - L = min(300, floor(668/2) − 8) = 300;
  - d = (300 − 7.5)·2^3.692532927362801 = 3781.7171365684776;
  - T = min(131072, 2^(23+3.6925…)) = 131072;
  - T/d = 34.659…, so n1 = 34 + 3 = 37, and 2·n1 = 74.
- The run made 74 drags: 74 drag lines in the suite log, 74 each of drag-plan, start, up, settled, end and vs. Leg 1 is 37 drags of +300, then leg 2 is 37 drags of −300.

**5. The worktree now. Holds.**
- In C:/dev/wt/dg: `git rev-parse HEAD` = 00bcb07db100c56e672afe99dbe3fe27f2638010; `git status --porcelain` and `git diff --name-only` are both empty.
- The revert steps in the transcript:
  - #19 (`git checkout -- frontends/shell/e2e/pan-anchor.mjs`, then an empty porcelain, before the hold);
  - #30 (the same, after release, with an empty porcelain);
  - #42 (the porcelain still empty, on the branch).

**6. The quiet condition and the 9223 checks. Holds.**
- **Hashes.** The four process lists' sha256: before = suite-start = 610b1065…7540; suite-end = after = e57d55ee…f4a. Both equal the report.
- **Contents.** Each list holds 8 lines, all node.exe. None is cargo, rustc, cl, clang-cl, link, msbuild, vite or spatial-ide-shell.
- **This project's processes.** I classified each line by whether its script path resolves inside this repository. Seven are other tools'. One is this project's: `node scripts/plan/verify-quotes.mjs`, PID 70808 in the before and suite-start lists and PID 48008 in the suite-end and after lists. The lists differ only in that line (`diff`: 8c8).
- **Where that process ran.** By the transcript (#20, #21), its parent shell ran in this project's worktree C:/dev/wt/a35. I found no heavy process of this repository in any list.
- [One line is elided here by the custodian: it named processes on the machine that are not this project's.]
- **9223 before the run:**
  - rc.port-before.txt is 0 bytes (e3b0c442…, the empty hash), from `netstat -ano | grep ':9223 '` with grep=1 (#19);
  - #21 adds a count of 0.
- **9223 after release:** rc.port-after.txt (73 bytes, 4d9e4925…c8e7) holds one TIME_WAIT line and no LISTENING line.
- **The custodian's fact** (the docs lane worker's checker). The lists do show such a process: one node process running scripts/plan/verify-quotes.mjs, rooted by its parent shell in a worktree of this repository, at all four instants. Because its PID changed, it was at least two invocations; the lists sample four instants and do not show it running throughout.
- **What the quiet condition's words say of it.** The diagnostic's note 3 and Amendment 1 (d), carried into note 7, stop the worker before the hold only when a process rooted in the repository is *heavy*. Heavy is the machine rule's "more than two cores for more than about three minutes, or any timed measurement". The custodian's dispatch line bars only another SpatialIDE *heavy* run.
  - The lists carry no CPU or duration field, so they neither show nor refute heaviness.
  - One node process running a file checker, outside a hold, called light by its brief, is not a heavy run under those words.
  - As written, the condition is met.
  - The report's own words ("If you read it otherwise, the quiet condition is not shown") put the reading to the gate. Under these words, the condition reads as shown.

**7. Note 5's fields, recomputed by my own script. Hold, and equal to the report.**
- The script: `<S>/rc-gate-recompute.mjs`, 15780 bytes, sha256 0785516b8ece671b5f16d63f95289eb6546abff6a3fcfc88a690f08d18b3378e.
- How I wrote it:
  - by quoted heredocs (one `cat >`, two `cat >>`), with 0 apostrophes by `grep -c`;
  - its backslashes survived, shown by grep: `const NL = "\n";` and `/zFit (\S+)/`;
  - `node --check` returned 0.
- What it does:
  - it checks each input by the report's sha256 first;
  - it rebuilds the vs array independently from the fit-read snapshot plus each drag-vs slice, and cross-checks each line against its vs-push record;
  - it decodes both PNGs with its own filter-reversing decoder over `node:zlib`.
- The output: `<S>/rc-gate-recompute.out`, 6478 bytes, sha256 93510a5904a9630e31c94797e52988f7d3d3f7f1d6d9f9503594ccec3febb1af. The whole output, byte-copied:

```
== 0. inputs, each checked by its sha256 (the report table)
rc.node.jsonl 1301331 bytes sha256 eab5d31494f8ef93d900e6df477c0beb4c8ea56d883d348ed4af9e5d6c3595e3 == report
rc.page.json 469525 bytes sha256 4366168d45e3e214715f44f9dd856187f45ec2deecaac49cd58a1ba135c616d2 == report
rc-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2 == report
rc-end.png 3169 bytes sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062 == report
rc.suite.log 2886 bytes sha256 90f8f693c785b378537c78994099b5793e795f020e8bfce24af379c354186a67 == report
rc.stamps.txt 98 bytes sha256 9247da237207a7d3c9962d2f51565e76a3dfd6be9b31827cdb2696e52599af1a == report
== 1. the plan
suite log line 1: plan: zFit -3.692532927362801 L 300 d 3781.7171365684776 T 131072 n1 37 drags 74
z_fit (log) -3.692532927362801; z_fit (plan record) -3.692532927362801; equal true
box cw 668 ch 712 bw 668 bh 712 dpr 1
L 300; d 3781.7171365684776; T(z_fit) 131072; T/d 34.65938759209645; n1 37; drag count 2*n1 = 74
recorded: L 300 d 3781.7171365684776 T 131072 n1 37 total 74; equal true
drag lines in suite log 74; drag-plan 74; drag-start 74; drag-up 74; drag-settled 74; drag-end 74; drag-vs 74
plan legs: leg 1 (dx +300) 37, leg 2 (dx -300) 37, other 0; leg 1 all before leg 2 true
drag settles not settled: 0
== 2. the lines
fit-read snapshot lines 1 (k ); rebuilt vs 3035 lines; slices contiguous true; vs-push records 3034, each equal to its rebuilt line true
distinct zooms over the run: -3.692532927362801
start line pos 1 (the fit line; last line before drag 1, drag 1 from 1): target (0, 0) origin (2603460.114163697, 1200019.902370003) zoom -3.692532927362801
W_start (2603460.114163697, 1200019.902370003)
end line pos 3035 (last line of drag 74; lines after it in the run: 0): target (478.371056591438, 0) origin (1927728.6743594182, 1200019.902370003) zoom -3.692532927362801
W_end (1928207.0454160096, 1200019.902370003)
last vs-push t 1794441025827; end capture t0 1794441029885; end line before end capture true
rc-settle start: {"settled":true,"count":0}
rc-settle end: {"settled":true,"count":6021}
capture start: t0 1794440889396 t1 1794440889492 bytes 34623 sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2 clip {"x":266,"y":40,"width":668,"height":712,"scale":1}
capture end: t0 1794441029885 t1 1794441029959 bytes 3169 sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062 clip {"x":266,"y":40,"width":668,"height":712,"scale":1}
capture-failed 0; end-capture-not-taken 0; fatal 0; pageerror 0; console-error 0
== 3. origin changes (consecutive lines, arrival order, origin differs)
pos 1436->1437 drag 35->36 (new line is the first line of the next drag: true) | old origin (2603460.114163697, 1200019.902370003) new (2471326.2709646206, 1200019.902370003) dO (-132133.8431990766, 0) | old target (-132133.8431990764, 0) new (-132133.8431990764, 0) dTarget (0, 0) | (i) 132133.8431990764 > 131072: true | (ii) |dO - old target| 2.0372681319713593e-10: true
pos 1477->1478 drag 36->37 (new line is the first line of the next drag: true) | old origin (2471326.2709646206, 1200019.902370003) new (2335417.1751027135, 1200019.902370003) dO (-135909.09586190712, 0) | old target (-135909.09586190715, 0) new (-135909.09586190715, 0) dTarget (0, 0) | (i) 135909.09586190715 > 131072: true | (ii) |dO - old target| 2.9103830456733704e-11: true
pos 1518->1519 drag 37->38 (new line is the first line of the next drag: true) | old origin (2335417.1751027135, 1200019.902370003) new (2195732.8265779754, 1200019.902370003) dO (-139684.3485247381, 0) | old target (-139684.34852473793, 0) new (-139684.34852473793, 0) dTarget (0, 0) | (i) 139684.34852473793 > 131072: true | (ii) |dO - old target| 1.7462298274040222e-10: true
pos 1559->1560 drag 38->39 (new line is the first line of the next drag: true) | old origin (2195732.8265779754, 1200019.902370003) new (2059836.6596635438, 1200019.902370003) dO (-135896.1669144316, 0) | old target (-135896.1669144317, 0) new (-135896.1669144317, 0) dTarget (0, 0) | (i) 135896.1669144317 > 131072: true | (ii) |dO - old target| 8.731149137020111e-11: true
pos 1600->1601 drag 39->40 (new line is the first line of the next drag: true) | old origin (2059836.6596635438, 1200019.902370003) new (1927728.6743594182, 1200019.902370003) dO (-132107.98530412558, 0) | old target (-132107.9853041255, 0) new (-132107.9853041255, 0) dTarget (0, 0) | (i) 132107.9853041255 > 131072: true | (ii) |dO - old target| 8.731149137020111e-11: true
count 5; after drag 1: 5; new-line drags 36,37,38,39,40; all (i) true; all (ii) true; all dTarget = 0 true
S = (-675731.439804279, 0)
drags whose last line has hypot(target) > T: 35,36,37,38,39
k1 = floor(T/d) + 1 = 35
== 4. E and the tolerance
E = (-675253.0687476876, 0); z -3.692532927362801; bw/cw 1; bh/ch 1; E_px = (-52228.00000000005, 0)
E - S = (478.3710565913934, 0); |E - S| = 478.3710565913934; d = 3781.7171365684776; |E - S| <= d true
end line (i): hypot(target) 478.371056591438 > T(z) 131072: false
== 5. the screenshot rule
start 668x712 depth 8 ctype 2 filters {"1":26,"2":643,"3":37,"4":6}; end 668x712 depth 8 ctype 2 filters {"2":711,"4":1}
ring pixels 2756; distinct ring colours 5; B = (255,255,255) on 2678; next 192,213,252 on 29
N_start 35248 of 475616; C_start (365.6604346345892, 307.567635043123) (pixel-index means, scaled by bw/cw 1, bh/ch 1)
N_end 0 of 475616; C_end none
|N_end - N_start| 35248 > 0.10*max 3524.8: true; both N > 0 false, |C_end - C_start| null: false
pair: differs
== 6. outcomes
precondition (an origin change after drag 1): true
Real: |E_px| > 4.0 on x or y true; |E - S| <= d true; pair differs true; all true
Dismissed: |E_px| <= 4.0 on x and y false
(B) new case of any other reading (end line meets (i), Real trace conditions fail, pair differs): false
the fields meet: Real
== 7. note 6 (B) items as fields
For H1, item 1: dTarget = 0 at every change true
For H1, item 2: changes on consecutive drags true, old drift > T at each true, dO = old target at each true; after the last change (new line drag 40) no change follows while the last lines of drags 35,36,37,38,39 exceed T
For H1, item 3: E approx S within d true; item 4: pair differs true; (B) item: end line does not meet (i) true
Against H1: a rebased next-line target at some change false; exactly one recorded change, at k1 false; end line meets (i) false; E within tolerance false; pair does not differ false
```

- **What the fields meet.** The precondition is met: 5 origin changes, all after drag 1. All three of Real's conditions hold:
  - |E_px,x| = 52228.0 > 4.0;
  - |E − S| = 478.371 ≤ d = 3781.717;
  - the pair differs: N 35248 → 0, with |ΔN| > 3524.8.
- **Dismissed's condition is false.** The (B) variant's new case of "any other reading" does not arise, because the end line does not meet (i): 478.37 is not over 131072.
- **Agreement with the worker, field by field.** I ran the worker's `rc-read.mjs` only after my own script. Its stdout equals `rc.read.out` (`diff --strip-trailing-cr`, rc 0). Each field of mine equals theirs at their printed precision:
  - z_fit, L, d, T, n1 and the count 74;
  - W_start and W_end;
  - the five changes: line positions 1436→1437, 1477→1478, 1518→1519, 1559→1560 and 1600→1601; drags 35→36 to 39→40; each ΔO, Δtarget = 0, and (i) and (ii) true;
  - S, E, z, E_px, bw/cw = bh/ch = 1, |E − S| and the end line's (i) = false;
  - dimensions 668×712, B (255,255,255), N_start 35248, C_start (365.660, 307.568), N_end 0 with no C_end, "differs";
  - the outcome: Real's conditions all hold.
- **The line numbers.** I reached the same positions by a different route: the fit-read snapshot plus the drag-vs slices, not the worker's offset of the push index by one.

**8. Nothing committed, retried or fixed. Holds.**
- `git log 00bcb07d..cut/recentre-crossing-view-displaced-by-origin-move` gives 0 commits.
- The reflog holds only "branch: Created from HEAD".
- `git branch -r` lists no branch of that name (no network used).
- rc.stamps.txt has one `suite-start` line.
- The transcript has one run call: #25, the shared hold plus `bash <S>/rc-run.sh`, with exit 0 and the hold released. rc-run.sh (1381 bytes, 500159e4…38f0) invokes the suite once.
- Nothing re-ran the app or the suite. The calls after #25 are:
  - reads and waits on the task output (#27 to #29);
  - the lists and the copies (#30 to #36);
  - the reading script's runs (#37, #40);
  - a node -e reader (#39);
  - the summary reads (#41);
  - the worker's kill of its own `find`, PID 80792 (#42). Its command line, per #41's result, is #32's own `find`, which was moved to the background at its 120 s timeout.
- **The reading script's two versions:**
  - `diff --strip-trailing-cr rc-read-v1.mjs.keep rc-read.mjs` shows one change only. Old line 21, the vs-push map, is replaced by five lines: two comments, then `fitRead`, `fitRec` with k 1 from `plan.fit`, and the pushes shifted to k + 1.
  - A plain `diff` shows every line changed, because v2 has CRLF line ends (`file`). It was rewritten by a python heredoc (#40).
  - v1's sha256 is 8fc6dc7cfbb86d480bb8ddb4e9b4e1d91146927a865b4d646673e6041e0497f4, which matches the report's prefix 8fc6dc7c.

**9. Note 8's deck.gl fact. Holds.**
- `C:/dev/wt/dg/frontends/shell/node_modules/@deck.gl/core/package.json` line 6, byte-copied: `"version": "9.3.9",`.
- `git log -G'@deck.gl/core' -- frontends/shell/package-lock.json` names only f827be01 (2026-08-09T13:03:36+02:00, the shell scaffold). `-G'core/-/core-'` names the same single commit.
- The lockfile's `node_modules/@deck.gl/core` version is 9.3.9 at f827be01, at 9ae12697 (2026-09-15T08:27:31+02:00), at 00bcb07d and at 8e09470c.

**10. Note 6, as the (B) variant leaves it.**
- **For H1:**
  - Δtarget ≈ 0 at each change: held (exactly 0 at all 5).
  - The changes repeat on consecutive drags while hypot(target) > T, each ΔO equal to the previous line's target: held. The drags whose last line exceeds T are exactly 35 to 39, each is followed by a change at the next drag's first line, and the residuals are ≤ 2.04e-10.
  - E ≈ S within d: held (478.37 ≤ 3781.72).
  - The pair differs: held.
  - (B) addition, the end line does not meet (i): held.
- **Against H1:**
  - A rebased next-line target: not held.
  - One recorded change at k1 = 35: not held (5 changes).
  - The end line meets (i): not held.
  - E within the tolerance: not held.
  - The pair does not differ: not held.
- No mixed reading arises.

---

**Notes (none changes the verdict):**
- N1. The report's process paragraph says that "a verifier was running during the whole run". The lists show this project's checker at four instants under two PIDs. They do not show continuity. The paragraph's word "whole" claims more than the lists show.
- N2. The worker's brief told it to write any file holding a backslash with the Write tool, never a shell heredoc. The v2 edit of rc-read.mjs was made by a python heredoc containing backslashes (#40). Its effect is CRLF line ends throughout v2. The content change is the five-line edit only, and the worker's output reproduces byte for byte (item 7).
- N3. The suite log ends with `==== 0/0 PASS ====`. That is the committed summary printed over an empty results list, not a check line. It is consistent with note 5's machine rule, which says the run has no PASS/FAIL line.
- N4. `attachConsole` is subscribed after `dgNodeSide`'s synchronous listener registration, with no await between it and `setup()`'s return. That is within note 4 (c)'s "right after `setup()` returns".
- N5. The z_fit is the measure run's to the last digit (−3.692532927362801). The form's estimate held: n1 = 37, 74 drags, changes at drags 35 to 39, S_x ≈ −675 731, E_x ≈ −675 253, E − S ≈ 478, an end image with N = 0.
- N6. Under (B), a change at drag 74's settled tick would be unrecorded. The end line's (i) is false, so no such change is signalled. Note 10's hand-on fact ("S not complete when the end line meets (i)") does not come into play for this run.

Background shells left: none. I started none, and every call ran in the foreground with a timeout.
Model: claude-opus-5-5 (Opus 5.5), as the harness reports it.
Files written: `<S>/rc-gate-recompute.mjs` and `<S>/rc-gate-recompute.out` only. No tracked file was changed and no writing git command was run.
