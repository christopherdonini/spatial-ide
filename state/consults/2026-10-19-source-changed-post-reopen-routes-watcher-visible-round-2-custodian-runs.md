# source-changed-post-reopen-routes-watcher-visible: the custodian's round 2 runs at bf527c1e (the form's §4, Amendment 3)

*The custodian's record (2026-10-19), under `frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md` with Amendments 1 to 3. Built by script from each run's artifacts: the suite log, the runner output, the report JSON, the session log the report names, and the app's stderr capture, each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, with CR removed; a helper PID is written `<n>`. Ordering evidence only: no gap and no duration is reported (ADR-018).*

## Setup

- **Head:** bf527c1e41571053b9bd1072214a58ab80115901 (branch `cut/source-changed-watcher-visible`, round 2 over aa30f99f), in the custodian's e2e checkout `C:/dev/wt/mm2b-e2e`, detached there, clean at the start and at the end.
- **The exe:** `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, built at be6aa6203a196f553ec08f697d678dfa08a78bd4. The series checked by git that no exe source differs between that commit and the head.
- **Harness:** the port-5400 harness; each run a fresh app with `SPATIAL_E2E_SOURCE_CHANGED_ROUTE` set. After each run the series counted the processes still running the repoint child's command line.
- **The hold:** one exclusive hold for all 19 runs. This project's lines of the machine script's output:

```text
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=4.0% peaks-over-25=0 samples=5 others=none since-last-end=31s because: samples 5/60; last heavy run ended 31 s ago (at least 120 s)
MACHINE_WAITING exclusive: quiet=False average=7.2% peaks-over-25=2 samples=60 others=none since-last-end=95s because: last heavy run ended 95 s ago (at least 120 s)
MACHINE_QUIET quiet=True average=9.9% peaks-over-25=2 samples=60 others=none since-last-end=122s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:27080 also=bash.exe:30460 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:27080 affinity=FF (cores 0-7)
```

- **The series:** 2026-10-19T17:30:31.010Z to 2026-10-19T17:46:42.667Z, by its summary.

## The runs

| Run | Route | rc | Steps passed | Steps failed | W lines | P lines | H3 (ctime) |
|---|---|---|---|---|---|---|---|
| pre1 | pre | 0 | 8 | none | 0 | 0 | n/a |
| reopen1 | reopen | 0 | 12 | none | 0 | 0 | n/a |
| reopen2 | reopen | 0 | 12 | none | 0 | 0 | n/a |
| reopen3 | reopen | 0 | 12 | none | 0 | 0 | n/a |
| post1 | post | 0 | 8 | none | 0 | 2 | no earlier |
| post2 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| post3 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| post4 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| post5 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| post6 | post | 0 | 8 | none | 0 | 2 | no earlier |
| post7 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| post8 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 1 | no earlier |
| W-M1 | post | 1 | 3 | S4-issue-one-query-and-retarget-on-mint, S5a-status, S5b-residency-cleared, S5c-picks-refused, S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| W-M2 | reopen | 1 | 5 | S3-retarget-junction, S4-issue-one-query, S5a-status, S5b-residency-cleared, S5c-picks-refused, R1-failed-reopen-does-not-clear, R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |
| W-M3 | reopen | 1 | 11 | R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |
| W-M4 | reopen | 1 | 11 | R4-second-source-change-ends-the-new-session | 1 | 0 | n/a |
| W-M5 | reopen | 1 | 11 | R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |
| W-M6 | post | 1 | 3 | S4-issue-one-query-and-retarget-on-mint, S5a-status, S5b-residency-cleared, S5c-picks-refused, S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| W-M7 | reopen | 1 | 11 | R2-successful-reopen-clears-and-identifies | 0 | 0 | n/a |

W: the stderr capture's lines naming the advisory source watcher's signal. P: its post-check lines (`post_check_bytes=`). H3: the junction's change time (`ctime`, Amendment 3 item 5), read by `lstatSync` after the run, against the receive time of the first new `stream-issued` entry the S4 ladder raced.

## Against the form

- **P1** (E-pre, every step passes): held, 1 of 1.
- **P2** (E-reopen, every step passes in 3 of 3, R4's idle check and its `{mtime}` line among them): held, 3 of 3, R2 by Amendment 2 item 3.
- **P3** (E-post): S1 to S5c passed in 8 of 8; no capture holds a watcher line (8 of 8); every run whose S5d passes holds a P line (2 of 2). S5d's verdicts, recorded and not predicted: PASS in 2 of 8; FAIL in 6 of 8, each on the `tile-stream-mint-refused` condition, the change losing the race to a tile's pre-check.
- **P4** (no refusal and no P line carries the detail that the source could not be re-read): held; the detail is in no run.
- **P5** (W-M1 to W-M5 each fail by the message §4 names), with Amendment 3's W-M6 and W-M7: held; the failing lines are quoted below, each mutation applied alone and reverted, the checkout clean after each. W-M4's one watcher line is that mutation's own mtime touch.
- **P6** (H3 on ctime, 8 of 8 post runs): held, no earlier in 8 of 8.
- **The repoint child:** each of the 19 runs printed that its helper exited with code 0 after its stdin closed (19 of 19); no run left a process with the child's command line (19 of 19 counted 0).
- **Invalidators:** I1 no (no watcher line in any unmutated run: 0); I2 no; I3 no (no post run passed S5d without a P line, and no S5d failure was on its first condition); I4 no (every repoint answered); I5 no; I6 no.
- **For S5d's step 2** (Amendment 3 item 8, not judged here): the repoint lands after the child's answer, and S5d took the post-check in the runs above as counted.

## Lines, byte-copied

For each run: its failing step lines, its W and P lines, every session-log line since the run's baseline naming `tile-session-ended-source-changed` or `tile-stream-mint-refused`, and the helper's exit line.

### pre1 (pre)

```text
1792431053365 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431053377 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431053378 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431053381 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### reopen1 (reopen)

```text
1792431086248 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431086252 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431086252 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431086252 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431112034 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431112051 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792431112051 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
1792431112052 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### reopen2 (reopen)

```text
1792431147750 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431147758 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431147758 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431147759 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431174254 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431174259 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
1792431174260 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792431174261 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### reopen3 (reopen)

```text
1792431214047 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431214059 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431214060 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431214061 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431243083 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431243088 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
1792431243089 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792431243090 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post1 (post)

```text
session ended for dataset `ds_38024dbbe426231521c1f95d67aa4990`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_38024dbbe426231521c1f95d67aa4990`: the source changed during use ({mtime}); 23 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431284266 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post2 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":32,"newLineCount":10,"mintRefused":["1792431324187 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431324157 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_86cfe8dbea4ca2cea34b1fda2717b038`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431324157 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431324187 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post3 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":33,"newLineCount":10,"mintRefused":["1792431372862 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431372845 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_f05265f508ae80f8fe525c53c8b40d2d`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431372845 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431372862 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post4 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":32,"newLineCount":10,"mintRefused":["1792431411680 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431411665 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_1a3cad52b086352b9ce253d67bbf23b1`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431411665 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431411680 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post5 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":32,"newLineCount":10,"mintRefused":["1792431449170 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431449154 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_7369c81255c447239eb8d6670a64174c`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431449154 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431449170 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post6 (post)

```text
session ended for dataset `ds_49c63a9a3f6234becae36de6d0f68bbd`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_49c63a9a3f6234becae36de6d0f68bbd`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431484585 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post7 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":32,"newLineCount":10,"mintRefused":["1792431521180 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431521163 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_83a41056119d5a52b4d7d65e23cfc3e3`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431521163 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431521180 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### post8 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":34,"newLineCount":10,"mintRefused":["1792431568751 tile-stream-mint-refused 8:14: engine.source_changed {\"detail\":\"{mtime}\"}"],"sessionEnded":["1792431568727 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
session ended for dataset `ds_e9ef5a2ea160670bad8eeb344ac90d45`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792431568727 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431568751 tile-stream-mint-refused 8:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M1 (post, W-M1 applied alone, reverted, the checkout clean at bf527c1e)

```text
S4-issue-one-query-and-retarget-on-mint  FAIL    S4: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b
S5a-status                               FAIL    S5a: no .canvas-session-ended block in the status stack; stack text was ""
S5b-residency-cleared                    FAIL    S5b: resident vertices are 381076 (features 20163), expected 0 -- the owner did not clear what it was showing
S5c-picks-refused                        FAIL    S5c: hovering the formerly-occupied pixel (352.5, 204.5) produced NO readout at all; silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids
S5d-post-check-route-confirmed           FAIL    S5d: no "tile-session-ended-source-changed" line appeared in the session log after this run's own baseline (line 32) -- the terminal route never fired
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M2 (reopen, W-M2 applied alone, reverted, the checkout clean at bf527c1e)

```text
S3-retarget-junction                          FAIL    S3: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b
S4-issue-one-query                            FAIL    S4: no tile-stream-mint-refused line with engine.source_changed in the session log since the baseline (line 34); the pre-check did not refuse the query
S5a-status                                    FAIL    S5a: no .canvas-session-ended block in the status stack; stack text was ""
S5b-residency-cleared                         FAIL    S5b: resident vertices are 417707 (features 22124), expected 0 -- the owner did not clear what it was showing
S5c-picks-refused                             FAIL    S5c: hovering the formerly-occupied pixel (352.5, 204.5) produced NO readout at all; silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids
R1-failed-reopen-does-not-clear               FAIL    R1: a FAILED reopen cleared .canvas-session-ended; it must survive a refused admission
R4-second-source-change-ends-the-new-session  FAIL    R4: no tile-stream-mint-refused line with engine.source_changed {"detail":"{mtime}"} since R4's baseline (line 238); the pre-check did not refuse the query
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M3 (reopen, W-M3 applied alone, reverted, the checkout clean at bf527c1e)

```text
R4-second-source-change-ends-the-new-session  FAIL    R4: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a
1792431744849 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431744857 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431744857 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431744858 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M4 (reopen, W-M4 applied alone, reverted, the checkout clean at bf527c1e)

```text
R4-second-source-change-ends-the-new-session  FAIL    R4: .canvas-session-ended appeared while the app was idle after the repoint, before any gesture
the advisory source watcher signalled observed-change
1792431800135 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431800138 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431800138 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431800139 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431822684 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M5 (reopen, W-M5 applied alone, reverted, the checkout clean at bf527c1e)

```text
R4-second-source-change-ends-the-new-session  FAIL    R4: no tile-stream-mint-refused line with engine.source_changed {"detail":"{mtime}"} since R4's baseline (line 209); the pre-check did not refuse the query
1792431856618 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431856622 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431856622 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431856622 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431882519 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431882520 tile-stream-mint-refused 3:19: engine.source_changed {"detail":"{mtime}"}
1792431882521 tile-stream-mint-refused 3:18: engine.source_changed {"detail":"{mtime}"}
1792431882522 tile-stream-mint-refused 3:17: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M6 (post, W-M6 applied alone, reverted, the checkout clean at bf527c1e)

```text
S4-issue-one-query-and-retarget-on-mint  FAIL    S4: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b
S5a-status                               FAIL    S5a: no .canvas-session-ended block in the status stack; stack text was ""
S5b-residency-cleared                    FAIL    S5b: resident vertices are 381076 (features 20163), expected 0 -- the owner did not clear what it was showing
S5c-picks-refused                        FAIL    S5c: hovering the formerly-occupied pixel (352.5, 204.5) produced NO readout at all; silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids
S5d-post-check-route-confirmed           FAIL    S5d: no "tile-session-ended-source-changed" line appeared in the session log after this run's own baseline (line 31) -- the terminal route never fired
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```

### W-M7 (reopen, W-M7 applied alone, reverted, the checkout clean at bf527c1e)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected S2's readout from before the change, {"className":"hover-readout","text":"id 0"}
1792431965897 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431965901 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792431965901 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792431965902 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792431991419 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792431991435 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792431991436 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
1792431991436 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
source-changed: repoint helper PID <n> exited (code 0) after its stdin closed (end of main)
```
