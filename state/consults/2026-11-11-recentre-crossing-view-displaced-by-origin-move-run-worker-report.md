*Custodian's filing note (2026-11-11): the worker's report on the reproducer's one run, under the form's OPEN-5 (B) variant, given in its hand-back. Dispatched at 23:45:48Z on 2026-11-11 by its transcript; the hand-back came at 23:55:28Z (claude-sonnet-5-5, a fresh worker; no compaction; unique calls from that dispatch: Read 7, Bash 27, Edit 6, Write 2, the hand-back, 43 in all; none errored). The run went inside one shared hold, released. The report below was extracted by script from the hand-back in that transcript (9340 bytes, sha256 9f3bad03398f23dca039a34833a20244bf3f686456b0129bbca56f16efcb3bae). It is unchanged except in one sentence, which named processes on the machine that are not this project's: it is replaced by a bracketed line saying so. One final newline is added. Three facts for the gate, the custodian's: the docs lane's worker, dispatched by the custodian with this run, ran the cite-and-quote checker (one node process, outside a hold, as its brief called all its work light) in its own worktree through this run, the process the report names; the worker searched the per-user folders for the app's session log; and it edited its reading script once by a script of its own after a first version, which it kept and does not read. The numbers below are one run's reading, not a docs/08 measurement, and not yet graded: the single reviewer of note 10 recomputes them.*

---

Observed: recentre-crossing-view-displaced-by-origin-move, run rc at 00bcb07db100c56e672afe99dbe3fe27f2638010

S = the brief's folder, scratchpad under .../da685a21-245c-4f3e-8f40-060e581f487c/. Nothing was committed or pushed.

**Where.**
- The worktree (C:/dev/wt/dg) HEAD was 00bcb07d..., on branch cut/recentre-crossing-view-displaced-by-origin-move, porcelain empty.
- The settlement's base check (diff outside state/governance/site from 00bcb07d to origin/main) printed nothing.
- The exe is 72112640 bytes, sha256 384ed094...86d78c, equal to the form's.
- node_modules is present; @deck.gl/core version is 9.3.9.
- df: C: 19G free, D: 189G free.
- dg-measure.patch is 14943 bytes, sha256 28483337...5ceb5910; I read it whole.

**The patch.**
- Choices (cited by what the diff vs dg-measure.patch shows):
  - The leg-3 entry (the single closing drag) is deleted.
  - `attachConsole` is subscribed after `dgNodeSide`.
  - The start settle and the end settle are `waitForSettle(() => rcConsole.renderTrace())` with defaults, each recorded as `rc-settle`.
  - `rcCapture` opens a fresh `page.context().newCDPSession(page)` per capture, the way `resizeWindow` does.
  - The clip is {x: box.left, y: box.top, width: box.cw, height: box.ch, scale: 1}.
  - The write is `writeFileSync` with flag wx and no await between the send and the write. Failed captures are recorded as `capture-failed`.
  - `createHash` is imported from node:crypto, for the capture sha256 record.
  - The init record carries tag "rc".
  - The "no end capture" record is `end-capture-not-taken`, written in the `finally`.
- rc.patch is 16649 bytes, sha256 cef12e83bc880f9cd0afdbed601ddbed9607653a2fb485c89d4dba2ddc5eb512.
- `node --check` passed. `git diff --name-only` named only frontends/shell/e2e/pan-anchor.mjs.
- The whole patch was shown as dg-measure.patch (read whole) plus the `diff` of the two patches; the `diff` output is the complete set of rc changes.
- After the revert the porcelain was empty. After re-apply, `git diff | sha256sum` equalled the patch's.

**Checks before the hold.**
- The process list (rc.procs-before.txt) held 8 node processes.
  - Four are runtimes of other tools.
  - [One sentence is elided here by the custodian: it named processes on the machine that are not this project's.]
  - One is `scripts/plan/verify-quotes.mjs` (PID 70808), run from a bash in worktree a35 by another agent. I judged it a short checker, not a build, test or suite, and went on. Its PID is 48008 in the later lists, so a verifier was running during the whole run. If you read it otherwise, the quiet condition is not shown.
- No cargo, rustc, cl, link or msbuild process and no spatial-ide-shell process.
- The 9223 check was empty (rc.port-before.txt is 0 bytes).

**Step 4.**
- Hold line, `also=` elided: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:65380`. Then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:65380 affinity=FF (cores 0-7)`.
- Stamps (rc.stamps.txt, whole): `script-start 2026-11-11T23:47:59Z`, `suite-start 2026-11-11T23:48:00Z`, `suite-end 2026-11-11T23:50:30Z`.
- `rc=0` (exit 0, no fatal line). The suite log's last lines are `drag 74/74 leg 2 dx -300 vs 2994..3035`, an empty line, then `==== 0/0 PASS ====`. The first line is `plan: zFit -3.692532927362801 L 300 d 3781.7171365684776 T 131072 n1 37 drags 74`. The second is `drag 1/74 leg 1 dx 300 vs 1..42`. The log has 74 drag lines (77 lines in all); the rest are in rc.suite.log.
- Fixture sha256 was fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 before and after.
- Process lists: suite-start equals before. Suite-end equals after. They differ from suite-start only in the verifier's PID (70808 became 48008). No spatial-ide-shell process was left.
- The 9223 check after release (rc.port-after.txt) shows only a TIME_WAIT, 127.0.0.1:9223 -> 127.0.0.1:12382. No listener.
- After the run, the checkout of pan-anchor.mjs left the porcelain empty, and the branch is as before.
- Size and sha256 of each file in S:

| file | bytes | sha256 |
|---|---|---|
| rc.node.jsonl | 1301331 | eab5d31494f8ef93d900e6df477c0beb4c8ea56d883d348ed4af9e5d6c3595e3 |
| rc.page.json | 469525 | 4366168d45e3e214715f44f9dd856187f45ec2deecaac49cd58a1ba135c616d2 |
| rc-start.png | 34623 | 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2 |
| rc-end.png | 3169 | 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062 |
| rc.patch | 16649 | cef12e83bc880f9cd0afdbed601ddbed9607653a2fb485c89d4dba2ddc5eb512 |
| rc-run.sh | 1381 | 500159e486f82d915d7584b181748d9137ca85f0008a52302495f8a556b738f0 |
| rc.stamps.txt | 98 | 9247da237207a7d3c9962d2f51565e76a3dfd6be9b31827cdb2696e52599af1a |
| rc.suite.log | 2886 | 90f8f693c785b378537c78994099b5793e795f020e8bfce24af379c354186a67 |
| rc.procs-before.txt and rc.procs-suite-start.txt | 1730 | 610b10656fe48f649e86d6996fd75ae0daff88d8fbacf4b98a51316e64167540 |
| rc.procs-suite-end.txt and rc.procs-after.txt | 1730 | e57d55ee30cc2e0c99f405458036343b160c17baf1fb3d63fbd9f0b133ee7f4a |
| rc.port-before.txt | 0 | e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 |
| rc.port-after.txt | 73 | 4d9e49257d2a73630abfda20e1ef5db00fbd7e205d68f9717dae114c5d35c8e7 |
| rc.app.log | 554 | 24215b0105c0e608bd12ef188914f5fe67d08e512ad10302cf7e14e7c430215a |
| rc.session.log | 139438 | 3eac402234f9026c74321654fbac2209f1846b5c8d29ab05e935bb73314d4a4d |

- The session log is the app's own per-user log for this run (session-1794440882, epoch 2026-11-11T23:48:02Z).
- No rc.audit.jsonl was written: the suite wrote no audit file, and the run script's refusal guard did not trip.

**Step 5, the reading.** Script rc-read.mjs is 13360 bytes, sha256 e27ecd8b87a0a2d438b8ee833fd1b65a64e8868f4052b72da997f41a1a887687. Output rc.read.out is 13657 bytes, sha256 2a24d3d48a6decdb21028916bc9e338c0c9022cf6f6424ebd93fdaf7901793e2.
- A first version of the script (kept as rc-read-v1.mjs.keep, sha256 8fc6dc7c...) numbered lines by the push wrapper's count. The fit line was pushed to `vs` before the wrapper existed, so that version had no start line and the line numbers were one low. I fixed it in the script, not the run: the fit line is now vs position 1. The fit line's time is the fit read's time, an upper bound. Only the second version's output is the reading.
- Plan: z_fit −3.692532927362801, L 300, d 3781.71713657, T(z_fit) 131072, n1 37. Drags: 74 = 2·n1 (74 drag-plan, drag-vs and drag-end events). Every drag's settle was `{settled: true}`, 41 lines per drag.
- Box: cw 668, ch 712, bw 668, bh 712, dpr 1, so bw/cw = bh/ch = 1.
- Start line (position 1): target (0, 0), origin (2603460.11416, 1200019.90237), W = (2603460.11416, 1200019.90237).
- End line (position 3035): target (478.371056591, 0), origin (1927728.67436, 1200019.90237), W = (1928207.04542, 1200019.90237). It is the last line of drag 74.
- The start settle was {settled: true, count: 0}. The end settle was {settled: true, count: 6021}. No capture failed.
- Origin changes: 5, at positions 1436→1437, 1477→1478, 1518→1519, 1559→1560, 1600→1601. The new lines are in drags 36 to 40 (the old lines in drags 35 to 39).
  - For each, dTarget is (0, 0) and ΔO equals the previous line's target.
  - ΔO values, x: −132133.843199, −135909.095862, −139684.348525, −135896.166914, −132107.985304.
  - Each meets (i) (hypot(old target) > 131072) and (ii) (|ΔO − old target| ≤ 2.9e-10).
- S = (−675731.439804, 0).
- E = (−675253.068748, 0); z = −3.69253292736; E_px = (−52228.0, 0).
- |E − S| = 478.371056591, against d = 3781.717 (≤ d).
- End line's (i): hypot(target) 478.371 > T 131072 is false.
- Screenshot rule: both images 668×712. B = (255,255,255). N_start 35248 of 475616, with C_start (365.660, 307.568). N_end 0, with C_end none. |ΔN| 35248 > 3524.8, so the pair differs.
- Precondition: met (5 origin changes after drag 1).
- Real's three conditions are all true (|E_px| > 4.0 on x; |E − S| ≤ d; the pair differs). Dismissed's condition (|E_px| ≤ 4.0 on both axes) is false. The script's arithmetic: Real's conditions all hold.
- This is one run's reading. It names no route and no grade, and it is not a docs/08 measurement.

**Notes for the gate.**
- The end image is blank white: N_end = 0.
- The PNG is 668 px wide, the same as cw, so the "scaled by bw/cw" step changed nothing here.

**Other.**
- I started one stray background `find` (PID 80792) while looking for the session log. I killed it by its PID; no background shell or process I started is still running.
- The rc.* files in S are all named `rc...`; I left pre-existing rc-form-draft.txt and rc246-before.md untouched.
- Not done (off-scope): nothing fixed or retried.
- Model: claude-sonnet-5-5 (Sonnet 5.5), as the harness reports it. No override. No context handoff received or produced.
- Self-check on the four failure classes:
  - Cross-module: the instrument consumes the real `attachOrLaunchExe`, `attachConsole` and `waitForSettle`, and the real view-state shape.
  - Completion claims: each points to a file and sha256 above.
  - User-facing messages: none were added.
  - Required tests: nothing was added or tested, since this is an observation. The reading script reached its assertions, and its numbers are in rc.read.out.
