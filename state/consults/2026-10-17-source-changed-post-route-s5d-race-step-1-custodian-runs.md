# source-changed-post-route-s5d-race, step 1: the custodian's runs of the post route, alone and under this project's own load

*The second version: the first, at e20edcf3 (sha256 331dee7d2ec883aa3c37c0065cb1d411e141b867cb19726e9fd3345d5b5a7da3), with its single reviewer gate's D1 to D8 applied in the reviewer's words (`state/consults/gates/2026-10-17-source-changed-post-route-s5d-race-step-1-gate1-reviewer.md`, gate-log 534), no re-gate; nothing else changed.*

*The custodian's record (2026-10-17), under `frontends/shell/SOURCE-CHANGED-POST-ROUTE-S5D-RACE-PREREGISTRATION.md` (step 1, with Amendments 1 and 2). Built by script from each run's artifacts: the suite log, the report JSON, the session log the report names, and the app's stderr capture, each copied whole into the custodian's scratch folder right after its run. Every line below is byte-copied whole. The gaps are ordering evidence only: no p50 or p95, no docs/08 budget, no claim about speed, and the arms are not compared (§1.4).*

## Setup

- **Base B:** be6aa6203a196f553ec08f697d678dfa08a78bd4, main after PR #224's merge (Amendment 1 item 3). The exe was built there from the e2e checkout `C:/dev/wt/mm2b-e2e`, detached at B, in a shared hold, into `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f.
- **Harness:** port 5180 is still in Windows' excluded range, so the runs use the port-5400 harness on its approval's terms (§1.1). Every run sets `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` and launches a fresh app.
- **Machine:** 16 logical cores. Each hold was exclusive and granted all of them (Amendment 2). This project's lines of the script's output, byte-copied:

  the first attempt:

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=3.0% peaks-over-25=0 samples=5 others=none since-last-end=17s because: samples 5/60; last heavy run ended 17 s ago (at least 120 s)
MACHINE_WAITING exclusive: quiet=False average=3.8% peaks-over-25=0 samples=60 others=none since-last-end=81s because: last heavy run ended 81 s ago (at least 120 s)
MACHINE_QUIET quiet=True average=3.5% peaks-over-25=0 samples=60 others=none since-last-end=123s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:51024 also=bash.exe:34024 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:51024 affinity=FF (cores 0-7)
```

  the series:

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=2.6% peaks-over-25=0 samples=5 others=none since-last-end=371s because: samples 5/60
MACHINE_QUIET quiet=True average=3.5% peaks-over-25=0 samples=60 others=none since-last-end=430s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:20040 also=bash.exe:49364 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:20040 affinity=FF (cores 0-7)
```

  the extension:

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=2.4% peaks-over-25=0 samples=5 others=none since-last-end=44s because: samples 5/60; last heavy run ended 44 s ago (at least 120 s)
MACHINE_WAITING exclusive: quiet=False average=3.8% peaks-over-25=0 samples=60 others=none since-last-end=107s because: last heavy run ended 107 s ago (at least 120 s)
MACHINE_QUIET quiet=True average=3.8% peaks-over-25=0 samples=60 others=none since-last-end=123s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:35460 also=bash.exe:47900 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:35460 affinity=FF (cores 0-7)
```

- **Affinity**, read once per series (§1.2 by Amendment 2). Each line is the series' name, then either that series summary's spinner line whole or, cut by script from the summary line of the run probed, the run's name and its app-pid and app-affinity fields:

```text
first attempt: pre app-pid=9892 app-affinity=65535
series: pre app-pid=36316 app-affinity=65535
series: spinner pid=22812 affinity=65535
extension: spinner pid=20804 affinity=65535
extension: A9 app-pid=42568 app-affinity=65535
```

- **Deviations** (class 2, recorded, not fixed):
  1. The series probed the app's PID at each series' first run. For every other run the PID is the second `killed tree` line in its runner output (the harness's stop kills the trees app-up recorded, vite's first, the app's second; at the three probed runs it equals the probe). The B9 slot's runner output was overwritten (deviation 5), so its PID is not read. The suite's own process list uses `wmic`, which returns no rows on this machine (`appProcesses: []` in every report). Every counted run shows `launched: true` and its own session log.
  2. The stderr capture is the port-5400 harness's own destination: the file its app-up script redirects the exe's stderr into, written fresh at each launch, so a run's launch offset is the file's start. F9 names `e2e/out/app.log` for the suite's own launcher, and §1.1 lets the harness disclose its destination. The first attempt's pre-flight showed it gaining lines.
  3. The first attempt stopped at §1.7 after its pre-flight (Amendment 2). Its row is kept below, not counted.
  4. **A defect in the custodian's series script.** Its affinity probe looped on the same variable as the extension's run loop, so after A9 the next run was named B15 instead of B9. The run itself was the B9 slot, in its place in the order. When the B15 slot came, the harness refused it because a log of that name already existed (exit 94, no app launched). So the extension ran 15 of its 16 runs, and the B15 slot never ran. The same overwrite made the script skip its check of A9's app affinity, which compares the loop variable with the extension's first run number; the reading itself was taken and recorded (65535, the hold's grant), so §1.2's condition is met by the reading, not by the check.
  5. **One stderr capture lost.** After that refusal the series script copied the harness's current stderr file, which was A15's, over the B9 slot's copy, and wrote the refusal's own output over the B9 slot's runner output; it copied the B9 slot's report and session log again from their sources, unchanged. The B9 slot's report, session log, suite log and summary line are intact; its P and W cannot be read. The stderr copy is byte-identical to A15's, checked by script, and names A15's session log.
  6. The series script was edited between attempts: after the first attempt (its stop line names cores 0 to 7; the script kept checks the hold's grant, Amendment 2) and after the series (the copy kept was last written at 2026-10-17T18:12:11Z, after the series ended and before the extension began). The copy kept is the extension's; deviations 4 and 5 are read from it.

## Summary

| Run | Arm | S5d | Class | P | W |
|---|---|---|---|---|---|
| first attempt, pre-flight (not counted) | A | PASS | - | yes | yes |
| series, pre-flight (not counted) | A | FAIL | C1 | no | yes |
| series, A1 | A | PASS | - | yes | yes |
| series, B1 | B | PASS | - | yes | yes |
| series, A2 | A | PASS | - | yes | yes |
| series, B2 | B | PASS | - | yes | yes |
| series, A3 | A | PASS | - | yes | yes |
| series, B3 | B | PASS | - | yes | yes |
| series, A4 | A | PASS | - | yes | yes |
| series, B4 | B | PASS | - | yes | yes |
| series, A5 | A | FAIL | C1 | no | yes |
| series, B5 | B | PASS | - | yes | yes |
| series, A6 | A | PASS | - | yes | yes |
| series, B6 | B | PASS | - | yes | yes |
| series, A7 | A | PASS | - | yes | yes |
| series, B7 | B | PASS | - | yes | yes |
| series, A8 | A | PASS | - | yes | yes |
| series, B8 | B | PASS | - | yes | yes |
| extension, A9 | A | PASS | - | yes | yes |
| extension, B9 | B | PASS | - | lost (deviation 5) | lost (deviation 5) |
| extension, A10 | A | PASS | - | yes | yes |
| extension, B10 | B | PASS | - | yes | yes |
| extension, A11 | A | PASS | - | yes | yes |
| extension, B11 | B | PASS | - | yes | yes |
| extension, A12 | A | PASS | - | yes | yes |
| extension, B12 | B | PASS | - | yes | yes |
| extension, A13 | A | PASS | - | yes | yes |
| extension, B13 | B | FAIL | C2 | no | yes |
| extension, A14 | A | PASS | - | yes | yes |
| extension, B14 | B | PASS | - | yes | yes |
| extension, A15 | A | PASS | - | yes | yes |
| extension, A16 | A | PASS | - | yes | yes |
| extension, B16 | B | FAIL | C2 | no | yes |
| extension, B15 | B | not run (deviation 4) | - | - | - |

- **Counted:** 31 runs: the series, A1 to B8 (16), and the extension, A9 to B16 without its B15 slot (15), §1.3. The extension ran because the series failed S5d 1 time(s), fewer than 3. Neither pre-flight is counted, and neither enters the outcome below.
- **S5d failed** in 3 of 31 counted runs: A5 (C1), B13 (C2), B16 (C2).
- **The outcome (§1.6, the first match in its order, over the 30 counted runs whose classes are known):** **O3**, on 3 run(s) with W and without P: A5 (S5d FAIL), B13 (S5d FAIL), B16 (S5d FAIL).
- **The lost capture:** B9's P and W are lost (deviation 5). Its steps and its session-log lines are intact (S5d PASS). Had its capture held neither line, it would meet §1.6's O4 (a session-ended line with none of P, W or a C2 refusal), and O4 comes first; with either line, the outcome above stands. The extension's B15 slot never ran (deviation 4), so the outcome rests on 30 of the 32 runs §1.3 orders; the B15 slot's reading, like the B9 slot's, is unknown.

## Each run's row (§1.4)

### First attempt, pre-flight (not counted) (its files carry the name pre)

- **Arm** A; **hold** the first attempt; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792259637977.json`; **launched** true; **app** PID 9892, affinity 65535, exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T17:53:27.225Z to 2026-10-17T17:54:07.716Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T17:53:55.366Z (1792259635366 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T17:53:55.366Z (1792259635366 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_2ce7053b0e8a2bc63ee751e1f322355c, streamHandle: sh_cd62f49a400bddd39fc30c3e6f459d1e}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792259635398 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_2ce7053b0e8a2bc63ee751e1f322355c`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 32; t_touch less the stream-issued receipt 0.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, pre-flight (not counted) (its files carry the name pre)

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260104954.json`; **launched** true; **app** PID 36316, affinity 65535, exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:01:21.510Z to 2026-10-17T18:01:54.457Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:01:42.357Z (1792260102357 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:01:42.354Z (1792260102354 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_d3e778b4fbf3bff3502e7a3fe75677e8, streamHandle: sh_f937c65e3e63ea38ebfac946344dcd15}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260102382 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792260102395 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{this dataset's session ended when its source was observed to have changed}"}
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 25; refusal 1 less session-ended 13; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P no; W yes; S5d FAIL, C1.

### Series, A1

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260140698.json`; **launched** true; **app** PID 32052 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:01:56.954Z to 2026-10-17T18:02:28.614Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:02:18.071Z (1792260138071 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:02:18.069Z (1792260138069 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_58b56b707abbe3f215231f14a48ae8d1, streamHandle: sh_d2aef48c3f5474e39ce16eab51609982}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260138105 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_58b56b707abbe3f215231f14a48ae8d1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B1

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260176058.json`; **launched** true; **app** PID 45896 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:02:29.421Z to 2026-10-17T18:03:08.082Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:02:53.285Z (1792260173285 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:02:53.281Z (1792260173281 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_27fceb9dc5c770e5830c5b13cb37df23, streamHandle: sh_40664c24b4185d574b8d6fc597c7d7e9}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260173328 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_27fceb9dc5c770e5830c5b13cb37df23`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_27fceb9dc5c770e5830c5b13cb37df23`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_27fceb9dc5c770e5830c5b13cb37df23`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 43; t_touch less the stream-issued receipt 4.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A2

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260213881.json`; **launched** true; **app** PID 37108 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:03:09.006Z to 2026-10-17T18:03:42.088Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:03:31.265Z (1792260211265 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:03:31.263Z (1792260211263 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_17cf193a7db954b9260e57cac8cba2fa, streamHandle: sh_12819ced25a17a29e818545216ec26d7}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260211298 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_17cf193a7db954b9260e57cac8cba2fa`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 33; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B2

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260251308.json`; **launched** true; **app** PID 50268 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:03:42.984Z to 2026-10-17T18:04:23.573Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:04:08.545Z (1792260248545 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:04:08.543Z (1792260248543 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_227220d4deea45ed27c67bb9b313a28e, streamHandle: sh_4699b8944dbb83e8c4063d0d3920f224}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260248594 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_227220d4deea45ed27c67bb9b313a28e`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 49; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A3

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260288891.json`; **launched** true; **app** PID 536 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:04:24.506Z to 2026-10-17T18:04:57.033Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:04:46.274Z (1792260286274 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:04:46.272Z (1792260286272 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_b806707847c9df238d309a298d1f1298, streamHandle: sh_b83640677f1fd3595e06ae9ba602e2cb}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260286310 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_b806707847c9df238d309a298d1f1298`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_b806707847c9df238d309a298d1f1298`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_b806707847c9df238d309a298d1f1298`: the source changed during use ({mtime}); 19 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 36; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B3

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260325914.json`; **launched** true; **app** PID 48272 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:04:57.888Z to 2026-10-17T18:05:36.396Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:05:23.125Z (1792260323125 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:05:23.120Z (1792260323120 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_5148213133a4f17340558bd8f188f4b6, streamHandle: sh_e0a6238ef1f9d445b8174606acabaf40}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260323175 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_5148213133a4f17340558bd8f188f4b6`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_5148213133a4f17340558bd8f188f4b6`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_5148213133a4f17340558bd8f188f4b6`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 50; t_touch less the stream-issued receipt 5.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A4

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260361898.json`; **launched** true; **app** PID 37384 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:05:37.280Z to 2026-10-17T18:06:10.086Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:05:59.288Z (1792260359288 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:05:59.285Z (1792260359285 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_f5e16e26b4b70dad0e5345ba4c7f1e16, streamHandle: sh_7c00ebbd6888ac092823bb87ded4c1a7}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260359321 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_f5e16e26b4b70dad0e5345ba4c7f1e16`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_f5e16e26b4b70dad0e5345ba4c7f1e16`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_f5e16e26b4b70dad0e5345ba4c7f1e16`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 33; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B4

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260399410.json`; **launched** true; **app** PID 31404 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:06:10.962Z to 2026-10-17T18:06:50.054Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:06:36.661Z (1792260396661 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:06:36.660Z (1792260396660 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_9a1ccb93050ac2634d89ec9241b1061d, streamHandle: sh_20161dcc7894f6e0b8878db6bcc2555a}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260396708 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_9a1ccb93050ac2634d89ec9241b1061d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 47; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A5

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260435469.json`; **launched** true; **app** PID 34748 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:06:50.923Z to 2026-10-17T18:07:23.649Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:07:12.827Z (1792260432827 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:07:12.823Z (1792260432823 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_09c5972f460ca041353d93f7877a729d, streamHandle: sh_10ed9736692ddcb0ac12ed7f5e3450c0}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260432853 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792260432866 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{this dataset's session ended when its source was observed to have changed}"}
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 26; refusal 1 less session-ended 13; t_touch less the stream-issued receipt 4.
- **Classes (§1.5):** P no; W yes; S5d FAIL, C1.

### Series, B5

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260473252.json`; **launched** true; **app** PID 28016 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:07:24.477Z to 2026-10-17T18:08:05.141Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:07:50.456Z (1792260470456 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:07:50.455Z (1792260470455 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_ad935788d0d7e375909ff047464bb408, streamHandle: sh_0404c0dd4d102f86ef9be6b2953cd539}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260470500 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_ad935788d0d7e375909ff047464bb408`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 44; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A6

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260510386.json`; **launched** true; **app** PID 38776 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:08:06.009Z to 2026-10-17T18:08:38.252Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:08:27.780Z (1792260507780 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:08:27.779Z (1792260507779 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_2844c6ddb93e461aae5edc4e51b2f6a1, streamHandle: sh_2ece6657f6095fa887e05b8e04b267ac}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260507816 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_2844c6ddb93e461aae5edc4e51b2f6a1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 36; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B6

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260547709.json`; **launched** true; **app** PID 20048 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:08:39.110Z to 2026-10-17T18:09:18.186Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:09:04.980Z (1792260544980 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:09:04.978Z (1792260544978 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_ecb816f37ea984639c3e051ff509becf, streamHandle: sh_0925278b0531019991418674963ebb5b}
```

- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260545029 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_ecb816f37ea984639c3e051ff509becf`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 49; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A7

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260583433.json`; **launched** true; **app** PID 16868 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:09:19.062Z to 2026-10-17T18:09:50.836Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:09:40.813Z (1792260580813 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:09:40.811Z (1792260580811 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_b89bde1c9d49db46be70e2facdddf198, streamHandle: sh_b6aed5a8ced61be9cc8a9dc7076ef9f8}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260580849 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_b89bde1c9d49db46be70e2facdddf198`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 36; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B7

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260620221.json`; **launched** true; **app** PID 18984 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:09:51.760Z to 2026-10-17T18:10:30.820Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:10:17.422Z (1792260617422 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:10:17.422Z (1792260617422 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_97492894530e1a1f0fe0a377917c6dfb, streamHandle: sh_f658726f19634a8fb026a89253c8e7b6}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260617463 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_97492894530e1a1f0fe0a377917c6dfb`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 41; t_touch less the stream-issued receipt 0.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, A8

- **Arm** A; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260656345.json`; **launched** true; **app** PID 14448 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:10:31.717Z to 2026-10-17T18:11:04.595Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:10:53.737Z (1792260653737 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:10:53.736Z (1792260653736 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_076d2c948792dd813b969b097bca3068, streamHandle: sh_f644ba032549a977689fb096192315d8}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260653770 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_076d2c948792dd813b969b097bca3068`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 33; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Series, B8

- **Arm** B; **hold** the series; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260693535.json`; **launched** true; **app** PID 30596 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:11:05.483Z to 2026-10-17T18:11:44.190Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:11:30.762Z (1792260690762 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:11:30.762Z (1792260690762 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_4bfb476638fb9d4c42780765a7aa48fb, streamHandle: sh_1247a8f351887c774eeb4a1c9b842802}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260690809 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_4bfb476638fb9d4c42780765a7aa48fb`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 47; t_touch less the stream-issued receipt 0.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A9

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260856864.json`; **launched** true; **app** PID 42568, affinity 65535, exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:13:53.729Z to 2026-10-17T18:14:24.823Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:14:14.266Z (1792260854266 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:14:14.264Z (1792260854264 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_3898dfd902bc121e6516ed8003c5765a, streamHandle: sh_082c4f0f6d9d5478e15eda5a2d44f516}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260854300 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_3898dfd902bc121e6516ed8003c5765a`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B9 (its files carry the name B15, deviation 4)

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260893008.json`; **launched** true; **app** PID not read (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:14:25.674Z to 2026-10-17T18:15:05.829Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:14:50.265Z (1792260890265 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:14:50.262Z (1792260890262 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_13ead7505600701b3dfaea73810d0b08, streamHandle: sh_731c208c83ebb993c2008b153e5c4af3}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260890303 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
(lost: deviation 5)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 38; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P lost (deviation 5); W lost (deviation 5); S5d PASS.

### Extension, A10

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260931088.json`; **launched** true; **app** PID 18452 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:15:06.708Z to 2026-10-17T18:15:39.179Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:15:28.476Z (1792260928476 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:15:28.476Z (1792260928476 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_475c80f59eafd53e2bef7be64be806a7, streamHandle: sh_771c86ee7da547e5f31d562c3948114e}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260928511 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_475c80f59eafd53e2bef7be64be806a7`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 35; t_touch less the stream-issued receipt 0.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B10

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792260968375.json`; **launched** true; **app** PID 41260 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:15:40.050Z to 2026-10-17T18:16:18.739Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:16:05.541Z (1792260965541 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:16:05.536Z (1792260965536 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_8a4890780e40a0dcca3bbf3956897371, streamHandle: sh_6342477e8f67d61a1224f469c7703b26}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792260965583 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_8a4890780e40a0dcca3bbf3956897371`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_8a4890780e40a0dcca3bbf3956897371`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_8a4890780e40a0dcca3bbf3956897371`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 42; t_touch less the stream-issued receipt 5.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A11

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261004097.json`; **launched** true; **app** PID 50044 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:16:19.610Z to 2026-10-17T18:16:52.297Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:16:41.501Z (1792261001501 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:16:41.499Z (1792261001499 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_571fa311ef7a48aed586dba5181fb3a6, streamHandle: sh_4eb653effdfa4a817cdaa556a47a6e7d}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261001534 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_571fa311ef7a48aed586dba5181fb3a6`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_571fa311ef7a48aed586dba5181fb3a6`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_571fa311ef7a48aed586dba5181fb3a6`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 33; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B11

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261041849.json`; **launched** true; **app** PID 21364 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:16:53.156Z to 2026-10-17T18:17:32.263Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:17:19.083Z (1792261039083 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:17:19.080Z (1792261039080 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_01fd3344a83c737bdab839449018f0fc, streamHandle: sh_a69109d0f4ea1d3ffcd9b947bacb67f2}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261039124 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_01fd3344a83c737bdab839449018f0fc`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 41; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A12

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261077791.json`; **launched** true; **app** PID 34240 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:17:33.141Z to 2026-10-17T18:18:05.262Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:17:55.180Z (1792261075180 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:17:55.177Z (1792261075177 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_bfed4aa261bce981e1e6aafa62f12785, streamHandle: sh_e5a4751e3de8a9c1c494497df8e84bb8}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261075214 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_bfed4aa261bce981e1e6aafa62f12785`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B12

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261114580.json`; **launched** true; **app** PID 32864 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:18:06.177Z to 2026-10-17T18:18:44.262Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:18:31.841Z (1792261111841 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:18:31.840Z (1792261111840 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_fbb9c2ed31fb4ed6e509b6a9f5fe304c, streamHandle: sh_eafddf9aa48ca7855d0f67af2f319b19}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261111890 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_fbb9c2ed31fb4ed6e509b6a9f5fe304c`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 49; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A13

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261150175.json`; **launched** true; **app** PID 46620 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:18:45.129Z to 2026-10-17T18:19:17.607Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:19:07.570Z (1792261147570 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:19:07.567Z (1792261147567 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_81531cad3df4f90a8c0dd115e164013a, streamHandle: sh_86c051579f85fb8c872950902878e608}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261147604 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_81531cad3df4f90a8c0dd115e164013a`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_81531cad3df4f90a8c0dd115e164013a`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_81531cad3df4f90a8c0dd115e164013a`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; t_touch less the stream-issued receipt 3.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B13

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261186758.json`; **launched** true; **app** PID 6200 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:19:18.463Z to 2026-10-17T18:19:56.623Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:19:44.026Z (1792261184026 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:19:44.016Z (1792261184016 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_efefbc63bf11965abbb91896e0ea47cf, streamHandle: sh_2529dbf04f36a1528f8cd28f3663003d}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261184060 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792261184082 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; refusal 1 less session-ended 22; t_touch less the stream-issued receipt 10.
- **Classes (§1.5):** P no; W yes; S5d FAIL, C2.

### Extension, A14

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261222339.json`; **launched** true; **app** PID 3220 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:19:57.536Z to 2026-10-17T18:20:29.701Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:20:19.731Z (1792261219731 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:20:19.730Z (1792261219730 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_489d223f09a9270aea812f596f40b3ee, streamHandle: sh_7e242ecdac90e760d9ac066f3d2af118}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261219764 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_489d223f09a9270aea812f596f40b3ee`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 33; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B14

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261258896.json`; **launched** true; **app** PID 7496 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:20:30.550Z to 2026-10-17T18:21:09.010Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:20:56.165Z (1792261256165 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:20:56.163Z (1792261256163 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_c6f90be86429400288fe65b6df636fd0, streamHandle: sh_11762bf4b65a9075d113470ddeaa2e44}
```

- **Session log after S5d's baseline** (line 32), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261256217 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_c6f90be86429400288fe65b6df636fd0`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 52; t_touch less the stream-issued receipt 2.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A15

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261294667.json`; **launched** true; **app** PID 39200 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:21:09.912Z to 2026-10-17T18:21:42.133Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:21:32.057Z (1792261292057 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:21:32.056Z (1792261292056 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_f35d0f453a44548641a00660ace4d759, streamHandle: sh_d9a65feeb733bc9995bd03444f3c4939}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261292091 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_f35d0f453a44548641a00660ace4d759`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, A16

- **Arm** A; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261327852.json`; **launched** true; **app** PID 26100 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:21:43.887Z to 2026-10-17T18:22:15.245Z; **suite exit** 0; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed PASS; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:22:05.238Z (1792261325238 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:22:05.237Z (1792261325237 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_2df6e81e450d564853b8f9c4f1cbde19, streamHandle: sh_de080f1a4e53448ce0ffc5948c5b0796}
```

- **Session log after S5d's baseline** (line 31), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261325269 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
session ended for dataset `ds_2df6e81e450d564853b8f9c4f1cbde19`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 31; t_touch less the stream-issued receipt 1.
- **Classes (§1.5):** P yes; W yes; S5d PASS.

### Extension, B16

- **Arm** B; **hold** the extension; **build** be6aa6203a196f553ec08f697d678dfa08a78bd4; **report** `source-changed-1792261364646.json`; **launched** true; **app** PID 35248 (deviation 1), exe `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`; **run** 2026-10-17T18:22:16.072Z to 2026-10-17T18:22:54.559Z; **suite exit** 1; fixtures unchanged.
- **Steps:** S1-open PASS; S2-settle-and-precondition PASS; S3-touch-mtime INFO; S4-issue-one-query-and-touch-on-mint PASS; S5a-status PASS; S5b-residency-cleared PASS; S5c-picks-refused PASS; S5d-post-check-route-confirmed FAIL; fixture-integrity PASS.
- **t_touch** (F1, the copy's mtime less 120 000 ms): 2026-10-17T18:22:41.926Z (1792261361926 ms).
- **The first new `stream-issued` entry in S4:** received 2026-10-17T18:22:41.917Z (1792261361917 ms); the count of such entries in S4 is 3; its text:

```text
[render-trace] stream-issued {dataset: ds_d8c9dba7768781bad4b9fa6469171fd5, streamHandle: sh_f3ff007fe1fae5aa6716997257b4436f}
```

- **Session log after S5d's baseline** (line 33), every line naming `tile-session-ended-source-changed`, `tile-stream-mint-refused`, `tile-stream-mint-abandoned` or `dataset_session_ended`:

```text
1792261361960 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792261361980 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{mtime}"}
```

- **The status block's message** (F7, F10):

```text
[P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

- **The stderr capture** (deviation 2), each post-check line (P) and watcher line (W), in order:

```text
the advisory source watcher signalled observed-change
```

- **Gaps (ms), ordering evidence only (§1.4):** session-ended less t_touch 34; refusal 1 less session-ended 20; t_touch less the stream-issued receipt 9.
- **Classes (§1.5):** P no; W yes; S5d FAIL, C2.

### Extension, B15 (not run)

- The harness refused the slot before launching anything (deviation 4). The series script's summary line for it, byte-copied; its S5d and report fields were read from the B9 slot's suite log, which carries the B15 name, and its scratch-mtime field is A15's:

```text
B15 arm=B rc=94 S5d=PASS start=2026-10-17T18:21:42.992Z end=2026-10-17T18:21:43.057Z scratch-mtime-ms=1792261412057 report=source-changed-1792260893008.json fixtures= 
```

