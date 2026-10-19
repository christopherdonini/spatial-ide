# source-changed-post-reopen-routes-watcher-visible: the custodian's runs at the head (the form's §4)

*The custodian's record (2026-10-18), under `frontends/shell/SOURCE-CHANGED-POST-REOPEN-ROUTES-WATCHER-VISIBLE-PREREGISTRATION.md` (with Amendment 1). Built by script from each run's artifacts: the suite log, the report JSON, the session log the report names, and the app's stderr capture, each copied whole into the custodian's scratch folder right after its run. Every quoted line is byte-copied whole, with CR removed. Ordering evidence only: no gap and no duration is reported (ADR-018).*

## Setup

- **Head:** aa30f99f0cccc29a3df190e170d76b0eee40c5c6 (branch `cut/source-changed-watcher-visible`, base 71d16a1170c6f44ec96b3692b416278df8d00f8c), in the custodian's e2e checkout `C:/dev/wt/mm2b-e2e`, detached there, clean at the start and at the end.
- **The exe:** `D:/wt-targets/mm2b-e2e/exes/spatial-ide-shell-s5d-base-be6aa620.exe`, sha256 f3fdf25a795ce05d8bd135759d8b62add7520a3e48b86ad3cc4f103ea0a8c31f, built at be6aa6203a196f553ec08f697d678dfa08a78bd4. The series checked by git that nothing under `frontends/shell/src-tauri`, `frontends/shell/src`, `kernel`, `engine/src` or `protocol` differs between that commit and the head.
- **Harness:** port 5180 is still in Windows' excluded range, so the runs use the port-5400 harness on its approval's terms. Each run launches a fresh app and sets `SPATIAL_E2E_SOURCE_CHANGED_ROUTE`.
- **The hold:** one exclusive hold for all 17 runs. A first request declared 35 minutes and was refused before any run, since an exclusive run over 30 minutes needs a booking; the series was asked again at 30 minutes, its estimate being about 16. This project's lines of the script's output, byte-copied:

```text
MACHINE_ERROR NOT_BOOKED an exclusive run over 30 minutes needs a booking of its project that covers now
MACHINE_NOT_HELD project=SpatialIDE shell=bash.exe:23236: no live hold of this shell, nothing done
MACHINE_QUEUED exclusive project=SpatialIDE: waiting to be first, for no other heavy run, 120 s since the last one, and 60 one-second samples averaging under 10% with at most 5 over 25%
MACHINE_WAITING exclusive: quiet=False average=1.8% peaks-over-25=0 samples=5 others=none since-last-end=58237s because: samples 5/60
MACHINE_QUIET quiet=True average=3.4% peaks-over-25=0 samples=60 others=none since-last-end=58295s
MACHINE_HOLD exclusive project=SpatialIDE cores=all affinity=FFFF shell=bash.exe:17444 also=bash.exe:19964 (commands started from now on inherit it; release when done)
MACHINE_RELEASED project=SpatialIDE shell=bash.exe:17444 affinity=FF (cores 0-7)
```

- **The series:** 2026-10-18T12:36:27.556Z to 2026-10-18T12:49:24.844Z, by its summary.

## The runs

| Run | Route | rc | Steps passed | Steps failed | W lines | P lines | H3 |
|---|---|---|---|---|---|---|---|
| pre1 | pre | 0 | 8 | none | 0 | 0 | n/a |
| reopen1 | reopen | 1 | 11 | R2-successful-reopen-clears-and-identifies | 0 | 0 | n/a |
| reopen2 | reopen | 1 | 11 | R2-successful-reopen-clears-and-identifies | 0 | 0 | n/a |
| reopen3 | reopen | 1 | 11 | R2-successful-reopen-clears-and-identifies | 0 | 0 | n/a |
| post1 | post | 0 | 8 | none | 0 | 3 | no earlier |
| post2 | post | 0 | 8 | none | 0 | 3 | no earlier |
| post3 | post | 0 | 8 | none | 0 | 3 | no earlier |
| post4 | post | 0 | 8 | none | 0 | 3 | no earlier |
| post5 | post | 0 | 8 | none | 0 | 3 | no earlier |
| post6 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| post7 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| post8 | post | 1 | 7 | S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| W-M1 | post | 1 | 6 | S4-issue-one-query-and-retarget-on-mint, S5d-post-check-route-confirmed | 0 | 0 | no earlier |
| W-M2 | reopen | 1 | 4 | S3-retarget-junction, S4-issue-one-query, S5a-status, S5b-residency-cleared, S5c-picks-refused, R1-failed-reopen-does-not-clear, R2-successful-reopen-clears-and-identifies, R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |
| W-M3 | reopen | 1 | 10 | R2-successful-reopen-clears-and-identifies, R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |
| W-M4 | reopen | 1 | 10 | R2-successful-reopen-clears-and-identifies, R4-second-source-change-ends-the-new-session | 1 | 0 | n/a |
| W-M5 | reopen | 1 | 10 | R2-successful-reopen-clears-and-identifies, R4-second-source-change-ends-the-new-session | 0 | 0 | n/a |

W: the stderr capture's lines naming the advisory source watcher's signal. P: its post-check lines (`post_check_bytes=`). H3: the junction's creation time, read by `lstatSync` after the run, against the receive time of the first new `stream-issued` entry the S4 ladder raced.

## Against the form

- **P1** (E-pre, every step passes): held, 1 of 1.
- **P2** (E-reopen, every step passes in 3 of 3): **did not hold.** R2 failed in 3 of 3; every other step passed in 3 of 3, R4's idle check and its `{mtime}` line among them. In each run R2's readout at the formerly-occupied pixel, after S2's two notches, is the readout S2 recorded there before the change, the below-pick-resolution refusal (the reports' `readoutBefore` and `r2ReadoutAfterNotches`); R2 expects an id. A wrong prediction is a result (class 2).
- **P3** (E-post): S1 to S5c passed in 8 of 8; no capture holds a watcher line (8 of 8); S5d passed in 5 of 8, each with P lines.
- **P4** (no refusal and no P line carries the detail that the source could not be re-read): **did not hold.** The detail is in 6 runs: post1, post3, post6, post7, post8, W-M1.
- **P5** (W-M1 to W-M5 each fail by the message §4 names): held; the failing lines are quoted below, each mutation applied alone and reverted, the checkout clean after each.
- **P6** (H3, 8 of 8): held, no earlier in 8 of 8.
- **I2 fired** (H2's re-read detail, anywhere): H2 is observed. Every other invalidator: I1 no (no watcher line in any unmutated run; W-M4's one line is that mutation's own mtime touch), I3 no, I4 no, I5 no (R2's failure is the driver's expectation, its readout unchanged by the reopen), I6 no.
- **The piece stops here and goes to the human,** by §5. Nothing is worked around; no gate is asked.

## Lines, byte-copied

For each run: its failing step lines, its W and P lines, and every session-log line since the run's baseline naming `tile-session-ended-source-changed` or `tile-stream-mint-refused`.

### pre1 (pre)

```text
1792327015840 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327015843 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327015843 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327015844 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
```

### reopen1 (reopen)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
1792327048456 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327048460 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327048460 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792327048461 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327073992 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327073995 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792327073995 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
1792327073995 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
```

### reopen2 (reopen)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
1792327107768 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327107778 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327107778 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327107779 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792327133241 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327133244 tile-stream-mint-refused 3:18: engine.source_changed {"detail":"{mtime}"}
1792327133245 tile-stream-mint-refused 3:19: engine.source_changed {"detail":"{mtime}"}
1792327133245 tile-stream-mint-refused 3:17: engine.source_changed {"detail":"{mtime}"}
```

### reopen3 (reopen)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
1792327167428 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327167431 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327167432 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327167432 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792327192822 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327192825 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
1792327192825 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{this dataset's session ended when its source was observed to have changed}"}
1792327192825 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{mtime}"}
```

### post1 (post)

```text
session ended for dataset `ds_18ae7b1a2af8f3403a4ae7af881de701`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 0 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_18ae7b1a2af8f3403a4ae7af881de701`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 0 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_18ae7b1a2af8f3403a4ae7af881de701`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 19 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792327227530 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### post2 (post)

```text
session ended for dataset `ds_7cb72f125ecc8f236934b16fe16d2757`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_7cb72f125ecc8f236934b16fe16d2757`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_7cb72f125ecc8f236934b16fe16d2757`: the source changed during use ({mtime}); 19 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792327260761 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### post3 (post)

```text
session ended for dataset `ds_e1da5b09813a429b9b6ebf31ac80ced2`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 0 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_e1da5b09813a429b9b6ebf31ac80ced2`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 0 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_e1da5b09813a429b9b6ebf31ac80ced2`: the source changed during use ({the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}); 20 in-flight stream(s) cancelled; post_check_bytes=0 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792327293522 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### post4 (post)

```text
session ended for dataset `ds_ee763b3b33ef34b9350e621f82663ed4`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_ee763b3b33ef34b9350e621f82663ed4`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_ee763b3b33ef34b9350e621f82663ed4`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792327325901 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### post5 (post)

```text
session ended for dataset `ds_7bb8286105774494b838335e1a4eb661`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_7bb8286105774494b838335e1a4eb661`: the source changed during use ({mtime}); 0 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
session ended for dataset `ds_7bb8286105774494b838335e1a4eb661`: the source changed during use ({mtime}); 20 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)
1792327358367 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### post6 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":8,"mintRefused":["1792327390789 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}\"}"],"sessionEnded":["1792327390775 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
1792327390775 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327390789 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}"}
```

### post7 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":8,"mintRefused":["1792327422922 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}\"}"],"sessionEnded":["1792327422910 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
1792327422910 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327422922 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}"}
```

### post8 (post)

```text
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":8,"mintRefused":["1792327454892 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}\"}"],"sessionEnded":["1792327454878 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
1792327454878 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327454892 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}"}
```

### W-M1 (post, W-M1 applied alone, reverted, the checkout clean at aa30f99f)

```text
S4-issue-one-query-and-retarget-on-mint  FAIL    S4: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b
S5d-post-check-route-confirmed           FAIL    S5d: a "tile-stream-mint-refused" line appeared after this run's own baseline -- this run's change lost the race to a tile's PRE-check rather than landing on the POST-check route (see this file's header note on what this does and does not guarantee). Not a silent pass: this is exactly the route this assertion exists to distinguish. Evidence: {"sessionLogBaselineLineCount":31,"newLineCount":8,"mintRefused":["1792327487072 tile-stream-mint-refused 7:14: engine.source_changed {\"detail\":\"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}\"}"],"sessionEnded":["1792327487057 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)"]}
1792327487057 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327487072 tile-stream-mint-refused 7:14: engine.source_changed {"detail":"{the source could not be re-read: source: descriptor metadata: The system cannot find the path specified. (os error 3)}"}
```

### W-M2 (reopen, W-M2 applied alone, reverted, the checkout clean at aa30f99f)

```text
S3-retarget-junction                          FAIL    S3: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b
S4-issue-one-query                            FAIL    S4: no tile-stream-mint-refused line with engine.source_changed in the session log since the baseline (line 31); the pre-check did not refuse the query
S5a-status                                    FAIL    S5a: no .canvas-session-ended block in the status stack; stack text was ""
S5b-residency-cleared                         FAIL    S5b: resident vertices are 381076 (features 20163), expected 0 -- the owner did not clear what it was showing
S5c-picks-refused                             FAIL    S5c: hovering the formerly-occupied pixel (352.5, 204.5) produced NO readout at all; silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids
R1-failed-reopen-does-not-clear               FAIL    R1: a FAILED reopen cleared .canvas-session-ended; it must survive a refused admission
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
R4-second-source-change-ends-the-new-session  FAIL    R4: no tile-stream-mint-refused line with engine.source_changed {"detail":"{mtime}"} since R4's baseline (line 226); the pre-check did not refuse the query
```

### W-M3 (reopen, W-M3 applied alone, reverted, the checkout clean at aa30f99f)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
R4-second-source-change-ends-the-new-session  FAIL    R4: the opened path resolves to C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\b\source-changed-scratch.parquet, not inside C:\dev\wt\mm2b-e2e\frontends\shell\e2e\out\source-changed-targets\a
1792327607932 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327607935 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327607936 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327607936 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
```

### W-M4 (reopen, W-M4 applied alone, reverted, the checkout clean at aa30f99f)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
R4-second-source-change-ends-the-new-session  FAIL    R4: .canvas-session-ended appeared while the app was idle after the repoint, before any gesture
the advisory source watcher signalled observed-change
1792327662477 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327662480 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327662481 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792327662481 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327685381 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
```

### W-M5 (reopen, W-M5 applied alone, reverted, the checkout clean at aa30f99f)

```text
R2-successful-reopen-clears-and-identifies    FAIL    R2: after reproducing S2's 2 zoom-in notch(es) around the canvas centre, hover at the formerly-occupied pixel is {"className":"hover-readout hover-readout-below-resolution","text":"Features here are below pick resolution — zoom in to inspect them."}, expected an "id <number>" readout (ordinary identification)
R4-second-source-change-ends-the-new-session  FAIL    R4: no tile-stream-mint-refused line with engine.source_changed {"detail":"{mtime}"} since R4's baseline (line 209); the pre-check did not refuse the query
1792327718156 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327718160 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}
1792327718160 tile-stream-mint-refused 6:13: engine.source_changed {"detail":"{mtime}"}
1792327718160 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}
1792327743388 warn tile-session-ended-source-changed: engine.source_changed: [P6 placeholder] the advisory source watcher ended this dataset's session (observed-change)
1792327743391 tile-stream-mint-refused 3:15: engine.source_changed {"detail":"{mtime}"}
1792327743403 tile-stream-mint-refused 3:16: engine.source_changed {"detail":"{this dataset's session ended when its source was observed to have changed}"}
1792327743405 tile-stream-mint-refused 3:14: engine.source_changed {"detail":"{mtime}"}
```
