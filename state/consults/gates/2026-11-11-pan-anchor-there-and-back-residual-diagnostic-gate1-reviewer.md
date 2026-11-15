Reviewed: cut/pan-anchor-there-and-back-residual-diagnostic @ 00bcb07db100c56e672afe99dbe3fe27f2638010 (the custodian's filing note, 2026-11-11: gate 1, attempt 1, the single reviewer under the form's note 6, PLAN node pan-anchor-there-and-back-residual-diagnostic; a local branch, never pushed, and no PR, since the piece commits nothing; below, the hand-back byte-identical, one final newline added)
Reviewed: cut/pan-anchor-there-and-back-residual-diagnostic @ 00bcb07db100c56e672afe99dbe3fe27f2638010
Verdict: PASS

All six checks hold. My script recomputed the route as route 2, the same route the run quiet report states. Model, as the harness reports it: Opus 5.5 (`claude-opus-5-5`).

**Blocking findings**
- Correctness: none.
- Evidence: none.

**Documentation findings (must be fixed before the merge)**
- None in the two filed reports.

**My own deviation from the brief**
- The Write tool was not available in this run, so I could not write the script with it as the brief asks.
- I wrote it fresh by Bash quoted heredoc, in four chunks (`cat >`, then `cat >>` three times), and checked it with `node --check`.
- I first tested how the tool handles heredoc text. That created three scratch files: `<S>/dg-heredoc-probe.tmp`, `<S>/dg-probe2.tmp` and `<S>/dg-probe3.tmp`. Each was deleted in the same call. This goes against the brief's rule that I write only the script and its output.
- Two earlier heredoc attempts failed at bash parse, so they executed nothing.
- I changed no tracked file, ran no git command that writes, and ran nothing heavy.

---

**1. Out-of-scope line (read first, §21d)**
How I checked: `git show c56996b7:<path> | sed -n '<a>,<b>p' | sha256sum` for each pin on the line, `git diff --name-only c56996b7 00bcb07d -- frontends/ protocol/`, and greps of the patch.
- Pins recomputed, all equal at c56996b7:
  - `WorkingCanvas.tsx:2320`: efde387b…
  - `pan-anchor.mjs:45`: ffb43e0f…
  - `WorkingCanvas.tsx:2324-2349`: 18388468…
  - `renderTrace.ts:52-53`: 8850456b…
  - directive :16: 5d43e0ab…
  - directive :20-21: 30150726…
- No diff under `frontends/` or `protocol/` from c56996b7 to 00bcb07d.
- The patch changes only `frontends/shell/e2e/pan-anchor.mjs`.
  - It has no `info.coordinate`, no `protocol/` and no `http`/`fetch`.
  - It imports only `node:fs`.
  - It leaves the `TOLERANCE_BUFFER_PX` line unchanged.
- What the reports say was written and run, none of it in a §21a category:
  - `npm ci` from the lockfile.
  - Gitignored build outputs.
  - `cargo fetch --locked --offline`.
  - The exe build and the load build, which compiled `protocol/` crates but edited none.
  - A headless stub-page check with no port (`<S>/dg-itest.mjs` read: `page.setContent` with a stub seam).
  - The two suite runs.
- The line names no §21a category as touched, and none was. Holds.

**2. Patch `<S>/dg-instrument.patch`**
sha256 a3e44da80c6d69fbabac220eb579633c205a0a729a1e34e0a2fec4bdca999f7a, equal to the brief; 12221 bytes; read whole. Below, Pn means patch line n. Against note 1:
- **Stall record**:
  - Period 50 and threshold 200 (P20-21), as directive :16 sets them; a gap is kept when `len > thresh`.
  - Heartbeat by `setInterval` on `Date.now()`; each kept gap is `{start: lastTick, len, tick, vis}` (P72-82).
  - It is pushed to a page array (P78) and sent once as `console.log("[dg-stall]", …)` at the tick that ends it (P79).
  - The suite's listener ignores it: its filter is on `view-state` (pan-anchor.mjs:61 at B), and the stall line's JSON has no such text.
- **Emissions**: `console.debug` is wrapped and passes every call through (P83-93). It records seq, time and the five fields when `args[1] === "view-state"`, which matches `traceViewState`'s `(PREFIX, "view-state", {…})` shape (renderTrace.ts:52-53).
- **Seam**:
  - Pass-through wrapper (P94-110); the real seam is called at once (P101).
  - Records the call time and `visibilityState` (P98).
  - Records the sync return time, the promise settle time, and the result or the exception text (P101-105).
- **Node side**:
  - View-state receipt: taken synchronously first in the event (P54), numbered `n` (P60-61).
  - `vs.push`: wrapped, with the fields (P41-52).
  - `[dg-stall]` receipt (P57), `pageerror` (P64), console `error` (P58).
  - Per `setCam`: start (P162), evaluate's return (P166), return with `vs` whole and s0 (P174).
  - Per `drag`: start before the first mouse move (P187), mouse up (P193), `waitForSettle`'s `{settled, count}` (P194-195), end after the trailing sleep (P197).
  - `vs` whole and the line at each `last(vs)` read (P178-181).
  - There-and-back: `vs` between its two drags (P213).
- **Clocks**: after-install check (P116-124, called at P225); the closing check is inside the collection evaluate (P127, P135, P146).
- **Every exit path**:
  - `appendFileSync` per event (P30).
  - Collection in `finally` before `stop`, raced against a 15 s bound, with the failure recorded by name (P126-152, P239).
  - Fatal record appended (P248).
  - `wx` refuses an existing file name (P34-35).
- **No added wait**: the only added page calls are the install (P224), the after-install clock check (P225) and the end collection (P239). Note 1 permits exactly these. `waitForSettle` is the suite's own existing await, only captured.
- **No stale-line wrapper, no timer on the seam**: the seam wrapper has no `setTimeout`, and the instrument never writes into `vs`. The patch's only timers are the page heartbeat and the node-side collection bound.
- Note 1's records not made directly (findings that do not change the verdict):
  - (a) "A receipt with no push … recorded as such" is not a direct record; it is inferred from counts and position (worker's choice 3). None occurred: 558/558 in both runs.
  - (b) The `vs` snapshots carry the push index `k`, not the receipt arrival number `n`; the two are linked by position, and in run build every push k equals emission k (my script).
  - (c) The closing clock check is merged into the collection, not taken "right before" it (choice 2). So in run quiet the closing check was lost together with the page arrays.

**3. Worktree**
How I checked: in `C:/dev/wt/dg`, `git rev-parse HEAD`, `git status --porcelain`, `git diff --name-only`, `git diff --cached --name-only`, `git reflog HEAD`, and `sha256sum` of the suite file against `git show 00bcb07d:…`.
- HEAD is 00bcb07db100c56e672afe99dbe3fe27f2638010 on `cut/pan-anchor-there-and-back-residual-diagnostic`.
- Porcelain, unstaged diff and staged diff are all empty.
- `pan-anchor.mjs` sha256 is 17765b25…, equal at B and at main 1761df4b.
- The HEAD reflog has only the worktree-add entries, at 07:40:59 and 07:41:03 +0100.
- Revert steps:
  - Run build: `git checkout --`, porcelain empty after saving the patch and after the run (build report, Instrument section).
  - Run quiet: `git checkout --`, porcelain and `git diff --name-only` empty (quiet report, Step 5).
- Holds.

**4. Preconditions, stamps, overlap, hashes**
How I checked: `sha256sum` of every named file; my script below; awk listings of the four build process lists; reading the run scripts and the suite logs.
- Every hash matches its report:
  - Both stamps files, all eight process lists, both suite logs (6d5b694f…, 3afd0728…) and the four diag files.
  - The cargo log, both run scripts, the read scripts and their outputs.
  - The nine harness files.
  - The fixture, fd0c74ab… (read only).
- Run build:
  - The compiling line was stamped at 07:04:52Z, before suite-start at 07:04:54Z. The first Compiling line is `proc-macro2`, and the cargo log has 223 Compiling lines.
  - Load-build processes (command line naming `dg-load`): 6 rustc in the suite-start list, 8 clang-cl in the suite-end list.
  - The top cargo process (pids 31324 and 75416) is in both lists. The after-kill list has 0 processes naming `dg-load`.
  - The kill was stamped at 07:13:44Z, after suite-end at 07:13:42Z.
  - `D:/wt-targets/dg-load` is absent now.
- Run quiet:
  - The four lists are byte-identical (c79aa1dd…). Each holds 4 node.exe, none naming this repository; none is a heavy kind.
  - The custodian's filing note records the dispatch half of the quiet condition: nothing else was dispatched from 08:03:04Z to the report.
- Holds.

**5. Note 4 recomputed by my own script**
- Script: `<S>/dg-gate-recompute.mjs`, sha256 f8a450bd21fcbc4e0c9f369536e581072a2e32a764ce9de28d15e007e00d8fa3, 16020 bytes.
- Output: `<S>/dg-gate-recompute.out`, sha256 1b3d45820fa83245ffc3d3f7de9e824281ac871ab6d22a50b93d068115908622, 31528 bytes.
- Run as `timeout 60 node <S>/dg-gate-recompute.mjs <S>`, rc 0. It hash-checks each input first and stops on any mismatch.
- **Route condition the fields meet: route 2.** This equals the run quiet report's.
- Comparison with the workers: I did not run their read scripts. I compared my output against their saved outputs, `dg-build.read.txt` and `dg-quiet.read2.txt`, whose hashes equal the reported ones. They agree on:
  - gap counts (147/25 and 20/7);
  - every long gap's length and window;
  - 25 of 25 long stalls inside the build's overlap;
  - the quiet condition shown;
  - route 2;
  - the grading (page nets 0.00/1.00 within the tolerance; per size one s0 and two s1 reads not the page's own; run quiet not gradable from page lines).
- Differences between my output and theirs, none affecting a condition:
  - Mapped end times differ by up to about 12 ms, because of how each script maps the two clock checks.
  - My script counts processes of other runs in the build lists by command line only, and found 0. The worker's ancestor file (f670eb55…, matching) shows slot 1's P2 `cargo test` (pids 55640 and 74484, rooted in another worktree) at suite start. Their command lines carry no path, so my filter cannot see them. This is recorded, not a condition of run build. My 0 is not evidence of absence.

Whole output of `<S>/dg-gate-recompute.out`:
```
== INPUTS (sha256 against the worker reports)
  OK   dg-build.node.jsonl 242358 bytes bab6a4febdb6ca55e81ce5ae920fd855583525ea8bc45f299d3aafed47df189d
  OK   dg-build.page.json 79764 bytes d2fef64ba235dcee08e37e0267f68a2b6836663f70200c711aa06117bb0a413f
  OK   dg-quiet.node.jsonl 223610 bytes 7a578da74dbbd3bc7c6c93ac53e6147f9ed297ad3563d1de445d9e90032b7a87
  OK   dg-quiet.page.json 230 bytes 3e5d150cfb337691fa49c70196aba3c67773c3e7be1eeee83a31d9fe62bf8234
  OK   dg-build.stamps.txt 317 bytes f7a9f4daa13434f3a1561eed4fcd02817c93ce4c8f7b0cf0a4d3b26e0d526239
  OK   dg-quiet.stamps.txt 98 bytes e9ea0da1560db0eaf3444b2930c5492bd380e020ca8be20259dc518f4490fe63
  OK   dg-build.procs-before.txt 4580 bytes b5c084a99757eefda4cfc3799cf023072f7642097eb8c8aac6c5cf6c6e19464c
  OK   dg-build.procs-suite-start.txt 8066 bytes 7b560224d0d10282967d0e4eb9292803f81a7f1e6740e1ab4d8d63c877a1304c
  OK   dg-build.procs-suite-end.txt 37317 bytes 2310ef9b1c28cd1245764cfd35dca5cb1425b74b3c539e7f1ee27eb1e7cfbbc8
  OK   dg-build.procs-after-kill.txt 5216 bytes 7e32494dcbd3440c4579d4721410da4e9740e57dcf4975d352f521f382210c36
  OK   dg-quiet.procs-before.txt 794 bytes c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c
  OK   dg-quiet.procs-suite-start.txt 794 bytes c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c
  OK   dg-quiet.procs-suite-end.txt 794 bytes c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c
  OK   dg-quiet.procs-after.txt 794 bytes c79aa1dd6f4e4f0393d1bf40b5174f7b472acf69cfbb9770d85292839162c54c

== RUN BUILD
  clock checks: after-install offset [-91, 297] mid 103 hw 194; closing offset [-388, 290] mid -49 hw 339; half-width used 339
  page collection: collected (gaps array present); stall lines node received: 147; lines equal the page array gap for gap: true
  gap source: the page gaps array; kept gaps: 147; windows: setCam 14, drag 16
  g1 len 308 ms tick 1 vis visible node 2026-11-11T07:05:35.043Z .. 2026-11-11T07:05:35.351Z: between steps
  g2 len 274 ms tick 3 vis visible node 2026-11-11T07:05:35.476Z .. 2026-11-11T07:05:35.750Z: between steps
  g3 len 212 ms tick 19 vis visible node 2026-11-11T07:05:36.697Z .. 2026-11-11T07:05:36.909Z: between steps (at the edge of s:normal-A dx=300 setCam#1, s:normal-A dx=300 drag#2)
  g4 len 425 ms tick 25 vis visible node 2026-11-11T07:05:37.291Z .. 2026-11-11T07:05:37.716Z: in s:normal-A dx=300 drag#2 (at the edge of s:normal-A dx=300 setCam#1)
  g5 len 320 ms tick 185 vis visible node 2026-11-11T07:05:46.488Z .. 2026-11-11T07:05:46.808Z: between steps
  g6 len 203 ms tick 188 vis visible node 2026-11-11T07:05:46.965Z .. 2026-11-11T07:05:47.168Z: between steps
  g7 len 204 ms tick 194 vis visible node 2026-11-11T07:05:47.855Z .. 2026-11-11T07:05:48.059Z: between steps
  g8 len 262 ms tick 198 vis visible node 2026-11-11T07:05:48.345Z .. 2026-11-11T07:05:48.607Z: between steps
  g9 len 212 ms tick 202 vis visible node 2026-11-11T07:05:49.056Z .. 2026-11-11T07:05:49.268Z: between steps
  g10 len 219 ms tick 206 vis visible node 2026-11-11T07:05:49.543Z .. 2026-11-11T07:05:49.762Z: between steps
  g11 len 230 ms tick 208 vis visible node 2026-11-11T07:05:49.820Z .. 2026-11-11T07:05:50.050Z: between steps
  g12 len 231 ms tick 209 vis visible node 2026-11-11T07:05:50.050Z .. 2026-11-11T07:05:50.281Z: between steps
  g13 len 275 ms tick 216 vis visible node 2026-11-11T07:05:50.958Z .. 2026-11-11T07:05:51.233Z: between steps
  g14 len 337 ms tick 217 vis visible node 2026-11-11T07:05:51.233Z .. 2026-11-11T07:05:51.570Z: between steps
  g15 len 316 ms tick 225 vis visible node 2026-11-11T07:05:52.286Z .. 2026-11-11T07:05:52.602Z: between steps
  g16 len 256 ms tick 226 vis visible node 2026-11-11T07:05:52.602Z .. 2026-11-11T07:05:52.858Z: between steps
  g17 len 373 ms tick 232 vis visible node 2026-11-11T07:05:53.434Z .. 2026-11-11T07:05:53.807Z: between steps
  g18 len 205 ms tick 234 vis visible node 2026-11-11T07:05:53.984Z .. 2026-11-11T07:05:54.189Z: between steps
  g19 len 282 ms tick 235 vis visible node 2026-11-11T07:05:54.189Z .. 2026-11-11T07:05:54.471Z: between steps
  g20 len 316 ms tick 239 vis visible node 2026-11-11T07:05:54.816Z .. 2026-11-11T07:05:55.132Z: between steps
  g21 len 217 ms tick 242 vis visible node 2026-11-11T07:05:55.477Z .. 2026-11-11T07:05:55.694Z: between steps
  g22 len 275 ms tick 247 vis visible node 2026-11-11T07:05:56.309Z .. 2026-11-11T07:05:56.584Z: between steps
  g23 len 208 ms tick 248 vis visible node 2026-11-11T07:05:56.584Z .. 2026-11-11T07:05:56.792Z: between steps
  g24 len 275 ms tick 249 vis visible node 2026-11-11T07:05:56.792Z .. 2026-11-11T07:05:57.067Z: between steps
  g25 len 368 ms tick 254 vis visible node 2026-11-11T07:05:57.418Z .. 2026-11-11T07:05:57.786Z: between steps
  g26 len 410 ms tick 256 vis visible node 2026-11-11T07:05:57.869Z .. 2026-11-11T07:05:58.279Z: between steps
  g27 len 327 ms tick 257 vis visible node 2026-11-11T07:05:58.279Z .. 2026-11-11T07:05:58.606Z: between steps
  g28 len 217 ms tick 260 vis visible node 2026-11-11T07:05:58.736Z .. 2026-11-11T07:05:58.953Z: between steps
  g29 len 250 ms tick 261 vis visible node 2026-11-11T07:05:58.953Z .. 2026-11-11T07:05:59.203Z: between steps
  g30 len 356 ms tick 262 vis visible node 2026-11-11T07:05:59.203Z .. 2026-11-11T07:05:59.559Z: between steps
  g31 len 226 ms tick 263 vis visible node 2026-11-11T07:05:59.559Z .. 2026-11-11T07:05:59.785Z: between steps
  g32 len 217 ms tick 265 vis visible node 2026-11-11T07:05:59.922Z .. 2026-11-11T07:06:00.139Z: between steps
  g33 len 244 ms tick 266 vis visible node 2026-11-11T07:06:00.138Z .. 2026-11-11T07:06:00.382Z: between steps
  g34 len 377 ms tick 267 vis visible node 2026-11-11T07:06:00.382Z .. 2026-11-11T07:06:00.759Z: between steps
  g35 len 222 ms tick 268 vis visible node 2026-11-11T07:06:00.759Z .. 2026-11-11T07:06:00.981Z: between steps
  g36 len 560 ms tick 269 vis visible node 2026-11-11T07:06:00.981Z .. 2026-11-11T07:06:01.541Z: between steps
  g37 len 214 ms tick 271 vis visible node 2026-11-11T07:06:01.669Z .. 2026-11-11T07:06:01.883Z: between steps
  g38 len 478 ms tick 272 vis visible node 2026-11-11T07:06:01.883Z .. 2026-11-11T07:06:02.361Z: between steps
  g39 len 387 ms tick 273 vis visible node 2026-11-11T07:06:02.361Z .. 2026-11-11T07:06:02.748Z: between steps
  g40 len 218 ms tick 274 vis visible node 2026-11-11T07:06:02.748Z .. 2026-11-11T07:06:02.966Z: between steps
  g41 len 242 ms tick 275 vis visible node 2026-11-11T07:06:02.966Z .. 2026-11-11T07:06:03.208Z: between steps
  g42 len 228 ms tick 278 vis visible node 2026-11-11T07:06:03.452Z .. 2026-11-11T07:06:03.680Z: between steps
  g43 len 208 ms tick 280 vis visible node 2026-11-11T07:06:03.838Z .. 2026-11-11T07:06:04.046Z: between steps
  g44 len 377 ms tick 281 vis visible node 2026-11-11T07:06:04.046Z .. 2026-11-11T07:06:04.423Z: between steps
  g45 len 224 ms tick 283 vis visible node 2026-11-11T07:06:04.593Z .. 2026-11-11T07:06:04.817Z: between steps
  g46 len 243 ms tick 286 vis visible node 2026-11-11T07:06:05.015Z .. 2026-11-11T07:06:05.258Z: between steps
  g47 len 259 ms tick 287 vis visible node 2026-11-11T07:06:05.258Z .. 2026-11-11T07:06:05.517Z: between steps
  g48 len 365 ms tick 288 vis visible node 2026-11-11T07:06:05.517Z .. 2026-11-11T07:06:05.882Z: between steps
  g49 len 373 ms tick 293 vis visible node 2026-11-11T07:06:06.401Z .. 2026-11-11T07:06:06.774Z: between steps
  g50 len 292 ms tick 294 vis visible node 2026-11-11T07:06:06.774Z .. 2026-11-11T07:06:07.066Z: between steps
  g51 len 211 ms tick 295 vis visible node 2026-11-11T07:06:07.066Z .. 2026-11-11T07:06:07.277Z: between steps
  g52 len 314 ms tick 296 vis visible node 2026-11-11T07:06:07.277Z .. 2026-11-11T07:06:07.591Z: between steps
  g53 len 287 ms tick 297 vis visible node 2026-11-11T07:06:07.591Z .. 2026-11-11T07:06:07.878Z: between steps
  g54 len 337 ms tick 301 vis visible node 2026-11-11T07:06:08.337Z .. 2026-11-11T07:06:08.674Z: between steps
  g55 len 364 ms tick 308 vis visible node 2026-11-11T07:06:09.408Z .. 2026-11-11T07:06:09.772Z: between steps
  g56 len 222 ms tick 309 vis visible node 2026-11-11T07:06:09.772Z .. 2026-11-11T07:06:09.994Z: between steps
  g57 len 370 ms tick 311 vis visible node 2026-11-11T07:06:10.187Z .. 2026-11-11T07:06:10.557Z: between steps
  g58 len 581 ms tick 322 vis visible node 2026-11-11T07:06:11.182Z .. 2026-11-11T07:06:11.763Z: between steps
  g59 len 579 ms tick 323 vis visible node 2026-11-11T07:06:11.763Z .. 2026-11-11T07:06:12.342Z: between steps
  g60 len 330 ms tick 330 vis visible node 2026-11-11T07:06:12.902Z .. 2026-11-11T07:06:13.232Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g61 len 266 ms tick 331 vis visible node 2026-11-11T07:06:13.232Z .. 2026-11-11T07:06:13.498Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g62 *LONG* len 1002 ms tick 332 vis visible node 2026-11-11T07:06:13.498Z .. 2026-11-11T07:06:14.500Z: in s:paint-vs-event dx=85 drag#6
  g63 len 307 ms tick 334 vis visible node 2026-11-11T07:06:14.532Z .. 2026-11-11T07:06:14.839Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g64 len 211 ms tick 335 vis visible node 2026-11-11T07:06:14.839Z .. 2026-11-11T07:06:15.050Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g65 len 344 ms tick 336 vis visible node 2026-11-11T07:06:15.050Z .. 2026-11-11T07:06:15.394Z: in s:paint-vs-event dx=85 drag#6
  g66 len 268 ms tick 350 vis visible node 2026-11-11T07:06:16.180Z .. 2026-11-11T07:06:16.448Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g67 len 203 ms tick 351 vis visible node 2026-11-11T07:06:16.448Z .. 2026-11-11T07:06:16.651Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g68 len 295 ms tick 352 vis visible node 2026-11-11T07:06:16.651Z .. 2026-11-11T07:06:16.946Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g69 len 235 ms tick 353 vis visible node 2026-11-11T07:06:16.946Z .. 2026-11-11T07:06:17.181Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g70 len 212 ms tick 705 vis visible node 2026-11-11T07:06:37.123Z .. 2026-11-11T07:06:37.335Z: between steps (at the edge of s:paint-vs-event dx=85 drag#6)
  g71 len 239 ms tick 712 vis visible node 2026-11-11T07:06:37.623Z .. 2026-11-11T07:06:37.862Z: between steps
  g72 len 206 ms tick 721 vis visible node 2026-11-11T07:06:38.379Z .. 2026-11-11T07:06:38.585Z: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g73 len 228 ms tick 723 vis visible node 2026-11-11T07:06:38.624Z .. 2026-11-11T07:06:38.852Z: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g74 len 210 ms tick 733 vis visible node 2026-11-11T07:06:39.273Z .. 2026-11-11T07:06:39.483Z: between steps (at the edge of s:paint-vs-event dx=-85 setCam#7)
  g75 len 216 ms tick 741 vis visible node 2026-11-11T07:06:39.822Z .. 2026-11-11T07:06:40.038Z: between steps
  g76 len 249 ms tick 749 vis visible node 2026-11-11T07:06:40.373Z .. 2026-11-11T07:06:40.622Z: between steps
  g77 len 240 ms tick 756 vis visible node 2026-11-11T07:06:40.921Z .. 2026-11-11T07:06:41.161Z: between steps
  g78 len 229 ms tick 912 vis visible node 2026-11-11T07:06:52.069Z .. 2026-11-11T07:06:52.298Z: between steps (at the edge of s:paint-vs-event dx=-85 drag#8)
  g79 len 243 ms tick 919 vis visible node 2026-11-11T07:06:52.582Z .. 2026-11-11T07:06:52.825Z: between steps
  g80 len 219 ms tick 926 vis visible node 2026-11-11T07:06:53.118Z .. 2026-11-11T07:06:53.337Z: between steps (at the edge of s:there-and-back-net setCam#9)
  g81 len 245 ms tick 927 vis visible node 2026-11-11T07:06:53.337Z .. 2026-11-11T07:06:53.582Z: between steps (at the edge of s:there-and-back-net setCam#9)
  g82 len 228 ms tick 929 vis visible node 2026-11-11T07:06:53.619Z .. 2026-11-11T07:06:53.847Z: between steps (at the edge of s:there-and-back-net setCam#9, s:there-and-back-net drag#10)
  g83 len 349 ms tick 938 vis visible node 2026-11-11T07:06:54.218Z .. 2026-11-11T07:06:54.567Z: in s:there-and-back-net drag#10 (at the edge of s:there-and-back-net setCam#9)
  g84 len 330 ms tick 1017 vis visible node 2026-11-11T07:07:00.917Z .. 2026-11-11T07:07:01.247Z: between steps (at the edge of s:there-and-back-net drag#10, s:there-and-back-net drag#11)
  g85 len 228 ms tick 1119 vis visible node 2026-11-11T07:07:09.014Z .. 2026-11-11T07:07:09.242Z: between steps (at the edge of s:there-and-back-net drag#11, s:recenter-crossing-A dx=1200 setCam#12)
  g86 len 318 ms tick 1131 vis visible node 2026-11-11T07:07:09.763Z .. 2026-11-11T07:07:10.081Z: between steps (at the edge of s:recenter-crossing-A dx=1200 setCam#12, s:recenter-crossing-A dx=1200 drag#13)
  g87 len 885 ms tick 1142 vis visible node 2026-11-11T07:07:10.764Z .. 2026-11-11T07:07:11.649Z: in s:recenter-crossing-A dx=1200 drag#13
  g88 len 868 ms tick 1146 vis visible node 2026-11-11T07:07:11.811Z .. 2026-11-11T07:07:12.679Z: in s:recenter-crossing-A dx=1200 drag#13
  g89 *LONG* len 8341 ms tick 1148 vis visible node 2026-11-11T07:07:12.809Z .. 2026-11-11T07:07:21.150Z: in s:recenter-crossing-A dx=1200 drag#13
  g90 *LONG* len 18528 ms tick 1150 vis visible node 2026-11-11T07:07:21.160Z .. 2026-11-11T07:07:39.688Z: in s:recenter-crossing-A dx=1200 drag#13
  g91 *LONG* len 12163 ms tick 1163 vis visible node 2026-11-11T07:07:40.503Z .. 2026-11-11T07:07:52.666Z: in s:recenter-crossing-A dx=1200 drag#13
  g92 *LONG* len 10897 ms tick 1166 vis visible node 2026-11-11T07:07:52.821Z .. 2026-11-11T07:08:03.718Z: in s:recenter-crossing-A dx=1200 drag#13
  g93 *LONG* len 10417 ms tick 1170 vis visible node 2026-11-11T07:08:03.916Z .. 2026-11-11T07:08:14.333Z: in s:recenter-crossing-A dx=1200 drag#13
  g94 len 202 ms tick 1176 vis visible node 2026-11-11T07:08:14.541Z .. 2026-11-11T07:08:14.743Z: between steps (at the edge of s:recenter-crossing-A dx=1200 drag#13)
  g95 *LONG* len 12203 ms tick 1177 vis visible node 2026-11-11T07:08:14.743Z .. 2026-11-11T07:08:26.946Z: in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14
  g96 *LONG* len 1484 ms tick 1178 vis visible node 2026-11-11T07:08:26.942Z .. 2026-11-11T07:08:28.426Z: in s:recenter-crossing-A dx=-1200 setCam#14 + s:recenter-crossing-A dx=-1200 drag#15
  g97 len 256 ms tick 1179 vis visible node 2026-11-11T07:08:28.425Z .. 2026-11-11T07:08:28.681Z: between steps (at the edge of s:recenter-crossing-A dx=-1200 drag#15)
  g98 len 694 ms tick 1191 vis visible node 2026-11-11T07:08:29.387Z .. 2026-11-11T07:08:30.081Z: in s:recenter-crossing-A dx=-1200 drag#15
  g99 len 378 ms tick 1195 vis visible node 2026-11-11T07:08:30.252Z .. 2026-11-11T07:08:30.630Z: in s:recenter-crossing-A dx=-1200 drag#15
  g100 *LONG* len 7434 ms tick 1199 vis visible node 2026-11-11T07:08:30.786Z .. 2026-11-11T07:08:38.220Z: in s:recenter-crossing-A dx=-1200 drag#15
  g101 *LONG* len 15443 ms tick 1204 vis visible node 2026-11-11T07:08:38.384Z .. 2026-11-11T07:08:53.827Z: in s:recenter-crossing-A dx=-1200 drag#15
  g102 *LONG* len 6622 ms tick 1210 vis visible node 2026-11-11T07:08:54.030Z .. 2026-11-11T07:09:00.652Z: in s:recenter-crossing-A dx=-1200 drag#15
  g103 *LONG* len 10626 ms tick 1213 vis visible node 2026-11-11T07:09:00.801Z .. 2026-11-11T07:09:11.427Z: in s:recenter-crossing-A dx=-1200 drag#15
  g104 *LONG* len 10423 ms tick 1216 vis visible node 2026-11-11T07:09:11.587Z .. 2026-11-11T07:09:22.010Z: in s:recenter-crossing-A dx=-1200 drag#15
  g105 *LONG* len 11496 ms tick 1219 vis visible node 2026-11-11T07:09:22.167Z .. 2026-11-11T07:09:33.663Z: in s:recenter-crossing-A dx=-1200 drag#15
  g106 *LONG* len 10594 ms tick 1223 vis visible node 2026-11-11T07:09:33.825Z .. 2026-11-11T07:09:44.419Z: in s:recenter-crossing-A dx=-1200 drag#15
  g107 *LONG* len 11740 ms tick 1227 vis visible node 2026-11-11T07:09:44.615Z .. 2026-11-11T07:09:56.355Z: in s:recenter-crossing-A dx=-1200 drag#15
  g108 len 353 ms tick 1237 vis visible node 2026-11-11T07:09:56.859Z .. 2026-11-11T07:09:57.212Z: between steps (at the edge of l:normal-A dx=300 setCam#16)
  g109 *LONG* len 1736 ms tick 1243 vis visible node 2026-11-11T07:09:57.458Z .. 2026-11-11T07:09:59.194Z: in l:normal-A dx=300 setCam#16 (at the edge of l:normal-A dx=300 drag#17)
  g110 len 310 ms tick 1248 vis visible node 2026-11-11T07:09:59.359Z .. 2026-11-11T07:09:59.669Z: between steps (at the edge of l:normal-A dx=300 setCam#16, l:normal-A dx=300 drag#17)
  g111 len 283 ms tick 1376 vis visible node 2026-11-11T07:10:08.412Z .. 2026-11-11T07:10:08.695Z: between steps (at the edge of l:normal-A dx=-300 setCam#18, l:normal-A dx=-300 drag#19)
  g112 len 360 ms tick 1439 vis visible node 2026-11-11T07:10:12.853Z .. 2026-11-11T07:10:13.213Z: in l:normal-A dx=-300 drag#19
  g113 len 207 ms tick 1508 vis visible node 2026-11-11T07:10:17.506Z .. 2026-11-11T07:10:17.713Z: between steps (at the edge of l:normal-A dx=-300 drag#19, l:paint-vs-event dx=250 setCam#20)
  g114 len 326 ms tick 1518 vis visible node 2026-11-11T07:10:18.153Z .. 2026-11-11T07:10:18.479Z: between steps (at the edge of l:paint-vs-event dx=250 setCam#20)
  g115 len 335 ms tick 1526 vis visible node 2026-11-11T07:10:18.801Z .. 2026-11-11T07:10:19.136Z: between steps
  g116 len 348 ms tick 1534 vis visible node 2026-11-11T07:10:19.451Z .. 2026-11-11T07:10:19.799Z: between steps
  g117 len 362 ms tick 1536 vis visible node 2026-11-11T07:10:19.850Z .. 2026-11-11T07:10:20.212Z: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g118 len 250 ms tick 1539 vis visible node 2026-11-11T07:10:20.301Z .. 2026-11-11T07:10:20.551Z: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g119 len 363 ms tick 1716 vis visible node 2026-11-11T07:10:31.398Z .. 2026-11-11T07:10:31.761Z: between steps (at the edge of l:paint-vs-event dx=250 drag#21)
  g120 len 321 ms tick 1724 vis visible node 2026-11-11T07:10:32.097Z .. 2026-11-11T07:10:32.418Z: between steps
  g121 len 328 ms tick 1732 vis visible node 2026-11-11T07:10:32.746Z .. 2026-11-11T07:10:33.074Z: between steps
  g122 len 382 ms tick 1734 vis visible node 2026-11-11T07:10:33.096Z .. 2026-11-11T07:10:33.478Z: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g123 len 219 ms tick 1737 vis visible node 2026-11-11T07:10:33.547Z .. 2026-11-11T07:10:33.766Z: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g124 len 369 ms tick 1747 vis visible node 2026-11-11T07:10:34.198Z .. 2026-11-11T07:10:34.567Z: between steps (at the edge of l:paint-vs-event dx=-250 setCam#22)
  g125 len 382 ms tick 1754 vis visible node 2026-11-11T07:10:34.847Z .. 2026-11-11T07:10:35.229Z: between steps
  g126 len 368 ms tick 1762 vis visible node 2026-11-11T07:10:35.546Z .. 2026-11-11T07:10:35.914Z: between steps
  g127 len 394 ms tick 1764 vis visible node 2026-11-11T07:10:35.946Z .. 2026-11-11T07:10:36.340Z: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g128 len 243 ms tick 1767 vis visible node 2026-11-11T07:10:36.395Z .. 2026-11-11T07:10:36.638Z: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g129 len 201 ms tick 1790 vis visible node 2026-11-11T07:10:37.996Z .. 2026-11-11T07:10:38.197Z: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g130 len 346 ms tick 1936 vis visible node 2026-11-11T07:10:47.093Z .. 2026-11-11T07:10:47.439Z: between steps (at the edge of l:paint-vs-event dx=-250 drag#23)
  g131 len 352 ms tick 1944 vis visible node 2026-11-11T07:10:47.741Z .. 2026-11-11T07:10:48.093Z: between steps
  g132 len 374 ms tick 1951 vis visible node 2026-11-11T07:10:48.391Z .. 2026-11-11T07:10:48.765Z: between steps
  g133 len 404 ms tick 1953 vis visible node 2026-11-11T07:10:48.791Z .. 2026-11-11T07:10:49.195Z: between steps (at the edge of l:there-and-back-net setCam#24)
  g134 len 233 ms tick 1955 vis visible node 2026-11-11T07:10:49.243Z .. 2026-11-11T07:10:49.476Z: between steps (at the edge of l:there-and-back-net setCam#24)
  g135 *LONG* len 35874 ms tick 1956 vis visible node 2026-11-11T07:10:49.476Z .. 2026-11-11T07:11:25.350Z: in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25
  g136 len 253 ms tick 2067 vis visible node 2026-11-11T07:11:32.378Z .. 2026-11-11T07:11:32.631Z: between steps (at the edge of l:there-and-back-net drag#25, l:there-and-back-net drag#26)
  g137 len 272 ms tick 2194 vis visible node 2026-11-11T07:11:40.827Z .. 2026-11-11T07:11:41.099Z: between steps (at the edge of l:recenter-crossing-A dx=1200 setCam#27, l:recenter-crossing-A dx=1200 drag#28)
  g138 len 221 ms tick 2226 vis visible node 2026-11-11T07:11:43.024Z .. 2026-11-11T07:11:43.245Z: between steps (at the edge of l:recenter-crossing-A dx=1200 drag#28)
  g139 *LONG* len 12935 ms tick 2235 vis visible node 2026-11-11T07:11:43.725Z .. 2026-11-11T07:11:56.660Z: in l:recenter-crossing-A dx=1200 drag#28
  g140 *LONG* len 9530 ms tick 2238 vis visible node 2026-11-11T07:11:56.788Z .. 2026-11-11T07:12:06.318Z: in l:recenter-crossing-A dx=1200 drag#28
  g141 *LONG* len 5401 ms tick 2240 vis visible node 2026-11-11T07:12:06.473Z .. 2026-11-11T07:12:11.874Z: in l:recenter-crossing-A dx=1200 drag#28
  g142 *LONG* len 5714 ms tick 2244 vis visible node 2026-11-11T07:12:12.064Z .. 2026-11-11T07:12:17.778Z: in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29
  g143 *LONG* len 1767 ms tick 2245 vis visible node 2026-11-11T07:12:17.776Z .. 2026-11-11T07:12:19.543Z: in l:recenter-crossing-A dx=-1200 setCam#29 + l:recenter-crossing-A dx=-1200 drag#30
  g144 len 326 ms tick 2246 vis visible node 2026-11-11T07:12:19.543Z .. 2026-11-11T07:12:19.869Z: between steps (at the edge of l:recenter-crossing-A dx=-1200 drag#30)
  g145 len 220 ms tick 2280 vis visible node 2026-11-11T07:12:21.828Z .. 2026-11-11T07:12:22.048Z: between steps (at the edge of l:recenter-crossing-A dx=-1200 drag#30)
  g146 *LONG* len 5206 ms tick 3103 vis visible node 2026-11-11T07:13:03.426Z .. 2026-11-11T07:13:08.632Z: in l:recenter-crossing-A dx=-1200 drag#30
  g147 *LONG* len 16210 ms tick 3107 vis visible node 2026-11-11T07:13:08.818Z .. 2026-11-11T07:13:25.028Z: in l:recenter-crossing-A dx=-1200 drag#30
  at or over 1000 ms: 25 -> 1002, 8341, 18528, 12163, 10897, 10417, 12203, 1484, 7434, 15443, 6622, 10626, 10423, 11496, 10594, 11740, 1736, 35874, 12935, 9530, 5401, 5714, 1767, 5206, 16210

== RUN QUIET
  clock checks: after-install offset [-1, 0] mid -0.5 hw 0.5; half-width used 0.5
  page collection: NOT collected ({"boundReached":true}); stall lines node received: 20
  gap source: the [dg-stall] lines node received; kept gaps: 20; windows: setCam 14, drag 16
  g1 len 207 ms tick 143 vis visible node 2026-11-11T08:07:50.625Z .. 2026-11-11T08:07:50.832Z: between steps
  g2 len 206 ms tick 174 vis visible node 2026-11-11T08:07:53.538Z .. 2026-11-11T08:07:53.744Z: between steps
  g3 len 232 ms tick 179 vis visible node 2026-11-11T08:07:54.125Z .. 2026-11-11T08:07:54.357Z: between steps
  g4 len 209 ms tick 186 vis visible node 2026-11-11T08:07:54.871Z .. 2026-11-11T08:07:55.080Z: between steps
  g5 len 207 ms tick 216 vis visible node 2026-11-11T08:07:57.689Z .. 2026-11-11T08:07:57.896Z: between steps
  g6 len 219 ms tick 222 vis visible node 2026-11-11T08:07:58.155Z .. 2026-11-11T08:07:58.374Z: between steps
  g7 len 233 ms tick 231 vis visible node 2026-11-11T08:07:59.106Z .. 2026-11-11T08:07:59.339Z: between steps
  g8 *LONG* len 5967 ms tick 463 vis visible node 2026-11-11T08:08:12.274Z .. 2026-11-11T08:08:18.241Z: in s:there-and-back-net setCam#9 + s:there-and-back-net drag#10
  g9 len 705 ms tick 612 vis visible node 2026-11-11T08:08:25.696Z .. 2026-11-11T08:08:26.401Z: in s:recenter-crossing-A dx=1200 drag#13
  g10 *LONG* len 19377 ms tick 613 vis visible node 2026-11-11T08:08:26.401Z .. 2026-11-11T08:08:45.778Z: in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14
  g11 len 693 ms tick 632 vis visible node 2026-11-11T08:08:46.896Z .. 2026-11-11T08:08:47.589Z: in s:recenter-crossing-A dx=-1200 drag#15
  g12 *LONG* len 19344 ms tick 633 vis visible node 2026-11-11T08:08:47.589Z .. 2026-11-11T08:09:06.933Z: in s:recenter-crossing-A dx=-1200 drag#15
  g13 len 714 ms tick 638 vis visible node 2026-11-11T08:09:07.123Z .. 2026-11-11T08:09:07.837Z: in l:normal-A dx=300 setCam#16
  g14 *LONG* len 20308 ms tick 639 vis visible node 2026-11-11T08:09:07.837Z .. 2026-11-11T08:09:28.145Z: in l:normal-A dx=300 setCam#16 + l:normal-A dx=300 drag#17
  g15 *LONG* len 2488 ms tick 956 vis visible node 2026-11-11T08:09:45.273Z .. 2026-11-11T08:09:47.761Z: in l:paint-vs-event dx=-250 drag#23
  g16 *LONG* len 18126 ms tick 976 vis visible node 2026-11-11T08:09:48.924Z .. 2026-11-11T08:10:07.050Z: in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25
  g17 len 696 ms tick 1123 vis visible node 2026-11-11T08:10:14.538Z .. 2026-11-11T08:10:15.234Z: in l:recenter-crossing-A dx=1200 drag#28
  g18 *LONG* len 18957 ms tick 1124 vis visible node 2026-11-11T08:10:15.234Z .. 2026-11-11T08:10:34.191Z: in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29
  g19 len 317 ms tick 1129 vis visible node 2026-11-11T08:10:34.379Z .. 2026-11-11T08:10:34.696Z: in l:recenter-crossing-A dx=-1200 drag#30
  g20 len 949 ms tick 1144 vis visible node 2026-11-11T08:10:35.424Z .. 2026-11-11T08:10:36.373Z: in l:recenter-crossing-A dx=-1200 drag#30
  at or over 1000 ms: 7 -> 5967, 19377, 19344, 20308, 2488, 18126, 18957

== BUILD OVERLAP (run build)
  stamps: build-start 2026-11-11T07:04:49.000Z, compiling-line-seen 2026-11-11T07:04:52.000Z, suite-start 2026-11-11T07:04:54.000Z, suite-end 2026-11-11T07:13:42.000Z, build-checked-after 2026-11-11T07:13:44.000Z, killed 2026-11-11T07:13:44.000Z
  load-build processes (naming dg-load): before 0; suite-start 6 {"rustc.exe":6}; suite-end 8 {"clang-cl.exe":8}; after-kill 0
  cargo.exe running build --workspace --locked, pids: suite-start [31324,75416], suite-end [31324,75416], after-kill []
  compiling line before the suite: true; kill after the suite: true; load processes at both ends: true; after-kill none: true
  shown overlap: [2026-11-11T07:04:54.000Z, 2026-11-11T07:13:42.999Z] (the suite stamps; the build alive at both)
  long stalls beside the build (inside the shown overlap, +/- half-width): 25 of 25
  processes of other runs of this repository in the build lists (recorded, not a condition of run build): before 0, suite-start 0 {}, suite-end 0 {}

== QUIET CONDITION (run quiet, the four lists)
  dg-quiet.procs-before.txt: 4 processes {"node.exe":4}; heavy-kind 0; naming this repository 0; of another run 0
  dg-quiet.procs-suite-start.txt: 4 processes {"node.exe":4}; heavy-kind 0; naming this repository 0; of another run 0
  dg-quiet.procs-suite-end.txt: 4 processes {"node.exe":4}; heavy-kind 0; naming this repository 0; of another run 0
  dg-quiet.procs-after.txt: 4 processes {"node.exe":4}; heavy-kind 0; naming this repository 0; of another run 0
  quiet condition by the four lists: SHOWN (the dispatch record is the other half; not a file this script reads)
  long stalls in run quiet: 7 (inside the suite stamps: 7) -> 5967 ms in s:there-and-back-net setCam#9 + s:there-and-back-net drag#10; 19377 ms in s:recenter-crossing-A dx=1200 drag#13 + s:recenter-crossing-A dx=-1200 setCam#14; 19344 ms in s:recenter-crossing-A dx=-1200 drag#15; 20308 ms in l:normal-A dx=300 setCam#16 + l:normal-A dx=300 drag#17; 2488 ms in l:paint-vs-event dx=-250 drag#23; 18126 ms in l:there-and-back-net setCam#24 + l:there-and-back-net drag#25; 18957 ms in l:recenter-crossing-A dx=1200 drag#28 + l:recenter-crossing-A dx=-1200 setCam#29

== THERE-AND-BACK REACHED
  run build: there-and-back records 2 [small: there-and-back-net, large: there-and-back-net]; fatal events 0; record events 16
  run quiet: there-and-back records 2 [small: there-and-back-net, large: there-and-back-net]; fatal events 0; record events 16

== ROUTE (form note 4)
  long stalls beside the build: 25; long stalls in run quiet: 7; quiet condition shown: true; a run ended before there-and-back: false
  route 1 (>=1 beside the build, none in a quiet run): not met
  route 2 (>=1 in a quiet run): MET
  route 3 (anything else): not met
  the fields meet: route 2

== 2026-11-10 GRADING per window size
  run build: pushes 558, page emissions 558, seam calls 14; push k field-equal to emission seq k for every k: true
  setCam i matches seam call i by args: true
    small: normal-A dx=300 setCam#1: s0 k1 is the reset line [seq 1]; s1 k42 is the last line before the next setCam (seq 42)
    small: normal-A dx=-300 setCam#3: s0 k43 is the reset line [seq 43]; s1 k84 is the last line before the next setCam (seq 84)
    small: paint-vs-event dx=85 setCam#5: s0 k85 is the reset line [seq 85]; s1 k126 is the last line before the next setCam (seq 126)
    small: paint-vs-event dx=-85 setCam#7: s0 k127 is the reset line [seq 127]; s1 k168 is the last line before the next setCam (seq 168)
    small: there-and-back-net setCam#9: s0 k169 is the reset line [seq 169]; s1 k251 is the last line before the next setCam (seq 251)
    small: recenter-crossing-A dx=1200 setCam#12: s0 k252 is the reset line [seq 252]; s1 k264 is NOT the last line before the next setCam (seq 265)
    small: recenter-crossing-A dx=-1200 setCam#14: s0 k265 is NOT the reset line [seq 266]; s1 k278 is NOT the last line before the next setCam (seq 279)
    large: normal-A dx=300 setCam#16: s0 k280 is the reset line [seq 280]; s1 k321 is the last line before the next setCam (seq 321)
    large: normal-A dx=-300 setCam#18: s0 k322 is the reset line [seq 322]; s1 k363 is the last line before the next setCam (seq 363)
    large: paint-vs-event dx=250 setCam#20: s0 k364 is the reset line [seq 364]; s1 k405 is the last line before the next setCam (seq 405)
    large: paint-vs-event dx=-250 setCam#22: s0 k406 is the reset line [seq 406]; s1 k447 is the last line before the next setCam (seq 447)
    large: there-and-back-net setCam#24: s0 k448 is the reset line [seq 448]; s1 k530 is the last line before the next setCam (seq 530)
    large: recenter-crossing-A dx=1200 setCam#27: s0 k531 is the reset line [seq 531]; s1 k543 is NOT the last line before the next setCam (seq 544)
    large: recenter-crossing-A dx=-1200 setCam#29: s0 k544 is NOT the reset line [seq 545]; s1 k557 is NOT the last line before the next setCam (seq 558)
  run build, small: ratio 1; page net (seq 169 to seq 251) 0.00 [within 4]; suite net from vs (k169 to k251) 0.00 [within]; suite record "net residual 0.00 buffer px (tol 4)"
      the map itself displaced (page net outside the tolerance): no; harness reading (page within while suite not: false; any s0/s1 read not the page own line in this size: true [s0 1, s1 2]): MET (S3)
  run build, large: ratio 1; page net (seq 448 to seq 530) 1.00 [within 4]; suite net from vs (k448 to k530) 1.00 [within]; suite record "net residual 1.00 buffer px (tol 4)"
      the map itself displaced (page net outside the tolerance): no; harness reading (page within while suite not: false; any s0/s1 read not the page own line in this size: true [s0 1, s1 2]): MET (S3)
  run quiet, small: cannot be graded from the page lines (emits/seam not collected: {"boundReached":true}); the suite record: PASS "net residual 0.00 buffer px (tol 4)"
  run quiet, large: cannot be graded from the page lines (emits/seam not collected: {"boundReached":true}); the suite record: PASS "net residual 1.00 buffer px (tol 4)"
```

**6. Nothing fixed, retried or committed**
How I checked: `git rev-list --count 00bcb07d..cut/pan-anchor-there-and-back-residual-diagnostic`, `git ls-remote --heads origin <branch>`, `git for-each-ref` upstream, `git branch -a`, and per suite log counts of the start line and the `rc=` line.
- The branch has 0 commits past 00bcb07d.
- `ls-remote` prints nothing, there is no upstream, and there is no remote ref: nothing is pushed.
- Each suite log has exactly one start line and one `rc=` line:
  - Build: one `worktree … start 07:05:02Z` line and `rc=1 end 07:13:28Z`, with 16 check lines plus the `FAILED:` line.
  - Quiet: `start 08:07:34Z` and `rc=0 end 08:10:51Z`, with 16 check lines.
- Guards against a second run:
  - `dg-e2e-run-suite.sh` refuses an existing log name.
  - Both run scripts refuse an existing stamps file.
  - The instrument opens its files with `wx`.
- Both reports say nothing was committed, pushed, retried or fixed.
- Two things that are not run retries: run quiet's read script was executed twice, read-only, after a TypeError; run build's stub-page check was not the suite.
- Holds.

**Notes (do not change the verdict)**
- N1: Note 1's records not made directly: items (a) to (c) under check 2.
- N2: Run quiet's page collection reached its 15 s bound, which lost the page arrays and the closing clock check. Its gaps therefore rest on the 20 `[dg-stall]` lines node received; in run build, those lines equal the page array gap for gap.
  - A gap still open when the run stopped is never sent, so the quiet record cannot show a stall during the collection.
  - Run quiet's 2026-11-10 grading cannot be made from the page's lines.
- N3: Run build ran beside slot 1's P2 as well as the load build. That run's `cargo test` processes were in the before and suite-start lists, and its npm `verify`, `check:dev-origin`, `scan-dist` and `link` processes by suite end and after the kill. The main checkout's node tests were in the before list. The worker named all of these, as note 3 asks.
- N4: Run build's app-down output shows port 9223 still listening; the worker found it free about 15 minutes later. Its `taskkill` returned rc 128 with two per-pid errors, yet the after-kill list shows 0 `dg-load` processes.
- N5: The node side's synchronous `appendFileSync` per event and the page-side wrappers add unmeasured work inside what is observed. The form's claim limits name only the page side.
- N6: My own scratch-file deviation, given at the top.

Relevant files:
- `<S>/dg-gate-recompute.mjs`
- `<S>/dg-gate-recompute.out`
- `<S>/dg-instrument.patch`
- `C:/dev/spatial-ide/governance/forms/frontends/PAN-ANCHOR-THERE-AND-BACK-RESIDUAL-DIAGNOSTIC-PREREGISTRATION.md`
- `C:/dev/spatial-ide/state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md`
- `C:/dev/spatial-ide/state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-quiet-worker-report.md`
